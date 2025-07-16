# FAQ: 002-Roles y Permisos en AI Pair Orchestrator Pro

## 🎯 **PREGUNTA PRINCIPAL**
**P:** ¿Cuáles son los roles en AI Pair Orchestrator Pro y cómo se organizan?

**A:** AI Pair Orchestrator Pro tiene una estructura de roles clara y organizada que separa los roles internos de AI Pair de los roles de empresa cliente, usando postfijos `_AP` (AI Pair) y `_CUST` (Customer) para evitar confusiones.

## 📋 **ESTRUCTURA DE ROLES**

### **🏢 ROLES DE AI PAIR INTERNO (_AP)**

#### **1. SUPER_ADMIN_AP** 👑
- **Descripción**: Administrador de plataforma con acceso completo
- **Responsabilidades**:
  - Gestión global de la plataforma
  - Configuración de planes y facturación
  - Acceso a todas las empresas
  - Configuración del sistema
- **Permisos principales**:
  - `access_all_companies` - Acceso a todas las empresas
  - `manage_platform_settings` - Configuración de plataforma
  - `create_modify_plans` - Crear y modificar planes
  - `platform_billing_control` - Control de facturación
- **Restricciones**: Ninguna
- **Puede gestionar**: Todos los roles

#### **2. SUPPORT_AP** 🛠️
- **Descripción**: Soporte técnico AI Pair con acceso limitado
- **Responsabilidades**:
  - Asistencia técnica a clientes
  - Troubleshooting de problemas
  - Ajustes temporales de límites
- **Permisos principales**:
  - `access_companies_for_support` - Acceso para soporte
  - `temporary_limit_adjustments` - Ajustes temporales
  - `support_ticket_management` - Gestión de tickets
- **Restricciones**:
  - No puede crear/modificar planes
  - No puede cambiar configuraciones de plataforma
  - Solo ajustes temporales
- **Puede gestionar**: Solo asistencia (no gestión directa)

#### **3. DEVELOPER_AP** 💻
- **Descripción**: Desarrollador interno de AI Pair
- **Responsabilidades**:
  - Desarrollo de funcionalidades
  - Testing y deployment
  - Mantenimiento técnico
- **Permisos principales**:
  - `access_development_tools` - Herramientas de desarrollo
  - `deploy_code` - Despliegue de código
  - `access_logs` - Acceso a logs
- **Restricciones**:
  - No puede acceder a datos de clientes
  - No puede modificar configuraciones de producción
- **Puede gestionar**: Nadie

#### **4. MANAGER_AP** 👥
- **Descripción**: Manager interno de AI Pair
- **Responsabilidades**:
  - Gestión de equipos internos
  - Reportes internos
  - Gestión de proyectos
- **Permisos principales**:
  - `manage_internal_teams` - Gestión de equipos internos
  - `internal_reporting` - Reportes internos
  - `project_management` - Gestión de proyectos
- **Restricciones**:
  - Solo gestión de equipos internos
  - No puede acceder a datos de clientes
- **Puede gestionar**: EMPLOYEE_AP

#### **5. EMPLOYEE_AP** 👤
- **Descripción**: Empleado interno de AI Pair
- **Responsabilidades**:
  - Operaciones internas
  - Uso de herramientas internas
  - Colaboración interna
- **Permisos principales**:
  - `internal_tools_access` - Acceso a herramientas internas
  - `basic_reporting` - Reportes básicos
  - `collaboration_tools` - Herramientas de colaboración
- **Restricciones**:
  - Solo herramientas internas
  - No puede acceder a datos de clientes
- **Puede gestionar**: Nadie

### **🏢 ROLES DE EMPRESA CLIENTE (_CUST)**

#### **1. OWNER_CUST** 👔
- **Descripción**: Propietario de empresa cliente con control total
- **Responsabilidades**:
  - Control total de su empresa
  - Gestión de facturación
  - Configuración de planes
  - Gestión de usuarios
- **Permisos principales**:
  - `full_company_control` - Control total de empresa
  - `billing_management` - Gestión de facturación
  - `plan_configuration` - Configuración de planes
  - `user_management` - Gestión de usuarios
- **Restricciones**:
  - Solo acceso a su empresa
  - No puede acceder a otras empresas
- **Puede gestionar**: ADMIN_CUST, MANAGER_CUST, EMPLOYEE_CUST

#### **2. ADMIN_CUST** ⚙️
- **Descripción**: Administrador de empresa cliente
- **Responsabilidades**:
  - Gestión de usuarios de empresa
  - Monitoreo de uso de IA
  - Gestión de integraciones
  - Administración de workflows
