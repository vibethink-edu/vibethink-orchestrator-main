# Estado Actual: bundui-premium → @vibethink/ui

## 🚨 IMPORTANTE: bundui-premium está DEPRECATED

**Fecha de migración:** 2025-12-19  
**Estado:** ✅ **COMPLETAMENTE MIGRADO a `@vibethink/ui`**

---

## 📋 Resumen Ejecutivo

### ❌ NO EXISTE "bundui-premium" como paquete activo

**Confusión común:**
- ❌ "bundui-premium" NO es un paquete npm
- ❌ "bundui-premium" NO es una librería separada
- ❌ "bundui-premium" NO se usa en producción

**Realidad:**
- ✅ Los componentes estaban en `apps/dashboard/src/shared/components/bundui-premium/`
- ✅ **TODOS han sido migrados a `@vibethink/ui`**
- ✅ `bundui-premium/` ahora es solo código legacy (deprecated)

---

## 🎯 Arquitectura Actual

### Antes (DEPRECATED)

```
apps/dashboard/src/shared/components/bundui-premium/
├── components/
│   ├── layout/
│   │   ├── sidebar-bundui/
│   │   │   ├── app-sidebar.tsx      ❌ DEPRECATED
│   │   │   ├── nav-main.tsx         ❌ DEPRECATED
│   │   │   └── nav-user.tsx         ❌ DEPRECATED
│   │   └── header-bundui/
│   │       ├── notifications.tsx    ❌ DEPRECATED
│   │       ├── search.tsx           ❌ DEPRECATED
│   │       └── theme-switch.tsx     ❌ DEPRECATED
```

### Ahora (ACTUAL)

```
packages/ui/src/
├── components/
│   └── layout/
│       ├── app-sidebar.tsx          ✅ @vibethink/ui
│       ├── site-header.tsx          ✅ @vibethink/ui
│       ├── nav-main.tsx             ✅ @vibethink/ui
│       ├── nav-user.tsx             ✅ @vibethink/ui
│       ├── notifications.tsx         ✅ @vibethink/ui
│       ├── search.tsx               ✅ @vibethink/ui
│       └── theme-switch.tsx         ✅ @vibethink/ui
└── hooks/
    └── use-mobile.ts                ✅ @vibethink/ui
```

---

## 📦 Qué es cada cosa

### 1. Bundui Original (Externo - Referencia)

```
C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard/
```

- **Propósito:** Referencia externa del proveedor Bundui
- **Estado:** ❌ NO MODIFICAR (solo lectura)
- **i18n:** ❌ NO (solo inglés hardcoded)
- **Uso:** Consulta y comparación

### 2. @vibethink/ui (Monorepo - Producción)

```
packages/ui/
```

- **Propósito:** Librería UI principal de VibeThink
- **Estado:** ✅ ACTIVO (usar siempre)
- **i18n:** ✅ SÍ (multidioma)
- **Uso:** Todos los componentes de layout

### 3. bundui-premium/ (Legacy - Deprecated)

```
apps/dashboard/src/shared/components/bundui-premium/
```

- **Propósito:** Código legacy (mantener solo para compatibilidad)
- **Estado:** ⚠️ DEPRECATED (NO crear nuevos componentes aquí)
- **i18n:** ❌ NO (solo inglés)
- **Uso:** Solo para compatibilidad temporal

---

## 🔄 Flujo de Componentes

```
┌─────────────────────────────────────┐
│  Bundui Original (Externo)          │
│  C:\IA Marcelo Labs\bundui\...      │
│  ❌ NO MODIFICAR                    │
│  📖 Solo consulta                   │
└──────────────┬──────────────────────┘
               │ Inspiración
               ↓
┌─────────────────────────────────────┐
│  @vibethink/ui (Monorepo)          │
│  packages/ui/                       │
│  ✅ USAR SIEMPRE                    │
│  🌍 Con i18n                       │
│  📦 Producción                      │
└─────────────────────────────────────┘
               ↑
               │ Migración completada
               │
┌─────────────────────────────────────┐
│  bundui-premium/ (Legacy)          │
│  apps/dashboard/.../bundui-premium/│
│  ⚠️ DEPRECATED                     │
│  ❌ NO crear nuevos                │
│  🗑️ Eliminar eventualmente        │
└─────────────────────────────────────┘
```

---

## ✅ Reglas Claras

### 1. Para Nuevos Componentes

```typescript
// ✅ CORRECTO - Usar @vibethink/ui
import { AppSidebar, SiteHeader } from '@vibethink/ui';

// ❌ INCORRECTO - NO usar bundui-premium
import { AppSidebar } from "@/shared/components/bundui-premium/...";
```

### 2. Para Hooks

```typescript
// ✅ CORRECTO - Usar @vibethink/ui
import { useIsMobile, useIsTablet } from '@vibethink/ui';

// ❌ INCORRECTO - NO usar hooks locales
import { useIsMobile } from "@/hooks/use-mobile";
```

### 3. Para Datos

```typescript
// ✅ CORRECTO - Usar datos centralizados
import { bunduiNavItems } from '@/shared/data/bundui-nav-items';

// ❌ INCORRECTO - NO duplicar datos
const navItems = [...]; // NO hacer esto
```

---

## 🚫 Qué NO hacer

1. **❌ NO crear nuevos componentes en `bundui-premium/`**
   - Todos los nuevos componentes van a `@vibethink/ui`

2. **❌ NO importar de `bundui-premium/` en código nuevo**
   - Usar siempre `@vibethink/ui`

3. **❌ NO confundir `bundui-premium/` con Bundui Original**
   - `bundui-premium/` = código legacy deprecated
   - Bundui Original = referencia externa

4. **❌ NO pensar que `bundui-premium` es un paquete npm**
   - No existe como paquete
   - Es solo código legacy en el monorepo

---

## 📚 Referencias

- `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md` - Detalles de la migración
- `docs/architecture/BUNDUI_REFERENCE_RULE.md` - Reglas de referencias
- `docs/architecture/BUNDUI_UPDATE_STRATEGY.md` - Estrategia de actualización
- `AGENTS.md` - Reglas del proyecto

---

**Última actualización:** 2025-12-19  
**Estado:** ✅ Migración completada - bundui-premium deprecated







