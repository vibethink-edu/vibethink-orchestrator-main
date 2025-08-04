/**
 * Task Filters Panel Component - VibeThink Orchestrator
 * 
 * Advanced filtering panel for task management
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Badge } from '@/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible'
import { 
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Tag,
  Target,
  RefreshCw
} from 'lucide-react'
import { TaskFilters, TeamMember, Task } from '../types'

interface TaskFiltersPanelProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  teamMembers: TeamMember[]
}

export default function TaskFiltersPanel({
  filters,
  onFiltersChange,
  teamMembers
}: TaskFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  const statusOptions: Task['status'][] = ['todo', 'in-progress', 'in-review', 'completed', 'cancelled']
  const priorityOptions: Task['priority'][] = ['low', 'medium', 'high', 'critical']
  const categoryOptions: Task['category'][] = [
    'development', 'design', 'testing', 'documentation', 
    'meeting', 'research', 'maintenance', 'other'
  ]

  const handleStatusChange = (status: Task['status'], checked: boolean) => {
    const currentStatuses = filters.status || []
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status)
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    })
  }

  const handlePriorityChange = (priority: Task['priority'], checked: boolean) => {
    const currentPriorities = filters.priority || []
    const newPriorities = checked
      ? [...currentPriorities, priority]
      : currentPriorities.filter(p => p !== priority)
    
    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined
    })
  }

  const handleCategoryChange = (category: Task['category'], checked: boolean) => {
    const currentCategories = filters.category || []
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category)
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined
    })
  }

  const handleAssigneeChange = (assigneeId: string, checked: boolean) => {
    const currentAssignees = filters.assigned_to || []
    const newAssignees = checked
      ? [...currentAssignees, assigneeId]
      : currentAssignees.filter(a => a !== assigneeId)
    
    onFiltersChange({
      ...filters,
      assigned_to: newAssignees.length > 0 ? newAssignees : undefined
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({
      ...filters,
      search: value || undefined
    })
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.status?.length) count++
    if (filters.priority?.length) count++
    if (filters.category?.length) count++
    if (filters.assigned_to?.length) count++
    if (filters.search) count++
    if (filters.is_overdue) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        {/* Search and Quick Actions */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.status?.map(status => (
              <Badge key={status} variant="secondary" className="flex items-center space-x-1">
                <span>Status: {status.replace('-', ' ')}</span>
                <button
                  onClick={() => handleStatusChange(status, false)}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {filters.priority?.map(priority => (
              <Badge key={priority} variant="secondary" className="flex items-center space-x-1">
                <span>Priority: {priority}</span>
                <button
                  onClick={() => handlePriorityChange(priority, false)}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {filters.category?.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center space-x-1">
                <span>Category: {category}</span>
                <button
                  onClick={() => handleCategoryChange(category, false)}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {filters.assigned_to?.map(assigneeId => {
              const member = teamMembers.find(m => m.id === assigneeId)
              return member ? (
                <Badge key={assigneeId} variant="secondary" className="flex items-center space-x-1">
                  <span>Assignee: {member.name}</span>
                  <button
                    onClick={() => handleAssigneeChange(assigneeId, false)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null
            })}

            {filters.is_overdue && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <span>Overdue tasks</span>
                <button
                  onClick={() => onFiltersChange({ ...filters, is_overdue: undefined })}
                  className="hover:bg-red-600 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Expanded Filters */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Status Filters */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Status</span>
                </Label>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status?.includes(status) || false}
                        onCheckedChange={(checked) => 
                          handleStatusChange(status, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`status-${status}`}
                        className="text-sm font-normal capitalize cursor-pointer"
                      >
                        {status.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Filters */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Priority</span>
                </Label>
                <div className="space-y-2">
                  {priorityOptions.map(priority => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={filters.priority?.includes(priority) || false}
                        onCheckedChange={(checked) => 
                          handlePriorityChange(priority, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`priority-${priority}`}
                        className="text-sm font-normal capitalize cursor-pointer"
                      >
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filters */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Category</span>
                </Label>
                <div className="space-y-2">
                  {categoryOptions.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category?.includes(category) || false}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal capitalize cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignee Filters */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Assignee</span>
                </Label>
                <div className="space-y-2">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`assignee-${member.id}`}
                        checked={filters.assigned_to?.includes(member.id) || false}
                        onCheckedChange={(checked) => 
                          handleAssigneeChange(member.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`assignee-${member.id}`}
                        className="text-sm font-normal cursor-pointer flex items-center space-x-2"
                      >
                        <span>{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.active_tasks}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Filters */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overdue"
                    checked={filters.is_overdue || false}
                    onCheckedChange={(checked) => 
                      onFiltersChange({
                        ...filters,
                        is_overdue: checked ? true : undefined
                      })
                    }
                  />
                  <Label htmlFor="overdue" className="text-sm font-normal cursor-pointer">
                    Show only overdue tasks
                  </Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}