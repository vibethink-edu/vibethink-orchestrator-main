# CANON-MEM-PLANE-001: Memory Plane Architecture

**Status**: CANONICAL
**Type**: ARCHITECTURAL_CORE
**Version**: 1.0.0
**Date**: 2026-01-04
**Related WITs**: WIT-001, WIT-002, WIT-003, WIT-005
**Related FITs**: FIT-RAG-PIPELINE-001, FIT-WORKING-MEMORY-001, FIT-MEMORY-WRITES-001, FIT-RAG-EVAL-001

---

## 1. Purpose & Scope

This canon establishes the **Memory Plane** as Layer 1 of the AI-first architecture (Memory → Reasoning → UX). It defines the separation of concerns between:

- **System of Record (SoR)**: Authoritative operational truth
- **Canonical Memory**: Validated, policy-aware domain entities
- **Indexes**: Accelerated retrieval structures (vector DBs, search indices)
- **Working Memory**: Ephemeral run-time state for reasoning agents

**Critical Principle**: Memory Plane is the **substrate of truth**. Reasoning Layer consumes it. UX Layer projects it. Neither Reasoning nor UX modify Memory directly without passing through service gates.

---

## 2. Architectural Layers (Memory Plane Detail)

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: UX (Projections)                                  │
│  - Reads Canonical Memory via Policy-filtered queries       │
│  - NEVER writes directly to Memory (service layer only)     │
└─────────────────────────────────────────────────────────────┘
                         ↑ projects (read-only)
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: REASONING (Specialists + Orchestration)           │
│  - Reads Canonical Memory + Indexes                         │
│  - Writes decisions to Trace Logs                           │
│  - Proposes Memory writes via Memory Write Policy           │
└─────────────────────────────────────────────────────────────┘
                         ↑ consumes + proposes
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: MEMORY PLANE (Substrate)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1A: CANONICAL MEMORY (SoR)                          │   │
│  │   - Event Stream (Timeline)                         │   │
│  │   - Entity Graph (Person/Org/Case/Program)          │   │
│  │   - Policy Layer (RLS, permissions)                 │   │
│  │   - Provenance (source_id, hash, timestamp)         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1B: INDEXES (Retrieval Acceleration)                │   │
│  │   - Vector Store (embeddings for RAG)               │   │
│  │   - Full-Text Search (keyword retrieval)            │   │
│  │   - Graph Indexes (relationship queries)            │   │
│  │   - NOT source of truth (rebuild from SoR)          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1C: WORKING MEMORY (Run-time State)                 │   │
│  │   - Agent checkpoints/snapshots                     │   │
│  │   - Tool cache (LLM tool results)                   │   │
│  │   - Draft proposals (not yet canonical)             │   │
│  │   - TTL-based retention                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. System of Record (SoR) vs Canonical Memory vs Indexes

### 3.1 System of Record (SoR)

**Definition**: The authoritative, immutable source of operational truth.

**What MUST be in SoR**:
- Event Stream (Timeline): `universal_timelines`, `timeline_events`
- Entity Graph: `entities`, `entity_relationships`
- Communication Signals: `communication_events`
- Commitments: `commitment_signals`
- Knowledge Artifacts: `knowledge_artifacts`
- Trace Logs: `specialist_trace_logs`

**Properties** (MUST):
- Immutable append-only log (events never deleted, only superseded)
- Full provenance chain (source_id, source_hash, ingested_at, ingested_by)
- Multi-tenant RLS enforced at DB level
- ACID guarantees (transactional integrity)

**Properties** (SHOULD):
- Event sourcing pattern for state changes
- Cryptographic audit trail (event hash chains)

**Properties** (MAY):
- Distributed ledger for cross-tenant verification

### 3.2 Canonical Memory

**Definition**: The validated, policy-aware view of SoR available to Reasoning and UX layers.

**What MUST be true**:
- Canonical Memory = SoR filtered by Policy Layer
- Every read filtered by `check_resource_access(user_id, resource_id, required_level)`
- Department/workspace scoping enforced
- Shell vs Content visibility enforced

**What MUST NOT happen**:
- Reasoning Layer bypassing Policy Layer (direct SoR reads prohibited)
- UX Layer caching unfiltered SoR (policy bypass vector)
- Cross-tenant data leakage via Canonical Memory

### 3.3 Indexes (NOT Truth)

