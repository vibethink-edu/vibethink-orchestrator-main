import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Card, CardContent, CardHeader, CardTitle, Popover, PopoverContent, PopoverTrigger, Calendar } from '@vibethink/ui'
import { useState } from 'react'
import { format } from 'date-fns'
import { FinanceHeaderProps } from '../types'
import { 
  Plus, 
  Download, 
  Filter, 
  X, 
  Search, 
  Calendar as CalendarIcon,
  DollarSign,
  Receipt,
  Target,
  Settings
} from 'lucide-react'

/**
 * FinanceHeader Component
 * 
 * Header for the finance dashboard with filters, search, and action buttons.
 * Provides comprehensive filtering options and quick actions.
 * 
 * Features:
 * - Global search across all financial data
 * - Date range picker with presets
 * - Category and status filters
 * - Amount range filters
 * - Department and currency filters
 * - Quick action buttons (Add Revenue, Add Expense, Export)
 * - Active filter indicators
 * - Filter reset functionality
 * - HSL color variables for theme compatibility
 */
export function FinanceHeader({ 
  onFiltersChange, 
  onExport, 
  onAddExpense, 
  onAddRevenue, 
  className 
}: FinanceHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')
  const [category, setCategory] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [department, setDepartment] = useState<string>('all')
  const [currency, setCurrency] = useState<string>('all')
  const [amountMin, setAmountMin] = useState<string>('')
  const [amountMax, setAmountMax] = useState<string>('')
  const [customDateFrom, setCustomDateFrom] = useState<Date>()
  const [customDateTo, setCustomDateTo] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)

  // Filter options
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sales', label: 'Sales' },
    { value: 'services', label: 'Services' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'salaries', label: 'Salaries' },
    { value: 'software', label: 'Software' },
    { value: 'operations', label: 'Operations' },
    { value: 'other', label: 'Other' }
  ]

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'received', label: 'Received' },
    { value: 'paid', label: 'Paid' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' }
  ]

  const currencies = [
    { value: 'all', label: 'All Currencies' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = {
      searchQuery: key === 'searchQuery' ? value : searchQuery,
      category: key === 'category' ? value : category,
      dateRange: key === 'dateRange' ? value : dateRange,
      status: key === 'status' ? value : status,
      department: key === 'department' ? value : department,
      currency: key === 'currency' ? value : currency,
      amountRange: {
        min: key === 'amountMin' ? (value ? parseFloat(value) : null) : (amountMin ? parseFloat(amountMin) : null),
        max: key === 'amountMax' ? (value ? parseFloat(value) : null) : (amountMax ? parseFloat(amountMax) : null)
      }
    }

    // Update local state
    switch (key) {
      case 'searchQuery':
        setSearchQuery(value)
        break
      case 'category':
        setCategory(value)
        break
      case 'dateRange':
        setDateRange(value)
        break
      case 'status':
        setStatus(value)
        break
      case 'department':
        setDepartment(value)
        break
      case 'currency':
        setCurrency(value)
        break
      case 'amountMin':
        setAmountMin(value)
        break
      case 'amountMax':
        setAmountMax(value)
        break
    }

    // Notify parent component
    onFiltersChange?.(newFilters)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('')
    setDateRange('month')
    setCategory('all')
    setStatus('all')
    setDepartment('all')
    setCurrency('all')
    setAmountMin('')
    setAmountMax('')
    setCustomDateFrom(undefined)
    setCustomDateTo(undefined)
    
    onFiltersChange?.({
      searchQuery: '',
      category: 'all',
      dateRange: 'month',
      status: 'all',
      department: 'all',
      currency: 'all',
      amountRange: { min: null, max: null }
    })
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery || 
    dateRange !== 'month' || 
    category !== 'all' || 
    status !== 'all' || 
    department !== 'all' || 
    currency !== 'all' || 
    amountMin || 
    amountMax

  const activeFilterCount = [
    searchQuery,
    dateRange !== 'month',
    category !== 'all',
    status !== 'all',
    department !== 'all',
    currency !== 'all',
    amountMin,
    amountMax
  ].filter(Boolean).length

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive financial management and analytics
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onAddRevenue} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Revenue
          </Button>
          <Button variant="outline" onClick={onAddExpense} className="gap-2">
            <Receipt className="h-4 w-4" />
            Add Expense
          </Button>
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-medium">Filters & Search</CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <>
                  <Badge variant="secondary" className="gap-1">
                    <Filter className="h-3 w-3" />
                    {activeFilterCount} active
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
                    <X className="h-3 w-3" />
                    Clear
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions, vendors, customers..."
              value={searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((stat) => (
                      <SelectItem key={stat.value} value={stat.value}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={department} onValueChange={(value) => handleFilterChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Amount</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Amount</label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select value={currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {dateRange === 'custom' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Custom Date Range</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start gap-2 flex-1">
                          <CalendarIcon className="h-4 w-4" />
                          {customDateFrom ? format(customDateFrom, 'MMM dd, yyyy') : 'From date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customDateFrom}
                          onSelect={setCustomDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start gap-2 flex-1">
                          <CalendarIcon className="h-4 w-4" />
                          {customDateTo ? format(customDateTo, 'MMM dd, yyyy') : 'To date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customDateTo}
                          onSelect={setCustomDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {searchQuery && (
                <Badge variant="outline" className="gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => handleFilterChange('searchQuery', '')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {dateRange !== 'month' && (
                <Badge variant="outline" className="gap-1">
                  Date: {dateRangeOptions.find(d => d.value === dateRange)?.label}
                  <button
                    onClick={() => handleFilterChange('dateRange', 'month')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {category !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Category: {categories.find(c => c.value === category)?.label}
                  <button
                    onClick={() => handleFilterChange('category', 'all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {status !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Status: {statuses.find(s => s.value === status)?.label}
                  <button
                    onClick={() => handleFilterChange('status', 'all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(amountMin || amountMax) && (
                <Badge variant="outline" className="gap-1">
                  Amount: ${amountMin || '0'} - ${amountMax || '∞'}
                  <button
                    onClick={() => {
                      handleFilterChange('amountMin', '')
                      handleFilterChange('amountMax', '')
                    }}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue YTD</p>
                <p className="text-lg font-semibold">$2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <Receipt className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses YTD</p>
                <p className="text-lg font-semibold">$1.8M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-lg font-semibold">$600K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin</p>
                <p className="text-lg font-semibold">25.0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
