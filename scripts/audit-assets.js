/**
 * Auditoría completa de assets
 * 
 * Genera reporte completo de:
 * - Assets existentes
 * - Referencias en código
 * - Assets sin usar
 * - Assets referenciados que no existen
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../apps/dashboard/public/assets');
const APP_DIR = path.join(__dirname, '../apps/dashboard/app');
const SRC_DIR = path.join(__dirname, '../apps/dashboard/src');

/**
 * Buscar todos los archivos de assets
 */
function findAssetFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findAssetFiles(fullPath));
    } else if (entry.name.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
      const relativePath = path.relative(dir, fullPath);
      const stats = fs.statSync(fullPath);
      files.push({
        path: relativePath,
        fullPath,
        size: stats.size,
        modified: stats.mtime,
      });
    }
  }

  return files;
}

/**
 * Buscar referencias a assets en código
 */
function findAssetReferences(dir) {
  const references = new Set();

  if (!fs.existsSync(dir)) {
    return references;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignorar
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      findAssetReferences(fullPath).forEach(ref => references.add(ref));
    } else if (entry.name.match(/\.(tsx?|jsx?)$/)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Buscar referencias a /assets/images/ o /images/
        const matches = content.matchAll(/(\/assets\/images\/[^"'\s`\)]+|"\/images\/[^"'\s`\)]+)/g);
        
        for (const match of matches) {
          let ref = match[1];
          // Normalizar a /assets/images/
          if (ref.startsWith('/images/')) {
            ref = ref.replace('/images/', '/assets/images/');
          }
          references.add(ref);
        }
      } catch (error) {
        // Ignorar errores de lectura
      }
    }
  }

  return references;
}

/**
 * Main
 */
function main() {
  console.log('\n📊 AUDITORÍA COMPLETA DE ASSETS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Encontrar todos los assets
  console.log('📁 Buscando assets...\n');
  const assets = findAssetFiles(ASSETS_DIR);
  console.log(`   ✅ ${assets.length} assets encontrados\n`);

  // 2. Encontrar todas las referencias
  console.log('🔍 Buscando referencias en código...\n');
  const references = findAssetReferences(APP_DIR);
  const srcReferences = findAssetReferences(SRC_DIR);
  srcReferences.forEach(ref => references.add(ref));
  
  console.log(`   ✅ ${references.size} referencias encontradas\n`);

  // 3. Analizar
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 ANÁLISIS:\n');

  // Assets sin usar
  const unusedAssets = assets.filter(asset => {
    const assetUrl = `/assets/images/${asset.path.replace(/\\/g, '/')}`;
    return !Array.from(references).some(ref => ref.includes(asset.path));
  });

  // Referencias a assets que no existen
  const missingAssets = Array.from(references).filter(ref => {
    const assetPath = ref.replace('/assets/images/', '').replace('/images/', '');
    return !assets.some(asset => asset.path === assetPath);
  });

  // Reportar
  console.log(`   📁 Total assets: ${assets.length}`);
  console.log(`   🔗 Total referencias: ${references.size}`);
  console.log(`   ❌ Assets sin usar: ${unusedAssets.length}`);
  console.log(`   ⚠️  Referencias rotas: ${missingAssets.length}\n`);

  // Detalles
  if (unusedAssets.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('❌ ASSETS SIN USAR:\n');
    unusedAssets.slice(0, 20).forEach((asset, index) => {
      const sizeKB = (asset.size / 1024).toFixed(2);
      console.log(`   ${index + 1}. ${asset.path} (${sizeKB} KB)`);
    });
    if (unusedAssets.length > 20) {
      console.log(`   ... y ${unusedAssets.length - 20} más\n`);
    } else {
      console.log('');
    }
  }

  if (missingAssets.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  REFERENCIAS A ASSETS QUE NO EXISTEN:\n');
    missingAssets.slice(0, 20).forEach((ref, index) => {
      console.log(`   ${index + 1}. ${ref}`);
    });
    if (missingAssets.length > 20) {
      console.log(`   ... y ${missingAssets.length - 20} más\n`);
    } else {
      console.log('');
    }
  }

  // Resumen final
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 RESUMEN:\n');

  if (unusedAssets.length === 0 && missingAssets.length === 0) {
    console.log('   ✅ Todo está en orden:\n');
    console.log('      - No hay assets sin usar');
    console.log('      - No hay referencias rotas\n');
  } else {
    console.log('   ⚠️  Acciones recomendadas:\n');
    
    if (unusedAssets.length > 0) {
      console.log(`      - Revisar ${unusedAssets.length} assets sin usar`);
      console.log('        (Considerar eliminarlos si no se necesitan)\n');
    }
    
    if (missingAssets.length > 0) {
      console.log(`      - Corregir ${missingAssets.length} referencias rotas`);
      console.log('        (Agregar assets faltantes o corregir referencias)\n');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(unusedAssets.length > 0 || missingAssets.length > 0 ? 1 : 0);
}

main();













