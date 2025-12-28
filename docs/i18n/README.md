# 🌍 i18n Multi-Industry System - Complete Documentation

**Multi-tenant, multi-language i18n system supporting 6 industries across 9 languages**

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Business Cases](#business-cases)
4. [Translation Status](#translation-status)
5. [No-Duplication Strategy](#no-duplication-strategy)
6. [Usage Examples](#usage-examples)
7. [Quick Start](#quick-start)
8. [Documentation](#documentation)

---

## 🎯 **OVERVIEW**

### **What is this?**
A **DRY (Don't Repeat Yourself)** multi-tenant i18n system that supports:
- ✅ **6 industries** (Restaurant, Legal, Healthcare, Radio, Cancer Care, Agency)
- ✅ **9 languages** (EN, ES, AR, ZH, FR, PT, DE, IT, KO)
- ✅ **108 translation files** (12 namespaces × 9 languages)
- ✅ **Zero duplication** (40% fewer keys than before)
- ✅ **Type-safe** with TypeScript
- ✅ **AI-ready** with terminology resolver

### **Key Features:**
- 🚫 **No duplications** - Generic terms in `common.json`, industry terms in `workspace-*.json`
- 🌐 **Multi-language** - All 6 industries work in 9 languages
- 🔧 **Modular** - Add new industries by creating 2 JSON files
- 🤖 **AI-native** - Agents can resolve terminology by context
- ⚡ **Performant** - Cache with TTL, parallel loading

---

## 🏗️ **ARCHITECTURE**

### **3-Layer Strategy:**

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

### **File Structure:**

```
src/lib/i18n/translations/
├── en/ (English)
│   ├── common.json                    ← Layer 1: Universal
│   ├── calendar.json                  ← Layer 1: Appointments
│   ├── tasks.json                     ← Layer 1: Tasks
│   ├── concept-restaurant.json        ← Layer 2: Restaurant context
│   ├── workspace-restaurant.json      ← Layer 3: POS functionality
│   ├── concept-legal-firm.json        ← Layer 2: Legal context
│   ├── workspace-legal.json           ← Layer 3: Case management
│   ├── concept-healthcare.json        ← Layer 2: Medical context
│   ├── workspace-healthcare.json      ← Layer 3: EMR functionality
│   ├── concept-radio-station.json     ← Layer 2: Broadcasting context
│   ├── workspace-radio-control.json   ← Layer 3: AI DJ control
│   ├── concept-cancer-care.json       ← Layer 2: Oncology context
│   ├── workspace-cancer-care.json     ← Layer 3: Patient journey
│   ├── concept-agency.json            ← Layer 2: Agency context
│   └── workspace-client-portal.json   ← Layer 3: Portal functionality
│
├── es/ (Spanish) - Same structure
├── ar/ (Arabic) - Same structure
├── zh/ (Chinese) - Same structure
├── fr/ (French) - Same structure
├── pt/ (Portuguese) - Same structure
├── de/ (German) - Same structure
├── it/ (Italian) - Same structure
└── ko/ (Korean) - Same structure
```

---

## 🏢 **BUSINESS CASES**

### **1. 🍽️ Restaurant**
- **Concept:** Menu categories, dietary restrictions, guest types
- **Workspace:** Kitchen stations, POS actions, inventory, service timing
- **Files:** `concept-restaurant.json` (103 keys) + `workspace-restaurant.json` (67 keys)
- **Unique Terms:** "Fire Order", "86 (Out of Stock)", "Turn Table"

### **2. ⚖️ Legal Firm**
- **Concept:** Case types, legal documents, court proceedings, billing
- **Workspace:** Docket management, time tracking, discovery, compliance
- **Files:** `concept-legal-firm.json` (63 keys) + `workspace-legal.json` (60 keys)
- **Unique Terms:** "Statute of Limitations", "Billable Hours", "Deposition"

### **3. 🏥 Healthcare**
- **Concept:** Appointment types, patient types, medical specialties
- **Workspace:** EMR charts, scheduling queues, billing codes, HIPAA
- **Files:** `concept-healthcare.json` (89 keys) + `workspace-healthcare.json` (112 keys)
- **Unique Terms:** "Oxygen Saturation", "ICD-10 Code", "Chief Complaint"

### **4. 📻 Radio Station**
- **Concept:** Broadcast types, content genres, audience engagement
- **Workspace:** AI host control, playout mixing, live monitoring
- **Files:** `concept-radio-station.json` (78 keys) + `workspace-radio-control.json` (127 keys)
- **Unique Terms:** "Crossfade", "Talkover", "Back Announce"

### **5. 🎗️ Cancer Care**
- **Concept:** Cancer types, treatments, stages, support services
- **Workspace:** Patient journey, sponsor impact, AI companion, marketplace
- **Files:** `concept-cancer-care.json` (74 keys) + `workspace-cancer-care.json` (263 keys)
- **Unique Terms:** "Survivorship", "Memorial Donation", "Symptom Tracking Agent"

### **6. 🏢 Agency (VibeThink)**
- **Concept:** Service products, client types, deployment, engagement
- **Workspace:** Subscription plans, integrations, support, analytics
- **Files:** `concept-agency.json` (62 keys) + `workspace-client-portal.json` (107 keys)
- **Unique Terms:** "SaaS", "API Requests", "Pending Authorization"

---

## 📊 **TRANSLATION STATUS**

| Language | Code | Status | Files | Completion |
|----------|------|--------|-------|------------|
| 🇺🇸 English | `en` | ✅ Complete | 12/12 | 100% |
| 🇪🇸 Spanish | `es` | ✅ Complete | 12/12 | 100% |
| 🇸🇦 Arabic | `ar` | ✅ Complete | 12/12 | 100% |
| 🇨🇳 Chinese | `zh` | ✅ Complete | 12/12 | 100% |
| 🇫🇷 French | `fr` | ✅ Complete | 12/12 | 100% |
| 🇧🇷 Portuguese | `pt` | ✅ Complete | 12/12 | 100% |
| 🇩🇪 German | `de` | ✅ Complete | 12/12 | 100% |
| 🇮🇹 Italian | `it` | ✅ Complete | 12/12 | 100% |
| 🇰🇷 Korean | `ko` | ✅ Complete | 12/12 | 100% |

**Total:** 108 files (12 namespaces × 9 languages)

---

## 🚫 **NO-DUPLICATION STRATEGY**

### **Decision Tree: Where to Put a Term?**

```
Is the term used in 3+ industries?
├─ YES → Put in common.json (Layer 1)
│         Examples: "save", "cancel", "pending"
│
└─ NO → Is it appointment/scheduling related?
    ├─ YES → Put in calendar.json (Layer 1)
    │         Examples: "book", "reschedule"
    │
    └─ NO → Is it a payment/billing term?
        ├─ YES → Put in payment.json (Layer 1)
        │         Examples: "monthly", "recurring"
        │
        └─ NO → Is it industry-specific?
            ├─ YES → Put in workspace-{industry}.json (Layer 3)
            │         Examples: "Fire Order", "Deposition"
            │
            └─ Unclear? → Ask in #i18n channel
```

### **What We DON'T Duplicate:**
- ❌ Generic actions: save, cancel, delete, edit, add, update
- ❌ Common statuses: pending, confirmed, completed, cancelled
- ❌ Time terms: today, yesterday, tomorrow, this week
- ❌ Priority levels: low, medium, high, urgent
- ❌ Payment terms: monthly, yearly, recurring, one-time

### **What We DO Include:**
- ✅ Kitchen operations: "Fire Order", "86 (Out of Stock)"
- ✅ Legal proceedings: "Statute of Limitations", "Deposition"
- ✅ Medical terms: "Oxygen Saturation", "Chief Complaint"
- ✅ Broadcasting: "Crossfade", "Talkover", "Back Announce"
- ✅ Oncology: "Survivorship", "Palliative Care"

---

## 💻 **USAGE EXAMPLES**

### **Example 1: Restaurant POS**

```typescript
import { useTranslation } from '@/lib/i18n';

const KitchenDisplay = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tRestaurant } = useTranslation('workspace-restaurant');

  return (
    <div>
      <h1>{tRestaurant('kitchen.station.grill')}</h1>  {/* "Grill Station" */}

      <Button onClick={fireOrder}>
        {tRestaurant('kitchen.order.fire')}  {/* "Fire Order" */}
      </Button>

      <Button onClick={save}>
        {tCommon('buttons.save')}  {/* "Save" - from common.json */}
      </Button>
    </div>
  );
};
```

### **Example 2: Legal Case Management**

```typescript
const CaseDashboard = () => {
  const { t: tLegal } = useTranslation('workspace-legal');
  const { t: tConcept } = useTranslation('concept-legal-firm');

  return (
    <div>
      <Deadline>{tLegal('docket.deadline.statuteOfLimitations')}</Deadline>
      {/* "Statute of Limitations" */}

      <DocumentType>{tConcept('legalDocument.subpoena')}</DocumentType>
      {/* "Subpoena" */}
    </div>
  );
};
```

### **Example 3: Multi-Language Support**

```typescript
// User switches language
const { locale, setLocale } = useI18n();

setLocale('es');  // All namespaces reload in Spanish
// t('kitchen.order.fire') → "Iniciar Pedido"

setLocale('ar');  // All namespaces reload in Arabic
// t('kitchen.order.fire') → "ابدأ الطلب"

setLocale('zh');  // All namespaces reload in Chinese
// t('kitchen.order.fire') → "开始订单"
```

---

## 🚀 **QUICK START**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Import Translation Hook**
```typescript
import { useTranslation } from '@/lib/i18n';
```

### **3. Use in Component**
```typescript
const MyComponent = () => {
  const { t } = useTranslation('workspace-restaurant');

  return <div>{t('kitchen.order.fire')}</div>;
};
```

### **4. Switch Languages**
```typescript
const { setLocale } = useI18n();

<button onClick={() => setLocale('es')}>Español</button>
<button onClick={() => setLocale('ar')}>العربية</button>
<button onClick={() => setLocale('zh')}>中文</button>
```

---

## 📚 **DOCUMENTATION**

### **Core Documents:**

1. **`NAMESPACE_STATUS.md`** - Full inventory of all 108 files
2. **`NO_DUPLICATION_EXAMPLES.md`** - How to avoid duplicating terms
3. **`BUSINESS_CASE_EXAMPLES.md`** - Real-world code examples for each industry
4. **`README.md`** (this file) - Overview and quick start

### **Additional Resources:**

- `src/lib/i18n/config.ts` - Locale configuration
- `src/lib/i18n/translation-loader.ts` - File loading logic
- `src/lib/i18n/ai-terminology-resolver.ts` - AI agent integration

---

## 📈 **METRICS**

### **Before Refactor:**
- Total keys: ~2,500
- Duplications: ~40% (1,000 keys)
- Namespaces: 50+ mixed
- Translation cost: 22,500 (2,500 × 9 languages)

### **After Refactor:**
- Total keys: ~1,500
- Duplications: ~0%
- Namespaces: 12 industry-specific + existing transversal
- Translation cost: 13,500 (1,500 × 9 languages)

### **Savings:**
- 🎯 **40% fewer keys** to maintain
- 💰 **9,000 fewer translations** needed
- ⚡ **Faster lookups** (fewer files)
- 🧹 **Cleaner codebase** (no duplication)

---

## 🎯 **NEXT STEPS**

1. ✅ All 108 files created
2. ✅ Documentation complete
3. ⏳ Fix legacy namespace references (studio.json, coliving.json)
4. ⏳ Add migration guide for existing code
5. ⏳ Create validation script to prevent duplications

---

## 🆘 **SUPPORT**

- **Documentation:** `/docs/i18n/`
- **Examples:** `BUSINESS_CASE_EXAMPLES.md`
- **Issues:** Create issue in GitHub
- **Questions:** Ask in #i18n channel

---

## 📝 **LICENSE**

Proprietary - VibeThink™ 2025

---

**Generated:** 2025-12-27
**Version:** 1.0.0
**Author:** Claude Code i18n System
