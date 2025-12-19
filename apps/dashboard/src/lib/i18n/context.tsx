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

  /**
   * Load translation for a namespace
   */
  const loadNamespace = useCallback(
    async (namespace: TranslationNamespace) => {
      // Check if already loaded
      if (translationStore.has(locale)) {
        const localeStore = translationStore.get(locale)!;
        if (localeStore.has(namespace)) {
          return localeStore.get(namespace)!;
        }
      }

      // Load translation
      const translation = await loadTranslation(locale, namespace);

      // Store in cache
      if (!translationStore.has(locale)) {
        translationStore.set(locale, new Map());
      }
      translationStore.get(locale)!.set(namespace, translation);

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
        // Preload common namespaces
        await preloadTranslations(locale, preloadNamespaces);
      } catch (error) {
        console.error('[i18n] Failed to initialize translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [locale, preloadNamespaces]);

  /**
   * Translation function
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

      // Get translation from store
      const localeStore = translationStore.get(locale);
      if (!localeStore) {
        return key;
      }

      const namespaceTranslations = localeStore.get(namespace);
      if (!namespaceTranslations) {
        // Try to load on demand
        loadNamespace(namespace).catch(() => {
          console.warn(`[i18n] Failed to load namespace: ${namespace}`);
        });
        return key;
      }

      // Get nested value
      const translation = getNestedValue(namespaceTranslations, translationKey);
      if (!translation) {
        console.warn(`[i18n] Translation not found: ${key}`);
        return key;
      }

      // Replace parameters
      return replaceParams(translation, params);
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

