# 🚀 PROMPT FINAL CORREGIDO - Sistema i18n de 3 Capas (ViTo)

## ⚠️ INSTRUCCIONES CRÍTICAS

Este prompt implementa arquitectura de 3 capas **sin romper código existente**.

**IMPORTANTE:**
- ✅ **EXPANDIR** código actual (NO reemplazar)
- ✅ **MANTENER** registry pattern existente
- ✅ **MANTENER** routing por cookies (no [locale] en URL)
- ✅ **USAR** paths actuales (`src/lib/i18n/translations/`)
- ✅ **Idiomas correctos:** en, es, fr, pt, de, it, ko, ar, zh (SIN ru)

**EJECUTAR EN ORDEN. SIN EXCEPCIONES.**

---

## CONTEXTO DEL PROYECTO

**Stack:**
- Next.js 15.3.4
- React 19
- TypeScript 5.9
- react-i18next v16.5.0 (YA instalado)
- i18next v25.7.3 (YA instalado)

**Estructura actual:**
- Traducciones: `src/lib/i18n/translations/{lang}/{namespace}.json` (378 archivos)
- Terminology: `packages/utils/src/i18n/terminology.ts` (existe)
- Registry: `packages/utils/src/i18n/translation-loader-registry.ts` (mantener)
- Routing: Cookies (`NEXT_LOCALE`), NO [locale] en URL

**Productos:** hotel, studio, cowork, coliving  
**Roadmap:** CRM, Operations, HR, Finance

**Problemas a resolver:**
1. ❌ Blink/parpadeo en traducciones (SSR mismatch)
2. ❌ Cargar 9 idiomas completos aunque usuario solo use 1
3. ❌ Falta documentación arquitectura
4. ❌ Riesgo drift semántico UI vs AI

---

## ARQUITECTURA: 3 CAPAS

```
┌─────────────────────────────────────────────────────────────┐
│ CAPA 3: STRINGS (Cómo lo digo)                             │
│                                                             │
│ ┌──────────────────────┐    ┌──────────────────────┐      │
│ │ 3A: UI STRINGS       │    │ 3B: AI AGENTS        │      │
│ │ - useTranslation()   │    │ - term() con context │      │
│ │ - booking.json       │    │ - NLG/NLU            │      │
│ │ - react-i18next      │    │ - Registry pattern   │      │
│ └──────────────────────┘    └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                    ↓ usa                    ↓ usa
┌─────────────────────────────────────────────────────────────┐
│ CAPA 2: TERMINOLOGY (Cómo lo llamamos) - COMPARTIDA        │
│ - Labels cortos: "Habitación", "Sala"                      │
│ - Context overrides: hotel/studio/cowork                   │
│ - term() / termSync()                                      │
│ - Backend: TranslationLoader registry (existente)          │
│ - Ubicación: packages/utils/src/i18n/terminology/          │
└─────────────────────────────────────────────────────────────┘
                           ↓ referencia
┌─────────────────────────────────────────────────────────────┐
│ CAPA 1: SEMANTIC IDs (Lo que ES)                           │
│ - concept.booking.resource.room                            │
│ - concept.booking.action.reserve                           │
│ - IDs ESTABLES (nunca cambian)                             │
│ - Ubicación: packages/utils/src/i18n/terminology/types.ts │
└─────────────────────────────────────────────────────────────┘
```

**NOTA IMPORTANTE:** 
- CAPA 2 usa el **TranslationLoader registry existente** (NO i18next directo)
- CAPA 3A (UI) usa **react-i18next** para strings completas
- CAPA 3B (AI) usa **term()** del registry existente
- Esto mantiene compatibilidad y evita romper código

---

## FASE 1: DOCUMENTACIÓN (Día 1 - 2 horas)

### 1.1 Crear ADR-002

**Archivo:** `docs/architecture/ADR-002-i18n-3-layers.md`

**ACCIÓN:** CREAR archivo nuevo

```markdown
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
```

---

## FASE 2: EXPANDIR TERMINOLOGY (Día 2 - 6 horas)

### 2.1 Crear Types File

**Archivo:** `packages/utils/src/i18n/terminology/types.ts`

**ACCIÓN:** CREAR archivo nuevo (separar types del engine)

```typescript
/**
 * CAPA 1: Semantic IDs Types
 * 
 * Tipos canónicos para Concept IDs estables
 */

// ✅ Lista CORRECTA de idiomas (según proyecto actual)
export const SUPPORTED_LOCALES = [
  'en',
  'es',
  'fr',
  'pt',
  'de',
  'it',
  'ko',  // ✅ Coreano (existe en proyecto)
  'ar',
  'zh',
  // ❌ NO incluir 'ru' (no existe en proyecto)
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Contextos de producto soportados
 */
export type ProductContext =
  | 'hotel'
  | 'studio'
  | 'cowork'
  | 'coliving';

/**
 * Dominios de la plataforma
 */
export type DomainContext =
  | 'booking'
  | 'crm'
  | 'operations'
  | 'hr'
  | 'finance';

/**
 * CAPA 1: Concept IDs (Semantic IDs)
 * 
 * Formato: concept.{domain}.{category}.{specific}
 * 
 * REGLA: NUNCA renombrar, solo agregar nuevos
 */

// Booking domain
export type BookingConcept =
  // Resources
  | 'concept.booking.resource.room'
  | 'concept.booking.resource.studio_room'
  | 'concept.booking.resource.meeting_room'
  | 'concept.booking.resource.cowork_desk'
  | 'concept.booking.resource.coliving_room'
  | 'concept.booking.resource.equipment'
  
  // Units
  | 'concept.booking.unit.hour'
  | 'concept.booking.unit.night'
  | 'concept.booking.unit.day'
  | 'concept.booking.unit.week'
  | 'concept.booking.unit.month'
  
  // Actions
  | 'concept.booking.action.reserve'
  | 'concept.booking.action.cancel'
  | 'concept.booking.action.modify'
  | 'concept.booking.action.confirm'
  | 'concept.booking.action.check_in'
  | 'concept.booking.action.check_out'
  
  // Status
  | 'concept.booking.status.pending'
  | 'concept.booking.status.confirmed'
  | 'concept.booking.status.cancelled'
  | 'concept.booking.status.completed';

// CRM domain
export type CRMConcept =
  | 'concept.crm.entity.lead'
  | 'concept.crm.entity.contact'
  | 'concept.crm.entity.company'
  | 'concept.crm.action.qualify'
  | 'concept.crm.action.convert';

/**
 * Union de todos los concepts
 */
export type ConceptID =
  | BookingConcept
  | CRMConcept;

/**
 * Context para resolución de terminology (opcional en UI)
 */
export interface TerminologyContext {
  domain?: DomainContext;
  productContext?: ProductContext;
  locale?: Locale;
  tenantId?: string;
}

/**
 * Context MANDATORIO para AI Agents
 */
export interface AgentContext {
  domain: DomainContext;
  productContext: ProductContext;
  locale: Locale;
  tenantId: string;
  timezone?: string;
  currency?: string;
}
```

