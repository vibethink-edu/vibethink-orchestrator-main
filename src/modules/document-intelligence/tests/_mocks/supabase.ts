/**
 * Supabase Client Mocks - Strictly Typed
 * 
 * Provides type-safe mocks for Supabase client used in tests.
 * 
 * CRITICAL:
 * - NO `as any` usage
 * - Minimal interface subset (only what we use)
 * - Compatible with Vitest vi.fn()
 * - Reusable across all tests
 * 
 * @module document-intelligence/tests/_mocks/supabase
 */

import { vi, type Mock } from 'vitest';

/**
 * Minimal Supabase RPC Response
 */
export interface MockRpcResponse<T = unknown> {
    data: T | null;
    error: { message: string; code?: string } | null;
}

/**
 * Minimal Supabase Query Response
 */
export interface MockQueryResponse<T = unknown> {
    data: T | null;
    error: { message: string; code?: string } | null;
}

/**
 * Minimal Supabase Query Builder Chain
 */
export interface MockQueryBuilder<T = unknown> {
    select: Mock<[], MockQueryBuilder<T>>;
    insert: Mock<[data: unknown], MockQueryBuilder<T>>;
    update: Mock<[data: unknown], MockQueryBuilder<T>>;
    delete: Mock<[], MockQueryBuilder<T>>;
    eq: Mock<[column: string, value: unknown], MockQueryBuilder<T>>;
    or: Mock<[query: string], MockQueryBuilder<T>>;
    is: Mock<[column: string, value: unknown], MockQueryBuilder<T>>;
    order: Mock<[column: string, options?: { ascending: boolean }], MockQueryBuilder<T>>;
    limit: Mock<[count: number], MockQueryBuilder<T>>;
    single: Mock<[], Promise<MockQueryResponse<T>>>;
    then: Mock<[onfulfilled: (value: MockQueryResponse<T>) => unknown], Promise<unknown>>;
}

/**
 * Minimal Supabase Client
 */
export interface MockSupabaseClient {
    rpc: Mock<[method: string, params?: Record<string, unknown>], Promise<MockRpcResponse>>;
    from: Mock<[table: string], MockQueryBuilder>;
}

/**
 * Create a mock query builder chain
 */
export function createMockQueryBuilder<T = unknown>(
    finalResponse: MockQueryResponse<T>
): MockQueryBuilder<T> {
    const builder: MockQueryBuilder<T> = {
        select: vi.fn(() => builder),
        insert: vi.fn(() => builder),
        update: vi.fn(() => builder),
        delete: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        or: vi.fn(() => builder),
        is: vi.fn(() => builder),
        order: vi.fn(() => builder),
        limit: vi.fn(() => builder),
        single: vi.fn(() => Promise.resolve(finalResponse)),
        then: vi.fn((onfulfilled) => Promise.resolve(finalResponse).then(onfulfilled)),
    };

    return builder;
}

/**
 * Create a mock Supabase client
 * 
 * @param overrides - Optional overrides for rpc and from
 * @returns Strictly typed mock Supabase client
 */
export function createMockSupabaseClient(overrides?: {
    rpc?: Mock<[method: string, params?: Record<string, unknown>], Promise<MockRpcResponse>>;
    from?: Mock<[table: string], MockQueryBuilder>;
}): MockSupabaseClient {
    return {
        rpc: overrides?.rpc ?? vi.fn(() => Promise.resolve({ data: null, error: null })),
        from: overrides?.from ?? vi.fn(() => createMockQueryBuilder({ data: null, error: null })),
    };
}

/**
 * Create a mock RPC that succeeds
 */
export function createMockRpcSuccess(): Mock<[method: string, params?: Record<string, unknown>], Promise<MockRpcResponse>> {
    return vi.fn(() => Promise.resolve({ data: null, error: null }));
}

/**
 * Create a mock RPC that fails
 */
export function createMockRpcFailure(errorMessage: string): Mock<[method: string, params?: Record<string, unknown>], Promise<MockRpcResponse>> {
    return vi.fn(() => Promise.resolve({ data: null, error: { message: errorMessage } }));
}

/**
 * Create a mock query builder that succeeds
 */
export function createMockQuerySuccess<T = unknown>(data: T): MockQueryBuilder<T> {
    return createMockQueryBuilder({ data, error: null });
}

/**
 * Create a mock query builder that fails
 */
export function createMockQueryFailure<T = unknown>(errorMessage: string): MockQueryBuilder<T> {
    return createMockQueryBuilder({ data: null, error: { message: errorMessage } });
}
