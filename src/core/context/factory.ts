/**
 * @fileoverview Factory for creating Execution Contexts.
 * @module core/context/factory
 *
 * Ensures valid creation of contexts, guaranteeing critical fields like CorrelationId.
 */

import { createCorrelationId } from '../observability/index.js';
import type { ExecutionContext } from './types.js';

/**
 * Creates a valid ExecutionContext from partial input.
 *
 * Guarantees that a 'correlationId' exists. If not provided in input,
 * a new random one is generated.
 *
 * Does NOT assume business defaults (e.g. default tenant or actor).
 *
 * @param input - Partial context properties.
 * @returns {ExecutionContext} A sealed, valid context object.
 *
 * @example
 * // Fresh context
 * const ctx = createExecutionContext();
 *
 * // Context from existing headers or input
 * const ctx = createExecutionContext({
 *   correlationId: existingCorrelationId,
 *   tenantId: 'tenant-123'
 * });
 */
export function createExecutionContext(input?: Partial<ExecutionContext>): ExecutionContext {
    return {
        // Initialize optional fields as undefined (will be overridden by input if present)
        meta: undefined,
        trace: undefined,
        actor: undefined,
        tenantId: undefined,
        requestId: undefined,

        // Spread input to override any provided fields
        ...input,

        // Guarantee correlationId presence (create if not provided)
        correlationId: input?.correlationId ?? createCorrelationId(),
    };
}
