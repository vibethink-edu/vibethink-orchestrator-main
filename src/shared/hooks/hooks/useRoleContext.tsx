/**
 * Role Context Hook
 * 
 * Manages role switching functionality for SUPER_ADMIN_AP users
 * Allows SUPER_ADMIN_AP to temporarily switch between different roles
 * while maintaining their original SUPER_ADMIN_AP identity
 * 
 * @author AI Pair Platform - Authentication Team
 * @version 2.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

type UserRole = 'EMPLOYEE_CUST' | 'MANAGER_CUST' | 'ADMIN_CUST' | 'OWNER_CUST' | 'SUPER_ADMIN_AP' | 'SUPPORT_AP' | 'ADMIN_AP' | 'TECH_LEAD_AP' | 'DEVELOPER_AP' | 'MANAGER_AP' | 'EMPLOYEE_AP';

interface RoleContextType {
  /** Original role from database (never changes) */
  originalRole: UserRole | null;
  /** Current active role (can be switched by SUPER_ADMIN_AP) */
  currentRole: UserRole | null;
  /** Whether user can switch roles (only SUPER_ADMIN_AP) */
  canSwitchRoles: boolean;
  /** Whether user is currently in a switched role */
  isInSwitchedMode: boolean;
  /** Function to switch to a different role */
  switchToRole: (role: UserRole) => void;
  /** Function to return to original role */
  returnToOriginalRole: () => void;
  /** Check if user has permission for a specific role */
  hasPermission: (requiredRole: UserRole) => boolean;
  /** Get display name for current context */
  getRoleDisplayName: () => string;
  /** Check if current role is an AI Pair role */
  isVibeThinkRole: boolean;
  /** Check if current role is a customer role */
  isCustomerRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [originalRole, setOriginalRole] = useState<UserRole | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  // Set original role when user changes
  useEffect(() => {
    if (user?.role) {
      setOriginalRole(user.role as UserRole);
      setCurrentRole(user.role as UserRole);
    }
  }, [user?.role]);

  const canSwitchRoles = originalRole === 'SUPER_ADMIN_AP';
  const isInSwitchedMode = currentRole !== originalRole;

  const switchToRole = (role: UserRole) => {
    if (!canSwitchRoles) return;
    
    setCurrentRole(role);
    sessionStorage.setItem('switched_role', role);
  };

  const returnToOriginalRole = () => {
    if (!canSwitchRoles) return;
    
    setCurrentRole(originalRole);
    sessionStorage.removeItem('switched_role');
  };

  /**
   * Check if current role has permission for required role
   */
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!currentRole) return false;

    // Role hierarchy (higher roles include lower role permissions)
    const roleHierarchy: Record<UserRole, number> = {
      'EMPLOYEE_CUST': 1,
      'MANAGER_CUST': 2,
      'ADMIN_CUST': 3,
      'OWNER_CUST': 4,
      'EMPLOYEE_AP': 5,
      'MANAGER_AP': 6,
      'DEVELOPER_AP': 7,
      'TECH_LEAD_AP': 8,
      'ADMIN_AP': 9,
      'SUPPORT_AP': 10,
      'SUPER_ADMIN_AP': 11
    };

    const currentLevel = roleHierarchy[currentRole];
    const requiredLevel = roleHierarchy[requiredRole];

    // Special case: SUPPORT_AP has limited permissions
    if (currentRole === 'SUPPORT_AP') {
      return requiredRole === 'SUPPORT_AP' || requiredRole === 'EMPLOYEE_CUST';
    }

    return currentLevel >= requiredLevel;
  };

  /**
   * Get display name for current role context
   */
  const getRoleDisplayName = (): string => {
    if (!currentRole) return 'Usuario';

    const roleNames: Record<UserRole, string> = {
      'EMPLOYEE_AP': 'Empleado AI Pair',
      'MANAGER_AP': 'Manager AI Pair',
      'DEVELOPER_AP': 'Desarrollador AI Pair',
      'TECH_LEAD_AP': 'Líder Técnico AI Pair',
      'ADMIN_AP': 'Administrador AI Pair',
      'SUPPORT_AP': 'Soporte Técnico AI Pair',
      'SUPER_ADMIN_AP': 'Super Admin AI Pair',
      'EMPLOYEE_CUST': 'Empleado',
      'MANAGER_CUST': 'Gerente',
      'ADMIN_CUST': 'Administrador',
      'OWNER_CUST': 'Propietario'
    };

    const baseName = roleNames[currentRole];
    
    if (isInSwitchedMode) {
      return `${baseName} (Modo Temporal)`;
    }
    
    return baseName;
  };

  /**
   * Check if current role is an AI Pair role
   */
  const isVibeThinkRole = currentRole?.endsWith('_AP') || false;

  /**
   * Check if current role is a customer role
   */
  const isCustomerRole = currentRole?.endsWith('_CUST') || false;

  // Restore switched role from sessionStorage on app load
  useEffect(() => {
    if (canSwitchRoles) {
      const switchedRole = sessionStorage.getItem('switched_role') as UserRole;
      if (switchedRole && switchedRole !== originalRole) {
        setCurrentRole(switchedRole);
      }
    }
  }, [canSwitchRoles, originalRole]);

  const value: RoleContextType = {
    originalRole,
    currentRole,
    canSwitchRoles,
    isInSwitchedMode,
    switchToRole,
    returnToOriginalRole,
    hasPermission,
    getRoleDisplayName,
    isVibeThinkRole,
    isCustomerRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

/**
 * HOC to protect components based on role permissions
 */
export const withRolePermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole: UserRole
) => {
  const ComponentWithRolePermission = (props: P) => {
    const { hasPermission } = useRoleContext();
    
    if (!hasPermission(requiredRole)) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Acceso Restringido
            </h3>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a esta sección
            </p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
  
  ComponentWithRolePermission.displayName = `withRolePermission(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ComponentWithRolePermission;
}; 