# ADR-002: Arquitectura de Internacionalización en 3 Capas

**Status:** APROBADO - IMPERATIVO  
**Date:** 2025-01-18  
**Author:** Marcelo (Founder, VibeThink)  
**Context:** ViTo - Multi-producto, AI-first, Multi-tenant SaaS

---

## Problema

Sistema i18n actual tiene:
1. Blink/parpadeo visible en traducciones (SSR mismatch)
2. Carga todos los idiomas (~18MB) aunque usuario solo use 1
3. Sin arquitectura documentada
4. Riesgo de drift semántico entre UI y AI agents

## Decisión

Implementar **arquitectura de 3 capas** manteniendo registry pattern existente y agregando react-i18next para UI strings.

---

## Arquitectura

### CAPA 1: Semantic IDs (Identidad estable)

**Propósito:** Definir identidades únicas e inmutables.

**Ubicación:** `packages/utils/src/i18n/terminology/types.ts`

**Formato:** `concept.{domain}.{category}.{specific}`

**Regla:** IDs NUNCA se renombran (solo se agregan nuevos)

**Ejemplo:**
```typescript
type ConceptID =
  | 'concept.booking.resource.room'
  | 'concept.booking.action.reserve'
  | 'concept.crm.entity.lead';
```

---

### CAPA 2: Terminology (Semántica compartida)

**Propósito:** 
- Resolver nombres correctos según contexto
- Compartida entre UI y AI (evita drift)
- Overrides por producto/tenant

**Ubicación:** `packages/utils/src/i18n/terminology/`

**Backend:** TranslationLoader registry (existente) - NO i18next directo

**API:**
```typescript
// Async (AI agents)
term(conceptId: ConceptID, context: AgentContext): Promise<string>

// Sync (UI components, requiere preload)
termSync(conceptId: ConceptID, context?: TerminologyContext): string
```

**Estructura JSON:**
```
src/lib/i18n/translations/
├── en/
│   ├── concept.json           # Base
│   ├── concept-hotel.json     # Override hotel
│   ├── concept-studio.json    # Override studio
│   └── booking.json           # UI strings (CAPA 3A)
└── es/...
```

**Ejemplo:**
```json
// concept.json (base)
{
  "concept.booking.resource.room": "Resource"
}

// concept-hotel.json (override)
{
  "concept.booking.resource.room": "Room"
}

// concept-studio.json (override)
{
  "concept.booking.resource.room": "Recording Studio"
}
```

---

### CAPA 3A: UI Strings (Frases completas)

**Propósito:** Frases UI que usan términos de CAPA 2

**Backend:** react-i18next (nuevo para UI strings)

**API:** `useTranslation(namespace)` de react-i18next

**Ejemplo:**
```json
// booking.json
{
  "actions": {
    "reserve": "Reserve {{resourceLabel}}"
  }
}
```

**Uso:**
```typescript
const { t } = useTranslation('booking');
const resourceLabel = termSync('concept.booking.resource.room', {
  productContext: 'hotel'
});

<button>{t('actions.reserve', { resourceLabel })}</button>
// → "Reserve Room"
```

---

### CAPA 3B: AI Agents (NLG)

**Propósito:** Generación de lenguaje natural

**Backend:** TranslationLoader registry (existente)

**API:** `term()` de CAPA 2

**Ejemplo:**
```typescript
const resourceLabel = await term('concept.booking.resource.room', {
  domain: 'booking',
  productContext: 'hotel',
  locale: 'en',
  tenantId: 'acme'
});

return `I've confirmed your ${resourceLabel}`;
// → "I've confirmed your Room"
```

---

## Reglas Absolutas

### Regla 1: CAPA 1 es inmutable
```typescript
// ✅ Agregar nuevo
'concept.booking.resource.suite'

// ❌ NUNCA renombrar existente
'concept.booking.resource.room' → 'bedroom' // PROHIBIDO
```

### Regla 2: CAPA 2 es compartida (UI + AI)
```typescript
// ✅ Mismo término garantizado
const uiLabel = termSync('concept.booking.resource.room', ctx);
const aiLabel = await term('concept.booking.resource.room', ctx);
// Ambos retornan el mismo valor

// ❌ NO duplicar terminología
// NO crear concept-ui.json y concept-ai.json separados
```

### Regla 3: CAPA 3A y 3B NO se mezclan
```typescript
// ❌ UI NO importa ai-agents
import { agent } from '@/ai-agents'; // PROHIBIDO

// ❌ AI NO usa UI hooks
import { useTranslation } from 'react-i18next'; // PROHIBIDO en AI
```

### Regla 4: Mantener Registry Pattern
```typescript
// ✅ Terminology usa registry existente
const loader = getTranslationLoader();
const translations = await loader.load(locale, namespace);

// ❌ NO usar i18next directamente en terminology
// Solo para UI strings (CAPA 3A)
```

---

## Consecuencias

### Positivas
1. ✅ NO blink: SSR con traducciones (react-i18next para UI)
2. ✅ Carga selectiva: Solo idioma activo (~2MB vs ~18MB)
3. ✅ Consistencia UI/AI: CAPA 2 compartida
4. ✅ Context-aware: hotel/studio/cowork automático
5. ✅ Escalable: Agregar dominio = agregar JSON
6. ✅ Tenant customization: Overrides viables
7. ✅ Compatible: No rompe código existente

### Negativas
1. ⚠️ Complejidad inicial (3 capas)
2. ⚠️ Equipo debe entender arquitectura
3. ⚠️ +35KB bundle (react-i18next para UI)

### Mitigaciones
- Documentación clara (este ADR)
- Ejemplos en cada capa
- ESLint rules de enforcement
- Tests automáticos

---

## Validación

**Pre-commit:**
```bash
npm run validate:i18n  # Arquitectura compliance
npm run lint           # ESLint rules
npm run test           # Tests
```

---

## Referencias

- `packages/utils/src/i18n/terminology/README.md` - API docs
- `docs/i18n/DEVELOPMENT_GUIDE.md` - Guía desarrollo
- `docs/i18n/EXAMPLES.md` - Casos de uso

---

**FIN ADR-002**



