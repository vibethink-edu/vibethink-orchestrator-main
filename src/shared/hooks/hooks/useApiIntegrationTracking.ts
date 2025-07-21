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

// Proveedores de API comunes
type ApiProvider = 'opentable' | 'stripe' | 'google' | 'zapier' | 'sendgrid' | 'twilio' | 'aws' | 'azure';

// Servicios de API
type ApiService = 'reservations' | 'payments' | 'calendar' | 'automation' | 'email' | 'sms' | 'storage' | 'compute';

interface ApiIntegrationTrackingData {
  agentId: AgentId;
  module: ModuleId;
  apiProvider: ApiProvider;
  apiService: ApiService;
  apiEndpoint: string;
  apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  operationType: string;
  operationData: any;
  operationResult: any;
  requestSuccess: boolean;
  responseTimeMs: number;
  apiCost: number;
  humanTimeSaved: number;
  tokensUsed?: number;
  revenueGenerated?: number;
}

// Configuración de costos por proveedor
const API_COST_CONFIG = {
  opentable: {
    reservations: { cost_per_request: 0.25, human_time_saved: 0.5 },
    availability: { cost_per_request: 0.10, human_time_saved: 0.25 }
  },
  stripe: {
    payments: { cost_per_request: 0.30, human_time_saved: 0.25, fee_percentage: 0.029 },
    refunds: { cost_per_request: 0.30, human_time_saved: 0.5 },
    subscriptions: { cost_per_request: 0.30, human_time_saved: 1.0 }
  },
  google: {
    calendar: { cost_per_request: 0.0, human_time_saved: 0.33 },
    drive: { cost_per_request: 0.0, human_time_saved: 0.5 },
    gmail: { cost_per_request: 0.0, human_time_saved: 0.25 }
  },
  zapier: {
    automation: { cost_per_request: 0.0, human_time_saved: 2.0, monthly_cost: 45 },
    webhooks: { cost_per_request: 0.0, human_time_saved: 1.0 }
  },
  sendgrid: {
    email: { cost_per_request: 0.0001, human_time_saved: 0.1 },
    templates: { cost_per_request: 0.0, human_time_saved: 0.5 }
  },
  twilio: {
    sms: { cost_per_request: 0.0075, human_time_saved: 0.1 },
    calls: { cost_per_request: 0.0225, human_time_saved: 0.5 }
  },
  aws: {
    storage: { cost_per_request: 0.0001, human_time_saved: 0.5 },
    compute: { cost_per_request: 0.01, human_time_saved: 1.0 }
  },
  azure: {
    storage: { cost_per_request: 0.0001, human_time_saved: 0.5 },
    compute: { cost_per_request: 0.01, human_time_saved: 1.0 }
  }
};

/**
 * Hook para tracking de integraciones con APIs externas
 * 
 * Proporciona funciones para trackear automáticamente todas las
 * interacciones con APIs externas y calcular ROI.
 */
