/**
 * Unit Tests: Usage Tracking
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 */

import { describe, it, expect } from 'vitest';
import { normalizeEndpoint } from '../lib/usage/track-usage';

describe('Usage Tracking', () => {
    describe('normalizeEndpoint', () => {
        it('should replace numeric IDs with :id', () => {
            const testCases = [
                { input: '/v1/reviews/123', expected: '/v1/reviews/:id' },
                { input: '/v1/users/456/posts/789', expected: '/v1/users/:id/posts/:id' },
                { input: '/api/documents/999', expected: '/api/documents/:id' },
            ];

            testCases.forEach(({ input, expected }) => {
                expect(normalizeEndpoint(input)).toBe(expected);
            });
        });

        it('should replace UUIDs with :id', () => {
            const testCases = [
                {
                    input: '/v1/docs/550e8400-e29b-41d4-a716-446655440000',
                    expected: '/v1/docs/:id',
                },
                {
                    input: '/v1/users/123e4567-e89b-12d3-a456-426614174000/profile',
                    expected: '/v1/users/:id/profile',
                },
            ];

            testCases.forEach(({ input, expected }) => {
                expect(normalizeEndpoint(input)).toBe(expected);
            });
        });

        it('should replace alphanumeric IDs with :id', () => {
            const testCases = [
                { input: '/v1/reviews/abc123def', expected: '/v1/reviews/:id' },
                { input: '/v1/sessions/xyz789abc', expected: '/v1/sessions/:id' },
            ];

            testCases.forEach(({ input, expected }) => {
                expect(normalizeEndpoint(input)).toBe(expected);
            });
        });

        it('should preserve non-ID segments', () => {
            const testCases = [
                { input: '/v1/users/me', expected: '/v1/users/me' },
                { input: '/v1/reviews/latest', expected: '/v1/reviews/latest' },
                { input: '/api/health', expected: '/api/health' },
            ];

            testCases.forEach(({ input, expected }) => {
                expect(normalizeEndpoint(input)).toBe(expected);
            });
        });

        it('should handle query strings', () => {
            const testCases = [
                {
                    input: '/v1/reviews/123?page=1&limit=10',
                    expected: '/v1/reviews/:id',
                },
                {
                    input: '/v1/users?filter=active',
                    expected: '/v1/users',
                },
            ];

            testCases.forEach(({ input, expected }) => {
                expect(normalizeEndpoint(input)).toBe(expected);
            });
        });

        it('should handle mixed ID types', () => {
            const input = '/v1/tenants/550e8400-e29b-41d4-a716-446655440000/users/123/posts/abc456';
            const expected = '/v1/tenants/:id/users/:id/posts/:id';

            expect(normalizeEndpoint(input)).toBe(expected);
        });

        it('should handle root path', () => {
            expect(normalizeEndpoint('/')).toBe('/');
        });

        it('should handle paths without IDs', () => {
            const testCases = [
                { input: '/v1/health', expected: '/v1/health' },
                { input: '/api/status', expected: '/api/status' },
                { input: '/v1/users/search', expected: '/v1/users/search' },
            ];

            testCases.forEach(({ input, expected }) => {
                expect(normalizeEndpoint(input)).toBe(expected);
            });
        });
    });
});
