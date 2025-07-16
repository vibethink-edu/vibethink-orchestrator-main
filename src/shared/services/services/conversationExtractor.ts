
interface ConversationExtraction {
  decisions: ArchitecturalDecision[];
  technicalSpecs: TechnicalSpecification[];
  costAnalysis: CostAnalysis[];
  implementationSteps: ImplementationStep[];
}

interface ArchitecturalDecision {
  id: string;
  title: string;
  category: 'architecture' | 'decisions' | 'implementation' | 'costs';
  date: string;
  status: 'proposed' | 'accepted' | 'rejected';
  summary: string;
  reasoning: string;
  alternatives: string;
  consequences: string;
  tags: string[];
}

interface TechnicalSpecification {
  id: string;
  component: string;
  technology: string;
  configuration: Record<string, any>;
  dependencies: string[];
  notes: string;
}

interface CostAnalysis {
  id: string;
  solution: string;
  monthlyCost: number;
  currency: string;
  breakdown: Record<string, number>;
  justification: string;
}

interface ImplementationStep {
  id: string;
  phase: string;
  task: string;
  estimatedTime: string;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export class ConversationExtractor {
  
  static extractFromConversation(conversationText: string): ConversationExtraction {
    // Esta función analiza el texto de conversación y extrae decisiones arquitectónicas
    const decisions = this.extractArchitecturalDecisions(conversationText);
    const technicalSpecs = this.extractTechnicalSpecs(conversationText);
    const costAnalysis = this.extractCostAnalysis(conversationText);
    const implementationSteps = this.extractImplementationSteps(conversationText);

    return {
      decisions,
      technicalSpecs,
      costAnalysis,
      implementationSteps
    };
  }

  private static extractArchitecturalDecisions(text: string): ArchitecturalDecision[] {
    const decisions: ArchitecturalDecision[] = [];
    
    // Decisión RAG Multidominio
    if (text.includes('RAG') && text.includes('namespac')) {
      decisions.push({
        id: 'adr-001',
        title: 'RAG Multidominio con Qdrant Self-Hosted',
        category: 'architecture',
        date: new Date().toISOString().split('T')[0],
        status: 'accepted',
        summary: 'Implementar un único RAG con namespacing para múltiples dominios empresariales',
        reasoning: 'Permite cross-domain intelligence, reduce costos significativamente y simplifica mantenimiento',
        alternatives: 'Múltiples RAGs independientes, soluciones cloud como Pinecone/Weaviate',
        consequences: 'Ahorro del 80-85% en costos operativos, mayor complejidad en routing pero mejor contexto unificado',
        tags: ['rag', 'vector-database', 'cost-optimization', 'architecture']
      });
    }

    // Decisión Infraestructura
    if (text.includes('Hetzner') && text.includes('VPS')) {
      decisions.push({
        id: 'adr-002',
        title: 'Infraestructura Hetzner VPS Self-Hosted',
        category: 'implementation',
        date: new Date().toISOString().split('T')[0],
        status: 'accepted',
        summary: 'Deployment en Hetzner VPS para control total de datos y reducción de costos',
        reasoning: 'Control completo de datos, cumplimiento GDPR/HIPAA más sencillo, costos reducidos vs cloud',
        alternatives: 'AWS EKS, Google Cloud Run, Azure Container Instances',
        consequences: 'Responsabilidad completa de mantenimiento pero control total del stack y datos',
        tags: ['infrastructure', 'self-hosted', 'gdpr', 'cost-optimization']
      });
    }

    // Decisión Multilenguaje
    if (text.includes('multilenguaje') || text.includes('multilingual')) {
      decisions.push({
        id: 'adr-003',
        title: 'Sistema Multilenguaje con Variables en Inglés',
        category: 'decisions',
        date: new Date().toISOString().split('T')[0],
        status: 'accepted',
        summary: 'Interfaz multilenguaje (español como default) manteniendo código en inglés',
        reasoning: 'Facilita desarrollo internacional manteniendo estándares de código globales',
        alternatives: 'Todo en español, todo en inglés, sistemas de traducción automática',
        consequences: 'Mejor mantenibilidad del código, escalabilidad internacional, equipo development global',
        tags: ['i18n', 'code-standards', 'scalability']
      });
    }

    return decisions;
  }

  private static extractTechnicalSpecs(text: string): TechnicalSpecification[] {
    const specs: TechnicalSpecification[] = [];

    // Qdrant Configuration
    if (text.includes('Qdrant')) {
      specs.push({
        id: 'tech-001',
        component: 'Vector Database',
        technology: 'Qdrant',
        configuration: {
          deployment: 'Docker self-hosted',
          vectorSize: 1536,
          distanceMetric: 'Cosine',
          segmentNumber: 2,
          memoryThreshold: 20000,
          hnsw: { m: 16, efConstruct: 100 }
        },
        dependencies: ['Docker', 'Redis', 'PostgreSQL'],
        notes: 'Optimizado para namespacing multiempresa con RBAC'
      });
    }

    // Infrastructure Specs
    if (text.includes('CPX31')) {
      specs.push({
        id: 'tech-002',
        component: 'Infrastructure',
        technology: 'Hetzner VPS',
        configuration: {
          serverType: 'CPX31',
          cpu: '4 vCPU',
          memory: '8GB RAM',
          storage: '160GB NVMe',
          os: 'Ubuntu 22.04 LTS',
          docker: 'latest',
          ssl: 'Let\'s Encrypt'
        },
        dependencies: ['Docker Compose', 'Nginx', 'Certbot'],
        notes: 'Configuración optimizada para cargas de trabajo AI/ML'
      });
    }

    return specs;
  }

  private static extractCostAnalysis(text: string): CostAnalysis[] {
    const costs: CostAnalysis[] = [];

    // Cloud Solution Cost
    if (text.includes('Pinecone') || text.includes('$280')) {
      costs.push({
        id: 'cost-001',
        solution: 'Cloud RAG Solution',
        monthlyCost: 350,
        currency: 'USD',
        breakdown: {
          'Pinecone Vector DB': 280,
          'OpenAI Embeddings': 50,
          'Hosting & Storage': 20
        },
        justification: 'Solución cloud completa pero costosa para escala empresarial'
      });
    }

    // Self-hosted Solution Cost
    if (text.includes('$15') || text.includes('Hetzner')) {
      costs.push({
        id: 'cost-002',
        solution: 'Self-Hosted Solution',
        monthlyCost: 15,
        currency: 'USD',
        breakdown: {
          'Hetzner VPS CPX31': 9,
          'Backup Storage': 3,
          'Monitoring Tools': 3
        },
        justification: 'Solución self-hosted con control total y costos mínimos'
      });
    }

    return costs;
  }

  private static extractImplementationSteps(text: string): ImplementationStep[] {
    return [
      {
        id: 'step-001',
        phase: 'Fase 1 - Setup Básico',
        task: 'Docker Compose setup con Qdrant + Redis + PostgreSQL',
        estimatedTime: '1-2 días',
        dependencies: [],
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'step-002',
        phase: 'Fase 1 - Setup Básico',
        task: 'API básica de RAG con single namespace',
        estimatedTime: '1 día',
        dependencies: ['step-001'],
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'step-003',
        phase: 'Fase 2 - Production Features',
        task: 'Sistema multi-namespace con RBAC',
        estimatedTime: '3-4 días',
        dependencies: ['step-002'],
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'step-004',
        phase: 'Fase 2 - Production Features',
        task: 'Query routing inteligente por dominio',
        estimatedTime: '2-3 días',
        dependencies: ['step-003'],
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'step-005',
        phase: 'Fase 3 - Production Ready',
        task: 'Monitoring con Prometheus + Grafana',
        estimatedTime: '2 días',
        dependencies: ['step-004'],
        status: 'pending',
        priority: 'low'
      }
    ];
  }

  static generateClaudeBackup(): string {
    const projectSummary = `
# VIBETHINK ENTERPRISE - PROYECTO ARQUITECTÓNICO

## 🎯 RESUMEN EJECUTIVO
Sistema empresarial de IA con RAG multidominio, deployment self-hosted para máximo control de datos y optimización de costos.

## 🏗️ DECISIONES ARQUITECTÓNICAS CLAVE

### 1. RAG MULTIDOMINIO CON NAMESPACING
- **Decisión**: Un solo RAG con namespaces vs múltiples RAGs
- **Justificación**: Cross-domain intelligence + 80% ahorro en costos
- **Tecnología**: Qdrant self-hosted con Docker
- **Beneficios**: Contexto unificado, mantenimiento simplificado

### 2. INFRAESTRUCTURA SELF-HOSTED
- **Decisión**: Hetzner VPS vs soluciones cloud
- **Costos**: $15/mes vs $280-400/mes (85% ahorro)
- **Servidor**: CPX31 (4 vCPU, 8GB RAM, 160GB NVMe)
- **Beneficios**: Control total de datos, GDPR/HIPAA compliance

### 3. SISTEMA MULTILENGUAJE
- **UI**: Español como default, soporte multiidioma
- **Código**: Variables y programación en inglés
- **Objetivo**: Escalabilidad internacional con estándares globales

## 💾 STACK TECNOLÓGICO

### Backend:
- Vector DB: Qdrant (self-hosted)
- Database: PostgreSQL
- Cache: Redis
- API: Node.js + Express
- Deployment: Docker Compose

### Frontend:
- React + TypeScript
- Tailwind CSS + shadcn/ui
- React Router + TanStack Query

### DevOps:
- Docker + Docker Compose
- Nginx reverse proxy
- Let's Encrypt SSL
- Prometheus + Grafana monitoring

## 🗂️ ARQUITECTURA RAG

### Namespaces por Empresa:
1. **customer_service** - Info productos, soporte
2. **order_management** - Estados pedidos, logística  
3. **technical_knowledge** - Especificaciones técnicas
4. **internal_docs** - Políticas, normativas
5. **medical_records** - Historiales clínicos (con encryption)

### Seguridad:
- RBAC por namespace
- Encryption at rest
- Audit trails
- Data masking automático
- GDPR/HIPAA compliance

## 📊 CASOS DE USO ESPECÍFICOS

### Empresa de Pinturas:
- Consultas técnicas + disponibilidad + precios
- Cross-domain: "¿Pintura exterior resistente agua?" → Specs técnicas + Stock + Precio

### Clínica Médica:
- Historiales pacientes con seguridad HIPAA
- "Historial diabetes María García" → Diagnósticos + Tratamientos + Labs (role-verified)

## 🚀 ROADMAP IMPLEMENTACIÓN

### Fase 1 (1-2 días): Setup Básico
- Docker Compose con Qdrant + Redis + PostgreSQL
- API básica RAG con single namespace
- Testing básico

### Fase 2 (1 semana): Production Features
- Multi-namespace + RBAC
- Query routing inteligente
- Document ingestion pipeline

### Fase 3 (1 semana): Production Ready
- Monitoring + alerting
- Backup automatizado
- Performance optimization
- SSL + security hardening

## 💰 JUSTIFICACIÓN ECONÓMICA

### Comparativa de Costos (Mensual):
- **Cloud Solution**: $280-400 USD
- **Self-Hosted**: $15 USD  
- **Ahorro Anual**: ~$3,180 USD (85% reducción)

### ROI:
- Break-even: Inmediato
- Control total de datos: Invaluable para compliance
- Escalabilidad: Sin límites de vendor

## 🔐 COMPLIANCE Y SEGURIDAD

### Características:
- Data sovereignty completa
- GDPR compliance by design
- HIPAA ready para datos médicos
- Audit trails automáticos
- Encryption end-to-end

### Ventajas vs Cloud:
- Sin vendor lock-in
- Latencia mínima (deployment local)
- Customización ilimitada
- Datos nunca salen del control empresarial

## 📝 PRÓXIMOS PASOS

1. **Implementar módulo de documentación** (COMPLETADO)
2. **Setup infraestructura Hetzner** con Docker Compose
3. **Deploy Qdrant + stack completo**
4. **Testing con namespace único**
5. **Escalar a multi-namespace + RBAC**

---

**Este backup contiene todas las decisiones arquitectónicas y puede ser usado como contexto completo para futuras sesiones con Claude o cualquier AI assistant.**
    `;

    return projectSummary;
  }
}
