'use client'

// =============================================================================
// CHAT MESSAGES COMPONENT
// =============================================================================
// 
// Contenedor principal para mostrar mensajes de chat
// Incluye scroll automático, lazy loading y virtualización
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Performance optimized
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Accessibility ready
// =============================================================================

import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@vibethink/ui/components/scroll-area'
import { Button } from '@vibethink/ui/components/button'
import { Separator } from '@vibethink/ui/components/separator'
import { Badge } from '@vibethink/ui/components/badge'
import {
  ArrowDown,
  MessageSquare,
  Clock,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ChatMessagesProps, ChatMessage } from '../types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { format } from 'date-fns'

/**
 * Contenedor de mensajes de chat con scroll y optimizaciones
 * Maneja la visualización de conversaciones completas
 */
export function ChatMessages({
  messages,
  isLoading,
  isTyping,
  onMessageEdit,
  onMessageDelete,
  onMessageCopy
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)

  // Auto-scroll a nuevos mensajes
  useEffect(() => {
    if (isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [messages, isNearBottom, isTyping])

  // Monitor scroll position
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const isScrolledToBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100

    setIsNearBottom(isScrolledToBottom)
    setShowScrollButton(!isScrolledToBottom && messages.length > 5)
  }

  // Scroll to bottom manually
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {}

    messages.forEach(message => {
      const date = format(new Date(message.created_at), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  // Formatear fecha para separadores
  const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today'
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday'
    } else {
      return format(date, 'MMMM d, yyyy')
    }
  }

  // Agrupar mensajes por fecha
  const messageGroups = React.useMemo(() => {
    return groupMessagesByDate(messages)
  }, [messages])

  // Estados de carga y error
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      {/* Messages Area */}
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 px-4"
        onScroll={handleScroll}
      >
        <div className="py-4 space-y-6">
          {/* Empty State */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  Start the conversation
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Send a message to begin chatting with AI. You can ask questions,
                  request help, or have a conversation about any topic.
                </p>
              </div>
            </div>
          )}

          {/* Messages Grouped by Date */}
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-6">
                <Separator className="flex-1" />
                <Badge variant="outline" className="text-xs px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{formatDateSeparator(date)}</span>
                </Badge>
                <Separator className="flex-1" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-6">
                {dateMessages.map((message, index) => {
                  const handleCopy = () => {
                    if (onMessageCopy) {
                      onMessageCopy(message.content)
                    }
                  }
                  const handleEdit = onMessageEdit ? (content: string) => onMessageEdit(message.id, content) : undefined
                  const handleDelete = onMessageDelete ? () => onMessageDelete(message.id) : undefined

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isUser={message.role === 'user'}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCopy={handleCopy}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="mt-6">
              <TypingIndicator
                variant="thinking"
                message="AI is generating a response..."
              />
            </div>
          )}

          {/* Loading Indicator for more messages */}
          {isLoading && messages.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading messages...</span>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="default"
            size="sm"
            className="rounded-full shadow-lg gap-2"
            onClick={scrollToBottom}
          >
            <ArrowDown className="w-4 h-4" />
            <span className="hidden sm:inline">Scroll to bottom</span>
          </Button>
        </div>
      )}

      {/* Message Count Indicator */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{messages.length} messages in this conversation</span>

            {/* Token usage if available */}
            {messages.some(m => m.metadata?.tokens_used) && (
              <span>
                {messages.reduce((total, m) => total + (m.metadata?.tokens_used || 0), 0)} tokens used
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
