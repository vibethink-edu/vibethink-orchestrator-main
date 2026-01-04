# CANON-PERSISTENCE-001: Orchestrator Persistence Canon

**Status**: CANONICAL
**Type**: ARCHITECTURAL_CORE
**Version**: 1.0.0
**Date**: 2026-01-04
**Authority**: Principal Data Architect & DBA-AI
**Scope**: Persistence Plane (Orchestrator State & Data)

---

## 1. Purpose & Scope

This canon establishes the **Persistence Plane** for the AI-first Orchestrator, defining how orchestration state is durably stored, retrieved, and governed. The Persistence Plane is distinct from:

- **Memory Plane** (Canonical Memory, RAG, Vector Stores) — covered in CANON-MEM-PLANE-001
- **Reasoning Plane** (Specialists, Decision Logic) — covered separately
- **UX Plane** (Projections, UI State) — covered separately

**Persistence Plane Scope**:
- Orchestrator runtime state (Signals, Runs, Steps, Effects, ToolCalls)
- Event sourcing and outbox patterns
- Audit trails and traceability
- Schema governance and migrations
- Data quality and integrity enforcement

**Critical Principle**: Persistence is the **durable substrate of orchestration execution**. All orchestration state MUST be reproducible from persisted data. Ephemeral caching permitted, but loss of cache MUST NOT cause orchestration failure.

---

## 2. Separation of Concerns

### 2.1 System of Record (SoR) vs Runtime State vs Projections

