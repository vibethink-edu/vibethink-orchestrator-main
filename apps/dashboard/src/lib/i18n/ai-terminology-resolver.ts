/**
 * AI Terminology Resolver
 * 
 * Contract para agentes de IA
 * Resuelve terminología según contexto
 */

import { term } from '@vibethink/utils';

/**
 * Request para resolver terminología
 */
export interface TerminologyResolutionRequest {
  /** Locale (ej: 'en', 'es') */
  locale: string;
  /** Contexto (ej: 'hotel', 'studio', 'cowork') */
  context: string | null;
  /** Tenant ID opcional */
  tenantId?: string | null;
  /** IDs de conceptos a resolver (ej: ['concept.resource.room', 'concept.unit.hour']) */
  conceptIds: string[];
}

/**
 * Response con terminología resuelta
 */
export interface TerminologyResolutionResponse {
  /** Mapa de conceptId → traducción resuelta */
  terminology: Record<string, string>;
  /** Metadata de la resolución */
  metadata: {
    locale: string;
    context: string | null;
    tenantId: string | null;
    resolvedAt: string;
  };
}

/**
 * Resuelve terminología para agentes de IA
 * 
 * @param request - Request con locale, context, conceptIds
 * @returns Response con terminología resuelta
 */
export async function resolveTerminology(
  request: TerminologyResolutionRequest
): Promise<TerminologyResolutionResponse> {
  const { locale, context, tenantId, conceptIds } = request;
  
  // Resolver cada concepto
  const terminology: Record<string, string> = {};
  
  for (const conceptId of conceptIds) {
    try {
      // Resolver con contexto
      const value = await term(conceptId, {}, locale, context || undefined);
      terminology[conceptId] = value;
    } catch (error) {
      console.error(`[terminology] Failed to resolve ${conceptId}:`, error);
      // Fallback al conceptId si falla
      terminology[conceptId] = conceptId;
    }
  }
  
  return {
    terminology,
    metadata: {
      locale,
      context,
      tenantId: tenantId || null,
      resolvedAt: new Date().toISOString(),
    },
  };
}







