// =============================================================================
// CHAT UTILITIES
// =============================================================================
// 
// Utilidades para manejo de chat, formateo y validación
// Funciones helper para el sistema AI Chat
//

// - ✅ Multi-tenant security
// - ✅ Data validation
// - ✅ Performance optimized
// - ✅ Type-safe
// =============================================================================

import { ChatMessage, ChatSession, MessageAttachment, ChatError, ChatErrorCode } from '../types'

/**
 * Generar ID único para mensajes y sesiones
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Validar mensaje antes del envío
 */
export function validateMessage(content: string, attachments?: File[]): string | null {
  // Verificar contenido
  if (!content.trim() && (!attachments || attachments.length === 0)) {
    return 'Message cannot be empty'
  }

  // Verificar longitud del mensaje
  if (content.length > 10000) {
    return 'Message is too long (maximum 10,000 characters)'
  }

  // Verificar archivos adjuntos
  if (attachments && attachments.length > 0) {
    if (attachments.length > 5) {
      return 'Too many attachments (maximum 5 files)'
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    for (const file of attachments) {
      if (file.size > maxSize) {
        return `File "${file.name}" is too large (maximum 10MB)`
      }
    }
  }

  return null
}

/**
 * Formatear tamaño de archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Calcular tokens aproximados de un texto
 */
export function estimateTokenCount(text: string): number {
  // Estimación simple: ~4 caracteres por token en inglés
  // Para mayor precisión, usar una librería específica
  return Math.ceil(text.length / 4)
}

/**
 * Truncar mensaje para contexto
 */
export function truncateMessage(content: string, maxTokens: number): string {
  const estimatedTokens = estimateTokenCount(content)
  
  if (estimatedTokens <= maxTokens) {
    return content
  }

  // Truncar manteniendo aproximadamente el número de tokens deseado
  const maxChars = maxTokens * 4
  const truncated = content.substring(0, maxChars)
  
  // Intentar cortar en una palabra completa
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > maxChars * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Construir contexto de conversación
 */
export function buildConversationContext(
  messages: ChatMessage[], 
  maxTokens: number = 4096
): string {
  if (messages.length === 0) return ''

  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  let context = ''
  let tokenCount = 0

  // Agregar mensajes desde el más reciente hasta el límite de tokens
  for (let i = sortedMessages.length - 1; i >= 0; i--) {
    const message = sortedMessages[i]
    const messageTokens = estimateTokenCount(message.content)
    
    if (tokenCount + messageTokens > maxTokens) {
      break
    }

    const rolePrefix = message.role === 'user' ? 'User: ' : 'Assistant: '
    const messageText = rolePrefix + message.content + '\n\n'
    
    context = messageText + context
    tokenCount += messageTokens
  }

  return context.trim()
}

/**
 * Extraer menciones y comandos del mensaje
 */
export function parseMessage(content: string): {
  mentions: string[]
  commands: string[]
  cleanContent: string
} {
  const mentions = content.match(/@[\w]+/g) || []
  const commands = content.match(/\/[\w]+/g) || []
  
  // Remover menciones y comandos del contenido
  let cleanContent = content
    .replace(/@[\w]+/g, '')
    .replace(/\/[\w]+/g, '')
    .trim()

  return {
    mentions,
    commands,
    cleanContent
  }
}

/**
 * Validar configuración de chat
 */
export function validateChatSettings(settings: any): string[] {
  const errors: string[] = []

  if (typeof settings.temperature !== 'number' || settings.temperature < 0 || settings.temperature > 2) {
    errors.push('Temperature must be between 0 and 2')
  }

  if (typeof settings.max_tokens !== 'number' || settings.max_tokens < 1 || settings.max_tokens > 8192) {
    errors.push('Max tokens must be between 1 and 8192')
  }

  if (typeof settings.top_p !== 'number' || settings.top_p < 0 || settings.top_p > 1) {
    errors.push('Top P must be between 0 and 1')
  }

  return errors
}

/**
 * Crear error de chat tipado
 */
export function createChatError(
  code: ChatErrorCode,
  message: string,
  details?: any
): ChatError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  }
}

