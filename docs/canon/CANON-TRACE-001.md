# CANON-TRACE-001: Traceability & Audit Canon

**Status**: CANONICAL
**Type**: ARCHITECTURAL_CORE
**Version**: 1.0.0
**Date**: 2026-01-04
**Authority**: Principal Data Architect & DBA-AI
**Scope**: Traceability, Audit Trails, Compliance
**Related**: CANON-PERSISTENCE-001, CANON-EVENTS-001

---

## 1. Purpose

This canon establishes the **Traceability and Audit Framework** for the Orchestrator, defining:

- Correlation and causation tracking
- Actor attribution (who/what made changes)
- Source tracking (where data originated)
- Timestamp guarantees
- Versioning strategies
- PII redaction and retention policies
- Audit log queries and compliance reports

**Critical Principle**: Every state mutation MUST be traceable to an actor, source, and causal event. No "silent changes" permitted.

---

## 2. Traceability Pillars

### 2.1 The Five Traceability Dimensions

| Dimension | Question Answered | Implementation |
|-----------|-------------------|----------------|
| **WHAT** | What changed? | Event type + event data |
| **WHO** | Who/what caused the change? | `actor` field (agent/user/system ID) |
| **WHEN** | When did it happen? | `occurred_at` timestamp (UTC) |
| **WHY** | What triggered this? | `causation_id` (causal event chain) |
| **WHERE** | What context/scope? | `correlation_id` (execution trace) + `tenant_id` |

**Rules** (MUST):
- ALL state mutations include all five dimensions
- NO anonymous changes (actor MUST be identified)
- NO silent changes (event MUST be emitted)

---

## 3. Correlation ID

### 3.1 Definition

**Correlation ID**: Unique identifier grouping all events/entities in a single orchestration execution (signal → run → steps → effects).

### 3.2 Lifecycle

**Generation**:
```typescript
// Generate when signal received
const correlationId = uuidv4();

await db.insert(signals).values({
  id: signalId,
  correlation_id: correlationId,
  ...
});
```

**Propagation** (MUST):
```typescript
// Propagate to run
await db.insert(runs).values({
  id: runId,
  signal_id: signalId,
  correlation_id: correlationId, // Inherited from signal
  ...
});

// Propagate to steps
await db.insert(steps).values({
  id: stepId,
  run_id: runId,
  correlation_id: correlationId, // Inherited from run
  ...
});

// Propagate to events
await db.insert(orchestration_events).values({
  event_type: 'STEP_COMPLETED',
  aggregate_id: stepId,
  correlation_id: correlationId, // Inherited
  ...
});
```

**Schema Enforcement** (MUST):
```sql
-- All tables MUST have correlation_id
CREATE TABLE signals (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  correlation_id UUID NOT NULL, -- REQUIRED
  ...
);

CREATE TABLE runs (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  correlation_id UUID NOT NULL, -- REQUIRED
  ...
);

-- Index for trace queries
CREATE INDEX idx_signals_correlation ON signals(tenant_id, correlation_id);
CREATE INDEX idx_runs_correlation ON runs(tenant_id, correlation_id);
```

---

### 3.3 Trace Query (Full Execution Reconstruction)

**Query Pattern**:
```sql
-- Get entire execution trace
WITH execution_trace AS (
  -- Signals
  SELECT 'SIGNAL' AS entity_type, id AS entity_id, status, received_at AS timestamp
  FROM signals
  WHERE correlation_id = $1

  UNION ALL

  -- Runs
  SELECT 'RUN' AS entity_type, id AS entity_id, status, started_at AS timestamp
  FROM runs
  WHERE correlation_id = $1

  UNION ALL

  -- Steps
  SELECT 'STEP' AS entity_type, id AS entity_id, status, started_at AS timestamp
  FROM steps
  WHERE correlation_id = $1

  UNION ALL

  -- Effects
  SELECT 'EFFECT' AS entity_type, id AS entity_id, status, requested_at AS timestamp
  FROM effects e
  JOIN runs r ON e.run_id = r.id
  WHERE r.correlation_id = $1

  UNION ALL

  -- Events
  SELECT 'EVENT' AS entity_type, id AS entity_id, event_type AS status, occurred_at AS timestamp
  FROM orchestration_events
  WHERE correlation_id = $1
)
SELECT * FROM execution_trace
ORDER BY timestamp ASC;
```

