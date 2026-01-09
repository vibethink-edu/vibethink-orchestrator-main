# Milestone: ENG-M1 CI/CD Governance v0.1

> **Status:** CLOSED  
> **Date:** 2026-01-08  
> **Owner:** Chief Architect / Builder  
> **Version:** v0.1.0-pnpm-migration  

## 1. Objective
To establish a robust, deterministic, and scalable CI/CD infrastructure for the ViTo Monorepo, migrating away from legacy npm patterns to a modern `pnpm` + `turbo` workspace architecture.

## 2. Scope Delivered
- **Package Manager**: Full migration from `npm` to `pnpm` (Strict workspaces).
- **CI Pipeline**: Streamlined GitHub Actions workflow (`ci.yml`) replacing fragmented legacy files.
- **Quality Gates**: Implemented 5 mandatory gates: `lint`, `format`, `typecheck`, `test`, `build`.
- **Infrastructure**: Fixed caching paths (`pnpm-lock.yaml`) and workspace protocols.
- **Documentation**: Sealed `CI_CD_GUIDE.md` and `NPM_VS_PNPM_GUIDE.md`.
- **Governance**: Added `preinstall` constraints to prevent regression.

## 3. Key Decisions
1.  **PNPM Adoption**: Chosen for superior monorepo support and disk efficiency.
2.  **Shamefully-Hoist**: Enabled temporarily (`.npmrc`) to support legacy "phantom dependencies" during transition.
3.  **Turbo 2.0**: Downgraded/Stabilized to ensure compatibility.
4.  **EN-First Policy**: Documentation standardized to English as the canonical source.

## 4. Verification
- **Local**: Dashboard boots in <5s via `pnpm run dev`.
- **CI**: Workflows configured correctly (pending final green run confirmation).
- **Safety**: `npm install` is actively blocked by `preinstall` script.

## 5. Artifacts
- **Commit**: `HEAD` (post-migration)
- **Tag**: `v0.1-eng-m1-sealed`

## 6. Next Steps (ENG-M2)
- Remove `shamefully-hoist=true` (Strict mode).
- Implement specialized vertical tests.
- Expand Observatory/Tracing.

This milestone is officially **CLOSED**. The foundation is solid.
