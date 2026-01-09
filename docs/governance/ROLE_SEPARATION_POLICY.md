# Role Separation Policy: Auditor vs. Implementer

> **Context:** ViTo Engineering Governance  
> **Status:** ACTIVE / ENFORCED  

## 1. Core Definitions

### 🛠️ Coder (Implementer)
- **Responsibility:** Implements features, fixes bugs, writes tests, and produces documentation.
- **Authority:** Can modify any file within scope. Can commit and push.
- **Constraint:** **Cannot** self-approve their own work for "Production Ready" status or Phase Closure.

### 🛡️ Auditor (Reviewer)
- **Responsibility:** Validates compliance, safeguards architecture, and runs independent verification.
- **Authority:** Can `APPROVE` or `BLOCK` (Request Changes).
- **Constraint:** **MUST NOT** modify files directly. **MUST NOT** commit to the branch under review.

## 2. Non-Interference Rule
The **Auditor** role is strictly read-only regarding code changes.
- If an Auditor finds a defect, they must request a change.
- The **Coder** must perform the fix in a new commit/branch.
- *Rationale:* Prevents "fix-it-while-checking" blindness and preserves the audit trail.

## 3. Controlled Exception (The "Sequential Hat" Protocol)
A single entity (Human or AI) may exercise both roles, but **NEVER** simultaneously.

**Conditions for Dual Role Exemption:**
1.  **Distinct Moments:** You consciously stop coding, wait, and start auditing.
2.  **Explicit Declaration:** You must state/log "Switching to Auditor Role".
3.  **Isolated Branch:** Significant remediation must occur in a separate branch.
4.  **Re-Audit:** Any change made triggers a mandatory re-audit cycle.

## 4. Final Rule
**"No Phase Closure without Pure Role Audit."**

A Phase cannot be marked `CLOSED` until it has passed a final audit by an entity acting *exclusively* as Auditor at that moment.

---
*Incident Closure Ref: INCIDENT-2026-01-ROLE-SEPARATION*
