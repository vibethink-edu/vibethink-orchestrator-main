# IA First: Componentes Reutilizables Context-Aware

**Fecha:** 2025-12-20  
**Estado:** 🎯 **ESTRATEGIA PRINCIPAL** - IA First Design  
**Propósito:** Componentes que funcionan para múltiples contextos sin cambiar código, solo cambiando `context`

---

## 🎯 Concepto Central

**Resultado:** Un `BookingCard` que funciona para `hotel/studio/cowork` sin cambiar código, solo cambiando `context`.

**Principio IA First:** Los agentes de IA pueden usar estos componentes automáticamente, resolviendo el contexto desde la ruta o query del usuario.

---

## 🚀 Ejemplo: BookingCard Reutilizable

### ❌ Enfoque Tradicional (NO IA First)

```typescript
// ❌ INCORRECTO: Código duplicado por contexto
function HotelBookingCard() {
  return <div>Reserva habitación</div>;
}

function StudioBookingCard() {
  return <div>Reserva sala</div>;
}

function CoworkBookingCard() {
  return <div>Reserva espacio</div>;
}
```

**Problemas:**
- ❌ Código duplicado
- ❌ Agentes de IA no pueden inferir contexto automáticamente
- ❌ Mantenimiento difícil
- ❌ No escalable

---

### ✅ Enfoque IA First (Recomendado)

```typescript
// ✅ CORRECTO: Un componente, múltiples contextos
interface BookingCardProps {
  context?: 'hotel' | 'studio' | 'cowork' | null; // Auto-detectado si no se pasa
  booking: Booking;
  // ... otros props
}

export function BookingCard({ 
  context, 
  booking,
  ...props 
}: BookingCardProps) {
  // Auto-detectar contexto si no se pasa
  const finalContext = context || useAutoDetectContext();
  
  // Usar terminología según contexto
  const { t } = useTranslation('concept');
  const spaceLabel = t(`concept.resource.${getSpaceType(finalContext)}`);
  const bookingLabel = t('concept.booking.label', { context: finalContext });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{bookingLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <span>{spaceLabel}: </span>
          <span>{booking.spaceNumber}</span>
        </div>
        <div>
          <span>{t('concept.duration.label')}: </span>
          <span>
            {booking.count} {t(`concept.unit.${booking.unit}`, { count: booking.count })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper para obtener tipo de espacio según contexto
function getSpaceType(context: string): string {
  const mapping = {
    hotel: 'room',
    studio: 'studio',
    cowork: 'space',
  };
  return mapping[context as keyof typeof mapping] || 'space';
}
```

**Ventajas:**
- ✅ Un solo componente para todos los contextos
- ✅ Agentes de IA pueden inferir contexto automáticamente
- ✅ Mantenimiento centralizado
- ✅ Escalable a nuevos contextos

---

## 🤖 IA First: Auto-Detección de Contexto

### Hook: `useAutoDetectContext`

```typescript
// apps/dashboard/src/hooks/use-auto-detect-context.ts

import { usePathname } from 'next/navigation';
import { resolveContextFromRoute } from '@vibethink/utils';

/**
 * Auto-detecta contexto desde ruta actual
 * IA First: Los agentes pueden usar esto automáticamente
 */
export function useAutoDetectContext(): 'hotel' | 'studio' | 'cowork' | null {
  const pathname = usePathname();
  
  // Detectar desde ruta
  if (pathname.includes('/hotel')) return 'hotel';
  if (pathname.includes('/studio')) return 'studio';
  if (pathname.includes('/cowork')) return 'cowork';
  
  return null; // Sin contexto específico
}
```

### Uso en Componentes

```typescript
export function BookingCard({ context, ...props }: BookingCardProps) {
  // Auto-detectar si no se pasa explícitamente
  const autoContext = useAutoDetectContext();
  const finalContext = context || autoContext;
  
  // Resto del componente...
}
```

---

## 🎨 Sistema de Terminología Integrado

### Estructura JSON (Concept IDs Atómicos)

