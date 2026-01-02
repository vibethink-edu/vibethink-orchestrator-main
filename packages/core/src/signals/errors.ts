/**
 * Normalized Error Definitions
 * 
 * Ensures observability without leaking vendor internals to the domain model.
 * Complies with WIT-ADAPT-001.
 */

export type NormalizedErrorCode =
    | "AUTH_EXPIRED"
    | "RATE_LIMITED"
    | "NOT_FOUND"
    | "PERMISSION_DENIED"
    | "TEMPORARY_UNAVAILABLE"
    | "UNKNOWN";

export interface NormalizedAdapterError {
    code: NormalizedErrorCode;
    message: string;            // Safe, sanitized message (no raw vendor payload dumps)
    retryable: boolean;
    vendor_trace_id?: string;   // Observability metadata only (not for domain logic)
}
