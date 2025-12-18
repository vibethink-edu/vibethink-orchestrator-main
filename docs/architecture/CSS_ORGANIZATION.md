# CSS Organization: Estructura Centralizada

## 📋 Resumen

**Fecha**: 2025-01-17  
**Estado**: ✅ Organizado y Centralizado  
**Principio**: Single Source of Truth para estilos

---

## 🎯 Estructura CSS del Monorepo

### Jerarquía de Estilos

```
┌─────────────────────────────────────────┐
│   1. Tailwind CSS (Base + Utilities)    │
│      - @import "tailwindcss"            │
│      - @plugin "tailwindcss-animate"     │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   2. themes.css (Variables CSS)         │
│      - Presets de colores               │
│      - Radius, Scale, Fonts             │
│      - Dark/Light mode variants         │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   3. globals.css (Global Styles)        │
│      - Estilos base del body            │
│      - Scrollbar personalizado          │
│      - Data-slot overrides              │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   4. Component Styles (Cuando necesario)│
│      - Minimal TipTap editor            │
│      - FullCalendar overrides           │
│      - Componentes con estilos complejos│
└─────────────────────────────────────────┘
```

---

## 📁 Archivos CSS Principales

### 1. `apps/dashboard/app/globals.css` ⭐ PRINCIPAL

**Ubicación**: `C:\IA Marcelo Labs\vibethink-orchestrator-main\apps\dashboard\app\globals.css`

**Propósito**: Punto de entrada CSS para toda la aplicación dashboard

**Contenido**:
```css
@import "tailwindcss";
@plugin "tailwindcss-animate";
@custom-variant dark (&:is(.dark *));
@import "./themes.css";

:root {
  /* Variables CSS base */
  --base-50: oklch(...);
  /* ... colores base */
  
  /* Semantic tokens */
  --background: var(--color-white);
  --foreground: var(--base-800);
  /* ... más tokens */
  
  /* Sidebar tokens */
  --sidebar: var(--base-100);
  --sidebar-foreground: var(--base-800);
  /* ... sidebar variables */
}

.dark {
  /* Dark mode overrides */
}

@theme inline {
  /* Tailwind theme extensions */
}

@layer base {
  /* Base element styles */
}
```

**Import en**: `apps/dashboard/app/layout.tsx`

---

### 2. `apps/dashboard/app/themes.css` ⭐ TEMAS

**Ubicación**: `C:\IA Marcelo Labs\vibethink-orchestrator-main\apps\dashboard\app\themes.css`

**Propósito**: Definiciones de theme presets y variants

**Contenido**:
```css
/* Theme presets */
[data-theme-preset="underground"] { /* ... */ }
[data-theme-preset="rose-garden"] { /* ... */ }
[data-theme-preset="lake-view"] { /* ... */ }
[data-theme-preset="sunset-glow"] { /* ... */ }
[data-theme-preset="forest-whisper"] { /* ... */ }
[data-theme-preset="ocean-breeze"] { /* ... */ }
[data-theme-preset="lavender-dream"] { /* ... */ }

/* Chart presets */
[data-theme-chart-preset="cyan"] { /* ... */ }
[data-theme-chart-preset="amber"] { /* ... */ }
/* ... más presets */

/* Radius variants */
[data-theme-radius="none"] { --radius: 0rem; }
[data-theme-radius="sm"] { --radius: .3rem; }
/* ... más tamaños */

/* Scale variants */
[data-theme-scale="sm"] { /* ... */ }
[data-theme-scale="lg"] { /* ... */ }

/* Font variants */
[data-theme-font="inter"] { /* ... */ }
[data-theme-font="roboto"] { /* ... */ }
/* ... más fuentes */
```

**Import en**: `globals.css` (via `@import "./themes.css"`)

---

### 3. Component-Specific CSS

#### 3.1 Minimal TipTap Editor

**Ubicación**: `packages/ui/src/components/extensions/minimal-tiptap/styles/`

```
styles/
├── index.css                # Punto de entrada
└── partials/
    ├── code.css            # Bloques de código
    ├── lists.css           # Listas ordenadas/desordenadas
    ├── placeholder.css      # Placeholder del editor
    ├── typography.css       # Estilos tipográficos
    └── zoom.css            # Zoom de imágenes
```

**Import en**: Componente `MinimalTiptap`

**Propósito**: Estilos específicos del editor de texto enriquecido

---

#### 3.2 FullCalendar (via CSS Variables)

**Ubicación**: Definido en `globals.css`

```css
:root {
  --fc-button-bg-color: var(--primary);
  --fc-button-hover-bg-color: var(--primary);
  --fc-button-active-bg-color: var(--primary);
  --fc-button-hover-border-color: transparent;
  --fc-button-active-border-color: transparent;
  --fc-button-border-color: transparent;
  --fc-event-border-color: transparent;
  --fc-event-text-color: oklch(1 0 0);
  --fc-border-color: var(--border);
  --fc-page-bg-color: var(--muted);
  --fc-today-bg-color: var(--muted);
}
```

**Propósito**: Personalizar FullCalendar con variables de tema

---

## 🎨 Sistema de Temas

### Variables CSS Semánticas

