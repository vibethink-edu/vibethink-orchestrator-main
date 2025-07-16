/**
 * Hook para Integración con Knotie-AI
 * 
 * Hook personalizado para gestionar la integración con Knotie-AI
 * Proporciona métodos para agentes, snippets y orquestación
 * 
 * @author AI Pair Platform - Knotie Integration Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { KnotieOrchestrationService } from '../services/knotie/KnotieOrchestrationService';
import type {
  KnotieAgent,
  KnotieSnippet,
  ConversationContext,
  ConversationResponse,
  OrchestrationConfig
} from '../services/knotie/KnotieOrchestrationService';

export interface UseKnotieIntegrationReturn {
  // Estado
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  
  // Agentes
  agents: KnotieAgent[];
  selectedAgent: KnotieAgent | null;
  createAgent: (agentData: Omit<KnotieAgent, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>) => Promise<KnotieAgent>;
  updateAgent: (agentId: string, updates: Partial<KnotieAgent>) => Promise<KnotieAgent>;
  deleteAgent: (agentId: string) => Promise<void>;
  selectAgent: (agent: KnotieAgent | null) => void;
  
  // Snippets
  snippets: KnotieSnippet[];
  selectedSnippet: KnotieSnippet | null;
  createSnippet: (snippetData: Omit<KnotieSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usage' | 'metadata'>) => Promise<KnotieSnippet>;
  updateSnippet: (snippetId: string, updates: Partial<KnotieSnippet>) => Promise<KnotieSnippet>;
  deleteSnippet: (snippetId: string) => Promise<void>;
  selectSnippet: (snippet: KnotieSnippet | null) => void;
  
  // Conversaciones
  processConversation: (agentId: string, message: string, context: ConversationContext) => Promise<ConversationResponse>;
  
  // Métricas y Estado
  metrics: {
    totalAgents: number;
    activeAgents: number;
    totalConversations: number;
    avgResponseTime: number;
    satisfactionScore: number;
    revenueGenerated: number;
  };
  refreshData: () => Promise<void>;
  healthCheck: () => Promise<{ status: string; latency: number }>;
}

export const useKnotieIntegration = (): UseKnotieIntegrationReturn => {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [agents, setAgents] = useState<KnotieAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<KnotieAgent | null>(null);
  
  const [snippets, setSnippets] = useState<KnotieSnippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<KnotieSnippet | null>(null);
  
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalConversations: 0,
    avgResponseTime: 0,
    satisfactionScore: 0,
    revenueGenerated: 0
  });

  // Configuración del servicio
  const service = useMemo(() => {
    if (!user?.company_id) return null;
    
    const config: OrchestrationConfig = {
      apiKey: process.env.REACT_APP_KNOTIE_API_KEY || '',
      baseUrl: process.env.REACT_APP_KNOTIE_BASE_URL || 'https://api.knotie.ai',
      companyId: user.company_id,
      timeout: 30000,
      retryAttempts: 3
    };
    
    return new KnotieOrchestrationService(config);
  }, [user?.company_id]);

  // Verificar conectividad inicial
  useEffect(() => {
    if (service && hasPermission('ADMIN')) {
      checkConnection();
    }
  }, [service, hasPermission]);

  // Cargar datos iniciales
  useEffect(() => {
    if (service && isConnected && hasPermission('ADMIN')) {
      loadInitialData();
    }
  }, [service, isConnected, hasPermission]);

  const checkConnection = useCallback(async () => {
    if (!service) return;
    
    try {
      const health = await service.healthCheck();
      setIsConnected(health.status === 'healthy');
      setError(health.status === 'unavailable' ? 'No se pudo conectar con Knotie-AI' : null);
    } catch (err) {
      setIsConnected(false);
      setError('Error de conexión con Knotie-AI');
    }
  }, [service]);

  const loadInitialData = useCallback(async () => {
    if (!service) return;
    
    setIsLoading(true);
    try {
      const [agentsData, snippetsData, metricsData] = await Promise.all([
        service.getAgents(),
        service.getSnippets(),
        service.getMetrics()
      ]);
      
      setAgents(agentsData);
      setSnippets(snippetsData);
      
      // Actualizar métricas
      setMetrics({
        totalAgents: agentsData.length,
        activeAgents: agentsData.filter(agent => agent.status === 'active').length,
        totalConversations: metricsData.overall.totalConversations,
        avgResponseTime: metricsData.overall.avgResponseTime,
        satisfactionScore: metricsData.overall.satisfactionScore,
        revenueGenerated: metricsData.overall.revenueGenerated
      });
      
    } catch (err) {
      setError('Error al cargar datos de Knotie-AI');
      toast({
        title: "Error de carga",
        description: "No se pudieron cargar los datos de Knotie-AI",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [service, toast]);

  // Métodos para agentes
  const createAgent = useCallback(async (agentData: Omit<KnotieAgent, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>) => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      const newAgent = await service.createAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      
      toast({
        title: "Agente creado",
        description: `El agente "${newAgent.name}" ha sido creado exitosamente`
      });
      
      return newAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error al crear agente",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, toast]);

  const updateAgent = useCallback(async (agentId: string, updates: Partial<KnotieAgent>) => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      const updatedAgent = await service.updateAgent(agentId, updates);
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? updatedAgent : agent
      ));
      
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(updatedAgent);
      }
      
      toast({
        title: "Agente actualizado",
        description: `El agente "${updatedAgent.name}" ha sido actualizado`
      });
      
      return updatedAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error al actualizar agente",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, selectedAgent, toast]);

  const deleteAgent = useCallback(async (agentId: string) => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      await service.deleteAgent(agentId);
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null);
      }
      
      toast({
        title: "Agente eliminado",
        description: "El agente ha sido eliminado exitosamente"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error al eliminar agente",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, selectedAgent, toast]);

  const selectAgent = useCallback((agent: KnotieAgent | null) => {
    setSelectedAgent(agent);
  }, []);

  // Métodos para snippets
  const createSnippet = useCallback(async (snippetData: Omit<KnotieSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usage' | 'metadata'>) => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      const newSnippet = await service.createSnippet(snippetData);
      setSnippets(prev => [...prev, newSnippet]);
      
      toast({
        title: "Snippet creado",
        description: `El snippet "${newSnippet.title}" ha sido creado exitosamente`
      });
      
      return newSnippet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error al crear snippet",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, toast]);

  const updateSnippet = useCallback(async (snippetId: string, updates: Partial<KnotieSnippet>) => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      // TODO: Implementar actualización de snippet en el servicio
      const updatedSnippet = { ...snippets.find(s => s.id === snippetId), ...updates } as KnotieSnippet;
      setSnippets(prev => prev.map(snippet => 
        snippet.id === snippetId ? updatedSnippet : snippet
      ));
      
      if (selectedSnippet?.id === snippetId) {
        setSelectedSnippet(updatedSnippet);
      }
      
      toast({
        title: "Snippet actualizado",
        description: `El snippet "${updatedSnippet.title}" ha sido actualizado`
      });
      
      return updatedSnippet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error al actualizar snippet",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, snippets, selectedSnippet, toast]);

  const deleteSnippet = useCallback(async (snippetId: string) => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      // TODO: Implementar eliminación de snippet en el servicio
      setSnippets(prev => prev.filter(snippet => snippet.id !== snippetId));
      
      if (selectedSnippet?.id === snippetId) {
        setSelectedSnippet(null);
      }
      
      toast({
        title: "Snippet eliminado",
        description: "El snippet ha sido eliminado exitosamente"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error al eliminar snippet",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, selectedSnippet, toast]);

  const selectSnippet = useCallback((snippet: KnotieSnippet | null) => {
    setSelectedSnippet(snippet);
  }, []);

  // Método para procesar conversaciones
  const processConversation = useCallback(async (
    agentId: string, 
    message: string, 
    context: ConversationContext
  ): Promise<ConversationResponse> => {
    if (!service) throw new Error('Servicio no disponible');
    
    try {
      const response = await service.processConversation(agentId, message, context);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: "Error en conversación",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [service, toast]);

  // Métodos de utilidad
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const healthCheck = useCallback(async () => {
    if (!service) return { status: 'unavailable', latency: 0 };
    
    try {
      const health = await service.healthCheck();
      return { status: health.status, latency: health.latency };
    } catch (err) {
      return { status: 'unavailable', latency: 0 };
    }
  }, [service]);

  return {
    // Estado
    isLoading,
    isConnected,
    error,
    
    // Agentes
    agents,
    selectedAgent,
    createAgent,
    updateAgent,
    deleteAgent,
    selectAgent,
    
    // Snippets
    snippets,
    selectedSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    selectSnippet,
    
    // Conversaciones
    processConversation,
    
    // Métricas y Estado
    metrics,
    refreshData,
    healthCheck
  };
}; 