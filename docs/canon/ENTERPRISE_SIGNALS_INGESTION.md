# Enterprise Signals Ingestion (ESI)

> **Capability**: Source-agnostic ingestion of high-value business signals.
> **Role**: The sensory input system for the Operational Brain.
> **Truth**: Signals are ephemeral; Generated Events are the Canon.
> **Phase 2 Status**: [LOCKED] - Validated by external audit (Claude). SAFE. Changes require new FIT gate or version bump.
> **Phase 2 Status**: [LOCKED] - Validated by external audit (Claude). SAFE. Changes require new FIT gate or version bump.

## 1. Definition

**What it IS:**
-   A capability to normalize external business activity into `Entity Events`.
-   A strictly server-side, asynchronous pipeline.
-   A consumer of the `Policy Layer` for redaction and retention.
-   The bridge between "Vendor World" and "Entity Graph".

**What it is NOT:**
-   A sync tool (we do not mirror external state).
-   A backup solution (we do not store blobs).
-   A user interface (no screens, no flows).
-   Dependent on any specific vendor (Google/Microsoft are just sources).

## 2. Architecture & Boundaries

The ESI machinery sits strictly at the **Edge** of the system.

`[Vendor Source] -> [Signal Adapter] -> (Normalization) -> [Entity Event] -> [Policy Layer] -> [Entity Graph]`

### Boundaries
1.  **Ingress Boundary**: Adapters receive raw payloads. They MUST NOT mutate internal state directly.
2.  **Canon Boundary**: Only authorized `Entity Events` cross from the Adapter to the Core.
3.  **Policy Boundary**: All signals pass through Policy checks *before* persistence. Policy enforcement happens at the Ingestion Loop boundary (Pipeline Level), not inside the adapters. Adapters are responsible ONLY for normalization.

## 3. Core Invariants (WITs)

1.  **WIT-ESI-001**: **Universal Normalization**. All incoming signals must map to a canonical `Entity Event` type. Raw vendor payloads are never Canon.
2.  **WIT-ESI-002**: **Policy-First Ingestion**. Ingestion never occurs without a prior, active Policy check.
    -   *Constraint*: `Policy.evaluate(signal) == ALLOW` is a hard gate before persistence.
    -   *Constraint*: Quotas and Retentions are enforced *during* ingestion, not after.
3.  **WIT-ESI-003**: **Provenance Required**. Every signal MUST contain:
    -   `adapter_id` (Which logic?)
    -   `adapter_version` (Which logic version?)
    -   `source_ref` (Vendor's unique ID)
    -   `received_at` (System timestamp)
    -   *Violation*: Missing provenance -> Signal Rejected.
    -   > [!WARNING]
    -   > For Gmail, `source_ref` must be the `messageId`. Using `threadId` will cause collisions across individual messages.
4.  **WIT-ESI-004**: **Idempotency Key**. A unique deduplication key is required per event class to prevent replay attacks or sync loops.
    -   *Format*: `${adapter_id}:${source_ref}:${signal_class}`
    -   *Responsibility*: Adapters must generate it; Core enforces its stability.
5.  **WIT-ESI-005**: **Immutable Timeline (Append-Only)**.
    -   Events on the Timeline are never destructively edited.
    -   Corrections are modeled as new events (`EVENT_RETRACTED`, `EVENT_CORRECTED`).
    -   History is preserved; truth is the sum of events.

## 4. Interaction with the Truth

### Entity Graph
ESI queries the Entity Graph to resolve:
-   `ActorID` (Who generated the signal?)
-   `ContextID` (Where does this belong?)

### Entity Events
ESI produces immutable events. Examples:
-   `EMAIL_RECEIVED` (from Gmail/Outlook)
-   `MEETING_SCHEDULED` (from Calendar)
-   `DOC_CREATED` (from Drive/SharePoint)

### Timeline
Events are placed on the `Timeline` based on their *original timestamp*, not ingestion time.

### Policy Layer
ESI enforces:
-   **Blacklists**: "Do not ingest emails from @personal.com"
-   **Retention**: "Discard calendar events older than 1 year"

## 5. Vendor Neutrality & Non-Goals
The design of ESI ignores the concept of a "Vendor".
-   We do not have "Google Ingestion".
-   We have "Mail Ingestion" (implemented by `GmailAdapter`, `OutlookAdapter`).

### Non-Goals (ESI vs Web-Intel)
-   **No Scraping**: ESI does NOT visit URLs or scrape content. That is `Web-Intel`.
-   **No "Search"**: ESI does not "search the web". It ingests known business signals.
-   **No Verification**: ESI signals are treated as "Real History" (e.g., An email *was* received). Web-Intel signals are "Evidence" (e.g., A pricing page *says* $50) which require reasoning to become truth.

If a vendor dictates the data model, **WIT-ESI-001** is violated.
