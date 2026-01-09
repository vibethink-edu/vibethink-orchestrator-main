# Execution Context

**Module**: `src/core/context/`  
**Version**: 0.1.1  
**Status**: ✅ Stable  
**WIT Required**: NO

---

## Overview

Execution context carrier for propagating technical metadata (identity, tracing, tenancy) across layers.

**Design Goals**:
- **Immutable by design**: Readonly fields, functional modifiers
- **Domain-agnostic**: Pure technical shapes, no business semantics
- **Type-safe**: Integrates with `CorrelationId`/`RequestId` from `observability`
- **Explicit propagation**: No implicit AsyncLocalStorage (ALS) magic at this layer

---

## API Reference

### ExecutionContext

Core execution context type.

```typescript
interface ExecutionContext {
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
  readonly actor?: ExecutionActor;
  readonly tenantId?: string;
  readonly trace?: ExecutionTrace;
  readonly meta?: Record<string, unknown>;
}
```

**Fields**:
- `correlationId`: **Mandatory**. Unique ID for distributed tracing.
- `requestId`: Optional. Unique ID for specific request/operation.
- `actor`: Optional. Technical caller identity (type + id).
- `tenantId`: Optional. Multi-tenancy aggregation root ID.
- `trace`: Optional. Tracing metadata (parentSpanId, spanId).
- `meta`: Optional. Untyped metadata for extensibility.

---

### ExecutionActor

Technical representation of a caller.

```typescript
interface ExecutionActor {
  readonly type: string;
  readonly id?: string;
}
```

**Examples**:
```typescript
{ type: 'user', id: 'user-123' }
{ type: 'system' }
{ type: 'api-key', id: 'key-abc' }
```

**Note**: This is a **pure shape carrier**, not a domain model. No authentication/authorization logic.

---

### ExecutionTrace

Tracing metadata compatible with OpenTelemetry concepts.

```typescript
interface ExecutionTrace {
  readonly parentSpanId?: string;
  readonly spanId?: string;
}
```

---

### createExecutionContext()

Factory for creating valid execution contexts.

```typescript
import { createExecutionContext } from '@/core/context';

// Fresh context (auto-generates correlationId)
const ctx = createExecutionContext();

// Context from existing input
const ctx = createExecutionContext({
  correlationId: existingCorrelationId,
  tenantId: 'tenant-123',
  actor: { type: 'user', id: 'user-456' },
});
```

**Guarantees**:
- `correlationId` is **always present** (auto-generated if not provided)
- No business defaults (e.g., no default tenant or actor)

---

### Immutable Modifiers

Helpers to "mutate" context by returning new instances.

```typescript
import {
  withCorrelationId,
  withRequestId,
  withActor,
  withTenantId,
  withTrace,
  withMeta,
} from '@/core/context';

// Update correlation ID
const ctx2 = withCorrelationId(ctx, newCorrelationId);

// Update request ID
const ctx3 = withRequestId(ctx, newRequestId);

// Update actor
const ctx4 = withActor(ctx, { type: 'user', id: 'user-789' });

// Clear actor
const ctx5 = withActor(ctx, undefined);

// Update tenant ID
const ctx6 = withTenantId(ctx, 'tenant-456');

// Update trace
const ctx7 = withTrace(ctx, { spanId: 'span-123', parentSpanId: 'span-000' });

// Update metadata (replaces entire object, does NOT merge)
const ctx8 = withMeta(ctx, { customKey: 'customValue' });
```

**Note**: All modifiers perform **shallow copy** (`{ ...ctx, field }`). No deep merging.

---

## Usage Patterns

### Creating Context from HTTP Request

```typescript
import { createExecutionContext } from '@/core/context';
import { createCorrelationId, createRequestId } from '@/core/observability';

function extractContextFromRequest(req: Request): ExecutionContext {
  return createExecutionContext({
    correlationId: req.headers.get('x-correlation-id') as CorrelationId
      || createCorrelationId(),
    requestId: createRequestId(),
    tenantId: req.headers.get('x-tenant-id') || undefined,
    actor: req.user ? { type: 'user', id: req.user.id } : undefined,
  });
}
```

### Propagating Context Through Layers

