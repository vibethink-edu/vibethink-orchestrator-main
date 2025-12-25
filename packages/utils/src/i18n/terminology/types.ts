/**
 * CAPA 1: Semantic IDs Types
 * 
 * Tipos canónicos para Concept IDs estables
 */

// ✅ Lista CORRECTA de idiomas (según proyecto actual)
export const SUPPORTED_LOCALES = [
  'en',
  'es',
  'fr',
  'pt',
  'de',
  'it',
  'ko',  // ✅ Coreano (existe en proyecto)
  'ar',
  'zh',
  // ❌ NO incluir 'ru' (no existe en proyecto)
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Contextos de producto soportados
 */
export type ProductContext =
  | 'hotel'
  | 'studio'
  | 'cowork'
  | 'coliving';

/**
 * Dominios de la plataforma
 */
export type DomainContext =
  | 'booking'
  | 'crm'
  | 'operations'
  | 'hr'
  | 'finance';

/**
 * CAPA 1: Concept IDs (Semantic IDs)
 * 
 * Formato: concept.{domain}.{category}.{specific}
 * 
 * REGLA: NUNCA renombrar, solo agregar nuevos
 */

// Booking domain
export type BookingConcept =
  // Resources
  | 'concept.booking.resource.room'
  | 'concept.booking.resource.studio_room'
  | 'concept.booking.resource.meeting_room'
  | 'concept.booking.resource.cowork_desk'
  | 'concept.booking.resource.coliving_room'
  | 'concept.booking.resource.equipment'
  
  // Units
  | 'concept.booking.unit.hour'
  | 'concept.booking.unit.night'
  | 'concept.booking.unit.day'
  | 'concept.booking.unit.week'
  | 'concept.booking.unit.month'
  
  // Actions
  | 'concept.booking.action.reserve'
  | 'concept.booking.action.cancel'
  | 'concept.booking.action.modify'
  | 'concept.booking.action.confirm'
  | 'concept.booking.action.check_in'
  | 'concept.booking.action.check_out'
  
  // Status
  | 'concept.booking.status.pending'
  | 'concept.booking.status.confirmed'
  | 'concept.booking.status.cancelled'
  | 'concept.booking.status.completed';

// CRM domain
export type CRMConcept =
  | 'concept.crm.entity.lead'
  | 'concept.crm.entity.contact'
  | 'concept.crm.entity.company'
  | 'concept.crm.action.qualify'
  | 'concept.crm.action.convert';

/**
 * Union de todos los concepts
 */
export type ConceptID =
  | BookingConcept
  | CRMConcept;

/**
 * Context para resolución de terminology (opcional en UI)
 */
export interface TerminologyContext {
  domain?: DomainContext;
  productContext?: ProductContext;
  locale?: Locale;
  tenantId?: string;
}

/**
 * Context MANDATORIO para AI Agents
 */
export interface AgentContext {
  domain: DomainContext;
  productContext: ProductContext;
  locale: Locale;
  tenantId: string;
  timezone?: string;
  currency?: string;
}



