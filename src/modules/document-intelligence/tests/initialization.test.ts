
import { describe, it, expect, vi } from 'vitest';
import { initializeDocumentIntelligence, ModuleConfig } from '../index.js';
import type {
    IStorageAdapter,
    IPersistenceAdapter,
    IAuditService,
    IQueueService,
    IReviewPersistenceAdapter
} from '../index.js';

describe('DocumentIntelligence Module Initialization', () => {
    // Strictly typed mocks implementation

    const mockStorageAdapter: IStorageAdapter = {
        uploadFile: vi.fn(),
        downloadFile: vi.fn(),
        deleteFile: vi.fn(),
    };

    const mockPersistenceAdapter: IPersistenceAdapter = {
        getDocumentProfile: vi.fn(),
        createDocumentJob: vi.fn(),
        updateJobStatus: vi.fn(),
    };

    const mockReviewPersistenceAdapter: IReviewPersistenceAdapter = {
        getDocumentItem: vi.fn(),
        createReview: vi.fn(),
        markItemAsReviewed: vi.fn(),
        getReviewQueue: vi.fn(),
    };

    const mockAuditService: IAuditService = {
        emitEvent: vi.fn(),
    };

    const mockQueueService: IQueueService = {
        enqueue: vi.fn(),
    };

    const baseConfig: Omit<ModuleConfig, 'reviewPersistenceAdapter'> = {
        ocrProvider: 'tesseract',
        storageAdapter: mockStorageAdapter,
        persistenceAdapter: mockPersistenceAdapter,
        auditService: mockAuditService,
        queueService: mockQueueService,
    };

    it('should throw explicit error when reviewPersistenceAdapter is missing', () => {
        expect(() => {
            // @ts-expect-error: Testing runtime validation fail-fast
            initializeDocumentIntelligence(baseConfig);
        }).toThrow('DocumentIntelligence Module Initialization Failure: reviewPersistenceAdapter is required.');
    });

    it('should initialize successfully when reviewPersistenceAdapter is provided', () => {
        const config: ModuleConfig = {
            ...baseConfig,
            reviewPersistenceAdapter: mockReviewPersistenceAdapter,
        };

        const module = initializeDocumentIntelligence(config);

        expect(module).toBeDefined();
        expect(module.ingestService).toBeDefined();
        expect(module.extractionService).toBeDefined();
        expect(module.reviewService).toBeDefined();
        expect(module.ocrProvider).toBeDefined();
    });
});
