import { agnoUsageTracker } from './AgnoUsageTracker';

/**
 * Wrapper de Agno que integra automáticamente el tracking de uso
 * Reemplaza las estadísticas automáticas de OpenRouter
 */
export class AgnoWrapper {
  private static instance: AgnoWrapper;
  private agno: any; // Agno framework instance

  private constructor() {
    // Aquí se inicializaría Agno cuando esté disponible
    // this.agno = new Agno();
  }

  static getInstance(): AgnoWrapper {
    if (!AgnoWrapper.instance) {
      AgnoWrapper.instance = new AgnoWrapper();
    }
    return AgnoWrapper.instance;
  }

  /**
   * Crea un agente con tracking automático
   */
  async createAgent(params: {
    name: string;
    role: string;
    model: string;
    companyId: string;
    userId: string;
    instructions?: string;
  }): Promise<any> {
    const startTime = Date.now();

    try {
      // Crear agente con Agno
      // const agent = await this.agno.createAgent({
      //   name: params.name,
      //   role: params.role,
      //   model: params.model,
      //   instructions: params.instructions
      // });

      // Simular creación de agente para demo
      const agent = {
        name: params.name,
        role: params.role,
        model: params.model,
        invoke: async (input: any) => {
          const invokeStartTime = Date.now();
          
          // Simular procesamiento
          const result = await this.simulateAgentInvoke(input, params.model);
          
          const durationMs = Date.now() - invokeStartTime;
          
          // Trackear uso automáticamente
          await agnoUsageTracker.trackAgentUsage({
            companyId: params.companyId,
            userId: params.userId,
            agentName: params.name,
            model: params.model,
            inputTokens: result.inputTokens,
            outputTokens: result.outputTokens,
            operationType: 'agent_invoke',
            durationMs,
            metadata: {
              input_type: typeof input,
              input_size: JSON.stringify(input).length
            }
          });

          return result;
        }
      };

      return agent;
    } catch (error) {
      console.error('Error creating Agno agent:', error);
      throw error;
    }
  }

  /**
   * Crea un equipo con tracking automático
   */
  async createTeam(params: {
    name: string;
    members: Array<{
      name: string;
      role: string;
      model: string;
    }>;
    companyId: string;
    userId: string;
    mode?: 'sequential' | 'parallel' | 'coordinated';
  }): Promise<any> {
    const startTime = Date.now();

    try {
      // Crear agentes individuales
      const agents = await Promise.all(
        params.members.map(member =>
          this.createAgent({
            name: member.name,
            role: member.role,
            model: member.model,
            companyId: params.companyId,
            userId: params.userId
          })
        )
      );

      // Simular creación de equipo para demo
      const team = {
        name: params.name,
        members: agents,
        mode: params.mode || 'coordinated',
        invoke: async (input: any) => {
          const invokeStartTime = Date.now();
          const agentResults: Array<{
            name: string;
            model: string;
            inputTokens: number;
            outputTokens: number;
          }> = [];

          // Procesar con cada agente según el modo
          if (params.mode === 'sequential') {
            for (const agent of agents) {
              const result = await agent.invoke(input);
              agentResults.push({
                name: agent.name,
                model: agent.model,
                inputTokens: result.inputTokens,
                outputTokens: result.outputTokens
              });
            }
          } else {
            // Paralelo o coordinado
            const results = await Promise.all(
              agents.map(agent => agent.invoke(input))
            );
            
            results.forEach((result, index) => {
              agentResults.push({
                name: agents[index].name,
                model: agents[index].model,
                inputTokens: result.inputTokens,
                outputTokens: result.outputTokens
              });
            });
          }

          const totalDurationMs = Date.now() - invokeStartTime;

          // Trackear uso del equipo
          await agnoUsageTracker.trackTeamUsage({
            companyId: params.companyId,
            userId: params.userId,
            teamName: params.name,
            agents: agentResults,
            operationType: 'team_invoke',
            totalDurationMs,
            metadata: {
              mode: params.mode,
              input_type: typeof input,
              input_size: JSON.stringify(input).length
            }
          });

          return {
            content: `Team ${params.name} processed request with ${agentResults.length} agents`,
            agentResults,
            totalTokens: agentResults.reduce((sum, agent) => sum + agent.inputTokens + agent.outputTokens, 0)
          };
        }
      };

      return team;
    } catch (error) {
      console.error('Error creating Agno team:', error);
      throw error;
    }
  }

  /**
   * Simula la invocación de un agente para demo
   */
  private async simulateAgentInvoke(input: any, model: string): Promise<{
    content: string;
    inputTokens: number;
    outputTokens: number;
  }> {
    // Simular procesamiento basado en el modelo
    const inputText = typeof input === 'string' ? input : JSON.stringify(input);
    const inputTokens = Math.ceil(inputText.length / 4); // Estimación aproximada
    
    let outputTokens: number;
    let content: string;

    if (model.includes('gpt-4')) {
      outputTokens = Math.ceil(inputTokens * 0.8);
      content = `GPT-4 processed: ${inputText.substring(0, 100)}...`;
    } else if (model.includes('claude')) {
      outputTokens = Math.ceil(inputTokens * 0.7);
      content = `Claude processed: ${inputText.substring(0, 100)}...`;
    } else if (model.includes('gemini')) {
      outputTokens = Math.ceil(inputTokens * 0.6);
      content = `Gemini processed: ${inputText.substring(0, 100)}...`;
    } else {
      outputTokens = Math.ceil(inputTokens * 0.5);
      content = `Generic model processed: ${inputText.substring(0, 100)}...`;
    }

    // Simular latencia
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    return {
      content,
      inputTokens,
      outputTokens
    };
  }

  /**
   * Obtiene estadísticas de uso para una empresa
   */
  async getCompanyUsageStats(companyId: string, period: 'day' | 'week' | 'month' = 'month') {
    return await agnoUsageTracker.getCompanyUsageStats(companyId, period);
  }

  /**
   * Obtiene estadísticas de uso para un usuario
   */
  async getUserUsageStats(userId: string, companyId: string, period: 'day' | 'week' | 'month' = 'month') {
    return await agnoUsageTracker.getUserUsageStats(userId, companyId, period);
  }

  /**
   * Obtiene estadísticas en tiempo real
   */
  async getRealTimeStats(companyId: string): Promise<{
    activeAgents: number;
    activeTeams: number;
    currentRequests: number;
    averageResponseTime: number;
    costPerMinute: number;
  }> {
    // En una implementación real, esto vendría de Agno
    return {
      activeAgents: Math.floor(Math.random() * 10) + 1,
      activeTeams: Math.floor(Math.random() * 3) + 1,
      currentRequests: Math.floor(Math.random() * 50) + 5,
      averageResponseTime: Math.random() * 2000 + 500,
      costPerMinute: Math.random() * 0.5 + 0.1
    };
  }
}

// Exportar instancia singleton
export const agnoWrapper = AgnoWrapper.getInstance(); 