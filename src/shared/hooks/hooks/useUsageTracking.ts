import { useCallback } from 'react';
import { useAuth } from './useAuth';
// import posthog from 'posthog-js'; // TEMPORALMENTE DESHABILITADO

// Stub para PostHog mientras está deshabilitado
const posthog = {
  capture: (...args: any[]) => {}
};

// Tipos de agentes usando las siglas definidas
type AgentId = 'AG_LEGAL' | 'AG_CONT' | 'AG_VENT' | 'AG_DEV' | 'AG_MKT' | 'AG_HR' | 'AG_OPS' | 'AG_MGR';

// Tipos de módulos usando las siglas definidas
type ModuleId = 'CRM' | 'HD' | 'PQRS' | 'PORTAL-GOV' | 'PORTAL-EMP' | 'ATX' | 'TTX' | 'NTX' | 'AGNO';

// Tipos de tareas por agente
interface TaskTypes {
  AG_LEGAL: {
    document_generation: 'contracts' | 'legal_opinions' | 'compliance_reports' | 'legal_analysis';
    document_review: 'contract_review' | 'legal_validation' | 'risk_assessment';
    legal_consultation: 'legal_advice' | 'regulation_check' | 'compliance_check';
  };
  AG_CONT: {
    financial_analysis: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'financial_ratios';
    reporting: 'monthly_reports' | 'tax_reports' | 'audit_reports' | 'budget_analysis';
    data_processing: 'invoice_processing' | 'expense_analysis' | 'reconciliation';
  };
  AG_VENT: {
    crm_management: 'lead_qualification' | 'opportunity_tracking' | 'customer_analysis' | 'sales_forecasting';
    communication: 'email_campaigns' | 'follow_up_emails' | 'proposal_generation' | 'presentation_creation';
    sales_analysis: 'performance_analysis' | 'market_analysis' | 'competitor_analysis';
  };
  AG_DEV: {
    code_analysis: 'code_review' | 'bug_analysis' | 'performance_optimization' | 'security_audit';
    development: 'feature_development' | 'api_integration' | 'testing' | 'deployment';
    documentation: 'code_documentation' | 'api_documentation' | 'technical_writing';
  };
  AG_MKT: {
    campaign_management: 'email_campaigns' | 'social_media_campaigns' | 'content_creation' | 'ad_management';
    analytics: 'performance_analysis' | 'market_research' | 'competitor_analysis' | 'roi_analysis';
    content_creation: 'blog_posts' | 'social_media_content' | 'marketing_materials';
  };
  AG_HR: {
    recruitment: 'candidate_screening' | 'interview_scheduling' | 'offer_letters' | 'onboarding';
    employee_management: 'performance_reviews' | 'training_coordination' | 'benefits_administration';
    compliance: 'policy_creation' | 'compliance_reports' | 'legal_documentation';
  };
  AG_OPS: {
    process_optimization: 'workflow_analysis' | 'efficiency_improvement' | 'automation_implementation';
    quality_management: 'quality_control' | 'audit_preparation' | 'compliance_monitoring';
    resource_management: 'inventory_management' | 'supplier_coordination' | 'cost_analysis';
  };
  AG_MGR: {
    consolidation: 'data_consolidation' | 'report_generation' | 'decision_support';
    coordination: 'team_coordination' | 'project_management' | 'stakeholder_communication';
    strategy: 'strategic_planning' | 'performance_monitoring' | 'resource_allocation';
  };
}

