/**
 * Hook para tracking de comunicaciones y documentos
 * Integra tracking de emails, documentos y chats con métricas de calidad
 */

import { useCallback } from 'react';
import { useApiIntegrationTracking } from './useApiIntegrationTracking';
import { AgentId, ModuleId } from '@/shared/types/common';

// Tipos de comunicación
export type CommunicationType = 'EMAIL' | 'CHAT' | 'DOCUMENT' | 'SMS' | 'REPORT' | 'PRESENTATION';
export type CommunicationSubtype = 
  | 'follow_up' | 'support' | 'marketing' | 'notification' | 'reminder'
  | 'contract' | 'invoice' | 'proposal' | 'report' | 'presentation'
  | 'technical_support' | 'sales_chat' | 'hr_support' | 'general_inquiry';

// Tipos de documentos
export type DocumentType = 
  | 'legal_contract' | 'legal_opinion' | 'compliance_report'
  | 'financial_report' | 'invoice' | 'sales_proposal'
  | 'presentation' | 'employment_contract' | 'performance_review';

// Tipos de chat
export type ChatType = 'technical_support' | 'sales_chat' | 'hr_support' | 'general_inquiry';

// Interfaces de tracking
export interface EmailTrackingData {
  agentId: AgentId;
  module: ModuleId;
  emailType: CommunicationSubtype;
  recipientEmail: string;
  subject: string;
  contentLength: number;
  tokensUsed: number;
  estimatedHumanTime: number; // Horas
  qualityScore: number; // 0-100
  sentimentScore: number; // -100 a +100
  direction: 'OUTBOUND' | 'INBOUND' | 'INTERNAL';
}

export interface DocumentTrackingData {
  agentId: AgentId;
  module: ModuleId;
  documentType: DocumentType;
  documentSubtype: string;
  title: string;
  description?: string;
  estimatedHumanTime: number; // Horas
  qualityScore: number; // 0-100
  accuracyScore: number; // 0-100
  completenessScore: number; // 0-100
  humanReviewRequired: boolean;
  humanApprovalRequired: boolean;
  tokensUsed: number;
  documentSizeBytes: number;
  pageCount?: number;
  language: string;
  templateUsed?: string;
}

export interface ChatTrackingData {
  agentId: AgentId;
  module: ModuleId;
  chatType: ChatType;
  sessionId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  resolution: boolean;
  satisfaction: number; // 1-5
  escalation: boolean;
  chatChannel: 'website' | 'mobile' | 'email' | 'whatsapp';
}

// Configuraciones de tipos
const EMAIL_TYPES = {
  sales_follow_up: {
    description: 'Seguimiento de leads y oportunidades',
    estimatedHumanTime: 0.25, // 15 minutos
    qualityThreshold: 85,
    expectedReplyRate: 0.15 // 15%
  },
  hr_communication: {
    description: 'Comunicaciones de recursos humanos',
    estimatedHumanTime: 0.33, // 20 minutos
    qualityThreshold: 90,
    expectedReplyRate: 0.25 // 25%
  },
  financial_notification: {
    description: 'Notificaciones financieras y facturas',
    estimatedHumanTime: 0.17, // 10 minutos
    qualityThreshold: 95,
    expectedReplyRate: 0.05 // 5%
  },
  support_response: {
    description: 'Respuestas de soporte técnico',
    estimatedHumanTime: 0.5, // 30 minutos
    qualityThreshold: 88,
    expectedReplyRate: 0.20 // 20%
  },
  general_communication: {
    description: 'Comunicaciones generales',
    estimatedHumanTime: 0.25, // 15 minutos
    qualityThreshold: 82,
    expectedReplyRate: 0.10 // 10%
  }
} as const;

