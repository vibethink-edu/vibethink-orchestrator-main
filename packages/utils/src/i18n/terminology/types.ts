/**

 * CAPA 1: Semantic IDs (Identificadores Semánticos Inmutables)
 * 
 * Este módulo define los tipos y constantes para los Semantic IDs
 * usados en todo el sistema i18n de 3 capas.
 * 
 * Principios:
 * - Los Semantic IDs son INMUTABLES (nunca se renombran)
 * - Son canónicos y únicos en todo el sistema
 * - Usados por UI (Layer 3A) y AI Agents (Layer 3B)
 * - La Terminología (Layer 2) los resuelve a labels reales
 * 
 * @package @vibethink/utils
 */

/**
 * Constantes para idiomas soportados (9 idiomas oficiales)
 * 
 * ORDEN CRÍTICO: English (en) SIEMPRE primero en arrays, tipos y listas.
 * Este orden se mantiene en toda la aplicación.
 */
export const SUPPORTED_LOCALES = [
  'en', // 🇺🇸 English (DEFAULT - Fallback universal)
  'es', // 🇪🇸 Español
  'fr', // 🇫🇷 Français
  'pt', // 🇵🇹 Português
  'de', // 🇩🇪 Deutsch
  'it', // 🇮🇹 Italiano
  'zh', // 🇨🇳 中文 (Chinese) // TODO: Add 'ja', 'ru' in future
] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

/**
 * Idioma por defecto (fallback universal)
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Contextos de producto soportados por multi-producto ViTo
 * 
 * Cada producto tiene su propia terminología específica que overridea la base.
 */
export type ProductContext = 'hotel' | 'studio' | 'cowork' | 'coliving';

/**
 * Constante de todos los productos soportados
 */
export const PRODUCT_CONTEXTS: ProductContext[] = [
  'hotel',
  'studio',
  'cowork',
  'coliving',
] as const;

/**
 * Contextos de dominio para modularidad horizontal
 * 
 * Permite overrides específicos por dominio funcional (ej: CRM, Ops, HR, Finance).
 */
export type DomainContext =
  | 'booking'    // Reservas y gestiones de espacios
  | 'crm'        // Customer Relationship Management
  | 'operations'  // Operaciones y logística
  | 'hr'         // Recursos Humanos
  | 'finance'    // Finanzas y contabilidad;

/**
 * Contexto de espacio de trabajo (opcional para futuro multi-tenant avanzado)
 * 
 * Ejemplos: 'sales', 'logistics', 'support', etc.
 */
export type WorkspaceContext = string;

/**
 * Contexto de industria (opcional para futuro verticalización)
 * 
 * Ejemplos: 'health', 'hospitality', etc.
 */
export type IndustryContext = string;

/**
 * ID de inquilino (para multi-tenant enterprise)
 * 
 * En la fase actual (sin BD), esto es opcional y se usa para overrides en memoria.
 */
export type TenantId = string;

/**
 * CAPA 1: Semantic IDs (Identificadores Semánticos Inmutables)
 * 
 * Formato: concept.{domain}.{category}.{specific}
 * 
 * Reglas:
 * - Son INMUTABLES (nunca se renombran)
 * - Son canónicos en todo el sistema
 * - Son usados por UI (Layer 3A) y AI Agents (Layer 3B)
 * - La Terminología (Layer 2) los resuelve a labels reales
 * 
 * Ejemplos:
 * - concept.booking.resource.room (Habitación/Sala/Espacio según producto)
 * - concept.booking.action.reserve (Reservar)
 * - concept.crm.entity.deal (Oportunidad/Lead/Proyecto según producto)
 * - concept.booking.time.checkin (Check-in)
 * - concept.booking.time.checkout (Check-out)
 * - concept.booking.unit.hour (hora/horas)
 * - concept.booking.unit.day (día/días)
 * - concept.booking.unit.night (noche/noches)
 */
export type ConceptID = string;

/**
 * Concept IDs específicos para dominio Booking
 */
