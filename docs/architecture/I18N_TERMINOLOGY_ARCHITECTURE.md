# Arquitectura de Terminología (Terminology System)

**Fecha:** 2025-12-20  
**Estado:** 🚨 **AJUSTES OBLIGATORIOS** - Antes de codificar  
**Propósito:** Sistema de terminología atómica y context-aware para módulos reutilizables

---

## 🚨 AJUSTES OBLIGATORIOS ANTES DE CODIFICAR

### 1. PROHIBIDO: packages/utils importando JSON desde apps/*

#### ❌ INCORRECTO
```typescript
// packages/utils/src/i18n/loader.ts
import translations from '../../apps/dashboard/src/lib/i18n/translations/en/hotel.json'; // ❌ PROHIBIDO
```

#### ✅ CORRECTO

**Paso 1: Crear Interface en packages/utils**

```typescript
// packages/utils/src/i18n/translation-loader.interface.ts

/**
 * Interface para cargar traducciones
 * Implementación real vive en apps/dashboard
 */
export interface TranslationLoader {
  /**
   * Carga traducciones para un namespace y locale
   */
  load(locale: string, namespace: string): Promise<Record<string, any>>;
  
  /**
   * Carga traducciones de forma síncrona (requiere preload)
   */
  loadSync(locale: string, namespace: string): Record<string, any> | null;
  
  /**
   * Preload traducciones para un namespace
   */
  preload(locale: string, namespace: string): Promise<void>;
  
  /**
   * Verifica si un namespace está precargado
   */
  isPreloaded(locale: string, namespace: string): boolean;
}
```

**Paso 2: Registry Pattern**

```typescript
// packages/utils/src/i18n/translation-loader-registry.ts

import { TranslationLoader } from './translation-loader.interface';

/**
 * Registry global para el loader
 * Se registra desde apps/dashboard al inicializar
 */
let loaderInstance: TranslationLoader | null = null;

export function registerTranslationLoader(loader: TranslationLoader): void {
  loaderInstance = loader;
}

export function getTranslationLoader(): TranslationLoader {
  if (!loaderInstance) {
    throw new Error(
      'TranslationLoader not registered. ' +
      'Call registerTranslationLoader() from apps/dashboard during initialization.'
    );
  }
  return loaderInstance;
}
```

**Paso 3: Implementación en apps/dashboard**

```typescript
// apps/dashboard/src/lib/i18n/loader-impl.ts

import { TranslationLoader } from '@vibethink/utils/i18n/translation-loader.interface';
import { registerTranslationLoader } from '@vibethink/utils/i18n/translation-loader-registry';
import { loadTranslation } from './loader'; // Implementación real

class DashboardTranslationLoader implements TranslationLoader {
  async load(locale: string, namespace: string): Promise<Record<string, any>> {
    return loadTranslation(locale, namespace);
  }
  
  loadSync(locale: string, namespace: string): Record<string, any> | null {
    // Implementación con cache síncrono
    // Requiere preload previo
    return getCachedTranslation(locale, namespace);
  }
  
  async preload(locale: string, namespace: string): Promise<void> {
    const translation = await this.load(locale, namespace);
    cacheTranslation(locale, namespace, translation);
  }
  
  isPreloaded(locale: string, namespace: string): boolean {
    return isCached(locale, namespace);
  }
}

// Registrar al inicializar
registerTranslationLoader(new DashboardTranslationLoader());
```

**Paso 4: Uso en packages/utils**

```typescript
// packages/utils/src/i18n/terminology.ts

import { getTranslationLoader } from './translation-loader-registry';

export async function term(
  conceptId: string,
  params?: Record<string, any>,
  locale?: string,
  context?: string
): Promise<string> {
  const loader = getTranslationLoader();
  // Usar loader inyectado, no importar JSON directamente
  // ...
}
```

---

### 2. Concept IDs Atómicos

#### ❌ INCORRECTO
```json
{
  "concept": {
    "resource": "{{type}}",
    "unit": "{{unit}}"
  }
}
```

```typescript
term('concept.resource', { type: 'room' }); // ❌ No atómico
```

#### ✅ CORRECTO

