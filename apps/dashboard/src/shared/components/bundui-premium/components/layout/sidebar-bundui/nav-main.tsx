"use client";

import { SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar } from '@vibethink/ui';
import {
  ActivityIcon,
  ArchiveRestoreIcon,
  BadgeDollarSignIcon,
  BrainCircuitIcon,
  BrainIcon,
  Building2Icon,
  CalendarIcon,
  ChartBarDecreasingIcon,
  ChartPieIcon,
  ChevronRight,
  ClipboardCheckIcon,
  ClipboardMinusIcon,
  ComponentIcon,
  CookieIcon,
  FingerprintIcon,
  FolderDotIcon,
  FolderIcon,
  GaugeIcon,
  GraduationCapIcon,
  ImagesIcon,
  KeyIcon,
  MailIcon,
  MessageSquareIcon,
  ProportionsIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SquareCheckIcon,
  SquareKanbanIcon,
  StickyNoteIcon,
  UserIcon,
  UsersIcon,
  WalletMinimalIcon,
  type LucideIcon,
  GithubIcon,
  RedoDotIcon,
  BrushCleaningIcon,
  CoinsIcon,
  DollarSignIcon,
  SpeechIcon
} from "lucide-react";
import Link from "next/link";
import { IconWrapper } from "./icon-wrapper";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@vibethink/ui';
import { usePathname } from "next/navigation";
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger } from '@vibethink/ui';

type NavGroup = {
  title: string;
  items: NavItem;
};

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  items?: NavItem;
}[];

