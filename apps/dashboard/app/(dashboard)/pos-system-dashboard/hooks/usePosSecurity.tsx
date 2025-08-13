"use client";

import React, { useCallback } from "react";

// Mock user for demonstration - In real app, this would come from auth context
const mockUser = {
  id: "user-123",
  company_id: "company-123",
  role: "MANAGER", // EMPLOYEE, MANAGER, ADMIN, OWNER, SUPER_ADMIN
  permissions: [
    "POS_ACCESS",
    "INVENTORY_MANAGE", 
    "ANALYTICS_VIEW",
    "CUSTOMER_MANAGE",
    "TRANSACTION_VOID",
    "DISCOUNT_APPLY"
  ]
};

// POS-specific permissions mapping
const POS_PERMISSIONS = {
  // Basic POS operations
  POS_ACCESS: "Access to POS interface",
  TRANSACTION_CREATE: "Create new transactions", 
  TRANSACTION_VOID: "Void/cancel transactions",
  TRANSACTION_REFUND: "Process refunds",
  
  // Inventory management
  INVENTORY_VIEW: "View product inventory",
  INVENTORY_MANAGE: "Manage products and inventory",
  INVENTORY_ADJUST: "Adjust stock levels",
  
  // Customer management
  CUSTOMER_VIEW: "View customer information",
  CUSTOMER_MANAGE: "Manage customer accounts",
  CUSTOMER_LOYALTY: "Manage loyalty programs",
  
  // Analytics and reporting
  ANALYTICS_VIEW: "View sales analytics",
  REPORTS_GENERATE: "Generate reports",
  REPORTS_EXPORT: "Export report data",
  
  // Discounts and pricing
  DISCOUNT_APPLY: "Apply discounts to transactions",
  PRICE_OVERRIDE: "Override product prices",
  
  // Cash management
  CASH_MANAGEMENT: "Manage cash drawer",
  SESSION_MANAGE: "Start/end POS sessions",
  
  // Admin functions
  POS_SETTINGS: "Configure POS settings",
  USER_MANAGE: "Manage POS users",
  DEVICE_MANAGE: "Manage POS devices"
};

// Role-based permission defaults
const EMPLOYEE_PERMISSIONS = [
  "POS_ACCESS",
  "TRANSACTION_CREATE",
  "INVENTORY_VIEW",
  "CUSTOMER_VIEW"
];

const MANAGER_PERMISSIONS = [
  ...EMPLOYEE_PERMISSIONS,
  "TRANSACTION_VOID",
  "TRANSACTION_REFUND",
  "INVENTORY_MANAGE",
  "CUSTOMER_MANAGE",
  "ANALYTICS_VIEW",
  "DISCOUNT_APPLY",
  "CASH_MANAGEMENT",
  "SESSION_MANAGE"
];

const ADMIN_PERMISSIONS = [
  ...MANAGER_PERMISSIONS,
  "INVENTORY_ADJUST",
  "CUSTOMER_LOYALTY",
  "REPORTS_GENERATE",
  "REPORTS_EXPORT",
  "PRICE_OVERRIDE",
  "POS_SETTINGS",
  "USER_MANAGE"
];

const OWNER_PERMISSIONS = [
  ...ADMIN_PERMISSIONS,
  "DEVICE_MANAGE"
];

const ROLE_PERMISSIONS = {
  EMPLOYEE: EMPLOYEE_PERMISSIONS,
  MANAGER: MANAGER_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  OWNER: OWNER_PERMISSIONS,
  SUPER_ADMIN: Object.keys(POS_PERMISSIONS)
};

