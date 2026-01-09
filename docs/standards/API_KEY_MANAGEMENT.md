# ViTo API Key & Secrets Management Standard

**Status**: SEALED  
**Authority**: Engineering Rector Pack v1  
**Last Updated**: 2026-01-09  
**Scope**: Multi-tenant API key management, secrets storage, and usage tracking.

---

## 1. Purpose

Establish a secure, scalable system for managing:
1. **Platform API Keys**: Keys issued by ViTo to tenants for accessing services.
2. **Tenant Secrets**: Third-party API keys (OpenAI, ElevenLabs, etc.) owned by tenants.
3. **Usage Tracking**: Granular billing and analytics per key/scope.

---

## 2. Architecture Overview

### 2.1. Two-Tier Key System

```
┌─────────────────────────────────────────────────────┐
│  Tier 1: Platform API Keys (Issued by ViTo)        │
│  - Scoped access (voice:synthesis, agents:financial)│
│  - Rate limits & cost controls                      │
│  - Usage tracking for billing                       │
└─────────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│  Tier 2: Tenant Secrets (Owned by Tenant)          │
│  - Third-party API keys (OpenAI, ElevenLabs)        │
│  - Encrypted at rest (Supabase Vault)               │
│  - Scoped to specific operations                    │
└─────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1. Platform API Keys

```sql
-- Table: tenant_api_keys
CREATE TABLE tenant_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- API Key Identity
  key_name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE, -- SHA-256 hash
  key_prefix VARCHAR(20) NOT NULL, -- "vito_fin_abc123" (first 16 chars visible)
  
  -- Scope & Permissions
  scopes JSONB NOT NULL DEFAULT '[]', 
  -- Examples: ["agents:financial", "voice:synthesis", "document:ocr"]
  
  allowed_models JSONB DEFAULT '[]',
  -- Examples: ["claude-3-opus", "gpt-4o", "gemini-pro"]
  
  allowed_providers JSONB DEFAULT '[]',
  -- Examples: ["elevenlabs", "cartesia", "agno"]
  
  -- Rate Limits
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Cost Controls
  max_cost_per_day_cents INTEGER,
  max_cost_per_month_cents INTEGER,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID REFERENCES identity_users(id),
  last_used_at TIMESTAMPTZ,
  
  CONSTRAINT uq_tenant_key_name UNIQUE (tenant_id, key_name)
);

CREATE INDEX idx_api_keys_tenant ON tenant_api_keys(tenant_id);
CREATE INDEX idx_api_keys_active ON tenant_api_keys(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_api_keys_hash ON tenant_api_keys(key_hash);
```

### 3.2. Tenant Secrets (Third-Party API Keys)

```sql
-- Table: tenant_secrets
CREATE TABLE tenant_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Secret Identity
  secret_name VARCHAR(100) NOT NULL, -- "OpenAI Production Key"
  provider VARCHAR(50) NOT NULL, -- "openai", "elevenlabs", "cartesia"
  
  -- Encrypted Secret (Supabase Vault)
  secret_vault_id UUID NOT NULL, -- Reference to vault.secrets
  
  -- Scope (what this secret can be used for)
  allowed_scopes JSONB NOT NULL DEFAULT '[]',
  -- Examples: ["agents:orchestration", "agents:financial"]
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID REFERENCES identity_users(id),
  last_used_at TIMESTAMPTZ,
  
  CONSTRAINT uq_tenant_secret_name UNIQUE (tenant_id, secret_name)
);

CREATE INDEX idx_secrets_tenant ON tenant_secrets(tenant_id);
CREATE INDEX idx_secrets_provider ON tenant_secrets(provider);
```

### 3.3. Usage Tracking

```sql
-- Table: api_key_usage_logs
CREATE TABLE api_key_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  api_key_id UUID NOT NULL REFERENCES tenant_api_keys(id),
  
  -- Operation Details
  scope VARCHAR(50) NOT NULL,
  operation_type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model_used VARCHAR(100),
  
  -- Secret Used (if tenant brought their own key)
  tenant_secret_id UUID REFERENCES tenant_secrets(id),
  
  -- Usage Metrics
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  duration_ms INTEGER,
  characters_processed INTEGER,
  
  -- Cost
  cost_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Context
  correlation_id UUID NOT NULL,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_usage_tenant_key FOREIGN KEY (tenant_id, api_key_id)
    REFERENCES tenant_api_keys(tenant_id, id) ON DELETE CASCADE
);

CREATE INDEX idx_usage_logs_tenant_key ON api_key_usage_logs(tenant_id, api_key_id);
CREATE INDEX idx_usage_logs_scope ON api_key_usage_logs(scope);
CREATE INDEX idx_usage_logs_recorded_at ON api_key_usage_logs(recorded_at DESC);
CREATE INDEX idx_usage_logs_secret ON api_key_usage_logs(tenant_secret_id) WHERE tenant_secret_id IS NOT NULL;
```

---

## 4. Secrets Management (Supabase Vault)

### 4.1. Storing Tenant Secrets

```sql
-- Use Supabase Vault for encryption at rest
-- https://supabase.com/docs/guides/database/vault

