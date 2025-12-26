# 🔍 Protocolo de Validación de Traducciones i18n

**Fecha:** 2025-12-21  
**Propósito:** Asegurar que TODAS las keys de traducción usadas en componentes existan en los archivos de traducción

---

## 🚨 Problema Identificado

Durante la migración del módulo Analytics, se identificó que **faltaban keys de traducción** aunque los componentes ya estaban usando `useTranslation()`. 

**Ejemplo:** El componente `SalesOverflowCard.tsx` usaba `t('cards.salesOverflow.targetAchievement')` pero esta key no existía en `analytics.json`.

---

## ✅ Protocolo Obligatorio

### **Paso 1: Extraer TODAS las keys usadas en el componente**

Después de migrar cada componente, ejecutar:

```bash
# Buscar todas las llamadas a t() en el componente
grep -r "t('cards\." apps/dashboard/app/dashboard-bundui/analytics/components/SalesOverflowCard.tsx
```

O usar la herramienta de búsqueda del IDE para encontrar:
- `t('cards.`
- `t("cards.`
- `t(\`cards.`

### **Paso 2: Listar TODAS las keys encontradas**

Crear una lista de todas las keys usadas:

```typescript
// Ejemplo: SalesOverflowCard.tsx
const keysUsed = [
  'cards.salesOverflow.title',
  'cards.salesOverflow.description',
  'cards.salesOverflow.targetAchievement',  // ⚠️ FALTABA
  'cards.salesOverflow.totalSales',         // ⚠️ FALTABA
  'cards.salesOverflow.target',             // ⚠️ FALTABA
  'cards.salesOverflow.salesOverflow',      // ⚠️ FALTABA
  'cards.salesOverflow.weeklyPerformance',   // ⚠️ FALTABA
  'cards.salesOverflow.excellent',          // ⚠️ FALTABA
  'cards.salesOverflow.good',               // ⚠️ FALTABA
  'cards.salesOverflow.warning',           // ⚠️ FALTABA
  'cards.salesOverflow.poor',               // ⚠️ FALTABA
  'cards.salesOverflow.excellentPerformance', // ⚠️ FALTABA
  'cards.salesOverflow.goodPerformance',     // ⚠️ FALTABA
  'cards.salesOverflow.warningPerformance',   // ⚠️ FALTABA
  'cards.salesOverflow.poorPerformance'       // ⚠️ FALTABA
]
```

### **Paso 3: Verificar existencia en archivos de traducción**

Para cada key, verificar que existe en:
- `apps/dashboard/src/lib/i18n/translations/en/analytics.json`
- `apps/dashboard/src/lib/i18n/translations/es/analytics.json`

```bash
# Verificar en inglés
grep "targetAchievement" apps/dashboard/src/lib/i18n/translations/en/analytics.json

# Verificar en español
grep "targetAchievement" apps/dashboard/src/lib/i18n/translations/es/analytics.json
```

### **Paso 4: Agregar keys faltantes**

Si una key no existe, agregarla inmediatamente en AMBOS archivos (en/es).

**Estructura correcta:**
```json
{
  "cards": {
    "salesOverflow": {
      "title": "Sales Performance",
      "description": "Sales vs targets with overflow analysis",
      "targetAchievement": "Target Achievement",  // ✅ Agregar
      "totalSales": "Total Sales",                // ✅ Agregar
      "target": "Target",                          // ✅ Agregar
      "salesOverflow": "Sales Overflow",           // ✅ Agregar
      "weeklyPerformance": "Weekly Performance",  // ✅ Agregar
      "excellent": "Excellent Performance",        // ✅ Agregar
      "good": "Good Performance",                  // ✅ Agregar
      "warning": "Warning Performance",            // ✅ Agregar
      "poor": "Poor Performance",                  // ✅ Agregar
      "excellentPerformance": "Outstanding performance! Sales significantly exceed targets.",
      "goodPerformance": "Good performance! Sales are meeting or exceeding targets.",
      "warningPerformance": "Caution: Sales are close to targets but need improvement.",
      "poorPerformance": "Action needed: Sales are significantly below targets."
    }
  }
}
```

