# Resolución de Contexto para Agentes de IA - Sistema de Traducciones

**Fecha:** 2025-12-20  
**Estado:** 📋 **Diseño** - Estrategia para agentes de IA  
**Objetivo:** Permitir que agentes de IA resuelvan automáticamente el contexto de módulos reutilizables

---

## 🎯 Problema

Cuando un agente de IA (Gemini, Claude, OpenAI) necesita generar texto o respuestas que usan módulos reutilizables (como `Booking`), debe resolver:

1. **Contexto del módulo:** ¿Es Hotel, Studio, Cowork, Coliving?
2. **Terminología correcta:** "Habitación" vs "Sala" vs "Espacio"
3. **Namespace correcto:** `booking.hotel` vs `booking.studio`

**Ejemplo:**
```
Usuario pregunta: "¿Hay espacio disponible para reservar?"
Agente debe saber:
- Si está en contexto Hotel → "¿Hay habitaciones disponibles?"
- Si está en contexto Studio → "¿Hay salas disponibles?"
- Si está en contexto Cowork → "¿Hay espacios disponibles?"
```

---

## 🔧 Solución: Sistema de Resolución de Contexto

### Estrategia 1: Detección Automática por Ruta (Recomendada)

#### 1.1 Contexto desde URL/Route

```typescript
// packages/utils/src/i18n/context-resolver.ts

/**
 * Tipos de contexto soportados
 */
export type ModuleContext = 
  | 'hotel'
  | 'studio'
  | 'cowork'
  | 'coliving'
  | 'generic';

/**
 * Resuelve el contexto desde la ruta actual
 */
export function resolveContextFromRoute(pathname: string): ModuleContext {
  // Detectar contexto desde ruta
  if (pathname.includes('/hotel')) return 'hotel';
  if (pathname.includes('/studio')) return 'studio';
  if (pathname.includes('/cowork')) return 'cowork';
  if (pathname.includes('/coliving')) return 'coliving';
  
  // Fallback a generic
  return 'generic';
}

/**
 * Obtiene el namespace correcto para un módulo reutilizable
 */
export function getContextualNamespace(
  moduleName: string,
  context: ModuleContext
): string {
  // Si es generic, usar namespace base
  if (context === 'generic') {
    return moduleName;
  }
  
  // Si tiene override específico, usar ese
  return `${moduleName}.${context}`;
}
```

#### 1.2 Uso en Componentes

```typescript
// apps/dashboard/app/dashboard-bundui/hotel/bookings/page.tsx
'use client';

import { usePathname } from 'next/navigation';
import { resolveContextFromRoute, getContextualNamespace } from '@vibethink/utils';
import { useTranslation } from '@/lib/i18n';

export default function BookingsPage() {
  const pathname = usePathname();
  const context = resolveContextFromRoute(pathname); // 'hotel'
  const namespace = getContextualNamespace('booking', context); // 'booking.hotel'
  const { t } = useTranslation(namespace);
  
  return (
    <div>
      <h1>{t('title')}</h1>
      {/* "Reserva de Habitación" en lugar de "Reserva" genérico */}
    </div>
  );
}
```

---

### Estrategia 2: Contexto Explícito (Para Agentes de IA)

#### 2.1 API para Agentes de IA

```typescript
// packages/utils/src/i18n/ai-context-resolver.ts

/**
 * Resuelve contexto para agentes de IA
 * 
 * @param userQuery - Pregunta del usuario
 * @param currentPath - Ruta actual (opcional)
 * @param explicitContext - Contexto explícito (opcional)
 */
export function resolveContextForAI(
  userQuery: string,
  currentPath?: string,
  explicitContext?: ModuleContext
): {
  context: ModuleContext;
  namespace: string;
  terminology: Record<string, string>;
} {
  // 1. Si hay contexto explícito, usarlo
  if (explicitContext) {
    return getContextMetadata(explicitContext);
  }
  
  // 2. Intentar detectar desde ruta
  if (currentPath) {
    const routeContext = resolveContextFromRoute(currentPath);
    if (routeContext !== 'generic') {
      return getContextMetadata(routeContext);
    }
  }
  
  // 3. Intentar detectar desde query (NLP básico)
  const queryContext = detectContextFromQuery(userQuery);
  if (queryContext) {
    return getContextMetadata(queryContext);
  }
  
  // 4. Fallback a generic
  return getContextMetadata('generic');
}

/**
 * Detecta contexto desde la pregunta del usuario
 */
function detectContextFromQuery(query: string): ModuleContext | null {
  const lowerQuery = query.toLowerCase();
  
  // Palabras clave por contexto
  const keywords = {
    hotel: ['hotel', 'habitación', 'huesped', 'check-in', 'check-out', 'noche'],
    studio: ['sala', 'estudio', 'grabación', 'sonido', 'instrumento', 'ensayo'],
    cowork: ['espacio', 'oficina', 'cowork', 'escritorio', 'mesa'],
    coliving: ['coliving', 'vivienda', 'compartida', 'roommate'],
  };
  
  for (const [context, words] of Object.entries(keywords)) {
    if (words.some(word => lowerQuery.includes(word))) {
      return context as ModuleContext;
    }
  }
  
  return null;
}

/**
 * Obtiene metadata completa de un contexto
 */
function getContextMetadata(context: ModuleContext): {
  context: ModuleContext;
  namespace: string;
  terminology: Record<string, string>;
} {
  const terminology = {
    hotel: {
      space: 'habitación',
      spacePlural: 'habitaciones',
      booking: 'reserva',
      guest: 'huésped',
      checkIn: 'check-in',
      checkOut: 'check-out',
    },
    studio: {
      space: 'sala',
      spacePlural: 'salas',
      booking: 'reserva',
      guest: 'cliente',
      checkIn: 'inicio',
      checkOut: 'fin',
    },
    cowork: {
      space: 'espacio',
      spacePlural: 'espacios',
      booking: 'reserva',
      guest: 'usuario',
      checkIn: 'inicio',
      checkOut: 'fin',
    },
    generic: {
      space: 'espacio',
      spacePlural: 'espacios',
      booking: 'reserva',
      guest: 'usuario',
      checkIn: 'inicio',
      checkOut: 'fin',
    },
  };
  
  return {
    context,
    namespace: context === 'generic' ? 'booking' : `booking.${context}`,
    terminology: terminology[context],
  };
}
```

