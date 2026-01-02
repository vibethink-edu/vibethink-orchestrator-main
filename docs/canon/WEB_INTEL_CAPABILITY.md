# Web-Intel Capability

**Status**: CANONICAL  
**Version**: 1.0.0  
**Type**: CORE CAPABILITY  

---

## 1. Definition

**Web-Intel** is a horizontal platform **capability**, not a vertical feature. Its sole purpose is to acquire, normalize, and store external signals (evidence) from the web in a governed, compliant, and structured manner.

> [!IMPORTANT]
> **Web-Intel is an Accelerator, NOT a Source of Truth.**
> *   **Source of Truth**: The **Entity Graph** (Memory) and **Timeline**.
> *   **Web-Intel**: Provides transient evidence that *may* be promoted to truth via explicit reasoning and events.

---

## 2. Core Responsibilities

1.  **Acquisition**: Fetching content from URLs, search results, or APIs under strict policy constraints.
2.  **Normalization**: Converting raw HTML/JSON into structured text chunks with metadata.
3.  **Governance**: Enforcing quotas, rate limits, and access policies per Department/Plan.
4.  **Provenance**: Attaching non-negotiable origin data to every signal.

---

## 3. Interaction Patterns

### A. The Decision Support Pre-Action Hook
The primary usage of Web-Intel is to support the **Decision Support Pattern**.
👉 **Reference**: [`DECISION_SUPPORT_PRE_ACTION_HOOK.md`](./DECISION_SUPPORT_PRE_ACTION_HOOK.md)

### B. Relationship to Enterprise Signals (ESI)
👉 **Reference**: [`ENTERPRISE_SIGNALS_INGESTION.md`](./ENTERPRISE_SIGNALS_INGESTION.md)

*   **Web-Intel**: Produces `Evidence Events` (Transient, Unverified). requires **Promotion Gate** to become truth.
*   **ESI**: Produces `Entity Events` (Business Reality). E.g., "Email Received" is an immutable fact of history.

### C. Background Monitoring (Passive)
Scheduled acquisition tasks (e.g., "Check competitor pricing daily") that populate the Intel Store for future query, triggered by the Orchestrator's cron, not ad-hoc agent whims.

---

## 4. Governance & Valid State

### Mandatory Provenance
A Web-Intel signal is **INVALID** effectively "non-existent" to the system if it lacks this block:

```typescript
interface Provenance {
  source_url: string;      // Specific URL where data was found
  fetched_at: string;      // ISO 8601 Timestamp
  method: 'scrape' | 'browse' | 'api' | 'feed';
  source_type: 'public_web' | 'proprietary_db' | 'user_input';
  adapter_version: string; // Enforces reproducibility vs code changes
  license_or_terms: {      // Compliance flag
    checked: boolean;
    status: 'ok' | 'flagged';
  };
}
```

### Policy Gating
Before `WebIntelAdapter.acquire()` is called:
1.  **Identity Check**: Which Department is asking?
2.  **Plan Limit**: Does the tenant have "Web-Intel" enabled in their plan?
3.  **Quota Check**: Are there sufficient Credits (usage metering)?
4.  **Domain Policy**: Is the requested URL/Domain on a blocklist?

---

## 5. Architecture Summary

*   **Consumers**: Orchestrator (on behalf of Agents).
*   **Provider**: `WebIntelAdapter` (abstracts the actual scraping/search vendor).
*   **Storage**:
    *   **Raw Evidence Store**: Immutable blobs of original HTML/Text.
    *   **Intel Vector Store**: Embeddings for retrieval (Accelerator).
    *   **Entity Graph**: Only contains **Promoted** facts (Source of Truth).

---

## 6. Non-Goals (Anti-Patterns)

| What it is NOT | Why? |
| :--- | :--- |
| **A "Research Agent"** | Web-Intel is a tool/capability. The *Agent* does the research using this tool. |
| **A Decision Maker** | Web-Intel never says "Yes, do it". It only says "Here is the data". |
| **A Default Storage** | Data here is ephemeral or cache-like. Durable memory is the Entity Graph. |
| **Unbound Crawler** | Never "crawls the web" recursively without strict depth/breadth limits set by the Orchestrator. |
| **Implicit Automation** | Web-Intel must never be invoked implicitly or on a schedule without explicit Orchestrator intent. |
