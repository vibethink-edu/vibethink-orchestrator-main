
# Enterprise Performance Standards

## PERFORMANCE REQUIREMENTS

### 1. Load Time Standards
- **Initial page load**: < 2 seconds
- **Route transitions**: < 500ms
- **Component interactions**: < 100ms
- **AI processing feedback**: Immediate optimistic updates

### 2. Bundle Size Limits
- **Main bundle**: < 250KB gzipped
- **Route chunks**: < 100KB gzipped each
- **Component chunks**: < 50KB gzipped each

## OPTIMIZATION PATTERNS

### 1. Code Splitting
```typescript
// ✅ REQUIRED: Lazy load route components
const AdminPanel = lazy(() => import('@/pages/admin/AdminPanel'));
const OperationalRepositories = lazy(() => import('@/pages/OperationalRepositories'));

// ✅ REQUIRED: Lazy load heavy features
const AIProcessingPanel = lazy(() => import('@/components/ai/AIProcessingPanel'));
```

### 2. React Query Optimization
```typescript
// ✅ PERFORMANCE: Optimized query configuration
const useOptimizedQuery = (queryKey: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });
};
```

### 3. Memoization Strategy
```typescript
// ✅ EXPENSIVE COMPUTATIONS: Always memoize
const ProcessedData = ({ rawData, filters }) => {
  const processedData = useMemo(() => {
    return processLargeDataset(rawData, filters);
  }, [rawData, filters]);
  
  return <DataVisualization data={processedData} />;
};

// ✅ CALLBACK OPTIMIZATION: Prevent unnecessary re-renders
const ParentComponent = () => {
  const handleUpdate = useCallback((id: string, data: any) => {
    // Update logic
  }, []);
  
  return <ChildComponent onUpdate={handleUpdate} />;
};
```

## IMAGE OPTIMIZATION

### 1. Image Loading Strategy
```typescript
// ✅ LAZY LOADING: All images below fold
const OptimizedImage = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading="lazy"
    decoding="async"
  />
);
```

### 2. Responsive Images
```typescript
// ✅ RESPONSIVE: Multiple sizes for different devices
const ResponsiveImage = ({ src, alt }) => (
  <picture>
    <source media="(min-width: 768px)" srcSet={`${src}@2x.webp`} type="image/webp" />
    <source media="(max-width: 767px)" srcSet={`${src}@1x.webp`} type="image/webp" />
    <img src={`${src}.jpg`} alt={alt} loading="lazy" />
  </picture>
);
```

## VIRTUAL SCROLLING

### 1. Large Data Sets
```typescript
// ✅ VIRTUAL SCROLLING: For tables > 100 rows
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TableRow data={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## NETWORK OPTIMIZATION

### 1. Request Batching
```typescript
// ✅ BATCH REQUESTS: Combine multiple operations
const batchOperations = async (operations: Operation[]) => {
  const batches = chunk(operations, 10); // Process 10 at a time
  
  for (const batch of batches) {
    await Promise.all(batch.map(op => executeOperation(op)));
  }
};
```

### 2. Request Deduplication
```typescript
// ✅ DEDUPLICATE: Prevent duplicate API calls
const requestCache = new Map();

const deduplicatedRequest = async (key: string, requestFn: () => Promise<any>) => {
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  const promise = requestFn();
  requestCache.set(key, promise);
  
  try {
    const result = await promise;
    return result;
  } finally {
    requestCache.delete(key);
  }
};
```

## PERFORMANCE MONITORING

### 1. Core Web Vitals Tracking
```typescript
// ✅ MONITORING: Track performance metrics
const trackPerformance = () => {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lcp = entries[entries.length - 1];
    console.log('LCP:', lcp.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });
};
```

### 2. Component Performance Profiling
```typescript
// ✅ PROFILING: Measure component render times
const ProfiledComponent = ({ children }) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Component render time: ${end - start}ms`);
    };
  });
  
  return children;
};
```

## DATABASE PERFORMANCE

### 1. Query Optimization
```typescript
// ✅ EFFICIENT QUERIES: Minimize data transfer
const optimizedQuery = await supabase
  .from('large_table')
  .select('id, title, status') // Only needed columns
  .eq('company_id', companyId)
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .limit(50); // Always limit results
```

### 2. Connection Pooling
```typescript
// ✅ CONNECTION MANAGEMENT: Reuse connections
const supabaseConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-application-name': 'ai-pair-orchestrator' },
  },
};
```

## PERFORMANCE BUDGETS

### 1. Bundle Analysis
- Monitor bundle size with webpack-bundle-analyzer
- Set alerts for bundle size increases > 10%
- Regular audit of unused dependencies

### 2. Performance Testing
- Lighthouse CI in development pipeline
- Core Web Vitals monitoring in production
- Performance regression testing

**Performance Target**: Maintain 90+ Lighthouse score across all core flows.
