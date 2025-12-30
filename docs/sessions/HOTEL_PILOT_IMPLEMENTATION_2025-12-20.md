# Implementación Piloto - Módulo Hotel (Conejillo de Indias)

**Fecha:** 2025-12-20  
**Estado:** 🟡 **EN PROGRESO** - Aplicando todos los conceptos acordados  
**Objetivo:** Validar arquitectura i18n/l10n completa usando Hotel como piloto

---

## 🎯 Objetivo

Aplicar **TODOS** los conceptos acordados al módulo Hotel:
- ✅ ICU Message Format (pluralización/selección)
- ✅ Money model con minor units
- ✅ Context-aware translations (ya tiene hotel.booking.*)
- ✅ Validación sistemática por componente
- ✅ Formateo avanzado (compact, lists, ranges)
- ✅ Sin romper bundui monorepo

---

## 📊 Estado Actual del Módulo Hotel

### Componentes Identificados

1. **Stat Cards** (`stat-cards.tsx`)
   - ✅ Ya usa `useTranslation()`
   - ⚠️ Usa `{{param}}` (legacy)
   - ⚠️ Formateo de números básico

2. **Booking List** (`booking-list.tsx`)
   - ✅ Ya usa `useTranslation()`
   - ⚠️ Mock data con strings hardcoded
   - ⚠️ Formateo de fechas básico

3. **Bookings Card** (`bookings-card.tsx`)
   - ✅ Ya usa `useTranslation()`
   - ⚠️ Usa `{{param}}` (legacy)

4. **Campaign Overview** (`campaign-overview.tsx`)
   - ✅ Ya usa `useTranslation()`
   - ⚠️ Usa `{{param}}` (legacy)

5. **Reservations Card** (`reservations-card.tsx`)
   - ✅ Ya usa `useTranslation()`
   - ⚠️ Usa `{{param}}` (legacy)

6. **Revenue Stat** (`revenue-stat.tsx`)
   - ✅ Ya usa `useTranslation()`
   - ⚠️ Formateo de moneda con `formatCurrencyRegional()`
   - ⚠️ Usa `{{param}}` (legacy)

### Traducciones Actuales

**Namespace:** `hotel`
- ✅ Estructura por componente (`components.*`)
- ⚠️ Usa `{{param}}` (legacy)
- ⚠️ No usa ICU Message Format

---

## 📋 Plan de Implementación

### FASE 1: Preparación (30 min)

#### 1.1 Instalar Dependencias

```bash
npm install intl-messageformat --workspace=packages/utils
```

#### 1.2 Crear Estructura Base

- [ ] Crear `packages/utils/src/i18n/message-formatter.ts`
- [ ] Crear `packages/utils/src/money/types.ts`
- [ ] Crear `packages/utils/src/money/formatters.ts`
- [ ] Crear `packages/utils/src/money/compat.ts` (wrapper)

---

### FASE 2: Migrar Hotel a ICU Message Format (2-3 horas)

#### 2.1 Migrar Traducciones

**Archivo:** `apps/dashboard/src/lib/i18n/translations/en/hotel.json`

**Antes (legacy):**
```json
{
  "formatters": {
    "roomNumber": "Room {{number}}",
    "nightsPlural": "{{count}} nights"
  }
}
```

**Después (ICU):**
```json
{
  "formatters": {
    "roomNumber": "Room {number}",
    "nightsPlural": "{count, plural, one {1 night} other {# nights}}"
  }
}
```

**Tareas:**
- [ ] Migrar `hotel.json` (EN) a ICU
- [ ] Migrar `hotel.json` (ES) a ICU
- [ ] Validar sintaxis ICU

#### 2.2 Actualizar Componentes

**Componentes a actualizar:**
- [ ] `stat-cards.tsx` - Usar ICU en lugar de `{{param}}`
- [ ] `booking-list.tsx` - Migrar formateo a ICU
- [ ] `bookings-card.tsx` - Migrar a ICU
- [ ] `campaign-overview.tsx` - Migrar a ICU
- [ ] `reservations-card.tsx` - Migrar a ICU
- [ ] `revenue-stat.tsx` - Migrar a ICU

---

### FASE 3: Implementar Money Model (1-2 horas)

#### 3.1 Identificar Uso de Monedas

