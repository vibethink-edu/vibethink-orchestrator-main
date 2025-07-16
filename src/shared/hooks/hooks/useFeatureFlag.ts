/**
 * Hook para gestión de feature flags
 * Sistema de liberación controlada inspirado en Mercado Libre y HubSpot
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { FeatureFlag, FeatureEvaluation, RuleContext } from '@/shared/types/release-orchestration';

interface UseFeatureFlagOptions {
  autoRefresh?: boolean;
  cacheTime?: number;
}

interface UseFeatureFlagReturn {
  isEnabled: boolean;
  isLoading: boolean;
  error: Error | null;
  flag: FeatureFlag | null;
  evaluation: FeatureEvaluation | null;
  
  // Métricas
  usageCount: number;
  errorRate: number;
  adoptionRate: number;
  
  // Acciones
  trackUsage: (action: string, metadata?: Record<string, any>) => Promise<void>;
  provideFeedback: (rating: number, comment?: string) => Promise<void>;
}

export const useFeatureFlag = (
  flagName: string, 
  options: UseFeatureFlagOptions = {}
): UseFeatureFlagReturn => {
  const { user, company } = useAuth();
  const queryClient = useQueryClient();
  
  const {
    autoRefresh = true,
    cacheTime = 5 * 60 * 1000 // 5 minutos
  } = options;

  // Query para obtener feature flag
  const {
    data: flag,
    isLoading: flagLoading,
    error: flagError,
    refetch: refetchFlag
  } = useQuery({
    queryKey: ['feature-flag', flagName],
    queryFn: async (): Promise<FeatureFlag | null> => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('name', flagName)
        .single();

      if (error) {
        console.error('Error fetching feature flag:', error);
        return null;
      }

      return data;
    },
    enabled: !!flagName,
    staleTime: cacheTime,
    cacheTime: cacheTime * 2
  });

  // Evaluación de feature flag
  const {
    data: evaluation,
    isLoading: evaluationLoading,
    error: evaluationError
  } = useQuery({
    queryKey: ['feature-evaluation', flagName, user?.id, company?.id],
    queryFn: async (): Promise<FeatureEvaluation | null> => {
      if (!flag || !user || !company) return null;

      return await evaluateFeatureFlag(flag, {
        userId: user.id,
        companyId: company.id,
        role: user.role,
        plan: company.plan_type,
        region: company.region,
        timestamp: new Date()
      });
    },
    enabled: !!flag && !!user && !!company,
    staleTime: cacheTime,
    cacheTime: cacheTime * 2
  });

  // Mutación para tracking de uso
  const trackUsageMutation = useMutation({
    mutationFn: async ({ action, metadata }: { action: string; metadata?: Record<string, any> }) => {
      if (!flag || !user || !company) return;

      const { error } = await supabase
        .from('feature_usage')
        .insert({
          feature_flag_id: flag.id,
          user_id: user.id,
          company_id: company.id,
          action,
          metadata: metadata || {}
        });

      if (error) {
        console.error('Error tracking feature usage:', error);
      }
    }
  });

  // Mutación para feedback
  const feedbackMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment?: string }) => {
      if (!flag || !user || !company) return;

      const { error } = await supabase
        .from('feature_feedback')
        .insert({
          feature_flag_id: flag.id,
          user_id: user.id,
          company_id: company.id,
          rating,
          comment,
          category: 'general'
        });

      if (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  });

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (autoRefresh && flag) {
      const interval = setInterval(() => {
        refetchFlag();
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [autoRefresh, flag, refetchFlag]);

  // Determinar si la feature está habilitada
  const isEnabled = useCallback(() => {
    if (!flag || !evaluation) return false;
    
    // Verificar si la feature está habilitada globalmente
    if (!flag.enabled) return false;
    
    // Verificar si hay una evaluación específica
    if (evaluation && !evaluation.enabled) return false;
    
    // Verificar rollout percentage
    if (flag.rollout_percentage < 100) {
      // Implementar lógica de rollout basada en user/company ID
      const hash = simpleHash(`${user?.id}-${company?.id}`);
      const userPercentage = hash % 100;
      return userPercentage < flag.rollout_percentage;
    }
    
    return true;
  }, [flag, evaluation, user?.id, company?.id]);

  // Función para tracking de uso
  const trackUsage = useCallback(async (action: string, metadata?: Record<string, any>) => {
    await trackUsageMutation.mutateAsync({ action, metadata });
  }, [trackUsageMutation]);

  // Función para feedback
  const provideFeedback = useCallback(async (rating: number, comment?: string) => {
    await feedbackMutation.mutateAsync({ rating, comment });
  }, [feedbackMutation]);

  return {
    isEnabled: isEnabled(),
    isLoading: flagLoading || evaluationLoading,
    error: flagError || evaluationError,
    flag,
    evaluation,
    
    // Métricas
    usageCount: flag?.metrics?.usage_count || 0,
    errorRate: flag?.metrics?.error_rate || 0,
    adoptionRate: flag?.metrics?.adoption_rate || 0,
    
    // Acciones
    trackUsage,
    provideFeedback
  };
};

// Hook para múltiples feature flags
export const useFeatureFlags = (flagNames: string[]) => {
  const results = flagNames.map(name => useFeatureFlag(name));
  
  return {
    flags: results,
    isLoading: results.some(r => r.isLoading),
    error: results.find(r => r.error)?.error || null,
    isEnabled: (flagName: string) => {
      const flag = results.find(r => r.flag?.name === flagName);
      return flag?.isEnabled || false;
    }
  };
};

// Función de evaluación de feature flag
async function evaluateFeatureFlag(
  flag: FeatureFlag, 
  context: RuleContext
): Promise<FeatureEvaluation> {
  try {
    // Verificar condiciones básicas
    if (!flag.enabled) {
      return { enabled: false, reason: 'Feature disabled globally' };
    }

    // Verificar fechas
    const now = new Date();
    if (flag.start_date && now < new Date(flag.start_date)) {
      return { enabled: false, reason: 'Feature not yet available' };
    }
    
    if (flag.end_date && now > new Date(flag.end_date)) {
      return { enabled: false, reason: 'Feature expired' };
    }

    // Verificar planes
    if (flag.target_plans.length > 0 && context.plan) {
      if (!flag.target_plans.includes(context.plan as any)) {
        return { enabled: false, reason: 'Plan not supported' };
      }
    }

    // Verificar roles
    if (flag.target_roles.length > 0 && context.role) {
      if (!flag.target_roles.includes(context.role as any)) {
        return { enabled: false, reason: 'Role not supported' };
      }
    }

    // Verificar empresas específicas
    if (flag.target_companies.length > 0 && context.companyId) {
      if (!flag.target_companies.includes(context.companyId)) {
        return { enabled: false, reason: 'Company not in target list' };
      }
    }

    // Verificar regiones
    if (flag.target_regions.length > 0 && context.region) {
      if (!flag.target_regions.includes(context.region)) {
        return { enabled: false, reason: 'Region not supported' };
      }
    }

    // Si pasa todas las verificaciones, está habilitado
    return { 
      enabled: true, 
      reason: 'Feature enabled for this user/company',
      performance_impact: flag.metrics?.performance_impact || 0,
      risk_level: 'low'
    };

  } catch (error) {
    console.error('Error evaluating feature flag:', error);
    return { 
      enabled: false, 
      reason: 'Error evaluating feature flag',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Función simple de hash para determinar rollout
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
} 