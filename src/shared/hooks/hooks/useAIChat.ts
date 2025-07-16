// Hook principal para el sistema de chat con IA organizado por contextos

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useDepartmentalPermissions } from '@/shared/hooks/useDepartmentalPermissions';
import type { 
  ChatContext, 
  ChatConversation, 
  ChatMessage, 
  ChatState, 
  CommandResponse,
  ChatConfig 
} from '@/shared/types/chat';
import { CHAT_COMMANDS, DEFAULT_CHAT_CONFIG } from '@/shared/constants/chatCommands';

interface UseAIChatOptions {
  contextId?: string;
  conversationId?: string;
  autoLoad?: boolean;
}

export const useAIChat = (options: UseAIChatOptions = {}) => {
  const { user } = useAuth();
  const { hasPermission } = useDepartmentalPermissions();
  
  // Estado principal
  const [state, setState] = useState<ChatState>({
    selectedContext: options.contextId || null,
    currentConversation: options.conversationId || null,
    conversations: [],
    messages: [],
    isLoading: false,
    error: null
  });

  // Configuración del chat
  const [config, setConfig] = useState<ChatConfig>(DEFAULT_CHAT_CONFIG);
  
  // Referencias para streaming
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageQueueRef = useRef<ChatMessage[]>([]);

  // Verificar permisos
  const canUseAI = hasPermission('AI_CHAT');
  const canCreateContexts = hasPermission('CONTEXT_CREATE');
  const canExecuteCommands = hasPermission('COMMAND_EXECUTE');

  // ===== GESTIÓN DE CONTEXTOS =====

  const loadContexts = useCallback(async () => {
    if (!user?.company_id) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`/api/chat/contexts?company_id=${user.company_id}`);
      const contexts: ChatContext[] = await response.json();
      
      // Si no hay contexto seleccionado, seleccionar el primero
      if (!state.selectedContext && contexts.length > 0) {
        setState(prev => ({ 
          ...prev, 
          selectedContext: contexts[0].id,
          isLoading: false 
        }));
        
        // Cargar conversaciones del contexto seleccionado
        await loadConversations(contexts[0].id);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al cargar contextos',
        isLoading: false 
      }));
    }
  }, [user?.company_id, state.selectedContext]);

  const createContext = useCallback(async (contextData: Partial<ChatContext>) => {
    if (!user?.company_id || !canCreateContexts) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/chat/contexts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contextData,
          company_id: user.company_id,
          user_id: user.id
        })
      });
      
      const newContext: ChatContext = await response.json();
      
      // Recargar contextos
      await loadContexts();
      
      // Seleccionar el nuevo contexto
      setState(prev => ({ 
        ...prev, 
        selectedContext: newContext.id,
        isLoading: false 
      }));
      
      return newContext;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al crear contexto',
        isLoading: false 
      }));
    }
  }, [user?.company_id, user?.id, canCreateContexts]);

  const selectContext = useCallback(async (contextId: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedContext: contextId,
      currentConversation: null,
      messages: []
    }));
    
    await loadConversations(contextId);
  }, []);

  // ===== GESTIÓN DE CONVERSACIONES =====

  const loadConversations = useCallback(async (contextId: string) => {
    if (!contextId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`/api/chat/conversations?context_id=${contextId}`);
      const conversations: ChatConversation[] = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        conversations,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al cargar conversaciones',
        isLoading: false 
      }));
    }
  }, []);

  const createConversation = useCallback(async (title: string) => {
    if (!state.selectedContext) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context_id: state.selectedContext,
          title,
          user_id: user?.id
        })
      });
      
      const newConversation: ChatConversation = await response.json();
      
      // Agregar a la lista de conversaciones
      setState(prev => ({ 
        ...prev, 
        conversations: [newConversation, ...prev.conversations],
        currentConversation: newConversation.id,
        messages: [],
        isLoading: false 
      }));
      
      return newConversation;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al crear conversación',
        isLoading: false 
      }));
    }
  }, [state.selectedContext, user?.id]);

  const selectConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({ 
      ...prev, 
      currentConversation: conversationId,
      messages: []
    }));
    
    await loadMessages(conversationId);
  }, []);

  // ===== GESTIÓN DE MENSAJES =====

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`);
      const messages: ChatMessage[] = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        messages,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al cargar mensajes',
        isLoading: false 
      }));
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!state.currentConversation || !canUseAI) return;

    // Verificar si es un comando
    if (content.startsWith('/')) {
      return await executeCommand(content);
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Crear mensaje del usuario
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: state.currentConversation,
        role: 'user',
        content,
        metadata: {},
        created_at: new Date().toISOString()
      };

      // Agregar mensaje del usuario inmediatamente
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, userMessage],
        isLoading: false 
      }));

      // Enviar mensaje al servidor
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: state.currentConversation,
          content,
          config,
          context_id: state.selectedContext
        })
      });

      if (config.enableStreaming && response.body) {
        // Streaming de respuesta
        await handleStreamingResponse(response);
      } else {
        // Respuesta normal
        const assistantMessage: ChatMessage = await response.json();
        setState(prev => ({ 
          ...prev, 
          messages: [...prev.messages, assistantMessage]
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al enviar mensaje',
        isLoading: false 
      }));
    }
  }, [state.currentConversation, state.selectedContext, config, canUseAI]);

  // ===== STREAMING DE RESPUESTAS =====

  const handleStreamingResponse = useCallback(async (response: Response) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'message_chunk') {
              // Actualizar mensaje en tiempo real
              setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === data.message_id 
                    ? { ...msg, content: msg.content + data.chunk }
                    : msg
                )
              }));
            } else if (data.type === 'message_complete') {
              // Mensaje completo
              setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === data.message_id 
                    ? { ...msg, ...data.metadata }
                    : msg
                )
              }));
            }
          }
        }
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error en streaming de respuesta'
      }));
    }
  }, []);

  // ===== EJECUCIÓN DE COMANDOS =====

  const executeCommand = useCallback(async (command: string) => {
    if (!canExecuteCommands) {
      setState(prev => ({ 
        ...prev, 
        error: 'No tienes permisos para ejecutar comandos'
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/chat/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          context_id: state.selectedContext,
          conversation_id: state.currentConversation,
          user_id: user?.id
        })
      });

      const result: CommandResponse = await response.json();
      
      // Crear mensaje de comando
      const commandMessage: ChatMessage = {
        id: `cmd-${Date.now()}`,
        conversation_id: state.currentConversation!,
        role: 'command',
        content: result.content,
        metadata: result.metadata,
        created_at: new Date().toISOString()
      };

      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, commandMessage],
        isLoading: false 
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al ejecutar comando',
        isLoading: false 
      }));
    }
  }, [state.selectedContext, state.currentConversation, user?.id, canExecuteCommands]);

  // ===== CONFIGURACIÓN =====

  const updateConfig = useCallback((newConfig: Partial<ChatConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // ===== UTILIDADES =====

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearConversation = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      messages: [],
      currentConversation: null 
    }));
  }, []);

  // ===== EFECTOS =====

  useEffect(() => {
    if (options.autoLoad && user?.company_id) {
      loadContexts();
    }
  }, [options.autoLoad, user?.company_id, loadContexts]);

  useEffect(() => {
    if (state.selectedContext) {
      loadConversations(state.selectedContext);
    }
  }, [state.selectedContext, loadConversations]);

  useEffect(() => {
    if (state.currentConversation) {
      loadMessages(state.currentConversation);
    }
  }, [state.currentConversation, loadMessages]);

  // ===== RETORNO =====

  return {
    // Estado
    ...state,
    config,
    
    // Acciones de contexto
    loadContexts,
    createContext,
    selectContext,
    
    // Acciones de conversación
    loadConversations,
    createConversation,
    selectConversation,
    
    // Acciones de mensajes
    loadMessages,
    sendMessage,
    
    // Acciones de comandos
    executeCommand,
    
    // Configuración
    updateConfig,
    
    // Utilidades
    clearError,
    clearConversation,
    
    // Permisos
    canUseAI,
    canCreateContexts,
    canExecuteCommands,
    
    // Comandos disponibles
    availableCommands: Object.values(CHAT_COMMANDS)
  };
}; 