/**
<<<<<<< HEAD
 * CAPA 2: Terminology System Exports
 */

// CAPA 1: Types
export type {
  Locale,
  ProductContext,
  DomainContext,
  ConceptID,
  BookingConcept,
  CRMConcept,
  TerminologyContext,
  AgentContext,
} from './types';

export { SUPPORTED_LOCALES } from './types';

// CAPA 2: Engine
export {
  term,
  termSync,
  preloadTerminology,
  clearCache,
  getCacheStats,
} from './engine';



=======
 * CAPA 1 & CAPA 2: Re-exports Públicos del Sistema de Terminología
 * 
 * Este archivo consolida todas las exportaciones del sistema de 3 capas
 * para proporcionar un punto de entrada único y claro para @vibethink/utils.
 * 
 * Principios:
 * - Re-exportar todo desde los submódulos (types, engine, cache)
 * - NO implementar lógica aquí (solo organización)
 * - Mantener exports ordenados lógicamente
 * - Exportar como barrel para conveniencia de imports
 * 
 * @package @vibethink/utils
 */

// ============================================================================
// CAPA 1: Semantic IDs (Types)
// ============================================================================

// Import para uso interno en este módulo
import {
  SUPPORTED_LOCALES as LOCALES_CONST,
  DEFAULT_LOCALE as DEFAULT_LOCALE_CONST,
  PRODUCT_CONTEXTS as PRODUCTS_CONST,
  isValidLocale as validateLocale,
  isValidProductContext as validateProductContext,
  isValidConceptID as validateConceptID,
  isValidTerminologyContext as validateTerminologyContext,
  createUIContext as buildUIContext,
  createAgentContext as buildAgentContext,
  getNamespaceForProduct as getProductNamespace,
  isProductNamespace as checkProductNamespace,
} from './types';

// Import de funciones de engine
import {
  term as resolveTerm,
  termSync as resolveTermSync,
  getSnapshot as createSnapshot,
  getConcept as fetchConcept,
  preloadTerminology as preload,
} from './engine';

// Import de funciones de cache
import {
  terminologyCache as cache,
  getFromCache as getCached,
  setInCache as setCached,
  hasCache as hasCached,
  deleteFromCache as deleteCached,
  clearTerminologyCache as clearCache,
  clearTerminologyCacheFor as clearCacheFor,
  buildCacheKey as makeCacheKey,
  getCacheStats as getStats,
  initTerminologyCache as initCache,
  destroyTerminologyCache as destroyCache,
  withAutoCleanup as autoCleanup,
} from './cache';

// Re-export EVERYTHING
export {
  // Constantes de idiomas (orden CRÍTICO: en primero)
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,

  // Tipos de idioma y contexto
  Locale,
  ProductContext,
  PRODUCT_CONTEXTS,

  // Tipos de Concept IDs
  ConceptID,
  BookingConcept,
  CRMConcept,
  AllConceptIDs,

  // Tipos de Concept Values (shorthand vs enriched)
  ConceptValue,
  ConceptObject,

  // Contextos de terminología
  TerminologyContext,
  UIContext,
  AgentContext,

  // Snapshot de terminología para client hydration
  TerminologySnapshot,

  // Namespaces de archivos JSON
  ConceptNamespace,

  // Paths constantes
  CONCEPT_FILES_PATH,
  CONCEPT_FILE_PATTERN,

  // Validadores de tipos
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

  // Funciones de preload
  preloadTerminology,  // Preload de conceptos para un contexto
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
  
  // Funciones con auto-cleanup
  withAutoCleanup,
} from './cache';

// ============================================================================
// CAPA 3: Terminology Provider & Hydration Components
// ============================================================================
// NOTE: TerminologyProvider and TerminologyHydration are React components
// and should be imported directly from the dashboard app, not from @vibethink/utils
// export * from './TerminologyProvider';
// export * from './TerminologyHydration';

// ============================================================================
// Metadata del módulo (documentación)
// ============================================================================


/**
 * Metadata del módulo de terminology
 * 
 * Contiene información descriptiva y referencias a documentación.
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
    'Metadata enriquecida (synonyms, description, gender, plural)',
    'Support para multi-producto (hotel, studio, cowork, coliving)',
    'Support para multi-tenant (overrides en memoria/BD)',
  ],
  documentation: {
    architecture: 'docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md',
    aiFirst: 'docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md',
    bestPractices: 'docs/architecture/I18N_BEST_PRACTICES_AGENTS.md',
    validation: 'docs/architecture/I18N_9_LANGUAGE_COMPLIANCE_PROTOCOL.md',
  },
  supportedLocales: LOCALES_CONST,
  supportedProducts: ['hotel', 'studio', 'cowork', 'coliving'] as const,
} as const;

/**
 * Exporta la metadata como utilidad
 * 
 * @returns La metadata del módulo de terminology
 * 
 * @example
 * ```typescript
 * import { getTerminologyModuleInfo } from '@vibethink/utils/i18n/terminology';
 * 
 * const info = getTerminologyModuleInfo();
 * console.log(info.name);      // "@vibethink/utils/i18n/terminology"
 * console.log(info.version);   // "2.0.0"
 * console.log(info.features);  // ["Context-aware overrides", ...]
 * console.log(info.supportedLocales);  // ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh']
 * ```
 */
export function getTerminologyModuleInfo() {
  return TERMINOLOGY_MODULE_INFO;
}

// ============================================================================
// Export conveniencia para barrel pattern
// ============================================================================

/**
 * Exporta todas las funciones y constantes como un único objeto
 * Útil para testing y debugging.
 *
 * NOTA: No incluimos TypeScript types aquí porque no existen en runtime.
 */
export const TerminologySystem = {
  // CAPA 1: Constantes y funciones (NO types)
  constants: {
    SUPPORTED_LOCALES: LOCALES_CONST,
    DEFAULT_LOCALE: DEFAULT_LOCALE_CONST,
    PRODUCT_CONTEXTS: PRODUCTS_CONST,
  },

  // CAPA 1: Validadores y helpers
  validators: {
    isValidLocale: validateLocale,
    isValidProductContext: validateProductContext,
    isValidConceptID: validateConceptID,
    isValidTerminologyContext: validateTerminologyContext,
  },

  // CAPA 1: Builders
  builders: {
    createUIContext: buildUIContext,
    createAgentContext: buildAgentContext,
    getNamespaceForProduct: getProductNamespace,
    isProductNamespace: checkProductNamespace,
  },

  // CAPA 2: Engine
  engine: {
    term: resolveTerm,
    termSync: resolveTermSync,
    getSnapshot: createSnapshot,
    getConcept: fetchConcept,
    preloadTerminology: preload,
  },

  // CAPA 2: Cache
  cache: {
    terminologyCache: cache,
    getFromCache: getCached,
    setInCache: setCached,
    hasCache: hasCached,
    deleteFromCache: deleteCached,
    clearTerminologyCache: clearCache,
    clearTerminologyCacheFor: clearCacheFor,
    buildCacheKey: makeCacheKey,
    getCacheStats: getStats,
    initTerminologyCache: initCache,
    destroyTerminologyCache: destroyCache,
    withAutoCleanup: autoCleanup,
  },

  // Metadata
  metadata: TERMINOLOGY_MODULE_INFO,
  getModuleInfo: getTerminologyModuleInfo,
} as const;
>>>>>>> zealous-williams
