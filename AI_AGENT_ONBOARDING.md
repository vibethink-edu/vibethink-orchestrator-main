# 🤖 AI AGENT ONBOARDING - Vibethink Orchestrator

**Fecha de última actualización:** 2025-12-26
**Versión:** 1.0.0
**Para:** Todos los agentes AI (Claude, Z.Ai, Cursor, etc.)

---

## 🎯 PROPÓSITO DE ESTE DOCUMENTO

Este documento es la **PRIMERA LECTURA OBLIGATORIA** para cualquier agente AI que trabaje en Vibethink Orchestrator.

**Si eres un agente AI y acabas de ser invocado:**
1. ✅ Lee este documento completo (5-10 minutos)
2. ✅ Lee `AGENTS.md` (reglas del proyecto)
3. ✅ Lee `docs/SCRIPTS_REFERENCE.md` (herramientas disponibles)
4. ✅ Lee `README.md` (introducción al proyecto)
5. ✅ Solo entonces, comienza a trabajar

---

## 📚 JERARQUÍA DE DOCUMENTACIÓN

```
┌─────────────────────────────────────────────────────┐
│ AI_AGENT_ONBOARDING.md ⭐ EMPEZAR AQUÍ             │
│ (Este documento - Primera lectura obligatoria)      │
└──────────────────┬──────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────────┐
│AGENTS.md│  │README.md │  │SCRIPTS_      │
│(Reglas) │  │(Intro)   │  │REFERENCE.md  │
│         │  │          │  │(Herramientas)│
└─────────┘  └──────────┘  └──────────────┘
    │              │              │
    └──────────────┼──────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ docs/architecture/                                  │
│ - I18N_3_LAYERS_ARCHITECTURE.md ⭐                  │
│ - I18N_AI_FIRST_COMPLETE_GUIDE.md                  │
│ - MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md             │
│ - Otros documentos específicos                      │
└─────────────────────────────────────────────────────┘
```

---

## 🚨 REGLAS CRÍTICAS (NUNCA VIOLAR)

### 1. Sistema de 3 Capas i18n (ACTIVO)

**Estado actual (2025-12-26):**
- ✅ **CAPA 1 (Semantic IDs):** 100% completa
- ✅ **CAPA 2 (Terminology Engine):** 100% completa
- ⚠️ **CAPA 3 (UI Strings):** 20% completa (pendiente)

**Archivos críticos que NO debes romper:**
- `packages/utils/src/i18n/terminology/engine.ts` ✅ FUNCIONA
- `packages/utils/src/i18n/terminology/cache.ts` ✅ FUNCIONA
- `packages/utils/src/i18n/terminology/index.ts` ✅ FUNCIONA
- `packages/utils/src/i18n/terminology/types.ts` ✅ FUNCIONA

**Ubicación de traducciones:**
```
apps/dashboard/src/lib/i18n/translations/
├── en/          # 45 archivos (100% completo) ⭐ MASTER
├── es/          # 45 archivos (95% completo)
├── fr/          # 45 archivos (90% completo)
├── pt/          # 45 archivos (90% completo)
├── de/          # 45 archivos (90% completo)
├── it/          # 45 archivos (50% completo - PENDIENTE)
├── ko/          # 45 archivos (50% completo - PENDIENTE)
├── ar/          # 45 archivos (90% completo)
└── zh/          # 45 archivos (90% completo)
```

**Total:** 405 archivos (9 idiomas × 45 archivos)

**Tipos de archivos de conceptos:**
- `concept.json` - Conceptos compartidos entre productos
- `concept-hotel.json` - Específicos de Hotel
- `concept-studio.json` - Específicos de Studio
- `concept-cowork.json` - Específicos de Cowork
- `concept-coliving.json` - Específicos de Coliving

**Regla de oro:**
- ❌ **NUNCA** modificar archivos de CAPA 2 sin validar con TypeScript
- ❌ **NUNCA** agregar conceptos nuevos sin copiar a TODOS los idiomas
- ❌ **NUNCA** duplicar conceptos entre `concept.json` y `concept-{product}.json`
- ✅ **SIEMPRE** usar inglés (EN) como master
- ✅ **SIEMPRE** validar con `validate-concepts-coherence.js` antes de commit

