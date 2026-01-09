/**
 * OCR Provider - Vendor-Agnostic Adapter
 * 
 * CRITICAL DESIGN PRINCIPLE:
 * - OCR provider is SWAPPABLE (no vendor lock-in)
 * - All providers implement same interface
 * - Results are normalized to common format
 * 
 * Supported Providers:
 * - Google Cloud Vision
 * - AWS Textract
 * - Tesseract (local, free)
 * 
 * @module document-intelligence/services/ocr-provider
 * @version 1.0.0
 */

import type { BoundingBox, ItemEvidence } from '../contracts/document-item.js';

/**
 * OCR Result
 * Normalized output from any OCR provider.
 */
export interface OcrResult {
    pages: OcrPage[];
    provider: string;
    model_version?: string;
    processing_time_ms: number;
}

/**
 * OCR Page
 * Represents a single page of OCR output.
 */
export interface OcrPage {
    page_number: number; // 1-indexed
    full_text: string;   // Complete page text
    confidence: number;  // Overall page confidence (0.0-1.0)
    blocks: OcrBlock[];  // Text blocks with bounding boxes
}

/**
 * OCR Block
 * A single text block with position and confidence.
 */
export interface OcrBlock {
    text: string;
    bbox: BoundingBox;
    confidence: number;
    block_type?: 'paragraph' | 'line' | 'word';
}

/**
 * OCR Provider Interface
 * All OCR providers must implement this interface.
 */
export interface IOcrProvider {
    /** Provider name */
    readonly name: string;

    /**
     * Process a document
     * 
     * @param file - Document file (PDF or image)
     * @param mime_type - File MIME type
     * @returns OCR result
     */
    processDocument(file: Buffer, mime_type: string): Promise<OcrResult>;
}

/**
 * Google Cloud Vision Provider
 * 
 * TODO: Implement actual Google Vision API integration in Phase 2.
 * This is a STUB for Phase 1.
 */
export class GoogleVisionProvider implements IOcrProvider {
    readonly name = 'google_vision';

    constructor(private readonly apiKey: string) { }

    async processDocument(file: Buffer, mime_type: string): Promise<OcrResult> {
        const start_time = Date.now();

        // TODO: Actual Google Vision API call
        // const response = await this.client.textDetection(file);

        // STUB: Return mock data for Phase 1
        const mockResult: OcrResult = {
            pages: [
                {
                    page_number: 1,
                    full_text: 'MOCK OCR OUTPUT\nAmoxicillin 500mg\nTake twice daily',
                    confidence: 0.95,
                    blocks: [
                        {
                            text: 'Amoxicillin 500mg',
                            bbox: { x: 100, y: 200, width: 250, height: 40 },
                            confidence: 0.97,
                            block_type: 'line',
                        },
                        {
                            text: 'Take twice daily',
                            bbox: { x: 100, y: 250, width: 200, height: 35 },
                            confidence: 0.93,
                            block_type: 'line',
                        },
                    ],
                },
            ],
            provider: this.name,
            model_version: 'v1',
            processing_time_ms: Date.now() - start_time,
        };

        return mockResult;
    }
}

/**
 * AWS Textract Provider
 * 
 * TODO: Implement actual Textract integration in Phase 2.
 */
export class AwsTextractProvider implements IOcrProvider {
    readonly name = 'aws_textract';

    constructor(
        private readonly accessKeyId: string,
        private readonly secretAccessKey: string,
        private readonly region: string
    ) { }

    async processDocument(file: Buffer, mime_type: string): Promise<OcrResult> {
        // TODO: Implement Textract integration
        throw new Error('AWS Textract provider not yet implemented');
    }
}

/**
 * Tesseract Provider (Local, Free)
 * 
 * TODO: Implement Tesseract integration in Phase 2.
 * Useful for testing and low-cost scenarios.
 */
export class TesseractProvider implements IOcrProvider {
    readonly name = 'tesseract';

    async processDocument(file: Buffer, mime_type: string): Promise<OcrResult> {
        // TODO: Implement Tesseract integration
        throw new Error('Tesseract provider not yet implemented');
    }
}

/**
 * OCR Provider Factory
 * Creates the appropriate provider based on configuration.
 */
export class OcrProviderFactory {
    static create(config: OcrProviderConfig): IOcrProvider {
        switch (config.provider) {
            case 'google_vision':
                if (!config.google_api_key) {
                    throw new Error('Google Vision API key is required');
                }
                return new GoogleVisionProvider(config.google_api_key);

            case 'aws_textract':
                if (!config.aws_access_key_id || !config.aws_secret_access_key || !config.aws_region) {
                    throw new Error('AWS credentials are required for Textract');
                }
                return new AwsTextractProvider(
                    config.aws_access_key_id,
                    config.aws_secret_access_key,
                    config.aws_region
                );

            case 'tesseract':
                return new TesseractProvider();

            default:
                throw new Error(`Unknown OCR provider: ${config.provider}`);
        }
    }
}

/**
 * OCR Provider Configuration
 */
export interface OcrProviderConfig {
    provider: 'google_vision' | 'aws_textract' | 'tesseract';
    google_api_key?: string;
    aws_access_key_id?: string;
    aws_secret_access_key?: string;
    aws_region?: string;
}

/**
 * Helper: Normalize bounding box
 * Converts provider-specific bbox to standard format.
 */
export function normalizeBoundingBox(
    bbox: any,
    provider: string
): BoundingBox {
    // TODO: Implement provider-specific normalization
    return bbox as BoundingBox;
}