export const useApiIntegrationTracking = () => {
  const { user } = useAuth();

  /**
   * Obtiene la configuración de costo para una API específica
   */
  const getApiCostConfig = useCallback((
    provider: ApiProvider,
    service: ApiService
  ) => {
    const providerConfig = API_COST_CONFIG[provider];
    if (providerConfig && providerConfig[service]) {
      return providerConfig[service];
    }
    return { cost_per_request: 0.0, human_time_saved: 0.5 };
  }, []);

  /**
   * Calcula el costo de la API basado en la operación
   */
  const calculateApiCost = useCallback((
    provider: ApiProvider,
    service: ApiService,
    operationData: any
  ): number => {
    const config = getApiCostConfig(provider, service);
    let baseCost = config.cost_per_request;

    // Cálculos específicos por proveedor
    if (provider === 'stripe' && service === 'payments') {
      const amount = operationData.amount || 0;
      baseCost += amount * config.fee_percentage;
    }

    if (provider === 'zapier' && service === 'automation') {
      // Costo mensual dividido por operaciones estimadas
      baseCost = config.monthly_cost / 1000; // Estimación de 1000 operaciones/mes
    }

    return baseCost;
  }, [getApiCostConfig]);

  /**
   * Trackea una integración con API externa
   */
  const trackApiIntegration = useCallback(async (data: ApiIntegrationTrackingData) => {
    if (!user?.company_id) return;

    const {
      agentId,
      module,
      apiProvider,
      apiService,
      apiEndpoint,
      apiMethod,
      operationType,
      operationData,
      operationResult,
      requestSuccess,
      responseTimeMs,
      apiCost,
      humanTimeSaved,
      tokensUsed = 0,
      revenueGenerated = 0
    } = data;

    // Calcular métricas
    const costSaved = humanTimeSaved * 50; // $50 por hora
    const roi = apiCost > 0 ? ((costSaved - apiCost) / apiCost) * 100 : 0;
    const netRevenue = revenueGenerated - apiCost;

    // Evento PostHog
    posthog.capture('api_integration_used', {
      agent_id: agentId,
      company_id: user.company_id,
      user_id: user.id,
      module,
      api_provider: apiProvider,
      api_service: apiService,
      api_endpoint: apiEndpoint,
      api_method: apiMethod,
      operation_type: operationType,
      request_success: requestSuccess,
      response_time_ms: responseTimeMs,
      api_cost: apiCost,
      human_time_saved: humanTimeSaved,
      cost_saved: costSaved,
      tokens_used: tokensUsed,
      revenue_generated: revenueGenerated,
      net_revenue: netRevenue,
      roi_percentage: roi,
      operation_data: operationData,
      operation_result: operationResult,
      timestamp: new Date().toISOString()
    });

    // Guardar en base de datos (simulado)
    await saveApiIntegrationUsage({
      company_id: user.company_id,
      user_id: user.id,
      agent_id: agentId,
      module,
      api_provider: apiProvider,
      api_service: apiService,
      api_endpoint: apiEndpoint,
      api_method: apiMethod,
      request_success: requestSuccess,
      response_time_ms: responseTimeMs,
      tokens_used: tokensUsed,
      api_cost: apiCost,
      human_time_saved: humanTimeSaved,
      operation_type: operationType,
      operation_data: operationData,
      operation_result: operationResult,
      revenue_generated: revenueGenerated,
      status: requestSuccess ? 'COMPLETED' : 'FAILED'
    });

  }, [user?.company_id, user?.id]);

  /**
   * Función principal para trackear operaciones de API
   */
  const trackApiOperation = useCallback(async <T>(
    agentId: AgentId,
    module: ModuleId,
    apiProvider: ApiProvider,
    apiService: ApiService,
    operationType: string,
    operationData: any,
    apiOperation: () => Promise<T>
  ): Promise<T> => {
    const startTime = Date.now();
    const config = getApiCostConfig(apiProvider, apiService);
    
    try {
      // Ejecutar operación de API
      const result = await apiOperation();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Calcular costo
      const apiCost = calculateApiCost(apiProvider, apiService, operationData);
      
      // Trackear éxito
      await trackApiIntegration({
        agentId,
        module,
        apiProvider,
        apiService,
        apiEndpoint: `/${apiService}`,
        apiMethod: 'POST',
        operationType,
        operationData,
        operationResult: result,
        requestSuccess: true,
        responseTimeMs: responseTime,
        apiCost,
        humanTimeSaved: config.human_time_saved,
        tokensUsed: 0, // Las APIs externas no usan tokens de IA
        revenueGenerated: (result as any).revenue || 0
      });
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const apiCost = calculateApiCost(apiProvider, apiService, operationData);
      
      // Trackear fallo
      await trackApiIntegration({
        agentId,
        module,
        apiProvider,
        apiService,
        apiEndpoint: `/${apiService}`,
        apiMethod: 'POST',
        operationType: `${operationType}_failed`,
        operationData,
        operationResult: { error: error instanceof Error ? error.message : 'Unknown error' },
        requestSuccess: false,
        responseTimeMs: responseTime,
        apiCost,
        humanTimeSaved: 0, // No se ahorró tiempo si falló
        tokensUsed: 0,
        revenueGenerated: 0
      });
      
      throw error;
    }
  }, [trackApiIntegration, getApiCostConfig, calculateApiCost]);

  /**
   * Trackea múltiples operaciones de API en batch
   */
  const trackApiBatchOperation = useCallback(async <T>(
    agentId: AgentId,
    module: ModuleId,
    apiProvider: ApiProvider,
    apiService: ApiService,
    operationType: string,
    operations: Array<{ data: any; operation: () => Promise<T> }>
  ): Promise<T[]> => {
    const results: T[] = [];
    const startTime = Date.now();
    
    for (let i = 0; i < operations.length; i++) {
      const { data, operation } = operations[i];
      
      try {
        const result = await trackApiOperation(
          agentId,
          module,
          apiProvider,
          apiService,
          `${operationType}_${i + 1}`,
          data,
          operation
        );
        results.push(result);
      } catch (error) {
        // Continuar con las siguientes operaciones
        console.error(`Error in batch operation ${i + 1}:`, error);
      }
    }
    
    const totalTime = Date.now() - startTime;
    
    // Trackear resumen del batch
    await trackApiIntegration({
      agentId,
      module,
      apiProvider,
      apiService,
      apiEndpoint: `/${apiService}/batch`,
      apiMethod: 'POST',
      operationType: `${operationType}_batch`,
      operationData: { batch_size: operations.length, operations },
      operationResult: { successful: results.length, failed: operations.length - results.length },
      requestSuccess: results.length > 0,
      responseTimeMs: totalTime,
      apiCost: operations.length * 0.1, // Costo estimado por operación en batch
      humanTimeSaved: operations.length * 0.5, // Tiempo ahorrado por operación
      tokensUsed: 0,
      revenueGenerated: 0
    });
    
    return results;
  }, [trackApiOperation, trackApiIntegration]);

  return {
    trackApiIntegration,
    trackApiOperation,
    trackApiBatchOperation,
    getApiCostConfig,
    calculateApiCost
  };
};

// Función simulada para guardar en base de datos
async function saveApiIntegrationUsage(data: any) {
  // En un entorno real, esto guardaría en la base de datos
  // TODO: log saving API integration usage
  return Promise.resolve();
} 