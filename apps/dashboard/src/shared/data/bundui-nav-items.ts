// Bundui navigation items - Shared data for bundui-premium components
// This file contains the navigation structure for dashboard-bundui

import {
  ActivityIcon,
  ArchiveRestoreIcon,
  BadgeDollarSignIcon,
  BrainCircuitIcon,
  Building2Icon,
  CalendarIcon,
  ChartBarDecreasingIcon,
  ChartPieIcon,
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
  DollarSignIcon
} from "lucide-react";
import type { NavGroup } from '@vibethink/ui';

export const bunduiNavItems: NavGroup[] = [
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
      { title: "Finance", href: "/dashboard-bundui/finance", icon: DollarSignIcon, isNew: true },
      { title: "Academy/School", href: "/dashboard-bundui/academy", icon: GraduationCapIcon, isNew: true },
      { title: "Hospital Management", href: "/dashboard-bundui/hospital-management", icon: ActivityIcon, isNew: true },
      { title: "Hotel Dashboard", href: "/dashboard-bundui/hotel", icon: Building2Icon, isComing: true }
    ]
  },
  {
    title: "AI",
    items: [
      { title: "AI Chat", href: "/dashboard-bundui/ai-chat", icon: BrainCircuitIcon, isNew: true },
      {
        title: "AI Chat V2",
        href: "/dashboard-bundui/ai-chat-v2",
        icon: BrainCircuitIcon,
        isNew: true
      },
      {
        title: "Image Generator",
        href: "/dashboard-bundui/ai-image-generator",
        icon: ImagesIcon,
        isNew: true
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
      { title: "Notes V2", href: "/dashboard-vibethink/notes-v2", icon: StickyNoteIcon, isNew: true },
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




