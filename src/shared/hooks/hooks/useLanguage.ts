/**
 * useLanguage Hook
 * 
 * Hook personalizado para manejo optimizado del idioma
 * Proporciona funcionalidades avanzadas para gestión de idiomas
 * 
 * @author AI Pair Platform - UI Team
 * @version 2.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, isLanguageSupported, getSupportedLanguages, getDefaultLanguage } from '@/lib/i18n';

interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

const languageOptions: LanguageInfo[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  }
];

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [availableLanguages] = useState<LanguageInfo[]>(languageOptions);

  // Sincronizar con cambios externos del idioma
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      setIsChanging(false);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Función para cambiar idioma con manejo de errores
  const switchLanguage = useCallback(async (languageCode: string): Promise<boolean> => {
    if (!isLanguageSupported(languageCode) || languageCode === currentLanguage || isChanging) {
      return false;
    }

    setIsChanging(true);

    try {
      await changeLanguage(languageCode);
      return true;
    } catch (error) {
      // TODO: log 'Error switching language:' error
      setIsChanging(false);
      return false;
    }
  }, [currentLanguage, isChanging]);

  // Función para cambiar al siguiente idioma en la lista
  const cycleLanguage = useCallback(async (): Promise<boolean> => {
    const currentIndex = availableLanguages.findIndex(lang => lang.code === currentLanguage);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    const nextLanguage = availableLanguages[nextIndex];
    
    return await switchLanguage(nextLanguage.code);
  }, [currentLanguage, availableLanguages, switchLanguage]);

  // Función para obtener información del idioma actual
  const getCurrentLanguageInfo = useCallback((): LanguageInfo => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  }, [currentLanguage, availableLanguages]);

  // Función para verificar si un idioma está activo
  const isLanguageActive = useCallback((languageCode: string): boolean => {
    return currentLanguage === languageCode;
  }, [currentLanguage]);

  // Función para obtener el idioma por defecto
  const getDefaultLanguageInfo = useCallback((): LanguageInfo => {
    const defaultCode = getDefaultLanguage();
    return availableLanguages.find(lang => lang.code === defaultCode) || availableLanguages[0];
  }, [availableLanguages]);

  // Función para resetear al idioma por defecto
  const resetToDefault = useCallback(async (): Promise<boolean> => {
    const defaultCode = getDefaultLanguage();
    return await switchLanguage(defaultCode);
  }, [switchLanguage]);

  // Función para obtener idioma del navegador
  const getBrowserLanguage = useCallback((): string => {
    return navigator.language.split('-')[0];
  }, []);

  // Función para verificar si el idioma del navegador está soportado
  const isBrowserLanguageSupported = useCallback((): boolean => {
    const browserLang = getBrowserLanguage();
    return isLanguageSupported(browserLang);
  }, [getBrowserLanguage]);

  // Función para cambiar al idioma del navegador si está soportado
  const switchToBrowserLanguage = useCallback(async (): Promise<boolean> => {
    if (isBrowserLanguageSupported()) {
      const browserLang = getBrowserLanguage();
      return await switchLanguage(browserLang);
    }
    return false;
  }, [isBrowserLanguageSupported, getBrowserLanguage, switchLanguage]);

  return {
    // Estado
    currentLanguage,
    isChanging,
    availableLanguages,
    
    // Información del idioma actual
    currentLanguageInfo: getCurrentLanguageInfo(),
    
    // Funciones de cambio
    switchLanguage,
    cycleLanguage,
    resetToDefault,
    switchToBrowserLanguage,
    
    // Funciones de verificación
    isLanguageActive,
    isLanguageSupported,
    isBrowserLanguageSupported,
    
    // Información del sistema
    getBrowserLanguage,
    getDefaultLanguageInfo,
    getSupportedLanguages: () => getSupportedLanguages(),
    
    // Utilidades
    t, // Función de traducción de react-i18next
    i18n // Instancia de i18n para casos avanzados
  };
};

export default useLanguage;
