import IntlMessageFormat from 'intl-messageformat';

/**
 * Cache de formatters compilados para performance
 */
const messageCache = new Map<string, IntlMessageFormat>();

/**
 * Formatea un mensaje usando ICU Message Format
 * 
 * @example
 * formatMessage('en', '{count, plural, one {# item} other {# items}}', { count: 5 })
 * // Returns: "5 items"
 * 
 * @example
 * formatMessage('es', '{context, select, hotel {Habitación} studio {Sala} other {Espacio}}', { context: 'hotel' })
 * // Returns: "Habitación"
 */
export function formatMessage(
  locale: string,
  message: string,
  values?: Record<string, any>
): string {
  const cacheKey = `${locale}::${message}`;
  
  let formatter = messageCache.get(cacheKey);
  if (!formatter) {
    try {
      formatter = new IntlMessageFormat(message, locale);
      messageCache.set(cacheKey, formatter);
    } catch (error) {
      console.error('[i18n] ICU Message Format error:', error);
      return message; // Fallback al mensaje original
    }
  }
  
  try {
    return formatter.format(values) as string;
  } catch (error) {
    console.error('[i18n] Error formatting message:', error);
    return message;
  }
}

/**
 * Detecta si un string usa sintaxis ICU
 */
export function isICUMessage(message: string): boolean {
  return /\{[^}]+,\s*(plural|select|selectordinal|number|date|time)/.test(message);
}

/**
 * Limpia el cache de mensajes (útil en tests o hot reload)
 */
export function clearMessageCache(): void {
  messageCache.clear();
}




