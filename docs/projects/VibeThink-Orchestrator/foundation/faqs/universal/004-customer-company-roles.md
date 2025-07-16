# FAQ: 004-Roles en Empresa Cliente

## 🎯 **PREGUNTA PRINCIPAL**
**P:** ¿Cuáles son los roles específicos que puede tener una empresa cliente en AI Pair Orchestrator Pro?

**A:** Las empresas cliente tienen 4 roles específicos (_CUST) que permiten una gestión escalable y segura, desde el propietario con control total hasta el empleado con acceso básico, todos dentro del aislamiento multi-tenant de su empresa.

## 📋 **ROLES DE EMPRESA CLIENTE (_CUST)**

### **1. OWNER_CUST** 👔 **Propietario**
**Descripción**: Propietario de empresa cliente con control total sobre su organización

#### **Responsabilidades Principales**
- **Control total** de la empresa
- **Gestión de facturación** y planes
- **Configuración empresarial** completa
- **Exportación de datos** de la empresa
- **Gestión de usuarios** de todos los niveles

#### **Permisos Específicos**
```typescript
const OWNER_CUST_PERMISSIONS = [
  'full_company_control',      // Control total de empresa
  'billing_management',        // Gestión de facturación
  'plan_configuration',        // Configuración de planes
  'user_management',           // Gestión de usuarios
  'export_company_data',       // Exportación de datos
  'company_settings'           // Configuración empresarial
];
```

#### **Casos de Uso Típicos**
- **Configurar plan** de suscripción
- **Gestionar facturación** mensual/anual
- **Exportar datos** para auditorías
- **Configurar integraciones** empresariales
- **Definir políticas** de uso de IA

#### **Restricciones**
- ❌ Solo acceso a su empresa
- ❌ No puede acceder a otras empresas
- ❌ No puede modificar configuraciones de plataforma

---

### **2. ADMIN_CUST** ⚙️ **Administrador**
**Descripción**: Administrador de empresa cliente con permisos de gestión avanzados

#### **Responsabilidades Principales**
- **Gestión de usuarios** de la empresa
- **Monitoreo de uso** de IA
- **Gestión de integraciones** con sistemas externos
- **Administración de workflows** empresariales
- **Reportes** de empresa

#### **Permisos Específicos**
```typescript
const ADMIN_CUST_PERMISSIONS = [
  'company_user_management',     // Gestión de usuarios
  'ai_usage_monitoring',         // Monitoreo de IA
  'integrations_management',     // Gestión de integraciones
  'workflow_administration',     // Administración de workflows
  'reporting_access',            // Acceso a reportes
  'company_configurations'       // Configuraciones de empresa
];
```

#### **Casos de Uso Típicos**
- **Crear nuevos usuarios** en la empresa
- **Asignar roles** y permisos
- **Configurar integraciones** (CRM, ERP, etc.)
- **Monitorear uso** de funcionalidades de IA
- **Generar reportes** de productividad

#### **Restricciones**
- ❌ No puede cambiar plan o facturación
- ❌ No puede exportar datos completos
- ❌ Solo gestión operativa, no estratégica

---

### **3. MANAGER_CUST** 👥 **Gerente**
**Descripción**: Gerente de departamento cliente con permisos de gestión y funcionalidades avanzadas

#### **Responsabilidades Principales**
- **Gestión de equipo** asignado
- **Funcionalidades avanzadas** de IA
- **Creación de workflows** específicos
- **Reportes de equipo** y productividad
- **Supervisión de proyectos**

#### **Permisos Específicos**
```typescript
const MANAGER_CUST_PERMISSIONS = [
  'team_management',           // Gestión de equipo
  'advanced_ai_features',      // Funcionalidades avanzadas de IA
  'workflow_creation',         // Creación de workflows
  'team_reporting',            // Reportes de equipo
  'project_oversight',         // Supervisión de proyectos
  'resource_allocation'        // Asignación de recursos
];
```

#### **Casos de Uso Típicos**
- **Gestionar equipo** de trabajo
- **Crear workflows** automatizados
- **Generar reportes** de productividad
- **Asignar recursos** y tareas
- **Supervisar proyectos** en curso

#### **Restricciones**
- ❌ Solo gestión de su equipo
- ❌ No puede administrar toda la empresa
- ❌ Funcionalidades AI limitadas al nivel de plan

---

### **4. EMPLOYEE_CUST** 👤 **Empleado**
**Descripción**: Empleado de empresa cliente con acceso a funcionalidades esenciales

#### **Responsabilidades Principales**
- **Uso diario** de la plataforma
- **Procesamiento de documentos** con IA
- **Workflows personales** y colaborativos
- **Herramientas de colaboración**
- **Reportes básicos** personales

#### **Permisos Específicos**
```typescript
const EMPLOYEE_CUST_PERMISSIONS = [
  'basic_ai_access',           // Acceso básico a IA
  'document_processing',       // Procesamiento de documentos
  'personal_workflows',        // Workflows personales
  'collaboration_tools',       // Herramientas de colaboración
  'basic_reporting',           // Reportes básicos
  'profile_management'         // Gestión de perfil personal
];
```

#### **Casos de Uso Típicos**
- **Usar herramientas** de IA para tareas diarias
- **Procesar documentos** automáticamente
- **Crear workflows** personales
- **Colaborar** con el equipo
- **Generar reportes** personales

