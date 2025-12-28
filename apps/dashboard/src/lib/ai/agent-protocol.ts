/**
 * Agent Protocol - Enforcement Layer
 *
 * Garantiza que ningún agente responda sin:
 * 1. Contexto resuelto
 * 2. Terminología correcta
 * 3. Formatos regionales aplicados
 *
 * @module agent-protocol
 * @version 1.0.0
 * @date 2025-12-25
 */

import {
  getAgentContextPackCached,
  type AgentContextRequest,
  type AgentContextPack
} from './agent-context-pack';

/**
 * Opciones para el agente
 */
export interface AgentOptions {
  /** Modelo del agente (optional) */
  model?: 'gpt-4' | 'claude-3' | 'gemini-pro';
  /** Temperatura (0-1) */
  temperature?: number;
  /** Máximo de tokens */
  maxTokens?: number;
  /** Instrucciones del sistema adicionales */
  systemInstructions?: string;
}

/**
 * Request del agente
 */
export interface AgentRequest extends AgentContextRequest {
  /** Mensaje del usuario */
  userMessage: string;
  /** Historial de conversación (opcional) */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** Opciones del agente */
  options?: AgentOptions;
}

/**
 * Response del agente
 */
export interface AgentResponse {
  /** Mensaje generado por el agente */
  message: string;
  /** Contexto usado para generar la respuesta */
  contextPack: AgentContextPack;
  /** Metadata de la generación */
  metadata: {
    generatedAt: string;
    model?: string;
    tokensUsed?: number;
  };
}

/**
 * Construye el system prompt con contexto y formatos
 */
function buildSystemPrompt(
  pack: AgentContextPack,
  additionalInstructions?: string
): string {
  const { locale, context, terms, formats } = pack;

  // Base del system prompt
  let prompt = `You are a helpful AI assistant for a ${context || 'business'} management system.

## Context:
- Business Type: ${context || 'generic'}
- Language: ${locale}
- Text Direction: ${formats.direction}

## Terminology (use these exact terms):
${Object.entries(terms)
  .map(([conceptId, term]) => `- ${conceptId}: "${term}"`)
  .join('\n')}

## Regional Formats (ALWAYS use these):

### Currency:
- Currency: ${formats.currencyDefaults} (${formats.currencySymbol})
- Symbol Position: ${formats.currencyPosition}
- Decimals: ${formats.currencyDecimals}
- Decimal Separator: "${formats.decimalSeparator}"
- Thousands Separator: "${formats.thousandsSeparator}"
- Example: ${
    formats.currencyPosition === 'before'
      ? `${formats.currencySymbol}1${formats.thousandsSeparator}234${formats.decimalSeparator}56`
      : `1${formats.thousandsSeparator}234${formats.decimalSeparator}56 ${formats.currencySymbol}`
  }

### Dates & Time:
- Date Format: ${formats.dateFormat}
- Time Format: ${formats.timeFormat}
- Week Starts On: ${formats.weekStartsOn === 0 ? 'Sunday' : 'Monday'}

## Rules:
1. ALWAYS use the terminology from the list above
2. NEVER invent your own terms for concepts that have defined terminology
3. ALWAYS format numbers, currency, and dates according to regional formats
4. If you need a term that is not in the list, ask the user for clarification
5. Respond ONLY in language: ${locale}
6. Respect text direction: ${formats.direction}
`;

  // Agregar instrucciones adicionales si existen
  if (additionalInstructions) {
    prompt += `\n## Additional Instructions:\n${additionalInstructions}\n`;
  }

  return prompt;
}

/**
 * Formatea un número según el contexto regional
 */
export function formatNumber(value: number, pack: AgentContextPack): string {
  const { formats } = pack;
  const parts = value.toFixed(formats.currencyDecimals).split('.');

  // Formatear parte entera con separador de miles
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, formats.thousandsSeparator);

  // Agregar parte decimal si existe
  const decimalPart = parts[1];

  if (decimalPart && parseInt(decimalPart) > 0) {
    return `${integerPart}${formats.decimalSeparator}${decimalPart}`;
  }

  return integerPart;
}

/**
 * Formatea moneda según el contexto regional
 */
export function formatCurrency(value: number, pack: AgentContextPack): string {
  const { formats } = pack;
  const formattedNumber = formatNumber(value, pack);

  if (formats.currencyPosition === 'before') {
    return `${formats.currencySymbol}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${formats.currencySymbol}`;
  }
}

/**
 * Formatea fecha según el contexto regional
 */
export function formatDate(date: Date, pack: AgentContextPack): string {
  const { formats, locale } = pack;

  // Usar Intl.DateTimeFormat con el formato regional
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return formatter.format(date);
}

