"use client";

import * as React from "react";
import { PanelLeftIcon } from "lucide-react";

import { useSidebar } from "@/shared/components/bundui-premium/components/ui/sidebar";
import Search from "@/shared/components/bundui-premium/components/layout/header/search";
import UserMenu from "@/shared/components/bundui-premium/components/layout/header/user-menu";
import ThemeSwitch from "@/shared/components/bundui-premium/components/layout/header/theme-switch";
import Notifications from "@/shared/components/bundui-premium/components/layout/header/notifications";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { ThemeCustomizerPanel } from "@/components/theme-customizer";

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <header className="bg-background/50 flex h-14 items-center gap-3 px-4 backdrop-blur-xl lg:h-[60px]">
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="outline"
            className="flex md:hidden lg:flex">
            <PanelLeftIcon />
          </Button>
          <Search />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Notifications />
          <ThemeCustomizerPanel />
          <ThemeSwitch />
          <UserMenu />
        </div>
      </header>
    </div>
  );
}
