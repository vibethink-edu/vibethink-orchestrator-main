# 📚 SISTEMA DE DASHBOARDS MOCK - GUÍA RÁPIDA

> **Inicio rápido** para entender y usar el sistema de dashboards mock

---

## 🎯 ¿QUÉ ES ESTO?

Sistema para identificar y visualizar dashboards que usan **datos mock (simulados)** sin mover archivos físicamente.

---

## 📁 ARCHIVOS PRINCIPALES

| Archivo | Propósito |
|---------|-----------|
| `apps/dashboard/src/config/dashboards-metadata.ts` | Metadata centralizada de todos los dashboards |
| `apps/dashboard/src/shared/components/dashboard-badge.tsx` | Componente badge visual |
| `docs/references/DASHBOARDS_MOCK_REFERENCE.md` | Referencia completa (27 dashboards) |
| `docs/references/MOCK_DASHBOARDS_IMPLEMENTATION.md` | Guía de implementación técnica |

---

## 🚀 USO RÁPIDO

### 1. Verificar si un dashboard es mock

```typescript
import { isMockDashboard } from '@/config/dashboards-metadata'

if (isMockDashboard('/dashboard/sales')) {
  console.log('Este dashboard usa datos mock')
}
```

### 2. Agregar badge visual

```tsx
import { DashboardBadge } from '@/shared/components/dashboard-badge'

export function MyHeader() {
  return (
    <div className="flex items-center gap-2">
      <h1>Mi Dashboard</h1>
      <DashboardBadge /> {/* Se muestra automáticamente si es mock */}
    </div>
  )
}
```

### 3. Agregar nuevo dashboard mock

**Paso 1:** Agregar metadata
```typescript
// apps/dashboard/src/config/dashboards-metadata.ts
'/dashboard/nuevo': {
  type: 'mock',
  category: 'reference',
  showBadge: true,
  migrationPlanned: true
}
```

**Paso 2:** Agregar badge en header
```tsx
import { DashboardBadge } from '@/shared/components/dashboard-badge'
```

**Paso 3:** Actualizar documentación
- Agregar entrada en `DASHBOARDS_MOCK_REFERENCE.md`

---

## ⚠️ REGLAS CRÍTICAS

### ❌ NUNCA
- Mover archivos de `app/(dashboard)/` a otra ubicación
- Crear estructura `/dashboard/mock/*`
- Cambiar nombres de carpetas

### ✅ SIEMPRE
- Usar `dashboards-metadata.ts` para identificar mock
- Mostrar badge visual
- Documentar cambios

---

## 📊 ESTADÍSTICAS

- **Total Dashboards:** 27
- **Dashboards Mock:** 26 (96%)
- **Con Migración Planificada:** 20 (74%)

---

## 🔗 DOCUMENTACIÓN COMPLETA

- **Referencia Completa:** `DASHBOARDS_MOCK_REFERENCE.md`
- **Implementación Técnica:** `MOCK_DASHBOARDS_IMPLEMENTATION.md`
- **Estrategia Migración:** `docs/architecture/MOCK_TO_CRM_STRATEGY.md`

---

**Última actualización:** 2024-12-17


