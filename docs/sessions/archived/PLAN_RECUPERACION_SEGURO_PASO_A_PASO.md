# 🔒 Plan de Recuperación Seguro - Paso a Paso

## 📊 Contexto Completo

### Estado Entre 1-2 PM (FUNCIONANDO ESTABLE)
- ✅ Ajustes de cookies para persistencia aislada por dashboard
- ✅ Cada dashboard tiene su propio sistema de colores y persistencia
- ✅ Varias versiones manteniendo opciones (CRM, etc.)
- ✅ Ajustes en features de Bundui Premium → monorepo
- ✅ Documentación markdown de errores React 18/19 arreglados
- ✅ Uso de "use client" correcto
- ✅ Funcionalidad de proyectos recuperada completamente

### Problema en 2:14 PM
- ❌ Se intentó hacer logo colapsado igual que dashboard-bundui
- ❌ Se removió `asChild` prop → Error React children
- ❌ Se rompió la funcionalidad estable

---

## 🎯 Estrategia: Recuperación Segura en Fases

### Fase 0: Auditoría Completa (ANTES DE TOCAR NADA) 🔍

#### 0.1. Backup del Estado Actual
- [ ] Verificar cambios locales actuales
- [ ] Crear rama de backup: `backup/pre-cirugia-$(date +%Y%m%d)`
- [ ] Commit de estado actual si hay cambios importantes

#### 0.2. Auditoría del Estado Estable (64939c2 - 6:32 AM)
- [ ] Revisar documentación React 19
- [ ] Identificar todos los fixes aplicados
- [ ] Listar features funcionando

#### 0.3. Auditoría del Estado Problemático (1929140 - 2:14 PM)
- [ ] Identificar TODOS los cambios desde 64939c2
- [ ] Categorizar: Features nuevas vs Problemas
- [ ] Documentar qué funciona y qué no

#### 0.4. Identificar Features Valiosas de 1929140
- [ ] Módulos V2 nuevos (ai-chat-v2, crm-v2, crypto-v2, finance-v2, hotel, etc.)
- [ ] Sistema de themes mejorado
- [ ] Componentes de prompt UI
- [ ] Mejoras en documentación

---

### Fase 1: Preparación Segura 🛡️

#### 1.1. Crear Entorno de Trabajo
```bash
# Crear rama de trabajo desde versión problemática
git checkout 1929140
git checkout -b fix/restore-logo-collapsed-from-0632

# Verificar estado
git status
```

#### 1.2. Eliminar Archivos Problemáticos
- [ ] Eliminar `tsc_output*.txt` (todos los archivos)
- [ ] Eliminar `packages/ui/node_modules_bak/` (carpeta completa)

#### 1.3. Verificar Build Inicial
- [ ] `npm run build` - Ver errores actuales
- [ ] Documentar errores encontrados
- [ ] NO arreglar todavía, solo documentar

---

### Fase 2: Fix Crítico del Logo Colapsado ⭐

#### 2.1. Restaurar `asChild` (CRÍTICO)
**Archivo:** `apps/dashboard/src/components/vibethink-sidebar.tsx`

**Cambio:**
```typescript
// ANTES (roto)
<SidebarMenuButton size="lg" className="...">
  <Link href="/dashboard-vibethink/default" className="...">
    <Logo />
    <span>VibeThink Orchestrator</span>
  </Link>
</SidebarMenuButton>

// DESPUÉS (arreglado)
<SidebarMenuButton 
  size="lg" 
  asChild  // ← RESTAURAR ESTO
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
    <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
      {sectionTitle}
    </span>
  </Link>
</SidebarMenuButton>
```

- [ ] Aplicar cambio
- [ ] Verificar que compila: `npm run build`
- [ ] Probar en dev: `npm run dev`
- [ ] Verificar que logo colapsa correctamente

#### 2.2. Restaurar Variables Necesarias
- [ ] Verificar que `isVibeThinkRoute` existe
- [ ] Verificar que `sectionTitle` existe
- [ ] Si no existen, restaurar desde 64939c2

---

### Fase 3: Restaurar Código Crítico Adicional 🔧

#### 3.1. Restaurar useEffect en AppSidebar
**Archivo:** `packages/ui/src/components/layout/app-sidebar.tsx`

