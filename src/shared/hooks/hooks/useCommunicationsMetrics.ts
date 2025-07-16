/**
 * Hook para obtener métricas de comunicaciones y documentos
 * Proporciona datos para el dashboard de comunicaciones
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { AgentId, ModuleId } from '@/shared/types/common';

// Interfaces de métricas
export interface CommunicationsMetrics {
  // Emails
  totalEmailsSent: number;
  automatedEmails: number;
  manualEmails: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
  avgResponseTime: number; // Minutos
  emailSatisfaction: number; // 1-5
  sentimentScore: number; // -100 a +100
  
  // Documentos
  totalDocumentsGenerated: number;
  documentsByType: Record<string, number>;
  avgQualityScore: number;
  avgAccuracyScore: number;
  avgCompletenessScore: number;
  approvalRate: number;
  timeToApproval: number; // Minutos
  documentsByStatus: Record<string, number>;
  
  // Chats
  totalChatSessions: number;
  avgSessionDuration: number; // Minutos
  resolutionRate: number;
  escalationRate: number;
  chatSatisfaction: number; // 1-5
  avgResponseTime: number; // Minutos
  chatsByType: Record<string, number>;
  
  // Métricas Generales
  totalTimeSaved: number; // Horas
  totalCostSaved: number; // USD
  overallROI: number; // Porcentaje
  totalTokensUsed: number;
  
  // Métricas por Agente
  metricsByAgent: Record<AgentId, {
    emailsSent: number;
    documentsGenerated: number;
    chatSessions: number;
    timeSaved: number;
    qualityScore: number;
  }>;
  
  // Métricas por Módulo
  metricsByModule: Record<ModuleId, {
    emailsSent: number;
    documentsGenerated: number;
    chatSessions: number;
    timeSaved: number;
    qualityScore: number;
  }>;
}

export interface EmailMetrics {
  totalSent: number;
  automated: number;
  manual: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  avgResponseTime: number;
  satisfaction: number;
  sentimentScore: number;
  byType: Array<{
    type: string;
    name: string;
    count: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
  }>;
}

export interface DocumentMetrics {
  totalGenerated: number;
  avgQualityScore: number;
  approvalRate: number;
  timeToApproval: number;
  byType: Array<{
    type: string;
    name: string;
    count: number;
    quality: number;
    approvalRate: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export interface ChatMetrics {
  totalSessions: number;
  avgSessionDuration: number;
  resolutionRate: number;
  escalationRate: number;
  satisfaction: number;
  byType: Array<{
    type: string;
    name: string;
    count: number;
    satisfaction: number;
    resolutionRate: number;
  }>;
}

/**
 * Hook para obtener métricas generales de comunicaciones
 */
