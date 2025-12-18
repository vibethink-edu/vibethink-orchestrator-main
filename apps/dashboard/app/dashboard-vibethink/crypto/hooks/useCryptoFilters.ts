import { useState, useCallback, useMemo } from 'react'
import { CryptoHolding, CryptoTransaction, UseCryptoFiltersReturn } from '../types'

/**
 * Custom hook for managing crypto dashboard filters
 * 
 * Features:
 * - Portfolio filtering by multiple criteria
 * - Transaction filtering and search
 * - Date range filtering
 * - Multi-select crypto symbols and platforms
 * - Profit/loss filtering
 * - Value range filtering
 * 
 * VThink 1.0 Compliance:
 * - Typed filter state management
 * - Memoized filter functions for performance
 * - Consistent filter patterns across the app
 */
export const useCryptoFilters = (): UseCryptoFiltersReturn => {
  // Filter state
  const [filters, setFilters] = useState({
    crypto_symbols: [] as string[],
    platforms: [] as string[],
    date_range: {
      start: '',
      end: ''
    },
    transaction_types: [] as string[],
    min_value: 0,
    max_value: 0,
    profit_loss_filter: 'all' as 'all' | 'profit' | 'loss'
  })

  /**
   * Update a specific filter
   */
  const updateFilter = useCallback(<K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
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
      crypto_symbols: [],
      platforms: [],
      date_range: {
        start: '',
        end: ''
      },
      transaction_types: [],
      min_value: 0,
      max_value: 0,
      profit_loss_filter: 'all'
    })
  }, [])

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.crypto_symbols.length > 0 ||
      filters.platforms.length > 0 ||
      filters.date_range.start !== '' ||
      filters.date_range.end !== '' ||
      filters.transaction_types.length > 0 ||
      filters.min_value > 0 ||
      filters.max_value > 0 ||
      filters.profit_loss_filter !== 'all'
    )
  }, [filters])

  /**
   * Filter holdings based on current filter state
   */
  const filterHoldings = useCallback((holdings: CryptoHolding[]): CryptoHolding[] => {
    return holdings.filter(holding => {
      // Filter by crypto symbols
      if (filters.crypto_symbols.length > 0) {
        if (!filters.crypto_symbols.includes(holding.symbol)) {
          return false
        }
      }

      // Filter by platforms
      if (filters.platforms.length > 0) {
        if (!filters.platforms.includes(holding.platform)) {
          return false
        }
      }

      // Filter by value range
      if (filters.min_value > 0 && holding.total_value < filters.min_value) {
        return false
      }

      if (filters.max_value > 0 && holding.total_value > filters.max_value) {
        return false
      }

      // Filter by profit/loss
      if (filters.profit_loss_filter === 'profit' && holding.profit_loss <= 0) {
        return false
      }

      if (filters.profit_loss_filter === 'loss' && holding.profit_loss >= 0) {
        return false
      }

      // Filter by date range (creation date)
      if (filters.date_range.start) {
        const startDate = new Date(filters.date_range.start)
        const holdingDate = new Date(holding.created_at)
        if (holdingDate < startDate) {
          return false
        }
      }

      if (filters.date_range.end) {
        const endDate = new Date(filters.date_range.end)
        const holdingDate = new Date(holding.created_at)
        if (holdingDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [filters])

  /**
   * Filter transactions based on current filter state
   */
  const filterTransactions = useCallback((transactions: CryptoTransaction[]): CryptoTransaction[] => {
    return transactions.filter(transaction => {
      // Filter by crypto symbols
      if (filters.crypto_symbols.length > 0) {
        if (!filters.crypto_symbols.includes(transaction.symbol)) {
          return false
        }
      }

      // Filter by platforms
      if (filters.platforms.length > 0) {
        if (!filters.platforms.includes(transaction.platform)) {
          return false
        }
      }

      // Filter by transaction types
      if (filters.transaction_types.length > 0) {
        if (!filters.transaction_types.includes(transaction.type)) {
          return false
        }
      }

      // Filter by value range
      if (filters.min_value > 0 && transaction.total_value < filters.min_value) {
        return false
      }

      if (filters.max_value > 0 && transaction.total_value > filters.max_value) {
        return false
      }

      // Filter by date range
      if (filters.date_range.start) {
        const startDate = new Date(filters.date_range.start)
        const transactionDate = new Date(transaction.date)
        if (transactionDate < startDate) {
          return false
        }
      }

      if (filters.date_range.end) {
        const endDate = new Date(filters.date_range.end)
        const transactionDate = new Date(transaction.date)
        if (transactionDate > endDate) {
          return false
        }
      }

      // Filter by profit/loss (for sell transactions)
      if (filters.profit_loss_filter !== 'all' && transaction.type === 'sell') {
        // For simplicity, assume any sell transaction above average cost is profit
        const avgCost = 40000 // Mock average cost
        const isProfit = transaction.price > avgCost
        
        if (filters.profit_loss_filter === 'profit' && !isProfit) {
          return false
        }
        
        if (filters.profit_loss_filter === 'loss' && isProfit) {
          return false
        }
      }

      return true
    })
  }, [filters])

  /**
   * Get available filter options from data
   */
  const getFilterOptions = useCallback((holdings: CryptoHolding[], transactions: CryptoTransaction[]) => {
    // Get unique crypto symbols
    const cryptoSymbols = Array.from(new Set([
      ...holdings.map(h => h.symbol),
      ...transactions.map(t => t.symbol)
    ])).sort()

    // Get unique platforms
    const platforms = Array.from(new Set([
      ...holdings.map(h => h.platform),
      ...transactions.map(t => t.platform)
    ])).sort()

    // Get unique transaction types
    const transactionTypes = Array.from(new Set(
      transactions.map(t => t.type)
    )).sort()

    // Get value ranges
    const allValues = [
      ...holdings.map(h => h.total_value),
      ...transactions.map(t => t.total_value)
    ]
    
    const minValue = Math.min(...allValues, 0)
    const maxValue = Math.max(...allValues, 0)

    return {
      cryptoSymbols,
      platforms,
      transactionTypes,
      valueRange: { min: minValue, max: maxValue }
    }
  }, [])

  /**
   * Quick filter presets
   */
  const applyQuickFilter = useCallback((preset: string) => {
    switch (preset) {
      case 'profitable_only':
        setFilters(prev => ({
          ...prev,
          profit_loss_filter: 'profit'
        }))
        break
        
      case 'losing_positions':
        setFilters(prev => ({
          ...prev,
          profit_loss_filter: 'loss'
        }))
        break
        
      case 'major_cryptos':
        setFilters(prev => ({
          ...prev,
          crypto_symbols: ['BTC', 'ETH', 'ADA', 'SOL']
        }))
        break
        
      case 'recent_activity':
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        setFilters(prev => ({
          ...prev,
          date_range: {
            start: oneMonthAgo.toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }))
        break
        
      case 'high_value':
        setFilters(prev => ({
          ...prev,
          min_value: 10000
        }))
        break
        
      case 'exchanges_only':
        setFilters(prev => ({
          ...prev,
          platforms: ['coinbase', 'binance', 'kraken']
        }))
        break
        
      default:
        resetFilters()
        break
    }
  }, [resetFilters])

  /**
   * Export filter state for URL params or storage
   */
  const exportFilters = useCallback(() => {
    return {
      ...filters,
      date_range_start: filters.date_range.start,
      date_range_end: filters.date_range.end
    }
  }, [filters])

  /**
   * Import filter state from URL params or storage
   */
  const importFilters = useCallback((filterParams: Record<string, any>) => {
    setFilters({
      crypto_symbols: filterParams.crypto_symbols || [],
      platforms: filterParams.platforms || [],
      date_range: {
        start: filterParams.date_range_start || '',
        end: filterParams.date_range_end || ''
      },
      transaction_types: filterParams.transaction_types || [],
      min_value: filterParams.min_value || 0,
      max_value: filterParams.max_value || 0,
      profit_loss_filter: filterParams.profit_loss_filter || 'all'
    })
  }, [])

  /**
   * Get filter summary text
   */
  const getFilterSummary = useCallback(() => {
    const activeParts: string[] = []

    if (filters.crypto_symbols.length > 0) {
      activeParts.push(`${filters.crypto_symbols.length} crypto${filters.crypto_symbols.length > 1 ? 's' : ''}`)
    }

    if (filters.platforms.length > 0) {
      activeParts.push(`${filters.platforms.length} platform${filters.platforms.length > 1 ? 's' : ''}`)
    }

    if (filters.transaction_types.length > 0) {
      activeParts.push(`${filters.transaction_types.length} transaction type${filters.transaction_types.length > 1 ? 's' : ''}`)
    }

    if (filters.date_range.start || filters.date_range.end) {
      activeParts.push('date range')
    }

    if (filters.min_value > 0 || filters.max_value > 0) {
      activeParts.push('value range')
    }

    if (filters.profit_loss_filter !== 'all') {
      activeParts.push(`${filters.profit_loss_filter} only`)
    }

    if (activeParts.length === 0) {
      return 'No filters applied'
    }

    return `Filtered by: ${activeParts.join(', ')}`
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    filterHoldings,
    filterTransactions,
    hasActiveFilters,
    getFilterOptions,
    applyQuickFilter,
    exportFilters,
    importFilters,
    getFilterSummary
  }
}