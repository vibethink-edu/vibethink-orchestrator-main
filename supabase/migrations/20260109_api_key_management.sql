-- API Key & Secrets Management - Database Schema
-- Version: 1.0.0
-- Date: 2026-01-09
-- FIT: FIT-API-KEY-MGMT-001-Phase-1
-- 
-- CRITICAL:
-- - Multi-tenant isolation enforced (tenant_id + RLS)
-- - Follows DB_NAMING_AND_RULES.md (SEALED)
-- - API keys NEVER stored in plain text (SHA-256 hash only)
-- - Secrets encrypted via Supabase Vault
-- - Audit fields standard

-- ============================================================================
-- HELPER FUNCTION: update_updated_at_column
-- Purpose: Auto-update updated_at timestamp
-- Note: Reuse if already exists, otherwise create
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END $$;

-- ============================================================================
-- TABLE: tenant_api_keys
-- Purpose: Platform-issued API keys with granular scopes
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_api_keys (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- API Key Identity
  key_name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE, -- SHA-256 hash (NEVER store plain text)
  key_prefix VARCHAR(20) NOT NULL, -- First 16 chars for display (e.g., "vito_fin_abc123")
  
  -- Scope & Permissions (JSONB for flexibility)
  scopes JSONB NOT NULL DEFAULT '[]', 
  -- Examples: ["agents:financial", "voice:synthesis", "document:ocr"]
  
  allowed_models JSONB DEFAULT '[]',
  -- Examples: ["claude-3-opus", "gpt-4o", "gemini-pro"]
  
  allowed_providers JSONB DEFAULT '[]',
  -- Examples: ["elevenlabs", "cartesia", "agno"]
  
  -- Rate Limits (enforced in middleware)
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Cost Controls (cents)
  max_cost_per_day_cents INTEGER,
  max_cost_per_month_cents INTEGER,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  
  -- Audit Fields (Standard)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID, -- Optional: references identity_users(id) if exists
  last_used_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ, -- Soft delete
  
  -- Constraints
  CONSTRAINT uq_tenant_key_name UNIQUE (tenant_id, key_name),
  CONSTRAINT ck_api_keys_rate_limits CHECK (
    rate_limit_per_minute > 0 AND rate_limit_per_day > 0
  )
);