```typescript
// Controller layer
async function handleRequest(req: Request) {
  const ctx = extractContextFromRequest(req);
  
  // Pass to service layer
  const result = await projectService.createProject(ctx, projectData);
  
  return result;
}

// Service layer
async function createProject(ctx: ExecutionContext, data: ProjectData) {
  // Use context for logging
  logger.info('Creating project', {
    correlationId: ctx.correlationId,
    tenantId: ctx.tenantId,
  });
  
  // Pass to repository layer
  const project = await projectRepo.save(ctx, data);
  
  return project;
}

// Repository layer
async function save(ctx: ExecutionContext, data: ProjectData) {
  // Use context for error handling
  try {
    // ... database operation
  } catch (err) {
    throw new AppError({
      code: 'DATABASE_ERROR',
      message: 'Failed to save project',
      correlationId: ctx.correlationId,
      cause: err,
    });
  }
}
```

### Updating Context Mid-Flow

```typescript
import { withActor, withTrace } from '@/core/context';

async function processWithImpersonation(ctx: ExecutionContext) {
  // Original context has system actor
  logger.info('Starting as system', { actor: ctx.actor });
  
  // Impersonate user for specific operation
  const userCtx = withActor(ctx, { type: 'user', id: 'user-123' });
  await performUserAction(userCtx);
  
  // Revert to system actor
  const systemCtx = withActor(ctx, { type: 'system' });
  await performSystemAction(systemCtx);
}
```

### Adding Trace Metadata

```typescript
import { withTrace } from '@/core/context';
import { randomUUID } from 'node:crypto';

async function tracedOperation(ctx: ExecutionContext) {
  const spanId = randomUUID();
  const tracedCtx = withTrace(ctx, {
    spanId,
    parentSpanId: ctx.trace?.spanId,
  });
  
  // ... operation with tracing
  
  return result;
}
```

---

## Design Decisions

### Why Immutable?

Immutability prevents accidental mutations and makes context flow explicit:

```typescript
// ❌ Would be error-prone if mutable
ctx.tenantId = 'new-tenant'; // Mutates shared reference!

// ✅ Explicit, functional style
const newCtx = withTenantId(ctx, 'new-tenant'); // New instance
```

### Why No AsyncLocalStorage (ALS)?

ALS is **not included at this layer** because:
1. **Separation of concerns**: Context *definition* vs. context *storage* are separate
2. **Flexibility**: Allows explicit passing (functional) or ALS (imperative) at higher layers
3. **Testability**: Easier to test with explicit context passing

**If you need ALS**, implement it in the transport/middleware layer:

```typescript
// Example: middleware layer (not in core/context)
import { AsyncLocalStorage } from 'node:async_hooks';

const contextStorage = new AsyncLocalStorage<ExecutionContext>();

export function runWithContext<T>(ctx: ExecutionContext, fn: () => T): T {
  return contextStorage.run(ctx, fn);
}

export function getContext(): ExecutionContext | undefined {
  return contextStorage.getStore();
}
```

### Why `tenantId` is `string` (not branded)?

At this layer, `tenantId` is a **technical identifier** without domain semantics. If your domain requires a branded `TenantId` type, define it in the domain layer and use `withTenantId()` to set it.

### Why `withMeta()` Replaces (Not Merges)?

Shallow replacement keeps the API simple and predictable:

```typescript
// ✅ Explicit merge if needed
const newCtx = withMeta(ctx, { ...ctx.meta, newKey: 'value' });

// ❌ If withMeta() auto-merged, behavior would be implicit and surprising
```

---

## Integration with Observability

```typescript
import { createCorrelationId, createRequestId, AppError } from '@/core/observability';
import { createExecutionContext, withRequestId } from '@/core/context';

// Create context
const ctx = createExecutionContext({
  correlationId: createCorrelationId(),
});

// Add request ID later
const ctxWithRequest = withRequestId(ctx, createRequestId());

// Use in error handling
throw new AppError({
  code: 'VALIDATION_FAILED',
  message: 'Invalid input',
  correlationId: ctx.correlationId,
  meta: { tenantId: ctx.tenantId },
});
```

---

## File Structure

```
src/core/context/
├── types.ts        # ExecutionContext, ExecutionActor, ExecutionTrace
├── factory.ts      # createExecutionContext()
├── modifiers.ts    # withCorrelationId(), withRequestId(), etc.
└── index.ts        # Barrel exports
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-01-08 | Initial release (types, factory, basic modifiers) |
| 0.1.1 | 2026-01-08 | Complete modifiers API (withActor, withTenantId, withTrace, withMeta) |

---

## Related Documentation

- [Observability Primitives](./observability.md)
- [Core Primitives Index](./README.md)
