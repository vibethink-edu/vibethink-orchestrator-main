# FIT-RAG-PIPELINE-001: RAG Pipeline Implementation

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-MEM-PLANE-001
**Related WITs**: WIT-003, WIT-005

---

## 1. Purpose

This FIT validates that the **RAG (Retrieval-Augmented Generation) Pipeline** is correctly implemented with:
- Idempotent ingestion from SoR to Vector Store
- Provenance tracking for every chunk
- Semantic retrieval with EvidencePack generation
- Reranking and stale chunk detection
- Versioned embeddings (model upgrade path)

**Pass Criteria**: All 8 stages execute without data loss or hallucination vectors.

---

## 2. RAG Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: INGEST                                                │
│  Source: SoR entities (entities, knowledge_artifacts, events)   │
│  Trigger: Event (new entity) OR Batch (rebuild index)           │
│  Output: Raw entity JSON                                        │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: NORMALIZE                                             │
│  Transform: Extract text fields, clean HTML, parse metadata     │
│  Dedupe: Skip if entity.content_hash == existing chunk hash     │
│  Output: Normalized text + metadata                             │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: CHUNK                                                 │
│  Strategy: Semantic chunking (sentence boundaries, 512 tokens)  │
│  Overlap: 50 tokens (preserve context across chunks)            │
│  Metadata: chunk_id, source_entity_id, chunk_index, locator     │
│  Output: Chunk[] with provenance                                │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: EMBED                                                 │
│  Model: text-embedding-3-large (1536 dim) [configurable]        │
│  Batch: 100 chunks per API call (rate limit aware)              │
│  Metadata: embedding_model, embedding_version, embedded_at      │
│  Output: EmbeddedChunk[] (chunk + vector)                       │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: UPSERT                                                │
│  Target: Vector Store (pgvector/Qdrant/OpenSearch)              │
│  Idempotency: Upsert by chunk_id (same chunk → overwrite)       │
│  Namespace: company_id (tenant isolation)                       │
│  Output: Vector index updated                                   │
└─────────────────────────────────────────────────────────────────┘

                    [RETRIEVAL PHASE]

┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6: RETRIEVE                                              │
│  Input: User query → embed → query_vector                       │
│  Search: Vector similarity (cosine) top_k=20 candidates         │
│  Filter: company_id match (tenant isolation)                    │
│  Output: ChunkMatch[] with similarity scores                    │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 7: RERANK                                                │
│  Model: Cross-encoder (query-chunk relevance)                   │
│  Dedupe: If multiple chunks from same entity, keep best         │
│  Threshold: Discard if rerank_score < 0.5                       │
│  Output: Top 5 chunks (ranked by relevance)                     │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 8: EVIDENCE PACK                                         │
│  Validation: Check source_entity exists in SoR (not deleted)    │
│  Validation: Check content_hash matches (not stale)             │
│  Format: EvidencePack with SourceRef[] for each chunk           │
│  Output: Validated chunks + provenance chain                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Stage Specifications

### 3.1 STAGE 1: INGEST

**Trigger Events**:
- `entity.created` event (real-time ingestion)
- `entity.updated` event (content changed)
- `rebuild_index` command (full reindex)

**SQL Query (Example)**:
```sql
-- Ingest all Knowledge Artifacts for tenant
SELECT
  id AS source_entity_id,
  entity_type,
  content,
  metadata,
  content_hash,
  updated_at
FROM entities
WHERE company_id = $1
  AND entity_type = 'KNOWLEDGE_ARTIFACT'
  AND deleted_at IS NULL
ORDER BY updated_at DESC;
```

**Idempotency Check**:
```typescript
// Skip if already indexed with same hash
const existingChunk = await vectorStore.getBySourceHash(
  entity.id,
  entity.content_hash
);
if (existingChunk) {
  logger.info('Entity already indexed, skipping', { entity_id: entity.id });
  return;
}
```

**MUST**:
- Query only tenant's data (`company_id = $1`)
- Exclude soft-deleted entities (`deleted_at IS NULL`)
- Track last ingestion timestamp (resume on failure)

---

### 3.2 STAGE 2: NORMALIZE

