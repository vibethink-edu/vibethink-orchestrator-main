# VibeThink i18n Module Requirements

## 📋 Protocolo Obligatorio de Internacionalización

**CRÍTICO**: Todo módulo, componente, o librería de terceros que se integre al stack de VibeThink **DEBE** cumplir con este protocolo de internacionalización.

---

## 🌍 Idiomas Obligatorios (9 idiomas oficiales)

Todos los módulos DEBEN soportar los siguientes 9 idiomas:

| Código | Idioma | Nivel | Notas |
|--------|--------|-------|-------|
| `en` | English | **Base** | Idioma base, fallback universal |
| `es` | Español | **Base** | Idioma base secundario |
| `fr` | Français | Obligatorio | |
| `pt` | Português | Obligatorio | |
| `de` | Deutsch | Obligatorio | |
| `it` | Italiano | Obligatorio | |
| `ko` | 한국어 | Obligatorio | |
| `ar` | العربية | Obligatorio | RTL support required |
| `zh` | 中文 | Obligatorio | |

### Idiomas Base y Fallback

- **Inglés (`en`)**: Idioma base primario. DEBE estar 100% completo.
- **Español (`es`)**: Idioma base secundario. DEBE estar 100% completo.
- **Fallback**: Si falta una traducción en cualquier idioma, el sistema automáticamente usará inglés (`en`).

---

## ✅ Checklist de Cumplimiento

### 1. Estructura de Traducciones

```
your-module/
├── src/
│   └── lib/
│       └── i18n/
│           └── translations/
│               ├── en/
│               │   └── module-name.json
│               ├── es/
│               │   └── module-name.json
│               ├── fr/
│               │   └── module-name.json
│               ├── pt/
│               │   └── module-name.json
│               ├── de/
│               │   └── module-name.json
│               ├── it/
│               │   └── module-name.json
│               ├── ko/
│               │   └── module-name.json
│               ├── ar/
│               │   └── module-name.json
│               └── zh/
│                   └── module-name.json
```

### 2. Formato de Archivos de Traducción

**Correcto** ✅:
```json
{
  "header": {
    "title": "Welcome",
    "subtitle": "Get started with your project"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**Incorrecto** ❌:
```json
{
  "welcome_title": "Welcome",
  "get_started": "Get started",
  "save_btn": "Save"
}
```

### 3. Naming Convention

- **Archivos**: `module-name.json` (kebab-case)
- **Keys**: Anidadas por contexto semántico
- **Namespaces**: Por módulo/feature

### 4. RTL Support (Arabic)

Si tu módulo incluye UI, **DEBE** soportar RTL:

```tsx
// ✅ Correcto: Respeta dir="rtl"
<div className="flex items-center">
  {/* El contenido se invierte automáticamente */}
</div>

// ❌ Incorrecto: Posicionamiento absoluto fijo
<div style={{ left: 0 }}>
  {/* No se adapta a RTL */}
</div>
```

### 5. Uso de i18n en Código

```tsx
import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useTranslation('module-name');

  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('header.subtitle')}</p>
    </div>
  );
}
```

---

## 🚫 Rechazo de Módulos

Un módulo será **RECHAZADO** si:

1. ❌ No incluye traducciones para los 9 idiomas obligatorios
2. ❌ Inglés o Español están incompletos
3. ❌ Usa strings hardcodeados en lugar de traducciones
4. ❌ No soporta RTL para árabe
5. ❌ Las traducciones están en formato incorrecto

---

## 📝 Template de Traducción

Use este template como punto de partida:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "header": {
    "title": "",
    "subtitle": ""
  },
  "actions": {
    "create": "",
    "update": "",
    "remove": ""
  },
  "messages": {
    "success": "",
    "error": "",
    "warning": ""
  }
}
```

---

## 🔧 Herramientas de Validación

### Script de Validación

```bash
# Validar que todos los idiomas están presentes
npm run i18n:validate

# Generar reporte de cobertura
npm run i18n:coverage

# Encontrar claves faltantes
npm run i18n:missing-keys
```

