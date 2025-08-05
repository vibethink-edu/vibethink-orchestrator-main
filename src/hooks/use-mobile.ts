import { useEffect, useState } from "react";

/**
 * Hook para detectar si el dispositivo es móvil
 * Basado en el breakpoint 'lg' de Tailwind (1024px)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Verificar al montar
    checkIsMobile();

    // Agregar listener para cambios en el tamaño de ventana
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return mounted ? isMobile : false;
}

/**
 * Hook para detectar si el dispositivo es tablet
 * Basado en el breakpoint 'md' de Tailwind (768px - 1024px)
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkIsTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };

    // Verificar al montar
    checkIsTablet();

    // Agregar listener para cambios en el tamaño de ventana
    window.addEventListener('resize', checkIsTablet);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  return mounted ? isTablet : false;
} 