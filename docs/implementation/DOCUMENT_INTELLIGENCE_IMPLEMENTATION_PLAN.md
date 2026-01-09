# Document Intelligence Implementation Plan

**Status**: PROPOSED  
**Version**: 1.0.0  
**Date**: 2026-01-09  
**Estimated Effort**: 8-10 weeks (1 senior engineer)  

---

## 🎯 Objective

Implement **Document Intelligence FIT** as a reusable, API-first vertical for ViTo, enabling OCR + semantic extraction across multiple domains (medical, accounting, legal, expenses).

---

## 📋 Prerequisites

### Required Infrastructure
- ✅ PostgreSQL database (with RLS support)
- ✅ Object storage (S3/Azure Blob)
- ✅ Message queue (for async processing)
- ✅ ViTo Core (Identity, Entitlements, Audit)

### Required Accounts
- [ ] Google Cloud Vision API (or AWS Textract)
- [ ] Webhook testing service (ngrok/webhook.site)

---

## 🗓️ Implementation Phases

### Phase 1: Database Schema (Week 1)
**Goal**: Implement multi-tenant database schema following DB_NAMING_AND_RULES.md

#### Tasks
- [ ] Create migration: `integrations` table
- [ ] Create migration: `facilities` table
- [ ] Create migration: `document_profiles` table
- [ ] Create migration: `document_jobs` table
- [ ] Create migration: `document_items` table
- [ ] Create migration: `document_cost_ledger` table
- [ ] Implement composite foreign keys (tenant isolation)
- [ ] Implement Row-Level Security policies
- [ ] Seed initial document profiles (clinical-prescription-v1, invoice-items-v1)
- [ ] Write schema validation tests

**Deliverables**:
- ✅ All tables created
- ✅ Multi-tenant isolation enforced
- ✅ Seed data loaded
- ✅ Tests passing

**Validation**:
```sql
-- Test 1: Verify tenant isolation
INSERT INTO document_jobs (tenant_id, integration_id, ...) 
  VALUES ('tenant-a', 'integration-b-from-tenant-b', ...);
-- Expected: FK violation

-- Test 2: Verify RLS
SET app.current_tenant_id = 'tenant-a';
SELECT * FROM document_jobs WHERE tenant_id = 'tenant-b';
-- Expected: 0 rows
```

---

### Phase 2: Core Domain Models (Week 2)
**Goal**: Implement TypeScript domain models and repositories

#### Tasks
- [ ] Create domain models:
  - [ ] `Integration.ts`
  - [ ] `Facility.ts`
  - [ ] `DocumentProfile.ts`
  - [ ] `DocumentJob.ts`
  - [ ] `DocumentItem.ts`
- [ ] Implement repositories (following FIT-PERSISTENCE-ABSTRACTION-001):
  - [ ] `IntegrationRepository.ts`
  - [ ] `DocumentJobRepository.ts`
  - [ ] `DocumentItemRepository.ts`
- [ ] Implement query services:
  - [ ] `DocumentJobQueryService.ts`
  - [ ] `DocumentItemQueryService.ts`
- [ ] Write unit tests for repositories

**Deliverables**:
- ✅ All domain models defined
- ✅ Repositories implement IRepository<T>
- ✅ Query services read-only
- ✅ Unit tests passing

**Example**:
```typescript
// src/modules/document-intelligence/domain/DocumentJob.ts
export interface DocumentJob {
  id: string;
  tenant_id: string;
  integration_id: string;
  facility_id?: string;
  document_profile_id: string;
  status: JobStatus;
  correlation_id: string;
  // ...
}

// src/modules/document-intelligence/repositories/DocumentJobRepository.ts
export class DocumentJobRepository implements IRepository<DocumentJob> {
  async create(job: DocumentJob, tenantId: string): Promise<DocumentJob> {
    // Enforce tenant_id
    const result = await this.db.insert(document_jobs).values({
      ...job,
      tenant_id: tenantId,
    }).returning();
    return result[0];
  }
}
```