**Text Extraction**:
```typescript
function normalizeEntity(entity: Entity): NormalizedText {
  let text = '';

  // Extract based on entity type
  switch (entity.entity_type) {
    case 'KNOWLEDGE_ARTIFACT':
      text = extractFromArtifact(entity.content, entity.metadata.format);
      break;
    case 'COMMUNICATION_SIGNAL':
      text = extractFromSignal(entity.content, entity.metadata.medium);
      break;
    case 'INTERACTION_EVENT':
      text = extractFromEvent(entity.metadata); // Description, notes
      break;
  }

  // Clean HTML, normalize whitespace
  text = stripHtml(text);
  text = normalizeWhitespace(text);

  return {
    text,
    source_entity_id: entity.id,
    source_hash: entity.content_hash,
    metadata: {
      entity_type: entity.entity_type,
      title: entity.name,
      created_at: entity.created_at,
    },
  };
}
```

**Format Handlers**:
- `extractFromArtifact()`: PDF → text (pdfplumber), Spreadsheet → CSV, Markdown → text
- `extractFromSignal()`: Email → body + subject, Chat → message text
- `extractFromEvent()`: Meeting → agenda + notes

**MUST**:
- Preserve sentence boundaries (don't split mid-sentence)
- Remove PII if configured (email addresses, phone numbers)
- Record extraction metadata (e.g., `extracted_from: 'pdf_page_3'`)

---

### 3.3 STAGE 3: CHUNK

**Chunking Strategy** (Semantic Boundaries):

```typescript
interface ChunkConfig {
  max_tokens: 512; // Target chunk size
  overlap_tokens: 50; // Context preservation
  strategy: 'sentence' | 'paragraph' | 'sliding_window';
}

function chunkText(normalizedText: NormalizedText, config: ChunkConfig): Chunk[] {
  const chunks: Chunk[] = [];
  const sentences = splitIntoSentences(normalizedText.text);

  let currentChunk = '';
  let currentTokens = 0;
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const sentenceTokens = countTokens(sentence);

    if (currentTokens + sentenceTokens > config.max_tokens && currentChunk) {
      // Save current chunk
      chunks.push({
        chunk_id: `${normalizedText.source_entity_id}:chunk:${chunkIndex}`,
        source_entity_id: normalizedText.source_entity_id,
        source_hash: normalizedText.source_hash,
        chunk_index: chunkIndex,
        content: currentChunk.trim(),
        locator: `chunk ${chunkIndex}`, // Human-readable reference
        metadata: normalizedText.metadata,
      });

      // Start new chunk with overlap
      const overlapText = getLastNTokens(currentChunk, config.overlap_tokens);
      currentChunk = overlapText + ' ' + sentence;
      currentTokens = countTokens(currentChunk);
      chunkIndex++;
    } else {
      currentChunk += ' ' + sentence;
      currentTokens += sentenceTokens;
    }
  }

  // Save final chunk
  if (currentChunk) {
    chunks.push({
      chunk_id: `${normalizedText.source_entity_id}:chunk:${chunkIndex}`,
      source_entity_id: normalizedText.source_entity_id,
      source_hash: normalizedText.source_hash,
      chunk_index: chunkIndex,
      content: currentChunk.trim(),
      locator: `chunk ${chunkIndex}`,
      metadata: normalizedText.metadata,
    });
  }

  return chunks;
}
```

**Chunk Metadata** (MUST include):
```typescript
interface Chunk {
  chunk_id: string; // Unique, stable ID
  source_entity_id: string; // FK to SoR entities.id
  source_hash: string; // SHA-256 of source content
  chunk_index: number; // 0-based position in document
  content: string; // Actual chunk text
  locator: string; // "page 3, para 2" or "chunk 5"
  metadata: {
    entity_type: string;
    title: string;
    created_at: string;
    // ... custom fields
  };
}
```

**MUST**:
- Generate deterministic `chunk_id` (same content → same ID)
- Preserve enough context for standalone comprehension
- Track chunk position (locator) for citation

---

### 3.4 STAGE 4: EMBED

**Embedding Model Config**:
```typescript
interface EmbeddingConfig {
  model: 'text-embedding-3-large' | 'text-embedding-3-small';
  dimension: 1536 | 512; // Match model output
  batch_size: 100; // API rate limit
  retry_config: {
    max_retries: 3;
    backoff_ms: 1000;
  };
}

async function embedChunks(chunks: Chunk[], config: EmbeddingConfig): Promise<EmbeddedChunk[]> {
  const batches = chunkArray(chunks, config.batch_size);
  const embedded: EmbeddedChunk[] = [];

  for (const batch of batches) {
    const texts = batch.map(c => c.content);

    // Call embedding API (OpenAI, Cohere, etc.)
    const response = await retryWithBackoff(() =>
      embeddingClient.embed({ model: config.model, input: texts })
    );

    for (let i = 0; i < batch.length; i++) {
      embedded.push({
        ...batch[i],
        embedding: response.embeddings[i],
        embedding_model: config.model,
        embedding_version: '20260104', // Track model version
        embedded_at: new Date().toISOString(),
      });
    }

    // Rate limiting
    await sleep(100);
  }

  return embedded;
}
```

**Versioning** (MUST):
- Store `embedding_model` and `embedding_version` with each chunk
- If model changes → trigger full reindex (embeddings incomparable across models)
- Track version in `vector_index_metadata` table:
```sql
CREATE TABLE vector_index_metadata (
  company_id UUID PRIMARY KEY,
  embedding_model VARCHAR(100) NOT NULL,
  embedding_version VARCHAR(50) NOT NULL,
  last_reindex_at TIMESTAMPTZ,
  total_chunks INTEGER
);
```

---

### 3.5 STAGE 5: UPSERT

**Vector Store Upsert** (Idempotent):
```typescript
async function upsertToVectorStore(
  embeddedChunks: EmbeddedChunk[],
  tenantId: string
): Promise<void> {
  // Namespace by tenant
  const namespace = `company_${tenantId}`;

  const vectors = embeddedChunks.map(chunk => ({
    id: chunk.chunk_id, // Stable ID (upsert overwrites if exists)
    vector: chunk.embedding,
    metadata: {
      source_entity_id: chunk.source_entity_id,
      source_hash: chunk.source_hash,
      chunk_index: chunk.chunk_index,
      locator: chunk.locator,
      entity_type: chunk.metadata.entity_type,
      title: chunk.metadata.title,
      created_at: chunk.metadata.created_at,
      embedding_model: chunk.embedding_model,
      embedding_version: chunk.embedding_version,
      indexed_at: chunk.embedded_at,
    },
  }));

  // Upsert (insert or update if ID exists)
  await vectorStore.upsert(namespace, vectors);

  logger.info('Upserted chunks to vector store', {
    tenant_id: tenantId,
    chunk_count: vectors.length,
  });
}
```

**Tenant Isolation** (MUST):
- Each `company_id` has separate vector collection/namespace
- Cross-tenant queries MUST NOT be possible
- Validate namespace matches current user's tenant before retrieval

**Idempotency** (MUST):
- Same `chunk_id` upserted twice → latest wins (no duplicates)
- If entity content unchanged (`content_hash` matches) → skip upsert

---

### 3.6 STAGE 6: RETRIEVE

**Semantic Search**:
```typescript
async function retrieveChunks(
  query: string,
  tenantId: string,
  topK: number = 20
): Promise<ChunkMatch[]> {
  // Embed query
  const queryEmbedding = await embeddingClient.embed({
    model: 'text-embedding-3-large',
    input: query,
  });

  // Search in tenant namespace
  const namespace = `company_${tenantId}`;
  const results = await vectorStore.search(namespace, queryEmbedding.vector, topK);

  return results.map(r => ({
    chunk_id: r.id,
    source_entity_id: r.metadata.source_entity_id,
    source_hash: r.metadata.source_hash,
    content: r.metadata.content, // If stored in metadata
    locator: r.metadata.locator,
    similarity_score: r.score, // Cosine similarity
    metadata: r.metadata,
  }));
}
```

**MUST**:
- Query only user's tenant namespace (no cross-tenant leakage)
- Return top_k candidates for reranking (20-50 typical)
- Include similarity score for debugging

---

### 3.7 STAGE 7: RERANK

**Cross-Encoder Reranking**:
```typescript
async function rerankChunks(
  query: string,
  candidates: ChunkMatch[],
  topN: number = 5
): Promise<RankedChunk[]> {
  // Cross-encoder scores query-chunk pairs
  const pairs = candidates.map(c => ({ query, passage: c.content }));
  const scores = await rerankModel.score(pairs);

  // Combine similarity + rerank score
  const ranked = candidates.map((c, i) => ({
    ...c,
    rerank_score: scores[i],
    combined_score: 0.5 * c.similarity_score + 0.5 * scores[i], // Weighted
  }));

  // Sort by combined score, filter threshold
  const filtered = ranked
    .filter(c => c.rerank_score > 0.5) // Relevance threshold
    .sort((a, b) => b.combined_score - a.combined_score)
    .slice(0, topN);

  return filtered;
}
```

**Deduplication** (SHOULD):
```typescript
// If multiple chunks from same entity, keep highest scoring
function deduplicateByEntity(ranked: RankedChunk[]): RankedChunk[] {
  const entityMap = new Map<string, RankedChunk>();

  for (const chunk of ranked) {
    const existing = entityMap.get(chunk.source_entity_id);
    if (!existing || chunk.combined_score > existing.combined_score) {
      entityMap.set(chunk.source_entity_id, chunk);
    }
  }

  return Array.from(entityMap.values());
}
```

---

### 3.8 STAGE 8: EVIDENCE PACK

**Validation Against SoR** (MUST):
```typescript
async function buildEvidencePack(
  rankedChunks: RankedChunk[],
  tenantId: string
): Promise<EvidencePack> {
  const sourceRefs: SourceRef[] = [];
  const validChunks: RankedChunk[] = [];

  for (const chunk of rankedChunks) {
    // Validate entity exists and not deleted
    const entity = await db.query(
      `SELECT id, content_hash, entity_type, deleted_at
       FROM entities
       WHERE id = $1 AND company_id = $2`,
      [chunk.source_entity_id, tenantId]
    );

    if (!entity || entity.deleted_at) {
      logger.warn('Stale chunk detected (entity deleted)', { chunk_id: chunk.chunk_id });
      continue; // Skip deleted/missing entities
    }

    // Validate content hash (detect updates)
    if (entity.content_hash !== chunk.source_hash) {
      logger.warn('Stale chunk detected (content changed)', { chunk_id: chunk.chunk_id });
      // OPTIONAL: Auto-reindex this entity
      await triggerReindex(entity.id);
      continue;
    }

    // Valid chunk → add to evidence
    validChunks.push(chunk);
    sourceRefs.push({
      source_entity_id: chunk.source_entity_id,
      source_type: entity.entity_type,
      source_hash: chunk.source_hash,
      chunk_locator: chunk.locator,
      retrieved_at: new Date().toISOString(),
      similarity_score: chunk.similarity_score,
      rerank_score: chunk.rerank_score,
    });
  }

  return {
    query: rankedChunks[0]?.query || '', // Original query
    chunks: validChunks,
    sources: sourceRefs,
    inference_used: false, // Mark true if LLM used later
    retrieved_at: new Date().toISOString(),
  };
}
```

**MUST**:
- Validate every chunk against SoR before use
- Exclude stale chunks (deleted entities or changed content)
- Track retrieval timestamp (evidence age matters)

**SHOULD**:
- Auto-trigger reindex for stale chunks (background job)
- Log stale chunk rate (metric for index freshness)

---

## 4. Reindex Strategy

### 4.1 Triggers for Reindex

| Event | Scope | Strategy |
|-------|-------|----------|
| **Entity Created** | Single entity | Incremental (upsert new chunks) |
| **Entity Updated** | Single entity | Delete old chunks + upsert new |
| **Entity Deleted** | Single entity | Delete chunks (soft delete in index) |
| **Embedding Model Change** | Full tenant | Blue-green rebuild (v2 while v1 serves) |
| **Scheduled Maintenance** | Full tenant | Full rebuild (monthly, detect drift) |

### 4.2 Blue-Green Reindex (Model Upgrade)

```typescript
async function blueGreenReindex(tenantId: string, newModel: string): Promise<void> {
  const oldNamespace = `company_${tenantId}`;
  const newNamespace = `company_${tenantId}_v2`;

  // Step 1: Build new index in parallel
  logger.info('Starting blue-green reindex', { tenant_id: tenantId, new_model: newModel });

  const entities = await fetchAllEntities(tenantId);
  for (const entity of entities) {
    const chunks = await ingestAndChunk(entity);
    const embedded = await embedChunks(chunks, { model: newModel });
    await upsertToVectorStore(embedded, tenantId, newNamespace); // Use v2 namespace
  }

  // Step 2: Atomic cutover (update namespace pointer)
  await db.query(
    `UPDATE vector_index_metadata
     SET embedding_model = $1,
         embedding_version = $2,
         active_namespace = $3,
         last_reindex_at = NOW()
     WHERE company_id = $4`,
    [newModel, '20260104', newNamespace, tenantId]
  );

  // Step 3: Delete old index (after grace period)
  setTimeout(() => deleteNamespace(oldNamespace), 86400000); // 24h delay

  logger.info('Blue-green reindex complete', { tenant_id: tenantId });
}
```

### 4.3 Incremental Upsert (Real-time)

**Event Handler**:
```typescript
// Subscribe to entity change events
supabase
  .channel(`entity_changes_${tenantId}`)
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'entities', filter: `company_id=eq.${tenantId}` },
    async (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        await incrementalReindex(payload.new);
      } else if (payload.eventType === 'DELETE') {
        await deleteChunks(payload.old.id, tenantId);
      }
    }
  )
  .subscribe();
```

---

## 5. Validation Tests (Pass Criteria)

### 5.1 Test 1: Idempotency

**Setup**:
1. Ingest entity A (10 chunks)
2. Ingest entity A again (same content)

**Expected**:
- Vector store has exactly 10 chunks (not 20)
- `chunk_id` collision → upsert overwrites

**SQL Verification**:
```sql
-- Count chunks for entity
SELECT COUNT(*) FROM vector_metadata WHERE source_entity_id = 'entity-A';
-- Expected: 10 (not 20)
```

### 5.2 Test 2: Stale Chunk Detection

**Setup**:
1. Ingest entity B
2. Update entity B content (new `content_hash`)
3. Retrieve chunks for query matching entity B

**Expected**:
- Stage 8 detects hash mismatch
- Stale chunks excluded from EvidencePack
- Auto-reindex triggered

**Code Verification**:
```typescript
const evidencePack = await buildEvidencePack(chunks, tenantId);
// Should have 0 sources (all stale)
assert(evidencePack.sources.length === 0);
```

### 5.3 Test 3: Tenant Isolation

**Setup**:
1. Ingest entity C for tenant 1
2. Query as user from tenant 2

**Expected**:
- Zero results (cross-tenant leak prevented)

**SQL Verification**:
```sql
-- Attempt cross-tenant query
SELECT * FROM vector_search('query', 'company_tenant2', 10);
-- Should return 0 rows even if entity C matches query
```

### 5.4 Test 4: Provenance Chain

**Setup**:
1. Ingest entity D
2. Retrieve chunk X from entity D

**Expected**:
- Chunk metadata includes `source_entity_id`, `source_hash`, `locator`
- Can trace chunk → entity → original source

**Code Verification**:
```typescript
const chunk = chunks[0];
const entity = await db.query('SELECT * FROM entities WHERE id = $1', [chunk.source_entity_id]);
assert(entity.content_hash === chunk.source_hash);
```

### 5.5 Test 5: Embedding Versioning

**Setup**:
1. Index tenant with model v1
2. Change model to v2
3. Trigger reindex

**Expected**:
- All chunks have `embedding_model: v2`
- Old v1 namespace deleted after grace period

**SQL Verification**:
```sql
SELECT embedding_model, COUNT(*) FROM vector_metadata
WHERE company_id = 'tenant-X'
GROUP BY embedding_model;
-- Expected: All rows have v2, none have v1
```

---

## 6. Performance Benchmarks

### 6.1 Ingestion Throughput

**Target**:
- 1000 entities/minute (single tenant)
- 100K chunks/hour (full reindex)

**Measurement**:
```typescript
const start = Date.now();
await ingestEntities(entities, tenantId);
const elapsed = Date.now() - start;
const throughput = entities.length / (elapsed / 60000); // entities/min
logger.info('Ingestion throughput', { throughput });
```

### 6.2 Retrieval Latency

**Target**:
- p50 < 200ms (query → ranked chunks)
- p95 < 500ms
- p99 < 1000ms

**Measurement**:
```typescript
const latencies: number[] = [];
for (let i = 0; i < 100; i++) {
  const start = Date.now();
  await retrieveAndRerank(query, tenantId);
  latencies.push(Date.now() - start);
}
const p95 = percentile(latencies, 0.95);
assert(p95 < 500);
```

---

## 7. Regression Suite (for Model/Chunking Changes)

### 7.1 Golden Dataset

**Setup**:
- 50 representative entities (diverse types, lengths)
- 20 test queries with known relevant entities
- Expected top-5 results per query (human-labeled)

**Storage**:
```json
// rag-golden-dataset.json
{
  "queries": [
    {
      "id": "q1",
      "text": "What is our refund policy?",
      "expected_entities": ["entity-refund-policy", "entity-terms-of-service"],
      "expected_top_chunk": "chunk-refund-policy:0"
    }
  ],
  "entities": [ ... ]
}
```

### 7.2 Evaluation Metrics

**Recall@5**:
```typescript
function recallAt5(results: ChunkMatch[], expectedEntities: string[]): number {
  const retrievedEntities = new Set(results.slice(0, 5).map(c => c.source_entity_id));
  const relevant = expectedEntities.filter(e => retrievedEntities.has(e));
  return relevant.length / expectedEntities.length;
}
```

**MRR (Mean Reciprocal Rank)**:
```typescript
function mrr(results: ChunkMatch[], expectedChunk: string): number {
  const rank = results.findIndex(c => c.chunk_id === expectedChunk) + 1;
  return rank > 0 ? 1 / rank : 0;
}
```

**NDCG@5** (Normalized Discounted Cumulative Gain):
```typescript
// Implementation per standard IR formula
```

### 7.3 Regression Gate

**Before deploying chunking/embedding changes**:
```bash
npm run rag:eval
# Expected:
# Recall@5: >= 0.80 (80% of relevant docs in top-5)
# MRR: >= 0.70
# NDCG@5: >= 0.75
```

**If metrics degrade**:
- Block deployment
- Investigate root cause (chunking too aggressive? Model mismatch?)
- Tune parameters, re-run eval

---

## 8. Checklist (FIT Pass Criteria)

### Infrastructure

- [ ] Vector Store configured (pgvector/Qdrant/OpenSearch)
- [ ] Embedding API credentials set
- [ ] Reranking model deployed
- [ ] `vector_index_metadata` table exists
- [ ] Event triggers configured (entity CRUD → reindex)

### Pipeline Stages

- [ ] Stage 1 (Ingest): Fetches entities with tenant isolation
- [ ] Stage 2 (Normalize): Extracts text, cleans HTML
- [ ] Stage 3 (Chunk): Semantic chunking with overlap
- [ ] Stage 4 (Embed): Versioned embeddings
- [ ] Stage 5 (Upsert): Idempotent, tenant-namespaced
- [ ] Stage 6 (Retrieve): Top-k semantic search
- [ ] Stage 7 (Rerank): Cross-encoder + threshold filter
- [ ] Stage 8 (EvidencePack): SoR validation, stale detection

### Validation

- [ ] Test 1 (Idempotency): PASS
- [ ] Test 2 (Stale Detection): PASS
- [ ] Test 3 (Tenant Isolation): PASS
- [ ] Test 4 (Provenance): PASS
- [ ] Test 5 (Versioning): PASS

### Performance

- [ ] Ingestion throughput >= 1000 entities/min
- [ ] Retrieval p95 latency <= 500ms

### Regression

- [ ] Golden dataset created (50 entities, 20 queries)
- [ ] Recall@5 >= 0.80
- [ ] MRR >= 0.70
- [ ] NDCG@5 >= 0.75

---

## 9. References

- CANON-MEM-PLANE-001: Memory Plane Architecture
- FIT-WORKING-MEMORY-001: Working Memory Specification
- FIT-MEMORY-WRITES-001: Memory Write Policy
- FIT-RAG-EVAL-001: RAG Evaluation Framework

---

**END OF FIT-RAG-PIPELINE-001**
