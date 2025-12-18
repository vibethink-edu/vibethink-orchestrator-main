"use client";
// @ts-nocheck - TODO: Fix React types conflict in monorepo

/**
 * Theme Customizer Panel - @vibethink/ui
 * 
 * Panel híbrido que combina:
 * - Shadcn v4: Base Color, Font
 * - Bundui: Scale, Content Layout, Sidebar Mode
 * 
 * Basado en Bundui Pro con mejoras
 * 
 * @version 2.0.0
 */

import * as React from "react";
import { Settings } from "lucide-react";
import { Button } from "../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../../dropdown-menu";
import { PresetSelector } from "./preset-selector";
import { BaseColorSelector } from "./base-color-selector";
import { FontSelector } from "./font-selector";
import { RadiusSelector } from "./radius-selector";
import { ScaleSelector } from "./scale-selector";
import { ColorModeSelector } from "./color-mode-selector";
import { ContentLayoutSelector } from "./content-layout-selector";
import { SidebarModeSelector } from "./sidebar-mode-selector";
import { ResetThemeButton } from "./reset-theme";

// Hook simple para detectar mobile (similar a Bundui)
function useIsMobile() {
  if (typeof window === "undefined") return false;
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function ThemeCustomizerPanel() {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Settings className="animate-tada" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="me-4 w-72 p-4 shadow-xl lg:me-0"
        align={isMobile ? "center" : "end"}>
        <div className="grid space-y-4">
          <PresetSelector />
          <div className="grid grid-cols-2 gap-3">
            <BaseColorSelector />
            <FontSelector />
          </div>
          <ScaleSelector />
          <RadiusSelector />
          <ColorModeSelector />
          <ContentLayoutSelector />
          <SidebarModeSelector />
        </div>
        <ResetThemeButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

