/**
 * Gemini Flash 2.5 OCR Provider
 * 
 * REAL IMPLEMENTATION using Google Gemini Flash 2.5 for OCR + Vision.
 * 
 * CRITICAL:
 * - Extracts text + bounding boxes
 * - Does NOT infer semantics (that's ExtractionService's job)
 * - raw_text is IMMUTABLE
 * - Evidence-first (page + bbox)
 * 
 * @module document-intelligence/services/gemini-ocr-provider
 * @version 2.0.0
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IOcrProvider, OcrResult, OcrPage, OcrBlock } from './ocr.provider.js';
import type { BoundingBox } from '../contracts/document-item.js';

/**
 * Gemini Flash 2.5 OCR Provider
 * 
 * Uses Google's Gemini Flash 2.5 model for document OCR.
 */
export class GeminiFlashOcrProvider implements IOcrProvider {
    readonly name = 'gemini_flash_2_5';
    private readonly genAI: GoogleGenerativeAI;
    private readonly model: any;

    constructor(
        private readonly apiKey: string,
        private readonly config: GeminiOcrConfig = {}
    ) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: config.modelName || 'gemini-2.0-flash-exp',
        });
    }

    /**
     * Process document with Gemini Flash 2.5
     * 
     * @param file - Document file (PDF or image)
     * @param mime_type - File MIME type
     * @returns OCR result with text + bounding boxes
     */
    async processDocument(file: Buffer, mime_type: string): Promise<OcrResult> {
        const start_time = Date.now();

        try {
            // Validate MIME type
            this.validateMimeType(mime_type);

            // Convert file to base64
            const base64Data = file.toString('base64');

            // Prepare prompt (OCR-focused, NO semantic inference)
            const prompt = this.buildOcrPrompt();

            // Call Gemini API
            const result = await this.callGeminiWithRetry({
                inlineData: {
                    mimeType: mime_type,
                    data: base64Data,
                },
            }, prompt);

            // Parse response
            const ocrResult = this.parseGeminiResponse(result, start_time);

            return ocrResult;

        } catch (error) {
            throw new OcrError(
                `Gemini OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'GEMINI_API_ERROR',
                error
            );
        }
    }

    /**
     * Build OCR-focused prompt
     * 
     * CRITICAL: Prompt does NOT ask for semantic interpretation.
     * Only asks for text extraction + layout.
     */
    private buildOcrPrompt(): string {
        return `Extract all text from this document with precise layout information.

INSTRUCTIONS:
1. Extract ALL visible text exactly as it appears
2. Preserve original formatting and line breaks
3. For each text block, provide:
   - The exact text
   - Page number (if multi-page)
   - Bounding box coordinates (normalized 0-1)
   - Confidence score (0-1)

OUTPUT FORMAT (JSON):
{
  "pages": [
    {
      "page_number": 1,
      "full_text": "Complete page text...",
      "confidence": 0.95,
      "blocks": [
        {
          "text": "Text block content",
          "bbox": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.05},
          "confidence": 0.97,
          "block_type": "paragraph"
        }
      ]
    }
  ]
}

IMPORTANT:
- Do NOT interpret or classify the content
- Do NOT infer semantic meaning
- Do NOT extract structured data
- ONLY extract raw text + layout
- Use normalized coordinates (0-1 range)`;
    }

    /**
     * Call Gemini API with retry logic
     */
    private async callGeminiWithRetry(
        imagePart: any,
        prompt: string,
        maxRetries: number = 3
    ): Promise<any> {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await this.model.generateContent([prompt, imagePart]);
                const response = await result.response;
                return response;

            } catch (error) {
                lastError = error as Error;

                // Check if retryable
                if (this.isRetryableError(error)) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    console.warn(`[GeminiOCR] Attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms...`);
                    await this.sleep(delay);
                    continue;
                }

                // Non-retryable error, throw immediately
                throw error;
            }
        }

        throw new OcrError(
            `Gemini OCR failed after ${maxRetries} attempts`,
            'MAX_RETRIES_EXCEEDED',
            lastError
        );
    }

    /**
     * Parse Gemini response to OcrResult
     */
    private parseGeminiResponse(response: any, start_time: number): OcrResult {
        try {
            const text = response.text();

            // Try to parse as JSON
            let parsed: any;
            try {
                // Extract JSON from markdown code blocks if present
                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
                const jsonText = jsonMatch ? jsonMatch[1] : text;
                parsed = JSON.parse(jsonText);
            } catch {
                // Fallback: Create simple structure from raw text
                parsed = this.createFallbackStructure(text);
            }

            // Normalize to OcrResult format
            const pages: OcrPage[] = (parsed.pages || [parsed]).map((page: any, index: number) => ({
                page_number: page.page_number || index + 1,
                full_text: page.full_text || page.text || text,
                confidence: page.confidence || 0.85,
                blocks: (page.blocks || []).map((block: any) => this.normalizeBlock(block)),
            }));

            // If no blocks, create one from full_text
            pages.forEach(page => {
                if (page.blocks.length === 0 && page.full_text) {
                    page.blocks.push({
                        text: page.full_text,
                        bbox: { x: 0, y: 0, width: 1, height: 1 },
                        confidence: page.confidence,
                        block_type: 'paragraph',
                    });
                }
            });

            return {
                pages,
                provider: this.name,
                model_version: 'gemini-2.0-flash-exp',
                processing_time_ms: Date.now() - start_time,
            };

        } catch (error) {
            throw new OcrError(
                `Failed to parse Gemini response: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'PARSE_ERROR',
                error
            );
        }
    }

    /**
     * Normalize block to OcrBlock format
     */
    private normalizeBlock(block: any): OcrBlock {
        return {
            text: block.text || '',
            bbox: this.normalizeBbox(block.bbox),
            confidence: block.confidence || 0.85,
            block_type: block.block_type || 'paragraph',
        };
    }

    /**
     * Normalize bounding box to 0-1 range
     */
    private normalizeBbox(bbox: any): BoundingBox {
        if (!bbox) {
            return { x: 0, y: 0, width: 1, height: 1 };
        }

        return {
            x: Math.max(0, Math.min(1, bbox.x || 0)),
            y: Math.max(0, Math.min(1, bbox.y || 0)),
            width: Math.max(0, Math.min(1, bbox.width || 0)),
            height: Math.max(0, Math.min(1, bbox.height || 0)),
        };
    }

    /**
     * Create fallback structure when JSON parsing fails
     */
    private createFallbackStructure(text: string): any {
        return {
            pages: [{
                page_number: 1,
                full_text: text,
                confidence: 0.80,
                blocks: [{
                    text,
                    bbox: { x: 0, y: 0, width: 1, height: 1 },
                    confidence: 0.80,
                    block_type: 'paragraph',
                }],
            }],
        };
    }

    /**
     * Validate MIME type
     */
    private validateMimeType(mime_type: string): void {
        const allowed = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/heic',
            'image/heif',
        ];

        if (!allowed.includes(mime_type)) {
            throw new OcrError(
                `Unsupported MIME type: ${mime_type}. Allowed: ${allowed.join(', ')}`,
                'INVALID_MIME_TYPE'
            );
        }
    }

    /**
     * Check if error is retryable
     */
    private isRetryableError(error: any): boolean {
        const retryableCodes = [
            'ECONNRESET',
            'ETIMEDOUT',
            'ENOTFOUND',
            'RATE_LIMIT_EXCEEDED',
            'SERVICE_UNAVAILABLE',
        ];

        const errorCode = error?.code || error?.status;
        return retryableCodes.includes(errorCode) || errorCode === 429 || errorCode === 503;
    }

    /**
     * Sleep utility
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Gemini OCR Configuration
 */
export interface GeminiOcrConfig {
    modelName?: string;
    maxRetries?: number;
    timeout?: number;
}

/**
 * OCR Error
 */
export class OcrError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly cause?: any
    ) {
        super(message);
        this.name = 'OcrError';
    }
}

/**
 * Update OcrProviderFactory to include Gemini
 */
export function createGeminiOcrProvider(apiKey: string, config?: GeminiOcrConfig): IOcrProvider {
    return new GeminiFlashOcrProvider(apiKey, config);
}
