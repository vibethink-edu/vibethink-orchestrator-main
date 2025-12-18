/**
 * Task Data Hook - VibeThink Orchestrator
 * 
 * Multi-tenant data fetching with company_id filtering for security
 * Following VThink 1.0 methodology and CMMI-ML3 compliance
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  Task, 
  TeamMember, 
  TaskSummary,
  TaskMetrics,
  TaskFilters,
  CreateTaskForm,
  UpdateTaskForm,
  CreateTimeEntryForm,
  TaskTimeEntry,
  Reminder
} from '../types'

// Mock Supabase client for demo - replace with real implementation
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: string) => ({
        order: (column: string, options: any) => Promise.resolve({ data: [], error: null }),
        in: (column: string, values: any[]) => ({
          order: (column: string, options: any) => Promise.resolve({ data: [], error: null })
        }),
        ilike: (column: string, value: string) => ({
          order: (column: string, options: any) => Promise.resolve({ data: [], error: null })
        })
      }),
      order: (column: string, options: any) => Promise.resolve({ data: [], error: null })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: string) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: string) => Promise.resolve({ data: null, error: null })
    })
  })
}

// Mock user for now - in real implementation, get from auth context
const mockUser = {
  id: 'user-123',
  company_id: 'company-123',
  email: 'user@example.com'
}

// Mock data for demo purposes - replace with real Supabase queries
const generateMockTasks = (): Task[] => [
  {
    id: '1',
    company_id: 'company-123',
    title: 'Implement user authentication',
    description: 'Set up secure user login and registration system with JWT tokens',
    status: 'in-progress',
    priority: 'high',
    assigned_to: 'member-1',
    assigned_to_name: 'John Smith',
    assigned_to_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    created_by: 'user-123',
    created_by_name: 'Project Manager',
    project_id: 'project-1',
    project_name: 'Website Redesign',
    category: 'development',
    tags: ['security', 'backend', 'authentication'],
    due_date: '2024-03-15',
    start_date: '2024-02-01',
    estimated_hours: 40,
    actual_hours: 25,
    time_logged: 25,
    progress: 60,
    dependencies: [],
    subtasks: [
      {
        id: 'sub-1',
        parent_task_id: '1',
        title: 'Set up JWT middleware',
        status: 'completed',
        created_at: '2024-02-01',
        updated_at: '2024-02-05'
      },
      {
        id: 'sub-2',
        parent_task_id: '1',
        title: 'Create login API endpoint',
        status: 'todo',
        created_at: '2024-02-01',
        updated_at: '2024-02-01'
      }
    ],
    attachments: [],
    comments: [],
    created_at: '2024-02-01',
    updated_at: '2024-02-08'
  },
  {
    id: '2',
    company_id: 'company-123',
    title: 'Design new dashboard layout',
    description: 'Create modern, responsive dashboard design with improved UX',
    status: 'completed',
    priority: 'medium',
    assigned_to: 'member-2',
    assigned_to_name: 'Sarah Johnson',
    assigned_to_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    created_by: 'user-123',
    created_by_name: 'Project Manager',
    project_id: 'project-1',
    project_name: 'Website Redesign',
    category: 'design',
    tags: ['ui', 'ux', 'responsive'],
    due_date: '2024-02-28',
    start_date: '2024-01-15',
    completed_at: '2024-02-25',
    estimated_hours: 32,
    actual_hours: 30,
    time_logged: 30,
    progress: 100,
    dependencies: [],
    subtasks: [],
    attachments: [],
    comments: [],
    created_at: '2024-01-15',
    updated_at: '2024-02-25'
  },
  {
    id: '3',
    company_id: 'company-123',
    title: 'API documentation update',
    description: 'Update API documentation with new endpoints and authentication',
    status: 'todo',
    priority: 'low',
    assigned_to: 'member-3',
    assigned_to_name: 'Mike Chen',
    assigned_to_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    created_by: 'user-123',
    created_by_name: 'Project Manager',
    project_id: 'project-2',
    project_name: 'API Improvements',
    category: 'documentation',
    tags: ['api', 'docs', 'swagger'],
    due_date: '2024-04-01',
    start_date: '2024-03-01',
    estimated_hours: 16,
    actual_hours: 0,
    time_logged: 0,
    progress: 0,
    dependencies: ['1'],
    subtasks: [],
    attachments: [],
    comments: [],
    created_at: '2024-02-10',
    updated_at: '2024-02-10'
  },
  {
    id: '4',
    company_id: 'company-123',
    title: 'Performance optimization',
    description: 'Optimize database queries and frontend performance',
    status: 'in-review',
    priority: 'critical',
    assigned_to: 'member-4',
    assigned_to_name: 'Emily Davis',
    assigned_to_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    created_by: 'user-123',
    created_by_name: 'Project Manager',
    project_id: 'project-1',
    project_name: 'Website Redesign',
    category: 'development',
    tags: ['performance', 'optimization', 'database'],
    due_date: '2024-03-10',
    start_date: '2024-02-15',
    estimated_hours: 48,
    actual_hours: 45,
    time_logged: 45,
    progress: 85,
    dependencies: [],
    subtasks: [],
    attachments: [],
    comments: [],
    created_at: '2024-02-15',
    updated_at: '2024-03-05'
  },
  {
    id: '5',
    company_id: 'company-123',
    title: 'Mobile app testing',
    description: 'Comprehensive testing of mobile application features',
    status: 'todo',
    priority: 'high',
    assigned_to: 'member-5',
    assigned_to_name: 'Alex Wilson',
    assigned_to_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    created_by: 'user-123',
    created_by_name: 'Project Manager',
    project_id: 'project-3',
    project_name: 'Mobile App',
    category: 'testing',
    tags: ['mobile', 'testing', 'qa'],
    due_date: '2024-03-20',
    start_date: '2024-03-01',
    estimated_hours: 60,
    actual_hours: 0,
    time_logged: 0,
    progress: 0,
    dependencies: [],
    subtasks: [],
    attachments: [],
    comments: [],
    created_at: '2024-02-20',
    updated_at: '2024-02-20'
  }
]

const generateMockTeamMembers = (): TeamMember[] => [
  {
    id: 'member-1',
    company_id: 'company-123',
    user_id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Senior Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    active_tasks: 3,
    completed_tasks: 15,
    efficiency_score: 92,
    total_hours_logged: 320,
    department: 'Engineering',
    workload_capacity: 40,
    current_workload: 32,
    availability_status: 'available'
  },
  {
    id: 'member-2',
    company_id: 'company-123',
    user_id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'UI/UX Designer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    active_tasks: 2,
    completed_tasks: 22,
    efficiency_score: 88,
    total_hours_logged: 280,
    department: 'Design',
    workload_capacity: 40,
    current_workload: 28,
    availability_status: 'busy'
  },
  {
    id: 'member-3',
    company_id: 'company-123',
    user_id: 'user-3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'Backend Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    active_tasks: 4,
    completed_tasks: 18,
    efficiency_score: 95,
    total_hours_logged: 350,
    department: 'Engineering',
    workload_capacity: 40,
    current_workload: 38,
    availability_status: 'available'
  },
  {
    id: 'member-4',
    company_id: 'company-123',
    user_id: 'user-4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Full Stack Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    active_tasks: 2,
    completed_tasks: 12,
    efficiency_score: 85,
    total_hours_logged: 240,
    department: 'Engineering',
    workload_capacity: 40,
    current_workload: 25,
    availability_status: 'available'
  },
  {
    id: 'member-5',
    company_id: 'company-123',
    user_id: 'user-5',
    name: 'Alex Wilson',
    email: 'alex.wilson@company.com',
    role: 'QA Engineer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    active_tasks: 1,
    completed_tasks: 8,
    efficiency_score: 78,
    total_hours_logged: 160,
    department: 'Quality Assurance',
    workload_capacity: 40,
    current_workload: 15,
    availability_status: 'offline'
  }
]

/**
 * Hook for fetching tasks with multi-tenant security
 * CRITICAL: Always filters by company_id for security
 */
