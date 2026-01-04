# Persistence Plane Operational Walkthrough

**Status**: OPERATIONAL GUIDE  
**Version**: 1.0.0  
**Date**: 2026-01-04  
**Authority**: Principal Data Architect & DBA-AI

---

## 1. Purpose

This walkthrough provides operational implementation and validation procedures for the Persistence Plane Canon.

**This document**:
- Does NOT redefine architecture
- Does NOT introduce new concepts
- TRANSLATES sealed canon to executable operations

**Authority**: All architectural decisions are SEALED in canonical documents. This walkthrough implements, does not design.

---

## 2. Scope

### In Scope
- Persistence layer implementation procedures
- Runtime state management operations
- Event sourcing execution
- Traceability validation
- DBA-AI production gates

### Explicitly Prohibited
- ❌ Memory Plane implementation (see CANON-MEM-PLANE-001)
- ❌ Reasoning Plane design
- ❌ UX/Projection layer features
- ❌ RAG or vector store operations
- ❌ Ontological entity definitions

---

## 3. Document Map

### Reading Order

**First-Time Implementation**:
1. CANON-PERSISTENCE-001 (architectural laws)
2. CANON-ORCH-STATE-001 (runtime state model)
3. CANON-EVENTS-001 (event sourcing + outbox)
4. CANON-TRACE-001 (audit + traceability)
5. This walkthrough
6. FIT-PERSISTENCE-ABSTRACTION-001 (code patterns)
7. FIT-ORCH-SCHEMA-001 (schema validation)
8. FIT-DATA-QUALITY-001 (quality gates)

**Maintenance/Debugging**:
1. This walkthrough (debugging procedure)
2. CANON-TRACE-001 (trace reconstruction)
3. Relevant FIT document

### Canon vs FIT

| Document Type | Purpose | When to Use |
|---------------|---------|-------------|
| **CANON** | Immutable architectural laws | Design decisions, disputes, architectural review |
| **FIT** | Implementation validation tests | CI/CD integration, pre-deployment checks |
| **Walkthrough** | Operational procedures | Implementation, debugging, validation |

**Law vs Procedure**:
- **Law** (CANON): MUST/MUST NOT without exception
- **Procedure** (Walkthrough): HOW to implement law

---

## 4. Persistence Plane Mental Contract

### Core Rules (Memorize)

1. **Runtime State ≠ System of Record**: Orchestrator state references domain entities via stable IDs, never duplicates
2. **Append-Only Events**: Event log immutable, ALL state changes emit events
3. **Outbox for External Effects**: NO direct external calls, ALL via transactional outbox
4. **Multi-Tenant Always-On**: `tenant_id` mandatory in ALL tables, RLS enforced
5. **Traceability Non-Negotiable**: Every mutation records `correlation_id`, `causation_id`, `actor`, `source`
6. **Projections Expendable**: Read models rebuildable from Runtime State + Events
7. **Idempotency End-to-End**: Signals deduplicated, outbox uses idempotency keys

---

## 5. Implementation Blueprint

### Step 1: Initialize Persistence Module

**Actions**:
1. Create `src/persistence/` directory
2. Create subdirectories:
   - `repositories/`
   - `queries/`
   - `migrations/`
3. Install database driver (PostgreSQL reference)

**Validation**:
- [ ] Directory structure matches FIT-PERSISTENCE-ABSTRACTION-001 section 6.2

---

### Step 2: Schema Creation

**Actions**:
1. Create migration: `migrations/20260104000001_create_orchestration_tables.sql`
2. Define tables in order:
   - `signals`
   - `runs`
   - `steps`
   - `effects`
   - `tool_calls`
   - `run_checkpoints`
   - `orchestration_events`
   - `outbox_events`
3. Apply mandatory columns to ALL tables:
   ```sql
   tenant_id UUID NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
   ```
4. Add audit columns to runtime tables:
   ```sql
   correlation_id UUID NOT NULL,
   causation_id UUID,
   actor VARCHAR(100)
   ```

**Schema Templates**: See CANON-ORCH-STATE-001 sections 3-8 for exact schema contracts

**Validation**:
- [ ] Run FIT-ORCH-SCHEMA-001 validation queries (section 2)
- [ ] All mandatory columns present
- [ ] All foreign keys defined
- [ ] All unique constraints applied

---

### Step 3: Enable Multi-Tenancy