**Componentes con monedas:**
- `revenue-stat.tsx` - `formatCurrency(total)`
- `reservations-card.tsx` - Posible uso de monedas
- Otros componentes con precios

#### 3.2 Migrar a Money Model

**Antes:**
```typescript
const total = 12480; // número decimal
formatCurrencyRegional(total, 'USD');
```

**Después:**
```typescript
import { createMoney, formatMoney } from '@/utils/money/formatters';

const total = createMoney(12480, 'USD'); // Money object
formatMoney(total, locale);
```

**Tareas:**
- [ ] Identificar todos los usos de monedas
- [ ] Migrar a Money model
- [ ] Validar formateo correcto

---

### FASE 4: Formateo Avanzado (1 hora)

#### 4.1 Aplicar Formateo Compacto

**Componentes que pueden beneficiarse:**
- `revenue-stat.tsx` - Números grandes (1.5M, 2.3K)
- `stat-cards.tsx` - Números grandes

#### 4.2 Aplicar Formateo de Rangos

**Componentes:**
- `booking-list.tsx` - Rangos de fechas (check-in/check-out)

**Tareas:**
- [ ] Aplicar `formatCompact()` donde sea útil
- [ ] Aplicar `formatDateRange()` para fechas
- [ ] Validar visualmente

---

### FASE 5: Validación y Testing (1 hora)

#### 5.1 Validar ICU Syntax

```bash
npm run validate:i18n:syntax
```

#### 5.2 Validar Completitud

```bash
npm run validate:i18n:completeness
```

#### 5.3 Testing Manual

- [ ] Probar en inglés (EN)
- [ ] Probar en español (ES)
- [ ] Verificar que no hay strings visibles
- [ ] Verificar formateo de monedas
- [ ] Verificar formateo de fechas

#### 5.4 Validar Bundui Monorepo

- [ ] Verificar que bundui monorepo sigue funcionando
- [ ] Verificar que no hay breaking changes
- [ ] Validar imports y exports

---

## 🔄 Checklist de Implementación

### Pre-Implementación
- [ ] Backup del estado actual
- [ ] Crear branch: `feat/hotel-pilot-icu-money`
- [ ] Instalar dependencias

### Implementación
- [ ] Fase 1: Preparación (estructura base)
- [ ] Fase 2: Migrar Hotel a ICU
- [ ] Fase 3: Implementar Money model
- [ ] Fase 4: Formateo avanzado
- [ ] Fase 5: Validación y testing

### Post-Implementación
- [ ] Documentar cambios
- [ ] Actualizar protocolos con lecciones aprendidas
- [ ] Commit y push
- [ ] Validar que bundui monorepo funciona

---

## 📝 Lecciones Aprendidas (Actualizar)

Al completar esta implementación, documentar:

1. **Problemas encontrados:**
   - [ ] Lista de problemas
   - [ ] Soluciones aplicadas

2. **Mejoras al protocolo:**
   - [ ] Nuevas reglas identificadas
   - [ ] Checklist actualizado

3. **Validación de arquitectura:**
   - [ ] ¿ICU funciona bien?
   - [ ] ¿Money model es útil?
   - [ ] ¿Formateo avanzado es necesario?

---

## 🚨 Reglas Críticas

### ✅ SÍ HACER
- Migrar gradualmente componente por componente
- Validar después de cada componente
- Documentar problemas encontrados
- Mantener compatibilidad con bundui monorepo

### ❌ NO HACER
- Migrar todo de golpe
- Romper funcionalidad existente
- Tocar otros módulos
- Cambiar estructura de bundui monorepo

---

## 📊 Métricas de Éxito

### Técnicas
- [ ] 100% componentes migrados a ICU
- [ ] 100% monedas usando Money model
- [ ] 0 errores de sintaxis ICU
- [ ] 0 strings visibles en UI
- [ ] Tests pasan

### Funcionales
- [ ] Hotel funciona en EN/ES
- [ ] Formateo de monedas correcto
- [ ] Formateo de fechas correcto
- [ ] Pluralización funciona
- [ ] Bundui monorepo funciona

---

**Última actualización:** 2025-12-20  
**Estado:** Listo para ejecutar

---

**Este es el plan piloto. Ejecutar fase por fase, validando cada paso.**











