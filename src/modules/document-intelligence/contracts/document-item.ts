/**
 * Document Item - Generic Extraction Schema
 * 
 * CRITICAL: This is a GENERIC schema that works for ALL domains.
 * DO NOT create separate types for "MedicationItem" vs "InvoiceLineItem".
 * Use `item_type` + `structured_data` for domain-specific fields.
 * 
 * @module document-intelligence/contracts/document-item
 * @version 1.0.0
 */

/**
 * Bounding Box
 * Normalized coordinates for evidence overlay.
 */
export interface BoundingBox {
    x: number;      // Left position (pixels or normalized 0-1)
    y: number;      // Top position
    width: number;  // Box width
    height: number; // Box height
}

/**
 * Evidence
 * Visual evidence for an extracted item.
 * CRITICAL for auditability and human review.
 */
export interface ItemEvidence {
    /** Page number (1-indexed) */
    page: number;

    /** Bounding box coordinates */
    bbox: BoundingBox;

    /** Optional: Image crop of the evidence */
    image_crop_url?: string;
}

/**
 * Item Flags
 * Extensible flags detected during processing.
 * 
 * IMPORTANT: Flags are DOMAIN-AGNOSTIC.
 * Examples:
 * - crossed_out: Text has strikethrough
 * - handwritten: Text is handwritten (vs printed)
 * - illegible: Text is unclear/unreadable
 * - amended: Text has been modified
 */
export interface ItemFlags {
    [flag_name: string]: {
        detected: boolean;
        confidence: number; // 0.0-1.0
    };
}

/**
 * Document Item
 * Represents a single extracted item from a document.
 * 
 * DESIGN PRINCIPLE: Generic schema for ALL domains.
 * - Medical: item_type = 'medication', structured_data = {dosage, frequency}
 * - Invoice: item_type = 'line_item', structured_data = {quantity, unit_price}
 * - Expense: item_type = 'expense_line', structured_data = {category, amount}
 */
export interface DocumentItem {
    /** Primary key */
    id: string;

    /** Tenant isolation (MANDATORY) */
    tenant_id: string;

    /** Parent document job */
    document_job_id: string;

    /** Position in document (0-indexed) */
    item_index: number;

    /** Item type (from Document Profile) */
    item_type: string;
    // Examples: 'medication', 'line_item', 'expense_line', 'contract_clause'

    // ========== OCR LAYER (IMMUTABLE) ==========

    /** Original OCR output (NEVER overwrite) */
    raw_text: string;

    /** OCR confidence (0.0-1.0) */
    ocr_confidence: number;

    /** OCR provider used */
    ocr_provider: string;
    // Examples: 'google_vision', 'textract', 'tesseract'

    // ========== NORMALIZED LAYER (OPTIONAL) ==========

    /** Normalized text (if normalizer applied) */
    normalized_text?: string;

    /** Normalization confidence */
    normalization_confidence?: number;

    // ========== FLAGS LAYER ==========

    /** Detected flags (extensible) */
    flags: ItemFlags;

    // ========== EVIDENCE LAYER ==========

    /** Visual evidence (page + bbox) */
    evidence: ItemEvidence;

    // ========== STRUCTURED DATA (DOMAIN-SPECIFIC) ==========

    /**
     * Domain-specific structured fields (JSONB).
     * 
     * Examples:
     * - Medical: {dosage: '500mg', frequency: 'twice daily'}
     * - Invoice: {quantity: 10, unit_price: 25.50, total: 255.00}
     * - Expense: {category: 'travel', amount: 150.00, currency: 'USD'}
     */
    structured_data: Record<string, unknown>;

    // ========== HUMAN REVIEW LAYER ==========

    /** Has been reviewed by human */
    is_reviewed: boolean;

    /** Review timestamp */
    reviewed_at?: Date;

    /** Reviewer user ID */
    reviewed_by_user_id?: string;

    /** Human-corrected text (if reviewed) */
    corrected_text?: string;

    /** Review notes */
    review_notes?: string;

    // ========== AUDIT ==========

    created_at: Date;
    updated_at: Date;
}

/**
 * Document Item Creation Input
 * Used by extraction service to create items.
 */
export interface CreateDocumentItemInput {
    tenant_id: string;
    document_job_id: string;
    item_index: number;
    item_type: string;
    raw_text: string;
    ocr_confidence: number;
    ocr_provider: string;
    normalized_text?: string;
    normalization_confidence?: number;
    flags: ItemFlags;
    evidence: ItemEvidence;
    structured_data?: Record<string, unknown>;
}

/**
 * Document Item Response
 * Returned by results API.
 */
export interface DocumentItemResponse {
    item_id: string;
    item_index: number;
    item_type: string;
    raw_text: string;
    normalized_text?: string;
    ocr_confidence: number;
    flags: ItemFlags;
    evidence: ItemEvidence;
    structured_data: Record<string, unknown>;
    is_reviewed: boolean;
    corrected_text?: string;
}

/**
 * Confidence Layers
 * Separate confidence scores for each processing stage.
 * 
 * IMPORTANT: This enables transparency and review prioritization.
 */
export interface ConfidenceLayers {
    ocr: number;           // OCR engine confidence
    extraction: number;    // Extraction logic confidence
    normalization?: number; // Normalization confidence (if applied)
    flags: Record<string, number>; // Per-flag confidence
}

/**
 * Helper: Calculate overall confidence
 * Weighted average of all layers.
 */
export function calculateOverallConfidence(layers: ConfidenceLayers): number {
    const weights = {
        ocr: 0.4,
        extraction: 0.4,
        normalization: 0.2,
    };

    let total = layers.ocr * weights.ocr + layers.extraction * weights.extraction;

    if (layers.normalization !== undefined) {
        total += layers.normalization * weights.normalization;
    }

    return Math.min(1.0, total);
}

/**
 * Helper: Should flag for review?
 * Returns true if any confidence layer is below threshold.
 */
export function shouldFlagForReview(
    item: DocumentItem,
    thresholds: { ocr: number; extraction: number }
): boolean {
    if (item.ocr_confidence < thresholds.ocr) return true;

    // TODO: Add extraction confidence when implemented

    return false;
}
