/**
 * Base Debounce Hook for Search Optimization
 * 
 * Provides debounced values for search inputs and API calls
 * - Configurable delay
 * - Immediate execution option
 * - Cleanup on unmount
 * - Type-safe implementation
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// Debounce options
interface DebounceOptions {
  /** Delay in milliseconds */
  delay?: number;
  /** Whether to execute immediately on first call */
  immediate?: boolean;
  /** Whether to execute on trailing edge */
  trailing?: boolean;
  /** Whether to execute on leading edge */
  leading?: boolean;
}

// Default options
const defaultOptions: Required<DebounceOptions> = {
  delay: 300,
  immediate: false,
  trailing: true,
  leading: false
};

/**
 * Hook for debouncing values
 */
export function useDebounce<T>(
  value: T,
  options: DebounceOptions = {}
): T {
  const { delay, immediate } = { ...defaultOptions, ...options };
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set immediate value if option is enabled
    if (immediate) {
      setDebouncedValue(value);
      return;
    }

    // Set up timeout for debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout on unmount or value change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, immediate]);

  return debouncedValue;
}

/**
 * Hook for debouncing function calls
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: DebounceOptions = {}
): T {
  const { delay, immediate, trailing, leading } = { ...defaultOptions, ...options };
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallRef = useRef<{ args: Parameters<T>; timestamp: number }>();

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const lastCall = lastCallRef.current;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Execute immediately if leading and no recent call
    if (leading && (!lastCall || now - lastCall.timestamp > delay)) {
      callback(...args);
      lastCallRef.current = { args, timestamp: now };
      return;
    }

    // Store call for trailing execution
    lastCallRef.current = { args, timestamp: now };

    // Set timeout for trailing execution
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        if (lastCallRef.current) {
          callback(...lastCallRef.current.args);
          lastCallRef.current = undefined;
        }
      }, delay);
    }
  }, [callback, delay, immediate, trailing, leading]) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook for debounced search
 */
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  options: DebounceOptions & {
    /** Minimum query length to trigger search */
    minLength?: number;
    /** Initial search results */
    initialResults?: T[];
  } = {}
): {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => void;
} {
  const { minLength = 2, initialResults = [], ...debounceOptions } = options;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounced search function
  const debouncedSearch = useDebouncedCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minLength) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(searchQuery);
        setResults(searchResults);
      } catch (err) {
        setError(err as Error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    debounceOptions
  );

  // Handle query changes
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);

  // Manual search function
  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [debouncedSearch]);

  return {
    query,
    setQuery: handleQueryChange,
    results,
    loading,
    error,
    search
  };
}

/**
 * Hook for debounced API calls
 */
export function useDebouncedApiCall<T, P>(
  apiFunction: (params: P) => Promise<T>,
  options: DebounceOptions & {
    /** Initial data */
    initialData?: T;
    /** Whether to execute on mount */
    executeOnMount?: boolean;
  } = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (params: P) => void;
  reset: () => void;
} {
  const { initialData = null, executeOnMount = false, ...debounceOptions } = options;
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounced API call
  const debouncedApiCall = useDebouncedCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(params);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    debounceOptions
  );

  // Execute function
  const execute = useCallback((params: P) => {
    debouncedApiCall(params);
  }, [debouncedApiCall]);

  // Reset function
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  // Execute on mount if requested
  useEffect(() => {
    if (executeOnMount && initialData) {
      // This would need the initial params to be passed in options
      // For now, just set the initial data
    }
  }, [executeOnMount, initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

/**
 * Hook for debounced form validation
 */
export function useDebouncedValidation<T>(
  validationFunction: (value: T) => Promise<string | null>,
  options: DebounceOptions = {}
): {
  value: T | null;
  setValue: (value: T) => void;
  error: string | null;
  validating: boolean;
  validate: (value: T) => void;
} {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  // Debounced validation
  const debouncedValidation = useDebouncedCallback(
    async (validationValue: T) => {
      setValidating(true);
      setError(null);

      try {
        const validationError = await validationFunction(validationValue);
        setError(validationError);
      } catch (err) {
        setError('Error during validation');
      } finally {
        setValidating(false);
      }
    },
    options
  );

  // Handle value changes
  const handleValueChange = useCallback((newValue: T) => {
    setValue(newValue);
    debouncedValidation(newValue);
  }, [debouncedValidation]);

  // Manual validation
  const validate = useCallback((validationValue: T) => {
    setValue(validationValue);
    debouncedValidation(validationValue);
  }, [debouncedValidation]);

  return {
    value,
    setValue: handleValueChange,
    error,
    validating,
    validate
  };
} 