/**
 * @fileoverview Core observability primitives for ViTo.
 * @module core/observability
 *
 * Exports:
 * - CorrelationId (branded type + factory)
 * - RequestId (branded type + factory)
 * - AppError (normalized error class)
 * - EventEnvelope (generic event type)
 *
 * Version: 1.0.0 (initial release)
 * No vendor lock, no runtime bus, no framework dependencies.
 */

// Correlation ID
export {
    type CorrelationId,
    createCorrelationId,
    isCorrelationId,
} from './correlation.js';

// Request ID
export {
    type RequestId,
    createRequestId,
    isRequestId,
} from './request.js';

// Application Error
export { AppError } from './app-error.js';

// Event Envelope
export {
    type EventEnvelope,
    isEventEnvelope,
} from './event-envelope.js';
