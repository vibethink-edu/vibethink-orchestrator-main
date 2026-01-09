# Document Intelligence Module

**Status**: Phase 1 MVP (Implementation in Progress)  
**Version**: 1.0.0  
**Date**: 2026-01-09  

---

## 🎯 Purpose

**Document Intelligence** is a domain-agnostic, API-first module for document processing that enables:

- OCR + semantic extraction
- Evidence-based item extraction
- Human review (non-destructive)
- Multi-tenant isolation
- Vendor-agnostic OCR providers

**Reusable across domains**: Medical, Accounting, Legal, Expenses, Contracts, etc.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  API Layer (document-intelligence.routes.ts)                │
│  - POST /documents (ingest)                                 │
│  - GET /documents/:id (status)                              │
│  - GET /documents/:id/results (items)                       │
│  - PATCH /items/:id/review (human review)                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Services Layer                                              │
│  - IngestService (document ingestion)                       │
│  - ExtractionService (item extraction via profile)          │
│  - ReviewService (human review)                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  OCR Provider (vendor-agnostic)                             │
│  - GoogleVisionProvider                                     │
│  - AwsTextractProvider                                      │
│  - TesseractProvider                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Infrastructure Adapters                                     │
│  - StorageAdapter (S3/Azure Blob)                           │
│  - PersistenceAdapter (DB operations)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Structure

```
src/modules/document-intelligence/
├─ index.ts                      # Public API exports
├─ README.md                     # This file
├─ contracts/                    # Domain types (DOMAIN-AGNOSTIC)
│  ├─ document.ts                # DocumentJob, DocumentJobStatus
│  ├─ document-profile.ts        # DocumentProfile (parametric config)
│  ├─ document-item.ts           # DocumentItem (generic schema)
│  └─ human-review.ts            # HumanReview (non-destructive)
├─ services/                     # Business logic
│  ├─ ingest.service.ts          # Document ingestion
│  ├─ ocr.provider.ts            # Vendor-agnostic OCR
│  ├─ extraction.service.ts      # Item extraction (profile-driven)
│  └─ review.service.ts          # Human review
├─ infra/                        # Infrastructure adapters
│  ├─ storage.adapter.ts         # File storage (S3/Azure)
│  └─ persistence.adapter.ts     # Database operations
├─ api/                          # HTTP routes
│  └─ document-intelligence.routes.ts
└─ tests/                        # Tests
   └─ contracts.test.ts          # Contract tests
```

---

## 🔑 Key Concepts

### 1. Document Profile (Parametric Configuration)

**Problem**: How to avoid hardcoding domain logic?

**Solution**: Document Profiles define extraction behavior.

**Example**:
```typescript
const clinicalProfile: DocumentProfile = {
  profile_key: 'clinical-prescription-v1',
  expected_item_types: ['medication', 'dosage', 'frequency'],
  flags_enabled: ['crossed_out', 'handwritten'],
  confidence_thresholds: { ocr: 0.85, extraction: 0.75 },
};
```

**Benefit**: Same code works for invoices, expenses, contracts.

---

### 2. Generic Item Schema

**Problem**: How to store items from different domains?

**Solution**: Single table with `item_type` + `structured_data` (JSONB).

**Example**:
```typescript
// Medical item
{
  item_type: 'medication',
  raw_text: 'Amoxicillin 500mg',
  structured_data: { dosage: '500mg', frequency: 'twice daily' }
}

// Invoice item
{
  item_type: 'line_item',
  raw_text: 'Widget x10 @ $25.50',
  structured_data: { quantity: 10, unit_price: 25.50, total: 255.00 }
}
```

**Benefit**: Domain-agnostic, extensible, no schema migrations per vertical.

---

### 3. Immutable OCR

**Problem**: How to handle human corrections?

**Solution**: Corrections stored separately, original OCR never overwritten.

**Schema**:
```typescript
{
  raw_text: 'Amoxicillin 500mg',        // IMMUTABLE
  corrected_text: 'Amoxicillin 500mg BID', // Human correction
  is_reviewed: true,
  reviewed_by_user_id: 'user-123'
}
```

**Benefit**: Auditable, non-destructive, compliance-ready.

---

## 🚀 Usage Example

### Ingest a Document

```typescript
import { IngestService } from './services/ingest.service.js';

const ingestService = new IngestService(
  storageAdapter,
  persistenceAdapter,
  auditService,
  queueService
);

const response = await ingestService.ingestDocument({
  tenant_id: 'tenant-123',
  integration_id: 'integration-456',
  document_profile_id: 'clinical-prescription-v1',
  file: pdfBuffer,
  original_filename: 'prescription.pdf',
  mime_type: 'application/pdf',
});

console.log(response);
// {
//   job_id: 'job-789',
//   status: 'pending',
//   correlation_id: 'corr-abc',
//   estimated_completion_seconds: 30
// }
```

### Submit Human Review

```typescript
import { ReviewService } from './services/review.service.js';

const reviewService = new ReviewService(persistenceAdapter, auditService);

const review = await reviewService.submitReview({
  tenant_id: 'tenant-123',
  document_item_id: 'item-456',
  corrected_text: 'Amoxicillin 500mg BID',
  review_notes: 'Handwriting unclear, confirmed with prescriber',
  reviewed_by_user_id: 'user-789',
});
```

---

## ✅ Phase 1 MVP Status

### Completed
- [x] Contracts (domain types)
- [x] IngestService (document ingestion)
- [x] OcrProvider (vendor-agnostic interface + stubs)
- [x] ExtractionService (profile-driven extraction)
- [x] ReviewService (non-destructive corrections)
- [x] Module structure

### TODO (Phase 2)
- [ ] Actual OCR provider implementations (Google Vision, Textract)
- [ ] ML-based item extraction (vs keyword matching)
- [ ] ML-based flag detection (handwritten, crossed_out)
- [ ] Normalizers (drug names, ICD-10 codes)
- [ ] Cost accounting ledger
- [ ] Webhook notifications
- [ ] Batch processing
- [ ] Real-time streaming (WebSocket)

---

## 🧪 Testing

### Contract Tests
```bash
pnpm test:unit -- contracts.test.ts
```

### Integration Tests
```bash
pnpm test:integration -- document-intelligence
```

---

## 📚 References

- **FIT Specification**: `docs/fits/FIT-DOCUMENT-INTELLIGENCE-001.md`
- **Architecture**: `docs/architecture/DOCUMENT_INTELLIGENCE_ARCHITECTURE.md`
- **API Spec**: `docs/api/document-intelligence-api.yaml`
- **Implementation Plan**: `docs/implementation/DOCUMENT_INTELLIGENCE_IMPLEMENTATION_PLAN.md`

---

## ⚖️ Legal Guardrails

**CRITICAL**: This module operates under strict legal constraints:

1. **Evidence ≠ Truth**: OCR results are data, not validated facts
2. **Precision ≠ Validation**: Confidence scores are technical, not clinical/legal
3. **Data Processor Role**: ViTo processes data, does not control it
4. **No Training**: Customer data NEVER used for model training
5. **PHI Handling**: Logs MUST NOT contain PHI

---

## 🔒 Security

- **Multi-tenant isolation**: Enforced at DB layer (RLS + composite FKs)
- **API key authentication**: Scoped, rate-limited
- **Audit trail**: All operations logged
- **Retention policies**: Configurable per tenant

---

**END OF README**
