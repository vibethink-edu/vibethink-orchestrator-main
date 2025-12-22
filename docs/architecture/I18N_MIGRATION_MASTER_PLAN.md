# Plan Maestro de Migración i18n/l10n - ViTo

**Fecha:** 2025-12-20  
**Estado:** 🚨 **CRÍTICO - EN PROGRESO**  
**Prioridad:** P0 - Fundamento para escalar SaaS  
**Duración estimada:** 11-17 días (2-3 semanas)

---

## 🎯 Objetivo

Migrar gradualmente el sistema i18n/l10n actual a una arquitectura enterprise sólida **SIN romper producción**, estableciendo fundamentos que soporten:
- 10-20 idiomas
- 50+ módulos
- 1000+ empresas (multi-tenant)
- Escalabilidad futura

---

## 📊 Estado Actual vs Objetivo

### Estado Actual ✅
- Sistema funcional con `{{param}}` (legacy)
- `formatCurrencyRegional()` en uso
- Namespaces específicos: `hotel.booking.*`, `studio.booking.*`
- `RegionalConfigManager` funcionando
- Validación básica de claves

### Objetivo 🎯
- ICU Message Format para pluralización/selección
- Money model con minor units (evita errores float)
- Context-aware translations (overrides + ICU select)
- Formateo avanzado (compact, lists, ranges)
- Tests unitarios completos
- CI/CD validation automática
- Documentación exhaustiva

---

## 🚨 Principios Fundamentales

### 1. **NO ROMPER PRODUCCIÓN**
- ✅ Soporte dual durante migración
- ✅ Feature flags para control
- ✅ Rollback < 5 minutos
- ✅ Tests de compatibilidad obligatorios

### 2. **MIGRACIÓN GRADUAL**
- ✅ Namespace por namespace
- ✅ Validar cada paso antes de continuar
- ✅ Pausas entre fases para revisión

### 3. **DOCUMENTACIÓN CONTINUA**
- ✅ Actualizar protocolos en cada paso
- ✅ Documentar decisiones y cambios
- ✅ Guías claras para equipo

---

## 📋 Fases de Migración

### FASE 0: Auditoría y Preparación (1-2 días) ⏳

**Objetivo:** Entender estado actual y crear plan detallado

**Entregables:**
- [ ] Script de auditoría ejecutado
- [ ] Reporte `I18N_AUDIT_REPORT.md` generado
- [ ] Plan de migración priorizado
- [ ] Identificación de namespaces críticos vs seguros

**Scripts a crear:**
- `scripts/audit-current-i18n.ts`
- `scripts/analyze-namespace-complexity.ts`

**Documentación:**
- `docs/architecture/I18N_AUDIT_REPORT.md`
- `docs/architecture/I18N_MIGRATION_PLAN.md`

**Criterio de éxito:**
- ✅ Reporte completo generado
- ✅ Plan priorizado claro
- ✅ Equipo alineado en estrategia

---

### FASE 1: Fundamentos con Compatibilidad (3-4 días) ⏳

**Objetivo:** Implementar ICU + Money con soporte dual

**Entregables:**
- [ ] ICU Message Format implementado
- [ ] Soporte dual `{{param}}` + `{param}`
- [ ] Money model con minor units
- [ ] Wrapper de compatibilidad `formatCurrencyRegional()`
- [ ] Feature flags implementados
- [ ] Tests de compatibilidad (100% pasan)

**Archivos a crear/modificar:**
- `packages/utils/src/i18n/message-formatter.ts` (nuevo)
- `packages/utils/src/i18n/utils.ts` (modificar - soporte dual)
- `packages/utils/src/money/types.ts` (nuevo)
- `packages/utils/src/money/formatters.ts` (nuevo)
- `packages/utils/src/money/compat.ts` (nuevo - wrapper)
- `packages/utils/src/i18n/feature-flags.ts` (nuevo)

**Tests:**
- `packages/utils/src/i18n/__tests__/message-formatter.test.ts`
- `packages/utils/src/i18n/__tests__/migration.test.ts`
- `packages/utils/src/money/__tests__/formatters.test.ts`

