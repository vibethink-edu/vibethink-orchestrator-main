# CANON-ORCH-STATE-001: Orchestrator Runtime State Canon

**Status**: CANONICAL
**Type**: ARCHITECTURAL_CORE
**Version**: 1.0.0
**Date**: 2026-01-04
**Authority**: Principal Data Architect & DBA-AI
**Scope**: Orchestrator Runtime State Model
**Related**: CANON-PERSISTENCE-001

---

## 1. Purpose

This canon defines the **minimal persistible state model** for orchestration execution. It establishes:

- State entities and their lifecycles
- State transitions (state machines)
- Derived vs source state separation
- Reproducibility guarantees (replay)
- Checkpoint/snapshot strategies

**Critical Principle**: Runtime State MUST be **reproducible**. Given Signal + Event Log, reconstruct exact execution state at any point in time.

---

## 2. State Entity Taxonomy

### 2.1 Core State Entities

| Entity | Purpose | Lifecycle | Immutability | Retention |
|--------|---------|-----------|--------------|-----------|
| **Signal** | Normalized external input | Created → Processed/Failed | Immutable after processing | 30 days |
| **Run** | Orchestration execution | Started → Running → Terminal | Mutable until terminal | 90 days |
| **Step** | Reasoning transition | Started → Running → Completed/Failed | Mutable until terminal | 90 days |
| **Effect** | External action request | Requested → Executing → Completed/Failed | Mutable until terminal | 90 days |
| **ToolCall** | LLM tool invocation | Called → Completed/Failed | Immutable after completion | 30 days |
| **Checkpoint** | Resumable snapshot | Created → Expired | Immutable | 7 days (TTL) |

---

## 3. Signal (External Input)

### 3.1 Definition

**Signal**: Normalized, validated external input ready for orchestration processing. Signals are the **entry point** to the orchestrator.

### 3.2 Signal Types (Enum)

```typescript
enum SignalType {
  EMAIL = 'EMAIL',                 // Email received via ESI
  WEBHOOK = 'WEBHOOK',             // HTTP webhook from external system
  CHAT_MESSAGE = 'CHAT_MESSAGE',   // Slack, Teams, WhatsApp message
  API_CALL = 'API_CALL',           // REST/GraphQL API request
  SCHEDULED_TASK = 'SCHEDULED_TASK', // Cron/scheduled trigger
  HUMAN_COMMAND = 'HUMAN_COMMAND'  // Direct user action
}
```

### 3.3 Signal State Machine

```
PENDING → PROCESSING → PROCESSED
                    ↘ FAILED
```

**Transitions** (MUST):
- `PENDING → PROCESSING`: Orchestrator picks up signal for execution
- `PROCESSING → PROCESSED`: Run completed successfully
- `PROCESSING → FAILED`: Run failed (terminal state)

**Rules** (MUST):
- Once `PROCESSED` or `FAILED`, signal immutable (no re-processing)
- `processed_at` timestamp set on terminal transition

### 3.4 Signal Schema (Canonical)

```sql
CREATE TABLE signals (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,

  -- Type & Source
  signal_type VARCHAR(50) NOT NULL, -- SignalType enum
  source_channel VARCHAR(100) NOT NULL, -- ESI identifier (gmail, slack, api)
  source_id VARCHAR(255) NOT NULL, -- External unique ID
  source_hash VARCHAR(64) NOT NULL, -- SHA-256 of raw payload

  -- Normalized Payload
  normalized_payload JSONB NOT NULL,

  -- Timestamps
  received_at TIMESTAMPTZ NOT NULL, -- When external system sent signal
  ingested_at TIMESTAMPTZ DEFAULT NOW(), -- When orchestrator received signal
  processed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | PROCESSING | PROCESSED | FAILED

  -- Traceability
  correlation_id UUID NOT NULL,
  ingested_by VARCHAR(100), -- Agent/service ID

  -- Idempotency
  UNIQUE(tenant_id, source_channel, source_id)
);

CREATE INDEX idx_signals_tenant_status ON signals(tenant_id, status, received_at DESC);
CREATE INDEX idx_signals_correlation ON signals(correlation_id);
```

### 3.5 Normalized Payload Schema (Per Signal Type)

