/**
 * Locale Configuration - Currency, Numbers, and Voice
 * 
 * Defines locale-specific settings for:
 * - Currency symbols and formatting
 * - Number formatting (decimals, thousands separators)
 * - Voice agent language settings
 */

export type SupportedLocale = 'en' | 'es' | 'ar' | 'zh' | 'fr' | 'pt' | 'de';

export interface LocaleConfig {
    code: SupportedLocale;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    currency: {
        code: string;
        symbol: string;
        position: 'before' | 'after';
        decimals: number;
    };
    numbers: {
        decimalSeparator: string;
        thousandsSeparator: string;
    };
    voice: {
        language: string;  // BCP 47 language tag for voice agents
        region: string;    // Region code for voice synthesis
    };
    dateFormat: string;
    timeFormat: '12h' | '24h';
}

export const LOCALE_CONFIGS: Record<SupportedLocale, LocaleConfig> = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        currency: {
            code: 'USD',
            symbol: '$',
            position: 'before',
            decimals: 2
        },
        numbers: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        voice: {
            language: 'en-US',
            region: 'US'
        },
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
    },

    es: {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        direction: 'ltr',
        currency: {
            code: 'USD',  // Can be overridden per region (EUR, MXN, COP, etc.)
            symbol: '$',
            position: 'before',
            decimals: 2
        },
        numbers: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        voice: {
            language: 'es-ES',
            region: 'ES'
        },
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
    },

    ar: {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        direction: 'rtl',
        currency: {
            code: 'SAR',  // Saudi Riyal (can be AED, EGP, etc.)
            symbol: 'ر.س',
            position: 'after',
            decimals: 2
        },
        numbers: {
            decimalSeparator: '٫',  // Arabic decimal separator
            thousandsSeparator: '٬'  // Arabic thousands separator
        },
        voice: {
            language: 'ar-SA',
            region: 'SA'
        },
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h'
    },

    zh: {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        direction: 'ltr',
        currency: {
            code: 'CNY',
            symbol: '¥',
            position: 'before',
            decimals: 2
        },
        numbers: {
            decimalSeparator: '.',
            thousandsSeparator: ','
        },
        voice: {
            language: 'zh-CN',
            region: 'CN'
        },
        dateFormat: 'YYYY/MM/DD',
        timeFormat: '24h'
    },

    fr: {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        direction: 'ltr',
        currency: {
            code: 'EUR',
            symbol: '€',
            position: 'after',
            decimals: 2
        },
        numbers: {
            decimalSeparator: ',',
            thousandsSeparator: ' '  // Non-breaking space
        },
        voice: {
            language: 'fr-FR',
            region: 'FR'
        },
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
    },

    pt: {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        direction: 'ltr',
        currency: {
            code: 'BRL',  // Brazilian Real (can be EUR for Portugal)
            symbol: 'R$',
            position: 'before',
            decimals: 2
        },
        numbers: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        voice: {
            language: 'pt-BR',
            region: 'BR'
        },
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
    },

    de: {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        direction: 'ltr',
        currency: {
            code: 'EUR',
            symbol: '€',
            position: 'after',
            decimals: 2
        },
        numbers: {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        },
        voice: {
            language: 'de-DE',
            region: 'DE'
        },
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h'
    }
};

/**
 * Get locale configuration
 */
export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
    return LOCALE_CONFIGS[locale] || LOCALE_CONFIGS.en;
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
    amount: number,
    locale: SupportedLocale
): string {
    const config = getLocaleConfig(locale);
    const { symbol, position, decimals } = config.currency;
    const { decimalSeparator, thousandsSeparator } = config.numbers;

    // Format number with separators
    const parts = amount.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    const formatted = parts.join(decimalSeparator);

    // Add currency symbol
    return position === 'before'
        ? `${symbol}${formatted}`
        : `${formatted} ${symbol}`;
}

/**
 * Format number according to locale
 */
export function formatNumber(
    value: number,
    locale: SupportedLocale,
    decimals: number = 0
): string {
    const config = getLocaleConfig(locale);
    const { decimalSeparator, thousandsSeparator } = config.numbers;

    const parts = value.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

    return decimals > 0 ? parts.join(decimalSeparator) : parts[0];
}

/**
 * Get voice language for AI agents
 */
export function getVoiceLanguage(locale: SupportedLocale): string {
    const config = getLocaleConfig(locale);
    return config.voice.language;
}

/**
 * Check if locale uses RTL
 */
export function isRTL(locale: SupportedLocale): boolean {
    return getLocaleConfig(locale).direction === 'rtl';
}

/**
 * Get closest locale from user preferences
 * Falls back to English if no match
 */
export function getClosestLocale(
    userLocales: string[]
): SupportedLocale {
    const supported = Object.keys(LOCALE_CONFIGS) as SupportedLocale[];

    for (const userLocale of userLocales) {
        const lang = userLocale.split('-')[0].toLowerCase();

        // Exact match
        if (supported.includes(lang as SupportedLocale)) {
            return lang as SupportedLocale;
        }
    }

    // Default to English
    return 'en';
}
