// 🎯 Framework "Navaja Suiza" - Utilidades y Helpers

import { UseCase, ToolDecision, SwissArmyTool } from '@/shared/hooks/hooks/useSwissArmyDecision';

// 🔧 Configuración de herramientas especializadas
export const SPECIALIZED_TOOLS = {
  charts: {
    d3: {
      name: 'D3.js',
      useCases: ['gráficos 3D', 'visualizaciones complejas', 'animaciones avanzadas'],
      performance: '< 500ms',
      bundleSize: '200KB',
      complexity: 9,
      teamFamiliarity: 4
    },
    threejs: {
      name: 'Three.js',
      useCases: ['gráficos 3D', 'visualizaciones inmersivas'],
      performance: '< 1000ms',
      bundleSize: '500KB',
      complexity: 10,
      teamFamiliarity: 3
    }
  },
  tables: {
    agGrid: {
      name: 'AG Grid',
      useCases: ['tablas con 100k+ filas', 'edición inline', 'agrupación avanzada'],
      performance: '< 100ms',
      bundleSize: '150KB',
      complexity: 7,
      teamFamiliarity: 5
    },
    reactWindow: {
      name: 'React Window',
      useCases: ['listas virtuales', 'tablas con scroll infinito'],
      performance: '< 50ms',
      bundleSize: '20KB',
      complexity: 6,
      teamFamiliarity: 6
    }
  },
  forms: {
    formik: {
      name: 'Formik',
      useCases: ['formularios complejos', 'validación avanzada'],
      performance: '< 100ms',
      bundleSize: '40KB',
      complexity: 5,
      teamFamiliarity: 7
    },
    finalForm: {
      name: 'Final Form',
      useCases: ['formularios con performance crítica'],
      performance: '< 30ms',
      bundleSize: '25KB',
      complexity: 6,
      teamFamiliarity: 5
    }
  },
  editors: {
    monaco: {
      name: 'Monaco Editor',
      useCases: ['editor de código', 'syntax highlighting', 'autocompletado'],
      performance: '< 200ms',
      bundleSize: '2MB',
      complexity: 8,
      teamFamiliarity: 4
    },
    quill: {
      name: 'Quill',
      useCases: ['editor de texto rico', 'formateo de texto'],
      performance: '< 150ms',
      bundleSize: '100KB',
      complexity: 5,
      teamFamiliarity: 6
    }
  }
};

// 📊 Funciones de análisis y evaluación

/**
 * Analiza un caso de uso y determina la mejor herramienta
 */
export const analyzeUseCase = (useCase: UseCase) => {
  const analysis = {
    complexity: {
      level: useCase.complexity > 8 ? 'high' : useCase.complexity > 5 ? 'medium' : 'low',
      score: useCase.complexity
    },
    businessImpact: {
      level: useCase.businessImpact > 8 ? 'critical' : useCase.businessImpact > 5 ? 'high' : 'medium',
      score: useCase.businessImpact
    },
    performance: {
      requirement: useCase.performanceRequirement,
      level: useCase.performanceRequirement > 2000 ? 'critical' : 
             useCase.performanceRequirement > 1000 ? 'high' : 'normal'
    },
    priority: {
      level: useCase.priority,
      weight: useCase.priority === 'critical' ? 4 : 
              useCase.priority === 'high' ? 3 : 
              useCase.priority === 'medium' ? 2 : 1
    }
  };

  return analysis;
};

/**
 * Calcula el score de compatibilidad con la navaja suiza
 */
