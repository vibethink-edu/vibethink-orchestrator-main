# 🎨 Guía Completa de Shadcn UI

**Última actualización:** 2025-01-16  
**Versión:** 1.0  
**Basado en:** `_vibethink-dev-kit/knowledge/stack-guides/SHADCN_RADIX_UI_STACK.md`

---

## 📋 Tabla de Contenidos

1. [Overview](#overview)
2. [Arquitectura](#arquitectura)
3. [Componentes Disponibles](#componentes-disponibles)
4. [Configuración](#configuración)
5. [Uso en el Proyecto](#uso-en-el-proyecto)
6. [Agregar Nuevos Componentes](#agregar-nuevos-componentes)
7. [Script de Actualización](#script-de-actualización)
8. [Mejores Prácticas](#mejores-prácticas)
9. [Troubleshooting](#troubleshooting)
10. [Referencias](#referencias)

---

## 📖 Overview

Shadcn UI es un sistema de componentes **copy-paste** basado en Radix UI y Tailwind CSS. No es una librería npm tradicional - los componentes se copian directamente a tu proyecto para máxima customización.

### ✅ Por Qué Shadcn UI

1. **Ownership Total** - Código en tu repo, no en node_modules
2. **Customizable** - Modifica cualquier componente sin forks
3. **Type-Safe** - TypeScript nativo
4. **Accesible** - Basado en Radix UI (WAI-ARIA compliant)
5. **Monorepo Friendly** - Patrón oficial documentado

### 🎯 Estado Actual

- ✅ **14 componentes** implementados y funcionando
- ✅ **85+ archivos** usando `@vibethink/ui` en el dashboard
- ✅ **Configuración completa** para monorepo
- ✅ **Listo para producción**

---

## 🏗️ Arquitectura

### Estructura del Package

```
packages/ui/
├── src/
│   ├── components/          # Componentes Shadcn UI
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   └── tooltip.tsx
│   ├── lib/
│   │   └── utils.ts         # Función cn() para merge de clases
│   ├── hooks/               # Hooks personalizados (vacío por ahora)
│   └── index.ts             # Exports centralizados
├── components.json          # Configuración de shadcn CLI
├── package.json            # Dependencias y exports
└── tsconfig.json           # Configuración TypeScript
```

### Patrón de Monorepo

El package `@vibethink/ui` está configurado como workspace package:

```json
{
  "name": "@vibethink/ui",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

Las apps importan desde el workspace:

```typescript
import { Button } from '@vibethink/ui'
```

---

## 📦 Componentes Disponibles

### ✅ Componentes Implementados (14)

| Componente | Radix Primitive | Versión | Estado | Uso |
|------------|----------------|---------|--------|-----|
| **Avatar** | `@radix-ui/react-avatar` | ^1.1.2 | ✅ | User profiles, team members |
| **Badge** | - | - | ✅ | Status indicators, labels |
| **Button** | `@radix-ui/react-slot` | ^1.1.1 | ✅ | Actions, CTAs |
| **Card** | - | - | ✅ | Content containers |
| **Dialog** | `@radix-ui/react-dialog` | ^1.1.4 | ✅ | Modales, popups |
| **Dropdown Menu** | `@radix-ui/react-dropdown-menu` | ^2.1.15 | ✅ | Menús contextuales |
| **Input** | - | - | ✅ | Campos de formulario |
| **Progress** | `@radix-ui/react-progress` | ^1.1.1 | ✅ | Loading states, metrics |
| **Separator** | `@radix-ui/react-separator` | ^1.1.1 | ✅ | Divisores visuales |
| **Sheet** | `@radix-ui/react-dialog` | ^1.1.4 | ✅ | Paneles laterales |
| **Sidebar** | - | - | ✅ | Navegación lateral |
| **Skeleton** | - | - | ✅ | Loading placeholders |
| **Tabs** | `@radix-ui/react-tabs` | ^1.1.2 | ✅ | Content organization |
| **Tooltip** | `@radix-ui/react-tooltip` | ^1.2.7 | ✅ | Información contextual |

### 📊 Estadísticas de Uso

- **Button**: 85+ usos en `apps/dashboard`
- **Card**: Múltiples usos en dashboards
- **Badge**: Usado en varios componentes
- **Avatar**: Usado en perfiles y listas
- **Progress**: Usado en métricas
- **Tabs**: Usado en organización de contenido

---

## ⚙️ Configuración

### 1. `components.json`

Configurado para monorepo con rutas relativas:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "../../tailwind.config.ts",
    "css": "../../apps/dashboard/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "./src/components",
    "utils": "./src/lib/utils",
    "ui": "./src/components",
    "lib": "./src/lib",
    "hooks": "./src/hooks"
  }
}
```

### 2. TypeScript Configuration

El `tsconfig.json` del dashboard tiene paths configurados:

```json
{
  "paths": {
    "@vibethink/ui": ["../../packages/ui/src"],
    "@vibethink/ui/*": ["../../packages/ui/src/*"]
  }
}
```

### 3. Next.js Configuration

El `next.config.js` transpila el package:

```javascript
transpilePackages: ['@vibethink/ui', '@vibethink/utils', '@vibethink/bundui-ui']
```

### 4. Dependencias

Todas las dependencias están en `packages/ui/package.json`:

```json
{
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.2.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

---

## 🚀 Uso en el Proyecto

### Patrón de Import (Correcto)

```typescript
// ✅ Correcto - Import desde workspace package
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { Badge } from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import { Avatar, AvatarFallback } from '@vibethink/ui'
import { Progress } from '@vibethink/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui'
import { Input } from '@vibethink/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vibethink/ui'
```

### ❌ Patrón Incorrecto

```typescript
// ❌ Incorrecto - No usar paths relativos
import { Card } from '../../packages/ui/src/components/card'
```

### Ejemplos de Uso

#### Card con Badge y Progress

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { Badge } from '@vibethink/ui'
import { Progress } from '@vibethink/ui'

export default function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline de Ventas</CardTitle>
        <Badge variant="secondary">12 deals activos</Badge>
      </CardHeader>
      <CardContent>
        <Progress value={75} className="mt-2" />
      </CardContent>
    </Card>
  )
}
```

#### Dialog con Input

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vibethink/ui'
import { Input } from '@vibethink/ui'
import { Button } from '@vibethink/ui'

export function CreateDialog() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Item</DialogTitle>
        </DialogHeader>
        <Input placeholder="Nombre..." />
        <Button>Guardar</Button>
      </DialogContent>
    </Dialog>
  )
}
```

#### Sheet (Panel Lateral)

```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@vibethink/ui'
import { Button } from '@vibethink/ui'

export function SidePanel() {
  return (
    <Sheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configuración</SheetTitle>
        </SheetHeader>
        {/* Contenido */}
      </SheetContent>
    </Sheet>
  )
}
```

---

## ➕ Agregar Nuevos Componentes

### Método 1: Manual (Recomendado para Monorepo)

1. **Copiar código desde Shadcn docs**
   - https://ui.shadcn.com/docs/components/[component]

2. **Crear archivo en `packages/ui/src/components/`**
   ```bash
   touch packages/ui/src/components/select.tsx
   ```

3. **Ajustar imports**
   ```typescript
   // Cambiar de:
   import { cn } from "@/lib/utils"
   
   // A:
   import { cn } from "../lib/utils"
   ```

4. **Actualizar `package.json` dependencies** (si necesita Radix UI)
   ```json
   "@radix-ui/react-select": "^2.2.5"
   ```

5. **Exportar en `packages/ui/src/index.ts`**
   ```typescript
   export * from './components/select';
   ```

6. **Instalar dependencies**
   ```bash
   cd packages/ui
   npm install
   ```

7. **Usar en apps**
   ```typescript
   import { Select } from '@vibethink/ui'
   ```

### Método 2: Script de Actualización

El proyecto incluye un script mejorado:

```bash
# Actualizar componentes específicos
npm run update:ui select form label

# Actualizar todos los componentes
npm run update:ui:all

# Listar componentes disponibles
npm run update:ui:list
```

**Ubicación:** `scripts/update-shadcn.js`

**Características del script:**
- ✅ Timeout de 8 segundos
- ✅ Retry automático (2 intentos)
- ✅ Múltiples URLs (fallback)
- ✅ Corrección automática de imports
- ✅ Mejor manejo de errores

---

## 🔧 Script de Actualización

### Uso

```bash
# Actualizar componente específico
npm run update:ui dialog

# Actualizar múltiples componentes
npm run update:ui input select form

# Actualizar todos
npm run update:ui:all

# Listar disponibles
npm run update:ui:list
```

### Componentes Disponibles en el Script

- avatar, badge, button, card
- checkbox, dialog, form
- input, label, progress
- select, separator, sheet
- table, tabs, toast, toaster

### Mejoras Implementadas

1. **Timeout**: 8 segundos (evita cuelgues)
2. **Retry**: 2 intentos automáticos
3. **Múltiples URLs**: Prueba `new-york` y `default` registries
4. **Corrección de imports**: Ajusta automáticamente los paths
5. **Mejor logging**: Muestra qué URL está probando

### Troubleshooting del Script

Si el script falla:

1. **Verificar conexión a GitHub**
   ```bash
   curl https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/default/ui/button.tsx
   ```

2. **Verificar proxy** (si hay proxy corporativo)
   - El script usa `https.get()` sin configuración de proxy
   - Puede necesitar configuración adicional

3. **Crear manualmente** (método recomendado)
   - Copiar desde https://ui.shadcn.com
   - Ajustar imports manualmente

---

## ✨ Mejores Prácticas

### 1. Imports

✅ **Correcto:**
```typescript
import { Button, Card, Dialog } from '@vibethink/ui'
```

❌ **Incorrecto:**
```typescript
import { Button } from '@vibethink/ui/components/button'
```

### 2. Customización

✅ **Modificar directamente el componente:**
```typescript
// packages/ui/src/components/button.tsx
const buttonVariants = cva(
  "your-custom-base-classes",
  {
    variants: {
      variant: {
        custom: "your-custom-variant"
      }
    }
  }
)
```

### 3. Theming

✅ **Usar CSS variables:**
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}
```

### 4. Accesibilidad

✅ **Radix UI maneja ARIA automáticamente:**
- No necesitas agregar roles manualmente
- Focus management incluido
- Keyboard navigation built-in

### 5. Performance

✅ **Tree-shaking funciona automáticamente:**
- Solo se incluyen componentes importados
- No hay runtime overhead
- Bundle size optimizado

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@vibethink/ui'"

**Solución:**
```bash
# Verificar que el workspace está configurado
npm install

# Verificar paths en tsconfig.json
# Debe tener: "@vibethink/ui": ["../../packages/ui/src"]
```

### Error: "Module not found: Can't resolve '@radix-ui/react-*'"

**Solución:**
```bash
cd packages/ui
npm install @radix-ui/react-[missing-primitive]
```

### Componente no renderiza

**Verificar:**
1. Import correcto desde `@vibethink/ui`
2. Dependencias instaladas en `packages/ui`
3. Export en `packages/ui/src/index.ts`
4. Next.js transpilando el package

### Estilos no se aplican

**Verificar:**
1. Tailwind config incluye `packages/ui/src/**/*.{ts,tsx}`
2. CSS variables definidas en `globals.css`
3. `tailwindcss-animate` instalado

---

## 📚 Referencias

### Documentación Oficial

- **Shadcn UI:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **Monorepo Pattern:** https://ui.shadcn.com/docs/monorepo
- **Tailwind CSS:** https://tailwindcss.com

### Documentación del Proyecto

- **Dev-Kit Guide:** `_vibethink-dev-kit/knowledge/stack-guides/SHADCN_RADIX_UI_STACK.md`
- **Implementation Status:** `packages/ui/IMPLEMENTATION_STATUS.md`
- **Update Script:** `scripts/README-UPDATE-SHADCN.md`

### Componentes por Categoría

**Formularios:**
- Input, Select, Checkbox, Label, Form

**Navegación:**
- Tabs, Sidebar, Dropdown Menu

**Feedback:**
- Dialog, Sheet, Tooltip, Toast, Progress, Skeleton

**Display:**
- Card, Badge, Avatar, Separator

**Acciones:**
- Button

---

## 📊 Versiones Actuales

```json
{
  "shadcn": "latest",
  "@radix-ui/react-avatar": "^1.1.2",
  "@radix-ui/react-dialog": "^1.1.4",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-label": "^2.1.1",
  "@radix-ui/react-progress": "^1.1.1",
  "@radix-ui/react-separator": "^1.1.1",
  "@radix-ui/react-slot": "^1.1.1",
  "@radix-ui/react-tabs": "^1.1.2",
  "@radix-ui/react-tooltip": "^1.2.7",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "^0.468.0"
}
```

---

## ✅ Checklist de Implementación

- [x] Estructura de package correcta (`packages/ui/`)
- [x] `components.json` configurado para monorepo
- [x] `package.json` con exports correctos
- [x] Dependencias de Radix UI instaladas
- [x] Función `cn()` implementada en `lib/utils.ts`
- [x] 14 componentes implementados
- [x] Todos los componentes exportados en `index.ts`
- [x] TypeScript paths configurados en apps
- [x] Next.js transpilando el package
- [x] Componentes siendo usados en el dashboard (85+ archivos)
- [x] Script de actualización disponible y mejorado
- [x] Sidebar completamente funcional
- [x] Documentación completa

---

**Última actualización:** 2025-01-16  
**Mantenedor:** VibeThink Engineering  
**Status:** ✅ Production Ready










