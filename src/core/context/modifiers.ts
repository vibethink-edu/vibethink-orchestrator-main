/**
 * @fileoverview Immutable modifiers for Execution Context.
 * @module core/context/modifiers
 *
 * Helper functions to "mutate" context by returning new instances.
 */

import type { CorrelationId, RequestId } from '../observability/index.js';
import type { ExecutionContext, ExecutionActor, ExecutionTrace } from './types.js';

/**
 * Returns a new context with the updated correlation ID.
 *
 * @param ctx - Source context.
 * @param correlationId - New correlation ID.
 * @returns {ExecutionContext} shallow copy with updated field.
 */
export function withCorrelationId(
    ctx: ExecutionContext,
    correlationId: CorrelationId
): ExecutionContext {
    return {
        ...ctx,
        correlationId,
    };
}

/**
 * Returns a new context with the updated request ID.
 *
 * @param ctx - Source context.
 * @param requestId - New request ID.
 * @returns {ExecutionContext} shallow copy with updated field.
 */
export function withRequestId(
    ctx: ExecutionContext,
    requestId: RequestId
): ExecutionContext {
    return {
        ...ctx,
        requestId,
    };
}

/**
 * Returns a new context with the updated actor.
 *
 * @param ctx - Source context.
 * @param actor - New actor (or undefined to clear).
 * @returns {ExecutionContext} shallow copy with updated field.
 */
export function withActor(
    ctx: ExecutionContext,
    actor: ExecutionActor | undefined
): ExecutionContext {
    return {
        ...ctx,
        actor,
    };
}

/**
 * Returns a new context with the updated tenant ID.
 *
 * @param ctx - Source context.
 * @param tenantId - New tenant ID (or undefined to clear).
 * @returns {ExecutionContext} shallow copy with updated field.
 */
export function withTenantId(
    ctx: ExecutionContext,
    tenantId: string | undefined
): ExecutionContext {
    return {
        ...ctx,
        tenantId,
    };
}

/**
 * Returns a new context with the updated trace metadata.
 *
 * @param ctx - Source context.
 * @param trace - New trace metadata (or undefined to clear).
 * @returns {ExecutionContext} shallow copy with updated field.
 */
export function withTrace(
    ctx: ExecutionContext,
    trace: ExecutionTrace | undefined
): ExecutionContext {
    return {
        ...ctx,
        trace,
    };
}

/**
 * Returns a new context with the updated metadata.
 *
 * @param ctx - Source context.
 * @param meta - New metadata (or undefined to clear).
 * @returns {ExecutionContext} shallow copy with updated field.
 *
 * NOTE: This replaces the entire meta object; does not merge.
 */
export function withMeta(
    ctx: ExecutionContext,
    meta: Record<string, unknown> | undefined
): ExecutionContext {
    return {
        ...ctx,
        meta,
    };
}

