"use client";

import { useTranslation } from '@/lib/i18n';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@vibethink/ui';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@vibethink/ui';

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
        title: "CRM V2 + AI",
        href: "/dashboard-bundui/crm-v2-ai",
        icon: BrainCircuitIcon,
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
      {
        title: "Projects V2",
        href: "/dashboard-bundui/projects-v2",
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
      {
        title: "Hotel Dashboard",
        href: "/dashboard-bundui/hotel",
        icon: Building2Icon,
        isNew: true,
        items: [
          { title: "Dashboard", href: "/dashboard-bundui/hotel" },
          { title: "Bookings", href: "/dashboard-bundui/hotel/bookings" }
        ]
      }
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

// Helper function to map English titles to translation keys
const getTitleTranslationKey = (title: string): string => {
  const keyMap: Record<string, string> = {
    // Groups
    'Dashboards': 'groups.dashboards',
    'AI Apps': 'groups.ai_apps',
    'Apps': 'groups.apps',
    'Pages': 'groups.pages',
    'Others': 'groups.others',
    // Main items
    'Default': 'items.default',
    'E-commerce': 'items.ecommerce',
    'Sales': 'items.sales',
    'CRM': 'items.crm',
    'CRM V2': 'items.crm_v2',
    'CRM V2 + AI': 'items.crm_v2_ai',
    'Website Analytics': 'items.website_analytics',
    'Project Management': 'items.project_management',
    'Projects V2': 'items.projects_v2',
    'File Manager': 'items.file_manager',
    'Crypto': 'items.crypto',
    'Crypto V2': 'items.crypto_v2',
    'Finance': 'items.finance',
    'Finance V2': 'items.finance_v2',
    'Academy/School': 'items.academy',
    'Hospital Management': 'items.hospital',
    'Hotel Dashboard': 'items.hotel',
    'AI Chat': 'items.ai_chat',
    'AI Chat V2': 'items.ai_chat_v2',
    'Image Generator': 'items.image_generator',
    'Text to Speech': 'items.text_to_speech',
    'Kanban': 'items.kanban',
    'Notes': 'items.notes',
    'Chats': 'items.chats',
    'Mail': 'items.mail',
    'Todo List App': 'items.todo_list',
    'Tasks': 'items.tasks',
    'Calendar': 'items.calendar',
    'Api Keys': 'items.api_keys',
    'POS App': 'items.pos_app',
    'Users List': 'items.users_list',
    'Profile': 'items.profile',
    'Onboarding Flow': 'items.onboarding',
    'Empty States': 'items.empty_states',
    'Settings': 'items.settings',
    'Pricing': 'items.pricing',
    'Authentication': 'items.authentication',
    'Error Pages': 'items.error_pages',
    'Download VibeThink Pro': 'items.download_pro',
    'Components': 'items.components',
    'Blocks': 'items.blocks',
    'Templates': 'items.templates',
    'Github': 'items.github',
    // Subitems
    'Dashboard': 'subitems.dashboard',
    'Product List': 'subitems.product_list',
    'Product Detail': 'subitems.product_detail',
    'Add Product': 'subitems.add_product',
    'Order List': 'subitems.order_list',
    'Order Detail': 'subitems.order_detail',
    'Bookings': 'subitems.bookings',
    'Empty States 01': 'subitems.empty_states_01',
    'Empty States 02': 'subitems.empty_states_02',
    'Empty States 03': 'subitems.empty_states_03',
    'Account': 'subitems.account',
    'Appearance': 'subitems.appearance',
    'Notifications': 'subitems.notifications',
    'Display': 'subitems.display',
    'Column Pricing': 'subitems.column_pricing',
    'Table Pricing': 'subitems.table_pricing',
    'Single Pricing': 'subitems.single_pricing',
    'Login v1': 'subitems.login_v1',
    'Login v2': 'subitems.login_v2',
    'Register v1': 'subitems.register_v1',
    'Register v2': 'subitems.register_v2',
    'Forgot Password': 'subitems.forgot_password',
    '404': 'subitems.error_404',
    '500': 'subitems.error_500',
    '403': 'subitems.error_403',
    // Badges
    'New': 'badges.new',
    'Coming': 'badges.coming'
  };

  return keyMap[title] || title; // Fallback to original if not found
};

export function NavMain() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { t, locale } = useTranslation('navigation');

  return (
    <>
      {navItems.map((nav) => (
        <SidebarGroup key={nav.title}>
          <SidebarGroupLabel>{t(getTitleTranslationKey(nav.title))}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={t(getTitleTranslationKey(item.title))}>
                              {item.icon && <IconWrapper icon={item.icon} />}
                              <span>{t(getTitleTranslationKey(item.title))}</span>
                              <IconWrapper icon={ChevronRight} className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-48 rounded-lg z-[60]">
                            <DropdownMenuLabel>{t(getTitleTranslationKey(item.title))}</DropdownMenuLabel>
                            {item.items?.map((item) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                asChild
                                key={item.title}>
                                <a href={item.href}>{t(getTitleTranslationKey(item.title))}</a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible className="group/collapsible block group-data-[collapsible=icon]:hidden">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={t(getTitleTranslationKey(item.title))}>
                            {item.icon && <IconWrapper icon={item.icon} />}
                            <span>{t(getTitleTranslationKey(item.title))}</span>
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
                                    <span>{t(getTitleTranslationKey(subItem.title))}</span>
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
                      tooltip={t(getTitleTranslationKey(item.title))}
                      asChild>
                      <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                        {item.icon && <IconWrapper icon={item.icon} />}
                        <span>{t(getTitleTranslationKey(item.title))}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {!!item.isComing && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                      {t('badges.coming')}
                    </SidebarMenuBadge>
                  )}
                  {!!item.isNew && (
                    <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                      {t('badges.new')}
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
