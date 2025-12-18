# 🧹 Estado de Limpieza: Bundui-ui

**Fecha:** 2025-01-16  
**Objetivo:** Eliminar bundui-ui y usar solo shadcn/ui

---

## 📊 Estado Actual

### ✅ Completado

1. **next.config.js**
   - ✅ Removido `@vibethink/bundui-ui` de `transpilePackages`
   - ✅ Solo incluye `@vibethink/ui`

2. **Layout Principal**
   - ✅ `app/(dashboard)/layout.tsx` usa `@vibethink/ui/sidebar`
   - ✅ Hooks `use-mobile` actualizados a locales

3. **Componentes Shadcn UI**
   - ✅ 16 componentes implementados en `@vibethink/ui`
   - ✅ 322 usos de `@vibethink/ui` en 150 archivos

4. **Documentación**
   - ✅ AGENTS.md actualizado
   - ✅ Guías de shadcn/ui creadas

---

## ⚠️ Pendiente

### 1. Dependencia en package.json

**Archivo:** `apps/dashboard/package.json`
```json
"@vibethink/bundui-ui": "^0.1.0",  // ❌ Todavía presente
```

**Acción:** Remover esta línea

---

### 2. Imports Activos (89 referencias en 48 archivos)

#### Componentes que Faltan en Shadcn UI

**Componentes necesarios que no están en `@vibethink/ui`:**
- `select` - ❌ Falta
- `form` - ❌ Falta
- `table` - ❌ Falta
- `checkbox` - ❌ Falta
- `textarea` - ❌ Falta
- `label` - ❌ Falta
- `switch` - ❌ Falta
- `radio-group` - ❌ Falta
- `calendar` - ❌ Falta
- `command` - ❌ Falta
- `popover` - ❌ Falta
- `alert` - ❌ Falta
- `slider` - ❌ Falta
- `accordion` - ❌ Falta
- `chart` - ❌ Falta

#### Layouts Específicos de Bundui

**Componentes que requieren reemplazo manual:**
- `DashboardLayout` - Usado en 15+ archivos
- `ProjectCard` - Usado en 1 archivo
- `Logo` - Usado en sidebar
- `ThemeCustomizerPanel` - Usado en header
- `BunduiPremiumDashboard` - Usado en premium page
- `ShadcnDashboardComplete` - Usado en premium page
- `ShadcnStyleDashboard` - Usado en shadcn-dashboard page
- `CustomDateRangePicker` - Usado en default page
- `SystemDebugPanel` - Usado en debug page

---

## 📋 Archivos con Imports de Bundui-ui

### Categorías

1. **Componentes de UI básicos** (requieren agregar a shadcn/ui):
   - `select`, `form`, `table`, `checkbox`, `textarea`, `label`, `switch`, `radio-group`, `calendar`, `command`, `popover`, `alert`, `slider`, `accordion`, `chart`

2. **Layouts específicos** (requieren reemplazo manual):
   - `DashboardLayout` - 15+ archivos
   - `ProjectCard` - 1 archivo
   - `Logo` - 1 archivo
   - `ThemeCustomizerPanel` - 1 archivo

3. **Dashboards completos** (páginas de prueba/demo):
   - `BunduiPremiumDashboard`
   - `ShadcnDashboardComplete`
   - `ShadcnStyleDashboard`
   - `SystemDebugPanel`

---

## 🎯 ¿Listo para Probar?

### ✅ SÍ - Para el Dashboard Principal

**El dashboard principal (`app/pana/dashboard/page.tsx`) está limpio:**
- ✅ Usa solo `@vibethink/ui`
- ✅ No tiene imports de bundui-ui
- ✅ Compila correctamente

**Puedes probar:**
```bash
npm run dev:dashboard
# Visitar: http://localhost:3001/pana/dashboard
```

---

### ⚠️ NO - Para Todas las Páginas

**Todavía hay 48 archivos con imports de bundui-ui:**
- ❌ Páginas de settings (select, form, checkbox, etc.)
- ❌ Páginas de productos (table, form, etc.)
- ❌ Dashboards específicos (DashboardLayout)
- ❌ Páginas de prueba/demo

**Estas páginas fallarán si se intenta eliminar bundui-ui ahora.**

---

## 🔄 Plan de Acción Recomendado

### Fase 1: Agregar Componentes Faltantes (Prioridad Alta)

**Componentes críticos que se usan mucho:**
1. `select` - Usado en 20+ archivos
2. `form` - Usado en 15+ archivos
3. `table` - Usado en 10+ archivos
4. `checkbox` - Usado en 10+ archivos
5. `textarea` - Usado en 8+ archivos
6. `label` - Usado en 8+ archivos
7. `switch` - Usado en 6+ archivos
8. `radio-group` - Usado en 3+ archivos

**Cómo agregar:**
```bash
# Usar el script de actualización
node scripts/update-shadcn.js select form table checkbox textarea label switch radio-group

# O manualmente desde https://ui.shadcn.com
```

---

### Fase 2: Reemplazar Layouts Específicos

**Crear reemplazos en `@vibethink/ui`:**
1. `DashboardLayout` → Crear wrapper con shadcn/ui
2. `ProjectCard` → Usar `Card` de shadcn/ui
3. `Logo` → Componente simple
4. `ThemeCustomizerPanel` → Crear con shadcn/ui

---

### Fase 3: Limpiar Dependencias

**Solo después de Fase 1 y 2:**
1. Remover `@vibethink/bundui-ui` de `package.json`
2. Ejecutar `npm install`
3. Verificar que todo compile

---

## ✅ Conclusión

### ¿Listo para Probar el Dashboard Principal?

**SÍ** ✅
- El dashboard principal (`/pana/dashboard`) está limpio
- Usa solo shadcn/ui
- Funciona correctamente

### ¿Listo para Eliminar Bundui-ui Completamente?

**NO** ⚠️
- Faltan 15 componentes en shadcn/ui
- 48 archivos todavía usan bundui-ui
- Necesita agregar componentes faltantes primero

### Recomendación

1. ✅ **Probar ahora:** Dashboard principal funciona
2. ⚠️ **Agregar componentes faltantes** antes de eliminar bundui-ui
3. ⚠️ **Reemplazar layouts específicos** después
4. ✅ **Eliminar dependencia** al final

---

**Última actualización:** 2025-01-16  
**Estado:** Parcialmente limpio - Dashboard principal listo, resto pendiente