### **Paso 5: Validar con linter**

Después de agregar las keys, ejecutar:

```bash
read_lints paths=['apps/dashboard/app/dashboard-bundui/analytics']
```

---

## 📋 Checklist Obligatorio por Componente

Después de migrar CADA componente:

- [ ] **Extraer todas las keys usadas** con `grep` o búsqueda en IDE
- [ ] **Listar todas las keys** encontradas
- [ ] **Verificar existencia** en `en/analytics.json`
- [ ] **Verificar existencia** en `es/analytics.json`
- [ ] **Agregar keys faltantes** en ambos archivos
- [ ] **Validar con linter** que no hay errores
- [ ] **Verificar estructura JSON** (sintaxis correcta)

---

## 🔧 Script de Validación (Futuro)

**TODO:** Crear script que automatice esta validación:

```javascript
// scripts/validate-i18n-keys.js
// 1. Buscar todas las llamadas t('cards.X') en componentes
// 2. Extraer lista de keys usadas
// 3. Leer archivos de traducción
// 4. Comparar y reportar keys faltantes
// 5. Generar reporte de validación
```

---

## 🎯 Instrucción para AI Agents

**CRÍTICO:** Después de migrar cualquier componente a i18n:

1. **NUNCA asumir** que todas las keys existen
2. **SIEMPRE verificar** con `grep` todas las keys usadas
3. **SIEMPRE agregar** keys faltantes antes de considerar la migración completa
4. **SIEMPRE validar** con linter después de agregar keys

**Comando obligatorio después de cada migración:**
```bash
# 1. Extraer keys usadas
grep -r "t('cards\." apps/dashboard/app/dashboard-bundui/[MODULE]/components/[COMPONENT].tsx

# 2. Verificar existencia
grep "[KEY_NAME]" apps/dashboard/src/lib/i18n/translations/en/[MODULE].json
grep "[KEY_NAME]" apps/dashboard/src/lib/i18n/translations/es/[MODULE].json

# 3. Validar linter
read_lints paths=['apps/dashboard/app/dashboard-bundui/[MODULE]']
```

---

## 📝 Ejemplo Real: SalesOverflowCard

### Keys encontradas en el componente:
```typescript
t('cards.salesOverflow.title')              // ✅ Existía
t('cards.salesOverflow.description')        // ✅ Existía
t('cards.salesOverflow.targetAchievement')  // ❌ FALTABA
t('cards.salesOverflow.totalSales')         // ❌ FALTABA
t('cards.salesOverflow.target')             // ❌ FALTABA
t('cards.salesOverflow.salesOverflow')      // ❌ FALTABA
t('cards.salesOverflow.weeklyPerformance')  // ❌ FALTABA
t('cards.salesOverflow.excellent')          // ❌ FALTABA
t('cards.salesOverflow.good')                // ❌ FALTABA
t('cards.salesOverflow.warning')             // ❌ FALTABA
t('cards.salesOverflow.poor')                // ❌ FALTABA
t('cards.salesOverflow.excellentPerformance') // ❌ FALTABA
t('cards.salesOverflow.goodPerformance')     // ❌ FALTABA
t('cards.salesOverflow.warningPerformance')   // ❌ FALTABA
t('cards.salesOverflow.poorPerformance')     // ❌ FALTABA
```

### Solución:
Agregar todas las keys faltantes en `en/analytics.json` y `es/analytics.json`.

---

## ✅ Validación Final

Antes de considerar una migración completa:

1. ✅ Todos los componentes usan `useTranslation()`
2. ✅ Todas las keys usadas existen en `en/[module].json`
3. ✅ Todas las keys usadas existen en `es/[module].json`
4. ✅ Linter no reporta errores
5. ✅ Build compila sin errores

---

**Última actualización:** 2025-12-21  
**Creado por:** Auto (Claude Sonnet 4.5)  
**Motivo:** Identificar y corregir omisión de keys de traducción




