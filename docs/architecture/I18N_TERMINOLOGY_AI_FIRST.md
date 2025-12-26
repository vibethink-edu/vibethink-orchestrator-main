# ViTo — i18n/l10n + Terminology (AI-first) — Documento Único para Cursor

**STATUS:** 🚨 **IMPERATIVO** (base de arquitectura + plan de implementación)  
**VERSION:** 2.1.1  
**DATE:** 2025-12-21  
**STACK:** React 19 + Next.js 15.3 App Router (RSC) + TypeScript 5.9  
**FASE:** Sin BD (solo JSON + overrides en memoria) — preparado para multi-tenant y agentes

---

## 0) Objetivo (lo que Cursor debe construir)

Construir un sistema de i18n/l10n y Terminología **unificado** para que:

- **UI y AI Agents usen los mismos términos** (evitar drift semántico).
- **UI** mantenga traducciones por módulo (namespaces) para frases completas.
- **Terminology** provea labels cortos + metadatos semánticos (AI-first) con overrides por contexto.
- En Next.js App Router:
  - **RSC** puede usar `await term()` (server)
  - **Client** NO puede cargar diccionarios: usa **snapshot/hydration** (anti bundle-bloat + anti hydration mismatch)

---

## 1) Arquitectura en 3 capas (LEY)

### CAPA 1 — Semantic IDs (estables)

**ConceptIDs** canónicos: `concept.{domain}.{category}.{specific}`

Ejemplos:
- `concept.crm.entity.deal`
- `concept.operations.status.dispatched`
- `concept.resource.room`
- `concept.unit.hour`

**Regla:** nunca se renombra un ConceptID; solo se agregan nuevos.

### CAPA 2 — Terminology (Fuente Única de Verdad, compartida UI/AI)

Resuelve labels cortos consistentes y metadatos:
- `label`, `plural`, `gender`, `synonyms`, `description`

Overrides por jerarquía (sin BD aún):
- base → productContext → workspaceContext → industryContext(opc) → tenantOverrides(in-memory)

**API:**
- Server/RSC/Agents: `await term(conceptId, ctx)`
- Server: `await getSnapshot(conceptIds[], ctx)`
- Client: `termFromSnapshot(conceptId, snapshot)` + `useTerm()`

### CAPA 3 — UI Strings y Agent NLG

**UI Strings:** JSON por módulo: `useTranslations(namespace)` + ICU  
**Agents:** NLG/NLU construye mensajes/prompt usando Terminology + ICU

---

## 2) Reglas absolutas (P0)

### 2.1 UI Strings (frases completas) van en i18n por módulo

✅ UI usa `useTranslations('crm')` para títulos, botones, mensajes, errores, etc.  
✅ ICU obligatorio para plurales/select/variables.  
❌ UI NO construye frases concatenando `term()`.

### 2.2 UI puede usar Terminology SOLO para labels cortos

✅ Permitido: labels dinámicos ("Deal" vs "Oportunidad" vs "Proyecto")  
❌ Prohibido: NLG en UI (concatenación de términos para frases completas)

### 2.3 Next.js App Router: RSC async OK, Client snapshot-only

✅ RSC: `await term()` y `await getSnapshot()`  
✅ Client: `useTerm()`/`termFromSnapshot()` (sin import de JSON, sin async term)  
❌ Prohibido: importar concepts JSON dentro de Client Components

### 2.4 Context Slicing obligatorio

Nunca enviar diccionario completo al cliente.  
Cada route/layout define lista de ConceptIDs usados → server crea snapshot → client consume snapshot.

### 2.5 AI Agents: context obligatorio + glosario activo

✅ Agents siempre llaman `await term(id, agentContext)`  
✅ Construir "Glosario Activo" (labels + synonyms + description) para el system prompt  
❌ Agents NO usan UI translations

### 2.6 Enterprise (Attio-like): renombres y objetos dinámicos

