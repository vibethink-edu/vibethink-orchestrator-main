import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseIntersectionObserverResult {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook base para detectar cuando un elemento es visible en el viewport
 * 
 * @param options - Opciones del IntersectionObserver
 * @returns Resultado con ref, estado de intersección y entry
 * 
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '50px'
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? 'Visible' : 'No visible'}
 *   </div>
 * );
 * ```
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, enabled]);

  return { ref, isIntersecting, entry };
}; 