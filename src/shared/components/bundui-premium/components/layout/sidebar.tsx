import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { page_routes } from "@/lib/routes-config";
import { ChevronRight, ChevronsUpDown, Plus, Settings, Building2, Check, LogOut, BadgeCheck, CreditCard, Bell, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/bundui-premium/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/shared/components/bundui-premium/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/bundui-premium/components/ui/badge";
import { ScrollArea } from "@/shared/components/bundui-premium/components/ui/scroll-area";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/shared/components/bundui-premium/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";
import Icon from "@/shared/components/bundui-premium/components/icon";
import Logo from "@/shared/components/bundui-premium/components/layout/logo";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/bundui-premium/components/ui/avatar";
export default function Sidebar() {
  // Estados para controlar dropdowns
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  
  const toggleDropdown = (itemTitle: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile, state } = useSidebar();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Safe tablet detection with mounted state
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    if (mounted) {
      const checkTablet = () => {
        const width = window.innerWidth;
        setIsTablet(width >= 768 && width < 1024);
      };
      
      checkTablet();
      window.addEventListener('resize', checkTablet);
      
      return () => window.removeEventListener('resize', checkTablet);
    }
  }, [mounted]);

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname]);

  useEffect(() => {
    setOpen(!isTablet);
  }, [isTablet]);

  return (
    <SidebarContainer collapsible="icon" variant="sidebar" className="bg-background">
      <SidebarHeader className="items-center justify-center pt-3 transition-all group-data-[collapsible=icon]:pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Evitar button dentro de button: el trigger asChild envuelve un div clickable */}
                <div className="hover:text-foreground rounded-none hover:bg-[var(--primary)]/10 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Logo />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">VibeThink</span>
                    <span className="truncate text-xs text-muted-foreground">Enterprise</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Switch Project
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 p-2 opacity-60" disabled>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  <div className="line-clamp-1 flex-1 pr-2 font-medium text-muted-foreground">VibeThink Orchestrator</div>
                  <Check className="ml-auto size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  <div className="line-clamp-1 flex-1 pr-2 font-medium">Ecommerce Dashboard</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  <div className="line-clamp-1 flex-1 pr-2 font-medium">Analytics Hub</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
                  <Plus className="h-4 w-4" />
                  <span>Create New Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Project Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          {page_routes.map((route, key) => (
            <SidebarGroup key={key}>
              <SidebarGroupLabel className="text-xs tracking-wider uppercase">
                {route.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {route.items.map((item, key) => (
                    <SidebarMenuItem key={key}>
                      {item.items?.length ? (
                        <Fragment>
                          {/* Collapsed Mode: DropdownMenu lateral */}
                          <div className="hidden group-data-[collapsible=icon]:block">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {/* Evitar button dentro de button en collapsed mode */}
                                <div
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10 relative flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md"
                                  title={item.title}
                                >
                                  {item.icon && (
                                    <div className="relative">
                                      <Icon
                                        name={item.icon}
                                        className="accent-sidebar-foreground size-4"
                                      />
                                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                        &gt;
                                      </div>
                                    </div>
                                  )}
                                  <span>{item.title}</span>
                                </div>
                              </DropdownMenuTrigger>
                              {item.items?.length ? (
                                                                 <DropdownMenuContent
                                   side={isMobile ? "bottom" : "right"}
                                   align={isMobile ? "end" : "start"}
                                   sideOffset={isMobile ? 4 : -80} // Negative offset to compensate for sidebar container padding
                                   className="min-w-48 rounded-lg">
                                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                                  {item.items.map((subItem) => (
                                    <DropdownMenuItem
                                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10! min-h-[2.5rem] py-2"
                                      asChild
                                      key={subItem.title}>
                                      <Link href={subItem.href || "#"} target={subItem.newTab ? "_blank" : ""} className="flex items-center">
                                        {subItem.icon && (
                                          <Icon
                                            name={subItem.icon}
                                            className="accent-sidebar-foreground size-3 mr-2"
                                          />
                                        )}
                                        <span className="flex-1 leading-normal">{subItem.title}</span>
                                        {!!subItem.isNew && (
                                          <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border border-green-400 text-green-600">
                                            New
                                          </span>
                                        )}
                                        {!!subItem.isComing && (
                                          <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium opacity-50 rounded-md border">
                                            Coming
                                          </span>
                                        )}
                                      </Link>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              ) : null}
                            </DropdownMenu>
                          </div>
                          {/* Expanded Mode: Collapsible acordeón */}
                          <Collapsible 
                            open={openDropdowns[item.title] || false}
                            onOpenChange={() => toggleDropdown(item.title)}
                            className="group/collapsible block group-data-[collapsible=icon]:hidden">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                className="hover:text-foreground! active:text-foreground! hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                tooltip={item.title}>
                                {item.icon && (
                                  <Icon
                                    name={item.icon}
                                    className="accent-sidebar-foreground size-4"
                                  />
                                )}
                                <span>{item.title}</span>
                                <ChevronRight className={`ml-auto transition-transform duration-200 ${
                                  openDropdowns[item.title] ? 'rotate-90' : ''
                                }`} />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem, key) => (
                                  <SidebarMenuSubItem key={key}>
                                    <SidebarMenuSubButton
                                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10 !h-auto !min-h-[2.5rem] !py-2 !overflow-visible !items-start"
                                      isActive={pathname === subItem.href}
                                      asChild>
                                      <Link
                                        href={subItem.href || "#"}
                                        target={subItem.newTab ? "_blank" : ""}>
                                        {subItem.icon && (
                                          <Icon
                                            name={subItem.icon}
                                            className="accent-sidebar-foreground size-4 mt-0.5"
                                          />
                                        )}
                                        <span className="leading-normal">{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                    {!!subItem.isNew && (
                                      <SidebarMenuBadge className="peer-hover/menu-button:text-green-600 border border-green-400 text-green-600 bg-transparent">
                                        New
                                      </SidebarMenuBadge>
                                    )}
                                    {!!subItem.isComing && (
                                      <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                                        Coming
                                      </SidebarMenuBadge>
                                    )}
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        </Fragment>
                      ) : (
                        <SidebarMenuButton
                          className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.href}>
                          <Link href={item.href || "#"}>
                            {item.icon && (
                              <Icon name={item.icon} className="accent-sidebar-foreground size-4" />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                      {!!item.isComing && (
                        <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                          Coming
                        </SidebarMenuBadge>
                      )}
                      {!!item.isNew && (
                        <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                          New
                        </SidebarMenuBadge>
                      )}
                      {!!item.isDataBadge && (
                        <SidebarMenuBadge className="peer-hover/menu-button:text-foreground">
                          {item.isDataBadge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <Card className="bg-muted gap-4 overflow-hidden py-4 group-data-[collapsible=icon]:hidden">
          <CardHeader className="px-3">
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>
              Get pro now to own all dashboards, templates and components for life.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3">
            <Button className="w-full" asChild>
              <Link href="https://vibethink.com/pricing" target="_blank">
                Get VibeThink Pro
              </Link>
            </Button>
          </CardContent>
        </Card>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md">
                  <div className="relative group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
                      <AvatarImage src="/placeholder.svg" alt="User avatar" />
                      <AvatarFallback className="rounded-lg">MR</AvatarFallback>
                    </Avatar>
                    <ChevronsUpDown className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-background border border-border group-data-[collapsible=icon]:flex hidden group-data-[collapsible=icon]:flex" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">Marcelo Rodriguez</span>
                    <span className="truncate text-xs text-muted-foreground">m@example.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-[14rem] rounded-lg"
                side="right"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder.svg" alt="User avatar" />
                      <AvatarFallback className="rounded-lg">MR</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Marcelo Rodriguez</span>
                      <span className="truncate text-xs text-muted-foreground">m@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarContainer>
  );
}
