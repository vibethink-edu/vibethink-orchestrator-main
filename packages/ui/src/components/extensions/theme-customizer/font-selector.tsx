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
import { FONTS } from "../../../lib/themes";
import { Type } from "lucide-react";

export function FontSelector() {
  const { theme, setTheme } = useThemeConfig();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs">Font</Label>
      <Select
        value={theme.font}
        onValueChange={(value) =>
          setTheme({ ...theme, font: value })
        }
      >
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent align="end">
          {FONTS.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <div className="flex items-center gap-2">
                <Type className="size-3 text-muted-foreground" />
                <span className={font.className}>{font.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

