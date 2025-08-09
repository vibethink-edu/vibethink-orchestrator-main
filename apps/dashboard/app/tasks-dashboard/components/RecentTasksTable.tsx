/**
 * Recent Tasks Table Component - VibeThink Orchestrator
 * 
 * Comprehensive table for viewing and managing tasks
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Progress } from '@/shared/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  Target
} from 'lucide-react'
import { useTaskData } from '../hooks'
import { Task } from '../types'

interface RecentTasksTableProps {
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onViewTask: (task: Task) => void
  onCompleteTask: (taskId: string) => void
  onAssignTask: (taskId: string, assigneeId: string) => void
}

export default function RecentTasksTable({
  onEditTask,
  onDeleteTask,
  onViewTask,
  onCompleteTask,
  onAssignTask
}: RecentTasksTableProps) {
  const { tasks, isLoading } = useTaskData()
  const [sortBy, setSortBy] = useState<'due_date' | 'priority' | 'status' | 'created_at'>('due_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground">Create your first task to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'in-review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category: Task['category']) => {
    const iconClass = "h-4 w-4"
    switch (category) {
      case 'development':
        return <Target className={iconClass} />
      case 'design':
        return <Edit className={iconClass} />
      case 'testing':
        return <CheckCircle className={iconClass} />
      case 'documentation':
        return <Edit className={iconClass} />
      case 'meeting':
        return <User className={iconClass} />
      case 'research':
        return <Target className={iconClass} />
      default:
        return <Target className={iconClass} />
    }
  }

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && new Date(task.due_date) < new Date()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDueDate = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate)
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  }

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue: any = a[sortBy]
    let bValue: any = b[sortBy]

    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
      aValue = priorityOrder[a.priority]
      bValue = priorityOrder[b.priority]
    }

    if (sortBy === 'due_date' || sortBy === 'created_at') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Recent Tasks</CardTitle>
          <Badge variant="outline">
            {tasks.length} Tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium line-clamp-1">{task.title}</p>
                        {isOverdue(task) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs px-1 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assigned_to_avatar} />
                        <AvatarFallback>
                          {task.assigned_to_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {task.assigned_to_name || 'Unassigned'}
                        </p>
                        {task.project_name && (
                          <p className="text-xs text-muted-foreground">
                            {task.project_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(task.status)}
                    >
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{task.progress}%</span>
                        <span className="text-xs text-muted-foreground">
                          {task.actual_hours}h / {task.estimated_hours}h
                        </span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${
                        isOverdue(task) ? 'text-red-600' : 'text-foreground'
                      }`}>
                        {new Date(task.due_date).toLocaleDateString()}
                      </p>
                      <p className={`text-xs ${
                        isOverdue(task) ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {formatDueDate(task.due_date)}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(task.category)}
                      <span className="text-sm capitalize">
                        {task.category}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewTask(task)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditTask(task)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit task
                        </DropdownMenuItem>
                        {task.status !== 'completed' && (
                          <DropdownMenuItem onClick={() => onCompleteTask(task.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteTask(task.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}