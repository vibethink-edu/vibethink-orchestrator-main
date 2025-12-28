# Validación CRM V2 - Compliance AI-First Universal

**FECHA:** 2025-12-21  
**MÓDULO:** CRM V2 (`/dashboard-bundui/crm-v2`)  
**CONTEXTO:** CRM transversal, AI-First, inspirado en Attio  
**VALIDADOR:** `validate-ai-first-compliance.js`  
**METODOLOGÍA:** `AI_FIRST_UNIVERSAL_METHODOLOGY.md` + `VITO_ARCHITECTURE_SPEC_UNIFIED.md`

---

## 📊 Resumen Ejecutivo

### Estado Actual
- **Compliance AI-First:** 🔴 **NO COMPLIANT** (2 problemas críticos)
- **i18n Coverage:** 0% (sin internacionalización)
- **DateTime Safety:** 🔴 **NO COMPLIANT** (fechas hardcoded, `toLocaleDateString`)
- **Terminología AI-First:** ❌ **NO IMPLEMENTADO**
- **ResourceContext:** ❌ **NO IMPLEMENTADO**
- **External Normalization:** ❌ **NO IMPLEMENTADO**

### Problemas Críticos Identificados

1. **Fechas Hardcoded y Uso Directo de `toLocaleDateString`**
   - `apps/dashboard/app/dashboard-vibethink/crm/components/DealsTable.tsx:121`
     ```typescript
     <span>{new Date(deal.close_date).toLocaleDateString()}</span>
     ```
   - `apps/dashboard/app/dashboard-bundui/crm/components/DealsTable.tsx` (similar)
   - **Violación:** DateTime Standard - Prohibido uso directo de `toLocaleDateString`

2. **Fechas Hardcoded en Mock Data**
   - `apps/dashboard/app/dashboard-bundui/crm-v2/components/recent-tasks.tsx:33-49`
     ```typescript
     dueDate: "Today",
     dueDate: "Tomorrow",
     dueDate: "Oct 15",
     ```
   - **Violación:** DateTime Standard - Fechas deben ser `CivilDate` o `InstantISO`

3. **Falta de i18n**
   - Todos los textos están hardcoded en inglés
   - No usa `useTranslations()` ni `useTerm()`
   - **Violación:** I18N_TERMINOLOGY_AI_FIRST.md - Obligatorio i18n desde el inicio

4. **Falta de Terminología AI-First**
   - No usa `term()` o `useTerm()` para labels
   - No tiene ConceptIDs definidos
   - **Violación:** AI-First Universal Methodology

5. **Falta de ResourceContext**
   - No define timezone del recurso (empresa)
   - No tiene contexto de integración (Google Workspace, Office 365)
   - **Violación:** External Normalization Law

---

## 🔍 Análisis Detallado por Componente

### 1. `page.tsx` (Main Dashboard)

**Estado:** ⚠️ Parcialmente Compliant

**Problemas:**
- ❌ Títulos hardcoded: `"CRM Dashboard"`, `"Download"`
- ❌ No usa `useTranslations('crm')`
- ❌ No usa `useTerm()` para labels dinámicos

**Recomendaciones:**
```typescript
// ✅ CORRECTO
import { useTranslation } from "@/lib/i18n";
import { useTerm } from "@vibethink/terminology";

export default function Page() {
  const { t } = useTranslation('crm');
  const dashboardTitle = useTerm('concept.crm.dashboard.title');
  
  return (
    <h1>{t('dashboard.title')}</h1>
    // ...
  );
}
```

---

### 2. `recent-tasks.tsx`

**Estado:** 🔴 NO COMPLIANT

**Problemas Críticos:**
1. **Fechas Hardcoded:**
   ```typescript
   dueDate: "Today",      // ❌ Debe ser CivilDate o InstantISO
   dueDate: "Tomorrow",  // ❌ Debe ser CivilDate o InstantISO
   dueDate: "Oct 15",    // ❌ Debe ser CivilDate ('2025-10-15')
   ```

2. **No usa formatBookingRange() o formatCivilDate():**
   ```typescript
   <span>Due {task.dueDate}</span>  // ❌ Debe usar formateador
   ```

3. **Textos Hardcoded:**
   - `"Tasks"`, `"Track and manage your upcoming tasks."`, `"Add Task"`
   - No usa i18n

