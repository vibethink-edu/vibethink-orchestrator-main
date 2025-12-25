/**
 * Script para corregir rutas de re-exportación
 * Solo cambia rutas de dashboards que SÍ fueron migrados a dashboard-vibethink
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, '../apps/dashboard/app/(dashboard)');

// Dashboards que SÍ fueron migrados a dashboard-vibethink
const MIGRATED_DASHBOARDS = new Set([
  'ai-chat',
  'calendar',
  'crm',
  'crypto',
  'ecommerce',
  'file-manager',
  'finance',
  'mail',
  'notes',
  'pos-system',
  'project-management',
  'sales',
  'tasks',
  'website-analytics'
]);

// Mapeo de nombres: algunos tienen nombres diferentes en la ruta de re-export
const ROUTE_MAPPING = {
  'project-management': 'project-management',  // Ya está correcto
  'website-analytics': 'website-analytics'  // Ya está correcto
};

function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixReExports() {
  console.log('🔍 Buscando archivos con dashboard-bundui o dashboard-vibethink...');
  
  const files = findTsxFiles(DASHBOARD_DIR);
  let updatedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Buscar rutas como ../../dashboard-bundui/X o ../../dashboard-vibethink/X
    const match = content.match(/['"](\.\.\/)+dashboard-(bundui|vibethink)\/([^'"]+)\/page['"]/);
    
    if (match) {
      const dashboardName = match[3].split('/').pop(); // Último segmento del path
      const currentPath = match[2]; // bundui o vibethink
      const relPath = match[3]; // Path completo después de dashboard-*/
      
      // Si está en dashboard-vibethink pero NO debería estar
      if (currentPath === 'vibethink' && !MIGRATED_DASHBOARDS.has(dashboardName)) {
        const newContent = content.replace(
          /dashboard-vibethink\//g, 
          'dashboard-bundui/'
        );
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log(`✅ Revertido a bundui: ${path.relative(DASHBOARD_DIR, file)} (${dashboardName})`);
        updatedCount++;
      }
      // Si está en dashboard-bundui pero SÍ debería estar en vibethink
      else if (currentPath === 'bundui' && MIGRATED_DASHBOARDS.has(dashboardName)) {
        const newContent = content.replace(
          /dashboard-bundui\//g, 
          'dashboard-vibethink/'
        );
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log(`✅ Cambiado a vibethink: ${path.relative(DASHBOARD_DIR, file)} (${dashboardName})`);
        updatedCount++;
      }
    }
  }

  console.log(`\n✨ Completado: ${updatedCount} archivos actualizados`);
}

fixReExports();








