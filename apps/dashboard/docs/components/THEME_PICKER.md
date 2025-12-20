# Theme Picker Component

## 📋 Descripción

El componente `ThemePicker` permite a los usuarios seleccionar entre diferentes presets de tema de color para personalizar la apariencia del dashboard. Está inspirado en el theme picker de [shadcn/ui themes](https://ui.shadcn.com/themes) y [tweakcn](https://tweakcn.com/editor/theme).

## 🎨 Características

- ✅ **8 presets de tema** predefinidos (Default, Underground, Rose Garden, Lake View, Sunset Glow, Forest Whisper, Ocean Breeze, Lavender Dream)
- ✅ **Vista de grid** con previews visuales de cada tema
- ✅ **Selector compacto** con búsqueda
- ✅ **Persistencia** en cookies y localStorage
- ✅ **Integración** con el sistema de cookies del servidor (Next.js)
- ✅ **Sincronización** automática con `data-theme-preset` en el body

## 📦 Componentes

### `ThemePicker`

Selector compacto con búsqueda, ideal para headers o espacios reducidos.

```tsx
import { ThemePicker } from "@/shared/components/theme-picker";

<ThemePicker />
```

**Props:**
- `className?: string` - Clases CSS adicionales
- `variant?: "default" | "ghost" | "outline"` - Variante del botón (default: "outline")
- `size?: "default" | "sm" | "lg" | "icon"` - Tamaño del botón (default: "default")

### `ThemePickerGrid`

Vista de grid con previews visuales, ideal para páginas de settings.

```tsx
import { ThemePickerGrid } from "@/shared/components/theme-picker";

<ThemePickerGrid />
```

**Props:**
- `className?: string` - Clases CSS adicionales

## 🎯 Uso

### Ejemplo básico

```tsx
"use client";

import { ThemePicker } from "@/shared/components/theme-picker";

export function MyComponent() {
  return (
    <div>
      <h2>Selecciona un tema</h2>
      <ThemePicker />
    </div>
  );
}
```

### En página de Settings

```tsx
"use client";

import { ThemePicker, ThemePickerGrid } from "@/shared/components/theme-picker";
import { Card, CardContent } from "@vibethink/ui";

export function AppearanceSettings() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Tema de Color</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona un preset de color para personalizar la paleta.
            </p>
          </div>
          
          {/* Vista de grid con previews */}
          <ThemePickerGrid />
          
          {/* Selector compacto alternativo */}
          <div className="pt-4 border-t">
            <ThemePicker className="max-w-xs" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### En Header

```tsx
"use client";

import { ThemePicker } from "@/shared/components/theme-picker";

export function SiteHeader() {
  return (
    <header>
      {/* ... otros elementos ... */}
      <ThemePicker variant="ghost" size="icon" />
    </header>
  );
}
```

## 🔧 Hook `useThemePreset`

Para acceso programático al preset del tema:

```tsx
import { useThemePreset } from "@/shared/lib/use-theme-preset";

export function MyComponent() {
  const { preset, setPreset, currentTheme } = useThemePreset();

  return (
    <div>
      <p>Tema actual: {currentTheme.name}</p>
      <button onClick={() => setPreset("rose-garden")}>
        Cambiar a Rose Garden
      </button>
    </div>
  );
}
```

**Valores retornados:**
- `preset: ThemePreset` - Preset actual
- `setPreset: (preset: ThemePreset) => void` - Función para cambiar el preset
- `mounted: boolean` - Indica si el componente está montado (para evitar hydration issues)
- `currentTheme: ThemePresetConfig` - Configuración completa del tema actual

## 🎨 Presets Disponibles

| Nombre | Valor | Color Principal | Descripción |
|--------|-------|-----------------|-------------|
| Default | `default` | Neutro | Tema neutro por defecto |
| Underground | `underground` | Verde esmeralda | Tema verde esmeralda |
| Rose Garden | `rose-garden` | Rosa elegante | Tema rosa elegante |
| Lake View | `lake-view` | Azul turquesa | Tema azul turquesa |
| Sunset Glow | `sunset-glow` | Naranja cálido | Tema naranja cálido |
| Forest Whisper | `forest-whisper` | Verde bosque | Tema verde bosque |
| Ocean Breeze | `ocean-breeze` | Azul océano | Tema azul océano |
| Lavender Dream | `lavender-dream` | Púrpura suave | Tema púrpura suave |

## 🔄 Cómo Funciona

1. **Aplicación del preset**: El hook `useThemePreset` aplica el atributo `data-theme-preset` al elemento `<body>`
2. **CSS Variables**: Los presets están definidos en `app/themes.css` usando selectores `[data-theme-preset="..."]`
3. **Persistencia**: El preset se guarda en:
   - Cookies (compatible con SSR de Next.js)
   - localStorage (fallback)
4. **Sincronización**: El layout principal (`app/layout.tsx`) lee el preset desde cookies en el servidor

## 📝 Notas Técnicas

- Los presets están definidos en `src/shared/lib/themes.ts`
- Los estilos CSS están en `app/themes.css`
- El hook maneja automáticamente la hidratación para evitar problemas de SSR
- El componente es completamente accesible (ARIA labels, keyboard navigation)

## 🔗 Referencias

- [shadcn/ui themes](https://ui.shadcn.com/themes) - Inspiración del diseño
- [tweakcn](https://tweakcn.com/editor/theme) - Editor visual de temas
- [shadcn/ui create](https://ui.shadcn.com/create) - Generador de temas con variables

## 🚀 Próximas Mejoras

- [ ] Editor visual de temas (similar a tweakcn)
- [ ] Exportar/importar configuraciones de tema
- [ ] Temas personalizados por usuario
- [ ] Preview en tiempo real de cambios
- [ ] Integración con API para guardar preferencias del usuario







