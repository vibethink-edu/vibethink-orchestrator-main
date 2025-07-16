# 🏗️ Roles y Organización - AI Pair Orchestrator Pro

## 📋 **Resumen Ejecutivo**

Este documento define la **estructura completa de roles y organización** de AI Pair Orchestrator Pro, implementando una separación clara entre roles internos de AI Pair (_AP) y roles de empresa cliente (_CUST) para garantizar seguridad, escalabilidad y claridad organizacional.

---

## 🎯 **ESTRUCTURA DE ROLES**

### **Separación por Postfijos**
- **`_AP`** = AI Pair (Roles internos de la plataforma)
- **`_CUST`** = Customer (Roles de empresa cliente)

### **Jerarquía Completa**
```
SUPER_ADMIN_AP (Nivel 1) - AI Pair
    ↓
SUPPORT_AP (Nivel 2) - AI Pair
    ↓
DEVELOPER_AP (Nivel 3) - AI Pair
    ↓
MANAGER_AP (Nivel 4) - AI Pair
    ↓
EMPLOYEE_AP (Nivel 5) - AI Pair
    ↓
OWNER_CUST (Nivel 6) - Empresa Cliente
    ↓
ADMIN_CUST (Nivel 7) - Empresa Cliente
    ↓
MANAGER_CUST (Nivel 8) - Empresa Cliente
    ↓
EMPLOYEE_CUST (Nivel 9) - Empresa Cliente
```

---

## 🏢 **ROLES DE AI PAIR INTERNO (_AP)**

### **1. SUPER_ADMIN_AP** 👑
**Descripción**: Administrador de plataforma con acceso completo

#### **Responsabilidades**
- Gestión global de la plataforma
- Configuración de planes y facturación
- Monitoreo global de todas las empresas
- Configuración del sistema y políticas
- Soporte cross-tenant avanzado

#### **Permisos Principales**
- `access_all_companies` - Acceso a todas las empresas
- `manage_platform_settings` - Configuración de plataforma
- `create_modify_plans` - Crear y modificar planes
- `platform_billing_control` - Control de facturación

#### **Casos de Uso**
- Configurar nuevos planes de suscripción
- Monitorear uso global de la plataforma
- Asistir clientes con problemas complejos
- Configurar integraciones globales

---

### **2. SUPPORT_AP** 🛠️
**Descripción**: Soporte técnico AI Pair con acceso limitado

#### **Responsabilidades**
- Asistencia técnica a clientes
- Troubleshooting de problemas
- Ajustes temporales de límites
- Gestión de tickets de soporte

#### **Permisos Principales**
- `access_companies_for_support` - Acceso para soporte
- `temporary_limit_adjustments` - Ajustes temporales
- `support_ticket_management` - Gestión de tickets

#### **Restricciones**
- No puede crear/modificar planes
- No puede cambiar configuraciones de plataforma
- Solo ajustes temporales

---

### **3. DEVELOPER_AP** 💻
**Descripción**: Desarrollador interno de AI Pair

#### **Responsabilidades**
- Desarrollo de nuevas funcionalidades
- Testing y deployment de código
- Mantenimiento técnico de la plataforma
- Gestión de integraciones técnicas

#### **Permisos Principales**
- `access_development_tools` - Herramientas de desarrollo
- `deploy_code` - Despliegue de código
- `access_logs` - Acceso a logs

#### **Restricciones**
- No puede acceder a datos de clientes
- No puede modificar configuraciones de producción

---

### **4. MANAGER_AP** 👥
**Descripción**: Manager interno de AI Pair

#### **Responsabilidades**
- Gestión de equipos internos
- Reportes internos de productividad
- Gestión de proyectos internos
- Coordinación entre equipos

#### **Permisos Principales**
- `manage_internal_teams` - Gestión de equipos internos
- `internal_reporting` - Reportes internos
- `project_management` - Gestión de proyectos

#### **Restricciones**
- Solo gestión de equipos internos
- No puede acceder a datos de clientes

---

### **5. EMPLOYEE_AP** 👤
**Descripción**: Empleado interno de AI Pair

#### **Responsabilidades**
- Operaciones internas de AI Pair
- Uso de herramientas internas
- Colaboración interna con equipos
- Soporte a procesos internos

#### **Permisos Principales**
- `internal_tools_access` - Acceso a herramientas internas
- `basic_reporting` - Reportes básicos
- `collaboration_tools` - Herramientas de colaboración