```json
{
  "concept": {
    "resource": {
      "room": "habitación",
      "studio": "sala",
      "space": "espacio"
    },
    "booking": {
      "label": "{context, select, hotel {Reserva de Habitación} studio {Reserva de Sala} cowork {Reserva de Espacio} other {Reserva}}",
      "title": "{context, select, hotel {Reserva} studio {Reserva} cowork {Reserva} other {Reserva}}"
    },
    "unit": {
      "night": "{count, plural, one {noche} other {noches}}",
      "hour": "{count, plural, one {hora} other {horas}}",
      "day": "{count, plural, one {día} other {días}}"
    },
    "duration": {
      "label": "Duración"
    }
  }
}
```

### Uso con `term()` (IA First)

```typescript
import { term } from '@vibethink/utils';

// Resolver terminología según contexto
const spaceLabel = await term('concept.resource.room', {}, locale, 'hotel');
// → "habitación"

const bookingLabel = await term('concept.booking.label', { context: 'hotel' }, locale, 'hotel');
// → "Reserva de Habitación"

const durationLabel = await term('concept.unit.night', { count: 3 }, locale, 'hotel');
// → "3 noches"
```

---

## 🤖 Integración con Agentes de IA

### Para Gemini/Claude/OpenAI

#### Opción 1: Function Calling con Contexto

```typescript
const functions = [
  {
    name: 'renderBookingCard',
    description: 'Renderiza un BookingCard según contexto',
    parameters: {
      type: 'object',
      properties: {
        context: {
          type: 'string',
          enum: ['hotel', 'studio', 'cowork'],
          description: 'Contexto del booking (auto-detectado desde ruta si no se pasa)',
        },
        booking: {
          type: 'object',
          properties: {
            spaceNumber: { type: 'string' },
            count: { type: 'number' },
            unit: { type: 'string', enum: ['night', 'hour', 'day'] },
          },
        },
      },
      required: ['booking'],
    },
  },
];

// El agente puede llamar:
await renderBookingCard({
  booking: { spaceNumber: '101', count: 3, unit: 'night' },
  // context se auto-detecta desde ruta actual
});
```

#### Opción 2: Prompt Engineering

```typescript
const systemPrompt = `
Eres un asistente de reservas.

CONTEXTO ACTUAL: {context} (auto-detectado desde ruta)
TERMINOLOGÍA DISPONIBLE:
- Espacio: {terminology.space}
- Reserva: {terminology.booking}
- Duración: {terminology.duration}

Cuando generes respuestas o uses componentes:
1. Usa SIEMPRE la terminología del contexto actual
2. Los componentes son reutilizables - solo cambia el context prop
3. Si no especificas context, se auto-detecta desde la ruta

EJEMPLO:
- Usuario en /hotel → context='hotel' → "habitación", "check-in"
- Usuario en /studio → context='studio' → "sala", "inicio de sesión"
`;

// El agente usa automáticamente la terminología correcta
```

---

## 📋 Patrón Completo: BookingCard IA First

### Implementación Completa

```typescript
// apps/dashboard/src/shared/components/booking/booking-card.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@vibethink/ui';
import { useAutoDetectContext } from '@/hooks/use-auto-detect-context';
import { term } from '@vibethink/utils';
import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';

interface Booking {
  id: string;
  spaceNumber: string;
  count: number;
  unit: 'night' | 'hour' | 'day';
  startDate: Date;
  endDate: Date;
}

interface BookingCardProps {
  /** Contexto explícito (opcional - se auto-detecta si no se pasa) */
  context?: 'hotel' | 'studio' | 'cowork' | null;
  /** Datos del booking */
  booking: Booking;
  /** Locale (opcional - se obtiene del I18nProvider) */
  locale?: string;
}

export function BookingCard({ 
  context: explicitContext,
  booking,
  locale,
}: BookingCardProps) {
  // Auto-detectar contexto si no se pasa explícitamente
  const autoContext = useAutoDetectContext();
  const finalContext = explicitContext || autoContext;
  
  const { locale: currentLocale } = useTranslation();
  const finalLocale = locale || currentLocale;
  
  // Resolver terminología según contexto
  const [terminology, setTerminology] = useState({
    spaceLabel: '',
    bookingLabel: '',
    durationLabel: '',
  });
  
  useEffect(() => {
    async function loadTerminology() {
      if (!finalContext) return;
      
      // Resolver terminología según contexto
      const spaceType = getSpaceType(finalContext);
      const spaceLabel = await term(
        `concept.resource.${spaceType}`,
        {},
        finalLocale,
        finalContext
      );
      
      const bookingLabel = await term(
        'concept.booking.label',
        { context: finalContext },
        finalLocale,
        finalContext
      );
      
      const durationLabel = await term(
        `concept.unit.${booking.unit}`,
        { count: booking.count },
        finalLocale,
        finalContext
      );
      
      setTerminology({
        spaceLabel,
        bookingLabel,
        durationLabel,
      });
    }
    
    loadTerminology();
  }, [finalContext, finalLocale, booking.unit, booking.count]);
  
  if (!finalContext) {
    return <div>Contexto no disponible</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{terminology.bookingLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">{terminology.spaceLabel}: </span>
            <span>{booking.spaceNumber}</span>
          </div>
          <div>
            <span className="font-medium">Duración: </span>
            <span>
              {booking.count} {terminology.durationLabel}
            </span>
          </div>
          <div>
            <span className="font-medium">Desde: </span>
            <span>{formatBookingRange(bookingWindow, finalLocale)}</span>
            {/* ✅ CORRECTO: Usa formatBookingRange() de @vibethink/utils/datetime */}
            {/* ❌ INCORRECTO: booking.startDate.toLocaleDateString() */}
          </div>
          <div>
            <span className="font-medium">Hasta: </span>
            {/* Ya incluido en formatBookingRange() */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper para obtener tipo de espacio según contexto
function getSpaceType(context: string): string {
  const mapping = {
    hotel: 'room',
    studio: 'studio',
    cowork: 'space',
  };
  return mapping[context as keyof typeof mapping] || 'space';
}
```

