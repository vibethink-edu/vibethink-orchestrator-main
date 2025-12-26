# Plan de Consolidación Documental - Fase 0

**Date:** 2025-12-25  
**Objetivo:** Reducir 87 documentos a ~15 documentos maestros  
**Principio:** 1 Tema = 1 Documento

---

## 📊 Estado Actual

**Total de archivos en `docs/architecture/`:** 87  
**Problema:** Duplicación masiva, información dispersa, difícil de mantener

---

## 🎯 Estructura Objetivo (15 Documentos Maestros)

### Core Architecture (5 docs)
1. **REGLAS_DE_ORO.md** ✅ (Creado hoy - 10 reglas inmutables)
2. **I18N_AI_FIRST_COMPLETE_GUIDE.md** ✅ (Ya existe - Metodología i18n completa)
3. **REACT_VERSION_STRATEGY.md** ✅ (Creado hoy - React 19 enforcement)
4. **MONOREPO_ARCHITECTURE.md** (A crear - Consolidar dashboard, CSS, etc.)
5. **VITO_ARCHITECTURE.md** (A crear - Consolidar ViTo AI specs)

### Third-Party Management (3 docs)
6. **THIRD_PARTY_MASTER_INDEX.md** ✅ (Creado hoy - Índice maestro)
7. **THIRD_PARTY_COMPONENTS_POLICY.md** ✅ (Creado hoy - Política completa)
8. **THIRD_PARTY_ONBOARDING_QA.md** ✅ (Creado hoy - QA checklist)

### Standards & Guidelines (4 docs)
9. **THIRD_PARTY_COMPONENT_ADAPTATION.md** ✅ (Refactorizado hoy - i18n guide)
10. **COMPONENT_VALIDATION_PROCESS.md** (Mantener - Proceso de validación)
11. **RTL_ARABIC_SUPPORT.md** (A crear - Consolidar RTL docs)
12. **SHADCN_INTEGRATION_GUIDE.md** (A crear - Consolidar Shadcn docs)

### Migration & Status (3 docs)
13. **DASHBOARD_MIGRATION_STATUS.md** (Mantener - Estado de migración)
14. **I18N_MIGRATION_STATUS.md** (Mantener - Estado de i18n)
15. **PROJECT_STATUS_2025-12-25.md** ✅ (Creado hoy - Estado general)

---

## 🗑️ Documentos a ELIMINAR (Duplicados/Obsoletos)

### Categoría: BUNDUI (15 docs → Consolidar en THIRD_PARTY_*)
- ❌ BUNDUI_COMPARISON.md → Ya cubierto en THIRD_PARTY_COMPONENTS_POLICY
- ❌ BUNDUI_DOWNLOAD_UPDATE.md → Ya cubierto en THIRD_PARTY_COMPONENTS_POLICY
- ❌ BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md → Obsoleto
- ❌ BUNDUI_PREMIUM_MIGRATION.md → Ya cubierto
- ❌ BUNDUI_PREMIUM_STATUS.md → Ya cubierto en SYNC_STATUS (Asset Library)
- ❌ BUNDUI_REFERENCE_RULE.md → Ya cubierto en REGLAS_DE_ORO
- ❌ BUNDUI_REFERENCE_SYSTEM.md → Ya cubierto en THIRD_PARTY_MASTER_INDEX
- ❌ BUNDUI_REFERENCE_VS_MONOREPO.md → Ya cubierto
- ❌ BUNDUI_SAFE_UPDATE.md → Ya cubierto en THIRD_PARTY_COMPONENTS_POLICY
- ❌ BUNDUI_SIDEBAR_SYNC.md → Específico, mover a sessions/
- ❌ BUNDUI_UPDATE_QUICK_REFERENCE.md → Ya cubierto
- ❌ BUNDUI_UPDATE_STRATEGY.md → Ya cubierto en THIRD_PARTY_COMPONENTS_POLICY
- ❌ BUNDUI_VERSIONS.md → Ya cubierto en SYNC_STATUS
- ❌ BUNDUI_VIBETHINK_TANDEM.md → Ya cubierto
- ❌ BUNDUI_VS_VIBETHINK.md → Ya cubierto

**Total a eliminar:** 15 archivos

