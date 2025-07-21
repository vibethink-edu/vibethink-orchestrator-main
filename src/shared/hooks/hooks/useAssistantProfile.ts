/**
 * Assistant Profile Hook
 * 
 * Maneja la personalidad y comportamiento del assistant según el perfil del usuario
 * Adapta la experiencia para cada tipo de empleado
 * 
 * @author AI Pair Platform - Universal Assistant Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  Zap, 
  Brain, 
  DollarSign,
  Users,
  Target,
  MessageSquare,
  BarChart3
} from 'lucide-react'

interface QuickAction {
  label: string
  icon?: any
  handler?: () => void
  category: string
}

interface AssistantProfile {
  type: 'executive' | 'manager' | 'marketing' | 'sales' | 'developer' | 'finance' | 'general'
  name: string
  personality: string
  description: string
  primaryFocus: string[]
  quickActions: QuickAction[]
  learningPriorities: string[]
  integrationPreferences: string[]
}

interface UseAssistantProfileReturn {
  profile: AssistantProfile | null
  loading: boolean
  updateProfile: (updates: Partial<AssistantProfile>) => void
  detectProfileFromActivity: () => Promise<void>
}

export function useAssistantProfile(): UseAssistantProfileReturn {
  const { user } = useAuth()
  const [profile, setProfile] = useState<AssistantProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Perfiles predefinidos según el rol del usuario
  const getProfileByRole = (role: string): AssistantProfile => {
    switch (role?.toLowerCase()) {
      case 'owner':
      case 'admin':
        return {
          type: 'executive',
          name: 'Assistant Ejecutivo',
          personality: 'Estratégico, proactivo y enfocado en resultados',
          description: 'Tu compañero para decisiones estratégicas y visión de alto nivel',
          primaryFocus: [
            'Resúmenes ejecutivos',
            'Análisis de KPIs',
            'Preparación de meetings',
            'Reportes de performance'
          ],
          quickActions: [
            {
              label: 'Resumen del día',
              icon: BarChart3,
              category: 'reporting',
              handler: () => {
                // TODO: log generating daily summary
              }
            },
            {
              label: 'Agendar meeting',
              icon: Calendar,
              category: 'scheduling',
              handler: () => {
                // TODO: log opening calendar
              }
            },
            {
              label: 'Análisis financiero',
              icon: DollarSign,
              category: 'finance',
              handler: () => {
                // TODO: log opening financial analysis
              }
            },
            {
              label: 'Reporte de equipo',
              icon: Users,
              category: 'team',
              handler: () => {
                // TODO: log generating team report
              }
            }
          ],
          learningPriorities: [
            'Patrones de decisión',
            'Métricas importantes',
            'Estilo de comunicación',
            'Prioridades estratégicas'
          ],
          integrationPreferences: [
            'Google Calendar',
            'Google Sheets (KPIs)',
            'Google Slides (Presentations)',
            'Gmail (Executive Communications)'
          ]
        }

      case 'manager':
        return {
          type: 'manager',
          name: 'Assistant de Management',
          personality: 'Organizador, colaborativo y enfocado en el equipo',
          description: 'Tu aliado para coordinar equipos y proyectos eficientemente',
          primaryFocus: [
            'Seguimiento de proyectos',
            'Coordinación de equipo',
            'Preparación de 1-on-1s',
            'Gestión de recursos'
          ],
          quickActions: [
            {
              label: 'Status de proyectos',
              icon: Target,
              category: 'projects',
              handler: () => {
                // TODO: log opening project status
              }
            },
            {
              label: 'Preparar 1-on-1',
              icon: MessageSquare,
              category: 'meetings',
              handler: () => {
                // TODO: log preparing 1-on-1
              }
            },
            {
              label: 'Revisar equipo',
              icon: Users,
              category: 'team',
              handler: () => {
                // TODO: log opening team review
              }
            },
            {
              label: 'Planning semanal',
              icon: Calendar,
              category: 'planning',
              handler: () => {
                // TODO: log opening weekly planning
              }
            }
          ],
          learningPriorities: [
            'Dinámicas del equipo',
            'Flujos de trabajo',
            'Herramientas preferidas',
            'Estilo de management'
          ],
          integrationPreferences: [
            'Google Sheets (Project Tracking)',
            'Google Docs (Meeting Notes)',
            'Google Calendar',
            'Google Tasks'
          ]
        }

      case 'employee':
      default:
        // Detectar perfil por actividad para employees
        return {
          type: 'general',
          name: 'Assistant Personal',
          personality: 'Adaptable, servicial y enfocado en eficiencia',
          description: 'Tu compañero personal que se adapta a tu forma de trabajar',
          primaryFocus: [
            'Organización de archivos',
            'Automatización de tareas',
            'Preparación de documentos',
            'Optimización de tiempo'
          ],
          quickActions: [
            {
              label: 'Organizar archivos',
              icon: FileText,
              category: 'organization',
              handler: () => {
                // TODO: log organizing files
              }
            },
            {
              label: 'Crear documento',
              icon: FileText,
              category: 'creation',
              handler: () => {
                // TODO: log creating document
              }
            },
            {
              label: 'Revisar agenda',
              icon: Calendar,
              category: 'scheduling',
              handler: () => {
                // TODO: log opening calendar
              }
            },
            {
              label: 'Buscar información',
              icon: Brain,
              category: 'search',
              handler: () => {
                // TODO: log opening search
              }
            }
          ],
          learningPriorities: [
            'Patrones de trabajo',
            'Herramientas favoritas',
            'Tipos de documentos',
            'Horarios de actividad'
          ],
          integrationPreferences: [
            'Google Drive',
            'Google Docs',
            'Gmail',
            'Google Calendar'
          ]
        }
    }
  }

  // Detectar perfil específico basado en actividad del usuario
  const detectSpecificProfile = async (): Promise<Partial<AssistantProfile>> => {
    // Aquí iría la lógica para analizar la actividad del usuario
    // y determinar si es marketing, sales, developer, finance, etc.
    
    // Por ahora retornamos perfil genérico, pero en implementación real
    // analizaríamos:
    // - Tipos de documentos que crea
    // - Herramientas que usa más
    // - Patrones de comunicación
    // - Integraciones activas
    
    return {}
  }

  const detectProfileFromActivity = async () => {
    setLoading(true)
    try {
      const specificProfile = await detectSpecificProfile()
      if (Object.keys(specificProfile).length > 0) {
        setProfile(current => ({
          ...current!,
          ...specificProfile
        }))
      }
    } catch (error) {
      // TODO: log error detecting profile
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = (updates: Partial<AssistantProfile>) => {
    setProfile(current => ({
      ...current!,
      ...updates
    }))

    // Aquí guardaríamos en la base de datos
    // saveProfileToDatabase(user?.id, updates)
  }

  useEffect(() => {
    if (user) {
      setLoading(true)
      
      // Obtener perfil base según el rol
      const baseProfile = getProfileByRole(user.user_metadata?.role || 'employee')
      setProfile(baseProfile)

      // Intentar cargar perfil personalizado desde la base de datos
      // loadProfileFromDatabase(user.id)
      //   .then(savedProfile => {
      //     if (savedProfile) {
      //       setProfile({...baseProfile, ...savedProfile})
      //     }
      //   })
      //   .finally(() => setLoading(false))

      setLoading(false)
    }
  }, [user])

  return {
    profile,
    loading,
    updateProfile,
    detectProfileFromActivity
  }
}

// Tipos específicos de assistant
export const ASSISTANT_PROFILES = {
  MARKETING: {
    quickActions: [
      { label: 'Crear campaña', icon: TrendingUp, category: 'campaigns' },
      { label: 'Analizar métricas', icon: BarChart3, category: 'analytics' },
      { label: 'Generar contenido', icon: FileText, category: 'content' },
      { label: 'A/B testing', icon: Target, category: 'testing' }
    ],
    integrations: ['Google Ads', 'Analytics', 'Social Media APIs']
  },
  
  SALES: {
    quickActions: [
      { label: 'Preparar call', icon: Zap, category: 'calls' },
      { label: 'Actualizar CRM', icon: Users, category: 'crm' },
      { label: 'Crear propuesta', icon: FileText, category: 'proposals' },
      { label: 'Follow-up', icon: MessageSquare, category: 'follow-up' }
    ],
    integrations: ['CRM APIs', 'Email', 'Calendar', 'Proposal Tools']
  },
  
  DEVELOPER: {
    quickActions: [
      { label: 'Documentar código', icon: Brain, category: 'documentation' },
      { label: 'Crear ticket', icon: Target, category: 'tickets' },
      { label: 'Revisar PRs', icon: FileText, category: 'reviews' },
      { label: 'Deploy notes', icon: Zap, category: 'deployment' }
    ],
    integrations: ['GitHub', 'Jira', 'Confluence', 'IDE Extensions']
  },
  
  FINANCE: {
    quickActions: [
      { label: 'Reporte financiero', icon: DollarSign, category: 'reporting' },
      { label: 'Reconciliar cuentas', icon: BarChart3, category: 'reconciliation' },
      { label: 'Análisis varianza', icon: TrendingUp, category: 'analysis' },
      { label: 'Budget review', icon: Target, category: 'budget' }
    ],
    integrations: ['Accounting Software', 'Banking APIs', 'Excel', 'BI Tools']
  }
} 