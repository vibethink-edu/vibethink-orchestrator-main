# FAQ: 005-Roles Internos de AI Pair

## 🎯 **PREGUNTA PRINCIPAL**
**P:** ¿Cuáles son los roles internos de AI Pair y cómo se organizan para gestionar la plataforma?

**A:** AI Pair tiene 5 roles internos (_AP) que permiten una gestión eficiente de la plataforma, desde el Super Administrador con control total hasta el Empleado interno con acceso básico, todos enfocados en el desarrollo, soporte y operación de la plataforma.

## 📋 **ROLES INTERNOS DE AI PAIR (_AP)**

### **1. SUPER_ADMIN_AP** 👑 **Super Administrador**
**Descripción**: Administrador de plataforma con acceso completo a todas las funcionalidades

#### **Responsabilidades Principales**
- **Gestión global** de la plataforma
- **Configuración de planes** y facturación
- **Monitoreo global** de todas las empresas
- **Configuración del sistema** y políticas
- **Soporte cross-tenant** avanzado

#### **Permisos Específicos**
```typescript
const SUPER_ADMIN_AP_PERMISSIONS = [
  'access_all_companies',           // Acceso a todas las empresas
  'manage_platform_settings',       // Configuración de plataforma
  'view_global_analytics',          // Analíticas globales
  'manage_super_admin_features',    // Funcionalidades de super admin
  'system_configuration',           // Configuración del sistema
  'cross_tenant_support',           // Soporte cross-tenant
  'create_modify_plans',            // Crear y modificar planes
  'platform_billing_control'        // Control de facturación
];
```

#### **Casos de Uso Típicos**
- **Configurar nuevos planes** de suscripción
- **Monitorear uso global** de la plataforma
- **Asistir clientes** con problemas complejos
- **Configurar integraciones** globales
- **Gestionar facturación** de la plataforma

#### **Restricciones**
- ✅ **Sin restricciones** - Control total
- ✅ **Acceso completo** a todas las empresas
- ✅ **Modificación** de configuraciones de plataforma

---

### **2. SUPPORT_AP** 🛠️ **Soporte Técnico**
**Descripción**: Personal de soporte VibeThink con acceso limitado para asistir empresas

#### **Responsabilidades Principales**
- **Asistencia técnica** a clientes
- **Troubleshooting** de problemas
- **Ajustes temporales** de límites
- **Gestión de tickets** de soporte
- **Monitoreo de uso** de IA por empresa

#### **Permisos Específicos**
```typescript
const SUPPORT_AP_PERMISSIONS = [
  'access_companies_for_support',    // Acceso para soporte
  'view_company_analytics',          // Ver analíticas de empresa
  'temporary_limit_adjustments',     // Ajustes temporales
  'technical_support_tools',         // Herramientas de soporte
  'read_company_configurations',     // Leer configuraciones
  'support_ticket_management',       // Gestión de tickets
  'limited_user_assistance',         // Asistencia limitada
  'view_ai_usage_logs'              // Ver logs de uso de IA
];
```

#### **Casos de Uso Típicos**
- **Resolver tickets** de soporte técnico
- **Ajustar límites temporales** para clientes
- **Monitorear uso** de IA por empresa
- **Asistir en configuración** de integraciones
- **Escalar problemas** complejos a SUPER_ADMIN_AP

#### **Restricciones**
- ❌ No puede crear o modificar planes
- ❌ No puede cambiar configuraciones de plataforma
- ❌ No puede acceder a facturación de plataforma
- ❌ Solo ajustes temporales
- ❌ Acceso de solo lectura a configuraciones críticas

---

### **3. DEVELOPER_AP** 💻 **Desarrollador**
**Descripción**: Desarrollador interno de AI Pair con acceso técnico

#### **Responsabilidades Principales**
- **Desarrollo** de nuevas funcionalidades
- **Testing** y deployment de código
- **Mantenimiento técnico** de la plataforma
- **Gestión de integraciones** técnicas
- **Monitoreo** de sistemas

