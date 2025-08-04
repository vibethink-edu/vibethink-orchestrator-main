/**
 * Tasks Management Types - VibeThink Orchestrator
 * 
 * Complete TypeScript definitions for task management dashboard
 * Following VThink 1.0 methodology with multi-tenant security
 */

export interface Task {
  id: string
  company_id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'in-review' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assigned_to: string
  assigned_to_name?: string
  assigned_to_avatar?: string
  created_by: string
  created_by_name?: string
  project_id?: string
  project_name?: string
  category: 'development' | 'design' | 'testing' | 'documentation' | 'meeting' | 'research' | 'maintenance' | 'other'
  tags: string[]
  due_date: string
  start_date?: string
  completed_at?: string
  estimated_hours: number
  actual_hours: number
  time_logged: number
  progress: number // 0-100
  dependencies: string[] // Task IDs that must be completed first
  subtasks: SubTask[]
  attachments: TaskAttachment[]
  comments: TaskComment[]
  created_at: string
  updated_at: string
}

export interface SubTask {
  id: string
  parent_task_id: string
  title: string
  description?: string
  status: 'todo' | 'completed'
  assigned_to?: string
  due_date?: string
  created_at: string
  updated_at: string
}

export interface TaskAttachment {
  id: string
  task_id: string
  file_name: string
  file_url: string
  file_size: number
  file_type: string
  uploaded_by: string
  uploaded_by_name?: string
  created_at: string
}

export interface TaskComment {
  id: string
  task_id: string
  user_id: string
  user_name?: string
  user_avatar?: string
  content: string
  is_internal: boolean
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  company_id: string
  user_id: string
  name: string
  email: string
  role: string
  avatar_url?: string
  active_tasks: number
  completed_tasks: number
  efficiency_score: number
  total_hours_logged: number
  department: string
  workload_capacity: number
  current_workload: number
  availability_status: 'available' | 'busy' | 'offline'
}

export interface TaskSummary {
  total_tasks: number
  todo_tasks: number
  in_progress_tasks: number
  in_review_tasks: number
  completed_tasks: number
  cancelled_tasks: number
  overdue_tasks: number
  high_priority_tasks: number
  critical_priority_tasks: number
  total_estimated_hours: number
  total_actual_hours: number
  total_time_logged: number
  average_completion_time: number
  completion_rate: number
  on_time_delivery_rate: number
  team_productivity_score: number
}

export interface TaskMetrics {
  daily_completions: DailyTaskCompletion[]
  priority_distribution: PriorityDistribution[]
  status_distribution: StatusDistribution[]
  category_distribution: CategoryDistribution[]
  team_performance: TeamPerformance[]
  productivity_trends: ProductivityTrend[]
  workload_distribution: WorkloadDistribution[]
}

export interface DailyTaskCompletion {
  date: string
  completed: number
  created: number
  overdue: number
}

export interface PriorityDistribution {
  priority: Task['priority']
  count: number
  percentage: number
}

export interface StatusDistribution {
  status: Task['status']
  count: number
  percentage: number
}

export interface CategoryDistribution {
  category: Task['category']
  count: number
  percentage: number
}

export interface TeamPerformance {
  member_id: string
  member_name: string
  tasks_completed: number
  avg_completion_time: number
  efficiency_score: number
  workload_percentage: number
}

export interface ProductivityTrend {
  date: string
  tasks_completed: number
  hours_logged: number
  efficiency_score: number
  team_velocity: number
}

export interface WorkloadDistribution {
  member_id: string
  member_name: string
  current_tasks: number
  capacity: number
  utilization_percentage: number
  overload_risk: 'low' | 'medium' | 'high'
}

