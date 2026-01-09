# Document Intelligence FIT - Deliverables Package

**Status**: PROPOSED  
**Version**: 1.0.0  
**Date**: 2026-01-09  
**Prepared By**: Platform Builder + Senior Software Engineer  

---

## 📦 Package Contents

This package contains the complete architectural proposal for the **Document Intelligence FIT**, a reusable, API-first vertical for ViTo that enables OCR + semantic extraction across multiple domains.

---

## 📄 Documentation Deliverables

### 1. Core Specifications

#### **FIT-DOCUMENT-INTELLIGENCE-001.md**
**Location**: `docs/fits/FIT-DOCUMENT-INTELLIGENCE-001.md`

**Purpose**: Technical specification and validation criteria

**Contents**:
- Database schema (6 tables)
- Multi-tenant isolation enforcement
- API endpoints specification
- Document Profiles (parametric configuration)
- Processing pipeline (7 stages)
- Security & compliance guardrails
- Cost & token accounting
- Validation tests (pass criteria)
- Legal guardrails (MANDATORY)

**Key Sections**:
- ✅ Database schema following DB_NAMING_AND_RULES.md
- ✅ Multi-tenant enforcement (composite FKs + RLS)
- ✅ Generic item schema (domain-agnostic)
- ✅ Document Profiles (parametric configuration)
- ✅ Vendor-agnostic OCR adapter
- ✅ Human review layer (non-destructive)
- ✅ Cost accounting ledger

---

#### **DOCUMENT_INTELLIGENCE_ARCHITECTURE.md**
**Location**: `docs/architecture/DOCUMENT_INTELLIGENCE_ARCHITECTURE.md`

**Purpose**: Architectural overview and design decisions

**Contents**:
- Problem statement
- Architectural principles
- Domain model
- Key concepts (Document Profiles, Item Schema, Confidence Layers)
- Processing pipeline
- Security & compliance
- Cost & token accounting
- Integration patterns
- Decision records (ADRs)

**Key Sections**:
- ✅ Domain-agnostic design rationale
- ✅ Profile-driven extraction logic
- ✅ Immutable OCR principle
- ✅ Vendor-agnostic adapter pattern
- ✅ Layered confidence scoring

---

#### **document-intelligence-api.yaml**
**Location**: `docs/api/document-intelligence-api.yaml`

**Purpose**: OpenAPI 3.0 specification for REST API

**Contents**:
- API endpoints (5 endpoints)
- Request/response schemas
- Authentication (API key)
- Error responses
- Rate limiting headers

**Endpoints**:
- ✅ POST `/api/v1/documents/ingest`
- ✅ GET `/api/v1/documents/jobs/{id}`
- ✅ GET `/api/v1/documents/jobs/{id}/results`
- ✅ PATCH `/api/v1/documents/items/{id}/review`
- ✅ GET/POST `/api/v1/integrations`

---

### 2. Implementation Guidance

#### **DOCUMENT_INTELLIGENCE_IMPLEMENTATION_PLAN.md**
**Location**: `docs/implementation/DOCUMENT_INTELLIGENCE_IMPLEMENTATION_PLAN.md`

**Purpose**: 8-10 week implementation roadmap

**Contents**:
- Phase-by-phase breakdown (9 phases)
- Task checklists per phase
- Deliverables per phase
- Validation criteria
- Testing strategy
- Deployment plan
- Success metrics

**Phases**:
1. ✅ Database Schema (Week 1)
2. ✅ Core Domain Models (Week 2)
3. ✅ API Authentication (Week 3)
4. ✅ Document Ingestion (Week 4)
5. ✅ OCR Provider Adapter (Week 5)
6. ✅ Processing Pipeline (Week 6)
7. ✅ Results API (Week 7)
8. ✅ Cost Accounting (Week 8)
9. ✅ Dashboard UI (Weeks 9-10)

---

### 3. UI/UX Design

#### **DOCUMENT_INTELLIGENCE_DASHBOARD_MOCK.md**
**Location**: `docs/ui-ux/DOCUMENT_INTELLIGENCE_DASHBOARD_MOCK.md`

