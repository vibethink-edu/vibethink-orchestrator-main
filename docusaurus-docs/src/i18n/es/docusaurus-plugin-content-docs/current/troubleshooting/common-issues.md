---
id: common-issues
title: Problemas Comunes
sidebar_label: Problemas Comunes
---

# 🔧 **SOLUCIÓN DE PROBLEMAS COMUNES**

## 🎯 **Resumen**

Esta guía te ayudará a resolver los problemas más frecuentes en VibeThink.

## 🔐 **Problemas de Autenticación**

### **No puedo iniciar sesión**

#### **Síntomas:**
- Error "Credenciales inválidas"
- Página de login no responde
- Redirección infinita

#### **Soluciones:**

**1. Verificar credenciales**
```typescript
// ✅ Checklist de verificación
const loginChecklist = {
  email: "Verificar que el email esté correcto",
  password: "Verificar que la contraseña sea correcta",
  capsLock: "Verificar que CAPS LOCK esté desactivado",
  browser: "Probar en navegador diferente"
};
```

**2. Resetear contraseña**
1. **Haz clic** en "¿Olvidaste tu contraseña?"
2. **Ingresa** tu email
3. **Revisa** tu bandeja de entrada
4. **Sigue** el enlace de reset
5. **Crea** nueva contraseña

**3. Verificar cuenta**
- ✅ **Email verificado** - Revisar bandeja de entrada
- ✅ **Cuenta activa** - Contactar administrador
- ✅ **Sin bloqueos** - Verificar intentos fallidos

### **Problemas con 2FA**

#### **Síntomas:**
- Código 2FA no funciona
- App de autenticación perdida
- Backup codes agotados

#### **Soluciones:**

**1. Verificar hora del dispositivo**
```typescript
// ✅ Sincronización de tiempo
const timeSync = {
  checkDeviceTime: "Verificar que la hora sea correcta",
  syncWithInternet: "Sincronizar con servidor de tiempo",
  restartApp: "Reiniciar app de autenticación"
};
```

**2. Usar backup codes**
1. **Accede** a la página de login
2. **Haz clic** en "Usar código de respaldo"
3. **Ingresa** uno de tus backup codes
4. **Configura** nueva app de autenticación

## 📊 **Problemas del Dashboard**

### **Dashboard no carga**

#### **Síntomas:**
- Página en blanco
- Spinner infinito
- Error 500

#### **Soluciones:**

**1. Verificar conexión**
```typescript
// ✅ Checklist de red
const networkCheck = {
  internet: "Verificar conexión a internet",
  firewall: "Verificar configuración de firewall",
  proxy: "Verificar configuración de proxy",
  dns: "Verificar resolución DNS"
};
```

**2. Limpiar caché**
1. **Abre** herramientas de desarrollador (F12)
2. **Ve a** Application → Storage
3. **Haz clic** en "Clear storage"
4. **Recarga** la página

**3. Verificar permisos**
- ✅ **Rol correcto** - Verificar que tengas acceso
- ✅ **Empresa activa** - Verificar estado de la empresa
- ✅ **Configuración** - Verificar widgets configurados

### **Datos no se actualizan**

#### **Síntomas:**
- Métricas desactualizadas
- Gráficos no cambian
- Información antigua

#### **Soluciones:**

**1. Forzar actualización**
```typescript
// ✅ Métodos de actualización
const refreshMethods = {
  manual: "Hacer clic en botón de actualizar",
  keyboard: "Presionar Ctrl+F5",
  browser: "Recargar página completa",
  cache: "Limpiar caché del navegador"
};
```

**2. Verificar configuración**
- ✅ **Intervalo de actualización** - Verificar configuración
- ✅ **Permisos de datos** - Verificar acceso a métricas
- ✅ **Filtros aplicados** - Verificar filtros activos

## 👥 **Problemas de Usuarios**

### **No puedo invitar usuarios**

#### **Síntomas:**
- Botón de invitar no funciona
- Email no se envía
- Error de permisos

