/**
 * Review Service
 * 
 * Handles human review of extracted items.
 * 
 * CRITICAL PRINCIPLE: Non-destructive corrections.
 * Original OCR is NEVER overwritten.
 * 
 * @module document-intelligence/services/review
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import type {
    HumanReview,
    SubmitReviewInput,
    ReviewResponse,
    ReviewQueueItem,
    ReviewStatus,
} from '../contracts/human-review.js';
import type { DocumentItem } from '../contracts/document-item.js';

/**
 * Review Service
 */
export class ReviewService {
    constructor(
        private readonly persistenceAdapter: IReviewPersistenceAdapter,
        private readonly auditService: IAuditService
    ) { }

    /**
     * Submit a human review
     * 
     * @param input - Review submission
     * @returns Review response
     */
    async submitReview(input: SubmitReviewInput): Promise<ReviewResponse> {
        // 1. Fetch original item
        const item = await this.persistenceAdapter.getDocumentItem(
            input.document_item_id,
            input.tenant_id
        );

        if (!item) {
            throw new Error(`Document item not found: ${input.document_item_id}`);
        }

        // 2. Create review record
        const review_id = uuidv4();
        const review: Omit<HumanReview, 'created_at' | 'updated_at'> = {
            id: review_id,
            tenant_id: input.tenant_id,
            document_item_id: input.document_item_id,
            status: 'completed',
            corrected_text: input.corrected_text,
            corrected_structured_data: input.corrected_structured_data,
            review_notes: input.review_notes,
            reviewer_confidence: input.reviewer_confidence,
            reviewed_by_user_id: input.reviewed_by_user_id,
            completed_at: new Date(),
        };

        await this.persistenceAdapter.createReview(review);

        // 3. Update item review status (but NOT the raw_text)
        await this.persistenceAdapter.markItemAsReviewed(
            input.document_item_id,
            input.tenant_id,
            input.reviewed_by_user_id
        );

        // 4. Emit audit event
        await this.auditService.emitEvent({
            event_type: 'ITEM_REVIEWED',
            tenant_id: input.tenant_id,
            correlation_id: item.document_job_id, // Use job_id as correlation
            aggregate_type: 'DOCUMENT_ITEM',
            aggregate_id: input.document_item_id,
            event_data: {
                review_id,
                corrected: !!input.corrected_text,
                reviewer_user_id: input.reviewed_by_user_id,
            },
            actor: `user:${input.reviewed_by_user_id}`,
        });

        // 5. Return response
        return {
            review_id,
            item_id: input.document_item_id,
            status: 'completed',
            reviewed_at: new Date(),
            reviewed_by: input.reviewed_by_user_id,
        };
    }

    /**
     * Get review queue
     * Returns items flagged for review.
     * 
     * @param tenant_id - Tenant ID
     * @param limit - Max items to return
     * @returns Review queue items
     */
    async getReviewQueue(tenant_id: string, limit: number = 50): Promise<ReviewQueueItem[]> {
        return this.persistenceAdapter.getReviewQueue(tenant_id, limit);
    }
}

// ========== INTERFACES ==========

export interface IReviewPersistenceAdapter {
    getDocumentItem(item_id: string, tenant_id: string): Promise<DocumentItem | null>;

    createReview(review: Omit<HumanReview, 'created_at' | 'updated_at'>): Promise<void>;

    markItemAsReviewed(item_id: string, tenant_id: string, reviewer_user_id: string): Promise<void>;

    getReviewQueue(tenant_id: string, limit: number): Promise<ReviewQueueItem[]>;
}

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
