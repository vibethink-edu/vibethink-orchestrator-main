# VibeThink Orchestrator 1.0 - Agent Rules

[![AGENTS.md](https://img.shields.io/badge/AGENTS-md-blue)](https://agents.md)

> **This project INHERITS from:**
> - `_vibethink-dev-kit/knowledge/ai-agents/AGENTS_UNIVERSAL.md` - Universal rules
> - `_vibethink-dev-kit/knowledge/ai-agents/AI_UNIVERSAL_STANDARDS.md` - Standards

---

## 🔥 LEVEL 1: CRITICAL (Read Always)

### ⚡ Quick Operations

**Use these commands - NEVER guess alternatives:**

| Action | Command | Port |
|--------|---------|------|
| **Start Dashboard** | `.\scripts\start-dashboard.ps1` | 3005 |
| **Stop Dashboard** | `.\scripts\stop-dashboard.ps1` | - |
| **Build Dashboard** | `npm run build:dashboard` | - |
| **Dev Dashboard** | `npm run dev:dashboard` | 3000 |
| **Start Bundui Ref** | `.\scripts\start-bundui-reference.ps1` | 3050 |
| **Stop Bundui Ref** | `.\scripts\stop-bundui-reference.ps1` | - |
| **Start Shadcn Ref** | `.\scripts\start-shadcn-reference.ps1` | 3051 |
| **Stop Shadcn Ref** | `.\scripts\stop-shadcn-reference.ps1` | - |
| **Start ReactFlow Ref** | `.\scripts\start-reactflow-reference.ps1` | 3052 |
| **Stop ReactFlow Ref** | `.\scripts\stop-reactflow-reference.ps1` | - |

> **📌 Estándar Global:** Ver `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`  
> **Puertos alineados:** 3050 (Bundui), 3051 (Shadcn), 3052 (ReactFlow) ✅
| **Check Vendor Versions** | `.\scripts\check-vendor-versions.ps1` | - |

> ⚠️ **Nuclear Option (emergencias):** `taskkill /F /IM node.exe` mata TODOS los procesos Node del sistema.

### 🎯 Project Mission

**VibeThink Orchestrator 1.0** is an Enterprise SaaS Platform with AI Integration featuring:
- Multiple dashboards and admin panels
- Modern web technologies (Next.js 15, React 19)
- Shadcn UI component system

### 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Core** | React 19.0.0, TypeScript 5.9.2 |
| **Build** | Next.js 15.3.4 (App Router) |
| **Styling** | Tailwind CSS 4.1.10 |
| **UI** | Shadcn UI via `@vibethink/ui` |
| **Backend** | Express 4.21.2 (when needed) |
| **Monorepo** | npm workspaces (`apps/*`, `packages/*`) |

### ❌ Project-Specific Prohibitions

```bash
# ❌ NEVER install Express 5 (use 4.21.2)
# ❌ NEVER install `vite` (this is a Next.js project)
# ❌ NEVER use bundui-ui (DEPRECATED - use @vibethink/ui)
# ❌ NEVER run npm commands in apps/ - use root scripts
# ❌ NEVER guess port numbers - check scripts
```

### ✅ Project-Specific Requirements

```bash
# ✅ Use only @vibethink/ui for UI components
# ✅ Run npm commands from monorepo root
# ✅ Use scripts/*.ps1 for operations
# ✅ Follow AGENTS_UNIVERSAL.md for general rules
```

---

## 📋 LEVEL 2: WORKFLOW (Read When Working)

### Development Workflow

1. **Start:** Run `.\scripts\start-dashboard.ps1` or `npm run dev:dashboard`
2. **Code:** Make changes following stack guidelines
3. **Verify:** Check browser, fix errors
4. **Build:** Run `npm run build:dashboard` before committing
5. **Commit:** Follow pre-commit checklist

### Pre-Commit Checklist

**ANTES de `git commit`, PREGUNTAR al usuario:**

```
¿Actualizamos la versión en types.ts antes de hacer commit?

Cambios realizados:
- [Lista breve de cambios]

Opciones:
- Sí: Actualizar versión + CHANGELOG
- No: Commit sin versión (solo para cambios menores/docs)
```

### Version Management

**Single Source of Truth:** `types.ts`
- `APP_VERSION_NUMBER`: Semantic version (e.g., '2.7.0')
- `APP_VERSION_DESCRIPTOR`: Short description
- `APP_VERSION`: Auto-generated full string

**How to Update:**
1. Update `APP_VERSION_NUMBER` in `types.ts`
2. Update `APP_VERSION_DESCRIPTOR` in `types.ts`
3. Add entry to `CHANGELOG.md`
4. Run `npm run build:dashboard`
5. Commit changes together

### Design Mode (Safe UI Experimentation)

**Use when:** Iterating on UI/UX without backend risk.

**✅ ALLOWED to modify:**
- `src/components/**/*.tsx`
- `src/assets/**/*`
- `tailwind.config.js`
- `*.css` files

**❌ FORBIDDEN to modify:**
- `src/services/**/*`
- `server/**/*`
- `.env*` files
- `package.json`

**Activate with prompt:**
```
Actúa en MODO DISEÑO SEGURO:
Solo modifica archivos de UI, usa datos MOCK, no toques backend.
```

---

## 📚 LEVEL 3: REFERENCE (Read When Needed)

### Directory Structure

```
vibethink-orchestrator-main/
├── apps/
│   └── dashboard/           # Main dashboard app
├── packages/
│   ├── ui/                  # @vibethink/ui (Shadcn components)
│   └── utils/               # Shared utilities
├── scripts/                 # Operational scripts
│   ├── start-dashboard.ps1
│   ├── stop-dashboard.ps1
│   └── [other scripts]
├── docs/                    # Technical documentation
│   ├── ui-ux/              # UI/UX guides
│   ├── deployment/         # Deployment guides
│   └── [other docs]
├── AGENTS.md               # This file
└── package.json            # Root package.json
```

### UI Components System

**Package:** `@vibethink/ui` in `packages/ui/`

**Available Components:**
- **Layout**: Card, Sheet, Sidebar, Separator, Scroll Area
- **Form**: Input, Button, Dialog, Label, Checkbox, Textarea, Switch, Select
- **Navigation**: Tabs, Dropdown Menu, Collapsible, Accordion
- **Feedback**: Progress, Skeleton, Tooltip, Alert
- **Display**: Avatar, Badge, Table

**Usage:**
```typescript
import { Card, Button, Badge } from '@vibethink/ui'
```

**Documentation:**
- `docs/ui-ux/SHADCN_UI_GUIDE.md`
- `packages/ui/IMPLEMENTATION_STATUS.md`
- `_vibethink-dev-kit/knowledge/stack-guides/SHADCN_RADIX_UI_STACK.md`

### Documentation Map

| Area | Document |
|------|----------|
| UI/UX | `docs/ui-ux/SHADCN_UI_GUIDE.md` |
| Deployment | `docs/deployment/DEPLOYMENT.md` |
| Architecture | `docs/core/ARCHITECTURE_V3.md` |
| References | `docs/references/REFERENCE_ARCHITECTURE.md` |
| Troubleshooting | `TROUBLESHOOTING.md` |

### 🔗 External References (Vendors)

```
C:\IA Marcelo Labs\
├── bundui\shadcn-ui-kit-dashboard\    # Dashboard reference (port 3050 - estándar global)
├── shadcn-ui\ui\                      # Shadcn official (port 3051 - estándar global)
└── xyflow\xyflow\                     # React Flow examples (port 3052 - estándar global)
```

> **📌 Asignación Global:** Ver `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`  
> **Nota:** Scripts actuales usan puertos antiguos (3006-3008). Migración pendiente a 3050-3052.

**Flujo de componentes:**
```
Shadcn UI (fuente) → @vibethink/ui (centralizado) → apps/dashboard
Bundui (referencia visual de UX patterns - NO copiar código)
```

### Configuration & Security

- **Credentials:** Store in `.env.local` (never commit)
- **Git:** Use `.env.example` for templates
- **Backend Proxy:** Hide API keys server-side

---

## 🔗 Inheritance Reference

This project follows the **VThink Methodology** defined in:

- `_vibethink-dev-kit/knowledge/ai-agents/AGENTS_UNIVERSAL.md`
  - Mandatory First Actions
  - Universal Prohibitions/Requirements
  - Session Continuity Protocol
  - Stability Rules

- `_vibethink-dev-kit/knowledge/ai-agents/AI_UNIVERSAL_STANDARDS.md`
  - Dependency Management Rules
  - Monorepo Rules
  - Validation Commands

**For any rule not specified here, refer to the dev-kit.**

---

## 📋 Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ VIBETHINK ORCHESTRATOR - QUICK REFERENCE                │
├─────────────────────────────────────────────────────────┤
│ START:  .\scripts\start-dashboard.ps1 (port 3005)      │
│ STOP:   .\scripts\stop-dashboard.ps1                   │
│ BUILD:  npm run build:dashboard                        │
│ DEV:    npm run dev:dashboard                          │
├─────────────────────────────────────────────────────────┤
│ UI:     @vibethink/ui (NOT bundui-ui)                  │
│ STACK:  Next.js 15 + React 19 + TypeScript 5.9         │
│ PORT:   3005                                           │
├─────────────────────────────────────────────────────────┤
│ 🎨 BUNDUI REFERENCE (dashboard kit)                    │
│ START:  .\scripts\start-bundui-reference.ps1           │
│ STOP:   .\scripts\stop-bundui-reference.ps1            │
│ PORT:   3006                                           │
├─────────────────────────────────────────────────────────┤
│ 📦 SHADCN UI REFERENCE (official components)           │
│ START:  .\scripts\start-shadcn-reference.ps1           │
│ STOP:   .\scripts\stop-shadcn-reference.ps1            │
│ PORT:   3007                                           │
├─────────────────────────────────────────────────────────┤
│ 🔄 REACT FLOW REFERENCE (node-based UIs)               │
│ START:  .\scripts\start-reactflow-reference.ps1        │
│ STOP:   .\scripts\stop-reactflow-reference.ps1         │
│ PORT:   3008                                           │
├─────────────────────────────────────────────────────────┤
│ DOCS:   docs/ui-ux/, docs/deployment/, docs/core/      │
│ DEVKIT: _vibethink-dev-kit/knowledge/                  │
└─────────────────────────────────────────────────────────┘
```

---

**Last Updated:** 2024-12-17 (Vendors + Versioning)
**Inherits From:** `_vibethink-dev-kit` v1.0
