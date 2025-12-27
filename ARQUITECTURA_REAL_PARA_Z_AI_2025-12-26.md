# 🎯 Instrucciones para Z.AI - Completar Traducciones

**Objetivo:** Traducir 484 keys (19% restante) para llegar al 100%
**Tiempo:** 3.5 horas
**Método:** Traducción manual con tu ayuda

---

## 📋 26 Archivos a Traducir (Por Prioridad)

### EMPEZAR AQUÍ ⚠️ (4 archivos, 2 horas)

1. **ar/default.json - 163 keys**
   - Ruta: `apps/dashboard/src/lib/i18n/translations/ar/default.json`
   - Baseline: `apps/dashboard/src/lib/i18n/translations/en/default.json`

2. **zh/projects.json - 96 keys**
   - Ruta: `apps/dashboard/src/lib/i18n/translations/zh/projects.json`
   - Baseline: `apps/dashboard/src/lib/i18n/translations/en/projects.json`

3. **ko/navigation.json - 83 keys**
   - Ruta: `apps/dashboard/src/lib/i18n/translations/ko/navigation.json`
   - Baseline: `apps/dashboard/src/lib/i18n/translations/en/navigation.json`

4. **it/common.json - 56 keys**
   - Ruta: `apps/dashboard/src/lib/i18n/translations/it/common.json`
   - Baseline: `apps/dashboard/src/lib/i18n/translations/en/common.json`

### Luego estos (22 archivos, 1.5 horas)

5. fr/navigation.json - 17 keys
6. de/projects.json - 15 keys
7. de/navigation.json - 15 keys
8. pt/navigation.json - 10 keys
9. it/navigation.json - 10 keys
10. es/navigation.json - 8 keys
11. de/default.json - 8 keys
12. zh/navigation.json - 7 keys
13. fr/projects.json - 7 keys
14. ar/navigation.json - 6 keys
15. de/common.json - 6 keys
16. fr/default.json - 5 keys
17. fr/common.json - 4 keys
18. pt/projects.json - 4 keys
19. pt/default.json - 4 keys
20. it/projects.json - 3 keys
21. it/default.json - 3 keys
22. es/common.json - 3 keys
23. pt/common.json - 3 keys
24. es/default.json - 2 keys
25. ko/default.json - 1 key
26. *(validación final)*

---

## 🔄 Workflow (Repetir para CADA archivo)

### Paso 1: Leer baseline
```bash
cat apps/dashboard/src/lib/i18n/translations/en/{namespace}.json
```

### Paso 2: Usar este PROMPT exacto

```
Traduce este JSON de inglés a {IDIOMA}. SOLO traduce valores, NO keys.

REGLAS:
- NO traduzcas: Dashboard, API, CRM
- Preserva: {{placeholders}}
- Mantén estructura JSON

IDIOMA: {idioma - ver tabla}

JSON:
{pegar contenido completo del archivo inglés}

OUTPUT (JSON en {idioma}):
```

**Tabla de idiomas:**
- es = Español (España, formal)
- ar = Árabe (Moderno, RTL)
- zh = Chino (Simplificado)
- fr = Francés (Francia, formal)
- pt = Portugués (Brasil, informal)
- de = Alemán (Formal)
- it = Italiano (Formal)
- ko = Coreano (Formal)

### Paso 3: Guardar respuesta
Copiar tu respuesta JSON completa en:
```
apps/dashboard/src/lib/i18n/translations/{locale}/{namespace}.json
```

### Paso 4: Validar cada 5 archivos
```bash
node scripts/audit-missing-translations-projects-v2.js
```

---

## ✅ Ejemplo Completo: ar/default.json

### 1. Leer inglés
```bash
cat apps/dashboard/src/lib/i18n/translations/en/default.json
```

Supongamos que dice:
```json
{
  "welcome": "Welcome",
  "loading": "Loading..."
}
```

### 2. Prompt
```
Traduce este JSON de inglés a Árabe. SOLO traduce valores, NO keys.

REGLAS:
- NO traduzcas: Dashboard, API, CRM
- Preserva: {{placeholders}}
- Mantén estructura JSON

IDIOMA: Árabe (Moderno, RTL)

JSON:
{
  "welcome": "Welcome",
  "loading": "Loading..."
}

OUTPUT (JSON en Árabe):
```

### 3. Tu respuesta (ejemplo)
```json
{
  "welcome": "مرحباً",
  "loading": "جارٍ التحميل..."
}
```

### 4. Guardar
Copiar ese JSON en: `apps/dashboard/src/lib/i18n/translations/ar/default.json`

---

## 🎉 Al Terminar (484 keys)

### Validar
```bash
node scripts/audit-missing-translations-projects-v2.js
```

Debe mostrar: `Total Missing Keys: 0`

### Commit
```bash
git add apps/dashboard/src/lib/i18n/translations/
git commit -m "feat(i18n): Complete 484 translations (100%)

All 9 languages now complete

Co-authored-by: Z.AI <noreply@anthropic.com>"
```

---

**¡Adelante Z.AI! 26 archivos y llegamos al 100% 🚀**
