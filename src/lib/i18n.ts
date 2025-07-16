/**
 * Internationalization Configuration
 * 
 * Configuración optimizada para soporte multiidioma
 * Soporte para español e inglés con detección automática
 * 
 * @author Vita Asistente AI de Marcelo - Core Team
 * @version 2.0.0
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar archivos de traducción
import en from '@/locales/en.json';
import es from '@/locales/es.json';

// Configuración de idiomas soportados
const supportedLanguages = ['es', 'en'];
const defaultLanguage = 'es'; // Español como idioma por defecto

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

// Función para obtener el idioma preferido del usuario
const getPreferredLanguage = (): string => {
  // 1. Verificar localStorage
  const storedLanguage = localStorage.getItem('preferred-language');
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  // 2. Verificar idioma del navegador
  const browserLanguage = navigator.language.split('-')[0];
  if (supportedLanguages.includes(browserLanguage)) {
    return browserLanguage;
  }

  // 3. Verificar idiomas del navegador
  const browserLanguages = navigator.languages || [];
  for (const lang of browserLanguages) {
    const langCode = lang.split('-')[0];
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }

  // 4. Fallback al idioma por defecto
  return defaultLanguage;
};

// Función para inicializar el idioma en el documento
const initializeDocumentLanguage = (language: string) => {
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr'; // Ambos idiomas son LTR
  
  // Agregar clase CSS para el idioma
  document.documentElement.classList.remove('lang-es', 'lang-en');
  document.documentElement.classList.add(`lang-${language}`);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    lng: getPreferredLanguage(), // Usar detección personalizada
    
    // Configuración de detección
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred-language',
      lookupSessionStorage: false,
      lookupQuerystring: false,
      lookupCookie: false,
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // Configuración específica para nuestros idiomas
      checkWhitelist: true,
      whitelist: supportedLanguages,
      
      // Configuración de cookies (si se usa)
      cookieExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
      cookieDomain: undefined,
      cookieSecure: false,
      cookieSameSite: 'strict'
    },
    
    // Configuración de interpolación
    interpolation: {
      escapeValue: false, // React ya escapa por nosotros
      skipOnVariables: false
    },
    
    // Configuración de carga
    load: 'languageOnly',
    
    // Configuración de debug (solo en desarrollo)
    debug: process.env.NODE_ENV === 'development',
    
    // Configuración de react
    react: {
      useSuspense: false, // Evitar problemas con SSR
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    },
    
    // Configuración de namespaces
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Configuración de pluralización
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Configuración de escape
    escapeValue: false,
    
    // Configuración de parse
    parseMissingKeyHandler: (key: string) => {
      console.warn(`Missing translation key: ${key}`);
      return key;
    },
    
    // Configuración de backend (si se usa)
    backend: undefined,
    
    // Configuración de cache
    cache: {
      enabled: true,
      expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 días
      versions: {}
    }
  });

// Inicializar el idioma en el documento
initializeDocumentLanguage(i18n.language);

// Event listener para cambios de idioma
i18n.on('languageChanged', (lng: string) => {
  initializeDocumentLanguage(lng);
  localStorage.setItem('preferred-language', lng);
});

// Función helper para cambiar idioma con validación
export const changeLanguage = async (language: string): Promise<void> => {
  if (!supportedLanguages.includes(language)) {
    console.warn(`Unsupported language: ${language}`);
    return;
  }
  
  try {
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
    throw error;
  }
};

// Función helper para obtener el idioma actual
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Función helper para verificar si un idioma está soportado
export const isLanguageSupported = (language: string): boolean => {
  return supportedLanguages.includes(language);
};

// Función helper para obtener todos los idiomas soportados
export const getSupportedLanguages = (): string[] => {
  return [...supportedLanguages];
};

// Función helper para obtener el idioma por defecto
export const getDefaultLanguage = (): string => {
  return defaultLanguage;
};

export default i18n; 