### Uso en Diferentes Contextos

```typescript
// En /dashboard-bundui/hotel/bookings
<BookingCard booking={hotelBooking} />
// → Auto-detecta context='hotel'
// → Muestra "Reserva de Habitación", "habitación", "3 noches"

// En /dashboard-bundui/studio/bookings
<BookingCard booking={studioBooking} />
// → Auto-detecta context='studio'
// → Muestra "Reserva de Sala", "sala", "2 horas"

// En /dashboard-bundui/cowork/bookings
<BookingCard booking={coworkBooking} />
// → Auto-detecta context='cowork'
// → Muestra "Reserva de Espacio", "espacio", "1 día"

// Contexto explícito (para agentes de IA)
<BookingCard booking={booking} context="hotel" />
// → Usa context='hotel' explícitamente
```

---

## 🎯 Principios IA First

### 1. Auto-Detección Inteligente

**Regla:** Si no se pasa `context`, se auto-detecta desde:
- Ruta actual (`usePathname()`)
- Query del usuario (NLP básico)
- Configuración del usuario

**Ventaja para IA:** Los agentes no necesitan especificar contexto explícitamente.

### 2. Terminología Context-Aware

**Regla:** Todos los strings usan `term()` con contexto.

**Ventaja para IA:** Los agentes pueden consultar terminología con `resolveTerminology()`.

### 3. Componentes Reutilizables

**Regla:** Un componente funciona para múltiples contextos.

**Ventaja para IA:** Los agentes pueden usar el mismo componente en diferentes contextos.

### 4. Contract Explícito para IA

**Regla:** Todos los componentes tienen interfaces claras para function calling.

**Ventaja para IA:** Los agentes pueden entender qué props acepta cada componente.

---

## 📋 Checklist para Componentes IA First

### Al Crear un Componente Reutilizable

- [ ] **Auto-detección de contexto:**
  - [ ] Usa `useAutoDetectContext()` si no se pasa `context`
  - [ ] Soporta `context` explícito para agentes de IA

- [ ] **Terminología context-aware:**
  - [ ] Usa `term()` para todos los strings
  - [ ] Concept IDs atómicos (no parámetros de tipo)
  - [ ] ICU Message Format para pluralización

- [ ] **Interface clara:**
  - [ ] Props documentadas con JSDoc
  - [ ] Tipos TypeScript explícitos
  - [ ] Ejemplos de uso para cada contexto

- [ ] **Contract para IA:**
  - [ ] Función helper para agentes (opcional)
  - [ ] Documentación de function calling schema
  - [ ] Ejemplos de integración con Gemini/Claude

---

## 🚀 Siguientes Pasos

### Fase 1: Componentes Base (1 semana)

1. **BookingCard** (ya diseñado)
   - [ ] Implementar con auto-detección
   - [ ] Integrar con `term()`
   - [ ] Validar en hotel/studio/cowork

