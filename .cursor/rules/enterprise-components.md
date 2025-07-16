
# Enterprise Component Architecture Rules

## COMPONENT SIZE STANDARDS
- **Micro (< 50 lines)**: UI primitives (Button, Input, Badge)
- **Small (50-100 lines)**: Focused components (FormField, TableRow)
- **Medium (100-150 lines)**: Feature components (ConfigurationForm)
- **Large (> 150 lines)**: ⚠️ REFACTOR REQUIRED - Break into smaller components

## EXPLICIT UI STATE MANAGEMENT
ALWAYS handle these 4 states for every async operation:

```typescript
// ✅ Component state pattern
export const EnterpriseComponent = () => {
  const { data, isLoading, error, isEmpty } = useAsyncOperation();
  
  if (isLoading) return <ComponentSkeleton />;
  if (error) return <ErrorFallback error={error} retry={refetch} />;
  if (isEmpty) return <EmptyState onAction={handleCreateNew} />;
  
  return <SuccessContent data={data} />;
};
```

## OPTIMISTIC UPDATES PATTERN
For slow AI operations, provide immediate feedback:

```typescript
// ✅ Optimistic update hook
export const useOptimisticAIProcessing = () => {
  const [optimisticState, setOptimisticState] = useState();
  const [isOptimistic, setIsOptimistic] = useState(false);
  
  const processWithAI = async (input) => {
    // Show optimistic result immediately
    const optimisticResult = generateOptimisticResult(input);
    setOptimisticState(optimisticResult);
    setIsOptimistic(true);
    
    try {
      const result = await aiEdgeFunction(input);
      setOptimisticState(result);
      setIsOptimistic(false);
      return result;
    } catch (error) {
      // Revert optimistic state on error
      setOptimisticState(null);
      setIsOptimistic(false);
      throw error;
    }
  };
  
  return { processWithAI, optimisticState, isOptimistic };
};
```

## ROLE-BASED RENDERING
```typescript
// ✅ Role guard component
export const RoleGuard: React.FC<{
  minimumRole: keyof RoleHierarchy;
  companyId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ minimumRole, companyId, children, fallback }) => {
  const { user } = useAuth();
  const { data: hasAccess, isLoading } = useQuery({
    queryKey: ['permission', user.id, minimumRole, companyId],
    queryFn: () => hasPermission(user.id, minimumRole, companyId)
  });
  
  if (isLoading) return <Skeleton className="h-8 w-full" />;
  return hasAccess ? <>{children}</> : (fallback || null);
};
```

## ENTERPRISE ERROR BOUNDARIES
```typescript
// ✅ Error boundary with audit logging
export const EnterpriseErrorBoundary: React.FC<{
  fallback?: React.ComponentType<{error: Error; retry: () => void}>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
}> = ({ children, fallback: Fallback, onError }) => {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback || DefaultErrorFallback}
      onError={(error, errorInfo) => {
        // Log to audit system
        logError(error, errorInfo);
        onError?.(error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

const DefaultErrorFallback: React.FC<{error: Error; retry: () => void}> = ({ error, retry }) => (
  <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
    <Button onClick={retry} variant="outline" size="sm">
      Try again
    </Button>
  </div>
);
```

## MANDATORY COMPONENT PATTERNS

### 1. Props Interface Standard
```typescript
interface ComponentProps {
  // Required props first
  data: DataType[];
  onAction: (item: DataType) => void;
  
  // Optional props after
  title?: string;
  description?: string;
  isLoading?: boolean;
  
  // Event handlers with 'on' prefix
  onEdit?: (item: DataType) => void;
  onDelete?: (id: string) => void;
  
  // Style props
  variant?: 'default' | 'secondary' | 'destructive';
  className?: string;
  
  // Render props last
  renderActions?: (item: DataType) => React.ReactNode;
}
```

### 2. Loading States Pattern
```typescript
// ✅ REQUIRED: Skeleton states for all async content
const ConfigurationTable = ({ isLoading, data, error }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return <ErrorAlert error={error} onRetry={refetch} />;
  }
  
  if (!data?.length) {
    return (
      <EmptyState
        title="No configurations found"
        description="Create your first configuration to get started"
        action={<Button onClick={onCreate}>Create Configuration</Button>}
      />
    );
  }
  
  return <Table data={data} />;
};
```

### 3. Form Validation Pattern
```typescript
// ✅ REQUIRED: Comprehensive form validation
export const ConfigurationForm = ({ onSubmit }) => {
  const form = useForm<ConfigurationSchema>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      config_key: '',
      config_value: '',
      category: 'ai_models'
    }
  });
  
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      toast({ title: "Configuration saved successfully" });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to save configuration",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="config_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Configuration Key</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Configuration'}
        </Button>
      </form>
    </Form>
  );
};
```

## PERFORMANCE OPTIMIZATION
```typescript
// ✅ MEMOIZATION: For expensive components
const ExpensiveDataVisualization = React.memo<Props>(
  ({ data, filters }) => {
    const processedData = useMemo(() => 
      processLargeDataset(data, filters), [data, filters]
    );
    
    return <ComplexChart data={processedData} />;
  }
);

// ✅ CALLBACK OPTIMIZATION: For event handlers
const ParentComponent = () => {
  const handleItemClick = useCallback((id: string) => {
    // Handle click logic
  }, []);
  
  return <ItemList onItemClick={handleItemClick} />;
};
```

## ACCESSIBILITY REQUIREMENTS
```typescript
// ✅ REQUIRED: WCAG 2.1 AA compliance
const AccessibleButton = ({ children, onClick, disabled, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    className={cn(
      "focus:ring-2 focus:ring-primary focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      props.className
    )}
    {...props}
  >
    {children}
  </button>
);
```

## COMPONENT TESTING STANDARDS
```typescript
// ✅ REQUIRED: Component test structure
describe('ConfigurationForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    title: 'Test Configuration'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<ConfigurationForm {...defaultProps} />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/configuration key/i)).toBeInTheDocument();
  });

  it('handles form submission with validation', async () => {
    const mockOnSubmit = jest.fn();
    render(<ConfigurationForm {...defaultProps} onSubmit={mockOnSubmit} />);
    
    // Fill form and submit
    await userEvent.type(screen.getByLabelText(/key/i), 'test_key');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ config_key: 'test_key' })
    );
  });
});
```

**Quality Gate**: No component should exceed 150 lines in production code.
