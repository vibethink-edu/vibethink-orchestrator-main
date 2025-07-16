
export interface ConversationDecision {
  id: string;
  title: string;
  date: string;
  category: 'architecture' | 'implementation' | 'business' | 'ux' | 'security' | 'testing' | 'automation' | 'documentation' | 'best-practices';
  summary: string;
  keyPoints: string[];
  impact: string;
  status: 'proposed' | 'accepted' | 'implemented' | 'rejected' | 'refined';
  relatedFiles?: string[];
  estimatedEffort?: 'low' | 'medium' | 'high';
  tags?: string[];
  language: 'es' | 'en';
  previousVersions?: string[];
  testingNotes?: string;
  automationOpportunities?: string[];
}

export interface ConversationInsight {
  id: string;
  timestamp: Date;
  topic: string;
  decisions: ConversationDecision[];
  nextActions: string[];
  concerns: string[];
  bestPractices: string[];
  automationIdeas: string[];
  testingStrategy?: string;
  multiLanguageNotes?: Record<string, string>;
}

export interface BestPractice {
  id: string;
  title: string;
  category: string;
  description: string;
  implementation: string;
  examples: string[];
  tags: string[];
  lastUsed: Date;
  usageCount: number;
}

export class ConversationTracker {
  private static instance: ConversationTracker;
  private insights: ConversationInsight[] = [];
  private bestPractices: BestPractice[] = [];

  private constructor() {
    this.loadFromStorage();
    this.initializeBestPractices();
  }

  static getInstance(): ConversationTracker {
    if (!ConversationTracker.instance) {
      ConversationTracker.instance = new ConversationTracker();
    }
    return ConversationTracker.instance;
  }

  addInsight(insight: ConversationInsight) {
    this.insights.push(insight);
    this.extractBestPractices(insight);
    this.saveToStorage();
  }

  addDecision(decision: ConversationDecision) {
    const today = new Date();
    const todayInsight = this.insights.find(
      insight => insight.timestamp.toDateString() === today.toDateString()
    );

    if (todayInsight) {
      // Check if this is a refinement of an existing decision
      const existingDecision = todayInsight.decisions.find(d => 
        d.title.toLowerCase().includes(decision.title.toLowerCase()) ||
        decision.title.toLowerCase().includes(d.title.toLowerCase())
      );

      if (existingDecision) {
        // Mark as refined and keep version history
        existingDecision.previousVersions = existingDecision.previousVersions || [];
        existingDecision.previousVersions.push(JSON.stringify(existingDecision));
        Object.assign(existingDecision, { ...decision, status: 'refined' });
      } else {
        todayInsight.decisions.push(decision);
      }
    } else {
      this.addInsight({
        id: `insight-${Date.now()}`,
        timestamp: today,
        topic: decision.title,
        decisions: [decision],
        nextActions: [],
        concerns: [],
        bestPractices: [],
        automationIdeas: []
      });
    }
  }

