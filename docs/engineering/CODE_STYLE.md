# ViTo - VibeThink Orchestrator Code Style v1.0.2

**Status**: ENFORCEABLE
**Scope**: Code style, lint discipline, and safety
**Last Updated**: 2026-01-04

## 1) General
- Favor readability and minimal change.
- Keep diffs small and scoped to the stated goal.

## 2) TypeScript Rules
- No implicit any. Avoid `any` unless explicitly approved.
- Keep interfaces and types aligned with canonical naming.

## 3) Lint Discipline
- `eslint-disable` is forbidden unless there is a clear written justification.
- Use the smallest possible disable scope, on a single line or block.

## 4) Comments
- Comments are rare and only for non-obvious reasoning.
- Do not add filler comments.

## 5) Dependencies
- Prefer standard tooling and avoid vendor lock.
- Do not add new dependencies without explicit approval.
