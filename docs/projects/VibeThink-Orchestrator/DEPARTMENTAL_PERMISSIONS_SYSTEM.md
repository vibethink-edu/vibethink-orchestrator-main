# Sistema de Permisos Departamentales

## 📋 **Resumen del Sistema**

Sistema granular de permisos por departamento que permite controlar acceso a datos y funcionalidades específicas de manera adaptable a diferentes tipos de empresas. Implementa una arquitectura con separación clara entre configuración global y permisos departamentales.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**

1. **Tabla `departments`** - Gestión de departamentos por empresa
2. **Tabla `department_permissions`** - Permisos específicos por departamento
3. **Tabla `user_department_memberships`** - Asignación de usuarios a departamentos
4. **Tabla `data_access`** - Control granular de acceso a datos
5. **Tabla `permission_logs`** - Auditoría de cambios de permisos
6. **Tabla `data_access_logs`** - Auditoría de acceso a datos

### **Esquema de Permisos:**

```sql
-- Permisos universales con wildcards
CREATE TYPE universal_permission AS ENUM (
  'read', 'write', 'delete', 'admin',
  'read.*', 'write.*', 'delete.*', 'admin.*'
);

-- Acceso a datos con granularidad CRUD
CREATE TYPE data_access_type AS ENUM (
  'read', 'create', 'update', 'delete', 'admin'
);
```

## 🚀 **Estado de Implementación**

### **✅ Completado:**
- [x] Migración SQL completa con todas las tablas
- [x] Funciones RPC para gestión de permisos
- [x] Políticas RLS para seguridad multi-tenant
- [x] Triggers para auditoría automática
- [x] Tipos TypeScript completos
- [x] Hook `useDepartmentalPermissions` con logging
- [x] Componente UI para gestión visual
- [x] **Error de migración resuelto** (42P17 - funciones no inmutables)

### **🔧 Problemas Resueltos:**

#### **Error 42P17: Functions in Index Predicate Must Be Marked IMMUTABLE**
```sql
-- ❌ PROBLEMA: Índices parciales con funciones no inmutables
CREATE INDEX idx_permission_logs_recent ON permission_logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';

-- ✅ SOLUCIÓN: Eliminar índices parciales problemáticos
CREATE INDEX idx_permission_logs_user_time ON permission_logs(user_id, created_at DESC);
CREATE INDEX idx_permission_logs_company_time ON permission_logs(company_id, created_at DESC);
CREATE INDEX idx_permission_logs_action_time ON permission_logs(action, created_at DESC);
```

**Lección Aprendida:** PostgreSQL requiere funciones `IMMUTABLE` en índices parciales. Funciones como `now()`, `random()`, `uuid_generate_v4()` causan error 42P17.

## 📊 **Estructura de Datos**

### **Tabla `departments`:**
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Tabla `department_permissions`:**
```sql
CREATE TABLE department_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  permission universal_permission NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Tabla `user_department_memberships`:**
```sql
CREATE TABLE user_department_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Tabla `data_access`:**
```sql
CREATE TABLE data_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  access_type data_access_type NOT NULL,
  column_filters JSONB,
  row_filters JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔐 **Seguridad y Auditoría**

### **Políticas RLS Implementadas:**
```sql
-- Aislamiento por empresa
CREATE POLICY "departments_company_isolation" ON departments
  FOR ALL USING (company_id = auth.jwt() ->> 'company_id');

-- Auditoría automática
CREATE TRIGGER log_permission_changes
  AFTER INSERT OR UPDATE OR DELETE ON department_permissions
  FOR EACH ROW EXECUTE FUNCTION log_permission_change();
```

### **Logging Automático:**
- Cambios en permisos departamentales
- Acceso a datos sensibles
- Creación/modificación de departamentos
- Asignación de usuarios a departamentos

## 🎯 **Casos de Uso por Tipo de Empresa**

### **🏢 Empresa de Consultoría:**
```typescript
// Departamentos típicos
const departments = [
  { name: 'Consultores Senior', permissions: ['read.*', 'write.projects', 'admin.clients'] },
  { name: 'Consultores Junior', permissions: ['read.projects', 'write.tasks'] },
  { name: 'Gestión de Proyectos', permissions: ['read.*', 'write.*', 'admin.projects'] },
  { name: 'Recursos Humanos', permissions: ['read.employees', 'write.employees', 'admin.hr'] }
];
```

### **🏭 Empresa Manufacturera:**
```typescript
const departments = [
  { name: 'Producción', permissions: ['read.inventory', 'write.production', 'admin.quality'] },
  { name: 'Ventas', permissions: ['read.orders', 'write.orders', 'read.customers'] },
  { name: 'Compras', permissions: ['read.suppliers', 'write.purchases', 'admin.inventory'] },
  { name: 'Calidad', permissions: ['read.*', 'write.quality', 'admin.standards'] }
];
```

### **🏥 Hospital/Clínica:**
```typescript
const departments = [
  { name: 'Médicos', permissions: ['read.patients', 'write.medical_records', 'admin.treatments'] },
  { name: 'Enfermería', permissions: ['read.patients', 'write.nursing_notes'] },
  { name: 'Administración', permissions: ['read.*', 'write.appointments', 'admin.billing'] },
  { name: 'Farmacia', permissions: ['read.prescriptions', 'write.inventory', 'admin.medications'] }
];
```

### **🏦 Banco/Financiera:**
```typescript
const departments = [
  { name: 'Banca Personal', permissions: ['read.accounts', 'write.transactions', 'admin.loans'] },
  { name: 'Banca Corporativa', permissions: ['read.corporate', 'write.corporate', 'admin.corporate'] },
  { name: 'Riesgos', permissions: ['read.*', 'write.risk_assessments', 'admin.compliance'] },
  { name: 'Tecnología', permissions: ['read.*', 'write.*', 'admin.*'] }
];
```

### **🎓 Universidad:**
```typescript
const departments = [
  { name: 'Profesores', permissions: ['read.students', 'write.grades', 'admin.courses'] },
  { name: 'Estudiantes', permissions: ['read.own_records', 'write.assignments'] },
  { name: 'Administración', permissions: ['read.*', 'write.enrollment', 'admin.academic'] },
  { name: 'Finanzas', permissions: ['read.*', 'write.billing', 'admin.financial'] }
];
```

## 🔧 **Funciones RPC Disponibles**

### **Gestión de Departamentos:**
```sql
-- Crear departamento
SELECT create_department(
  p_company_id := 'company-uuid',
  p_name := 'Nombre del Departamento',
  p_description := 'Descripción opcional'
);

