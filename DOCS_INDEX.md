# 📚 Índice de Documentación - VibeThink Orchestrator

**Punto de entrada rápido a la documentación del proyecto**

---

## 🎯 Acceso Rápido

Este archivo es un índice rápido. Para la documentación completa y detallada, consulta:

📚 **[Documentación Completa](./docs/DOCUMENTATION_INDEX.md)**

---

## 📖 Documentación Esencial

### Para Empezar
- **[README.md](./README.md)** - Introducción al proyecto
- **[AGENTS.md](./AGENTS.md)** - Reglas para agentes AI (fuente de verdad normativa)
- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de versiones

### 📋 Planes y Trabajo Activo
- **[PLAN_I18N_PENDIENTE.md](./PLAN_I18N_PENDIENTE.md)** ⭐ - Plan activo de aplicación AI-First i18n/l10n
- **[INSTRUCCIONES_NUEVO_CHAT_I18N.md](./INSTRUCCIONES_NUEVO_CHAT_I18N.md)** ⭐ - Instrucciones para continuar trabajo i18n
- **[INSTRUCCIONES_CONSOLIDACION.md](./INSTRUCCIONES_CONSOLIDACION.md)** 📦 - Guía de consolidación de archivos

### Arquitectura
- **[docs/BUNDUI_MONOREPO_MIRROR.md](./docs/BUNDUI_MONOREPO_MIRROR.md)** ⭐ - Bundui y Shadcn UI
- **[docs/REORGANIZACION_DASHBOARDS_STATUS.md](./docs/REORGANIZACION_DASHBOARDS_STATUS.md)** ⭐ - Estado de dashboards
- **[docs/architecture/](./docs/architecture/)** - Decisiones arquitectónicas

### Desarrollo
- **[docs/ui-ux/](./docs/ui-ux/)** - Guías de UI/UX
- **[docs/development/](./docs/development/)** - Guías de desarrollo
- **[docs/operations/](./docs/operations/)** - Guías operacionales

### Referencias
- **[docs/references/](./docs/references/)** - Referencias técnicas
- **[docs/testing/](./docs/testing/)** - Guías de testing

---

## 🔍 Navegación por Categoría

### 🏗️ Arquitectura
- [Protocolo de Importación y Despliegue](./docs/architecture/MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md) 🚨 **⭐ PROTOCOLO MAESTRO** - Consolida TODAS las lecciones aprendidas
- [Terminología y Nombres Clave](./docs/architecture/APPLICATION_TERMINOLOGY.md) ⭐ - Fuente única de verdad para nombres clave
- [Module Registry Protocol](./docs/architecture/MODULE_REGISTRY_PROTOCOL.md) 🚨 **ÚNICA FUENTE DE VERDAD** - Registro de módulos migrados
- [Estrategia de Namespaces por Componente](./docs/architecture/I18N_COMPONENT_NAMESPACE_STRATEGY.md) ⭐ - Validación sistemática por componente (subWorkspace)
- [Traducciones Sensibles al Contexto](./docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md) ⭐ - Módulos reutilizables (Hotel, Studio, etc.)
- [Resolución de Contexto para Agentes de IA](./docs/architecture/I18N_AI_AGENT_CONTEXT_RESOLUTION.md) 🤖 **⭐ CRÍTICO** - Cómo agentes de IA resuelven contexto automáticamente
- [Arquitectura de Terminología](./docs/architecture/I18N_TERMINOLOGY_ARCHITECTURE.md) 🚨 **OBLIGATORIO** - Sistema de terminología atómica y context-aware
- [i18n/l10n + Terminology (AI-first)](./docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md) 🚨 **⭐ IMPERATIVO** - Documento único maestro para sistema unificado UI/AI (v2.1.1)
- [Guía Completa i18n/l10n AI-First](./docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md) 🚨 **⭐ GUÍA MAESTRA** - Guía completa con Terminology para AI Agents y Namespaces para UI (v3.0.0)
- [Checklist de Cumplimiento - Módulos Migrados](./docs/architecture/COMPLIANCE_CHECKLIST_MODULOS_MIGRADOS.md) ✅ **PRÁCTICO** - Guía para aplicar normas a módulos existentes sin infringirlas
- [IA First: Componentes Reutilizables](./docs/architecture/IA_FIRST_REUSABLE_COMPONENTS.md) 🎯 **⭐ ESTRATEGIA PRINCIPAL** - Componentes que funcionan para múltiples contextos sin cambiar código
- [Evaluación de Bibliotecas Externas](./docs/architecture/EXTERNAL_LIBRARIES_EVALUATION.md) - Evaluación crítica de React Flow, TipTap, Shadcn UI Kit
- [Arquitectura de Dashboards](./docs/architecture/DASHBOARD_ARCHITECTURE.md)
- [Reglas de Referencias](./docs/architecture/REFERENCE_RULES.md)
- [Shadcn UI Compliance](./docs/architecture/SHADCN_MONOREPO_COMPLIANCE.md)
- [Tandem Bundui-VibeThink](./docs/architecture/BUNDUI_VIBETHINK_TANDEM.md) ⭐ - Comparación completa
- [Estrategia de Actualización Bundui](./docs/architecture/BUNDUI_UPDATE_STRATEGY.md) ⭐ - Manejo de actualizaciones sin i18n
- [Estrategia i18n](./docs/architecture/I18N_STRATEGY.md) ⭐ - Bundui vs VibeThink
- [Plan Maestro de Migración i18n](./docs/architecture/I18N_MIGRATION_MASTER_PLAN.md) 🚨 **CRÍTICO** - Migración gradual a ICU/Money
- [Log de Ejecución Migración](./docs/architecture/I18N_MIGRATION_EXECUTION_LOG.md) - Seguimiento de progreso
- [Fase de Preparación RTL](./docs/architecture/RTL_PREPARATION_PHASE.md) 🟡 **AHORA** - Auditoría y preparación básica (2-3 días)
- [Plan de Soporte RTL/Árabe](./docs/architecture/RTL_ARABIC_SUPPORT_PLAN.md) 📋 **Fase 2** - Implementación completa RTL (10-12 días)
- [Manejo de Fechas/Horas en Bookings](./docs/architecture/DATE_TIME_HANDLING_POSITION.md) 🚨 **OBLIGATORIO** - CivilDate vs InstantISO, venueTimezone, formatBookingRange() (v1.2.0)
- [ViTo Architecture Spec — Unified Core System](./docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md) 🚨 **⭐ ESPECIFICACIÓN MAESTRA** - Consolida i18n/Terminology + DateTime + External Normalization (v3.0.0)
- [AI-First Universal Methodology](./docs/architecture/AI_FIRST_UNIVERSAL_METHODOLOGY.md) 🚨 **⭐ METODOLOGÍA UNIVERSAL** - Aplicable a TODOS los módulos (Hotel, Studio, CRM, Tareas, Calendario, Soporte)
- [Scripts Compliance Audit](./docs/architecture/SCRIPTS_COMPLIANCE_AUDIT.md) 🔍 **AUDITORÍA** - Alineación de scripts con reglas AI-First & Locale/Naming
- [ViTo Architecture Implementation Status](./docs/architecture/VITO_ARCHITECTURE_IMPLEMENTATION_STATUS.md) 📊 **ESTADO ACTUAL** - Phase A completada, Phase B y C pendientes

