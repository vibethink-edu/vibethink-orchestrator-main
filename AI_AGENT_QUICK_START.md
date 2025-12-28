# 🤖 AI/Agent Quick Start Guide

**Para:** Cualquier IA o agente que trabaje en VibeThink Orchestrator
**Tiempo de lectura:** 3 minutos
**Última actualización:** 2025-12-25

---

## 🚀 Start Here (30 segundos)

**¿Primera vez en este proyecto? Lee estos 3 archivos en orden:**

1. 📋 **`PROJECT_STATUS.md`** (5 min) - Estado actual y decisiones ejecutivas
2. 📝 **`CHANGELOG.md`** (2 min) - Sección [Unreleased] + última versión
3. 🛡️ **`README.md`** (2 min) - Reglas de estabilidad

**Después de leer esos 3:**
- Ya sabes qué NO tocar
- Ya sabes qué está aprobado pero pendiente
- Ya sabes las reglas de estabilidad

---

## ⚡ Decisiones Ejecutivas Activas

**ESTAS NO SE REVIERTEN. ESTÁN APROBADAS.**

### ✅ Decisión #1: 9 Idiomas con Lazy Loading (2025-12-25)

```
APROBADO: Expandir de 7 a 9 idiomas (agregar it, ja)
ESTRATEGIA: Lazy loading (solo cargar idiomas necesarios)
ESTADO: Documentado, pendiente implementación

NO REVERTIR:
❌ NO volver a 7 idiomas
❌ NO eliminar referencias a 'it' o 'ja'
❌ NO cargar todos los idiomas simultáneamente

DOCUMENTOS:
- Plan: docs/sessions/SESSION_2025-12-25_9_LANGUAGES_IMPLEMENTATION_PLAN.md
- Arquitectura: docs/architecture/I18N_LAZY_LOADING_STRATEGY.md
```

### ✅ Fix #1: autoprefixer Error (2025-12-25)

```
PROBLEMA: Cannot find module 'autoprefixer'
CAUSA: Sintaxis workspace:* en packages/integrations/package.json
SOLUCIÓN: Cambiado a ^0.1.0

NO REVERTIR:
❌ NO usar workspace:* en package.json
❌ NO cambiar de npm a pnpm/yarn

DOCUMENTOS:
- docs/TROUBLESHOOTING.md (sección autoprefixer)
- docs/architecture/PACKAGE_MANAGER_COMPATIBILITY.md
```

---

## 📁 Archivos Críticos (NO modificar sin leer primero)

### Configuración del Proyecto

| Archivo | Qué contiene | Leer antes de modificar |
|---------|--------------|-------------------------|
| `package.json` (root) | Package manager: npm@10.2.4 | PACKAGE_MANAGER_COMPATIBILITY.md |
| `packages/integrations/package.json` | ✅ CORREGIDO (usa ^0.1.0) | NO cambiar a workspace:* |
| `CHANGELOG.md` | Registro oficial de cambios | SIEMPRE leer [Unreleased] |
| `PROJECT_STATUS.md` | Estado y decisiones actuales | Leer ANTES de cualquier cambio |

### i18n System

| Archivo | Estado | Notas |
|---------|--------|-------|
| `apps/dashboard/src/lib/i18n/locale-config.ts` | 🔄 PENDIENTE ACTUALIZAR | Agregar 'it' y 'ja' a SupportedLocale |
| `apps/dashboard/src/lib/i18n/translations/it/` | 🔄 PENDIENTE CREAR | Sprint 1 |
| `apps/dashboard/src/lib/i18n/translations/ja/` | 🔄 PENDIENTE CREAR | Sprint 1 |
| `docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md` | ✅ ACTUALIZADO | Define 9 idiomas oficiales |

---

## 🚨 Banderas Rojas (NO HACER)

### ❌ Cambios Prohibidos

1. **NO cambiar package manager de npm a otro**
   ```bash
   # ❌ PROHIBIDO
   "packageManager": "pnpm@9.0.0"

   # ✅ CORRECTO (ya está)
   "packageManager": "npm@10.2.4"
   ```

2. **NO usar sintaxis workspace:***
   ```json
   // ❌ PROHIBIDO
   "@vibethink/utils": "workspace:*"

   // ✅ CORRECTO
   "@vibethink/utils": "^0.1.0"
   ```

3. **NO reducir idiomas aprobados**
   ```typescript
   // ❌ PROHIBIDO (volver a 7)
   type SupportedLocale = 'en' | 'es' | 'ar' | 'zh' | 'fr' | 'pt' | 'de';

   // ✅ CORRECTO (expandir a 9)
   type SupportedLocale = 'en' | 'es' | 'ar' | 'zh' | 'fr' | 'pt' | 'de' | 'it' | 'ja';
   ```

4. **NO cargar todos los idiomas simultáneamente**
   ```typescript
   // ❌ PROHIBIDO
   import allTranslations from './translations/*';

   // ✅ CORRECTO (lazy loading)
   const translations = await import(`./translations/${locale}/`);
   ```

### ⚠️ Cambios que Requieren Confirmación

Si vas a hacer esto, pregunta primero:
- Cambiar versión de Next.js
- Cambiar versión de React
- Agregar/remover idiomas
- Modificar arquitectura de lazy loading
- Cambiar estructura de monorepo

---

## ✅ Checklist Antes de Hacer Cambios

```bash
# 1. ¿Leíste PROJECT_STATUS.md?
[ ] Sí

# 2. ¿Leíste CHANGELOG.md sección [Unreleased]?
[ ] Sí

# 3. ¿Tu cambio revertiría alguna decisión ejecutiva?
[ ] No

# 4. ¿Validaste que no usas workspace:* en package.json?
[ ] Sí

# 5. ¿Verificaste que sigues la estrategia de 9 idiomas?
[ ] Sí

# 6. Si modificas i18n, ¿implementas lazy loading?
[ ] Sí o N/A
```

