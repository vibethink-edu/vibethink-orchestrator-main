# CANON-EVENTS-001: Events & Outbox Canon

**Status**: CANONICAL
**Type**: ARCHITECTURAL_CORE
**Version**: 1.0.0
**Date**: 2026-01-04
**Authority**: Principal Data Architect & DBA-AI
**Scope**: Event Sourcing, Outbox Pattern, External Integrations
**Related**: CANON-PERSISTENCE-001, CANON-ORCH-STATE-001

---

## 1. Purpose

This canon establishes the **Event Sourcing and Outbox Pattern** for the Orchestrator, defining:

- Event log structure and semantics
- Outbox pattern for reliable external integrations
- Idempotency guarantees
- Event ordering and causality
- Retry and dead-letter handling
- Replay strategies

**Critical Principle**: All state changes MUST be recorded as events. External integrations MUST use transactional outbox to prevent dual-write problems.

---

## 2. Event Sourcing Fundamentals

### 2.1 Event vs State

**Event**: Immutable fact that something happened (past tense).

**State**: Current snapshot derived from event history.

```
Events (Append-Only Log)           State (Current Snapshot)
========================           ========================
RUN_STARTED                   →    run.status = 'RUNNING'
STEP_COMPLETED                →    run.total_steps += 1
STEP_FAILED                   →    run.failed_steps += 1
RUN_COMPLETED                 →    run.status = 'COMPLETED'
```

**Rules** (MUST):
- Events immutable (never UPDATE/DELETE)
- State rebuildable from events (replay)
- Events named in past tense (`STEP_COMPLETED`, not `STEP_COMPLETE`)

---

## 3. Event Log Schema

### 3.1 Orchestration Events Table

```sql
CREATE TABLE orchestration_events (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,

  -- Event Type
  event_type VARCHAR(100) NOT NULL, -- SIGNAL_RECEIVED, RUN_STARTED, STEP_COMPLETED, etc.

  -- Aggregate
  aggregate_type VARCHAR(50) NOT NULL, -- SIGNAL, RUN, STEP, EFFECT
  aggregate_id UUID NOT NULL, -- ID of signal/run/step/effect

  -- Payload
  event_data JSONB NOT NULL, -- Event-specific data

  -- Traceability
  correlation_id UUID NOT NULL, -- Trace correlation
  causation_id UUID, -- Event that caused this event

  -- Actor
  actor VARCHAR(100), -- Agent, user, or system ID

  -- Timestamp
  occurred_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ordering
  sequence_number BIGSERIAL -- Global ordering within tenant
);

CREATE INDEX idx_events_aggregate ON orchestration_events(tenant_id, aggregate_type, aggregate_id, sequence_number);
CREATE INDEX idx_events_correlation ON orchestration_events(tenant_id, correlation_id, sequence_number);
CREATE INDEX idx_events_type ON orchestration_events(tenant_id, event_type, occurred_at DESC);
CREATE INDEX idx_events_sequence ON orchestration_events(tenant_id, sequence_number);
```

### 3.2 Event Type Taxonomy

**Signal Events**:
- `SIGNAL_RECEIVED`: External input ingested
- `SIGNAL_PROCESSING_STARTED`: Orchestrator picked up signal
- `SIGNAL_PROCESSED`: Run completed successfully
- `SIGNAL_PROCESSING_FAILED`: Run failed

**Run Events**:
- `RUN_STARTED`: Orchestration execution began
- `RUN_CHECKPOINT_CREATED`: Snapshot saved
- `RUN_COMPLETED`: All steps succeeded
- `RUN_FAILED`: Critical step failed
- `RUN_CANCELLED`: Human or system cancelled

**Step Events**:
- `STEP_STARTED`: Step execution began
- `STEP_COMPLETED`: Step succeeded
- `STEP_FAILED`: Step encountered error
- `STEP_SKIPPED`: Conditional logic skipped step
- `STEP_RETRIED`: Step retried after failure

