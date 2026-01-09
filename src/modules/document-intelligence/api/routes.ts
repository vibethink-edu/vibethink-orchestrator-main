/**
 * Document Intelligence API Routes
 * 
 * Minimal API endpoints for Phase 2:
 * - POST /documents (ingest)
 * - GET /documents/:id (job status)
 * - GET /documents/:id/items (extracted items)
 * 
 * CRITICAL:
 * - API Key authentication required
 * - Scope validation (documents:write, documents:read)
 * - Tenant context mandatory (RLS)
 * - No PHI in logs
 * 
 * @module document-intelligence/api/routes
 * @version 2.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Queue } from 'bullmq';
import { SupabasePersistenceAdapter } from '../infra/persistence.adapter.js';
import { S3StorageAdapter } from '../infra/storage.adapter.js';
import type { CreateDocumentJobInput } from '../contracts/document.js';
import type { DocumentProcessingPayload } from '../worker/processor.js';
import { enqueueDocumentProcessing } from '../worker/processor.js';

/**
 * Document Intelligence Routes Handler
 * 
 * Pluggable router module for any framework (Express, Fastify, Next.js API routes).
 */
export class DocumentIntelligenceRoutes {
    private readonly persistenceAdapter: SupabasePersistenceAdapter;
    private readonly storageAdapter: S3StorageAdapter;
    private readonly queue?: Queue<DocumentProcessingPayload>;

    constructor(
        supabaseClient: SupabaseClient,
        storageConfig: { bucket: string; region: string; credentials?: any },
        queue?: Queue<DocumentProcessingPayload>
    ) {
        this.persistenceAdapter = new SupabasePersistenceAdapter(supabaseClient);
        this.storageAdapter = new S3StorageAdapter(storageConfig);
        this.queue = queue;
    }

    /**
     * POST /documents (ingest)
     * 
     * @param request - Ingest request
     * @returns Job response (201 Created)
     */
    async ingestDocument(request: IngestRequest): Promise<IngestResponse> {
        // 1. Validate authentication
        const auth = await this.validateAuth(request.apiKey, ['documents:write']);

        // 2. Validate file
        this.validateFile(request.file);

        // 3. Create job ID
        const jobId = uuidv4();
        const correlationId = uuidv4();

        // 4. Upload to S3
        const storageMetadata = await this.storageAdapter.putObject({
            tenantId: auth.tenant_id,
            jobId,
            profileId: request.document_profile_id,
            integrationId: auth.integration_id,
            filename: request.file.originalname,
            file: request.file.buffer,
            mimeType: request.file.mimetype,
            maxBytes: 50 * 1024 * 1024, // 50 MB
        });

        // 5. Create document_job in DB
        await this.persistenceAdapter.createDocumentJob({
            id: jobId,
            tenant_id: auth.tenant_id,
            integration_id: auth.integration_id,
            facility_id: request.facility_id,
            document_profile_id: request.document_profile_id,
            original_filename: request.file.originalname,
            mime_type: request.file.mimetype,
            file_size_bytes: request.file.size,
            storage_path: storageMetadata.objectKey,
            source_storage_provider: 's3',
            source_object_key: storageMetadata.objectKey,
            source_bucket: storageMetadata.bucket,
            source_size_bytes: storageMetadata.sizeBytes,
            source_mime_type: storageMetadata.mimeType,
            status: 'pending',
            correlation_id: correlationId,
            external_ref: request.external_reference,
        });

        // 6. Emit audit event
        // TODO Phase 2: Implement real audit service
        console.log(`[AUDIT] document.ingested: tenant=${auth.tenant_id}, job=${jobId}`);

        // 7. Enqueue for async processing
        if (this.queue) {
            await enqueueDocumentProcessing(this.queue, {
                tenant_id: auth.tenant_id,
                job_id: jobId,
                document_profile_id: request.document_profile_id,
                s3_bucket: storageMetadata.bucket,
                s3_key: storageMetadata.objectKey,
                mime_type: request.file.mimetype,
                original_filename: request.file.originalname,
            });
            console.log(`[QUEUE] Enqueued job for processing: ${jobId}`);
        } else {
            console.warn(`[QUEUE] Queue not configured, job will not be processed: ${jobId}`);
        }

        // 8. Return response
        return {
            job_id: jobId,
            status: 'pending',
            document_profile_id: request.document_profile_id,
            facility_id: request.facility_id,
            created_at: new Date().toISOString(),
        };
    }

    /**
     * GET /documents/:id (job status)
     * 
     * @param request - Get job request
     * @returns Job status response
     */
    async getJobStatus(request: GetJobRequest): Promise<JobStatusResponse> {
        // 1. Validate authentication
        const auth = await this.validateAuth(request.apiKey, ['documents:read']);

        // 2. Fetch job
        const job = await this.persistenceAdapter.getDocumentJob(request.job_id, auth.tenant_id);

        if (!job) {
            throw new ApiError('Job not found', 404, 'JOB_NOT_FOUND');
        }

        // 3. Generate signed URL (if policy allows)
        let signedUrl: string | undefined;
        try {
            signedUrl = await this.storageAdapter.getSignedReadUrl({
                tenantId: auth.tenant_id,
                jobId: job.id,
                filename: job.original_filename,
                expiresIn: 3600, // 1 hour
            });
        } catch (error) {
            // Signed URL generation failed (retention policy or file deleted)
            console.warn(`[API] Failed to generate signed URL for job ${job.id}: ${error}`);
        }

        // 4. Return response
        return {
            job_id: job.id,
            status: job.status,
            document_profile_id: job.document_profile_id,
            facility_id: job.facility_id,
            source: {
                mime_type: job.source_mime_type || job.mime_type,
                size_bytes: job.source_size_bytes || job.file_size_bytes,
                signed_url: signedUrl,
            },
            created_at: job.created_at.toISOString(),
            updated_at: job.updated_at.toISOString(),
            processed_at: job.processed_at?.toISOString(),
        };
    }

