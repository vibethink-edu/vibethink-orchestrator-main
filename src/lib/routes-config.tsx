type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href?: string;
  icon?: string;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  items?: PageRoutesItemType;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Default",
        href: "/",
        icon: "ChartPie"
      },
      {
        title: "E-commerce",
        href: "/ecommerce-dashboard",
        icon: "ShoppingBag",
        items: [
          {
            title: "Enhanced Dashboard",
            href: "/ecommerce-dashboard",
            icon: "ChartBarDecreasing",
            isNew: true
          },
          {
            title: "Product List",
            href: "/ecommerce-dashboard/products",
            icon: "List"
          },
          {
            title: "Product Detail",
            href: "/ecommerce-dashboard/product-detail",
            icon: "PackageOpen"
          },
          {
            title: "Add Product",
            href: "/ecommerce-dashboard/add-product",
            icon: "Plus"
          },
          {
            title: "Order List",
            href: "/ecommerce-dashboard/orders",
            icon: "List"
          },
          {
            title: "Order Detail",
            href: "/ecommerce-dashboard/order-detail",
            icon: "PackageOpen"
          }
        ]
      },
      {
        title: "Sales",
        href: "/sales-dashboard",
        icon: "BadgeDollarSign",
        isNew: true
      },
      {
        title: "CRM",
        href: "/crm-dashboard",
        icon: "ChartBarDecreasing",
        isNew: true
      },
      {
        title: "Website Analytics",
        href: "/website-analytics-dashboard",
        icon: "Gauge",
        isNew: true
      },
      {
        title: "Project Management",
        href: "/project-management-dashboard",
        icon: "FolderDot",
        isNew: true
      },
      {
        title: "File Manager",
        href: "/file-manager-dashboard",
        icon: "Folder",
        isNew: true
      },
      {
        title: "Crypto",
        href: "/crypto-dashboard",
        icon: "WalletMinimal",
        isNew: true
      },
      {
        title: "Finance",
        href: "/finance-dashboard",
        icon: "TrendingUp",
        isNew: true
      },
      {
        title: "Academy/School",
        href: "/academy-school",
        icon: "GraduationCap",
        isComing: true
      },
      {
        title: "Hospital Management",
        href: "/hospital-management",
        icon: "Activity",
        isComing: true
      }
    ]
  },
  {
    title: "AI",
    items: [
      {
        title: "AI Chat",
        href: "/ai-chat-dashboard",
        icon: "Brain",
        isNew: true
      },
      {
        title: "Image Generator",
        href: "/image-generator",
        icon: "ImageIcon",
        isComing: true
      }
    ]
  },
  {
    title: "Apps",
    items: [
      {
        title: "Kanban",
        href: "/kanban-dashboard",
        icon: "SquareKanban",
        isNew: true
      },
      {
        title: "Notes",
        href: "/notes-dashboard",
        icon: "StickyNote",
        isNew: true
      },
      {
        title: "Chats",
        href: "/chats",
        icon: "MessageSquare",
        isDataBadge: "4"
      },
      {
        title: "Mail",
        href: "/mail-dashboard",
        icon: "Mail",
        isNew: true
      },
      {
        title: "Todo List App",
        href: "/todo-list",
        icon: "SquareCheck",
        isNew: true
      },
      {
        title: "Tasks",
        href: "/tasks-dashboard",
        icon: "SquareCheck",
        isNew: true
      },
      {
        title: "Calendar",
        href: "/calendar-dashboard",
        icon: "Calendar",
        isNew: true
      },
      {
        title: "File Manager",
        href: "/file-manager-app",
        icon: "ArchiveRestore"
      },
      {
        title: "API Keys",
        href: "/api-keys",
        icon: "Key"
      },
      {
        title: "POS App",
        href: "/pos-system-dashboard",
        icon: "Cookie",
        isNew: true
      }
    ]
  },
  {
    title: "Pages",
    items: [
      {
        title: "Users List",
        href: "/users",
        icon: "Users"
      },
      {
        title: "Profile",
        href: "/profile",
        icon: "User"
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "Settings",
        items: [
          {
            title: "Profile",
            href: "/settings/profile",
            icon: "User"
          },
          {
            title: "Account",
            href: "/settings/account",
            icon: "UserCheck"
          },
          {
            title: "Appearance",
            href: "/settings/appearance",
            icon: "Monitor"
          },
          {
            title: "Notifications",
            href: "/settings/notifications",
            icon: "Bell"
          },
          {
            title: "Display",
            href: "/settings/display",
            icon: "Eye"
          }
        ]
      },
      {
        title: "Pricing",
        href: "/pricing",
        icon: "CreditCard",
        items: [
          {
            title: "Pricing Table",
            href: "/pricing/table",
            icon: "CreditCard"
          },
          {
            title: "Pricing Cards",
            href: "/pricing/cards",
            icon: "CreditCard"
          }
        ]
      },
      {
        title: "Authentication",
        href: "/auth",
        icon: "Shield",
        items: [
          {
            title: "Sign In",
            href: "/auth/signin",
            icon: "LogIn"
          },
          {
            title: "Sign Up",
            href: "/auth/signup",
            icon: "UserPlus"
          },
          {
            title: "Forgot Password",
            href: "/auth/forgot-password",
            icon: "KeyRound"
          },
          {
            title: "Reset Password",
            href: "/auth/reset-password",
            icon: "RotateCcw"
          }
        ]
      },
      {
        title: "Error Pages",
        href: "/error",
        icon: "AlertTriangle",
        items: [
          {
            title: "404 Not Found",
            href: "/error/404",
            icon: "FileX"
          },
          {
            title: "500 Server Error",
            href: "/error/500",
            icon: "Server"
          },
          {
            title: "503 Maintenance",
            href: "/error/503",
            icon: "Settings"
          }
        ]
      }
    ]
  },
  {
    title: "Others",
    items: [
      {
        title: "Components",
        href: "/components",
        icon: "Component"
      },
      {
        title: "Blocks",
        href: "/blocks",
        icon: "Blocks"
      },
      {
        title: "Templates",
        href: "/templates",
        icon: "ClipboardMinus"
      },
      {
        title: "Landing Page",
        href: "/landing",
        icon: "Globe"
      },
      {
        title: "Shadcn UI Kit Download",
        href: "https://shadcnuikit.com",
        icon: "Download",
        newTab: true
      },
      {
        title: "Mobile Test",
        href: "/mobile-test",
        icon: "Smartphone"
      },
      {
        title: "Debug",
        href: "/debug",
        icon: "Bug"
      },
      {
        title: "Premium",
        href: "/premium",
        icon: "Crown"
      },
      {
        title: "Test",
        href: "/test",
        icon: "TestTube"
      },
      {
        title: "Test Charts",
        href: "/test-charts",
        icon: "ChartBar"
      }
    ]
  }
]; 