
import { useState, useEffect } from 'react';
import { useCurrencyExchange } from './useCurrencyExchange';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate?: number; // Ahora opcional, se obtiene de la API
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
];

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const { getRate, loading, error, lastUpdated, refreshRates, isUsingFallback } = useCurrencyExchange();

  const formatPrice = (usdPrice: number, showCode: boolean = true) => {
    const rate = getRate(selectedCurrency.code);
    const convertedPrice = usdPrice * rate;
    
    // Configurar formato según la moneda
    const formatOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: ['JPY', 'COP'].includes(selectedCurrency.code) ? 0 : 2,
      maximumFractionDigits: ['JPY', 'COP'].includes(selectedCurrency.code) ? 0 : 2,
    };

    // Usar locale específico para algunas monedas
    let locale = 'en-US';
    if (selectedCurrency.code === 'EUR') locale = 'de-DE';
    if (selectedCurrency.code === 'COP') locale = 'es-CO';
    
    const formattedPrice = new Intl.NumberFormat(locale, formatOptions).format(convertedPrice);
    
    return showCode 
      ? `${selectedCurrency.symbol}${formattedPrice} ${selectedCurrency.code}`
      : `${selectedCurrency.symbol}${formattedPrice}`;
  };

  const changeCurrency = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      localStorage.setItem('preferred-currency', currencyCode);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('preferred-currency');
    if (saved) {
      const currency = currencies.find(c => c.code === saved);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  return {
    selectedCurrency,
    currencies,
    formatPrice,
    changeCurrency,
    exchangeLoading: loading,
    exchangeError: error,
    lastUpdated,
    refreshRates,
    isUsingFallback,
  };
};
