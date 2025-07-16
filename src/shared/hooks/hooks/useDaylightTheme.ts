/**
 * Daylight Theme Hook
 * 
 * Maneja el cambio automático de tema según la hora del día
 * Cuando el usuario selecciona "sistema", cambia automáticamente:
 * - Claro: 7:00 - 19:00
 * - Oscuro: 19:00 - 7:00
 * 
 * @author AI Pair Platform - UI Team
 * @version 1.0.0
 */

import { useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'

interface UseDaylightThemeReturn {
  isDaylight: boolean
  timeUntilChange: number // minutos hasta el próximo cambio
  forceDaylightUpdate: () => void
}

export function useDaylightTheme(): UseDaylightThemeReturn {
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Determinar si es hora de día (7:00 - 19:00)
  const isDaylight = useCallback(() => {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 7 && hour < 19
  }, [])

  // Calcular minutos hasta el próximo cambio
  const getTimeUntilChange = useCallback(() => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    if (isDaylight()) {
      // Cambiar a oscuro a las 19:00
      const changeTime = new Date(now)
      changeTime.setHours(19, 0, 0, 0)
      return Math.max(0, Math.floor((changeTime.getTime() - now.getTime()) / (1000 * 60)))
    } else {
      // Cambiar a claro a las 7:00 del día siguiente
      const changeTime = new Date(now)
      if (hour >= 19) {
        changeTime.setDate(changeTime.getDate() + 1)
      }
      changeTime.setHours(7, 0, 0, 0)
      return Math.max(0, Math.floor((changeTime.getTime() - now.getTime()) / (1000 * 60)))
    }
  }, [isDaylight])

  // Forzar actualización del tema según la hora
  const forceDaylightUpdate = useCallback(() => {
    if (theme === 'system') {
      const shouldBeLight = isDaylight()
      const currentIsLight = resolvedTheme === 'light'
      
      if (shouldBeLight !== currentIsLight) {
        setTheme(shouldBeLight ? 'light' : 'dark')
      }
    }
  }, [theme, resolvedTheme, setTheme, isDaylight])

  // Efecto para manejar cambios automáticos
  useEffect(() => {
    if (theme !== 'system') return

    // Verificar cada minuto si necesita cambiar
    const interval = setInterval(() => {
      forceDaylightUpdate()
    }, 60000) // 1 minuto

    // Verificación inicial
    forceDaylightUpdate()

    return () => clearInterval(interval)
  }, [theme, forceDaylightUpdate])

  // Efecto para manejar cambios de hora (cada hora)
  useEffect(() => {
    if (theme !== 'system') return

    const checkHourly = () => {
      const now = new Date()
      const minute = now.getMinutes()
      
      // Solo verificar en el minuto 0 de cada hora
      if (minute === 0) {
        forceDaylightUpdate()
      }
    }

    const interval = setInterval(checkHourly, 60000) // Cada minuto
    checkHourly() // Verificación inicial

    return () => clearInterval(interval)
  }, [theme, forceDaylightUpdate])

  return {
    isDaylight: isDaylight(),
    timeUntilChange: getTimeUntilChange(),
    forceDaylightUpdate
  }
}