**Output Example**:
```
entity_type | entity_id                          | status          | timestamp
------------|-----------------------------------|-----------------|---------------------
SIGNAL      | sig-123                           | RECEIVED        | 2026-01-04 10:00:00
EVENT       | evt-456                           | SIGNAL_RECEIVED | 2026-01-04 10:00:01
RUN         | run-789                           | RUNNING         | 2026-01-04 10:00:02
EVENT       | evt-460                           | RUN_STARTED     | 2026-01-04 10:00:02
STEP        | step-001                          | COMPLETED       | 2026-01-04 10:00:05
EVENT       | evt-461                           | STEP_COMPLETED  | 2026-01-04 10:00:05
EFFECT      | eff-200                           | PENDING         | 2026-01-04 10:00:06
```

---

## 4. Causation ID

### 4.1 Definition

**Causation ID**: ID of the event that directly caused the current event (forms causal chain).

### 4.2 Causality Graph

**Example Chain**:
```
SIGNAL_RECEIVED (evt-1)
  ↓ causes
RUN_STARTED (evt-2, causation_id = evt-1)
  ↓ causes
STEP_STARTED (evt-3, causation_id = evt-2)
  ↓ causes
TOOL_CALLED (evt-4, causation_id = evt-3)
  ↓ causes
TOOL_COMPLETED (evt-5, causation_id = evt-4)
  ↓ causes
STEP_COMPLETED (evt-6, causation_id = evt-5)
  ↓ causes
EFFECT_REQUESTED (evt-7, causation_id = evt-6)
```

**Schema**:
```sql
CREATE TABLE orchestration_events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  causation_id UUID, -- FK to orchestration_events.id (self-reference)
  correlation_id UUID NOT NULL,
  ...
);

CREATE INDEX idx_events_causation ON orchestration_events(causation_id);
```

---

### 4.3 Causality Query (Why Did This Happen?)

**Recursive CTE** (Traverse Causal Chain):
```sql
WITH RECURSIVE causal_chain AS (
  -- Start from target event
  SELECT id, event_type, causation_id, 0 AS depth
  FROM orchestration_events
  WHERE id = $target_event_id

  UNION ALL

  -- Traverse backwards
  SELECT e.id, e.event_type, e.causation_id, c.depth + 1
  FROM orchestration_events e
  JOIN causal_chain c ON e.id = c.causation_id
)
SELECT id, event_type, depth
FROM causal_chain
ORDER BY depth DESC; -- Root cause first
```

**Output** (Why was `EFFECT_REQUESTED`?):
```
id      | event_type         | depth
--------|-------------------|-----
evt-1   | SIGNAL_RECEIVED   | 6     (Root cause: External signal arrived)
evt-2   | RUN_STARTED       | 5
evt-3   | STEP_STARTED      | 4
evt-4   | TOOL_CALLED       | 3
evt-5   | TOOL_COMPLETED    | 2
evt-6   | STEP_COMPLETED    | 1
evt-7   | EFFECT_REQUESTED  | 0     (Current event)
```

---

## 5. Actor Attribution

### 5.1 Actor Types

```typescript
type Actor =
  | `agent:${string}`      // AI agent (e.g., 'agent:specialist-sales')
  | `user:${string}`       // Human user (e.g., 'user:uuid')
  | `system:${string}`     // System component (e.g., 'system:scheduler')
  | `external:${string}`;  // External system (e.g., 'external:stripe-webhook')
```

