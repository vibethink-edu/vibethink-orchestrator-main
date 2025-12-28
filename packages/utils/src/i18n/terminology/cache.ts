/**
<<<<<<< HEAD
 * Cache simple en memoria para terminology
 * 
 * CAPA 2: Terminology Cache
 */
export const terminologyCache = new Map<string, string>();

export function clearTerminologyCache(): void {
  terminologyCache.clear();
}

export function getCacheStats() {
  return {
    size: terminologyCache.size,
    keys: Array.from(terminologyCache.keys()).slice(0, 10),
  };
}



=======
 * CAPA 2: Cache en Memoria para Terminología
 * 
 * Este módulo implementa un sistema de cache en memoria
 * para optimizar la resolución de concept IDs.
 * 
 * Características:
 * - TTL (Time-To-Live) de 30 minutos por defecto
 * - Limpieza automática cada 5 minutos
 * - Soporte para limpieza por contexto (idioma, producto, tenant)
 * - Estadísticas de uso del cache
 * 
 * @package @vibethink/utils
 */

/**
 * Entry de cache con timestamp
 */
export interface CacheEntry<T = string> {
  /**
   * Valor cacheado
   */
  value: T;

  /**
   * Timestamp de creación del entry
   */
  createdAt: number;

  /**
   * TTL específico para este entry (opcional)
   * Si no se especifica, usa DEFAULT_TTL
   */
  ttl?: number;
}

/**
 * Map global en memoria para cache
 */
export const terminologyCache = new Map<string, CacheEntry<string>>();

/**
 * TTL por defecto (30 minutos en milisegundos)
 */
const DEFAULT_TTL = 30 * 60 * 1000; // 30 min

/**
 * Intervalo de limpieza automática (5 minutos en milisegundos)
 */
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 min

/**
 * Última limpieza realizada (timestamp)
 */
let lastCleanup = Date.now();

/**
 * Estadísticas del cache
 */
interface CacheStats {
  /**
   * Número de entries en cache
   */
  size: number;

  /**
   * Tamaño aproximado del cache en bytes
   */
  memoryUsageBytes?: number;

  /**
   * Número de hits (lecturas exitosas)
   */
  hits?: number;

  /**
   * Número de misses (lecturas fallidas)
   */
  misses?: number;

  /**
   * Ratio de efectividad (hits / total)
   */
  hitRate?: number;
}

/**
 * Estadísticas internas del cache
 */
const stats = {
  hits: 0,
  misses: 0,
};

/**
 * Obtiene un valor del cache
 * 
 * @param key - La clave del cache
 * @returns El valor cacheado o undefined si no existe o expiró
 * 
 * @example
 * ```typescript
 * const cached = getFromCache('es:hotel:::concept.booking.resource.room');
 * if (cached) {
 *   return cached; // "Habitación"
 * }
 * // ... cargar desde loader
 * ```
 */
export function getFromCache(key: string): string | undefined {
  const entry = terminologyCache.get(key);

  // Si no existe en cache
  if (!entry) {
    stats.misses++;
    return undefined;
  }

  // Verificar TTL
  const now = Date.now();
  const ttl = entry.ttl || DEFAULT_TTL;
  const isExpired = now - entry.createdAt > ttl;

  if (isExpired) {
    stats.misses++;
    terminologyCache.delete(key);
    console.debug(`[Terminology Cache] Cache entry expired: ${key}`);
    return undefined;
  }

  stats.hits++;
  return entry.value;
}

/**
 * Guarda un valor en el cache
 * 
 * @param key - La clave del cache
 * @param value - El valor a cachear
 * @param ttl - TTL específico opcional (default: 30 min)
 * 
 * @example
 * ```typescript
 * setInCache('es:hotel:::concept.booking.resource.room', 'Habitación');
 * setInCache('en:studio:::concept.booking.time.checkin', 'Check-in', 60000); // 1 min TTL
 * ```
 */
export function setInCache(
  key: string,
  value: string,
  ttl?: number
): void {
  const now = Date.now();
  
  terminologyCache.set(key, {
    value,
    createdAt: now,
    ttl,
  });
  
  console.debug(`[Terminology Cache] Cached: ${key}`);
}

