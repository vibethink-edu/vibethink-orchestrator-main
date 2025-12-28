# Instrucciones para Traducir IT y KO - Para Z.Ai

**Fecha:** 2025-12-26
**Tarea:** Traducir archivos IT (Italiano) y KO (Coreano)
**Método:** Opción C - Mixed (DeepL + Revisión Manual)
**Estimado:** 6-11 horas total

---

## 📋 RESUMEN EJECUTIVO

**Qué hacer:**
1. Usar DeepL API para traducir automáticamente TODOS los archivos IT y KO
2. Ejecutar script de detección de términos técnicos
3. Revisar SOLO los archivos críticos manualmente
4. Validar en navegador
5. Commit

**Archivos a traducir:**
- **IT (Italiano):** 50 archivos × ~50 strings/archivo = 2,500 strings
- **KO (Coreano):** 50 archivos × ~50 strings/archivo = 2,500 strings

**Estado actual:**
- IT: 50% completo (mitad en inglés - pendiente traducir)
- KO: 50% completo (mitad en inglés - pendiente traducir)

---

## 🚀 WORKFLOW COMPLETO

### **FASE 1: Traducción Automática con DeepL (2-3 horas)**

#### **Paso 1.1: Configurar DeepL API**

1. Ir a https://www.deepl.com/pro-api
2. Crear cuenta gratuita (500,000 caracteres/mes gratis)
3. Obtener API Key
4. Guardar API Key en variable de entorno:

```bash
# Windows PowerShell
$env:DEEPL_API_KEY="tu-api-key-aqui"

# Linux/Mac
export DEEPL_API_KEY="tu-api-key-aqui"
```

#### **Paso 1.2: Instalar DeepL SDK**

```bash
npm install --save-dev deepl-node
```

#### **Paso 1.3: Traducir archivos IT**

```bash
# Traducir TODOS los archivos IT
node scripts/translate-with-deepl.js --locale it --source en

# Output esperado:
# ✅ Traducidos 50 archivos IT
# 📊 Total: 2,500 strings traducidas
# ⏱️ Tiempo: ~45 minutos
```

#### **Paso 1.4: Traducir archivos KO**

```bash
# Traducir TODOS los archivos KO
node scripts/translate-with-deepl.js --locale ko --source en

# Output esperado:
# ✅ Traducidos 50 archivos KO
# 📊 Total: 2,500 strings traducidas
# ⏱️ Tiempo: ~45 minutos
```

#### **Paso 1.5: Validar coherencia**

```bash
# Validar que todos los archivos tengan las mismas keys
node scripts/validate-concepts-coherence.js

# Output esperado:
# ✅ Coherencia validada: 405 archivos
# ✅ IT: 45/45 archivos OK
# ✅ KO: 45/45 archivos OK
```

#### **Paso 1.6: Commit inicial**

```bash
git add apps/dashboard/src/lib/i18n/translations/it/
git add apps/dashboard/src/lib/i18n/translations/ko/
git commit -m "feat(i18n): Add IT/KO translations (DeepL initial)

- Translated 50 IT files (2,500 strings)
- Translated 50 KO files (2,500 strings)
- Used DeepL API for automated translation
- Pending: Manual review of critical files

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### **FASE 2: Detección de Términos Técnicos (30 minutos)**

#### **Paso 2.1: Ejecutar script de detección para IT**

```bash
node scripts/detect-technical-terms.js --locale it
```

**Output esperado:**

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

#### **Paso 2.2: Ejecutar script de detección para KO**

```bash
node scripts/detect-technical-terms.js --locale ko
```

**Revisar output similar al anterior.**

#### **Paso 2.3: Crear lista de archivos a revisar**

Basándote en el output del script, crea una lista de archivos con errores/warnings:

**Ejemplo:**
```
ARCHIVOS CON ERRORES (Prioridad ALTA):
- concept.json (3 errores)
- common.json (2 errores)
- navigation.json (1 error)

