# Troubleshooting Guide

This document captures common technical issues, their root causes, and resolutions for the VibeThink Orchestrator.

## React & Next.js

### Incident: "Objects are not valid as a React child" (React 18 vs 19 Version Mismatch)

**Date:** 2025-12-20  
**Affected Modules:** `@vibethink/ui`, `apps/dashboard` (E-commerce, Fitness)  
**Status:** ⚠️ **PROBLEMA REPETITIVO** - Requiere validación constante

#### Symptoms
- The application crashes with the error:  
  `Runtime Error: Objects are not valid as a React child (found: object with keys {$$typeof, type, key, props, _owner, _store}). If you meant to render a collection of children, use an array instead.`
- This occurs primarily in **Client Components** (`"use client"`) that import UI components.
- Build puede compilar sin errores pero runtime falla
- Errores intermitentes que aparecen y desaparecen

#### Root Cause
This issue is caused by a **React Version Mismatch** combined with **Barrel File Exports**.
1.  **Version Mismatch:** Different packages in the monorepo have different React versions:
    - `apps/dashboard` might have React 19.0.0
    - `packages/ui` might resolve to React 18 types or vice versa
    - `@types/react` version doesn't match `react` version
2.  **Serialization Failure:** When Next.js attempts to process the barrel file (`index.ts` in `@vibethink/ui`), the type mismatch causes the Server-to-Client serialization boundary to fail. Next.js receives a raw object representation of a component instead of a valid React Element, which throws the "Objects are not valid" error when rendered.
3.  **Monorepo Hoisting:** npm/yarn hoisting can cause different packages to resolve different React versions, even if they specify the same version in package.json.

#### ⚠️ IMPORTANTE: Estado Actual del Proyecto

**Según `docs/ui-ux/REACT_19_COMPATIBILITY_ANALYSIS.md`:**
- ✅ El proyecto **YA usa React 19.0.0** en `apps/dashboard`
- ✅ Next.js 15.3.4 está diseñado para React 19
- ⚠️ **PERO** el problema puede ocurrir si:
  - `packages/ui` tiene `@types/react` desalineado
  - Hay múltiples versiones de React en `node_modules`
  - `peerDependencies` son muy restrictivas
  - No hay `overrides` en root `package.json`

#### Solution
**Immediate Fix (Recommended):**
Refactor imports to use **Direct Subpath Imports**. Bypass the barrel file entirely.

*   ❌ **BAD:**  
    ```tsx
    import { Card, Button } from "@vibethink/ui";
    ```
*   ✅ **GOOD:**  
    ```tsx
    import { Card } from "@vibethink/ui/components/card";
    import { Button } from "@vibethink/ui/components/button";
    ```
    This ensures that only the specific component code is imported, avoiding the complex dependency graph of the barrel file and improving tree-shaking.

#### Long-Term Fix
Ensure strict dependency alignment across the monorepo.

**1. Agregar overrides en root `package.json`:**
```json
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6"
  }
}
```

**2. Verificar que `packages/ui/package.json` tenga:**
```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6"
  }
}
```

**3. Limpiar y reinstalar:**
```bash
# Eliminar node_modules y lockfiles
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm package-lock.json apps/*/package-lock.json packages/*/package-lock.json

# Reinstalar
npm install
```

**4. Validar versiones:**
```bash
# Ejecutar script de validación
node scripts/validate-react-versions.js

# Verificar manualmente
npm list react react-dom @types/react @types/react-dom
```

#### 🔍 Script de Validación Automatizada

**Nuevo script:** `scripts/validate-react-versions.js`

Este script detecta automáticamente:
- ✅ Múltiples versiones de React en el monorepo
- ✅ Desalineación entre `react` y `@types/react`
- ✅ `peerDependencies` muy restrictivas
- ✅ Falta de `overrides` en root package.json

**Uso:**
```bash
node scripts/validate-react-versions.js
```

**El script reporta:**
- Errores críticos (múltiples versiones)
- Advertencias (desalineaciones menores)
- Soluciones recomendadas para cada problema

