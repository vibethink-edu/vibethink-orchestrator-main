/**
 * @fileoverview Normalized application error primitive.
 * @module core/observability/app-error
 *
 * Provides a structured, serializable error class for consistent error handling
 * across ViTo. Includes correlation ID for tracing and stable error codes.
 *
 * Naming: AppError (PascalCase class), error codes in SCREAMING_SNAKE_CASE.
 * No vendor lock: plain TypeScript class extending Error.
 */

import type { CorrelationId } from './correlation.js';

/**
 * Normalized application error with structured metadata.
 *
 * Extends native Error with:
 * - Stable error code (SCREAMING_SNAKE_CASE)
 * - Optional correlation ID for distributed tracing
 * - Optional cause (Error chaining)
 * - Optional metadata (arbitrary context)
 * - JSON serialization
 *
 * @example
 * throw new AppError({
 *   code: 'ENTITY_NOT_FOUND',
 *   message: 'Project with ID 123 not found',
 *   correlationId,
 *   meta: { entityType: 'Project', entityId: '123' }
 * });
 */
export class AppError extends Error {
    /**
     * Stable error code in SCREAMING_SNAKE_CASE.
     *
     * Used for programmatic error handling and i18n lookups.
     * Examples: ENTITY_NOT_FOUND, VALIDATION_FAILED, UNAUTHORIZED_ACCESS
     */
    public readonly code: string;

    /**
     * Optional correlation ID for distributed tracing.
     *
     * Links this error to a logical operation across service boundaries.
     */
    public readonly correlationId?: CorrelationId;

    /**
     * Optional underlying cause (Error chaining).
     *
     * Preserves the original error for debugging and logging.
     */
    public readonly cause?: Error;

    /**
     * Optional metadata for additional context.
     *
     * Arbitrary key-value pairs for debugging, logging, or telemetry.
     * Examples: { entityType: 'Project', entityId: '123', userId: 'user-456' }
     */
    public readonly meta?: Record<string, unknown>;

    /**
     * Creates a new AppError.
     *
     * @param params - Error parameters.
     * @param params.code - Stable error code (SCREAMING_SNAKE_CASE).
     * @param params.message - Human-readable error message.
     * @param params.correlationId - Optional correlation ID.
     * @param params.cause - Optional underlying error.
     * @param params.meta - Optional metadata.
     */
    constructor(params: {
        code: string;
        message: string;
        correlationId?: CorrelationId;
        cause?: Error;
        meta?: Record<string, unknown>;
    }) {
        super(params.message);

        // Maintains proper stack trace for where our error was thrown (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }

        this.name = 'AppError';
        this.code = params.code;
        this.correlationId = params.correlationId;
        this.cause = params.cause;
        this.meta = params.meta;
    }

    /**
     * Serializes the error to a JSON-safe object.
     *
     * @returns {object} JSON representation of the error.
     *
     * @example
     * const json = error.toJSON();
     * // { name: 'AppError', code: 'ENTITY_NOT_FOUND', message: '...', ... }
     */
    toJSON(): {
        name: string;
        code: string;
        message: string;
        correlationId?: string;
        cause?: string;
        meta?: Record<string, unknown>;
        stack?: string;
    } {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            correlationId: this.correlationId,
            cause: this.cause?.message,
            meta: this.meta,
            stack: this.stack,
        };
    }
}
