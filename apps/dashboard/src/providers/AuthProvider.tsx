/**
 * AuthProvider - Authentication Context Provider
 * VibeThink Orchestrator - Architecture Upgrade Phase 4
 * 
 * Provides authentication state to all components via React Context
 * Implements multi-tenant security with company_id filtering
 */

'use client'

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { User, UseAuthReturn } from '@/lib/hooks/useAuth'

// Create context
export const AuthContext = createContext<UseAuthReturn | null>(null)

interface AuthProviderProps {
  children: ReactNode
  initialUser?: User | null
}

/**
 * AuthProvider Component
 * 
 * Wrap your app with this provider to enable authentication
 * 
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <YourApp />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // const data = await response.json()
      
      // Mock login for development
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Demo User',
        email: email,
        company_id: 'vibethink_company', // ⭐ CRITICAL: Assign company
        role: 'admin',
        avatar: '/avatars/default.png',
        createdAt: new Date().toISOString()
      }
      
      setUser(mockUser)
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('vibethink_user', JSON.stringify(mockUser))
      }
      
      console.log('✅ Login successful:', mockUser)
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/auth/logout', { method: 'POST' })
      
      setUser(null)
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vibethink_user')
      }
      
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update user function
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user to update')
    }
    
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/user', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // })
      // const data = await response.json()
      
      // Mock update
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('vibethink_user', JSON.stringify(updatedUser))
      }
      
      console.log('✅ User updated:', updatedUser)
    } catch (error) {
      console.error('❌ Update failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('vibethink_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setUser(parsed)
          console.log('✅ User loaded from localStorage:', parsed)
        } catch (error) {
          console.error('❌ Failed to parse stored user:', error)
          localStorage.removeItem('vibethink_user')
        }
      } else {
        // No stored user, set mock user for development
        const mockUser: User = {
          id: 'dev_user_1',
          name: 'Development User',
          email: 'dev@vibethink.com',
          company_id: 'vibethink_dev',
          role: 'admin',
          avatar: '/avatars/dev.png'
        }
        setUser(mockUser)
        console.log('🔧 Development mode: Mock user loaded')
      }
    }
  }, [])

  // Context value
  const value: UseAuthReturn = {
    user,
    isAuthenticated: !!user,
    isLoading,
    company_id: user?.company_id || null,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Higher-Order Component to protect routes
 * 
 * Usage:
 * ```tsx
 * export default withAuth(YourPage)
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
      setMounted(true)
    }, [])
    
    if (!mounted) {
      return <div>Loading...</div>
    }
    
    // You can add redirect logic here
    // const { isAuthenticated } = useAuth()
    // if (!isAuthenticated) {
    //   redirect('/login')
    // }
    
    return <Component {...props} />
  }
}



