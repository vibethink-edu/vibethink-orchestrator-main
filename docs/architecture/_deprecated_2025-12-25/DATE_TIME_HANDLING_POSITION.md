# Posición: Manejo de Fechas/Horas en Bookings

**Fecha:** 2025-12-21  
**Estado:** 🚨 **OBLIGATORIO** - Corrección quirúrgica y absolutamente necesaria  
**Versión:** 1.1.0 (con Addendum DateTime & Booking Logic Standard)

> **⚠️ ADVERTENCIA CRÍTICA:** Si no implementas la distinción `CivilDate` vs `Instant` ahora, en 3 meses estarás debuggeando por qué un cliente en Japón ve que su check-in en Cancún es "el día anterior" o "el día siguiente".

---

## 🎯 Objetivo

Definir posición coherente y sensible al contexto para el manejo de fechas/horas en bookings, diferenciando:
- **Hotel**: Reservas por **fechas** (check-in/check-out, noches)
- **Studio**: Reservas por **horas** (start time/end time, duración en horas)
- **Cowork**: Reservas por **horas/días** (flexible según necesidad)

---

## ❌ Problemas Actuales Identificados

### 1. Fechas Hardcoded como Strings
**Ubicación:** `apps/dashboard/app/dashboard-bundui/hotel/components/booking-list.tsx`

```typescript
// ❌ INCORRECTO
const bookings: Booking[] = [
  {
    checkIn: "June 19, 2028",  // Hardcoded string
    checkOut: "June 22, 2028", // Hardcoded string
  }
];
```

**Problemas:**
- No respeta locale (siempre en inglés)
- No respeta timezone
- No se puede calcular duración
- No se puede ordenar/filtrar correctamente

### 2. No Usa Sistema Regional
**Ubicación:** `apps/dashboard/src/shared/components/booking/booking-card.tsx`

```typescript
// ❌ INCORRECTO
function formatDate(date: Date | string, locale: string): string {
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
```

**Problemas:**
- No usa `formatDate()` de `@vibethink/utils`
- No respeta configuración regional (timezone, formato)
- No diferencia hotel (fechas) vs studio (horas)

### 3. No Hay formatDateRange
**Problema:** No existe función para formatear rangos de fechas.

**Necesidad:**
- Hotel: "June 19 - June 22, 2028" o "19-22 de junio de 2028"
- Studio: "10:00 AM - 2:00 PM" o "10:00 - 14:00"

### 4. No Diferencia Contexto
**Problema:** Mismo formateo para hotel (fechas) y studio (horas).

**Ejemplo actual:**
```typescript
// ❌ Ambos usan el mismo formato
{formatDate(booking.startDate, locale)} - {formatDate(booking.endDate, locale)}
```

**Debería ser:**
```typescript
// ✅ Hotel: Solo fechas
formatDateRange(startDate, endDate, locale, { includeTime: false })

// ✅ Studio: Solo horas
formatTimeRange(startTime, endTime, locale, { includeDate: false })

// ✅ Cowork: Fecha + hora
formatDateTimeRange(start, end, locale)
```

---

## ✅ Solución Propuesta

### 1. Crear formatDateRange en formatters-enhanced.ts

```typescript
/**
 * Format date range according to regional configuration
 * 
 * @example
 * // Hotel: "June 19 - June 22, 2028" (en-US)
 * // Hotel: "19-22 de junio de 2028" (es-ES)
 * formatDateRange(startDate, endDate, locale, { includeTime: false })
 * 
 * @example
 * // Studio: "10:00 AM - 2:00 PM" (en-US, 12h)
 * // Studio: "10:00 - 14:00" (es-ES, 24h)
 * formatTimeRange(startTime, endTime, locale, { includeDate: false })
 */
export function formatDateRange(
  start: Date | string,
  end: Date | string,
  locale: string,
  options?: {
    config?: RegionalConfiguration;
    includeTime?: boolean;
    preset?: DateFormatPreset;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  
  // Si mismo año y mes, compactar: "19-22 de junio de 2028"
  // Si mismo año, mostrar: "19 de junio - 22 de julio de 2028"
  // Si diferente año: "19 de junio de 2028 - 22 de julio de 2029"
  
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: config.date.timezone,
  });
  
  return formatter.formatRange(startDate, endDate);
}

export function formatTimeRange(
  start: Date | string,
  end: Date | string,
  locale: string,
  options?: {
    config?: RegionalConfiguration;
    includeDate?: boolean;
    preset?: TimeFormatPreset;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const startTime = typeof start === 'string' ? new Date(start) : start;
  const endTime = typeof end === 'string' ? new Date(end) : end;
  
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: config.time.format === '12h',
    timeZone: config.time.timezone,
  });
  
  if (options?.includeDate) {
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      timeZone: config.date.timezone,
    });
    return `${dateFormatter.format(startTime)} ${timeFormatter.format(startTime)} - ${timeFormatter.format(endTime)}`;
  }
  
  return `${timeFormatter.format(startTime)} - ${timeFormatter.format(endTime)}`;
}
```

