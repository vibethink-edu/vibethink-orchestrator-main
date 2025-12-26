# ViTo — Guía Completa i18n/l10n AI-First

**STATUS:** 🚨 **IMPERATIVO** (Documentación Maestra)  
**VERSION:** 3.0.0  
**DATE:** 2025-12-21  
**STACK:** React 19 + Next.js 15.3 App Router (RSC) + TypeScript 5.9

---

## 📋 Tabla de Contenidos

1. [Arquitectura en 3 Capas](#arquitectura-en-3-capas)
2. [Contexto para AI Agents (Terminology)](#contexto-para-ai-agents-terminology)
3. [Namespaces y Sub-namespaces para UI](#namespaces-y-sub-namespaces-para-ui)
4. [Patrón de Implementación](#patrón-de-implementación)
5. [Estructura de Archivos](#estructura-de-archivos)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Checklist de Validación](#checklist-de-validación)

---

## 1. Arquitectura en 3 Capas

### CAPA 1 — Semantic IDs (ConceptIDs)

**ConceptIDs** canónicos y estables para AI Agents:

```
concept.{domain}.{category}.{specific}
```

**Ejemplos:**
- `concept.crm.entity.deal` - Entidad "Deal" en CRM
- `concept.crm.entity.lead` - Entidad "Lead" en CRM
- `concept.crm.status.qualified` - Estado "Qualified" en CRM
- `concept.hotel.booking.status.checked_in` - Estado de booking
- `concept.operations.task.priority.high` - Prioridad de tarea

**Regla:** Nunca se renombra un ConceptID; solo se agregan nuevos.

**Ubicación:** `apps/dashboard/src/lib/i18n/translations/{locale}/concept.json`

### CAPA 2 — Terminology (Compartida UI/AI)

**Terminology** resuelve labels cortos consistentes y metadatos para AI Agents:

```typescript
{
  "concept.crm.entity.deal": {
    "label": "Deal",
    "plural": "Deals",
    "gender": "m",
    "synonyms": ["Oportunidad", "Negocio", "Trato"],
    "description": "Venta potencial en curso"
  }
}
```

**Overrides por jerarquía:**
- base → productContext → workspaceContext → industryContext → tenantOverrides

**API:**
- Server/RSC/Agents: `await term(conceptId, ctx)`
- Client: `useTerm()` (desde snapshot)

### CAPA 3 — UI Strings (Namespaces)

**UI Strings** son frases completas organizadas por módulo (namespace):

```
{namespace}.{subNamespace}.{key}
```

**Ejemplos:**
- `tasks.table.selectAll` - "Select all"
- `tasks.toolbar.filterTasks` - "Filter tasks..."
- `crm.lead.status.qualified` - "Qualified"
- `hotel.booking.form.checkInDate` - "Check-in Date"

**Ubicación:** `apps/dashboard/src/lib/i18n/translations/{locale}/{namespace}.json`

---

## 2. Contexto para AI Agents (Terminology)

### 2.1 ConceptIDs Estructurados

Los ConceptIDs deben seguir esta estructura:

```
concept.{domain}.{category}.{specific}
```

**Dominios principales:**
- `crm` - Customer Relationship Management
- `hotel` - Hotel Management
- `operations` - Operations Management
- `finance` - Financial Management
- `hr` - Human Resources
- `common` - Conceptos universales

**Categorías:**
- `entity` - Entidades principales (deal, lead, contact, etc.)
- `status` - Estados (open, closed, qualified, etc.)
- `action` - Acciones (create, update, delete, etc.)
- `field` - Campos de formularios
- `unit` - Unidades (night, hour, day, etc.)

### 2.2 Archivo concept.json

**Estructura recomendada:**

```json
{
  "concept.crm.entity.deal": {
    "label": "Deal",
    "plural": "Deals",
    "gender": "m",
    "synonyms": ["Oportunidad", "Negocio", "Trato"],
    "description": "Venta potencial en curso"
  },
  "concept.crm.entity.lead": {
    "label": "Lead",
    "plural": "Leads",
    "gender": "m",
    "synonyms": ["Prospecto", "Cliente Potencial"],
    "description": "Cliente potencial que aún no ha comprado"
  },
  "concept.crm.status.qualified": {
    "label": "Qualified",
    "plural": "Qualified",
    "gender": "m",
    "synonyms": ["Calificado", "Aprobado"],
    "description": "Lead que cumple criterios de calificación"
  },
  "concept.hotel.booking.unit.night": {
    "label": "Night",
    "plural": "Nights",
    "gender": "f",
    "synonyms": ["Noche", "Estadía"],
    "description": "Unidad de tiempo para bookings de hotel"
  }
}
```

### 2.3 Uso en AI Agents

**En Server Components / RSC:**

```typescript
import { term } from '@/lib/i18n/terminology';

// En un Server Component
export default async function CrmAgentPage() {
  const dealLabel = await term('concept.crm.entity.deal', {
    locale: 'en',
    productContext: 'crm',
    tenantId: 'tenant-123'
  });
  
  return <div>Current entity: {dealLabel}</div>;
}
```

**En AI Agent System Prompt:**

```typescript
import { getConcept } from '@/lib/i18n/terminology';

// Construir glosario activo para AI
const glossary = await getConcept('concept.crm.entity.deal', agentContext);

const systemPrompt = `
You are a CRM assistant. Use this terminology:

Entity: ${glossary.label}
Plural: ${glossary.plural}
Synonyms: ${glossary.synonyms.join(', ')}
Description: ${glossary.description}

Always use these terms when referring to ${glossary.label}.
`;
```

---

## 3. Namespaces y Sub-namespaces para UI

### 3.1 Estructura de Namespaces

**Principio:** Cada módulo tiene su propio namespace, con sub-namespaces lógicos.

**Estructura recomendada:**

```json
{
  "title": "Module Title",
  "description": "Module description",
  
  "table": {
    "selectAll": "Select all",
    "selectRow": "Select row",
    "noResults": "No results found"
  },
  
  "toolbar": {
    "filter": "Filter...",
    "search": "Search...",
    "export": "Export"
  },
  
  "form": {
    "title": "Form Title",
    "fields": {
      "name": "Name",
      "email": "Email"
    },
    "validation": {
      "nameRequired": "Name is required",
      "emailInvalid": "Invalid email"
    }
  },
  
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending"
  },
  
  "actions": {
    "create": "Create",
    "update": "Update",
    "delete": "Delete"
  },
  
  "messages": {
    "success": {
      "created": "Created successfully",
      "updated": "Updated successfully"
    },
    "error": {
      "createFailed": "Failed to create",
      "updateFailed": "Failed to update"
    }
  }
}
```

### 3.2 Sub-namespaces Comunes

**Para todos los módulos:**

- `table` - Elementos de tabla
- `toolbar` - Barra de herramientas
- `form` - Formularios
- `status` - Estados
- `actions` - Acciones
- `messages` - Mensajes (success/error)
- `labels` - Labels genéricos
- `filters` - Filtros
- `pagination` - Paginación

### 3.3 Uso en Componentes

**En Client Components:**

```typescript
'use client';

import { useTranslation } from '@/lib/i18n';

export function TaskTable() {
  const { t } = useTranslation('tasks');
  
  return (
    <div>
      <button>{t('table.selectAll')}</button>
      <input placeholder={t('toolbar.filterTasks')} />
      <span>{t('status.pending')}</span>
    </div>
  );
}
```

**En Server Components:**

```typescript
import { getTranslation } from '@/lib/i18n/loader';

export default async function TaskPage() {
  const translations = await getTranslation('en', 'tasks');
  
  return (
    <div>
      <h1>{translations.title}</h1>
      <p>{translations.description}</p>
    </div>
  );
}
```

---

## 4. Patrón de Implementación

### 4.1 Checklist para Nuevo Módulo

**Paso 1: Crear archivos de traducción**

```bash
# Generar archivos base
node scripts/generate-i18n-for-all-modules.js

# O manualmente crear:
# apps/dashboard/src/lib/i18n/translations/en/{module}.json
# apps/dashboard/src/lib/i18n/translations/es/{module}.json
```

**Paso 2: Estructurar namespace**

```json
{
  "title": "Module Title",
  "description": "Module description",
  "table": { ... },
  "toolbar": { ... },
  "form": { ... },
  "status": { ... },
  "actions": { ... },
  "messages": { ... }
}
```

**Paso 3: Agregar ConceptIDs**

```json
// En concept.json
{
  "concept.{module}.entity.{entity}": {
    "label": "...",
    "plural": "...",
    "synonyms": [...],
    "description": "..."
  }
}
```

**Paso 4: Aplicar en componentes**

```typescript
// Client Component
'use client';
import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useTranslation('module-name');
  return <div>{t('key')}</div>;
}
```

**Paso 5: Validar**

```bash
# Validar i18n
npm run validate:i18n:master

# Validar AI-First compliance
npm run validate:ai-first
```

### 4.2 Reglas Absolutas (P0)

1. **UI Strings (frases completas) van en i18n por módulo**
   - ✅ `useTranslation('tasks')` para títulos, botones, mensajes
   - ❌ NO construir frases concatenando `term()`

2. **UI puede usar Terminology SOLO para labels cortos**
   - ✅ Labels dinámicos ("Deal" vs "Oportunidad")
   - ❌ NO NLG en UI (concatenación de términos)

3. **Next.js App Router: RSC async OK, Client snapshot-only**
   - ✅ RSC: `await term()` y `await getSnapshot()`
   - ✅ Client: `useTerm()`/`termFromSnapshot()`
   - ❌ NO importar concepts JSON en Client Components

4. **AI Agents: context obligatorio + glosario activo**
   - ✅ Agents siempre llaman `await term(id, agentContext)`
   - ✅ Construir "Glosario Activo" para system prompt
   - ❌ Agents NO usan UI translations

5. **Namespaces organizados por sub-namespaces**
   - ✅ `tasks.table.selectAll`
   - ✅ `tasks.toolbar.filterTasks`
   - ❌ `tasks.selectAll` (sin sub-namespace)

---

## 5. Estructura de Archivos

```
apps/dashboard/src/lib/i18n/
├── translations/
│   ├── en/
│   │   ├── concept.json          # ConceptIDs para AI Agents
│   │   ├── common.json           # Strings comunes
│   │   ├── tasks.json            # Namespace: tasks
│   │   ├── crm.json              # Namespace: crm
│   │   ├── hotel.json            # Namespace: hotel
│   │   └── ...
│   └── es/
│       ├── concept.json
│       ├── common.json
│       ├── tasks.json
│       ├── crm.json
│       └── ...
├── types.ts                      # Tipos TypeScript
├── config.ts                     # Configuración
├── loader.ts                     # Cargador de traducciones
├── context.tsx                   # React Context Provider
└── utils.ts                      # Utilidades
```

---

## 6. Ejemplos Prácticos

### 6.1 Módulo Tasks (Completo)

**Archivo: `tasks.json`**

```json
{
  "title": "Tasks",
  "description": "A task and issue tracker",
  "table": {
    "selectAll": "Select all",
    "selectRow": "Select row",
    "task": "Task",
    "title": "Title",
    "status": "Status",
    "priority": "Priority",
    "noResults": "No results."
  },
  "toolbar": {
    "filterTasks": "Filter tasks...",
    "status": "Status",
    "priority": "Priority"
  },
  "labels": {
    "bug": "Bug",
    "feature": "Feature",
    "documentation": "Documentation"
  },
  "statuses": {
    "backlog": "Backlog",
    "todo": "Todo",
    "inProgress": "In progress",
    "done": "Done",
    "canceled": "Canceled"
  },
  "priorities": {
    "low": "Low",
    "medium": "Medium",
    "high": "High"
  }
}
```

**Componente:**

```typescript
'use client';

import { useTranslation } from '@/lib/i18n';

export function TaskTable() {
  const { t } = useTranslation('tasks');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <input placeholder={t('toolbar.filterTasks')} />
      <table>
        <thead>
          <tr>
            <th>{t('table.task')}</th>
            <th>{t('table.title')}</th>
            <th>{t('table.status')}</th>
            <th>{t('table.priority')}</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
```

### 6.2 AI Agent con Terminology

**Archivo: `concept.json`**

```json
{
  "concept.operations.task.entity": {
    "label": "Task",
    "plural": "Tasks",
    "gender": "f",
    "synonyms": ["Tarea", "Actividad", "Trabajo"],
    "description": "Unidad de trabajo asignada a un usuario"
  },
  "concept.operations.task.status.done": {
    "label": "Done",
    "plural": "Done",
    "gender": "m",
    "synonyms": ["Completado", "Finalizado"],
    "description": "Estado de tarea completada"
  }
}
```

**AI Agent:**

```typescript
import { term, getConcept } from '@/lib/i18n/terminology';

// En system prompt
const taskConcept = await getConcept('concept.operations.task.entity', {
  locale: 'en',
  productContext: 'operations',
  tenantId: 'tenant-123'
});

const systemPrompt = `
You are a task management assistant.

Terminology:
- Entity: ${taskConcept.label}
- Plural: ${taskConcept.plural}
- Synonyms: ${taskConcept.synonyms.join(', ')}
- Description: ${taskConcept.description}

Always use "${taskConcept.label}" when referring to tasks.
`;
```

---

## 7. Checklist de Validación

### 7.1 Para Cada Módulo

- [ ] Archivo `{module}.json` existe en `en/` y `es/`
- [ ] Estructura con sub-namespaces (`table`, `toolbar`, `form`, etc.)
- [ ] Todos los strings hardcoded reemplazados con `t()`
- [ ] `useTranslation('module-name')` usado en componentes
- [ ] ConceptIDs agregados en `concept.json` si aplica
- [ ] Traducciones completas en ambos idiomas

### 7.2 Para AI Agents

- [ ] ConceptIDs definidos en `concept.json`
- [ ] Estructura completa (label, plural, synonyms, description)
- [ ] `await term()` usado en Server Components/Agents
- [ ] `useTerm()` usado en Client Components (desde snapshot)
- [ ] Glosario activo construido para system prompts

### 7.3 Validación Automática

```bash
# Validar i18n completo
npm run validate:i18n:master

# Validar AI-First compliance
npm run validate:ai-first

# Validar boundaries de imports
npm run validate:i18n:boundaries
```

---

## 8. Referencias

- **Documentación Maestra:** `docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md`
- **Metodología AI-First:** `docs/architecture/AI_FIRST_UNIVERSAL_METHODOLOGY.md`
- **Arquitectura Unificada:** `docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md`
- **DateTime Standard:** `docs/architecture/DATE_TIME_HANDLING_POSITION.md`

---

## 9. Soporte

Para dudas o problemas:
1. Revisar esta guía completa
2. Consultar documentación maestra
3. Ejecutar scripts de validación
4. Revisar ejemplos en módulo `tasks`

---

**Última actualización:** 2025-12-21  
**Versión:** 3.0.0






