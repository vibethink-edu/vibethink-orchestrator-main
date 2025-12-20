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
import { NavUser } from "@/components/layout/sidebar-bundui/nav-user";
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
  FileText,
  FolderOpen,
  GraduationCap,
  Activity,
  Building2,
  CreditCard,
  ShoppingBag,
  Bitcoin,
  Hospital,
  BrainCircuit,
  Gauge,
  Sparkles,
  Columns,
  LayoutDashboard,
  GitBranch,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const vibethinkNavItems: NavItem[] = [
  {
    title: "Default",
    href: "/dashboard-vibethink/default",
    icon: LayoutDashboard,
    badge: "New",
  },
  {
    title: "Academy",
    href: "/dashboard-vibethink/academy",
    icon: GraduationCap,
    badge: "New",
  },
  {
    title: "AI Chat",
    href: "/dashboard-vibethink/ai-chat",
    icon: BrainCircuit,
  },
  {
    title: "AI Image Generator",
    href: "/dashboard-vibethink/ai-image-generator",
    icon: Sparkles,
    badge: "New",
  },
  {
    title: "Analytics",
    href: "/dashboard-vibethink/analytics",
    icon: BarChart3,
    badge: "New",
  },
  {
    title: "Calendar",
    href: "/dashboard-vibethink/calendar",
    icon: Calendar,
  },
  {
    title: "CRM",
    href: "/dashboard-vibethink/crm",
    icon: Users,
  },
  {
    title: "Crypto",
    href: "/dashboard-vibethink/crypto",
    icon: Bitcoin,
  },
  {
    title: "E-commerce",
    href: "/dashboard-vibethink/ecommerce",
    icon: ShoppingCart,
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
    title: "Kanban",
    href: "/dashboard-vibethink/kanban",
    icon: Columns,
    badge: "New",
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
    title: "Notes V2",
    href: "/dashboard-vibethink/notes-v2",
    icon: FileText,
    badge: "New",
  },
  {
    title: "Payment",
    href: "/dashboard-vibethink/payment",
    icon: CreditCard,
    badge: "New",
  },
  {
    title: "POS System",
    href: "/dashboard-vibethink/pos-system",
    icon: ShoppingBag,
  },
  {
    title: "Project Management",
    href: "/dashboard-vibethink/project-management",
    icon: Briefcase,
  },
  {
    title: "Sales",
    href: "/dashboard-vibethink/sales",
    icon: TrendingUp,
  },
  {
    title: "Tasks",
    href: "/dashboard-vibethink/tasks",
    icon: CheckSquare,
  },
  {
    title: "Website Analytics",
    href: "/dashboard-vibethink/website-analytics",
    icon: Gauge,
  },
  {
    title: "Workflow",
    href: "/dashboard-vibethink/workflow",
    icon: GitBranch,
    badge: "New",
  },
];

const bunduiReferenceNavItems: NavItem[] = [
  {
    title: "Academy",
    href: "/dashboard-bundui/academy",
    icon: GraduationCap,
  },
  {
    title: "AI Image Generator",
    href: "/dashboard-bundui/ai-image-generator",
    icon: Activity,
  },
  {
    title: "Analytics",
    href: "/dashboard-bundui/analytics",
    icon: BarChart3,
  },
  {
    title: "API Keys",
    href: "/dashboard-bundui/api-keys",
    icon: CreditCard,
  },
  {
    title: "Apps Chat",
    href: "/dashboard-bundui/apps/chat",
    icon: Mail,
  },
  {
    title: "Default",
    href: "/dashboard-bundui/default",
    icon: BarChart3,
  },
  {
    title: "Hospital Management",
    href: "/dashboard-bundui/hospital-management",
    icon: Hospital,
  },
  {
    title: "Hotel",
    href: "/dashboard-bundui/hotel",
    icon: Building2,
  },
  {
    title: "Payment",
    href: "/dashboard-bundui/payment",
    icon: CreditCard,
  },
  {
    title: "Project List",
    href: "/dashboard-bundui/project-list",
    icon: Briefcase,
  },
  {
    title: "Projects",
    href: "/dashboard-bundui/projects",
    icon: Briefcase,
  },
];

export function VibeThinkSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile, open, state } = useSidebar();
  const isTablet = useIsTablet();

  // Auto-close en mobile al cambiar de ruta (mejora UX)
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname, isMobile, setOpenMobile]);

  // Auto-colapsar en tablet (estándar Shadcn)
  // Solo colapsar automáticamente cuando cambia de desktop a tablet, no interferir con toggle manual
  const prevIsTablet = React.useRef(isTablet);
  useEffect(() => {
    // Solo colapsar si cambió de desktop a tablet, no si ya estaba en tablet
    if (isTablet && !prevIsTablet.current) {
      setOpen(false);
    }
    prevIsTablet.current = isTablet;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTablet]); // Solo depender de isTablet, no de setOpen

  // Determinar qué navegación mostrar según la ruta
  const isVibeThinkRoute = pathname?.startsWith('/dashboard-vibethink');
  const navItems = isVibeThinkRoute ? vibethinkNavItems : bunduiReferenceNavItems;
  const sectionTitle = isVibeThinkRoute ? "VibeThink Sandbox" : "Bundui Reference";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              asChild
              className="hover:text-foreground hover:bg-[var(--primary)]/5"
            >
              <Link href={isVibeThinkRoute ? "/dashboard-vibethink" : "/dashboard-bundui"} className="flex items-center">
                <Logo className={state === "collapsed" ? "scale-110 transition-transform" : "transition-transform"} />
                <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden ml-2">
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
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {sectionTitle}
            </SidebarGroupLabel>
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
                        className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded group-data-[collapsible=icon]:hidden">
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

