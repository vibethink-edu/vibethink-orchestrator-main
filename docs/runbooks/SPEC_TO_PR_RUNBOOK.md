# Runbook: Spec to PR Lifecycle

**Target Audience:** AI Agents & Developers
**Version:** 1.0

---

## 1. Do I need a Spec?
**YES** if:
- Changing Data Schema
- Changing API Contract
- Creating new Component/Module
- Changing Logic in `packages/utils`

**NO** (Direct PR) if:
- Fixing typos/docs
- CSS styling tweaks (visual only)
- Minor bugfix (one-line)

## 2. Creating the Spec
1.  Copy `docs/templates/SPEC_TEMPLATE.md` to `docs/specs/SPEC-[NEXT_ID]_[SNAKE_CASE_TITLE].md`.
2.  Fill in ** Context**, **Decision**, and **Invariants**.
3.  Ask Principal Architect for **APPROVAL**.

## 3. Implementation
1.  Create branch `feat/spec-[id]-[short-name]`.
2.  Implement code matching **Scope IN**.
3.  Respect **Invariants**.

## 4. Opening the PR
1.  Use `docs/templates/PR_TEMPLATE_SPEC_DRIVEN.md`.
2.  **CRITICAL**: You MUST paste the link to your Spec in the "Spec Reference" section.
3.  Run validation locally: `node scripts/validate-spec-links.js` (verify stub passes).

## 5. Merging
1.  Ensure all Checks pass (Integrity, Methodology).
2.  Squash & Merge.
