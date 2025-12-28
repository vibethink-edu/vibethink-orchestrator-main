/**
 * useAutoDetectContext Hook
 * 
 * IA First: Auto-detecta contexto desde ruta actual
 * Permite que componentes reutilizables funcionen para múltiples contextos
 * sin necesidad de pasar context explícitamente.
 * 
 * @example
 * // En /dashboard-bundui/hotel/bookings
 * const context = useAutoDetectContext(); // → 'hotel'
 * 
 * // En /dashboard-bundui/studio/bookings
 * const context = useAutoDetectContext(); // → 'studio'
 */

'use client';

import { usePathname } from 'next/navigation';

export type ModuleContext = 'hotel' | 'studio' | 'cowork' | 'coliving' | null;

/**
 * Auto-detecta contexto desde ruta actual
 * 
 * @returns Contexto detectado o null si no se puede detectar
 */
export function useAutoDetectContext(): ModuleContext {
  const pathname = usePathname();
  
  // Detectar contexto desde ruta
  if (pathname.includes('/hotel')) return 'hotel';
  if (pathname.includes('/studio')) return 'studio';
  if (pathname.includes('/cowork')) return 'cowork';
  if (pathname.includes('/coliving')) return 'coliving';
  
  // Sin contexto específico
  return null;
}

/**
 * Resuelve contexto desde ruta (versión síncrona para uso fuera de componentes)
 * 
 * @param pathname - Ruta a analizar
 * @returns Contexto detectado o null
 */
export function resolveContextFromPath(pathname: string): ModuleContext {
  if (pathname.includes('/hotel')) return 'hotel';
  if (pathname.includes('/studio')) return 'studio';
  if (pathname.includes('/cowork')) return 'cowork';
  if (pathname.includes('/coliving')) return 'coliving';
  
  return null;
}












