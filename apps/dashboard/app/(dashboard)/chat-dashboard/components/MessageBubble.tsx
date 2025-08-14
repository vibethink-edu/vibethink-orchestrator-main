/**
 * Message Bubble Component
 * VibeThink Orchestrator
 */

import React from 'react'
import { cn } from '@/shared/utils'
import { ChatMessageProps } from '../types'
import { MessageStatusIcon } from './MessageStatusIcon'
import { FileText, Image, Play, Mic, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface MessageBubbleProps {
  message: ChatMessageProps
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            {message.data?.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Shared image"
                className="rounded-lg max-w-xs cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
            {message.content && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        )
      
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {message.data?.file_name || 'File'}
              </p>
              <p className="text-xs text-muted-foreground">
                {message.data?.size || 'Unknown size'}
              </p>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )
      
      case 'audio':
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="h-1 bg-muted rounded-full">
                <div className="h-full w-1/3 bg-primary rounded-full" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {message.data?.duration || '0:00'}
            </span>
          </div>
        )
      
      case 'video':
        return (
          <div className="relative rounded-lg overflow-hidden max-w-xs">
            <img
              src={message.data?.cover || '/placeholder-video.jpg'}
              alt="Video thumbnail"
              className="w-full cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="h-6 w-6 text-black ml-1" />
              </div>
            </div>
            {message.data?.duration && (
              <span className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
                {message.data.duration}
              </span>
            )}
          </div>
        )
      
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>
    }
  }

  return (
    <div className={cn('flex gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-lg px-3 py-2',
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {message.reply_to && (
          <div className={cn(
            'mb-2 p-2 rounded border-l-2',
            isOwn 
              ? 'bg-primary-foreground/10 border-primary-foreground/30' 
              : 'bg-background/50 border-muted-foreground/30'
          )}>
            <p className="text-xs opacity-70">Reply to</p>
            <p className="text-xs line-clamp-2">Original message content...</p>
          </div>
        )}

        {renderMessageContent()}

        <div className={cn(
          'flex items-center gap-1 mt-1',
          isOwn ? 'justify-end' : 'justify-start'
        )}>
          {message.edited && (
            <span className="text-xs opacity-70">edited</span>
          )}
          <span className="text-xs opacity-70">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && message.read !== undefined && (
            <MessageStatusIcon 
              status={message.read ? 'read' : 'delivered'} 
              className={cn(
                isOwn && 'text-primary-foreground/70'
              )}
            />
          )}
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-background/20 text-xs"
              >
                <span>{reaction.emoji}</span>
                {reaction.users.length > 1 && (
                  <span>{reaction.users.length}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}