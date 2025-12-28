# Git Commit Safety Protocol for Large Changes

**Status:** ✅ Active Practice  
**Created:** 2025-12-26  
**Purpose:** Prevenir pérdida de trabajo y facilitar rollback en cambios arquitectónicos grandes

---

## 🎯 Objetivo

Este protocolo establece prácticas OBLIGATORIAS para cambios arquitectónicos grandes (como implementación de 3 capas i18n, migración de módulos, reestructuración de código) para:

1. ✅ **Nunca perder trabajo** por cambios fallidos
2. ✅ **Facilitar rollback instantáneo** si algo sale mal
3. ✅ **Mantener historial limpio** con commits atómicos
4. ✅ **Documentar decisiones** antes/después de cambios

---

## 📋 Cuándo Aplicar Este Protocolo

### OBLIGATORIO: Aplicar cuando el cambio afecta:

- ✅ **Arquitectura core** (ej: implementar 3 capas i18n)
- ✅ **Múltiples archivos** (20+ archivos modificados)
- ✅ **Dependencias críticas** (ej: cambiar de react-i18next a otro framework)
- ✅ **Monorepo structure** (ej: mover packages, reorganizar carpetas)
- ✅ **Cambios no reversibles** (ej: borrar archivos importantes)
- ✅ **Implementaciones grandes** (ej: añadir nuevo package al monorepo)

### OPCIONAL: No es obligatorio para:

- ⚠️ Cambios simples (< 10 archivos)
- ⚠️ Fixes de bugs
- ⚠️ Ediciones de documentación
- ⚠️ Features pequeñas y aisladas

---

## 🛡️ Protocolo Paso a Paso

### Paso 1: Commit de Seguridad (OBLIGATORIO)

**ANTES de hacer cualquier cambio:**

```bash
# 1. Verificar estado actual
git status

# 2. Agregar TODO al staging
git add -A

# 3. Commit con mensaje descriptivo
git commit -m "backup: Estado antes de implementar [FEATURE-NAME] - Pre-commit safety"

# 4. Crear tag para rollback fácil
git tag -a backup-before-[FEATURE-NAME]-$(date +%Y%m%d-%H%M) -m "Backup antes de [FEATURE-NAME] - [DESCRIPCIÓN BREVE]"

# 5. Verificar tag creado
git tag -l backup-before-[FEATURE-NAME]-*
```

**Ejemplo Real:**

```bash
# Antes de implementar 3 capas i18n
git add -A
git commit -m "backup: Estado i18n antes de implementar 3 capas - Pre-commit safety"
git tag -a backup-before-i18n-3-layers-20251226-1430 -m "Backup antes de implementar 3 capas i18n - Arquitectura terminology + snapshots"
```

---

### Paso 2: Implementar Cambio (Con Validación Continua)

**Durante implementación:**

```bash
# Hacer commits atómicos frecuentes
git add archivos-específicos
git commit -m "feat(i18n): Crear terminology types - CAPA 1"

git add más-archivos
git commit -m "feat(i18n): Crear terminology engine - CAPA 2"

# ... más commits atómicos
```

**Regla:**
- ✅ Commits atómicos (cada cambio lógico es un commit)
- ✅ Mensajes descriptivos (feat/fix/docs/refactor + descripción)
- ❌ NO hacer "mega commit" con 100 archivos juntos

---

### Paso 3: Validación de Cambios

**ANTES de marcar como completado:**

```bash
# 1. Verificar que compila
npm run build

# 2. Correr tests (si existen)
npm test

# 3. Verificar en navegador
# Abrir http://localhost:3005 y probar funcionalidad

# 4. Si hay errores → ROLLBACK (ver Paso 5)
```

---

### Paso 4: Commit Final de Feature

**CUANDO todo está validado:**

```bash
# 1. Squash commits intermedios si es necesario
# Solo si hay demasiados commits pequeños relacionados

# 2. Commit final consolidado
git add -A
git commit -m "feat(i18n): Implementar 3 capas completas

- CAPA 1: Semantic IDs (types.ts)
- CAPA 2: Terminology Engine (engine.ts, cache.ts)
- CAPA 3: Integración Next.js (layout.tsx)
- Conceptos por producto (hotel, studio, cowork, coliving)
- Validación completa de 9 idiomas

Closes #issue-number"

# 3. Crear tag de feature completada
git tag -a i18n-3-layers-complete-$(date +%Y%m%d) -m "Implementación completa de 3 capas i18n"

# 4. Push cambios y tags
git push origin branch-name
git push origin i18n-3-layers-complete-20251226
```

---

### Paso 5: Rollback en Caso de Error

**SI algo sale mal:**

