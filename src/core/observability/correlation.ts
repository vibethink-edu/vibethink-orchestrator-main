/**
 * @fileoverview Correlation ID primitive for distributed tracing.
 * @module core/observability/correlation
 *
 * Provides a branded type and factory for correlation IDs used to trace
 * requests across service boundaries and async operations.
 *
 * Naming: CorrelationId (PascalCase type), createCorrelationId (camelCase factory).
 * No vendor lock: uses crypto.randomUUID() (Node 18+).
 */

import { randomUUID } from 'node:crypto';

/**
 * Branded type for correlation IDs.
 *
 * Ensures type safety and prevents accidental mixing with plain strings.
 * A correlation ID traces a logical operation across multiple requests/events.
 */
export type CorrelationId = string & { readonly __brand: 'CorrelationId' };

/**
 * Creates a new correlation ID.
 *
 * @returns {CorrelationId} A UUID v4 branded as CorrelationId.
 *
 * @example
 * const correlationId = createCorrelationId();
 * // correlationId: "550e8400-e29b-41d4-a716-446655440000"
 */
export function createCorrelationId(): CorrelationId {
    return randomUUID() as CorrelationId;
}

/**
 * Type guard to check if a value is a valid CorrelationId.
 *
 * @param value - The value to check.
 * @returns {boolean} True if value is a non-empty string (runtime check).
 *
 * NOTE: This is a runtime check; compile-time branding is enforced by TypeScript.
 */
export function isCorrelationId(value: unknown): value is CorrelationId {
    return typeof value === 'string' && value.length > 0;
}
