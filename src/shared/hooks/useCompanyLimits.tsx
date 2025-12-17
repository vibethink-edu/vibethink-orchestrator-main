/**
 * Company Limits Hook
 * 
 * Provides company plan and limits management
 * - Plan definitions and limits
 * - Usage tracking
 * - Plan configuration
 * 
 * @author AI Pair Platform
 * @version 2.1.0
 */

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

// Plan definition interface
export interface PlanDefinition {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  limits: {
    users: number;
    companies: number;
    storage: number; // in GB
    apiCalls: number;
    aiTokens: number;
    integrations: number;
  };
  features: string[];
  isActive: boolean;
}

// Company plan interface
export interface CompanyPlan {
  companyId: string;
  planId: string;
  startDate: string;
  endDate: string;
  customLimits?: Partial<PlanDefinition['limits']>;
  usage: {
    users: number;
    storage: number;
    apiCalls: number;
    aiTokens: number;
  };
}

// Hook interface
interface UseCompanyLimitsReturn {
  plans: PlanDefinition[];
  companyPlan: CompanyPlan | null;
  usage: CompanyPlan['usage'] | null;
  isLoading: boolean;
  error: string | null;
  getPlanDefinitions: () => Promise<void>;
  configureCompanyPlan: (companyId: string, planId: string, customLimits?: Partial<PlanDefinition['limits']>) => Promise<void>;
  updateUsage: (companyId: string, usage: Partial<CompanyPlan['usage']>) => Promise<void>;
  checkLimit: (limit: keyof PlanDefinition['limits']) => boolean;
  getRemainingLimit: (limit: keyof PlanDefinition['limits']) => number;
}

/**
 * Company Limits Hook
 */
export const useCompanyLimits = (): UseCompanyLimitsReturn => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlanDefinition[]>([]);
  const [companyPlan, setCompanyPlan] = useState<CompanyPlan | null>(null);
  const [usage, setUsage] = useState<CompanyPlan['usage'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default plans
  const defaultPlans: PlanDefinition[] = [
    {
      id: 'free',
      name: 'Gratuito',
      description: 'Plan básico para pequeñas empresas',
      price: 0,
      currency: 'USD',
      limits: {
        users: 5,
        companies: 1,
        storage: 1,
        apiCalls: 1000,
        aiTokens: 10000,
        integrations: 2
      },
      features: ['Acceso básico', 'Soporte por email'],
      isActive: true
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Plan para empresas en crecimiento',
      price: 29,
      currency: 'USD',
      limits: {
        users: 25,
        companies: 3,
        storage: 10,
        apiCalls: 10000,
        aiTokens: 100000,
        integrations: 5
      },
      features: ['Todo del plan gratuito', 'Soporte prioritario', 'Analytics básicos'],
      isActive: true
    },
    {
      id: 'professional',
      name: 'Profesional',
      description: 'Plan para empresas establecidas',
      price: 99,
      currency: 'USD',
      limits: {
        users: 100,
        companies: 10,
        storage: 100,
        apiCalls: 100000,
        aiTokens: 1000000,
        integrations: 15
      },
      features: ['Todo del plan Starter', 'Soporte 24/7', 'Analytics avanzados', 'Integraciones premium'],
      isActive: true
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Plan para grandes organizaciones',
      price: 299,
      currency: 'USD',
      limits: {
        users: 1000,
        companies: 100,
        storage: 1000,
        apiCalls: 1000000,
        aiTokens: 10000000,
        integrations: 50
      },
      features: ['Todo del plan Profesional', 'Soporte dedicado', 'SLA garantizado', 'Personalización completa'],
      isActive: true
    }
  ];

  // Get plan definitions
  const getPlanDefinitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch from API
      // For now, we'll use default plans
      setPlans(defaultPlans);
      
      // If user has a company, fetch their plan
      if (user?.company?.id) {
        // Mock company plan - in real implementation, fetch from database
        const mockCompanyPlan: CompanyPlan = {
          companyId: user.company.id,
          planId: 'starter',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          usage: {
            users: 8,
            storage: 2.5,
            apiCalls: 2500,
            aiTokens: 25000
          }
        };
        
        setCompanyPlan(mockCompanyPlan);
        setUsage(mockCompanyPlan.usage);
      }
    } catch (err) {
      setError('Error al cargar los planes');
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    } finally {
      setIsLoading(false);
    }
  }, [user?.company?.id]);

  // Configure company plan
  const configureCompanyPlan = useCallback(async (
    companyId: string, 
    planId: string, 
    customLimits?: Partial<PlanDefinition['limits']>
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      const newCompanyPlan: CompanyPlan = {
        companyId,
        planId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        customLimits,
        usage: {
          users: 0,
          storage: 0,
          apiCalls: 0,
          aiTokens: 0
        }
      };

      setCompanyPlan(newCompanyPlan);
      setUsage(newCompanyPlan.usage);
      
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    } catch (err) {
      setError('Error al configurar el plan');
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    } finally {
      setIsLoading(false);
    }
  }, [plans]);

  // Update usage
  const updateUsage = useCallback(async (
    companyId: string, 
    newUsage: Partial<CompanyPlan['usage']>
  ) => {
    if (!companyPlan || companyPlan.companyId !== companyId) return;

    setUsage(prev => prev ? { ...prev, ...newUsage } : null);
    
    // In real implementation, this would update the database
    // TODO: log en cada punto donde había console.log, console.error o console.warn
  }, [companyPlan]);

  // Check if a limit is exceeded
  const checkLimit = useCallback((limit: keyof PlanDefinition['limits']): boolean => {
    if (!companyPlan || !usage) return false;
    
    const plan = plans.find(p => p.id === companyPlan.planId);
    if (!plan) return false;
    
    const currentUsage = usage[limit as keyof CompanyPlan['usage']] || 0;
    const limitValue = companyPlan.customLimits?.[limit] || plan.limits[limit];
    
    return currentUsage >= limitValue;
  }, [companyPlan, usage, plans]);

  // Get remaining limit
  const getRemainingLimit = useCallback((limit: keyof PlanDefinition['limits']): number => {
    if (!companyPlan || !usage) return 0;
    
    const plan = plans.find(p => p.id === companyPlan.planId);
    if (!plan) return 0;
    
    const currentUsage = usage[limit as keyof CompanyPlan['usage']] || 0;
    const limitValue = companyPlan.customLimits?.[limit] || plan.limits[limit];
    
    return Math.max(0, limitValue - currentUsage);
  }, [companyPlan, usage, plans]);

  // Initialize plans on mount
  useMemo(() => {
    if (plans.length === 0) {
      getPlanDefinitions();
    }
  }, [plans.length, getPlanDefinitions]);

  return {
    plans,
    companyPlan,
    usage,
    isLoading,
    error,
    getPlanDefinitions,
    configureCompanyPlan,
    updateUsage,
    checkLimit,
    getRemainingLimit
  };
};

// Export individual hooks for backward compatibility
export const usePlanDefinitions = () => {
  const { plans, isLoading, error, getPlanDefinitions } = useCompanyLimits();
  return { plans, isLoading, error, getPlanDefinitions };
};

export const useConfigureCompanyPlan = () => {
  const { configureCompanyPlan } = useCompanyLimits();
  return { configureCompanyPlan };
}; 
