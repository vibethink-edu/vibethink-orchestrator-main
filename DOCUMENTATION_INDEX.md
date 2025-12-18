# 📚 ÍNDICE MAESTRO DE DOCUMENTACIÓN - VibeThink Orchestrator 1.0

> **🎯 FUENTE ÚNICA DE VERDAD PARA AGENTES AI**
> 
> **Última actualización:** 2025-12-17  
> **Versión:** 1.0  
> **Estado:** ✅ Consolidado

---

## 🔥 DOCUMENTACIÓN CRÍTICA (Leer SIEMPRE primero)

### Para Agentes AI

1. **[AGENTS.md](./AGENTS.md)** ⚠️ **OBLIGATORIO**
   - Reglas del proyecto
   - Comandos rápidos
   - Prohibiciones y requerimientos
   - Workflow de desarrollo

2. **[README.md](./README.md)**
   - Visión general del proyecto
   - Stack tecnológico
   - Reglas de estabilidad AI

3. **[CODEX.md](./CODEX.md)**
   - Convenciones de código
   - Estándares de desarrollo

---

## 📋 DOCUMENTACIÓN POR CATEGORÍA

### 🏗️ Arquitectura y Estructura

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| **Arquitectura Monorepo** | `docs/architecture/` | Estructura y organización |
| **Shadcn First Strategy** | `docs/architecture/SHADCN_FIRST_STRATEGY.md` | Estrategia de componentes UI |
| **Mock to CRM Strategy** | `docs/architecture/MOCK_TO_CRM_STRATEGY.md` | Migración de datos mock a CRM |

### 🎨 UI/UX y Componentes

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| **Shadcn UI Guide** | `docs/ui-ux/SHADCN_UI_GUIDE.md` | Guía completa de componentes |
| **Component Registry** | `packages/ui/COMPONENTS_REGISTRY.md` | Componentes disponibles |
| **Implementation Status** | `packages/ui/IMPLEMENTATION_STATUS.md` | Estado de implementación |

### 📊 Dashboards y Referencias

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| **Dashboards Audit** | `docs/references/DASHBOARDS_AUDIT_REPORT.md` | Auditoría de dashboards |
| **Mock Dashboards** | `docs/references/DASHBOARDS_MOCK_REFERENCE.md` | Sistema de dashboards mock |
| **Sidebar Routes Audit** | `docs/references/SIDEBAR_ROUTES_AUDIT.md` | Auditoría de rutas |
| **Reference Architecture** | `docs/references/REFERENCE_ARCHITECTURE.md` | Arquitectura de referencia |

### 🔧 Desarrollo y Operaciones

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| **Operational Runbook** | `docs/operations/OPERATIONAL_RUNBOOK.md` | Guía operativa |
| **Error Prevention** | `docs/operations/ERROR_PREVENTION_PLAYBOOK.md` | Prevención de errores |
| **Port Assignment** | `docs/references/PORT_ASSIGNMENT.md` | Asignación de puertos |

### 📦 Vendors y Referencias Externas

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| **Vendor Comparison** | `docs/references/VENDOR_COMPARISON.md` | Comparación de vendors |
| **Vendor Versions** | `docs/references/VENDOR_VERSIONS.md` | Versiones de vendors |
| **Bundui Reference** | `BUNDUI_REFERENCE_SYSTEM.md` | Sistema de referencia Bundui |

---

## 🗂️ ESTRUCTURA DE DOCUMENTACIÓN

```
docs/
├── architecture/          # Arquitectura y diseño
├── ui-ux/                 # UI/UX y componentes
├── references/             # Referencias y auditorías
├── operations/            # Operaciones y runbooks
├── projects/              # Documentación de proyectos específicos
└── integrations/          # Integraciones externas
```

---

## 🎯 DOCUMENTACIÓN POR AUDIENCIA

### Para Agentes AI

**LEER PRIMERO:**
1. `AGENTS.md` - Reglas del proyecto
2. `README.md` - Visión general
3. `docs/architecture/SHADCN_FIRST_STRATEGY.md` - Estrategia UI

**CONSULTAR CUANDO:**
- **Trabajando con UI:** `docs/ui-ux/SHADCN_UI_GUIDE.md`
- **Trabajando con Dashboards:** `docs/references/DASHBOARDS_MOCK_REFERENCE.md`
- **Trabajando con Rutas:** `docs/references/SIDEBAR_ROUTES_AUDIT.md`
- **Operaciones:** `docs/operations/OPERATIONAL_RUNBOOK.md`

### Para Desarrolladores

- `CODEX.md` - Convenciones de código
- `docs/ui-ux/SHADCN_UI_GUIDE.md` - Guía de componentes
- `packages/ui/COMPONENTS_REGISTRY.md` - Componentes disponibles

### Para DevOps

- `docs/operations/OPERATIONAL_RUNBOOK.md` - Guía operativa
- `docs/references/PORT_ASSIGNMENT.md` - Puertos y servicios

---

## ⚠️ DOCUMENTOS OBSOLETOS/DEPRECADOS

Los siguientes documentos están consolidados en este índice:

- ❌ `docs/COMPLETE_DOCUMENTATION_INDEX.md` → Reemplazado por este archivo
- ❌ Múltiples `README.md` duplicados → Consolidados aquí
- ❌ Documentos de sesión antiguos → Ver `docs/SESSION_*.md` para histórico

---

## 🔄 MANTENIMIENTO

### Actualizar este índice cuando:
- Se crea nueva documentación crítica
- Se deprecia documentación antigua
- Cambia la estructura del proyecto
- Se migran dashboards o componentes

### Responsabilidad:
- **Agentes AI:** Consultar este índice antes de crear nueva documentación
- **Desarrolladores:** Actualizar este índice al agregar docs importantes

---

## 📌 REGLAS PARA AGENTES

1. **SIEMPRE** consultar este índice antes de buscar documentación
2. **NO CREAR** nueva documentación sin verificar si ya existe
3. **CONSOLIDAR** información similar en lugar de crear duplicados
4. **ACTUALIZAR** este índice al agregar documentación nueva

---

## 🚀 QUICK REFERENCE

### Comandos Rápidos
```bash
# Ver este índice
cat DOCUMENTATION_INDEX.md

# Buscar documentación
grep -r "keyword" docs/

# Ver reglas del proyecto
cat AGENTS.md
```

### Rutas Importantes
- **Reglas del proyecto:** `AGENTS.md`
- **Guía UI:** `docs/ui-ux/SHADCN_UI_GUIDE.md`
- **Dashboards:** `docs/references/DASHBOARDS_MOCK_REFERENCE.md`
- **Operaciones:** `docs/operations/OPERATIONAL_RUNBOOK.md`

---

**📌 NOTA:** Este es el índice maestro. Si no encuentras algo aquí, probablemente no existe o está obsoleto.

