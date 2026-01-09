/**
 * Extraction Service
 * 
 * Applies Document Profile to OCR results to extract structured items.
 * 
 * CRITICAL: This service is DOMAIN-AGNOSTIC.
 * All extraction logic is governed by the Document Profile.
 * 
 * @module document-intelligence/services/extraction
 * @version 1.0.0
 */

import type { DocumentProfile } from '../contracts/document-profile.js';
import type { CreateDocumentItemInput, ItemFlags } from '../contracts/document-item.js';
import type { OcrResult, OcrBlock } from './ocr.provider.js';

/**
 * Extraction Service
 * Extracts items from OCR results based on Document Profile.
 */
export class ExtractionService {
    /**
     * Extract items from OCR result
     * 
     * @param ocrResult - OCR output
     * @param profile - Document profile governing extraction
     * @param tenant_id - Tenant ID
     * @param job_id - Document job ID
     * @returns Extracted items
     */
    async extractItems(
        ocrResult: OcrResult,
        profile: DocumentProfile,
        tenant_id: string,
        job_id: string
    ): Promise<CreateDocumentItemInput[]> {
        const items: CreateDocumentItemInput[] = [];

        let item_index = 0;

        for (const page of ocrResult.pages) {
            for (const block of page.blocks) {
                // Match block to expected item types
                const item_type = this.matchItemType(block.text, profile.expected_item_types);

                if (!item_type) continue; // Skip blocks that don't match any expected type

                // Detect flags
                const flags = this.detectFlags(block.text, profile.flags_enabled);

                // Create item
                const item: CreateDocumentItemInput = {
                    tenant_id,
                    document_job_id: job_id,
                    item_index: item_index++,
                    item_type,
                    raw_text: block.text,
                    ocr_confidence: block.confidence,
                    ocr_provider: ocrResult.provider,
                    flags,
                    evidence: {
                        page: page.page_number,
                        bbox: block.bbox,
                    },
                    // TODO: Extract structured_data in Phase 2
                    structured_data: {},
                };

                items.push(item);
            }
        }

        return items;
    }

    /**
     * Match OCR block to item type
     * 
     * TODO: Implement ML-based matching in Phase 2.
     * For Phase 1, use simple keyword matching.
     */
    private matchItemType(text: string, expected_types: string[]): string | null {
        // STUB: Simple keyword matching
        const lower_text = text.toLowerCase();

        for (const type of expected_types) {
            if (type === 'medication' && /\d+mg|\d+ml/i.test(text)) {
                return 'medication';
            }
            if (type === 'line_item' && /\$|€|£/.test(text)) {
                return 'line_item';
            }
        }

        return expected_types[0] || null; // Default to first type
    }

    /**
     * Detect flags in text
     * 
     * TODO: Implement ML-based flag detection in Phase 2.
     * For Phase 1, use simple heuristics.
     */
    private detectFlags(text: string, enabled_flags: string[]): ItemFlags {
        const flags: ItemFlags = {};

        for (const flag_name of enabled_flags) {
            switch (flag_name) {
                case 'crossed_out':
                    flags[flag_name] = {
                        detected: text.includes('~~') || text.includes('--'),
                        confidence: 0.8,
                    };
                    break;

                case 'handwritten':
                    // TODO: Implement actual handwriting detection
                    flags[flag_name] = {
                        detected: false,
                        confidence: 0.5,
                    };
                    break;

                case 'illegible':
                    // TODO: Implement illegibility detection
                    flags[flag_name] = {
                        detected: text.length < 3,
                        confidence: 0.6,
                    };
                    break;

                default:
                    flags[flag_name] = {
                        detected: false,
                        confidence: 0.0,
                    };
            }
        }

        return flags;
    }
}
