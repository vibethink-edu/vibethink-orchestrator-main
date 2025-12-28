# 🎯 i18n NO-DUPLICATION Examples
**How we avoid repeating concepts across namespaces**

---

## 📋 **PRINCIPLE: DRY (Don't Repeat Yourself)**

**Rule:** If a term exists in `common.json`, `calendar.json`, `tasks.json`, etc., **DON'T repeat it** in industry-specific namespaces.

---

## ✅ **EXAMPLE 1: Restaurant Booking**

### ❌ **WRONG (with duplication):**

```json
// workspace-restaurant.json (BEFORE - DUPLICATED)
{
  "reservation": {
    "status": {
      "pending": "Pending",        // ← Duplicates common.json
      "confirmed": "Confirmed",    // ← Duplicates common.json
      "completed": "Completed",    // ← Duplicates common.json
      "cancelled": "Cancelled"     // ← Duplicates common.json
    },
    "action": {
      "book": "Book Reservation",  // ← calendar.json has "book"
      "cancel": "Cancel",          // ← common.json has "cancel"
      "modify": "Modify"           // ← common.json has "edit"
    }
  }
}
```

**Problems:**
- 7 duplicated keys
- If we change "Pending" in common.json, we must change it in 6+ places
- Translation cost: 7 keys × 9 languages = 63 unnecessary translations

### ✅ **CORRECT (no duplication):**

```json
// workspace-restaurant.json (AFTER - CLEAN)
{
  "service": {
    "floor": {
      "turnTable": "Turn Table",              // ← UNIQUE to restaurants
      "clearTable": "Clear Table",            // ← UNIQUE to restaurants
      "resetTable": "Reset Table"             // ← UNIQUE to restaurants
    },
    "timing": {
      "seatingTime": "Seating Time",          // ← UNIQUE to restaurants
      "averageTurnTime": "Average Turn Time"  // ← UNIQUE to restaurants
    }
  }
}
```

**Usage in code:**
```typescript
const RestaurantBooking = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tCalendar } = useTranslation('calendar');
  const { t: tRestaurant } = useTranslation('workspace-restaurant');

  return (
    <div>
      {/* Use common.json for shared terms */}
      <Status>{tCommon('labels.status')}</Status>  {/* "pending", "confirmed" */}

      {/* Use calendar.json for booking actions */}
      <Button>{tCalendar('appointment.book')}</Button>  {/* "Book" */}
      <Button>{tCommon('buttons.cancel')}</Button>      {/* "Cancel" */}

      {/* Use workspace-restaurant ONLY for unique terms */}
      <Action>{tRestaurant('service.floor.turnTable')}</Action>  {/* "Turn Table" */}
    </div>
  );
};
```

---

## ✅ **EXAMPLE 2: Legal Case Management**

### ❌ **WRONG (with duplication):**

```json
// workspace-legal.json (BEFORE - DUPLICATED)
{
  "case": {
    "priority": {
      "urgent": "Urgent",          // ← Duplicates common.json
      "high": "High",              // ← Duplicates common.json
      "normal": "Normal",          // ← Duplicates common.json
      "low": "Low"                 // ← Duplicates common.json
    },
    "actions": {
      "openCase": "Open Case",     // ← Similar to common "add"
      "closeCase": "Close Case",   // ← Similar to common "close"
      "archiveCase": "Archive"     // ← Duplicates common.json
    }
  }
}
```

**Problems:**
- 7 duplicated keys
- "priority" levels already exist in `common.json`
- Generic actions like "open", "close" already exist

### ✅ **CORRECT (no duplication):**

```json
// workspace-legal.json (AFTER - CLEAN)
{
  "case": {
    "action": {
      "assignAttorney": "Assign Attorney",    // ← UNIQUE to legal
      "transferCase": "Transfer Case",        // ← UNIQUE to legal
      "reopenCase": "Reopen Case"             // ← UNIQUE to legal
    }
  },
  "docket": {
    "deadline": {
      "statuteOfLimitations": "Statute of Limitations",  // ← UNIQUE to legal
      "filingDeadline": "Filing Deadline",               // ← UNIQUE to legal
      "appealDeadline": "Appeal Deadline"                // ← UNIQUE to legal
    }
  },
  "matter": {
    "conflictCheck": "Conflict Check",                   // ← UNIQUE to legal
    "engagementLetter": "Engagement Letter",             // ← UNIQUE to legal
    "legalStrategy": "Legal Strategy"                    // ← UNIQUE to legal
  }
}
```

**Usage in code:**
```typescript
const LegalCaseView = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tLegal } = useTranslation('workspace-legal');

  return (
    <div>
      {/* Use common.json for priority */}
      <Priority level={tCommon('priority.urgent')} />  {/* "Urgent" */}

      {/* Use common.json for generic actions */}
      <Button>{tCommon('buttons.add')}</Button>        {/* "Add" instead of "Open Case" */}
      <Button>{tCommon('buttons.close')}</Button>      {/* "Close" */}

      {/* Use workspace-legal ONLY for unique legal actions */}
      <Button>{tLegal('case.action.assignAttorney')}</Button>
      <Deadline>{tLegal('docket.deadline.statuteOfLimitations')}</Deadline>
    </div>
  );
};
```

