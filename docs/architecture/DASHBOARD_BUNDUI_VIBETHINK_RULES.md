# 🚨 Reglas Críticas: dashboard-bundui vs dashboard-vibethink

**Última actualización**: 2025-12-18  
**Estado**: ⚠️ CRÍTICO - NO VIOLAR ESTAS REGLAS

---

## 🚨 Regla de Oro

**NO habrá sidebars compartidos NUNCA.**

Cada sistema de dashboards es completamente independiente.

---

## 📋 Resumen Ejecutivo

Este proyecto tiene **DOS sistemas de dashboards** con propósitos diferentes:

1. **`dashboard-bundui`** (monorepo): Espejo de Bundui Premium → **NO MODIFICAR**
   - Sidebar propio: `AppSidebar`
   - Rutas: `/dashboard-bundui/*`
   - Stack: Shadcn UI first

2. **`dashboard-vibethink`**: Mejoras y extensiones → **SÍ MODIFICAR**
   - Sidebar propio: `VibeThinkSidebar`
   - Rutas: `/dashboard-vibethink/*`
   - Stack: Shadcn UI first

---

## 🎯 dashboard-bundui (Monorepo - Espejo)

### ✅ Propósito
- **Espejo fiel** de Bundui Premium original
- Mantiene la estructura y funcionalidad exacta del Bundui de referencia
- Sirve como **base de comparación** y **referencia estable**
- **Es mucho trabajo mantenerlo** - no debe perderse

### ❌ PROHIBIDO Modificar (o Mínimo Necesario)
- **NO** cambiar rutas (deben seguir siendo `/dashboard-bundui/*`)
- **NO** modificar componentes (excepto adaptaciones mínimas para el monorepo)
- **NO** cambiar estructura de archivos
- **NO** personalizar estilos (excepto adaptaciones necesarias para el monorepo)
- **NO** cambiar nombres de dashboards
- **NO** mejorar o "arreglar" cosas (hacerlo en `dashboard-vibethink` en su lugar)

### ⚠️ Razón Crítica
> **"Eso es mucho trabajo para perderlo"**

Si se modifica `dashboard-bundui` innecesariamente, se pierde:
- La capacidad de comparar con el original
- La sincronización con actualizaciones de Bundui Premium
- La referencia estable para desarrollo
- **TODAS las horas de trabajo invertidas en mantener el espejo**

### ✅ Permitido
- Correcciones de imports para el monorepo (`@vibethink/ui` en lugar de imports locales)
- Adaptaciones mínimas necesarias para que funcione en el monorepo
- Correcciones de bugs críticos que impiden el funcionamiento

---

## 🚀 dashboard-vibethink (Personalizaciones)

### ✅ Propósito
- **Personalizaciones especiales** basadas en dashboard-bundui
- Versiones mejoradas o adaptadas para necesidades específicas
- **Pueden ser iguales o mejores** que dashboard-bundui
- **Base para producción** - módulos que se promueven a `/dashboard`

### ✅ Permitido Modificar (Total Libertad)
- ✅ Cambiar rutas (deben apuntar a `/dashboard-vibethink/*`)
- ✅ Modificar componentes completamente
- ✅ Cambiar estructura
- ✅ Personalizar estilos
- ✅ Agregar nuevas features
- ✅ Mejorar UX/UI
- ✅ Copiar y mejorar desde dashboard-bundui

### 📝 Regla de Rutas
**TODAS las rutas en `dashboard-vibethink` deben apuntar a `/dashboard-vibethink/*`**

- ✅ Correcto: `href="/dashboard-vibethink/crm"`
- ❌ Incorrecto: `href="/dashboard-bundui/crm"` (causa confusión)

---

## 🔍 Comparación Rápida

