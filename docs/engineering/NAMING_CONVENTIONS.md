# ViTo - VibeThink Orchestrator Naming Conventions v1.0.2

**Status**: ENFORCEABLE
**Scope**: Canonical naming, eventType rules, and DB starter rules
**Last Updated**: 2026-01-04

## 1) Canonical Terms (Sealed)
All entity and signal names must align with `/docs/canon/` (see the sealed ontology spec file in that folder).

Canonical signals:
- Communication Signal
- Interaction Signal
- Commitment Signal
- Knowledge Artifact
- Temporal Context

Canonical world entities:
- Person
- Organization
- Case
- Program
- Tenant
- Workspace
- Identity User
- Organization Unit
- Capability Activation

Notes:
- "Interaction Event" is not used. The canonical name is Interaction Signal.
- "Workspace Member" is not an entity. Membership is represented by relationships and events.

## 2) Event Type Rule (Exact Match Required)
- eventType MUST equal the exact identifier defined in the sealed ontology spec under `/docs/canon/`.
- DO NOT create or enumerate new event types in engineering docs.
- In code, eventType values MUST be referenced from a single canonical constants module (path defined by the repo) rather than inlined.

## 3) DB Starter Rules (Multi-tenant Safe)
- All TENANT-SCOPED operational tables MUST include `tenant_id`.
- Global tables (if any) MUST be explicitly declared global and MUST NOT contain tenant data.
- Workspace-scoped tables MUST include `workspace_id`; `tenant_id` inclusion follows the sealed persistence canon.

## 4) Timestamp Standards
- `created_at` and `updated_at` are required for operational tables.
- `deleted_at` is required for soft delete, when deletion is allowed.
- `occurred_at` is required for event records.
- `ingested_at` and `processed_at` are used for signal ingestion where applicable.

## 5) Foreign Keys and Indexes (Minimum)
- FKs must include tenant context either directly or via the parent FK.
- Minimum indexes:
  - `(tenant_id, id)` or `(tenant_id, created_at)` for tenant-scoped tables
  - `(workspace_id, id)` or `(workspace_id, created_at)` for workspace-scoped tables
  - `(occurred_at)` or `(tenant_id, occurred_at)` for event tables where applicable

## 6) Naming Style
- Entities are singular nouns: Person, Case, Organization.
- Tables are plural snake_case: persons, cases, organizations.
- Relations are verbs: has_participant, binds, contains.
