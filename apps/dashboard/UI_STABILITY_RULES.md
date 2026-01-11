# 🛡️ UI STABILITY RULES - INQUEBRANTABLES

**Fecha de creación**: 2026-01-10  
**Última actualización**: 2026-01-10 22:59  
**Propósito**: NUNCA MÁS romper la UI con refactorizaciones

> **📚 DOCUMENTO PRINCIPAL**: Ver `DASHBOARD_ARCHITECTURE.md` para arquitectura completa  
> Este documento es un RESUMEN de reglas críticas.

---

## ⛔ REGLAS ABSOLUTAS

### 1. **dashboard-bundui = FUENTE DE VERDAD**
- ✅ TODOS los mockups de UI se estabilizan PRIMERO aquí
- ✅ NO importa el vendor (BundUI, VibeThink, etc.)
- ❌ NUNCA mover componentes de aquí sin validar ANTES

### 2. **Assets Globales = INTOCABLES**
```
packages/ui/
├── src/icons.tsx          ← NUNCA cambiar exports
├── src/globals.css        ← NUNCA cambiar estructura
└── src/components/        ← NUNCA mover sin migración
```

### 3. **Imports SIEMPRE desde @vibethink/ui**
```typescript
// ✅ CORRECTO
import { Button } from '@vibethink/ui/components/button'
import { Icon } from '@vibethink/ui/icons'

// ❌ PROHIBIDO
import { Button } from '@/components/ui/button'
import { Icon } from 'lucide-react'
```

### 4. **NO duplicar componentes**
- Si existe en `packages/ui/` → USAR ESE
- Si no existe → Crear en `packages/ui/` PRIMERO
- ❌ NUNCA crear versiones locales

---

## 🚨 ANTES DE CUALQUIER REFACTORIZACIÓN

### Checklist Obligatorio:
- [ ] ¿Rompe imports existentes? → **NO HACER**
- [ ] ¿Mueve archivos de dashboard-bundui? → **VALIDAR PRIMERO**
- [ ] ¿Cambia exports de packages/ui? → **MIGRATION PLAN REQUIRED**
- [ ] ¿Afecta rutas de admin? → **TEST MANUAL OBLIGATORIO**

---

## 📋 RUTAS CRÍTICAS - NO TOCAR SIN VALIDAR

### Admin Interno (VibeThink)
```
/dashboard-bundui/system-admin/tenants
```

### Admin Empresas (Clientes)
```
/dashboard-bundui/tenant-admin
```

### Mockups Estables
```
/dashboard-bundui/projects-v2
/dashboard-bundui/crm-v2-ai
/dashboard-bundui/pos-system
/dashboard-bundui/website-analytics
```

---

## 🔒 IMPORTS PROTEGIDOS

### Estos imports NO se pueden cambiar sin aprobación:
```typescript
// Componentes UI
@vibethink/ui/components/*
@vibethink/ui/icons

// Utilidades
@vibethink/utils

// Hooks compartidos
@/lib/i18n
@/hooks/use-toast
```

---

## ⚡ PROCESO DE CAMBIOS SEGUROS

1. **Crear branch de testing**
2. **Hacer cambio mínimo**
3. **Validar con `pnpm tsc --noEmit`**
4. **Test manual en browser**
5. **Solo entonces hacer commit**

---

## 🎯 OBJETIVO FINAL

**CERO ERRORES TypeScript + UI ESTABLE = FELICIDAD**

Si algo se rompe → REVERTIR INMEDIATAMENTE

---

## 📞 CONTACTO

Si necesitas hacer un cambio que rompa estas reglas:
1. Documentar el PORQUÉ
2. Crear plan de migración
3. Validar en staging PRIMERO
4. Nunca en producción directamente

---

**ÚLTIMA ACTUALIZACIÓN**: 2026-01-10  
**VERSIÓN**: 1.0 - INICIAL
