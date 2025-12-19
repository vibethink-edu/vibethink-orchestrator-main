# 🔌 Port Conventions - VibeThink Orchestrator

**Última actualización**: 2025-12-18  
**Fuente de verdad**: `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`

---

## 📋 Puertos Asignados

Este proyecto utiliza el sistema global de asignación de puertos de VibeThink Dev-Kit.

### Aplicaciones Principales

| App | Puerto | URL | Script |
|-----|--------|-----|--------|
| **Dashboard (Monorepo)** | **3005** | http://localhost:3005 | `.\scripts\start-dashboard.ps1` |
| **Bundui Reference** | **3050** | http://localhost:3050 | `.\scripts\start-bundui-reference.ps1` |
| **Shadcn Reference** | **3051** | http://localhost:3051 | `.\scripts\start-shadcn-reference.ps1` |
| **ReactFlow Reference** | **3052** | http://localhost:3052 | `.\scripts\start-reactflow-reference.ps1` |

### Rutas Dentro de Dashboard (Puerto 3005)

| Sistema | URL Base | Descripción |
|---------|----------|-------------|
| **Bundui Monorepo** | http://localhost:3005/dashboard-bundui | Espejo monorepo (13 dashboards) |
| **VibeThink** | http://localhost:3005/dashboard-vibethink | Mejoras y extensiones (14 dashboards) |

---

## 🚨 REGLA CRÍTICA

**NUNCA hardcodear puertos en scripts o código.**

### ✅ Correcto:

```powershell
# PowerShell - Usar PortManager Module
$PORT = Get-ReferencePort -ReferenceName "bundui"
```

```typescript
// TypeScript - Usar variable de entorno
const PORT = process.env.PORT || 3005;
```

### ❌ Incorrecto:

```powershell
# ❌ NO hardcodear
$PORT = 3000
```

```typescript
// ❌ NO hardcodear
const PORT = 3000;
```

---

## 📦 PortManager Module

### Ubicación
```
C:\IA Marcelo Labs\_vibethink-dev-kit\packages\tools\powershell-modules\PortManager\PortManager.psm1
```

### Uso en Scripts

```powershell
# 1. Import Module
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"

if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force
    
    # 2. Get Port
    $PORT = Get-ReferencePort -ReferenceName "bundui"
    
    # 3. Get Reference Info
    $REF_INFO = Get-ReferenceInfo -ReferenceName "bundui"
    
    # 4. Validate Port
    Test-PortAssignment -Port $PORT -ReferenceName "bundui"
} else {
    # Fallback (con warning)
    Write-Warning "⚠️  PortManager not found. Using fallback."
    $PORT = 3050
}
```

---

## 🔄 Migración de Scripts Legacy

Si encuentras scripts con puertos hardcodeados, actualízalos:

### Antes (Legacy)
```powershell
$PORT = 3000
npm run dev -- -p $PORT
```

### Después (Global)
```powershell
# Import PortManager
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"

if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force
    $PORT = Get-ReferencePort -ReferenceName "bundui"
} else {
    $PORT = 3050  # Fallback to global standard
}

npm run dev -- -p $PORT
```

---

## 📊 Tabla de Puertos Globales (Referencia Rápida)

### VibeThink Projects (3000-3099)

| Puerto | Proyecto | Estado |
|--------|----------|--------|
| 3005 | VibeThink Orchestrator Dashboard | ✅ Activo |
| 3010 | VibeThink Admin | 🔜 Futuro |
| 3015 | VibeThink API Gateway | 🔜 Futuro |

### Reference Projects (3050-3099)

| Puerto | Proyecto | Estado |
|--------|----------|--------|
| 3050 | Bundui Reference | ✅ Activo |
| 3051 | Shadcn Reference | ✅ Activo |
| 3052 | ReactFlow Reference | ✅ Activo |

---

## 🧪 Scripts de Prueba

### Probar Dashboard Solo
```powershell
.\scripts\start-dashboard.ps1
# Puerto: 3005
# URLs:
#   - http://localhost:3005/dashboard-bundui
#   - http://localhost:3005/dashboard-vibethink
```

### Probar Bundui Reference Solo
```powershell
.\scripts\start-bundui-reference.ps1
# Puerto: 3050 (desde PortManager)
# URL: http://localhost:3050/dashboard/default
```

### Probar Ambos (Comparación)
```powershell
.\scripts\test-both-servers.ps1
# Dashboard: 3005
# Bundui Reference: 3050
```

---

## ❌ Puertos a Evitar

### NO usar estos puertos:

- **3000**: Usado comúnmente por Next.js default (conflicto con otros proyectos)
- **3001-3004**: Reservados para otros proyectos VibeThink
- **8000-8999**: Reservados para backends/APIs
- **5000-5999**: Reservados para servicios

---

## 🔧 Troubleshooting

### Puerto en Uso

```powershell
# Ver qué proceso está usando el puerto
Get-NetTCPConnection -LocalPort 3005 | Format-Table

# Detener servidor correcto
.\scripts\stop-dashboard.ps1
.\scripts\stop-bundui-reference.ps1
```

### PortManager No Encontrado

Si `PortManager.psm1` no se encuentra:

1. ✅ Verificar que `_vibethink-dev-kit` existe
2. ✅ Verificar path: `C:\IA Marcelo Labs\_vibethink-dev-kit\packages\tools\powershell-modules\PortManager\PortManager.psm1`
3. ✅ Usar fallback documentado en script

---

## 📚 Referencias

- **Global**: `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`
- **Module**: `_vibethink-dev-kit/packages/tools/powershell-modules/PortManager/`
- **Local**: `scripts/start-*.ps1` (ejemplos de uso)

---

**Última actualización**: 2025-12-18  
**Responsable**: Mantener consistencia con `PORT_ASSIGNMENT_GLOBAL.md` del dev-kit