export interface TaskTemplate {
  id: string
  company_id: string
  name: string
  description: string
  category: Task['category']
  priority: Task['priority']
  estimated_hours: number
  subtasks: TaskTemplateSubTask[]
  checklist: TaskTemplateChecklistItem[]
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface TaskTemplateSubTask {
  title: string
  description?: string
  estimated_hours: number
}

export interface TaskTemplateChecklistItem {
  title: string
  description?: string
  required: boolean
}

export interface Reminder {
  id: string
  company_id: string
  user_id: string
  task_id?: string
  title: string
  description: string
  type: 'deadline' | 'follow-up' | 'review' | 'meeting' | 'milestone' | 'custom'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string
  reminder_time?: string
  is_completed: boolean
  is_recurring: boolean
  recurrence_pattern?: string
  created_at: string
  updated_at: string
  task_title?: string
}

export interface TaskReport {
  id: string
  name: string
  description: string
  type: 'productivity' | 'team-performance' | 'time-tracking' | 'completion-rate' | 'workload' | 'custom'
  date_range: {
    start: string
    end: string
  }
  filters: TaskFilters
  generated_at: string
  file_url?: string
  data: any
}

export interface TaskFilters {
  status?: Task['status'][]
  priority?: Task['priority'][]
  category?: Task['category'][]
  assigned_to?: string[]
  created_by?: string[]
  project_id?: string[]
  tags?: string[]
  due_date_range?: {
    start: string
    end: string
  }
  created_date_range?: {
    start: string
    end: string
  }
  completed_date_range?: {
    start: string
    end: string
  }
  estimated_hours_range?: {
    min: number
    max: number
  }
  search?: string
  has_dependencies?: boolean
  has_attachments?: boolean
  is_overdue?: boolean
}

// Chart data interfaces
export interface TaskOverviewChartData {
  name: string
  value: number
  percentage: number
  color: string
}

export interface TaskPriorityChartData {
  priority: string
  count: number
  percentage: number
  color: string
}

export interface ProductivityChartData {
  date: string
  completed: number
  created: number
  efficiency: number
  velocity: number
}

export interface TeamWorkloadChartData {
  member: string
  current_tasks: number
  capacity: number
  utilization: number
}

export interface TaskCompletionTrendData {
  date: string
  completed: number
  on_time: number
  overdue: number
  average_time: number
}

// Form interfaces
export interface CreateTaskForm {
  title: string
  description: string
  priority: Task['priority']
  category: Task['category']
  assigned_to: string
  project_id?: string
  tags: string[]
  due_date: string
  start_date?: string
  estimated_hours: number
  dependencies: string[]
  subtasks: CreateSubTaskForm[]
  template_id?: string
}

export interface CreateSubTaskForm {
  title: string
  description?: string
  assigned_to?: string
  due_date?: string
}

export interface UpdateTaskForm {
  title?: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  category?: Task['category']
  assigned_to?: string
  project_id?: string
  tags?: string[]
  due_date?: string
  start_date?: string
  estimated_hours?: number
  actual_hours?: number
  progress?: number
  dependencies?: string[]
}

export interface CreateReminderForm {
  title: string
  description: string
  type: Reminder['type']
  priority: Reminder['priority']
  due_date: string
  reminder_time?: string
  task_id?: string
  is_recurring: boolean
  recurrence_pattern?: string
}

export interface TaskTimeEntry {
  id: string
  task_id: string
  user_id: string
  user_name?: string
  description: string
  hours: number
  start_time: string
  end_time: string
  billable: boolean
  created_at: string
}

export interface CreateTimeEntryForm {
  task_id: string
  description: string
  hours: number
  start_time: string
  end_time: string
  billable: boolean
}

// API Response interfaces
export interface TasksResponse {
  data: Task[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface TaskSummaryResponse {
  data: TaskSummary
}

export interface TaskMetricsResponse {
  data: TaskMetrics
}

export interface TeamMembersResponse {
  data: TeamMember[]
  total: number
}

export interface TaskTemplatesResponse {
  data: TaskTemplate[]
  total: number
}

export interface RemindersResponse {
  data: Reminder[]
  total: number
}

export interface TaskReportsResponse {
  data: TaskReport[]
  total: number
}

export interface TimeEntriesResponse {
  data: TaskTimeEntry[]
  total: number
}

// Error interfaces
export interface TaskManagementError {
  code: string
  message: string
  details?: Record<string, any>
  field?: string
}

// Success metrics interfaces
export interface TaskSuccessMetrics {
  completion_rate: number
  on_time_delivery: number
  quality_score: number
  team_satisfaction: number
  productivity_index: number
  average_cycle_time: number
  defect_rate: number
  rework_rate: number
}

export interface MetricCard {
  title: string
  value: string | number
  change: string
  isPositive: boolean
  description: string
  icon: string
  trend?: number[]
}

// Notification interfaces
export interface TaskNotification {
  id: string
  user_id: string
  task_id: string
  type: 'assigned' | 'due_soon' | 'overdue' | 'completed' | 'comment' | 'dependency_resolved'
  title: string
  message: string
  is_read: boolean
  created_at: string
  task_title?: string
  task_priority?: Task['priority']
}

// Integration interfaces
export interface TaskIntegration {
  id: string
  company_id: string
  type: 'calendar' | 'slack' | 'email' | 'jira' | 'github' | 'trello'
  config: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

// Recurring task interfaces
export interface RecurringTask {
  id: string
  company_id: string
  template_id: string
  title: string
  description: string
  priority: Task['priority']
  category: Task['category']
  assigned_to: string
  estimated_hours: number
  recurrence_pattern: string // cron-like pattern
  next_due_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Workflow interfaces
export interface TaskWorkflow {
  id: string
  company_id: string
  name: string
  description: string
  steps: WorkflowStep[]
  trigger_conditions: WorkflowTrigger[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'status_change' | 'assignment' | 'notification' | 'automation'
  config: Record<string, any>
  order: number
}

export interface WorkflowTrigger {
  id: string
  event: 'task_created' | 'status_changed' | 'due_date_approaching' | 'overdue'
  conditions: Record<string, any>
}