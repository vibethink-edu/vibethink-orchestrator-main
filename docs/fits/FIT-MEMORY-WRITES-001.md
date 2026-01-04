# FIT-MEMORY-WRITES-001: Memory Write Policy & Governance

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-MEM-PLANE-001
**Related WITs**: WIT-003, WIT-005

---

## 1. Purpose

This FIT validates that **Memory Write Policy** correctly governs when and how data enters Canonical Memory (SoR), preventing:
- Hallucination injection (LLM inference auto-committing)
- Policy bypass (unauthorized writes)
- Provenance loss (untraced source)
- Cross-tenant contamination

**Pass Criteria**: All write sources (Human, API, Reasoning Layer) pass through Policy Gates before writing to SoR.

---

## 2. Write Sources & Policy Matrix

```
┌─────────────────────────────────────────────────────────────┐
│  WRITE SOURCE                      │ POLICY GATE             │
├─────────────────────────────────────────────────────────────┤
│  Human User (via UX)                │ Permission Check        │
│                                     │ Schema Validation       │
│                                     │ Auto-Approve (user owns)│
├─────────────────────────────────────────────────────────────┤
│  External API (webhook)             │ Signature Validation    │
│                                     │ Schema Validation       │
│                                     │ Dedupe Check            │
│                                     │ Auto-Approve (if valid) │
├─────────────────────────────────────────────────────────────┤
│  Reasoning Layer (Specialist)       │ EvidencePack Required   │
│  - inference: false                 │ Permission Check        │
│                                     │ Schema Validation       │
│                                     │ Auto-Approve            │
├─────────────────────────────────────────────────────────────┤
│  Reasoning Layer (Specialist)       │ EvidencePack Required   │
│  - inference: true                  │ Permission Check        │
│                                     │ Schema Validation       │
│                                     │ Human Approval REQUIRED │
├─────────────────────────────────────────────────────────────┤
│  UX Layer (direct to DB)            │ REJECTED (bypass)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Policy Gate Architecture

```
┌───────────────────────────────────────────────────────────┐
│  WRITE REQUEST (any source)                               │
│  { entity_id, change, source, evidence_pack, inference }  │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  GATE 1: Source Authentication                            │
│  - Human: Check session token (auth.uid())                │
│  - API: Validate webhook signature (HMAC)                 │
│  - Specialist: Check agent_id in whitelist                │
│  ❌ REJECT: Invalid/missing auth                          │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  GATE 2: Permission Check                                 │
│  - check_resource_access(user/agent, entity_id, 'EDIT')   │
│  - Department scope validation                            │
│  ❌ REJECT: Insufficient permissions                      │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  GATE 3: Schema Validation                                │
│  - Entity type matches change schema                      │
│  - Required fields present                                │
│  - Data types correct (UUID, timestamp, enum)             │
│  ❌ REJECT: Schema violation                              │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  GATE 4: Provenance Completeness                          │
│  - source_id present (who/what originated this)           │
│  - source_hash present (content integrity)                │
│  - timestamp present (when)                               │
│  ❌ REJECT: Missing provenance                            │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  GATE 5: Anti-Hallucination (if from Reasoning Layer)     │
│  - EvidencePack present and valid                         │
│  - All SourceRefs validate against SoR (no stale)         │
│  - If inference: true → requires human approval           │
│  ❌ REJECT: Missing/invalid evidence OR unapproved AI     │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  GATE 6: Deduplication (if from External API)             │
│  - Check if source_id + source_hash already exists        │
│  - Skip write if duplicate (idempotency)                  │
│  ✅ PASS: Allow if unique                                 │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  WRITE TO CANONICAL MEMORY (SoR)                          │
│  - Append to event log (immutable)                        │
│  - Update entity state (if applicable)                    │
│  - Log to audit trail                                     │
│  ✅ SUCCESS                                                │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Write Source Specifications