Si todas las respuestas son correctas, puedes proceder.

---

## 🛠️ Comandos Útiles

### Validación

```bash
# Validar sintaxis de package.json
node scripts/validate-package-json-syntax.js

# Verificar build
npm run build

# Ver estado git
git status

# Ver últimos commits
git log --oneline -10
```

### Información del Proyecto

```bash
# Ver versión actual
cat package.json | grep version

# Ver package manager
cat package.json | grep packageManager

# Ver idiomas implementados
ls apps/dashboard/src/lib/i18n/translations/

# Ver branch actual
git branch
```

---

## 📚 Documentos de Referencia por Área

### Trabajando en i18n

**Orden de lectura:**
1. `PROJECT_STATUS.md` - Decisión de 9 idiomas
2. `docs/architecture/I18N_LAZY_LOADING_STRATEGY.md` - Arquitectura completa
3. `docs/sessions/SESSION_2025-12-25_9_LANGUAGES_IMPLEMENTATION_PLAN.md` - Roadmap
4. `docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md` - Estándar oficial

### Trabajando en Build/Dependencies

**Orden de lectura:**
1. `PROJECT_STATUS.md` - Fix de autoprefixer
2. `docs/architecture/PACKAGE_MANAGER_COMPATIBILITY.md` - Guía completa
3. `docs/TROUBLESHOOTING.md` - Sección autoprefixer
4. `scripts/validate-package-json-syntax.js` - Script de validación

### Trabajando en UI/UX

**Orden de lectura:**
1. `README.md` - Reglas de estabilidad (hydration)
2. `docs/ui-ux/` - Guías de diseño
3. `docs/architecture/SHADCN_FIRST_POLICY.md` - Política de componentes

---

## 🎯 Próximos Pasos del Proyecto

**Lo que está pendiente implementar (en orden):**

### Sprint 1 (Esta semana)
1. Actualizar `locale-config.ts` con `it` y `ja`
2. Crear directorios `translations/it/` y `translations/ja/`
3. Configurar webpack para code splitting

### Sprint 2 (Próxima semana)
1. Implementar `dynamic-loader.ts`
2. Sistema de detección de preferencias
3. Cache inteligente

### Sprint 3-6 (Próximas 4 semanas)
1. Backend: APIs de preferencias
2. UI: Language selector
3. Traducciones completas

**Ver roadmap completo:** `docs/sessions/SESSION_2025-12-25_9_LANGUAGES_IMPLEMENTATION_PLAN.md`

---

## 🤝 Handoff a Otra IA

Si vas a pasarle el proyecto a otra IA/agente, dile esto:

```
"Hola! Este proyecto está en versión 0.5.1, branch: projects-v2-consolidation.

DECISIÓN EJECUTIVA RECIENTE (2025-12-25):
Expandir sistema i18n de 7 a 9 idiomas (agregar Italiano y Japonés)
con lazy loading para eficiencia.

ANTES DE HACER CAMBIOS:
1. Lee PROJECT_STATUS.md
2. Lee CHANGELOG.md sección [Unreleased]
3. Lee README.md

NO REVIERTAS:
- Los 9 idiomas aprobados
- El fix de autoprefixer (workspace:* → ^0.1.0)
- La estrategia de lazy loading

DOCUMENTOS CLAVE:
- Plan completo: docs/sessions/SESSION_2025-12-25_9_LANGUAGES_IMPLEMENTATION_PLAN.md
- Arquitectura: docs/architecture/I18N_LAZY_LOADING_STRATEGY.md

Cualquier duda, revisa PROJECT_STATUS.md primero."
```

---

## 💡 Tips para IA Efectiva

### DO (Hacer)

✅ Leer PROJECT_STATUS.md antes de cualquier cambio
✅ Verificar CHANGELOG.md sección [Unreleased]
✅ Seguir decisiones ejecutivas aprobadas
✅ Preguntar si algo no está claro
✅ Documentar cambios nuevos en CHANGELOG
✅ Actualizar PROJECT_STATUS.md si hay decisión nueva

### DON'T (No hacer)

❌ Asumir que algo está desactualizado sin verificar
❌ Revertir decisiones sin preguntar
❌ Ignorar documentos de referencia
❌ Mezclar sintaxis de diferentes package managers
❌ Modificar archivos críticos sin leer docs primero
❌ Implementar sin revisar roadmap aprobado

---

## 🔄 Mantenimiento de Este Archivo

**Este archivo debe actualizarse cuando:**
- Se aprueba una nueva decisión ejecutiva
- Cambia el estado del proyecto significativamente
- Se completa un sprint importante
- Hay nuevas reglas críticas para IA

**Formato:**
- Mantener sección "Decisiones Ejecutivas Activas" al día
- Actualizar "Próximos Pasos del Proyecto"
- Agregar nuevas banderas rojas si aparecen

---

**Última actualización:** 2025-12-25
**Mantenido por:** ViTo Assistant (Claude)
**Versión del proyecto:** 0.5.1

---

## 📞 ¿Dudas?

1. **¿Puedo hacer X?** → Revisa PROJECT_STATUS.md sección "Banderas rojas"
2. **¿Qué está aprobado?** → CHANGELOG.md sección [Unreleased]
3. **¿Qué NO debo tocar?** → Este archivo, sección "Banderas Rojas"
4. **¿Cuál es el siguiente paso?** → PROJECT_STATUS.md sección "Próximos Pasos"

**Si aún tienes dudas:** Pregunta al usuario (Marcelo) en lugar de adivinar.