2. **BookingForm**
   - [ ] Formulario reutilizable
   - [ ] Campos según contexto
   - [ ] Validación context-aware

3. **BookingList**
   - [ ] Lista de bookings
   - [ ] Filtros según contexto
   - [ ] Acciones context-aware

### Fase 2: Integración con Agentes (1 semana)

1. **Function Calling Schemas**
   - [ ] Generar schemas para todos los componentes
   - [ ] Documentar para Gemini/Claude
   - [ ] Tests de integración

2. **Helper Functions**
   - [ ] `renderBookingCard()` para agentes
   - [ ] `resolveTerminology()` ya implementado
   - [ ] `autoDetectContext()` helper

3. **Prompt Engineering**
   - [ ] System prompts con contexto
   - [ ] Ejemplos de uso para agentes
   - [ ] Documentación completa

### Fase 3: Extensión (Ongoing)

1. **Nuevos Componentes Reutilizables**
   - [ ] `ResourceCard` (habitación/sala/espacio)
   - [ ] `AvailabilityCalendar` (check-in/inicio/disponibilidad)
   - [ ] `PricingCard` (precio por noche/hora/día)

2. **Nuevos Contextos**
   - [ ] `coliving` (vivienda compartida)
   - [ ] `parking` (estacionamiento)
   - [ ] `event` (eventos)

---

## 📝 Ejemplo: Extensión a Nuevo Contexto

### Agregar Contexto "Coliving"

**Paso 1: Actualizar Terminología**

```json
{
  "concept": {
    "resource": {
      "room": "habitación",
      "studio": "sala",
      "space": "espacio",
      "bedroom": "dormitorio"  // ← Nuevo para coliving
    },
    "booking": {
      "label": "{context, select, hotel {Reserva de Habitación} studio {Reserva de Sala} cowork {Reserva de Espacio} coliving {Reserva de Dormitorio} other {Reserva}}"
    }
  }
}
```

**Paso 2: Actualizar Auto-Detección**

```typescript
export function useAutoDetectContext() {
  const pathname = usePathname();
  
  if (pathname.includes('/hotel')) return 'hotel';
  if (pathname.includes('/studio')) return 'studio';
  if (pathname.includes('/cowork')) return 'cowork';
  if (pathname.includes('/coliving')) return 'coliving'; // ← Nuevo
  
  return null;
}
```

**Paso 3: Usar en Componente**

```typescript
// ✅ BookingCard funciona automáticamente para coliving
<BookingCard booking={colivingBooking} />
// → Auto-detecta context='coliving'
// → Muestra "Reserva de Dormitorio", "dormitorio"
```

**¡Sin cambiar código del componente!** Solo agregar terminología y ruta.

---

## 🎯 Ventajas del Enfoque IA First

### Para Desarrolladores

- ✅ **Menos código:** Un componente para múltiples contextos
- ✅ **Mantenimiento fácil:** Cambios centralizados
- ✅ **Escalable:** Agregar contextos sin tocar componentes

### Para Agentes de IA

- ✅ **Auto-detección:** No necesitan especificar contexto
- ✅ **Terminología consistente:** `resolveTerminology()` siempre disponible
- ✅ **Componentes reutilizables:** Mismo componente, diferentes contextos
- ✅ **Contract claro:** Function calling schemas documentados

### Para Usuarios

- ✅ **Experiencia consistente:** Mismo componente en todos los contextos
- ✅ **Terminología correcta:** Siempre usa la terminología del contexto
- ✅ **Escalable:** Nuevos contextos se agregan fácilmente

---

## 📚 Referencias

- **Terminología:** `docs/architecture/I18N_TERMINOLOGY_ARCHITECTURE.md`
- **Context-Aware Translations:** `docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md`
- **AI Agent Context Resolution:** `docs/architecture/I18N_AI_AGENT_CONTEXT_RESOLUTION.md`
- **Regional Configuration:** `docs/architecture/REGIONAL_CONFIGURATION.md`

---

**Última actualización:** 2025-12-20  
**Estado:** 🎯 **ESTRATEGIA PRINCIPAL** - IA First Design

---

**Este enfoque permite crear componentes que funcionan para múltiples contextos sin cambiar código, diseñados desde el inicio para ser usados por agentes de IA de forma automática e inteligente.**


