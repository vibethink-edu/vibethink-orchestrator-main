const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../apps/dashboard/src/shared/components/bundui-premium/components/layout/sidebar-bundui/nav-main.tsx');

console.log('🔧 Corrigiendo todas las rutas del sidebar bundui...\n');

let content = fs.readFileSync(sidebarPath, 'utf8');
let changeCount = 0;

// Dashboards reales en bundui (según diagnóstico)
const existingDashboards = [
  'academy', 'ai-image-generator', 'analytics', 'api-keys', 'crm', 
  'default', 'ecommerce', 'hospital-management', 'hotel', 'payment',
  'project-list', 'projects', 'sales'
];

// NO existen en bundui (están en vibethink)
const nonExistingDashboards = [
  'ai-chat', 'calendar', 'crypto', 'file-manager', 'finance',
  'mail', 'notes', 'pos-system', 'tasks', 'website-analytics',
  'project-management'
];

// 1. Reemplazar todos los /dashboard/ por /dashboard-bundui/
const regex = /href:\s*"\/dashboard\//g;
const matches = content.match(regex);
if (matches) {
  content = content.replace(regex, 'href: "/dashboard-bundui/');
  changeCount += matches.length;
  console.log(`✅ Reemplazadas ${matches.length} rutas /dashboard/ → /dashboard-bundui/`);
}

// 2. Comentar dashboards que NO existen
nonExistingDashboards.forEach(dashboard => {
  // Buscar líneas con ese dashboard
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Si la línea contiene el dashboard y no está ya comentada
    if (line.includes(`/${dashboard}`) && !line.trim().startsWith('//')) {
      // Comentar la línea
      lines[i] = line.replace(/^(\s*)(.*)$/, '$1// $2 // NO EXISTE EN BUNDUI');
      modified = true;
    }
  }
  
  if (modified) {
    content = lines.join('\n');
    console.log(`⚠️  Comentado: ${dashboard} (no existe en bundui)`);
  }
});

// 3. Mapeos especiales
const mappings = {
  'website-analytics': 'analytics',
  'project-management': 'projects'
};

Object.entries(mappings).forEach(([from, to]) => {
  const fromRegex = new RegExp(`/dashboard-bundui/${from}`, 'g');
  if (content.match(fromRegex)) {
    content = content.replace(fromRegex, `/dashboard-bundui/${to}`);
    console.log(`🔄 Mapeado: ${from} → ${to}`);
  }
});

// Guardar cambios
fs.writeFileSync(sidebarPath, content, 'utf8');

console.log(`\n✅ Total de cambios: ${changeCount}`);
console.log('✅ Sidebar bundui corregido\n');
console.log('📋 Dashboards válidos en bundui:');
existingDashboards.forEach(d => console.log(`   - /dashboard-bundui/${d}`));











