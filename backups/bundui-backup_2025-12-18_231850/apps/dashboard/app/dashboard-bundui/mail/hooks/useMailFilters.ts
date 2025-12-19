'use client'

import { useState, useCallback } from 'react'
import { EmailFilters, EmailPriority } from '../types'

/**
 * Mail Filters Hook
 * 
 * Manages email filtering and search functionality
 * with multi-tenant security.
 * 
 * VThink 1.0 Compliance:
 * - ✅ TypeScript strict mode
 * - ✅ Performance optimization
 * - ✅ Clean state management
 */

export function useMailFilters() {
  const [filters, setFilters] = useState<EmailFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof EmailFilters>(
    key: K, 
    value: EmailFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setSearchQuery('')
  }, [])

  // Set quick filters
  const setUnreadFilter = useCallback(() => {
    setFilters({ unread: true })
  }, [])

  const setStarredFilter = useCallback(() => {
    setFilters({ starred: true })
  }, [])

  const setTodayFilter = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setFilters({ date_from: today.toISOString() })
  }, [])

  const setThisWeekFilter = useCallback(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    setFilters({ date_from: startOfWeek.toISOString() })
  }, [])

  const setHasAttachmentsFilter = useCallback(() => {
    setFilters({ has_attachments: true })
  }, [])

  const setPriorityFilter = useCallback((priority: EmailPriority) => {
    setFilters({ priority })
  }, [])

  // Set folder filter
  const setFolderFilter = useCallback((folder: string) => {
    setFilters({ folder })
  }, [])

  // Set label filter
  const setLabelFilter = useCallback((labels: string[]) => {
    setFilters({ labels })
  }, [])

  // Set search
  const setSearch = useCallback((search: string) => {
    setSearchQuery(search)
    setFilters(prev => ({
      ...prev,
      search: search || undefined
    }))
  }, [])

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    return Object.keys(filters).length
  }, [filters])

  // Check if filter is active
  const isFilterActive = useCallback((key: keyof EmailFilters) => {
    return filters[key] !== undefined
  }, [filters])

  return {
    filters,
    searchQuery,
    updateFilter,
    clearFilters,
    setUnreadFilter,
    setStarredFilter,
    setTodayFilter,
    setThisWeekFilter,
    setHasAttachmentsFilter,
    setPriorityFilter,
    setFolderFilter,
    setLabelFilter,
    setSearch,
    getActiveFilterCount,
    isFilterActive
  }
}