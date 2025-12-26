/**
 * CAPA 2: Terminology Cache (Cache en Memoria para Terminología)
 * 
 * Este módulo implementa un sistema de cache en memoria para optimizar
 * la resolución de concept IDs. Es especialmente importante para termSync()
 * que debe funcionar de forma síncrona (sin I/O).
 * 
 * @package @vibethink/utils
 */

import {
  ConceptID,
  TerminologyContext,
} from './types';

/**
 * Estructura del valor en cache
 * 
 * Almacena el valor resuelto (string o ConceptObject) junto con
 * metadata de cuándo fue cacheado.
 */
interface CacheEntry {
  value: string | Record<string, unknown>;
  timestamp: number;
  ttl?: number; // Time-to-live en milisegundos
}

/**
 * Cache en memoria simple
 * 
 * Key: string (formato: locale:productContext:domainContext:tenantId:namespace:conceptId)
 * Value: CacheEntry
 */
class TerminologyCache {
  private cache = new Map<string, CacheEntry>();

  /**
   * Obtiene un valor del cache
   */
  get(key: string): CacheEntry | undefined {
    return this.cache.get(key);
  }

  /**
   * Establece un valor en cache
   */
  set(key: string, value: CacheEntry): void {
    this.cache.set(key, {
      ...value,
      timestamp: Date.now(),
    });
  }

  /**
   * Verifica si una key existe en cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Elimina una key del cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Obtiene todas las keys del cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene el tamaño del cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Elimina entradas expiradas
   */
  prune(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      // Verificar TTL si existe
      if (entry.ttl && (now - entry.timestamp) > entry.ttl) {
        this.delete(key);
      }
    }
  }
}

/**
 * Instancia única del cache
 */
const terminologyCache = new TerminologyCache();

/**
 * Configuración de cache
 */
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos en milisegundos
const CACHE_PRUNE_INTERVAL = 5 * 60 * 1000; // Limpieza cada 5 minutos

/**
 * Intervalo de limpieza automática
 */
let pruneInterval: NodeJS.Timeout | null = null;

/**
 * Inicia la limpieza automática del cache
 */
function startPruning(): void {
  if (pruneInterval) {
    return; // Ya está corriendo
  }

  pruneInterval = setInterval(() => {
    terminologyCache.prune();
  }, CACHE_PRUNE_INTERVAL);

  console.log(`[TerminologyCache] Auto-pruning started (interval: ${CACHE_PRUNE_INTERVAL}ms)`);
}

/**
 * Detiene la limpieza automática del cache
 */
function stopPruning(): void {
  if (pruneInterval) {
    clearInterval(pruneInterval);
    pruneInterval = null;
    console.log('[TerminologyCache] Auto-pruning stopped');
  }
}

/**
 * Constructor de cache key
 * 
 * Formato: locale:productContext:domainContext:tenantId:namespace:conceptId
 * 
 * @param conceptId - El Concept ID
 * @param context - Contexto de terminología
 * @returns Cache key
 */
export function buildCacheKey(
  conceptId: ConceptID,
  context: TerminologyContext
): string {
  const parts = [
    context.locale || 'en',
    context.productContext || 'null',
    context.domainContext || 'null',
    context.tenantId || 'null',
  ];
  
  return `${parts.join(':')}:${conceptId}`;
}

/**
 * Obtiene un valor del cache
 * 
 * @param cacheKey - Key del cache
 * @returns Valor cacheado o undefined
 */
export function getFromCache(cacheKey: string): CacheEntry | undefined {
  return terminologyCache.get(cacheKey);
}

/**
 * Establece un valor en cache
 * 
 * @param cacheKey - Key del cache
 * @param value - Valor a cachear
 * @param ttl - Time-to-live opcional en milisegundos (default: 30 minutos)
 */
export function setInCache(
  cacheKey: string,
  value: CacheEntry,
  ttl: number = CACHE_TTL
): void {
  terminologyCache.set(cacheKey, {
    ...value,
    ttl,
  });
  
  console.log(`[TerminologyCache] Cached: ${cacheKey}`);
}

/**
 * Verifica si una key existe en cache
 * 
 * @param cacheKey - Key del cache
 * @returns true si existe
 */
export function hasCache(cacheKey: string): boolean {
  return terminologyCache.has(cacheKey);
}

