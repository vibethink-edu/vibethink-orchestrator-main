'use client'

import { useState } from 'react'
import { CalendarDays, Download, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@vibethink/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@vibethink/ui/components/dropdown-menu'
import { Badge } from '@vibethink/ui/components/badge'
import { DatePickerWithRange } from '@/shared/components/ui/date-range-picker'
import { useAnalyticsFilters } from '../hooks'
import { AnalyticsCardProps } from '../types'

interface AnalyticsHeaderProps extends AnalyticsCardProps {
  title?: string
  onRefresh?: () => void
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void
}

/**
 * Analytics Header Component
 * 
 * Provides header controls for the analytics dashboard:
 * - Date range picker
 * - Export functionality (CSV, PDF, Excel)
 * - Filter controls
 * - Refresh button
 * 
 * Follows VThink 1.0 patterns with proper theming
 */
export function AnalyticsHeader({
  title = 'Website Analytics',
  onRefresh,
  onExport,
  isLoading = false,
  className = ''
}: AnalyticsHeaderProps) {
  const {
    filters,
    applyDateRange,
    applyPresetRange,
    resetFilters,
    getDateRangeLabel,
    isDefaultFilters
  } = useAnalyticsFilters()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setTimeout(() => setIsRefreshing(false), 1000)
      }
    }
  }

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    if (onExport) {
      onExport(format)
    }
  }

  const handlePresetSelect = (preset: string) => {
    applyPresetRange(preset)
  }

  return (
    <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}>
      {/* Title and status */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          {title}
        </h1>
        {isLoading && (
          <Badge variant="secondary" className="animate-pulse">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            Loading...
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Date Range Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Presets */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                {getDateRangeLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handlePresetSelect('today')}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePresetSelect('yesterday')}>
                Yesterday
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePresetSelect('last7days')}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePresetSelect('last30days')}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePresetSelect('last90days')}>
                Last 90 days
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePresetSelect('thisMonth')}>
                This month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePresetSelect('lastMonth')}>
                Last month
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePresetSelect('thisYear')}>
                This year
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePresetSelect('lastYear')}>
                Last year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Custom Date Range Picker */}
          <DatePickerWithRange
            from={filters.dateRange.from}
            to={filters.dateRange.to}
            onDateChange={(range) => {
              if (range?.from && range?.to) {
                applyDateRange({ from: range.from, to: range.to })
              }
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Filter Reset */}
          {!isDefaultFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground"
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

/**
 * Simplified Analytics Header for smaller screens
 */
export function AnalyticsHeaderCompact({
  title = 'Analytics',
  onRefresh,
  onExport,
  isLoading = false,
  className = ''
}: AnalyticsHeaderProps) {
  const { getDateRangeLabel } = useAnalyticsFilters()

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isLoading && (
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {getDateRangeLabel()}
        </Badge>

        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}

        {onExport && (
          <Button variant="ghost" size="sm" onClick={() => onExport('csv')}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
