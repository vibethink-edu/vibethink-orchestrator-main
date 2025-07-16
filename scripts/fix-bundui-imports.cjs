const fs = require('fs');
const path = require('path');

// Función para corregir imports en un archivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Corregir imports de componentes UI
    const uiComponentPatterns = [
      { from: '@/components/ui/', to: '@/shared/components/ui/' },
      { from: '@/components/icons', to: '@/shared/components/ui/icons' },
      { from: '@/components/card-action-menus', to: '@/shared/components/ui/card-action-menus' }
    ];

    uiComponentPatterns.forEach(pattern => {
      const regex = new RegExp(pattern.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(pattern.from)) {
        content = content.replace(regex, pattern.to);
        modified = true;
        console.log(`✅ Corregido en ${filePath}: ${pattern.from} → ${pattern.to}`);
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para procesar directorio recursivamente
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalFixed += processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixImportsInFile(filePath)) {
        totalFixed++;
      }
    }
  });

  return totalFixed;
}

// Procesar archivos de Bundui
const bunduiPath = path.join(__dirname, '../src/shared/components/bundui');
console.log('🔧 Corrigiendo imports de Bundui...');

if (fs.existsSync(bunduiPath)) {
  const fixedCount = processDirectory(bunduiPath);
  console.log(`\n✅ Proceso completado. ${fixedCount} archivos corregidos.`);
} else {
  console.log('❌ No se encontró el directorio de Bundui');
} 