# FIT-ORCH-SCHEMA-001: Orchestrator Schema Validation

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-PERSISTENCE-001, CANON-ORCH-STATE-001

---

## 1. Purpose

Validates that Orchestrator database schema meets all canonical requirements: constraints, indexes, naming conventions, migrations, multi-tenancy.

**Pass Criteria**: Schema passes all validation checks (constraints, indexes, RLS, migrations).

---

## 2. Schema Validation Checklist

### 2.1 Mandatory Columns (MUST)

**ALL tables MUST have**:
```sql
tenant_id UUID NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

**Audit-critical tables MUST add**:
```sql
correlation_id UUID NOT NULL,
causation_id UUID,
actor VARCHAR(100)
```

**Validation Query**:
```sql
-- Check all tables have tenant_id
SELECT table_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('signals', 'runs', 'steps', 'effects', 'tool_calls', 'run_checkpoints', 'orchestration_events', 'outbox_events')
  AND column_name = 'tenant_id'
  AND is_nullable = 'NO';
-- Expected: 8 rows (all tables)
```

---

### 2.2 Primary Keys (MUST)

**ALL tables MUST have UUID primary key**:
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

**Validation Query**:
```sql
SELECT table_name, constraint_name
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND constraint_type = 'PRIMARY KEY'
  AND table_name IN ('signals', 'runs', 'steps', 'effects');
-- Expected: 4 rows
```

---

### 2.3 Foreign Keys (MUST)

**Required FKs**:
- `runs.signal_id` → `signals.id`
- `steps.run_id` → `runs.id`
- `effects.run_id` → `runs.id`
- `effects.step_id` → `steps.id`
- `tool_calls.step_id` → `steps.id`
- `run_checkpoints.run_id` → `runs.id`

**Validation Query**:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('runs', 'steps', 'effects', 'tool_calls');
-- Expected: 6 rows
```

---

### 2.4 Unique Constraints (MUST)

**Required UNIQUE constraints**:
- `signals(tenant_id, source_channel, source_id)` (idempotency)
- `steps(run_id, step_index)` (sequential ordering)
- `run_checkpoints(run_id, checkpoint_index)`
- `outbox_events(idempotency_key)`

**Validation Query**:
```sql
SELECT table_name, constraint_name
FROM information_schema.table_constraints
WHERE constraint_type = 'UNIQUE'
  AND table_name IN ('signals', 'steps', 'run_checkpoints', 'outbox_events');
-- Expected: 4 rows
```

---

### 2.5 Indexes (SHOULD)

**Performance-critical indexes**:
```sql
-- Signals
CREATE INDEX idx_signals_tenant_status ON signals(tenant_id, status, received_at DESC);
CREATE INDEX idx_signals_correlation ON signals(correlation_id);

-- Runs
CREATE INDEX idx_runs_tenant_status ON runs(tenant_id, status, started_at DESC);
CREATE INDEX idx_runs_signal ON runs(signal_id);
CREATE INDEX idx_runs_correlation ON runs(correlation_id);

-- Steps
CREATE INDEX idx_steps_run ON steps(run_id, step_index);
CREATE INDEX idx_steps_status ON steps(tenant_id, status, started_at DESC);

-- Effects
CREATE INDEX idx_effects_status ON effects(tenant_id, status, requested_at);
CREATE INDEX idx_effects_run ON effects(run_id);

-- Events
CREATE INDEX idx_events_aggregate ON orchestration_events(tenant_id, aggregate_type, aggregate_id, sequence_number);
CREATE INDEX idx_events_correlation ON orchestration_events(tenant_id, correlation_id, sequence_number);
CREATE INDEX idx_events_sequence ON orchestration_events(tenant_id, sequence_number);

-- Outbox
CREATE INDEX idx_outbox_status ON outbox_events(tenant_id, status, created_at);
CREATE INDEX idx_outbox_retry ON outbox_events(status, next_retry_at) WHERE status = 'FAILED';
```

**Validation Query**:
```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('signals', 'runs', 'steps', 'effects', 'orchestration_events', 'outbox_events');
-- Expected: 14+ rows
```

---

### 2.6 Row-Level Security (MUST)

**ALL tables MUST have RLS enabled**:
```sql
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
-- etc.
```

**RLS Policies** (tenant isolation):
```sql
CREATE POLICY tenant_isolation_signals ON signals
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = current_user_id())
  );
```