**Criterio de éxito:**
- ✅ Sistema actual funciona 100% igual
- ✅ Nuevo sistema funciona en paralelo
- ✅ Todos los tests pasan
- ✅ Rollback probado y funcional

---

### FASE 2: Context-Aware Translations (2-3 días) ⏳

**Objetivo:** Implementar sistema de overrides por contexto

**Entregables:**
- [ ] Context loader implementado
- [ ] Sistema de overrides funcionando
- [ ] Migrar 1-2 namespaces a ICU (piloto)
- [ ] Integración con sistema actual (`hotel.booking.*`)

**Archivos a crear/modificar:**
- `packages/utils/src/i18n/context-loader.ts` (nuevo)
- `apps/dashboard/src/lib/i18n/loader.ts` (modificar)
- Migrar `common.json` y `errors.json` a ICU

**Criterio de éxito:**
- ✅ Overrides funcionan correctamente
- ✅ 1-2 namespaces migrados exitosamente
- ✅ Sistema híbrido (actual + nuevo) funciona
- ✅ Tests pasan

---

### FASE 3: Formateo Avanzado (2-3 días) ⏳

**Objetivo:** Implementar formateo avanzado (compact, lists, ranges)

**Entregables:**
- [ ] `formatCompact()` implementado
- [ ] `formatList()` implementado
- [ ] `formatDateRange()` implementado
- [ ] `formatDuration()` implementado
- [ ] `formatUnit()` implementado
- [ ] Integración con `RegionalConfigManager`

**Archivos a crear/modificar:**
- `packages/utils/src/formatters-enhanced.ts` (modificar - agregar funciones)

**Tests:**
- `packages/utils/src/__tests__/formatters-enhanced.test.ts`

**Criterio de éxito:**
- ✅ Todas las funciones funcionan
- ✅ Integración con RegionalConfigManager
- ✅ Tests pasan

---

### FASE 4: Validación y CI/CD (2-3 días) ⏳

**Objetivo:** Automatizar validación y testing

**Entregables:**
- [ ] Script `validate-i18n-completeness.ts`
- [ ] Script `detect-icu-syntax-errors.ts`
- [ ] GitHub Actions workflow
- [ ] Validación de legacy params
- [ ] Tests en CI

**Archivos a crear:**
- `scripts/validate-i18n-completeness.ts`
- `scripts/detect-icu-syntax-errors.ts`
- `.github/workflows/i18n-validation.yml`

**Criterio de éxito:**
- ✅ CI/CD valida automáticamente
- ✅ Scripts funcionan correctamente
- ✅ Tests en CI pasan

---

### FASE 5: Documentación (1-2 días) ⏳

**Objetivo:** Documentar arquitectura y guías

**Entregables:**
- [ ] `I18N_ARCHITECTURE.md` completo
- [ ] `I18N_DEVELOPER_GUIDE.md` completo
- [ ] `I18N_CONVENTIONS.md` completo
- [ ] `I18N_MIGRATION_GUIDE.md` completo
- [ ] `I18N_TROUBLESHOOTING.md` completo

**Criterio de éxito:**
- ✅ Documentación completa y clara
- ✅ Guías útiles para desarrolladores
- ✅ Troubleshooting guide completo

---

## 🔄 Actualización de Protocolos de Importación

### Protocolo Actualizado: Importación de Módulos

**Nueva regla obligatoria:** Todos los módulos importados DEBEN usar el nuevo sistema desde el inicio.

**Checklist actualizado:**

#### Pre-Importación
- [ ] Consultar `module-registry.ts`
- [ ] Verificar stack compatibility
- [ ] **NUEVO:** Verificar si requiere ICU Message Format

#### Durante Importación
- [ ] Copiar archivos (solo `.tsx`, `.ts`)
- [ ] Corregir imports
- [ ] Decidir "use client" vs Server Component

#### i18n (OBLIGATORIO - ACTUALIZADO)
- [ ] **NUEVO:** Usar ICU Message Format (no `{{param}}`)
- [ ] **NUEVO:** Usar Money model para monedas
- [ ] Crear namespace i18n (EN/ES) con ICU
- [ ] Adaptar código a `useTranslation()`
- [ ] Validar TODOS los componentes
- [ ] **NUEVO:** Validar sintaxis ICU
- [ ] Probar en ambos idiomas (EN/ES)

