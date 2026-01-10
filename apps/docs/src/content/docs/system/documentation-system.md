# Documentation System & Strategy (Sealed)

## Purpose & Scope
This system establishes the "Docs-as-Code" source of truth for ViTo.
We distinguish strictly between:
1. **Canonical Docs**: Governance, Architecture, Standards (Live in `/docs`).
2. **Consumer Docs**: API references, user guides (Live in `apps/docs`, generated from Canon).

## Documentation Stack (Sealed)
- **Engine**: [Astro Starlight](https://starlight.astro.build/)
- **Strategy**: Static Site Generation (SSG).
- **Source**: Local Markdown/MDX files synced from `/docs`.
- **Styling**: Starlight Default + Custom CSS extensions.
- **Search**: Pagefind (Static, no external dependencies).

## Phase Markers
- **Phase 1 (Enforced)**: Current operational reality. Must be obeyed.
- **Phase 2 (Planned)**: Future scope. Not enforced yet.
- **Legacy/Deprecated**: Explicitly marked for removal.

## Enforcement Levels
- **SEALED**: Immutable without governance vote.
- **Standard**: Team-wide agreement. PR require alignment.
- **Draft/RFC**: Open for discussion.
- **Enforced**: Automated by CI/CD where possible.

## Visibility & Publishing Strategy
- **Level 1: Internal (Default)**: Protected by Repo/Org authentication. Visible only to developers.
- **Level 2: Public Consumer**: Explicitly marked for export to public portals (e.g., API references).
  - *Mechanism*: Docs tagged with `visibility: public` in frontmatter can be synced to separate public mirrors.
  - *Current State*: All docs in Starlight inherit repository privacy.

## What is NOT allowed
- Marketing hype.
- Roadmap promises without design docs.
- "Coming soon" placeholders without Phase 2 approval.
- Undocumented features in production.

## How to Read
- Start with `DOCS_GOVERNANCE.md`.
- Check `DOCS_INDEX.md` for navigation.
- If a doc contradicts Code: Code *should* align, but Doc is the Intent.