### CI/CD Integration

El pipeline de CI **DEBE** incluir validación de i18n:

```yaml
# .github/workflows/i18n-check.yml
name: i18n Validation

on: [pull_request]

jobs:
  validate-i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate translations
        run: npm run i18n:validate
      - name: Check RTL support
        run: npm run i18n:check-rtl
```

---

## 🎯 Casos de Uso Comunes

### 1. Agregar un nuevo módulo

```bash
# 1. Crear estructura de carpetas
mkdir -p src/lib/i18n/translations/{en,es,fr,pt,de,it,ko,ar,zh}

# 2. Crear archivo base en inglés
touch src/lib/i18n/translations/en/my-module.json

# 3. Copiar a todos los idiomas
for lang in es fr pt de it ko ar zh; do
  cp src/lib/i18n/translations/en/my-module.json \
     src/lib/i18n/translations/$lang/my-module.json
done

# 4. Traducir cada archivo
```

### 2. Integrar librería de terceros

Si una librería de terceros no soporta i18n:

```tsx
// ✅ Correcto: Wrapper con traducciones
import { ThirdPartyComponent } from 'some-library';
import { useTranslation } from '@/lib/i18n';

export function LocalizedThirdParty() {
  const { t } = useTranslation('third-party-wrapper');

  return (
    <ThirdPartyComponent
      title={t('title')}
      description={t('description')}
      labels={{
        save: t('actions.save'),
        cancel: t('actions.cancel'),
      }}
    />
  );
}
```

### 3. Formularios y Validación

```tsx
import { useTranslation } from '@/lib/i18n';

export function MyForm() {
  const { t } = useTranslation('forms');

  return (
    <form>
      <label>{t('fields.email.label')}</label>
      <input
        placeholder={t('fields.email.placeholder')}
        aria-label={t('fields.email.label')}
      />
      <span className="error">
        {t('validation.email.invalid')}
      </span>
    </form>
  );
}
```

---

## 📊 Métricas de Calidad

| Métrica | Mínimo Requerido | Objetivo |
|---------|------------------|----------|
| Cobertura de idiomas | 9/9 (100%) | 9/9 (100%) |
| Cobertura de claves en `en` | 100% | 100% |
| Cobertura de claves en `es` | 100% | 100% |
| Cobertura de claves otros idiomas | 90% | 100% |
| Soporte RTL | Sí | Sí |
| Hardcoded strings | 0 | 0 |

---

## 🆘 Ayuda y Recursos

- **Documentación completa**: `/docs/i18n/`
- **Ejemplos**: `/apps/dashboard/src/lib/i18n/translations/`
- **Utilities**: `@vibethink/utils` package
- **Support**: Consultar con el equipo de i18n antes de integrar

---

## 📜 Excepciones

Las únicas excepciones permitidas son:

1. **Código de desarrollo/debug**: Logs, comentarios técnicos
2. **Nombres propios**: "VibeThink", nombres de productos específicos
3. **Constantes técnicas**: URLs, API endpoints, códigos de error técnicos

**Nota**: Todos los textos visibles al usuario **DEBEN** estar traducidos, sin excepciones.

---

## ✨ Ejemplo Completo

Ver implementación de referencia en:
- **Dashboard Bundui**: `/apps/dashboard/app/dashboard-bundui/`
- **Projects V2**: `/apps/dashboard/app/dashboard-bundui/projects-v2/`
- **Translations**: `/apps/dashboard/src/lib/i18n/translations/ar/projects.json`

---

## 🔄 Changelog y Versionado

Este documento sigue semantic versioning:

- **v1.0.0** (2025-12-27): Protocolo inicial con 9 idiomas obligatorios
- Fecha de efectividad: Inmediata para nuevos módulos
- Módulos existentes: Deadline de migración a definir

---

**Última actualización**: 2025-12-27
**Mantenedor**: VibeThink i18n Team
**Estado**: ✅ Activo y obligatorio
