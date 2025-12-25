/**
 * CAPA 2: Terminology Engine
 * 
 * Backend: TranslationLoader registry (existente)
 * Soporta: context overrides, async/sync, cache
 * 
 * IMPORTANTE: NO usa i18next directamente, usa registry para mantener compatibilidad
 */

import { getTranslationLoader } from '../translation-loader-registry';
import { 
  ConceptID, 
  AgentContext, 
  TerminologyContext, 
  Locale, 
  ProductContext 
} from './types';
import { terminologyCache, clearTerminologyCache } from './cache';

/**
 * Extrae valor de traducción (soporta objeto o string)
 */
function extractTranslationValue(
  data: any,
  conceptId: string
): string | null {
  if (!data) return null;
  
  // Si es string directo
  if (typeof data === 'string') {
    return data;
  }
  
  // Si es objeto con conceptId como key
  if (data[conceptId]) {
    const value = data[conceptId];
    // Si es objeto con label, extraer label
    if (typeof value === 'object' && value.label) {
      return value.label;
    }
    // Si es string, retornar directo
    if (typeof value === 'string') {
      return value;
    }
  }
  
  return null;
}

/**
 * Resuelve terminology (Async - para AI Agents)
 * 
 * CAPA 2 API Principal
 * 
 * @param conceptId - Semantic ID de CAPA 1
 * @param context - AgentContext MANDATORIO
 * 
 * @example
 * await term('concept.booking.resource.room', {
 *   domain: 'booking',
 *   productContext: 'hotel',
 *   locale: 'en',
 *   tenantId: 'acme'
 * });
 * // → "Room"
 */
export async function term(
  conceptId: ConceptID,
  context: AgentContext
): Promise<string> {
  const { domain, productContext, locale, tenantId } = context;
  
  // Validación estricta
  if (!domain || !productContext || !locale || !tenantId) {
    throw new Error(
      `[Terminology] AgentContext incomplete. ` +
      `Required: domain, productContext, locale, tenantId. ` +
      `Got: ${JSON.stringify(context)}`
    );
  }

  // ✅ Usar registry existente (NO i18next directo)
  const loader = getTranslationLoader();
  
  // Namespace base
  const baseNS = 'concept';
  
  // Namespace override por producto
  const productNS = `concept-${productContext}`; // concept-hotel, concept-studio

  // Cache key
  const cacheKey = `${locale}::${productContext}::${conceptId}`;
  
  // Verificar cache
  const cached = terminologyCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Intentar override primero (productNS)
  try {
    const overrideTranslations = await loader.load(locale, productNS);
    const overrideValue = extractTranslationValue(overrideTranslations, conceptId);
    
    if (overrideValue) {
      terminologyCache.set(cacheKey, overrideValue);
      return overrideValue;
    }
  } catch (error) {
    // Override no existe, continuar con base
  }
  
  // Fallback a base
  try {
    const baseTranslations = await loader.load(locale, baseNS);
    const baseValue = extractTranslationValue(baseTranslations, conceptId);
    
    if (baseValue) {
      terminologyCache.set(cacheKey, baseValue);
      return baseValue;
    }
  } catch (error) {
    console.warn(`[Terminology] Failed to load ${baseNS} for ${locale}:`, error);
  }
  
  // No encontrado
  console.warn(`[Terminology] Concept not found: ${conceptId} in locale ${locale}`);
  return conceptId;
}

/**
 * Resuelve terminology (Sync - para UI)
 * 
 * IMPORTANTE: Requiere preload con preloadTerminology()
 * 
 * @param conceptId - Semantic ID de CAPA 1
 * @param context - TerminologyContext opcional
 * 
 * @example
 * termSync('concept.booking.resource.room', {
 *   productContext: 'hotel',
 *   locale: 'en'
 * });
 * // → "Room"
 */
export function termSync(
  conceptId: ConceptID,
  context: TerminologyContext = {}
): string {
  const locale = (context.locale || 'en') as Locale;
  const productContext = context.productContext;
  
  // Check cache
  const cacheKey = `${locale}::${productContext || 'base'}::${conceptId}`;
  const cached = terminologyCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // ✅ Usar registry existente (síncrono, requiere preload)
  const loader = getTranslationLoader();
  
  const baseNS = 'concept';
  const productNS = productContext ? `concept-${productContext}` : null;

  // Intentar override primero
  if (productNS) {
    try {
      const overrideTranslations = loader.loadSync(locale, productNS);
      if (overrideTranslations) {
        const overrideValue = extractTranslationValue(overrideTranslations, conceptId);
        if (overrideValue) {
          terminologyCache.set(cacheKey, overrideValue);
          return overrideValue;
        }
      }
    } catch (error) {
      // Override no precargado o no existe
    }
  }
  
  // Fallback a base
  try {
    const baseTranslations = loader.loadSync(locale, baseNS);
    if (baseTranslations) {
      const baseValue = extractTranslationValue(baseTranslations, conceptId);
      if (baseValue) {
        terminologyCache.set(cacheKey, baseValue);
        return baseValue;
      }
    }
  } catch (error) {
    console.warn(
      `[Terminology] termSync called without preload for: ${conceptId}. ` +
      `Call preloadTerminology() first. Error: ${error}`
    );
  }
  
  // No encontrado
  return conceptId;
}

/**
 * Precarga terminology para uso síncrono
 * 
 * Llamar en Server Component o al inicio de app
 * 
 * @param locale - Idioma a precargar
 * @param productContexts - Productos a precargar (opcional)
 * 
 * @example
 * await preloadTerminology('en', ['hotel', 'studio']);
 */
export async function preloadTerminology(
  locale: Locale,
  productContexts?: ProductContext[]
): Promise<void> {
  const loader = getTranslationLoader();
  
  // Preload base
  await loader.preload(locale, 'concept');
  
  // Preload overrides
  if (productContexts && productContexts.length > 0) {
    await Promise.all(
      productContexts.map(ctx => loader.preload(locale, `concept-${ctx}`))
    );
  }
}

/**
 * Limpia cache (para tests)
 */
export function clearCache(): void {
  clearTerminologyCache();
}

/**
 * Obtiene estadísticas del cache (debugging)
 */
export { getCacheStats } from './cache';



