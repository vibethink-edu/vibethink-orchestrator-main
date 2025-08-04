# 🏢 Estructura de Datos: Empresas y Superadministración

## 📋 Resumen

Esta estructura de datos establece la base fundamental para el sistema multi-tenant de VibeThink Orchestrator, con soporte completo para empresas y superadministración.

## 🏗️ Arquitectura

### **Diseño Multi-Tenant**
- **Tenant Root**: `companies` table
- **Isolation**: Row Level Security (RLS) por company_id
- **Super Admin**: Acceso global sin restricciones de empresa

### **Jerarquía de Roles**
```
SUPER_ADMIN (Global)
├── COMPANY_OWNER (Por empresa)
├── COMPANY_ADMIN (Por empresa)
├── MANAGER (Por departamento)
├── EMPLOYEE (Usuario regular)
└── GUEST (Acceso limitado)
```

## 📊 Tablas Principales

### 1. **companies**
**Propósito**: Tabla raíz para multi-tenancy
```sql
Key Fields:
- id: UUID (Primary Key)
- slug: Identificador único URL-friendly
- plan_type: FREE, BASIC, PRO, ENTERPRISE, CUSTOM
- status: ACTIVE, SUSPENDED, CANCELLED, PENDING
- plan_limits: JSONB con límites específicos del plan
```

**Casos de Uso**:
- ✅ Aislamiento de datos por empresa
- ✅ Gestión de planes y facturación
- ✅ Configuraciones específicas por empresa

### 2. **user_profiles**
**Propósito**: Extensión de Supabase Auth con información empresarial
```sql
Key Fields:
- id: UUID (FK a auth.users)
- company_id: UUID (FK a companies) - NULL solo para SUPER_ADMIN
- role: user_role ENUM
- manager_id: UUID (FK a user_profiles) - Jerarquía
```

**Casos de Uso**:
- ✅ Gestión de usuarios por empresa
- ✅ Jerarquías organizacionales
- ✅ Control de acceso basado en roles

### 3. **super_admin_config**
**Propósito**: Configuraciones globales del sistema
```sql
Key Fields:
- config_key: TEXT (Clave única)
- config_value: JSONB (Valor flexible)
- is_public: BOOLEAN (Visible para no-super-admins)
```

**Casos de Uso**:
- ✅ Configuración global del sistema
- ✅ Límites por defecto de planes
- ✅ Modo de mantenimiento

### 4. **system_audit_log**
**Propósito**: Auditoría completa del sistema
```sql
Key Fields:
- actor_id: UUID (Quien realizó la acción)
- action: TEXT (Qué se hizo)
- resource_type: TEXT (Tipo de recurso)
- company_id: UUID (Contexto empresarial)
- event_data: JSONB (Datos del evento)
```

**Casos de Uso**:
- ✅ Trazabilidad completa
- ✅ Compliance y auditoría
- ✅ Debugging y monitoreo

### 5. **company_invitations**
**Propósito**: Sistema de invitaciones a empresas
```sql
Key Fields:
- company_id: UUID (Empresa que invita)
- email: TEXT (Email del invitado)
- role: user_role (Rol propuesto)
- token: TEXT (Token único de invitación)
- expires_at: TIMESTAMP (Expiración)
```

## 🔐 Seguridad (RLS Policies)

### **Principios de Seguridad**
1. **Super Admins**: Acceso completo a todo
2. **Company Isolation**: Los usuarios solo ven datos de su empresa
3. **Role-Based Access**: Permisos según rol dentro de la empresa
4. **Audit Trail**: Todo queda registrado

### **Políticas Implementadas**

#### Companies
- ✅ Super admins ven todas las empresas
- ✅ Usuarios ven solo su empresa
- ✅ Solo owners/admins pueden modificar la empresa

#### User Profiles
- ✅ Super admins ven todos los usuarios
- ✅ Usuarios ven solo perfiles de su empresa
- ✅ Usuarios pueden editar su propio perfil
- ✅ Admins pueden editar usuarios de su empresa

#### Audit Logs
- ✅ Super admins ven todos los logs
- ✅ Company admins ven logs de su empresa

## 🚀 Funciones Utilitarias

### **update_updated_at_column()**
Actualiza automáticamente el campo `updated_at` en triggers.

### **log_system_event()**
Función para registrar eventos de auditoría:
```sql
SELECT log_system_event(
    'user_created',
    'user_profile',
    user_id::text,
    company_id,
    '{"email": "nuevo@usuario.com"}'::jsonb
);
```

## 📈 Casos de Uso Principales

### **1. Registro de Nueva Empresa**
```sql
-- 1. Crear empresa
INSERT INTO companies (name, slug, plan_type) 
VALUES ('Mi Empresa', 'mi-empresa', 'FREE');

-- 2. Crear usuario owner
INSERT INTO user_profiles (id, email, company_id, role)
VALUES (auth_user_id, 'owner@empresa.com', company_id, 'COMPANY_OWNER');

-- 3. Log del evento
SELECT log_system_event('company_created', 'company', company_id::text);
```

### **2. Invitar Usuario a Empresa**
```sql
-- 1. Crear invitación
INSERT INTO company_invitations (
    company_id, email, role, invited_by, token, expires_at
) VALUES (
    company_id, 'nuevo@empresa.com', 'EMPLOYEE', 
    inviter_id, generate_token(), NOW() + INTERVAL '7 days'
);

-- 2. Enviar email (en aplicación)
-- 3. Usuario acepta y se crea su perfil
```

### **3. Gestión de Super Admin**
```sql
-- Ver estadísticas globales
SELECT 
    COUNT(*) as total_companies,
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_companies,
    COUNT(*) FILTER (WHERE plan_type = 'FREE') as free_plans
FROM companies;

-- Configurar límite global
INSERT INTO super_admin_config (config_key, config_value)
VALUES ('max_free_users_per_company', '10');
```

## 🔄 Migración y Mantenimiento

### **Estructura de Archivos**
```
supabase/migrations/
├── 20250725000000_core_companies_superadmin.sql  # Este schema
├── 20250725000001_core_departments.sql           # Siguiente: Departamentos
├── 20250725000002_core_permissions.sql           # Siguiente: Permisos granulares
└── ...
```

### **Próximos Pasos**
1. **Departamentos**: Estructura organizacional interna
2. **Permisos Granulares**: Sistema de permisos detallados
3. **Módulos Específicos**: e2CRM, Recruiting, etc.

## ⚡ Optimizaciones

### **Índices Implementados**
- ✅ Búsqueda por empresa (`company_id`)
- ✅ Búsqueda por rol (`role`)
- ✅ Búsqueda por email (`email`)
- ✅ Auditoría por fecha (`created_at`)

### **Consideraciones de Performance**
- **Particionamiento**: Considerar particionar `system_audit_log` por fecha
- **Archivado**: Mover logs antiguos a tabla de archivo
- **Caché**: Cachear configuraciones de `super_admin_config`

## 🧪 Testing

### **Casos de Prueba Sugeridos**
1. ✅ Crear empresa y primer usuario
2. ✅ Invitar usuarios con diferentes roles
3. ✅ Verificar aislamiento entre empresas
4. ✅ Probar accesos de super admin
5. ✅ Verificar logs de auditoría
6. ✅ Probar expiración de invitaciones

---

## 📞 Contacto y Soporte

Para dudas sobre esta estructura de datos, consultar con el equipo de desarrollo o revisar la documentación técnica completa.