-- Obtener departamentos de empresa
SELECT * FROM get_company_departments('company-uuid');
```

### **Gestión de Permisos:**
```sql
-- Asignar permiso a departamento
SELECT assign_department_permission(
  p_department_id := 'department-uuid',
  p_permission := 'read.*',
  p_resource_type := 'projects'
);

-- Verificar permisos de usuario
SELECT * FROM check_user_permissions(
  p_user_id := 'user-uuid',
  p_permission := 'read.projects',
  p_resource_type := 'projects'
);
```

### **Gestión de Miembros:**
```sql
-- Agregar usuario a departamento
SELECT add_user_to_department(
  p_user_id := 'user-uuid',
  p_department_id := 'department-uuid',
  p_role := 'member'
);

-- Obtener miembros de departamento
SELECT * FROM get_department_members('department-uuid');
```

## 🎨 **Interfaz de Usuario**

### **Componente Principal:**
```typescript
// src/components/admin/DepartmentalPermissionsManager.tsx
<DepartmentalPermissionsManager
  companyId={user.company_id}
  onPermissionChange={handlePermissionChange}
  onDepartmentCreate={handleDepartmentCreate}
/>
```

### **Funcionalidades UI:**
- ✅ Crear/editar departamentos
- ✅ Asignar permisos granulares
- ✅ Gestionar miembros de departamento
- ✅ Configurar acceso a datos
- ✅ Visualizar auditoría de cambios
- ✅ Exportar configuración

## 📈 **Métricas y Monitoreo**

### **KPIs del Sistema:**
- Número de departamentos por empresa
- Distribución de permisos por departamento
- Frecuencia de cambios de permisos
- Acceso a datos sensibles
- Tiempo de respuesta de verificaciones

### **Alertas Automáticas:**
- Cambios en permisos críticos
- Acceso a datos sensibles fuera de horario
- Múltiples intentos de acceso denegado
- Creación de departamentos con permisos elevados

## 🔄 **Flujo de Trabajo**

### **1. Configuración Inicial:**
```typescript
// Crear departamentos base según tipo de empresa
const baseDepartments = getBaseDepartments(companyType);
await createDepartments(companyId, baseDepartments);
```

### **2. Asignación de Permisos:**
```typescript
// Asignar permisos específicos por departamento
await assignDepartmentPermissions(departmentId, permissions);
```

### **3. Gestión de Miembros:**
```typescript
// Agregar usuarios a departamentos
await addUserToDepartment(userId, departmentId, role);
```

### **4. Verificación de Acceso:**
```typescript
// Verificar permisos en tiempo real
const hasPermission = await checkUserPermission(userId, 'read.projects');
```

## 🚀 **Próximos Pasos**

### **Fase 2 - Funcionalidades Avanzadas:**
- [ ] Permisos temporales con expiración
- [ ] Delegación de permisos
- [ ] Plantillas de permisos por industria
- [ ] Análisis de uso de permisos
- [ ] Integración con workflows

### **Fase 3 - Optimización:**
- [ ] Cache de permisos en Redis
- [ ] Índices optimizados para consultas frecuentes
- [ ] Compresión de logs históricos
- [ ] API GraphQL para consultas complejas

## 📚 **Documentación Relacionada**

- [SQL Migration Troubleshooting](./SQL_MIGRATION_TROUBLESHOOTING.md)
- [Common SQL Errors](./COMMON_SQL_ERRORS.md)
- [Security Implementation](./SECURITY.md)
- [API Documentation](./API.md)

---

**🎯 Estado Actual:** ✅ **SISTEMA COMPLETAMENTE FUNCIONAL**

**🔗 Archivos Principales:**
- `supabase/migrations/20250618130000_create_departmental_permission_system.sql`
- `src/hooks/useDepartmentalPermissions.tsx`
- `src/components/admin/DepartmentalPermissionsManager.tsx`
- `src/types/departments.ts` 