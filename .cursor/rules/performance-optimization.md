
# Performance Optimization - AI Pair Orchestrator Pro

## PERFORMANCE REQUIREMENTS
Enterprise-grade performance standards for AI content generation platform.

## CORE PERFORMANCE TARGETS
```typescript
// ✅ REQUIRED: Performance benchmarks
export const PERFORMANCE_TARGETS = {
  // Page Load Performance
  firstContentfulPaint: 1500, // ms
  largestContentfulPaint: 2500, // ms
  timeToInteractive: 3000, // ms
  
  // AI Operations
  aiGenerationFeedback: 100, // ms for optimistic UI
  aiGenerationComplete: 15000, // ms max for content generation
  
  // Collaboration Features
  realtimeSync: 50, // ms for real-time updates
  documentAutosave: 2000, // ms debounce
  
  // Bundle Sizes
  mainBundle: 250000, // bytes (250KB gzipped)
  chunkSize: 100000, // bytes (100KB gzipped)
  
  // API Response Times
  apiResponse: 500, // ms for database queries
  authenticationTime: 1000, // ms for login/auth
  
  // User Experience
  interactionResponse: 100, // ms for UI interactions
  searchResponse: 300 // ms for search operations
} as const;

// ✅ REQUIRED: Performance monitoring
export const trackPerformance = (metricName: string, value: number) => {
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      custom_map: {
        metric: metricName,
        value: value,
        timestamp: Date.now()
      }
    });
  }
  
  // Log performance issues
  const target = PERFORMANCE_TARGETS[metricName as keyof typeof PERFORMANCE_TARGETS];
  if (target && value > target) {
    console.warn(`Performance issue: ${metricName} took ${value}ms (target: ${target}ms)`);
  }
};
```

## CODE SPLITTING STRATEGY
```typescript
// ✅ REQUIRED: Optimized lazy loading
const LazyDashboard = lazy(() => 
  import('@/pages/Dashboard').then(module => ({ 
    default: module.Dashboard 
  }))
);

const LazyAIGenerator = lazy(() => 
  import('@/components/AIContentGenerator').then(module => ({ 
    default: module.AIContentGenerator 
  }))
);

const LazyCollaborativeEditor = lazy(() => 
  import('@/components/CollaborativeEditor').then(module => ({ 
    default: module.CollaborativeEditor 
  }))
);

// ✅ REQUIRED: Preload critical components
export const preloadCriticalComponents = () => {
  // Preload dashboard components when user lands on login
  const preloadDashboard = () => import('@/pages/Dashboard');
  const preloadAIGenerator = () => import('@/components/AIContentGenerator');
  
  // Preload on user interaction or after auth
  if (typeof window !== 'undefined') {
    window.addEventListener('mouseover', preloadDashboard, { once: true });
    window.addEventListener('keydown', preloadAIGenerator, { once: true });
  }
};

// ✅ REQUIRED: Component-level code splitting
export const withLazyLoading = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: ComponentType = () => <div>Loading...</div>
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: ComponentProps<T>) => (
    <Suspense fallback={<fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
```

## REACT QUERY OPTIMIZATION
```typescript
// ✅ REQUIRED: Optimized cache configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false
    },
    mutations: {
      retry: 1
    }
  }
});

// ✅ REQUIRED: Optimistic updates for AI operations
export const useOptimisticAIGeneration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: generateContent,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['ai-content', variables.companyId]);
      
      // Snapshot previous value
      const previousContent = queryClient.getQueryData(['ai-content', variables.companyId]);
      
      // Optimistically update
      queryClient.setQueryData(['ai-content', variables.companyId], (old: any) => ({
        ...old,
        generating: true,
        lastPrompt: variables.prompt
      }));
      
      return { previousContent };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['ai-content', variables.companyId], 
        context?.previousContent
      );
    },
    onSettled: (data, error, variables) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries(['ai-content', variables.companyId]);
    }
  });
};

// ✅ REQUIRED: Background prefetching
export const usePrefetchCriticalData = (companyId: string) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch user data
    queryClient.prefetchQuery(['user-profile', companyId], () => 
      fetchUserProfile(companyId)
    );
    
    // Prefetch recent content
    queryClient.prefetchQuery(['recent-content', companyId], () => 
      fetchRecentContent(companyId)
    );
    
    // Prefetch prompt templates
    queryClient.prefetchQuery(['prompt-templates', companyId], () => 
      fetchPromptTemplates(companyId)
    );
  }, [companyId, queryClient]);
};
```