**Effect Events**:
- `EFFECT_REQUESTED`: External action requested
- `EFFECT_EXECUTING`: Effect executor picked up
- `EFFECT_COMPLETED`: External action succeeded
- `EFFECT_FAILED`: External action failed
- `EFFECT_RETRYING`: Retry scheduled
- `EFFECT_DEAD_LETTERED`: Max retries exceeded

**Tool Events**:
- `TOOL_CALLED`: LLM tool invoked
- `TOOL_COMPLETED`: Tool returned result
- `TOOL_FAILED`: Tool execution failed

---

### 3.3 Event Data Schema (Per Event Type)

**RUN_STARTED**:
```json
{
  "run_id": "run-uuid",
  "signal_id": "signal-uuid",
  "run_type": "SIGNAL_PROCESSING",
  "orchestrator_version": "v1.2.3"
}
```

**STEP_COMPLETED**:
```json
{
  "step_id": "step-uuid",
  "run_id": "run-uuid",
  "step_index": 5,
  "step_type": "SPECIALIST_CALL",
  "output_result": { /* step output */ },
  "duration_ms": 1523
}
```

**EFFECT_FAILED**:
```json
{
  "effect_id": "effect-uuid",
  "run_id": "run-uuid",
  "effect_type": "SEND_EMAIL",
  "error_code": "SMTP_TIMEOUT",
  "error_message": "Connection timeout after 30s",
  "retry_count": 2,
  "next_retry_at": "2026-01-04T12:05:00Z"
}
```

---

### 3.4 Event Emission (MUST)

**Transactional Consistency**:
```typescript
// ✅ CORRECT: Event + state update in same transaction
async function completeStep(stepId: string, outputResult: any): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. Emit event
    await tx.insert(orchestration_events).values({
      event_type: 'STEP_COMPLETED',
      aggregate_type: 'STEP',
      aggregate_id: stepId,
      event_data: { output_result },
      correlation_id: step.correlation_id,
    });

    // 2. Update state
    await tx.update(steps)
      .set({ status: 'COMPLETED', output_result, completed_at: new Date() })
      .where(eq(steps.id, stepId));
  });
}
```

**Rules** (MUST):
- Event emission and state update MUST be in single transaction
- Event timestamp (`occurred_at`) MUST match state transition time
- `correlation_id` MUST propagate across all events in execution chain

---

## 4. Outbox Pattern

### 4.1 Problem: Dual Write

**Anti-Pattern** (PROHIBITED):
```typescript
// ❌ WRONG: Direct external call + DB write (dual write problem)
async function sendEmail(effectId: string): Promise<void> {
  // External API call (NOT transactional)
  await emailService.send({ to: 'user@example.com', ... });

  // DB write (transactional)
  await db.update(effects).set({ status: 'COMPLETED' }).where(eq(effects.id, effectId));

  // PROBLEM: If DB write fails, email already sent (duplicate on retry)
  // PROBLEM: If process crashes between calls, state inconsistent
}
```

### 4.2 Solution: Transactional Outbox

**Pattern**:
1. Write effect request to outbox table (transactional with orchestration state)
2. Background worker polls outbox
3. Worker executes effect (external call)
4. Worker marks outbox entry as processed (transactional)

