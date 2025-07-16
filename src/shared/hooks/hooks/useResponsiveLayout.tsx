import { useState, useEffect } from 'react';
import { useBreakpoint } from './use-breakpoint';

interface LayoutMetrics {
  availableWidth: number;
  contentWidth: number;
  canShowRightPanel: boolean;
  shouldCollapseButtons: boolean;
  buttonSize: 'sm' | 'default';
  gridCols: number;
}

export const useResponsiveLayout = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [layoutMetrics, setLayoutMetrics] = useState<LayoutMetrics>({
    availableWidth: window.innerWidth,
    contentWidth: window.innerWidth,
    canShowRightPanel: false,
    shouldCollapseButtons: false,
    buttonSize: 'default',
    gridCols: 1
  });

  useEffect(() => {
    const calculateLayout = () => {
      const windowWidth = window.innerWidth;
      
      // Calcular métricas basadas en el tamaño de pantalla
      let metrics: LayoutMetrics;
      
      if (isMobile) {
        metrics = {
          availableWidth: windowWidth,
          contentWidth: windowWidth - 32, // 16px padding cada lado
          canShowRightPanel: false,
          shouldCollapseButtons: windowWidth < 400,
          buttonSize: windowWidth < 400 ? 'sm' : 'default',
          gridCols: windowWidth < 400 ? 1 : 2
        };
      } else if (isTablet) {
        metrics = {
          availableWidth: windowWidth,
          contentWidth: windowWidth - 64,
          canShowRightPanel: false,
          shouldCollapseButtons: windowWidth < 600,
          buttonSize: 'default',
          gridCols: windowWidth < 600 ? 2 : 3
        };
      } else {
        // Desktop - calcular espacio disponible considerando paneles
        const sidebarWidth = 256; // O 80 si está colapsado
        const rightPanelWidth = 320;
        const minContentWidth = 480;
        
        const availableForContent = windowWidth - sidebarWidth;
        const canShowRightPanel = availableForContent - rightPanelWidth >= minContentWidth;
        
        metrics = {
          availableWidth: windowWidth,
          contentWidth: canShowRightPanel ? availableForContent - rightPanelWidth : availableForContent,
          canShowRightPanel,
          shouldCollapseButtons: availableForContent < 600,
          buttonSize: 'default',
          gridCols: Math.floor((availableForContent - (canShowRightPanel ? rightPanelWidth : 0)) / 200)
        };
      }
      
      setLayoutMetrics(metrics);
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [isMobile, isTablet, isDesktop]);

  return {
    ...layoutMetrics,
    isMobile,
    isTablet,
    isDesktop
  };
};
