# Auditoría de Alineación: Scripts vs Reglas AI-First & Locale/Naming

**Fecha:** 2025-12-21  
**Estado:** 🔍 **ANÁLISIS COMPLETO**  
**Versión:** 1.0.0

---

## 🎯 Objetivo

Validar que todos los scripts de importación y validación estén alineados con:
1. **Reglas AI-First Universal** (`AI_FIRST_UNIVERSAL_METHODOLOGY.md`)
2. **Reglas Locale/Naming** (`I18N_TERMINOLOGY_AI_FIRST.md`)
3. **DateTime Standard** (`DATE_TIME_HANDLING_POSITION.md`)
4. **Protocolo de Importación** (`MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md`)

---

## 📊 Análisis por Script

### ✅ Scripts Alineados

#### 1. `validate-ai-first-compliance.js` ✅ **COMPLETAMENTE ALINEADO**

**Reglas que valida:**
- ✅ Fechas hardcoded (detecta "June 19, 2028", etc.)
- ✅ Uso directo de `toLocaleDateString()` / `toLocaleTimeString()`
- ✅ Imports prohibidos de terminology JSON en client components
- ✅ Uso de `formatBookingRange()` (advertencias si falta)
- ✅ Terminología hardcoded (advertencias)

**Referencias:**
- ✅ `AI_FIRST_UNIVERSAL_METHODOLOGY.md`
- ✅ `VITO_ARCHITECTURE_SPEC_UNIFIED.md`

**Gaps identificados:**
- ⚠️ No valida `NormalizedWindow` vs `BookingWindow` legacy
- ⚠️ No valida `ResourceContext` explícito
- ⚠️ No valida `CivilDate` vs `InstantISO` según contexto del módulo

**Recomendación:** Agregar validaciones para `NormalizedWindow` y `ResourceContext`.

---

#### 2. `validate-i18n-imports-master.js` ✅ **ALINEADO (con gaps menores)**

**Reglas que valida:**
- ✅ Boundaries de imports (UI ↔ AI Agents ↔ Terminology)
- ✅ Uso correcto de Terminology (RSC vs Client)
- ✅ Strings hardcoded
- ✅ Completitud de i18n

**Referencias:**
- ✅ `I18N_TERMINOLOGY_AI_FIRST.md`
- ✅ `MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md`

**Gaps identificados:**
- ⚠️ No valida compliance AI-First (debería llamar a `validate-ai-first-compliance.js`)
- ⚠️ No valida DateTime safety específicamente

**Recomendación:** Integrar `validate-ai-first-compliance.js` como paso adicional.

---

#### 3. `validate-import-boundaries.js` ✅ **COMPLETAMENTE ALINEADO**

**Reglas que valida:**
- ✅ UI no puede importar desde `packages/ai-agents`
- ✅ AI Agents no pueden importar desde `apps/*/lib/i18n`
- ✅ Terminology no puede importar desde `apps/*` o `ai-agents`
- ✅ Client components no pueden importar concepts JSON

**Referencias:**
- ✅ `I18N_TERMINOLOGY_AI_FIRST.md` - Regla 2.3, 2.4
- ✅ `VITO_ARCHITECTURE_SPEC_UNIFIED.md` - PART 5

**Estado:** ✅ Perfectamente alineado

---

#### 4. `validate-terminology-usage.js` ✅ **COMPLETAMENTE ALINEADO**

**Reglas que valida:**
- ✅ Client components no pueden usar `await term()`
- ✅ Client components deben usar `useTerm()` o `termFromSnapshot()`
- ✅ Client components no pueden importar concepts JSON

**Referencias:**
- ✅ `I18N_TERMINOLOGY_AI_FIRST.md` - Regla 2.3
- ✅ `VITO_ARCHITECTURE_SPEC_UNIFIED.md` - PART 1.2

**Estado:** ✅ Perfectamente alineado

---

#### 5. `detect-hardcoded-strings-by-component.js` ✅ **ALINEADO**

**Reglas que valida:**
- ✅ Detecta strings hardcoded que deberían estar en i18n
- ✅ Ignora strings que ya usan `useTerm()` o `useTranslations()`