### 4.1 SOURCE 1: Human User (via UX)

**Policy**: Users can directly write data they have permission to edit.

**Flow**:
```typescript
// User updates Case status in UI
async function updateCaseStatus(
  caseId: string,
  newStatus: string,
  userId: string,
  company_id: string
): Promise<void> {
  // GATE 1: Auth (session token validated by middleware)
  // GATE 2: Permission
  await policyLayer.checkAccess(userId, caseId, 'EDIT');

  // GATE 3: Schema
  if (!VALID_CASE_STATUSES.includes(newStatus)) {
    throw new ValidationError('Invalid case status');
  }

  // GATE 4: Provenance
  const change = {
    entity_id: caseId,
    entity_type: 'CASE',
    change: { status: newStatus },
    source_id: userId, // User is source
    source_hash: hashContent({ status: newStatus }),
    timestamp: new Date().toISOString(),
    inference: false, // User decision, not AI
  };

  // GATE 5: N/A (not from Reasoning Layer)
  // GATE 6: N/A (not from API)

  // Write to SoR
  await memoryService.writeEntity(change, company_id);

  logger.info('User updated case status', { case_id: caseId, user_id: userId });
}
```

**Auto-Approve**: YES (user owns their data)

---

### 4.2 SOURCE 2: External API (Webhook)

**Policy**: External systems send data via webhook (e.g., email received, payment processed).

**Flow**:
```typescript
// Incoming webhook from email provider
async function handleEmailWebhook(req: Request): Promise<void> {
  const { signature, payload } = req.body;

  // GATE 1: Auth (validate HMAC signature)
  const isValid = validateWebhookSignature(payload, signature, SECRET_KEY);
  if (!isValid) {
    throw new UnauthorizedError('Invalid webhook signature');
  }

  const { email_id, from, to, subject, body, received_at } = payload;

  // GATE 2: Permission (webhook acts on behalf of tenant)
  const company_id = await mapEmailToCompany(to); // Map recipient to tenant
  if (!company_id) {
    throw new Error('Recipient not associated with any tenant');
  }

  // GATE 3: Schema
  const signal = {
    entity_type: 'COMMUNICATION_SIGNAL',
    metadata: {
      medium: 'EMAIL',
      from,
      to,
      subject,
    },
    content: body,
  };
  await validateSchema(signal, 'COMMUNICATION_SIGNAL');

  // GATE 4: Provenance
  const change = {
    ...signal,
    source_id: `email_provider:${email_id}`, // External ID
    source_hash: hashContent(body),
    timestamp: received_at,
    inference: false,
  };

  // GATE 6: Dedupe (check if already ingested)
  const existing = await db.query(
    `SELECT id FROM entities WHERE source_id = $1 AND company_id = $2`,
    [change.source_id, company_id]
  );
  if (existing) {
    logger.info('Duplicate webhook, skipping', { source_id: change.source_id });
    return; // Idempotent
  }

  // Write to SoR
  await memoryService.writeEntity(change, company_id);

  logger.info('Ingested email from webhook', { email_id, company_id });
}
```

**Auto-Approve**: YES (if signature valid)

---

### 4.3 SOURCE 3: Reasoning Layer (inference: false)

**Policy**: Specialist proposes write based on deterministic rules (no LLM inference).

**Example**: "If Case has no activity for 30 days, mark as STALE".