#### 🌍 Base Universal i18n (90% Idiomas)

- [Estrategia Base Universal i18n](./docs/architecture/I18N_UNIVERSAL_BASE_STRATEGY.md) 📋 **Estrategia** - Plan para soportar 90% de idiomas
- [Implementación Base Universal](./docs/architecture/I18N_UNIVERSAL_BASE_IMPLEMENTATION.md) ✅ **Completado** - UTF-8 + CSS universal (P0)
- [Evaluación Base Universal](./docs/sessions/EVALUACION_I18N_UNIVERSAL_2025-12-20.md) 📊 **Análisis** - Estado actual vs. target
- [Validación CRM V2 - Compliance AI-First](./docs/sessions/VALIDACION_CRM_V2_AI_FIRST_2025-12-21.md) 🔍 **Validación** - CRM V2 compliance con metodología AI-First Universal
- [CRM AI Agent - Context Design Review](./docs/architecture/CRM_AI_AGENT_CONTEXT_DESIGN_REVIEW.md) 🚨 **EXPERT REVIEW** - Análisis arquitectónico del concepto de "contexto" en AI para CRM (pre-implementación)
- [Arquitectura i18n](./docs/architecture/I18N_ARCHITECTURE.md) - Sistema multidioma completo
- [Guía de Plantillas i18n](./docs/architecture/I18N_TEMPLATE_GUIDE.md) - Templates para nuevas plantillas
- [Guía de Uso i18n](./docs/architecture/I18N_USAGE_GUIDE.md) - Referencia rápida
- [Sistema de Referencia Bundui](./docs/architecture/BUNDUI_REFERENCE_SYSTEM.md) - Implementación completa
- [Estado de Migración de Dashboards](./docs/architecture/DASHBOARD_MIGRATION_STATUS.md) - Estado actual
- [Excepciones del Monorepo](./docs/architecture/MONOREPO_EXCEPTIONS.md) - Apps que no siguen reglas estándar
- [Prevención de Degradación de Reglas](./docs/architecture/RULES_DEGRADATION_PREVENTION.md) - Sistema anti-entropía
- [Navegación de Reglas](./docs/architecture/RULES_NAVIGATION.md) - Guía de navegación

