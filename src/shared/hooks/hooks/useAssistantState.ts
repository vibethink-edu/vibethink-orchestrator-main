/**
 * Assistant State Hook
 * 
 * Gestiona el estado dinámico del assistant: tareas, sugerencias, 
 * progreso de adopción y nivel de aprendizaje
 * 
 * @author AI Pair Platform - Universal Assistant Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useAssistantProfile } from './useAssistantProfile'

interface Task {
  id: string
  title: string
  description: string
  timeEstimate?: string
  action?: () => void
  actionLabel?: string
  category: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

interface Suggestion {
  id: string
  title: string
  reason: string
  action?: () => void
  actionLabel: string
  category: string
  confidence: number
}

interface Insight {
  id: string
  type: 'productivity' | 'pattern' | 'opportunity' | 'warning'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  action?: () => void
}

interface AdoptionProgress {
  stage: 'invisible' | 'helpful' | 'essential'
  stageName: string
  progress: number // 0-100
  interactions: number
  lastInteraction: Date
  featuresUsed: string[]
  satisfactionScore: number // 1-10
}

interface AssistantState {
  tasks: Task[]
  suggestions: Suggestion[]
  insights: Insight[]
  adoptionProgress: AdoptionProgress
  learningLevel: number // 1-10
  isActive: boolean
  lastActivity: Date
}

interface UseAssistantStateReturn {
  state: AssistantState
  tasks: Task[]
  suggestions: Suggestion[]
  insights: Insight[]
  adoptionProgress: AdoptionProgress
  learningLevel: number
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void
  completeTask: (taskId: string) => void
  addSuggestion: (suggestion: Omit<Suggestion, 'id'>) => void
  addInsight: (insight: Omit<Insight, 'id'>) => void
  updateAdoptionProgress: (updates: Partial<AdoptionProgress>) => void
  incrementLearningLevel: () => void
  recordInteraction: (feature: string) => void
}

export function useAssistantState(): UseAssistantStateReturn {
  const { user } = useAuth()
  const { profile } = useAssistantProfile()
  
  const [state, setState] = useState<AssistantState>({
    tasks: [],
    suggestions: [],
    insights: [],
    adoptionProgress: {
      stage: 'invisible',
      stageName: 'Invisible',
      progress: 0,
      interactions: 0,
      lastInteraction: new Date(),
      featuresUsed: [],
      satisfactionScore: 5
    },
    learningLevel: 1,
    isActive: false,
    lastActivity: new Date()
  })

  // Generar tareas basadas en el perfil del usuario
  const generateTasks = useCallback(() => {
    if (!profile || !user) return []

    const baseTasks: Omit<Task, 'id' | 'completed'>[] = []

    switch (profile.type) {
      case 'executive':
        baseTasks.push(
          {
            title: 'Resumen ejecutivo del día',
            description: 'Preparé un resumen de las métricas clave y eventos importantes',
            timeEstimate: '15 min',
            actionLabel: 'Ver resumen',
            category: 'reporting',
            priority: 'high',
            action: () => {
              // TODO: log opening executive summary
            }
          },
          {
            title: 'Agenda de reuniones estratégicas',
            description: 'Organicé tu agenda para maximizar el tiempo de decisión',
            timeEstimate: '30 min',
            actionLabel: 'Ver agenda',
            category: 'scheduling',
            priority: 'high',
            action: () => {
              // TODO: log opening strategic agenda
            }
          }
        )
        break

      case 'manager':
        baseTasks.push(
          {
            title: 'Status de proyectos del equipo',
            description: 'Revisé el progreso de todos los proyectos activos',
            timeEstimate: '20 min',
            actionLabel: 'Ver status',
            category: 'projects',
            priority: 'high',
            action: () => {
              // TODO: log opening project status
            }
          },
          {
            title: 'Preparación para 1-on-1s',
            description: 'Preparé puntos de discusión para tus reuniones individuales',
            timeEstimate: '10 min',
            actionLabel: 'Ver preparación',
            category: 'meetings',
            priority: 'medium',
            action: () => {
              // TODO: log opening 1-on-1 prep
            }
          }
        )
        break

      default:
        baseTasks.push(
          {
            title: 'Organización de archivos',
            description: 'Organicé tus documentos por prioridad y fecha',
            timeEstimate: '5 min',
            actionLabel: 'Ver organización',
            category: 'organization',
            priority: 'medium',
            action: () => {
              // TODO: log opening file organization
            }
          },
          {
            title: 'Revisión de agenda',
            description: 'Revisé tu agenda y optimicé el tiempo disponible',
            timeEstimate: '3 min',
            actionLabel: 'Ver agenda',
            category: 'scheduling',
            priority: 'low',
            action: () => {
              // TODO: log opening optimized agenda
            }
          }
        )
    }

    return baseTasks.map((task, index) => ({
      ...task,
      id: `task-${Date.now()}-${index}`,
      completed: false
    }))
  }, [profile, user])

  // Generar sugerencias inteligentes
  const generateSuggestions = useCallback(() => {
    if (!profile || !user) return []

    const suggestions: Omit<Suggestion, 'id'>[] = []

    // Sugerencias basadas en el progreso de adopción
    if (state.adoptionProgress.interactions < 5) {
      suggestions.push({
        title: 'Explora las funciones básicas',
        reason: 'Te ayudo a familiarizarte con las herramientas principales',
        actionLabel: 'Comenzar tour',
        category: 'onboarding',
        confidence: 0.9,
        action: () => {
          // TODO: log starting basic tour
        }
      })
    }

    // Sugerencias basadas en el perfil
    switch (profile.type) {
      case 'executive':
        suggestions.push({
          title: 'Análisis de tendencias',
          reason: 'Detecté patrones interesantes en tus métricas',
          actionLabel: 'Ver análisis',
          category: 'analytics',
          confidence: 0.8,
          action: () => {
            // TODO: log opening trend analysis
          }
        })
        break

      case 'manager':
        suggestions.push({
          title: 'Optimización de reuniones',
          reason: 'Identifiqué oportunidades para hacer tus reuniones más eficientes',
          actionLabel: 'Optimizar',
          category: 'efficiency',
          confidence: 0.7,
          action: () => {
            // TODO: log opening meeting optimization
          }
        })
        break
    }

    return suggestions.map((suggestion, index) => ({
      ...suggestion,
      id: `suggestion-${Date.now()}-${index}`
    }))
  }, [profile, user, state.adoptionProgress.interactions])

  // Generar insights basados en patrones
  const generateInsights = useCallback(() => {
    if (!profile || !user) return []

    const insights: Omit<Insight, 'id'>[] = []

    // Insights basados en el nivel de aprendizaje
    if (state.learningLevel < 3) {
      insights.push({
        type: 'opportunity',
        title: 'Potencial de automatización',
        description: 'He identificado tareas repetitivas que podemos automatizar',
        impact: 'medium',
        actionable: true,
        action: () => {
          // TODO: log opening automation opportunities
        }
      })
    }

    // Insights basados en el perfil
    if (profile.type === 'executive' && state.adoptionProgress.interactions > 10) {
      insights.push({
        type: 'pattern',
        title: 'Patrón de decisión detectado',
        description: 'He aprendido tu estilo de toma de decisiones para mejorar mis sugerencias',
        impact: 'high',
        actionable: false
      })
    }

    return insights.map((insight, index) => ({
      ...insight,
      id: `insight-${Date.now()}-${index}`
    }))
  }, [profile, user, state.learningLevel, state.adoptionProgress.interactions])

  // Actualizar progreso de adopción
  const updateAdoptionStage = useCallback((interactions: number) => {
    let stage: AdoptionProgress['stage'] = 'invisible'
    let stageName = 'Invisible'
    let progress = 0

    if (interactions >= 20) {
      stage = 'essential'
      stageName = 'Esencial'
      progress = 100
    } else if (interactions >= 10) {
      stage = 'helpful'
      stageName = 'Útil'
      progress = 60
    } else if (interactions >= 5) {
      stage = 'invisible'
      stageName = 'Invisible'
      progress = 30
    }

    return { stage, stageName, progress }
  }, [])

  // Efectos para generar contenido dinámico
  useEffect(() => {
    if (profile && user) {
      const newTasks = generateTasks()
      const newSuggestions = generateSuggestions()
      const newInsights = generateInsights()

      setState(prev => ({
        ...prev,
        tasks: newTasks,
        suggestions: newSuggestions,
        insights: newInsights
      }))
    }
  }, [profile, user, generateTasks, generateSuggestions, generateInsights])

  // Funciones de manipulación del estado
  const addTask = useCallback((task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false
    }
    
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }))
  }, [])

  const completeTask = useCallback((taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    }))
  }, [])

  const addSuggestion = useCallback((suggestion: Omit<Suggestion, 'id'>) => {
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: `suggestion-${Date.now()}`
    }
    
    setState(prev => ({
      ...prev,
      suggestions: [...prev.suggestions, newSuggestion]
    }))
  }, [])

  const addInsight = useCallback((insight: Omit<Insight, 'id'>) => {
    const newInsight: Insight = {
      ...insight,
      id: `insight-${Date.now()}`
    }
    
    setState(prev => ({
      ...prev,
      insights: [...prev.insights, newInsight]
    }))
  }, [])

  const updateAdoptionProgress = useCallback((updates: Partial<AdoptionProgress>) => {
    setState(prev => {
      const newProgress = { ...prev.adoptionProgress, ...updates }
      const { stage, stageName, progress } = updateAdoptionStage(newProgress.interactions)
      
      return {
        ...prev,
        adoptionProgress: {
          ...newProgress,
          stage,
          stageName,
          progress
        }
      }
    })
  }, [updateAdoptionStage])

  const incrementLearningLevel = useCallback(() => {
    setState(prev => ({
      ...prev,
      learningLevel: Math.min(prev.learningLevel + 1, 10)
    }))
  }, [])

  const recordInteraction = useCallback((feature: string) => {
    setState(prev => {
      const newInteractions = prev.adoptionProgress.interactions + 1
      const newFeaturesUsed = prev.adoptionProgress.featuresUsed.includes(feature)
        ? prev.adoptionProgress.featuresUsed
        : [...prev.adoptionProgress.featuresUsed, feature]

      return {
        ...prev,
        lastActivity: new Date(),
        adoptionProgress: {
          ...prev.adoptionProgress,
          interactions: newInteractions,
          lastInteraction: new Date(),
          featuresUsed: newFeaturesUsed
        }
      }
    })
  }, [])

  return {
    state,
    tasks: state.tasks,
    suggestions: state.suggestions,
    insights: state.insights,
    adoptionProgress: state.adoptionProgress,
    learningLevel: state.learningLevel,
    addTask,
    completeTask,
    addSuggestion,
    addInsight,
    updateAdoptionProgress,
    incrementLearningLevel,
    recordInteraction
  }
}
