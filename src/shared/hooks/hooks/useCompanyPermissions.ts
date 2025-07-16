import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { CompanyCacheManager } from '@/shared/utils/cacheManager';

/**
 * Interfaz para permisos de empresa
 */
export interface CompanyPermissions {
  [module: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    customFields?: string[];
    modules?: string[];
  };
}

/**
 * Hook para verificar permisos de usuario en empresa específica
 * @param companyId - UUID de la empresa
 * @param userId - UUID del usuario
 * @returns { permissions, loading, error }
 */
export const useCompanyPermissions = (companyId: string, userId: string) => {
  const [permissions, setPermissions] = useState<CompanyPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cacheManager = CompanyCacheManager.getInstance();
  
  useEffect(() => {
    if (!companyId || !userId) {
      setLoading(false);
      return;
    }
    
    const loadPermissions = async () => {
      try {
        setLoading(true);
        
        const permissionsData = await cacheManager.get(
          `${companyId}_${userId}`,
          'permissions',
          async () => {
            // Obtener rol del usuario
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', userId)
              .eq('company_id', companyId)
              .single();
            
            if (userError) {
              throw new Error('Error obteniendo rol de usuario');
            }
            
            // Obtener permisos del rol
            const { data, error } = await supabase
              .from('company_permissions')
              .select('permissions')
              .eq('company_id', companyId)
              .eq('role_name', userData.role);
            
            if (error) {
              throw new Error('Error cargando permisos');
            }
            
            return data?.[0]?.permissions || {};
          }
        );
        
        setPermissions(permissionsData);
      } catch (err) {
        console.error('Error cargando permisos:', err);
        setPermissions({});
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, [companyId, userId]);
  
  return { permissions, loading, error };
}; 