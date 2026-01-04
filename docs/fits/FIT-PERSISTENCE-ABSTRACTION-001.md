# FIT-PERSISTENCE-ABSTRACTION-001: Persistence Abstraction Layer

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-PERSISTENCE-001, CANON-ORCH-STATE-001

---

## 1. Purpose

This FIT validates that **Persistence Abstraction Layer** correctly isolates orchestration features from direct database access, enforcing:

- Repository pattern for writes
- Query layer for reads
- Unit of Work for transactions
- No direct table access from features/agents
- Multi-tenant isolation at abstraction boundaries

**Pass Criteria**: All orchestration code accesses persistence via abstraction layer (zero direct SQL in features).

---

## 2. Architecture

```
┌───────────────────────────────────────────────────────┐
│  FEATURE LAYER (Orchestrator, Specialists)           │
│  - NO direct DB access                                │
│  - NO raw SQL queries                                 │
│  - Uses repositories + query services                 │
└───────────────────────────────────────────────────────┘
                         ↓ uses
┌───────────────────────────────────────────────────────┐
│  PERSISTENCE ABSTRACTION LAYER                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ REPOSITORIES (Write Operations)                 │  │
│  │ - SignalRepository                              │  │
│  │ - RunRepository                                 │  │
│  │ - StepRepository                                │  │
│  │ - EffectRepository                              │  │
│  │ - EventRepository                               │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ QUERY LAYER (Read Operations)                   │  │
│  │ - SignalQueryService                            │  │
│  │ - RunQueryService                               │  │
│  │ - TraceQueryService                             │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ UNIT OF WORK (Transaction Management)           │  │
│  │ - begin()                                       │  │
│  │ - commit()                                      │  │
│  │ - rollback()                                    │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
                         ↓ executes
┌───────────────────────────────────────────────────────┐
│  DATABASE LAYER                                       │
│  - PostgreSQL (or vendor-agnostic DB)                 │
│  - Raw SQL execution                                  │
│  - RLS enforcement                                    │
└───────────────────────────────────────────────────────┘
```

---

## 3. Repository Pattern (Write Operations)

### 3.1 Repository Interface (MUST Implement)

```typescript
interface IRepository<T> {
  // Create
  create(entity: T, tenantId: string): Promise<T>;

  // Read
  findById(id: string, tenantId: string): Promise<T | null>;

  // Update
  update(id: string, changes: Partial<T>, tenantId: string): Promise<T>;

  // Delete (soft delete)
  delete(id: string, tenantId: string): Promise<void>;

  // Bulk operations
  createMany(entities: T[], tenantId: string): Promise<T[]>;
}
```

---

### 3.2 SignalRepository

**Interface**:
```typescript
interface ISignalRepository extends IRepository<Signal> {
  findBySourceId(
    sourceChannel: string,
    sourceId: string,
    tenantId: string
  ): Promise<Signal | null>;

  findPending(tenantId: string, limit: number): Promise<Signal[]>;

  updateStatus(
    signalId: string,
    status: SignalStatus,
    tenantId: string
  ): Promise<void>;
}
```

**Implementation** (Example):
```typescript
class SignalRepository implements ISignalRepository {
  constructor(private db: Database) {}

  async create(signal: Signal, tenantId: string): Promise<Signal> {
    // MUST enforce tenant_id
    const result = await this.db.insert(signals).values({
      ...signal,
      tenant_id: tenantId, // ENFORCED
    }).returning();

    return result[0];
  }

  async findById(id: string, tenantId: string): Promise<Signal | null> {
    // MUST include tenant_id in WHERE clause
    const result = await this.db.select()
      .from(signals)
      .where(
        and(
          eq(signals.id, id),
          eq(signals.tenant_id, tenantId) // TENANT ISOLATION
        )
      )
      .limit(1);

    return result[0] || null;
  }

  async findBySourceId(
    sourceChannel: string,
    sourceId: string,
    tenantId: string
  ): Promise<Signal | null> {
    const result = await this.db.select()
      .from(signals)
      .where(
        and(
          eq(signals.source_channel, sourceChannel),
          eq(signals.source_id, sourceId),
          eq(signals.tenant_id, tenantId) // TENANT ISOLATION
        )
      )
      .limit(1);

    return result[0] || null;
  }

  async updateStatus(
    signalId: string,
    status: SignalStatus,
    tenantId: string
  ): Promise<void> {
    await this.db.update(signals)
      .set({ status, updated_at: new Date() })
      .where(
        and(
          eq(signals.id, signalId),
          eq(signals.tenant_id, tenantId) // TENANT ISOLATION
        )
      );
  }
}
```

**Rules** (MUST):
- ALL queries include `tenant_id` filter (prevent cross-tenant leakage)
- Create operations MUST set `tenant_id` explicitly
- Update/Delete operations MUST validate `tenant_id` matches

