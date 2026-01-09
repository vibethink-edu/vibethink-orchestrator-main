# FIT-DOCUMENT-INTELLIGENCE-001: Document Intelligence Service

**Status**: ACTIVE  
**Type**: FUNCTIONAL_INTEGRATION_TEST  
**Version**: 1.0.0  
**Date**: 2026-01-09  
**Related Canon**: CANON-PERSISTENCE-001, CANON-EVENTS-001, ONTOLOGY_SPEC  

---

## 🔒 SEALED CONTEXT (DO NOT MODIFY)

### ViTo Core Architecture (MANDATORY)

**Principles**:
- ✅ AI-first
- ✅ Evidence-first
- ✅ Domain-agnostic
- ✅ Multi-tenant & multi-location

**Core Modules (SEALED)**:
- Identity Context
- Entitlements & Access Enforcement
- Audit & Logging standards
- Multi-tenant isolation (RLS, composite FKs, triggers)

**Constraints**:
- ❌ NO modifications to core
- ❌ NO hardcoded domain logic (medical, accounting, etc.)
- ❌ NO vendor lock-in (OCR provider must be swappable)
- ❌ NO training models with customer data
- ❌ NO clinical validation

---

## 1. Purpose

This FIT validates the **Document Intelligence Service**, a reusable, API-first capability for:

1. **Document Ingestion**: Accept PDF/images with tenant + integration + facility context
2. **OCR + Semantic Extraction**: Vendor-agnostic pipeline (Google Vision, Textract, Tesseract, etc.)
3. **Item Structuring**: Extract items with evidence, flags, confidence layers
4. **Human Review**: Optional correction layer (auditable, non-destructive)
5. **Parametric Policies**: Security, retention, cost control
6. **Technical Dashboard**: Configuration, audit, visualization (NO clinical UI)

**Domain-Agnostic Design**:
- ✅ Reusable for: prescriptions, invoices, receipts, contracts, legal docs
- ✅ Governed by **Document Profiles** (not hardcoded logic)
- ✅ Evidence ≠ Truth (system provides data, not validation)

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT APPLICATIONS (External Systems)                     │
│  - EHR Integration                                          │
│  - Accounting Software                                      │
│  - Expense Management                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTPS + API Key
┌─────────────────────────────────────────────────────────────┐
│  API GATEWAY (ViTo Core)                                    │
│  - API Key Authentication                                   │
│  - Rate Limiting                                            │
│  - IP Allowlist (optional)                                  │
│  - Webhook HMAC Signing                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  DOCUMENT INTELLIGENCE SERVICE (THIS FIT)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ INGESTION LAYER                                        │ │
│  │ - Validate API key + scopes                            │ │
│  │ - Associate: tenant + integration + facility           │ │
│  │ - Store original document (retention policy)           │ │
│  │ - Emit: DOCUMENT_RECEIVED event                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ PROCESSING PIPELINE (Async)                            │ │
│  │                                                          │ │
│  │ 1. Preprocess (normalize, deskew, denoise)             │ │
│  │ 2. OCR (vendor-agnostic adapter)                       │ │
│  │ 3. Item Extraction (apply Document Profile)            │ │
│  │ 4. Flag Detection (crossed_out, handwritten, etc.)     │ │
│  │ 5. Confidence Scoring (per layer)                      │ │
│  │ 6. Persist Results (immutable OCR + items)             │ │
│  │ 7. Emit: DOCUMENT_PROCESSED event                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ HUMAN REVIEW LAYER (Optional)                          │ │
│  │ - Flag low-confidence items for review                 │ │
│  │ - Corrections stored as separate layer                 │ │
│  │ - Original OCR NEVER overwritten                       │ │
│  │ - Emit: ITEM_CORRECTED event                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ COST & TOKEN ACCOUNTING                                │ │
│  │ - Track: pages, MB, tokens, provider, model            │ │
│  │ - Enforce: budgets, limits per integration             │ │
│  │ - Ledger: auditable cost records                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  PERSISTENCE LAYER (ViTo Core)                              │
│  - Multi-tenant isolation (tenant_id)                       │
│  - Audit fields (created_at, updated_at, created_by)       │
│  - Event sourcing (append-only events)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