ARCHIVOS CON WARNINGS (Prioridad MEDIA):
- concept-hotel.json (5 warnings)
- concept-coliving.json (3 warnings)
```

---

### **FASE 3: Revisión Manual Selectiva (4-6 horas)**

#### **Paso 3.1: Revisar archivos CRÍTICOS (Alta prioridad)**

**Archivos críticos a revisar SIEMPRE:**

1. **`common.json`** (HIGH - usado en todas partes)
   - Verificar términos técnicos: save, cancel, confirm, delete, edit
   - Verificar mensajes de usuario frecuentes
   - Tiempo estimado: 30 min

2. **`navigation.json`** (HIGH - siempre visible)
   - Verificar menús de navegación
   - Verificar breadcrumbs
   - Tiempo estimado: 20 min

3. **`errors.json`** (HIGH - mensajes críticos)
   - Verificar mensajes de error
   - Verificar validaciones
   - Tiempo estimado: 30 min

4. **`dashboard-bundui.json`** (MEDIUM - dashboard principal)
   - Verificar labels de dashboard
   - Verificar widgets
   - Tiempo estimado: 45 min

5. **`concept.json`** (MEDIUM - conceptos compartidos)
   - Verificar traducciones de conceptos base
   - Verificar coherencia con productos
   - Tiempo estimado: 1 hora

**TOTAL TIEMPO ARCHIVOS CRÍTICOS:** ~3 horas/idioma × 2 idiomas = **6 horas**

#### **Paso 3.2: Revisar archivos con ERRORES detectados**

Usar el output del script `detect-technical-terms.js` para identificar archivos con errores.

**Para cada archivo con errores:**

1. Abrir archivo en editor
2. Buscar el término señalado por el script
3. Corregir según recomendación del script
4. Guardar

**Ejemplo:**

```json
// ❌ ANTES (incorrecto):
{
  "concept": {
    "booking": {
      "workspace": "spazio di lavoro"  // ❌ Error detectado
    }
  }
}

// ✅ DESPUÉS (corregido):
{
  "concept": {
    "booking": {
      "workspace": "workspace"  // ✅ Mantenido en inglés
    }
  }
}
```

#### **Paso 3.3: Re-ejecutar detección después de corregir**

```bash
# Verificar que se corrigieron los errores
node scripts/detect-technical-terms.js --locale it
node scripts/detect-technical-terms.js --locale ko

# Output esperado después de corregir:
# ✅ Términos correctos: 150
# ⚠️  Términos a revisar: 3
# ❌ Errores detectados: 0  ← Debe ser 0
```

#### **Paso 3.4: Commit de correcciones**

```bash
git add apps/dashboard/src/lib/i18n/translations/it/
git add apps/dashboard/src/lib/i18n/translations/ko/
git commit -m "fix(i18n): Refine IT/KO translations (manual review)

- Reviewed critical files (common, navigation, errors, dashboard-bundui, concept)
- Fixed technical terms detected by detect-technical-terms.js
- Adjusted domain-specific terminology
- IT: 0 errors, 3 warnings remaining
- KO: 0 errors, 2 warnings remaining

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### **FASE 4: Validación en Navegador (1-2 horas)**

#### **Paso 4.1: Levantar servidor de desarrollo**

```bash
# Levantar en puerto 3005
npx next@15.3.4 dev -p 3005
```

#### **Paso 4.2: Probar idioma IT**

1. Abrir http://localhost:3005/dashboard-bundui/projects-v2
2. Cambiar idioma a **Italiano (IT)**
3. Verificar:
   - ✅ Sidebar tiene labels en italiano
   - ✅ Navegación tiene breadcrumbs en italiano
   - ✅ Botones tienen labels en italiano
   - ✅ Mensajes de error están en italiano
   - ✅ No hay textos en inglés (excepto términos técnicos)

4. Tomar screenshots de cualquier problema detectado

#### **Paso 4.3: Probar idioma KO**

1. Cambiar idioma a **Coreano (KO)**
2. Verificar los mismos puntos que en IT
3. Tomar screenshots de problemas

#### **Paso 4.4: Corregir problemas encontrados**

Si encuentras textos en inglés o traducciones incorrectas:

1. Identificar el archivo JSON responsable
2. Buscar la key correspondiente
3. Corregir la traducción
4. Refrescar navegador (Hot Reload debería aplicar cambios)
5. Verificar que se corrigió

#### **Paso 4.5: Commit final de ajustes**

```bash
git add apps/dashboard/src/lib/i18n/translations/it/
git add apps/dashboard/src/lib/i18n/translations/ko/
git commit -m "fix(i18n): Polish IT/KO based on context review

- Fixed translations found during browser testing
- Adjusted context-specific terms
- Verified all UI elements display correctly
- IT: 100% complete
- KO: 100% complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🛡️ VALIDACIONES OBLIGATORIAS

Antes de considerar la tarea completa, ejecutar:

```bash
# 1. Validar coherencia de archivos
node scripts/validate-concepts-coherence.js
# Output esperado: ✅ Coherencia validada: 405 archivos

# 2. Validar estructura de traducciones
node scripts/sync-translations-structure.js
# Output esperado: ✅ Estructura sincronizada

# 3. Detectar términos técnicos (debe dar 0 errores)
node scripts/detect-technical-terms.js --locale it
node scripts/detect-technical-terms.js --locale ko
# Output esperado: ❌ Errores detectados: 0

# 4. Verificar que no hay archivos faltantes
node scripts/check-missing-files.js
# Output esperado: ✅ No hay archivos faltantes

