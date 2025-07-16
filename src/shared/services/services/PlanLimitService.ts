import { supabase } from '@/integrations/supabase/client';

// Tipos para planes y límites
export interface PlanLimit {
  id: string;
  planId: string;
  feature: string;
  limit: number;
  currentUsage: number;
  resetPeriod: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'NEVER';
  lastReset: Date;
  nextReset: Date;
  isActive: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  features: PlanFeature[];
  isActive: boolean;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeature {
  name: string;
  limit: number; // 0 = no disponible, N = cantidad disponible
  description: string;
  category: 'CORE' | 'ADVANCED' | 'PREMIUM' | 'ENTERPRISE';
  unit?: string; // 'users', 'projects', 'gb', etc.
}

export interface CustomPlanRequest {
  companyId: string;
  requirements: {
    users: number;
    projects: number;
    storage: number;
    integrations: number;
    customFeatures: string[];
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    startDate: Date;
    duration: number; // meses
  };
}

export interface CustomPlanCalculation {
  recommendedPlan: Plan;
  estimatedPrice: number;
  features: PlanFeature[];
  savings: number;
  recommendations: string[];
  timeline: {
    implementation: number; // semanas
    onboarding: number; // semanas
  };
}

/**
 * Servicio para Gestión de Planes y Límites Numéricos
 */
export class PlanLimitService {
  private static instance: PlanLimitService;
  private plans: Map<string, Plan> = new Map();
  private limits: Map<string, PlanLimit[]> = new Map();

  private constructor() {
    this.initializePlans();
  }

  public static getInstance(): PlanLimitService {
    if (!PlanLimitService.instance) {
      PlanLimitService.instance = new PlanLimitService();
    }
    return PlanLimitService.instance;
  }

  /**
   * Inicializar planes por defecto
   */
  private async initializePlans(): Promise<void> {
    try {
      // Verificar si ya existen planes
      const { data: existingPlans } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true);

      if (!existingPlans || existingPlans.length === 0) {
        await this.createDefaultPlans();
      } else {
        // Cargar planes existentes en memoria
        existingPlans.forEach(plan => {
          this.plans.set(plan.id, {
            ...plan,
            createdAt: new Date(plan.created_at),
            updatedAt: new Date(plan.updated_at)
          });
        });
      }
    } catch (error) {
      // TODO: log Error initializing plans: error
    }
  }

