import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook base para detectar cambios en el tamaño de la ventana
 * 
 * @returns Tamaño actual de la ventana
 * 
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * 
 * return (
 *   <div>
 *     Ancho: {width}px, Alto: {height}px
 *   </div>
 * );
 * ```
 */
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}; 