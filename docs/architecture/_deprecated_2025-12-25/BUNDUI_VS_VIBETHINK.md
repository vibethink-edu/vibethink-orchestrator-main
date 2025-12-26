# 🎯 Bundui vs VibeThink - Diferencias Críticas

## ⚠️ IMPORTANTE: No Confundir

### 📦 **`dashboard-bundui/`** - Mirror de Bundui Premium

**Propósito**: Referencia exacta de Bundui Premium

**Reglas**:
- ✅ **MIRROR EXACTO** - No modificar lógica de negocio
- ✅ **Solo adaptar imports** a monorepo (`@vibethink/ui`)
- ✅ **Mantener estructura** original de Bundui Premium
- ✅ **Componentes 1:1** con Bundui Premium
- ✅ **CSS y estilos** deben coincidir exactamente

**Ejemplos**:
- `dashboard-bundui/analytics` - Mirror de Bundui Analytics
- `dashboard-bundui/website-analytics` - Mirror de Bundui Website Analytics
- `dashboard-bundui/crm` - Mirror de Bundui CRM

**Cuando migrar aquí**:
- Dashboards que vienen directamente de `apps/bundui-reference/`
- Dashboards que son referencia de Bundui Premium
- Dashboards que NO desarrollamos nosotros

---

### 🚀 **`dashboard-vibethink/`** - Nuestros Dashboards (Necesitan Depuración)

**Propósito**: Dashboards que desarrollamos antes y necesitan depuración

**Reglas**:
- ✅ **Lógica propia** - Puede tener lógica de negocio custom
- ✅ **Hooks y servicios** propios (`useCrmData`, `useSalesData`, etc.)
- ✅ **Estructura adaptada** a nuestras necesidades
- ✅ **Puede tener bugs** que necesitan depuración
- ✅ **Mejoras continuas** permitidas

**Ejemplos**:
- `dashboard-vibethink/crm` - CRM desarrollado por nosotros
- `dashboard-vibethink/sales` - Sales desarrollado por nosotros
- `dashboard-vibethink/ecommerce` - E-commerce desarrollado por nosotros

**Cuando migrar aquí**:
- Dashboards que desarrollamos antes
- Dashboards con lógica custom
- Dashboards que necesitan depuración/mejoras

---

## 🔍 Cómo Identificar

### Bundui (Mirror):
```typescript
// ✅ CORRECTO - Solo adaptar imports
import { Card, Button } from "@vibethink/ui"; // Adaptado
// Lógica exacta de Bundui Premium
```

### VibeThink (Nuestros):
```typescript
// ✅ CORRECTO - Lógica propia
import { useCrmData } from "./hooks/useCrmData"; // Hook propio
// Lógica desarrollada por nosotros
```

---

## ⚠️ Errores Comunes

### ❌ NO HACER:
1. **Mezclar lógica** de Bundui con VibeThink
2. **Modificar lógica** en `dashboard-bundui/` (solo imports)
3. **Copiar componentes** de Bundui a VibeThink sin adaptar
4. **Usar hooks propios** en `dashboard-bundui/`

### ✅ HACER:
1. **Adaptar solo imports** en `dashboard-bundui/`
2. **Depurar y mejorar** en `dashboard-vibethink/`
3. **Mantener separación** clara entre ambos
4. **Documentar** qué va dónde

---

## 📋 Checklist de Migración

### Para Bundui (Mirror):
- [ ] ¿Viene de `apps/bundui-reference/`? → `dashboard-bundui/`
- [ ] ¿Es referencia exacta? → `dashboard-bundui/`
- [ ] ¿Solo adaptar imports? → `dashboard-bundui/`

### Para VibeThink (Nuestros):
- [ ] ¿Lo desarrollamos nosotros? → `dashboard-vibethink/`
- [ ] ¿Tiene lógica custom? → `dashboard-vibethink/`
- [ ] ¿Necesita depuración? → `dashboard-vibethink/`

---

**Última actualización**: 2025-01-17  
**Autor**: AI Assistant (Claude)