**Referencias:**
- ✅ `I18N_TERMINOLOGY_AI_FIRST.md` - Regla 2.1

**Gaps identificados:**
- ⚠️ No detecta fechas hardcoded específicamente (debería delegar a `validate-ai-first-compliance.js`)

**Recomendación:** Coordinar con `validate-ai-first-compliance.js` para evitar duplicación.

---

### ⚠️ Scripts con Gaps

#### 6. `validate-all-migrated-modules.js` ⚠️ **PARCIALMENTE ALINEADO**

**Lo que hace:**
- ✅ Ejecuta `validate-import-boundaries.js`
- ✅ Ejecuta `validate-terminology-usage.js`
- ✅ Ejecuta `detect-hardcoded-strings-by-component.js`

**Gaps identificados:**
- ❌ **NO ejecuta `validate-ai-first-compliance.js`** (crítico)
- ❌ No valida DateTime safety
- ❌ No valida `NormalizedWindow` vs legacy
- ❌ No valida `ResourceContext`

**Recomendación:** Agregar `validate-ai-first-compliance.js` al pipeline.

---

#### 7. `validate-i18n-keys.js` ✅ **ALINEADO (scope limitado)**

**Lo que hace:**
- ✅ Valida que las keys de i18n existan en ambos locales (en, es)
- ✅ Valida estructura de JSON

**Referencias:**
- ✅ `I18N_TERMINOLOGY_AI_FIRST.md` - Regla 2.1

**Estado:** ✅ Alineado para su scope (solo i18n keys)

---

### ❌ Scripts que NO existen pero deberían

#### 8. Script de validación de DateTime Safety ❌ **FALTA**

**Lo que debería validar:**
- ✅ Uso de `CivilDate` vs `InstantISO` según contexto
- ✅ Uso de `formatBookingRange()` en lugar de formateo manual
- ✅ Presencia de `ResourceContext` con timezone explícito
- ✅ Uso de `NormalizedWindow` vs `BookingWindow` legacy

**Referencias:**
- `DATE_TIME_HANDLING_POSITION.md` - Secciones E, F
- `VITO_ARCHITECTURE_SPEC_UNIFIED.md` - PART 2

**Recomendación:** Crear `validate-datetime-safety.js` o integrar en `validate-ai-first-compliance.js`.

---

#### 9. Script de validación de ResourceContext ❌ **FALTA**

**Lo que debería validar:**
- ✅ Presencia de `ResourceContext` en normalizers
- ✅ Timezone explícito en `ResourceContext`
- ✅ Uso correcto de `createResourceContext()` o `createResourceContextFromCoords()`

**Referencias:**
- `VITO_ARCHITECTURE_SPEC_UNIFIED.md` - PART 3

**Recomendación:** Integrar en `validate-ai-first-compliance.js`.

---

## 📋 Matriz de Cobertura

| Regla | Script que valida | Estado | Gap |
|-------|------------------|--------|-----|
| **AI-First: Context-Aware Terminology** | `validate-ai-first-compliance.js` | ✅ | ⚠️ No valida contexto explícito |
| **AI-First: DateTime Safety** | `validate-ai-first-compliance.js` | ⚠️ | ❌ No valida CivilDate vs InstantISO |
| **AI-First: External Normalization** | ❌ | ❌ | ❌ Falta validación |
| **AI-First: Resource Context** | ❌ | ❌ | ❌ Falta validación |
| **AI-First: AI Integration** | ❌ | ❌ | ❌ Falta validación (Active Glossary) |
| **Locale: Boundaries de imports** | `validate-import-boundaries.js` | ✅ | - |
| **Locale: Terminology usage (RSC vs Client)** | `validate-terminology-usage.js` | ✅ | - |
| **Locale: Strings hardcoded** | `detect-hardcoded-strings-by-component.js` | ✅ | ⚠️ No coordina con AI-First |
| **Locale: i18n completeness** | `validate-i18n-keys.js` | ✅ | - |
| **DateTime: Fechas hardcoded** | `validate-ai-first-compliance.js` | ✅ | - |
| **DateTime: toLocaleDateString prohibido** | `validate-ai-first-compliance.js` | ✅ | - |
| **DateTime: formatBookingRange requerido** | `validate-ai-first-compliance.js` | ⚠️ | ⚠️ Solo advertencia, no error |
| **DateTime: NormalizedWindow** | ❌ | ❌ | ❌ Falta validación |
| **DateTime: ResourceContext timezone** | ❌ | ❌ | ❌ Falta validación |

