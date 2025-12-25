/**
 * Terminology Cache
 * 
 * Sistema de cache para terminología con soporte multi-tenant
 * Cache keys: locale:context:tenantId:namespace
 */

/**
 * Estructura de cache key
 */
interface CacheKey {
  locale: string;
  context: string | null;
  tenantId: string | null;
  namespace: string;
}

/**
 * Cache de terminología
 * Key: locale:context:tenantId:namespace
 * Value: Traducciones
 */
const terminologyCache = new Map<string, Record<string, any>>();

/**
 * Construye cache key
 */
export function buildCacheKey(
  locale: string,
  namespace: string,
  context?: string | null,
  tenantId?: string | null
): string {
  const contextPart = context || 'null';
  const tenantPart = tenantId || 'null';
  return `${locale}:${contextPart}:${tenantPart}:${namespace}`;
}

/**
 * Obtiene traducciones del cache
 */
export function getCachedTranslation(
  locale: string,
  namespace: string,
  context?: string | null,
  tenantId?: string | null
): Record<string, any> | null {
  const key = buildCacheKey(locale, namespace, context, tenantId);
  return terminologyCache.get(key) || null;
}

/**
 * Almacena traducciones en cache
 */
export function setCachedTranslation(
  locale: string,
  namespace: string,
  translation: Record<string, any>,
  context?: string | null,
  tenantId?: string | null
): void {
  const key = buildCacheKey(locale, namespace, context, tenantId);
  terminologyCache.set(key, translation);
}

/**
 * Limpia todo el cache de terminología
 */
export function clearTerminologyCache(): void {
  terminologyCache.clear();
}

/**
 * Limpia cache específico
 */
export function clearTerminologyCacheFor(
  locale?: string,
  context?: string,
  tenantId?: string
): void {
  const keysToDelete: string[] = [];
  
  for (const key of terminologyCache.keys()) {
    const [keyLocale, keyContext, keyTenant, _namespace] = key.split(':');
    
    if (locale && keyLocale !== locale) continue;
    if (context !== undefined && keyContext !== (context || 'null')) continue;
    if (tenantId && keyTenant !== tenantId) continue;
    
    keysToDelete.push(key);
  }
  
  keysToDelete.forEach(key => terminologyCache.delete(key));
}

/**
 * Verifica si está en cache
 */
export function isCached(
  locale: string,
  namespace: string,
  context?: string | null,
  tenantId?: string | null
): boolean {
  const key = buildCacheKey(locale, namespace, context, tenantId);
  return terminologyCache.has(key);
}




