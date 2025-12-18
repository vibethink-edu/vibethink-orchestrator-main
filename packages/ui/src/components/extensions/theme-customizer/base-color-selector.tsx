// @ts-nocheck
"use client";

import { Label } from "../../label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../select";
import { useThemeConfig } from "../../../providers/active-theme";
import { BASE_COLORS } from "../../../lib/themes";

export function BaseColorSelector() {
  const { theme, setTheme } = useThemeConfig();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs">Base Color</Label>
      <Select
        value={theme.baseColor}
        onValueChange={(value) =>
          setTheme({ ...theme, baseColor: value })
        }
      >
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder="Select base color" />
        </SelectTrigger>
        <SelectContent align="end">
          {BASE_COLORS.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div 
                  className="size-3 rounded-full border"
                  style={{ 
                    backgroundColor: `oklch(0.5 0.02 ${color.hue})` 
                  }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

