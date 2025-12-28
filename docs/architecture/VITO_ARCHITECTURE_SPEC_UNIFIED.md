# ViTo Architecture Spec — Unified Core System

**STATUS:** 🚨 **APPROVED & IMPERATIVE** (Execute Strict)  
**VERSION:** 3.0.0 (Final "Orchestrator-Ready")  
**STACK:** React 19 + Next.js 15.3 App Router (RSC) + TypeScript 5.9  
**CONTEXT:** Enterprise SaaS (CRM/Ops) + Orchestrator (Airbnb/PMS integration)  
**DB:** None (In-memory simulation for now)

---

## 0. MISSION

Construir el núcleo de infraestructura para ViTo que soporte:

1. **i18n/Terminology:** Consistencia total UI vs AI (sin drift semántico).
2. **Next.js Performance:** Cero bundle bloat (RSC async / Client snapshot).
3. **Timezone Safety:** Distinción estricta entre fechas civiles (Hotel) e instantes (Studio).
4. **External Normalization:** Ingesta de datos sucios (Airbnb/Calendar) a modelos internos limpios con timezone explícito.

---

## PART 1: i18n & TERMINOLOGY (The 3-Layer Law)

### 1.1 Layers

*   **Layer 1 - Semantic IDs:** `concept.{domain}.{category}.{specific}` (Inmutables).
*   **Layer 2 - Terminology (Shared Truth):** Diccionarios de entidades (`label`, `synonyms`, `description`, `gender`) para AI y Labels cortos de UI.
    *   *Storage:* `packages/terminology/concepts/{domain}/{locale}/*.json`
    *   *Resolution:* Base → Product → Workspace → Tenant (in-memory overrides).
*   **Layer 3 - UI Strings:** Traducciones de frases completas (`useTranslations`) por namespace.

### 1.2 Access Patterns (Next.js Optimization)

*   **Server Components / AI Agents:** `await term('concept.id', ctx)`
    *   Acceso directo a FileSystem/Cache.
*   **Client Components:** `useTerm('concept.id')`
    *   **REQ:** `useTerm` lee de un `SnapshotContext`.
    *   **BAN:** Prohibido importar JSONs de terminología en Client Components.
    *   **HYDRATION:** El Layout (RSC) genera el snapshot y lo pasa al `<TerminologyProvider>`.

### 1.3 AI Integration

*   Los agentes consumen `await getConcept('concept.id')` para construir un **Active Glossary** en su System Prompt.
*   Schema obligatorio para conceptos: `{ label: string, description?: string, synonyms?: string[] }`.

**Referencia completa:** Ver `docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md`

---

## PART 2: DATETIME STANDARD (The "No-Timezone-Wars" Law)

### 2.1 Canonical Types (`packages/utils/src/datetime/types.ts`)

*   **CivilDate:** `string` (Format: `'YYYY-MM-DD'`). Fecha de calendario. NO tiene hora. NO tiene timezone.
*   **InstantISO:** `string` (Format: ISO8601 con offset/Z). Punto físico en el tiempo.
*   **BookingUnit:** `'night' | 'hour' | 'day'`.

### 2.2 Discriminated Unions (Strict State)

```typescript
export type NormalizedWindow =
  | {
      kind: 'civil_range';
      domain: 'hotel' | 'coliving' | 'airbnb_like'; // Logic domain
      unit: 'night';
      resourceId: string;
      venueTimezone: string; // The truth source
      checkInDate: CivilDate;
      checkOutDate: CivilDate;
    }
  | {
      kind: 'instant_range';
      domain: 'studio' | 'cowork';
      unit: 'hour' | 'day';
      resourceId: string;
      venueTimezone: string;
      startAt: InstantISO;
      endAt: InstantISO;
    };
```

### 2.3 Parsing & Formatting Rules

*   **Parsing CivilDate:** Usar técnica "Safe Noon". Crear Date en `12:00:00 UTC` para evitar saltos por DST.
    *   ❌ `new Date('2025-01-01')` (BANNED)
    *   ✅ `civilDateToSafeDate('2025-01-01')` (Custom util)
