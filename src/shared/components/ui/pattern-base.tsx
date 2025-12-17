import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Interfaz de propiedades para el componente PatternBase.
 */
interface PatternBaseProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'card' | 'section' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Componente base que establece un patrón estándar para los componentes de la aplicación,
 * manejando estados de carga, error y estilos consistentes.
 */
export const PatternBase: React.FC<PatternBaseProps> = ({
  title,
  description,
  isLoading = false,
  error = null,
  children,
  className,
  actions,
  variant = 'default',
  size = 'md'
}) => {
  const variantClasses = {
    default: 'p-4 bg-background border rounded-lg',
    card: 'p-6 bg-card border border-border rounded-lg shadow-sm',
    section: 'py-8 px-4 bg-muted/30',
    minimal: 'p-2'
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    </div>
  );

  const ErrorState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-destructive">Error</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(variantClasses[variant], sizeClasses[size], className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {title && <h3 className="font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="relative">
        {isLoading ? <LoadingState /> : error ? <ErrorState message={error} /> : children}
      </div>
    </div>
  );
};

export default PatternBase;

/**
 * Hook base para manejar estados comunes como carga y error en componentes.
 */
export const usePatternBase = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAsync = async <T,>(asyncFn: () => Promise<T>, errorMessage = 'Error inesperado'): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await asyncFn();
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    handleAsync,
    clearError,
    setIsLoading,
    setError
  };
};

/**
 * Define las props base para componentes.
 */
export interface BaseComponentProps {
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
}

/**
 * Define props para componentes que manejan colecciones de datos.
 */
export interface DataComponentProps<T> extends BaseComponentProps {
  data?: T[];
  onAction?: (item: T) => void;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * Define props para componentes de formulario.
 */
export interface FormComponentProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: any;
} 