  private extractBestPractices(insight: ConversationInsight) {
    // Auto-extract best practices from successful decisions
    insight.decisions
      .filter(d => d.status === 'implemented' || d.status === 'accepted')
      .forEach(decision => {
        const practice: BestPractice = {
          id: `bp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `Best Practice: ${decision.title}`,
          category: decision.category,
          description: decision.summary,
          implementation: decision.keyPoints.join('; '),
          examples: decision.relatedFiles || [],
          tags: decision.tags || [decision.category],
          lastUsed: new Date(),
          usageCount: 1
        };

        // Check if similar practice exists
        const existing = this.bestPractices.find(bp => 
          bp.title.toLowerCase().includes(decision.title.toLowerCase())
        );

        if (existing) {
          existing.usageCount++;
          existing.lastUsed = new Date();
        } else {
          this.bestPractices.push(practice);
        }
      });
  }

  private initializeBestPractices() {
    // Initialize with current best practices from our conversations
    const initialPractices: BestPractice[] = [
      {
        id: 'bp-currency-api',
        title: 'Real-time Currency Exchange with Fallback',
        category: 'implementation',
        description: 'Use external API with caching and fallback rates for currency exchange',
        implementation: 'API + 1-hour cache + predefined fallback rates + visual status indicators',
        examples: ['useCurrencyExchange.tsx', 'CurrencySelector.tsx'],
        tags: ['currency', 'api', 'ux', 'resilience'],
        lastUsed: new Date(),
        usageCount: 1
      },
      {
        id: 'bp-documentation',
        title: 'Automated Decision Documentation',
        category: 'documentation',
        description: 'Capture every conversation decision automatically with categorization',
        implementation: 'ConversationTracker singleton + structured interfaces + localStorage persistence',
        examples: ['conversationTracker.ts', 'Documentation.tsx'],
        tags: ['documentation', 'automation', 'decision-tracking'],
        lastUsed: new Date(),
        usageCount: 1
      },
      {
        id: 'bp-isolated-panels',
        title: 'Isolated Admin Panels for Security',
        category: 'architecture',
        description: 'Separate admin functionality from main app for security and scalability',
        implementation: 'Completely isolated modules with separate authentication',
        examples: ['SuperAdminDashboard.tsx'],
        tags: ['security', 'architecture', 'admin', 'isolation'],
        lastUsed: new Date(),
        usageCount: 1
      }
    ];

    this.bestPractices = [...this.bestPractices, ...initialPractices];
  }

  getBestPracticesByCategory(category: string): BestPractice[] {
    return this.bestPractices
      .filter(bp => bp.category === category)
      .sort((a, b) => b.usageCount - a.usageCount);
  }

  searchBestPractices(query: string): BestPractice[] {
    const lowerQuery = query.toLowerCase();
    return this.bestPractices.filter(bp =>
      bp.title.toLowerCase().includes(lowerQuery) ||
      bp.description.toLowerCase().includes(lowerQuery) ||
      bp.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getDecisionsByCategory(category: string): ConversationDecision[] {
    return this.insights
      .flatMap(insight => insight.decisions)
      .filter(decision => decision.category === category);
  }

  getAllDecisions(): ConversationDecision[] {
    return this.insights.flatMap(insight => insight.decisions);
  }

  generateAutomationOpportunities(): string[] {
    const opportunities = this.insights.flatMap(insight => insight.automationIdeas);
    
    // Add auto-detected opportunities
    const decisions = this.getAllDecisions();
    const repetitivePatterns = decisions
      .filter(d => d.estimatedEffort === 'low' && d.status === 'implemented')
      .map(d => `Automatizar: ${d.title} (patrón repetitivo detectado)`);

    return [...new Set([...opportunities, ...repetitivePatterns])];
  }

  exportToMarkdown(): string {
    let markdown = '# 📋 Registro Completo de Conversaciones y Decisiones\n\n';
    
    // Executive Summary
    markdown += '## 🎯 Resumen Ejecutivo\n\n';
    markdown += `- **Total de decisiones**: ${this.getAllDecisions().length}\n`;
    markdown += `- **Mejores prácticas**: ${this.bestPractices.length}\n`;
    markdown += `- **Conversaciones registradas**: ${this.insights.length}\n`;
    markdown += `- **Última actualización**: ${new Date().toLocaleString()}\n\n`;

    // Best Practices Section
    markdown += '## 🌟 Mejores Prácticas Identificadas\n\n';
    const practicesByCategory = ['implementation', 'architecture', 'documentation', 'testing', 'automation']
      .map(cat => ({ category: cat, practices: this.getBestPracticesByCategory(cat) }))
      .filter(group => group.practices.length > 0);

    practicesByCategory.forEach(group => {
      markdown += `### ${group.category.charAt(0).toUpperCase() + group.category.slice(1)}\n\n`;
      group.practices.forEach(practice => {
        markdown += `#### ${practice.title}\n`;
        markdown += `- **Descripción**: ${practice.description}\n`;
        markdown += `- **Implementación**: ${practice.implementation}\n`;
        markdown += `- **Usado**: ${practice.usageCount} veces\n`;
        markdown += `- **Tags**: ${practice.tags.join(', ')}\n\n`;
      });
    });

    // Automation Opportunities
    const automationOps = this.generateAutomationOpportunities();
    if (automationOps.length > 0) {
      markdown += '## 🤖 Oportunidades de Automatización\n\n';
      automationOps.forEach(opportunity => {
        markdown += `- [ ] ${opportunity}\n`;
      });
      markdown += '\n';
    }

    // Detailed Conversations
    markdown += '## 📝 Registro Detallado de Conversaciones\n\n';
    this.insights.forEach(insight => {
      markdown += `## ${insight.topic} - ${insight.timestamp.toDateString()}\n\n`;
      
      if (insight.decisions.length > 0) {
        markdown += '### 🎯 Decisiones Tomadas\n\n';
        insight.decisions.forEach(decision => {
          markdown += `#### ${decision.title}\n`;
          markdown += `- **Estado**: ${this.getStatusEmoji(decision.status)} ${decision.status}\n`;
          markdown += `- **Categoría**: ${decision.category}\n`;
          markdown += `- **Resumen**: ${decision.summary}\n`;
          markdown += `- **Puntos Clave**:\n`;
          decision.keyPoints.forEach(point => {
            markdown += `  - ${point}\n`;
          });
          markdown += `- **Impacto**: ${decision.impact}\n`;
          
          if (decision.tags && decision.tags.length > 0) {
            markdown += `- **Tags**: ${decision.tags.join(', ')}\n`;
          }
          
          if (decision.testingNotes) {
            markdown += `- **Testing**: ${decision.testingNotes}\n`;
          }
          
          if (decision.automationOpportunities && decision.automationOpportunities.length > 0) {
            markdown += `- **Automatización**: ${decision.automationOpportunities.join('; ')}\n`;
          }
          
          markdown += '\n';
        });
      }

      if (insight.bestPractices.length > 0) {
        markdown += '### ⭐ Mejores Prácticas Aplicadas\n\n';
        insight.bestPractices.forEach(practice => {
          markdown += `- ✅ ${practice}\n`;
        });
        markdown += '\n';
      }

      if (insight.nextActions.length > 0) {
        markdown += '### 📋 Próximas Acciones\n\n';
        insight.nextActions.forEach(action => {
          markdown += `- [ ] ${action}\n`;
        });
        markdown += '\n';
      }

      if (insight.concerns.length > 0) {
        markdown += '### ⚠️ Preocupaciones y Riesgos\n\n';
        insight.concerns.forEach(concern => {
          markdown += `- ⚠️ ${concern}\n`;
        });
        markdown += '\n';
      }

      markdown += '---\n\n';
    });

    return markdown;
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'proposed': return '💡';
      case 'accepted': return '✅';
      case 'implemented': return '🚀';
      case 'rejected': return '❌';
      case 'refined': return '🔄';
      default: return '📝';
    }
  }

