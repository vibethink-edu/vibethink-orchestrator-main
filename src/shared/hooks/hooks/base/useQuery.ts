/**
 * Base Query Hook for Data Fetching with Caching
 * 
 * Provides standardized data fetching with React Query
 * - Automatic caching and background updates
 * - Error handling and loading states
 * - Optimistic updates support
 * - Company-scoped queries
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useQuery as useReactQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/useAuth';
import React from 'react';

// Extended query options with company scoping
interface BaseQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  /** Company ID for tenant isolation - auto-injected if not provided */
  companyId?: string;
  /** Whether to enable company scoping automatically */
  enableCompanyScope?: boolean;
  /** Custom error handler */
  onError?: (error: TError) => void;
  /** Custom success handler */
  onSuccess?: (data: TData) => void;
}

// Extended query result with additional utilities
interface BaseQueryResult<TData, TError> extends UseQueryResult<TData, TError> {
  /** Whether data is empty */
  isEmpty: boolean;
  /** Whether data is stale */
  isStale: boolean;
  /** Refetch with error handling */
  refetchSafely: () => Promise<void>;
}

/**
 * Base query hook with company scoping and error handling
 */
export function useQuery<TData = unknown, TError = Error>(
  options: {
    queryKey: string | string[];
    queryFn: () => Promise<TData>;
  } & BaseQueryOptions<TData, TError>
): BaseQueryResult<TData, TError> {
  const { user } = useAuth();
  
  // Auto-inject company ID if enabled and not provided
  const companyId = options.companyId || (options.enableCompanyScope !== false ? user?.company_id : undefined);
  
  // Build query key with company scoping
  const queryKey = Array.isArray(options.queryKey) 
    ? [...options.queryKey, companyId].filter(Boolean)
    : [options.queryKey, companyId].filter(Boolean);

  // Default options
  const defaultOptions: UseQueryOptions<TData, TError> = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    ...options
  };

  // Use React Query
  const query = useReactQuery({
    ...defaultOptions,
    queryKey,
    queryFn: options.queryFn,
    enabled: options.enabled !== false && !!companyId,
  });

  // Enhanced result with utilities
  const enhancedResult: BaseQueryResult<TData, TError> = {
    ...query,
    isEmpty: !query.data || (Array.isArray(query.data) && query.data.length === 0),
    isStale: query.isStale,
    refetchSafely: async () => {
      try {
        await query.refetch();
      } catch (error) {
        console.error('Error refetching query:', error);
        options.onError?.(error as TError);
      }
    }
  };

  // Handle success/error callbacks
  React.useEffect(() => {
    if (query.data && options.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, options.onSuccess]);

  React.useEffect(() => {
    if (query.error && options.onError) {
      options.onError(query.error);
    }
  }, [query.error, options.onError]);

  return enhancedResult;
}

/**
 * Hook for infinite queries with pagination
 */
export function useInfiniteQuery<TData = unknown, TError = Error>(
  options: {
    queryKey: string | string[];
    queryFn: (pageParam: any) => Promise<TData>;
    getNeVTKageParam: (lastPage: TData, allPages: TData[]) => any;
  } & BaseQueryOptions<TData, TError>
) {
  const { user } = useAuth();
  
  const companyId = options.companyId || (options.enableCompanyScope !== false ? user?.company_id : undefined);
  
  const queryKey = Array.isArray(options.queryKey) 
    ? [...options.queryKey, companyId].filter(Boolean)
    : [options.queryKey, companyId].filter(Boolean);

  return useReactQuery.useInfiniteQuery({
    queryKey,
    queryFn: options.queryFn,
    getNeVTKageParam: options.getNeVTKageParam,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: options.enabled !== false && !!companyId,
    ...options
  });
}

/**
 * Hook for prefetching data
 */
export function usePrefetchQuery<TData = unknown>(
  queryKey: string | string[],
  queryFn: () => Promise<TData>,
  options?: BaseQueryOptions<TData, Error>
) {
  const queryClient = useReactQuery.useQueryClient();
  const { user } = useAuth();
  
  const companyId = options?.companyId || (options?.enableCompanyScope !== false ? user?.company_id : undefined);
  
  const fullQueryKey = Array.isArray(queryKey) 
    ? [...queryKey, companyId].filter(Boolean)
    : [queryKey, companyId].filter(Boolean);

  return React.useCallback(() => {
    return queryClient.prefetchQuery({
      queryKey: fullQueryKey,
      queryFn,
      staleTime: 5 * 60 * 1000,
      ...options
    });
  }, [queryClient, fullQueryKey, queryFn, options]);
}

// Re-export React Query utilities
export { useQueryClient, useQueryClient as useQueryClient } from '@tanstack/react-query';

/**
 * Hook base para fetch de datos que elimina boilerplate común
 * 
 * @param options - Opciones de configuración del query
 * @returns Resultado del query con data, loading, error y refetch
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useQuery({
 *   queryKey: 'users',
 *   queryFn: () => apiClient.get('/users'),
 *   enabled: !!user?.id,
 * });
 * ```
 */
export const useQueryBase = <T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutos por defecto
  cacheTime = 10 * 60 * 1000, // 10 minutos por defecto
  onSuccess,
  onError,
}: {
  queryKey: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
} => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastFetch, setLastFetch] = React.useState<number | null>(null);
  const [isStale, setIsStale] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await queryFn();
      setData(result);
      setLastFetch(Date.now());
      setIsStale(false);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error(`Query error for key "${queryKey}":`, err);
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, queryKey, onSuccess, onError]);

  const refetch = React.useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Efecto inicial para cargar datos
  React.useEffect(() => {
    if (enabled && (isStale || !data)) {
      fetchData();
    }
  }, [enabled, isStale, data, fetchData]);

  // Efecto para marcar datos como stale después del tiempo especificado
  React.useEffect(() => {
    if (!lastFetch || !staleTime) return;

    const timer = setTimeout(() => {
      setIsStale(true);
    }, staleTime);

    return () => clearTimeout(timer);
  }, [lastFetch, staleTime]);

  // Efecto para limpiar datos después del tiempo de cache
  React.useEffect(() => {
    if (!lastFetch || !cacheTime) return;

    const timer = setTimeout(() => {
      setData(null);
      setLastFetch(null);
      setIsStale(true);
    }, cacheTime);

    return () => clearTimeout(timer);
  }, [lastFetch, cacheTime]);

  return { 
    data, 
    loading, 
    error, 
    refetch,
    isStale 
  };
}; 