**Flow**:
```typescript
// OperationsSpecialist detects stale case (rule-based, no LLM)
async function detectStaleCases(company_id: string): Promise<void> {
  const staleCases = await db.query(
    `SELECT id FROM entities
     WHERE entity_type = 'CASE'
       AND company_id = $1
       AND last_activity_at < NOW() - INTERVAL '30 days'
       AND status != 'STALE'`,
    [company_id]
  );

  for (const caseEntity of staleCases) {
    // GATE 1: Auth (specialist authenticated via agent_id)
    // GATE 2: Permission (specialist has 'EDIT' on Cases)
    await policyLayer.checkAccess('specialist:operations', caseEntity.id, 'EDIT');

    // GATE 3: Schema
    const change = { status: 'STALE' };
    await validateSchema(change, 'CASE');

    // GATE 4: Provenance
    const write = {
      entity_id: caseEntity.id,
      change,
      source_id: 'specialist:operations',
      source_hash: hashContent(change),
      timestamp: new Date().toISOString(),
      inference: false, // Rule-based, deterministic
    };

    // GATE 5: EvidencePack (even if not inference, provide evidence)
    const evidencePack = {
      claim: 'Case is stale (no activity for 30 days)',
      sources: [
        {
          source_entity_id: caseEntity.id,
          source_type: 'CASE',
          source_hash: caseEntity.content_hash,
          chunk_locator: 'last_activity_at field',
          retrieved_at: new Date().toISOString(),
        },
      ],
      inference_used: false,
    };

    // Auto-approve (no LLM used)
    await memoryService.writeEntity(write, company_id, evidencePack);

    logger.info('Specialist marked case as stale', { case_id: caseEntity.id });
  }
}
```

**Auto-Approve**: YES (deterministic rule, no LLM)

---

### 4.4 SOURCE 4: Reasoning Layer (inference: true)

**Policy**: Specialist proposes write based on LLM inference (REQUIRES human approval).

**Example**: "LLM reads 10 emails and infers Case is 'AT_RISK'".

**Flow**:
```typescript
// SalesSpecialist analyzes emails and proposes Case status change
async function analyzeCaseRisk(caseId: string, company_id: string): Promise<void> {
  // Retrieve relevant emails
  const emails = await retrieveEmailsForCase(caseId, company_id);

  // LLM analyzes sentiment
  const llmResponse = await llm.chat({
    messages: [
      { role: 'system', content: 'Analyze if this case is at risk based on emails.' },
      { role: 'user', content: JSON.stringify(emails) },
    ],
  });

  const { risk_level, confidence, reasoning } = llmResponse;

  // GATE 1: Auth (specialist authenticated)
  // GATE 2: Permission
  await policyLayer.checkAccess('specialist:sales', caseId, 'EDIT');

  // GATE 3: Schema
  const change = { status: 'AT_RISK' };
  await validateSchema(change, 'CASE');

  // GATE 4: Provenance
  const write = {
    entity_id: caseId,
    change,
    source_id: 'specialist:sales',
    source_hash: hashContent(change),
    timestamp: new Date().toISOString(),
    inference: true, // LLM-derived
    confidence,
    reasoning,
  };

  // GATE 5: EvidencePack (MUST include all source emails)
  const evidencePack = {
    claim: 'Case is at risk based on email sentiment',
    sources: emails.map(email => ({
      source_entity_id: email.id,
      source_type: 'COMMUNICATION_SIGNAL',
      source_hash: email.content_hash,
      chunk_locator: 'email body',
      retrieved_at: new Date().toISOString(),
    })),
    inference_used: true,
    confidence,
  };

  // GATE 5: Human approval REQUIRED
  const draftId = await workingMemory.saveDraft({
    entity_id: caseId,
    proposed_change: change,
    evidence_pack: evidencePack,
    reasoning,
    inference: true,
  });

  // Notify user for approval
  await notifyUser({
    type: 'APPROVAL_REQUIRED',
    draft_id: draftId,
    summary: `Specialist suggests marking Case ${caseId} as AT_RISK (confidence: ${confidence})`,
  });

  logger.info('Specialist created draft proposal (requires approval)', { draft_id: draftId });
}

// User approves draft
async function approveDraft(draftId: string, userId: string, company_id: string): Promise<void> {
  const draft = await workingMemory.getDraft(draftId);

  // GATE 2: Permission (user approving must have EDIT rights)
  await policyLayer.checkAccess(userId, draft.entity_id, 'EDIT');

  // Validate EvidencePack still valid (sources not deleted/stale)
  const validatedPack = await buildEvidencePack(draft.evidence_pack.sources, company_id);

  if (validatedPack.sources.length === 0) {
    throw new Error('All evidence sources are stale, cannot approve');
  }

  // Write to SoR (with approval metadata)
  await memoryService.writeEntity(
    {
      ...draft.proposed_change,
      approved_by: userId,
      approved_at: new Date().toISOString(),
    },
    company_id,
    validatedPack
  );

  // Delete draft
  await workingMemory.deleteDraft(draftId);

  logger.info('User approved specialist proposal', { draft_id: draftId, user_id: userId });
}
```