### 🎨 UI/UX
- [Guía Maestra de UI](./docs/ui-ux/UI_MASTER_GUIDE.md) ⭐ - Fuente única de verdad para UI (v3.0.0)
- [Guía de Shadcn UI](./docs/ui-ux/SHADCN_UI_GUIDE.md)
- [Migración de Bundui](./docs/ui-ux/BUNDUI_MIGRATION_COMPLETE.md)

### 🔧 Operaciones
- [Runbook Operacional](./docs/operations/OPERATIONAL_RUNBOOK.md)
- [Convenciones de Puertos](./docs/operations/PORT_CONVENTIONS.md)
- [Prevención de Errores](./docs/operations/ERROR_PREVENTION_PLAYBOOK.md)
- [Estado de Ramas](./docs/operations/BRANCH_STATUS.md) - Ramas activas y su estado

### 📝 Reportes y Sesiones
- [Reportes de Consolidación](./docs/reports/)
- [Sesiones de Desarrollo](./docs/sessions/)
- [Resúmenes de Sesión](./docs/sessions/SESSION_SUMMARY*.md) - Historial de sesiones
- [Consolidación de Sesión 2025-12-21](./docs/sessions/CONSOLIDACION_SESION_2025-12-21.md) 📦 - Consolidación de archivos y análisis completados
- [Sesiones Archivadas](./docs/sessions/archived/) - Archivos completados y archivados

### 🎯 Decisiones y Metodologías
- [Decisiones y Reportes Consolidados](./docs/DECISIONES_Y_REPORTES_CONSOLIDADOS.md) ⭐ **DOCUMENTO MAESTRO** - Decisiones importantes, reportes archivados, metodologías activas
- [FAQ First Methodology](./docs/methodology/FAQ_FIRST_METHODOLOGY.md) ⭐ - Metodología "Valida Donde Estamos"

### 🎯 Metodología
- [FAQ First Methodology](./docs/methodology/FAQ_FIRST_METHODOLOGY.md) ⭐ - Metodología "Valida Donde Estamos"


### 🛠️ Desarrollo
- [Guía Completa de VHELP](./docs/development/VHELP_COMPLETE_GUIDE.md) - Sistema de comandos interactivo
- [Guía de Errores Redux](./docs/development/REDUX_CHARTOOLTIP_ERROR_GUIDE.md) - Resolución de errores comunes

### 🧪 Testing
- [Log de Testing de Dashboards](./docs/testing/DASHBOARD_TESTING_LOG.md) - Resultados de pruebas
- [Pruebas Post-Limpieza](./docs/testing/PRUEBAS_POST_LIMPIEZA.md) - Checklist de validación

### 📋 Planificación
- [Próximos Pasos](./docs/planning/NEXT_STEPS.md) - Roadmap y acciones pendientes

### ⚙️ Setup
- [Configuración de Cursor](./docs/setup/CURSOR_SETUP.md) - Configuración del IDE

### 🤖 Coordinación IA
- [Instrucciones para Claude](./docs/ai-coordination/CLAUDE.md) - Guía para Claude AI
- [Instrucciones para Codex](./docs/ai-coordination/CODEX.md) - Guía para Codex AI

---

## 📋 Para Agentes AI

**IMPORTANTE**: Los agentes AI deben seguir esta jerarquía de lectura:

1. **[AGENTS.md](./AGENTS.md)** - Reglas generales (este archivo)
2. **[docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md)** - Mapa de navegación
3. Docs específicos del área de trabajo
4. Código fuente

---

## 🔄 Actualización

Este índice se actualiza cuando:
- Se agrega nueva documentación importante
- Se reorganiza la estructura de `docs/`
- Se consolida documentación

**Última actualización**: 2025-12-21  
**Mantenido por**: Equipo de Desarrollo VibeThink

### 📍 Reorganización Reciente

**2025-12-21:** Consolidación de archivos de sesión
- 12 archivos movidos a `docs/sessions/archived/`
- 6 logs temporales eliminados
- Ver: [INSTRUCCIONES_CONSOLIDACION.md](./INSTRUCCIONES_CONSOLIDACION.md)

**2025-01-18:** Reorganización de documentación
- Se movieron **19 archivos** desde la raíz a `docs/` para mantener la organización.  
- **Ver mapeo completo**: [docs/FILE_RELOCATION_MAP.md](./docs/FILE_RELOCATION_MAP.md) ⭐

---

## 📞 Referencias Rápidas

- **Documentación completa**: [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md)
- **Reglas del proyecto**: [AGENTS.md](./AGENTS.md)
- **Scripts disponibles**: [scripts/](./scripts/)
- **Configuración**: [package.json](./package.json)

---

**Nota**: Este archivo es requerido por `AGENTS.md` como punto de entrada a la documentación. Para detalles completos, consulta `docs/DOCUMENTATION_INDEX.md`.