**Examples**:
- `agent:orchestrator-v1.2.3`: Orchestrator agent
- `agent:specialist-sales`: Sales specialist
- `user:user-uuid`: Human user action
- `system:scheduler`: Cron job trigger
- `external:gmail-webhook`: Gmail ESI webhook

---

### 5.2 Actor Recording (MUST)

**Schema**:
```sql
CREATE TABLE orchestration_events (
  id UUID PRIMARY KEY,
  actor VARCHAR(100) NOT NULL, -- REQUIRED
  ...
);

CREATE TABLE signals (
  id UUID PRIMARY KEY,
  ingested_by VARCHAR(100), -- Actor who ingested (optional if system)
  ...
);
```

**Event Emission**:
```typescript
await db.insert(orchestration_events).values({
  event_type: 'STEP_COMPLETED',
  aggregate_id: stepId,
  actor: 'agent:orchestrator-v1.2.3', // Who executed this step
  correlation_id,
  causation_id,
  ...
});
```

---

### 5.3 Actor Audit Query

**Who Changed This Entity?**:
```sql
SELECT DISTINCT actor, event_type, occurred_at
FROM orchestration_events
WHERE aggregate_type = 'STEP' AND aggregate_id = $step_id
ORDER BY occurred_at ASC;
```

**Output**:
```
actor                      | event_type      | occurred_at
---------------------------|-----------------|---------------------
agent:orchestrator-v1.2.3  | STEP_STARTED    | 2026-01-04 10:00:03
agent:specialist-sales     | STEP_COMPLETED  | 2026-01-04 10:00:05
user:user-uuid             | STEP_CANCELLED  | 2026-01-04 10:01:00 (Human override)
```

---

## 6. Source Tracking

### 6.1 Source Types

**Source**: Where did the data originate?

```typescript
type Source =
  | `esi:${string}`        // External Signal Interface (e.g., 'esi:gmail')
  | `api:${string}`        // REST/GraphQL API (e.g., 'api:v1/signals')
  | `webhook:${string}`    // Webhook (e.g., 'webhook:stripe')
  | `scheduler:${string}`  // Cron/scheduler (e.g., 'scheduler:daily-sync')
  | `manual:${string}`;    // Human manual action (e.g., 'manual:admin-portal')
```

---

### 6.2 Source Recording (MUST)

**Signals Table**:
```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY,
  source_channel VARCHAR(100) NOT NULL, -- ESI identifier (gmail, slack, api)
  source_id VARCHAR(255) NOT NULL, -- External unique ID (message-id, event-id)
  source_hash VARCHAR(64) NOT NULL, -- SHA-256 of raw payload
  ...
);
```

**Rules** (MUST):
- `source_channel`: Identifies integration point (gmail, slack, stripe-webhook)
- `source_id`: External system's unique ID (for deduplication and traceability)
- `source_hash`: Cryptographic hash of raw payload (detect tampering)

---

### 6.3 Source Provenance Query

**Trace Signal to External Source**:
```sql
SELECT
  s.id AS signal_id,
  s.source_channel,
  s.source_id,
  s.source_hash,
  s.received_at,
  r.id AS run_id,
  r.status AS run_status
FROM signals s
LEFT JOIN runs r ON r.signal_id = s.id
WHERE s.source_channel = 'gmail' AND s.source_id = '<message-id@example.com>';
```

**Output**:
```
signal_id | source_channel | source_id               | source_hash | received_at         | run_id | run_status
----------|----------------|-------------------------|-------------|---------------------|--------|------------
sig-123   | gmail          | <abc@example.com>       | a3f2b1c...  | 2026-01-04 10:00:00 | run-789| COMPLETED
```

---

## 7. Timestamp Guarantees

### 7.1 Timestamp Fields (MUST)

**All Entities MUST Have**:
```sql
CREATE TABLE {entity} (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), -- Entity creation time
  updated_at TIMESTAMPTZ DEFAULT NOW(), -- Last mutation time
  ...
);
```

