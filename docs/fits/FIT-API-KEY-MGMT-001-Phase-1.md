# FIT: API Key & Secrets Management - Phase 1

**FIT ID**: FIT-API-KEY-MGMT-001  
**Status**: Phase 1 - Planning  
**Created**: 2026-01-09  
**Owner**: Engineering Team  
**Priority**: HIGH (Infrastructure Critical)

---

## 1. Executive Summary

### 1.1. Purpose
Implement a secure, scalable, multi-tenant API Key and Secrets Management system that enables:
- **Platform API Keys**: ViTo-issued keys with granular scopes (voice, agents, OCR).
- **Tenant Secrets**: Secure storage of tenant-owned third-party API keys (OpenAI, ElevenLabs, etc.).
- **Usage Tracking**: Granular billing and analytics per key/scope/provider.
- **Cost Controls**: Rate limits and spending caps per API key.

### 1.2. Business Value
- **Revenue**: Enable usage-based billing per scope (agents, voice, documents).
- **Security**: Encrypted secrets, scope-based access control, audit trails.
- **Flexibility**: Tenants can bring their own API keys (BYOK) or use platform credits.
- **Scalability**: Support multiple keys per tenant for different use cases.

### 1.3. Scope
**In Scope (Phase 1):**
- Database schema (tenant_api_keys, tenant_secrets, api_key_usage_logs).
- Supabase Vault integration for encrypted secrets.
- API key validation middleware (TypeScript).
- Basic usage tracking.
- Scopes definition (agents, voice, document).

**Out of Scope (Future Phases):**
- UI dashboard for key management (Phase 2).
- Advanced rate limiting with Redis (Phase 2).
- Billing integration (Phase 2).
- Webhook notifications for limit alerts (Phase 3).

---

## 2. Technical Architecture

### 2.1. System Design

```
┌─────────────────────────────────────────────────────┐
│  Client (Tenant Application)                        │
│  - Sends request with X-API-Key header              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  API Gateway (TypeScript/Next.js)                   │
│  - validateApiKey(key, scope, provider, model)      │
│  - Check: scope, rate limits, cost limits           │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Service Layer (Voice AI, Document Intelligence)    │
│  - getTenantSecret(tenantId, provider, scope)       │
│  - Use tenant's own API key OR platform key         │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Third-Party Providers                              │
│  - OpenAI, ElevenLabs, Cartesia, Google Vision      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Usage Tracking                                     │
│  - trackUsage(tenantId, keyId, scope, cost)         │
│  - Store in api_key_usage_logs                      │
└─────────────────────────────────────────────────────┘
```

### 2.2. Database Schema

**Tables:**
1. `tenant_api_keys`: Platform-issued API keys with scopes.
2. `tenant_secrets`: Encrypted third-party API keys (Supabase Vault).
3. `api_key_usage_logs`: Granular usage tracking for billing.

**Key Relationships:**
- `tenant_api_keys` → `tenants` (multi-tenant isolation).
- `tenant_secrets` → `vault.secrets` (encrypted storage).
- `api_key_usage_logs` → `tenant_api_keys` + `tenant_secrets` (usage attribution).

### 2.3. Scopes Definition

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

---

## 3. Implementation Plan

### Phase 1: Foundation (Week 1-2)
**Deliverables:**
- [ ] Database migrations (`supabase/migrations/20260109_api_key_management.sql`).
- [ ] Supabase Vault setup for encrypted secrets.
- [ ] TypeScript interfaces (`IApiKey`, `ITenantSecret`, `IUsageLog`).
- [ ] API key validation middleware (`src/middleware/api-key-validator.ts`).
- [ ] Secrets retrieval service (`src/lib/secrets/tenant-secrets.ts`).
- [ ] Usage tracking service (`src/lib/usage/track-usage.ts`).
- [ ] Unit tests (validation, scope checks, cost limits).

**Acceptance Criteria:**
- ✅ API key can be validated with scope/provider/model checks.
- ✅ Tenant secrets can be stored and retrieved securely.
- ✅ Usage is tracked with tenant_id, key_id, scope, cost.
- ✅ Cost limits are enforced (budget-based, daily enforcement via DB).
- ⏳ Rate limits: Phase 2 (requires Redis distributed counters).

### Phase 2: Integration & UI (Week 3-4)
**Deliverables:**
- [ ] Integrate with Document Intelligence module.
- [ ] Integrate with Voice AI module (when implemented).
- [ ] Admin UI for API key management (create, revoke, view usage).
- [ ] Tenant UI for secrets management (BYOK).
- [ ] Usage analytics dashboard (cost breakdown by scope).

