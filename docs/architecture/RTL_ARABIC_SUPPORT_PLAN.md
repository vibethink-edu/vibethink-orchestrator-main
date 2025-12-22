# Plan de Soporte RTL (Right-to-Left) y Árabe

**Fecha:** 2025-12-20  
**Estado:** 🟡 **HÍBRIDO** - Preparación ahora, implementación Fase 2  
**Prioridad:** P0.5 - Preparación básica (auditoría) | P1 - Implementación completa  
**Duración estimada:** 
- Preparación: 2-3 días (AHORA)
- Implementación completa: 10-12 días (Fase 2)

---

## 🎯 Decisión Estratégica

**Opción seleccionada:** ✅ **OPCIÓN HÍBRIDA - Preparación ahora, implementación Fase 2**

**Razones:**
1. ✅ Auditoría y preparación básica no bloquea ICU/Money
2. ✅ Identificar problemas temprano es prudente
3. ✅ Saber el scope exacto ayuda a planificar mejor
4. ✅ Implementación completa puede esperar a confirmación
5. ✅ Estar "listos" para cuando se necesite es estratégico

**Timeline Híbrido:**
- **AHORA (2-3 días):** Auditoría RTL + Preparación básica ✅
- **Semana 1-2:** ICU migration + Money (como planeado) ✅
- **Semana 3-4:** RTL implementación completa cuando cliente Dubai confirme ⏳

---

## 📊 Validación: ¿El Sistema Actual Está Listo para RTL?

### ❌ Problemas Críticos Identificados

**1. RegionalConfigManager NO tiene dirección de texto**
```typescript
// FALTA ESTO:
interface RegionalConfiguration {
  locale: string;
  direction: 'ltr' | 'rtl';  // ❌ FALTA
  numberingSystem?: 'arab' | 'latn';  // ❌ FALTA
  calendar?: 'gregory' | 'islamic';  // ❌ FALTA
  // ...
}
```

**2. CSS no tiene soporte RTL**
```css
/* Tailwind actual tiene: */
.ml-4 { margin-left: 1rem; }

/* Para RTL necesita: */
.ms-4 { margin-inline-start: 1rem; } /* auto-invierte */
```

**3. Componentes asumen LTR**
```tsx
// ❌ MAL para RTL:
<div className="flex">
  <Icon /> {/* Izquierda */}
  <Text /> {/* Derecha */}
</div>

// ✅ BIEN para RTL:
<div className="flex" dir="auto">
  <Icon /> {/* Se auto-invierte */}
  <Text />
</div>
```

**4. Números en árabe pueden ser problemáticos**
```typescript
// Árabe: ١٢٣٤٥ (Eastern Arabic numerals)
// vs
// 12345 (Western Arabic numerals)
```

---

## 📋 Checklist Completo RTL/Árabe

### Nivel 1: Encoding y Locale ✅ (Probablemente OK)

```typescript
// ✅ UTF-8 soporta árabe
// ✅ Intl API soporta 'ar', 'ar-AE', 'ar-SA'
// ✅ Next.js 15 soporta RTL
```

### Nivel 2: Layout y Dirección ⚠️ (REQUIERE TRABAJO)

| Feature | Estado Actual | Acción Requerida |
|---------|---------------|------------------|
| `dir` attribute | ❌ Falta | Agregar a `<html>` |
| Logical properties | ❌ Falta | Migrar CSS |
| Flexbox direction | ⚠️ Parcial | Auditar componentes |
| Grid direction | ⚠️ Parcial | Auditar layouts |
| Icons mirroring | ❌ Falta | Configurar |

### Nivel 3: Componentes y UI ❌ (CRÍTICO)

| Componente | Riesgo RTL | Acción |
|------------|-----------|---------|
| Sidebar/Navigation | 🔴 Alto | Espejear |
| Forms | 🟡 Medio | Alineación |
| Modals/Dialogs | 🟡 Medio | Posicionamiento |
| Tooltips | 🟡 Medio | Dirección |
| Carousels | 🔴 Alto | Invertir |
| Charts/Graphs | 🟡 Medio | Ejes |

### Nivel 4: Contenido Bidireccional ⚠️ (COMPLEJO)

```html
<!-- Árabe con números/inglés mezclado -->
<p dir="rtl">
  السعر: $99.99 <!-- Número queda LTR dentro de RTL -->
  للحجز رقم #12345 <!-- ID queda LTR -->
</p>
```

### Nivel 5: Formatos Culturales 🟡 (MEDIO)

