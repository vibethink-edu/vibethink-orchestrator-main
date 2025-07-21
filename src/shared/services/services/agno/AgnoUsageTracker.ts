import { supabase } from '@/integrations/supabase/client';

/**
 * Servicio de tracking de uso para Agno
 * Reemplaza las estadísticas automáticas de OpenRouter
 */
export class AgnoUsageTracker {
  private static instance: AgnoUsageTracker;
  private costRates: Map<string, { input: number; output: number }> = new Map();

  private constructor() {
    this.initializeCostRates();
  }

  static getInstance(): AgnoUsageTracker {
    if (!AgnoUsageTracker.instance) {
      AgnoUsageTracker.instance = new AgnoUsageTracker();
    }
    return AgnoUsageTracker.instance;
  }

  /**
   * Inicializa las tarifas de costo por modelo
   */
  private initializeCostRates(): void {
    // OpenAI Models
    this.costRates.set('gpt-4o', { input: 0.0025, output: 0.01 }); // $2.50/$10 per 1K tokens
    this.costRates.set('gpt-4o-mini', { input: 0.00015, output: 0.0006 }); // $0.15/$0.60 per 1K tokens
    this.costRates.set('gpt-4-turbo', { input: 0.01, output: 0.03 }); // $10/$30 per 1K tokens
    this.costRates.set('gpt-3.5-turbo', { input: 0.0005, output: 0.0015 }); // $0.50/$1.50 per 1K tokens
    
    // Anthropic Models
    this.costRates.set('claude-3-5-sonnet', { input: 0.003, output: 0.015 }); // $3/$15 per 1K tokens
    this.costRates.set('claude-3-5-haiku', { input: 0.00025, output: 0.00125 }); // $0.25/$1.25 per 1K tokens
    this.costRates.set('claude-3-opus', { input: 0.015, output: 0.075 }); // $15/$75 per 1K tokens
    
    // Google Models
    this.costRates.set('gemini-pro', { input: 0.0005, output: 0.0015 }); // $0.50/$1.50 per 1K tokens
    this.costRates.set('gemini-flash', { input: 0.000075, output: 0.0003 }); // $0.075/$0.30 per 1K tokens
    
    // Cohere Models
    this.costRates.set('command', { input: 0.0015, output: 0.006 }); // $1.50/$6 per 1K tokens
    this.costRates.set('command-light', { input: 0.0003, output: 0.0012 }); // $0.30/$1.20 per 1K tokens
  }