---

### 2.2 Expandir Engine (CRÍTICO)

**Archivo:** `packages/utils/src/i18n/terminology/engine.ts`

**ACCIÓN:** REEMPLAZAR contenido de `terminology.ts` con nueva implementación

**IMPORTANTE:** Mantener uso del registry pattern, solo agregar lógica de context overrides

```typescript
/**
 * CAPA 2: Terminology Engine
 * 
 * Backend: TranslationLoader registry (existente)
 * Soporta: context overrides, async/sync, cache
 * 
 * IMPORTANTE: NO usa i18next directamente, usa registry para mantener compatibilidad
 */

import { getTranslationLoader } from '../translation-loader-registry';
import { 
  ConceptID, 
  AgentContext, 
  TerminologyContext, 
  Locale, 
  ProductContext 
} from './types';
import { terminologyCache, clearTerminologyCache } from './cache';

/**
 * Extrae valor de traducción (soporta objeto o string)
 */
function extractTranslationValue(
  data: any,
  conceptId: string
): string | null {
  if (!data) return null;
  
  // Si es string directo
  if (typeof data === 'string') {
    return data;
  }
  
  // Si es objeto con conceptId como key
  if (data[conceptId]) {
    const value = data[conceptId];
    // Si es objeto con label, extraer label
    if (typeof value === 'object' && value.label) {
      return value.label;
    }
    // Si es string, retornar directo
    if (typeof value === 'string') {
      return value;
    }
  }
  
  return null;
}

/**
 * Resuelve terminology (Async - para AI Agents)
 * 
 * CAPA 2 API Principal
 * 
 * @param conceptId - Semantic ID de CAPA 1
 * @param context - AgentContext MANDATORIO
 * 
 * @example
 * await term('concept.booking.resource.room', {
 *   domain: 'booking',
 *   productContext: 'hotel',
 *   locale: 'en',
 *   tenantId: 'acme'
 * });
 * // → "Room"
 */
export async function term(
  conceptId: ConceptID,
  context: AgentContext
): Promise<string> {
  const { domain, productContext, locale, tenantId } = context;
  
  // Validación estricta
  if (!domain || !productContext || !locale || !tenantId) {
    throw new Error(
      `[Terminology] AgentContext incomplete. ` +
      `Required: domain, productContext, locale, tenantId. ` +
      `Got: ${JSON.stringify(context)}`
    );
  }

  // ✅ Usar registry existente (NO i18next directo)
  const loader = getTranslationLoader();
  
  // Namespace base
  const baseNS = 'concept';
  
  // Namespace override por producto
  const productNS = `concept-${productContext}`; // concept-hotel, concept-studio

  // Cache key
  const cacheKey = `${locale}::${productContext}::${conceptId}`;
  
  // Verificar cache
  const cached = terminologyCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Intentar override primero (productNS)
  try {
    const overrideTranslations = await loader.load(locale, productNS as any);
    const overrideValue = extractTranslationValue(overrideTranslations, conceptId);
    
    if (overrideValue) {
      terminologyCache.set(cacheKey, overrideValue);
      return overrideValue;
    }
  } catch (error) {
    // Override no existe, continuar con base
  }
  
  // Fallback a base
  try {
    const baseTranslations = await loader.load(locale, baseNS as any);
    const baseValue = extractTranslationValue(baseTranslations, conceptId);
    
    if (baseValue) {
      terminologyCache.set(cacheKey, baseValue);
      return baseValue;
    }
  } catch (error) {
    console.warn(`[Terminology] Failed to load ${baseNS} for ${locale}:`, error);
  }
  
  // No encontrado
  console.warn(`[Terminology] Concept not found: ${conceptId} in locale ${locale}`);
  return conceptId;
}

/**
 * Resuelve terminology (Sync - para UI)
 * 
 * IMPORTANTE: Requiere preload con preloadTerminology()
 * 
 * @param conceptId - Semantic ID de CAPA 1
 * @param context - TerminologyContext opcional
 * 
 * @example
 * termSync('concept.booking.resource.room', {
 *   productContext: 'hotel',
 *   locale: 'en'
 * });
 * // → "Room"
 */
export function termSync(
  conceptId: ConceptID,
  context: TerminologyContext = {}
): string {
  const locale = (context.locale || 'en') as Locale;
  const productContext = context.productContext;
  
  // Check cache
  const cacheKey = `${locale}::${productContext || 'base'}::${conceptId}`;
  const cached = terminologyCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // ✅ Usar registry existente (síncrono, requiere preload)
  const loader = getTranslationLoader();
  
  const baseNS = 'concept';
  const productNS = productContext ? `concept-${productContext}` : null;

  // Intentar override primero
  if (productNS) {
    try {
      const overrideTranslations = loader.loadSync(locale, productNS as any);
      if (overrideTranslations) {
        const overrideValue = extractTranslationValue(overrideTranslations, conceptId);
        if (overrideValue) {
          terminologyCache.set(cacheKey, overrideValue);
          return overrideValue;
        }
      }
    } catch (error) {
      // Override no precargado o no existe
    }
  }
  
  // Fallback a base
  try {
    const baseTranslations = loader.loadSync(locale, baseNS as any);
    if (baseTranslations) {
      const baseValue = extractTranslationValue(baseTranslations, conceptId);
      if (baseValue) {
        terminologyCache.set(cacheKey, baseValue);
        return baseValue;
      }
    }
  } catch (error) {
    console.warn(
      `[Terminology] termSync called without preload for: ${conceptId}. ` +
      `Call preloadTerminology() first. Error: ${error}`
    );
  }
  
  // No encontrado
  return conceptId;
}

/**
 * Precarga terminology para uso síncrono
 * 
 * Llamar en Server Component o al inicio de app
 * 
 * @param locale - Idioma a precargar
 * @param productContexts - Productos a precargar (opcional)
 * 
 * @example
 * await preloadTerminology('en', ['hotel', 'studio']);
 */
export async function preloadTerminology(
  locale: Locale,
  productContexts?: ProductContext[]
): Promise<void> {
  const loader = getTranslationLoader();
  
  // Preload base
  await loader.preload(locale, 'concept' as any);
  
  // Preload overrides
  if (productContexts && productContexts.length > 0) {
    await Promise.all(
      productContexts.map(ctx => loader.preload(locale, `concept-${ctx}` as any))
    );
  }
}

/**
 * Limpia cache (para tests)
 */
export function clearCache(): void {
  clearTerminologyCache();
}

/**
 * Obtiene estadísticas del cache (debugging)
 */
export { getCacheStats } from './cache';
```

