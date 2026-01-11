'use client'

import { useState, useMemo } from 'react'

export interface CrmFilters {
  searchQuery: string
  customerStatus: 'all' | 'active' | 'lead' | 'prospect' | 'inactive'
  dealStage: 'all' | 'discovery' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost'
  dateRange: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year'
  valueRange: {
    min: number | null
    max: number | null
  }
}

const defaultFilters: CrmFilters = {
  searchQuery: '',
  customerStatus: 'all',
  dealStage: 'all',
  dateRange: 'all',
  valueRange: {
    min: null,
    max: null
  }
}

export function useCrmFilters() {
  const [filters, setFilters] = useState<CrmFilters>(defaultFilters)

  // Update individual filter values
  const updateFilter = <K extends keyof CrmFilters>(
    key: K,
    value: CrmFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Reset all filters to default
  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  // Get date range for filtering
  const getDateRange = (range: string) => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (range) {
      case 'today':
        return {
          start: startOfDay,
          end: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
        }
      case 'week':
        const startOfWeek = new Date(startOfDay)
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
        return {
          start: startOfWeek,
          end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      case 'month':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        return {
          start: quarterStart,
          end: new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 1)
        }
      case 'year':
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear() + 1, 0, 1)
        }
      default:
        return null
    }
  }

  // Filter customers based on current filters
  const filterCustomers = (customers: any[]) => {
    return customers.filter(customer => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchableText = [
          customer.name,
          customer.email,
          customer.company,
          customer.phone
        ].join(' ').toLowerCase()

        if (!searchableText.includes(query)) {
          return false
        }
      }

      // Status filter
      if (filters.customerStatus !== 'all' && customer.status !== filters.customerStatus) {
        return false
      }

      // Value range filter
      if (filters.valueRange.min !== null && customer.value < filters.valueRange.min) {
        return false
      }
      if (filters.valueRange.max !== null && customer.value > filters.valueRange.max) {
        return false
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const dateRange = getDateRange(filters.dateRange)
        if (dateRange) {
          const customerDate = new Date(customer.created_at)
          if (customerDate < dateRange.start || customerDate >= dateRange.end) {
            return false
          }
        }
      }

      return true
    })
  }

  // Filter deals based on current filters
  const filterDeals = (deals: any[]) => {
    return deals.filter(deal => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchableText = [
          deal.title,
          deal.customer_name
        ].join(' ').toLowerCase()

        if (!searchableText.includes(query)) {
          return false
        }
      }

      // Stage filter
      if (filters.dealStage !== 'all' && deal.stage !== filters.dealStage) {
        return false
      }

      // Value range filter
      if (filters.valueRange.min !== null && deal.value < filters.valueRange.min) {
        return false
      }
      if (filters.valueRange.max !== null && deal.value > filters.valueRange.max) {
        return false
      }

      // Date range filter (using close_date)
      if (filters.dateRange !== 'all') {
        const dateRange = getDateRange(filters.dateRange)
        if (dateRange) {
          const dealDate = new Date(deal.close_date)
          if (dealDate < dateRange.start || dealDate >= dateRange.end) {
            return false
          }
        }
      }

      return true
    })
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.customerStatus !== 'all' ||
      filters.dealStage !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.valueRange.min !== null ||
      filters.valueRange.max !== null
    )
  }, [filters])

  // Get filter summary for display
  const getFilterSummary = () => {
    const activeFilters: string[] = []

    if (filters.searchQuery) {
      activeFilters.push(`Search: "${filters.searchQuery}"`)
    }
    if (filters.customerStatus !== 'all') {
      activeFilters.push(`Status: ${filters.customerStatus}`)
    }
    if (filters.dealStage !== 'all') {
      activeFilters.push(`Stage: ${filters.dealStage}`)
    }
    if (filters.dateRange !== 'all') {
      activeFilters.push(`Period: ${filters.dateRange}`)
    }
    if (filters.valueRange.min !== null || filters.valueRange.max !== null) {
      const min = filters.valueRange.min || 0
      const max = filters.valueRange.max || '∞'
      activeFilters.push(`Value: $${min} - $${max}`)
    }

    return activeFilters
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    filterCustomers,
    filterDeals,
    hasActiveFilters,
    getFilterSummary
  }
}