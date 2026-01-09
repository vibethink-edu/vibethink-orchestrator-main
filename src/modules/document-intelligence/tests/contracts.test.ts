/**
 * Contract Tests
 * 
 * Validates that domain contracts are correctly defined and typed.
 * 
 * @module document-intelligence/tests/contracts
 */

import { describe, it, expect } from 'vitest';
import type {
    DocumentJob,
    DocumentJobStatus,
    CreateDocumentJobInput,
} from '../contracts/document.js';
import type {
    DocumentProfile,
} from '../contracts/document-profile.js';
import {
    EXAMPLE_CLINICAL_PRESCRIPTION_PROFILE,
    EXAMPLE_INVOICE_PROFILE,
} from '../contracts/document-profile.js';
import type {
    DocumentItem,
    ItemFlags,
} from '../contracts/document-item.js';
import {
    calculateOverallConfidence,
    shouldFlagForReview,
} from '../contracts/document-item.js';
import {
    determineReviewPriority,
    generateReviewReason,
} from '../contracts/human-review.js';

describe('Document Contracts', () => {
    it('should define valid DocumentJob type', () => {
        const job: DocumentJob = {
            id: 'job-123',
            tenant_id: 'tenant-456',
            integration_id: 'integration-789',
            document_profile_id: 'profile-abc',
            original_filename: 'test.pdf',
            mime_type: 'application/pdf',
            file_size_bytes: 1024,
            storage_path: 's3://bucket/path/to/file.pdf',
            status: 'pending',
            correlation_id: 'corr-xyz',
            created_at: new Date(),
            updated_at: new Date(),
        };

        expect(job.id).toBe('job-123');
        expect(job.status).toBe('pending');
    });

    it('should define valid DocumentProfile type', () => {
        const profile: DocumentProfile = {
            id: 'profile-123',
            profile_key: 'test-profile-v1',
            profile_version: 1,
            display_name: 'Test Profile',
            expected_item_types: ['item1', 'item2'],
            flags_enabled: ['flag1', 'flag2'],
            confidence_thresholds: {
                ocr: 0.85,
                extraction: 0.75,
            },
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        };

        expect(profile.profile_key).toBe('test-profile-v1');
        expect(profile.expected_item_types).toHaveLength(2);
    });

    it('should provide example clinical profile', () => {
        expect(EXAMPLE_CLINICAL_PRESCRIPTION_PROFILE.profile_key).toBe('clinical-prescription-v1');
        expect(EXAMPLE_CLINICAL_PRESCRIPTION_PROFILE.expected_item_types).toContain('medication');
        expect(EXAMPLE_CLINICAL_PRESCRIPTION_PROFILE.flags_enabled).toContain('crossed_out');
    });

    it('should provide example invoice profile', () => {
        expect(EXAMPLE_INVOICE_PROFILE.profile_key).toBe('invoice-items-v1');
        expect(EXAMPLE_INVOICE_PROFILE.expected_item_types).toContain('quantity');
    });

    it('should define valid DocumentItem type', () => {
        const item: DocumentItem = {
            id: 'item-123',
            tenant_id: 'tenant-456',
            document_job_id: 'job-789',
            item_index: 0,
            item_type: 'medication',
            raw_text: 'Amoxicillin 500mg',
            ocr_confidence: 0.95,
            ocr_provider: 'google_vision',
            flags: {
                crossed_out: { detected: false, confidence: 0.9 },
            },
            evidence: {
                page: 1,
                bbox: { x: 100, y: 200, width: 250, height: 40 },
            },
            structured_data: {
                dosage: '500mg',
            },
            is_reviewed: false,
            created_at: new Date(),
            updated_at: new Date(),
        };

        expect(item.item_type).toBe('medication');
        expect(item.raw_text).toBe('Amoxicillin 500mg');
    });

    it('should calculate overall confidence', () => {
        const confidence = calculateOverallConfidence({
            ocr: 0.9,
            extraction: 0.8,
            flags: {},
        });

        expect(confidence).toBeGreaterThan(0);
        expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should determine if item needs review', () => {
        const item: DocumentItem = {
            id: 'item-123',
            tenant_id: 'tenant-456',
            document_job_id: 'job-789',
            item_index: 0,
            item_type: 'medication',
            raw_text: 'Test',
            ocr_confidence: 0.6, // Low confidence
            ocr_provider: 'google_vision',
            flags: {},
            evidence: { page: 1, bbox: { x: 0, y: 0, width: 0, height: 0 } },
            structured_data: {},
            is_reviewed: false,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const needsReview = shouldFlagForReview(item, { ocr: 0.85, extraction: 0.75 });
        expect(needsReview).toBe(true);
    });

    it('should determine review priority', () => {
        const priority = determineReviewPriority(0.4, {
            illegible: { detected: true, confidence: 0.9 },
        });

        expect(priority).toBe('high');
    });

    it('should generate review reason', () => {
        const reason = generateReviewReason(
            0.6,
            {
                crossed_out: { detected: true, confidence: 0.85 },
            },
            0.85
        );

        expect(reason).toContain('Low OCR confidence');
        expect(reason).toContain('crossed_out detected');
    });
});

describe('Domain-Agnostic Design', () => {
    it('should support multiple domains with same schema', () => {
        // Medical item
        const medicalItem: DocumentItem = {
            id: 'item-1',
            tenant_id: 'tenant-1',
            document_job_id: 'job-1',
            item_index: 0,
            item_type: 'medication',
            raw_text: 'Amoxicillin 500mg',
            ocr_confidence: 0.95,
            ocr_provider: 'google_vision',
            flags: {},
            evidence: { page: 1, bbox: { x: 0, y: 0, width: 0, height: 0 } },
            structured_data: {
                dosage: '500mg',
                frequency: 'twice daily',
            },
            is_reviewed: false,
            created_at: new Date(),
            updated_at: new Date(),
        };

        // Invoice item (same schema!)
        const invoiceItem: DocumentItem = {
            id: 'item-2',
            tenant_id: 'tenant-1',
            document_job_id: 'job-2',
            item_index: 0,
            item_type: 'line_item',
            raw_text: 'Widget x10 @ $25.50',
            ocr_confidence: 0.92,
            ocr_provider: 'google_vision',
            flags: {},
            evidence: { page: 1, bbox: { x: 0, y: 0, width: 0, height: 0 } },
            structured_data: {
                quantity: 10,
                unit_price: 25.50,
                total: 255.00,
            },
            is_reviewed: false,
            created_at: new Date(),
            updated_at: new Date(),
        };

        // Both items use SAME schema
        expect(medicalItem.item_type).toBe('medication');
        expect(invoiceItem.item_type).toBe('line_item');

        // Domain-specific data in structured_data
        expect(medicalItem.structured_data).toHaveProperty('dosage');
        expect(invoiceItem.structured_data).toHaveProperty('quantity');
    });
});
