-- Document Intelligence Module - Database Schema
-- Version: 2.0.0
-- Date: 2026-01-09
-- 
-- CRITICAL:
-- - Multi-tenant isolation enforced (tenant_id + composite FKs)
-- - Follows DB_NAMING_AND_RULES.md (SEALED)
-- - Domain-agnostic design
-- - Audit fields standard
-- - Soft-delete support

-- ============================================================================
-- HELPER FUNCTION: update_updated_at_column
-- Purpose: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLE: document_jobs
-- Purpose: Tracks document processing jobs
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_jobs (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Foreign Keys
  integration_id UUID NOT NULL,
  facility_id UUID,
  document_profile_id UUID NOT NULL,
  
  -- Document Metadata
  original_filename VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  page_count INTEGER,
  
  -- Storage
  storage_path VARCHAR(1000) NOT NULL,
  storage_retention_days INTEGER,
  
  -- S3 Storage Metadata
  source_storage_provider VARCHAR(50),
  source_object_key VARCHAR(1000),
  source_bucket VARCHAR(255),
  source_size_bytes BIGINT,
  source_mime_type VARCHAR(100),
  source_pages INTEGER,
  
  -- Processing Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  
  -- Correlation
  correlation_id UUID NOT NULL,
  external_ref VARCHAR(255),
  
  -- Audit Fields (Standard)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_by_user_id UUID,
  updated_by_user_id UUID,
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT ck_document_jobs_status CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'review_required'
  )),
  CONSTRAINT ck_document_jobs_file_size CHECK (file_size_bytes > 0),
  CONSTRAINT ck_document_jobs_page_count CHECK (page_count IS NULL OR page_count > 0)
);

-- Indexes
CREATE INDEX idx_document_jobs_tenant_id ON document_jobs(tenant_id);
CREATE INDEX idx_document_jobs_integration_id ON document_jobs(integration_id);
CREATE INDEX idx_document_jobs_status ON document_jobs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_document_jobs_correlation_id ON document_jobs(correlation_id);
CREATE INDEX idx_document_jobs_created_at ON document_jobs(created_at DESC);

-- Row-Level Security
ALTER TABLE document_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON document_jobs
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Trigger: updated_at
CREATE TRIGGER trg_document_jobs_updated_at
  BEFORE UPDATE ON document_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: document_items
