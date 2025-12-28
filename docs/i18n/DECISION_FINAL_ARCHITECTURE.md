# ✅ DECISIÓN FINAL: Arquitectura i18n Multi-Industria

**Fecha:** 2025-12-27
**Decisión:** Basada en feedback de OpenAI/ChatGPT-4
**Estado:** ✅ Aprobado para implementación

---

## 🎯 **DECISIÓN EJECUTIVA**

### **MANTENER 3 CAPAS i18n + Agregar Taxonomía como Metadata**

**NO crear una 4ta capa física.**
**SÍ separar "i18n layering" de "industry taxonomy".**

---

## 💡 **INSIGHT CLAVE (OpenAI)**

> **"Layers" (capas de traducción) y "Taxonomy" (clasificación de industrias) son EJES DIFERENTES.**
>
> Si los mezclas, inventarás nuevas "capas" cada vez que el negocio re-agrupe industrias.

**Problema que resuelve:**
- Consolidamos "Radio Station" → "Media & Entertainment"
- Consolidamos "Cancer Care" → "Nonprofit Organizations"
- **PERO:** Esto no debe cambiar la estructura de archivos i18n

---

## 🏗️ **ARQUITECTURA APROBADA**

### **3 Capas Físicas (archivos/namespaces) - SIN CAMBIOS**

```
┌────────────────────────────────────────┐
│ LAYER 1: TRANSVERSAL                   │
│ Files: common.json, calendar.json      │
│ Scope: Universal UI + business ops     │
│ Examples: "save", "cancel", "invoice"  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ LAYER 2: CONCEPT                       │
│ Files: concept-healthcare.json, etc.   │
│ Scope: Domain terminology              │
│ Examples: "patient", "menu", "case"    │
│ + METADATA: vertical, subvertical      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ LAYER 3: WORKSPACE                     │
│ Files: workspace-emr.json, etc.        │
│ Scope: Module/product functionality    │
│ Examples: "ICD-10 Code", "Fire Order"  │
└────────────────────────────────────────┘
```

### **Taxonomía como Metadata (NUEVO)**

```typescript
// NO como carpetas, sino como tags en metadata
interface TermMetadata {
  key: string;
  layer: 'transversal' | 'concept' | 'workspace';
  scopes: {
    vertical?: 'healthcare' | 'hospitality' | ...;
    subvertical?: 'hospital' | 'clinic' | ...;
    module?: 'emr' | 'pos' | ...;
  };
}
```

**Cadena de fallback:**
```
universal → vertical → subvertical → module
```

---

## 📁 **ESTRUCTURA DE ARCHIVOS (Sin Cambios)**

```
src/lib/i18n/translations/
├── en/
│   ├── common.json                      ← Layer 1
│   ├── calendar.json                    ← Layer 1
│   ├── tasks.json                       ← Layer 1
│   │
│   ├── concept-restaurant.json          ← Layer 2 + metadata
│   ├── concept-healthcare.json          ← Layer 2 + metadata
│   ├── concept-legal-firm.json          ← Layer 2 + metadata
│   ├── concept-media.json               ← Layer 2 + metadata
│   ├── concept-nonprofit.json           ← Layer 2 + metadata
│   ├── concept-agency.json              ← Layer 2 + metadata
│   │
│   ├── workspace-pos.json               ← Layer 3
│   ├── workspace-emr.json               ← Layer 3
│   ├── workspace-case-management.json   ← Layer 3
│   ├── workspace-broadcast-studio.json  ← Layer 3
│   ├── workspace-nonprofit-portal.json  ← Layer 3
│   └── workspace-client-portal.json     ← Layer 3
│
├── es/ (Spanish) - Same structure
├── ar/ (Arabic) - Same structure
... (9 languages total)
```

**Total:** 12 namespaces × 9 languages = 108 archivos (como está ahora)

---

## 🆕 **NUEVOS COMPONENTES A AGREGAR**

### **1. Term Registry (Source of Truth)**