  exportToJSON(): string {
    return JSON.stringify({
      insights: this.insights,
      bestPractices: this.bestPractices,
      metadata: {
        totalDecisions: this.getAllDecisions().length,
        totalBestPractices: this.bestPractices.length,
        exportDate: new Date().toISOString(),
        categories: this.getCategories(),
        automationOpportunities: this.generateAutomationOpportunities()
      }
    }, null, 2);
  }

  private getCategories(): Record<string, number> {
    const decisions = this.getAllDecisions();
    return decisions.reduce((acc, decision) => {
      acc[decision.category] = (acc[decision.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private saveToStorage() {
    try {
      localStorage.setItem('conversation-insights', JSON.stringify(this.insights));
      localStorage.setItem('best-practices', JSON.stringify(this.bestPractices));
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    }
  }

  private loadFromStorage() {
    try {
      const insightsStored = localStorage.getItem('conversation-insights');
      const practicesStored = localStorage.getItem('best-practices');
      
      if (insightsStored) {
        this.insights = JSON.parse(insightsStored).map((insight: any) => ({
          ...insight,
          timestamp: new Date(insight.timestamp)
        }));
      }
      
      if (practicesStored) {
        this.bestPractices = JSON.parse(practicesStored).map((practice: any) => ({
          ...practice,
          lastUsed: new Date(practice.lastUsed)
        }));
      }
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      this.insights = [];
      this.bestPractices = [];
    }
  }
}

// Enhanced helper function to record conversations
export const recordConversationDecision = (decision: Omit<ConversationDecision, 'id' | 'date' | 'language'>) => {
  const tracker = ConversationTracker.getInstance();
  tracker.addDecision({
    ...decision,
    id: `decision-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    language: 'es' // Default to Spanish, can be overridden
  });
};

// Record current conversation decisions automatically
export const recordCurrentConversationDecisions = () => {
  // Documentation system decision
  recordConversationDecision({
    title: 'Sistema de Documentación Automática y Captura de Conversaciones',
    category: 'documentation',
    summary: 'Sistema completo para capturar automáticamente todas las conversaciones, decisiones y mejores prácticas',
    keyPoints: [
      'Captura automática de cada conversación y cambio',
      'Categorización por tipo (arquitectura, implementación, business, UX, etc.)',
      'Registro histórico con versionado de decisiones',
      'Extracción automática de mejores prácticas',
      'Detección de oportunidades de automatización',
      'Exportación a múltiples formatos (Markdown, JSON)',
      'Sistema multiidioma (ES/EN)',
      'Persistencia en localStorage',
      'Tracking de uso de mejores prácticas'
    ],
    impact: 'Garantiza que ninguna decisión o conocimiento se pierda, facilita reutilización de mejores prácticas',
    status: 'implemented',
    tags: ['documentation', 'automation', 'best-practices', 'tracking'],
    testingNotes: 'Probar persistencia, exportación y categorización automática',
    automationOpportunities: [
      'Auto-generar documentación técnica basada en decisiones',
      'Alertas cuando se detectan patrones repetitivos',
      'Sugerencias de mejores prácticas basadas en contexto'
    ]
  });

  // Currency system refinement
  recordConversationDecision({
    title: 'Refinamiento del Sistema de Monedas con API Real',
    category: 'implementation',
    summary: 'Implementación mejorada del sistema de cambio con API externa, incluyendo COP',
    keyPoints: [
      'API exchangerate-api.com como fuente principal',
      'Caché de 1 hora para optimizar performance',
      'Sistema de fallback con tasas predefinidas',
      'Soporte completo para COP (Peso Colombiano)',
      'Indicadores visuales de estado (online/offline/loading)',
      'Refresh manual para usuarios',
      'Error handling robusto'
    ],
    impact: 'UX superior para usuarios internacionales, especialmente LATAM',
    status: 'implemented',
    tags: ['currency', 'api', 'ux', 'latam', 'cop'],
    relatedFiles: ['useCurrencyExchange.tsx', 'CurrencySelector.tsx']
  });

  // Super admin panel planning
  recordConversationDecision({
    title: 'Panel de Superadministración Aislado v0.6.0',
    category: 'architecture',
    summary: 'Planificación de panel completamente aislado para administración de plataforma',
    keyPoints: [
      'Aislamiento completo del sistema principal',
      'Doble autenticación para super admins',
      'Gestión de empresas/tenants',
      'Sistema de soporte integrado con tickets',
      'Analytics y reportes globales',
      'Chat en vivo con clientes',
      'Base de conocimientos',
      'Auditoria completa de acciones'
    ],
    impact: 'Escalabilidad y profesionalización para crecimiento empresarial',
    status: 'proposed',
    estimatedEffort: 'high',
    tags: ['admin', 'security', 'isolation', 'support', 'scalability']
  });

  // NEW: Operational instruction repositories planning - REFINED
  recordConversationDecision({
    title: 'Repositorios de Instrucciones Operacionales por Empresa',
    category: 'documentation',
    summary: 'Sistema de repositorios para almacenar prompts, naming conventions y estructuras organizacionales específicas de cada empresa',
    keyPoints: [
      'Prompts operacionales específicos por empresa (NO prompts de desarrollo de la plataforma)',
      'Naming conventions personalizables por empresa para archivos y carpetas',
      'Estructuras de carpetas consistentes según clasificación por áreas',
      'Integración con sistemas externos (Google Drive, file systems)',
      'Templates de prompts reutilizables por industria/proceso',
      'Sistema de orquestación centralizada por empresa (ej: manager@euphoria-net.com)',
      'Versionado y control de cambios de instrucciones operacionales',
      'Validación automática de cumplimiento de naming conventions',
      'Categorización por departamentos/áreas de la empresa'
    ],
    impact: 'Consistencia organizacional total, orquestación centralizada, escalabilidad operacional',
    status: 'proposed',
    estimatedEffort: 'medium',
    tags: ['operations', 'prompts', 'naming-conventions', 'file-organization', 'google-drive', 'orchestration'],
    automationOpportunities: [
      'Auto-creación de estructuras de carpetas según templates empresariales',
      'Validación automática de naming conventions al crear archivos',
      'Sincronización de estructuras entre Google Drive y sistema interno',
      'Alertas cuando se violan las convenciones organizacionales',
      'Templates dinámicos de prompts basados en área/departamento'
    ],
    testingNotes: 'Validar integración con Google Drive API, templates por empresa, sistema de orquestación',
    relatedFiles: ['future: prompt-templates/', 'future: naming-conventions/', 'future: folder-structures/']
  });

  // NEW: Domain standardization decision
  recordConversationDecision({
    title: 'Estandarización de Dominio AI Pair a VibeThink.co',
    category: 'business',
    summary: 'Actualización de todos los dominios de VibeThink.com a VibeThink.co para consistencia empresarial',
    keyPoints: [
      'Cambio de admin@VibeThink.com a admin@VibeThink.co como SuperAdmin principal',
      'Actualización de credenciales de soporte a support@VibeThink.co',
      'Mantenimiento de consistencia en toda la plataforma',
      'Reflejo del dominio real de la empresa',
      'Actualización en SimpleLogin y Login interfaces',
      'Documentación automática del cambio'
    ],
    impact: 'Consistencia de marca y dominio en toda la plataforma, mejora profesional',
    status: 'implemented',
    tags: ['domain', 'branding', 'consistency', 'credentials'],
    testingNotes: 'Verificar que admin@VibeThink.co y support@VibeThink.co funcionen correctamente',
    automationOpportunities: [
      'Script para validar consistencia de dominios en toda la aplicación',
      'Verificación automática de credenciales de testing'
    ]
  });

  // NEW: Prisma ORM rejection decision
  recordConversationDecision({
    title: 'Decisión de NO Usar Prisma ORM - Alternativa con Mejoras Específicas',
    category: 'architecture',
    summary: 'Rechazo fundamentado de Prisma ORM en favor de mejoras específicas al stack actual Supabase',
    keyPoints: [
      'Mantener Supabase client nativo para máxima compatibilidad',
      'Preservar Row Level Security (RLS) crítico para multi-tenancy',
      'Aprovechar integración nativa con Real-time y Edge Functions',
      'Evitar duplicación de funcionalidad y complejidad innecesaria',
      'Implementar alternativa con mejoras específicas en DX'
    ],
    impact: 'Mantiene arquitectura estable y segura, enfoque en mejoras incrementales específicas',
    status: 'accepted',
    estimatedEffort: 'low',
    tags: ['orm', 'supabase', 'architecture', 'developer-experience', 'rls'],
    testingNotes: 'Validar que mejoras no afecten funcionalidad RLS existente',
    automationOpportunities: [
      'Helpers automáticos para queries complejas',
      'Generación de tipos más específicos',
      'Validación automática de políticas RLS',
      'Templates de código para patrones comunes'
    ],
    relatedFiles: ['src/hooks/', 'src/integrations/supabase/']
  });

  // NEW: Developer Experience improvements plan
  recordConversationDecision({
    title: 'Plan de Mejoras en Developer Experience sin ORM',
    category: 'implementation',
    summary: 'Estrategia específica para mejorar DX manteniendo stack Supabase nativo',
    keyPoints: [
      'Crear hooks más especializados con mejor type safety',
      'Desarrollar helpers específicos para queries complejas recurrentes',
      'Mejorar documentación de patrones de acceso a datos',
      'Expandir uso de funciones SQL para lógica compleja',
      'Crear templates y snippets para operaciones comunes',
      'Implementar validadores automáticos de RLS policies'
    ],
    impact: 'Mejor experiencia de desarrollo sin comprometer arquitectura o seguridad',
    status: 'proposed',
    estimatedEffort: 'medium',
    tags: ['dx', 'hooks', 'type-safety', 'documentation', 'helpers'],
    testingNotes: 'Verificar que mejoras no introduzcan regressions en funcionalidad',
    automationOpportunities: [
      'Auto-generación de hooks basados en esquemas de BD',
      'Snippets automáticos para VSCode con patrones comunes',
      'Validación automática de tipos en queries',
      'Templates dinámicos para nuevas features'
    ]
  });
};
