# 🏗️ Arquitectura de Dashboards - Reglas Críticas

**Última actualización**: 2025-01-XX  
**Estado**: ⚠️ CRÍTICO - NUNCA VIOLAR ESTAS REGLAS

---

## 🎯 Los Tres Dashboards Principales

El sistema tiene **3 dashboards principales**, cada uno con un propósito específico en el flujo de desarrollo:

### 1. `/dashboard` - Producción Final ⭐
- **Ruta:** `app/dashboard/`
- **URL:** `http://localhost:3005/dashboard`
- **Propósito:** Dashboard de producción final donde se integra con base de datos
- **Características:**
  - **Integración con BD:** Módulos reales conectados a base de datos
  - **Módulos publicados:** Login, CRM, etc. (los que se publican)
  - **Meta de desarrollo:** Es el objetivo final de todos los desarrollos
  - **Multidioma:** ✅ Implementado
  - **Layout:** Minimalista (sin sidebar/header)
- **Estado:** ✅ Funcional (en desarrollo - meta final)
- **Flujo:** Aquí llegan los módulos probados desde `dashboard-vibethink`

### 2. `/dashboard-bundui` - Referencia/Inspiración
- **Ruta:** `app/dashboard-bundui/`
- **URL:** `http://localhost:3005/dashboard-bundui`
- **Propósito:** Espejo de Bundui Premium, nuestra inspiración (no monorepo, externo)
- **Características:**
  - Sidebar: `AppSidebar` (Bundui original)
  - Header: `SiteHeader` (sin selector de idioma)
  - Idioma: Solo inglés (hardcoded, sin i18n)
  - Badge: "Bundui Premium"
  - **Fuente de inspiración:** Referencia externa para diseño y funcionalidades
- **Reglas:** ❌ NO modificar (o mínimo necesario), ❌ NO i18n
- **Estado:** ✅ Completo y estable (congelado como referencia)

### 3. `/dashboard-vibethink` - Mockup/Sandbox de Pruebas
- **Ruta:** `app/dashboard-vibethink/`
- **URL:** `http://localhost:3005/dashboard-vibethink`
- **Propósito:** Mockup antes de implementar en producción - donde se prueban interfaces
- **Características:**
  - **NO es producción:** Es sandbox de pruebas y mockups
  - **Se nutre de:** Bundui, React Flow, AI Chat, y otros componentes
  - **Pruebas:** Donde se prueba cómo luce todo antes de integrar con BD
  - Sidebar: `VibeThinkSidebar` (propio e independiente)
  - Header: `VibeThinkHeader` (con selector de idioma)
  - Idioma: Multidioma (inglés/español, extensible)
  - i18n: ✅ OBLIGATORIO desde el inicio
  - Badge: "VibeThink Sandbox"
- **Reglas:** 
  - ✅ Debe seguir TODAS las reglas del proyecto
  - ✅ Debe seguir reglas de `vibethink-dev-kit`
  - ✅ Monorepo compliance
  - ✅ Changelog y versiones
  - ✅ i18n obligatorio
- **Estado:** ✅ Funcional, sandbox activo para pruebas
- **Flujo:** Aquí se prueban módulos antes de migrarlos a `/dashboard` (producción)

---

## 🔄 Flujo de Desarrollo

```
┌─────────────────────────────────┐
│  /dashboard-bundui              │
│  (Referencia/Inspiración)       │
│  - Bundui Premium externo       │
│  - Solo inglés, sin i18n         │
└────────────┬────────────────────┘
             │ Inspiración
             ↓
┌─────────────────────────────────┐
│  /dashboard-vibethink           │
│  (Mockup/Sandbox)               │
│  - Pruebas de interfaces        │
│  - Multidioma (i18n)            │
│  - React Flow, AI Chat, etc.    │
│  - Sin BD (mockups)             │
└────────────┬────────────────────┘
             │ Migración probada
             ↓
┌─────────────────────────────────┐
│  /dashboard                     │
│  (Producción Final) ⭐           │
│  - Integración con BD            │
│  - Módulos publicados            │
│  - Login, CRM, etc.              │
│  - Multidioma                    │
└─────────────────────────────────┘
```

**Nota sobre `/(dashboard)`:**
- `app/(dashboard)/` es un grupo de rutas legacy (Next.js route groups)
- No es un dashboard principal, solo rutas internas antiguas
- Estado: ⚠️ Legacy - Revisar si se mantiene o migra

---

## 🚨 Regla de Oro: Independencia Total

**NO habrá sidebars compartidos NUNCA.**

Cada sistema de dashboards es completamente independiente y autónomo.

---

## 📊 Sistemas de Dashboards (Detalle)

