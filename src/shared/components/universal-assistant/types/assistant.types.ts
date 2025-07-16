/**
 * Universal Assistant Types - VThink 1.0
 * 
 * Tipos para el componente UniversalAssistant que se adapta al contexto
 * de la entidad y proporciona soporte inteligente.
 */

// Tipos de entidad
export type EntityType = 'company' | 'customer' | 'employee' | 'zone' | 'country';

// Roles de usuario
export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';

// Perfil del asistente
export interface AssistantProfile {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  tone: 'supportive' | 'collaborative' | 'professional' | 'executive';
  avatar: string;
  status: 'online' | 'busy' | 'away';
  focus: string[];
  modules: string[];
  description: string;
}

// Contexto del asistente
export interface AssistantContext {
  entityId?: string;
  entityType?: EntityType;
  activeModules: string[];
  userRole: UserRole;
  userPermissions: string[];
  companyId: string;
  currentModule?: string;
  currentAction?: string;
}

// Mensaje del asistente
export interface AssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context: AssistantContext;
  actions?: AssistantAction[];
  metadata?: Record<string, any>;
}

// Acción del asistente
export interface AssistantAction {
  label: string;
  action: string;
  icon: string;
  params?: Record<string, any>;
  description?: string;
}

// Respuesta del asistente
export interface AssistantResponse {
  content: string;
  actions?: AssistantAction[];
  metadata?: Record<string, any>;
  suggestions?: string[];
}

// Intención del usuario
export interface UserIntent {
  topic: string;
  confidence: number;
  entities: Record<string, any>;
  module?: string;
  action?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// Props del componente UniversalAssistant
export interface UniversalAssistantProps {
  entityId?: string;
  entityType?: EntityType;
  className?: string;
  position?: 'sidebar' | 'floating' | 'fullscreen';
  showProfile?: boolean;
  onAction?: (action: string, params?: Record<string, any>) => void;
}

// Props del componente AssistantChat
export interface AssistantChatProps {
  messages: AssistantMessage[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  context: AssistantContext;
}

// Props del componente AssistantProfile
export interface AssistantProfileProps {
  profile: AssistantProfile;
  context: AssistantContext;
}

// Props del componente QuickActions
export interface QuickActionsProps {
  context: AssistantContext;
  onAction: (action: string) => void;
}

// Respuesta del hook useAssistant
export interface UseAssistantReturn {
  messages: AssistantMessage[];
  sendMessage: (message: string) => void;
  isTyping: boolean;
  profile: AssistantProfile;
  context: AssistantContext;
  clearChat: () => void;
  error?: Error;
}

// Configuración de perfiles por rol
export const ASSISTANT_PROFILES: Record<UserRole, Partial<AssistantProfile>> = {
  EMPLOYEE: {
    name: 'Asistente de Soporte',
    role: 'Soporte Técnico',
    expertise: ['troubleshooting', 'guidance', 'self_service'],
    tone: 'supportive',
    focus: ['basic_operations', 'self_service'],
    modules: ['helpdesk', 'pqrs'],
    description: 'Te ayudo con operaciones básicas y soporte técnico'
  },
  MANAGER: {
    name: 'Asistente de Gestión',
    role: 'Gestión de Equipos',
    expertise: ['analytics', 'process_optimization', 'team_management'],
    tone: 'collaborative',
    focus: ['team_management', 'reporting'],
    modules: ['crm', 'pqrs', 'helpdesk'],
    description: 'Te ayudo con la gestión de equipos y reportes'
  },
  ADMIN: {
    name: 'Asistente Administrativo',
    role: 'Administración del Sistema',
    expertise: ['administration', 'compliance', 'configuration'],
    tone: 'professional',
    focus: ['system_configuration', 'user_management'],
    modules: ['all'],
    description: 'Te ayudo con la administración del sistema'
  },
  OWNER: {
    name: 'Asistente Ejecutivo',
    role: 'Estrategia y Optimización',
    expertise: ['strategy', 'performance', 'growth'],
    tone: 'executive',
    focus: ['strategic_insights', 'business_optimization'],
    modules: ['all'],
    description: 'Te ayudo con insights estratégicos y optimización'
  },
  SUPER_ADMIN: {
    name: 'Asistente Master',
    role: 'Administración Global',
    expertise: ['global_administration', 'cross_company', 'system_architecture'],
    tone: 'executive',
    focus: ['global_management', 'system_architecture'],
    modules: ['all'],
    description: 'Te ayudo con la administración global del sistema'
  }
};

// Acciones rápidas por contexto
export const QUICK_ACTIONS_BY_CONTEXT = {
  general: [
    { label: 'Ayuda General', action: 'help_general', icon: 'help-circle' },
    { label: 'Ver Tutoriales', action: 'view_tutorials', icon: 'play' },
    { label: 'Reportar Problema', action: 'report_issue', icon: 'alert-triangle' }
  ],
  entity: [
    { label: 'Ver Timeline', action: 'view_timeline', icon: 'clock' },
    { label: 'Ver Métricas', action: 'view_metrics', icon: 'chart' },
    { label: 'Ver Casos', action: 'view_cases', icon: 'file-text' }
  ],
  module: [
    { label: 'Ayuda del Módulo', action: 'help_module', icon: 'book' },
    { label: 'Ver Casos', action: 'view_module_cases', icon: 'file-text' },
    { label: 'Ver Reportes', action: 'view_module_reports', icon: 'bar-chart' }
  ]
};

// Utilidades para el asistente
export const getAssistantProfile = (userRole: UserRole): AssistantProfile => {
  const baseProfile = ASSISTANT_PROFILES[userRole];
  
  return {
    id: `assistant-${userRole.toLowerCase()}`,
    name: baseProfile.name || 'Asistente Universal',
    role: baseProfile.role || 'Soporte',
    expertise: baseProfile.expertise || ['general_support'],
    tone: baseProfile.tone || 'supportive',
    avatar: `/avatars/assistant-${userRole.toLowerCase()}.png`,
    status: 'online',
    focus: baseProfile.focus || ['general_support'],
    modules: baseProfile.modules || ['all'],
    description: baseProfile.description || 'Te ayudo con tus tareas diarias'
  };
};

export const getQuickActions = (context: AssistantContext): AssistantAction[] => {
  const actions: AssistantAction[] = [];

  // Agregar acciones generales
  actions.push(...QUICK_ACTIONS_BY_CONTEXT.general);

  // Agregar acciones de entidad si hay entityId
  if (context.entityId) {
    actions.push(...QUICK_ACTIONS_BY_CONTEXT.entity);
  }

  // Agregar acciones de módulo si hay currentModule
  if (context.currentModule) {
    const moduleActions = QUICK_ACTIONS_BY_CONTEXT.module.map(action => ({
      ...action,
      action: action.action.replace('module', context.currentModule!)
    }));
    actions.push(...moduleActions);
  }

  return actions;
};

export const formatAssistantMessage = (message: string): string => {
  return message.trim();
};

export const isTypingIndicator = (isTyping: boolean): boolean => {
  return isTyping;
}; 