### Categoría: I18N (12 docs → Consolidar en I18N_AI_FIRST_COMPLETE_GUIDE)
- ❌ I18N_ARCHITECTURE.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_AI_AGENT_CONTEXT_RESOLUTION.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_AI_FIRST_QUICK_REFERENCE.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_BEST_PRACTICES_AGENTS.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_COMPONENT_NAMESPACE_STRATEGY.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_CONTEXT_AWARE_TRANSLATIONS.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_NO_BLINK_STRATEGY.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_TEMPLATE_GUIDE.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_TERMINOLOGY_AI_FIRST.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_TERMINOLOGY_ARCHITECTURE.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_TRANSLATION_REQUIREMENTS.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_UNIVERSAL_BASE_IMPLEMENTATION.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_UNIVERSAL_BASE_STRATEGY.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_USAGE_GUIDE.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ I18N_VALIDATION_PROTOCOL.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ✅ I18N_MIGRATION_EXECUTION_LOG.md → MANTENER (log histórico)
- ✅ I18N_MIGRATION_MASTER_PLAN.md → MANTENER (plan activo)

**Total a eliminar:** 15 archivos  
**Total a mantener:** 2 archivos

### Categoría: DASHBOARD (10 docs → Consolidar en MONOREPO_ARCHITECTURE)
- ❌ DASHBOARD_ARCHITECTURE.md → Consolidar
- ❌ DASHBOARD_ARCHITECTURE_REALIDAD_2025-12-21.md → Consolidar
- ❌ DASHBOARD_BUNDUI_ROUTES.md → Consolidar
- ❌ DASHBOARD_BUNDUI_ROUTES_VERIFICATION.md → Consolidar
- ❌ DASHBOARD_BUNDUI_VIBETHINK_RULES.md → Ya en REGLAS_DE_ORO
- ❌ DASHBOARD_HERITANCE_PROCESS.md → Consolidar
- ✅ DASHBOARD_MIGRATION_MATRIX.md → MANTENER
- ❌ DASHBOARD_MIGRATION_SAFETY_GUIDE.md → Consolidar en MIGRATION_STATUS
- ✅ DASHBOARD_MIGRATION_STATUS.md → MANTENER
- ✅ DASHBOARD_STATUS_CONSOLIDATED.md → MANTENER

**Total a eliminar:** 7 archivos  
**Total a mantener:** 3 archivos

### Categoría: SHADCN (3 docs → Consolidar en SHADCN_INTEGRATION_GUIDE)
- ❌ SHADCN_CLI_USAGE.md → Consolidar
- ❌ SHADCN_FIRST_POLICY.md → Ya en REGLAS_DE_ORO
- ❌ SHADCN_MONOREPO_COMPLIANCE.md → Consolidar

**Total a eliminar:** 3 archivos

### Categoría: RTL (2 docs → Consolidar en RTL_ARABIC_SUPPORT)
- ❌ RTL_ARABIC_SUPPORT_PLAN.md → Consolidar
- ❌ RTL_PREPARATION_PHASE.md → Consolidar

**Total a eliminar:** 2 archivos

### Categoría: VITO (3 docs → Consolidar en VITO_ARCHITECTURE)
- ❌ VITO_ARCHITECTURE_IMPLEMENTATION_STATUS.md → Consolidar
- ❌ VITO_ARCHITECTURE_SPEC_UNIFIED.md → Consolidar
- ❌ CONTEXTUAL_MEMORY_SYSTEM.md → Consolidar

**Total a eliminar:** 3 archivos

