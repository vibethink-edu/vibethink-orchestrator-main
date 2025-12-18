'use client'

// Mock Auth Hook for Development
// TODO: Replace with actual auth implementation

export interface User {
  id: string
  company_id: string
  email: string
  role: string
}

export const useAuth = () => {
  // Mock user for development
  const mockUser: User = {
    id: '1',
    company_id: 'company-1',
    email: 'demo@vibethink.com',
    role: 'ADMIN'
  }

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true
  }
}