**EMAIL**:
```json
{
  "from": "user@example.com",
  "to": ["recipient@company.com"],
  "subject": "Order #12345 Inquiry",
  "body": "Plain text or HTML sanitized",
  "attachments": [
    { "name": "invoice.pdf", "blob_id": "blob-uuid", "size_bytes": 45123 }
  ],
  "headers": {
    "message_id": "<abc@example.com>",
    "in_reply_to": "<def@example.com>"
  }
}
```

**WEBHOOK**:
```json
{
  "webhook_id": "stripe_evt_abc123",
  "event_type": "payment.succeeded",
  "payload": { /* vendor-specific payload */ },
  "signature_valid": true
}
```

**CHAT_MESSAGE**:
```json
{
  "channel_id": "slack-C12345",
  "user_id": "slack-U67890",
  "text": "Please update Case #123 status",
  "thread_ts": "1234567890.123456",
  "mentions": ["@bot"]
}
```

**Rules** (MUST):
- Schema validation enforced pre-insert
- PII redacted per tenant policy (email addresses, phone numbers)
- Large attachments stored in blob storage (reference via `blob_id`)

---

## 4. Run (Orchestration Execution)

### 4.1 Definition

**Run**: Single orchestration execution triggered by a Signal. Consists of sequential or parallel Steps executed by Reasoning Layer.

### 4.2 Run Types (Enum)

```typescript
enum RunType {
  SIGNAL_PROCESSING = 'SIGNAL_PROCESSING',   // Triggered by incoming signal
  SCHEDULED_TASK = 'SCHEDULED_TASK',         // Triggered by cron/scheduler
  HUMAN_TRIGGERED = 'HUMAN_TRIGGERED',       // Manually started by user
  CONTINUATION = 'CONTINUATION'              // Continuation of paused run
}
```

### 4.3 Run State Machine

```
RUNNING → COMPLETED
       ↘ FAILED
       ↘ CANCELLED (human intervention)
```

**Transitions** (MUST):
- `RUNNING → COMPLETED`: All steps succeeded, no pending effects
- `RUNNING → FAILED`: At least one critical step failed, run aborted
- `RUNNING → CANCELLED`: Human or system cancelled execution

**Rules** (MUST):
- `completed_at` timestamp set on terminal transition
- `exit_reason` MUST be set for `FAILED` or `CANCELLED` states
- `total_steps` and `failed_steps` counters updated atomically

### 4.4 Run Schema (Canonical)

```sql
CREATE TABLE runs (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,

  -- Trigger
  signal_id UUID NOT NULL REFERENCES signals(id),
  run_type VARCHAR(50) NOT NULL, -- RunType enum

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'RUNNING', -- RUNNING | COMPLETED | FAILED | CANCELLED
  exit_reason VARCHAR(100), -- Human-readable summary or error code

  -- Traceability
  correlation_id UUID NOT NULL,
  causation_id UUID, -- Parent run_id if chained

  -- Versioning
  orchestrator_version VARCHAR(50), -- Git SHA or semver

  -- Metrics
  total_steps INTEGER DEFAULT 0,
  failed_steps INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB -- Custom fields (priority, tags, etc.)
);

CREATE INDEX idx_runs_tenant_status ON runs(tenant_id, status, started_at DESC);
CREATE INDEX idx_runs_signal ON runs(signal_id);
CREATE INDEX idx_runs_correlation ON runs(correlation_id);
```

### 4.5 Run Metrics (Derived State)

**MUST** compute atomically on step completion:
```sql
-- Update run metrics when step completes
UPDATE runs
SET total_steps = total_steps + 1,
    failed_steps = failed_steps + CASE WHEN $step_status = 'FAILED' THEN 1 ELSE 0 END
WHERE id = $run_id;
```

**SHOULD** materialize in projection for dashboard:
```sql
CREATE MATERIALIZED VIEW run_summary AS
SELECT
  r.id,
  r.tenant_id,
  r.status,
  r.started_at,
  r.completed_at,
  EXTRACT(EPOCH FROM (COALESCE(r.completed_at, NOW()) - r.started_at)) AS duration_seconds,
  r.total_steps,
  r.failed_steps,
  (r.total_steps - r.failed_steps)::FLOAT / NULLIF(r.total_steps, 0) AS success_rate
FROM runs r;
```

---