**Definition**: Derived structures optimized for retrieval, NOT source of truth.

**Types**:

| Index Type | Technology Examples | Use Case | Rebuild Source |
|------------|-------------------|----------|----------------|
| **Vector Store** | pgvector, Qdrant, Pinecone, OpenSearch | Semantic search, RAG retrieval | SoR entities + embeddings pipeline |
| **Full-Text Search** | PostgreSQL FTS, ElasticSearch, Typesense | Keyword search, faceted filtering | SoR text fields |
| **Graph Index** | Neo4j, AgensGraph, pg_graph | Relationship traversal, "find connected entities" | SoR `entity_relationships` table |

**Critical Rules** (MUST):

1. **Indexes are expendable**: Can be dropped and rebuilt from SoR at any time
2. **Indexes have NO provenance**: Vector metadata links to SoR chunk_id, NOT standalone
3. **Indexes are NOT policy-aware**: Filtering happens AFTER retrieval (EvidencePack step)
4. **Indexes are tenant-isolated**: Vector namespace per company_id

**Anti-Hallucination Rule** (MUST):
> Every retrieved chunk from an Index MUST be validated against SoR before being used in Reasoning.
> If SoR entity deleted/updated, Index chunk is INVALID (stale).

**Rebuild Strategy** (SHOULD):
- Blue-green index deployment (build v2 while v1 serves traffic)
- Versioned embeddings (model change triggers full reindex)
- Incremental upsert for new entities (event trigger)

---

## 4. Working Memory (Run-time State)

### 4.1 Definition

**Working Memory**: Ephemeral state required for agent execution, NOT part of Canonical Memory.

**Examples**:
- Agent checkpoint: "SalesSpecialist analyzed 47 emails, confidence 0.82"
- Tool cache: "LLM called `calculateROI()`, result cached for 5 minutes"
- Draft proposal: "Specialist proposes updating Case status to 'AT_RISK' (awaiting approval)"

**Storage** (SHOULD):
- Redis/Memcached for TTL-based eviction
- Separate DB schema `working_memory.*` (if persistent)
- Key prefix per agent run: `agent:{run_id}:checkpoint:{step_id}`

### 4.2 TTL & Retention Policy

| Memory Type | TTL | Justification |
|-------------|-----|---------------|
| **Agent Checkpoint** | 24 hours | Allows resume of failed runs, expired after day |
| **Tool Cache** | 5-60 minutes | LLM tool results (e.g., API calls) |
| **Draft Proposal** | 7 days | User has time to approve/reject |
| **Session Context** | 30 minutes | Conversational UI state |

**Cleanup Policy** (MUST):
- Automated eviction via TTL (no manual cleanup)
- Graceful degradation: If Working Memory lost, agent re-computes (expensive but safe)

### 4.3 Size Limits

**Per-Run Limits** (SHOULD):
- Max checkpoint size: 1 MB per step
- Max tool cache: 10 MB per run
- Max draft proposals: 100 per specialist per day

**Enforcement**:
- Pre-write size check (reject if > limit)
- LRU eviction if total Working Memory > threshold

---

## 5. Anti-Refactor Rules

### 5.1 Ontology Stability

**MUST NOT**:
- Create new Memory Types beyond Big-5 (Communication Signal, Interaction Event, Commitment Signal, Knowledge Artifact, Temporal Context)
- Create new World Entities beyond MVP-4 (Person, Organization, Case, Program) without WIT update
- Rename core tables (`entities`, `entity_relationships`, `universal_timelines`) without migration path

**MUST**:
- Extend via metadata JSONB fields (e.g., `entity.metadata->>'custom_field'`)
- Use Entity Type enum (e.g., `entity_type: 'PERSON' | 'ORGANIZATION'`)
- Version schema migrations (`20260104_v2_add_entity_tags.sql`)

### 5.2 Index Immutability

**MUST NOT**:
- Store canonical state in Vector Store (only derived embeddings)
- Use Index as source of truth for any business logic
- Skip SoR validation before using retrieved chunks

**MUST**:
- Document embedding model version in index metadata
- Store chunk provenance: `{ chunk_id, source_entity_id, source_hash, embedding_model: 'text-embedding-3-large' }`
- Rebuild index if embedding model changes

### 5.3 Policy Layer Non-Bypassable

