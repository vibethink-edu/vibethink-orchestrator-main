# RFC: Multi-Industry i18n Taxonomy Architecture

**Status:** 🟡 Request for Comments
**Date:** 2025-12-27
**Authors:** VibeThink Engineering Team + Claude Code
**Reviewers:** OpenAI, Industry Experts, Internal Team
**Version:** 1.0.0

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Current Implementation](#current-implementation)
4. [Proposed Architecture](#proposed-architecture)
5. [Industry Benchmarking](#industry-benchmarking)
6. [Technical Implementation](#technical-implementation)
7. [Migration Path](#migration-path)
8. [Open Questions](#open-questions)
9. [Request for Feedback](#request-for-feedback)

---

## 🎯 EXECUTIVE SUMMARY

We are building a **multi-tenant, multi-industry SaaS platform** that needs to support:
- **6+ industries** (Healthcare, Legal, Hospitality, Media, Nonprofit, Agency)
- **9 languages** (EN, ES, AR, ZH, FR, PT, DE, IT, KO)
- **100+ translation namespaces**
- **Zero duplication** across industry-specific terminology

**Current Challenge:** Our i18n architecture lacks a clear taxonomical hierarchy for classifying industry concepts, leading to potential scalability issues.

**Proposed Solution:** Implement a 4-layer taxonomy inspired by GICS, NAICS, and leading SaaS platforms (Salesforce, HubSpot, Attio).

**We need expert validation on:**
1. Industry classification approach
2. Naming conventions
3. Scalability concerns
4. Best practices from similar platforms

---

## 🔴 PROBLEM STATEMENT

### Current Situation

We have implemented industry-specific i18n namespaces:

```
concept-restaurant.json       → Is this "Hospitality" or "Food Service"?
concept-healthcare.json       → Is this "Healthcare" or "Medical Services"?
concept-media.json           → Is this "Entertainment" or "Broadcasting"?
concept-nonprofit.json       → Is this "Social Services" or "Charitable Orgs"?
```

**Issues:**
1. ❌ **No hierarchical classification** - flat structure doesn't scale
2. ❌ **Ambiguous naming** - "restaurant" could be QSR, fine dining, catering
3. ❌ **Missing universal concepts** - accounting, HR, marketing duplicated across industries
4. ❌ **No sub-industry support** - can't differentiate hospital vs. clinic vs. dental office

### Business Impact

- 🚫 **Scalability blocker:** Adding new industries requires ad-hoc decisions
- 🚫 **Maintenance overhead:** 40% duplication of common business terms
- 🚫 **Translation waste:** 9,000+ unnecessary translations for duplicated keys
- 🚫 **Developer confusion:** Unclear where to put new terminology

---

## ⚙️ CURRENT IMPLEMENTATION

### Architecture (As of 2025-12-27)

**3-Layer Strategy:**

```
┌─────────────────────────────────────────────────────┐
│ LAYER 1: TRANSVERSAL (Common to all industries)    │
│ Files: common.json, calendar.json, tasks.json      │
│ Examples: "save", "cancel", "pending", "schedule"  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 2: CONCEPT (Industry terminology)            │
│ Files: concept-restaurant.json, concept-legal.json │
│ Examples: "appetizer", "subpoena", "chemotherapy"  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 3: WORKSPACE (Functionality specific)        │
│ Files: workspace-restaurant.json, workspace-legal  │
│ Examples: "fire order", "conflict check", "triage" │
└─────────────────────────────────────────────────────┘
```

### File Structure

```
src/lib/i18n/translations/
├── en/
│   ├── common.json                      ← Layer 1: Universal
│   ├── calendar.json                    ← Layer 1: Scheduling
│   ├── tasks.json                       ← Layer 1: Task management
│   │
│   ├── concept-restaurant.json          ← Layer 2: Restaurant context
│   ├── workspace-restaurant.json        ← Layer 3: POS functionality
│   │
│   ├── concept-legal-firm.json          ← Layer 2: Legal context
│   ├── workspace-legal.json             ← Layer 3: Case management
│   │
│   ├── concept-healthcare.json          ← Layer 2: Medical context
│   ├── workspace-healthcare.json        ← Layer 3: EMR functionality
│   │
│   ├── concept-media.json               ← Layer 2: Broadcasting context
│   ├── workspace-broadcast-studio.json  ← Layer 3: Studio control
│   │
│   ├── concept-nonprofit.json           ← Layer 2: Nonprofit context
│   ├── workspace-nonprofit-portal.json  ← Layer 3: Donor/beneficiary portal
│   │
│   ├── concept-agency.json              ← Layer 2: Agency context
│   └── workspace-client-portal.json     ← Layer 3: Client management
│
├── es/ (Spanish) - Same structure × 12 namespaces
├── ar/ (Arabic) - Same structure × 12 namespaces
├── zh/ (Chinese) - Same structure × 12 namespaces
├── fr/ (French) - Same structure × 12 namespaces
├── pt/ (Portuguese) - Same structure × 12 namespaces
├── de/ (German) - Same structure × 12 namespaces
├── it/ (Italian) - Same structure × 12 namespaces
└── ko/ (Korean) - Same structure × 12 namespaces
```

**Total:** 108 files (12 namespaces × 9 languages)

### Example Usage

```typescript
import { useTranslation } from '@/lib/i18n';

const RestaurantPOS = () => {
  const { t: tCommon } = useTranslation('common');           // Layer 1
  const { t: tConcept } = useTranslation('concept-restaurant'); // Layer 2
  const { t: tWorkspace } = useTranslation('workspace-restaurant'); // Layer 3

  return (
    <>
      <Button>{tCommon('buttons.save')}</Button>           {/* Universal */}
      <h2>{tConcept('concept.menu.category.appetizer')}</h2> {/* Industry context */}
      <span>{tWorkspace('kitchen.order.fire')}</span>      {/* App-specific */}
    </>
  );
};
```

### DRY (Don't Repeat Yourself) Strategy

**What we DON'T duplicate:**
- ❌ Generic actions: save, cancel, delete, edit, add
- ❌ Common statuses: pending, confirmed, completed, cancelled
- ❌ Time terms: today, yesterday, tomorrow, this week
- ❌ Priority levels: low, medium, high, urgent
- ❌ Payment terms: monthly, yearly, recurring, one-time

**What we DO include:**
- ✅ Kitchen operations: "Fire Order", "86 (Out of Stock)"
- ✅ Legal proceedings: "Statute of Limitations", "Deposition"
- ✅ Medical terms: "Oxygen Saturation", "Chief Complaint"
- ✅ Broadcasting: "Crossfade", "Talkover", "Back Announce"
- ✅ Nonprofit: "Survivorship", "Memorial Donation"

### Metrics

**Before refactor:**
- Total keys: ~2,500
- Duplications: ~40% (1,000 keys)
- Translation cost: 22,500 (2,500 × 9 languages)

**After refactor:**
- Total keys: ~1,500
- Duplications: ~0%
- Translation cost: 13,500 (1,500 × 9 languages)
- **Savings:** 9,000 translations (40%)

---

## 🏗️ PROPOSED ARCHITECTURE

### 4-Layer Taxonomy

```
┌──────────────────────────────────────────────────────────┐
│ LAYER 0: UNIVERSAL CONCEPTS (cross-industry)             │
│ Files: universal/accounting.json, universal/hr.json      │
│ Examples: "invoice", "employee", "campaign"              │
│ Use case: Concepts that NEVER change across industries   │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│ LAYER 1: INDUSTRY VERTICAL                               │
│ Files: industry-healthcare.json, industry-hospitality    │
│ Examples: "patient" (healthcare), "guest" (hospitality)  │
│ Use case: High-level industry classification             │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│ LAYER 2: SUB-INDUSTRY                                    │
│ Files: subindustry-hospital.json, subindustry-clinic     │
│ Examples: "ward" (hospital), "treatment room" (clinic)   │
│ Use case: Specific business type within industry         │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│ LAYER 3: WORKSPACE (functionality)                       │
│ Files: workspace-emr.json, workspace-pos.json            │
│ Examples: "Fire Order" (POS), "ICD-10 Code" (EMR)        │
│ Use case: Application-specific operations                │
└──────────────────────────────────────────────────────────┘
```

### LAYER 0: Universal Concepts

**Concepts that apply to ALL industries:**

```json
// universal/accounting.json
{
  "accounting": {
    "invoice": "Invoice",
    "receipt": "Receipt",
    "ledger": "General Ledger",
    "balanceSheet": "Balance Sheet",
    "profitAndLoss": "Profit & Loss",
    "taxReturn": "Tax Return"
  }
}

// universal/hr.json
{
  "hr": {
    "employee": "Employee",
    "contractor": "Contractor",
    "payroll": "Payroll",
    "benefits": "Benefits",
    "timeOff": "Time Off",
    "performance": "Performance Review"
  }
}

// universal/marketing.json
{
  "marketing": {
    "campaign": "Campaign",
    "lead": "Lead",
    "conversion": "Conversion",
    "analytics": "Analytics",
    "email": "Email Marketing",
    "socialMedia": "Social Media"
  }
}

// universal/operations.json
{
  "operations": {
    "inventory": "Inventory",
    "scheduling": "Scheduling",
    "logistics": "Logistics",
    "procurement": "Procurement",
    "quality": "Quality Control"
  }
}

// universal/sales.json
{
  "sales": {
    "quote": "Quote",
    "proposal": "Proposal",
    "contract": "Contract",
    "deal": "Deal",
    "pipeline": "Pipeline"
  }
}
```

### LAYER 1: Industry Verticals

**Based on GICS + Salesforce Industries + Common Sense:**

```
1. Healthcare & Life Sciences
2. Financial Services
3. Hospitality & Food Service
4. Professional Services (Legal, Consulting, Accounting)
5. Media & Entertainment
6. Nonprofit & Social Services
7. Technology & SaaS
8. Education
9. Retail & E-commerce
10. Real Estate & Property Management
11. Manufacturing & Industrial
12. Government & Public Sector
```

**Example: Healthcare Industry**

```json
// industry-healthcare.json
{
  "entity": {
    "patient": "Patient",
    "provider": "Healthcare Provider",
    "facility": "Healthcare Facility",
    "insurancePayer": "Insurance Payer"
  },
  "appointment": {
    "type": {
      "newPatient": "New Patient",
      "followUp": "Follow-up",
      "annual": "Annual Physical",
      "urgent": "Urgent Care"
    }
  },
  "medical": {
    "diagnosis": "Diagnosis",
    "treatment": "Treatment",
    "prescription": "Prescription",
    "procedure": "Medical Procedure"
  },
  "compliance": {
    "hipaa": "HIPAA",
    "consent": "Patient Consent",
    "authorization": "Authorization"
  }
}
```

### LAYER 2: Sub-Industries

**Healthcare Sub-Industries:**

```
Healthcare/
├─ Hospitals
├─ Clinics
├─ Dental Practices
├─ Mental Health Centers
├─ Home Health Care
├─ Oncology Centers (Cancer Care)
├─ Urgent Care
├─ Rehabilitation Centers
├─ Pharmacies
└─ Diagnostic Labs
```

**Example: Hospital Sub-Industry**

```json
// subindustry-hospital.json
{
  "department": {
    "emergency": "Emergency Department",
    "icu": "Intensive Care Unit",
    "operatingRoom": "Operating Room",
    "maternity": "Maternity Ward",
    "pediatrics": "Pediatrics",
    "oncology": "Oncology"
  },
  "resource": {
    "bed": "Hospital Bed",
    "ward": "Ward",
    "nurseStation": "Nurse Station",
    "surgicalSuite": "Surgical Suite"
  },
  "process": {
    "admission": "Patient Admission",
    "discharge": "Patient Discharge",
    "transfer": "Patient Transfer",
    "rounds": "Medical Rounds"
  }
}
```

**Hospitality Sub-Industries:**

```
Hospitality/
├─ Restaurants
│   ├─ Quick Service (QSR)
│   ├─ Fine Dining
│   ├─ Casual Dining
│   ├─ Fast Casual
│   └─ Catering
├─ Hotels
├─ Event Venues
├─ Bars & Nightlife
└─ Food Trucks
```

**Example: Restaurant Sub-Industry**

```json
// subindustry-restaurant.json
{
  "dining": {
    "area": {
      "diningRoom": "Dining Room",
      "bar": "Bar Area",
      "patio": "Patio",
      "privateRoom": "Private Dining Room"
    },
    "service": {
      "dineIn": "Dine-In",
      "takeout": "Takeout",
      "delivery": "Delivery",
      "curbside": "Curbside Pickup"
    }
  },
  "kitchen": {
    "station": {
      "grill": "Grill Station",
      "saute": "Sauté Station",
      "cold": "Cold Station",
      "expo": "Expo"
    }
  },
  "menu": {
    "category": {
      "appetizer": "Appetizer",
      "entree": "Entrée",
      "dessert": "Dessert",
      "beverage": "Beverage"
    }
  }
}
```

### LAYER 3: Workspace (Functionality)

**Application-specific operations (unchanged from current architecture)**

```json
// workspace-pos.json (Restaurant POS system)
{
  "order": {
    "fire": "Fire Order",
    "86": "86 (Out of Stock)",
    "allDay": "All Day",
    "onTheFly": "On the Fly"
  },
  "modifier": {
    "wellDone": "Well Done",
    "rare": "Rare",
    "onTheSide": "On the Side"
  }
}

// workspace-emr.json (Electronic Medical Records)
{
  "vitals": {
    "bloodPressure": "Blood Pressure",
    "oxygenSaturation": "Oxygen Saturation",
    "temperature": "Temperature",
    "heartRate": "Heart Rate"
  },
  "coding": {
    "icd10": "ICD-10 Code",
    "cpt": "CPT Code"
  }
}
```

### Naming Convention

**Format:** `{layer}-{classification}.json`

**Examples:**

| Layer | Industry | Sub-Industry | File Name |
|-------|----------|--------------|-----------|
| 0 | N/A | N/A | `universal-accounting.json` |
| 1 | Healthcare | N/A | `industry-healthcare.json` |
| 2 | Healthcare | Hospital | `subindustry-hospital.json` |
| 3 | Healthcare | Hospital | `workspace-emr.json` |

**Full stack example for Hospital EMR:**

```
universal-accounting.json          ← Invoicing, billing
universal-hr.json                  ← Staff management
industry-healthcare.json           ← Patient, provider, medical records
subindustry-hospital.json          ← Ward, ICU, OR, admission
workspace-emr.json                 ← Vitals, SOAP notes, ICD-10 codes
```

---

## 📊 INDUSTRY BENCHMARKING

### How Leading Platforms Handle This

#### 1. **Salesforce Industries**

**Structure:**
```
Financial Services Cloud
├─ Banking
├─ Wealth Management
├─ Insurance
└─ Capital Markets
```

**Approach:**
- **Vertical Clouds** with industry-specific data models
- **Objects** (custom entities like "Policy", "Claim")
- **Processes** (industry workflows)
- **Terminology** (industry-specific labels)

**Key Insight:** Salesforce uses a 3-tier model: Cloud → Industry → Objects

---

#### 2. **HubSpot**

**Onboarding Classification:**
```
What industry are you in?
├─ B2B Software & SaaS
├─ Financial Services
├─ Healthcare
├─ Manufacturing
├─ Professional Services
└─ Other
```

**Then asks sub-questions:**
- "Professional Services" → Legal? Consulting? Accounting?
- "Healthcare" → Hospital? Clinic? Dental?

**Key Insight:** 2-step onboarding (Industry → Sub-Industry)

---

#### 3. **Attio (Modern CRM)**

**Onboarding:**
```
What best describes your business?
├─ B2B Software
├─ Recruiting & Staffing
├─ Venture Capital
├─ Real Estate
├─ Professional Services
└─ Other
```

**Then customizes:**
- Objects (e.g., "Candidate" for recruiting, "Property" for real estate)
- Workflows
- Terminology

**Key Insight:** Context-aware object creation based on industry

---

#### 4. **NAICS (North American Industry Classification System)**

**Official government standard:**

```
Sector (2 digits) → Subsector (3) → Industry Group (4) → Industry (5) → National (6)

Example:
62 - Healthcare and Social Assistance
  621 - Ambulatory Health Care Services
    6211 - Offices of Physicians
      62111 - Offices of Physicians
        621111 - Offices of Physicians (except Mental Health)
```

**Key Insight:** 6-level hierarchy, but overly complex for our use case

---

#### 5. **GICS (Global Industry Classification Standard)**

**Used by S&P and MSCI:**

```
11 Sectors → 25 Industry Groups → 74 Industries → 163 Sub-Industries

Example:
35 - Health Care
  3510 - Health Care Equipment & Services
    351010 - Health Care Equipment & Supplies
      35101010 - Health Care Equipment
```

**Key Insight:** Financial market classification, too granular

---

### Benchmark Summary

| Platform | Levels | Approach | Pros | Cons |
|----------|--------|----------|------|------|
| Salesforce | 3 | Cloud → Industry → Objects | Industry-specific | Proprietary |
| HubSpot | 2 | Industry → Sub-Industry | User-friendly | Limited depth |
| Attio | 2 | Business Type → Objects | Contextual | New platform |
| NAICS | 6 | Hierarchical codes | Official standard | Too complex |
| GICS | 4 | Sector-based | Global standard | Finance-focused |

**Our Proposed:** 4 levels (Universal → Industry → Sub-Industry → Workspace)

**Why 4 levels?**
- Universal concepts reduce duplication
- Industry provides high-level grouping
- Sub-Industry allows specificity
- Workspace maintains app-specific logic

---

## 🔧 TECHNICAL IMPLEMENTATION

### File Structure (Proposed)

```
src/lib/i18n/translations/
├── en/
│   ├── universal/
│   │   ├── accounting.json
│   │   ├── hr.json
│   │   ├── marketing.json
│   │   ├── operations.json
│   │   └── sales.json
│   │
│   ├── industry/
│   │   ├── healthcare.json
│   │   ├── hospitality.json
│   │   ├── professional-services.json
│   │   ├── media-entertainment.json
│   │   └── nonprofit.json
│   │
│   ├── subindustry/
│   │   ├── healthcare/
│   │   │   ├── hospital.json
│   │   │   ├── clinic.json
│   │   │   ├── dental.json
│   │   │   └── oncology.json
│   │   │
│   │   ├── hospitality/
│   │   │   ├── restaurant-qsr.json
│   │   │   ├── restaurant-fine-dining.json
│   │   │   ├── hotel.json
│   │   │   └── catering.json
│   │   │
│   │   └── professional-services/
│   │       ├── legal.json
│   │       ├── consulting.json
│   │       └── accounting-firm.json
│   │
│   └── workspace/
│       ├── emr.json                 ← Electronic Medical Records
│       ├── pos.json                 ← Point of Sale (Restaurant)
│       ├── case-management.json     ← Legal Case Management
│       ├── broadcast-studio.json    ← Media Production
│       └── donor-portal.json        ← Nonprofit Donor Management
│
├── es/ (Spanish) - Same structure
├── ar/ (Arabic) - Same structure
... (9 languages total)
```

### Translation Loader (Dynamic)

```typescript
// src/lib/i18n/translation-loader.ts
export async function loadTranslations(
  locale: string,
  industryVertical: 'healthcare' | 'hospitality' | 'professional-services' | ...,
  subIndustry: 'hospital' | 'clinic' | 'restaurant-qsr' | ...,
  workspaces: string[]
) {
  const translations = {};

  // Load LAYER 0: Universal (always loaded)
  const universal = await Promise.all([
    import(`./translations/${locale}/universal/accounting.json`),
    import(`./translations/${locale}/universal/hr.json`),
    import(`./translations/${locale}/universal/marketing.json`),
    import(`./translations/${locale}/universal/operations.json`),
  ]);

  // Load LAYER 1: Industry (based on tenant configuration)
  const industry = await import(
    `./translations/${locale}/industry/${industryVertical}.json`
  );

  // Load LAYER 2: Sub-Industry (based on tenant configuration)
  const subIndustryTranslations = await import(
    `./translations/${locale}/subindustry/${industryVertical}/${subIndustry}.json`
  );

  // Load LAYER 3: Workspaces (based on active modules)
  const workspaceTranslations = await Promise.all(
    workspaces.map(ws => import(`./translations/${locale}/workspace/${ws}.json`))
  );

  return mergeTranslations(universal, industry, subIndustryTranslations, workspaceTranslations);
}
```

### Usage Example

```typescript
import { useTranslation } from '@/lib/i18n';

const HospitalEMR = () => {
  const { t: tUniversal } = useTranslation('universal-accounting');
  const { t: tIndustry } = useTranslation('industry-healthcare');
  const { t: tSubIndustry } = useTranslation('subindustry-hospital');
  const { t: tWorkspace } = useTranslation('workspace-emr');

  return (
    <>
      {/* Universal concept */}
      <Button>{tUniversal('accounting.invoice')}</Button>

      {/* Industry-level concept */}
      <h2>{tIndustry('entity.patient')}</h2>

      {/* Sub-industry specific */}
      <Ward>{tSubIndustry('department.icu')}</Ward>

      {/* Workspace-specific */}
      <VitalSign>{tWorkspace('vitals.bloodPressure')}: 120/80</VitalSign>
    </>
  );
};
```

### Configuration (Per Tenant)

```typescript
// Database or config file
interface TenantConfig {
  id: string;
  name: string;
  industry: {
    vertical: 'healthcare' | 'hospitality' | 'professional-services' | ...;
    subIndustry: string; // e.g., "hospital", "clinic", "restaurant-qsr"
  };
  workspaces: string[]; // e.g., ["emr", "billing", "scheduling"]
  locale: string; // Default language
  supportedLocales: string[]; // Available languages
}

// Example tenant
const exampleHospital: TenantConfig = {
  id: "hospital-abc",
  name: "ABC General Hospital",
  industry: {
    vertical: "healthcare",
    subIndustry: "hospital"
  },
  workspaces: ["emr", "scheduling", "billing"],
  locale: "en",
  supportedLocales: ["en", "es", "zh"]
};
```

### Performance Optimization

**Lazy Loading:**
```typescript
// Only load translations when needed
const translations = await loadTranslations(
  tenant.locale,
  tenant.industry.vertical,
  tenant.industry.subIndustry,
  tenant.workspaces
);
```

**Caching:**
```typescript
// Cache translations with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const TTL = 30 * 60 * 1000; // 30 minutes
```

**Bundle Splitting:**
```
universal-accounting.en.chunk.js    ← Always loaded
industry-healthcare.en.chunk.js     ← Loaded for healthcare tenants
subindustry-hospital.en.chunk.js    ← Loaded for hospitals
workspace-emr.en.chunk.js           ← Loaded when EMR module active
```

---

## 🛤️ MIGRATION PATH

### Phase 1: Analysis & Validation (Week 1)
- [ ] Get feedback on this RFC from OpenAI, industry experts, team
- [ ] Validate taxonomy with 3-5 real customer use cases
- [ ] Finalize naming conventions
- [ ] Document decision rationale

### Phase 2: Prototype (Week 2)
- [ ] Create new file structure for 1 industry (Healthcare)
- [ ] Implement dynamic translation loader
- [ ] Test with Hospital + Clinic sub-industries
- [ ] Measure performance impact
- [ ] Validate with real users

### Phase 3: Migration Script (Week 3)
- [ ] Build automated migration tool
  - Map current `concept-restaurant.json` → `industry-hospitality.json` + `subindustry-restaurant.json`
  - Map current `workspace-restaurant.json` → `workspace-pos.json`
  - Detect duplications and move to `universal-*.json`
- [ ] Create compatibility layer (backwards compatibility)
- [ ] Test migration with all 6 current industries

### Phase 4: Rollout (Week 4-5)
- [ ] Migrate English (EN) first
- [ ] Validate all namespaces work
- [ ] Replicate to 8 other languages
- [ ] Update documentation
- [ ] Train team on new structure

### Phase 5: Deprecation (Week 6+)
- [ ] Mark old namespaces as deprecated
- [ ] Provide migration guide for developers
- [ ] Remove old structure in 3 months

### Backwards Compatibility

**Option A: Alias System**
```typescript
// Support old namespace names
const aliasMap = {
  'concept-restaurant': 'subindustry-restaurant',
  'workspace-restaurant': 'workspace-pos',
};

export function useTranslation(namespace: string) {
  const actualNamespace = aliasMap[namespace] || namespace;
  return useTranslationInternal(actualNamespace);
}
```

**Option B: Gradual Migration**
- Keep old files for 6 months
- Add deprecation warnings
- Update codebase incrementally
- Remove old files after full migration

---

## ❓ OPEN QUESTIONS

### 1. Industry Classification Standard

**Question:** Should we adopt an existing standard or create our own?

**Options:**
- **A. NAICS (North American Industry Classification System)**
  - ✅ Official government standard
  - ✅ Well-documented
  - ❌ Too complex (6 levels)
  - ❌ North America-focused

- **B. GICS (Global Industry Classification Standard)**
  - ✅ Global standard
  - ✅ Used by S&P/MSCI
  - ❌ Finance-focused
  - ❌ 4 levels may be too granular

- **C. Custom (inspired by Salesforce/HubSpot)**
  - ✅ Tailored to our needs
  - ✅ Simplified
  - ❌ Not industry-standard
  - ❌ Need to maintain ourselves

**Recommendation:** Start with **Option C (Custom)**, but align naming with NAICS/GICS where possible.

---

### 2. Sub-Industry Granularity

**Question:** How deep should sub-industries go?

**Example - Healthcare:**

```
Option A: 2 Levels
Healthcare/
├─ Hospitals
└─ Clinics

Option B: 3 Levels
Healthcare/
├─ Hospitals/
│   ├─ General Hospital
│   ├─ Specialty Hospital (Oncology, Cardiology, etc.)
│   └─ Pediatric Hospital
└─ Clinics/
    ├─ Primary Care
    ├─ Urgent Care
    └─ Specialty Clinic

Option C: 4 Levels
Healthcare/
├─ Hospitals/
│   ├─ General Hospital/
│   │   ├─ Urban
│   │   └─ Rural
│   └─ Specialty Hospital/
│       ├─ Oncology Center
│       └─ Heart Institute
...
```

**Trade-off:**
- Deeper = More precise, but more files to maintain
- Shallower = Simpler, but may need to duplicate terms

**Recommendation:** Start with **2-3 levels**, expand as needed.

---

### 3. Universal Concepts Boundary

**Question:** What qualifies as "universal"?

**Clear Universal:**
- ✅ Accounting (invoice, receipt, ledger)
- ✅ HR (employee, payroll, benefits)
- ✅ Marketing (campaign, lead, conversion)

**Ambiguous Cases:**

| Term | Universal? | Reasoning |
|------|------------|-----------|
| "Customer" | ✅ Yes | All industries have customers |
| "Patient" | ❌ No | Healthcare-specific |
| "Appointment" | 🤔 Maybe | Universal concept, but "medical appointment" vs "table reservation" different semantics |
| "Inventory" | ✅ Yes | Restaurants, hospitals, retail all have inventory |
| "Prescription" | ❌ No | Healthcare/pharmacy only |

**Recommendation:** Use **3-industry rule** - if a term is used in 3+ unrelated industries with the SAME meaning, it's universal.

---

### 4. Naming Convention Debate

**Current proposal:** `{layer}-{classification}.json`

**Alternatives:**

| Convention | Example | Pros | Cons |
|------------|---------|------|------|
| A. Prefix | `universal-accounting.json` | Clear hierarchy | Long names |
| B. Folder | `universal/accounting.json` | Clean structure | Deeper nesting |
| C. Suffix | `accounting.universal.json` | IDE auto-complete | Backwards |
| D. Code | `00-accounting.json` | Sortable | Not semantic |

**Recommendation:** **Option B (Folder structure)** for clarity and organization.

---

### 5. Translation Granularity

**Question:** Should we split translations by file or keep namespaces large?

**Option A: Many Small Files (Current)**
- `universal-accounting.json` (50 keys)
- `universal-hr.json` (40 keys)
- Total: 20 small files

**Option B: Few Large Files**
- `universal.json` (500 keys - includes accounting, HR, marketing, etc.)
- Total: 4-5 large files

**Trade-offs:**

| Aspect | Many Small Files | Few Large Files |
|--------|------------------|-----------------|
| Bundle size | Smaller (lazy load) | Larger (load everything) |
| Maintenance | Easier to find terms | Harder to navigate |
| Performance | Better (only load needed) | Worse (load all) |
| Developer UX | Better (clear separation) | Worse (one big file) |

**Recommendation:** **Many small files** for better lazy loading and developer experience.

---

## 📢 REQUEST FOR FEEDBACK

We need validation from experts on the following:

### 1. **Industry Classification**

**Questions:**
- Is our proposed industry taxonomy (Healthcare, Hospitality, Professional Services, etc.) comprehensive?
- Are there industries we're missing that are common in SaaS?
- Should we align with NAICS/GICS or create our own?

**Specific feedback needed:**
- Industry names (e.g., "Professional Services" vs "Business Services")
- Sub-industry depth (2 levels? 3 levels?)
- Edge cases (e.g., where does "dental" fit? Healthcare or standalone?)

---

### 2. **Universal Concepts Scope**

**Questions:**
- What business concepts are TRULY universal across all industries?
- How do we handle terms that are 80% universal but have industry-specific nuances?

**Examples to validate:**

| Term | Our Classification | Feedback Requested |
|------|-------------------|-------------------|
| Invoice | Universal | ✅ Agree? |
| Appointment | Universal | 🤔 Or industry-specific? |
| Customer | Universal | ✅ Agree? |
| Inventory | Universal | ✅ Agree? |
| Treatment Plan | Industry (Healthcare) | ✅ Agree? |
| Menu | Industry (Hospitality) | ✅ Agree? |

---

### 3. **Naming Conventions**

**Questions:**
- Is `industry-healthcare.json` clear?
- Should we use folders (`industry/healthcare.json`) or prefixes?
- Should we use full words or abbreviations? (`subindustry` vs `sub`)

**Alternatives to consider:**
```
Option A: industry-healthcare.json
Option B: healthcare.industry.json
Option C: industry/healthcare.json
Option D: industries/healthcare/index.json
```

---

### 4. **Scalability Concerns**

**Questions:**
- Will this architecture scale to 50+ industries?
- Will this architecture scale to 100+ languages?
- How do we handle regional variations? (e.g., "UK Healthcare" vs "US Healthcare")

**Specific concerns:**
- File count: Will 1000+ translation files be manageable?
- Bundle size: Will lazy loading be enough?
- Cache invalidation: How do we handle updates to translations?

---

### 5. **Developer Experience**

**Questions:**
- Is the 4-layer hierarchy too complex for developers?
- Should we provide code generation tools?
- What IDE tooling would help?

**Example developer flow:**
```typescript
// Current (3 layers)
const { t } = useTranslation('concept-restaurant');
t('menu.category.appetizer');

// Proposed (4 layers)
const { t } = useTranslation('subindustry-restaurant');
t('menu.category.appetizer');

// Alternative (auto-resolve)
const { t } = useIndustryTranslation(); // Auto-detects tenant's industry
t('menu.category.appetizer');
```

Which approach is most intuitive?

---

### 6. **Migration Path**

**Questions:**
- Is our proposed 5-phase migration realistic?
- Should we migrate gradually or all at once?
- How long should we maintain backwards compatibility?

**Migration timeline:**
- Week 1: Validation
- Week 2-3: Prototype + Migration Script
- Week 4-5: Rollout to production
- Week 6+: Deprecation of old structure

Is 6 weeks realistic for 108 files across 9 languages?

---

### 7. **AI Integration**

**Questions:**
- Can we use AI (GPT-4/Claude) to auto-classify new terminology?
- Should we build an AI "terminology resolver" that suggests the right namespace?

**Example AI tool:**
```typescript
// AI suggests where to put a new term
const suggestion = await classifyTerm("Fire Order");
// Returns: { layer: 3, namespace: "workspace-pos.json", reasoning: "..." }
```

Would this be helpful?

---

## 🎯 HOW TO PROVIDE FEEDBACK

### For OpenAI Review
Please analyze this RFC and provide feedback on:
1. Industry classification approach vs. industry standards (NAICS/GICS)
2. Universal concepts boundary (what truly applies to all industries?)
3. Scalability to 50+ industries and 100+ languages
4. Best practices from similar multi-tenant SaaS platforms
5. Potential pitfalls or anti-patterns we should avoid

### For Industry Experts
Please review the following sections:
1. Industry taxonomy (Layer 1) - are industries correctly categorized?
2. Sub-industry examples (Layer 2) - are these realistic business types?
3. Terminology examples - do these match real-world usage?

### For Internal Team
Please validate:
1. Technical implementation approach
2. Migration path and timeline
3. Developer experience
4. Performance implications

---

## 📚 APPENDIX

### A. Complete Industry Taxonomy (Proposed)

```
1. Healthcare & Life Sciences
   ├─ Hospitals
   ├─ Clinics
   ├─ Dental Practices
   ├─ Mental Health Centers
   ├─ Home Health Care
   ├─ Oncology Centers
   ├─ Pharmacies
   ├─ Diagnostic Labs
   └─ Veterinary

2. Financial Services
   ├─ Banking
   ├─ Wealth Management
   ├─ Insurance
   ├─ Credit Unions
   ├─ Payment Processing
   └─ Accounting Firms

3. Hospitality & Food Service
   ├─ Restaurants (QSR, Fine Dining, Casual)
   ├─ Hotels & Resorts
   ├─ Catering
   ├─ Bars & Nightlife
   ├─ Event Venues
   └─ Food Trucks

4. Professional Services
   ├─ Legal (Law Firms)
   ├─ Consulting
   ├─ Accounting & Tax
   ├─ Architecture & Engineering
   ├─ Marketing Agencies
   └─ Recruiting & Staffing

5. Media & Entertainment
   ├─ Broadcasting (Radio, TV)
   ├─ Streaming Services
   ├─ Podcasts
   ├─ Content Creators (YouTube, TikTok)
   ├─ Production Studios
   ├─ Gaming
   └─ Publishing

6. Nonprofit & Social Services
   ├─ Health & Medical Nonprofits
   ├─ Education Nonprofits
   ├─ Environmental Orgs
   ├─ Animal Welfare
   ├─ Human Rights Orgs
   ├─ Religious Organizations
   └─ Community Centers

7. Technology & SaaS
   ├─ Software Development
   ├─ IT Services
   ├─ Cloud Services
   ├─ Cybersecurity
   └─ Data Analytics

8. Education
   ├─ K-12 Schools
   ├─ Higher Education
   ├─ Vocational Training
   ├─ Online Learning
   └─ Tutoring Centers

9. Retail & E-commerce
   ├─ Online Retail
   ├─ Brick & Mortar Stores
   ├─ Wholesale
   ├─ Marketplace Platforms
   └─ Subscription Boxes

10. Real Estate & Property Management
    ├─ Residential Real Estate
    ├─ Commercial Real Estate
    ├─ Property Management
    ├─ Co-living Spaces
    └─ Short-term Rentals (Airbnb-style)

11. Manufacturing & Industrial
    ├─ Discrete Manufacturing
    ├─ Process Manufacturing
    ├─ Warehousing & Distribution
    └─ Supply Chain

12. Government & Public Sector
    ├─ Federal Agencies
    ├─ State/Provincial Govt
    ├─ Local Government
    └─ Public Safety
```

### B. Universal Concepts Inventory

**Confirmed Universal (100% confidence):**
- Accounting: invoice, receipt, ledger, balance sheet, P&L
- HR: employee, contractor, payroll, benefits, time off
- Marketing: campaign, lead, conversion, email, social media
- Sales: quote, proposal, contract, deal, pipeline
- Operations: inventory, scheduling, logistics, procurement

**Likely Universal (80% confidence):**
- Customer/Client (all industries serve customers)
- Appointment/Booking (many industries schedule appointments)
- Payment (all industries accept payments)
- Report/Analytics (all industries need reporting)
- Settings/Preferences (all software has settings)

**Debatable (need expert input):**
- "Order" - Universal? Or industry-specific? (e.g., restaurant order vs. manufacturing order)
- "Reservation" - Universal? Or hospitality-specific?
- "Case" - Universal? Or legal/healthcare-specific?

### C. Workspace Inventory (Current)

**Existing Workspaces:**
1. `workspace-pos.json` - Point of Sale (Restaurant)
2. `workspace-emr.json` - Electronic Medical Records (Healthcare)
3. `workspace-case-management.json` - Legal Case Management
4. `workspace-broadcast-studio.json` - Media Production Control
5. `workspace-donor-portal.json` - Nonprofit Donor Management
6. `workspace-client-portal.json` - Agency Client Management

**Potential Future Workspaces:**
- `workspace-lms.json` - Learning Management System (Education)
- `workspace-crm.json` - Customer Relationship Management (Sales)
- `workspace-pms.json` - Property Management System (Real Estate)
- `workspace-wms.json` - Warehouse Management System (Manufacturing)

### D. Translation File Count Estimate

**Current (3 layers):**
- Transversal: 3 files × 9 languages = 27 files
- Concept: 6 industries × 9 languages = 54 files
- Workspace: 6 workspaces × 9 languages = 54 files
- **Total: 135 files**

**Proposed (4 layers):**
- Universal: 5 files × 9 languages = 45 files
- Industry: 12 verticals × 9 languages = 108 files
- Sub-Industry: 30 sub-industries × 9 languages = 270 files
- Workspace: 10 workspaces × 9 languages = 90 files
- **Total: 513 files**

**Growth:** 135 → 513 files (3.8x increase)

**Mitigation:**
- Lazy loading (only load needed files)
- Bundle splitting
- CDN caching
- Gzip compression

---

## 📝 CHANGELOG

- **2025-12-27:** Initial RFC draft
- **2025-12-27:** Added benchmarking section (Salesforce, HubSpot, Attio, NAICS, GICS)
- **2025-12-27:** Added technical implementation details
- **2025-12-27:** Added migration path and open questions

---

## ✅ NEXT STEPS

1. **Week 1:** Gather feedback from:
   - OpenAI (AI perspective on classification)
   - Industry experts (validate taxonomy)
   - Internal team (technical feasibility)

2. **Week 1-2:** Iterate on RFC based on feedback

3. **Week 2:** Make Go/No-Go decision on new architecture

4. **Week 3+:** If approved, begin Phase 1 (Prototype)

---

**Questions? Feedback? Please submit via:**
- Email: engineering@vibethink.com
- GitHub Discussion: [Link]
- Slack: #i18n-architecture

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**

**Authors:** VibeThink Engineering Team
**Contributors:** Claude Sonnet 4.5 (AI Assistant)
**Version:** 1.0.0
**Last Updated:** 2025-12-27
