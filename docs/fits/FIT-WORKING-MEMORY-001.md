# FIT-WORKING-MEMORY-001: Working Memory Specification

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-MEM-PLANE-001
**Related WITs**: WIT-003, WIT-005

---

## 1. Purpose

This FIT validates that **Working Memory** (ephemeral run-time state for reasoning agents) is correctly implemented with:
- TTL-based automatic retention/eviction
- Size limits to prevent memory bloat
- Graceful degradation (agent recovers if Working Memory lost)
- Clear separation from Canonical Memory (SoR)
- Multi-tenant isolation

**Pass Criteria**: Working Memory lifecycle (write → read → TTL expiry → cleanup) executes correctly without leaking across tenants or polluting Canonical Memory.

---

## 2. Working Memory Architecture

```
┌───────────────────────────────────────────────────────────┐
│  LAYER 2: REASONING (Specialists + Orchestration)         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Specialist Agent (e.g., SalesSpecialist)            │  │
│  │ - Reads Canonical Memory (immutable)                │  │
│  │ - Writes to Working Memory (ephemeral state)        │  │
│  │ - Checkpoints progress (resume after failure)       │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
                         ↕ read/write
┌───────────────────────────────────────────────────────────┐
│  WORKING MEMORY (Ephemeral, Run-Scoped)                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ CATEGORY 1: Agent Checkpoints                       │  │
│  │ - Intermediate reasoning state                      │  │
│  │ - TTL: 24 hours (allow resume after crash)          │  │
│  │ - Size: Max 1 MB per checkpoint                     │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ CATEGORY 2: Tool Cache                              │  │
│  │ - LLM tool call results (API responses, calcs)      │  │
│  │ - TTL: 5-60 minutes (avoid redundant API calls)     │  │
│  │ - Size: Max 100 KB per cached result                │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ CATEGORY 3: Draft Proposals                         │  │
│  │ - Specialist proposes Memory write (not committed)  │  │
│  │ - TTL: 7 days (user approves/rejects)               │  │
│  │ - Size: Max 500 KB per draft                        │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ CATEGORY 4: Session Context (UX)                    │  │
│  │ - Conversational UI state (chat history, filters)   │  │
│  │ - TTL: 30 minutes (session timeout)                 │  │
│  │ - Size: Max 200 KB per session                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  Storage: Redis (preferred) OR PostgreSQL working_mem.*   │
│  Eviction: TTL-based (automatic) + size-based (LRU)       │
│  Isolation: Namespace per tenant (company_id)             │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Working Memory Categories

### 3.1 CATEGORY 1: Agent Checkpoints

**Purpose**: Save intermediate reasoning state to allow resumption after failure.

**Use Case**:
```typescript
// SalesSpecialist analyzing 500 emails
async function analyzeEmails(emailIds: string[], runId: string) {
  for (let i = 0; i < emailIds.length; i++) {
    const email = await fetchEmail(emailIds[i]);
    const analysis = await llm.analyze(email);

    // Checkpoint every 10 emails
    if (i % 10 === 0) {
      await workingMemory.saveCheckpoint(runId, {
        step: i,
        processed: emailIds.slice(0, i),
        findings: accumulatedFindings,
        confidence: currentConfidence,
      });
    }

    // If crash occurs, resume from last checkpoint
  }
}

// Resume after crash
async function resumeAnalysis(runId: string) {
  const checkpoint = await workingMemory.getCheckpoint(runId);
  if (checkpoint) {
    // Continue from checkpoint.step
    return analyzeEmails(remainingIds, runId);
  }
  // No checkpoint → start from beginning
}
```

**Schema** (if PostgreSQL):
```sql
CREATE TABLE working_memory.agent_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL, -- Tenant isolation
  agent_run_id VARCHAR(255) NOT NULL, -- Unique per agent execution
  step_index INTEGER NOT NULL,
  checkpoint_data JSONB NOT NULL, -- Serialized state
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  size_bytes INTEGER NOT NULL, -- Track size
  CONSTRAINT max_checkpoint_size CHECK (size_bytes <= 1048576) -- 1 MB limit
);

