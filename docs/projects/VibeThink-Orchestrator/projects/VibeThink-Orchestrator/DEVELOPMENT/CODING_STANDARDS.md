# 📝 Estándares de Código - AI Pair Orchestrator Pro

## 📋 **Resumen Ejecutivo**

Este documento establece los estándares de código, patrones de desarrollo y mejores prácticas para el proyecto AI Pair Orchestrator Pro, asegurando consistencia, mantenibilidad y calidad en todo el código base.

---

## 🎯 **Principios Fundamentales**

### **1. Clean Code**
- **Legibilidad** sobre brevedad
- **Intención clara** en nombres y funciones
- **Responsabilidad única** por función/clase
- **Eliminación de duplicación** (DRY)

### **2. TypeScript First**
- **Strict mode** habilitado
- **Tipado explícito** para APIs públicas
- **Interfaces** para contratos
- **Evitar `any`** en todo el código

### **3. React Patterns**
- **Functional components** con hooks
- **Composición** sobre herencia
- **Props interfaces** claramente definidas
- **Custom hooks** para lógica reutilizable

---

## 🏗️ **Arquitectura de Componentes**

### **1. Patrón Base (PatternBase)**
```typescript
// Componente base para consistencia
export interface PatternBaseProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const PatternBase: React.FC<PatternBaseProps> = ({
  className,
  children,
  isLoading = false,
  error = null,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className={cn('pattern-base-loading', className)}>
        <div className="loading-spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('pattern-base-error', className)}>
        <div className="error-icon" />
        <p className="error-message">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('pattern-base', className)}>
      {children}
    </div>
  );
};
```

### **2. Hook Base (usePatternBase)**
```typescript
// Hook base para manejo consistente de estados
export const usePatternBase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const executeAsync = useCallback(async (asyncFn: () => Promise<any>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    executeAsync,
    retry
  };
};
```

### **3. Estructura de Componentes**
```typescript
// Estructura estándar para componentes
interface ComponentProps {
  // Props principales
  data: DataType[];
  onAction: (item: DataType) => void;
  
  // Props opcionales
  title?: string;
  className?: string;
  disabled?: boolean;
  
  // Props de estado
  isLoading?: boolean;
  error?: string | null;
}

export const Component: React.FC<ComponentProps> = ({
  data,
  onAction,
  title,
  className,
  disabled = false,
  isLoading = false,
  error = null
}) => {
  // 1. Hooks personalizados
  const { user } = useAuth();
  const { executeAsync } = usePatternBase();
  
  // 2. Estados locales
  const [localState, setLocalState] = useState();
  
  // 3. Handlers
  const handleAction = useCallback(async (item: DataType) => {
    await executeAsync(async () => {
      await onAction(item);
    });
  }, [onAction, executeAsync]);
  
  // 4. Renderizado
  return (
    <PatternBase
      className={cn('component', className)}
      isLoading={isLoading}
      error={error}
    >
      {title && <h2 className="component-title">{title}</h2>}
      
      <div className="component-content">
        {data.map((item) => (
          <ComponentItem
            key={item.id}
            item={item}
            onAction={handleAction}
            disabled={disabled}
          />
        ))}
      </div>
    </PatternBase>
  );
};
```

---

## 📁 **Organización de Archivos**

### **1. Estructura de Directorios**
```
src/
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── features/              # Componentes específicos de features
│   ├── layout/                # Componentes de layout
│   └── patterns/              # Patrones reutilizables
├── hooks/
│   ├── useAuth.ts             # Hook de autenticación
│   ├── useBilling.ts          # Hook de billing
│   └── usePatternBase.ts      # Hook base
├── pages/
│   ├── admin/                 # Páginas de administración
│   ├── billing/               # Páginas de billing
│   └── dashboard/             # Páginas del dashboard
├── services/
│   ├── api/                   # Servicios de API
│   ├── integrations/          # Integraciones externas
│   └── utils/                 # Utilidades de servicios
├── types/
│   ├── api.ts                 # Tipos de API
│   ├── components.ts          # Tipos de componentes
│   └── global.ts              # Tipos globales
└── utils/
    ├── constants.ts           # Constantes
    ├── formatters.ts          # Formateadores
    └── validators.ts          # Validadores
```

