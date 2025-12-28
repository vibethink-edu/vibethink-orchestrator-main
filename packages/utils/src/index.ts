export * from './cn';
export * from './constants';
export * from './logger';
export * from './themes';
export * from './regional-config';

// Export generic formatters (legacy)
export * from './genericFormatters';

// Export enhanced formatters with different names to avoid conflicts
export {
  formatNumber as formatNumberRegional,
  formatCurrency as formatCurrencyRegional,
  formatDate as formatDateRegional,
  formatTime as formatTimeRegional,
  formatDateTime as formatDateTimeRegional,
  formatRelativeTime as formatRelativeTimeRegional,
  formatPercentage as formatPercentageRegional,
} from './formatters-enhanced';

// Export ICU Message Format utilities
export {
  formatMessage,
  isICUMessage,
  clearMessageCache,
} from './i18n/message-formatter';

// Export Money model
export type {
  Money,
  CurrencyCode,
} from './money/types';

export {
  CURRENCY_CONFIG,
} from './money/types';

export {
  formatMoney,
  createMoney,
  moneyToDecimal,
  addMoney,
  multiplyMoney,
} from './money/formatters';

export {
  formatCurrencyRegional as formatCurrencyRegionalCompat,
  formatCurrencyRegionalWithWarning,
} from './money/compat';

// Export Translation Loader Interface and Registry
export type { TranslationLoader } from './i18n/translation-loader.interface';
export {
  registerTranslationLoader,
  getTranslationLoader,
  isTranslationLoaderRegistered,
} from './i18n/translation-loader-registry';

// Export Terminology System
export {
  term,
  termSync,
  preloadTerminology,
} from './i18n/terminology';

// Export Terminology Types (Layer 1)
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  Locale,
  ProductContext,
  PRODUCT_CONTEXTS,
  ConceptID,
  BookingConcept,
  CRMConcept,
  AllConceptIDs,
  ConceptValue,
  ConceptObject,
  TerminologyContext,
  UIContext,
  AgentContext,
  TerminologySnapshot,
  ConceptNamespace,
  CONCEPT_FILES_PATH,
  CONCEPT_FILE_PATTERN,
  isValidLocale,
  isValidProductContext,
  isValidConceptID,
  isValidTerminologyContext,
  createUIContext,
  createAgentContext,
  getNamespaceForProduct,
  isProductNamespace,
} from './i18n/terminology/types';

// Export Terminology Cache
export {
  buildCacheKey,
  getCachedTranslation,
  setCachedTranslation,
  clearTerminologyCache,
  clearTerminologyCacheFor,
  isCached,
} from './i18n/terminology-cache';

// Export DateTime Module (ViTo Architecture Spec v3.0.0)
export * from './datetime';

// Export Context Types (Resource Context for External Normalization)
export type {
  SourceSystem,
  ResourceContext,
} from './context/types';

export {
  createResourceContext,
  createResourceContextFromCoords,
} from './context/types';