    /**
     * GET /documents/:id/items (extracted items)
     * 
     * @param request - Get items request
     * @returns Items response
     */
    async getJobItems(request: GetItemsRequest): Promise<ItemsResponse> {
        // 1. Validate authentication
        const auth = await this.validateAuth(request.apiKey, ['documents:read']);

        // 2. Fetch items
        const items = await this.persistenceAdapter.getItemsByJobId(request.job_id, auth.tenant_id);

        // 3. Map to response format
        const responseItems = items.map(item => ({
            item_id: item.id,
            item_index: item.item_index,
            item_type: item.item_type,
            raw_text: item.raw_text, // IMMUTABLE
            normalized_text: item.normalized_text,
            ocr_confidence: item.ocr_confidence,
            flags: item.flags,
            evidence: item.evidence,
            structured_data: item.structured_data,
            is_reviewed: item.is_reviewed,
            corrected_text: item.corrected_text, // Separate field (non-destructive)
            reviewed_at: item.reviewed_at?.toISOString(),
        }));

        // 4. Return response
        return {
            job_id: request.job_id,
            total: items.length,
            items: responseItems,
        };
    }

    // ========== HELPERS ==========

    /**
     * Validate API key and scopes
     */
    private async validateAuth(apiKey: string | undefined, requiredScopes: string[]): Promise<AuthContext> {
        if (!apiKey) {
            throw new ApiError('Missing API key', 401, 'UNAUTHORIZED');
        }

        // TODO Phase 2: Implement real API key validation
        // For now, mock validation
        const mockAuth: AuthContext = {
            tenant_id: 'tenant-123', // TODO: Extract from API key
            integration_id: 'integration-456',
            scopes: ['documents:write', 'documents:read'],
        };

        // Validate scopes
        const hasRequiredScopes = requiredScopes.every(scope => mockAuth.scopes.includes(scope));
        if (!hasRequiredScopes) {
            throw new ApiError(
                `Insufficient scopes. Required: ${requiredScopes.join(', ')}`,
                403,
                'FORBIDDEN'
            );
        }

        return mockAuth;
    }

    /**
     * Validate file upload
     */
    private validateFile(file: UploadedFile): void {
        // Validate MIME type
        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/tiff',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            throw new ApiError(
                `Unsupported media type: ${file.mimetype}`,
                415,
                'UNSUPPORTED_MEDIA_TYPE'
            );
        }

        // Validate file size
        const maxSize = 50 * 1024 * 1024; // 50 MB
        if (file.size > maxSize) {
            throw new ApiError(
                `File too large: ${file.size} bytes (max: ${maxSize} bytes)`,
                413,
                'PAYLOAD_TOO_LARGE'
            );
        }

        if (file.size === 0) {
            throw new ApiError('File is empty', 400, 'INVALID_FILE');
        }
    }
}

// ========== TYPES ==========

/**
 * Ingest Request
 */
export interface IngestRequest {
    apiKey: string;
    file: UploadedFile;
    document_profile_id: string;
    facility_id?: string;
    external_reference?: string;
}

/**
 * Uploaded File
 */
export interface UploadedFile {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

/**
 * Ingest Response (201 Created)
 */
export interface IngestResponse {
    job_id: string;
    status: 'pending';
    document_profile_id: string;
    facility_id?: string;
    created_at: string;
}

/**
 * Get Job Request
 */
export interface GetJobRequest {
    apiKey: string;
    job_id: string;
}

/**
 * Job Status Response
 */
export interface JobStatusResponse {
    job_id: string;
    status: string;
    document_profile_id: string;
    facility_id?: string;
    source: {
        mime_type: string;
        size_bytes: number;
        signed_url?: string;
    };
    created_at: string;
    updated_at: string;
    processed_at?: string;
}

/**
 * Get Items Request
 */
export interface GetItemsRequest {
    apiKey: string;
    job_id: string;
    include_reviews?: boolean;
    limit?: number;
    cursor?: string;
}

/**
 * Items Response
 */
export interface ItemsResponse {
    job_id: string;
    total: number;
    items: Array<{
        item_id: string;
        item_index: number;
        item_type: string;
        raw_text: string; // IMMUTABLE
        normalized_text?: string;
        ocr_confidence: number;
        flags: any;
        evidence: any;
        structured_data: any;
        is_reviewed: boolean;
        corrected_text?: string; // Separate field (non-destructive)
        reviewed_at?: string;
    }>;
}

/**
 * Auth Context
 */
export interface AuthContext {
    tenant_id: string;
    integration_id: string;
    scopes: string[];
}

/**
 * API Error
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly code: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ========== STUBS (TODO Phase 2) ==========

function createAuditServiceStub() {
    return {
        async emitEvent(event: any) {
            console.log(`[AUDIT STUB] ${event.event_type}:`, event);
        },
    };
}

function createQueueServiceStub() {
    return {
        async enqueue(queueName: string, payload: any) {
            console.log(`[QUEUE STUB] Enqueued to ${queueName}:`, payload);
        },
    };
}
