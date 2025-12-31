/**

 * CAPA 2: Terminology Engine (Motor de Resolución de Terminología)
 * 
 * Este módulo implementa el motor central que resuelve Concept IDs (CAPA 1)
 * a labels reales con soporte para:
 * - Overrides por producto (hotel, studio, cowork, coliving)
 * - Contexto de dominio (booking, crm, etc.)
 * - Multi-tenant (overrides en memoria)
 * - Cache en memoria para performance
 * 
 * @package @vibethink/utils
 */

import {
  ConceptID,
  ConceptValue,
  ConceptObject,
  TerminologyContext,
  TerminologySnapshot,
  ConceptNamespace,
  getNamespaceForProduct,
  isProductNamespace,
  isValidTerminologyContext,
} from './types';

import {
  getTranslationLoader
} from '../translation-loader-registry';

import {
  getFromCache,
  setInCache,
  clearTerminologyCache,
  clearTerminologyCacheFor,
  getCacheStats,
  buildCacheKey,
} from './cache';

/**
 * Fallback a inglés si un concepto no existe en el idioma objetivo
 * 
 * Prioridad de fallback:
 * 1. Idioma objetivo (ej: es)
 * 2. Inglés (en) - fallback universal
 * 3. Concept ID (último recurso)
 */
async function resolveWithFallback(
  conceptId: ConceptID,
  locale: string,
  context: TerminologyContext
): Promise<string> {
  const loader = getTranslationLoader();

  // Determinar namespaces a buscar
  const namespaces: string[] = [];

  // Si hay productContext, buscar primero en concept-{product}.json
  if (context.productContext) {
    namespaces.push(getNamespaceForProduct(context.productContext));
  }

  // Siempre buscar en concept.json como fallback
  namespaces.push('concept');

  // Intentar idioma objetivo
  for (const namespace of namespaces) {
    try {
      const value = await loader.loadSync(locale, namespace);
      if (value && value[conceptId]) {
        return typeof value[conceptId] === 'string'
          ? value[conceptId]
          : value[conceptId].label || conceptId;
      }
    } catch (error) {
      console.debug(`[Terminology] Failed to load ${locale}/${namespace}:`, error);
    }
  }

  // Fallback a inglés
  for (const namespace of namespaces) {
    try {
      const value = await loader.loadSync('en', namespace);
      if (value && value[conceptId]) {
        return typeof value[conceptId] === 'string'
          ? value[conceptId]
          : value[conceptId].label || conceptId;
      }
    } catch (error) {
      console.debug(`[Terminology] Failed to load en/${namespace}:`, error);
    }
  }

  // Último recurso: retornar el Concept ID
  return conceptId;
}

/**
 * Aplica overrides de producto y contexto a un valor base
 * 
 * Orden de precedencia de overrides:
 * 1. base (concept.json)
 * 2. productContext (concept-hotel.json, concept-studio.json)
 * 3. domainContext (futuro: concept-booking.json)
 * 4. tenantId (overrides en memoria, futura BD)
 * 
 * @param baseValue - El valor desde el archivo base
 * @param context - El contexto de terminology
 * @returns El valor final con overrides aplicados
 */
function applyOverrides(
  baseValue: ConceptValue,
  context: TerminologyContext
): ConceptValue {
  // Si no hay contexto de producto, retornar valor base
  if (!context.productContext) {
    return baseValue;
  }

  // Si el valor base ya está enriched, retornarlo
  if (typeof baseValue !== 'string') {
    return baseValue;
  }

  // Para shorthand (strings), no hay overrides en esta fase
  // Los overrides se manejan a nivel de archivos JSON
  return baseValue;
}

/**
 * Resuelve un Concept ID a su valor real (string)
 * 
 * Esta es la función PRINCIPAL usada por UI Components.
 * 
 * @param conceptId - El Concept ID (ej: concept.booking.resource.room)
 * @param context - Contexto de terminología (locale, producto, etc.)
 * @returns Promise<string> - El label resuelto en el idioma y contexto
 * 
 * @example
 * ```typescript
 * // Resolución básica
 * const label = await term('concept.booking.resource.room', {
 *   locale: 'es',
 *   productContext: 'hotel'
 * });
 * // → "Habitación"
 * 
 * // Con fallback automático a inglés
 * const label = await term('concept.booking.resource.room', {
 *   locale: 'fr', // Si no existe en francés
 *   productContext: 'hotel'
 * });
 * // → "Room" (inglés como fallback)
 * ```
 */