### Categoría: Misceláneos (Evaluar caso por caso)
- ✅ AI_FIRST_UNIVERSAL_METHODOLOGY.md → MANTENER (metodología core)
- ❌ APPLICATION_TERMINOLOGY.md → Ya en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ ARCHITECTURE_DIAGRAM.md → Consolidar en MONOREPO_ARCHITECTURE
- ❌ ASSETS_REPOSITORY_POLICY.md → Ya en THIRD_PARTY_COMPONENTS_POLICY
- ❌ CHECKLIST_PRUEBAS_DASHBOARDS.md → Mover a testing/
- ❌ COMPLIANCE_CHECKLIST_MODULOS_MIGRADOS.md → Mover a testing/
- ✅ COMPONENT_VALIDATION_PROCESS.md → MANTENER
- ❌ CRM_AI_AGENT_CONTEXT_DESIGN_REVIEW.md → Mover a sessions/
- ❌ CSS_ORGANIZATION.md → Consolidar en MONOREPO_ARCHITECTURE
- ❌ DATE_TIME_HANDLING_POSITION.md → Consolidar en MONOREPO_ARCHITECTURE
- ❌ DEV_KIT_VALIDATION_PROCESS.md → Mover a development/
- ❌ EXTERNAL_LIBRARIES_EVALUATION.md → Ya en THIRD_PARTY_ONBOARDING_QA
- ❌ FITNESS_WIDGETS_RUNTIME_ERROR.md → Mover a sessions/
- ❌ GUARDRAIL_IMPROVEMENTS.md → Mover a sessions/
- ❌ I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md → Mover a sessions/
- ❌ IA_FIRST_REUSABLE_COMPONENTS.md → Consolidar en AI_FIRST_UNIVERSAL_METHODOLOGY
- ❌ MONOREPO_EXCEPTIONS.md → Consolidar en MONOREPO_ARCHITECTURE
- ❌ REFERENCE_RULES.md → Ya en REGLAS_DE_ORO
- ❌ REGIONAL_CONFIGURATION.md → Consolidar en I18N_AI_FIRST_COMPLETE_GUIDE
- ❌ RULES_DEGRADATION_PREVENTION.md → Ya en REGLAS_DE_ORO
- ❌ RULES_NAVIGATION.md → Ya en REGLAS_DE_ORO
- ❌ SCRIPTS_COMPLIANCE_AUDIT.md → Mover a development/
- ❌ SIDEBAR_SPECIAL_ADJUSTMENT.md → Mover a sessions/
- ❌ VALIDATION_ROUTES.md → Consolidar en MONOREPO_ARCHITECTURE

**Total a eliminar/mover:** 20 archivos  
**Total a mantener:** 2 archivos

---

## 📊 Resumen de Limpieza

| Categoría | Total | Eliminar | Mantener | Consolidar en |
|-----------|-------|----------|----------|---------------|
| BUNDUI | 15 | 15 | 0 | THIRD_PARTY_* |
| I18N | 17 | 15 | 2 | I18N_AI_FIRST_COMPLETE_GUIDE |
| DASHBOARD | 10 | 7 | 3 | MONOREPO_ARCHITECTURE |
| SHADCN | 3 | 3 | 0 | SHADCN_INTEGRATION_GUIDE |
| RTL | 2 | 2 | 0 | RTL_ARABIC_SUPPORT |
| VITO | 3 | 3 | 0 | VITO_ARCHITECTURE |
| Misc | 24 | 20 | 4 | Varios |
| **TOTAL** | **87** | **65** | **22** | - |

**Reducción:** 87 → 22 archivos (75% de reducción)

---

## ✅ Acción Inmediata

### Paso 1: Crear carpeta de archivo
```bash
mkdir docs/architecture/_archived_2025-12-25
```

### Paso 2: Mover documentos obsoletos
```bash
# Mover todos los duplicados a archivo
mv docs/architecture/BUNDUI_*.md docs/architecture/_archived_2025-12-25/
mv docs/architecture/I18N_ARCHITECTURE.md docs/architecture/_archived_2025-12-25/
# ... etc
```

### Paso 3: Crear documentos consolidados faltantes
- [ ] MONOREPO_ARCHITECTURE.md
- [ ] VITO_ARCHITECTURE.md
- [ ] RTL_ARABIC_SUPPORT.md
- [ ] SHADCN_INTEGRATION_GUIDE.md

### Paso 4: Actualizar Master Index
Actualizar `THIRD_PARTY_MASTER_INDEX.md` para reflejar la nueva estructura.

---

## 🚫 Regla para el Futuro

**ANTES de crear un nuevo documento:**
1. ¿Ya existe un documento maestro para este tema?
2. Si SÍ → Actualizar el existente
3. Si NO → ¿Es realmente necesario un documento nuevo o es temporal?
4. Si es temporal → Crear en `docs/sessions/`
5. Si es permanente → Crear y agregar al Master Index

**Máximo de documentos en `docs/architecture/`:** 20

---

**Preparado por:** Arquitecto  
**Fecha:** 2025-12-25  
**Status:** PENDIENTE DE APROBACIÓN
