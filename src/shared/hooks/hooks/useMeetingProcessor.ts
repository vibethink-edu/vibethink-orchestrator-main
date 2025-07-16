/**
 * Meeting Processor Hooks
 * 
 * React Query hooks for meeting processing functionality
 * 
 * @author AI Pair Platform - Frontend Team
 * @version 1.0.0
 */

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/shared/hooks/useAuth'
import type { 
  MeetingProcessRequest, 
  MeetingProcessResponse, 
  Meeting,
  ProcessingState 
} from '@/shared/types/meeting'

/**
 * Hook for processing meeting audio files
 */
export function useMeetingProcessor() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: Omit<MeetingProcessRequest, 'company_id'>): Promise<MeetingProcessResponse> => {
      if (!user?.user_metadata?.company_id) {
        throw new Error('Company ID not found')
      }

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Authentication required')
      }

      const requestWithCompany: MeetingProcessRequest = {
        ...request,
        company_id: user.user_metadata.company_id
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meeting-processor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestWithCompany),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return response.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Reunión procesada exitosamente')
        // Invalidate meetings list to refresh data
        queryClient.invalidateQueries({ queryKey: ['meetings'] })
        queryClient.invalidateQueries({ queryKey: ['company-usage'] })
      } else {
        toast.error(data.error || 'Error al procesar la reunión')
      }
    },
    onError: (error: Error) => {
      console.error('Meeting processing error:', error)
      toast.error(error.message || 'Error al procesar la reunión')
    },
  })
}

/**
 * Hook for fetching company meetings
 */
export function useMeetings() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['meetings', user?.user_metadata?.company_id],
    queryFn: async (): Promise<Meeting[]> => {
      if (!user?.user_metadata?.company_id) {
        throw new Error('Company ID not found')
      }

      const { data, error } = await supabase
        .from('meetings' as any)
        .select('*')
        .eq('company_id', user.user_metadata.company_id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return (data || []) as unknown as Meeting[]
    },
    enabled: !!user?.user_metadata?.company_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook for fetching a specific meeting by ID
 */
export function useMeeting(meetingId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async (): Promise<Meeting | null> => {
      if (!user?.user_metadata?.company_id || !meetingId) {
        throw new Error('Company ID or Meeting ID not found')
      }

      const { data, error } = await supabase
        .from('meetings' as any)
        .select('*')
        .eq('id', meetingId)
        .eq('company_id', user.user_metadata.company_id) // Ensure company isolation
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        throw error
      }

      return data as unknown as Meeting
    },
    enabled: !!meetingId && !!user?.user_metadata?.company_id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook for deleting a meeting
 */
export function useDeleteMeeting() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (meetingId: string): Promise<void> => {
      if (!user?.user_metadata?.company_id) {
        throw new Error('Company ID not found')
      }

      const { error } = await supabase
        .from('meetings' as any)
        .delete()
        .eq('id', meetingId)
        .eq('company_id', user.user_metadata.company_id) // Ensure company isolation

      if (error) {
        throw error
      }
    },
    onSuccess: () => {
      toast.success('Reunión eliminada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
    onError: (error: Error) => {
      console.error('Delete meeting error:', error)
      toast.error('Error al eliminar la reunión')
    },
  })
}

/**
 * Hook for managing processing state (local state)
 */
export function useProcessingState() {
  const [state, setState] = React.useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    currentStep: 'Esperando archivo...',
  })

  const updateState = React.useCallback((updates: Partial<ProcessingState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const resetState = React.useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      currentStep: 'Esperando archivo...',
    })
  }, [])

  const startProcessing = React.useCallback(() => {
    updateState({
      status: 'uploading',
      progress: 10,
      currentStep: 'Subiendo archivo...',
    })
  }, [updateState])

  const setTranscribing = React.useCallback(() => {
    updateState({
      status: 'transcribing',
      progress: 40,
      currentStep: 'Transcribiendo audio...',
    })
  }, [updateState])

  const setAnalyzing = React.useCallback(() => {
    updateState({
      status: 'analyzing',
      progress: 70,
      currentStep: 'Analizando contenido...',
    })
  }, [updateState])

  const setCompleted = React.useCallback(() => {
    updateState({
      status: 'completed',
      progress: 100,
      currentStep: 'Procesamiento completado',
    })
  }, [updateState])

  const setError = React.useCallback((error: string) => {
    updateState({
      status: 'error',
      currentStep: 'Error en el procesamiento',
      error,
    })
  }, [updateState])

  return {
    state,
    updateState,
    resetState,
    startProcessing,
    setTranscribing,
    setAnalyzing,
    setCompleted,
    setError,
  }
}

/**
 * Utility function to convert file to base64
 */
export function useFileToBase64() {
  return React.useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix (data:audio/wav;base64,)
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }, [])
}

/**
 * Hook for checking company AI usage limits
 */
export function useCompanyUsage() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['company-usage', user?.user_metadata?.company_id],
    queryFn: async () => {
      if (!user?.user_metadata?.company_id) {
        throw new Error('Company ID not found')
      }

      const { data, error } = await supabase
        .rpc('get_company_limits', { 
          p_company_id: user.user_metadata.company_id 
        })

      if (error) {
        throw error
      }

      return data
    },
    enabled: !!user?.user_metadata?.company_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
} 