export type BookingConcept =
  // Recursos (espacios reservables)
  | 'concept.booking.resource.room'
  | 'concept.booking.resource.space'
  | 'concept.booking.resource.workstation'
  | 'concept.booking.resource.area'
  // Acciones (verbos)

  // Tiempos
  | 'concept.booking.time.checkin'
  | 'concept.booking.time.checkout'
  | 'concept.booking.time.duration'
  | 'concept.booking.time.startTime'
  | 'concept.booking.time.endTime'
  // Unidades (con soporte de plural)
  | 'concept.booking.unit.hour'
  | 'concept.booking.unit.day'
  | 'concept.booking.unit.night'
  // Estados
  | 'concept.booking.status.confirmed'
  | 'concept.booking.status.pending'
  | 'concept.booking.status.cancelled'
  | 'concept.booking.status.completed';

/**
 * Concept IDs específicos para dominio CRM
 */
export type CRMConcept =
  // Entidades (nombres de cosas)
  | 'concept.crm.entity.deal'
  | 'concept.crm.entity.lead'
  | 'concept.crm.entity.contact'
  | 'concept.crm.entity.company'
  | 'concept.crm.entity.opportunity'
  // Acciones
  | 'concept.crm.action.create'
  | 'concept.crm.action.update'
  | 'concept.crm.action.delete'
  | 'concept.crm.action.archive'
  // Estados
  | 'concept.crm.status.new'
  | 'concept.crm.status.inProgress'
  | 'concept.crm.status.won'
  | 'concept.crm.status.lost';

/**
 * Union de todos los concept IDs
 * 
 * Este es el tipo principal que se usa en toda la aplicación.
 * Agrega nuevos concept IDs según se necesitan.
 */
export type AllConceptIDs = BookingConcept | CRMConcept;

/**
 * CAPA 2: Contexto para Resolución de Terminología
 * 
 * Este contexto se pasa a las funciones term() y termSync() para resolver
 * un Concept ID a su label real en el idioma y contexto apropiados.
 */
export interface TerminologyContext {
  /**
   * Idioma objetivo (opcional, default = 'en')
   * Si no se especifica, usa DEFAULT_LOCALE
   */
  locale?: Locale;

  /**
   * Contexto de producto (opcional)
   * Determina qué overrides de producto aplicar (ej: hotel vs studio)
   */
  productContext?: ProductContext;

  /**
   * Contexto de dominio (opcional)
   * Permite overrides específicos por dominio funcional
   */
  domainContext?: DomainContext;

  /**
   * Contexto de espacio de trabajo (opcional)
   * Para futuro multi-tenant avanzado con workspaces
   */
  workspaceContext?: WorkspaceContext;

  /**
   * Contexto de industria (opcional)
   * Para futuro verticalización
   */
  industryContext?: IndustryContext;

  /**
   * ID de inquilino (opcional)
   * En la fase actual (sin BD), esto es para overrides en memoria
   */
  tenantId?: TenantId;
}

/**
 * CAPA 3A: Contexto para UI Components
 * 
 * Contexto extendido para UI que incluye información de routing
 * para auto-detección de contexto.
 */
export interface UIContext extends TerminologyContext {
  /**
   * Ruta actual (para auto-detección de contexto)
   * Ejemplo: '/dashboard-hotel/booking' → productContext = 'hotel'
   */
  route?: string;

  /**
   * Ruta base actual
   * Ejemplo: '/dashboard-hotel' o '/dashboard-studio'
   */
  basePath?: string;
}

/**
 * CAPA 3B: Contexto para AI Agents (MÁS REQUISITO)
 * 
 * Contexto para agentes de IA que incluye todos los parámetros obligatorios.
 * 
 * NOTA: Para AI agents, locale, productContext y tenantId son OBLIGATORIOS.
 */
export interface AgentContext extends TerminologyContext {
  /**
   * Idioma objetivo (OBLIGATORIO para AI)
   */
  locale: Locale;

  /**
   * Contexto de producto (OBLIGATORIO para AI)
   */
  productContext: ProductContext;

  /**
   * ID de inquilino (OBLIGATORIO para AI)
   */
  tenantId: TenantId;

  /**
   * Contexto de dominio (opcional)
   */
  domainContext?: DomainContext;