#### **Restricciones**
- Solo herramientas internas
- No puede acceder a datos de clientes

---

## 🏢 **ROLES DE EMPRESA CLIENTE (_CUST)**

### **1. OWNER_CUST** 👔
**Descripción**: Propietario de empresa cliente con control total

#### **Responsabilidades**
- Control total de su empresa
- Gestión de facturación y planes
- Configuración empresarial completa
- Exportación de datos de la empresa
- Gestión de usuarios de todos los niveles

#### **Permisos Principales**
- `full_company_control` - Control total de empresa
- `billing_management` - Gestión de facturación
- `plan_configuration` - Configuración de planes
- `user_management` - Gestión de usuarios

#### **Casos de Uso**
- Configurar plan de suscripción
- Gestionar facturación mensual/anual
- Exportar datos para auditorías
- Configurar integraciones empresariales

#### **Restricciones**
- Solo acceso a su empresa
- No puede acceder a otras empresas

---

### **2. ADMIN_CUST** ⚙️
**Descripción**: Administrador de empresa cliente

#### **Responsabilidades**
- Gestión de usuarios de empresa
- Monitoreo de uso de IA
- Gestión de integraciones
- Administración de workflows
- Reportes de empresa

#### **Permisos Principales**
- `company_user_management` - Gestión de usuarios
- `ai_usage_monitoring` - Monitoreo de IA
- `integrations_management` - Gestión de integraciones
- `workflow_administration` - Administración de workflows

#### **Casos de Uso**
- Crear nuevos usuarios en la empresa
- Asignar roles y permisos
- Configurar integraciones (CRM, ERP, etc.)
- Monitorear uso de funcionalidades de IA

#### **Restricciones**
- No puede cambiar plan o facturación
- No puede exportar datos completos

---

### **3. MANAGER_CUST** 👥
**Descripción**: Gerente de departamento cliente

#### **Responsabilidades**
- Gestión de equipo asignado
- Funcionalidades avanzadas de IA
- Creación de workflows específicos
- Reportes de equipo y productividad
- Supervisión de proyectos

#### **Permisos Principales**
- `team_management` - Gestión de equipo
- `advanced_ai_features` - Funcionalidades avanzadas de IA
- `workflow_creation` - Creación de workflows
- `team_reporting` - Reportes de equipo

#### **Casos de Uso**
- Gestionar equipo de trabajo
- Crear workflows automatizados
- Generar reportes de productividad
- Asignar recursos y tareas

#### **Restricciones**
- Solo gestión de su equipo
- No puede administrar toda la empresa

---

### **4. EMPLOYEE_CUST** 👤
**Descripción**: Empleado de empresa cliente

#### **Responsabilidades**
- Uso diario de la plataforma
- Procesamiento de documentos con IA
- Workflows personales y colaborativos
- Herramientas de colaboración
- Reportes básicos personales

#### **Permisos Principales**
- `basic_ai_access` - Acceso básico a IA
- `document_processing` - Procesamiento de documentos
- `personal_workflows` - Workflows personales
- `collaboration_tools` - Herramientas de colaboración

#### **Casos de Uso**
- Usar herramientas de IA para tareas diarias
- Procesar documentos automáticamente
- Crear workflows personales
- Colaborar con el equipo

#### **Restricciones**
- Solo funcionalidades básicas
- No puede gestionar otros usuarios

---

## 🏗️ **ORGANIZACIÓN DE DEPARTAMENTOS**

### **Estructura de Departamentos Estándar**
```
🏢 EMPRESA CLIENTE
├── 📧 manager@empresa.com → 🤖 Agente Manager (Coordinación)
├── 📧 soporte@empresa.com → 🤖 Agente Soporte
├── 📧 ventas@empresa.com → 🤖 Agente Ventas
├── 📧 marketing@empresa.com → 🤖 Agente Marketing
├── 📧 finanzas@empresa.com → 🤖 Agente Finanzas
├── 📧 legal@empresa.com → 🤖 Agente Legal
├── 📧 hr@empresa.com → 🤖 Agente RRHH
└── 📧 operaciones@empresa.com → 🤖 Agente Operaciones
```

### **Departamentos por Tipo de Empresa**

#### **Startup (5-20 empleados)**
```
OWNER_CUST: CEO/Founder
ADMIN_CUST: CTO/Operations Manager
MANAGER_CUST: Team Leads
EMPLOYEE_CUST: Developers, Sales, Marketing
```

