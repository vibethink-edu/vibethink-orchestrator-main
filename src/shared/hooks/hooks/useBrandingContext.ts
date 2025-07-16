import { useState, useEffect, useCallback } from 'react';
import { useHierarchicalContext, BrandingConfig } from './useHierarchicalContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para gestionar el branding jerárquico
 * Implementa herencia de configuración como Zoho y HubSpot
 */
export const useBrandingContext = () => {
  const { context } = useHierarchicalContext();
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene la configuración de branding con herencia
   * Prioriza: sub_workspace > sub_organization > workspace > organization > platform
   */
  const fetchBrandingConfig = useCallback(async () => {
    if (!context) {
      setBranding(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener configuración usando la función de base de datos
      const { data: brandingData, error: brandingError } = await supabase
        .rpc('get_branding_config', {
          p_platform_id: context.platform_id,
          p_organization_id: context.organization_id,
          p_workspace_id: context.workspace_id,
          p_sub_organization_id: context.sub_organization_id,
          p_sub_workspace_id: context.sub_workspace_id
        });

      if (brandingError) throw brandingError;

      const config: BrandingConfig = {
        logo_url: brandingData?.logo_url,
        primary_color: brandingData?.primary_color,
        secondary_color: brandingData?.secondary_color,
        accent_color: brandingData?.accent_color,
        custom_texts: brandingData?.custom_texts || {},
        default_language: brandingData?.default_language || 'es',
        supported_languages: brandingData?.supported_languages || ['es', 'en']
      };

      setBranding(config);

    } catch (err) {
      console.error('Error fetching branding config:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [context]);

  /**
   * Actualiza la configuración de branding
   */
  const updateBrandingConfig = useCallback(async (updates: Partial<BrandingConfig>) => {
    if (!context) return;

    try {
      setLoading(true);
      setError(null);

      // Determinar el contexto para la actualización
      const updateData = {
        platform_id: context.platform_id,
        organization_id: context.organization_id,
        workspace_id: context.workspace_id,
        sub_organization_id: context.sub_organization_id,
        sub_workspace_id: context.sub_workspace_id,
        ...updates
      };

      // Buscar configuración existente
      const { data: existingConfig } = await supabase
        .from('branding_configs')
        .select('id')
        .eq('platform_id', context.platform_id)
        .eq('organization_id', context.organization_id || null)
        .eq('workspace_id', context.workspace_id || null)
        .eq('sub_organization_id', context.sub_organization_id || null)
        .eq('sub_workspace_id', context.sub_workspace_id || null)
        .single();

      if (existingConfig) {
        // Actualizar configuración existente
        const { error: updateError } = await supabase
          .from('branding_configs')
          .update(updates)
          .eq('id', existingConfig.id);

        if (updateError) throw updateError;
      } else {
        // Crear nueva configuración
        const { error: insertError } = await supabase
          .from('branding_configs')
          .insert([updateData]);

        if (insertError) throw insertError;
      }

      // Refrescar configuración
      await fetchBrandingConfig();

    } catch (err) {
      console.error('Error updating branding config:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [context, fetchBrandingConfig]);

  /**
   * Obtiene un texto personalizado con fallback
   */
  const getCustomText = useCallback((key: string, defaultValue: string = '') => {
    if (!branding) return defaultValue;
    return branding.custom_texts[key] || defaultValue;
  }, [branding]);

  /**
   * Aplica estilos CSS personalizados
   */
  const getCustomStyles = useCallback(() => {
    if (!branding) return {};

    return {
      '--primary-color': branding.primary_color || '#3b82f6',
      '--secondary-color': branding.secondary_color || '#64748b',
      '--accent-color': branding.accent_color || '#f59e0b',
    } as React.CSSProperties;
  }, [branding]);

  /**
   * Obtiene el idioma actual
   */
  const getCurrentLanguage = useCallback(() => {
    if (!branding) return 'es';
    return branding.default_language;
  }, [branding]);

  /**
   * Verifica si un idioma está soportado
   */
  const isLanguageSupported = useCallback((language: string) => {
    if (!branding) return false;
    return branding.supported_languages.includes(language);
  }, [branding]);

  // Cargar configuración al montar el componente
  useEffect(() => {
    fetchBrandingConfig();
  }, [fetchBrandingConfig]);

  return {
    branding,
    loading,
    error,
    updateBrandingConfig,
    getCustomText,
    getCustomStyles,
    getCurrentLanguage,
    isLanguageSupported,
    refreshBranding: fetchBrandingConfig
  };
};

/**
 * Hook para obtener el branding actual de forma simplificada
 */
export const useCurrentBranding = () => {
  const { branding, loading } = useBrandingContext();
  
  return {
    currentBranding: branding,
    isLoading: loading,
    hasCustomBranding: Boolean(
      branding?.logo_url || 
      branding?.primary_color || 
      branding?.secondary_color || 
      branding?.accent_color ||
      Object.keys(branding?.custom_texts || {}).length > 0
    )
  };
}; 