  /**
   * Crear planes por defecto
   */
  private async createDefaultPlans(): Promise<void> {
    const defaultPlans = [
      {
        name: 'STARTER',
        description: 'Perfecto para pequeñas empresas que comienzan',
        price: 29,
        currency: 'USD',
        billingCycle: 'MONTHLY' as const,
        features: [
          { name: 'users', limit: 5, description: 'Usuarios activos', category: 'CORE' as const, unit: 'users' },
          { name: 'projects', limit: 10, description: 'Proyectos activos', category: 'CORE' as const, unit: 'projects' },
          { name: 'storage', limit: 10, description: 'Almacenamiento', category: 'CORE' as const, unit: 'gb' },
          { name: 'integrations', limit: 3, description: 'Integraciones', category: 'CORE' as const, unit: 'integrations' },
          { name: 'timelines', limit: 50, description: 'Líneas de tiempo', category: 'CORE' as const, unit: 'timelines' },
          { name: 'ai_agents', limit: 1, description: 'Agentes AI', category: 'CORE' as const, unit: 'agents' },
          { name: 'support', limit: 0, description: 'Soporte por email', category: 'CORE' as const },
          { name: 'analytics', limit: 0, description: 'Analytics básicos', category: 'CORE' as const },
          { name: 'custom_branding', limit: 0, description: 'Branding personalizado', category: 'ADVANCED' as const },
          { name: 'api_access', limit: 0, description: 'Acceso a API', category: 'ADVANCED' as const },
          { name: 'white_label', limit: 0, description: 'White label', category: 'PREMIUM' as const },
          { name: 'dedicated_support', limit: 0, description: 'Soporte dedicado', category: 'PREMIUM' as const }
        ]
      },
      {
        name: 'PROFESSIONAL',
        description: 'Para empresas en crecimiento con necesidades avanzadas',
        price: 99,
        currency: 'USD',
        billingCycle: 'MONTHLY' as const,
        features: [
          { name: 'users', limit: 25, description: 'Usuarios activos', category: 'CORE' as const, unit: 'users' },
          { name: 'projects', limit: 50, description: 'Proyectos activos', category: 'CORE' as const, unit: 'projects' },
          { name: 'storage', limit: 100, description: 'Almacenamiento', category: 'CORE' as const, unit: 'gb' },
          { name: 'integrations', limit: 10, description: 'Integraciones', category: 'CORE' as const, unit: 'integrations' },
          { name: 'timelines', limit: 200, description: 'Líneas de tiempo', category: 'CORE' as const, unit: 'timelines' },
          { name: 'ai_agents', limit: 3, description: 'Agentes AI', category: 'CORE' as const, unit: 'agents' },
          { name: 'support', limit: 1, description: 'Soporte prioritario', category: 'CORE' as const },
          { name: 'analytics', limit: 1, description: 'Analytics avanzados', category: 'CORE' as const },
          { name: 'custom_branding', limit: 1, description: 'Branding personalizado', category: 'ADVANCED' as const },
          { name: 'api_access', limit: 1, description: 'Acceso a API', category: 'ADVANCED' as const },
          { name: 'white_label', limit: 0, description: 'White label', category: 'PREMIUM' as const },
          { name: 'dedicated_support', limit: 0, description: 'Soporte dedicado', category: 'PREMIUM' as const }
        ]
      },
      {
        name: 'ENTERPRISE',
        description: 'Para grandes empresas con necesidades complejas',
        price: 299,
        currency: 'USD',
        billingCycle: 'MONTHLY' as const,
        features: [
          { name: 'users', limit: 100, description: 'Usuarios activos', category: 'CORE' as const, unit: 'users' },
          { name: 'projects', limit: 200, description: 'Proyectos activos', category: 'CORE' as const, unit: 'projects' },
          { name: 'storage', limit: 500, description: 'Almacenamiento', category: 'CORE' as const, unit: 'gb' },
          { name: 'integrations', limit: 25, description: 'Integraciones', category: 'CORE' as const, unit: 'integrations' },
          { name: 'timelines', limit: 1000, description: 'Líneas de tiempo', category: 'CORE' as const, unit: 'timelines' },
          { name: 'ai_agents', limit: 10, description: 'Agentes AI', category: 'CORE' as const, unit: 'agents' },
          { name: 'support', limit: 1, description: 'Soporte 24/7', category: 'CORE' as const },
          { name: 'analytics', limit: 1, description: 'Analytics empresariales', category: 'CORE' as const },
          { name: 'custom_branding', limit: 1, description: 'Branding personalizado', category: 'ADVANCED' as const },
          { name: 'api_access', limit: 1, description: 'Acceso completo a API', category: 'ADVANCED' as const },
          { name: 'white_label', limit: 1, description: 'White label', category: 'PREMIUM' as const },
          { name: 'dedicated_support', limit: 1, description: 'Soporte dedicado', category: 'PREMIUM' as const }
        ]
      },
      {
        name: 'CUSTOM',
        description: 'Plan personalizado según tus necesidades específicas',
        price: 0,
        currency: 'USD',
        billingCycle: 'MONTHLY' as const,
        features: [],
        isCustom: true
      }
    ];

    for (const planData of defaultPlans) {
      await this.createPlan(planData);
    }
  }

  /**
   * Crear un nuevo plan
   */
  async createPlan(planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert({
          name: planData.name,
          description: planData.description,
          price: planData.price,
          currency: planData.currency,
          billing_cycle: planData.billingCycle,
          features: planData.features,
          is_active: planData.isActive,
          is_custom: planData.isCustom
        })
        .select('id')
        .single();

      if (error) throw error;

      // Agregar a memoria
      const newPlan: Plan = {
        ...planData,
        id: data.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.plans.set(data.id, newPlan);

      return data.id;
    } catch (error) {
      // TODO: log Error creating plan: error
      throw new Error('Failed to create plan');
    }
  }

