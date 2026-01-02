# Signals Adapter Contract

> **Type**: Technical Contract / Interface Specification
> **Purpose**: Ensures all Vendor Adapters behave identically to the Core.
> **Status**: Immutable Interface.

## 1. The Adapter Pattern

An `Adapter` is a translation layer.
It accepts `Vendor Specifics` and emits `Canonical Signals`.

**Strict Rule**: The Core System NEVER imports a vendor library directly. It only interacts with the `Adapter Interface`.

## 2. The Contract Interface

All Adapters must implement the following capability (Conceptual Interface):

```typescript
interface SignalAdapter {
  readonly adapter_id: AdapterId;
  readonly adapter_version: AdapterVersion;

  /** 
   * Pull or receive signals and emit normalized events (no raw payloads). 
   */
  ingest(input: {
    connection_ref: string;
    since?: string; // ISO
    until?: string; // ISO
    signal_classes: SignalClass[];
  }): Promise<IngestResult>;
}
```

### Design Rationale: Batch (Promise) vs Stream (Generator)
The `ingest()` method returns a `Promise<IngestResult>` instead of an `AsyncGenerator`.
- **Why**: Currently, the system prioritizes deterministic batch processing and simple coordination.
- **Tradeoff**: While generators provide better memory efficiency for huge datasets, they introduce complexity in error handling and transactionality during first-sync.
- **Future-Proofing**: Streaming can be introduced as an internal adapter detail or a second interface later without breaking the `SignalAdapter` boundary.

## 3. Canonical Signal Structure

Adapters MUST transform raw data into a `SignalEvent` structure BEFORE it leaves the adapter boundary.

```typescript
export interface SignalEvent {
  event_type: "enterprise_signal.ingested";
  signal: SignalPayload;       // Sealed discriminated union
  provenance: Provenance;      // Absolute lineage
}
```

## 4. Invariants (WITs)

1.  **WIT-ADAPT-001**: **No Leakage with Observability**.
    -   Adapters must catch vendor-specific exceptions.
    -   They MUST throw only `CanonicalAdapterErrors`.
    -   They MUST map internal errors to a `NormalizedErrorCode` (e.g., `AUTH_EXPIRED`, `RATE_LIMITED`).
    -   They MUST preserve `vendor_trace_id` as metadata (never as part of the domain model).
2.  **WIT-ADAPT-002**: **Statelessness**. Adapters must not maintain internal persistence of signals. They are pipes, not buckets.
3.  **WIT-ADAPT-003**: **Rate Limit Compliance**. Adapters must handle vendor rate limits internally (backoff/retry) and expose a clean stream to the Core.
4.  **WIT-ADAPT-004**: **Least Privilege**. Adapters must request the absolute minimum scopes required for the requested `SignalType`.

## 5. Evolution Strategy

-   **Today**: `GoogleWorkspaceAdapter` implements `SignalAdapter`.
-   **Tomorrow**: `Office365Adapter` implements `SignalAdapter`.
-   **Future**: `SlackAdapter`, `NotionAdapter` implement `SignalAdapter`.

The `Core Ingestion Loop` remains unchanged:
`foreach adapter in activeAdapters: adapter.ingest()`
