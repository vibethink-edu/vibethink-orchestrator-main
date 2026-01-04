# ViTo Database Naming & Structure Rules

**Status**: SEALED v1.3.0
**Authority**: Engineering Rector Pack v1
**Last Updated**: 2026-01-04
**Scope**: Normative rules for all database objects in ViTo platform

---

## Non-Negotiables

1. **Multi-Tenant First**: Every tenant-scoped table MUST include `tenant_id`
2. **Audit Always**: Core entities MUST have audit fields (`created_at`, `updated_at`, `created_by_user_id`, `updated_by_user_id`)
3. **Vendor Agnostic Naming**: Naming MUST be vendor-agnostic. Implementation MAY use vendor-specific features when explicitly documented in this rulebook.
4. **Canonical Vocabulary**: Use ONLY terms from the sealed Ontologia Canonica for ViTo domain tables. Examples in this document are illustrative only and do not define canonical entities.
5. **Immutable Names**: Once in production, table/column names are contracts--renaming requires major migration
6. **Explicit Over Implicit**: Names must be self-documenting
7. **AI-Readable**: Names must be parseable by LLMs and code generators without ambiguity

---

## Vendor-Specific Features

This rulebook mandates **vendor-agnostic naming** but permits **vendor-specific implementations** when explicitly documented.

**Vendor-specific features used in this document** (annotated in examples):
- **PostgreSQL**: `UUID`, `JSONB`, `GIN` indexes, `gen_random_uuid()`, `to_tsvector()`, `plpgsql`, `TIMESTAMPTZ`, Row-Level Security (RLS)
- **pgvector extension**: `ivfflat` indexes for vector similarity

**When using vendor-specific features**:
1. Annotate in migration comments which features are vendor-specific
2. Provide alternative implementation guidance for other databases where feasible
3. Naming conventions remain vendor-agnostic (e.g., `metadata_json` not `metadata_jsonb`)

---

## Global Naming Principles

### Case & Format
- **Tables**: `snake_case`, plural nouns (e.g., `learners`, `intervention_sessions`)
- **Columns**: `snake_case`, singular descriptors (e.g., `tenant_id`, `session_status`)
- **Constraints**: `snake_case` with type prefix (e.g., `pk_`, `fk_`, `ck_`, `uq_`)
- **Indexes**: `snake_case` with type suffix (e.g., `_idx`, `_uidx`, `_gin`)
- **Migrations**: `YYYYMMDDHHMMSS_descriptive_name.sql` (timestamp + snake_case)

### Abbreviations (AVOID)
- `usr` -> `user` (AVOID -> USE)
- `sess` -> `session` (AVOID -> USE)
- `org` -> `organization` (AVOID -> USE)
- **Exception**: Industry-standard abbreviations only (`url`, `id`, `uuid`, `api`, `json`)

### Reserved Prefixes
- `sys_*`: System-internal tables (e.g., `sys_migrations`, `sys_feature_flags`)
- `tmp_*`: Temporary tables (auto-cleanup eligible)
- `archive_*`: Historical data tables
- `audit_*`: Audit trail tables

---

## Table Naming Rules

### Structure
```
[scope_prefix?]domain_entity[_qualifier?]
```

### Examples
```sql
-- Core domain entities (no prefix)
learners
intervention_sessions
cognitive_profiles
language_models

-- System tables
sys_migrations
sys_tenant_config

-- Junction tables (many-to-many)
session_interventions
learner_cohorts

-- Temporal/versioned data
intervention_snapshots
profile_versions
```

### Rules
1. **Plural nouns**: Tables contain multiple rows -> plural names
2. **No verb prefixes**: [X] `get_learners`, [X] `create_session`
3. **Domain-first**: Most significant entity comes first (e.g., `learner_sessions` not `sessions_learner`)
4. **Max 3 words** (guidance, not validation rule): SHOULD limit to 3 words; MAY exceed for canonical clarity when required
5. **Junction tables**: Alphabetically ordered entity names joined by underscore