```typescript
// apps/dashboard/src/lib/i18n/term-registry.ts
interface TermDefinition {
  key: string;
  layer: 'transversal' | 'concept' | 'workspace';
  scopes: {
    vertical?: string;
    subvertical?: string;
    module?: string;
  };
  translations: Record<string, string>;
  synonyms?: string[];
  owner: string;
  version: string;
  deprecated?: {
    replacedBy?: string;
    reason: string;
  };
  external?: {
    naics?: string[];  // Mappings to NAICS codes
    gics?: string[];   // Mappings to GICS codes
  };
}
```

**Propósito:**
- Single source of truth para todos los términos
- Permite AI classification
- Previene duplicaciones
- Versionado y deprecations

### **2. Canonical Concept + Label Overrides**

```typescript
// Concepto canónico: "persona principal del servicio"
const CANONICAL = "concept.person_primary";

// Overrides por vertical
const LABEL_OVERRIDES = {
  "healthcare": "Patient",
  "legal": "Client",
  "hospitality": "Guest",
  "nonprofit": "Beneficiary"
};

// Usage
function getLabel(key: string, vertical: string): string {
  if (key === CANONICAL && LABEL_OVERRIDES[vertical]) {
    return LABEL_OVERRIDES[vertical];
  }
  return translate(key);
}
```

**Beneficio:** DRY + contexto correcto sin duplicar archivos

### **3. AI Classification con Constrained Lattice**

```typescript
// AI elige de opciones permitidas, NO inventa ubicación
async function classifyTerm(input: {
  term: string;
  context: string;
  tenantVertical: string;
}) {
  // 1. Constrain por tenant context
  const allowedScopes = getValidScopes(input.tenantVertical);

  // 2. Retrieve similar terms
  const candidates = await retrieveSimilarTerms(input.term);

  // 3. LLM rerank + decide
  const result = await llm.classify({
    term: input.term,
    candidates: candidates.filter(c => allowedScopes.includes(c.scope))
  });

  // 4. Human-in-the-loop if low confidence
  if (result.confidence < 0.85) {
    return await requestHumanReview(result);
  }

  return result;
}
```

### **4. Taxonomía Custom con Mappings NAICS/GICS**

```typescript
// NO adoptamos NAICS/GICS como-es
// Creamos nuestra taxonomía simple + mappings para interoperabilidad

interface TaxonomyNode {
  id: string;
  name: string;
  level: 'vertical' | 'subvertical';
  parent?: string;
  external?: {
    naics?: string[];  // ["622110"] = General Hospitals
    gics?: string[];   // ["35101010"] = Health Care Equipment
  };
}

const HOSPITAL: TaxonomyNode = {
  id: "healthcare-hospital",
  name: "Hospital",
  level: "subvertical",
  parent: "healthcare",
  external: {
    naics: ["622110"],
    gics: ["35101010"]
  }
};
```

**Beneficio:** Flexibilidad + interoperabilidad

---

## 📊 **COMPARACIÓN: Antes vs. Después**

| Aspecto | ANTES (propuesta 4 capas) | DESPUÉS (decisión final) |
|---------|---------------------------|--------------------------|
| **Capas físicas** | 4 (Universal, Industry, SubIndustry, Workspace) | 3 (Transversal, Concept, Workspace) |
| **Archivos** | ~500 archivos | ~108 archivos (actual) |
| **Taxonomía** | Baked into file structure | Metadata + tags |
| **Refactor cuando cambia negocio** | ✅ Mucho (mover archivos) | ❌ Mínimo (actualizar metadata) |
| **Developer complexity** | Alta (4 carpetas para navegar) | Media (3 carpetas + metadata lookup) |
| **AI classification** | Más opciones = más errores | Constrained = más preciso |
| **Escalabilidad** | 50 industries × 4 layers = caos | 50 industries × metadata = manejable |

---

## 🎯 **DECISIONES ESPECÍFICAS**

### **1. ¿3 o 4 capas?**
✅ **3 capas físicas**

**Razón:**
- 4 capas aumenta complejidad sin beneficios claros hasta 15+ industrias
- Taxonomía debe ser metadata, no estructura de carpetas
- Permite reorganizar industrias sin refactors masivos

---

### **2. ¿Adoptar NAICS/GICS?**
✅ **Custom taxonomy con mappings**

**Razón:**
- NAICS: 6 niveles muy profundos (diseñado para reporting gubernamental)
- GICS: 4 niveles pero finance-oriented
- Solución: Taxonomía simple 3-tier + mappings a NAICS/GICS para interoperabilidad

