"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { ThemePicker } from "../../theme-picker";
import { FontSelector } from "../../font-selector";
import { useThemeSettings } from "../../../lib/use-theme-settings";
import { useTranslation } from "@/lib/i18n";

// ColorModeSelector - Funcional con next-themes
function ColorModeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('theme');

  return (
    <div className="flex flex-col gap-2">
      <ToggleGroup
        value={theme || "light"}
        type="single"
        onValueChange={(value) => value && setTheme(value)}
        className="w-full gap-2">
        <ToggleGroupItem variant="outline" value="light" className="flex-1">
          {t('customizer.aspect.light')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="dark" className="flex-1">
          {t('customizer.aspect.dark')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="system" className="flex-1">
          {t('customizer.aspect.system')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// ScaleSelector - Tamaño de escala del tema
function ScaleSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setScale, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  return (
    <div className="space-y-1">
      <Label htmlFor="scale" className="text-xs">{t('customizer.advanced.size.scale.label')}:</Label>
      <ToggleGroup
        value={settings.scale}
        type="single"
        onValueChange={(value) => value && setScale(value as "none" | "sm" | "lg")}
        className="w-full gap-1">
        <ToggleGroupItem variant="outline" value="none" className="flex-1 text-xs h-8">
          <span className="sr-only">{t('customizer.advanced.size.scale.none')}</span>
          <span aria-hidden="true">{t('customizer.advanced.size.scale.none')}</span>
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="sm" className="flex-1 text-xs h-8">
          {t('customizer.advanced.size.scale.sm')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="lg" className="flex-1 text-xs h-8">
          {t('customizer.advanced.size.scale.lg')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// RadiusSelector - Radio de bordes
function RadiusSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setRadius, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  return (
    <div className="space-y-1">
      <Label htmlFor="radius" className="text-xs">{t('customizer.advanced.size.radius.label')}:</Label>
      <ToggleGroup
        value={settings.radius}
        type="single"
        onValueChange={(value) => value && setRadius(value as "none" | "sm" | "md" | "lg" | "xl")}
        className="w-full gap-1 min-w-0">
        <ToggleGroupItem variant="outline" value="none" className="flex-1 text-xs h-8">
          <span className="sr-only">{t('customizer.advanced.size.radius.none')}</span>
          <span aria-hidden="true">{t('customizer.advanced.size.radius.none')}</span>
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="sm" className="flex-1 text-xs h-8">
          {t('customizer.advanced.size.radius.sm')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="md" className="flex-1 text-xs h-8">
          {t('customizer.advanced.size.radius.md')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="lg" className="flex-1 text-xs h-8">
          {t('customizer.advanced.size.radius.lg')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="xl" className="flex-1 text-xs h-8">
          {t('customizer.advanced.size.radius.xl')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// ContentLayoutSelector - Layout del contenido
function ContentLayoutSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setContentLayout, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  return (
    <div className="space-y-1">
      <Label htmlFor="contentLayout" className="text-xs">{t('customizer.advanced.layout.content.label')}:</Label>
      <ToggleGroup
        value={settings.contentLayout}
        type="single"
        onValueChange={(value) => value && setContentLayout(value as "full" | "centered")}
        className="w-full gap-1">
        <ToggleGroupItem variant="outline" value="full" className="flex-1 text-xs h-8">
          {t('customizer.advanced.layout.content.full')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="centered" className="flex-1 text-xs h-8">
          {t('customizer.advanced.layout.content.centered')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// SidebarModeSelector - Modo del sidebar
function SidebarModeSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setSidebarMode, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  return (
    <div className="space-y-1">
      <Label htmlFor="sidebarMode" className="text-xs">{t('customizer.advanced.layout.sidebar.label')}:</Label>
      <ToggleGroup
        value={settings.sidebarMode}
        type="single"
        onValueChange={(value) => value && setSidebarMode(value as "default" | "icon")}
        className="w-full gap-1">
        <ToggleGroupItem variant="outline" value="default" className="flex-1 text-xs h-8">
          {t('customizer.advanced.layout.sidebar.default')}
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="icon" className="flex-1 text-xs h-8">
          {t('customizer.advanced.layout.sidebar.icon')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// BaseColorSelector - Color base del tema (nuevo en shadcn/ui)
function BaseColorSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setBaseColor, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  const baseColors = [
    "neutral", "slate", "gray", "zinc", "stone",
    "red", "orange", "amber", "yellow", "lime",
    "green", "emerald", "teal", "cyan", "sky",
    "blue", "indigo", "violet", "purple", "fuchsia",
    "pink", "rose"
  ] as const;

  return (
    <Select value={settings.baseColor} onValueChange={(value) => setBaseColor(value as typeof settings.baseColor)}>
      <SelectTrigger className="w-full h-8 text-xs">
        <SelectValue placeholder={t('customizer.advanced.baseColor.label')} />
      </SelectTrigger>
      <SelectContent>
        {baseColors.map((color) => (
          <SelectItem key={color} value={color}>
            <span className="capitalize text-xs">{color}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// MenuColorSelector - Color del menú (nuevo en shadcn/ui)
function MenuColorSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setMenuColor, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  return (
    <Select value={settings.menuColor} onValueChange={(value) => setMenuColor(value as typeof settings.menuColor)}>
      <SelectTrigger className="w-full h-8 text-xs">
        <SelectValue placeholder={t('customizer.advanced.menu.color.label')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">{t('customizer.advanced.menu.color.default')}</SelectItem>
        <SelectItem value="muted">{t('customizer.advanced.menu.color.muted')}</SelectItem>
        <SelectItem value="accent">{t('customizer.advanced.menu.color.accent')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

// MenuAccentSelector - Acento del menú (nuevo en shadcn/ui)
function MenuAccentSelector({ dashboardPrefix }: { dashboardPrefix?: string }) {
  const { settings, setMenuAccent, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) return null;

  return (
    <Select value={settings.menuAccent} onValueChange={(value) => setMenuAccent(value as typeof settings.menuAccent)}>
      <SelectTrigger className="w-full h-8 text-xs">
        <SelectValue placeholder={t('customizer.advanced.menu.accent.label')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="subtle">{t('customizer.advanced.menu.accent.subtle')}</SelectItem>
        <SelectItem value="moderate">{t('customizer.advanced.menu.accent.moderate')}</SelectItem>
        <SelectItem value="bold">{t('customizer.advanced.menu.accent.bold')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function ThemeCustomizerPanel() {
  const isMobile = useIsMobile();
  const { t, locale } = useTranslation('theme');
  const pathname = usePathname();
  
  // Detectar dashboard actual basado en la ruta
  const dashboardPrefix = pathname?.startsWith('/dashboard-bundui') 
    ? 'bundui' 
    : pathname?.startsWith('/dashboard-vibethink') 
    ? 'vibethink' 
    : undefined;

  // Debug: Verificar que las traducciones se están cargando
  React.useEffect(() => {
    console.log('[ThemeCustomizerPanel] Locale:', locale);
    console.log('[ThemeCustomizerPanel] Test translation:', t('customizer.aspect.label'));
  }, [locale, t]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="me-4 w-80 max-h-[85vh] overflow-x-hidden overflow-y-auto p-4 shadow-xl lg:me-0"
        align={isMobile ? "center" : "end"}>
        <div className="grid space-y-4 min-w-0">
          {/* Sección 1: Modo de Color (Light/Dark) */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t('customizer.aspect.label')}</Label>
            <ColorModeSelector />
          </div>

          {/* Sección 2: Tema Preset (Colores principales) */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="themePreset" className="text-sm font-semibold">{t('customizer.theme.label')}</Label>
              <span className="text-xs text-muted-foreground">{t('customizer.theme.subtitle')}</span>
            </div>
            <ThemePicker variant="outline" size="sm" className="w-full" useSelect={true} dashboardPrefix={dashboardPrefix} />
            <p className="text-xs text-muted-foreground">
              {t('customizer.theme.description')}
            </p>
          </div>

          {/* Sección 3: Fuente */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="font" className="text-sm font-semibold">{t('customizer.font.label')}</Label>
            </div>
            <FontSelector useSelect={true} className="w-full" dashboardPrefix={dashboardPrefix} />
            <p className="text-xs text-muted-foreground">
              {t('customizer.font.description')}
            </p>
          </div>

          {/* Sección 4: Personalización Avanzada (Colapsable) */}
          <details className="space-y-2 pt-2 border-t min-w-0">
            <summary className="cursor-pointer text-sm font-semibold hover:text-foreground">
              {t('customizer.advanced.title')}
            </summary>
            <div className="pt-2 space-y-4 min-w-0">
              {/* Base Color - Solo si no hay preset activo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="baseColor" className="text-xs">{t('customizer.advanced.baseColor.label')}</Label>
                  <span className="text-xs text-muted-foreground">{t('customizer.advanced.baseColor.optional')}</span>
                </div>
                <BaseColorSelector dashboardPrefix={dashboardPrefix} />
                <p className="text-xs text-muted-foreground">
                  {t('customizer.advanced.baseColor.description')}
                </p>
              </div>

              {/* Menu Color y Accent - Agrupados */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{t('customizer.advanced.menu.title')}</Label>
                <MenuColorSelector dashboardPrefix={dashboardPrefix} />
                <MenuAccentSelector dashboardPrefix={dashboardPrefix} />
                <p className="text-xs text-muted-foreground">
                  {t('customizer.advanced.menu.accent.description')}
                </p>
              </div>

              {/* Scale y Radius - Agrupados */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{t('customizer.advanced.size.title')}</Label>
                <ScaleSelector dashboardPrefix={dashboardPrefix} />
                <RadiusSelector dashboardPrefix={dashboardPrefix} />
                <p className="text-xs text-muted-foreground">
                  {t('customizer.advanced.size.description')}
                </p>
              </div>

              {/* Layout y Sidebar Mode */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{t('customizer.advanced.layout.title')}</Label>
                <ContentLayoutSelector dashboardPrefix={dashboardPrefix} />
                <SidebarModeSelector dashboardPrefix={dashboardPrefix} />
              </div>
            </div>
          </details>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
