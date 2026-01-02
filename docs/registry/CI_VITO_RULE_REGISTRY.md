# CI-ViTo Rule Registry

**Version:** 1.1.0 (Evidence-Verified)
**Last Updated:** 2026-01-01
**Status:** ACTIVE
**Owner:** Platform Architects

---

## 1. Purpose

This registry inventories ALL CI workflows in `.github/workflows/` (verified via `ls -1`) and classifies them according to **CI-VITO-RULE-001** (see [`CI_VITO_GOVERNANCE.md`](../canon/CI_VITO_GOVERNANCE.md)).

**Evidence Method:** Direct filesystem verification (`ls -1 .github/workflows`), workflow file inspection, bypass shim detection (`grep -l "Legacy bypassed"`).

**Branch Protection Status:** `main` branch is **NOT PROTECTED** (GitHub API HTTP 404). No required checks to preserve.

**Fields:**
- **Workflow:** File name in `.github/workflows/`
- **Owner:** Team/role responsible for maintenance
- **Purpose:** What the workflow validates
- **Alignment:** Aligned with ViTo Canon / Partial / Not Aligned / XTR-Legacy
- **Necessity:** CRITICAL / HIGH / MEDIUM / LOW / OBSOLETE
- **Blocking:** BLOCKING / CONDITIONAL / NON-BLOCKING / BYPASSED
- **Decision:** KEEP / DEGRADE / RETIRE / NEEDS_CONFIRMATION
- **Evidence:** Workflow file + key characteristics

---

## 2. Registry Table (23 Workflows Verified)

### 2.1 CRITICAL GATES (BLOCKING, KEEP)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `integrity-gates.yml` | Platform | Merge markers, JSON syntax, FIT gates, Google adapter skeleton | **ALIGNED** | **CRITICAL** | **BLOCKING** | **KEEP** | Lines 25-35: `check-merge-markers.mjs`, `check-json-parse.mjs`, `fit:enterprise-signals:001`, `verify:google-adapter-skeleton`. **NO SHIM**, validaciones reales. |
| `quality-gate.yml` | Platform | Type-check, lint, unit tests, npm audit, hardcoding check | **ALIGNED** | **CRITICAL** | **BLOCKING** | **KEEP** | Lines 13-17: `npm ci`, `npm run type-check`, `npm run lint`, `npm run test:unit`, `npm audit`, `npm run check-hardcoding`. **Tiene bypass shim en grep, PERO ejecuta validaciones reales**. Verificar contenido completo. |

**Rationale:**
- `integrity-gates.yml`: Validaciones arquitectónicas críticas (merge safety, JSON integrity, FIT compliance)
- `quality-gate.yml`: Requiere inspección adicional (aparece en grep bypass, pero contiene steps reales)

**Action Required:**
- [ ] **HUMAN REVIEW**: Inspeccionar `quality-gate.yml` completo para confirmar si tiene shims O validaciones reales

---

### 2.2 DEPLOYMENT & ENVIRONMENT GATES (CONDITIONAL, KEEP)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `production.yml` | Deploy | Production release pipeline | **ALIGNED** | **CRITICAL** | **BLOCKING** | **KEEP** | Production deployment workflow. **NO SHIM**. |
| `deploy.yml` | Deploy | Production deployment automation | **ALIGNED** | **CRITICAL** | **CONDITIONAL** | **KEEP** | Deployment pipeline (blocks on prod branches). **NO SHIM**. |
| `staging.yml` | Deploy | Staging environment deployment | **ALIGNED** | **HIGH** | **CONDITIONAL** | **KEEP** | Staging pipeline (conditional on branch). **NO SHIM**. |
| `development.yml` | Deploy | Development environment deployment | **ALIGNED** | **HIGH** | **NON-BLOCKING** | **KEEP** | Dev pipeline (informational). **NO SHIM**. |

**Rationale:**
- Essential deployment automation
- No shims detected (real deployment logic)
- Aligned with ViTo deployment model

---

### 2.3 FEATURE-SPECIFIC GATES (CONDITIONAL/BYPASSED)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `check-admin-panel.yml` | Feature | Admin panel-specific validation | **ALIGNED** | **MEDIUM** | **BYPASSED** | **NEEDS_CONFIRMATION** | **HAS BYPASS SHIM**. Path-conditional gate. Determine if admin panel validation still needed. |