## 5. Step (Reasoning Transition)

### 5.1 Definition

**Step**: Atomic unit of reasoning within a Run. Represents a decision point, specialist invocation, or tool call sequence.

### 5.2 Step Types (Enum)

```typescript
enum StepType {
  DECISION = 'DECISION',               // Branching logic (if/then/else)
  SPECIALIST_CALL = 'SPECIALIST_CALL', // Invoke domain specialist
  TOOL_SEQUENCE = 'TOOL_SEQUENCE',     // Execute LLM tools
  EFFECT_REQUEST = 'EFFECT_REQUEST',   // Request external action
  CHECKPOINT = 'CHECKPOINT',           // Save resumable snapshot
  WAIT = 'WAIT'                        // Pause for external event/approval
}
```

### 5.3 Step State Machine

```
RUNNING → COMPLETED
       ↘ FAILED
       ↘ SKIPPED (conditional logic)
```

**Transitions** (MUST):
- `RUNNING → COMPLETED`: Step logic executed successfully
- `RUNNING → FAILED`: Step encountered unrecoverable error
- `RUNNING → SKIPPED`: Conditional logic determined step unnecessary

**Rules** (MUST):
- Steps within run ordered by `step_index` (0-based, sequential)
- `step_index` MUST have no gaps (sequential assignment)
- Failed steps MAY be retried (new step with incremented `retry_count`)

### 5.4 Step Schema (Canonical)

```sql
CREATE TABLE steps (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,

  -- Ordering
  step_index INTEGER NOT NULL, -- 0-based sequential position

  -- Type
  step_type VARCHAR(50) NOT NULL, -- StepType enum

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'RUNNING', -- RUNNING | COMPLETED | FAILED | SKIPPED

  -- Input/Output
  input_context JSONB, -- Input to this step (prior step output, signal data)
  output_result JSONB, -- Step output (decision, tool results, effect spec)

  -- Specialist (if step_type = SPECIALIST_CALL)
  specialist_id VARCHAR(100),

  -- Error Handling
  error_details JSONB, -- If status = FAILED
  retry_count INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB,

  UNIQUE(run_id, step_index)
);

CREATE INDEX idx_steps_run ON steps(run_id, step_index);
CREATE INDEX idx_steps_status ON steps(tenant_id, status, started_at DESC);
```

### 5.5 Input Context & Output Result (MUST)

**Input Context** (what step receives):
```json
{
  "signal_data": { /* normalized_payload from signal */ },
  "prior_step_output": { /* output_result from step N-1 */ },
  "sor_entities": [
    { "entity_id": "case-uuid", "entity_type": "CASE" }
  ],
  "specialist_context": { /* domain-specific state */ }
}
```

**Output Result** (what step produces):
```json
{
  "decision": "APPROVE", // If step_type = DECISION
  "specialist_reasoning": "...", // If step_type = SPECIALIST_CALL
  "tool_results": [ /* tool call outputs */ ], // If step_type = TOOL_SEQUENCE
  "effect_spec": { /* effect parameters */ }, // If step_type = EFFECT_REQUEST
  "next_step_hint": "step_7" // Optional navigation
}
```

**Rules** (MUST):
- `input_context` + `output_result` MUST be sufficient to reproduce step execution
- Large payloads (>100KB) stored in blob storage, reference via `blob_id`
- PII redacted per tenant policy

---

## 6. Effect (External Action)

### 6.1 Definition

**Effect**: External action requested by orchestration (send email, call API, update SoR entity). Effects are **deferred** (async execution via outbox).

### 6.2 Effect Types (Enum)

```typescript
enum EffectType {
  SEND_EMAIL = 'SEND_EMAIL',
  SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',
  API_CALL = 'API_CALL',
  SOR_UPDATE = 'SOR_UPDATE',         // Write to Memory Plane SoR
  NOTIFY_USER = 'NOTIFY_USER',
  SCHEDULE_TASK = 'SCHEDULE_TASK',
  WEBHOOK_CALL = 'WEBHOOK_CALL'
}
```

### 6.3 Effect State Machine

```
PENDING → EXECUTING → COMPLETED
                   ↘ FAILED (retry if retry_count < max_retries)
                            ↘ DEAD_LETTER (max retries exceeded)
```

