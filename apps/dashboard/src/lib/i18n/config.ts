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
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'hh:mm a',
    currency: 'SAR',
    numberFormat: new Intl.Locale('ar-SA'),
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dateFormat: 'yyyy/MM/dd',
    timeFormat: 'HH:mm',
    currency: 'CNY',
    numberFormat: new Intl.Locale('zh-CN'),
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: new Intl.Locale('fr-FR'),
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'BRL',
    numberFormat: new Intl.Locale('pt-BR'),
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: new Intl.Locale('de-DE'),
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: new Intl.Locale('it-IT'),
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    dateFormat: 'yyyy. MM. dd.',
    timeFormat: 'HH:mm',
    currency: 'KRW',
    numberFormat: new Intl.Locale('ko-KR'),
  },
};

/**
 * i18n configuration
 */
export const i18nConfig: I18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko'],
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






