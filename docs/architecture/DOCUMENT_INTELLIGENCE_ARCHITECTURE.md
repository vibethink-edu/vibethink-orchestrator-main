# Document Intelligence Architecture

**Status**: PROPOSED  
**Version**: 1.0.0  
**Date**: 2026-01-09  
**Authority**: Platform Builder + Senior Software Engineer  

---

## 🎯 Executive Summary

**Document Intelligence** is a **vertical product FIT** for ViTo that provides API-first document processing capabilities. It is designed to be:

- ✅ **Domain-agnostic**: Reusable for medical, accounting, legal, expense management
- ✅ **Vendor-agnostic**: Swappable OCR providers (Google Vision, Textract, Tesseract)
- ✅ **Evidence-first**: Provides data with confidence scores, not validation
- ✅ **Multi-tenant**: Strict isolation, parametric policies per tenant/facility
- ✅ **API-first**: External systems integrate via REST API + webhooks

---

## 1. Problem Statement

### 1.1 Business Need

Organizations across multiple domains need to:
1. **Digitize paper documents** (prescriptions, invoices, receipts, contracts)
2. **Extract structured data** (line items, medications, amounts)
3. **Flag anomalies** (crossed-out text, handwritten notes)
4. **Enable human review** (for low-confidence items)
5. **Control costs** (budget limits, provider selection)
6. **Maintain compliance** (retention policies, audit trails)

### 1.2 Current Gaps

- ❌ No reusable OCR service in ViTo
- ❌ Domain-specific solutions (hardcoded for medical)
- ❌ Vendor lock-in (tied to single OCR provider)
- ❌ No parametric configuration (profiles)
- ❌ No cost accounting

---

## 2. Architectural Principles

### 2.1 Core Principles (from ViTo Canon)

1. **AI-First**: Use AI for extraction, not hardcoded rules
2. **Evidence-First**: Provide data + confidence, not truth
3. **Domain-Agnostic**: No hardcoded domain logic
4. **Multi-Tenant**: Strict isolation at DB and API layers

### 2.2 Document Intelligence Principles

1. **Profile-Driven**: All extraction logic governed by Document Profiles
2. **Vendor-Agnostic**: OCR provider is swappable adapter
3. **Immutable OCR**: Original OCR results never overwritten
4. **Layered Confidence**: Separate scores for OCR, extraction, flags
5. **Parametric Policies**: Security, retention, cost per tenant/facility

---

## 3. Domain Model

### 3.1 Core Entities

