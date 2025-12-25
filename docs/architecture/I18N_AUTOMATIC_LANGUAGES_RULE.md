# Regla Automática: Idiomas en Nuevos Componentes/Módulos

**🚨 OBLIGATORIO PARA TODOS LOS AGENTES AI**

---

## 🎯 Regla Fundamental

**Cuando se agrega un nuevo componente o módulo, automáticamente debe incluir traducciones para TODOS los 9 idiomas base.**

---

## 📋 Los 9 Idiomas Base (English First)

1. 🇺🇸 **en** (English) ⭐ **PRIMERO SIEMPRE**
2. 🇪🇸 **es** (Español)
3. 🇫🇷 **fr** (Français)
4. 🇵🇹 **pt** (Português)
5. 🇩🇪 **de** (Deutsch)
6. 🇮🇹 **it** (Italiano) - **Agregado automáticamente**
7. 🇰🇷 **ko** (한국어) - **Agregado automáticamente**
8. 🇸🇦 **ar** (العربية)
9. 🇨🇳 **zh** (中文)

---

## 🔄 Proceso Automático

### Cuando agregas un nuevo componente/módulo:

#### Paso 1: Crear archivos de traducción base

**Obligatorio crear 9 archivos JSON:**

```
apps/dashboard/src/lib/i18n/translations/
├── en/[namespace].json  ← ⭐ English primero (template base)
├── es/[namespace].json
├── fr/[namespace].json
├── pt/[namespace].json
├── de/[namespace].json
├── it/[namespace].json  ← Automático (copiar de en y traducir)
├── ko/[namespace].json  ← Automático (copiar de en y traducir)
├── ar/[namespace].json
└── zh/[namespace].json
```

#### Paso 2: Workflow recomendado

```bash
# 1. Crear archivo base en inglés
# apps/dashboard/src/lib/i18n/translations/en/mi-modulo.json
{
  "header": {
    "title": "My Module"
  }
}

# 2. Copiar a todos los idiomas (incluyendo it y ko)
# Apps/dashboard/src/lib/i18n/translations/it/mi-modulo.json
# Apps/dashboard/src/lib/i18n/translations/ko/mi-modulo.json
# ... (es, fr, pt, de, ar, zh)

# 3. Traducir (puedes empezar con inglés y dejar otros como placeholder,
#    pero TODOS los 9 archivos deben existir desde el inicio)
```

#### Paso 3: Agregar namespace a types.ts

```typescript
// apps/dashboard/src/lib/i18n/types.ts
export type TranslationNamespace =
  | 'common'
  | 'navigation'
  | 'mi-modulo'  // ← Agregar aquí
  | ...
```

#### Paso 4: Agregar preload en layout.tsx

```typescript
// apps/dashboard/app/layout.tsx
<I18nProvider 
  initialLocale={initialLocale} 
  preloadNamespaces={[
    'common', 
    'navigation', 
    'mi-modulo'  // ← Agregar aquí
  ]}
>
```

#### Paso 5: Validar

```bash
# Validar que los 9 idiomas existen
node scripts/validate-9-language-compliance.js mi-modulo
```

---

## 📝 Template para Nuevos Módulos

### Script de creación automática (recomendado):

Cuando creas un nuevo módulo, seguir este patrón:

1. **Crear archivo base en inglés:**
   ```json
   // en/mi-modulo.json
   {
     "header": {
       "title": "My Module",
       "description": "Module description"
     }
   }
   ```

2. **Copiar a los otros 8 idiomas:**
   - Puedes usar el mismo contenido inicialmente (placeholder)
   - Pero los archivos DEBEN existir

3. **Traducir progresivamente:**
   - Prioridad 1: English (base)
   - Prioridad 2: Español, Francés (mercados principales)
   - Prioridad 3: Portugués, Alemán
   - Prioridad 4: Italiano, Coreano
   - Prioridad 5: Árabe, Chino

---

## ✅ Checklist Obligatorio

Al agregar un nuevo componente/módulo:

- [ ] ¿Creé archivo `en/[namespace].json`? ⭐ (English primero)
- [ ] ¿Creé archivo `es/[namespace].json`?
- [ ] ¿Creé archivo `fr/[namespace].json`?
- [ ] ¿Creé archivo `pt/[namespace].json`?
- [ ] ¿Creé archivo `de/[namespace].json`?
- [ ] ¿Creé archivo `it/[namespace].json`? (Automático)
- [ ] ¿Creé archivo `ko/[namespace].json`? (Automático)
- [ ] ¿Creé archivo `ar/[namespace].json`?
- [ ] ¿Creé archivo `zh/[namespace].json`?
- [ ] ¿Agregué namespace a `types.ts`?
- [ ] ¿Agregué preload a `layout.tsx`?
- [ ] ¿Ejecuté validación de 9 idiomas?

**Si alguna respuesta es NO → El módulo NO está completo.**

---

## 🚨 Errores Comunes

### ❌ Error 1: Olvidar it o ko

```json
// ❌ INCORRECTO - Solo creaste 7 archivos
en/mi-modulo.json
es/mi-modulo.json
fr/mi-modulo.json
// ... faltan it y ko
```

```json
// ✅ CORRECTO - Todos los 9 archivos
en/mi-modulo.json
es/mi-modulo.json
fr/mi-modulo.json
pt/mi-modulo.json
de/mi-modulo.json
it/mi-modulo.json  ← REQUERIDO
ko/mi-modulo.json  ← REQUERIDO
ar/mi-modulo.json
zh/mi-modulo.json
```

### ❌ Error 2: No agregar al preload

```typescript
// ❌ INCORRECTO
preloadNamespaces={['common', 'navigation']}
// Falta el nuevo módulo

// ✅ CORRECTO
preloadNamespaces={['common', 'navigation', 'mi-modulo']}
```

---

## 🛠️ Herramientas

### Script de validación:

```bash
# Validar un namespace específico
node scripts/validate-9-language-compliance.js mi-modulo

# Debe mostrar:
# ✅ en: Archivo existe y es válido
# ✅ es: Archivo existe y es válido
# ✅ fr: Archivo existe y es válido
# ✅ pt: Archivo existe y es válido
# ✅ de: Archivo existe y es válido
# ✅ it: Archivo existe y es válido  ← REQUERIDO
# ✅ ko: Archivo existe y es válido  ← REQUERIDO
# ✅ ar: Archivo existe y es válido
# ✅ zh: Archivo existe y es válido
```

---

## 📊 Estado de Idiomas por Módulo

Para módulos existentes que se crearon antes de esta regla:

### Módulos con 7 idiomas (antes de agregar it/ko):
- Necesitan agregar `it/` y `ko/` manualmente
- Usar `en/` como base para las traducciones

### Módulos nuevos (después de esta regla):
- **OBLIGATORIO** incluir los 9 idiomas desde el inicio
- No finalizar el módulo sin los 9 archivos

---

## 🎓 Resumen

1. **NUEVOS componentes/módulos:** 9 idiomas OBLIGATORIOS
2. **EXISTENTES:** Agregar it/ko progresivamente
3. **VALIDACIÓN:** Script automático verifica los 9 idiomas
4. **PRELOAD:** Agregar namespace a layout.tsx
5. **TYPES:** Agregar namespace a types.ts

---

## 📞 Referencias

- `docs/architecture/I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md` - Protocolo completo
- `scripts/validate-9-language-compliance.js` - Script de validación
- `AGENTS.md` - Reglas para agentes AI