*   **Rendering:**
    *   Siempre usar `Intl.DateTimeFormat` con `timeZone: venueTimezone`.
    *   SSR y Client deben renderizar idéntico (Venue Time).
    *   "User Local Time" solo permitido en componentes `<ClientOnly />`.

**Referencia completa:** Ver `docs/architecture/DATE_TIME_HANDLING_POSITION.md` (v1.2.0)

---

## PART 3: EXTERNAL NORMALIZATION (The Orchestrator Law)

### 3.1 Resource Context

ViTo orquesta recursos externos. El Timezone pertenece al RECURSO, no al usuario.

```typescript
// packages/utils/src/context/types.ts
export interface ResourceContext {
  resourceId: string;
  sourceSystem: 'airbnb' | 'pms' | 'google_calendar';
  timeZone: string; // IANA 'America/Cancun' (Derived from Lat/Lng or Config)
}
```

### 3.2 The Adapter Pattern

Todo dato que entra al sistema debe pasar por un Normalizador.

*   `normalizeExternalBooking(rawPayload, resourceCtx) -> NormalizedWindow`
*   **Regla:** Si el payload externo es ambiguo (ej: Airbnb solo da fecha), el normalizador usa `resourceCtx.timeZone` para anclar la verdad.

### 3.3 Normalization Examples

#### Airbnb Payload → NormalizedWindow

```typescript
// Input (Airbnb API)
const airbnbPayload = {
  listing_id: "12345",
  check_in: "2025-12-25",  // Solo fecha, sin timezone
  check_out: "2025-12-27",
  // ... otros campos
};

// Resource Context (de configuración o geocoding)
const resourceCtx: ResourceContext = {
  resourceId: "airbnb_12345",
  sourceSystem: 'airbnb',
  timeZone: 'America/Cancun', // Obtenido de lat/lng o config
};

// Normalización
const normalized = normalizeExternalBooking(airbnbPayload, resourceCtx);
// Output: NormalizedWindow con kind='civil_range', venueTimezone='America/Cancun'
```

#### Google Calendar → NormalizedWindow

```typescript
// Input (Google Calendar API)
const calendarEvent = {
  start: { dateTime: "2025-12-25T10:00:00-05:00" }, // Ya tiene timezone
  end: { dateTime: "2025-12-25T14:00:00-05:00" },
  // ...
};

// Resource Context
const resourceCtx: ResourceContext = {
  resourceId: "calendar_studio_1",
  sourceSystem: 'google_calendar',
  timeZone: 'America/Bogota', // Del recurso, no del evento
};

// Normalización (valida que el timezone del evento coincida con el recurso)
const normalized = normalizeExternalBooking(calendarEvent, resourceCtx);
// Output: NormalizedWindow con kind='instant_range', venueTimezone='America/Bogota'
```

---

## PART 4: IMPLEMENTATION PLAN (Step-by-Step)

### Phase A: Packages Foundation (Day 1)

1.  Crear `packages/utils` con:
    *   `src/datetime`: types, parsing (safe noon), formatters.
    *   `src/context`: ResourceContext types.
2.  Crear `packages/terminology` con:
    *   `src/loader` (FileSystem), `src/registry` (Singleton), `src/schema` (Zod).
    *   `src/hydration`: Provider & Hook logic.

### Phase B: Integration Logic (Day 2)

3.  Implementar `packages/integrations` con mocks de Airbnb/PMS.
4.  Crear `normalizers` que transformen raw JSON mocks a `NormalizedWindow`.
5.  Tests unitarios para asegurar que el timezone se inyecta correctamente.

### Phase C: UI & AI Connection (Day 3)

6.  Layout RSC en Next.js que cargue snapshot de terminología.
7.  UI Component que renderice fechas usando `formatBookingRange` (del utils package).
8.  Mock de AI Agent que reciba `Active Glossary` + `Venue Context` (Venue Time + Venue Now).

---

## PART 5: RESTRICTIONS & GATES (Linting)

1.  **No Direct Date:** Prohibir `new Date()`, `date-fns`, `moment` en UI code. Solo importar de `@packages/utils/datetime`.
2.  **No Raw Data:** UI Components nunca reciben `any` o tipos de Airbnb raw. Solo `NormalizedWindow`.
3.  **No Client Bloat:** Error si `use client` importa archivos desde `packages/terminology/concepts`.
4.  **No Drift:** Error si se usa un ConceptID que no existe en el JSON base.

