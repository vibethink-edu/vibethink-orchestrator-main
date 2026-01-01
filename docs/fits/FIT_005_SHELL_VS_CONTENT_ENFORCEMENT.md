# FIT-005: Shell vs Content Enforcement

## Status
STUB — Not Automated
*(Status in Canon: PASS - But strict enforcement required)*

## Purpose
To strictly separate the "Orchestrator Shell" (Auth, Navigation, Global Context) from "Content Modules" (Dashboards, Features).

## Scope
- **IN**: Verification that Shell components do NOT import Content components directly (must use Registry/Injection).
- **OUT**: Implementation details of the Shell.

## Enforcement
- Manual: YES
- Automated: NO (planned - `dependency-cruiser` rule)

## Evidence
- Path(s): `packages/shell`, `apps/dashboard/src/layout`
- Command(s): `npm run validate:boundaries` (Future)
