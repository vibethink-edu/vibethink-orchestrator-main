/**
 * Daylight Theme Hook
 * 
 * Hook para manejar tema automático basado en hora del día
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

export const useDaylightTheme = () => {
  const [isDaylight, setIsDaylight] = useState(true);

  useEffect(() => {
    const checkDaylight = () => {
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour < 18;
      setIsDaylight(isDay);
    };

    checkDaylight();
    const interval = setInterval(checkDaylight, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const getAutoTheme = () => {
    return isDaylight ? 'light' : 'dark';
  };

  return {
    isDaylight,
    getAutoTheme
  };
}; 
