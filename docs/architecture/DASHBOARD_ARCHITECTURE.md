# 🏗️ Arquitectura de Dashboards - Reglas Críticas

**Última actualización**: 2025-12-18  
**Estado**: ⚠️ CRÍTICO - NUNCA VIOLAR ESTAS REGLAS

---

## 🚨 Regla de Oro: Independencia Total

**NO habrá sidebars compartidos NUNCA.**

Cada sistema de dashboards es completamente independiente y autónomo.

---

## 📊 Sistemas de Dashboards

### 1. `/dashboard-bundui` - Espejo Monorepo

**Propósito**: Versión monorepo de Bundui Premium (espejo fiel del original)

**Características**:
- ✅ Sidebar propio: `AppSidebar` (de Bundui Premium)
- ✅ Layout propio: `dashboard-bundui/layout.tsx`
- ✅ Rutas: SIEMPRE `/dashboard-bundui/*`
- ❌ Modificación: NO (o mínimo necesario)
- ✅ Stack: Shadcn UI first

**Objetivo**: Mantener un espejo fiel de Bundui Premium para referencia y comparación.

**Reglas**:
- Solo mostrar dashboards que existen en `apps/dashboard/app/dashboard-bundui/`
- Mantener estructura 1:1 con Bundui Premium
- Modificar solo para adaptaciones al monorepo

---

### 2. `/dashboard-vibethink` - Mejoras y Extensiones

**Propósito**: Mejoras o extensiones de dashboards con personalizaciones VibeThink

**Características**:
- ✅ Sidebar propio: `VibeThinkSidebar`
- ✅ Layout propio: `dashboard-vibethink/layout.tsx`
- ✅ Rutas: SIEMPRE `/dashboard-vibethink/*`
- ✅ Modificación: SÍ (total libertad)
- ✅ Stack: Shadcn UI first

**Objetivo**: Crear versiones mejoradas o extendidas de dashboards, con libertad total de personalización.

**Reglas**:
- Solo mostrar dashboards que existen en `apps/dashboard/app/dashboard-vibethink/`
- Puede ser igual o mejor que `dashboard-bundui`
- Libertad total para innovar y mejorar

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

| Sistema | Objetivo | Modificable |
|---------|----------|-------------|
| `dashboard-bundui` | Espejo de referencia | ❌ NO (o mínimo) |
| `dashboard-vibethink` | Mejoras y extensiones | ✅ SÍ (total libertad) |

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

**Última actualización**: 2025-12-18  
**Aprobado por**: Usuario  
**Criticidad**: ⚠️ MÁXIMA


