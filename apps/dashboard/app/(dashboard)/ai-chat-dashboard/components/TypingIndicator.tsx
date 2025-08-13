'use client'

// =============================================================================
// TYPING INDICATOR COMPONENT
// =============================================================================
// 
// Indicador animado de que la AI está escribiendo/procesando
// Incluye animaciones suaves y estados visuales
//
// VThink 1.0 Compliance:
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Smooth animations
// - ✅ Responsive design
// - ✅ Accessibility ready
// =============================================================================

import React from 'react'
import { Avatar, AvatarFallback } from '@/shared/components/bundui-premium/components/ui/avatar'
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge'
import { Bot, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

/**
 * Props para el indicador de escritura
 */
interface TypingIndicatorProps {
  message?: string
  variant?: 'default' | 'thinking' | 'processing'
  showAvatar?: boolean
  className?: string
}

/**
 * Indicador de que la AI está escribiendo
 * Muestra animación de puntos y mensaje personalizable
 */
export function TypingIndicator({ 
  message = "AI is thinking...",
  variant = 'default',
  showAvatar = true,
  className
}: TypingIndicatorProps) {
  
  // Obtener configuración según variante
  const getVariantConfig = () => {
    switch (variant) {
      case 'thinking':
        return {
          icon: <Sparkles className="w-4 h-4" />,
          message: "AI is thinking...",
          bgColor: "bg-chart-3/10",
          textColor: "text-chart-3",
          borderColor: "border-chart-3/20"
        }
      case 'processing':
        return {
          icon: <Zap className="w-4 h-4" />,
          message: "Processing your request...",
          bgColor: "bg-chart-2/10", 
          textColor: "text-chart-2",
          borderColor: "border-chart-2/20"
        }
      default:
        return {
          icon: <Bot className="w-4 h-4" />,
          message: "AI is typing...",
          bgColor: "bg-muted",
          textColor: "text-muted-foreground",
          borderColor: "border-border"
        }
    }
  }

  const config = getVariantConfig()

  return (
    <div className={cn("flex gap-3 animate-in fade-in-0 duration-300", className)}>
      {/* Avatar */}
      {showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {config.icon}
          </AvatarFallback>
        </Avatar>
      )}
      
      {/* Typing Bubble */}
      <div className={cn(
        "rounded-lg px-4 py-3 border",
        config.bgColor,
        config.borderColor
      )}>
        <div className="flex items-center gap-3">
          {/* Animated Dots */}
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-2 h-2 rounded-full animate-bounce",
              "bg-current opacity-70",
              "[animation-delay:-0.3s]",
              config.textColor
            )} />
            <div className={cn(
              "w-2 h-2 rounded-full animate-bounce",
              "bg-current opacity-70",
              "[animation-delay:-0.15s]",
              config.textColor
            )} />
            <div className={cn(
              "w-2 h-2 rounded-full animate-bounce",
              "bg-current opacity-70",
              config.textColor
            )} />
          </div>
          
          {/* Message */}
          <span className={cn(
            "text-sm font-medium",
            config.textColor
          )}>
            {message || config.message}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Indicador compacto para usar en sidebars o headers
 */
export function CompactTypingIndicator({ 
  className 
}: { 
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-chart-1 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-chart-1 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-chart-1 rounded-full animate-bounce" />
      </div>
      <span className="text-xs text-muted-foreground">AI typing...</span>
    </div>
  )
}

/**
 * Indicador de estado de AI con badge
 */
export function AIStatusIndicator({ 
  status = 'idle',
  className
}: {
  status?: 'idle' | 'thinking' | 'typing' | 'processing' | 'error'
  className?: string
}) {
  const getStatusConfig = () => {
    switch (status) {
      case 'thinking':
        return {
          label: 'Thinking',
          variant: 'secondary' as const,
          color: 'hsl(var(--chart-3))',
          showDots: true
        }
      case 'typing':
        return {
          label: 'Typing',
          variant: 'default' as const,
          color: 'hsl(var(--chart-1))',
          showDots: true
        }
      case 'processing':
        return {
          label: 'Processing',
          variant: 'secondary' as const,
          color: 'hsl(var(--chart-2))',
          showDots: true
        }
      case 'error':
        return {
          label: 'Error',
          variant: 'destructive' as const,
          color: 'hsl(var(--destructive))',
          showDots: false
        }
      default:
        return {
          label: 'Ready',
          variant: 'outline' as const,
          color: 'hsl(var(--muted-foreground))',
          showDots: false
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge 
      variant={config.variant}
      className={cn("gap-2 text-xs", className)}
    >
      {config.showDots && (
        <div className="flex items-center gap-0.5">
          <div 
            className="w-1 h-1 rounded-full animate-bounce [animation-delay:-0.3s]"
            style={{ backgroundColor: config.color }}
          />
          <div 
            className="w-1 h-1 rounded-full animate-bounce [animation-delay:-0.15s]"
            style={{ backgroundColor: config.color }}
          />
          <div 
            className="w-1 h-1 rounded-full animate-bounce"
            style={{ backgroundColor: config.color }}
          />
        </div>
      )}
      <span>{config.label}</span>
    </Badge>
  )
}