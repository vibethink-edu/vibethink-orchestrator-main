# Vendor Versions & Compatibility Matrix

> **Última actualización:** 2024-12-17  
> **Versión del documento:** 1.1.0

### ⚠️ Nota Importante

**`@vibethink/bundui-ui` fue DEPRECADO** y fusionado en `@vibethink/ui` v0.2.0.

Ahora solo existe:
- `@vibethink/ui` - 100% Shadcn Compatible + Extensions
- Bundui vendor (3006) - Solo referencia visual

---

## 📊 Stack Principal (VibeThink Orchestrator)

| Dependencia | Versión | Notas |
|-------------|---------|-------|
| **React** | 19.0.0 | ⚠️ Versión RC/nueva |
| **React DOM** | 19.0.0 | Con overrides en monorepo |
| **Next.js** | 15.3.4 | App Router |
| **TypeScript** | 5.9.2 | Última estable |
| **Tailwind CSS** | 4.1.11 | v4 (nueva arquitectura) |
| **Node.js** | >=18.0.0 | Requerido |
| **npm** | >=9.0.0 | Requerido |

### Dependencias UI Core

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@radix-ui/*` | ^1.x - ^2.x | Primitivos accesibles |
| `class-variance-authority` | 0.7.1 | Variantes de componentes |
| `clsx` | 2.1.1 | Clases condicionales |
| `tailwind-merge` | 3.3.1 | Merge de clases Tailwind |
| `lucide-react` | ^0.522.0 | Iconos |
| `cmdk` | 0.2.1 | Command palette |
| `sonner` | 2.0.7 | Toasts |
| `zustand` | 5.0.7 | State management |

---

## 🎨 Vendor: Bundui (shadcn-ui-kit-dashboard)

| Información | Valor |
|-------------|-------|
| **Nombre** | shadcn-ui-kit |
| **Versión** | 1.2.0 |
| **Puerto** | 3006 |
| **Licencia** | Commercial (Premium) |

### Stack de Bundui

| Dependencia | Versión Bundui | Versión VThink | Compatibilidad |
|-------------|----------------|----------------|----------------|
| React | ^19.2.0 | 19.0.0 | ✅ Compatible |
| React DOM | ^19.2.0 | 19.0.0 | ✅ Compatible |
| Next.js | 16.0.10 | 15.3.4 | ⚠️ Bundui más nuevo |
| TypeScript | ^5.8.3 | 5.9.2 | ✅ Compatible |
| Tailwind CSS | ^4.1.10 | ^4.1.11 | ✅ Compatible |

### Dependencias Adicionales de Bundui

| Paquete | Versión | Uso en VThink |
|---------|---------|---------------|
| `@dnd-kit/*` | ^6-10 | Considerar para Kanban |
| `@fullcalendar/*` | ^6.1.17 | Ya incluido en VThink |
| `@hello-pangea/dnd` | ^18.0.1 | Ya incluido |
| `@tiptap/*` | ^2.22.3 | Ya incluido |
| `motion` | ^12.23.25 | Ya incluido |

---

## 📦 Vendor: Shadcn UI (ui)

| Información | Valor |
|-------------|-------|
| **Nombre** | shadcn (CLI) |
| **Versión CLI** | 3.6.1 |
| **Puerto** | 3007 |
| **Licencia** | MIT |

### Notas de Compatibilidad

- Shadcn UI es un **CLI** que genera código, no una librería
- Los componentes generados son compatibles con React 18+ y 19
- Usa Tailwind CSS 4.x (v4) en la última versión
- Los componentes de `@vibethink/ui` deben sincronizarse con el registry oficial

---

## 🔄 Vendor: React Flow (xyflow)

| Información | Valor |
|-------------|-------|
| **Nombre** | @xyflow/react |
| **Versión** | 12.10.0 |
| **Puerto** | 3008 |
| **Licencia** | MIT |
| **GitHub** | https://github.com/xyflow/xyflow |
| **Docs** | https://reactflow.dev |

### Stack de React Flow

| Dependencia | Versión RF | Versión VThink | Compatibilidad |
|-------------|------------|----------------|----------------|
| React | >=17 (peer) | 19.0.0 | ✅ Compatible |
| React DOM | >=17 (peer) | 19.0.0 | ✅ Compatible |
| zustand | ^4.4.0 | 5.0.7 | ⚠️ VThink más nuevo |

### Paquetes del Monorepo xyflow

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| `@xyflow/react` | 12.10.0 | React Flow para React |
| `@xyflow/svelte` | 1.5.0 | Svelte Flow |
| `@xyflow/system` | 0.0.74 | Core compartido |

---

## 🔍 Matriz de Compatibilidad

```
┌──────────────────┬───────────┬───────────┬───────────┬───────────┐
│ Dependencia      │ VThink    │ Bundui    │ Shadcn    │ ReactFlow │
├──────────────────┼───────────┼───────────┼───────────┼───────────┤
│ React            │ 19.0.0    │ ^19.2.0   │ 18+/19    │ >=17      │
│ Next.js          │ 15.3.4    │ 16.0.10   │ N/A       │ N/A       │
│ TypeScript       │ 5.9.2     │ ^5.8.3    │ ^5.9.2    │ 5.4.5     │
│ Tailwind CSS     │ 4.1.11    │ ^4.1.10   │ 4.x       │ N/A       │
│ Radix UI         │ ^1-2.x    │ ^1-2.x    │ ^1-2.x    │ N/A       │
│ zustand          │ 5.0.7     │ ^5.0.5    │ N/A       │ ^4.4.0    │
└──────────────────┴───────────┴───────────┴───────────┴───────────┘
```

### Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Totalmente compatible |
| ⚠️ | Compatible con notas |
| ❌ | Incompatible |
| N/A | No aplica |

---

## ⚠️ Notas de Compatibilidad

### React 19

- **VThink** usa React 19.0.0 (con overrides)
- **Bundui** usa React ^19.2.0 (más nuevo)
- **React Flow** soporta React >=17 (compatible)
- **Acción**: Monitorear actualizaciones de React 19 estable

### Next.js

- **VThink** usa Next.js 15.3.4
- **Bundui** usa Next.js 16.0.10 (más nuevo)
- **Acción**: Evaluar migración a Next.js 16 cuando sea estable

### Tailwind CSS v4

- Todos los vendors usan Tailwind CSS 4.x
- Nueva arquitectura de configuración
- `@tailwindcss/postcss` reemplaza el plugin tradicional

### Zustand

- **VThink** usa zustand 5.x
- **React Flow** usa zustand 4.x
- **Acción**: Verificar compatibilidad en integraciones

---

## 📋 Proceso de Actualización

### 1. Verificar Versiones Actuales

```powershell
# Ver versiones de vendors
cd "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
npm list react next --depth=0

cd "C:\IA Marcelo Labs\shadcn-ui\ui"
cat packages/shadcn/package.json | Select-String "version"

cd "C:\IA Marcelo Labs\xyflow\xyflow"
cat packages/react/package.json | Select-String "version"
```

### 2. Actualizar Vendor

```powershell
# Actualizar Bundui
cd "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
git pull origin main
npm install --legacy-peer-deps

# Actualizar Shadcn UI
cd "C:\IA Marcelo Labs\shadcn-ui\ui"
git pull origin main
pnpm install
pnpm --filter=shadcn build

# Actualizar React Flow
cd "C:\IA Marcelo Labs\xyflow\xyflow"
git pull origin main
pnpm install
pnpm build
```

### 3. Verificar Compatibilidad

```powershell
# Después de actualizar, verificar que todo funcione
cd "C:\IA Marcelo Labs\vibethink-orchestrator-main"

.\scripts\start-bundui-reference.ps1
# Verificar http://localhost:3006

.\scripts\start-shadcn-reference.ps1
# Verificar http://localhost:3007

.\scripts\start-reactflow-reference.ps1
# Verificar http://localhost:3008
```

---

## 🔄 Sincronización de Componentes

### De Shadcn UI → @vibethink/ui

1. Verificar versión en `shadcn-ui/ui/apps/v4/registry/`
2. Comparar con `packages/ui/src/components/`
3. Actualizar si hay diferencias significativas
4. Documentar cambios en CHANGELOG

### Checklist de Actualización

- [ ] Verificar breaking changes en release notes
- [ ] Actualizar vendor (git pull + install)
- [ ] Iniciar servidor de referencia
- [ ] Verificar funcionamiento
- [ ] Comparar con componentes actuales
- [ ] Actualizar `@vibethink/ui` si necesario
- [ ] Actualizar este documento

---

## 📊 Historial de Versiones

| Fecha | Vendor | Versión Anterior | Versión Nueva | Notas |
|-------|--------|------------------|---------------|-------|
| 2024-12-17 | Bundui | - | 1.2.0 | Instalación inicial |
| 2024-12-17 | Shadcn CLI | - | 3.6.1 | Instalación inicial |
| 2024-12-17 | React Flow | - | 12.10.0 | Instalación inicial |

---

## 📞 Referencias

| Recurso | URL |
|---------|-----|
| React Flow Docs | https://reactflow.dev |
| Shadcn UI | https://ui.shadcn.com |
| Bundui | https://bundui.io |
| Next.js | https://nextjs.org |
| Tailwind CSS | https://tailwindcss.com |
| Radix UI | https://radix-ui.com |

---

**Mantenedor:** VThink Team  
**Próxima revisión:** Al actualizar cualquier vendor

