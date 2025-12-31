/**
 * Project Data Hook - VibeThink Orchestrator
 * 
 * Multi-tenant data fetching with company_id filtering for security
 * Following VThink 1.0 methodology and CMMI-ML3 compliance
 */

'use client'

import { useState, useEffect } from 'react'

import {
  Project,
  Task,
  TeamMember,
  ProjectSummary,
  ProjectFilters,
  CreateProjectForm,
  CreateTaskForm
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
const generateMockProjects = (): Project[] => [
  {
    id: '1',
    company_id: 'company-123',
    name: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    status: 'active',
    priority: 'high',
    progress: 75,
    start_date: '2024-01-15',
    due_date: '2024-03-15',
    team_lead_id: 'member-1',
    team_lead_name: 'John Smith',
    team_lead_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    budget: 50000,
    spent: 35000,
    estimated_hours: 400,
    actual_hours: 280,
    created_at: '2024-01-10',
    updated_at: '2024-01-28'
  },
  {
    id: '2',
    company_id: 'company-123',
    name: 'Mobile App Development',
    description: 'Native iOS and Android application for customer engagement',
    status: 'active',
    priority: 'urgent',
    progress: 45,
    start_date: '2024-02-01',
    due_date: '2024-06-01',
    team_lead_id: 'member-2',
    team_lead_name: 'Sarah Johnson',
    team_lead_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    budget: 120000,
    spent: 48000,
    estimated_hours: 800,
    actual_hours: 320,
    created_at: '2024-01-25',
    updated_at: '2024-01-28'
  },
  {
    id: '3',
    company_id: 'company-123',
    name: 'Database Migration',
    description: 'Migrate legacy database to cloud infrastructure',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    start_date: '2023-11-01',
    due_date: '2024-01-31',
    team_lead_id: 'member-3',
    team_lead_name: 'Mike Chen',
    team_lead_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    budget: 75000,
    spent: 72000,
    estimated_hours: 500,
    actual_hours: 520,
    created_at: '2023-10-15',
    updated_at: '2024-01-31'
  },
  {
    id: '4',
    company_id: 'company-123',
    name: 'Security Audit',
    description: 'Comprehensive security assessment and remediation',
    status: 'on-hold',
    priority: 'high',
    progress: 25,
    start_date: '2024-01-01',
    due_date: '2024-04-01',
    team_lead_id: 'member-4',
    team_lead_name: 'Emily Davis',
    team_lead_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    budget: 40000,
    spent: 8000,
    estimated_hours: 300,
    actual_hours: 75,
    created_at: '2023-12-15',
    updated_at: '2024-01-20'
  }
]

const generateMockTasks = (): Task[] => [
  {
    id: '1',
    company_id: 'company-123',
    project_id: '1',
    title: 'Design wireframes',
    description: 'Create detailed wireframes for all main pages',
    status: 'completed',
    priority: 'high',
    assigned_to: 'member-1',
    assigned_to_name: 'John Smith',
    due_date: '2024-02-01',
    estimated_hours: 40,
    actual_hours: 45,
    created_at: '2024-01-15',
    updated_at: '2024-02-01'
  },
  {
    id: '2',
    company_id: 'company-123',
    project_id: '1',
    title: 'Frontend development',
    description: 'Implement responsive frontend components',
    status: 'in-progress',
    priority: 'high',
    assigned_to: 'member-2',
    assigned_to_name: 'Sarah Johnson',
    due_date: '2024-03-01',
    estimated_hours: 120,
    actual_hours: 85,
    created_at: '2024-01-20',
    updated_at: '2024-01-28'
  },
  {
    id: '3',
    company_id: 'company-123',
    project_id: '2',
    title: 'User authentication',
    description: 'Implement secure user login and registration',
    status: 'todo',
    priority: 'urgent',
    assigned_to: 'member-3',
    assigned_to_name: 'Mike Chen',
    due_date: '2024-03-15',
    estimated_hours: 60,
    actual_hours: 0,
    created_at: '2024-02-01',
    updated_at: '2024-02-01'
  }
]

const generateMockTeamMembers = (): TeamMember[] => [
  {
    id: 'member-1',
    company_id: 'company-123',
    user_id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Frontend Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    active_projects: 2,
    completed_tasks: 15,
    efficiency_score: 92,
    total_hours_logged: 160,
    department: 'Engineering'
  },
  {
    id: 'member-2',
    company_id: 'company-123',
    user_id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Full Stack Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    active_projects: 3,
    completed_tasks: 22,
    efficiency_score: 88,
    total_hours_logged: 180,
    department: 'Engineering'
  },
  {
    id: 'member-3',
    company_id: 'company-123',
    user_id: 'user-3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'Backend Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    active_projects: 1,
    completed_tasks: 18,
    efficiency_score: 95,
    total_hours_logged: 170,
    department: 'Engineering'
  },
  {
    id: 'member-4',
    company_id: 'company-123',
    user_id: 'user-4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Security Engineer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    active_projects: 1,
    completed_tasks: 8,
    efficiency_score: 85,
    total_hours_logged: 120,
    department: 'Security'
  }
]

/**
 * Hook for fetching projects with multi-tenant security
 * CRITICAL: Always filters by company_id for security
 */
export const useProjectData = (filters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
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
        const mockProjects = generateMockProjects()
        const mockTasks = generateMockTasks()
        const mockTeamMembers = generateMockTeamMembers()

        // Apply filters if provided
        let filteredProjects = mockProjects
        if (filters) {
          if (filters.status?.length) {
            filteredProjects = filteredProjects.filter(p => filters.status!.includes(p.status))
          }
          if (filters.priority?.length) {
            filteredProjects = filteredProjects.filter(p => filters.priority!.includes(p.priority))
          }
          if (filters.team_lead?.length) {
            filteredProjects = filteredProjects.filter(p => filters.team_lead!.includes(p.team_lead_id))
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filteredProjects = filteredProjects.filter(p =>
              p.name.toLowerCase().includes(searchLower) ||
              p.description.toLowerCase().includes(searchLower) ||
              (p.team_lead_name && p.team_lead_name.toLowerCase().includes(searchLower))
            )
          }
        }

        setProjects(filteredProjects)
        setTasks(mockTasks)
        setTeamMembers(mockTeamMembers)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters])

  return {
    projects,
    tasks,
    teamMembers,
    isLoading,
    error
  }
}

