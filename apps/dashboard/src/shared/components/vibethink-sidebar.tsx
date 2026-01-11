"use client";

import * as React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIsTablet } from "@/hooks/use-mobile";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
  SidebarInset,
  SidebarTrigger,
} from '@vibethink/ui';
import { Logo } from "@vibethink/ui";
import { ScrollArea } from '@vibethink/ui';
import { NavUser } from "./bundui-premium/components/layout/sidebar-bundui/nav-user";
import {
  Users,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Briefcase,
  CheckSquare,
  Calendar,
  Mail,
  StickyNote,
  FolderOpen,
  GraduationCap,
  Activity,
  Building2,
  CreditCard,
  ShoppingBag,
  Bitcoin,
  Hospital,
  type LucideIcon,
} from "@vibethink/ui/icons";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const vibethinkNavItems: NavItem[] = [
  {
    title: "CRM",
    href: "/dashboard-vibethink/crm",
    icon: Users,
  },
  {
    title: "Sales",
    href: "/dashboard-vibethink/sales",
    icon: TrendingUp,
  },
  {
    title: "E-commerce",
    href: "/dashboard-vibethink/ecommerce",
    icon: ShoppingCart,
  },
  {
    title: "Website Analytics",
    href: "/dashboard-vibethink/website-analytics",
    icon: BarChart3,
  },
  {
    title: "Project Management",
    href: "/dashboard-vibethink/project-management",
    icon: Briefcase,
  },
  {
    title: "Tasks",
    href: "/dashboard-vibethink/tasks",
    icon: CheckSquare,
  },
  {
    title: "Calendar",
    href: "/dashboard-vibethink/calendar",
    icon: Calendar,
  },
  {
    title: "Mail",
    href: "/dashboard-vibethink/mail",
    icon: Mail,
  },
  {
    title: "Notes",
    href: "/dashboard-vibethink/notes",
    icon: StickyNote,
  },
  {
    title: "AI Chat",
    href: "/dashboard-vibethink/ai-chat",
    icon: Activity,
  },
  {
    title: "Crypto",
    href: "/dashboard-vibethink/crypto",
    icon: Bitcoin,
  },
  {
    title: "File Manager",
    href: "/dashboard-vibethink/file-manager",
    icon: FolderOpen,
  },
  {
    title: "Finance",
    href: "/dashboard-vibethink/finance",
    icon: DollarSign,
  },
  {
    title: "POS System",
    href: "/dashboard-vibethink/pos-system",
    icon: ShoppingBag,
  },
];

// bunduiReferenceNavItems eliminado - no se usa en vibethink-sidebar

export function VibeThinkSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname, isMobile, setOpenMobile]);

  useEffect(() => {
    setOpen(!isTablet);
  }, [isTablet, setOpen]);

  // Determinar qué navegación mostrar según la ruta
  const isVibeThinkRoute = pathname?.startsWith('/dashboard-vibethink');
  const navItems = vibethinkNavItems; // Solo vibethink en este sidebar
  const sectionTitle = isVibeThinkRoute ? "VibeThink Sandbox" : "Bundui Reference";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={isVibeThinkRoute ? "/dashboard-vibethink" : "/dashboard-bundui"}>
                <Logo />
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">VibeThink</span>
                  <span className="text-xs text-muted-foreground">{sectionTitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel>{sectionTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

