/**
 * Representa dinero usando minor units (centavos, centimos, etc.)
 * para evitar errores de punto flotante
 * 
 * @example
 * const price: Money = { amountMinor: 250000, currency: 'COP' };
 * // Representa $250,000 COP (sin centavos)
 * 
 * @example
 * const price: Money = { amountMinor: 9999, currency: 'USD' };
 * // Representa $99.99 USD
 */
export interface Money {
  /**
   * Monto en minor units (centavos, centimos, etc.)
   * SIEMPRE almacenar como entero para evitar errores de float
   */
  amountMinor: number;
  
  /**
   * Código de moneda ISO 4217
   * @example 'USD', 'EUR', 'COP', 'JPY', 'AED'
   */
  currency: CurrencyCode;
}

export type CurrencyCode = keyof typeof CURRENCY_CONFIG;

/**
 * Configuración de monedas soportadas
 */
export const CURRENCY_CONFIG = {
  USD: {
    decimals: 2,
    symbol: '$',
    symbolPosition: 'prefix' as const,
    name: 'US Dollar',
  },
  EUR: {
    decimals: 2,
    symbol: '€',
    symbolPosition: 'suffix' as const,
    name: 'Euro',
  },
  GBP: {
    decimals: 2,
    symbol: '£',
    symbolPosition: 'prefix' as const,
    name: 'British Pound',
  },
  COP: {
    decimals: 0, // Pesos colombianos no usan centavos en práctica
    symbol: '$',
    symbolPosition: 'prefix' as const,
    name: 'Colombian Peso',
  },
  MXN: {
    decimals: 2,
    symbol: '$',
    symbolPosition: 'prefix' as const,
    name: 'Mexican Peso',
  },
  JPY: {
    decimals: 0, // Yen japonés no tiene subdivisión
    symbol: '¥',
    symbolPosition: 'prefix' as const,
    name: 'Japanese Yen',
  },
  AED: {
    decimals: 2,
    symbol: 'د.إ',
    symbolPosition: 'suffix' as const,
    name: 'UAE Dirham',
  },
} as const;