| Aspecto | dashboard-bundui | dashboard-vibethink |
|---------|------------------|---------------------|
| **Propósito** | Espejo de referencia | Personalizaciones |
| **Modificable** | ❌ NO (o mínimo necesario - mucho trabajo mantenerlo) | ✅ SÍ (total libertad) |
| **Rutas** | `/dashboard-bundui/*` | `/dashboard-vibethink/*` |
| **Rutas internas** | Apuntan a `/dashboard-bundui/*` | Apuntan a `/dashboard-vibethink/*` |
| **Cuando modificar** | Solo correcciones críticas | Siempre que se necesite |
| **Riesgo de pérdida** | ⚠️ ALTO (se pierde el espejo) | ✅ BAJO (son personalizaciones) |

---

## 📁 Estructura

```
apps/dashboard/app/
├── dashboard-bundui/          # ← ESPEJO (NO MODIFICAR)
│   ├── default/
│   ├── analytics/
│   ├── ecommerce/
│   └── ... (todos los dashboards de Bundui Premium)
│
└── dashboard-vibethink/       # ← PERSONALIZACIONES (SÍ MODIFICAR)
    ├── crm/                   # Personalizado para VibeThink
    ├── sales/                 # Personalizado para VibeThink
    ├── ecommerce/             # Versión mejorada
    ├── website-analytics/     # Migrado desde bundui
    └── ... (dashboards personalizados)
```

---

## ⚠️ Checklist Antes de Modificar

### Para dashboard-bundui:
- [ ] ¿Es una corrección crítica que impide el funcionamiento?
- [ ] ¿Es una adaptación mínima para el monorepo (imports)?
- [ ] ¿Puede hacerse en dashboard-vibethink en su lugar?
- [ ] ¿Se ha consultado con el equipo antes de modificar?

### Para dashboard-vibethink:
- [ ] ¿Todas las rutas apuntan a `/dashboard-vibethink/*`?
- [ ] ¿Los cambios no afectan dashboard-bundui?
- [ ] ¿Los cambios están documentados?

---

## 🚨 Errores Comunes

### ❌ Error 1: Modificar dashboard-bundui por error
```typescript
// ❌ INCORRECTO: Modificar rutas en dashboard-bundui
// apps/dashboard/app/dashboard-bundui/page.tsx
href: "/dashboard-vibethink/default"  // NO HACER ESTO
```

### ❌ Error 2: Rutas mezcladas en dashboard-vibethink
```typescript
// ❌ INCORRECTO: Rutas que apuntan a dashboard-bundui desde dashboard-vibethink
// apps/dashboard/app/dashboard-vibethink/page.tsx
href: "/dashboard-bundui/crm"  // CAUSA CONFUSIÓN
```

### ✅ Correcto
```typescript
// ✅ CORRECTO: dashboard-vibethink apunta a sus propias rutas
// apps/dashboard/app/dashboard-vibethink/page.tsx
href: "/dashboard-vibethink/crm"  // CORRECTO
```

---

## 📚 Referencias

- `docs/architecture/BUNDUI_REFERENCE_RULE.md` - Reglas generales de referencias
- `docs/architecture/REFERENCE_RULES.md` - Reglas para todos los repositorios de referencia

---

## 🔄 Workflow Recomendado

1. **Para nuevas features/personalizaciones:**
   - Trabajar en `dashboard-vibethink/`
   - Nunca tocar `dashboard-bundui/`

2. **Para correcciones críticas en bundui:**
   - Primero verificar si puede hacerse en `dashboard-vibethink`
   - Si es absolutamente necesario en `dashboard-bundui`, documentar por qué
   - Hacer cambios mínimos

3. **Para comparar o ver el original:**
   - Usar `dashboard-bundui/` como referencia
   - No modificarlo para "mejorarlo" - hacerlo en `dashboard-vibethink`

---

**IMPORTANTE**: Estas reglas están diseñadas para preservar `dashboard-bundui` como espejo estable mientras permitimos total libertad en `dashboard-vibethink` para personalizaciones.