---

### 2.3 Actualizar Cache

**Archivo:** `packages/utils/src/i18n/terminology/cache.ts`

**ACCIÓN:** CREAR archivo nuevo (mover de terminology-cache.ts si existe)

```typescript
/**
 * Cache simple en memoria para terminology
 * 
 * CAPA 2: Terminology Cache
 */
export const terminologyCache = new Map<string, string>();

export function clearTerminologyCache(): void {
  terminologyCache.clear();
}

export function getCacheStats() {
  return {
    size: terminologyCache.size,
    keys: Array.from(terminologyCache.keys()).slice(0, 10),
  };
}
```

---

### 2.4 Actualizar Index

**Archivo:** `packages/utils/src/i18n/terminology/index.ts`

**ACCIÓN:** CREAR archivo nuevo

```typescript
/**
 * CAPA 2: Terminology System Exports
 */

// CAPA 1: Types
export type {
  Locale,
  ProductContext,
  DomainContext,
  ConceptID,
  BookingConcept,
  CRMConcept,
  TerminologyContext,
  AgentContext,
} from './types';

export { SUPPORTED_LOCALES } from './types';

// CAPA 2: Engine
export {
  term,
  termSync,
  preloadTerminology,
  clearCache,
  getCacheStats,
} from './engine';
```

---

### 2.5 Actualizar terminology.ts (Migración)

**Archivo:** `packages/utils/src/i18n/terminology.ts`

**ACCIÓN:** REEMPLAZAR contenido con re-export desde nueva estructura

```typescript
/**
 * DEPRECATED: Usar packages/utils/src/i18n/terminology/index.ts
 * 
 * Mantenido para compatibilidad hacia atrás
 * @deprecated Importar desde './terminology' directamente
 */

// Re-export everything from new structure
export * from './terminology/index';
```

---

### 2.6 Actualizar Exports en packages/utils

**Archivo:** `packages/utils/src/index.ts`

**ACCIÓN:** ACTUALIZAR exports de terminology (buscar sección existente y actualizar)

```typescript
// ... existing exports ...

// Export Terminology System (CAPA 2)
export {
  term,
  termSync,
  preloadTerminology,
  clearCache,
  getCacheStats,
  SUPPORTED_LOCALES,
} from './i18n/terminology';

export type {
  Locale,
  ProductContext,
  DomainContext,
  ConceptID,
  BookingConcept,
  CRMConcept,
  TerminologyContext,
  AgentContext,
} from './i18n/terminology';
```

---

## FASE 3: ARCHIVOS JSON (Día 3 - 4 horas)

### 3.1 Expandir concept.json Base (Español)

**Archivo:** `apps/dashboard/src/lib/i18n/translations/es/concept.json`

**ACCIÓN:** EXPANDIR archivo existente con nuevos concept IDs

**IMPORTANTE:** No borrar contenido existente, solo AGREGAR nuevos keys

