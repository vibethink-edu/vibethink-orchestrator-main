# ViTo - VibeThink Orchestrator Code Review Process v1.0.2

**Status**: ENFORCEABLE
**Scope**: PR review rules and approval gates
**Last Updated**: 2026-01-04

## 1) Mandatory Checks
- CI quality gate is green.
- CODEOWNERS approval is present.
- PR template checklist is complete.

## 2) Canonical Compliance
Reviewers must confirm:
- eventType values match the sealed ontology spec under `/docs/canon/` exactly.
- No ontology or AI-first architecture changes are introduced.
- No unplanned refactor is included.

## 3) Multi-tenant Safety
Verify:
- `tenant_id` scoping is present where required.
- Workspace scoping is correct where required.
- No cross-tenant access paths are introduced.

## 4) Scope Discipline
- Changes are scoped to the PR purpose.
- Refactor is not bundled with feature work unless explicitly approved.

## 5) Reviewer Output
Approval should state:
- What was checked
- Why it is safe