**MUST NOT**:
- Direct DB queries from Reasoning Layer (enforce service layer)
- Cache policy decisions longer than 5 minutes (stale permissions)
- Return unfiltered SoR data to UX Layer

**MUST**:
- All reads via `MemoryService.query()` → applies Policy Layer
- Re-check permissions on every retrieval (no client-side caching of permissions)
- Audit log all policy denials (security monitoring)

---

## 6. Anti-Hallucination Rules

### 6.1 EvidencePack Requirement

**MUST**: Every claim from Reasoning Layer MUST include EvidencePack.

**EvidencePack Structure**:
```typescript
interface EvidencePack {
  claim: string; // "Case #123 is at risk"
  confidence: number; // 0.0 - 1.0
  sources: SourceRef[]; // Links to SoR entities
  inference_used: boolean; // TRUE if LLM-derived
  reasoning_trace_id: string; // Link to specialist_trace_logs
}

interface SourceRef {
  source_entity_id: string; // UUID of SoR entity
  source_type: 'EVENT' | 'SIGNAL' | 'ARTIFACT'; // From Big-5
  source_hash: string; // SHA-256 of content at time of retrieval
  chunk_locator?: string; // If chunked: 'page 3, para 2'
  retrieved_at: string; // ISO timestamp
}
```

**Validation** (MUST):
- Before Reasoning Layer writes to Canonical Memory, validate all `SourceRef.source_hash` matches current SoR
- If hash mismatch → reject write (stale evidence)
- If `inference_used: true` → require human approval (no auto-commit)

### 6.2 Inference Marking

**MUST**: All LLM-generated content marked with `inference: true`.

**Examples**:
```json
{
  "entity_id": "case-123",
  "proposed_status": "AT_RISK",
  "inference": true,
  "confidence": 0.87,
  "approved_by": null // MUST be human UUID before writing to SoR
}
```

**MUST NOT**:
- Auto-commit high-confidence inferences (confidence > 0.9 does NOT bypass approval)
- Mix inferred data with canonical data in same field

**SHOULD**:
- Store inferences in separate table (`entity_inferences`) with FK to `entities`
- UI shows "AI-suggested" badge for unapproved inferences

### 6.3 Hallucination Detection

**MUST** (at retrieval time):
- Check SoR entity exists: `SELECT id FROM entities WHERE id = {retrieved_chunk.source_entity_id}`
- Check SoR entity not soft-deleted: `WHERE deleted_at IS NULL`
- Check content hash matches: `WHERE content_hash = {retrieved_chunk.source_hash}`

**If any check fails**:
- Mark chunk as `STALE` in vector index metadata
- Exclude from EvidencePack
- Log hallucination event: `{ chunk_id, reason: 'source_deleted', detected_at }`

---

## 7. Multi-Tenant Isolation

### 7.1 Tenant Scoping (MUST)

**All SoR tables MUST have**:
```sql
company_id UUID NOT NULL REFERENCES companies(id),
department_id UUID REFERENCES departments(id), -- Optional for dept-scoped
```

**All Indexes MUST namespace by tenant**:
- Vector Store: Collection per `company_id` (e.g., `vito_company_abc123`)
- Full-Text Search: Partition by `company_id`
- Graph Index: Separate graph per `company_id`

**RLS Enforcement** (MUST):
```sql
CREATE POLICY tenant_isolation ON entities
  FOR ALL USING (
    company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())
  );
```

### 7.2 Cross-Tenant Queries (PROHIBITED)

**MUST NOT**:
- Join across `company_id` boundaries
- Aggregate metrics across tenants (security violation)
- Share vector embeddings across tenants (data leakage)

**MAY** (with explicit consent):
- Tenant exports own data for migration
- Platform-level analytics (aggregated, anonymized, opt-in only)

---

## 8. Memory Write Policy (Preview)

**Note**: Full specification in `FIT-MEMORY-WRITES-001.md`.

### 8.1 Write Sources

| Source | Policy | Approval Required |
|--------|--------|-------------------|
| **Human User** | Direct write (validated) | No (user owns data) |
| **External API** | Webhook → Validation Service → SoR | No (if signature valid) |
| **Reasoning Layer** | Proposes write → Policy Gate → SoR | **YES** (if inference_used: true) |
| **UX Layer** | Forbidden (use service layer) | N/A |

### 8.2 Policy Gates