/**
 * Verifica si una clave existe en cache
 * 
 * @param key - La clave a verificar
 * @returns true si existe y no expiró
 * 
 * @example
 * ```typescript
 * if (hasCache('es:hotel:::concept.booking.resource.room')) {
 *   // Está en cache
 * } else {
 *   // No está en cache
 * }
 * ```
 */
export function hasCache(key: string): boolean {
  const cached = getFromCache(key);
  return cached !== undefined;
}

/**
 * Elimina una entrada específica del cache
 * 
 * @param key - La clave a eliminar
 * @returns true si existía, false si no
 * 
 * @example
 * ```typescript
 * // Eliminar un concepto específico
 * deleteFromCache('es:hotel:::concept.booking.resource.room');
 * ```
 */
export function deleteFromCache(key: string): boolean {
  const existed = terminologyCache.has(key);
  terminologyCache.delete(key);
  
  if (existed) {
    console.debug(`[Terminology Cache] Deleted: ${key}`);
  }
  
  return existed;
}

/**
 * Limpia todo el cache de terminología
 * 
 * ⚠️ Esta operación es DESTRUCTIVA.
 * Limpia todo el cache en memoria.
 * 
 * @example
 * ```typescript
 * // En cambio de idioma o producto:
 * clearTerminologyCache();
 * // Todo se recalculará en la próxima resolución
 * ```
 */
export function clearTerminologyCache(): void {
  const size = terminologyCache.size;
  terminologyCache.clear();
  
  // Resetear estadísticas
  stats.hits = 0;
  stats.misses = 0;
  lastCleanup = Date.now();
  
  console.log(`[Terminology Cache] Cache cleared. ${size} entries removed.`);
}

/**
 * Limpia el cache para un contexto específico
 * 
 * Útil cuando cambia el idioma o producto.
 * 
 * @param options - Opciones de filtrado
 * 
 * @example
 * ```typescript
 * // Limpiar solo español:
 * clearTerminologyCacheFor({ locale: 'es' });
 * 
 * // Limpiar solo hotel:
 * clearTerminologyCacheFor({ productContext: 'hotel' });
 * 
 * // Limpiar español + hotel:
 * clearTerminologyCacheFor({ locale: 'es', productContext: 'hotel' });
 * ```
 */
export function clearTerminologyCacheFor(options: {
  locale?: string;
  productContext?: string;
  domainContext?: string;
  tenantId?: string;
}): void {
  const { locale, productContext, domainContext, tenantId } = options;
  
  let count = 0;

  // Iterar sobre todas las claves y eliminar las que coinciden
  for (const [key, _] of terminologyCache) {
    const shouldDelete = shouldDeleteKey(key, {
      locale,
      productContext,
      domainContext,
      tenantId,
    });

    if (shouldDelete) {
      terminologyCache.delete(key);
      count++;
    }
  }

  console.log(
    `[Terminology Cache] Cleared ${count} entries matching:`,
    options
  );
}

/**
 * Construye un cache key a partir de contexto
 *
 * Formato: locale:productContext:domainContext:tenantId:conceptId
 *
 * @param conceptId - El Concept ID
 * @param locale - El idioma
 * @param context - El contexto de terminología
 * @returns El cache key construido
 *
 * @example
 * ```typescript
 * buildCacheKey('concept.booking.resource.room', 'es', { productContext: 'hotel' });
 * // → "es:hotel:::concept.booking.resource.room"
 *
 * buildCacheKey('concept.crm.entity.deal', 'en', {});
 * // → "en:::concept.crm.entity.deal"
 *
 * buildCacheKey('concept.booking.time.checkin', 'es', {
 *   productContext: 'hotel',
 *   domainContext: 'booking',
 *   tenantId: 'tenant-123'
 * });
 * // → "es:hotel:booking:tenant-123:concept.booking.time.checkin"
 * ```
 */
export function buildCacheKey(
  conceptId: string,
  locale: string,
  context: {
    productContext?: string;
    domainContext?: string;
    tenantId?: string;
    workspaceContext?: string;
    industryContext?: string;
  } = {}
): string {
  const parts = [
    locale,
    context.productContext || '',
    context.domainContext || '',
    context.tenantId || '',
  ];

  return `${parts.join(':')}:${conceptId}`;
}

