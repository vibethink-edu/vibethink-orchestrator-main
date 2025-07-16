/**
 * Timeline Types - VThink 1.0
 * 
 * Tipos para el componente Timeline que maneja eventos multi-módulo
 * con contexto de entidad.
 */

// Tipos de entidad universal
export type EntityType = 'company' | 'customer' | 'employee' | 'zone' | 'country' | 'department' | 'project' | 'initiative';

// Tipos de eventos del timeline - VERSIÓN UNIVERSAL
export type TimelineEventType = 
  // Eventos de e2CRM
  | 'interaction' | 'opportunity' | 'case'
  
  // Eventos de e2PQRS UNIVERSAL (Entidad a Entidad)
  | 'entity_request' | 'entity_feedback' | 'entity_escalation'
  | 'entity_collaboration' | 'entity_notification' | 'entity_approval'
  | 'entity_consultation' | 'entity_coordination' | 'entity_resolution'
  | 'entity_optimization'
  
  // Estados de proceso universal
  | 'process_initiated' | 'process_in_progress' | 'process_review'
  | 'process_approved' | 'process_rejected' | 'process_completed'
  | 'process_cancelled' | 'process_escalated'
  
  // Eventos de Helpdesk
  | 'ticket' | 'resolution' | 'escalation'
  
  // Eventos de Workflows
  | 'workflow_start' | 'workflow_complete' | 'workflow_error'
  
  // Eventos de AI Assistant
  | 'chat_start' | 'chat_message' | 'recommendation';

export type TimelineEventStatus = 
  | 'active' | 'resolved' | 'pending' | 'cancelled';

export type TimelineEventPriority = 
  | 'low' | 'medium' | 'high' | 'critical';

// Evento del timeline - VERSIÓN UNIVERSAL
export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: TimelineEventType;
  module: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  priority: TimelineEventPriority;
  metadata: Record<string, any>;
  
  // Información de entidades (universal)
  sourceEntity?: {
    id: string;
    type: EntityType;
    context: string;
  };
  targetEntity?: {
    id: string;
    type: EntityType;
    context: string;
  };
  
  // Información de usuario
  userId?: string;
  userName?: string;
  
  // Contexto de la entidad principal
  entityId: string;
  entityType: EntityType;
  companyId: string;
}

// Filtros del timeline
export interface TimelineFilters {
  modules: string[];
  types: TimelineEventType[];
  status: TimelineEventStatus[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  } | null;
  priority: TimelineEventPriority[];
  search?: string;
  
  // Filtros universales adicionales
  sourceEntityType?: EntityType;
  targetEntityType?: EntityType;
  interactionType?: string;
}

// Props del componente Timeline
export interface TimelineProps {
  entityId: string;
  entityType: EntityType;
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
  onEventClick?: (event: TimelineEvent) => void;
}

// Props del componente TimelineItem
export interface TimelineItemProps {
  event: TimelineEvent;
  entityType: EntityType;
  onClick?: (event: TimelineEvent) => void;
}

// Props del componente TimelineFilters
export interface TimelineFiltersProps {
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
  activeModules: string[];
}

// Configuración de módulos del timeline - VERSIÓN UNIVERSAL
export interface TimelineModuleConfig {
  source: string;
  events: TimelineEventType[];
  icon: string;
  color: string;
  label: string;
  description: string;
}

// Contexto del timeline
export interface TimelineContext {
  entityId: string;
  entityType: EntityType;
  availableModules: string[];
  userPermissions: string[];
  companyId: string;
}

// Respuesta del hook useTimeline
export interface UseTimelineReturn {
  events: TimelineEvent[] | undefined;
  isLoading: boolean;
  filters: TimelineFilters;
  setFilters: (filters: TimelineFilters) => void;
  activeModules: string[];
  refresh: () => void;
  error?: Error;
}

// Configuración de módulos - VERSIÓN UNIVERSAL
export const TIMELINE_MODULES: Record<string, TimelineModuleConfig> = {
  crm: {
    source: 'e2CRM',
    events: ['interaction', 'opportunity', 'case'],
    icon: 'users',
    color: 'blue',
    label: 'CRM',
    description: 'Gestión de relaciones con clientes'
  },
  pqrs: {
    source: 'e2PQRS',
    events: [
      'entity_request', 'entity_feedback', 'entity_escalation',
      'entity_collaboration', 'entity_notification', 'entity_approval',
      'entity_consultation', 'entity_coordination', 'entity_resolution',
      'entity_optimization',
      'process_initiated', 'process_in_progress', 'process_review',
      'process_approved', 'process_rejected', 'process_completed',
      'process_cancelled', 'process_escalated'
    ],
    icon: 'git-branch',
    color: 'purple',
    label: 'Entidad a Entidad',
    description: 'Sistema universal de procesos entre entidades'
  },
  helpdesk: {
    source: 'Helpdesk',
    events: ['ticket', 'resolution', 'escalation'],
    icon: 'headphones',
    color: 'orange',
    label: 'Soporte',
    description: 'Sistema de soporte técnico'
  },
  workflow: {
    source: 'Kestra',
    events: ['workflow_start', 'workflow_complete', 'workflow_error'],
    icon: 'git-branch',
    color: 'indigo',
    label: 'Workflows',
    description: 'Automatización de procesos'
  },
  ai: {
    source: 'UniversalAssistant',
    events: ['chat_start', 'chat_message', 'recommendation'],
    icon: 'bot',
    color: 'green',
    label: 'IA',
    description: 'Asistente inteligente universal'
  }
};

// Utilidades para el timeline - VERSIÓN UNIVERSAL
export const getModuleConfig = (module: string): TimelineModuleConfig | undefined => {
  return TIMELINE_MODULES[module];
};

export const getEventIcon = (event: TimelineEvent): string => {
  const moduleConfig = getModuleConfig(event.module);
  return moduleConfig?.icon || 'circle';
};

export const getEventColor = (event: TimelineEvent): string => {
  const moduleConfig = getModuleConfig(event.module);
  return moduleConfig?.color || 'gray';
};

export const formatTimelineDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days < 7) return `Hace ${days} días`;
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Utilidades para eventos universales
export const getEventDescription = (event: TimelineEvent): string => {
  switch (event.type) {
    case 'entity_request':
      return `Solicitud de ${event.sourceEntity?.type || 'entidad'} a ${event.targetEntity?.type || 'entidad'}`;
    case 'entity_feedback':
      return `Retroalimentación de ${event.sourceEntity?.type || 'entidad'} a ${event.targetEntity?.type || 'entidad'}`;
    case 'entity_collaboration':
      return `Colaboración entre ${event.sourceEntity?.type || 'entidad'} y ${event.targetEntity?.type || 'entidad'}`;
    case 'entity_optimization':
      return `Optimización propuesta por ${event.sourceEntity?.type || 'entidad'}`;
    default:
      return event.description;
  }
};

export const getEventTitle = (event: TimelineEvent): string => {
  if (event.title) return event.title;
  
  switch (event.type) {
    case 'entity_request':
      return 'Solicitud Universal';
    case 'entity_feedback':
      return 'Retroalimentación';
    case 'entity_collaboration':
      return 'Colaboración';
    case 'entity_optimization':
      return 'Optimización';
    case 'process_initiated':
      return 'Proceso Iniciado';
    case 'process_completed':
      return 'Proceso Completado';
    default:
      return 'Evento del Sistema';
  }
}; 