  /**
   * Trackea el uso de un agente de Agno
   */
  async trackAgentUsage(params: {
    companyId: string;
    userId: string;
    agentName: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    operationType: string;
    durationMs: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { 
      companyId, 
      userId, 
      agentName, 
      model, 
      inputTokens, 
      outputTokens, 
      operationType, 
      durationMs, 
      metadata = {} 
    } = params;

    // Calcular costo
    const cost = this.calculateCost(model, inputTokens, outputTokens);

    // Determinar provider basado en el modelo
    const provider = this.getProviderFromModel(model);

    try {
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert({
          company_id: companyId,
          user_id: userId,
          operation_type: operationType,
          service_provider: provider,
          model_used: model,
          tokens_used: inputTokens + outputTokens,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cost_estimate: cost,
          processing_duration_ms: durationMs,
          metadata: {
            ...metadata,
            agent_name: agentName,
            agno_framework: true
          }
        });

      if (error) {
        // TODO: log 'Error tracking Agno usage:' error
        // No lanzar error para no interrumpir el flujo principal
      }
    } catch (error) {
      // TODO: log 'Exception tracking Agno usage:' error
    }
  }

  /**
   * Trackea el uso de un equipo de Agno
   */
  async trackTeamUsage(params: {
    companyId: string;
    userId: string;
    teamName: string;
    agents: Array<{
      name: string;
      model: string;
      inputTokens: number;
      outputTokens: number;
    }>;
    operationType: string;
    totalDurationMs: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { 
      companyId, 
      userId, 
      teamName, 
      agents, 
      operationType, 
      totalDurationMs, 
      metadata = {} 
    } = params;

    // Trackear cada agente individualmente
    for (const agent of agents) {
      await this.trackAgentUsage({
        companyId,
        userId,
        agentName: agent.name,
        model: agent.model,
        inputTokens: agent.inputTokens,
        outputTokens: agent.outputTokens,
        operationType: `${operationType}_team_${teamName}`,
        durationMs: Math.floor(totalDurationMs / agents.length), // Distribuir tiempo
        metadata: {
          ...metadata,
          team_name: teamName,
          agent_role: agent.name
        }
      });
    }

    // Trackear uso total del equipo
    const totalInputTokens = agents.reduce((sum, agent) => sum + agent.inputTokens, 0);
    const totalOutputTokens = agents.reduce((sum, agent) => sum + agent.outputTokens, 0);
    const totalCost = agents.reduce((sum, agent) => {
      return sum + this.calculateCost(agent.model, agent.inputTokens, agent.outputTokens);
    }, 0);

    try {
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert({
          company_id: companyId,
          user_id: userId,
          operation_type: `${operationType}_team_total`,
          service_provider: 'agno_team',
          model_used: 'multi_agent',
          tokens_used: totalInputTokens + totalOutputTokens,
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          cost_estimate: totalCost,
          processing_duration_ms: totalDurationMs,
          metadata: {
            ...metadata,
            team_name: teamName,
            agent_count: agents.length,
            agno_framework: true,
            team_operation: true
          }
        });

      if (error) {
        // TODO: log 'Error tracking Agno team usage:' error
      }
    } catch (error) {
      // TODO: log 'Exception tracking Agno team usage:' error
    }
  }

  /**
   * Calcula el costo basado en el modelo y tokens
   */
  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const rates = this.costRates.get(model);
    if (!rates) {
      // Tarifa por defecto si no se encuentra el modelo
      return (inputTokens * 0.001 + outputTokens * 0.002) / 1000;
    }

    const inputCost = (inputTokens * rates.input) / 1000;
    const outputCost = (outputTokens * rates.output) / 1000;
    
    return inputCost + outputCost;
  }

  /**
   * Determina el provider basado en el nombre del modelo
   */
  private getProviderFromModel(model: string): string {
    if (model.startsWith('gpt-')) return 'openai';
    if (model.startsWith('claude-')) return 'anthropic';
    if (model.startsWith('gemini-')) return 'google';
    if (model.startsWith('command')) return 'cohere';
    if (model.startsWith('llama-')) return 'meta';
    if (model.startsWith('mistral-')) return 'mistral';
    
    return 'unknown';
  }

  /**
   * Obtiene estadísticas de uso para una empresa
   */
  async getCompanyUsageStats(companyId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<{
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    averageResponseTime: number;
    topModels: Array<{ model: string; requests: number; cost: number }>;
    usageByOperation: Record<string, number>;
  }> {
    const startDate = this.getStartDate(period);

    const { data: logs, error } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .eq('company_id', companyId)
      .gte('created_at', startDate)
      .eq('status', 'completed');

    if (error || !logs) {
      // TODO: log 'Error fetching usage stats:' error
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        averageResponseTime: 0,
        topModels: [],
        usageByOperation: {}
      };
    }

    // Calcular estadísticas
    const totalRequests = logs.length;
    const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
    const totalCost = logs.reduce((sum, log) => sum + (log.cost_estimate || 0), 0);
    const averageResponseTime = logs.reduce((sum, log) => sum + (log.processing_duration_ms || 0), 0) / totalRequests;

    // Top modelos
    const modelStats = logs.reduce((acc, log) => {
      const model = log.model_used || 'unknown';
      if (!acc[model]) {
        acc[model] = { requests: 0, cost: 0 };
      }
      acc[model].requests++;
      acc[model].cost += log.cost_estimate || 0;
      return acc;
    }, {} as Record<string, { requests: number; cost: number }>);

    const topModels = Object.entries(modelStats)
      .map(([model, stats]) => ({ model, ...stats }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);

    // Uso por operación
    const usageByOperation = logs.reduce((acc, log) => {
      const operation = log.operation_type || 'unknown';
      acc[operation] = (acc[operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests,
      totalTokens,
      totalCost,
      averageResponseTime,
      topModels,
      usageByOperation
    };
  }

  /**
   * Obtiene estadísticas de uso para un usuario específico
   */
  async getUserUsageStats(userId: string, companyId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<{
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    averageResponseTime: number;
    favoriteModels: Array<{ model: string; requests: number }>;
  }> {
    const startDate = this.getStartDate(period);

    const { data: logs, error } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .gte('created_at', startDate)
      .eq('status', 'completed');

    if (error || !logs) {
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        averageResponseTime: 0,
        favoriteModels: []
      };
    }

    const totalRequests = logs.length;
    const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
    const totalCost = logs.reduce((sum, log) => sum + (log.cost_estimate || 0), 0);
    const averageResponseTime = logs.reduce((sum, log) => sum + (log.processing_duration_ms || 0), 0) / totalRequests;

    // Modelos favoritos
    const modelStats = logs.reduce((acc, log) => {
      const model = log.model_used || 'unknown';
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteModels = Object.entries(modelStats)
      .map(([model, requests]) => ({ model, requests }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 3);

    return {
      totalRequests,
      totalTokens,
      totalCost,
      averageResponseTime,
      favoriteModels
    };
  }

  /**
   * Obtiene la fecha de inicio para el período especificado
   */
  private getStartDate(period: 'day' | 'week' | 'month'): string {
    const now = new Date();
    
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }
  }
}

// Exportar instancia singleton
export const agnoUsageTracker = AgnoUsageTracker.getInstance(); 