```
┌─────────────────────────────────────────────────────────┐
│  SYSTEM OF RECORD (SoR)                                 │
│  - Authoritative operational truth                      │
│  - Domain entities: Person, Organization, Case, Program │
│  - Events: Communication Signals, Interaction Events    │
│  - Commitments: Contracts, Agreements                   │
│  - Knowledge Artifacts: Policies, Documents             │
│  - Managed by Memory Plane (CANON-MEM-PLANE-001)        │
└─────────────────────────────────────────────────────────┘
                         ↕ references (FK, not duplication)
┌─────────────────────────────────────────────────────────┐
│  RUNTIME STATE (Orchestrator Persistence Plane)         │
│  - Signals: Normalized external inputs                  │
│  - Runs: Orchestration executions                       │
│  - Steps: Reasoning transitions/decisions               │
│  - Effects: Requested actions (email, API call, etc)    │
│  - ToolCalls: LLM tool invocations + results            │
│  - Checkpoints: Resumable state snapshots               │
│  - Append-only event log (reproducibility)              │
└─────────────────────────────────────────────────────────┘
                         ↕ materializes into
┌─────────────────────────────────────────────────────────┐
│  PROJECTIONS (Read Models)                              │
│  - Denormalized views for query performance             │
│  - Dashboard aggregates (run counts, success rates)     │
│  - Timeline views (signal → run → effects chain)        │
│  - Rebuildable from Runtime State + SoR                 │
│  - NEVER source of truth (expendable)                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Boundary Rules

**System of Record (SoR)**:
- **MUST**: Store domain entities (Person, Organization, Case, Program)
- **MUST**: Store operational events (Communication Signals, Interaction Events)
- **MUST**: Be managed by Memory Plane service layer (not Orchestrator direct writes)
- **MUST NOT**: Store orchestration execution state (Runs, Steps)
- **MUST NOT**: Store ephemeral tool calls or checkpoints

**Runtime State (Orchestrator)**:
- **MUST**: Store orchestration execution state (Signal, Run, Step, Effect, ToolCall, Checkpoint)
- **MUST**: Reference SoR entities via FK (e.g., `case_id UUID REFERENCES entities(id)`)
- **MUST NOT**: Duplicate SoR entity data (name, metadata) in orchestration tables
- **MUST NOT**: Modify SoR entities directly (use Memory Plane service layer)
- **SHOULD**: Be append-only for audit and replay (no UPDATE/DELETE on historical records)

**Projections (Read Models)**:
- **MUST**: Be derived from Runtime State + SoR (materialized views, CQRS read models)
- **MUST**: Be rebuildable (drop and recreate without data loss)
- **MUST NOT**: Be source of truth for any business logic
- **MAY**: Use caching, denormalization for performance
- **SHOULD**: Have TTL or refresh strategy

---

## 3. Persistence Layers

### 3.1 Layer Taxonomy

| Layer | Purpose | Mutability | Retention | Example Tables |
|-------|---------|------------|-----------|----------------|
| **Event Log** | Immutable audit trail | Append-only | Long (years) | `orchestration_events`, `audit_trail` |
| **Runtime State** | Current execution state | Mutable (terminal states frozen) | Medium (months) | `signals`, `runs`, `steps`, `effects` |
| **Checkpoints** | Resumable snapshots | Mutable (garbage collected) | Short (days) | `run_checkpoints` |
| **Projections** | Query optimization | Rebuildable | Short (hours/days) | `run_summary_view`, `dashboard_stats` |
| **Outbox** | External integrations | Append-only, processed items deleted | Very short (minutes) | `outbox_events` |

### 3.2 Persistence Guarantees (MUST)

**Durability**:
- All writes to Runtime State MUST be ACID-compliant (transactional)
- Critical state changes (run started, step completed) MUST be fsynced before acknowledgment
- Orchestrator MUST NOT acknowledge signal processing until persisted

**Reproducibility**:
- Given Event Log, reconstruct entire orchestration execution history
- Given Run ID + Checkpoint ID, resume execution from exact state
- No "hidden state" in memory or external systems (all state persisted)

**Auditability**:
- Every state change MUST have: `correlation_id`, `causation_id`, `actor`, `timestamp`
- Every mutation MUST be traceable to originating signal or human action
- Redaction/PII masking MUST preserve audit trail integrity

**Multi-Tenancy**:
- ALL tables MUST have `tenant_id UUID NOT NULL`
- RLS (Row-Level Security) enforced at DB level
- Cross-tenant queries PROHIBITED (no JOIN across `tenant_id`)

---

## 4. Core Persistence Contracts

### 4.1 Signal (External Input)

**Definition**: Normalized representation of external input (email, webhook, chat message, API call) ready for orchestration.

**Schema Contract**:
```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL, -- Multi-tenant isolation
  signal_type VARCHAR(50) NOT NULL, -- EMAIL, WEBHOOK, CHAT, API_CALL
  source_channel VARCHAR(100) NOT NULL, -- ESI identifier (gmail, slack, twilio)
  source_id VARCHAR(255) NOT NULL, -- External ID (email message-id, slack ts)
  source_hash VARCHAR(64) NOT NULL, -- SHA-256 of raw payload
  normalized_payload JSONB NOT NULL, -- Canonical structure
  received_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ DEFAULT NOW(),
  ingested_by VARCHAR(100), -- Agent/service that ingested
  correlation_id UUID NOT NULL, -- Trace correlation
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | PROCESSING | PROCESSED | FAILED
  processed_at TIMESTAMPTZ,
  UNIQUE(tenant_id, source_channel, source_id) -- Idempotency
);
```

**Rules** (MUST):
- `source_id` + `source_channel` + `tenant_id` UNIQUE (prevent duplicate ingestion)
- `source_hash` immutable (detect payload tampering)
- `normalized_payload` follows schema per `signal_type` (validated pre-insert)
- Status transitions: `PENDING → PROCESSING → PROCESSED | FAILED` (append-only event log records transitions)

**Rules** (MUST NOT):
- Store raw external payload in `signals` table (store in blob storage, reference via `source_id`)
- Mutate `normalized_payload` after insert (create new signal version if correction needed)

---

### 4.2 Run (Orchestration Execution)

**Definition**: Single orchestration execution triggered by a Signal, consisting of Steps executed by Reasoning Layer.

**Schema Contract**:
```sql
CREATE TABLE runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  signal_id UUID NOT NULL REFERENCES signals(id),
  run_type VARCHAR(50) NOT NULL, -- SIGNAL_PROCESSING, SCHEDULED_TASK, HUMAN_TRIGGERED
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'RUNNING', -- RUNNING | COMPLETED | FAILED | CANCELLED
  exit_reason VARCHAR(100), -- Success summary or error code
  correlation_id UUID NOT NULL,
  causation_id UUID, -- Parent run_id if triggered by another run
  orchestrator_version VARCHAR(50), -- Code version for replay
  total_steps INTEGER DEFAULT 0,
  failed_steps INTEGER DEFAULT 0
);

