# 🚀 Plan de Implementación - Theme Customizer & Sidebar Completo

## 📝 **Archivos a Modificar/Crear**

### 1. Corregir opciones de selectores

**A. `src/shared/lib/themes.ts`**
```typescript
// Cambiar SCALE_OPTIONS:
export const SCALE_OPTIONS = [
  { name: "RESET", value: "reset" },
  { name: "XS", value: "xs" },
  { name: "LG", value: "lg" }
];

// Cambiar RADIUS_OPTIONS:
export const RADIUS_OPTIONS = [
  { name: "RESET", value: "reset" },
  { name: "SM", value: "sm" },
  { name: "MD", value: "md" },
  { name: "LG", value: "lg" },
  { name: "XL", value: "xl" }
];

// Cambiar DEFAULT_THEME:
export const DEFAULT_THEME = {
  preset: "default",
  radius: "reset", 
  scale: "reset",
  contentLayout: "full",
  sidebarMode: "default"
} as const;
```

**B. `src/shared/components/bundui-premium/components/theme-customizer/ThemeProvider.tsx`**
```typescript
// Actualizar mapeos:
const radiusMap = {
  "reset": "0.5rem",
  "sm": "0.125rem", 
  "md": "0.375rem",
  "lg": "0.75rem",
  "xl": "1rem"
};

const scaleMap = {
  "reset": "100%",
  "xs": "90%",
  "lg": "110%"
};

// Agregar sidebar mode handling:
if (theme.sidebarMode !== "default") {
  body.setAttribute("data-sidebar-mode", theme.sidebarMode);
} else {
  body.removeAttribute("data-sidebar-mode");
}
```

### 2. Layout fixes para botones

**A. `ThemeScaleSelector.tsx`**
```tsx
<ToggleGroup
  value={theme.scale}
  type="single"
  onValueChange={handleScaleChange}
  className="grid grid-cols-3 gap-2 w-full" // 3 botones: RESET, XS, LG
>
```

**B. `ThemeRadiusSelector.tsx`**
```tsx
<ToggleGroup
  value={theme.radius}
  type="single"
  onValueChange={handleRadiusChange}
  className="grid grid-cols-5 gap-1 w-full" // 5 botones: RESET, SM, MD, LG, XL
>
```

### 3. Implementar SidebarModeSelector

**Crear: `src/shared/components/bundui-premium/components/theme-customizer/SidebarModeSelector.tsx`**
```tsx
"use client";

import { Label } from "@/shared/components/bundui-premium/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/bundui-premium/components/ui/toggle-group";
import { useThemeConfig } from "./ThemeProvider";
import { PanelLeft, Menu } from "lucide-react";

export function SidebarModeSelector() {
  const { theme, setTheme } = useThemeConfig();

  const handleSidebarModeChange = (value: string) => {
    if (value) {
      setTheme({ ...theme, sidebarMode: value as any });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Label>Sidebar Mode:</Label>
      <ToggleGroup
        value={theme.sidebarMode}
        type="single"
        onValueChange={handleSidebarModeChange}
        className="grid grid-cols-2 gap-2 w-full"
      >
        <ToggleGroupItem
          variant="outline"
          value="default"
          className="border border-input rounded-md bg-background data-[state=on]:bg-accent"
        >
          <PanelLeft className="h-4 w-4 mr-2" />
          Default
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="icon"
          className="border border-input rounded-md bg-background data-[state=on]:bg-accent"
        >
          <Menu className="h-4 w-4 mr-2" />
          Icon
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
```

### 4. Sidebar Completo con Navegación

**Actualizar: `src/shared/components/bundui-premium/components/layout/BunduiCompleteLayout.tsx`**

**Agregar imports:**
```tsx
import { 
  BarChart3, Calendar, MessageCircle, StickyNote, Mail, 
  CheckSquare, Users, Lock, AlertTriangle, Plane, 
  DollarSign, Layers, FileText, BarChart, Table,
  User, Bell, Shield
} from 'lucide-react';
```

**Reemplazar sidebar navigation con:**
```tsx
{/* Sidebar Navigation */}
<nav className="flex-1 space-y-2 p-4">
  {/* Dashboards */}
  <div className="space-y-1">
    <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
      Dashboards
    </h3>
    <Button variant="secondary" className="w-full justify-start">
      <BarChart3 className="mr-2 h-4 w-4" />
      Default
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <DollarSign className="mr-2 h-4 w-4" />
      E-commerce
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <BarChart className="mr-2 h-4 w-4" />
      Sales
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Users className="mr-2 h-4 w-4" />
      CRM
    </Button>
  </div>
  
  {/* Apps */}
  <div className="space-y-1">
    <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
      Apps
    </h3>
    <Button variant="ghost" className="w-full justify-start">
      <Calendar className="mr-2 h-4 w-4" />
      Calendar
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <MessageCircle className="mr-2 h-4 w-4" />
      Chat
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <StickyNote className="mr-2 h-4 w-4" />
      Notes
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Mail className="mr-2 h-4 w-4" />
      Mail
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <CheckSquare className="mr-2 h-4 w-4" />
      Tasks
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Users className="mr-2 h-4 w-4" />
      Contacts
    </Button>
  </div>

  {/* Pages */}
  <div className="space-y-1">
    <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
      Pages
    </h3>
    <Button variant="ghost" className="w-full justify-start">
      <Lock className="mr-2 h-4 w-4" />
      Authentication
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <AlertTriangle className="mr-2 h-4 w-4" />
      Error Pages
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Plane className="mr-2 h-4 w-4" />
      Landing
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <DollarSign className="mr-2 h-4 w-4" />
      Pricing
    </Button>
  </div>

  {/* Components */}
  <div className="space-y-1">
    <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
      Components
    </h3>
    <Button variant="ghost" className="w-full justify-start">
      <Layers className="mr-2 h-4 w-4" />
      UI Components
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <FileText className="mr-2 h-4 w-4" />
      Forms
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <BarChart className="mr-2 h-4 w-4" />
      Charts
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Table className="mr-2 h-4 w-4" />
      Tables
    </Button>
  </div>

  {/* Settings */}
  <div className="space-y-1">
    <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
      Settings
    </h3>
    <Button variant="ghost" className="w-full justify-start">
      <User className="mr-2 h-4 w-4" />
      Profile
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <User className="mr-2 h-4 w-4" />
      Account
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Bell className="mr-2 h-4 w-4" />
      Notifications
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Shield className="mr-2 h-4 w-4" />
      Security
    </Button>
  </div>
</nav>
```

## 🎯 **Orden de Implementación Sugerido**

1. **Modificar themes.ts** - Corregir opciones y DEFAULT_THEME
2. **Actualizar ThemeProvider.tsx** - Nuevos mapeos y sidebar mode
3. **Fix layout botones** - Grid en Scale y Radius selectors  
4. **Crear SidebarModeSelector.tsx** - Componente nuevo
5. **Actualizar BunduiCompleteLayout.tsx** - Sidebar completo + imports SidebarModeSelector
6. **Testing completo** - Verificar todas las funcionalidades

**Estimación total:** 45-60 minutos para implementación completa.