### Do / Don't
| DON'T | DO |
|---------|------|
| `tbl_user` | `users` |
| `LearnerData` | `learners` |
| `session` | `sessions` |
| `get_active_interventions` | `interventions` |
| `learner_to_cohort_mapping` | `learner_cohorts` |

---

## Column Naming Rules

### Structure
```
[entity_]attribute[_qualifier?]
```

### Examples
```sql
-- Identity
id                    -- Primary key (UUID or BIGINT)
tenant_id             -- Multi-tenant discriminator
organization_id       -- Organizational scope

-- Attributes
session_status        -- Enum/varchar
intervention_type     -- Enum/varchar
cognitive_score       -- Numeric measurement
language_preference   -- Locale/language code

-- Relationships (foreign keys)
learner_id            -- References learners.id
created_by_user_id    -- References users.id (audit)
assigned_to_user_id   -- References users.id (business)

-- Temporal
created_at            -- Timestamp (UTC)
updated_at            -- Timestamp (UTC)
deleted_at            -- Soft delete timestamp
started_at            -- Domain-specific timestamp
completed_at          -- Domain-specific timestamp

-- Metadata
metadata_json         -- JSONB column (suffix type)
config_json           -- Configuration as JSON
tags_array            -- Array column (suffix type)
```

### Rules
1. **Singular nouns**: Column holds one value per row
2. **Foreign keys**: End with `_id` and reference table name (singular)
3. **Booleans**: Prefix with `is_`, `has_`, `can_`, `should_` (e.g., `is_active`, `has_completed`)
4. **Dates/Times**: Suffix with `_at` (timestamps) or `_date` (dates only)
5. **JSON/Arrays**: Suffix with `_json`, `_array` to indicate type
6. **Enums**: Use full column name, no `_type` suffix unless ambiguous
7. **No data type in name**: [X] `session_varchar`, [X] `score_int`

### Reserved Column Names (Audit & Multi-Tenant)
```sql
-- Multi-tenant (REQUIRED for tenant-scoped tables)
tenant_id UUID NOT NULL

-- Audit trail (REQUIRED for core entities)
-- PostgreSQL examples use TIMESTAMPTZ; adapt to platform (TIMESTAMP with app-layer UTC normalization if TZ types unavailable)
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
created_by_user_id UUID REFERENCES users(id)
updated_by_user_id UUID REFERENCES users(id)

-- Soft delete (OPTIONAL but recommended)
deleted_at TIMESTAMPTZ
deleted_by_user_id UUID REFERENCES users(id)

-- Optimistic locking (OPTIONAL)
version INTEGER NOT NULL DEFAULT 1
```

### Do / Don't
| DON'T | DO |
|---------|------|
| `SessionStatus` | `session_status` |
| `user` | `user_id` (if FK) or `username` (if attribute) |
| `active` | `is_active` |
| `create_date` | `created_at` |
| `json_data` | `metadata_json` |
| `learner_ref` | `learner_id` |

---

## Primary Keys

### Naming Convention
```
pk_{table_name}
```

### Examples
```sql
ALTER TABLE learners
  ADD CONSTRAINT pk_learners PRIMARY KEY (id);

ALTER TABLE intervention_sessions
  ADD CONSTRAINT pk_intervention_sessions PRIMARY KEY (id);

-- Composite primary key (rare, use only for junction tables)
ALTER TABLE session_interventions
  ADD CONSTRAINT pk_session_interventions PRIMARY KEY (session_id, intervention_id);
```

### Rules
1. **Single column preferred**: Use `id` as primary key (UUID or BIGINT); PK generation SHOULD be abstracted by application layer or adapter; database default is optional per platform
2. **Composite keys**: Only for junction tables or naturally composite entities
3. **Never business data**: PK should be surrogate, not natural key
4. **Immutable**: Primary keys must never change once assigned

---

## Foreign Keys