## COMPONENT OPTIMIZATION
```typescript
// ✅ REQUIRED: Memoization patterns
export const OptimizedAIGenerator = React.memo<AIGeneratorProps>(({ 
  companyId, 
  onGenerate 
}) => {
  const { data: usageData } = useQuery(['usage', companyId], () => 
    fetchUsageData(companyId)
  );
  
  // Memoize expensive calculations
  const usagePercentage = useMemo(() => {
    if (!usageData) return 0;
    return (usageData.used / usageData.limit) * 100;
  }, [usageData]);
  
  // Memoize callbacks
  const handleGenerate = useCallback((prompt: string) => {
    trackPerformance('ai_generation_start', Date.now());
    onGenerate(prompt);
  }, [onGenerate]);
  
  // Memoize heavy components
  const UsageDisplay = useMemo(() => (
    <UsageIndicator 
      percentage={usagePercentage}
      plan={usageData?.plan}
    />
  ), [usagePercentage, usageData?.plan]);
  
  return (
    <div className="space-y-4">
      {UsageDisplay}
      <PromptInput onGenerate={handleGenerate} />
    </div>
  );
});

// ✅ REQUIRED: Virtual scrolling for large lists
export const VirtualizedContentList: React.FC<ContentListProps> = ({ 
  items 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = throttle(() => {
      const scrollTop = container.scrollTop;
      const itemHeight = 100; // Estimated item height
      const containerHeight = container.clientHeight;
      
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(
        start + Math.ceil(containerHeight / itemHeight) + 5,
        items.length
      );
      
      setVisibleRange({ start, end });
    }, 16); // ~60fps
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);
  
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div 
      ref={containerRef}
      className="h-96 overflow-auto"
      style={{ 
        paddingTop: visibleRange.start * 100,
        paddingBottom: (items.length - visibleRange.end) * 100
      }}
    >
      {visibleItems.map((item, index) => (
        <ContentItem 
          key={item.id}
          item={item}
          style={{ height: 100 }}
        />
      ))}
    </div>
  );
};
```

## IMAGE OPTIMIZATION
```typescript
// ✅ REQUIRED: Responsive image component
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    trackPerformance('image_load_time', Date.now());
  }, []);
  
  const handleError = useCallback(() => {
    setError(true);
  }, []);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          error && "hidden"
        )}
      />
      
      {error && (
        <div 
          className="flex items-center justify-center bg-muted text-muted-foreground"
          style={{ width, height }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};

// ✅ REQUIRED: Image preloading utility
export const preloadImages = (imageUrls: string[]) => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};
```

## BUNDLE OPTIMIZATION
```typescript
// ✅ REQUIRED: Tree shaking optimization
// Import only specific functions from libraries
import { debounce, throttle } from 'lodash-es';
import { format } from 'date-fns/format';
import { isValid } from 'date-fns/isValid';

// ✅ REQUIRED: Dynamic imports for heavy libraries
export const loadHeavyLibrary = async () => {
  const { default: heavyLib } = await import('heavy-library');
  return heavyLib;
};

// ✅ REQUIRED: Webpack bundle analysis
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      // Bundle analysis in development
    });
  }
};

// ✅ REQUIRED: Service worker for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};
```

## DATABASE OPTIMIZATION
```typescript
// ✅ REQUIRED: Query optimization patterns
export const useOptimizedQueries = (companyId: string) => {
  // Batch related queries
  const { data: dashboardData } = useQuery(['dashboard', companyId], () => 
    Promise.all([
      fetchUserProfile(companyId),
      fetchRecentContent(companyId),
      fetchUsageStats(companyId),
      fetchTeamActivity(companyId)
    ]).then(([profile, content, usage, activity]) => ({
      profile,
      content,
      usage,
      activity
    }))
  );
  
  // Use select to limit data transfer
  const { data: contentList } = useQuery(['content-list', companyId], () => 
    supabase
      .from('ai_generated_content')
      .select('id, title, created_at, content_type')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50)
  );
  
  return { dashboardData, contentList };
};

// ✅ REQUIRED: Connection pooling
export const optimizedSupabaseClient = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    },
    global: {
      headers: {
        'x-application-name': 'ai-pair-orchestrator-pro'
      }
    }
  }
);
```

## PERFORMANCE MONITORING
```typescript
// ✅ REQUIRED: Core Web Vitals tracking
export const initPerformanceMonitoring = () => {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      trackPerformance('largest_contentful_paint', entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // First Input Delay
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      trackPerformance('first_input_delay', entry.processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });
  
  // Cumulative Layout Shift
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        trackPerformance('cumulative_layout_shift', entry.value);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
};

// ✅ REQUIRED: AI operation performance
export const trackAIPerformance = (operation: string, startTime: number) => {
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  trackPerformance(`ai_${operation}_duration`, duration);
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ai_operation_performance', {
      operation,
      duration,
      timestamp: endTime
    });
  }
};
```

**Performance Success Criteria**: 90+ Lighthouse score, <2s load times, <100ms UI responses, optimized AI operations.
