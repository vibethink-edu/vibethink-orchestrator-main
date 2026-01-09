# Document Intelligence Dashboard - UI Mock

**Status**: DESIGN PROPOSAL  
**Version**: 1.0.0  
**Date**: 2026-01-09  

---

## 🎨 Design Principles

1. **Technical, Not Clinical**: Dashboard is for developers/admins, not clinicians
2. **Evidence-First**: Show raw data, confidence scores, and evidence
3. **Read-Only Focus**: Primarily for monitoring and audit
4. **JSON Export**: Always provide technical view

---

## 📄 Page 1: Integrations

**Route**: `/dashboard/document-intelligence/integrations`

**Purpose**: Manage API keys and integration settings

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Document Intelligence > Integrations                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [+ Create Integration]                                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Search: [____________]  Filter: [All ▼] [Active ▼]    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Name              │ Type      │ API Key    │ Status    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ EHR Integration   │ EHR       │ vito_sk_.. │ 🟢 Active │ │
│  │ Accounting Sync   │ ACCOUNTING│ vito_sk_.. │ 🟢 Active │ │
│  │ Test Integration  │ CUSTOM    │ vito_sk_.. │ 🔴 Revoked│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Integration Detail Modal

```
┌─────────────────────────────────────────────────────────────┐
│  EHR Integration                                      [✕]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📋 Basic Info                                              │
│  ├─ Name: EHR Integration                                   │
│  ├─ Type: EHR                                               │
│  ├─ Environment: Production                                 │
│  └─ Status: 🟢 Active                                       │
│                                                              │
│  🔑 API Key                                                 │
│  ├─ Prefix: vito_sk_1234567                                │
│  ├─ Created: 2026-01-01 10:00 UTC                          │
│  └─ [Revoke Key] [Rotate Key]                              │
│                                                              │
│  🔒 Security                                                │
│  ├─ Scopes: document:write, document:read                   │
│  ├─ Rate Limit: 60 requests/minute                         │
│  ├─ IP Allowlist: 192.168.1.0/24, 10.0.0.0/8              │
│  └─ [Edit Security]                                         │
│                                                              │
│  🔔 Webhooks                                                │
│  ├─ URL: https://ehr.example.com/webhook                   │
│  ├─ Secret: ••••••••••••••••                               │
│  └─ [Test Webhook] [Edit Webhook]                          │
│                                                              │
│  📊 Usage (Last 30 Days)                                    │
│  ├─ Documents Processed: 1,234                             │
│  ├─ Total Cost: $45.67                                     │
│  └─ Avg Processing Time: 8.3s                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 Page 2: Jobs List

**Route**: `/dashboard/document-intelligence/jobs`

**Purpose**: Monitor document processing jobs

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Document Intelligence > Jobs                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Filters:                                                    │
│  [Integration ▼] [Status ▼] [Date Range ▼] [Apply]         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Job ID    │ Profile       │ Status      │ Items │ Cost │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ job-123.. │ Prescription  │ ✅ Completed│  12   │ $0.15│ │
│  │ job-456.. │ Invoice       │ ⚠️ Review   │   8   │ $0.12│ │
│  │ job-789.. │ Receipt       │ 🔄 Processing│  -   │  -   │ │
│  │ job-abc.. │ Prescription  │ ❌ Failed   │   0   │ $0.00│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Showing 1-10 of 234 jobs                    [< 1 2 3 >]   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Status Indicators
- ✅ **Completed**: All items extracted successfully
- ⚠️ **Review Required**: Low-confidence items flagged
- 🔄 **Processing**: OCR in progress
- ❌ **Failed**: Processing error
- ⏸️ **Pending**: Queued for processing

---

## 📄 Page 3: Results Viewer

**Route**: `/dashboard/document-intelligence/jobs/{id}/results`

**Purpose**: View extracted items with evidence overlay

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Document Intelligence > Job job-123456                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┬─────────────────────────────────┐  │
│  │  DOCUMENT VIEWER    │  EXTRACTED ITEMS                │  │
│  │                     │                                 │  │
│  │  ┌───────────────┐  │  Item 1 of 12                   │  │
│  │  │               │  │  ┌───────────────────────────┐  │  │
│  │  │   [Page 1]    │  │  │ Type: medication          │  │  │
│  │  │               │  │  │ Raw Text: "Amoxicillin    │  │  │
│  │  │   ┌─────────┐ │  │  │           500mg"          │  │  │
│  │  │   │ [BBOX]  │ │  │  │ Normalized: "Amoxicillin" │  │  │
│  │  │   │ Amoxi.. │ │  │  │ OCR Confidence: 95%       │  │  │
│  │  │   └─────────┘ │  │  │ Flags:                    │  │  │
│  │  │               │  │  │  ✅ Handwritten (88%)     │  │  │
│  │  │               │  │  │  ❌ Crossed Out (2%)      │  │  │
│  │  │               │  │  │ Evidence: Page 1, (120,   │  │  │
│  │  │               │  │  │           300, 250x40)    │  │  │
│  │  │               │  │  │ Reviewed: No              │  │  │
│  │  │               │  │  │ [Review Item]             │  │  │
│  │  └───────────────┘  │  └───────────────────────────┘  │  │
│  │                     │                                 │  │
│  │  [< Prev] [Next >]  │  [< Prev Item] [Next Item >]    │  │
│  │                     │                                 │  │
│  └─────────────────────┴─────────────────────────────────┘  │
│                                                              │
│  [Export JSON] [Download PDF] [View Audit Log]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Evidence Overlay
- **Bounding Box**: Highlight extracted text on document image
- **Color Coding**:
  - 🟢 Green: High confidence (>90%)
  - 🟡 Yellow: Medium confidence (70-90%)
  - 🔴 Red: Low confidence (<70%)
- **Hover**: Show full item details

### JSON Export Example
```json
{
  "job_id": "job-123456",
  "status": "completed",
  "items": [
    {
      "item_id": "item-abc",
      "item_type": "medication",
      "raw_text": "Amoxicillin 500mg",
      "normalized_text": "Amoxicillin",
      "ocr_confidence": 0.95,
      "flags": {
        "handwritten": true,
        "confidence": 0.88
      },
      "evidence": {
        "page": 1,
        "bbox": {"x": 120, "y": 300, "width": 250, "height": 40}
      }
    }
  ]
}
```

---

## 📄 Page 4: Audit Log

**Route**: `/dashboard/document-intelligence/audit`

**Purpose**: View event timeline for compliance

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Document Intelligence > Audit Log                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Filters:                                                    │
│  [Event Type ▼] [Actor ▼] [Date Range ▼] [Apply]           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Timestamp         │ Event              │ Actor         │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 2026-01-09 12:05  │ DOCUMENT_PROCESSED │ system        │ │
│  │ 2026-01-09 12:00  │ DOCUMENT_RECEIVED  │ api:ehr-int   │ │
│  │ 2026-01-09 11:55  │ ITEM_REVIEWED      │ user@ex.com   │ │
│  │ 2026-01-09 11:50  │ DOCUMENT_DELETED   │ system:cron   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Event Details: DOCUMENT_PROCESSED                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   "event_type": "DOCUMENT_PROCESSED",                  │ │
│  │   "job_id": "job-123456",                              │ │
│  │   "correlation_id": "corr-abc",                        │ │
│  │   "tenant_id": "tenant-xyz",                           │ │
│  │   "occurred_at": "2026-01-09T12:05:30Z",               │ │
│  │   "actor": "system:pipeline",                          │ │
│  │   "metadata": {                                        │ │
│  │     "items_extracted": 12,                             │ │
│  │     "processing_time_ms": 8300                         │ │
│  │   }                                                    │ │
│  │ }                                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 Page 5: Cost Dashboard

**Route**: `/dashboard/document-intelligence/costs`

**Purpose**: Monitor spending and budgets

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Document Intelligence > Costs                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Overview (This Month)                                   │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Total Spend  │ Documents    │ Avg Cost/Doc │            │
│  │ $456.78      │ 3,456        │ $0.13        │            │
│  └──────────────┴──────────────┴──────────────┘            │
│                                                              │
│  📈 Spend Over Time                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  $500 ┤                                         ╭─╮    │ │
│  │       │                                    ╭────╯ │    │ │
│  │  $250 ┤                         ╭──────────╯      │    │ │
│  │       │              ╭──────────╯                 │    │ │
│  │    $0 ┼──────────────╯                            │    │ │
│  │       └─────────────────────────────────────────────   │ │
│  │        Jan 1    Jan 5    Jan 9    Jan 13   Jan 17     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  💰 Spend by Integration                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Integration       │ Documents │ Spend   │ Budget      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ EHR Integration   │ 2,000     │ $260.00 │ $500 (52%) │ │
│  │ Accounting Sync   │ 1,200     │ $156.00 │ $300 (52%) │ │
│  │ Test Integration  │   256     │  $40.78 │ $100 (41%) │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  🔧 Spend by Provider                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Provider         │ Documents │ Spend   │ Avg Cost    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Google Vision    │ 3,000     │ $390.00 │ $0.13       │ │
│  │ Tesseract (Free) │   456     │   $0.00 │ $0.00       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ⚠️ Budget Alerts                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • EHR Integration approaching 80% of monthly budget    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Components

### 1. Confidence Badge
```
┌─────────────┐
│ 95% ✅ High │  Green: >90%
└─────────────┘

