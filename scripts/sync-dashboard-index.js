const fs = require('fs');
const path = require('path');

/**
 * Script para sincronizar las páginas de índice con los dashboards que realmente existen
 */

const DASHBOARD_BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const DASHBOARD_VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');
const DASHBOARD_BUNDUI_PAGE = path.join(DASHBOARD_BUNDUI_DIR, 'page.tsx');
const DASHBOARD_VIBETHINK_PAGE = path.join(DASHBOARD_VIBETHINK_DIR, 'page.tsx');

function getRealDashboards(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dashboards = [];
  
  for (const entry of entries) {
    // Skip special directories
    if (entry.name === 'apps' || 
        entry.name === 'pages' || 
        entry.name === 'components' ||
        entry.name.includes('backup') ||
        entry.name.startsWith('.')) {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Check if it has a page.tsx
      const pagePath = path.join(dir, entry.name, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        dashboards.push(entry.name);
      }
    }
  }
  
  return dashboards.sort();
}

function syncBunduiPage() {
  const realDashboards = getRealDashboards(DASHBOARD_BUNDUI_DIR);
  console.log('📁 Dashboards reales en dashboard-bundui:', realDashboards.join(', '));
  
  // Leer el archivo actual
  let content = fs.readFileSync(DASHBOARD_BUNDUI_PAGE, 'utf8');
  
  // Extraer el array de dashboards usando regex
  const dashboardArrayMatch = content.match(/const dashboards = \[([\s\S]*?)\];/);
  if (!dashboardArrayMatch) {
    console.error('❌ No se encontró el array de dashboards en dashboard-bundui/page.tsx');
    return;
  }
  
  // Extraer solo los nombres de href de los dashboards existentes
  const existingHrefs = [];
  const hrefRegex = /href:\s*'\/dashboard-bundui\/([^']+)'/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    existingHrefs.push(match[1]);
  }
  
  // Filtrar solo los que existen realmente
  const validHrefs = existingHrefs.filter(href => realDashboards.includes(href.split('/')[0]));
  
  console.log(`✅ ${validHrefs.length} dashboards válidos encontrados en el código`);
  console.log(`⚠️  ${existingHrefs.length - validHrefs.length} dashboards en código que NO existen en carpetas`);
  
  // Para dashboard-bundui, vamos a comentar los que no existen
  // Pero mejor: crear un script que liste solo los existentes
  // Por ahora, solo reportamos
}

function syncVibeThinkPage() {
  const realDashboards = getRealDashboards(DASHBOARD_VIBETHINK_DIR);
  console.log('\n📁 Dashboards reales en dashboard-vibethink:', realDashboards.join(', '));
  
  // Leer el archivo actual
  let content = fs.readFileSync(DASHBOARD_VIBETHINK_PAGE, 'utf8');
  
  // Extraer los nombres de href
  const existingHrefs = [];
  const hrefRegex = /href:\s*'\/dashboard-vibethink\/([^']+)'/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    existingHrefs.push(match[1]);
  }
  
  // Filtrar solo los que existen realmente
  const validHrefs = existingHrefs.filter(href => realDashboards.includes(href.split('/')[0]));
  
  console.log(`✅ ${validHrefs.length} dashboards válidos encontrados en el código`);
  console.log(`⚠️  ${existingHrefs.length - validHrefs.length} dashboards en código que NO existen en carpetas`);
  
  if (existingHrefs.length !== validHrefs.length) {
    const invalid = existingHrefs.filter(href => !realDashboards.includes(href.split('/')[0]));
    console.log(`\n❌ Dashboards que aparecen en código pero NO existen:`);
    invalid.forEach(href => console.log(`   - ${href}`));
  }
  
  return { realDashboards, validHrefs, invalidHrefs: existingHrefs.filter(href => !realDashboards.includes(href.split('/')[0])) };
}

console.log('🔍 Sincronizando páginas de índice con dashboards reales...\n');

syncBunduiPage();
const vibethinkResult = syncVibeThinkPage();

console.log('\n' + '='.repeat(80));
console.log('📊 RESUMEN\n');

console.log('Para dashboard-vibethink, necesitas:');
console.log('1. Eliminar o comentar dashboards que no existen');
console.log('2. O crear las carpetas faltantes');

if (vibethinkResult && vibethinkResult.invalidHrefs.length > 0) {
  console.log('\n🔧 Dashboards a eliminar del código de dashboard-vibethink/page.tsx:');
  vibethinkResult.invalidHrefs.forEach(href => console.log(`   - ${href}`));
}

console.log('\n✨ Proceso completado.');
