```json
{
  "concept.booking.resource.room": "Recurso",
  "concept.booking.resource.studio_room": "Sala",
  "concept.booking.resource.meeting_room": "Sala de reuniones",
  "concept.booking.resource.cowork_desk": "Puesto",
  "concept.booking.resource.coliving_room": "Habitación",
  "concept.booking.resource.equipment": "Equipamiento",
  
  "concept.booking.unit.hour": "hora",
  "concept.booking.unit.night": "noche",
  "concept.booking.unit.day": "día",
  "concept.booking.unit.week": "semana",
  "concept.booking.unit.month": "mes",
  
  "concept.booking.action.reserve": "Reservar",
  "concept.booking.action.cancel": "Cancelar",
  "concept.booking.action.modify": "Modificar",
  "concept.booking.action.confirm": "Confirmar",
  "concept.booking.action.check_in": "Check-in",
  "concept.booking.action.check_out": "Check-out",
  
  "concept.booking.status.pending": "Pendiente",
  "concept.booking.status.confirmed": "Confirmada",
  "concept.booking.status.cancelled": "Cancelada",
  "concept.booking.status.completed": "Completada"
}
```

**NOTA:** Si el archivo ya tiene keys existentes (como `concept.hotel.booking.entity`), mantenerlos y agregar los nuevos arriba.

---

### 3.2 Crear Override Hotel (Español)

**Archivo:** `apps/dashboard/src/lib/i18n/translations/es/concept-hotel.json`

**ACCIÓN:** CREAR archivo nuevo

```json
{
  "concept.booking.resource.room": "Habitación",
  "concept.booking.resource.studio_room": "Suite",
  "concept.booking.resource.meeting_room": "Sala de eventos"
}
```

---

### 3.3 Crear Override Studio (Español)

**Archivo:** `apps/dashboard/src/lib/i18n/translations/es/concept-studio.json`

**ACCIÓN:** CREAR archivo nuevo

```json
{
  "concept.booking.resource.room": "Cabina",
  "concept.booking.resource.studio_room": "Sala de grabación",
  "concept.booking.resource.equipment": "Equipo de audio"
}
```

---

### 3.4 Crear Override Coliving (Español)

**Archivo:** `apps/dashboard/src/lib/i18n/translations/es/concept-coliving.json`

**ACCIÓN:** CREAR archivo nuevo

```json
{
  "concept.booking.resource.room": "Espacio compartido",
  "concept.booking.resource.coliving_room": "Habitación privada",
  "concept.booking.action.reserve": "Apartar"
}
```

---

### 3.5 Crear Override Cowork (Español)

**Archivo:** `apps/dashboard/src/lib/i18n/translations/es/concept-cowork.json`

**ACCIÓN:** CREAR archivo nuevo

```json
{
  "concept.booking.resource.room": "Puesto",
  "concept.booking.resource.cowork_desk": "Escritorio compartido",
  "concept.booking.resource.meeting_room": "Sala de trabajo"
}
```

---

### 3.6 Repetir para Inglés

**Archivos a crear/expandir:**
- `apps/dashboard/src/lib/i18n/translations/en/concept.json` (EXPANDIR)
- `apps/dashboard/src/lib/i18n/translations/en/concept-hotel.json` (CREAR)
- `apps/dashboard/src/lib/i18n/translations/en/concept-studio.json` (CREAR)
- `apps/dashboard/src/lib/i18n/translations/en/concept-coliving.json` (CREAR)
- `apps/dashboard/src/lib/i18n/translations/en/concept-cowork.json` (CREAR)

**Contenido inglés:**
```json
// concept.json (base) - EXPANDIR existente
{
  "concept.booking.resource.room": "Resource",
  "concept.booking.resource.studio_room": "Room",
  "concept.booking.resource.meeting_room": "Meeting Room",
  "concept.booking.resource.cowork_desk": "Desk",
  "concept.booking.resource.coliving_room": "Room",
  "concept.booking.resource.equipment": "Equipment",
  "concept.booking.action.reserve": "Reserve",
  "concept.booking.status.confirmed": "Confirmed"
}

// concept-hotel.json (CREAR)
{
  "concept.booking.resource.room": "Room",
  "concept.booking.resource.studio_room": "Suite"
}

// concept-studio.json (CREAR)
{
  "concept.booking.resource.room": "Booth",
  "concept.booking.resource.studio_room": "Recording Studio",
  "concept.booking.resource.equipment": "Audio Equipment"
}

// concept-coliving.json (CREAR)
{
  "concept.booking.resource.room": "Shared Space",
  "concept.booking.resource.coliving_room": "Private Room",
  "concept.booking.action.reserve": "Book"
}

// concept-cowork.json (CREAR)
{
  "concept.booking.resource.room": "Desk",
  "concept.booking.resource.cowork_desk": "Shared Desk",
  "concept.booking.resource.meeting_room": "Workspace"
}
```

---

### 3.7 Repetir para Resto de Idiomas

**Para cada idioma:** fr, pt, de, it, ko, ar, zh

**Crear archivos:**
```
apps/dashboard/src/lib/i18n/translations/{lang}/concept.json (expandir si existe)
apps/dashboard/src/lib/i18n/translations/{lang}/concept-hotel.json (crear)
apps/dashboard/src/lib/i18n/translations/{lang}/concept-studio.json (crear)
apps/dashboard/src/lib/i18n/translations/{lang}/concept-coliving.json (crear)
apps/dashboard/src/lib/i18n/translations/{lang}/concept-cowork.json (crear)
```

**Total:** 9 idiomas × 5 archivos = 45 archivos (algunos ya existen, expandirlos)

**Template base para otros idiomas** (ajustar traducciones según idioma):
```json
// concept.json (base) - AGREGAR keys nuevos
{
  "concept.booking.resource.room": "[Traducir: Resource]",
  "concept.booking.action.reserve": "[Traducir: Reserve]",
  "concept.booking.status.confirmed": "[Traducir: Confirmed]"
}

// concept-hotel.json (CREAR)
{
  "concept.booking.resource.room": "[Traducir: Room]"
}

// concept-studio.json (CREAR)
{
  "concept.booking.resource.room": "[Traducir: Booth]",
  "concept.booking.resource.studio_room": "[Traducir: Recording Studio]"
}
```

