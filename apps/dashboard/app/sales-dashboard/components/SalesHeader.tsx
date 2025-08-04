import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'
import { 
  CalendarDays,
  Download,
  Filter,
  Plus,
  Search,
  Users,
  Target
} from 'lucide-react'
import { useSalesFilters } from '../hooks/useSalesFilters'
import { SALE_STAGES, SALES_SOURCES } from '../types'

interface SalesHeaderProps {
  className?: string
}

export function SalesHeader({ className }: SalesHeaderProps) {
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    hasActiveFilters,
    getFilterSummary 
  } = useSalesFilters()

  const handleExport = () => {
    // Export functionality - would typically generate CSV/Excel
    console.log('Exporting sales data...')
  }

  const handleAddSale = () => {
    // Add new sale functionality - would open modal/form
    console.log('Adding new sale...')
  }

  const filterSummary = getFilterSummary()

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title and main actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Track performance, manage pipeline, and analyze sales metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddSale}>
            <Plus className="h-4 w-4 mr-2" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales, customers, or reps..."
            className="pl-10"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Sales Rep Filter */}
          <Select 
            value={filters.salesRep} 
            onValueChange={(value) => updateFilter('salesRep', value)}
          >
            <SelectTrigger className="w-[140px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Reps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reps</SelectItem>
              <SelectItem value="sarah_johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike_chen">Mike Chen</SelectItem>
              <SelectItem value="emma_davis">Emma Davis</SelectItem>
              <SelectItem value="james_wilson">James Wilson</SelectItem>
            </SelectContent>
          </Select>

          {/* Stage Filter */}
          <Select 
            value={filters.stage} 
            onValueChange={(value) => updateFilter('stage', value as any)}
          >
            <SelectTrigger className="w-[140px]">
              <Target className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {Object.entries(SALE_STAGES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => updateFilter('dateRange', value as any)}
          >
            <SelectTrigger className="w-[120px]">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select 
            value={filters.source} 
            onValueChange={(value) => updateFilter('source', value as any)}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.entries(SALES_SOURCES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-10"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && filterSummary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filterSummary.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}