export const useCommunicationsMetrics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['communications-metrics', user?.company_id, dateRange],
    queryFn: async (): Promise<CommunicationsMetrics> => {
      // Simulación de datos - en producción esto vendría de la API
      return {
        // Emails
        totalEmailsSent: 324,
        automatedEmails: 289,
        manualEmails: 35,
        openRate: 82.3,
        clickRate: 23.1,
        replyRate: 18.7,
        bounceRate: 2.1,
        avgResponseTime: 2.3,
        emailSatisfaction: 4.4,
        sentimentScore: 78.5,
        
        // Documentos
        totalDocumentsGenerated: 156,
        documentsByType: {
          'legal_contract': 23,
          'invoice': 45,
          'report': 34,
          'proposal': 12,
          'presentation': 18,
          'employment_contract': 8,
          'performance_review': 16
        },
        avgQualityScore: 94.2,
        avgAccuracyScore: 96.1,
        avgCompletenessScore: 92.8,
        approvalRate: 89.3,
        timeToApproval: 72, // 1.2 horas
        documentsByStatus: {
          'DRAFT': 12,
          'REVIEW': 8,
          'APPROVED': 134,
          'PUBLISHED': 2
        },
        
        // Chats
        totalChatSessions: 224,
        avgSessionDuration: 8.5,
        resolutionRate: 87.2,
        escalationRate: 12.8,
        chatSatisfaction: 4.3,
        avgResponseTime: 1.8,
        chatsByType: {
          'technical_support': 89,
          'sales_chat': 45,
          'hr_support': 23,
          'general_inquiry': 67
        },
        
        // Métricas Generales
        totalTimeSaved: 485, // Horas
        totalCostSaved: 14500, // USD (estimando $30/hora)
        overallROI: 1450, // Porcentaje
        totalTokensUsed: 234567,
        
        // Métricas por Agente
        metricsByAgent: {
          'AG_LEGAL': {
            emailsSent: 45,
            documentsGenerated: 31,
            chatSessions: 12,
            timeSaved: 156,
            qualityScore: 96.2
          },
          'AG_CONT': {
            emailsSent: 67,
            documentsGenerated: 79,
            chatSessions: 8,
            timeSaved: 134,
            qualityScore: 94.8
          },
          'AG_VENT': {
            emailsSent: 89,
            documentsGenerated: 30,
            chatSessions: 53,
            timeSaved: 98,
            qualityScore: 91.5
          },
          'AG_HR': {
            emailsSent: 34,
            documentsGenerated: 24,
            chatSessions: 31,
            timeSaved: 67,
            qualityScore: 93.1
          },
          'HD': {
            emailsSent: 56,
            documentsGenerated: 0,
            chatSessions: 89,
            timeSaved: 23,
            qualityScore: 88.7
          },
          'ATX': {
            emailsSent: 33,
            documentsGenerated: 12,
            chatSessions: 31,
            timeSaved: 7,
            qualityScore: 89.2
          }
        },
        
        // Métricas por Módulo
        metricsByModule: {
          'CRM': {
            emailsSent: 123,
            documentsGenerated: 45,
            chatSessions: 67,
            timeSaved: 234,
            qualityScore: 92.1
          },
          'HD': {
            emailsSent: 56,
            documentsGenerated: 0,
            chatSessions: 89,
            timeSaved: 23,
            qualityScore: 88.7
          },
          'PQRS': {
            emailsSent: 45,
            documentsGenerated: 23,
            chatSessions: 34,
            timeSaved: 89,
            qualityScore: 94.3
          },
          'ATX': {
            emailsSent: 33,
            documentsGenerated: 12,
            chatSessions: 31,
            timeSaved: 7,
            qualityScore: 89.2
          },
          'TTX': {
            emailsSent: 34,
            documentsGenerated: 45,
            chatSessions: 3,
            timeSaved: 78,
            qualityScore: 95.6
          },
          'NTX': {
            emailsSent: 33,
            documentsGenerated: 31,
            chatSessions: 0,
            timeSaved: 54,
            qualityScore: 93.8
          }
        }
      };
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas específicas de emails
 */
export const useEmailMetrics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['email-metrics', user?.company_id, dateRange],
    queryFn: async (): Promise<EmailMetrics> => {
      // Simulación de datos
      return {
        totalSent: 324,
        automated: 289,
        manual: 35,
        openRate: 82.3,
        clickRate: 23.1,
        replyRate: 18.7,
        avgResponseTime: 2.3,
        satisfaction: 4.4,
        sentimentScore: 78.5,
        byType: [
          {
            type: 'follow_up',
            name: 'Seguimiento',
            count: 45,
            openRate: 78.2,
            clickRate: 18.5,
            replyRate: 15.2
          },
          {
            type: 'support',
            name: 'Soporte',
            count: 67,
            openRate: 92.1,
            clickRate: 34.2,
            replyRate: 28.7
          },
          {
            type: 'marketing',
            name: 'Marketing',
            count: 89,
            openRate: 65.4,
            clickRate: 12.8,
            replyRate: 8.9
          },
          {
            type: 'notification',
            name: 'Notificaciones',
            count: 123,
            openRate: 88.7,
            clickRate: 15.3,
            replyRate: 12.1
          }
        ]
      };
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas específicas de documentos
 */
export const useDocumentMetrics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['document-metrics', user?.company_id, dateRange],
    queryFn: async (): Promise<DocumentMetrics> => {
      // Simulación de datos
      return {
        totalGenerated: 156,
        avgQualityScore: 94.2,
        approvalRate: 89.3,
        timeToApproval: 72,
        byType: [
          {
            type: 'contract',
            name: 'Contratos',
            count: 23,
            quality: 96.2,
            approvalRate: 95.7
          },
          {
            type: 'invoice',
            name: 'Facturas',
            count: 45,
            quality: 98.1,
            approvalRate: 99.2
          },
          {
            type: 'report',
            name: 'Reportes',
            count: 34,
            quality: 94.3,
            approvalRate: 87.5
          },
          {
            type: 'proposal',
            name: 'Propuestas',
            count: 12,
            quality: 90.8,
            approvalRate: 83.3
          },
          {
            type: 'presentation',
            name: 'Presentaciones',
            count: 18,
            quality: 88.9,
            approvalRate: 77.8
          },
          {
            type: 'employment_contract',
            name: 'Contratos de Empleo',
            count: 8,
            quality: 96.5,
            approvalRate: 100.0
          },
          {
            type: 'performance_review',
            name: 'Evaluaciones',
            count: 16,
            quality: 92.1,
            approvalRate: 87.5
          }
        ],
        byStatus: [
          {
            status: 'DRAFT',
            count: 12,
            percentage: 7.7
          },
          {
            status: 'REVIEW',
            count: 8,
            percentage: 5.1
          },
          {
            status: 'APPROVED',
            count: 134,
            percentage: 85.9
          },
          {
            status: 'PUBLISHED',
            count: 2,
            percentage: 1.3
          }
        ]
      };
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas específicas de chats
 */
export const useChatMetrics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['chat-metrics', user?.company_id, dateRange],
    queryFn: async (): Promise<ChatMetrics> => {
      // Simulación de datos
      return {
        totalSessions: 224,
        avgSessionDuration: 8.5,
        resolutionRate: 87.2,
        escalationRate: 12.8,
        satisfaction: 4.3,
        byType: [
          {
            type: 'support',
            name: 'Soporte',
            count: 89,
            satisfaction: 4.2,
            resolutionRate: 85.4
          },
          {
            type: 'sales',
            name: 'Ventas',
            count: 45,
            satisfaction: 4.5,
            resolutionRate: 91.1
          },
          {
            type: 'hr',
            name: 'RRHH',
            count: 23,
            satisfaction: 4.3,
            resolutionRate: 87.0
          },
          {
            type: 'general',
            name: 'General',
            count: 67,
            satisfaction: 4.0,
            resolutionRate: 82.1
          }
        ]
      };
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas de calidad de comunicaciones
 */
export const useQualityMetrics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['quality-metrics', user?.company_id, dateRange],
    queryFn: async () => {
      // Simulación de datos de calidad
      return {
        overallQuality: 94.2,
        emailQuality: 91.8,
        documentQuality: 96.5,
        chatQuality: 88.7,
        satisfactionTrend: [4.1, 4.2, 4.3, 4.4, 4.4], // Últimos 5 períodos
        qualityByAgent: {
          'AG_LEGAL': 96.2,
          'AG_CONT': 94.8,
          'AG_VENT': 91.5,
          'AG_HR': 93.1,
          'HD': 88.7,
          'ATX': 89.2
        },
        qualityByModule: {
          'CRM': 92.1,
          'HD': 88.7,
          'PQRS': 94.3,
          'ATX': 89.2,
          'TTX': 95.6,
          'NTX': 93.8
        }
      };
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
  });
}; 