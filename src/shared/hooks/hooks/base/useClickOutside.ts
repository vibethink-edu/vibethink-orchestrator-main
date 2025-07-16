import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook base para detectar clics fuera de un elemento
 * 
 * @param handler - Función a ejecutar cuando se hace clic fuera
 * @param enabled - Si el hook está habilitado
 * @returns Ref que debe asignarse al elemento a monitorear
 * 
 * @example
 * ```tsx
 * const ref = useClickOutside(() => {
 *   setIsOpen(false);
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     <button onClick={() => setIsOpen(true)}>Abrir</button>
 *     {isOpen && <Dropdown />}
 *   </div>
 * );
 * ```
 */
export const useClickOutside = (
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): RefObject<HTMLElement> => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // No ejecutar si el clic fue dentro del elemento
      if (ref.current && ref.current.contains(target)) {
        return;
      }

      handler(event);
    };

    // Agregar listeners para mouse y touch
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, enabled]);

  return ref;
}; 