/**
 * Proveedor de IA para Knotie AI
 * Implementa la interfaz AIProvider para integración con el gestor
 */

import { AIProvider, AIRequest, AIResponse } from './AbstractAIProvider';

export class KnotieAIProvider implements AIProvider {
  public readonly name = 'knotie';
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.knotie.ai';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Verifica si el proveedor está disponible
   */
  async isAvailable(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status !== 'unavailable';
    } catch {
      return false;
    }
  }

  /**
   * Verificación de salud del servicio
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unavailable';
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          status: latency < 1000 ? 'healthy' : 'degraded',
          latency
        };
      } else {
        return {
          status: 'unavailable',
          latency,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        status: 'unavailable',
        latency,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Genera texto usando Knotie AI
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000,
          stream: request.stream || false
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Knotie AI error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        },
        model: data.model || request.model,
        provider: this.name,
        latency
      };
    } catch (error) {
      throw new Error(`Knotie AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtiene modelos disponibles
   */
  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.map((model: any) => model.id) || [];
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return [];
    }
  }

  /**
   * Obtiene información de precios
   */
  async getPricing(): Promise<{
    inputCost: number;
    outputCost: number;
    currency: string;
  }> {
    // Knotie AI pricing - ajustar según tarifas reales
    return {
      inputCost: 0.0001, // $0.0001 por token de entrada
      outputCost: 0.0002, // $0.0002 por token de salida
      currency: 'USD'
    };
  }

  /**
   * Despliega una aplicación rápidamente
   */
  async deployApp(config: {
    name: string;
    description: string;
    template: string;
    variables?: Record<string, any>;
  }): Promise<{
    appId: string;
    url: string;
    status: 'deploying' | 'ready' | 'failed';
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/apps/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config),
        signal: AbortSignal.timeout(60000) // 60 segundos para despliegue
      });

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        appId: data.app_id,
        url: data.url,
        status: data.status
      };
    } catch (error) {
      throw new Error(`App deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtiene estadísticas de uso
   */
  async getUsageStats(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    averageLatency: number;
    errorRate: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/usage/stats?timeframe=${timeframe}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch usage stats: ${response.status}`);
      }

      const data = await response.json();
      return {
        totalRequests: data.total_requests || 0,
        totalTokens: data.total_tokens || 0,
        totalCost: data.total_cost || 0,
        averageLatency: data.average_latency || 0,
        errorRate: data.error_rate || 0
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        averageLatency: 0,
        errorRate: 0
      };
    }
  }
} 