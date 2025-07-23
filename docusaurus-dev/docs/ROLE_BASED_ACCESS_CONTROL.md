# Sistema de Control de Acceso Basado en Roles (RBAC) - AI Pair Orchestrator Pro

## Resumen Ejecutivo

Este documento detalla la implementación completa del sistema de control de acceso basado en roles (RBAC) para la plataforma AI Pair Orchestrator Pro, incluyendo la separación entre roles internos de AI Pair y roles de empresas cliente.

## 1. Arquitectura de Roles

### 1.1 Separación de Dominios

El sistema implementa una separación clara entre dos dominios de roles:

#### Dominio AI Pair (_AP)
- Roles internos para el equipo de AI Pair
- Acceso a funcionalidades de plataforma
- Soporte y administración de clientes
- Desarrollo y mantenimiento

#### Dominio Cliente (_CUST)
- Roles para empresas que utilizan la plataforma
- Acceso limitado a funcionalidades de negocio
- Gestión de usuarios y datos de empresa
- Operaciones diarias

### 1.2 Jerarquía de Roles

```
AI PAIR DOMAIN (_AP)
├── SUPER_ADMIN_AP (Nivel 1) - Control total de plataforma
├── SUPPORT_AP (Nivel 2) - Soporte técnico y asistencia
├── DEVELOPER_AP (Nivel 3) - Desarrollo y mantenimiento
├── MANAGER_AP (Nivel 3) - Gestión interna
└── EMPLOYEE_AP (Nivel 4) - Operaciones básicas

CLIENT DOMAIN (_CUST)
├── OWNER_CUST (Nivel 1) - Propietario de empresa
├── ADMIN_CUST (Nivel 2) - Administrador de empresa
├── MANAGER_CUST (Nivel 3) - Gerente de departamento
└── EMPLOYEE_CUST (Nivel 4) - Empleado
```

## 2. Definición Detallada de Roles

### 2.1 SUPER_ADMIN_AP
**Descripción**: Administrador de plataforma con acceso completo a todas las funcionalidades

**Permisos**:
- `access_all_companies` - Acceso a todas las empresas
- `manage_platform_settings` - Gestión de configuración de plataforma
- `view_global_analytics` - Visualización de analytics globales
- `manage_super_admin_features` - Gestión de características de super admin
- `system_configuration` - Configuración del sistema
- `cross_tenant_support` - Soporte cross-tenant
- `create_modify_plans` - Creación y modificación de planes
- `platform_billing_control` - Control de facturación de plataforma

**Restricciones**: Ninguna

**Casos de Uso**:
- Configuración global de la plataforma
- Gestión de planes y precios
- Soporte a clientes críticos
- Análisis de métricas globales
- Gestión de integraciones de plataforma

### 2.2 SUPPORT_AP
**Descripción**: Personal de soporte VibeThink con acceso limitado para asistir empresas

**Permisos**:
- `access_companies_for_support` - Acceso a empresas para soporte
- `view_company_analytics` - Visualización de analytics de empresa
- `temporary_limit_adjustments` - Ajustes temporales de límites
- `technical_support_tools` - Herramientas de soporte técnico
- `read_company_configurations` - Lectura de configuraciones de empresa
- `support_ticket_management` - Gestión de tickets de soporte
- `limited_user_assistance` - Asistencia limitada a usuarios
- `view_ai_usage_logs` - Visualización de logs de uso de IA

**Restricciones**:
- No puede crear o modificar planes
- No puede cambiar configuraciones de plataforma
- No puede acceder a facturación de plataforma
- Solo puede realizar ajustes temporales
- Acceso de solo lectura a configuraciones críticas

**Casos de Uso**:
- Resolución de tickets de soporte
- Asistencia técnica a clientes
- Ajustes temporales de límites
- Análisis de problemas de uso
- Capacitación de usuarios

### 2.3 DEVELOPER_AP
**Descripción**: Desarrollador interno de AI Pair con acceso técnico

**Permisos**:
- `access_development_tools` - Acceso a herramientas de desarrollo
- `deploy_code` - Despliegue de código
- `access_logs` - Acceso a logs del sistema
- `manage_integrations` - Gestión de integraciones
- `testing_tools` - Herramientas de testing
- `monitoring_access` - Acceso a monitoreo

