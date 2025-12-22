/**
 * Terminology System
 * 
 * Sistema de terminología atómica y context-aware
 * 
 * Concept IDs atómicos: concept.resource.room (no concept.resource + {type})
 * Unidades con plural: concept.unit.hour = "{count, plural, one {hora} other {horas}}"
 */

import { getTranslationLoader } from './translation-loader-registry';
import { 
  getCachedTranslation, 
  setCachedTranslation, 
  isCached,
  buildCacheKey 
} from './terminology-cache';
import { formatMessage, isICUMessage } from './message-formatter';
import { getRegionalConfigManager } from '../regional-config';

/**
 * Resuelve namespace desde concept ID
 * Ejemplo: 'concept.resource.room' → 'concept'
 */
function getNamespace(conceptId: string): string {
  const parts = conceptId.split('.');
  return parts[0]; // Primer nivel es el namespace
}

/**
 * Resuelve concepto desde traducciones
 */
function resolveConcept(
  translations: Record<string, any>,
  conceptId: string,
  params?: Record<string, any>
): string {
  const keys = conceptId.split('.');
  let current: any = translations;
  
  // Navegar por las keys
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Concepto no encontrado
      console.warn(`[terminology] Concept not found: ${conceptId}`);
      return conceptId; // Fallback al ID
    }
  }
  
  // Si es string, puede ser ICU o texto simple
  if (typeof current === 'string') {
    // Si es ICU, formatear
    if (isICUMessage(current)) {
      const locale = getRegionalConfigManager().getConfig().number.locale;
      return formatMessage(locale, current, params || {});
    }
    
    // Si tiene parámetros legacy {{param}}, reemplazar
    if (params && current.includes('{{')) {
      return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value)),
        current
      );
    }
    
    return current;
  }
  
  // Si no es string, retornar ID como fallback
  return conceptId;
}

/**
 * Obtiene contexto actual desde RegionalConfigManager
 */
function getCurrentContext(): string | null {
  // TODO: Agregar campo 'context' a RegionalConfiguration
  // Por ahora, retornar null (se pasa explícitamente)
  return null;
}

/**
 * Obtiene tenant ID actual desde RegionalConfigManager
 */
function getCurrentTenantId(): string | null {
  // TODO: Agregar campo 'tenantId' a RegionalConfiguration
  // Por ahora, retornar null (se pasa explícitamente)
  return null;
}

/**
 * Resuelve terminología (async)
 * 
 * @param conceptId - ID atómico del concepto (ej: 'concept.resource.room')
 * @param params - Parámetros para ICU (ej: { count: 3 })
 * @param locale - Locale opcional (default: desde RegionalConfigManager)
 * @param context - Contexto opcional (hotel, studio, etc.)
 * @returns Traducción resuelta
 */
export async function term(
  conceptId: string,
  params?: Record<string, any>,
  locale?: string,
  context?: string | null
): Promise<string> {
  const loader = getTranslationLoader();
  const config = getRegionalConfigManager().getConfig();
  
  const finalLocale = locale || config.number.locale;
  const finalContext = context || getCurrentContext();
  const tenantId = getCurrentTenantId();
  const namespace = getNamespace(conceptId);
  
  // Verificar cache primero
  const cacheKey = buildCacheKey(finalLocale, namespace, finalContext, tenantId);
  if (isCached(finalLocale, namespace, finalContext, tenantId)) {
    const cached = getCachedTranslation(finalLocale, namespace, finalContext, tenantId);
    if (cached) {
      return resolveConcept(cached, conceptId, params);
    }
  }
  
  // Cargar traducciones
  const translations = await loader.load(finalLocale, namespace);
  
  // Cachear
  setCachedTranslation(finalLocale, namespace, translations, finalContext, tenantId);
  
  // Resolver concepto
  return resolveConcept(translations, conceptId, params);
}

/**
 * Resuelve terminología (sync) - REQUIERE PRELOAD
 * 
 * @param conceptId - ID atómico del concepto
 * @param params - Parámetros para ICU
 * @param locale - Locale opcional
 * @param context - Contexto opcional
 * @returns Traducción resuelta o fallback
 */
export function termSync(
  conceptId: string,
  params?: Record<string, any>,
  locale?: string,
  context?: string | null
): string {
  const loader = getTranslationLoader();
  const config = getRegionalConfigManager().getConfig();
  
  const finalLocale = locale || config.number.locale;
  const finalContext = context || getCurrentContext();
  const tenantId = getCurrentTenantId();
  const namespace = getNamespace(conceptId);
  
  // Verificar preload
  if (!loader.isPreloaded(finalLocale, namespace)) {
    console.warn(
      `[terminology] termSync() called without preload for: ${conceptId}. ` +
      `Use term() async or preload first.`
    );
    
    // Fallback controlado
    return getFallback(conceptId, params);
  }
  
  // Cargar síncronamente (ya está en cache)
  const translations = loader.loadSync(finalLocale, namespace);
  if (!translations) {
    return getFallback(conceptId, params);
  }
  
  // Resolver concepto
  return resolveConcept(translations, conceptId, params);
}

/**
 * Fallback controlado
 * NUNCA retornar null o undefined
 */
function getFallback(conceptId: string, params?: Record<string, any>): string {
  // Intentar fallback a inglés
  // O retornar concepto genérico
  // Por ahora, retornar el ID como fallback
  return conceptId;
}

/**
 * Preload terminología
 * 
 * @param locale - Locale
 * @param namespaces - Lista de namespaces a precargar
 */
export async function preloadTerminology(
  locale: string,
  namespaces: string[]
): Promise<void> {
  const loader = getTranslationLoader();
  
  await Promise.all(
    namespaces.map(namespace => loader.preload(locale, namespace))
  );
}

