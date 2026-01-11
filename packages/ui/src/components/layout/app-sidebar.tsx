"use client";

import * as React from "react";
import { useEffect } from "react";
import { ChevronsUpDown, ShoppingBagIcon, UserCircle2Icon } from "lucide-react";
import { PlusIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '../sidebar';
import { NavMain, type NavGroup } from './nav-main';
import { NavUser } from './nav-user';
import { ScrollArea } from '../scroll-area';
import { Logo } from '../logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Button } from '../button';
import { useIsTablet } from '../../hooks/use-mobile';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems?: NavGroup[];
}

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname, isMobile, setOpenMobile]);



  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:text-foreground h-10 group-data-[collapsible=icon]:!px-0 hover:bg-[var(--primary)]/5">
                  <Logo />
                  <span className="font-semibold">VibeThink Orchestrator</span>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="mt-4 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg z-[60]"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}>
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-3">
                  <ShoppingBagIcon className="text-muted-foreground size-4" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">E-commerce</span>
                    <span className="text-muted-foreground text-xs">Active</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3">
                  <UserCircle2Icon className="text-muted-foreground size-4" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Blog Platform</span>
                    <span className="text-muted-foreground text-xs">Inactive</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button className="w-full" variant="secondary">
                    <PlusIcon />
                    Add New Project
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain navItems={navItems} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <Card className="gap-4 overflow-hidden py-4 group-data-[collapsible=icon]:hidden">
          <CardHeader className="px-3">
            <CardTitle>Download</CardTitle>
            <CardDescription>
              Unlock lifetime access to all dashboards, templates and components.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3">
            <Button className="w-full" asChild>
              <Link href="https://shadcnuikit.com/pricing" target="_blank">
                Get VibeThink Pro
              </Link>
            </Button>
          </CardContent>
        </Card>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