---

## FASE 4: NEXT.JS INTEGRATION (Día 4 - 4 horas)

### 4.1 Instalar Dependencia

```bash
# Verificar que ya están instaladas
npm list react-i18next i18next

# Instalar solo la que falta
npm install i18next-resources-to-backend --save
```

---

### 4.2 I18n Config

**Archivo:** `apps/dashboard/lib/i18n/config.ts`

**ACCIÓN:** CREAR archivo nuevo

```typescript
/**
 * i18n Configuration
 * 
 * Configuración centralizada para UI strings (CAPA 3A)
 */

import { SUPPORTED_LOCALES, type Locale } from '@vibethink/utils/i18n/terminology';

export const defaultLocale: Locale = 'en';
export const locales = SUPPORTED_LOCALES;

export const namespaces = [
  'common',
  'navigation',
  'booking',
  'errors',
] as const;

export type Namespace = (typeof namespaces)[number];
```

---

### 4.3 Server Init (CON cookies)

**Archivo:** `apps/dashboard/lib/i18n/server.ts`

**ACCIÓN:** CREAR archivo nuevo

```typescript
/**
 * Server-side i18n initialization
 * 
 * CAPA 3A: UI Strings con react-i18next
 * Lee locale de cookie NEXT_LOCALE (NO de URL)
 */

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { cookies } from 'next/headers';
import { Locale, defaultLocale, locales } from './config';

/**
 * Init i18next para Server Components
 * 
 * Resuelve blink: HTML ya incluye traducciones
 */
export async function initI18nServer(ns: string[] = ['common']) {
  // ✅ Leer de cookie (estructura actual)
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || defaultLocale;

  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          // ✅ Path CORRECTO según estructura actual
          import(`@/lib/i18n/translations/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: 'common',
      fallbackNS: 'common',
      ns,
      preload: [locale], // ✅ Solo idioma activo (NO todos)
      
      react: {
        useSuspense: false,
      },
    });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    locale,
  };
}
```

---

### 4.4 Client Provider

**Archivo:** `apps/dashboard/lib/i18n/client.tsx`

**ACCIÓN:** CREAR archivo nuevo

```typescript
'use client';

/**
 * Client-side i18n provider
 * 
 * CAPA 3A: UI Strings
 * Hidrata con resources del servidor (NO blink)
 */

import { createInstance, Resource } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { ReactNode, useEffect, useState } from 'react';
import { Locale } from './config';

interface TranslationProviderProps {
  children: ReactNode;
  locale: Locale;
  resources?: Resource;
  namespaces?: string[];
}

export function TranslationProvider({
  children,
  locale,
  resources,
  namespaces = ['common'],
}: TranslationProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    const initI18n = async () => {
      const instance = createInstance();

      await instance
        .use(initReactI18next)
        .use(
          resourcesToBackend(
            (language: string, namespace: string) =>
              import(`@/lib/i18n/translations/${language}/${namespace}.json`)
          )
        )
        .init({
          lng: locale,
          fallbackLng: 'en',
          defaultNS: 'common',
          ns: namespaces,
          resources, // ✅ Hidrata con server resources (NO blink)
          
          react: {
            useSuspense: false,
          },
        });

      setI18nInstance(instance);
    };

    initI18n();
  }, [locale, resources, namespaces]);

  if (!i18nInstance) {
    return null; // O skeleton
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
```

---

### 4.5 Actualizar Layout

**Archivo:** `apps/dashboard/app/layout.tsx`

**ACCIÓN:** ACTUALIZAR layout existente (NO reemplazar todo)

**IMPORTANTE:** Mantener código existente, solo agregar imports y preload

```typescript
import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { DEFAULT_THEME } from "@/shared/lib/themes";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/lib/i18n"; // ← Mantener existente
import { isValidLocale } from "@/lib/i18n/config";
// ✅ NUEVO: Imports para 3 capas
import { initI18nServer } from "@/lib/i18n/server"; // CAPA 3A
import { TranslationProvider } from "@/lib/i18n/client"; // CAPA 3A
import { preloadTerminology } from "@vibethink/utils/i18n/terminology"; // CAPA 2

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("theme_preset")?.value ?? DEFAULT_THEME.preset) as any,
    scale: (cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.scale) as any,
    radius: (cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.radius) as any,
    contentLayout: (cookieStore.get("theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout) as any
  };

  // Get locale from cookie or header
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const initialLocale = localeCookie && isValidLocale(localeCookie) ? localeCookie : 'en';

  // ✅ NUEVO: Init UI i18n (CAPA 3A)
  const { i18n, resources, locale } = await initI18nServer(['common', 'navigation']);

  // ✅ NUEVO: Preload terminology (CAPA 2)
  await preloadTerminology(locale, ['hotel', 'studio', 'cowork', 'coliving']);

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans")}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          {/* ✅ NUEVO: TranslationProvider para UI strings (CAPA 3A) */}
          <TranslationProvider 
            locale={locale} 
            resources={resources}
            namespaces={['common', 'navigation']}
          >
            {/* ✅ MANTENER: I18nProvider existente (si es necesario para compatibilidad) */}
            <I18nProvider initialLocale={initialLocale} preloadNamespaces={['common', 'navigation', 'theme', 'hotel', 'chat', 'projects', 'mail', 'calendar', 'analytics', 'ecommerce', 'default', 'crm', 'tasks', 'api-keys', 'dashboard-vibethink', 'dashboard-bundui', 'ai-chat']}>
              <AuthProvider>
                <NextTopLoader
                  color="hsl(var(--primary))"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={4}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
                  zIndex={99999}
                />
                {children}
              </AuthProvider>
            </I18nProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**NOTA:** Si `I18nProvider` existente causa conflictos, se puede eliminar gradualmente. Por ahora mantener ambos para compatibilidad.

---

### 4.6 Componente Ejemplo

**Archivo:** `apps/dashboard/src/components/examples/BookingCardExample.tsx`

**ACCIÓN:** CREAR archivo nuevo

```typescript
'use client';

/**
 * Componente ejemplo demostrando 3 capas
 * 
 * CAPA 2: termSync() para terminology
 * CAPA 3A: useTranslation() para UI strings
 */

import { useTranslation } from 'react-i18next';
import { termSync } from '@vibethink/utils/i18n/terminology';
import type { ProductContext } from '@vibethink/utils/i18n/terminology';

interface BookingCardExampleProps {
  productContext: ProductContext;
}

export function BookingCardExample({ productContext }: BookingCardExampleProps) {
  // CAPA 3A: UI strings
  const { t, i18n } = useTranslation('booking');
  
  // CAPA 2: Terminology
  const resourceLabel = termSync('concept.booking.resource.room', {
    productContext,
    locale: i18n.language as any,
  });
  
  const actionLabel = termSync('concept.booking.action.reserve', {
    locale: i18n.language as any,
  });
  
  const statusLabel = termSync('concept.booking.status.confirmed', {
    locale: i18n.language as any,
  });

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h3 className="text-lg font-bold">{t('title', 'Bookings')}</h3>
      
      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium">Resource:</span> {resourceLabel}
        </p>
        <p className="text-sm">
          <span className="font-medium">Status:</span> {statusLabel}
        </p>
      </div>

      <button className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
        {actionLabel} {resourceLabel}
      </button>
      
      <p className="text-xs text-gray-500">
        Context: <code>{productContext}</code> | Locale: <code>{i18n.language}</code>
      </p>
    </div>
  );
}
```

---

### 4.7 Página de Testing

**Archivo:** `apps/dashboard/app/test-i18n/page.tsx`

**ACCIÓN:** CREAR archivo nuevo

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BookingCardExample } from '@/components/examples/BookingCardExample';
import { initI18nServer } from '@/lib/i18n/server';

