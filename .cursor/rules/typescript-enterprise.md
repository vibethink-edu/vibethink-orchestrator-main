
# TypeScript Enterprise Standards - AI Pair Orchestrator Pro

## TYPE SAFETY PRINCIPLES
Enterprise-grade TypeScript with strict type checking for multi-tenant SaaS reliability.

## CONFIGURATION STANDARDS

### tsconfig.json Requirements
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  }
}
```

## MULTI-TENANT TYPE PATTERNS

### 1. Company-Scoped Types
```typescript
// ✅ REQUIRED: Company isolation in all data types
export interface CompanyScopedEntity {
  id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends CompanyScopedEntity {
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface AIGeneratedContent extends CompanyScopedEntity {
  user_id: string;
  prompt_template_id?: string;
  content: string;
  tokens_used: number;
  cost_usd: number;
  content_type: ContentType;
}

// ✅ Type-safe query builder
export type CompanyQuery<T extends CompanyScopedEntity> = {
  select: (columns?: keyof T | (keyof T)[]) => Promise<T[]>;
  selectOne: (id: string) => Promise<T | null>;
  insert: (data: Omit<T, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => Promise<T>;
  update: (id: string, data: Partial<Omit<T, 'id' | 'company_id'>>) => Promise<T>;
  delete: (id: string) => Promise<void>;
};
```

### 2. Role-Based Type Guards
```typescript
// ✅ Type-safe role hierarchy
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER', 
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.EMPLOYEE]: 1,
  [UserRole.MANAGER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.OWNER]: 4,
  [UserRole.SUPER_ADMIN]: 5
} as const;

// ✅ Type-safe permission checking
export type Permission = 
  | 'ai_generation'
  | 'ai_bulk_processing'
  | 'manage_users'
  | 'manage_billing'
  | 'view_analytics'
  | 'system_admin';

export type RolePermissions = {
  [K in UserRole]: Permission[];
};

export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.EMPLOYEE]: ['ai_generation'],
  [UserRole.MANAGER]: ['ai_generation', 'view_analytics'],
  [UserRole.ADMIN]: ['ai_generation', 'ai_bulk_processing', 'manage_users', 'view_analytics'],
  [UserRole.OWNER]: ['ai_generation', 'ai_bulk_processing', 'manage_users', 'manage_billing', 'view_analytics'],
  [UserRole.SUPER_ADMIN]: ['ai_generation', 'ai_bulk_processing', 'manage_users', 'manage_billing', 'view_analytics', 'system_admin']
} as const;

// ✅ Type guard for role validation
export function hasPermission(
  userRole: UserRole, 
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

// ✅ Type-safe role component props
export interface RoleGuardProps {
  userRole: UserRole;
  requiredPermission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

### 3. AI Service Types
```typescript
// ✅ OpenAI integration types
export interface AIPromptRequest {
  company_id: string;
  user_id: string;
  prompt: string;
  content_type: ContentType;
  target_audience?: string;
  tone?: ToneType;
  max_tokens?: number;
  temperature?: number;
}

export interface AIGenerationResult {
  content: string;
  tokens_used: number;
  cost_usd: number;
  model_used: string;
  generation_time_ms: number;
}

export interface UsageTracking {
  company_id: string;
  user_id: string;
  service_name: 'openai' | 'firecrawl' | 'google_workspace';
  usage_type: string;
  amount: number;
  cost_usd: number;
  metadata?: Record<string, unknown>;
}

// ✅ Type-safe content generation
export type ContentType = 
  | 'blog_post'
  | 'social_media'
  | 'email'
  | 'presentation'
  | 'document'
  | 'marketing_copy';

export type ToneType = 
  | 'professional'
  | 'casual'
  | 'technical'
  | 'creative'
  | 'formal'
  | 'friendly';

// ✅ Type-safe usage limits
export interface PlanLimits {
  max_users: number;
  max_monthly_ai_requests: number;
  max_monthly_scraping_pages: number;
  max_storage_gb: number;
  features: string[];
}

export interface UsageStatus {
  current_period_start: string;
  current_period_end: string;
  ai_requests_used: number;
  ai_requests_limit: number;
  scraping_pages_used: number;
  scraping_pages_limit: number;
  storage_gb_used: number;
  storage_gb_limit: number;
}
```

### 4. Google Workspace Integration Types
```typescript
// ✅ Google Workspace types
export interface GoogleWorkspaceConfig {
  company_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  domain: string;
  scopes: string[];
  is_active: boolean;
}

export interface GoogleWorkspaceToken {
  user_id: string;
  company_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
  scope: string;
  token_type: 'Bearer';
}

export interface GoogleDocumentIntegration {
  company_id: string;
  user_id: string;
  document_id: string;
  document_url: string;
  title: string;
  content_type: ContentType;
  shared_with_team: boolean;
  folder_location?: string;
}

// ✅ Type-safe Google API responses
export interface GoogleAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

## ERROR HANDLING TYPES

### 1. Domain-Specific Errors
```typescript
// ✅ Structured error types
export class CompanyAccessError extends Error {
  constructor(
    public userId: string,
    public attemptedCompanyId: string,
    public actualCompanyId: string
  ) {
    super(`User ${userId} attempted to access company ${attemptedCompanyId} but belongs to ${actualCompanyId}`);
    this.name = 'CompanyAccessError';
  }
}

export class UsageLimitError extends Error {
  constructor(
    public companyId: string,
    public usageType: string,
    public currentUsage: number,
    public limit: number
  ) {
    super(`Company ${companyId} exceeded ${usageType} limit: ${currentUsage}/${limit}`);
    this.name = 'UsageLimitError';
  }
}

export class InsufficientPermissionError extends Error {
  constructor(
    public userRole: UserRole,
    public requiredPermission: Permission
  ) {
    super(`Role ${userRole} does not have permission: ${requiredPermission}`);
    this.name = 'InsufficientPermissionError';
  }
}

// ✅ Type-safe error handling
export type ApplicationError = 
  | CompanyAccessError
  | UsageLimitError  
  | InsufficientPermissionError;

export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof CompanyAccessError ||
         error instanceof UsageLimitError ||
         error instanceof InsufficientPermissionError;
}
```

### 2. API Response Types
```typescript
// ✅ Consistent API response structure
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
    usage?: {
      tokens_used: number;
      cost_usd: number;
    };
  };
}

