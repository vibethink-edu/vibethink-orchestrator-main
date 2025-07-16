/**
 * Centralized Formatters
 * 
 * Provides standardized data formatting functions
 * - Currency formatting
 * - Date formatting
 * - Phone number formatting
 * - Document formatting
 * - Text formatting
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

// Formatter options
interface CurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

interface DateOptions {
  locale?: string;
  format?: 'short' | 'long' | 'relative' | 'iso' | 'custom';
  customFormat?: string;
}

interface PhoneOptions {
  country?: string;
  format?: 'national' | 'international' | 'e164';
}

// Default options
const defaultCurrencyOptions: Required<CurrencyOptions> = {
  currency: 'COP',
  locale: 'es-CO',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
};

const defaultDateOptions: Required<DateOptions> = {
  locale: 'es-CO',
  format: 'short',
  customFormat: 'dd/MM/yyyy'
};

const defaultPhoneOptions: Required<PhoneOptions> = {
  country: 'CO',
  format: 'national'
};

/**
 * Currency formatters
 */
export const currency = {
  /**
   * Format currency value
   */
  format: (amount: number, options: CurrencyOptions = {}): string => {
    const opts = { ...defaultCurrencyOptions, ...options };
    
    try {
      return new Intl.NumberFormat(opts.locale, {
        style: 'currency',
        currency: opts.currency,
        minimumFractionDigits: opts.minimumFractionDigits,
        maximumFractionDigits: opts.maximumFractionDigits
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      return `${opts.currency} ${amount.toFixed(opts.maximumFractionDigits)}`;
    }
  },

  /**
   * Format Colombian Peso
   */
  cop: (amount: number): string => {
    return currency.format(amount, { currency: 'COP' });
  },

  /**
   * Format US Dollar
   */
  usd: (amount: number): string => {
    return currency.format(amount, { currency: 'USD' });
  },

  /**
   * Format Euro
   */
  eur: (amount: number): string => {
    return currency.format(amount, { currency: 'EUR' });
  },

  /**
   * Parse currency string to number
   */
  parse: (value: string, locale: string = 'es-CO'): number => {
    try {
      // Remove currency symbols and spaces
      const cleanValue = value.replace(/[^\d.,-]/g, '');
      
      // Handle different decimal separators
      const parts = cleanValue.split(/[,.]/);
      if (parts.length === 2) {
        const integer = parts[0].replace(/\D/g, '');
        const decimal = parts[1];
        return parseFloat(`${integer}.${decimal}`);
      }
      
      return parseFloat(cleanValue.replace(/\D/g, ''));
    } catch (error) {
      return 0;
    }
  },

  /**
   * Format percentage
   */
  percentage: (value: number, decimals: number = 2): string => {
    return `${value.toFixed(decimals)}%`;
  }
};

/**
 * Date formatters
 */
export const date = {
  /**
   * Format date
   */
  format: (date: Date | string | number, options: DateOptions = {}): string => {
    const opts = { ...defaultDateOptions, ...options };
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }

    try {
      switch (opts.format) {
        case 'short':
          return new Intl.DateTimeFormat(opts.locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(dateObj);

        case 'long':
          return new Intl.DateTimeFormat(opts.locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(dateObj);

        case 'relative':
          return date.relative(dateObj);

        case 'iso':
          return dateObj.toISOString();

        case 'custom':
          return date.customFormat(dateObj, opts.customFormat);

        default:
          return new Intl.DateTimeFormat(opts.locale).format(dateObj);
      }
    } catch (error) {
      return dateObj.toLocaleDateString();
    }
  },

  /**
   * Relative date formatting
   */
  relative: (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `Hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
  },

  /**
   * Custom date formatting
   */
  customFormat: (date: Date, format: string): string => {
    const replacements: Record<string, string> = {
      'yyyy': date.getFullYear().toString(),
      'yy': date.getFullYear().toString().slice(-2),
      'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
      'M': (date.getMonth() + 1).toString(),
      'dd': date.getDate().toString().padStart(2, '0'),
      'd': date.getDate().toString(),
      'HH': date.getHours().toString().padStart(2, '0'),
      'H': date.getHours().toString(),
      'mm': date.getMinutes().toString().padStart(2, '0'),
      'm': date.getMinutes().toString(),
      'ss': date.getSeconds().toString().padStart(2, '0'),
      's': date.getSeconds().toString()
    };

    let result = format;
    Object.entries(replacements).forEach(([pattern, value]) => {
      result = result.replace(new RegExp(pattern, 'g'), value);
    });

    return result;
  },

  /**
   * Format time
   */
  time: (date: Date | string | number): string => {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  },

  /**
   * Format date and time
   */
  datetime: (date: Date | string | number): string => {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }
};

/**
 * Phone number formatters
 */
export const phone = {
  /**
   * Format phone number
   */
  format: (phoneNumber: string, options: PhoneOptions = {}): string => {
    const opts = { ...defaultPhoneOptions, ...options };
    
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 7) {
      return phoneNumber; // Return original if too short
    }

    switch (opts.country) {
      case 'CO':
        return phone.formatColombian(cleanNumber, opts.format);
      
      default:
        return phoneNumber;
    }
  },

  /**
   * Format Colombian phone number
   */
  formatColombian: (number: string, format: string = 'national'): string => {
    if (number.length === 10) {
      // Mobile or landline
      if (number.startsWith('3')) {
        // Mobile
        return format === 'international' 
          ? `+57 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
          : `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
      } else {
        // Landline
        return format === 'international'
          ? `+57 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`
          : `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`;
      }
    } else if (number.length === 11 && number.startsWith('57')) {
      // International format
      const localNumber = number.slice(2);
      return phone.formatColombian(localNumber, format);
    }

    return number;
  },

  /**
   * Parse phone number to E.164 format
   */
  parse: (phoneNumber: string, country: string = 'CO'): string => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (country === 'CO') {
      if (cleanNumber.length === 10) {
        return `+57${cleanNumber}`;
      } else if (cleanNumber.length === 11 && cleanNumber.startsWith('57')) {
        return `+${cleanNumber}`;
      }
    }
    
    return phoneNumber;
  }
};

/**
 * Document formatters
 */
export const document = {
  /**
   * Format Colombian ID (Cédula de Ciudadanía)
   */
  cc: (number: string): string => {
    const cleanNumber = number.replace(/\D/g, '');
    
    if (cleanNumber.length === 10) {
      return `${cleanNumber.slice(0, 1)}.${cleanNumber.slice(1, 4)}.${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7)}`;
    } else if (cleanNumber.length === 11) {
      return `${cleanNumber.slice(0, 2)}.${cleanNumber.slice(2, 5)}.${cleanNumber.slice(5, 8)}-${cleanNumber.slice(8)}`;
    }
    
    return number;
  },

  /**
   * Format NIT
   */
  nit: (number: string): string => {
    const cleanNumber = number.replace(/\D/g, '');
    
    if (cleanNumber.length >= 9) {
      const mainPart = cleanNumber.slice(0, -1);
      const checkDigit = cleanNumber.slice(-1);
      return `${mainPart}-${checkDigit}`;
    }
    
    return number;
  },

  /**
   * Format passport
   */
  passport: (number: string): string => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (cleanNumber.length > 6) {
      // Add spaces every 3 characters
      return cleanNumber.match(/.{1,3}/g)?.join(' ') || cleanNumber;
    }
    
    return cleanNumber;
  }
};

/**
 * Text formatters
 */
export const text = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Capitalize all words
   */
  titleCase: (str: string): string => {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map(word => text.capitalize(word))
      .join(' ');
  },

  /**
   * Truncate text
   */
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + suffix;
  },

  /**
   * Convert to slug
   */
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  },

  /**
   * Generate initials
   */
  initials: (name: string): string => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  /**
   * Mask sensitive data
   */
  mask: (str: string, type: 'email' | 'phone' | 'document' | 'custom' = 'custom'): string => {
    if (!str) return str;

    switch (type) {
      case 'email':
        const [local, domain] = str.split('@');
        return `${local.charAt(0)}***@${domain}`;
      
      case 'phone':
        return str.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2');
      
      case 'document':
        return str.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2');
      
      default:
        return str.replace(/(.{2}).*(.{2})/, '$1***$2');
    }
  }
};

/**
 * Number formatters
 */
export const number = {
  /**
   * Format number with thousands separator
   */
  format: (num: number, locale: string = 'es-CO'): string => {
    return new Intl.NumberFormat(locale).format(num);
  },

  /**
   * Format decimal number
   */
  decimal: (num: number, decimals: number = 2, locale: string = 'es-CO'): string => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  /**
   * Format file size
   */
  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  },

  /**
   * Format duration in seconds
   */
  duration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}; 