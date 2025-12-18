"use client";

import { Settings } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Label, ToggleGroup, ToggleGroupItem } from "@vibethink/ui";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

// ColorModeSelector - Funcional con next-themes
function ColorModeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="colorMode">Color mode:</Label>
      <ToggleGroup
        value={theme || "light"}
        type="single"
        onValueChange={(value) => value && setTheme(value)}
        className="w-full gap-2">
        <ToggleGroupItem variant="outline" value="light" className="flex-1">
          Light
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="dark" className="flex-1">
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem variant="outline" value="system" className="flex-1">
          System
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function ThemeCustomizerPanel() {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="me-4 w-72 p-4 shadow-xl lg:me-0"
        align={isMobile ? "center" : "end"}>
        <div className="grid space-y-4">
          <ColorModeSelector />
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs text-muted-foreground">Próximamente:</Label>
            <p className="text-xs text-muted-foreground">
              • Theme Presets<br/>
              • Scale Selector<br/>
              • Radius Selector<br/>
              • Content Layout<br/>
              • Sidebar Mode
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
