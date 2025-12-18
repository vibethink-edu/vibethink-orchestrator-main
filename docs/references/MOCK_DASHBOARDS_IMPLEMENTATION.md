# 🎯 IMPLEMENTACIÓN: Sistema de Dashboards Mock

> **Fecha:** 2024-12-17  
> **Estado:** ✅ Implementado

---

## 📋 RESUMEN

Sistema completo para identificar, documentar y visualizar dashboards que usan datos mock (simulados) sin mover archivos físicamente.

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────┐
│         DASHBOARDS MOCK SYSTEM                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Metadata Centralizada                       │
│     └─ apps/dashboard/src/config/              │
│        └─ dashboards-metadata.ts                │
│                                                 │
│  2. Componente Badge Visual                      │
│     └─ apps/dashboard/src/shared/components/   │
│        └─ dashboard-badge.tsx                   │
│                                                 │
│  3. Documentación                               │
│     ├─ DASHBOARDS_MOCK_REFERENCE.md            │
│     └─ MOCK_DASHBOARDS_IMPLEMENTATION.md       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📁 ARCHIVOS CREADOS

### 1. Metadata Centralizada

**Ubicación:** `apps/dashboard/src/config/dashboards-metadata.ts`

**Propósito:**
- Sistema centralizado de metadata para todos los dashboards
- Identifica tipo (mock/real/hybrid), categoría, migración planificada
- Funciones helper para verificar estado

**Uso:**
```typescript
import { isMockDashboard, getDashboardMetadata } from '@/config/dashboards-metadata'

// Verificar si es mock
if (isMockDashboard('/dashboard/sales')) {
  // Mostrar badge o mensaje
}

// Obtener metadata completa
const metadata = getDashboardMetadata('/dashboard/sales')
```

### 2. Componente Badge

**Ubicación:** `apps/dashboard/src/shared/components/dashboard-badge.tsx`

**Propósito:**
- Badge visual discreto para dashboards mock
- Se muestra automáticamente basado en metadata
- Texto dinámico según tipo y categoría

**Uso:**
```tsx
import { DashboardBadge } from '@/shared/components/dashboard-badge'

export function SalesHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1>Sales Dashboard</h1>
      <DashboardBadge /> {/* Se muestra automáticamente si es mock */}
    </div>
  )
}
```

### 3. Documentación

**Archivos:**
- `docs/references/DASHBOARDS_MOCK_REFERENCE.md` - Referencia completa
- `docs/references/MOCK_DASHBOARDS_IMPLEMENTATION.md` - Este archivo

---

## 🎨 BADGE VISUAL

### Diseño

```tsx
<Badge variant="outline" className="text-xs font-normal">
  Demo / Reference
</Badge>
```

### Variantes de Texto

| Tipo | Categoría | Texto del Badge |
|------|-----------|-----------------|
| Mock | Reference | "Demo / Reference" |
| Mock | Reference + Migration | "Reference (Migration Planned)" |
| Hybrid | Demo | "Demo Mode" |
| Mock | Demo | "Demo" |

### Ubicación Recomendada

**Opción 1: En el Header del Dashboard**
```tsx
// En SalesHeader.tsx, CrmHeader.tsx, etc.
<div className="flex items-center gap-2">
  <h1>Sales Dashboard</h1>
  <DashboardBadge />
</div>
```

**Opción 2: En el Header Global (Opcional)**
```tsx
// En SiteHeader (header-bundui/index.tsx)
// Solo si queremos mostrar en todos los dashboards mock
```

**Recomendación:** Opción 1 (en cada dashboard individual) para mayor control.

---

## 🔧 CONFIGURACIÓN

### Agregar Nuevo Dashboard Mock

1. **Agregar metadata:**
```typescript
// apps/dashboard/src/config/dashboards-metadata.ts
'/dashboard/nuevo-dashboard': {
  type: 'mock',
  category: 'reference',
  description: 'Descripción del dashboard',
  showBadge: true,
  migrationPlanned: true
}
```

2. **Agregar badge en el header:**
```tsx
// apps/dashboard/app/(dashboard)/nuevo-dashboard/components/Header.tsx
import { DashboardBadge } from '@/shared/components/dashboard-badge'

export function Header() {
  return (
    <div className="flex items-center gap-2">
      <h1>Nuevo Dashboard</h1>
      <DashboardBadge />
    </div>
  )
}
```

3. **Actualizar documentación:**
- Agregar entrada en `DASHBOARDS_MOCK_REFERENCE.md`
- Actualizar estadísticas

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Para Cada Dashboard Mock

- [ ] Metadata agregada en `dashboards-metadata.ts`
- [ ] Badge agregado en el header del dashboard
- [ ] Documentación actualizada
- [ ] Verificado que el badge se muestra correctamente
- [ ] Verificado que no rompe layout

---

## 🚫 REGLAS CRÍTICAS

### ❌ NUNCA HACER

1. **NO mover archivos** de `app/(dashboard)/` a otra ubicación
2. **NO crear** estructura `/dashboard/mock/*` (rompe rutas)
3. **NO cambiar** nombres de carpetas de dashboards existentes
4. **NO eliminar** dashboards mock sin documentar migración

### ✅ SIEMPRE HACER

1. **Mantener** estructura actual de carpetas
2. **Usar** `dashboards-metadata.ts` para identificar mock
3. **Mostrar** badge visual en dashboards mock
4. **Documentar** cambios en `DASHBOARDS_MOCK_REFERENCE.md`
5. **Usar** feature flags para migración gradual

---

## 🔄 MIGRACIÓN FUTURA

Cuando un dashboard migre de mock a real:

1. **Actualizar metadata:**
```typescript
'/dashboard/sales': {
  type: 'real', // Cambiar de 'mock' a 'real'
  category: 'production',
  showBadge: false, // Ocultar badge
  migrationPlanned: false
}
```

2. **Remover badge** del header (o dejar que se oculte automáticamente)

3. **Actualizar documentación:**
- Mover de "Dashboards Mock" a "Dashboards Reales" en `DASHBOARDS_MOCK_REFERENCE.md`
- Actualizar estadísticas

---

## 📊 ESTADÍSTICAS ACTUALES

- **Total Dashboards:** 27
- **Dashboards Mock:** 26 (96%)
- **Dashboards Hybrid:** 1 (4%)
- **Dashboards Reales:** 0 (0%)
- **Con Migración Planificada:** 20 (74%)

---

## 🔗 REFERENCIAS

- **Metadata:** `apps/dashboard/src/config/dashboards-metadata.ts`
- **Badge Component:** `apps/dashboard/src/shared/components/dashboard-badge.tsx`
- **Referencia Completa:** `docs/references/DASHBOARDS_MOCK_REFERENCE.md`
- **Estrategia Migración:** `docs/architecture/MOCK_TO_CRM_STRATEGY.md`

---

**Última actualización:** 2024-12-17  
**Mantenido por:** VibeThink Orchestrator Team