const DOCUMENT_TYPES = {
  legal_contract: {
    description: 'Contratos legales',
    estimatedHumanTime: 4.0, // 4 horas
    qualityThreshold: 96,
    approvalRequired: true,
    templateBased: true
  },
  legal_opinion: {
    description: 'Opiniones legales',
    estimatedHumanTime: 6.0, // 6 horas
    qualityThreshold: 94,
    approvalRequired: true,
    templateBased: false
  },
  compliance_report: {
    description: 'Reportes de cumplimiento',
    estimatedHumanTime: 3.0, // 3 horas
    qualityThreshold: 95,
    approvalRequired: true,
    templateBased: true
  },
  financial_report: {
    description: 'Reportes financieros',
    estimatedHumanTime: 4.0, // 4 horas
    qualityThreshold: 94,
    approvalRequired: true,
    templateBased: true
  },
  invoice: {
    description: 'Facturas',
    estimatedHumanTime: 0.5, // 30 minutos
    qualityThreshold: 98,
    approvalRequired: false,
    templateBased: true
  },
  sales_proposal: {
    description: 'Propuestas comerciales',
    estimatedHumanTime: 3.0, // 3 horas
    qualityThreshold: 90,
    approvalRequired: true,
    templateBased: true
  },
  presentation: {
    description: 'Presentaciones',
    estimatedHumanTime: 2.5, // 2.5 horas
    qualityThreshold: 88,
    approvalRequired: true,
    templateBased: true
  },
  employment_contract: {
    description: 'Contratos de empleo',
    estimatedHumanTime: 2.0, // 2 horas
    qualityThreshold: 96,
    approvalRequired: true,
    templateBased: true
  },
  performance_review: {
    description: 'Evaluaciones de desempeño',
    estimatedHumanTime: 1.5, // 1.5 horas
    qualityThreshold: 92,
    approvalRequired: true,
    templateBased: true
  }
} as const;

const CHAT_TYPES = {
  technical_support: {
    description: 'Soporte técnico',
    estimatedHumanTime: 0.5, // 30 minutos
    qualityThreshold: 85,
    escalationThreshold: 0.15, // 15% requieren escalación
    expectedSatisfaction: 4.2
  },
  sales_chat: {
    description: 'Chat de ventas',
    estimatedHumanTime: 0.75, // 45 minutos
    qualityThreshold: 88,
    conversionThreshold: 0.25, // 25% de conversión
    expectedSatisfaction: 4.5
  },
  hr_support: {
    description: 'Soporte de RRHH',
    estimatedHumanTime: 0.33, // 20 minutos
    qualityThreshold: 90,
    escalationThreshold: 0.10, // 10% requieren escalación
    expectedSatisfaction: 4.3
  },
  general_inquiry: {
    description: 'Consultas generales',
    estimatedHumanTime: 0.25, // 15 minutos
    qualityThreshold: 82,
    escalationThreshold: 0.20, // 20% requieren escalación
    expectedSatisfaction: 4.0
  }
} as const;

/**
 * Hook principal para tracking de comunicaciones y documentos
 */
