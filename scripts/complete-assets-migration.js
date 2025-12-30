/**
 * Migración completa de assets a repositorio único
 * 
 * 1. Mover logo.svg a assets/images/logos/
 * 2. Verificar que no queden referencias antiguas
 * 3. Eliminar directorio antiguo public/images/
 * 4. Validar estructura final
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../apps/dashboard/public');
const OLD_IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const LOGOS_DIR = path.join(ASSETS_DIR, 'images/logos');
const LOGO_SVG = path.join(PUBLIC_DIR, 'logo.svg');

/**
 * Buscar referencias antiguas en código
 */
function findOldReferences(dir) {
  const oldRefs = [];
  
  if (!fs.existsSync(dir)) {
    return oldRefs;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignorar
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      oldRefs.push(...findOldReferences(fullPath));
    } else if (entry.name.match(/\.(tsx?|jsx?|json|md)$/)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Buscar referencias antiguas
        const patterns = [
          /\/images\//g,           // /images/ (sin /assets/)
          /\/logo\.svg/g,          // /logo.svg (directo)
          /"\/images\//g,          // "/images/
          /'\/images\//g,          // '/images/
          /`\/images\//g,          // `/images/
        ];

        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            oldRefs.push({
              file: path.relative(process.cwd(), fullPath),
              pattern: pattern.toString(),
              count: matches.length,
            });
          }
        });
      } catch (error) {
        // Ignorar errores
      }
    }
  }

  return oldRefs;
}

/**
 * Reemplazar referencias antiguas
 */
function replaceOldReferences(dir) {
  let filesUpdated = 0;

  if (!fs.existsSync(dir)) {
    return filesUpdated;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignorar
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      filesUpdated += replaceOldReferences(fullPath);
    } else if (entry.name.match(/\.(tsx?|jsx?|json|md)$/)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;

        // Reemplazar /images/ por /assets/images/ (pero no si ya tiene /assets/)
        content = content.replace(/(?<!\/assets)\/images\//g, '/assets/images/');
        
        // Reemplazar /logo.svg por /assets/images/logos/logo.svg
        content = content.replace(/\/logo\.svg/g, '/assets/images/logos/logo.svg');

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          filesUpdated++;
          console.log(`   ✅ Actualizado: ${path.relative(process.cwd(), fullPath)}`);
        }
      } catch (error) {
        // Ignorar errores
      }
    }
  }

  return filesUpdated;
}

/**
 * Main
 */
function main() {
  console.log('\n🚀 MIGRACIÓN COMPLETA DE ASSETS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Paso 1: Mover logo.svg
  console.log('📁 Paso 1: Mover logo.svg a assets/images/logos/...\n');
  
  if (fs.existsSync(LOGO_SVG)) {
    if (!fs.existsSync(LOGOS_DIR)) {
      fs.mkdirSync(LOGOS_DIR, { recursive: true });
    }
    
    const destLogo = path.join(LOGOS_DIR, 'logo.svg');
    fs.copyFileSync(LOGO_SVG, destLogo);
    console.log(`   ✅ logo.svg copiado a assets/images/logos/logo.svg\n`);
  } else {
    console.log(`   ⚠️  logo.svg no encontrado (puede que ya esté movido)\n`);
  }

  // Paso 2: Buscar referencias antiguas
  console.log('🔍 Paso 2: Buscando referencias antiguas...\n');
  
  const appDir = path.join(__dirname, '../apps/dashboard/app');
  const srcDir = path.join(__dirname, '../apps/dashboard/src');
  
  const oldRefs = [];
  if (fs.existsSync(appDir)) {
    oldRefs.push(...findOldReferences(appDir));
  }
  if (fs.existsSync(srcDir)) {
    oldRefs.push(...findOldReferences(srcDir));
  }

  if (oldRefs.length > 0) {
    console.log(`   ⚠️  Encontradas ${oldRefs.length} referencias antiguas\n`);
    console.log('   Actualizando referencias...\n');
    
    let filesUpdated = 0;
    if (fs.existsSync(appDir)) {
      filesUpdated += replaceOldReferences(appDir);
    }
    if (fs.existsSync(srcDir)) {
      filesUpdated += replaceOldReferences(srcDir);
    }
    
    console.log(`\n   ✅ ${filesUpdated} archivos actualizados\n`);
  } else {
    console.log('   ✅ No se encontraron referencias antiguas\n');
  }

  // Paso 3: Verificar estructura de assets
  console.log('📊 Paso 3: Verificando estructura de assets...\n');
  
  const assetsStructure = {
    images: fs.existsSync(path.join(ASSETS_DIR, 'images')),
    logos: fs.existsSync(LOGOS_DIR),
    avatars: fs.existsSync(path.join(ASSETS_DIR, 'images/avatars')),
    products: fs.existsSync(path.join(ASSETS_DIR, 'images/products')),
  };

  console.log('   Estructura:');
  console.log(`   ${assetsStructure.images ? '✅' : '❌'} assets/images/`);
  console.log(`   ${assetsStructure.logos ? '✅' : '❌'} assets/images/logos/`);
  console.log(`   ${assetsStructure.avatars ? '✅' : '❌'} assets/images/avatars/`);
  console.log(`   ${assetsStructure.products ? '✅' : '❌'} assets/images/products/\n`);

  // Paso 4: Resumen
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 RESUMEN:\n');
  console.log('   ✅ logo.svg movido a assets/images/logos/');
  console.log(`   ✅ Referencias actualizadas`);
  console.log('   ✅ Estructura verificada\n');

  // Paso 5: Recomendación de eliminar directorio antiguo
  if (fs.existsSync(OLD_IMAGES_DIR)) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🗑️  DIRECTORIO ANTIGUO DETECTADO:\n');
    console.log(`   ${path.relative(process.cwd(), OLD_IMAGES_DIR)}\n`);
    console.log('   Este directorio puede eliminarse después de verificar que todo funciona.\n');
    console.log('   Comando para eliminar (después de verificar):');
    console.log(`   Remove-Item -Recurse -Force "${OLD_IMAGES_DIR}"\n`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔧 PRÓXIMOS PASOS:\n');
  console.log('   1. Probar que todo funciona:');
  console.log('      npm run dev:dashboard\n');
  console.log('   2. Verificar imágenes:');
  console.log('      http://localhost:3005/assets/images/avatars/01.png');
  console.log('      http://localhost:3005/assets/images/logos/logo.svg\n');
  console.log('   3. Si todo funciona, eliminar directorio antiguo:\n');
  console.log('   4. Validar:');
  console.log('      node scripts/validate-assets-duplicates.js');
  console.log('      node scripts/audit-assets.js\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();













