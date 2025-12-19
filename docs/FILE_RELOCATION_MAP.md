# 📍 Mapa de Reubicación de Archivos - 2025-01-18

> **Propósito**: Referencia rápida de archivos movidos desde la raíz a `docs/`  
> **Fecha de reorganización**: 2025-01-18  
> **Estado**: ✅ Completado

---

## 🎯 Archivos Movidos desde la Raíz

### 📁 `docs/architecture/` (7 archivos)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `BUNDUI_REFERENCE_SYSTEM.md` | `docs/architecture/BUNDUI_REFERENCE_SYSTEM.md` | Sistema de referencia Bundui |
| `DASHBOARD_MIGRATION_STATUS.md` | `docs/architecture/DASHBOARD_MIGRATION_STATUS.md` | Estado de migración de dashboards |
| `MONOREPO_EXCEPTIONS.md` | `docs/architecture/MONOREPO_EXCEPTIONS.md` | Excepciones del monorepo |
| `ROUTING_STATUS_2025-12-18.md` | `docs/architecture/ROUTING_STATUS_2025-12-18.md` | Estado de routing |
| `RULES_DEGRADATION_PREVENTION.md` | `docs/architecture/RULES_DEGRADATION_PREVENTION.md` | Prevención de degradación de reglas |
| `RULES_NAVIGATION.md` | `docs/architecture/RULES_NAVIGATION.md` | Navegación de reglas |
| `VALIDATION_REPORT_2025-12-18.md` | `docs/architecture/VALIDATION_REPORT_2025-12-18.md` | Reporte de validación |

### 📁 `docs/development/` (2 archivos)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `REDUX_CHARTOOLTIP_ERROR_GUIDE.md` | `docs/development/REDUX_CHARTOOLTIP_ERROR_GUIDE.md` | Guía de resolución de errores Redux |
| `VHELP_COMPLETE_GUIDE.md` | `docs/development/VHELP_COMPLETE_GUIDE.md` | Guía completa del sistema VHELP |

### 📁 `docs/testing/` (2 archivos)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `DASHBOARD_TESTING_LOG.md` | `docs/testing/DASHBOARD_TESTING_LOG.md` | Log de testing de dashboards |
| `PRUEBAS_POST_LIMPIEZA.md` | `docs/testing/PRUEBAS_POST_LIMPIEZA.md` | Pruebas post-limpieza |

### 📁 `docs/ui-ux/` (1 archivo)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `UI_MASTER_GUIDE.md` | `docs/ui-ux/UI_MASTER_GUIDE.md` | Guía maestra de UI (fuente única de verdad) |

### 📁 `docs/operations/` (1 archivo)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `BRANCH_STATUS.md` | `docs/operations/BRANCH_STATUS.md` | Estado de ramas activas |

### 📁 `docs/planning/` (1 archivo)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `NEXT_STEPS.md` | `docs/planning/NEXT_STEPS.md` | Próximos pasos del proyecto |

### 📁 `docs/security/` (0 archivos)

*Nota: SECURITY.md no existía en la raíz, por lo que no se movió.*

### 📁 `docs/sessions/` (2 archivos)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `SESSION_SUMMARY.md` | `docs/sessions/SESSION_SUMMARY.md` | Resumen de sesión |
| `SESSION_SUMMARY_FIXED.md` | `docs/sessions/SESSION_SUMMARY_FIXED.md` | Resumen de sesión corregido |

### 📁 `docs/setup/` (1 archivo)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `CURSOR_SETUP.md` | `docs/setup/CURSOR_SETUP.md` | Configuración de Cursor IDE |

### 📁 `docs/ai-coordination/` (2 archivos)

| Archivo Original | Nueva Ubicación | Propósito |
|----------------|-----------------|-----------|
| `CLAUDE.md` | `docs/ai-coordination/CLAUDE.md` | Instrucciones para Claude AI |
| `CODEX.md` | `docs/ai-coordination/CODEX.md` | Instrucciones para Codex AI |

---

## 📊 Resumen

- **Total de archivos movidos**: 19
- **Carpetas creadas**: 2 (`docs/ai-coordination/`, `docs/setup/`)
- **Archivos en raíz (permitidos)**: 4 (`AGENTS.md`, `CHANGELOG.md`, `DOCS_INDEX.md`, `README.md`)

---

## 🔍 Búsqueda Rápida por Tema

### Arquitectura y Reglas
- Sistema Bundui → `docs/architecture/BUNDUI_REFERENCE_SYSTEM.md`
- Estado de migración → `docs/architecture/DASHBOARD_MIGRATION_STATUS.md`
- Excepciones monorepo → `docs/architecture/MONOREPO_EXCEPTIONS.md`
- Estado de routing → `docs/architecture/ROUTING_STATUS_2025-12-18.md`
- Prevención degradación → `docs/architecture/RULES_DEGRADATION_PREVENTION.md`
- Navegación de reglas → `docs/architecture/RULES_NAVIGATION.md`
- Validación → `docs/architecture/VALIDATION_REPORT_2025-12-18.md`

### Desarrollo y Guías
- Errores Redux → `docs/development/REDUX_CHARTOOLTIP_ERROR_GUIDE.md`
- Sistema VHELP → `docs/development/VHELP_COMPLETE_GUIDE.md`

### Testing
- Log de testing → `docs/testing/DASHBOARD_TESTING_LOG.md`
- Pruebas post-limpieza → `docs/testing/PRUEBAS_POST_LIMPIEZA.md`

### UI/UX
- Guía maestra UI → `docs/ui-ux/UI_MASTER_GUIDE.md` ⭐

### Operaciones
- Estado de ramas → `docs/operations/BRANCH_STATUS.md`

### Planificación
- Próximos pasos → `docs/planning/NEXT_STEPS.md`


### Sesiones
- Resúmenes de sesión → `docs/sessions/SESSION_SUMMARY*.md`

### Setup
- Configuración Cursor → `docs/setup/CURSOR_SETUP.md`

### Coordinación IA
- Instrucciones Claude → `docs/ai-coordination/CLAUDE.md`
- Instrucciones Codex → `docs/ai-coordination/CODEX.md`

---

## ✅ Validación

Para verificar que los archivos están en sus nuevas ubicaciones:

```powershell
# Verificar archivos principales
Test-Path "docs\architecture\BUNDUI_REFERENCE_SYSTEM.md"
Test-Path "docs\ui-ux\UI_MASTER_GUIDE.md"
Test-Path "docs\ai-coordination\CLAUDE.md"
Test-Path "docs\development\VHELP_COMPLETE_GUIDE.md"
```

---

## 📝 Notas Importantes

1. **No hay archivos duplicados**: Los archivos fueron **movidos**, no copiados
2. **Referencias actualizadas**: Los índices de documentación (`DOCS_INDEX.md`, `docs/DOCUMENTATION_INDEX.md`) deben actualizarse si referencian estos archivos
3. **Búsqueda de referencias**: Si necesitas encontrar referencias a estos archivos en el código, busca por el nombre del archivo (sin extensión)

---

## 🔄 Mantenimiento

Este documento debe actualizarse cuando:
- Se muevan más archivos desde la raíz
- Se reorganice la estructura de `docs/`
- Se eliminen archivos obsoletos

**Última actualización**: 2025-01-18

