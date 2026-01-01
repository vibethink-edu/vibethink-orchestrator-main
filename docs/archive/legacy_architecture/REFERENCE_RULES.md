# 🚨 REGLAS CRÍTICAS: Referencias NO se Modifican

## 🎯 **FILOSOFÍA DE ARQUITECTURA**

### **Referencias Actualizables vs Monorepo Estable**

**PRINCIPIO CLAVE: Las referencias externas pueden actualizarse (por sus autores), pero nuestro monorepo permanece estable e independiente.**

```
Referencias Externas (Actualizables)          Nuestro Monorepo (Estable)
─────────────────────────────────           ──────────────────────────────
Bundui Original (puede cambiar)       ───►  apps/dashboard-bundui/ (nuestro espejo)
Shadcn UI Reference (puede cambiar)   ───►  packages/ui/ (nuestros componentes)
XYFlow Reference (puede cambiar)      ───►  apps/dashboard/... (nuestros flows)
```

**Características:**

| Aspecto | Referencias Externas | Nuestro Monorepo |
|---------|---------------------|------------------|
| **Modificable** | ❌ NO (solo por autores originales) | ✅ SÍ (controlamos 100%) |
| **Se actualiza** | ✅ SÍ (autores pueden actualizar) | ❌ NO (solo nosotros) |
| **Nos afecta** | ❌ NO (independientes) | ✅ SÍ (es producción) |
| **Sincronización** | Manual y opcional | N/A |
| **Propósito** | Referencia e inspiración | Producción estable |

**⚠️ REGLA UNIVERSAL:**
- **NO importa si está dentro o fuera del monorepo**
- **NO importa el tipo de referencia (Bundui, Shadcn, ReactFlow, etc.)**
- **Si tiene `-reference` en nombre/path o está documentado como "reference" → ❌ NO MODIFICAR**

---

## ⚠️ **PRINCIPIO FUNDAMENTAL**

**TODO LO QUE SEA REFERENCIA NUNCA DEBE SER MODIFICADO**

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

## 🔄 **Sincronización de Referencias (Opcional)**

### ¿Qué pasa cuando una referencia se actualiza?

**Escenario:**
- Bundui Original recibe actualización → Nueva versión v2.0
- Shadcn UI Reference actualiza componentes → Nuevos componentes disponibles
- XYFlow Reference mejora API → Nuevas features

**Respuesta:**
✅ **Nuestro monorepo NO se rompe** (es independiente)
✅ **Podemos OPTAR por sincronizar** mejoras (manual)
❌ **NO hay sincronización automática** (por diseño)

### Workflow de Sincronización Manual:

1. **Detectar actualización en referencia:**
   ```bash
   # Comparar versiones
   node scripts/compare-bundui-reference-vs-monorepo.js
   ```

2. **Revisar cambios:**
   ```bash
   # Ver qué cambió en la referencia
   cd "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
   git log --oneline -10
   ```

3. **Evaluar si queremos esos cambios:**
   - ¿Es una mejora útil?
   - ¿Es compatible con nuestro monorepo?
   - ¿Vale la pena el esfuerzo?

4. **Si decidimos sincronizar:**
   ```bash
   # Crear rama para sincronización
   git checkout -b sync-bundui-v2.0
   
   # Copiar cambios manualmente al monorepo
   # (NO copiar automáticamente - revisar cada cambio)
   
   # Probar que funciona
   npm run dev:dashboard
   
   # Commit si funciona
   git add .
   git commit -m "sync: Bundui v2.0 - [descripción de cambios]"
   ```

5. **Documentar sincronización:**
   ```markdown
   # CHANGELOG.md
   ## [X.Y.Z] - YYYY-MM-DD
   ### Changed
   - Sincronizado con Bundui Reference v2.0
   - Mejoras: [lista de mejoras]
   - Cambios manuales: [ajustes necesarios]
   ```

### 🚨 **IMPORTANTE:**
- **Sincronización es OPCIONAL** (no obligatoria)
- **Sincronización es MANUAL** (no automática)
- **Evaluamos cada cambio** (no todo se sincroniza)
- **Nuestro monorepo mantiene control** (podemos rechazar cambios)

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