**Auto-Approve**: NO (human approval mandatory)

---

### 4.5 SOURCE 5: UX Layer (Direct DB Write) — PROHIBITED

**Policy**: UX Layer MUST NEVER write directly to SoR (bypass risk).

**Anti-Pattern** (MUST NOT EXIST):
```typescript
// ❌ WRONG: UX component directly writing to DB
async function updateCaseFromUI(caseId: string, newStatus: string) {
  await db.query('UPDATE entities SET status = $1 WHERE id = $2', [newStatus, caseId]);
  // NO permission check, NO provenance, NO audit log
}
```

**Correct Pattern** (MUST USE):
```typescript
// ✅ CORRECT: UX calls service layer
async function updateCaseFromUI(caseId: string, newStatus: string, userId: string) {
  await memoryService.updateCaseStatus(caseId, newStatus, userId);
  // Service layer enforces all Policy Gates
}
```

**Enforcement**:
- UX Layer has READ-ONLY DB credentials (cannot INSERT/UPDATE/DELETE)
- All writes via API endpoints (service layer enforces gates)

---

## 5. Policy Gate Implementations

### 5.1 GATE 1: Source Authentication

**Implementation**:
```typescript
function authenticateWriteSource(req: Request): WriteSource {
  // Human User (session token)
  if (req.headers.authorization) {
    const userId = verifySessionToken(req.headers.authorization);
    return { type: 'HUMAN', id: userId };
  }

  // External API (webhook signature)
  if (req.headers['x-webhook-signature']) {
    const isValid = validateWebhookSignature(req.body, req.headers['x-webhook-signature']);
    if (!isValid) throw new UnauthorizedError('Invalid webhook signature');
    return { type: 'EXTERNAL_API', id: req.body.source_id };
  }

  // Specialist (agent_id from internal service)
  if (req.headers['x-agent-id']) {
    const agentId = req.headers['x-agent-id'];
    if (!WHITELISTED_AGENTS.includes(agentId)) {
      throw new UnauthorizedError('Unknown agent');
    }
    return { type: 'SPECIALIST', id: agentId };
  }

  throw new UnauthorizedError('No valid authentication');
}
```

---

### 5.2 GATE 2: Permission Check

**Implementation** (reuse existing Policy Layer):
```typescript
async function checkWritePermission(
  source: WriteSource,
  entityId: string,
  company_id: string
): Promise<void> {
  let actorId = source.id;

  // Map specialist to department permissions
  if (source.type === 'SPECIALIST') {
    actorId = await getSpecialistDepartment(source.id);
  }

  const hasAccess = await db.query(
    `SELECT check_resource_access($1, $2, 'EDIT') AS allowed`,
    [actorId, entityId]
  );

  if (!hasAccess.allowed) {
    throw new PermissionDeniedError(`${source.type} ${source.id} lacks EDIT permission on ${entityId}`);
  }
}
```

---

### 5.3 GATE 3: Schema Validation