#### **PYME (20-100 empleados)**
```
OWNER_CUST: Director General
ADMIN_CUST: Gerente de IT, Gerente de Operaciones
MANAGER_CUST: Jefes de Departamento
EMPLOYEE_CUST: Empleados de cada departamento
```

#### **Empresa Mediana (100-500 empleados)**
```
OWNER_CUST: CEO/Presidente
ADMIN_CUST: CIO, Director de Operaciones
MANAGER_CUST: Gerentes de Área
EMPLOYEE_CUST: Empleados por área
```

#### **Empresa Grande (500+ empleados)**
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
function validateAccess(user: User, action: string): boolean {
  // Verificar que es rol válido
  if (!isValidRole(user.role)) return false;
  
  // Verificar permisos específicos
  return hasPermission(user.role, action);
}

function isVibeThinkRole(role: UserRole): boolean {
  return role.endsWith('_AP');
}

function isCustomerRole(role: UserRole): boolean {
  return role.endsWith('_CUST');
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
- **SUPER_ADMIN_AP**: Eficiencia global de la plataforma
- **SUPPORT_AP**: Tiempo de resolución, satisfacción del cliente
- **DEVELOPER_AP**: Velocidad de desarrollo, calidad del código
- **MANAGER_AP**: Productividad de equipos internos
- **EMPLOYEE_AP**: Eficiencia operacional interna
- **OWNER_CUST**: ROI empresarial, uso de plataforma
- **ADMIN_CUST**: Eficiencia operacional, adopción de usuarios
- **MANAGER_CUST**: Productividad de equipo, cumplimiento de objetivos
- **EMPLOYEE_CUST**: Productividad personal, uso de herramientas

### **Reportes Disponibles**
- **Dashboard Ejecutivo** (SUPER_ADMIN_AP, OWNER_CUST)
- **Reporte de Operaciones** (ADMIN_CUST)
- **Reporte de Equipo** (MANAGER_CUST, MANAGER_AP)
- **Reporte Personal** (EMPLOYEE_CUST, EMPLOYEE_AP)
- **Reporte de Soporte** (SUPPORT_AP)
- **Reporte de Desarrollo** (DEVELOPER_AP)

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
// Mapeo de migración
const migrationMap = {
  'SUPER_ADMIN': 'SUPER_ADMIN_AP',
  'SUPPORT': 'SUPPORT_AP',
  'OWNER': 'OWNER_CUST',
  'ADMIN': 'ADMIN_CUST',
  'MANAGER': 'MANAGER_CUST',
  'EMPLOYEE': 'EMPLOYEE_CUST'
};
```

### **Validación Post-Migración**
- Verificar que todos los usuarios tienen roles válidos
- Confirmar que las políticas RLS funcionan correctamente
- Validar que la jerarquía de permisos es correcta
- Comprobar que el aislamiento multi-tenant se mantiene

---

## 🔗 **RELACIONADAS**
- [FAQ: 002-Roles y Permisos](foundation/faqs/universal/002-roles-and-permissions.md)
- [FAQ: 003-Organización de Departamentos](foundation/faqs/universal/003-departments-organization.md)
- [FAQ: 004-Roles en Empresa Cliente](foundation/faqs/universal/004-customer-company-roles.md)
- [FAQ: 005-Roles Internos de AI Pair](foundation/faqs/universal/005-ai-pair-internal-roles.md)
- [Documento: Arquitectura Multi-Tenant](MULTI_TENANT_ARCHITECTURE.md)
- [Documento: Arquitectura de Seguridad](SECURITY_ARCHITECTURE.md)

---

## 📊 **MÉTRICAS FINALES**
- **Total de roles**: 9 roles (5 AI Pair + 4 Cliente)
- **Niveles de jerarquía**: 9 niveles
- **Separación clara**: 100% con postfijos
- **Seguridad**: Multi-tenant isolation garantizada
- **Escalabilidad**: Compatible con cualquier tamaño de empresa
- **Flexibilidad**: Departamentos personalizables
- **Auditoría**: Logging completo de todas las acciones

---

**ÚLTIMA ACTUALIZACIÓN**: 23 de Junio, 2025  
**VERSIÓN**: 2.0.0 - Sistema de postfijos implementado  
**RESPONSABLE**: Equipo de Arquitectura AI Pair 