| Aspecto | Árabe/Dubai | Implementación |
|---------|-------------|----------------|
| Calendario | Gregoriano + Islámico | Intl soporta ambos |
| Números | Eastern vs Western | Configurable |
| Moneda | AED (Dirham) | ✅ Ya en CURRENCY_CONFIG (agregar) |
| Día inicio semana | Sábado (Gulf) | ✅ Ya tienes firstDayOfWeek |

---

## 🗂️ Fases de Implementación RTL

### FASE RTL-0: Auditoría RTL (1 día)

**Objetivo:** Entender scope completo del trabajo

**Entregables:**
- [ ] Script de auditoría RTL (`scripts/audit-rtl-readiness.ts`)
- [ ] Reporte de componentes que necesitan RTL
- [ ] Lista de CSS a migrar a logical properties
- [ ] Identificación de iconos que necesitan espejado

**Scripts a crear:**
- `scripts/audit-rtl-readiness.ts`

**Documentación:**
- `docs/architecture/RTL_AUDIT_REPORT.md`

---

### FASE RTL-1: Configuración Base (2 días)

**Objetivo:** Sentar bases técnicas para RTL

**Entregables:**
- [ ] Actualizar `RegionalConfigManager` con `direction`, `numberingSystem`, `calendar`
- [ ] Actualizar root layout con `dir` attribute dinámico
- [ ] Configurar Tailwind para RTL (plugin o manual)
- [ ] Crear utilidades RTL (`packages/utils/src/rtl/index.ts`)
- [ ] Configuración preseteada para Dubai

**Archivos a crear/modificar:**
- `packages/utils/src/regional-config.ts` (modificar)
- `apps/dashboard/src/app/layout.tsx` (modificar)
- `tailwind.config.ts` (modificar)
- `packages/utils/src/rtl/index.ts` (nuevo)
- `packages/utils/src/presets/dubai.ts` (nuevo)

---

### FASE RTL-2: Migración de Componentes (3-4 días)

**Objetivo:** Migrar componentes críticos a RTL

**Entregables:**
- [ ] Sidebar/Navigation RTL-compatible
- [ ] Iconos con espejado automático
- [ ] Forms y inputs RTL-compatible
- [ ] Modales/Dialogs RTL-compatible
- [ ] Contenido bidireccional funcionando

**Componentes prioritarios:**
1. Sidebar (alto riesgo)
2. Navigation/Breadcrumbs
3. Forms
4. Modals/Dialogs
5. Icons

**Estrategia:**
- Migrar CSS a logical properties (margin-inline-start vs margin-left)
- Usar Tailwind logical classes (ms-4 vs ml-4)
- Agregar `dir="auto"` donde sea necesario

---

### FASE RTL-3: Formateo y Localización (2 días)

**Objetivo:** Formateo correcto para árabe/Dubai

**Entregables:**
- [ ] Formatters actualizados para numbering system
- [ ] Soporte calendario islámico (opcional)
- [ ] Traducciones árabe (ar-AE)
- [ ] Formateo AED (Dirham) correcto
- [ ] Configuración Dubai completa

**Archivos:**
- `packages/utils/src/formatters-enhanced.ts` (modificar)
- `apps/dashboard/src/lib/i18n/translations/ar-AE/` (nuevos)

---

### FASE RTL-4: Testing (2 días)

**Objetivo:** Validar que todo funciona en RTL

**Entregables:**
- [ ] Tests unitarios RTL
- [ ] Tests visuales RTL
- [ ] Checklist manual de testing
- [ ] Validación con árabe nativo (si es posible)

**Tests:**
- `__tests__/rtl.test.tsx`
- Checklist manual completo

---

## 🛠️ Configuración para Dubai

### Preset Dubai

```typescript
export const DUBAI_PRESET: RegionalConfiguration = {
  locale: 'ar-AE',
  direction: 'rtl',
  currency: 'AED',
  numberingSystem: 'latn', // Números occidentales (más común)
  calendar: 'gregory', // Calendario Gregoriano oficial
  
  dateFormat: {
    preset: 'medium',
  },
  
  timeFormat: {
    preset: '24h', // Dubai usa 24h
  },
  
  numberFormat: {
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  
  timezone: 'Asia/Dubai', // UTC+4
  firstDayOfWeek: 6, // Sábado (fin de semana: Viernes-Sábado)
};
```

### Moneda AED

```typescript
export const AED_CONFIG = {
  AED: {
    decimals: 2,
    symbol: 'د.إ', // Dirham symbol
    symbolPosition: 'suffix' as const,
    name: 'UAE Dirham',
  },
};
```

---

## 📝 Cambios Requeridos en RegionalConfigManager

### Agregar a `packages/utils/src/regional-config.ts`:

