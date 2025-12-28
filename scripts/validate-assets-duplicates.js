/**
 * Validar duplicados de assets
 * 
 * Busca assets duplicados en el repositorio
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ASSETS_DIR = path.join(__dirname, '../apps/dashboard/public/assets');

/**
 * Calcular hash MD5 de un archivo
 */
function getFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

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
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Main
 */
function main() {
  console.log('\n🔍 VALIDANDO DUPLICADOS DE ASSETS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Buscar todos los assets
  console.log('📁 Buscando assets...\n');
  const files = findAssetFiles(ASSETS_DIR);

  if (files.length === 0) {
    console.log('⚠️ No se encontraron assets\n');
    process.exit(0);
  }

  console.log(`   ✅ ${files.length} archivos encontrados\n`);

  // Calcular hashes
  console.log('🔢 Calculando hashes...\n');
  const hashMap = new Map();
  const duplicates = [];

  for (const file of files) {
    try {
      const hash = getFileHash(file);
      const relativePath = path.relative(ASSETS_DIR, file);

      if (hashMap.has(hash)) {
        // Duplicado encontrado
        duplicates.push({
          hash,
          original: hashMap.get(hash),
          duplicate: relativePath,
        });
      } else {
        hashMap.set(hash, relativePath);
      }
    } catch (error) {
      console.log(`   ⚠️ Error procesando ${file}: ${error.message}`);
    }
  }

  // Reportar resultados
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (duplicates.length === 0) {
    console.log('✅ NO se encontraron duplicados\n');
    console.log('   Todos los assets son únicos.\n');
  } else {
    console.log(`❌ Se encontraron ${duplicates.length} duplicados:\n`);

    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. Hash: ${dup.hash.substring(0, 8)}...`);
      console.log(`   Original:  ${dup.original}`);
      console.log(`   Duplicado: ${dup.duplicate}`);
      console.log(`   Acción: Eliminar duplicado y actualizar referencias\n`);
    });

    console.log('🔧 RECOMENDACIÓN:\n');
    console.log('   1. Identificar cuál versión usar (original)');
    console.log('   2. Actualizar referencias al duplicado para usar el original');
    console.log('   3. Eliminar archivos duplicados');
    console.log('   4. Ejecutar este script nuevamente para verificar\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(duplicates.length > 0 ? 1 : 0);
}

main();














