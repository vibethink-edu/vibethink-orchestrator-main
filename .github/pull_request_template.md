# PR Summary
Briefly describe the change and its purpose.

## Scope Guardrails
- [ ] This change is a safe, precise change.
- [ ] No unplanned refactor is included.

## Canon and Naming
- [ ] Any eventType values (if present) match the sealed canonical identifiers exactly (no case changes, no new identifiers).
- [ ] Canonical naming is used (per /docs/engineering/NAMING_CONVENTIONS.md).
- [ ] No ontology or AI-first architecture changes are introduced.

## Multi-tenant Safety
- [ ] Tenant scoping is enforced where applicable.
- [ ] Workspace scoping is enforced where applicable.
- [ ] No cross-tenant access paths are introduced.

## Testing
- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm run test`
- [ ] `npm run build`

Testing notes:

## Documentation
- [ ] Updated docs where needed:
  - [/docs/engineering/RECTOR_PACK_V1.md](/docs/engineering/RECTOR_PACK_V1.md)
  - [/docs/engineering/NAMING_CONVENTIONS.md](/docs/engineering/NAMING_CONVENTIONS.md)
  - [/docs/engineering/TESTING_STRATEGY.md](/docs/engineering/TESTING_STRATEGY.md)
  - [/docs/engineering/CODE_STYLE.md](/docs/engineering/CODE_STYLE.md)
  - [/docs/engineering/VERSIONING_AND_RELEASES.md](/docs/engineering/VERSIONING_AND_RELEASES.md)
  - [/docs/engineering/DOCUMENTATION_SYSTEM.md](/docs/engineering/DOCUMENTATION_SYSTEM.md)
  - [/docs/engineering/CODE_REVIEW_PROCESS.md](/docs/engineering/CODE_REVIEW_PROCESS.md)