CREATE INDEX idx_checkpoint_expiry ON working_memory.agent_checkpoints (expires_at);
CREATE INDEX idx_checkpoint_tenant ON working_memory.agent_checkpoints (company_id, agent_run_id);
```

**Redis Alternative**:
```typescript
const checkpointKey = `wm:${company_id}:checkpoint:${agent_run_id}:${step_index}`;
await redis.setex(checkpointKey, 86400, JSON.stringify(checkpointData)); // 24h TTL
```

**TTL**: 24 hours (allow overnight crash recovery)

**Size Limit**: 1 MB per checkpoint (prevents bloat)

**Cleanup**: Automatic eviction via TTL expiry

---

### 3.2 CATEGORY 2: Tool Cache

**Purpose**: Cache expensive LLM tool call results (API calls, calculations) to avoid redundant execution.

**Use Case**:
```typescript
// LLM tool: Calculate ROI for a case
async function calculateROI(caseId: string, company_id: string): Promise<number> {
  const cacheKey = `wm:${company_id}:tool_cache:calculateROI:${caseId}`;

  // Check cache
  const cached = await workingMemory.getToolCache(cacheKey);
  if (cached && Date.now() < cached.expires_at) {
    logger.info('Tool cache hit', { tool: 'calculateROI', case_id: caseId });
    return cached.result;
  }

  // Cache miss → compute
  const roi = await expensiveCalculation(caseId);

  // Store in cache (5 min TTL)
  await workingMemory.setToolCache(cacheKey, roi, 300); // 5 min
  return roi;
}
```

**Schema** (PostgreSQL):
```sql
CREATE TABLE working_memory.tool_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  cache_key VARCHAR(255) NOT NULL UNIQUE, -- Deterministic key (tool name + args)
  result JSONB NOT NULL, -- Cached result
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  size_bytes INTEGER NOT NULL,
  CONSTRAINT max_tool_cache_size CHECK (size_bytes <= 102400) -- 100 KB limit
);

CREATE INDEX idx_tool_cache_expiry ON working_memory.tool_cache (expires_at);
```

**Redis Alternative**:
```typescript
const cacheKey = `wm:${company_id}:tool_cache:${toolName}:${argsHash}`;
await redis.setex(cacheKey, ttlSeconds, JSON.stringify(result));
```

**TTL**: 5-60 minutes (depends on tool volatility)

**Size Limit**: 100 KB per cached result

**Cleanup**: Automatic eviction via TTL

---

### 3.3 CATEGORY 3: Draft Proposals

**Purpose**: Specialist proposes a write to Canonical Memory (requires user approval if `inference: true`).

**Use Case**:
```typescript
// SalesSpecialist proposes marking Case as "AT_RISK"
async function proposeCaseStatusUpdate(caseId: string, newStatus: string, reasoning: string) {
  const draftId = generateDraftId();

  await workingMemory.saveDraft(draftId, {
    entity_type: 'CASE',
    entity_id: caseId,
    proposed_change: { status: newStatus },
    reasoning,
    evidence_pack: buildEvidencePack(),
    inference: true, // LLM-derived (requires approval)
    created_at: new Date().toISOString(),
    expires_at: addDays(new Date(), 7), // 7-day approval window
  });

  // Notify user via UX Layer
  await notifyUser({
    type: 'DRAFT_PROPOSAL',
    draft_id: draftId,
    summary: `Specialist suggests marking Case ${caseId} as ${newStatus}`,
  });
}

// User approves → write to SoR
async function approveDraft(draftId: string, userId: string) {
  const draft = await workingMemory.getDraft(draftId);

  // Validate user has permission
  await policyLayer.checkAccess(userId, draft.entity_id, 'EDIT');

  // Write to Canonical Memory (SoR)
  await memoryService.updateEntity(draft.entity_id, draft.proposed_change, {
    approved_by: userId,
    reasoning: draft.reasoning,
    evidence_pack: draft.evidence_pack,
  });

  // Delete draft (no longer needed)
  await workingMemory.deleteDraft(draftId);
}
```

**Schema** (PostgreSQL):
```sql
CREATE TABLE working_memory.draft_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  draft_id VARCHAR(255) NOT NULL UNIQUE,
  entity_type VARCHAR(50) NOT NULL, -- CASE, PERSON, etc.
  entity_id UUID NOT NULL, -- Target entity
  proposed_change JSONB NOT NULL,
  reasoning TEXT,
  evidence_pack JSONB,
  inference BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(100), -- Specialist name
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  size_bytes INTEGER NOT NULL,
  CONSTRAINT max_draft_size CHECK (size_bytes <= 512000) -- 500 KB limit
);

