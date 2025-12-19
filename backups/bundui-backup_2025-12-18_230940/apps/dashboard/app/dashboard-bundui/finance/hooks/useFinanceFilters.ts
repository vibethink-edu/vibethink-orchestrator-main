import { useState, useCallback } from 'react'
import { 
  FinanceFilters, 
  UseFinanceFiltersReturn, 
  Revenue, 
  Expense,
  DateRange 
} from '../types'

/**
 * Custom hook for managing finance data filters
 * 
 * Features:
 * - Filter state management
 * - Filter application to data
 * - Active filter detection
 * - Filter reset functionality
 * - Data filtering utilities
 * - Filter summary generation
 * 
 * Security: Works with any data that includes company_id (already filtered upstream)
 */
export const useFinanceFilters = (): UseFinanceFiltersReturn => {
  const [filters, setFilters] = useState<FinanceFilters>({
    searchQuery: '',
    category: 'all',
    dateRange: 'month',
    amountRange: { min: null, max: null },
    status: 'all',
    department: 'all',
    currency: 'all',
    tags: []
  })

  /**
   * Update a specific filter
   */
  const updateFilter = useCallback(<K extends keyof FinanceFilters>(
    key: K, 
    value: FinanceFilters[K]
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
    setFilters({
      searchQuery: '',
      category: 'all',
      dateRange: 'month',
      amountRange: { min: null, max: null },
      status: 'all',
      department: 'all',
      currency: 'all',
      tags: []
    })
  }, [])

  /**
   * Check if date falls within the selected range
   */
  const isDateInRange = useCallback((date: string, range: DateRange): boolean => {
    const itemDate = new Date(date)
    const now = new Date()
    
    switch (range) {
      case 'all':
        return true
      case 'today':
        return itemDate.toDateString() === now.toDateString()
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return itemDate >= weekAgo
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return itemDate >= monthAgo
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        return itemDate >= quarterAgo
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        return itemDate >= yearAgo
      case 'custom':
        // For custom range, additional logic would be needed with start/end dates
        return true
      default:
        return true
    }
  }, [])

  /**
   * Check if amount falls within the selected range
   */
  const isAmountInRange = useCallback((amount: number, range: { min: number | null, max: number | null }): boolean => {
    if (range.min !== null && amount < range.min) return false
    if (range.max !== null && amount > range.max) return false
    return true
  }, [])

  /**
   * Check if item matches search query
   */
  const matchesSearchQuery = useCallback((item: Revenue | Expense, query: string): boolean => {
    if (!query) return true
    
    const searchFields = [
      item.description,
      'vendor' in item ? item.vendor : '',
      'source' in item ? item.source : '',
      'customer_name' in item ? item.customer_name || '' : '',
      item.category,
      item.status
    ].filter(Boolean)
    
    const searchText = searchFields.join(' ').toLowerCase()
    return searchText.includes(query.toLowerCase())
  }, [])

  /**
   * Filter revenues based on current filters
   */
  const filterRevenues = useCallback((revenues: Revenue[]): Revenue[] => {
    return revenues.filter(revenue => {
      // Search query
      if (!matchesSearchQuery(revenue, filters.searchQuery)) return false
      
      // Category filter
      if (filters.category !== 'all' && revenue.category !== filters.category) return false
      
      // Date range filter
      if (!isDateInRange(revenue.date, filters.dateRange)) return false
      
      // Amount range filter
      if (!isAmountInRange(revenue.amount, filters.amountRange)) return false
      
      // Status filter
      if (filters.status !== 'all' && revenue.status !== filters.status) return false
      
      // Currency filter
      if (filters.currency !== 'all' && revenue.currency !== filters.currency) return false
      
      return true
    })
  }, [filters, matchesSearchQuery, isDateInRange, isAmountInRange])

  /**
   * Filter expenses based on current filters
   */
  const filterExpenses = useCallback((expenses: Expense[]): Expense[] => {
    return expenses.filter(expense => {
      // Search query
      if (!matchesSearchQuery(expense, filters.searchQuery)) return false
      
      // Category filter
      if (filters.category !== 'all' && expense.category !== filters.category) return false
      
      // Date range filter
      if (!isDateInRange(expense.date, filters.dateRange)) return false
      
      // Amount range filter
      if (!isAmountInRange(expense.amount, filters.amountRange)) return false
      
      // Status filter
      if (filters.status !== 'all' && expense.status !== filters.status) return false
      
      // Department filter
      if (filters.department !== 'all' && expense.department !== filters.department) return false
      
      // Currency filter
      if (filters.currency !== 'all' && expense.currency !== filters.currency) return false
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const expenseTags = expense.tags || []
        const hasMatchingTag = filters.tags.some(tag => expenseTags.includes(tag))
        if (!hasMatchingTag) return false
      }
      
      return true
    })
  }, [filters, matchesSearchQuery, isDateInRange, isAmountInRange])

  /**
   * Check if any filters are currently active
   */
  const hasActiveFilters = useCallback((): boolean => {
    return !!(
      filters.searchQuery ||
      filters.category !== 'all' ||
      filters.dateRange !== 'month' ||
      filters.amountRange.min !== null ||
      filters.amountRange.max !== null ||
      filters.status !== 'all' ||
      filters.department !== 'all' ||
      filters.currency !== 'all' ||
      (filters.tags && filters.tags.length > 0)
    )
  }, [filters])

  /**
   * Generate a summary of active filters
   */
  const getFilterSummary = useCallback((): string[] => {
    const summary: string[] = []
    
    if (filters.searchQuery) {
      summary.push(`Search: "${filters.searchQuery}"`)
    }
    
    if (filters.category !== 'all') {
      summary.push(`Category: ${filters.category}`)
    }
    
    if (filters.dateRange !== 'month') {
      const rangeLabels = {
        all: 'All Time',
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year',
        custom: 'Custom Range'
      }
      summary.push(`Date: ${rangeLabels[filters.dateRange]}`)
    }
    
    if (filters.amountRange.min !== null || filters.amountRange.max !== null) {
      const min = filters.amountRange.min ? `$${filters.amountRange.min.toLocaleString()}` : '0'
      const max = filters.amountRange.max ? `$${filters.amountRange.max.toLocaleString()}` : '∞'
      summary.push(`Amount: ${min} - ${max}`)
    }
    
    if (filters.status !== 'all') {
      summary.push(`Status: ${filters.status}`)
    }
    
    if (filters.department !== 'all') {
      summary.push(`Department: ${filters.department}`)
    }
    
    if (filters.currency !== 'all') {
      summary.push(`Currency: ${filters.currency}`)
    }
    
    if (filters.tags && filters.tags.length > 0) {
      summary.push(`Tags: ${filters.tags.join(', ')}`)
    }
    
    return summary
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    filterRevenues,
    filterExpenses,
    hasActiveFilters: hasActiveFilters(),
    getFilterSummary
  }
}