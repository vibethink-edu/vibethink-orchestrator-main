
import { useState, useEffect } from 'react';

export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyExchangeResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: ExchangeRates;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en millisegundos
const CACHE_KEY = 'currency_rates_cache';
const CACHE_TIMESTAMP_KEY = 'currency_rates_timestamp';

export const useCurrencyExchange = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Tasas de respaldo en caso de que la API falle
  const fallbackRates: ExchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    CAD: 1.25,
    AUD: 1.35,
    JPY: 110,
    CHF: 0.92,
    SEK: 8.5,
    NOK: 8.8,
    DKK: 6.3,
    COP: 4200,
  };

  const getCachedRates = () => {
    try {
      const cachedRates = localStorage.getItem(CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedRates && cacheTimestamp) {
        const timestamp = parseInt(cacheTimestamp);
        const now = Date.now();
        
        // Si el caché es válido (menos de 1 hora)
        if (now - timestamp < CACHE_DURATION) {
          return {
            rates: JSON.parse(cachedRates),
            timestamp: new Date(timestamp)
          };
        }
      }
    } catch (error) {
      console.error('Error reading cached rates:', error);
    }
    return null;
  };

  const setCachedRates = (rates: ExchangeRates) => {
    try {
      const timestamp = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());
      setLastUpdated(new Date(timestamp));
    } catch (error) {
      console.error('Error caching rates:', error);
    }
  };

  const fetchExchangeRates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Intentar usar la API gratuita de exchangerate-api.com
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data: CurrencyExchangeResponse = await response.json();
      
      if (data.success !== false && data.rates) {
        // Agregar COP si no está en la respuesta
        if (!data.rates.COP) {
          data.rates.COP = 4200; // Tasa de respaldo para COP
        }
        
        setExchangeRates(data.rates);
        setCachedRates(data.rates);
        console.log('Exchange rates updated successfully');
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching exchange rates, using fallback:', error);
      setError('Using cached/fallback rates');
      
      // Usar rates en caché o tasas de respaldo
      const cached = getCachedRates();
      if (cached) {
        setExchangeRates(cached.rates);
        setLastUpdated(cached.timestamp);
      } else {
        setExchangeRates(fallbackRates);
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Primero intentar cargar rates del caché
    const cached = getCachedRates();
    if (cached) {
      setExchangeRates(cached.rates);
      setLastUpdated(cached.timestamp);
      console.log('Loaded cached exchange rates');
    } else {
      // Si no hay caché válido, usar tasas de respaldo temporalmente
      setExchangeRates(fallbackRates);
      setLastUpdated(new Date());
    }

    // Luego intentar actualizar con datos frescos
    fetchExchangeRates();
  }, []);

  const refreshRates = () => {
    fetchExchangeRates();
  };

  const getRate = (currency: string): number => {
    return exchangeRates[currency] || fallbackRates[currency] || 1;
  };

  return {
    exchangeRates,
    loading,
    error,
    lastUpdated,
    refreshRates,
    getRate,
    isUsingFallback: Object.keys(exchangeRates).length === 0 || error !== null
  };
};
