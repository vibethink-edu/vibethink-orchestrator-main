import { supabase } from '@/integrations/supabase/client';
import { timelineService } from './TimelineService';

// Tipos para agentes virtuales
export interface VirtualAgent {
  id: string;
  name: string;
  type: 'SALES' | 'SUPPORT' | 'UNITY_INK' | 'CUSTOM';
  description: string;
  capabilities: string[];
  knowledgeBase: string[];
  isActive: boolean;
  companyId: string;
  workspaceId?: string;
  subWorkspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  actions?: Array<{
    type: string;
    label: string;
    action: string;
    parameters?: any;
  }>;
}

export interface SalesAgentContext {
  customerInfo: {
    name: string;
    email: string;
    company: string;
    industry: string;
    size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  };
  requirements: {
    features: string[];
    integrations: string[];
    users: number;
    budget: {
      min: number;
      max: number;
      currency: string;
    };
  };
  timeline: {
    startDate: Date;
    expectedCompletion: Date;
  };
}

export interface UnityInkContext {
  projectType: 'INDUSTRIAL' | 'COMMERCIAL' | 'RESIDENTIAL';
  paintType: 'WATER_BASED' | 'SOLVENT_BASED' | 'EPOXY' | 'POLYURETHANE';
  surfaceType: 'METAL' | 'CONCRETE' | 'WOOD' | 'PLASTIC';
  environment: 'INDOOR' | 'OUTDOOR' | 'HIGH_TRAFFIC' | 'CORROSIVE';
  quantity: {
    liters: number;
    coverage: number; // m² por litro
  };
  timeline: {
    startDate: Date;
    completionDate: Date;
  };
}

/**
 * Servicio para Agentes Virtuales Especializados
 */
export class VirtualAgentService {
  private static instance: VirtualAgentService;
  private agents: Map<string, VirtualAgent> = new Map();

  private constructor() {
    this.initializeDefaultAgents();
  }

  public static getInstance(): VirtualAgentService {
    if (!VirtualAgentService.instance) {
      VirtualAgentService.instance = new VirtualAgentService();
    }
    return VirtualAgentService.instance;
  }

  /**
   * Inicializar agentes por defecto
   */
  private async initializeDefaultAgents(): Promise<void> {
    try {
      // Verificar si ya existen agentes
      const { data: existingAgents } = await supabase
        .from('virtual_agents')
        .select('*')
        .eq('is_active', true);

      if (!existingAgents || existingAgents.length === 0) {
        await this.createDefaultAgents();
      } else {
        // Cargar agentes existentes en memoria
        existingAgents.forEach(agent => {
          this.agents.set(agent.id, agent);
        });
      }
    } catch (error) {
      // TODO: log Error initializing default agents: error
    }
  }

  /**
   * Crear agentes por defecto
   */
  private async createDefaultAgents(): Promise<void> {
    const defaultAgents = [
      {
        name: 'AI Sales Assistant',
        type: 'SALES' as const,
        description: 'Agente especializado en ventas y onboarding de clientes',
        capabilities: [
          'ANALYZE_REQUIREMENTS',
          'CALCULATE_PRICING',
          'CREATE_TIMELINE',
          'GENERATE_PROPOSAL',
          'SCHEDULE_DEMO',
          'ONBOARD_CUSTOMER'
        ],
        knowledgeBase: [
          'product_features',
          'pricing_models',
          'integration_options',
          'industry_solutions',
          'best_practices'
        ]
      },
      {
        name: 'UNITY INK Specialist',
        type: 'UNITY_INK' as const,
        description: 'Especialista en pinturas industriales UNITY INK',
        capabilities: [
          'ANALYZE_PROJECT',
          'RECOMMEND_PRODUCTS',
          'CALCULATE_QUANTITIES',
          'ESTIMATE_COSTS',
          'CREATE_TIMELINE',
          'PROVIDE_TECHNICAL_SUPPORT'
        ],
        knowledgeBase: [
          'unity_ink_products',
          'industrial_applications',
          'technical_specifications',
          'safety_guidelines',
          'application_methods'
        ]
      }
    ];

    for (const agentData of defaultAgents) {
      await this.createAgent(agentData);
    }
  }