**Pre-Write Validations** (MUST):
1. Schema validation (matches entity type)
2. Permission check (`check_resource_access(user, resource, 'EDIT')`)
3. Provenance completeness (source_id, source_hash present)
4. No hallucination (EvidencePack validates)
5. Inference approval (if `inference: true`)

**If any gate fails**: Write rejected, error logged, user/agent notified.

---

## 9. Vendor Agnostic Design

### 9.1 Abstraction Interfaces

**Vector Store Interface** (MUST implement):
```typescript
interface IVectorStore {
  upsert(chunks: EmbeddedChunk[], tenant_id: string): Promise<void>;
  search(query_embedding: number[], tenant_id: string, top_k: number): Promise<ChunkMatch[]>;
  delete(chunk_ids: string[], tenant_id: string): Promise<void>;
  rebuild(tenant_id: string): Promise<void>;
}
```

**Supported Implementations**:
- `PgVectorStore` (PostgreSQL pgvector extension)
- `QdrantStore` (Qdrant cloud/on-prem)
- `OpenSearchStore` (AWS OpenSearch)

**Switching Cost** (SHOULD be low):
- Config change in `memory-plane.config.ts`
- Rebuild index (automated script)
- Zero code changes in Reasoning Layer

### 9.2 Configuration-Driven

**Example Config**:
```typescript
// memory-plane.config.ts
export const memoryPlaneConfig = {
  sor: {
    type: 'postgresql',
    connection: process.env.DATABASE_URL,
  },
  vectorStore: {
    provider: 'pgvector', // 'qdrant' | 'opensearch'
    config: {
      table: 'embeddings',
      dimension: 1536, // text-embedding-3-large
    },
  },
  workingMemory: {
    provider: 'redis',
    ttl: {
      agentCheckpoint: 86400, // 24h
      toolCache: 300, // 5min
    },
  },
};
```

---

## 10. Validation Checklist (for DBA-AI / Agent Architects)

### 10.1 SoR Compliance

- [ ] All canonical tables have `company_id` column
- [ ] RLS policies enforced on all canonical tables
- [ ] Event sourcing pattern used for state changes (append-only)
- [ ] Provenance fields present: `source_id`, `source_hash`, `ingested_at`, `ingested_by`
- [ ] No hard deletes (soft delete via `deleted_at` timestamp)

### 10.2 Index Hygiene

- [ ] Vector Store namespaced by `company_id`
- [ ] Chunk metadata includes `source_entity_id`, `source_hash`, `embedding_model`
- [ ] Rebuild script tested (can recreate index from SoR)
- [ ] Stale chunk detection implemented (hash validation)

### 10.3 Working Memory Limits

- [ ] TTL configured for all Working Memory types
- [ ] Size limits enforced (reject oversized writes)
- [ ] Cleanup automation tested (no manual intervention required)

### 10.4 Policy Enforcement

- [ ] All reads via service layer (no direct DB queries from Reasoning/UX)
- [ ] `check_resource_access()` called before every SoR read
- [ ] Audit log captures policy denials

### 10.5 Anti-Hallucination

- [ ] EvidencePack required for all Reasoning Layer writes
- [ ] Source hash validation before using retrieved chunks
- [ ] Inference marked with `inference: true`
- [ ] Inferred writes require human approval

---

## 11. Related FITs

- **FIT-RAG-PIPELINE-001**: RAG ingestion, chunking, embedding, retrieval, reranking
- **FIT-WORKING-MEMORY-001**: Working Memory retention, TTL, cleanup
- **FIT-MEMORY-WRITES-001**: Memory Write Policy gates and approval flow
- **FIT-RAG-EVAL-001**: RAG evaluation metrics and regression suite

---

## 12. Architectural Invariants

1. **Memory Plane is truth substrate**: Reasoning reads, UX projects, neither modifies without Policy Gate.
2. **Indexes are NOT truth**: Vector Store/Search are expendable accelerators.
3. **Provenance is mandatory**: Every SoR entity traceable to source (no orphans).
4. **Inference is marked**: LLM outputs NEVER auto-commit to Canonical Memory.
5. **Multi-tenant isolation**: RLS + namespace isolation enforced at every layer.
6. **Vendor agnostic**: Swap pgvector ↔ Qdrant ↔ OpenSearch via config (no code change).

---

**END OF CANON-MEM-PLANE-001**
