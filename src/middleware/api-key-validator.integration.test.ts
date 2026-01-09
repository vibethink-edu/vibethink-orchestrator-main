/**
 * Integration Tests: API Key Validator - Security Critical Flows
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 * 
 * CRITICAL: These tests verify scope validation and timing-safe selection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateApiKey, deriveKeyComponents } from '../middleware/api-key-validator';

// Mock Supabase client
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn(() => ({
    select: mockSelect,
}));

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        from: mockFrom,
    })),
}));

describe('API Key Validator - Security Critical', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup mock chain
        mockSelect.mockReturnValue({ eq: mockEq });
        mockEq.mockReturnValue({ eq: mockEq, limit: mockLimit });
        mockLimit.mockReturnValue({ eq: mockEq });
    });

    describe('Scope Validation (401/403 Scenarios)', () => {
        it('should return 403 on scope mismatch', async () => {
            const apiKey = 'vito_test_abc123def456ghi789';
            const { prefix, hash } = deriveKeyComponents(apiKey);

            // Mock: Key exists with scope "agents:financial"
            mockLimit.mockResolvedValueOnce({
                data: [{
                    id: 'key-123',
                    tenant_id: 'tenant-456',
                    key_name: 'Test Key',
                    key_hash: hash,
                    scopes: ['agents:financial'],
                    allowed_models: [],
                    allowed_providers: [],
                    is_active: true,
                    expires_at: null,
                    rate_limit_per_minute: 60,
                    rate_limit_per_day: 10000,
                    max_cost_per_day_cents: null,
                    max_cost_per_month_cents: null,
                }],
                error: null,
            });

            // Validate against different scope
            const result = await validateApiKey(apiKey, 'voice:synthesis');

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Insufficient scope');
            expect(result.error).toContain('voice:synthesis');
        });

        it('should return 401 on invalid key (not found)', async () => {
            const apiKey = 'vito_test_invalid_key';

            // Mock: No keys found
            mockLimit.mockResolvedValueOnce({
                data: [],
                error: null,
            });

            const result = await validateApiKey(apiKey, 'agents:financial');

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('API key not found or inactive');
        });

        it('should return 401 on expired key', async () => {
            const apiKey = 'vito_test_expired_key';
            const { hash } = deriveKeyComponents(apiKey);

            // Mock: Key exists but expired
            mockLimit.mockResolvedValueOnce({
                data: [{
                    id: 'key-123',
                    tenant_id: 'tenant-456',
                    key_hash: hash,
                    scopes: ['agents:financial'],
                    allowed_models: [],
                    allowed_providers: [],
                    is_active: true,
                    expires_at: '2020-01-01T00:00:00Z', // Past date
                    rate_limit_per_minute: 60,
                    rate_limit_per_day: 10000,
                    max_cost_per_day_cents: null,
                    max_cost_per_month_cents: null,
                }],
                error: null,
            });

            const result = await validateApiKey(apiKey, 'agents:financial');

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('API key expired');
        });

        it('should pass with correct scope', async () => {
            const apiKey = 'vito_test_valid_key';
            const { hash } = deriveKeyComponents(apiKey);

            // Mock: Key exists with correct scope
            mockLimit.mockResolvedValueOnce({
                data: [{
                    id: 'key-123',
                    tenant_id: 'tenant-456',
                    key_hash: hash,
                    scopes: ['agents:financial', 'voice:synthesis'],
                    allowed_models: [],
                    allowed_providers: [],
                    is_active: true,
                    expires_at: null,
                    rate_limit_per_minute: 60,
                    rate_limit_per_day: 10000,
                    max_cost_per_day_cents: null,
                    max_cost_per_month_cents: null,
                }],
                error: null,
            });

            const result = await validateApiKey(apiKey, 'agents:financial');

            expect(result.isValid).toBe(true);
            expect(result.tenantId).toBe('tenant-456');
            expect(result.keyId).toBe('key-123');
            expect(result.scopes).toContain('agents:financial');
        });
    });

    describe('Timing-Safe Selection (Multiple Candidates)', () => {
        it('should select correct key from multiple candidates with same prefix', async () => {
            const apiKey = 'vito_test_abc123def456ghi789';
            const { prefix, hash } = deriveKeyComponents(apiKey);

            // Mock: Multiple keys with same prefix (collision scenario)
            const wrongHash = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

            mockLimit.mockResolvedValueOnce({
                data: [
                    {
                        id: 'key-wrong-1',
                        tenant_id: 'tenant-456',
                        key_hash: wrongHash,
                        scopes: ['agents:financial'],
                        allowed_models: [],
                        allowed_providers: [],
                        is_active: true,
                        expires_at: null,
                        rate_limit_per_minute: 60,
                        rate_limit_per_day: 10000,
                        max_cost_per_day_cents: null,
                        max_cost_per_month_cents: null,
                    },
                    {
                        id: 'key-correct',
                        tenant_id: 'tenant-456',
                        key_hash: hash, // Correct hash
                        scopes: ['agents:financial'],
                        allowed_models: [],
                        allowed_providers: [],
                        is_active: true,
                        expires_at: null,
                        rate_limit_per_minute: 60,
                        rate_limit_per_day: 10000,
                        max_cost_per_day_cents: null,
                        max_cost_per_month_cents: null,
                    },
                    {
                        id: 'key-wrong-2',
                        tenant_id: 'tenant-456',
                        key_hash: wrongHash,
                        scopes: ['agents:financial'],
                        allowed_models: [],
                        allowed_providers: [],
                        is_active: true,
                        expires_at: null,
                        rate_limit_per_minute: 60,
                        rate_limit_per_day: 10000,
                        max_cost_per_day_cents: null,
                        max_cost_per_month_cents: null,
                    },
                ],
                error: null,
            });

            const result = await validateApiKey(apiKey, 'agents:financial');

            expect(result.isValid).toBe(true);
            expect(result.keyId).toBe('key-correct'); // Should select the correct one
        });

        it('should return 401 if no hash matches (timing-safe)', async () => {
            const apiKey = 'vito_test_nomatch_key';
            const wrongHash = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

            mockLimit.mockResolvedValueOnce({
                data: [
                    {
                        id: 'key-wrong',
                        tenant_id: 'tenant-456',
                        key_hash: wrongHash,
                        scopes: ['agents:financial'],
                        allowed_models: [],
                        allowed_providers: [],
                        is_active: true,
                        expires_at: null,
                        rate_limit_per_minute: 60,
                        rate_limit_per_day: 10000,
                        max_cost_per_day_cents: null,
                        max_cost_per_month_cents: null,
                    },
                ],
                error: null,
            });

            const result = await validateApiKey(apiKey, 'agents:financial');

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('API key not found or inactive');
        });
    });
});
