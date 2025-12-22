/**
 * Reminders Component
 * VibeThink Orchestrator
 * 
 * Task reminders and deadline management with priority indicators
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@vibethink/ui'
import {
  Bell,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  MoreHorizontal,
  Trash2,
  Edit,
  Target
} from 'lucide-react'
import { useReminders, useCompleteReminder } from '../hooks/useTeamData'
import { AddReminderDialog } from './AddReminderDialog'

import { Reminder } from '../types'
import { useTranslation } from '@/lib/i18n'

interface RemindersProps {
  className?: string
}

type ReminderFilter = 'all' | 'urgent' | 'today' | 'overdue' | 'upcoming'

const getPriorityColor = (priority: Reminder['priority']) => {
  switch (priority) {
    case 'urgent': return 'text-red-500'
    case 'high': return 'text-orange-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-blue-500'
    default: return 'text-muted-foreground'
  }
}

const getPriorityBadge = (priority: Reminder['priority']) => {
  const variants = {
    urgent: 'destructive',
    high: 'default',
    medium: 'secondary',
    low: 'outline'
  } as const

  return (
    <Badge variant={variants[priority] as any} className="text-xs">
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

const getTypeIcon = (type: Reminder['type']) => {
  switch (type) {
    case 'deadline': return <Clock className="h-4 w-4" />
    case 'meeting': return <Users className="h-4 w-4" />
    case 'review': return <CheckCircle className="h-4 w-4" />
    case 'milestone': return <Target className="h-4 w-4" />
    case 'general': return <Bell className="h-4 w-4" />
    default: return <Bell className="h-4 w-4" />
  }
}

const getTypeBadge = (type: Reminder['type']) => {
  const labels = {
    deadline: 'Deadline',
    meeting: 'Meeting',
    review: 'Review',
    milestone: 'Milestone',
    general: 'General'
  }

  const variants = {
    deadline: 'destructive',
    meeting: 'default',
    review: 'secondary',
    milestone: 'default',
    general: 'outline'
  } as const

  return (
    <Badge variant={variants[type] as any} className="text-xs">
      {labels[type]}
    </Badge>
  )
}

const isReminderOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const isReminderToday = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  return (
    due.getDate() === today.getDate() &&
    due.getMonth() === today.getMonth() &&
    due.getFullYear() === today.getFullYear()
  )
}

const isReminderUpcoming = (dueDate: string) => {
  const due = new Date(dueDate)
  const now = new Date()
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  return due > now && due < threeDaysFromNow
}

const getTimeUntil = (dueDate: string) => {
  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()

  if (diffMs < 0) return 'Overdue'

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
  if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  if (diffMinutes > 0) return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
  return 'Due now'
}

const ReminderItem: React.FC<{
  reminder: Reminder
  onComplete: (id: string) => void
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
}> = ({ reminder, onComplete, onEdit, onDelete }) => {
  const isOverdue = isReminderOverdue(reminder.due_date)
  const isToday = isReminderToday(reminder.due_date)
  const isUrgent = reminder.priority === 'urgent' || isOverdue

  return (
    <div className={`p-4 border rounded-lg space-y-3 ${isOverdue ? 'border-red-200 bg-red-50/50' : isToday ? 'border-yellow-200 bg-yellow-50/50' : 'hover:bg-muted/50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={reminder.is_completed}
            onCheckedChange={() => onComplete(reminder.id)}
            className="mt-1"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <div className={getPriorityColor(reminder.priority)}>
                {getTypeIcon(reminder.type)}
              </div>
              <h4 className={`font-medium text-sm ${reminder.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                {reminder.title}
              </h4>
              {isUrgent && !reminder.is_completed && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>

            {reminder.description && (
              <p className={`text-sm ${reminder.is_completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                {reminder.description}
              </p>
            )}

            <div className="flex items-center space-x-2 flex-wrap">
              {getPriorityBadge(reminder.priority)}
              {getTypeBadge(reminder.type)}

              {reminder.project_name && (
                <Badge variant="outline" className="text-xs">
                  {reminder.project_name}
                </Badge>
              )}

              {reminder.task_title && (
                <Badge variant="outline" className="text-xs">
                  {reminder.task_title}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(reminder.due_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  })} {new Date(reminder.due_date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </span>
              </div>
              {!reminder.is_completed && (
                <div className={`font-medium ${isOverdue ? 'text-red-600' : isToday ? 'text-yellow-600' : ''}`}>
                  {isOverdue ? 'Overdue' : getTimeUntil(reminder.due_date)}
                </div>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(reminder)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(reminder.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export const Reminders: React.FC<RemindersProps> = ({ className }) => {
  const { t } = useTranslation('projects')
  const [filter, setFilter] = useState<ReminderFilter>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

  const { reminders, isLoading, error } = useReminders()
  const completeReminder = useCompleteReminder()

  const filteredReminders = React.useMemo(() => {
    if (!reminders) return []

    return reminders.filter(reminder => {
      if (reminder.is_completed) return false // Don't show completed reminders

      switch (filter) {
        case 'urgent':
          return reminder.priority === 'urgent' || isReminderOverdue(reminder.due_date)
        case 'today':
          return isReminderToday(reminder.due_date)
        case 'overdue':
          return isReminderOverdue(reminder.due_date)
        case 'upcoming':
          return isReminderUpcoming(reminder.due_date)
        case 'all':
        default:
          return true
      }
    }).sort((a, b) => {
      // Sort by priority and due date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })
  }, [reminders, filter])

  const handleCompleteReminder = async (id: string) => {
    try {
      await completeReminder.mutateAsync(id)
    } catch (error) {
      console.error('Failed to complete reminder:', error)
    }
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setIsAddDialogOpen(true)
  }

  const handleDeleteReminder = (id: string) => {
    // TODO: Implement delete reminder mutation
    console.log('Delete reminder:', id)
  }

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false)
    setEditingReminder(null)
  }

  const urgentCount = reminders?.filter(r =>
    !r.is_completed && (r.priority === 'urgent' || isReminderOverdue(r.due_date))
  ).length || 0

  const todayCount = reminders?.filter(r =>
    !r.is_completed && isReminderToday(r.due_date)
  ).length || 0

  const overdueCount = reminders?.filter(r =>
    !r.is_completed && isReminderOverdue(r.due_date)
  ).length || 0

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('sections.reminders')}</CardTitle>
          <CardDescription>{t('common.loading')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('sections.reminders')}</CardTitle>
          <CardDescription>{t('summary.failedToLoad')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">{t('summary.errorLoadingReminders')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>{t('sections.reminders')}</span>
                {urgentCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {urgentCount} {t('priority.urgent').toLowerCase()}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {t('sections.remindersDesc')}
              </CardDescription>
            </div>

            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              {t('common.add')}
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mt-4">
            <Select value={filter} onValueChange={(value: ReminderFilter) => setFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('reminders.allReminders')}</SelectItem>
                <SelectItem value="urgent">
                  {t('priority.urgent')} {urgentCount > 0 && `(${urgentCount})`}
                </SelectItem>
                <SelectItem value="today">
                  {t('reminders.today')} {todayCount > 0 && `(${todayCount})`}
                </SelectItem>
                <SelectItem value="overdue">
                  {t('reminders.overdue')} {overdueCount > 0 && `(${overdueCount})`}
                </SelectItem>
                <SelectItem value="upcoming">{t('reminders.upcoming')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredReminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">{t('reminders.noReminders')}</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all'
                  ? t('reminders.allCaughtUp')
                  : t('reminders.noFilterReminders', { filter: filter })
                }
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('reminders.addReminder')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredReminders.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onComplete={handleCompleteReminder}
                  onEdit={handleEditReminder}
                  onDelete={handleDeleteReminder}
                />
              ))}
            </div>
          )}

          {/* Quick Stats */}
          {reminders && reminders.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium text-red-600">{overdueCount}</div>
                  <div className="text-muted-foreground">{t('reminders.overdue')}</div>
                </div>
                <div>
                  <div className="font-medium text-yellow-600">{todayCount}</div>
                  <div className="text-muted-foreground">{t('reminders.today')}</div>
                </div>
                <div>
                  <div className="font-medium text-blue-600">
                    {reminders.filter(r => isReminderUpcoming(r.due_date) && !r.is_completed).length}
                  </div>
                  <div className="text-muted-foreground">{t('reminders.upcoming')}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddReminderDialog
        open={isAddDialogOpen}
        onOpenChange={handleCloseDialog}
        editingReminder={editingReminder}
      />
    </>
  )
}