export default async function TestI18nPage() {
  const { locale } = await initI18nServer(['booking']);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">i18n 3-Layers Testing Page</h1>
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Arquitectura de 3 Capas:</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><strong>CAPA 1:</strong> Semantic IDs (concept.booking.resource.room)</li>
          <li><strong>CAPA 2:</strong> Terminology compartida (termSync/term)</li>
          <li><strong>CAPA 3A:</strong> UI Strings (useTranslation)</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Hotel Context</h2>
          <BookingCardExample productContext="hotel" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Studio Context</h2>
          <BookingCardExample productContext="studio" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cowork Context</h2>
          <BookingCardExample productContext="cowork" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Coliving Context</h2>
          <BookingCardExample productContext="coliving" />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Verificar:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Hotel: "Room" / "Habitación"</li>
          <li>Studio: "Recording Studio" / "Sala de grabación"</li>
          <li>Cowork: "Desk" / "Puesto"</li>
          <li>Coliving: "Shared Space" / "Espacio compartido"</li>
          <li>Cambiar idioma NO hace blink</li>
          <li>Solo 1 idioma se descarga (verificar en Network tab)</li>
        </ul>
      </div>
    </div>
  );
}
```

---

### 4.8 Language Switcher (CON cookies)

**Archivo:** `apps/dashboard/src/components/LanguageSwitcher.tsx`

**ACCIÓN:** CREAR archivo nuevo

```typescript
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function changeLanguage(newLocale: Locale) {
    startTransition(() => {
      // ✅ Actualizar cookie (NO URL)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      
      // ✅ Reload para aplicar (mantiene ruta actual)
      router.refresh();
    });
  }

  return (
    <select
      value={currentLocale}
      onChange={(e) => changeLanguage(e.target.value as Locale)}
      disabled={isPending}
      className="border rounded px-2 py-1"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="pt">Português</option>
      <option value="de">Deutsch</option>
      <option value="it">Italiano</option>
      <option value="ko">한국어</option>
      <option value="ar">العربية</option>
      <option value="zh">中文</option>
    </select>
  );
}
```

---

## FASE 5: TESTS (Día 5 - 3 horas)

### 5.1 Test Terminology Engine

**Archivo:** `packages/utils/src/i18n/terminology/__tests__/engine.test.ts`

**ACCIÓN:** CREAR archivo nuevo

```typescript
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { term, termSync, preloadTerminology, clearCache } from '../engine';
import type { AgentContext } from '../types';
import { registerTranslationLoader } from '../../translation-loader-registry';

// Mock TranslationLoader
const mockLoader = {
  load: vi.fn(),
  loadSync: vi.fn(),
  preload: vi.fn(),
  isPreloaded: vi.fn(),
  clearCache: vi.fn(),
};

beforeEach(() => {
  clearCache();
  vi.clearAllMocks();
  registerTranslationLoader(mockLoader as any);
});