**Lifecycle-Specific Timestamps**:
```sql
-- Signals
received_at TIMESTAMPTZ NOT NULL, -- When external system sent
ingested_at TIMESTAMPTZ DEFAULT NOW(), -- When orchestrator received
processed_at TIMESTAMPTZ, -- When processing completed

-- Runs
started_at TIMESTAMPTZ DEFAULT NOW(),
completed_at TIMESTAMPTZ,

-- Steps
started_at TIMESTAMPTZ DEFAULT NOW(),
completed_at TIMESTAMPTZ,

-- Effects
requested_at TIMESTAMPTZ DEFAULT NOW(),
executed_at TIMESTAMPTZ,
```

---

### 7.2 Timestamp Rules (MUST)

**Timezone**:
- ALL timestamps MUST be UTC (`TIMESTAMPTZ` type in Postgres)
- Application NEVER uses local time for persistence

**Immutability**:
- `created_at` MUST be immutable (never updated)
- `updated_at` MUST be auto-updated on every mutation (trigger or ORM hook)

**Ordering**:
- Events ordered by `sequence_number` (deterministic), fallback to `occurred_at` (human-readable)

---

### 7.3 Timestamp Trigger (Auto-Update)

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_runs_updated_at
  BEFORE UPDATE ON runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 8. Versioning

### 8.1 Schema Versioning (MUST)

**Orchestrator Version**:
```sql
CREATE TABLE runs (
  id UUID PRIMARY KEY,
  orchestrator_version VARCHAR(50), -- Git SHA or semver (e.g., 'v1.2.3' or 'abc123f')
  ...
);
```

**Purpose**:
- Replay compatibility (replaying old runs requires old orchestrator version)
- Debugging (correlate bugs with code versions)
- Migration tracking (detect which runs executed on old vs new code)

---

### 8.2 Data Versioning (Append-Only)

**Corrections via New Events** (MUST):
```sql
-- ❌ WRONG: Mutating event
UPDATE orchestration_events SET event_data = $corrected_data WHERE id = $event_id;

-- ✅ CORRECT: Append correction event
INSERT INTO orchestration_events (event_type, aggregate_id, event_data, causation_id)
VALUES ('STEP_CORRECTED', $step_id, $corrected_data, $original_event_id);
```

**Entity Versioning** (SHOULD for critical entities):
```sql
CREATE TABLE entity_versions (
  id UUID PRIMARY KEY,
  entity_id UUID NOT NULL, -- FK to entity
  version INTEGER NOT NULL, -- Incremental version (1, 2, 3...)
  entity_data JSONB NOT NULL, -- Snapshot of entity at this version
  changed_by VARCHAR(100), -- Actor
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_id, version)
);
```

---

## 9. PII Redaction & Retention

### 9.1 PII Classification

**PII Fields** (Personally Identifiable Information):
- Email addresses
- Phone numbers
- Names (if required by regulation)
- IP addresses (GDPR context)
- Credit card numbers (PCI-DSS)

**Classification Levels**:
- **Level 1 (Public)**: tenant_id, correlation_id, event_type, timestamps
- **Level 2 (Internal)**: actor, source_channel, run status
- **Level 3 (Sensitive)**: normalized_payload, effect_spec (may contain PII)
- **Level 4 (Restricted)**: Credit card data, health data (encrypt at rest)

---

### 9.2 Redaction Policy

**On Read** (Dynamic Redaction):
```typescript
function redactPII(data: any, userRole: string): any {
  if (userRole === 'ADMIN') return data; // Admins see all

  // Redact email addresses
  if (data.email) data.email = '***@***.***';

  // Redact phone numbers
  if (data.phone) data.phone = '***-***-****';

  return data;
}
```

**On Write** (Pre-Redaction):
```sql
-- Store redacted version in audit trail
INSERT INTO audit_trail (event_type, event_data_redacted, ...)
VALUES ('USER_UPDATED', redact_pii($event_data), ...);
```

---

### 9.3 Retention Policies (Per Data Type)

