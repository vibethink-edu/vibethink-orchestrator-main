# Buenas Prácticas Completas - Leyes de Oro del Proyecto

## 📋 **Índice de Contenidos**

1. [Arquitectura y Layout](#arquitectura-y-layout)
2. [Eliminación de Boilerplate](#eliminación-de-boilerplate)
3. [Personalización y Localización](#personalización-y-localización)
4. [Cumplimiento y Cookies](#cumplimiento-y-cookies)
5. [Control de Versiones](#control-de-versiones)
6. [Estándares de Código](#estándares-de-código)
7. [Checklist Obligatorio](#checklist-obligatorio)

---

## 🏗️ **Arquitectura y Layout**

### **Principios Fundamentales**

#### **1. Layout Unificado**
- **Regla de Oro:** Solo existe un layout para todas las rutas internas autenticadas
- **Excepciones:** Login, splash, landing, superadmin tienen layouts propios
- **Implementación:** Usar `DashboardLayout` como wrapper único

#### **2. Estructura de Carpetas**
```
src/
├── components/
│   ├── base/           # Componentes base reutilizables
│   ├── layout/         # Layouts y navegación
│   ├── ui/            # Componentes shadcn/ui
│   └── [module]/      # Componentes específicos por módulo
├── hooks/
│   ├── base/          # Hooks base reutilizables
│   └── [module]/      # Hooks específicos por módulo
├── utils/
│   ├── api/           # Utilidades de API
│   ├── validation/    # Validaciones
│   ├── formatting/    # Formateo de datos
│   └── storage/       # Gestión de almacenamiento
└── types/
    ├── base/          # Tipos base
    └── [module]/      # Tipos específicos por módulo
```

#### **3. Patrón de Rutas**
```tsx
// Rutas públicas con layouts propios
<Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />
<Route path="/splash/:companyId" element={<SplashLayout><Splash /></SplashLayout>} />
<Route path="/landing" element={<LandingLayout><Landing /></LandingLayout>} />
<Route path="/superadmin" element={<SuperAdminLayout><SuperAdmin /></SuperAdminLayout>} />

// Rutas internas con layout unificado
<Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  <Route path="helpdesk" element={<HelpdeskPanel />} />
  <Route path="crm" element={<CRMPanel />} />
  <Route path="pqrs" element={<PQRSPanel />} />
</Route>
```

---

## 🧹 **Eliminación de Boilerplate**

### **1. Hooks Base Reutilizables**

#### **useQuery - Para Fetch de Datos**
```tsx
// src/hooks/base/useQuery.ts
interface UseQueryOptions<T> {
  queryKey: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export const useQuery = <T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutos
  cacheTime = 10 * 60 * 1000, // 10 minutos
}: UseQueryOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
```

#### **useMutation - Para Operaciones CRUD**
```tsx
// src/hooks/base/useMutation.ts
interface UseMutationOptions<T, V> {
  mutationFn: (variables: V) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useMutation = <T, V>({
  mutationFn,
  onSuccess,
  onError,
}: UseMutationOptions<T, V>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: V) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mutationFn(variables);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, onSuccess, onError]);

  return { mutate, loading, error };
};
```

#### **useLocalStorage - Para Persistencia Local**
```tsx
// src/hooks/base/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
```

#### **useDebounce - Para Optimización**
```tsx
// src/hooks/base/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### **2. Componentes Base Reutilizables**

#### **BaseCard - Para Cards con Estructura Común**
```tsx
// src/components/base/BaseCard.tsx
interface BaseCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
  actions?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  children,
  className,
  loading,
  error,
  actions,
}) => {
  return (
    <Card className={cn("base-card", className)}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
```

#### **BaseTable - Para Tablas con Paginación**
```tsx
// src/components/base/BaseTable.tsx
interface BaseTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: string | null;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  actions?: React.ReactNode;
}

export const BaseTable = <T,>({
  data,
  columns,
  loading,
  error,
  pagination,
  actions,
}: BaseTableProps<T>) => {
  return (
    <div className="space-y-4">
      {actions && (
        <div className="flex items-center justify-between">
          {actions}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell ? column.cell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {pagination && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
                {pagination.total} resultados
              </div>
              <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={pagination.onPageChange}
                onPageSizeChange={pagination.onPageSizeChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

### **3. Utilidades Centralizadas**

#### **API Client Centralizado**
```tsx
// src/utils/api/apiClient.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options.headers };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

#### **Validaciones Centralizadas**
```tsx
// src/utils/validation/index.ts
export const validators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo es requerido';
    }
    return null;
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Email inválido';
    }
    return null;
  },

  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Mínimo ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Máximo ${max} caracteres`;
    }
    return null;
  },

  phone: (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Teléfono inválido';
    }
    return null;
  },

  url: (value: string) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL inválida';
    }
  },
};

export const validate = (value: any, rules: Array<(value: any) => string | null>) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};
```

#### **Formateo de Datos**
```tsx
// src/utils/formatting/index.ts
export const formatters = {
  currency: (amount: number, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  date: (date: string | Date, format = 'DD/MM/YYYY') => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO');
  },

  datetime: (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleString('es-CO');
  },

  phone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  },
};
```

---

## 🎨 **Personalización y Localización**

### **1. Sistema de Temas**
```tsx
// src/hooks/useTheme.ts
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'auto'>('theme', 'auto');

  const applyTheme = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      root.classList.add(`theme-${newTheme}`);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return { theme, setTheme };
};
```

### **2. Sistema de Idiomas**
```tsx
// src/hooks/useLanguage.ts
export const useLanguage = () => {
  const [language, setLanguage] = useLocalStorage<string>('language', 'es');
  const { i18n } = useTranslation();

  const changeLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }, [setLanguage, i18n]);

  useEffect(() => {
    changeLanguage(language);
  }, [language, changeLanguage]);

  return { language, changeLanguage };
};
```

---

## 🍪 **Cumplimiento y Cookies**

### **1. Sistema de Consentimiento**
```tsx
// src/hooks/useCookieConsent.ts
interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

export const useCookieConsent = () => {
  const [consent, setConsent] = useLocalStorage<CookieConsent | null>('cookie-consent', null);

  const saveConsent = useCallback((newConsent: CookieConsent) => {
    const consentWithMetadata = {
      ...newConsent,
      timestamp: Date.now(),
      version: '1.0',
    };
    
    setConsent(consentWithMetadata);
    applyCookies(consentWithMetadata);
  }, [setConsent]);

  const applyCookies = useCallback((consent: CookieConsent) => {
    if (consent.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
    
    if (consent.marketing) {
      enableMarketingCookies();
    } else {
      disableMarketingCookies();
    }
  }, []);

  return { consent, saveConsent };
};
```

---

## 📊 **Control de Versiones**

### **1. Sistema de Versiones**
```tsx
// src/hooks/useVersionInfo.ts
export const useVersionInfo = () => {
  return useMemo(() => ({
    app: process.env.REACT_APP_VERSION || '1.0.0',
    helpdesk: process.env.REACT_APP_HELPDESK_VERSION || '0.9.1',
    crm: process.env.REACT_APP_CRM_VERSION || '1.0.0',
    pqrs: process.env.REACT_APP_PQRS_VERSION || '0.8.5',
    layout: process.env.REACT_APP_LAYOUT_VERSION || '1.2.0',
    ui: process.env.REACT_APP_UI_VERSION || '1.1.0',
    build: process.env.REACT_APP_BUILD_HASH || 'dev',
    timestamp: process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isSupportMode: process.env.REACT_APP_SUPPORT_MODE === 'true',
    isDebugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
  }), []);
};
```

---

## 📝 **Estándares de Código**

### **1. Convenciones de Nomenclatura**
- **Componentes:** PascalCase (ej: `UserProfile`)
- **Hooks:** camelCase con prefijo `use` (ej: `useUserPreferences`)
- **Utilidades:** camelCase (ej: `formatCurrency`)
- **Tipos/Interfaces:** PascalCase (ej: `UserPreferences`)
- **Constantes:** UPPER_SNAKE_CASE (ej: `API_ENDPOINTS`)
- **Archivos:** kebab-case (ej: `user-preferences.ts`)

### **2. Estructura de Componentes**
```tsx
// 1. Imports
import React from 'react';
import { useTranslation } from 'react-i18next';

// 2. Types/Interfaces
interface ComponentProps {
  // props aquí
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  // 4. Hooks
  const { t } = useTranslation();
  
  // 5. State
  const [state, setState] = useState();
  
  // 6. Effects
  useEffect(() => {
    // effect aquí
  }, []);
  
  // 7. Handlers
  const handleAction = useCallback(() => {
    // handler aquí
  }, []);
  
  // 8. Render
  return (
    <div>
      {/* JSX aquí */}
    </div>
  );
};
```

### **3. Manejo de Errores**
```tsx
// src/utils/errorHandling.ts
export const handleError = (error: unknown, context?: string) => {
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  
  // Log to external service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // logError(error, context);
  }
  
  return errorMessage;
};
```

---

## ✅ **Checklist Obligatorio**

### **Antes de Crear un Nuevo Componente**
- [ ] ¿Usa componentes base cuando es posible?
- [ ] ¿Sigue las convenciones de nomenclatura?
- [ ] ¿Incluye tipos TypeScript completos?
- [ ] ¿Maneja estados de loading y error?
- [ ] ¿Es accesible (ARIA labels, keyboard navigation)?
- [ ] ¿Está documentado con JSDoc?

### **Antes de Crear un Nuevo Hook**
- [ ] ¿Reutiliza hooks base cuando es posible?
- [ ] ¿Maneja errores apropiadamente?
- [ ] ¿Incluye cleanup en useEffect?
- [ ] ¿Está optimizado (useCallback, useMemo)?
- [ ] ¿Está documentado con JSDoc?

### **Antes de Hacer Commit**
- [ ] ¿El código sigue los estándares establecidos?
- [ ] ¿Están eliminados todos los console.log?
- [ ] ¿Están manejados todos los casos de error?
- [ ] ¿Está actualizada la documentación?
- [ ] ¿Pasan todos los tests?

### **Antes de Deploy**
- [ ] ¿Están configuradas todas las variables de entorno?
- [ ] ¿Está actualizada la información de versiones?
- [ ] ¿Está habilitado el modo de producción?
- [ ] ¿Están optimizados los assets?
- [ ] ¿Está configurado el manejo de errores?

---

## 🚀 **Implementación Gradual**

### **Fase 1: Base (Semana 1)**
1. Crear hooks base (`useQuery`, `useMutation`, `useLocalStorage`)
2. Crear componentes base (`BaseCard`, `BaseTable`)
3. Crear utilidades centralizadas (`apiClient`, `validators`, `formatters`)

### **Fase 2: Layout (Semana 2)**
1. Refactorizar `DashboardLayout.tsx`
2. Implementar sistema de personalización
3. Integrar control de versiones en footer

### **Fase 3: Cumplimiento (Semana 3)**
1. Implementar sistema de cookies
2. Crear banner de consentimiento
3. Integrar con analytics

### **Fase 4: Optimización (Semana 4)**
1. Eliminar boilerplate restante
2. Optimizar performance
3. Documentar todo el proceso

---

## 📚 **Recursos Adicionales**

### **Documentación Relacionada**
- [Layout Unificado](./LAYOUT_UNIFIED_ARCHITECTURE.md)
- [Cumplimiento de Cookies](./COOKIE_COMPLIANCE_GUIDE.md)
- [Estándares de Personalización](./PERSONALIZATION_STANDARDS.md)
- [Control de Versiones](./FOOTER_VERSION_CONTROL.md)

### **Herramientas Recomendadas**
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library
- **Type Checking:** TypeScript strict mode
- **Performance:** React DevTools Profiler
- **Accessibility:** axe-core

---

**Nota:** Esta documentación es obligatoria para todo el equipo. Cualquier desviación debe ser justificada y documentada. 