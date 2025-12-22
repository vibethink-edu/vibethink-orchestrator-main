/**
 * Regional Configuration System
 * 
 * Centralized configuration for dates, numbers, currency, and regional standards.
 * Supports hierarchical configuration: System → Company → User
 * 
 * This system provides a single source of truth for all formatting configurations
 * across the monorepo, with support for multi-tenancy and user-specific preferences.
 */

/**
 * Regional configuration levels
 * Higher levels override lower levels
 */
export type ConfigurationLevel = 'system' | 'company' | 'user';

/**
 * Date format presets
 */
export type DateFormatPreset = 
  | 'short'        // 12/31/2024
  | 'medium'       // Dec 31, 2024
  | 'long'         // December 31, 2024
  | 'full'         // Tuesday, December 31, 2024
  | 'iso'          // 2024-12-31
  | 'custom';      // Custom format string

/**
 * Time format presets
 */
export type TimeFormatPreset = 
  | '12h'          // 3:45 PM
  | '24h'          // 15:45
  | '12h-seconds'  // 3:45:30 PM
  | '24h-seconds'; // 15:45:30

/**
 * Number format configuration
 */
export interface NumberFormatConfig {
  /** Locale for number formatting (e.g., 'en-US', 'es-ES', 'de-DE') */
  locale: string;
  /** Minimum fraction digits */
  minimumFractionDigits?: number;
  /** Maximum fraction digits */
  maximumFractionDigits?: number;
  /** Use grouping separator (e.g., 1,000 vs 1000) */
  useGrouping?: boolean;
  /** Grouping separator (default: locale-based) */
  groupingSeparator?: string;
  /** Decimal separator (default: locale-based) */
  decimalSeparator?: string;
}

/**
 * Currency format configuration
 */
export interface CurrencyFormatConfig {
  /** Currency code (ISO 4217, e.g., 'USD', 'EUR', 'GBP') */
  currency: string;
  /** Locale for currency formatting */
  locale: string;
  /** Minimum fraction digits */
  minimumFractionDigits?: number;
  /** Maximum fraction digits */
  maximumFractionDigits?: number;
  /** Currency symbol position: 'prefix' | 'suffix' */
  symbolPosition?: 'prefix' | 'suffix';
  /** Custom currency symbol (overrides default) */
  symbol?: string;
}

/**
 * Date format configuration
 */
export interface DateFormatConfig {
  /** Locale for date formatting */
  locale: string;
  /** Timezone (IANA timezone, e.g., 'America/New_York', 'Europe/Madrid') */
  timezone?: string;
  /** Date format preset */
  format?: DateFormatPreset;
  /** Custom date format pattern (when format is 'custom') */
  customPattern?: string;
  /** First day of week: 0 (Sunday) to 6 (Saturday) */
  firstDayOfWeek?: number;
  /** Week numbering system: 'ISO' | 'US' */
  weekNumbering?: 'ISO' | 'US';
}

/**
 * Time format configuration
 */
export interface TimeFormatConfig {
  /** Locale for time formatting */
  locale: string;
  /** Timezone (IANA timezone) */
  timezone?: string;
  /** Time format preset */
  format?: TimeFormatPreset;
  /** Show seconds */
  showSeconds?: boolean;
  /** Show timezone */
  showTimezone?: boolean;
}

/**
 * Complete regional configuration
 */
export interface RegionalConfiguration {
  /** Configuration level */
  level: ConfigurationLevel;
  /** Number formatting */
  number: NumberFormatConfig;
  /** Currency formatting */
  currency: CurrencyFormatConfig;
  /** Date formatting */
  date: DateFormatConfig;
  /** Time formatting */
  time: TimeFormatConfig;
  /** Metadata */
  metadata?: {
    /** Configuration source identifier */
    source?: string;
    /** Last updated timestamp */
    lastUpdated?: Date;
    /** Configuration version */
    version?: string;
  };
}

/**
 * System-level default configurations by locale
 */