### Naming Convention
```
fk_{source_table}_{referenced_table}[_{column_qualifier}]
```

### Examples
```sql
-- Simple foreign key
ALTER TABLE intervention_sessions
  ADD CONSTRAINT fk_intervention_sessions_learners
  FOREIGN KEY (learner_id) REFERENCES learners(id);

-- Self-referential
ALTER TABLE users
  ADD CONSTRAINT fk_users_users_manager
  FOREIGN KEY (manager_id) REFERENCES users(id);

-- Multiple FKs to same table
ALTER TABLE sessions
  ADD CONSTRAINT fk_sessions_users_created_by
  FOREIGN KEY (created_by_user_id) REFERENCES users(id);

ALTER TABLE sessions
  ADD CONSTRAINT fk_sessions_users_assigned_to
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id);
```

### Rules
1. **Always name explicitly**: Never rely on auto-generated FK names
2. **ON DELETE/UPDATE**: Specify behavior explicitly
   - `ON DELETE CASCADE`: For dependent data (e.g., session -> interventions)
   - `ON DELETE RESTRICT`: For referenced entities (e.g., tenant -> sessions)
   - `ON DELETE SET NULL`: For optional references (e.g., assigned_to_user_id)
3. **Multi-tenant safety**: FK to tenant-scoped tables must validate `tenant_id` matches
4. **Qualifier suffix**: Add when multiple FKs reference same table

---

## Check Constraints

### Naming Convention
```
ck_{table_name}_{column_or_condition}
```

### Examples
```sql
-- Column value constraint
ALTER TABLE learners
  ADD CONSTRAINT ck_learners_age
  CHECK (age >= 0 AND age <= 150);

-- Status enum constraint
ALTER TABLE sessions
  ADD CONSTRAINT ck_sessions_status
  CHECK (session_status IN ('pending', 'active', 'completed', 'cancelled'));

-- Multi-column constraint
ALTER TABLE interventions
  ADD CONSTRAINT ck_interventions_dates
  CHECK (ended_at IS NULL OR ended_at >= started_at);

-- Conditional constraint
ALTER TABLE sessions
  ADD CONSTRAINT ck_sessions_completed_requires_end_date
  CHECK (session_status != 'completed' OR completed_at IS NOT NULL);
```

### Rules
1. **Enum validation**: Prefer CHECK over app-level validation for status/type fields
2. **Range validation**: Enforce min/max on numeric/date columns
3. **Business rules**: Simple invariants only (complex logic -> application layer)
4. **Null-safe**: Always handle NULL explicitly in multi-column checks

---

## Unique Constraints

### Naming Convention
```
uq_{table_name}_{column(s)}
```

### Examples
```sql
-- Single column unique
ALTER TABLE users
  ADD CONSTRAINT uq_users_email
  UNIQUE (email);

-- Composite unique (tenant-scoped)
ALTER TABLE learners
  ADD CONSTRAINT uq_learners_tenant_external_id
  UNIQUE (tenant_id, external_id);

-- Conditional unique (partial unique index - see Indexes section)
-- Use unique index instead for conditional uniqueness
```

### Rules
1. **Multi-tenant uniqueness**: Always include `tenant_id` for tenant-scoped data
2. **Soft delete compatibility**: If using `deleted_at`, prefer partial unique index
3. **Business keys**: Use for natural identifiers (email, slug, external_id)
4. **Column order**: For tenant-scoped data, `tenant_id` MUST be first; then most selective column

---

## Indexes

### Naming Convention
```
idx_{table_name}_{column(s)}[_{type}]
```

### Type Suffixes
- `_idx`: Standard B-tree index
- `_uidx`: Unique index
- `_gin`: GIN index (for JSONB, arrays, full-text)
- `_gist`: GiST index (for geometric, range types)
- `_hash`: Hash index (equality only)
- `_partial`: Partial/filtered index
- `_vector`: Vector similarity index (pgvector, etc.)

