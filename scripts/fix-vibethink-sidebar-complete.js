const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../apps/dashboard/src/shared/components/vibethink-sidebar.tsx');

console.log('🔧 Corrigiendo vibethink-sidebar.tsx...\n');

let content = fs.readFileSync(sidebarPath, 'utf8');

// Dashboards reales en vibethink
const vibethinkDashboards = [
  'ai-chat', 'calendar', 'crm', 'crypto', 'ecommerce', 'file-manager',
  'finance', 'mail', 'notes', 'pos-system', 'project-management',
  'sales', 'tasks', 'website-analytics'
];

// Reemplazar bunduiReferenceNavItems con vibethinkNavItems completo
const newVibethinkNavItems = `const vibethinkNavItems: NavItem[] = [
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
];`;

// Buscar y reemplazar vibethinkNavItems
const vibethinkRegex = /const vibethinkNavItems: NavItem\[\] = \[[\s\S]*?\];/;
if (content.match(vibethinkRegex)) {
  content = content.replace(vibethinkRegex, newVibethinkNavItems);
  console.log('✅ vibethinkNavItems actualizado con todos los dashboards');
}

// Eliminar bunduiReferenceNavItems (no se debe usar en vibethink-sidebar)
const bunduiRegex = /const bunduiReferenceNavItems: NavItem\[\] = \[[\s\S]*?\];/;
if (content.match(bunduiRegex)) {
  content = content.replace(bunduiRegex, '// bunduiReferenceNavItems eliminado - no se usa en vibethink-sidebar');
  console.log('✅ bunduiReferenceNavItems eliminado (no debe estar aquí)');
}

// Asegurar que solo se usa vibethinkNavItems
const navItemsUsageRegex = /const navItems = isVibeThinkRoute \? vibethinkNavItems : bunduiReferenceNavItems;/;
if (content.match(navItemsUsageRegex)) {
  content = content.replace(navItemsUsageRegex, 'const navItems = vibethinkNavItems; // Solo vibethink en este sidebar');
  console.log('✅ Uso de navItems simplificado (solo vibethinkNavItems)');
}

// Guardar cambios
fs.writeFileSync(sidebarPath, content, 'utf8');

console.log('\n✅ vibethink-sidebar.tsx corregido');
console.log('📋 Dashboards en vibethink:');
vibethinkDashboards.forEach(d => console.log(`   - /dashboard-vibethink/${d}`));
















