# 🚀 Dashboard Scripts - Guía de Uso

Scripts PowerShell para iniciar y detener los diferentes dashboards del monorepo.

---

## 📋 Scripts Disponibles

### **Dashboard-Bundui** (UI Mockups Lab)
- **Puerto**: 3005
- **Propósito**: Laboratorio de UI - Mockups y prototipos
- **Ruta**: `/dashboard-bundui/*`

```powershell
# Iniciar
.\scripts\start-dashboard-bundui.ps1

# Detener
.\scripts\stop-dashboard-bundui.ps1
```

**URL de acceso**: http://localhost:3005/dashboard-bundui/projects-v2

---

### **Dashboard-Admin** (VibeThink Internal)
- **Puerto**: 3006
- **Propósito**: Admin interno - Gestión de clientes y sistema
- **Ruta**: `/dashboard-admin/*`

```powershell
# Iniciar
.\scripts\start-dashboard-admin.ps1

# Detener
.\scripts\stop-dashboard-admin.ps1
```

**URL de acceso**: http://localhost:3006/dashboard-admin/tenants

---

### **Dashboard-Tenant** (Client/Company Admin)
- **Puerto**: 3007
- **Propósito**: Admin para empresas clientes (multi-tenant)
- **Ruta**: `/dashboard-tenant/*`

```powershell
# Iniciar
.\scripts\start-dashboard-tenant.ps1

# Detener
.\scripts\stop-dashboard-tenant.ps1
```

**URL de acceso**: http://localhost:3007/dashboard-tenant/overview

---

## 🎯 Uso Típico

### **Desarrollo de UI (Mockups)**
```powershell
# Trabajando en mockups de UI
.\scripts\start-dashboard-bundui.ps1
```

### **Desarrollo Admin Interno**
```powershell
# Trabajando en features de admin VibeThink
.\scripts\start-dashboard-admin.ps1
```

### **Desarrollo Admin Clientes**
```powershell
# Trabajando en features de admin para empresas
.\scripts\start-dashboard-tenant.ps1
```

### **Ejecutar Múltiples Dashboards**
```powershell
# Abrir 3 terminales y ejecutar cada script
# Terminal 1:
.\scripts\start-dashboard-bundui.ps1

# Terminal 2:
.\scripts\start-dashboard-admin.ps1

# Terminal 3:
.\scripts\start-dashboard-tenant.ps1
```

---

## 🔧 Características

### **Auto-Healing**
- ✅ Detecta si el puerto está en uso
- ✅ Intenta detener procesos existentes automáticamente
- ✅ Instala dependencias si faltan

### **Auto-Open Browser**
- ✅ Abre automáticamente el browser en la ruta correcta
- ✅ Espera 5 segundos para que el servidor inicie

### **Health Checks**
- ✅ Verifica estructura de directorios
- ✅ Verifica node_modules
- ✅ Verifica disponibilidad de puerto

---

## 📊 Puertos Asignados

| Dashboard | Puerto | Propósito |
|-----------|--------|-----------|
| **Bundui** | 3005 | UI Mockups Lab |
| **Admin** | 3006 | VibeThink Internal Admin |
| **Tenant** | 3007 | Client/Company Admin |

---

## 🛑 Detener Todos los Dashboards

```powershell
# Detener todos
.\scripts\stop-dashboard-bundui.ps1
.\scripts\stop-dashboard-admin.ps1
.\scripts\stop-dashboard-tenant.ps1
```

O crear un script helper:

```powershell
# stop-all-dashboards.ps1
.\scripts\stop-dashboard-bundui.ps1
.\scripts\stop-dashboard-admin.ps1
.\scripts\stop-dashboard-tenant.ps1
Write-Host "`n✅ All dashboards stopped`n" -ForegroundColor Green
```

---

## 📚 Documentación Relacionada

- **Arquitectura**: `apps/dashboard/DASHBOARD_ARCHITECTURE.md`
- **Reglas de Estabilidad**: `apps/dashboard/UI_STABILITY_RULES.md`
- **Resumen de Reestructuración**: `apps/dashboard/RESTRUCTURING_SUMMARY.md`

---

## ⚠️ Troubleshooting

### **Puerto en uso**
```powershell
# Ver qué proceso usa el puerto
Get-NetTCPConnection -LocalPort 3005 | Select-Object OwningProcess

# Matar proceso manualmente
Stop-Process -Id <PID> -Force
```

### **Dependencias faltantes**
```powershell
# Instalar dependencias manualmente
cd apps/dashboard
pnpm install
```

### **Script no ejecuta**
```powershell
# Habilitar ejecución de scripts (solo primera vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🎯 Best Practices

1. **Un dashboard a la vez** para desarrollo normal
2. **Múltiples dashboards** solo para testing de integración
3. **Siempre detener** antes de hacer cambios grandes
4. **Usar el dashboard correcto** según lo que estés desarrollando:
   - Mockups → `bundui`
   - Admin interno → `admin`
   - Admin clientes → `tenant`

---

**Última actualización**: 2026-01-10  
**Versión**: 1.0