**Action Required:**
- [ ] **CONFIRM**: Is admin panel validation still necessary? If YES, restore. If NO, RETIRE.

---

### 2.4 OBSERVABILITY & MONITORING GATES (NON-BLOCKING, KEEP)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `cost-monitoring.yml` | Observability | CI cost tracking and reporting | **ALIGNED** | **MEDIUM** | **NON-BLOCKING** | **KEEP** | Monitoring workflow (informational). **NO SHIM**. |
| `kpi-automation.yml` | Observability | KPI metrics automation | **ALIGNED** | **MEDIUM** | **NON-BLOCKING** | **KEEP** | Reporting workflow (non-critical). **NO SHIM**. |
| `third-party-monitoring.yml` | Observability | Third-party dependency monitoring | **ALIGNED** | **MEDIUM** | **NON-BLOCKING** | **KEEP** | Security monitoring (alerts only). **NO SHIM**. |
| `upgrade-monitor.yml` | Observability | Dependency update monitoring | **ALIGNED** | **MEDIUM** | **NON-BLOCKING** | **KEEP** | Informational (suggests updates). **NO SHIM**. |
| `update-route-docs.yml` | Docs | Route documentation automation | **ALIGNED** | **LOW** | **NON-BLOCKING** | **KEEP** | Documentation sync (non-blocking). **NO SHIM**. |

**Rationale:**
- Provide valuable telemetry without blocking PRs
- No shims detected (real monitoring logic)
- Aligned with ViTo observability principles

---

### 2.5 XTR LEGACY GATES (BYPASSED, RETIRE)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `validate-methodology.yml` | Legacy | XTR methodology validation | **XTR-LEGACY** | **OBSOLETE** | **BYPASSED** | **RETIRE** | Line 13: `echo "Legacy bypassed for Phase 2"`. **XTR deprecated per canonical ruling**. |
| `documentxtr.yml` | Legacy | XTR documentation automation | **XTR-LEGACY** | **OBSOLETE** | **BYPASSED** | **RETIRE** | Line 13: `echo "Legacy bypassed for Phase 2"`. **XTR deprecated per canonical ruling**. |

**Canonical Authority:**
- XTR methodology is **DEPRECATED** (2026-01-01 canonical ruling)
- XTR has NO authority in ViTo governance
- Safe to RETIRE (already bypassed since Phase 2, commits 2c0564de, 532bf8dc, 09333cc0)

---

### 2.6 REDUNDANT GATES (BYPASSED, RETIRE)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `ci.yml` | Legacy | Quality & security checks | **REDUNDANT** | **OBSOLETE** | **BYPASSED** | **RETIRE** | Lines 14, 20, 25: `echo` shims. **Redundant with `quality-gate.yml`**. |
| `optimized-ci.yml` | Legacy | Cost-efficient validation | **REDUNDANT** | **OBSOLETE** | **BYPASSED** | **RETIRE** | Lines 14, 20, 25, 31: `echo` shims. **Redundant, no unique functionality**. |
| `code-quality.yml` | Legacy | Code quality checks | **REDUNDANT** | **OBSOLETE** | **BYPASSED** | **RETIRE** | Line 9: `echo` shim. **Redundant with `quality-gate.yml`**. |
| `hardcoding-check.yml` | Legacy | Hardcoding detection | **REDUNDANT** | **OBSOLETE** | **BYPASSED** | **RETIRE** | Lines 14, 20: `echo` shims. **Functionality already in `quality-gate.yml` line 17**. |

**Rationale:**
- All have bypass shims (no real validation logic executing)
- Functionality consolidated into `quality-gate.yml`
- Safe to RETIRE (no branch protection rules to break per API check)

---

### 2.7 VITO GOVERNANCE GATES (ACTIVE, KEEP)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `methodology-verification.yml` | Governance | PR spec link validation | **ALIGNED** | **MEDIUM** | **CONDITIONAL** | **KEEP** | Lines 20-25: Validates PR body contains spec link via `scripts/validate-spec-links.js`. **REAL validation, NO SHIM**. Aligned with ViTo Spec Execution Method. |

**Rationale:**
- Enforces `SPEC_EXECUTION_METHOD.md` compliance (PRs must link to specs)
- Active validation logic (no shim)
- Aligned with ViTo governance model
- Conditional blocking (only on PRs to `main`)

