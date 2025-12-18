"use client";
// @ts-nocheck - TODO: Fix React types conflict in monorepo

/**
 * Preset Selector - @vibethink/ui
 * 
 * Selector de presets de tema con preview de colores
 */

import { DEFAULT_THEME, THEMES, getVThinkThemes, getBunduiThemes, getShadcnThemes } from "../../../lib/themes";
import { useThemeConfig } from "../../../providers/active-theme";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../../select";
import { Label } from "../../label";

export function PresetSelector() {
  const { theme, setTheme } = useThemeConfig();

  const handlePreset = (value: string) => {
    setTheme({ ...theme, ...DEFAULT_THEME, preset: value as any });
  };

  const vthinkThemes = getVThinkThemes();
  const bunduiThemes = getBunduiThemes();
  const shadcnThemes = getShadcnThemes();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">Theme Preset</Label>
      <Select value={theme.preset} onValueChange={handlePreset}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          {/* VThink Themes */}
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground">VThink</SelectLabel>
            {vthinkThemes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <div className="flex items-center gap-2">
                  <div className="flex shrink-0 gap-1">
                    {t.colors.map((color, key) => (
                      <span
                        key={key}
                        className="size-3 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span>{t.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>

          {/* Bundui Themes */}
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground">Bundui</SelectLabel>
            {bunduiThemes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <div className="flex items-center gap-2">
                  <div className="flex shrink-0 gap-1">
                    {t.colors.map((color, key) => (
                      <span
                        key={key}
                        className="size-3 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span>{t.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>

          {/* Shadcn Themes */}
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground">Shadcn</SelectLabel>
            {shadcnThemes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <div className="flex items-center gap-2">
                  <div className="flex shrink-0 gap-1">
                    {t.colors.map((color, key) => (
                      <span
                        key={key}
                        className="size-3 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span>{t.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

