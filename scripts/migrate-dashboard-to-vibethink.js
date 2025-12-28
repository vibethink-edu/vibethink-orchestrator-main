/**
 * Migrar dashboard de Bundui a VibeThink
 * 
 * IMPORTANTE: Bundui y VibeThink son AUTÓNOMOS
 * - NO hay dependencia entre ellos
 * - Cada uno tiene su propio sidebar
 * - Cada uno tiene sus propias rutas
 * - Esta migración es INDEPENDIENTE (copiar y adaptar)
 */

const fs = require('fs');
const path = require('path');

// Configuración
const BUNDUI_BASE = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const VIBETHINK_BASE = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');

/**
 * Copiar directorio recursivamente
 */
function copyDirectory(src, dest) {
  // Crear directorio destino si no existe
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Leer contenido del directorio
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursivo para subdirectorios
      copyDirectory(srcPath, destPath);
    } else {
      // Copiar archivo
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Reemplazar todas las rutas en un archivo
 */
function replaceRoutesInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar rutas
  const originalContent = content;
  content = content.replace(/\/dashboard-bundui\//g, '/dashboard-vibethink/');
  content = content.replace(/\/dashboard-bundui"/g, '/dashboard-vibethink"');
  content = content.replace(/\/dashboard-bundui'/g, '/dashboard-vibethink\'');
  content = content.replace(/\/dashboard-bundui`/g, '/dashboard-vibethink`');
  
  // Solo escribir si hubo cambios
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

/**
 * Reemplazar rutas en todos los archivos del directorio
 */
function replaceRoutesInDirectory(dir) {
  let filesChanged = 0;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursivo
      filesChanged += replaceRoutesInDirectory(fullPath);
    } else if (entry.name.match(/\.(tsx?|jsx?|json|md)$/)) {
      // Solo archivos relevantes
      if (replaceRoutesInFile(fullPath)) {
        filesChanged++;
      }
    }
  }
  
  return filesChanged;
}

/**
 * Migrar un dashboard
 */
function migrateDashboard(dashboardName) {
  console.log(`\n🚀 Migrando: ${dashboardName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const srcPath = path.join(BUNDUI_BASE, dashboardName);
  const destPath = path.join(VIBETHINK_BASE, dashboardName);

  // Validar que existe en Bundui
  if (!fs.existsSync(srcPath)) {
    console.log(`❌ ERROR: ${dashboardName} no existe en dashboard-bundui\n`);
    return false;
  }

  // Validar que NO existe en VibeThink (evitar sobrescribir)
  if (fs.existsSync(destPath)) {
    console.log(`⚠️ ADVERTENCIA: ${dashboardName} ya existe en dashboard-vibethink`);
    console.log(`   Omitiendo migración (evitar sobrescribir)\n`);
    return false;
  }

  // Paso 1: Copiar
  console.log(`📁 Copiando estructura...`);
  copyDirectory(srcPath, destPath);
  console.log(`   ✅ Copiado exitoso\n`);

  // Paso 2: Reemplazar rutas
  console.log(`🔄 Adaptando rutas (/dashboard-bundui/ → /dashboard-vibethink/)...`);
  const filesChanged = replaceRoutesInDirectory(destPath);
  console.log(`   ✅ ${filesChanged} archivos actualizados\n`);

  // Resumen
  console.log(`✅ Migración completa: ${dashboardName}`);
  console.log(`   De:   apps/dashboard/app/dashboard-bundui/${dashboardName}`);
  console.log(`   A:    apps/dashboard/app/dashboard-vibethink/${dashboardName}`);
  console.log(`   URL:  http://localhost:3005/dashboard-vibethink/${dashboardName}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return true;
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\n❌ ERROR: Debes especificar el dashboard a migrar\n');
    console.log('Uso:');
    console.log('   node scripts/migrate-dashboard-to-vibethink.js <dashboard-name>');
    console.log('   node scripts/migrate-dashboard-to-vibethink.js --batch <d1> <d2> <d3>...\n');
    console.log('Ejemplos:');
    console.log('   node scripts/migrate-dashboard-to-vibethink.js default');
    console.log('   node scripts/migrate-dashboard-to-vibethink.js --batch default academy analytics\n');
    process.exit(1);
  }

  // Batch mode
  if (args[0] === '--batch') {
    const dashboards = args.slice(1);
    
    console.log('\n🚀 MIGRACIÓN EN BATCH');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📊 Dashboards a migrar: ${dashboards.length}\n`);
    
    let success = 0;
    let failed = 0;

    for (const dashboard of dashboards) {
      if (migrateDashboard(dashboard)) {
        success++;
      } else {
        failed++;
      }
    }

    console.log('\n📊 RESUMEN BATCH:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   ✅ Exitosos: ${success}`);
    console.log(`   ❌ Fallidos:  ${failed}`);
    console.log(`   📊 Total:     ${dashboards.length}\n`);

    if (success > 0) {
      console.log('🔧 PRÓXIMOS PASOS:\n');
      console.log('   1. Actualizar sidebar de VibeThink:');
      console.log('      - Editar: apps/dashboard/src/components/vibethink-sidebar.tsx');
      console.log('      - Agregar nuevos dashboards al array de navegación\n');
      console.log('   2. Probar dashboards:');
      console.log('      npm run dev:dashboard');
      dashboards.forEach(d => {
        console.log(`      http://localhost:3005/dashboard-vibethink/${d}`);
      });
      console.log('\n   3. Commit:');
      console.log('      git add apps/dashboard/app/dashboard-vibethink');
      console.log(`      git commit -m "feat(vibethink): Agregar ${success} dashboards - ${dashboards.join(', ')}"`);
      console.log('\n');
    }

    process.exit(failed > 0 ? 1 : 0);
  }

  // Single mode
  const dashboardName = args[0];
  const success = migrateDashboard(dashboardName);

  if (success) {
    console.log('🔧 PRÓXIMOS PASOS:\n');
    console.log('   1. Actualizar sidebar de VibeThink');
    console.log('   2. Probar dashboard:');
    console.log(`      http://localhost:3005/dashboard-vibethink/${dashboardName}`);
    console.log('   3. Commit cambios\n');
  }

  process.exit(success ? 0 : 1);
}

// Run
main();














