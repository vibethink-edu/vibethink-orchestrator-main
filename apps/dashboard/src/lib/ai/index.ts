/**
 * AI Agent Infrastructure
 *
 * Operacionalización completa de semántica para agentes de IA.
 * Garantiza respuestas context-aware y region-aware.
 *
 * @module ai
 * @version 1.0.0
 * @date 2025-12-25
 */

// Agent Context Pack - Core
export {
  getAgentContextPack,
  getAgentContextPackCached,
  clearAgentContextCache,
  type AgentContextRequest,
  type AgentContextPack
} from './agent-context-pack';

// Agent Protocol - Enforcement
export {
  executeAgent,
  formatNumber,
  formatCurrency,
  formatDate,
  getTerm,
  buildMessage,
  type AgentRequest,
  type AgentResponse,
  type AgentOptions
} from './agent-protocol';

/**
 * @example Quick Start
 *
 * ```typescript
 * import { executeAgent } from '@/lib/ai';
 *
 * // El agente AUTOMÁTICAMENTE:
 * // 1. Resuelve contexto (hotel/studio/cowork)
 * // 2. Carga terminología correcta
 * // 3. Aplica formatos regionales
 * // 4. Usa cache para performance
 *
 * const response = await executeAgent({
 *   tenantId: 'hotel-boutique-123',
 *   userId: 'user-456',
 *   route: '/dashboard-bundui/hotel/bookings',
 *   locale: 'es',
 *   userMessage: '¿Hay habitaciones disponibles?',
 *   conceptIds: ['concept.resource.room', 'concept.status.available']
 * });
 *
 * console.log(response.message);
 * // → "Actualmente tenemos 15 habitaciones disponibles"
 * //   (usa "habitaciones" porque context = hotel)
 * //   (usa formato español porque locale = es)
 * ```
 *
 * @example Advanced: Custom Formatting
 *
 * ```typescript
 * import { getAgentContextPackCached, formatCurrency } from '@/lib/ai';
 *
 * const pack = await getAgentContextPackCached({
 *   tenantId: 'hotel-123',
 *   userId: 'user-456',
 *   route: '/dashboard-bundui/hotel',
 *   locale: 'es'
 * });
 *
 * const price = formatCurrency(250000, pack);
 * console.log(price);
 * // → "$250.000,00" (formato español con separador de miles)
 * ```
 *
 * @example Custom Terms Resolution
 *
 * ```typescript
 * import { getAgentContextPackCached, getTerm } from '@/lib/ai';
 *
 * const pack = await getAgentContextPackCached({
 *   tenantId: 'studio-123',
 *   userId: 'user-456',
 *   route: '/dashboard-bundui/studio/bookings',
 *   locale: 'es',
 *   conceptIds: ['concept.resource.room', 'concept.unit.hour']
 * });
 *
 * const roomTerm = getTerm('concept.resource.room', pack);
 * const hourTerm = getTerm('concept.unit.hour', pack);
 *
 * console.log(`Reserva de ${roomTerm} por ${hourTerm}`);
 * // → "Reserva de Sala por hora" (contexto studio)
 * ```
 */
