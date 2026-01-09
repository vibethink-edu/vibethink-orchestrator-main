/**
 * RLS Tenant Context Tests
 * 
 * Validates that RLS tenant context is properly enforced:
 * - is_local=true for transaction isolation
 * - Fail-fast if context cannot be set
 * - No DB operations without tenant context
 * 
 * @module document-intelligence/tests/rls-tenant-context
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabasePersistenceAdapter, PersistenceError } from '../infra/persistence.adapter.js';

describe('RLS Tenant Context', () => {
    describe('Fail-Fast Enforcement', () => {
        it('should throw if tenant context cannot be set', async () => {
            // Mock Supabase client to fail on set_config
            const mockSupabase = {
                rpc: vi.fn(() => Promise.resolve({
                    error: { message: 'RPC failed' },
                })),
                from: vi.fn(),
            } as any;

            const adapter = new SupabasePersistenceAdapter(mockSupabase);

            // Attempt to create a job (which calls setTenantContext internally)
            await expect(
                adapter.createDocumentJob({
                    id: 'job-123',
                    tenant_id: 'tenant-456',
                    integration_id: 'integration-789',
                    document_profile_id: 'profile-abc',
                    original_filename: 'test.pdf',
                    mime_type: 'application/pdf',
                    file_size_bytes: 1024,
                    storage_path: 's3://bucket/key',
                    status: 'pending',
                    correlation_id: 'corr-xyz',
                })
            ).rejects.toThrow('RLS tenant context not set');

            // Verify set_config was called with is_local=true
            expect(mockSupabase.rpc).toHaveBeenCalledWith('set_config', {
                setting: 'app.current_tenant_id',
                value: 'tenant-456',
                is_local: true, // CRITICAL: Must be true
            });
        });

        it('should NOT execute DB operations if tenant context fails', async () => {
            // Mock Supabase client to fail on set_config
            const mockFrom = vi.fn();
            const mockSupabase = {
                rpc: vi.fn(() => Promise.resolve({
                    error: { message: 'RPC failed' },
                })),
                from: mockFrom,
            } as any;

            const adapter = new SupabasePersistenceAdapter(mockSupabase);

            // Attempt to create a job
            try {
                await adapter.createDocumentJob({
                    id: 'job-123',
                    tenant_id: 'tenant-456',
                    integration_id: 'integration-789',
                    document_profile_id: 'profile-abc',
                    original_filename: 'test.pdf',
                    mime_type: 'application/pdf',
                    file_size_bytes: 1024,
                    storage_path: 's3://bucket/key',
                    status: 'pending',
                    correlation_id: 'corr-xyz',
                });

                // Should not reach here
                expect(true).toBe(false);
            } catch (error) {
                // Verify error was thrown
                expect((error as Error).message).toContain('RLS tenant context not set');

                // Verify NO DB operations were attempted
                expect(mockFrom).not.toHaveBeenCalled();
            }
        });
    });

    describe('Transaction Isolation (is_local=true)', () => {
        it('should use is_local=true for tenant context', async () => {
            // Mock Supabase client to succeed on set_config
            const mockRpc = vi.fn(() => Promise.resolve({ error: null }));
            const mockSupabase = {
                rpc: mockRpc,
                from: vi.fn(() => ({
                    insert: vi.fn(() => Promise.resolve({ error: null })),
                })),
            } as any;

            const adapter = new SupabasePersistenceAdapter(mockSupabase);

            // Create a job
            await adapter.createDocumentJob({
                id: 'job-123',
                tenant_id: 'tenant-456',
                integration_id: 'integration-789',
                document_profile_id: 'profile-abc',
                original_filename: 'test.pdf',
                mime_type: 'application/pdf',
                file_size_bytes: 1024,
                storage_path: 's3://bucket/key',
                status: 'pending',
                correlation_id: 'corr-xyz',
            });

            // Verify set_config was called with is_local=true
            expect(mockRpc).toHaveBeenCalledWith('set_config', {
                setting: 'app.current_tenant_id',
                value: 'tenant-456',
                is_local: true,
            });
        });
    });

    describe('Multi-Tenant Isolation', () => {
        it('should set different tenant contexts for different operations', async () => {
            // Mock Supabase client
            const mockRpc = vi.fn(() => Promise.resolve({ error: null }));
            const mockSupabase = {
                rpc: mockRpc,
                from: vi.fn(() => ({
                    insert: vi.fn(() => Promise.resolve({ error: null })),
                })),
            } as any;

            const adapter = new SupabasePersistenceAdapter(mockSupabase);

            // Create job for tenant-A
            await adapter.createDocumentJob({
                id: 'job-a',
                tenant_id: 'tenant-a',
                integration_id: 'integration-789',
                document_profile_id: 'profile-abc',
                original_filename: 'test.pdf',
                mime_type: 'application/pdf',
                file_size_bytes: 1024,
                storage_path: 's3://bucket/key',
                status: 'pending',
                correlation_id: 'corr-xyz',
            });

            // Create job for tenant-b
            await adapter.createDocumentJob({
                id: 'job-b',
                tenant_id: 'tenant-b',
                integration_id: 'integration-789',
                document_profile_id: 'profile-abc',
                original_filename: 'test.pdf',
                mime_type: 'application/pdf',
                file_size_bytes: 1024,
                storage_path: 's3://bucket/key',
                status: 'pending',
                correlation_id: 'corr-xyz',
            });

            // Verify set_config was called twice with different tenant_ids
            expect(mockRpc).toHaveBeenCalledTimes(2);
            expect(mockRpc).toHaveBeenNthCalledWith(1, 'set_config', {
                setting: 'app.current_tenant_id',
                value: 'tenant-a',
                is_local: true,
            });
            expect(mockRpc).toHaveBeenNthCalledWith(2, 'set_config', {
                setting: 'app.current_tenant_id',
                value: 'tenant-b',
                is_local: true,
            });
        });
    });
});