| Data Type | Retention | Redaction After | Deletion After |
|-----------|-----------|-----------------|----------------|
| **Signals** | 30 days | 90 days (redact PII) | 1 year (archive cold storage) |
| **Runs** | 90 days | 180 days (redact PII) | 2 years |
| **Events** | 2 years | Never (audit compliance) | 7 years (archive) |
| **Audit Trail** | 7 years | Never | 10 years (legal compliance) |
| **Checkpoints** | 7 days | N/A (ephemeral) | 7 days (TTL) |

**Automation** (SHOULD):
```sql
-- Scheduled job: Redact PII in old signals
UPDATE signals
SET normalized_payload = redact_pii(normalized_payload)
WHERE created_at < NOW() - INTERVAL '90 days'
  AND normalized_payload IS NOT NULL;

-- Scheduled job: Archive old events
INSERT INTO events_archive SELECT * FROM orchestration_events WHERE occurred_at < NOW() - INTERVAL '2 years';
DELETE FROM orchestration_events WHERE occurred_at < NOW() - INTERVAL '2 years';
```

---

## 10. Audit Log Queries

### 10.1 Common Audit Queries

**Q1: What happened to entity X?**:
```sql
SELECT event_type, actor, event_data, occurred_at
FROM orchestration_events
WHERE aggregate_type = 'STEP' AND aggregate_id = $step_id
ORDER BY occurred_at ASC;
```

**Q2: Who accessed tenant Y's data?**:
```sql
SELECT DISTINCT actor, event_type, COUNT(*) AS access_count
FROM orchestration_events
WHERE tenant_id = $tenant_id
  AND occurred_at >= NOW() - INTERVAL '7 days'
GROUP BY actor, event_type
ORDER BY access_count DESC;
```

**Q3: Find all failed runs in last 24 hours**:
```sql
SELECT r.id, r.started_at, r.completed_at, r.exit_reason
FROM runs r
WHERE r.status = 'FAILED'
  AND r.started_at >= NOW() - INTERVAL '24 hours'
ORDER BY r.started_at DESC;
```

**Q4: Trace full execution for correlation**:
```sql
SELECT entity_type, entity_id, status, timestamp
FROM (
  SELECT 'SIGNAL' AS entity_type, id AS entity_id, status, received_at AS timestamp FROM signals WHERE correlation_id = $1
  UNION ALL
  SELECT 'RUN', id, status, started_at FROM runs WHERE correlation_id = $1
  UNION ALL
  SELECT 'EVENT', id, event_type, occurred_at FROM orchestration_events WHERE correlation_id = $1
) execution_trace
ORDER BY timestamp ASC;
```

---

### 10.2 Compliance Reports

**GDPR Right to Access** (Export all user data):
```sql
SELECT 'SIGNAL' AS source, id, normalized_payload, created_at
FROM signals
WHERE normalized_payload->>'email' = $user_email

UNION ALL

SELECT 'EVENT' AS source, id, event_data, occurred_at
FROM orchestration_events
WHERE event_data->>'user_email' = $user_email;
```

**GDPR Right to Erasure** (Redact user data):
```sql
-- Redact PII in signals
UPDATE signals
SET normalized_payload = jsonb_set(normalized_payload, '{email}', '"REDACTED"')
WHERE normalized_payload->>'email' = $user_email;

-- Redact PII in events
UPDATE orchestration_events
SET event_data = jsonb_set(event_data, '{user_email}', '"REDACTED"')
WHERE event_data->>'user_email' = $user_email;
```

---

## 11. Audit Trail Schema (Dedicated Table)

### 11.1 Audit Trail vs Event Log

**Difference**:
- **Event Log** (`orchestration_events`): Technical execution events (STEP_COMPLETED, RUN_STARTED)
- **Audit Trail** (`audit_trail`): Business-level actions for compliance (USER_LOGGED_IN, DATA_EXPORTED)