---

### 2.8 PORTE FRAMEWORK GATES (ACTIVE, NEEDS_CONFIRMATION)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `porte-validation.yml` | Framework | Porte component validation pipeline | **UNCLEAR** | **NEEDS_CONFIRMATION** | **CONDITIONAL** | **NEEDS_CONFIRMATION** | **482 lines, NO SHIM**. Complex pipeline: component detection, TypeScript validation, linting, unit tests, security scan, integration tests, performance tests, upstream tracking. Runs on `src/apps/**`, `src/components/**`, `src/modules/**` changes. |

**Analysis:**
- **NO bypass shim** (real validation logic)
- **Comprehensive pipeline:** 7 jobs (detect-changes, validate-porte, security-scan, integration-test, upstream-check, generate-report, deployment-ready)
- **Conditional triggers:** Only runs when Porte-managed paths change
- **Unclear alignment:** Is "Porte Framework" part of current ViTo architecture, or legacy system?

**Required Actions:**
- [ ] **HUMAN DECISION**: Is Porte Framework still valid in ViTo architecture?
  - If **YES**: Update registry with `Decision: KEEP`, document purpose in governance
  - If **NO**: Add bypass shim, mark for RETIRE
  - If **TRANSITIONING**: Degrade to NON-BLOCKING, allow opt-in

**Evidence for Review:**
- Workflow references "VTK v4.6 Porte Framework" (line 421)
- May overlap with "AI Pair Orchestrator Pro" branding
- Requires architectural decision on Porte's role in ViTo

---

### 2.9 NOISE CANDIDATES (BYPASSED, NEEDS_CONFIRMATION)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `dart-sync.yml` | Integration | Dart/Flutter synchronization | **UNCLEAR** | **NEEDS_CONFIRMATION** | **BYPASSED** | **NEEDS_CONFIRMATION** | **HAS BYPASS SHIM**. External sync workflow. Noise candidate per user validation. |
| `xtp-complete-testing.yml` | Legacy/Testing | VTK v4.6 compliance testing | **UNCLEAR** | **NEEDS_CONFIRMATION** | **BYPASSED** | **NEEDS_CONFIRMATION** | Lines 14, 20, 25: `echo` shims. Noise candidate per user validation. **VTK status unclear**—deprecated like XTR? |

**How to Confirm Value (Required Checklist):**

#### For `dart-sync.yml`:
1. **Triggers & Frequency:**
   - [ ] Identify triggers (push/PR/schedule) in workflow `on:` section
   - [ ] Check execution history: How often does it run? When was last real execution (not shim)?
   - [ ] Verify if triggered by Dart/Flutter file changes or external events

2. **Commands & Failures:**
   - [ ] What command does it execute when NOT bypassed? (inspect pre-shim version in git history)
   - [ ] What exact failure does it produce? (check historical CI logs)
   - [ ] Does failure block merges or just warn?

3. **Risk Coverage:**
   - [ ] What risk does Dart sync cover? (e.g., mobile app consistency, SDK version drift)
   - [ ] What evidence/artifact does it generate? (sync reports, version manifests)
   - [ ] Is this risk still relevant to ViTo architecture?

4. **External Dependencies:**
   - [ ] Does it depend on Dart SDK being installed in CI runners?
   - [ ] Does it call external Dart/Flutter services or repos?
   - [ ] Is Dart/Flutter integration documented in ViTo architecture docs?

5. **Owner/Consumer:**
   - [ ] Who owns Dart integration in ViTo? (Team: ________)
   - [ ] Who consumes Dart sync results? (Stakeholder: ________)
   - [ ] If unknown, mark as **Unknown** and escalate for discovery

#### For `xtp-complete-testing.yml`:
1. **Triggers & Frequency:**
   - [ ] Identify triggers (push/PR/schedule) in workflow `on:` section
   - [ ] Check execution history: When was last real execution (not shim)?
   - [ ] Is this scheduled periodic testing or PR-gated?

2. **Commands & Failures:**
   - [ ] What is "VTK v4.6 compliance testing"? (inspect workflow history for real steps)
   - [ ] What tests does it run? (unit, integration, E2E, compliance checks)
   - [ ] What failure conditions exist? (e.g., VTK spec violations)

