import { Fragment, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { page_routes } from "@/lib/routes-config";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/bundui-premium/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/shared/components/bundui-premium/components/ui/dropdown-menu";
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
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname]);

  useEffect(() => {
    setOpen(!isTablet);
  }, [isTablet]);

  return (
    <SidebarContainer collapsible="icon" variant="inset" className="bg-background">
      <SidebarHeader className="items-center justify-center pt-3 transition-all group-data-[collapsible=icon]:pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:text-foreground rounded-none group-data-[collapsible=icon]:px-0! hover:bg-[var(--primary)]/10">
                  <Logo />
                  <div className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                    VibeThink Orchestrator
                  </div>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                <DropdownMenuItem>
                  <span>Ecommerce</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Analytics</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <div className="h-full overflow-y-auto">
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
                          <div className="hidden group-data-[collapsible=icon]:block">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
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
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </DropdownMenuTrigger>
                              {item.items?.length ? (
                                <DropdownMenuContent
                                  side={isMobile ? "bottom" : "right"}
                                  align={isMobile ? "end" : "start"}
                                  className="min-w-48 rounded-lg">
                                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                                  {item.items.map((item) => (
                                    <DropdownMenuItem
                                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10! min-h-[2.5rem] py-2"
                                      asChild
                                      key={item.title}>
                                      <a href={item.href} className="flex items-center">
                                        <span className="flex-1 leading-normal">{item.title}</span>
                                        {!!item.isNew && (
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
                                        {!!item.isComing && (
                                          <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium opacity-50 rounded-md border">
                                            Coming
                                          </span>
                                        )}
                                      </a>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              ) : null}
                            </DropdownMenu>
                          </div>
                          <Collapsible className="group/collapsible block group-data-[collapsible=icon]:hidden">
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
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 group-data-[collapsible=icon]:hidden">
          <div className="text-xs font-medium text-center text-muted-foreground">VibeThink</div>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
}
