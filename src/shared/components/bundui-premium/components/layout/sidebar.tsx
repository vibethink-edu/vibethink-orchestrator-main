import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { page_routes } from "@/lib/routes-config";
import { ChevronRight, ChevronsUpDown, Plus, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/bundui-premium/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useIsTablet } from "@/hooks/use-mobile";

export default function Sidebar() {
  // Estados para controlar dropdowns
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  
  const toggleDropdown = (itemTitle: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile, state } = useSidebar();
  const isTablet = useIsTablet();

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
                <SidebarMenuButton className="hover:text-foreground rounded-none group-data-[collapsible=icon]:px-0! hover:bg-[var(--primary)]/10">
                  <Logo />
                  <div className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                    VibeThink
                  </div>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Switch Project
                </DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">VibeThink Orchestrator</div>
                    <div className="text-xs text-muted-foreground">AI Platform</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Ecommerce Dashboard</div>
                    <div className="text-xs text-muted-foreground">Sales Platform</div>
                  </div>
                  <Badge variant="outline" className="text-xs">Live</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Analytics Hub</div>
                    <div className="text-xs text-muted-foreground">Data Platform</div>
                  </div>
                  <Badge variant="outline" className="text-xs">Beta</Badge>
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
                                <SidebarMenuButton
                                  className="hover:text-foreground! active:text-foreground! hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10! relative"
                                  tooltip={item.title}>
                                  {item.icon && (
                                    <div className="relative">
                                      <Icon
                                        name={item.icon}
                                        className="accent-sidebar-foreground size-4"
                                      />
                                      {/* Indicador de sub-opciones en modo collapsed - VThink UX Innovation */}
                                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                        &gt;
                                      </div>
                                    </div>
                                  )}
                                  <span>{item.title}</span>
                                </SidebarMenuButton>
                              </DropdownMenuTrigger>
                              {item.items?.length ? (
                                                                 <DropdownMenuContent
                                   side={isMobile ? "bottom" : "right"}
                                   align={isMobile ? "end" : "start"}
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
                                          <span 
                                            className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md"
                                            style={{ 
                                              border: '1px solid #4ade80', 
                                              color: '#059669',
                                              backgroundColor: 'transparent' 
                                            }}>
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
                                      <SidebarMenuBadge 
                                        className="peer-hover/menu-button:text-green-600"
                                        style={{ 
                                          border: '1px solid #4ade80', 
                                          color: '#059669',
                                          backgroundColor: 'transparent' 
                                        }}>
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
        <div className="p-2 group-data-[collapsible=icon]:hidden">
          <div className="text-xs font-medium text-center text-muted-foreground">VibeThink</div>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
}
