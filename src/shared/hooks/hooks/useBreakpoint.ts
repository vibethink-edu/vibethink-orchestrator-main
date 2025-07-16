import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Hook para detectar el breakpoint actual basado en el ancho de la ventana
 * 
 * @returns {Breakpoint} El breakpoint actual
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Verificar al montar
    checkBreakpoint();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
} 