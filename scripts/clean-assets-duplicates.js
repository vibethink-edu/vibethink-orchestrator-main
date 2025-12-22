/**
 * Limpiar duplicados de assets
 * 
 * Elimina duplicados y actualiza referencias para usar la versión correcta
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../apps/dashboard/public/assets/images');

/**
 * Limpiar duplicados
 * 
 * Estrategia: Mantener los archivos en avatars/ y eliminar duplicados en raíz
 */
function cleanDuplicates() {
  console.log('\n🧹 LIMPIANDO DUPLICADOS DE ASSETS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const rootFiles = fs.readdirSync(ASSETS_DIR)
    .filter(file => {
      const filePath = path.join(ASSETS_DIR, file);
      return fs.statSync(filePath).isFile() && file.match(/\.(png|jpg|jpeg)$/);
    });

  const avatarsDir = path.join(ASSETS_DIR, 'avatars');
  const avatarFiles = fs.existsSync(avatarsDir) 
    ? fs.readdirSync(avatarsDir)
    : [];

  console.log(`📁 Archivos en raíz: ${rootFiles.length}`);
  console.log(`📁 Archivos en avatars/: ${avatarFiles.length}\n`);

  // Eliminar duplicados en raíz (mantener solo avatars/)
  let deleted = 0;
  rootFiles.forEach(file => {
    if (avatarFiles.includes(file)) {
      const filePath = path.join(ASSETS_DIR, file);
      console.log(`   🗑️  Eliminando duplicado: ${file}`);
      fs.unlinkSync(filePath);
      deleted++;
    }
  });

  console.log(`\n   ✅ ${deleted} duplicados eliminados\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return deleted;
}

// Run
const deleted = cleanDuplicates();

if (deleted > 0) {
  console.log('✅ Limpieza completada\n');
  console.log('🔧 PRÓXIMO PASO:\n');
  console.log('   Ejecutar validación nuevamente:');
  console.log('   node scripts/validate-assets-duplicates.js\n');
} else {
  console.log('✅ No hay duplicados para limpiar\n');
}

process.exit(0);






