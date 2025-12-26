/**
 * Agent Context Pack
 *
 * Operacionalización de semántica para agentes de IA.
 * Garantiza que ningún agente responda sin contexto/formatos regionales.
 *
 * @module agent-context-pack
 * @version 1.0.0
 * @date 2025-12-25
 */

import { resolveTerminology, type TerminologyResolutionRequest } from '@/lib/i18n/ai-terminology-resolver';
import { LOCALE_CONFIGS, type SupportedLocale } from '@/lib/i18n/locale-config';
import { localeMetadata } from '@/lib/i18n/config';

/**
 * Request para obtener contexto del agente
 */
export interface AgentContextRequest {
  /** ID del tenant (empresa) */
  tenantId: string;
  /** ID del usuario */
  userId: string;
  /** Ruta actual (para detectar contexto) */
  route: string;
  /** Tipo de registro (opcional, para contexto adicional) */
  recordType?: string;
  /** ID del registro (opcional) */
  recordId?: string;
  /** Locale preferido (fallback: user → company → system) */
  locale?: SupportedLocale;
  /** Timezone preferida (fallback: user → company → system) */
  timezone?: string;
  /** Lista de ConceptIDs que el agente necesita resolver */
  conceptIds?: string[];
}

/**
 * Contexto completo para el agente
 */
export interface AgentContextPack {
  /** Locale resuelto */
  locale: string;
  /** Timezone resuelto */
  timezone: string;
  /** Contexto del módulo (hotel, studio, cowork, etc.) */
  context: string | null;
  /** Términos resueltos por ConceptID */
  terms: Record<string, string>;
  /** Formatos regionales para números, monedas, fechas */
  formats: {
    /** Moneda predeterminada */
    currencyDefaults: string;
    /** Símbolo de moneda */
    currencySymbol: string;
    /** Posición del símbolo (before/after) */
    currencyPosition: 'before' | 'after';
    /** Decimales de moneda */
    currencyDecimals: number;
    /** Separador decimal */
    decimalSeparator: string;
    /** Separador de miles */
    thousandsSeparator: string;
    /** Día de inicio de semana (0=Sunday, 1=Monday) */
    weekStartsOn: number;
    /** Formato de fecha */
    dateFormat: string;
    /** Formato de hora */
    timeFormat: '12h' | '24h';
    /** Dirección de texto (ltr/rtl) */
    direction: 'ltr' | 'rtl';
  };
  /** Metadata de la resolución */
  metadata: {
    resolvedAt: string;
    tenantId: string;
    userId: string;
    route: string;
    recordType?: string;
    recordId?: string;
  };
}

/**
 * Resuelve contexto desde la ruta
 */
function resolveContextFromRoute(route: string): string | null {
  // Detectar contexto desde la ruta
  if (route.includes('/hotel')) return 'hotel';
  if (route.includes('/studio')) return 'studio';
  if (route.includes('/cowork')) return 'cowork';
  if (route.includes('/coliving')) return 'coliving';
  if (route.includes('/crm')) return 'crm';
  if (route.includes('/pos')) return 'pos';
  if (route.includes('/ecommerce')) return 'ecommerce';

  return null;
}

/**
 * Resuelve contexto desde el tipo de registro (opcional)
 */
function resolveContextFromRecord(recordType?: string, recordId?: string): string | null {
  if (!recordType) return null;

  // Mapear tipos de registro a contextos
  const recordContextMap: Record<string, string> = {
    'room': 'hotel',
    'suite': 'hotel',
    'studio': 'studio',
    'workspace': 'cowork',
    'desk': 'cowork',
    'apartment': 'coliving',
  };

  return recordContextMap[recordType.toLowerCase()] || null;
}

/**
 * Obtiene tenant overrides de terminología
 *
 * @stub Por ahora devuelve vacío, listo para implementación futura
 */
async function getTenantTerminologyOverrides(
  tenantId: string,
  locale: string,
  context: string | null
): Promise<Record<string, string>> {
  // TODO: Implementar carga desde DB cuando esté disponible
  // Por ahora, retorna objeto vacío (sin overrides)
  return {};
}