Following **DB_NAMING_AND_RULES.md** (SEALED):

### 3.1 Core Tables

#### `integrations`
External systems that submit documents.

```sql
CREATE TABLE integrations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  integration_name    VARCHAR(255) NOT NULL,
  integration_type    VARCHAR(50) NOT NULL, -- 'EHR', 'ACCOUNTING', 'EXPENSE', 'CUSTOM'
  environment         VARCHAR(20) NOT NULL DEFAULT 'production', -- 'sandbox', 'production'
  status              VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'revoked'
  
  -- API Key (hashed)
  api_key_hash        VARCHAR(255) NOT NULL UNIQUE,
  api_key_prefix      VARCHAR(10) NOT NULL, -- First 8 chars for display
  
  -- Security
  scopes              JSONB NOT NULL DEFAULT '[]', -- ['document:write', 'document:read']
  ip_allowlist        JSONB, -- ['192.168.1.0/24']
  rate_limit_rpm      INTEGER DEFAULT 60,
  
  -- Webhooks
  webhook_url         VARCHAR(500),
  webhook_secret      VARCHAR(255), -- HMAC signing key
  
  -- Audit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id  UUID REFERENCES identity_users(id),
  updated_by_user_id  UUID REFERENCES identity_users(id),
  deleted_at          TIMESTAMPTZ,
  
  CONSTRAINT pk_integrations PRIMARY KEY (id),
  CONSTRAINT fk_integrations_tenants FOREIGN KEY (tenant_id, id) 
    REFERENCES tenants(tenant_id, id),
  CONSTRAINT ck_integrations_environment CHECK (environment IN ('sandbox', 'production')),
  CONSTRAINT ck_integrations_status CHECK (status IN ('active', 'suspended', 'revoked'))
);

CREATE INDEX idx_integrations_tenant_id ON integrations(tenant_id);
CREATE UNIQUE INDEX uq_integrations_api_key_hash ON integrations(api_key_hash);
```

---

#### `facilities`
Physical locations (optional, for multi-location tenants).

```sql
CREATE TABLE facilities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  facility_name       VARCHAR(255) NOT NULL,
  facility_code       VARCHAR(50), -- External identifier
  address             JSONB, -- Structured address
  metadata            JSONB DEFAULT '{}',
  
  -- Audit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id  UUID REFERENCES identity_users(id),
  updated_by_user_id  UUID REFERENCES identity_users(id),
  deleted_at          TIMESTAMPTZ,
  
  CONSTRAINT pk_facilities PRIMARY KEY (id),
  CONSTRAINT fk_facilities_tenants FOREIGN KEY (tenant_id, id) 
    REFERENCES tenants(tenant_id, id)
);

CREATE INDEX idx_facilities_tenant_id ON facilities(tenant_id);
CREATE UNIQUE INDEX uq_facilities_code ON facilities(tenant_id, facility_code) 
  WHERE facility_code IS NOT NULL;
```

---

#### `document_profiles`
Parametric configuration for document types (CRITICAL for domain-agnostic design).

```sql
CREATE TABLE document_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID REFERENCES tenants(id), -- NULL = global/platform profile
  profile_key         VARCHAR(100) NOT NULL, -- 'clinical-prescription-v1', 'invoice-items-v1'
  profile_version     INTEGER NOT NULL DEFAULT 1,
  display_name        VARCHAR(255) NOT NULL,
  description         TEXT,
  
  -- Item Extraction Config
  expected_item_types JSONB NOT NULL, -- ['medication', 'quantity', 'dosage'] OR ['line_item', 'amount']
  flags_enabled       JSONB NOT NULL DEFAULT '[]', -- ['crossed_out', 'handwritten', 'uncertain']
  confidence_thresholds JSONB NOT NULL DEFAULT '{}', -- {"ocr": 0.8, "extraction": 0.7}
  
  -- Normalization Rules (optional)
  normalizers         JSONB DEFAULT '{}', -- {"medication": "drug_name_normalizer"}
  
  -- Validation Rules
  validation_schema   JSONB, -- JSON Schema for extracted items
  
  -- Audit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id  UUID REFERENCES identity_users(id),
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  
  CONSTRAINT pk_document_profiles PRIMARY KEY (id),
  CONSTRAINT uq_document_profiles_key_version UNIQUE (tenant_id, profile_key, profile_version)
);

CREATE INDEX idx_document_profiles_tenant_id ON document_profiles(tenant_id);
CREATE INDEX idx_document_profiles_key ON document_profiles(profile_key);
```

