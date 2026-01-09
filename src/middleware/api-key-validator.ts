/**
 * API Key Validation Middleware
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 * Standard: docs/standards/API_KEY_MANAGEMENT.md
 * 
 * Purpose:
 * - Extract and validate API keys from request headers
 * - Enforce scope-based access control
 * - Attach tenant context to ExecutionContext
 * - Fail-fast on invalid/expired/revoked keys
 * 
 * Security:
 * - API keys NEVER stored in plain text (SHA-256 hash only)
 * - Multi-tenant isolation enforced
 * - Timing-safe hash comparison (prevents timing attacks)
 * - Rate limits and cost limits checked
 */

import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface ApiKeyValidationResult {
    isValid: boolean;
    tenantId?: string;
    keyId?: string;
    scopes?: string[];
    allowedModels?: string[];
    allowedProviders?: string[];
    correlationId?: string;
    error?: string;
}

export interface ApiKeyMetadata {
    id: string;
    tenant_id: string;
    key_name: string;
    scopes: string[];
    allowed_models: string[];
    allowed_providers: string[];
    is_active: boolean;
    expires_at: string | null;
    rate_limit_per_minute: number;
    rate_limit_per_day: number;
    max_cost_per_day_cents: number | null;
    max_cost_per_month_cents: number | null;
    key_hash: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract API key from request headers
 * Supports: Authorization: Bearer <key> OR x-api-key: <key>
 */
export function extractApiKey(headers: Headers | Record<string, string>): string | null {
    // Try Authorization header first (Bearer token)
    const authHeader = typeof headers.get === 'function'
        ? headers.get('authorization')
        : headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7).trim();
    }

    // Try x-api-key header
    const apiKeyHeader = typeof headers.get === 'function'
        ? headers.get('x-api-key')
        : headers['x-api-key'];

    if (apiKeyHeader) {
        return apiKeyHeader.trim();
    }

    return null;
}

/**
 * Derive key prefix and hash from API key
 * Format: vito_{scope}_{random} => prefix: vito_{scope}_abc, hash: SHA-256
 */
export function deriveKeyComponents(apiKey: string): { prefix: string; hash: string } {
    // Prefix: first 16 characters (for display and fast lookup)
    const prefix = apiKey.substring(0, Math.min(16, apiKey.length));

    // Hash: SHA-256 (for secure storage and validation)
    const hash = createHash('sha256').update(apiKey).digest('hex');

    return { prefix, hash };
}

/**
 * Validate API key format
 * Expected format: vito_{scope}_{random_base64url}
 */
export function validateKeyFormat(apiKey: string): boolean {
    if (!apiKey || apiKey.length < 20) {
        return false;
    }

    // Must start with "vito_"
    if (!apiKey.startsWith('vito_')) {
        return false;
    }

    // Must contain at least 2 underscores (vito_{scope}_{random})
    const parts = apiKey.split('_');
    if (parts.length < 3) {
        return false;
    }

    return true;
}

/**
 * Check if API key is expired
 */
function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
}

/**
 * Check rate limits (Phase 2 - requires Redis)
 * Currently returns placeholder for Phase 1
 */
async function checkRateLimit(
    keyId: string,
    limitPerMinute: number
): Promise<{ allowed: boolean; remaining: number }> {
    // Phase 2: Implement with Redis sliding window counter
    // For now, always allow (Phase 1 - basic implementation)
    return { allowed: true, remaining: limitPerMinute };
}

/**
 * Check cost limits (daily budget enforcement)
 */
