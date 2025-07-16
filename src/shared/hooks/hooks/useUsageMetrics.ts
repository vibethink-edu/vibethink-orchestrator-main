import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

// Tipos de métricas
interface UsageMetrics {
  // Métricas generales
  totalTasks: number;
  timeSaved: number;
  efficiencyGain: number;
  costSaved: number;
  humanReviews: number;
  documentsPublished: number;
  casesResolved: number;
  roiPercentage: number;
  
  // Crecimiento vs período anterior
  tasksGrowth: number;
  documentsGrowth: number;
  casesGrowth: number;
  roiGrowth: number;
  
  // Métricas por agente
  agents: {
    AG_LEGAL?: AgentMetrics;
    AG_CONT?: AgentMetrics;
    AG_VENT?: AgentMetrics;
    AG_DEV?: AgentMetrics;
    AG_MKT?: AgentMetrics;
    AG_HR?: AgentMetrics;
    AG_OPS?: AgentMetrics;
    AG_MGR?: AgentMetrics;
  };
  
  // Métricas por módulo
  moduleMetrics: {
    CRM?: ModuleMetrics;
    HD?: ModuleMetrics;
    PQRS?: ModuleMetrics;
    'PORTAL-GOV'?: ModuleMetrics;
    'PORTAL-EMP'?: ModuleMetrics;
    ATX?: ModuleMetrics;
    TTX?: ModuleMetrics;
    NTX?: ModuleMetrics;
    AGNO?: ModuleMetrics;
  };
  
  // Datos para gráficos
  productivityData: ProductivityData[];
  roiData: ROIData[];
  tokenData: TokenData;
  
  // Insights
  insights: {
    optimization: Insight[];
    trends: Insight[];
  };
}

interface AgentMetrics {
  tasks: number;
  timeSaved: number;
  roi: number;
  precision: number;
  documentsGenerated?: number;
  casesResolved?: number;
  leadsQualified?: number;
}

interface ModuleMetrics {
  tasks: number;
  timeSaved: number;
  roi: number;
  users: number;
  documentsGenerated?: number;
  ticketsResolved?: number;
  pqrsProcessed?: number;
  portalVisits?: number;
}

interface ProductivityData {
  period: string;
  aiTasks: number;
  humanTasks: number;
  timeSaved: number;
}

interface ROIData {
  module: string;
  roi: number;
  costSaved: number;
  aiCost: number;
}

interface TokenData {
  byTaskType: TokenUsageByType[];
  byModel: TokenUsageByModel[];
  totalTokens: number;
  totalCost: number;
}

interface TokenUsageByType {
  type: string;
  tokens: number;
  cost: number;
}

interface TokenUsageByModel {
  name: string;
  tokens: number;
  cost: number;
}

interface Insight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Hook para obtener métricas de usage desde PostHog
 * 
 * Procesa los datos de PostHog y los convierte en métricas útiles
 * para el dashboard de usage.
 */
export const useUsageMetrics = (companyId: string, dateRange: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['usage-metrics', companyId, dateRange],
    queryFn: () => fetchUsageMetrics(companyId, dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!companyId,
  });

  return {
    metrics: data,
    isLoading,
    error,
  };
};

/**
 * Función para obtener métricas de PostHog
 */