CREATE INDEX idx_draft_expiry ON working_memory.draft_proposals (expires_at);
CREATE INDEX idx_draft_tenant ON working_memory.draft_proposals (company_id, entity_id);
```

**TTL**: 7 days (user approval window)

**Size Limit**: 500 KB per draft

**Cleanup**: Auto-delete after expiry (user missed approval deadline)

---

### 3.4 CATEGORY 4: Session Context (UX)

**Purpose**: Store conversational UI state (chat history, selected filters, scroll position).

**Use Case**:
```typescript
// User chatting with AI in dashboard
async function saveSessionContext(sessionId: string, userId: string, context: any) {
  const sessionKey = `wm:session:${userId}:${sessionId}`;

  await workingMemory.setSession(sessionKey, context, 1800); // 30 min TTL

  // Context includes:
  // - Chat history (last 10 messages)
  // - Selected filters (department, date range)
  // - UI state (open panels, scroll position)
}

// Restore session after page refresh
async function restoreSession(sessionId: string, userId: string) {
  const sessionKey = `wm:session:${userId}:${sessionId}`;
  const context = await workingMemory.getSession(sessionKey);

  if (context) {
    // Restore UI state
    return context;
  }
  // Session expired → start fresh
  return defaultContext();
}
```

**Schema** (PostgreSQL):
```sql
CREATE TABLE working_memory.session_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  context_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 minutes',
  size_bytes INTEGER NOT NULL,
  CONSTRAINT max_session_size CHECK (size_bytes <= 204800) -- 200 KB limit
);

CREATE INDEX idx_session_expiry ON working_memory.session_context (expires_at);
CREATE UNIQUE INDEX idx_session_user ON working_memory.session_context (user_id, session_id);
```

**Redis Preferred** (better for short TTL):
```typescript
const sessionKey = `wm:session:${userId}:${sessionId}`;
await redis.setex(sessionKey, 1800, JSON.stringify(context)); // 30 min TTL
```

**TTL**: 30 minutes (session timeout)

**Size Limit**: 200 KB per session

**Cleanup**: Automatic eviction via TTL

---

## 4. TTL & Retention Policy

### 4.1 TTL Configuration

| Category | Default TTL | Configurable? | Justification |
|----------|-------------|---------------|---------------|
| **Agent Checkpoint** | 24 hours | Yes (6h - 72h) | Long enough for crash recovery, short enough to avoid clutter |
| **Tool Cache** | 5-60 minutes | Yes (per tool) | Balance freshness vs redundant API calls |
| **Draft Proposal** | 7 days | Yes (1d - 30d) | User has reasonable time to approve |
| **Session Context** | 30 minutes | Yes (15m - 2h) | Matches typical session timeout |

**Configuration Example**:
```typescript
// working-memory.config.ts
export const workingMemoryConfig = {
  ttl: {
    agentCheckpoint: parseInt(process.env.WM_CHECKPOINT_TTL) || 86400, // 24h
    toolCache: {
      default: 300, // 5 min
      calculateROI: 3600, // 1h (expensive calculation)
      fetchExternalAPI: 600, // 10 min
    },
    draftProposal: 604800, // 7 days
    sessionContext: 1800, // 30 min
  },
  sizeLimits: {
    agentCheckpoint: 1048576, // 1 MB
    toolCache: 102400, // 100 KB
    draftProposal: 512000, // 500 KB
    sessionContext: 204800, // 200 KB
  },
};
```

### 4.2 Cleanup Automation

**PostgreSQL TTL Cleanup** (Scheduled Job):
```sql
-- Run every hour via pg_cron or external scheduler
DELETE FROM working_memory.agent_checkpoints WHERE expires_at < NOW();
DELETE FROM working_memory.tool_cache WHERE expires_at < NOW();
DELETE FROM working_memory.draft_proposals WHERE expires_at < NOW();
DELETE FROM working_memory.session_context WHERE expires_at < NOW();
```

**Redis TTL Cleanup**: Automatic (built-in eviction)

**Monitoring**:
```sql
-- Check stale entries (should be near zero)
SELECT COUNT(*) AS stale_count
FROM working_memory.agent_checkpoints
WHERE expires_at < NOW();
```

---

## 5. Size Limits & Enforcement

### 5.1 Pre-Write Size Check

**Enforcement** (MUST reject oversized writes):
```typescript
async function saveCheckpoint(runId: string, data: any, company_id: string): Promise<void> {
  const serialized = JSON.stringify(data);
  const sizeBytes = Buffer.byteLength(serialized, 'utf8');

  const maxSize = workingMemoryConfig.sizeLimits.agentCheckpoint;

  if (sizeBytes > maxSize) {
    throw new Error(
      `Checkpoint exceeds size limit: ${sizeBytes} bytes (max ${maxSize})`
    );
  }

  // Store with size tracking
  await db.query(
    `INSERT INTO working_memory.agent_checkpoints
     (company_id, agent_run_id, checkpoint_data, size_bytes)
     VALUES ($1, $2, $3, $4)`,
    [company_id, runId, data, sizeBytes]
  );
}
```

### 5.2 LRU Eviction (if total size exceeds threshold)

**Per-Tenant Quota**:
```typescript
const maxTotalSize = 100 * 1024 * 1024; // 100 MB per tenant