### 2. Actualizar booking-list.tsx

```typescript
// ✅ CORRECTO
interface Booking {
  checkIn: Date;  // Date object, no string
  checkOut: Date; // Date object, no string
}

const bookings: Booking[] = [
  {
    checkIn: new Date('2028-06-19'),
    checkOut: new Date('2028-06-22'),
  }
];

// En el cell renderer:
cell: ({ row }) => {
  const { locale } = useTranslation();
  return (
    <span className="text-foreground">
      {formatDateRange(
        row.original.checkIn,
        row.original.checkOut,
        locale,
        { includeTime: false } // Hotel: solo fechas
      )}
    </span>
  );
}
```

### 3. Actualizar booking-card.tsx

```typescript
// ✅ CORRECTO
import { formatDate, formatDateRange, formatTimeRange } from '@vibethink/utils';

export function BookingCard({ booking, context }: BookingCardProps) {
  const { locale } = useTranslation();
  const finalContext = context || useAutoDetectContext();
  
  // Determinar qué mostrar según contexto
  const dateTimeDisplay = useMemo(() => {
    if (finalContext === 'hotel') {
      // Hotel: Solo fechas (check-in/check-out)
      return formatDateRange(
        booking.startDate,
        booking.endDate,
        locale,
        { includeTime: false }
      );
    } else if (finalContext === 'studio') {
      // Studio: Solo horas (start time/end time)
      return formatTimeRange(
        booking.startDate,
        booking.endDate,
        locale,
        { includeDate: false }
      );
    } else {
      // Cowork: Fecha + hora
      return formatDateRange(
        booking.startDate,
        booking.endDate,
        locale,
        { includeTime: true }
      );
    }
  }, [booking, finalContext, locale]);
  
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span>{dateTimeDisplay}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📋 Reglas de Coherencia

### Regla 1: Siempre Date Objects
✅ **CORRECTO:**
```typescript
checkIn: Date;
checkOut: Date;
startTime: Date;
endTime: Date;
```

❌ **INCORRECTO:**
```typescript
checkIn: string; // "June 19, 2028"
checkOut: string; // "June 22, 2028"
```

### Regla 2: Usar Sistema Regional
✅ **CORRECTO:**
```typescript
import { formatDate, formatDateRange, formatTimeRange } from '@vibethink/utils';
formatDateRange(start, end, locale, { includeTime: false });
```

❌ **INCORRECTO:**
```typescript
dateObj.toLocaleDateString(locale, {...});
new Date().toISOString().split("T")[0];
```

### Regla 3: Sensibilidad al Contexto
✅ **CORRECTO:**
```typescript
// Hotel: Solo fechas
if (context === 'hotel') {
  formatDateRange(start, end, locale, { includeTime: false });
}
// Studio: Solo horas
else if (context === 'studio') {
  formatTimeRange(start, end, locale, { includeDate: false });
}
```

❌ **INCORRECTO:**
```typescript
// Mismo formato para todos
formatDate(start) - formatDate(end);
```

### Regla 4: Respetar Timezone
✅ **CORRECTO:**
```typescript
formatDateRange(start, end, locale, {
  config: getRegionalConfig(), // Incluye timezone
});
```

❌ **INCORRECTO:**
```typescript
// Sin timezone
new Date().toLocaleDateString();
```

---

## 🎯 Checklist de Implementación

### Fase 1: Crear Funciones Base
- [ ] Agregar `formatDateRange()` a `packages/utils/src/formatters-enhanced.ts`
- [ ] Agregar `formatTimeRange()` a `packages/utils/src/formatters-enhanced.ts`
- [ ] Tests unitarios para ambas funciones
- [ ] Documentación con ejemplos

### Fase 2: Actualizar booking-list.tsx
- [ ] Cambiar `checkIn: string` → `checkIn: Date`
- [ ] Cambiar `checkOut: string` → `checkOut: Date`
- [ ] Actualizar datos mock a Date objects
- [ ] Usar `formatDateRange()` en cell renderer
- [ ] Validar que respeta locale

### Fase 3: Actualizar booking-card.tsx
- [ ] Reemplazar `formatDate()` local por `formatDateRange()` de utils
- [ ] Agregar lógica de contexto (hotel vs studio)
- [ ] Usar `formatTimeRange()` para studio
- [ ] Validar que funciona en todos los contextos

### Fase 4: Validación
- [ ] Probar en hotel (solo fechas)
- [ ] Probar en studio (solo horas)
- [ ] Probar en cowork (fecha + hora)
- [ ] Validar timezone
- [ ] Validar locale (en, es)

---

## 📊 Ejemplos de Salida Esperada

### Hotel (en-US)
```
Input:  startDate = 2028-06-19, endDate = 2028-06-22
Output: "June 19 - June 22, 2028"
```

### Hotel (es-ES)
```
Input:  startDate = 2028-06-19, endDate = 2028-06-22
Output: "19-22 de junio de 2028"
```

### Studio (en-US, 12h)
```
Input:  startTime = 2028-06-19T10:00, endTime = 2028-06-19T14:00
Output: "10:00 AM - 2:00 PM"
```

### Studio (es-ES, 24h)
```
Input:  startTime = 2028-06-19T10:00, endTime = 2028-06-19T14:00
Output: "10:00 - 14:00"
```

### Cowork (en-US)
```
Input:  start = 2028-06-19T10:00, end = 2028-06-19T14:00
Output: "Jun 19, 10:00 AM - 2:00 PM"
```

---

## 🚨 Prioridad

**P0 - CRÍTICO:**
- Fechas hardcoded rompen i18n
- No respeta timezone
- No diferencia contexto (hotel vs studio)

**Acción inmediata:** Implementar Fase 1 y Fase 2 antes de continuar con más módulos.

---

## 📝 Notas

- **Intl.DateTimeFormat.formatRange()** está disponible en navegadores modernos (Chrome 76+, Firefox 68+)
- Para compatibilidad con navegadores antiguos, usar polyfill o date-fns
- Considerar usar `date-fns` o `luxon` para cálculos complejos de fechas (duración, diferencia, etc.)

---

---

# Addendum: ViTo — DateTime & Booking Logic Standard

**STATUS:** 🚨 **OBLIGATORIO** (previene bugs críticos de Timezone)  
**CONTEXT:** Booking Multi-dominio (Hotel vs Studio)  
**VERSIÓN:** 1.1.0

> **⚠️ CRÍTICO:** Esta es una **corrección quirúrgica y absolutamente necesaria**.  
> Si no haces esa distinción (`CivilDate` vs `Instant`) ahora, en 3 meses estarás debuggeando por qué un cliente en Japón ve que su check-in en Cancún es "el día anterior" o "el día siguiente".

## A. Principios Fundamentales

### 1. La Tiranía del Venue (con Excepción UX Explícita)
La `venueTimezone` es la **fuente única de verdad** para operaciones y render SSR/HTML estable.

- Si el hotel está en Cancún, el check-in se muestra en hora Cancún, aunque el usuario esté en Tokio.
- **Prohibido** convertir fechas de hotel a la zona horaria del navegador del usuario.

**Excepción UX Permitida:**
- UI puede mostrar un **toggle "Tu hora local"** *solo* como dato secundario.
- **Regla de hidratación:** ese "local time" debe renderizarse **ClientOnly** (`useEffect`) o en un componente aislado para evitar mismatch.
- ➡️ Esto evita que a futuro te pidan "por favor muéstrame también mi hora" y rompan la ley.

### 2. Dualidad de Tipos

**Hotels/Living (Nights):** Usan **CivilDate** (`YYYY-MM-DD`). Son fechas de calendario, no instantes.

**Studios/Cowork (Slots):** Usan **InstantISO** (`ISO 8601` con offset). Son puntos físicos en el tiempo.

**Razón:** El concepto de **"Date-Only"** (Fecha Civil) es vital para hotelería. Una noche de hotel es una abstracción de calendario, no un punto en la línea de tiempo física. Un estudio de grabación sí es un punto físico.

---

## B. Tipos Canónicos

**Ubicación:** `packages/utils/src/datetime/types.ts`

```typescript
// Calendar date only. NO time, NO timezone info attached to the string.
// Example: "2025-12-25"
export type CivilDate = string; 

