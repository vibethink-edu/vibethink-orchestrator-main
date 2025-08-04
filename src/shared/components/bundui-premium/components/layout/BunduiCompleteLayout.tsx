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
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Enhanced Dashboard (New)">
                                  <Link href="/ecommerce-dashboard" className="w-full flex items-center gap-2">
                                    <ChartBarDecreasing className="h-3 w-3" />
                                    <span>Enhanced Dashboard</span>
                                    <span className="text-[10px] bg-blue-500 text-white rounded px-1 py-0 leading-none ml-auto">New</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Product List">
                                  <Link href="/ecommerce-dashboard/products" className="w-full flex items-center gap-2">
                                    <List className="h-3 w-3" />
                                    <span>Product List</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Product Detail">
                                  <Link href="/ecommerce-dashboard/product-detail" className="w-full flex items-center gap-2">
                                    <PackageOpen className="h-3 w-3" />
                                    <span>Product Detail</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Add Product">
                                  <Link href="/ecommerce-dashboard/add-product" className="w-full flex items-center gap-2">
                                    <Plus className="h-3 w-3" />
                                    <span>Add Product</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Order List">
                                  <Link href="/ecommerce-dashboard/orders" className="w-full flex items-center gap-2">
                                    <List className="h-3 w-3" />
                                    <span>Order List</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Order Detail">
                                  <Link href="/ecommerce-dashboard/order-detail" className="w-full flex items-center gap-2">
                                    <PackageOpen className="h-3 w-3" />
                                    <span>Order Detail</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Other Dashboard Items */}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Sales Dashboard (New)"
                        >
                          <Link href="/sales-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BadgeDollarSign className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Sales</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="CRM Dashboard (New)"
                        >
                          <Link href="/crm-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ChartBarDecreasing className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">CRM</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Website Analytics (New)"
                        >
                          <Link href="/website-analytics-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gauge className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Website Analytics</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Project Management (New)"
                        >
                          <Link href="/project-management-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FolderDot className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Project Management</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="File Manager Dashboard (New)"
                        >
                          <Link href="/file-manager-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Folder className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">File Manager</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Crypto Dashboard (New)"
                        >
                          <Link href="/crypto-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <WalletMinimal className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Crypto</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Finance Dashboard (New)"
                        >
                          <Link href="/finance-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Finance</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
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
                          tooltip="AI Chat (New)"
                        >
                          <Link href="/ai-chat-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">AI Chat</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Kanban Board (New)"
                        >
                          <Link href="/kanban-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SquareKanban className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Kanban</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Notes App (New)"
                        >
                          <Link href="/notes-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StickyNote className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Notes</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Mail App (New)"
                        >
                          <Link href="/mail-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Mail</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="Tasks (New)"
                        >
                          <Link href="/tasks-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SquareCheck className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Tasks</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Calendar Application (New)"
                        >
                          <Link href="/calendar-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">Calendar</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer justify-between"
                          tooltip="POS System (New)"
                        >
                          <Link href="/pos-system-dashboard" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Cookie className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">POS System</span>
                            </div>
                            <span className="text-xs bg-blue-500 text-white rounded-sm px-1 group-data-[collapsible=icon]:hidden">New</span>
                          </Link>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Users List"
                        >
                          <Link href="/users" className="w-full flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Users List</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Profile"
                        >
                          <Link href="/profile" className="w-full flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                          </Link>
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
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Profile">
                                  <Link href="/settings/profile" className="w-full flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span>Profile</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Account">
                                  <Link href="/settings/account" className="w-full flex items-center gap-2">
                                    <UserCheck className="h-3 w-3" />
                                    <span>Account</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Appearance">
                                  <Link href="/settings/appearance" className="w-full flex items-center gap-2">
                                    <Monitor className="h-3 w-3" />
                                    <span>Appearance</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Notifications">
                                  <Link href="/settings/notifications" className="w-full flex items-center gap-2">
                                    <Bell className="h-3 w-3" />
                                    <span>Notifications</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Display">
                                  <Link href="/settings/display" className="w-full flex items-center gap-2">
                                    <Eye className="h-3 w-3" />
                                    <span>Display</span>
                                  </Link>
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
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Column Pricing">
                                  <Link href="/pricing/table" className="w-full flex items-center gap-2">
                                    <List className="h-3 w-3" />
                                    <span>Column Pricing</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Table Pricing">
                                  <Link href="/pricing/cards" className="w-full flex items-center gap-2">
                                    <Proportions className="h-3 w-3" />
                                    <span>Table Pricing</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Single Pricing">
                                  <Link href="/pricing" className="w-full flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    <span>Single Pricing</span>
                                  </Link>
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
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Login v1">
                                  <Link href="/auth/signin" className="w-full flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span>Login v1</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Login v2">
                                  <Link href="/auth/signin" className="w-full flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span>Login v2</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Register v1">
                                  <Link href="/auth/signup" className="w-full flex items-center gap-2">
                                    <UserCheck className="h-3 w-3" />
                                    <span>Register v1</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Register v2">
                                  <Link href="/auth/signup" className="w-full flex items-center gap-2">
                                    <UserCheck className="h-3 w-3" />
                                    <span>Register v2</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="Forgot Password">
                                  <Link href="/auth/forgot-password" className="w-full flex items-center gap-2">
                                    <Shield className="h-3 w-3" />
                                    <span>Forgot Password</span>
                                  </Link>
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
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="404 Not Found">
                                  <Link href="/error/404" className="w-full flex items-center gap-2">
                                    <FileX className="h-3 w-3" />
                                    <span>404</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="500 Server Error">
                                  <Link href="/error/500" className="w-full flex items-center gap-2">
                                    <Server className="h-3 w-3" />
                                    <span>500</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild className="w-full cursor-pointer" tooltip="503 Maintenance">
                                  <Link href="/error/503" className="w-full flex items-center gap-2">
                                    <Shield className="h-3 w-3" />
                                    <span>503</span>
                                  </Link>
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
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Components"
                        >
                          <Link href="/components" className="w-full flex items-center gap-2">
                            <Component className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Components</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Blocks"
                        >
                          <Link href="/blocks" className="w-full flex items-center gap-2">
                            <Component className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Blocks</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Templates"
                        >
                          <Link href="/templates" className="w-full flex items-center gap-2">
                            <Proportions className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Templates</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Landing Page"
                        >
                          <Link href="/landing" className="w-full flex items-center gap-2">
                            <Proportions className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Landing Page</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild
                          className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10 w-full cursor-pointer"
                          tooltip="Shadcn UI Kit Download"
                        >
                          <Link href="https://shadcnuikit.com" target="_blank" className="w-full flex items-center gap-2">
                            <ClipboardMinus className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Shadcn UI Kit Download</span>
                          </Link>
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