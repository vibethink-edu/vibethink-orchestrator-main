/**
 * 🔒 Multitenant Hook - Mock Implementation
 * 
 * Mock multitenant context for UI development.
 * Replace with actual authentication and company context.
 * 
 * Provides:
 * - User context (role, name, email, avatar)
 * - Company context (theme, branding, features)
 * - Theme overrides for company-specific styling
 */

"use client";

import { useMemo } from "react";

// 🎯 TYPES
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  themePreset?: string;
  contentLayout?: 'default' | 'centered';
  branding?: {
    logo?: string;
    primaryColor?: string;
  };
}

export interface Theme {
  preset: string;
  mode: 'light' | 'dark' | 'system';
}

export interface MultitenantContext {
  user: User | null;
  company: Company | null;
  theme: Theme;
}

// 🎭 MOCK DATA
const mockUser: User = {
  id: "user-123",
  name: "VibeThink User",
  email: "user@vibethink.com",
  role: "MANAGER",
  avatar: "https://bundui-images.netlify.app/avatars/01.png"
};

const mockCompany: Company = {
  id: "company-123",
  name: "Demo Company",
  slug: "demo-company",
  themePreset: "default",
  contentLayout: "default",
  branding: {
    logo: "/images/company-logo.png",
    primaryColor: "#3b82f6"
  }
};

const mockTheme: Theme = {
  preset: "default",
  mode: "light"
};

// 🪝 MULTITENANT HOOK
export function useMultitenant(): MultitenantContext {
  return useMemo(() => ({
    user: mockUser,
    company: mockCompany,
    theme: mockTheme
  }), []);
}

// 🛡️ PERMISSION HELPERS
export function hasPermission(
  userRole: User['role'], 
  requiredRole: User['role']
): boolean {
  const roleHierarchy: User['role'][] = [
    'EMPLOYEE', 
    'MANAGER', 
    'ADMIN', 
    'OWNER', 
    'SUPER_ADMIN'
  ];
  
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  
  return userLevel >= requiredLevel;
}

// 🎨 THEME HELPERS
export function getCompanyTheme(company: Company | null): string {
  return company?.themePreset || 'default';
}

export function getContentLayout(company: Company | null): 'default' | 'centered' {
  return company?.contentLayout || 'default';
}

/**
 * 🔄 PRODUCTION INTEGRATION NOTES:
 * 
 * To integrate with real authentication:
 * 
 * 1. Replace mock data with actual auth context
 * 2. Connect to Supabase user/company tables
 * 3. Implement real permission checking
 * 4. Add company-specific theme loading
 * 5. Integrate with actual theme switching
 * 
 * Example with real auth:
 * ```typescript
 * export function useMultitenant() {
 *   const { user: authUser } = useAuth();
 *   const { data: company } = useQuery(['company', authUser?.companyId]);
 *   const { theme } = useTheme();
 *   
 *   return {
 *     user: authUser,
 *     company,
 *     theme
 *   };
 * }
 * ```
 */