**Validation Query**:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('signals', 'runs', 'steps', 'effects');
-- Expected: All rows have rowsecurity = TRUE
```

---

### 2.7 Naming Conventions (MUST)

**Tables**: Plural, lowercase, underscore-separated (`signals`, `run_checkpoints`)
**Columns**: Lowercase, underscore-separated (`tenant_id`, `correlation_id`)
**Indexes**: `idx_{table}_{columns}` (`idx_runs_tenant_status`)
**Foreign Keys**: `fk_{table}_{ref_table}` (`fk_steps_runs`)

**Validation** (Manual Review):
```bash
# Check table names conform
psql -c "\dt" | grep -v -E '^[a-z_]+$'
# Expected: No matches (all lowercase with underscores)
```

---

### 2.8 Migrations (MUST)

**Naming**: `YYYYMMDDHHMMSS_description.sql`
**Example**: `20260104120000_create_orchestration_tables.sql`

**Migration Tool** (RECOMMENDED): Flyway, golang-migrate, Alembic

**Validation**:
- [ ] All migrations in `migrations/` directory
- [ ] Migrations numbered sequentially
- [ ] Each migration has rollback script
- [ ] Migrations applied to staging before production

---

## 3. Validation Tests (Pass Criteria)

### 3.1 Test 1: Mandatory Columns

**Setup**:
1. Query all tables for required columns

**Expected**:
- ALL tables have `tenant_id`, `created_at`, `updated_at`

**SQL Verification**:
```sql
SELECT COUNT(*) FROM information_schema.columns
WHERE table_name = 'signals' AND column_name IN ('tenant_id', 'created_at', 'updated_at');
-- Expected: 3
```

---

### 3.2 Test 2: Foreign Key Cascades

**Setup**:
1. Create run with steps
2. Delete run

**Expected**:
- Steps CASCADE deleted (ON DELETE CASCADE)

**SQL Verification**:
```sql
-- Check cascade behavior
SELECT
  tc.table_name,
  kcu.column_name,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'steps';
-- Expected: delete_rule = 'CASCADE'
```

---

### 3.3 Test 3: Index Coverage (Query Performance)

**Setup**:
1. Run common query: `SELECT * FROM runs WHERE tenant_id = $1 AND status = 'RUNNING'`
2. Check EXPLAIN ANALYZE

**Expected**:
- Index `idx_runs_tenant_status` used (no full table scan)

**SQL Verification**:
```sql
EXPLAIN ANALYZE
SELECT * FROM runs WHERE tenant_id = 'tenant-uuid' AND status = 'RUNNING';
-- Expected output includes: Index Scan using idx_runs_tenant_status
```

---

### 3.4 Test 4: RLS Enforcement

**Setup**:
1. User A (tenant-1) creates signal
2. User B (tenant-2) queries signals

**Expected**:
- User B sees zero signals (RLS blocks cross-tenant)

**SQL Verification**:
```sql
-- As user from tenant-1
SET app.current_user_id = 'user-a';
INSERT INTO signals (...) VALUES (...);

-- As user from tenant-2
SET app.current_user_id = 'user-b';
SELECT COUNT(*) FROM signals;
-- Expected: 0 (RLS enforcement)
```

---

## 4. Checklist (FIT Pass Criteria)

### Schema Structure

- [ ] All tables have `tenant_id`, `created_at`, `updated_at`
- [ ] All tables have UUID primary key
- [ ] Foreign keys defined with appropriate ON DELETE behavior
- [ ] UNIQUE constraints on idempotency keys
- [ ] Performance indexes cover common query patterns

### Multi-Tenancy

- [ ] RLS enabled on ALL tables
- [ ] RLS policies enforce tenant isolation
- [ ] Cross-tenant queries return zero results

### Naming & Conventions

- [ ] Table names: plural, lowercase, underscore-separated
- [ ] Column names: lowercase, underscore-separated
- [ ] Index names: `idx_{table}_{columns}`
- [ ] FK names: `fk_{table}_{ref_table}`

### Migrations

- [ ] Migrations versioned (YYYYMMDDHHMMSS format)
- [ ] Migrations reversible (rollback scripts exist)
- [ ] Migrations tested in staging

### Validation Tests

- [ ] Test 1 (Mandatory Columns): PASS
- [ ] Test 2 (Foreign Key Cascades): PASS
- [ ] Test 3 (Index Coverage): PASS
- [ ] Test 4 (RLS Enforcement): PASS

---

## 5. References

- CANON-PERSISTENCE-001: Orchestrator Persistence Canon
- CANON-ORCH-STATE-001: Orchestrator Runtime State Canon

---

**END OF FIT-ORCH-SCHEMA-001**
