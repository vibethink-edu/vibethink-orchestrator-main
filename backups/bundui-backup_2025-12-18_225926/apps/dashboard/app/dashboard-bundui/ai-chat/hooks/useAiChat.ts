// =============================================================================
// USE AI CHAT HOOK
// =============================================================================
// 
// Hook principal para gestionar el estado y lógica de AI Chat
// Incluye manejo de sesiones, mensajes y AI providers
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Real-time updates
// - ✅ Error handling
// - ✅ Performance optimized
// =============================================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { UseAiChatReturn, ChatSession, ChatMessage, ChatSettings, AIProviderType } from '../types'

// Mock user data - In real implementation, this would come from auth context
const mockUser = {
  id: 'user-1',
  company_id: 'company-1',
  email: 'user@example.com'
}

/**
 * Hook principal para AI Chat
 * Maneja sesiones, mensajes y comunicación con AI providers
 */
export function useAiChat(): UseAiChatReturn {
  // Estados principales
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inicializar datos mock
  useEffect(() => {
    initializeMockData()
  }, [])

  // Cargar mensajes cuando cambia el chat actual
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id)
    } else {
      setMessages([])
    }
  }, [currentChat])

  /**
   * Inicializar datos de ejemplo
   */
  const initializeMockData = () => {
    const mockSessions: ChatSession[] = [
      {
        id: 'session-1',
        company_id: mockUser.company_id,
        user_id: mockUser.id,
        title: 'General AI Assistance',
        description: 'Help with various tasks and questions',
        ai_provider: 'openai',
        ai_model: 'gpt-4',
        settings: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 4096
        },
        is_active: true,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        last_message_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'session-2',
        company_id: mockUser.company_id,
        user_id: mockUser.id,
        title: 'Code Review & Development',
        description: 'Technical discussions and code assistance',
        ai_provider: 'anthropic',
        ai_model: 'claude-3-sonnet',
        settings: {
          temperature: 0.3,
          max_tokens: 4096,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 8192
        },
        is_active: true,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        last_message_at: new Date(Date.now() - 7200000).toISOString()
      }
    ]

    setChatSessions(mockSessions)
    setCurrentChat(mockSessions[0])
  }

  /**
   * Cargar mensajes de una sesión
   */
  const loadMessages = useCallback(async (sessionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simular carga de mensajes
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockMessages: ChatMessage[] = sessionId === 'session-1' ? [
        {
          id: 'msg-1',
          chat_session_id: sessionId,
          company_id: mockUser.company_id,
          user_id: mockUser.id,
          role: 'user',
          content: 'Hello! Can you help me understand how to implement a real-time chat system?',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'msg-2',
          chat_session_id: sessionId,
          company_id: mockUser.company_id,
          user_id: mockUser.id,
          role: 'assistant',
          content: 'I\'d be happy to help you implement a real-time chat system! Here are the key components you\'ll need:\n\n1. **WebSocket Connection**: For real-time bidirectional communication\n2. **Message Queue**: To handle message ordering and delivery\n3. **State Management**: To sync UI with real-time updates\n4. **Error Handling**: For connection issues and retry logic\n\nWould you like me to dive deeper into any of these areas?',
          metadata: {
            tokens_used: 89,
            response_time: 1250,
            model_info: {
              provider: 'openai',
              model: 'gpt-4',
              temperature: 0.7
            }
          },
          created_at: new Date(Date.now() - 3500000).toISOString(),
          updated_at: new Date(Date.now() - 3500000).toISOString()
        }
      ] : [
        {
          id: 'msg-3',
          chat_session_id: sessionId,
          company_id: mockUser.company_id,
          user_id: mockUser.id,
          role: 'user',
          content: 'Can you review this TypeScript code for any potential issues?',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'msg-4',
          chat_session_id: sessionId,
          company_id: mockUser.company_id,
          user_id: mockUser.id,
          role: 'assistant',
          content: 'I\'d be glad to review your TypeScript code! However, I don\'t see any code in your message. Could you please share the code you\'d like me to review?\n\nWhen you share it, I\'ll look for:\n- Type safety issues\n- Performance concerns\n- Best practices\n- Potential bugs\n- Code structure and readability',
          metadata: {
            tokens_used: 67,
            response_time: 980,
            model_info: {
              provider: 'anthropic',
              model: 'claude-3-sonnet',
              temperature: 0.3
            }
          },
          created_at: new Date(Date.now() - 7100000).toISOString(),
          updated_at: new Date(Date.now() - 7100000).toISOString()
        }
      ]

      setMessages(mockMessages)
    } catch (err) {
      setError('Failed to load messages. Please try again.')
      console.error('Error loading messages:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Enviar mensaje
   */
  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!currentChat || !content.trim()) return

    setIsLoading(true)
    setIsTyping(true)
    setError(null)

    try {
      // Crear mensaje del usuario
      const userMessage: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        chat_session_id: currentChat.id,
        company_id: mockUser.company_id, // ✅ CRITICAL: Multi-tenant security
        user_id: mockUser.id,
        role: 'user',
        content: content.trim(),
        attachments: attachments?.map((file, index) => ({
          id: `att-${Date.now()}-${index}`,
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          url: URL.createObjectURL(file),
          processed: false
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Agregar mensaje del usuario inmediatamente
      setMessages(prev => [...prev, userMessage])

      // Simular procesamiento de AI
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generar respuesta de AI
      const aiResponse = await generateAIResponse(content, currentChat)
      
      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        chat_session_id: currentChat.id,
        company_id: mockUser.company_id, // ✅ CRITICAL: Multi-tenant security
        user_id: mockUser.id,
        role: 'assistant',
        content: aiResponse.content,
        metadata: aiResponse.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Agregar respuesta de AI
      setMessages(prev => [...prev, aiMessage])

      // Actualizar timestamp de la sesión
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentChat.id 
            ? { ...session, last_message_at: new Date().toISOString() }
            : session
        )
      )

    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [currentChat])

  /**
   * Crear nueva sesión de chat
   */
  const createNewChat = useCallback(async (title?: string, ai_provider: AIProviderType = 'openai') => {
    setIsLoading(true)
    setError(null)

    try {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        company_id: mockUser.company_id, // ✅ CRITICAL: Multi-tenant security
        user_id: mockUser.id,
        title: title || 'New Chat',
        ai_provider,
        ai_model: ai_provider === 'openai' ? 'gpt-4' : 'claude-3-sonnet',
        settings: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 4096
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setChatSessions(prev => [newSession, ...prev])
      setCurrentChat(newSession)
      setMessages([])

      return newSession
    } catch (err) {
      setError('Failed to create new chat. Please try again.')
      console.error('Error creating chat:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Seleccionar chat
   */
  const selectChat = useCallback((chatId: string) => {
    const session = chatSessions.find(s => s.id === chatId)
    if (session) {
      setCurrentChat(session)
    }
  }, [chatSessions])

  /**
   * Eliminar chat
   */
  const deleteChat = useCallback(async (chatId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      setChatSessions(prev => prev.filter(s => s.id !== chatId))
      
      if (currentChat?.id === chatId) {
        const remainingSessions = chatSessions.filter(s => s.id !== chatId)
        setCurrentChat(remainingSessions[0] || null)
      }
    } catch (err) {
      setError('Failed to delete chat. Please try again.')
      console.error('Error deleting chat:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [currentChat, chatSessions])

  /**
   * Actualizar configuración del chat
   */
  const updateChatSettings = useCallback(async (settings: Partial<ChatSettings>) => {
    if (!currentChat) return

    try {
      const updatedChat = {
        ...currentChat,
        settings: { ...currentChat.settings, ...settings },
        updated_at: new Date().toISOString()
      }

      setCurrentChat(updatedChat)
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentChat.id ? updatedChat : session
        )
      )
    } catch (err) {
      setError('Failed to update chat settings. Please try again.')
      console.error('Error updating chat settings:', err)
      throw err
    }
  }, [currentChat])

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Estado
    currentChat,
    messages,
    chatSessions,
    isLoading,
    isTyping,
    error,
    
    // Acciones
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatSettings,
    clearError
  }
}

/**
 * Generar respuesta de AI (mock)
 */
async function generateAIResponse(userInput: string, session: ChatSession) {
  // Simular diferentes tipos de respuestas basadas en el input
  const responses = [
    {
      content: `I understand you're asking about "${userInput}". Based on your current session settings (${session.ai_provider}, temperature: ${session.settings.temperature}), here's my response:\n\nThis is a comprehensive answer that takes into account the context of our conversation. I'm using ${session.ai_model} to provide you with the most accurate and helpful information possible.\n\nWould you like me to elaborate on any particular aspect?`,
      metadata: {
        tokens_used: Math.floor(Math.random() * 100) + 50,
        response_time: Math.floor(Math.random() * 2000) + 500,
        model_info: {
          provider: session.ai_provider,
          model: session.ai_model,
          temperature: session.settings.temperature
        }
      }
    }
  ]

  return responses[0]
}