✅ Resolver debe permitir overrides por tenant (sin BD aún: archivo in-memory)  
✅ Preparar ruta para "concept.dynamic.{objectId}.*" (objetos definidos por usuario)

### 2.7 Precedencia dataContext vs renderingContext

- **Entity/Object labels** → gana `dataContext`
- **Actions/CTAs/verbs UI** → gana `renderingContext`

---

## 3) Estructura de carpetas obligatoria (monorepo)

```
apps/dashboard/
  src/lib/i18n/
    translations/
      {locale}/
        *.json                    # CAPA 3: UI STRINGS por namespace

packages/terminology/             # ⭐ NUEVO PACKAGE
  concepts/
    common/
      {locale}/
        concepts*.json            # primitivos universales (uso limitado)
    crm/
      {locale}/
        concepts*.json
    operations/
      {locale}/
        concepts*.json
    finance/
      {locale}/
        concepts*.json
    hr/
      {locale}/
        concepts*.json
  src/
    types.ts                      # ConceptID, ConceptValue, Context types
    schema.ts                     # Zod schemas para validación
    engine.ts                     # Resolver core (merge chain, precedence)
    loader.ts                     # FileSystemLoader (server)
    registry.ts                   # Cache + registry pattern
  overrides/
    tenant-overrides.ts           # sin BD (map in-memory)
  hydration/
    provider.tsx                  # TerminologyProvider (RSC)
    hydration.tsx                 # TerminologyHydration (Client)
    useTerm.ts                    # Client hook
  tests/
    engine.test.ts
    loader.test.ts
    hydration.test.ts

packages/ai-agents/               # ⭐ NUEVO PACKAGE (opcional, futuro)
  src/
    agents/
      crm-agent.ts
      operations-agent.ts
    prompt/
      glossary.ts                 # builder glosario activo (usa terminology)
```

---

## 4) Boundaries de imports (ESLint + CI)

**PROHIBIDO:**
- UI → `packages/ai-agents`
- AI Agents → `apps/*/lib/i18n`
- Terminology → `apps/*` o `ai-agents`

Se implementa con `no-restricted-imports` en `.eslintrc`.

---

## 5) Data model de Terminology (AI-first, retrocompatible)

### 5.1 ConceptValue

Permitir dos formatos en JSON:

**Shorthand (string):**
```json
{
  "concept.crm.entity.deal": "Oportunidad"
}
```

**Enriched (objeto):**
```json
{
  "concept.crm.entity.deal": {
    "label": "Oportunidad",
    "plural": "Oportunidades",
    "gender": "f",
    "synonyms": ["Deal", "Negocio", "Trato"],
    "description": "Venta potencial en curso."
  }
}
```

**Normalización:** string ⇒ `{label: string}`

### 5.2 TypeScript Types

```typescript
// packages/terminology/src/types.ts

export type ConceptID = string; // e.g., "concept.crm.entity.deal"

export type ConceptValue = 
  | string  // Shorthand: "Oportunidad"
  | ConceptObject;  // Enriched: { label, plural, gender, synonyms, description }

export interface ConceptObject {
  label: string;  // REQUIRED
  plural?: string;  // Para pluralización
  gender?: 'm' | 'f' | 'n';  // Para concordancia
  synonyms?: string[];  // Para AI search/glossary
  description?: string;  // Para AI context
}

export interface TerminologyContext {
  locale?: string;  // default: 'en-US'
  productContext?: string;  // 'hotel' | 'studio' | 'cowork' | etc.
  workspaceContext?: string;  // 'sales' | 'logistics' | 'support' | etc.
  industryContext?: string;  // 'health' | 'hospitality' | etc. (opcional)
  tenantId?: string;  // Para overrides enterprise
}

export interface AgentContext extends TerminologyContext {
  locale: string;  // MANDATORY para agents
  productContext: string;  // MANDATORY para agents
  tenantId: string;  // MANDATORY para agents
  workspaceContext?: string;
  industryContext?: string;
  timezone?: string;
  currency?: string;
}
```

