import { useState, useEffect, useCallback } from 'react';

/**
 * Configuración de fuentes para el sistema
 * 
 * Este archivo maneja la configuración de fuentes de Google Fonts
 * y su integración con Tailwind CSS para el sistema de preferencias.
 * 
 * @author Sistema de Gestión Empresarial
 * @version 1.0.0
 * @since 2024-01-01
 */

/**
 * Tipos de fuente disponibles en el sistema
 */
export type FontType = 'Inter' | 'Roboto' | 'Montserrat' | 'Open Sans' | 'Lato';

/**
 * Configuración de cada fuente
 */
export interface FontConfig {
  /** Nombre de la fuente */
  name: FontType;
  /** URL de Google Fonts */
  googleFontsUrl: string;
  /** Clase CSS para Tailwind */
  cssClass: string;
  /** Peso de fuente por defecto */
  defaultWeight: string;
  /** Descripción de la fuente */
  description: string;
  /** Categoría de la fuente */
  category: 'sans-serif' | 'serif' | 'display';
}

/**
 * Configuración completa de todas las fuentes
 */
export const FONT_CONFIGS: Record<FontType, FontConfig> = {
  'Inter': {
    name: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    cssClass: 'font-inter',
    defaultWeight: '400',
    description: 'Fuente moderna y legible, optimizada para interfaces digitales',
    category: 'sans-serif'
  },
  'Roboto': {
    name: 'Roboto',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    cssClass: 'font-roboto',
    defaultWeight: '400',
    description: 'Fuente clásica de Google, muy versátil y legible',
    category: 'sans-serif'
  },
  'Montserrat': {
    name: 'Montserrat',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
    cssClass: 'font-montserrat',
    defaultWeight: '400',
    description: 'Fuente elegante y moderna, perfecta para títulos',
    category: 'sans-serif'
  },
  'Open Sans': {
    name: 'Open Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
    cssClass: 'font-open-sans',
    defaultWeight: '400',
    description: 'Fuente muy legible, excelente para texto largo',
    category: 'sans-serif'
  },
  'Lato': {
    name: 'Lato',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    cssClass: 'font-lato',
    defaultWeight: '400',
    description: 'Fuente amigable y accesible, ideal para contenido web',
    category: 'sans-serif'
  }
};

/**
 * Mapeo de fuentes a clases de Tailwind CSS
 */
export const FONT_CLASSES: Record<FontType, string> = {
  'Inter': 'font-inter',
  'Roboto': 'font-roboto',
  'Montserrat': 'font-montserrat',
  'Open Sans': 'font-open-sans',
  'Lato': 'font-lato'
};

/**
 * Obtiene la configuración de una fuente específica
 * @param font - Nombre de la fuente
 * @returns Configuración de la fuente
 */
export function getFontConfig(font: FontType): FontConfig {
  return FONT_CONFIGS[font];
}

/**
 * Obtiene la clase CSS de Tailwind para una fuente
 * @param font - Nombre de la fuente
 * @returns Clase CSS de Tailwind
 */
export function getFontClass(font: FontType): string {
  return FONT_CLASSES[font];
}

/**
 * Carga una fuente de Google Fonts dinámicamente
 * @param font - Nombre de la fuente a cargar
 */
export function loadGoogleFont(font: FontType): Promise<void> {
  return new Promise((resolve, reject) => {
    const config = getFontConfig(font);
    
    // Verificar si la fuente ya está cargada
    if (document.querySelector(`link[href="${config.googleFontsUrl}"]`)) {
      resolve();
      return;
    }

    // Crear elemento link para cargar la fuente
    const link = document.createElement('link');
    link.href = config.googleFontsUrl;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Error cargando fuente ${font}`));
    
    document.head.appendChild(link);
  });
}

/**
 * Carga todas las fuentes del sistema
 * @returns Promise que se resuelve cuando todas las fuentes están cargadas
 */
export function loadAllFonts(): Promise<void[]> {
  const fontPromises = Object.keys(FONT_CONFIGS).map(font => 
    loadGoogleFont(font as FontType)
  );
  
  return Promise.all(fontPromises);
}

/**
 * Aplica una fuente al documento
 * @param font - Nombre de la fuente a aplicar
 */
export function applyFontToDocument(font: FontType): void {
  const root = document.documentElement;
  const fontClass = getFontClass(font);
  
  // Remover clases de fuente anteriores
  Object.values(FONT_CLASSES).forEach(className => {
    root.classList.remove(className);
  });
  
  // Aplicar nueva fuente
  root.classList.add(fontClass);
  
  // Cargar la fuente si no está disponible
  loadGoogleFont(font).catch(console.error);
}

/**
 * Obtiene la URL de Google Fonts para todas las fuentes
 * @returns URL combinada de Google Fonts
 */
export function getCombinedGoogleFontsUrl(): string {
  const fontFamilies = Object.values(FONT_CONFIGS)
    .map(config => config.name.replace(' ', '+'))
    .join('&family=');
  
  return `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@300;400;500;600;700&display=swap`;
}

/**
 * Verifica si una fuente está disponible en el sistema
 * @param font - Nombre de la fuente a verificar
 * @returns true si la fuente está disponible
 */
export function isFontAvailable(font: FontType): boolean {
  return font in FONT_CONFIGS;
}

/**
 * Obtiene la lista de fuentes disponibles
 * @returns Array con los nombres de las fuentes disponibles
 */
export function getAvailableFonts(): FontType[] {
  return Object.keys(FONT_CONFIGS) as FontType[];
}

/**
 * Obtiene fuentes por categoría
 * @param category - Categoría de fuentes
 * @returns Array de fuentes de la categoría especificada
 */
export function getFontsByCategory(category: 'sans-serif' | 'serif' | 'display'): FontType[] {
  return Object.values(FONT_CONFIGS)
    .filter(config => config.category === category)
    .map(config => config.name);
}

/**
 * Configuración de Tailwind CSS para las fuentes
 * 
 * Agregar esto al archivo tailwind.config.js:
 * 
 * ```javascript
 * module.exports = {
 *   theme: {
 *     extend: {
 *       fontFamily: {
 *         'inter': ['Inter', 'sans-serif'],
 *         'roboto': ['Roboto', 'sans-serif'],
 *         'montserrat': ['Montserrat', 'sans-serif'],
 *         'open-sans': ['Open Sans', 'sans-serif'],
 *         'lato': ['Lato', 'sans-serif'],
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const TAILWIND_CONFIG = {
  fontFamily: {
    'inter': ['Inter', 'sans-serif'],
    'roboto': ['Roboto', 'sans-serif'],
    'montserrat': ['Montserrat', 'sans-serif'],
    'open-sans': ['Open Sans', 'sans-serif'],
    'lato': ['Lato', 'sans-serif'],
  }
};

/**
 * Hook personalizado para manejar fuentes
 * 
 * @example
 * ```typescript
 * const { currentFont, changeFont, availableFonts } = useFonts();
 * 
 * // Cambiar fuente
 * changeFont('Roboto');
 * 
 * // Obtener fuentes disponibles
 * console.log(availableFonts);
 * ```
 */
export function useFonts() {
  const [currentFont, setCurrentFont] = useState<FontType>('Inter');
  const availableFonts = getAvailableFonts();

  const changeFont = useCallback((font: FontType) => {
    if (isFontAvailable(font)) {
      setCurrentFont(font);
      applyFontToDocument(font);
    }
  }, []);

  // Cargar fuentes al montar el componente
  useEffect(() => {
    loadAllFonts().catch(console.error);
  }, []);

  return {
    currentFont,
    changeFont,
    availableFonts,
    isFontAvailable
  };
} 