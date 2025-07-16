
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/useAuth';
import { useSuperAdmin } from '@/shared/hooks/useSuperAdmin';

interface PlatformConfiguration {
  id: string;
  category: string;
  config_key: string;
  config_value: any;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CompanyOverride {
  id: string;
  company_id: string;
  category: string;
  config_key: string;
  override_value: any;
  reason: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  companies?: {
    name: string;
    slug: string;
  };
}

interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  company_id: string | null;
  action: string;
  old_values: any;
  new_values: any;
  changed_at: string;
  reason: string | null;
  user_profiles?: {
    full_name: string;
    email: string;
  };
  companies?: {
    name: string;
    slug: string;
  } | null;
}

export const usePlatformConfigurations = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useSuperAdmin();
  const queryClient = useQueryClient();

  // Only fetch if user is super admin
  const shouldFetch = isSuperAdmin;

  // Fetch all platform configurations
  const { data: configurations, isLoading: configurationsLoading } = useQuery({
    queryKey: ['platform-configurations'],
    queryFn: async () => {
      if (!shouldFetch) return [];
      
      console.log('🔧 Fetching platform configurations...');
      const { data, error } = await supabase
        .from('platform_configurations')
        .select('*')
        .order('category', { ascending: true })
        .order('config_key', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching platform configurations:', error);
        throw error;
      }
      
      console.log('✅ Platform configurations loaded:', data?.length || 0);
      return data as PlatformConfiguration[];
    },
    enabled: shouldFetch,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Fetch company overrides
  const { data: overrides, isLoading: overridesLoading } = useQuery({
    queryKey: ['company-overrides'],
    queryFn: async () => {
      if (!shouldFetch) return [];
      
      console.log('🔧 Fetching company overrides...');
      const { data, error } = await supabase
        .from('company_configuration_overrides')
        .select(`
          *,
          companies(name, slug)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching company overrides:', error);
        throw error;
      }
      
      console.log('✅ Company overrides loaded:', data?.length || 0);
      return data as CompanyOverride[];
    },
    enabled: shouldFetch,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Fetch audit log
  const { data: auditLog, isLoading: auditLoading } = useQuery({
    queryKey: ['configuration-audit-log'],
    queryFn: async () => {
      if (!shouldFetch) return [];
      
      console.log('🔧 Fetching audit log...');
      const { data, error } = await supabase
        .from('configuration_audit_log')
        .select(`
          *,
          user_profiles(full_name, email),
          companies(name, slug)
        `)
        .order('changed_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching audit log:', error);
        // Don't throw error for audit log, just return empty array
        return [];
      }
      
      console.log('✅ Audit log loaded:', data?.length || 0);
      
      // Transform data to match our interface with proper null handling
      return (data || []).map(item => {
        const companies = item.companies;
        return {
          ...item,
          companies: companies !== null && 
                     typeof companies === 'object' && 
                     companies &&
                     'name' in companies && 
                     'slug' in companies
            ? companies as { name: string; slug: string }
            : null
        };
      }) as AuditLogEntry[];
    },
    enabled: shouldFetch,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Update platform configuration
  const updateConfigurationMutation = useMutation({
    mutationFn: async ({
      category,
      config_key,
      config_value,
      description,
      reason
    }: {
      category: string;
      config_key: string;
      config_value: any;
      description: string;
      reason?: string;
    }) => {
      const { data, error } = await supabase.rpc('upsert_platform_configuration', {
        p_category: category,
        p_config_key: config_key,
        p_config_value: JSON.stringify(config_value),
        p_description: description,
        p_user_id: user?.id,
        p_reason: reason
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-configurations'] });
      queryClient.invalidateQueries({ queryKey: ['configuration-audit-log'] });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: (error) => {
      console.error('Error updating configuration:', error);
      toast.error('Error al actualizar la configuración');
    }
  });

  // Delete platform configuration
  const deleteConfigurationMutation = useMutation({
    mutationFn: async (configId: string) => {
      const { error } = await supabase
        .from('platform_configurations')
        .update({ is_active: false })
        .eq('id', configId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-configurations'] });
      queryClient.invalidateQueries({ queryKey: ['configuration-audit-log'] });
      toast.success('Configuración eliminada exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting configuration:', error);
      toast.error('Error al eliminar la configuración');
    }
  });

  // Create company override
  const createOverrideMutation = useMutation({
    mutationFn: async ({
      company_id,
      category,
      config_key,
      override_value,
      reason,
      expires_at
    }: {
      company_id: string;
      category: string;
      config_key: string;
      override_value: any;
      reason: string;
      expires_at?: string;
    }) => {
      const { data, error } = await supabase.rpc('create_company_override', {
        p_company_id: company_id,
        p_category: category,
        p_config_key: config_key,
        p_override_value: JSON.stringify(override_value),
        p_reason: reason,
        p_expires_at: expires_at || null,
        p_user_id: user?.id
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-overrides'] });
      queryClient.invalidateQueries({ queryKey: ['configuration-audit-log'] });
      toast.success('Override creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating override:', error);
      toast.error('Error al crear el override');
    }
  });

  // Delete override
  const deleteOverrideMutation = useMutation({
    mutationFn: async (overrideId: string) => {
      const { error } = await supabase
        .from('company_configuration_overrides')
        .update({ is_active: false })
        .eq('id', overrideId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-overrides'] });
      queryClient.invalidateQueries({ queryKey: ['configuration-audit-log'] });
      toast.success('Override eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting override:', error);
      toast.error('Error al eliminar el override');
    }
  });

  return {
    configurations,
    overrides,
    auditLog,
    loading: configurationsLoading || overridesLoading || auditLoading,
    updateConfiguration: updateConfigurationMutation.mutate,
    deleteConfiguration: deleteConfigurationMutation.mutate,
    createOverride: createOverrideMutation.mutate,
    deleteOverride: deleteOverrideMutation.mutate,
    isUpdating: updateConfigurationMutation.isPending,
    isDeleting: deleteConfigurationMutation.isPending,
    isCreatingOverride: createOverrideMutation.isPending,
    isDeletingOverride: deleteOverrideMutation.isPending
  };
};
