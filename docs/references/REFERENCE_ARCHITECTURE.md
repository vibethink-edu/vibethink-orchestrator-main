# Reference Architecture - External Libraries

## 📋 Overview

Este documento define la arquitectura de referencias externas para VibeThink Orchestrator 1.0.

---

## 🏗️ Estructura de Vendors

```
C:\IA Marcelo Labs\
├── vibethink-orchestrator-main/     # 🏠 Proyecto principal
├── _vibethink-dev-kit/              # 📚 Dev kit metodología
│
├── bundui/                          # 🎨 Vendor: Bundui
│   └── shadcn-ui-kit-dashboard/     # Dashboard kit premium
│
├── shadcn-ui/                       # 📦 Vendor: Shadcn UI
│   └── ui/                          # Componentes oficiales
│
└── xyflow/                          # 🔄 Vendor: React Flow
    └── xyflow/                      # Node-based UIs (workflows)
```

---

## 🔄 Flujo de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE COMPONENTES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Shadcn UI Oficial ──────► @vibethink/ui ──────► apps/dashboard │
│  (fuente original)         (centralizado)        (consume)      │
│                                                                 │
│  Bundui ─────────────────► Referencia Visual                    │
│  (dashboard patterns)      (NO copiar código)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Roles de cada Recurso

### Shadcn UI Oficial (`shadcn-ui/ui`)
| Aspecto | Detalle |
|---------|---------|
| **Rol** | Fuente principal de componentes |
| **Uso** | Sincronizar componentes con @vibethink/ui |
| **Puerto** | 3007 |
| **URL** | http://localhost:3007 |
| **GitHub** | https://github.com/shadcn-ui/ui |

### Bundui (`bundui/shadcn-ui-kit-dashboard`)
| Aspecto | Detalle |
|---------|---------|
| **Rol** | Referencia visual de UX/UI |
| **Uso** | Inspiración para dashboards y patterns |
| **Puerto** | 3006 |
| **URL** | http://localhost:3006 |
| **GitHub** | https://github.com/bundui/shadcn-ui-kit-dashboard |

### React Flow (`xyflow/xyflow`)
| Aspecto | Detalle |
|---------|---------|
| **Rol** | Librería para UIs basadas en nodos |
| **Uso** | Workflows, diagramas, flujos visuales |
| **Puerto** | 3008 |
| **URL** | http://localhost:3008 |
| **GitHub** | https://github.com/xyflow/xyflow |
| **Docs** | https://reactflow.dev |

### @vibethink/ui (`packages/ui`)
| Aspecto | Detalle |
|---------|---------|
| **Rol** | Librería interna centralizada |
| **Uso** | Importar en todas las apps del monorepo |
| **Import** | `import { Button } from '@vibethink/ui'` |

---

## 🚀 Comandos de Referencia

### Iniciar Servidores de Referencia

```powershell
# Bundui Premium (Dashboard Kit)
.\scripts\start-bundui-reference.ps1   # Puerto 3006
.\scripts\stop-bundui-reference.ps1

# Shadcn UI Oficial (Componentes)
.\scripts\start-shadcn-reference.ps1   # Puerto 3007
.\scripts\stop-shadcn-reference.ps1

# React Flow (Node-based UIs)
.\scripts\start-reactflow-reference.ps1  # Puerto 3008
.\scripts\stop-reactflow-reference.ps1

# Verificar versiones de todos los vendors
.\scripts\check-vendor-versions.ps1
```

### Puertos Asignados

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Dashboard (desarrollo) | 3005 | Nuestro dashboard |
| Bundui Reference | 3006 | Dashboard kit de referencia |
| Shadcn UI Reference | 3007 | Componentes oficiales |
| React Flow Reference | 3008 | Node-based UIs (workflows) |

---

## ⚠️ Reglas Importantes

### ✅ HACER
- Usar Shadcn UI como fuente de componentes
- Usar Bundui como referencia visual de UX patterns
- Centralizar componentes en `@vibethink/ui`
- Mantener sincronización con Shadcn oficial

### ❌ NO HACER
- Copiar código directamente de Bundui
- Modificar código en directorios de vendors
- Mezclar imports de diferentes fuentes
- Divergir innecesariamente de Shadcn oficial

---

## 🔄 Actualización de Referencias

### Actualizar Shadcn UI
```bash
cd "C:\IA Marcelo Labs\shadcn-ui\ui"
git pull origin main
pnpm install
pnpm --filter=shadcn build
```

### Actualizar Bundui
```bash
cd "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
git pull origin main
npm install --legacy-peer-deps
```

---

## 📊 Comparación de Componentes

| Componente | Shadcn UI | @vibethink/ui | Estado |
|------------|-----------|---------------|--------|
| Button | ✅ | ✅ | Sincronizado |
| Card | ✅ | ✅ | Sincronizado |
| Dialog | ✅ | ✅ | Sincronizado |
| Sidebar | ✅ | ✅ | Sincronizado |
| Form | ✅ | ✅ | Sincronizado |
| Table | ✅ | ✅ | Sincronizado |
| Chart | ✅ | ✅ | Sincronizado |
| ... | ... | ... | ... |

---

## 📋 Checklist de Nuevo Componente

Cuando necesites agregar un nuevo componente:

1. [ ] Verificar si existe en Shadcn UI oficial
2. [ ] Revisar implementación en Bundui (referencia visual)
3. [ ] Adaptar desde Shadcn a `@vibethink/ui`
4. [ ] Documentar diferencias si las hay
5. [ ] Exportar desde `packages/ui/src/index.ts`

---

**Última actualización:** 2024-12-17
**Versión:** 1.0

