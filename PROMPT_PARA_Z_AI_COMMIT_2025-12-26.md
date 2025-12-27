# 🤖 Instrucciones para Z.AI - Completar 484 Traducciones Restantes

**Fecha:** 2025-12-26
**Estado:** 81% completo (2,072/2,556 keys)
**Faltan:** 484 keys

---

## 📊 Progreso Actual

Claude (arquitecto) logró traducir automáticamente **2,072 keys** usando Google Cloud Translation API antes de que las API keys expiraran.

**Tu misión:** Completar manualmente las **484 keys faltantes** para llegar al 100%.

---

## 🎯 Traducciones Faltantes (Ordenadas por Prioridad)

### 1. Árabe (ar) - 169 keys ⚠️ MÁS URGENTE

```
apps/dashboard/src/lib/i18n/translations/ar/default.json (163 keys)
apps/dashboard/src/lib/i18n/translations/ar/navigation.json (6 keys)
```

### 2. Chino (zh) - 103 keys

```
apps/dashboard/src/lib/i18n/translations/zh/projects.json (96 keys)
apps/dashboard/src/lib/i18n/translations/zh/navigation.json (7 keys)
```

### 3. Coreano (ko) - 84 keys

```
apps/dashboard/src/lib/i18n/translations/ko/default.json (1 key)
apps/dashboard/src/lib/i18n/translations/ko/navigation.json (83 keys)
```

### 4. Italiano (it) - 72 keys

```
apps/dashboard/src/lib/i18n/translations/it/projects.json (3 keys)
apps/dashboard/src/lib/i18n/translations/it/default.json (3 keys)
apps/dashboard/src/lib/i18n/translations/it/common.json (56 keys)
apps/dashboard/src/lib/i18n/translations/it/navigation.json (10 keys)
```

### 5. Alemán (de) - 44 keys

```
apps/dashboard/src/lib/i18n/translations/de/projects.json (15 keys)
apps/dashboard/src/lib/i18n/translations/de/default.json (8 keys)
apps/dashboard/src/lib/i18n/translations/de/common.json (6 keys)
apps/dashboard/src/lib/i18n/translations/de/navigation.json (15 keys)
```

### 6. Francés (fr) - 33 keys

```
apps/dashboard/src/lib/i18n/translations/fr/projects.json (7 keys)
apps/dashboard/src/lib/i18n/translations/fr/default.json (5 keys)
apps/dashboard/src/lib/i18n/translations/fr/common.json (4 keys)
apps/dashboard/src/lib/i18n/translations/fr/navigation.json (17 keys)
```

### 7. Portugués (pt) - 21 keys

```
apps/dashboard/src/lib/i18n/translations/pt/projects.json (4 keys)
apps/dashboard/src/lib/i18n/translations/pt/default.json (4 keys)
apps/dashboard/src/lib/i18n/translations/pt/common.json (3 keys)
apps/dashboard/src/lib/i18n/translations/pt/navigation.json (10 keys)
```

### 8. Español (es) - 13 keys

```
apps/dashboard/src/lib/i18n/translations/es/default.json (2 keys)
apps/dashboard/src/lib/i18n/translations/es/common.json (3 keys)
apps/dashboard/src/lib/i18n/translations/es/navigation.json (8 keys)
```

---

## 📝 Workflow de Traducción

### Para cada archivo:

1. **Leer baseline (inglés):**
   ```
   apps/dashboard/src/lib/i18n/translations/en/{namespace}.json
   ```

2. **Leer archivo existente (idioma):**
   ```
   apps/dashboard/src/lib/i18n/translations/{locale}/{namespace}.json
   ```

3. **Comparar y encontrar keys faltantes**

4. **Traducir usando el prompt template (abajo)**

5. **Hacer merge manual** (agregar keys sin borrar las existentes)

6. **Guardar archivo actualizado**

7. **Validar:**
   ```bash
   node scripts/audit-missing-translations-projects-v2.js
   ```

---

## 🎨 Prompt Template para Traducción

