/**
 * Signal Event Definitions
 * 
 * Defines the structure of normalized signals and the event wrapper.
 * Complies with WIT-ESI-001: Universal Normalization.
 */

import { SignalClass } from "./types";
import { Provenance } from "./provenance";

export interface EmailPayload {
    signal_class: "email";
    subject: string;
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    date: string; // ISO
    excerpt: string;
}

type SignalPayloadBase = { signal_class: SignalClass };

export type SignalPayload =
    | EmailPayload
    | (SignalPayloadBase & { signal_class: "calendar_event" })
    | (SignalPayloadBase & { signal_class: "file" })
    | (SignalPayloadBase & { signal_class: "task" })
    | (SignalPayloadBase & { signal_class: "chat_message" });

export interface SignalEvent {
    event_type: "enterprise_signal.ingested";
    signal: SignalPayload;
    provenance: Provenance;
}
