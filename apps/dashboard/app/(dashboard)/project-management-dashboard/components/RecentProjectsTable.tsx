/**
 * Recent Projects Table Component
 * VibeThink Orchestrator
 * 
 * Data table with project management and team assignment
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/shared/components/ui/card'
import { Button } from '@vibethink/ui'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { 
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye
} from 'lucide-react'
import { useProjectData, useUpdateProjectProgress } from '../hooks/useProjectData'
import { useProjectFilters } from '../hooks/useProjectFilters'
import { Project } from '../types'

interface RecentProjectsTableProps {
  className?: string
  onEditProject?: (project: Project) => void
  onDeleteProject?: (projectId: string) => void
  onViewProject?: (project: Project) => void
}

type SortField = 'name' | 'status' | 'priority' | 'progress' | 'due_date' | 'budget'
type SortDirection = 'asc' | 'desc'

const getStatusBadge = (status: Project['status']) => {
  const variants = {
    active: 'default',
    completed: 'secondary',
    'on-hold': 'outline',
    cancelled: 'destructive'
  } as const

  const labels = {
    active: 'Active',
    completed: 'Completed',
    'on-hold': 'On Hold',
    cancelled: 'Cancelled'
  }

  return (
    <Badge variant={variants[status] as any}>
      {labels[status]}
    </Badge>
  )
}

const getPriorityBadge = (priority: Project['priority']) => {
  const variants = {
    low: 'secondary',
    medium: 'outline',
    high: 'default',
    urgent: 'destructive'
  } as const

  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  }

  return (
    <Badge variant={variants[priority] as any}>
      {labels[priority]}
    </Badge>
  )
}

const ProjectTableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-muted rounded animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded animate-pulse" />
      </div>
    ))}
  </div>
)

export const RecentProjectsTable: React.FC<RecentProjectsTableProps> = ({
  className,
  onEditProject,
  onDeleteProject,
  onViewProject
}) => {
  const [sortField, setSortField] = useState<SortField>('due_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const { filters } = useProjectFilters()
  const { projects, isLoading, error } = useProjectData(filters)
  const updateProjectProgress = useUpdateProjectProgress()

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects || []

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.team_lead_name && project.team_lead_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'due_date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [projects, searchTerm, statusFilter, priorityFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleProgressUpdate = async (projectId: string, newProgress: number) => {
    try {
      await updateProjectProgress.mutateAsync({ projectId, progress: newProgress })
    } catch (error) {
      console.error('Failed to update project progress:', error)
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Loading projects...</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectTableSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Failed to load projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error loading project data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Manage and track project progress ({filteredAndSortedProjects.length} projects)
            </CardDescription>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Project</span>
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    {getSortIcon('priority')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('progress')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Progress</span>
                    {getSortIcon('progress')}
                  </div>
                </TableHead>
                <TableHead>Team Lead</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('due_date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Due Date</span>
                    {getSortIcon('due_date')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('budget')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Budget</span>
                    {getSortIcon('budget')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No projects found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(project.status)}
                    </TableCell>
                    
                    <TableCell>
                      {getPriorityBadge(project.priority)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{project.progress}%</span>
                          <span className="text-muted-foreground">
                            {project.status === 'completed' ? 'Complete' : 'In Progress'}
                          </span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project.team_lead_avatar} />
                          <AvatarFallback>
                            {project.team_lead_name?.split(' ').map(n => n[0]).join('') || 'TL'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{project.team_lead_name || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {new Date(project.due_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: '2-digit', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.due_date) < new Date() && project.status !== 'completed' 
                          ? 'Overdue' 
                          : `${Math.ceil((new Date(project.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                        }
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">${project.budget.toLocaleString()}</div>
                        <div className="text-muted-foreground">
                          ${project.spent.toLocaleString()} spent
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewProject?.(project)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditProject?.(project)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Team
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Timeline
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => onDeleteProject?.(project.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
