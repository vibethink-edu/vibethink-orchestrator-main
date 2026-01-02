# Web-Intel Pipeline & Storage

**Status**: CANONICAL  
**Version**: 1.0.0  
**Type**: ARCHITECTURAL SPEC  

---

## 1. The Pipeline: Acquire to Promote

The flow of external information into the system follows a rigid pipeline to prevent pollution of the Canonical Entity Graph.

```mermaid
graph LR
    A[Request] -->|Governance Check| B[Acquire (Adapter)]
    B -->|Raw Data| C[Raw Evidence Store]
    C -->|Process/Embed| D[Intel Doc Store]
    D -->|Search/Retrieval| E[Reasoning Engine]
    E -->|Validation| F{Promote?}
    F -- Yes --> G[Entity Event]
    G --> H[Entity Graph (Truth)]
    F -- No --> I[Discard/Cache]
```

---

## 2. Storage Layers

### A. Raw Evidence Store (Immutable)
*   **Purpose**: Audit trail and debug.
*   **Content**: The exact HTML, JSON, or text received from the provider.
*   **Properties**:
    *   **Immutable**: Never modified after write.
    *   **Retention**: Short-to-medium term (defined by policy).
    *   **Key**: `evidence_id` (UUID).

### B. Intel Doc Store (Search Accelerator)
*   **Purpose**: Fast retrieval and semantic search.
*   **Content**: Cleaned, chunked, and vectorized text.
*   **Properties**:
    *   **Non-Canonical**: This is NOT the source of truth regarding the business domain. It is an index of *potential* truth.
    *   **Volatile**: Can be rebuilt/flushed without business continuity loss.

### C. Entity Graph (Source of Truth)
*   **Purpose**: The permanent memory of the system.
*   **Content**: Verified facts (e.g., "Competitor X Price is $50") linked to Entities.
*   **Ingestion**: ONLY via `ENTITY_EVENT` (e.g., `MARKIT_SIGNAL_VERIFIED`).
*   **Requirement**: Must reference the `evidence_id` from the Raw Store as proof.

---

## 3. Data States

| State | Description | Storage Location |
| :--- | :--- | :--- |
| **Acquired** | Raw data fetched successfully. provenance attached. | Raw Evidence Store |
| **Processed** | Parsed, cleaned, and embedded. Ready for query. | Intel Doc Store (Vector) |
| **Interpreted** | Agent has analyzed it and formed a conclusion. | Reasoning Context (Memory) |
| **Canonized** | Explicitly promoted to a Fact/Memory. | Entity Graph + Timeline |

---

## 4. Promotion Protocol

Information does **NOT** flow automatically from Web -> Memory.

**The Promotion Rule**:
> "An external signal becomes an internal truth ONLY when an Agent explicitly generates an Event asserting it, citing the Evidence ID."

**Example**:
1.  **Web-Intel**: Finds "Stock price $150". (Stored in Intel Store).
2.  **Reasoning**: Sees this matches criteria.
3.  **Agent**: Emits event `COMPETITOR_ANALYSIS_COMPLETED`.
    *   `payload`: `{ "price": 150, "currency": "USD" }`
    *   `evidence_ref`: `evidence_uuid_123`
4.  **Entity System**: Updates `CompetitorEntity` with new price.

---

## 5. Constraint Invariants

1.  **Policy First**: No storage write occurs if the acquisition failed Policy/Quota checks.
2.  **Traceability**: Every item in the Intel Doc Store must link back to a record in the Raw Evidence Store.
3.  **No Ghost Data**: Intel Doc Store entries without valid Provenance metadata are considered corrupt and purgeable.
