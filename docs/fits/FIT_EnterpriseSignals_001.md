# FIT-ESI-001: Enterprise Signals Integrity

> **Target**: Enterprise Signals Ingestion (ESI) & Onboarding
> **Severity**: CRITICAL (Architecture Violation)
> **Type**: Static Analysis & Concept Audit

## 1. Forbidden Patterns (The "Anti-Canon")

If any of the following patterns are detected in the codebase, the architecture is considered BROKEN.

### ❌ Contagion Patterns
1.  **Vendor-Specific Returns**:
    -   `getGoogleEmails()` -> ❌ VIOLATION
    -   `getEmails()` -> ✅ OK
2.  **Leaky Abstracts**:
    -   `adapter.connect({ client_secret: ... })` where `client_secret` is hardcoded to Google context.
    -   Importing `googleapis` in a non-adapter file.
3.  **UI Coupling**:
    -   `GoogleLoginButton.tsx` in `shared/components/` -> ❌ VIOLATION (Should be `GenericOAuthButton` or `AdapterConnectionComponent`)
    -   Routing `/onboarding/google` -> ❌ VIOLATION (Should be `/onboarding/connect?adapter=google`)

## 2. Required Invariants (Automated Checks)

### Check 1: Adapter Isolation
**Logic**: Grep for "google", "microsoft", "office365" in `packages/core`.
**Pass**: 0 matches.
**Fail**: >0 matches.
**Reason**: The Core must not know these strings exist. They belong in DB config or Adapter packages.

### Check 2: Event Taxonomy Compliance
**Logic**: Verify that all `EMAIL_RECEIVED` events produced by adapters match the schema defined in `SIGNALS_ADAPTER_CONTRACT.md`.
**Method**: Type check `CanonicalSignal` vs `EntityEvent` schema.

## 3. Manual Audit Questions

1.  **Can I add "Slack" tomorrow without changing the database schema?**
    -   If NO -> **FAIL**.
2.  **Does the "Onboarding" screen require a code change to add a new vendor?**
    -   If YES -> **FAIL**. (It should be data-driven: `Adapters.list()` -> Render).
3.  **Does the Policy Layer know about "Google"?**
    -   If YES -> **FAIL**. (It should know about `SignalSource` ID, not the brand).

## 4. Remediation

If a violation is found:
1.  **Stop**: Do not merge.
2.  **Refactor**: Move vendor logic behind the Adapter Interface.
3.  **Abstract**: Replace `VendorName` with `ProviderID`.
