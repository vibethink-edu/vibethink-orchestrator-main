/**
 * Document Intelligence Module
 * 
 * PUBLIC API EXPORTS
 * 
 * This module provides domain-agnostic document processing capabilities:
 * - OCR + semantic extraction
 * - Evidence-based item extraction
 * - Human review (non-destructive)
 * - Multi-tenant isolation
 * - Vendor-agnostic OCR providers
 * 
 * @module document-intelligence
 * @version 1.0.0
 */

// ========== CONTRACTS (Public Types) ==========

export type {
    DocumentJob,
    DocumentJobStatus,
    CreateDocumentJobInput,
    DocumentJobResponse,
} from './contracts/document.js';

export type {
    DocumentProfile,
    ProfileApplicationResult,
} from './contracts/document-profile.js';

export {
    BUILTIN_PROFILES,
    EXAMPLE_CLINICAL_PRESCRIPTION_PROFILE,
    EXAMPLE_INVOICE_PROFILE,
} from './contracts/document-profile.js';

export type {
    DocumentItem,
    CreateDocumentItemInput,
    DocumentItemResponse,
    BoundingBox,
    ItemEvidence,
    ItemFlags,
    ConfidenceLayers,
} from './contracts/document-item.js';

export {
    calculateOverallConfidence,
    shouldFlagForReview,
} from './contracts/document-item.js';

export type {
    HumanReview,
    ReviewStatus,
    SubmitReviewInput,
    ReviewResponse,
    ReviewQueueItem,
    ReviewMetrics,
} from './contracts/human-review.js';

export {
    determineReviewPriority,
    generateReviewReason,
} from './contracts/human-review.js';

// ========== SERVICES (Public API) ==========

export {
    IngestService,
    ValidationError,
    AuthorizationError,
    StorageError,
} from './services/ingest.service.js';

export type {
    IStorageAdapter,
    IPersistenceAdapter,
    IAuditService,
    IQueueService,
} from './services/ingest.service.js';

export {
    GoogleVisionProvider,
    AwsTextractProvider,
    TesseractProvider,
    OcrProviderFactory,
} from './services/ocr.provider.js';

export type {
    IOcrProvider,
    OcrResult,
    OcrPage,
    OcrBlock,
    OcrProviderConfig,
} from './services/ocr.provider.js';

export {
    ExtractionService,
} from './services/extraction.service.js';

export {
    ReviewService,
} from './services/review.service.js';

export type {
    IReviewPersistenceAdapter,
} from './services/review.service.js';

// ========== MODULE METADATA ==========

export const MODULE_INFO = {
    name: 'document-intelligence',
    version: '1.0.0',
    status: 'Phase 1 MVP',
    description: 'Domain-agnostic document processing with OCR + semantic extraction',
    capabilities: [
        'Document ingestion',
        'Vendor-agnostic OCR',
        'Profile-driven extraction',
        'Human review (non-destructive)',
        'Multi-tenant isolation',
        'Audit trail',
    ],
    supported_domains: [
        'Medical (prescriptions, lab results)',
        'Accounting (invoices, receipts)',
        'Legal (contracts, agreements)',
        'Expenses (expense reports)',
        'Custom (via Document Profiles)',
    ],
} as const;

/**
 * Module initialization
 * 
 * @example
 * ```typescript
 * import { initializeDocumentIntelligence } from '@vito/document-intelligence';
 * 
 * const module = initializeDocumentIntelligence({
 *   ocrProvider: 'google_vision',
 *   googleApiKey: process.env.GOOGLE_VISION_API_KEY,
 *   storageAdapter: s3Adapter,
 *   persistenceAdapter: dbAdapter,
 *   auditService: auditService,
 *   queueService: queueService,
 * });
 * 
 * // Ingest a document
 * const response = await module.ingestService.ingestDocument({
 *   tenant_id: 'tenant-123',
 *   integration_id: 'integration-456',
 *   document_profile_id: 'clinical-prescription-v1',
 *   file: pdfBuffer,
 *   original_filename: 'prescription.pdf',
 *   mime_type: 'application/pdf',
 * });
 * ```
 */
export function initializeDocumentIntelligence(config: ModuleConfig): DocumentIntelligenceModule {
    // Create OCR provider
    const ocrProvider = OcrProviderFactory.create({
        provider: config.ocrProvider,
        google_api_key: config.googleApiKey,
        aws_access_key_id: config.awsAccessKeyId,
        aws_secret_access_key: config.awsSecretAccessKey,
        aws_region: config.awsRegion,
    });

    // Create services
    const ingestService = new IngestService(
        config.storageAdapter,
        config.persistenceAdapter,
        config.auditService,
        config.queueService
    );

    const extractionService = new ExtractionService();

    const reviewService = new ReviewService(
        config.persistenceAdapter as unknown as IReviewPersistenceAdapter,
        config.auditService
    );

    return {
        ingestService,
        extractionService,
        reviewService,
        ocrProvider,
    };
}

// ========== MODULE CONFIGURATION ==========

export interface ModuleConfig {
    // OCR Provider
    ocrProvider: 'google_vision' | 'aws_textract' | 'tesseract';
    googleApiKey?: string;
    awsAccessKeyId?: string;
    awsSecretAccessKey?: string;
    awsRegion?: string;

    // Infrastructure Adapters
    storageAdapter: IStorageAdapter;
    persistenceAdapter: IPersistenceAdapter;
    auditService: IAuditService;
    queueService: IQueueService;
}

export interface DocumentIntelligenceModule {
    ingestService: IngestService;
    extractionService: ExtractionService;
    reviewService: ReviewService;
    ocrProvider: IOcrProvider;
}
