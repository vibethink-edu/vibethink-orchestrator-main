# 🚨 REGLAS CRÍTICAS: Referencias NO se Modifican

## ⚠️ **PRINCIPIO FUNDAMENTAL**

**TODO LO QUE SEA REFERENCIA NUNCA DEBE SER MODIFICADO**

**⚠️ REGLA UNIVERSAL:**
- **NO importa si está dentro o fuera del monorepo**
- **NO importa el tipo de referencia (Bundui, Shadcn, ReactFlow, etc.)**
- **Si tiene `-reference` en nombre/path o está documentado como "reference" → ❌ NO MODIFICAR**

## 📋 **Definición de "Referencia"**

Un elemento es considerado "referencia" si:
- Está fuera del monorepo `vibethink-orchestrator-main/`
- Tiene `-reference` en su nombre o propósito
- Está documentado como "reference" en scripts o documentación
- Es código original que debe mantenerse intacto para comparación

## ✅ **Reglas de Uso**

### **Referencias son SOLO LECTURA**

**Usos permitidos:**
- ✅ Consulta y lectura
- ✅ Comparación con implementaciones
- ✅ Visualización en servidores de referencia
- ✅ Debugging y validación
- ✅ Copia de código para adaptar en el monorepo

**Usos prohibidos:**
- ❌ Modificación directa
- ❌ Edición de archivos
- ❌ Cambio de configuración
- ❌ Actualización de dependencias (sin aprobación explícita)

## 📍 **Referencias Identificadas**

### 1. Bundui Original (Externo)
- **Ruta**: `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard`
- **Propósito**: Código original de Bundui Premium para referencia
- **Puerto**: 3050 (default)
- **Script**: `scripts/start-bundui-reference.ps1`
- **Espejo modificable**: `apps/dashboard/app/dashboard-bundui/`
- **Documentación completa**: Ver `BUNDUI_REFERENCE_RULE.md`

### 1.1. Bundui Reference (Monorepo)
- **Ruta**: `apps/bundui-reference/`
- **Propósito**: Referencia de Bundui Premium dentro del monorepo para comparación
- **Puerto**: 3004 (default)
- **Script**: `cd apps/bundui-reference && npm run dev -- -p 3004`
- **⚠️ CRÍTICO**: Aunque está dentro del monorepo, es REFERENCIA y NO debe modificarse
- **Espejo modificable**: `apps/dashboard/app/dashboard-bundui/`

### 2. Shadcn UI Reference
- **Ruta**: `C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4`
- **Propósito**: Código original oficial de Shadcn UI para referencia
- **Script de inicio**: `scripts/start-shadcn-reference.ps1`
- **Puerto**: 3051 (default)
- **Estado**: ❌ NUNCA MODIFICAR (referencia externa)

### 3. ReactFlow Reference
- **Ruta**: `C:\IA Marcelo Labs\xyflow\xyflow\examples\react`
- **Propósito**: Código original de ReactFlow/XYFlow para referencia
- **Script de inicio**: `scripts/start-reactflow-reference.ps1`
- **Puerto**: 3052 (default)
- **Estado**: ❌ NUNCA MODIFICAR (referencia externa)

### ⚠️ **TODAS las referencias listadas arriba son NO MODIFICABLES, sin excepción**

---

## 🔧 **Workflow Correcto**

### Cuando necesites trabajar con código de una referencia:

1. **Consulta la referencia** (solo lectura):
   ```bash
   # Ver el código original
   code "C:\IA Marcelo Labs\[referencia]/..."
   ```

2. **Copia/adapta en el monorepo**:
   ```bash
   # Modificar la versión en el monorepo
   code "apps/dashboard/...[espejo]/..."
   ```

3. **NUNCA modifiques la referencia original**

---

## ✅ **Checklist Universal**

**⚠️ REGLA PRINCIPAL: TODO LO QUE SEA REFERENCE (dentro o fuera del monorepo) NO SE MODIFICA**

Antes de modificar cualquier archivo:

- [ ] ¿Tiene `-reference` en nombre/path? → ❌ **NO MODIFICAR** (ej: `apps/bundui-reference/`, `apps/*-reference/`)
- [ ] ¿Es mencionado como "reference" en docs/scripts? → ❌ **NO MODIFICAR**
- [ ] ¿Está fuera del monorepo marcado como referencia? → ❌ **NO MODIFICAR**
- [ ] ¿Está dentro del monorepo pero es referencia? → ❌ **NO MODIFICAR**
- [ ] ¿Está dentro de `vibethink-orchestrator-main/` pero NO es referencia? → ✅ **Puede modificarse**
- [ ] **Si tienes dudas:** → ❓ **Preguntar antes de modificar**

**⚠️ IMPORTANTE**: El hecho de que algo esté dentro del monorepo NO significa que puede modificarse si es REFERENCE. La palabra "reference" en el nombre o propósito es la señal definitiva.

---

## 🎯 **Cuando Identifiques una Nueva Referencia**

1. Documentarla aquí
2. Crear espejo/adaptación en monorepo si es necesario
3. Actualizar scripts y documentación relacionada
4. Informar al equipo

---

**Última actualización**: 2025-12-18  
**Estado**: ✅ REGLA ACTIVA Y VIGENTE

