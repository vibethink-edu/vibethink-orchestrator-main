
/**
 * Type Guards for Enhanced Type Safety
 * 
 * Provides runtime type checking with TypeScript type guards
 * for all database entities and complex objects.
 * 
 * Part of Phase 2: Developer Experience improvements
 * 
 * @author AI Pair Platform - Developer Experience Team
 * @version 1.0.0
 */

import { Database } from '@/integrations/supabase/types';

// Type aliases for better readability
type Company = Database['public']['Tables']['companies']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type PromptTemplate = Database['public']['Tables']['prompt_templates']['Row'];
type NamingConvention = Database['public']['Tables']['naming_conventions']['Row'];
type FolderStructure = Database['public']['Tables']['folder_structure_templates']['Row'];
type OperationalRepository = Database['public']['Tables']['operational_repositories']['Row'];

/**
 * Check if value is a valid UUID
 */
export const isValidUUID = (value: any): value is string => {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Check if value is a valid email
 */
export const isValidEmail = (value: any): value is string => {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Check if value is a valid URL
 */
export const isValidURL = (value: any): value is string => {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if value is a valid JSON object
 */
export const isValidJSON = (value: any): value is object => {
  if (typeof value === 'object' && value !== null) return true;
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Company type guards
 */
export const isCompany = (value: any): value is Company => {
  return (
    typeof value === 'object' &&
    value !== null &&
    isValidUUID(value.id) &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    (value.domain === null || typeof value.domain === 'string') &&
    typeof value.created_at === 'string'
  );
};

export const isPartialCompany = (value: any): value is Partial<Company> => {
  return typeof value === 'object' && value !== null;
};

/**
 * User Profile type guards
 */
export const isUserProfile = (value: any): value is UserProfile => {
  return (
    typeof value === 'object' &&
    value !== null &&
    isValidUUID(value.id) &&
    isValidEmail(value.email) &&
    (value.full_name === null || typeof value.full_name === 'string') &&
    ['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'SUPPORT'].includes(value.role) &&
    (value.company_id === null || isValidUUID(value.company_id))
  );
};

export const isValidUserRole = (value: any): value is UserProfile['role'] => {
  return ['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'SUPPORT'].includes(value);
};

/**
 * Prompt Template type guards
 */
export const isPromptTemplate = (value: any): value is PromptTemplate => {
  return (
    typeof value === 'object' &&
    value !== null &&
    isValidUUID(value.id) &&
    isValidUUID(value.company_id) &&
    typeof value.title === 'string' &&
    typeof value.content === 'string' &&
    typeof value.category === 'string' &&
    Array.isArray(value.variables) &&
    typeof value.is_active === 'boolean'
  );
};

export const isPromptTemplateArray = (value: any): value is PromptTemplate[] => {
  return Array.isArray(value) && value.every(isPromptTemplate);
};

/**
 * Naming Convention type guards
 */
export const isNamingConvention = (value: any): value is NamingConvention => {
  return (
    typeof value === 'object' &&
    value !== null &&
    isValidUUID(value.id) &&
    isValidUUID(value.company_id) &&
    typeof value.name === 'string' &&
    typeof value.pattern === 'string' &&
    typeof value.category === 'string' &&
    Array.isArray(value.examples) &&
    typeof value.is_active === 'boolean'
  );
};

export const isValidRegexPattern = (pattern: string): boolean => {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
};

/**
 * Folder Structure type guards
 */
export const isFolderStructure = (value: any): value is FolderStructure => {
  return (
    typeof value === 'object' &&
    value !== null &&
    isValidUUID(value.id) &&
    isValidUUID(value.company_id) &&
    typeof value.name === 'string' &&
    Array.isArray(value.structure) &&
    typeof value.is_active === 'boolean'
  );
};

/**
 * Operational Repository type guards
 */
export const isOperationalRepository = (value: any): value is OperationalRepository => {
  return (
    typeof value === 'object' &&
    value !== null &&
    isValidUUID(value.id) &&
    isValidUUID(value.company_id) &&
    typeof value.name === 'string' &&
    typeof value.type === 'string' &&
    isValidEmail(value.orchestrator_email) &&
    typeof value.is_active === 'boolean'
  );
};

/**
 * Generic array type guard creator
 */
export const createArrayTypeGuard = <T>(itemGuard: (value: any) => value is T) => {
  return (value: any): value is T[] => {
    return Array.isArray(value) && value.every(itemGuard);
  };
};

/**
 * Database response type guards
 */
export const isSupabaseResponse = <T>(
  value: any,
  dataGuard: (data: any) => data is T
): value is { data: T; error: null } | { data: null; error: any } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'error' in value &&
    (value.error === null ? dataGuard(value.data) : value.data === null)
  );
};

/**
 * Enhanced error checking
 */
export const isError = (value: any): value is Error => {
  return value instanceof Error;
};

export const isSupabaseError = (value: any): value is { message: string; code?: string } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.message === 'string'
  );
};

/**
 * Form data validation type guards
 */
export const isValidFormData = (data: any, requiredFields: string[]): boolean => {
  if (typeof data !== 'object' || data === null) return false;
  
  return requiredFields.every(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
};

/**
 * Pagination and query result type guards
 */
export const isPaginatedResult = <T>(
  value: any,
  itemGuard: (item: any) => item is T
): value is { data: T[]; count: number; error: null } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray(value.data) &&
    value.data.every(itemGuard) &&
    typeof value.count === 'number' &&
    value.error === null
  );
};

/**
 * Feature flag and permission checking
 */
export const isValidFeatureFlag = (value: any): value is string => {
  return typeof value === 'string' && value.length > 0;
};

export const hasRequiredPermissions = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

/**
 * Date and time validation
 */
export const isValidDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

export const isValidISOString = (value: any): value is string => {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return isValidDate(date) && date.toISOString() === value;
};

/**
 * Usage examples and type narrowing helpers
 */
export const assertIsCompany = (value: any): asserts value is Company => {
  if (!isCompany(value)) {
    throw new Error('Expected Company object');
  }
};

export const assertIsUserProfile = (value: any): asserts value is UserProfile => {
  if (!isUserProfile(value)) {
    throw new Error('Expected UserProfile object');
  }
};

// Export common type guard combinations
export const TypeGuards = {
  // Basic types
  isValidUUID,
  isValidEmail,
  isValidURL,
  isValidJSON,
  isValidDate,
  isValidISOString,
  isValidRegexPattern,
  
  // Entity types
  isCompany,
  isUserProfile,
  isPromptTemplate,
  isNamingConvention,
  isFolderStructure,
  isOperationalRepository,
  
  // Array types
  companies: createArrayTypeGuard(isCompany),
  userProfiles: createArrayTypeGuard(isUserProfile),
  promptTemplates: createArrayTypeGuard(isPromptTemplate),
  namingConventions: createArrayTypeGuard(isNamingConvention),
  folderStructures: createArrayTypeGuard(isFolderStructure),
  
  // Response types
  isSupabaseResponse,
  isPaginatedResult,
  isError,
  isSupabaseError,
  
  // Validation helpers
  isValidFormData,
  hasRequiredPermissions,
  
  // Assertions
  assertIsCompany,
  assertIsUserProfile
};
