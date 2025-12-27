# 🎯 Instrucciones Simplificadas para Z.AI - Completar Traducciones

**Objetivo:** Traducir 484 keys faltantes (19% restante)
**Tiempo:** ~3.5 horas
**Fecha:** 2025-12-26

---

## 📋 Lista Completa de Archivos a Traducir (26 archivos)

### PRIORIDAD 1 - GRANDES (4 archivos, 398 keys, ~2h)

1. **ar/default.json** - 163 keys ⚠️ EMPEZAR AQUÍ
2. **zh/projects.json** - 96 keys
3. **ko/navigation.json** - 83 keys
4. **it/common.json** - 56 keys

### PRIORIDAD 2 - MEDIANOS (3 archivos, 47 keys, ~30min)

5. **fr/navigation.json** - 17 keys
6. **de/projects.json** - 15 keys
7. **de/navigation.json** - 15 keys

### PRIORIDAD 3 - PEQUEÑOS (19 archivos, 39 keys, ~1h)

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

---

## 🔄 Workflow (Para CADA archivo)

### 1. Leer archivos
```bash
# Baseline (inglés)
cat apps/dashboard/src/lib/i18n/translations/en/{namespace}.json

# Existente (idioma)
cat apps/dashboard/src/lib/i18n/translations/{locale}/{namespace}.json
```

### 2. Traducir con este PROMPT:

```
Eres traductor profesional de UI. Traduce SOLO valores de inglés a {IDIOMA}.

REGLAS:
1. NO traduzcas keys (nombres)
2. Preserva {{placeholders}}
3. Mantén estructura JSON
4. NO traduzcas: Dashboard, API, CRM

IDIOMA: {ver tabla abajo}

JSON INGLÉS:
{pegar contenido completo del archivo en/}

OUTPUT ({idioma} JSON):
```

**Tabla de Contextos:**
- es: Español (España, formal)
- ar: Árabe (Moderno, RTL)
- zh: Chino (Simplificado)
- fr: Francés (Francia, formal)
- pt: Portugués (Brasil, "você")
- de: Alemán (Formal, "Sie")
- it: Italiano (Formal)
- ko: Coreano (Formal, honoríficos)

### 3. Merge
- Copiar respuesta de Z.AI
- Pegar en archivo correspondiente
- Guardar

### 4. Validar cada 5 archivos
```bash
node scripts/audit-missing-translations-projects-v2.js
```

---

## ✅ Ejemplo: ar/default.json

### Paso 1: Leer inglés
```bash
cat apps/dashboard/src/lib/i18n/translations/en/default.json
```

### Paso 2: Prompt
```
Eres traductor profesional de UI. Traduce SOLO valores de inglés a Árabe.

REGLAS:
1. NO traduzcas keys (nombres)
2. Preserva {{placeholders}}
3. Mantén estructura JSON
4. NO traduzcas: Dashboard, API, CRM

IDIOMA: Árabe (Estándar Moderno, RTL)

JSON INGLÉS:
{
  "welcome": "Welcome",
  "loading": "Loading..."
}

OUTPUT (Árabe JSON):
```

### Paso 3: Guardar respuesta
Copiar JSON árabe a: `apps/dashboard/src/lib/i18n/translations/ar/default.json`

---

## 🎉 Al Terminar

```bash
# Validar
node scripts/audit-missing-translations-projects-v2.js
# Debe mostrar: Total Missing Keys: 0

# Commit
git add apps/dashboard/src/lib/i18n/translations/
git commit -m "feat(i18n): Complete 484 translations (100%)

- All 9 languages now 100% complete
- 26 files translated by Z.AI
- Total: 484 keys

🤖 Generated with Claude Code
Co-authored-by: Z.AI <noreply@anthropic.com>"
```

---

**Creado:** Claude Sonnet 4.5
**Para:** Z.AI
**Prioridad:** ALTA
