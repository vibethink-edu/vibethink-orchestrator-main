/**
 * Chat Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete messaging and chat application dashboard
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React from 'react'
import { ChatSidebar, ChatContent } from './components'
import { useChatData } from './hooks/useChatData'

export default function ChatDashboardPage() {
  const { chats, selectedChat, isLoading } = useChatData()

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height)-3rem)] w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading chat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Chat Dashboard</h1>
        <p className="text-muted-foreground">
          Manage conversations and messages across your organization
        </p>
      </div>

      {/* Chat Interface */}
      <div className="flex h-[calc(100vh-var(--header-height)-8rem)] w-full rounded-lg border bg-card">
        <ChatSidebar chats={chats} />
        <div className="grow">
          <ChatContent selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  )
}
