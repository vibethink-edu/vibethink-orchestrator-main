/**
 * Script para corregir imports mal formateados y rutas rotas
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Función para corregir imports en un archivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Corregir imports de Supabase
    if (content.includes('@/lib/supabase')) {
      content = content.replace(/@\/lib\/supabase/g, '@/shared/lib/supabase');
      hasChanges = true;
    }
    
    // Corregir imports de hooks
    if (content.includes('@/hooks/')) {
      content = content.replace(/@\/hooks\//g, '@/shared/hooks/');
      hasChanges = true;
    }
    
    // Corregir imports de servicios
    if (content.includes('@/services/')) {
      content = content.replace(/@\/services\//g, '@/shared/services/');
      hasChanges = true;
    }
    
    // Corregir imports de tipos
    if (content.includes('@/types/')) {
      content = content.replace(/@\/types\//g, '@/shared/types/');
      hasChanges = true;
    }
    
    // Corregir imports de utilidades
    if (content.includes('@/utils/')) {
      content = content.replace(/@\/utils\//g, '@/shared/utils/');
      hasChanges = true;
    }
    
    // Corregir imports de configuraciones
    if (content.includes('@/config/')) {
      content = content.replace(/@\/config\//g, '@/shared/config/');
      hasChanges = true;
    }
    
    // Corregir imports de constantes
    if (content.includes('@/constants/')) {
      content = content.replace(/@\/constants\//g, '@/shared/constants/');
      hasChanges = true;
    }
    
    // Corregir imports con comillas mal cerradas
    const regex = /from\s+['"]@\/shared\/[^'"]*['"]/g;
    const matches = content.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        const corrected = match.replace(/['"]$/, "'");
        if (match !== corrected) {
          content = content.replace(match, corrected);
          hasChanges = true;
        }
      });
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Buscar todos los archivos TypeScript/JavaScript
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');

console.log(`🔧 Fixing imports in ${files.length} files...`);

files.forEach(fixImportsInFile);

console.log('✅ Import fixes completed!'); 