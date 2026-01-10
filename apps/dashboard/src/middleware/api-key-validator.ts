import { createHash } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ApiKeyValidationResult, IApiKey } from '@/types/api-keys';

// ------------------------------------------------------------------
// LAZY & SAFE INITIALIZATION
// ------------------------------------------------------------------

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
    if (supabaseAdmin) return supabaseAdmin;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('❌ Missing Supabase Admin Credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY). This validator must run server-side only.');
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });

    return supabaseAdmin;
}

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

    // Initialize Client Safely
    let admin: SupabaseClient;
    try {
        admin = getSupabaseAdmin();
    } catch (err: unknown) {
        console.error('Validator Init Error:', err);
        return { isValid: false, error: 'Internal Validator Configuration Error' };
    }

    // 1. Hash the incoming key
    // Format assumption: key is raw, hash is sha256
    const keyHash = createHash('sha256').update(apiKey).digest('hex');

    // 2. Fetch Key Data
    const { data: keyData, error } = await admin
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
    const costLimitOk = await checkCostLimit(admin, key.id, key.max_cost_per_day_cents);
    if (!costLimitOk) {
        return { isValid: false, error: 'Daily cost limit exceeded' };
    }

    // 8. Update Access Time (Async & Safe)
    admin.from('tenant_api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', key.id)
        .then(({ error: updateError }) => {
            if (updateError) console.warn(`⚠️ Failed to update last_used_at for key ${key.id}:`, updateError.message);
        })
        .catch(err => console.error('❌ Update last_used_at exception:', err));

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
async function checkCostLimit(admin: SupabaseClient, keyId: string, maxCostPerDay?: number | null): Promise<boolean> {
    if (!maxCostPerDay) return true;

    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Try Safe RPC first
    const { data, error } = await admin.rpc('get_daily_key_cost', {
        query_key_id: keyId,
        query_date: todayStr
    });

    // If RPC missing, sum manually (slower but fallback)
    if (error) {
        const { data: usageData } = await admin
            .from('api_key_usage_logs')
            .select('cost_cents')
            .eq('api_key_id', keyId)
            .gte('recorded_at', `${todayStr}T00:00:00Z`);

        const total = usageData?.reduce((sum, row) => {
            const cost = typeof row.cost_cents === 'number' && !isNaN(row.cost_cents) ? row.cost_cents : 0;
            return sum + cost;
        }, 0) || 0;

        return total < maxCostPerDay;
    }

    const costValue = (typeof data === 'number' && !isNaN(data)) ? data : 0;
    return costValue < maxCostPerDay;
}