---

## 6) Contextos soportados

### 6.1 TerminologyContext (UI/services)

```typescript
interface TerminologyContext {
  locale?: string;  // default en-US
  productContext?: string;  // hotel/studio/cowork/etc.
  workspaceContext?: string;  // sales/logistics/support/etc.
  industryContext?: string;  // health/hospitality/etc. opcional
  tenantId?: string;
}
```

### 6.2 AgentContext (AI Agents) — MANDATORIO

```typescript
interface AgentContext {
  locale: string;  // MANDATORY
  productContext: string;  // MANDATORY
  tenantId: string;  // MANDATORY
  workspaceContext?: string;
  industryContext?: string;
  timezone?: string;
  currency?: string;
}
```

---

## 7) Loader + Registry (Strategy + cache)

### 7.1 Loader Strategy

**FileSystemLoader (server):** lee JSON de `packages/terminology/concepts/...`  
**Futuro: RemoteLoader (CDN/DB)**

### 7.2 Cache

Cache por `(domain, locale, layerKey)`

**LayerKey** representa: `base|product:X|workspace:Y|industry:Z`

Debe evitar recomputar merges en cada request.

---

## 8) Precedencia de overrides (merge chain)

Al resolver un ConceptID, el resolver aplica merge en este orden:

1. **base** (domain concepts.json)
2. **productContext override** (concepts.{product}.json)
3. **workspaceContext override** (concepts.{workspace}.json)
4. **industryContext override** (concepts.{industry}.json)
5. **tenantOverrides** (in-memory map por tenantId)
6. **fallback:** retorna conceptId + warn

---

## 9) API pública requerida (packages/terminology)

### 9.1 Server/RSC/Agents

```typescript
// Resolver término (retorna label/plural según params si aplica)
await term(conceptId: ConceptID, ctx?: TerminologyContext): Promise<string>

// Obtener concepto completo (para AI glossary)
await getConcept(conceptId: ConceptID, ctx?: TerminologyContext): Promise<ConceptObject>

// Crear snapshot para client (solo ConceptIDs usados)
await getSnapshot(conceptIds: ConceptID[], ctx?: TerminologyContext): Promise<TerminologySnapshot>
```

### 9.2 Client

```typescript
// Resolver desde snapshot (síncrono)
termFromSnapshot(conceptId: ConceptID, snapshot: TerminologySnapshot): string

// Hook React (lee snapshot del provider)
useTerm(conceptId: ConceptID): string
```

**Regla:** Client NO carga JSON, solo snapshot.

---

## 10) UI Integration (Next.js App Router)

### 10.1 Patrón recomendado

**En `app/(crm)/layout.tsx` (RSC):**

```typescript
// 1. Calcular ConceptIDs usados en ese subtree
const conceptIds: ConceptID[] = [
  'concept.crm.entity.deal',
  'concept.crm.entity.contact',
  'concept.crm.action.create',
  // ... otros usados en componentes hijos
];

// 2. Crear snapshot
const ctx: TerminologyContext = {
  locale: getLocale(),
  productContext: 'crm',
  workspaceContext: 'sales',
  tenantId: getTenantId(),
};

const snapshot = await getSnapshot(conceptIds, ctx);

// 3. Envolver subtree con provider
return (
  <TerminologyHydration snapshot={snapshot}>
    {children}
  </TerminologyHydration>
);
```

**En componentes "use client":**

```typescript
'use client';

import { useTerm } from '@vibethink/terminology/hydration';
import { useTranslations } from '@/lib/i18n';

export function DealCard({ deal }: { deal: Deal }) {
  // Label corto desde Terminology
  const dealLabel = useTerm('concept.crm.entity.deal');
  
  // Frases completas desde UI Strings
  const t = useTranslations('crm');
  const title = t('deal.title');
  const description = t('deal.description', { name: deal.name });
  
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardContent>
        <p>{description}</p>
        <Badge>{dealLabel}</Badge>
      </CardContent>
    </Card>
  );
}
```

