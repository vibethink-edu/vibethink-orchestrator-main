
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * Grid responsivo que se adapta automáticamente al contenido
 * Calcula el número de columnas según el espacio disponible
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  minItemWidth = 200,
  gap = 'md'
}) => {
  const { contentWidth } = useResponsiveLayout();

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  // Calcular número de columnas basado en el ancho disponible
  const gapPixels = gap === 'sm' ? 8 : gap === 'md' ? 16 : 24;
  const cols = Math.max(1, Math.floor((contentWidth + gapPixels) / (minItemWidth + gapPixels)));

  return (
    <div 
      className={cn('grid w-full', gapClasses[gap], className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
