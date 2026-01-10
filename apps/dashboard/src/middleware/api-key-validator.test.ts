import { validateApiKey } from '../api-key-validator';
import { createHash } from 'crypto';

// Basic mock for Supabase
// In a real setup, use a proper mock helper
const mockSelect = jest.fn();
const mockUpdate = jest.fn();
const mockRpc = jest.fn();

const mockSupabase = {
    from: jest.fn(() => ({
        select: mockSelect,
        update: mockUpdate,
    })),
    rpc: mockRpc,
};

jest.mock('@supabase/supabase-js', () => ({
    createClient: () => mockSupabase,
}));

describe('validateApiKey Middleware', () => {
    const validKey = 'vito_test_validkey123';
    const validHash = createHash('sha256').update(validKey).digest('hex');

    const mockKeyRecord = {
        id: 'key-123',
        tenant_id: 'tenant-abc',
        key_hash: validHash,
        is_active: true,
        scopes: ['agents:financial', 'voice:synthesis'],
        allowed_providers: [],
        allowed_models: [],
        expires_at: null,
        max_cost_per_day_cents: 1000,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Default valid response
        mockSelect.mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockKeyRecord, error: null }),
        });
        // Default cost check pass
        mockRpc.mockResolvedValue({ data: 50, error: null });
        mockUpdate.mockResolvedValue({ data: null, error: null });
    });

    test('should return valid result for correct key and scope', async () => {
        const result = await validateApiKey(validKey, 'agents:financial');
        expect(result.isValid).toBe(true);
        expect(result.tenantId).toBe('tenant-abc');
    });

    test('should fail if key is missing', async () => {
        const result = await validateApiKey('', 'agents:financial');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Missing');
    });

    test('should fail if key hash lookup fails', async () => {
        mockSelect.mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        });

        const result = await validateApiKey('invalid_key', 'agents:financial');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid API Key');
    });

    test('should fail if scope is not allowed', async () => {
        // Record only has financial/voice, asking for document
        const result = await validateApiKey(validKey, 'document:ocr');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Scope \'document:ocr\' not authorized');
    });

    test('should enforce daily cost limit', async () => {
        // Mock cost exceeding limit (current 1500 > max 1000)
        mockRpc.mockResolvedValue({ data: 1500, error: null });

        const result = await validateApiKey(validKey, 'agents:financial');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Daily cost limit exceeded');
    });
});
