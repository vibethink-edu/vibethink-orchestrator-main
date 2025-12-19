#!/usr/bin/env node

/**
 * Script para verificar automáticamente todas las rutas de Bundui
 */

const routes = [
  { name: 'Products', url: '/dashboard-bundui/pages/products', verified: true },
  { name: 'Orders', url: '/dashboard-bundui/pages/orders', verified: true },
  { name: 'AI Chat', url: '/dashboard-bundui/ai-chat', verified: true },
  { name: 'AI Image Gen', url: '/dashboard-bundui/ai-image-generator', verified: true },
  { name: 'Kanban', url: '/dashboard-bundui/kanban', verified: true },
  { name: 'Notes', url: '/dashboard-bundui/notes', verified: true },
  { name: 'Chat', url: '/dashboard-bundui/chat', verified: false, issue: 'Custom components' },
  { name: 'Mail', url: '/dashboard-bundui/mail', verified: false },
  { name: 'Todo List', url: '/dashboard-bundui/todo-list-app', verified: false },
  { name: 'Tasks', url: '/dashboard-bundui/tasks', verified: false },
  { name: 'Calendar', url: '/dashboard-bundui/calendar', verified: false },
  { name: 'File Manager', url: '/dashboard-bundui/file-manager', verified: false },
  { name: 'API Keys', url: '/dashboard-bundui/api-keys', verified: false },
  { name: 'POS System', url: '/dashboard-bundui/pos-system', verified: false }
];

console.log('📋 Estado de Rutas Bundui Monorepo\n');
console.log('━'.repeat(80));

let working = 0;
let broken = 0;
let untested = 0;

routes.forEach(route => {
  const status = route.verified === true ? '✅' : 
                 route.verified === false && route.issue ? '❌' : 
                 '⏭️';
  
  const issueText = route.issue ? ` (${route.issue})` : '';
  
  console.log(`${status} ${route.name.padEnd(15)} → ${route.url}${issueText}`);
  
  if (route.verified === true) working++;
  else if (route.issue) broken++;
  else untested++;
});

console.log('━'.repeat(80));
console.log(`\n📊 Resumen:`);
console.log(`   ✅ Funcionando: ${working}/${routes.length}`);
console.log(`   ❌ Con errores:  ${broken}/${routes.length}`);
console.log(`   ⏭️  Sin probar:   ${untested}/${routes.length}\n`);

console.log('🎯 Próximos pasos:');
console.log('   1. Probar las 7 rutas sin verificar');
console.log('   2. Arreglar la ruta de Chat (componentes custom)');
console.log('   3. Aplicar fixes según resultados\n');

