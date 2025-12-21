"use client";

import * as React from "react";
import { Check, Palette } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemePreset } from "@/shared/lib/use-theme-preset";
import { THEME_PRESETS, type ThemePreset } from "../lib/themes";
import { useTranslation } from "@/lib/i18n";

interface ThemePickerProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * Si está dentro de un DropdownMenu, usar Select en lugar de Popover
   * para evitar conflictos de accesibilidad con aria-hidden
   */
  useSelect?: boolean;
}

/**
 * Componente ThemePicker - Selector visual de temas
 * 
 * Permite seleccionar entre diferentes presets de tema definidos en themes.css
 * Similar al theme picker de shadcn/ui themes (https://ui.shadcn.com/themes)
 * 
 * @example
 * ```tsx
 * <ThemePicker />
 * ```
 */
export function ThemePicker({
  className,
  variant = "outline",
  size = "default",
  useSelect = false
}: ThemePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { preset, setPreset, mounted, currentTheme } = useThemePreset();
  const { t } = useTranslation('theme');

  React.useEffect(() => {
    if (mounted) {
      console.log("[ThemePicker] THEME_PRESETS:", THEME_PRESETS);
      console.log("[ThemePicker] Current preset:", preset);
    }
  }, [mounted, preset]);

  if (!mounted) {
    return useSelect ? (
      <Select disabled>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={t('customizer.theme.label')} />
        </SelectTrigger>
      </Select>
    ) : (
      <Button
        variant={variant}
        size={size}
        className={cn("w-full justify-start", className)}
        disabled
      >
        <Palette className="mr-2 h-4 w-4" />
        <span>{t('customizer.theme.label')}</span>
      </Button>
    );
  }

  // Si useSelect es true, usar Select (para evitar conflictos dentro de DropdownMenu)
  if (useSelect) {
    // Asegurar que siempre tengamos un valor válido (evitar uncontrolled)
    const presetValue = preset || "default";

    // Obtener nombre traducido del tema
    const getThemeName = (themeValue: ThemePreset) => {
      const translated = t(`themes.${themeValue}.name`);
      // Si la traducción no existe (devuelve la key), usar el nombre por defecto
      if (translated === `themes.${themeValue}.name`) {
        return THEME_PRESETS.find(t => t.value === themeValue)?.name || themeValue;
      }
      return translated;
    };

    const currentThemeName = getThemeName(presetValue);

    return (
      <Select
        value={presetValue}
        onValueChange={(value) => {
          const themePreset = value as ThemePreset;
          console.log("[ThemePicker] Select changed to:", themePreset);
          setPreset(themePreset);
        }}
      >
        <SelectTrigger className={cn("w-full", className)}>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <SelectValue placeholder={t('customizer.theme.label')}>
              {currentThemeName}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {THEME_PRESETS?.map((theme) => {
            const themeName = getThemeName(theme.value);
            const themeDescription = t(`themes.${theme.value}.description`, {
              fallback: theme.description || ''
            });

            return (
              <SelectItem
                key={theme.value}
                value={theme.value}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className="h-4 w-4 rounded-full border border-border shrink-0"
                    style={{
                      backgroundColor: theme.colors[0] || "transparent",
                    }}
                  />
                  <span className="flex-1">{themeName}</span>
                  {preset === theme.value && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  // Versión con Popover (para uso fuera de DropdownMenu)
  const getThemeName = (themeValue: ThemePreset) => {
    const translated = t(`themes.${themeValue}.name`);
    if (translated === `themes.${themeValue}.name`) {
      return THEME_PRESETS.find(t => t.value === themeValue)?.name || themeValue;
    }
    return translated;
  };

  const getThemeDescription = (themeValue: ThemePreset) => {
    const translated = t(`themes.${themeValue}.description`);
    if (translated === `themes.${themeValue}.description`) {
      return THEME_PRESETS.find(t => t.value === themeValue)?.description || '';
    }
    return translated;
  };

  const currentThemeName = getThemeName(preset);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("w-full justify-start", className)}
          aria-label={t('customizer.theme.label')}
        >
          <Palette className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">
            {currentThemeName}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('customizer.theme.label')} />
          <CommandList>
            <CommandEmpty>{t('customizer.theme.label')}</CommandEmpty>
            <CommandGroup heading={t('customizer.theme.label')}>
              {THEME_PRESETS?.map((theme) => {
                const themeName = getThemeName(theme.value);
                const themeDescription = getThemeDescription(theme.value);

                return (
                  <CommandItem
                    key={theme.value}
                    value={`${theme.value} ${themeName}`}
                    onSelect={() => {
                      // Usar directamente el valor del theme, no el selectedValue del Command
                      setPreset(theme.value);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {/* Preview del color del tema */}
                      <div
                        className="h-5 w-5 rounded-full border border-border"
                        style={{
                          backgroundColor: theme.colors[0] || "transparent",
                        }}
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">{themeName}</span>
                        {themeDescription && (
                          <span className="text-xs text-muted-foreground">
                            {themeDescription}
                          </span>
                        )}
                      </div>
                    </div>
                    {preset === theme.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Componente ThemePickerGrid - Vista de grid con previews visuales
 * 
 * Similar al theme picker de shadcn/ui themes con previews visuales
 * 
 * @example
 * ```tsx
 * <ThemePickerGrid />
 * ```
 */
export function ThemePickerGrid({ className }: { className?: string }) {
  const { preset, setPreset, mounted } = useThemePreset();

  if (!mounted) {
    return <div className={cn("grid grid-cols-2 gap-4", className)}>Cargando...</div>;
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {THEME_PRESETS?.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setPreset(theme.value)}
          className={cn(
            "group relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
            "hover:border-primary hover:shadow-md",
            preset === theme.value
              ? "border-primary shadow-md"
              : "border-border"
          )}
          aria-label={`Seleccionar tema ${theme.name}`}
        >
          {/* Preview visual del tema */}
          <div className="relative h-16 w-full overflow-hidden rounded-md border border-border">
            <div
              className="h-full w-full"
              style={{
                backgroundColor: theme.colors[0] || "transparent",
              }}
            />
            {/* Simulación de UI elements */}
            <div className="absolute inset-0 flex flex-col gap-1 p-2">
              <div className="h-2 w-3/4 rounded bg-white/20" />
              <div className="h-2 w-1/2 rounded bg-white/20" />
              <div className="mt-auto flex gap-1">
                <div className="h-3 w-3 rounded-full bg-white/30" />
                <div className="h-3 w-8 rounded bg-white/30" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">{theme.name}</span>
            {preset === theme.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