# 5. Build de TypeScript (debe compilar sin errores)
cd apps/dashboard
npm run build
# Output esperado: ✅ Compiled successfully
```

---

## 📊 CHECKLIST DE COMPLETITUD

Marca cada item cuando esté completo:

### **IT (Italiano):**

- [ ] FASE 1: Traducción automática con DeepL (50 archivos)
- [ ] FASE 2: Detección de términos técnicos ejecutada
- [ ] FASE 3: Archivos críticos revisados manualmente (5 archivos)
  - [ ] common.json
  - [ ] navigation.json
  - [ ] errors.json
  - [ ] dashboard-bundui.json
  - [ ] concept.json
- [ ] FASE 3: Errores detectados corregidos (0 errores)
- [ ] FASE 4: Validación en navegador (screenshots tomados)
- [ ] FASE 4: Problemas de contexto corregidos
- [ ] Validaciones obligatorias pasadas (5 scripts)
- [ ] Commits creados con mensajes descriptivos

### **KO (Coreano):**

- [ ] FASE 1: Traducción automática con DeepL (50 archivos)
- [ ] FASE 2: Detección de términos técnicos ejecutada
- [ ] FASE 3: Archivos críticos revisados manualmente (5 archivos)
  - [ ] common.json
  - [ ] navigation.json
  - [ ] errors.json
  - [ ] dashboard-bundui.json
  - [ ] concept.json
- [ ] FASE 3: Errores detectados corregidos (0 errores)
- [ ] FASE 4: Validación en navegador (screenshots tomados)
- [ ] FASE 4: Problemas de contexto corregidos
- [ ] Validaciones obligatorias pasadas (5 scripts)
- [ ] Commits creados con mensajes descriptivos

---

## 🎯 MÉTRICAS DE ÉXITO

Al completar esta tarea, deberías lograr:

| Métrica | Objetivo | Cómo medir |
|---------|----------|------------|
| **Archivos traducidos** | 100 archivos (50 IT + 50 KO) | `ls translations/it/*.json \| wc -l` |
| **Strings traducidas** | ~5,000 strings total | Contar en archivos JSON |
| **Errores técnicos** | 0 errores | `detect-technical-terms.js` output |
| **Coherencia** | 100% coherente | `validate-concepts-coherence.js` pasa |
| **Build** | Compila sin errores | `npm run build` exitoso |
| **Idiomas completos** | 9/9 idiomas al 90%+ | EN=100%, ES=95%, IT=100%, KO=100%, etc. |

---

## 💡 TIPS Y MEJORES PRÁCTICAS

### **Tip 1: Batch Processing**

No traduzcas archivo por archivo. Usa el script de DeepL para procesar todos de una vez:

```bash
# ✅ BUENO (procesa todos):
node scripts/translate-with-deepl.js --locale it --source en

# ❌ MALO (uno por uno):
node scripts/translate-with-deepl.js --locale it --file concept.json
node scripts/translate-with-deepl.js --locale it --file common.json
# ... (50 veces) 😱
```

### **Tip 2: Usa el script de detección ANTES de revisión manual**

El script te dice EXACTAMENTE qué archivos revisar:

```bash
# 1. Ejecutar detección
node scripts/detect-technical-terms.js --locale it > it-report.txt

# 2. Abrir reporte
cat it-report.txt

# 3. Revisar SOLO archivos con errores/warnings
# (en vez de revisar todos los 50 archivos)
```

### **Tip 3: Términos técnicos - Cuando mantener en inglés**

**Mantener en inglés:**
- check-in, check-out (estándar hotelero internacional)
- dashboard, admin, API, URL (términos técnicos UI/UX)
- email, Wi-Fi, QR (tecnología universal)
- workspace (contexto tech, se usa en inglés)

**Traducir siempre:**
- reserve → prenota (IT), 예약 (KO)
- room → camera (IT), 방 (KO)
- guest → ospite (IT), 손님 (KO)
- breakfast → colazione (IT), 아침 식사 (KO)

### **Tip 4: Usa el contexto del producto**

Si una palabra aparece en `concept-hotel.json`, el contexto es hotelero:
- "room" → "camera" (habitación de hotel, no sala)
- "guest" → "ospite" (huésped, no invitado genérico)

Si aparece en `concept-restaurant.json`, el contexto es restaurante:
- "table" → "tavolo" (mesa de restaurante)
- "menu" → "menù" (carta de restaurante)

### **Tip 5: Commits frecuentes**

No esperes a terminar TODO para hacer commit. Haz commits por fase:

```bash
# Commit después de FASE 1 (DeepL)
git commit -m "feat(i18n): Add IT translations (DeepL initial)"

# Commit después de FASE 3 (Revisión manual)
git commit -m "fix(i18n): Refine IT translations (manual review)"

# Commit después de FASE 4 (Validación navegador)
git commit -m "fix(i18n): Polish IT based on context review"
```

---

## ❓ FAQ - Preguntas Frecuentes

### **Q1: ¿Qué hago si DeepL traduce un término técnico incorrectamente?**

**R:** El script `detect-technical-terms.js` lo detectará automáticamente. Corrígelo manualmente en FASE 3.

### **Q2: ¿Qué hago si encuentro un concepto nuevo que no está en el diccionario?**

**R:** Agrégalo al script `detect-technical-terms.js` en la sección `DOMAIN_TERMS`:

```javascript
'nuevo_concepto': {
  it: ['traduzione italiana'],
  ko: ['한국어 번역'],
  note: 'Descripción del concepto'
}
```

### **Q3: ¿Cómo sé si un archivo es "crítico"?**

**R:** Archivos críticos son los que:
- Se usan en TODAS las páginas (common.json, navigation.json)
- Muestran mensajes importantes (errors.json)
- Están siempre visibles (dashboard-bundui.json)

### **Q4: ¿Qué hago si el script de validación falla?**

**R:** Lee el output del script. Te dirá EXACTAMENTE qué está mal:

```bash
❌ ERRORES DETECTADOS:
   concept.json (IT) tiene 3 keys faltantes: booking.action.reserve, ...
   Solución: Agregar estas keys desde EN
```

### **Q5: ¿Puedo usar Google Translate en vez de DeepL?**

**R:** No recomendado. DeepL es MUCHO mejor para contexto técnico y mantiene coherencia. Google Translate tiende a traducir literalmente términos técnicos.

---

## 🚨 ERRORES COMUNES A EVITAR

### **Error 1: Traducir términos técnicos literalmente**

```json
// ❌ MAL:
{
  "dashboard": "cruscotto",  // ← Literal en italiano (tablero de auto)
  "workspace": "spazio di lavoro"  // ← Literal (espacio de trabajo)
}

// ✅ BIEN:
{
  "dashboard": "dashboard",  // ← Término técnico estándar
  "workspace": "workspace"   // ← Término técnico estándar
}
```

### **Error 2: No validar antes de commit**

```bash
# ❌ MAL:
git add .
git commit -m "translations done"
# (sin ejecutar scripts de validación)

# ✅ BIEN:
node scripts/validate-concepts-coherence.js
node scripts/detect-technical-terms.js --locale it
git add .
git commit -m "feat(i18n): Add IT translations"
```

### **Error 3: No revisar archivos críticos manualmente**

DeepL es bueno, pero NO perfecto. SIEMPRE revisa:
- common.json
- navigation.json
- errors.json

### **Error 4: Ignorar warnings del script**

```
⚠️  REVISAR (5):
   concept.coliving.meal.breakfast: ⚠️ Revisar traducción de "breakfast"
```

Si el script dice "REVISAR", revísalo. Puede ser correcto o incorrecto según contexto.

---

## 📞 AYUDA Y SOPORTE

Si tienes dudas durante la traducción:

1. **Revisa este documento primero** (90% de dudas resueltas aquí)
2. **Ejecuta el script correspondiente** (te dirá qué hacer)
3. **Revisa `AI_AGENT_ONBOARDING.md`** (reglas generales del proyecto)
4. **Consulta con Claude o Product Owner** (si aún tienes dudas)

---

## ✅ RESUMEN FINAL

**Objetivo:** Traducir IT y KO de 50% → 100% completitud

**Método:** DeepL (automatizado) + Revisión manual (selectiva)

**Tiempo estimado:** 6-11 horas total
- FASE 1: 2-3 horas (DeepL automático)
- FASE 2: 30 min (detección términos técnicos)
- FASE 3: 4-6 horas (revisión manual selectiva)
- FASE 4: 1-2 horas (validación navegador)

**Scripts a usar:**
1. `translate-with-deepl.js` - Traducción automática
2. `detect-technical-terms.js` - Detección de errores técnicos ⭐ NUEVO
3. `validate-concepts-coherence.js` - Validación de coherencia
4. `sync-translations-structure.js` - Sincronización de estructura
5. `check-missing-files.js` - Detección de archivos faltantes

**Resultado esperado:**
- ✅ 100 archivos traducidos (50 IT + 50 KO)
- ✅ ~5,000 strings traducidas
- ✅ 0 errores técnicos detectados
- ✅ Build compila sin errores
- ✅ Validado en navegador

---

**CREADO POR:** Claude
**FECHA:** 2025-12-26
**PARA:** Z.Ai
**VERSIÓN:** 1.0.0

¡Buena suerte con las traducciones! 🚀
