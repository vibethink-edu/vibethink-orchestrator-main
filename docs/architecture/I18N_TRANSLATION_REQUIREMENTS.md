# Requisitos de Traducción: DOS Idiomas Obligatorios

## 🚨 REGLA CRÍTICA

**TODAS las traducciones DEBEN estar en DOS idiomas obligatoriamente:**

1. **Inglés (en)** - Idioma base
2. **Español (es)** - Idioma secundario

---

## 📋 Requisitos Obligatorios

### Para Nuevos Componentes

```markdown
✅ OBLIGATORIO:
- [ ] Crear archivo de traducción en inglés: `translations/en/[namespace].json`
- [ ] Crear archivo de traducción en español: `translations/es/[namespace].json`
- [ ] TODAS las claves deben tener traducción en AMBOS idiomas
- [ ] No dejar claves sin traducir
- [ ] Probar cambio de idioma (inglés ↔ español)
```

### Para Migraciones de Bundui

```markdown
✅ OBLIGATORIO:
- [ ] Extraer todos los textos hardcoded
- [ ] Crear estructura de traducciones
- [ ] Traducir a inglés (en)
- [ ] Traducir a español (es)
- [ ] Verificar que TODAS las claves están en ambos idiomas
- [ ] Probar cambio de idioma
```

---

## 📁 Estructura de Archivos

```
src/lib/i18n/translations/
├── en/                    # Inglés (obligatorio)
│   ├── common.json
│   ├── crm.json
│   ├── sales.json
│   └── [nuevo-modulo].json
└── es/                    # Español (obligatorio)
    ├── common.json
    ├── crm.json
    ├── sales.json
    └── [nuevo-modulo].json
```

**⚠️ CRÍTICO:** Ambos directorios (`en/` y `es/`) deben existir y tener las mismas claves.

---

## ✅ Checklist de Validación

### Antes de Merge

- [ ] Archivo `en/[namespace].json` existe
- [ ] Archivo `es/[namespace].json` existe
- [ ] Ambas estructuras son idénticas (mismas claves)
- [ ] Todas las claves tienen valor en inglés
- [ ] Todas las claves tienen valor en español
- [ ] No hay claves vacías o sin traducir
- [ ] Probado cambio de idioma funciona
- [ ] Verificado que ambos idiomas se muestran correctamente

### Validación Automática (Recomendado)

```typescript
// Script de validación (crear si es necesario)
function validateTranslations(namespace: string) {
  const en = require(`./translations/en/${namespace}.json`);
  const es = require(`./translations/es/${namespace}.json`);
  
  // Verificar que tienen las mismas claves
  const enKeys = Object.keys(flatten(en));
  const esKeys = Object.keys(flatten(es));
  
  if (enKeys.length !== esKeys.length) {
    throw new Error(`Keys mismatch in ${namespace}`);
  }
  
  // Verificar que no hay valores vacíos
  // ...
}
```

---

## 🚫 Errores Comunes

### ❌ Error 1: Solo un idioma

```json
// ❌ INCORRECTO - Solo inglés
translations/en/crm.json ✅
translations/es/crm.json ❌ (no existe)
```

**Solución:** Crear siempre ambos archivos.

### ❌ Error 2: Claves faltantes

```json
// en/crm.json
{
  "header": {
    "title": "CRM Dashboard"
  }
}

// es/crm.json
{
  "header": {
    // ❌ Falta "title"
  }
}
```

**Solución:** Verificar que todas las claves existen en ambos idiomas.

### ❌ Error 3: Traducciones incompletas

```json
// es/crm.json
{
  "header": {
    "title": ""  // ❌ Vacío
  }
}
```

**Solución:** Completar todas las traducciones antes de merge.

---

## 📝 Template de Traducción

### Estructura Base

```json
// en/[namespace].json
{
  "header": {
    "title": "Title in English",
    "subtitle": "Subtitle in English"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

```json
// es/[namespace].json
{
  "header": {
    "title": "Título en Español",
    "subtitle": "Subtítulo en Español"
  },
  "actions": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

---

## 🔍 Proceso de Validación

### Paso 1: Crear Estructura

```bash
# 1. Crear archivo en inglés
touch src/lib/i18n/translations/en/new-module.json

# 2. Crear archivo en español
touch src/lib/i18n/translations/es/new-module.json
```

### Paso 2: Definir Claves

```json
// Definir TODAS las claves primero en inglés
// Luego traducir a español
```

### Paso 3: Validar

```bash
# Verificar que ambos archivos tienen las mismas claves
# Verificar que no hay valores vacíos
# Probar cambio de idioma
```

---

## 🚨 Reglas Críticas

1. **NUNCA crear solo un idioma**
   - Siempre crear ambos: `en/` y `es/`

2. **NUNCA dejar claves sin traducir**
   - Todas las claves deben tener valor en ambos idiomas

3. **NUNCA hacer merge sin validar**
   - Verificar que ambos idiomas funcionan antes de merge

4. **SIEMPRE probar cambio de idioma**
   - Verificar que el cambio funciona correctamente

---

## 📚 Referencias

- `docs/architecture/I18N_STRATEGY.md` - Estrategia completa de i18n
- `docs/architecture/COMPONENT_VALIDATION_PROCESS.md` - Proceso de validación
- `docs/architecture/BUNDUI_UPDATE_STRATEGY.md` - Estrategia de actualización

---

**Última actualización:** 2025-12-19  
**Mantenido por:** Equipo de Desarrollo VibeThink















