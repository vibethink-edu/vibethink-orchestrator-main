# FIT-006: Core + Domain Pack Contract

## Status
STUB — Not Automated
*(Status in Canon: PASS - But strict enforcement required)*

## Purpose
To verify that the Core is agnostic and all domain-specific logic (Hotel, Studio, etc.) lives in isolated Declarative Packs (JSON/Types).

## Scope
- **IN**: Verification of `concept-*.json` files and `ProductContext` types.
- **OUT**: User interface rendering.

## Enforcement
- Manual: YES
- Automated: NO (planned)

## Evidence
- Path(s): `packages/utils/src/i18n/terminology/`
- Command(s): `node scripts/validate-concepts-coherence.js` (Existing)