**Estructura:**
```
Vertical (9 opciones):
├─ Healthcare
├─ Hospitality
├─ Professional Services
├─ Media & Entertainment
├─ Nonprofit
├─ Technology
├─ Education
├─ Retail
└─ Real Estate

SubVertical (variable por vertical):
Healthcare/
  ├─ Hospital
  ├─ Clinic
  ├─ Dental
  └─ Mental Health
```

---

### **3. ¿Qué es "Universal"?**
✅ **Test de 3 industrias con MISMO significado**

**Universal (Transversal):**
- ✅ Business primitives: invoice, tax, employee, payroll
- ✅ UI primitives: save, cancel, delete, edit
- ✅ Time/dates: today, yesterday, this week
- ✅ Status: pending, confirmed, completed

**NO Universal (Concept):**
- ❌ Domain nouns cuyo significado varía: patient/client/guest
- ❌ Domain-specific: appointment (médico) vs. reservation (hotel)
- ❌ Industry jargon: "Fire Order", "Deposition", "ICD-10"

**Regla de oro:** Si se usa en 3+ industrias con el MISMO significado semántico → Universal

---

### **4. ¿Cómo AI clasifica términos?**
✅ **Constrained retrieval + LLM rerank + confidence gating**

**Pipeline:**
1. **Constrain** por tenant context (vertical, módulos activos)
2. **Retrieve** candidatos similares del Term Registry
3. **LLM classify** entre candidatos permitidos (NO inventa)
4. **Confidence check**: Si < 85% → human review
5. **Active learning**: Human corrections → training data

---

### **5. ¿Escalabilidad a 50 industries × 100 languages?**
✅ **Build-time compilation + lazy loading + CDN cache**

**Estrategia:**
- **Build time:** Compilar ICU messages en chunks por namespace
- **Runtime:** Lazy load solo namespaces necesarios (vertical + módulos)
- **Cache:** CDN con hash por `{locale, vertical, moduleSet, appVersion}`

**Performance target:**
- Initial load: Transversal only (~50 keys)
- Route-based: Load concept pack (~200 keys)
- Module-based: Load workspace pack (~100 keys)
- Total: ~350 keys loaded (no 5,000)

---

### **6. ¿Developer Experience?**
✅ **3 capas + tooling**

**Tooling necesario:**
- CLI: `i18n where "Fire Order"` → sugiere file + key
- IDE autocomplete: Generated types por namespace
- Lint rule: "Similar key exists" warning
- AI assistant: `i18n suggest` para clasificar nuevos términos

**Ejemplo workflow:**
```bash
# Developer wants to add new term
$ i18n suggest "Oxygen Saturation" --context "vital signs in EMR"

# AI responds:
Layer: workspace
File: workspace-emr.json
Key: emr.vitals.oxygenSaturation
Reasoning: Medical vital sign specific to EMR module
Similar terms: bloodPressure, heartRate (same file)
Confidence: 0.92

# Auto-add if approved
$ i18n add --confirm
```

---

### **7. ¿Performance optimization?**
✅ **Build-time compilation + namespace chunking**

**Bundle strategy:**
```
transversal.en.chunk.js         ← 50 keys, always loaded
concept-healthcare.en.chunk.js  ← 200 keys, loaded for healthcare tenants
workspace-emr.en.chunk.js       ← 100 keys, loaded when EMR active
```

**Cache strategy:**
```typescript
// CDN cache key
const cacheKey = `i18n-${locale}-${vertical}-${moduleSetHash}-${appVersion}`;
// TTL: 1 year (versioned), invalidate on deploy
```

---

## 🚫 **ANTI-PATTERNS A EVITAR**

1. **❌ Industry-in-key naming**
   ```json
   // MAL
   { "healthcare.patient.name": "Patient Name" }

   // BIEN
   { "concept.person_primary.name": "Name" }
   // + metadata: vertical="healthcare", label="Patient"
   ```

2. **❌ Copy/paste overrides**
   ```json
   // MAL: concept-hospital.json
   { "concept.patient": "Patient" }

   // MAL: concept-clinic.json
   { "concept.patient": "Patient" }  // ← Duplicado!

   // BIEN: Solo en concept-healthcare.json + metadata
   { "concept.person_primary": "Patient" }
   ```