---

## ✅ **EXAMPLE 3: Healthcare Appointments**

### ❌ **WRONG (with duplication):**

```json
// workspace-healthcare.json (BEFORE - DUPLICATED)
{
  "scheduling": {
    "appointment": {
      "book": "Book Appointment",      // ← calendar.json has "book"
      "confirm": "Confirm",            // ← common.json has "confirm"
      "reschedule": "Reschedule",      // ← calendar.json has "reschedule"
      "cancel": "Cancel"               // ← common.json has "cancel"
    },
    "status": {
      "scheduled": "Scheduled",        // ← common.json has "scheduled"
      "completed": "Completed",        // ← common.json has "completed"
      "cancelled": "Cancelled"         // ← common.json has "cancelled"
    }
  }
}
```

**Problems:**
- 7 duplicated keys
- All appointment actions exist in `calendar.json`
- All statuses exist in `common.json`

### ✅ **CORRECT (no duplication):**

```json
// workspace-healthcare.json (AFTER - CLEAN)
{
  "scheduling": {
    "queue": {
      "waitingRoom": "Waiting Room",      // ← UNIQUE to healthcare
      "inExamRoom": "In Exam Room",       // ← UNIQUE to healthcare
      "withProvider": "With Provider",    // ← UNIQUE to healthcare
      "checkout": "Checkout"              // ← UNIQUE to healthcare
    },
    "resource": {
      "examRoom": "Exam Room",            // ← UNIQUE to healthcare
      "procedureRoom": "Procedure Room",  // ← UNIQUE to healthcare
      "operatingRoom": "Operating Room"   // ← UNIQUE to healthcare
    }
  },
  "emr": {
    "chart": {
      "bloodPressure": "Blood Pressure",        // ← UNIQUE to healthcare
      "oxygenSaturation": "Oxygen Saturation",  // ← UNIQUE to healthcare
      "bmi": "BMI"                              // ← UNIQUE to healthcare
    }
  },
  "billing": {
    "coding": {
      "icd10": "ICD-10 Code",                   // ← UNIQUE to healthcare
      "cpt": "CPT Code"                         // ← UNIQUE to healthcare
    }
  }
}
```

**Usage in code:**
```typescript
const HealthcareScheduler = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tCalendar } = useTranslation('calendar');
  const { t: tHealthcare } = useTranslation('workspace-healthcare');

  return (
    <div>
      {/* Use calendar.json for appointment actions */}
      <Button>{tCalendar('appointment.book')}</Button>
      <Button>{tCalendar('appointment.reschedule')}</Button>

      {/* Use common.json for statuses */}
      <Status>{tCommon('status.completed')}</Status>

      {/* Use workspace-healthcare ONLY for medical terms */}
      <Queue>{tHealthcare('scheduling.queue.waitingRoom')}</Queue>
      <Vital>{tHealthcare('emr.chart.bloodPressure')}: 120/80</Vital>
      <Code>{tHealthcare('billing.coding.icd10')}: J18.9</Code>
    </div>
  );
};
```

---

## ✅ **EXAMPLE 4: Cancer Care - Patient Journey**

### ❌ **WRONG (with duplication):**

```json
// workspace-cancer-care.json (BEFORE - DUPLICATED)
{
  "patient": {
    "case": {
      "openCase": "Open Case",          // ← common "add"
      "assignCareTeam": "Assign Team",  // ← common "assign"
      "updateStatus": "Update Status",  // ← common "update"
      "followUp": "Follow-up"           // ← common "follow-up"
    }
  },
  "sponsor": {
    "donation": {
      "oneTime": "One-Time",            // ← payment.json has this
      "recurring": "Recurring",         // ← payment.json has this
      "monthly": "Monthly",             // ← payment.json has this
      "yearly": "Yearly"                // ← payment.json has this
    }
  }
}
```

**Problems:**
- 8 duplicated keys
- Payment terms already exist in `payment.json`
- Generic actions exist in `common.json`

### ✅ **CORRECT (no duplication):**

```json
// workspace-cancer-care.json (AFTER - CLEAN)
{
  "patient": {
    "journey": {
      "survivorship": "Survivorship",              // ← UNIQUE to cancer care
      "palliativeCare": "Palliative Care",         // ← UNIQUE to cancer care
      "remission": "Remission Monitoring"          // ← UNIQUE to cancer care
    },
    "portal": {
      "connectWithSurvivor": "Connect with Survivor",  // ← UNIQUE to cancer care
      "symptomTracker": "Symptom Tracker"              // ← UNIQUE to cancer care
    }
  },
  "sponsor": {
    "donation": {
      "memorial": "Memorial Donation",             // ← UNIQUE to cancer care
      "honor": "Honor Donation",                   // ← UNIQUE to cancer care
      "matching": "Matching Gift"                  // ← UNIQUE to cancer care
    },
    "impact": {
      "patientsHelped": "Patients Helped",         // ← UNIQUE to cancer care
      "impactReport": "Impact Report"              // ← UNIQUE to cancer care
    }
  },
  "aiAgent": {
    "companion": {
      "type": {
        "symptom": "Symptom Tracking Agent",       // ← UNIQUE to cancer care
        "medication": "Medication Reminder Agent"  // ← UNIQUE to cancer care
      }
    }
  }
}
```

