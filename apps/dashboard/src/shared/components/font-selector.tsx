"use client";

import * as React from "react";
import { Check, Type } from "@vibethink/ui/icons";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeSettings, type ThemeFont } from "@/shared/lib/use-theme-settings";
import { useTranslation } from "@/lib/i18n";

export const FONT_OPTIONS: Array<{
  name: string;
  value: ThemeFont;
  preview: string;
  description?: string;
}> = [
    {
      name: "Inter",
      value: "inter",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Modern sans-serif"
    },
    {
      name: "Noto Sans",
      value: "noto-sans",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Clean and readable"
    },
    {
      name: "Nunito Sans",
      value: "nunito-sans",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Rounded and friendly"
    },
    {
      name: "Figtree",
      value: "figtree",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Geometric sans-serif"
    },
    {
      name: "Geist",
      value: "geist",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Default font"
    },
    {
      name: "Roboto",
      value: "roboto",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Google's signature font"
    },
    {
      name: "Poppins",
      value: "poppins",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Geometric and modern"
    },
    {
      name: "Montserrat",
      value: "montserrat",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Elegant and versatile"
    },
    {
      name: "PT Sans",
      value: "pt-sans",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "Humanist sans-serif"
    },
    {
      name: "System",
      value: "system",
      preview: "Designers love packing quirky glyphs into test phrases.",
      description: "System default font"
    }
  ];

interface FontSelectorProps {
  className?: string;
  useSelect?: boolean;
  /**
   * Prefijo para aislar cookies por dashboard (ej: "bundui", "vibethink")
   */
  dashboardPrefix?: string;
}

/**
 * Componente FontSelector - Selector de fuentes
 * 
 * Permite seleccionar entre diferentes fuentes disponibles
 * Similar al font picker de shadcn/ui themes
 */
export function FontSelector({
  className,
  useSelect = true,
  dashboardPrefix
}: FontSelectorProps) {
  const { settings, setFont, mounted } = useThemeSettings(dashboardPrefix);
  const { t } = useTranslation('theme');

  if (!mounted) {
    return useSelect ? (
      <Select disabled>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={t('customizer.font.label')} />
        </SelectTrigger>
      </Select>
    ) : null;
  }

  const currentFont = FONT_OPTIONS.find(f => f.value === settings.font) || FONT_OPTIONS[4]; // Geist por defecto

  // Asegurar que siempre tengamos un valor válido (evitar uncontrolled)
  const fontValue = settings.font || "geist";

  // Función para obtener nombre y descripción traducidos
  const getFontName = (fontValue: ThemeFont) => {
    const translated = t(`fonts.${fontValue}.name`);
    if (translated === `fonts.${fontValue}.name`) {
      return FONT_OPTIONS.find(f => f.value === fontValue)?.name || fontValue;
    }
    return translated;
  };

  const getFontDescription = (fontValue: ThemeFont) => {
    const translated = t(`fonts.${fontValue}.description`);
    if (translated === `fonts.${fontValue}.description`) {
      return FONT_OPTIONS.find(f => f.value === fontValue)?.description || '';
    }
    return translated;
  };

  const currentFontName = getFontName(fontValue);

  return (
    <Select
      value={fontValue}
      onValueChange={(value) => {
        const fontValue = value as ThemeFont;
        console.log("[FontSelector] Font changed to:", fontValue);
        setFont(fontValue);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <SelectValue placeholder={t('customizer.font.label')}>
            {currentFontName}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {FONT_OPTIONS.map((font) => {
          const fontName = getFontName(font.value);
          const fontDescription = getFontDescription(font.value);

          return (
            <SelectItem
              key={font.value}
              value={font.value}
              className="cursor-pointer"
            >
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{fontName}</span>
                  {settings.font === font.value && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <span
                  className="text-xs text-muted-foreground"
                  style={{
                    fontFamily: font.value === "system"
                      ? "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                      : font.value === "geist"
                        ? "var(--font-geist), 'Geist', sans-serif"
                        : font.value === "inter"
                          ? "var(--font-inter), 'Inter', sans-serif"
                          : font.value === "noto-sans"
                            ? "'Noto Sans', sans-serif"
                            : font.value === "nunito-sans"
                              ? "'Nunito Sans', sans-serif"
                              : font.value === "figtree"
                                ? "'Figtree', sans-serif"
                                : font.value === "roboto"
                                  ? "var(--font-roboto), 'Roboto', sans-serif"
                                  : font.value === "poppins"
                                    ? "var(--font-poppins), 'Poppins', sans-serif"
                                    : font.value === "montserrat"
                                      ? "var(--font-montserrat), 'Montserrat', sans-serif"
                                      : font.value === "pt-sans"
                                        ? "var(--font-pt-sans), 'PT Sans', sans-serif"
                                        : "sans-serif"
                  }}
                >
                  {font.preview}
                </span>
                {fontDescription && (
                  <span className="text-xs text-muted-foreground/70">
                    {fontDescription}
                  </span>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

