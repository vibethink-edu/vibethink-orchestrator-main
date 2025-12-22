#!/usr/bin/env node

/**
 * Script de Validación de Todos los Módulos Migrados
 * 
 * Lee module-registry.ts y ejecuta validaciones para cada módulo migrado
 * según las normas de I18N_TERMINOLOGY_AI_FIRST.md
 * 
 * Uso:
 *   node scripts/validate-all-migrated-modules.js
 *   node scripts/validate-all-migrated-modules.js --fix
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Lee module-registry.ts y extrae módulos
 */
function getMigratedModules() {
  const registryPath = path.join(__dirname, '..', 'apps', 'dashboard', 'src', 'shared', 'data', 'module-registry.ts');
  
  if (!fs.existsSync(registryPath)) {
    log('❌ Error: module-registry.ts no encontrado', 'red');
    process.exit(1);
  }
  
  const content = fs.readFileSync(registryPath, 'utf8');
  
  // Extraer módulos del array moduleRegistry (parsing simplificado)
  const modules = [];
  const moduleMatches = content.matchAll(/id:\s*"([^"]+)",[\s\S]*?path:\s*"([^"]+)",[\s\S]*?i18nCoverage:\s*(\d+)/g);
  
  for (const match of moduleMatches) {
    const [, id, path, coverage] = match;
    modules.push({
      id,
      path,
      i18nCoverage: parseInt(coverage) || 0
    });
  }
  
  // También buscar módulos sin i18nCoverage
  const allModuleMatches = content.matchAll(/id:\s*"([^"]+)",[\s\S]*?path:\s*"([^"]+)"/g);
  const allModules = [];
  
  for (const match of allModuleMatches) {
    const [, id, path] = match;
    if (!modules.find(m => m.id === id)) {
      allModules.push({ id, path, i18nCoverage: 0 });
    }
  }
  
  return [...modules, ...allModules];
}

/**
 * Ejecuta validación para un módulo
 */
function validateModule(module) {
  const results = {
    boundaries: { success: false, output: '' },
    terminology: { success: false, output: '' },
    hardcoded: { success: false, output: '' }
  };
  
  // Extraer nombre del módulo del path
  const moduleName = module.path.split('/').pop();
  
  log(`\n📦 Validando: ${module.id} (${moduleName})`, 'cyan');
  
  // 1. Boundaries
  try {
    const output = execSync(`node scripts/validate-import-boundaries.js`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.resolve(__dirname, '..')
    });
    results.boundaries = { success: true, output };
  } catch (error) {
    results.boundaries = { success: false, output: error.stdout || error.message };
  }
  
  // 2. Terminology
  try {
    const output = execSync(`node scripts/validate-terminology-usage.js`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.resolve(__dirname, '..')
    });
    results.terminology = { success: true, output };
  } catch (error) {
    results.terminology = { success: false, output: error.stdout || error.message };
  }
  
  // 3. Hardcoded (solo si tiene namespace)
  if (module.i18nCoverage > 0 || module.path.includes('dashboard-bundui')) {
    try {
      const namespace = moduleName || 'common';
      const modulePath = `apps/dashboard/app${module.path}`;
      
      if (fs.existsSync(path.resolve(__dirname, '..', modulePath))) {
        const output = execSync(
          `node scripts/detect-hardcoded-strings-by-component.js --module ${modulePath} --namespace ${namespace} --all-components`,
          {
            encoding: 'utf8',
            stdio: 'pipe',
            cwd: path.resolve(__dirname, '..')
          }
        );
        results.hardcoded = { success: !output.includes('strings hardcoded'), output };
      }
    } catch (error) {
      results.hardcoded = { success: false, output: error.stdout || error.message };
    }
  }
  
  return results;
}

/**
 * Genera reporte consolidado
 */
function generateReport(modules, results) {
  log('\n' + '═'.repeat(70), 'magenta');
  log('📊 REPORTE CONSOLIDADO - MÓDULOS MIGRADOS', 'magenta');
  log('═'.repeat(70), 'magenta');
  
  const critical = [];
  const warnings = [];
  const ok = [];
  
  modules.forEach((module, index) => {
    const result = results[index];
    const issues = [];
    
    if (!result.boundaries.success) issues.push('Boundaries');
    if (!result.terminology.success) issues.push('Terminology');
    if (!result.hardcoded.success) issues.push('Hardcoded');
    
    const status = {
      module,
      issues,
      i18nCoverage: module.i18nCoverage
    };
    
    if (issues.length > 0 || module.i18nCoverage === 0) {
      if (module.i18nCoverage === 0) {
        critical.push(status);
      } else {
        warnings.push(status);
      }
    } else {
      ok.push(status);
    }
  });
  
  // Críticos
  if (critical.length > 0) {
    log('\n🔴 MÓDULOS CRÍTICOS (0% i18n o violaciones):', 'red');
    critical.forEach(({ module, issues, i18nCoverage }) => {
      log(`   ${module.id}`, 'red');
      log(`      i18n: ${i18nCoverage}%`, 'yellow');
      if (issues.length > 0) {
        log(`      Violaciones: ${issues.join(', ')}`, 'yellow');
      }
    });
  }
  
  // Advertencias
  if (warnings.length > 0) {
    log('\n⚠️  MÓDULOS CON ADVERTENCIAS:', 'yellow');
    warnings.forEach(({ module, issues, i18nCoverage }) => {
      log(`   ${module.id}`, 'yellow');
      log(`      i18n: ${i18nCoverage}%`, 'yellow');
      if (issues.length > 0) {
        log(`      Violaciones: ${issues.join(', ')}`, 'yellow');
      }
    });
  }
  
  // OK
  if (ok.length > 0) {
    log('\n✅ MÓDULOS CUMPLEN NORMAS:', 'green');
    ok.forEach(({ module, i18nCoverage }) => {
      log(`   ${module.id} (i18n: ${i18nCoverage}%)`, 'green');
    });
  }
  
  // Resumen
  log('\n' + '═'.repeat(70), 'magenta');
  log(`Total: ${modules.length} módulos`, 'cyan');
  log(`✅ OK: ${ok.length}`, 'green');
  log(`⚠️  Advertencias: ${warnings.length}`, 'yellow');
  log(`🔴 Críticos: ${critical.length}`, 'red');
  log('═'.repeat(70), 'magenta');
  
  // Prioridades
  if (critical.length > 0) {
    log('\n🎯 PRIORIDADES:', 'cyan');
    log('   1. Corregir módulos críticos (0% i18n)', 'blue');
    log('   2. Revisar violaciones de boundaries', 'blue');
    log('   3. Completar i18n en módulos parciales', 'blue');
  }
}

/**
 * Función principal
 */
function main() {
  log('\n🔍 Validando todos los módulos migrados...', 'cyan');
  log('   Basado en: I18N_TERMINOLOGY_AI_FIRST.md', 'blue');
  
  const modules = getMigratedModules();
  log(`\n📦 Módulos encontrados: ${modules.length}`, 'cyan');
  
  const results = [];
  
  modules.forEach((module, index) => {
    log(`\n[${index + 1}/${modules.length}]`, 'cyan');
    const result = validateModule(module);
    results.push(result);
  });
  
  generateReport(modules, results);
  
  const hasErrors = results.some(r => !r.boundaries.success || !r.terminology.success);
  process.exit(hasErrors ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { getMigratedModules, validateModule };