**Estructura atómica:**
```json
{
  "concept": {
    "resource": {
      "room": "habitación",
      "studio": "sala",
      "space": "espacio"
    },
    "unit": {
      "hour": "{count, plural, one {hora} other {horas}}",
      "day": "{count, plural, one {día} other {días}}",
      "night": "{count, plural, one {noche} other {noches}}"
    }
  }
}
```

**Uso:**
```typescript
term('concept.resource.room'); // ✅ Atómico
term('concept.unit.hour', { count: 3 }); // ✅ "3 horas"
```

**Regla:** Un concepto debe ser completamente identificable por su ID, sin parámetros de tipo.

---

### 3. Workflows No Hacen Plural de unitLabel

#### ❌ INCORRECTO
```typescript
const duration = `${count} ${unitLabel}`; // unitLabel = "horas" (ya pluralizado)
```

#### ✅ CORRECTO

**Workflow:**
```typescript
// duration = "{count} {unitLabel}"
// unitLabel se resuelve llamando term(concept.unit.hour, {count})

const count = 3;
const unitLabel = await term('concept.unit.hour', { count }); // "horas"
const duration = `${count} ${unitLabel}`; // "3 horas"
```

**Ejemplo completo:**
```typescript
async function formatDuration(count: number, unit: 'hour' | 'day' | 'night') {
  // Resolver unitLabel con plural correcto
  const unitLabel = await term(`concept.unit.${unit}`, { count });
  return `${count} ${unitLabel}`;
}

formatDuration(1, 'hour'); // "1 hora"
formatDuration(3, 'hour'); // "3 horas"
formatDuration(1, 'night'); // "1 noche"
formatDuration(2, 'night'); // "2 noches"
```

**Regla:** El plural se maneja dentro del concepto, no en el workflow.

---

### 4. termSync Requiere Preload

#### ❌ INCORRECTO
```typescript
// termSync() sin preload → puede fallar
const label = termSync('concept.resource.room'); // ❌ Puede retornar null
```

#### ✅ CORRECTO

**Paso 1: Preload en Layout Bootstrap**

```typescript
// apps/dashboard/app/layout.tsx

export default async function RootLayout({ children }) {
  const locale = getLocale();
  
  // Preload concepts + contexts en bootstrap
  await preloadTerminology(locale, [
    'concept', // Conceptos base
    'concept.hotel', // Contexto hotel
    'concept.studio', // Contexto studio
    // ... otros contextos
  ]);
  
  return <html>{children}</html>;
}
```

**Paso 2: termSync con Validación**

```typescript
// packages/utils/src/i18n/terminology.ts

export function termSync(
  conceptId: string,
  params?: Record<string, any>,
  locale?: string,
  context?: string
): string {
  const loader = getTranslationLoader();
  
  // Verificar preload
  if (!loader.isPreloaded(locale || 'en', getNamespace(conceptId))) {
    console.warn(
      `[terminology] termSync() called without preload for: ${conceptId}. ` +
      `Use term() async or preload first.`
    );
    
    // Fallback controlado
    return getFallback(conceptId, params);
  }
  
  // Cargar síncronamente (ya está en cache)
  const translation = loader.loadSync(locale || 'en', getNamespace(conceptId));
  return resolveConcept(translation, conceptId, params);
}
```

**Paso 3: Fallback Controlado**

```typescript
function getFallback(conceptId: string, params?: Record<string, any>): string {
  // Fallback a inglés o concepto genérico
  // NUNCA retornar null o undefined
  return conceptId; // O mejor: concepto genérico en inglés
}
```

**Regla:** `termSync()` solo funciona después de preload. Si no está precargado, usar `term()` async o fallback controlado.

---

### 5. Cache Keys Deben Incluir locale + context + tenantId

#### ❌ INCORRECTO
```typescript
const cacheKey = `${locale}_${namespace}`; // ❌ Falta context y tenantId
```

#### ✅ CORRECTO

**Cache Key Structure:**
```typescript
// packages/utils/src/i18n/terminology-cache.ts

interface CacheKey {
  locale: string;
  context: string | null;
  tenantId: string | null;
  namespace: string;
}

function buildCacheKey(
  locale: string,
  namespace: string,
  context?: string | null,
  tenantId?: string | null
): string {
  // Formato: locale:context:tenantId:namespace
  const contextPart = context || 'null';
  const tenantPart = tenantId || 'null';
  return `${locale}:${contextPart}:${tenantPart}:${namespace}`;
}

// Ejemplos:
// "en:hotel:null:concept" → Conceptos base en inglés, contexto hotel, sin tenant
// "es:studio:tenant123:concept" → Conceptos en español, contexto studio, tenant específico
// "en:null:null:concept" → Conceptos base sin contexto ni tenant
```