// Point in time. MUST include offset or Z.
// Example: "2025-12-25T14:30:00-05:00"
export type InstantISO = string;

// The logic driver
export type BookingContext = 'hotel' | 'studio' | 'cowork' | 'coliving';
export type BookingUnit = 'night' | 'hour' | 'day';

// Discriminated Union (no optional pairs sueltas)
// Esto mata bugs antes de nacer y simplifica Zod/TS
export type BookingWindow =
  | {
      context: 'hotel' | 'coliving' | 'airbnb';
      unit: 'night';
      venueTimezone: string; // IANA: 'America/Bogota'
      checkInDate: CivilDate;
      checkOutDate: CivilDate;
    }
  | {
      context: 'studio';
      unit: 'hour';
      venueTimezone: string;
      startAt: InstantISO;
      endAt: InstantISO;
    }
  | {
      context: 'cowork';
      unit: 'hour' | 'day';
      venueTimezone: string;
      startAt: InstantISO;
      endAt: InstantISO;
    };
```

---

## C. Reglas de Implementación (Formatters)

**Ubicación:** `packages/utils/src/datetime/format.ts`

### 1. Unified Formatter (Entrypoint)

La UI **nunca** debe invocar `Intl` directamente. Debe usar:

```typescript
export function formatBookingRange(
  window: BookingWindow, 
  locale: string, 
  options?: { short?: boolean; includeDuration?: boolean }
): string {
  // 1. Hotel Logic (Civil Date)
  if (window.unit === 'night' && 'checkInDate' in window) {
    // Calcular duración por calendario (NO con Date parseado local)
    const nights = diffCivilDates(window.checkInDate, window.checkOutDate);
    const range = formatCivilRange(window.checkInDate, window.checkOutDate, locale);
    
    // Incluir duration tokens si se solicita
    if (options?.includeDuration) {
      // Usar ICU para pluralización: "{count, plural, one {1 night} other {# nights}}"
      const durationLabel = formatMessage(locale, '{count, plural, one {1 night} other {# nights}}', { count: nights });
      return `${range} (${durationLabel})`;
    }
    
    return range;
  }

  // 2. Studio/Cowork Logic (Instant)
  if (window.unit === 'hour' && 'startAt' in window) {
    // Renderiza "Dec 25, 10:00 – 14:00"
    // IMPORTANTE: Fuerza el timeZone del venue en el Intl.DateTimeFormat
    const range = formatInstantRange(window.startAt, window.endAt, window.venueTimezone, locale);
    
    // Calcular duración por instantes (endAt - startAt)
    if (options?.includeDuration) {
      const durationHours = diffInstants(window.startAt, window.endAt);
      const durationLabel = formatMessage(locale, '{count, plural, one {1 hour} other {# hours}}', { count: durationHours });
      return `${range} (${durationLabel})`;
    }
    
    return range;
  }

  throw new Error('Invalid booking window for formatting');
}
```

### 2. Hydration Safety (Server vs Client)

Para evitar errores de hidratación (Server rendering in UTC vs Client rendering in Local):

- **Server:** Renderiza usando `venueTimezone`.
- **Client:** Renderiza usando `venueTimezone`.
- **Resultado:** HTML estable.

**Regla de Hidratación para "Tu hora local":**
- Si se necesita mostrar "Tu hora local", debe hacerse en un componente `ClientOnly` (no SSR).
- Usar `useEffect` o componente aislado para evitar mismatch.
- Nunca en el render inicial (SSR).

---

## D. Preparación para DB & AI (Schema)

Aunque no haya BD hoy, el código debe asumir este esquema mental para evitar refactors:

### 1. AI Agents

- Al prompt del Agente se le pasa: `context: "hotel"`, `today: "2025-10-10" (CivilDate)`.
- Si el usuario pregunta "¿A qué hora entro?", el agente busca `policies.checkInTime` pero responde relativo a la fecha civil.
- Si es Studio, el agente recibe `now: "2025-10-10T10:00:00-05:00"` y calcula disponibilidad exacta.

### 2. Validación Zod

```typescript
const BookingSchema = z.object({
  venueTimezone: z.string(),
  // Discriminated Union implícita
  ...
}).refine(data => {
   if (data.unit === 'night') return isCivilDate(data.checkInDate);
   if (data.unit === 'hour') return isISO(data.startAt);
   return false;
}, "Invalid date type for unit");
```

---

## E. CivilDate Parsing (Safe Noon Trick)

**Ubicación:** `packages/utils/src/datetime/civil.ts`

### Prohibición Crítica

❌ **PROHIBIDO:** `new Date("YYYY-MM-DD")`

**Razón:** `new Date("2025-01-01")` se interpreta como UTC medianoche, y al convertirlo a timezone local puede desplazar el día.

### Método Correcto

```typescript
/**
 * Parsea CivilDate a partes (año, mes, día)
 */
