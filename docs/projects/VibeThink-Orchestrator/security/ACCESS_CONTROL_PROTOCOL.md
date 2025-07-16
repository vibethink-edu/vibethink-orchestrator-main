# Protocolo de Control de Acceso y Trazabilidad - VibeThink Orchestrator

## Resumen

Este documento establece el protocolo completo de control de acceso, autenticación y trazabilidad para la plataforma VibeThink Orchestrator, implementando un sistema multi-tenant con roles granulares y auditoría completa.

## 1. Arquitectura de Autenticación

### 1.1 Sistema Multi-Tenant
- **Aislamiento por empresa**: Cada empresa tiene su propio espacio de datos
- **Roles separados**: Roles de AI Pair (_AP) vs roles de cliente (_CUST)
- **Configuración dual**: Soporte para configuración interna y de cliente

### 1.2 Roles y Jerarquía

#### Roles de AI Pair Interno (_AP)
```
SUPER_ADMIN_AP (Nivel 1)
├── SUPPORT_AP (Nivel 2)
├── DEVELOPER_AP (Nivel 3)
├── MANAGER_AP (Nivel 3)
└── EMPLOYEE_AP (Nivel 4)
```

#### Roles de Empresa Cliente (_CUST)
```
OWNER_CUST (Nivel 1)
├── ADMIN_CUST (Nivel 2)
├── MANAGER_CUST (Nivel 3)
└── EMPLOYEE_CUST (Nivel 4)
```

### 1.3 Permisos Granulares

#### SUPER_ADMIN_AP
- Acceso completo a todas las empresas
- Gestión de configuración de plataforma
- Control de facturación global
- Creación y modificación de planes
- Soporte cross-tenant

#### SUPPORT_AP
- Acceso limitado a empresas para soporte
- Visualización de analytics de empresa
- Ajustes temporales de límites
- Herramientas de soporte técnico
- Gestión de tickets de soporte

#### OWNER_CUST
- Control total de la empresa
- Gestión de facturación
- Configuración de planes
- Gestión de usuarios
- Exportación de datos

#### ADMIN_CUST
- Gestión de usuarios de empresa
- Monitoreo de uso de IA
- Gestión de integraciones
- Administración de workflows
- Acceso a reportes

## 2. Protocolo de Inicio de Sesión

### 2.1 Captura de Contexto Inicial
Al iniciar cualquier sesión de chat o interacción, el sistema debe:

1. **Solicitar fecha y hora actual**
   - Confirmar zona horaria del usuario
   - Registrar timestamp de inicio

2. **Identificar perfil del usuario**
   - Rol actual (SUPER_ADMIN_AP, OWNER_CUST, etc.)
   - Empresa asociada
   - Permisos específicos
   - Configuración de personalización

3. **Establecer contexto de sesión**
   - ID de sesión único
   - Configuración de idioma
   - Preferencias de tema
   - Configuración de empresa

### 2.2 Flujo de Autenticación

```typescript
interface SessionContext {
  sessionId: string;
  userId: string;
  userRole: UserRole;
  companyId: string;
  timestamp: Date;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  permissions: Permission[];
  companyConfig: CompanyConfiguration;
}
```

## 3. Sistema de Trazabilidad

### 3.1 Auditoría Completa
- **Log de autenticación**: Cada login/logout
- **Log de acciones**: Todas las operaciones críticas
- **Log de cambios**: Modificaciones a datos sensibles
- **Log de acceso**: Acceso a recursos protegidos

### 3.2 Campos de Auditoría
```sql
-- Campos automáticos en todas las tablas
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
created_by UUID REFERENCES auth.users(id),
updated_by UUID REFERENCES auth.users(id),
company_id UUID REFERENCES companies(id),
session_id TEXT,
ip_address INET,
user_agent TEXT
```

### 3.3 Tabla de Auditoría Principal
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Control de Acceso por Recurso

### 4.1 Políticas RLS (Row Level Security)
```sql
-- Ejemplo: Política para user_profiles
CREATE POLICY "Users can only access their own company data"
ON user_profiles
FOR ALL
USING (company_id = auth.jwt() ->> 'company_id');

-- Ejemplo: Política para SUPER_ADMIN_AP
CREATE POLICY "Super admin can access all data"
ON user_profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'SUPER_ADMIN_AP'
  )
);
```

