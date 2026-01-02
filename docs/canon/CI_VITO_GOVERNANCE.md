# CI-ViTo Governance

**Status:** CANON
**Owner:** Platform Architects
**Last updated:** 2026-01-01
**Version:** 1.0.0

---

## 1. Purpose

This document establishes the **canonical governance model** for Continuous Integration (CI) in ViTo (VibeThink Orchestrator).

**Core Principle:**
> CI validation MUST be deterministic, auditable, necessary, and proportional. GitHub Actions have NO authority by inheritance—only by explicit alignment with ViTo architectural truth.

**Goal:**
- **Deterministic acceptance:** Same input = same outcome, always.
- **Auditable decisions:** Every gate has documented rationale.
- **Reduce false negatives:** No arbitrary blockers.
- **XTR is deprecated:** No XTR-based methodology is valid.

---

## 2. Canonical Rules

### CI-VITO-RULE-001: Conditional Activation Principle

**Statement:**
> A CI workflow or gate MAY ONLY block a Pull Request if it meets ALL of the following criteria:

1. **Necessary:** The check prevents a class of defects that would compromise production integrity, security, or reproducibility.
2. **Proportional:** The cost (time, complexity, maintenance) is justified by the risk it mitigates.
3. **Aligned:** The check is grounded in ViTo architectural truth (Canon, FITs, or explicit governance documents).
4. **Deterministic:** The check produces consistent results for identical inputs (no flakiness, no environmental dependencies).
5. **Auditable:** The rationale, ownership, and evidence for the check are documented in the CI Rule Registry.
6. **Externalized (if applicable):** If the check validates against external standards (spelling, style), it should be non-blocking OR provide clear opt-out/configuration.

**Corollary:**
If a workflow does NOT meet all criteria, it MUST be:
- **Degraded** to warning/non-blocking, OR
- **Ported** to a canonical gate (e.g., `quality-gate.yml`), OR
- **Retired** (deleted).

---

## 3. "Allowed to Block" Checklist

Before a CI gate is permitted to block a PR, verify:

- [ ] **Necessity:** Does this prevent a critical defect class? (e.g., broken JSON, merge conflicts, type errors)
- [ ] **Proportionality:** Is the gate's cost justified? (e.g., 30s type-check vs. 10min flaky E2E)
- [ ] **Alignment:** Is this gate grounded in Canon? (e.g., `ARCHITECTURAL_WORKING_RULES.md` R6: Governance as Code)
- [ ] **Determinism:** Does it pass/fail consistently for the same commit?
- [ ] **Auditability:** Is it registered in `CI_VITO_RULE_REGISTRY.md`?
- [ ] **Externalization:** If style/spelling/formatting, is it non-blocking or configurable?

**Decision Matrix:**

| Criteria Met | Action |
|--------------|--------|
| ALL 6 | **KEEP** as blocking |
| 5/6 (missing Externalization) | **DEGRADED** to warning |
| 3-4/6 | **PORT** to canonical gate OR **EVALUATE** |
| <3/6 | **RETIRE** immediately |

---

## 4. Decision Tree: Externalize / Port / Retire / Keep

```
Is the gate NECESSARY? (prevents critical defect)
│
├─ NO → RETIRE
│
└─ YES → Is it ALIGNED with ViTo Canon?
    │
    ├─ NO (legacy XTR, obsolete methodology) → RETIRE
    │
    └─ YES → Is it PROPORTIONAL? (cost vs. risk)
        │
        ├─ NO (flaky, slow, high maintenance) → EXTERNALIZE or RETIRE
        │
        └─ YES → Is it DETERMINISTIC?
            │
            ├─ NO (flaky, env-dependent) → FIX or DEGRADE to warning
            │
            └─ YES → Is it AUDITABLE? (documented in registry)
                │
                ├─ NO → ADD to registry, then KEEP
                │
                └─ YES → Is it EXTERNALIZED properly? (if applicable)
                    │
                    ├─ NO (blocks on style/spelling) → DEGRADE to warning
                    │
                    └─ YES → KEEP as blocking
```

---

## 5. Relationship to Canon and FITs

This governance model extends `ARCHITECTURAL_WORKING_RULES.md` **R6: Governance as Code**:

> **R6:** "Critical invariants must be enforced by machines, not hope."
> 1. **Script:** A verifiable check (e.g., `check-merge-markers.mjs`)
> 2. **CI:** A blocking workflow (e.g., `integrity-gates.yml`)
> 3. **Platform:** A Branch Protection Rule (e.g., GitHub Ruleset)

**CI-ViTo Governance** operationalizes R6 by defining:
- **WHAT** gates are allowed to block (via criteria)
- **WHY** they block (via auditability requirement)
- **HOW** they are maintained (via registry)

### Canonical Workflow Hierarchy

| Layer | Artifact | Authority | Example |
|-------|----------|-----------|---------|
| **Constitution** | `ARCHITECTURAL_WORKING_RULES.md` | Defines governance philosophy | R6: Governance as Code |
| **Law** | `CI_VITO_GOVERNANCE.md` (this doc) | Defines blocking criteria | CI-VITO-RULE-001 |
| **Registry** | `CI_VITO_RULE_REGISTRY.md` | Inventories all gates | 22 workflows classified |
| **Enforcement** | `.github/workflows/*.yml` | Executes checks | `integrity-gates.yml` |
| **Evidence** | Scripts (`scripts/check-*.mjs`) | Verifiable truth | `check-merge-markers.mjs` |