**Usage in code:**
```typescript
const CancerCarePortal = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tPayment } = useTranslation('payment');
  const { t: tCancer } = useTranslation('workspace-cancer-care');

  return (
    <div>
      {/* Use common.json for generic actions */}
      <Button>{tCommon('buttons.add')}</Button>
      <Button>{tCommon('buttons.update')}</Button>

      {/* Use payment.json for billing terms */}
      <Option>{tPayment('billing.recurring')}</Option>
      <Option>{tPayment('billing.monthly')}</Option>

      {/* Use workspace-cancer-care ONLY for specific terms */}
      <Journey>{tCancer('patient.journey.survivorship')}</Journey>
      <Donate type={tCancer('sponsor.donation.memorial')} />
      <Agent>{tCancer('aiAgent.companion.type.symptom')}</Agent>
    </div>
  );
};
```

---

## 📊 **COMPARISON TABLE**

| Term | ❌ Duplicated In | ✅ Correct Location | Why? |
|------|------------------|---------------------|------|
| "Pending" | 6 namespaces | `common.json` | Universal status |
| "Book" | 4 namespaces | `calendar.json` | Appointment action |
| "Cancel" | 8 namespaces | `common.json` | Universal action |
| "Monthly" | 3 namespaces | `payment.json` | Billing term |
| "Fire Order" | None | `workspace-restaurant.json` | Restaurant-specific |
| "Statute of Limitations" | None | `workspace-legal.json` | Legal-specific |
| "ICD-10 Code" | None | `workspace-healthcare.json` | Medical-specific |
| "Crossfade" | None | `workspace-radio-control.json` | Audio-specific |
| "Survivorship" | None | `workspace-cancer-care.json` | Oncology-specific |

---

## 🎯 **DECISION TREE: Where Does This Term Go?**

```
Is the term used in 3+ different industries?
├─ YES → Put in common.json
└─ NO → Is it related to appointments/scheduling?
    ├─ YES → Put in calendar.json
    └─ NO → Is it a payment/billing term?
        ├─ YES → Put in payment.json
        └─ NO → Is it task-related?
            ├─ YES → Put in tasks.json
            └─ NO → Put in workspace-{industry}.json ✅
```

**Examples:**
- "Save" → Used everywhere → `common.json`
- "Reschedule" → Appointment-related → `calendar.json`
- "Fire Order" → Only restaurants → `workspace-restaurant.json`
- "Deposition" → Only legal → `workspace-legal.json`
- "Crossfade" → Only radio → `workspace-radio-control.json`

---

## ✅ **BENEFITS OF NO-DUPLICATION**

### **1. Maintainability**
- Change "Pending" once in `common.json` → affects all 6 industries
- Before: 6 changes needed
- After: 1 change needed
- **Time saved:** 83%

### **2. Translation Cost**
- Before: "Pending" × 6 namespaces × 9 languages = 54 translations
- After: "Pending" × 1 namespace × 9 languages = 9 translations
- **Cost saved:** 83%

### **3. Consistency**
- "Pending" always translates to same word across platform
- No risk of "Pending" vs "Waiting" vs "In Progress" inconsistencies

### **4. Developer Experience**
- Clear where to find terms: generic → common, specific → workspace
- No guessing which namespace has "cancel"

### **5. File Size**
- Before: 2,500 total keys
- After: 1,500 total keys
- **Reduction:** 40%

---

## 📝 **CHECKLIST: Adding New Terms**

Before adding a term to a workspace namespace, ask:

- [ ] Does `common.json` already have this? (save, cancel, delete, etc.)
- [ ] Does `calendar.json` have this? (book, schedule, appointment, etc.)
- [ ] Does `payment.json` have this? (monthly, recurring, invoice, etc.)
- [ ] Does `tasks.json` have this? (assign, complete, priority, etc.)
- [ ] Is this term used in 2+ industries? → Consider moving to common
- [ ] Is this term **truly unique** to this industry? → Add to workspace

**Example:**
```
❓ Should I add "confirmReservation" to workspace-restaurant.json?

✅ Check:
- [ ] "confirm" exists in common.json → YES
- [ ] "reservation" is restaurant-specific → YES

💡 Decision: Don't add "confirmReservation"
   Use: tCommon('buttons.confirm') + tConcept('booking.resource.table')
```

---

**Generated by:** Claude Code i18n System
**See also:** `NAMESPACE_STATUS.md` for full inventory