**Corrección Requerida:**
```typescript
import { formatCivilDate, type CivilDate } from '@vibethink/utils';
import { useTranslation } from "@/lib/i18n";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: CivilDate;  // ✅ Cambiar a CivilDate
  priority: "high" | "medium" | "low";
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with Acme Inc.",
    description: "Send proposal and schedule meeting",
    completed: false,
    dueDate: "2025-12-21",  // ✅ CivilDate format
    priority: "high"
  },
  // ...
];

export function RecentTasks() {
  const { t } = useTranslation('crm');
  const today = new Date().toISOString().split('T')[0] as CivilDate;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tasks.title')}</CardTitle>
        <CardDescription>{t('tasks.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.map((task) => (
          <div key={task.id}>
            {/* ... */}
            <span className="text-muted-foreground text-xs">
              {t('tasks.due')} {formatCivilDate(task.dueDate, i18n.language)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

---

### 3. `sales-pipeline.tsx`

**Estado:** ⚠️ Parcialmente Compliant

**Problemas:**
- ❌ Textos hardcoded: `"Sales Pipeline"`, `"Current deals in your sales pipeline."`
- ❌ No usa i18n
- ✅ Usa `toLocaleString()` para números (correcto, pero debería usar `formatMoney()`)

**Recomendaciones:**
- Agregar i18n para todos los textos
- Considerar usar `formatMoney()` de `@vibethink/utils` para consistencia

---

### 4. `leads.tsx`

**Estado:** ⚠️ Parcialmente Compliant

**Problemas:**
- ❌ Textos hardcoded: `"Leads"`, `"Filter leads..."`, `"No results."`
- ❌ No usa i18n
- ✅ Usa `Intl.NumberFormat` para currency (correcto, pero debería usar `formatMoney()`)

**Recomendaciones:**
- Agregar i18n
- Usar `formatMoney()` de `@vibethink/utils` para consistencia

---

### 5. `DealsTable.tsx` (dashboard-vibethink)

**Estado:** 🔴 NO COMPLIANT

**Problema Crítico:**
```typescript
// ❌ LÍNEA 121
<span>{new Date(deal.close_date).toLocaleDateString()}</span>
```

**Violación:** DateTime Standard - Prohibido uso directo de `toLocaleDateString`

**Corrección Requerida:**
```typescript
import { formatCivilDate, type CivilDate } from '@vibethink/utils';
import { useTranslation } from "@/lib/i18n";

// En el tipo Deal:
interface Deal {
  // ...
  close_date: CivilDate;  // ✅ Cambiar de string a CivilDate
  // ...
}

// En el componente:
export function DealsTable({ className }: DealsTableProps) {
  const { i18n } = useTranslation('crm');
  
  // ...
  
  <span>{formatCivilDate(deal.close_date, i18n.language)}</span>
}
```

---

## 🎯 Contexto Especial: CRM AI-First (Attio-Inspired)

### Visión del Usuario

El CRM debe ser:
1. **Transversal a cualquier negocio** - No específico de un dominio
2. **AI-First** - Mayor parte de interacción a través de agente de voz
3. **Concentrador de actividades:**
   - Calendario (Google Calendar, Office 365)
   - Tareas (Google Tasks, Microsoft To-Do)
   - Email (Gmail, Outlook)
   - Redes sociales (scraping, APIs)
4. **Onboarding inspirado en Attio** - Heredará toda la lógica de onboarding
5. **Sincronización multi-fuente** - Siempre sincronizado con fuentes externas

### Gaps Identificados para AI-First

#### 1. **Falta de ResourceContext para Integraciones**

**Problema:** No hay contexto de integración con Google Workspace/Office 365

**Solución Requerida:**
```typescript
import { createResourceContext, type ResourceContext } from '@vibethink/utils';

// En el hook useCrmData o similar:
const resourceContext: ResourceContext = {
  resourceId: companyId,  // ID de la empresa
  sourceSystem: 'google_workspace' | 'office_365' | 'custom',
  timeZone: companyTimezone,  // Timezone de la empresa (no del usuario)
  locale: companyLocale,
  currency: companyCurrency,
};
```

#### 2. **Falta de Normalizadores para Fuentes Externas**

**Problema:** No hay normalizadores para:
- Google Calendar events → CRM Activities
- Google Tasks → CRM Tasks
- Gmail emails → CRM Activities
- Office 365 events → CRM Activities

**Solución Requerida:**
```typescript
// packages/integrations/src/google_workspace/crm-normalizer.ts
import { normalizeGoogleCalendarEvent } from './calendar/normalizer';
import { type CrmActivity } from '@/types/crm';