/**
 * Elimina una key del cache
 * 
 * @param cacheKey - Key del cache
 * @returns true si se eliminó
 */
export function deleteFromCache(cacheKey: string): boolean {
  const deleted = terminologyCache.delete(cacheKey);
  
  if (deleted) {
    console.log(`[TerminologyCache] Deleted: ${cacheKey}`);
  }
  
  return deleted;
}

/**
 * Limpia TODO el cache de terminología
 * 
 * Útil cuando:
 * - Se cambia el idioma
 * - Se cambia el contexto de producto
 * - Se necesita refrescar la terminología
 */
export function clearTerminologyCache(): void {
  terminologyCache.clear();
  console.log(`[TerminologyCache] Cache cleared (size: ${terminologyCache.size()})`);
}

/**
 * Limpia el cache para un contexto específico
 * 
 * @param locale - Idioma a limpiar (opcional)
 * @param productContext - Contexto de producto a limpiar (opcional)
 * @param tenantId - ID de inquilino a limpiar (opcional)
 */
export function clearTerminologyCacheFor(
  locale?: string,
  productContext?: string,
  tenantId?: string
): void {
  const keysToDelete: string[] = [];
  
  for (const key of terminologyCache.keys()) {
    // Parse key: locale:productContext:domainContext:tenantId:conceptId
    const parts = key.split(':');
    
    if (parts.length < 6) {
      continue; // Formato inválido, saltar
    }
    
    const [keyLocale, keyProduct, _keyDomain, _keyTenant, _keyNamespace, _conceptId] = parts;
    
    // Verificar si coincide con filtros
    let shouldDelete = false;
    
    if (locale && keyLocale !== locale) {
      shouldDelete = true;
    } else if (productContext && keyProduct !== productContext) {
      shouldDelete = true;
    } else if (tenantId && keyTenant !== tenantId) {
      shouldDelete = true;
    }
    
    if (shouldDelete) {
      keysToDelete.push(key);
    }
  }
  
  // Eliminar keys seleccionadas
  keysToDelete.forEach(key => terminologyCache.delete(key));
  
  if (keysToDelete.length > 0) {
    console.log(`[TerminologyCache] Cleared ${keysToDelete.length} entries for context:`, {
      locale,
      productContext,
      tenantId,
    });
  }
}

/**
 * Obtiene estadísticas del cache
 * 
 * Útil para debugging y monitoring.
 * 
 * @returns Estadísticas del cache
 */
export function getCacheStats(): {
  size: number;
  keys: string[];
  entries: number;
  hitRate: number;
} {
  const keys = terminologyCache.keys();
  const now = Date.now();
  let activeEntries = 0;
  
  // Contar entradas activas (no expiradas)
  for (const [key, entry] of terminologyCache.entries()) {
    if (entry.ttl && (now - entry.timestamp) > entry.ttl) {
      continue; // Expirada
    }
    activeEntries++;
  }
  
  // Calcular hit rate (simulado)
  // En una implementación real, se trackearían hits/misses
  const hitRate = activeEntries > 0 ? 0.85 : 0; // Placeholder
  
  return {
    size: terminologyCache.size(),
    keys,
    entries: activeEntries,
    hitRate,
  };
}

/**
 * Inicializa el sistema de cache
 * 
 * Limpia entradas expiradas y arranca la limpieza automática.
 */
export function initTerminologyCache(): void {
  console.log('[TerminologyCache] Initializing...');
  
  // Limpiar entradas expiradas
  terminologyCache.prune();
  
  // Iniciar limpieza automática
  startPruning();
  
  // Mostrar stats iniciales
  const stats = getCacheStats();
  console.log('[TerminologyCache] Initial stats:', stats);
}

/**
 * Finaliza el sistema de cache
 * 
 * Limpia todo el cache y detiene la limpieza automática.
 */
export function destroyTerminologyCache(): void {
  console.log('[TerminologyCache] Destroying...');
  
  stopPruning();
  clearTerminologyCache();
}

/**
 * Auto-inicialización
 */
if (typeof window === 'undefined') {
  // Solo inicializar en el server (Node.js)
  initTerminologyCache();
  
  // Cleanup al terminar el proceso
  process.on('exit', () => {
    destroyTerminologyCache();
  });
}

