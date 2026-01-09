/**
 * Human Review - Non-Destructive Correction Layer
 * 
 * CRITICAL DESIGN PRINCIPLE:
 * - Human corrections NEVER overwrite original OCR
 * - All corrections are stored as separate layer
 * - Fully auditable (who, when, why)
 * 
 * LEGAL GUARDRAIL:
 * - Evidence ≠ Truth
 * - Precision ≠ Validation
 * - System provides data, not clinical/legal validation
 * 
 * @module document-intelligence/contracts/human-review
 * @version 1.0.0
 */

/**
 * Human Review Status
 */
export type ReviewStatus =
    | 'pending'    // Awaiting review
    | 'in_progress' // Being reviewed
    | 'completed'  // Review finished
    | 'skipped';   // Review not needed

/**
 * Human Review
 * Represents a human correction of an extracted item.
 * 
 * IMPORTANT: This is a SEPARATE entity, not a field update.
 * The original `document_item` remains unchanged.
 */
export interface HumanReview {
    /** Primary key */
    id: string;

    /** Tenant isolation (MANDATORY) */
    tenant_id: string;

    /** Item being reviewed */
    document_item_id: string;

    /** Review status */
    status: ReviewStatus;

    /** Corrected text (if different from raw_text) */
    corrected_text?: string;

    /** Corrected structured data (if different) */
    corrected_structured_data?: Record<string, unknown>;

    /** Review notes (why correction was made) */
    review_notes?: string;

    /** Reviewer confidence (0.0-1.0) */
    reviewer_confidence?: number;

    /** Reviewer user ID */
    reviewed_by_user_id: string;

    /** Audit fields */
    created_at: Date;
    updated_at: Date;
    completed_at?: Date;
}

/**
 * Submit Review Input
 * Used by review API to submit a correction.
 */
export interface SubmitReviewInput {
    tenant_id: string;
    document_item_id: string;
    corrected_text?: string;
    corrected_structured_data?: Record<string, unknown>;
    review_notes?: string;
    reviewer_confidence?: number;
    reviewed_by_user_id: string;
}

/**
 * Review Response
 * Returned by review API.
 */
export interface ReviewResponse {
    review_id: string;
    item_id: string;
    status: ReviewStatus;
    reviewed_at: Date;
    reviewed_by: string;
}

/**
 * Review Queue Item
 * Items flagged for human review.
 */
export interface ReviewQueueItem {
    item_id: string;
    job_id: string;
    item_type: string;
    raw_text: string;
    ocr_confidence: number;
    flags: Record<string, { detected: boolean; confidence: number }>;
    reason_for_review: string; // 'low_ocr_confidence', 'flag_detected', 'manual_request'
    priority: 'low' | 'medium' | 'high';
    created_at: Date;
}

/**
 * Helper: Determine review priority
 * Based on confidence and flags.
 */
export function determineReviewPriority(
    ocr_confidence: number,
    flags: Record<string, { detected: boolean; confidence: number }>
): 'low' | 'medium' | 'high' {
    // High priority: Very low confidence OR critical flags
    if (ocr_confidence < 0.5) return 'high';
    if (flags['illegible']?.detected) return 'high';

    // Medium priority: Low confidence OR warning flags
    if (ocr_confidence < 0.75) return 'medium';
    if (flags['crossed_out']?.detected) return 'medium';
    if (flags['handwritten']?.detected) return 'medium';

    // Low priority: Everything else
    return 'low';
}

/**
 * Helper: Generate review reason
 * Human-readable explanation of why review is needed.
 */
export function generateReviewReason(
    ocr_confidence: number,
    flags: Record<string, { detected: boolean; confidence: number }>,
    threshold: number
): string {
    const reasons: string[] = [];

    if (ocr_confidence < threshold) {
        reasons.push(`Low OCR confidence (${(ocr_confidence * 100).toFixed(1)}%)`);
    }

    for (const [flag_name, flag_data] of Object.entries(flags)) {
        if (flag_data.detected) {
            reasons.push(`${flag_name} detected (${(flag_data.confidence * 100).toFixed(1)}%)`);
        }
    }

    return reasons.join(', ') || 'Manual review requested';
}

/**
 * Review Metrics
 * Aggregated metrics for review dashboard.
 */
export interface ReviewMetrics {
    total_items: number;
    items_reviewed: number;
    items_pending: number;
    avg_review_time_seconds: number;
    correction_rate: number; // % of items that needed correction
}