**Restricciones**:
- No puede acceder a datos de clientes
- No puede modificar configuraciones de producción
- Acceso limitado a herramientas de desarrollo

**Casos de Uso**:
- Desarrollo de nuevas funcionalidades
- Mantenimiento del código
- Testing de integraciones
- Monitoreo de performance
- Debugging de problemas técnicos

### 2.4 OWNER_CUST
**Descripción**: Propietario de empresa cliente con control total

**Permisos**:
- `full_company_control` - Control total de la empresa
- `billing_management` - Gestión de facturación
- `plan_configuration` - Configuración de planes
- `user_management` - Gestión de usuarios
- `export_company_data` - Exportación de datos de empresa
- `company_settings` - Configuración de empresa

**Restricciones**:
- Solo puede acceder a su propia empresa
- No puede modificar configuraciones de plataforma
- No puede acceder a datos de otras empresas

**Casos de Uso**:
- Gestión de facturación y planes
- Administración de usuarios de empresa
- Configuración de integraciones
- Exportación de datos
- Gestión de configuraciones de empresa

### 2.5 ADMIN_CUST
**Descripción**: Administrador de empresa cliente

**Permisos**:
- `company_user_management` - Gestión de usuarios de empresa
- `ai_usage_monitoring` - Monitoreo de uso de IA
- `integrations_management` - Gestión de integraciones
- `workflow_administration` - Administración de workflows
- `reporting_access` - Acceso a reportes
- `company_configurations` - Configuraciones de empresa

**Restricciones**:
- No puede modificar facturación
- No puede cambiar planes
- No puede exportar datos completos
- Solo puede gestionar usuarios de su empresa

**Casos de Uso**:
- Gestión de usuarios de empresa
- Monitoreo de uso de IA
- Configuración de workflows
- Generación de reportes
- Gestión de integraciones

## 3. Sistema de Permisos

### 3.1 Tipos de Permisos

#### Permisos de Acceso
- Controlan qué recursos puede ver un usuario
- Implementados a nivel de base de datos con RLS
- Validados en cada request

#### Permisos de Acción
- Controlan qué operaciones puede realizar un usuario
- Validados en el frontend y backend
- Registrados en logs de auditoría

#### Permisos de Configuración
- Controlan qué configuraciones puede modificar un usuario
- Aplicados a nivel de aplicación
- Requieren validación adicional

### 3.2 Implementación de Permisos

```typescript
// src/types/roles.ts
export type Permission = 
  // SUPER_ADMIN_AP permissions
  | 'access_all_companies'
  | 'manage_platform_settings'
  | 'view_global_analytics'
  | 'manage_super_admin_features'
  | 'system_configuration'
  | 'cross_tenant_support'
  | 'create_modify_plans'
  | 'platform_billing_control'
  
  // SUPPORT_AP permissions
  | 'access_companies_for_support'
  | 'view_company_analytics'
  | 'temporary_limit_adjustments'
  | 'technical_support_tools'
  | 'read_company_configurations'
  | 'support_ticket_management'
  | 'limited_user_assistance'
  | 'view_ai_usage_logs'
  
  // ... más permisos
```

### 3.3 Validación de Permisos

```typescript
// src/utils/permissions.ts
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const roleDefinition = ROLE_DEFINITIONS[userRole];
  return roleDefinition.permissions.includes(permission);
}

export function canAccessResource(
  userRole: UserRole, 
  resourceType: string, 
  resourceCompanyId: string,
  userCompanyId: string
): boolean {
  // SUPER_ADMIN_AP puede acceder a todo
  if (userRole === 'SUPER_ADMIN_AP') return true;
  
  // SUPPORT_AP puede acceder a empresas para soporte
  if (userRole === 'SUPPORT_AP') return true;
  
  // Usuarios de empresa solo pueden acceder a su propia empresa
  if (userRole.includes('_CUST')) {
    return resourceCompanyId === userCompanyId;
  }
  
  return false;
}
```

## 4. Políticas de Seguridad

### 4.1 Row Level Security (RLS)

