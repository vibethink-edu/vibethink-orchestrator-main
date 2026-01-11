/**
 * Project Management Header Component
 * VibeThink Orchestrator
 * 
 * Header with project filters, search, and actions
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState } from 'react'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge
} from '@vibethink/ui'
import {
  Search,
  Plus,
  Filter,
  Download,
  Calendar,
  Users,
  MoreHorizontal,
  X
} from "@vibethink/ui/icons"
import { useProjectFilters, useFilterOptions } from '../hooks/useProjectFilters'
import { useProjectData } from '../hooks/useProjectData'
import { useTranslation } from '@/lib/i18n'

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
  const { t } = useTranslation('projects')
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
          <h1 className="text-3xl font-bold tracking-tight">{t('header.title')}</h1>
          <p className="text-muted-foreground">
            {t('header.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onExportData}>
            <Download className="h-4 w-4 mr-2" />
            {t('header.export')}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('common.create')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onCreateProject}>
                <Calendar className="h-4 w-4 mr-2" />
                {t('header.newProject')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateTask}>
                <Users className="h-4 w-4 mr-2" />
                {t('header.newTask')}
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
            placeholder={t('header.searchPlaceholder')}
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
            <SelectValue placeholder={t('header.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('header.allStatuses')}</SelectItem>
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
            <SelectValue placeholder={t('header.priority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('header.allPriorities')}</SelectItem>
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
            <SelectValue placeholder={t('header.teamLead')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('header.allTeamLeads')}</SelectItem>
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
            {t('header.clearFilters')} ({getActiveFiltersCount()})
          </Button>
        )}

        {/* Advanced Filters Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('header.filters')}
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <h4 className="font-medium text-sm mb-2">{t('header.quickFilters')}</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilter('status', ['active'])}
                >
                  {t('header.activeProjectsOnly')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateFilter('priority', ['urgent', 'high'])}
                >
                  {t('header.highPriorityProjects')}
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
                  {t('header.overdueProjects')}
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {
        hasActiveFilters && (
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{t('header.activeFilters')}:</span>

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
        )
      }
    </div >
  )
}