**Audit Trail Table**:
```sql
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,

  -- What
  action VARCHAR(100) NOT NULL, -- USER_LOGGED_IN, DATA_EXPORTED, RUN_CANCELLED, etc.
  resource_type VARCHAR(50), -- SIGNAL, RUN, USER, etc.
  resource_id UUID,

  -- Who
  actor VARCHAR(100) NOT NULL,

  -- When
  occurred_at TIMESTAMPTZ DEFAULT NOW(),

  -- Context
  context JSONB, -- Additional metadata (IP address, user agent, etc.)

  -- Traceability
  correlation_id UUID,

  -- Redaction
  pii_redacted BOOLEAN DEFAULT FALSE,
  redacted_at TIMESTAMPTZ
);

CREATE INDEX idx_audit_tenant_action ON audit_trail(tenant_id, action, occurred_at DESC);
CREATE INDEX idx_audit_actor ON audit_trail(actor, occurred_at DESC);
CREATE INDEX idx_audit_resource ON audit_trail(resource_type, resource_id);
```

---

### 11.2 Audit Trail Examples

**User Login**:
```typescript
await db.insert(audit_trail).values({
  action: 'USER_LOGGED_IN',
  actor: `user:${userId}`,
  context: {
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    login_method: 'password',
  },
  tenant_id,
});
```

**Run Cancelled**:
```typescript
await db.insert(audit_trail).values({
  action: 'RUN_CANCELLED',
  resource_type: 'RUN',
  resource_id: runId,
  actor: `user:${userId}`,
  context: {
    reason: 'User manually cancelled via dashboard',
  },
  correlation_id,
  tenant_id,
});
```

---

## 12. Anti-Patterns (PROHIBITED)

### 12.1 Anonymous Changes

**MUST NOT**:
```sql
-- ❌ WRONG: No actor
INSERT INTO orchestration_events (event_type, aggregate_id, ...)
VALUES ('STEP_COMPLETED', $step_id, ...);
-- Missing actor field
```

**MUST**:
```sql
-- ✅ CORRECT: Actor recorded
INSERT INTO orchestration_events (event_type, aggregate_id, actor, ...)
VALUES ('STEP_COMPLETED', $step_id, 'agent:orchestrator-v1.2.3', ...);
```

---

### 12.2 Silent Mutations

**MUST NOT**:
```sql
-- ❌ WRONG: UPDATE without audit trail
UPDATE runs SET status = 'CANCELLED' WHERE id = $run_id;
```

**MUST**:
```typescript
// ✅ CORRECT: Emit event + update state
await db.transaction(async (tx) => {
  await tx.insert(orchestration_events).values({
    event_type: 'RUN_CANCELLED',
    aggregate_id: runId,
    actor: `user:${userId}`,
    ...
  });

  await tx.update(runs)
    .set({ status: 'CANCELLED', completed_at: new Date() })
    .where(eq(runs.id, runId));
});
```

---

### 12.3 Local Time Usage

**MUST NOT**:
```typescript
// ❌ WRONG: Local time (breaks replay in different timezones)
const now = new Date(); // Local time
```

**MUST**:
```typescript
// ✅ CORRECT: UTC timestamp
const now = new Date(); // JavaScript Date is UTC by default
// Store as TIMESTAMPTZ in Postgres (UTC enforced)
```

---

## 13. Architectural Invariants

1. **Five dimensions always present**: What, Who, When, Why (causation), Where (correlation)
2. **Correlation propagates**: All entities in execution chain share `correlation_id`
3. **Causation forms DAG**: `causation_id` creates directed acyclic graph
4. **Actor always recorded**: No anonymous changes (actor MUST be identified)
5. **Timestamps immutable**: `created_at` never changes, `updated_at` auto-updates
6. **PII redactable**: Sensitive data redacted per retention policy
7. **Audit trail eternal**: Compliance events retained for legal periods (7+ years)
8. **Replay reproducible**: Given events + version, reconstruct exact execution state

---

**END OF CANON-TRACE-001**