-- Indexes (Performance + Security)
CREATE INDEX idx_api_keys_tenant ON tenant_api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON tenant_api_keys(key_hash); -- Fast lookup
CREATE INDEX idx_api_keys_prefix ON tenant_api_keys(key_prefix); -- Fast prefix search
CREATE INDEX idx_api_keys_active ON tenant_api_keys(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_api_keys_expires ON tenant_api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Row-Level Security (MANDATORY)
ALTER TABLE tenant_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON tenant_api_keys
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Trigger: updated_at
CREATE TRIGGER trg_api_keys_updated_at
  BEFORE UPDATE ON tenant_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: tenant_secrets
-- Purpose: Encrypted third-party API keys (BYOK - Bring Your Own Key)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_secrets (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Secret Identity
  secret_name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- "openai", "elevenlabs", "cartesia", "agno"
  
  -- Encrypted Secret (Supabase Vault Reference)
  secret_vault_id UUID NOT NULL, -- Reference to vault.secrets (encrypted at rest)
  
  -- Scope (what this secret can be used for)
  allowed_scopes JSONB NOT NULL DEFAULT '[]',
  -- Examples: ["agents:orchestration", "agents:financial"]
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  
  -- Audit Fields (Standard)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID, -- Optional: references identity_users(id) if exists
  last_used_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ, -- Soft delete
  
  -- Constraints
  CONSTRAINT uq_tenant_secret_name UNIQUE (tenant_id, secret_name)
);

-- Indexes
CREATE INDEX idx_secrets_tenant ON tenant_secrets(tenant_id);
CREATE INDEX idx_secrets_provider ON tenant_secrets(provider);
CREATE INDEX idx_secrets_active ON tenant_secrets(is_active) WHERE is_active = TRUE;

-- Row-Level Security (MANDATORY)
ALTER TABLE tenant_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON tenant_secrets
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Trigger: updated_at
CREATE TRIGGER trg_secrets_updated_at
  BEFORE UPDATE ON tenant_secrets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: api_key_usage_logs
-- Purpose: Granular usage tracking for billing and analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_key_usage_logs (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_id UUID NOT NULL REFERENCES tenant_api_keys(id) ON DELETE CASCADE,
  
  -- Operation Details
  scope VARCHAR(50) NOT NULL, -- "agents:financial", "voice:synthesis"
  operation_type VARCHAR(50) NOT NULL, -- "agent_invoke", "voice_synthesis", "document_ocr"
  provider VARCHAR(50) NOT NULL, -- "elevenlabs", "cartesia", "agno", "openai"
  model_used VARCHAR(100), -- "claude-3-opus", "gpt-4o", "gemini-pro"
  
  -- Secret Used (if tenant brought their own key)
  tenant_secret_id UUID REFERENCES tenant_secrets(id) ON DELETE SET NULL,
  
  -- Usage Metrics
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  duration_ms INTEGER,
  characters_processed INTEGER,
  
  -- Cost (in cents for precision)
  cost_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Context (for tracing and debugging)
  correlation_id UUID NOT NULL,
  user_id UUID, -- Optional: references identity_users(id) if exists
  metadata JSONB DEFAULT '{}', -- Extensible for provider-specific data
  
  -- Timestamp
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_usage_tenant_key FOREIGN KEY (tenant_id, api_key_id)
    REFERENCES tenant_api_keys(tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT ck_usage_cost CHECK (cost_cents >= 0)
);

-- Indexes (Optimized for analytics and billing queries)
CREATE INDEX idx_usage_logs_tenant_key ON api_key_usage_logs(tenant_id, api_key_id);
CREATE INDEX idx_usage_logs_tenant_date ON api_key_usage_logs(tenant_id, recorded_at DESC);
CREATE INDEX idx_usage_logs_scope ON api_key_usage_logs(scope);
CREATE INDEX idx_usage_logs_provider ON api_key_usage_logs(provider);
CREATE INDEX idx_usage_logs_recorded_at ON api_key_usage_logs(recorded_at DESC);
CREATE INDEX idx_usage_logs_secret ON api_key_usage_logs(tenant_secret_id) WHERE tenant_secret_id IS NOT NULL;
CREATE INDEX idx_usage_logs_correlation ON api_key_usage_logs(correlation_id);

-- Row-Level Security (MANDATORY)
ALTER TABLE api_key_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON api_key_usage_logs
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE tenant_api_keys IS 'Platform-issued API keys with granular scopes for multi-tenant access control';
COMMENT ON TABLE tenant_secrets IS 'Encrypted third-party API keys (BYOK) stored via Supabase Vault';
COMMENT ON TABLE api_key_usage_logs IS 'Granular usage tracking for billing and analytics per API key/scope';

COMMENT ON COLUMN tenant_api_keys.key_hash IS 'SHA-256 hash of API key (NEVER store plain text)';
COMMENT ON COLUMN tenant_api_keys.key_prefix IS 'First 16 chars for display (e.g., vito_fin_abc123)';
COMMENT ON COLUMN tenant_api_keys.scopes IS 'Allowed scopes: ["agents:financial", "voice:synthesis"]';
COMMENT ON COLUMN tenant_secrets.secret_vault_id IS 'Reference to vault.secrets (encrypted at rest)';
COMMENT ON COLUMN api_key_usage_logs.cost_cents IS 'Cost in cents for precision (e.g., 150 = $1.50)';
COMMENT ON COLUMN api_key_usage_logs.correlation_id IS 'For distributed tracing and debugging';

-- ============================================================================
-- TABLE: api_key_request_events
-- Purpose: Billing-grade event log with idempotency (anti-double-charge)
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_key_request_events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_id UUID NOT NULL REFERENCES tenant_api_keys(id) ON DELETE CASCADE,
  
  -- Idempotency (CRITICAL: prevents double-charging on retries)
  request_id TEXT NOT NULL, -- Client-provided or generated (e.g., UUID)
  correlation_id TEXT, -- For distributed tracing
  
  -- Timestamp
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Request Details
  method TEXT NOT NULL, -- "GET", "POST", "PUT", "DELETE"
  operation_id TEXT, -- OpenAPI operationId (preferred for analytics)
  endpoint_normalized TEXT NOT NULL, -- "/v1/reviews/:id" (NO raw IDs)
  status_code INTEGER NOT NULL, -- HTTP status (200, 400, 500)
  duration_ms INTEGER, -- Request duration
  
  -- Multi-Workload Billing (CRITICAL: distinguish agent types and metrics)
  workload_class TEXT NOT NULL DEFAULT 'generic', 
  -- Examples: "voice_processing", "document_scan", "financial_analysis", "orchestration", "rag"
  meter_key TEXT NOT NULL DEFAULT 'req',
  -- Examples: "stt_second", "tts_char", "doc_page", "llm_token", "agent_step", "req"
  meter_qty BIGINT NOT NULL DEFAULT 1,
  -- Quantity of the meter (e.g., seconds, chars, pages, tokens, steps)
  
  -- Billing Units (DEPRECATED: use meter_qty instead, kept for backward compat)
  billable_units INTEGER NOT NULL DEFAULT 1,
  unit_type TEXT NOT NULL DEFAULT 'request', -- "request", "doc", "token", "minute", "custom"
  
  -- Token Metrics (for LLM APIs)
  input_tokens INTEGER,
  output_tokens INTEGER,
  
  -- Cost (in microdollars for precision: 1,000,000 micros = $1.00)
  cost_usd_micros BIGINT, -- Calculated or estimated cost
  
  -- Constraints
  CONSTRAINT uq_tenant_request_id UNIQUE (tenant_id, request_id), -- Anti-double-charge
  CONSTRAINT ck_request_events_status CHECK (status_code >= 100 AND status_code < 600),
  CONSTRAINT ck_request_events_units CHECK (billable_units >= 0)
);

-- Indexes (Optimized for billing queries and analytics)
CREATE INDEX idx_request_events_tenant_occurred ON api_key_request_events(tenant_id, occurred_at DESC);
CREATE INDEX idx_request_events_tenant_key_occurred ON api_key_request_events(tenant_id, api_key_id, occurred_at DESC);
CREATE INDEX idx_request_events_tenant_operation ON api_key_request_events(tenant_id, operation_id, occurred_at DESC) WHERE operation_id IS NOT NULL;
CREATE INDEX idx_request_events_tenant_endpoint ON api_key_request_events(tenant_id, endpoint_normalized, occurred_at DESC);
CREATE INDEX idx_request_events_correlation ON api_key_request_events(correlation_id) WHERE correlation_id IS NOT NULL;
CREATE INDEX idx_request_events_tenant_workload ON api_key_request_events(tenant_id, workload_class, occurred_at DESC);
CREATE INDEX idx_request_events_tenant_meter ON api_key_request_events(tenant_id, meter_key, occurred_at DESC);

-- Row-Level Security (MANDATORY)
ALTER TABLE api_key_request_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON api_key_request_events
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- ============================================================================
-- TABLE: api_key_usage_daily
-- Purpose: Daily aggregates for fast billing and dashboard queries
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_key_usage_daily (
  -- Composite Primary Key (tenant + key + day + method + endpoint + workload + meter)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_id UUID NOT NULL REFERENCES tenant_api_keys(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  method TEXT NOT NULL,
  operation_id TEXT, -- OpenAPI operationId (nullable)
  endpoint_normalized TEXT NOT NULL,
  
  -- Multi-Workload Billing (CRITICAL: distinguish agent types and metrics)
  workload_class TEXT NOT NULL DEFAULT 'generic',
  meter_key TEXT NOT NULL DEFAULT 'req',
  
  -- Aggregated Metrics
  request_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0, -- status_code >= 400
  meter_qty_total BIGINT NOT NULL DEFAULT 0, -- Total meter quantity (seconds, chars, pages, tokens, steps)
  billable_units_total BIGINT NOT NULL DEFAULT 0, -- DEPRECATED: use meter_qty_total
  input_tokens_total BIGINT NOT NULL DEFAULT 0,
  output_tokens_total BIGINT NOT NULL DEFAULT 0,
  cost_usd_micros_total BIGINT NOT NULL DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  PRIMARY KEY (tenant_id, api_key_id, day, method, endpoint_normalized, workload_class, meter_key),
  CONSTRAINT ck_usage_daily_counts CHECK (
    request_count >= 0 AND error_count >= 0 AND error_count <= request_count
  )
);

-- Indexes (Optimized for billing and analytics)
CREATE INDEX idx_usage_daily_tenant_day ON api_key_usage_daily(tenant_id, day DESC);
CREATE INDEX idx_usage_daily_tenant_key_day ON api_key_usage_daily(tenant_id, api_key_id, day DESC);
CREATE INDEX idx_usage_daily_operation ON api_key_usage_daily(tenant_id, operation_id, day DESC) WHERE operation_id IS NOT NULL;
CREATE INDEX idx_usage_daily_tenant_workload ON api_key_usage_daily(tenant_id, day DESC, workload_class);
CREATE INDEX idx_usage_daily_tenant_meter ON api_key_usage_daily(tenant_id, day DESC, meter_key);

-- Row-Level Security (MANDATORY)
ALTER TABLE api_key_usage_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON api_key_usage_daily
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Trigger: updated_at
CREATE TRIGGER trg_usage_daily_updated_at
  BEFORE UPDATE ON api_key_usage_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS (Documentation for Billing Tables)
-- ============================================================================

COMMENT ON TABLE api_key_request_events IS 'Billing-grade event log with idempotency (anti-double-charge)';
COMMENT ON TABLE api_key_usage_daily IS 'Daily aggregates for fast billing and dashboard queries';

COMMENT ON COLUMN api_key_request_events.request_id IS 'Client-provided or generated UUID for idempotency (prevents double-charging)';
COMMENT ON COLUMN api_key_request_events.endpoint_normalized IS 'Normalized endpoint with :id placeholders (e.g., /v1/reviews/:id)';
COMMENT ON COLUMN api_key_request_events.cost_usd_micros IS 'Cost in microdollars (1,000,000 micros = $1.00)';
COMMENT ON COLUMN api_key_usage_daily.request_count IS 'Total requests for this endpoint on this day';
COMMENT ON COLUMN api_key_usage_daily.error_count IS 'Requests with status_code >= 400';
COMMENT ON COLUMN api_key_usage_daily.cost_usd_micros_total IS 'Total cost in microdollars for this endpoint on this day';

