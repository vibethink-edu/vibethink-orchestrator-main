"use client";

import { Label } from "@/shared/components/bundui-premium/components/ui/label";
import { useThemeConfig } from "@/shared/components/bundui-premium/components/active-theme";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/bundui-premium/components/ui/toggle-group";

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
