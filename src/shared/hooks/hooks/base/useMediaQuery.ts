import { useState, useEffect } from 'react';

/**
 * Hook base para detectar media queries
 * 
 * @param query - Media query a detectar
 * @returns true si la media query coincide
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * 
 * return (
 *   <div>
 *     {isMobile ? 'Vista móvil' : 'Vista desktop'}
 *   </div>
 * );
 * ```
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Establecer valor inicial
    setMatches(media.matches);

    // Función para actualizar cuando cambie
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Agregar listener
    media.addEventListener('change', listener);
    
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}; 