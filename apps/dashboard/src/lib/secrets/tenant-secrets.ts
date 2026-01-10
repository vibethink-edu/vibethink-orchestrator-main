import { createClient } from '@supabase/supabase-js';
import type { ITenantSecret } from '@/types/api-keys';

// Server-side only Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// service_role key required for Vault access and strict RLS bypass if needed
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    // Warn but don't crash dev if envs missing, but this will fail in prod
    console.warn('⚠️ Missing Supabase env variables for Tenant Secrets');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

/**
 * Retrieves a decrypted secret for a tenant by provider and scope.
 * 
 * @param tenantId - The tenant's ID
 * @param provider - The secret provider (e.g. 'openai')
 * @param requiredScope - The specific scope required (e.g. 'agents:financial')
 * @returns The decrypted secret string or null if not found/unauthorized
 */
export async function getTenantSecret(
    tenantId: string,
    provider: string,
    requiredScope: string
): Promise<string | null> {
    // 1. Fetch secret metadata to verify existence and scope
    const { data: secretMeta, error } = await supabase
        .from('tenant_secrets')
        .select('secret_vault_id, allowed_scopes')
        .eq('tenant_id', tenantId)
        .eq('provider', provider)
        .eq('is_active', true)
        .single();

    if (error || !secretMeta) {
        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching secret metadata:', error);
        }
        return null;
    }

    // 2. Check scope authorization
    const scopes = secretMeta.allowed_scopes as string[];
    if (!scopes.includes(requiredScope)) {
        console.warn(`Secret ${provider} for tenant ${tenantId} not authorized for scope: ${requiredScope}`);
        return null;
    }

    // 3. Retrieve decrypted secret from Supabase Vault
    // Note: 'vault_get_secret' is likely a custom RPC wrapper or direct call if Vault extensions allows
    // If native Supabase Vault is used, we select from vault.decrypted_secrets directly via RPC or View
    // Assuming a standard RPC `get_decrypted_secret` exists or we construct a query.
    // Standard Vault usage usually involves `select decrypted_secret from vault.decrypted_secrets where id = ...`
    // But that requires permissions. Service role has them.

    const { data: vaultData, error: vaultError } = await supabase
        .rpc('get_decrypted_secret', { secret_uuid: secretMeta.secret_vault_id });

    if (vaultError) {
        // Fallback: Try selecting directly if RPC missing (requires view access)
        // This part depends on how the DB Vaul is exposed.
        console.error('Error decrypting secret:', vaultError);
        return null;
    }

    return vaultData || null; // RPC usually returns the scalar text
}
