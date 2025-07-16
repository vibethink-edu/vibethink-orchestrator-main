import { useAuth } from '../useAuth';

/**
 * Hook para verificar si el usuario actual es Super Admin
 * 
 * @returns {object} Objeto con información de Super Admin
 */
export function useSuperAdmin() {
  const { user } = useAuth();
  
  // Verificar si el usuario tiene rol de SUPER_ADMIN
  const isSuperAdmin = user?.user_metadata?.role === 'SUPER_ADMIN' || 
                      user?.email === 'superadmin@aipari.co' ||
                      user?.app_metadata?.role === 'SUPER_ADMIN';
  
  // También verificar si es parte de la empresa VibeThink-platform
  const isVibeThinkPlatform = user?.user_metadata?.company_slug === 'VibeThink-platform' ||
                          user?.app_metadata?.company_slug === 'VibeThink-platform';
  
  return { 
    isSuperAdmin: isSuperAdmin && isVibeThinkPlatform,
    user,
    canAccessAllCompanies: isSuperAdmin && isVibeThinkPlatform,
    canManageSupport: isSuperAdmin && isVibeThinkPlatform
  };
} 