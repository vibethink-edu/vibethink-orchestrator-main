/**
 * Storage Adapter - File Storage Abstraction
 * 
 * Abstracts file storage operations (S3, Azure Blob, etc.)
 * 
 * TODO: Implement actual storage provider in Phase 2.
 * This is a STUB for Phase 1.
 * 
 * @module document-intelligence/infra/storage-adapter
 * @version 1.0.0
 */

import type { IStorageAdapter } from '../services/ingest.service.js';

/**
 * S3 Storage Adapter (STUB)
 * 
 * TODO: Implement actual S3 integration using AWS SDK.
 */
export class S3StorageAdapter implements IStorageAdapter {
    constructor(
        private readonly bucket: string,
        private readonly region: string,
        private readonly accessKeyId: string,
        private readonly secretAccessKey: string
    ) { }

    async uploadFile(params: {
        tenant_id: string;
        integration_id: string;
        file: Buffer;
        filename: string;
        mime_type: string;
    }): Promise<string> {
        // TODO: Actual S3 upload
        // const s3 = new S3Client({ region: this.region });
        // const key = `${params.tenant_id}/${params.integration_id}/${Date.now()}-${params.filename}`;
        // await s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: params.file }));

        // STUB: Return mock path
        const storage_path = `s3://${this.bucket}/${params.tenant_id}/${params.integration_id}/${Date.now()}-${params.filename}`;
        console.log(`[STUB] Uploaded file to: ${storage_path}`);
        return storage_path;
    }

    async downloadFile(storage_path: string): Promise<Buffer> {
        // TODO: Actual S3 download
        throw new Error('S3StorageAdapter.downloadFile not yet implemented');
    }

    async deleteFile(storage_path: string): Promise<void> {
        // TODO: Actual S3 delete
        console.log(`[STUB] Deleted file: ${storage_path}`);
    }
}

/**
 * Azure Blob Storage Adapter (STUB)
 * 
 * TODO: Implement actual Azure Blob integration.
 */
export class AzureBlobStorageAdapter implements IStorageAdapter {
    constructor(
        private readonly connectionString: string,
        private readonly containerName: string
    ) { }

    async uploadFile(params: {
        tenant_id: string;
        integration_id: string;
        file: Buffer;
        filename: string;
        mime_type: string;
    }): Promise<string> {
        // TODO: Actual Azure Blob upload
        const storage_path = `azure://${this.containerName}/${params.tenant_id}/${params.integration_id}/${Date.now()}-${params.filename}`;
        console.log(`[STUB] Uploaded file to: ${storage_path}`);
        return storage_path;
    }

    async downloadFile(storage_path: string): Promise<Buffer> {
        throw new Error('AzureBlobStorageAdapter.downloadFile not yet implemented');
    }

    async deleteFile(storage_path: string): Promise<void> {
        console.log(`[STUB] Deleted file: ${storage_path}`);
    }
}
