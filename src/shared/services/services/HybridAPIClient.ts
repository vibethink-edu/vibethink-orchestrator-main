/**
 * Cliente API Híbrido React + Python
 * Enrutamiento inteligente entre Supabase y FastAPI
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAuth } from '@/shared/hooks/useAuth';
import { logger } from '@/shared/utils/logger';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export interface Operation {
  type: 'react' | 'python';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
}

export interface APIClient {
  // Endpoints React (Supabase)
  auth: AuthService;
  ui: UIService;
  user: UserService;
  company: CompanyService;
  
  // Endpoints Python (FastAPI)
  analytics: AnalyticsService;
  ai: AIService;
  workflows: WorkflowService;
  documents: DocumentService;
  
  // Método unificado
  execute<T>(operation: Operation): Promise<T>;
}

// ============================================================================
// SERVICIOS REACT (SUPABASE)
// ============================================================================

export class AuthService {
  constructor(private supabase: SupabaseClient) {}
  
  async login(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }
  
  async logout() {
    return this.supabase.auth.signOut();
  }
  
  async getCurrentUser() {
    return this.supabase.auth.getUser();
  }
}

export class UIService {
  constructor(private supabase: SupabaseClient) {}
  
  async getUIState(userId: string) {
    return this.supabase
      .from('ui_state')
      .select('*')
      .eq('user_id', userId)
      .single();
  }
  
  async updateUIState(userId: string, state: any) {
    return this.supabase
      .from('ui_state')
      .upsert({ user_id: userId, state })
      .select()
      .single();
  }
}

export class UserService {
  constructor(private supabase: SupabaseClient) {}
  
  async getUserProfile(userId: string) {
    return this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
  }
  
  async updateUserProfile(userId: string, profile: any) {
    return this.supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single();
  }
}

export class CompanyService {
  constructor(private supabase: SupabaseClient) {}
  
  async getCompanyData(companyId: string) {
    return this.supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
  }
  
  async updateCompanyData(companyId: string, data: any) {
    return this.supabase
      .from('companies')
      .update(data)
      .eq('id', companyId)
      .select()
      .single();
  }
}

// ============================================================================
// SERVICIOS PYTHON (FASTAPI)
// ============================================================================

export class AnalyticsService {
  constructor(private pythonAPI: AxiosInstance) {}
  
  async processData(data: any) {
    const response = await this.pythonAPI.post('/api/v1/analytics/process', {
      data_source: 'enterprise_data',
      metrics: ['revenue_analysis', 'customer_segmentation', 'performance_metrics'],
      data
    });
    return response.data;
  }
  
  async generateReports(companyId: string, metrics: string[]) {
    const response = await this.pythonAPI.post('/api/v1/analytics/reports', {
      company_id: companyId,
      data_source: 'enterprise_data',
      metrics
    });
    return response.data;
  }
  
  async getTrends(companyId: string, dateRange: { start: string; end: string }) {
    const response = await this.pythonAPI.post('/api/v1/analytics/process', {
      company_id: companyId,
      data_source: 'enterprise_data',
      metrics: ['trend_analysis'],
      date_range: dateRange
    });
    return response.data;
  }
}

export class AIService {
  constructor(private pythonAPI: AxiosInstance) {}
  
  async processRequest(companyId: string, userId: string, query: string, context?: any) {
    const response = await this.pythonAPI.post('/api/v1/ai/agent', {
      company_id: companyId,
      user_id: userId,
      query,
      context,
      model: 'gpt-4'
    });
    return response.data;
  }
  
  async analyzeData(companyId: string, data: any, query: string) {
    const response = await this.pythonAPI.post('/api/v1/ai/analyze', {
      company_id: companyId,
      query,
      context: data,
      model: 'gpt-4'
    });
    return response.data;
  }
  
  async generateInsights(companyId: string, data: any) {
    const response = await this.pythonAPI.post('/api/v1/ai/agent', {
      company_id: companyId,
      query: 'Generate business insights from this data',
      context: data,
      model: 'gpt-4'
    });
    return response.data;
  }
}

export class WorkflowService {
  constructor(private pythonAPI: AxiosInstance) {}
  
  async executeWorkflow(companyId: string, workflowId: string, inputData: any) {
    const response = await this.pythonAPI.post('/api/v1/workflows/execute', {
      company_id: companyId,
      workflow_id: workflowId,
      input_data: inputData,
      priority: 'normal'
    });
    return response.data;
  }
  
  async getWorkflowStatus(workflowId: string) {
    const response = await this.pythonAPI.get(`/api/v1/workflows/status/${workflowId}`);
    return response.data;
  }
  
  async createWorkflow(companyId: string, workflowDefinition: any) {
    const response = await this.pythonAPI.post('/api/v1/workflows/create', {
      company_id: companyId,
      workflow_definition: workflowDefinition
    });
    return response.data;
  }
}

export class DocumentService {
  constructor(private pythonAPI: AxiosInstance) {}
  
  async processDocument(companyId: string, documentType: string, content: string, metadata?: any) {
    const response = await this.pythonAPI.post('/api/v1/documents/process', {
      company_id: companyId,
      document_type: documentType,
      content,
      metadata
    });
    return response.data;
  }
  
  async extractData(companyId: string, documentType: string, content: string) {
    const response = await this.pythonAPI.post('/api/v1/documents/extract', {
      company_id: companyId,
      document_type: documentType,
      content
    });
    return response.data;
  }
  
  async analyzeDocument(companyId: string, documentContent: string) {
    const response = await this.pythonAPI.post('/api/v1/ai/analyze', {
      company_id: companyId,
      query: 'Analyze this document and extract key information',
      context: { document_content: documentContent },
      model: 'gpt-4'
    });
    return response.data;
  }
}

// ============================================================================
// CLIENTE API HÍBRIDO PRINCIPAL
// ============================================================================

export class HybridAPIClient implements APIClient {
  private supabase: SupabaseClient;
  private pythonAPI: AxiosInstance;
  
  // Servicios React
  public auth: AuthService;
  public ui: UIService;
  public user: UserService;
  public company: CompanyService;
  
  // Servicios Python
  public analytics: AnalyticsService;
  public ai: AIService;
  public workflows: WorkflowService;
  public documents: DocumentService;
  
  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!
    );
    
    // Inicializar FastAPI
    this.pythonAPI = axios.create({
      baseURL: import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Configurar interceptor para JWT
    this.pythonAPI.interceptors.request.use(async (config) => {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });
    
    // Inicializar servicios
    this.auth = new AuthService(this.supabase);
    this.ui = new UIService(this.supabase);
    this.user = new UserService(this.supabase);
    this.company = new CompanyService(this.supabase);
    
    this.analytics = new AnalyticsService(this.pythonAPI);
    this.ai = new AIService(this.pythonAPI);
    this.workflows = new WorkflowService(this.pythonAPI);
    this.documents = new DocumentService(this.pythonAPI);
  }
  
  /**
   * Método unificado para ejecutar operaciones
   * Enrutamiento inteligente entre React y Python
   */
  async execute<T>(operation: Operation): Promise<T> {
    try {
      const shouldUsePython = this.shouldUsePython(operation);
      
      if (shouldUsePython) {
        logger.info({ 
          service: 'HybridAPIClient', 
          operation: operation.type,
          endpoint: operation.endpoint 
        }, 'Ejecutando operación Python');
        return await this.executePythonOperation<T>(operation);
      } else {
        logger.info({ 
          service: 'HybridAPIClient', 
          operation: operation.type,
          endpoint: operation.endpoint 
        }, 'Ejecutando operación React');
        return await this.executeReactOperation<T>(operation);
      }
    } catch (error) {
      logger.error({ 
        service: 'HybridAPIClient', 
        operation: operation.type,
        endpoint: operation.endpoint,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Error ejecutando operación');
      throw error;
    }
  }
  
  /**
   * Determinar si usar Python basado en el tipo de operación
   */
  private shouldUsePython(operation: Operation): boolean {
    const pythonOperations = [
      'data_processing',
      'ai_analysis',
      'workflow_execution',
      'document_processing',
      'complex_analytics',
      'machine_learning',
      'predictive_analysis',
      'natural_language_processing'
    ];
    
    return pythonOperations.includes(operation.type);
  }
  
  /**
   * Ejecutar operación en Python (FastAPI)
   */
  private async executePythonOperation<T>(operation: Operation): Promise<T> {
    const { method, endpoint, data, params } = operation;
    
    let response: AxiosResponse<T>;
    
    switch (method) {
      case 'GET':
        response = await this.pythonAPI.get(endpoint, { params });
        break;
      case 'POST':
        response = await this.pythonAPI.post(endpoint, data, { params });
        break;
      case 'PUT':
        response = await this.pythonAPI.put(endpoint, data, { params });
        break;
      case 'DELETE':
        response = await this.pythonAPI.delete(endpoint, { params });
        break;
      default:
        throw new Error(`Método HTTP no soportado: ${method}`);
    }
    
    return response.data;
  }
  
  /**
   * Ejecutar operación en React (Supabase)
   */
  private async executeReactOperation<T>(operation: Operation): Promise<T> {
    const { method, endpoint, data, params } = operation;
    
    let response: any;
    
    switch (method) {
      case 'GET':
        response = await this.supabase
          .from(endpoint)
          .select('*')
          .match(params || {});
        break;
      case 'POST':
        response = await this.supabase
          .from(endpoint)
          .insert(data)
          .select();
        break;
      case 'PUT':
        response = await this.supabase
          .from(endpoint)
          .update(data)
          .match(params || {})
          .select();
        break;
      case 'DELETE':
        response = await this.supabase
          .from(endpoint)
          .delete()
          .match(params || {});
        break;
      default:
        throw new Error(`Método HTTP no soportado: ${method}`);
    }
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  }
  
  /**
   * Método de conveniencia para operaciones de analytics
   */
  async processAnalytics(companyId: string, data: any, metrics: string[] = []) {
    return this.analytics.processData({
      company_id: companyId,
      data_source: 'enterprise_data',
      metrics: metrics.length > 0 ? metrics : [
        'revenue_analysis',
        'customer_segmentation',
        'performance_metrics'
      ],
      data
    });
  }
  
  /**
   * Método de conveniencia para operaciones de IA
   */
  async processAIRequest(companyId: string, userId: string, query: string, context?: any) {
    return this.ai.processRequest(companyId, userId, query, context);
  }
  
  /**
   * Método de conveniencia para workflows
   */
  async executeWorkflow(companyId: string, workflowId: string, inputData: any) {
    return this.workflows.executeWorkflow(companyId, workflowId, inputData);
  }
  
  /**
   * Método de conveniencia para documentos
   */
  async processDocument(companyId: string, documentType: string, content: string, metadata?: any) {
    return this.documents.processDocument(companyId, documentType, content, metadata);
  }
}

// ============================================================================
// HOOK PERSONALIZADO PARA USAR EL CLIENTE HÍBRIDO
// ============================================================================

export function useHybridAPI() {
  const { user } = useAuth();
  
  // Crear instancia del cliente
  const apiClient = new HybridAPIClient();
  
  // Métodos de conveniencia con contexto de usuario
  const executeWithUser = async <T>(operation: Omit<Operation, 'data'> & { data?: any }): Promise<T> => {
    if (user) {
      // Agregar contexto de usuario automáticamente
      const enrichedData = {
        ...operation.data,
        user_id: user.id,
        company_id: user.company_id
      };
      
      return apiClient.execute<T>({
        ...operation,
        data: enrichedData
      });
    }
    
    return apiClient.execute<T>(operation);
  };
  
  return {
    // Cliente completo
    client: apiClient,
    
    // Métodos de conveniencia
    execute: executeWithUser,
    
    // Servicios React
    auth: apiClient.auth,
    ui: apiClient.ui,
    user: apiClient.user,
    company: apiClient.company,
    
    // Servicios Python
    analytics: apiClient.analytics,
    ai: apiClient.ai,
    workflows: apiClient.workflows,
    documents: apiClient.documents,
    
    // Métodos de alto nivel
    processAnalytics: (data: any, metrics?: string[]) => 
      apiClient.processAnalytics(user?.company_id!, data, metrics),
    
    processAIRequest: (query: string, context?: any) =>
      apiClient.processAIRequest(user?.company_id!, user?.id!, query, context),
    
    executeWorkflow: (workflowId: string, inputData: any) =>
      apiClient.executeWorkflow(user?.company_id!, workflowId, inputData),
    
    processDocument: (documentType: string, content: string, metadata?: any) =>
      apiClient.processDocument(user?.company_id!, documentType, content, metadata)
  };
}

// ============================================================================
// EJEMPLOS DE USO
// ============================================================================

export const useAnalyticsExample = () => {
  const { processAnalytics } = useHybridAPI();
  
  const analyzeCompanyData = async (data: any) => {
    try {
      const result = await processAnalytics(data, [
        'revenue_analysis',
        'customer_segmentation',
        'performance_metrics',
        'predictive_analysis'
      ]);
      return result;
    } catch (error) {
      // TODO: log Error analizando datos en desarrollo
      throw error;
    }
  };
  
  return { analyzeCompanyData };
};

export const useAIExample = () => {
  const { processAIRequest } = useHybridAPI();
  
  const askAI = async (question: string, context?: any) => {
    try {
      const response = await processAIRequest(question, context);
      return response;
    } catch (error) {
      // TODO: log Error consultando IA en desarrollo
      throw error;
    }
  };
  
  return { askAI };
};

export const useWorkflowExample = () => {
  const { executeWorkflow } = useHybridAPI();
  
  const runBusinessWorkflow = async (workflowId: string, data: any) => {
    try {
      const result = await executeWorkflow(workflowId, data);
      return result;
    } catch (error) {
      // TODO: log Error ejecutando workflow en desarrollo
      throw error;
    }
  };
  
  return { runBusinessWorkflow };
};

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default HybridAPIClient; 