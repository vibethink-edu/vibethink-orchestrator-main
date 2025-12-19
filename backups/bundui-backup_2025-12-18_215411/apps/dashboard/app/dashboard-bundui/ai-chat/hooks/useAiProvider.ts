// =============================================================================
// USE AI PROVIDER HOOK
// =============================================================================
// 
// Hook para gestionar providers de AI y modelos disponibles
// Incluye configuración, validación y cambio de providers
//
// VThink 1.0 Compliance:
// - ✅ Multi-provider support
// - ✅ Validation and error handling
// - ✅ Performance optimized
// =============================================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { UseAiProviderReturn, AIProvider, AIModel, AIProviderType } from '../types'

/**
 * Hook para gestión de AI providers
 */
export function useAiProvider(): UseAiProviderReturn {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [currentProvider, setCurrentProvider] = useState<AIProvider | null>(null)

  // Inicializar providers
  useEffect(() => {
    const mockProviders: AIProvider[] = [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT models for general AI assistance',
        available_models: [
          {
            id: 'gpt-4',
            name: 'GPT-4',
            description: 'Most capable model for complex tasks',
            max_tokens: 8192,
            supports_vision: true,
            supports_function_calling: true,
            cost_per_token: 0.00003
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            description: 'Fast and efficient for most tasks',
            max_tokens: 4096,
            supports_vision: false,
            supports_function_calling: true,
            cost_per_token: 0.000002
          }
        ],
        default_settings: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 4096
        },
        api_key_required: true,
        enabled: true
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Claude models for thoughtful AI assistance',
        available_models: [
          {
            id: 'claude-3-opus',
            name: 'Claude 3 Opus',
            description: 'Most powerful model for complex reasoning',
            max_tokens: 4096,
            supports_vision: true,
            supports_function_calling: false,
            cost_per_token: 0.000075
          },
          {
            id: 'claude-3-sonnet',
            name: 'Claude 3 Sonnet',
            description: 'Balanced performance and speed',
            max_tokens: 4096,
            supports_vision: true,
            supports_function_calling: false,
            cost_per_token: 0.000015
          }
        ],
        default_settings: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 8192
        },
        api_key_required: true,
        enabled: true
      },
      {
        id: 'google',
        name: 'Google',
        description: 'Gemini models for multimodal AI',
        available_models: [
          {
            id: 'gemini-pro',
            name: 'Gemini Pro',
            description: 'Advanced multimodal reasoning',
            max_tokens: 2048,
            supports_vision: true,
            supports_function_calling: true,
            cost_per_token: 0.000005
          }
        ],
        default_settings: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 4096
        },
        api_key_required: true,
        enabled: false // Disabled by default
      },
      {
        id: 'local',
        name: 'Local Models',
        description: 'Self-hosted models for privacy',
        available_models: [
          {
            id: 'llama-2-7b',
            name: 'Llama 2 7B',
            description: 'Open source model for general tasks',
            max_tokens: 2048,
            supports_vision: false,
            supports_function_calling: false,
            cost_per_token: 0
          }
        ],
        default_settings: {
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          context_length: 2048
        },
        api_key_required: false,
        enabled: false // Disabled by default
      }
    ]

    setProviders(mockProviders)
    setCurrentProvider(mockProviders[0]) // Default to OpenAI
  }, [])

  // Obtener modelos disponibles del provider actual
  const availableModels = currentProvider?.available_models || []

  // Cambiar provider
  const switchProvider = useCallback((providerId: AIProviderType) => {
    const provider = providers.find(p => p.id === providerId)
    if (provider && provider.enabled) {
      setCurrentProvider(provider)
    }
  }, [providers])

  // Validar API key
  const validateApiKey = useCallback(async (provider: AIProviderType, apiKey: string): Promise<boolean> => {
    // En implementación real, esto haría una llamada de validación
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular validación
      return apiKey.length > 10 // Mock validation
    } catch {
      return false
    }
  }, [])

  // Obtener estado del provider
  const getProviderStatus = useCallback((providerId: AIProviderType): 'active' | 'error' | 'disabled' => {
    const provider = providers.find(p => p.id === providerId)
    if (!provider) return 'disabled'
    if (!provider.enabled) return 'disabled'
    if (provider.id === currentProvider?.id) return 'active'
    return 'disabled'
  }, [providers, currentProvider])

  return {
    providers,
    currentProvider,
    availableModels,
    switchProvider,
    validateApiKey,
    getProviderStatus
  }
}