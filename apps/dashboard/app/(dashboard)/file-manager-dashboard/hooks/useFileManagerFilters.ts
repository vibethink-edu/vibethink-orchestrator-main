/**
 * useFileManagerFilters Hook
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Filter management hook for file manager with advanced filtering capabilities
 * Following VThink 1.0 methodology with type safety and performance optimization
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import type { FileManagerFilters, UseFileManagerFilters, FileItem } from '../types'

const initialFilters: FileManagerFilters = {
  search: '',
  type: 'all',
  date_range: {
    from: null,
    to: null
  },
  size_range: {
    min: null,
    max: null
  },
  tags: [],
  shared_only: false,
  favorites_only: false,
  sort_by: 'modified',
  sort_order: 'desc'
}

export function useFileManagerFilters(): UseFileManagerFilters {
  const [filters, setFilters] = useState<FileManagerFilters>(initialFilters)

  const updateFilter = useCallback((key: keyof FileManagerFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.type !== 'all' ||
      filters.date_range.from !== null ||
      filters.date_range.to !== null ||
      filters.size_range.min !== null ||
      filters.size_range.max !== null ||
      filters.tags.length > 0 ||
      filters.shared_only ||
      filters.favorites_only ||
      filters.sort_by !== 'modified' ||
      filters.sort_order !== 'desc'
    )
  }, [filters])

  const applyFilters = useCallback((items: FileItem[]): FileItem[] => {
    let filteredItems = [...items]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'files') {
        filteredItems = filteredItems.filter(item => item.type === 'file')
      } else if (filters.type === 'folders') {
        filteredItems = filteredItems.filter(item => item.type === 'folder')
      }
    }

    // Date range filter
    if (filters.date_range.from || filters.date_range.to) {
      filteredItems = filteredItems.filter(item => {
        const itemDate = new Date(item.modified_at)
        
        if (filters.date_range.from && itemDate < filters.date_range.from) {
          return false
        }
        
        if (filters.date_range.to && itemDate > filters.date_range.to) {
          return false
        }
        
        return true
      })
    }

    // Size range filter (only for files)
    if ((filters.size_range.min !== null || filters.size_range.max !== null) && filters.type !== 'folders') {
      filteredItems = filteredItems.filter(item => {
        if (item.type === 'folder') return true // Always include folders if not filtered out
        
        if (filters.size_range.min !== null && item.size < filters.size_range.min) {
          return false
        }
        
        if (filters.size_range.max !== null && item.size > filters.size_range.max) {
          return false
        }
        
        return true
      })
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filteredItems = filteredItems.filter(item =>
        filters.tags.some(tag => item.tags.includes(tag))
      )
    }

    // Shared only filter
    if (filters.shared_only) {
      filteredItems = filteredItems.filter(item => item.is_shared)
    }

    // Favorites only filter
    if (filters.favorites_only) {
      filteredItems = filteredItems.filter(item => item.is_favorite)
    }

    // Sorting
    filteredItems.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sort_by) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'size':
          aValue = a.size
          bValue = b.size
          break
        case 'modified':
          aValue = new Date(a.modified_at).getTime()
          bValue = new Date(b.modified_at).getTime()
          break
        case 'created':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          aValue = new Date(a.modified_at).getTime()
          bValue = new Date(b.modified_at).getTime()
      }

      if (filters.sort_order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filteredItems
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
    hasActiveFilters
  }
}