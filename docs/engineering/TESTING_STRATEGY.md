# ViTo - VibeThink Orchestrator Testing Strategy v1.0.2

**Status**: ENFORCEABLE
**Scope**: Safe, precise change with no unplanned refactor
**Last Updated**: 2026-01-04

## 1) Principles
- Safe, precise change is mandatory.
- No unplanned refactor. If refactor is required, stop and scope it explicitly.
- Tests should match the scope of change.

## 2) Default Pipeline
Minimum required in CI:
- `pnpm run lint`
- `pnpm run type-check`
- `pnpm run test`
- `pnpm run build`

## 3) Change-Based Testing
- Docs-only change: author is not required to run runtime tests locally; CI still runs the full gate.
- Small code change: run lint, type-check, and targeted tests.
- Feature change: run full test suite and build.

## 4) No Refactor Rule
Testing should not be used to justify refactor. If a refactor is necessary, it must be planned, approved, and isolated from feature changes.

## 5) Evidence
PRs must include a short testing note describing:
- What was run
- Why it is sufficient for the scope
