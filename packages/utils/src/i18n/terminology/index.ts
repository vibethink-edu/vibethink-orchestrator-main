/**
 * CAPA 2: Terminology - Exports Públicos
 * 
 * Este módulo consolida todas las exportaciones del sistema de terminología
 * para proporcionar un punto de entrada único y claro para @vibethink/utils.
 * 
 * Principios:
 * - Re-exportar todo desde los submódulos (types, engine, cache)
 * - NO implementar lógica aquí (solo organizacón)
 * - Mantener exports ordenados lógicamente
 * 
 * @package @vibethink/utils
 */

// ============================================================================
// CAPA 1: Semantic IDs (Types)
// ============================================================================
export {
  // Constantes de idiomas
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  
  // Tipos de idioma y contexto
  Locale,
  ProductContext,
  PRODUCT_CONTEXTS,
  
  // Contextos de dominio y workspace
  DomainContext,
  WorkspaceContext,
  IndustryContext,
  
  // Contexto de inquilino
  TenantId,
  
  // Tipos de concepto
  ConceptID,
  BookingConcept,
  CRMConcept,
  AllConceptIDs,
  
  // Contextos para resolución
  TerminologyContext,
  UIContext,
  AgentContext,
  
  // Tipos de valores de concepto
  ConceptValue,
  ConceptObject,
  ConceptResolution,
  
  // Tipos para snapshots e hidratación
  TerminologySnapshot,
  
  // Namespaces de archivos JSON
  ConceptNamespace,
  
  // Paths constantes
  CONCEPT_FILES_PATH,
  CONCEPT_FILE_PATTERN,
  
  // Validadores
  isValidLocale,
  isValidProductContext,
  isValidConceptID,
  isValidTerminologyContext,
  
  // Helpers de construcción de contexto
  createUIContext,
  createAgentContext,
  
  // Helpers de namespace
  getNamespaceForProduct,
  isProductNamespace,
} from './types';

// ============================================================================
// CAPA 2: Terminology Engine (Motor de Resolución)
// ============================================================================
export {
  // Funciones principales de resolución
  term,              // Async: Resuelve concepto (para AI agents, RSC)
  termSync,          // Sync: Resuelve concepto (para UI con preload)
  getSnapshot,        // Async: Crea snapshot para client hydration
  getConcept,         // Async: Obtiene concepto enriquecido con metadata
  
  // Funciones de precarga
  preloadTerminology,  // Precarga conceptos para un contexto
} from './engine';

// ============================================================================
// CAPA 2: Cache (Cache en Memoria)
// ============================================================================
export {
  // Sistema de cache en memoria
  terminologyCache,
  
  // Funciones de cache
  getFromCache,
  setInCache,
  hasCache,
  deleteFromCache,
  
  // Funciones de gestión de cache
  clearTerminologyCache,
  clearTerminologyCacheFor,
  
  // Utilidades de cache
  buildCacheKey,
  getCacheStats,
  
  // Inicialización y limpieza
  initTerminologyCache,
  destroyTerminologyCache,
} from './cache';

// ============================================================================
// Re-exports de legacy (compatibilidad)
// ============================================================================
/**
 * NOTA DE COMPATIBILIDAD:
 * 
 * El archivo legacy `terminology.ts` (en `src/i18n/`) existe
 * por compatibilidad con código existente.
 * 
 * Eventualmente, cuando todo el código use las nuevas exportaciones,
 * se puede deprecar el archivo legacy.
 * 
 * Por ahora, este index.ts en `packages/utils/src/i18n/terminology/`
 * es la versión moderna y recomendada.
 */

// ============================================================================
// Metadata del módulo
// ============================================================================
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

