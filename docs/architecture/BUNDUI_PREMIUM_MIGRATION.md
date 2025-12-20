# Migración de bundui-premium a @vibethink/ui

## 📋 Resumen

Este documento describe la migración completa de componentes de `bundui-premium` a `@vibethink/ui`, consolidando todos los componentes de layout en el paquete UI principal del monorepo.

## 🎯 Objetivo

**Migrar todos los componentes de layout de `bundui-premium` a `@vibethink/ui`** para:
- Centralizar componentes de UI en un solo lugar
- Eliminar duplicación de código
- Facilitar mantenimiento y actualizaciones
- Mejorar la consistencia entre dashboards

## 📦 Componentes Migrados

### Layout Components

Todos los componentes de layout han sido migrados a `packages/ui/src/components/layout/`:

| Componente Legacy | Nuevo en @vibethink/ui | Estado |
|------------------|------------------------|--------|
| `AppSidebar` | `@vibethink/ui` → `AppSidebar` | ✅ Migrado |
| `SiteHeader` | `@vibethink/ui` → `SiteHeader` | ✅ Migrado |
| `NavMain` | `@vibethink/ui` → `NavMain` | ✅ Migrado |
| `NavUser` | `@vibethink/ui` → `NavUser` | ✅ Migrado |
| `Notifications` | `@vibethink/ui` → `Notifications` | ✅ Migrado |
| `Search` | `@vibethink/ui` → `Search` | ✅ Migrado |
| `ThemeSwitch` | `@vibethink/ui` → `ThemeSwitch` | ✅ Migrado |
| `UserMenu` | `@vibethink/ui` → `UserMenu` | ✅ Migrado |
| `IconWrapper` | `@vibethink/ui` → `IconWrapper` | ✅ Migrado |

### Hooks Migrados

| Hook Legacy | Nuevo en @vibethink/ui | Estado |
|------------|------------------------|--------|
| `useIsMobile` | `@vibethink/ui` → `useIsMobile` | ✅ Migrado |
| `useIsTablet` | `@vibethink/ui` → `useIsTablet` | ✅ Migrado |

## 📁 Estructura de Archivos

### Antes (bundui-premium)

```
apps/dashboard/src/shared/components/bundui-premium/
├── components/
│   ├── layout/
│   │   ├── sidebar-bundui/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-user.tsx
│   │   │   └── icon-wrapper.tsx
│   │   └── header-bundui/
│   │       ├── index.tsx (SiteHeader)
│   │       ├── notifications.tsx
│   │       ├── search.tsx
│   │       ├── theme-switch.tsx
│   │       └── user-menu.tsx
│   └── panel.tsx
```

### Después (@vibethink/ui)

```
packages/ui/src/
├── components/
│   └── layout/
│       ├── app-sidebar.tsx
│       ├── site-header.tsx
│       ├── nav-main.tsx
│       ├── nav-user.tsx
│       ├── notifications.tsx
│       ├── search.tsx
│       ├── theme-switch.tsx
│       ├── user-menu.tsx
│       ├── icon-wrapper.tsx
│       └── index.ts
└── hooks/
    └── use-mobile.ts
```

## 🔄 Cambios en Imports

### Antes

```typescript
import { AppSidebar } from "@/shared/components/bundui-premium/components/layout/sidebar-bundui/app-sidebar";
import { SiteHeader } from "@/shared/components/bundui-premium/components/layout/header-bundui";
import Notifications from "@/shared/components/bundui-premium/components/layout/header-bundui/notifications";
import { useIsMobile } from "@/hooks/use-mobile";
```

### Después

```typescript
import { 
  AppSidebar, 
  SiteHeader, 
  Notifications,
  useIsMobile 
} from '@vibethink/ui';
```

## 📊 Datos Compartidos

Los `navItems` de Bundui se han centralizado en:

```
apps/dashboard/src/shared/data/bundui-nav-items.ts
```

Este archivo exporta `bunduiNavItems` que se usa en:
- `AppSidebar` (via prop `navItems`)
- `NavMain` (via prop `navItems`)
- `Search` (via prop `navItems`)
- `SiteHeader` (via prop `navItems`)

## 🎨 Uso de Componentes Migrados

### AppSidebar

```typescript
import { AppSidebar } from '@vibethink/ui';
import { bunduiNavItems } from '@/shared/data/bundui-nav-items';

<AppSidebar variant="inset" navItems={bunduiNavItems} />
```

### SiteHeader

```typescript
import { SiteHeader } from '@vibethink/ui';
import { bunduiNavItems } from '@/shared/data/bundui-nav-items';

<SiteHeader 
  navItems={bunduiNavItems}
  showThemeCustomizer={true}
  ThemeCustomizerPanel={ThemeCustomizerPanel}
/>
```

### NavMain