```bash
# 1. Revertir al backup tag
git checkout backup-before-[FEATURE-NAME]-20251226-1430

# 2. Crear rama para reparar desde backup
git checkout -b fix/[FEATURE-NAME]-repair

# 3. Analizar qué salió mal
# - Leer logs
# - Revisar código
# - Identificar raíz del problema

# 4. Implementar fix con protocolo de seguridad
# - Volver al Paso 1 (commit de seguridad)
# - Implementar fix incremental
```

---

## 📊 Estrategia de Tags

### Convención de Nombres de Tags

```bash
# Backup tags (PRE-cambio)
backup-before-[FEATURE-NAME]-[YYYYMMDD-HHMM]
# Ejemplo: backup-before-i18n-3-layers-20251226-1430

# Feature complete tags (POST-cambio)
[FEATURE-NAME]-complete-[YYYYMMDD]
# Ejemplo: i18n-3-layers-complete-20251226

# Release tags (para producción)
v[MAJOR].[MINOR].[PATCH]
# Ejemplo: v1.2.0
```

### Ver Todos los Tags

```bash
# Listar todos los tags
git tag -l

# Listar tags específicos
git tag -l backup-before-*

# Ver detalles de un tag
git show backup-before-i18n-3-layers-20251226-1430
```

### Borrar Tags (si es necesario)

```bash
# Borrar tag local
git tag -d backup-before-i18n-3-layers-20251226-1430

# Borrar tag remoto
git push origin :refs/tags/backup-before-i18n-3-layers-20251226-1430
```

---

## 🚨 Casos de Uso Reales

### Caso 1: Implementación de 3 Capas i18n

**Aplica:** SÍ (cambio arquitectónico grande)

```bash
# Paso 1: Commit de seguridad
git add -A
git commit -m "backup: Estado i18n antes de implementar 3 capas - Pre-commit safety"
git tag -a backup-before-i18n-3-layers-20251226-1430 -m "Backup antes de implementar 3 capas i18n"

# Paso 2: Implementar (commits atómicos)
git add packages/utils/src/i18n/terminology/types.ts
git commit -m "feat(i18n): Crear terminology types - CAPA 1 semantic IDs"

git add packages/utils/src/i18n/terminology/engine.ts
git commit -m "feat(i18n): Crear terminology engine - CAPA 2 resolver"

# ... más commits ...

# Paso 3: Validar
npm run build
# Probar en navegador

# Paso 4: Commit final
git add -A
git commit -m "feat(i18n): Implementar 3 capas completas

- CAPA 1: Semantic IDs (types.ts)
- CAPA 2: Terminology Engine (engine.ts, cache.ts)
- CAPA 3: Integración Next.js (layout.tsx)
- Conceptos por producto (hotel, studio, cowork, coliving)
- Validación completa de 9 idiomas

Closes #123"

# Paso 5: Tag de completado
git tag -a i18n-3-layers-complete-20251226 -m "Implementación completa de 3 capas i18n"
```

---

### Caso 2: Migración de Bundui a VibeThink

**Aplica:** SÍ (cambio arquitectónico grande)

```bash
# Paso 1: Commit de seguridad
git add -A
git commit -m "backup: Estado Bundui antes de migración a VibeThink - Pre-commit safety"
git tag -a backup-before-bundui-migration-20251226-1500 -m "Backup antes de migrar Bundui componentes"

# Paso 2: Migrar (commits atómicos por módulo)
git add apps/dashboard/app/dashboard-vibethink/crm/
git commit -m "migrate(bundui): Migrar módulo CRM a VibeThink"

git add apps/dashboard/app/dashboard-vibethink/booking/
git commit -m "migrate(bundui): Migrar módulo Booking a VibeThink"

# ... más commits ...

# Paso 3: Validar
npm run build
# Probar rutas migradas

# Paso 4: Commit final
git add -A
git commit -m "migrate(bundui): Completar migración a VibeThink

- Migrar CRM, Booking, Calendar, Analytics
- Validar todas las rutas
- Actualizar documentación

Closes #456"

# Paso 5: Tag de completado
git tag -a bundui-migration-complete-20251226 -m "Migración completa de Bundui a VibeThink"
```

---

### Caso 3: Fix de Bug (NO requiere protocolo)

**Aplica:** NO (cambio simple)

```bash
# NO hace falta commit de seguridad
# Solo arreglar y commitear

git add path/to/file.tsx
git commit -m "fix(i18n): Corregir fallback en translations cuando locale no existe"
```

---

## 📝 Mensajes de Commit (Convención)

### Formato OBLIGATORIO

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos Permitidos

