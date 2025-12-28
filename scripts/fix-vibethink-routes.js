const fs = require('fs');
const path = require('path');

/**
 * Script para corregir todas las rutas /dashboard-bundui a /dashboard-vibethink
 * dentro de los archivos de dashboard-vibethink
 */

const DASHBOARD_VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');
const COMPONENTS_DIR = path.join(__dirname, '../apps/dashboard/src/shared/components');

function fixRoutesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Reemplazar /dashboard-bundui con /dashboard-vibethink
    // Pero solo si estamos en archivos de dashboard-vibethink o vibethink-sidebar
    content = content.replace(/\/dashboard-bundui/g, '/dashboard-vibethink');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      // Skip node_modules, .next, backups
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === '.next' ||
          entry.name.includes('backup')) {
        continue;
      }
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

console.log('🔍 Buscando archivos en dashboard-vibethink...\n');

// Fix files in dashboard-vibethink directory
const vibethinkFiles = findFiles(DASHBOARD_VIBETHINK_DIR);
let fixedCount = 0;

for (const file of vibethinkFiles) {
  if (fixRoutesInFile(file)) {
    fixedCount++;
  }
}

// Fix vibethink-sidebar.tsx specifically
const sidebarFile = path.join(COMPONENTS_DIR, 'vibethink-sidebar.tsx');
if (fs.existsSync(sidebarFile)) {
  if (fixRoutesInFile(sidebarFile)) {
    fixedCount++;
  }
}

console.log(`\n✨ Proceso completado. ${fixedCount} archivo(s) corregido(s).`);














