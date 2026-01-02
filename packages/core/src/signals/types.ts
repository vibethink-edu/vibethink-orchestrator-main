/**
 * Core Types for Enterprise Signals
 * 
 * Defines the fundamental primitives for the agnostic signaling system.
 * These types are opaque to vendor implementation details.
 */

export type VendorRef = string; // Opaque vendor pointer (no structure leaked)

export type SignalClass =
    | "email"
    | "calendar_event"
    | "file"
    | "task"
    | "chat_message";

export type AdapterId = string;       // e.g. "google-workspace"
export type AdapterVersion = string;  // semver or commit-ish
