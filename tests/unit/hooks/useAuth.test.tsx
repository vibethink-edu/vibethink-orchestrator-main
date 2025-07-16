/**
 * useAuth Hook Unit Tests
 * 
 * Tests for authentication hook including:
 * - User authentication state
 * - Role-based permissions
 * - Company access validation
 * - Multi-tenant security
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { createMockUser, createMockCompany } from '@tests/setup/vitest-setup';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication State', () => {
    it('should return unauthenticated state initially', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(true);
    });

    it('should return authenticated state with user data', async () => {
      const mockUser = createMockUser();
      const mockCompany = createMockCompany();

      // Mock successful authentication
      vi.mocked(require('@/integrations/supabase/client').supabase.auth.getSession)
        .mockResolvedValue({
          data: { session: { user: mockUser } },
          error: null,
        });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle authentication errors gracefully', async () => {
      // Mock authentication error
      vi.mocked(require('@/integrations/supabase/client').supabase.auth.getSession)
        .mockResolvedValue({
          data: { session: null },
          error: { message: 'Authentication failed' },
        });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeDefined();
    });
  });

  describe('Role-Based Permissions', () => {
    it('should correctly identify admin permissions', () => {
      const mockUser = createMockUser({ role: 'ADMIN' });
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state
      result.current.user = mockUser;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      expect(result.current.hasPermission('ADMIN')).toBe(true);
      expect(result.current.hasPermission('MANAGER')).toBe(true);
      expect(result.current.hasPermission('EMPLOYEE')).toBe(true);
      expect(result.current.hasPermission('OWNER')).toBe(false);
    });

    it('should correctly identify employee permissions', () => {
      const mockUser = createMockUser({ role: 'EMPLOYEE' });
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state
      result.current.user = mockUser;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      expect(result.current.hasPermission('EMPLOYEE')).toBe(true);
      expect(result.current.hasPermission('MANAGER')).toBe(false);
      expect(result.current.hasPermission('ADMIN')).toBe(false);
      expect(result.current.hasPermission('OWNER')).toBe(false);
    });

    it('should correctly identify owner permissions', () => {
      const mockUser = createMockUser({ role: 'OWNER' });
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state
      result.current.user = mockUser;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      expect(result.current.hasPermission('OWNER')).toBe(true);
      expect(result.current.hasPermission('ADMIN')).toBe(true);
      expect(result.current.hasPermission('MANAGER')).toBe(true);
      expect(result.current.hasPermission('EMPLOYEE')).toBe(true);
    });
  });

  describe('Company Access Validation', () => {
    it('should validate company access for authenticated users', () => {
      const mockUser = createMockUser({ company_id: 'test-company-id' });
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state
      result.current.user = mockUser;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      expect(result.current.canAccessCompany('test-company-id')).toBe(true);
      expect(result.current.canAccessCompany('other-company-id')).toBe(false);
    });

    it('should deny company access for unauthenticated users', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canAccessCompany('any-company-id')).toBe(false);
    });
  });

  describe('Authentication Actions', () => {
    it('should handle sign in successfully', async () => {
      const mockUser = createMockUser();
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(require('@/integrations/supabase/client').supabase.auth.signInWithPassword)
        .mockImplementation(mockSignIn);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await result.current.signIn('test@example.com', 'password');

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should handle sign in errors', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });

      vi.mocked(require('@/integrations/supabase/client').supabase.auth.signInWithPassword)
        .mockImplementation(mockSignIn);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.signIn('test@example.com', 'wrong-password'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should handle sign out successfully', async () => {
      const mockSignOut = vi.fn().mockResolvedValue({
        error: null,
      });

      vi.mocked(require('@/integrations/supabase/client').supabase.auth.signOut)
        .mockImplementation(mockSignOut);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await result.current.signOut();

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('Multi-Tenant Security', () => {
    it('should enforce company isolation in data access', () => {
      const mockUser = createMockUser({ company_id: 'company-a' });
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state
      result.current.user = mockUser;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      // Test company-scoped data access
      const companyAData = { company_id: 'company-a', data: 'test' };
      const companyBData = { company_id: 'company-b', data: 'test' };

      expect(result.current.canAccessData(companyAData)).toBe(true);
      expect(result.current.canAccessData(companyBData)).toBe(false);
    });

    it('should handle super admin cross-company access', () => {
      const mockSuperAdmin = createMockUser({ 
        role: 'OWNER',
        email: 'admin@VibeThink.co',
        company_id: 'VibeThink-platform'
      });
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state
      result.current.user = mockSuperAdmin;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      // Super admin should have access to all companies
      const companyAData = { company_id: 'company-a', data: 'test' };
      const companyBData = { company_id: 'company-b', data: 'test' };

      expect(result.current.canAccessData(companyAData)).toBe(true);
      expect(result.current.canAccessData(companyBData)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      vi.mocked(require('@/integrations/supabase/client').supabase.auth.getSession)
        .mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.user).toBeNull();
    });

    it('should handle malformed user data', () => {
      const malformedUser = { id: 'test-id' }; // Missing required fields
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Mock authenticated state with malformed data
      result.current.user = malformedUser as any;
      result.current.isAuthenticated = true;
      result.current.loading = false;

      // Should handle gracefully without crashing
      expect(result.current.hasPermission('ADMIN')).toBe(false);
      expect(result.current.canAccessCompany('test-company')).toBe(false);
    });
  });
}); 