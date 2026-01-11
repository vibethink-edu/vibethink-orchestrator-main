/**
 * Add Reminder Dialog Component
 * VibeThink Orchestrator
 * 
 * Modal for creating and editing reminders with form validation
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge
} from '@vibethink/ui'
import {
  Calendar,
  Clock,
  Bell,
  Target,
  Users,
  CheckCircle,
  AlertTriangle,
  Save,
  X
} from "@vibethink/ui/icons"
import { useCreateReminder } from '../hooks/useTeamData'
import { useProjectData } from '../hooks/useProjectData'

import { CreateReminderForm, Reminder } from '../types'
import { useTranslation } from '@/lib/i18n'

interface AddReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingReminder?: Reminder | null
}

const reminderTypes = [
  { value: 'deadline', label: 'Deadline', icon: Clock, description: 'Task or project deadline' },
  { value: 'meeting', label: 'Meeting', icon: Users, description: 'Team meeting or call' },
  { value: 'review', label: 'Review', icon: CheckCircle, description: 'Project or code review' },
  { value: 'milestone', label: 'Milestone', icon: Target, description: 'Project milestone' },
  { value: 'general', label: 'General', icon: Bell, description: 'General reminder' }
] as const

const priorityLevels = [
  { value: 'low', label: 'Low', color: 'text-blue-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
] as const

const initialFormData: CreateReminderForm = {
  title: '',
  description: '',
  type: 'general',
  priority: 'medium',
  due_date: '',
  project_id: undefined,
  task_id: undefined
}

export const AddReminderDialog: React.FC<AddReminderDialogProps> = ({
  open,
  onOpenChange,
  editingReminder
}) => {
  const { t } = useTranslation('projects')
  const [formData, setFormData] = useState<CreateReminderForm>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createReminder = useCreateReminder()
  const { projects, tasks } = useProjectData()

  // Populate form when editing
  useEffect(() => {
    if (editingReminder) {
      setFormData({
        title: editingReminder.title,
        description: editingReminder.description,
        type: editingReminder.type,
        priority: editingReminder.priority,
        due_date: editingReminder.due_date,
        project_id: editingReminder.project_id,
        task_id: editingReminder.task_id
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [editingReminder, open])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = t('reminders.titleRequired')
    }

    if (!formData.due_date) {
      newErrors.due_date = t('reminders.dueDateRequired')
    } else {
      const dueDate = new Date(formData.due_date)
      if (dueDate < new Date()) {
        newErrors.due_date = t('reminders.dueDatePast')
      }
    }

    if (!formData.type) {
      newErrors.type = t('reminders.typeRequired')
    }

    if (!formData.priority) {
      newErrors.priority = t('reminders.priorityRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createReminder.mutateAsync(formData)
      onOpenChange(false)
      setFormData(initialFormData)
    } catch (error) {
      console.error('Failed to create reminder:', error)
      setErrors({ submit: t('reminders.failedToCreate') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData(initialFormData)
    setErrors({})
  }

  const updateFormData = <K extends keyof CreateReminderForm>(
    key: K,
    value: CreateReminderForm[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const selectedType = reminderTypes.find(type => type.value === formData.type)
  const selectedPriority = priorityLevels.find(priority => priority.value === formData.priority)

  // Get current date-time for min attribute
  const now = new Date()
  const minDateTime = now.toISOString().slice(0, 16)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>{editingReminder ? t('reminders.editReminder') : t('reminders.addNewReminder')}</span>
          </DialogTitle>
          <DialogDescription>
            {editingReminder
              ? t('reminders.updateDetails')
              : t('reminders.createNewDesc')
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('reminders.title')} *</Label>
            <Input
              id="title"
              placeholder={t('reminders.enterTitle')}
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('reminders.description')}</Label>
            <Textarea
              id="description"
              placeholder={t('reminders.addDetails')}
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Type and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t('reminders.type')} *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => updateFormData('type', value)}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('reminders.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  {reminderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">{t('reminders.priority')} *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => updateFormData('priority', value)}
              >
                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('reminders.selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${priority.color.replace('text-', 'bg-')}`} />
                        <span>{priority.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date">{t('reminders.dueDate')} *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                min={minDateTime}
                onChange={(e) => updateFormData('due_date', e.target.value)}
                className={`pl-10 ${errors.due_date ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.due_date && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.due_date}</span>
              </p>
            )}
          </div>

          {/* Project Association */}
          <div className="space-y-2">
            <Label htmlFor="project">{t('reminders.associateProject')}</Label>
            <Select
              value={formData.project_id || ''}
              onValueChange={(value) => updateFormData('project_id', value === 'none' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('reminders.selectProject')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('reminders.noProject')}</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Association (if project selected) */}
          {formData.project_id && (
            <div className="space-y-2">
              <Label htmlFor="task">{t('reminders.associateTask')}</Label>
              <Select
                value={formData.task_id || ''}
                onValueChange={(value) => updateFormData('task_id', value === 'none' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('reminders.selectTask')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('reminders.noTask')}</SelectItem>
                  {tasks?.filter(task => task.project_id === formData.project_id).map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview */}
          {formData.title && formData.type && formData.priority && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">{t('reminders.preview')}</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {selectedType && <selectedType.icon className="h-4 w-4" />}
                  <span className="font-medium">{formData.title}</span>
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                )}
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedType?.label}
                  </Badge>
                  <Badge
                    variant={formData.priority === 'urgent' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedPriority?.label}
                  </Badge>
                  {formData.due_date && (
                    <Badge variant="outline" className="text-xs">
                      {new Date(formData.due_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })} {new Date(formData.due_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.submit}</span>
              </p>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-1" />
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-24"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                {editingReminder ? t('common.update') : t('common.create')} {t('reports.reminder')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