---

### 3.3 RunRepository

**Interface**:
```typescript
interface IRunRepository extends IRepository<Run> {
  findBySignalId(signalId: string, tenantId: string): Promise<Run | null>;

  findByCorrelationId(correlationId: string, tenantId: string): Promise<Run[]>;

  findActiveRuns(tenantId: string, limit: number): Promise<Run[]>;

  updateStatus(
    runId: string,
    status: RunStatus,
    exitReason?: string,
    tenantId?: string
  ): Promise<void>;

  incrementStepCounters(
    runId: string,
    totalSteps: number,
    failedSteps: number,
    tenantId: string
  ): Promise<void>;
}
```

**Implementation**:
```typescript
class RunRepository implements IRunRepository {
  constructor(private db: Database) {}

  async findByCorrelationId(correlationId: string, tenantId: string): Promise<Run[]> {
    return this.db.select()
      .from(runs)
      .where(
        and(
          eq(runs.correlation_id, correlationId),
          eq(runs.tenant_id, tenantId)
        )
      )
      .orderBy(asc(runs.started_at));
  }

  async updateStatus(
    runId: string,
    status: RunStatus,
    exitReason?: string,
    tenantId?: string
  ): Promise<void> {
    const updates: Partial<Run> = {
      status,
      updated_at: new Date(),
    };

    if (status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED') {
      updates.completed_at = new Date();
      updates.exit_reason = exitReason;
    }

    await this.db.update(runs)
      .set(updates)
      .where(
        and(
          eq(runs.id, runId),
          tenantId ? eq(runs.tenant_id, tenantId) : sql`TRUE` // Optional tenant validation
        )
      );
  }

  async incrementStepCounters(
    runId: string,
    totalSteps: number,
    failedSteps: number,
    tenantId: string
  ): Promise<void> {
    await this.db.update(runs)
      .set({
        total_steps: sql`total_steps + ${totalSteps}`,
        failed_steps: sql`failed_steps + ${failedSteps}`,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(runs.id, runId),
          eq(runs.tenant_id, tenantId)
        )
      );
  }
}
```

---

### 3.4 EventRepository (Append-Only)

**Interface**:
```typescript
interface IEventRepository {
  append(event: OrchestrationEvent, tenantId: string): Promise<OrchestrationEvent>;

  findByCorrelationId(correlationId: string, tenantId: string): Promise<OrchestrationEvent[]>;

  findByAggregateId(
    aggregateType: string,
    aggregateId: string,
    tenantId: string
  ): Promise<OrchestrationEvent[]>;

  findCausalChain(eventId: string, tenantId: string): Promise<OrchestrationEvent[]>;
}
```

**Implementation**:
```typescript
class EventRepository implements IEventRepository {
  constructor(private db: Database) {}

  async append(event: OrchestrationEvent, tenantId: string): Promise<OrchestrationEvent> {
    // MUST be append-only (no UPDATE/DELETE)
    const result = await this.db.insert(orchestration_events).values({
      ...event,
      tenant_id: tenantId,
      occurred_at: event.occurred_at || new Date(),
    }).returning();

    return result[0];
  }

  async findCausalChain(eventId: string, tenantId: string): Promise<OrchestrationEvent[]> {
    // Recursive CTE to traverse causality
    const query = sql`
      WITH RECURSIVE causal_chain AS (
        SELECT * FROM orchestration_events
        WHERE id = ${eventId} AND tenant_id = ${tenantId}

        UNION ALL

        SELECT e.*
        FROM orchestration_events e
        JOIN causal_chain c ON e.id = c.causation_id
        WHERE e.tenant_id = ${tenantId}
      )
      SELECT * FROM causal_chain ORDER BY occurred_at ASC
    `;

    return this.db.execute(query);
  }
}
```

**Rules** (MUST):
- Events NEVER updated or deleted (append-only)
- `occurred_at` defaults to NOW() if not provided
- Tenant ID enforced on all reads

---

## 4. Query Layer (Read Operations)

### 4.1 Query Service Pattern

**Purpose**: Separate read models from write models (CQRS-lite).

**Rules** (MUST):
- Query services optimize for read performance (denormalization, caching)
- Query services NEVER mutate state (read-only)
- Complex JOINs and aggregations belong in query layer

---

### 4.2 SignalQueryService

**Interface**:
```typescript
interface ISignalQueryService {
  findPendingSignals(tenantId: string, limit: number): Promise<Signal[]>;

  findRecentSignals(tenantId: string, hours: number): Promise<Signal[]>;

  countByStatus(tenantId: string): Promise<Record<SignalStatus, number>>;
}
```

