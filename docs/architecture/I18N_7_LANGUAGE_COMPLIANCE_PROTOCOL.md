# Protocolo de Cumplimiento de Idiomas (9-Language Compliance)

**🚨 OBLIGATORIO PARA TODOS LOS AGENTES AI**

---

## 🎯 Objetivo

Garantizar que **TODA** pantalla, proceso o componente importado tenga soporte completo para los **9 idiomas**.

**🚨 CRÍTICO: English (en) SIEMPRE primero en todos los arrays y listas.**

**🚨 REGLA AUTOMÁTICA: Cuando se agrega un nuevo componente/módulo, automáticamente debe incluir traducciones para TODOS los 9 idiomas.**

### Idiomas Soportados (English First):

1. 🇺🇸 **en** (English) ⭐ **PRIMERO SIEMPRE**
2. 🇪🇸 **es** (Español)
3. 🇫🇷 **fr** (Français)
4. 🇵🇹 **pt** (Português)
5. 🇩🇪 **de** (Deutsch)
6. 🇮🇹 **it** (Italiano) - Agregado automáticamente en nuevos componentes
7. 🇰🇷 **ko** (한국어) - Agregado automáticamente en nuevos componentes
8. 🇸🇦 **ar** (العربية)
9. 🇨🇳 **zh** (中文)

**Orden en arrays:** `['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh']`

---

## ⚠️ Regla Crítica

**ANTES de finalizar CUALQUIER trabajo, el agente DEBE verificar compliance de 7 idiomas.**

---

## 📋 Checklist Obligatorio

### ✅ Cuando validas una pantalla:

- [ ] ¿Todos los textos visibles usan `t('key')`? (NO hardcode)
- [ ] ¿Existen traducciones en `en/[namespace].json`? ⭐ (English First)
- [ ] ¿Existen traducciones en `es/[namespace].json`?
- [ ] ¿Existen traducciones en `fr/[namespace].json`?
- [ ] ¿Existen traducciones en `pt/[namespace].json`?
- [ ] ¿Existen traducciones en `de/[namespace].json`?
- [ ] ¿Existen traducciones en `it/[namespace].json`? (OBLIGATORIO en nuevos componentes)
- [ ] ¿Existen traducciones en `ko/[namespace].json`? (OBLIGATORIO en nuevos componentes)
- [ ] ¿Existen traducciones en `ar/[namespace].json`?
- [ ] ¿Existen traducciones en `zh/[namespace].json`?
- [ ] ¿Todas las keys existen en los 9 idiomas?
- [ ] ¿El namespace está en `types.ts`?
- [ ] ¿El namespace está preload en `layout.tsx`?

**Si alguna respuesta es NO → NO FINALIZAR hasta cumplir.**

---

### ✅ Cuando ves un proceso:

- [ ] ¿El proceso muestra mensajes al usuario?
- [ ] Si SÍ → ¿Usa `t('key')`?
- [ ] ¿Existen traducciones en los 9 idiomas? (en, es, fr, pt, de, it, ko, ar, zh)
- [ ] ¿Los mensajes de error están traducidos?
- [ ] ¿Los mensajes de éxito están traducidos?
- [ ] ¿Los estados (loading, ready, etc.) están traducidos?

**Si hay texto visible → DEBE estar en 7 idiomas.**

---

### ✅ Cuando importas un nuevo componente:

**ANTES de usar el componente:**

1. **Verificar si tiene i18n:**
   ```typescript
   // Buscar en el componente:
   - useTranslation
   - t('key')
   - i18n
   ```

2. **Si NO tiene i18n:**
   - [ ] Identificar TODOS los textos hardcodeados
   - [ ] Crear namespace o usar existente
   - [ ] Agregar traducciones en `en/[namespace].json`
   - [ ] Traducir a otros 6 idiomas (es, fr, pt, de, ar, zh)
   - [ ] Reemplazar hardcode con `t('key')`
   - [ ] Verificar que funcione en los 7 idiomas

3. **Si YA tiene i18n:**
   - [ ] Verificar que use namespace correcto
   - [ ] Verificar que las keys existan en 7 idiomas
   - [ ] Si falta algún idioma → AGREGAR antes de usar

4. **Después de importar:**
   - [ ] Ejecutar: `node scripts/validate-i18n-keys.js`
   - [ ] Ejecutar: `node scripts/audit-hardcoded-text.js`
   - [ ] Probar cambiar idioma en la UI
   - [ ] Verificar que NO aparezcan keys sin traducir

---

## 🔍 Proceso de Validación Automática

### Script 1: Validar Keys en 7 Idiomas

```bash
node scripts/validate-i18n-keys.js [namespace]
```

**Debe mostrar:**
- ✅ Todas las keys existen en en
- ✅ Todas las keys existen en es
- ✅ Todas las keys existen en fr
- ✅ Todas las keys existen en pt
- ✅ Todas las keys existen en de
- ✅ Todas las keys existen en ar
- ✅ Todas las keys existen en zh

### Script 2: Detectar Hardcode

```bash
node scripts/audit-hardcoded-text.js
```

**No debe encontrar:**
- ❌ Strings hardcodeados en componentes
- ❌ Texto visible sin traducir

### Script 3: Verificar Compliance Completo

```bash
node scripts/validate-9-language-compliance.js [ruta]
```

---

## 📝 Template de Validación para Agentes

### Al finalizar cualquier trabajo, reportar:

