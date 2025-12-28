# ✅ Lista de Pendientes i18n - Resumen Ejecutivo

**Fecha:** 2025-12-26
**Estado:** Arquitectura completa, faltan traducciones + testing

---

## 🎯 LO QUE FALTA (Quick View)

### 1. TRADUCCIONES (3-4 horas) 🔥 URGENTE
**Problema:** Strings sin traducir en la interfaz

**Qué hacer:**
- Traducir 4 namespaces: `v2`, `sidepanel`, `timeline`, `default`
- Para 8 idiomas: es, ar, zh, fr, pt, de, it, ko
- Total: 32 archivos JSON

**Scripts que Z.AI debe crear:**
```bash
scripts/audit-missing-translations-projects-v2.js  # Detectar faltantes
scripts/translate-namespace.js                      # Traducir con AI
```

**Comando:**
```bash
# Z.AI ejecutará esto para cada namespace e idioma
for lang in es ar zh fr pt de it ko; do
  node scripts/translate-namespace.js v2 $lang
  node scripts/translate-namespace.js sidepanel $lang
  node scripts/translate-namespace.js timeline $lang
  node scripts/translate-namespace.js default $lang
done
```

---

### 2. TESTING (2-3 horas) 🧪
**Qué hacer:**
- Abrir `http://localhost:3005/dashboard-bundui/projects-v2`
- Cambiar entre 9 idiomas (en, es, ar, zh, fr, pt, de, it, ko)
- Tomar screenshot de cada uno
- Verificar que todo esté traducido

**Checklist:**
- [ ] 9 screenshots guardados en `docs/testing/screenshots-2025-12-26/`
- [ ] RTL funciona en árabe
- [ ] Performance <500ms al cambiar idioma
- [ ] Console sin errores

---

### 3. OPTIMIZACIONES (3-4 horas) ⚡ OPCIONAL
**Qué hacer:**
- Verificar bundle splitting
- Implementar prefetch de idiomas comunes
- (Opcional) Service Worker para cache offline

**Impacto:**
- Cambio de idioma más rápido
- Menos uso de bandwidth

---

### 4. DOCUMENTACIÓN (1 hora) 📚
**Qué crear:**
- Actualizar `docs/architecture/AI_AGENT_ONBOARDING.md` con sección i18n
- Crear `docs/architecture/I18N_CHANGELOG.md`

---

## ⏱️ TIEMPO TOTAL

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Traducciones | 3-4h | 🔥 ALTA |
| Testing | 2-3h | 🔥 ALTA |
| Optimizaciones | 3-4h | ⚡ MEDIA |
| Docs | 1h | ⚡ MEDIA |
| **TOTAL** | **9-12h** | |

**Con AI agresivo:** 6-8 horas

---

## 📊 ESTADO ACTUAL VS OBJETIVO

### ✅ YA FUNCIONA
- ✅ Arquitectura de 3 capas implementada
- ✅ Server levanta sin errores
- ✅ Navegación entre 9 idiomas funciona
- ✅ Cache optimizado (no re-carga)
- ✅ Build completa sin errores

### ⚠️ FALTA
- ⚠️ ~30% de strings sin traducir (v2, sidepanel, timeline, default)
- ⚠️ Testing exhaustivo de 9 idiomas
- ⚠️ Screenshots de validación
- ⚠️ Optimizaciones de performance
- ⚠️ Docs actualizadas

### 🎯 OBJETIVO FINAL
- ✅ 100% strings traducidos en namespaces activos
- ✅ Testing validado con screenshots
- ✅ Performance <500ms
- ✅ Docs completas para onboarding de agentes

---

## 🚀 PARA Z.AI - EMPEZAR AQUÍ

### Fase 1: Traducciones (PRIORIDAD #1)

**Paso 1:** Crear script de auditoría
```bash
# Z.AI crea: scripts/audit-missing-translations-projects-v2.js
# Detecta qué namespaces faltan traducir
node scripts/audit-missing-translations-projects-v2.js
```

**Paso 2:** Crear script de traducción
```bash
# Z.AI crea: scripts/translate-namespace.js
# Usa Anthropic API para traducir automáticamente
```

**Paso 3:** Traducir todos los namespaces
```bash
# Z.AI ejecuta para cada combinación namespace × idioma
for ns in v2 sidepanel timeline default; do
  for lang in es ar zh fr pt de it ko; do
    node scripts/translate-namespace.js $ns $lang
  done
done
```

**Paso 4:** Agregar a preload
```typescript
// Z.AI edita: apps/dashboard/app/layout.tsx
<I18nProvider
  preloadNamespaces={[
    'common',
    'navigation',
    'concept',
    'v2',        // ← AGREGAR
    'sidepanel', // ← AGREGAR
    'timeline',  // ← AGREGAR
    'default',   // ← AGREGAR
    // ...
  ]}
>
```