### Examples
```sql
-- Standard index (lookup)
CREATE INDEX idx_sessions_learner_id
  ON intervention_sessions(learner_id);

-- Composite index (multi-tenant query pattern)
CREATE INDEX idx_sessions_tenant_status
  ON intervention_sessions(tenant_id, session_status);

-- Unique index (replace unique constraint for soft delete)
CREATE UNIQUE INDEX idx_users_email_uidx
  ON users(email)
  WHERE deleted_at IS NULL;

-- Partial index (active records only)
CREATE INDEX idx_sessions_active_partial
  ON intervention_sessions(learner_id, started_at)
  WHERE session_status = 'active';

-- GIN index (JSONB queries)
CREATE INDEX idx_learners_metadata_gin
  ON learners USING GIN (metadata_json);

-- Full-text search
CREATE INDEX idx_interventions_description_gin
  ON interventions USING GIN (to_tsvector('english', description));

-- Vector similarity (pgvector example)
CREATE INDEX idx_cognitive_profiles_embedding_vector
  ON cognitive_profiles USING ivfflat (embedding_vector vector_cosine_ops);
```

### Rules
1. **Multi-tenant indexes**: Always prefix with `tenant_id` for tenant-scoped queries
2. **Selectivity order**: For tenant-scoped tables, `tenant_id` MUST be first, then most selective columns
3. **Covering indexes**: Avoid--use sparingly and document why
4. **Partial indexes**: Prefer over full index when filtering on common WHERE clause
5. **Unique indexes vs constraints**: Use unique index for conditional uniqueness (e.g., soft delete with nullable columns)
6. **Nullable columns in unique constraints**: If unique includes nullable columns, define NULL handling explicitly and use partial indexes accordingly
7. **Type suffix**: Add for non-standard index types to aid DBA/AI understanding

### Do / Don't
| DON'T | DO |
|---------|------|
| `idx1`, `idx2` | `idx_sessions_learner_id` |
| `learner_idx` | `idx_sessions_learner_id` |
| `sessions_tenant_id_idx` | `idx_sessions_tenant_id` |
| Create index on every column | Index query patterns only |
| Duplicate index (a,b) and (a) | Keep (a,b), drop (a) |

---

## Migration Naming & Principles

### File Naming Convention
```
YYYYMMDDHHMMSS_descriptive_action.sql
```

### Examples
```
20260104120000_create_learners_table.sql
20260104120100_add_tenant_id_to_sessions.sql
20260104120200_create_idx_sessions_tenant_status.sql
20260104120300_alter_interventions_add_metadata_json.sql
20260104120400_seed_default_intervention_types.sql
```

### Migration Principles
1. **Explicit rollback**: Migrations MUST include explicit rollback scripts in same directory with `_rollback` suffix or separate `rollback/` folder; do not rely on automatic rollback tooling
2. **Idempotent**: Use `IF NOT EXISTS`, `IF EXISTS` for safety
3. **Atomic**: One logical change per migration (except tightly coupled changes)
4. **Timestamped**: UTC timestamp prefix for ordering
5. **Descriptive**: Action + entity in filename (verb_noun pattern)
6. **Tested**: Validate on staging before production
7. **Documented**: Include comment block with author, date, purpose, breaking changes

### Migration Template
```sql
-- Migration: 20260104120000_create_learners_table
-- Author: [System/User/AI Agent]
-- Date: 2026-01-04
-- Purpose: Create core learners table with multi-tenant support
-- Breaking: No
-- Rollback: 20260104120000_drop_learners_table.sql

BEGIN;

CREATE TABLE IF NOT EXISTS learners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  external_id VARCHAR(255),
  age INTEGER,
  language_preference VARCHAR(10),
  metadata_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID,
  deleted_at TIMESTAMPTZ,

  CONSTRAINT fk_learners_tenants
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
  CONSTRAINT fk_learners_users_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT uq_learners_tenant_external_id
    UNIQUE (tenant_id, external_id),
  CONSTRAINT ck_learners_age
    CHECK (age IS NULL OR (age >= 0 AND age <= 150))
);

CREATE INDEX idx_learners_tenant_id ON learners(tenant_id);
CREATE INDEX idx_learners_metadata_gin ON learners USING GIN (metadata_json);

COMMENT ON TABLE learners IS 'Core learner entities with multi-tenant isolation';
COMMENT ON COLUMN learners.external_id IS 'Tenant-specific external identifier';

COMMIT;
```

