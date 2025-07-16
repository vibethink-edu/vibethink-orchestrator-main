/**
 * Centralized Constants
 * 
 * Provides standardized constants for the application
 * - User roles and permissions
 * - Module configurations
 * - API endpoints
 * - UI constants
 * - Business rules
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

// User roles
export const USER_ROLES = {
  // AI Pair Internal Roles
  SUPER_ADMIN_AP: 'SUPER_ADMIN_AP',
  SUPPORT_AP: 'SUPPORT_AP',
  ADMIN_AP: 'ADMIN_AP',
  TECH_LEAD_AP: 'TECH_LEAD_AP',
  DEVELOPER_AP: 'DEVELOPER_AP',
  MANAGER_AP: 'MANAGER_AP',
  EMPLOYEE_AP: 'EMPLOYEE_AP',
  
  // Customer Roles
  OWNER_CUST: 'OWNER_CUST',
  ADMIN_CUST: 'ADMIN_CUST',
  MANAGER_CUST: 'MANAGER_CUST',
  EMPLOYEE_CUST: 'EMPLOYEE_CUST'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [USER_ROLES.EMPLOYEE_AP]: 1,
  [USER_ROLES.MANAGER_AP]: 2,
  [USER_ROLES.ADMIN_AP]: 3,
  [USER_ROLES.SUPER_ADMIN_AP]: 4,
  [USER_ROLES.SUPPORT_AP]: 5,
  [USER_ROLES.TECH_LEAD_AP]: 6,
  [USER_ROLES.DEVELOPER_AP]: 7,
  [USER_ROLES.OWNER_CUST]: 8,
  [USER_ROLES.ADMIN_CUST]: 9,
  [USER_ROLES.MANAGER_CUST]: 10,
  [USER_ROLES.EMPLOYEE_CUST]: 11
};

// Module permissions
export const MODULE_PERMISSIONS = {
  helpdesk: {
    create: [USER_ROLES.EMPLOYEE_AP, USER_ROLES.MANAGER_AP, USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    delete: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    configure: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP]
  },
  crm: {
    create: [USER_ROLES.MANAGER_AP, USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    delete: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    configure: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP]
  },
  admin: {
    users: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    billing: [USER_ROLES.SUPER_ADMIN_AP],
    system: [USER_ROLES.SUPER_ADMIN_AP]
  },
  analytics: {
    view: [USER_ROLES.MANAGER_AP, USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    export: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP],
    configure: [USER_ROLES.ADMIN_AP, USER_ROLES.SUPER_ADMIN_AP]
  }
} as const;

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
  CUSTOM: 'custom'
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];

// Plan limits
export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.STARTER]: {
    users: 5,
    tickets: 100,
    storage: '1GB',
    integrations: 2,
    aiRequests: 1000
  },
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: {
    users: 25,
    tickets: 1000,
    storage: '10GB',
    integrations: 10,
    aiRequests: 10000
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    users: 'unlimited',
    tickets: 'unlimited',
    storage: '100GB',
    integrations: 'unlimited',
    aiRequests: 100000
  },
  [SUBSCRIPTION_PLANS.CUSTOM]: {
    users: 'custom',
    tickets: 'custom',
    storage: 'custom',
    integrations: 'custom',
    aiRequests: 'custom'
  }
} as const;

// Ticket statuses
export const TICKET_STATUS = {
  NEW: 'new',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  WAITING: 'waiting',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  CANCELLED: 'cancelled'
} as const;

export type TicketStatus = typeof TICKET_STATUS[keyof typeof TICKET_STATUS];

// Ticket priorities
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export type TicketPriority = typeof TICKET_PRIORITY[keyof typeof TICKET_PRIORITY];

// Priority weights for sorting
export const PRIORITY_WEIGHTS: Record<TicketPriority, number> = {
  [TICKET_PRIORITY.LOW]: 1,
  [TICKET_PRIORITY.MEDIUM]: 2,
  [TICKET_PRIORITY.HIGH]: 3,
  [TICKET_PRIORITY.CRITICAL]: 4
};

// CRM stages
export const CRM_STAGES = {
  LEAD: 'lead',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
} as const;

export type CRMStage = typeof CRM_STAGES[keyof typeof CRM_STAGES];

// Activity types
export const ACTIVITY_TYPES = {
  CALL: 'call',
  EMAIL: 'email',
  MEETING: 'meeting',
  TASK: 'task',
  NOTE: 'note',
  DOCUMENT: 'document'
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

// Notification types
export const NOTIFICATION_TYPES = {
  TICKET_CREATED: 'ticket_created',
  TICKET_UPDATED: 'ticket_updated',
  TICKET_ASSIGNED: 'ticket_assigned',
  TICKET_RESOLVED: 'ticket_resolved',
  ACTIVITY_CREATED: 'activity_created',
  DEADLINE_APPROACHING: 'deadline_approaching',
  SYSTEM_ALERT: 'system_alert'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
  SLACK: 'slack',
  WEBHOOK: 'webhook'
} as const;

export type NotificationChannel = typeof NOTIFICATION_CHANNELS[keyof typeof NOTIFICATION_CHANNELS];

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    PASSWORD: '/users/password'
  },
  
  // Companies
  COMPANIES: {
    BASE: '/companies',
    CONFIG: '/companies/config',
    BRANDING: '/companies/branding'
  },
  
  // Helpdesk
  HELPDESK: {
    TICKETS: '/helpdesk/tickets',
    CATEGORIES: '/helpdesk/categories',
    PRIORITIES: '/helpdesk/priorities',
    ASSIGNMENTS: '/helpdesk/assignments'
  },
  
  // CRM
  CRM: {
    CONTACTS: '/crm/contacts',
    COMPANIES: '/crm/companies',
    OPPORTUNITIES: '/crm/opportunities',
    ACTIVITIES: '/crm/activities'
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    METRICS: '/analytics/metrics'
  },
  
  // AI
  AI: {
    CHAT: '/ai/chat',
    CATEGORIZE: '/ai/categorize',
    SUGGEST: '/ai/suggest',
    ANALYZE: '/ai/analyze'
  }
} as const;

// UI constants
export const UI_CONSTANTS = {
  // Breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
    LARGE: 1536
  },
  
  // Spacing
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem'
  },
  
  // Border radius
  BORDER_RADIUS: {
    SM: '0.25rem',
    MD: '0.5rem',
    LG: '1rem',
    XL: '1.5rem',
    FULL: '9999px'
  },
  
  // Shadows
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  
  // Z-index
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070
  }
} as const;

// Business rules
export const BUSINESS_RULES = {
  // SLA times (in hours)
  SLA: {
    [TICKET_PRIORITY.LOW]: {
      response: 24,
      resolution: 72
    },
    [TICKET_PRIORITY.MEDIUM]: {
      response: 8,
      resolution: 48
    },
    [TICKET_PRIORITY.HIGH]: {
      response: 4,
      resolution: 24
    },
    [TICKET_PRIORITY.CRITICAL]: {
      response: 1,
      resolution: 4
    }
  },
  
  // Auto-escalation rules
  ESCALATION: {
    responseTime: 4, // hours
    resolutionTime: 24, // hours
    notifySupervisor: true,
    autoReassign: true
  },
  
  // Lead scoring weights
  LEAD_SCORING: {
    email: 20,
    phone: 15,
    company: 25,
    website: 10,
    activity: 30
  },
  
  // Session timeout (in minutes)
  SESSION: {
    timeout: 30,
    refreshThreshold: 5,
    maxConcurrent: 3
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Auth errors
  AUTH: {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    SESSION_EXPIRED: 'Sesión expirada',
    INSUFFICIENT_PERMISSIONS: 'Permisos insuficientes',
    ACCOUNT_LOCKED: 'Cuenta bloqueada'
  },
  
  // Validation errors
  VALIDATION: {
    REQUIRED: 'Este campo es requerido',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PHONE: 'Teléfono inválido',
    PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
    MIN_LENGTH: 'Mínimo {length} caracteres',
    MAX_LENGTH: 'Máximo {length} caracteres'
  },
  
  // API errors
  API: {
    NETWORK_ERROR: 'Error de conexión',
    TIMEOUT: 'Tiempo de espera agotado',
    SERVER_ERROR: 'Error del servidor',
    NOT_FOUND: 'Recurso no encontrado'
  },
  
  // Business errors
  BUSINESS: {
    PLAN_LIMIT_EXCEEDED: 'Límite del plan excedido',
    FEATURE_NOT_AVAILABLE: 'Funcionalidad no disponible',
    COMPANY_SUSPENDED: 'Empresa suspendida'
  }
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  // Auth
  AUTH: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Cierre de sesión exitoso',
    PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
    PROFILE_UPDATED: 'Perfil actualizado exitosamente'
  },
  
  // CRUD operations
  CRUD: {
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado exitosamente',
    DELETED: 'Eliminado exitosamente',
    SAVED: 'Guardado exitosamente'
  },
  
  // Business operations
  BUSINESS: {
    TICKET_CREATED: 'Ticket creado exitosamente',
    TICKET_ASSIGNED: 'Ticket asignado exitosamente',
    TICKET_RESOLVED: 'Ticket resuelto exitosamente',
    LEAD_CREATED: 'Lead creado exitosamente',
    OPPORTUNITY_CREATED: 'Oportunidad creada exitosamente'
  }
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  COMPANY_CONFIG: 'company_config',
  
  // UI state
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RIGHT_PANEL_COLLAPSED: 'right_panel_collapsed',
  THEME: 'theme',
  LANGUAGE: 'language',
  
  // Form data
  DRAFT_TICKET: 'draft_ticket',
  DRAFT_OPPORTUNITY: 'draft_opportunity',
  
  // Cache
  CACHE_PREFIX: 'ai_pair_cache_',
  CACHE_EXPIRY: 'ai_pair_cache_expiry_'
} as const;

// Environment variables
export const ENV = {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  VITE_FIRECRAWL_API_KEY: import.meta.env.VITE_FIRECRAWL_API_KEY,
  VITE_SUPPORT_MODE: import.meta.env.VITE_SUPPORT_MODE === 'true',
  VITE_DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true'
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  AI_ENABLED: true,
  REAL_TIME_UPDATES: true,
  ADVANCED_ANALYTICS: true,
  BETA_FEATURES: ENV.NODE_ENV === 'development',
  EXPERIMENTAL_UI: false
} as const; 