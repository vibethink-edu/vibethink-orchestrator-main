/**
 * Base Mutation Hook for CRUD Operations
 * 
 * Provides standardized mutation operations with React Query
 * - Optimistic updates
 * - Error handling and rollback
 * - Cache invalidation
 * - Company-scoped operations
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useMutation as useReactQueryMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/useAuth';

// Extended mutation options
interface BaseMutationOptions<TData, TError, TVariables> extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  /** Company ID for tenant isolation */
  companyId?: string;
  /** Whether to enable company scoping automatically */
  enableCompanyScope?: boolean;
  /** Query keys to invalidate after successful mutation */
  invalidateQueries?: string[];
  /** Whether to enable optimistic updates */
  optimistic?: boolean;
  /** Optimistic update function */
  optimisticUpdate?: (variables: TVariables) => any;
  /** Custom error handler */
  onError?: (error: TError, variables: TVariables) => void;
  /** Custom success handler */
  onSuccess?: (data: TData, variables: TVariables) => void;
}

// Extended mutation result
interface BaseMutationResult<TData, TError, TVariables> extends UseMutationResult<TData, TError, TVariables> {
  /** Execute mutation with error handling */
  mutateSafely: (variables: TVariables) => Promise<TData | null>;
  /** Reset mutation state */
  reset: () => void;
}

/**
 * Base mutation hook with company scoping and cache management
 */
export function useMutation<TData = unknown, TError = Error, TVariables = unknown>(
  options: {
    mutationFn: (variables: TVariables) => Promise<TData>;
  } & BaseMutationOptions<TData, TError, TVariables>
): BaseMutationResult<TData, TError, TVariables> {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const companyId = options.companyId || (options.enableCompanyScope !== false ? user?.company_id : undefined);

  // Default options
  const defaultOptions: UseMutationOptions<TData, TError, TVariables> = {
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    ...options
  };

  // Handle optimistic updates
  if (options.optimistic && options.optimisticUpdate) {
    defaultOptions.onMutate = async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: options.invalidateQueries });
      
      // Snapshot previous value
      const previousData = options.invalidateQueries?.map(key => 
        queryClient.getQueryData([key, companyId])
      );
      
      // Optimistically update
      if (options.optimisticUpdate) {
        const optimisticData = options.optimisticUpdate(variables);
        options.invalidateQueries?.forEach(key => {
          queryClient.setQueryData([key, companyId], optimisticData);
        });
      }
      
      return { previousData };
    };
    
    defaultOptions.onError = (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        options.invalidateQueries?.forEach((key, index) => {
          queryClient.setQueryData([key, companyId], context.previousData[index]);
        });
      }
      
      options.onError?.(error, variables);
    };
  }

  // Handle cache invalidation
  if (options.invalidateQueries) {
    defaultOptions.onSuccess = (data, variables) => {
      // Invalidate related queries
      options.invalidateQueries?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key, companyId] });
      });
      
      options.onSuccess?.(data, variables);
    };
  }

  // Use React Query mutation
  const mutation = useReactQueryMutation({
    ...defaultOptions,
    mutationFn: options.mutationFn,
  });

  // Enhanced result with utilities
  const enhancedResult: BaseMutationResult<TData, TError, TVariables> = {
    ...mutation,
    mutateSafely: async (variables: TVariables): Promise<TData | null> => {
      try {
        const result = await mutation.mutateAsync(variables);
        return result;
      } catch (error) {
        console.error('Mutation error:', error);
        options.onError?.(error as TError, variables);
        return null;
      }
    },
    reset: () => {
      mutation.reset();
    }
  };

  return enhancedResult;
}

/**
 * Hook for creating resources
 */
export function useCreate<TData = unknown, TError = Error, TVariables = unknown>(
  options: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    queryKey: string;
  } & BaseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    ...options,
    invalidateQueries: [options.queryKey],
    optimistic: true,
    optimisticUpdate: (variables) => {
      // Add new item to list optimistically
      return (oldData: any) => {
        if (Array.isArray(oldData)) {
          return [...oldData, { id: 'temp-' + Date.now(), ...variables, isOptimistic: true }];
        }
        return oldData;
      };
    }
  });
}

/**
 * Hook for updating resources
 */
export function useUpdate<TData = unknown, TError = Error, TVariables = unknown>(
  options: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    queryKey: string;
    getItemId: (variables: TVariables) => string | number;
  } & BaseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    ...options,
    invalidateQueries: [options.queryKey],
    optimistic: true,
    optimisticUpdate: (variables) => {
      const itemId = options.getItemId(variables);
      return (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map(item => 
            item.id === itemId ? { ...item, ...variables, isOptimistic: true } : item
          );
        }
        return oldData;
      };
    }
  });
}

/**
 * Hook for deleting resources
 */
export function useDelete<TData = unknown, TError = Error, TVariables = unknown>(
  options: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    queryKey: string;
    getItemId: (variables: TVariables) => string | number;
  } & BaseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    ...options,
    invalidateQueries: [options.queryKey],
    optimistic: true,
    optimisticUpdate: (variables) => {
      const itemId = options.getItemId(variables);
      return (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.filter(item => item.id !== itemId);
        }
        return oldData;
      };
    }
  });
}

/**
 * Hook for bulk operations
 */
export function useBulkOperation<TData = unknown, TError = Error, TVariables = unknown>(
  options: {
    mutationFn: (variables: TVariables[]) => Promise<TData>;
    queryKey: string;
  } & BaseMutationOptions<TData, TError, TVariables[]>
) {
  return useMutation({
    ...options,
    invalidateQueries: [options.queryKey],
    onSuccess: (data, variables) => {
      // Invalidate queries after bulk operation
      options.invalidateQueries?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key, companyId] });
      });
      
      options.onSuccess?.(data, variables);
    }
  });
} 