### Do / Don't
| DON'T | DO |
|---------|------|
| `migration_1.sql` | `20260104120000_create_learners_table.sql` |
| `fix_stuff.sql` | `20260104120100_add_missing_index_sessions.sql` |
| Mix DDL and DML | Separate schema and data migrations |
| Hardcode IDs | Use stable references (slugs, external_ids) |
| Rename columns in-place | Create new, migrate data, drop old |

---

## Multi-Tenant Rules

### Mandatory Requirements
1. **Tenant ID Column**: All tenant-scoped tables MUST have `tenant_id UUID NOT NULL`
2. **Foreign Key to Tenants**: `tenant_id` MUST reference `tenants(id) ON DELETE RESTRICT`
3. **Index on Tenant ID**: All tenant-scoped tables MUST have index starting with `tenant_id`
4. **Unique Constraints**: Include `tenant_id` in all unique constraints for scoped data
5. **Foreign Key Safety**: Cross-tenant references MUST validate `tenant_id` matches via composite FK (preferred) or database trigger. If trigger used, document trigger name and scope in migration. Junction tables MUST enforce `tenant_id` consistency across referenced rows.

### Tenant-Scoped vs Global Tables

#### Tenant-Scoped (MUST include tenant_id)
```sql
-- Examples: learners, sessions, interventions, cognitive_profiles
CREATE TABLE intervention_sessions (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,  -- REQUIRED
  learner_id UUID NOT NULL,
  session_status VARCHAR(50),
  -- ...
  CONSTRAINT fk_intervention_sessions_tenants
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT
);

CREATE INDEX idx_intervention_sessions_tenant_id
  ON intervention_sessions(tenant_id);
```

#### Global Tables (NO tenant_id)
```sql
-- Examples: tenants, sys_migrations, language_models (shared)
-- NOTE: `users` is assumed to be a global/system table when referenced in audit FKs
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  -- ...
  CONSTRAINT uq_tenants_slug UNIQUE (slug)
);
```

### Row-Level Security (RLS) Pattern
```sql
-- Enable RLS
ALTER TABLE intervention_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their tenant's data
CREATE POLICY tenant_isolation ON intervention_sessions
  FOR ALL
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

### Cross-Tenant Queries (Forbidden)
```sql
-- [X] NEVER allow joins across tenants without explicit admin privilege
-- [OK] Validate tenant_id match in application layer or trigger
```

---

## Audit Fields

### Mandatory Audit Fields (Core Entities)
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()      -- When record created (UTC)
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()      -- When record last modified (UTC)
created_by_user_id UUID REFERENCES users(id)       -- Who created (nullable for system)
updated_by_user_id UUID REFERENCES users(id)       -- Who last updated (nullable for system)
```

### Optional Audit Fields
```sql
deleted_at TIMESTAMPTZ                             -- Soft delete timestamp
deleted_by_user_id UUID REFERENCES users(id)       -- Who deleted
version INTEGER NOT NULL DEFAULT 1                 -- Optimistic locking version
```

### Auto-Update Trigger (Example)
```sql
-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to table
CREATE TRIGGER trg_intervention_sessions_updated_at
  BEFORE UPDATE ON intervention_sessions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();
```