describe('Terminology Engine', () => {
  describe('term() - Async for AI', () => {
    test('resuelve concept con override de producto', async () => {
      // Mock override
      mockLoader.load.mockResolvedValueOnce({
        'concept.booking.resource.room': 'Room',
      });

      const context: AgentContext = {
        domain: 'booking',
        productContext: 'hotel',
        locale: 'en',
        tenantId: 'test',
      };

      const label = await term('concept.booking.resource.room', context);
      
      expect(label).toBe('Room');
      expect(mockLoader.load).toHaveBeenCalledWith('en', 'concept-hotel');
    });

    test('fallback a base si override no existe', async () => {
      // Override no existe
      mockLoader.load.mockRejectedValueOnce(new Error('Not found'));
      
      // Mock base
      mockLoader.load.mockResolvedValueOnce({
        'concept.booking.resource.room': 'Resource',
      });

      const context: AgentContext = {
        domain: 'booking',
        productContext: 'hotel',
        locale: 'en',
        tenantId: 'test',
      };

      const label = await term('concept.booking.resource.room', context);
      
      expect(label).toBe('Resource');
      expect(mockLoader.load).toHaveBeenCalledWith('en', 'concept');
    });

    test('lanza error sin context completo', async () => {
      const incompleteContext = {
        domain: 'booking',
        locale: 'en',
        // Falta productContext y tenantId
      } as any;

      await expect(
        term('concept.booking.resource.room', incompleteContext)
      ).rejects.toThrow('AgentContext incomplete');
    });
  });

  describe('termSync() - Sync for UI', () => {
    test('resuelve concept con preload', () => {
      // Mock preload
      mockLoader.loadSync.mockReturnValue({
        'concept.booking.resource.room': 'Room',
      });

      const label = termSync('concept.booking.resource.room', {
        productContext: 'hotel',
        locale: 'en',
      });

      expect(label).toBe('Room');
      expect(mockLoader.loadSync).toHaveBeenCalledWith('en', 'concept-hotel');
    });

    test('usa cache en llamadas repetidas', () => {
      mockLoader.loadSync.mockReturnValue({
        'concept.booking.resource.room': 'Room',
      });

      const label1 = termSync('concept.booking.resource.room', {
        productContext: 'hotel',
        locale: 'en',
      });

      const label2 = termSync('concept.booking.resource.room', {
        productContext: 'hotel',
        locale: 'en',
      });

      expect(label1).toBe(label2);
      expect(label1).toBe('Room');
      expect(mockLoader.loadSync).toHaveBeenCalledTimes(1); // Solo una vez gracias al cache
    });
  });

  describe('preloadTerminology()', () => {
    test('precarga base y overrides', async () => {
      mockLoader.preload.mockResolvedValue(undefined);

      await preloadTerminology('en', ['hotel', 'studio']);

      expect(mockLoader.preload).toHaveBeenCalledWith('en', 'concept');
      expect(mockLoader.preload).toHaveBeenCalledWith('en', 'concept-hotel');
      expect(mockLoader.preload).toHaveBeenCalledWith('en', 'concept-studio');
      expect(mockLoader.preload).toHaveBeenCalledTimes(3);
    });
  });
});
```

---

### 5.2 Setup Vitest Config

**Archivo:** `packages/utils/vitest.config.ts`

**ACCIÓN:** CREAR si no existe

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../apps/dashboard/src'),
    },
  },
});
```

---

## FASE 6: VALIDACIÓN Y DOCUMENTACIÓN (Día 6 - 2 horas)

### 6.1 Script de Validación

**Archivo:** `scripts/validate-i18n.ts`

**ACCIÓN:** CREAR archivo nuevo

```typescript
#!/usr/bin/env node

import { existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface ValidationResult {
  pass: boolean;
  errors: string[];
}

/**
 * Valida que archivos JSON existan
 */
function validateJSONFilesExist(): ValidationResult {
  const errors: string[] = [];
  
  const locales = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
  const requiredFiles = [
    'concept-hotel.json',
    'concept-studio.json',
    'concept-coliving.json',
    'concept-cowork.json',
  ];
  
  locales.forEach(locale => {
    requiredFiles.forEach(file => {
      const filePath = join(
        process.cwd(),
        `apps/dashboard/src/lib/i18n/translations/${locale}/${file}`
      );
      if (!existsSync(filePath)) {
        errors.push(`Missing: ${locale}/${file}`);
      }
    });
  });
  
  return {
    pass: errors.length === 0,
    errors,
  };
}

/**
 * Valida que UI no importe ai-agents
 */
function validateUINoAIImports(): ValidationResult {
  const errors: string[] = [];

  try {
    const result = execSync(
      'grep -r "@vibethink/ai-agents\\|@/ai-agents" apps/dashboard/src/components/ 2>/dev/null || true',
      { encoding: 'utf-8' }
    );

    if (result.trim()) {
      errors.push('UI components importing ai-agents');
      errors.push(result.trim().substring(0, 200));
    }
  } catch (error) {
    // No matches is good
  }

  return {
    pass: errors.length === 0,
    errors,
  };
}

/**
 * Main
 */
function main() {
  console.log('🔍 Validating i18n 3-layers architecture...\n');

  const results = [
    { name: 'JSON override files exist', result: validateJSONFilesExist() },
    { name: 'UI no AI imports', result: validateUINoAIImports() },
  ];

  let allPass = true;

  results.forEach(({ name, result }) => {
    if (result.pass) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}`);
      result.errors.forEach(err => console.log(`   ${err}`));
      allPass = false;
    }
  });

  console.log('');

  if (allPass) {
    console.log('✅ All validations passed!');
    process.exit(0);
  } else {
    console.log('❌ Some validations failed');
    process.exit(1);
  }
}

main();
```

---

### 6.2 Actualizar package.json

**Archivo:** `package.json` (ROOT)

**ACCIÓN:** AGREGAR scripts (NO reemplazar)

```json
{
  "scripts": {
    "validate:i18n": "ts-node scripts/validate-i18n.ts",
    "test:terminology": "vitest run packages/utils/src/i18n/terminology/__tests__"
  }
}
```

---

### 6.3 README Terminology

**Archivo:** `packages/utils/src/i18n/terminology/README.md`

**ACCIÓN:** CREAR archivo nuevo

```markdown
# Terminology System - CAPA 2

