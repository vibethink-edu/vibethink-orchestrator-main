"use client";
// @ts-nocheck - TODO: Fix React types conflict in monorepo

/**
 * Color Mode Selector - @vibethink/ui
 * 
 * Selector de modo de color (Light/Dark/System)
 * Usa next-themes para gestión de modo oscuro
 */

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Label } from "../../label";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group";

export function ColorModeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">Color Mode</Label>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(value) => value && setTheme(value)}
        className="justify-start"
      >
        <ToggleGroupItem value="light" aria-label="Light mode" title="Light">
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark mode" title="Dark">
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System mode" title="System">
          <Monitor className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

