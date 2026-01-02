# Canon: Spec-Driven Execution Method

**Status:** CANON (P0)
**Version:** 1.0.0
**Date:** 2025-12-31
**Authority:** Principal Product Architect

---

## 🎯 Purpose

This document defines the **"OpenSpec + Conductor"** methodology used in ViTo.
We treat **Process as Code**. Architecture is not an abstract concept; it is a rigorous, auditable execution path.

The goal is to eliminate "silent assumptions" and ensure every PR traces back to an approved Design Decision.

---

## 👥 Roles & Authority

### The Principal Architect (Human)
- **Authority:** Absolute.
- **Responsibilities:**
    - Approves Specs.
    - Canonizes decisions.
    - Activates enforcement gates (Required Checks).
    - Resolves conflicts between Canon documents.

### The Co-Architect AI (Gemini / Claude)
**Authorized to:**
- Propose and draft canonical process documentation.
- Design FIT intent and structure (Purpose, Scope, Evidence).
- Detect inconsistencies across Canon documents.
- Suggest reconciliations or deprecations.
- Write Specs confirming to Canon.

**NOT Authorized to:**
- Canonize decisions (Must be "Proposed").
- Activate enforcement or required checks.
- Introduce architectural decisions without human approval.
- Implement automated gate logic without explicit instruction.

---

## 🔄 The Protocol: Spec → PR

Every significant change must follow this lifecycle. **"Significant"** is defined as any change that affects:
- Data Models / Schema
- API Contracts
- Architectural Boundaries
- Critical Flows (Auth, Payment, Permissions)
- New Feature Capabilities

### Phase 1: The Spec (Planning)
1.  **Draft**: Creates `docs/specs/SPEC-[ID]_[NAME].md` using `docs/templates/SPEC_TEMPLATE.md`.
2.  **Review**: User (Architect) reviews the Spec.
3.  **Approve**: User marks Spec as ✅ APPROVED.

### Phase 2: The Execution (Coding)
1.  **Branch**: Create branch linked to Spec (e.g., `feat/spec-001-specialists`).
2.  **Code**: Implement changes.
3.  **Verify**: Run FIT stubs or scripts defined in Spec.

### Phase 3: The PR (Audit)
1.  **Open PR**: Use `docs/templates/PR_TEMPLATE_SPEC_DRIVEN.md`.
2.  **Link**: Description MUST link to the Spec ID.
3.  **Check**: `validate-spec-links.js` (Gate Stub) verifies the link exists.
4.  **Merge**: Only after Gates pass.

---

## 📜 Audit Trail

- **Deleted Workflows**:
    - `validate-methodology.yml`: Removed in PR `fix/workflows-alignment` (2025-12-31) due to missing executable dependencies (`validate-methodology-alignment.py`). Replaced by `methodology-verification.yml`.

---