export async function term(
  conceptId: ConceptID,
  context: TerminologyContext = {}
): Promise<string> {
  // Validar contexto
  if (!isValidTerminologyContext(context)) {
    console.warn(`[Terminology] Invalid context:`, context);
    context = { ...context, locale: context.locale || 'en' };
  }

  const locale = context.locale || 'en';
  const cacheKey = buildCacheKey(conceptId, locale, context);

  // Verificar cache
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Resolver con fallback
  const value = await resolveWithFallback(conceptId, locale, context);

  // Guardar en cache
  setInCache(cacheKey, value);

  return value;
}

/**
 * Resuelve un Concept ID de forma SÍNCRONA (para UI Components)
 * 
 * ⚠️ REQUISITO: El concepto DEBE estar precargado antes de llamar esta función.
 * 
 * Esta función NO hace I/O de archivos JSON.
 * Solo lee del cache en memoria.
 * 
 * @param conceptId - El Concept ID (ej: concept.booking.resource.room)
 * @param context - Contexto de terminología
 * @returns string - El label resuelto
 * 
 * @throws Si el concepto no está en cache
 * 
 * @example
 * ```typescript
 * // En un Server Component o con preload previo:
 * const label = termSync('concept.booking.resource.room', {
 *   locale: 'es',
 *   productContext: 'hotel'
 * });
 * // → "Habitación"
 * 
 * // ❌ SIN preload (lanzará error):
 * const label = termSync('concept.booking.resource.unknown', { locale: 'es' });
 * // → [Terminology] termSync() called without preload for: concept.booking.resource.unknown
 * ```
 */
export function termSync(
  conceptId: ConceptID,
  context: TerminologyContext = {}
): string {
  // Validar contexto
  if (!isValidTerminologyContext(context)) {
    console.warn(`[Terminology] Invalid context:`, context);
    context = { ...context, locale: context.locale || 'en' };
  }

  const locale = context.locale || 'en';
  const cacheKey = buildCacheKey(conceptId, locale, context);

  // Verificar cache
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  // ⚠️ ERROR: No está en cache
  console.error(
    `[Terminology] termSync() called without preload for: ${conceptId}. ` +
    `Use term() async or preload first.`
  );
  console.error(
    `Cache key: ${cacheKey}`,
    `Context:`, context,
    `Cache stats:`, getCacheStats()
  );

  // Fallback: retornar el Concept ID (nunca null/undefined)
  return conceptId;
}

/**
 * Crea un snapshot de conceptos para Client Hydration
 * 
 * Esta función se usa en Server Components para crear un snapshot
 * que se pasa a los Client Components vía Provider.
 * 
 * Esto evita:
 * - Bundle bloat (no enviar 2MB de JSONs al cliente)
 * - Hydration mismatch (server y cliente tienen misma data)
 * 
 * @param conceptIds - Array de Concept IDs a resolver
 * @param context - Contexto de terminología
 * @returns Promise<TerminologySnapshot> - Snapshot con todos los conceptos resueltos
 * 
 * @example
 * ```typescript
 * // En un Server Component:
 * const snapshot = await getSnapshot(
 *   [
 *     'concept.booking.resource.room',
 *     'concept.booking.action.reserve'
 *   ],
 *   {
 *     locale: 'es',
 *     productContext: 'hotel'
 *   }
 * );
 * 
 * // Pasar a Provider:
 * <TerminologyProvider snapshot={snapshot}>
 *   <ClientComponent />
 * </TerminologyProvider>
 * 
 * // En Client Component:
 * const roomLabel = useTerm('concept.booking.resource.room');
 * const reserveLabel = useTerm('concept.booking.action.reserve');
 * ```
 */
export async function getSnapshot(
  conceptIds: ConceptID[],
  context: TerminologyContext = {}
): Promise<TerminologySnapshot> {
  // Validar contexto
  if (!isValidTerminologyContext(context)) {
    console.warn(`[Terminology] Invalid context:`, context);
    context = { ...context, locale: context.locale || 'en' };
  }

  const locale = context.locale || 'en';

  // Resolver todos los conceptos
  const concepts: Record<ConceptID, ConceptValue> = {};

  for (const conceptId of conceptIds) {
    // Verificar cache primero
    const cacheKey = buildCacheKey(conceptId, locale, context);
    const cached = getFromCache(cacheKey);

    if (cached) {
      concepts[conceptId] = cached;
      continue;
    }

    // Si no está en cache, resolver desde loader
    const value = await resolveWithFallback(conceptId, locale, context);
    concepts[conceptId] = value;
    setInCache(cacheKey, value);
  }

  // Crear snapshot
  const snapshot: TerminologySnapshot = {
    concepts,
    locale,
    context: {
      productContext: context.productContext,
      domainContext: context.domainContext,
      tenantId: context.tenantId,
    },
    createdAt: new Date().toISOString(),
  };

  console.log(`[Terminology] Snapshot created with ${conceptIds.length} concepts`);

  return snapshot;
}

