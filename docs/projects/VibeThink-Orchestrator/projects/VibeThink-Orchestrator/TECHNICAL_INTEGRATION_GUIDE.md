
# Technical Integration Guide

## 🔌 API Integration Patterns

### **Supabase Client Configuration**
```typescript
// Standard client configuration across the app
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

export const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)
```

### **Authentication Integration**
```typescript
// useAuth hook pattern for authentication state
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, isLoading: user === undefined };
};
```

## 🛠️ Custom Utilities Integration

### **QueryBuilder Usage**
```typescript
import { QueryBuilders } from '@/utils/queryBuilder';

// Type-safe query building
const fetchCompanies = async () => {
  const query = QueryBuilders.companies()
    .select('id, name, status, created_at')
    .eq('status', 'ACTIVE')
    .desc('created_at')
    .limit(10);

  // Execute query
  return await query.execute();
};

// Complex filtered queries
const fetchUsersByRole = async (role: UserRole) => {
  return await QueryBuilders.userProfiles()
    .select('id, email, full_name, role, company_id')
    .eq('role', role)
    .isNotNull('company_id')
    .asc('full_name')
    .execute();
};
```

### **Type Guards Integration**
```typescript
import { TypeGuards } from '@/utils/typeGuards';

// Validate data at runtime
const handleApiResponse = (data: unknown) => {
  if (TypeGuards.isCompany(data)) {
    // TypeScript knows data is Company type
    console.log(`Company: ${data.name}`);
  }
  
  if (TypeGuards.isValidEmail(userInput)) {
    // Proceed with email processing
    processEmail(userInput);
  }
};
```

### **Data Formatters Integration**
```typescript
import { Formatters } from '@/utils/dataFormatters';

// Consistent data formatting across components
const CompanyCard = ({ company, lastActivity }) => (
  <div>
    <h3>{company.name}</h3>
    <p>Created: {Formatters.date.formatDate(company.created_at, 'en')}</p>
    <p>Last Activity: {Formatters.date.formatTimeAgo(lastActivity, 'es')}</p>
    <Badge variant={Formatters.status.getStatusVariant(company.status)}>
      {Formatters.status.formatCompanyStatus(company.status, 'en')}
    </Badge>
  </div>
);
```

### **Input Validators Integration**
```typescript
import { Validators, ValidationChain } from '@/utils/inputValidators';

// Form validation patterns
const useFormValidation = () => {
  const validateField = (value: string, type: string) => {
    switch (type) {
      case 'email':
        return Validators.email(value, { language: 'en' });
      case 'password':
        return Validators.strongPassword(value, { language: 'es' });
      case 'phone':
        return Validators.phoneNumber(value);
      default:
        return { isValid: true, errors: [] };
    }
  };

  const validateForm = (formData: FormData) => {
    return ValidationChain.create()
      .required(formData.email, 'Email is required')
      .email(formData.email)
      .required(formData.password, 'Password is required')
      .strongPassword(formData.password)
      .validate();
  };

  return { validateField, validateForm };
};
```

## 🎯 React Query Integration Patterns

### **Standard Query Hooks**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Company data fetching
export const useCompanies = (filters?: CompanyFilters) => {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: () => fetchCompanies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation with optimistic updates
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (updatedCompany) => {
      // Update specific company in cache
      queryClient.setQueryData(['companies', updatedCompany.id], updatedCompany);
      
      // Invalidate companies list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error) => {
      console.error('Company update failed:', error);
    },
  });
};
```

### **Real-time Integration**
```typescript
// Real-time subscription pattern
export const useRealtimeCompanies = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const subscription = supabase
      .channel('companies-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'companies'
      }, (payload) => {
        // Update cache with real-time changes
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
```

## 🔐 Security Integration

### **Role-Based Access Control**
```typescript
// usePermissions hook for role checking
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (requiredRole: UserRole) => {
    if (!user) return false;
    return hasRolePermission(user.role, requiredRole);
  };
  
  const canManageUser = (targetUserId: string) => {
    // Check via database function
    return supabase.rpc('can_manage_user', {
      manager_user_id: user?.id,
      target_user_id: targetUserId
    });
  };
  
  return { hasPermission, canManageUser };
};

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

### **Company Isolation**
```typescript
// useCompanyData hook ensures data isolation
export const useCompanyData = <T>(
  queryKey: string[], 
  queryFn: () => Promise<T[]>
) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [...queryKey, user?.company_id],
    queryFn: async () => {
      const data = await queryFn();
      // Additional client-side filtering for security
      return data.filter(item => item.company_id === user?.company_id);
    },
    enabled: !!user?.company_id,
  });
};
```

## 🎨 Component Integration Patterns

### **shadcn/ui Component Usage**
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Consistent component composition
const FeatureCard = ({ title, description, status, onAction }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        {title}
        <Badge variant={getStatusVariant(status)}>
          {status}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button onClick={onAction} className="w-full">
        Configure
      </Button>
    </CardContent>
  </Card>
);
```

### **Form Integration Patterns**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema with validation
const companySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().url('Invalid domain').optional(),
  status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED']),
});

// Form component with integration
const CompanyForm = ({ onSubmit, initialData }) => {
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Company</Button>
      </form>
    </Form>
  );
};
```

## 📊 Analytics Integration

### **Usage Tracking**
```typescript
// Track user actions for analytics
export const useUsageTracking = () => {
  const { user } = useAuth();
  
  const trackUsage = async (
    serviceName: string,
    usageType: string,
    amount: number,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    return supabase.rpc('track_usage', {
      p_company_id: user.company_id,
      p_user_id: user.id,
      p_service_name: serviceName,
      p_usage_type: usageType,
      p_amount: amount,
      p_metadata: metadata,
    });
  };
  
  return { trackUsage };
};
```

### **Performance Monitoring**
```typescript
// Performance monitoring integration
export const usePerformanceMonitoring = () => {
  const trackPerformance = (metric: string, value: number) => {
    // Integration with monitoring service
    if (typeof window !== 'undefined' && window.performance) {
      console.log(`Performance metric: ${metric} = ${value}ms`);
    }
  };
  
  const measureOperation = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      trackPerformance(operationName, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      trackPerformance(`${operationName}_error`, duration);
      throw error;
    }
  };
  
  return { trackPerformance, measureOperation };
};
```

## 🔄 State Management Integration

### **Zustand Store Pattern**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Global app state store
interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      notifications: [],
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification]
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarCollapsed: state.sidebarCollapsed 
      }),
    }
  )
);
```

## 🧪 Testing Integration

### **Component Testing Patterns**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompanyForm } from './CompanyForm';

// Test wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Component test example
describe('CompanyForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<CompanyForm onSubmit={onSubmit} />, { wrapper: createWrapper() });
    
    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: 'Test Company' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Test Company',
      status: 'TRIAL'
    });
  });
});
```

This integration guide provides practical patterns for connecting all the technical components in the system while maintaining type safety and consistent architecture.