```markdown
## Validación de 7 Idiomas

### Archivos modificados:
- [archivo1.tsx]
- [archivo2.tsx]

### Traducciones verificadas:
- ✅ en/[namespace].json - Todas las keys presentes
- ✅ es/[namespace].json - Todas las keys presentes
- ✅ fr/[namespace].json - Todas las keys presentes
- ✅ pt/[namespace].json - Todas las keys presentes
- ✅ de/[namespace].json - Todas las keys presentes
- ✅ ar/[namespace].json - Todas las keys presentes
- ✅ zh/[namespace].json - Todas las keys presentes

### Scripts ejecutados:
- ✅ validate-i18n-keys.js - Sin errores
- ✅ audit-hardcoded-text.js - Sin hardcode detectado

### Testing:
- ✅ Cambio de idioma funciona correctamente
- ✅ No aparecen keys sin traducir
- ✅ Todos los textos se muestran correctamente en los 7 idiomas
```

---

## 🚨 Errores Comunes

### Error 1: Solo agregar en inglés

```json
// ❌ INCORRECTO
// Solo agregaste en en/api-keys.json
{
  "header": {
    "title": "Api Keys"
  }
}

// ✅ CORRECTO
// Agregar en TODOS los idiomas
// en/api-keys.json, es/api-keys.json, fr/api-keys.json, etc.
```

### Error 2: Olvidar agregar al preload

```typescript
// ❌ INCORRECTO
// Creaste traducciones pero olvidaste preload
preloadNamespaces={['common', 'navigation']}

// ✅ CORRECTO
preloadNamespaces={['common', 'navigation', 'api-keys']}
```

### Error 3: Keys diferentes entre idiomas

```json
// ❌ INCORRECTO
// en/api-keys.json
{ "header": { "title": "..." } }

// es/api-keys.json
{ "header": { "titulo": "..." } }  // ← Key diferente!

// ✅ CORRECTO
// Misma estructura en todos los idiomas
```

---

## 🛠️ Herramientas de Validación

### 1. Validar un módulo específico:

```bash
node scripts/validate-i18n-keys.js api-keys
```

### 2. Validar todos los módulos:

```bash
node scripts/validate-i18n-keys.js
```

### 3. Detectar hardcode en ruta específica:

```bash
node scripts/audit-hardcoded-text.js apps/dashboard/app/dashboard-bundui/api-keys
```

### 4. Validar compliance completo:

```bash
node scripts/validate-9-language-compliance.js apps/dashboard/app/dashboard-bundui/analytics
```

---

## 📐 Estructura de Archivos Requerida

Para que un módulo sea 9-Language Compliant:

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   └── [namespace].json  ← ✅ REQUERIDO (English First)
├── es/
│   └── [namespace].json  ← ✅ REQUERIDO
├── fr/
│   └── [namespace].json  ← ✅ REQUERIDO
├── pt/
│   └── [namespace].json  ← ✅ REQUERIDO
├── de/
│   └── [namespace].json  ← ✅ REQUERIDO
├── it/
│   └── [namespace].json  ← ✅ REQUERIDO (Automático en nuevos componentes)
├── ko/
│   └── [namespace].json  ← ✅ REQUERIDO (Automático en nuevos componentes)
├── ar/
│   └── [namespace].json  ← ✅ REQUERIDO
└── zh/
    └── [namespace].json  ← ✅ REQUERIDO
```

**Los 9 archivos DEBEN tener:**
- ✅ Misma estructura JSON
- ✅ Mismas keys (solo cambia el valor traducido)
- ✅ Mismo namespace

---

## 🎯 Regla de Oro

**"Si un usuario puede verlo, debe estar en 9 idiomas."**

**REGLA AUTOMÁTICA:** Cuando agregas un nuevo componente/módulo, automáticamente debe incluir traducciones para los 9 idiomas.

Esto incluye:
- Títulos, subtítulos, descripciones
- Botones, enlaces, acciones
- Mensajes de error, éxito, advertencia
- Placeholders, labels, hints
- Estados (loading, empty, etc.)
- Tooltips, aria-labels
- Notificaciones, toasts

---

## ✅ Criterios de Aprobación

Un módulo/pantalla/componente es **9-Language Compliant** cuando:

1. ✅ NO tiene texto hardcodeado
2. ✅ Usa `useTranslation` para TODO texto visible
3. ✅ Tiene archivos JSON en los 9 idiomas (en, es, fr, pt, de, it, ko, ar, zh)
4. ✅ Todas las keys existen en los 9 idiomas
5. ✅ Estructura JSON idéntica en todos los idiomas
6. ✅ Namespace está en `types.ts`
7. ✅ Namespace está preload en `layout.tsx`
8. ✅ Scripts de validación pasan sin errores
9. ✅ Cambio de idioma funciona correctamente
10. ✅ No aparecen keys sin traducir en la UI

---

## 📞 Referencias

- `docs/architecture/I18N_BEST_PRACTICES_AGENTS.md` - Buenas prácticas detalladas
- `docs/architecture/I18N_ANTI_HARDCODE_STRATEGY.md` - Cómo evitar hardcode
- `docs/architecture/I18N_VALIDATION_PROTOCOL.md` - Protocolo de validación
- `scripts/validate-i18n-keys.js` - Script de validación de keys
- `scripts/audit-hardcoded-text.js` - Script de detección de hardcode

---

## 🚨 Para Agentes AI

**Esta es una regla OBLIGATORIA. No finalices ningún trabajo sin verificar compliance de 7 idiomas.**

Antes de reportar "completado", ejecuta:

```bash
# 1. Validar keys
node scripts/validate-i18n-keys.js [namespace]

# 2. Detectar hardcode
node scripts/audit-hardcoded-text.js [ruta]

# 3. Verificar estructura
# Revisar manualmente que existan 7 archivos JSON

# 4. Reportar resultado
```

**Si algún script falla o encuentra problemas → NO está completo.**

