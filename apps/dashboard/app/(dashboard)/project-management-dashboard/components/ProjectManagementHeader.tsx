/**
 * Project Management Header Component
 * VibeThink Orchestrator
 * 
 * Header with project filters, search, and actions
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Badge } from '@/shared/components/ui/badge'
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Calendar,
  Users,
  MoreHorizontal,
  X
} from 'lucide-react'
import { useProjectFilters, useFilterOptions } from '../hooks/useProjectFilters'
import { useProjectData } from '../hooks/useProjectData'

interface ProjectManagementHeaderProps {
  onCreateProject?: () => void
  onCreateTask?: () => void
  onExportData?: () => void
}

export const ProjectManagementHeader: React.FC<ProjectManagementHeaderProps> = ({
  onCreateProject,
  onCreateTask,
  onExportData
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { filters, updateFilter, clearFilter, clearAllFilters, hasActiveFilters } = useProjectFilters()
  const { projects, tasks, teamMembers } = useProjectData(filters)
  const { 
    projectStatusOptions, 
    projectPriorityOptions, 
    teamMemberOptions 
  } = useFilterOptions(projects, tasks, teamMembers)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    updateFilter('search', value)
  }

  const handleStatusFilter = (status: string) => {
    const currentStatuses = filters.status || []
    if (currentStatuses.includes(status as any)) {
      updateFilter('status', currentStatuses.filter(s => s !== status))
    } else {
      updateFilter('status', [...currentStatuses, status as any])
    }
  }

  const handlePriorityFilter = (priority: string) => {
    const currentPriorities = filters.priority || []
    if (currentPriorities.includes(priority as any)) {
      updateFilter('priority', currentPriorities.filter(p => p !== priority))
    } else {
      updateFilter('priority', [...currentPriorities, priority as any])
    }
  }

  const handleTeamLeadFilter = (teamLeadId: string) => {
    const currentTeamLeads = filters.team_lead || []
    if (currentTeamLeads.includes(teamLeadId)) {
      updateFilter('team_lead', currentTeamLeads.filter(t => t !== teamLeadId))
    } else {
      updateFilter('team_lead', [...currentTeamLeads, teamLeadId])
    }
  }

  const getActiveFiltersCount = () => {
    return (filters.status?.length || 0) + 
           (filters.priority?.length || 0) + 
           (filters.team_lead?.length || 0) +
           (filters.search ? 1 : 0)
  }

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Track projects, manage tasks, and monitor team performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onCreateProject}>
                <Calendar className="h-4 w-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateTask}>
                <Users className="h-4 w-4 mr-2" />
                New Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status?.join(',') || ''}
          onValueChange={(value) => {
            if (value && value !== 'all') {
              updateFilter('status', value.split(',') as any)
            } else {
              clearFilter('status')
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {projectStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority?.join(',') || ''}
          onValueChange={(value) => {
            if (value && value !== 'all') {
              updateFilter('priority', value.split(',') as any)
            } else {
              clearFilter('priority')
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {projectPriorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Team Lead Filter */}
        <Select
          value={filters.team_lead?.join(',') || ''}
          onValueChange={(value) => {
            if (value && value !== 'all') {
              updateFilter('team_lead', value.split(','))
            } else {
              clearFilter('team_lead')
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Team Lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Leads</SelectItem>
            {teamMemberOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear ({getActiveFiltersCount()})
          </Button>
        )}

        {/* Advanced Filters Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <h4 className="font-medium text-sm mb-2">Quick Filters</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilter('status', ['active'])}
                >
                  Active Projects Only
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilter('priority', ['urgent', 'high'])}
                >
                  High Priority Projects
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const overdueDate = new Date()
                    overdueDate.setDate(overdueDate.getDate() - 1)
                    updateFilter('date_range', {
                      start: '2024-01-01',
                      end: overdueDate.toISOString().split('T')[0]
                    })
                  }}
                >
                  Overdue Projects
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.status?.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="text-xs">
              Status: {status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => handleStatusFilter(status)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {filters.priority?.map((priority) => (
            <Badge key={`priority-${priority}`} variant="secondary" className="text-xs">
              Priority: {priority}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => handlePriorityFilter(priority)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {filters.team_lead?.map((teamLeadId) => {
            const teamLead = teamMemberOptions.find(tm => tm.value === teamLeadId)
            return (
              <Badge key={`team-lead-${teamLeadId}`} variant="secondary" className="text-xs">
                Lead: {teamLead?.label || teamLeadId}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleTeamLeadFilter(teamLeadId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
          
          {filters.search && (
            <Badge variant="secondary" className="text-xs">
              Search: &quot;{filters.search}&quot;
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => handleSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}