```
Eres un traductor profesional especializado en interfaces de usuario de software.

TAREA: Traducir este archivo JSON de inglés a [IDIOMA].

REGLAS CRÍTICAS:
1. SOLO traduce los VALORES, NUNCA las keys
2. Preserva la estructura JSON exacta (nested objects)
3. Preserva todos los placeholders: {{count}}, {percentage}, etc.
4. [CONTEXTO DEL IDIOMA - ver tabla abajo]
5. Mantén términos técnicos consistentes (Dashboard, CRM, API, etc.)
6. Retorna SOLO JSON válido, sin explicaciones

NAMESPACE: [namespace]
IDIOMA: [nombre del idioma]

ARCHIVO EN INGLÉS (baseline):
[pega contenido completo del archivo en/]

OUTPUT ([idioma] JSON):
```

### Contextos Específicos por Idioma:

| Idioma | Código | Contexto |
|--------|--------|----------|
| Español | es | Español de España, formal, uso de "vosotros" |
| Árabe | ar | Árabe estándar moderno, considerar RTL |
| Chino | zh | Chino simplificado (China) |
| Francés | fr | Francés de Francia, formal |
| Portugués | pt | Portugués de Brasil, informal, "você" |
| Alemán | de | Alemán estándar, formal, "Sie" |
| Italiano | it | Italiano estándar, formal |
| Coreano | ko | Coreano estándar, formal, honoríficos |

---

## ✅ Ejemplo Completo: Traducir ar/default.json (163 keys)

### Paso 1: Leer baseline
```bash
# Contenido de apps/dashboard/src/lib/i18n/translations/en/default.json
cat apps/dashboard/src/lib/i18n/translations/en/default.json
```

### Paso 2: Verificar archivo árabe existente
```bash
cat apps/dashboard/src/lib/i18n/translations/ar/default.json
```

### Paso 3: Usar el prompt

```
Eres un traductor profesional especializado en interfaces de usuario de software.

TAREA: Traducir este archivo JSON de inglés a Árabe.

REGLAS CRÍTICAS:
1. SOLO traduce los VALORES, NUNCA las keys
2. Preserva la estructura JSON exacta (nested objects)
3. Preserva todos los placeholders: {{count}}, {percentage}, etc.
4. Árabe estándar moderno, considerar layout RTL
5. Mantén términos técnicos consistentes (Dashboard, CRM, API, etc.)
6. Retorna SOLO JSON válido, sin explicaciones

NAMESPACE: default
IDIOMA: Árabe (Estándar Moderno)

ARCHIVO EN INGLÉS (baseline):
{
  "welcome": "Welcome",
  "dashboard": "Dashboard",
  "projects": {
    "title": "Projects",
    "create": "Create Project",
    "empty": "No projects yet"
  }
}

OUTPUT (Árabe JSON):
```

### Paso 4: Respuesta esperada

```json
{
  "welcome": "مرحباً",
  "dashboard": "لوحة التحكم",
  "projects": {
    "title": "المشاريع",
    "create": "إنشاء مشروع",
    "empty": "لا توجد مشاريع بعد"
  }
}
```

### Paso 5: Merge con archivo existente

Abre `apps/dashboard/src/lib/i18n/translations/ar/default.json` y **agrega las nuevas keys preservando las existentes**.

### Paso 6: Validar

```bash
node scripts/audit-missing-translations-projects-v2.js
```

Deberías ver que `ar/default.json` ahora tiene **menos keys faltantes**.

---

## 🚀 Orden Recomendado de Ejecución

### Prioridad 1 (Más Impacto):
1. ✅ `ar/default.json` (163 keys) ← **EMPEZAR AQUÍ**
2. ✅ `zh/projects.json` (96 keys)
3. ✅ `ko/navigation.json` (83 keys)
4. ✅ `it/common.json` (56 keys)

### Prioridad 2 (Medianas):
5. ✅ `fr/navigation.json` (17 keys)
6. ✅ `de/projects.json` (15 keys)
7. ✅ `de/navigation.json` (15 keys)

### Prioridad 3 (Pequeñas - Rápidas):
8-26. Resto de archivos (1-10 keys cada uno)

---

## ⚠️ Errores Comunes a Evitar

1. ❌ **NO traduzcas las keys** del JSON, solo los valores
   ```json
   // ❌ MAL
   {"título": "Projects"}

   // ✅ BIEN
   {"title": "Proyectos"}
   ```

2. ❌ **NO cambies placeholders**
   ```json
   // ❌ MAL
   "message": "Has {porcentaje}% completado"

   // ✅ BIEN
   "message": "Has {percentage}% completado"
   ```

