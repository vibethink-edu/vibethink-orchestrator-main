/**
 * Document Intelligence - Core Domain Contracts
 * 
 * CRITICAL: These types are DOMAIN-AGNOSTIC by design.
 * DO NOT add medical, accounting, or any vertical-specific fields here.
 * Use `structured_data` JSONB field for domain-specific extensions.
 * 
 * @module document-intelligence/contracts
 * @version 1.0.0
 */

/**
 * Document Job Status
 * Represents the lifecycle state of a document processing job.
 */
export type DocumentJobStatus =
    | 'pending'      // Queued for processing
    | 'processing'   // OCR in progress
    | 'completed'    // Successfully processed
    | 'failed'       // Processing error
    | 'review_required'; // Low-confidence items need human review

/**
 * Document Job
 * Represents a single document processing request.
 * 
 * MUST enforce tenant isolation at DB layer (see DB_NAMING_AND_RULES.md).
 */
export interface DocumentJob {
    /** Primary key */
    id: string;

    /** Tenant isolation (MANDATORY) */
    tenant_id: string;

    /** Integration that submitted this job */
    integration_id: string;

    /** Optional facility (for multi-location tenants) */
    facility_id?: string;

    /** Document profile governing extraction logic */
    document_profile_id: string;

    /** Original filename */
    original_filename: string;

    /** MIME type (application/pdf, image/png, image/jpeg) */
    mime_type: string;

    /** File size in bytes */
    file_size_bytes: number;

    /** Number of pages (null until processed) */
    page_count?: number;

    /** Storage path (S3/Azure Blob) */
    storage_path: string;

    /** Retention policy (days, null = permanent) */
    storage_retention_days?: number;

    /** Storage provider (s3, azure_blob) */
    source_storage_provider?: string;

    /** S3 object key or Azure blob path */
    source_object_key?: string;

    /** S3 bucket or Azure container */
    source_bucket?: string;

    /** Source file size (bytes) */
    source_size_bytes?: number;

    /** Source MIME type */
    source_mime_type?: string;

    /** Source pages (if detected during upload) */
    source_pages?: number;

    /** Processing status */
    status: DocumentJobStatus;

    /** Error message (if failed) */
    error_message?: string;

    /** Correlation ID for tracing */
    correlation_id: string;

    /** Client's reference ID */
    external_ref?: string;

    /** Audit fields */
    created_at: Date;
    updated_at: Date;
    processed_at?: Date;
}

/**
 * Document Job Creation Input
 * Used by ingest API to create a new job.
 */
export interface CreateDocumentJobInput {
    tenant_id: string;
    integration_id: string;
    facility_id?: string;
    document_profile_id: string;
    file: Buffer;
    original_filename: string;
    mime_type: string;
    external_ref?: string;
    metadata?: Record<string, unknown>; // Domain-specific metadata
}

/**
 * Document Job Response
 * Returned by ingest API (202 Accepted).
 */
export interface DocumentJobResponse {
    job_id: string;
    status: DocumentJobStatus;
    correlation_id: string;
    estimated_completion_seconds: number;
    webhook_url?: string;
}