**Transitions** (MUST):
- `PENDING → EXECUTING`: Effect executor picks up for execution
- `EXECUTING → COMPLETED`: External action succeeded
- `EXECUTING → FAILED`: External action failed, eligible for retry
- `FAILED → DEAD_LETTER`: Max retries exceeded, manual intervention required

**Rules** (MUST):
- Effects MUST be idempotent (re-execution safe)
- `effect_spec` MUST include `idempotency_key` (prevents duplicate execution)
- Effect executors MUST check status before execution (avoid race conditions)

### 6.4 Effect Schema (Canonical)

```sql
CREATE TABLE effects (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,

  -- Type
  effect_type VARCHAR(50) NOT NULL, -- EffectType enum

  -- Specification
  effect_spec JSONB NOT NULL, -- Parameters for effect execution

  -- Timestamps
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | EXECUTING | COMPLETED | FAILED | DEAD_LETTER

  -- Result
  execution_result JSONB, -- Result from effect executor

  -- Retry
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMPTZ, -- Exponential backoff

  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_effects_status ON effects(tenant_id, status, requested_at);
CREATE INDEX idx_effects_run ON effects(run_id);
CREATE INDEX idx_effects_retry ON effects(status, next_retry_at) WHERE status = 'FAILED';
```

### 6.5 Effect Spec Schema (Per Effect Type)

**SEND_EMAIL**:
```json
{
  "idempotency_key": "run-123-step-5-email-customer",
  "to": ["customer@example.com"],
  "subject": "Order Confirmation",
  "body_html": "<p>Your order has been confirmed.</p>",
  "reply_to": "support@company.com"
}
```

**API_CALL**:
```json
{
  "idempotency_key": "run-123-step-7-api-stripe",
  "method": "POST",
  "url": "https://api.stripe.com/v1/charges",
  "headers": { "Authorization": "Bearer sk_..." },
  "body": { "amount": 5000, "currency": "usd" }
}
```

**SOR_UPDATE**:
```json
{
  "idempotency_key": "run-123-step-3-update-case",
  "entity_type": "CASE",
  "entity_id": "case-uuid",
  "change": { "status": "IN_PROGRESS" },
  "evidence_pack": { /* from CANON-MEM-PLANE-001 */ }
}
```

**Rules** (MUST):
- `idempotency_key` UNIQUE per effect (prevent duplicate execution)
- Sensitive data (API keys) encrypted at rest
- Effect executor MUST validate `idempotency_key` before execution (check if already executed)

---

## 7. ToolCall & ToolResult

### 7.1 Definition

**ToolCall**: LLM tool invocation during Step execution. Represents function call from LLM to external tool (API, calculation, database query).

### 7.2 Tool Call State Machine

```
PENDING → COMPLETED
       ↘ FAILED
```

**Transitions** (MUST):
- `PENDING → COMPLETED`: Tool executed successfully
- `PENDING → FAILED`: Tool execution failed (error returned)

**Rules** (MUST):
- Tool calls within step executed sequentially (deterministic replay)
- Failed tool calls MAY be retried (orchestrator decision)
- Tool results cached in Working Memory (CANON-MEM-PLANE-001) with TTL

### 7.3 ToolCall Schema (Canonical)

```sql
CREATE TABLE tool_calls (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,

  -- Tool
  tool_name VARCHAR(100) NOT NULL, -- Function name (e.g., 'calculate_roi', 'fetch_weather')
  tool_args JSONB NOT NULL, -- Function arguments

  -- Timestamps
  called_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | COMPLETED | FAILED

  -- Result
  result JSONB, -- Tool execution result
  error_details JSONB,

  -- Performance
  execution_duration_ms INTEGER,

  -- Cache
  cache_hit BOOLEAN DEFAULT FALSE, -- If result from cache

  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_tool_calls_step ON tool_calls(step_id, called_at);
CREATE INDEX idx_tool_calls_perf ON tool_calls(tool_name, execution_duration_ms);
```

### 7.4 Tool Result Caching (SHOULD)

**Cache Key**:
```typescript
const cacheKey = `tool:${tool_name}:${hash(tool_args)}`;
```

**Cache Strategy**:
- Store in Working Memory (Redis) with TTL (5-60 minutes)
- Check cache before executing tool
- Record `cache_hit: true` in `tool_calls` table (metrics)

