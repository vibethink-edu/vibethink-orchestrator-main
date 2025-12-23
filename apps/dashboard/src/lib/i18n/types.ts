/**
 * i18n Types - Type-safe internationalization system
 * 
 * Provides TypeScript types for the i18n system with full type safety
 * for translation keys and namespaces.
 */

/**
 * Supported locales
 */
export type Locale = 'en' | 'es' | 'ar' | 'zh' | 'fr' | 'pt' | 'de';

/**
 * Default locale
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Available locales array
 */
export const AVAILABLE_LOCALES: Locale[] = ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de'];

/**
 * Locale metadata
 */
export interface LocaleMetadata {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: Intl.Locale;
}

/**
 * Namespace keys for organized translations
 * Each module has its own namespace
 */
export type TranslationNamespace =
  | 'common'           // Common UI elements (buttons, labels, etc.)
  | 'navigation'        // Navigation menu items
  | 'crm'              // CRM module
  | 'sales'             // Sales module
  | 'ecommerce'         // E-commerce module
  | 'analytics'         // Analytics module
  | 'calendar'          // Calendar module
  | 'crypto'            // Crypto module
  | 'finance'           // Finance module
  | 'kanban'            // Kanban module
  | 'mail'              // Mail module
  | 'notes'             // Notes module
  | 'payment'           // Payment module
  | 'pos-system'        // POS System module
  | 'projects'          // Projects module
  | 'project-management' // Project Management module
  | 'tasks'             // Tasks module
  | 'website-analytics' // Website Analytics module
  | 'workflow'          // Workflow module
  | 'file-manager'      // File Manager module
  | 'ai-chat'           // AI Chat module
  | 'ai-image-generator' // AI Image Generator module
  | 'academy'           // Academy module
  | 'hotel'             // Hotel module
  | 'theme'             // Theme customization
  | 'concept'           // Concept terminology (IA First reusable components)
  | 'errors'            // Error messages
  | 'validation';       // Form validation messages

/**
 * Translation function type
 */
export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number | boolean>
) => string;

/**
 * i18n context value
 */
export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationFunction;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatPercentage: (value: number, decimals?: number) => string;
}

/**
 * Translation dictionary structure
 */
export type TranslationDictionary = Record<string, string | TranslationDictionary>;

/**
 * Namespace translations
 */
export type NamespaceTranslations = Record<TranslationNamespace, TranslationDictionary>;

/**
 * All translations structure
 */
export type AllTranslations = Record<Locale, NamespaceTranslations>;

/**
 * Translation key path (for type safety)
 * Example: 'crm.header.title' or 'common.buttons.save'
 */
export type TranslationKey = string;

/**
 * i18n configuration
 */
export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  localeMetadata: Record<Locale, LocaleMetadata>;
  storageKey: string;
  cookieName: string;
}