**Actions**:
1. Enable RLS on ALL tables:
   ```sql
   ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
   ALTER TABLE effects ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tool_calls ENABLE ROW LEVEL SECURITY;
   ALTER TABLE run_checkpoints ENABLE ROW LEVEL SECURITY;
   ALTER TABLE orchestration_events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;
   ```

2. Create RLS policies (one per table):
   ```sql
   CREATE POLICY tenant_isolation ON {table_name}
     FOR ALL USING (
       tenant_id IN (
         SELECT tenant_id FROM user_tenants WHERE user_id = current_user_id()
       )
     );
   ```

**Validation**:
- [ ] RLS enabled on ALL tables (FIT-ORCH-SCHEMA-001 section 2.6)
- [ ] Cross-tenant query returns zero results
- [ ] Application enforces `tenant_id` in repository layer

---

### Step 4: Implement Repository Pattern

**Actions**:
1. Create `IRepository<T>` interface (FIT-PERSISTENCE-ABSTRACTION-001 section 3.1)
2. Implement repositories:
   - `SignalRepository`
   - `RunRepository`
   - `StepRepository`
   - `EffectRepository`
   - `EventRepository` (append-only)
3. Enforce tenant isolation in ALL queries:
   ```typescript
   WHERE table.tenant_id = $tenant_id
   ```

**Validation**:
- [ ] No direct database access in feature code
- [ ] All repositories enforce `tenant_id` (FIT-PERSISTENCE-ABSTRACTION-001 Test 7.1)
- [ ] EventRepository has no update/delete methods

---

### Step 5: Implement Append-Only Event Log

**Actions**:
1. Create `EventRepository.append()` method (no update/delete)
2. Emit event on EVERY state mutation:
   ```typescript
   await eventRepository.append({
     event_type: 'STEP_COMPLETED',
     aggregate_type: 'STEP',
     aggregate_id: stepId,
     event_data: { output_result },
     correlation_id,
     causation_id: parentEventId,
     actor: 'agent:orchestrator',
   }, tenantId);
   ```
3. Use `sequence_number BIGSERIAL` for ordering

**Event Types**: See CANON-EVENTS-001 section 3.2 for complete taxonomy

**Validation**:
- [ ] All state changes emit events (no silent mutations)
- [ ] Events never updated or deleted
- [ ] `sequence_number` monotonically increasing per tenant

---

### Step 6: Implement Outbox Pattern

**Actions**:
1. Create `outbox_events` table (CANON-EVENTS-001 section 4.3)
2. Implement transactional outbox insert:
   ```typescript
   await db.transaction(async (tx) => {
     // Insert effect
     await tx.insert(effects).values(effect);
     
     // Insert outbox entry
     await tx.insert(outbox_events).values({
       event_type: 'SEND_EMAIL',
       payload: effect.effect_spec,
       idempotency_key: effect.effect_spec.idempotency_key,
       tenant_id,
     });
   });
   ```
3. Create outbox worker (polling or CDC)
4. Implement exponential backoff retry (CANON-EVENTS-001 section 7.1)

**Validation**:
- [ ] No direct external calls from orchestration code
- [ ] Outbox entries have unique `idempotency_key`
- [ ] Retry logic implemented with max retries
- [ ] Dead letter queue for failed entries

---

### Step 7: Implement Traceability

**Actions**:
1. Generate `correlation_id` on signal ingestion:
   ```typescript
   const correlationId = uuidv4();
   ```
2. Propagate to ALL entities:
   - `signals.correlation_id`
   - `runs.correlation_id`
   - `steps.correlation_id` (via run)
   - `orchestration_events.correlation_id`
3. Record `actor` on ALL events:
   - `agent:{agent_id}`
   - `user:{user_id}`
   - `system:{component}`
   - `external:{esi_name}`
4. Implement causation chain:
   ```typescript
   causation_id: parentEvent.id
   ```

**Validation**:
- [ ] All entities have `correlation_id`
- [ ] All events have `actor`
- [ ] Causation chain navigable (CANON-TRACE-001 section 4.3)

---

### Step 8: Implement Projections (Expendable)

**Actions**:
1. Create materialized views for read performance:
   ```sql
   CREATE MATERIALIZED VIEW run_summary AS
   SELECT r.id, r.status, COUNT(s.id) AS total_steps, ...
   FROM runs r LEFT JOIN steps s ON r.run_id = s.id
   GROUP BY r.id;
   ```
2. Document rebuild procedure:
   ```sql
   REFRESH MATERIALIZED VIEW run_summary;
   ```
3. Set TTL or refresh schedule