**Implementation**:
```typescript
class SignalQueryService implements ISignalQueryService {
  constructor(private db: Database) {}

  async findPendingSignals(tenantId: string, limit: number): Promise<Signal[]> {
    return this.db.select()
      .from(signals)
      .where(
        and(
          eq(signals.tenant_id, tenantId),
          eq(signals.status, 'PENDING')
        )
      )
      .orderBy(asc(signals.received_at))
      .limit(limit);
  }

  async countByStatus(tenantId: string): Promise<Record<SignalStatus, number>> {
    const results = await this.db.select({
      status: signals.status,
      count: sql<number>`COUNT(*)`,
    })
      .from(signals)
      .where(eq(signals.tenant_id, tenantId))
      .groupBy(signals.status);

    return results.reduce((acc, r) => {
      acc[r.status] = r.count;
      return acc;
    }, {} as Record<SignalStatus, number>);
  }
}
```

---

### 4.3 TraceQueryService

**Interface**:
```typescript
interface ITraceQueryService {
  getFullTrace(correlationId: string, tenantId: string): Promise<ExecutionTrace>;

  getCausalChain(eventId: string, tenantId: string): Promise<OrchestrationEvent[]>;

  getActorActivity(actor: string, tenantId: string, limit: number): Promise<OrchestrationEvent[]>;
}
```

**Implementation**:
```typescript
class TraceQueryService implements ITraceQueryService {
  constructor(private db: Database) {}

  async getFullTrace(correlationId: string, tenantId: string): Promise<ExecutionTrace> {
    // Fetch all entities with this correlation_id
    const [signal, run, steps, effects, events] = await Promise.all([
      this.db.select().from(signals).where(
        and(eq(signals.correlation_id, correlationId), eq(signals.tenant_id, tenantId))
      ),
      this.db.select().from(runs).where(
        and(eq(runs.correlation_id, correlationId), eq(runs.tenant_id, tenantId))
      ),
      this.db.select().from(steps).join(runs).on(eq(steps.run_id, runs.id)).where(
        and(eq(runs.correlation_id, correlationId), eq(runs.tenant_id, tenantId))
      ),
      this.db.select().from(effects).join(runs).on(eq(effects.run_id, runs.id)).where(
        and(eq(runs.correlation_id, correlationId), eq(runs.tenant_id, tenantId))
      ),
      this.db.select().from(orchestration_events).where(
        and(eq(orchestration_events.correlation_id, correlationId), eq(orchestration_events.tenant_id, tenantId))
      ).orderBy(asc(orchestration_events.sequence_number)),
    ]);

    return {
      correlation_id: correlationId,
      signal: signal[0],
      runs: run,
      steps,
      effects,
      events,
    };
  }
}
```

---

## 5. Unit of Work (Transaction Management)

### 5.1 Interface

```typescript
interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  // Access repositories within transaction
  signals: ISignalRepository;
  runs: IRunRepository;
  steps: IStepRepository;
  effects: IEffectRepository;
  events: IEventRepository;
}
```

---

### 5.2 Implementation

```typescript
class UnitOfWork implements IUnitOfWork {
  private transaction: Transaction | null = null;

  constructor(private db: Database) {}

  async begin(): Promise<void> {
    this.transaction = await this.db.transaction();
  }

  async commit(): Promise<void> {
    if (!this.transaction) throw new Error('No active transaction');
    await this.transaction.commit();
    this.transaction = null;
  }

  async rollback(): Promise<void> {
    if (!this.transaction) throw new Error('No active transaction');
    await this.transaction.rollback();
    this.transaction = null;
  }

  // Lazy-loaded repositories (scoped to transaction)
  get signals(): ISignalRepository {
    return new SignalRepository(this.transaction || this.db);
  }

  get runs(): IRunRepository {
    return new RunRepository(this.transaction || this.db);
  }

  get events(): IEventRepository {
    return new EventRepository(this.transaction || this.db);
  }
}
```

---

### 5.3 Usage Pattern

**Atomic Operation** (Signal Ingestion):
```typescript
async function ingestSignal(signalData: any, tenantId: string): Promise<Signal> {
  const uow = new UnitOfWork(db);

  try {
    await uow.begin();

    // Create signal
    const signal = await uow.signals.create({
      signal_type: 'EMAIL',
      source_channel: 'gmail',
      source_id: signalData.message_id,
      normalized_payload: signalData,
      correlation_id: uuidv4(),
    }, tenantId);

    // Emit event
    await uow.events.append({
      event_type: 'SIGNAL_RECEIVED',
      aggregate_type: 'SIGNAL',
      aggregate_id: signal.id,
      event_data: { source_channel: signal.source_channel },
      correlation_id: signal.correlation_id,
      actor: 'system:esi-gmail',
    }, tenantId);

    await uow.commit();
    return signal;

  } catch (error) {
    await uow.rollback();
    throw error;
  }
}
```

---

## 6. Abstraction Boundaries (Enforcement)

### 6.1 PROHIBITED Patterns