**Purpose**: UI mockup for technical dashboard

**Contents**:
- Page layouts (5 pages)
- UI components (badges, overlays, indicators)
- Design principles
- Anti-patterns (what NOT to build)

**Pages**:
1. ✅ Integrations (API key management)
2. ✅ Jobs List (monitoring)
3. ✅ Results Viewer (evidence overlay)
4. ✅ Audit Log (compliance)
5. ✅ Cost Dashboard (spend tracking)

---

### 4. Executive Summary

#### **DOCUMENT_INTELLIGENCE_EXECUTIVE_SUMMARY.md**
**Location**: `docs/DOCUMENT_INTELLIGENCE_EXECUTIVE_SUMMARY.md`

**Purpose**: Business case and go/no-go recommendation

**Contents**:
- Business case
- Architecture overview
- Key concepts
- Deliverables
- Cost estimation
- Implementation timeline
- Success metrics
- Recommendation (GO/NO-GO)

**Recommendation**: ✅ **GO**

---

## 🎯 Key Design Decisions

### 1. Domain-Agnostic Design

**Decision**: Use Document Profiles instead of hardcoded domain logic.

**Rationale**:
- ✅ Reusable across medical, accounting, legal, expenses
- ✅ Tenant-specific customization
- ✅ Versioned (safe updates)

**Example**:
```json
{
  "profile_key": "clinical-prescription-v1",
  "expected_item_types": ["medication", "dosage", "frequency"],
  "flags_enabled": ["crossed_out", "handwritten"],
  "confidence_thresholds": {"ocr": 0.85, "extraction": 0.75}
}
```

---

### 2. Generic Item Schema

**Decision**: Single table for all extracted items.

**Rationale**:
- ✅ Domain-agnostic (no separate tables per vertical)
- ✅ Extensible (JSONB for structured_data)
- ✅ Simpler queries (no unions)

**Schema**:
```sql
CREATE TABLE document_items (
  item_type VARCHAR(100),  -- 'medication', 'line_item', etc.
  raw_text TEXT,           -- Original OCR
  normalized_text TEXT,    -- Normalized (optional)
  flags JSONB,             -- {"crossed_out": true}
  evidence JSONB,          -- {"page": 1, "bbox": {...}}
  structured_data JSONB,   -- Domain-specific fields
  corrected_text TEXT      -- Human review
);
```

---

### 3. Immutable OCR

**Decision**: Never overwrite original OCR results.

**Rationale**:
- ✅ Auditable (can trace corrections)
- ✅ Non-destructive (preserve evidence)
- ✅ Compliance (regulators may require original)

**Implementation**:
- `raw_text`: Original OCR (IMMUTABLE)
- `corrected_text`: Human correction (separate field)
- `is_reviewed`: Flag for review status

---

### 4. Vendor-Agnostic OCR

**Decision**: Abstract OCR provider behind interface.

**Rationale**:
- ✅ Swappable (change provider without code changes)
- ✅ A/B testing (compare providers)
- ✅ Cost optimization (use cheapest provider)

**Interface**:
```typescript
interface OcrProvider {
  name: string;
  processDocument(file: Buffer): Promise<OcrResult>;
}
```

**Implementations**:
- `GoogleVisionProvider`
- `AwsTextractProvider`
- `TesseractProvider`

---

## 🧪 Validation Criteria

### Functional Tests

| Test | Description | Pass Criteria |
|------|-------------|---------------|
| Multi-Tenant Isolation | Tenant B cannot access Tenant A's jobs | 404 (not 403) |
| Domain-Agnostic | Process invoice (not medical) | Items extracted per profile |
| OCR Immutability | Human review does not overwrite OCR | `raw_text` unchanged |
| Vendor Swap | Switch Google Vision → Tesseract | No code changes |
| Retention Policy | Zero retention deletes original | File deleted immediately |

---

### Performance Tests

| Metric | Target | Validation |
|--------|--------|------------|
| 1-page document | <10 seconds | Load test |
| 10-page document | <60 seconds | Load test |
| Throughput | 1000 docs/hour | Stress test |
| API response time | <500ms (p95) | APM monitoring |