**Invalidation**:
- TTL expiry (automatic)
- Manual invalidation on SoR entity update (if tool queries SoR)

---

## 8. Checkpoint & Snapshot

### 8.1 Definition

**Checkpoint**: Resumable state snapshot for long-running Runs. Enables crash recovery and pause/resume workflows.

### 8.2 Checkpoint Strategy

**When to Checkpoint** (SHOULD):
- Every N steps (configurable, default: 10)
- Before expensive operations (API calls, large data processing)
- Before human approval wait states
- On run pause (manual or automatic)

**What to Checkpoint** (MUST):
```json
{
  "run_id": "run-uuid",
  "checkpoint_index": 3,
  "completed_steps": ["step-0-id", "step-1-id", "step-2-id"],
  "current_step_id": "step-3-id",
  "current_step_state": { /* partial step state */ },
  "pending_effects": ["effect-1-id", "effect-2-id"],
  "specialist_state": { /* specialist-specific state */ },
  "variables": { /* orchestrator variables */ }
}
```

### 8.3 Checkpoint Schema (Canonical)

```sql
CREATE TABLE run_checkpoints (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,

  -- Ordering
  checkpoint_index INTEGER NOT NULL, -- 0-based sequential

  -- Snapshot
  checkpoint_data JSONB NOT NULL, -- Serialized run state

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',

  -- Size
  size_bytes INTEGER, -- Compressed size
  compressed BOOLEAN DEFAULT TRUE, -- gzip applied

  UNIQUE(run_id, checkpoint_index)
);

CREATE INDEX idx_checkpoints_run ON run_checkpoints(run_id, checkpoint_index DESC);
CREATE INDEX idx_checkpoints_expiry ON run_checkpoints(expires_at);
```

### 8.4 Checkpoint Lifecycle

**Creation** (MUST):
1. Serialize run state to JSON
2. Compress with gzip (reduce storage)
3. Insert into `run_checkpoints`
4. Set `expires_at` (7-day TTL default)

**Resumption** (MUST):
1. Query latest checkpoint: `SELECT * FROM run_checkpoints WHERE run_id = $1 ORDER BY checkpoint_index DESC LIMIT 1`
2. Decompress `checkpoint_data`
3. Restore run state (variables, specialist state)
4. Resume from `current_step_id`

**Cleanup** (MUST):
- Automated TTL-based deletion: `DELETE FROM run_checkpoints WHERE expires_at < NOW()`
- On run completion, delete all checkpoints: `DELETE FROM run_checkpoints WHERE run_id = $1`

---

## 9. State Transitions & State Machines

### 9.1 Enforcement (MUST)

**Application-Level**:
```typescript
class RunStateMachine {
  private validTransitions: Record<RunStatus, RunStatus[]> = {
    RUNNING: ['COMPLETED', 'FAILED', 'CANCELLED'],
    COMPLETED: [], // Terminal
    FAILED: [], // Terminal
    CANCELLED: [], // Terminal
  };

  transition(run: Run, newStatus: RunStatus): void {
    if (!this.validTransitions[run.status].includes(newStatus)) {
      throw new InvalidStateTransitionError(
        `Cannot transition from ${run.status} to ${newStatus}`
      );
    }
    run.status = newStatus;
    run.completed_at = new Date();
  }
}
```

**Database-Level** (SHOULD):
```sql
-- Trigger to enforce state machine
CREATE FUNCTION validate_run_status_transition() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'COMPLETED' OR OLD.status = 'FAILED' OR OLD.status = 'CANCELLED' THEN
    RAISE EXCEPTION 'Cannot transition from terminal state %', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_run_status_transition
  BEFORE UPDATE ON runs
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_run_status_transition();
```

---

## 10. Derived State vs Source State

### 10.1 Source State (Immutable Truth)

**Definition**: State directly written by orchestrator (cannot be recomputed).

**Examples**:
- `signal.normalized_payload` (ingestion output)
- `step.output_result` (reasoning output)
- `tool_calls.result` (tool execution output)
- `effects.execution_result` (effect executor output)

**Rules** (MUST):
- Immutable after terminal state
- Append-only (historical records preserved)
- Versioned (if mutations required, create new version)

### 10.2 Derived State (Recomputable)

