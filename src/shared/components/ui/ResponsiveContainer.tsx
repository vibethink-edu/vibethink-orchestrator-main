import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveLayout } from '@/shared/hooks/hooks/useResponsiveLayout';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Contenedor responsivo que se adapta automáticamente al espacio disponible
 * Garantiza que el contenido nunca se recorte y se ajuste fluidamente
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = true,
  padding = 'md'
}) => {
  const { contentWidth, isMobile, isTablet } = useResponsiveLayout();

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-3 sm:p-4 lg:p-6',
    lg: 'p-4 sm:p-6 lg:p-8'
  };

  return (
    <div 
      className={cn(
        'w-full',
        maxWidth && 'max-w-full overflow-hidden',
        paddingClasses[padding],
        className
      )}
      style={{
        maxWidth: maxWidth ? `${contentWidth}px` : undefined
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
