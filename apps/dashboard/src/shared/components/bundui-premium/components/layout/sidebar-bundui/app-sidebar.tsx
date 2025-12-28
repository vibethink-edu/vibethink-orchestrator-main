"use client";

import * as React from "react";
import { useEffect } from "react";
import { ChevronsUpDown, ShoppingBagIcon, UserCircle2Icon } from "lucide-react";
import { PlusIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useIsTablet } from "@/hooks/use-mobile";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@vibethink/ui/components/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { ScrollArea } from "@vibethink/ui/components/scroll-area";
import { Logo } from "@vibethink/ui/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vibethink/ui/components/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Button } from "@vibethink/ui/components/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();
  const { t } = useTranslation('navigation');

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname]);

  useEffect(() => {
    setOpen(!isTablet);
  }, [isTablet]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:text-foreground h-10 group-data-[collapsible=icon]:px-0! hover:bg-[var(--primary)]/5">
                  <Logo />
                  <span className="font-semibold">{t('header.orchestrator')}</span>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="mt-4 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg z-[60]"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}>
                <DropdownMenuLabel>{t('header.projects')}</DropdownMenuLabel>
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
                    {t('header.add_new_project')}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain key="nav" />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <Card className="gap-4 overflow-hidden py-4 group-data-[collapsible=icon]:hidden">
          <CardHeader className="px-3">
            <CardTitle>{t('footer.download')}</CardTitle>
            <CardDescription>
              {t('footer.download_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3">
            <Button className="w-full" asChild>
              <Link href="https://shadcnuikit.com/pricing" target="_blank">
                {t('footer.get_pro')}
              </Link>
            </Button>
          </CardContent>
        </Card>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
