"use client";

/**
 * BunduiCompleteLayout - Layout completo con sidebar y header idéntico al demo
 * Replica exactamente el layout de shadcnuikit.com/default
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Search, Bell, Settings, Sun, Moon, User, ChartPie, ShoppingBag, BadgeDollarSign, ChartBarDecreasing, Gauge, FolderDot, Folder, WalletMinimal, GraduationCap, Activity, Brain, StickyNote, MessageSquare, Mail, SquareCheck, Calendar, ArchiveRestore, Key, Cookie, Users, Fingerprint, Proportions, Component, ClipboardMinus, SquareKanban, Crown, ImageIcon, ChevronDown, Plus, List, PackageOpen, UserCheck, CreditCard, Monitor, Eye, AlertTriangle, FileX, Server, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useIsTablet } from '@/shared/components/bundui-premium/hooks/use-mobile';

// Independent SidebarTrigger que maneja su propia rotación
const IndependentSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated(!isRotated);
    toggleSidebar();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="transition-all duration-300"
    >
      <PanelLeft 
        className={`h-4 w-4 transition-transform duration-300 ${
          isRotated ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </Button>
  );
};

// Enhanced SidebarInset with tight layout (no gap)
const EnhancedSidebarInset = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarInset className="sidebar-content-tight transition-all duration-200">
      {children}
    </SidebarInset>
  );
};


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
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Sidebar Modular */}
      <TooltipProvider>
        <Sidebar collapsible="icon" variant="sidebar" className="bg-muted/30 transition-all duration-200">
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
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                              tooltip="E-commerce Dashboard"
                            >
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">E-commerce</span>
                              </div>
                              <ChevronDown className={`group-data-[collapsible=icon]:ml-1 h-4 w-4 shrink-0 transition-transform duration-200 expand-icon ${ecommerceOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Enhanced Dashboard">
                                  <Link href="/ecommerce-dashboard" className="w-full flex items-center gap-2">
                                    <ChartBarDecreasing className="h-3 w-3" />
                                    <span>Enhanced Dashboard</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Product List">
                                  <List className="h-3 w-3" />
                                  <span>Product List</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Product Detail">
                                  <PackageOpen className="h-3 w-3" />
                                  <span>Product Detail</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Add Product">
                                  <Plus className="h-3 w-3" />
                                  <span>Add Product</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Order List">
                                  <List className="h-3 w-3" />
                                  <span>Order List</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton tooltip="Order Detail">
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
                          <span>Sales</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="CRM Dashboard"
                        >
                          <ChartBarDecreasing className="h-4 w-4" />
                          <span>CRM</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Website Analytics"
                        >
                          <Gauge className="h-4 w-4" />
                          <span>Website Analytics</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Project Management"
                        >
                          <FolderDot className="h-4 w-4" />
                          <span>Project Management</span>
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
                          <span>Crypto</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
                          tooltip="Academy/School"
                        >
                          <GraduationCap className="h-4 w-4" />
                          <span>Academy/School</span>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="AI Chat"
                        >
                          <Link href="/ai-chat" className="w-full flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            <span>AI Chat</span>
                          </Link>
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
                            <span className="group-data-[collapsible=icon]:hidden">Chats</span>
                          </div>
                          <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 group-data-[collapsible=icon]:hidden">4</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                          tooltip="Mail App (New)"
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Mail</span>
                          </div>
                          <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                          tooltip="Todo List App (New)"
                        >
                          <div className="flex items-center gap-3">
                            <SquareCheck className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Todo List App</span>
                          </div>
                          <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
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
                            <span className="group-data-[collapsible=icon]:hidden">POS App</span>
                          </div>
                          <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
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
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                              tooltip="Settings"
                            >
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                              </div>
                              <ChevronDown className={`group-data-[collapsible=icon]:ml-1 h-4 w-4 shrink-0 transition-transform duration-200 expand-icon ${settingsOpen ? 'rotate-180' : ''}`} />
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
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                              tooltip="Pricing"
                            >
                              <div className="flex items-center gap-2">
                                <BadgeDollarSign className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">Pricing</span>
                              </div>
                              <ChevronDown className={`group-data-[collapsible=icon]:ml-1 h-4 w-4 shrink-0 transition-transform duration-200 expand-icon ${pricingOpen ? 'rotate-180' : ''}`} />
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
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                              tooltip="Authentication"
                            >
                              <div className="flex items-center gap-2">
                                <Fingerprint className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">Authentication</span>
                              </div>
                              <ChevronDown className={`group-data-[collapsible=icon]:ml-1 h-4 w-4 shrink-0 transition-transform duration-200 expand-icon ${authOpen ? 'rotate-180' : ''}`} />
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
                              className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 justify-between"
                              tooltip="Error Pages"
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">Error Pages</span>
                              </div>
                              <ChevronDown className={`group-data-[collapsible=icon]:ml-1 h-4 w-4 shrink-0 transition-transform duration-200 expand-icon ${errorPagesOpen ? 'rotate-180' : ''}`} />
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
      </TooltipProvider>
        
      {/* Main Content Area - Using Enhanced SidebarInset */}
      <EnhancedSidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <IndependentSidebarTrigger />
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8 text-sm w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-4" align="end">
                  <div className="grid space-y-4">
                    <PresetSelector />
                    <ThemeScaleSelector />
                    <ThemeRadiusSelector />
                    <ColorModeSelector />
                    <ContentLayoutSelector />
                    <SidebarModeSelector />
                  </div>
                  <ResetThemeButton />
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
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
          
          {/* Content container siguiendo el patrón exacto del original */}
          <div className="@container/main p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto xl:group-data-[theme-content-layout=centered]/layout:mt-8">
            {children}
          </div>
        </EnhancedSidebarInset>
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