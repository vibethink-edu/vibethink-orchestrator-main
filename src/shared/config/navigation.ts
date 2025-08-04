/**
 * Configuración central de navegación - VThink 1.0
 * 
 * Single point of control para todos los elementos de navegación
 * del sistema. Usado por UnifiedSidebar y futuros componentes.
 * 
 * IMPORTANTE: Este archivo NO afecta el dashboard principal
 * que sigue usando BunduiCompleteLayout independientemente.
 */

import { 
  ChartPie, ShoppingBag, BadgeDollarSign, ChartBarDecreasing, Gauge, 
  FolderDot, Folder, WalletMinimal, Activity, Brain, GraduationCap,
  StickyNote, Mail, SquareCheck, Calendar, ArchiveRestore, MessageSquare,
  Key, Cookie, Plus, TrendingUp, ImageIcon, Users, User, Settings,
  UserCheck, Monitor, Bell, Eye, AlertTriangle, SquareKanban,
  List, PackageOpen
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: any;
  tooltip?: string;
  submenu?: NavigationItem[];
  badge?: string;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

/**
 * Configuración de navegación - RÉPLICA EXACTA del dashboard principal
 * Estructura idéntica a BunduiCompleteLayout para consistencia total
 */
export const navigationConfig: NavigationSection[] = [
  {
    label: "Dashboards",
    items: [
      {
        href: "/",
        label: "Default",
        icon: ChartPie,
        tooltip: "Default Dashboard"
      },
      {
        href: "/ecommerce-dashboard",
        label: "E-commerce",
        icon: ShoppingBag,
        tooltip: "E-commerce Dashboard",
        submenu: [
          { href: "https://shadcnuikit.com/dashboard/ecommerce", label: "Dashboard (Original)", icon: ChartPie },
          { href: "/ecommerce-dashboard", label: "Enhanced Dashboard", icon: ChartBarDecreasing },
          { href: "/ecommerce-dashboard/products", label: "Product List", icon: List },
          { href: "/ecommerce-dashboard/product-detail", label: "Product Detail", icon: PackageOpen },
          { href: "/ecommerce-dashboard/add-product", label: "Add Product", icon: Plus },
          { href: "/ecommerce-dashboard/orders", label: "Order List", icon: List },
          { href: "/ecommerce-dashboard/order-detail", label: "Order Detail", icon: PackageOpen }
        ]
      },
      {
        href: "/sales-dashboard",
        label: "Sales",
        icon: BadgeDollarSign,
        tooltip: "Sales Dashboard",
        badge: "New"
      },
      {
        href: "/crm-dashboard",
        label: "CRM",
        icon: ChartBarDecreasing,
        tooltip: "CRM Dashboard",
        badge: "New"
      },
      {
        href: "/finance-dashboard",
        label: "Finance",
        icon: TrendingUp,
        tooltip: "Finance Dashboard",
        badge: "New"
      },
      {
        href: "/website-analytics-dashboard",
        label: "Website Analytics",
        icon: Gauge,
        tooltip: "Website Analytics Dashboard",
        badge: "New"
      },
      {
        href: "/project-management-dashboard",
        label: "Project Management",
        icon: FolderDot,
        tooltip: "Project Management Dashboard",
        badge: "New"
      },
      {
        href: "/file-manager-dashboard",
        label: "File Manager",
        icon: Folder,
        tooltip: "File Manager",
        badge: "New"
      },
      {
        href: "/crypto-dashboard",
        label: "Crypto",
        icon: WalletMinimal,
        tooltip: "Crypto Dashboard",
        badge: "New"
      },
      {
        href: "/pos-system-dashboard",
        label: "POS System",
        icon: Cookie,
        tooltip: "Point of Sale System",
        badge: "New"
      },
      {
        href: "/academy-school",
        label: "Academy/School",
        icon: GraduationCap,
        tooltip: "Academy/School"
      },
      {
        href: "/hospital-management",
        label: "Hospital Management",
        icon: Activity,
        tooltip: "Hospital Management"
      }
    ]
  },
  {
    label: "AI",
    items: [
      {
        href: "/ai-chat-dashboard",
        label: "AI Chat",
        icon: Brain,
        tooltip: "AI Chat Assistant",
        badge: "New"
      },
      {
        href: "/image-generator",
        label: "Image Generator",
        icon: ImageIcon,
        tooltip: "Image Generator"
      }
    ]
  },
  {
    label: "Apps",
    items: [
      {
        href: "/kanban-dashboard",
        label: "Kanban",
        icon: SquareKanban,
        tooltip: "Kanban Board",
        badge: "New"
      },
      {
        href: "/notes-dashboard",
        label: "Notes",
        icon: StickyNote,
        tooltip: "Notes App",
        badge: "New"
      },
      {
        href: "/chats",
        label: "Chats",
        icon: MessageSquare,
        tooltip: "Chat Messages (4)",
        badge: "4"
      },
      {
        href: "/mail-dashboard",
        label: "Mail",
        icon: Mail,
        tooltip: "Mail App (New)",
        badge: "New"
      },
      {
        href: "/todo-list",
        label: "Todo List App",
        icon: SquareCheck,
        tooltip: "Todo List App (New)",
        badge: "New"
      },
      {
        href: "/tasks-dashboard",
        label: "Tasks",
        icon: SquareCheck,
        tooltip: "Tasks",
        badge: "New"
      },
      {
        href: "/calendar-dashboard",
        label: "Calendar",
        icon: Calendar,
        tooltip: "Calendar Application",
        badge: "New"
      },
      {
        href: "/file-manager-app",
        label: "File Manager",
        icon: ArchiveRestore,
        tooltip: "File Manager"
      },
      {
        href: "/api-keys",
        label: "Api Keys",
        icon: Key,
        tooltip: "API Keys"
      },
      {
        href: "/pos-app",
        label: "POS App",
        icon: Cookie,
        tooltip: "POS App (New)",
        badge: "New"
      }
    ]
  },
  {
    label: "Pages",
    items: [
      {
        href: "/users",
        label: "Users List",
        icon: Users,
        tooltip: "Users List"
      },
      {
        href: "/profile",
        label: "Profile",
        icon: User,
        tooltip: "Profile"
      },
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
        tooltip: "Settings",
        submenu: [
          { href: "/settings/profile", label: "Profile", icon: User },
          { href: "/settings/account", label: "Account", icon: UserCheck },
          { href: "/settings/appearance", label: "Appearance", icon: Monitor },
          { href: "/settings/notifications", label: "Notifications", icon: Bell },
          { href: "/settings/display", label: "Display", icon: Eye }
        ]
      }
    ]
  },
  {
    label: "Others",
    items: [
      {
        href: "/premium-test",
        label: "Premium Test",
        icon: ImageIcon,
        tooltip: "Premium Components Test"
      },
      {
        href: "/debug",
        label: "Debug Panel",
        icon: AlertTriangle,
        tooltip: "Debug Panel"
      }
    ]
  }
];

/**
 * Información del header de la aplicación
 */
export const appInfo = {
  name: "VibeThink",
  subtitle: "Dashboard",
  logo: "VT"
};