export const useCommunicationsTracking = () => {
  const { trackApiIntegration } = useApiIntegrationTracking();

  /**
   * Trackear envío de email
   */
  const trackEmailSent = useCallback(async (data: EmailTrackingData) => {
    const startTime = Date.now();
    
    try {
      // Simular envío de email
      const result = await sendEmail(data);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Trackear envío exitoso
      await trackApiIntegration({
        agentId: data.agentId,
        module: data.module,
        apiProvider: 'sendgrid',
        apiService: 'email',
        apiEndpoint: '/mail/send',
        apiMethod: 'POST',
        operationType: 'email_sent',
        operationData: {
          email_type: data.emailType,
          recipient: data.recipientEmail,
          subject: data.subject,
          content_length: data.contentLength,
          quality_score: data.qualityScore,
          sentiment_score: data.sentimentScore,
          direction: data.direction
        },
        operationResult: result,
        requestSuccess: true,
        responseTimeMs: responseTime,
        apiCost: 0.0001, // Costo por email
        humanTimeSaved: data.estimatedHumanTime,
        tokensUsed: data.tokensUsed
      });
      
      return result;
    } catch (error) {
      // Trackear fallo
      await trackApiIntegration({
        agentId: data.agentId,
        module: data.module,
        apiProvider: 'sendgrid',
        apiService: 'email',
        apiEndpoint: '/mail/send',
        apiMethod: 'POST',
        operationType: 'email_send_failed',
        operationData: data,
        operationResult: { error: error instanceof Error ? error.message : 'Unknown error' },
        requestSuccess: false,
        responseTimeMs: Date.now() - startTime,
        apiCost: 0.0001,
        humanTimeSaved: 0,
        tokensUsed: data.tokensUsed
      });
      
      throw error;
    }
  }, [trackApiIntegration]);

  /**
   * Trackear generación de documento
   */
  const trackDocumentGeneration = useCallback(async (data: DocumentTrackingData) => {
    const startTime = Date.now();
    
    try {
      // Simular generación de documento
      const result = await generateDocument(data);
      const endTime = Date.now();
      const generationTime = endTime - startTime;
      
      // Trackear generación exitosa
      await trackApiIntegration({
        agentId: data.agentId,
        module: data.module,
        apiProvider: 'internal',
        apiService: 'document_generation',
        apiEndpoint: '/documents/generate',
        apiMethod: 'POST',
        operationType: 'document_generated',
        operationData: {
          document_type: data.documentType,
          document_subtype: data.documentSubtype,
          title: data.title,
          quality_score: data.qualityScore,
          accuracy_score: data.accuracyScore,
          completeness_score: data.completenessScore,
          human_review_required: data.humanReviewRequired,
          human_approval_required: data.humanApprovalRequired,
          document_size_bytes: data.documentSizeBytes,
          page_count: data.pageCount,
          language: data.language,
          template_used: data.templateUsed
        },
        operationResult: result,
        requestSuccess: true,
        responseTimeMs: generationTime,
        apiCost: 0.0, // Sin costo directo
        humanTimeSaved: data.estimatedHumanTime,
        tokensUsed: data.tokensUsed
      });
      
      return result;
    } catch (error) {
      // Trackear fallo
      await trackApiIntegration({
        agentId: data.agentId,
        module: data.module,
        apiProvider: 'internal',
        apiService: 'document_generation',
        apiEndpoint: '/documents/generate',
        apiMethod: 'POST',
        operationType: 'document_generation_failed',
        operationData: { 
          document_type: data.documentType, 
          document_subtype: data.documentSubtype,
          title: data.title
        },
        operationResult: { error: error instanceof Error ? error.message : 'Unknown error' },
        requestSuccess: false,
        responseTimeMs: Date.now() - startTime,
        apiCost: 0.0,
        humanTimeSaved: 0,
        tokensUsed: 0
      });
      
      throw error;
    }
  }, [trackApiIntegration]);

  /**
   * Trackear sesión de chat
   */
  const trackChatSession = useCallback(async (data: ChatTrackingData) => {
    const startTime = Date.now();
    
    try {
      // Simular procesamiento de sesión de chat
      const result = await processChatSession(data);
      const endTime = Date.now();
      const sessionDuration = endTime - startTime;
      
      // Calcular métricas
      const aiMessages = data.messages.filter(m => m.role === 'assistant').length;
      const humanMessages = data.messages.filter(m => m.role === 'user').length;
      const avgResponseTime = sessionDuration / aiMessages;
      
      // Trackear sesión completada
      await trackApiIntegration({
        agentId: data.agentId,
        module: data.module,
        apiProvider: 'internal',
        apiService: 'chat',
        apiEndpoint: '/chat/session',
        apiMethod: 'POST',
        operationType: 'chat_session_completed',
        operationData: {
          chat_type: data.chatType,
          session_id: data.sessionId,
          customer_id: data.customerId,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          messages_count: data.messages.length,
          ai_messages_count: aiMessages,
          human_messages_count: humanMessages,
          resolution_achieved: data.resolution,
          satisfaction_rating: data.satisfaction,
          escalation_required: data.escalation,
          chat_channel: data.chatChannel,
          avg_response_time_ms: avgResponseTime
        },
        operationResult: result,
        requestSuccess: true,
        responseTimeMs: sessionDuration,
        apiCost: 0.0,
        humanTimeSaved: 0.5, // Estimación de tiempo ahorrado
        tokensUsed: result.tokensUsed || 0
      });
      
      return result;
    } catch (error) {
      // Trackear fallo
      await trackApiIntegration({
        agentId: data.agentId,
        module: data.module,
        apiProvider: 'internal',
        apiService: 'chat',
        apiEndpoint: '/chat/session',
        apiMethod: 'POST',
        operationType: 'chat_session_failed',
        operationData: { 
          chat_type: data.chatType, 
          session_id: data.sessionId,
          customer_id: data.customerId
        },
        operationResult: { error: error instanceof Error ? error.message : 'Unknown error' },
        requestSuccess: false,
        responseTimeMs: Date.now() - startTime,
        apiCost: 0.0,
        humanTimeSaved: 0,
        tokensUsed: 0
      });
      
      throw error;
    }
  }, [trackApiIntegration]);

  /**
   * Trackear engagement de email (apertura, click, respuesta)
   */
  const trackEmailEngagement = useCallback(async (
    emailId: string,
    engagementType: 'opened' | 'clicked' | 'replied',
    satisfaction?: number,
    sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  ) => {
    await trackApiIntegration({
      agentId: 'ATX' as AgentId,
      module: 'ATX' as ModuleId,
      apiProvider: 'internal',
      apiService: 'email_engagement',
      apiEndpoint: '/email/engagement',
      apiMethod: 'POST',
      operationType: `email_${engagementType}`,
      operationData: {
        email_id: emailId,
        engagement_type: engagementType,
        satisfaction_rating: satisfaction,
        response_sentiment: sentiment
      },
      operationResult: { success: true },
      requestSuccess: true,
      responseTimeMs: 0,
      apiCost: 0.0,
      humanTimeSaved: 0,
      tokensUsed: 0
    });
  }, [trackApiIntegration]);

  /**
   * Trackear uso de documento (vistas, descargas, compartidos)
   */
  const trackDocumentUsage = useCallback(async (
    documentId: string,
    usageType: 'viewed' | 'downloaded' | 'shared',
    approvalTime?: number
  ) => {
    await trackApiIntegration({
      agentId: 'ATX' as AgentId,
      module: 'ATX' as ModuleId,
      apiProvider: 'internal',
      apiService: 'document_usage',
      apiEndpoint: '/document/usage',
      apiMethod: 'POST',
      operationType: `document_${usageType}`,
      operationData: {
        document_id: documentId,
        usage_type: usageType,
        approval_time_ms: approvalTime
      },
      operationResult: { success: true },
      requestSuccess: true,
      responseTimeMs: 0,
      apiCost: 0.0,
      humanTimeSaved: 0,
      tokensUsed: 0
    });
  }, [trackApiIntegration]);

  return {
    trackEmailSent,
    trackDocumentGeneration,
    trackChatSession,
    trackEmailEngagement,
    trackDocumentUsage,
    EMAIL_TYPES,
    DOCUMENT_TYPES,
    CHAT_TYPES
  };
};

// Funciones simuladas para demostración
async function sendEmail(data: EmailTrackingData) {
  // Simulación de envío de email
  return { success: true, messageId: `email_${Date.now()}` };
}

async function generateDocument(data: DocumentTrackingData) {
  // Simulación de generación de documento
  return { 
    success: true, 
    documentId: `doc_${Date.now()}`,
    tokensUsed: data.tokensUsed
  };
}

async function processChatSession(data: ChatTrackingData) {
  // Simulación de procesamiento de chat
  return { 
    success: true, 
    sessionId: data.sessionId,
    tokensUsed: data.messages.length * 50 // Estimación de tokens
  };
} 