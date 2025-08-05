"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { PanelLeftIcon, SearchIcon, BellIcon, Settings, Sun, Moon, CommandIcon, BadgeCheck, CreditCard, Sparkles, LogOut } from "lucide-react";
import { useSidebar, SidebarTrigger } from "@/shared/components/bundui-premium/components/ui/sidebar";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { Input } from "@/shared/components/bundui-premium/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/bundui-premium/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/shared/components/bundui-premium/components/ui/dropdown-menu";
import {
  PresetSelector,
  ThemeScaleSelector,
  ThemeRadiusSelector,
  ColorModeSelector,
  ContentLayoutSelector,
  SidebarModeSelector,
  ResetThemeButton,
  useThemeConfig
} from "@/shared/components/bundui-premium/components/theme-customizer";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  
  // Theme handling seguro para evitar problemas de hidratación
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    setMounted(true);
    // Detectar el theme actual del DOM de manera segura
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');
  }, []);
  
  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    
    // Aplicar el theme directamente al DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <header className="bg-background/50 flex h-14 items-center gap-3 px-4 backdrop-blur-xl lg:h-[60px]">
        {/* Sidebar Toggle - Using SidebarTrigger */}
        <SidebarTrigger className="flex md:hidden lg:flex" />
        
        {/* Search - Bundui Premium Style */}
        <div className="ms-auto lg:me-auto lg:flex-1">
          <div className="relative hidden max-w-sm flex-1 lg:block">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="h-9 w-full cursor-pointer rounded-md border pr-4 pl-10 text-sm shadow-xs"
              placeholder="Search..."
              type="search"
            />
            <div className="absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono text-xs font-medium sm:flex dark:bg-neutral-700">
              <CommandIcon className="size-3" />
              <span>k</span>
            </div>
          </div>
          <div className="block lg:hidden">
            <Button size="icon" variant="outline">
              <SearchIcon />
            </Button>
          </div>
        </div>
        
        {/* Notifications - Bundui Premium Style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="relative">
              <BellIcon className="animate-tada" />
              <span className="bg-destructive absolute -end-0.5 -top-0.5 block size-2 shrink-0 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex justify-between border-b px-6 py-4">
              <div className="font-medium">Notifications</div>
              <Button variant="link" className="h-auto p-0 text-xs" size="sm">
                View all
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Theme Customizer Panel - Bundui Premium Style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <Settings className="animate-tada" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="pb-2 border-b">
                <h3 className="font-semibold text-base">Theme Customizer</h3>
                <p className="text-sm text-muted-foreground">Customize your dashboard appearance</p>
              </div>
              
              {/* Theme Customizer Components - Solo renderizar cuando esté montado */}
              {mounted && (
                <>
                  <PresetSelector />
                  <ThemeScaleSelector />
                  <ThemeRadiusSelector />
                  <ColorModeSelector />
                  <ContentLayoutSelector />
                  <SidebarModeSelector />
                  
                  <div className="pt-4 border-t">
                    <ResetThemeButton />
                  </div>
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Theme Switch - Bundui Premium Style */}
        <Button
          size="icon"
          variant="outline"
          className="relative"
          onClick={handleThemeToggle}>
          {mounted && (currentTheme === "light" ? <Sun /> : <Moon />)}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        {/* User Menu - Bundui Premium Style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                src={`https://bundui-images.netlify.app/avatars/01.png`}
                alt="User Avatar"
              />
              <AvatarFallback className="rounded-lg">VT</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-60" align="end">
            <DropdownMenuLabel className="p-0">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar>
                  <AvatarImage
                    src={`https://bundui-images.netlify.app/avatars/01.png`}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="rounded-lg">VT</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VibeThink User</span>
                  <span className="text-muted-foreground truncate text-xs">user@vibethink.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
}