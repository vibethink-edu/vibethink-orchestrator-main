/**
 * Chat List Item Component
 * VibeThink Orchestrator
 */

'use client'

import React from 'react'
import { cn } from '@/shared/utils'
import { MoreVertical, Pin, Archive, Volume2 } from 'lucide-react'
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@vibethink/ui'
import { ChatItemProps } from '../types'
import { MessageStatusIcon } from './MessageStatusIcon'

interface ChatListItemProps {
  chat: ChatItemProps
  active: boolean
  onClick: () => void
}

export function ChatListItem({ chat, active, onClick }: ChatListItemProps) {
  const getAvatarFallback = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getOnlineStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const formatTime = (date?: string) => {
    if (!date) return ''
    const messageDate = new Date(date)
    const now = new Date()
    const diff = now.getTime() - messageDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation()
    console.log(`Action: ${action} for chat ${chat.id}`)
    // TODO: Implement actions
  }

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50',
        active && 'bg-muted'
      )}
      onClick={onClick}
    >
      {/* Avatar with online status */}
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.user?.avatar} alt={chat.name} />
          <AvatarFallback>{getAvatarFallback(chat.name)}</AvatarFallback>
        </Avatar>
        {chat.user?.online_status && (
          <span 
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
              getOnlineStatusColor(chat.user.online_status)
            )}
          />
        )}
      </div>

      {/* Chat info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-sm">{chat.name}</span>
            {chat.is_pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
            {chat.is_muted && <Volume2 className="h-3 w-3 text-muted-foreground line-through" />}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTime(chat.date)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {chat.status && <MessageStatusIcon status={chat.status} />}
            <span className="truncate text-sm text-muted-foreground">
              {chat.last_message}
            </span>
          </div>
          {chat.unread_count && chat.unread_count > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 h-5 min-w-[20px] justify-center rounded-full px-1.5 text-xs"
            >
              {chat.unread_count > 99 ? '99+' : chat.unread_count}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions dropdown */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => handleAction(e, 'pin')}>
              <Pin className="mr-2 h-4 w-4" />
              {chat.is_pinned ? 'Unpin' : 'Pin'} Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleAction(e, 'mute')}>
              <Volume2 className="mr-2 h-4 w-4" />
              {chat.is_muted ? 'Unmute' : 'Mute'} Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleAction(e, 'archive')}>
              <Archive className="mr-2 h-4 w-4" />
              {chat.is_archive ? 'Unarchive' : 'Archive'} Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => handleAction(e, 'delete')}
              className="text-destructive"
            >
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