async function fetchUsageMetrics(companyId: string, dateRange: string): Promise<UsageMetrics> {
  // En un entorno real, esto haría llamadas a la API de PostHog
  // Por ahora, simulamos los datos
  
  const baseMetrics = {
    totalTasks: 156,
    timeSaved: 47.5,
    efficiencyGain: 89,
    costSaved: 2375,
    humanReviews: 3,
    documentsPublished: 23,
    casesResolved: 89,
    roiPercentage: 1247,
    tasksGrowth: 23,
    documentsGrowth: 15,
    casesGrowth: 34,
    roiGrowth: 89,
  };

  const agentMetrics = {
    AG_LEGAL: {
      tasks: 45,
      timeSaved: 67,
      roi: 340,
      precision: 96,
      documentsGenerated: 23,
    },
    AG_CONT: {
      tasks: 32,
      timeSaved: 89,
      roi: 280,
      precision: 94,
    },
    AG_VENT: {
      tasks: 67,
      timeSaved: 123,
      roi: 420,
      precision: 92,
      leadsQualified: 234,
    },
    AG_DEV: {
      tasks: 28,
      timeSaved: 45,
      roi: 310,
      precision: 95,
    },
    AG_MKT: {
      tasks: 34,
      timeSaved: 56,
      roi: 290,
      precision: 93,
    },
    AG_HR: {
      tasks: 19,
      timeSaved: 31,
      roi: 260,
      precision: 91,
      casesResolved: 45,
    },
    AG_OPS: {
      tasks: 41,
      timeSaved: 67,
      roi: 320,
      precision: 94,
    },
    AG_MGR: {
      tasks: 156,
      timeSaved: 47.5,
      roi: 1247,
      precision: 98,
    },
  };

  const moduleMetrics = {
    CRM: {
      tasks: 456,
      timeSaved: 156,
      roi: 380,
      users: 23,
    },
    HD: {
      tasks: 234,
      timeSaved: 89,
      roi: 320,
      users: 15,
      ticketsResolved: 234,
    },
    PQRS: {
      tasks: 156,
      timeSaved: 67,
      roi: 450,
      users: 8,
      pqrsProcessed: 156,
    },
    'PORTAL-GOV': {
      tasks: 89,
      timeSaved: 34,
      roi: 280,
      users: 12,
      portalVisits: 1234,
    },
    'PORTAL-EMP': {
      tasks: 123,
      timeSaved: 45,
      roi: 310,
      users: 18,
      portalVisits: 2345,
    },
    ATX: {
      tasks: 1234,
      timeSaved: 45,
      roi: 260,
      users: 45,
    },
    TTX: {
      tasks: 567,
      timeSaved: 78,
      roi: 310,
      users: 34,
    },
    NTX: {
      tasks: 2345,
      timeSaved: 23,
      roi: 180,
      users: 67,
    },
    AGNO: {
      tasks: 156,
      timeSaved: 47.5,
      roi: 1247,
      users: 89,
    },
  };

  const productivityData: ProductivityData[] = [
    { period: 'Lun', aiTasks: 45, humanTasks: 2, timeSaved: 12.5 },
    { period: 'Mar', aiTasks: 52, humanTasks: 1, timeSaved: 14.2 },
    { period: 'Mié', aiTasks: 38, humanTasks: 3, timeSaved: 10.8 },
    { period: 'Jue', aiTasks: 61, humanTasks: 2, timeSaved: 16.3 },
    { period: 'Vie', aiTasks: 43, humanTasks: 1, timeSaved: 11.7 },
    { period: 'Sáb', aiTasks: 28, humanTasks: 0, timeSaved: 8.9 },
    { period: 'Dom', aiTasks: 15, humanTasks: 0, timeSaved: 4.2 },
  ];

  const roiData: ROIData[] = [
    { module: 'CRM', roi: 380, costSaved: 7800, aiCost: 205 },
    { module: 'HD', roi: 320, costSaved: 4450, aiCost: 139 },
    { module: 'PQRS', roi: 450, costSaved: 3015, aiCost: 67 },
    { module: 'ATX', roi: 260, costSaved: 1170, aiCost: 45 },
    { module: 'TTX', roi: 310, costSaved: 2418, aiCost: 78 },
    { module: 'NTX', roi: 180, costSaved: 414, aiCost: 23 },
  ];

  const tokenData: TokenData = {
    byTaskType: [
      { type: 'Email Response', tokens: 2300000, cost: 230 },
      { type: 'Document Analysis', tokens: 4100000, cost: 410 },
      { type: 'Code Review', tokens: 1800000, cost: 180 },
      { type: 'Legal Analysis', tokens: 1200000, cost: 120 },
      { type: 'Financial Report', tokens: 900000, cost: 90 },
    ],
    byModel: [
      { name: 'GPT-4', tokens: 5200000, cost: 520 },
      { name: 'GPT-3.5', tokens: 2800000, cost: 280 },
      { name: 'Claude-3', tokens: 1200000, cost: 120 },
    ],
    totalTokens: 9200000,
    totalCost: 920,
  };

  const insights = {
    optimization: [
      {
        title: 'Optimizar AG_VENT para más leads',
        description: 'El agente de ventas puede procesar 40% más leads con la configuración actual',
        impact: 'high' as const,
      },
      {
        title: 'Reducir intervención humana en AG_LEGAL',
        description: 'Solo 4% de tareas requieren revisión, excelente automatización',
        impact: 'medium' as const,
      },
      {
        title: 'Mejorar precisión de AG_HR',
        description: 'La precisión del 91% puede mejorarse con más entrenamiento',
        impact: 'medium' as const,
      },
    ],
    trends: [
      {
        title: 'Crecimiento exponencial en PQRS',
        description: '34% más casos procesados este mes, excelente adopción',
        impact: 'high' as const,
      },
      {
        title: 'ROI estable en todos los módulos',
        description: 'ROI promedio de 380% mantiene tendencia positiva',
        impact: 'medium' as const,
      },
      {
        title: 'Reducción de costos de tokens',
        description: '15% menos tokens utilizados con optimización de prompts',
        impact: 'low' as const,
      },
    ],
  };

  return {
    ...baseMetrics,
    agents: agentMetrics,
    moduleMetrics,
    productivityData,
    roiData,
    tokenData,
    insights,
  };
} 