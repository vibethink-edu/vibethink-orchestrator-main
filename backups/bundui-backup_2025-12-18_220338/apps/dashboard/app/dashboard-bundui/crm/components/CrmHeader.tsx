import { Button, Input, Badge } from '@vibethink/ui'
import { Search, Plus, Filter, Download, X } from 'lucide-react'
import { useCrmFilters } from '../hooks/useCrmFilters'

interface CrmHeaderProps {
  className?: string
}

export function CrmHeader({ className }: CrmHeaderProps) {
  const { filters, updateFilter, resetFilters, hasActiveFilters, getFilterSummary } = useCrmFilters()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('searchQuery', e.target.value)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your customers, leads, and sales pipeline
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers, deals..." 
            className="pl-10"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {getFilterSummary().map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