export function normalizeGoogleCalendarToCrmActivity(
  event: GoogleCalendarEvent,
  resourceCtx: ResourceContext
): CrmActivity {
  // Normalizar evento de Google Calendar a actividad CRM
  return {
    id: event.id,
    type: 'meeting',
    title: event.summary,
    description: event.description,
    created_at: event.start.dateTime,  // InstantISO
    // ...
  };
}
```

#### 3. **Falta de Terminología AI-First para CRM**

**Problema:** No hay ConceptIDs para entidades CRM

**Solución Requerida:**
```json
// packages/terminology/concepts/crm/en/concepts.json
{
  "concept.crm.entity.account": {
    "label": "Account",
    "plural": "Accounts",
    "description": "Company or organization in CRM"
  },
  "concept.crm.entity.contact": {
    "label": "Contact",
    "plural": "Contacts",
    "description": "Individual person in CRM"
  },
  "concept.crm.entity.deal": {
    "label": "Deal",
    "plural": "Deals",
    "description": "Sales opportunity"
  },
  "concept.crm.entity.activity": {
    "label": "Activity",
    "plural": "Activities",
    "description": "Interaction or event with customer"
  },
  "concept.crm.stage.discovery": {
    "label": "Discovery",
    "description": "Initial contact stage"
  },
  // ...
}
```

#### 4. **Falta de Agente de Voz para CRM**

**Problema:** No hay integración con agente de voz

**Solución Requerida:**
```typescript
// apps/dashboard/app/dashboard-bundui/crm-v2/components/voice-agent.tsx
"use client";

import { useVoiceAgent } from '@/hooks/use-voice-agent';
import { useTerm } from '@vibethink/terminology';

export function CrmVoiceAgent() {
  const { startRecording, stopRecording, isRecording } = useVoiceAgent({
    context: 'crm',
    productContext: 'crm',
    workspaceContext: 'sales',  // o 'support', 'marketing', etc.
  });
  
  const dealLabel = useTerm('concept.crm.entity.deal');
  const contactLabel = useTerm('concept.crm.entity.contact');
  
  // El agente puede:
  // - "Crear un nuevo deal para Acme Inc."
  // - "Mostrar contactos de esta semana"
  // - "Agendar reunión con John Doe"
  // - "Sincronizar con Google Calendar"
}
```

---

## ✅ Checklist de Compliance AI-First para CRM

### Fase 1: Correcciones Críticas (P0)

- [ ] **DateTime Safety**
  - [ ] Reemplazar `toLocaleDateString()` por `formatCivilDate()` o `formatInstantISO()`
  - [ ] Cambiar `dueDate: "Today"` → `dueDate: CivilDate`
  - [ ] Cambiar `close_date: string` → `close_date: CivilDate`
  - [ ] Agregar `venueTimezone` o `companyTimezone` a todas las entidades

- [ ] **i18n Básico**
  - [ ] Crear `apps/dashboard/src/lib/i18n/translations/{locale}/crm.json`
  - [ ] Reemplazar todos los textos hardcoded por `t('key')`
  - [ ] Agregar ICU para plurales y variables

- [ ] **Terminología AI-First**
  - [ ] Crear ConceptIDs para entidades CRM (`concept.crm.entity.*`)
  - [ ] Crear ConceptIDs para stages (`concept.crm.stage.*`)
  - [ ] Reemplazar labels hardcoded por `useTerm()`

### Fase 2: ResourceContext y Normalización (P1)

- [ ] **ResourceContext**
  - [ ] Agregar `ResourceContext` a hooks de CRM
  - [ ] Definir `timeZone` de la empresa (no del usuario)
  - [ ] Definir `sourceSystem` (google_workspace, office_365, custom)

- [ ] **Normalizadores Externos**
  - [ ] Crear `packages/integrations/src/google_workspace/crm-normalizer.ts`
  - [ ] Crear `packages/integrations/src/office_365/crm-normalizer.ts`
  - [ ] Normalizar Google Calendar → CRM Activities
  - [ ] Normalizar Google Tasks → CRM Tasks
  - [ ] Normalizar Gmail → CRM Activities

### Fase 3: Integración AI-First (P2)

- [ ] **Agente de Voz**
  - [ ] Crear componente `CrmVoiceAgent`
  - [ ] Integrar con `useVoiceAgent` hook
  - [ ] Definir comandos de voz para CRM:
    - Crear/editar deals
    - Crear/editar contacts
    - Agendar reuniones
    - Sincronizar con calendario

- [ ] **Glosario Activo para AI**
  - [ ] Crear `packages/ai-agents/src/prompt/crm-glossary.ts`
  - [ ] Incluir ConceptIDs, synonyms, descriptions
  - [ ] Integrar con system prompt del agente

### Fase 4: Onboarding Attio-Inspired (P3)

- [ ] **Onboarding Multi-Fuente**
  - [ ] Integración con Google Workspace
  - [ ] Integración con Office 365
  - [ ] Importación de emails
  - [ ] Importación de contactos
  - [ ] Sincronización inicial

---

## 🔧 Mejoras al Validador

### Problemas Identificados en el Validador Actual

1. **No detecta fechas hardcoded como "Today", "Tomorrow"**
   - El validador solo busca `toLocaleDateString`, pero no detecta strings hardcoded
   - **Mejora requerida:** Agregar detección de strings como "Today", "Tomorrow", "Oct 15", etc.

2. **No valida ResourceContext en hooks**
   - El validador no verifica si los hooks usan `ResourceContext`
   - **Mejora requerida:** Validar que hooks de datos usen `ResourceContext`

3. **No valida normalizadores externos**
   - El validador no verifica si existen normalizadores para integraciones
   - **Mejora requerida:** Validar que existan normalizadores para fuentes externas documentadas

4. **No valida ConceptIDs de terminología**
   - El validador no verifica si existen ConceptIDs para las entidades del módulo
   - **Mejora requerida:** Validar que existan ConceptIDs en `packages/terminology/concepts/{module}/`

### Propuesta de Mejoras

```javascript
// scripts/validate-ai-first-compliance.js

