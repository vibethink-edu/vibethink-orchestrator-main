"use client";
// @ts-nocheck - TODO: Fix React types conflict in monorepo

/**
 * Content Layout Selector - @vibethink/ui
 * 
 * Basado en Bundui Pro - Usa ToggleGroup (Shadcn)
 */

import { Label } from "../../label";
import { useThemeConfig } from "../../../providers/active-theme";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group";

export function ContentLayoutSelector() {
  const { theme, setTheme } = useThemeConfig();

  return (
    <div className="hidden flex-col gap-4 lg:flex">
      <Label>Content layout</Label>
      <ToggleGroup
        value={theme.contentLayout}
        type="single"
        onValueChange={(value) => setTheme({ ...theme, contentLayout: value as any })}
        className="*:border-input w-full gap-4 *:rounded-md *:border">
        <ToggleGroupItem variant="outline" value="full">
          Full
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="centered"
          className="data-[variant=outline]:border-l-1">
          Centered
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