#### 2.2 Uso en Agentes de IA

```typescript
// Ejemplo: Gemini Function Calling

const functions = [
  {
    name: 'checkAvailability',
    description: 'Verifica disponibilidad de espacios',
    parameters: {
      type: 'object',
      properties: {
        context: {
          type: 'string',
          enum: ['hotel', 'studio', 'cowork', 'coliving'],
          description: 'Contexto del módulo booking',
        },
        date: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['context', 'date'],
    },
  },
];

// Cuando el agente llama la función:
async function handleCheckAvailability(params: { context: string; date: string }) {
  const { context, namespace, terminology } = resolveContextForAI(
    '', // query no disponible
    undefined, // path no disponible
    params.context as ModuleContext
  );
  
  // Usar terminología correcta
  const response = `Verificando disponibilidad de ${terminology.spacePlural}...`;
  
  return response;
}
```

---

### Estrategia 3: ICU Message Format (Ya Implementado)

#### 3.1 Uso de ICU Select

```json
// apps/dashboard/src/lib/i18n/translations/es/booking.json
{
  "title": "{context, select, hotel {Reserva de Habitación} studio {Reserva de Sala} cowork {Reserva de Espacio} other {Reserva}}",
  "available": "{context, select, hotel {Habitaciones disponibles} studio {Salas disponibles} cowork {Espacios disponibles} other {Espacios disponibles}}",
  "checkIn": "{context, select, hotel {Check-in} studio {Inicio de sesión} cowork {Inicio} other {Inicio}}"
}
```

#### 3.2 Uso en Agentes de IA

```typescript
// El agente puede usar ICU directamente
import { formatMessage } from '@vibethink/utils';

function generateResponse(context: ModuleContext, locale: string) {
  const message = t('booking.available'); // ICU message
  return formatMessage(locale, message, { context });
}

// Resultado:
// context='hotel' → "Habitaciones disponibles"
// context='studio' → "Salas disponibles"
// context='cowork' → "Espacios disponibles"
```

---

## 🤖 Integración con Agentes de IA

### Para Gemini/Claude/OpenAI

#### Opción A: Function Calling con Contexto

```typescript
// Sistema de funciones para agentes
const bookingFunctions = {
  checkAvailability: {
    description: 'Verifica disponibilidad. Requiere contexto (hotel/studio/cowork).',
    parameters: {
      context: { type: 'string', enum: ['hotel', 'studio', 'cowork'] },
      date: { type: 'string' },
    },
    handler: async (params) => {
      const { context, namespace, terminology } = resolveContextForAI(
        '',
        undefined,
        params.context
      );
      
      // Lógica de negocio usando terminología correcta
      return {
        message: `Verificando ${terminology.spacePlural} disponibles...`,
        namespace, // Para usar traducciones correctas
      };
    },
  },
};
```

#### Opción B: Prompt Engineering con Contexto

```typescript
// Prompt para agentes
const systemPrompt = `
Eres un asistente de reservas. 

CONTEXTO ACTUAL: {context}
TERMINOLOGÍA:
- Espacio: {terminology.space}
- Espacios (plural): {terminology.spacePlural}
- Reserva: {terminology.booking}
- Usuario: {terminology.guest}

Cuando respondas, usa SIEMPRE la terminología del contexto actual.
`;

// El agente recibe el contexto y usa la terminología correcta
```

#### Opción C: Sistema de Traducciones Dinámico

