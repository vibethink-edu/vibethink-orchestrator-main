type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href: string;
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
        href: "/admin/test-premium-dashboard",
        icon: "ChartPie"
      },
      {
        title: "E-commerce",
        href: "#",
        icon: "ShoppingBag",
        items: [
          { title: "Dashboard", href: "/admin/test-ecommerce" },
          { title: "Analytics", href: "/admin/test-analytics" },
          { title: "CRM", href: "/admin/test-crm" },
          { title: "Finance", href: "/admin/test-finance" },
          { title: "Marketing", href: "/admin/test-marketing" }
        ]
      },
      { title: "Sales", href: "/admin/test-analytics", icon: "BadgeDollarSign" },
      { title: "CRM", href: "/admin/test-crm", icon: "ChartBarDecreasing" },
      {
        title: "Website Analytics",
        href: "/admin/test-analytics",
        icon: "Gauge"
      },
      {
        title: "Project Management",
        href: "/admin/premium-test",
        icon: "FolderDot"
      },
      {
        title: "File Manager",
        href: "/admin/premium-test",
        icon: "Folder"
      },
      { title: "Crypto", href: "/admin/test-finance", icon: "WalletMinimal" },
      { title: "Academy/School", href: "/admin/premium-test", icon: "GraduationCap" },
      { title: "Hospital Management", href: "/admin/premium-test", icon: "Activity" },
      { title: "Hotel Dashboard", href: "/admin/premium-test", icon: "Building2", isComing: true }
    ]
  },
  {
    title: "Apps",
    items: [
      {
        title: "Kanban",
        href: "/admin/premium-test",
        icon: "SquareKanban",
        isComing: true
      },
      { title: "AI Chat", href: "/admin/premium-test", icon: "Brain", isNew: true },
      { title: "Notes", href: "/admin/premium-test", icon: "StickyNote" },
      { title: "Chats", href: "/admin/premium-test", icon: "MessageSquare", isDataBadge: "4" },
      { title: "Mail", href: "/admin/premium-test", icon: "Mail", isNew: true },
      {
        title: "Todo List App",
        href: "/admin/premium-test",
        icon: "SquareCheck",
        isComing: true
      },
      { title: "Calendar", href: "/admin/premium-test", icon: "Calendar" },
      {
        title: "File Manager",
        href: "/admin/premium-test",
        icon: "ArchiveRestore",
        isComing: true
      },
      { title: "Api Keys", href: "/admin/premium-test", icon: "Key" },
      { title: "POS App", href: "/admin/premium-test", icon: "Cookie", isNew: true }
    ]
  },
  {
    title: "Pages",
    items: [
      {
        title: "Users",
        href: "/admin/premium-test",
        icon: "Users",
        items: [
          { title: "Users List", href: "/admin/premium-test" },
          { title: "Profile", href: "/admin/premium-test" }
        ]
      },
      {
        title: "Settings",
        href: "/admin/premium-test",
        icon: "Settings",
        items: [
          { title: "Profile", href: "/admin/premium-test" },
          { title: "Account", href: "/admin/premium-test" },
          { title: "Appearance", href: "/admin/premium-test" },
          { title: "Notifications", href: "/admin/premium-test" },
          { title: "Display", href: "/admin/premium-test" }
        ]
      },
      {
        title: "Pricing",
        href: "#",
        icon: "BadgeDollarSign",
        items: [
          { title: "Column Pricing", href: "/admin/premium-test" },
          { title: "Table Pricing", href: "/admin/premium-test" },
          { title: "Single Pricing", href: "/admin/premium-test" }
        ]
      },
      {
        title: "Authentication",
        href: "/",
        icon: "Fingerprint",
        items: [
          { title: "Login v1", href: "/admin/login" },
          { title: "Login v2", href: "/admin/login" },
          { title: "Register v1", href: "/admin/login" },
          { title: "Register v2", href: "/admin/login" },
          { title: "Forgot Password", href: "/admin/login" }
        ]
      },
      {
        title: "Error Pages",
        href: "/",
        icon: "Fingerprint",
        items: [
          { title: "404", href: "/admin/premium-test" },
          { title: "500", href: "/admin/premium-test" },
          { title: "403", href: "/admin/premium-test" }
        ]
      },
      {
        title: "VThink Platform",
        href: "/dashboard",
        icon: "Proportions",
        newTab: false
      }
    ]
  },
  {
    title: "Others",
    items: [
      {
        title: "Components",
        href: "/admin/premium-test",
        icon: "Component",
        newTab: false
      },
      {
        title: "Blocks",
        href: "/admin/premium-test",
        icon: "Component",
        newTab: false
      },
      {
        title: "Templates",
        href: "/admin/premium-test",
        icon: "Proportions",
        newTab: false
      },
      {
        title: "Documentation",
        href: "/admin/premium-test",
        icon: "ClipboardMinus",
        isComing: true
      }
    ]
  }
]; 