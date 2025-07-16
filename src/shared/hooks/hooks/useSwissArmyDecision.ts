import { useState, useCallback } from 'react';

// 🎯 Framework "Navaja Suiza" - Hook de Decisión Inteligente

export interface UseCase {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  performanceRequirement: number; // ms
  complexity: number; // 1-10
  businessImpact: number; // 1-10
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SwissArmyTool {
  name: string;
  category: string;
  useCases: string[];
  performance: string;
  bundleSize: string;
  complexity: number; // 1-10
  teamFamiliarity: number; // 1-10
}

export interface ToolDecision {
  id: string;
  useCase: UseCase;
  swissArmyAttempt?: {
    tool: string;
    implementationTime: number; // horas
    result: 'success' | 'partial' | 'failure';
    performance: number; // ms
    userFeedback: string;
    issues: string[];
  };
  specializedTool?: {
    tool: string;
    justification: string[];
    implementationCost: number; // días
    maintenanceCost: number; // horas/mes
    performanceGain: number; // %
    risks: string[];
  };
  decision: 'swiss-army' | 'specialized' | 'hybrid' | 'pending';
  date: Date;
  reviewer: string;
  nextReview: Date;
  notes: string;
}

// 🔧 La Navaja Suiza - Stack Base
export const SWISS_ARMY_KNIFE: Record<string, SwissArmyTool> = {
  recharts: {
    name: 'Recharts',
    category: 'charts',
    useCases: ['gráficos de línea', 'barras', 'pastel', 'área', 'scatter', 'combo'],
    performance: '< 100ms',
    bundleSize: '45KB',
    complexity: 3,
    teamFamiliarity: 8
  },
  tanstackTable: {
    name: 'TanStack Table',
    category: 'tables',
    useCases: ['tablas paginadas', 'ordenamiento', 'filtros', 'selección', 'agrupación'],
    performance: '< 200ms',
    bundleSize: '15KB',
    complexity: 4,
    teamFamiliarity: 7
  },
  reactHookForm: {
    name: 'React Hook Form + Zod',
    category: 'forms',
    useCases: ['validación', 'campos dinámicos', 'subida archivos', 'wizard forms'],
    performance: '< 50ms',
    bundleSize: '25KB',
    complexity: 3,
    teamFamiliarity: 8
  },
  assistantUI: {
    name: 'Assistant UI',
    category: 'chat',
    useCases: ['conversaciones', 'streaming', 'archivos adjuntos', 'markdown'],
    performance: '< 300ms',
    bundleSize: '60KB',
    complexity: 5,
    teamFamiliarity: 6
  },
  shadcnUI: {
    name: 'shadcn/ui',
    category: 'ui',
    useCases: ['botones', 'modales', 'navegación', 'inputs', 'dropdowns'],
    performance: '< 50ms',
    bundleSize: '30KB',
    complexity: 2,
    teamFamiliarity: 9
  }
};

// 🎯 Criterios para Herramientas Especializadas
export const SPECIALIZED_CRITERIA = {
  performance: {
    threshold: 2000, // ms
    metric: 'Time to Interactive (TTI)'
  },
  complexity: {
    threshold: 8, // 1-10 scale
    description: 'Complejidad técnica del caso de uso'
  },
  businessImpact: {
    threshold: 8, // 1-10 scale
    description: 'Impacto en el negocio'
  },
  functionality: {
    description: 'Funcionalidad no disponible en navaja suiza',
    examples: ['gráficos 3D', 'real-time streaming masivo', 'edición de código']
  }
};

export const useSwissArmyDecision = () => {
  const [decisions, setDecisions] = useState<ToolDecision[]>([]);
  const [metrics, setMetrics] = useState({
    swissArmySuccessRate: 0,
    averageImplementationTime: 0,
    specializedToolUsage: 0
  });

  // 🔍 Evaluar si la navaja suiza puede manejar el caso de uso
  const evaluateSwissArmy = useCallback((useCase: UseCase) => {
    const matchingTools: SwissArmyTool[] = [];
    
    // Buscar herramientas que coincidan con los requerimientos
    Object.values(SWISS_ARMY_KNIFE).forEach(tool => {
      const matchingUseCases = tool.useCases.filter(uc => 
        useCase.requirements.some(req => 
          req.toLowerCase().includes(uc.toLowerCase()) ||
          uc.toLowerCase().includes(req.toLowerCase())
        )
      );
      
      if (matchingUseCases.length > 0) {
        matchingTools.push({
          ...tool,
          matchingUseCases
        });
      }
    });

    // Calcular score de compatibilidad
    const compatibilityScore = matchingTools.length > 0 ? 
      matchingTools.reduce((score, tool) => {
        return score + (tool.teamFamiliarity * 0.4) + 
               ((11 - tool.complexity) * 0.3) + 
               (matchingTools.length * 0.3);
      }, 0) / matchingTools.length : 0;

    return {
      canHandle: matchingTools.length > 0,
      recommendedTools: matchingTools,
      compatibilityScore,
      effort: compatibilityScore > 7 ? 'low' : compatibilityScore > 5 ? 'medium' : 'high',
      performance: matchingTools.length > 0 ? 'optimized' : 'unknown'
    };
  }, []);

  // 🎯 Decidir si usar herramienta especializada
  const shouldUseSpecialized = useCallback((useCase: UseCase, swissResult: any) => {
    const criteria = [
      !swissResult.canHandle,
      useCase.performanceRequirement > SPECIALIZED_CRITERIA.performance.threshold,
      useCase.complexity > SPECIALIZED_CRITERIA.complexity.threshold,
      useCase.businessImpact > SPECIALIZED_CRITERIA.businessImpact.threshold,
      useCase.priority === 'critical'
    ];
    
    const score = criteria.filter(Boolean).length;
    
    return {
      shouldUse: score >= 2,
      score,
      reasons: criteria.map((met, index) => ({
        criterion: [
          'Navaja suiza no puede manejar',
          'Performance crítica',
          'Complejidad alta',
          'Impacto de negocio alto',
          'Prioridad crítica'
        ][index],
        met
      })).filter(r => r.met)
    };
  }, []);

  // 📝 Crear decisión documentada
  const createDecision = useCallback((useCase: UseCase, swissResult: any, specializedResult: any) => {
    const decision: ToolDecision = {
      id: `DEC-${Date.now()}`,
      useCase,
      decision: specializedResult.shouldUse ? 'specialized' : 'swiss-army',
      date: new Date(),
      reviewer: 'System',
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
      notes: `Evaluación automática: ${specializedResult.shouldUse ? 
        `Herramienta especializada recomendada (score: ${specializedResult.score})` : 
        `Navaja suiza recomendada (compatibility: ${swissResult.compatibilityScore.toFixed(1)})`}`
    };

    if (!specializedResult.shouldUse && swissResult.canHandle) {
      decision.swissArmyAttempt = {
        tool: swissResult.recommendedTools[0]?.name || 'Unknown',
        implementationTime: swissResult.effort === 'low' ? 4 : swissResult.effort === 'medium' ? 8 : 16,
        result: 'pending',
        performance: 0,
        userFeedback: '',
        issues: []
      };
    }

    setDecisions(prev => [...prev, decision]);
    return decision;
  }, []);

  // 📊 Calcular métricas
  const calculateMetrics = useCallback(() => {
    const totalDecisions = decisions.length;
    if (totalDecisions === 0) return;

    const swissArmyDecisions = decisions.filter(d => d.decision === 'swiss-army');
    const specializedDecisions = decisions.filter(d => d.decision === 'specialized');
    
    const successRate = swissArmyDecisions.filter(d => 
      d.swissArmyAttempt?.result === 'success'
    ).length / swissArmyDecisions.length * 100;

    const avgTime = swissArmyDecisions.reduce((sum, d) => 
      sum + (d.swissArmyAttempt?.implementationTime || 0), 0
    ) / swissArmyDecisions.length;

    const specializedUsage = specializedDecisions.length / totalDecisions * 100;

    setMetrics({
      swissArmySuccessRate: successRate,
      averageImplementationTime: avgTime,
      specializedToolUsage: specializedUsage
    });
  }, [decisions]);

  // 🔄 Actualizar decisión
  const updateDecision = useCallback((decisionId: string, updates: Partial<ToolDecision>) => {
    setDecisions(prev => prev.map(d => 
      d.id === decisionId ? { ...d, ...updates } : d
    ));
  }, []);

  // 📋 Obtener recomendaciones
  const getRecommendations = useCallback((useCase: UseCase) => {
    const swissResult = evaluateSwissArmy(useCase);
    const specializedResult = shouldUseSpecialized(useCase, swissResult);

    return {
      primaryRecommendation: specializedResult.shouldUse ? 'specialized' : 'swiss-army',
      swissArmyTools: swissResult.recommendedTools,
      specializedJustification: specializedResult.reasons,
      confidence: Math.max(swissResult.compatibilityScore / 10, specializedResult.score / 5)
    };
  }, [evaluateSwissArmy, shouldUseSpecialized]);

  return {
    // Funciones principales
    evaluateSwissArmy,
    shouldUseSpecialized,
    createDecision,
    updateDecision,
    getRecommendations,
    
    // Datos
    decisions,
    metrics,
    swissArmyKnife: SWISS_ARMY_KNIFE,
    specializedCriteria: SPECIALIZED_CRITERIA,
    
    // Utilidades
    calculateMetrics
  };
}; 