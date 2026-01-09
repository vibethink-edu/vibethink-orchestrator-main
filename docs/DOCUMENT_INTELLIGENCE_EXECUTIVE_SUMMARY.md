# Document Intelligence FIT - Executive Summary

**Status**: PROPOSED  
**Version**: 1.0.0  
**Date**: 2026-01-09  
**Prepared By**: Platform Builder + Senior Software Engineer  

---

## 🎯 Executive Summary

**Document Intelligence** is a proposed **vertical product FIT** for the ViTo platform that provides **API-first document processing** capabilities. It enables external systems to submit documents (PDFs, images) for OCR and semantic extraction, with full multi-tenant isolation, parametric policies, and cost accounting.

### Key Value Propositions

1. **Domain-Agnostic**: Reusable across medical, accounting, legal, expense management
2. **Vendor-Agnostic**: Swappable OCR providers (Google Vision, AWS Textract, Tesseract)
3. **Evidence-First**: Provides data with confidence scores, not validation
4. **API-First**: External systems integrate via REST API + webhooks
5. **Compliant**: HIPAA-ready with retention policies and audit trails

---

## 📊 Business Case

### Problem Statement

Organizations across multiple domains need to:
- Digitize paper documents (prescriptions, invoices, receipts, contracts)
- Extract structured data (line items, medications, amounts)
- Flag anomalies (crossed-out text, handwritten notes)
- Enable human review for low-confidence items
- Control costs and maintain compliance

### Current Gaps in ViTo

- ❌ No reusable OCR service
- ❌ Domain-specific solutions (hardcoded for medical)
- ❌ Vendor lock-in (tied to single OCR provider)
- ❌ No parametric configuration
- ❌ No cost accounting

### Proposed Solution

A **platform-level capability** that:
- ✅ Works for ANY document type (not just medical)
- ✅ Supports multiple OCR vendors (swappable adapters)
- ✅ Governed by **Document Profiles** (parametric configuration)
- ✅ Provides full audit trail and cost tracking
- ✅ Respects multi-tenant isolation and retention policies

---

## 🏗️ Architecture Overview

### High-Level Flow

```
External System → API Gateway → Document Intelligence Service
                                        ↓
                                 Processing Pipeline
                                        ↓
                                 Extracted Items + Evidence
                                        ↓
                                 Results API / Webhook
```

### Core Components

1. **Ingestion API**: Accept documents with tenant + integration + facility context
2. **Processing Pipeline**: OCR → Item Extraction → Flag Detection → Confidence Scoring
3. **Results API**: Retrieve extracted items with evidence and confidence
4. **Human Review**: Optional correction layer (auditable, non-destructive)
5. **Cost Accounting**: Track spend per integration, enforce budgets
6. **Dashboard UI**: Technical interface for configuration and monitoring

---

## 🔑 Key Concepts

### 1. Document Profile (Parametric Configuration)

**Definition**: A configuration that defines how to process a document type.

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
- ✅ Tenant-specific customization
- ✅ Versioned (safe updates)

---

### 2. Generic Item Schema

**Design**: Single table for all extracted items, regardless of domain.

**Schema**:
```sql
CREATE TABLE document_items (
  item_type VARCHAR(100),  -- 'medication', 'line_item', etc.
  raw_text TEXT,           -- Original OCR output
  normalized_text TEXT,    -- Normalized (optional)
  flags JSONB,             -- {"crossed_out": true, "confidence": 0.92}
  evidence JSONB,          -- {"page": 1, "bbox": {...}}
  structured_data JSONB,   -- Domain-specific fields
  corrected_text TEXT      -- Human review (if any)
);
```

**Benefits**:
- ✅ Domain-agnostic (no separate tables per vertical)
- ✅ Extensible (structured_data is JSONB)
- ✅ Auditable (original OCR preserved)

---

### 3. Confidence Layers

**Design**: Separate confidence scores for each processing stage.

**Layers**:
1. **OCR Confidence**: How confident is the OCR engine?
2. **Extraction Confidence**: How confident is the extraction logic?
3. **Flag Confidence**: How confident is the flag detection?

**Benefits**:
- ✅ Transparency (users see confidence at each stage)
- ✅ Review prioritization (flag low-confidence items)
- ✅ No false precision

---

## 📦 Deliverables

### Documentation
- ✅ FIT-DOCUMENT-INTELLIGENCE-001.md (Technical specification)
- ✅ DOCUMENT_INTELLIGENCE_ARCHITECTURE.md (Architecture overview)
- ✅ document-intelligence-api.yaml (OpenAPI spec)
- ✅ DOCUMENT_INTELLIGENCE_IMPLEMENTATION_PLAN.md (8-10 week roadmap)
- ✅ DOCUMENT_INTELLIGENCE_DASHBOARD_MOCK.md (UI mockup)

