/**
 * i18n Utilities
 * 
 * Helper functions for translation and formatting
 */

import { Locale, TranslationDictionary, TranslationNamespace } from './types';
import { getLocaleMetadata } from './config';

/**
 * Deep get value from nested object by path
 * Example: getNestedValue(obj, 'crm.header.title') => obj.crm.header.title
 */
export function getNestedValue(
  obj: TranslationDictionary,
  path: string
): string | undefined {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Replace placeholders in translation string
 * Supports both formats: {param} and {{param}}
 * Example: replaceParams('Hello {name}', { name: 'John' }) => 'Hello John'
 * Example: replaceParams('Hello {{name}}', { name: 'John' }) => 'Hello John'
 */
export function replaceParams(
  template: string,
  params?: Record<string, string | number | boolean>
): string {
  if (!params) return template;

  // First try double braces {{param}} (preferred format)
  let result = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });

  // Then try single braces {param} (fallback for compatibility)
  result = result.replace(/\{(\w+)\}/g, (match, key) => {
    // Skip if already replaced (double braces)
    if (match.startsWith('{{') && match.endsWith('}}')) {
      return match;
    }
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });

  return result;
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const metadata = getLocaleMetadata(locale);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(metadata.numberFormat.language, defaultOptions).format(dateObj);
}

/**
 * Format time according to locale
 */
export function formatTime(
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const metadata = getLocaleMetadata(locale);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat(metadata.numberFormat.language, defaultOptions).format(dateObj);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  currency?: string
): string {
  const metadata = getLocaleMetadata(locale);
  const currencyCode = currency || metadata.currency;

  return new Intl.NumberFormat(metadata.numberFormat.language, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number according to locale
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const metadata = getLocaleMetadata(locale);

  return new Intl.NumberFormat(metadata.numberFormat.language, options).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  locale: Locale,
  decimals: number = 1
): string {
  const metadata = getLocaleMetadata(locale);

  return new Intl.NumberFormat(metadata.numberFormat.language, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Get translation key with namespace
 * Example: getTranslationKey('crm', 'header.title') => 'crm.header.title'
 */
export function getTranslationKey(
  namespace: TranslationNamespace,
  key: string
): string {
  return `${namespace}.${key}`;
}

/**
 * Parse translation key to extract namespace and key
 * Example: parseTranslationKey('crm.header.title') => { namespace: 'crm', key: 'header.title' }
 */
export function parseTranslationKey(
  fullKey: string
): { namespace: TranslationNamespace; key: string } | null {
  const parts = fullKey.split('.');
  if (parts.length < 2) return null;

  const namespace = parts[0] as TranslationNamespace;
  const key = parts.slice(1).join('.');

  return { namespace, key };
}



