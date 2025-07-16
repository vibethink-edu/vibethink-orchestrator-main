/**
 * Capa de Abstracción para Proveedores de IA
 * Permite migración automática entre Knotie AI y alternativas
 */

export interface AIProviderConfig {
  provider: 'knotie' | 'openai' | 'anthropic' | 'gemini' | 'local';
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  fallbackProviders?: string[];
}

export interface AIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
  latency: number;
}

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unavailable';
    latency: number;
    error?: string;
  }>;
  generateText(request: AIRequest): Promise<AIResponse>;
  getModels(): Promise<string[]>;
  getPricing(): Promise<{
    inputCost: number;
    outputCost: number;
    currency: string;
  }>;
}

/**
 * Gestor de Proveedores de IA con Fallback Automático
 */
export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private currentProvider: string = 'knotie';
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private fallbackHistory: Array<{
    timestamp: Date;
    from: string;
    to: string;
    reason: string;
  }> = [];

  constructor(private config: AIProviderConfig) {
    this.startHealthMonitoring();
  }

  /**
   * Registra un proveedor de IA
   */
  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider);
  }

  /**
   * Obtiene el proveedor actual con fallback automático
   */
  async getCurrentProvider(): Promise<AIProvider> {
    const provider = this.providers.get(this.currentProvider);
    if (!provider) {
      throw new Error(`Provider ${this.currentProvider} not found`);
    }

    // Verificar disponibilidad del proveedor actual
    const health = await provider.healthCheck();
    if (health.status === 'unavailable') {
      await this.switchToFallbackProvider();
      return this.getCurrentProvider();
    }

    return provider;
  }

  /**
   * Cambia automáticamente a un proveedor de respaldo
   */
  private async switchToFallbackProvider(): Promise<void> {
    const fallbackProviders = this.config.fallbackProviders || [];
    
    for (const fallbackName of fallbackProviders) {
      const fallbackProvider = this.providers.get(fallbackName);
      if (!fallbackProvider) continue;

      const health = await fallbackProvider.healthCheck();
      if (health.status !== 'unavailable') {
        const previousProvider = this.currentProvider;
        this.currentProvider = fallbackName;
        
        this.fallbackHistory.push({
          timestamp: new Date(),
          from: previousProvider,
          to: fallbackName,
          reason: `Health check failed: ${health.error || 'Unknown error'}`
        });

        // TODO: log Switched from ${previousProvider} to ${fallbackName} due to health issues
        return;
      }
    }

    throw new Error('No available fallback providers');
  }

  /**
   * Genera texto usando el proveedor actual con fallback automático
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    try {
      const provider = await this.getCurrentProvider();
      return await provider.generateText(request);
    } catch (error) {
      // TODO: log Error with current provider en desarrollo
      // Intentar con proveedores de respaldo
      await this.switchToFallbackProvider();
      const fallbackProvider = await this.getCurrentProvider();
      return await fallbackProvider.generateText(request);
    }
  }

  /**
   * Monitoreo de salud de proveedores
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const provider = this.providers.get(this.currentProvider);
        if (!provider) return;

        const health = await provider.healthCheck();
        if (health.status === 'unavailable') {
          await this.switchToFallbackProvider();
        }
      } catch (error) {
        // TODO: log Health check failed: ${error}
      }
    }, 30000); // Cada 30 segundos
  }

  /**
   * Obtiene estadísticas de migración
   */
  getMigrationStats(): {
    totalMigrations: number;
    lastMigration?: Date;
    providerUptime: Record<string, number>;
  } {
    return {
      totalMigrations: this.fallbackHistory.length,
      lastMigration: this.fallbackHistory[this.fallbackHistory.length - 1]?.timestamp,
      providerUptime: this.calculateProviderUptime()
    };
  }

  private calculateProviderUptime(): Record<string, number> {
    // Implementar cálculo de uptime por proveedor
    return {};
  }

  /**
   * Limpia recursos
   */
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
} 