-- Insert a tenant secret
INSERT INTO vault.secrets (secret)
VALUES ('sk-proj-abc123...') -- OpenAI API key
RETURNING id;

-- Reference in tenant_secrets table
INSERT INTO tenant_secrets (
  tenant_id,
  secret_name,
  provider,
  secret_vault_id,
  allowed_scopes
) VALUES (
  'tenant-uuid',
  'OpenAI Production Key',
  'openai',
  'vault-secret-id', -- From previous INSERT
  '["agents:financial", "agents:orchestration"]'::jsonb
);
```

### 4.2. Retrieving Secrets (Server-Side Only)

```typescript
// src/lib/secrets/tenant-secrets.ts
import { supabase } from '@/lib/supabase';

export async function getTenantSecret(
  tenantId: string,
  provider: string,
  requiredScope: string
): Promise<string | null> {
  // Fetch secret metadata
  const { data: secretMeta, error } = await supabase
    .from('tenant_secrets')
    .select('secret_vault_id, allowed_scopes')
    .eq('tenant_id', tenantId)
    .eq('provider', provider)
    .eq('is_active', true)
    .single();
  
  if (error || !secretMeta) return null;
  
  // Check scope
  const scopes = secretMeta.allowed_scopes as string[];
  if (!scopes.includes(requiredScope)) {
    throw new Error(`Secret not authorized for scope: ${requiredScope}`);
  }
  
  // Retrieve decrypted secret from Vault
  const { data: vaultData } = await supabase.rpc('vault_get_secret', {
    secret_id: secretMeta.secret_vault_id
  });
  
  return vaultData?.decrypted_secret || null;
}
```

---

## 5. API Key Validation Middleware

---

### ⚠️ Phase 1 Implementation Status

**Rate Limiting:** NOT enforced in Phase 1.  
The current implementation is a placeholder that always allows requests.  
Distributed rate limiting requires **Phase 2 (Redis-based counters)**.

**Cost Limits:** ENFORCED.  
Requests are blocked when the daily budget is exhausted using DB-backed checks.

See `FIT-API-KEY-MGMT-001-Phase-1.md` for the authoritative implementation scope.

---

```typescript
// src/middleware/api-key-validator.ts
import { createHash } from 'crypto';
import { supabase } from '@/lib/supabase';

interface ApiKeyValidationResult {
  isValid: boolean;
  tenantId?: string;
  keyId?: string;
  scopes?: string[];
  allowedModels?: string[];
  allowedProviders?: string[];
}

export async function validateApiKey(
  apiKey: string,
  requiredScope: string,
  provider?: string,
  model?: string
): Promise<ApiKeyValidationResult> {
  // Hash the API key (SHA-256)
  const keyHash = createHash('sha256').update(apiKey).digest('hex');
  
  // Fetch key from database
  const { data: keyData, error } = await supabase
    .from('tenant_api_keys')
    .select('*')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();
  
  if (error || !keyData) {
    return { isValid: false };
  }
  
  // Check expiration
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return { isValid: false };
  }
  
  // Check scope
  const scopes = keyData.scopes as string[];
  if (!scopes.includes(requiredScope)) {
    return { isValid: false };
  }
  
  // Check provider (if specified)
  if (provider && keyData.allowed_providers?.length > 0) {
    if (!keyData.allowed_providers.includes(provider)) {
      return { isValid: false };
    }
  }
  
  // Check model (if specified)
  if (model && keyData.allowed_models?.length > 0) {
    if (!keyData.allowed_models.includes(model)) {
      return { isValid: false };
    }
  }
  
  // **Phase 1 Limitation**: Rate limiting is NOT enforced in Phase 1.
  // Phase 2 (Redis-based distributed counters) is required for production rate limiting.
  // For now, this is a placeholder that always allows requests.
  const rateLimitOk = await checkRateLimit(keyData.id, keyData.rate_limit_per_minute);
  if (!rateLimitOk) {
    return { isValid: false };
  }
  
  // **Phase 1**: Cost limits ARE enforced via daily DB queries.
  const costLimitOk = await checkCostLimit(keyData.id, keyData.max_cost_per_day_cents);
  if (!costLimitOk) {
    return { isValid: false };
  }
  
  // Update last_used_at
  await supabase
    .from('tenant_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyData.id);
  
  return {
    isValid: true,
    tenantId: keyData.tenant_id,
    keyId: keyData.id,
    scopes: keyData.scopes,
    allowedModels: keyData.allowed_models,
    allowedProviders: keyData.allowed_providers,
  };
}

// Helper: Rate limit check (implement with Redis)
async function checkRateLimit(keyId: string, limitPerMinute: number): Promise<boolean> {
  // TODO: Implement with Redis (sliding window counter)
  return true;
}

