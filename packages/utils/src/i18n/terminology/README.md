# Terminology System - CAPA 2

Sistema de terminología compartida entre UI y AI agents.

## API

### `term(conceptId, context)`

Async. Para AI Agents. Context MANDATORIO.

```typescript
import { term } from '@vibethink/utils/i18n/terminology';

const label = await term('concept.booking.resource.room', {
  domain: 'booking',
  productContext: 'hotel',
  locale: 'es',
  tenantId: 'acme'
});
```

### `termSync(conceptId, context?)`

Sync. Para UI. Requiere preload.

```typescript
import { termSync } from '@vibethink/utils/i18n/terminology';

const label = termSync('concept.booking.resource.room', {
  productContext: 'hotel',
  locale: 'es'
});
```

### `preloadTerminology(locale, productContexts?)`

Precarga namespaces para uso síncrono.

```typescript
import { preloadTerminology } from '@vibethink/utils/i18n/terminology';

await preloadTerminology('es', ['hotel', 'studio']);
```

## Estructura JSON

```
src/lib/i18n/translations/
├── es/
│   ├── concept.json           # Base
│   ├── concept-hotel.json     # Override hotel
│   └── concept-studio.json    # Override studio
└── en/...
```

## Ver también

- `docs/architecture/ADR-002-i18n-3-layers.md` - Arquitectura completa



