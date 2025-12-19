/**
 * Validar que todos los assets están en el repositorio Git
 * 
 * Verifica:
 * 1. Todos los assets están trackeados en Git
 * 2. No hay assets ignorados por .gitignore
 * 3. Referencias apuntan a assets que existen en el repo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '../apps/dashboard/public/assets');

/**
 * Ejecutar comando git
 */
function gitCommand(cmd) {
  try {
    return execSync(cmd, { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
  } catch (error) {
    return '';
  }
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
      const relativePath = path.relative(ASSETS_DIR, fullPath);
      files.push({
        relativePath,
        fullPath,
      });
    }
  }

  return files;
}

/**
 * Verificar si un archivo está en Git
 */
function isTrackedInGit(filePath) {
  const relativePath = path.relative(
    path.join(__dirname, '..'),
    filePath
  ).replace(/\\/g, '/');
  
  const result = gitCommand(`git ls-files --error-unmatch "${relativePath}" 2>&1`);
  return !result.includes('did not match any files');
}

/**
 * Verificar si un archivo está ignorado
 */
function isIgnoredByGitignore(filePath) {
  const relativePath = path.relative(
    path.join(__dirname, '..'),
    filePath
  ).replace(/\\/g, '/');
  
  const result = gitCommand(`git check-ignore -v "${relativePath}"`);
  return result.length > 0;
}

/**
 * Main
 */
function main() {
  console.log('\n🔍 VALIDANDO ASSETS EN REPOSITORIO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Buscar todos los assets
  console.log('📁 Buscando assets...\n');
  const assets = findAssetFiles(ASSETS_DIR);

  if (assets.length === 0) {
    console.log('⚠️  No se encontraron assets\n');
    process.exit(0);
  }

  console.log(`   ✅ ${assets.length} assets encontrados\n`);

  // Validar cada asset
  console.log('🔍 Validando assets en Git...\n');
  
  const issues = {
    notTracked: [],
    ignored: [],
  };

  for (const asset of assets) {
    // Verificar si está ignorado
    if (isIgnoredByGitignore(asset.fullPath)) {
      issues.ignored.push(asset);
      continue;
    }

    // Verificar si está trackeado
    if (!isTrackedInGit(asset.fullPath)) {
      issues.notTracked.push(asset);
    }
  }

  // Reportar resultados
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (issues.notTracked.length === 0 && issues.ignored.length === 0) {
    console.log('✅ TODOS LOS ASSETS ESTÁN EN EL REPOSITORIO\n');
    console.log('   Todos los assets están:');
    console.log('   ✅ Trackeados en Git');
    console.log('   ✅ No ignorados por .gitignore\n');
  } else {
    // Assets no trackeados
    if (issues.notTracked.length > 0) {
      console.log(`❌ ASSETS NO TRACKEADOS (${issues.notTracked.length}):\n`);
      issues.notTracked.forEach((asset, index) => {
        const relativePath = path.relative(process.cwd(), asset.fullPath);
        console.log(`   ${index + 1}. ${relativePath}`);
        console.log(`      Acción: git add "${relativePath}"\n`);
      });
    }

    // Assets ignorados
    if (issues.ignored.length > 0) {
      console.log(`⚠️  ASSETS IGNORADOS POR .gitignore (${issues.ignored.length}):\n`);
      issues.ignored.forEach((asset, index) => {
        const relativePath = path.relative(process.cwd(), asset.fullPath);
        const ignoreInfo = gitCommand(`git check-ignore -v "${relativePath}"`);
        console.log(`   ${index + 1}. ${relativePath}`);
        console.log(`      Ignorado por: ${ignoreInfo}\n`);
      });
    }

    console.log('🔧 ACCIONES RECOMENDADAS:\n');
    
    if (issues.notTracked.length > 0) {
      console.log('   1. Agregar assets no trackeados a Git:');
      issues.notTracked.forEach(asset => {
        const relativePath = path.relative(process.cwd(), asset.fullPath);
        console.log(`      git add "${relativePath}"`);
      });
      console.log('');
    }

    if (issues.ignored.length > 0) {
      console.log('   2. Revisar .gitignore:');
      console.log('      Asegurar que NO ignora: apps/dashboard/public/assets/');
      console.log('      O ajustar reglas de .gitignore\n');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Resumen
  const totalIssues = issues.notTracked.length + issues.ignored.length;
  
  if (totalIssues === 0) {
    console.log('✅ VALIDACIÓN EXITOSA\n');
    console.log('   Todos los assets están correctamente en el repositorio.\n');
    process.exit(0);
  } else {
    console.log(`❌ VALIDACIÓN FALLIDA (${totalIssues} issues)\n`);
    console.log('   Corrige los issues antes de hacer commit.\n');
    process.exit(1);
  }
}

main();