export const useTaskData = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [taskMetrics, setTaskMetrics] = useState<TaskMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Generate mock data
        const mockTasks = generateMockTasks()
        const mockTeamMembers = generateMockTeamMembers()

        // Apply filters if provided
        let filteredTasks = mockTasks
        if (filters) {
          if (filters.status?.length) {
            filteredTasks = filteredTasks.filter(t => filters.status!.includes(t.status))
          }
          if (filters.priority?.length) {
            filteredTasks = filteredTasks.filter(t => filters.priority!.includes(t.priority))
          }
          if (filters.category?.length) {
            filteredTasks = filteredTasks.filter(t => filters.category!.includes(t.category))
          }
          if (filters.assigned_to?.length) {
            filteredTasks = filteredTasks.filter(t => filters.assigned_to!.includes(t.assigned_to))
          }
          if (filters.project_id?.length) {
            filteredTasks = filteredTasks.filter(t => t.project_id && filters.project_id!.includes(t.project_id))
          }
          if (filters.tags?.length) {
            filteredTasks = filteredTasks.filter(t => 
              filters.tags!.some(tag => t.tags.includes(tag))
            )
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filteredTasks = filteredTasks.filter(t => 
              t.title.toLowerCase().includes(searchLower) ||
              t.description.toLowerCase().includes(searchLower) ||
              (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(searchLower)) ||
              (t.project_name && t.project_name.toLowerCase().includes(searchLower)) ||
              t.tags.some(tag => tag.toLowerCase().includes(searchLower))
            )
          }
          if (filters.is_overdue) {
            const currentDate = new Date()
            filteredTasks = filteredTasks.filter(t => 
              t.status !== 'completed' && new Date(t.due_date) < currentDate
            )
          }
        }

        // Generate mock metrics
        const mockMetrics: TaskMetrics = {
          daily_completions: Array.from({length: 7}, (_, i) => ({
            date: new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: Math.floor(Math.random() * 8) + 2,
            created: Math.floor(Math.random() * 5) + 1,
            overdue: Math.floor(Math.random() * 3)
          })),
          priority_distribution: [
            { priority: 'low', count: 15, percentage: 25 },
            { priority: 'medium', count: 18, percentage: 30 },
            { priority: 'high', count: 20, percentage: 33 },
            { priority: 'critical', count: 7, percentage: 12 }
          ],
          status_distribution: [
            { status: 'todo', count: 12, percentage: 20 },
            { status: 'in-progress', count: 18, percentage: 30 },
            { status: 'in-review', count: 8, percentage: 13 },
            { status: 'completed', count: 20, percentage: 33 },
            { status: 'cancelled', count: 2, percentage: 4 }
          ],
          category_distribution: [
            { category: 'development', count: 25, percentage: 42 },
            { category: 'design', count: 12, percentage: 20 },
            { category: 'testing', count: 8, percentage: 13 },
            { category: 'documentation', count: 6, percentage: 10 },
            { category: 'meeting', count: 5, percentage: 8 },
            { category: 'research', count: 3, percentage: 5 },
            { category: 'maintenance', count: 1, percentage: 2 }
          ],
          team_performance: mockTeamMembers.map(member => ({
            member_id: member.id,
            member_name: member.name,
            tasks_completed: member.completed_tasks,
            avg_completion_time: Math.floor(Math.random() * 20) + 10,
            efficiency_score: member.efficiency_score,
            workload_percentage: Math.round((member.current_workload / member.workload_capacity) * 100)
          })),
          productivity_trends: Array.from({length: 7}, (_, i) => ({
            date: new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            tasks_completed: Math.floor(Math.random() * 10) + 5,
            hours_logged: Math.floor(Math.random() * 40) + 20,
            efficiency_score: Math.floor(Math.random() * 20) + 75,
            team_velocity: Math.floor(Math.random() * 15) + 10
          })),
          workload_distribution: mockTeamMembers.map(member => ({
            member_id: member.id,
            member_name: member.name,
            current_tasks: member.active_tasks,
            capacity: member.workload_capacity,
            utilization_percentage: Math.round((member.current_workload / member.workload_capacity) * 100),
            overload_risk: member.current_workload > member.workload_capacity * 0.9 ? 'high' : 
                          member.current_workload > member.workload_capacity * 0.75 ? 'medium' : 'low'
          }))
        }

        setTasks(filteredTasks)
        setTeamMembers(mockTeamMembers)
        setTaskMetrics(mockMetrics)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters])

  return {
    tasks,
    teamMembers,
    taskMetrics,
    isLoading,
    error
  }
}