**Ejecutar ANTES de cada commit** para prevenir el problema.

### Prevention Strategy (BundUI/Package Updates)
To prevent this issue from recurring when updating `BundUI` or `@vibethink/ui`, follow these best practices:

#### 1. Enforce Direct Imports via ESLint
The most robust prevention method is to technically prohibit the use of the barrel import. Add this rule to your root `.eslintrc.json`:

```json
"rules": {
  "no-restricted-imports": [
    "error",
    {
      "paths": [
        {
          "name": "@vibethink/ui",
          "message": "Please import directly from '@vibethink/ui/components/...' to avoid React version mismatch crashes."
        }
      ]
    }
  ]
}
```

#### 2. Validación Automatizada con Script

**Ejecutar antes de cada commit:**
```bash
node scripts/validate-react-versions.js
```

Este script detecta:
- Múltiples versiones de React
- Desalineación de `@types/react`
- `peerDependencies` incorrectas
- Falta de `overrides`

#### 3. Strict Version Pinning in `packages/ui`
When updating the UI package:
1.  Open `packages/ui/package.json`.
2.  Ensure `devDependencies` explicitly lists the **exact same version** of React types as `apps/dashboard`:
    ```json
    {
      "devDependencies": {
        "@types/react": "^19.1.8",
        "@types/react-dom": "^19.1.6"
      }
    }
    ```
3.  Check `peerDependencies` to ensure it allows both React 18 and 19:
    ```json
    {
      "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      }
    }
    ```
4.  Run `npm list react react-dom @types/react @types/react-dom` in the root to verify no duplicate versions are installed.

---

## Sidebar & UI Components

### Incident: Logo Colapsado Error en dashboard-vibethink (React Children Error)

**Date:** 2025-12-20 (2:14 PM)  
**Affected Modules:** `apps/dashboard/src/components/vibethink-sidebar.tsx`

#### Symptoms
- Error: `Objects are not valid as a React child` cuando se intenta colapsar el sidebar
- Warning: `validateDOMNesting(...): <a> cannot appear as a descendant of <button>`
- El logo no se muestra correctamente cuando el sidebar está colapsado
- Build puede fallar con errores de React children

#### Root Cause
Se intentó hacer que el logo colapsado funcionara igual que en `dashboard-bundui`, pero se removió incorrectamente la prop `asChild` del `SidebarMenuButton`.

**Problema específico:**
- Sin `asChild`, React intenta renderizar un `<button>` con un `<a>` dentro (HTML inválido)
- React 19 es más estricto con la composición de componentes que React 18
- `asChild` es necesario para que Radix UI componga correctamente `SidebarMenuButton` con `Link`

**Código problemático (commit 1929140):**
```tsx
// ❌ INCORRECTO - Sin asChild
<SidebarMenuButton size="lg" className="...">
  <Link href="/dashboard-vibethink/default" className="...">
    <Logo />
    <span>VibeThink Orchestrator</span>
  </Link>
</SidebarMenuButton>
```

#### Solution
**Immediate Fix:**
Restaurar `asChild` prop + usar técnica CSS de bundui para ocultar texto cuando está colapsado:

```tsx
// ✅ CORRECTO
<SidebarMenuButton 
  size="lg" 
  asChild  // ← CRÍTICO: Debe estar
  className="hover:text-foreground hover:bg-[var(--primary)]/5"
>
  <Link 
    href={isVibeThinkRoute ? "/dashboard-vibethink" : "/dashboard-bundui"} 
    className="flex items-center gap-2"
  >
    <Logo />
    <span className="font-semibold group-data-[collapsible=icon]:hidden">
      VibeThink
    </span>
    <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
      {sectionTitle}
    </span>
  </Link>
</SidebarMenuButton>
```

**Por qué funciona:**
- `asChild` le dice a Radix UI que use el `Link` como el botón real (evita error React children)
- `group-data-[collapsible=icon]:hidden` oculta el texto cuando el sidebar está colapsado (igual que funciona en dashboard-bundui)
- El Logo se muestra siempre sin necesidad de lógica condicional

