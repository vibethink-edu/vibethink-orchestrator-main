/**
 * @fileoverview Request ID primitive for individual request tracking.
 * @module core/observability/request
 *
 * Provides a branded type and factory for request IDs used to uniquely
 * identify individual HTTP requests or async operations.
 *
 * Naming: RequestId (PascalCase type), createRequestId (camelCase factory).
 * No vendor lock: uses crypto.randomUUID() (Node 18+).
 */

import { randomUUID } from 'node:crypto';

/**
 * Branded type for request IDs.
 *
 * Ensures type safety and prevents accidental mixing with plain strings.
 * A request ID uniquely identifies a single request/operation instance.
 */
export type RequestId = string & { readonly __brand: 'RequestId' };

/**
 * Creates a new request ID.
 *
 * @returns {RequestId} A UUID v4 branded as RequestId.
 *
 * @example
 * const requestId = createRequestId();
 * // requestId: "7c9e6679-7425-40de-944b-e07fc1f90ae7"
 */
export function createRequestId(): RequestId {
    return randomUUID() as RequestId;
}

/**
 * Type guard to check if a value is a valid RequestId.
 *
 * @param value - The value to check.
 * @returns {boolean} True if value is a non-empty string (runtime check).
 *
 * NOTE: This is a runtime check; compile-time branding is enforced by TypeScript.
 */
export function isRequestId(value: unknown): value is RequestId {
    return typeof value === 'string' && value.length > 0;
}
