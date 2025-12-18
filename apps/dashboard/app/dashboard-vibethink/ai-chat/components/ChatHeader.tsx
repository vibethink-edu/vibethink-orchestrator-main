'use client'

// =============================================================================
// CHAT HEADER COMPONENT
// =============================================================================
// 
// Header del chat con información de la sesión actual y controles
// Incluye título, stats, settings y acciones
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Accessibility ready
// =============================================================================

import React from 'react'
import { Button } from '@vibethink/ui'
import { Badge } from '@vibethink/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@vibethink/ui'
import { Separator } from '@vibethink/ui'
import { 
  Settings, 
  Share2, 
  Download, 
  MoreVertical,
  Bot,
  MessageSquare,
  Clock,
  Zap,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatHeaderProps, AIProviderType } from '../types'
import { formatDistanceToNow } from 'date-fns'

/**
 * Header del chat con información y controles
 * Muestra detalles de la sesión actual y acciones disponibles
 */
export function ChatHeader({
  chat,
  messagesCount,
  onSettingsOpen,
  onExport,
  onShare
}: ChatHeaderProps) {
  // Si no hay chat activo, mostrar header vacío
  if (!chat) {
    return (
      <div className="h-16 border-b bg-card/30 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Select a conversation to start chatting
        </p>
      </div>
    )
  }

  // Obtener icono del provider
  const getProviderIcon = (provider: AIProviderType) => {
    switch (provider) {
      case 'openai':
        return '🤖'
      case 'anthropic':
        return '🧠'
      case 'google':
        return '🔍'
      case 'local':
        return '💻'
      default:
        return '🤖'
    }
  }

  // Obtener color del provider
  const getProviderColor = (provider: AIProviderType) => {
    switch (provider) {
      case 'openai':
        return 'hsl(var(--chart-1))'
      case 'anthropic':
        return 'hsl(var(--chart-2))'
      case 'google':
        return 'hsl(var(--chart-3))'
      case 'local':
        return 'hsl(var(--chart-4))'
      default:
        return 'hsl(var(--muted))'
    }
  }

  // Formatear fecha relativa
  const formatRelativeTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  // Obtener nombre amigable del provider
  const getProviderName = (provider: AIProviderType) => {
    switch (provider) {
      case 'openai':
        return 'OpenAI'
      case 'anthropic':
        return 'Anthropic'
      case 'google':
        return 'Google'
      case 'local':
        return 'Local Model'
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1)
    }
  }

  return (
    <div className="h-16 border-b bg-card/30 px-4 flex items-center justify-between">
      {/* Left Side - Chat Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Chat Title and Provider */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-semibold text-foreground truncate">
              {chat.title || 'Untitled Chat'}
            </h1>
            
            {/* Provider Badge */}
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-0.5 shrink-0"
              style={{ 
                borderColor: getProviderColor(chat.ai_provider),
                color: getProviderColor(chat.ai_provider)
              }}
            >
              {getProviderIcon(chat.ai_provider)} {getProviderName(chat.ai_provider)}
            </Badge>
          </div>

          {/* Model and Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              <span>{chat.ai_model}</span>
            </div>
            
            <Separator orientation="vertical" className="h-3" />
            
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{messagesCount} messages</span>
            </div>
            
            <Separator orientation="vertical" className="h-3" />
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(chat.last_message_at || chat.updated_at)}</span>
            </div>

            {/* Temperature indicator */}
            <Separator orientation="vertical" className="h-3" />
            
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>T: {chat.settings.temperature}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {chat.is_active && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="gap-2 hidden sm:flex"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="gap-2 hidden sm:flex"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsOpen}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>

        {/* More Actions Menu - Mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettingsOpen} className="gap-2">
              <Settings className="w-4 h-4" />
              Chat Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