**Restaurar desde 64939c2:**
```typescript
useEffect(() => {
  setOpen(!isTablet);
}, [isTablet, setOpen]);
```

- [ ] Verificar si falta
- [ ] Restaurar si es necesario
- [ ] Probar funcionalidad en tablet

#### 3.2. Restaurar Sección "Migrados" del Sidebar
**Archivo:** `apps/dashboard/src/shared/data/bundui-nav-items.ts`

- [ ] Verificar si falta sección "Migrados"
- [ ] Restaurar desde 64939c2 si es necesario
- [ ] Verificar que rutas funcionan

---

### Fase 4: Validación Completa ✅

#### 4.1. Build Validation
- [ ] `npm run build` → Sin errores
- [ ] `npm run dev` → Inicia correctamente
- [ ] Sin warnings críticos de React

#### 4.2. Funcionalidad Crítica
- [ ] Sidebar colapsa/expande correctamente
- [ ] Logo se muestra correctamente (colapsado y expandido)
- [ ] Navegación funciona (rutas accesibles)
- [ ] Cookies funcionan (persistencia aislada por dashboard)
- [ ] Sistema de colores funciona por dashboard

#### 4.3. Features Nuevas (1929140)
- [ ] Módulos V2 funcionan (ai-chat-v2, crm-v2, etc.)
- [ ] Sistema de themes funciona
- [ ] Proyectos funciona (había sido recuperado)

#### 4.4. React 19 Compatibility
- [ ] Sin errores de React children
- [ ] "use client" correcto donde se necesita
- [ ] Sin warnings de React 19

---

### Fase 5: Limpieza Final 🧹

#### 5.1. Remover Archivos Temporales
- [ ] Eliminar archivos de backup si se crearon
- [ ] Limpiar comentarios de debug si se agregaron

#### 5.2. Documentación
- [ ] Actualizar CHANGELOG.md
- [ ] Actualizar TROUBLESHOOTING.md con problema y solución del logo colapsado
- [ ] Actualizar docs/MIGRACION_BUNDUI_MONOREPO_LOG.md con los pasos realizados
- [ ] Documentar fixes aplicados
- [ ] Actualizar documentación React 19 si es necesario

#### 5.3. Commit Final
- [ ] Review completo de cambios
- [ ] Commit descriptivo con todos los fixes
- [ ] Mensaje: "fix: restore logo collapsed functionality and critical fixes from 0632"

---

## 🚨 Checkpoints de Seguridad

### Antes de Cada Fase
- [ ] Backup creado
- [ ] Estado actual documentado
- [ ] Plan claro de qué se va a cambiar

### Después de Cada Fase
- [ ] Verificar que compila
- [ ] Verificar que funciona básico
- [ ] NO continuar si hay errores críticos

### Si Algo Sale Mal
```bash
# Restaurar desde backup
git checkout backup/pre-cirugia-YYYYMMDD
# O
git reset --hard HEAD~1  # Si solo hay 1 commit desde backup
```

---

## 📋 Checklist Pre-Commencement

Antes de empezar, verificar:

- [ ] Estoy en el directorio correcto
- [ ] Git está configurado correctamente
- [ ] Tengo acceso a ambos commits (64939c2 y 1929140)
- [ ] Entiendo el problema (logo colapsado + asChild)
- [ ] Tengo documentación React 19 a mano
- [ ] Sé cómo restaurar si algo sale mal

---

## 🎯 Objetivo Final

**Resultado esperado:**
- ✅ Versión 2:14 PM con todas las features nuevas
- ✅ Logo colapsado funcionando correctamente
- ✅ Sin errores de React children
- ✅ Código crítico restaurado (useEffect, sección Migrados)
- ✅ Build funciona sin errores
- ✅ Funcionalidad estable recuperada

---

## 📝 Notas Importantes

1. **NO apresurarse** - Cada fase debe completarse antes de continuar
2. **Documentar todo** - Si algo funciona o no, documentarlo
3. **Backup frecuente** - Crear commits intermedios si es necesario
4. **Probar después de cada cambio** - No acumular cambios sin probar
5. **Mantener features nuevas** - El objetivo es mantener lo bueno y arreglar lo malo

---

**Creado:** 2025-12-20
**Estado:** Pendiente de ejecución
**Prioridad:** Alta - Fix crítico del logo colapsado

