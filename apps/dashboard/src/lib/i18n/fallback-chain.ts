/**
 * Fallback Chain Builder
 *
 * Builds explicit fallback chain for i18n resolution:
 * module → subvertical → vertical → universal
 *
 * Based on expert feedback: separate fallback chain from overlays.
 */

import { TenantContext } from './ai/classifier';

export interface FallbackChainOptions {
  locale: string;
  context: TenantContext;
}

/**
 * Build fallback chain for tenant context
 *
 * Example for hospitality/restaurant with POS module:
 * 1. workspace/pos (most specific)
 * 2. concept/hospitality/restaurant
 * 3. concept/hospitality
 * 4. transversal/common (least specific)
 */
export function buildFallbackChain(options: FallbackChainOptions): string[] {
  const { context } = options;
  const chain: string[] = [];

  // 1. Module-specific (most specific)
  if (context.modules) {
    for (const module of context.modules) {
      chain.push(`workspace/${module}`);
    }
  }

  // 2. Sub-vertical
  if (context.subvertical && context.vertical) {
    chain.push(`concept/${context.vertical}/${context.subvertical}`);
  }

  // 3. Vertical
  if (context.vertical) {
    chain.push(`concept/${context.vertical}`);
  }

  // 4. Universal (least specific)
  chain.push('transversal/tasks');
  chain.push('transversal/calendar');
  chain.push('transversal/common');

  return chain;
}

/**
 * Resolve translation key using fallback chain
 *
 * @param key - Translation key (e.g., "booking.resource.table")
 * @param options - Fallback options
 * @param translations - All loaded translations
 * @returns Resolved translation or key if not found
 */
export function resolveTranslation(
  key: string,
  options: FallbackChainOptions,
  translations: Record<string, any>
): string {
  const chain = buildFallbackChain(options);

  for (const namespace of chain) {
    const value = getNestedValue(translations[namespace], key);
    if (value !== undefined) {
      return value;
    }
  }

  // Fallback to key if not found
  return key;
}

/**
 * Get nested value from object using dot notation
 * e.g., "booking.resource.table" → translations.booking.resource.table
 */
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj) return undefined;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Get all possible keys from fallback chain
 * Useful for debugging and introspection
 */
export function getAllKeys(
  options: FallbackChainOptions,
  translations: Record<string, any>
): string[] {
  const chain = buildFallbackChain(options);
  const allKeys: Set<string> = new Set();

  for (const namespace of chain) {
    const namespaceData = translations[namespace];
    if (namespaceData) {
      const keys = flattenKeys(namespaceData);
      keys.forEach(k => allKeys.add(k));
    }
  }

  return Array.from(allKeys).sort();
}

function flattenKeys(obj: any, prefix: string = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key === '_metadata') continue;

    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, newKey));
    } else if (typeof value === 'string') {
      keys.push(newKey);
    }
  }

  return keys;
}

/**
 * Validate fallback chain integrity
 * Ensures all namespaces in chain exist
 */
export function validateFallbackChain(
  options: FallbackChainOptions,
  translations: Record<string, any>
): { valid: boolean; missing: string[] } {
  const chain = buildFallbackChain(options);
  const missing: string[] = [];

  for (const namespace of chain) {
    if (!translations[namespace]) {
      missing.push(namespace);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
