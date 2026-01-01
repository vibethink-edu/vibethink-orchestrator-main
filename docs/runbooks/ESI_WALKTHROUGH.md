# Walkthrough: Enterprise Signals Canon & Core Implementation

We have successfully established the foundational architecture for Enterprise Signals in ViTo, ensuring a vendor-agnostic, policy-governed system.

## 1. Canonical Documents
Established the Source of Truth in `docs/canon/`:
- [ARCHITECT_GEMINI_ROLE.md](file:///c:/IA%20Marcelo%20Labs/vibethink-orchestrator-main/docs/canon/ARCHITECT_GEMINI_ROLE.md): Governance rules for the AI Architect.
- [ENTERPRISE_SIGNALS_INGESTION.md](file:///c:/IA%20Marcelo%20Labs/vibethink-orchestrator-main/docs/canon/ENTERPRISE_SIGNALS_INGESTION.md): ESI capability definition.
- [SIGNALS_ADAPTER_CONTRACT.md](file:///c:/IA%20Marcelo%20Labs/vibethink-orchestrator-main/docs/canon/SIGNALS_ADAPTER_CONTRACT.md): The Iron Interface contract.
- [ONBOARDING_VENDOR_AGNOSTIC.md](file:///c:/IA%20Marcelo%20Labs/vibethink-orchestrator-main/docs/canon/ONBOARDING_VENDOR_AGNOSTIC.md): Declarative onboarding model.

## 2. Core Implementation (`@vibethink/core`)
Created the executable contract in `packages/core/src/signals/`:
- `adapter.ts`: Defines the strict `ingest()` interface.
- `types.ts`, `errors.ts`, `provenance.ts`, `policy.ts`, `events.ts`: Core primitives.
- All internal signals are exported through the package entry point for clean consumption.

## 3. Google Workspace Adapter Skeleton
Scaffolded `packages/adapters/google-workspace`:
- Strictly implements `SignalAdapter.ingest()`.
- Isolated from Core via package boundaries (no relative paths).
- No business logic or vendor leakage yet.

## 4. Integrity Verification (FIT Gate)
Implemented `scripts/fits/fit-enterprise-signals-001.ts`:
- ✅ **PASSED**: Validated that `packages/core` is 100% free of vendor imports.
- ✅ **PASSED**: Verified mandatory `Provenance` fields existence in the contract.
- ✅ **PASSED**: Skeleton verification confirms `ingest()` returns the correct structure.

## 5. Alignment Phase: Canon & Core Sync
Aligned documentation and implementation as per Principal Architect's mandatory adjustments:
- ✅ **Contract Simplified**: `SIGNALS_ADAPTER_CONTRACT.md` now reflects `ingest(): Promise<IngestResult>` as the standard.
- ✅ **Type Soundness**: `SignalPayload` in `events.ts` is now a sealed discriminated union, preventing unstructured key leakage.
- ✅ **Idempotency Defined**: Canonical format `${adapter_id}:${source_ref}:${signal_class}` established in both canon and `provenance.ts`.
- ✅ **Policy Boundary Secured**: Canon explicitly states that policy enforcement happens at the ingestion loop boundary, keeping adapters purely for normalization.

## 6. Phase 1 Completion: Email Signal Mock
Wired the first signal class with a verified mock:
- ✅ **Email Payload**: Defined `EmailPayload` in `@vibethink/core` with strict fields (`subject`, `from`, `to`, `date`, `excerpt`).
- ✅ **Mock Ingestion**: `GoogleWorkspaceAdapter.ingest()` now returns normalized `SignalEvent` objects.
- ✅ **Clean Lineage**: Every mock event includes complete `Provenance` and the canonical `idempotency_key` (`google-workspace:msg_mock_001:email`).

---
**Status**: Phase 1 verified.

## 7. Phase 2 Completion: Real Gmail API Ingestion
Replaced mock logic with production-ready Gmail API implementation:
- ✅ **EmailPayload Enhancement**: Added optional `cc` and `bcc` fields to the core contract.
- ✅ **Gmail Logic**: `GoogleWorkspaceAdapter` now uses `googleapis` to `list` and `get` messages (limited to 50 for MVP).
- ✅ **Canonical Normalization**: Extracts Gmail `snippet` as `excerpt` and maps RFC822 headers to `EmailPayload`.
- ✅ **Strict Invariants**: Correct `source_ref` (messageId) and `idempotency_key` generation.
- ✅ **Verification Suite**: Added a `connection_ref: "fixture"` mode for stable contract testing.

### Sample Normalized Signal (Verification Fixture)
```json
{
  "event_type": "enterprise_signal.ingested",
  "signal": {
    "signal_class": "email",
    "subject": "VibeThink Phase 2 Verification",
    "from": "architect@vibethink.edu",
    "to": ["user@vibethink.edu"],
    "cc": ["boss@vibethink.edu"],
    "date": "2026-01-01T14:00:00.000Z",
    "excerpt": "This is a sample normalized event from the real adapter logic (via fixture)."
  },
  "provenance": {
    "adapter_id": "google-workspace",
    "adapter_version": "0.1.0",
    "source_ref": "msg_fixture_001",
    "received_at": "2026-01-01T14:00:00.000Z",
    "idempotency_key": "google-workspace:msg_fixture_001:email"
  }
}
```

---
**Final Status**: Phase 2 Complete. Real API logic is implemented and isolated. FIT gate remains GREEN.

## 8. Phase 3A: Local Execution with Credentials
Wired the adapter to use real OAuth2 credentials from environment variables:

### Mandatory Environment Variables
Create a `.env` in the project root with:
```bash
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
GOOGLE_OAUTH_REFRESH_TOKEN=your_refresh_token
```

### How to use
When calling `ingest()`, use `connection_ref: "google:dev"`. The adapter will automatically resolve the credentials using the `EnvCredentialResolver`.

### Local Smoke Test (Non-CI)
To verify your local credentials:
```bash
npx tsx packages/adapters/google-workspace/scripts/smoke-auth.ts
```

---
**Status**: Phase 3A (Auth Wiring) Verified. Contract remains stable and isolated.