```css
/* Colores base (oklch) */
--base-50 → --base-1000   /* 11 tonos de gris */
--primary-50 → --primary-1000  /* 11 tonos primarios */
--secondary-50 → --secondary-1000  /* 11 tonos secundarios */

/* Tokens semánticos (mapean a base) */
--background
--foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive
--border, --input, --ring

/* Tokens de sidebar */
--sidebar
--sidebar-foreground
--sidebar-primary
--sidebar-primary-foreground
--sidebar-accent
--sidebar-accent-foreground
--sidebar-border
--sidebar-ring

/* Tokens de charts */
--chart-1 → --chart-5
```

### Dark Mode

```css
/* Automático via @custom-variant */
@custom-variant dark (&:is(.dark *));

/* O manual via clase */
.dark {
  --background: var(--base-950);
  /* ... overrides */
}
```

**Activación**: Via `next-themes` provider en `app/layout.tsx`

---

## 🔧 Configuración Tailwind

### `tailwind.config.ts` (Dashboard)

**Ubicación**: `apps/dashboard/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}", // Importante!
  ],
  theme: {
    extend: {
      // Extensiones si necesario
    },
  },
  plugins: [],
};

export default config;
```

**CRÍTICO**: Debe incluir `packages/ui/src/**/*` para escanear componentes compartidos

---

## 📦 Package UI Styles

### Estructura

```
packages/ui/src/
├── components/
│   └── extensions/
│       └── minimal-tiptap/
│           └── styles/        ← CSS específico de componentes
│               ├── index.css
│               └── partials/
└── styles/                    ← (NO EXISTE - Evitar)
```

**Regla**: CSS de componentes va DENTRO de cada componente, no en carpeta central de `styles/`

---

## ✅ Principios de Organización

### 1. Single Source of Truth

```
✅ CORRECTO:
apps/dashboard/app/globals.css  → Import único en layout.tsx

❌ INCORRECTO:
apps/dashboard/app/globals.css
apps/dashboard/src/app/globals.css  ← Duplicado!
```

### 2. Cascada de Imports

```css
/* globals.css */
@import "tailwindcss";            /* 1. Base Tailwind */
@import "./themes.css";           /* 2. Theme presets */
/* Luego definir :root y overrides */
```

### 3. Component Styles Locales

```
✅ CORRECTO:
packages/ui/src/components/extensions/minimal-tiptap/
├── minimal-tiptap.tsx
└── styles/
    └── index.css

❌ INCORRECTO:
packages/ui/src/styles/
└── minimal-tiptap.css  ← Separado del componente
```

### 4. Variables CSS > Hardcoded Values

```css
/* ✅ CORRECTO */
.my-component {
  background: var(--background);
  color: var(--foreground);
}

/* ❌ INCORRECTO */
.my-component {
  background: #ffffff;
  color: #000000;
}
```

---

## 🚫 Archivos a Eliminar/Deprecar

### Duplicados

- ❌ `apps/dashboard/src/app/globals.css` (si existe)
- ❌ Cualquier `globals.css` fuera de `apps/dashboard/app/`

### Backups

- ⚠️ `bundui-ui.backup*/` - Mantener temporalmente, eliminar cuando no se necesite
- ⚠️ `bundui-ui.backup-20251217-0957/` - Eliminar después de verificación

### Apps No Usadas

- 🔍 Verificar CSS en `apps/website/`, `apps/main-app/`, etc.
- 🔍 Eliminar si las apps no están activas

---

## 📝 Checklist de CSS Limpio

### Para Nueva Feature

- [ ] CSS va en `globals.css` o `themes.css` (si es global)
- [ ] CSS va dentro del componente (si es específico)
- [ ] Usa variables CSS semánticas
- [ ] Soporta dark mode automáticamente
- [ ] No hardcodea colores
- [ ] Respeta la cascada de imports

### Para Mantener

- [ ] Solo un `globals.css` activo (en `apps/dashboard/app/`)
- [ ] Solo un `themes.css` activo (en `apps/dashboard/app/`)
- [ ] `tailwind.config.ts` incluye `packages/ui/src/**/*`
- [ ] No hay CSS duplicado
- [ ] Component styles están junto a componentes

---

## 🔗 Referencias

### Documentación Oficial

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Tailwind v4**: https://tailwindcss.com/blog/tailwindcss-v4-beta
- **Shadcn UI Theming**: https://ui.shadcn.com/docs/theming
- **Next.js CSS**: https://nextjs.org/docs/app/building-your-application/styling

### Documentación Interna

- **AGENTS.md**: Reglas de estilo
- **BUNDUI_MONOREPO_MIRROR.md**: Sistema de temas
- **packages/ui/README.md**: Componentes UI

---

## 🎯 Resumen de Ubicaciones

| Tipo | Ubicación | Import desde |
|------|-----------|--------------|
| **CSS Principal** | `apps/dashboard/app/globals.css` | `apps/dashboard/app/layout.tsx` |
| **Temas** | `apps/dashboard/app/themes.css` | `globals.css` (via @import) |
| **Tailwind Config** | `apps/dashboard/tailwind.config.ts` | - |
| **Component CSS** | Dentro de cada componente | Componente individual |
| **Editor Styles** | `packages/ui/src/components/extensions/minimal-tiptap/styles/` | MinimalTiptap component |

---

## ✅ Estado Final

- [x] CSS centralizado en `apps/dashboard/app/`
- [x] Cascada de imports correcta
- [x] Component styles localizados
- [x] Variables CSS semánticas
- [x] Dark mode configurado
- [x] Tailwind config correcto
- [x] Sin duplicados
- [x] Documentado completamente

---

**Última actualización**: 2025-01-17  
**Versión**: 1.0  
**Estado**: ✅ Organizado y Documentado