  /**
   * Contexto de espacio de trabajo (opcional)
   */
  workspaceContext?: WorkspaceContext;

  /**
   * Contexto de industria (opcional)
   */
  industryContext?: IndustryContext;

  /**
   * Zona horaria (opcional para AI)
   */
  timezone?: string;

  /**
   * Moneda (opcional para AI)
   */
  currency?: string;
}

/**
 * Valor de Concepto (shorthand o enriched)
 * 
 * En la implementación simple, un concepto es solo un string (label).
 * En la implementación enriched, un concepto tiene metadata adicional.
 * 
 * Ejemplo shorthand: "Habitación"
 * Ejemplo enriched: {
 *   label: "Habitación",
 *   plural: "Habitaciones",
 *   gender: "f",
 *   synonyms: ["Room", "Suite", "Habitación"],
 *   description: "Espacio individual para alojamiento"
 * }
 */
export type ConceptValue =
  | string // Shorthand: solo el label
  | ConceptObject; // Enriched: metadata completa

/**
 * Concepto enriquecido con metadata
 * 
 * Contiene información adicional útil para AI agents y UI avanzada.
 */
export interface ConceptObject {
  /**
   * Label del concepto (OBLIGATORIO)
   */
  label: string;

  /**
   * Plural del concepto (opcional, útil para AI)
   */
  plural?: string;

  /**
   * Género gramatical (opcional, útil para idiomas románicos)
   * 'm' = masculino, 'f' = femenino, 'n' = neutro
   */
  gender?: 'm' | 'f' | 'n';

  /**
   * Sinónimos (opcional, útil para AI search/NLU)
   */
  synonyms?: string[];

  /**
   * Descripción (opcional, útil para AI context)
   */
  description?: string;
}

/**
 * Resultado de resolución de concepto
 * 
 * Contiene el valor resuelto y metadata opcional.
 */
export interface ConceptResolution {
  /**
   * Valor resuelto (label del concepto)
   */
  value: string;

  /**
   * Concepto enriquecido completo (si aplica)
   */
  concept?: ConceptObject;

  /**
   * Idioma usado en la resolución
   */
  locale: Locale;

  /**
   * Contexto aplicado
   */
  context: {
    productContext?: ProductContext;
    domainContext?: DomainContext;
    tenantId?: TenantId;
  };
}

/**
 * Snapshot de Terminología para Client Hydration
 * 
 * En Next.js App Router, los client components NO pueden importar
 * diccionarios JSON directamente. Deben recibir un "snapshot"
 * pre-calculado desde el server.
 * 
 * Esto evita:
 * - Bundle bloat (no enviar 2MB de JSONs al cliente)
 * - Hydration mismatch (server y cliente tienen misma data)
 */
export interface TerminologySnapshot {
  /**
   * Map de concept IDs resueltos
   * ConceptID → Valor (string o ConceptObject)
   */
  concepts: Record<ConceptID, ConceptValue>;

  /**
   * Idioma del snapshot
   */
  locale: Locale;

  /**
   * Contexto aplicado al snapshot
   */
  context: {
    productContext?: ProductContext;
    domainContext?: DomainContext;
    tenantId?: TenantId;
  };

  /**
   * Timestamp de creación del snapshot
   */
  createdAt: string;
}

/**
 * Namespace de archivos JSON para terminology
 * 
 * Formato: concept-*.json
 * Ejemplos:
 * - concept.json (base, sin overrides)
 * - concept-hotel.json (overrides para hotel)
 * - concept-studio.json (overrides para studio)
 * - concept-cowork.json (overrides para cowork)
 * - concept-coliving.json (overrides para coliving)
 */
export type ConceptNamespace =
  | 'concept'           // Base universal
  | 'concept-hotel'      // Overrides para hotel
  | 'concept-studio'     // Overrides para studio
  | 'concept-cowork'     // Overrides para cowork
  | 'concept-coliving';  // Overrides para coliving

/**
 * Validadores de tipos
 */

/**
 * Valida si un string es un locale soportado
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Valida si un string es un product context soportado
 */
export function isValidProductContext(context: string): context is ProductContext {
  return PRODUCT_CONTEXTS.includes(context as ProductContext);
}

