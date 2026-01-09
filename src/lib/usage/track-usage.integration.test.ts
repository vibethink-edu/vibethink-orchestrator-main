/**
 * Integration Tests: Usage Tracking - Billing Critical Flows
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 * 
 * CRITICAL: These tests verify anti-double-charge and billing integrity
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackUsage, normalizeEndpoint } from '../lib/usage/track-usage';

// Mock Supabase client
const mockInsert = vi.fn();
const mockUpsert = vi.fn();
const mockFrom = vi.fn(() => ({
    insert: mockInsert,
    upsert: mockUpsert,
}));

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        from: mockFrom,
    })),
}));

describe('Usage Tracking - Billing Critical', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Event Idempotency (Anti-Double-Charge)', () => {
        it('should ignore duplicate request_id and not create duplicate billing events', async () => {
            const params = {
                tenantId: 'tenant-123',
                apiKeyId: 'key-456',
                requestId: 'req-duplicate-test',
                method: 'POST',
                endpoint: '/v1/agents/invoke',
                statusCode: 200,
                workloadClass: 'agents',
                meterKey: 'agent_step',
                meterQty: 5,
                costUsdMicros: 1500,
            };

            // First call: success
            mockInsert.mockResolvedValueOnce({ error: null });
            await trackUsage(params, 'event');
            expect(mockInsert).toHaveBeenCalledTimes(1);

            // Second call with same request_id: PostgreSQL unique violation (23505)
            mockInsert.mockResolvedValueOnce({
                error: { code: '23505', message: 'duplicate key value violates unique constraint' },
            });

            // Should NOT throw, should silently ignore
            await expect(trackUsage(params, 'event')).resolves.not.toThrow();
            expect(mockInsert).toHaveBeenCalledTimes(2);

            // Verify: Only 1 event should be created (second call ignored)
            const insertCalls = mockInsert.mock.calls;
            expect(insertCalls[0][0].request_id).toBe('req-duplicate-test');
            expect(insertCalls[1][0].request_id).toBe('req-duplicate-test');
        });

        it('should throw on non-idempotency errors', async () => {
            const params = {
                tenantId: 'tenant-123',
                apiKeyId: 'key-456',
                requestId: 'req-error-test',
                method: 'POST',
                endpoint: '/v1/agents/invoke',
                statusCode: 200,
            };

            // Simulate non-23505 error (e.g., network error)
            mockInsert.mockResolvedValueOnce({
                error: { code: '08006', message: 'connection failure' },
            });

            // Should NOT throw (usage tracking should not break requests)
            await expect(trackUsage(params, 'event')).resolves.not.toThrow();
        });
    });

    describe('Daily Upsert (Billing Aggregation)', () => {
        it('should aggregate on conflict with full PK (tenant+key+day+method+endpoint+workload+meter)', async () => {
            const params = {
                tenantId: 'tenant-123',
                apiKeyId: 'key-456',
                requestId: 'req-1',
                method: 'POST',
                endpoint: '/v1/agents/invoke',
                statusCode: 200,
                workloadClass: 'agents',
                meterKey: 'agent_step',
                meterQty: 5,
                costUsdMicros: 1500,
            };

            mockUpsert.mockResolvedValueOnce({ error: null });

            await trackUsage(params, 'daily');

            expect(mockUpsert).toHaveBeenCalledTimes(1);
            const upsertCall = mockUpsert.mock.calls[0];

            // Verify upsert data
            expect(upsertCall[0]).toMatchObject({
                tenant_id: 'tenant-123',
                api_key_id: 'key-456',
                method: 'POST',
                endpoint_normalized: '/v1/agents/invoke',
                workload_class: 'agents',
                meter_key: 'agent_step',
                request_count: 1,
                error_count: 0,
                meter_qty_total: 5,
                cost_usd_micros_total: 1500,
            });

            // Verify onConflict includes ALL PK columns
            expect(upsertCall[1].onConflict).toBe(
                'tenant_id,api_key_id,day,method,endpoint_normalized,workload_class,meter_key'
            );
            expect(upsertCall[1].ignoreDuplicates).toBe(false); // Must aggregate, not ignore
        });

        it('should increment error_count for status >= 400', async () => {
            const params = {
                tenantId: 'tenant-123',
                apiKeyId: 'key-456',
                requestId: 'req-error',
                method: 'POST',
                endpoint: '/v1/agents/invoke',
                statusCode: 500, // Error
                workloadClass: 'agents',
                meterKey: 'agent_step',
            };

            mockUpsert.mockResolvedValueOnce({ error: null });

            await trackUsage(params, 'daily');

            const upsertCall = mockUpsert.mock.calls[0];
            expect(upsertCall[0].error_count).toBe(1);
            expect(upsertCall[0].request_count).toBe(1);
        });
    });

    describe('Endpoint Normalization (Billing Consistency)', () => {
        it('should normalize numeric IDs', () => {
            expect(normalizeEndpoint('/v1/reviews/123')).toBe('/v1/reviews/:id');
        });

        it('should normalize UUIDs', () => {
            expect(normalizeEndpoint('/v1/docs/550e8400-e29b-41d4-a716-446655440000')).toBe('/v1/docs/:id');
        });

        it('should normalize alphanumeric IDs', () => {
            expect(normalizeEndpoint('/v1/sessions/abc123def')).toBe('/v1/sessions/:id');
        });

        it('should preserve non-ID segments', () => {
            expect(normalizeEndpoint('/v1/users/me')).toBe('/v1/users/me');
        });

        it('should handle mixed ID types', () => {
            expect(normalizeEndpoint('/v1/tenants/550e8400-e29b-41d4-a716-446655440000/users/123/posts/abc456'))
                .toBe('/v1/tenants/:id/users/:id/posts/:id');
        });
    });
});