### 1. `/dashboard` - Producción Final ⭐

**Propósito**: Dashboard de producción final con integración a base de datos

**Características**:
- ✅ **Integración BD:** Módulos reales conectados a base de datos
- ✅ **Módulos publicados:** Login, CRM, y otros módulos que se publican
- ✅ **Meta de desarrollo:** Objetivo final de todos los desarrollos
- ✅ **Multidioma:** Implementado
- ✅ Layout: Minimalista (sin sidebar/header)
- ✅ Rutas: `/dashboard/*`

**Objetivo**: Ser el dashboard final donde se despliegan los módulos reales que se conectan con BD y se publican.

**Reglas**:
- Solo módulos probados y listos para producción
- Integración completa con base de datos
- Cumplir con todas las reglas de producción
- Multidioma obligatorio

**Flujo**: Recibe módulos probados desde `dashboard-vibethink`

---

### 2. `/dashboard-bundui` - Referencia/Inspiración

**Propósito**: Espejo de Bundui Premium, nuestra inspiración (no monorepo, externo)

**Características**:
- ✅ Sidebar propio: `AppSidebar` (de Bundui Premium)
- ✅ Layout propio: `dashboard-bundui/layout.tsx`
- ✅ Rutas: SIEMPRE `/dashboard-bundui/*`
- ❌ Modificación: NO (o mínimo necesario)
- ✅ Stack: Shadcn UI first
- ❌ Idioma: Solo inglés (sin i18n)

**Objetivo**: Mantener referencia externa de Bundui Premium para inspiración y comparación.

**Reglas**:
- Solo mostrar dashboards que existen en `apps/dashboard/app/dashboard-bundui/`
- Mantener estructura 1:1 con Bundui Premium
- Modificar solo para adaptaciones al monorepo
- ❌ NO implementar i18n (mantener inglés)

---

### 3. `/dashboard-vibethink` - Mockup/Sandbox de Pruebas

**Propósito**: Mockup antes de implementar en producción - donde se prueban interfaces

**Características**:
- ✅ Sidebar propio: `VibeThinkSidebar`
- ✅ Layout propio: `dashboard-vibethink/layout.tsx`
- ✅ Rutas: SIEMPRE `/dashboard-vibethink/*`
- ✅ Modificación: SÍ (siguiendo reglas del proyecto)
- ✅ Stack: Shadcn UI first
- ✅ Idioma: Multidioma (i18n obligatorio)
- ✅ **Se nutre de:** Bundui, React Flow, AI Chat, y otros componentes
- ❌ **NO integración BD:** Solo mockups y pruebas

**Objetivo**: Sandbox donde se prueban interfaces y cómo luce todo antes de integrar con BD.

**Reglas**:
- ✅ Debe seguir TODAS las reglas del proyecto
- ✅ Debe seguir reglas de `vibethink-dev-kit`
- ✅ Monorepo compliance obligatorio
- ✅ Changelog y versiones obligatorios
- ✅ i18n obligatorio desde el inicio
- Solo mostrar dashboards que existen en `apps/dashboard/app/dashboard-vibethink/`
- Pruebas de interfaces antes de migrar a producción

**Flujo**: Prueba módulos antes de migrarlos a `/dashboard` (producción)

---

## 🚫 Prohibiciones Absolutas

### ❌ NUNCA Compartir Sidebars

**Incorrecto**:
```typescript
// ❌ MAL: Un sidebar para ambos sistemas
export function SharedSidebar() {
  const pathname = usePathname();
  const prefix = pathname.startsWith('/dashboard-vibethink') ? 'vibethink' : 'bundui';
  // ...
}
```

**Correcto**:
```typescript
// ✅ BIEN: Sidebar independiente para cada sistema

// En dashboard-bundui/layout.tsx
<AppSidebar variant="inset" />

// En dashboard-vibethink/layout.tsx
<VibeThinkSidebar variant="inset" />
```

### ❌ NUNCA Mezclar Rutas

**Incorrecto**:
```typescript
// ❌ MAL: Rutas mezcladas en el mismo sidebar
const navItems = [
  { href: "/dashboard-bundui/crm" },
  { href: "/dashboard-vibethink/sales" }, // INCORRECTO
];
```

**Correcto**:
```typescript
// ✅ BIEN: Rutas consistentes por sistema

// AppSidebar (bundui)
const navItems = [
  { href: "/dashboard-bundui/crm" },
  { href: "/dashboard-bundui/sales" },
];

// VibeThinkSidebar
const navItems = [
  { href: "/dashboard-vibethink/crm" },
  { href: "/dashboard-vibethink/sales" },
];
```

---

## ✅ Principios Arquitectónicos

