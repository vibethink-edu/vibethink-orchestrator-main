/**
 * i18n Context Provider
 * 
 * React context for internationalization with full type safety
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Locale, TranslationNamespace, TranslationDictionary, I18nContextValue } from './types';
import { i18nConfig, getBrowserLocale, isValidLocale } from './config';
import { loadTranslation, preloadTranslations } from './loader';
import { registerDashboardTranslationLoader } from './loader-impl';
import {
  getNestedValue,
  replaceParams,
  formatDate as formatDateUtil,
  formatTime as formatTimeUtil,
  formatCurrency as formatCurrencyUtil,
  formatNumber as formatNumberUtil,
  formatPercentage as formatPercentageUtil,
  parseTranslationKey,
} from './utils';
import { formatMessage, isICUMessage } from '@vibethink/utils';

/**
 * i18n Context
 */
const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * Translation store (in-memory cache)
 */
const translationStore: Map<Locale, Map<TranslationNamespace, TranslationDictionary>> = new Map();

/**
 * i18n Provider Props
 */
interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
  preloadNamespaces?: TranslationNamespace[];
}

/**
 * i18n Provider Component
 */
export function I18nProvider({
  children,
  initialLocale,
  preloadNamespaces = ['common', 'navigation'],
}: I18nProviderProps) {
  // Get initial locale from various sources
  const getInitialLocale = (): Locale => {
    if (initialLocale && isValidLocale(initialLocale)) {
      return initialLocale;
    }

    if (typeof window !== 'undefined') {
      // Try to get from localStorage
      const stored = localStorage.getItem(i18nConfig.storageKey);
      if (stored && isValidLocale(stored)) {
        return stored;
      }

      // Try to get from cookie
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find((c) => c.trim().startsWith(`${i18nConfig.cookieName}=`));
      if (localeCookie) {
        const locale = localeCookie.split('=')[1];
        if (isValidLocale(locale)) {
          return locale;
        }
      }

      // Fallback to browser locale
      return getBrowserLocale();
    }

    return i18nConfig.defaultLocale;
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [isLoading, setIsLoading] = useState(true);

  // Registrar TranslationLoader al montar
  useEffect(() => {
    registerDashboardTranslationLoader();
  }, []);

  // Initialize locale store immediately to prevent "Locale store not found" warnings
  useEffect(() => {
    if (!translationStore.has(locale)) {
      translationStore.set(locale, new Map());
      console.log(`[i18n] Initialized locale store for: ${locale}`);
    }
  }, [locale]);

  /**
   * Load translation for a namespace
   */
  const loadNamespace = useCallback(
    async (namespace: TranslationNamespace) => {
      // Ensure locale store exists
      if (!translationStore.has(locale)) {
        translationStore.set(locale, new Map());
      }

      // Check if already loaded
      const localeStore = translationStore.get(locale)!;
      if (localeStore.has(namespace)) {
        console.log(`[i18n] Namespace '${namespace}' already loaded for locale '${locale}'`);
        return localeStore.get(namespace)!;
      }

      console.log(`[i18n] Loading namespace '${namespace}' for locale '${locale}'...`);
      // Load translation
      const translation = await loadTranslation(locale, namespace);

      // Store in cache
      localeStore.set(namespace, translation);
      console.log(`[i18n] Namespace '${namespace}' stored for locale '${locale}'`);

      return translation;
    },
    [locale]
  );

  /**
   * Initialize translations
   */
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        console.log(`[i18n] Preloading namespaces for locale '${locale}':`, preloadNamespaces);
        // Preload common namespaces and store them
        for (const namespace of preloadNamespaces) {
          await loadNamespace(namespace);
        }
        console.log(`[i18n] Preload complete. Store contents:`, Array.from(translationStore.get(locale)?.keys() || []));
      } catch (error) {
        console.error('[i18n] Failed to initialize translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [locale, preloadNamespaces, loadNamespace]);

  /**
   * Translation function
   * Soporta ICU Message Format y legacy {{param}}
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number | boolean>): string => {
      // Parse key to get namespace and path
      const parsed = parseTranslationKey(key);
      if (!parsed) {
        console.warn(`[i18n] Invalid translation key format: ${key}`);
        return key;
      }

      const { namespace, key: translationKey } = parsed;

      // Get translation from store (ensure it exists)
      if (!translationStore.has(locale)) {
        translationStore.set(locale, new Map());
      }
      const localeStore = translationStore.get(locale)!;

      const namespaceTranslations = localeStore.get(namespace);
      if (!namespaceTranslations) {
        // Try to load on demand
        console.log(`[i18n] Namespace '${namespace}' not loaded, loading on demand...`);
        loadNamespace(namespace).catch((error) => {
          console.error(`[i18n] Failed to load namespace '${namespace}':`, error);
        });
        return key;
      }

      // Get nested value
      const translation = getNestedValue(namespaceTranslations, translationKey);
      if (!translation) {
        console.warn(`[i18n] Translation not found: ${key}`);
        console.warn(`[i18n]   Namespace: ${namespace}, Key: ${translationKey}`);
        console.warn(`[i18n]   Available keys in namespace:`, Object.keys(namespaceTranslations || {}).slice(0, 10));
        console.warn(`[i18n]   Full namespace object:`, namespaceTranslations);
        return key;
      }

      // Replace parameters (con soporte ICU + legacy)
      // Detectar si es ICU y usar formatMessage directamente
      if (isICUMessage(translation)) {
        try {
          const result = formatMessage(locale, translation, params);
          return result;
        } catch (error) {
          console.error(`[i18n] ICU format error for key '${key}':`, error);
          // Fallback a replaceParams legacy
        }
      }
      
      // Usar replaceParams (soporta legacy {{param}} y ICU básico)
      const result = replaceParams(translation, params, locale);
      if (result === key || (result.includes('{{') && params)) {
        console.warn(`[i18n] Parameters not replaced in: ${key}`);
        console.warn(`[i18n]   Translation: ${translation}`);
        console.warn(`[i18n]   Params:`, params);
        console.warn(`[i18n]   Result: ${result}`);
      }
      return result;
    },
    [locale, loadNamespace]
  );

  /**
   * Set locale and persist
   */
  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!isValidLocale(newLocale)) {
        console.warn(`[i18n] Invalid locale: ${newLocale}`);
        return;
      }

      setLocaleState(newLocale);

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(i18nConfig.storageKey, newLocale);

        // Set cookie for SSR
        document.cookie = `${i18nConfig.cookieName}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }
    },
    []
  );

  /**
   * Format date
   */
  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      return formatDateUtil(date, locale, options);
    },
    [locale]
  );

  /**
   * Format time
   */
  const formatTime = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      return formatTimeUtil(date, locale, options);
    },
    [locale]
  );

  /**
   * Format currency
   */
  const formatCurrency = useCallback(
    (amount: number, currency?: string) => {
      return formatCurrencyUtil(amount, locale, currency);
    },
    [locale]
  );

  /**
   * Format number
   */
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return formatNumberUtil(value, locale, options);
    },
    [locale]
  );

  /**
   * Format percentage
   */
  const formatPercentage = useCallback(
    (value: number, decimals: number = 1) => {
      return formatPercentageUtil(value, locale, decimals);
    },
    [locale]
  );

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    formatPercentage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * useI18n Hook
 * 
 * Hook to access i18n context
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

/**
 * useTranslation Hook
 * 
 * Convenience hook for translations with namespace
 */
export function useTranslation(namespace: TranslationNamespace) {
  const { t, locale, ...rest } = useI18n();

  const translate = useCallback(
    (key: string, params?: Record<string, string | number | boolean>) => {
      return t(`${namespace}.${key}`, params);
    },
    [t, namespace]
  );

  return {
    t: translate,
    locale,
    ...rest,
  };
}


