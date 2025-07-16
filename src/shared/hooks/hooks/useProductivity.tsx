/**
 * Productivity Hook - Daily Workflow Management
 * 
 * Custom hook for managing daily kickoff, wrap-up, and productivity tracking
 */

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import type { 
  DailyKickoff, 
  DailyWrapup, 
  Task, 
  AIInsights, 
  AISummary,
  ProductivityMetrics 
} from '@/shared/types/productivity'

export function useProductivity() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const currentDate = new Date().toISOString().split('T')[0]

  // Check if kickoff exists for today
  const { data: todayKickoff, isLoading: loadingKickoff } = useQuery({
    queryKey: ['daily-kickoff', user?.id, currentDate],
    queryFn: async () => {
      if (!user) return null
      
      // Mock data for development - replace with actual Supabase query
      const mockKickoff: DailyKickoff = {
        id: '1',
        user_id: user.id,
        company_id: user.user_metadata?.company_id,
        date: currentDate,
        objectives: [],
        priority_tasks: [],
        context_from_yesterday: '',
        estimated_hours: 8,
        focus_areas: [],
        energy_level: 7,
        mood: 'focused',
        created_at: new Date().toISOString()
      }
      
      return null // Return null to simulate no kickoff yet
    },
    enabled: !!user
  })

  // Check if wrapup exists for today
  const { data: todayWrapup, isLoading: loadingWrapup } = useQuery({
    queryKey: ['daily-wrapup', user?.id, currentDate],
    queryFn: async () => {
      if (!user) return null
      return null // Return null to simulate no wrapup yet
    },
    enabled: !!user
  })

  // Get recent productivity data
  const { data: productivityHistory } = useQuery({
    queryKey: ['productivity-history', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      // Mock data for development
      return [
        { date: '2025-06-17', satisfaction_score: 8, productivity_score: 85, created_at: '2025-06-17T18:00:00Z' },
        { date: '2025-06-16', satisfaction_score: 7, productivity_score: 78, created_at: '2025-06-16T18:00:00Z' },
        { date: '2025-06-15', satisfaction_score: 9, productivity_score: 92, created_at: '2025-06-15T18:00:00Z' }
      ]
    },
    enabled: !!user
  })

  // Create kickoff mutation
  const createKickoffMutation = useMutation({
    mutationFn: async (kickoffData: Omit<DailyKickoff, 'id' | 'created_at'>) => {
      if (!user?.user_metadata?.company_id) throw new Error('No company ID')

      // Generate AI insights
      const aiInsights = await generateAIInsights(kickoffData)

      // Mock successful creation
      const newKickoff: DailyKickoff = {
        id: Date.now().toString(),
        ...kickoffData,
        user_id: user.id,
        company_id: user.user_metadata.company_id,
        ai_insights: aiInsights,
        created_at: new Date().toISOString()
      }

      return newKickoff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-kickoff'] })
    }
  })

  // Create wrapup mutation
  const createWrapupMutation = useMutation({
    mutationFn: async (wrapupData: Omit<DailyWrapup, 'id' | 'created_at'>) => {
      if (!user?.user_metadata?.company_id) throw new Error('No company ID')

      // Generate AI summary
      const aiSummary = await generateAISummary(wrapupData)
      
      // Calculate productivity score
      const productivityScore = calculateProductivityScore(wrapupData, aiSummary)

      // Mock successful creation
      const newWrapup: DailyWrapup = {
        id: Date.now().toString(),
        ...wrapupData,
        user_id: user.id,
        company_id: user.user_metadata.company_id,
        ai_summary: aiSummary,
        productivity_score: productivityScore,
        created_at: new Date().toISOString()
      }

      return newWrapup
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-wrapup'] })
      queryClient.invalidateQueries({ queryKey: ['productivity-history'] })
    }
  })

  // AI Insights Generation
  const generateAIInsights = async (kickoffData: Partial<DailyKickoff>): Promise<AIInsights> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const totalEstimatedHours = kickoffData.priority_tasks?.reduce((acc, task) => acc + task.estimated_hours, 0) || 0
    const energyLevel = kickoffData.energy_level || 5

    return {
      productivity_tips: [
        energyLevel >= 8 
          ? "High energy detected! Perfect time for complex problem-solving tasks."
          : energyLevel >= 6
          ? "Good energy level. Focus on medium-priority tasks and save complex work for peak hours."
          : "Lower energy today. Consider starting with routine tasks to build momentum.",
        
        totalEstimatedHours > (kickoffData.estimated_hours || 8)
          ? "Time estimate is optimistic. Consider prioritizing or breaking down large tasks."
          : "Realistic time allocation. Good planning!",
        
        "Consider time-blocking your calendar based on task priorities and energy levels."
      ],
      risk_factors: [
        ...(totalEstimatedHours > (kickoffData.estimated_hours || 8) ? ["Over-ambitious time estimates"] : []),
        ...(energyLevel < 5 ? ["Low energy may impact complex task performance"] : []),
        ...(kickoffData.priority_tasks?.length || 0 > 5 ? ["Too many high-priority tasks may cause context switching"] : [])
      ],
      optimization_suggestions: [
        "Group similar tasks to minimize context switching",
        "Schedule breaks every 90 minutes for optimal focus",
        "Use the Pomodoro technique for time-boxed work sessions",
        "Review yesterday's context to quickly get back into flow state"
      ],
      estimated_completion_time: totalEstimatedHours * (energyLevel >= 7 ? 0.9 : energyLevel >= 5 ? 1.0 : 1.2),
      energy_optimization: energyLevel >= 7 
        ? "Peak energy - tackle your most challenging task first"
        : energyLevel >= 5
        ? "Moderate energy - alternate between challenging and routine tasks"
        : "Lower energy - start with easier wins to build momentum",
      priority_recommendations: kickoffData.priority_tasks?.map(task => 
        `${task.title}: ${task.priority === 'high' ? 'Tackle early when energy is highest' : 
          task.priority === 'medium' ? 'Good for mid-day focus periods' : 
          'Perfect for low-energy periods or end of day'}`
      ) || []
    }
  }

  // AI Summary Generation
  const generateAISummary = async (wrapupData: Partial<DailyWrapup>): Promise<AISummary> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const completedTasks = wrapupData.completed_tasks?.length || 0
    const totalTasks = 5 // This would come from kickoff data
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    return {
      achievements: `Completed ${completedTasks} tasks with a ${completionRate.toFixed(0)}% completion rate. ${
        completionRate >= 80 ? 'Excellent productivity!' : 
        completionRate >= 60 ? 'Good progress made.' : 
        'Room for improvement, but progress is progress.'
      }`,
      productivity_score: Math.round(
        (wrapupData.satisfaction_score || 5) * 0.4 + 
        completionRate * 0.4 + 
        (wrapupData.time_analysis?.efficiency_score || 50) * 0.2
      ),
      key_learnings: wrapupData.learning_notes || "No specific learning notes captured today.",
      improvement_areas: [
        ...(completionRate < 60 ? ["Task completion rate could be improved"] : []),
        ...(wrapupData.time_analysis?.efficiency_score || 50 < 70 ? ["Time management and focus"] : []),
        ...(wrapupData.challenges_faced?.length || 0 > 3 ? ["Consider better planning to anticipate challenges"] : [])
      ],
      patterns_detected: [
        wrapupData.satisfaction_score || 0 >= 8 ? "High satisfaction day - good work-life balance" : "Consider factors affecting satisfaction",
        wrapupData.challenges_faced?.length || 0 > 2 ? "Multiple challenges faced - may need better contingency planning" : "Smooth workflow day"
      ],
      tomorrow_recommendations: [
        "Review today's learning notes before starting tomorrow",
        ...(wrapupData.challenges_faced?.length || 0 > 0 ? ["Plan mitigation strategies for similar challenges"] : []),
        "Start with highest energy task based on today's energy patterns",
        ...(wrapupData.tomorrow_prep || [])
      ]
    }
  }

  // Calculate productivity score
  const calculateProductivityScore = (wrapupData: Partial<DailyWrapup>, aiSummary: AISummary): number => {
    // Weighted calculation based on multiple factors
    const satisfactionWeight = 0.3
    const completionWeight = 0.3
    const efficiencyWeight = 0.2
    const learningWeight = 0.2

    const satisfactionScore = (wrapupData.satisfaction_score || 5) * 10
    const completionScore = ((wrapupData.completed_tasks?.length || 0) / 5) * 100 // Assuming 5 is average
    const efficiencyScore = wrapupData.time_analysis?.efficiency_score || 50
    const learningScore = wrapupData.learning_notes?.length || 0 > 50 ? 80 : 50

    return Math.round(
      satisfactionScore * satisfactionWeight +
      completionScore * completionWeight +
      efficiencyScore * efficiencyWeight +
      learningScore * learningWeight
    )
  }

  // Get productivity metrics
  const getProductivityMetrics = (): ProductivityMetrics | null => {
    if (!productivityHistory || productivityHistory.length === 0) return null

    const recentData = productivityHistory.slice(0, 7) // Last 7 days
    
    return {
      daily_average_satisfaction: recentData.reduce((acc, day) => acc + (day.satisfaction_score || 0), 0) / recentData.length,
      weekly_productivity_trend: recentData.map(day => day.productivity_score || 0).reverse(),
      task_completion_rate: 75, // Mock value - would calculate from actual data
      time_estimation_accuracy: 80, // Mock value
      energy_correlation: [], // Would populate from historical data
      learning_velocity: 85 // Mock value
    }
  }

  return {
    // State
    todayKickoff,
    todayWrapup,
    productivityHistory,
    isLoadingKickoff: loadingKickoff,
    isLoadingWrapup: loadingWrapup,
    
    // Computed
    hasKickoffToday: !!todayKickoff,
    hasWrapupToday: !!todayWrapup,
    canDoWrapup: !!todayKickoff && !todayWrapup,
    productivityMetrics: getProductivityMetrics(),
    
    // Actions
    createKickoff: createKickoffMutation.mutateAsync,
    createWrapup: createWrapupMutation.mutateAsync,
    isCreatingKickoff: createKickoffMutation.isPending,
    isCreatingWrapup: createWrapupMutation.isPending,
    
    // Utils
    currentDate
  }
}