```typescript
// El agente puede consultar traducciones directamente
async function getTranslationForAI(
  key: string,
  context: ModuleContext,
  locale: string
): Promise<string> {
  const namespace = getContextualNamespace('booking', context);
  const translation = await loadTranslation(locale, namespace);
  
  // Si la key existe en contexto específico, usarla
  // Si no, usar base + ICU select
  const value = translation[key] || getBaseTranslation(key);
  
  // Si es ICU, formatear con contexto
  if (isICUMessage(value)) {
    return formatMessage(locale, value, { context });
  }
  
  return value;
}
```

---

## 📋 Implementación Recomendada

### Fase 1: Detección Automática (1 día)

1. **Crear `context-resolver.ts`**
   - Función `resolveContextFromRoute()`
   - Función `getContextualNamespace()`
   - Tests básicos

2. **Integrar en componentes**
   - Usar en páginas de booking
   - Validar que funciona

### Fase 2: API para Agentes (1 día)

1. **Crear `ai-context-resolver.ts`**
   - Función `resolveContextForAI()`
   - Detección desde query (NLP básico)
   - Metadata de terminología

2. **Integrar en sistema de funciones**
   - Agregar contexto a function calling
   - Validar con Gemini/Claude

### Fase 3: Documentación y Tests (1 día)

1. **Documentar uso**
   - Guía para desarrolladores
   - Guía para agentes de IA
   - Ejemplos completos

2. **Tests**
   - Tests de detección de contexto
   - Tests de resolución para IA
   - Tests de integración

---

## 🎯 Ejemplo Completo: Booking en Hotel vs Studio

### Traducciones

```json
// booking.json (base)
{
  "title": "{context, select, hotel {Reserva de Habitación} studio {Reserva de Sala} other {Reserva}}",
  "available": "{context, select, hotel {Habitaciones disponibles} studio {Salas disponibles} other {Espacios disponibles}}"
}

// booking.hotel.json (override específico)
{
  "amenities": "Amenidades de la habitación",
  "roomType": "Tipo de habitación"
}

// booking.studio.json (override específico)
{
  "amenities": "Equipamiento de la sala",
  "roomType": "Tipo de sala"
}
```

### Uso en Componente

```typescript
// Hotel booking page
const context = resolveContextFromRoute(pathname); // 'hotel'
const namespace = getContextualNamespace('booking', context); // 'booking.hotel'
const { t } = useTranslation(namespace);

t('title', { context: 'hotel' }); // "Reserva de Habitación"
t('amenities'); // "Amenidades de la habitación" (desde override)
```

### Uso en Agente de IA

```typescript
// Gemini function calling
const response = await gemini.generate({
  prompt: userQuery,
  functions: [{
    name: 'checkBooking',
    parameters: {
      context: resolveContextForAI(userQuery, pathname).context,
      // ...
    },
  }],
});

// El agente usa terminología correcta automáticamente
```

---

## ✅ Ventajas de Esta Solución

1. **Automático:** Detecta contexto desde ruta
2. **Flexible:** Soporta contexto explícito para IA
3. **Extensible:** Fácil agregar nuevos contextos
4. **Compatible:** Funciona con ICU Message Format existente
5. **AI-Ready:** Agentes pueden resolver contexto automáticamente

---

## 🚨 Consideraciones

### Para Agentes de IA

1. **Contexto debe ser explícito:**
   - Agregar `context` a function calling
   - Incluir en system prompt
   - Validar en handler

2. **Fallback seguro:**
   - Si contexto no se detecta → 'generic'
   - Si namespace no existe → usar base + ICU

3. **Performance:**
   - Cachear resolución de contexto
   - Lazy load traducciones por contexto

---

## 📝 Próximos Pasos

1. **Implementar `context-resolver.ts`** (Fase 1)
2. **Implementar `ai-context-resolver.ts`** (Fase 2)
3. **Integrar en hotel-pilot** (validar con Booking)
4. **Documentar para agentes de IA** (guía de uso)
5. **Tests completos** (Fase 3)

---

**Última actualización:** 2025-12-20  
**Estado:** Diseño completo, listo para implementación

---

## 🎯 Enfoque IA First: Componentes Reutilizables

**Concepto clave:** Un componente (ej: `BookingCard`) funciona para `hotel/studio/cowork` sin cambiar código, solo cambiando `context`.

**Documentación completa:** `docs/architecture/IA_FIRST_REUSABLE_COMPONENTS.md` ⭐

**Ejemplo:**
```typescript
// Un solo componente para todos los contextos
<BookingCard booking={booking} />
// → Auto-detecta context desde ruta
// → Hotel: "Reserva de Habitación", "habitación", "3 noches"
// → Studio: "Reserva de Sala", "sala", "2 horas"
// → Cowork: "Reserva de Espacio", "espacio", "1 día"
```

**Ventajas:**
- ✅ Agentes de IA pueden usar automáticamente
- ✅ Auto-detección de contexto desde ruta
- ✅ Terminología correcta según contexto
- ✅ Sin duplicación de código

---

**Esta solución permite que tanto componentes React como agentes de IA resuelvan automáticamente el contexto de módulos reutilizables, usando la terminología correcta según el contexto (Hotel, Studio, Cowork, etc.).**