### Rules
1. **Core entities**: All domain tables with business data MUST have `created_at`, `updated_at`
2. **System tables**: Optional--use judgment (e.g., `sys_migrations` may skip)
3. **Junction tables**: Optional--use judgment based on audit needs
4. **Soft delete**: Use `deleted_at` instead of hard delete for GDPR/audit compliance
5. **UTC storage**: Store timestamps as UTC; if database supports timezone-aware types (e.g., TIMESTAMPTZ in PostgreSQL), use them; otherwise normalize in application layer and document
6. **Nullability**: `created_by_user_id` nullable for system-generated records

---

## Canonical Examples

### Full Table Definition (Learner)
```sql
-- NOTE: This example uses PostgreSQL-specific features (UUID, JSONB, gen_random_uuid, GIN)
-- Adapt data types and defaults for other database platforms
CREATE TABLE learners (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- PostgreSQL: gen_random_uuid() or app-generated UUID

  -- Multi-tenant
  tenant_id UUID NOT NULL,

  -- Business attributes
  external_id VARCHAR(255),
  email VARCHAR(255),
  age INTEGER,
  language_preference VARCHAR(10) NOT NULL DEFAULT 'en',
  cognitive_profile_id UUID,
  metadata_json JSONB,

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID,
  updated_by_user_id UUID,
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT fk_learners_tenants
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
  CONSTRAINT fk_learners_cognitive_profiles
    FOREIGN KEY (cognitive_profile_id) REFERENCES cognitive_profiles(id) ON DELETE SET NULL,
  CONSTRAINT fk_learners_users_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_learners_users_updated_by
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT uq_learners_tenant_external_id
    UNIQUE (tenant_id, external_id),
  CONSTRAINT ck_learners_age
    CHECK (age IS NULL OR (age >= 0 AND age <= 150))
);

-- Indexes
CREATE INDEX idx_learners_tenant_id ON learners(tenant_id);
CREATE INDEX idx_learners_email ON learners(email) WHERE deleted_at IS NULL;  -- Partial index (vendor-specific WHERE clause syntax varies)
CREATE INDEX idx_learners_metadata_gin ON learners USING GIN (metadata_json);  -- PostgreSQL GIN index

-- Triggers (PostgreSQL syntax; adapt for other platforms)
CREATE TRIGGER trg_learners_updated_at
  BEFORE UPDATE ON learners
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();  -- PostgreSQL: EXECUTE FUNCTION; MySQL: CALL; SQL Server: EXEC

-- Comments
COMMENT ON TABLE learners IS 'Core learner entities with multi-tenant isolation';
COMMENT ON COLUMN learners.external_id IS 'Tenant-specific external identifier from LMS/SIS';
COMMENT ON COLUMN learners.metadata_json IS 'Flexible attributes for tenant-specific extensions';
```

### Junction Table (Many-to-Many)
```sql
CREATE TABLE session_interventions (
  -- Composite primary key
  session_id UUID NOT NULL,
  intervention_id UUID NOT NULL,

  -- Multi-tenant (inherited from parent entities)
  tenant_id UUID NOT NULL,

  -- Junction-specific attributes
  sequence_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Audit (optional for junction tables)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  PRIMARY KEY (session_id, intervention_id),
  CONSTRAINT fk_session_interventions_sessions
    FOREIGN KEY (session_id) REFERENCES intervention_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_session_interventions_interventions
    FOREIGN KEY (intervention_id) REFERENCES interventions(id) ON DELETE CASCADE,
  CONSTRAINT fk_session_interventions_tenants
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
  CONSTRAINT ck_session_interventions_sequence_order
    CHECK (sequence_order >= 0)
);

-- Indexes
CREATE INDEX idx_session_interventions_session_id ON session_interventions(session_id);
CREATE INDEX idx_session_interventions_intervention_id ON session_interventions(intervention_id);
CREATE INDEX idx_session_interventions_tenant_id ON session_interventions(tenant_id);
```

