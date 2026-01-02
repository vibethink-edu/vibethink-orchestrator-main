# METHODOLOGY COMPATIBILITY ASSESSMENT

**Status:** DRAFT
**Subject:** OpenSpec + Conductor Compatibility
**Date:** 2025-12-31

---

## 1. INVENTORY OF DEFINITIONS

Current architectural concepts identified in the repository:

| Concept | Location(s) | Status | Risk of Drift |
| :--- | :--- | :--- | :--- |
| **Canon** | `docs/canon/00_CANON_INDEX.md` | ✅ DEFINED | Low. Centralized index exists. |
| **Spec** | `docs/canon/SPEC_EXECUTION_METHOD.md` | ✅ DEFINED | Low. Template and protocol defined. |
| **FIT** | `docs/canon/00_CANON_INDEX.md`, `docs/fits/` | ✅ DEFINED | Low. Gates are explicit. |
| **Distance** | `docs/canon/CRITICAL_DEPENDENCY_GOVERNANCE.md` | ✅ DEFINED | Low. Distance 0-3 model clear. |
| **Stash** | `docs/stash/`, `PENDING_ARCHITECTURAL_STASH.md` | ⚠️ IMPLICIT | **Med**. Defined by folder existence, needs formal definition. |
| **Projection** | `docs/stash/architecture/WEBSITE_PROJECTION_CONTRACT.md` | ⚠️ EMERGENT | **Med**. Used in recent stash, not yet in Canon core. |
| **Event (Canonical)** | `docs/canon/06_OPERATIONAL_MEMORY_CONTRACT.md` | ✅ DEFINED | Low. Part of Memory Layer contract. |
| **Specialist** | `docs/canon/02_AI_FIRST_3_LAYER_ARCHITECTURE.md` | ✅ DEFINED | Low. Core architectural component. |

**Observation:** The core "Government" (Canon, FIT, Spec) is well-defined. The "Business Pattern" layer (Stash, Projection) is emerging and needs consolidation.

---

## 2. CONSOLIDATION PROPOSAL

**Recommendation:** Do NOT create a monolithic Glossary. Instead, use an **Index-Driven** approach.

1.  **Canon Index (`00_CANON_INDEX.md`)**: Remains the source of truth for *Governance* terms (Canon, FIT, Gate).
2.  **Architecture Index (`02_AI_FIRST...`)**: Source of truth for *Structural* terms (Memory, Reasoning, Projection).
3.  **New: `docs/canon/GLOSSARY.md` (Optional)**: Only if we need to define cross-cutting terms like "Stash" or "Pilot" that don't fit above.
    *   *Correction:* Better to define "Stash" in `SPEC_EXECUTION_METHOD.md` as a valid state of a Spec/Pattern.

**Action:** Update `SPEC_EXECUTION_METHOD.md` to explicitly define "Stash" as a pre-Spec holding area.

---

## 3. OPENSPEC COMPATIBILITY MAPPING

**Current State:** Highly Compatible.
*   We already use `docs/specs/SPEC-[ID].md`.
*   We already have `SPEC_TEMPLATE.md`.
*   We already link PRs to Specs (Traceability).

**Gap Analysis:**
*   **State Model:** OpenSpec often uses strict states (Draft -> Review -> Approved -> Implemented). We use simple markdown headers or file status.
*   **Separation:** We mix strictly architectural specs with feature specs. OpenSpec suggests keeping them cleaner.

**Verdict:** ViTo is **Native Compatible** with OpenSpec. No friction.

---

## 4. CONDUCTOR (Gemini CLI) COMPATIBILITY

**Concept:** Conductor typically uses a per-track folder structure:
`tracks/[track-name]/spec.md`
`tracks/[track-name]/plan.md`

**ViTo Current:**
`docs/specs/SPEC-001.md` (Flat list)

**Friction Points:**
1.  **Folder Structure:** We have a flat `docs/specs` folder. Conductor prefers "Tracks".
2.  **Naming:** We use semantic IDs (`SPEC-001`). Conductor often defaults to `spec.md` inside a named folder.

**Resolution strategy:**
We can map **One Spec = One Track**.
Instead of `docs/specs/SPEC-001_TITLE.md`, we could move to `docs/tracks/001-title/spec.md`.

**Pros:**
*   Keeps `plan.md` (execution steps) next to `spec.md` (definition).
*   Allows local assets (images, diagrams) per spec.

**Cons:**
*   Migration of existing specs (low impact, we only have a few).
*   "Tracks" might imply long-running streams, whereas our Specs are often atomic changes.

**Verdict:** **Compatible with Adaptation.** We can treat our "Specs" as "Tracks" if we adopt the folder structure.

---

## 5. PILOT PROPOSAL (Docs Only)

**Goal:** Test the "Track" structure for the Restaurant POC without breaking existing Specs.

**Pilot:** `docs/tracks/poc-restaurant-omnichannel/`

**Structure:**
*   `spec.md`: The content from `SPEC-001`.
*   `plan.md`: The execution plan (currently in `task.md` or `implementation_plan.md`, but scoped just to this POC).
*   `context.md` (Optional): Links to the Stash patterns used.

**Why this is reversible:**
*   It's just a folder creation.
*   If we hate it, we move `spec.md` back to `docs/specs/SPEC-00X.md` and delete the folder.

**Recommendation:** Proceed with this Pilot for the Restaurant POC.
