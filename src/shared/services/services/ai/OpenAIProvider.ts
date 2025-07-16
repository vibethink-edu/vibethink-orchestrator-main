/**
 * Proveedor de IA para OpenAI (Respaldo)
 * Implementa la interfaz AIProvider para migración automática
 */

import { AIProvider, AIRequest, AIResponse } from './AbstractAIProvider';

export class OpenAIProvider implements AIProvider {
  public readonly name = 'openai';
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.openai.com';
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
      const response = await fetch(`${this.baseUrl}/v1/models`, {
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
   * Genera texto usando OpenAI
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
        throw new Error(`OpenAI error: ${response.status} ${response.statusText}`);
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
      throw new Error(`OpenAI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    // OpenAI pricing - ajustar según tarifas reales
    return {
      inputCost: 0.0003, // $0.0003 por token de entrada
      outputCost: 0.0004, // $0.0004 por token de salida
      currency: 'USD'
    };
  }
} 