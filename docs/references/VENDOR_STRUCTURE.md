# Vendor Structure - Quick Reference

## 📁 Estructura de Directorios

```
C:\IA Marcelo Labs\
│
├── vibethink-orchestrator-main\     # 🏠 PROYECTO PRINCIPAL
│   ├── apps\
│   │   └── dashboard\               # Dashboard app (Next.js)
│   ├── packages\
│   │   ├── ui\                      # @vibethink/ui (componentes)
│   │   └── utils\                   # @vibethink/utils (utilidades)
│   ├── scripts\                     # Scripts operacionales
│   └── docs\                        # Documentación
│
├── _vibethink-dev-kit\              # 📚 METODOLOGÍA
│   └── knowledge\                   # Guías y estándares
│
├── bundui\                          # 🎨 VENDOR: BUNDUI
│   └── shadcn-ui-kit-dashboard\     # Dashboard Kit Premium
│       ├── app\                     # App Router
│       ├── components\              # Componentes
│       └── package.json
│
├── shadcn-ui\                       # 📦 VENDOR: SHADCN UI
│   └── ui\                          # Monorepo oficial
│       ├── packages\
│       │   └── shadcn\              # CLI
│       └── apps\
│           └── v4\                  # Docs + Registry
│               └── registry\        # Componentes fuente
│
└── xyflow\                          # 🔄 VENDOR: REACT FLOW
    └── xyflow\                      # Monorepo oficial
        ├── packages\
        │   ├── react\               # @xyflow/react
        │   ├── svelte\              # @xyflow/svelte
        │   └── system\              # @xyflow/system
        └── examples\
            └── react\               # Ejemplos de React Flow
```

---

## 🔌 Puertos Asignados

| Servicio | Puerto | URL |
|----------|--------|-----|
| **Dashboard (dev)** | 3005 | http://localhost:3005 |
| **Bundui Reference** | 3006 | http://localhost:3006 |
| **Shadcn Reference** | 3007 | http://localhost:3007 |
| **React Flow Reference** | 3008 | http://localhost:3008 |

---

## 🚀 Scripts Disponibles

### Desde `vibethink-orchestrator-main\`:

```powershell
# Dashboard principal
.\scripts\start-dashboard.ps1
.\scripts\stop-dashboard.ps1

# Bundui Reference
.\scripts\start-bundui-reference.ps1
.\scripts\stop-bundui-reference.ps1

# Shadcn UI Reference  
.\scripts\start-shadcn-reference.ps1
.\scripts\stop-shadcn-reference.ps1

# React Flow Reference
.\scripts\start-reactflow-reference.ps1
.\scripts\stop-reactflow-reference.ps1
```

---

## 📋 Resumen de Roles

| Recurso | Tipo | Rol | Uso |
|---------|------|-----|-----|
| `@vibethink/ui` | Paquete interno | Componentes centralizados | Producción |
| Shadcn UI | Vendor externo | Fuente de componentes | Sincronización |
| Bundui | Vendor externo | Referencia visual | Inspiración UI/UX |
| React Flow | Vendor externo | Node-based UIs | Workflows/Diagramas |

---

## ⚡ Inicio Rápido

```powershell
# 1. Iniciar dashboard principal
cd "C:\IA Marcelo Labs\vibethink-orchestrator-main"
.\scripts\start-dashboard.ps1

# 2. (Opcional) Iniciar referencias para consulta
.\scripts\start-bundui-reference.ps1
.\scripts\start-shadcn-reference.ps1
.\scripts\start-reactflow-reference.ps1

# 3. Abrir en navegador
# - Dashboard:   http://localhost:3005
# - Bundui:      http://localhost:3006
# - Shadcn:      http://localhost:3007
# - React Flow:  http://localhost:3008
```

---

**Última actualización:** 2024-12-17

