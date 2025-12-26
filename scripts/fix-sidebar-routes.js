const fs = require('fs');
const path = require('path');

/**
 * Script para corregir las rutas del sidebar de Bundui
 * para que apunten solo a dashboards que existen
 */

const DASHBOARD_BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const DASHBOARD_VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');
const SIDEBAR_FILE = path.join(__dirname, '../apps/dashboard/src/shared/components/bundui-premium/components/layout/sidebar-bundui/nav-main.tsx');

function getRealDashboards(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dashboards = [];
  
  for (const entry of entries) {
    if (entry.name === 'apps' || 
        entry.name === 'pages' || 
        entry.name === 'components' ||
        entry.name.includes('backup') ||
        entry.name.startsWith('.')) {
      continue;
    }
    
    if (entry.isDirectory()) {
      const pagePath = path.join(dir, entry.name, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        dashboards.push(entry.name);
      }
    }
  }
  
  return dashboards.sort();
}

const bunduiDashboards = getRealDashboards(DASHBOARD_BUNDUI_DIR);
const vibethinkDashboards = getRealDashboards(DASHBOARD_VIBETHINK_DIR);

console.log('📁 Dashboards reales en dashboard-bundui:', bunduiDashboards.join(', '));
console.log('📁 Dashboards reales en dashboard-vibethink:', vibethinkDashboards.join(', '));

// Leer el archivo del sidebar
let content = fs.readFileSync(SIDEBAR_FILE, 'utf8');

// Rutas incorrectas que debemos comentar o eliminar
const incorrectBunduiRoutes = [
  '/dashboard-bundui/crypto',  // No existe
  '/dashboard-bundui/file-manager',  // No existe
  '/dashboard-bundui/finance',  // No existe
  '/dashboard-bundui/apps/ai-chat',  // No existe
  '/dashboard-bundui/apps/notes',  // No existe
  '/dashboard-bundui/apps/mail',  // No existe
  '/dashboard-bundui/apps/todo-list-app',  // No existe
  '/dashboard-bundui/apps/tasks',  // No existe
  '/dashboard-bundui/apps/calendar',  // No existe
  '/dashboard-bundui/apps/file-manager',  // No existe
  '/dashboard-bundui/apps/pos-system',  // No existe
];

console.log('\n🔧 Comentando rutas que no existen...\n');

// Comentar líneas con rutas incorrectas
incorrectBunduiRoutes.forEach(route => {
  const regex = new RegExp(`(\\s*)(\\{[^}]*href:\\s*"${route.replace(/\//g, '\\/')}"[^}]*\\})`, 'g');
  content = content.replace(regex, (match, indent, obj) => {
    console.log(`   ❌ Comentando: ${route}`);
    return `${indent}// ${obj} // NO EXISTE`;
  });
});

// Escribir el archivo actualizado
fs.writeFileSync(SIDEBAR_FILE, content, 'utf8');

console.log('\n✅ Sidebar actualizado correctamente');
console.log('\n📝 Rutas comentadas que NO existen en el sistema de archivos');
console.log('   Para restaurarlas, crea las carpetas correspondientes en dashboard-bundui/');