// Helper: Cost limit check
async function checkCostLimit(keyId: string, maxCostPerDay: number | null): Promise<boolean> {
  if (!maxCostPerDay) return true;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data } = await supabase
    .from('api_key_usage_logs')
    .select('cost_cents')
    .eq('api_key_id', keyId)
    .gte('recorded_at', today.toISOString());
  
  const totalCostToday = data?.reduce((sum, log) => sum + log.cost_cents, 0) || 0;
  
  return totalCostToday < maxCostPerDay;
}
```

---

## 6. Usage Tracking

```typescript
// src/lib/usage/track-usage.ts
export async function trackUsage(params: {
  tenantId: string;
  apiKeyId: string;
  scope: string;
  operationType: string;
  provider: string;
  model?: string;
  tenantSecretId?: string;
  tokensInput?: number;
  tokensOutput?: number;
  durationMs?: number;
  charactersProcessed?: number;
  costCents: number;
  correlationId: string;
  userId?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  await supabase.from('api_key_usage_logs').insert({
    tenant_id: params.tenantId,
    api_key_id: params.apiKeyId,
    scope: params.scope,
    operation_type: params.operationType,
    provider: params.provider,
    model_used: params.model,
    tenant_secret_id: params.tenantSecretId,
    tokens_input: params.tokensInput || 0,
    tokens_output: params.tokensOutput || 0,
    duration_ms: params.durationMs,
    characters_processed: params.charactersProcessed,
    cost_cents: params.costCents,
    correlation_id: params.correlationId,
    user_id: params.userId,
    metadata: params.metadata || {},
    recorded_at: new Date().toISOString(),
  });
}
```

---

## 7. Scopes Definition

### 7.1. Standard Scopes

| Scope | Description | Providers | Models |
|:---|:---|:---|:---|
| `agents:orchestration` | Multi-department task agents | Agno, OpenAI | GPT-4o-mini, Gemini Flash |
| `agents:financial` | Financial analysis agents | Agno, Anthropic | Claude Opus, GPT-4o |
| `agents:voice` | Voice processing agents | Agno, ElevenLabs | GPT-4o, Claude Sonnet |
| `voice:synthesis` | Text-to-speech | Cartesia, ElevenLabs | N/A |
| `voice:cloning` | Voice cloning | Cartesia, ElevenLabs | N/A |
| `document:ocr` | Document scanning | Google Vision, Textract | N/A |
| `document:intelligence` | Document analysis | Gemini, GPT-4o | Gemini Pro, GPT-4o |
| `avatar:generation` | Avatar rendering | Tavus | N/A |

### 7.2. Scope Naming Convention
- Format: `{domain}:{capability}`
- Examples: `agents:financial`, `voice:synthesis`, `document:ocr`

---

## 8. Security Best Practices

### 8.1. API Key Generation
```typescript
import { randomBytes } from 'crypto';

export function generateApiKey(prefix: string): { key: string; hash: string } {
  const randomPart = randomBytes(32).toString('base64url');
  const key = `${prefix}_${randomPart}`;
  const hash = createHash('sha256').update(key).digest('hex');
  
  return { key, hash };
}

// Usage
const { key, hash } = generateApiKey('vito_fin');
// key: "vito_fin_abc123def456..." (show to user ONCE)
// hash: "sha256..." (store in database)
```

### 8.2. Secret Rotation
- **Platform Keys**: Rotate every 90 days (automated).
- **Tenant Secrets**: Tenant-managed, recommend 90-day rotation.
- **Notification**: Email tenant 7 days before expiration.

### 8.3. Access Control
- **Platform Keys**: Only tenant admins can create/delete.
- **Tenant Secrets**: Only tenant owners can create/view.
- **Usage Logs**: Read-only for tenant admins.

---

## 9. Billing Integration

```typescript
// Monthly billing calculation
export async function calculateMonthlyBilling(tenantId: string, month: string) {
  const { data } = await supabase
    .from('api_key_usage_logs')
    .select('scope, cost_cents, api_key_id')
    .eq('tenant_id', tenantId)
    .gte('recorded_at', `${month}-01`)
    .lt('recorded_at', `${month}-31`);
  
  const breakdown = data?.reduce((acc, log) => {
    const scope = log.scope;
    if (!acc[scope]) acc[scope] = 0;
    acc[scope] += log.cost_cents;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalCents: Object.values(breakdown || {}).reduce((sum, cost) => sum + cost, 0),
    breakdown,
  };
}
```

---

## 10. Enforcement

### 10.1. CI/CD Checks
- [ ] No hardcoded API keys in code.
- [ ] All secrets use Supabase Vault.
- [ ] API key validation middleware in all routes.

### 10.2. Runtime Checks
- [ ] Rate limiting enforced (Redis).
- [ ] Cost limits enforced (daily/monthly).
- [ ] Scope validation on every request.


---

## 11. Governance

This standard is subject to the **ViTo Audit Gate Policy** (see `docs/governance/AUDIT_GATE_POLICY.md`).

---

**Approved by**: Engineering Team  
**Status**: SEALED (Enforceable Standard)  
**Next Review**: 2026-Q2
