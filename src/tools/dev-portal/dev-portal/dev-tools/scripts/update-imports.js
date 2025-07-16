/**
 * Script para actualizar imports después de la reorganización estructural
 * Actualiza automáticamente todas las rutas de imports en el proyecto
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapeo de rutas antiguas a nuevas
const importMappings = {
  // Componentes UI movidos a shared
  '@/components/ui/': '@/shared/components/ui/',
  '@/components/layout/': '@/shared/components/layout/',
  
  // Hooks movidos a shared
  '@/hooks/': '@/shared/hooks/',
  
  // Servicios movidos a shared
  '@/services/': '@/shared/services/',
  
  // Tipos movidos a shared
  '@/types/': '@/shared/types/',
  
  // Utilidades movidas a shared
  '@/utils/': '@/shared/utils/',
  
  // Configuraciones movidas a shared
  '@/config/': '@/shared/config/',
  '@/constants/': '@/shared/constants/',
  
  // Aplicaciones específicas
  '@/components/dashboard/': '@/apps/dashboard/components/',
  '@/components/accounting/': '@/apps/accounting/components/',
  '@/components/crm/': '@/apps/crm/components/',
  '@/components/admin/': '@/apps/admin/components/',
  
  // Páginas movidas
  '@/pages/accounting/': '@/apps/accounting/pages/',
  '@/pages/admin/': '@/apps/admin/pages/',
};

// Función para actualizar imports en un archivo
function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Aplicar cada mapeo
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      const regex = new RegExp(`from\\s+['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `from '${newPath}`);
        hasChanges = true;
        console.log(`✅ Updated imports in ${filePath}: ${oldPath} → ${newPath}`);
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function updateAllImports() {
  console.log('🔄 Starting import updates...\n');
  
  // Buscar todos los archivos TypeScript/JavaScript
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['src/**/node_modules/**', 'src/**/dist/**', 'src/**/build/**']
  });
  
  let updatedFiles = 0;
  let totalFiles = files.length;
  
  files.forEach(file => {
    if (updateImportsInFile(file)) {
      updatedFiles++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files updated: ${updatedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - updatedFiles}`);
  
  if (updatedFiles > 0) {
    console.log('\n✅ Import updates completed successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Run your build/test to check for any remaining issues');
    console.log('   2. Fix any remaining import errors manually if needed');
    console.log('   3. Commit your changes');
  } else {
    console.log('\nℹ️ No files needed updates.');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateAllImports();
}

module.exports = { updateAllImports, updateImportsInFile }; 