```
┌─────────────────────────────────────────────────────────────┐
│  INTEGRATION                                                 │
│  - External system (EHR, accounting software)               │
│  - Has API key, scopes, rate limits                         │
│  - Belongs to Tenant                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓ submits
┌─────────────────────────────────────────────────────────────┐
│  DOCUMENT JOB                                                │
│  - Single document processing request                       │
│  - Has status (pending, processing, completed, failed)      │
│  - References: Integration, Facility, Document Profile      │
└─────────────────────────────────────────────────────────────┘
                          ↓ produces
┌─────────────────────────────────────────────────────────────┐
│  DOCUMENT ITEM                                               │
│  - Extracted item (medication, line item, etc.)             │
│  - Has: raw_text, normalized_text, flags, evidence          │
│  - Supports human review (corrected_text)                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Supporting Entities

- **Facility**: Physical location (optional, for multi-location tenants)
- **Document Profile**: Parametric configuration for document type
- **Cost Ledger**: Auditable cost records per job

---

## 4. Key Concepts

### 4.1 Document Profile

**Definition**: A parametric configuration that defines how to process a document type.

**Purpose**: Avoid hardcoding domain logic. Instead, configure extraction rules per profile.

**Example**:
```json
{
  "profile_key": "clinical-prescription-v1",
  "expected_item_types": ["medication", "dosage", "frequency"],
  "flags_enabled": ["crossed_out", "handwritten"],
  "confidence_thresholds": {
    "ocr": 0.85,
    "extraction": 0.75
  }
}
```

**Benefits**:
- ✅ Reusable across domains (medical, accounting, legal)
- ✅ Tenant-specific profiles (custom extraction rules)
- ✅ Versioned (profile_key + version)

---

### 4.2 Item Schema (Generic)

**Design**: Single table for all extracted items, regardless of domain.

**Schema**:
```sql
CREATE TABLE document_items (
  id UUID PRIMARY KEY,
  item_type VARCHAR(100), -- 'medication', 'line_item', etc.
  raw_text TEXT,          -- Original OCR output
  normalized_text TEXT,   -- Normalized (optional)
  flags JSONB,            -- {"crossed_out": true, "confidence": 0.92}
  evidence JSONB,         -- {"page": 1, "bbox": {...}}
  structured_data JSONB,  -- Domain-specific fields
  corrected_text TEXT     -- Human review (if any)
);
```

**Benefits**:
- ✅ Domain-agnostic (no separate tables for medications vs invoices)
- ✅ Extensible (structured_data is JSONB)
- ✅ Auditable (original OCR preserved)

---

### 4.3 Confidence Layers

**Design**: Separate confidence scores for each processing stage.

**Layers**:
1. **OCR Confidence**: How confident is the OCR engine in the text?
2. **Extraction Confidence**: How confident is the extraction logic?
3. **Flag Confidence**: How confident is the flag detection (e.g., crossed_out)?

**Example**:
```json
{
  "raw_text": "Amoxicillin 500mg",
  "ocr_confidence": 0.95,
  "normalized_text": "Amoxicillin",
  "normalization_confidence": 0.88,
  "flags": {
    "crossed_out": false,
    "confidence": 0.92
  }
}
```

**Benefits**:
- ✅ Transparency (users see confidence at each stage)
- ✅ Review prioritization (flag low-confidence items)
- ✅ No false precision (don't claim 100% accuracy)

---

### 4.4 Human Review Layer

**Design**: Corrections stored separately, original OCR immutable.

**Flow**:
1. System extracts item with low confidence
2. Item flagged for review
3. Human reviews and corrects
4. Correction stored in `corrected_text` field
5. Original `raw_text` unchanged
6. Event emitted: `ITEM_REVIEWED`

**Benefits**:
- ✅ Auditable (can see original vs corrected)
- ✅ Non-destructive (OCR never overwritten)
- ✅ Traceable (who reviewed, when, why)

---

## 5. Processing Pipeline

### 5.1 Pipeline Stages

```
1. INGEST
   - Validate API key
   - Store original document
   - Emit: DOCUMENT_RECEIVED

2. PREPROCESS
   - Normalize image (deskew, denoise)
   - Split multi-page PDFs

3. OCR
   - Call vendor API (Google Vision, Textract, etc.)
   - Extract text + bounding boxes
   - Record confidence scores

4. ITEM EXTRACTION
   - Apply Document Profile
   - Extract items per expected_item_types
   - Normalize (if normalizers configured)

5. FLAG DETECTION
   - Detect flags (crossed_out, handwritten, etc.)
   - Score confidence per flag

6. CONFIDENCE SCORING
   - Compare against thresholds
   - Flag items for review if below threshold

7. PERSIST
   - Save items to DB
   - Emit: DOCUMENT_PROCESSED

8. NOTIFY
   - Call webhook (if configured)
   - Send signed payload (HMAC)
```

---

### 5.2 Vendor-Agnostic Adapter

**Design**: Abstract OCR provider behind interface.

**Interface**:
```typescript
interface OcrProvider {
  name: string;
  processDocument(file: Buffer): Promise<OcrResult>;
}

