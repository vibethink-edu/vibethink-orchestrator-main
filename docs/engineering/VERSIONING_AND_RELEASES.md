# ViTo - VibeThink Orchestrator Versioning and Releases v1.0.2

**Status**: ENFORCEABLE
**Scope**: SemVer, changelog, and release hygiene
**Last Updated**: 2026-01-04

## 1) Versioning
- SemVer is mandatory: MAJOR.MINOR.PATCH.
- Patch: fixes and safe, scoped changes.
- Minor: backward-compatible features.
- Major: breaking changes (must include migration notes).

## 2) Changelog
- Update `CHANGELOG.md` for any user-impacting change.
- Keep entries short and factual.

## 3) Release Steps
1) Confirm CI green.
2) Update `CHANGELOG.md`.
3) Tag release with SemVer.
4) Ensure no unplanned refactor is included.