**Guarantee**: External integration happens **at-least-once** (may retry, but won't lose).

---

### 4.3 Outbox Schema

```sql
CREATE TABLE outbox_events (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,

  -- Event Type
  event_type VARCHAR(100) NOT NULL, -- SEND_EMAIL, API_CALL, WEBHOOK_CALL, etc.

  -- Payload
  payload JSONB NOT NULL, -- Parameters for external integration

  -- Idempotency
  idempotency_key VARCHAR(255) NOT NULL UNIQUE, -- Prevent duplicate processing

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | PROCESSING | COMPLETED | FAILED | DEAD_LETTER

  -- Retry
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMPTZ,

  -- Result
  result JSONB, -- External API response
  error_details JSONB,

  -- Traceability
  correlation_id UUID NOT NULL,
  aggregate_type VARCHAR(50), -- EFFECT, NOTIFICATION, etc.
  aggregate_id UUID -- FK to effects.id, notifications.id, etc.
);

CREATE INDEX idx_outbox_status ON outbox_events(tenant_id, status, created_at);
CREATE INDEX idx_outbox_retry ON outbox_events(status, next_retry_at) WHERE status = 'FAILED';
CREATE INDEX idx_outbox_idempotency ON outbox_events(idempotency_key);
```

---

### 4.4 Outbox Workflow

**Step 1: Effect Request (Transactional)**:
```typescript
async function requestEffect(effect: Effect): Promise<void> {
  await db.transaction(async (tx) => {
    // Insert effect
    await tx.insert(effects).values(effect);

    // Insert outbox entry
    await tx.insert(outbox_events).values({
      event_type: 'SEND_EMAIL',
      payload: effect.effect_spec,
      idempotency_key: effect.effect_spec.idempotency_key,
      correlation_id: effect.correlation_id,
      aggregate_type: 'EFFECT',
      aggregate_id: effect.id,
    });
  });
}
```

**Step 2: Outbox Worker (Background Process)**:
```typescript
async function processOutbox(): Promise<void> {
  while (true) {
    // Poll pending entries
    const entries = await db.select()
      .from(outbox_events)
      .where(
        and(
          eq(outbox_events.status, 'PENDING'),
          or(
            isNull(outbox_events.next_retry_at),
            lte(outbox_events.next_retry_at, new Date())
          )
        )
      )
      .limit(10)
      .forUpdate()
      .skipLocked(); // Prevent concurrent processing

    for (const entry of entries) {
      await processOutboxEntry(entry);
    }

    await sleep(1000); // Poll interval
  }
}
```

**Step 3: Execute External Integration**:
```typescript
async function processOutboxEntry(entry: OutboxEvent): Promise<void> {
  try {
    // Mark as processing
    await db.update(outbox_events)
      .set({ status: 'PROCESSING' })
      .where(eq(outbox_events.id, entry.id));

    // Execute external integration
    const result = await executeIntegration(entry.event_type, entry.payload);

    // Mark as completed (transactional)
    await db.transaction(async (tx) => {
      await tx.update(outbox_events)
        .set({ status: 'COMPLETED', result, processed_at: new Date() })
        .where(eq(outbox_events.id, entry.id));

      // Update effect status
      await tx.update(effects)
        .set({ status: 'COMPLETED', execution_result: result, executed_at: new Date() })
        .where(eq(effects.id, entry.aggregate_id));
    });

  } catch (error) {
    // Handle retry
    await handleOutboxFailure(entry, error);
  }
}
```

**Step 4: Retry with Exponential Backoff**:
```typescript
async function handleOutboxFailure(entry: OutboxEvent, error: Error): Promise<void> {
  const retryCount = entry.retry_count + 1;

  if (retryCount > entry.max_retries) {
    // Dead letter
    await db.update(outbox_events)
      .set({
        status: 'DEAD_LETTER',
        error_details: { message: error.message, stack: error.stack },
      })
      .where(eq(outbox_events.id, entry.id));

    // Alert ops team
    await notifyDeadLetter(entry);

  } else {
    // Schedule retry with exponential backoff
    const backoffMs = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
    const nextRetryAt = new Date(Date.now() + backoffMs);

    await db.update(outbox_events)
      .set({
        status: 'FAILED',
        retry_count: retryCount,
        next_retry_at: nextRetryAt,
        error_details: { message: error.message },
      })
      .where(eq(outbox_events.id, entry.id));
  }
}
```

---

## 5. Idempotency

### 5.1 Idempotency Key (MUST)

**Definition**: Unique identifier ensuring operation executes exactly once, even if requested multiple times.

**Rules** (MUST):
- All outbox events MUST have `idempotency_key`
- Idempotency key MUST be deterministic (same input → same key)
- Key MUST be globally unique (prevent collisions)

**Key Format** (RECOMMENDED):
```typescript
const idempotencyKey = `${aggregate_type}:${aggregate_id}:${event_type}:${hash(payload)}`;
// Example: "EFFECT:effect-123:SEND_EMAIL:a3f2b1c"
```

---

### 5.2 Idempotency Enforcement

**Outbox Insert** (Duplicate Prevention):
```sql
-- UNIQUE constraint on idempotency_key
INSERT INTO outbox_events (event_type, payload, idempotency_key, ...)
VALUES ($1, $2, $3, ...)
ON CONFLICT (idempotency_key) DO NOTHING;
-- If duplicate, insert silently ignored (safe)
```

**External Integration** (Duplicate Execution Prevention):
```typescript
async function sendEmail(payload: EmailPayload): Promise<void> {
  const idempotencyKey = payload.idempotency_key;

  // Check if already processed
  const existing = await emailService.checkIdempotency(idempotencyKey);
  if (existing) {
    logger.info('Email already sent, skipping', { idempotency_key: idempotencyKey });
    return existing.result; // Return cached result
  }

  // Execute
  const result = await emailService.send(payload);

  // Record idempotency
  await emailService.recordIdempotency(idempotencyKey, result);

  return result;
}
```

---

## 6. Event Ordering & Causality

### 6.1 Correlation ID (MUST)

**Definition**: Unique identifier for entire orchestration execution (signal → run → steps → effects).

**Rules** (MUST):
- Generated when signal received
- Propagated to all events, runs, steps, effects, tool calls
- Used to query full execution trace

**Usage**:
```sql
-- Trace entire execution
SELECT event_type, aggregate_type, aggregate_id, event_data, occurred_at
FROM orchestration_events
WHERE correlation_id = $1
ORDER BY sequence_number ASC;
```

---

### 6.2 Causation ID (MUST)

**Definition**: ID of event that caused current event (causal chain).

**Rules** (MUST):
- Set when one event triggers another
- Forms directed acyclic graph (DAG) of causality

**Example**:
```
SIGNAL_RECEIVED (id: evt-1, causation_id: null)
  ↓
RUN_STARTED (id: evt-2, causation_id: evt-1)
  ↓
STEP_COMPLETED (id: evt-3, causation_id: evt-2)
  ↓
EFFECT_REQUESTED (id: evt-4, causation_id: evt-3)
  ↓
EFFECT_COMPLETED (id: evt-5, causation_id: evt-4)
```

**Query Causality Chain**:
```sql
-- Recursive CTE to traverse causality
WITH RECURSIVE causality AS (
  SELECT id, event_type, causation_id, 0 AS depth
  FROM orchestration_events
  WHERE id = $event_id

  UNION ALL

  SELECT e.id, e.event_type, e.causation_id, c.depth + 1
  FROM orchestration_events e
  JOIN causality c ON e.id = c.causation_id
)
SELECT * FROM causality ORDER BY depth ASC;
```

---

### 6.3 Sequence Number (MUST)

**Definition**: Monotonically increasing integer providing global ordering within tenant.

**Rules** (MUST):
- Generated via `BIGSERIAL` (auto-increment)
- Unique per tenant (partition by `tenant_id`)
- Used for deterministic replay

**Replay Ordering**:
```sql
-- Replay events in exact order
SELECT event_type, event_data
FROM orchestration_events
WHERE tenant_id = $1 AND correlation_id = $2
ORDER BY sequence_number ASC;
```

---

## 7. Retry Strategies

### 7.1 Exponential Backoff (RECOMMENDED)

**Formula**:
```
next_retry_at = NOW() + (2 ^ retry_count) * base_delay
```

**Example**:
- Retry 1: 2 seconds
- Retry 2: 4 seconds
- Retry 3: 8 seconds

**Implementation**:
```typescript
function calculateBackoff(retryCount: number, baseDelayMs: number = 1000): number {
  return Math.pow(2, retryCount) * baseDelayMs;
}
```

---

### 7.2 Max Retries (MUST)

**Default**: 3 retries

**Per Effect Type**:
- `SEND_EMAIL`: 3 retries (SMTP timeouts common)
- `API_CALL`: 5 retries (network failures transient)
- `SOR_UPDATE`: 1 retry (usually programming error, not transient)

**Configuration**:
```typescript
const retryConfig: Record<EffectType, { maxRetries: number; baseDelayMs: number }> = {
  SEND_EMAIL: { maxRetries: 3, baseDelayMs: 2000 },
  API_CALL: { maxRetries: 5, baseDelayMs: 1000 },
  SOR_UPDATE: { maxRetries: 1, baseDelayMs: 5000 },
};
```

---

### 7.3 Dead Letter Queue (MUST)

**Definition**: Failed outbox entries exceeding max retries.

**Handling**:
1. Mark as `DEAD_LETTER` status
2. Alert operations team (Slack, PagerDuty)
3. Manual intervention required (inspect error, fix root cause, requeue)

**Requeue Dead Letter**:
```sql
-- Reset status to retry
UPDATE outbox_events
SET status = 'PENDING',
    retry_count = 0,
    next_retry_at = NULL,
    error_details = NULL
WHERE id = $dead_letter_id;
```

---

## 8. Replay Strategies

### 8.1 Full Replay (Rebuild State from Events)

**Use Case**: Validate current state matches event history (audit).

**Process**:
```typescript
async function replayRun(runId: string): Promise<Run> {
  // Fetch all events
  const events = await db.select()
    .from(orchestration_events)
    .where(eq(orchestration_events.aggregate_id, runId))
    .orderBy(asc(orchestration_events.sequence_number));

  // Reconstruct state
  let run: Run = {} as Run;

  for (const event of events) {
    switch (event.event_type) {
      case 'RUN_STARTED':
        run = {
          id: event.event_data.run_id,
          status: 'RUNNING',
          started_at: event.occurred_at,
          ...
        };
        break;

      case 'STEP_COMPLETED':
        run.total_steps += 1;
        break;

      case 'RUN_COMPLETED':
        run.status = 'COMPLETED';
        run.completed_at = event.occurred_at;
        break;
    }
  }

  return run;
}
```

---

### 8.2 Partial Replay (Resume from Checkpoint)

**Use Case**: Long-running run crashed, resume from last checkpoint.

**Process**:
```typescript
async function resumeRun(runId: string): Promise<void> {
  // Load latest checkpoint
  const checkpoint = await db.select()
    .from(run_checkpoints)
    .where(eq(run_checkpoints.run_id, runId))
    .orderBy(desc(run_checkpoints.checkpoint_index))
    .limit(1);

  // Restore state
  const runState = checkpoint.checkpoint_data;

  // Replay events since checkpoint
  const events = await db.select()
    .from(orchestration_events)
    .where(
      and(
        eq(orchestration_events.aggregate_id, runId),
        gt(orchestration_events.occurred_at, checkpoint.created_at)
      )
    )
    .orderBy(asc(orchestration_events.sequence_number));

  // Apply events to restore state
  for (const event of events) {
    applyEvent(runState, event);
  }

  // Resume execution
  await orchestrator.resume(runState);
}
```

---

## 9. External Integration Patterns

### 9.1 Webhook Integration (Outbound)

**Pattern**: Send webhook to external system when event occurs.

**Outbox Entry**:
```json
{
  "event_type": "WEBHOOK_CALL",
  "payload": {
    "url": "https://customer.com/webhooks/order-updated",
    "method": "POST",
    "headers": { "Authorization": "Bearer token" },
    "body": {
      "order_id": "order-123",
      "status": "SHIPPED"
    },
    "idempotency_key": "run-456-webhook-order-123"
  }
}
```

**Execution**:
```typescript
async function sendWebhook(payload: WebhookPayload): Promise<void> {
  const response = await fetch(payload.url, {
    method: payload.method,
    headers: {
      ...payload.headers,
      'X-Idempotency-Key': payload.idempotency_key,
    },
    body: JSON.stringify(payload.body),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
```

---

### 9.2 Email Integration

**Pattern**: Send email via SMTP or email service API.

**Outbox Entry**:
```json
{
  "event_type": "SEND_EMAIL",
  "payload": {
    "to": ["customer@example.com"],
    "subject": "Order Confirmation",
    "body_html": "<p>Your order has been confirmed.</p>",
    "idempotency_key": "run-456-email-order-123"
  }
}
```

**Execution**:
```typescript
async function sendEmail(payload: EmailPayload): Promise<void> {
  // Check idempotency (email service stores sent message IDs)
  if (await emailService.isAlreadySent(payload.idempotency_key)) {
    return; // Already sent, skip
  }

  await emailService.send({
    to: payload.to,
    subject: payload.subject,
    html: payload.body_html,
    idempotencyKey: payload.idempotency_key,
  });
}
```

---

### 9.3 SoR Update (Memory Plane)

**Pattern**: Propose write to Memory Plane SoR (via Memory Write Policy).

**Outbox Entry**:
```json
{
  "event_type": "SOR_UPDATE",
  "payload": {
    "entity_type": "CASE",
    "entity_id": "case-uuid",
    "change": { "status": "IN_PROGRESS" },
    "evidence_pack": { /* from CANON-MEM-PLANE-001 */ },
    "idempotency_key": "run-456-sor-case-uuid"
  }
}
```

**Execution**:
```typescript
async function updateSoR(payload: SoRUpdatePayload): Promise<void> {
  await memoryService.writeEntity(
    {
      entity_id: payload.entity_id,
      change: payload.change,
      source_id: `orchestrator:${payload.idempotency_key}`,
      source_hash: hashContent(payload.change),
      timestamp: new Date().toISOString(),
      inference: false, // Orchestrator writes are deterministic
    },
    payload.tenant_id,
    payload.evidence_pack
  );
}
```

---

## 10. Anti-Patterns (PROHIBITED)

### 10.1 Dual Write

**MUST NOT**:
```typescript
// ❌ WRONG: External call + DB write (not atomic)
await emailService.send(...);
await db.update(effects).set({ status: 'COMPLETED' });
```

**MUST**:
```typescript
// ✅ CORRECT: Outbox pattern
await db.transaction(async (tx) => {
  await tx.insert(outbox_events).values({ event_type: 'SEND_EMAIL', ... });
  await tx.insert(effects).values({ status: 'PENDING', ... });
});
```

---

### 10.2 Event Mutation

**MUST NOT**:
```sql
-- ❌ WRONG: Updating event
UPDATE orchestration_events SET event_data = $1 WHERE id = $2;
```

**MUST**:
```sql
-- ✅ CORRECT: Insert correction event
INSERT INTO orchestration_events (event_type, aggregate_id, event_data, causation_id, ...)
VALUES ('STEP_CORRECTED', $step_id, $corrected_data, $original_event_id, ...);
```

---

### 10.3 Non-Idempotent Integration

**MUST NOT**:
```typescript
// ❌ WRONG: No idempotency check (duplicate charges possible)
await stripe.charges.create({ amount: 5000, currency: 'usd' });
```

**MUST**:
```typescript
// ✅ CORRECT: Idempotency key
await stripe.charges.create(
  { amount: 5000, currency: 'usd' },
  { idempotencyKey: effect.idempotency_key }
);
```

---

## 11. Architectural Invariants

1. **All state changes are events**: No silent mutations
2. **Events are immutable**: Append-only, never UPDATE/DELETE
3. **Outbox for external integrations**: No dual writes
4. **Idempotency enforced**: All external calls idempotent
5. **Correlation propagates**: Full trace via `correlation_id`
6. **Causality tracked**: `causation_id` forms DAG
7. **Sequence ordering**: `sequence_number` enables deterministic replay
8. **Retry with backoff**: Failed integrations retry exponentially
9. **Dead letter for failures**: Max retries exceeded → manual intervention

---

**END OF CANON-EVENTS-001**
