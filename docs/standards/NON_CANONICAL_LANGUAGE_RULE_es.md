# Non-Canonical Language Rule

Status: ACTIVE
Last Updated: 2026-01-05

## Rule (Normative)
- MUST: `docs/canon/` remains English-only. No Spanish content or Spanish file names in Canon.
- MUST: Spanish documentation is allowed only as NON-CANONICAL and must use the `_es` suffix.
- MUST: Every Spanish doc must include the required NON-CANONICAL header block.
- SHOULD: Keep Spanish docs in operational or reference areas (for example: `docs/operations/`, `docs/standards/`).
- MAY: Provide a canonical English counterpart, but the Spanish file is never Canon.

## Required Header (Spanish Docs)
Every Spanish doc must include this header near the top (first 20 lines):

```
Status: NON-CANONICAL
Language: ES
Scope: Operational reference only
Canon-Impact: NONE
```

## File Naming
- Spanish docs MUST end with `_es.md`
- Example: `docs/operations/incident_runbook_es.md`

## Examples

Correct:
- `docs/operations/incident_runbook_es.md`
- `docs/standards/non_canonical_language_rule_es.md`
- `docs/standards/PORT_CONVENTIONS.md` (English)
- `docs/canon/REASONING_ORCHESTRATOR_EXECUTION_SPEC.md` (English)

Incorrect:
- `docs/canon/guia_operativa.md` (Spanish in Canon)
- `docs/operations/guia_operativa.md` (Spanish without `_es`)
- `docs/operations/incident_runbook_es.md` without the NON-CANONICAL header
- `docs/canon/anything_es.md` (Spanish suffix in Canon)

## Enforcement
- Local check: `node scripts/hygiene/check-noncanonical-language.js`
- CI: `.github/workflows/hygiene-language.yml`