/**
 * Valida si un string es un concept ID válido
 * 
 * En esta implementación básica, solo verifica formato.
 * En producción, podría usar un enum de ConceptIDs.
 */
export function isValidConceptID(conceptId: string): boolean {
  return conceptId.startsWith('concept.');
}

/**
 * Valida si un contexto de terminology es válido
 */
export function isValidTerminologyContext(context: TerminologyContext): boolean {
  if (context.locale && !isValidLocale(context.locale)) {
    return false;
  }

  if (context.productContext && !isValidProductContext(context.productContext)) {
    return false;
  }

  return true;
}

/**
 * Helpers de construcción de contexto
 */

/**
 * Crea un contexto de UI con valores por defecto
 */
export function createUIContext(
  locale?: Locale,
  productContext?: ProductContext
): UIContext {
  return {
    locale: locale || DEFAULT_LOCALE,
    productContext,
  };
}

/**
 * Crea un contexto de AI con valores por defecto
 * 
 * NOTA: locale, productContext y tenantId son OBLIGATORIOS.
 * Esto lanza un error si no se proveen.
 */
export function createAgentContext(
  locale: Locale,
  productContext: ProductContext,
  tenantId: TenantId
): AgentContext {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  if (!isValidProductContext(productContext)) {
    throw new Error(`Invalid productContext: ${productContext}`);
  }
  if (!tenantId) {
    throw new Error(`tenantId is required for AI agents`);
  }

  return {
    locale,
    productContext,
    tenantId,
  };
}

/**
 * Helpers de namespace
 */

/**
 * Obtiene el namespace base para un product context
 * 
 * Ejemplo: hotel → concept-hotel
 * Ejemplo: studio → concept-studio
 */
export function getNamespaceForProduct(
  productContext: ProductContext
): ConceptNamespace {
  return `concept-${productContext}` as ConceptNamespace;
}

/**
 * Verifica si un namespace es un override de producto
 * 
 * Ejemplo: concept-hotel → true
 * Ejemplo: concept → false
 */
export function isProductNamespace(namespace: ConceptNamespace): boolean {
  return namespace !== 'concept';
}

/**
 * Constantes para paths de archivos
 * 
 * Paths relativos dentro de apps/dashboard/src/lib/i18n/translations/
 */
export const CONCEPT_FILES_PATH = 'src/lib/i18n/translations';

/**
 * Patrón de filenames para concept files
 * 
 * Formato: concept[-{product}].json
 * Ejemplos:
 * - concept.json (sin producto)
 * - concept-hotel.json (con producto)
 * - concept-studio.json (con producto)
 */
export const CONCEPT_FILE_PATTERN = (productContext?: ProductContext) =>
  productContext ? `concept-${productContext}.json` : 'concept.json';

/**
 * Exporta la metadata del módulo como utilidad
 */
export const TERMINOLOGY_MODULE_INFO = {
  name: '@vibethink/utils/i18n/terminology',
  version: '2.0.0',
  description: 'Sistema de 3 capas para i18n: Semantic IDs, Terminology Engine, UI Strings',
  layers: {
    'layer1': 'Semantic IDs (Conceptos inmutables)',
    'layer2': 'Terminology Engine (Resolución de conceptos)',
    'layer3': 'UI Strings (Traducciones de frases completas)',
  },
  features: [
    'Context-aware overrides (producto, dominio, workspace, tenant)',
    'Multi-locale support (9 idiomas oficiales)',
    'Cache en memoria para performance',
    'Snapshot/hydration pattern para Next.js App Router',
    'Async para AI agents, Sync para UI components',
    'Fallback automático a inglés',
  ],
  documentation: {
    architecture: 'docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md',
    aiFirst: 'docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md',
    bestPractices: 'docs/architecture/I18N_BEST_PRACTICES_AGENTS.md',
    validation: 'docs/architecture/I18N_9_LANGUAGE_COMPLIANCE_PROTOCOL.md',
  },
} as const;

/**
 * Exporta la metadata como utilidad
 */
export function getTerminologyModuleInfo() {
  return TERMINOLOGY_MODULE_INFO;
}
