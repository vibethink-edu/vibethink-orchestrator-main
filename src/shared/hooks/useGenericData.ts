"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic Data Hook for VibeThink Orchestrator
 * 
 * ⚠️ IMPORTANTE: Este hook actualmente usa datos MOCK
 * Para integrar con base de datos real:
 * 
 * 1. Reemplazar endpoint con URLs reales de API
 * 2. Implementar autenticación en headers
 * 3. Agregar manejo de errores específicos de BD
 * 4. Implementar cache y optimización
 * 
 * Ejemplo de integración con Supabase:
 * ```typescript
 * const { data: users } = useGenericData<User[]>({
 *   endpoint: '/api/users',
 *   headers: { 
 *     'Authorization': `Bearer ${session?.access_token}`,
 *     'company-id': user.company_id 
 *   },
 *   transform: (data) => data.users,
 *   onError: (error) => console.error('DB Error:', error)
 * });
 * ```
 */

export interface UseGenericDataOptions<T> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  initialData?: T;
  autoFetch?: boolean;
  transform?: (data: any) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseGenericDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
  reset: () => void;
}

export function useGenericData<T = any>({
  endpoint,
  method = 'GET',
  headers = {},
  initialData = null,
  autoFetch = true,
  transform,
  onSuccess,
  onError
}: UseGenericDataOptions<T>): UseGenericDataReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar con base de datos real
      // Actualmente usa datos mock - reemplazar con fetch real
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = transform ? transform(rawData) : rawData;
      
      setData(transformedData);
      onSuccess?.(transformedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, headers, transform, onSuccess, onError]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
    reset,
  };
} 