CREATE INDEX idx_runs_tenant_status ON runs(tenant_id, status, started_at DESC);
CREATE INDEX idx_runs_correlation ON runs(correlation_id);
```

**Rules** (MUST):
- `signal_id` MUST reference valid signal (FK enforced)
- `status` transitions: `RUNNING → COMPLETED | FAILED | CANCELLED` (state machine enforced)
- `completed_at` MUST be set when status transitions to terminal state
- `orchestrator_version` recorded for replay compatibility

**Rules** (MUST NOT):
- Delete runs (soft delete via `deleted_at` if cleanup needed)
- Restart completed/failed runs by mutating status (create new run, link via `causation_id`)

---

### 4.3 Step (Reasoning Transition)

**Definition**: Atomic unit of reasoning within a Run (decision point, specialist invocation, tool call sequence).

**Schema Contract**:
```sql
CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id),
  step_index INTEGER NOT NULL, -- 0-based sequential position in run
  step_type VARCHAR(50) NOT NULL, -- DECISION, SPECIALIST_CALL, TOOL_SEQUENCE, EFFECT_REQUEST
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'RUNNING', -- RUNNING | COMPLETED | FAILED | SKIPPED
  input_context JSONB, -- Input to this step (prior step output, signal data)
  output_result JSONB, -- Step output (decision, tool results, effect spec)
  specialist_id VARCHAR(100), -- If step_type = SPECIALIST_CALL
  error_details JSONB, -- If status = FAILED
  retry_count INTEGER DEFAULT 0,
  UNIQUE(run_id, step_index)
);

CREATE INDEX idx_steps_run ON steps(run_id, step_index);
```

**Rules** (MUST):
- `step_index` unique per run (sequential, no gaps)
- `input_context` + `output_result` sufficient to reproduce step execution
- Steps within run ordered by `step_index` (deterministic replay)

**Rules** (SHOULD):
- Large `input_context`/`output_result` (>100KB) stored in blob storage, reference via ID

---

### 4.4 Effect (Requested Action)

**Definition**: External action requested by orchestration (send email, call API, update SoR entity).

**Schema Contract**:
```sql
CREATE TABLE effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id),
  step_id UUID NOT NULL REFERENCES steps(id),
  effect_type VARCHAR(50) NOT NULL, -- SEND_EMAIL, API_CALL, SOR_UPDATE, NOTIFY_USER
  effect_spec JSONB NOT NULL, -- Parameters for effect execution
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | EXECUTING | COMPLETED | FAILED
  execution_result JSONB, -- Result from effect executor
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

CREATE INDEX idx_effects_status ON effects(tenant_id, status, requested_at);
```

**Rules** (MUST):
- Effects MUST be idempotent (re-execution safe)
- `effect_spec` MUST include idempotency key (e.g., `{ idempotency_key: 'run-123-step-5-effect-email' }`)
- Effect executors MUST check `status` before execution (avoid double execution)

**Rules** (MUST NOT):
- Execute effects synchronously in orchestration loop (deferred via outbox)
- Mutate effect spec after insert (create new effect if correction needed)

---

### 4.5 ToolCall & ToolResult

**Definition**: LLM tool invocation during step execution (function call + result).

**Schema Contract**:
```sql
CREATE TABLE tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id),
  step_id UUID NOT NULL REFERENCES steps(id),
  tool_name VARCHAR(100) NOT NULL,
  tool_args JSONB NOT NULL,
  called_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | COMPLETED | FAILED
  result JSONB, -- Tool execution result
  error_details JSONB,
  execution_duration_ms INTEGER
);

