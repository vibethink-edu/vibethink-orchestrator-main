# FIT-PreActionHook-001: Decision Support Pattern

**Status**: ACTIVE  
**Goal**: Verify reliability and governance of the Pre-Action Hook.
👉 **Reference**: [`DECISION_SUPPORT_PRE_ACTION_HOOK.md`](../canon/DECISION_SUPPORT_PRE_ACTION_HOOK.md)

---

## 1. Structural Verification (Static)

- [ ] **Docs Exist**:
    - [ ] `docs/canon/DECISION_SUPPORT_PRE_ACTION_HOOK.md` exists.
    - [ ] `docs/canon/WEB_INTEL_CAPABILITY.md` exists.
    - [ ] `docs/canon/WEB_INTEL_PIPELINE_AND_STORAGE.md` exists.

- [ ] **Cross-References**:
    - [ ] `WEB_INTEL_CAPABILITY.md` links to `DECISION_SUPPORT_PRE_ACTION_HOOK.md`.
    - [ ] `DECISION_SUPPORT_PRE_ACTION_HOOK.md` defines usages of `WEB_INTEL_CAPABILITY`.

## 2. Invariant Verification (Logic/Code)

These checks must pass in any implementation of the pattern.

### Separation of Concerns
- [ ] **No Direct Execution**: The `WebIntelAdapter` class/module MUST NOT have methods like `publish`, `send`, `book`, or `update_entity`. It generally only has `acquire`, `fetch`, or `search`.
- [ ] **Orchestration Layer**: The code calling `acquire` must be the Orchestrator or a specific Workflow Step, not the Feature Executor directly.

### Governance & Provenance
- [ ] **Mandatory Inputs**: `acquire()` throws error if `idempotency_key` is missing.
- [ ] **Mandatory Outputs**: All returned objects contain a `provenance` block with `source_url` and `fetched_at`.
- [ ] **Gating**: Tests prove that `acquire()` fails if Quota is 0 or Policy denies access.

### Reproducibility
- [ ] **Idempotency**: Calling `acquire()` twice with same key (within freshness window) returns identical Result ID without spending double credits.

## 3. Storage Flow
- [ ] **Traceability**: An `ENTITY_EVENT` creating a memory based on web signal MUST contain `evidence_id` or similar reference.
- [ ] **Immutability**: Raw fetch logs are verified to be immutable (not overwritten by subsequent logic).

---

## 4. Manual Validations (Audit)

- [ ] **Example 1 (Marketing)**: "Validate Campaign" workflow actually triggers a Web-Intel check before the "Publish" step.
- [ ] **Example 2 (Sales)**: "Pre-meeting Brief" workflow fails gracefully if Web-Intel is down, without crashing the meeting setup.