### System Table (No tenant_id)
```sql
CREATE TABLE sys_migrations (
  id BIGSERIAL PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checksum VARCHAR(64),

  CONSTRAINT ck_sys_migrations_name_format
    CHECK (migration_name ~ '^[0-9]{14}_[a-z0-9_]+$')
);

CREATE INDEX idx_sys_migrations_applied_at ON sys_migrations(applied_at DESC);

COMMENT ON TABLE sys_migrations IS 'Migration tracking for schema versioning';
```

---

## Common Patterns Reference

### Enum/Status Fields
```sql
-- Option 1: CHECK constraint (recommended for small, stable enums)
session_status VARCHAR(50) NOT NULL DEFAULT 'pending',
CONSTRAINT ck_sessions_status
  CHECK (session_status IN ('pending', 'active', 'completed', 'cancelled'))

-- Option 2: Lookup table (recommended for dynamic/large enums)
intervention_type_id UUID NOT NULL,
CONSTRAINT fk_sessions_intervention_types
  FOREIGN KEY (intervention_type_id) REFERENCES intervention_types(id)
```

### Temporal Data (Start/End)
```sql
started_at TIMESTAMPTZ,
ended_at TIMESTAMPTZ,
CONSTRAINT ck_sessions_dates
  CHECK (ended_at IS NULL OR ended_at >= started_at)
```

### Soft Delete
```sql
deleted_at TIMESTAMPTZ,
deleted_by_user_id UUID REFERENCES users(id),

-- Partial unique index to allow re-use of unique values after soft delete
CREATE UNIQUE INDEX idx_users_email_uidx
  ON users(email) WHERE deleted_at IS NULL;
```

### Hierarchical Data (Self-Referential)
```sql
parent_id UUID,
CONSTRAINT fk_categories_parent
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
```

### JSONB Metadata
```sql
metadata_json JSONB,
config_json JSONB NOT NULL DEFAULT '{}',

-- GIN index for JSONB queries
CREATE INDEX idx_learners_metadata_gin ON learners USING GIN (metadata_json);

-- Example query: SELECT * FROM learners WHERE metadata_json @> '{"key": "value"}';
```

### Versioning (Snapshot Pattern)
```sql
CREATE TABLE intervention_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID NOT NULL,
  version INTEGER NOT NULL,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID,

  CONSTRAINT fk_intervention_snapshots_interventions
    FOREIGN KEY (intervention_id) REFERENCES interventions(id) ON DELETE CASCADE,
  CONSTRAINT uq_intervention_snapshots_version
    UNIQUE (intervention_id, version)
);
```

---

## Do / Don't Quick Reference

### Table Names
| DON'T | DO |
|---------|------|
| `Learner`, `LEARNER` | `learners` |
| `tbl_learner` | `learners` |
| `learner` (singular) | `learners` (plural) |
| `learner_table` | `learners` |
| `get_learners` | `learners` |

### Column Names
| DON'T | DO |
|---------|------|
| `LearnerID` | `learner_id` |
| `active` (boolean) | `is_active` |
| `timestamp` | `created_at` or `updated_at` |
| `json` | `metadata_json` |
| `fk_learner` | `learner_id` |

### Constraints
| DON'T | DO |
|---------|------|
| Auto-generated names | Explicit naming |
| `constraint_1` | `fk_sessions_learners` |
| `sessions_learner_id_fkey` | `fk_sessions_learners` |
| `status_check` | `ck_sessions_status` |

### Indexes
| DON'T | DO |
|---------|------|
| `index_1` | `idx_sessions_learner_id` |
| `learner_idx` | `idx_sessions_learner_id` |
| Index every column | Index query patterns |
| `(status, tenant_id)` | `(tenant_id, status)` |

### Multi-Tenant
| DON'T | DO |
|---------|------|
| Omit `tenant_id` | Always include for scoped data |
| `UNIQUE (email)` | `UNIQUE (tenant_id, email)` |
| Cross-tenant JOINs | Validate `tenant_id` matches |
| `INDEX (learner_id)` | `INDEX (tenant_id, learner_id)` |

