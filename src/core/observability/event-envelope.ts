/**
 * @fileoverview Event envelope type for structured event payloads.
 * @module core/observability/event-envelope
 *
 * Provides a generic type-safe envelope for domain events.
 * This is a SHAPE/TYPE definition only — no runtime event bus or dispatcher.
 *
 * Naming: EventEnvelope (PascalCase type), event names in domain.context.action format.
 * No vendor lock: plain TypeScript generic type.
 */

import type { CorrelationId } from './correlation.js';

/**
 * Generic event envelope for structured domain events.
 *
 * Wraps event payloads with metadata for tracing, ordering, and correlation.
 * Event names follow the convention: domain.context.action (lowercase, dot-separated).
 *
 * @template T - The type of the event payload.
 *
 * @example
 * type ProjectCreatedPayload = { projectId: string; name: string };
 *
 * const event: EventEnvelope<ProjectCreatedPayload> = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   name: 'project.lifecycle.created',
 *   occurredAt: '2026-01-08T20:00:00.000Z',
 *   correlationId: createCorrelationId(),
 *   payload: { projectId: '123', name: 'My Project' }
 * };
 */
export interface EventEnvelope<T = unknown> {
    /**
     * Unique event instance ID (UUID v4).
     *
     * Identifies this specific occurrence of the event.
     */
    id: string;

    /**
     * Event name in domain.context.action format.
     *
     * Examples:
     * - project.lifecycle.created
     * - user.authentication.logged_in
     * - invoice.payment.processed
     *
     * Convention: lowercase, dot-separated, past tense for domain events.
     */
    name: string;

    /**
     * ISO 8601 timestamp when the event occurred.
     *
     * Format: YYYY-MM-DDTHH:mm:ss.sssZ (UTC)
     * Example: "2026-01-08T20:00:00.000Z"
     */
    occurredAt: string;

    /**
     * Correlation ID for distributed tracing.
     *
     * Links this event to the logical operation that triggered it.
     */
    correlationId: CorrelationId;

    /**
     * Typed event payload.
     *
     * Domain-specific data for this event. Type-safe via generic parameter T.
     */
    payload: T;
}

/**
 * Type guard to check if a value is a valid EventEnvelope.
 *
 * @param value - The value to check.
 * @returns {boolean} True if value matches EventEnvelope shape (runtime check).
 *
 * NOTE: This checks structure only; payload type T is not validated at runtime.
 */
export function isEventEnvelope(value: unknown): value is EventEnvelope {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
        typeof candidate.id === 'string' &&
        typeof candidate.name === 'string' &&
        typeof candidate.occurredAt === 'string' &&
        typeof candidate.correlationId === 'string' &&
        'payload' in candidate
    );
}
