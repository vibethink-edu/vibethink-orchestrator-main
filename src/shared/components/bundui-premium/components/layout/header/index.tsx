"use client";

import * as React from "react";
import { PanelLeftIcon } from "lucide-react";

import { useSidebar } from "@/shared/components/bundui-premium/components/ui/sidebar";
// Simplified imports for performance
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { ThemeCustomizerPanel } from "@/shared/components/bundui-premium/components/theme-customizer";

export default function Header() {
  const { toggleSidebar, open, state } = useSidebar();

  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <header className="bg-background/50 flex h-14 items-center gap-3 px-4 backdrop-blur-xl lg:h-[60px]">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggle}
            size="icon"
            variant="outline"
            className="flex">
            <PanelLeftIcon />
          </Button>
          <div className="text-sm font-semibold">VibeThink Dashboard</div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <ThemeCustomizerPanel />
          <div className="text-xs text-muted-foreground">v1.0</div>
        </div>
      </header>
    </div>
  );
}
