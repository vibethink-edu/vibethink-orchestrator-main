export interface IApiKey {
    id: string;
    tenant_id: string;
    key_name: string;
    key_hash: string;
    key_prefix: string;
    scopes: string[];
    allowed_models: string[];
    allowed_providers: string[];
    rate_limit_per_minute: number;
    rate_limit_per_day: number;
    max_cost_per_day_cents: number | null;
    max_cost_per_month_cents: number | null;
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    last_used_at: string | null;
}

export interface ITenantSecret {
    id: string;
    tenant_id: string;
    secret_name: string;
    provider: string; // "openai", "elevenlabs", etc.
    secret_vault_id: string;
    allowed_scopes: string[];
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface IUsageLog {
    id: string;
    tenant_id: string;
    api_key_id: string;
    scope: string;
    operation_type: string;
    provider: string;
    model_used?: string;
    tenant_secret_id?: string;
    tokens_input: number;
    tokens_output: number;
    duration_ms?: number;
    characters_processed?: number;
    cost_cents: number;
    currency: string;
    correlation_id: string;
    user_id?: string;
    metadata?: Record<string, any>;
    recorded_at: string;
}

export interface ApiKeyValidationResult {
    isValid: boolean;
    tenantId?: string;
    keyId?: string;
    scopes?: string[];
    allowedModels?: string[];
    allowedProviders?: string[];
    error?: string;
}
