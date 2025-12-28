import { Money, CurrencyCode } from './types';
import { formatMoney as formatMoneyNew, createMoney } from './formatters';
import { CURRENCY_CONFIG } from './types';

/**
 * WRAPPER DE COMPATIBILIDAD
 * Permite usar formatCurrencyRegional() existente pero
 * internamente usa el nuevo sistema Money
 * 
 * @deprecated Usar formatMoney() directamente con Money interface
 */
export function formatCurrencyRegional(
  amount: number,
  currencyCode?: string,
  options?: Intl.NumberFormatOptions
): string {
  // Obtener locale del RegionalConfigManager (implementar según tu sistema)
  // Por ahora, usar 'en-US' como default
  const locale = typeof window !== 'undefined' 
    ? navigator.language || 'en-US'
    : 'en-US';
  
  const currency = (currencyCode || 'USD') as CurrencyCode;
  
  // Convertir a Money
  const money = createMoneyFromDecimal(amount, currency);
  
  // Usar nuevo formatter
  return formatMoneyNew(money, locale, options);
}

/**
 * Helper para crear Money desde decimal (legacy)
 */
function createMoneyFromDecimal(amount: number, currency: CurrencyCode): Money {
  const config = CURRENCY_CONFIG[currency];
  const amountMinor = Math.round(amount * Math.pow(10, config.decimals));
  
  return { amountMinor, currency };
}

/**
 * MIGRACIÓN GRADUAL
 * Agregar logging para detectar uso de función deprecated
 */
let deprecationWarningShown = false;

export function formatCurrencyRegionalWithWarning(
  amount: number,
  currencyCode?: string,
  options?: Intl.NumberFormatOptions
): string {
  if (!deprecationWarningShown && process.env.NODE_ENV === 'development') {
    console.warn(
      '[DEPRECATION] formatCurrencyRegional() será removido. Usar formatMoney() con Money interface.'
    );
    deprecationWarningShown = true;
  }
  
  return formatCurrencyRegional(amount, currencyCode, options);
}