async function checkCostLimit(
    keyId: string,
    maxCostPerDay: number | null
): Promise<{ allowed: boolean; remaining: number }> {
    if (!maxCostPerDay) {
        return { allowed: true, remaining: -1 }; // No limit
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from('api_key_usage_logs')
        .select('cost_cents')
        .eq('api_key_id', keyId)
        .gte('recorded_at', today.toISOString());

    if (error) {
        console.error('[API Key Validator] Cost limit check failed:', error);
        return { allowed: false, remaining: 0 };
    }

    const totalCostToday = data?.reduce((sum, log) => sum + (log.cost_cents || 0), 0) || 0;
    const remaining = maxCostPerDay - totalCostToday;

    return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
    };
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validate API key with scope, provider, and model checks
 * 
 * @param apiKey - API key from request header
 * @param requiredScope - Required scope (e.g., "agents:financial", "voice:synthesis")
 * @param provider - Optional provider filter (e.g., "elevenlabs", "cartesia")
 * @param model - Optional model filter (e.g., "gpt-4o", "claude-3-opus")
 * @returns Validation result with tenant context or error
 */
export async function validateApiKey(
    apiKey: string,
    requiredScope: string,
    provider?: string,
    model?: string
): Promise<ApiKeyValidationResult> {
    // 1. Validate format (fail-fast)
    if (!validateKeyFormat(apiKey)) {
        return {
            isValid: false,
            error: 'Invalid API key format',
        };
    }

    // 2. Derive prefix and hash
    const { prefix, hash } = deriveKeyComponents(apiKey);

    // 3. Narrow candidates by prefix and status (NOT by hash - timing attack prevention)
    const { data: candidates, error: fetchError } = await supabase
        .from('tenant_api_keys')
        .select('id,tenant_id,key_name,key_hash,scopes,allowed_models,allowed_providers,is_active,expires_at,rate_limit_per_minute,rate_limit_per_day,max_cost_per_day_cents,max_cost_per_month_cents')
        .eq('key_prefix', prefix)
        .eq('is_active', true)
        .limit(50); // Prevent prefix collision DoS

    if (fetchError) {
        console.error('[API Key Validator] Database query failed:', {
            error: fetchError.message,
        });
        return {
            isValid: false,
            error: 'API key validation failed',
        };
    }

    if (!candidates || candidates.length === 0) {
        return {
            isValid: false,
            error: 'API key not found or inactive',
        };
    }

    // Guard: potential prefix collision flood. If we hit the query cap, treat as failure.
    // This prevents attackers from forcing worst-case comparisons and also flags misconfigured prefix length.
    if (candidates.length >= 50) {
        console.warn('[API Key Validator] Prefix collision limit reached', {
            // Do NOT log tenant_id or any key material. Prefix alone is low-sensitivity but still avoid if you prefer.
            prefix,
            count: candidates.length,
        });
        
        return {
            isValid: false,
            error: 'API key validation failed',
        };
    }
    
    // 4. Timing-safe hash comparison (prevent timing attacks)
    const providedHashBuffer = Buffer.from(hash, 'hex');

    let keyData: ApiKeyMetadata | null = null;
    for (const candidate of candidates) {
        // Validate hash format (must be 64 hex chars for SHA-256)
        if (!candidate.key_hash || !/^[a-f0-9]{64}$/i.test(candidate.key_hash)) {
            console.warn('[API Key Validator] Invalid stored key hash format');
            continue; // Skip invalid hash
        }

        const storedHashBuffer = Buffer.from(candidate.key_hash, 'hex');

        // Check length equality first (fast path)
        if (storedHashBuffer.length !== providedHashBuffer.length) {
            continue;
        }

        // Timing-safe comparison
        if (timingSafeEqual(storedHashBuffer, providedHashBuffer)) {
            keyData = candidate as unknown as ApiKeyMetadata;
            break;
        }
    }

    if (!keyData) {
        return {
            isValid: false,
            error: 'API key not found or inactive',
        };
    }

    const keyMetadata = keyData;

    // 5. Check expiration
    if (isExpired(keyMetadata.expires_at)) {
        return {
            isValid: false,
            error: 'API key expired',
        };
    }

    // 6. Check scope
    if (!keyMetadata.scopes.includes(requiredScope)) {
        return {
            isValid: false,
            error: `Insufficient scope. Required: ${requiredScope}`,
        };
    }

    // 7. Check provider (if specified)
    if (provider && keyMetadata.allowed_providers.length > 0) {
        if (!keyMetadata.allowed_providers.includes(provider)) {
            return {
                isValid: false,
                error: `Provider not allowed: ${provider}`,
            };
        }
    }

    // 8. Check model (if specified)
    if (model && keyMetadata.allowed_models.length > 0) {
        if (!keyMetadata.allowed_models.includes(model)) {
            return {
                isValid: false,
                error: `Model not allowed: ${model}`,
            };
        }
    }

    // 9. Check rate limits (Phase 2)
    const rateLimitCheck = await checkRateLimit(
        keyMetadata.id,
        keyMetadata.rate_limit_per_minute
    );

    if (!rateLimitCheck.allowed) {
        return {
            isValid: false,
            error: 'Rate limit exceeded',
        };
    }

    // 10. Check cost limits (budget-based)
    const costLimitCheck = await checkCostLimit(
        keyMetadata.id,
        keyMetadata.max_cost_per_day_cents
    );

    if (!costLimitCheck.allowed) {
        return {
            isValid: false,
            error: 'Daily cost limit exceeded',
        };
    }

    // 11. Update last_used_at (async, don't wait)
    supabase
        .from('tenant_api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyMetadata.id)
        .then(() => { })
        .catch((err) => console.error('[API Key Validator] Failed to update last_used_at:', err));

    // 12. Generate correlation ID (for tracing)
    const correlationId = crypto.randomUUID();

    // 13. Return success
    return {
        isValid: true,
        tenantId: keyMetadata.tenant_id,
        keyId: keyMetadata.id,
        scopes: keyMetadata.scopes,
        allowedModels: keyMetadata.allowed_models,
        allowedProviders: keyMetadata.allowed_providers,
        correlationId,
    };
}