**Example Document Profile**:
```json
{
  "profile_key": "clinical-prescription-v1",
  "expected_item_types": ["medication", "quantity", "dosage", "frequency"],
  "flags_enabled": ["crossed_out", "handwritten", "illegible"],
  "confidence_thresholds": {
    "ocr": 0.85,
    "extraction": 0.75,
    "flag_detection": 0.70
  },
  "normalizers": {
    "medication": "drug_name_normalizer"
  }
}
```

---

#### `document_jobs`
Ingested documents and processing status.

```sql
CREATE TABLE document_jobs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  integration_id      UUID NOT NULL REFERENCES integrations(id),
  facility_id         UUID REFERENCES facilities(id),
  document_profile_id UUID NOT NULL REFERENCES document_profiles(id),
  
  -- Document Metadata
  original_filename   VARCHAR(500),
  mime_type           VARCHAR(100) NOT NULL,
  file_size_bytes     BIGINT NOT NULL,
  page_count          INTEGER,
  
  -- Storage
  storage_path        VARCHAR(1000) NOT NULL, -- S3/Azure path
  storage_retention_days INTEGER, -- NULL = permanent
  
  -- Processing Status
  status              VARCHAR(50) NOT NULL DEFAULT 'pending', 
    -- 'pending', 'processing', 'completed', 'failed', 'review_required'
  error_message       TEXT,
  
  -- Correlation
  correlation_id      UUID NOT NULL,
  external_ref        VARCHAR(255), -- Client's reference ID
  
  -- Audit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at        TIMESTAMPTZ,
  
  CONSTRAINT pk_document_jobs PRIMARY KEY (id),
  CONSTRAINT fk_document_jobs_tenants FOREIGN KEY (tenant_id, id) 
    REFERENCES tenants(tenant_id, id),
  CONSTRAINT fk_document_jobs_integrations FOREIGN KEY (tenant_id, integration_id) 
    REFERENCES integrations(tenant_id, id),
  CONSTRAINT ck_document_jobs_status CHECK (status IN 
    ('pending', 'processing', 'completed', 'failed', 'review_required'))
);

CREATE INDEX idx_document_jobs_tenant_id ON document_jobs(tenant_id);
CREATE INDEX idx_document_jobs_integration_id ON document_jobs(integration_id);
CREATE INDEX idx_document_jobs_status ON document_jobs(status);
CREATE INDEX idx_document_jobs_correlation_id ON document_jobs(correlation_id);
```

---

#### `document_items`
Extracted items from documents (GENERIC schema).