/**
 * Valida que la respuesta del agente cumpla con el protocolo
 */
function validateAgentResponse(
  response: string,
  pack: AgentContextPack
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar que no use términos prohibidos cuando hay terminología definida
  // (esto es más una validación de ejemplo, en producción sería más sofisticada)

  // TODO: Implementar validaciones más robustas
  // - Verificar que use los términos del contexto
  // - Verificar formato de números/monedas
  // - Verificar idioma

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Ejecuta el agente con enforcement completo
 *
 * @param request - Request con mensaje del usuario y contexto
 * @returns Response con el mensaje generado y contexto usado
 *
 * @throws Error si falta contexto requerido
 *
 * @example
 * ```typescript
 * const response = await executeAgent({
 *   tenantId: 'hotel-123',
 *   userId: 'user-456',
 *   route: '/dashboard-bundui/hotel/bookings',
 *   userMessage: '¿Cuántas habitaciones disponibles tenemos?',
 *   locale: 'es',
 *   conceptIds: ['concept.resource.room', 'concept.status.available']
 * });
 *
 * console.log(response.message);
 * // → "Actualmente tenemos 15 habitaciones disponibles"
 * // (usando términos correctos del contexto)
 * ```
 */
export async function executeAgent(
  request: AgentRequest
): Promise<AgentResponse> {
  const {
    userMessage,
    history = [],
    options = {},
    ...contextRequest
  } = request;

  // 1. ENFORCEMENT: Obtener contexto (obligatorio)
  const contextPack = await getAgentContextPackCached(contextRequest);

  if (!contextPack) {
    throw new Error('Failed to resolve agent context. Cannot proceed without context.');
  }

  // 2. Construir system prompt con contexto
  const systemPrompt = buildSystemPrompt(contextPack, options.systemInstructions);

  // 3. TODO: Llamar al modelo de IA real
  // Por ahora, simulamos una respuesta que usa el contexto
  const simulatedResponse = await simulateAgentResponse(
    systemPrompt,
    userMessage,
    history,
    contextPack
  );

  // 4. Validar respuesta
  const validation = validateAgentResponse(simulatedResponse, contextPack);

  if (!validation.valid) {
    console.warn('[Agent Protocol] Response validation warnings:', validation.errors);
    // En producción, podrías regenerar o ajustar la respuesta
  }

  // 5. Construir response
  return {
    message: simulatedResponse,
    contextPack,
    metadata: {
      generatedAt: new Date().toISOString(),
      model: options.model,
      tokensUsed: undefined // TODO: obtener del modelo real
    }
  };
}

/**
 * Simulación de respuesta del agente (mock para desarrollo)
 *
 * @stub Esta función será reemplazada por integración real con modelos de IA
 */
async function simulateAgentResponse(
  systemPrompt: string,
  userMessage: string,
  history: Array<{ role: string; content: string }>,
  pack: AgentContextPack
): Promise<string> {
  // Simulación básica que usa el contexto
  const { terms, context } = pack;

  // Ejemplo de respuesta que usa terminología correcta
  if (userMessage.toLowerCase().includes('disponible')) {
    const roomTerm = terms['concept.resource.room'] || 'rooms';
    return `Actualmente tenemos 15 ${roomTerm} disponibles en nuestro ${context}.`;
  }

  if (userMessage.toLowerCase().includes('precio') || userMessage.toLowerCase().includes('cost')) {
    const price = formatCurrency(12500, pack);
    return `El precio es de ${price} por noche.`;
  }

  // Fallback genérico
  return `Entiendo tu pregunta sobre "${userMessage}". Como asistente de ${context}, estoy aquí para ayudarte.`;
}

/**
 * Helper: Obtiene un término del contexto con fallback
 */
export function getTerm(
  conceptId: string,
  pack: AgentContextPack,
  fallback?: string
): string {
  return pack.terms[conceptId] || fallback || conceptId;
}

/**
 * Helper: Construye un mensaje usando términos del contexto
 */
export function buildMessage(
  template: string,
  values: Record<string, any>,
  pack: AgentContextPack
): string {
  let message = template;

  // Reemplazar términos
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{{${key}}}`;

    let replacement: string;

    if (key.startsWith('concept.')) {
      // Es un ConceptID, resolverlo
      replacement = getTerm(key, pack, value?.toString());
    } else if (typeof value === 'number') {
      // Es un número, formatearlo
      replacement = formatNumber(value, pack);
    } else {
      // Valor directo
      replacement = value?.toString() || '';
    }

    message = message.replace(placeholder, replacement);
  }

  return message;
}
