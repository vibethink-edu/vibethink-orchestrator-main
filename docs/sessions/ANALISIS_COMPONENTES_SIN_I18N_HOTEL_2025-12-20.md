# Análisis: Componentes Sin i18n en Módulo Hotel

**Fecha:** 2025-12-20  
**Módulo:** Hotel  
**Problema:** Componentes siguen en inglés al cambiar idioma a español

---

## 🔍 Análisis del Problema

### Síntoma Reportado

Al cambiar el idioma a español, algunos componentes siguen mostrando texto en inglés:
- "Online Booking"
- "Bookings"
- "Total Bookings"
- "Offline Booking"
- "Unlock in-depth analysis with a premium subscription"

### Causa Raíz Identificada

**Componentes que NO usan `useTranslation()` y tienen strings hardcoded.**

---

## 📊 Inventario de Componentes

### ✅ Componentes CON i18n (Funcionan Correctamente)

1. **`booking-list.tsx`**
   - ✅ Usa `useTranslation('hotel')`
   - ✅ Todos los strings usan `t('key')`
   - ✅ Cambian correctamente al cambiar idioma

2. **`stat-cards.tsx`**
   - ✅ Usa `useTranslation('hotel')`
   - ✅ Todos los strings usan `t('key')`
   - ✅ Cambian correctamente al cambiar idioma

### ❌ Componentes SIN i18n (NO Cambian)

1. **`bookings-card.tsx`** ⚠️ **PRINCIPAL PROBLEMA**
   - ❌ NO usa `useTranslation()`
   - ❌ Strings hardcoded directamente en JSX
   - ❌ Strings que NO cambian:
     - `"Bookings"` (línea 50)
     - `"Total Bookings"` (línea 71)
     - `"Online Booking"` (línea 89) ⭐ **REPORTADO POR USUARIO**
     - `"Offline Booking"` (línea 93)
     - `"Unlock in-depth analysis with a premium subscription"` (línea 103)
   - ❌ NO hay claves en `hotel.json` para estos strings

2. **`campaign-overview.tsx`**
   - ❌ NO usa `useTranslation()`
   - ⚠️ Probablemente tiene strings hardcoded

3. **`recent-activities.tsx`**
   - ❌ NO usa `useTranslation()`
   - ⚠️ Probablemente tiene strings hardcoded

4. **`reservations-card.tsx`**
   - ❌ NO usa `useTranslation()`
   - ⚠️ Probablemente tiene strings hardcoded

5. **`revenue-stat.tsx`**
   - ❌ NO usa `useTranslation()`
   - ⚠️ Probablemente tiene strings hardcoded

---

## 🔍 Análisis Detallado: `bookings-card.tsx`

### Código Actual (INCORRECTO)

```tsx
export function BookingsCard() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  
  // ❌ NO hay: const { t } = useTranslation('hotel');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>  {/* ❌ Hardcoded */}
        {/* ... */}
      </CardHeader>
      <CardContent>
        <span>Total Bookings</span>  {/* ❌ Hardcoded */}
        {/* ... */}
        <p>Online Booking</p>  {/* ❌ Hardcoded - NO cambia */}
        <p>Offline Booking</p>  {/* ❌ Hardcoded - NO cambia */}
        {/* ... */}
        <span>Unlock in-depth analysis with a premium subscription</span>  {/* ❌ Hardcoded */}
      </CardContent>
    </Card>
  );
}
```

### ¿Por qué NO cambian?

1. **NO hay import de i18n:**
   ```tsx
   // ❌ FALTANTE
   import { useTranslation } from "@/lib/i18n";
   ```

2. **NO hay hook de traducción:**
   ```tsx
   // ❌ FALTANTE
   const { t } = useTranslation('hotel');
   ```

3. **Strings hardcoded directamente:**
   ```tsx
   // ❌ Hardcoded - NO puede cambiar
   <CardTitle>Bookings</CardTitle>
   <p>Online Booking</p>
   ```

4. **NO hay claves en JSON:**
   - Las claves necesarias NO existen en `hotel.json`
   - Ejemplo: `components.bookingsCard.title`, `components.bookingsCard.onlineBooking`, etc.

---

## ✅ Solución Requerida

### Paso 1: Añadir i18n al componente

```tsx
import { useTranslation } from "@/lib/i18n";

export function BookingsCard() {
  const { t } = useTranslation('hotel');  // ✅ Añadir
  // ...
}
```

### Paso 2: Reemplazar strings hardcoded

```tsx
// ❌ ANTES
<CardTitle>Bookings</CardTitle>
<p>Online Booking</p>
<span>Total Bookings</span>
<span>Unlock in-depth analysis with a premium subscription</span>

// ✅ DESPUÉS
<CardTitle>{t('components.bookingsCard.title')}</CardTitle>
<p>{t('components.bookingsCard.onlineBooking')}</p>
<span>{t('components.bookingsCard.totalBookings')}</span>
<span>{t('components.bookingsCard.premiumMessage')}</span>
```

### Paso 3: Agregar claves al JSON

**`hotel.json` (EN):**
```json
{
  "hotel": {
    "components": {
      "bookingsCard": {
        "title": "Bookings",
        "totalBookings": "Total Bookings",
        "onlineBooking": "Online Booking",
        "offlineBooking": "Offline Booking",
        "premiumMessage": "Unlock in-depth analysis with a premium subscription"
      }
    }
  }
}
```

**`hotel.json` (ES):**
```json
{
  "hotel": {
    "components": {
      "bookingsCard": {
        "title": "Reservas",
        "totalBookings": "Total de Reservas",
        "onlineBooking": "Reserva Online",
        "offlineBooking": "Reserva Offline",
        "premiumMessage": "Desbloquea análisis detallados con una suscripción premium"
      }
    }
  }
}
```

---

## 📋 Componentes Pendientes de Adaptar

### Prioridad Alta

1. ✅ **`bookings-card.tsx`** - Componente reportado por usuario
   - 5 strings hardcoded
   - Visible en página principal

### Prioridad Media

2. ⏳ **`campaign-overview.tsx`**
3. ⏳ **`recent-activities.tsx`**
4. ⏳ **`reservations-card.tsx`**
5. ⏳ **`revenue-stat.tsx`**

### Subpáginas

6. ⏳ **`bookings/page.tsx`** - Metadata hardcoded
7. ⏳ **`bookings/components/meeting-room-schedule.tsx`** - Strings hardcoded

---

## 🎯 Lecciones Aprendidas

### Problema Detectado

**NO todos los componentes del módulo fueron adaptados a i18n durante la migración inicial.**

Solo se adaptaron:
- `booking-list.tsx`
- `stat-cards.tsx`

Pero se olvidaron:
- `bookings-card.tsx` ⭐ (componente visible en página principal)
- Otros 5+ componentes

### Regla Crítica

**TODOS los componentes con texto visible DEBEN usar `useTranslation()`.**

**NO dejar componentes "para después" - hacerlo durante la importación.**

---

## ✅ Checklist de Validación

Para prevenir este problema en futuras migraciones:

- [ ] Listar TODOS los archivos `.tsx` del módulo
- [ ] Verificar que CADA componente con texto usa `useTranslation()`
- [ ] Probar en ambos idiomas (EN/ES) y verificar que TODO cambia
- [ ] Si algún texto sigue en inglés, adaptar el componente INMEDIATAMENTE

---

**Última actualización:** 2025-12-20  
**Estado:** Problema identificado, solución documentada