3. **❌ One key, multiple meanings (semantic drift)**
   ```json
   // MAL
   { "common.case": "Case" }  // ¿Legal case? Medical case? Shipping case?

   // BIEN
   { "concept.legal_matter": "Case" }
   { "concept.medical_encounter": "Case" }
   { "concept.shipping_container": "Case" }
   ```

4. **❌ No governance**
   - Cualquiera puede agregar cualquier key
   - Resultado: Duplicados vuelven
   - Solución: Term Registry + AI guard + approval workflow

5. **❌ Runtime deep merges**
   ```typescript
   // MAL: Merge 200 JSON files en cada render
   const translations = deepMerge(...allFiles);

   // BIEN: Build-time compilation
   const translations = precompiledBundle[namespace];
   ```

6. **❌ Taxonomy en estructura de archivos**
   ```
   // MAL
   /industry/healthcare/subindustry/hospital/workspace/emr.json

   // BIEN
   /concept-healthcare.json  (metadata: subvertical="hospital")
   ```

---

## ✅ **CHECKLIST DE IMPLEMENTACIÓN**

### **Fase 1: Metadata & Term Registry (Semana 1)**
- [ ] Crear `term-registry.ts` (✅ HECHO)
- [ ] Agregar metadata a archivos concept-*.json existentes
- [ ] Migrar términos actuales al Term Registry
- [ ] Implementar `getTermForScope(key, scope)` con overrides

### **Fase 2: AI Classification (Semana 2)**
- [ ] Implementar constrained retrieval
- [ ] Integrar LLM para rerank
- [ ] Agregar confidence gating + human review
- [ ] Active learning loop

### **Fase 3: Taxonomía Custom (Semana 2)**
- [ ] Definir estructura vertical/subvertical
- [ ] Mapear a NAICS/GICS codes
- [ ] Documentar taxonomía completa
- [ ] Implementar tenant config con vertical/subvertical

### **Fase 4: Developer Tooling (Semana 3)**
- [ ] CLI `i18n where <term>`
- [ ] CLI `i18n suggest <term>`
- [ ] Lint rules para duplicados
- [ ] Generated TypeScript types

### **Fase 5: Performance (Semana 3)**
- [ ] Build-time compilation
- [ ] Namespace chunking
- [ ] Lazy loading por route/module
- [ ] CDN cache strategy

### **Fase 6: Replicar a 8 idiomas (Semana 4)**
- [ ] Con arquitectura validada, replicar EN → ES, FR, PT, ZH, AR, DE, IT, KO
- [ ] 12 namespaces × 8 idiomas = 96 archivos adicionales

---

## 📚 **REFERENCIAS**

- **OpenAI Feedback:** Ver chat completo en docs/i18n/OPENAI_FEEDBACK.md
- **RFC Original:** docs/i18n/RFC_I18N_TAXONOMY_ARCHITECTURE.md
- **Consolidación Media/Nonprofit:** Commit 7f6dfb41

**Estándares consultados:**
- NAICS: https://www.census.gov/naics/
- GICS: https://www.msci.com/gics
- Salesforce Industries: https://www.salesforce.com/products/industries/
- HubSpot Industry Properties: https://knowledge.hubspot.com/properties

---

## 🎯 **PRÓXIMOS PASOS INMEDIATOS**

1. ✅ **Agregar metadata a concept files actuales**
   - Editar concept-healthcare.json, concept-restaurant.json, etc.
   - Agregar campo `_metadata: { vertical, subvertical }`

2. ✅ **Implementar Term Registry básico**
   - Migrar 20-30 términos ejemplo
   - Probar scope-based overrides
   - Validar con 1 vertical (Healthcare)

3. ✅ **Documentar decisión para equipo**
   - Este documento
   - Presentación ejecutiva (slides)
   - Training session para developers

4. ✅ **Replicar a idiomas**
   - Con arquitectura validada, proceder con traducción masiva

---

**Decisión aprobada por:** Marcelo (Product Owner) + Claude Code (AI Architect) + OpenAI (External Validation)

**Fecha de implementación:** Enero 2025

**Versión:** 1.0.0

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
