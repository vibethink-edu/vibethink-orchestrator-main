/**
 * Breakpoint Hook
 * 
 * Hook para detectar breakpoints de pantalla
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('lg');
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);

      if (windowWidth < breakpoints.sm) {
        setBreakpoint('xs');
      } else if (windowWidth < breakpoints.md) {
        setBreakpoint('sm');
      } else if (windowWidth < breakpoints.lg) {
        setBreakpoint('md');
      } else if (windowWidth < breakpoints.xl) {
        setBreakpoint('lg');
      } else if (windowWidth < breakpoints['2xl']) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    width,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
  };
}; 