### **2. Convenciones de Nomenclatura**
```typescript
// Archivos y carpetas
components/
  ├── ui/                      # kebab-case para carpetas
  │   ├── button.tsx           # kebab-case para archivos
  │   └── input-field.tsx
  ├── features/
  │   └── billing/
  │       ├── ColombianPlansDisplay.tsx  # PascalCase para componentes
  │       └── useBilling.ts              # camelCase para hooks

// Componentes
export const ColombianPlansDisplay: React.FC<ColombianPlansDisplayProps> = () => {
  // PascalCase para componentes
};

// Hooks
export const useBilling = (): BillingHook => {
  // camelCase para hooks, prefijo 'use'
};

// Interfaces
interface ColombianPlansDisplayProps {
  // PascalCase para interfaces, sufijo 'Props'
}

// Tipos
type BillingHook = {
  // PascalCase para tipos
};

// Constantes
const BILLING_CONSTANTS = {
  // UPPER_SNAKE_CASE para constantes
  TRIAL_DAYS: 14,
  CURRENCY: 'COP'
};
```

---

## 🔧 **Patrones de Desarrollo**

### **1. Manejo de Estados**
```typescript
// Patrón recomendado para estados complejos
export const useComplexState = () => {
  // Estados relacionados agrupados
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers agrupados por funcionalidad
  const formHandlers = {
    updateField: (field: keyof FormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Limpiar error del campo
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    },
    
    validate: () => {
      const errors = validateForm(formData);
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    
    submit: async () => {
      if (!formHandlers.validate()) return;
      
      setIsSubmitting(true);
      try {
        await submitForm(formData);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    formData,
    validationErrors,
    isSubmitting,
    ...formHandlers
  };
};
```

### **2. Manejo de Errores**
```typescript
// Patrón para manejo consistente de errores
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }
  
  return new AppError('Error desconocido', 'UNKNOWN_ERROR');
};

// Uso en componentes
const { executeAsync } = usePatternBase();

const handleAction = async () => {
  await executeAsync(async () => {
    try {
      return await apiCall();
    } catch (error) {
      throw handleApiError(error);
    }
  });
};
```

### **3. Optimización de Performance**
```typescript
// Memoización de componentes
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({
  data,
  onAction
}) => {
  // Componente optimizado
}, (prevProps, nextProps) => {
  // Comparación personalizada si es necesaria
  return prevProps.data.id === nextProps.data.id;
});

// Memoización de callbacks
export const useOptimizedCallbacks = (data: DataType[]) => {
  const handleAction = useCallback((item: DataType) => {
    // Lógica de acción
  }, []); // Dependencias mínimas

  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: processItem(item)
    }));
  }, [data]); // Solo recalcular si data cambia

  return { handleAction, processedData };
};
```

---

## 🎨 **Estilos y CSS**

### **1. Tailwind CSS**
```typescript
// Uso consistente de Tailwind
const componentClasses = {
  container: 'flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm',
  header: 'text-xl font-semibold text-gray-900 mb-4',
  content: 'space-y-4',
  button: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors',
  buttonDisabled: 'px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed'
};

// Clases condicionales
const buttonClass = cn(
  'px-4 py-2 rounded-md transition-colors',
  disabled 
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'bg-blue-600 text-white hover:bg-blue-700'
);
```

### **2. Responsive Design**
```typescript
// Breakpoints consistentes
const responsiveClasses = {
  container: 'p-4 md:p-6 lg:p-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  text: 'text-sm md:text-base lg:text-lg',
  spacing: 'space-y-4 md:space-y-6 lg:space-y-8'
};

// Hooks para responsive
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
};
```

---

## 🔐 **Seguridad**

### **1. Validación de Inputs**
```typescript
// Validación con Zod
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['EMPLOYEE', 'MANAGER', 'ADMIN']),
  companyId: z.string().uuid('ID de empresa inválido')
});

export const validateUser = (data: unknown) => {
  return userSchema.safeParse(data);
};

// Uso en componentes
const handleSubmit = async (formData: unknown) => {
  const validation = validateUser(formData);
  
  if (!validation.success) {
    setErrors(validation.error.flatten().fieldErrors);
    return;
  }
  
  // Procesar datos validados
  await createUser(validation.data);
};
```

### **2. Sanitización de Datos**
```typescript
// Sanitización de HTML
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

// Sanitización de datos de usuario
export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres peligrosos
    .substring(0, 1000);  // Limitar longitud
};
```

---

## 🧪 **Testing**