/**
 * Hook for fetching task summary metrics
 * CRITICAL: Always filters by company_id for security
 */
export const useTaskSummary = () => {
  const [summary, setSummary] = useState<TaskSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const tasks = generateMockTasks()

        // Calculate summary metrics
        const totalTasks = tasks.length
        const todoTasks = tasks.filter(t => t.status === 'todo').length
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length
        const inReviewTasks = tasks.filter(t => t.status === 'in-review').length
        const completedTasks = tasks.filter(t => t.status === 'completed').length
        const cancelledTasks = tasks.filter(t => t.status === 'cancelled').length

        const currentDate = new Date()
        const overdueTasksCount = tasks.filter(t => 
          t.status !== 'completed' && new Date(t.due_date) < currentDate
        ).length

        const highPriorityTasks = tasks.filter(t => t.priority === 'high').length
        const criticalPriorityTasks = tasks.filter(t => t.priority === 'critical').length

        const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimated_hours, 0)
        const totalActualHours = tasks.reduce((sum, t) => sum + t.actual_hours, 0)
        const totalTimeLogged = tasks.reduce((sum, t) => sum + t.time_logged, 0)

        const completedTasksWithTime = tasks.filter(t => t.status === 'completed' && t.actual_hours > 0)
        const averageCompletionTime = completedTasksWithTime.length > 0 
          ? completedTasksWithTime.reduce((sum, t) => sum + t.actual_hours, 0) / completedTasksWithTime.length
          : 0

        const summaryData: TaskSummary = {
          total_tasks: totalTasks,
          todo_tasks: todoTasks,
          in_progress_tasks: inProgressTasks,
          in_review_tasks: inReviewTasks,
          completed_tasks: completedTasks,
          cancelled_tasks: cancelledTasks,
          overdue_tasks: overdueTasksCount,
          high_priority_tasks: highPriorityTasks,
          critical_priority_tasks: criticalPriorityTasks,
          total_estimated_hours: totalEstimatedHours,
          total_actual_hours: totalActualHours,
          total_time_logged: totalTimeLogged,
          average_completion_time: averageCompletionTime,
          completion_rate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
          on_time_delivery_rate: 87, // Mock value
          team_productivity_score: 85 // Mock value
        }

        setSummary(summaryData)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return {
    data: summary,
    isLoading,
    error
  }
}

