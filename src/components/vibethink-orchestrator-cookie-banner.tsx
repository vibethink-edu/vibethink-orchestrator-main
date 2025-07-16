/**
 * Banner de Consentimiento de Cookies - VibeThink Orchestrator
 * Metodología: VThink 1.0
 * 
 * Banner moderno y accesible para gestión de cookies
 * con compliance GDPR/CCPA/LGPD
 */

import React, { useState, useEffect } from 'react';
import { useVibeThinkOrchestratorCookieManager } from '@/lib/vibethink-orchestrator-cookie-manager';
import { CookieConsent, ModernCookie } from '@/types/vibethink-orchestrator';

// ============================================================================
// TIPOS DE PROPS
// ============================================================================

interface CookieBannerProps {
  tenantId: string;
  userId?: string;
  language?: 'es' | 'en';
  theme?: 'light' | 'dark';
  onConsentChange?: (consents: Partial<CookieConsent>) => void;
  className?: string;
}

interface CookieCategoryProps {
  title: string;
  description: string;
  essential?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const VibeThinkOrchestratorCookieBanner: React.FC<CookieBannerProps> = ({
  tenantId,
  userId,
  language = 'es',
  theme = 'light',
  onConsentChange,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState<Partial<CookieConsent>>({
    essential_consent: true,
    functional_consent: false,
    analytics_consent: false,
    marketing_consent: false,
    preferences_consent: false
  });

  const {
    updateConsent,
    hasConsent,
    isLoading
  } = useVibeThinkOrchestratorCookieManager(tenantId, userId);

  // Verificar si ya hay consentimiento guardado
  useEffect(() => {
    const hasStoredConsent = localStorage.getItem(`vibethink-cookie-consent-${tenantId}`);
    if (!hasStoredConsent) {
      setIsVisible(true);
    }
  }, [tenantId]);

  // Traducciones
  const translations = {
    es: {
      title: 'Configuración de Cookies',
      subtitle: 'VibeThink Orchestrator utiliza cookies para mejorar tu experiencia',
      description: 'Utilizamos cookies para personalizar contenido, proporcionar funciones de redes sociales y analizar nuestro tráfico. También compartimos información sobre tu uso de nuestro sitio con nuestros socios de redes sociales, publicidad y análisis.',
      acceptAll: 'Aceptar Todas',
      acceptEssential: 'Solo Esenciales',
      customize: 'Personalizar',
      save: 'Guardar Preferencias',
      categories: {
        essential: {
          title: 'Cookies Esenciales',
          description: 'Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.'
        },
        functional: {
          title: 'Cookies Funcionales',
          description: 'Mejoran la funcionalidad y personalización del sitio.'
        },
        analytics: {
          title: 'Cookies de Análisis',
          description: 'Nos ayudan a entender cómo interactúas con el sitio.'
        },
        marketing: {
          title: 'Cookies de Marketing',
          description: 'Utilizadas para mostrar publicidad relevante.'
        },
        preferences: {
          title: 'Cookies de Preferencias',
          description: 'Almacenan tus preferencias y configuraciones.'
        }
      },
      details: 'Ver Detalles',
      hideDetails: 'Ocultar Detalles',
      learnMore: 'Más Información',
      privacyPolicy: 'Política de Privacidad'
    },
    en: {
      title: 'Cookie Settings',
      subtitle: 'VibeThink Orchestrator uses cookies to enhance your experience',
      description: 'We use cookies to personalize content, provide social media features and analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.',
      acceptAll: 'Accept All',
      acceptEssential: 'Essential Only',
      customize: 'Customize',
      save: 'Save Preferences',
      categories: {
        essential: {
          title: 'Essential Cookies',
          description: 'Necessary for basic site functionality. Cannot be disabled.'
        },
        functional: {
          title: 'Functional Cookies',
          description: 'Enhance site functionality and personalization.'
        },
        analytics: {
          title: 'Analytics Cookies',
          description: 'Help us understand how you interact with the site.'
        },
        marketing: {
          title: 'Marketing Cookies',
          description: 'Used to display relevant advertising.'
        },
        preferences: {
          title: 'Preference Cookies',
          description: 'Store your preferences and settings.'
        }
      },
      details: 'View Details',
      hideDetails: 'Hide Details',
      learnMore: 'Learn More',
      privacyPolicy: 'Privacy Policy'
    }
  };

  const t = translations[language];

  // ============================================================================
  // MANEJADORES DE EVENTOS
  // ============================================================================

  const handleAcceptAll = async () => {
    const allConsents = {
      essential_consent: true,
      functional_consent: true,
      analytics_consent: true,
      marketing_consent: true,
      preferences_consent: true
    };

    await updateConsent(allConsents);
    setConsents(allConsents);
    setIsVisible(false);
    localStorage.setItem(`vibethink-cookie-consent-${tenantId}`, JSON.stringify(allConsents));
    onConsentChange?.(allConsents);
  };

  const handleAcceptEssential = async () => {
    const essentialConsents = {
      essential_consent: true,
      functional_consent: false,
      analytics_consent: false,
      marketing_consent: false,
      preferences_consent: false
    };

    await updateConsent(essentialConsents);
    setConsents(essentialConsents);
    setIsVisible(false);
    localStorage.setItem(`vibethink-cookie-consent-${tenantId}`, JSON.stringify(essentialConsents));
    onConsentChange?.(essentialConsents);
  };

  const handleSavePreferences = async () => {
    await updateConsent(consents);
    setIsVisible(false);
    localStorage.setItem(`vibethink-cookie-consent-${tenantId}`, JSON.stringify(consents));
    onConsentChange?.(consents);
  };

  const handleCategoryChange = (category: keyof CookieConsent, checked: boolean) => {
    setConsents(prev => ({
      ...prev,
      [category]: checked
    }));
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 p-4
      ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
      border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      shadow-lg
      ${className}
    `}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
            <p className="text-sm opacity-90">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm underline hover:no-underline transition-all"
          >
            {showDetails ? t.hideDetails : t.details}
          </button>
        </div>

        {/* Descripción */}
        <p className="text-sm mb-4 opacity-80">{t.description}</p>

        {/* Categorías de Cookies */}
        {showDetails && (
          <div className="mb-6 space-y-4">
            <CookieCategory
              title={t.categories.essential.title}
              description={t.categories.essential.description}
              essential={true}
              checked={consents.essential_consent || false}
              onChange={(checked) => handleCategoryChange('essential_consent', checked)}
              disabled={true}
            />
            
            <CookieCategory
              title={t.categories.functional.title}
              description={t.categories.functional.description}
              checked={consents.functional_consent || false}
              onChange={(checked) => handleCategoryChange('functional_consent', checked)}
            />
            
            <CookieCategory
              title={t.categories.analytics.title}
              description={t.categories.analytics.description}
              checked={consents.analytics_consent || false}
              onChange={(checked) => handleCategoryChange('analytics_consent', checked)}
            />
            
            <CookieCategory
              title={t.categories.marketing.title}
              description={t.categories.marketing.description}
              checked={consents.marketing_consent || false}
              onChange={(checked) => handleCategoryChange('marketing_consent', checked)}
            />
            
            <CookieCategory
              title={t.categories.preferences.title}
              description={t.categories.preferences.description}
              checked={consents.preferences_consent || false}
              onChange={(checked) => handleCategoryChange('preferences_consent', checked)}
            />
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {t.acceptAll}
            </button>
            
            <button
              onClick={handleAcceptEssential}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {t.acceptEssential}
            </button>
            
            {showDetails && (
              <button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {t.save}
              </button>
            )}
          </div>
          
          <div className="flex gap-4 text-sm">
            <a
              href="/privacy-policy"
              className="underline hover:no-underline transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.privacyPolicy}
            </a>
            <a
              href="/cookie-policy"
              className="underline hover:no-underline transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.learnMore}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE DE CATEGORÍA DE COOKIES
// ============================================================================

const CookieCategory: React.FC<CookieCategoryProps> = ({
  title,
  description,
  essential = false,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
      <input
        type="checkbox"
        id={`cookie-${title.toLowerCase().replace(/\s+/g, '-')}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
      />
      
      <div className="flex-1">
        <label
          htmlFor={`cookie-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="block text-sm font-medium cursor-pointer"
        >
          {title}
          {essential && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Esencial
            </span>
          )}
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE DE GESTIÓN DE COOKIES
// ============================================================================

interface CookieManagerProps {
  tenantId: string;
  userId?: string;
  onCookieChange?: (cookies: ModernCookie[]) => void;
}

export const VibeThinkOrchestratorCookieManager: React.FC<CookieManagerProps> = ({
  tenantId,
  userId,
  onCookieChange
}) => {
  const [cookies, setCookies] = useState<ModernCookie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    getUserCookies,
    deleteCookie,
    cleanupExpiredCookies,
    getCookieStats
  } = useVibeThinkOrchestratorCookieManager(tenantId, userId);

  // Cargar cookies del usuario
  useEffect(() => {
    const loadCookies = async () => {
      setIsLoading(true);
      try {
        const userCookies = await getUserCookies();
        setCookies(userCookies);
        onCookieChange?.(userCookies);
      } catch (error) {
        console.error('Error al cargar cookies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCookies();
  }, [tenantId, userId, getUserCookies, onCookieChange]);

  const handleDeleteCookie = async (cookie: ModernCookie) => {
    try {
      await deleteCookie(cookie.name, cookie.domain);
      setCookies(prev => prev.filter(c => c.id !== cookie.id));
    } catch (error) {
      console.error('Error al eliminar cookie:', error);
    }
  };

  const handleCleanupExpired = async () => {
    try {
      const deletedCount = await cleanupExpiredCookies();
      if (deletedCount > 0) {
        // Recargar cookies
        const userCookies = await getUserCookies();
        setCookies(userCookies);
        onCookieChange?.(userCookies);
      }
    } catch (error) {
      console.error('Error al limpiar cookies expiradas:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Cargando cookies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Cookies</h3>
        <button
          onClick={handleCleanupExpired}
          className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
        >
          Limpiar Expiradas
        </button>
      </div>

      {cookies.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay cookies almacenadas</p>
      ) : (
        <div className="space-y-2">
          {cookies.map((cookie) => (
            <div
              key={cookie.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{cookie.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    cookie.purpose === 'essential' ? 'bg-red-100 text-red-800' :
                    cookie.purpose === 'functional' ? 'bg-blue-100 text-blue-800' :
                    cookie.purpose === 'analytics' ? 'bg-green-100 text-green-800' :
                    cookie.purpose === 'marketing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cookie.purpose}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {cookie.domain || 'default'} • {cookie.path}
                </p>
                {cookie.expires_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Expira: {new Date(cookie.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {cookie.purpose !== 'essential' && (
                <button
                  onClick={() => handleDeleteCookie(cookie)}
                  className="px-2 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VibeThinkOrchestratorCookieBanner; 