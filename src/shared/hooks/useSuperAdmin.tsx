/**
 * Super Admin Hook
 * 
 * Hook para verificar si el usuario es super admin
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useAuth } from './useAuth';

export const useSuperAdmin = () => {
  const { user } = useAuth();
  
  const isSuperAdmin = user?.email === 'admin@VibeThink.co' || user?.role === 'SUPER_ADMIN';
  
  return {
    isSuperAdmin,
    canAccessAllCompanies: isSuperAdmin,
    canManagePlatform: isSuperAdmin
  };
}; 