```sql
CREATE TABLE document_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  document_job_id     UUID NOT NULL REFERENCES document_jobs(id),
  
  -- Item Identity
  item_index          INTEGER NOT NULL, -- Position in document
  item_type           VARCHAR(100) NOT NULL, -- 'medication', 'line_item', etc. (from profile)
  
  -- OCR Layer (IMMUTABLE)
  raw_text            TEXT NOT NULL,
  ocr_confidence      NUMERIC(5,4), -- 0.0000 to 1.0000
  ocr_provider        VARCHAR(50), -- 'google_vision', 'textract', 'tesseract'
  
  -- Normalized Layer (OPTIONAL)
  normalized_text     TEXT,
  normalization_confidence NUMERIC(5,4),
  
  -- Flags (EXTENSIBLE)
  flags               JSONB NOT NULL DEFAULT '{}', 
    -- {"crossed_out": true, "handwritten": false, "confidence": 0.92}
  
  -- Evidence (CRITICAL for auditability)
  evidence            JSONB NOT NULL,
    -- {"page": 1, "bbox": {"x": 100, "y": 200, "width": 300, "height": 50}}
  
  -- Structured Data (OPTIONAL, profile-specific)
  structured_data     JSONB DEFAULT '{}',
    -- {"dosage": "500mg", "frequency": "twice daily"}
  
  -- Human Review Layer
  is_reviewed         BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at         TIMESTAMPTZ,
  reviewed_by_user_id UUID REFERENCES identity_users(id),
  corrected_text      TEXT, -- Human correction (if any)
  review_notes        TEXT,
  
  -- Audit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT pk_document_items PRIMARY KEY (id),
  CONSTRAINT fk_document_items_tenants FOREIGN KEY (tenant_id, id) 
    REFERENCES tenants(tenant_id, id),
  CONSTRAINT fk_document_items_jobs FOREIGN KEY (tenant_id, document_job_id) 
    REFERENCES document_jobs(tenant_id, id)
);

CREATE INDEX idx_document_items_tenant_id ON document_items(tenant_id);
CREATE INDEX idx_document_items_job_id ON document_items(document_job_id);
CREATE INDEX idx_document_items_type ON document_items(item_type);
CREATE INDEX idx_document_items_review_required ON document_items(is_reviewed) 
  WHERE is_reviewed = FALSE;
```

---

#### `document_cost_ledger`
Cost and token accounting (auditable).

```sql
CREATE TABLE document_cost_ledger (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  integration_id      UUID NOT NULL REFERENCES integrations(id),
  document_job_id     UUID NOT NULL REFERENCES document_jobs(id),
  
  -- Cost Metrics
  provider            VARCHAR(50) NOT NULL, -- 'google_vision', 'textract'
  model_version       VARCHAR(50),
  pages_processed     INTEGER NOT NULL,
  file_size_mb        NUMERIC(10,2) NOT NULL,
  tokens_input        INTEGER,
  tokens_output       INTEGER,
  
  -- Cost (in cents)
  cost_cents          INTEGER NOT NULL,
  currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
  
  -- Audit
  recorded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT pk_document_cost_ledger PRIMARY KEY (id),
  CONSTRAINT fk_cost_ledger_tenants FOREIGN KEY (tenant_id, id) 
    REFERENCES tenants(tenant_id, id)
);

CREATE INDEX idx_cost_ledger_tenant_id ON document_cost_ledger(tenant_id);
CREATE INDEX idx_cost_ledger_integration_id ON document_cost_ledger(integration_id);
CREATE INDEX idx_cost_ledger_recorded_at ON document_cost_ledger(recorded_at);
```

---

### 3.2 Multi-Tenant Enforcement

**Composite Foreign Keys** (following DB_NAMING_AND_RULES.md):

```sql
-- Ensure document_jobs belong to same tenant as integration
ALTER TABLE document_jobs 
  ADD CONSTRAINT fk_document_jobs_integrations_tenant 
  FOREIGN KEY (tenant_id, integration_id) 
  REFERENCES integrations(tenant_id, id);

-- Ensure document_items belong to same tenant as document_job
ALTER TABLE document_items 
  ADD CONSTRAINT fk_document_items_jobs_tenant 
  FOREIGN KEY (tenant_id, document_job_id) 
  REFERENCES document_jobs(tenant_id, id);
```

**Row-Level Security** (PostgreSQL):

