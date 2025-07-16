// 🏭 Tipos para Estándares de Calidad Empresariales - VThink 1.0

export interface IndustryStandard {
  id: string;
  name: string;
  category: 'quality' | 'security' | 'compliance' | 'performance' | 'sustainability';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  requirements: string[];
  metrics: {
    kpi: string;
    target: number;
    unit: string;
  }[];
  compliance: {
    mandatory: boolean;
    certification: string[];
    auditFrequency: 'monthly' | 'quarterly' | 'yearly';
  };
  implementation: {
    complexity: 1 | 2 | 3 | 4 | 5;
    estimatedTime: string;
    resources: string[];
    dependencies: string[];
  };
}

export interface CompanyQualityProfile {
  companyId: string;
  industry: string;
  size: 'startup' | 'sme' | 'enterprise';
  maturity: 'beginner' | 'growing' | 'mature' | 'expert';
  standards: {
    standardId: string;
    status: 'not-implemented' | 'in-progress' | 'implemented' | 'certified';
    progress: number; // 0-100
    lastAudit?: Date;
    nextAudit?: Date;
    score?: number;
  }[];
  overallScore: number;
  recommendations: string[];
}

// 🏭 Estándares Industriales Predefinidos
export const INDUSTRY_STANDARDS: IndustryStandard[] = [
  {
    id: 'iso-9001',
    name: 'ISO 9001 - Gestión de Calidad',
    category: 'quality',
    level: 'advanced',
    description: 'Sistema de gestión de calidad que demuestra la capacidad de proporcionar productos y servicios que cumplan con los requisitos del cliente y los reglamentos aplicables.',
    requirements: [
      'Documentación de procesos',
      'Control de calidad',
      'Mejora continua',
      'Gestión de recursos',
      'Satisfacción del cliente'
    ],
    metrics: [
      {
        kpi: 'Tasa de satisfacción del cliente',
        target: 95,
        unit: '%'
      },
      {
        kpi: 'Tiempo de respuesta a incidencias',
        target: 24,
        unit: 'horas'
      },
      {
        kpi: 'Tasa de defectos',
        target: 1,
        unit: '%'
      }
    ],
    compliance: {
      mandatory: false,
      certification: ['ISO 9001:2015'],
      auditFrequency: 'yearly'
    },
    implementation: {
      complexity: 4,
      estimatedTime: '6-12 meses',
      resources: ['Consultor ISO', 'Equipo de calidad', 'Documentación'],
      dependencies: ['Procesos documentados', 'Sistema de gestión']
    }
  },
  {
    id: 'iso-27001',
    name: 'ISO 27001 - Seguridad de la Información',
    category: 'security',
    level: 'advanced',
    description: 'Sistema de gestión de seguridad de la información que protege la confidencialidad, integridad y disponibilidad de la información.',
    requirements: [
      'Política de seguridad',
      'Gestión de riesgos',
      'Controles de acceso',
      'Continuidad del negocio',
      'Awareness de seguridad'
    ],
    metrics: [
      {
        kpi: 'Incidentes de seguridad',
        target: 0,
        unit: 'por mes'
      },
      {
        kpi: 'Tiempo de detección de amenazas',
        target: 1,
        unit: 'hora'
      },
      {
        kpi: 'Cobertura de backup',
        target: 100,
        unit: '%'
      }
    ],
    compliance: {
      mandatory: false,
      certification: ['ISO 27001:2013'],
      auditFrequency: 'yearly'
    },
    implementation: {
      complexity: 5,
      estimatedTime: '8-18 meses',
      resources: ['CISO', 'Equipo de seguridad', 'Herramientas de seguridad'],
      dependencies: ['Infraestructura de seguridad', 'Políticas de seguridad']
    }
  },
  {
    id: 'gdpr',
    name: 'GDPR - Protección de Datos',
    category: 'compliance',
    level: 'intermediate',
    description: 'Reglamento General de Protección de Datos que regula el procesamiento de datos personales en la UE.',
    requirements: [
      'Consentimiento explícito',
      'Derechos de los usuarios',
      'Notificación de brechas',
      'Evaluación de impacto',
      'Designación de DPO'
    ],
    metrics: [
      {
        kpi: 'Tiempo de respuesta a solicitudes',
        target: 30,
        unit: 'días'
      },
      {
        kpi: 'Incidentes de datos personales',
        target: 0,
        unit: 'por mes'
      },
      {
        kpi: 'Conformidad de consentimientos',
        target: 100,
        unit: '%'
      }
    ],
    compliance: {
      mandatory: true,
      certification: ['GDPR Compliance'],
      auditFrequency: 'quarterly'
    },
    implementation: {
      complexity: 3,
      estimatedTime: '3-6 meses',
      resources: ['DPO', 'Equipo legal', 'Sistema de gestión de datos'],
      dependencies: ['Política de privacidad', 'Procesos de consentimiento']
    }
  },
  {
    id: 'cmmi-ml3',
    name: 'CMMI-ML3 - Madurez de Procesos',
    category: 'quality',
    level: 'expert',
    description: 'Modelo de madurez de capacidades integradas nivel 3, que establece procesos definidos y gestionados.',
    requirements: [
      'Procesos definidos',
      'Gestión de proyectos',
      'Ingeniería de procesos',
      'Gestión de calidad',
      'Mejora continua'
    ],
    metrics: [
      {
        kpi: 'Desviación de cronograma',
        target: 10,
        unit: '%'
      },
      {
        kpi: 'Desviación de presupuesto',
        target: 5,
        unit: '%'
      },
      {
        kpi: 'Satisfacción del cliente',
        target: 90,
        unit: '%'
      }
    ],
    compliance: {
      mandatory: false,
      certification: ['CMMI-ML3'],
      auditFrequency: 'yearly'
    },
    implementation: {
      complexity: 5,
      estimatedTime: '12-24 meses',
      resources: ['Líder de procesos', 'Equipo de mejora', 'Herramientas de gestión'],
      dependencies: ['Procesos documentados', 'Sistema de métricas']
    }
  },
  {
    id: 'agile-scrum',
    name: 'Agile Scrum - Metodología Ágil',
    category: 'performance',
    level: 'intermediate',
    description: 'Metodología ágil que mejora la entrega de valor y la adaptabilidad a cambios.',
    requirements: [
      'Sprint planning',
      'Daily standups',
      'Sprint reviews',
      'Retrospectivas',
      'Product backlog'
    ],
    metrics: [
      {
        kpi: 'Velocidad del equipo',
        target: 0,
        unit: 'story points/sprint'
      },
      {
        kpi: 'Tiempo de entrega',
        target: 14,
        unit: 'días'
      },
      {
        kpi: 'Calidad del código',
        target: 95,
        unit: '%'
      }
    ],
    compliance: {
      mandatory: false,
      certification: ['Certified Scrum Master'],
      auditFrequency: 'monthly'
    },
    implementation: {
      complexity: 3,
      estimatedTime: '3-6 meses',
      resources: ['Scrum Master', 'Product Owner', 'Equipo de desarrollo'],
      dependencies: ['Herramientas de gestión', 'Formación del equipo']
    }
  },
  {
    id: 'devops',
    name: 'DevOps - Integración Continua',
    category: 'performance',
    level: 'advanced',
    description: 'Prácticas que automatizan y optimizan el proceso de desarrollo y operaciones.',
    requirements: [
      'CI/CD pipeline',
      'Infraestructura como código',
      'Monitoreo continuo',
      'Gestión de configuración',
      'Colaboración equipos'
    ],
    metrics: [
      {
        kpi: 'Tiempo de deployment',
        target: 1,
        unit: 'hora'
      },
      {
        kpi: 'Tiempo de recuperación',
        target: 4,
        unit: 'horas'
      },
      {
        kpi: 'Frecuencia de releases',
        target: 1,
        unit: 'por día'
      }
    ],
    compliance: {
      mandatory: false,
      certification: ['DevOps Foundation'],
      auditFrequency: 'quarterly'
    },
    implementation: {
      complexity: 4,
      estimatedTime: '6-12 meses',
      resources: ['DevOps Engineer', 'Herramientas de CI/CD', 'Infraestructura cloud'],
      dependencies: ['Automatización', 'Herramientas de monitoreo']
    }
  }
];