3. **Risk Coverage:**
   - [ ] Is VTK (VibeThink Toolkit?) still a valid framework in ViTo?
   - [ ] What architectural invariants does VTK testing enforce?
   - [ ] Is VTK deprecated like XTR, or actively maintained?

4. **External Dependencies:**
   - [ ] Does it depend on VTK test harness or external VTK repo?
   - [ ] Does it validate against VTK v4.6 spec document?
   - [ ] Is VTK documented in ViTo Canon or governance docs?

5. **Owner/Consumer:**
   - [ ] Who owns VTK framework? (Team: ________)
   - [ ] Who consumes VTK compliance reports? (Stakeholder: ________)
   - [ ] If unknown, mark as **Unknown** and escalate

**Decision Criteria:**
- If **ALL 5 checklists** answered with clear value → **RESTORE** (remove shim)
- If **3+ checklists** show "Unknown" or "No" → **RETIRE** (noise confirmed)
- If **External dependencies** deprecated/unmaintained → **RETIRE**
- If **Owner/Consumer** unknown AND no recent executions → **RETIRE** (orphaned workflow)

---

### 2.10 ARCHITECTURE POLICY GATES (BYPASSED, NEEDS_CONFIRMATION)

| Workflow | Owner | Purpose | Alignment | Necessity | Blocking | Decision | Evidence |
|----------|-------|---------|-----------|-----------|----------|----------|----------|
| `validate-architecture-policies.yml` | Governance | Centralized architecture policy validation | **UNCLEAR** | **NEEDS_CONFIRMATION** | **BYPASSED** | **NEEDS_CONFIRMATION** | Line 13: `echo` shim. **Purpose unclear**—overlaps with `integrity-gates.yml` or unique policies? |

**Required Actions:**
- [ ] **CONFIRM Architecture Policies**: What policies does `validate-architecture-policies.yml` validate?
  - If **UNIQUE**: Restore, document, add to KEEP
  - If **REDUNDANT** with `integrity-gates.yml`: RETIRE
  - Check git history for pre-shim implementation to understand original intent

---

## 3. Summary Statistics (23 Workflows Verified)

| Category | Count | Blocking Status |
|----------|-------|-----------------|
| **CRITICAL GATES** | 2 | BLOCKING (1 confirmed, 1 needs review) |
| **DEPLOYMENT GATES** | 4 | CONDITIONAL/NON-BLOCKING |
| **OBSERVABILITY GATES** | 5 | NON-BLOCKING |
| **VITO GOVERNANCE GATES** | 1 | CONDITIONAL |
| **FEATURE-SPECIFIC** | 1 | BYPASSED (needs confirmation) |
| **XTR LEGACY (RETIRE)** | 2 | BYPASSED |
| **REDUNDANT (RETIRE)** | 4 | BYPASSED |
| **PORTE FRAMEWORK** | 1 | CONDITIONAL (needs confirmation) |
| **NOISE CANDIDATES** | 2 | BYPASSED (needs confirmation with checklist) |
| **ARCHITECTURE POLICIES** | 1 | BYPASSED (needs confirmation) |
| **TOTAL** | 23 | — |

---

## 4. Decision Summary

| Decision | Count | Workflows |
|----------|-------|-----------|
| **KEEP** | 12 | `integrity-gates.yml`, `production.yml`, `deploy.yml`, `staging.yml`, `development.yml`, `cost-monitoring.yml`, `kpi-automation.yml`, `third-party-monitoring.yml`, `upgrade-monitor.yml`, `update-route-docs.yml`, `methodology-verification.yml`, (`quality-gate.yml` pending review) |
| **RETIRE (XTR)** | 2 | `validate-methodology.yml`, `documentxtr.yml` |
| **RETIRE (Redundant)** | 4 | `ci.yml`, `optimized-ci.yml`, `code-quality.yml`, `hardcoding-check.yml` |
| **NEEDS_CONFIRMATION** | 5 | `quality-gate.yml` (urgent review), `check-admin-panel.yml`, `porte-validation.yml`, `validate-architecture-policies.yml`, (`dart-sync.yml` + `xtp-complete-testing.yml` = noise candidates with checklist) |

---

## 5. Branch Protection Status

