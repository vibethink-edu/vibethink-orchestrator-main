/**
 * Exportaciones de todos los hooks base
 * 
 * Facilita las importaciones usando destructuring
 * 
 * @example
 * ```tsx
 * import { useQuery, useMutation, useLocalStorage } from '@/shared/hooks/base';
 * ```
 */

export { useQuery } from './useQuery';
export { useMutation } from './useMutation';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useClickOutside } from './useClickOutside';
export { useIntersectionObserver } from './useIntersectionObserver';
export { usePrevious } from './usePrevious';
export { useAsync } from './useAsync';
export { useToggle } from './useToggle';
export { useWindowSize } from './useWindowSize';
export { useMediaQuery } from './useMediaQuery'; 