#### Validación
- [ ] **NUEVO:** Ejecutar `validate-i18n-completeness`
- [ ] **NUEVO:** Ejecutar `detect-icu-syntax-errors`
- [ ] Validar claves (`validate-i18n-keys.js`)
- [ ] Detectar claves faltantes (`detect-missing-i18n-keys.js`)

---

## 📝 Scripts de Migración

### Script 1: Auditoría Actual

```bash
npm run audit:i18n
```

**Genera:**
- `docs/architecture/I18N_AUDIT_REPORT.md`

### Script 2: Migrar Namespace

```bash
npm run migrate:namespace -- common
```

**Migra:**
- `{{param}}` → `{param}`
- Actualiza ambos locales (EN/ES)

### Script 3: Validación Completa

```bash
npm run validate:i18n
```

**Valida:**
- Completitud de traducciones
- Sintaxis ICU
- Tests unitarios

---

## 🚨 Estrategia de Rollback

### Rollback Rápido (< 5 minutos)

**Opción 1: Revertir commit**
```bash
git revert HEAD
npm run build
```

**Opción 2: Desactivar feature flag**
```bash
# .env.local
NEXT_PUBLIC_I18N_ICU=false
NEXT_PUBLIC_I18N_MONEY=false
```

**Opción 3: Remover namespace de migrados**
```typescript
// packages/utils/src/i18n/feature-flags.ts
MIGRATED_NAMESPACES: [] // Vaciar array
```

---

## 📊 Métricas de Éxito

### Técnicas
- [ ] 100% tests pasan
- [ ] 0 errores en CI/CD
- [ ] 0 breaking changes en producción
- [ ] Rollback probado y funcional

### Funcionales
- [ ] Pluralización funciona (EN/ES)
- [ ] Money formatea correctamente
- [ ] Context-aware funciona
- [ ] Formateo avanzado funciona

### Calidad
- [ ] Documentación completa
- [ ] Guías claras
- [ ] Protocolos actualizados

---

## 📅 Timeline Detallado

### Semana 1: Fundamentos
- **Día 1-2:** Fase 0 (Auditoría)
- **Día 3-6:** Fase 1 (ICU + Money)
- **Día 7:** Validación y documentación

### Semana 2: Context-Aware + Formateo
- **Día 8-10:** Fase 2 (Context-aware)
- **Día 11-13:** Fase 3 (Formateo avanzado)

### Semana 3: Validación + Docs
- **Día 14-16:** Fase 4 (CI/CD)
- **Día 17:** Fase 5 (Documentación)

---

## ✅ Checklist de Inicio

Antes de comenzar Fase 0:

- [ ] Leer esta guía completa
- [ ] Revisar evaluación de Cursor
- [ ] Asegurar que sistema actual funciona
- [ ] Crear branch de migración
- [ ] Notificar al equipo
- [ ] Preparar ambiente de testing

---

## 📚 Documentación Relacionada

- **Evaluación:** `docs/sessions/EVALUACION_GUIA_I18N_2025-12-20.md`
- **Protocolo de Importación:** `docs/architecture/MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md`
- **Validación i18n:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md`
- **Context-Aware:** `docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md`

---

**Última actualización:** 2025-12-20  
**Próxima revisión:** Después de cada fase

---

## 🌍 Soporte RTL (Right-to-Left) y Árabe - Fase Futura

**Estado:** 📋 Planificado - Fase 2  
**Prioridad:** P1 - Cuando cliente Dubai confirme  
**Duración estimada:** 10-12 días

**Decisión estratégica:** ✅ **OPCIÓN B - Cliente Dubai es Fase 2**

RTL será implementado **después** de completar la migración ICU/Money porque:
- RTL requiere 10-12 días mínimo
- ICU/Money es la base necesaria primero
- Es mejor hacer RTL bien hecho que apresurado

**Documentación completa:** `docs/architecture/RTL_ARABIC_SUPPORT_PLAN.md`

---

**Este es el plan maestro. Ejecutar fase por fase, validando cada paso antes de continuar.**