const SYSTEM_DEFAULTS: Record<string, Partial<RegionalConfiguration>> = {
  'en-US': {
    number: {
      locale: 'en-US',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    },
    currency: {
      currency: 'USD',
      locale: 'en-US',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      symbolPosition: 'prefix',
    },
    date: {
      locale: 'en-US',
      timezone: 'America/New_York',
      format: 'short',
      firstDayOfWeek: 0, // Sunday
      weekNumbering: 'US',
    },
    time: {
      locale: 'en-US',
      timezone: 'America/New_York',
      format: '12h',
      showSeconds: false,
      showTimezone: false,
    },
  },
  'es-ES': {
    number: {
      locale: 'es-ES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    },
    currency: {
      currency: 'EUR',
      locale: 'es-ES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      symbolPosition: 'suffix',
    },
    date: {
      locale: 'es-ES',
      timezone: 'Europe/Madrid',
      format: 'short',
      firstDayOfWeek: 1, // Monday
      weekNumbering: 'ISO',
    },
    time: {
      locale: 'es-ES',
      timezone: 'Europe/Madrid',
      format: '24h',
      showSeconds: false,
      showTimezone: false,
    },
  },
  'es-MX': {
    number: {
      locale: 'es-MX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    },
    currency: {
      currency: 'MXN',
      locale: 'es-MX',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      symbolPosition: 'prefix',
    },
    date: {
      locale: 'es-MX',
      timezone: 'America/Mexico_City',
      format: 'short',
      firstDayOfWeek: 0, // Sunday
      weekNumbering: 'US',
    },
    time: {
      locale: 'es-MX',
      timezone: 'America/Mexico_City',
      format: '24h',
      showSeconds: false,
      showTimezone: false,
    },
  },
};

/**
 * Regional Configuration Manager
 * 
 * Manages hierarchical configuration with support for system, company, and user levels
 */
export class RegionalConfigManager {
  private systemConfig: RegionalConfiguration | null = null;
  private companyConfig: Partial<RegionalConfiguration> | null = null;
  private userConfig: Partial<RegionalConfiguration> | null = null;

  /**
   * Initialize with system default based on locale
   */
  constructor(systemLocale: string = 'en-US') {
    const systemDefault = SYSTEM_DEFAULTS[systemLocale] || SYSTEM_DEFAULTS['en-US'];
    this.systemConfig = {
      level: 'system',
      number: systemDefault.number!,
      currency: systemDefault.currency!,
      date: systemDefault.date!,
      time: systemDefault.time!,
      metadata: {
        source: 'system',
        lastUpdated: new Date(),
        version: '1.0.0',
      },
    } as RegionalConfiguration;
  }

  /**
   * Set company-level configuration (overrides system defaults)
   */
  setCompanyConfig(config: Partial<RegionalConfiguration>): void {
    this.companyConfig = {
      ...config,
      level: 'company',
    };
    // Limpiar cache de terminología al cambiar configuración
    this.clearTerminologyCache();
  }

  /**
   * Set user-level configuration (overrides company and system)
   */
  setUserConfig(config: Partial<RegionalConfiguration>): void {
    this.userConfig = {
      ...config,
      level: 'user',
    };
    // Limpiar cache de terminología al cambiar configuración
    this.clearTerminologyCache();
  }
  
  /**
   * Set locale (clears terminology cache)
   */
  setLocale(locale: string): void {
    if (this.systemConfig) {
      this.systemConfig.number.locale = locale;
      this.systemConfig.currency.locale = locale;
      this.systemConfig.date.locale = locale;
      this.systemConfig.time.locale = locale;
    }
    this.clearTerminologyCache();
  }
  
  /**
   * Set context (clears terminology cache)
   */
  setContext(context: string | null): void {
    // Context se almacena en metadata o configuración específica
    // Por ahora, limpiar cache cuando cambia contexto
    this.clearTerminologyCache();
  }
  
  /**
   * Set tenant ID (clears terminology cache)
   */
  setTenantId(tenantId: string | null): void {
    // Tenant ID se almacena en metadata
    // Limpiar cache cuando cambia tenant
    this.clearTerminologyCache();
  }
  
  /**
   * Limpia cache de terminología
   * Se llama automáticamente cuando cambia locale, context, o tenantId
   */
  private clearTerminologyCache(): void {
    // Importar dinámicamente para evitar dependencia circular
    try {
      const { clearTerminologyCache } = require('./i18n/terminology-cache');
      clearTerminologyCache();
    } catch (error) {
      // Si no está disponible, ignorar (puede no estar inicializado aún)
      console.warn('[RegionalConfig] Terminology cache not available:', error);
    }
  }

  /**
   * Get merged configuration (user > company > system)
   */
  getConfig(): RegionalConfiguration {
    const merged: RegionalConfiguration = {
      ...this.systemConfig!,
      ...(this.companyConfig && {
        number: { ...this.systemConfig!.number, ...this.companyConfig.number },
        currency: { ...this.systemConfig!.currency, ...this.companyConfig.currency },
        date: { ...this.systemConfig!.date, ...this.companyConfig.date },
        time: { ...this.systemConfig!.time, ...this.companyConfig.time },
        level: 'company' as ConfigurationLevel,
      }),
      ...(this.userConfig && {
        number: {
          ...(this.companyConfig?.number || this.systemConfig!.number),
          ...this.userConfig.number,
        },
        currency: {
          ...(this.companyConfig?.currency || this.systemConfig!.currency),
          ...this.userConfig.currency,
        },
        date: {
          ...(this.companyConfig?.date || this.systemConfig!.date),
          ...this.userConfig.date,
        },
        time: {
          ...(this.companyConfig?.time || this.systemConfig!.time),
          ...this.userConfig.time,
        },
        level: 'user' as ConfigurationLevel,
      }),
    };

    return merged;
  }

  /**
   * Get configuration for a specific level
   */
  getConfigForLevel(level: ConfigurationLevel): Partial<RegionalConfiguration> | null {
    switch (level) {
      case 'system':
        return this.systemConfig;
      case 'company':
        return this.companyConfig;
      case 'user':
        return this.userConfig;
      default:
        return null;
    }
  }

  /**
   * Clear user-level configuration (fallback to company/system)
   */
  clearUserConfig(): void {
    this.userConfig = null;
  }

  /**
   * Clear company-level configuration (fallback to system)
   */
  clearCompanyConfig(): void {
    this.companyConfig = null;
  }

  /**
   * Reset to system defaults
   */
  reset(systemLocale: string = 'en-US'): void {
    const systemDefault = SYSTEM_DEFAULTS[systemLocale] || SYSTEM_DEFAULTS['en-US'];
    this.systemConfig = {
      level: 'system',
      number: systemDefault.number!,
      currency: systemDefault.currency!,
      date: systemDefault.date!,
      time: systemDefault.time!,
      metadata: {
        source: 'system',
        lastUpdated: new Date(),
        version: '1.0.0',
      },
    } as RegionalConfiguration;
    this.companyConfig = null;
    this.userConfig = null;
    // Limpiar cache al resetear
    this.clearTerminologyCache();
  }
}

/**
 * Global instance (singleton pattern)
 * This should be initialized once per application/tenant context
 */
let globalConfigManager: RegionalConfigManager | null = null;

/**
 * Initialize global configuration manager
 */
export function initializeRegionalConfig(systemLocale: string = 'en-US'): RegionalConfigManager {
  globalConfigManager = new RegionalConfigManager(systemLocale);
  return globalConfigManager;
}

/**
 * Get global configuration manager instance
 */
export function getRegionalConfigManager(): RegionalConfigManager {
  if (!globalConfigManager) {
    globalConfigManager = new RegionalConfigManager();
  }
  return globalConfigManager;
}

/**
 * Helper function to get active configuration
 */
export function getRegionalConfig(): RegionalConfiguration {
  return getRegionalConfigManager().getConfig();
}