**Rules**:
- Projections NEVER source of truth
- Business logic NEVER queries projections for decisions
- Projection loss is operational inconvenience, NOT data loss

**Validation**:
- [ ] Projections rebuildable from Runtime State
- [ ] No business logic depends on projections

---

## 6. DBA-AI Production Gate Checklist

### Pre-Deployment Validation

**Schema Compliance**:
- [ ] ALL tables include `tenant_id UUID NOT NULL`
- [ ] ALL tables include `created_at`, `updated_at` (TIMESTAMPTZ)
- [ ] Audit tables include `correlation_id`, `causation_id`, `actor`
- [ ] ALL tables have UUID primary key
- [ ] Foreign keys defined with appropriate cascades
- [ ] Unique constraints on idempotency keys

**Multi-Tenancy**:
- [ ] RLS enabled on ALL tables
- [ ] RLS policies enforce tenant isolation
- [ ] Application layer validates `tenant_id` in repositories
- [ ] Cross-tenant query test returns zero results

**Append-Only Enforcement**:
- [ ] `orchestration_events` table has no UPDATE/DELETE operations
- [ ] EventRepository has only `append()` method
- [ ] State changes emit events before state mutation

**Idempotency**:
- [ ] `signals` table: UNIQUE(tenant_id, source_channel, source_id)
- [ ] `outbox_events` table: UNIQUE(idempotency_key)
- [ ] Effect specs include `idempotency_key` field

**Outbox Pattern**:
- [ ] Outbox table exists with transactional insert
- [ ] Worker process polls outbox
- [ ] Retry logic implemented (exponential backoff)
- [ ] Dead letter queue handling defined

**Traceability**:
- [ ] All entities propagate `correlation_id`
- [ ] All events record `actor`
- [ ] All events record `causation_id` (except root)
- [ ] Trace query reconstructs full execution

**Migrations**:
- [ ] Migrations versioned (YYYYMMDDHHMMSS format)
- [ ] Each migration has rollback script
- [ ] Migrations tested in staging
- [ ] Migrations atomic (single transaction)

**CI Integration**:
- [ ] FIT-ORCH-SCHEMA-001 validation runs in CI
- [ ] FIT-DATA-QUALITY-001 integrity checks run in CI
- [ ] Schema linting passes
- [ ] No direct database access in feature code (static analysis)

---

## 7. Anti-Regression Rules

### Prohibited Changes (Require DBA-AI Review)

**Schema Changes**:
- ❌ Removing `tenant_id` from any table
- ❌ Removing `correlation_id` from runtime tables
- ❌ Changing primary key from UUID to other type
- ❌ Removing unique constraints on idempotency keys
- ❌ Disabling RLS on any table

**Pattern Violations**:
- ❌ Adding UPDATE/DELETE to `EventRepository`
- ❌ Direct database access from feature code
- ❌ Synchronous external API calls (bypassing outbox)
- ❌ Cross-tenant queries
- ❌ Business logic querying projections

**Semantic Changes**:
- ❌ Changing event type names (breaks replay)
- ❌ Mutating event schema without versioning
- ❌ Changing state machine transitions
- ❌ Removing mandatory fields from schemas

### Version Bump Triggers

**Major Version** (requires architectural review):
- Schema breaking changes
- Event taxonomy changes
- State machine modifications
- New mandatory fields

**Minor Version** (requires DBA-AI sign-off):
- New tables
- New indexes
- New optional fields
- Performance optimizations

**Patch Version** (automated):
- Bug fixes in queries
- Documentation updates
- Non-schema changes

---

## 8. Standard Debugging Procedure

### Reconstruct Run Execution

**Given**: `correlation_id` or `run_id`

**Step 1: Locate Signal**
```sql
SELECT * FROM signals WHERE correlation_id = $correlation_id;
```

**Step 2: Locate Run**
```sql
SELECT * FROM runs WHERE correlation_id = $correlation_id;
```

**Step 3: Reconstruct Steps**
```sql
SELECT * FROM steps
WHERE run_id = $run_id
ORDER BY step_index ASC;
```

**Step 4: Retrieve Events**
```sql
SELECT event_type, event_data, occurred_at, actor
FROM orchestration_events
WHERE correlation_id = $correlation_id
ORDER BY sequence_number ASC;
```

**Step 5: Check Effects**
```sql
SELECT e.id, e.effect_type, e.status, e.execution_result
FROM effects e
JOIN runs r ON e.run_id = r.id
WHERE r.correlation_id = $correlation_id;
```