  /**
   * Obtener plan por ID
   */
  async getPlan(planId: string): Promise<Plan | null> {
    try {
      // Buscar en memoria primero
      if (this.plans.has(planId)) {
        return this.plans.get(planId)!;
      }

      // Buscar en base de datos
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;

      if (data) {
        const plan: Plan = {
          ...data,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        this.plans.set(planId, plan);
        return plan;
      }

      return null;
    } catch (error) {
      // TODO: log Error fetching plan: error
      return null;
    }
  }

  /**
   * Obtener todos los planes activos
   */
  async getActivePlans(): Promise<Plan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => ({
        ...plan,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      }));
    } catch (error) {
      // TODO: log Error fetching active plans: error
      return [];
    }
  }

  /**
   * Obtener límites de una empresa
   */
  async getCompanyLimits(companyId: string): Promise<PlanLimit[]> {
    try {
      // Buscar en memoria primero
      if (this.limits.has(companyId)) {
        return this.limits.get(companyId)!;
      }

      // Buscar en base de datos
      const { data, error } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true);

      if (error) throw error;

      const limits = (data || []).map(limit => ({
        ...limit,
        lastReset: new Date(limit.last_reset),
        nextReset: new Date(limit.next_reset)
      }));

      // Guardar en memoria
      this.limits.set(companyId, limits);

      return limits;
    } catch (error) {
      // TODO: log Error fetching company limits: error
      return [];
    }
  }

  /**
   * Verificar si una empresa puede usar una característica
   */
  async canUseFeature(companyId: string, feature: string): Promise<boolean> {
    try {
      const limits = await this.getCompanyLimits(companyId);
      const limit = limits.find(l => l.feature === feature);

      if (!limit) {
        // Si no hay límite definido, permitir uso
        return true;
      }

      // Verificar si el límite se ha reseteado
      if (new Date() >= limit.nextReset) {
        await this.resetLimit(companyId, feature);
        return true;
      }

      return limit.currentUsage < limit.limit;
    } catch (error) {
      // TODO: log Error checking feature usage: error
      return false;
    }
  }

  /**
   * Incrementar uso de una característica
   */
  async incrementUsage(companyId: string, feature: string, amount: number = 1): Promise<boolean> {
    try {
      const canUse = await this.canUseFeature(companyId, feature);
      if (!canUse) {
        return false;
      }

      const { data, error } = await supabase
        .from('plan_limits')
        .update({ current_usage: supabase.raw(`current_usage + ${amount}`) })
        .eq('company_id', companyId)
        .eq('feature', feature)
        .eq('is_active', true);

      if (error) throw error;

      // Actualizar en memoria
      const limits = this.limits.get(companyId) || [];
      const limitIndex = limits.findIndex(l => l.feature === feature);
      if (limitIndex !== -1) {
        limits[limitIndex].currentUsage += amount;
        this.limits.set(companyId, limits);
      }

      return true;
    } catch (error) {
      // TODO: log Error incrementing usage: error
      return false;
    }
  }

  /**
   * Resetear límite
   */
  async resetLimit(companyId: string, feature: string): Promise<void> {
    try {
      const limits = await this.getCompanyLimits(companyId);
      const limit = limits.find(l => l.feature === feature);

      if (!limit) return;

      const nextReset = this.calculateNextReset(limit.resetPeriod);

      const { error } = await supabase
        .from('plan_limits')
        .update({
          current_usage: 0,
          last_reset: new Date().toISOString(),
          next_reset: nextReset.toISOString()
        })
        .eq('company_id', companyId)
        .eq('feature', feature)
        .eq('is_active', true);

      if (error) throw error;

      // Actualizar en memoria
      const memoryLimits = this.limits.get(companyId) || [];
      const limitIndex = memoryLimits.findIndex(l => l.feature === feature);
      if (limitIndex !== -1) {
        memoryLimits[limitIndex].currentUsage = 0;
        memoryLimits[limitIndex].lastReset = new Date();
        memoryLimits[limitIndex].nextReset = nextReset;
        this.limits.set(companyId, memoryLimits);
      }
    } catch (error) {
      // TODO: log Error resetting limit: error
    }
  }

  /**
   * Calcular próximo reset
   */
  private calculateNextReset(resetPeriod: string): Date {
    const now = new Date();
    
    switch (resetPeriod) {
      case 'MONTHLY':
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
      case 'QUARTERLY':
        return new Date(now.getFullYear(), now.getMonth() + 3, 1);
      case 'YEARLY':
        return new Date(now.getFullYear() + 1, 0, 1);
      case 'NEVER':
        return new Date(now.getFullYear() + 100, 0, 1); // Prácticamente nunca
      default:
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
  }

  /**
   * Calcular plan personalizado
   */
  async calculateCustomPlan(request: CustomPlanRequest): Promise<CustomPlanCalculation> {
    try {
      // Analizar requerimientos
      const analysis = this.analyzeCustomRequirements(request);
      
      // Encontrar plan base más cercano
      const basePlan = this.findClosestBasePlan(request);
      
      // Calcular precio personalizado
      const estimatedPrice = this.calculateCustomPrice(request, basePlan);
      
      // Generar características personalizadas
      const features = this.generateCustomFeatures(request, basePlan);
      
      // Calcular ahorros
      const savings = this.calculateSavings(request, estimatedPrice);
      
      // Generar recomendaciones
      const recommendations = this.generateCustomRecommendations(request, analysis);
      
      // Calcular timeline
      const timeline = this.calculateCustomTimeline(request, analysis);

      return {
        recommendedPlan: {
          ...basePlan,
          id: 'custom',
          name: 'CUSTOM',
          description: 'Plan personalizado según tus necesidades',
          price: estimatedPrice,
          features: features,
          isCustom: true
        },
        estimatedPrice,
        features,
        savings,
        recommendations,
        timeline
      };
    } catch (error) {
      // TODO: log Error calculating custom plan: error
      throw new Error('Failed to calculate custom plan');
    }
  }

  /**
   * Analizar requerimientos personalizados
   */
  private analyzeCustomRequirements(request: CustomPlanRequest): any {
    const complexity = this.calculateComplexity(request.requirements);
    const riskLevel = this.assessRiskLevel(request);
    const scalability = this.assessScalability(request.requirements);

    return {
      complexity,
      riskLevel,
      scalability,
      totalRequirements: this.calculateTotalRequirements(request.requirements)
    };
  }

  /**
   * Encontrar plan base más cercano
   */
  private findClosestBasePlan(request: CustomPlanRequest): Plan {
    const activePlans = Array.from(this.plans.values()).filter(p => !p.isCustom);
    
    // Calcular puntuación para cada plan
    const planScores = activePlans.map(plan => {
      const score = this.calculatePlanScore(plan, request.requirements);
      return { plan, score };
    });

    // Retornar el plan con mejor puntuación
    return planScores.sort((a, b) => b.score - a.score)[0].plan;
  }

  /**
   * Calcular puntuación de plan
   */
  private calculatePlanScore(plan: Plan, requirements: any): number {
    let score = 0;
    
    // Comparar usuarios
    const userFeature = plan.features.find(f => f.name === 'users');
    if (userFeature && userFeature.limit >= requirements.users) {
      score += 10;
    }

    // Comparar proyectos
    const projectFeature = plan.features.find(f => f.name === 'projects');
    if (projectFeature && projectFeature.limit >= requirements.projects) {
      score += 10;
    }

    // Comparar almacenamiento
    const storageFeature = plan.features.find(f => f.name === 'storage');
    if (storageFeature && storageFeature.limit >= requirements.storage) {
      score += 10;
    }

    // Comparar integraciones
    const integrationFeature = plan.features.find(f => f.name === 'integrations');
    if (integrationFeature && integrationFeature.limit >= requirements.integrations) {
      score += 10;
    }

    // Penalizar por características no utilizadas
    const unusedFeatures = plan.features.filter(f => 
      !['users', 'projects', 'storage', 'integrations'].includes(f.name)
    ).length;
    score -= unusedFeatures * 2;

    return score;
  }

  /**
   * Calcular precio personalizado
   */
  private calculateCustomPrice(request: CustomPlanRequest, basePlan: Plan): number {
    const basePrice = basePlan.price;
    const requirements = request.requirements;
    
    // Factores de multiplicación por característica
    const multipliers = {
      users: requirements.users > 100 ? 1.5 : 1.2,
      projects: requirements.projects > 200 ? 1.4 : 1.1,
      storage: requirements.storage > 500 ? 1.3 : 1.1,
      integrations: requirements.integrations > 25 ? 1.4 : 1.2
    };

    // Calcular precio base ajustado
    let adjustedPrice = basePrice;
    
    if (requirements.users > 100) {
      adjustedPrice *= multipliers.users;
    }
    
    if (requirements.projects > 200) {
      adjustedPrice *= multipliers.projects;
    }
    
    if (requirements.storage > 500) {
      adjustedPrice *= multipliers.storage;
    }
    
    if (requirements.integrations > 25) {
      adjustedPrice *= multipliers.integrations;
    }

    // Descuento por volumen
    if (request.timeline.duration >= 12) {
      adjustedPrice *= 0.8; // 20% descuento anual
    } else if (request.timeline.duration >= 6) {
      adjustedPrice *= 0.9; // 10% descuento semestral
    }

    return Math.round(adjustedPrice);
  }

  /**
   * Generar características personalizadas
   */
  private generateCustomFeatures(request: CustomPlanRequest, basePlan: Plan): PlanFeature[] {
    const features = [...basePlan.features];

    // Ajustar límites según requerimientos
    features.forEach(feature => {
      switch (feature.name) {
        case 'users':
          feature.limit = Math.max(feature.limit, request.requirements.users);
          break;
        case 'projects':
          feature.limit = Math.max(feature.limit, request.requirements.projects);
          break;
        case 'storage':
          feature.limit = Math.max(feature.limit, request.requirements.storage);
          break;
        case 'integrations':
          feature.limit = Math.max(feature.limit, request.requirements.integrations);
          break;
      }
    });

    // Agregar características personalizadas
    if (request.requirements.customFeatures.length > 0) {
      request.requirements.customFeatures.forEach(customFeature => {
        features.push({
          name: customFeature,
          limit: 1,
          description: `Característica personalizada: ${customFeature}`,
          category: 'ENTERPRISE'
        });
      });
    }

    return features;
  }

  /**
   * Calcular ahorros
   */
  private calculateSavings(request: CustomPlanRequest, estimatedPrice: number): number {
    const monthlyPrice = estimatedPrice;
    const annualPrice = monthlyPrice * 12;
    const standardAnnualPrice = 299 * 12; // Precio Enterprise anual
    
    return Math.max(0, standardAnnualPrice - annualPrice);
  }

  /**
   * Generar recomendaciones personalizadas
   */
  private generateCustomRecommendations(request: CustomPlanRequest, analysis: any): string[] {
    const recommendations = [];

    if (analysis.complexity === 'HIGH') {
      recommendations.push('Considerar implementación por fases para reducir riesgos');
    }

    if (request.requirements.users > 50) {
      recommendations.push('Implementar capacitación de usuarios antes del lanzamiento');
    }

    if (request.requirements.integrations.length > 10) {
      recommendations.push('Asignar un especialista en integraciones dedicado');
    }

    if (request.timeline.duration < 3) {
      recommendations.push('Considerar extender el timeline para una implementación más segura');
    }

    return recommendations;
  }

  /**
   * Calcular timeline personalizado
   */
  private calculateCustomTimeline(request: CustomPlanRequest, analysis: any): any {
    const baseImplementationWeeks = 4;
    const baseOnboardingWeeks = 2;

    // Ajustar según complejidad
    const complexityMultiplier = {
      'LOW': 1,
      'MEDIUM': 1.5,
      'HIGH': 2,
      'VERY_HIGH': 3
    };

    const implementation = Math.ceil(baseImplementationWeeks * complexityMultiplier[analysis.complexity]);
    const onboarding = Math.ceil(baseOnboardingWeeks * complexityMultiplier[analysis.complexity]);

    return {
      implementation,
      onboarding
    };
  }

  // Métodos auxiliares para análisis
  private calculateComplexity(requirements: any): string {
    const factors = [
      requirements.users > 100 ? 3 : requirements.users > 50 ? 2 : 1,
      requirements.projects > 200 ? 3 : requirements.projects > 100 ? 2 : 1,
      requirements.storage > 500 ? 2 : 1,
      requirements.integrations > 25 ? 3 : requirements.integrations > 10 ? 2 : 1,
      requirements.customFeatures.length > 0 ? 2 : 1
    ];
    
    const complexityScore = factors.reduce((sum, factor) => sum + factor, 0);
    
    if (complexityScore <= 5) return 'LOW';
    if (complexityScore <= 8) return 'MEDIUM';
    if (complexityScore <= 11) return 'HIGH';
    return 'VERY_HIGH';
  }

  private assessRiskLevel(request: CustomPlanRequest): string {
    const riskFactors = [
      request.requirements.users > 200 ? 3 : request.requirements.users > 100 ? 2 : 1,
      request.requirements.integrations.length > 20 ? 2 : 1,
      request.timeline.duration < 3 ? 2 : 1,
      request.budget.max > 100000 ? 1 : 2
    ];
    
    const riskScore = riskFactors.reduce((sum, factor) => sum + factor, 0);
    
    if (riskScore <= 4) return 'LOW';
    if (riskScore <= 6) return 'MEDIUM';
    return 'HIGH';
  }

  private assessScalability(requirements: any): string {
    if (requirements.users > 200 || requirements.projects > 500) return 'HIGH';
    if (requirements.users > 100 || requirements.projects > 200) return 'MEDIUM';
    return 'LOW';
  }

  private calculateTotalRequirements(requirements: any): number {
    return requirements.users + requirements.projects + requirements.storage + requirements.integrations;
  }

  /**
   * Obtener estadísticas de uso de una empresa
   */
  async getUsageStatistics(companyId: string): Promise<any> {
    try {
      const limits = await this.getCompanyLimits(companyId);
      
      const statistics = {
        totalFeatures: limits.length,
        featuresInUse: limits.filter(l => l.currentUsage > 0).length,
        featuresNearLimit: limits.filter(l => l.currentUsage >= l.limit * 0.8).length,
        featuresAtLimit: limits.filter(l => l.currentUsage >= l.limit).length,
        usageBreakdown: limits.map(limit => ({
          feature: limit.feature,
          current: limit.currentUsage,
          limit: limit.limit,
          percentage: Math.round((limit.currentUsage / limit.limit) * 100),
          nextReset: limit.nextReset
        }))
      };

      return statistics;
    } catch (error) {
      // TODO: log Error getting usage statistics: error
      return null;
    }
  }

  /**
   * Obtener alertas de límites
   */
  async getLimitAlerts(companyId: string): Promise<any[]> {
    try {
      const limits = await this.getCompanyLimits(companyId);
      const alerts = [];

      for (const limit of limits) {
        const usagePercentage = (limit.currentUsage / limit.limit) * 100;
        
        if (usagePercentage >= 100) {
          alerts.push({
            type: 'LIMIT_REACHED',
            feature: limit.feature,
            message: `Has alcanzado el límite de ${limit.feature}`,
            severity: 'CRITICAL',
            current: limit.currentUsage,
            limit: limit.limit
          });
        } else if (usagePercentage >= 80) {
          alerts.push({
            type: 'LIMIT_WARNING',
            feature: limit.feature,
            message: `Estás cerca del límite de ${limit.feature} (${Math.round(usagePercentage)}%)`,
            severity: 'WARNING',
            current: limit.currentUsage,
            limit: limit.limit
          });
        }
      }

      return alerts;
    } catch (error) {
      // TODO: log Error getting limit alerts: error
      return [];
    }
  }
}

// Exportar instancia singleton
export const planLimitService = PlanLimitService.getInstance(); 