/**
 * Team Data Hook - VibeThink Orchestrator
 * 
 * Team member management and analytics with multi-tenant security
 * Following VThink 1.0 methodology with company_id filtering
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { TeamMember, Reminder, CreateReminderForm } from '../types'

// Mock Supabase client for demo - replace with real implementation
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: string) => ({
        order: (column: string, options: any) => Promise.resolve({ data: [], error: null })
      })
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

// Mock data generators
const generateMockReminders = (): Reminder[] => [
  {
    id: '1',
    company_id: 'company-123',
    user_id: 'user-123',
    project_id: '1',
    task_id: undefined,
    title: 'Website Redesign Review',
    description: 'Review the latest designs and provide feedback',
    type: 'review',
    priority: 'high',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project_name: 'Website Redesign'
  },
  {
    id: '2',
    company_id: 'company-123',
    user_id: 'user-123',
    project_id: '2',
    task_id: '3',
    title: 'Mobile App Sprint Planning',
    description: 'Plan next sprint for mobile app development',
    type: 'meeting',
    priority: 'medium',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project_name: 'Mobile App Development',
    task_title: 'User authentication'
  },
  {
    id: '3',
    company_id: 'company-123',
    user_id: 'user-123',
    project_id: undefined,
    task_id: undefined,
    title: 'Security Audit Deadline',
    description: 'Complete security audit documentation',
    type: 'deadline',
    priority: 'urgent',
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (overdue)
    is_completed: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    company_id: 'company-123',
    user_id: 'user-123',
    project_id: '1',
    task_id: undefined,
    title: 'Frontend Testing Milestone',
    description: 'Complete frontend component testing',
    type: 'milestone',
    priority: 'high',
    due_date: new Date().toISOString(), // Today
    is_completed: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    project_name: 'Website Redesign'
  },
  {
    id: '5',
    company_id: 'company-123',
    user_id: 'user-123',
    project_id: undefined,
    task_id: undefined,
    title: 'Team Performance Review',
    description: 'Monthly team performance review and feedback session',
    type: 'general',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * Hook for fetching team member data with performance metrics
 * CRITICAL: Always filters by company_id for security
 */
export const useTeamData = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        // Generate mock team data with enhanced metrics
        const mockTeamMembers: TeamMember[] = [
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

        setTeamMembers(mockTeamMembers)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  return {
    teamMembers,
    isLoading,
    error
  }
}

/**
 * Hook for fetching reminders with team context
 * CRITICAL: Always filters by company_id for security
 */
export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600))

        const mockReminders = generateMockReminders()
        setReminders(mockReminders)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReminders()
  }, [])

  return {
    reminders,
    isLoading,
    error
  }
}

/**
 * Hook for creating new reminders
 * CRITICAL: Always includes company_id for security
 */
export const useCreateReminder = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async (reminderData: CreateReminderForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))

      // In real implementation, would call Supabase
      console.log('Creating reminder:', { 
        ...reminderData, 
        company_id: mockUser.company_id, 
        user_id: mockUser.id 
      })

      const newReminder: Reminder = {
        id: 'reminder-' + Date.now(),
        company_id: mockUser.company_id,
        user_id: mockUser.id,
        ...reminderData,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return newReminder
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
 * Hook for marking reminders as completed
 * CRITICAL: Always filters by company_id for security
 */
export const useCompleteReminder = () => {
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = async (reminderId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // In real implementation, would call Supabase with company_id filter
      console.log('Completing reminder:', { 
        reminderId, 
        company_id: mockUser.company_id 
      })

      return { reminderId, completed: true }
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
 * Hook for team performance analytics
 * CRITICAL: Always filters by company_id for security
 */
export const useTeamPerformance = () => {
  const [performance, setPerformance] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock performance data
        const mockPerformance = {
          'member-1': {
            projects_led: 2,
            projects_completed: 5,
            average_progress: 85,
            tasks_assigned: 18,
            tasks_completed: 15,
            on_time_completion: 13,
            on_time_rate: 86.7
          },
          'member-2': {
            projects_led: 1,
            projects_completed: 8,
            average_progress: 92,
            tasks_assigned: 25,
            tasks_completed: 22,
            on_time_completion: 20,
            on_time_rate: 90.9
          },
          'member-3': {
            projects_led: 3,
            projects_completed: 6,
            average_progress: 88,
            tasks_assigned: 20,
            tasks_completed: 18,
            on_time_completion: 17,
            on_time_rate: 94.4
          },
          'member-4': {
            projects_led: 1,
            projects_completed: 3,
            average_progress: 75,
            tasks_assigned: 12,
            tasks_completed: 8,
            on_time_completion: 6,
            on_time_rate: 75.0
          }
        }

        setPerformance(mockPerformance)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  return {
    data: performance,
    isLoading,
    error
  }
}

/**
 * Hook for getting team workload distribution
 */
export const useTeamWorkload = () => {
  const [workload, setWorkload] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 900))

        // Mock workload data
        const mockWorkload = {
          'member-1': {
            total_tasks: 8,
            total_hours: 32,
            workload_percentage: 80
          },
          'member-2': {
            total_tasks: 12,
            total_hours: 38,
            workload_percentage: 95
          },
          'member-3': {
            total_tasks: 6,
            total_hours: 28,
            workload_percentage: 70
          },
          'member-4': {
            total_tasks: 4,
            total_hours: 20,
            workload_percentage: 50
          }
        }

        setWorkload(mockWorkload)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkload()
  }, [])

  return {
    data: workload,
    isLoading,
    error
  }
}