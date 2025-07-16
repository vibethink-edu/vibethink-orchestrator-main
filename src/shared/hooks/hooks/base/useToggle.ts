import { useState, useCallback } from 'react';

/**
 * Hook base para manejar estados booleanos con toggle
 * 
 * @param initialValue - Valor inicial
 * @returns [valor, toggle, setValue, reset]
 * 
 * @example
 * ```tsx
 * const [isOpen, toggle, setIsOpen, reset] = useToggle(false);
 * 
 * // Toggle
 * toggle();
 * 
 * // Set específico
 * setIsOpen(true);
 * 
 * // Reset al valor inicial
 * reset();
 * ```
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, toggle, setValue, reset] as const;
}; 