async function enforceQuota(company_id: string): Promise<void> {
  const totalSize = await db.query(
    `SELECT SUM(size_bytes) AS total
     FROM working_memory.agent_checkpoints
     WHERE company_id = $1`,
    [company_id]
  );

  if (totalSize.total > maxTotalSize) {
    // Evict oldest checkpoints until under quota
    await db.query(
      `DELETE FROM working_memory.agent_checkpoints
       WHERE id IN (
         SELECT id FROM working_memory.agent_checkpoints
         WHERE company_id = $1
         ORDER BY created_at ASC
         LIMIT 10
       )`,
      [company_id]
    );

    logger.warn('Working Memory quota exceeded, evicted oldest checkpoints', {
      company_id,
      total_size: totalSize.total,
    });
  }
}
```

---

## 6. Graceful Degradation (Recovery from Loss)

### 6.1 Checkpoint Loss

**Scenario**: Redis crashes, all checkpoints lost.

**Expected Behavior**:
```typescript
async function analyzeWithRecovery(emailIds: string[], runId: string) {
  const checkpoint = await workingMemory.getCheckpoint(runId);

  if (!checkpoint) {
    logger.warn('No checkpoint found, starting from beginning', { run_id: runId });
    // Re-process all emails (expensive but safe)
    return analyzeEmails(emailIds, runId);
  }

  // Resume from checkpoint
  const remaining = emailIds.slice(checkpoint.step);
  return analyzeEmails(remaining, runId);
}
```

**MUST NOT**: Fail or corrupt Canonical Memory if Working Memory unavailable.

### 6.2 Tool Cache Miss

**Scenario**: Cache expired or evicted.

**Expected Behavior**:
```typescript
async function calculateWithCache(caseId: string) {
  const cached = await workingMemory.getToolCache(cacheKey);

  if (!cached) {
    logger.info('Tool cache miss, recalculating', { case_id: caseId });
    return expensiveCalculation(caseId); // Recompute
  }

  return cached.result;
}
```

**MUST NOT**: Return stale/incorrect data if cache unavailable.

---

## 7. Multi-Tenant Isolation

### 7.1 Namespace per Tenant

**PostgreSQL**:
```sql
-- All Working Memory tables MUST have company_id
CREATE POLICY tenant_isolation_wm ON working_memory.agent_checkpoints
  FOR ALL USING (
    company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())
  );