---

### Phase 3: API Authentication & Authorization (Week 3)
**Goal**: Implement API key authentication and scope validation

#### Tasks
- [ ] Create API key generation utility
  - [ ] Generate cryptographically random keys
  - [ ] Hash with bcrypt/argon2
  - [ ] Store prefix for display
- [ ] Implement authentication middleware
  - [ ] Extract Bearer token from header
  - [ ] Hash and lookup in `integrations` table
  - [ ] Validate: active status, scopes, rate limit, IP allowlist
  - [ ] Set tenant context for RLS
- [ ] Implement rate limiting
  - [ ] Use Redis or in-memory cache
  - [ ] Track requests per integration per minute
  - [ ] Return 429 with headers
- [ ] Write integration tests

**Deliverables**:
- ✅ API key generation working
- ✅ Authentication middleware functional
- ✅ Rate limiting enforced
- ✅ Integration tests passing

**Example**:
```typescript
// src/modules/document-intelligence/middleware/auth.ts
export async function authenticateApiKey(req: Request): Promise<AuthContext> {
  const token = extractBearerToken(req);
  if (!token) throw new UnauthorizedError('Missing API key');
  
  const hash = await bcrypt.hash(token, SALT_ROUNDS);
  const integration = await integrationRepo.findByApiKeyHash(hash);
  
  if (!integration || integration.status !== 'active') {
    throw new UnauthorizedError('Invalid API key');
  }
  
  // Check rate limit
  const key = `rate_limit:${integration.id}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  if (count > integration.rate_limit_rpm) {
    throw new RateLimitError('Rate limit exceeded');
  }
  
  return {
    tenant_id: integration.tenant_id,
    integration_id: integration.id,
    scopes: integration.scopes,
  };
}
```

---

### Phase 4: Document Ingestion API (Week 4)
**Goal**: Implement POST /api/v1/documents/ingest endpoint

#### Tasks
- [ ] Create ingestion endpoint
  - [ ] Accept multipart/form-data
  - [ ] Validate file type (PDF, PNG, JPEG)
  - [ ] Validate document_profile_id exists
  - [ ] Generate job_id and correlation_id
- [ ] Implement file storage
  - [ ] Upload to S3/Azure Blob
  - [ ] Generate storage_path
  - [ ] Apply retention policy
- [ ] Create document_job record
  - [ ] Set status = 'pending'
  - [ ] Store metadata
- [ ] Emit DOCUMENT_RECEIVED event
- [ ] Enqueue processing job
- [ ] Return 202 Accepted response
- [ ] Write API tests

**Deliverables**:
- ✅ Ingestion endpoint working
- ✅ Files stored in object storage
- ✅ Jobs created in DB
- ✅ Events emitted
- ✅ API tests passing

**Example**:
```typescript
// src/modules/document-intelligence/api/ingest.ts
export async function ingestDocument(req: Request): Promise<IngestResponse> {
  const auth = await authenticateApiKey(req);
  const { file, document_profile_id, facility_id, external_ref, metadata } = req.body;
  
  // Validate
  const profile = await documentProfileRepo.findById(document_profile_id, auth.tenant_id);
  if (!profile) throw new NotFoundError('Document profile not found');
  
  // Upload file
  const storage_path = await storageService.upload(file, {
    tenant_id: auth.tenant_id,
    integration_id: auth.integration_id,
  });
  
  // Create job
  const job = await documentJobRepo.create({
    tenant_id: auth.tenant_id,
    integration_id: auth.integration_id,
    facility_id,
    document_profile_id,
    original_filename: file.originalname,
    mime_type: file.mimetype,
    file_size_bytes: file.size,
    storage_path,
    status: 'pending',
    correlation_id: uuidv4(),
    external_ref,
  }, auth.tenant_id);
  
  // Emit event
  await eventBus.emit('DOCUMENT_RECEIVED', {
    job_id: job.id,
    tenant_id: auth.tenant_id,
    correlation_id: job.correlation_id,
  });
  
  // Enqueue processing
  await queue.enqueue('process_document', { job_id: job.id });
  
  return {
    job_id: job.id,
    status: 'pending',
    correlation_id: job.correlation_id,
    estimated_completion_seconds: 30,
  };
}
```

---

### Phase 5: OCR Provider Adapter (Week 5)
**Goal**: Implement vendor-agnostic OCR adapter

#### Tasks
- [ ] Define OCR provider interface
  - [ ] `OcrProvider` interface
  - [ ] `OcrResult` type
  - [ ] `BoundingBox` type
- [ ] Implement Google Vision adapter
  - [ ] Call Vision API
  - [ ] Parse response
  - [ ] Extract text + bounding boxes
  - [ ] Map confidence scores
- [ ] Implement fallback (Tesseract)
  - [ ] Local OCR for testing
  - [ ] No external API required
- [ ] Write provider tests
- [ ] Add provider selection logic

**Deliverables**:
- ✅ OcrProvider interface defined
- ✅ Google Vision adapter working
- ✅ Tesseract adapter working
- ✅ Provider tests passing

**Example**:
```typescript
// src/modules/document-intelligence/ocr/OcrProvider.ts
export interface OcrProvider {
  name: string;
  processDocument(file: Buffer): Promise<OcrResult>;
}