CREATE INDEX idx_tool_calls_step ON tool_calls(step_id, called_at);
```

**Rules** (MUST):
- Tool calls within step executed sequentially (deterministic replay)
- `tool_args` + `result` sufficient to reproduce reasoning (no hidden state)
- Failed tool calls recorded (do not delete)

**Rules** (SHOULD):
- Cache tool results in Working Memory (CANON-MEM-PLANE-001) with TTL
- Record cache hit/miss in `tool_calls` metadata

---

### 4.6 Checkpoint & Snapshot

**Definition**: Resumable state snapshot for long-running runs (crash recovery).

**Schema Contract**:
```sql
CREATE TABLE run_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id),
  checkpoint_index INTEGER NOT NULL,
  checkpoint_data JSONB NOT NULL, -- Serialized run state
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  size_bytes INTEGER,
  UNIQUE(run_id, checkpoint_index)
);
```

**Rules** (MUST):
- Checkpoints created every N steps (configurable, e.g., every 10 steps)
- `checkpoint_data` contains: completed step IDs, pending effects, specialist state
- TTL enforced (old checkpoints garbage collected)

**Rules** (SHOULD):
- Checkpoint compression (gzip JSONB before storage)
- Size limit per checkpoint (1 MB soft limit, 10 MB hard limit)

---

## 5. Event Sourcing & Append-Only Patterns

### 5.1 Event Log (Immutable Audit Trail)

**Schema Contract**:
```sql
CREATE TABLE orchestration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- SIGNAL_RECEIVED, RUN_STARTED, STEP_COMPLETED, etc.
  aggregate_type VARCHAR(50) NOT NULL, -- SIGNAL, RUN, STEP, EFFECT
  aggregate_id UUID NOT NULL, -- ID of signal/run/step/effect
  event_data JSONB NOT NULL,
  correlation_id UUID NOT NULL,
  causation_id UUID, -- Event that caused this event
  actor VARCHAR(100), -- Agent, user, or system
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  sequence_number BIGSERIAL -- Global ordering
);