interface OcrResult {
  pages: Array<{
    page_number: number;
    text: string;
    confidence: number;
    blocks: Array<{
      text: string;
      bbox: BoundingBox;
      confidence: number;
    }>;
  }>;
}
```

**Implementations**:
- `GoogleVisionProvider`
- `AwsTextractProvider`
- `TesseractProvider`

**Benefits**:
- ✅ Swappable (change provider without code changes)
- ✅ A/B testing (compare providers side-by-side)
- ✅ Cost optimization (use cheapest provider per document type)

---

## 6. Security & Compliance

### 6.1 API Key Authentication

**Design**:
- API keys are cryptographically random (32+ bytes)
- Stored hashed (bcrypt/argon2)
- Scoped (`document:read`, `document:write`, `document:review`)
- Rate limited (per integration)
- IP allowlist (optional)

**Flow**:
```
1. Client sends: Authorization: Bearer {API_KEY}
2. System hashes API_KEY
3. Lookup in integrations table
4. Validate: active, scopes, rate limit, IP
5. Set tenant context for RLS
```

---

### 6.2 Retention Policies

**Design**: Parametric per tenant/facility.

**Policies**:
- **Zero Retention**: Delete original immediately after processing
- **Partial Retention**: Keep results, delete original after N days
- **Full Retention**: Keep everything permanently

**Example**:
```json
{
  "plan": "zero",
  "original_document_days": 0,
  "derived_data_days": 0,
  "results_days": 90
}
```

**Benefits**:
- ✅ HIPAA compliance (zero retention for PHI)
- ✅ Cost optimization (delete large files)
- ✅ Audit trail (results retained for compliance)

---

### 6.3 Audit Trail

**Design**: All operations emit events.

**Events**:
- `DOCUMENT_RECEIVED`
- `DOCUMENT_PROCESSED`
- `ITEM_EXTRACTED`
- `ITEM_FLAGGED`
- `ITEM_REVIEWED`
- `DOCUMENT_DELETED`

**Benefits**:
- ✅ Full traceability (who did what, when)
- ✅ Compliance (audit logs for regulators)
- ✅ Debugging (trace processing failures)

---

## 7. Cost & Token Accounting

### 7.1 Metering

**Design**: Track costs per job.

**Metrics**:
- Pages processed
- File size (MB)
- Tokens (input/output)
- Provider + model version
- Cost (in cents)

**Ledger**:
```sql
CREATE TABLE document_cost_ledger (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  integration_id UUID,
  document_job_id UUID,
  provider VARCHAR(50),
  pages_processed INTEGER,
  cost_cents INTEGER,
  recorded_at TIMESTAMPTZ
);
```

---

### 7.2 Budget Enforcement

**Design**: Limits per integration.

**Configuration**:
```json
{
  "integration_id": "uuid",
  "monthly_budget_cents": 10000,
  "alert_threshold_percent": 80,
  "hard_limit": true
}
```

**Flow**:
1. Client submits document
2. System checks current spend
3. If over budget:
   - `hard_limit = true`: Reject request (429 Too Many Requests)
   - `hard_limit = false`: Process + send alert

---

## 8. Dashboard UI (Technical)

### 8.1 Pages

1. **Integrations**
   - List API keys
   - Create/revoke keys
   - Configure webhooks, IP allowlist

2. **Jobs**
   - List recent jobs
   - Filter by status, integration, date
   - View job details

3. **Results Viewer**
   - Display extracted items
   - Show evidence (bounding boxes on document)
   - Highlight flags
   - JSON export

4. **Audit Log**
   - Event timeline
   - Filter by event type, actor

5. **Cost Dashboard**
   - Spend by integration
   - Spend by provider
   - Budget alerts

---

### 8.2 Design Constraints

**MUST**:
- ✅ Technical UI (not clinical)
- ✅ Read-only JSON view
- ✅ Evidence overlay (bounding boxes)

**MUST NOT**:
- ❌ Clinical workflows (prescribing, dispensing)
- ❌ Business logic (approval, routing)
- ❌ Domain-specific UI (medication database)

---

## 9. Integration Patterns

### 9.1 Synchronous (Simple)

**Flow**:
```
1. Client: POST /api/v1/documents/ingest
2. Server: 202 Accepted (job_id)
3. Client: Poll GET /api/v1/documents/jobs/{id}
4. Server: 200 OK (status: completed)
5. Client: GET /api/v1/documents/jobs/{id}/results
```

---

### 9.2 Asynchronous (Webhook)

**Flow**:
```
1. Client: POST /api/v1/documents/ingest
2. Server: 202 Accepted (job_id)
3. Server: Process document (async)
4. Server: POST {webhook_url} (signed payload)
5. Client: Receive webhook, fetch results
```

**Webhook Payload**:
```json
{
  "event": "document.processed",
  "job_id": "uuid",
  "status": "completed",
  "results_url": "/api/v1/documents/jobs/{id}/results",
  "timestamp": "2026-01-09T12:05:30Z",
  "signature": "sha256=..."
}
```

---

## 10. Deployment Considerations

### 10.1 Infrastructure

**Components**:
- API Gateway (rate limiting, auth)
- Document Storage (S3/Azure Blob)
- Database (PostgreSQL with RLS)
- Queue (for async processing)
- Worker Pool (OCR processing)

**Scaling**:
- Horizontal: Add workers for OCR processing
- Vertical: Increase worker memory for large documents

---

### 10.2 Monitoring

**Metrics**:
- Jobs processed per minute
- Average processing time
- OCR provider latency
- Error rate by provider
- Cost per job

**Alerts**:
- Budget threshold exceeded
- Processing failures > 5%
- OCR provider timeout

---

## 11. Future Extensions

### 11.1 Planned

- [ ] **Batch Processing**: Upload multiple documents in single request
- [ ] **Real-time Streaming**: WebSocket for live OCR progress
- [ ] **Custom Profiles**: Tenant-specific profile creation UI

### 11.2 Potential

- [ ] **Advanced Normalizers**: Drug name, ICD-10 code normalization
- [ ] **A/B Testing**: Compare OCR providers side-by-side
- [ ] **Confidence Calibration**: ML-based confidence adjustment
- [ ] **Document Comparison**: Diff two versions of same document

---

## 12. Decision Records

### 12.1 Why Generic Item Schema?

**Decision**: Use single `document_items` table for all domains.

**Rationale**:
- ✅ Domain-agnostic (no separate tables per vertical)
- ✅ Extensible (JSONB for structured_data)
- ✅ Simpler queries (no unions across tables)

**Alternatives Considered**:
- ❌ Separate tables per domain (medications, line_items)
  - Rejected: Violates domain-agnostic principle
- ❌ EAV model (entity-attribute-value)
  - Rejected: Poor query performance

---

### 12.2 Why Document Profiles?

**Decision**: Use parametric profiles instead of hardcoded logic.

**Rationale**:
- ✅ Reusable across domains
- ✅ Tenant-specific customization
- ✅ Versioned (safe updates)

**Alternatives Considered**:
- ❌ Hardcoded extraction logic per domain
  - Rejected: Not reusable, violates domain-agnostic principle
- ❌ AI-only extraction (no configuration)
  - Rejected: Unpredictable, no control over thresholds

---

### 12.3 Why Immutable OCR?

**Decision**: Never overwrite original OCR results.

**Rationale**:
- ✅ Auditable (can trace corrections)
- ✅ Non-destructive (preserve evidence)
- ✅ Compliance (regulators may require original)

**Alternatives Considered**:
- ❌ Overwrite OCR with corrected text
  - Rejected: Loses audit trail
- ❌ Versioned OCR (v1, v2, v3)
  - Rejected: Overly complex for this use case

---

## 13. References

- **FIT-DOCUMENT-INTELLIGENCE-001**: Technical specification
- **CANON-PERSISTENCE-001**: Persistence patterns
- **ONTOLOGY_SPEC**: Canonical entities
- **DB_NAMING_AND_RULES**: Multi-tenant isolation

---

**END OF DOCUMENT INTELLIGENCE ARCHITECTURE**
