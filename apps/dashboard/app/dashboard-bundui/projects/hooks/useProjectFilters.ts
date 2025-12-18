/**
 * Project Filters Hook - VibeThink Orchestrator
 * 
 * Advanced filtering and search functionality for projects and tasks
 * Following VThink 1.0 methodology with multi-tenant security
 */

import { useState, useMemo } from 'react'
import { Project, Task, ProjectFilters, TaskFilters, TeamMember } from '../types'

/**
 * Hook for managing project filters and search
 */
export const useProjectFilters = () => {
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    team_lead: [],
    search: ''
  })

  const updateFilter = <K extends keyof ProjectFilters>(
    key: K,
    value: ProjectFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilter = (key: keyof ProjectFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'status' || key === 'priority' || key === 'team_lead' ? [] : undefined
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      priority: [],
      team_lead: [],
      search: ''
    })
  }

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.status?.length || 0) > 0 ||
      (filters.priority?.length || 0) > 0 ||
      (filters.team_lead?.length || 0) > 0 ||
      (filters.search?.length || 0) > 0
    )
  }, [filters])

  return {
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters
  }
}

/**
 * Hook for managing task filters and search
 */
export const useTaskFilters = () => {
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    assigned_to: [],
    project_id: [],
    search: ''
  })

  const updateFilter = <K extends keyof TaskFilters>(
    key: K,
    value: TaskFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilter = (key: keyof TaskFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'status' || key === 'priority' || key === 'assigned_to' || key === 'project_id' ? [] : undefined
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assigned_to: [],
      project_id: [],
      search: ''
    })
  }

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.status?.length || 0) > 0 ||
      (filters.priority?.length || 0) > 0 ||
      (filters.assigned_to?.length || 0) > 0 ||
      (filters.project_id?.length || 0) > 0 ||
      (filters.search?.length || 0) > 0
    )
  }, [filters])

  return {
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters
  }
}

/**
 * Hook for filtering projects client-side (backup to server-side filtering)
 */
export const useFilteredProjects = (projects: Project[], filters: ProjectFilters) => {
  return useMemo(() => {
    return projects.filter(project => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(project.status)) {
        return false
      }

      // Priority filter
      if (filters.priority?.length && !filters.priority.includes(project.priority)) {
        return false
      }

      // Team lead filter
      if (filters.team_lead?.length && !filters.team_lead.includes(project.team_lead_id)) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const nameMatch = project.name.toLowerCase().includes(searchLower)
        const descriptionMatch = project.description.toLowerCase().includes(searchLower)
        const teamLeadMatch = project.team_lead_name?.toLowerCase().includes(searchLower) || false
        
        if (!nameMatch && !descriptionMatch && !teamLeadMatch) {
          return false
        }
      }

      // Date range filter
      if (filters.date_range) {
        const projectDate = new Date(project.created_at)
        const startDate = new Date(filters.date_range.start)
        const endDate = new Date(filters.date_range.end)
        
        if (projectDate < startDate || projectDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [projects, filters])
}

/**
 * Hook for filtering tasks client-side (backup to server-side filtering)
 */
export const useFilteredTasks = (tasks: Task[], filters: TaskFilters) => {
  return useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(task.status)) {
        return false
      }

      // Priority filter
      if (filters.priority?.length && !filters.priority.includes(task.priority)) {
        return false
      }

      // Assigned to filter
      if (filters.assigned_to?.length && !filters.assigned_to.includes(task.assigned_to)) {
        return false
      }

      // Project filter
      if (filters.project_id?.length && !filters.project_id.includes(task.project_id)) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const titleMatch = task.title.toLowerCase().includes(searchLower)
        const descriptionMatch = task.description.toLowerCase().includes(searchLower)
        const assigneeMatch = task.assigned_to_name?.toLowerCase().includes(searchLower) || false
        
        if (!titleMatch && !descriptionMatch && !assigneeMatch) {
          return false
        }
      }

      // Due date range filter
      if (filters.due_date_range) {
        const taskDate = new Date(task.due_date)
        const startDate = new Date(filters.due_date_range.start)
        const endDate = new Date(filters.due_date_range.end)
        
        if (taskDate < startDate || taskDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [tasks, filters])
}

/**
 * Hook for project search with debounced input
 */
export const useProjectSearch = (projects: Project[], searchTerm: string, delay: number = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  // Debounce search term
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, delay])

  const filteredProjects = useMemo(() => {
    if (!debouncedSearchTerm) return projects

    const searchLower = debouncedSearchTerm.toLowerCase()
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.team_lead_name?.toLowerCase().includes(searchLower)
    )
  }, [projects, debouncedSearchTerm])

  return filteredProjects
}

/**
 * Hook for getting filter options from data
 */
export const useFilterOptions = (projects: Project[], tasks: Task[], teamMembers: TeamMember[]) => {
  const projectStatusOptions = useMemo(() => 
    Array.from(new Set(projects.map(p => p.status))).map(status => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
    }))
  , [projects])

  const projectPriorityOptions = useMemo(() => 
    Array.from(new Set(projects.map(p => p.priority))).map(priority => ({
      value: priority,
      label: priority.charAt(0).toUpperCase() + priority.slice(1)
    }))
  , [projects])

  const taskStatusOptions = useMemo(() => 
    Array.from(new Set(tasks.map(t => t.status))).map(status => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
    }))
  , [tasks])

  const taskPriorityOptions = useMemo(() => 
    Array.from(new Set(tasks.map(t => t.priority))).map(priority => ({
      value: priority,
      label: priority.charAt(0).toUpperCase() + priority.slice(1)
    }))
  , [tasks])

  const teamMemberOptions = useMemo(() => 
    teamMembers.map(member => ({
      value: member.id,
      label: member.name,
      avatar: member.avatar_url
    }))
  , [teamMembers])

  const projectOptions = useMemo(() => 
    projects.map(project => ({
      value: project.id,
      label: project.name
    }))
  , [projects])

  return {
    projectStatusOptions,
    projectPriorityOptions,
    taskStatusOptions,
    taskPriorityOptions,
    teamMemberOptions,
    projectOptions
  }
}