```sql
-- Política para user_profiles
CREATE POLICY "Users can only access their own company data"
ON user_profiles
FOR ALL
USING (
  company_id = auth.jwt() ->> 'company_id' OR
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('SUPER_ADMIN_AP', 'SUPPORT_AP')
  )
);

-- Política para companies
CREATE POLICY "Only super admin and support can access all companies"
ON companies
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('SUPER_ADMIN_AP', 'SUPPORT_AP')
  )
);
```

### 4.2 Validación en Frontend

```typescript
// src/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requireAdmin,
  requireSuperAdmin
}) => {
  const { user, hasPermission } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requireSuperAdmin && user.role !== 'SUPER_ADMIN_AP') {
    return <Unauthorized />;
  }
  
  if (requireAdmin && !user.role.includes('ADMIN')) {
    return <Unauthorized />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Unauthorized />;
  }
  
  return <>{children}</>;
};
```

## 5. Gestión de Usuarios

### 5.1 Creación de Usuarios

```typescript
// src/hooks/useUsers.ts
export const useUsers = () => {
  const createUser = async (userData: CreateUserData) => {
    const { user, hasPermission } = useAuth();
    
    // Validar permisos
    if (!hasPermission('user_management')) {
      throw new Error('Insufficient permissions');
    }
    
    // Validar que el usuario pertenece a la misma empresa
    if (userData.company_id !== user.company_id && user.role !== 'SUPER_ADMIN_AP') {
      throw new Error('Cannot create user for different company');
    }
    
    // Crear usuario
    const result = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: {
        full_name: userData.full_name,
        role: userData.role,
        company_id: userData.company_id
      }
    });
    
    return result;
  };
  
  return { createUser };
};
```

### 5.2 Cambio de Roles

```typescript
export const changeUserRole = async (userId: string, newRole: UserRole) => {
  const { user, hasPermission } = useAuth();
  
  // Solo SUPER_ADMIN_AP puede cambiar roles
  if (!hasPermission('user_management')) {
    throw new Error('Insufficient permissions');
  }
  
  // Validar jerarquía de roles
  if (!canManageRole(user.role, newRole)) {
    throw new Error('Cannot assign role higher than your own');
  }
  
  // Actualizar rol
  const result = await supabase
    .from('user_profiles')
    .update({ role: newRole })
    .eq('id', userId);
    
  // Registrar cambio en auditoría
  await logRoleChange(userId, user.role, newRole);
  
  return result;
};
```

## 6. Auditoría y Logging

### 6.1 Logs de Acceso

```typescript
// src/utils/audit.ts
export const logAccess = async (
  userId: string,
  resourceType: string,
  resourceId: string,
  action: string
) => {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    resource_type: resourceType,
    resource_id: resourceId,
    action: action,
    timestamp: new Date().toISOString(),
    session_id: getCurrentSessionId(),
    ip_address: getClientIP(),
    user_agent: getUserAgent()
  });
};
```

### 6.2 Logs de Cambios

```typescript
export const logDataChange = async (
  userId: string,
  tableName: string,
  recordId: string,
  oldValues: any,
  newValues: any
) => {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    resource_type: tableName,
    resource_id: recordId,
    action: 'UPDATE',
    old_values: oldValues,
    new_values: newValues,
    timestamp: new Date().toISOString()
  });
};
```

## 7. Testing del Sistema RBAC

### 7.1 Tests Unitarios

```typescript
// tests/unit/rbac.test.ts
describe('Role-Based Access Control', () => {
  test('SUPER_ADMIN_AP has all permissions', () => {
    const permissions = getRolePermissions('SUPER_ADMIN_AP');
    expect(permissions).toContain('access_all_companies');
    expect(permissions).toContain('manage_platform_settings');
  });
  
  test('EMPLOYEE_CUST has limited permissions', () => {
    const permissions = getRolePermissions('EMPLOYEE_CUST');
    expect(permissions).not.toContain('user_management');
    expect(permissions).toContain('basic_ai_access');
  });
  
  test('Role hierarchy is respected', () => {
    expect(canManageRole('SUPER_ADMIN_AP', 'SUPPORT_AP')).toBe(true);
    expect(canManageRole('EMPLOYEE_CUST', 'ADMIN_CUST')).toBe(false);
  });
});
```

### 7.2 Tests de Integración