export function civilDateToParts(d: CivilDate): { year: number; month: number; day: number } {
  const [year, month, day] = d.split('-').map(Number);
  return { year, month, day };
}

/**
 * Formatea CivilDate usando Intl con Safe Noon Trick
 * 
 * Usa 12:00 UTC como "safe noon" para evitar saltos por DST.
 * Esto es estándar para fechas civiles (date-only).
 */
export function formatCivilDate(
  civilDate: CivilDate,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const { year, month, day } = civilDateToParts(civilDate);
  
  // Safe Noon Trick: 12:00 UTC evita DST edge cases
  const safeDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // Siempre UTC para fechas civiles
    ...options,
  });
  
  return formatter.format(safeDate);
}

/**
 * Calcula diferencia entre fechas civiles (por calendario, NO con Date)
 */
export function diffCivilDates(start: CivilDate, end: CivilDate): number {
  const startParts = civilDateToParts(start);
  const endParts = civilDateToParts(end);
  
  const startDate = new Date(Date.UTC(startParts.year, startParts.month - 1, startParts.day));
  const endDate = new Date(Date.UTC(endParts.year, endParts.month - 1, endParts.day));
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calcula diferencia entre instantes (en horas)
 */
export function diffInstants(start: InstantISO, end: InstantISO): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  return diffHours;
}
```

---

## F. Checklist para Cursor (Actualizado con 4 Ajustes)

1. ✅ Crea `packages/utils/src/datetime` con:
   - `types.ts` - Tipos canónicos (`CivilDate`, `InstantISO`, `BookingWindow` discriminated union)
   - `format.ts` - `formatBookingRange()` con duration tokens
   - `civil.ts` - `civilDateToParts()`, `formatCivilDate()`, `diffCivilDates()`, `diffInstants()`

2. ✅ Implementa `formatBookingRange` manejando la lógica dual (Night vs Hour) con duration tokens:
   - Hotel: `diffCivilDates()` para calcular noches (por calendario, NO con Date)
   - Studio: `diffInstants()` para calcular horas (por instantes)

3. ✅ Asegura que `Intl.DateTimeFormat` siempre reciba `timeZone: venueTimezone` explícito para Instants.

4. ✅ Para fechas civiles (`YYYY-MM-DD`):
   - **PROHIBIDO** `new Date("YYYY-MM-DD")`
   - Implementar `civilDateToParts()` para parse manual
   - Para formatear: construir Date con `Date.UTC(year, month-1, day, 12)` (safe noon trick)
   - Usar `timeZone: 'UTC'` en `Intl.DateTimeFormat` para estabilidad

5. ✅ Prohíbe el uso directo de `new Date()`, `toLocaleDateString()`, `toLocaleTimeString()` en componentes de UI para renderizar texto.

6. ✅ Implementa excepción UX para "Tu hora local":
   - Solo en componente `ClientOnly` (no SSR)
   - Usar `useEffect` o componente aislado
   - Nunca en render inicial

7. ✅ Tests obligatorios:
   - Hotel range es-ES / en-US
   - Studio range 12h/24h
   - Timezone stability (snapshot igual SSR vs Client)
   - Validación union (unit='night' no acepta startAt)
   - Safe noon trick (mismo día en diferentes timezones)

---

## G. Ejemplos de Uso Correcto

### Hotel (CivilDate)
```typescript
const hotelBooking: BookingWindow = {
  context: 'hotel',
  unit: 'night',
  venueTimezone: 'America/Cancun',
  checkInDate: '2025-12-25',  // CivilDate
  checkOutDate: '2025-12-27', // CivilDate
};