3. ❌ **NO aplanes la estructura**
   ```json
   // ❌ MAL
   {
     "projects.title": "Proyectos"
   }

   // ✅ BIEN
   {
     "projects": {
       "title": "Proyectos"
     }
   }
   ```

4. ❌ **NO traduzcas términos técnicos**
   - Dashboard → Dashboard (no "Tablero")
   - API → API
   - CRM → CRM

---

## 📊 Tracking de Progreso

Ejecuta después de cada traducción:

```bash
node scripts/audit-missing-translations-projects-v2.js
```

**Objetivo Final:** `Total Missing Keys: 0`

**Progreso:**
- Inicial: 484 keys faltantes
- Después de ar/default: ~321 keys faltantes (-163)
- Después de zh/projects: ~225 keys faltantes (-96)
- Después de ko/navigation: ~142 keys faltantes (-83)
- Después de it/common: ~86 keys faltantes (-56)
- [Continuar...]

---

## 🎉 Cuando Termines (Total Missing Keys: 0)

### 1. Ejecutar validación final
```bash
node scripts/audit-missing-translations-projects-v2.js
```

Resultado esperado:
```
✅ ES: COMPLETE (177/177 keys, 100.0%)
✅ AR: COMPLETE (177/177 keys, 100.0%)
✅ ZH: COMPLETE (177/177 keys, 100.0%)
✅ FR: COMPLETE (177/177 keys, 100.0%)
✅ PT: COMPLETE (177/177 keys, 100.0%)
✅ DE: COMPLETE (177/177 keys, 100.0%)
✅ IT: COMPLETE (177/177 keys, 100.0%)
✅ KO: COMPLETE (177/177 keys, 100.0%)

Total Missing Keys: 0
```

### 2. Testing en navegador
```bash
npm run dev -- --port 3005
```

Navega a: `http://localhost:3005/dashboard-bundui/projects-v2`

Prueba **todos los 9 idiomas** usando el selector.

### 3. Commit de cambios

```bash
git add apps/dashboard/src/lib/i18n/translations/
git commit -m "feat(i18n): Complete remaining 484 translations for projects-v2

- Complete ar/default (163 keys), zh/projects (96 keys)
- Complete ko/navigation (83 keys), it/common (56 keys)
- Complete all remaining keys across 8 languages
- Total: 484 keys translated manually

Languages now 100% complete:
- Spanish (es): 479/479 keys
- Arabic (ar): 479/479 keys
- Chinese (zh): 479/479 keys
- French (fr): 479/479 keys
- Portuguese (pt): 479/479 keys
- German (de): 479/479 keys
- Italian (it): 479/479 keys
- Korean (ko): 479/479 keys

All namespaces (projects, default, common, navigation) fully translated.

🤖 Generated with Claude Code
Co-authored-by: Claude Sonnet 4.5 <noreply@anthropic.com>
Co-authored-by: Z.AI <noreply@anthropic.com>"
```

---

## 💡 Tips para Optimizar

1. **Traduce archivos grandes primero** (ar/default, zh/projects, ko/navigation, it/common)
2. **Usa el mismo prompt** para todos los archivos del mismo idioma
3. **Valida frecuentemente** con el script de auditoría
4. **Haz commits parciales** cada 5-10 archivos traducidos

---

## ⏱️ Estimación de Tiempo

| Prioridad | Archivos | Keys | Tiempo Estimado |
|-----------|----------|------|-----------------|
| P1 (grandes) | 4 archivos | 398 keys | ~2 horas |
| P2 (medianos) | 3 archivos | 47 keys | ~30 min |
| P3 (pequeños) | 19 archivos | 39 keys | ~1 hora |
| **TOTAL** | **26 archivos** | **484 keys** | **~3.5 horas** |

---

## 📞 Soporte

Si tienes dudas o necesitas ayuda:
- **Claude (Arquitecto):** Revisa este documento y `TRABAJO_COMPLETADO_2025-12-26.md`
- **Marcelo (Product Owner):** Aprobar cambios finales

---

**Creado por:** Claude Sonnet 4.5
**Para:** Z.AI
**Fecha:** 2025-12-26
**Estado:** 🟡 Pendiente de ejecución

**¡Adelante Z.AI! Estás a solo 484 keys de completar el 100% 🚀**