#### **Restricciones**
- ❌ Solo funcionalidades básicas
- ❌ No puede gestionar otros usuarios
- ❌ Uso de AI limitado por plan

---

## 🔄 **JERARQUÍA DE ROLES CLIENTE**

### **Estructura Jerárquica**
```
OWNER_CUST (Nivel 6) - Control Total
    ↓
ADMIN_CUST (Nivel 7) - Gestión Operativa
    ↓
MANAGER_CUST (Nivel 8) - Gestión de Equipo
    ↓
EMPLOYEE_CUST (Nivel 9) - Uso Básico
```

### **Reglas de Gestión**
- **OWNER_CUST** puede gestionar: ADMIN_CUST, MANAGER_CUST, EMPLOYEE_CUST
- **ADMIN_CUST** puede gestionar: MANAGER_CUST, EMPLOYEE_CUST
- **MANAGER_CUST** puede gestionar: EMPLOYEE_CUST
- **EMPLOYEE_CUST** no puede gestionar a nadie

### **Herencia de Permisos**
- **OWNER_CUST** hereda permisos de: ADMIN_CUST, MANAGER_CUST, EMPLOYEE_CUST
- **ADMIN_CUST** hereda permisos de: MANAGER_CUST, EMPLOYEE_CUST
- **MANAGER_CUST** hereda permisos de: EMPLOYEE_CUST
- **EMPLOYEE_CUST** no hereda permisos

---

## 🏢 **CASOS DE USO POR TIPO DE EMPRESA**

### **Startup (5-20 empleados)**
```
OWNER_CUST: CEO/Founder
ADMIN_CUST: CTO/Operations Manager
MANAGER_CUST: Team Leads
EMPLOYEE_CUST: Developers, Sales, Marketing
```

### **PYME (20-100 empleados)**
```
OWNER_CUST: Director General
ADMIN_CUST: Gerente de IT, Gerente de Operaciones
MANAGER_CUST: Jefes de Departamento
EMPLOYEE_CUST: Empleados de cada departamento
```

### **Empresa Mediana (100-500 empleados)**
```
OWNER_CUST: CEO/Presidente
ADMIN_CUST: CIO, Director de Operaciones
MANAGER_CUST: Gerentes de Área
EMPLOYEE_CUST: Empleados por área
```

### **Empresa Grande (500+ empleados)**
```
OWNER_CUST: CEO/Director General
ADMIN_CUST: CIO, Director de Transformación Digital
MANAGER_CUST: Gerentes de División
EMPLOYEE_CUST: Empleados por división
```

---

## 🔒 **SEGURIDAD Y AISLAMIENTO**

### **Multi-Tenancy Garantizado**
- Cada empresa está **completamente aislada**
- Los usuarios solo ven datos de **su empresa**
- **No hay acceso cruzado** entre empresas
- **Auditoría completa** de todas las acciones

### **Validación de Permisos**
```typescript
// Ejemplo de validación
function validateCustomerAccess(user: User, companyId: string): boolean {
  // Verificar que el usuario pertenece a la empresa
  if (user.company_id !== companyId) return false;
  
  // Verificar que es un rol de cliente
  if (!isCustomerRole(user.role)) return false;
  
  return true;
}
```

### **Políticas de Seguridad**
- **Autenticación obligatoria** para todas las operaciones
- **Autorización basada en roles** y permisos
- **Audit logging** de todas las acciones
- **Encriptación** de datos sensibles

---

## 📊 **MÉTRICAS Y REPORTES**

### **Métricas por Rol**
- **OWNER_CUST**: ROI empresarial, uso de plataforma
- **ADMIN_CUST**: Eficiencia operacional, adopción de usuarios
- **MANAGER_CUST**: Productividad de equipo, cumplimiento de objetivos
- **EMPLOYEE_CUST**: Productividad personal, uso de herramientas

### **Reportes Disponibles**
- **Dashboard Ejecutivo** (OWNER_CUST)
- **Reporte de Operaciones** (ADMIN_CUST)
- **Reporte de Equipo** (MANAGER_CUST)
- **Reporte Personal** (EMPLOYEE_CUST)

---

## 🚀 **IMPLEMENTACIÓN Y MIGRACIÓN**

### **Proceso de Onboarding**
1. **Crear empresa** en la plataforma
2. **Asignar OWNER_CUST** al propietario
3. **Configurar estructura** de departamentos
4. **Crear usuarios** con roles apropiados
5. **Configurar integraciones** necesarias

### **Migración de Usuarios Existentes**
```typescript
// Ejemplo de migración
const migrationMap = {
  'CEO': 'OWNER_CUST',
  'Manager': 'ADMIN_CUST',
  'Team Lead': 'MANAGER_CUST',
  'Employee': 'EMPLOYEE_CUST'
};
```

---

## 🔗 **RELACIONADAS**
- [FAQ: 002-Roles y Permisos](002-roles-and-permissions.md)
- [FAQ: 003-Organización de Departamentos](003-departments-organization.md)
- [Documento: Arquitectura Multi-Tenant](../MULTI_TENANT_ARCHITECTURE.md)

## 📊 **MÉTRICAS**
- **Total de roles cliente**: 4 roles (_CUST)
- **Niveles de jerarquía**: 4 niveles
- **Seguridad**: 100% multi-tenant isolation
- **Flexibilidad**: Escalable según tamaño de empresa
- **Adopción**: Compatible con cualquier estructura organizacional 