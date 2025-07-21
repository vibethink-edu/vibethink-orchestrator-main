---
id: setup
title: Configuración Inicial
sidebar_label: Configuración Inicial
---

# Configuración Inicial de tu Empresa

Esta guía te ayudará a configurar tu empresa en VibeThink paso a paso.

## 🚀 Paso 1: Crear Cuenta

### **Registro de Empresa**
1. Ve a [app.vibethink.ai](https://app.vibethink.ai)
2. Haz clic en "Crear Empresa"
3. Completa la información básica:
   - **Nombre de la empresa**
   - **Email del administrador**
   - **Contraseña segura**
   - **Plan inicial** (Free, Pro, Enterprise)

### **Verificación de Email**
- Revisa tu bandeja de entrada
- Haz clic en el enlace de verificación
- Completa el proceso de activación

## 🏢 Paso 2: Configurar Empresa

### **Información de la Empresa**
```typescript
// Ejemplo de configuración
const companyConfig = {
  name: "Mi Empresa S.A.",
  industry: "Technology",
  size: "10-50 employees",
  timezone: "America/Mexico_City",
  language: "es"
};
```

### **Configuraciones Importantes**
- **Zona horaria** - Para reportes y notificaciones
- **Idioma** - Español o Inglés
- **Industria** - Para personalización de features
- **Tamaño** - Para recomendaciones de plan

## 👥 Paso 3: Invitar Usuarios

### **Roles de Usuario**
```typescript
const userRoles = {
  EMPLOYEE: "Usuario básico - Acceso limitado",
  MANAGER: "Supervisor - Gestión de equipo",
  ADMIN: "Administrador - Configuración completa",
  OWNER: "Propietario - Control total"
};
```

### **Proceso de Invitación**
1. Ve a **Usuarios** → **Invitar Usuario**
2. Completa la información:
   - **Email del usuario**
   - **Rol asignado**
   - **Departamento** (opcional)
3. El usuario recibirá un email de invitación
4. Deberá crear su contraseña al aceptar

## ⚙️ Paso 4: Configurar Integraciones

### **Integraciones Disponibles**
- **Slack** - Notificaciones en tiempo real
- **Google Workspace** - Calendario y documentos
- **Microsoft 365** - Office y Teams
- **Zapier** - Automatizaciones personalizadas

### **Configuración de Webhooks**
```typescript
// Ejemplo de webhook
const webhookConfig = {
  url: "https://tu-app.com/webhook",
  events: ["user.created", "project.completed"],
  secret: "tu-secret-key"
};
```

## 📊 Paso 5: Configurar Reportes

### **Reportes Predeterminados**
- **Actividad de usuarios**
- **Uso de recursos**
- **Progreso de proyectos**
- **Análisis de productividad**

### **Reportes Personalizados**
```typescript
// Ejemplo de reporte personalizado
const customReport = {
  name: "Productividad por Departamento",
  metrics: ["tasks.completed", "time.spent"],
  filters: ["department", "date_range"],
  schedule: "weekly"
};
```

## 🔐 Paso 6: Configurar Seguridad

### **Políticas de Contraseñas**
- **Longitud mínima**: 8 caracteres
- **Complejidad**: Mayúsculas, minúsculas, números
- **Expiración**: 90 días
- **Reutilización**: No permitida

### **Autenticación de Dos Factores**
- **Obligatoria** para ADMIN y OWNER
- **Opcional** para MANAGER y EMPLOYEE
- **Métodos**: SMS, Email, App (Google Authenticator)

## ✅ Paso 7: Verificar Configuración

### **Checklist de Verificación**
- [ ] **Cuenta creada** y verificada
- [ ] **Información de empresa** completa
- [ ] **Usuarios invitados** y activos
- [ ] **Integraciones** configuradas
- [ ] **Reportes** funcionando
- [ ] **Seguridad** implementada

### **Próximos Pasos**
1. **[Guías de Usuario](/docs/user-guides)** - Aprende a usar las features
2. **[Administración](/docs/company-admin)** - Gestiona tu empresa
3. **[Troubleshooting](/docs/troubleshooting)** - Soluciona problemas

---

**¿Necesitas ayuda?** [Contacta soporte →](/docs/contact) 