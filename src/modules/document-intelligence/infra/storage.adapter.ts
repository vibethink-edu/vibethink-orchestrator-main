/**
 * S3 Storage Adapter - REAL IMPLEMENTATION
 * 
 * Handles document storage in AWS S3 with:
 * - Multi-tenant isolation (prefix-based)
 * - Server-side encryption (SSE-S3)
 * - Signed URLs for temporary access
 * - No PHI in logs/metadata
 * 
 * CRITICAL:
 * - Tenant isolation via prefix: tenants/{tenantId}/document-intelligence/jobs/{jobId}/source/{filename}
 * - SSE enabled (SSE-S3 or SSE-KMS)
 * - Public ACLs blocked
 * - Metadata without PHI
 * 
 * @module document-intelligence/infra/s3-storage-adapter
 * @version 2.0.0
 */

import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    type PutObjectCommandInput,
    type GetObjectCommandInput,
    type DeleteObjectCommandInput,
    type HeadObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

/**
 * S3 Storage Adapter
 * 
 * Implements IStorageAdapter with AWS S3.
 */
export class S3StorageAdapter {
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly region: string;

    constructor(config: S3StorageConfig) {
        this.bucket = config.bucket;
        this.region = config.region;

        this.s3Client = new S3Client({
            region: config.region,
            credentials: config.credentials ? {
                accessKeyId: config.credentials.accessKeyId,
                secretAccessKey: config.credentials.secretAccessKey,
            } : undefined, // Use default credential chain if not provided
            maxAttempts: 3, // Retry up to 3 times
        });
    }

