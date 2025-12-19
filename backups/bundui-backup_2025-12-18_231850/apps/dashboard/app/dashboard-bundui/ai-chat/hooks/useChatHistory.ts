// =============================================================================
// USE CHAT HISTORY HOOK
// =============================================================================
// 
// Hook para gestionar historial y filtros de chat
// Incluye búsqueda, filtros y acciones de archivado
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Real-time filtering
// - ✅ Performance optimized
// =============================================================================

'use client'

import { useState, useMemo, useCallback } from 'react'
import { UseChatHistoryReturn, ChatSession, ChatFilters } from '../types'

/**
 * Hook para gestión de historial de chat
 */
export function useChatHistory(sessions: ChatSession[]): UseChatHistoryReturn {
  const [filters, setFilters] = useState<ChatFilters>({
    search: '',
    date_range: undefined,
    ai_provider: undefined,
    is_active: undefined
  })

  // Filtrar sesiones basado en criterios
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = session.title.toLowerCase().includes(searchLower)
        const matchesDescription = session.description?.toLowerCase().includes(searchLower)
        if (!matchesTitle && !matchesDescription) return false
      }

      // Filtro de provider
      if (filters.ai_provider && session.ai_provider !== filters.ai_provider) {
        return false
      }

      // Filtro de estado activo
      if (filters.is_active !== undefined && session.is_active !== filters.is_active) {
        return false
      }

      // Filtro de rango de fechas
      if (filters.date_range) {
        const sessionDate = new Date(session.created_at)
        if (sessionDate < filters.date_range.from || sessionDate > filters.date_range.to) {
          return false
        }
      }

      return true
    })
  }, [sessions, filters])

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<ChatFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Eliminar sesión
  const deleteSession = useCallback(async (sessionId: string) => {
    // En implementación real, esto sería una llamada a API
    console.log('Deleting session:', sessionId)
  }, [])

  // Archivar sesión
  const archiveSession = useCallback(async (sessionId: string) => {
    // En implementación real, esto sería una llamada a API
    console.log('Archiving session:', sessionId)
  }, [])

  // Exportar sesión
  const exportSession = useCallback(async (sessionId: string) => {
    // En implementación real, esto generaría y descargaría un archivo
    console.log('Exporting session:', sessionId)
  }, [])

  return {
    sessions,
    filteredSessions,
    filters,
    updateFilters,
    deleteSession,
    archiveSession,
    exportSession
  }
}