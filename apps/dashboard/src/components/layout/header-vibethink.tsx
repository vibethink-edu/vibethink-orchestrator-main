"use client";

import { PanelLeftIcon } from "lucide-react";

import { Separator } from '@vibethink/ui';
import Notifications from "@/shared/components/bundui-premium/components/layout/header-bundui/notifications";
import Search from "@/shared/components/bundui-premium/components/layout/header-bundui/search";
import ThemeSwitch from "@/shared/components/bundui-premium/components/layout/header-bundui/theme-switch";
import UserMenu from "@/shared/components/bundui-premium/components/layout/header-bundui/user-menu";
import { ThemeCustomizerPanel } from "@/shared/components/bundui-premium/components/panel";
import { Button } from '@vibethink/ui';
import { useSidebar } from '@vibethink/ui';
import { LocaleSelector } from '@/components/i18n/LocaleSelector';

/**
 * Header específico para dashboard-vibethink
 * Incluye selector de idioma (i18n) ya que VibeThink es multidioma
 */
export function VibeThinkHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background/40 sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-tl-xl md:rounded-tr-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <Button onClick={toggleSidebar} size="icon" variant="ghost">
          <PanelLeftIcon />
        </Button>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Search />

        <div className="ml-auto flex items-center gap-2">
          <LocaleSelector />
          <Notifications />
          <ThemeSwitch />
          <ThemeCustomizerPanel />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}


