/**
 * Mode Toggle Component
 * 
 * Selector de tema mejorado con soporte para daylight automático
 * Sigue el patrón estándar de shadcn/ui
 * 
 * @author AI Pair Platform - UI Team
 * @version 1.0.0
 */

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useDaylightTheme } from '@/shared/hooks/hooks/useDaylightTheme'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { isDaylight, timeUntilChange } = useDaylightTheme()

  // Determinar el icono actual
  const getCurrentIcon = () => {
    if (theme === "system") {
      // Para sistema, usar el tema resuelto
      return resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
    }
    
    return theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
  }

  // Obtener el texto del tema actual
  const getCurrentThemeText = () => {
    if (theme === "system") {
      return resolvedTheme === "dark" ? "Oscuro (Sistema)" : "Claro (Sistema)"
    }
    
    return theme === "dark" ? "Oscuro" : "Claro"
  }

  // Formatear tiempo hasta el próximo cambio
  const formatTimeUntilChange = () => {
    if (theme !== "system") return ""
    
    const hours = Math.floor(timeUntilChange / 60)
    const minutes = timeUntilChange % 60
    
    if (hours > 0) {
      return ` (cambia en ${hours}h ${minutes}m)`
    }
    return ` (cambia en ${minutes}m)`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {getCurrentIcon()}
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>Sistema{formatTimeUntilChange()}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