**Implementation**:
```typescript
const entitySchemas = {
  CASE: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'STALE', 'CLOSED', 'AT_RISK']),
    assigned_to: z.string().uuid().optional(),
    metadata: z.record(z.any()).optional(),
  }),
  COMMUNICATION_SIGNAL: z.object({
    metadata: z.object({
      medium: z.enum(['EMAIL', 'CHAT', 'VOICE', 'SMS']),
      from: z.string(),
      to: z.string(),
    }),
    content: z.string(),
  }),
  // ... other entity types
};

async function validateSchema(change: any, entityType: string): Promise<void> {
  const schema = entitySchemas[entityType];
  if (!schema) {
    throw new ValidationError(`Unknown entity type: ${entityType}`);
  }

  const result = schema.safeParse(change);
  if (!result.success) {
    throw new ValidationError(`Schema validation failed: ${result.error.message}`);
  }
}
```

---

### 5.4 GATE 4: Provenance Completeness

**Implementation**:
```typescript
function validateProvenance(write: WriteRequest): void {
  const required = ['source_id', 'source_hash', 'timestamp'];

  for (const field of required) {
    if (!write[field]) {
      throw new ValidationError(`Missing provenance field: ${field}`);
    }
  }

  // Validate hash format (SHA-256)
  if (!/^[a-f0-9]{64}$/i.test(write.source_hash)) {
    throw new ValidationError('Invalid source_hash format (expected SHA-256)');
  }

  // Validate timestamp format (ISO 8601)
  if (isNaN(Date.parse(write.timestamp))) {
    throw new ValidationError('Invalid timestamp format');
  }
}
```

---

### 5.5 GATE 5: Anti-Hallucination

**Implementation** (from FIT-RAG-PIPELINE-001):
```typescript
async function validateEvidencePack(
  evidencePack: EvidencePack,
  company_id: string
): Promise<void> {
  if (evidencePack.inference_used) {
    // Inference MUST have human approval
    if (!evidencePack.approved_by) {
      throw new ApprovalRequiredError('Inference-based writes require human approval');
    }
  }

  // Validate all sources exist and not stale
  for (const sourceRef of evidencePack.sources) {
    const entity = await db.query(
      `SELECT id, content_hash, deleted_at FROM entities
       WHERE id = $1 AND company_id = $2`,
      [sourceRef.source_entity_id, company_id]
    );

    if (!entity || entity.deleted_at) {
      throw new ValidationError(`Source entity ${sourceRef.source_entity_id} not found or deleted`);
    }

    if (entity.content_hash !== sourceRef.source_hash) {
      throw new ValidationError(`Source entity ${sourceRef.source_entity_id} content changed (stale)`);
    }
  }
}
```

---

### 5.6 GATE 6: Deduplication

**Implementation**:
```typescript
async function checkDuplicate(
  sourceId: string,
  sourceHash: string,
  company_id: string
): Promise<boolean> {
  const existing = await db.query(
    `SELECT id FROM entities
     WHERE source_id = $1
       AND source_hash = $2
       AND company_id = $3`,
    [sourceId, sourceHash, company_id]
  );

  return existing !== null; // True if duplicate
}
```

---

## 6. Memory Service (Unified Write Endpoint)

