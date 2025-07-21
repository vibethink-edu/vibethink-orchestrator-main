import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Contexto jerárquico de organizaciones
 * Basado en las mejores prácticas de Zoho y HubSpot
 */
export interface HierarchicalContext {
  platform_id: string;
  organization_id?: string;
  workspace_id?: string;
  sub_organization_id?: string;
  sub_workspace_id?: string;
  role: string;
  permissions: string[];
  branding: BrandingConfig;
}

export interface BrandingConfig {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  custom_texts: Record<string, string>;
  default_language: string;
  supported_languages: string[];
}

/**
 * Hook para gestionar el contexto jerárquico de organizaciones
 * Implementa el patrón de Zoho/HubSpot para manejo de clientes anidados
 */
export const useHierarchicalContext = () => {
  const { user } = useAuth();
  const [context, setContext] = useState<HierarchicalContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene el contexto completo del usuario
   * Prioriza el contexto más específico disponible
   */
  const fetchUserContext = useCallback(async () => {
    if (!user) {
      setContext(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener contexto del usuario usando la función de base de datos
      const { data: contextData, error: contextError } = await supabase
        .rpc('get_user_context', { user_uuid: user.id });

      if (contextError) throw contextError;

      if (!contextData || contextData.length === 0) {
        setContext(null);
        setLoading(false);
        return;
      }

      const userContext = contextData[0];

      // Obtener configuración de branding
      const { data: brandingData, error: brandingError } = await supabase
        .rpc('get_branding_config', {
          p_platform_id: userContext.platform_id,
          p_organization_id: userContext.organization_id,
          p_workspace_id: userContext.workspace_id,
          p_sub_organization_id: userContext.sub_organization_id,
          p_sub_workspace_id: userContext.sub_workspace_id
        });

      if (brandingError) throw brandingError;

      const branding: BrandingConfig = {
        logo_url: brandingData?.logo_url,
        primary_color: brandingData?.primary_color,
        secondary_color: brandingData?.secondary_color,
        accent_color: brandingData?.accent_color,
        custom_texts: brandingData?.custom_texts || {},
        default_language: brandingData?.default_language || 'es',
        supported_languages: brandingData?.supported_languages || ['es', 'en']
      };

      setContext({
        platform_id: userContext.platform_id,
        organization_id: userContext.organization_id,
        workspace_id: userContext.workspace_id,
        sub_organization_id: userContext.sub_organization_id,
        sub_workspace_id: userContext.sub_workspace_id,
        role: userContext.role,
        permissions: userContext.permissions || [],
        branding
      });

    } catch (err) {
      // TODO: log error fetching hierarchical context
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Determina el nivel de contexto actual
   */
  const getContextLevel = useCallback(() => {
    if (!context) return 'none';

    if (context.sub_workspace_id) return 'sub_workspace';
    if (context.sub_organization_id) return 'sub_organization';
    if (context.workspace_id) return 'workspace';
    if (context.organization_id) return 'organization';
    if (context.platform_id) return 'platform';

    return 'none';
  }, [context]);

  /**
   * Verifica si el usuario tiene acceso a un contexto específico
   */
  const hasContextAccess = useCallback((
    targetPlatformId?: string,
    targetOrganizationId?: string,
    targetWorkspaceId?: string,
    targetSubOrganizationId?: string,
    targetSubWorkspaceId?: string
  ) => {
    if (!context) return false;

    // SUPER_ADMIN_AP tiene acceso a todo
    if (context.role === 'SUPER_ADMIN_AP') return true;

    // Verificar acceso jerárquico
    if (targetPlatformId && context.platform_id !== targetPlatformId) return false;
    if (targetOrganizationId && context.organization_id !== targetOrganizationId) return false;
    if (targetWorkspaceId && context.workspace_id !== targetWorkspaceId) return false;
    if (targetSubOrganizationId && context.sub_organization_id !== targetSubOrganizationId) return false;
    if (targetSubWorkspaceId && context.sub_workspace_id !== targetSubWorkspaceId) return false;

    return true;
  }, [context]);

  /**
   * Obtiene el contexto padre del contexto actual
   */
  const getParentContext = useCallback(() => {
    if (!context) return null;

    const level = getContextLevel();
    
    switch (level) {
      case 'sub_workspace':
        return {
          platform_id: context.platform_id,
          organization_id: context.organization_id,
          sub_organization_id: context.sub_organization_id
        };
      case 'sub_organization':
        return {
          platform_id: context.platform_id,
          organization_id: context.organization_id
        };
      case 'workspace':
        return {
          platform_id: context.platform_id,
          organization_id: context.organization_id
        };
      case 'organization':
        return {
          platform_id: context.platform_id
        };
      default:
        return null;
    }
  }, [context, getContextLevel]);

  /**
   * Obtiene la ruta completa del contexto
   */
  const getConteVTKath = useCallback(() => {
    if (!context) return [];

    const path = [];
    
    if (context.platform_id) path.push({ level: 'platform', id: context.platform_id });
    if (context.organization_id) path.push({ level: 'organization', id: context.organization_id });
    if (context.workspace_id) path.push({ level: 'workspace', id: context.workspace_id });
    if (context.sub_organization_id) path.push({ level: 'sub_organization', id: context.sub_organization_id });
    if (context.sub_workspace_id) path.push({ level: 'sub_workspace', id: context.sub_workspace_id });

    return path;
  }, [context]);

  /**
   * Obtiene el nombre del contexto actual
   */
  const getContextName = useCallback(async () => {
    if (!context) return '';

    const level = getContextLevel();
    
    try {
      switch (level) {
        case 'platform':
          const { data: platformData } = await supabase
            .from('platforms')
            .select('name')
            .eq('id', context.platform_id)
            .single();
          return platformData?.name || '';
          
        case 'organization':
          const { data: orgData } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', context.organization_id)
            .single();
          return orgData?.name || '';
          
        case 'workspace':
          const { data: wsData } = await supabase
            .from('workspaces')
            .select('name')
            .eq('id', context.workspace_id)
            .single();
          return wsData?.name || '';
          
        case 'sub_organization':
          const { data: subOrgData } = await supabase
            .from('sub_organizations')
            .select('name')
            .eq('id', context.sub_organization_id)
            .single();
          return subOrgData?.name || '';
          
        case 'sub_workspace':
          const { data: subWsData } = await supabase
            .from('sub_workspaces')
            .select('name')
            .eq('id', context.sub_workspace_id)
            .single();
          return subWsData?.name || '';
          
        default:
          return '';
      }
    } catch (err) {
      // TODO: log error getting context name
      return '';
    }
  }, [context, getContextLevel]);

  /**
   * Refresca el contexto
   */
  const refreshContext = useCallback(() => {
    fetchUserContext();
  }, [fetchUserContext]);

  // Cargar contexto al montar el componente
  useEffect(() => {
    fetchUserContext();
  }, [fetchUserContext]);

  return {
    context,
    loading,
    error,
    getContextLevel,
    hasContextAccess,
    getParentContext,
    getConteVTKath,
    getContextName,
    refreshContext
  };
};

/**
 * Hook para obtener el contexto actual de forma simplificada
 */
export const useCurrentContext = () => {
  const { context, loading } = useHierarchicalContext();
  
  return {
    currentContext: context,
    isLoading: loading,
    isPlatformLevel: context?.platform_id && !context?.organization_id,
    isOrganizationLevel: context?.organization_id && !context?.workspace_id,
    isWorkspaceLevel: context?.workspace_id,
    isSubOrganizationLevel: context?.sub_organization_id && !context?.sub_workspace_id,
    isSubWorkspaceLevel: context?.sub_workspace_id
  };
}; 