**Step 6: Check Outbox**
```sql
SELECT o.event_type, o.status, o.retry_count, o.error_details
FROM outbox_events o
WHERE o.correlation_id = $correlation_id;
```

**Step 7: Validate Causation Chain**
```sql
WITH RECURSIVE causal_chain AS (
  SELECT id, event_type, causation_id, 0 AS depth
  FROM orchestration_events
  WHERE correlation_id = $correlation_id AND causation_id IS NULL
  
  UNION ALL
  
  SELECT e.id, e.event_type, e.causation_id, c.depth + 1
  FROM orchestration_events e
  JOIN causal_chain c ON e.causation_id = c.id
)
SELECT * FROM causal_chain ORDER BY depth ASC;
```

---

### Diagnose Failed Run

**Symptoms**: Run status = FAILED

**Procedure**:
1. Query failed steps:
   ```sql
   SELECT id, step_type, error_details
   FROM steps
   WHERE run_id = $run_id AND status = 'FAILED';
   ```

2. Check events for failure cause:
   ```sql
   SELECT event_type, event_data
   FROM orchestration_events
   WHERE aggregate_id = $failed_step_id AND event_type = 'STEP_FAILED';
   ```

3. Check tool calls:
   ```sql
   SELECT tool_name, tool_args, error_details
   FROM tool_calls
   WHERE step_id = $failed_step_id AND status = 'FAILED';
   ```

4. Verify retry attempts:
   ```sql
   SELECT retry_count FROM steps WHERE id = $failed_step_id;
   ```

---

### Trace External Effect

**Given**: Effect not executed

**Procedure**:
1. Check effect status:
   ```sql
   SELECT status, retry_count, next_retry_at
   FROM effects
   WHERE id = $effect_id;
   ```

2. Check outbox entry:
   ```sql
   SELECT status, error_details, retry_count
   FROM outbox_events
   WHERE aggregate_type = 'EFFECT' AND aggregate_id = $effect_id;
   ```

3. If DEAD_LETTER, check reason:
   ```sql
   SELECT error_details FROM outbox_events WHERE id = $outbox_id;
   ```

4. Requeue if transient failure:
   ```sql
   UPDATE outbox_events
   SET status = 'PENDING', retry_count = 0, next_retry_at = NULL
   WHERE id = $outbox_id;
   ```

---

## 9. Production-Ready Criteria

### Objective Exit Conditions

**Schema Validation**:
- ✅ FIT-ORCH-SCHEMA-001 all tests pass
- ✅ All mandatory columns present
- ✅ RLS enabled and tested
- ✅ Foreign keys enforce integrity

**Data Quality**:
- ✅ FIT-DATA-QUALITY-001 all tests pass
- ✅ Zero orphaned records
- ✅ Zero inconsistent counters
- ✅ Backup/restore verified within 30 days

**Abstraction Layer**:
- ✅ FIT-PERSISTENCE-ABSTRACTION-001 all tests pass
- ✅ No direct database access in feature code
- ✅ Repositories enforce tenant isolation
- ✅ Events append-only enforced

**Idempotency**:
- ✅ Duplicate signals rejected (UNIQUE constraint)
- ✅ Duplicate outbox entries ignored (idempotency_key)
- ✅ Effect execution idempotent

**Traceability**:
- ✅ All entities have `correlation_id`
- ✅ All events have `actor` and `causation_id`
- ✅ Full trace reconstructable via debugging procedure

**Operational Readiness**:
- ✅ Migrations reversible
- ✅ Cleanup jobs automated
- ✅ Monitoring dashboards active
- ✅ Runbooks documented

**Performance**:
- ✅ Common queries use indexes (EXPLAIN ANALYZE)
- ✅ Query response time < 100ms (p95)
- ✅ Event append latency < 10ms (p99)

---

## 10. Reference

### Canonical Authority
- CANON-PERSISTENCE-001: Architectural laws
- CANON-ORCH-STATE-001: Runtime state model
- CANON-EVENTS-001: Event sourcing + outbox
- CANON-TRACE-001: Audit + traceability

### Validation Tests
- FIT-PERSISTENCE-ABSTRACTION-001: Repository + query layer
- FIT-ORCH-SCHEMA-001: Schema validation
- FIT-DATA-QUALITY-001: Integrity + quality gates

### Implementation Artifacts
- `src/persistence/repositories/`: Repository implementations
- `src/persistence/queries/`: Query service implementations
- `migrations/`: Versioned schema migrations

---

**Walkthrough validated. Persistence Plane remains SEALED.**
