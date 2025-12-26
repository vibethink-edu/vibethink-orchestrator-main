# 🔍 Proceso de Validación con Dev-Kit

**Última actualización**: 2025-12-18  
**Estado**: ⚠️ OBLIGATORIO  
**Criticidad**: MÁXIMA

---

## 🎯 Regla Fundamental

**SIEMPRE ir a `_vibethink-dev-kit` para validar generalidades ANTES de hacer cambios.**

---

## 📋 ¿Qué es el Dev-Kit?

`_vibethink-dev-kit` es el repositorio central que contiene:

- **Reglas universales** para todos los proyectos VibeThink
- **Herramientas compartidas** (módulos PowerShell, scripts, etc.)
- **Estándares técnicos** (puertos, arquitectura, convenciones)
- **Documentación global** (guías, políticas, mejores prácticas)

**Ubicación**: `C:\IA Marcelo Labs\_vibethink-dev-kit`

---

## 🔄 Jerarquía de Documentación

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Dev-Kit (Universal - Todos los proyectos)               │
│    _vibethink-dev-kit/knowledge/                            │
│    ↓                                                        │
│ 2. AGENTS.md (Proyecto específico)                         │
│    vibethink-orchestrator-main/AGENTS.md                   │
│    ↓                                                        │
│ 3. Implementación (Código)                                 │
│    vibethink-orchestrator-main/apps/                       │
└─────────────────────────────────────────────────────────────┘
```

**Regla**: Si hay conflicto, el Dev-Kit tiene prioridad.

---

## 📚 Estructura del Dev-Kit

### 1. Knowledge Base (`knowledge/`)

```
_vibethink-dev-kit/knowledge/
├── ai-agents/
│   ├── AGENTS_UNIVERSAL.md          ← Reglas universales para AI agents
│   └── CURSOR_RULES_TEMPLATE.md     ← Template de .cursorrules
├── engineering-standards/
│   ├── PORT_MANAGEMENT_STANDARD.md  ← Estándar de gestión de puertos
│   ├── ARCHITECTURE_PATTERNS.md     ← Patrones arquitectónicos
│   └── CODE_STANDARDS.md            ← Estándares de código
├── guides/
│   ├── PORT_MANAGER_INTEGRATION.md  ← Cómo usar PortManager
│   └── MONOREPO_SETUP.md            ← Setup de monorepo
├── PORT_ASSIGNMENT_GLOBAL.md        ← 🔥 CRÍTICO: Asignación global de puertos
└── README.md                        ← Índice del dev-kit
```

### 2. Tools (`packages/tools/`)

```
_vibethink-dev-kit/packages/tools/
├── powershell-modules/
│   ├── PortManager/
│   │   └── PortManager.psm1         ← Módulo de gestión de puertos
│   └── ProjectManager/
│       └── ProjectManager.psm1      ← Módulo de gestión de proyectos
└── scripts/
    ├── setup-project.ps1            ← Setup inicial de proyectos
    └── validate-structure.ps1       ← Validación de estructura
```

---

## ✅ Checklist: Antes de Hacer Cambios

### 1. Cambios de Arquitectura

- [ ] Leer `knowledge/engineering-standards/ARCHITECTURE_PATTERNS.md`
- [ ] Verificar que el patrón propuesto es compatible
- [ ] Consultar con `AGENTS_UNIVERSAL.md`

### 2. Cambios de Puertos

- [ ] Leer `knowledge/PORT_ASSIGNMENT_GLOBAL.md`
- [ ] Verificar puerto asignado globalmente
- [ ] Usar `PortManager` Module si está disponible
- [ ] Documentar en `docs/operations/PORT_CONVENTIONS.md`

### 3. Nuevas Dependencias

- [ ] Verificar en `knowledge/engineering-standards/STACK_COMPATIBILITY.md`
- [ ] Consultar versiones compatibles
- [ ] Validar con `AGENTS.md` del proyecto

### 4. Nuevos Scripts

- [ ] Buscar scripts similares en `_vibethink-dev-kit/packages/tools/scripts/`
- [ ] Reutilizar lógica existente
- [ ] Seguir convenciones de nomenclatura
- [ ] Usar módulos compartidos (PortManager, etc.)

### 5. Documentación

- [ ] Verificar si existe documentación global similar
- [ ] Evitar duplicar información del Dev-Kit
- [ ] Referenciar docs del Dev-Kit en lugar de copiar

---

## 🔍 Casos de Uso Comunes

### Caso 1: Agregar Nueva Referencia Externa

**Pregunta**: ¿Dónde asigno el puerto para una nueva referencia?

**Proceso**:
1. ✅ Abrir `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`
2. ✅ Verificar rango 3050-3099 (Referencias)
3. ✅ Buscar primer puerto disponible
4. ✅ Asignar puerto en Dev-Kit (actualizar documento global)
5. ✅ Documentar en proyecto local (`PORT_CONVENTIONS.md`)

---

### Caso 2: Crear Nuevo Script de Inicio

**Pregunta**: ¿Cómo manejo los puertos en el script?

**Proceso**:
1. ✅ Leer `_vibethink-dev-kit/knowledge/guides/PORT_MANAGER_INTEGRATION.md`
2. ✅ Importar `PortManager` Module
3. ✅ Usar `Get-ReferencePort` en lugar de hardcodear
4. ✅ Implementar fallback documentado

**Ejemplo**:
```powershell
# ✅ CORRECTO (usa Dev-Kit)
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"
Import-Module $PortManagerPath -Force
$PORT = Get-ReferencePort -ReferenceName "bundui"

