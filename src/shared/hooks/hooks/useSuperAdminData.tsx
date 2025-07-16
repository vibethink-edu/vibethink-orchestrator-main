
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface CompanyWithPlan {
  id: string;
  name: string;
  slug: string;
  status: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
  plan_definition_id: string;
  plan_display_name: string;
  plan_base_price: number;
  plan_max_users: number;
  plan_max_ai_requests: number;
  plan_max_scraping_pages: number;
  plan_max_storage_gb: number;
  plan_features: any[];
  custom_max_users: number | null;
  custom_max_monthly_ai_requests: number | null;
  custom_max_monthly_scraping_pages: number | null;
  custom_features: any[] | null;
  effective_max_users: number;
  effective_max_ai_requests: number;
  effective_max_scraping_pages: number;
  effective_max_storage_gb: number;
  effective_features: any[];
  has_overrides: boolean;
  users_override: any | null;
  ai_requests_override: any | null;
  scraping_override: any | null;
  features_override: any | null;
  effective_monthly_cost: number;
}

interface PlanDefinition {
  id: string;
  name: string;
  display_name: string;
  description: string;
  base_price_usd: number;
  max_users: number;
  max_monthly_ai_requests: number;
  max_monthly_scraping_pages: number;
  max_storage_gb: number;
  features: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSuperAdminData = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyWithPlan[]>([]);
  const [planDefinitions, setPlanDefinitions] = useState<PlanDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  // Verificar que el usuario es super admin
  const isSuperAdmin = user?.profile?.role === 'OWNER';

  const fetchCompanies = async () => {
    if (!isSuperAdmin) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_billing_overview')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        plan_features: Array.isArray(item.plan_features) ? item.plan_features : [],
        custom_features: Array.isArray(item.custom_features) ? item.custom_features : null,
        effective_features: Array.isArray(item.effective_features) ? item.effective_features : []
      }));
      
      setCompanies(transformedData);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDefinitions = async () => {
    if (!isSuperAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('plan_definitions')
        .select('*')
        .eq('is_active', true)
        .order('base_price_usd');

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        features: Array.isArray(item.features) ? item.features : []
      }));
      
      setPlanDefinitions(transformedData);
    } catch (error) {
      console.error('Error fetching plan definitions:', error);
      toast.error('Error al cargar definiciones de planes');
    }
  };

  const logPlanChange = async (action: string, companyId: string, details: any, reason?: string) => {
    try {
      await supabase
        .from('configuration_audit_log')
        .insert({
          table_name: 'companies',
          record_id: companyId,
          company_id: companyId,
          action: action,
          new_values: details,
          changed_by: user?.id,
          reason: reason || `Plan ${action.toLowerCase()} by super admin`,
          ip_address: null, // Could be enhanced to capture real IP
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error logging plan change:', error);
    }
  };

  const assignPlanToCompany = async (companyId: string, planName: string, reason?: string) => {
    if (!isSuperAdmin) return;

    try {
      // Log the action before making changes
      await logPlanChange('UPDATE', companyId, { 
        action: 'assign_plan', 
        plan_name: planName,
        timestamp: new Date().toISOString()
      }, reason);

      const { error } = await supabase.rpc('configure_company_plan', {
        p_company_id: companyId,
        p_plan_name: planName
      });

      if (error) throw error;
      
      await fetchCompanies();
      toast.success(`Plan ${planName} asignado exitosamente`);
      
      console.log(`🔄 PLAN ASSIGNMENT LOGGED: Company ${companyId} → Plan ${planName}`);
    } catch (error) {
      console.error('Error assigning plan:', error);
      toast.error('Error al asignar plan');
    }
  };

  const addOverrideToCompany = async (
    companyId: string, 
    overrides: {
      custom_max_users?: number;
      custom_max_monthly_ai_requests?: number;
      custom_max_monthly_scraping_pages?: number;
      custom_features?: any[];
    },
    reason?: string
  ) => {
    if (!isSuperAdmin) return;

    try {
      // Log the override action
      await logPlanChange('UPDATE', companyId, {
        action: 'add_override',
        overrides: overrides,
        timestamp: new Date().toISOString()
      }, reason || 'Override aplicado por super admin');

      const { error } = await supabase
        .from('companies')
        .update({
          ...overrides,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId);

      if (error) throw error;
      
      await fetchCompanies();
      toast.success('Override aplicado exitosamente');
      
      console.log(`⚠️ OVERRIDE APPLIED LOGGED: Company ${companyId}`, overrides);
    } catch (error) {
      console.error('Error adding override:', error);
      toast.error('Error al aplicar override');
    }
  };

  const removeOverrideFromCompany = async (companyId: string, overrideType: string, reason?: string) => {
    if (!isSuperAdmin) return;

    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      
      // Remover el override específico
      switch (overrideType) {
        case 'users':
          updateData.custom_max_users = null;
          break;
        case 'ai_requests':
          updateData.custom_max_monthly_ai_requests = null;
          break;
        case 'scraping':
          updateData.custom_max_monthly_scraping_pages = null;
          break;
        case 'features':
          updateData.custom_features = null;
          break;
      }

      // Log the removal
      await logPlanChange('UPDATE', companyId, {
        action: 'remove_override',
        override_type: overrideType,
        timestamp: new Date().toISOString()
      }, reason || `Override ${overrideType} removido por super admin`);

      const { error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', companyId);

      if (error) throw error;
      
      await fetchCompanies();
      toast.success('Override removido exitosamente');
      
      console.log(`🗑️ OVERRIDE REMOVED LOGGED: Company ${companyId} - Type: ${overrideType}`);
    } catch (error) {
      console.error('Error removing override:', error);
      toast.error('Error al remover override');
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchCompanies();
      fetchPlanDefinitions();
    }
  }, [isSuperAdmin]);

  return {
    companies,
    planDefinitions,
    loading,
    isSuperAdmin,
    assignPlanToCompany,
    addOverrideToCompany,
    removeOverrideFromCompany,
    refetch: () => {
      fetchCompanies();
      fetchPlanDefinitions();
    }
  };
};