#### Affected Files
- `apps/dashboard/src/components/vibethink-sidebar.tsx`

#### Related Documentation
- `ANALISIS_PROBLEMA_LOGO_COLAPSADO.md` - Análisis técnico completo
- `SOLUCION_LOGO_COLAPSADO.tsx` - Código solución
- `PLAN_RECUPERACION_SEGURO_PASO_A_PASO.md` - Plan de recuperación

---

### Incident: Sidebar Persistence por Dashboard (Cookies Aisladas)

**Date:** 2025-12-20 (1-2 PM - funcionando correctamente)  
**Affected Modules:** `packages/ui/src/components/sidebar.tsx`, layout files

#### Context
Cada dashboard necesita su propio sistema de persistencia de estado del sidebar:
- `dashboard-bundui` → cookie: `bundui_sidebar_state`
- `dashboard-vibethink` → cookie: `vibethink_sidebar_state`

#### Implementation
**Archivo:** `packages/ui/src/components/sidebar.tsx`

```typescript
function SidebarProvider({
  cookieName,  // ← Permite personalizar por dashboard
  // ...
}: {
  cookieName?: string;
  // ...
}) {
  const finalCookieName = cookieName || SIDEBAR_COOKIE_NAME;
  
  // Restore state from cookie on mount
  React.useEffect(() => {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${finalCookieName}=`))
      ?.split("=")[1];
    
    if (value === "true") _setOpen(true);
    else if (value === "false") _setOpen(false);
  }, []);
}
```

**Uso en layouts:**
```tsx
// dashboard-bundui/layout.tsx
<SidebarProvider cookieName="bundui_sidebar_state" defaultOpen={true}>

// dashboard-vibethink/layout.tsx
<SidebarProvider cookieName="vibethink_sidebar_state" defaultOpen={true}>
```

#### Status
✅ **Funcionando correctamente** - Implementado entre 1-2 PM del 2025-12-20

#### Notes
- ⚠️ Verificar compatibilidad SSR (Next.js) si hay problemas
- Cada dashboard mantiene su estado independientemente

---

## Migración: Bundui Premium → dashboard-bundui / dashboard-vibethink

### Contexto de la Migración

**Objetivo:** Migrar módulos y componentes desde Bundui Premium (referencia externa) a nuestros dashboards en el monorepo:
- **dashboard-bundui:** Espejo fiel de Bundui Premium (NO modificar, solo adaptar imports)
- **dashboard-vibethink:** Personalizaciones y mejoras (SÍ modificar, total libertad)

### Problemas Comunes Durante la Migración

#### 1. Imports Rotos Después de Migrar Módulo

**Síntomas:**
- Error: `Module not found: Can't resolve '@/...'`
- Build falla con errores de imports
- Componentes no se renderizan

**Causa:**
Los módulos de Bundui Premium usan imports relativos que no funcionan en nuestro monorepo.

**Solución:**
Actualizar todos los imports a usar `@vibethink/ui` y rutas absolutas del monorepo:

```tsx
// ❌ INCORRECTO (Bundui Premium original)
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/shared/components/bundui-premium/...";

// ✅ CORRECTO (Monorepo)
import { Card, Button } from "@vibethink/ui";
import { AppSidebar } from "@vibethink/ui";
```

**Checklist de migración:**
- [ ] Buscar todos los imports `@/components/ui/*` → cambiar a `@vibethink/ui`
- [ ] Buscar imports de `bundui-premium` → cambiar a `@vibethink/ui`
- [ ] Verificar que `useIsMobile`, `useIsTablet` vengan de `@vibethink/ui`
- [ ] Verificar rutas de assets: usar `/assets/...` (absolutas)

#### 2. Rutas Incorrectas en dashboard-vibethink

**Síntomas:**
- Links apuntan a `/dashboard-bundui/*` desde `dashboard-vibethink`
- Navegación confusa entre dashboards
- Rutas no funcionan correctamente

**Causa:**
Al copiar módulos desde `dashboard-bundui` a `dashboard-vibethink`, las rutas no se actualizaron.