export function usePosSecurity() {
  // Check if user has specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    // Check explicit permissions first
    if (mockUser.permissions.includes(permission)) {
      return true;
    }
    
    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[mockUser.role as keyof typeof ROLE_PERMISSIONS] || [];
    return rolePermissions.includes(permission);
  }, []);

  // Check multiple permissions (all must be satisfied)
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  // Check multiple permissions (at least one must be satisfied)
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  // Validate transaction access
  const canAccessTransaction = useCallback((transactionOwnerId?: string): boolean => {
    // Super admin can access all transactions
    if (mockUser.role === "SUPER_ADMIN") {
      return true;
    }
    
    // Users can access their own transactions
    if (transactionOwnerId === mockUser.id) {
      return true;
    }
    
    // Managers and above can access all company transactions
    if (["MANAGER", "ADMIN", "OWNER"].includes(mockUser.role)) {
      return true;
    }
    
    return false;
  }, []);

  // Validate product management access
  const canManageProduct = useCallback((productOwnerId?: string): boolean => {
    if (!hasPermission("INVENTORY_MANAGE")) {
      return false;
    }
    
    // Super admin can manage all products
    if (mockUser.role === "SUPER_ADMIN") {
      return true;
    }
    
    // Company-level access for same company products
    return true; // All products are company-scoped via company_id
  }, [hasPermission]);

  // Validate cash operations
  const canManageCash = useCallback((): boolean => {
    return hasPermission("CASH_MANAGEMENT");
  }, [hasPermission]);

  // Validate session operations
  const canManageSession = useCallback((): boolean => {
    return hasPermission("SESSION_MANAGE");
  }, [hasPermission]);

  // Validate discount application
  const canApplyDiscount = useCallback((discountAmount: number): boolean => {
    if (!hasPermission("DISCOUNT_APPLY")) {
      return false;
    }
    
    // Additional business rules for discount limits
    const maxDiscountPercent = getMaxDiscountPercent();
    // TODO: Implement discount amount validation logic
    
    return true;
  }, [hasPermission]);

  // Get maximum discount percentage based on role
  const getMaxDiscountPercent = useCallback((): number => {
    switch (mockUser.role) {
      case "EMPLOYEE":
        return 5; // 5% max discount
      case "MANAGER":
        return 15; // 15% max discount
      case "ADMIN":
      case "OWNER":
        return 25; // 25% max discount
      case "SUPER_ADMIN":
        return 100; // No limit
      default:
        return 0;
    }
  }, []);

  // Validate price override
  const canOverridePrice = useCallback((originalPrice: number, newPrice: number): boolean => {
    if (!hasPermission("PRICE_OVERRIDE")) {
      return false;
    }
    
    // Business rules for price override
    const discountPercent = ((originalPrice - newPrice) / originalPrice) * 100;
    const maxDiscount = getMaxDiscountPercent();
    
    return discountPercent <= maxDiscount;
  }, [hasPermission, getMaxDiscountPercent]);

  // Get user context for security logging
  const getUserContext = useCallback(() => {
    return {
      userId: mockUser.id,
      companyId: mockUser.company_id,
      role: mockUser.role,
      permissions: mockUser.permissions
    };
  }, []);

  // Log security event
  const logSecurityEvent = useCallback((event: string, details: any) => {
    console.log("Security Event:", {
      event,
      user: getUserContext(),
      details,
      timestamp: new Date().toISOString()
    });
    
    // TODO: Send to audit log service
  }, [getUserContext]);

  // Validate company access (multi-tenant security)
  const validateCompanyAccess = useCallback((resourceCompanyId: string): boolean => {
    // Super admin can access all companies
    if (mockUser.role === "SUPER_ADMIN") {
      return true;
    }
    
    // Users can only access their own company resources
    return mockUser.company_id === resourceCompanyId;
  }, []);

  // Get filtered permissions for current role
  const getUserPermissions = useCallback(() => {
    const rolePermissions = ROLE_PERMISSIONS[mockUser.role as keyof typeof ROLE_PERMISSIONS] || [];
    const allPermissions = [...new Set([...mockUser.permissions, ...rolePermissions])];
    
    return allPermissions.map(permission => ({
      permission,
      description: POS_PERMISSIONS[permission as keyof typeof POS_PERMISSIONS] || permission
    }));
  }, []);

  return {
    // Permission checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
    // Specific validations
    canAccessTransaction,
    canManageProduct,
    canManageCash,
    canManageSession,
    canApplyDiscount,
    canOverridePrice,
    
    // Utility functions
    getMaxDiscountPercent,
    getUserContext,
    logSecurityEvent,
    validateCompanyAccess,
    getUserPermissions,
    
    // User info
    currentUser: mockUser,
    
    // Constants
    POS_PERMISSIONS,
    ROLE_PERMISSIONS
  };
}

// Helper hook for component-level permission checking
export function usePermissionGuard(requiredPermission: string) {
  const { hasPermission } = usePosSecurity();
  
  return {
    hasAccess: hasPermission(requiredPermission),
    requiredPermission
  };
}

// Component wrapper for permission-based rendering
export function withPosPermission<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermission: string
) {
  return function PermissionWrappedComponent(props: T) {
    const { hasAccess } = usePermissionGuard(requiredPermission);
    
    if (!hasAccess) {
      return (
        <div className="text-center p-4">
          <p className="text-muted-foreground">
            You don't have permission to access this feature.
          </p>
          <p className="text-sm text-muted-foreground">
            Required permission: {requiredPermission}
          </p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}