**Branch:** `main`
**Protection Status:** **NOT PROTECTED** (GitHub API HTTP 404)
**Required Checks:** NONE (per API check)

**Important Clarifications:**
- **API Result:** No branch protection rules detected via GitHub API
- **NOT Permission to Delete:** Absence of API-enforced rules does NOT authorize workflow deletion
- **Unknown Policies:** Repository may have:
  - Organization-level policies (not visible to API)
  - PR approval requirements (separate from required checks)
  - Manual governance processes

**Implications:**
- **Phase 2 (Deletions) BLOCKED** until verification of:
  - [ ] Organizational PR policies (require PRs for main?)
  - [ ] Whether `quality-gate.yml` and `integrity-gates.yml` cover acceptance path
  - [ ] Explicit human authorization for each deletion

**Recommendations:**
- Add branch protection on `main` with finalized required checks AFTER governance stabilization
- Do NOT assume "not protected" = "safe to delete workflows"

---

## 6. Audit Trail

### 2026-01-01: Initial Registry (v1.0.0)
- **Auditor:** Platform Architects
- **Method:** Manual classification per CI-VITO-RULE-001
- **Evidence:** Workflow inventory from commits 2c0564de, 532bf8dc, 09333cc0
- **Findings:** 6 retirable workflows, 3 needs confirmation

### 2026-01-01: Evidence Verification (v1.1.0)
- **Auditor:** Platform Architects
- **Method:** Direct filesystem verification (`ls -1`), bypass shim detection (`grep -l`), branch protection API check
- **Source:** 23 workflows verified in `.github/workflows/`
- **Correction:** Added `methodology-verification.yml` (missed in v1.0), reclassified `porte-validation.yml` (482 lines, NO shim)
- **Findings:**
  - **XTR workflows (2):** Safe to RETIRE per canonical ruling
  - **Redundant workflows (4):** Safe to RETIRE (bypassed, functionality consolidated)
  - **Needs Confirmation (5):** Require human decision (Porte, VTK, feature-specific gates)
  - **Branch Protection:** NOT ENABLED (no required checks to break)

---

## 7. Required Human Decisions (BLOCKING REGISTRY FINALIZATION)

### URGENT (Affects Blocking Gates):
1. **quality-gate.yml**: Appears in bypass grep BUT contains real validation steps. **INSPECT FULL FILE** to confirm status.

### HIGH PRIORITY (Affects Active Pipelines):
2. **porte-validation.yml**: 482-line pipeline, NO shim. Is Porte Framework still valid in ViTo? (KEEP vs RETIRE)
3. **methodology-verification.yml**: Active spec-link validation. Confirm alignment with current governance model.

### MEDIUM PRIORITY (Feature-Specific):
4. **check-admin-panel.yml**: Bypassed. Is admin panel validation still needed?
5. **dart-sync.yml**: Bypassed. Is Dart/Flutter integration active?

### LOW PRIORITY (Legacy Cleanup):
6. **xtp-complete-testing.yml**: Bypassed. Is VTK deprecated like XTR?
7. **validate-architecture-policies.yml**: Bypassed. What policies does it validate?

---

## 8. Recommended Action Plan (Safe, Evidence-Based)

### Phase 1: Documentation ONLY (AUTHORIZED, No Risk)
**Status:** READY TO COMMIT
**Action:** Commit governance documentation (NO workflow deletions)
- Create: `docs/canon/CI_VITO_GOVERNANCE.md`
- Create: `docs/registry/CI_VITO_RULE_REGISTRY.md` (v1.1.0 Evidence-Verified)
- Update: `docs/registry/CANON_INDEX.md`
- **Rationale:** Establish governance foundation before any destructive changes
- **Risk:** NONE (documentation only)

**Commit Message:**
```
docs(ci): establish CI-ViTo governance framework and workflow registry

- Add CI_VITO_GOVERNANCE.md with CI-VITO-RULE-001 (Conditional Activation)
- Add CI_VITO_RULE_REGISTRY.md with 23 workflows verified (v1.1.0)
- Update CANON_INDEX.md with CI governance entry
- XTR methodology declared DEPRECATED per canonical ruling
- Phase 2 deletions BLOCKED pending human review

Evidence: ls -1 verification, bypass shim detection, branch protection API
Status: 6 workflows marked RETIRE, 5 marked NEEDS_CONFIRMATION
```