---

### Quality Tests

| Metric | Target | Validation |
|--------|--------|------------|
| Unit test coverage | >80% | Coverage report |
| Critical security issues | 0 | CodeQL scan |
| API contract compliance | 100% | Contract tests |

---

## 💰 Cost Estimation

### Development Effort

| Phase | Duration | Effort (hours) | Cost ($100/hr) |
|-------|----------|----------------|----------------|
| Database Schema | 1 week | 40 | $4,000 |
| Domain Models | 1 week | 40 | $4,000 |
| API Auth | 1 week | 40 | $4,000 |
| Ingestion API | 1 week | 40 | $4,000 |
| OCR Adapter | 1 week | 40 | $4,000 |
| Pipeline | 1 week | 40 | $4,000 |
| Results API | 1 week | 40 | $4,000 |
| Cost Accounting | 1 week | 40 | $4,000 |
| Dashboard UI | 2 weeks | 80 | $8,000 |
| **TOTAL** | **10 weeks** | **400 hours** | **$40,000** |

---

### Operational Costs

| Item | Cost | Notes |
|------|------|-------|
| OCR Provider | $0.10-$0.15/doc | Google Vision pricing |
| Storage | $0.023/GB/month | S3 standard |
| Compute | ~$200/month | Workers + API |

---

## 🚀 Next Steps

### 1. Review & Approval
- [ ] Review this package
- [ ] Approve architecture
- [ ] Approve budget ($40,000)

### 2. Resourcing
- [ ] Assign 1 senior engineer (10 weeks)
- [ ] Provision infrastructure (DB, S3, queue)
- [ ] Obtain OCR provider credentials

### 3. Kickoff
- [ ] Phase 1: Database schema (Week 1)
- [ ] Milestone 1: API endpoints functional (Week 4)
- [ ] Milestone 2: Dashboard UI complete (Week 10)

---

## 📞 Contact

For questions or clarifications:
- **Platform Team**: platform@vibethink.com
- **Architecture Review**: architecture@vibethink.com

---

## 📚 Related Documents

### ViTo Core (SEALED)
- `docs/data/DB_NAMING_AND_RULES.md` - Database naming standards
- `docs/canon/ONTOLOGY_SPEC.md` - Canonical entities
- `docs/canon/CANON-PERSISTENCE-001.md` - Persistence patterns
- `docs/fits/FIT-PERSISTENCE-ABSTRACTION-001.md` - Repository pattern

### Document Intelligence (THIS PACKAGE)
- `docs/fits/FIT-DOCUMENT-INTELLIGENCE-001.md` - Technical spec
- `docs/architecture/DOCUMENT_INTELLIGENCE_ARCHITECTURE.md` - Architecture
- `docs/api/document-intelligence-api.yaml` - OpenAPI spec
- `docs/implementation/DOCUMENT_INTELLIGENCE_IMPLEMENTATION_PLAN.md` - Roadmap
- `docs/ui-ux/DOCUMENT_INTELLIGENCE_DASHBOARD_MOCK.md` - UI mockup
- `docs/DOCUMENT_INTELLIGENCE_EXECUTIVE_SUMMARY.md` - Executive summary

---

## ✅ Checklist for Approval

### Architecture Review
- [x] Follows ViTo core principles (AI-first, Evidence-first, Domain-agnostic, Multi-tenant)
- [x] No modifications to core (Identity, Entitlements, Audit)
- [x] No hardcoded domain logic
- [x] Vendor-agnostic design
- [x] Multi-tenant isolation enforced

### Technical Review
- [x] Database schema follows DB_NAMING_AND_RULES.md
- [x] API design follows REST best practices
- [x] Security guardrails in place
- [x] Cost accounting implemented
- [x] Audit trail complete

### Legal Review
- [x] Data processor role clarified
- [x] No training on customer data
- [x] No clinical validation claims
- [x] PHI handling compliant
- [x] Retention policies configurable

### Business Review
- [x] Business case documented
- [x] Cost estimation provided
- [x] Success metrics defined
- [x] ROI analysis included

---

**END OF DELIVERABLES PACKAGE**