    /**
     * Upload document to S3
     * 
     * @param params - Upload parameters
     * @returns Storage metadata
     * 
     * Key format: tenants/{tenantId}/document-intelligence/jobs/{jobId}/source/{filename}
     */
    async putObject(params: PutObjectParams): Promise<StorageMetadata> {
        // Validate MIME type
        this.validateMimeType(params.mimeType);

        // Validate file size
        this.validateFileSize(params.file.length, params.maxBytes);

        // Generate object key (tenant-isolated)
        const objectKey = this.generateObjectKey(
            params.tenantId,
            params.jobId,
            params.filename
        );

        // Prepare S3 metadata (NO PHI)
        const metadata: Record<string, string> = {
            'x-vito-tenant-id': params.tenantId,
            'x-vito-job-id': params.jobId,
            'x-vito-profile-id': params.profileId,
            'x-vito-integration-id': params.integrationId,
        };

        // Upload to S3
        const putCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
            Body: params.file,
            ContentType: params.mimeType,
            Metadata: metadata,
            ServerSideEncryption: 'AES256', // SSE-S3 (or 'aws:kms' for KMS)
            // Block public ACLs
            ACL: undefined, // Do NOT set ACL (bucket policy blocks public access)
        });

        try {
            await this.s3Client.send(putCommand);

            // Log upload (NO PHI - use jobId instead of filename)
            console.log(`[S3] Uploaded object: tenant=${params.tenantId}, job=${params.jobId}, size=${params.file.length} bytes`);

            return {
                provider: 's3',
                bucket: this.bucket,
                objectKey,
                region: this.region,
                sizeBytes: params.file.length,
                mimeType: params.mimeType,
                uploadedAt: new Date(),
            };

        } catch (error) {
            throw new StorageError(
                `Failed to upload to S3: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'S3_UPLOAD_FAILED',
                error
            );
        }
    }

    /**
     * Get signed URL for temporary read access
     * 
     * @param params - Get URL parameters
     * @returns Signed URL (expires in expiresIn seconds)
     * 
     * NOTE: Only generate if retention policy allows.
     */
    async getSignedReadUrl(params: GetSignedUrlParams): Promise<string> {
        const objectKey = this.generateObjectKey(
            params.tenantId,
            params.jobId,
            params.filename
        );

        const getCommand = new GetObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
        });

        try {
            const signedUrl = await getSignedUrl(this.s3Client, getCommand, {
                expiresIn: params.expiresIn || 3600, // Default: 1 hour
            });

            // Log URL generation (NO PHI)
            console.log(`[S3] Generated signed URL: tenant=${params.tenantId}, job=${params.jobId}, expires=${params.expiresIn}s`);

            return signedUrl;

        } catch (error) {
            throw new StorageError(
                `Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'S3_SIGNED_URL_FAILED',
                error
            );
        }
    }

    /**
     * Delete object from S3
     * 
     * @param params - Delete parameters
     * 
     * Used for retention/purge (Phase 3).
     */
    async deleteObject(params: DeleteObjectParams): Promise<void> {
        const objectKey = this.generateObjectKey(
            params.tenantId,
            params.jobId,
            params.filename
        );

        const deleteCommand = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
        });

        try {
            await this.s3Client.send(deleteCommand);

            // Log deletion (NO PHI)
            console.log(`[S3] Deleted object: tenant=${params.tenantId}, job=${params.jobId}`);

        } catch (error) {
            throw new StorageError(
                `Failed to delete from S3: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'S3_DELETE_FAILED',
                error
            );
        }
    }

    /**
     * Get object metadata (HEAD request)
     * 
     * @param params - Head parameters
     * @returns Object metadata
     * 
     * Used to validate existence/metadata without downloading.
     */
    async headObject(params: HeadObjectParams): Promise<ObjectMetadata> {
        const objectKey = this.generateObjectKey(
            params.tenantId,
            params.jobId,
            params.filename
        );

        const headCommand = new HeadObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
        });

        try {
            const response = await this.s3Client.send(headCommand);

            return {
                exists: true,
                sizeBytes: response.ContentLength || 0,
                mimeType: response.ContentType || 'application/octet-stream',
                lastModified: response.LastModified,
                metadata: response.Metadata || {},
            };

        } catch (error: any) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                return {
                    exists: false,
                    sizeBytes: 0,
                    mimeType: '',
                };
            }

            throw new StorageError(
                `Failed to get object metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'S3_HEAD_FAILED',
                error
            );
        }
    }

    /**
     * Download object from S3
     * 
     * @param params - Download parameters
     * @returns File buffer
     * 
     * Used for processing pipeline.
     */
    async downloadObject(params: DownloadObjectParams): Promise<Buffer> {
        const objectKey = this.generateObjectKey(
            params.tenantId,
            params.jobId,
            params.filename
        );

        const getCommand = new GetObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
        });

        try {
            const response = await this.s3Client.send(getCommand);

            // Convert stream to buffer
            const stream = response.Body as Readable;
            const chunks: Buffer[] = [];

            for await (const chunk of stream) {
                chunks.push(Buffer.from(chunk));
            }

            const buffer = Buffer.concat(chunks);

            // Log download (NO PHI)
            console.log(`[S3] Downloaded object: tenant=${params.tenantId}, job=${params.jobId}, size=${buffer.length} bytes`);

            return buffer;

        } catch (error) {
            throw new StorageError(
                `Failed to download from S3: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'S3_DOWNLOAD_FAILED',
                error
            );
        }
    }

    // ========== HELPERS ==========

    /**
     * Generate tenant-isolated object key
     * 
     * Format: tenants/{tenantId}/document-intelligence/jobs/{jobId}/source/{filename}
     */
    private generateObjectKey(tenantId: string, jobId: string, filename: string): string {
        // Sanitize filename (remove path traversal)
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

        return `tenants/${tenantId}/document-intelligence/jobs/${jobId}/source/${sanitizedFilename}`;
    }

    /**
     * Validate MIME type
     * 
     * Allowlist: pdf, png, jpg, jpeg, tiff
     */
    private validateMimeType(mimeType: string): void {
        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/tiff',
            'image/tif',
        ];

        if (!allowedTypes.includes(mimeType.toLowerCase())) {
            throw new StorageError(
                `Unsupported MIME type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}`,
                'INVALID_MIME_TYPE'
            );
        }
    }

    /**
     * Validate file size
     * 
     * @param sizeBytes - File size in bytes
     * @param maxBytes - Max allowed size (configurable per entitlement)
     */
    private validateFileSize(sizeBytes: number, maxBytes?: number): void {
        const limit = maxBytes || 50 * 1024 * 1024; // Default: 50 MB

        if (sizeBytes > limit) {
            throw new StorageError(
                `File size exceeds limit: ${sizeBytes} bytes > ${limit} bytes`,
                'FILE_TOO_LARGE'
            );
        }

        if (sizeBytes === 0) {
            throw new StorageError('File is empty', 'FILE_EMPTY');
        }
    }
}

// ========== TYPES ==========

/**
 * S3 Storage Configuration
 */
export interface S3StorageConfig {
    bucket: string;
    region: string;
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}

/**
 * Put Object Parameters
 */
export interface PutObjectParams {
    tenantId: string;
    jobId: string;
    profileId: string;
    integrationId: string;
    filename: string;
    file: Buffer;
    mimeType: string;
    maxBytes?: number; // Optional size limit (per entitlement)
}

/**
 * Get Signed URL Parameters
 */
export interface GetSignedUrlParams {
    tenantId: string;
    jobId: string;
    filename: string;
    expiresIn?: number; // Seconds (default: 3600 = 1 hour)
}

/**
 * Delete Object Parameters
 */
export interface DeleteObjectParams {
    tenantId: string;
    jobId: string;
    filename: string;
}

/**
 * Head Object Parameters
 */
export interface HeadObjectParams {
    tenantId: string;
    jobId: string;
    filename: string;
}

/**
 * Download Object Parameters
 */
export interface DownloadObjectParams {
    tenantId: string;
    jobId: string;
    filename: string;
}

/**
 * Storage Metadata (returned after upload)
 */
export interface StorageMetadata {
    provider: 's3';
    bucket: string;
    objectKey: string;
    region: string;
    sizeBytes: number;
    mimeType: string;
    uploadedAt: Date;
}

/**
 * Object Metadata (returned by HEAD)
 */
export interface ObjectMetadata {
    exists: boolean;
    sizeBytes: number;
    mimeType: string;
    lastModified?: Date;
    metadata?: Record<string, string>;
}

/**
 * Storage Error
 */
export class StorageError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly cause?: any
    ) {
        super(message);
        this.name = 'StorageError';
    }
}

// ========== TODO (Phase 3/4) ==========

/**
 * TODO Phase 3: Antivirus scanning
 * - Integrate with ClamAV or AWS GuardDuty
 * - Scan on upload before persisting metadata
 * - Quarantine infected files
 * 
 * TODO Phase 4: Advanced retention
 * - Lifecycle policies (S3 Lifecycle)
 * - Glacier archival for long-term retention
 * - Automatic purge based on retention_days
 */
