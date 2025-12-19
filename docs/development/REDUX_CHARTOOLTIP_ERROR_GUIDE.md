# Guía de Resolución: Error Redux ChartTooltipContent

## 🚨 **PROBLEMA IDENTIFICADO**

### **Error Típico:**
```
Error: Cannot destructure property 'activeIndex' of '(0 , _state_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(...)' as it is undefined.
```

### **Ubicación del Error:**
Cualquier componente que use `ChartTooltipContent` desde `@/shared/components/ui/chart`

### **Causa Raíz:**
El componente `ChartTooltipContent` internamente usa `useAppSelector` (Redux hook) pero no hay un Redux Provider configurado correctamente en la aplicación, causando que el hook retorne `undefined`.

## 🔧 **SOLUCIÓN SISTEMÁTICA**

### **Paso 1: Identificar Archivos Afectados**
```bash
# Buscar todos los archivos que usan ChartTooltipContent
grep -r "ChartTooltipContent" apps/dashboard/app/(dashboard)/website-analytics-dashboard/components/
```

### **Paso 2: Para Cada Archivo Afectado**

#### **2.1 Remover Imports:**
```typescript
// ❌ ANTES:
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/shared/components/ui/chart'

// ✅ DESPUÉS:
import {
  ChartConfig,
  ChartContainer
} from '@/shared/components/ui/chart'
```

#### **2.2 Remover Uso de ChartTooltip:**
```typescript
// ❌ ANTES:
<ChartTooltip 
  content={<ChartTooltipContent 
    formatter={(value, name) => [
      formatCurrency(value as number),
      'Custom Label'
    ]}
  />} 
/>

// ✅ DESPUÉS:
{/* ChartTooltip removed - causes Redux error */}
```

### **Paso 3: Verificar Componentes Afectados**
Basado en este caso específico, estos archivos típicamente necesitan corrección:

1. `AverageDailySales.tsx`
2. `SalesOverflowCard.tsx` 
3. `SalesByCountriesCard.tsx`
4. `MonthlyCampaignState.tsx`
5. `EarningReportsCard.tsx`
6. `TotalEarningCard.tsx`

## 🎯 **COMANDOS DE VERIFICACIÓN**

### **Buscar Referencias Residuales:**
```bash
# Verificar que no queden referencias a ChartTooltipContent
grep -r "ChartTooltipContent" apps/dashboard/app/(dashboard)/website-analytics-dashboard/

# Verificar imports problemáticos
grep -r "ChartTooltip," apps/dashboard/app/(dashboard)/website-analytics-dashboard/
```

### **Probar Dashboard:**
```bash
# Iniciar servidor de prueba
npm run dev:test  # Puerto 3099

# O puerto alternativo
cd apps/dashboard && npm run dev -- -p 3095

# Verificar página
curl -s -o /dev/null -w "%{http_code}" http://localhost:3095/website-analytics-dashboard
```

## 📋 **CHECKLIST DE RESOLUCIÓN**

- [ ] Identificar error `useAppSelector ... is undefined`
- [ ] Buscar archivos con `ChartTooltipContent`
- [ ] Para cada archivo:
  - [ ] Remover imports de `ChartTooltip` y `ChartTooltipContent`
  - [ ] Reemplazar `<ChartTooltip ... />` con comentario
  - [ ] Verificar sintaxis (eliminar `/>` sobrantes)
- [ ] Probar dashboard HTTP 200
- [ ] Verificar que charts rendericen sin tooltips

## 💡 **ALTERNATIVAS FUTURAS**

### **Opción 1: Configurar Redux Provider**
Si se necesitan tooltips, configurar Redux store apropiadamente.

### **Opción 2: Usar Tooltips Nativos de Recharts**
```typescript
import { Tooltip } from 'recharts'

<Tooltip 
  formatter={(value, name) => [formatCurrency(value as number), 'Sales']}
  labelFormatter={(label) => `Date: ${label}`}
/>
```

### **Opción 3: Componente Tooltip Personalizado**
Crear tooltip sin dependencias Redux.

## 🔍 **SÍNTOMAS DEL PROBLEMA**

1. **Error en consola:** `useAppSelector ... is undefined`
2. **Ubicación:** Siempre en línea que contiene `<ChartTooltip`
3. **Patrón:** Error se "mueve" entre componentes cuando se arregla uno
4. **Comportamiento:** Charts funcionan pero fallan en tooltip hover

## ✅ **RESULTADO ESPERADO**

- Dashboard carga sin errores Redux
- Charts renderizan correctamente
- Funcionalidad preserved (excepto tooltips)
- HTTP 200 en página analytics
- Solo warnings menores de React 19 refs

## 📚 **NOTAS TÉCNICAS**

- **Bundui-reference:** Utiliza ChartTooltipContent sin problemas (configuración diferente)
- **Workaround vs Fix:** Esta es una solución pragmática, no un fix de la causa raíz
- **Performance:** No impacta rendimiento, solo UX de tooltips
- **Escalabilidad:** Patrón aplicable a cualquier componente con mismo error

---

**💾 GUARDAR ESTA GUÍA:** Para referencia futura cuando aparezca el error `useAppSelector undefined` en componentes de charts.