**Solución:**
**Regla crítica:** TODAS las rutas en `dashboard-vibethink` deben apuntar a `/dashboard-vibethink/*`

```tsx
// ❌ INCORRECTO (copiado desde dashboard-bundui)
<Link href="/dashboard-bundui/crm">CRM</Link>

// ✅ CORRECTO (en dashboard-vibethink)
<Link href="/dashboard-vibethink/crm">CRM</Link>
```

**Script de verificación:**
```bash
# Buscar rutas incorrectas en dashboard-vibethink
grep -r "dashboard-bundui" apps/dashboard/app/dashboard-vibethink/
```

#### 3. Componentes de Layout No Encontrados

**Síntomas:**
- Error: `AppSidebar is not exported from '@vibethink/ui'`
- Componentes de sidebar/header no funcionan

**Causa:**
El módulo migrado intenta usar componentes que aún no están en `@vibethink/ui` o usan imports legacy.

**Solución:**
Verificar que todos los componentes de layout vengan de `@vibethink/ui`:

```tsx
// ✅ CORRECTO - Componentes disponibles en @vibethink/ui
import { 
  AppSidebar,
  SiteHeader,
  NavMain,
  NavUser,
  Notifications,
  Search,
  ThemeSwitch,
  UserMenu,
  useIsMobile,
  useIsTablet
} from "@vibethink/ui";
```

**Referencia:** `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md` - Lista completa de componentes migrados

#### 4. Assets No Encontrados

**Síntomas:**
- Imágenes no se cargan
- Error 404 en assets

**Causa:**
Rutas relativas de assets que no funcionan en el monorepo.

**Solución:**
Usar rutas absolutas desde `/assets/`:

```tsx
// ❌ INCORRECTO
<img src="../images/logo.png" />
<img src="../../assets/logo.png" />

// ✅ CORRECTO
<img src="/assets/images/logo.png" />
```

**Referencia:** `docs/architecture/ASSETS_REPOSITORY_POLICY.md` - Política de assets

#### 5. Sidebar No Se Actualiza con Nuevo Módulo

**Síntomas:**
- Módulo migrado funciona pero no aparece en el sidebar
- Navegación incompleta

**Causa:**
El sidebar no se actualizó con el nuevo módulo migrado.

**Solución:**
Agregar el módulo a `bundui-nav-items.ts`:

**Archivo:** `apps/dashboard/src/shared/data/bundui-nav-items.ts`

```typescript
{
  title: "Apps",
  items: [
    // ... otros items
    {
      title: "Nuevo Módulo",
      href: "/dashboard-bundui/nuevo-modulo",  // o /dashboard-vibethink/...
      icon: IconComponent
    }
  ]
}
```

**Nota:** 
- Si va en `dashboard-bundui` → ruta: `/dashboard-bundui/...`

#### 6. Error: "Class extends value undefined is not a constructor or null"

**Síntomas:**
- Error al cargar página migrada: `TypeError: Class extends value undefined is not a constructor or null`
- Error menciona "React Class Component being rendered in a Server Component"
- La página no carga (error 500)

**Causa:**
El `page.tsx` es un Server Component pero importa componentes que usan `@vibethink/ui`, que exporta `minimal-tiptap` (requiere Client Component).

**Solución:**
Agregar `"use client"` al inicio del `page.tsx`:

```tsx
// ❌ INCORRECTO (causa error)
import { Button } from "@vibethink/ui";
import { StatCards } from "./components/stat-cards";

export default function Page() {
  return <StatCards />;
}

// ✅ CORRECTO
"use client";

import { Button } from "@vibethink/ui";
import { StatCards } from "./components/stat-cards";

export default function Page() {
  return <StatCards />;
}
```

**⚠️ Nota importante:**
- Si agregas `"use client"`, **NO puedes usar `generateMetadata()`** (solo funciona en Server Components)
- Si necesitas SEO crítico, usa patrón híbrido (Server Component wrapper + Client Component interno)

**Protocolo completo:** Ver `docs/architecture/BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md` - Guía completa sobre cuándo usar `"use client"` durante migración