#### **Soluciones:**

**1. Verificar permisos**
```typescript
// ✅ Permisos requeridos
const invitationPermissions = {
  role: "ADMIN o OWNER",
  company: "Empresa activa",
  plan: "Plan que permita más usuarios",
  quota: "Cupo de usuarios disponible"
};
```

**2. Verificar configuración de email**
- ✅ **SMTP configurado** - Verificar servidor de email
- ✅ **Dominio verificado** - Verificar dominio de empresa
- ✅ **Spam filters** - Verificar filtros de spam

### **Usuario no puede acceder**

#### **Síntomas:**
- Usuario reporta problemas de login
- Invitación expirada
- Cuenta bloqueada

#### **Soluciones:**

**1. Reenviar invitación**
```typescript
// ✅ Proceso de reenvío
const resendProcess = {
  selectUser: "Seleccionar usuario en lista",
  clickResend: "Hacer clic en 'Reenviar invitación'",
  verifyEmail: "Verificar que email sea correcto",
  checkSpam: "Revisar carpeta de spam"
};
```

**2. Verificar estado de cuenta**
- ✅ **Cuenta activa** - Verificar que no esté desactivada
- ✅ **Email verificado** - Verificar verificación de email
- ✅ **Sin bloqueos** - Verificar intentos fallidos

## 🔧 **Problemas Técnicos**

### **Error 500 - Error del Servidor**

#### **Síntomas:**
- Mensaje de error 500
- Página no disponible
- Funcionalidad rota

#### **Soluciones:**

**1. Verificar estado del sistema**
```typescript
// ✅ Verificaciones
const systemCheck = {
  statusPage: "Verificar status.vibethink.ai",
  socialMedia: "Verificar redes sociales",
  support: "Contactar soporte técnico",
  wait: "Esperar resolución del equipo"
};
```

**2. Reportar problema**
1. **Toma screenshot** del error
2. **Anota** pasos para reproducir
3. **Contacta** soporte con detalles
4. **Proporciona** información del navegador

### **Problemas de Rendimiento**

#### **Síntomas:**
- Páginas lentas
- Carga lenta de datos
- Timeouts

#### **Soluciones:**

**1. Verificar recursos del sistema**
```typescript
// ✅ Optimizaciones
const performanceOptimizations = {
  closeTabs: "Cerrar pestañas innecesarias",
  clearCache: "Limpiar caché del navegador",
  restartBrowser: "Reiniciar navegador",
  checkExtensions: "Desactivar extensiones"
};
```

**2. Verificar conexión**
- ✅ **Velocidad de internet** - Verificar velocidad
- ✅ **Latencia** - Verificar ping al servidor
- ✅ **Firewall** - Verificar configuración

## 📞 **Contactar Soporte**

### **Cuándo contactar soporte:**
- ✅ **Error 500** persistente
- ✅ **Problemas de seguridad**
- ✅ **Pérdida de datos**
- ✅ **Problemas de facturación**

### **Información a proporcionar:**
```typescript
// ✅ Información útil
const supportInfo = {
  errorMessage: "Mensaje de error completo",
  steps: "Pasos para reproducir",
  browser: "Navegador y versión",
  os: "Sistema operativo",
  timestamp: "Fecha y hora del problema"
};
```

## 📋 **Próximos Pasos**

### **Si el problema persiste:**
1. **[FAQ](/docs/faq)** - Buscar solución en preguntas frecuentes
2. **[Contacto](/docs/contact)** - Contactar soporte técnico
3. **[Estado del Sistema](https://status.vibethink.ai)** - Verificar estado

### **Para prevenir problemas:**
1. **[Configuración](/docs/company-admin/settings)** - Configurar correctamente
2. **[Seguridad](/docs/security)** - Implementar buenas prácticas
3. **[Backup](/docs/backup)** - Configurar respaldos

---

**¿Necesitas ayuda inmediata?** [Contacta soporte →](/docs/contact) 