/**
 * Tipos Unificados VibeThink 1.0 - Esquema de Base de Datos
 * 
 * Este archivo define todos los tipos TypeScript necesarios
 * para el sistema unificado con cookies modernas.
 */

// ============================================================================
// TIPOS BASE DEL TENANT
// ============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: 'active' | 'suspended' | 'pending' | 'cancelled';
  
  // Configuración de branding
  branding: TenantBranding;
  
  // Configuración general
  settings: TenantSettings;
  
  // Planes y límites
  plan_type: 'free' | 'pro' | 'enterprise';
  plan_limits: Record<string, number>;
  
  // Información de contacto
  contact_info: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface TenantBranding {
  logo: {
    light: string;
    dark: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
  };
  typography?: {
    fontFamily: string;
    fontSize: Record<string, string>;
  };
  components?: {
    borderRadius: string;
    shadow: string;
    animation: string;
  };
}

export interface TenantSettings {
  features: {
    reactFlow: boolean;
    aiChat: boolean;
    analytics: boolean;
    customBranding: boolean;
    multiLanguage: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
  };
  language: 'es' | 'en';
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'auto';
}

// ============================================================================
// TIPOS DE USUARIO UNIFICADO
// ============================================================================

export interface User {
  id: string;
  auth_user_id: string;
  tenant_id: string;
  
  // Datos personales
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  
  // Rol unificado con contexto
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  
  // Configuración personal
  preferences: UserPreferences;
  permissions: string[];
  
  // Auditoría
  created_at: string;
  updated_at: string;
  last_login?: string;
  last_activity?: string;
}

export type UserRole = 
  // VibeThink Internal (_VT)
  | 'SUPER_ADMIN_VT' | 'SUPPORT_VT' | 'DEVELOPER_VT' | 'MANAGER_VT' | 'EMPLOYEE_VT'
  // Customer (_CUST)
  | 'OWNER_CUST' | 'ADMIN_CUST' | 'MANAGER_CUST' | 'EMPLOYEE_CUST'
  // Partner (_PART)
  | 'PARTNER_ADMIN_PART' | 'PARTNER_MANAGER_PART' | 'PARTNER_EMPLOYEE_PART';

export interface UserPreferences {
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    defaultView: 'overview' | 'workflows' | 'analytics';
  };
}

// ============================================================================
// TIPOS DE WORKFLOW CON REACT FLOW
// ============================================================================

export interface Workflow {
  id: string;
  tenant_id: string;
  created_by: string;
  
  // Datos básicos
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  
  // React Flow data
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  // Configuración
  config: WorkflowConfig;
  metadata: WorkflowMetadata;
  
  created_at: string;
  updated_at: string;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'custom';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    tenant_id: string;
    workflow_id: string;
    config?: Record<string, any>;
  };
  style?: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'step' | 'smoothstep' | 'straight';
  data: {
    label?: string;
    condition?: string;
    tenant_id: string;
    workflow_id: string;
  };
  style?: Record<string, any>;
}

export interface WorkflowConfig {
  autoSave: boolean;
  versioning: boolean;
  collaboration: boolean;
  permissions: {
    canView: UserRole[];
    canEdit: UserRole[];
    canDelete: UserRole[];
  };
}

export interface WorkflowMetadata {
  tags: string[];
  category: string;
  estimatedDuration: number; // en minutos
  complexity: 'low' | 'medium' | 'high';
  lastExecuted?: string;
  executionCount: number;
}

// ============================================================================
// TIPOS DE COOKIES MODERNAS
// ============================================================================

export interface ModernCookie {
  id: string;
  user_id?: string;
  tenant_id: string;
  
  // Datos de la cookie
  name: string;
  value: string;
  domain?: string;
  path: string;
  
  // Configuración moderna
  secure: boolean;
  http_only: boolean;
  same_site: 'Strict' | 'Lax' | 'None';
  partitioned: boolean;
  priority: 'Low' | 'Medium' | 'High';
  
  // Vida útil
  expires_at?: string;
  max_age?: number; // en segundos
  
  // Propósito y consentimiento
  purpose: 'essential' | 'functional' | 'analytics' | 'marketing' | 'preferences';
  consent_given: boolean;
  consent_timestamp?: string;
  
  created_at: string;
  updated_at: string;
}

export interface CookieConsent {
  id: string;
  user_id?: string;
  tenant_id: string;
  
  // Consentimientos específicos
  essential_consent: boolean;
  functional_consent: boolean;
  analytics_consent: boolean;
  marketing_consent: boolean;
  preferences_consent: boolean;
  
  // Información del consentimiento
  consent_version: string;
  consent_timestamp: string;
  ip_address?: string;
  user_agent?: string;
  
