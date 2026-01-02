# FIT-001: Specialists Existence

## Status
STUB — Not Automated

## Purpose
To verify that the "Reasoning Layer" is not just an API call, but a structured "Specialist" architecture where domain experts (Hotel, Studio, etc.) have distinct identities and memory access patterns.

## Scope
- **IN**: Verification of `SpecialistRegistry`, `SpecialistBase` class, and distinct instances for at least 2 domains.
- **OUT**: Quality of reasoning or specific prompt engineering.

## Enforcement
- Manual: YES (Architect Code Review)
- Automated: NO (planned)

## Evidence
- Path(s): `src/core/reasoning/specialists/`
- Command(s): `node scripts/validate-architecture-structure.js --layer specialists` (Future)
