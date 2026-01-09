/**
 * @fileoverview Execution Context Module Entrypoint.
 * @module core/context
 *
 * Exports context types, factory, and immutable modifiers.
 * Version: 0.1.0
 */

export {
    type ExecutionContext,
    type ExecutionActor,
    type ExecutionTrace,
} from './types.js';

export { createExecutionContext } from './factory.js';

export {
    withCorrelationId,
    withRequestId,
    withActor,
    withTenantId,
    withTrace,
    withMeta,
} from './modifiers.js';