**Clear Cache en Cambios de Regional Config:**

```typescript
// packages/utils/src/regional-config.ts

export class RegionalConfigManager {
  // ...
  
  setLocale(newLocale: string): void {
    this.config.locale = newLocale;
    // Limpiar cache de terminología
    clearTerminologyCache();
  }
  
  setContext(newContext: string): void {
    this.config.context = newContext;
    // Limpiar cache de terminología
    clearTerminologyCache();
  }
  
  setTenantId(newTenantId: string): void {
    this.config.tenantId = newTenantId;
    // Limpiar cache de terminología
    clearTerminologyCache();
  }
}

// packages/utils/src/i18n/terminology-cache.ts

export function clearTerminologyCache(): void {
  terminologyCache.clear();
}

export function clearTerminologyCacheFor(
  locale?: string,
  context?: string,
  tenantId?: string
): void {
  // Limpiar cache específico
  const keysToDelete: string[] = [];
  
  for (const key of terminologyCache.keys()) {
    const [keyLocale, keyContext, keyTenant, _namespace] = key.split(':');
    
    if (locale && keyLocale !== locale) continue;
    if (context && keyContext !== context) continue;
    if (tenantId && keyTenant !== tenantId) continue;
    
    keysToDelete.push(key);
  }
  
  keysToDelete.forEach(key => terminologyCache.delete(key));
}
```

**Regla:** Cache keys siempre incluyen `locale:context:tenantId:namespace`, incluso si context o tenantId son `null`.

---

### 6. Crear Contract para Agentes

#### Helper/Endpoint para Agentes de IA

```typescript
// apps/dashboard/src/lib/i18n/ai-terminology-resolver.ts

/**
 * Contract para agentes de IA
 * Resuelve terminología según contexto
 */
export interface TerminologyResolutionRequest {
  locale: string;
  context: string | null;
  tenantId?: string | null;
  conceptIds: string[];
}

export interface TerminologyResolutionResponse {
  terminology: Record<string, string>;
  metadata: {
    locale: string;
    context: string | null;
    tenantId: string | null;
    resolvedAt: string;
  };
}

/**
 * Resuelve terminología para agentes de IA
 */
export async function resolveTerminology(
  request: TerminologyResolutionRequest
): Promise<TerminologyResolutionResponse> {
  const { locale, context, tenantId, conceptIds } = request;
  
  // Resolver cada concepto
  const terminology: Record<string, string> = {};
  
  for (const conceptId of conceptIds) {
    const value = await term(conceptId, {}, locale, context || undefined);
    terminology[conceptId] = value;
  }
  
  return {
    terminology,
    metadata: {
      locale,
      context,
      tenantId: tenantId || null,
      resolvedAt: new Date().toISOString(),
    },
  };
}
```

**API Endpoint (Opcional):**

```typescript
// apps/dashboard/app/api/terminology/resolve/route.ts

import { resolveTerminology } from '@/lib/i18n/ai-terminology-resolver';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await resolveTerminology(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve terminology' },
      { status: 500 }
    );
  }
}
```

**Uso en Agentes de IA:**

```typescript
// Ejemplo: Gemini Function Calling

const functions = [
  {
    name: 'resolveTerminology',
    description: 'Resuelve terminología según contexto (hotel, studio, etc.)',
    parameters: {
      type: 'object',
      properties: {
        locale: { type: 'string', default: 'es' },
        context: { type: 'string', enum: ['hotel', 'studio', 'cowork', null] },
        conceptIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs de conceptos a resolver (ej: concept.resource.room)',
        },
      },
      required: ['conceptIds'],
    },
  },
];

// El agente puede llamar:
const result = await resolveTerminology({
  locale: 'es',
  context: 'hotel',
  conceptIds: ['concept.resource.room', 'concept.unit.night'],
});

// Resultado:
// {
//   terminology: {
//     'concept.resource.room': 'habitación',
//     'concept.unit.night': '{count, plural, one {noche} other {noches}}'
//   },
//   metadata: { ... }
// }
```