### ESLint Rules

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "date-fns",
            "message": "Use @vibethink/utils/datetime instead"
          },
          {
            "name": "moment",
            "message": "Use @vibethink/utils/datetime instead"
          }
        ],
        "patterns": [
          {
            "group": ["packages/terminology/concepts/**"],
            "message": "Client components cannot import terminology JSON. Use useTerm() hook instead."
          }
        ]
      }
    ]
  }
}
```

---

## PART 6: FILE STRUCTURE

```
packages/
├── utils/
│   └── src/
│       ├── datetime/
│       │   ├── types.ts          # CivilDate, InstantISO, NormalizedWindow
│       │   ├── civil.ts          # civilDateToParts, diffCivilDates, safe noon
│       │   └── format.ts         # formatBookingRange, formatCivilRange, formatInstantRange
│       └── context/
│           └── types.ts          # ResourceContext
├── terminology/
│   ├── concepts/
│   │   ├── common/{locale}/*.json
│   │   ├── crm/{locale}/*.json
│   │   └── operations/{locale}/*.json
│   └── src/
│       ├── loader.ts             # FileSystemLoader
│       ├── registry.ts            # Singleton registry
│       ├── schema.ts              # Zod schemas
│       └── hydration/
│           ├── provider.tsx       # TerminologyProvider
│           ├── hook.ts             # useTerm hook
│           └── snapshot.ts        # Snapshot generation
└── integrations/
    └── src/
        ├── airbnb/
        │   ├── types.ts           # Airbnb raw types
        │   └── normalizer.ts      # normalizeAirbnbBooking
        ├── pms/
        │   └── normalizer.ts
        └── google_calendar/
            └── normalizer.ts
```

---

## PART 7: TESTING REQUIREMENTS

### Unit Tests

1. **DateTime:**
   - `civilDateToParts()` parsea correctamente
   - `diffCivilDates()` calcula días correctamente
   - `formatBookingRange()` respeta venueTimezone
   - Safe noon trick evita DST issues

2. **Terminology:**
   - `term()` resuelve correctamente con overrides
   - `useTerm()` lee de snapshot correctamente
   - Snapshot SSR == Client (hydration match)

3. **Normalization:**
   - Airbnb payload → NormalizedWindow (civil_range)
   - Google Calendar → NormalizedWindow (instant_range)
   - Timezone se inyecta correctamente desde ResourceContext

### Integration Tests

1. Layout RSC genera snapshot correcto
2. Client component renderiza sin hydration mismatch
3. AI Agent recibe Active Glossary correcto

---

## PART 8: EXECUTABLE INSTRUCTION FOR CURSOR

**Actúa como Principal Software Engineer.**

Implementa la arquitectura descrita paso a paso (Phase A → B → C).

**Prioridades:**
1. Seguridad de tipos (TypeScript estricto)
2. Integridad de datos (Zod)
3. Performance (RSC async, Client snapshot)
4. Timezone safety (venueTimezone como fuente única)

**No asumas nada:** Usa las definiciones de tipos explícitas arriba (`CivilDate`, `NormalizedWindow`, `ResourceContext`).

**Comienza creando la estructura de carpetas y los tipos fundamentales en `packages/utils`.**

---

## PART 9: REFERENCE DOCUMENTS

Este documento unifica y consolida:

1. **i18n/Terminology:** `docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md` (v2.1.1)
2. **DateTime Standard:** `docs/architecture/DATE_TIME_HANDLING_POSITION.md` (v1.2.0)
3. **IA First Components:** `docs/architecture/IA_FIRST_REUSABLE_COMPONENTS.md`

**En caso de conflicto:** Este documento (VITO_ARCHITECTURE_SPEC_UNIFIED.md v3.0.0) es la fuente de verdad.

---

**Última actualización:** 2025-12-21  
**Autor:** ViTo Architecture Team  
**Aprobado por:** Principal Software Engineer  
**Versión:** 3.0.0 (Final "Orchestrator-Ready")