/**
 * Sanitizar entrada de usuario
 */
export function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(/\r\n/g, '\n') // Normalizar saltos de línea
    .replace(/\t/g, '  ') // Convertir tabs a espacios
    .substring(0, 10000) // Limitar longitud
}

/**
 * Generar título automático para chat
 */
export function generateChatTitle(firstMessage: string): string {
  const cleaned = sanitizeUserInput(firstMessage)
  const words = cleaned.split(' ').slice(0, 6) // Primeras 6 palabras
  let title = words.join(' ')
  
  if (title.length > 50) {
    title = title.substring(0, 47) + '...'
  }
  
  return title || 'New Chat'
}

/**
 * Exportar conversación a formato texto
 */
export function exportChatToText(
  session: ChatSession,
  messages: ChatMessage[]
): string {
  const header = `# ${session.title}\n\n`
  const metadata = `**Created:** ${new Date(session.created_at).toLocaleString()}\n`
  const providerInfo = `**AI Provider:** ${session.ai_provider} (${session.ai_model})\n\n`
  
  const messagesText = messages
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(message => {
      const timestamp = new Date(message.created_at).toLocaleString()
      const role = message.role === 'user' ? 'You' : 'AI Assistant'
      
      let text = `## ${role} - ${timestamp}\n\n${message.content}\n\n`
      
      if (message.attachments && message.attachments.length > 0) {
        text += '**Attachments:**\n'
        message.attachments.forEach(att => {
          text += `- ${att.filename} (${formatFileSize(att.file_size)})\n`
        })
        text += '\n'
      }
      
      return text
    })
    .join('---\n\n')
  
  return header + metadata + providerInfo + messagesText
}

/**
 * Exportar conversación a formato JSON
 */
export function exportChatToJSON(
  session: ChatSession,
  messages: ChatMessage[]
): string {
  const exportData = {
    session: {
      ...session,
      exported_at: new Date().toISOString()
    },
    messages: messages.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
    metadata: {
      total_messages: messages.length,
      export_version: '1.0'
    }
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Verificar si un mensaje es reciente
 */
export function isRecentMessage(message: ChatMessage, minutes: number = 5): boolean {
  const messageTime = new Date(message.created_at).getTime()
  const now = Date.now()
  const diffMinutes = (now - messageTime) / (1000 * 60)
  
  return diffMinutes <= minutes
}

/**
 * Agrupar mensajes por fecha
 */
export function groupMessagesByDate(messages: ChatMessage[]): Record<string, ChatMessage[]> {
  const groups: Record<string, ChatMessage[]> = {}
  
  messages.forEach(message => {
    const date = new Date(message.created_at).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
  })
  
  return groups
}

/**
 * Calcular estadísticas de conversación
 */
export function calculateChatStats(messages: ChatMessage[]) {
  const userMessages = messages.filter(m => m.role === 'user')
  const aiMessages = messages.filter(m => m.role === 'assistant')
  
  const totalTokens = messages.reduce((sum, m) => 
    sum + (m.metadata?.tokens_used || 0), 0
  )
  
  const avgResponseTime = aiMessages.length > 0
    ? aiMessages.reduce((sum, m) => sum + (m.metadata?.response_time || 0), 0) / aiMessages.length
    : 0
  
  return {
    total_messages: messages.length,
    user_messages: userMessages.length,
    ai_messages: aiMessages.length,
    total_tokens: totalTokens,
    avg_response_time: Math.round(avgResponseTime),
    conversation_duration: messages.length > 1
      ? new Date(messages[messages.length - 1].created_at).getTime() - 
        new Date(messages[0].created_at).getTime()
      : 0
  }
}