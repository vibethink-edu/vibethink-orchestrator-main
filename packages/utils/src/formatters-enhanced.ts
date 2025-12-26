/**
 * Enhanced Formatters
 * 
 * Formatters that use the Regional Configuration System for consistent
 * date, number, currency, and time formatting across the monorepo.
 * 
 * These formatters respect hierarchical configuration (system → company → user)
 * and provide a consistent API for all formatting needs.
 */

import {
  getRegionalConfig,
  RegionalConfiguration,
  DateFormatPreset,
  TimeFormatPreset,
} from './regional-config';

/**
 * Format a number according to regional configuration
 */
export function formatNumber(
  value: number,
  options?: {
    config?: RegionalConfiguration;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const numberConfig = config.number;

  const formatter = new Intl.NumberFormat(numberConfig.locale, {
    minimumFractionDigits: options?.minimumFractionDigits ?? numberConfig.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? numberConfig.maximumFractionDigits ?? 2,
    useGrouping: options?.useGrouping ?? numberConfig.useGrouping ?? true,
  });

  return formatter.format(value);
}

/**
 * Format currency according to regional configuration
 */
export function formatCurrency(
  amount: number,
  options?: {
    config?: RegionalConfiguration;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const currencyConfig = config.currency;

  const currency = options?.currency || currencyConfig.currency;
  const locale = currencyConfig.locale;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: options?.minimumFractionDigits ?? currencyConfig.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? currencyConfig.maximumFractionDigits ?? 2,
  });

  let formatted = formatter.format(amount);

  // Apply custom symbol if provided
  if (currencyConfig.symbol) {
    const parts = formatter.formatToParts(amount);
    const currencyPart = parts.find(p => p.type === 'currency');
    if (currencyPart) {
      formatted = formatted.replace(currencyPart.value, currencyConfig.symbol);
    }
  }

  return formatted;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  options?: {
    config?: RegionalConfiguration;
    decimals?: number;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const numberConfig = config.number;
  const decimals = options?.decimals ?? 1;

  const formatter = new Intl.NumberFormat(numberConfig.locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Value should be 0-1 for percentage (e.g., 0.15 for 15%)
  return formatter.format(value);
}

/**
 * Format date according to regional configuration
 */
export function formatDate(
  date: Date | string,
  options?: {
    config?: RegionalConfiguration;
    preset?: DateFormatPreset;
    formatOptions?: Intl.DateTimeFormatOptions;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const dateConfig = config.date;
  const preset = options?.preset || dateConfig.format || 'short';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Build format options based on preset
  let formatOptions: Intl.DateTimeFormatOptions = {};

  switch (preset) {
    case 'short':
      formatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
      break;
    case 'medium':
      formatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      break;
    case 'long':
      formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      break;
    case 'full':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      break;
    case 'iso':
      return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    case 'custom':
      // For custom patterns, we'd need a library like date-fns
      // For now, fall back to medium
      formatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      break;
  }

  // Merge with provided options
  formatOptions = { ...formatOptions, ...options?.formatOptions };

  const formatter = new Intl.DateTimeFormat(dateConfig.locale, {
    ...formatOptions,
    timeZone: dateConfig.timezone,
  });

  return formatter.format(dateObj);
}

/**
 * Format time according to regional configuration
 */
export function formatTime(
  date: Date | string,
  options?: {
    config?: RegionalConfiguration;
    preset?: TimeFormatPreset;
    showSeconds?: boolean;
    showTimezone?: boolean;
  }
): string {
  const config = options?.config || getRegionalConfig();
  const timeConfig = config.time;
  const preset = options?.preset || timeConfig.format || '12h';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const showSeconds = options?.showSeconds ?? timeConfig.showSeconds ?? false;
  const showTimezone = options?.showTimezone ?? timeConfig.showTimezone ?? false;

  let formatOptions: Intl.DateTimeFormatOptions = {};

  switch (preset) {
    case '12h':
      formatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: true,
      };
      break;
    case '24h':
      formatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: false,
      };
      break;
    case '12h-seconds':
      formatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      break;
    case '24h-seconds':
      formatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      break;
  }

  if (showTimezone) {
    formatOptions.timeZoneName = 'short';
  }

  const formatter = new Intl.DateTimeFormat(timeConfig.locale, {
    ...formatOptions,
    timeZone: timeConfig.timezone,
  });

  return formatter.format(dateObj);
}

/**
 * Format date and time together
 */
export function formatDateTime(
  date: Date | string,
  options?: {
    config?: RegionalConfiguration;
    datePreset?: DateFormatPreset;
    timePreset?: TimeFormatPreset;
    separator?: string;
  }
): string {
  const dateStr = formatDate(date, { config: options?.config, preset: options?.datePreset });
  const timeStr = formatTime(date, { config: options?.config, preset: options?.timePreset });
  const separator = options?.separator || ' ';

  return `${dateStr}${separator}${timeStr}`;
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(
  date: Date | string,
  options?: {
    config?: RegionalConfiguration;
    unit?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
    numeric?: 'always' | 'auto';
  }
): string {
  const config = options?.config || getRegionalConfig();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  const rtf = new Intl.RelativeTimeFormat(config.number.locale, {
    numeric: options?.numeric || 'auto',
  });

  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (options?.unit) {
    switch (options.unit) {
      case 'year':
        return rtf.format(diffInYears, 'year');
      case 'month':
        return rtf.format(diffInMonths, 'month');
      case 'day':
        return rtf.format(diffInDays, 'day');
      case 'hour':
        return rtf.format(diffInHours, 'hour');
      case 'minute':
        return rtf.format(diffInMinutes, 'minute');
      case 'second':
        return rtf.format(diffInSeconds, 'second');
    }
  }

  // Auto-select unit
  if (Math.abs(diffInYears) >= 1) return rtf.format(diffInYears, 'year');
  if (Math.abs(diffInMonths) >= 1) return rtf.format(diffInMonths, 'month');
  if (Math.abs(diffInDays) >= 1) return rtf.format(diffInDays, 'day');
  if (Math.abs(diffInHours) >= 1) return rtf.format(diffInHours, 'hour');
  if (Math.abs(diffInMinutes) >= 1) return rtf.format(diffInMinutes, 'minute');
  return rtf.format(diffInSeconds, 'second');
}