  // Configuración de privacidad
  privacy_settings: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TIPOS DE SESIONES MODERNAS
// ============================================================================

export interface ModernSession {
  id: string;
  user_id?: string;
  tenant_id: string;
  
  // Datos de sesión
  session_token: string;
  refresh_token?: string;
  
  // Información del dispositivo
  device_id?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser?: string;
  os?: string;
  ip_address?: string;
  user_agent?: string;
  
  // Estado de la sesión
  is_active: boolean;
  is_remembered: boolean;
  
  // Seguridad
  last_activity: string;
  expires_at: string;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TIPOS DE PREFERENCIAS DE PRIVACIDAD
// ============================================================================

export interface PrivacyPreferences {
  id: string;
  user_id?: string;
  tenant_id: string;
  
  // Configuraciones de privacidad
  data_collection: boolean;
  analytics_tracking: boolean;
  marketing_communications: boolean;
  third_party_sharing: boolean;
  
  // Configuraciones de notificaciones
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  
  // Configuraciones de idioma y región
  language: 'es' | 'en';
  timezone: string;
  date_format: string;
  time_format: '12h' | '24h';
  
  // Configuraciones de accesibilidad
  high_contrast: boolean;
  reduced_motion: boolean;
  screen_reader: boolean;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TIPOS DE AUDITORÍA
// ============================================================================

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id?: string;
  
  event_type: string;
  entity_type: string;
  entity_id?: string;
  event_data: Record<string, any>;
  
  created_at: string;
}

// ============================================================================
// TIPOS DE CONTEXTO GLOBAL
// ============================================================================

export interface OrchestratorContextType {
  tenant: Tenant | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  updateTenant: (updates: Partial<Tenant>) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  switchLanguage: (language: 'es' | 'en') => Promise<void>;
  switchTheme: (theme: 'light' | 'dark' | 'auto') => Promise<void>;
  
  // Utilidades
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isOwner: () => boolean;
  isAdmin: () => boolean;
}

// ============================================================================
// TIPOS DE API RESPONSE
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TenantApiResponse extends ApiResponse<Tenant> {}
export interface UserApiResponse extends ApiResponse<User> {}
export interface WorkflowApiResponse extends ApiResponse<Workflow> {}
export interface WorkflowsApiResponse extends PaginatedResponse<Workflow> {}

// ============================================================================
// TIPOS DE CONFIGURACIÓN
// ============================================================================

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    multiTenant: boolean;
    reactFlow: boolean;
    aiChat: boolean;
    analytics: boolean;
  };
  limits: {
    maxTenants: number;
    maxUsersPerTenant: number;
    maxWorkflowsPerTenant: number;
    maxStoragePerTenant: number; // en MB
  };
}

export interface DatabaseConfig {
  url: string;
  schema: string;
  pool: {
    min: number;
    max: number;
  };
  ssl: boolean;
}

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface TenantEvent {
  type: 'created' | 'updated' | 'deleted' | 'suspended';
  tenantId: string;
  timestamp: string;
  data?: Record<string, any>;
}

export interface WorkflowEvent {
  type: 'created' | 'updated' | 'deleted' | 'executed';
  workflowId: string;
  tenantId: string;
  userId: string;
  timestamp: string;
  data?: Record<string, any>;
}

export interface UserEvent {
  type: 'created' | 'updated' | 'deleted' | 'login' | 'logout';
  userId: string;
  tenantId: string;
  timestamp: string;
  data?: Record<string, any>;
}

// ============================================================================
// TIPOS UTILITARIOS
// ============================================================================

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark' | 'auto';
export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// ============================================================================
// TIPOS DE COOKIE MANAGEMENT
// ============================================================================

export interface CookieManager {
  // Crear cookie
  createCookie: (params: CreateCookieParams) => Promise<ModernCookie>;
  
  // Obtener cookie
  getCookie: (name: string, domain?: string) => ModernCookie | null;
  
  // Eliminar cookie
  deleteCookie: (name: string, domain?: string) => Promise<void>;
  
  // Verificar consentimiento
  hasConsent: (purpose: ModernCookie['purpose']) => boolean;
  
  // Actualizar consentimiento
  updateConsent: (consents: Partial<CookieConsent>) => Promise<void>;
  
  // Limpiar cookies expiradas
  cleanupExpiredCookies: () => Promise<number>;
}

export interface CreateCookieParams {
  name: string;
  value: string;
  purpose: ModernCookie['purpose'];
  domain?: string;
  path?: string;
  secure?: boolean;
  http_only?: boolean;
  same_site?: ModernCookie['same_site'];
  max_age?: number;
  priority?: ModernCookie['priority'];
} 