**Paso 5:** Commit
```bash
git add .
git commit -m "feat(i18n): Complete traditional namespace translations for 9 languages

- Translate v2, sidepanel, timeline, default namespaces
- Add missing translations for es, ar, zh, fr, pt, de, it, ko
- Add namespaces to preloadNamespaces in layout.tsx
- Scripts: audit-missing-translations, translate-namespace

Total: 32 JSON files updated (4 namespaces × 8 languages)

🤖 Generated with Claude Code
Co-authored-by: Claude Sonnet 4.5 <noreply@anthropic.com>
"
```

---

### Fase 2: Testing (PRIORIDAD #2)

**Paso 1:** Abrir página test
```
http://localhost:3005/dashboard-bundui/projects-v2
```

**Paso 2:** Cambiar a cada idioma y screenshot
```bash
# Z.AI hace esto manualmente (o automatiza con Playwright):
mkdir -p docs/testing/screenshots-2025-12-26

# Para cada idioma:
# 1. Seleccionar idioma en UI
# 2. Esperar 1 segundo
# 3. Screenshot fullpage
# 4. Guardar como: {locale}.png
```

**Paso 3:** Verificar checklist
- [ ] Inglés (en) - Baseline ✅
- [ ] Español (es) - Todo traducido
- [ ] Árabe (ar) - RTL funciona
- [ ] Chino (zh) - Caracteres correctos
- [ ] Francés (fr) - Todo traducido
- [ ] Portugués (pt) - Todo traducido
- [ ] Alemán (de) - Todo traducido
- [ ] Italiano (it) - Todo traducido
- [ ] Coreano (ko) - Todo traducido

**Paso 4:** Commit
```bash
git add docs/testing/screenshots-2025-12-26/
git commit -m "test(i18n): Add multi-language validation screenshots

- Screenshots for 9 languages (en, es, ar, zh, fr, pt, de, it, ko)
- RTL validated for Arabic
- All namespaces translated and verified

🤖 Generated with Claude Code
Co-authored-by: Claude Sonnet 4.5 <noreply@anthropic.com>
"
```

---

## 📁 ARCHIVOS IMPORTANTES

### Para Lectura (Z.AI debe leer primero):
1. `RESUMEN_FINAL_I18N_PARA_Z_AI_2025-12-26.md` ← **LEER COMPLETO**
2. `docs/architecture/I18N_MULTI_DEPARTMENT_ARCHITECTURE.md` ← Guía completa
3. `ARQUITECTURA_REAL_PARA_Z_AI_2025-12-26.md` ← Estado real del sistema

### Para Crear (Z.AI debe crear):
1. `scripts/audit-missing-translations-projects-v2.js`
2. `scripts/translate-namespace.js`
3. `docs/testing/screenshots-2025-12-26/*.png` (9 imágenes)
4. `docs/architecture/I18N_CHANGELOG.md`

### Para Editar (Z.AI debe modificar):
1. `apps/dashboard/app/layout.tsx` (agregar namespaces a preload)
2. `apps/dashboard/src/lib/i18n/translations/{locale}/*.json` (32 archivos)
3. `docs/architecture/AI_AGENT_ONBOARDING.md` (agregar sección i18n)

---

## 🎓 DECISIONES TOMADAS (Por Marcelo)

1. ✅ **Traducir los 9 idiomas** (no solo prioritarios)
2. ✅ **Testing manual** con screenshots (no automatizar por ahora)
3. ✅ **Optimizaciones críticas** solamente (bundle + prefetch)
4. ❌ **Service Worker** - NO implementar (no es MVP)
5. ❌ **Refactor concepts** - Solo documentar, NO implementar ahora

---

## ⚡ QUICK START PARA Z.AI

```bash
# 1. Leer documentación completa
cat RESUMEN_FINAL_I18N_PARA_Z_AI_2025-12-26.md

# 2. Crear scripts
# (Z.AI crea audit-missing-translations-projects-v2.js)
# (Z.AI crea translate-namespace.js)

# 3. Auditar
node scripts/audit-missing-translations-projects-v2.js

# 4. Traducir
for ns in v2 sidepanel timeline default; do
  for lang in es ar zh fr pt de it ko; do
    node scripts/translate-namespace.js $ns $lang
  done
done

# 5. Actualizar layout.tsx
# (Z.AI edita preloadNamespaces array)

# 6. Commit
git add .
git commit -m "feat(i18n): Complete traditional namespace translations"

# 7. Testing manual
# (Z.AI abre http://localhost:3005/dashboard-bundui/projects-v2)
# (Z.AI cambia idiomas y toma screenshots)

# 8. Final commit
git add docs/testing/
git commit -m "test(i18n): Add validation screenshots"

# 9. Listo! 🎉
```

---

## 📞 CONTACTO

Si Z.AI tiene dudas:
- Leer primero: `RESUMEN_FINAL_I18N_PARA_Z_AI_2025-12-26.md` (detallado)
- Código de referencia: `apps/dashboard/src/lib/i18n/`
- Ejemplos: Ver archivos existentes en `translations/en/`

---

**Última actualización:** 2025-12-26
**Creado por:** Claude Sonnet 4.5
**Para:** Marcelo (Product Owner) y Z.AI (Implementation Agent)