// 1. Detectar fechas hardcoded
const HARDCODED_DATE_PATTERNS = [
  /["'](Today|Tomorrow|Yesterday|Oct \d+|Jan \d+|Feb \d+|Mar \d+|Apr \d+|May \d+|Jun \d+|Jul \d+|Aug \d+|Sep \d+|Nov \d+|Dec \d+)["']/i,
  /dueDate:\s*["'](Today|Tomorrow|Yesterday)/i,
];

// 2. Validar ResourceContext en hooks
function validateResourceContext(filePath, content) {
  if (filePath.includes('/hooks/') && content.includes('useCrmData') || content.includes('useCrmFilters')) {
    if (!content.includes('ResourceContext') && !content.includes('createResourceContext')) {
      issues.push(`Missing ResourceContext in hook: ${filePath}`);
    }
  }
}

// 3. Validar normalizadores
function validateNormalizers(modulePath) {
  const expectedNormalizers = [
    'google_workspace/crm-normalizer.ts',
    'office_365/crm-normalizer.ts',
  ];
  
  // Verificar que existan
}

// 4. Validar ConceptIDs
function validateConceptIDs(moduleName) {
  const conceptPath = `packages/terminology/concepts/${moduleName}/`;
  // Verificar que existan ConceptIDs para entidades principales
}
```

---

## 📋 Plan de Acción Inmediato

### Prioridad 1: Correcciones Críticas (Esta Semana)

1. **Corregir fechas en DealsTable.tsx**
   - Reemplazar `toLocaleDateString()` por `formatCivilDate()`
   - Cambiar tipo de `close_date` a `CivilDate`

2. **Corregir fechas en recent-tasks.tsx**
   - Cambiar `dueDate: "Today"` → `dueDate: CivilDate`
   - Usar `formatCivilDate()` para mostrar

3. **Agregar i18n básico**
   - Crear `crm.json` en `translations/{locale}/`
   - Reemplazar textos hardcoded

### Prioridad 2: Terminología AI-First (Próxima Semana)

1. **Crear ConceptIDs para CRM**
   - `concept.crm.entity.*`
   - `concept.crm.stage.*`
   - `concept.crm.action.*`

2. **Integrar useTerm() en componentes**
   - Reemplazar labels hardcoded

### Prioridad 3: ResourceContext y Normalización (2 Semanas)

1. **Agregar ResourceContext**
   - A hooks de CRM
   - Definir timezone de empresa

2. **Crear normalizadores**
   - Google Workspace → CRM
   - Office 365 → CRM

---

## 🎯 Conclusión

### Estado Actual
- **Compliance:** 🔴 **NO COMPLIANT** (2 problemas críticos)
- **Preparado para AI-First:** ❌ **NO**
- **Preparado para integraciones:** ❌ **NO**

### Estado Objetivo
- **Compliance:** ✅ **COMPLIANT** (0 problemas críticos)
- **Preparado para AI-First:** ✅ **SÍ**
- **Preparado para integraciones:** ✅ **SÍ**

### Próximos Pasos
1. Corregir problemas críticos (fechas, i18n)
2. Implementar terminología AI-First
3. Agregar ResourceContext y normalizadores
4. Integrar agente de voz
5. Documentar onboarding Attio-inspired

---

**Documento generado por:** Validación AI-First Compliance  
**Fecha:** 2025-12-21  
**Versión:** 1.0.0