**Direct Table Access** (MUST NOT):
```typescript
// ❌ WRONG: Feature code directly querying DB
const runs = await db.select().from(runs_table).where(eq(runs_table.tenant_id, tenantId));
```

**Correct Pattern** (MUST):
```typescript
// ✅ CORRECT: Via repository
const runs = await runRepository.findByTenant(tenantId);
```

---

### 6.2 Enforcement via Code Organization

**Directory Structure**:
```
src/
├── features/                     # NO DB access allowed
│   ├── orchestrator/
│   ├── specialists/
│   └── effects/
├── persistence/                  # Abstraction layer
│   ├── repositories/
│   │   ├── SignalRepository.ts
│   │   ├── RunRepository.ts
│   │   └── EventRepository.ts
│   ├── queries/
│   │   ├── SignalQueryService.ts
│   │   └── TraceQueryService.ts
│   └── UnitOfWork.ts
└── infrastructure/               # Raw DB access
    └── database.ts
```

**Linting Rule** (RECOMMENDED):
```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "../infrastructure/database",
        "message": "Features MUST NOT import database directly. Use repositories."
      }]
    }]
  }
}
```

---

## 7. Validation Tests (Pass Criteria)

### 7.1 Test 1: Tenant Isolation (Repository)

**Setup**:
1. Tenant A creates signal
2. Tenant B tries to read Tenant A's signal

**Expected**:
- Tenant B gets `null` (no cross-tenant access)

**Code Verification**:
```typescript
const signalA = await signalRepository.create({ ...signalData }, tenantA);
const leaked = await signalRepository.findById(signalA.id, tenantB);
assert(leaked === null); // Tenant isolation enforced
```

---

### 7.2 Test 2: Transaction Rollback (Unit of Work)

**Setup**:
1. Begin transaction
2. Create signal
3. Create run
4. Rollback

**Expected**:
- Signal NOT in DB
- Run NOT in DB

**Code Verification**:
```typescript
const uow = new UnitOfWork(db);
await uow.begin();

const signal = await uow.signals.create({ ...signalData }, tenantId);
const run = await uow.runs.create({ signal_id: signal.id, ... }, tenantId);

await uow.rollback();

// Verify rollback
const signalExists = await signalRepository.findById(signal.id, tenantId);
const runExists = await runRepository.findById(run.id, tenantId);

assert(signalExists === null);
assert(runExists === null);
```

---

### 7.3 Test 3: Append-Only Events (No Mutation)

**Setup**:
1. Append event
2. Try to update event

**Expected**:
- Update fails (events immutable)

**Code Verification**:
```typescript
const event = await eventRepository.append({ event_type: 'STEP_COMPLETED', ... }, tenantId);

// Attempt update (should fail)
await expect(
  db.update(orchestration_events).set({ event_data: {...} }).where(eq(orchestration_events.id, event.id))
).rejects.toThrow(); // No UPDATE allowed on events table (DB constraint or ORM restriction)
```

---

### 7.4 Test 4: No Direct DB Access (Static Analysis)

**Setup**:
1. Scan feature code for direct DB imports

**Expected**:
- Zero imports of `infrastructure/database` in `features/` directory

**Code Verification**:
```bash
# Grep for direct DB imports in features
grep -r "from.*infrastructure/database" src/features/
# Expected: No matches
```

---

## 8. Checklist (FIT Pass Criteria)

### Repository Implementation

- [ ] SignalRepository implements ISignalRepository
- [ ] RunRepository implements IRunRepository
- [ ] StepRepository implements IStepRepository
- [ ] EffectRepository implements IEffectRepository
- [ ] EventRepository implements IEventRepository (append-only)
- [ ] All repositories enforce `tenant_id` on queries

### Query Layer

- [ ] SignalQueryService implements read-only queries
- [ ] RunQueryService implements read-only queries
- [ ] TraceQueryService implements correlation/causation queries
- [ ] No query service mutates state

### Unit of Work

- [ ] UnitOfWork implements transaction management
- [ ] begin/commit/rollback methods functional
- [ ] Repositories scoped to transaction when active

### Abstraction Boundaries

- [ ] Feature code NEVER imports `infrastructure/database`
- [ ] All DB access via repositories or query services
- [ ] Linting rule enforces boundary (if applicable)

### Validation Tests

- [ ] Test 1 (Tenant Isolation): PASS
- [ ] Test 2 (Transaction Rollback): PASS
- [ ] Test 3 (Append-Only Events): PASS
- [ ] Test 4 (No Direct DB Access): PASS

---

## 9. References

- CANON-PERSISTENCE-001: Orchestrator Persistence Canon
- CANON-ORCH-STATE-001: Orchestrator Runtime State Canon
- FIT-ORCH-SCHEMA-001: Orchestrator Schema FIT

---

**END OF FIT-PERSISTENCE-ABSTRACTION-001**