export const navItems: NavGroup[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Default",
        href: "/dashboard-bundui/default",
        icon: ChartPieIcon,
        isNew: true
      },
      {
        title: "E-commerce",
        href: "#",
        icon: ShoppingBagIcon,
        items: [
          { title: "Dashboard", href: "/dashboard-bundui/ecommerce" },
          { title: "Product List", href: "/dashboard-bundui/pages/products" },
          { title: "Product Detail", href: "/dashboard-bundui/pages/products/1" },
          { title: "Add Product", href: "/dashboard-bundui/pages/products/create" },
          { title: "Order List", href: "/dashboard-bundui/pages/orders" },
          { title: "Order Detail", href: "/dashboard-bundui/pages/orders/detail" }
        ]
      },
      { title: "Sales", href: "/dashboard-bundui/sales", icon: BadgeDollarSignIcon, isNew: true },
      { title: "CRM", href: "/dashboard-bundui/crm", icon: ChartBarDecreasingIcon, isNew: true },
      {
        title: "CRM V2",
        href: "/dashboard-bundui/crm-v2",
        icon: ChartBarDecreasingIcon,
        isNew: true
      },
      {
        title: "Website Analytics",
        href: "/dashboard-bundui/analytics",
        icon: GaugeIcon,
        isNew: true
      },
      {
        title: "Project Management",
        href: "/dashboard-bundui/projects",
        icon: FolderDotIcon,
        isNew: true
      },
      { title: "File Manager", href: "/dashboard-bundui/file-manager", icon: FolderIcon, isNew: true },
      { title: "Crypto", href: "/dashboard-bundui/crypto", icon: CoinsIcon, isNew: true },
      {
        title: "Crypto V2",
        href: "/dashboard-bundui/crypto-v2",
        icon: CoinsIcon,
        isNew: true
      },
      { title: "Finance", href: "/dashboard-bundui/finance", icon: DollarSignIcon, isNew: true },
      {
        title: "Finance V2",
        href: "/dashboard-bundui/finance-v2",
        icon: DollarSignIcon,
        isNew: true
      },
      { title: "Academy/School", href: "/dashboard-bundui/academy", icon: GraduationCapIcon, isNew: true },
      { title: "Hospital Management", href: "/dashboard-bundui/hospital-management", icon: ActivityIcon, isNew: true },
      { title: "Hotel Dashboard", href: "/dashboard-bundui/hotel", icon: Building2Icon, isComing: true }
    ]
  },
  {
    title: "AI Apps",
    items: [
      { title: "AI Chat", href: "/dashboard-bundui/ai-chat", icon: BrainIcon },
      {
        title: "AI Chat V2",
        href: "/dashboard-bundui/ai-chat-v2",
        icon: BrainCircuitIcon,
        isNew: true
      },
      {
        title: "Image Generator",
        href: "/dashboard-bundui/ai-image-generator",
        icon: ImagesIcon
      },
      {
        title: "Text to Speech",
        href: "/dashboard-bundui/text-to-speech",
        icon: SpeechIcon,
        isComing: true
      }
    ]
  },
  {
    title: "Apps",
    items: [
      {
        title: "Kanban",
        href: "/dashboard-bundui/kanban",
        icon: SquareKanbanIcon,
        isNew: true
      },
      { title: "Notes", href: "/dashboard-bundui/notes", icon: StickyNoteIcon, isDataBadge: "8", isNew: true },
      { title: "Chats", href: "/dashboard-bundui/chat", icon: MessageSquareIcon, isDataBadge: "5", isNew: true },
      { title: "Mail", href: "/dashboard-bundui/mail", icon: MailIcon, isNew: true },
      {
        title: "Todo List App",
        href: "/dashboard-bundui/todo-list-app",
        icon: SquareCheckIcon,
        isNew: true
      },
      {
        title: "Tasks",
        href: "/dashboard-bundui/tasks",
        icon: ClipboardCheckIcon,
        isNew: true
      },
      { title: "Calendar", href: "/dashboard-bundui/calendar", icon: CalendarIcon, isNew: true },
      {
        title: "File Manager",
        href: "/dashboard-bundui/file-manager",
        icon: ArchiveRestoreIcon,
        isComing: true
      },
      { title: "Api Keys", href: "/dashboard-bundui/api-keys", icon: KeyIcon, isNew: true },
      { title: "POS App", href: "/dashboard-bundui/pos-system", icon: CookieIcon, isNew: true }
    ]
  },
  {
    title: "Pages",
    items: [
      {
        title: "Users List",
        href: "/dashboard-bundui/pages/users",
        icon: UsersIcon
      },
      {
        title: "Profile",
        href: "/dashboard-bundui/pages/profile",
        icon: UserIcon
      },
      {
        title: "Onboarding Flow",
        href: "/dashboard-bundui/pages/onboarding-flow",
        icon: RedoDotIcon
      },
      {
        title: "Empty States",
        href: "/dashboard-bundui/pages/empty-states/01",
        icon: BrushCleaningIcon,
        items: [
          { title: "Empty States 01", href: "/dashboard-bundui/pages/empty-states/01" },
          { title: "Empty States 02", href: "/dashboard-bundui/pages/empty-states/02" },
          { title: "Empty States 03", href: "/dashboard-bundui/pages/empty-states/03" }
        ]
      },
      {
        title: "Settings",
        href: "/dashboard-bundui/pages/settings",
        icon: SettingsIcon,
        items: [
          { title: "Profile", href: "/dashboard-bundui/pages/settings" },
          { title: "Account", href: "/dashboard-bundui/pages/settings/account" },
          { title: "Appearance", href: "/dashboard-bundui/pages/settings/appearance" },
          { title: "Notifications", href: "/dashboard-bundui/pages/settings/notifications" },
          { title: "Display", href: "/dashboard-bundui/pages/settings/display" }
        ]
      },
      {
        title: "Pricing",
        href: "#",
        icon: BadgeDollarSignIcon,
        items: [
          { title: "Column Pricing", href: "/dashboard-bundui/pages/pricing/column" },
          { title: "Table Pricing", href: "/dashboard-bundui/pages/pricing/table" },
          { title: "Single Pricing", href: "/dashboard-bundui/pages/pricing/single" }
        ]
      },
      {
        title: "Authentication",
        href: "/",
        icon: FingerprintIcon,
        items: [
          { title: "Login v1", href: "/dashboard-bundui/login/v1" },
          { title: "Login v2", href: "/dashboard-bundui/login/v2" },
          { title: "Register v1", href: "/dashboard-bundui/register/v1" },
          { title: "Register v2", href: "/dashboard-bundui/register/v2" },
          { title: "Forgot Password", href: "/dashboard-bundui/forgot-password" }
        ]
      },
      {
        title: "Error Pages",
        href: "/",
        icon: FingerprintIcon,
        items: [
          { title: "404", href: "/dashboard-bundui/pages/error/404" },
          { title: "500", href: "/dashboard-bundui/pages/error/500" },
          { title: "403", href: "/dashboard-bundui/pages/error/403" }
        ]
      }
    ]
  },
  {
    title: "Migrados",
    items: [
      { title: "AI Chat", href: "/dashboard-vibethink/ai-chat", icon: BrainCircuitIcon, isNew: true },
      { title: "Calendar", href: "/dashboard-vibethink/calendar", icon: CalendarIcon, isNew: true },
      { title: "CRM", href: "/dashboard-vibethink/crm", icon: ChartBarDecreasingIcon, isNew: true },
      { title: "Crypto", href: "/dashboard-vibethink/crypto", icon: WalletMinimalIcon, isNew: true },
      { title: "E-commerce", href: "/dashboard-vibethink/ecommerce", icon: ShoppingBagIcon, isNew: true },
      { title: "File Manager", href: "/dashboard-vibethink/file-manager", icon: FolderIcon, isNew: true },
      { title: "Finance", href: "/dashboard-vibethink/finance", icon: BadgeDollarSignIcon, isNew: true },
      { title: "Mail", href: "/dashboard-vibethink/mail", icon: MailIcon, isNew: true },
      { title: "Notes", href: "/dashboard-vibethink/notes", icon: StickyNoteIcon, isNew: true },
      { title: "POS System", href: "/dashboard-vibethink/pos-system", icon: CookieIcon, isNew: true },
      { title: "Projects", href: "/dashboard-vibethink/project-management", icon: FolderDotIcon, isNew: true },
      { title: "Sales", href: "/dashboard-vibethink/sales", icon: BadgeDollarSignIcon, isNew: true },
      { title: "Tasks", href: "/dashboard-vibethink/tasks", icon: ClipboardCheckIcon, isNew: true },
      { title: "Analytics", href: "/dashboard-vibethink/website-analytics", icon: GaugeIcon, isNew: true }
    ]
  },
  {
    title: "Others",
    items: [
      {
        title: "Download VibeThink Pro",
        href: "/pricing",
        icon: ClipboardMinusIcon,
        newTab: true
      },
      {
        title: "Components",
        href: "/components",
        icon: ComponentIcon,
        newTab: true
      },
      {
        title: "Blocks",
        href: "/blocks",
        icon: ComponentIcon,
        newTab: true
      },
      {
        title: "Templates",
        href: "/templates",
        icon: ProportionsIcon,
        newTab: true
      },
      {
        title: "Github",
        href: "https://github.com/bundui",
        icon: GithubIcon,
        newTab: true
      }
    ]
  }
];

export function NavMain() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      {navItems.map((nav) => (
        <SidebarGroup key={nav.title}>
          <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <IconWrapper icon={item.icon} />}
                              <span>{item.title}</span>
                              <IconWrapper icon={ChevronRight} className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-48 rounded-lg z-[60]">
                            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                            {item.items?.map((item) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                asChild
                                key={item.title}>
                                <a href={item.href}>{item.title}</a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible className="group/collapsible block group-data-[collapsible=icon]:hidden">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={item.title}>
                            {item.icon && <IconWrapper icon={item.icon} />}
                            <span>{item.title}</span>
                            <IconWrapper icon={ChevronRight} className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.items?.map((subItem, key) => (
                              <SidebarMenuSubItem key={key}>
                                <SidebarMenuSubButton
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                                  isActive={pathname === subItem.href}
                                  asChild>
                                  <Link href={subItem.href} target={subItem.newTab ? "_blank" : ""}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      asChild>
                      <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                        {item.icon && <IconWrapper icon={item.icon} />}
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
    </>
  );
}