// Output: "Dec 25 – 27, 2025 (2 nights)"
formatBookingRange(hotelBooking, 'en-US');
```

### Studio (InstantISO)
```typescript
const studioBooking: BookingWindow = {
  context: 'studio',
  unit: 'hour',
  venueTimezone: 'America/Bogota',
  startAt: '2025-12-25T10:00:00-05:00', // InstantISO
  endAt: '2025-12-25T14:00:00-05:00',   // InstantISO
};

// Output: "Dec 25, 10:00 – 14:00" (hora de Bogotá)
formatBookingRange(studioBooking, 'en-US');
```

---

## H. Errores Comunes a Evitar

### ❌ Error 1: Usar Date objects para fechas civiles
```typescript
// ❌ INCORRECTO
const checkIn = new Date('2025-12-25'); // Se convierte a UTC, puede desplazar el día
```

```typescript
// ✅ CORRECTO
const checkIn: CivilDate = '2025-12-25'; // String, sin timezone
```

### ❌ Error 2: Convertir fechas de hotel a timezone del usuario
```typescript
// ❌ INCORRECTO
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
formatDate(checkIn, userTimezone); // Bug: check-in cambia según usuario
```

```typescript
// ✅ CORRECTO
formatCivilRange(checkIn, checkOut, locale); // Usa venueTimezone internamente
```

### ❌ Error 3: No especificar timezone en Instants
```typescript
// ❌ INCORRECTO
new Date('2025-12-25T10:00:00').toLocaleString(); // Usa timezone del navegador
```

```typescript
// ✅ CORRECTO
formatInstantRange(startAt, endAt, venueTimezone, locale); // Fuerza venueTimezone
```

---

---

## I. Resumen de Ajustes Production-Grade

### Ajuste 1: Excepción UX para "Tu hora local"
✅ **Implementado:** Regla explícita para `ClientOnly` components con `useEffect`.

### Ajuste 2: BookingWindow como Discriminated Union
✅ **Implementado:** Tipo union discriminado que mata bugs antes de nacer.

### Ajuste 3: CivilDate Parsing con Safe Noon Trick
✅ **Implementado:** `civilDateToParts()` + `Date.UTC(year, month-1, day, 12)` + `timeZone: 'UTC'`.

### Ajuste 4: Duration Tokens sin Date
✅ **Implementado:** `diffCivilDates()` (calendario) y `diffInstants()` (instantes) en `formatBookingRange()`.

---

**Última actualización:** 2025-12-21  
**Autor:** AI Assistant (Cursor) + Addendum Oficial ViTo + Ajustes Production-Grade  
**Revisado por:** Pendiente  
**Versión:** 1.2.0 (con 4 Ajustes Production-Grade)

---

## J. Integración con Documento Maestro I18N_TERMINOLOGY_AI_FIRST.md

Este estándar de DateTime & Booking Logic debe integrarse al mismo nivel de **"IMPERATIVO"** que el documento maestro de i18n/l10n + Terminology.

**Recomendación:** Anexar como "LAW: DateTime Standard" al documento maestro junto a la ley de terminology/i18n, con el mismo nivel de "imperativo + lint gates".

**Ubicación sugerida:** Sección adicional en `I18N_TERMINOLOGY_AI_FIRST.md` o referencia cruzada explícita.

> **✅ Veredicto Final:** Sí, es correcto y necesario, y sí: **es la mejor decisión arquitectónica antes de BD**.  
> Con los 4 ajustes arriba, queda listo para crecer a CRM/Ops y para AI-first sin "timezone wars".

