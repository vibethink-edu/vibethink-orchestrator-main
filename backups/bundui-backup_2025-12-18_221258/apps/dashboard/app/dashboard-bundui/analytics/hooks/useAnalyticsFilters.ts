'use client'

import { useState, useCallback } from 'react'
import { subDays, startOfMonth, endOfMonth, format } from 'date-fns'
import {
  AnalyticsFilters,
  AnalyticsDateRange,
  UseAnalyticsFiltersReturn
} from '../types'

/**
 * Custom hook for managing analytics filters and date ranges
 * 
 * Features:
 * - Date range management with presets
 * - Filter state management
 * - URL-based filter persistence
 * - Reset functionality
 * 
 * Used by analytics components to filter data
 */
export const useAnalyticsFilters = (): UseAnalyticsFiltersReturn => {
  // Default date range: last 30 days
  const defaultDateRange: AnalyticsDateRange = {
    from: subDays(new Date(), 30),
    to: new Date()
  }

  // Default filters
  const defaultFilters: AnalyticsFilters = {
    dateRange: defaultDateRange,
    period: 'day'
  }

  const [filters, setFiltersState] = useState<AnalyticsFilters>(defaultFilters)

  /**
   * Update filters with partial updates
   */
  const setFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  /**
   * Reset all filters to default values
   */
  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters)
  }, [])

  /**
   * Apply a specific date range
   */
  const applyDateRange = useCallback((range: AnalyticsDateRange) => {
    setFiltersState(prev => ({
      ...prev,
      dateRange: range
    }))
  }, [])

  /**
   * Preset date ranges for quick selection
   */
  const applyPresetRange = useCallback((preset: string) => {
    const now = new Date()
    let dateRange: AnalyticsDateRange

    switch (preset) {
      case 'today':
        dateRange = {
          from: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          to: now
        }
        break
      
      case 'yesterday':
        const yesterday = subDays(now, 1)
        dateRange = {
          from: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          to: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
        }
        break
      
      case 'last7days':
        dateRange = {
          from: subDays(now, 7),
          to: now
        }
        break
      
      case 'last30days':
        dateRange = {
          from: subDays(now, 30),
          to: now
        }
        break
      
      case 'last90days':
        dateRange = {
          from: subDays(now, 90),
          to: now
        }
        break
      
      case 'thisMonth':
        dateRange = {
          from: startOfMonth(now),
          to: now
        }
        break
      
      case 'lastMonth':
        const lastMonth = subDays(startOfMonth(now), 1)
        dateRange = {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        }
        break
      
      case 'thisYear':
        dateRange = {
          from: new Date(now.getFullYear(), 0, 1),
          to: now
        }
        break
      
      case 'lastYear':
        dateRange = {
          from: new Date(now.getFullYear() - 1, 0, 1),
          to: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
        }
        break
      
      default:
        dateRange = defaultDateRange
    }

    applyDateRange(dateRange)
  }, [applyDateRange])

  /**
   * Get formatted date range string for display
   */
  const getDateRangeLabel = useCallback(() => {
    const { from, to } = filters.dateRange
    // Use date-fns format like bundui-reference for consistency
    const fromStr = format(from, "dd MMM yyyy")
    const toStr = format(to, "dd MMM yyyy")
    
    if (fromStr === toStr) {
      return fromStr
    }
    
    return `${fromStr} - ${toStr}`
  }, [filters.dateRange])

  /**
   * Check if current filters are default
   */
  const isDefaultFilters = useCallback(() => {
    return (
      filters.dateRange.from.getTime() === defaultDateRange.from.getTime() &&
      filters.dateRange.to.getTime() === defaultDateRange.to.getTime() &&
      !filters.country &&
      !filters.campaign &&
      !filters.channel &&
      filters.period === 'day'
    )
  }, [filters])

  return {
    filters,
    setFilters,
    resetFilters,
    applyDateRange,
    applyPresetRange,
    getDateRangeLabel,
    isDefaultFilters
  }
}

/**
 * Extended hook with URL persistence
 * TODO: Implement URL-based filter persistence for bookmarkable analytics views
 */
export const useAnalyticsFiltersWithUrl = (): UseAnalyticsFiltersReturn & {
  updateUrl: () => void
  loadFromUrl: () => void
} => {
  const baseHook = useAnalyticsFilters()

  const updateUrl = useCallback(() => {
    // TODO: Implement URL parameter updates
    // This would allow users to bookmark specific filter states
    console.log('URL update not implemented yet')
  }, [])

  const loadFromUrl = useCallback(() => {
    // TODO: Implement URL parameter reading
    // This would restore filter state from URL on page load
    console.log('URL loading not implemented yet')
  }, [])

  return {
    ...baseHook,
    updateUrl,
    loadFromUrl
  }
}