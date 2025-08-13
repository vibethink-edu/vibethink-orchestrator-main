import { useState, useCallback, useMemo } from 'react'
import { 
  SalesFilters, 
  Sale, 
  UseSalesFiltersReturn,
  SaleStage,
  SalesSource,
  DateRange
} from '../types'

/**
 * Default filter values
 */
const defaultFilters: SalesFilters = {
  searchQuery: '',
  salesRep: 'all',
  stage: 'all',
  dateRange: 'all',
  amountRange: {
    min: null,
    max: null
  },
  source: 'all',
  probability: {
    min: 0,
    max: 100
  },
  tags: []
}

/**
 * Custom hook for managing sales filters and data filtering
 * 
 * Features:
 * - Comprehensive filtering system
 * - Real-time filter application
 * - Filter state management
 * - Active filter tracking
 * - Filter summary generation
 * - Reset functionality
 */
export const useSalesFilters = (): UseSalesFiltersReturn => {
  const [filters, setFilters] = useState<SalesFilters>(defaultFilters)

  /**
   * Update a specific filter
   */
  const updateFilter = useCallback(<K extends keyof SalesFilters>(
    key: K, 
    value: SalesFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  /**
   * Reset all filters to default values
   */
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  /**
   * Check if any filters are active (different from defaults)
   */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.salesRep !== 'all' ||
      filters.stage !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.amountRange.min !== null ||
      filters.amountRange.max !== null ||
      filters.source !== 'all' ||
      filters.probability.min !== 0 ||
      filters.probability.max !== 100 ||
      (filters.tags && filters.tags.length > 0)
    )
  }, [filters])

  /**
   * Generate human-readable filter summary
   */
  const getFilterSummary = useCallback((): string[] => {
    const summary: string[] = []

    if (filters.searchQuery) {
      summary.push(`Search: "${filters.searchQuery}"`)
    }

    if (filters.salesRep !== 'all') {
      summary.push(`Rep: ${filters.salesRep}`)
    }

    if (filters.stage !== 'all') {
      summary.push(`Stage: ${filters.stage}`)
    }

    if (filters.dateRange !== 'all') {
      summary.push(`Period: ${filters.dateRange}`)
    }

    if (filters.amountRange.min !== null || filters.amountRange.max !== null) {
      const min = filters.amountRange.min ? `$${filters.amountRange.min.toLocaleString()}` : ''
      const max = filters.amountRange.max ? `$${filters.amountRange.max.toLocaleString()}` : ''
      if (min && max) {
        summary.push(`Amount: ${min} - ${max}`)
      } else if (min) {
        summary.push(`Amount: ${min}+`)
      } else if (max) {
        summary.push(`Amount: up to ${max}`)
      }
    }

    if (filters.source !== 'all') {
      summary.push(`Source: ${filters.source}`)
    }

    if (filters.probability.min !== 0 || filters.probability.max !== 100) {
      summary.push(`Probability: ${filters.probability.min}% - ${filters.probability.max}%`)
    }

    if (filters.tags && filters.tags.length > 0) {
      summary.push(`Tags: ${filters.tags.join(', ')}`)
    }

    return summary
  }, [filters])

  /**
   * Check if a date falls within the specified date range
   */
  const isDateInRange = useCallback((dateString: string, range: DateRange): boolean => {
    if (range === 'all') return true

    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (range) {
      case 'today':
        const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        return itemDate.getTime() === today.getTime()

      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return date >= weekStart && date <= weekEnd

      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        return date >= monthStart && date <= monthEnd

      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
        const quarterEnd = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0)
        return date >= quarterStart && date <= quarterEnd

      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1)
        const yearEnd = new Date(today.getFullYear(), 11, 31)
        return date >= yearStart && date <= yearEnd

      case 'custom':
        // For custom date ranges, you would need additional date picker inputs
        // This is a placeholder for custom date range logic
        return true

      default:
        return true
    }
  }, [])

  /**
   * Check if text matches search query
   */
  const matchesSearchQuery = useCallback((sale: Sale, query: string): boolean => {
    if (!query) return true

    const searchText = query.toLowerCase()
    return (
      sale.title.toLowerCase().includes(searchText) ||
      sale.customer_name.toLowerCase().includes(searchText) ||
      sale.customer_email.toLowerCase().includes(searchText) ||
      (sale.customer_company && sale.customer_company.toLowerCase().includes(searchText)) ||
      sale.sales_rep_name.toLowerCase().includes(searchText) ||
      (sale.description && sale.description.toLowerCase().includes(searchText)) ||
      (sale.tags && sale.tags.some(tag => tag.toLowerCase().includes(searchText)))
    )
  }, [])

  /**
   * Check if amount falls within specified range
   */
  const isAmountInRange = useCallback((amount: number, range: { min: number | null, max: number | null }): boolean => {
    if (range.min !== null && amount < range.min) return false
    if (range.max !== null && amount > range.max) return false
    return true
  }, [])

  /**
   * Check if probability falls within specified range
   */
  const isProbabilityInRange = useCallback((probability: number, range: { min: number, max: number }): boolean => {
    return probability >= range.min && probability <= range.max
  }, [])

  /**
   * Check if tags match filter
   */
  const matchesTags = useCallback((saleTags: string[] | undefined, filterTags: string[] | undefined): boolean => {
    if (!filterTags || filterTags.length === 0) return true
    if (!saleTags || saleTags.length === 0) return false
    
    return filterTags.some(tag => saleTags.includes(tag))
  }, [])

  /**
   * Filter sales data based on current filters
   */
  const filterSales = useCallback((sales: Sale[]): Sale[] => {
    return sales.filter(sale => {
      // Search query filter
      if (!matchesSearchQuery(sale, filters.searchQuery)) {
        return false
      }

      // Sales rep filter
      if (filters.salesRep !== 'all' && sale.sales_rep_id !== filters.salesRep) {
        return false
      }

      // Stage filter
      if (filters.stage !== 'all' && sale.stage !== filters.stage) {
        return false
      }

      // Date range filter (using close_date)
      if (!isDateInRange(sale.close_date, filters.dateRange)) {
        return false
      }

      // Amount range filter
      if (!isAmountInRange(sale.amount, filters.amountRange)) {
        return false
      }

      // Source filter
      if (filters.source !== 'all' && sale.source !== filters.source) {
        return false
      }

      // Probability filter
      if (!isProbabilityInRange(sale.probability, filters.probability)) {
        return false
      }

      // Tags filter
      if (!matchesTags(sale.tags, filters.tags)) {
        return false
      }

      return true
    })
  }, [
    filters,
    matchesSearchQuery,
    isDateInRange,
    isAmountInRange,
    isProbabilityInRange,
    matchesTags
  ])

  return {
    filters,
    updateFilter,
    resetFilters,
    filterSales,
    hasActiveFilters,
    getFilterSummary
  }
}