**Referencia:** Caso real documentado en módulo Hotel (2025-12-20)
- Si va en `dashboard-vibethink` → ruta: `/dashboard-vibethink/...`

### Checklist de Migración de Módulo

Al migrar un módulo desde Bundui Premium:

- [ ] **Copiar archivos** del módulo a destino (`dashboard-bundui/` o `dashboard-vibethink/`)
- [ ] **Actualizar imports:**
  - [ ] `@/components/ui/*` → `@vibethink/ui`
  - [ ] `bundui-premium/*` → `@vibethink/ui`
  - [ ] Hooks (`useIsMobile`, etc.) → `@vibethink/ui`
- [ ] **Actualizar rutas:**
  - [ ] Si va en `dashboard-vibethink`, todas las rutas deben ser `/dashboard-vibethink/*`
  - [ ] Links internos actualizados
- [ ] **Actualizar assets:**
  - [ ] Rutas absolutas desde `/assets/`
- [ ] **Agregar al sidebar:**
  - [ ] Actualizar `bundui-nav-items.ts` si es necesario
- [ ] **Verificar build:**
  - [ ] `npm run build` sin errores
  - [ ] `npm run dev` funciona
- [ ] **Probar funcionalidad:**
  - [ ] Navegación funciona
  - [ ] Componentes se renderizan
  - [ ] Sin errores en consola

### Scripts de Validación Automatizada

Durante la migración de Bundui Premium, se crearon scripts de validación automatizada para detectar y corregir problemas comunes:

#### 1. Validación de Assets

**Scripts disponibles:**

- **`scripts/validate-assets-duplicates.js`** - Detecta assets duplicados por hash MD5
  ```bash
  node scripts/validate-assets-duplicates.js
  ```
  - Busca duplicados en `apps/dashboard/public/assets`
  - Calcula hash MD5 de cada archivo
  - Reporta duplicados con rutas original y duplicada
  - **Uso:** Ejecutar antes de commit para evitar duplicados

- **`scripts/validate-assets-in-repo.js`** - Valida que assets estén en Git
  ```bash
  node scripts/validate-assets-in-repo.js
  ```
  - Verifica que todos los assets estén trackeados en Git
  - Detecta assets ignorados por `.gitignore`
  - Reporta assets no trackeados con comandos `git add`
  - **Uso:** Ejecutar después de agregar nuevos assets

- **`scripts/audit-assets.js`** - Auditoría completa de assets
  ```bash
  node scripts/audit-assets.js
  ```
  - Encuentra todos los assets existentes
  - Busca referencias en código (`app/` y `src/`)
  - Reporta:
    - Assets sin usar (no referenciados)
    - Referencias rotas (assets que no existen)
  - **Uso:** Ejecutar periódicamente para limpiar assets no usados

#### 2. Validación de Versiones de React

**Scripts disponibles:**

- **`scripts/validate-react-versions.js`** - Valida versiones de React en monorepo ⭐ **NUEVO**
  ```bash
  node scripts/validate-react-versions.js
  ```
  - Detecta múltiples versiones de React
  - Verifica alineación de `@types/react` con `react`
  - Valida `peerDependencies`
  - Verifica `overrides` en root package.json
  - **Uso:** Ejecutar ANTES de cada commit para prevenir problemas
  - **Crítico:** Detecta el problema de React 18 vs 19 que causa "Objects are not valid"

#### 3. Validación de Imports

**Scripts disponibles:**

- **`scripts/fix-dashboard-imports.js`** - Corrige imports incorrectos
  ```bash
  node scripts/fix-dashboard-imports.js
  ```
  - Reemplaza `@vibethink/bundui-ui/components/ui/*` → `@vibethink/ui`
  - Corrige `@/components/ui/*` → `@vibethink/ui` (ERROR según guard)
  - Procesa `apps/dashboard/app/(dashboard)`
  - **Uso:** Ejecutar después de migrar módulos desde Bundui

