
import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyLimits {
  max_users: number;
  max_monthly_ai_requests: number;
  max_monthly_scraping_pages: number;
  max_storage_gb: number;
  features: string[];
}

export interface PlanDefinition {
  id: string;
  name: string;
  display_name: string;
  description: string;
  base_price_usd: number;
  max_users: number;
  max_monthly_ai_requests: number;
  max_monthly_scraping_pages: number;
  max_storage_gb: number;
  features: string[];
  is_active: boolean;
}

// Helper function to safely parse features
const parseFeatures = (features: any): string[] => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const useCompanyLimits = () => {
  const { user } = useAuth();
  const [limits, setLimits] = useState<CompanyLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLimits = async () => {
      if (!user?.company?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_company_limits', {
          p_company_id: user.company.id
        });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const limitData = data[0];
          
          setLimits({
            ...limitData,
            features: parseFeatures(limitData.features)
          });
        }
      } catch (err) {
        console.error('Error fetching company limits:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, [user?.company?.id]);

  return { limits, loading, error };
};

export const usePlanDefinitions = () => {
  const [plans, setPlans] = useState<PlanDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plan_definitions')
          .select('*')
          .eq('is_active', true)
          .order('base_price_usd', { ascending: true });

        if (error) {
          throw error;
        }

        const planData = (data || []).map(plan => ({
          ...plan,
          features: parseFeatures(plan.features)
        }));

        setPlans(planData);
      } catch (err) {
        console.error('Error fetching plan definitions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

export const useConfigureCompanyPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configurePlan = async (
    companyId: string,
    planName: string,
    customLimits?: {
      maxUsers?: number;
      maxMonthlyAiRequests?: number;
      maxMonthlyScrapingPages?: number;
      customFeatures?: string[];
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('configure_company_plan', {
        p_company_id: companyId,
        p_plan_name: planName,
        p_custom_max_users: customLimits?.maxUsers || null,
        p_custom_max_monthly_ai_requests: customLimits?.maxMonthlyAiRequests || null,
        p_custom_max_monthly_scraping_pages: customLimits?.maxMonthlyScrapingPages || null,
        p_custom_features: customLimits?.customFeatures ? JSON.stringify(customLimits.customFeatures) : null
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error configuring company plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { configurePlan, loading, error };
};