### Implementation (Proposed)
- Database schema (6 tables)
- Domain models (5 entities)
- Repositories (3 repositories)
- API endpoints (5 endpoints)
- OCR providers (2 adapters: Google Vision, Tesseract)
- Processing pipeline (7 stages)
- Dashboard UI (5 pages)

---

## 🧪 Validation Criteria

### Functional Tests
- ✅ Multi-tenant isolation enforced
- ✅ OCR vendor swappable (Google Vision ↔ Tesseract)
- ✅ Domain-agnostic (works for medical + accounting)
- ✅ Human review non-destructive (original OCR preserved)
- ✅ Retention policies enforced

### Performance Tests
- ✅ Process 1-page document in <10 seconds
- ✅ Process 10-page document in <60 seconds
- ✅ Support 1000 documents/hour

### Quality Tests
- ✅ Unit test coverage >80%
- ✅ Zero critical security issues
- ✅ API response time <500ms (p95)

---

## 💰 Cost Estimation

### Development Effort
- **Duration**: 8-10 weeks
- **Team**: 1 senior engineer (full-time)
- **Estimated Cost**: $80,000 - $100,000 (assuming $100/hour)

### Operational Costs
- **OCR Provider**: $0.10 - $0.15 per document (Google Vision)
- **Storage**: $0.023/GB/month (S3 standard)
- **Compute**: ~$200/month (workers + API)

### Break-Even Analysis
- **Revenue per Document**: $0.50 (example)
- **Cost per Document**: $0.15 (OCR + storage + compute)
- **Gross Margin**: 70%
- **Break-Even**: ~200 documents/month

---

## 🚀 Implementation Timeline

### Phase 1: Foundation (Weeks 1-3)
- Database schema
- Domain models
- API authentication

### Phase 2: Core Processing (Weeks 4-6)
- OCR provider adapters
- Processing pipeline
- Item extraction

### Phase 3: API & UI (Weeks 7-10)
- Results API
- Human review
- Dashboard UI
- Cost accounting

---

## 📈 Success Metrics

### Adoption Metrics
- Number of integrations created
- Documents processed per day
- Active tenants using the service

### Quality Metrics
- OCR accuracy (% items with >90% confidence)
- Human review rate (% items requiring review)
- Processing success rate (% jobs completed)

### Financial Metrics
- Revenue per document
- Cost per document
- Gross margin

---

## 🔮 Future Roadmap

### Phase 2 (Post-MVP)
- Batch processing (multiple documents in one request)
- Real-time streaming (WebSocket for progress)
- Custom profiles (tenant-specific creation UI)
- Advanced normalizers (drug names, ICD-10 codes)
- A/B testing (compare OCR providers)
- Confidence calibration (ML-based adjustment)

---

## ⚖️ Legal & Compliance

### Guardrails (MANDATORY)
1. **Data Processor Role**: ViTo operates as data processor, not controller
2. **No Training**: Customer data NEVER used for model training
3. **No Clinical Validation**: System provides evidence, not medical advice
4. **Evidence ≠ Truth**: OCR results are data, not validated facts
5. **PHI Handling**: Logs MUST NOT contain PHI

### Compliance Features
- ✅ Multi-tenant isolation (RLS + composite FKs)
- ✅ Retention policies (zero, partial, full)
- ✅ Audit trail (all operations logged)
- ✅ API key authentication (scoped, rate-limited)
- ✅ Webhook signing (HMAC)

---

## 🎯 Recommendation

### Go / No-Go Decision

**RECOMMENDATION**: ✅ **GO**

**Rationale**:
1. **Strategic Fit**: Aligns with ViTo's AI-first, domain-agnostic principles
2. **Reusability**: Single implementation serves multiple verticals
3. **Compliance**: Meets HIPAA and audit requirements
4. **Cost-Effective**: Parametric design avoids per-vertical customization
5. **Extensible**: Foundation for future AI capabilities (classification, extraction)

### Next Steps

1. **Approval**: Review and approve this proposal
2. **Resourcing**: Assign 1 senior engineer (8-10 weeks)
3. **Kickoff**: Phase 1 (Database schema)
4. **Milestone 1**: API endpoints functional (Week 4)
5. **Milestone 2**: Dashboard UI complete (Week 10)

---

## 📞 Contact

For questions or clarifications, contact:
- **Platform Team**: platform@vibethink.com
- **Architecture Review**: architecture@vibethink.com

---

**END OF EXECUTIVE SUMMARY**
