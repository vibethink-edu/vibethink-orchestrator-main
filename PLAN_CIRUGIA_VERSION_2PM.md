# 🔧 Plan de Cirugía: Versión 2PM con Fixes de 6AM

## 🎯 Objetivo

Restaurar a la versión problemática (1929140 - 2:14 PM) y aplicar fixes selectivos usando la versión estable (64939c2 - 6:32 AM) como referencia.

**Estrategia:** Mantener las features nuevas (módulos V2, etc.) pero eliminar los problemas críticos.

## 🎯 Causa Raíz Identificada

**El problema comenzó cuando se intentó hacer que el logo colapsado funcionara igual que en dashboard-bundui.**

**Error crítico cometido:**
- Se removió `asChild` prop del `SidebarMenuButton` en `vibethink-sidebar.tsx`
- Esto causa el error de React children que rompió todo

**Solución:** Restaurar `asChild` y usar la misma técnica CSS que funciona en bundui (`group-data-[collapsible=icon]:hidden`).

---

## 📋 Checklist de Cirugía

### Fase 1: Preparación ✅

- [ ] Backup del estado actual (ya estás en 64939c2)
- [ ] Resetear a commit problemático 1929140
- [ ] Verificar estado antes de cirugía

### Fase 2: Limpieza de Archivos Problemáticos 🔴

- [ ] Eliminar `tsc_output.txt`
- [ ] Eliminar `tsc_output_2.txt`
- [ ] Eliminar `tsc_output_3.txt`
- [ ] Eliminar carpeta completa `packages/ui/node_modules_bak/`

### Fase 3: Restaurar Código Crítico desde 64939c2 🟠

#### 3.1. AppSidebar - Restaurar useEffect
**Archivo:** `packages/ui/src/components/layout/app-sidebar.tsx`
**Problema:** Se removió useEffect importante para tablets
**Fix:** Restaurar desde 64939c2

#### 3.2. VibeThink Sidebar - Fix del Logo Colapsado ⭐ CRÍTICO
**Archivo:** `apps/dashboard/src/components/vibethink-sidebar.tsx`
**Causa raíz:** Se intentó hacer el logo colapsado igual que bundui pero se removió `asChild` (causa React children error)
**Problemas:**
- ❌ Se removió `asChild` prop → Error React children
- ❌ Se perdió `group-data-[collapsible=icon]:hidden` → Texto no se oculta
- ❌ Link cambiado a ruta fija → Perdió flexibilidad
- ❌ Se perdió sectionTitle dinámico

**Fix:** Restaurar `asChild` + usar técnica CSS de bundui (ver ANÁLISIS_PROBLEMA_LOGO_COLAPSADO.md)

**Código correcto:**
```typescript
<SidebarMenuButton 
  size="lg" 
  asChild  // ← CRÍTICO: Restaurar esto
  className="hover:text-foreground hover:bg-[var(--primary)]/5"
>
  <Link 
    href={isVibeThinkRoute ? "/dashboard-vibethink" : "/dashboard-bundui"} 
    className="flex items-center gap-2"
  >
    <Logo />
    <span className="font-semibold group-data-[collapsible=icon]:hidden">
      VibeThink
    </span>
    {sectionTitle && (
      <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        {sectionTitle}
      </span>
    )}
  </Link>
</SidebarMenuButton>
```

#### 3.3. Bundui Nav Items - Restaurar sección "Migrados"
**Archivo:** `apps/dashboard/src/shared/data/bundui-nav-items.ts`
**Problema:** Se eliminó sección completa "Migrados" (15 rutas perdidas)
**Fix:** Restaurar sección desde 64939c2

### Fase 4: Revisar Cambios de Cookies 🟡

**Archivo:** `packages/ui/src/components/sidebar.tsx`
**Decision:** Revisar si los cambios de cookies son necesarios o causan problemas
- Si causan problemas → Revertir a versión de 64939c2
- Si son necesarios → Mantener pero mejorar validación SSR

### Fase 5: Verificación ✅

- [ ] Ejecutar `npm run build` (verificar que compila)
- [ ] Ejecutar `npm run dev` (verificar que corre)
- [ ] Probar funcionalidad crítica (sidebar, navegación)
- [ ] Verificar que no hay errores de React children

---

## 🎯 Fixes Específicos a Aplicar

### Fix #1: Restaurar useEffect en AppSidebar

**De:** `64939c2:packages/ui/src/components/layout/app-sidebar.tsx`

```typescript
useEffect(() => {
  setOpen(!isTablet);
}, [isTablet, setOpen]);
```

### Fix #2: Restaurar Logo Colapsado en VibeThink Sidebar ⭐

**Archivo:** `apps/dashboard/src/components/vibethink-sidebar.tsx`

**Cambios necesarios:**
1. Restaurar `asChild` prop (CRÍTICO - evita error React children)
2. Agregar `group-data-[collapsible=icon]:hidden` al texto (igual que bundui)
3. Restaurar Link dinámico basado en `isVibeThinkRoute`
4. Restaurar `sectionTitle` dinámico

**Ver:** `ANALISIS_PROBLEMA_LOGO_COLAPSADO.md` para detalles completos

### Fix #3: Restaurar sección "Migrados"

**De:** `64939c2:apps/dashboard/src/shared/data/bundui-nav-items.ts`

Restaurar objeto completo:
```typescript
{
  title: "Migrados",
  items: [
    { title: "AI Chat", href: "/dashboard-vibethink/ai-chat", ... },
    // ... todos los items
  ]
}
```

---

## ⚠️ Advertencias

1. **No restaurar TODO desde 64939c2** - Solo los fixes específicos
2. **Mantener features nuevas** de 1929140 (módulos V2, etc.)
3. **Hacer cambios incrementales** - Un fix a la vez y verificar
4. **Backup antes de cada cambio crítico**

---

## 📝 Comandos para Ejecutar

```bash
# 1. Resetear a versión problemática
git reset --hard 1929140

# 2. Eliminar archivos problemáticos
git rm tsc_output*.txt
git rm -r packages/ui/node_modules_bak/

# 3. Restaurar código específico desde 64939c2
git checkout 64939c2 -- packages/ui/src/components/layout/app-sidebar.tsx
git checkout 64939c2 -- apps/dashboard/src/components/vibethink-sidebar.tsx
git checkout 64939c2 -- apps/dashboard/src/shared/data/bundui-nav-items.ts

# 4. Verificar
npm run build
npm run dev
```

---

## 🔄 Plan Alternativo (Más Seguro)

Si quieres ser más conservador:

1. Crear nueva rama desde 1929140
2. Aplicar fixes uno por uno
3. Probar después de cada fix
4. Merge solo cuando todo funcione

```bash
# Crear rama de cirugía
git checkout 1929140
git checkout -b fix/restore-critical-code-from-0632
```

---

**Recomendación:** Usar el Plan Alternativo (rama nueva) para mayor seguridad.