**Documentación completa:**
- `docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md` ⭐ (incluye estado ACTUAL vs PLANIFICADO)
- `GUIA_MANTENIMIENTO_CONCEPTOS.md`
- `ARCHIVOS_DISABLED_ARREGLADOS.md`

---

### 2. Scripts de Validación (USAR SIEMPRE)

**Antes de CUALQUIER commit que modifique traducciones:**

```bash
# PASO 1: Validar coherencia (OBLIGATORIO)
node scripts/validate-concepts-coherence.js

# PASO 2: Si falla, arreglar automáticamente
node scripts/fix-concepts-coherence.js

# PASO 3: Validar TypeScript (packages/utils)
cd packages/utils && npx tsc --noEmit

# PASO 4: Validar Next.js build
cd apps/dashboard && npx next build

# PASO 5: Si todo pasa, commit
git add .
git commit -m "feat(i18n): [descripción]"
```

**Referencia completa:** `docs/SCRIPTS_REFERENCE.md`

---

### 3. Filosofía de Documentación

**Principio fundamental:**
- **Documentar DESPUÉS de implementar, NO antes**
- **Documentar lo que REALMENTE existe, NO lo que se planea**
- **Actualizar documentación cuando la realidad cambia**

**Ejemplo de esta sesión:**
- ✅ Claude implementó CAPA 1 + CAPA 2 (funcional)
- ✅ Claude creó scripts de validación (funcionales)
- ✅ Claude documentó el ESTADO ACTUAL en `I18N_3_LAYERS_ARCHITECTURE.md`
- ✅ Claude actualizó `README.md` con información real

**Ubicación de documentación:**
- **Raíz:** Solo archivos esenciales (README, AGENTS, CHANGELOG, etc.)
- **`docs/architecture/`:** Arquitectura y decisiones técnicas
- **`docs/sessions/`:** Reportes de sesiones y validaciones
- **`docs/development/`:** Guías de desarrollo

**Reglas:**
- ❌ **NUNCA** crear documentos duplicados (consolidar)
- ❌ **NUNCA** crear documentación en raíz (usar `docs/`)
- ✅ **SIEMPRE** actualizar `CHANGELOG.md` para cambios importantes
- ✅ **SIEMPRE** usar nombres descriptivos con fecha

---

### 4. Referencias vs Código Modificable

**Regla universal:**
- Si un archivo/directorio tiene `-reference` en su nombre → ❌ **NO MODIFICAR**
- Si está documentado como "reference" → ❌ **NO MODIFICAR**
- Referencias pueden estar dentro O fuera del monorepo → ❌ **NO MODIFICAR IGUAL**

**Referencias externas (fuera del monorepo):**
- `C:\IA Marcelo Labs\bundui\` - Bundui Original ❌ SOLO LECTURA
- `C:\IA Marcelo Labs\shadcn-ui\` - Shadcn UI Reference ❌ SOLO LECTURA

**Referencias dentro del monorepo:**
- `apps/bundui-reference/` - Bundui Reference ❌ NO MODIFICAR

**Dónde SÍ modificar:**
- `apps/dashboard/app/dashboard-bundui/` - ✅ Modificable (espejo)
- `apps/dashboard/app/dashboard-vibethink/` - ✅ Modificable
- `packages/ui/` - ✅ Modificable
- `packages/utils/` - ✅ Modificable (con cuidado)

**Documentación:** `docs/architecture/REFERENCE_RULES.md`

---

### 5. Estructura de Dashboards (CRÍTICO)

**Tres dashboards independientes:**

1. **`/dashboard`** - Producción Final ⭐
   - Meta final de desarrollo
   - Integración con BD
   - Módulos publicados (Login, CRM, etc.)

2. **`/dashboard-bundui`** - Desarrollo/Estabilización ⭐
   - Trabajo activo AQUÍ
   - Estabilización de módulos con AI-First i18n
   - i18n OBLIGATORIO desde el inicio

3. **`/dashboard-vibethink`** - Experimentación (Opcional)
   - Prototipos y experimentos
   - Integraciones complejas

**Regla fundamental:**
- ❌ **NUNCA** compartir sidebars entre sistemas
- ❌ **NUNCA** asumir rutas genéricas (ej: `/dashboard/analytics`)
- ✅ **SIEMPRE** usar rutas específicas (ej: `/dashboard-bundui/analytics`)

---

## 🛠️ HERRAMIENTAS DISPONIBLES

### Scripts de i18n (Más usados)

```bash
# Validación
node scripts/validate-concepts-coherence.js    # ⭐ Validar coherencia
node scripts/check-missing-files.js            # Ver archivos faltantes

