/**
 * Chat Content Component
 * VibeThink Orchestrator
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MoreVertical, 
  Phone, 
  Video,
  Search,
  Info
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardHeader
} from '@/shared/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/ui/tooltip'
import { ChatItemProps, ChatMessageProps } from '../types'
import { MessageBubble } from './MessageBubble'
import { cn } from '@/shared/utils'

interface ChatContentProps {
  selectedChat?: ChatItemProps | null
}

export function ChatContent({ selectedChat }: ChatContentProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [selectedChat?.messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
      // TODO: Implement send message
      setMessage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getOnlineStatusText = (status?: string) => {
    switch (status) {
      case 'online': return 'Active now'
      case 'away': return 'Away'
      case 'busy': return 'Do not disturb'
      default: return 'Offline'
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/10">
        <div className="text-center">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Select a conversation</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a chat from the list to start messaging
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="flex h-full flex-col border-0 rounded-none">
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedChat.user?.avatar} alt={selectedChat.name} />
            <AvatarFallback>
              {selectedChat.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{selectedChat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {getOnlineStatusText(selectedChat.user?.online_status)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voice Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Video Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search in conversation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat info</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 py-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {selectedChat.messages?.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.own_message || false}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
                <span>{selectedChat.name} is typing...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {message.trim() ? (
            <Button size="icon" onClick={handleSendMessage} className="h-9 w-9">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </Card>
  )
}