---

## 11) AI Integration (glosario activo)

### 11.1 Implementar `packages/ai-agents/src/prompt/glossary.ts`

```typescript
import { getConcept } from '@vibethink/terminology';
import type { AgentContext, ConceptID } from '@vibethink/terminology/types';

/**
 * Construye glosario activo para system prompt
 */
export async function buildActiveGlossary(
  conceptIds: ConceptID[],
  agentContext: AgentContext
): Promise<string> {
  const glossary: string[] = [];
  
  for (const conceptId of conceptIds) {
    const concept = await getConcept(conceptId, agentContext);
    
    glossary.push(
      `- ${conceptId}:`,
      `  Label: ${concept.label}`,
      concept.plural ? `  Plural: ${concept.plural}` : '',
      concept.synonyms ? `  Synonyms: ${concept.synonyms.join(', ')}` : '',
      concept.description ? `  Description: ${concept.description}` : '',
      ''
    );
  }
  
  return `ACTIVE GLOSSARY (Context: ${agentContext.productContext}, Locale: ${agentContext.locale}):\n\n${glossary.join('\n')}`;
}
```

### 11.2 Uso en System Prompt

```typescript
const systemPrompt = `
Eres un asistente de CRM.

${await buildActiveGlossary(
  [
    'concept.crm.entity.deal',
    'concept.crm.entity.contact',
    'concept.crm.action.create',
  ],
  {
    locale: 'es',
    productContext: 'crm',
    tenantId: 'tenant-123',
    workspaceContext: 'sales',
  }
)}

Cuando generes respuestas:
1. Usa SIEMPRE los labels del glosario activo
2. Respeta el contexto del tenant (puede haber overrides)
3. Usa synonyms para búsqueda/NLU
`;
```

---

## 12) Validaciones y CI gates (MANDATORIOS)

### 12.1 Zod schema validation

```typescript
// packages/terminology/src/schema.ts

import { z } from 'zod';

export const ConceptValueSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    plural: z.string().optional(),
    gender: z.enum(['m', 'f', 'n']).optional(),
    synonyms: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
]);

export const ConceptsFileSchema = z.record(
  z.string(),  // ConceptID
  ConceptValueSchema
);
```

### 12.2 Referential integrity

Detectar ConceptIDs usados en código que no existan:

```typescript
// scripts/validate-terminology-references.ts

// Buscar en código: term('concept.xxx')
// Validar que concept.xxx existe en JSON
```

### 12.3 Client import ban

Fail si hay imports de concepts JSON en `use client`:

```typescript
// ESLint rule: no-restricted-imports
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@vibethink/terminology/concepts/**",
            "message": "Client components cannot import concepts JSON. Use useTerm() or termFromSnapshot() instead."
          }
        ]
      }
    ]
  }
}
```

### 12.4 Tests requeridos

- ✅ base resolution
- ✅ overrides (product/workspace/tenant)
- ✅ snapshot hydration correctness
- ✅ multi-locale basics
- ✅ ESLint boundaries

---

## 13) Plan de implementación (orden estricto)

### Día 1–2: Core Terminology Package

Crear `packages/terminology` con:

- [ ] `types.ts`, `schema.ts`, `loader.ts`, `registry.ts`, `engine.ts`
- [ ] `tenant-overrides.ts` (map en memoria)
- [ ] tests básicos (10+)

### Día 3: Hydration + Client Hook

- [ ] `TerminologyProvider`, `TerminologyHydration`, `useTerm`, `termFromSnapshot`
- [ ] tests de hydration (SSR snapshot == client rendering)

### Día 4: Integración UI (1 route real)

- [ ] Ejemplo CRM route (RSC layout)
- [ ] 1 client component que use `useTerm` + `useTranslations`

