# FIT-002: Entity Graph Exists

## Status
STUB — Not Automated

## Purpose
To verify that "Memory" is structured as a connected graph of Entitites (Person, Company, Deal, Project), not just disconnected tables.

## Scope
- **IN**: Schema validation for `entities` table, `relationships` table, and recursive query capabilities.
- **OUT**: Performance of graph traversal at scale.

## Enforcement
- Manual: YES (Schema Review)
- Automated: NO (planned)

## Evidence
- Path(s): `supabase/migrations/*_create_entity_graph.sql`
- Command(s): `npm run test:architecture --filter=entity-graph` (Future)