---

## 📋 Checklist de Implementación

### Fase 1: Arquitectura Base (1 día)

- [ ] Crear `TranslationLoader` interface en `packages/utils`
- [ ] Crear `TranslationLoaderRegistry` en `packages/utils`
- [ ] Implementar `DashboardTranslationLoader` en `apps/dashboard`
- [ ] Registrar loader en `layout.tsx` bootstrap
- [ ] Validar que funciona sin importar JSON desde apps/*

### Fase 2: Concept IDs Atómicos (1 día)

- [ ] Rediseñar estructura JSON con concept IDs atómicos
- [ ] Migrar `hotel.json` a estructura atómica
- [ ] Actualizar `term()` para soportar concept IDs atómicos
- [ ] Validar pluralización dentro de conceptos

### Fase 3: Workflows y Preload (1 día)

- [ ] Implementar `preloadTerminology()` en layout
- [ ] Implementar `termSync()` con validación de preload
- [ ] Actualizar workflows para usar `term()` para unitLabel
- [ ] Validar fallback controlado

### Fase 4: Cache y Tenant (1 día)

- [ ] Implementar cache keys con `locale:context:tenantId:namespace`
- [ ] Integrar `clearTerminologyCache()` en `RegionalConfigManager`
- [ ] Validar que cache se limpia en cambios de config
- [ ] Tests de cache con diferentes tenants

### Fase 5: Contract para Agentes (1 día)

- [ ] Crear `resolveTerminology()` helper
- [ ] Crear API endpoint (opcional)
- [ ] Documentar contract para agentes
- [ ] Ejemplos de integración con Gemini/Claude

---

## 🎯 Ejemplo Completo: Booking Duration

### Estructura JSON (Atómica)

```json
{
  "concept": {
    "unit": {
      "hour": "{count, plural, one {hora} other {horas}}",
      "day": "{count, plural, one {día} other {días}}",
      "night": "{count, plural, one {noche} other {noches}}"
    }
  }
}
```

### Workflow

```typescript
// ❌ INCORRECTO
const duration = `${count} ${unitLabel}`; // unitLabel ya pluralizado

// ✅ CORRECTO
async function formatBookingDuration(count: number, unit: 'hour' | 'day' | 'night') {
  // Resolver unitLabel con plural correcto
  const unitLabel = await term(`concept.unit.${unit}`, { count });
  return `${count} ${unitLabel}`;
}

// Uso
formatBookingDuration(1, 'night'); // "1 noche"
formatBookingDuration(3, 'night'); // "3 noches"
```

---

## 🚨 Reglas Críticas

### Regla 1: Separación de Responsabilidades

- ✅ `packages/utils`: Interfaces y lógica (sin importar JSON)
- ✅ `apps/dashboard`: Implementación real del loader
- ✅ Registry pattern para inyección de dependencias

### Regla 2: Concept IDs Atómicos

- ✅ `concept.resource.room` (no `concept.resource + {type}`)
- ✅ Plural dentro del concepto: `concept.unit.hour = "{count, plural, ...}"`
- ✅ Workflows resuelven unitLabel llamando `term()`

### Regla 3: Preload Obligatorio

- ✅ Preload en layout bootstrap
- ✅ `termSync()` valida preload
- ✅ Fallback controlado si no está precargado

### Regla 4: Cache Completo

- ✅ Keys: `locale:context:tenantId:namespace`
- ✅ Clear cache en cambios de regional config
- ✅ Soporte multi-tenant desde el inicio

### Regla 5: Contract para Agentes

- ✅ Helper `resolveTerminology()` documentado
- ✅ API endpoint opcional
- ✅ Ejemplos de integración

---

## 📝 Referencias

- **Context-Aware Translations:** `docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md`
- **AI Agent Context Resolution:** `docs/architecture/I18N_AI_AGENT_CONTEXT_RESOLUTION.md`
- **Regional Configuration:** `docs/architecture/REGIONAL_CONFIGURATION.md`

---

**Última actualización:** 2025-12-20  
**Estado:** 🚨 **AJUSTES OBLIGATORIOS** - Implementar antes de continuar

---

**Esta arquitectura establece las bases correctas para el sistema de terminología, asegurando separación de responsabilidades, conceptos atómicos, y soporte completo para agentes de IA.**

