# Core Primitives Documentation

This directory contains documentation for ViTo's core technical primitives.

## Modules

### [Observability](./observability.md)
Core observability primitives for distributed tracing, error handling, and event modeling.

**Version**: 1.0.0  
**Path**: `src/core/observability/`

**Exports**:
- `CorrelationId` (branded type + factory)
- `RequestId` (branded type + factory)
- `AppError` (normalized error class)
- `EventEnvelope<T>` (generic event type)

---

### [Execution Context](./execution-context.md)
Execution context carrier for propagating technical metadata across layers.

**Version**: 0.1.1  
**Path**: `src/core/context/`

**Exports**:
- `ExecutionContext` (type)
- `createExecutionContext()` (factory)
- Immutable modifiers (`withCorrelationId`, `withRequestId`, etc.)

---

## Design Principles

All core primitives follow these principles:

1. **No Vendor Lock**: Pure TypeScript, no framework dependencies
2. **No Domain Semantics**: Technical shapes only, no business logic
3. **Immutability**: Readonly types, functional modifiers
4. **Type Safety**: Branded types where appropriate
5. **ESM-First**: `.js` imports, Node >=20
6. **Minimal API**: Deliberate, focused exports

---

## Integration

```typescript
import {
  CorrelationId,
  createCorrelationId,
  AppError,
  EventEnvelope,
} from '@/core/observability';

import {
  ExecutionContext,
  createExecutionContext,
  withCorrelationId,
} from '@/core/context';

// Create context with correlation
const ctx = createExecutionContext({
  correlationId: createCorrelationId(),
  tenantId: 'tenant-123',
});

// Propagate through layers
const updatedCtx = withRequestId(ctx, createRequestId());
```

---

## Version History

| Module | Version | Date | Changes |
|--------|---------|------|---------|
| `observability` | 1.0.0 | 2026-01-08 | Initial release |
| `context` | 0.1.0 | 2026-01-08 | Initial release |
| `context` | 0.1.1 | 2026-01-08 | Complete modifiers API |

---

## Related Documentation

- [Architecture: Asset-Agnostic Verticals](../architecture/asset-agnostic-verticals.md)
- [ENG — Rector Pack v1](../eng/rector-pack-v1.md) *(if exists)*
