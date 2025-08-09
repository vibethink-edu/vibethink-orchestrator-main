// =============================================================================
// MESSAGE PARSER
// =============================================================================
// 
// Parser para procesar y formatear mensajes de chat
// Incluye markdown, mentions, commands y formatting
//
// VThink 1.0 Compliance:
// - ✅ Security-first parsing
// - ✅ Type-safe
// - ✅ Performance optimized
// - ✅ Extensible
// =============================================================================

/**
 * Resultado del parsing de mensaje
 */
export interface ParsedMessage {
  content: string
  mentions: string[]
  commands: string[]
  metadata: {
    hasCode: boolean
    hasLinks: boolean
    hasMentions: boolean
    hasCommands: boolean
    wordCount: number
    estimatedTokens: number
  }
}

/**
 * Configuración del parser
 */
export interface ParserConfig {
  allowHtml: boolean
  allowCommands: boolean
  allowMentions: boolean
  maxLength: number
  sanitize: boolean
}

/**
 * Parser principal para mensajes
 */
export class MessageParser {
  private config: ParserConfig

  constructor(config: Partial<ParserConfig> = {}) {
    this.config = {
      allowHtml: false,
      allowCommands: true,
      allowMentions: true,
      maxLength: 10000,
      sanitize: true,
      ...config
    }
  }

  /**
   * Parsear mensaje completo
   */
  parse(content: string): ParsedMessage {
    let processedContent = content

    // Sanitizar si está habilitado
    if (this.config.sanitize) {
      processedContent = this.sanitize(processedContent)
    }

    // Truncar si excede la longitud máxima
    if (processedContent.length > this.config.maxLength) {
      processedContent = processedContent.substring(0, this.config.maxLength) + '...'
    }

    // Extraer elementos
    const mentions = this.extractMentions(processedContent)
    const commands = this.extractCommands(processedContent)

    // Generar metadata
    const metadata = this.generateMetadata(processedContent, mentions, commands)

    return {
      content: processedContent,
      mentions,
      commands,
      metadata
    }
  }

  /**
   * Sanitizar contenido
   */
  private sanitize(content: string): string {
    let sanitized = content

    // Remover HTML si no está permitido
    if (!this.config.allowHtml) {
      sanitized = sanitized.replace(/<[^>]*>/g, '')
    }

    // Escapar caracteres especiales
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')

    // Normalizar espacios en blanco
    sanitized = sanitized
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, '  ')
      .replace(/\u00A0/g, ' ') // Non-breaking space

    return sanitized.trim()
  }

  /**
   * Extraer menciones (@usuario)
   */
  private extractMentions(content: string): string[] {
    if (!this.config.allowMentions) return []

    const mentionRegex = /@([a-zA-Z0-9_]+)/g
    const matches = content.match(mentionRegex) || []
    
    return [...new Set(matches.map(match => match.substring(1)))] // Remover @ y deduplicar
  }

  /**
   * Extraer comandos (/comando)
   */
  private extractCommands(content: string): string[] {
    if (!this.config.allowCommands) return []

    const commandRegex = /\/([a-zA-Z0-9_]+)/g
    const matches = content.match(commandRegex) || []
    
    return [...new Set(matches.map(match => match.substring(1)))] // Remover / y deduplicar
  }

  /**
   * Generar metadata del mensaje
   */
  private generateMetadata(
    content: string, 
    mentions: string[], 
    commands: string[]
  ) {
    return {
      hasCode: this.hasCodeBlocks(content),
      hasLinks: this.hasLinks(content),
      hasMentions: mentions.length > 0,
      hasCommands: commands.length > 0,
      wordCount: this.countWords(content),
      estimatedTokens: this.estimateTokens(content)
    }
  }

  /**
   * Detectar bloques de código
   */
  private hasCodeBlocks(content: string): boolean {
    return /```[\s\S]*?```|`[^`]+`/.test(content)
  }

  /**
   * Detectar enlaces
   */
  private hasLinks(content: string): boolean {
    return /https?:\/\/[^\s]+/.test(content)
  }

  /**
   * Contar palabras
   */
  private countWords(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Estimar tokens
   */
  private estimateTokens(content: string): number {
    // Estimación simple: ~4 caracteres por token
    return Math.ceil(content.length / 4)
  }
}

/**
 * Formateador de mensajes para display
 */
export class MessageFormatter {
  /**
   * Formatear mensaje para mostrar en UI
   */
  static formatForDisplay(content: string): string {
    let formatted = content

    // Convertir markdown básico a HTML
    formatted = this.processMarkdown(formatted)
    
    // Resaltar código
    formatted = this.highlightCode(formatted)
    
    // Convertir enlaces
    formatted = this.linkify(formatted)

    return formatted
  }

  /**
   * Procesar markdown básico
   */
  private static processMarkdown(content: string): string {
    return content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code inline
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Headings
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Line breaks
      .replace(/\n/g, '<br>')
  }

  /**
   * Resaltar bloques de código
   */
  private static highlightCode(content: string): string {
    return content.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`
    })
  }

  /**
   * Convertir URLs en enlaces
   */
  private static linkify(content: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
  }

  /**
   * Formatear mensaje para export
   */
  static formatForExport(content: string, format: 'text' | 'markdown' | 'html'): string {
    switch (format) {
      case 'text':
        return this.stripFormatting(content)
      case 'markdown':
        return content // Ya está en markdown
      case 'html':
        return this.formatForDisplay(content)
      default:
        return content
    }
  }

  /**
   * Remover todo el formateo
   */
  private static stripFormatting(content: string): string {
    return content
      .replace(/<[^>]*>/g, '') // Remover HTML
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remover bold
      .replace(/\*(.*?)\*/g, '$1') // Remover italic
      .replace(/`(.*?)`/g, '$1') // Remover code
      .replace(/```[\s\S]*?```/g, '') // Remover code blocks
      .replace(/#{1,6}\s*/g, '') // Remover headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remover links
  }
}

/**
 * Utilidades para comandos de chat
 */
export class ChatCommands {
  private static commands: Record<string, (args: string[]) => string> = {
    help: () => 'Available commands: /help, /clear, /export, /settings',
    clear: () => 'Conversation cleared',
    export: (args) => `Exporting conversation in ${args[0] || 'text'} format`,
    settings: () => 'Opening settings panel',
    model: (args) => `Switching to model: ${args[0] || 'default'}`,
    temperature: (args) => `Setting temperature to: ${args[0] || '0.7'}`,
    system: (args) => `Setting system prompt: ${args.join(' ') || 'default'}`
  }

  /**
   * Ejecutar comando
   */
  static execute(command: string, args: string[] = []): string | null {
    const handler = this.commands[command.toLowerCase()]
    return handler ? handler(args) : null
  }

  /**
   * Obtener lista de comandos disponibles
   */
  static getAvailableCommands(): string[] {
    return Object.keys(this.commands)
  }

  /**
   * Verificar si un texto es un comando
   */
  static isCommand(text: string): boolean {
    if (!text.startsWith('/')) {
      return false
    }
    const commandName = text.substring(1).split(' ')[0].toLowerCase()
    return Object.prototype.hasOwnProperty.call(this.commands, commandName)
  }
}

/**
 * Instancia por defecto del parser
 */
export const defaultMessageParser = new MessageParser({
  allowHtml: false,
  allowCommands: true,
  allowMentions: true,
  maxLength: 10000,
  sanitize: true
})