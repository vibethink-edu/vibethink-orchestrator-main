# FIT-RAG-EVAL-001: RAG Evaluation & Regression Framework

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-MEM-PLANE-001
**Related FITs**: FIT-RAG-PIPELINE-001

---

## 1. Purpose

This FIT establishes the **RAG Evaluation Framework** to:
- Measure retrieval quality (precision, recall, ranking)
- Detect regressions when changing chunking/embedding/reranking strategies
- Provide objective metrics for tuning RAG parameters
- Prevent degradation of specialist reasoning quality

**Pass Criteria**: Regression suite runs automatically on RAG changes, blocking deployment if metrics degrade below thresholds.

---

## 2. Evaluation Architecture

```
┌───────────────────────────────────────────────────────────┐
│  GOLDEN DATASET (Human-Labeled Ground Truth)              │
│  - 50-100 representative entities (diverse types/lengths) │
│  - 20-50 test queries (realistic user/specialist needs)   │
│  - Expected top-K results per query (relevance labels)    │
│  - Version-controlled (git)                               │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  RAG PIPELINE (System Under Test)                         │
│  - Ingest golden entities → chunk → embed → index         │
│  - Execute test queries → retrieve → rerank               │
│  - Return top-K chunks per query                          │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  EVALUATION METRICS                                       │
│  - Recall@K: % relevant docs in top-K                     │
│  - Precision@K: % top-K that are relevant                 │
│  - MRR: Mean Reciprocal Rank of first relevant doc        │
│  - NDCG@K: Normalized Discounted Cumulative Gain          │
│  - Latency: p50, p95, p99 retrieval times                 │
└───────────────────────────────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│  REGRESSION GATE                                          │
│  - Compare current metrics vs baseline                    │
│  - PASS: All metrics >= baseline thresholds               │
│  - FAIL: Block deployment, flag degradation               │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Golden Dataset Specification

### 3.1 Dataset Structure

**File**: `tests/rag-eval/golden-dataset.json`

```json
{
  "version": "1.0.0",
  "created_at": "2026-01-04",
  "description": "Golden dataset for RAG evaluation (hotel domain)",
  "entities": [
    {
      "entity_id": "entity-refund-policy",
      "entity_type": "KNOWLEDGE_ARTIFACT",
      "title": "Refund and Cancellation Policy",
      "content": "Our refund policy allows full refunds up to 48 hours before check-in. After that, 50% of the booking fee is retained. No-shows forfeit 100% of the payment. Special events and holidays may have different terms...",
      "metadata": {
        "format": "MARKDOWN",
        "category": "POLICY"
      },
      "tags": ["refund", "cancellation", "policy"]
    },
    {
      "entity_id": "entity-amenities-list",
      "entity_type": "KNOWLEDGE_ARTIFACT",
      "title": "Hotel Amenities",
      "content": "We offer complimentary WiFi, 24/7 room service, gym access, heated pool, spa, and free airport shuttle. Premium rooms include balcony access and minibar...",
      "metadata": {
        "format": "MARKDOWN",
        "category": "AMENITIES"
      },
      "tags": ["amenities", "services", "facilities"]
    }
    // ... 48+ more entities
  ],
  "queries": [
    {
      "query_id": "q001",
      "query_text": "What is the refund policy if I cancel my reservation?",
      "expected_results": {
        "relevant_entities": ["entity-refund-policy"],
        "top_1_chunk": "entity-refund-policy:chunk:0",
        "relevance_labels": {
          "entity-refund-policy": 3, // Highly relevant
          "entity-terms-of-service": 1 // Somewhat relevant
        }
      },
      "category": "POLICY_QUERY"
    },
    {
      "query_id": "q002",
      "query_text": "Do you have a swimming pool?",
      "expected_results": {
        "relevant_entities": ["entity-amenities-list"],
        "top_1_chunk": "entity-amenities-list:chunk:0",
        "relevance_labels": {
          "entity-amenities-list": 3
        }
      },
      "category": "AMENITY_QUERY"
    }
    // ... 18+ more queries
  ]
}
```

### 3.2 Golden Dataset Requirements

**Entity Coverage** (MUST):
- Diverse lengths: 100 words → 5000 words
- Diverse types: Knowledge Artifact, Communication Signal, Interaction Event
- Diverse formats: Markdown, plain text, structured data (JSON)
- Diverse domains: Policy, amenities, customer support, operational procedures

**Query Coverage** (MUST):
- Factual queries: "What is the check-in time?"
- Comparative queries: "What's the difference between Standard and Deluxe rooms?"
- Troubleshooting queries: "How do I reset my WiFi password?"
- Sentiment-based: "Why are guests complaining about noise?"

**Relevance Labels** (MUST):
- 0: Not relevant
- 1: Somewhat relevant (tangentially related)
- 2: Relevant (answers part of the query)
- 3: Highly relevant (directly answers query)

**Version Control** (MUST):
- Store dataset in git repository
- Tag versions: `golden-dataset-v1.0.0`
- Update when new query patterns emerge

---

## 4. Evaluation Metrics

### 4.1 Recall@K

**Definition**: Percentage of relevant documents retrieved in top-K results.

**Formula**:
```
Recall@K = (# relevant docs in top-K) / (total # relevant docs)
```

**Implementation**:
```typescript
function recallAtK(
  retrievedChunks: ChunkMatch[],
  relevantEntityIds: string[],
  k: number
): number {
  const topK = retrievedChunks.slice(0, k);
  const retrievedEntityIds = new Set(topK.map(c => c.source_entity_id));

  const relevantRetrieved = relevantEntityIds.filter(id => retrievedEntityIds.has(id));

  return relevantRetrieved.length / relevantEntityIds.length;
}
```

**Example**:
```typescript
// Query: "What is the refund policy?"
// Relevant entities: [entity-refund-policy, entity-terms-of-service]
// Top-5 retrieved: [entity-refund-policy, entity-amenities, entity-faq, ...]

// Recall@5 = 1/2 = 0.5 (retrieved 1 of 2 relevant docs)
```

**Target Threshold**: Recall@5 >= 0.80 (retrieve 80% of relevant docs)

---

### 4.2 Precision@K

**Definition**: Percentage of top-K results that are relevant.

**Formula**:
```
Precision@K = (# relevant docs in top-K) / K
```

**Implementation**:
```typescript
function precisionAtK(
  retrievedChunks: ChunkMatch[],
  relevanceLabels: Record<string, number>,
  k: number
): number {
  const topK = retrievedChunks.slice(0, k);

  const relevantCount = topK.filter(c => {
    const label = relevanceLabels[c.source_entity_id] || 0;
    return label >= 2; // Consider label >= 2 as "relevant"
  }).length;

  return relevantCount / k;
}
```

**Example**:
```typescript
// Top-5 retrieved: [refund-policy (label 3), amenities (label 0), faq (label 2), ...]
// Relevant: 2 out of 5
// Precision@5 = 2/5 = 0.4
```

**Target Threshold**: Precision@5 >= 0.60 (60% of top-5 are relevant)

---

### 4.3 MRR (Mean Reciprocal Rank)

**Definition**: Average of reciprocal ranks of the first relevant document across all queries.

**Formula**:
```
RR (per query) = 1 / rank_of_first_relevant_doc
MRR = Average(RR across all queries)
```

**Implementation**:
```typescript
function reciprocalRank(
  retrievedChunks: ChunkMatch[],
  relevantEntityIds: string[]
): number {
  for (let i = 0; i < retrievedChunks.length; i++) {
    if (relevantEntityIds.includes(retrievedChunks[i].source_entity_id)) {
      return 1 / (i + 1); // Rank is 1-indexed
    }
  }
  return 0; // No relevant doc found
}

function mrr(queries: QueryResult[]): number {
  const rrs = queries.map(q => reciprocalRank(q.retrieved, q.relevant_entities));
  return rrs.reduce((sum, rr) => sum + rr, 0) / rrs.length;
}
```

**Example**:
```typescript
// Query 1: First relevant doc at position 1 → RR = 1/1 = 1.0
// Query 2: First relevant doc at position 3 → RR = 1/3 = 0.33
// Query 3: First relevant doc at position 2 → RR = 1/2 = 0.5
// MRR = (1.0 + 0.33 + 0.5) / 3 = 0.61
```

**Target Threshold**: MRR >= 0.70 (first relevant doc typically in top-2)

---

### 4.4 NDCG@K (Normalized Discounted Cumulative Gain)

**Definition**: Measures ranking quality, considering relevance labels and position.

**Formula**:
```
DCG@K = Σ (rel_i / log2(i + 1)) for i in 1..K
IDCG@K = DCG@K for perfect ranking (highest relevance first)
NDCG@K = DCG@K / IDCG@K
```

**Implementation**:
```typescript
function ndcgAtK(
  retrievedChunks: ChunkMatch[],
  relevanceLabels: Record<string, number>,
  k: number
): number {
  const topK = retrievedChunks.slice(0, k);

  // Calculate DCG
  let dcg = 0;
  for (let i = 0; i < topK.length; i++) {
    const rel = relevanceLabels[topK[i].source_entity_id] || 0;
    dcg += rel / Math.log2(i + 2); // i+2 because log2(1) = 0
  }

  // Calculate IDCG (perfect ranking)
  const sortedLabels = Object.values(relevanceLabels).sort((a, b) => b - a).slice(0, k);
  let idcg = 0;
  for (let i = 0; i < sortedLabels.length; i++) {
    idcg += sortedLabels[i] / Math.log2(i + 2);
  }

  return idcg === 0 ? 0 : dcg / idcg;
}
```

**Example**:
```typescript
// Retrieved: [entity-A (label 3), entity-B (label 1), entity-C (label 2)]
// DCG = 3/log2(2) + 1/log2(3) + 2/log2(4) = 3 + 0.63 + 1 = 4.63
// IDCG (perfect: [3, 2, 1]) = 3/log2(2) + 2/log2(3) + 1/log2(4) = 3 + 1.26 + 0.5 = 4.76
// NDCG = 4.63 / 4.76 = 0.97
```

**Target Threshold**: NDCG@5 >= 0.75 (good ranking quality)

---

### 4.5 Latency Metrics

**Definition**: Distribution of retrieval times (query → ranked results).

**Metrics**:
- p50 (median latency)
- p95 (95th percentile)
- p99 (99th percentile)

**Implementation**:
```typescript
function measureLatency(queries: string[], topK: number): LatencyStats {
  const latencies: number[] = [];

  for (const query of queries) {
    const start = Date.now();
    await retrieveAndRerank(query, company_id, topK);
    latencies.push(Date.now() - start);
  }

  latencies.sort((a, b) => a - b);

  return {
    p50: percentile(latencies, 0.50),
    p95: percentile(latencies, 0.95),
    p99: percentile(latencies, 0.99),
    mean: latencies.reduce((sum, l) => sum + l, 0) / latencies.length,
  };
}
```

**Target Thresholds**:
- p50 < 200ms
- p95 < 500ms
- p99 < 1000ms

---

## 5. Regression Suite

### 5.1 Test Workflow

```bash
# Step 1: Ingest golden dataset
npm run rag:ingest-golden

# Step 2: Run evaluation
npm run rag:eval

# Step 3: Compare vs baseline
npm run rag:regression-check

# Step 4: Generate report
npm run rag:eval-report
```

### 5.2 Implementation

**File**: `scripts/rag-eval.ts`

```typescript
import goldenDataset from '../tests/rag-eval/golden-dataset.json';

async function runRagEvaluation(company_id: string): Promise<EvalResults> {
  // Step 1: Ingest golden entities
  console.log('Ingesting golden dataset...');
  for (const entity of goldenDataset.entities) {
    await memoryService.writeEntity({
      entity_type: entity.entity_type,
      content: entity.content,
      metadata: entity.metadata,
      source_id: `golden:${entity.entity_id}`,
      source_hash: hashContent(entity.content),
      timestamp: new Date().toISOString(),
    }, company_id);
  }

  // Wait for index to update
  await sleep(5000);

  // Step 2: Execute test queries
  console.log('Executing test queries...');
  const results: QueryResult[] = [];

  for (const testQuery of goldenDataset.queries) {
    const start = Date.now();
    const retrieved = await retrieveAndRerank(testQuery.query_text, company_id, 10);
    const latency = Date.now() - start;

    results.push({
      query_id: testQuery.query_id,
      query_text: testQuery.query_text,
      retrieved,
      expected: testQuery.expected_results,
      latency,
    });
  }

  // Step 3: Calculate metrics
  console.log('Calculating metrics...');
  const metrics = {
    recall_at_5: calculateAverage(results, r => recallAtK(r.retrieved, r.expected.relevant_entities, 5)),
    precision_at_5: calculateAverage(results, r => precisionAtK(r.retrieved, r.expected.relevance_labels, 5)),
    mrr: mrr(results),
    ndcg_at_5: calculateAverage(results, r => ndcgAtK(r.retrieved, r.expected.relevance_labels, 5)),
    latency: {
      p50: percentile(results.map(r => r.latency), 0.50),
      p95: percentile(results.map(r => r.latency), 0.95),
      p99: percentile(results.map(r => r.latency), 0.99),
    },
  };

  return { metrics, results };
}
```

---

### 5.3 Baseline Storage

**File**: `tests/rag-eval/baseline-metrics.json`

```json
{
  "version": "1.0.0",
  "embedding_model": "text-embedding-3-large",
  "chunking_strategy": "semantic_512_overlap_50",
  "reranking_model": "cross-encoder-ms-marco",
  "recorded_at": "2026-01-04T12:00:00Z",
  "metrics": {
    "recall_at_5": 0.82,
    "precision_at_5": 0.68,
    "mrr": 0.74,
    "ndcg_at_5": 0.78,
    "latency": {
      "p50": 180,
      "p95": 420,
      "p99": 850
    }
  }
}
```

**Update Baseline**:
```bash
# After verifying new metrics are better, update baseline
npm run rag:update-baseline
```

---

### 5.4 Regression Check

**File**: `scripts/rag-regression-check.ts`

```typescript
import baseline from '../tests/rag-eval/baseline-metrics.json';

async function checkRegression(currentMetrics: EvalMetrics): Promise<RegressionResult> {
  const thresholds = {
    recall_at_5: 0.80, // Absolute minimum
    precision_at_5: 0.60,
    mrr: 0.70,
    ndcg_at_5: 0.75,
    latency_p95: 500, // ms
  };

  const results: RegressionResult = {
    passed: true,
    failures: [],
  };

  // Check absolute thresholds
  for (const [metric, threshold] of Object.entries(thresholds)) {
    const current = getMetricValue(currentMetrics, metric);
    const isLatency = metric.startsWith('latency');

    if (isLatency && current > threshold) {
      results.passed = false;
      results.failures.push({
        metric,
        current,
        threshold,
        message: `${metric} degraded: ${current}ms > ${threshold}ms`,
      });
    } else if (!isLatency && current < threshold) {
      results.passed = false;
      results.failures.push({
        metric,
        current,
        threshold,
        message: `${metric} below threshold: ${current} < ${threshold}`,
      });
    }
  }

  // Check relative degradation (vs baseline)
  const maxDegradation = 0.05; // 5% degradation allowed

  for (const metric of ['recall_at_5', 'precision_at_5', 'mrr', 'ndcg_at_5']) {
    const current = currentMetrics[metric];
    const base = baseline.metrics[metric];
    const degradation = (base - current) / base;

    if (degradation > maxDegradation) {
      results.passed = false;
      results.failures.push({
        metric,
        current,
        baseline: base,
        degradation: `${(degradation * 100).toFixed(1)}%`,
        message: `${metric} degraded by ${(degradation * 100).toFixed(1)}% vs baseline`,
      });
    }
  }

  return results;
}
```

**CI/CD Integration**:
```yaml
# .github/workflows/rag-eval.yml
name: RAG Evaluation
on:
  pull_request:
    paths:
      - 'packages/memory-plane/**'
      - 'packages/rag-pipeline/**'

jobs:
  rag-eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run RAG evaluation
        run: npm run rag:eval
      - name: Check for regressions
        run: npm run rag:regression-check
      # Fail PR if regressions detected
```

---

## 6. Evaluation Report

### 6.1 Report Format

**File**: `reports/rag-eval-2026-01-04.md`

```markdown
# RAG Evaluation Report

**Date**: 2026-01-04
**Baseline Version**: 1.0.0
**Current Config**:
- Embedding Model: text-embedding-3-large
- Chunking: semantic_512_overlap_50
- Reranking: cross-encoder-ms-marco

---

## Metrics Summary

| Metric | Current | Baseline | Threshold | Status |
|--------|---------|----------|-----------|--------|
| Recall@5 | 0.84 | 0.82 | 0.80 | ✅ PASS (+2.4%) |
| Precision@5 | 0.66 | 0.68 | 0.60 | ⚠️ DEGRADED (-2.9%) |
| MRR | 0.76 | 0.74 | 0.70 | ✅ PASS (+2.7%) |
| NDCG@5 | 0.79 | 0.78 | 0.75 | ✅ PASS (+1.3%) |
| Latency p50 | 175ms | 180ms | 200ms | ✅ PASS |
| Latency p95 | 410ms | 420ms | 500ms | ✅ PASS |

**Overall**: ✅ PASS (minor precision degradation within tolerance)

---

## Per-Query Analysis

### Query q001: "What is the refund policy?"
- Retrieved: entity-refund-policy, entity-terms-of-service, entity-faq
- Expected: entity-refund-policy
- Recall: 1.0 ✅
- NDCG: 0.95 ✅
- Latency: 165ms

### Query q002: "Do you have a swimming pool?"
- Retrieved: entity-amenities-list, entity-facilities, entity-hotel-info
- Expected: entity-amenities-list
- Recall: 1.0 ✅
- NDCG: 0.88 ✅
- Latency: 142ms

[... 18 more queries ...]

---

## Failures (0)

No queries failed to meet thresholds.

---

## Recommendations

1. Precision@5 slightly degraded (-2.9%). Consider:
   - Adjust reranking threshold (currently 0.5 → try 0.6)
   - Review false positives in top-5 results
2. Latency improved by 5ms (p50). No action needed.
```

---

## 7. Tuning Experiments

### 7.1 Experiment Tracking

**File**: `tests/rag-eval/experiments.json`

```json
{
  "experiments": [
    {
      "id": "exp-001",
      "date": "2026-01-04",
      "description": "Reduce chunk size to 256 tokens",
      "config_changes": {
        "chunking.max_tokens": 256,
        "chunking.overlap_tokens": 25
      },
      "results": {
        "recall_at_5": 0.79,
        "precision_at_5": 0.71,
        "mrr": 0.72,
        "ndcg_at_5": 0.76
      },
      "verdict": "REJECTED (recall degraded below threshold)"
    },
    {
      "id": "exp-002",
      "date": "2026-01-05",
      "description": "Increase rerank threshold to 0.6",
      "config_changes": {
        "reranking.threshold": 0.6
      },
      "results": {
        "recall_at_5": 0.84,
        "precision_at_5": 0.74,
        "mrr": 0.77,
        "ndcg_at_5": 0.81
      },
      "verdict": "ACCEPTED (all metrics improved)"
    }
  ]
}
```

---

## 8. Validation Tests (Pass Criteria)

### 8.1 Test 1: Golden Dataset Loads

**Setup**:
1. Load `golden-dataset.json`

**Expected**:
- JSON parses successfully
- All required fields present (entities, queries, expected_results)

**Code Verification**:
```typescript
const dataset = require('../tests/rag-eval/golden-dataset.json');
assert(dataset.entities.length >= 50);
assert(dataset.queries.length >= 20);
```

---

### 8.2 Test 2: Metrics Calculate Correctly

**Setup**:
1. Mock retrieval results
2. Calculate metrics

**Expected**:
- Recall@5 = 0.6 (3 of 5 relevant retrieved)
- Precision@5 = 0.4 (2 of 5 top results relevant)

**Code Verification**:
```typescript
const retrieved = [
  { source_entity_id: 'relevant-1' },
  { source_entity_id: 'irrelevant' },
  { source_entity_id: 'relevant-2' },
  { source_entity_id: 'irrelevant' },
  { source_entity_id: 'relevant-3' },
];
const relevant = ['relevant-1', 'relevant-2', 'relevant-3', 'relevant-4', 'relevant-5'];

const recall = recallAtK(retrieved, relevant, 5);
assert(recall === 0.6); // 3 of 5
```

---

### 8.3 Test 3: Regression Detection

**Setup**:
1. Current metrics: Recall@5 = 0.75 (below 0.80 threshold)
2. Run regression check

**Expected**:
- Regression check FAILS
- Failure message includes metric and threshold

**Code Verification**:
```typescript
const result = await checkRegression({ recall_at_5: 0.75 });
assert(result.passed === false);
assert(result.failures.some(f => f.metric === 'recall_at_5'));
```

---

### 8.4 Test 4: End-to-End Evaluation

**Setup**:
1. Ingest golden dataset
2. Run full evaluation suite

**Expected**:
- All 20 queries execute
- Metrics calculated
- Report generated

**Code Verification**:
```bash
npm run rag:eval
# Expected: reports/rag-eval-{date}.md file created
# Expected: Exit code 0 (success)
```

---

## 9. Checklist (FIT Pass Criteria)

### Golden Dataset

- [ ] Golden dataset created (50+ entities, 20+ queries)
- [ ] Relevance labels assigned (0-3 scale)
- [ ] Dataset version-controlled (git)
- [ ] Diverse query types (factual, comparative, troubleshooting)

### Metrics Implementation

- [ ] Recall@K implemented
- [ ] Precision@K implemented
- [ ] MRR implemented
- [ ] NDCG@K implemented
- [ ] Latency metrics (p50, p95, p99)

### Baseline & Regression

- [ ] Baseline metrics recorded (`baseline-metrics.json`)
- [ ] Regression check script (`rag-regression-check.ts`)
- [ ] CI/CD integration (fail PR if regression detected)

### Reporting

- [ ] Evaluation report auto-generated
- [ ] Per-query breakdown included
- [ ] Recommendations section populated

### Validation Tests

- [ ] Test 1 (Golden Dataset Loads): PASS
- [ ] Test 2 (Metrics Calculate): PASS
- [ ] Test 3 (Regression Detection): PASS
- [ ] Test 4 (End-to-End Eval): PASS

### Thresholds Met

- [ ] Recall@5 >= 0.80
- [ ] Precision@5 >= 0.60
- [ ] MRR >= 0.70
- [ ] NDCG@5 >= 0.75
- [ ] Latency p95 <= 500ms

---

## 10. References

- CANON-MEM-PLANE-001: Memory Plane Architecture
- FIT-RAG-PIPELINE-001: RAG Pipeline Specification

---

**END OF FIT-RAG-EVAL-001**
