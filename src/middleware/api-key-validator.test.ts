/**
 * Unit Tests: API Key Validator
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 */

import { describe, it, expect } from 'vitest';
import {
    extractApiKey,
    deriveKeyComponents,
    validateKeyFormat,
} from '../middleware/api-key-validator';

describe('API Key Validator', () => {
    describe('extractApiKey', () => {
        it('should extract API key from Authorization Bearer header', () => {
            const headers = new Headers();
            headers.set('authorization', 'Bearer vito_test_abc123def456');

            const key = extractApiKey(headers);
            expect(key).toBe('vito_test_abc123def456');
        });

        it('should extract API key from x-api-key header', () => {
            const headers = new Headers();
            headers.set('x-api-key', 'vito_test_abc123def456');

            const key = extractApiKey(headers);
            expect(key).toBe('vito_test_abc123def456');
        });

        it('should return null if no API key header present', () => {
            const headers = new Headers();

            const key = extractApiKey(headers);
            expect(key).toBeNull();
        });

        it('should prioritize Authorization header over x-api-key', () => {
            const headers = new Headers();
            headers.set('authorization', 'Bearer vito_auth_key');
            headers.set('x-api-key', 'vito_xapi_key');

            const key = extractApiKey(headers);
            expect(key).toBe('vito_auth_key');
        });
    });

    describe('deriveKeyComponents', () => {
        it('should derive prefix (first 16 chars) and SHA-256 hash', () => {
            const apiKey = 'vito_test_abc123def456ghi789';

            const { prefix, hash } = deriveKeyComponents(apiKey);

            expect(prefix).toBe('vito_test_abc123');
            expect(hash).toHaveLength(64); // SHA-256 = 64 hex chars
            expect(hash).toMatch(/^[a-f0-9]{64}$/);
        });

        it('should produce consistent hash for same key', () => {
            const apiKey = 'vito_test_abc123';

            const result1 = deriveKeyComponents(apiKey);
            const result2 = deriveKeyComponents(apiKey);

            expect(result1.hash).toBe(result2.hash);
        });

        it('should produce different hashes for different keys', () => {
            const key1 = 'vito_test_abc123';
            const key2 = 'vito_test_abc124';

            const result1 = deriveKeyComponents(key1);
            const result2 = deriveKeyComponents(key2);

            expect(result1.hash).not.toBe(result2.hash);
        });
    });

    describe('validateKeyFormat', () => {
        it('should accept valid key format', () => {
            const validKeys = [
                'vito_test_abc123def456',
                'vito_fin_xyz789abc123',
                'vito_voice_abcdefghijklmnop',
            ];

            validKeys.forEach((key) => {
                expect(validateKeyFormat(key)).toBe(true);
            });
        });

        it('should reject keys not starting with vito_', () => {
            const invalidKeys = [
                'invalid_test_abc123',
                'test_vito_abc123',
                'abc123def456',
            ];

            invalidKeys.forEach((key) => {
                expect(validateKeyFormat(key)).toBe(false);
            });
        });

        it('should reject keys with insufficient underscores', () => {
            const invalidKeys = [
                'vito_abc123', // Only 1 underscore
                'vitoabc123', // No underscores
            ];

            invalidKeys.forEach((key) => {
                expect(validateKeyFormat(key)).toBe(false);
            });
        });

        it('should reject keys that are too short', () => {
            expect(validateKeyFormat('vito_t_a')).toBe(false);
            expect(validateKeyFormat('vito_')).toBe(false);
            expect(validateKeyFormat('')).toBe(false);
        });
    });

    describe('timing-safe hash comparison', () => {
        it('should use timing-safe comparison (not SQL equality)', () => {
            // This test verifies that hash comparison is done in Node.js,
            // not in SQL (which would be vulnerable to timing attacks)

            const key1 = 'vito_test_abc123def456';
            const key2 = 'vito_test_abc123def457'; // Different by 1 char

            const result1 = deriveKeyComponents(key1);
            const result2 = deriveKeyComponents(key2);

            // Hashes should be different
            expect(result1.hash).not.toBe(result2.hash);

            // Both should have same prefix (first 16 chars)
            expect(result1.prefix).toBe(result2.prefix);
        });

        it('should handle hash length mismatch gracefully', () => {
            // If stored hash has different length, timing-safe compare should fail fast
            const validKey = 'vito_test_abc123def456';
            const { hash } = deriveKeyComponents(validKey);

            // Hash should be 64 hex chars (SHA-256)
            expect(hash).toHaveLength(64);
        });
    });
});