// Tipos de tareas por módulo
interface ModuleTaskTypes {
  CRM: {
    contact_management: 'contact_creation' | 'contact_update' | 'contact_analysis' | 'contact_segmentation';
    sales_pipeline: 'lead_creation' | 'opportunity_creation' | 'deal_tracking' | 'win_loss_analysis';
    interactions: 'email_logging' | 'call_logging' | 'meeting_scheduling' | 'follow_up_reminders';
  };
  HD: {
    ticket_management: 'ticket_creation' | 'ticket_assignment' | 'ticket_resolution' | 'ticket_escalation';
    knowledge_base: 'article_creation' | 'article_update' | 'search_analytics' | 'content_optimization';
    support: 'chat_support' | 'email_support' | 'phone_support' | 'self_service';
  };
  PQRS: {
    pqrs_management: 'request_creation' | 'complaint_processing' | 'claim_resolution' | 'suggestion_analysis';
    workflow: 'approval_process' | 'routing_logic' | 'status_tracking' | 'deadline_management';
    reporting: 'regulatory_reports' | 'compliance_reports' | 'performance_metrics';
  };
  'PORTAL-GOV': {
    citizen_services: 'service_requests' | 'document_processing' | 'information_dissemination';
    compliance: 'regulatory_compliance' | 'audit_preparation' | 'reporting';
  };
  'PORTAL-EMP': {
    business_services: 'business_registration' | 'license_management' | 'compliance_reporting';
    support: 'business_support' | 'document_processing' | 'information_access';
  };
  ATX: {
    contextual_assistance: 'smart_suggestions' | 'auto_completion' | 'context_awareness' | 'proactive_help';
    integration: 'cross_module_assistance' | 'data_synthesis' | 'workflow_assistance';
  };
  TTX: {
    task_management: 'task_creation' | 'task_assignment' | 'task_tracking' | 'task_completion';
    automation: 'workflow_automation' | 'task_scheduling' | 'reminder_system';
  };
  NTX: {
    notification_system: 'email_notifications' | 'push_notifications' | 'in_app_notifications' | 'sms_notifications';
    alert_management: 'critical_alerts' | 'warning_alerts' | 'info_alerts';
  };
  AGNO: {
    orchestration: 'agent_coordination' | 'workflow_orchestration' | 'resource_allocation';
    optimization: 'performance_optimization' | 'cost_optimization' | 'efficiency_improvement';
  };
}

// Configuración de tiempo estimado por tipo de tarea
const TASK_TIME_CONFIG = {
  // AG_LEGAL
  document_generation: { contracts: 4.0, legal_opinions: 6.0, compliance_reports: 3.0, legal_analysis: 5.0 },
  document_review: { contract_review: 2.0, legal_validation: 1.5, risk_assessment: 3.0 },
  legal_consultation: { legal_advice: 1.0, regulation_check: 0.5, compliance_check: 1.5 },
  
  // AG_CONT
  financial_analysis: { balance_sheet: 3.0, income_statement: 2.5, cash_flow: 2.0, financial_ratios: 1.5 },
  reporting: { monthly_reports: 4.0, tax_reports: 5.0, audit_reports: 6.0, budget_analysis: 3.0 },
  data_processing: { invoice_processing: 0.5, expense_analysis: 1.0, reconciliation: 2.0 },
  
  // AG_VENT
  crm_management: { lead_qualification: 0.5, opportunity_tracking: 1.0, customer_analysis: 2.0, sales_forecasting: 3.0 },
  communication: { email_campaigns: 2.0, follow_up_emails: 0.3, proposal_generation: 4.0, presentation_creation: 3.0 },
  sales_analysis: { performance_analysis: 2.0, market_analysis: 3.0, competitor_analysis: 2.5 },
  
  // AG_DEV
  code_analysis: { code_review: 2.0, bug_analysis: 1.5, performance_optimization: 3.0, security_audit: 4.0 },
  development: { feature_development: 8.0, api_integration: 4.0, testing: 2.0, deployment: 1.0 },
  documentation: { code_documentation: 2.0, api_documentation: 3.0, technical_writing: 2.5 },
  
  // AG_MKT
  campaign_management: { email_campaigns: 2.0, social_media_campaigns: 1.5, content_creation: 3.0, ad_management: 2.0 },
  analytics: { performance_analysis: 2.0, market_research: 4.0, competitor_analysis: 3.0, roi_analysis: 2.5 },
  content_creation: { blog_posts: 3.0, social_media_content: 1.0, marketing_materials: 2.5 },
  
  // AG_HR
  recruitment: { candidate_screening: 1.0, interview_scheduling: 0.5, offer_letters: 1.0, onboarding: 2.0 },
  employee_management: { performance_reviews: 2.0, training_coordination: 1.5, benefits_administration: 1.0 },
  compliance: { policy_creation: 3.0, compliance_reports: 2.0, legal_documentation: 2.5 },
  
  // AG_OPS
  process_optimization: { workflow_analysis: 3.0, efficiency_improvement: 4.0, automation_implementation: 5.0 },
  quality_management: { quality_control: 1.5, audit_preparation: 3.0, compliance_monitoring: 2.0 },
  resource_management: { inventory_management: 1.0, supplier_coordination: 1.5, cost_analysis: 2.0 },
  
  // AG_MGR
  consolidation: { data_consolidation: 2.0, report_generation: 3.0, decision_support: 1.5 },
  coordination: { team_coordination: 1.0, project_management: 2.0, stakeholder_communication: 1.5 },
  strategy: { strategic_planning: 4.0, performance_monitoring: 1.0, resource_allocation: 2.0 }
};