export interface OcrResult {
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

// src/modules/document-intelligence/ocr/GoogleVisionProvider.ts
export class GoogleVisionProvider implements OcrProvider {
  name = 'google_vision';
  
  async processDocument(file: Buffer): Promise<OcrResult> {
    const [result] = await this.client.textDetection(file);
    const pages = this.parseResponse(result);
    return { pages };
  }
  
  private parseResponse(result: any): OcrResult['pages'] {
    // Map Google Vision response to OcrResult
    // ...
  }
}
```

---

### Phase 6: Processing Pipeline (Week 6)
**Goal**: Implement async document processing pipeline

#### Tasks
- [ ] Create pipeline orchestrator
  - [ ] Fetch job from queue
  - [ ] Load document from storage
  - [ ] Execute pipeline stages
  - [ ] Handle errors and retries
- [ ] Implement pipeline stages:
  - [ ] Stage 1: Preprocess (normalize, deskew)
  - [ ] Stage 2: OCR (call provider)
  - [ ] Stage 3: Item extraction (apply profile)
  - [ ] Stage 4: Flag detection
  - [ ] Stage 5: Confidence scoring
  - [ ] Stage 6: Persist items
  - [ ] Stage 7: Emit DOCUMENT_PROCESSED event
- [ ] Implement item extraction logic
  - [ ] Parse OCR blocks
  - [ ] Match expected_item_types from profile
  - [ ] Extract structured_data
- [ ] Implement flag detection
  - [ ] Detect crossed_out (strikethrough)
  - [ ] Detect handwritten (vs printed)
  - [ ] Score confidence per flag
- [ ] Write pipeline tests

**Deliverables**:
- ✅ Pipeline orchestrator working
- ✅ All stages implemented
- ✅ Items extracted correctly
- ✅ Flags detected
- ✅ Pipeline tests passing

**Example**:
```typescript
// src/modules/document-intelligence/pipeline/DocumentPipeline.ts
export class DocumentPipeline {
  async process(jobId: string): Promise<void> {
    const job = await this.jobRepo.findById(jobId);
    
    try {
      await this.jobRepo.updateStatus(jobId, 'processing');
      
      // Stage 1: Load file
      const file = await this.storage.download(job.storage_path);
      
      // Stage 2: OCR
      const ocrResult = await this.ocrProvider.processDocument(file);
      
      // Stage 3: Extract items
      const profile = await this.profileRepo.findById(job.document_profile_id);
      const items = await this.extractItems(ocrResult, profile);
      
      // Stage 4: Detect flags
      const flaggedItems = await this.detectFlags(items, profile.flags_enabled);
      
      // Stage 5: Score confidence
      const scoredItems = await this.scoreConfidence(flaggedItems, profile.confidence_thresholds);
      
      // Stage 6: Persist
      await this.itemRepo.createMany(scoredItems, job.tenant_id);
      
      // Stage 7: Complete
      await this.jobRepo.updateStatus(jobId, 'completed');
      await this.eventBus.emit('DOCUMENT_PROCESSED', { job_id: jobId });
      
    } catch (error) {
      await this.jobRepo.updateStatus(jobId, 'failed', error.message);
      throw error;
    }
  }
}
```

---

### Phase 7: Results API (Week 7)
**Goal**: Implement GET endpoints for job status and results

#### Tasks
- [ ] Implement GET /api/v1/documents/jobs/{id}
  - [ ] Fetch job by ID
  - [ ] Enforce tenant isolation
  - [ ] Return status, metadata, cost
- [ ] Implement GET /api/v1/documents/jobs/{id}/results
  - [ ] Fetch items for job
  - [ ] Support pagination
  - [ ] Include evidence, flags, confidence
- [ ] Implement PATCH /api/v1/documents/items/{id}/review
  - [ ] Validate scope: `document:review`
  - [ ] Update corrected_text
  - [ ] Set is_reviewed = true
  - [ ] Emit ITEM_REVIEWED event
- [ ] Write API tests

**Deliverables**:
- ✅ All GET endpoints working
- ✅ PATCH endpoint working
- ✅ Tenant isolation enforced
- ✅ API tests passing

---

### Phase 8: Cost Accounting (Week 8)
**Goal**: Implement cost tracking and budget enforcement

#### Tasks
- [ ] Implement cost recording
  - [ ] Track pages, file size, tokens
  - [ ] Calculate cost per provider
  - [ ] Insert into document_cost_ledger
- [ ] Implement budget enforcement
  - [ ] Check current spend before processing
  - [ ] Reject if over budget (hard_limit = true)
  - [ ] Send alert at threshold
- [ ] Create cost dashboard queries
  - [ ] Spend by integration
  - [ ] Spend by provider
  - [ ] Spend over time
- [ ] Write cost tests

**Deliverables**:
- ✅ Cost ledger populated
- ✅ Budget enforcement working
- ✅ Alerts triggered
- ✅ Cost tests passing

---

### Phase 9: Dashboard UI (Week 9-10)
**Goal**: Build technical dashboard for configuration and monitoring

#### Tasks
- [ ] Create pages:
  - [ ] `/dashboard/document-intelligence/integrations`
    - [ ] List API keys
    - [ ] Create/revoke keys
    - [ ] Configure webhooks, IP allowlist
  - [ ] `/dashboard/document-intelligence/jobs`
    - [ ] List jobs with filters
    - [ ] View job details
  - [ ] `/dashboard/document-intelligence/jobs/{id}/results`
    - [ ] Display extracted items
    - [ ] Show evidence overlay (bounding boxes)
    - [ ] Highlight flags
    - [ ] JSON export
  - [ ] `/dashboard/document-intelligence/audit`
    - [ ] Event timeline
    - [ ] Filter by event type, actor
  - [ ] `/dashboard/document-intelligence/costs`
    - [ ] Spend charts
    - [ ] Budget alerts
- [ ] Implement UI components:
  - [ ] API key display (masked)
  - [ ] Document viewer (PDF/image)
  - [ ] Bounding box overlay
  - [ ] Confidence badges
  - [ ] Flag indicators
- [ ] Write UI tests (Playwright)

**Deliverables**:
- ✅ All pages implemented
- ✅ UI components working
- ✅ Evidence overlay functional
- ✅ UI tests passing

---

## 🧪 Testing Strategy

### Unit Tests
- Domain models
- Repositories
- OCR providers
- Pipeline stages

### Integration Tests
- API endpoints (with test DB)
- Authentication middleware
- Pipeline end-to-end

### Contract Tests
- API responses match OpenAPI spec
- Webhook payloads match schema

### E2E Tests
- Full flow: ingest → process → review
- Multi-tenant isolation
- Vendor swap (Google Vision → Tesseract)

---

## 📦 Deliverables Checklist

### Documentation
- [x] FIT-DOCUMENT-INTELLIGENCE-001.md
- [x] DOCUMENT_INTELLIGENCE_ARCHITECTURE.md
- [x] document-intelligence-api.yaml (OpenAPI)
- [x] DOCUMENT_INTELLIGENCE_IMPLEMENTATION_PLAN.md (this file)
- [ ] API usage guide (for external developers)
- [ ] Dashboard user guide

### Code
- [ ] Database migrations (6 tables)
- [ ] Domain models (5 entities)
- [ ] Repositories (3 repositories)
- [ ] API endpoints (5 endpoints)
- [ ] OCR providers (2 adapters)
- [ ] Processing pipeline (7 stages)
- [ ] Dashboard UI (5 pages)

### Tests
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests (all endpoints)
- [ ] E2E tests (critical flows)
- [ ] Performance tests (1000 docs/hour)

### Deployment
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] OCR provider credentials set
- [ ] Object storage configured
- [ ] Queue service running
- [ ] Worker pool deployed

---

## 🚀 Deployment Plan

### Prerequisites
- [ ] PostgreSQL 14+ with RLS
- [ ] S3/Azure Blob storage
- [ ] Redis (for rate limiting)
- [ ] Message queue (RabbitMQ/SQS)
- [ ] Google Cloud Vision API key

### Deployment Steps

1. **Database**:
   ```bash
   pnpm run migrate:up
   pnpm run seed:document-profiles
   ```

2. **Environment Variables**:
   ```bash
   GOOGLE_VISION_API_KEY=...
   AWS_S3_BUCKET=...
   REDIS_URL=...
   QUEUE_URL=...
   ```

3. **Deploy API**:
   ```bash
   pnpm run build
   pnpm run deploy:api
   ```

4. **Deploy Workers**:
   ```bash
   pnpm run deploy:workers
   ```

5. **Verify**:
   ```bash
   curl -X POST https://api.vibethink.com/v1/documents/ingest \
     -H "Authorization: Bearer {API_KEY}" \
     -F "file=@test.pdf" \
     -F "document_profile_id={PROFILE_ID}"
   ```

---

## 📊 Success Metrics

### Functional
- ✅ All FIT validation tests pass
- ✅ Multi-tenant isolation enforced
- ✅ OCR vendor swappable
- ✅ Domain-agnostic (works for medical + accounting)

### Performance
- ✅ Process 1-page document in <10 seconds
- ✅ Process 10-page document in <60 seconds
- ✅ Support 1000 documents/hour

### Quality
- ✅ Unit test coverage >80%
- ✅ Zero critical security issues
- ✅ API response time <500ms (p95)

---

## 🔮 Future Enhancements

### Phase 2 (Post-MVP)
- [ ] Batch processing (multiple documents in one request)
- [ ] Real-time streaming (WebSocket for progress)
- [ ] Custom profiles (tenant-specific creation UI)
- [ ] Advanced normalizers (drug names, ICD-10 codes)
- [ ] A/B testing (compare OCR providers)
- [ ] Confidence calibration (ML-based adjustment)
- [ ] Document comparison (diff two versions)

---

## 📝 Notes

### Design Decisions
- **Generic Item Schema**: Single table for all domains (not separate tables per vertical)
- **Immutable OCR**: Original OCR never overwritten (corrections stored separately)
- **Profile-Driven**: All extraction logic governed by Document Profiles (no hardcoded domain logic)

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| OCR provider downtime | Implement fallback provider (Tesseract) |
| Large file processing timeout | Implement chunking for >100 pages |
| Cost overruns | Enforce budgets with hard limits |
| PHI leakage in logs | Scrub logs, never log raw_text |

---

**END OF IMPLEMENTATION PLAN**
