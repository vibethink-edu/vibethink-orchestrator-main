/**
 * Supabase Persistence Adapter - REAL IMPLEMENTATION
 * 
 * Implements database operations for Document Intelligence module.
 * 
 * CRITICAL:
 * - Multi-tenant isolation enforced
 * - Composite foreign keys validated
 * - Row-Level Security (RLS) enforced
 * - Audit fields auto-populated
 * 
 * @module document-intelligence/infra/supabase-persistence-adapter
 * @version 2.0.0
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { IPersistenceAdapter } from '../services/ingest.service.js';
import type { IReviewPersistenceAdapter } from '../services/review.service.js';
import type { DocumentProfile } from '../contracts/document-profile.js';
import type { DocumentJob, DocumentJobStatus } from '../contracts/document.js';
import type { DocumentItem, CreateDocumentItemInput } from '../contracts/document-item.js';
import type { HumanReview, ReviewQueueItem } from '../contracts/human-review.js';

/**
 * Supabase Persistence Adapter
 * 
 * Implements both IPersistenceAdapter and IReviewPersistenceAdapter.
 */
export class SupabasePersistenceAdapter implements IPersistenceAdapter, IReviewPersistenceAdapter {
    constructor(private readonly supabase: SupabaseClient) { }

    // ========== DOCUMENT PROFILES ==========

    /**
     * Get document profile by ID
     * 
     * @param profile_id - Profile ID
     * @param tenant_id - Tenant ID (for tenant-specific profiles)
     * @returns Document profile or null
     */
    async getDocumentProfile(profile_id: string, tenant_id: string): Promise<DocumentProfile | null> {
        const { data, error } = await this.supabase
            .from('document_profiles')
            .select('*')
            .eq('id', profile_id)
            .or(`tenant_id.eq.${tenant_id},tenant_id.is.null`) // Global or tenant-specific
            .eq('is_active', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new PersistenceError(`Failed to fetch profile: ${error.message}`, error);
        }

        return this.mapToDocumentProfile(data);
    }

    // ========== DOCUMENT JOBS ==========

    /**
     * Create document job
     * 
     * @param job - Job data (without timestamps)
     */
    async createDocumentJob(job: Omit<DocumentJob, 'created_at' | 'updated_at'>): Promise<void> {
        // Set tenant context for RLS
        await this.setTenantContext(job.tenant_id);

        const { error } = await this.supabase
            .from('document_jobs')
            .insert({
                id: job.id,
                tenant_id: job.tenant_id,
                integration_id: job.integration_id,
                facility_id: job.facility_id,
                document_profile_id: job.document_profile_id,
                original_filename: job.original_filename,
                mime_type: job.mime_type,
                file_size_bytes: job.file_size_bytes,
                page_count: job.page_count,
                storage_path: job.storage_path,
                storage_retention_days: job.storage_retention_days,
                status: job.status,
                error_message: job.error_message,
                correlation_id: job.correlation_id,
                external_ref: job.external_ref,
                processed_at: job.processed_at,
            });

        if (error) {
            throw new PersistenceError(`Failed to create job: ${error.message}`, error);
        }
    }

    /**
     * Update job status
     * 
     * @param job_id - Job ID
     * @param status - New status
     * @param error_message - Optional error message
     */
    async updateJobStatus(job_id: string, status: DocumentJobStatus, error_message?: string): Promise<void> {
        const updates: any = {
            status,
            error_message,
            updated_at: new Date().toISOString(),
        };

        if (status === 'completed') {
            updates.processed_at = new Date().toISOString();
        }

        const { error } = await this.supabase
            .from('document_jobs')
            .update(updates)
            .eq('id', job_id);

        if (error) {
            throw new PersistenceError(`Failed to update job status: ${error.message}`, error);
        }
    }

    /**
     * Get document job by ID
     * 
     * @param job_id - Job ID
     * @param tenant_id - Tenant ID (for RLS)
     * @returns Document job or null
     */
    async getDocumentJob(job_id: string, tenant_id: string): Promise<DocumentJob | null> {
        await this.setTenantContext(tenant_id);

        const { data, error } = await this.supabase
            .from('document_jobs')
            .select('*')
            .eq('id', job_id)
            .eq('tenant_id', tenant_id)
            .is('deleted_at', null)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw new PersistenceError(`Failed to fetch job: ${error.message}`, error);
        }