**Acceptance Criteria:**
- ✅ Document Intelligence uses API key validation.
- ✅ Tenants can create/revoke API keys via UI.
- ✅ Tenants can add their own OpenAI/ElevenLabs keys.
- ✅ Usage dashboard shows cost per scope/provider.

### Phase 3: Advanced Features (Week 5-6)
**Deliverables:**
- [ ] Redis-based rate limiting (sliding window).
- [ ] Webhook notifications for limit alerts.
- [ ] Billing integration (monthly invoices).
- [ ] API key rotation automation.
- [ ] Audit logs for key creation/deletion.

**Acceptance Criteria:**
- ✅ Rate limiting is accurate and performant (Redis).
- ✅ Tenants receive alerts before hitting limits.
- ✅ Monthly billing is automated.

---

## 4. Security Considerations

### 4.1. API Key Storage
- **Never store plain text keys**: Use SHA-256 hash.
- **Show key only once**: On creation, display full key. After that, only show prefix.
- **Rotation**: Automated rotation every 90 days (configurable).

### 4.2. Secrets Management
- **Supabase Vault**: All tenant secrets encrypted at rest.
- **Access Control**: Only tenant owners can create/view secrets.
- **Scope Enforcement**: Secrets can only be used for allowed scopes.

### 4.3. Multi-Tenant Isolation
- **RLS Policies**: Row-Level Security on all tables.
- **Composite FKs**: Enforce tenant_id in all relationships.
- **Validation**: Every request validates tenant_id matches API key.

---

## 5. Testing Strategy

### 5.1. Unit Tests
- API key validation (valid/invalid/expired).
- Scope checks (allowed/denied).
- Rate limit enforcement.
- Cost limit enforcement.
- Secret retrieval (authorized/unauthorized).

### 5.2. Integration Tests
- End-to-end flow: Create key → Validate → Track usage.
- BYOK flow: Store secret → Retrieve → Use in API call.
- Multi-tenant isolation: Tenant A cannot use Tenant B's key.

### 5.3. Load Tests
- 1000 concurrent API key validations.
- Rate limiting under high load.
- Secret retrieval performance.

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|:---|:---|:---|
| **Secret leakage** | Critical | Supabase Vault encryption, access logs, rotation. |
| **Rate limit bypass** | High | Redis-based sliding window (Phase 2). |
| **Cost overruns** | High | Enforce max_cost_per_day, alerts before limits. |
| **Performance** | Medium | Cache API key metadata (Redis), index optimization. |
| **Vendor lock-in (Supabase Vault)** | Low | Abstract secrets storage interface. |

---

## 7. Dependencies

### 7.1. External
- **Supabase Vault**: For encrypted secrets storage.
- **Redis** (Phase 2): For rate limiting.

### 7.2. Internal
- **Document Intelligence Module**: Will consume API key validation.
- **Voice AI Module** (future): Will consume API key validation.
- **Billing System** (Phase 2): Will consume usage logs.

---

## 8. Success Metrics

### 8.1. Technical Metrics
- API key validation latency: < 50ms (p95).
- Secret retrieval latency: < 100ms (p95).
- Usage tracking latency: < 10ms (async).

### 8.2. Business Metrics
- Number of API keys created per tenant.
- Percentage of tenants using BYOK.
- Cost savings from tenant-provided keys.
- Revenue from usage-based billing.

---

## 9. Documentation

### 9.1. Standards
- ✅ `docs/standards/API_KEY_MANAGEMENT.md` (already created).

### 9.2. API Reference
- [ ] OpenAPI spec for API key endpoints (Phase 2).
- [ ] Usage tracking API documentation.

### 9.3. User Guides
- [ ] How to create an API key (tenant guide).
- [ ] How to add your own OpenAI key (BYOK guide).
- [ ] Understanding scopes and limits.

---

## 10. Next Steps

1. **Review & Approval**: Engineering team reviews this FIT.
2. **Phase 1 Kickoff**: Create database migrations and middleware.
3. **Integration**: Connect with Document Intelligence module.
4. **Phase 2 Planning**: UI and billing integration.

---

**Approved by**: Pending  
**Start Date**: TBD  
**Estimated Completion (Phase 1)**: 2 weeks  

---

## Appendix A: References

- **Tech Stack Standard**: `docs/standards/VITO_TECH_STACK_STANDARD.md`
- **DB Naming Rules**: `docs/data/DB_NAMING_AND_RULES.md`
- **Document Intelligence FIT**: `docs/governance/closures/FIT-DOCUMENT-INTELLIGENCE-001/`
- **Supabase Vault Docs**: https://supabase.com/docs/guides/database/vault
