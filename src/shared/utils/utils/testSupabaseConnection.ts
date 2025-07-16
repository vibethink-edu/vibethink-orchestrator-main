/**
 * Supabase Connection Test Utility
 * 
 * Utility to test and verify Supabase connection
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import { supabase } from '@/shared/lib/supabase'

// Helper para detectar modo desarrollo
const isDevelopment = () => {
  try {
    return (import.meta as any)?.env?.MODE === 'development' || process.env.NODE_ENV === 'development';
  } catch {
    return false;
  }
};

export interface ConnectionTestResult {
  isConnected: boolean
  details: {
    database: boolean
    auth: boolean
    storage: boolean
    realtime: boolean
  }
  errors: string[]
  metadata: {
    url: string
    version: string
    timestamp: string
  }
}

// Logger para producción
const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment()) {
      // TODO: log info de testSupabaseConnection (message, data) para auditoría
    }
  },
  error: (message: string, error?: any) => {
    if (isDevelopment()) {
      // TODO: log error de testSupabaseConnection (message, error) para auditoría
    }
  },
  warn: (message: string, data?: any) => {
    if (isDevelopment()) {
      // TODO: log warning de testSupabaseConnection (message, data) para auditoría
    }
  }
};

/**
 * Test complete Supabase connection
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    isConnected: false,
    details: {
      database: false,
      auth: false,
      storage: false,
      realtime: false
    },
    errors: ['Supabase connection test disabled - supabase client not available'],
    metadata: {
      url: '',
      version: '',
      timestamp: new Date().toISOString()
    }
  }

  // TODO: log advertencia de testSupabaseConnection: DISABLED - supabase client not available
  return result
}

/**
 * Quick connection test (database only)
 */
export async function quickConnectionTest(): Promise<boolean> {
  logger.warn('⚠️ Quick connection test: DISABLED - supabase client not available')
  return false
}

/**
 * Test specific table access
 */
export async function testTableAccess(tableName: string): Promise<{
  hasAccess: boolean
  error?: string
}> {
  logger.warn('⚠️ Table access test: DISABLED - supabase client not available')
  return {
    hasAccess: false,
    error: 'Supabase client not available'
  }
}

/**
 * Test RLS (Row Level Security) policies
 */
export async function testRLSPolicies(): Promise<{
  companies: boolean
  userProfiles: boolean
  configurations: boolean
}> {
  const result = {
    companies: false,
    userProfiles: false,
    configurations: false
  }

  try {
    // Test companies table RLS
    const { error: companiesError } = await supabase
      .from('companies')
      .select('id')
      .limit(1)

    result.companies = !companiesError

    // Test user_profiles table RLS
    const { error: usersError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    result.userProfiles = !usersError

    // Test platform_configurations table RLS
    const { error: configError } = await supabase
      .from('platform_configurations')
      .select('id')
      .limit(1)

    result.configurations = !configError

  } catch (error) {
    logger.error('RLS test error:', error)
  }

  return result
}

/**
 * Get connection info
 */
export function getConnectionInfo() {
  return {
    url: (supabase as any).supabaseUrl,
    key: (supabase as any).supabaseKey?.substring(0, 20) + '...',
    timestamp: new Date().toISOString()
  }
} 