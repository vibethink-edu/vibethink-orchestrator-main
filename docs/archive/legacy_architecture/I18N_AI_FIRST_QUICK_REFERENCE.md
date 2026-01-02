# ViTo — Quick Reference: AI-First i18n/l10n

**STATUS:** 📋 **QUICK REFERENCE** (Para afinar todo)  
**VERSION:** 3.0.0  
**DATE:** 2025-12-21

---

## 🎯 Resumen Ejecutivo

Sistema AI-First con **2 capas separadas pero coordinadas**:

1. **Terminology (AI Agents)** → `concept.json` → ConceptIDs estructurados
2. **UI Strings (Interfaz)** → `{module}.json` → Namespaces con sub-namespaces

---

## 📐 Arquitectura Rápida

### Para AI Agents (Terminology)

```typescript
// ConceptID estructura
concept.{domain}.{category}.{specific}

// Ejemplos
concept.crm.entity.deal
concept.operations.task.status.done
concept.hotel.booking.unit.night

// Uso en Server/RSC/Agents
const label = await term('concept.crm.entity.deal', {
  locale: 'en',
  productContext: 'crm',
  tenantId: 'tenant-123'
});

// Uso en Client (desde snapshot)
const label = useTerm('concept.crm.entity.deal');
```

**Archivo:** `apps/dashboard/src/lib/i18n/translations/{locale}/concept.json`

**Estructura:**
```json
{
  "concept.crm.entity.deal": {
    "label": "Deal",
    "plural": "Deals",
    "gender": "m",
    "synonyms": ["Oportunidad", "Negocio"],
    "description": "Sales opportunity"
  }
}
```

### Para UI (Namespaces)

```typescript
// Namespace estructura
{namespace}.{subNamespace}.{key}

// Ejemplos
tasks.table.selectAll
tasks.toolbar.filterTasks
crm.lead.status.qualified

// Uso en componentes
const { t } = useTranslation('tasks');
return <button>{t('table.selectAll')}</button>;
```

**Archivo:** `apps/dashboard/src/lib/i18n/translations/{locale}/{module}.json`

**Estructura:**
```json
{
  "title": "Tasks",
  "table": {
    "selectAll": "Select all",
    "selectRow": "Select row"
  },
  "toolbar": {
    "filterTasks": "Filter tasks..."
  }
}
```

---

## 🔧 Sub-namespaces Estándar

Para todos los módulos, usar estos sub-namespaces:

- `table` - Elementos de tabla
- `toolbar` - Barra de herramientas
- `form` - Formularios
- `status` - Estados
- `actions` - Acciones
- `messages` - Mensajes (success/error)
- `labels` - Labels genéricos
- `filters` - Filtros
- `pagination` - Paginación

---

## 📋 Checklist Rápido

### Para cada módulo:

- [ ] Archivo `{module}.json` en `en/` y `es/`
- [ ] Estructura con sub-namespaces
- [ ] Strings hardcoded reemplazados con `t()`
- [ ] `useTranslation('module-name')` en componentes

### Para AI Agents:

- [ ] ConceptIDs en `concept.json`
- [ ] Estructura completa (label, plural, synonyms, description)
- [ ] `await term()` en Server Components/Agents
- [ ] `useTerm()` en Client Components (desde snapshot)

---

## 🚀 Comandos Útiles

```bash
# Generar archivos base para todos los módulos
node scripts/generate-i18n-for-all-modules.js

# Extraer strings hardcoded de un módulo
node scripts/extract-hardcoded-strings.js <module-name>

# Limpiar keys inútiles
node scripts/clean-translation-keys.js <module-name>

# Validar i18n completo
npm run validate:i18n:master

# Validar AI-First compliance
npm run validate:ai-first
```

---

## 📚 Documentación Completa

- **Guía Completa:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
- **Documento Técnico:** `docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md`
- **Metodología:** `docs/architecture/AI_FIRST_UNIVERSAL_METHODOLOGY.md`

---

**Última actualización:** 2025-12-21









