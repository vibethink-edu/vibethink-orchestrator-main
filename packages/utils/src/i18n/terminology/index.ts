/**
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



