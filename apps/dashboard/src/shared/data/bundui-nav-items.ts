// Bundui navigation items - Shared data for bundui-premium components
// This file contains the navigation structure for dashboard-bundui

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
  ClipboardCheckIcon,
  ClipboardMinusIcon,
  ComponentIcon,
  CookieIcon,
  CreditCardIcon,
  FingerprintIcon,
  FolderDotIcon,
  FolderIcon,
  GaugeIcon,
  GraduationCapIcon,
  ImagesIcon,
  KeyIcon,
  MailIcon,
  MessageSquareIcon,
  MessageSquareHeartIcon,
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
  SpeechIcon,
  BookAIcon,
  PuzzleIcon
} from "lucide-react";
import type { NavGroup } from '@vibethink/ui';

export const bunduiNavItems: NavGroup[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Classic Dashboard",
        href: "/dashboard-bundui/default",
        icon: ChartPieIcon
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
      {
        title: "Payment Dashboard",
        href: "/dashboard-bundui/payment",
        icon: CreditCardIcon,
        items: [
          { title: "Dashboard", href: "/dashboard-bundui/payment" },
          { title: "Transactions", href: "/dashboard-bundui/payment/transactions" }
        ]
      },
      {
        title: "Hotel Dashboard",
        href: "/dashboard-bundui/hotel",
        icon: Building2Icon,
        items: [
          { title: "Dashboard", href: "/dashboard-bundui/hotel" },
          { title: "Bookings", href: "/dashboard-bundui/hotel/bookings" }
        ]
      },
      {
        title: "Project Management",
        href: "/dashboard-bundui/project-management",
        icon: FolderDotIcon,
        items: [
          { title: "Dashboard (Legacy)", href: "/dashboard-bundui/project-management" },
          { title: "Project List (Legacy)", href: "/dashboard-bundui/project-list" },
          { title: "Projects V2", href: "/dashboard-bundui/projects-v2", isNew: true }
        ]
      },
      { title: "Sales", href: "/dashboard-bundui/sales", icon: BadgeDollarSignIcon },
      { title: "CRM", href: "/dashboard-bundui/crm", icon: ChartBarDecreasingIcon },
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
        isNew: true,
        badge: "AI"
      },
      {
        title: "Website Analytics",
        href: "/dashboard-bundui/analytics",
        icon: GaugeIcon
      },
      {
        title: "File Manager",
        href: "/dashboard-bundui/file-manager",
        icon: FolderIcon
      },
      { title: "Crypto", href: "/dashboard-bundui/crypto", icon: WalletMinimalIcon },
      {
        title: "Crypto V2",
        href: "/dashboard-bundui/crypto-v2",
        icon: WalletMinimalIcon,
        isNew: true
      },
      { title: "Academy/School", href: "/dashboard-bundui/academy", icon: GraduationCapIcon },
      { title: "Hospital Management", href: "/dashboard-bundui/hospital-management", icon: ActivityIcon },
      {
        title: "Finance Dashboard",
        href: "/dashboard-bundui/finance",
        icon: WalletMinimalIcon
      },
      {
        title: "Finance V2",
        href: "/dashboard-bundui/finance-v2",
        icon: WalletMinimalIcon,
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
        icon: SquareKanbanIcon
      },
      { title: "Notes", href: "/dashboard-bundui/notes", icon: StickyNoteIcon, isDataBadge: "8" },
      { title: "Chats", href: "/dashboard-bundui/chat", icon: MessageSquareIcon, isDataBadge: "5" },
      {
        title: "Social Media",
        href: "/dashboard-bundui/social-media",
        icon: MessageSquareHeartIcon
      },
      { title: "Mail", href: "/dashboard-bundui/mail", icon: MailIcon },
      {
        title: "Todo List App",
        href: "/dashboard-bundui/todo-list-app",
        icon: SquareCheckIcon
      },
      {
        title: "Notes",
        href: "/dashboard-bundui/notes",
        icon: StickyNoteIcon,
        items: [
          { title: "v1 - BundUI Notes", href: "/dashboard-bundui/notes" },
          { title: "v2 - VibeThink Notes", href: "/dashboard-vibethink/notes-v2" }
        ]
      },
      { title: "Calendar", href: "/dashboard-bundui/calendar", icon: CalendarIcon },
      {
        title: "File Manager",
        href: "/dashboard-bundui/file-manager",
        icon: ArchiveRestoreIcon,
        isNew: true
      },
      { title: "Api Keys", href: "/dashboard-bundui/api-keys", icon: KeyIcon },
      { title: "POS App", href: "/dashboard-bundui/pos-system", icon: CookieIcon },
      { title: "Courses", href: "/dashboard-bundui/courses", icon: BookAIcon, isComing: true },
      {
        title: "Tasks",
        href: "/dashboard-bundui/tasks",
        icon: ClipboardCheckIcon
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
        title: "Profile V2",
        href: "/dashboard-bundui/pages/user-profile",
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
          { title: "Billing", href: "/dashboard-bundui/pages/settings/billing" },
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
        title: "Widgets",
        href: "#",
        icon: PuzzleIcon,
        items: [
          { title: "Fitness", href: "/dashboard-bundui/widgets/fitness" },
          { title: "E-commerce", href: "/dashboard-bundui/widgets/ecommerce" },
          { title: "Analytics", href: "/dashboard-bundui/widgets/analytics" }
        ]
      },
      {
        title: "Download Shadcn UI Kit",
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