```sql
ALTER TABLE document_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON document_jobs
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

ALTER TABLE document_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON document_items
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

## 4. API Endpoints

### 4.1 Document Ingestion

**POST** `/api/v1/documents/ingest`

**Headers**:
```
Authorization: Bearer {API_KEY}
Content-Type: multipart/form-data
```

**Request Body**:
```json
{
  "file": "<binary>",
  "document_profile_id": "uuid",
  "facility_id": "uuid (optional)",
  "external_ref": "string (optional)",
  "metadata": {
    "patient_id": "external-123",
    "encounter_date": "2026-01-09"
  }
}
```

**Response** (202 Accepted):
```json
{
  "job_id": "uuid",
  "status": "pending",
  "correlation_id": "uuid",
  "estimated_completion_seconds": 30,
  "webhook_url": "https://client.com/webhook (if configured)"
}
```

---

### 4.2 Get Job Status

**GET** `/api/v1/documents/jobs/{job_id}`

**Response** (200 OK):
```json
{
  "job_id": "uuid",
  "status": "completed",
  "document_profile": {
    "id": "uuid",
    "key": "clinical-prescription-v1"
  },
  "page_count": 2,
  "items_extracted": 12,
  "items_flagged_for_review": 2,
  "processed_at": "2026-01-09T12:05:30Z",
  "cost_cents": 15,
  "results_url": "/api/v1/documents/jobs/{job_id}/results"
}
```

---

### 4.3 Get Extracted Items

**GET** `/api/v1/documents/jobs/{job_id}/results`

**Response** (200 OK):
```json
{
  "job_id": "uuid",
  "items": [
    {
      "item_id": "uuid",
      "item_index": 0,
      "item_type": "medication",
      "raw_text": "Amoxicillin 500mg",
      "normalized_text": "Amoxicillin",
      "ocr_confidence": 0.95,
      "flags": {
        "crossed_out": false,
        "handwritten": true,
        "confidence": 0.88
      },
      "evidence": {
        "page": 1,
        "bbox": {"x": 120, "y": 300, "width": 250, "height": 40}
      },
      "structured_data": {
        "dosage": "500mg",
        "frequency": "twice daily"
      },
      "is_reviewed": false
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "per_page": 50
  }
}
```

---

### 4.4 Submit Human Review

**PATCH** `/api/v1/documents/items/{item_id}/review`

**Request Body**:
```json
{
  "corrected_text": "Amoxicillin 500mg BID",
  "review_notes": "Handwriting unclear, confirmed with prescriber"
}
```

**Response** (200 OK):
```json
{
  "item_id": "uuid",
  "is_reviewed": true,
  "reviewed_at": "2026-01-09T12:10:00Z",
  "reviewed_by": "user@example.com"
}
```

---

## 5. Document Profiles (Parametric Configuration)

### 5.1 Profile Examples

#### Clinical Prescription
```json
{
  "profile_key": "clinical-prescription-v1",
  "display_name": "Clinical Prescription (v1)",
  "expected_item_types": ["medication", "dosage", "frequency", "duration"],
  "flags_enabled": ["crossed_out", "handwritten", "illegible"],
  "confidence_thresholds": {
    "ocr": 0.85,
    "extraction": 0.75
  },
  "normalizers": {
    "medication": "drug_name_normalizer"
  }
}
```

#### Invoice Line Items
```json
{
  "profile_key": "invoice-items-v1",
  "display_name": "Invoice Line Items (v1)",
  "expected_item_types": ["description", "quantity", "unit_price", "total"],
  "flags_enabled": ["crossed_out", "amended"],
  "confidence_thresholds": {
    "ocr": 0.90,
    "extraction": 0.80
  },
  "validation_schema": {
    "type": "object",
    "required": ["quantity", "unit_price"],
    "properties": {
      "quantity": {"type": "number", "minimum": 0},
      "unit_price": {"type": "number", "minimum": 0}
    }
  }
}
```

---

## 6. Processing Pipeline (Vendor-Agnostic)

### 6.1 Pipeline Stages

```typescript
interface OcrProvider {
  name: string; // 'google_vision', 'textract', 'tesseract'
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

interface DocumentProfile {
  profile_key: string;
  expected_item_types: string[];
  flags_enabled: string[];
  confidence_thresholds: Record<string, number>;
}

async function processPipeline(
  jobId: string,
  file: Buffer,
  profile: DocumentProfile,
  provider: OcrProvider
): Promise<void> {
  // 1. Preprocess
  const preprocessed = await preprocessImage(file);
  
  // 2. OCR
  const ocrResult = await provider.processDocument(preprocessed);
  
  // 3. Item Extraction (apply profile)
  const items = await extractItems(ocrResult, profile);
  
  // 4. Flag Detection
  const flaggedItems = await detectFlags(items, profile.flags_enabled);
  
  // 5. Confidence Scoring
  const scoredItems = await scoreConfidence(flaggedItems, profile.confidence_thresholds);
  
  // 6. Persist
  await persistItems(jobId, scoredItems);
  
  // 7. Emit Event
  await emitEvent('DOCUMENT_PROCESSED', { job_id: jobId });
}
```

---

## 7. Security & Compliance

### 7.1 API Key Management

- **Generation**: Cryptographically random, 32+ bytes
- **Storage**: Hashed (bcrypt/argon2), never plaintext
- **Display**: Only first 8 characters shown in UI
- **Rotation**: Supported via API
- **Scopes**: `document:read`, `document:write`, `document:review`

### 7.2 Retention Policies

```typescript
interface RetentionPolicy {
  tenant_id: string;
  facility_id?: string;
  plan: 'zero' | 'partial' | 'full';
  original_document_days: number | null; // null = permanent
  derived_data_days: number | null;
  results_days: number | null;
}

// Example: HIPAA-compliant zero retention
{
  "plan": "zero",
  "original_document_days": 0, // Delete immediately after processing
  "derived_data_days": 0,
  "results_days": 90 // Keep results for 90 days
}
```

### 7.3 Audit Trail

All operations emit events:
- `DOCUMENT_RECEIVED`
- `DOCUMENT_PROCESSED`
- `ITEM_EXTRACTED`
- `ITEM_FLAGGED`
- `ITEM_REVIEWED`
- `DOCUMENT_DELETED`

---

## 8. Cost & Token Accounting

### 8.1 Metering

```typescript
interface CostRecord {
  tenant_id: string;
  integration_id: string;
  document_job_id: string;
  provider: string;
  pages_processed: number;
  file_size_mb: number;
  tokens_input?: number;
  tokens_output?: number;
  cost_cents: number;
  currency: 'USD';
}
```

### 8.2 Budget Enforcement

```typescript
interface IntegrationBudget {
  integration_id: string;
  monthly_budget_cents: number;
  current_spend_cents: number;
  alert_threshold_percent: number; // 80 = alert at 80%
  hard_limit: boolean; // true = reject requests when exceeded
}
```

---

## 9. Dashboard UI (Technical, Non-Clinical)

### 9.1 Pages

1. **Integrations** (`/dashboard/document-intelligence/integrations`)
   - List API keys
   - Create/revoke keys
   - Configure webhooks, IP allowlist, rate limits

2. **Facilities** (`/dashboard/document-intelligence/facilities`)
   - List facilities
   - Add/edit facility metadata

3. **Document Profiles** (`/dashboard/document-intelligence/profiles`)
   - View available profiles
   - Configure thresholds (admin only)

4. **Jobs** (`/dashboard/document-intelligence/jobs`)
   - List recent jobs
   - Filter by status, integration, date range
   - View job details

5. **Results Viewer** (`/dashboard/document-intelligence/jobs/{id}/results`)
   - Display extracted items
   - Show evidence (bounding boxes on document image)
   - Highlight flags
   - JSON export (technical view)

6. **Audit Log** (`/dashboard/document-intelligence/audit`)
   - Event timeline
   - Filter by event type, actor, date

7. **Cost Dashboard** (`/dashboard/document-intelligence/costs`)
   - Spend by integration
   - Spend by provider
   - Budget alerts

---

## 10. Validation Tests (Pass Criteria)

### 10.1 Test 1: Multi-Tenant Isolation

**Setup**:
1. Tenant A uploads document
2. Tenant B tries to access Tenant A's job

**Expected**:
- Tenant B gets 404 (not 403, to avoid leaking existence)

---

### 10.2 Test 2: Domain-Agnostic Design

**Setup**:
1. Create profile: `invoice-items-v1`
2. Upload invoice
3. Extract items

**Expected**:
- No hardcoded "medical" logic
- Items extracted per profile config
- Reusable for accounting domain

---

### 10.3 Test 3: OCR Immutability

**Setup**:
1. Process document
2. Human reviews item
3. Corrects text

**Expected**:
- `raw_text` unchanged
- `corrected_text` populated
- `is_reviewed = true`
- Event: `ITEM_REVIEWED` emitted

---

### 10.4 Test 4: Vendor Swap

**Setup**:
1. Process document with Google Vision
2. Switch provider to Textract
3. Process another document

**Expected**:
- No code changes required
- Results structurally identical
- `ocr_provider` field updated

---

### 10.5 Test 5: Retention Policy

**Setup**:
1. Set retention: `original_document_days = 0`
2. Upload document
3. Wait for processing

**Expected**:
- Original file deleted immediately
- Results retained per policy
- Event: `DOCUMENT_DELETED` emitted

---

## 11. Checklist (FIT Pass Criteria)

### Database Schema
- [ ] `integrations` table exists
- [ ] `facilities` table exists
- [ ] `document_profiles` table exists
- [ ] `document_jobs` table exists
- [ ] `document_items` table exists (generic schema)
- [ ] `document_cost_ledger` table exists
- [ ] Multi-tenant isolation enforced (composite FKs + RLS)

### API Endpoints
- [ ] POST `/api/v1/documents/ingest` implemented
- [ ] GET `/api/v1/documents/jobs/{id}` implemented
- [ ] GET `/api/v1/documents/jobs/{id}/results` implemented
- [ ] PATCH `/api/v1/documents/items/{id}/review` implemented
- [ ] API key authentication working
- [ ] Rate limiting enforced

### Processing Pipeline
- [ ] Vendor-agnostic OCR adapter exists
- [ ] Document Profile applied correctly
- [ ] Item extraction generic (no hardcoded domain)
- [ ] Flag detection working
- [ ] Confidence scoring per layer

### Human Review
- [ ] Corrections stored separately
- [ ] Original OCR immutable
- [ ] `ITEM_REVIEWED` event emitted

### Cost Accounting
- [ ] Cost ledger populated
- [ ] Budget enforcement working
- [ ] Alerts triggered at threshold

### Dashboard UI
- [ ] Integrations page exists
- [ ] Jobs list page exists
- [ ] Results viewer with evidence overlay
- [ ] Audit log page exists
- [ ] Cost dashboard exists
- [ ] NO clinical UI elements

### Validation Tests
- [ ] Test 1 (Multi-Tenant Isolation): PASS
- [ ] Test 2 (Domain-Agnostic): PASS
- [ ] Test 3 (OCR Immutability): PASS
- [ ] Test 4 (Vendor Swap): PASS
- [ ] Test 5 (Retention Policy): PASS

---

## 12. References

- **CANON-PERSISTENCE-001**: Persistence abstraction layer
- **CANON-EVENTS-001**: Event sourcing patterns
- **ONTOLOGY_SPEC**: Canonical entities (Tenant, Workspace, Identity User)
- **DB_NAMING_AND_RULES**: Multi-tenant isolation, naming conventions
- **FIT-PERSISTENCE-ABSTRACTION-001**: Repository pattern

---

## 13. Legal Guardrails (MANDATORY)

1. **Data Processor Role**: ViTo operates as data processor, not controller
2. **No Training**: Customer data NEVER used for model training
3. **No Clinical Validation**: System provides evidence, not medical advice
4. **Evidence ≠ Truth**: OCR results are data, not validated facts
5. **Precision ≠ Validation**: Confidence scores are technical, not clinical
6. **PHI Handling**: Logs MUST NOT contain PHI (patient identifiers)

---

## 14. TODOs (Future Extensions)

- [ ] **Batch Processing**: Upload multiple documents in single request
- [ ] **Real-time Streaming**: WebSocket for live OCR progress
- [ ] **Advanced Normalizers**: Drug name, ICD-10 code normalization
- [ ] **Custom Profiles**: Tenant-specific profile creation UI
- [ ] **A/B Testing**: Compare OCR providers side-by-side
- [ ] **Confidence Calibration**: ML-based confidence adjustment
- [ ] **Document Comparison**: Diff two versions of same document

---

**END OF FIT-DOCUMENT-INTELLIGENCE-001**