Sistema de terminología compartida entre UI y AI agents.

## API

### `term(conceptId, context)`

Async. Para AI Agents. Context MANDATORIO.

```typescript
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
const label = termSync('concept.booking.resource.room', {
  productContext: 'hotel',
  locale: 'es'
});
```

### `preloadTerminology(locale, productContexts?)`

Precarga namespaces para uso síncrono.

```typescript
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
```

---

## CHECKLIST DE EJECUCIÓN

### ✅ Día 1: Documentación (2h)
- [ ] Crear `docs/architecture/ADR-002-i18n-3-layers.md`
- [ ] Leer y entender las 3 capas
- [ ] Commit: "docs: add ADR-002 i18n 3-layers architecture"

### ✅ Día 2: Código Terminology (6h)
- [ ] Crear `packages/utils/src/i18n/terminology/types.ts`
- [ ] Crear `packages/utils/src/i18n/terminology/cache.ts`
- [ ] Reemplazar `packages/utils/src/i18n/terminology/engine.ts`
- [ ] Crear `packages/utils/src/i18n/terminology/index.ts`
- [ ] Actualizar `packages/utils/src/index.ts` exports
- [ ] Commit: "feat: implement terminology engine with context overrides"

### ✅ Día 3: JSON (4h)
- [ ] Expandir `src/lib/i18n/translations/es/concept.json`
- [ ] Crear overrides para español (4 archivos: hotel, studio, cowork, coliving)
- [ ] Expandir `src/lib/i18n/translations/en/concept.json`
- [ ] Crear overrides para inglés (4 archivos)
- [ ] Repetir para resto de idiomas (fr, pt, de, it, ko, ar, zh)
- [ ] Commit: "feat: add concept translations and product overrides"

### ✅ Día 4: Next.js (4h)
- [ ] Instalar: `npm install i18next-resources-to-backend`
- [ ] Crear `lib/i18n/config.ts`
- [ ] Crear `lib/i18n/server.ts`
- [ ] Crear `lib/i18n/client.tsx`
- [ ] Actualizar `app/layout.tsx`
- [ ] Crear `components/examples/BookingCardExample.tsx`
- [ ] Crear `app/test-i18n/page.tsx`
- [ ] Commit: "feat: integrate react-i18next for UI strings"

### ✅ Día 5: Tests (3h)
- [ ] Crear `packages/utils/src/i18n/terminology/__tests__/engine.test.ts`
- [ ] Crear `packages/utils/vitest.config.ts` (si no existe)
- [ ] Ejecutar: `npm run test:terminology`
- [ ] Verificar: Todos los tests pasan
- [ ] Commit: "test: add terminology engine tests"

### ✅ Día 6: Validación (2h)
- [ ] Crear `scripts/validate-i18n.ts`
- [ ] Actualizar `package.json` scripts
- [ ] Crear `packages/utils/src/i18n/terminology/README.md`
- [ ] Ejecutar: `npm run validate:i18n`
- [ ] Ejecutar: `npm run lint`
- [ ] Verificar: Todo pasa
- [ ] Commit: "feat: add i18n validation and documentation"

### ✅ Testing Final
- [ ] Abrir: `http://localhost:3000/test-i18n`
- [ ] Verificar: 4 cards con diferentes contextos
- [ ] Cambiar idioma a español
- [ ] Verificar: NO hay blink/parpadeo
- [ ] Verificar: Términos cambian correctamente
- [ ] Verificar: Hotel="Habitación", Studio="Sala de grabación"
- [ ] Network tab: Solo 1 idioma descargado
- [ ] Commit: "feat: i18n 3-layers architecture complete"

---

## CRITERIOS DE ÉXITO

### ✅ Funcionalidad
- [ ] NO blink al cambiar idioma
- [ ] Solo idioma activo se descarga (~2MB vs ~18MB)
- [ ] Context overrides funcionan (hotel/studio/cowork/coliving)
- [ ] UI y AI pueden usar mismo `term()`

### ✅ Calidad
- [ ] Tests pasan 100%
- [ ] ESLint sin errores
- [ ] TypeScript compila sin errores
- [ ] `npm run validate:i18n` pasa

### ✅ Documentación
- [ ] ADR-002 completo y claro
- [ ] Código comentado
- [ ] Ejemplos funcionando
- [ ] README terminology actualizado

---

## TROUBLESHOOTING

### Error: "TranslationLoader not registered"

**Causa:** No se registró el loader

**Solución:** Verificar que `registerDashboardTranslationLoader()` se llama en layout

### Error: "termSync called without preload"

**Causa:** No se llamó `preloadTerminology()`

**Solución:** Agregar en layout:
```typescript
await preloadTerminology(locale, ['hotel', 'studio']);
```

### Error: "AgentContext incomplete"

**Causa:** Falta parámetro en `term()`

**Solución:** Pasar context completo:
```typescript
await term(conceptId, {
  domain: 'booking',
  productContext: 'hotel',
  locale: 'en',
  tenantId: 'test'
});
```

---

## SOPORTE

**Dudas:**
1. Leer ADR-002
2. Ver ejemplos en `app/test-i18n/page.tsx`
3. Revisar tests en `__tests__/engine.test.ts`

**Problemas:**
1. Verificar checklist completo
2. Ejecutar `npm run validate:i18n`
3. Revisar console errors

---

**FIN DEL PROMPT - EJECUTAR CHECKLIST EN ORDEN**

**Timeline:** 6 días (21 horas trabajo efectivo)

**Resultado:** Sistema i18n de 3 capas funcionando, sin blink, con carga selectiva, manteniendo compatibilidad con código existente

🚀 **LISTO PARA CURSOR**



