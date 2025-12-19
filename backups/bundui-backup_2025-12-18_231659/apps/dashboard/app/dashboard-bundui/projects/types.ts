/**
 * Project Management Types - VibeThink Orchestrator
 * 
 * Complete TypeScript definitions for project management dashboard
 * Following VThink 1.0 methodology with multi-tenant security
 */

export interface Project {
  id: string
  company_id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number // 0-100
  start_date: string
  due_date: string
  team_lead_id: string
  team_lead_name?: string
  team_lead_avatar?: string
  budget: number
  spent: number
  estimated_hours: number
  actual_hours: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  company_id: string
  project_id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string
  assigned_to_name?: string
  assigned_to_avatar?: string
  due_date: string
  estimated_hours: number
  actual_hours: number
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
  active_projects: number
  completed_tasks: number
  efficiency_score: number
  total_hours_logged: number
  department: string
}

export interface ProjectSummary {
  total_projects: number
  active_projects: number
  completed_projects: number
  on_hold_projects: number
  cancelled_projects: number
  total_budget: number
  total_spent: number
  total_team_members: number
  overdue_tasks: number
  completed_tasks_this_month: number
  average_project_completion_time: number
  success_rate: number
  on_time_delivery_rate: number
  budget_adherence_rate: number
}

export interface ProjectEfficiencyData {
  date: string
  completed_tasks: number
  total_hours: number
  efficiency_score: number
  team_productivity: number
}

export interface AchievementData {
  year: number
  completed_projects: number
  milestones_achieved: number
  goals_met: number
  revenue_generated: number
}

export interface Reminder {
  id: string
  company_id: string
  user_id: string
  project_id?: string
  task_id?: string
  title: string
  description: string
  type: 'deadline' | 'meeting' | 'review' | 'milestone' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string
  is_completed: boolean
  created_at: string
  updated_at: string
  project_name?: string
  task_title?: string
}

export interface ProjectReport {
  id: string
  name: string
  description: string
  type: 'status' | 'performance' | 'budget' | 'timeline' | 'team'
  date_range: {
    start: string
    end: string
  }
  generated_at: string
  file_url?: string
}

export interface ProjectFilters {
  status?: Project['status'][]
  priority?: Project['priority'][]
  team_lead?: string[]
  date_range?: {
    start: string
    end: string
  }
  search?: string
}

export interface TaskFilters {
  status?: Task['status'][]
  priority?: Task['priority'][]
  assigned_to?: string[]
  project_id?: string[]
  due_date_range?: {
    start: string
    end: string
  }
  search?: string
}

// Chart data interfaces
export interface ProjectOverviewChartData {
  name: string
  value: number
  percentage: number
  color: string
}

export interface ProjectEfficiencyChartData {
  date: string
  efficiency: number
  productivity: number
  completed_tasks: number
}

export interface AchievementChartData {
  year: string
  projects: number
  milestones: number
  goals: number
}

// Form interfaces
export interface CreateProjectForm {
  name: string
  description: string
  priority: Project['priority']
  start_date: string
  due_date: string
  team_lead_id: string
  budget: number
  estimated_hours: number
}

export interface CreateTaskForm {
  project_id: string
  title: string
  description: string
  priority: Task['priority']
  assigned_to: string
  due_date: string
  estimated_hours: number
}

export interface CreateReminderForm {
  title: string
  description: string
  type: Reminder['type']
  priority: Reminder['priority']
  due_date: string
  project_id?: string
  task_id?: string
}

// API Response interfaces
export interface ProjectsResponse {
  data: Project[]
  total: number
  page: number
  limit: number
}

export interface TasksResponse {
  data: Task[]
  total: number
  page: number
  limit: number
}

export interface TeamMembersResponse {
  data: TeamMember[]
  total: number
}

export interface ProjectSummaryResponse {
  data: ProjectSummary
}

// Error interfaces
export interface ProjectManagementError {
  code: string
  message: string
  details?: Record<string, any>
}

// Success metrics interfaces
export interface SuccessMetrics {
  project_success_rate: number
  on_time_delivery: number
  budget_adherence: number
  client_satisfaction: number
  team_efficiency: number
  average_project_duration: number
  milestone_completion_rate: number
  resource_utilization: number
}

export interface MetricCard {
  title: string
  value: string | number
  change: string
  isPositive: boolean
  description: string
  icon: string
}