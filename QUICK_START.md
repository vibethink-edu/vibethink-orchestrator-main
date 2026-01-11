# 🚀 SCRIPTS DE INICIO RÁPIDO - VIBETHINK ORCHESTRATOR

## ⚡ COMANDOS PRINCIPALES

### **Dashboard-Bundui (UI Mockups)** - PRINCIPAL PARA DESARROLLO
```powershell
.\scripts\start-dashboard-bundui.ps1
```
**Puerto**: 3005  
**URL**: http://localhost:3005/dashboard-bundui/projects-v2  
**Uso**: Desarrollo de UI, mockups, prototipos

---

### **Dashboard-Admin (VibeThink Internal)**
```powershell
.\scripts\start-dashboard-admin.ps1
```
**Puerto**: 3006  
**URL**: http://localhost:3006/dashboard-admin/tenants  
**Uso**: Admin interno, gestión de clientes

---

### **Dashboard-Tenant (Client Admin)**
```powershell
.\scripts\start-dashboard-tenant.ps1
```
**Puerto**: 3007  
**URL**: http://localhost:3007/dashboard-tenant/overview  
**Uso**: Admin para empresas clientes

---

## 🛑 DETENER TODOS

```powershell
.\scripts\stop-all-dashboards.ps1
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- **Arquitectura**: `apps/dashboard/DASHBOARD_ARCHITECTURE.md`
- **Scripts**: `scripts/DASHBOARD_SCRIPTS_README.md`
- **Reglas UI**: `apps/dashboard/UI_STABILITY_RULES.md`

---

**RECUERDA**: Dashboard-Bundui (3005) es tu base principal para desarrollo UI
