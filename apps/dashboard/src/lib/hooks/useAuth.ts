/**
 * useAuth Hook - Authentication with Multi-tenant Support
 * VibeThink Orchestrator - Architecture Upgrade Phase 4
 * 
 * Provides authentication state and user information with company_id
 * for multi-tenant security across all applications
 * 
 * CRITICAL: company_id is used to filter data per organization
 */

'use client'

import { useContext } from 'react'
import { AuthContext } from '@/providers/AuthProvider'

export interface User {
  id: string
  name: string
  email: string
  company_id: string  // ⭐ CRITICAL: Multi-tenant security
  role: 'admin' | 'manager' | 'user'
  avatar?: string
  createdAt?: string
}

export interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  company_id: string | null  // Quick access to company_id
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

/**
 * useAuth Hook
 * 
 * Usage:
 * ```tsx
 * const { user, company_id, isAuthenticated } = useAuth()
 * 
 * // Fetch data with multi-tenant security
 * const { data } = await fetch(`/api/customers?company_id=${company_id}`)
 * ```
 */
export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext)
  
  if (!context) {
    // Return mock data for development (no provider yet)
    // TODO: Remove this when AuthProvider is implemented
    return {
      user: {
        id: 'dev_user_1',
        name: 'Development User',
        email: 'dev@vibethink.com',
        company_id: 'vibethink_dev', // Mock company for development
        role: 'admin'
      },
      isAuthenticated: true,
      isLoading: false,
      company_id: 'vibethink_dev',
      login: async () => {
        console.warn('useAuth: login called but AuthProvider not implemented')
      },
      logout: async () => {
        console.warn('useAuth: logout called but AuthProvider not implemented')
      },
      updateUser: async () => {
        console.warn('useAuth: updateUser called but AuthProvider not implemented')
      }
    }
  }
  
  return context
}

/**
 * Hook to get only company_id (common use case)
 * 
 * Usage:
 * ```tsx
 * const companyId = useCompanyId()
 * fetch(`/api/data?company_id=${companyId}`)
 * ```
 */
export function useCompanyId(): string {
  const { company_id } = useAuth()
  
  if (!company_id) {
    throw new Error('useCompanyId: company_id not available. User not authenticated.')
  }
  
  return company_id
}

/**
 * Hook to check if user has specific role
 * 
 * Usage:
 * ```tsx
 * const isAdmin = useRole('admin')
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
export function useRole(requiredRole: User['role']): boolean {
  const { user } = useAuth()
  
  if (!user) return false
  
  const roleHierarchy = { admin: 3, manager: 2, user: 1 }
  const userLevel = roleHierarchy[user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0
  
  return userLevel >= requiredLevel
}