// ✅ Type-safe API client
export class APIClient {
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<APIResponse<T>> {
    // Implementation with proper error handling
  }
  
  async post<T, U = unknown>(
    endpoint: string,
    data: U
  ): Promise<APIResponse<T>> {
    // Implementation with proper error handling
  }
}
```

## COMPONENT TYPE PATTERNS

### 1. Props Interface Standards
```typescript
// ✅ Consistent component prop patterns
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface CompanyContextProps {
  companyId: string;
  userRole: UserRole;
}

export interface AIComponentProps extends BaseComponentProps, CompanyContextProps {
  onContentGenerated?: (content: AIGenerationResult) => void;
  onError?: (error: ApplicationError) => void;
  disabled?: boolean;
}

// ✅ Form component types
export interface FormProps<T> extends BaseComponentProps {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  onCancel?: () => void;
  validationSchema?: unknown; // Zod schema
}

// ✅ Data display component types
export interface DataTableProps<T> extends BaseComponentProps {
  data: T[];
  columns: ColumnDefinition<T>[];
  loading?: boolean;
  error?: string;
  onRowClick?: (row: T) => void;
  pagination?: PaginationConfig;
}
```

### 2. Hook Types
```typescript
// ✅ Custom hook return types
export interface UseAuthReturn {
  user: UserProfile | null;
  company: Company | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: Permission) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface UseAIGenerationReturn {
  generate: (request: AIPromptRequest) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  error: ApplicationError | null;
  usageStatus: UsageStatus | null;
  canGenerate: boolean;
}

export interface UseGoogleWorkspaceReturn {
  isConnected: boolean;
  connect: () => Promise<void>;
  saveToGoogleDocs: (content: string, title: string) => Promise<string>;
  shareWithTeam: (documentId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
```

## UTILITY TYPES

### 1. Database Utility Types
```typescript
// ✅ Supabase type utilities
export type Database = import('@/integrations/supabase/types').Database;
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T]['Row'];
export type Insert<T extends TableName> = Tables[T]['Insert'];
export type Update<T extends TableName> = Tables[T]['Update'];

// ✅ Query builder types
export type QueryFilter<T> = {
  [K in keyof T]?: T[K] | T[K][] | { 
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike';
    value: T[K];
  };
};

export type OrderBy<T> = {
  column: keyof T;
  ascending: boolean;
};
```

## TYPE ENFORCEMENT RULES

### 1. Mandatory Type Annotations
```typescript
// ✅ REQUIRED: Explicit return types for all functions
export async function generateAIContent(
  request: AIPromptRequest
): Promise<APIResponse<AIGenerationResult>> {
  // Implementation
}

// ✅ REQUIRED: Props interfaces for all components
export const AIContentGenerator: React.FC<AIComponentProps> = ({
  companyId,
  userRole,
  onContentGenerated,
  onError,
  className
}) => {
  // Implementation
};

// ✅ REQUIRED: Type guards for runtime validation
export function isValidContentType(value: unknown): value is ContentType {
  return typeof value === 'string' && 
         ['blog_post', 'social_media', 'email', 'presentation', 'document', 'marketing_copy']
           .includes(value);
}
```

### 2. Prohibited Patterns
```typescript
// ❌ FORBIDDEN: any types
// const data: any = response.data;

// ❌ FORBIDDEN: Type assertions without validation
// const user = data as UserProfile;

// ❌ FORBIDDEN: Implicit any in function parameters
// function processData(data) { ... }

// ✅ CORRECT: Proper type validation
export function processUserData(data: unknown): UserProfile {
  if (!isUserProfile(data)) {
    throw new Error('Invalid user profile data');
  }
  return data;
}
```

**TypeScript Success Criteria:** Zero `any` types, complete type coverage, runtime type validation for external data.