CREATE INDEX idx_events_aggregate ON orchestration_events(aggregate_type, aggregate_id, sequence_number);
CREATE INDEX idx_events_correlation ON orchestration_events(correlation_id, sequence_number);
```

**Rules** (MUST):
- ALL state changes recorded as events (no silent mutations)
- Events NEVER deleted (retention via archival, not deletion)
- `sequence_number` provides global ordering (replay deterministic)

**Event Types** (MUST emit):
- `SIGNAL_RECEIVED`: External input ingested
- `RUN_STARTED`: Orchestration execution began
- `STEP_STARTED`, `STEP_COMPLETED`, `STEP_FAILED`: Step lifecycle
- `EFFECT_REQUESTED`, `EFFECT_EXECUTED`, `EFFECT_FAILED`: Effect lifecycle
- `RUN_COMPLETED`, `RUN_FAILED`, `RUN_CANCELLED`: Run terminal states

---

### 5.2 State Reconstruction (Replay)

**Guarantee** (MUST):
Given `correlation_id`, reconstruct entire orchestration execution:

```sql
-- Replay all events for a correlation
SELECT event_type, event_data, occurred_at
FROM orchestration_events
WHERE correlation_id = $1
ORDER BY sequence_number ASC;
```

**Use Cases**:
- Debugging failed runs (replay events, inspect state at each step)
- Audit compliance (prove what happened, when, and why)
- Testing orchestrator changes (replay historical signals, validate new behavior)

---

## 6. Anti-Patterns (PROHIBITED)

### 6.1 Direct Table Access

**MUST NOT**:
```typescript
// ❌ WRONG: Feature code directly querying DB
const runs = await db.query('SELECT * FROM runs WHERE tenant_id = $1', [tenantId]);
```

**MUST**:
```typescript
// ✅ CORRECT: Via repository abstraction
const runs = await runRepository.findByTenant(tenantId);
```

**Reason**: Direct table access bypasses:
- Multi-tenant RLS enforcement
- Query optimization (indexes, caching)
- Schema evolution (repository abstracts schema changes)

---

### 6.2 Runtime State as SoR

**MUST NOT**:
```typescript
// ❌ WRONG: Storing domain entity data in runs table
CREATE TABLE runs (
  id UUID,
  case_name VARCHAR(255), -- Duplicates SoR entities.name
  customer_email VARCHAR(255) -- Duplicates SoR Person.email
);
```

**MUST**:
```typescript
// ✅ CORRECT: Reference SoR via FK
CREATE TABLE runs (
  id UUID,
  case_id UUID REFERENCES entities(id), -- FK to SoR
  -- Query SoR for case_name when needed
);
```

**Reason**: Duplication causes:
- Data drift (updates to SoR not reflected in runs)
- Increased storage
- Maintenance burden (two sources of truth)

---

### 6.3 Mutation Without Audit

**MUST NOT**:
```sql
-- ❌ WRONG: Silent UPDATE (no audit trail)
UPDATE steps SET status = 'FAILED' WHERE id = $1;
```

**MUST**:
```typescript
// ✅ CORRECT: Emit event + update state
await eventBus.emit({
  event_type: 'STEP_FAILED',
  aggregate_id: stepId,
  event_data: { error: errorDetails }
});
await stepRepository.updateStatus(stepId, 'FAILED');
```

**Reason**: Silent mutations break:
- Auditability (no record of change)
- Reproducibility (cannot replay)
- Debugging (lost context)

---

### 6.4 Cross-Tenant Queries

**MUST NOT**:
```sql
-- ❌ WRONG: Aggregating across tenants
SELECT COUNT(*) FROM runs; -- All tenants
```

**MUST**:
```sql
-- ✅ CORRECT: Scoped to single tenant
SELECT COUNT(*) FROM runs WHERE tenant_id = $1;
```

**Reason**: Cross-tenant queries:
- Violate isolation (data leakage risk)
- Break RLS assumptions
- Create compliance violations

---

### 6.5 Projections as Source of Truth

**MUST NOT**:
```typescript
// ❌ WRONG: Querying projection for business logic
const activeRuns = await db.query('SELECT * FROM run_summary_view WHERE status = $1', ['RUNNING']);
if (activeRuns.length > 10) { /* throttle */ }
```

**MUST**:
```typescript
// ✅ CORRECT: Query Runtime State
const activeRuns = await runRepository.findByStatus(tenantId, 'RUNNING');
if (activeRuns.length > 10) { /* throttle */ }
```

**Reason**: Projections are:
- Rebuildable (may be stale or missing)
- Denormalized (may have cached inconsistencies)
- Not authoritative

---

## 7. Schema Governance

### 7.1 Naming Conventions (MUST)

- **Tables**: Plural, lowercase, underscore-separated (`signals`, `run_checkpoints`)
- **Columns**: Lowercase, underscore-separated (`tenant_id`, `correlation_id`)
- **Indexes**: `idx_{table}_{columns}` (`idx_runs_tenant_status`)
- **Foreign Keys**: `fk_{table}_{ref_table}` (`fk_steps_runs`)
- **Enums**: UPPERCASE, underscore-separated (`SIGNAL_RECEIVED`, `STEP_COMPLETED`)

### 7.2 Mandatory Columns (MUST)

ALL tables MUST have:
```sql
tenant_id UUID NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

Audit-critical tables MUST add:
```sql
correlation_id UUID NOT NULL,
causation_id UUID,
actor VARCHAR(100)
```

### 7.3 Migrations (MUST)

