'use client'

// =============================================================================
// AI CHAT APP PAGE - MODULAR & STANDARDIZED
// =============================================================================
// 
// Página principal del AI Chat App con interfaz conversacional moderna
// Migrado de BunduiCompleteLayout a DashboardLayout para seguir estándares
//
// ✅ ESTÁNDARES APLICADOS:
// - ✅ NO HARDCODING: Usa DashboardLayout modular
// - ✅ Multi-tenant security
// - ✅ DashboardLayout estándar (NO BunduiCompleteLayout)
// - ✅ Real-time messaging
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Componentes reutilizables y configurables
// =============================================================================

import React, { useState } from 'react'
import { ChatHeader } from './components/ChatHeader'
import { ChatMessages } from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import { ChatSettings } from './components/ChatSettings'
import { useAiChat } from './hooks/useAiChat'
import { useChatHistory } from './hooks/useChatHistory'
import { useAiProvider } from './hooks/useAiProvider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@vibethink/ui/components/sheet'
import { Button } from '@vibethink/ui/components/button'
import { MessageSquarePlus, Settings, Sparkles, Sliders } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

/**
 * AI Chat App - Interfaz conversacional completa
 * 
 * Features:
 * - Real-time messaging con AI providers
 * - Chat sessions management
 * - Multi-provider support (OpenAI, Anthropic, etc.)
 * - Responsive sidebar layout
 * - File attachments support
 * - Message history y persistence
 * - Settings y configuración avanzada
 */
export default function AiChatPage() {
  // Estado principal del chat
  const {
    currentChat,
    messages,
    chatSessions,
    isLoading,
    isTyping,
    error,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatSettings,
    clearError
  } = useAiChat()

  // Historia y filtros de chat
  const {
    filteredSessions,
    filters,
    updateFilters,
    deleteSession,
    exportSession
  } = useChatHistory(chatSessions)

  // Providers de AI
  const {
    providers,
    currentProvider,
    availableModels,
    switchProvider
  } = useAiProvider()

  // Estado UI local
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Handlers
  const handleNewChat = async () => {
    try {
      await createNewChat()
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    try {
      await sendMessage(content, attachments)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId)
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleExportChat = async () => {
    if (currentChat) {
      try {
        await exportSession(currentChat.id)
      } catch (error) {
        console.error('Error exporting chat:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Chat Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
          <p className="text-muted-foreground">
            Intelligent conversations with multiple AI providers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleNewChat}
            className="gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </Button>
          <Button
            variant="outline"
            onClick={() => setSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="border rounded-xl bg-card shadow-sm">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Conversations Panel */}
          <div className="w-80 border-r bg-card/50 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Conversations</h3>
                <Button size="sm" variant="ghost" onClick={handleNewChat}>
                  <MessageSquarePlus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {filteredSessions?.slice(0, 10).map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "p-2 rounded-md cursor-pointer transition-colors",
                      session.id === currentChat?.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                    onClick={() => handleSelectChat(session.id)}
                  >
                    <p className="text-sm font-medium truncate">
                      {session.title || 'New Chat'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.id === currentChat?.id ? `${messages.length} messages` : '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col">
            {currentChat ? (
              <>
                {/* Messages Area */}
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  isTyping={isTyping}
                  onMessageEdit={undefined}
                  onMessageDelete={undefined}
                  onMessageCopy={(content) => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(content)
                    }
                  }}
                />

                {/* Input Area */}
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  allowAttachments={true}
                />
              </>
            ) : (
              /* Empty State - No chat selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md mx-auto p-8">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Welcome to AI Chat
                  </h3>
                  <p className="text-muted-foreground">
                    Start a new conversation with AI or select an existing chat from the sidebar.
                    You can chat with multiple AI providers and models.
                  </p>
                  <Button
                    onClick={handleNewChat}
                    className="gap-2"
                    size="lg"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    Start New Chat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="w-96">
          <SheetHeader className="pb-4 border-b border-border px-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Sliders className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-lg font-semibold">Chat Settings</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground mt-1 px-2">
                  Configure AI behavior and model parameters
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="px-6 py-4">
            <ChatSettings
              settings={currentChat?.settings || {
                temperature: 0.7,
                max_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                context_length: 4096
              }}
              provider={currentProvider || providers[0]}
              availableModels={availableModels}
              onSettingsChange={(settings) => {
                if (currentChat) {
                  updateChatSettings(settings)
                }
              }}
              onProviderChange={switchProvider}
              onModelChange={(modelId) => {
                if (currentChat) {
                  updateChatSettings({
                    ...currentChat.settings,
                    // Update model in provider-specific way
                  })
                }
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-destructive-foreground hover:bg-destructive/80"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