┌─────────────┐
│ 75% ⚠️ Med  │  Yellow: 70-90%
└─────────────┘

┌─────────────┐
│ 45% ❌ Low  │  Red: <70%
└─────────────┘
```

### 2. Flag Indicator
```
┌──────────────────────┐
│ 🖊️ Handwritten (88%) │
│ ❌ Crossed Out (2%)  │
│ ✅ Printed (95%)     │
└──────────────────────┘
```

### 3. Evidence Overlay
```
┌─────────────────────┐
│  Document Image     │
│                     │
│  ┌───────────────┐  │  <- Bounding box (green)
│  │ Amoxicillin   │  │
│  │ 500mg         │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

### 4. API Key Display
```
┌──────────────────────────────┐
│ vito_sk_1234567 ••••••••••••│  [Copy] [Revoke]
└──────────────────────────────┘
```

---

## 🚫 Anti-Patterns (DO NOT IMPLEMENT)

### ❌ Clinical UI Elements
- Drug interaction warnings
- Dosage validation
- Prescribing workflows
- Patient safety alerts

### ❌ Business Logic UI
- Approval workflows
- Routing rules
- Case assignment
- SLA tracking

### ❌ Domain-Specific UI
- Medication database search
- ICD-10 code lookup
- Accounting ledger integration
- Invoice approval

---

## ✅ Design Checklist

- [ ] All pages are **technical** (not clinical)
- [ ] All data is **read-only** (except review corrections)
- [ ] All items show **evidence** (bounding boxes)
- [ ] All confidence scores are **visible**
- [ ] All pages support **JSON export**
- [ ] No **domain-specific** UI elements
- [ ] No **business logic** workflows
- [ ] Follows **ViTo design system** (colors, typography, components)

---

**END OF UI MOCK**