export const calculateSwissArmyScore = (useCase: UseCase, matchingTools: SwissArmyTool[]) => {
  if (matchingTools.length === 0) return 0;

  const scores = matchingTools.map(tool => {
    const familiarityScore = tool.teamFamiliarity * 0.4;
    const complexityScore = (11 - tool.complexity) * 0.3;
    const requirementMatchScore = (matchingTools.length / useCase.requirements.length) * 0.3;
    
    return familiarityScore + complexityScore + requirementMatchScore;
  });

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

/**
 * Determina si se necesita herramienta especializada
 */
export const needsSpecializedTool = (useCase: UseCase, swissArmyScore: number) => {
  const analysis = analyzeUseCase(useCase);
  
  const criteria = [
    swissArmyScore < 5, // Navaja suiza no puede manejar
    analysis.performance.level === 'critical',
    analysis.complexity.level === 'high',
    analysis.businessImpact.level === 'critical',
    analysis.priority.level === 'critical'
  ];

  const score = criteria.filter(Boolean).length;
  const threshold = analysis.priority.weight >= 3 ? 2 : 3;

  return {
    needsSpecialized: score >= threshold,
    score,
    threshold,
    reasons: criteria.map((met, index) => ({
      criterion: [
        'Navaja suiza insuficiente',
        'Performance crítica',
        'Complejidad alta',
        'Impacto crítico',
        'Prioridad crítica'
      ][index],
      met
    })).filter(r => r.met)
  };
};

/**
 * Encuentra la mejor herramienta especializada
 */
export const findBestSpecializedTool = (useCase: UseCase) => {
  const requirements = useCase.requirements.map(r => r.toLowerCase());
  const matches: Array<{tool: any, category: string, score: number}> = [];

  Object.entries(SPECIALIZED_TOOLS).forEach(([category, tools]) => {
    Object.entries(tools).forEach(([key, tool]) => {
      const matchingUseCases = tool.useCases.filter(uc => 
        requirements.some(req => 
          req.includes(uc.toLowerCase()) || 
          uc.toLowerCase().includes(req)
        )
      );

      if (matchingUseCases.length > 0) {
        const score = (matchingUseCases.length / tool.useCases.length) * 
                     (tool.teamFamiliarity / 10) * 
                     (1 / tool.complexity);
        
        matches.push({ tool, category, score });
      }
    });
  });

  return matches.sort((a, b) => b.score - a.score);
};

// 📈 Funciones de métricas y reporting

/**
 * Calcula métricas de rendimiento del framework
 */
export const calculateFrameworkMetrics = (decisions: ToolDecision[]) => {
  const totalDecisions = decisions.length;
  if (totalDecisions === 0) {
    return {
      swissArmySuccessRate: 0,
      averageImplementationTime: 0,
      specializedToolUsage: 0,
      averageDecisionTime: 0,
      mostUsedTools: [],
      decisionTrends: []
    };
  }

  const swissArmyDecisions = decisions.filter(d => d.decision === 'swiss-army');
  const specializedDecisions = decisions.filter(d => d.decision === 'specialized');

  // Tasa de éxito de navaja suiza
  const successfulSwissArmy = swissArmyDecisions.filter(d => 
    d.swissArmyAttempt?.result === 'success'
  ).length;
  const swissArmySuccessRate = swissArmyDecisions.length > 0 ? 
    (successfulSwissArmy / swissArmyDecisions.length) * 100 : 0;

  // Tiempo promedio de implementación
  const totalImplementationTime = swissArmyDecisions.reduce((sum, d) => 
    sum + (d.swissArmyAttempt?.implementationTime || 0), 0
  );
  const averageImplementationTime = swissArmyDecisions.length > 0 ? 
    totalImplementationTime / swissArmyDecisions.length : 0;

  // Uso de herramientas especializadas
  const specializedToolUsage = (specializedDecisions.length / totalDecisions) * 100;

  // Tiempo promedio de decisión
  const decisionTimes = decisions.map(d => {
    const nextReview = new Date(d.nextReview);
    const decisionDate = new Date(d.date);
    return (nextReview.getTime() - decisionDate.getTime()) / (1000 * 60 * 60 * 24); // días
  });
  const averageDecisionTime = decisionTimes.reduce((sum, time) => sum + time, 0) / decisionTimes.length;

  // Herramientas más usadas
  const toolUsage = new Map<string, number>();
  swissArmyDecisions.forEach(d => {
    const tool = d.swissArmyAttempt?.tool || 'unknown';
    toolUsage.set(tool, (toolUsage.get(tool) || 0) + 1);
  });
  const mostUsedTools = Array.from(toolUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tool, count]) => ({ tool, count }));

  // Tendencias de decisión
  const monthlyDecisions = new Map<string, {swissArmy: number, specialized: number}>();
  decisions.forEach(d => {
    const month = new Date(d.date).toISOString().slice(0, 7); // YYYY-MM
    const current = monthlyDecisions.get(month) || { swissArmy: 0, specialized: 0 };
    
    if (d.decision === 'swiss-army') {
      current.swissArmy++;
    } else if (d.decision === 'specialized') {
      current.specialized++;
    }
    
    monthlyDecisions.set(month, current);
  });

  const decisionTrends = Array.from(monthlyDecisions.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, counts]) => ({
      month,
      swissArmy: counts.swissArmy,
      specialized: counts.specialized,
      total: counts.swissArmy + counts.specialized
    }));

  return {
    swissArmySuccessRate,
    averageImplementationTime,
    specializedToolUsage,
    averageDecisionTime,
    mostUsedTools,
    decisionTrends
  };
};

/**
 * Genera reporte de rendimiento
 */
