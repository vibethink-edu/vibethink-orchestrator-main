import { useRef, useEffect } from 'react';

/**
 * Hook base para obtener el valor anterior de una variable
 * 
 * @param value - Valor actual
 * @returns Valor anterior
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 * 
 * console.log('Anterior:', previousCount, 'Actual:', count);
 * ```
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}; 