/**
 * Obtiene el contexto completo para un agente de IA
 *
 * @param request - Parámetros de la request
 * @returns Contexto completo con términos, formatos y metadata
 *
 * @example
 * ```typescript
 * const pack = await getAgentContextPack({
 *   tenantId: 'hotel-boutique-123',
 *   userId: 'user-456',
 *   route: '/dashboard-bundui/hotel/bookings',
 *   locale: 'es',
 *   conceptIds: ['concept.resource.room', 'concept.unit.night']
 * });
 *
 * // Agente usa pack para responder:
 * const response = `Tenemos 5 ${pack.terms['concept.resource.room']} disponibles`;
 * // → "Tenemos 5 habitaciones disponibles"
 * ```
 */
export async function getAgentContextPack(
  request: AgentContextRequest
): Promise<AgentContextPack> {
  const {
    tenantId,
    userId,
    route,
    recordType,
    recordId,
    locale: requestLocale,
    timezone: requestTimezone,
    conceptIds = []
  } = request;

  // 1. Resolver locale (fallback: request → user → company → system default 'en')
  const locale = (requestLocale || 'en') as SupportedLocale;

  // 2. Resolver contexto
  const routeContext = resolveContextFromRoute(route);
  const recordContext = resolveContextFromRecord(recordType, recordId);
  const context = recordContext || routeContext;

  // 3. Obtener configuración regional
  const localeConfig = LOCALE_CONFIGS[locale];
  const localeInfo = localeMetadata[locale];

  if (!localeConfig) {
    throw new Error(`Locale ${locale} not supported. Available: ${Object.keys(LOCALE_CONFIGS).join(', ')}`);
  }

  // 4. Resolver timezone (fallback: request → locale config)
  const timezone = requestTimezone || 'UTC';

  // 5. Resolver terminología
  let terms: Record<string, string> = {};

  if (conceptIds.length > 0) {
    const terminologyRequest: TerminologyResolutionRequest = {
      locale,
      context,
      tenantId,
      conceptIds
    };

    const terminologyResponse = await resolveTerminology(terminologyRequest);
    terms = terminologyResponse.terminology;

    // 6. Aplicar tenant overrides
    const overrides = await getTenantTerminologyOverrides(tenantId, locale, context);
    terms = { ...terms, ...overrides };
  }

  // 7. Construir formatos
  const formats = {
    currencyDefaults: localeConfig.currency.code,
    currencySymbol: localeConfig.currency.symbol,
    currencyPosition: localeConfig.currency.position,
    currencyDecimals: localeConfig.currency.decimals,
    decimalSeparator: localeConfig.numbers.decimalSeparator,
    thousandsSeparator: localeConfig.numbers.thousandsSeparator,
    weekStartsOn: localeInfo.firstDayOfWeek || 0,
    dateFormat: localeConfig.dateFormat,
    timeFormat: localeConfig.timeFormat,
    direction: localeConfig.direction
  };

  // 8. Construir metadata
  const metadata = {
    resolvedAt: new Date().toISOString(),
    tenantId,
    userId,
    route,
    recordType,
    recordId
  };

  return {
    locale,
    timezone,
    context,
    terms,
    formats,
    metadata
  };
}

/**
 * Cache en memoria para contextos de agentes
 * TTL: 5 minutos
 */
class AgentContextCache {
  private cache = new Map<string, { data: AgentContextPack; expiresAt: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Genera clave de cache
   */
  private getCacheKey(request: AgentContextRequest): string {
    const { tenantId, locale, route, recordType } = request;
    return `${tenantId}:${locale}:${route}:${recordType || 'none'}`;
  }

  /**
   * Obtiene del cache si existe y no expiró
   */
  get(request: AgentContextRequest): AgentContextPack | null {
    const key = this.getCacheKey(request);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar expiración
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Guarda en cache
   */
  set(request: AgentContextRequest, data: AgentContextPack): void {
    const key = this.getCacheKey(request);
    const expiresAt = Date.now() + this.TTL;

    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Limpia cache expirado (llamar periódicamente)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancia global de cache
const contextCache = new AgentContextCache();

/**
 * Obtiene contexto con cache
 */
export async function getAgentContextPackCached(
  request: AgentContextRequest
): Promise<AgentContextPack> {
  // Intentar obtener del cache
  const cached = contextCache.get(request);
  if (cached) {
    return cached;
  }

  // Si no está en cache, resolver
  const pack = await getAgentContextPack(request);

  // Guardar en cache
  contextCache.set(request, pack);

  return pack;
}

/**
 * Limpia el cache (útil para tests o invalidaciones manuales)
 */
export function clearAgentContextCache(): void {
  contextCache.cleanup();
}

// Limpieza automática cada 10 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    contextCache.cleanup();
  }, 10 * 60 * 1000);
}