/**
 * Hook for creating new tasks
 * CRITICAL: Always includes company_id for security
 */
export const useCreateTask = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async (taskData: CreateTaskForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real implementation, would call Supabase
      console.log('Creating task:', { ...taskData, company_id: mockUser.company_id })
      
      return { id: 'new-task-' + Date.now(), ...taskData }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutateAsync,
    isLoading
  }
}

/**
 * Hook for updating tasks
 * CRITICAL: Always filters by company_id for security
 */
export const useUpdateTask = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async ({ taskId, taskData }: { taskId: string; taskData: UpdateTaskForm }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, would call Supabase with company_id filter
      console.log('Updating task:', { taskId, taskData, company_id: mockUser.company_id })
      
      return { taskId, ...taskData }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutateAsync,
    isLoading
  }
}

/**
 * Hook for deleting tasks
 * CRITICAL: Always filters by company_id for security
 */
export const useDeleteTask = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async (taskId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, would call Supabase with company_id filter
      console.log('Deleting task:', { taskId, company_id: mockUser.company_id })
      
      return { taskId }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutateAsync,
    isLoading
  }
}

/**
 * Hook for logging time entries
 * CRITICAL: Always includes company_id for security
 */
export const useCreateTimeEntry = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async (timeData: CreateTimeEntryForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, would call Supabase
      console.log('Creating time entry:', { ...timeData, user_id: mockUser.id })
      
      return { id: 'new-time-' + Date.now(), ...timeData, user_id: mockUser.id }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutateAsync,
    isLoading
  }
}

/**
 * Hook for fetching task time entries
 * CRITICAL: Always filters by company_id for security
 */
export const useTaskTimeEntries = (taskId: string) => {
  const [timeEntries, setTimeEntries] = useState<TaskTimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Generate mock time entries
        const mockTimeEntries: TaskTimeEntry[] = [
          {
            id: 'time-1',
            task_id: taskId,
            user_id: 'user-1',
            user_name: 'John Smith',
            description: 'Initial implementation',
            hours: 4,
            start_time: '2024-02-01T09:00:00Z',
            end_time: '2024-02-01T13:00:00Z',
            billable: true,
            created_at: '2024-02-01T13:00:00Z'
          },
          {
            id: 'time-2',
            task_id: taskId,
            user_id: 'user-1',
            user_name: 'John Smith',
            description: 'Testing and debugging',
            hours: 3,
            start_time: '2024-02-02T14:00:00Z',
            end_time: '2024-02-02T17:00:00Z',
            billable: true,
            created_at: '2024-02-02T17:00:00Z'
          }
        ]

        setTimeEntries(mockTimeEntries)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    if (taskId) {
      fetchTimeEntries()
    }
  }, [taskId])

  return {
    timeEntries,
    isLoading,
    error
  }
}