"use client";

/**
 * BunduiCompleteLayout - Layout completo con sidebar y header idéntico al demo
 * Replica exactamente el layout de shadcnuikit.com/default
 * Implementa el sistema modular de Sidebar de Bundui Premium con:
 * - SidebarProvider con collapsible="icon" y variant="floating"
 * - Tooltips automáticos en modo colapsado
 * - Sub-menús completos con navegación jerárquica
 * - Footer adaptativo con upgrade prompt
 */

import React from 'react';
import Link from 'next/link';
import { PanelLeft, Search, Bell, Settings, Sun, Moon, User, ChartPie, ShoppingBag, BadgeDollarSign, ChartBarDecreasing, Gauge, FolderDot, Folder, WalletMinimal, GraduationCap, Activity, Brain, StickyNote, MessageSquare, Mail, SquareCheck, Calendar, ArchiveRestore, Key, Cookie, Users, Fingerprint, Proportions, Component, ClipboardMinus, SquareKanban, Crown, ImageIcon, ChevronDown, Plus, List, PackageOpen, UserCheck, CreditCard, Monitor, Eye, AlertTriangle, FileX, Server, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/bundui-premium/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/bundui-premium/components/ui/collapsible';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/shared/components/bundui-premium/components/ui/sidebar';
import {
  PresetSelector,
  ThemeScaleSelector,
  ThemeRadiusSelector,
  ColorModeSelector,
  ContentLayoutSelector,
  SidebarModeSelector,
  ResetThemeButton,
  VThinkThemeProvider,
  useThemeConfig
} from '@/shared/components/bundui-premium/components/theme-customizer';

interface BunduiCompleteLayoutProps {
  children: React.ReactNode;
}

// Componente interno que usa useThemeConfig
const BunduiCompleteLayoutInner: React.FC<BunduiCompleteLayoutProps> = ({ children }) => {
  const [theme, setTheme] = React.useState('light');
  const [ecommerceOpen, setEcommerceOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [pricingOpen, setPricingOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [errorPagesOpen, setErrorPagesOpen] = React.useState(false);
  const { theme: themeConfig } = useThemeConfig();
  
  // Mobile view state para todo el layout
  const [isMobileView, setIsMobileView] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  // Componente Header que tiene acceso al contexto del sidebar
  const DynamicHeader = () => {
    const { state, isMobile } = useSidebar();
    const [headerLeftOffset, setHeaderLeftOffset] = React.useState('0px');
    
    React.useEffect(() => {
      // Mobile-first responsive logic
      if (isMobileView) {
        // En móvil, header siempre ocupa ancho completo
        setHeaderLeftOffset('0px');
      } else {
        // En desktop, sincronizar con sidebar state
        if (state === 'expanded') {
          setHeaderLeftOffset('256px'); // w-64 = 256px
        } else {
          setHeaderLeftOffset('80px'); // w-20 = 80px (sidebar colapsado)
        }
      }
    }, [state, isMobileView]);

    return (
      <header 
        className={`fixed top-0 z-50 flex h-14 items-center gap-2 md:gap-4 bg-background/95 px-2 md:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:h-[60px] border-b transition-all duration-200 ease-linear ${
          isMobileView ? 'left-0 right-0' : 'right-0'
        }`}
        style={{ left: isMobileView ? '0px' : headerLeftOffset }}
      >
        {/* Sidebar Trigger */}
        <SidebarTrigger />

        {/* Search - Adaptativo en móvil */}
        <div className={`flex-1 ${isMobileView ? 'max-w-[120px]' : 'max-w-md'}`}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={isMobileView ? "Search" : "Search..."} 
              className="pl-8 text-sm"
            />
          </div>
        </div>

        {/* Header Actions - Compacto en móvil */}
        <div className={`flex items-center ${isMobileView ? 'gap-1 header-mobile-compact' : 'gap-2'}`}>
          {/* Notifications - Icono más pequeño en móvil */}
          <Button variant="outline" size={isMobileView ? "sm" : "icon"} className={isMobileView ? "h-8 w-8" : ""}>
            <Bell className={isMobileView ? "h-3 w-3" : "h-4 w-4"} />
          </Button>

          {/* Theme Customizer - Adaptativo en móvil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={isMobileView ? "sm" : "icon"} className={`relative ${isMobileView ? "h-8 w-8" : ""}`}>
                <Settings className={isMobileView ? "h-3 w-3 animate-pulse" : "h-4 w-4 animate-pulse"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`shadow-xl bg-background border rounded-lg overflow-y-auto ${
                isMobileView 
                  ? 'w-[280px] p-4 max-h-[80vh] mx-2 theme-customizer-mobile' 
                  : 'me-4 w-80 p-6 max-h-[85vh] lg:me-0'
              }`}
              align="end"
              side={isMobileView ? "bottom" : "bottom"}
            >
              <div className="space-y-6">
                <div className="pb-2 border-b">
                  <h3 className="font-semibold text-base">Theme Customizer</h3>
                  <p className="text-sm text-muted-foreground">Customize your dashboard appearance</p>
                </div>
                
                <PresetSelector />
                <ThemeScaleSelector />
                <ThemeRadiusSelector />
                <ColorModeSelector />
                <ContentLayoutSelector />
                <SidebarModeSelector />
                
                <div className="pt-4 border-t">
                  <ResetThemeButton />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle - Oculto en móvil muy pequeño */}
          {!isMobileView && (
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* User Menu - Compacto en móvil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={isMobileView ? "sm" : "icon"} className={isMobileView ? "h-8 w-8" : ""}>
                <Avatar className={isMobileView ? "h-6 w-6" : "h-8 w-8"}>
                  <AvatarFallback className={isMobileView ? "text-xs" : ""}>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider>
        <div className={`min-h-screen bg-background overflow-x-hidden ${theme}`}>
          {/* Sidebar Modular */}
          <Sidebar collapsible="icon" variant="sidebar" className="bg-background">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <span className="text-sm font-bold">VT</span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold">VibeThink</span>
                      <span className="truncate text-xs">Dashboard</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="overflow-hidden">
              <ScrollArea className="h-full">
                {/* Dashboards Section */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs tracking-wider uppercase group-data-[collapsible=icon]:hidden">
                    Dashboards
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {/* Default Dashboard */}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Default Dashboard"
                        >
                          <Link href="/" className="w-full flex items-center gap-2">
                            <ChartPie className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Default</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* E-commerce with Submenu */}
                      <SidebarMenuItem>
                        <Collapsible 
                          open={ecommerceOpen} 
                          onOpenChange={setEcommerceOpen}
                          className="group/collapsible"
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                              tooltip="E-commerce Dashboard"
                            >
                              <ShoppingBag className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">E-commerce</span>
                              <ChevronDown className={`ml-8 h-4 w-4 transition-transform duration-200 expand-icon ${ecommerceOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton 
                                  onClick={() => window.open('https://shadcnuikit.com/dashboard/ecommerce', '_blank')}
                                  className="cursor-pointer"
                                >
                                  <ChartPie className="h-3 w-3" />
                                  <span>Dashboard (Original)</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer">
                                  <Link href="/ecommerce-dashboard" className="w-full flex items-center gap-2">
                                    <ChartBarDecreasing className="h-3 w-3" />
                                    <span>Enhanced Dashboard</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>
                                  <List className="h-3 w-3" />
                                  <span>Product List</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>
                                  <PackageOpen className="h-3 w-3" />
                                  <span>Product Detail</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>
                                  <Plus className="h-3 w-3" />
                                  <span>Add Product</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>
                                  <List className="h-3 w-3" />
                                  <span>Order List</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>
                                  <PackageOpen className="h-3 w-3" />
                                  <span>Order Detail</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Other Dashboard Items */}
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Sales Dashboard"
                        >
                          <BadgeDollarSign className="h-4 w-4" />
                          <span className="">Sales</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="CRM Dashboard"
                        >
                          <ChartBarDecreasing className="h-4 w-4" />
                          <span className="">CRM</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Website Analytics"
                        >
                          <Gauge className="h-4 w-4" />
                          <span className="">Website Analytics</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Project Management"
                        >
                          <FolderDot className="h-4 w-4" />
                          <span className="">Project Management</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="File Manager"
                        >
                          <Folder className="h-4 w-4" />
                          <span>File Manager</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Crypto Dashboard"
                        >
                          <WalletMinimal className="h-4 w-4" />
                          <span className="">Crypto</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Academy/School"
                        >
                          <GraduationCap className="h-4 w-4" />
                          <span className="">Academy/School</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Hospital Management"
                        >
                          <Activity className="h-4 w-4" />
                          <span>Hospital Management</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* AI Section */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs tracking-wider uppercase group-data-[collapsible=icon]:hidden">
                    AI
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="AI Chat"
                        >
                          <Brain className="h-4 w-4" />
                          <span>AI Chat</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Image Generator"
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Image Generator</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Apps Section */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs tracking-wider uppercase group-data-[collapsible=icon]:hidden">
                    Apps
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Kanban Board"
                        >
                          <SquareKanban className="h-4 w-4" />
                          <span>Kanban</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Notes App"
                        >
                          <StickyNote className="h-4 w-4" />
                          <span>Notes</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                          tooltip="Chat Messages (4)"
                        >
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-4 w-4" />
                            <span>Chats</span>
                          </div>
                          <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">4</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                          tooltip="Mail App (New)"
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4" />
                            <span>Mail</span>
                          </div>
                          <span className="text-xs bg-blue-500 text-white rounded-sm px-1">New</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                          tooltip="Todo List App (New)"
                        >
                          <div className="flex items-center gap-3">
                            <SquareCheck className="h-4 w-4" />
                            <span>Todo List App</span>
                          </div>
                          <span className="text-xs bg-blue-500 text-white rounded-sm px-1">New</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Tasks"
                        >
                          <SquareCheck className="h-4 w-4" />
                          <span>Tasks</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Calendar Application"
                        >
                          <Link href="/calendar" className="w-full flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Calendar</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="File Manager"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                          <span>File Manager</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="API Keys"
                        >
                          <Key className="h-4 w-4" />
                          <span>Api Keys</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                          tooltip="POS App (New)"
                        >
                          <div className="flex items-center gap-3">
                            <Cookie className="h-4 w-4" />
                            <span>POS App</span>
                          </div>
                          <span className="text-xs bg-blue-500 text-white rounded-sm px-1">New</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Pages Section */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs tracking-wider uppercase group-data-[collapsible=icon]:hidden">
                    Pages
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Users List"
                        >
                          <Users className="h-4 w-4" />
                          <span>Users List</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Profile"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Settings with Submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                              tooltip="Settings"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Settings</span>
                              <ChevronDown className={`ml-8 h-4 w-4 transition-transform duration-200 expand-icon ${settingsOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Profile">
                                  <User className="h-3 w-3" />
                                  <span>Profile</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Account">
                                  <UserCheck className="h-3 w-3" />
                                  <span>Account</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Appearance">
                                  <Monitor className="h-3 w-3" />
                                  <span>Appearance</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Notifications">
                                  <Bell className="h-3 w-3" />
                                  <span>Notifications</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Display">
                                  <Eye className="h-3 w-3" />
                                  <span>Display</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Pricing with Submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={pricingOpen} onOpenChange={setPricingOpen} className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                              tooltip="Pricing"
                            >
                              <BadgeDollarSign className="h-4 w-4" />
                              <span>Pricing</span>
                              <ChevronDown className={`ml-8 h-4 w-4 transition-transform duration-200 expand-icon ${pricingOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Column Pricing">
                                  <List className="h-3 w-3" />
                                  <span>Column Pricing</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Table Pricing">
                                  <Proportions className="h-3 w-3" />
                                  <span>Table Pricing</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Single Pricing">
                                  <CreditCard className="h-3 w-3" />
                                  <span>Single Pricing</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Authentication with Submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={authOpen} onOpenChange={setAuthOpen} className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                              tooltip="Authentication"
                            >
                              <Fingerprint className="h-4 w-4" />
                              <span>Authentication</span>
                              <ChevronDown className={`ml-8 h-4 w-4 transition-transform duration-200 expand-icon ${authOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Login v1">
                                  <User className="h-3 w-3" />
                                  <span>Login v1</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Login v2">
                                  <User className="h-3 w-3" />
                                  <span>Login v2</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Register v1">
                                  <UserCheck className="h-3 w-3" />
                                  <span>Register v1</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Register v2">
                                  <UserCheck className="h-3 w-3" />
                                  <span>Register v2</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Forgot Password">
                                  <Shield className="h-3 w-3" />
                                  <span>Forgot Password</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Error Pages with Submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={errorPagesOpen} onOpenChange={setErrorPagesOpen} className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                              tooltip="Error Pages"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              <span>Error Pages</span>
                              <ChevronDown className={`ml-8 h-4 w-4 transition-transform duration-200 expand-icon ${errorPagesOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="404">
                                  <FileX className="h-3 w-3" />
                                  <span>404</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="500">
                                  <Server className="h-3 w-3" />
                                  <span>500</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="403">
                                  <Shield className="h-3 w-3" />
                                  <span>403</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Others Section */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs tracking-wider uppercase group-data-[collapsible=icon]:hidden">
                    Others
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Components"
                        >
                          <Component className="h-4 w-4" />
                          <span>Components</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Blocks"
                        >
                          <Component className="h-4 w-4" />
                          <span>Blocks</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Templates"
                        >
                          <Proportions className="h-4 w-4" />
                          <span>Templates</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Landing Page"
                        >
                          <Proportions className="h-4 w-4" />
                          <span>Landing Page</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Shadcn UI Kit Download"
                        >
                          <ClipboardMinus className="h-4 w-4" />
                          <span>Shadcn UI Kit Download</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </ScrollArea>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    <Crown className="h-4 w-4" />
                    <span className="">Get VibeThink Pro</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          {/* Header dinámico que respeta el sidebar */}
          <DynamicHeader />

          {/* Main Content Area */}
          <SidebarInset>

            {/* Content con padding-top para el header fijo - Adaptativo móvil */}
            <div className={`${isMobileView ? 'pt-14' : 'pt-14 lg:pt-[60px]'}`}>
              {/* Page Content */}
              <main className={`flex-1 space-y-4 p-4 md:p-8 ${
                themeConfig.contentLayout === 'full' ? 'max-w-none' : 'max-w-7xl mx-auto'
              }`}>
                {children}
              </main>
            </div>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

// Componente wrapper con provider
const BunduiCompleteLayout: React.FC<BunduiCompleteLayoutProps> = ({ children }) => {
  return (
    <VThinkThemeProvider>
      <BunduiCompleteLayoutInner>{children}</BunduiCompleteLayoutInner>
    </VThinkThemeProvider>
  );
};

export default BunduiCompleteLayout;