- **`scripts/fix-bundui-apps-imports.js`** - Corrige imports en apps de Bundui
  ```bash
  node scripts/fix-bundui-apps-imports.js
  ```
  - Corrige imports auto-referenciales (app importando de sí misma)
  - Actualiza imports de componentes UI
  - Corrige imports de hooks
  - **Uso:** Ejecutar después de copiar apps desde Bundui Original

#### 4. Validación de Rutas

**Scripts disponibles:**

- **`scripts/validate-dashboard-routes.js`** - Valida rutas de dashboards
  ```bash
  node scripts/validate-dashboard-routes.js
  ```
  - Verifica que `dashboard-bundui` use solo rutas `/dashboard-bundui/*`
  - Verifica que `dashboard-vibethink` use solo rutas `/dashboard-vibethink/*`
  - Detecta referencias cruzadas incorrectas
  - **Uso:** Ejecutar antes de commit para asegurar rutas correctas

#### 5. Workflow Recomendado de Validación

**Antes de hacer commit de un módulo migrado:**

```bash
# 1. ⚠️ CRÍTICO: Validar versiones de React (PREVIENE PROBLEMA REPETITIVO)
node scripts/validate-react-versions.js

# 2. Validar imports
node scripts/fix-dashboard-imports.js

# 3. Validar rutas
node scripts/validate-dashboard-routes.js

# 4. Validar assets
node scripts/validate-assets-in-repo.js
node scripts/validate-assets-duplicates.js

# 5. Auditoría completa (opcional, periódico)
node scripts/audit-assets.js
```

**⚠️ IMPORTANTE:** El paso 1 (validar React) es **OBLIGATORIO** porque previene el problema repetitivo de React 18 vs 19.

**Si hay problemas detectados:**
- Seguir las recomendaciones del script
- Corregir manualmente si es necesario
- Ejecutar el script nuevamente para verificar

#### 6. Problemas Comunes Detectados por Scripts

**React Versions (CRÍTICO - Problema Repetitivo):**
- ❌ Múltiples versiones de React en el monorepo (18 vs 19)
- ❌ `@types/react` desalineado con versión de `react`
- ❌ `peerDependencies` muy restrictivas
- ❌ Falta de `overrides` en root package.json
- ⚠️ **Este es el problema más común y repetitivo**

**i18n (Traducciones):**
- ❌ Claves aparecen visibles en UI (ej: `hotel.components.statCards.unitNumber`)
- ❌ Parámetros no se reemplazan (ej: `{{number}}` aparece visible)
- ❌ Namespace no se carga (mensaje: `[i18n] Namespace 'module-name' not loaded`)
- ❌ Formato incorrecto de parámetros en JSON (`{param}` en lugar de `{{param}}`)
- ❌ Estructura del JSON incorrecta (falta namespace como clave raíz)

**Assets:**
- ❌ Imágenes referenciadas que no existen en el monorepo (vienen de Bundui Original)
- ❌ Assets duplicados (mismo archivo en múltiples ubicaciones)
- ❌ Assets no trackeados en Git (se perderán en deploy)

**Imports:**
- ❌ `@/components/ui/*` (incorrecto, debe ser `@vibethink/ui`)
- ❌ `@vibethink/bundui-ui/*` (deprecated, debe ser `@vibethink/ui`)
- ❌ Imports auto-referenciales en apps migradas

**Rutas:**
- ❌ `dashboard-vibethink` usando rutas `/dashboard-bundui/*`
- ❌ `dashboard-bundui` usando rutas `/dashboard-vibethink/*`

### Referencias de Migración

- `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md` - Guía completa de migración
- `docs/architecture/BUNDUI_MODULES_STATUS.md` - Estado de módulos migrados
- `docs/architecture/DASHBOARD_BUNDUI_VIBETHINK_RULES.md` - Reglas críticas
- `docs/architecture/BUNDUI_VIBETHINK_TANDEM.md` - Flujo de trabajo
- `docs/architecture/MIGRACION_DASHBOARDS_COMPLETA.md` - Documentación de migración completa
- `scripts/README.md` - Documentación de todos los scripts

