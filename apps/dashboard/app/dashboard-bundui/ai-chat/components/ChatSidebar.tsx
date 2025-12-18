'use client'

// =============================================================================
// CHAT SIDEBAR COMPONENT
// =============================================================================
// 
// Sidebar para gestión de sesiones de chat y navegación
// Incluye búsqueda, filtros, y acciones de chat
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Real-time updates
// =============================================================================

import React, { useState } from 'react'
import { Button } from '@vibethink/ui'
import { Input } from '@vibethink/ui'
import { ScrollArea } from '@vibethink/ui'
import { Badge } from '@vibethink/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@vibethink/ui'
import { 
  MessageSquarePlus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Download, 
  Archive,
  Calendar,
  Bot,
  User,
  Clock
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ChatSidebarProps, ChatSession, AIProviderType } from '../types'
import { formatDistanceToNow } from 'date-fns'

/**
 * Panel de conversaciones para AI Chat
 * Muestra lista de conversaciones, búsqueda y filtros
 */
export function ChatSidebar({
  sessions,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  filters,
  onFiltersChange
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  // Handler para búsqueda
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onFiltersChange({ search: query })
  }

  // Handler para filtro de provider
  const handleProviderFilter = (provider: AIProviderType | undefined) => {
    onFiltersChange({ ai_provider: provider })
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

  return (
    <div className="flex flex-col h-full bg-card/50">
      {/* Header con título y botón nuevo chat */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            New
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <Button
            variant={!filters.ai_provider ? "default" : "outline"}
            size="sm"
            onClick={() => handleProviderFilter(undefined)}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={filters.ai_provider === 'openai' ? "default" : "outline"}
            size="sm"
            onClick={() => handleProviderFilter('openai')}
            className="text-xs gap-1"
          >
            {getProviderIcon('openai')} GPT
          </Button>
          <Button
            variant={filters.ai_provider === 'anthropic' ? "default" : "outline"}
            size="sm"
            onClick={() => handleProviderFilter('anthropic')}
            className="text-xs gap-1"
          >
            {getProviderIcon('anthropic')} Claude
          </Button>
        </div>
      </div>

      {/* Chat Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sessions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                No chats yet
              </p>
              <Button 
                onClick={onNewChat}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Start your first chat
              </Button>
            </div>
          ) : (
            sessions.map((session) => (
              <ChatSessionItem
                key={session.id}
                session={session}
                isActive={session.id === currentChatId}
                onSelect={() => onSelectChat(session.id)}
                onDelete={() => onDeleteChat(session.id)}
                getProviderIcon={getProviderIcon}
                getProviderColor={getProviderColor}
                formatRelativeTime={formatRelativeTime}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t bg-muted/20">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total chats:</span>
            <span className="font-medium">{sessions.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Active:</span>
            <span className="font-medium">
              {sessions.filter(s => s.is_active).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Item individual de sesión de chat
 */
interface ChatSessionItemProps {
  session: ChatSession
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  getProviderIcon: (provider: AIProviderType) => string
  getProviderColor: (provider: AIProviderType) => string
  formatRelativeTime: (date: string) => string
}

function ChatSessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
  getProviderIcon,
  getProviderColor,
  formatRelativeTime
}: ChatSessionItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-colors",
        "hover:bg-muted/50 border border-transparent",
        isActive && "bg-primary/5 border-primary/20"
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Content */}
      <div className="space-y-2">
        {/* Title and Provider */}
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-medium text-sm truncate flex-1",
            isActive ? "text-primary" : "text-foreground"
          )}>
            {session.title || 'Untitled Chat'}
          </h3>
          
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  showActions && "opacity-100"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Archive className="w-4 h-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Provider and Model */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="text-xs px-2 py-0.5"
            style={{ 
              borderColor: getProviderColor(session.ai_provider),
              color: getProviderColor(session.ai_provider)
            }}
          >
            {getProviderIcon(session.ai_provider)} {session.ai_provider}
          </Badge>
          
          <span className="text-xs text-muted-foreground truncate">
            {session.ai_model}
          </span>
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {session.description}
          </p>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            {formatRelativeTime(session.last_message_at || session.updated_at)}
          </span>
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
      )}
    </div>
  )
}