```typescript
export interface RegionalConfiguration {
  locale: string;
  currency: string;
  
  // ✅ NUEVO: Dirección de texto
  direction: 'ltr' | 'rtl';
  
  // ✅ NUEVO: Sistema numérico (para árabe)
  numberingSystem?: 'arab' | 'latn'; // ١٢٣ vs 123
  
  // ✅ NUEVO: Calendario
  calendar?: 'gregory' | 'islamic' | 'islamic-umalqura';
  
  dateFormat: DateFormatConfig;
  timeFormat: TimeFormatConfig;
  numberFormat: NumberFormatConfig;
  timezone: string;
  firstDayOfWeek: 0 | 1 | 6; // ✅ 6 = Sábado (Gulf countries)
}

// ✅ NUEVO: Locales RTL
export const RTL_LOCALES = ['ar', 'ar-AE', 'ar-SA', 'he', 'fa', 'ur'] as const;

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.some(rtl => locale.startsWith(rtl));
}
```

---

## 🔄 Integración con Plan de Migración ICU/Money

**Orden de implementación recomendado:**

1. **Fase 1-5: ICU/Money Migration** (11-17 días)
   - ✅ Fundamentos sólidos
   - ✅ Money model funcionando
   - ✅ ICU Message Format

2. **Fase RTL: Soporte RTL/Árabe** (10-12 días)
   - ⏳ Después de validar ICU/Money
   - ⏳ Cuando cliente Dubai confirme

**Razón:** RTL requiere que ICU/Money esté estable primero.

---

## 📊 Métricas de Éxito

### Técnicas
- [ ] HTML tiene `dir="rtl"` y `lang="ar-AE"` dinámicos
- [ ] Todos los componentes usan logical properties
- [ ] Tailwind configurado con plugin RTL
- [ ] Iconos de navegación se espejan automáticamente
- [ ] Tests RTL pasan (100%)

### Funcionales
- [ ] Cliente en Dubai puede usar la app en árabe
- [ ] Layout se invierte correctamente sin bugs
- [ ] Contenido bidireccional funciona (árabe + números)
- [ ] Formateo correcto (AED, fechas, números)
- [ ] Performance RTL aceptable

---

## 📚 Recursos y Referencias

### Documentación Esencial
- **Tailwind RTL**: https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support
- **CSS Logical Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties
- **Intl Arabic**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
- **Islamic Calendar**: https://tc39.es/ecma402/#sec-intl.datetimeformat

### Testing RTL
- **RTL Testing Library**: https://testing-library.com/docs/
- **Storybook RTL**: Addon para preview RTL/LTR

---

## ✅ Checklist Final RTL

### Antes de Producción con Cliente Dubai:

- [ ] HTML tiene `dir="rtl"` y `lang="ar-AE"` dinámicos
- [ ] Todos los componentes usan logical properties
- [ ] Tailwind configurado con plugin RTL
- [ ] Iconos de navegación se espejan
- [ ] Forms alineados correctamente
- [ ] Modales/Dialogs posicionados RTL
- [ ] Números formatean con Intl
- [ ] Moneda AED funciona
- [ ] Calendario Gregoriano + Islámico (opcional)
- [ ] Timezone Dubai (UTC+4)
- [ ] Primer día semana = Sábado
- [ ] Tests RTL pasan
- [ ] Testing manual con árabe nativo
- [ ] Performance RTL aceptable

---

## 📅 Timeline

**Duración total:** 10-12 días

- **RTL-0** (Auditoría): 1 día
- **RTL-1** (Config base): 2 días
- **RTL-2** (Componentes): 3-4 días
- **RTL-3** (Formateo): 2 días
- **RTL-4** (Testing): 2 días

**Cuándo ejecutar:** Después de completar Fases 1-5 de ICU/Money migration

---

## 🚨 Decisiones Críticas

### Decisión 1: Timeline
**✅ DECIDIDO:** RTL es Fase 2 (después de ICU/Money)

**Razón:** ICU/Money es la base necesaria. RTL agrega complejidad y es mejor hacerlo después.

### Decisión 2: Números Árabes
**Pendiente:** ¿Usar Eastern (١٢٣) o Western (123) numerals?

**Recomendación:** Western (123) - Más común en apps modernas y Dubai.

### Decisión 3: Calendario
**Pendiente:** ¿Solo Gregoriano o también Islámico?

**Recomendación:** Empezar con Gregoriano (oficial en Dubai). Islámico puede ser opcional.

---

**Última actualización:** 2025-12-20  
**Próxima revisión:** Cuando cliente Dubai confirme

---

**Este plan está listo para ejecutarse cuando se confirme la necesidad de soporte RTL/Árabe.**

