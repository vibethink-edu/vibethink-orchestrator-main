/**
 * Task Reminders Component - VibeThink Orchestrator
 * 
 * Upcoming deadlines and reminders
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Bell, Clock, AlertTriangle, Calendar, Plus } from 'lucide-react'

// Mock reminders data
const mockReminders = [
  {
    id: '1',
    title: 'Code review deadline',
    description: 'Frontend components need review by end of day',
    due_date: '2024-03-15T17:00:00Z',
    priority: 'high' as const,
    type: 'deadline' as const,
    task_title: 'Implement user authentication',
    assignee_name: 'John Smith',
    assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    id: '2',
    title: 'Team standup meeting',
    description: 'Daily standup at 9 AM',
    due_date: '2024-03-16T09:00:00Z',
    priority: 'medium' as const,
    type: 'meeting' as const,
    assignee_name: 'Team Lead',
    assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=team'
  },
  {
    id: '3',
    title: 'Performance review',
    description: 'Quarterly performance metrics review',
    due_date: '2024-03-20T14:00:00Z',
    priority: 'medium' as const,
    type: 'review' as const,
    assignee_name: 'Sarah Johnson',
    assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  }
]

export default function TaskReminders() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <AlertTriangle className="h-4 w-4" />
      case 'meeting':
        return <Calendar className="h-4 w-4" />
      case 'review':
        return <Clock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 0) return 'Overdue'
    if (diffHours < 1) return 'Due now'
    if (diffHours < 24) return `Due in ${diffHours}h`
    
    const diffDays = Math.round(diffHours / 24)
    return `Due in ${diffDays}d`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Reminders</span>
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(reminder.type)}
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{reminder.title}</p>
                  <Badge variant="secondary" className={getPriorityColor(reminder.priority)}>
                    {reminder.priority}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {reminder.description}
                </p>
                
                {reminder.task_title && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Task: {reminder.task_title}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={reminder.assignee_avatar} />
                      <AvatarFallback className="text-xs">
                        {reminder.assignee_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {reminder.assignee_name}
                    </span>
                  </div>
                  
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    {formatDueDate(reminder.due_date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {mockReminders.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming reminders</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}