# Arreglos automáticos
node scripts/fix-concepts-coherence.js         # Arreglar coherencia
node scripts/copy-missing-translation-files.js # Copiar archivos faltantes
node scripts/sync-translations-structure.js    # Sincronizar estructura
```

### Scripts de desarrollo

```bash
# Start/Stop
.\scripts\start-dashboard.ps1    # Iniciar dashboard (puerto 3005)
.\scripts\stop-dashboard.ps1     # Detener dashboard

# Build
npm run build:dashboard          # Build de producción
npm run dev:dashboard            # Desarrollo
```

**Referencia completa:** `docs/SCRIPTS_REFERENCE.md` (incluye TODOS los scripts del proyecto)

---

## 📋 CHECKLIST PARA NUEVOS AGENTES

### Al comenzar una sesión:

- [ ] He leído `AI_AGENT_ONBOARDING.md` (este documento)
- [ ] He leído `AGENTS.md` (reglas del proyecto)
- [ ] He leído `docs/SCRIPTS_REFERENCE.md` (herramientas)
- [ ] He leído `README.md` (introducción)
- [ ] Entiendo la estructura de 3 capas i18n
- [ ] Sé qué archivos NO debo tocar (referencias, CAPA 2)
- [ ] Sé qué scripts usar para validar mi trabajo

### Antes de cada commit:

- [ ] He ejecutado `validate-concepts-coherence.js` (si toqué i18n)
- [ ] He ejecutado `npx tsc --noEmit` (si toqué TypeScript)
- [ ] He actualizado `CHANGELOG.md` (si es cambio importante)
- [ ] He probado en navegador (si es cambio de UI)
- [ ] He documentado el cambio (si es cambio arquitectónico)

### Antes de finalizar mi trabajo:

- [ ] He dejado el sistema en estado funcional (build pasa)
- [ ] He documentado lo que hice (en archivos existentes o nuevos)
- [ ] He actualizado `INSTRUCCIONES_Z_AI.md` (si hay tareas pendientes)
- [ ] He reportado al usuario qué completé y qué falta

---

## 🎓 LECCIONES APRENDIDAS (Evitar errores pasados)

### Lección 1: No asumir, validar

**Problema pasado:**
- Agente asumió que archivos TypeScript funcionaban sin verificar
- Resultado: 3 archivos `.disabled` por errores de compilación

**Solución:**
```bash
# SIEMPRE validar TypeScript después de modificar
cd packages/utils && npx tsc --noEmit
```

### Lección 2: Inglés es master

**Problema pasado:**
- Archivos agregados en ES sin agregar EN
- Otros idiomas se quedaron desincronizados

**Solución:**
- ✅ SIEMPRE crear/modificar EN primero
- ✅ Luego copiar a otros idiomas
- ✅ Validar con `validate-concepts-coherence.js`

### Lección 3: No duplicar conceptos

**Problema pasado:**
- Concepto `reserve` estaba en `concept.json` Y `concept-hotel.json`
- Causó inconsistencias

**Solución:**
- Conceptos compartidos → `concept.json`
- Conceptos únicos de producto → `concept-{product}.json`
- NUNCA duplicar entre ambos

### Lección 4: Documentar la REALIDAD, no el plan

**Problema pasado:**
- Documentación describía sistema PLANIFICADO
- Realidad era diferente (CAPA 3 no implementada)
- Agentes se confundían

**Solución:**
- ✅ Actualizar `I18N_3_LAYERS_ARCHITECTURE.md` con sección "ESTADO ACTUAL vs PLANIFICADO"
- ✅ Documentar lo que REALMENTE funciona
- ✅ Marcar claramente qué está pendiente

---

## 📞 CONTACTO ENTRE AGENTES

### Si necesitas ayuda de otro agente:

**Formato recomendado:**
```
Hola [Agente], estoy trabajando en [TAREA].

Estado actual:
- ✅ Lo que ya funciona
- ❌ Lo que no funciona
- ⚠️ Lo que estoy intentando

Error encontrado:
[Copia el error aquí]

