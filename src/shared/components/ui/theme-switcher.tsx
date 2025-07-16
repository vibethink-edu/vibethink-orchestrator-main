/**
 * Advanced Theme Switcher Component
 * 
 * Componente avanzado de selección de tema que hereda inteligentemente de shadcn/ui
 * Incluye soporte para daylight automático, preview de temas y mejor UX
 * 
 * Inspirado en el diseño de shadcn/ui y su sitio web
 * 
 * @author AI Pair Platform - UI Team
 * @version 2.0.0
 */

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useDaylightTheme } from '@/shared/hooks/hooks/useDaylightTheme'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { cn } from "@/lib/utils"

interface ThemeOption {
  value: string
  label: string
  icon: React.ReactNode
  description: string
  preview?: string
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Claro",
    icon: <Sun className="h-4 w-4" />,
    description: "Tema claro para trabajo diurno",
    preview: "bg-white border-gray-200"
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: <Moon className="h-4 w-4" />,
    description: "Tema oscuro para trabajo nocturno",
    preview: "bg-gray-900 border-gray-700"
  },
  {
    value: "system",
    label: "Sistema",
    icon: <Monitor className="h-4 w-4" />,
    description: "Cambia automáticamente según tu sistema",
    preview: "bg-gradient-to-r from-white to-gray-900 border-gray-300"
  }
]

export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { isDaylight, timeUntilChange } = useDaylightTheme()

  // Determinar el tema actual para mostrar
  const currentTheme = theme === "system" ? resolvedTheme : theme
  const currentOption = themeOptions.find(option => 
    option.value === (theme === "system" ? "system" : currentTheme)
  )

  // Formatear tiempo hasta el próximo cambio
  const formatTimeUntilChange = () => {
    if (theme !== "system") return ""
    
    const hours = Math.floor(timeUntilChange / 60)
    const minutes = timeUntilChange % 60
    
    if (hours > 0) {
      return ` • Cambia en ${hours}h ${minutes}m`
    }
    return ` • Cambia en ${minutes}m`
  }

  // Obtener el estado del tema del sistema
  const getSystemStatus = () => {
    if (theme !== "system") return ""
    return isDaylight ? " (Claro)" : " (Oscuro)"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 w-9 p-0"
          aria-label="Cambiar tema"
        >
          {currentOption?.icon}
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Tema</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {themeOptions.map((option) => {
          const isActive = theme === option.value
          const isSystemActive = option.value === "system" && theme === "system"
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                isActive && "bg-accent"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                  {isSystemActive && (
                    <span className="text-xs text-muted-foreground">
                      {getSystemStatus()}
                    </span>
                  )}
                </div>
                
                {/* Preview del tema */}
                {option.preview && (
                  <div className={cn(
                    "ml-auto w-6 h-6 rounded border",
                    option.preview
                  )} />
                )}
              </div>
              
              {isActive && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
        
        {theme === "system" && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Estado actual:</span>
                <span className="font-medium">
                  {isDaylight ? "Claro" : "Oscuro"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTimeUntilChange()}
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente compacto para espacios reducidos
export function ThemeSwitcherCompact() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { isDaylight } = useDaylightTheme()

  const currentIcon = theme === "system" 
    ? (resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />)
    : (theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />)

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="h-8 w-8 p-0"
      aria-label="Cambiar tema"
    >
      {currentIcon}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