- `feat`: Nueva feature
- `fix`: Corrección de bug
- `docs`: Cambios de documentación
- `refactor`: Refactorización (sin cambio funcional)
- `test`: Agregar/actualizar tests
- `chore`: Cambios de build/tooling
- `perf`: Mejora de performance
- `style`: Formateo de código (sin cambio lógico)
- `revert`: Revertir commit previo

### Ejemplos

```bash
# Feature
feat(i18n): Implementar terminology engine con override chain

# Fix
fix(auth): Corregir validación de token expirado

# Documentation
docs(architecture): Crear ADR-002 para 3 capas i18n

# Refactor
refactor(components): Simplificar BookingCard usando hooks reutilizables

# Backup (protocolo seguridad)
backup: Estado antes de implementar 3 capas - Pre-commit safety
```

---

## 🔍 Validación de Seguridad

### Checklist Obligatorio Antes de Cambio Grande

Antes de implementar cualquier cambio arquitectónico grande, verificar:

- [ ] **Commit de seguridad creado**
- [ ] **Tag de backup creado**
- [ ] **Tag verificado con `git tag -l`**
- [ ] **Rama actual identificada** (`git branch`)
- [ ] **Estado limpio** (`git status` no muestra cambios pendientes)
- [ ] **Documento de requerimientos leído**

### Checklist Obligatorio Después de Cambio Grande

Después de implementar y validar:

- [ ] **Todo compilado** (`npm run build` sin errores)
- [ ] **Tests pasando** (`npm test` sin errores)
- [ ] **Validado en navegador** (probar funcionalidad crítica)
- [ ] **Commit final descriptivo** (incluye cambios principales)
- [ ] **Tag de completado creado**
- [ ] **Documentación actualizada** (si aplica)
- [ ] **Push a remoto** (`git push origin branch-name`)

---

## 🚨 Rollback: Cuándo y Cómo

### Cuándo Hacer Rollback

HACER ROLLBACK cuando:
- ❌ Build falla y no hay solución rápida
- ❌ Tests fallan y no hay tiempo de debuggear
- ❌ Aplicación se rompe en producción
- ❌ Arquitectura no se ajusta a requisitos
- ❌ Cambio causó regresión masiva

NO HACER ROLLBACK cuando:
- ✅ Bug menor que se puede arreglar en 10 minutos
- ✅ Warning de linter que no afecta funcionalidad
- ✅ Pequeño cambio que se puede mejorar más tarde

### Cómo Hacer Rollback

**Opción 1: Rollback a tag (RECOMENDADO)**

```bash
# 1. Ir al tag de backup
git checkout backup-before-[FEATURE-NAME]-20251226-1430

# 2. Crear rama para reparar
git checkout -b fix/[FEATURE-NAME]-repair

# 3. Implementar fix desde backup seguro
# ... código ...

# 4. Commitear fix con protocolo
git add -A
git commit -m "backup: Estado antes de intentar fix - Pre-commit safety"
```

**Opción 2: Revertir commits (si hay pocos)**

```bash
# 1. Revertir último commit
git revert HEAD

# 2. Revertir múltiples commits
git revert HEAD~3..HEAD

# 3. Hacer fix y commitear
git add -A
git commit -m "fix(i18n): Corregir problema en terminology engine"
```

**Opción 3: Reset hard (último recurso, PELIGROSO)**

```bash
# ⚠️ SOLO si estás 100% seguro
# Permite TODOS los cambios no commiteados

git reset --hard backup-before-[FEATURE-NAME]-20251226-1430
```

---

## 📚 Referencias

- [Git Tagging Documentation](https://git-scm.com/book/en/v2-Git-Basics-Tagging.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Reset Documentation](https://git-scm.com/docs/git-reset)
- [AGENTS.md](../../AGENTS.md) - Reglas de arquitectura para AI agents
- [WORKFLOW.md](../../WORKFLOW.md) - Flujo de trabajo general del proyecto

---

## 🎯 Resumen Ejecutivo

| Paso | Acción | Obligatorio |
|-------|---------|-------------|
| 1 | Commit de seguridad + tag | ✅ SÍ |
| 2 | Implementar con commits atómicos | ✅ SÍ |
| 3 | Validar (build + tests + browser) | ✅ SÍ |
| 4 | Commit final + tag completado | ✅ SÍ |
| 5 | Rollback si hay error | ⚠️ Si es necesario |

**Regla de Oro:**
- **"Antes de cambios grandes: commit de seguridad + tag"**
- **"Durante cambios: commits atómicos frecuentes"**
- **"Después de cambios: validación completa + tag completado"**
- **"Si algo sale mal: rollback a tag + reintentar"**

---

**Última actualización:** 2025-12-26  
**Versión:** 1.0.0  
**Estado:** ✅ Active Practice



