import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { ApiKeyValidationResult, IApiKey } from '@/types/api-keys';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Validates an API key against the database checks:
 * - Existence and Hash matching
 * - Expiration
 * - Scope
 * - Provider and Model whitelisting
 * - Cost Limits (Daily)
 * 
 * Note: Rate limiting (per minute) is skipped in Phase 1 (requires Redis).
 */
export async function validateApiKey(
    apiKey: string,
    requiredScope: string,
    provider?: string,
    model?: string
): Promise<ApiKeyValidationResult> {
    if (!apiKey) return { isValid: false, error: 'Missing API Key' };

    // 1. Hash the incoming key
    // Format assumption: key is raw, hash is sha256
    const keyHash = createHash('sha256').update(apiKey).digest('hex');

    // 2. Fetch Key Data
    const { data: keyData, error } = await supabase
        .from('tenant_api_keys')
        .select('*')
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .single();

    if (error || !keyData) {
        // Timing safe comparison not strictly needed if we assume lookup failure = invalid
        // but good practice to handle errors uniformly.
        return { isValid: false, error: 'Invalid API Key' };
    }

    const key = keyData as IApiKey;

    // 3. Check Expiration
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
        return { isValid: false, error: 'API Key Expired' };
    }

    // 4. Check Scope
    if (!key.scopes.includes(requiredScope)) {
        return { isValid: false, error: `Scope '${requiredScope}' not authorized for this key` };
    }

    // 5. Check Provider (if specified)
    if (provider && key.allowed_providers?.length > 0) {
        if (!key.allowed_providers.includes(provider)) {
            return { isValid: false, error: `Provider '${provider}' not allowed` };
        }
    }

    // 6. Check Model (if specified)
    if (model && key.allowed_models?.length > 0) {
        if (!key.allowed_models.includes(model)) {
            return { isValid: false, error: `Model '${model}' not allowed` };
        }
    }

    // 7. Check Cost Limits (Phase 1: DB Query)
    const costLimitOk = await checkCostLimit(key.id, key.max_cost_per_day_cents);
    if (!costLimitOk) {
        return { isValid: false, error: 'Daily cost limit exceeded' };
    }

    // 8. Update Access Time (Async)
    supabase.from('tenant_api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', key.id)
        .then(() => { });

    return {
        isValid: true,
        tenantId: key.tenant_id,
        keyId: key.id,
        scopes: key.scopes,
        allowedModels: key.allowed_models,
        allowedProviders: key.allowed_providers
    };
}

// Check if daily cost limit is reached
async function checkCostLimit(keyId: string, maxCostPerDay?: number | null): Promise<boolean> {
    if (!maxCostPerDay) return true;

    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // OPTIMIZATION: Check daily aggregation table first if implemented, otherwise sum usage
    // For Phase 1, we defined 'api_key_usage_logs', let's aggregate that or usage_daily if available.
    // The migration included 'api_key_usage_daily', let's use it for efficiency if populated.
    // If usage_daily is populated via Async Worker or Trigger, we query it. 
    // For this "Foundation" implementation, summing logs is safer until the aggregator is confirmed running.

    const { data, error } = await supabase.rpc('get_daily_key_cost', {
        query_key_id: keyId,
        query_date: todayStr
    });

    // If RPC missing, sum manually (slower but fallback)
    if (error) {
        const { data: usageData } = await supabase
            .from('api_key_usage_logs')
            .select('cost_cents')
            .eq('api_key_id', keyId)
            .gte('recorded_at', `${todayStr}T00:00:00Z`);

        const total = usageData?.reduce((sum, row) => sum + row.cost_cents, 0) || 0;
        return total < maxCostPerDay;
    }

    const costValue = typeof data === 'number' ? data : 0;
    return costValue < maxCostPerDay;
}
