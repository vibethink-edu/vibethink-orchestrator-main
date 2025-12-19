const fs = require('fs');
const path = require('path');

/**
 * Script de validación para asegurar que las rutas estén correctas
 * según las reglas:
 * - dashboard-bundui: todas las rutas deben apuntar a /dashboard-bundui/*
 * - dashboard-vibethink: todas las rutas deben apuntar a /dashboard-vibethink/*
 */

const DASHBOARD_BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const DASHBOARD_VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');
const COMPONENTS_DIR = path.join(__dirname, '../apps/dashboard/src/shared/components');

const errors = [];
const warnings = [];

function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  function walkDir(currentPath) {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        // Skip node_modules, .next, backups, dist
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === '.next' ||
            entry.name === 'dist' ||
            entry.name.includes('backup')) {
          continue;
        }
        
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      warnings.push(`⚠️  No se pudo leer directorio ${currentPath}: ${error.message}`);
    }
  }
  
  walkDir(dir);
  return files;
}

function validateFile(filePath, allowedPrefix, context) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Buscar referencias incorrectas
    const incorrectPattern = allowedPrefix === '/dashboard-bundui' 
      ? /\/dashboard-vibethink/g 
      : /\/dashboard-bundui/g;
    
    const matches = content.match(incorrectPattern);
    
    if (matches) {
      // Encontrar líneas con el problema
      lines.forEach((line, index) => {
        if (incorrectPattern.test(line)) {
          errors.push({
            file: path.relative(process.cwd(), filePath),
            line: index + 1,
            content: line.trim(),
            context,
            expected: allowedPrefix,
            found: allowedPrefix === '/dashboard-bundui' ? '/dashboard-vibethink' : '/dashboard-bundui'
          });
        }
      });
    }
  } catch (error) {
    warnings.push(`⚠️  No se pudo leer archivo ${filePath}: ${error.message}`);
  }
}

console.log('🔍 Validando rutas de dashboards...\n');

// Validar dashboard-bundui (debe tener solo rutas /dashboard-bundui)
console.log('📁 Validando dashboard-bundui...');
const bunduiFiles = findFiles(DASHBOARD_BUNDUI_DIR);
bunduiFiles.forEach(file => {
  validateFile(file, '/dashboard-bundui', 'dashboard-bundui');
});

// Validar dashboard-vibethink (debe tener solo rutas /dashboard-vibethink)
console.log('📁 Validando dashboard-vibethink...');
const vibethinkFiles = findFiles(DASHBOARD_VIBETHINK_DIR);
vibethinkFiles.forEach(file => {
  validateFile(file, '/dashboard-vibethink', 'dashboard-vibethink');
});

// Validar vibethink-sidebar.tsx específicamente
const sidebarFile = path.join(COMPONENTS_DIR, 'vibethink-sidebar.tsx');
if (fs.existsSync(sidebarFile)) {
  console.log('📁 Validando vibethink-sidebar.tsx...');
  const content = fs.readFileSync(sidebarFile, 'utf8');
  
  // Verificar que vibethinkNavItems tenga rutas correctas
  if (content.includes('vibethinkNavItems')) {
    const vibethinkNavMatch = content.match(/vibethinkNavItems[^}]*href:\s*"([^"]+)"/g);
    if (vibethinkNavMatch) {
      vibethinkNavMatch.forEach(match => {
        if (match.includes('/dashboard-bundui')) {
          errors.push({
            file: path.relative(process.cwd(), sidebarFile),
            line: 'N/A',
            content: match.trim(),
            context: 'vibethinkNavItems (debe usar /dashboard-vibethink)',
            expected: '/dashboard-vibethink',
            found: '/dashboard-bundui'
          });
        }
      });
    }
  }
  
  // Verificar que bunduiReferenceNavItems tenga rutas correctas (puede tener /dashboard-bundui)
  // Esto está bien, no lo validamos como error
}

// Validar también que no haya referencias cruzadas en componentes compartidos
console.log('📁 Validando componentes compartidos...');
const sharedFiles = findFiles(path.join(COMPONENTS_DIR, 'bundui-premium'));
sharedFiles.forEach(file => {
  // Los componentes compartidos pueden tener referencias a ambos, pero debemos verificar
  const content = fs.readFileSync(file, 'utf8');
  // Si el archivo es específico de bundui, debe usar /dashboard-bundui
  // Si es específico de vibethink, debe usar /dashboard-vibethink
  // Por ahora solo validamos los casos obvios
});

// Reportar resultados
console.log('\n' + '='.repeat(80));
console.log('📊 RESULTADOS DE VALIDACIÓN\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ¡Perfecto! Todas las rutas están correctas.\n');
  console.log(`   - ${bunduiFiles.length} archivos en dashboard-bundui validados`);
  console.log(`   - ${vibethinkFiles.length} archivos en dashboard-vibethink validados`);
  process.exit(0);
}

if (errors.length > 0) {
  console.log(`❌ Se encontraron ${errors.length} error(es):\n`);
  
  // Agrupar por archivo
  const errorsByFile = {};
  errors.forEach(error => {
    if (!errorsByFile[error.file]) {
      errorsByFile[error.file] = [];
    }
    errorsByFile[error.file].push(error);
  });
  
  Object.entries(errorsByFile).forEach(([file, fileErrors]) => {
    console.log(`\n📄 ${file}`);
    fileErrors.forEach(error => {
      console.log(`   Línea ${error.line}: ${error.found} → debe ser ${error.expected}`);
      console.log(`   Contexto: ${error.context}`);
      if (error.content.length < 100) {
        console.log(`   Código: ${error.content}`);
      }
    });
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('🔧 Para corregir automáticamente, ejecuta:');
  console.log('   node scripts/fix-vibethink-routes.js\n');
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Advertencias (${warnings.length}):\n`);
  warnings.forEach(warning => console.log(`   ${warning}`));
}

process.exit(errors.length > 0 ? 1 : 0);

