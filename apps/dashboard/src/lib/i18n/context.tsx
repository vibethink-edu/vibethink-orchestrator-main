/**
 * i18n Context Provider
 * 
 * React context for internationalization with full type safety
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Locale, TranslationNamespace, TranslationDictionary, I18nContextValue, TranslationFunction } from './types';
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
  // Get dashboard-specific storage key based on current path
  const getDashboardKey = useCallback(() => {
    if (typeof window === 'undefined') return 'default';
    const path = window.location.pathname;
    if (path.includes('/dashboard-admin')) return 'dashboard-admin';
    if (path.includes('/dashboard-tenant')) return 'dashboard-tenant';
    if (path.includes('/dashboard-bundui')) return 'dashboard-bundui';
    if (path.includes('/dashboard-vibethink')) return 'dashboard-vibethink';
    return 'default';
  }, []);

  // Get initial locale from various sources
  const getInitialLocale = (): Locale => {
    if (initialLocale && isValidLocale(initialLocale)) {
      return initialLocale;
    }

    if (typeof window !== 'undefined') {
      const dashboardKey = getDashboardKey();
      const storageKey = `${i18nConfig.storageKey}_${dashboardKey}`;
      const cookieName = `${i18nConfig.cookieName}_${dashboardKey}`;

      console.log(`[i18n] 🔍 Dashboard: ${dashboardKey}, StorageKey: ${storageKey}`);

      // Try to get from dashboard-specific localStorage
      const stored = localStorage.getItem(storageKey);
      if (stored && isValidLocale(stored)) {
        return stored;
      }

      // Try to get from dashboard-specific cookie
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find((c) => c.trim().startsWith(`${cookieName}=`));
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

  const [locale, setLocaleState] = useState<Locale>(initialLocale || i18nConfig.defaultLocale);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle client-side initialization after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    // If we didn't have an initialLocale from sever, or we want to sync with localStorage
    if (typeof window !== 'undefined') {
      const detected = getInitialLocale();
      if (detected !== locale) {
        console.log(`[i18n] 🔄 Syncing locale after mount: ${locale} -> ${detected}`);
        setLocaleState(detected);
      }
    }
  }, []);

  // Registrar TranslationLoader al montar
  useEffect(() => {
    registerDashboardTranslationLoader();

    // CAPA 2: Registrar el loader para el Terminology Engine
    // Nota: En el cliente, esto solo loguea. El loader real se usa solo en RSC (servidor).
    import('./translation-loader-client').then(({ registerDashboardTranslationLoaderForTerminology }) => {
      registerDashboardTranslationLoaderForTerminology();
    }).catch((error) => {
      console.error('[I18nProvider] Failed to register terminology loader:', error);
    });
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
        // Cache hit - no log to avoid spam
        return localeStore.get(namespace)!;
      }

      console.log(`[i18n] ⬇️ Loading namespace '${namespace}' for locale '${locale}'...`);
      // Load translation
      const translation = await loadTranslation(locale, namespace);

      // Store in cache
      localeStore.set(namespace, translation);
      console.log(`[i18n] ✅ Namespace '${namespace}' cached for locale '${locale}'`);

      return translation;
    },
    [locale]
  );

  /**
   * Sync HTML dir and lang attributes on locale change
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isRTL = locale === 'ar' || locale === 'he' || locale === 'fa' || locale === 'ur';
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]); // Only re-run when locale changes, not when preloadNamespaces array reference changes

  /**
   * Translation function
   * Soporta ICU Message Format y legacy {{param}}
   */
  const t = useCallback(
    (key: string, paramsOrDefault?: Record<string, string | number | boolean> | string, params?: Record<string, string | number | boolean>): string => {
      // Determine if the second argument is a default value or params
      const defaultValue = typeof paramsOrDefault === 'string' ? paramsOrDefault : undefined;
      const actualParams = typeof paramsOrDefault === 'object' ? paramsOrDefault : params;

      // Hydration safety: return key if not mounted on client to match server output
      if (typeof window !== 'undefined' && !isMounted) {
        return defaultValue || key;
      }

      // Parse key to get namespace and path
      const parsed = parseTranslationKey(key);
      if (!parsed) {
        console.warn(`[i18n] Invalid translation key format: ${key}`);
        return defaultValue || key;
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
        return defaultValue || key;
      }

      // Get nested value
      let translation = getNestedValue(namespaceTranslations, translationKey);

      // ✅ FALLBACK TO ENGLISH if translation not found
      if (!translation && locale !== 'en') {

        console.warn(`[i18n] Translation not found for '${key}' in '${locale}', falling back to English`);

        // Try to get English translation
        if (!translationStore.has('en')) {
          translationStore.set('en', new Map());
        }
        const enStore = translationStore.get('en')!;
        const enNamespace = enStore.get(namespace);

        if (enNamespace) {
          translation = getNestedValue(enNamespace, translationKey);
          if (translation) {
            console.log(`[i18n] ✅ Fallback successful: Using English translation for '${key}'`);
          }
        } else {
          // Load English namespace on demand
          console.log(`[i18n] Loading English namespace '${namespace}' for fallback...`);
          loadTranslation('en', namespace).then((enTranslation) => {
            enStore.set(namespace, enTranslation);
          }).catch((error) => {
            console.error(`[i18n] Failed to load English fallback for '${namespace}':`, error);
          });
        }
      }

      // If still no translation found, return key
      if (!translation) {
        console.warn(`[i18n] Translation not found even in English: ${key}`);
        return defaultValue || key;
      }

      // Replace parameters (con soporte ICU + legacy)
      // Detectar si es ICU y usar formatMessage directamente
      if (isICUMessage(translation)) {
        try {
          const result = formatMessage(locale, translation, actualParams);
          return result;
        } catch (error) {
          console.error(`[i18n] ICU format error for key '${key}':`, error);
          // Fallback a replaceParams legacy
        }
      }

      // Usar replaceParams (soporta legacy {{param}} y ICU básico)
      const result = replaceParams(translation, actualParams, locale);
      if (result === key || (result.includes('{{') && params)) {
        console.warn(`[i18n] Parameters not replaced in: ${key}`);
        console.warn(`[i18n]   Translation: ${translation}`);
        console.warn(`[i18n]   Params:`, actualParams);
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
        const dashboardKey = getDashboardKey();
        const storageKey = `${i18nConfig.storageKey}_${dashboardKey}`;
        const cookieName = `${i18nConfig.cookieName}_${dashboardKey}`;

        localStorage.setItem(storageKey, newLocale);

        // Set cookie for SSR
        document.cookie = `${cookieName}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // Update HTML dir attribute for RTL support
        const isRTL = newLocale === 'ar' || newLocale === 'he' || newLocale === 'fa' || newLocale === 'ur';
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', newLocale);

        console.log(`[i18n] ✅ Locale changed to '${newLocale}' for dashboard '${dashboardKey}' (dir: ${isRTL ? 'rtl' : 'ltr'})`);
      }
    },
    [getDashboardKey]
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

  const supportedLocales = React.useMemo(() => {
    const dashboardKey = getDashboardKey();
    if (dashboardKey === 'dashboard-admin') {
      return i18nConfig.locales.filter(l => l === 'en' || l === 'es');
    }
    return i18nConfig.locales;
  }, [getDashboardKey]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    formatPercentage,
    supportedLocales,
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
export function useTranslation(namespace: TranslationNamespace = 'common') {
  const { t, locale, ...rest } = useI18n();

  const translate: TranslationFunction = useCallback(
    (key: string, paramsOrDefault?: Record<string, string | number | boolean> | string, params?: Record<string, string | number | boolean>): any => {
      return t(`${namespace}.${key}`, paramsOrDefault as any, params);
    },
    [t, namespace]
  );

  return {
    t: translate,
    locale,
    ...rest,
  };
}


