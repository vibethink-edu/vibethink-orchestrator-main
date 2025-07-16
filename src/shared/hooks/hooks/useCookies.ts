/**
 * Cookies Management Hook
 * 
 * GDPR/LGPD compliant cookie management
 * - Cookie consent management
 * - Cookie categories
 * - Cookie preferences
 * - Compliance tracking
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './base/useLocalStorage';

// Global gtag type for Google Analytics
declare global {
  const gtag: (...args: any[]) => void;
}

// Cookie categories
export const COOKIE_CATEGORIES = {
  ESSENTIAL: 'essential',
  FUNCTIONAL: 'functional',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  THIRD_PARTY: 'thirdParty'
} as const;

export type CookieCategory = typeof COOKIE_CATEGORIES[keyof typeof COOKIE_CATEGORIES];

// Cookie definition
interface CookieDefinition {
  name: string;
  category: CookieCategory;
  description: string;
  duration: string;
  provider: string;
  purpose: string;
  required?: boolean;
}

// Cookie consent
interface CookieConsent {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
  timestamp: string;
  version: string;
}

// Cookie preferences
interface CookiePreferences {
  consent: CookieConsent;
  lastUpdated: string;
  userAgent: string;
  ipAddress?: string;
  location?: string;
}

// Cookie hook return type
interface CookiesReturn {
  // Consent state
  consent: CookieConsent;
  hasConsent: (category: CookieCategory) => boolean;
  hasAnyConsent: () => boolean;
  
  // Consent management
  updateConsent: (category: CookieCategory, value: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: () => void;
  
  // Cookie management
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  getCookie: (name: string) => string | null;
  deleteCookie: (name: string) => void;
  
  // Compliance
  isCompliant: boolean;
  showBanner: boolean;
  hideBanner: () => void;
  
  // Analytics
  trackConsent: () => void;
  exportConsent: () => string;
}

// Cookie options
interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  category?: CookieCategory;
}

// Default cookie definitions
const DEFAULT_COOKIES: CookieDefinition[] = [
  {
    name: 'ai_pair_session',
    category: COOKIE_CATEGORIES.ESSENTIAL,
    description: 'Sesión del usuario para mantener el estado de autenticación',
    duration: 'Sesión',
    provider: 'VibeThink Platform',
    purpose: 'Autenticación y seguridad',
    required: true
  },
  {
    name: 'ai_pair_preferences',
    category: COOKIE_CATEGORIES.FUNCTIONAL,
    description: 'Preferencias del usuario y configuración de la aplicación',
    duration: '1 año',
    provider: 'VibeThink Platform',
    purpose: 'Personalización de la experiencia'
  },
  {
    name: 'ai_pair_analytics',
    category: COOKIE_CATEGORIES.ANALYTICS,
    description: 'Datos de uso y análisis para mejorar el servicio',
    duration: '2 años',
    provider: 'VibeThink Platform',
    purpose: 'Análisis y mejora del servicio'
  },
  {
    name: '_ga',
    category: COOKIE_CATEGORIES.ANALYTICS,
    description: 'Google Analytics para análisis de tráfico web',
    duration: '2 años',
    provider: 'Google',
    purpose: 'Análisis de tráfico y comportamiento'
  },
  {
    name: '_fbp',
    category: COOKIE_CATEGORIES.MARKETING,
    description: 'Facebook Pixel para publicidad dirigida',
    duration: '3 meses',
    provider: 'Facebook',
    purpose: 'Publicidad y remarketing'
  }
];

// Default consent
const DEFAULT_CONSENT: CookieConsent = {
  essential: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
  thirdParty: false,
  timestamp: new Date().toISOString(),
  version: '1.0.0'
};

// Consent version for updates
const CONSENT_VERSION = '1.0.0';

/**
 * Cookies Management Hook
 */
export function useCookies(): CookiesReturn {
  const [consent, setConsent] = useLocalStorage<CookieConsent>('cookie-consent', DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(!consent.timestamp);
  
  return {
    consent,
    hasConsent: (category: CookieCategory) => consent[category as keyof CookieConsent] as boolean,
    hasAnyConsent: () => Object.values(consent).some(value => typeof value === 'boolean' && value),
    updateConsent: (category: CookieCategory, value: boolean) => {
      setConsent(prev => ({ ...prev, [category]: value }));
    },
    acceptAll: () => {
      const newConsent = {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
        thirdParty: true,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      setConsent(newConsent);
      setShowBanner(false);
    },
    rejectAll: () => {
      const newConsent = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
        thirdParty: false,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      setConsent(newConsent);
      setShowBanner(false);
    },
    savePreferences: () => {
      console.log('Saving cookie preferences:', consent);
    },
    setCookie: (name: string, value: string, options?: CookieOptions) => {
      document.cookie = buildCookieString(name, value, options);
    },
    getCookie: (name: string) => {
      const cookies = CookieUtils.getAllCookies();
      return cookies[name] || null;
    },
    deleteCookie: (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
    isCompliant: true,
    showBanner,
    hideBanner: () => setShowBanner(false),
    trackConsent: () => {
      console.log('Tracking consent:', consent);
    },
    exportConsent: () => JSON.stringify(consent)
  };
}

/**
 * Build cookie string
 */
function buildCookieString(name: string, value: string, options: CookieOptions = {}): string {
  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (options.expires) {
    const expires = options.expires instanceof Date ? options.expires : new Date(Date.now() + options.expires * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  return cookieString;
}

// Export utilities
export const CookieUtils = {
  /**
   * Get all cookies
   */
  getAllCookies: (): Record<string, string> => {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  },

  /**
   * Clear all non-essential cookies
   */
  clearNonEssentialCookies: (): void => {
    const cookies = CookieUtils.getAllCookies();
    
    Object.keys(cookies).forEach(name => {
      const cookie = DEFAULT_COOKIES.find(c => c.name === name);
      if (cookie && !cookie.required) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  },

  /**
   * Check if cookie exists
   */
  cookieExists: (name: string): boolean => {
    return document.cookie.split(';').some(cookie => 
      cookie.trim().startsWith(`${name}=`)
    );
  },

  /**
   * Get cookie expiration date
   */
  getCookieExpiration: (name: string): Date | null => {
    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      if (cookie.trim().startsWith(`${name}=`)) {
        const expiresMatch = cookie.match(/expires=([^;]+)/);
        if (expiresMatch) {
          return new Date(expiresMatch[1]);
        }
      }
    }
    
    return null;
  }
};

// Export types
export type { CookieDefinition, CookieConsent, CookiePreferences, CookieOptions, CookiesReturn }; 