¿Puedes ayudarme a [ACCIÓN ESPECÍFICA]?
```

### Si estás pasando el testigo a otro agente:

**Actualizar:**
1. `INSTRUCCIONES_Z_AI.md` - Tareas pendientes
2. `REPORTE_PRODUCT_OWNER_2025-12-26.md` - Estado para PO
3. `SYSTEM_STATUS_2025-12-26.md` - Estado del sistema
4. Crear documento de sesión en `docs/sessions/` si necesario

---

## 🚀 QUICK START PARA TAREAS COMUNES

### Agregar un nuevo concepto:

```bash
# 1. Crear en inglés (EN) primero
# Editar: apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# 2. Copiar a todos los idiomas
for locale in es fr pt de it ko ar zh; do
  cp .../en/concept-restaurant.json .../lang/
done

# 3. Validar
node scripts/validate-concepts-coherence.js

# 4. Traducir manualmente cada idioma
# Editar archivos uno por uno

# 5. Validar de nuevo
node scripts/validate-concepts-coherence.js

# 6. Commit
git add apps/dashboard/src/lib/i18n/translations/*/concept-restaurant.json
git commit -m "feat(i18n): Add restaurant concepts (9 locales)"
```

**Documentación:** `GUIA_MANTENIMIENTO_CONCEPTOS.md`

### Arreglar coherencia de traducciones:

```bash
# 1. Validar qué está mal
node scripts/validate-concepts-coherence.js

# 2. Arreglar automáticamente
node scripts/fix-concepts-coherence.js

# 3. Validar que se arregló
node scripts/validate-concepts-coherence.js

# 4. Revisar cambios
git diff

# 5. Si todo bien, commit
git add .
git commit -m "fix(i18n): Sincronizar coherencia de conceptos"
```

### Validar todo el sistema:

```bash
# PASO 1: i18n
node scripts/validate-concepts-coherence.js

# PASO 2: TypeScript
cd packages/utils && npx tsc --noEmit

# PASO 3: Next.js build
cd ../../apps/dashboard && npx next build

# PASO 4: Dev server (manual testing)
npm run dev
# Abrir http://localhost:3005/dashboard-bundui/projects-v2
# Cambiar idioma y verificar traducciones

# Si TODO pasa → ✅ Sistema funcional
```

---

## 📖 GLOSARIO DE TÉRMINOS

- **CAPA 1:** Semantic IDs - Identificadores inmutables (`concept.booking.action.reserve`)
- **CAPA 2:** Terminology Engine - Motor de resolución con cache
- **CAPA 3:** UI Strings - React Provider/Hook pattern (pendiente)
- **Fallback:** Sistema de respaldo (producto → base → inglés → ID)
- **Master:** Idioma de referencia (inglés - EN)
- **Coherencia:** Todos los idiomas tienen mismas keys y estructura
- **Snapshot:** Copia de traducciones para cliente (CAPA 3 - pendiente)
- **ConceptID:** Identificador de concepto (ej: `concept.hotel.room.suite`)
- **Namespace:** Agrupación de traducciones (ej: `hotel`, `studio`)
- **Product Context:** Contexto de producto (hotel, studio, cowork, coliving)

---

## ✅ CONCLUSIÓN

Si has leído hasta aquí:
1. ✅ Entiendes la arquitectura de 3 capas i18n
2. ✅ Sabes qué archivos NO tocar (referencias, CAPA 2)
3. ✅ Conoces los scripts de validación obligatorios
4. ✅ Sabes cómo documentar tu trabajo
5. ✅ Estás listo para trabajar de forma segura

**Siguiente paso:**
- Lee `AGENTS.md` para reglas específicas del proyecto
- Lee `docs/SCRIPTS_REFERENCE.md` para ver TODOS los scripts disponibles
- Lee `README.md` para entender el proyecto completo

**Si tienes dudas:**
- Consulta `docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md`
- Consulta `GUIA_MANTENIMIENTO_CONCEPTOS.md`
- Pregunta al usuario ANTES de hacer cambios grandes

---

**¡BIENVENIDO AL EQUIPO DE DESARROLLO DE VIBETHINK ORCHESTRATOR!** 🚀

---

**CREADO POR:** Claude
**FECHA:** 2025-12-26
**VERSIÓN:** 1.0.0
**PARA:** Todos los agentes AI (Claude, Z.Ai, Cursor, etc.)