### 1. Independencia Total
Cada sistema tiene:
- Su propio sidebar
- Su propio layout
- Sus propias rutas
- Su propia navegación

### 2. Shadcn UI First
**SIEMPRE** usar Shadcn UI como base:
- Componentes de `@vibethink/ui` (Shadcn adaptado)
- Patrones de Shadcn UI
- Estructura de Shadcn UI

### 3. Objetivos Claros

| Sistema | Objetivo | Modificable | Integración BD |
|---------|----------|-------------|----------------|
| `dashboard` | Producción final | ✅ SÍ | ✅ SÍ (objetivo) |
| `dashboard-bundui` | Referencia/inspiración | ❌ NO (o mínimo) | ❌ NO |
| `dashboard-vibethink` | Mockup/sandbox pruebas | ✅ SÍ (con reglas) | ❌ NO (mockups) |

### 4. Sin Compartir Navegación
- No sidebars compartidos
- No layouts compartidos (excepto componentes base de Shadcn)
- No lógica de routing compartida

---

## 📋 Checklist para Nuevos Dashboards

### Antes de Crear un Dashboard

1. **¿Dónde va?**
   - [ ] ¿Es un espejo de Bundui? → `/dashboard-bundui`
   - [ ] ¿Es una mejora/extensión? → `/dashboard-vibethink`

2. **¿Usa el sidebar correcto?**
   - [ ] Si es bundui → `AppSidebar`
   - [ ] Si es vibethink → `VibeThinkSidebar`

3. **¿Rutas correctas?**
   - [ ] Todas las rutas usan el prefijo correcto
   - [ ] No hay rutas mezcladas

4. **¿Stack correcto?**
   - [ ] Basado en Shadcn UI
   - [ ] Usa `@vibethink/ui` para componentes

### Antes de Modificar Navegación

1. **¿Qué sidebar estás modificando?**
   - [ ] `AppSidebar` (bundui) → Solo dashboards que existen en bundui
   - [ ] `VibeThinkSidebar` → Solo dashboards que existen en vibethink

2. **¿Las rutas son correctas?**
   - [ ] Bundui → `/dashboard-bundui/*`
   - [ ] VibeThink → `/dashboard-vibethink/*`

3. **¿No estás intentando compartir?**
   - [ ] No hay lógica condicional basada en pathname
   - [ ] No hay rutas mixtas
   - [ ] Cada sidebar es independiente

---

## 🔧 Estructura de Archivos

```
apps/dashboard/app/
├── dashboard-bundui/
│   ├── layout.tsx              ← Usa AppSidebar
│   ├── page.tsx                ← Índice de bundui
│   └── [dashboard]/            ← Dashboards individuales
│
└── dashboard-vibethink/
    ├── layout.tsx              ← Usa VibeThinkSidebar
    ├── page.tsx                ← Índice de vibethink
    └── [dashboard]/            ← Dashboards individuales

src/shared/components/
├── bundui-premium/
│   └── components/
│       └── layout/
│           └── sidebar-bundui/ ← AppSidebar (para bundui)
│
└── vibethink-sidebar.tsx       ← VibeThinkSidebar (para vibethink)
```

---

## 🚨 Errores Comunes

### Error 1: Intentar Compartir Sidebar

```typescript
// ❌ INCORRECTO
function UniversalSidebar() {
  const pathname = usePathname();
  // Lógica condicional para decidir qué mostrar
}
```

**Corrección**: Usa sidebars independientes.

### Error 2: Rutas Mezcladas

```typescript
// ❌ INCORRECTO: Sidebar de bundui con rutas de vibethink
const navItems = [
  { title: "CRM", href: "/dashboard-vibethink/crm" }
];
```

**Corrección**: Usa rutas consistentes con el sistema.

### Error 3: Modificar Bundui Innecesariamente

```typescript
// ❌ INCORRECTO: Agregar features nuevas a bundui
// En dashboard-bundui/crm/page.tsx
export default function CRM() {
  // Nueva feature personalizada VibeThink
}
```

**Corrección**: Las features nuevas van en `dashboard-vibethink`.

---

## 📚 Referencias

- `AGENTS.md` - Reglas generales del proyecto
- `docs/architecture/DASHBOARD_BUNDUI_VIBETHINK_RULES.md` - Reglas específicas
- `docs/architecture/REFERENCE_RULES.md` - Reglas de referencias

---

**IMPORTANTE**: Estas reglas garantizan que los sistemas permanezcan independientes, mantenibles y escalables. NUNCA las violes sin consultar primero.

---

**Última actualización**: 2025-01-XX  
**Aprobado por**: Usuario  
**Criticidad**: ⚠️ MÁXIMA




