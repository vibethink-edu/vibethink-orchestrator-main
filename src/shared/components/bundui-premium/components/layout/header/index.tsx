"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/bundui-premium/components/ui/button"
import { Input } from "@/shared/components/bundui-premium/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/bundui-premium/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/bundui-premium/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/shared/components/bundui-premium/components/ui/sidebar"
import { useTheme } from "next-themes"
import { Search as SearchIcon, Bell as BellIcon, Command as CommandIcon, Settings, Sun, Moon, User, CreditCard, Settings as SettingsIcon, LogOut } from "lucide-react"

// Theme Customizer Components - Using named imports
import { PresetSelector, ThemeScaleSelector, ThemeRadiusSelector, ColorModeSelector, ContentLayoutSelector, SidebarModeSelector, ResetThemeButton } from "@/shared/components/bundui-premium/components/theme-customizer"

// Icon wrapper to prevent hydration mismatches
const SafeIcon = ({ icon: IconComponent, className, ...props }: { icon: any; className?: string; [key: string]: any }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={{ width: '1rem', height: '1rem' }} />;
  }

  return <IconComponent className={className} {...props} />;
};

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>("light")

  useEffect(() => {
    setMounted(true)
    setCurrentTheme(theme || "light")
  }, [theme])

  const handleThemeToggle = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
    setCurrentTheme(newTheme)
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4 sm:px-6">
          {/* Sidebar Toggle - Using SidebarTrigger */}
          <SidebarTrigger className="flex md:hidden lg:flex" />
          
          {/* Search - Bundui Premium Style */}
          <div className="ms-auto lg:me-auto lg:flex-1">
            <div className="relative hidden max-w-sm flex-1 lg:block">
              <SafeIcon icon={SearchIcon} className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                className="h-9 w-full cursor-pointer rounded-md border pr-4 pl-10 text-sm shadow-xs"
                placeholder="Search..."
                type="search"
              />
              <div className="absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono text-xs font-medium sm:flex dark:bg-neutral-700">
                <SafeIcon icon={CommandIcon} className="size-3" />
                <span>k</span>
              </div>
            </div>
            <div className="block lg:hidden">
              <Button size="icon" variant="outline">
                <SafeIcon icon={SearchIcon} />
              </Button>
            </div>
          </div>
          
          {/* Notifications - Bundui Premium Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="relative">
                <SafeIcon icon={BellIcon} className="animate-tada" />
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
                <SafeIcon icon={Settings} className="animate-tada" />
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
                  <div className="grid flex-1 text-sm leading-tight">
                    <span className="truncate font-semibold">VibeThink User</span>
                    <span className="truncate text-xs text-muted-foreground">user@vibethink.com</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SafeIcon icon={User} className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SafeIcon icon={CreditCard} className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SafeIcon icon={SettingsIcon} className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SafeIcon icon={LogOut} className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}