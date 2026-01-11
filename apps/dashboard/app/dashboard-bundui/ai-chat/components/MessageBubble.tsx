'use client'

// =============================================================================
// MESSAGE BUBBLE COMPONENT
// =============================================================================
// 
// Componente individual para mostrar mensajes de chat
// Diferenciación visual entre user/AI, acciones y metadata
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Accessibility ready
// =============================================================================

import React, { useState } from 'react'
import { Button } from '@vibethink/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@vibethink/ui/components/avatar'
import { Badge } from '@vibethink/ui/components/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@vibethink/ui/components/dropdown-menu'
import {
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  User,
  Bot,
  Clock,
  Zap,
  FileText,
  Download,
  CheckCircle,
  AlertCircle
} from "@vibethink/ui/icons"
import { cn } from '@/shared/lib/utils'
import { MessageBubbleProps, ChatMessage } from '../types'
import { formatDistanceToNow } from 'date-fns'

/**
 * Componente de burbuja de mensaje individual
 * Maneja diferentes tipos de mensaje (user, assistant, system)
 */
export function MessageBubble({
  message,
  isUser,
  onEdit,
  onDelete,
  onCopy
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)

  // Determinar si es mensaje de AI o sistema
  const isAI = message.role === 'assistant'
  const isSystem = message.role === 'system'

  // Handler para copiar mensaje
  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        onCopy?.()
      }
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  // Formatear timestamp
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  // Obtener nombre del rol
  const getRoleName = () => {
    switch (message.role) {
      case 'user':
        return 'You'
      case 'assistant':
        return 'AI Assistant'
      case 'system':
        return 'System'
      default:
        return message.role
    }
  }

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser && "flex-row-reverse"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : isSystem ? (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[80%] space-y-2",
        isUser && "flex flex-col items-end"
      )}>
        {/* Message Header */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isUser && "flex-row-reverse"
        )}>
          <span className="font-medium">{getRoleName()}</span>
          <span>{formatTime(message.created_at)}</span>

          {/* Model info for AI messages */}
          {isAI && message.metadata?.model_info?.model && (
            <>
              <span>•</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                <span>{String(message.metadata.model_info.model)}</span>
              </Badge>
            </>
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "rounded-lg px-4 py-3 text-sm relative",
          // User messages
          isUser && "bg-primary text-primary-foreground",
          // AI messages  
          isAI && "bg-muted text-muted-foreground border",
          // System messages
          isSystem && "bg-warning/10 text-warning-foreground border border-warning/20"
        )}>
          {/* Message Content */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 rounded bg-background/50 border"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-xs truncate flex-1">
                    {attachment.filename}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Error indicator */}
          {message.metadata?.error && (
            <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" />
              <span>Error: {message.metadata.error}</span>
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div className={cn(
          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser && "flex-row-reverse"
        )}>
          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isUser ? "end" : "start"}>
              <DropdownMenuItem onClick={handleCopy} className="gap-2">
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Copy text'}
              </DropdownMenuItem>

              {message.attachments && message.attachments.length > 0 && (
                <DropdownMenuItem className="gap-2">
                  <Download className="w-4 h-4" />
                  Download attachments
                </DropdownMenuItem>
              )}

              {isUser && (
                <>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={() => {
                        if (onEdit) {
                          onEdit(message.content)
                        }
                      }}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit message
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="gap-2 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete message
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Metadata (tokens, response time) */}
        {message.metadata && (isAI || (message.metadata.tokens_used !== undefined && message.metadata.tokens_used !== null)) ? (
          <div className={cn(
            "flex items-center gap-3 text-xs text-muted-foreground",
            isUser && "flex-row-reverse"
          )}>
            {message.metadata.tokens_used ? (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{message.metadata.tokens_used} tokens</span>
              </div>
            ) : null}

            {message.metadata.response_time ? (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{message.metadata.response_time}ms</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