### **1. Testing de Componentes**
```typescript
// Test de componente con React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  const mockOnAction = jest.fn();
  const mockData = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' }
  ];

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('renderiza correctamente con datos', () => {
    render(<Component data={mockData} onAction={mockOnAction} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('llama onAction cuando se hace clic en un item', async () => {
    render(<Component data={mockData} onAction={mockOnAction} />);
    
    fireEvent.click(screen.getByText('Item 1'));
    
    await waitFor(() => {
      expect(mockOnAction).toHaveBeenCalledWith(mockData[0]);
    });
  });

  it('muestra estado de carga', () => {
    render(<Component data={mockData} onAction={mockOnAction} isLoading={true} />);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra error cuando hay un problema', () => {
    const errorMessage = 'Error de conexión';
    render(
      <Component 
        data={mockData} 
        onAction={mockOnAction} 
        error={errorMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
```

### **2. Testing de Hooks**
```typescript
// Test de hooks con @testing-library/react-hooks
import { renderHook, act } from '@testing-library/react-hooks';
import { usePatternBase } from './usePatternBase';

describe('usePatternBase', () => {
  it('maneja estados de carga correctamente', async () => {
    const { result } = renderHook(() => usePatternBase());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    
    const asyncFn = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('success'), 100))
    );
    
    act(() => {
      result.current.executeAsync(asyncFn);
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('success');
  });

  it('maneja errores correctamente', async () => {
    const { result } = renderHook(() => usePatternBase());
    
    const asyncFn = jest.fn().mockRejectedValue(new Error('Test error'));
    
    await act(async () => {
      try {
        await result.current.executeAsync(asyncFn);
      } catch (error) {
        // Error esperado
      }
    });
    
    expect(result.current.error).toBe('Test error');
    expect(result.current.isLoading).toBe(false);
  });
});
```

---

## 📚 **Documentación de Código**

### **1. JSDoc para Funciones**
```typescript
/**
 * Crea una nueva suscripción para una empresa
 * @param companyId - ID único de la empresa
 * @param planId - ID del plan seleccionado
 * @param paymentMethodId - ID del método de pago en Stripe
 * @returns Promise que resuelve a la suscripción creada
 * @throws {AppError} Si hay un error en la creación
 * @example
 * ```typescript
 * const subscription = await createSubscription(
 *   'company-123',
 *   'plan-starter',
 *   'pm_1234567890'
 * );
 * ```
 */
export const createSubscription = async (
  companyId: string,
  planId: string,
  paymentMethodId: string
): Promise<Subscription> => {
  // Implementación
};
```

### **2. Comentarios en Código**
```typescript
// Comentarios explicativos para lógica compleja
const calculateTrialDays = (subscription: Subscription): number => {
  // Si no hay trial configurado, retornar 0
  if (!subscription.trial_end) return 0;
  
  const now = new Date();
  const trialEnd = new Date(subscription.trial_end);
  
  // Calcular diferencia en días
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Retornar días restantes o 0 si ya expiró
  return Math.max(0, diffDays);
};

// Comentarios para decisiones de diseño
// NOTA: Usamos Math.ceil en lugar de Math.floor para ser más conservadores
// con el tiempo restante de trial
```

---

## 🚀 **Performance y Optimización**

### **1. Lazy Loading**
```typescript
// Lazy loading de componentes pesados
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const App = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HeavyComponent />
    </Suspense>
  );
};

// Lazy loading de rutas
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const BillingPage = lazy(() => import('./pages/billing/BillingPage'));
```

### **2. Bundle Optimization**
```typescript
// Importación dinámica para librerías pesadas
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

// Uso en componentes
const ChartComponent = () => {
  const [Chart, setChart] = useState(null);
  
  useEffect(() => {
    loadChartLibrary().then(setChart);
  }, []);
  
  if (!Chart) return <div>Cargando gráfico...</div>;
  
  return <Chart data={data} />;
};
```

---

## 🔄 **CI/CD y Quality Gates**

### **1. Pre-commit Hooks**
```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Linting
npm run lint

# Type checking
npm run type-check

# Unit tests
npm run test:unit

# Build verification
npm run build
```

### **2. Quality Gates**
```typescript
// Configuración de ESLint
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Reglas estrictas para calidad
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react/prop-types': 'off', // Usamos TypeScript
    'react/react-in-jsx-scope': 'off' // No necesario en React 17+
  }
};
```

---

**Última actualización**: 2025-01-20  
**Versión**: 1.0 - Estándares establecidos  
**Responsable**: Equipo de Desarrollo 