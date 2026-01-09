/**
 * Persistence Adapter - Database Operations Abstraction
 * 
 * Abstracts database operations for Document Intelligence module.
 * 
 * TODO: Implement actual DB operations in Phase 2.
 * This is a STUB for Phase 1.
 * 
 * @module document-intelligence/infra/persistence-adapter
 * @version 1.0.0
 */

import type { IPersistenceAdapter } from '../services/ingest.service.js';
import type { DocumentProfile } from '../contracts/document-profile.js';
import type { DocumentJob, DocumentJobStatus } from '../contracts/document.js';

/**
 * Database Persistence Adapter (STUB)
 * 
 * TODO: Implement actual database operations using Drizzle ORM or similar.
 */
export class DatabasePersistenceAdapter implements IPersistenceAdapter {
    constructor(private readonly db: any) { } // TODO: Type with actual DB client

    async getDocumentProfile(profile_id: string, tenant_id: string): Promise<DocumentProfile | null> {
        // TODO: Actual DB query
        // const result = await this.db.select()
        //   .from(document_profiles)
        //   .where(and(
        //     eq(document_profiles.id, profile_id),
        //     or(
        //       eq(document_profiles.tenant_id, tenant_id),
        //       isNull(document_profiles.tenant_id) // Global profiles
        //     )
        //   ))
        //   .limit(1);

        // STUB: Return mock profile
        console.log(`[STUB] Fetching profile: ${profile_id} for tenant: ${tenant_id}`);
        return {
            id: profile_id,
            profile_key: 'clinical-prescription-v1',
            profile_version: 1,
            display_name: 'Clinical Prescription (v1)',
            expected_item_types: ['medication', 'dosage', 'frequency'],
            flags_enabled: ['crossed_out', 'handwritten'],
            confidence_thresholds: {
                ocr: 0.85,
                extraction: 0.75,
            },
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        };
    }

    async createDocumentJob(job: Omit<DocumentJob, 'created_at' | 'updated_at'>): Promise<void> {
        // TODO: Actual DB insert
        // await this.db.insert(document_jobs).values({
        //   ...job,
        //   created_at: new Date(),
        //   updated_at: new Date(),
        // });

        // STUB: Log job creation
        console.log(`[STUB] Created document job: ${job.id}`);
    }

    async updateJobStatus(job_id: string, status: DocumentJobStatus, error_message?: string): Promise<void> {
        // TODO: Actual DB update
        // await this.db.update(document_jobs)
        //   .set({ status, error_message, updated_at: new Date() })
        //   .where(eq(document_jobs.id, job_id));

        // STUB: Log status update
        console.log(`[STUB] Updated job ${job_id} status to: ${status}`);
    }
}