// 🎯 Funciones de utilidad para estándares
export const getStandardById = (id: string): IndustryStandard | undefined => {
  return INDUSTRY_STANDARDS.find(standard => standard.id === id);
};

export const getStandardsByCategory = (category: IndustryStandard['category']): IndustryStandard[] => {
  return INDUSTRY_STANDARDS.filter(standard => standard.category === category);
};

export const getStandardsByLevel = (level: IndustryStandard['level']): IndustryStandard[] => {
  return INDUSTRY_STANDARDS.filter(standard => standard.level === level);
};

export const calculateImplementationScore = (profile: CompanyQualityProfile): number => {
  if (!profile.standards.length) return 0;
  
  const totalScore = profile.standards.reduce((sum, standard) => {
    return sum + (standard.score || 0);
  }, 0);
  
  return Math.round(totalScore / profile.standards.length);
};

export const getRecommendations = (profile: CompanyQualityProfile): string[] => {
  const recommendations: string[] = [];
  
  // Análisis de brechas
  const implementedStandards = profile.standards.filter(s => s.status === 'implemented' || s.status === 'certified');
  const totalStandards = profile.standards.length;
  
  if (implementedStandards.length / totalStandards < 0.5) {
    recommendations.push('Implementar más estándares para mejorar la madurez organizacional');
  }
  
  // Análisis de progreso
  const lowProgressStandards = profile.standards.filter(s => s.progress < 50);
  if (lowProgressStandards.length > 0) {
    recommendations.push(`Acelerar la implementación de ${lowProgressStandards.length} estándares con bajo progreso`);
  }
  
  // Análisis de certificaciones
  const certifiedStandards = profile.standards.filter(s => s.status === 'certified');
  if (certifiedStandards.length === 0) {
    recommendations.push('Buscar certificaciones para validar la implementación de estándares');
  }
  
  return recommendations;
}; 