/**
 * Ejecuta limpieza automática del cache
 * 
 * Elimina entries expirados.
 * Se llama automáticamente antes de cada operación de cache.
 */
function autoCleanup(): void {
  const now = Date.now();
  const timeSinceLastCleanup = now - lastCleanup;

  // Ejecutar cleanup solo cada CLEANUP_INTERVAL (5 min)
  if (timeSinceLastCleanup < CLEANUP_INTERVAL) {
    return;
  }

  let count = 0;

  for (const [key, entry] of terminologyCache) {
    const ttl = entry.ttl || DEFAULT_TTL;
    const isExpired = now - entry.createdAt > ttl;

    if (isExpired) {
      terminologyCache.delete(key);
      count++;
    }
  }

  if (count > 0) {
    console.log(`[Terminology Cache] Auto-cleanup: ${count} expired entries removed`);
    lastCleanup = now;
  }
}

/**
 * Determina si una clave debe eliminarse basado en filtros
 * 
 * @param key - La clave del cache
 * @param filters - Filtros a aplicar
 * @returns true si debe eliminarse
 */
function shouldDeleteKey(
  key: string,
  filters: {
    locale?: string;
    productContext?: string;
    domainContext?: string;
    tenantId?: string;
  }
): boolean {
  const { locale, productContext, domainContext, tenantId } = filters;
  
  // Parsear la clave
  const parts = key.split(':');
  const keyLocale = parts[0];
  const keyProductContext = parts[1];
  const keyDomainContext = parts[2];
  const keyTenantId = parts[3];

  // Aplicar filtros (todos opcionales, todos AND)
  let shouldDelete = false;

  if (locale && keyLocale === locale) {
    shouldDelete = true;
  }
  if (productContext && keyProductContext === productContext) {
    shouldDelete = true;
  }
  if (domainContext && keyDomainContext === domainContext) {
    shouldDelete = true;
  }
  if (tenantId && keyTenantId === tenantId) {
    shouldDelete = true;
  }

  return shouldDelete;
}

/**
 * Obtiene estadísticas del cache
 * 
 * Útil para monitoreo y debugging.
 * 
 * @returns Estadísticas del cache
 * 
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log(`Cache size: ${stats.size}`);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
export function getCacheStats(): CacheStats {
  const now = Date.now();
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? (stats.hits / total) * 100 : 0;

  // Estimación de memoria (aprox 50 bytes por entry)
  const memoryUsageBytes = terminologyCache.size * 50;

  return {
    size: terminologyCache.size,
    memoryUsageBytes,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: Math.round(hitRate * 100) / 100,
  };
}

/**
 * Inicializa el cache de terminología
 * 
 * Se puede llamar en el bootstrap de la aplicación.
 */
export function initTerminologyCache(): void {
  console.log('[Terminology Cache] Initialized');
  
  // Resetear estadísticas
  stats.hits = 0;
  stats.misses = 0;
  lastCleanup = Date.now();
}

/**
 * Destruye el cache de terminología
 * 
 * Limpia todo y resetea estadísticas.
 */
export function destroyTerminologyCache(): void {
  const size = terminologyCache.size;
  terminologyCache.clear();
  
  // Resetear estadísticas
  stats.hits = 0;
  stats.misses = 0;
  lastCleanup = Date.now();
  
  console.log(`[Terminology Cache] Destroyed. ${size} entries removed.`);
}

// Ejecutar cleanup automático en cada operación de cache
// Esto mantiene el cache limpio sin necesidad de scheduled tasks
export function withAutoCleanup<T>(operation: () => T): T {
  autoCleanup();
  const result = operation();
  autoCleanup();
  return result;
}

// Auto-cleanup en exports
export const getFromCacheAuto = (key: string) => withAutoCleanup(() => getFromCache(key));
export const setInCacheAuto = (key: string, value: string, ttl?: number) => 
  withAutoCleanup(() => setInCache(key, value, ttl));
export const clearTerminologyCacheAuto = () => withAutoCleanup(() => clearTerminologyCache());
>>>>>>> zealous-williams
