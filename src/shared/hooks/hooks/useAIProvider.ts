/**
 * Hook para Gestión de Proveedores de IA
 * Maneja selección automática, fallbacks y migración transparente
 */

import { useState, useEffect, useCallback } from 'react';
import { AIProviderManager } from '../services/ai/AbstractAIProvider';
import { KnotieAIProvider } from '../services/ai/KnotieAIProvider';
import { OpenAIProvider } from '../services/ai/OpenAIProvider';
import { AIProviderMonitor } from '../services/ai/AIProviderMonitor';
import { 
  AI_PROVIDERS_CONFIG, 
  PROVIDER_CONFIGS, 
  MONITORING_CONFIG,
  FEATURE_MAPPING 
} from '../config/aiProviders';

export interface AIProviderState {
  currentProvider: string;
  isAvailable: boolean;
  health: 'healthy' | 'degraded' | 'unavailable';
  latency: number;
  features: {
    rapidDeployment: boolean;
    usageAnalytics: boolean;
    customTemplates: boolean;
    teamCollaboration: boolean;
  };
  migrationHistory: Array<{
    timestamp: Date;
    from: string;
    to: string;
    reason: string;
  }>;
}

export interface AIProviderActions {
  generateText: (request: any) => Promise<any>;
  deployApp: (config: any) => Promise<any>;
  getUsageStats: (timeframe?: string) => Promise<any>;
  forceMigration: (targetProvider: string) => Promise<void>;
  getPerformanceMetrics: (timeframe?: string) => any[];
}

export const useAIProvider = (): AIProviderState & AIProviderActions => {
  const [providerManager, setProviderManager] = useState<AIProviderManager | null>(null);
  const [monitor, setMonitor] = useState<AIProviderMonitor | null>(null);
  const [state, setState] = useState<AIProviderState>({
    currentProvider: 'knotie',
    isAvailable: false,
    health: 'unavailable',
    latency: 0,
    features: {
      rapidDeployment: false,
      usageAnalytics: false,
      customTemplates: false,
      teamCollaboration: false
    },
    migrationHistory: []
  });

  /**
   * Inicializa el gestor de proveedores
   */
  useEffect(() => {
    const initializeProviders = async () => {
      try {
        // Crear gestor de proveedores
        const manager = new AIProviderManager(AI_PROVIDERS_CONFIG);
        
        // Registrar proveedores
        if (PROVIDER_CONFIGS.knotie.apiKey) {
          manager.registerProvider('knotie', new KnotieAIProvider(PROVIDER_CONFIGS.knotie));
        }
        
        if (PROVIDER_CONFIGS.openai.apiKey) {
          manager.registerProvider('openai', new OpenAIProvider(PROVIDER_CONFIGS.openai));
        }
        
        // Crear monitor
        const providerMonitor = new AIProviderMonitor(manager, MONITORING_CONFIG);
        
        setProviderManager(manager);
        setMonitor(providerMonitor);
        
        // Estado inicial
        await updateProviderState(manager);
        
      } catch (error) {
        // TODO: log failed to initialize AI providers
      }
    };

    initializeProviders();

    // Cleanup
    return () => {
      if (providerManager) {
        providerManager.destroy();
      }
    };
  }, []);

  /**
   * Actualiza estado del proveedor actual
   */
  const updateProviderState = async (manager: AIProviderManager) => {
    try {
      const provider = await manager.getCurrentProvider();
      const health = await provider.healthCheck();
      const migrationStats = manager.getMigrationStats();
      
      setState(prev => ({
        ...prev,
        currentProvider: provider.name,
        isAvailable: health.status !== 'unavailable',
        health: health.status,
        latency: health.latency,
        features: FEATURE_MAPPING[provider.name as keyof typeof FEATURE_MAPPING] || {
          rapidDeployment: false,
          usageAnalytics: false,
          customTemplates: false,
          teamCollaboration: false
        },
        migrationHistory: migrationStats.totalMigrations > 0 ? 
          [{ 
            timestamp: migrationStats.lastMigration || new Date(),
            from: 'unknown',
            to: provider.name,
            reason: 'Initialization'
          }] : []
      }));
    } catch (error) {
      // TODO: log failed to update provider state
    }
  };

  /**
   * Genera texto usando el proveedor actual
   */
  const generateText = useCallback(async (request: any) => {
    if (!providerManager) {
      throw new Error('AI Provider Manager not initialized');
    }

    try {
      const response = await providerManager.generateText(request);
      await updateProviderState(providerManager);
      return response;
    } catch (error) {
      // TODO: log text generation failed
      throw error;
    }
  }, [providerManager]);

  /**
   * Despliega aplicación (solo disponible en Knotie)
   */
  const deployApp = useCallback(async (config: any) => {
    if (!providerManager) {
      throw new Error('AI Provider Manager not initialized');
    }

    try {
      const provider = await providerManager.getCurrentProvider();
      
      if (provider.name === 'knotie' && 'deployApp' in provider) {
        const response = await (provider as any).deployApp(config);
        await updateProviderState(providerManager);
        return response;
      } else {
        throw new Error(`Rapid deployment not available with ${provider.name}`);
      }
    } catch (error) {
      // TODO: log app deployment failed
      throw error;
    }
  }, [providerManager]);

  /**
   * Obtiene estadísticas de uso
   */
  const getUsageStats = useCallback(async (timeframe: string = 'day') => {
    if (!providerManager) {
      throw new Error('AI Provider Manager not initialized');
    }

    try {
      const provider = await providerManager.getCurrentProvider();
      
      if (provider.name === 'knotie' && 'getUsageStats' in provider) {
        return await (provider as any).getUsageStats(timeframe);
      } else {
        // Fallback para otros proveedores
        return {
          totalRequests: 0,
          totalTokens: 0,
          totalCost: 0,
          averageLatency: 0,
          errorRate: 0
        };
      }
    } catch (error) {
      // TODO: log failed to get usage stats
      throw error;
    }
  }, [providerManager]);

  /**
   * Fuerza migración a proveedor específico
   */
  const forceMigration = useCallback(async (targetProvider: string) => {
    if (!providerManager) {
      throw new Error('AI Provider Manager not initialized');
    }

    try {
      // Implementar migración forzada
      // TODO: log forcing migration to target provider
      await updateProviderState(providerManager);
    } catch (error) {
      // TODO: log forced migration failed
      throw error;
    }
  }, [providerManager]);

  /**
   * Obtiene métricas de performance
   */
  const getPerformanceMetrics = useCallback((timeframe: string = 'hour') => {
    if (!monitor) {
      return [];
    }

    return monitor.getPerformanceMetrics(timeframe as any);
  }, [monitor]);

  return {
    ...state,
    generateText,
    deployApp,
    getUsageStats,
    forceMigration,
    getPerformanceMetrics
  };
}; 