```typescript
// tests/integration/access-control.test.ts
describe('Access Control Integration', () => {
  test('Users can only access their company data', async () => {
    const userA = await createTestUser('company-a');
    const userB = await createTestUser('company-b');
    
    const userAData = await getUserData(userA.id);
    const userBData = await getUserData(userB.id);
    
    expect(userAData.company_id).toBe('company-a');
    expect(userBData.company_id).toBe('company-b');
  });
  
  test('SUPER_ADMIN_AP can access all companies', async () => {
    const superAdmin = await createTestUser('SUPER_ADMIN_AP');
    const allCompanies = await getCompanies(superAdmin.id);
    
    expect(allCompanies.length).toBeGreaterThan(1);
  });
});
```

## 8. Monitoreo y Alertas

### 8.1 Métricas de Seguridad

```typescript
// src/utils/security-metrics.ts
export const SecurityMetrics = {
  trackFailedLogin: (userId: string, reason: string) => {
    // Incrementar contador de intentos fallidos
    incrementMetric('failed_logins', { userId, reason });
  },
  
  trackPrivilegeEscalation: (userId: string, attemptedAction: string) => {
    // Registrar intento de escalación de privilegios
    logSecurityEvent('privilege_escalation', { userId, attemptedAction });
  },
  
  trackDataAccess: (userId: string, resourceType: string, resourceId: string) => {
    // Registrar acceso a datos sensibles
    logSecurityEvent('data_access', { userId, resourceType, resourceId });
  }
};
```

### 8.2 Alertas Automáticas

```typescript
export const SecurityAlerts = {
  checkFailedLogins: async () => {
    const failedLogins = await getFailedLoginsLastHour();
    
    if (failedLogins.length > 5) {
      await sendAlert('multiple_failed_logins', {
        count: failedLogins.length,
        users: failedLogins.map(f => f.user_id)
      });
    }
  },
  
  checkUnusualAccess: async () => {
    const unusualAccess = await detectUnusualAccessPatterns();
    
    for (const access of unusualAccess) {
      await sendAlert('unusual_access', access);
    }
  }
};
```

## 9. Documentación y Mantenimiento

### 9.1 Actualización de Roles

Cuando se necesite agregar o modificar roles:

1. **Actualizar tipos TypeScript**
2. **Modificar definiciones de roles**
3. **Actualizar políticas RLS**
4. **Migrar datos existentes**
5. **Actualizar documentación**
6. **Notificar a usuarios afectados**

### 9.2 Procedimientos de Emergencia

#### Bloqueo de Usuario
```typescript
export const emergencyUserLock = async (userId: string, reason: string) => {
  // Deshabilitar usuario inmediatamente
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { disabled: true, disabled_reason: reason }
  });
  
  // Registrar en auditoría
  await logSecurityEvent('emergency_user_lock', { userId, reason });
  
  // Notificar a administradores
  await notifyAdmins('emergency_user_lock', { userId, reason });
};
```

#### Recuperación de Acceso
```typescript
export const restoreUserAccess = async (userId: string, adminId: string) => {
  // Verificar que el admin tiene permisos
  const admin = await getUser(adminId);
  if (!hasPermission(admin.role, 'user_management')) {
    throw new Error('Insufficient permissions');
  }
  
  // Restaurar acceso
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { disabled: false }
  });
  
  // Registrar en auditoría
  await logSecurityEvent('user_access_restored', { userId, restored_by: adminId });
};
```

## 10. Conclusión

El sistema RBAC implementado en AI Pair Orchestrator Pro proporciona:

- **Seguridad robusta**: Separación clara de roles y permisos
- **Escalabilidad**: Fácil agregado de nuevos roles y permisos
- **Auditoría completa**: Trazabilidad de todas las acciones
- **Cumplimiento**: Adherencia a estándares de seguridad
- **Flexibilidad**: Adaptación a diferentes tipos de empresas

Este sistema asegura que cada usuario tenga acceso solo a los recursos y funcionalidades que necesita para su rol específico, manteniendo la seguridad y integridad de la plataforma multi-tenant.

---

**Documento creado por**: AI Pair Platform  
**Fecha**: 2025-01-23  
**Versión**: 1.0.0  
**Revisión**: Marcelo SALES 