/**
 * Precarga conceptos para un contexto específico
 * 
 * Esta función se usa en layout bootstrap o en route layouts
 * para precargar conceptos que se usarán en el subtree.
 * 
 * @param context - Contexto de terminología
 * @param conceptIds - Array de Concept IDs a precargar
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * // En layout.tsx bootstrap:
 * await preloadTerminology(
 *   { locale: 'es', productContext: 'hotel' },
 *   [
 *     'concept.booking.resource.room',
 *     'concept.booking.action.reserve'
 *   ]
 * );
 * 
 * // Luego en Client Components:
 * const label = termSync('concept.booking.resource.room', { locale: 'es', productContext: 'hotel' });
 * // ✅ Funciona porque fue precargado
 * ```
 */
export async function preloadTerminology(
  context: TerminologyContext,
  conceptIds: ConceptID[]
): Promise<void> {
  console.log(`[Terminology] Preloading ${conceptIds.length} concepts...`);

  // Validar contexto
  if (!isValidTerminologyContext(context)) {
    console.warn(`[Terminology] Invalid context:`, context);
    context = { ...context, locale: context.locale || 'en' };
  }

  const locale = context.locale || 'en';
  const loader = getTranslationLoader();

  // Cargar namespace base (siempre)
  try {
    await loader.preload(locale, 'concept');
    console.log(`[Terminology] Preloaded base namespace: concept`);
  } catch (error) {
    console.warn(`[Terminology] Failed to preload base namespace concept:`, error);
  }

  // Cargar namespace de producto si existe
  if (context.productContext) {
    const productNamespace = getNamespaceForProduct(context.productContext);
    try {
      await loader.preload(locale, productNamespace);
      console.log(`[Terminology] Preloaded product namespace: ${productNamespace}`);
    } catch (error) {
      console.warn(`[Terminology] Failed to preload product namespace ${productNamespace}:`, error);
    }
  }

  // Resolver conceptos para calentar cache
  await getSnapshot(conceptIds, context);

  console.log(`[Terminology] Preload complete. Cache stats:`, getCacheStats());
}

/**
 * Obtiene el concepto enriquecido completo (con metadata)
 * 
 * Útil para AI agents que necesitan synonyms, description, etc.
 * 
 * @param conceptId - El Concept ID
 * @param context - Contexto de terminología
 * @returns Promise<ConceptObject | null> - Concepto completo o null si no existe
 * 
 * @example
 * ```typescript
 * // En un AI agent:
 * const concept = await getConcept('concept.crm.entity.deal', {
 *   locale: 'es',
 *   productContext: 'crm'
 * });
 * 
 * if (concept) {
 *   console.log(concept.label);      // "Oportunidad"
 *   console.log(concept.plural);     // "Oportunidades"
 *   console.log(concept.synonyms);  // ["Deal", "Negocio", "Trato"]
 *   console.log(concept.description); // "Venta potencial en curso..."
 * }
 * ```
 */
export async function getConcept(
  conceptId: ConceptID,
  context: TerminologyContext = {}
): Promise<ConceptObject | null> {
  // Validar contexto
  if (!isValidTerminologyContext(context)) {
    console.warn(`[Terminology] Invalid context:`, context);
    context = { ...context, locale: context.locale || 'en' };
  }

  const locale = context.locale || 'en';
  const loader = getTranslationLoader();
  const cacheKey = buildCacheKey(conceptId, locale, context);

  // Verificar cache
  const cached = getFromCache(cacheKey);
  if (cached && typeof cached === 'object') {
    return cached as ConceptObject;
  }

  // Determinar namespaces a buscar
  const namespaces: string[] = [];

  // Si hay productContext, buscar primero en concept-{product}.json
  if (context.productContext) {
    namespaces.push(getNamespaceForProduct(context.productContext));
  }

  // Siempre buscar en concept.json como fallback
  namespaces.push('concept');

  // Resolver desde loader
  for (const namespace of namespaces) {
    try {
      const value = await loader.loadSync(locale, namespace);

      if (!value || !value[conceptId]) {
        continue;
      }

      const conceptValue = value[conceptId];

      // Si es un string simple, no tiene metadata
      if (typeof conceptValue === 'string') {
        return {
          label: conceptValue,
        };
      }

      // Si es un objeto enriquecido
      return conceptValue as ConceptObject;
    } catch (error) {
      console.debug(`[Terminology] Failed to load concept ${conceptId} from ${namespace}:`, error);
    }
  }

  // No encontrado en ningún namespace
  return null;
}

// buildCacheKey is imported from './cache' - no need to redefine it here

/**
 * Re-exportar cache utilities para conveniencia
 */
export {
  clearTerminologyCache,
  getCacheStats,
} from './cache';
