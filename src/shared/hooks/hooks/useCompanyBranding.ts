import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { CompanyCacheManager } from '@/shared/utils/cacheManager';
import { CompanyBranding } from '@/shared/utils/companyIdentification';

/**
 * Hook para cargar branding de empresa con cache optimizado
 * @param companyId - UUID de la empresa
 * @returns { branding, loading, error }
 * 
 * @example
 * const { branding, loading, error } = useCompanyBranding(companyId);
 * // branding = { logoUrl: "...", primaryColor: "#0055A4", ... }
 */
export const useCompanyBranding = (companyId: string) => {
  const [branding, setBranding] = useState<CompanyBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cacheManager = CompanyCacheManager.getInstance();
  
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    
    const loadBranding = async () => {
      try {
        setLoading(true);
        
        const brandingData = await cacheManager.get(
          companyId,
          'branding',
          async () => {
            const { data, error } = await supabase
              .from('company_branding')
              .select('branding_config, custom_locales')
              .eq('company_id', companyId)
              .single();
            
            if (error) {
              throw new Error('Error cargando branding');
            }
            
            return data;
          }
        );
        
        setBranding(brandingData);
      } catch (err) {
        setError('Error cargando configuración de empresa');
        console.error('Error cargando branding:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBranding();
  }, [companyId]);
  
  return { branding, loading, error };
}; 