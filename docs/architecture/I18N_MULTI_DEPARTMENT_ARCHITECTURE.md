# 🏢 i18n Multi-Department Architecture - Guía de Expansión

**Propósito:** Documentar cómo escalar el sistema i18n de 3 capas cuando se creen diferentes unidades de negocio (departamentos/productos).

**Audiencia:** Product Owners, Arquitectos, Agentes IA, Desarrolladores

**Estado:** Arquitectura implementada, lista para expansión

**Última actualización:** 2025-12-26

---

## 📚 TABLA DE CONTENIDOS

1. [Arquitectura Actual](#arquitectura-actual)
2. [Conceptos Clave](#conceptos-clave)
3. [Estructura de Namespaces](#estructura-de-namespaces)
4. [Agregar Nueva Unidad de Negocio](#agregar-nueva-unidad-de-negocio)
5. [Convenciones y Estándares](#convenciones-y-estándares)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## 🏗️ ARQUITECTURA ACTUAL

### Las 3 Capas

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 3: UI Layer                                           │
│  - I18nProvider (React Context)                             │
│  - useTranslation() hook → t('key')                         │
│  - useTerminology() hook → resolveConcept('concept.id')     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CAPA 2: Terminology Engine                                 │
│  - TranslationLoader (Server: fs/promises, Client: stub)    │
│  - TerminologySnapshot (pre-carga conceptos críticos)       │
│  - TerminologyHydration (SSR → Client handoff)              │
│  - Hierarchical Resolution: product → base → en → conceptId │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1: Semantic Concept Layer (JSON)                      │
│  - 9 idiomas: en, es, ar, zh, fr, pt, de, it, ko            │
│  - Namespaces por producto: concept-{product}.json          │
│  - Namespace base compartido: concept.json                  │
└─────────────────────────────────────────────────────────────┘
```

### Productos Actuales

| Producto | Namespace | Estado | Archivo Ejemplo |
|----------|-----------|--------|-----------------|
| Base (Compartido) | `concept` | ✅ Implementado | `concept.json` |
| Hotel | `concept-hotel` | ✅ Implementado | `concept-hotel.json` |
| Studio | `concept-studio` | ✅ Implementado | `concept-studio.json` |
| Coworking | `concept-cowork` | ✅ Implementado | `concept-cowork.json` |
| Coliving | `concept-coliving` | ✅ Implementado | `concept-coliving.json` |

---

## 🎯 CONCEPTOS CLAVE

### 1. Product Context

**Definición:** El contexto de negocio actual del usuario. Determina qué conceptos se usan.

**Ubicación:** `packages/utils/src/i18n/terminology/types.ts`

```typescript
export type ProductContext =
  | 'hotel'
  | 'studio'
  | 'cowork'
  | 'coliving'
  | 'restaurant'  // ← Ejemplo de nuevo producto
  | 'gym'         // ← Ejemplo de nuevo producto
```

**Uso en código:**
```typescript
// Server Component (layout.tsx)
const productContext: ProductContext = 'hotel'; // Dinámico según tenant/user
const snapshot = await createTerminologySnapshot(locale, productContext);
```

### 2. Hierarchical Resolution

**Orden de búsqueda de traducciones:**

```
1. concept-{product}.json (específico del producto en locale actual)
   ↓ Si no encuentra
2. concept.json (base compartido en locale actual)
   ↓ Si no encuentra
3. concept-{product}.json (específico del producto en inglés)
   ↓ Si no encuentra
4. concept.json (base compartido en inglés)
   ↓ Si no encuentra
5. Retorna conceptId original (fallback)
```

**Ejemplo:**
```typescript
// Usuario en idioma: 'es', producto: 'restaurant'
resolveConcept('concept.restaurant.meal.breakfast', 'es', 'restaurant')

// Busca en orden:
1. es/concept-restaurant.json → concept.restaurant.meal.breakfast
2. es/concept.json → concept.restaurant.meal.breakfast
3. en/concept-restaurant.json → concept.restaurant.meal.breakfast
4. en/concept.json → concept.restaurant.meal.breakfast
5. Retorna: 'concept.restaurant.meal.breakfast'
```

### 3. Critical Concepts

**Definición:** Conceptos más usados en la UI que se pre-cargan en el snapshot para optimizar performance.

**Ubicación:** `apps/dashboard/src/lib/i18n/terminology-snapshot.ts`

```typescript
const CRITICAL_CONCEPTS: Record<ProductContext, string[]> = {
  hotel: [
    'concept.booking.resource.room',
    'concept.booking.action.reserve',
    'concept.booking.action.checkIn',
    'concept.booking.action.checkOut',
    'concept.booking.status.confirmed',
    'concept.booking.status.pending',
    'concept.booking.status.cancelled',
  ],
  restaurant: [
    'concept.restaurant.resource.table',
    'concept.restaurant.meal.breakfast',
    'concept.restaurant.service.delivery',
    // ... 5-10 conceptos más usados
  ],
  // ... otros productos
};
```

**Propósito:** Cache hit rate ~79% para requests subsecuentes.

---

## 📂 ESTRUCTURA DE NAMESPACES

### Convención de Nomenclatura

**Product-Specific Namespaces** (Recomendado)
```
concept.{product}.{domain}.{entity}.{property}
```

**Ejemplos:**
```json
"concept.hotel.service.housekeeping"          // Hotel → Service → Housekeeping
"concept.restaurant.meal.breakfast"           // Restaurant → Meal → Breakfast
"concept.gym.membership.monthly"              // Gym → Membership → Monthly
"concept.studio.equipment.camera"             // Studio → Equipment → Camera
"concept.cowork.resource.meetingRoom"         // Cowork → Resource → Meeting Room
"concept.coliving.community.event"            // Coliving → Community → Event
```

### Shared Namespaces (Base)

**Para conceptos verdaderamente universales:**

```json
// concept.json (base compartido)
{
  "concept": {
    "booking": {
      "resource": {
        "room": "Room",
        "space": "Space"
      },
      "action": {
        "reserve": "Reserve",
        "cancel": "Cancel"
      },
      "status": {
        "confirmed": "Confirmed",
        "pending": "Pending",
        "cancelled": "Cancelled"
      }
    },
    "crm": {
      "entity": {
        "lead": "Lead",
        "contact": "Contact"
      },
      "action": {
        "create": "Create",
        "update": "Update"
      }
    }
  }
}
```

### ⚠️ REGLA DE ORO

**Si el concepto puede tener significado diferente en diferentes productos → Product-Specific**

**Ejemplos:**

| Concepto | ¿Product-Specific? | Razón |
|----------|-------------------|-------|
| "Studio" | ✅ SÍ | Music studio vs Apartment studio (diferente semántica) |
| "Desk" | ✅ SÍ | Cowork desk vs Hotel desk (diferente contexto de uso) |
| "Breakfast" | ✅ SÍ | Restaurant breakfast vs Hotel breakfast vs Coliving breakfast (servicios diferentes) |
| "Confirmed" (status) | ❌ NO | Mismo significado en todos los productos |
| "Cancel" (action) | ❌ NO | Mismo significado en todos los productos |

---

## 🚀 AGREGAR NUEVA UNIDAD DE NEGOCIO

### Paso a Paso Completo

Vamos a usar **Restaurant** como ejemplo.

---

### PASO 1: Planificación de Conceptos

**Acción:** Identificar los dominios y entidades del nuevo producto.

**Template de análisis:**
```markdown
## Restaurant - Concept Domains

### Recursos (Resources)
- Mesas (table, booth, bar seat)
- Espacios (private room, patio, terrace)

### Comidas (Meals)
- Tipos (breakfast, lunch, dinner, brunch)
- Categorías (appetizer, main course, dessert)

### Servicios (Services)
- Modalidades (dine-in, takeout, delivery, catering)

### Personal (Staff)
- Roles (chef, waiter, sommelier, host)

### Menú (Menu)
- Categorías (vegetarian, vegan, gluten-free)
- Estilos (italian, mexican, japanese)

### Reservas (Booking)
- Tipos (standard, special occasion, event)
- Horarios (lunch slot, dinner slot)
```

**Resultado esperado:** Lista de 20-40 conceptos críticos para el producto.

---

### PASO 2: Crear Archivo Base en Inglés

**Ubicación:** `apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json`

**Contenido:**
```json
{
  "concept": {
    "restaurant": {
      "resource": {
        "table": "Table",
        "booth": "Booth",
        "barSeat": "Bar Seat",
        "privateRoom": "Private Dining Room",
        "patio": "Patio",
        "terrace": "Terrace"
      },
      "meal": {
        "breakfast": "Breakfast",
        "lunch": "Lunch",
        "dinner": "Dinner",
        "brunch": "Brunch",
        "appetizer": "Appetizer",
        "mainCourse": "Main Course",
        "dessert": "Dessert",
        "beverage": "Beverage"
      },
      "service": {
        "dineIn": "Dine In",
        "takeout": "Takeout",
        "delivery": "Delivery",
        "catering": "Catering",
        "reservation": "Reservation",
        "walkIn": "Walk In"
      },
      "staff": {
        "chef": "Chef",
        "waiter": "Waiter",
        "waitress": "Waitress",
        "sommelier": "Sommelier",
        "host": "Host",
        "bartender": "Bartender"
      },
      "menu": {
        "vegetarian": "Vegetarian",
        "vegan": "Vegan",
        "glutenFree": "Gluten Free",
        "dairyFree": "Dairy Free",
        "spicy": "Spicy",
        "organic": "Organic"
      },
      "cuisine": {
        "italian": "Italian",
        "mexican": "Mexican",
        "japanese": "Japanese",
        "chinese": "Chinese",
        "french": "French",
        "mediterranean": "Mediterranean"
      },
      "booking": {
        "type": {
          "standard": "Standard Reservation",
          "specialOccasion": "Special Occasion",
          "event": "Private Event"
        },
        "timeSlot": {
          "lunch": "Lunch Service",
          "dinner": "Dinner Service",
          "lateNight": "Late Night"
        }
      }
    }
  }
}
```

**Convenciones:**
- ✅ Usar **camelCase** para keys (consistencia)
- ✅ Usar **Product-Specific namespace**: `concept.restaurant.*`
- ✅ Agrupar por dominio lógico
- ✅ Strings en inglés (baseline)

---

### PASO 3: Replicar para 8 Idiomas Restantes

**Archivos a crear:**
```
apps/dashboard/src/lib/i18n/translations/
├── es/concept-restaurant.json  (Español)
├── ar/concept-restaurant.json  (Árabe)
├── zh/concept-restaurant.json  (Chino)
├── fr/concept-restaurant.json  (Francés)
├── pt/concept-restaurant.json  (Portugués)
├── de/concept-restaurant.json  (Alemán)
├── it/concept-restaurant.json  (Italiano)
└── ko/concept-restaurant.json  (Coreano)
```

**Método:**

**Opción A: Traducción Manual** (más preciso)
- Contratar traductores nativos
- Validar contexto cultural
- Tiempo: 2-3 días por idioma

**Opción B: Traducción AI + Validación** (más rápido)
- Usar AI para generar traducciones
- Validar manualmente las traducciones críticas
- Tiempo: 4-6 horas por idioma

**Opción C: Traducción Incremental** (más pragmático)
- Empezar solo con en/es
- Agregar otros idiomas según demanda
- Tiempo: Variable

**Script sugerido:**
```javascript
// scripts/generate-translations.js
const { translate } = require('@anthropic/ai'); // o Google Translate API

async function generateTranslations(baseFile, targetLocale) {
  const baseData = require(`../translations/en/${baseFile}.json`);
  const translations = {};

  for (const [key, value] of Object.entries(flatten(baseData))) {
    translations[key] = await translate(value, {
      from: 'en',
      to: targetLocale,
      context: 'restaurant industry terminology'
    });
  }

  // Save to file
  fs.writeFileSync(
    `../translations/${targetLocale}/${baseFile}.json`,
    JSON.stringify(unflatten(translations), null, 2)
  );
}

// Uso:
generateTranslations('concept-restaurant', 'es');
```

---

### PASO 4: Actualizar TypeScript Types

**Archivo:** `packages/utils/src/i18n/terminology/types.ts`

**Cambios:**

```typescript
// ANTES:
export type ProductContext = 'hotel' | 'studio' | 'cowork' | 'coliving';

export type TranslationNamespace =
  | 'common'
  | 'navigation'
  | 'concept'
  | 'concept-hotel'
  | 'concept-studio'
  | 'concept-cowork'
  | 'concept-coliving'
  // ... otros namespaces

// DESPUÉS:
export type ProductContext =
  | 'hotel'
  | 'studio'
  | 'cowork'
  | 'coliving'
  | 'restaurant';  // ← AGREGAR

export type TranslationNamespace =
  | 'common'
  | 'navigation'
  | 'concept'
  | 'concept-hotel'
  | 'concept-studio'
  | 'concept-cowork'
  | 'concept-coliving'
  | 'concept-restaurant'  // ← AGREGAR
  // ... otros namespaces
```

**Validar:** `npx tsc --noEmit` debe pasar sin errores.

---

### PASO 5: Agregar Critical Concepts

**Archivo:** `apps/dashboard/src/lib/i18n/terminology-snapshot.ts`

**Cambios:**

```typescript
const CRITICAL_CONCEPTS: Record<ProductContext, string[]> = {
  hotel: [
    'concept.booking.resource.room',
    'concept.booking.action.reserve',
    // ... resto de hotel
  ],
  studio: [
    // ... studio concepts
  ],
  cowork: [
    // ... cowork concepts
  ],
  coliving: [
    // ... coliving concepts
  ],
  restaurant: [  // ← AGREGAR
    'concept.restaurant.resource.table',
    'concept.restaurant.resource.booth',
    'concept.restaurant.meal.breakfast',
    'concept.restaurant.meal.lunch',
    'concept.restaurant.meal.dinner',
    'concept.restaurant.service.dineIn',
    'concept.restaurant.service.delivery',
    'concept.restaurant.booking.type.standard',
    'concept.restaurant.cuisine.italian',
    'concept.restaurant.menu.vegetarian',
  ],
};
```

**Criterio de selección:**
- Top 10-15 conceptos MÁS usados en la UI
- Conceptos que aparecen en >3 componentes
- Conceptos críticos para user flow (ej: table, reservation)

**Cómo identificar:**
```bash
# Buscar uso de conceptos en código
grep -r "resolveConcept('concept.restaurant" apps/dashboard --include="*.tsx"
```

---

### PASO 6: Preload Namespace en Layout

**Archivo:** `apps/dashboard/app/layout.tsx`

**Cambios:**

```typescript
// ANTES:
<I18nProvider
  initialLocale={initialLocale}
  preloadNamespaces={[
    'common',
    'navigation',
    'concept',
    'concept-hotel',
    'concept-studio',
    'concept-cowork',
    'concept-coliving',
    // ... otros namespaces
  ]}
>

// DESPUÉS:
<I18nProvider
  initialLocale={initialLocale}
  preloadNamespaces={[
    'common',
    'navigation',
    'concept',
    'concept-hotel',
    'concept-studio',
    'concept-cowork',
    'concept-coliving',
    'concept-restaurant',  // ← AGREGAR
    // ... otros namespaces
  ]}
>
```

**Propósito:** Pre-cargar namespace en server para evitar loading on-demand.

---

### PASO 7: Crear Snapshot para Producto

**Archivo:** `apps/dashboard/app/layout.tsx` (si necesitas product-specific snapshot)

**Opcional:** Solo necesario si tienes múltiples productos activos simultáneamente.

```typescript
// Detectar producto del tenant actual
const productContext = await detectProductContext(tenant); // 'restaurant'

// Crear snapshot específico
const terminologySnapshot = await createTerminologySnapshot(
  initialLocale,
  productContext  // Dinámico: 'hotel', 'restaurant', etc.
);

// Hidratar en cliente
<TerminologyHydration snapshot={terminologySnapshot} />
```

---

### PASO 8: Usar en Componentes

**Componente Ejemplo:** Restaurant Booking Form

```typescript
'use client';

import { useTerminology } from '@vibethink/utils';

export function RestaurantBookingForm() {
  const { resolveConcept } = useTerminology();

  return (
    <form>
      <h2>{resolveConcept('concept.restaurant.booking.type.standard')}</h2>

      <label>
        {resolveConcept('concept.restaurant.resource.table')}
        <select>
          <option>{resolveConcept('concept.restaurant.resource.booth')}</option>
          <option>{resolveConcept('concept.restaurant.resource.patio')}</option>
        </select>
      </label>

      <label>
        {resolveConcept('concept.restaurant.meal.dinner')}
        <input type="time" />
      </label>

      <button type="submit">
        {resolveConcept('concept.restaurant.service.reservation')}
      </button>
    </form>
  );
}
```

**Ventajas:**
- ✅ Automáticamente traducido a 9 idiomas
- ✅ Fallback a inglés si traducción no existe
- ✅ Type-safe con TypeScript
- ✅ Optimizado con snapshot pre-loading

---

### PASO 9: Testing

**Checklist:**

```markdown
## Restaurant Product - Testing Checklist

### Build & TypeScript
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run build` completa sin warnings
- [ ] Bundle size no aumentó significativamente

### Translations
- [ ] Archivo en/concept-restaurant.json tiene todos los conceptos
- [ ] 8 idiomas restantes tienen traducciones (mínimo es/fr)
- [ ] No hay keys duplicadas entre concept.json y concept-restaurant.json

### Runtime
- [ ] Cambiar a producto 'restaurant' carga snapshot correcto
- [ ] resolveConcept() retorna traducciones correctas en 9 idiomas
- [ ] Fallback a inglés funciona si traducción falta
- [ ] Console no muestra "Concept not found" warnings

### Performance
- [ ] Página carga en <1 segundo
- [ ] Cambio de idioma es instantáneo
- [ ] No hay re-renders innecesarios

### RTL (si aplica)
- [ ] Árabe (ar) muestra correctamente en RTL
- [ ] Layout no se rompe en RTL
```

---

### PASO 10: Documentación

**Crear:** `docs/products/restaurant/TERMINOLOGY_GUIDE.md`

```markdown
# Restaurant Terminology Guide

## Conceptos Disponibles

### Resources (Recursos)
- `concept.restaurant.resource.table` - Mesa
- `concept.restaurant.resource.booth` - Booth
- ...

### Meals (Comidas)
- `concept.restaurant.meal.breakfast` - Desayuno
- `concept.restaurant.meal.lunch` - Almuerzo
- ...

## Uso en Código

```tsx
import { useTerminology } from '@vibethink/utils';

const { resolveConcept } = useTerminology();
const tableName = resolveConcept('concept.restaurant.resource.table');
```

## Agregar Nuevos Conceptos

1. Editar `en/concept-restaurant.json`
2. Replicar en otros 8 idiomas
3. Si es crítico, agregar a CRITICAL_CONCEPTS
4. Rebuild y test
```

---

## 📋 CONVENCIONES Y ESTÁNDARES

### Naming Conventions

#### Keys (Llaves JSON)
- ✅ **camelCase**: `checkIn`, `mainCourse`, `barSeat`
- ❌ **kebab-case**: `check-in`, `main-course`
- ❌ **snake_case**: `check_in`, `main_course`
- ❌ **lowercase**: `checkin`, `maincourse`

**Razón:** camelCase es más idiomático en JavaScript/TypeScript.

#### Namespace Structure
```
concept.{product}.{domain}.{entity}.{property}
     ↑       ↑        ↑        ↑         ↑
  Siempre  Producto Dominio Entidad  Propiedad
  "concept"         lógico
```

**Ejemplos válidos:**
```
concept.restaurant.meal.breakfast              ✅
concept.gym.membership.tier.gold               ✅
concept.hotel.service.housekeeping             ✅
```

**Ejemplos inválidos:**
```
restaurant.meal.breakfast                      ❌ (falta "concept")
concept.meal.breakfast                         ❌ (falta producto)
concept.restaurant.breakfast                   ❌ (falta dominio)
```

### File Naming
- ✅ `concept-restaurant.json` (kebab-case)
- ❌ `conceptRestaurant.json` (camelCase)
- ❌ `concept_restaurant.json` (snake_case)

### Translation Guidelines

1. **Consistencia Terminológica**
   - Usar mismo término para mismo concepto
   - Ejemplo: "Reserva" (no mezclar "Reserva" y "Reservación")

2. **Contexto Cultural**
   - Adaptar conceptos a cultura local
   - Ejemplo: "Propina" en es-MX vs "Propina" en es-ES (puede variar)

3. **Longitud de Strings**
   - Considerar expansión de texto en traducciones
   - Alemán puede ser 30% más largo que inglés
   - Diseñar UI con espacio flexible

4. **RTL Support**
   - Árabe (ar) requiere soporte RTL
   - Verificar que UI no se rompa
   - Evitar hardcodear left/right (usar start/end)

---

## 🔧 TROUBLESHOOTING

### Problema: "Concept not found" en Console

**Síntoma:**
```
[TerminologySnapshot] Concept not found: concept.restaurant.meal.breakfast
```

**Causas posibles:**

1. **Typo en concept path**
   ```typescript
   // ❌ Incorrecto:
   resolveConcept('concept.restaurant.meals.breakfast')

   // ✅ Correcto:
   resolveConcept('concept.restaurant.meal.breakfast')
   ```

2. **Archivo JSON no tiene el concepto**
   - Verificar: `en/concept-restaurant.json` tiene el path exacto
   - Verificar: Estructura de nested objects coincide

3. **Namespace no está en preloadNamespaces**
   - Agregar a `layout.tsx` en preloadNamespaces array

4. **ProductContext incorrecto**
   - Verificar que snapshot se creó con producto correcto

**Solución:**
```bash
# Verificar existencia del concepto
node -e "
const data = require('./apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json');
const { getNestedValue } = require('./apps/dashboard/src/lib/i18n/utils');
console.log(getNestedValue(data, 'concept.restaurant.meal.breakfast'));
"
```

---

### Problema: Traducciones No Cargan

**Síntoma:** UI muestra concept IDs en vez de traducciones.

**Causas posibles:**

1. **Archivo JSON tiene syntax error**
   ```bash
   # Validar JSON
   npx jsonlint apps/dashboard/src/lib/i18n/translations/es/concept-restaurant.json
   ```

2. **Dynamic import falla**
   - Verificar en Network tab de DevTools
   - Buscar 404 errors para archivos JSON

3. **Cache desactualizado**
   ```typescript
   // Limpiar cache en desarrollo
   const loader = getTranslationLoader();
   loader.clearCache();
   ```

4. **Locale incorrecto**
   - Verificar que locale está en AVAILABLE_LOCALES
   - Verificar que archivo existe para ese locale

---

### Problema: Performance Lenta al Cambiar Idioma

**Síntoma:** Cambio de idioma toma >2 segundos.

**Causas posibles:**

1. **Namespace no está pre-cargado**
   - Agregar a preloadNamespaces en layout.tsx

2. **Archivo JSON muy grande** (>100KB)
   - Considerar dividir en sub-namespaces
   - Ejemplo: `concept-restaurant-menu.json`, `concept-restaurant-booking.json`

3. **Re-renders excesivos**
   - Usar React DevTools Profiler
   - Verificar que componentes usan React.memo()

**Solución:**
```typescript
// Dividir namespace grande
// ANTES: concept-restaurant.json (200KB)
// DESPUÉS:
// - concept-restaurant-core.json (50KB)
// - concept-restaurant-menu.json (80KB)
// - concept-restaurant-booking.json (70KB)

// Solo cargar lo necesario
<I18nProvider
  preloadNamespaces={[
    'concept-restaurant-core',  // Siempre
    // Otros on-demand
  ]}
>
```

---

## ❓ FAQs

### ¿Cuántos conceptos debería tener un producto?

**Recomendación:** 30-80 conceptos por producto.

- **Mínimo viable:** 20-30 (conceptos críticos)
- **Completo:** 50-80 (cubre 95% de UI)
- **Exhaustivo:** 100+ (edge cases, raramente usado)

**Regla:** Si un concepto se usa <3 veces en toda la app, probablemente no necesita estar en terminology system.

---

### ¿Debo crear namespace para módulos internos (ej: Admin Panel)?

**Respuesta:** Depende.

**SÍ, crear product-specific si:**
- Tiene terminología única (ej: "Tenant", "License", "Audit Log")
- Se comparte entre múltiples tenants/productos
- Requiere traducciones consistentes

**NO, usar namespace tradicional si:**
- Es UI interna solo para tu equipo
- No requiere multi-idioma
- Vocabulario es técnico y universal (ej: "Database", "API Key")

**Ejemplo:**
```json
// Admin Panel → Usar namespace tradicional
// apps/dashboard/src/lib/i18n/translations/en/admin.json
{
  "admin": {
    "tenant": "Tenant",
    "auditLog": "Audit Log",
    "apiKey": "API Key"
  }
}

// NO:
// concept-admin.json con concept.admin.* (overkill)
```

---

### ¿Cómo manejo dialectos? (ej: es-MX vs es-ES)

**Opción A: Locale Variants** (más preciso)
```
translations/
├── es/concept-restaurant.json        (español genérico)
├── es-MX/concept-restaurant.json     (español México)
└── es-ES/concept-restaurant.json     (español España)
```

**Implementación:**
```typescript
// types.ts
export type Locale =
  | 'en'
  | 'es'
  | 'es-MX'  // Mexicano
  | 'es-ES'  // Español
  | 'es-AR'  // Argentino
  // ...

// loader.ts
async load(locale: Locale, namespace: string) {
  // Intenta locale específico primero
  let filePath = path.join(this.basePath, locale, `${namespace}.json`);

  if (!fs.existsSync(filePath)) {
    // Fallback a idioma base
    const baseLocale = locale.split('-')[0]; // 'es-MX' → 'es'
    filePath = path.join(this.basePath, baseLocale, `${namespace}.json`);
  }

  // Load file...
}
```

**Opción B: Regional Overrides** (más simple)
```json
// es/concept-restaurant.json (base español)
{
  "concept": {
    "restaurant": {
      "service": {
        "takeout": "Para llevar"  // Genérico
      }
    }
  }
}

// Configurar overrides por región en runtime
const regionalOverrides = {
  'es-MX': {
    'concept.restaurant.service.takeout': 'Para llevar',
  },
  'es-AR': {
    'concept.restaurant.service.takeout': 'Para llevar',
  },
  'es-ES': {
    'concept.restaurant.service.takeout': 'Para recoger',
  }
};
```

**Recomendación:** Empezar con Opción B (overrides). Migrar a Opción A si >10% de términos difieren.

---

### ¿Qué pasa si dos productos usan el mismo concepto con significados diferentes?

**Ejemplo:** "Studio" puede ser:
- Music recording studio (producto: studio)
- Apartment studio (producto: coliving)

**Solución:** Product-Specific Namespaces (por eso los usamos)

```json
// studio/concept-studio.json
{
  "concept": {
    "studio": {
      "type": {
        "recording": "Recording Studio",  // Music studio
        "production": "Production Studio"
      }
    }
  }
}

// coliving/concept-coliving.json
{
  "concept": {
    "coliving": {
      "resource": {
        "studio": "Studio Apartment"  // Living space
      }
    }
  }
}
```

**Uso:**
```typescript
// En contexto de producto 'studio':
resolveConcept('concept.studio.type.recording', locale, 'studio')
// → "Recording Studio"

// En contexto de producto 'coliving':
resolveConcept('concept.coliving.resource.studio', locale, 'coliving')
// → "Studio Apartment"
```

**Ventaja:** Zero ambigüedad, cada producto tiene su propia semántica.

---

## 📊 CHECKLIST FINAL

Antes de considerar un nuevo producto "completo":

### Planning
- [ ] Identificados 30-80 conceptos críticos
- [ ] Dominios lógicos definidos (resources, services, etc.)
- [ ] Naming convention acordada con equipo

### Implementation
- [ ] Archivo `en/concept-{product}.json` creado
- [ ] Replicado en 8 idiomas (mínimo es, fr)
- [ ] TypeScript types actualizados (ProductContext, TranslationNamespace)
- [ ] CRITICAL_CONCEPTS array actualizado
- [ ] Namespace agregado a preloadNamespaces
- [ ] Snapshot configurado para producto

### Testing
- [ ] Build pasa sin errores
- [ ] Traducciones cargan correctamente
- [ ] Fallback a inglés funciona
- [ ] Performance <1seg load time
- [ ] RTL funciona para árabe

### Documentation
- [ ] Guía de terminología creada
- [ ] Ejemplos de uso en código
- [ ] FAQs actualizadas

### Deployment
- [ ] Cambios commiteados
- [ ] PR aprobado por arquitecto
- [ ] Deploy a staging validado
- [ ] Deploy a producción

---

## 🎯 PRÓXIMOS PASOS

Cuando crees tu próxima unidad de negocio:

1. **Lee este documento completo** (15 min)
2. **Sigue PASO 1-10** en orden (4-8 horas)
3. **Valida con CHECKLIST FINAL** (1 hora)
4. **Documenta aprendizajes** para mejorar este guide

**Necesitas ayuda?**
- Revisa `TROUBLESHOOTING` section
- Consulta `FAQs`
- Contacta al arquitecto del sistema

---

## 🎓 CASOS DE USO PARA ADOLESCENTES (Explicación Simple)

### Caso 1: Abrir un Restaurante en la Plataforma

**Situación:**
Tu papá te dice: "Quiero agregar un restaurante a nuestra plataforma VibeThink".

**¿Qué significa eso?**
Necesitas que la app hable de "mesas", "menú", "comida", etc. en 9 idiomas diferentes (inglés, español, árabe, chino, francés, portugués, alemán, italiano, coreano).

**Paso a paso (versión simple):**

1. **Piensa qué palabras necesitas** (10 min)
   - ¿Qué tiene un restaurante? → Mesas, comida, chef, menú
   - Escribe lista de 20-30 palabras importantes

2. **Crea archivo en inglés** (30 min)
   - Archivo: `concept-restaurant.json`
   - Pon todas las palabras en inglés primero
   - Ejemplo: `"table": "Table"`, `"chef": "Chef"`

3. **Traduce a otros idiomas** (2 horas con AI)
   - Copia el archivo 8 veces (uno por idioma)
   - Usa ChatGPT/Claude para traducir
   - Ejemplo español: `"table": "Mesa"`, `"chef": "Chef"`

4. **Agrega al código** (30 min)
   - Edita 3 archivos (te dice cuáles en PASO 4-6)
   - Copy-paste código que está en la guía

5. **Prueba** (15 min)
   - Abre la app
   - Cambia idioma de inglés a español
   - Verifica que "Table" se vuelve "Mesa"

**Total:** ~4 horas (la primera vez). Después te tomas 2 horas.

---

### Caso 2: Abrir un Gimnasio

**Situación:**
Ahora quieres agregar un gimnasio (gym) a la plataforma.

**Palabras que necesitas:**
- Equipos: treadmill (caminadora), weights (pesas), bike (bici)
- Clases: yoga, spinning, crossfit
- Membresías: daily (diaria), monthly (mensual), annual (anual)

**Pasos (ahora más rápido porque ya sabes):**

1. **Lista de palabras** (5 min) ✓
2. **Archivo inglés** (20 min) ✓
3. **Traducir con AI** (1 hora) ✓
4. **Editar código** (20 min) ✓
5. **Probar** (10 min) ✓

**Total:** ~2 horas (ya le agarraste la onda)

---

### Caso 3: Tu Cliente Habla Solo Alemán

**Situación:**
Un cliente alemán entra a tu app de hotel y no entiende nada.

**¿Qué hace el sistema?**

```
Cliente abre app → Detecta idioma del navegador (alemán)
                 ↓
Sistema busca: de/concept-hotel.json (archivo alemán)
                 ↓
Si encuentra → Muestra "Zimmer" (habitación en alemán)
Si NO encuentra → Muestra "Room" (inglés, mejor que nada)
```

**Magia del sistema:**
- Automático, no haces nada
- Cliente feliz porque entiende
- Más ventas para ti

---

### Caso 4: Tienes Hotel + Restaurant en la Misma App

**Situación:**
Un cliente puede reservar habitación (hotel) Y mesa (restaurant).

**Problema:**
La palabra "reservation" puede significar dos cosas:
- Reserva de habitación → `concept.hotel.booking.reservation`
- Reserva de mesa → `concept.restaurant.booking.reservation`

**Solución del sistema:**

```typescript
// Cuando estás en página de hotel:
resolveConcept('concept.hotel.booking.reservation', 'es', 'hotel')
// → "Reserva de Habitación"

// Cuando estás en página de restaurant:
resolveConcept('concept.restaurant.booking.reservation', 'es', 'restaurant')
// → "Reserva de Mesa"
```

**Por qué es importante:**
- Cada negocio tiene su propio diccionario
- No se mezclan
- Cliente entiende contexto correcto

---

### Caso 5: Cliente Árabe (Escritura de Derecha a Izquierda)

**Situación:**
Cliente de Arabia Saudita abre tu app.

**Reto:**
- Árabe se escribe de DERECHA → IZQUIERDA
- Español/Inglés se escribe de IZQUIERDA → DERECHA

**Lo que hace el sistema:**

```
Cliente selecciona árabe (ar)
                 ↓
Sistema carga: ar/concept-hotel.json
                 ↓
Detecta que es RTL (right-to-left)
                 ↓
Voltea toda la interfaz: menú a la derecha, texto al revés
                 ↓
Cliente lee cómodamente en su idioma
```

**Ejemplo visual:**
```
Inglés (LTR):  [Menu]  Welcome to Hotel      [Profile]
Árabe (RTL):   [Profile]  مرحبا بك في الفندق  [Menu]
```

---

### Caso 6: Tienes 1000 Clientes Simultáneos

**Situación:**
- 300 hablan español
- 300 hablan inglés
- 200 hablan chino
- 200 hablan árabe

**¿Qué pasa?**

```
Server carga TODOS los idiomas al inicio (2 segundos)
                 ↓
Los guarda en memoria (cache)
                 ↓
Cada cliente pide su idioma:
  - Español → YA está en cache (0.001 seg)
  - Inglés → YA está en cache (0.001 seg)
  - Chino → YA está en cache (0.001 seg)
  - Árabe → YA está en cache (0.001 seg)
                 ↓
Todos felices, app súper rápida
```

**Sin este sistema:**
- Cada cliente: 2 segundos
- 1000 clientes × 2 seg = 2000 segundos = 33 minutos de carga total
- App lenta = clientes enojados

**Con este sistema:**
- Primer cliente: 2 segundos
- Clientes 2-1000: 0.001 segundos cada uno
- App rápida = clientes felices

---

## 🏢 CASOS DE USO CENTRALIZADOS (Arquitectura Empresarial)

### Caso Centralizado 1: Multi-Tenant SaaS Platform

**Escenario:**
Tienes una plataforma donde cada tenant (cliente corporativo) opera diferentes tipos de negocios.

**Arquitectura:**

```
Platform VibeThink (centralizado)
├── Tenant A (Hotel Chain Internacional)
│   ├── Product: hotel
│   ├── Locales: en, es, fr, de (4 idiomas Europa/América)
│   └── 50 hoteles en 12 países
│
├── Tenant B (Coworking Global)
│   ├── Product: cowork
│   ├── Locales: en, zh, ko, ja (4 idiomas Asia/América)
│   └── 200 espacios en 30 ciudades
│
└── Tenant C (Multi-Vertical)
    ├── Products: hotel + restaurant + gym
    ├── Locales: ALL (9 idiomas)
    └── 15 propiedades híbridas
```

**Implementación Centralizada:**

```typescript
// Detección automática de tenant + product context
async function initializeApp(tenantId: string, userId: string) {
  // 1. Detectar tenant
  const tenant = await getTenant(tenantId);

  // 2. Detectar productos activos del tenant
  const activeProducts = tenant.enabledProducts; // ['hotel', 'restaurant']

  // 3. Detectar idioma del usuario
  const userLocale = await getUserPreferredLocale(userId) ||
                     detectBrowserLocale() ||
                     tenant.defaultLocale;

  // 4. Pre-cargar solo namespaces necesarios
  const namespaces = activeProducts.map(p => `concept-${p}`);

  // 5. Crear snapshot optimizado
  const snapshot = await createTerminologySnapshot(
    userLocale,
    activeProducts[0] // Producto principal
  );

  return { locale: userLocale, snapshot, namespaces };
}
```

**Ventajas:**
- ✅ Un solo codebase para todos los tenants
- ✅ Cada tenant solo carga lo que necesita
- ✅ Optimización automática por tenant
- ✅ Escalable a infinitos tenants

---

### Caso Centralizado 2: Gobierno de Traducciones Corporativo

**Escenario:**
Equipo centralizado de traductores profesionales mantiene calidad de traducciones.

**Workflow:**

```
┌─────────────────────────────────────────────────┐
│ 1. Developer crea nuevo concepto                │
│    → concept.gym.equipment.treadmill            │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ 2. CI/CD Pipeline detecta concepto sin traducir │
│    → Crea ticket en Jira automáticamente        │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ 3. Translation Manager asigna a traductores     │
│    → Español: Maria                             │
│    → Alemán: Hans                               │
│    → Chino: Wei                                 │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ 4. Traductores editan en Translation Platform  │
│    (Lokalise, Phrase, Crowdin)                  │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ 5. Traducciones aprobadas → Push a Git         │
│    → Merge a main branch                        │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ 6. Deploy automático a producción              │
│    → Todos los tenants tienen nueva traducción │
└─────────────────────────────────────────────────┘
```

**Script de Auditoría Centralizado:**

```javascript
// scripts/audit-missing-translations-centralized.js

const fs = require('fs');
const path = require('path');

// Configuración por tenant
const TENANT_CONFIG = {
  'tenant-a-hotel': {
    products: ['hotel'],
    requiredLocales: ['en', 'es', 'fr', 'de'],
    priority: 'high'
  },
  'tenant-b-cowork': {
    products: ['cowork'],
    requiredLocales: ['en', 'zh', 'ko'],
    priority: 'medium'
  },
  'tenant-c-multi': {
    products: ['hotel', 'restaurant', 'gym'],
    requiredLocales: ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko'],
    priority: 'critical'
  }
};

// Auditar traducciones faltantes
function auditMissingTranslations() {
  const issues = [];

  for (const [tenantId, config] of Object.entries(TENANT_CONFIG)) {
    for (const product of config.products) {
      const baseFile = `concept-${product}.json`;
      const enPath = path.join('translations', 'en', baseFile);
      const baseData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      const baseKeys = extractKeys(baseData);

      for (const locale of config.requiredLocales) {
        if (locale === 'en') continue; // Skip baseline

        const localePath = path.join('translations', locale, baseFile);

        if (!fs.existsSync(localePath)) {
          issues.push({
            tenant: tenantId,
            product,
            locale,
            issue: 'FILE_MISSING',
            priority: config.priority,
            impact: `${baseKeys.length} translations missing`
          });
          continue;
        }

        const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
        const localeKeys = extractKeys(localeData);
        const missingKeys = baseKeys.filter(k => !localeKeys.includes(k));

        if (missingKeys.length > 0) {
          issues.push({
            tenant: tenantId,
            product,
            locale,
            issue: 'INCOMPLETE_TRANSLATIONS',
            priority: config.priority,
            missingKeys,
            completeness: `${((localeKeys.length / baseKeys.length) * 100).toFixed(1)}%`
          });
        }
      }
    }
  }

  // Generar reporte para Translation Manager
  generateJiraTickets(issues);
  generateSlackNotification(issues);

  return issues;
}

// Generar tickets de Jira automáticamente
function generateJiraTickets(issues) {
  const criticalIssues = issues.filter(i => i.priority === 'critical');

  for (const issue of criticalIssues) {
    // Llamada a Jira API
    createJiraTicket({
      project: 'TRANSLATION',
      type: 'Task',
      priority: 'High',
      title: `Missing ${issue.locale} translations for ${issue.product}`,
      description: `
Tenant: ${issue.tenant}
Product: ${issue.product}
Locale: ${issue.locale}
Completeness: ${issue.completeness || '0%'}
Missing Keys: ${issue.missingKeys?.length || 'ALL'}

Action Required: Translate missing keys in ${issue.locale}
      `,
      assignee: getTranslatorForLocale(issue.locale)
    });
  }
}
```

**Integración con Translation Platform:**

```yaml
# .lokalise.yml (configuración)
project_id: "your-project-id"

pull:
  # Pull traducciones de Lokalise → Git
  file_format: json
  original_filenames: true
  directory_prefix: "apps/dashboard/src/lib/i18n/translations/"

push:
  # Push conceptos nuevos a Lokalise
  file_format: json
  lang_iso_mapping:
    en: en_US
    es: es_ES
    ar: ar_SA
    zh: zh_CN
    # ... otros

# GitHub Action
# .github/workflows/sync-translations.yml
name: Sync Translations
on:
  push:
    paths:
      - 'apps/dashboard/src/lib/i18n/translations/en/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: lokalise/lokalise-push-action@v1
        with:
          api-token: ${{ secrets.LOKALISE_TOKEN }}
          project-id: ${{ secrets.LOKALISE_PROJECT_ID }}
```

---

### Caso Centralizado 3: Performance at Scale

**Escenario:**
10,000 usuarios concurrentes en diferentes regiones del mundo.

**Arquitectura CDN + Edge Caching:**

```
User en España (es locale)
         ↓
    Cloudflare Edge (Madrid)
         ↓
    ¿Tiene es/concept-hotel.json en cache?
         ↓
    SÍ → Responde en 5ms (desde edge)
    NO → Fetch de Origin (100ms)
         ↓
    Cache en edge por 24 horas
         ↓
    Próximos 10,000 usuarios: 5ms
```

**Configuración Cloudflare Workers:**

```javascript
// cloudflare-worker-i18n-edge.js

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // Detectar requests de traducciones
  if (url.pathname.startsWith('/translations/')) {
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // Intentar servir desde edge cache
    let response = await cache.match(cacheKey);

    if (!response) {
      // Cache miss → fetch de origin
      response = await fetch(request);

      // Guardar en edge cache por 24 horas
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=86400');

      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });

      event.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  }

  // Otros requests → pass through
  return fetch(request);
}
```

**Métricas Esperadas:**

| Métrica | Sin Edge Caching | Con Edge Caching | Mejora |
|---------|------------------|------------------|--------|
| TTFB (Time to First Byte) | 100-200ms | 5-15ms | **20x más rápido** |
| Bandwidth Origin | 1TB/mes | 50GB/mes | **95% reducción** |
| Cache Hit Rate | 0% | 98% | N/A |
| Cost per 1M requests | $50 | $2 | **96% ahorro** |

---

### Caso Centralizado 4: Compliance & Regulatory

**Escenario:**
Operaciones en EU (GDPR), China (data sovereignty), y US (CCPA).

**Requerimientos Regulatorios:**

```
EU (GDPR)
├── Traducciones deben estar en servers dentro de EU
├── Consentimiento en idioma nativo del usuario
└── Right to be forgotten → Borrar traducciones personalizadas

China
├── Traducciones deben estar en servers en China mainland
├── Aprobación gubernamental de términos específicos
└── No usar CDNs internacionales

US (CCPA)
├── Disclosure en inglés + español (California)
└── Opt-out en idioma preferido del usuario
```

**Arquitectura Geo-Distributed:**

```
┌──────────────────────────────────────────────────┐
│ Translation Source of Truth (GitHub)             │
│ - Código público: concept-*.json (todos idiomas) │
└─────────────────┬────────────────────────────────┘
                  ↓
       ┌──────────┴──────────┐
       ↓                     ↓
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ EU Region   │       │ China Region│       │ US Region   │
│ (Frankfurt) │       │ (Beijing)   │       │ (Oregon)    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ Locales:    │       │ Locales:    │       │ Locales:    │
│ - en, es    │       │ - zh        │       │ - en, es    │
│ - fr, de    │       │ - (filtered)│       │ - (all)     │
│ - it, pt    │       │             │       │             │
│             │       │ Compliance: │       │ Compliance: │
│ Compliance: │       │ - Gov cert  │       │ - CCPA      │
│ - GDPR      │       │ - Local SVR │       │ - ADA       │
└─────────────┘       └─────────────┘       └─────────────┘
```

**Deploy Script Geo-Aware:**

```javascript
// scripts/deploy-translations-geo.js

const REGIONS = {
  eu: {
    server: 'eu-central-1',
    locales: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    compliance: ['GDPR'],
    cdnDistribution: 'E1234567890ABC'
  },
  cn: {
    server: 'cn-north-1',
    locales: ['zh'],
    compliance: ['CyberSecurity-Law'],
    cdnDistribution: null, // No CDN internacional
    requiresApproval: true
  },
  us: {
    server: 'us-west-2',
    locales: ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko'],
    compliance: ['CCPA', 'ADA'],
    cdnDistribution: 'E0987654321XYZ'
  }
};

async function deployTranslations(region) {
  const config = REGIONS[region];

  // 1. Filtrar solo locales permitidos en región
  const filteredTranslations = {};
  for (const locale of config.locales) {
    filteredTranslations[locale] = await loadTranslations(locale);
  }

  // 2. Compliance checks
  if (config.requiresApproval) {
    await validateGovernmentApproval(filteredTranslations);
  }

  if (config.compliance.includes('GDPR')) {
    await validateGDPRCompliance(filteredTranslations);
  }

  // 3. Deploy a región específica
  await uploadToS3({
    bucket: `vibethink-translations-${region}`,
    region: config.server,
    data: filteredTranslations,
    encryption: 'AES256'
  });

  // 4. Invalidar CDN (si aplica)
  if (config.cdnDistribution) {
    await cloudfront.createInvalidation({
      DistributionId: config.cdnDistribution,
      InvalidationBatch: {
        Paths: { Items: ['/translations/*'] }
      }
    });
  }

  console.log(`✅ Deployed ${config.locales.length} locales to ${region}`);
}
```

---

### Caso Centralizado 5: A/B Testing de Traducciones

**Escenario:**
Quieres probar qué traducción convierte mejor en el embudo de ventas.

**Implementación:**

```typescript
// lib/i18n/ab-testing-loader.ts

interface TranslationVariant {
  id: 'control' | 'variant-a' | 'variant-b';
  weight: number; // % de usuarios
  translations: Record<string, string>;
}

class ABTestingTranslationLoader {
  private experiments: Map<string, TranslationVariant[]>;

  async load(locale: Locale, namespace: string, userId: string): Promise<Record<string, any>> {
    // Cargar traducción base
    const baseTranslations = await this.baseLoader.load(locale, namespace);

    // Verificar si hay experimento activo
    const experimentKey = `${locale}:${namespace}`;
    const experiment = this.experiments.get(experimentKey);

    if (!experiment) {
      return baseTranslations;
    }

    // Asignar variante a usuario (consistente)
    const variant = this.assignVariant(userId, experiment);

    // Mergear traducciones de variante
    const finalTranslations = {
      ...baseTranslations,
      ...variant.translations
    };

    // Log para analytics
    this.trackExperimentAssignment(userId, experimentKey, variant.id);

    return finalTranslations;
  }

  private assignVariant(userId: string, variants: TranslationVariant[]): TranslationVariant {
    // Hash consistente del userId
    const hash = this.hashUserId(userId);
    const bucket = hash % 100;

    // Asignar según weights
    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (bucket < cumulative) {
        return variant;
      }
    }

    return variants[0]; // Fallback a control
  }
}

// Configuración de experimento
const EXPERIMENTS = {
  'es:concept-hotel': [
    {
      id: 'control',
      weight: 50, // 50% de usuarios
      translations: {
        'concept.booking.action.reserve': 'Reservar' // Original
      }
    },
    {
      id: 'variant-a',
      weight: 25, // 25% de usuarios
      translations: {
        'concept.booking.action.reserve': 'Reservar Ahora' // Más urgente
      }
    },
    {
      id: 'variant-b',
      weight: 25, // 25% de usuarios
      translations: {
        'concept.booking.action.reserve': 'Confirmar Reserva' // Más formal
      }
    }
  ]
};
```

**Analytics Dashboard:**

```sql
-- Query para medir conversión por variante

SELECT
  experiment_variant,
  COUNT(DISTINCT user_id) as users_exposed,
  COUNT(DISTINCT CASE WHEN converted = true THEN user_id END) as users_converted,
  (COUNT(DISTINCT CASE WHEN converted = true THEN user_id END) * 100.0 /
   COUNT(DISTINCT user_id)) as conversion_rate
FROM translation_experiments
WHERE experiment_key = 'es:concept-hotel'
  AND concept_id = 'concept.booking.action.reserve'
  AND date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY experiment_variant
ORDER BY conversion_rate DESC;

-- Resultado ejemplo:
-- variant-a: 8.5% conversion (Reservar Ahora) ← WINNER
-- control:   7.2% conversion (Reservar)
-- variant-b: 6.8% conversion (Confirmar Reserva)
```

---

## 📊 RESUMEN: Adolescentes vs Centralizado

| Aspecto | Versión Adolescente | Versión Centralizada |
|---------|---------------------|----------------------|
| **Audiencia** | 1 persona aprendiendo | Equipo empresarial (10-100 personas) |
| **Tiempo Setup** | 4 horas (primera vez) | 2-4 semanas (infraestructura completa) |
| **Complejidad** | Baja (copy-paste) | Alta (CI/CD, compliance, geo-distributed) |
| **Escalabilidad** | 1-5 productos | Infinitos productos, infinitos tenants |
| **Costo** | ~$0 (gratis con AI translations) | $500-5000/mes (Lokalise, CDN, infrastructure) |
| **Mantenimiento** | Manual (tú editas archivos) | Automatizado (Translation Manager + pipelines) |
| **Use Case** | Side project, startup MVP | Enterprise SaaS, multi-tenant platform |

---

**Última actualización:** 2025-12-26
**Mantenido por:** Equipo de Arquitectura
**Versión:** 1.0.0


