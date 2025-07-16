/**
 * Cookies Hook
 * 
 * Hook para manejar cookies y consentimiento
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  FUNCTIONAL: 'functional'
} as const;

export const useCookies = () => {
  const [cookieConsent, setCookieConsent] = useState<Record<string, boolean>>({
    [COOKIE_CATEGORIES.NECESSARY]: true,
    [COOKIE_CATEGORIES.ANALYTICS]: false,
    [COOKIE_CATEGORIES.MARKETING]: false,
    [COOKIE_CATEGORIES.FUNCTIONAL]: false
  });

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    } else {
      setShowBanner(true);
    }
  }, []);

  const updateConsent = (category: string, value: boolean) => {
    const newConsent = { ...cookieConsent, [category]: value };
    setCookieConsent(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
  };

  const acceptAll = () => {
    const allAccepted = Object.keys(COOKIE_CATEGORIES).reduce((acc, key) => {
      acc[COOKIE_CATEGORIES[key as keyof typeof COOKIE_CATEGORIES]] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setCookieConsent(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      [COOKIE_CATEGORIES.NECESSARY]: true,
      [COOKIE_CATEGORIES.ANALYTICS]: false,
      [COOKIE_CATEGORIES.MARKETING]: false,
      [COOKIE_CATEGORIES.FUNCTIONAL]: false
    };
    
    setCookieConsent(onlyNecessary);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  return {
    cookieConsent,
    showBanner,
    updateConsent,
    acceptAll,
    rejectAll,
    COOKIE_CATEGORIES
  };
}; 