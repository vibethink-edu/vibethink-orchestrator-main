/**
 * Chat Sidebar Component
 * VibeThink Orchestrator
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Search, Plus, Filter, Archive, Pin } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@vibethink/ui'
import { Badge } from '@/shared/components/ui/badge'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu'
import { ChatListItem } from './ChatListItem'
import { ChatItemProps } from '../types'
import { useChatStore } from '../hooks/useChatStore'

interface ChatSidebarProps {
  chats: ChatItemProps[]
}

export function ChatSidebar({ chats }: ChatSidebarProps) {
  const { selectedChat, setSelectedChat } = useChatStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'archived' | 'pinned'>('all')

  const filteredChats = useMemo(() => {
    let filtered = chats

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((chat) =>
        chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    switch (filterStatus) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unread_count && chat.unread_count > 0)
        break
      case 'archived':
        filtered = filtered.filter(chat => chat.is_archive)
        break
      case 'pinned':
        filtered = filtered.filter(chat => chat.is_pinned)
        break
    }

    // Sort: pinned first, then by date
    filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    })

    return filtered
  }, [chats, searchQuery, filterStatus])

  const unreadCount = chats.filter(chat => chat.unread_count && chat.unread_count > 0).length

  return (
    <Card className="w-full border-0 rounded-none lg:w-96 lg:border-r">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Messages</CardTitle>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter Chats</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Chats
                  {filterStatus === 'all' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('unread')}>
                  Unread
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pinned')}>
                  <Pin className="mr-2 h-3 w-3" />
                  Pinned
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('archived')}>
                  <Archive className="mr-2 h-3 w-3" />
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            className="pl-9"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterStatus !== 'all' && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {filterStatus}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => setFilterStatus('all')}
            >
              Clear
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="divide-y">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  active={selectedChat?.id === chat.id}
                  onClick={() => setSelectedChat(chat)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No chats found' : 'No messages yet'}
                </p>
                {searchQuery && (
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => setSearchQuery('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
