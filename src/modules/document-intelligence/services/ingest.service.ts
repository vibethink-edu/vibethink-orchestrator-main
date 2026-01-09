/**
 * Document Ingest Service
 * 
 * Handles document ingestion:
 * 1. Validate API key + scopes
 * 2. Store file in object storage
 * 3. Create document_job record
 * 4. Emit audit event
 * 5. Enqueue for processing
 * 
 * @module document-intelligence/services/ingest
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import type {
    CreateDocumentJobInput,
    DocumentJob,
    DocumentJobResponse,
    DocumentJobStatus,
} from '../contracts/document.js';
import type { DocumentProfile } from '../contracts/document-profile.js';

/**
 * Ingest Service
 * 
 * IMPORTANT: This service delegates to:
 * - StorageAdapter (file storage)
 * - PersistenceAdapter (DB operations)
 * - AuditService (event emission)
 * - QueueService (async processing)
 */
export class IngestService {
    constructor(
        private readonly storageAdapter: IStorageAdapter,
        private readonly persistenceAdapter: IPersistenceAdapter,
        private readonly auditService: IAuditService,
        private readonly queueService: IQueueService
    ) { }

    /**
     * Ingest a document
     * 
     * @param input - Document job creation input
     * @returns Job response (202 Accepted)
     * 
     * @throws {ValidationError} - Invalid input
     * @throws {AuthorizationError} - Insufficient scopes
     * @throws {StorageError} - File upload failed
     */
    async ingestDocument(input: CreateDocumentJobInput): Promise<DocumentJobResponse> {
        // 1. Validate document profile exists
        const profile = await this.persistenceAdapter.getDocumentProfile(
            input.document_profile_id,
            input.tenant_id
        );

        if (!profile) {
            throw new ValidationError(`Document profile not found: ${input.document_profile_id}`);
        }

        if (!profile.is_active) {
            throw new ValidationError(`Document profile is inactive: ${input.document_profile_id}`);
        }

        // 2. Validate file type
        this.validateFileType(input.mime_type);

        // 3. Upload file to storage
        const storage_path = await this.storageAdapter.uploadFile({
            tenant_id: input.tenant_id,
            integration_id: input.integration_id,
            file: input.file,
            filename: input.original_filename,
            mime_type: input.mime_type,
        });

        // 4. Create document job
        const job_id = uuidv4();
        const correlation_id = uuidv4();

        const job: Omit<DocumentJob, 'created_at' | 'updated_at'> = {
            id: job_id,
            tenant_id: input.tenant_id,
            integration_id: input.integration_id,
            facility_id: input.facility_id,
            document_profile_id: input.document_profile_id,
            original_filename: input.original_filename,
            mime_type: input.mime_type,
            file_size_bytes: input.file.length,
            storage_path,
            storage_retention_days: this.calculateRetentionDays(input.tenant_id, profile),
            status: 'pending' as DocumentJobStatus,
            correlation_id,
            external_ref: input.external_ref,
        };

        await this.persistenceAdapter.createDocumentJob(job);

        // 5. Emit audit event
        await this.auditService.emitEvent({
            event_type: 'DOCUMENT_RECEIVED',
            tenant_id: input.tenant_id,
            correlation_id,
            aggregate_type: 'DOCUMENT_JOB',
            aggregate_id: job_id,
            event_data: {
                integration_id: input.integration_id,
                document_profile_id: input.document_profile_id,
                file_size_bytes: input.file.length,
                mime_type: input.mime_type,
            },
            actor: `integration:${input.integration_id}`,
        });

        // 6. Enqueue for processing
        await this.queueService.enqueue('process_document', {
            job_id,
            tenant_id: input.tenant_id,
        });

        // 7. Return response
        return {
            job_id,
            status: 'pending',
            correlation_id,
            estimated_completion_seconds: this.estimateProcessingTime(input.file.length),
            // TODO: Add webhook_url from integration config
        };
    }

    /**
     * Validate file type
     * Only PDF and images allowed.
     */
    private validateFileType(mime_type: string): void {
        const allowed_types = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/tiff',
        ];

        if (!allowed_types.includes(mime_type)) {
            throw new ValidationError(
                `Unsupported file type: ${mime_type}. Allowed: ${allowed_types.join(', ')}`
            );
        }
    }

    /**
     * Calculate retention days
     * Based on tenant policy and profile.
     * 
     * TODO: Implement tenant-specific retention policies in Phase 2.
     */
    private calculateRetentionDays(tenant_id: string, profile: DocumentProfile): number | undefined {
        // Default: 90 days
        // TODO: Fetch from tenant_retention_policies table
        return 90;
    }

    /**
     * Estimate processing time
     * Based on file size.
     */
    private estimateProcessingTime(file_size_bytes: number): number {
        // Rough estimate: 5 seconds per MB
        const mb = file_size_bytes / (1024 * 1024);
        return Math.max(10, Math.ceil(mb * 5));
    }
}

// ========== INTERFACES (to be implemented by adapters) ==========

/**
 * Storage Adapter Interface
 * Abstracts file storage (S3, Azure Blob, etc.)
 */
export interface IStorageAdapter {
    uploadFile(params: {
        tenant_id: string;
        integration_id: string;
        file: Buffer;
        filename: string;
        mime_type: string;
    }): Promise<string>; // Returns storage_path

    downloadFile(storage_path: string): Promise<Buffer>;

    deleteFile(storage_path: string): Promise<void>;
}

/**
 * Persistence Adapter Interface
 * Abstracts database operations.
 */
export interface IPersistenceAdapter {
    getDocumentProfile(profile_id: string, tenant_id: string): Promise<DocumentProfile | null>;

    createDocumentJob(job: Omit<DocumentJob, 'created_at' | 'updated_at'>): Promise<void>;

    updateJobStatus(job_id: string, status: DocumentJobStatus, error_message?: string): Promise<void>;

    // TODO: Add more methods in Phase 2
}

/**
 * Audit Service Interface
 * Emits audit events.
 */
export interface IAuditService {
    emitEvent(event: {
        event_type: string;
        tenant_id: string;
        correlation_id: string;
        aggregate_type: string;
        aggregate_id: string;
        event_data: Record<string, unknown>;
        actor: string;
    }): Promise<void>;
}

/**
 * Queue Service Interface
 * Enqueues jobs for async processing.
 */
export interface IQueueService {
    enqueue(queue_name: string, payload: Record<string, unknown>): Promise<void>;
}

// ========== ERRORS ==========

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class AuthorizationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthorizationError';
    }
}

export class StorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StorageError';
    }
}
