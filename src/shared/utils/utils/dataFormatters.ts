/**
 * Formateadores de datos para VibeThink Orchestrator
 * @author VibeThink Platform - Developer Experience Team
 */

import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// Locale mapping
const localeMap = {
  es: es,
  en: enUS
};

/**
 * Date and Time Formatters
 */
export class DateFormatters {
  private static getLocale(language: string = 'en') {
    return localeMap[language as keyof typeof localeMap] || enUS;
  }

  static formatDate(date: string | Date, language: string = 'en'): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'PPP', { locale: this.getLocale(language) });
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return 'Invalid date';
    }
  }

  static formatDateTime(date: string | Date, language: string = 'en'): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'PPP p', { locale: this.getLocale(language) });
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return 'Invalid date';
    }
  }

  static formatTimeAgo(date: string | Date, language: string = 'en'): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatDistance(dateObj, new Date(), { 
        addSuffix: true,
        locale: this.getLocale(language) 
      });
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return 'Unknown time';
    }
  }

  static formatRelativeTime(date: string | Date, language: string = 'en'): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatRelative(dateObj, new Date(), { 
        locale: this.getLocale(language) 
      });
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return 'Unknown time';
    }
  }

  static formatShortDate(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'MM/dd/yyyy');
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return 'Invalid date';
    }
  }

  static formatTime(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'HH:mm:ss');
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return 'Invalid time';
    }
  }
}

/**
 * Number and Currency Formatters
 */
export class NumberFormatters {
  static formatCurrency(
    amount: number, 
    currency: string = 'USD', 
    language: string = 'en'
  ): string {
    try {
      const locale = language === 'es' ? 'es-ES' : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  static formatNumber(value: number, language: string = 'en'): string {
    try {
      const locale = language === 'es' ? 'es-ES' : 'en-US';
      return new Intl.NumberFormat(locale).format(value);
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return value.toString();
    }
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    try {
      return `${(value * 100).toFixed(decimals)}%`;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return '0%';
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  static formatUsagePercentage(used: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (used / total) * 100;
    return `${Math.min(100, percentage).toFixed(1)}%`;
  }
}

/**
 * Text and String Formatters
 */
export class TextFormatters {
  static truncate(text: string, maxLength: number = 100, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static titleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  static camelToTitle(camelCase: string): string {
    return camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static initials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 3) return email;
    
    const visibleChars = 2;
    const maskedUsername = username.substring(0, visibleChars) + 
      '*'.repeat(username.length - visibleChars);
    
    return `${maskedUsername}@${domain}`;
  }

  static highlightText(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

/**
 * Status and Badge Formatters
 */
export class StatusFormatters {
  static formatUserRole(role: string, language: string = 'en'): string {
    const roleTranslations = {
      en: {
        // VibeThink Roles (_VT)
        'SUPER_ADMIN_VT': 'Super Admin VibeThink',
        'SUPPORT_VT': 'Soporte Técnico VibeThink',
        'ADMIN_VT': 'Administrador VibeThink',
        'TECH_LEAD_VT': 'Líder Técnico VibeThink',
        'DEVELOPER_VT': 'Desarrollador VibeThink',
        'MANAGER_VT': 'Manager VibeThink',
        'EMPLOYEE_VT': 'Empleado VibeThink',
        // Customer Roles (_CUST)
        'OWNER_CUST': 'Propietario de Empresa',
        'ADMIN_CUST': 'Administrador de Empresa',
        'MANAGER_CUST': 'Gerente de Departamento',
        'EMPLOYEE_CUST': 'Empleado'
      },
      es: {
        // VibeThink Roles (_VT)
        'SUPER_ADMIN_VT': 'Super Admin VibeThink',
        'SUPPORT_VT': 'Soporte VibeThink',
        'DEVELOPER_VT': 'Desarrollador VibeThink',
        'MANAGER_VT': 'Manager VibeThink',
        'EMPLOYEE_VT': 'Empleado VibeThink',
        // Customer Roles (_CUST)
        'OWNER_CUST': 'Propietario',
        'ADMIN_CUST': 'Administrador',
        'MANAGER_CUST': 'Manager',
        'EMPLOYEE_CUST': 'Empleado'
      }
    };

    return roleTranslations[language as keyof typeof roleTranslations]?.[role as keyof typeof roleTranslations.en] || role;
  }

  static formatCompanyStatus(status: string, language: string = 'en'): string {
    const statusTranslations = {
      en: {
        ACTIVE: 'Active',
        TRIAL: 'Trial',
        SUSPENDED: 'Suspended',
        CANCELLED: 'Cancelled'
      },
      es: {
        ACTIVE: 'Activa',
        TRIAL: 'Prueba',
        SUSPENDED: 'Suspendida',
        CANCELLED: 'Cancelada'
      }
    };

    return statusTranslations[language as keyof typeof statusTranslations]?.[status as keyof typeof statusTranslations.en] || status;
  }

  static getStatusVariant(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'COMPLETED':
      case 'SUCCESS':
        return 'default';
      case 'TRIAL':
      case 'PENDING':
      case 'WARNING':
        return 'outline';
      case 'SUSPENDED':
      case 'CANCELLED':
      case 'ERROR':
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  }
}

/**
 * List and Array Formatters
 */
export class ListFormatters {
  static formatList(items: string[], language: string = 'en', maxItems: number = 3): string {
    if (items.length === 0) return '';
    
    const conjunction = language === 'es' ? 'y' : 'and';
    
    if (items.length <= maxItems) {
      if (items.length === 1) return items[0];
      if (items.length === 2) return items.join(` ${conjunction} `);
      return items.slice(0, -1).join(', ') + ` ${conjunction} ${items[items.length - 1]}`;
    }
    
    const remaining = items.length - maxItems;
    const more = language === 'es' ? 'más' : 'more';
    return items.slice(0, maxItems).join(', ') + ` ${conjunction} ${remaining} ${more}`;
  }

  static formatTags(tags: string[], maxTags: number = 3): { visible: string[]; hidden: number } {
    if (tags.length <= maxTags) {
      return { visible: tags, hidden: 0 };
    }
    
    return {
      visible: tags.slice(0, maxTags),
      hidden: tags.length - maxTags
    };
  }
}

/**
 * Unified Formatters Export
 */
export const Formatters = {
  date: DateFormatters,
  number: NumberFormatters,
  text: TextFormatters,
  status: StatusFormatters,
  list: ListFormatters,
  
  // Quick access to commonly used formatters
  currency: NumberFormatters.formatCurrency,
  fileSize: NumberFormatters.formatFileSize,
  timeAgo: DateFormatters.formatTimeAgo,
  truncate: TextFormatters.truncate,
  initials: TextFormatters.initials,
  userRole: StatusFormatters.formatUserRole,
  companyStatus: StatusFormatters.formatCompanyStatus
};