```

**Redis**:
```typescript
const checkpointKey = `wm:${company_id}:checkpoint:${runId}`;
// Tenant ID embedded in key (no cross-tenant access)
```

### 7.2 Cross-Tenant Queries (PROHIBITED)

**MUST NOT**:
```typescript
// ❌ WRONG: Query across tenants
const allCheckpoints = await redis.keys('wm:*:checkpoint:*');
```

**MUST**:
```typescript
// ✅ CORRECT: Query only current tenant
const checkpoints = await redis.keys(`wm:${company_id}:checkpoint:*`);
```

---

## 8. Validation Tests (Pass Criteria)

### 8.1 Test 1: TTL Expiry

**Setup**:
1. Save checkpoint with 5-second TTL
2. Wait 6 seconds
3. Try to retrieve checkpoint

**Expected**:
- Checkpoint returns `null` (expired)
- Database/Redis auto-deleted entry

**Code Verification**:
```typescript
await workingMemory.saveCheckpoint(runId, data, company_id, 5); // 5s TTL
await sleep(6000);
const checkpoint = await workingMemory.getCheckpoint(runId, company_id);
assert(checkpoint === null);
```

### 8.2 Test 2: Size Limit Enforcement

**Setup**:
1. Try to save checkpoint with 2 MB data (exceeds 1 MB limit)

**Expected**:
- Write rejected with error
- No data saved to Working Memory

**Code Verification**:
```typescript
const oversizedData = { payload: 'x'.repeat(2 * 1024 * 1024) }; // 2 MB
await expect(
  workingMemory.saveCheckpoint(runId, oversizedData, company_id)
).rejects.toThrow('exceeds size limit');
```

### 8.3 Test 3: Tenant Isolation

**Setup**:
1. Tenant A saves checkpoint
2. Tenant B tries to read Tenant A's checkpoint

**Expected**:
- Tenant B gets `null` (no cross-tenant access)

**Code Verification**:
```typescript
await workingMemory.saveCheckpoint(runId, data, tenantA);
const leaked = await workingMemory.getCheckpoint(runId, tenantB);
assert(leaked === null);
```

### 8.4 Test 4: Graceful Degradation

**Setup**:
1. Agent saves checkpoint
2. Simulate Redis crash (clear all data)
3. Agent resumes

**Expected**:
- Agent restarts from beginning (no crash)
- No corruption of Canonical Memory

**Code Verification**:
```typescript
await workingMemory.saveCheckpoint(runId, { step: 50 }, company_id);
await redis.flushall(); // Simulate crash
const result = await analyzeWithRecovery(emailIds, runId);
assert(result.status === 'completed'); // Graceful recovery
```

### 8.5 Test 5: Cleanup Automation

**Setup**:
1. Save 100 checkpoints with 1-second TTL
2. Wait 2 seconds
3. Run cleanup job

**Expected**:
- All 100 checkpoints deleted
- Database size returns to baseline

**SQL Verification**:
```sql
-- Before cleanup
SELECT COUNT(*) FROM working_memory.agent_checkpoints WHERE expires_at < NOW();
-- Expected: 100

-- After cleanup
DELETE FROM working_memory.agent_checkpoints WHERE expires_at < NOW();
SELECT COUNT(*) FROM working_memory.agent_checkpoints;
-- Expected: 0
```

---

## 9. Performance Benchmarks

### 9.1 Write Throughput

**Target**:
- 1000 checkpoints/sec (Redis)
- 500 checkpoints/sec (PostgreSQL)

**Measurement**:
```typescript
const start = Date.now();
for (let i = 0; i < 1000; i++) {
  await workingMemory.saveCheckpoint(`run-${i}`, { step: i }, company_id);
}
const elapsed = Date.now() - start;
const throughput = 1000 / (elapsed / 1000); // ops/sec
logger.info('Write throughput', { throughput });
```

### 9.2 Read Latency

**Target**:
- p50 < 5ms (Redis)
- p95 < 20ms (Redis)
- p50 < 10ms (PostgreSQL)
- p95 < 50ms (PostgreSQL)

**Measurement**:
```typescript
const latencies: number[] = [];
for (let i = 0; i < 100; i++) {
  const start = Date.now();
  await workingMemory.getCheckpoint(runId, company_id);
  latencies.push(Date.now() - start);
}
const p95 = percentile(latencies, 0.95);
assert(p95 < 20); // Redis target
```

---

## 10. Checklist (FIT Pass Criteria)

### Infrastructure

- [ ] Working Memory storage configured (Redis or PostgreSQL)
- [ ] TTL automation enabled (pg_cron or Redis eviction)
- [ ] Monitoring for stale entries (alert if > 1000)

### Categories Implemented

- [ ] Agent Checkpoints (24h TTL, 1 MB limit)
- [ ] Tool Cache (5-60m TTL, 100 KB limit)
- [ ] Draft Proposals (7d TTL, 500 KB limit)
- [ ] Session Context (30m TTL, 200 KB limit)

### Policies Enforced

- [ ] Pre-write size check (reject oversized)
- [ ] TTL-based eviction (automated)
- [ ] Tenant isolation (namespace per company_id)
- [ ] Graceful degradation (no crash if Working Memory lost)

### Validation Tests

- [ ] Test 1 (TTL Expiry): PASS
- [ ] Test 2 (Size Limit): PASS
- [ ] Test 3 (Tenant Isolation): PASS
- [ ] Test 4 (Graceful Degradation): PASS
- [ ] Test 5 (Cleanup Automation): PASS

### Performance

- [ ] Write throughput >= 500 ops/sec
- [ ] Read p95 latency <= 50ms

---

## 11. References

- CANON-MEM-PLANE-001: Memory Plane Architecture
- FIT-RAG-PIPELINE-001: RAG Pipeline Specification
- FIT-MEMORY-WRITES-001: Memory Write Policy

---

**END OF FIT-WORKING-MEMORY-001**
