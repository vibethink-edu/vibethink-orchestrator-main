import { Money, CURRENCY_CONFIG, CurrencyCode } from './types';

/**
 * Formatea dinero según locale y configuración de moneda
 * 
 * @example
 * formatMoney({ amountMinor: 250000, currency: 'COP' }, 'es-CO')
 * // Returns: "$250.000"
 * 
 * @example
 * formatMoney({ amountMinor: 9999, currency: 'USD' }, 'en-US')
 * // Returns: "$99.99"
 */
export function formatMoney(
  money: Money,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  const config = CURRENCY_CONFIG[money.currency];
  
  // Convertir de minor units a major units
  const amount = money.amountMinor / Math.pow(10, config.decimals);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
    ...options,
  }).format(amount);
}

/**
 * Crea un objeto Money desde un monto decimal
 * 
 * @example
 * createMoney(99.99, 'USD')
 * // Returns: { amountMinor: 9999, currency: 'USD' }
 */
export function createMoney(amount: number, currency: CurrencyCode): Money {
  const config = CURRENCY_CONFIG[currency];
  const amountMinor = Math.round(amount * Math.pow(10, config.decimals));
  
  return { amountMinor, currency };
}

/**
 * Convierte Money a número decimal (para cálculos cuidadosos)
 */
export function moneyToDecimal(money: Money): number {
  const config = CURRENCY_CONFIG[money.currency];
  return money.amountMinor / Math.pow(10, config.decimals);
}

/**
 * Suma dos cantidades de dinero (deben ser misma moneda)
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add different currencies: ${a.currency} and ${b.currency}`);
  }
  
  return {
    amountMinor: a.amountMinor + b.amountMinor,
    currency: a.currency,
  };
}

/**
 * Multiplica dinero por un factor
 */
export function multiplyMoney(money: Money, factor: number): Money {
  return {
    amountMinor: Math.round(money.amountMinor * factor),
    currency: money.currency,
  };
}