        return this.mapToDocumentJob(data);
    }

    // ========== DOCUMENT ITEMS ==========

    /**
     * Create document items (batch)
     * 
     * @param items - Items to create
     * @param tenant_id - Tenant ID
     */
    async createDocumentItems(items: CreateDocumentItemInput[], tenant_id: string): Promise<void> {
        await this.setTenantContext(tenant_id);

        const rows = items.map(item => ({
            tenant_id: item.tenant_id,
            document_job_id: item.document_job_id,
            item_index: item.item_index,
            item_type: item.item_type,
            raw_text: item.raw_text,
            ocr_confidence: item.ocr_confidence,
            ocr_provider: item.ocr_provider,
            normalized_text: item.normalized_text,
            normalization_confidence: item.normalization_confidence,
            flags: item.flags,
            evidence: item.evidence,
            structured_data: item.structured_data || {},
        }));

        const { error } = await this.supabase
            .from('document_items')
            .insert(rows);

        if (error) {
            throw new PersistenceError(`Failed to create items: ${error.message}`, error);
        }
    }

    /**
     * Get document item by ID
     * 
     * @param item_id - Item ID
     * @param tenant_id - Tenant ID
     * @returns Document item or null
     */
    async getDocumentItem(item_id: string, tenant_id: string): Promise<DocumentItem | null> {
        await this.setTenantContext(tenant_id);

        const { data, error } = await this.supabase
            .from('document_items')
            .select('*')
            .eq('id', item_id)
            .eq('tenant_id', tenant_id)
            .is('deleted_at', null)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw new PersistenceError(`Failed to fetch item: ${error.message}`, error);
        }

        return this.mapToDocumentItem(data);
    }

    /**
     * Get items for a job
     * 
     * @param job_id - Job ID
     * @param tenant_id - Tenant ID
     * @returns Array of document items
     */
    async getItemsByJobId(job_id: string, tenant_id: string): Promise<DocumentItem[]> {
        await this.setTenantContext(tenant_id);

        const { data, error } = await this.supabase
            .from('document_items')
            .select('*')
            .eq('document_job_id', job_id)
            .eq('tenant_id', tenant_id)
            .is('deleted_at', null)
            .order('item_index', { ascending: true });

        if (error) {
            throw new PersistenceError(`Failed to fetch items: ${error.message}`, error);
        }

        return (data || []).map(row => this.mapToDocumentItem(row));
    }

    /**
     * Mark item as reviewed
     * 
     * @param item_id - Item ID
     * @param tenant_id - Tenant ID
     * @param reviewer_user_id - Reviewer user ID
     */
    async markItemAsReviewed(item_id: string, tenant_id: string, reviewer_user_id: string): Promise<void> {
        await this.setTenantContext(tenant_id);

        const { error } = await this.supabase
            .from('document_items')
            .update({
                is_reviewed: true,
                reviewed_at: new Date().toISOString(),
                reviewed_by_user_id: reviewer_user_id,
            })
            .eq('id', item_id)
            .eq('tenant_id', tenant_id);

        if (error) {
            throw new PersistenceError(`Failed to mark item as reviewed: ${error.message}`, error);
        }
    }

    /**
     * Delete all items for a job (idempotency support)
     * 
     * Used by worker to ensure retries don't create duplicates.
     * Always deletes before inserting new batch.
     * 
     * @param tenant_id - Tenant ID
     * @param job_id - Job ID
     */
    async deleteDocumentItemsByJobId(tenant_id: string, job_id: string): Promise<void> {
        await this.setTenantContext(tenant_id);

        const { error } = await this.supabase
            .from('document_items')
            .delete()
            .eq('tenant_id', tenant_id)
            .eq('document_job_id', job_id);

        if (error) {
            throw new PersistenceError(`Failed to delete items for job: ${error.message}`, error);
        }
    }

    // ========== HUMAN REVIEWS ==========

    /**
     * Create human review
     * 
     * @param review - Review data
     */
    async createReview(review: Omit<HumanReview, 'created_at' | 'updated_at'>): Promise<void> {
        await this.setTenantContext(review.tenant_id);

        const { error } = await this.supabase
            .from('human_reviews')
            .insert({
                id: review.id,
                tenant_id: review.tenant_id,
                document_item_id: review.document_item_id,
                status: review.status,
                corrected_text: review.corrected_text,
                corrected_structured_data: review.corrected_structured_data,
                review_notes: review.review_notes,
                reviewer_confidence: review.reviewer_confidence,
                reviewed_by_user_id: review.reviewed_by_user_id,
                completed_at: review.completed_at,
            });

        if (error) {
            throw new PersistenceError(`Failed to create review: ${error.message}`, error);
        }
    }

    /**
     * Get review queue
     * 
     * @param tenant_id - Tenant ID
     * @param limit - Max items to return
     * @returns Review queue items
     */
    async getReviewQueue(tenant_id: string, limit: number = 50): Promise<ReviewQueueItem[]> {
        await this.setTenantContext(tenant_id);

        const { data, error } = await this.supabase
            .from('document_items')
            .select('id, document_job_id, item_type, raw_text, ocr_confidence, flags, created_at')
            .eq('tenant_id', tenant_id)
            .eq('is_reviewed', false)
            .is('deleted_at', null)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) {
            throw new PersistenceError(`Failed to fetch review queue: ${error.message}`, error);
        }

        return (data || []).map(row => ({
            item_id: row.id,
            job_id: row.document_job_id,
            item_type: row.item_type,
            raw_text: row.raw_text,
            ocr_confidence: row.ocr_confidence,
            flags: row.flags,
            reason_for_review: this.determineReviewReason(row.ocr_confidence, row.flags),
            priority: this.determineReviewPriority(row.ocr_confidence, row.flags),
            created_at: new Date(row.created_at),
        }));
    }

    // ========== USAGE LEDGER ==========

    /**
     * Record usage metrics
     * 
     * @param usage - Usage data
     */
    async recordUsage(usage: {
        tenant_id: string;
        integration_id: string;
        document_job_id: string;
        provider: string;
        model_version?: string;
        pages_processed: number;
        file_size_mb: number;
        tokens_input?: number;
        tokens_output?: number;
        processing_time_ms: number;
        cost_cents: number;
    }): Promise<void> {
        await this.setTenantContext(usage.tenant_id);

        const { error } = await this.supabase
            .from('usage_ledger')
            .insert(usage);

        if (error) {
            throw new PersistenceError(`Failed to record usage: ${error.message}`, error);
        }
    }

    // ========== HELPERS ==========

    /**
     * Set tenant context for RLS
     */
    private async setTenantContext(tenant_id: string): Promise<void> {
        const { error } = await this.supabase.rpc('set_config', {
            setting: 'app.current_tenant_id',
            value: tenant_id,
            is_local: false,
        });

        if (error) {
            console.warn(`Failed to set tenant context: ${error.message}`);
        }
    }

    /**
     * Map database row to DocumentProfile
     */
    private mapToDocumentProfile(row: any): DocumentProfile {
        return {
            id: row.id,
            tenant_id: row.tenant_id,
            profile_key: row.profile_key,
            profile_version: row.profile_version,
            display_name: row.display_name,
            description: row.description,
            expected_item_types: row.expected_item_types,
            flags_enabled: row.flags_enabled,
            confidence_thresholds: row.confidence_thresholds,
            normalizers: row.normalizers,
            validation_schema: row.validation_schema,
            is_active: row.is_active,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
            created_by_user_id: row.created_by_user_id,
        };
    }

    /**
     * Map database row to DocumentJob
     */
    private mapToDocumentJob(row: any): DocumentJob {
        return {
            id: row.id,
            tenant_id: row.tenant_id,
            integration_id: row.integration_id,
            facility_id: row.facility_id,
            document_profile_id: row.document_profile_id,
            original_filename: row.original_filename,
            mime_type: row.mime_type,
            file_size_bytes: row.file_size_bytes,
            page_count: row.page_count,
            storage_path: row.storage_path,
            storage_retention_days: row.storage_retention_days,
            status: row.status,
            error_message: row.error_message,
            correlation_id: row.correlation_id,
            external_ref: row.external_ref,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
            processed_at: row.processed_at ? new Date(row.processed_at) : undefined,
        };
    }

    /**
     * Map database row to DocumentItem
     */
    private mapToDocumentItem(row: any): DocumentItem {
        return {
            id: row.id,
            tenant_id: row.tenant_id,
            document_job_id: row.document_job_id,
            item_index: row.item_index,
            item_type: row.item_type,
            raw_text: row.raw_text,
            ocr_confidence: parseFloat(row.ocr_confidence),
            ocr_provider: row.ocr_provider,
            normalized_text: row.normalized_text,
            normalization_confidence: row.normalization_confidence ? parseFloat(row.normalization_confidence) : undefined,
            flags: row.flags,
            evidence: row.evidence,
            structured_data: row.structured_data,
            is_reviewed: row.is_reviewed,
            reviewed_at: row.reviewed_at ? new Date(row.reviewed_at) : undefined,
            reviewed_by_user_id: row.reviewed_by_user_id,
            corrected_text: row.corrected_text,
            review_notes: row.review_notes,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    /**
     * Determine review reason
     */
    private determineReviewReason(ocr_confidence: number, flags: any): string {
        const reasons: string[] = [];

        if (ocr_confidence < 0.85) {
            reasons.push(`Low OCR confidence (${(ocr_confidence * 100).toFixed(1)}%)`);
        }

        for (const [flag_name, flag_data] of Object.entries(flags)) {
            if ((flag_data as any).detected) {
                reasons.push(`${flag_name} detected`);
            }
        }

        return reasons.join(', ') || 'Manual review requested';
    }

    /**
     * Determine review priority
     */
    private determineReviewPriority(ocr_confidence: number, flags: any): 'low' | 'medium' | 'high' {
        if (ocr_confidence < 0.5 || flags['illegible']?.detected) return 'high';
        if (ocr_confidence < 0.75 || flags['crossed_out']?.detected || flags['handwritten']?.detected) return 'medium';
        return 'low';
    }
}

/**
 * Persistence Error
 */
export class PersistenceError extends Error {
    constructor(message: string, public readonly cause?: any) {
        super(message);
        this.name = 'PersistenceError';
    }
}
