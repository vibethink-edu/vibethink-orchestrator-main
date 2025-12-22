/**
 * i18n Configuration
 * 
 * Central configuration for the internationalization system
 */

import { I18nConfig, Locale, LocaleMetadata } from './types';

/**
 * Locale metadata configuration
 */
export const localeMetadata: Record<Locale, LocaleMetadata> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'hh:mm a',
    currency: 'USD',
    numberFormat: new Intl.Locale('en-US'),
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: new Intl.Locale('es-ES'),
  },
};

/**
 * i18n configuration
 */
export const i18nConfig: I18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  localeMetadata,
  storageKey: 'vibethink-locale',
  cookieName: 'NEXT_LOCALE',
};

/**
 * Get locale metadata
 */
export function getLocaleMetadata(locale: Locale): LocaleMetadata {
  return localeMetadata[locale] || localeMetadata.en;
}

/**
 * Validate locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(locale as Locale);
}

/**
 * Get browser locale (fallback to default)
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return i18nConfig.defaultLocale;
  }

  const browserLang = navigator.language.split('-')[0];
  return isValidLocale(browserLang) ? browserLang : i18nConfig.defaultLocale;
}