  /**
   * Crear un nuevo agente virtual
   */
  async createAgent(agentData: Omit<VirtualAgent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('virtual_agents')
        .insert({
          name: agentData.name,
          type: agentData.type,
          description: agentData.description,
          capabilities: agentData.capabilities,
          knowledge_base: agentData.knowledgeBase,
          is_active: agentData.isActive,
          company_id: agentData.companyId,
          workspace_id: agentData.workspaceId,
          sub_workspace_id: agentData.subWorkspaceId
        })
        .select('id')
        .single();

      if (error) throw error;

      // Agregar a memoria
      const newAgent: VirtualAgent = {
        ...agentData,
        id: data.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.agents.set(data.id, newAgent);

      return data.id;
    } catch (error) {
      // TODO: log Error creating virtual agent: error
      throw new Error('Failed to create virtual agent');
    }
  }

  /**
   * Obtener agente por ID
   */
  async getAgent(agentId: string): Promise<VirtualAgent | null> {
    try {
      // Buscar en memoria primero
      if (this.agents.has(agentId)) {
        return this.agents.get(agentId)!;
      }

      // Buscar en base de datos
      const { data, error } = await supabase
        .from('virtual_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;

      if (data) {
        const agent: VirtualAgent = {
          ...data,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        this.agents.set(agentId, agent);
        return agent;
      }

      return null;
    } catch (error) {
      // TODO: log Error fetching agent: error
      return null;
    }
  }

  /**
   * Obtener agentes por tipo
   */
  async getAgentsByType(type: VirtualAgent['type'], companyId?: string): Promise<VirtualAgent[]> {
    try {
      let query = supabase
        .from('virtual_agents')
        .select('*')
        .eq('type', type)
        .eq('is_active', true);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(agent => ({
        ...agent,
        createdAt: new Date(agent.created_at),
        updatedAt: new Date(agent.updated_at)
      }));
    } catch (error) {
      // TODO: log Error fetching agents by type: error
      return [];
    }
  }

  /**
   * Ejecutar agente de ventas
   */
  async executeSalesAgent(context: SalesAgentContext): Promise<AgentResponse> {
    try {
      const salesAgent = await this.getAgentsByType('SALES')[0];
      if (!salesAgent) {
        throw new Error('Sales agent not found');
      }

      // Analizar requerimientos
      const analysis = await this.analyzeCustomerRequirements(context);
      
      // Calcular precio
      const pricing = await this.calculatePricing(context, analysis);
      
      // Crear línea de tiempo
      const timelineId = await timelineService.createTimeline({
        type: 'PROJECT',
        context: {
          customer: context.customerInfo,
          requirements: context.requirements,
          analysis: analysis,
          pricing: pricing
        },
        expectedEndTime: context.timeline.expectedCompletion,
        companyId: salesAgent.companyId,
        workspaceId: salesAgent.workspaceId,
        subWorkspaceId: salesAgent.subWorkspaceId
      });

      return {
        success: true,
        message: 'Análisis de ventas completado exitosamente',
        data: {
          analysis,
          pricing,
          timelineId
        },
        actions: [
          {
            type: 'VIEW_ANALYSIS',
            label: 'Ver Análisis Completo',
            action: 'OPEN_ANALYSIS',
            parameters: { analysisId: analysis.id }
          },
          {
            type: 'VIEW_PRICING',
            label: 'Ver Propuesta de Precio',
            action: 'OPEN_PRICING',
            parameters: { pricingId: pricing.id }
          },
          {
            type: 'VIEW_TIMELINE',
            label: 'Ver Línea de Tiempo',
            action: 'OPEN_TIMELINE',
            parameters: { timelineId }
          },
          {
            type: 'SCHEDULE_DEMO',
            label: 'Agendar Demo',
            action: 'SCHEDULE_DEMO',
            parameters: { customerId: context.customerInfo.email }
          }
        ]
      };
    } catch (error) {
      // TODO: log Error executing sales agent: error
      return {
        success: false,
        message: 'Error al ejecutar agente de ventas',
        data: { error: error.message }
      };
    }
  }

  /**
   * Ejecutar agente UNITY INK
   */
  async executeUnityInkAgent(context: UnityInkContext): Promise<AgentResponse> {
    try {
      const unityInkAgent = await this.getAgentsByType('UNITY_INK')[0];
      if (!unityInkAgent) {
        throw new Error('UNITY INK agent not found');
      }

      // Analizar proyecto
      const projectAnalysis = await this.analyzeUnityInkProject(context);
      
      // Recomendar productos
      const recommendations = await this.recommendUnityInkProducts(context, projectAnalysis);
      
      // Calcular cantidades y costos
      const calculations = await this.calculateUnityInkQuantities(context, recommendations);
      
      // Crear línea de tiempo
      const timelineId = await timelineService.createTimeline({
        type: 'PROJECT',
        context: {
          project: context,
          analysis: projectAnalysis,
          recommendations: recommendations,
          calculations: calculations
        },
        expectedEndTime: context.timeline.completionDate,
        companyId: unityInkAgent.companyId,
        workspaceId: unityInkAgent.workspaceId,
        subWorkspaceId: unityInkAgent.subWorkspaceId
      });

      return {
        success: true,
        message: 'Análisis de proyecto UNITY INK completado',
        data: {
          projectAnalysis,
          recommendations,
          calculations,
          timelineId
        },
        actions: [
          {
            type: 'VIEW_ANALYSIS',
            label: 'Ver Análisis del Proyecto',
            action: 'OPEN_PROJECT_ANALYSIS',
            parameters: { analysisId: projectAnalysis.id }
          },
          {
            type: 'VIEW_RECOMMENDATIONS',
            label: 'Ver Recomendaciones de Productos',
            action: 'OPEN_RECOMMENDATIONS',
            parameters: { recommendationsId: recommendations.id }
          },
          {
            type: 'VIEW_QUOTE',
            label: 'Ver Cotización',
            action: 'OPEN_QUOTE',
            parameters: { quoteId: calculations.quoteId }
          },
          {
            type: 'VIEW_TIMELINE',
            label: 'Ver Línea de Tiempo del Proyecto',
            action: 'OPEN_TIMELINE',
            parameters: { timelineId }
          }
        ]
      };
    } catch (error) {
      // TODO: log Error executing UNITY INK agent: error
      return {
        success: false,
        message: 'Error al ejecutar agente UNITY INK',
        data: { error: error.message }
      };
    }
  }

  /**
   * Analizar requerimientos del cliente
   */
  private async analyzeCustomerRequirements(context: SalesAgentContext): Promise<any> {
    // Simulación de análisis de requerimientos
    const complexity = this.calculateComplexity(context.requirements);
    const riskLevel = this.assessRiskLevel(context);
    const estimatedTimeline = this.estimateTimeline(context, complexity);

    return {
      id: `analysis_${Date.now()}`,
      complexity,
      riskLevel,
      estimatedTimeline,
      recommendations: this.generateRecommendations(context, complexity),
      technicalRequirements: this.extractTechnicalRequirements(context),
      integrationNeeds: this.analyzeIntegrationNeeds(context)
    };
  }

  /**
   * Calcular precio basado en requerimientos
   */
  private async calculatePricing(context: SalesAgentContext, analysis: any): Promise<any> {
    const basePrice = this.calculateBasePrice(context.requirements);
    const complexityMultiplier = this.getComplexityMultiplier(analysis.complexity);
    const integrationCost = this.calculateIntegrationCost(context.requirements.integrations);
    const supportCost = this.calculateSupportCost(context.customerInfo.size);

    const totalPrice = basePrice * complexityMultiplier + integrationCost + supportCost;

    return {
      id: `pricing_${Date.now()}`,
      basePrice,
      complexityMultiplier,
      integrationCost,
      supportCost,
      totalPrice,
      currency: context.requirements.budget.currency,
      paymentTerms: this.generatePaymentTerms(totalPrice),
      discounts: this.calculateDiscounts(context, totalPrice)
    };
  }

  /**
   * Analizar proyecto UNITY INK
   */
  private async analyzeUnityInkProject(context: UnityInkContext): Promise<any> {
    const technicalRequirements = this.analyzeTechnicalRequirements(context);
    const safetyConsiderations = this.analyzeSafetyRequirements(context);
    const environmentalFactors = this.analyzeEnvironmentalFactors(context);

    return {
      id: `unity_analysis_${Date.now()}`,
      technicalRequirements,
      safetyConsiderations,
      environmentalFactors,
      riskAssessment: this.assessUnityInkRisks(context),
      complianceRequirements: this.getComplianceRequirements(context)
    };
  }

  /**
   * Recomendar productos UNITY INK
   */
  private async recommendUnityInkProducts(context: UnityInkContext, analysis: any): Promise<any> {
    const productRecommendations = this.getProductRecommendations(context, analysis);
    const applicationMethods = this.getApplicationMethods(context);
    const safetyEquipment = this.getSafetyEquipment(context);

    return {
      id: `unity_recommendations_${Date.now()}`,
      products: productRecommendations,
      applicationMethods,
      safetyEquipment,
      technicalSpecifications: this.getTechnicalSpecifications(productRecommendations)
    };
  }

  /**
   * Calcular cantidades y costos UNITY INK
   */
  private async calculateUnityInkQuantities(context: UnityInkContext, recommendations: any): Promise<any> {
    const totalArea = context.quantity.liters * context.quantity.coverage;
    const actualLitersNeeded = this.calculateActualLitersNeeded(context, recommendations);
    const totalCost = this.calculateTotalCost(actualLitersNeeded, recommendations.products);

    return {
      id: `unity_calculations_${Date.now()}`,
      totalArea,
      actualLitersNeeded,
      totalCost,
      quoteId: `quote_${Date.now()}`,
      deliverySchedule: this.generateDeliverySchedule(context),
      applicationSchedule: this.generateApplicationSchedule(context)
    };
  }

  // Métodos auxiliares para cálculos y análisis
  private calculateComplexity(requirements: any): string {
    const factors = [
      requirements.features.length,
      requirements.integrations.length,
      requirements.users,
      requirements.budget.max - requirements.budget.min
    ];
    
    const complexityScore = factors.reduce((sum, factor) => sum + factor, 0);
    
    if (complexityScore < 10) return 'LOW';
    if (complexityScore < 25) return 'MEDIUM';
    if (complexityScore < 50) return 'HIGH';
    return 'VERY_HIGH';
  }

  private assessRiskLevel(context: SalesAgentContext): string {
    const riskFactors = [
      context.customerInfo.size === 'ENTERPRISE' ? 3 : 1,
      context.requirements.budget.max > 100000 ? 2 : 1,
      context.requirements.integrations.length > 5 ? 2 : 1
    ];
    
    const riskScore = riskFactors.reduce((sum, factor) => sum + factor, 0);
    
    if (riskScore <= 3) return 'LOW';
    if (riskScore <= 5) return 'MEDIUM';
    return 'HIGH';
  }

  private estimateTimeline(context: SalesAgentContext, complexity: string): number {
    const baseWeeks = 4;
    const complexityMultipliers = {
      'LOW': 1,
      'MEDIUM': 1.5,
      'HIGH': 2,
      'VERY_HIGH': 3
    };
    
    return Math.ceil(baseWeeks * complexityMultipliers[complexity]);
  }

  private calculateBasePrice(requirements: any): number {
    const basePrice = 5000; // Precio base
    const featureCost = requirements.features.length * 500;
    const userCost = requirements.users * 10;
    
    return basePrice + featureCost + userCost;
  }

  private getComplexityMultiplier(complexity: string): number {
    const multipliers = {
      'LOW': 1,
      'MEDIUM': 1.2,
      'HIGH': 1.5,
      'VERY_HIGH': 2
    };
    
    return multipliers[complexity] || 1;
  }

  private calculateIntegrationCost(integrations: string[]): number {
    return integrations.length * 1000;
  }

  private calculateSupportCost(size: string): number {
    const supportCosts = {
      'SMALL': 500,
      'MEDIUM': 1000,
      'LARGE': 2000,
      'ENTERPRISE': 5000
    };
    
    return supportCosts[size] || 500;
  }

  private generatePaymentTerms(totalPrice: number): any {
    return {
      upfront: totalPrice * 0.3,
      milestone1: totalPrice * 0.3,
      milestone2: totalPrice * 0.3,
      final: totalPrice * 0.1
    };
  }

  private calculateDiscounts(context: SalesAgentContext, totalPrice: number): any {
    const discounts = [];
    
    if (context.customerInfo.size === 'ENTERPRISE') {
      discounts.push({ type: 'ENTERPRISE', percentage: 10, amount: totalPrice * 0.1 });
    }
    
    if (context.requirements.users > 100) {
      discounts.push({ type: 'VOLUME', percentage: 5, amount: totalPrice * 0.05 });
    }
    
    return discounts;
  }

  // Métodos auxiliares para UNITY INK
  private analyzeTechnicalRequirements(context: UnityInkContext): any {
    return {
      surfacePreparation: this.getSurfacePreparation(context.surfaceType),
      applicationMethod: this.getApplicationMethod(context.paintType),
      dryingTime: this.getDryingTime(context.paintType, context.environment),
      coverage: context.quantity.coverage
    };
  }

  private analyzeSafetyRequirements(context: UnityInkContext): any {
    return {
      ppe: this.getRequiredPPE(context.paintType),
      ventilation: this.getVentilationRequirements(context.environment),
      storage: this.getStorageRequirements(context.paintType),
      disposal: this.getDisposalRequirements(context.paintType)
    };
  }

  private analyzeEnvironmentalFactors(context: UnityInkContext): any {
    return {
      temperature: this.getTemperatureRange(context.paintType),
      humidity: this.getHumidityRange(context.paintType),
      uvExposure: context.environment === 'OUTDOOR' ? 'HIGH' : 'LOW',
      chemicalResistance: this.getChemicalResistance(context.paintType)
    };
  }

  private assessUnityInkRisks(context: UnityInkContext): any {
    const risks = [];
    
    if (context.environment === 'CORROSIVE') {
      risks.push({ type: 'CORROSION', level: 'HIGH', mitigation: 'Use epoxy coatings' });
    }
    
    if (context.environment === 'HIGH_TRAFFIC') {
      risks.push({ type: 'WEAR', level: 'MEDIUM', mitigation: 'Use polyurethane topcoat' });
    }
    
    return risks;
  }

  private getComplianceRequirements(context: UnityInkContext): any {
    return {
      environmental: context.environment === 'OUTDOOR' ? ['VOC_LIMITS', 'WEATHER_RESISTANCE'] : [],
      safety: ['MSDS', 'SAFETY_GUIDELINES'],
      quality: ['ISO_STANDARDS', 'QUALITY_CERTIFICATIONS']
    };
  }

  private getProductRecommendations(context: UnityInkContext, analysis: any): any[] {
    const recommendations = [];
    
    // Base coat
    recommendations.push({
      type: 'BASE_COAT',
      product: this.getBaseCoatProduct(context.surfaceType),
      quantity: context.quantity.liters * 0.3,
      application: 'SPRAY_OR_ROLLER'
    });
    
    // Top coat
    recommendations.push({
      type: 'TOP_COAT',
      product: this.getTopCoatProduct(context.paintType, context.environment),
      quantity: context.quantity.liters * 0.7,
      application: 'SPRAY_OR_ROLLER'
    });
    
    return recommendations;
  }

  private getApplicationMethods(context: UnityInkContext): any {
    return {
      primary: context.paintType === 'EPOXY' ? 'SPRAY' : 'ROLLER',
      secondary: 'BRUSH',
      equipment: this.getRequiredEquipment(context.paintType),
      technique: this.getApplicationTechnique(context.surfaceType)
    };
  }

  private getSafetyEquipment(context: UnityInkContext): any[] {
    const equipment = [
      { type: 'RESPIRATOR', model: 'N95_OR_BETTER', required: true },
      { type: 'GLOVES', model: 'CHEMICAL_RESISTANT', required: true },
      { type: 'EYE_PROTECTION', model: 'SAFETY_GOGGLES', required: true }
    ];
    
    if (context.paintType === 'EPOXY') {
      equipment.push({ type: 'COVERALLS', model: 'DISPOSABLE', required: true });
    }
    
    return equipment;
  }

  private getTechnicalSpecifications(products: any[]): any {
    return products.map(product => ({
      product: product.product,
      specifications: this.getProductSpecs(product.product),
      dataSheet: this.getDataSheetUrl(product.product),
      msds: this.getMSDSUrl(product.product)
    }));
  }

  private calculateActualLitersNeeded(context: UnityInkContext, recommendations: any): number {
    const totalArea = context.quantity.liters * context.quantity.coverage;
    const wasteFactor = 1.1; // 10% waste
    const actualCoverage = context.quantity.coverage * 0.9; // 90% efficiency
    
    return Math.ceil((totalArea / actualCoverage) * wasteFactor);
  }

  private calculateTotalCost(litersNeeded: number, products: any[]): number {
    return products.reduce((total, product) => {
      const productPrice = this.getProductPrice(product.product);
      return total + (product.quantity * productPrice);
    }, 0);
  }

  private generateDeliverySchedule(context: UnityInkContext): any {
    const startDate = new Date(context.timeline.startDate);
    return {
      baseCoat: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 días después
      topCoat: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 días después
      equipment: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000) // 1 día después
    };
  }

  private generateApplicationSchedule(context: UnityInkContext): any {
    const startDate = new Date(context.timeline.startDate);
    return {
      surfacePreparation: { start: startDate, duration: 1 },
      baseCoat: { start: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), duration: 1 },
      drying: { start: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), duration: 2 },
      topCoat: { start: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000), duration: 1 },
      finalDrying: { start: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000), duration: 2 }
    };
  }

  // Métodos placeholder para obtener datos específicos de productos
  private getBaseCoatProduct(surfaceType: string): string {
    const products = {
      'METAL': 'UNITY-METAL-PRIMER-01',
      'CONCRETE': 'UNITY-CONCRETE-PRIMER-01',
      'WOOD': 'UNITY-WOOD-PRIMER-01',
      'PLASTIC': 'UNITY-PLASTIC-PRIMER-01'
    };
    return products[surfaceType] || 'UNITY-UNIVERSAL-PRIMER-01';
  }

  private getTopCoatProduct(paintType: string, environment: string): string {
    if (paintType === 'EPOXY') {
      return environment === 'CORROSIVE' ? 'UNITY-EPOXY-CORROSIVE-01' : 'UNITY-EPOXY-STANDARD-01';
    }
    if (paintType === 'POLYURETHANE') {
      return environment === 'HIGH_TRAFFIC' ? 'UNITY-POLY-HIGH-TRAFFIC-01' : 'UNITY-POLY-STANDARD-01';
    }
    return 'UNITY-ACRYLIC-STANDARD-01';
  }

  private getProductPrice(productCode: string): number {
    const prices = {
      'UNITY-METAL-PRIMER-01': 25,
      'UNITY-CONCRETE-PRIMER-01': 20,
      'UNITY-WOOD-PRIMER-01': 22,
      'UNITY-PLASTIC-PRIMER-01': 28,
      'UNITY-EPOXY-CORROSIVE-01': 45,
      'UNITY-EPOXY-STANDARD-01': 35,
      'UNITY-POLY-HIGH-TRAFFIC-01': 40,
      'UNITY-POLY-STANDARD-01': 30,
      'UNITY-ACRYLIC-STANDARD-01': 18
    };
    return prices[productCode] || 25;
  }

  // Métodos placeholder para otros datos técnicos
  private getSurfacePreparation(surfaceType: string): string { return 'Standard preparation'; }
  private getApplicationMethod(paintType: string): string { return 'Spray or roller'; }
  private getDryingTime(paintType: string, environment: string): string { return '4-8 hours'; }
  private getRequiredPPE(paintType: string): string[] { return ['Respirator', 'Gloves', 'Eye protection']; }
  private getVentilationRequirements(environment: string): string { return 'Adequate ventilation required'; }
  private getStorageRequirements(paintType: string): string { return 'Store in cool, dry place'; }
  private getDisposalRequirements(paintType: string): string { return 'Follow local regulations'; }
  private getTemperatureRange(paintType: string): string { return '10-30°C'; }
  private getHumidityRange(paintType: string): string { return '40-70%'; }
  private getChemicalResistance(paintType: string): string { return 'High'; }
  private getRequiredEquipment(paintType: string): string[] { return ['Spray gun', 'Roller', 'Brushes']; }
  private getApplicationTechnique(surfaceType: string): string { return 'Standard technique'; }
  private getProductSpecs(product: string): any { return { coverage: '10m²/l', drying: '4-8h' }; }
  private getDataSheetUrl(product: string): string { return `https://unity-ink.com/datasheet/${product}`; }
  private getMSDSUrl(product: string): string { return `https://unity-ink.com/msds/${product}`; }

  // Métodos para generar recomendaciones
  private generateRecommendations(context: SalesAgentContext, complexity: string): any[] {
    const recommendations = [];
    
    if (complexity === 'HIGH' || complexity === 'VERY_HIGH') {
      recommendations.push({
        type: 'PROJECT_MANAGER',
        description: 'Asignar un Project Manager dedicado',
        priority: 'HIGH'
      });
    }
    
    if (context.requirements.integrations.length > 3) {
      recommendations.push({
        type: 'INTEGRATION_SPECIALIST',
        description: 'Incluir especialista en integraciones',
        priority: 'MEDIUM'
      });
    }
    
    return recommendations;
  }

  private extractTechnicalRequirements(context: SalesAgentContext): any {
    return {
      infrastructure: this.getInfrastructureRequirements(context.requirements),
      security: this.getSecurityRequirements(context.customerInfo.size),
      performance: this.getPerformanceRequirements(context.requirements.users)
    };
  }

  private analyzeIntegrationNeeds(context: SalesAgentContext): any {
    return {
      priority: context.requirements.integrations.length > 5 ? 'HIGH' : 'MEDIUM',
      complexity: this.getIntegrationComplexity(context.requirements.integrations),
      timeline: this.getIntegrationTimeline(context.requirements.integrations)
    };
  }

  // Métodos placeholder para análisis técnico
  private getInfrastructureRequirements(requirements: any): any { return { servers: 'Cloud-based', storage: 'Scalable' }; }
  private getSecurityRequirements(size: string): any { return { level: size === 'ENTERPRISE' ? 'ENTERPRISE' : 'STANDARD' }; }
  private getPerformanceRequirements(users: number): any { return { concurrent: Math.ceil(users * 0.3) }; }
  private getIntegrationComplexity(integrations: string[]): string { return integrations.length > 5 ? 'HIGH' : 'MEDIUM'; }
  private getIntegrationTimeline(integrations: string[]): number { return integrations.length * 2; }
}

// Exportar instancia singleton
export const virtualAgentService = VirtualAgentService.getInstance(); 