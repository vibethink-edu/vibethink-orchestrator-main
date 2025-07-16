/**
 * Hook para manejar acceso comercial especial
 * 
 * Proporciona funcionalidades específicas para el departamento comercial
 * de VibeThink, incluyendo acceso a todas las empresas y herramientas
 * de dimensionamiento.
 * 
 * @author VibeThink Platform - Core Team
 * @version 1.0.0
 */

import { useAuth } from './useAuth';
import { useDepartments } from './useDepartments';
import { useMemo } from 'react';

export interface SalesPermissions {
  canAccessAllCompanies: boolean;
  canCreateRequirementAnalysis: boolean;
  canGenerateProposals: boolean;
  canConfigurePlans: boolean;
  canAccessAIDimensioning: boolean;
  canManageSalesPipeline: boolean;
  canViewCompetitorAnalysis: boolean;
  canCreateImplementationRoadmaps: boolean;
}

export interface SalesAccess {
  hasSalesAccess: boolean;
  canAccessAllCompanies: boolean;
  salesPermissions: SalesPermissions;
  isVibeThinkCompany: boolean;
  salesDepartmentId?: string;
}

/**
 * Hook para verificar acceso comercial especial
 * 
 * @returns SalesAccess - Información sobre acceso comercial
 */
export const useSalesAccess = (): SalesAccess => {
  const { user, company } = useAuth();
  const { departments, userDepartments } = useDepartments();

  const salesAccess = useMemo(() => {
    if (!user || !company) {
      return {
        hasSalesAccess: false,
        canAccessAllCompanies: false,
        salesPermissions: getEmptySalesPermissions(),
        isVibeThinkCompany: false
      };
    }

    // Verificar si es empresa VibeThink
    if (company && company.name) {
      return company.name === 'VibeThink Labs';
    }

    // Verificar si el usuario pertenece al departamento comercial
    const salesDepartment = userDepartments.find(dept => 
      dept.department_code === 'SALES' && 
      dept.company_id === company.id &&
      dept.is_active
    );

    const hasSalesAccess = !!salesDepartment;

    // Solo VibeThink puede acceder a todas las empresas
    const canAccessAllCompanies = hasSalesAccess && isVibeThinkCompany;

    // Obtener permisos comerciales
    const salesPermissions = hasSalesAccess ? getSalesPermissions(salesDepartment) : getEmptySalesPermissions();

    return {
      hasSalesAccess,
      canAccessAllCompanies,
      salesPermissions,
      isVibeThinkCompany,
      salesDepartmentId: salesDepartment?.id
    };
  }, [user, company, departments, userDepartments]);

  return salesAccess;
};

/**
 * Obtener permisos comerciales basados en el rol en el departamento
 */
function getSalesPermissions(salesDepartment?: any): SalesPermissions {
  if (!salesDepartment) {
    return getEmptySalesPermissions();
  }

  const role = salesDepartment.role_in_department;
  
  // Permisos base para todos los miembros del departamento comercial
  const basePermissions: SalesPermissions = {
    canAccessAllCompanies: true,
    canCreateRequirementAnalysis: true,
    canGenerateProposals: true,
    canConfigurePlans: true,
    canAccessAIDimensioning: true,
    canManageSalesPipeline: true,
    canViewCompetitorAnalysis: true,
    canCreateImplementationRoadmaps: true
  };

  // Permisos adicionales según el rol
  switch (role) {
    case 'ADMIN':
      return {
        ...basePermissions,
        // Permisos adicionales para admin
      };
    
    case 'MANAGER':
      return {
        ...basePermissions,
        // Permisos adicionales para manager
      };
    
    case 'LEAD':
      return {
        ...basePermissions,
        // Permisos adicionales para lead
      };
    
    case 'MEMBER':
    default:
      return basePermissions;
  }
}

/**
 * Obtener permisos vacíos
 */
function getEmptySalesPermissions(): SalesPermissions {
  return {
    canAccessAllCompanies: false,
    canCreateRequirementAnalysis: false,
    canGenerateProposals: false,
    canConfigurePlans: false,
    canAccessAIDimensioning: false,
    canManageSalesPipeline: false,
    canViewCompetitorAnalysis: false,
    canCreateImplementationRoadmaps: false
  };
}

/**
 * Hook para verificar si el usuario puede acceder a una empresa específica
 * 
 * @param targetCompanyId - ID de la empresa objetivo
 * @returns boolean - Si puede acceder
 */
export const useCanAccessCompany = (targetCompanyId: string): boolean => {
  const { canAccessAllCompanies, isVibeThinkCompany } = useSalesAccess();
  
  // Si es VibeThink y tiene acceso comercial, puede acceder a todas las empresas
  if (canAccessAllCompanies && isVibeThinkCompany) {
    return true;
  }
  
  // Para otros casos, usar lógica estándar de permisos
  return false;
};

/**
 * Hook para obtener empresas accesibles para el comercial
 * 
 * @returns string[] - Array de IDs de empresas accesibles
 */
export const useAccessibleCompanies = (): string[] => {
  const { canAccessAllCompanies, isVibeThinkCompany } = useSalesAccess();
  
  if (canAccessAllCompanies && isVibeThinkCompany) {
    // TODO: Implementar lógica para obtener todas las empresas
    // Por ahora retorna array vacío
    return [];
  }
  
  return [];
}; 