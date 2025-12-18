# 📚 Índice Maestro de Documentación - VibeThink Orchestrator

**Última actualización**: 2025-01-17  
**Estado**: Activo y mantenido

---

## 🎯 Documentación Esencial (Actual)

### 🏗️ Arquitectura y Estructura

#### Dashboards
- **[BUNDUI_MONOREPO_MIRROR.md](./BUNDUI_MONOREPO_MIRROR.md)** ⭐
  - Qué es Bundui y su relación con Shadcn UI
  - Arquitectura de espejo monorepo perfecto
  - Estructura y propósito de `/dashboard-bundui`

- **[REORGANIZACION_DASHBOARDS_STATUS.md](./REORGANIZACION_DASHBOARDS_STATUS.md)** ⭐
  - Estado actual de reorganización de dashboards
  - Estructura de 3 niveles: `/dashboard`, `/dashboard-vibethink`, `/dashboard-bundui`
  - Problemas identificados y soluciones propuestas

#### UI/UX
- **[ui-ux/SHADCN_UI_GUIDE.md](./ui-ux/SHADCN_UI_GUIDE.md)**
  - Guía de uso de Shadcn UI en el proyecto
  - Componentes disponibles y mejores prácticas

- **[ui-ux/BUNDUI_MIGRATION_COMPLETE.md](./ui-ux/BUNDUI_MIGRATION_COMPLETE.md)**
  - Estado de migración de Bundui
  - Componentes migrados y pendientes

### 🔧 Desarrollo

- **[COMPATIBILITY_REPORT.md](./COMPATIBILITY_REPORT.md)**
  - Reporte de compatibilidad de dependencias
  - Versiones y restricciones

- **[references/VENDOR_VERSIONS.md](./references/VENDOR_VERSIONS.md)**
  - Versiones de vendors y dependencias
  - Control de versiones

- **[references/PORT_ASSIGNMENT.md](./references/PORT_ASSIGNMENT.md)**
  - Asignación de puertos por aplicación
  - Referencia rápida

### 📋 Operaciones

- **[operations/OPERATIONAL_RUNBOOK.md](./operations/OPERATIONAL_RUNBOOK.md)**
  - Guía operacional del proyecto
  - Comandos y procedimientos

- **[operations/ERROR_PREVENTION_PLAYBOOK.md](./operations/ERROR_PREVENTION_PLAYBOOK.md)**
  - Prevención de errores comunes
  - Mejores prácticas

### 📝 Historial

- **[changelog.md](./changelog.md)** ⭐
  - Historial de cambios del proyecto
  - Versiones y actualizaciones

---

## 📁 Estructura de Documentación

```
docs/
├── DOCUMENTATION_INDEX.md          # ⭐ Este archivo (índice maestro)
├── BUNDUI_MONOREPO_MIRROR.md      # ⭐ Bundui y Shadcn UI
├── REORGANIZACION_DASHBOARDS_STATUS.md  # ⭐ Estado dashboards
├── changelog.md                    # ⭐ Historial de cambios
│
├── ui-ux/                          # Documentación UI/UX
│   ├── SHADCN_UI_GUIDE.md
│   ├── BUNDUI_MIGRATION_COMPLETE.md
│   └── ...
│
├── operations/                     # Guías operacionales
│   ├── OPERATIONAL_RUNBOOK.md
│   └── ERROR_PREVENTION_PLAYBOOK.md
│
├── references/                     # Referencias técnicas
│   ├── VENDOR_VERSIONS.md
│   ├── PORT_ASSIGNMENT.md
│   └── ...
│
├── projects/                       # Documentación de proyectos específicos
│   └── VibeThink-Orchestrator/
│
└── reorg-2025/                     # 📦 ARCHIVO - Reorganizaciones históricas
    └── (solo referencia histórica)
```

---

## ✅ Limpieza Completada (2025-01-17)

### Archivos Eliminados

Se han eliminado **40+ archivos obsoletos** incluyendo:

- ✅ Reportes de limpieza completados (`CLEANUP_*.md`)
- ✅ Planes y schedules históricos
- ✅ Documentación de dashboards consolidada (`DASHBOARD*.md`)
- ✅ Reportes de migración a Docusaurus (`DOCUSAURUS_*.md`)
- ✅ Sesiones históricas (`SESSION_*.md`)
- ✅ Documentación legacy (`VTHINK_*.md`, `VIBETHINK_*.md`)

**Total eliminado**: ~10,000 líneas de documentación obsoleta

### Criterios Aplicados

- ✅ Documentación completada y obsoleta
- ✅ Información migrada a otros lugares
- ✅ Reportes históricos sin valor actual
- ✅ Duplicados de información consolidada
- ✅ Documentación de sesiones pasadas

### Estado Actual

La documentación ahora está:
- ✅ **Consolidada** en documentos maestros
- ✅ **Organizada** en estructura clara
- ✅ **Sin duplicados** ni basura
- ✅ **Fácil de navegar** y mantener

---

## 📖 Guía de Uso

### Para Desarrolladores

1. **Empezar aquí**: `DOCUMENTATION_INDEX.md` (este archivo)
2. **Arquitectura**: `BUNDUI_MONOREPO_MIRROR.md`
3. **Estado actual**: `REORGANIZACION_DASHBOARDS_STATUS.md`
4. **UI Components**: `ui-ux/SHADCN_UI_GUIDE.md`
5. **Operaciones**: `operations/OPERATIONAL_RUNBOOK.md`

### Para Nuevos Contribuidores

1. Leer `AGENTS.md` en la raíz del proyecto
2. Revisar `BUNDUI_MONOREPO_MIRROR.md` para entender la arquitectura
3. Consultar `REORGANIZACION_DASHBOARDS_STATUS.md` para estado actual
4. Ver `changelog.md` para historial reciente

### Para Mantenimiento

- **Actualizar este índice** cuando se agregue nueva documentación
- **Eliminar documentos obsoletos** siguiendo los criterios
- **Consolidar información** en documentos maestros
- **Mantener estructura clara** y organizada

---

## 🎯 Principios de Documentación

### ✅ Hacer

- ✅ Mantener documentación actualizada
- ✅ Consolidar información relacionada
- ✅ Usar estructura clara y navegable
- ✅ Referenciar desde el índice maestro
- ✅ Eliminar lo obsoleto regularmente

### ❌ No Hacer

- ❌ Crear documentos duplicados
- ❌ Dejar documentación obsoleta sin marcar
- ❌ Documentar en múltiples lugares
- ❌ Mantener información histórica sin valor
- ❌ Crear estructura anidada innecesaria

---

## 🔄 Proceso de Actualización

1. **Nueva documentación** → Agregar a este índice
2. **Documentación obsoleta** → Marcar y eliminar
3. **Información duplicada** → Consolidar en un solo lugar
4. **Estructura** → Mantener simple y clara
5. **Índice** → Actualizar este archivo

---

## 📞 Referencias Rápidas

- **AGENTS.md** (raíz) → Reglas para agentes AI
- **README.md** (raíz) → Información del proyecto
- **package.json** → Dependencias y scripts
- **scripts/** → Scripts operacionales

---

**Mantenido por**: Equipo de Desarrollo VibeThink  
**Última revisión**: 2025-01-17