# ❌ INCORRECTO (hardcoded)
$PORT = 3050
```

---

### Caso 3: Definir Reglas de Arquitectura

**Pregunta**: ¿Puedo crear un nuevo patrón arquitectónico?

**Proceso**:
1. ✅ Consultar `_vibethink-dev-kit/knowledge/engineering-standards/ARCHITECTURE_PATTERNS.md`
2. ✅ Verificar si existe patrón similar
3. ✅ Si es nuevo y universal → Proponer en Dev-Kit
4. ✅ Si es específico del proyecto → Documentar en `AGENTS.md`

---

### Caso 4: Agregar Regla para AI Agents

**Pregunta**: ¿Dónde pongo una regla nueva para AI agents?

**Decisión**:
- ✅ **Universal** (aplica a TODOS los proyectos) → `_vibethink-dev-kit/knowledge/ai-agents/AGENTS_UNIVERSAL.md`
- ✅ **Específica** (solo este proyecto) → `vibethink-orchestrator-main/AGENTS.md`

---

## 📊 Tabla de Decisiones Rápidas

| Pregunta | Dónde Buscar | Acción |
|----------|--------------|--------|
| ¿Qué puerto usar? | `PORT_ASSIGNMENT_GLOBAL.md` | Consultar tabla global |
| ¿Cómo usar PortManager? | `guides/PORT_MANAGER_INTEGRATION.md` | Seguir guía |
| ¿Patrón arquitectónico válido? | `engineering-standards/ARCHITECTURE_PATTERNS.md` | Validar patrón |
| ¿Dependencia compatible? | `STACK_COMPATIBILITY.md` (local) | Verificar versiones |
| ¿Regla universal? | `ai-agents/AGENTS_UNIVERSAL.md` | Leer reglas |
| ¿Script similar existe? | `packages/tools/scripts/` | Reutilizar código |

---

## 🚨 Errores Comunes

### ❌ Error 1: Hardcodear Puertos

**Incorrecto**:
```powershell
$PORT = 3000
npm run dev -- -p $PORT
```

**Correcto**:
```powershell
$PORT = Get-ReferencePort -ReferenceName "bundui"
npm run dev -- -p $PORT
```

---

### ❌ Error 2: Duplicar Documentación del Dev-Kit

**Incorrecto**:
- Copiar todo `PORT_ASSIGNMENT_GLOBAL.md` a proyecto local

**Correcto**:
- Referenciar Dev-Kit: "Ver `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`"
- Documentar solo lo específico del proyecto local

---

### ❌ Error 3: No Consultar AGENTS_UNIVERSAL.md

**Incorrecto**:
- Crear regla específica del proyecto que contradice regla universal

**Correcto**:
- Leer `AGENTS_UNIVERSAL.md` primero
- Heredar y extender (no contradecir)

---

## 🔄 Workflow Recomendado

### Para AI Agents

Antes de implementar CUALQUIER cambio significativo:

```
┌─────────────────────────────────────────────────────────┐
│ 1. CONSULTAR DEV-KIT                                    │
│    - ¿Existe regla universal?                           │
│    - ¿Existe herramienta compartida?                    │
│    - ¿Existe documentación global?                      │
├─────────────────────────────────────────────────────────┤
│ 2. CONSULTAR AGENTS.MD (PROYECTO)                       │
│    - ¿Existe regla específica?                          │
│    - ¿Hay conflicto con Dev-Kit?                        │
├─────────────────────────────────────────────────────────┤
│ 3. IMPLEMENTAR                                          │
│    - Usar herramientas del Dev-Kit                      │
│    - Seguir patrones globales                           │
│    - Documentar cambios locales                         │
├─────────────────────────────────────────────────────────┤
│ 4. ACTUALIZAR DOCUMENTACIÓN                             │
│    - Si es universal → Sugerir actualizar Dev-Kit       │
│    - Si es local → Actualizar AGENTS.md                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Comandos Útiles

### Listar Estructura del Dev-Kit
```powershell
Get-ChildItem "C:\IA Marcelo Labs\_vibethink-dev-kit\knowledge" -Recurse -File | 
    Select-Object FullName | 
    Format-Table -AutoSize
```

### Buscar en Dev-Kit
```powershell
# Buscar "PORT" en todos los docs
Get-ChildItem "C:\IA Marcelo Labs\_vibethink-dev-kit\knowledge" -Recurse -Filter "*.md" | 
    Select-String -Pattern "PORT" | 
    Select-Object Path, LineNumber, Line
```

### Verificar PortManager
```powershell
$PortManagerPath = "C:\IA Marcelo Labs\_vibethink-dev-kit\packages\tools\powershell-modules\PortManager\PortManager.psm1"
Test-Path $PortManagerPath
```

---

## 📚 Referencias

### En Dev-Kit
- `knowledge/README.md` - Índice completo
- `knowledge/ai-agents/AGENTS_UNIVERSAL.md` - Reglas universales
- `knowledge/PORT_ASSIGNMENT_GLOBAL.md` - Puertos globales
- `packages/tools/` - Herramientas compartidas

### En Proyecto
- `AGENTS.md` - Reglas específicas del proyecto
- `docs/operations/PORT_CONVENTIONS.md` - Puertos locales
- `docs/architecture/` - Arquitectura del proyecto

---

## ✅ Resumen

**Regla de Oro**: 
> Antes de hacer CUALQUIER cambio importante, pregúntate:
> **"¿Hay algo en `_vibethink-dev-kit` que deba consultar primero?"**

**Respuesta**: Casi siempre es **SÍ**.

---

**Última actualización**: 2025-12-18  
**Responsable**: Mantener sincronización con Dev-Kit  
**Criticidad**: ⚠️ MÁXIMA - No ignorar este proceso