---

## 6. What is Explicitly Forbidden

- **Authority by Inheritance:** No workflow may block PRs simply because "it's in the CI pipeline."
- **Undocumented Gates:** No workflow may block without a corresponding entry in `CI_VITO_RULE_REGISTRY.md`.
- **XTR-Based Validation:** All XTR-related gates are RETIRED (XTR is deprecated).
- **Duplicate Gates:** Multiple workflows checking the same invariant (consolidate to ONE canonical gate).
- **Style-Only Blockers:** Linting/spelling/formatting gates MUST be non-blocking unless they validate architectural invariants (e.g., i18n key structure).

---

## 7. Gate Lifecycle

### Adding a New Gate
1. **Propose:** Draft a gate with clear purpose, necessity, and evidence.
2. **Document:** Add entry to `CI_VITO_RULE_REGISTRY.md` with ALL fields completed.
3. **Implement:** Create script (`scripts/check-*.mjs`) and workflow (`.github/workflows/*.yml`).
4. **Validate:** Run against existing PRs to confirm determinism and proportionality.
5. **Activate:** Set as required check in branch protection rules.

### Retiring an Existing Gate
1. **Verify:** Confirm gate is bypassed OR redundant OR not aligned.
2. **Document:** Update registry with `Decision: RETIRE` and rationale.
3. **Deprecate:** Replace gate logic with success shim (`echo "Legacy bypassed"`).
4. **Delete:** Remove workflow file after 1 sprint (allows rollback).

### Degrading a Gate (Blocking → Warning)
1. **Evaluate:** Gate fails proportionality OR determinism but still provides value.
2. **Document:** Update registry with `Blocking: NON-BLOCKING` and rationale.
3. **Modify:** Change workflow to `continue-on-error: true` OR remove from required checks.

---

## 8. Enforcement and Audit

### Self-Correction
- AI collaborators MUST verify new workflows against CI-VITO-RULE-001 before proposing.
- Human architects verify registry completeness during PR review.

### Periodic Audit
- **Quarterly:** Review all blocking gates for continued necessity/alignment.
- **On Incident:** If a gate produces false positive/negative, audit immediately.

### Governance Override
- If a gate must violate criteria (e.g., external compliance requirement), document as **EXCEPTION** in registry with:
  - Compliance standard (e.g., SOC2, ISO27001)
  - Expiration date or re-evaluation trigger
  - Owner responsible for compliance

---

## 9. Examples

### Example 1: KEEP (Meets All Criteria)
**Gate:** `check-merge-markers.mjs` in `integrity-gates.yml`
**Rationale:**
- **Necessary:** Prevents broken merges from reaching production
- **Proportional:** 2s execution time, trivial maintenance
- **Aligned:** Enforces R6 (Governance as Code)
- **Deterministic:** Regex-based, no external dependencies
- **Auditable:** Registered in `CI_VITO_RULE_REGISTRY.md`
- **Externalized:** N/A (internal invariant)

**Decision:** **KEEP** as blocking.

---

### Example 2: RETIRE (XTR Obsolete)
**Gate:** `validate-methodology.yml` (XTR validation)
**Rationale:**
- **Necessary:** NO (XTR is deprecated)
- **Aligned:** NO (XTR not in Canon)

**Decision:** **RETIRE** (already bypassed with success shim).

---

### Example 3: DEGRADE (Style-Only)
**Gate:** Hypothetical `spell-check.yml` (blocks on typos)
**Rationale:**
- **Necessary:** NO (typos don't break production)
- **Externalized:** NO (blocks arbitrarily)

**Decision:** **DEGRADE** to warning OR make non-blocking.

---

### Example 4: PORT (Valid but Redundant)
**Gate:** `hardcoding-check.yml` (bypassed, but intent valid)
**Rationale:**
- **Necessary:** YES (prevents secrets in code)
- **Aligned:** YES (security invariant)
- **Current State:** BYPASSED (redundant workflow)

**Decision:** **PORT** hardcoding check to `quality-gate.yml` as a single consolidated step.

---

## 10. Future Evolution

### Planned Extensions
- **FIT_009_CI_GOVERNANCE_COMPLIANCE.md:** Automated compliance check that verifies all workflows in `.github/workflows/` have registry entries.
- **Registry Automation:** Script that generates registry skeleton from workflow YAML files.
- **Gate Telemetry:** Track gate execution time, failure rate, false positive rate.

### Open Questions
- Should deployment gates (`deploy.yml`, `production.yml`) follow different criteria? (Answer: YES, document in v1.1)
- How to handle feature-specific gates (e.g., `check-admin-panel.yml`)? (Answer: Allow if scoped to feature PRs only)

---

## 11. Canonical Authority

This document is **CANON** under `ARCHITECTURAL_WORKING_RULES.md`.

**Supersedes:**
- All undocumented CI assumptions
- All XTR-based CI validation
- All "we've always done it this way" rationales

**Complements:**
- `ARCHITECTURAL_WORKING_RULES.md` (R6: Governance as Code)
- `CRITICAL_DEPENDENCY_GOVERNANCE.md` (third-party security gates)
- `I18N_INTEGRITY_GATES.md` (translation validation gates)

---

**End of CI_VITO_GOVERNANCE.md**