```typescript
import { NavMain } from '@vibethink/ui';
import { bunduiNavItems } from '@/shared/data/bundui-nav-items';

<NavMain navItems={bunduiNavItems} />
```

### Notifications

```typescript
import { Notifications } from '@vibethink/ui';

// Con notificaciones por defecto
<Notifications />

// Con notificaciones personalizadas
<Notifications 
  notifications={customNotifications}
  isMobile={isMobile}
/>
```

### Search

```typescript
import { Search } from '@vibethink/ui';
import { bunduiNavItems } from '@/shared/data/bundui-nav-items';

<Search navItems={bunduiNavItems} />
```

## ⚠️ Componentes Legacy (Deprecated)

Los componentes en `bundui-premium` siguen existiendo para compatibilidad, pero están **deprecated**:

- `apps/dashboard/src/shared/components/bundui-premium/components/layout/`
- Estos componentes ahora importan datos de `bundui-nav-items.ts` y eventualmente serán eliminados

**⚠️ NO crear nuevos componentes en `bundui-premium`**. Usar `@vibethink/ui` en su lugar.

## 🔧 Reglas de Migración

### ✅ Hacer

1. **Usar `@vibethink/ui` para todos los componentes de layout**
   ```typescript
   import { AppSidebar, SiteHeader, NavMain } from '@vibethink/ui';
   ```

2. **Usar hooks de `@vibethink/ui`**
   ```typescript
   import { useIsMobile, useIsTablet } from '@vibethink/ui';
   ```

3. **Pasar `navItems` como props cuando sea necesario**
   ```typescript
   <AppSidebar navItems={bunduiNavItems} />
   ```

4. **Usar datos centralizados de `bundui-nav-items.ts`**
   ```typescript
   import { bunduiNavItems } from '@/shared/data/bundui-nav-items';
   ```

### ❌ No Hacer

1. **NO importar de `bundui-premium` para nuevos componentes**
   ```typescript
   // ❌ INCORRECTO
   import { AppSidebar } from "@/shared/components/bundui-premium/...";
   
   // ✅ CORRECTO
   import { AppSidebar } from '@vibethink/ui';
   ```

2. **NO crear nuevos componentes en `bundui-premium`**
   - Todos los nuevos componentes deben ir en `@vibethink/ui`

3. **NO duplicar `navItems`**
   - Usar siempre `bunduiNavItems` de `shared/data/bundui-nav-items.ts`

## 📝 Archivos Actualizados

### Layouts

- ✅ `apps/dashboard/app/dashboard-bundui/layout.tsx`
  - Migrado a usar `AppSidebar` y `SiteHeader` de `@vibethink/ui`

### Headers

- ✅ `apps/dashboard/src/components/layout/header-vibethink.tsx`
  - Migrado a usar componentes de `@vibethink/ui`

### Sidebars

- ✅ `apps/dashboard/src/shared/components/vibethink-sidebar.tsx`
  - Migrado a usar `NavUser` y `useIsTablet` de `@vibethink/ui`

### Componentes Legacy (Actualizados para usar datos centralizados)

- ✅ `apps/dashboard/src/shared/components/bundui-premium/components/layout/sidebar-bundui/nav-main.tsx`
- ✅ `apps/dashboard/src/shared/components/bundui-premium/components/layout/header-bundui/search.tsx`

## 🚀 Próximos Pasos

1. **Eliminar componentes legacy** (después de validar que todo funciona)
   - Eliminar `bundui-premium/components/layout/` cuando no se usen más

2. **Migrar `ThemeCustomizerPanel`**
   - Actualmente sigue en `bundui-premium/components/panel.tsx`
   - Evaluar si debe migrarse a `@vibethink/ui` o mantenerse en el app

3. **Documentar componentes nuevos**
   - Agregar JSDoc a todos los componentes migrados
   - Crear ejemplos de uso en Storybook (si aplica)

## 📚 Referencias

- `packages/ui/src/components/layout/` - Componentes migrados
- `apps/dashboard/src/shared/data/bundui-nav-items.ts` - Datos centralizados
- `docs/architecture/SHADCN_MONOREPO_COMPLIANCE.md` - Estándares de monorepo
- `docs/architecture/DASHBOARD_ARCHITECTURE.md` - Arquitectura de dashboards

## ✅ Checklist de Migración

- [x] Crear estructura de layout en `@vibethink/ui`
- [x] Migrar componentes de layout
- [x] Migrar hooks (`useIsMobile`, `useIsTablet`)
- [x] Centralizar datos (`bundui-nav-items.ts`)
- [x] Actualizar exports en `packages/ui/src/index.ts`
- [x] Actualizar imports en layouts principales
- [x] Actualizar componentes legacy para usar datos centralizados
- [x] Crear documentación de migración
- [ ] Validar que todo funciona correctamente
- [ ] Eliminar componentes legacy (después de validación)

---

**Última actualización:** 2025-12-19
**Estado:** ✅ Migración completada - En validación