### Día 5: Integración AI (1 agent demo)

- [ ] `glossary.ts` y ejemplo `crm-agent` usando terminology

### Día 6: CI + ESLint + Scripts

- [ ] workflows + scripts + boundaries + checks de import

---

## 14) Acceptance Criteria (para "DONE")

✅ Existe `packages/terminology` independiente (sin imports a `apps/ai-agents`)  
✅ UI y AI comparten Terminology (mismos ConceptIDs / mismos labels)  
✅ RSC usa `await term()`; Client usa snapshot-only  
✅ No hay bundle bloat (no JSON gigantes en client)  
✅ No hay hydration mismatch (snapshot determinista)  
✅ Renombres enterprise posibles con `tenantOverrides` in-memory  
✅ Glosario activo para AI existe y usa `description/synonyms`  
✅ ESLint + tests + CI gates bloquean violaciones

---

## 15) Seed mínimo recomendado (para arrancar)

Crear conceptos mínimos en:

- `concepts/common/{en,es}/concepts.json` (customer, date, status.* base)
- `concepts/crm/{en,es}/concepts.json` (entity.lead/contact/company/deal, action.create/update, status.open/closed)
- `concepts/operations/{en,es}/concepts.json` (order., delivery., status.*)
- 1 override ejemplo por workspace (`concepts.sales.json`) y por tenant (in-memory).

---

## 16) Prompt final para Cursor (ejecutar)

**Cursor:**

Implementa todo lo anterior EXACTAMENTE en este orden.

**No agregues features no solicitadas.**

**Prioriza:** correctness, boundaries, hydration safety, anti bundle-bloat.

**Entrega con:** tests + scripts + ESLint rules + ejemplo UI + ejemplo AI.

---

## 17) Referencias y Documentación Relacionada

### Documentos Existentes

- **`docs/architecture/I18N_TERMINOLOGY_ARCHITECTURE.md`** - Ajustes obligatorios (TranslationLoader, Concept IDs atómicos, etc.)
- **`docs/architecture/IA_FIRST_REUSABLE_COMPONENTS.md`** - Patrón IA First para componentes reutilizables
- **`docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md`** - Estrategia context-aware
- **`docs/architecture/I18N_MIGRATION_MASTER_PLAN.md`** - Plan de migración gradual

### Integración con Sistema Actual

Este documento **extiende y consolida** los conceptos de:
- TranslationLoader pattern (ya implementado)
- Concept IDs atómicos (ya implementado en `concept.json`)
- Context-aware translations (ya implementado en `BookingCard`)

**Nuevo en este documento:**
- Package `packages/terminology` independiente
- Snapshot/hydration pattern para client
- Glosario activo para AI agents
- Boundaries estrictos de imports
- Validaciones CI/CD

---

## 18) Notas de Implementación

### Compatibilidad con Sistema Actual

El sistema actual ya tiene:
- ✅ `packages/utils/src/i18n/terminology.ts` con `term()`
- ✅ `apps/dashboard/src/lib/i18n/translations/en/concept.json` con concept IDs
- ✅ `useAutoDetectContext()` hook
- ✅ `BookingCard` reutilizable

**Migración gradual:**
1. Crear `packages/terminology` nuevo (no romper `packages/utils` aún)
2. Migrar `term()` a `packages/terminology`
3. Implementar snapshot/hydration
4. Migrar componentes uno por uno
5. Deprecar `packages/utils/src/i18n/terminology.ts` (fase 2)

### Stack Compatibility

- ✅ Next.js 15.3 App Router (RSC support)
- ✅ React 19 (Server Components)
- ✅ TypeScript 5.9 (strict mode)
- ✅ Monorepo structure (Turborepo compatible)

---

**Última actualización:** 2025-12-21  
**Estado:** 🚨 **IMPERATIVO** - Base de arquitectura + plan de implementación  
**Próximos pasos:** Ejecutar plan de implementación (Día 1-6)