**All writes MUST go through this service**:
```typescript
// memoryService.ts
export class MemoryService {
  async writeEntity(
    write: WriteRequest,
    company_id: string,
    evidencePack?: EvidencePack
  ): Promise<string> {
    // GATE 1: Auth (done in middleware)
    // GATE 2: Permission
    await this.checkWritePermission(write.source, write.entity_id, company_id);

    // GATE 3: Schema
    await this.validateSchema(write.change, write.entity_type);

    // GATE 4: Provenance
    this.validateProvenance(write);

    // GATE 5: Anti-Hallucination (if from Reasoning Layer)
    if (evidencePack) {
      await this.validateEvidencePack(evidencePack, company_id);
    }

    // GATE 6: Dedupe (if from External API)
    if (write.source.type === 'EXTERNAL_API') {
      const isDuplicate = await this.checkDuplicate(write.source_id, write.source_hash, company_id);
      if (isDuplicate) {
        logger.info('Duplicate write detected, skipping', { source_id: write.source_id });
        return 'skipped';
      }
    }

    // All gates passed → Write to SoR
    const entityId = await this.writeToSoR(write, company_id, evidencePack);

    // Log to audit trail
    await this.logAuditTrail({
      entity_id: entityId,
      write_source: write.source,
      change: write.change,
      evidence_pack: evidencePack,
      timestamp: new Date().toISOString(),
    });

    logger.info('Write to Canonical Memory successful', {
      entity_id: entityId,
      source: write.source,
    });

    return entityId;
  }

  private async writeToSoR(
    write: WriteRequest,
    company_id: string,
    evidencePack?: EvidencePack
  ): Promise<string> {
    // Append to event log (immutable)
    await db.query(
      `INSERT INTO entity_events (entity_id, event_type, event_data, source_id, source_hash, company_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [write.entity_id, 'UPDATED', write.change, write.source_id, write.source_hash, company_id]
    );

    // Update entity state
    await db.query(
      `UPDATE entities SET data = data || $1, updated_at = NOW() WHERE id = $2`,
      [write.change, write.entity_id]
    );

    return write.entity_id;
  }
}
```

---

## 7. Validation Tests (Pass Criteria)

### 7.1 Test 1: Unauthorized Write Rejected

**Setup**:
1. Attempt write without auth token

**Expected**:
- GATE 1 rejects with `UnauthorizedError`

**Code Verification**:
```typescript
await expect(
  memoryService.writeEntity(writeRequest, company_id)
).rejects.toThrow(UnauthorizedError);
```

---

### 7.2 Test 2: Insufficient Permission Rejected

**Setup**:
1. User A tries to update Case B (no EDIT permission)

**Expected**:
- GATE 2 rejects with `PermissionDeniedError`

**Code Verification**:
```typescript
await expect(
  memoryService.writeEntity({ entity_id: caseB, change: {...}, source: userA }, company_id)
).rejects.toThrow(PermissionDeniedError);
```

---

### 7.3 Test 3: Schema Validation Failure

**Setup**:
1. Try to write invalid status (e.g., `status: 'INVALID'`)

**Expected**:
- GATE 3 rejects with `ValidationError`

**Code Verification**:
```typescript
await expect(
  memoryService.writeEntity({ change: { status: 'INVALID' }, entity_type: 'CASE' }, company_id)
).rejects.toThrow(ValidationError);
```

---

### 7.4 Test 4: Missing Provenance Rejected

**Setup**:
1. Write without `source_hash`

**Expected**:
- GATE 4 rejects with `ValidationError: Missing provenance field: source_hash`

**Code Verification**:
```typescript
await expect(
  memoryService.writeEntity({ source_id: 'test', timestamp: '2026-01-04' }, company_id)
).rejects.toThrow('Missing provenance field: source_hash');
```

---

### 7.5 Test 5: Unapproved Inference Rejected

**Setup**:
1. Specialist proposes write with `inference: true`, no approval

**Expected**:
- GATE 5 rejects with `ApprovalRequiredError`

**Code Verification**:
```typescript
await expect(
  memoryService.writeEntity(
    { change: {...}, inference: true },
    company_id,
    { inference_used: true, approved_by: null }
  )
).rejects.toThrow(ApprovalRequiredError);
```

---

### 7.6 Test 6: Stale Evidence Rejected

**Setup**:
1. Specialist proposes write with EvidencePack
2. Source entity deleted before approval

**Expected**:
- GATE 5 rejects with `ValidationError: Source entity not found`

**Code Verification**:
```typescript
const draft = await workingMemory.saveDraft({ evidence_pack: evidencePack });
await db.query('DELETE FROM entities WHERE id = $1', [evidencePack.sources[0].source_entity_id]);