---

### Phase 2: Workflow Deletions (BLOCKED, Requires Authorization)
**Status:** AWAITING HUMAN REVIEW
**Blockers:**
- [ ] Verify organizational PR policies (not visible to API)
- [ ] Confirm `quality-gate.yml` status (appears bypassed but has real steps?)
- [ ] Confirm `integrity-gates.yml` covers all acceptance criteria
- [ ] Explicit authorization per workflow deletion

**Proposed Deletions (IF AUTHORIZED):**

#### Group A: XTR Legacy (2 workflows)
- `validate-methodology.yml` → RETIRE (XTR deprecated per canonical ruling)
- `documentxtr.yml` → RETIRE (XTR deprecated per canonical ruling)

#### Group B: Redundant (4 workflows)
- `ci.yml` → RETIRE (redundant with quality-gate)
- `optimized-ci.yml` → RETIRE (redundant)
- `code-quality.yml` → RETIRE (redundant with quality-gate)
- `hardcoding-check.yml` → RETIRE (functionality in quality-gate line 17)

**Prerequisites for Phase 2:**
1. Confirm `quality-gate.yml` is NOT fully bypassed (inspect full file)
2. Verify no organizational policies require these workflows
3. Human sign-off on each deletion

---

### Phase 3: Governance Decisions (Requires Human Review)
**Status:** BLOCKED ON HUMAN DECISIONS

**URGENT (Affects Blocking Gates):**
- [ ] **quality-gate.yml**: Full file inspection to confirm real validation vs shim

**HIGH PRIORITY (Active Pipelines):**
- [ ] **porte-validation.yml**: Is Porte Framework valid in ViTo architecture? (482 lines, no shim)
- [ ] **methodology-verification.yml**: Confirm spec-link validation aligns with current governance

**MEDIUM PRIORITY (Noise Candidates):**
- [ ] **dart-sync.yml**: Complete 5-point checklist (triggers, commands, risk, dependencies, owner)
- [ ] **xtp-complete-testing.yml**: Complete 5-point checklist (VTK status, tests, dependencies, owner)

**LOW PRIORITY (Feature/Policies):**
- [ ] **check-admin-panel.yml**: Is admin panel validation still needed?
- [ ] **validate-architecture-policies.yml**: What policies? Overlap with integrity-gates?

---

### Phase 4: Stabilization (Post-Decisions)
**Status:** FUTURE (after Phase 2 & 3 complete)
**Action:** Enable branch protection on `main` with finalized required checks

**Recommended Required Checks:**
- `integrity-gates.yml` (critical: merge markers, JSON, FIT gates)
- `quality-gate.yml` (if confirmed active: type-check, lint, test, audit)
- `methodology-verification.yml` (if confirmed aligned: spec-link validation)
- `porte-validation.yml` (if Porte Framework kept: component validation)

**Branch Protection Configuration:**
```yaml
required_status_checks:
  strict: true
  contexts:
    - "Integrity Checks" (integrity-gates.yml)
    - "Quality Gate" (quality-gate.yml) # if confirmed
    - "Spec Link Validation" (methodology-verification.yml) # if confirmed
    - "Validate Porte Component" (porte-validation.yml) # if kept
```

---

## 9. Evidence References

### Canonical Documents
- [`CI_VITO_GOVERNANCE.md`](../canon/CI_VITO_GOVERNANCE.md): Governance rules (CI-VITO-RULE-001)
- [`ARCHITECTURAL_WORKING_RULES.md`](../canon/ARCHITECTURAL_WORKING_RULES.md): R6 (Governance as Code)
- [`SPEC_EXECUTION_METHOD.md`](../canon/SPEC_EXECUTION_METHOD.md): Spec-link validation rationale

### Verification Commands
```bash
# List all workflows
ls -1 .github/workflows

# Find bypassed workflows
grep -l "Legacy bypassed" .github/workflows/*.yml

# Check branch protection
gh api repos/:owner/:repo/branches/main/protection
```

### Git Evidence
- Commit 2c0564de: Finalize neutralization of legacy gates
- Commit 532bf8dc: Expand success shims for PR greenness
- Commit 09333cc0: Neutralize legacy gates with success shims

---

**End of CI_VITO_RULE_REGISTRY.md (v1.1.0 Evidence-Verified)**