- **Permisos principales**:
  - `company_user_management` - Gestión de usuarios
  - `ai_usage_monitoring` - Monitoreo de IA
  - `integrations_management` - Gestión de integraciones
  - `workflow_administration` - Administración de workflows
- **Restricciones**:
  - No puede cambiar plan o facturación
  - No puede exportar datos completos
- **Puede gestionar**: MANAGER_CUST, EMPLOYEE_CUST

#### **3. MANAGER_CUST** 👥
- **Descripción**: Gerente de departamento cliente
- **Responsabilidades**:
  - Gestión de equipo
  - Funcionalidades avanzadas de IA
  - Creación de workflows
  - Reportes de equipo
- **Permisos principales**:
  - `team_management` - Gestión de equipo
  - `advanced_ai_features` - Funcionalidades avanzadas de IA
  - `workflow_creation` - Creación de workflows
  - `team_reporting` - Reportes de equipo
- **Restricciones**:
  - Solo gestión de su equipo
  - No puede administrar toda la empresa
- **Puede gestionar**: EMPLOYEE_CUST

#### **4. EMPLOYEE_CUST** 👤
- **Descripción**: Empleado de empresa cliente
- **Responsabilidades**:
  - Uso diario de la plataforma
  - Procesamiento de documentos
  - Workflows personales
  - Colaboración
- **Permisos principales**:
  - `basic_ai_access` - Acceso básico a IA
  - `document_processing` - Procesamiento de documentos
  - `personal_workflows` - Workflows personales
  - `collaboration_tools` - Herramientas de colaboración
- **Restricciones**:
  - Solo funcionalidades básicas
  - No puede gestionar otros usuarios
- **Puede gestionar**: Nadie

## 🔄 **JERARQUÍA DE ROLES**

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

### **Reglas de Gestión**
- **SUPER_ADMIN_AP** puede gestionar todos los roles
- **SUPPORT_AP** solo puede asistir, no gestionar
- **OWNER_CUST** puede gestionar todos los roles de su empresa
- **ADMIN_CUST** puede gestionar MANAGER_CUST y EMPLOYEE_CUST
- **MANAGER_CUST** puede gestionar solo EMPLOYEE_CUST
- **EMPLOYEE_CUST** no puede gestionar a nadie

## 🔒 **SEGURIDAD Y AISLAMIENTO**

### **Multi-Tenancy**
- Cada empresa está completamente aislada
- Solo SUPER_ADMIN_AP y SUPPORT_AP pueden acceder a múltiples empresas
- Todos los datos están filtrados por `company_id`

### **Validación de Permisos**
```typescript
// Ejemplo de validación
if (isVibeThinkRole(user.role)) {
  // Usuario interno de AI Pair
  if (user.role === 'SUPER_ADMIN_AP') {
    // Acceso completo
  }
} else if (isCustomerRole(user.role)) {
  // Usuario de empresa cliente
  if (user.role === 'OWNER_CUST') {
    // Control total de su empresa
  }
}
```

## 📊 **CASOS DE USO COMUNES**

### **Para SUPER_ADMIN_AP**
- Configurar nuevos planes de suscripción
- Monitorear uso global de la plataforma
- Asistir a clientes con problemas complejos
- Configurar integraciones globales

### **Para SUPPORT_AP**
- Resolver tickets de soporte
- Ajustar límites temporales para clientes
- Monitorear uso de IA por empresa
- Asistir en configuración de integraciones

### **Para OWNER_CUST**
- Gestionar facturación de su empresa
- Configurar planes y límites
- Exportar datos de la empresa
- Gestionar todos los usuarios

### **Para ADMIN_CUST**
- Crear y gestionar usuarios
- Configurar integraciones
- Monitorear uso de IA
- Administrar workflows

### **Para MANAGER_CUST**
- Gestionar su equipo
- Crear workflows específicos
- Generar reportes de equipo
- Asignar recursos

### **Para EMPLOYEE_CUST**
- Usar herramientas de IA
- Procesar documentos
- Crear workflows personales
- Colaborar con el equipo

## 🔗 **RELACIONADAS**
- [FAQ: 003-Departamentos en Empresa Cliente](003-departments-organization.md)
- [FAQ: 004-Permisos y Seguridad](004-permissions-security.md)
- [Documento: Arquitectura de Roles](../ROLES_ARCHITECTURE.md)

## 📊 **MÉTRICAS**
- **Total de roles**: 9 roles (5 AI Pair + 4 Cliente)
- **Niveles de jerarquía**: 9 niveles
- **Separación clara**: 100% con postfijos
- **Seguridad**: Multi-tenant isolation garantizada 