### Migrations
| DON'T | DO |
|---------|------|
| `001_migration.sql` | `20260104120000_create_learners.sql` |
| `fix.sql` | `20260104120100_add_index_sessions.sql` |
| Manual rollback | Write explicit down migration |
| Rename columns | Create new, migrate, drop old |

---

## Enforcement & Validation

### Pre-Commit Checks (Conceptual)
1. **Naming convention validation**: Regex match for snake_case
2. **Multi-tenant check**: Verify `tenant_id` exists in tenant-scoped tables
3. **Audit field check**: Verify `created_at`, `updated_at` in core entities
4. **FK naming**: Verify `fk_*` pattern
5. **Migration timestamp**: Verify YYYYMMDDHHMMSS prefix
6. **Reserved words**: Block SQL reserved keywords as names

### AI Agent Instructions
When generating migrations or DDL:
1. Read this document before creating any database object
2. Validate against naming rules
3. Include audit fields by default
4. Add multi-tenant support for scoped entities
5. Generate explicit constraint names
6. Document breaking changes
7. Use canonical vocabulary only

### DBA Review Checklist
- [ ] Table name: plural, snake_case, canonical term
- [ ] Columns: snake_case, descriptive, typed suffix if needed
- [ ] Primary key: `pk_{table}` constraint
- [ ] Foreign keys: `fk_{source}_{target}[_qualifier]` with ON DELETE/UPDATE
- [ ] Unique constraints: `uq_{table}_{columns}`, includes `tenant_id`
- [ ] Check constraints: `ck_{table}_{condition}`, enum validation
- [ ] Indexes: Query pattern driven, `tenant_id` first for scoped tables
- [ ] Multi-tenant: `tenant_id` present, indexed, foreign key to tenants
- [ ] Audit: `created_at`, `updated_at`, `*_by_user_id` present
- [ ] Migration: Timestamped, descriptive, idempotent, documented
- [ ] Comments: Table and complex column purposes documented

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.3.0 | 2026-01-04 | SEALED. Encoding normalization: replaced all UTF-8 emoji/special characters with ASCII for parser/tooling compatibility. "Ontologia Canonica" (plain ASCII), table headers "DON'T/DO" (ASCII), checkmarks [X]/[OK] (ASCII), arrows -> (ASCII). Ensures AI-readable, copy-paste safe, and cross-platform compatible. | Data Architect AI |
| 1.2.0 | 2026-01-04 | SEALED. PostgreSQL examples consistency: all timestamp columns now use TIMESTAMPTZ instead of TIMESTAMP (Reserved Column Names, Audit Fields, Migration Template, Canonical Examples, Common Patterns). Ensures copy-paste safety for UTC-aware timestamp handling. | Data Architect AI |
| 1.1.0 | 2026-01-04 | SEALED. Final Codex audit fixes: audit field naming consistency (created_by_user_id/updated_by_user_id), tenant_id ordering precedence in unique constraints, TIMESTAMPTZ annotations, composite FK documentation requirement, rollback script location standard, max-3-words clarified as guidance, users table scope documented | Data Architect AI |
| 1.0.1 | 2026-01-04 | Fixed Codex audit findings: vendor-agnostic naming vs implementation, canonical vocabulary scope, multi-tenant FK enforcement, timestamp UTC guidance, index ordering precedence, nullable unique constraints, migration rollback clarity | Data Architect AI |
| 1.0.0 | 2026-01-04 | Initial version | Data Architect AI |

---

## Authority & Exceptions

This document is **SEALED** under Engineering Rector Pack v1.

**No exceptions** without:
1. Written approval from Engineering Rector
2. Update to this document version
3. Migration plan for existing non-compliant schemas

**Questions or clarifications**: Open issue in engineering governance repo.

**For AI agents**: This document is authoritative--do not deviate or "improve" naming patterns.

---

*End of Database Naming & Rules Document*
