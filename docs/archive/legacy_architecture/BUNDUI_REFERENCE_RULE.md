# 🚨 REGLA CRÍTICA: Referencias NO se Modifican

## ⚠️ **REGLA GENERAL: TODO LO QUE SEA REFERENCIA NUNCA DEBE SER MODIFICADO**

### 📋 **Principio Fundamental**
**Cualquier directorio, archivo o componente marcado como "referencia" o "reference" es de SOLO LECTURA.**

Las referencias existen para:
- ✅ Consulta y comparación
- ✅ Visualización en servidores de referencia
- ✅ Debugging y validación
- ❌ **NO para modificación**

## 📍 **Referencias Identificadas**

### 1. **Bundui Original (Externo - NO MONOREPO)**
```
C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard
```
**Puerto**: 3050 (default)  
**Script**: `scripts/start-bundui-reference.ps1`  
**Estado**: ❌ NUNCA MODIFICAR (referencia externa)

### 1.1. **Bundui Reference (Monorepo - apps/bundui-reference/)**
```
apps/bundui-reference/
```
**Puerto**: 3004 (default)  
**Script**: `cd apps/bundui-reference && npm run dev -- -p 3004`  
**Estado**: ❌ NUNCA MODIFICAR (aunque esté dentro del monorepo, es REFERENCIA)  
**⚠️ CRÍTICO**: El hecho de estar en el monorepo NO significa que puede modificarse. Es referencia para comparación.

### 2. **Otras Referencias** (Identificar y agregar aquí)

**Patrón de identificación:**
- Directorios con nombre `*-reference`
- Directorios en `_vibethink-dev-kit` marcados como referencia
- Scripts que mencionan "reference" en su propósito

---

## ✅ **Reglas Fundamentales**

### **NUNCA MODIFICAR REFERENCIAS**

Las referencias se usan únicamente para:
- ✅ Referencia visual
- ✅ Comparación de implementaciones
- ✅ Consulta de código original
- ✅ Ejecución en servidores de referencia
- ✅ Debugging y validación

### 🔧 **Dónde Hacer Cambios**

### ✅ **SÍ hacer cambios:**
- **Espejos en el monorepo**: Cualquier directorio dentro de `vibethink-orchestrator-main/`
  - Ejemplo: `apps/dashboard/app/dashboard-bundui/` - Espejo de Bundui (SÍ modificar)
  - Ejemplo: `apps/dashboard/src/shared/components/bundui-premium/` - Componentes adaptados (SÍ modificar)
- **Adaptaciones y mejoras**: Cualquier implementación dentro del monorepo

### ❌ **NO hacer cambios:**
- **Referencias externas**: Cualquier directorio fuera del monorepo marcado como referencia
  - Ejemplo: `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard/` - **ORIGINAL EXTERNO (NUNCA MODIFICAR)**
- **Referencias dentro del monorepo**: Directorios con `-reference` en su nombre
  - Ejemplo: `apps/bundui-reference/` - **REFERENCIA EN MONOREPO (NUNCA MODIFICAR)**
- **Cualquier directorio con `-reference` en su nombre o propósito** (dentro o fuera del monorepo)

---

## 📋 **Razones para NO Modificar el Original**

1. **Es referencia pura**: Necesitamos mantener el código original intacto para comparar implementaciones
2. **Evita conflictos**: El original puede actualizarse desde el repo upstream
3. **Separación de responsabilidades**: El monorepo tiene su propio espejo (`dashboard-bundui`)
4. **Debugging**: Necesitamos poder comparar el original vs nuestras adaptaciones

---

## 🎯 **Workflow Correcto**

### Cuando necesites hacer cambios:

1. **Consulta el original** (solo lectura):
   ```bash
   # Ver cómo está implementado en el original
   code "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard\..."
   ```

2. **Haz cambios en el monorepo**:
   ```bash
   # Modificar el espejo en el monorepo
   code "apps/dashboard/app/dashboard-bundui/..."
   # O componentes adaptados
   code "apps/dashboard/src/shared/components/bundui-premium/..."
   ```

3. **Ejecuta servidor de referencia** (solo para ver):
   ```powershell
   .\scripts\start-bundui-reference.ps1
   # Ver en: http://localhost:3050
   ```

---

## 🔍 **Cómo Identificar el Original vs Monorepo**

### Bundui Original (NO TOCAR):
```
C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard\
├── app/
├── components/
├── package.json
└── ...
```

### Bundui en Monorepo (SÍ SE PUEDE MODIFICAR):
```
C:\IA Marcelo Labs\vibethink-orchestrator-main\
├── apps/
│   └── dashboard/
│       ├── app/
│       │   └── dashboard-bundui/  ← ESPEJO (SÍ modificar)
│       └── src/
│           └── shared/
│               └── components/
│                   └── bundui-premium/  ← Adaptaciones (SÍ modificar)
```

---

## ✅ **Checklist Antes de Modificar Cualquier Archivo**

Antes de editar cualquier archivo:

- [ ] ¿Tiene `-reference` en su nombre/path? → ❌ **NO MODIFICAR** (ej: `apps/bundui-reference/`)
- [ ] ¿Es un directorio marcado como "reference" en scripts o docs? → ❌ **NO MODIFICAR**
- [ ] ¿Es una referencia externa (fuera del monorepo)? → ❌ **NO MODIFICAR**
- [ ] ¿Está dentro de `vibethink-orchestrator-main/` pero es referencia? → ❌ **NO MODIFICAR**

**⚠️ IMPORTANTE**: `apps/bundui-reference/` está dentro del monorepo pero es REFERENCIA. El hecho de estar en el monorepo NO significa que puede modificarse.

**Cuando dudes:** Si no está claro, pregunta antes de modificar.

---

## 📝 **Historial de Incidentes**

### 2025-12-18: Sidebar Routes
- **Error**: Se modificó el sidebar del Bundui original por error
- **Corrección**: Revertido, cambios aplicados solo al monorepo
- **Lección**: Siempre verificar la ruta completa antes de modificar

---

## 📝 **Regla General para Futuras Referencias**

**Cuando identifiques un nuevo elemento como "referencia":**

1. Agrégalo a esta documentación
2. Documenta su propósito
3. Marca claramente que NO debe ser modificado
4. Crea un espejo/adaptación en el monorepo si es necesario

**Formato para agregar nuevas referencias:**
```markdown
### N. **[Nombre de la Referencia]**
```
[Ruta completa]
```
**Propósito:** [Descripción]
**Uso:** [Cómo se usa]
**Espejo/Adaptación:** [Dónde está la versión modificable]
```

---

**Última actualización**: 2025-12-18  
**Estado**: ✅ REGLA ACTIVA  
**Alcance**: TODAS las referencias (no solo Bundui)