#### **Permisos Específicos**
```typescript
const DEVELOPER_AP_PERMISSIONS = [
  'access_development_tools',        // Herramientas de desarrollo
  'deploy_code',                     // Despliegue de código
  'access_logs',                     // Acceso a logs
  'manage_integrations',             // Gestión de integraciones
  'testing_tools',                   // Herramientas de testing
  'monitoring_access'                // Acceso a monitoreo
];
```

#### **Casos de Uso Típicos**
- **Desarrollar nuevas funcionalidades** de la plataforma
- **Realizar deployments** en ambientes de desarrollo
- **Monitorear logs** y métricas del sistema
- **Configurar integraciones** técnicas
- **Realizar testing** de nuevas features

#### **Restricciones**
- ❌ No puede acceder a datos de clientes
- ❌ No puede modificar configuraciones de producción
- ❌ Acceso limitado a herramientas de desarrollo
- ❌ Solo ambientes de desarrollo y staging

---

### **4. MANAGER_AP** 👥 **Manager Interno**
**Descripción**: Manager interno de AI Pair con gestión de equipos internos

#### **Responsabilidades Principales**
- **Gestión de equipos** internos de AI Pair
- **Reportes internos** de productividad
- **Gestión de proyectos** internos
- **Asignación de recursos** internos
- **Coordinación** entre equipos

#### **Permisos Específicos**
```typescript
const MANAGER_AP_PERMISSIONS = [
  'manage_internal_teams',           // Gestión de equipos internos
  'internal_reporting',              // Reportes internos
  'project_management',              // Gestión de proyectos
  'resource_allocation'              // Asignación de recursos
];
```

#### **Casos de Uso Típicos**
- **Gestionar equipos** de desarrollo y soporte
- **Generar reportes** de productividad interna
- **Coordinar proyectos** de desarrollo
- **Asignar recursos** a diferentes iniciativas
- **Supervisar** el trabajo de EMPLOYEE_AP

#### **Restricciones**
- ❌ Solo gestión de equipos internos
- ❌ No puede acceder a datos de clientes
- ❌ No puede modificar configuraciones de plataforma
- ❌ Solo reportes y gestión interna

---

### **5. EMPLOYEE_AP** 👤 **Empleado Interno**
**Descripción**: Empleado interno de AI Pair con acceso básico

#### **Responsabilidades Principales**
- **Operaciones internas** de AI Pair
- **Uso de herramientas** internas
- **Colaboración interna** con equipos
- **Reportes básicos** internos
- **Soporte** a equipos internos

#### **Permisos Específicos**
```typescript
const EMPLOYEE_AP_PERMISSIONS = [
  'internal_tools_access',           // Acceso a herramientas internas
  'basic_reporting',                 // Reportes básicos
  'collaboration_tools'              // Herramientas de colaboración
];
```

#### **Casos de Uso Típicos**
- **Usar herramientas** internas de AI Pair
- **Generar reportes** básicos internos
- **Colaborar** con equipos internos
- **Soporte** a procesos internos
- **Participar** en proyectos internos

#### **Restricciones**
- ❌ Solo herramientas internas
- ❌ No puede acceder a datos de clientes
- ❌ Funcionalidades limitadas
- ❌ Solo operaciones internas

---

## 🔄 **JERARQUÍA DE ROLES INTERNOS**

### **Estructura Jerárquica**
```
SUPER_ADMIN_AP (Nivel 1) - Control Total
    ↓
SUPPORT_AP (Nivel 2) - Soporte Técnico
    ↓
DEVELOPER_AP (Nivel 3) - Desarrollo
    ↓
MANAGER_AP (Nivel 4) - Gestión Interna
    ↓
EMPLOYEE_AP (Nivel 5) - Operaciones Internas
```

### **Reglas de Gestión**
- **SUPER_ADMIN_AP** puede gestionar: Todos los roles
- **SUPPORT_AP** solo puede asistir, no gestionar
- **DEVELOPER_AP** solo puede desarrollar, no gestionar
- **MANAGER_AP** puede gestionar: EMPLOYEE_AP
- **EMPLOYEE_AP** no puede gestionar a nadie

