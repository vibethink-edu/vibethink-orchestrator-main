# Core Observability Primitives

**Module**: `src/core/observability/`  
**Version**: 1.0.0  
**Status**: ✅ Stable  
**WIT Required**: NO

---

## Overview

Core observability primitives for ViTo, providing:
- **Distributed Tracing**: Correlation and Request IDs
- **Error Handling**: Normalized `AppError` with structured metadata
- **Event Modeling**: Type-safe `EventEnvelope<T>` for domain events

**Design Goals**:
- No vendor lock (pure TypeScript, `crypto.randomUUID()`)
- No runtime event bus (types only for `EventEnvelope`)
- Type-safe via branded types
- JSON-serializable for logging/telemetry

---

## API Reference

### CorrelationId

Branded type for correlation IDs used in distributed tracing.

```typescript
import { CorrelationId, createCorrelationId, isCorrelationId } from '@/core/observability';

// Create new correlation ID
const correlationId: CorrelationId = createCorrelationId();
// => "550e8400-e29b-41d4-a716-446655440000"

// Type guard
if (isCorrelationId(value)) {
  // value is CorrelationId
}
```

**Purpose**: Links a logical operation across multiple requests/services.

---

### RequestId

Branded type for request IDs used to uniquely identify individual operations.

```typescript
import { RequestId, createRequestId, isRequestId } from '@/core/observability';

// Create new request ID
const requestId: RequestId = createRequestId();
// => "7c9e6679-7425-40de-944b-e07fc1f90ae7"

// Type guard
if (isRequestId(value)) {
  // value is RequestId
}
```

**Purpose**: Uniquely identifies a single request/operation instance.

---

### AppError

Normalized application error with structured metadata.

```typescript
import { AppError } from '@/core/observability';

// Throw structured error
throw new AppError({
  code: 'ENTITY_NOT_FOUND',
  message: 'Project with ID 123 not found',
  correlationId,
  meta: { entityType: 'Project', entityId: '123' },
});

// With cause chaining
throw new AppError({
  code: 'DATABASE_ERROR',
  message: 'Failed to query projects',
  cause: originalError,
  correlationId,
});

// Serialize for logging
const json = error.toJSON();
// {
//   name: 'AppError',
//   code: 'ENTITY_NOT_FOUND',
//   message: '...',
//   correlationId: '...',
//   meta: { ... },
//   stack: '...'
// }
```

**Fields**:
- `code`: Stable error code (SCREAMING_SNAKE_CASE)
- `message`: Human-readable message
- `correlationId?`: Optional correlation ID
- `cause?`: Optional underlying error (Error chaining)
- `meta?`: Optional metadata (arbitrary context)

**Methods**:
- `toJSON()`: Serialize to JSON-safe object

---

### EventEnvelope<T>

Generic type-safe envelope for domain events.

```typescript
import { EventEnvelope, isEventEnvelope } from '@/core/observability';

// Define event payload type
type ProjectCreatedPayload = {
  projectId: string;
  name: string;
};

// Create event
const event: EventEnvelope<ProjectCreatedPayload> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'project.lifecycle.created',
  occurredAt: '2026-01-08T20:00:00.000Z',
  correlationId: createCorrelationId(),
  payload: { projectId: '123', name: 'My Project' },
};

// Type guard
if (isEventEnvelope(value)) {
  // value is EventEnvelope (structure check only)
}
```

**Fields**:
- `id`: Unique event instance ID (UUID v4)
- `name`: Event name in `domain.context.action` format (lowercase, dot-separated)
- `occurredAt`: ISO 8601 timestamp (UTC)
- `correlationId`: Correlation ID for tracing
- `payload`: Typed event data (generic `T`)

**Naming Convention**:
- Format: `domain.context.action`
- Examples:
  - `project.lifecycle.created`
  - `user.authentication.logged_in`
  - `invoice.payment.processed`
- Use lowercase, dot-separated, past tense for domain events

**Note**: This is a **type/shape definition only**. No runtime event bus or dispatcher is included.

---

## Usage Patterns

### Error Handling with Correlation

```typescript
import { createCorrelationId, AppError } from '@/core/observability';

async function processRequest(correlationId: CorrelationId) {
  try {
    // ... business logic
  } catch (err) {
    throw new AppError({
      code: 'PROCESSING_FAILED',
      message: 'Failed to process request',
      correlationId,
      cause: err instanceof Error ? err : undefined,
      meta: { operation: 'processRequest' },
    });
  }
}
```

### Event Creation

```typescript
import { createCorrelationId, EventEnvelope } from '@/core/observability';
import { randomUUID } from 'node:crypto';

function createProjectCreatedEvent(
  correlationId: CorrelationId,
  payload: ProjectCreatedPayload
): EventEnvelope<ProjectCreatedPayload> {
  return {
    id: randomUUID(),
    name: 'project.lifecycle.created',
    occurredAt: new Date().toISOString(),
    correlationId,
    payload,
  };
}
```

---

## Design Decisions

### Why Branded Types?

Branded types (`CorrelationId`, `RequestId`) provide compile-time type safety without runtime overhead:

```typescript
// ✅ Type-safe
const correlationId: CorrelationId = createCorrelationId();

// ❌ Compile error: can't assign plain string
const correlationId: CorrelationId = "some-string";

// ✅ Explicit cast if needed (use sparingly)
const correlationId = "existing-id" as CorrelationId;
```

### Why No Event Bus?

`EventEnvelope<T>` is intentionally **type-only**:
- Avoids coupling to specific event bus implementations
- Allows flexibility in transport layer (in-memory, message queue, HTTP, etc.)
- Keeps core primitives minimal and reusable

Event dispatching/handling is the responsibility of higher layers.

### Why `crypto.randomUUID()`?

- **No vendor lock**: Native Node.js (18+) API
- **Secure**: Cryptographically strong random UUIDs (v4)
- **No dependencies**: No need for external UUID libraries

---

## Integration with ExecutionContext

```typescript
import { createCorrelationId, createRequestId } from '@/core/observability';
import { createExecutionContext } from '@/core/context';

// Create context with observability IDs
const ctx = createExecutionContext({
  correlationId: createCorrelationId(),
  requestId: createRequestId(),
});

// Use in error handling
throw new AppError({
  code: 'UNAUTHORIZED',
  message: 'User not authorized',
  correlationId: ctx.correlationId,
  meta: { userId: ctx.actor?.id },
});
```

---

## File Structure

```
src/core/observability/
├── correlation.ts      # CorrelationId type + factory
├── request.ts          # RequestId type + factory
├── app-error.ts        # AppError class
├── event-envelope.ts   # EventEnvelope<T> type
└── index.ts            # Barrel exports
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial release (CorrelationId, RequestId, AppError, EventEnvelope) |

---

## Related Documentation

- [Execution Context](./execution-context.md)
- [Core Primitives Index](./README.md)
