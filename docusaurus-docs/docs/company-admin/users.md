---
id: users
title: Gestión de Usuarios
sidebar_label: Usuarios
---

# 👥 **GESTIÓN DE USUARIOS**

## 🎯 **Resumen**

La gestión de usuarios en VibeThink te permite administrar quién tiene acceso a tu plataforma y qué pueden hacer.

## 👤 **Roles de Usuario**

### **EMPLOYEE (Empleado)**
- ✅ **Acceso básico** a funcionalidades
- ✅ **Ver perfil propio** y datos personales
- ✅ **Usar herramientas** asignadas
- ✅ **Reportar problemas** y solicitar soporte

### **MANAGER (Gerente)**
- ✅ **Gestionar equipo** de trabajo
- ✅ **Ver reportes** de rendimiento
- ✅ **Asignar tareas** y proyectos
- ✅ **Aprobar solicitudes** del equipo

### **ADMIN (Administrador)**
- ✅ **Gestionar usuarios** de la empresa
- ✅ **Configurar** parámetros del sistema
- ✅ **Ver reportes** de facturación
- ✅ **Administrar** integraciones

### **OWNER (Propietario)**
- ✅ **Gestión completa** de la empresa
- ✅ **Configurar planes** y facturación
- ✅ **Acceso a analytics** avanzados
- ✅ **Administrar** configuraciones críticas

## ➕ **Invitar Usuarios**

### **Paso 1: Acceder a Gestión de Usuarios**
1. **Inicia sesión** en VibeThink
2. **Ve a** Administración → Usuarios
3. **Haz clic** en "Invitar Usuario"

### **Paso 2: Completar Información**
```typescript
// ✅ Información requerida
const userInvitation = {
  email: "usuario@empresa.com",
  role: "EMPLOYEE | MANAGER | ADMIN | OWNER",
  department: "Opcional",
  sendInvitation: true
};
```

### **Paso 3: Envío de Invitación**
- ✅ **Email automático** con enlace de invitación
- ✅ **Instrucciones claras** para el usuario
- ✅ **Vencimiento** de 7 días
- ✅ **Reenvío** disponible si es necesario

## ⚙️ **Gestionar Usuarios Existentes**

### **Ver Lista de Usuarios**
- ✅ **Filtros** por rol, departamento, estado
- ✅ **Búsqueda** por nombre o email
- ✅ **Ordenamiento** por diferentes criterios
- ✅ **Exportación** de datos

### **Editar Usuario**
```typescript
// ✅ Campos editables
const editableFields = {
  name: "Nombre completo",
  role: "Rol en la empresa",
  department: "Departamento",
  permissions: "Permisos específicos",
  status: "Activo/Inactivo"
};
```

### **Cambiar Rol**
1. **Selecciona** el usuario
2. **Haz clic** en "Editar"
3. **Cambia** el rol
4. **Confirma** los cambios
5. **Notifica** al usuario

## 🔐 **Permisos y Seguridad**

### **Permisos por Rol**
```typescript
// ✅ Matriz de permisos
const permissionsMatrix = {
  EMPLOYEE: {
    read: ["own_profile", "assigned_tasks"],
    write: ["own_profile", "task_updates"],
    delete: ["own_content"]
  },
  MANAGER: {
    read: ["team_data", "project_reports"],
    write: ["team_assignments", "approvals"],
    delete: ["team_content"]
  },
  ADMIN: {
    read: ["all_users", "system_reports"],
    write: ["user_management", "system_config"],
    delete: ["user_accounts"]
  },
  OWNER: {
    read: ["everything"],
    write: ["everything"],
    delete: ["everything"]
  }
};
```

### **Configurar Permisos Específicos**
1. **Ve a** Usuario → Permisos
2. **Selecciona** los permisos necesarios
3. **Guarda** la configuración
4. **Notifica** al usuario

## 📊 **Monitoreo de Actividad**

### **Reportes de Usuario**
- ✅ **Actividad reciente** - Últimas acciones
- ✅ **Tiempo de sesión** - Duración de uso
- ✅ **Funcionalidades usadas** - Features más utilizadas
- ✅ **Problemas reportados** - Issues y tickets

### **Alertas de Seguridad**
```typescript
// ✅ Alertas automáticas
const securityAlerts = {
  failedLogins: "Múltiples intentos fallidos",
  unusualActivity: "Actividad inusual",
  permissionChanges: "Cambios de permisos",
  accountLocked: "Cuenta bloqueada"
};
```

## 🚫 **Desactivar Usuarios**

### **Desactivación Temporal**
1. **Selecciona** el usuario
2. **Haz clic** en "Desactivar"
3. **Selecciona** motivo
4. **Confirma** la acción
5. **Notifica** al usuario

### **Eliminación Permanente**
- ⚠️ **Solo para OWNER**
- ⚠️ **Requiere confirmación**
- ⚠️ **Backup automático** de datos
- ⚠️ **Audit trail** completo

## 🔄 **Sincronización**

### **Integración con Active Directory**
- ✅ **Sincronización automática** de usuarios
- ✅ **Mapeo de grupos** a roles
- ✅ **Actualización automática** de cambios
- ✅ **Logs de sincronización**

### **SSO (Single Sign-On)**
```typescript
// ✅ Configuración SSO
const ssoConfig = {
  provider: "SAML | OAuth | LDAP",
  domain: "empresa.com",
  autoProvisioning: true,
  roleMapping: "Automático"
};
```

## 📋 **Próximos Pasos**

### **Para Administradores:**
1. **[Configuración de Empresa](/docs/company-admin/settings)** - Configura tu empresa
2. **[Facturación](/docs/company-admin/billing)** - Gestiona planes y pagos
3. **[Integraciones](/docs/company-admin/integrations)** - Conecta herramientas externas

### **Para Usuarios:**
1. **[Dashboard](/docs/user-guides/dashboard-manual)** - Aprende a usar el dashboard
2. **[Troubleshooting](/docs/troubleshooting)** - Soluciona problemas
3. **[FAQ](/docs/faq)** - Preguntas frecuentes

---

**¿Necesitas ayuda?** [Contacta soporte →](/docs/contact) 