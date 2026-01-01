/**
 * Signal Adapter Interface
 * 
 * The Iron Interface for Vendor-Agnostic Ingestion.
 * All adapters (Google, O365, etc.) must implement this contract.
 */

import { AdapterId, AdapterVersion, SignalClass } from "./types";
import { SignalEvent } from "./events";
import { NormalizedAdapterError } from "./errors";

export interface IngestResult {
    events: SignalEvent[];
    warnings?: string[];
    errors?: NormalizedAdapterError[];
}

export interface SignalAdapter {
    readonly adapter_id: AdapterId;
    readonly adapter_version: AdapterVersion;

    /** 
     * Pull or receive signals and emit normalized events (no raw payloads). 
     * 
     * @param input.connection_ref Opaque reference to auth/connection (never raw tokens)
     */
    ingest(input: {
        connection_ref: string;
        since?: string; // ISO
        until?: string; // ISO
        signal_classes: SignalClass[];
    }): Promise<IngestResult>;
}
