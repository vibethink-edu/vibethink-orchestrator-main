# 🛠️ SCRIPTS REFERENCE - VibeThink Orchestrator

**Última Actualización:** 2025-12-26
**Estado:** ✅ OPERATIONAL
**Propósito:** Referencia central de TODOS los scripts del proyecto

---

## 📚 ÍNDICE

1. [Scripts de Desarrollo](#scripts-de-desarrollo)
2. [Scripts de i18n/Traducciones](#scripts-de-i18ntraducciones)
3. [Scripts de Validación](#scripts-de-validación)
4. [Scripts de Arreglo Automático](#scripts-de-arreglo-automático)
5. [Scripts de Utilidad](#scripts-de-utilidad)
6. [Scripts de Deploy/Build](#scripts-de-deploybuild)

---

## 🚀 SCRIPTS DE DESARROLLO

### **`npm run dev`** - Levantar servidor de desarrollo

**Ubicación:** `package.json` (root)

**Qué hace:**
- Levanta el servidor de desarrollo de Next.js
- Hot reload automático
- Puerto: 3005 (dashboard)

**Cuándo usar:**
```bash
# Desarrollo diario
npm run dev

# Abre en navegador:
# http://localhost:3005
```

**Equivalente a:**
```bash
cd apps/dashboard && npx next dev -p 3005
```

---

### **`scripts/start-stop-dev.sh`** - Start/Stop servidor con persistencia

**Ubicación:** `scripts/start-stop-dev.sh`

**Qué hace:**
- **START:** Levanta servidor en background, guarda PID
- **STOP:** Detiene servidor usando PID guardado
- **STATUS:** Muestra si está corriendo
- **RESTART:** Stop + Start

**Cuándo usar:**
```bash
# Iniciar servidor en background
./scripts/start-stop-dev.sh start

# Ver estado
./scripts/start-stop-dev.sh status

# Detener servidor
./scripts/start-stop-dev.sh stop

# Reiniciar
./scripts/start-stop-dev.sh restart
```

**Ventajas:**
- ✅ No bloquea la terminal
- ✅ Guarda PID para stop confiable
- ✅ Útil para desarrollo con múltiples terminales

**Archivos generados:**
- `.next-dev.pid` - PID del proceso
- `.next-dev.log` - Logs del servidor

---

## 🌍 SCRIPTS DE i18n/TRADUCCIONES

### **`scripts/validate-concepts-coherence.js`** - Validar coherencia de conceptos

**Ubicación:** `scripts/validate-concepts-coherence.js`

**Qué hace:**
Ejecuta **4 validaciones** sobre archivos de conceptos:

1. ✅ **Archivos existen:** Verifica que todos los idiomas tengan los mismos archivos
2. ✅ **Keys coherentes:** Verifica que todos los archivos tengan las mismas keys
3. ✅ **No duplicados:** Detecta duplicados entre `concept.json` y `concept-{producto}.json`
4. ✅ **No vacíos:** Detecta traducciones vacías

**Cuándo usar:**
```bash
# ANTES de commit (OBLIGATORIO si tocaste traducciones)
node scripts/validate-concepts-coherence.js

# DESPUÉS de copiar archivos
node scripts/copy-missing-translation-files.js
node scripts/validate-concepts-coherence.js

# DESPUÉS de sincronizar estructura
node scripts/sync-translations-structure.js
node scripts/validate-concepts-coherence.js
```

**Salida esperada (✅ OK):**
```
📁 VALIDACIÓN 1: Archivos existen en todos los idiomas

✅ concept.json existe en todos los idiomas
✅ concept-hotel.json existe en todos los idiomas
✅ concept-studio.json existe en todos los idiomas
✅ concept-cowork.json existe en todos los idiomas
✅ concept-coliving.json existe en todos los idiomas

🔑 VALIDACIÓN 2: Keys coherentes entre idiomas

✅ concept.json (es): Keys coherentes con EN
✅ concept.json (fr): Keys coherentes con EN
...

🔄 VALIDACIÓN 3: No hay duplicados entre base y productos

✅ No hay duplicados entre base y productos

📝 VALIDACIÓN 4: Traducciones no están vacías

✅ Todas las traducciones tienen contenido

📊 REPORTE FINAL

✅ TODAS LAS VALIDACIONES PASARON
```

**Salida de error (❌ FAIL):**
```
❌ concept-restaurant.json falta en: ko, ar
❌ concept.json (es): Faltan 5 keys
⚠️  concept-hotel.json (es): 3 keys extra (no están en EN)
```

**Archivos validados:**
- `apps/dashboard/src/lib/i18n/translations/{locale}/concept*.json`
- 9 idiomas × 5 archivos = 45 archivos

**Exit codes:**
- `0` - Todas las validaciones pasaron
- `1` - Algunas validaciones fallaron

---

### **`scripts/fix-concepts-coherence.js`** - Arreglar coherencia automáticamente

**Ubicación:** `scripts/fix-concepts-coherence.js`

**Qué hace:**
1. ✅ **Sincroniza keys** entre idiomas (EN es master)
2. ✅ **Elimina duplicados** entre `concept.json` y `concept-{producto}.json`
3. ✅ **Preserva traducciones** existentes (no sobrescribe valores)

**Cuándo usar:**
```bash
# SI validate-concepts-coherence.js falla
node scripts/validate-concepts-coherence.js
# ❌ ALGUNAS VALIDACIONES FALLARON

# ENTONCES ejecutar:
node scripts/fix-concepts-coherence.js

# Y validar nuevamente:
node scripts/validate-concepts-coherence.js
# ✅ TODAS LAS VALIDACIONES PASARON
```

**Proceso automático:**
```
1. Lee concept.json de EN (master)
2. Para cada idioma:
   - Lee concept.json del idioma
   - Fusiona estructura de EN con traducciones existentes
   - Si falta key → copia de EN (en inglés)
   - Si existe key → preserva traducción
   - Si key extra → elimina
3. Para concept-{producto}.json:
   - Detecta duplicados con concept.json
   - Elimina duplicados del archivo de producto
   - Preserva keys únicas del producto
4. Guarda archivos arreglados
```

**Salida:**
```
🔧 ARREGLANDO COHERENCIA DE CONCEPTOS

📄 Sincronizando concept.json en todos los idiomas...
✅ concept.json (es): 0 keys agregadas, 3 eliminadas, 120 preservadas
✅ concept.json (fr): 2 keys agregadas, 0 eliminadas, 121 preservadas
...

🗑️  Eliminando duplicados entre base y productos...
✅ concept-hotel.json (en): 5 duplicados eliminados
✅ concept-hotel.json (es): 5 duplicados eliminados
...

📊 RESUMEN FINAL
✅ Archivos arreglados: 45
✅ Keys sincronizadas: 120
✅ Duplicados eliminados: 58
```

**⚠️ IMPORTANTE:**
- Siempre hacer backup antes de ejecutar
- Validar después con `validate-concepts-coherence.js`
- Revisar los cambios antes de commit

---

### **`scripts/copy-missing-translation-files.js`** - Copiar archivos faltantes

**Ubicación:** `scripts/copy-missing-translation-files.js`

**Qué hace:**
1. Lee todos los archivos de `en/` (inglés master)
2. Para cada idioma (es, fr, pt, de, it, ko, ar, zh):
   - Detecta qué archivos faltan
   - Copia desde `en/` al idioma
3. Reporta cuántos archivos copió

**Cuándo usar:**
```bash
# DESPUÉS de agregar nuevo archivo a EN
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# ENTONCES copiar a todos los idiomas:
node scripts/copy-missing-translation-files.js

# Resultado: concept-restaurant.json copiado a 8 idiomas (en inglés)
```

**Salida:**
```
✅ Copied it/concept-restaurant.json
✅ Copied ko/concept-restaurant.json
✅ Copied fr/concept-restaurant.json
✅ Copied pt/concept-restaurant.json
✅ Copied de/concept-restaurant.json
✅ Copied ar/concept-restaurant.json
✅ Copied zh/concept-restaurant.json
⏭️  Skipped es/concept-restaurant.json (already exists)

📊 Summary:
  ✅ Copied: 7 files
  ⏭️  Skipped (already exist): 1 files

⚠️  NOTE: Copied files are in ENGLISH. They need manual translation.
```

**⚠️ IMPORTANTE:**
- Los archivos copiados están en **INGLÉS**
- Necesitan traducción manual después
- Útil para crear estructura rápidamente

---

### **`scripts/sync-translations-structure.js`** - Sincronizar estructura de archivo

**Ubicación:** `scripts/sync-translations-structure.js`

**Qué hace:**
- Deep merge de estructura de EN a otros idiomas
- Preserva traducciones existentes
- Agrega keys faltantes (en inglés)
- Útil cuando la estructura de un archivo cambió

**Cuándo usar:**
```bash
# SI un archivo tiene estructura diferente entre idiomas
# Ejemplo: projects.json en EN tiene 13 keys, pero FR solo tiene 5

# ENTONCES sincronizar:
node scripts/sync-translations-structure.js projects

# Resultado: projects.json en todos los idiomas tiene 13 keys
```

**Uso:**
```bash
node scripts/sync-translations-structure.js <filename-without-extension>

# Ejemplos:
node scripts/sync-translations-structure.js projects
node scripts/sync-translations-structure.js dashboard-bundui
node scripts/sync-translations-structure.js common
```

**Proceso:**
```
1. Lee apps/dashboard/src/lib/i18n/translations/en/{filename}.json
2. Para cada idioma:
   - Lee {filename}.json del idioma
   - Deep merge: estructura de EN + traducciones existentes
   - Guarda archivo con estructura completa
```

---

### **`scripts/check-missing-files.js`** - Detectar archivos faltantes

**Ubicación:** `scripts/check-missing-files.js`

**Qué hace:**
- Auditoría rápida de archivos faltantes por idioma
- Lista específicamente qué archivos faltan en qué idioma

**Cuándo usar:**
```bash
# Auditoría rápida
node scripts/check-missing-files.js

# Resultado: Si TODO está bien
Missing files: 0

# Resultado: Si faltan archivos
Missing files: 3
[
  { "locale": "it", "file": "concept-restaurant.json" },
  { "locale": "ko", "file": "concept-restaurant.json" },
  { "locale": "ar", "file": "concept-restaurant.json" }
]
```

**Útil para:**
- Verificar antes de deploy
- Auditoría rápida del estado
- Debugging

---

### **`scripts/detect-technical-terms.js`** - Detectar términos técnicos mal traducidos ⭐ NUEVO

**Ubicación:** `scripts/detect-technical-terms.js`

**Qué hace:**
Ejecuta **3 validaciones** sobre traducciones IT/KO:

1. ✅ **Términos en inglés:** Verifica que términos técnicos se mantengan en inglés (check-in, dashboard, API, etc.)
2. ⚠️ **Términos de dominio:** Detecta traducciones de conceptos específicos (reserve, room, guest, etc.)
3. ❌ **Errores comunes:** Identifica traducciones literales incorrectas de DeepL

**Cuándo usar:**
```bash
# DESPUÉS de traducir con DeepL (OBLIGATORIO)
node scripts/detect-technical-terms.js --locale it
node scripts/detect-technical-terms.js --locale ko

# Para un archivo específico
node scripts/detect-technical-terms.js --locale it --file concept.json

# Workflow completo:
# 1. Traducir con DeepL
node scripts/translate-with-deepl.js --locale it --source en

# 2. Detectar errores técnicos
node scripts/detect-technical-terms.js --locale it

# 3. Corregir errores detectados manualmente

# 4. Re-validar (debe dar 0 errores)
node scripts/detect-technical-terms.js --locale it
```

**Salida esperada:**

```
================================================================================
REPORTE DE TÉRMINOS TÉCNICOS - IT
================================================================================

📄 concept.json (150 strings)

  ❌ ERRORES (3):
     concept.booking.action.reserve:
       ❌ Traducción incorrecta de "workspace"
       Encontrado: "spazio di lavoro"
       Debería ser: "workspace"
       Razón: Término técnico estándar, se mantiene en inglés en contexto tech

     concept.hotel.resource.room:
       ❌ Traducción incorrecta de "dashboard"
       Encontrado: "cruscotto"
       Debería ser: "dashboard"
       Razón: Término técnico estándar UI/UX

  ⚠️  REVISAR (5):
     concept.coliving.meal.breakfast: ⚠️ Revisar traducción de "breakfast"
       Nota: Desayuno - verificar contexto

  ✅ Correctos: 12

📄 common.json (80 strings)
  ✅ Correctos: 15

================================================================================
RESUMEN GENERAL
================================================================================
✅ Términos correctos: 142
⚠️  Términos a revisar: 8
❌ Errores detectados: 5

⚠️  ACCIÓN REQUERIDA:
   Revisa y corrige los errores detectados antes de hacer commit.
   Ejecuta este script nuevamente después de corregir.
```

**Diccionarios incluidos:**

1. **KEEP_IN_ENGLISH** - Términos que NUNCA se traducen:
   - check-in, check-out, booking
   - dashboard, admin, API, URL
   - email, Wi-Fi, QR, app

2. **DOMAIN_TERMS** - Términos específicos con traducciones esperadas:
   - reserve → prenota (IT), 예약 (KO)
   - room → camera (IT), 방 (KO)
   - breakfast → colazione (IT), 아침 식사 (KO)

3. **COMMON_MISTRANSLATIONS** - Errores típicos de DeepL:
   - workspace → "spazio di lavoro" ❌ (debe ser "workspace" ✅)
   - dashboard → "cruscotto" ❌ (debe ser "dashboard" ✅)

**Archivos analizados:**
- `apps/dashboard/src/lib/i18n/translations/{locale}/*.json`
- Todos los archivos JSON del idioma especificado

**Exit codes:**
- `0` - No hay errores (warnings OK)
- `1` - Errores detectados (requiere corrección)

**⚠️ IMPORTANTE:**
- Ejecutar SIEMPRE después de traducir con DeepL
- Corregir TODOS los errores antes de commit
- Warnings requieren revisión manual (contexto)
- Útil para IT/KO (idiomas pendientes de traducción)

**Referencia completa:**
- Ver `INSTRUCCIONES_TRADUCCION_IT_KO_PARA_ZAI.md` para workflow completo de traducción

---

## ✅ SCRIPTS DE VALIDACIÓN

### **`npm run validate:stability`** - Validar reglas de estabilidad

**Ubicación:** `package.json` (root)

**Qué hace:**
- Ejecuta `validate-stability-rules.js`
- Verifica reglas de hydration
- Verifica versiones de dependencias (no ^)

**Cuándo usar:**
```bash
# ANTES de commit (buena práctica)
npm run validate:stability

# DESPUÉS de cambios en layout/providers
npm run validate:stability
```

---

### **`npm run validate:npm-install`** - Validar dependencias monorepo

**Ubicación:** `package.json` (root)

**Qué hace:**
- Detecta duplicaciones de dependencias core en apps
- Verifica versiones exactas (no caret)

**Cuándo usar:**
```bash
# DESPUÉS de npm install
npm install <package>
npm run validate:npm-install

# ANTES de commit
npm run validate:npm-install
```

---

### **`npm run validate:universal`** - Validación completa

**Ubicación:** `package.json` (root)

**Qué hace:**
- Ejecuta TODAS las validaciones:
  - `validate:stability`
  - `validate:npm-install`
  - `validate:vtk`

**Cuándo usar:**
```bash
# ANTES de commit (validación completa)
npm run validate:universal

# CI/CD
npm run validate:universal && npm run build
```

---

## 🔧 SCRIPTS DE ARREGLO AUTOMÁTICO

### **`npm run fix:npm-duplications`** - Arreglar duplicaciones npm

**Ubicación:** `package.json` (root)

**Qué hace:**
- Elimina automáticamente dependencias duplicadas de apps
- Mueve a root si son compartidas

**Cuándo usar:**
```bash
# SI validate:npm-install falla
npm run validate:npm-install
# ❌ Errors found

# ENTONCES arreglar:
npm run fix:npm-duplications

# Y validar:
npm run validate:npm-install
# ✅ No errors
```

---

## 🛠️ SCRIPTS DE UTILIDAD

### **`scripts/audit-hardcoded-text.js`** - Detectar texto hardcodeado

**Ubicación:** `scripts/audit-hardcoded-text.js`

**Qué hace:**
- Busca strings hardcodeados en componentes
- Detecta texto que debería estar en traducciones

**Cuándo usar:**
```bash
# Auditoría de calidad i18n
node scripts/audit-hardcoded-text.js

# Resultado: Lista de archivos con texto hardcodeado
```

---

### **`scripts/extract-hardcoded-strings.js`** - Extraer strings hardcodeados

**Ubicación:** `scripts/extract-hardcoded-strings.js`

**Qué hace:**
- Extrae todos los strings hardcodeados
- Genera JSON con sugerencias de traducción

**Cuándo usar:**
```bash
# Preparar migración de hardcoded a i18n
node scripts/extract-hardcoded-strings.js
```

---

## 📦 SCRIPTS DE DEPLOY/BUILD

### **`npm run build:dashboard`** - Build dashboard

**Ubicación:** `package.json` (root)

**Qué hace:**
```bash
cd apps/dashboard && npx --no-install next build
```

**Cuándo usar:**
```bash
# ANTES de deploy
npm run build:dashboard

# CI/CD
npm run validate:universal && npm run build:dashboard
```

---

### **`npx tsc --noEmit`** - Validar TypeScript

**Ubicación:** N/A (comando directo)

**Qué hace:**
- Type-check sin emitir archivos
- Detecta errores TypeScript

**Cuándo usar:**
```bash
# En packages/utils
cd packages/utils && npx tsc --noEmit

# En apps/dashboard
cd apps/dashboard && npx tsc --noEmit

# ANTES de commit
npx tsc --noEmit
```

---

## 🎯 WORKFLOWS RECOMENDADOS

### Workflow 1: Agregar Nuevo Producto (ej: Restaurant)

```bash
# 1. Crear archivo EN (master)
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# 2. Editar contenido (agregar conceptos)
nano apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# 3. Copiar a todos los idiomas
node scripts/copy-missing-translation-files.js

# 4. Validar coherencia
node scripts/validate-concepts-coherence.js

# 5. Si hay errores, arreglar
node scripts/fix-concepts-coherence.js

# 6. Validar nuevamente
node scripts/validate-concepts-coherence.js

# 7. Traducir manualmente cada idioma
# (Editar es/, fr/, pt/, etc.)

# 8. Validar final
node scripts/validate-concepts-coherence.js

# 9. Commit
git add apps/dashboard/src/lib/i18n/translations/*/concept-restaurant.json
git commit -m "feat(i18n): Add restaurant concepts (9 locales)"
```

---

### Workflow 2: Arreglar Coherencia de Traducciones

```bash
# 1. Detectar problemas
node scripts/validate-concepts-coherence.js
# ❌ ALGUNAS VALIDACIONES FALLARON

# 2. Arreglar automáticamente
node scripts/fix-concepts-coherence.js

# 3. Validar nuevamente
node scripts/validate-concepts-coherence.js
# ✅ TODAS LAS VALIDACIONES PASARON

# 4. Revisar cambios
git diff

# 5. Commit si todo OK
git add .
git commit -m "fix(i18n): Fix concepts coherence"
```

---

### Workflow 3: Pre-Commit Completo

```bash
# 1. Validar i18n concepts (si tocaste traducciones)
node scripts/validate-concepts-coherence.js

# 2. Validar TypeScript
cd packages/utils && npx tsc --noEmit

# 3. Validar dependencias
npm run validate:npm-install

# 4. Validar estabilidad
npm run validate:stability

# 5. Si TODO pasa, commit
git add .
git commit -m "feat: your feature"

# 6. Si algo falla, arreglar y repetir
```

---

### Workflow 4: Development Daily

```bash
# 1. Levantar servidor en background
./scripts/start-stop-dev.sh start

# 2. Ver estado
./scripts/start-stop-dev.sh status

# 3. Hacer cambios, hot reload automático

# 4. Si necesitas reiniciar
./scripts/start-stop-dev.sh restart

# 5. Al terminar el día
./scripts/start-stop-dev.sh stop
```

---

## 📚 SCRIPTS POR CATEGORÍA

### i18n/Traducciones (6 scripts)
1. `validate-concepts-coherence.js` - Validar coherencia
2. `fix-concepts-coherence.js` - Arreglar coherencia
3. `copy-missing-translation-files.js` - Copiar archivos faltantes
4. `sync-translations-structure.js` - Sincronizar estructura
5. `check-missing-files.js` - Detectar archivos faltantes
6. `detect-technical-terms.js` - Detectar términos técnicos mal traducidos ⭐ NUEVO

### Validación (3 scripts npm)
1. `npm run validate:stability`
2. `npm run validate:npm-install`
3. `npm run validate:universal`

### Utilidad (2 scripts)
1. `audit-hardcoded-text.js`
2. `extract-hardcoded-strings.js`

### Desarrollo (2 scripts)
1. `npm run dev`
2. `start-stop-dev.sh`

### Build (1 script)
1. `npm run build:dashboard`

---

## 🚨 REGLAS IMPORTANTES

### NUNCA ejecutar scripts sin validar después:

```bash
# ❌ MALO
node scripts/fix-concepts-coherence.js
git commit -m "fix"

# ✅ BUENO
node scripts/fix-concepts-coherence.js
node scripts/validate-concepts-coherence.js  # ← VALIDAR
git commit -m "fix(i18n): Fix concepts coherence"
```

### SIEMPRE hacer backup antes de scripts destructivos:

```bash
# ❌ MALO
node scripts/fix-concepts-coherence.js

# ✅ BUENO
git add .
git stash
node scripts/fix-concepts-coherence.js
# Si sale mal: git stash pop
```

### SIEMPRE usar EN como master:

```bash
# ❌ MALO: Crear concepto solo en ES
touch apps/dashboard/src/lib/i18n/translations/es/concept-restaurant.json

# ✅ BUENO: Crear en EN, luego copiar
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json
node scripts/copy-missing-translation-files.js
```

---

## 📖 REFERENCIAS

### Documentación Relacionada
- `GUIA_MANTENIMIENTO_CONCEPTOS.md` - Workflow completo mantenimiento
- `README.md` - Quick reference para AIs
- `docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md` - Arquitectura completa

### Scripts en GitHub
- Todos los scripts están en: `scripts/`
- Scripts npm en: `package.json` (root)

---

**ÚLTIMA ACTUALIZACIÓN:** 2025-12-26
**MANTENIDO POR:** Claude
**VERSIÓN:** 1.0.0