export const generatePerformanceReport = (decisions: ToolDecision[]) => {
  const metrics = calculateFrameworkMetrics(decisions);
  
  const report = {
    summary: {
      totalDecisions: decisions.length,
      swissArmyDecisions: decisions.filter(d => d.decision === 'swiss-army').length,
      specializedDecisions: decisions.filter(d => d.decision === 'specialized').length,
      successRate: metrics.swissArmySuccessRate,
      averageTime: metrics.averageImplementationTime
    },
    recommendations: [] as string[],
    alerts: [] as string[]
  };

  // Generar recomendaciones
  if (metrics.swissArmySuccessRate < 80) {
    report.recommendations.push(
      'La tasa de éxito de la navaja suiza está por debajo del objetivo (80%). ' +
      'Considera revisar los criterios de decisión o mejorar las herramientas base.'
    );
  }

  if (metrics.specializedToolUsage > 20) {
    report.recommendations.push(
      'El uso de herramientas especializadas está por encima del objetivo (15%). ' +
      'Revisa si realmente necesitas tantas herramientas especializadas.'
    );
  }

  if (metrics.averageImplementationTime > 8) {
    report.recommendations.push(
      'El tiempo promedio de implementación está por encima del objetivo (4h). ' +
      'Considera crear más templates o mejorar la documentación.'
    );
  }

  // Generar alertas
  if (metrics.swissArmySuccessRate < 60) {
    report.alerts.push(
      'ALERTA: Tasa de éxito de navaja suiza críticamente baja. ' +
      'Revisión inmediata requerida.'
    );
  }

  if (metrics.specializedToolUsage > 30) {
    report.alerts.push(
      'ALERTA: Uso excesivo de herramientas especializadas. ' +
      'Riesgo de fragmentación del stack.'
    );
  }

  return report;
};

// 🔧 Funciones de utilidad

/**
 * Valida un caso de uso
 */
export const validateUseCase = (useCase: Partial<UseCase>): {valid: boolean, errors: string[]} => {
  const errors: string[] = [];

  if (!useCase.name?.trim()) {
    errors.push('El nombre del caso de uso es requerido');
  }

  if (!useCase.description?.trim()) {
    errors.push('La descripción del caso de uso es requerida');
  }

  if (!useCase.requirements?.length) {
    errors.push('Al menos un requerimiento es necesario');
  }

  if (useCase.complexity && (useCase.complexity < 1 || useCase.complexity > 10)) {
    errors.push('La complejidad debe estar entre 1 y 10');
  }

  if (useCase.businessImpact && (useCase.businessImpact < 1 || useCase.businessImpact > 10)) {
    errors.push('El impacto de negocio debe estar entre 1 y 10');
  }

  if (useCase.performanceRequirement && useCase.performanceRequirement < 0) {
    errors.push('El requerimiento de performance debe ser positivo');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Formatea una decisión para mostrar
 */
export const formatDecision = (decision: ToolDecision) => {
  return {
    id: decision.id,
    name: decision.useCase.name,
    description: decision.useCase.description,
    decision: decision.decision === 'swiss-army' ? 'Navaja Suiza' : 
              decision.decision === 'specialized' ? 'Especializada' : 'Pendiente',
    date: new Date(decision.date).toLocaleDateString(),
    complexity: decision.useCase.complexity,
    impact: decision.useCase.businessImpact,
    tool: decision.swissArmyAttempt?.tool || decision.specializedTool?.tool || 'N/A',
    status: decision.swissArmyAttempt?.result || 'pending'
  };
};

/**
 * Exporta decisiones a CSV
 */
export const exportDecisionsToCSV = (decisions: ToolDecision[]) => {
  const headers = [
    'ID',
    'Nombre',
    'Descripción',
    'Decisión',
    'Fecha',
    'Complejidad',
    'Impacto',
    'Herramienta',
    'Estado',
    'Notas'
  ];

  const rows = decisions.map(d => [
    d.id,
    d.useCase.name,
    d.useCase.description,
    d.decision,
    new Date(d.date).toISOString(),
    d.useCase.complexity,
    d.useCase.businessImpact,
    d.swissArmyAttempt?.tool || d.specializedTool?.tool || '',
    d.swissArmyAttempt?.result || 'pending',
    d.notes
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
};

/**
 * Importa decisiones desde CSV
 */
export const importDecisionsFromCSV = (csvContent: string): ToolDecision[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    return {
      id: row.ID,
      useCase: {
        id: row.ID,
        name: row.Nombre,
        description: row.Descripción,
        requirements: [],
        performanceRequirement: 1000,
        complexity: parseInt(row.Complejidad) || 5,
        businessImpact: parseInt(row.Impacto) || 5,
        priority: 'medium' as const
      },
      decision: row.Decisión === 'Navaja Suiza' ? 'swiss-army' : 
                row.Decisión === 'Especializada' ? 'specialized' : 'pending',
      date: new Date(row.Fecha),
      reviewer: 'System',
      nextReview: new Date(),
      notes: row.Notas || ''
    };
  });
}; 