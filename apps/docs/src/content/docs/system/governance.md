# Documentation Governance Policy (Sealed)

## Authority
This document defines how documentation changes are approved and managed.
It acts as the constitution for the `/docs` directory.

## Rules
1. **Docs First**: No major feature merge without updated docs.
2. **Canonical Location**: Logic and reasoning live in `/docs`.
3. **No Duplication**: Do not copy-paste. Link to Canon.
4. **Phase Plan**: Features must belong to an active Phase.

## Update Protocol
- **Minor Fix**: Direct PR allowed (typos, clarity).
- **Policy Change**: Requires "Decision Record" (DR).
- **Architecture Change**: Requires "Architecture Decision Record" (ADR).

## Review Gates
- Docs must pass linting (markdownlint).
- Broken links block merge.
- Phase 2 features must have a "Planned" block.