**Definition**: State computed from source state (can be rebuilt).

**Examples**:
- `runs.total_steps` (COUNT of steps)
- `runs.failed_steps` (COUNT of steps WHERE status = 'FAILED')
- `run_summary` view (aggregations)
- Projections (dashboard stats, timelines)

**Rules** (MUST):
- Rebuildable from source state (loss is non-critical)
- Recomputed on demand or via materialized views
- Cache with TTL (invalidate on source change)

**Computation** (SHOULD be idempotent):
```sql
-- Recompute run metrics
UPDATE runs r
SET total_steps = (SELECT COUNT(*) FROM steps WHERE run_id = r.id),
    failed_steps = (SELECT COUNT(*) FROM steps WHERE run_id = r.id AND status = 'FAILED')
WHERE r.id = $run_id;
```

---

## 11. Reproducibility (Replay)

### 11.1 Guarantee (MUST)

Given:
- Signal ID
- Event Log (CANON-EVENTS-001)
- Orchestrator version

Reconstruct:
- Full Run execution history
- All Step inputs/outputs
- All ToolCall results
- All Effect requests

### 11.2 Replay Process

**Step 1: Load Signal**
```sql
SELECT * FROM signals WHERE id = $signal_id;
```

**Step 2: Replay Events**
```sql
SELECT event_type, event_data, occurred_at
FROM orchestration_events
WHERE correlation_id = $correlation_id
ORDER BY sequence_number ASC;
```

**Step 3: Reconstruct State**
```typescript
for (const event of events) {
  switch (event.event_type) {
    case 'RUN_STARTED':
      run = createRun(event.event_data);
      break;
    case 'STEP_COMPLETED':
      step = createStep(event.event_data);
      steps.push(step);
      break;
    case 'EFFECT_EXECUTED':
      effect = createEffect(event.event_data);
      effects.push(effect);
      break;
  }
}
```

**Step 4: Validate**
```typescript
// Current state in DB
const dbRun = await runRepository.findById(run.id);

// Replayed state
const replayedRun = reconstructedRun;

// Assert match
assert.deepEqual(dbRun, replayedRun);
```

---

## 12. Anti-Patterns (PROHIBITED)

### 12.1 Silent State Mutation

**MUST NOT**:
```sql
-- ❌ WRONG: UPDATE without event
UPDATE runs SET status = 'FAILED' WHERE id = $1;
```

**MUST**:
```typescript
// ✅ CORRECT: Emit event + update
await eventBus.emit({
  event_type: 'RUN_FAILED',
  aggregate_id: runId,
  event_data: { error: 'Step 5 timeout' }
});
await runRepository.updateStatus(runId, 'FAILED');
```

---

### 12.2 Duplicate Source State

**MUST NOT**:
```sql
-- ❌ WRONG: Storing SoR data in run
CREATE TABLE runs (
  id UUID,
  case_name VARCHAR(255), -- Duplicate from entities.name
  customer_email VARCHAR(255) -- Duplicate from Person.email
);
```

**MUST**:
```sql
-- ✅ CORRECT: Reference via FK
CREATE TABLE runs (
  id UUID,
  case_id UUID REFERENCES entities(id)
  -- Query entities.name when needed
);
```

---

### 12.3 Non-Deterministic Replay

**MUST NOT**:
```typescript
// ❌ WRONG: Using wall clock in logic
const now = new Date(); // Different on replay
if (now > deadline) { /* timeout */ }
```

**MUST**:
```typescript
// ✅ CORRECT: Use event timestamp
const now = event.occurred_at; // Same on replay
if (now > deadline) { /* timeout */ }
```

---

## 13. Architectural Invariants

1. **Reproducibility**: Given Signal + Events, reconstruct exact Run state
2. **Append-only source state**: Historical records never deleted/mutated
3. **Derived state rebuildable**: Loss of derived state non-critical
4. **State transitions enforced**: Invalid transitions rejected (state machine)
5. **Checkpoints enable resume**: Long-running runs recoverable from failure
6. **Effects idempotent**: Re-execution safe (idempotency_key enforced)
7. **Tool calls deterministic**: Same input → same output (caching valid)
8. **Multi-tenant isolation**: `tenant_id` in all state tables

---

**END OF CANON-ORCH-STATE-001**