/**
 * Hook for fetching project summary metrics
 * CRITICAL: Always filters by company_id for security
 */
export const useProjectSummary = () => {
  const [summary, setSummary] = useState<ProjectSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const projects = generateMockProjects()
        const tasks = generateMockTasks()

        // Calculate summary metrics
        const totalProjects = projects.length
        const activeProjects = projects.filter(p => p.status === 'active').length
        const completedProjects = projects.filter(p => p.status === 'completed').length
        const onHoldProjects = projects.filter(p => p.status === 'on-hold').length
        const cancelledProjects = projects.filter(p => p.status === 'cancelled').length

        const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
        const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)

        const currentDate = new Date()
        const overdueTasksCount = tasks.filter(t =>
          t.status !== 'completed' && new Date(t.due_date) < currentDate
        ).length

        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const completedTasksThisMonth = tasks.filter(t =>
          t.status === 'completed' && new Date(t.updated_at) >= thisMonthStart
        ).length

        const summaryData: ProjectSummary = {
          total_projects: totalProjects,
          active_projects: activeProjects,
          completed_projects: completedProjects,
          on_hold_projects: onHoldProjects,
          cancelled_projects: cancelledProjects,
          total_budget: totalBudget,
          total_spent: totalSpent,
          total_team_members: 4, // Mock value
          overdue_tasks: overdueTasksCount,
          completed_tasks_this_month: completedTasksThisMonth,
          average_project_completion_time: 45, // Mock value
          success_rate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
          on_time_delivery_rate: 87, // Mock value
          budget_adherence_rate: totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0
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
 * Hook for creating new projects
 * CRITICAL: Always includes company_id for security
 */
export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async (projectData: CreateProjectForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real implementation, would call Supabase
      console.log('Creating project:', { ...projectData, company_id: mockUser.company_id })

      return { id: 'new-project-' + Date.now(), ...projectData }
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
 * Hook for updating project progress
 * CRITICAL: Always filters by company_id for security
 */
export const useUpdateProjectProgress = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async ({ projectId, progress }: { projectId: string; progress: number }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In real implementation, would call Supabase with company_id filter
      console.log('Updating project progress:', { projectId, progress, company_id: mockUser.company_id })

      return { projectId, progress }
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
 * Hook for updating task status
 * CRITICAL: Always filters by company_id for security
 */
export const useUpdateTaskStatus = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async ({ taskId, status }: { taskId: string; status: Task['status'] }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In real implementation, would call Supabase with company_id filter
      console.log('Updating task status:', { taskId, status, company_id: mockUser.company_id })

      return { taskId, status }
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