- **Versioned**: `YYYYMMDDHHMMSS_description.sql` (`20260104120000_add_run_checkpoints.sql`)
- **Reversible**: Every migration MUST have rollback script
- **Tested**: Migration applied to staging, validated before production
- **Atomic**: Single transaction per migration (rollback on failure)

**Migration Tools** (RECOMMENDED):
- Flyway (Java)
- golang-migrate
- Alembic (Python)
- Custom (if vendor-agnostic required)

---

## 8. Multi-Tenant Enforcement

### 8.1 Row-Level Security (RLS)

**MUST** enable RLS on ALL tables:
```sql
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_signals ON signals
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = current_user_id()
    )
  );
```

### 8.2 Application-Level Enforcement

**MUST** validate `tenant_id` at repository layer:
```typescript
class RunRepository {
  async findById(runId: string, tenantId: string): Promise<Run | null> {
    // MUST include tenant_id in WHERE clause
    return db.query(
      'SELECT * FROM runs WHERE id = $1 AND tenant_id = $2',
      [runId, tenantId]
    );
  }
}
```

**MUST NOT** trust client-provided `tenant_id`:
```typescript
// ❌ WRONG: User can manipulate tenant_id
const tenantId = req.body.tenant_id;

// ✅ CORRECT: Derive from authenticated session
const tenantId = session.user.tenant_id;
```

---

## 9. Data Quality & Integrity

### 9.1 Constraints (MUST)

- **Primary Keys**: ALL tables MUST have PK (UUID default)
- **Foreign Keys**: ALL references MUST have FK constraints (cascades defined)
- **NOT NULL**: Required fields enforced at DB level
- **UNIQUE**: Idempotency keys enforced via UNIQUE constraints
- **CHECK**: Enum values, range checks enforced

### 9.2 Idempotency (MUST)

- **Signals**: `UNIQUE(tenant_id, source_channel, source_id)`
- **Effects**: `idempotency_key` in `effect_spec` JSONB
- **Events**: De-duplication via `(aggregate_id, event_type, occurred_at)` if needed

### 9.3 Validation Checklist

**Pre-Deployment** (MUST verify):
- [ ] All tables have `tenant_id`
- [ ] All tables have RLS policies
- [ ] All FKs have ON DELETE behavior defined
- [ ] All migrations reversible
- [ ] All indexes cover query patterns (EXPLAIN ANALYZE)

---

## 10. Retention & Cleanup

### 10.1 Retention Policies (Default)

| Data Type | Retention | Cleanup Method |
|-----------|-----------|----------------|
| **Signals** | 30 days | Archive to cold storage, delete from hot DB |
| **Runs** | 90 days | Soft delete (`deleted_at`), archive after 1 year |
| **Steps** | 90 days | Cascade delete with runs |
| **Effects** | 90 days | Cascade delete with runs |
| **ToolCalls** | 30 days | Cascade delete with steps |
| **Checkpoints** | 7 days | TTL-based deletion (expires_at) |
| **Events** | 2 years | Archive to S3/GCS, compress |

### 10.2 Cleanup Automation (SHOULD)

```sql
-- Scheduled job: Delete expired checkpoints
DELETE FROM run_checkpoints WHERE expires_at < NOW();

-- Scheduled job: Archive old signals
INSERT INTO signals_archive SELECT * FROM signals WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM signals WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## 11. Architectural Invariants

1. **Runtime State ≠ SoR**: Orchestration state references domain entities via FK, never duplicates
2. **Append-only events**: Event log immutable, ALL state changes recorded
3. **Reproducibility**: Given events, reconstruct full execution history
4. **Multi-tenant always-on**: `tenant_id` mandatory, RLS enforced
5. **Vendor-agnostic**: Schema portable (Postgres → MySQL → CockroachDB)
6. **No direct table access**: Features use repositories, never raw SQL
7. **Projections expendable**: Read models rebuildable from Runtime State
8. **Auditability**: Every mutation traceable via `correlation_id` + `causation_id` + `actor`

---

**END OF CANON-PERSISTENCE-001**
