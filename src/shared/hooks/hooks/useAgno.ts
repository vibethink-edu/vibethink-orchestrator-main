import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para usar Agno con tracking automático
 * Reemplaza las estadísticas automáticas de OpenRouter
 */
export const useAgno = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crea un agente con tracking automático
   */
  const createAgent = useCallback(async (params: {
    name: string;
    role: string;
    model: string;
    instructions?: string;
  }) => {
    if (!user?.profile?.company_id) {
      throw new Error('User must be associated with a company');
    }

    setIsLoading(true);
    setError(null);

    try {
      // const agent = await agnoWrapper.createAgent({
      //   ...params,
      //   companyId: user.profile?.company_id,
      //   userId: user.id
      // });

      // return agent;
      throw new Error('Agno not integrated yet');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Crea un equipo con tracking automático
   */
  const createTeam = useCallback(async (params: {
    name: string;
    members: Array<{
      name: string;
      role: string;
      model: string;
    }>;
    mode?: 'sequential' | 'parallel' | 'coordinated';
  }) => {
    if (!user?.profile?.company_id) {
      throw new Error('User must be associated with a company');
    }

    setIsLoading(true);
    setError(null);

    try {
      // const team = await agnoWrapper.createTeam({
      //   ...params,
      //   companyId: user.profile?.company_id,
      //   userId: user.id
      // });

      // return team;
      throw new Error('Agno not integrated yet');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Obtiene estadísticas de uso de la empresa
   */
  const getCompanyUsageStats = useCallback(async (period: 'day' | 'week' | 'month' = 'month') => {
    if (!user?.profile?.company_id) {
      throw new Error('User must be associated with a company');
    }

    try {
      // return await agnoWrapper.getCompanyUsageStats(user.profile?.company_id, period);
      throw new Error('Agno not integrated yet');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Obtiene estadísticas de uso del usuario
   */
  const getUserUsageStats = useCallback(async (period: 'day' | 'week' | 'month' = 'month') => {
    if (!user?.profile?.company_id) {
      throw new Error('User must be associated with a company');
    }

    try {
      // return await agnoWrapper.getUserUsageStats(user.id, user.profile?.company_id, period);
      throw new Error('Agno not integrated yet');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Obtiene estadísticas en tiempo real
   */
  const getRealTimeStats = useCallback(async () => {
    if (!user?.profile?.company_id) {
      throw new Error('User must be associated with a company');
    }

    try {
      // return await agnoWrapper.getRealTimeStats(user.profile?.company_id);
      throw new Error('Agno not integrated yet');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  return {
    // Funciones principales
    createAgent,
    createTeam,
    
    // Estadísticas
    getCompanyUsageStats,
    getUserUsageStats,
    getRealTimeStats,
    
    // Estado
    isLoading,
    error,
    
    // Utilidades
    clearError: () => setError(null)
  };
};

/**
 * Hook especializado para agentes de atención al cliente
 */
export const useCustomerServiceAgents = () => {
  const { createAgent, createTeam, isLoading, error } = useAgno();

  /**
   * Crea un agente de recepción
   */
  const createReceptionAgent = useCallback(async (companyId: string, userId: string) => {
    return await createAgent({
      name: 'Reception Agent',
      role: 'Customer reception and initial classification',
      model: 'gpt-4o',
      instructions: `
        You are a professional customer reception agent. Your role is to:
        1. Greet customers warmly and professionally
        2. Understand their needs and classify their inquiry
        3. Route them to the appropriate department or agent
        4. Provide basic information when possible
        5. Maintain a helpful and professional tone
        
        Always ask clarifying questions when needed and ensure customer satisfaction.
      `
    });
  }, [createAgent]);

  /**
   * Crea un agente de soporte técnico
   */
  const createSupportAgent = useCallback(async (companyId: string, userId: string) => {
    return await createAgent({
      name: 'Support Agent',
      role: 'Technical support and problem resolution',
      model: 'claude-3-5-sonnet',
      instructions: `
        You are a technical support specialist. Your role is to:
        1. Diagnose technical issues accurately
        2. Provide step-by-step solutions
        3. Escalate complex issues when necessary
        4. Follow up on resolved issues
        5. Maintain detailed records of interactions
        
        Be patient, thorough, and ensure complete problem resolution.
      `
    });
  }, [createAgent]);

  /**
   * Crea un equipo de atención al cliente
   */
  const createCustomerServiceTeam = useCallback(async (companyId: string, userId: string) => {
    return await createTeam({
      name: 'Customer Service Team',
      members: [
        { name: 'Reception Agent', role: 'Initial contact and routing', model: 'gpt-4o' },
        { name: 'Support Agent', role: 'Technical support', model: 'claude-3-5-sonnet' },
        { name: 'Escalation Agent', role: 'Complex issue resolution', model: 'gpt-4o' }
      ],
      mode: 'coordinated'
    });
  }, [createTeam]);

  return {
    createReceptionAgent,
    createSupportAgent,
    createCustomerServiceTeam,
    isLoading,
    error
  };
};

/**
 * Hook especializado para agentes de marketing
 */
export const useMarketingAgents = () => {
  const { createAgent, createTeam, isLoading, error } = useAgno();

  /**
   * Crea un agente de análisis de mercado
   */
  const createMarketAnalysisAgent = useCallback(async (companyId: string, userId: string) => {
    return await createAgent({
      name: 'Market Analysis Agent',
      role: 'Market research and competitive analysis',
      model: 'gpt-4o',
      instructions: `
        You are a market analysis specialist. Your role is to:
        1. Analyze market trends and opportunities
        2. Research competitors and their strategies
        3. Identify target audience segments
        4. Provide data-driven insights
        5. Generate actionable recommendations
        
        Focus on providing valuable, actionable insights for marketing strategy.
      `
    });
  }, [createAgent]);

  /**
   * Crea un agente de contenido
   */
  const createContentAgent = useCallback(async (companyId: string, userId: string) => {
    return await createAgent({
      name: 'Content Agent',
      role: 'Content creation and optimization',
      model: 'claude-3-5-sonnet',
      instructions: `
        You are a content creation specialist. Your role is to:
        1. Create engaging marketing content
        2. Optimize content for SEO and engagement
        3. Adapt content for different platforms
        4. Maintain brand voice and consistency
        5. Analyze content performance
        
        Create compelling, brand-aligned content that drives engagement.
      `
    });
  }, [createAgent]);

  /**
   * Crea un equipo de marketing
   */
  const createMarketingTeam = useCallback(async (companyId: string, userId: string) => {
    return await createTeam({
      name: 'Marketing Team',
      members: [
        { name: 'Market Analysis Agent', role: 'Market research', model: 'gpt-4o' },
        { name: 'Content Agent', role: 'Content creation', model: 'claude-3-5-sonnet' },
        { name: 'Campaign Agent', role: 'Campaign strategy', model: 'gpt-4o' }
      ],
      mode: 'coordinated'
    });
  }, [createTeam]);

  return {
    createMarketAnalysisAgent,
    createContentAgent,
    createMarketingTeam,
    isLoading,
    error
  };
}; 