### **Flujo de Escalamiento**
```
EMPLOYEE_AP → MANAGER_AP → DEVELOPER_AP → SUPPORT_AP → SUPER_ADMIN_AP
```

---

## 🏢 **ORGANIZACIÓN INTERNA DE AI PAIR**

### **Estructura de Equipos**
```
🏢 AI PAIR PLATFORM
├── 👑 SUPER_ADMIN_AP (CEO/CTO)
├── 🛠️ SUPPORT_AP (Equipo de Soporte)
├── 💻 DEVELOPER_AP (Equipo de Desarrollo)
├── 👥 MANAGER_AP (Equipo de Gestión)
└── 👤 EMPLOYEE_AP (Equipo Operativo)
```

### **Departamentos Internos**
- **Tecnología**: DEVELOPER_AP, MANAGER_AP
- **Soporte**: SUPPORT_AP
- **Operaciones**: EMPLOYEE_AP
- **Estrategia**: SUPER_ADMIN_AP

---

## 🔒 **SEGURIDAD INTERNA**

### **Aislamiento de Datos**
- **SUPPORT_AP** puede acceder a datos de clientes solo para soporte
- **DEVELOPER_AP** no puede acceder a datos de clientes
- **MANAGER_AP** y **EMPLOYEE_AP** solo datos internos
- **SUPER_ADMIN_AP** acceso completo con auditoría

### **Políticas de Seguridad**
```typescript
// Ejemplo de validación interna
function validateInternalAccess(user: User, action: string): boolean {
  // Verificar que es usuario interno de AI Pair
  if (!isVibeThinkRole(user.role)) return false;
  
  // Verificar que pertenece a VibeThink-platform
  if (user.company_id !== 'VibeThink-platform-id') return false;
  
  // Validar permisos específicos
  return hasPermission(user.role, action);
}
```

### **Auditoría Obligatoria**
- **Todas las acciones** de SUPER_ADMIN_AP son auditadas
- **Accesos a datos de clientes** por SUPPORT_AP son registrados
- **Deployments** de DEVELOPER_AP son monitoreados
- **Cambios de configuración** requieren aprobación

---

## 📊 **MÉTRICAS Y REPORTES INTERNOS**

### **Métricas por Rol**
- **SUPER_ADMIN_AP**: Eficiencia global de la plataforma
- **SUPPORT_AP**: Tiempo de resolución, satisfacción del cliente
- **DEVELOPER_AP**: Velocidad de desarrollo, calidad del código
- **MANAGER_AP**: Productividad de equipos internos
- **EMPLOYEE_AP**: Eficiencia operacional interna

### **Reportes Internos**
- **Dashboard Ejecutivo** (SUPER_ADMIN_AP)
- **Reporte de Soporte** (SUPPORT_AP)
- **Reporte de Desarrollo** (DEVELOPER_AP)
- **Reporte de Gestión** (MANAGER_AP)
- **Reporte Operacional** (EMPLOYEE_AP)

---

## 🚀 **DESARROLLO Y OPERACIONES**

### **Flujo de Desarrollo**
```
DEVELOPER_AP → MANAGER_AP → SUPER_ADMIN_AP → Producción
```

### **Flujo de Soporte**
```
Cliente → SUPPORT_AP → DEVELOPER_AP → SUPER_ADMIN_AP
```

### **Flujo de Operaciones**
```
EMPLOYEE_AP → MANAGER_AP → SUPER_ADMIN_AP
```

---

## 🔗 **RELACIONADAS**
- [FAQ: 002-Roles y Permisos](002-roles-and-permissions.md)
- [FAQ: 004-Roles en Empresa Cliente](004-customer-company-roles.md)
- [Documento: Arquitectura de Seguridad](../SECURITY_ARCHITECTURE.md)

## 📊 **MÉTRICAS**
- **Total de roles internos**: 5 roles (_AP)
- **Niveles de jerarquía**: 5 niveles
- **Seguridad**: Auditoría completa obligatoria
- **Escalamiento**: Flujo claro de escalamiento
- **Eficiencia**: Roles especializados por función 