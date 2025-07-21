/**
 * Authentication Hook and Context Provider with Multi-Tenant Support
 * 
 * Provides authentication state management using Supabase Auth
 * - User session management
 * - Profile and company data fetching
 * - Permission checking
 * - Role switching capabilities (SUPER_ADMIN only)
 * - Mock user support for testing
 * 
 * @author AI Pair Platform
 * @version 2.1.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type definitions from database
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

// Extended user interface with profile and company data
interface AuthUser extends User {
  profile?: UserProfile;
  company?: Company;
}

// Authentication context interface
interface AuthContextType {
  /** Current authenticated user with profile and company info */
  user: AuthUser | null;
  /** Current company data (convenience accessor) */
  company: Company | null;
  /** Current session */
  session: Session | null;
  /** Boolean indicating if user is currently authenticated */
  isAuthenticated: boolean;
  /** Boolean indicating if auth state is being loaded */
  loading: boolean;
  /** Function to sign up a new user */
  signUp: (email: string, password: string, fullName?: string, companyName?: string) => Promise<{ error: any }>;
  /** Function to sign in a user */
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  /** Function to sign in with OAuth provider */
  signInWithOAuth: (provider: 'google' | 'github' | 'linkedin_oidc' | 'azure' | 'apple') => Promise<{ error: any }>;
  /** Function to logout the current user */
  signOut: () => Promise<void>;
  /** Function to refresh user profile data */
  refreshProfile: () => Promise<void>;
  /** Function to check if user has specific permission */
  hasPermission: (requiredRole: string) => boolean;
  /** Boolean indicating if user can switch roles (only superadmin@VibeThink.co) */
  canSwitchRoles: boolean;
  /** Function to set mock user for testing */
  setMockUser: (mockUser: AuthUser | null) => void;
  /** Boolean indicating if in mock mode */
  isMockMode: boolean;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockUser, setMockUser] = useState<AuthUser | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  // --- MOCK SUPER_ADMIN PARA PRUEBAS ---
  useEffect(() => {
    if (!session && !isMockMode) {
      const mockUser = {
        id: "mock-superadmin-id",
        email: "superadmin@VibeThink.co",
        profile: {
          id: "mock-superadmin-id",
          email: "superadmin@VibeThink.co",
          role: "SUPER_ADMIN",
          full_name: "Mock SuperAdmin",
          company_id: "mock-company-id",
          // ...otros campos requeridos por tu modelo
        },
        company: {
          id: "mock-company-id",
          name: "Mock Company",
          // ...otros campos requeridos por tu modelo
        }
      };
      setMockUser(mockUser as any);
      setIsMockMode(true);
    }
  }, [session, isMockMode]);

  // Computed authentication state - use mock user if in mock mode
  const currentUser = isMockMode ? mockUser : user;
  const isAuthenticated = isMockMode ? !!mockUser : !!session?.user;

  /**
   * Set mock user for testing
   */
  const setMockUserFunction = (newMockUser: AuthUser | null) => {
    setMockUser(newMockUser);
    setIsMockMode(!!newMockUser);
    // TODO: log '🧪 Mock user set:' newMockUser?.email
  };

  /**
   * Initialize authentication listener
   */
  useEffect(() => {
    // TODO: log '🔐 Initializing Supabase authentication...'

    // Check for mock user in localStorage first (for SimpleLogin)
    const storedAuthUser = localStorage.getItem('auth_user');
    const storedAuthSession = localStorage.getItem('auth_session');
    
    if (storedAuthUser && storedAuthSession) {
      try {
        const mockUser = JSON.parse(storedAuthUser);
        const mockSession = JSON.parse(storedAuthSession);
        
        // TODO: log '🧪 Found mock user in localStorage:' mockUser.email
        
        setMockUser(mockUser);
        setSession(mockSession);
        setIsMockMode(true);
        setLoading(false);
        return; // Don't continue with Supabase auth if we have mock data
      } catch (error) {
        // TODO: log '❌ Error parsing localStorage auth data:' error
        // Clear invalid data
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_session');
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // TODO: log '🔄 Auth event:' event session?.user?.email
        
        setSession(session);
        
        if (session?.user) {
          // Fetch profile and company data
          const { profile, company } = await fetchUserProfile(session.user.id);
          
          setUser({
            ...session.user,
            profile,
            company
          });
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // This will trigger the onAuthStateChange handler above
        return;
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Fetch user profile and company data from database
   */
  const fetchUserProfile = async (userId: string): Promise<{ profile: UserProfile | null, company: Company | null }> => {
    try {
      // TODO: log '📊 Fetching user profile for:' userId

      // Fetch user profile with company data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          companies (*)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        // TODO: log '❌ Error fetching user profile:' profileError
        return { profile: null, company: null };
      }

      // TODO: log '✅ Profile fetched successfully:' profile

      return { 
        profile: profile as UserProfile, 
        company: (profile as any).companies as Company 
      };
    } catch (error) {
      // TODO: log '❌ Error in fetchUserProfile:' error
      return { profile: null, company: null };
    }
  };

  /**
   * Refresh user profile data
   */
  const refreshProfile = async () => {
    if (!session?.user) return;

    const { profile, company } = await fetchUserProfile(session.user.id);
    if (profile && company) {
      setUser({
        ...session.user,
        profile,
        company
      });
    }
  };

  /**
   * Sign up function
   */
  const signUp = async (email: string, password: string, fullName?: string, companyName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            company_name: companyName
          }
        }
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  /**
   * Sign in function
   */
  const signIn = async (email: string, password: string) => {
    try {
      // TODO: log '🔐 Attempting sign in for:' email
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // TODO: log '❌ Sign in error:' error
      } else {
        // TODO: log '✅ Sign in successful'
      }
      
      return { error };
    } catch (error) {
      // TODO: log '❌ Sign in exception:' error
      return { error };
    }
  };

  /**
   * OAuth sign in function with support for multiple providers
   */
  const signInWithOAuth = async (provider: 'google' | 'github' | 'linkedin_oidc' | 'azure' | 'apple') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
        }
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  /**
   * Sign out function
   */
  const signOut = async () => {
    // TODO: log '🔐 Signing out...'
    
    // Clear localStorage if in mock mode
    if (isMockMode) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session');
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Also clear mock mode
    setMockUser(null);
    setIsMockMode(false);
  };

  /**
   * Check if user has specific permission based on role hierarchy
   */
  const hasPermission = (requiredRole: string) => {
    const userToCheck = currentUser;
    if (!userToCheck?.profile?.role && !userToCheck?.email) return false;
    
    // Handle SUPER_ADMIN separately since it's not in the DB enum yet
    const currentRole = userToCheck?.email?.toLowerCase() === 'superadmin@VibeThink.co' ? 'SUPER_ADMIN' : userToCheck?.profile?.role;
    
    const roleHierarchy = {
      'EMPLOYEE': 1,
      'MANAGER': 2,
      'ADMIN': 3,
      'OWNER': 4,
      'SUPER_ADMIN': 5,
      'SUPPORT': 1, // SUPPORT has limited permissions like EMPLOYEE
    };
    
    const userLevel = roleHierarchy[currentRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };

  // Solo superadmin@VibeThink.co puede cambiar de roles
  const canSwitchRoles = useMemo(() => {
    return currentUser?.email?.toLowerCase() === 'superadmin@VibeThink.co';
  }, [currentUser?.email]);

  return (
    <AuthContext.Provider value={{ 
      user: currentUser,
      company: currentUser?.company || null,
      session,
      isAuthenticated, 
      loading,
      signUp,
      signIn,
      signInWithOAuth,
      signOut,
      refreshProfile,
      hasPermission,
      canSwitchRoles,
      setMockUser: setMockUserFunction,
      isMockMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
