/**
 * Migrar assets a repositorio centralizado
 * 
 * Migra: apps/dashboard/public/images/ → apps/dashboard/public/assets/images/
 * Actualiza todas las referencias en código
 */

const fs = require('fs');
const path = require('path');

const OLD_ASSETS_DIR = path.join(__dirname, '../apps/dashboard/public/images');
const NEW_ASSETS_DIR = path.join(__dirname, '../apps/dashboard/public/assets/images');

/**
 * Copiar directorio recursivamente
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    return false;
  }

  // Crear directorio destino si no existe
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  return true;
}

/**
 * Reemplazar referencias en archivos
 */
function replaceInFile(filePath, oldPattern, newPattern) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Reemplazar /images/ por /assets/images/
  content = content.replace(/\/images\//g, '/assets/images/');
  content = content.replace(/\/images"/g, '/assets/images"');
  content = content.replace(/\/images'/g, '/assets/images\'');
  content = content.replace(/\/images`/g, '/assets/images`');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

/**
 * Buscar archivos TypeScript/TSX para actualizar referencias
 */
function updateReferencesInDirectory(dir) {
  let filesUpdated = 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignorar node_modules y .next
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      filesUpdated += updateReferencesInDirectory(fullPath);
    } else if (entry.name.match(/\.(tsx?|jsx?|json|md)$/)) {
      if (replaceInFile(fullPath)) {
        filesUpdated++;
        console.log(`   ✅ Actualizado: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }

  return filesUpdated;
}

/**
 * Main
 */
function main() {
  console.log('\n🚀 MIGRACIÓN DE ASSETS A REPOSITORIO CENTRALIZADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Paso 1: Verificar que existe el directorio antiguo
  if (!fs.existsSync(OLD_ASSETS_DIR)) {
    console.log('❌ ERROR: Directorio antiguo no encontrado:');
    console.log(`   ${OLD_ASSETS_DIR}\n`);
    process.exit(1);
  }

  // Paso 2: Copiar assets al nuevo directorio
  console.log('📁 Copiando assets...');
  console.log(`   De: ${path.relative(process.cwd(), OLD_ASSETS_DIR)}`);
  console.log(`   A:  ${path.relative(process.cwd(), NEW_ASSETS_DIR)}\n`);

  const copied = copyDirectory(OLD_ASSETS_DIR, NEW_ASSETS_DIR);

  if (!copied) {
    console.log('❌ ERROR: No se pudieron copiar los assets\n');
    process.exit(1);
  }

  console.log('   ✅ Assets copiados exitosamente\n');

  // Paso 3: Actualizar referencias en código
  console.log('🔄 Actualizando referencias en código...');
  console.log('   /images/ → /assets/images/\n');

  const appDir = path.join(__dirname, '../apps/dashboard/app');
  const srcDir = path.join(__dirname, '../apps/dashboard/src');

  let totalUpdated = 0;

  if (fs.existsSync(appDir)) {
    console.log('   Buscando en apps/dashboard/app...');
    totalUpdated += updateReferencesInDirectory(appDir);
  }

  if (fs.existsSync(srcDir)) {
    console.log('   Buscando en apps/dashboard/src...');
    totalUpdated += updateReferencesInDirectory(srcDir);
  }

  console.log(`\n   ✅ ${totalUpdated} archivos actualizados\n`);

  // Paso 4: Resumen
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 RESUMEN:\n');
  console.log('   ✅ Assets migrados a repositorio centralizado');
  console.log(`   ✅ ${totalUpdated} archivos actualizados`);
  console.log('   📁 Nuevo directorio: apps/dashboard/public/assets/images/\n');

  console.log('🔧 PRÓXIMOS PASOS:\n');
  console.log('   1. Verificar que todo funciona:');
  console.log('      npm run dev:dashboard\n');
  console.log('   2. Probar algunas imágenes:');
  console.log('      http://localhost:3005/assets/images/avatars/01.png\n');
  console.log('   3. Eliminar directorio antiguo (después de verificar):');
  console.log('      # Solo hacerlo si todo funciona correctamente');
  console.log('      # rm -rf apps/dashboard/public/images\n');
  console.log('   4. Commit:');
  console.log('      git add apps/dashboard/public/assets');
  console.log('      git add apps/dashboard/app');
  console.log('      git add apps/dashboard/src');
  console.log('      git commit -m "feat: Centralizar assets en repositorio único"\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();