// Configuración de complejidad por tipo de tarea
const TASK_COMPLEXITY_CONFIG = {
  LOW: ['follow_up_emails', 'invoice_processing', 'interview_scheduling', 'inventory_management'],
  MEDIUM: ['contact_creation', 'ticket_resolution', 'expense_analysis', 'social_media_content'],
  HIGH: ['legal_analysis', 'financial_analysis', 'code_review', 'strategic_planning'],
  CRITICAL: ['compliance_reports', 'audit_reports', 'security_audit', 'legal_opinions']
};

/**
 * Hook para tracking de usage con PostHog
 * 
 * Proporciona funciones para trackear automáticamente todas las interacciones
 * con agentes IA y módulos del sistema.
 */
export const useUsageTracking = () => {
  const { user } = useAuth();

  /**
   * Obtiene el tiempo estimado para una tarea humana
   */
  const getEstimatedHumanTime = useCallback((taskType: string, taskSubtype: string): number => {
    const taskConfig = TASK_TIME_CONFIG[taskType as keyof typeof TASK_TIME_CONFIG];
    if (taskConfig && taskConfig[taskSubtype as keyof typeof taskConfig]) {
      return taskConfig[taskSubtype as keyof typeof taskConfig] as number;
    }
    return 1.0; // Tiempo por defecto: 1 hora
  }, []);

  /**
   * Obtiene la complejidad de una tarea
   */
  const getTaskComplexity = useCallback((taskSubtype: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    for (const [complexity, tasks] of Object.entries(TASK_COMPLEXITY_CONFIG)) {
      if (tasks.includes(taskSubtype)) {
        return complexity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      }
    }
    return 'MEDIUM'; // Complejidad por defecto
  }, []);

  /**
   * Trackea el inicio de una tarea de agente
   */
  const trackAgentTaskStart = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    taskType: string,
    taskSubtype: string,
    estimatedHumanTime: number
  ) => {
    if (!user?.company_id) return;

    const taskId = crypto.randomUUID();
    const complexity = getTaskComplexity(taskSubtype);

    posthog.capture('agent_task_started', {
      task_id: taskId,
      agent_id: agentId,
      company_id: user.company_id,
      user_id: user.id,
      module,
      task_type: taskType,
      task_subtype: taskSubtype,
      task_complexity: complexity,
      estimated_human_time: estimatedHumanTime,
      timestamp: new Date().toISOString()
    });

    return taskId;
  }, [user?.company_id, user?.id, getTaskComplexity]);

  /**
   * Trackea la completación de una tarea de agente
   */
  const trackAgentTaskComplete = useCallback(async (
    taskId: string,
    agentId: AgentId,
    module: ModuleId,
    taskType: string,
    taskSubtype: string,
    result: {
      successRate?: number;
      needsReview?: boolean;
      tokensUsed?: number;
      modelUsed?: string;
      actualTime?: number;
      humanOverrides?: number;
    }
  ) => {
    if (!user?.company_id) return;

    const {
      successRate = 100,
      needsReview = false,
      tokensUsed = 0,
      modelUsed = 'gpt-4',
      actualTime = 0,
      humanOverrides = 0
    } = result;

    const estimatedTime = getEstimatedHumanTime(taskType, taskSubtype);
    const timeSaved = estimatedTime - actualTime;
    const costSaved = timeSaved * 50; // $50 por hora
    const aiCost = tokensUsed * 0.0001; // $0.0001 por token

    posthog.capture('agent_task_completed', {
      task_id: taskId,
      agent_id: agentId,
      company_id: user.company_id,
      user_id: user.id,
      module,
      task_type: taskType,
      task_subtype: taskSubtype,
      success_rate: successRate,
      human_review_required: needsReview,
      tokens_used: tokensUsed,
      model_used: modelUsed,
      estimated_human_time: estimatedTime,
      actual_ai_time: actualTime,
      time_saved: timeSaved,
      cost_saved: costSaved,
      ai_cost: aiCost,
      human_overrides: humanOverrides,
      roi_percentage: aiCost > 0 ? ((costSaved - aiCost) / aiCost) * 100 : 0,
      timestamp: new Date().toISOString()
    });
  }, [user?.company_id, user?.id, getEstimatedHumanTime]);

  /**
   * Trackea el fallo de una tarea de agente
   */
  const trackAgentTaskFailed = useCallback(async (
    taskId: string,
    agentId: AgentId,
    module: ModuleId,
    taskType: string,
    taskSubtype: string,
    error: string
  ) => {
    if (!user?.company_id) return;

    posthog.capture('agent_task_failed', {
      task_id: taskId,
      agent_id: agentId,
      company_id: user.company_id,
      user_id: user.id,
      module,
      task_type: taskType,
      task_subtype: taskSubtype,
      error_message: error,
      timestamp: new Date().toISOString()
    });
  }, [user?.company_id, user?.id]);

  /**
   * Función principal para trackear tareas de agentes
   */
  const trackAgentTask = useCallback(async <T>(
    agentId: AgentId,
    module: ModuleId,
    taskType: string,
    taskSubtype: string,
    taskFn: () => Promise<T>
  ): Promise<T> => {
    const estimatedTime = getEstimatedHumanTime(taskType, taskSubtype);
    const startTime = Date.now();
    
    // Trackear inicio
    const taskId = await trackAgentTaskStart(agentId, module, taskType, taskSubtype, estimatedTime);
    
    try {
      // Ejecutar tarea
      const result = await taskFn();
      const endTime = Date.now();
      const actualTime = (endTime - startTime) / (1000 * 60 * 60); // Convertir a horas
      
      // Trackear completación
      await trackAgentTaskComplete(taskId!, agentId, module, taskType, taskSubtype, {
        successRate: 100,
        needsReview: false,
        tokensUsed: (result as any).tokensUsed || 0,
        modelUsed: (result as any).modelUsed || 'gpt-4',
        actualTime,
        humanOverrides: 0
      });
      
      return result;
    } catch (error) {
      // Trackear fallo
      await trackAgentTaskFailed(taskId!, agentId, module, taskType, taskSubtype, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }, [trackAgentTaskStart, trackAgentTaskComplete, trackAgentTaskFailed, getEstimatedHumanTime]);

  /**
   * Trackea eventos de módulos
   */
  const trackModuleEvent = useCallback(async (
    module: ModuleId,
    eventType: string,
    eventData: Record<string, any>
  ) => {
    if (!user?.company_id) return;

    posthog.capture('module_event', {
      module,
      event_type: eventType,
      company_id: user.company_id,
      user_id: user.id,
      ...eventData,
      timestamp: new Date().toISOString()
    });
  }, [user?.company_id, user?.id]);

  /**
   * Trackea consumo de tokens
   */
  const trackTokenUsage = useCallback(async (
    tokens: number,
    model: string,
    context: string
  ) => {
    if (!user?.company_id) return;

    posthog.capture('token_usage', {
      tokens_used: tokens,
      model_used: model,
      context,
      company_id: user.company_id,
      user_id: user.id,
      cost: tokens * 0.0001,
      timestamp: new Date().toISOString()
    });
  }, [user?.company_id, user?.id]);

  return {
    trackAgentTask,
    trackModuleEvent,
    trackTokenUsage,
    getEstimatedHumanTime,
    getTaskComplexity
  };
}; 