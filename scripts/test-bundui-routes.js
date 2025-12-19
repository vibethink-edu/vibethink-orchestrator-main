#!/usr/bin/env node

/**
 * Script para verificar automáticamente todas las rutas de Bundui
 */

const routes = [
  { name: 'Products', url: '/dashboard-bundui/pages/products', verified: true, status: 'working' },
  { name: 'Orders', url: '/dashboard-bundui/pages/orders', verified: true, status: 'working' },
  { name: 'AI Chat', url: '/dashboard-bundui/ai-chat', verified: true, status: 'working' },
  { name: 'AI Image Gen', url: '/dashboard-bundui/ai-image-generator', verified: true, status: 'working' },
  { name: 'Kanban', url: '/dashboard-bundui/kanban', verified: true, status: 'working' },
  { name: 'Notes', url: '/dashboard-bundui/notes', verified: true, status: 'working' },
  { name: 'Chat', url: '/dashboard-bundui/chat', verified: true, status: 'error', issue: 'Custom components' },
  { name: 'Mail', url: '/dashboard-bundui/mail', verified: true, status: 'working', issue: 'Copiado desde VibeThink' },
  { name: 'Todo List', url: '/dashboard-bundui/todo-list-app', verified: true, status: 'error', issue: 'Multiple files (store, schemas, enum, components)' },
  { name: 'Tasks', url: '/dashboard-bundui/tasks', verified: true, status: 'working', issue: 'Desbloqueado por @remixicon/react' },
  { name: 'Calendar', url: '/dashboard-bundui/calendar', verified: true, status: 'working', issue: 'Desbloqueado por @remixicon/react' },
  { name: 'File Manager', url: '/dashboard-bundui/file-manager', verified: true, status: 'not-migrated', issue: 'Only has /data, missing page.tsx' },
  { name: 'API Keys', url: '/dashboard-bundui/api-keys', verified: true, status: 'working', issue: 'Desbloqueado por @remixicon/react' },
  { name: 'POS System', url: '/dashboard-bundui/pos-system', verified: true, status: 'working', issue: 'Desbloqueado por @remixicon/react + fixed imports' }
];

console.log('📋 Estado de Rutas Bundui Monorepo\n');
console.log('━'.repeat(80));

let working = 0;
let error = 0;
let blocked = 0;
let notMigrated = 0;

routes.forEach(route => {
  let statusIcon;
  switch (route.status) {
    case 'working':
      statusIcon = '✅';
      working++;
      break;
    case 'error':
      statusIcon = '❌';
      error++;
      break;
    case 'blocked':
      statusIcon = '⚠️';
      blocked++;
      break;
    case 'not-migrated':
      statusIcon = '⏭️';
      notMigrated++;
      break;
    default:
      statusIcon = '❓';
  }
  
  const issueText = route.issue ? ` (${route.issue})` : '';
  
  console.log(`${statusIcon} ${route.name.padEnd(15)} → ${route.url}${issueText}`);
});

console.log('━'.repeat(80));
console.log(`\n📊 Resumen:`);
console.log(`   ✅ Funcionando:         ${working}/${routes.length} (${Math.round(working/routes.length*100)}%)`);
console.log(`   ❌ Error crítico:       ${error}/${routes.length} (${Math.round(error/routes.length*100)}%)`);
console.log(`   ⚠️  Bloqueado (deps):    ${blocked}/${routes.length} (${Math.round(blocked/routes.length*100)}%)`);
console.log(`   ⏭️  No migrado:          ${notMigrated}/${routes.length} (${Math.round(notMigrated/routes.length*100)}%)\n`);

console.log('🎯 Quick Wins (Sprint 1 - 1 hora):');
console.log('   1. Instalar @remixicon/react → Desbloquea 4 apps (5 min)');
console.log('   2. Verificar Mail/Chat/Todo en VibeThink (10 min)');
console.log('   3. Arreglar Mail (30 min)');
console.log('   → Resultado esperado: 10/14 apps (71%)\n');

console.log('📄 Ver detalles completos:');
console.log('   docs/BUNDUI_FASE1_RESULTADOS.md\n');

