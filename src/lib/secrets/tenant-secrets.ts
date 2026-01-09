/**
 * Tenant Secrets Management
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 * Standard: docs/standards/API_KEY_MANAGEMENT.md
 * 
 * Purpose:
 * - Retrieve encrypted third-party API keys (BYOK - Bring Your Own Key)
 * - Enforce scope-based access control for secrets
 * - Integrate with Supabase Vault for encryption at rest
 * 
 * Security:
 * - Secrets NEVER logged or exposed in errors
 * - Scope validation enforced
 * - Fail-fast on missing or unauthorized secrets
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface TenantSecretMetadata {
    id: string;
    tenant_id: string;
    secret_name: string;
    provider: string;
    secret_vault_id: string;
    allowed_scopes: string[];
    is_active: boolean;
    expires_at: string | null;
}

export interface GetSecretOptions {
    tenantId: string;
    provider: string;
    requiredScope: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Get tenant secret (decrypted) for a specific provider and scope
 * 
 * @param options - Tenant ID, provider, and required scope
 * @returns Decrypted secret or null if not found/unauthorized
 * @throws Error if scope not authorized or secret retrieval fails
 */
export async function getTenantSecret(
    options: GetSecretOptions
): Promise<string | null> {
    const { tenantId, provider, requiredScope } = options;

    // 1. Fetch secret metadata (NOT the secret itself yet)
    const { data: secretMeta, error: fetchError } = await supabase
        .from('tenant_secrets')
        .select('id, secret_vault_id, allowed_scopes, is_active, expires_at')
        .eq('tenant_id', tenantId)
        .eq('provider', provider)
        .eq('is_active', true)
        .single();

    if (fetchError || !secretMeta) {
        // Fail-fast: No secret found for this provider
        return null;
    }

    // 2. Check expiration
    if (secretMeta.expires_at && new Date(secretMeta.expires_at) < new Date()) {
        throw new Error(`Secret expired for provider: ${provider}`);
    }

    // 3. Check scope authorization
    const scopes = secretMeta.allowed_scopes as string[];
    if (!scopes.includes(requiredScope)) {
        throw new Error(
            `Secret not authorized for scope: ${requiredScope}. Allowed scopes: ${scopes.join(', ')}`
        );
    }

    // 4. Retrieve decrypted secret from Supabase Vault
    try {
        const { data: vaultData, error: vaultError } = await supabase.rpc('vault_get_secret', {
            secret_id: secretMeta.secret_vault_id,
        });

        if (vaultError) {
            console.error('[Tenant Secrets] Vault retrieval failed:', {
                tenantId,
                provider,
                error: vaultError.message, // DO NOT log secret
            });
            throw new Error('Failed to retrieve secret from vault');
        }

        if (!vaultData || !vaultData.decrypted_secret) {
            console.error('[Tenant Secrets] Vault returned empty secret:', {
                tenantId,
                provider,
            });
            return null;
        }

        // 5. Update last_used_at (async, don't wait)
        supabase
            .from('tenant_secrets')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', secretMeta.id)
            .then(() => { })
            .catch((err) => console.error('[Tenant Secrets] Failed to update last_used_at:', err));

        // 6. Return decrypted secret
        return vaultData.decrypted_secret as string;
    } catch (error) {
        console.error('[Tenant Secrets] Unexpected error:', {
            tenantId,
            provider,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new Error('Secret retrieval failed');
    }
}

/**
 * Check if tenant has a secret for a specific provider
 * (Does NOT retrieve the secret, just checks existence)
 * 
 * @param tenantId - Tenant ID
 * @param provider - Provider name (e.g., "openai", "elevenlabs")
 * @returns True if secret exists and is active
 */
export async function hasSecret(tenantId: string, provider: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('tenant_secrets')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('provider', provider)
        .eq('is_active', true)
        .single();

    return !error && !!data;
}

/**
 * List all providers for which tenant has secrets
 * (Does NOT retrieve secrets, just metadata)
 * 
 * @param tenantId - Tenant ID
 * @returns Array of provider names
 */
export async function listProviders(tenantId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('tenant_secrets')
        .select('provider')
        .eq('tenant_id', tenantId)
        .eq('is_active', true);

    if (error || !data) {
        return [];
    }

    return data.map((row) => row.provider);
}
