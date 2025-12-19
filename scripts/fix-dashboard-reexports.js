/**
 * Script para actualizar todas las rutas de re-exportación
 * de dashboard-bundui a dashboard-vibethink
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, '../apps/dashboard/app/(dashboard)');

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
  console.log('🔍 Buscando archivos con dashboard-bundui...');
  
  const files = findTsxFiles(DASHBOARD_DIR);
  let updatedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Solo actualizar si contiene dashboard-bundui
    if (content.includes('dashboard-bundui')) {
      const newContent = content.replace(/dashboard-bundui/g, 'dashboard-vibethink');
      fs.writeFileSync(file, newContent, 'utf-8');
      console.log(`✅ Actualizado: ${path.relative(DASHBOARD_DIR, file)}`);
      updatedCount++;
    }
  }

  console.log(`\n✨ Completado: ${updatedCount} archivos actualizados`);
}

fixReExports();

