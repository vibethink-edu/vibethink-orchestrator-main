/**
 * @fileoverview Type definitions for Execution Context.
 * @module core/context/types
 *
 * Defines the structure of the execution context, which carries technical metadata
 * (identity, tracing, tenancy) through the call stack.
 *
 * Design Note: All fields are readonly to encourage immutability via helpers.
 */

import type { CorrelationId, RequestId } from '../observability/index.js';

/**
 * Technical representation of an actor (caller).
 *
 * NO DOMAIN SEMANTICS. This is a pure shape carrier.
 * - type: 'user', 'system', 'api-key', etc.
 * - id: optional identifier.
 */
export interface ExecutionActor {
    readonly type: string;
    readonly id?: string;
}

/**
 * Technical tracing metadata compatible with OpenTelemetry concepts.
 */
export interface ExecutionTrace {
    readonly parentSpanId?: string;
    readonly spanId?: string;
}

/**
 * Core Execution Context carrier.
 *
 * Passed explicitly or implicitly through layers to maintain context.
 *
 * @property correlationId - Mandatory unique ID for trace linking.
 * @property requestId - Optional unique ID for specific request/operation.
 * @property actor - Optional technical caller identity.
 * @property tenantId - Optional aggregation root ID (technical multitenancy).
 * @property trace - Optional tracing spans.
 * @property meta - Optional untyped metadata for context propagation extensibility.
 */
export interface ExecutionContext {
    readonly correlationId: CorrelationId;
    readonly requestId?: RequestId;
    readonly actor?: ExecutionActor;
    readonly tenantId?: string;
    readonly trace?: ExecutionTrace;
    readonly meta?: Record<string, unknown>;
}