---

## 🔧 Recomendaciones de Mejora

### Prioridad 1: Crítico

1. **Integrar `validate-ai-first-compliance.js` en `validate-all-migrated-modules.js`**
   ```javascript
   // Agregar en validate-all-migrated-modules.js
   const aiFirstResult = runScript('validate-ai-first-compliance.js', []);
   ```

2. **Agregar validación de `NormalizedWindow` en `validate-ai-first-compliance.js`**
   ```javascript
   // Validar que se use NormalizedWindow, no BookingWindow legacy
   if (content.includes('BookingWindow') && !content.includes('NormalizedWindow')) {
     warnings.push(`Using legacy BookingWindow. Migrate to NormalizedWindow.`);
   }
   ```

3. **Agregar validación de `ResourceContext` en `validate-ai-first-compliance.js`**
   ```javascript
   // Validar que normalizers usen ResourceContext
   if (content.includes('normalize') && !content.includes('ResourceContext')) {
     issues.push(`Normalizer missing ResourceContext. Timezone must be explicit.`);
   }
   ```

### Prioridad 2: Importante

4. **Mejorar detección de `CivilDate` vs `InstantISO`**
   ```javascript
   // Validar que hotel use CivilDate, studio use InstantISO
   if (moduleName === 'hotel' && content.includes('InstantISO') && !content.includes('CivilDate')) {
     issues.push(`Hotel module should use CivilDate, not InstantISO.`);
   }
   ```

5. **Validar uso de `formatBookingRange()` como error, no advertencia**
   ```javascript
   // Cambiar de warning a error
   if (hasDates && !content.includes('formatBookingRange')) {
     issues.push(`Must use formatBookingRange() for date formatting.`);
   }
   ```

### Prioridad 3: Mejoras

6. **Crear script de validación de Active Glossary para AI Agents**
   - Validar que AI Agents construyan Active Glossary
   - Validar que incluyan terminología del módulo

7. **Integrar validación de External Normalization**
   - Validar que normalizers existan para cada sourceSystem
   - Validar que transformen correctamente a `NormalizedWindow`

---

## 📝 Plan de Acción

### Fase 1: Correcciones Críticas (Inmediato)

- [ ] Integrar `validate-ai-first-compliance.js` en `validate-all-migrated-modules.js`
- [ ] Agregar validación de `NormalizedWindow` en `validate-ai-first-compliance.js`
- [ ] Agregar validación de `ResourceContext` en `validate-ai-first-compliance.js`

### Fase 2: Mejoras Importantes (Esta semana)

- [ ] Mejorar detección de `CivilDate` vs `InstantISO`
- [ ] Cambiar `formatBookingRange()` de advertencia a error
- [ ] Coordinar `detect-hardcoded-strings-by-component.js` con AI-First

### Fase 3: Validaciones Adicionales (Próxima semana)

- [ ] Crear validación de Active Glossary para AI Agents
- [ ] Crear validación de External Normalization
- [ ] Documentar todos los scripts en un índice centralizado

---

## ✅ Conclusión

**Estado General:** 🟡 **PARCIALMENTE ALINEADO**

**Fortalezas:**
- ✅ Scripts de i18n/terminology están bien alineados
- ✅ Boundaries de imports están perfectamente validados
- ✅ `validate-ai-first-compliance.js` cubre la mayoría de reglas AI-First

**Debilidades:**
- ❌ Falta validación de `NormalizedWindow` y `ResourceContext`
- ❌ `validate-all-migrated-modules.js` no incluye AI-First
- ❌ Falta validación de External Normalization

**Prioridad:** Implementar Fase 1 (correcciones críticas) antes de continuar con nuevos módulos.

---

**Última actualización:** 2025-12-21  
**Autor:** AI Assistant (Cursor)  
**Revisado por:** Pendiente










