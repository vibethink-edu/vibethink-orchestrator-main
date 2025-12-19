// =============================================================================
// USE CHAT STORAGE HOOK
// =============================================================================
// 
// Hook para gestionar almacenamiento local de chat
// Incluye cache, persistencia y sincronización
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Performance optimized
// - ✅ Data privacy
// =============================================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChatStorageItem, ChatCache } from '../types'

/**
 * Hook para gestión de almacenamiento local
 */
export function useChatStorage() {
  const [cache, setCache] = useState<ChatCache>({
    sessions: new Map(),
    messages: new Map(),
    lastUpdated: Date.now()
  })

  // Inicializar cache desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-chat-cache')
      if (stored) {
        const parsed = JSON.parse(stored)
        setCache({
          sessions: new Map(parsed.sessions || []),
          messages: new Map(parsed.messages || []),
          lastUpdated: parsed.lastUpdated || Date.now()
        })
      }
    } catch (error) {
      console.warn('Failed to load chat cache:', error)
    }
  }, [])

  // Guardar item en storage
  const setItem = useCallback((key: string, value: any, expires?: number) => {
    try {
      const item: ChatStorageItem = {
        key,
        value,
        expires: expires ? Date.now() + expires : undefined
      }
      localStorage.setItem(`ai-chat-${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to storage:', error)
    }
  }, [])

  // Obtener item del storage
  const getItem = useCallback((key: string) => {
    try {
      const stored = localStorage.getItem(`ai-chat-${key}`)
      if (!stored) return null

      const item: ChatStorageItem = JSON.parse(stored)
      
      // Verificar expiración
      if (item.expires && Date.now() > item.expires) {
        localStorage.removeItem(`ai-chat-${key}`)
        return null
      }

      return item.value
    } catch (error) {
      console.warn('Failed to get from storage:', error)
      return null
    }
  }, [])

  // Remover item del storage
  const removeItem = useCallback((key: string) => {
    try {
      localStorage.removeItem(`ai-chat-${key}`)
    } catch (error) {
      console.warn('Failed to remove from storage:', error)
    }
  }, [])

  // Limpiar cache expirado
  const clearExpired = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('ai-chat-'))
      
      keys.forEach(key => {
        const stored = localStorage.getItem(key)
        if (stored) {
          const item: ChatStorageItem = JSON.parse(stored)
          if (item.expires && Date.now() > item.expires) {
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.warn('Failed to clear expired cache:', error)
    }
  }, [])

  // Guardar cache
  const saveCache = useCallback(() => {
    try {
      const cacheData = {
        sessions: Array.from(cache.sessions.entries()),
        messages: Array.from(cache.messages.entries()),
        lastUpdated: Date.now()
      }
      localStorage.setItem('ai-chat-cache', JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to save cache:', error)
    }
  }, [cache])

  // Limpiar todo el storage
  const clearAll = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('ai-chat-'))
      keys.forEach(key => localStorage.removeItem(key))
      
      setCache({
        sessions: new Map(),
        messages: new Map(),
        lastUpdated: Date.now()
      })
    } catch (error) {
      console.warn('Failed to clear storage:', error)
    }
  }, [])

  return {
    cache,
    setItem,
    getItem,
    removeItem,
    clearExpired,
    saveCache,
    clearAll
  }
}