### 4.2 Validación de Permisos
```typescript
function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const roleDefinition = ROLE_DEFINITIONS[userRole];
  return roleDefinition.permissions.includes(permission);
}

function canAccessResource(userRole: UserRole, resourceType: string, resourceId: string): boolean {
  // Lógica específica por tipo de recurso
  switch (resourceType) {
    case 'company_data':
      return isVibeThinkRole(userRole) || userRole.includes('OWNER') || userRole.includes('ADMIN');
    case 'user_management':
      return hasPermission(userRole, 'user_management');
    case 'billing':
      return hasPermission(userRole, 'billing_management');
    default:
      return false;
  }
}
```

## 5. Gestión de Sesiones

### 5.1 Configuración de Sesión
```typescript
const SESSION_CONFIG = {
  jwtExpiry: 3600, // 1 hora
  refreshTokenRotation: true,
  refreshTokenReuseInterval: 10,
  maxSessionsPerUser: 5,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
};
```

### 5.2 Renovación de Tokens
- Renovación automática antes de expiración
- Rotación de refresh tokens
- Invalidación de sesiones múltiples

## 6. Monitoreo y Alertas

### 6.1 Métricas de Seguridad
- Intentos de acceso fallidos
- Acceso a recursos sensibles
- Cambios de configuración crítica
- Uso anómalo de permisos

### 6.2 Alertas Automáticas
```typescript
interface SecurityAlert {
  type: 'failed_login' | 'suspicious_activity' | 'privilege_escalation' | 'data_export';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  companyId: string;
  details: Record<string, any>;
  timestamp: Date;
}
```

## 7. Cumplimiento y Regulaciones

### 7.1 GDPR Compliance
- Derecho al olvido
- Portabilidad de datos
- Consentimiento explícito
- Notificación de brechas

### 7.2 ISO 27001
- Control de acceso
- Gestión de incidentes
- Auditoría regular
- Documentación de procesos

### 7.3 CMMI Level 5
- Procesos documentados
- Métricas de calidad
- Mejora continua
- Gestión de configuración

## 8. Implementación Técnica

### 8.1 Middleware de Autenticación
```typescript
// src/middleware/auth.ts
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await validateSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Establecer contexto de sesión
    req.sessionContext = {
      sessionId: session.id,
      userId: session.user.id,
      userRole: session.user.role,
      companyId: session.user.company_id,
      timestamp: new Date(),
      permissions: getRolePermissions(session.user.role)
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### 8.2 Hook de Autenticación
```typescript
// src/hooks/useAuth.tsx
export const useAuth = () => {
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
  
  const initializeSession = async () => {
    // Capturar fecha y perfil
    const context = await captureSessionContext();
    setSessionContext(context);
    
    // Registrar inicio de sesión
    await logSessionStart(context);
  };
  
  return {
    sessionContext,
    initializeSession,
    hasPermission: (permission: Permission) => 
      sessionContext?.permissions.includes(permission) || false
  };
};
```

## 9. Testing y Validación

### 9.1 Tests de Seguridad
```typescript
describe('Access Control', () => {
  test('SUPER_ADMIN_AP can access all companies', async () => {
    const superAdmin = createMockUser('SUPER_ADMIN_AP');
    const result = await canAccessCompany(superAdmin, 'any-company-id');
    expect(result).toBe(true);
  });
  
  test('EMPLOYEE_CUST cannot access other companies', async () => {
    const employee = createMockUser('EMPLOYEE_CUST', 'company-a');
    const result = await canAccessCompany(employee, 'company-b');
    expect(result).toBe(false);
  });
});
```

### 9.2 Validación de Políticas RLS
```sql
-- Test de políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public';
```

## 10. Documentación y Mantenimiento

### 10.1 Actualización de Roles
- Documentar cambios en roles
- Actualizar políticas RLS
- Migrar datos existentes
- Notificar a usuarios afectados

### 10.2 Monitoreo Continuo
- Revisión semanal de logs de auditoría
- Análisis mensual de patrones de acceso
- Actualización trimestral de políticas
- Auditoría anual de cumplimiento

## 11. Procedimientos de Emergencia

### 11.1 Breach Response
1. **Contención**: Aislar sistemas afectados
2. **Análisis**: Identificar alcance del incidente
3. **Notificación**: Informar a stakeholders
4. **Recuperación**: Restaurar servicios
5. **Lecciones**: Documentar y mejorar

### 11.2 Recuperación de Acceso
- Procedimientos de reset de contraseñas
- Verificación de identidad
- Restauración de permisos
- Auditoría post-incidente

## Conclusión

Este protocolo establece un marco robusto para el control de acceso y trazabilidad en VibeThink Orchestrator, asegurando la seguridad, cumplimiento y operabilidad de la plataforma multi-tenant.

---

**Documento creado por**: AI Pair Platform  
**Fecha**: 2025-01-23  
**Versión**: 1.0.0  
**Revisión**: Marcelo SALES 