-- Purpose: Extracted items from documents (GENERIC SCHEMA)
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_items (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Foreign Keys
  document_job_id UUID NOT NULL REFERENCES document_jobs(id) ON DELETE CASCADE,
  
  -- Item Identity
  item_index INTEGER NOT NULL,
  item_type VARCHAR(100) NOT NULL,
  
  -- OCR Layer (IMMUTABLE)
  raw_text TEXT NOT NULL,
  ocr_confidence NUMERIC(5,4) CHECK (ocr_confidence >= 0 AND ocr_confidence <= 1),
  ocr_provider VARCHAR(50) NOT NULL,
  
  -- Normalized Layer (OPTIONAL)
  normalized_text TEXT,
  normalization_confidence NUMERIC(5,4) CHECK (normalization_confidence >= 0 AND normalization_confidence <= 1),
  
  -- Flags (EXTENSIBLE)
  flags JSONB NOT NULL DEFAULT '{}',
  
  -- Evidence (CRITICAL for auditability)
  evidence JSONB NOT NULL,
  
  -- Structured Data (DOMAIN-SPECIFIC)
  structured_data JSONB DEFAULT '{}',
  
  -- Human Review Layer
  is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by_user_id UUID,
  corrected_text TEXT,
  review_notes TEXT,
  
  -- Audit Fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT fk_document_items_jobs_tenant FOREIGN KEY (tenant_id, document_job_id)
    REFERENCES document_jobs(tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT ck_document_items_item_index CHECK (item_index >= 0),
  CONSTRAINT ck_document_items_evidence CHECK (
    evidence ? 'page' AND evidence ? 'bbox'
  )
);

-- Indexes
CREATE INDEX idx_document_items_tenant_id ON document_items(tenant_id);
CREATE INDEX idx_document_items_job_id ON document_items(document_job_id);
CREATE INDEX idx_document_items_type ON document_items(item_type);
CREATE INDEX idx_document_items_review_required ON document_items(is_reviewed) 
  WHERE is_reviewed = FALSE AND deleted_at IS NULL;
CREATE INDEX idx_document_items_flags ON document_items USING GIN(flags);
CREATE INDEX idx_document_items_structured_data ON document_items USING GIN(structured_data);

-- Row-Level Security
ALTER TABLE document_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON document_items
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Trigger: updated_at
CREATE TRIGGER trg_document_items_updated_at
  BEFORE UPDATE ON document_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: human_reviews
-- Purpose: Human corrections (NON-DESTRUCTIVE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS human_reviews (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Foreign Keys
  document_item_id UUID NOT NULL REFERENCES document_items(id) ON DELETE CASCADE,
  
  -- Review Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  
  -- Corrections
  corrected_text TEXT,
  corrected_structured_data JSONB,
  review_notes TEXT,
  reviewer_confidence NUMERIC(5,4) CHECK (reviewer_confidence >= 0 AND reviewer_confidence <= 1),
  
  -- Reviewer
  reviewed_by_user_id UUID NOT NULL,
  
  -- Audit Fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT fk_human_reviews_items_tenant FOREIGN KEY (tenant_id, document_item_id)
    REFERENCES document_items(tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT ck_human_reviews_status CHECK (status IN (
    'pending', 'in_progress', 'completed', 'skipped'
  ))
);

-- Indexes
CREATE INDEX idx_human_reviews_tenant_id ON human_reviews(tenant_id);
CREATE INDEX idx_human_reviews_item_id ON human_reviews(document_item_id);
CREATE INDEX idx_human_reviews_status ON human_reviews(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_human_reviews_reviewer ON human_reviews(reviewed_by_user_id);

-- Row-Level Security
ALTER TABLE human_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON human_reviews
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Trigger: updated_at
CREATE TRIGGER trg_human_reviews_updated_at
  BEFORE UPDATE ON human_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: usage_ledger
-- Purpose: Cost & token accounting (AUDITABLE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS usage_ledger (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant Isolation (MANDATORY)
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Foreign Keys
  integration_id UUID NOT NULL,
  document_job_id UUID NOT NULL REFERENCES document_jobs(id) ON DELETE CASCADE,
  
  -- Provider Metrics
  provider VARCHAR(50) NOT NULL,
  model_version VARCHAR(50),
  pages_processed INTEGER NOT NULL,
  file_size_mb NUMERIC(10,2) NOT NULL,
  tokens_input INTEGER,
  tokens_output INTEGER,
  processing_time_ms INTEGER,
  
  -- Cost (in cents)
  cost_cents INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  
  -- Audit
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_usage_ledger_jobs_tenant FOREIGN KEY (tenant_id, document_job_id)
    REFERENCES document_jobs(tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT ck_usage_ledger_pages CHECK (pages_processed > 0),
  CONSTRAINT ck_usage_ledger_file_size CHECK (file_size_mb > 0),
  CONSTRAINT ck_usage_ledger_cost CHECK (cost_cents >= 0)
);

-- Indexes
CREATE INDEX idx_usage_ledger_tenant_id ON usage_ledger(tenant_id);
CREATE INDEX idx_usage_ledger_integration_id ON usage_ledger(integration_id);
CREATE INDEX idx_usage_ledger_job_id ON usage_ledger(document_job_id);
CREATE INDEX idx_usage_ledger_provider ON usage_ledger(provider);
CREATE INDEX idx_usage_ledger_recorded_at ON usage_ledger(recorded_at DESC);

-- Row-Level Security
ALTER TABLE usage_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON usage_ledger
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Function moved to top for dependency order

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE document_jobs IS 'Document processing jobs (domain-agnostic)';
COMMENT ON TABLE document_items IS 'Extracted items with generic schema (medical, invoice, expense, etc.)';
COMMENT ON TABLE human_reviews IS 'Human corrections (non-destructive, original OCR preserved)';
COMMENT ON TABLE usage_ledger IS 'Cost and token accounting for OCR providers';

COMMENT ON COLUMN document_items.raw_text IS 'IMMUTABLE: Original OCR output, NEVER overwrite';
COMMENT ON COLUMN document_items.corrected_text IS 'Human correction (if reviewed), stored separately';
COMMENT ON COLUMN document_items.structured_data IS 'Domain-specific fields (JSONB for extensibility)';
COMMENT ON COLUMN document_items.evidence IS 'Visual evidence: {page: number, bbox: {x, y, width, height}}';