await expect(
  memoryService.approveDraft(draft.id, userId)
).rejects.toThrow('Source entity not found');
```

---

### 7.7 Test 7: Duplicate API Write Skipped

**Setup**:
1. Ingest webhook with `source_id: 'email-123'`
2. Ingest same webhook again

**Expected**:
- GATE 6 detects duplicate, returns `skipped` (no error)

**Code Verification**:
```typescript
await memoryService.writeEntity({ source_id: 'email-123', source_hash: 'abc' }, company_id);
const result = await memoryService.writeEntity({ source_id: 'email-123', source_hash: 'abc' }, company_id);
assert(result === 'skipped');
```

---

### 7.8 Test 8: UX Layer Cannot Bypass

**Setup**:
1. UX Layer attempts direct DB write (no service layer)

**Expected**:
- DB rejects (read-only credentials)

**SQL Verification**:
```sql
-- UX Layer uses this DB user
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ux_layer_user;
-- NO INSERT/UPDATE/DELETE grants

-- Attempt write
INSERT INTO entities (...) VALUES (...);
-- Expected: ERROR: permission denied for table entities
```

---

## 8. Audit Trail

**All writes MUST be logged**:
```sql
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  entity_id UUID NOT NULL,
  write_source VARCHAR(100) NOT NULL, -- 'HUMAN:user-123' | 'SPECIALIST:sales' | 'API:webhook'
  change JSONB NOT NULL,
  evidence_pack JSONB,
  approved_by UUID, -- If inference: true
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_company ON audit_trail (company_id, timestamp DESC);
CREATE INDEX idx_audit_entity ON audit_trail (entity_id, timestamp DESC);
```

**Query Examples**:
```sql
-- Who changed this Case?
SELECT write_source, change, timestamp FROM audit_trail WHERE entity_id = 'case-123' ORDER BY timestamp DESC;

-- All AI-approved changes
SELECT * FROM audit_trail WHERE approved_by IS NOT NULL;

-- Specialist activity log
SELECT * FROM audit_trail WHERE write_source LIKE 'SPECIALIST:%' AND timestamp > NOW() - INTERVAL '7 days';
```

---

## 9. Checklist (FIT Pass Criteria)

### Policy Gates Implemented

- [ ] GATE 1: Source Authentication (Human/API/Specialist)
- [ ] GATE 2: Permission Check (check_resource_access)
- [ ] GATE 3: Schema Validation (Zod schemas per entity type)
- [ ] GATE 4: Provenance Completeness (source_id, source_hash, timestamp)
- [ ] GATE 5: Anti-Hallucination (EvidencePack validation, inference approval)
- [ ] GATE 6: Deduplication (API writes idempotent)

### Write Sources Configured

- [ ] Human User: Auto-approve (after permission check)
- [ ] External API: Auto-approve (after signature validation)
- [ ] Specialist (inference: false): Auto-approve
- [ ] Specialist (inference: true): Requires human approval
- [ ] UX Layer: Direct writes PROHIBITED (read-only DB user)

### Validation Tests

- [ ] Test 1 (Unauthorized): PASS
- [ ] Test 2 (Insufficient Permission): PASS
- [ ] Test 3 (Schema Violation): PASS
- [ ] Test 4 (Missing Provenance): PASS
- [ ] Test 5 (Unapproved Inference): PASS
- [ ] Test 6 (Stale Evidence): PASS
- [ ] Test 7 (Duplicate API): PASS
- [ ] Test 8 (UX Bypass): PASS

### Audit Trail

- [ ] `audit_trail` table exists
- [ ] All writes logged (100% coverage)
- [ ] Audit logs queryable by entity, source, time

---

## 10. References

- CANON-MEM-PLANE-001: Memory Plane Architecture
- FIT-RAG-PIPELINE-001: RAG Pipeline Specification (EvidencePack)
- FIT-WORKING-MEMORY-001: Working Memory (Draft Proposals)

---

**END OF FIT-MEMORY-WRITES-001**
