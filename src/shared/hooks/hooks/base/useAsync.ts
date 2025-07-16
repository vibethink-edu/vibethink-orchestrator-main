import { useState, useCallback, useEffect } from 'react';

interface UseAsyncOptions<T> {
  asyncFn: () => Promise<T>;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<T>;
  reset: () => void;
}

/**
 * Hook base para manejar operaciones asíncronas
 * 
 * @param options - Opciones de configuración
 * @returns Resultado con data, loading, error y funciones
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAsync({
 *   asyncFn: () => fetchUser(userId),
 *   immediate: true,
 *   onSuccess: (user) => console.log('Usuario cargado:', user),
 *   onError: (error) => console.error('Error:', error),
 * });
 * ```
 */
export const useAsync = <T>({
  asyncFn,
  immediate = false,
  onSuccess,
  onError,
}: UseAsyncOptions<T>): UseAsyncResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      setData(result);
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
  }, [asyncFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, reset };
}; 