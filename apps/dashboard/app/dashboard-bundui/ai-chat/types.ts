// =============================================================================
// AI CHAT TYPES
// =============================================================================
// 
// Definiciones TypeScript para el sistema AI Chat completo
// Aplica patterns de multi-tenant security y database types
//

// - ✅ Multi-tenant ready
// - ✅ Type-safe
// - ✅ Database aligned
// - ✅ Role-based access
// =============================================================================

export interface ChatMessage {
  id: string
  chat_session_id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
  user_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
  user_id: string
  title: string
  description?: string
  ai_provider: AIProviderType
  ai_model: string
  settings: ChatSettings
  is_active: boolean
  created_at: string
  updated_at: string
  last_message_at?: string
}

export interface MessageAttachment {
  id: string
  filename: string
  file_type: string
  file_size: number
  url: string
  processed: boolean
}

export interface MessageMetadata {
  tokens_used?: number
  response_time?: number
  model_info?: {
    provider: AIProviderType
    model: string
    temperature: number
  }
  error?: string
}

export interface ChatSettings {
  temperature: number
  max_tokens: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  system_prompt?: string
  context_length: number
}

export type AIProviderType = 
  | 'openai'
  | 'anthropic'
  | 'local'
  | 'azure-openai'
  | 'google'

export interface AIProvider {
  id: AIProviderType
  name: string
  description: string
  available_models: AIModel[]
  default_settings: ChatSettings
  api_key_required: boolean
  enabled: boolean
}

export interface AIModel {
  id: string
  name: string
  description: string
  max_tokens: number
  supports_vision: boolean
  supports_function_calling: boolean
  cost_per_token: number
}

// Chat UI State Types
export interface ChatUIState {
  currentChatId: string | null
  sidebarOpen: boolean
  settingsOpen: boolean
  isLoading: boolean
  isTyping: boolean
  error: string | null
}

export interface ChatFilters {
  search: string
  date_range?: {
    from: Date
    to: Date
  }
  ai_provider?: AIProviderType
  is_active?: boolean
}

// API Response Types
export interface ChatResponse {
  success: boolean
  data?: any
  error?: string
  metadata?: {
    tokens_used: number
    response_time: number
  }
}

export interface StreamingResponse {
  chunk: string
  done: boolean
  error?: string
}

// Hook Return Types
export interface UseAiChatReturn {
  // State
  currentChat: ChatSession | null
  messages: ChatMessage[]
  chatSessions: ChatSession[]
  isLoading: boolean
  isTyping: boolean
  error: string | null
  
  // Actions
  sendMessage: (content: string, attachments?: File[]) => Promise<void>
  createNewChat: (title?: string, ai_provider?: AIProviderType) => Promise<ChatSession>
  selectChat: (chatId: string) => void
  deleteChat: (chatId: string) => Promise<void>
  updateChatSettings: (settings: Partial<ChatSettings>) => Promise<void>
  clearError: () => void
}

export interface UseChatHistoryReturn {
  sessions: ChatSession[]
  filteredSessions: ChatSession[]
  filters: ChatFilters
  updateFilters: (filters: Partial<ChatFilters>) => void
  deleteSession: (sessionId: string) => Promise<void>
  archiveSession: (sessionId: string) => Promise<void>
  exportSession: (sessionId: string) => Promise<void>
}

export interface UseAiProviderReturn {
  providers: AIProvider[]
  currentProvider: AIProvider | null
  availableModels: AIModel[]
  switchProvider: (providerId: AIProviderType) => void
  validateApiKey: (provider: AIProviderType, apiKey: string) => Promise<boolean>
  getProviderStatus: (providerId: AIProviderType) => 'active' | 'error' | 'disabled'
}

// Component Props Types
export interface ChatSidebarProps {
  sessions: ChatSession[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  filters: ChatFilters
  onFiltersChange: (filters: Partial<ChatFilters>) => void
}

export interface ChatHeaderProps {
  chat: ChatSession | null
  messagesCount: number
  onSettingsOpen: () => void
  onExport: () => void
  onShare: () => void
}

export interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
  isTyping: boolean
  onMessageEdit?: (messageId: string, content: string) => void
  onMessageDelete?: (messageId: string) => void
  onMessageCopy: (content: string) => void
}

export interface MessageBubbleProps {
  message: ChatMessage
  isUser: boolean
  onEdit?: (content: string) => void
  onDelete?: () => void
  onCopy?: () => void
}

export interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  allowAttachments?: boolean
}

export interface ChatSettingsProps {
  settings: ChatSettings
  provider: AIProvider
  availableModels: AIModel[]
  onSettingsChange: (settings: Partial<ChatSettings>) => void
  onProviderChange: (providerId: AIProviderType) => void
  onModelChange: (modelId: string) => void
}

export interface ModelSelectorProps {
  providers: AIProvider[]
  currentProvider: AIProvider | null
  currentModel: string
  onProviderChange: (providerId: AIProviderType) => void
  onModelChange: (modelId: string) => void
}

export interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  acceptedTypes: string[]
  maxFileSize: number
  maxFiles: number
  disabled?: boolean
}

// Error Types
export interface ChatError {
  code: string
  message: string
  details?: any
  timestamp: string
}

export type ChatErrorCode = 
  | 'NETWORK_ERROR'
  | 'API_KEY_INVALID'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONTEXT_TOO_LONG'
  | 'MODEL_UNAVAILABLE'
  | 'UNAUTHORIZED'
  | 'COMPANY_MISMATCH'
  | 'VALIDATION_ERROR'

// Storage Types
export interface ChatStorageItem {
  key: string
  value: any
  expires?: number
}

export interface ChatCache {
  sessions: Map<string, ChatSession>
  messages: Map<string, ChatMessage[]>
  lastUpdated: number
}