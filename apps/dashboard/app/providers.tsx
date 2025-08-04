"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// Mock Auth Context para componentes premium
interface MockAuthContextType {
  user: {
    id: string;
    email: string;
    profile?: {
      role: string;
    };
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
}

const MockAuthContext = createContext<MockAuthContextType>({
  user: {
    id: '1',
    email: 'demo@vthink.com',
    profile: { role: 'ADMIN' }
  },
  isAuthenticated: true,
  loading: false,
  hasPermission: () => true
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const mockAuthValue: MockAuthContextType = {
    user: {
      id: '1',
      email: 'demo@vthink.com',
      profile: { role: 'ADMIN' }
    },
    isAuthenticated: true,
    loading: false,
    hasPermission: () => true
  };

  return (
    <MockAuthContext.Provider value={mockAuthValue}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
