/**
 * i18n Translation Loader
 * 
 * Dynamically loads translation files by locale and namespace
 * Supports both static imports and dynamic loading for code splitting
 */

import { Locale, TranslationNamespace, TranslationDictionary } from './types';

/**
 * Translation cache to avoid reloading
 */
const translationCache: Map<string, TranslationDictionary> = new Map();

/**
 * Get cache key
 */
function getCacheKey(locale: Locale, namespace: TranslationNamespace): string {
  return `${locale}:${namespace}`;
}

/**
 * Load translation file
 * Uses dynamic import for code splitting
 */
export async function loadTranslation(
  locale: Locale,
  namespace: TranslationNamespace
): Promise<TranslationDictionary> {
  const cacheKey = getCacheKey(locale, namespace);

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Dynamic import with error handling
    const translation = await import(
      `./translations/${locale}/${namespace}.json`
    );

    const translations = translation.default || translation;
    
    // Cache the translation
    translationCache.set(cacheKey, translations);
    
    return translations;
  } catch (error) {
    console.warn(
      `[i18n] Failed to load translation for ${locale}/${namespace}:`,
      error
    );

    // Fallback to English if available
    if (locale !== 'en') {
      try {
        const fallback = await import(
          `./translations/en/${namespace}.json`
        );
        const fallbackTranslations = fallback.default || fallback;
        return fallbackTranslations;
      } catch {
        // If even English fails, return empty object
        return {};
      }
    }

    return {};
  }
}

/**
 * Preload translations for better performance
 */
export async function preloadTranslations(
  locale: Locale,
  namespaces: TranslationNamespace[]
): Promise<void> {
  await Promise.all(
    namespaces.map((namespace) => loadTranslation(locale, namespace))
  );
}

/**
 * Clear translation cache (useful for hot reloading in development)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Get all loaded translations for a locale
 */
export async function loadAllTranslations(
  locale: Locale
): Promise<Record<TranslationNamespace, TranslationDictionary>> {
  const namespaces: TranslationNamespace[] = [
    'common',
    'navigation',
    'crm',
    'sales',
    'ecommerce',
    'analytics',
    'calendar',
    'crypto',
    'finance',
    'kanban',
    'mail',
    'notes',
    'payment',
    'pos-system',
    'project-management',
    'tasks',
    'website-analytics',
    'workflow',
    'file-manager',
    'ai-chat',
    'ai-image-generator',
    'academy',
    'errors',
    'validation',
  ];

  const translations = await Promise.all(
    namespaces.map(async (namespace) => ({
      namespace,
      translations: await loadTranslation(locale, namespace),
    }))
  );

  return translations.reduce(
    (acc, { namespace, translations }) => {
      acc[namespace] = translations;
      return acc;
    },
    {} as Record<TranslationNamespace, TranslationDictionary>
  );
}

