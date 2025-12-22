#!/usr/bin/env node

/**
 * Script Maestro de Validación de i18n/l10n + Terminology
 * 
 * Integra todas las validaciones según:
 * - docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md
 * - docs/architecture/MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md
 * 
 * Ejecuta en orden:
 * 1. Validación de boundaries de imports
 * 2. Validación de uso de Terminology
 * 3. Detección de strings hardcoded
 * 4. Validación de i18n completeness
 * 
 * Uso:
 *   node scripts/validate-i18n-imports-master.js
 *   node scripts/validate-i18n-imports-master.js --module hotel
 *   node scripts/validate-i18n-imports-master.js --file apps/dashboard/src/components/MyComponent.tsx
 *   node scripts/validate-i18n-imports-master.js --skip-hardcoded
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colores para terminal
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
 * Ejecuta un script y captura su salida
 */
function runScript(scriptPath, args = []) {
  try {
    const fullPath = path.join(__dirname, scriptPath);
    const command = `node "${fullPath}" ${args.join(' ')}`;
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.resolve(__dirname, '..')
    });
    return { success: true, output, exitCode: 0 };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || error.message, 
      exitCode: error.status || 1,
      error: error.message
    };
  }
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const moduleArg = args.find(arg => arg.startsWith('--module='));
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const skipHardcoded = args.includes('--skip-hardcoded');
  const skipBoundaries = args.includes('--skip-boundaries');
  const skipTerminology = args.includes('--skip-terminology');
  
  log('\n🚀 VALIDACIÓN MAESTRA DE i18n/l10n + TERMINOLOGY', 'magenta');
  log('═'.repeat(70), 'magenta');
  log('   Basado en: I18N_TERMINOLOGY_AI_FIRST.md', 'blue');
  log('   Protocolo: MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md', 'blue');
  log('═'.repeat(70), 'magenta');
  
  const results = {
    boundaries: null,
    terminology: null,
    hardcoded: null,
    aiFirst: null,
    i18n: null
  };
  
  const errors = [];
  const warnings = [];
  
  // 1. Validación de boundaries de imports
  if (!skipBoundaries) {
    log('\n📋 1/4: Validando boundaries de imports...', 'cyan');
    const boundariesResult = runScript('validate-import-boundaries.js', fileArg ? [`--file=${fileArg.split('=')[1]}`] : []);
    results.boundaries = boundariesResult;
    
    if (boundariesResult.success) {
      log('   ✅ Boundaries de imports: OK', 'green');
    } else {
      log('   ❌ Boundaries de imports: VIOLACIONES ENCONTRADAS', 'red');
      errors.push('Boundaries de imports');
      log(boundariesResult.output, 'yellow');
    }
  } else {
    log('\n⏭️  1/4: Validación de boundaries omitida', 'yellow');
  }
  
  // 2. Validación de uso de Terminology
  if (!skipTerminology) {
    log('\n📋 2/4: Validando uso de Terminology...', 'cyan');
    const terminologyResult = runScript('validate-terminology-usage.js', fileArg ? [`--file=${fileArg.split('=')[1]}`] : []);
    results.terminology = terminologyResult;
    
    if (terminologyResult.success) {
      log('   ✅ Uso de Terminology: OK', 'green');
    } else {
      log('   ❌ Uso de Terminology: PROBLEMAS ENCONTRADOS', 'red');
      errors.push('Uso de Terminology');
      log(terminologyResult.output, 'yellow');
    }
  } else {
    log('\n⏭️  2/4: Validación de Terminology omitida', 'yellow');
  }
  
  // 3. Detección de strings hardcoded
  if (!skipHardcoded && moduleArg) {
    log('\n📋 3/4: Detectando strings hardcoded...', 'cyan');
    const moduleName = moduleArg.split('=')[1];
    const modulePath = `apps/dashboard/app/dashboard-bundui/${moduleName}`;
    
    if (fs.existsSync(path.resolve(__dirname, '..', modulePath))) {
      const hardcodedResult = runScript('detect-hardcoded-strings-by-component.js', [
        '--module', modulePath,
        '--namespace', moduleName,
        '--all-components'
      ]);
      results.hardcoded = hardcodedResult;
      
      if (hardcodedResult.output && hardcodedResult.output.includes('No se encontraron strings hardcoded')) {
        log('   ✅ Strings hardcoded: OK', 'green');
      } else {
        log('   ⚠️  Strings hardcoded: ENCONTRADOS', 'yellow');
        warnings.push('Strings hardcoded');
        log(hardcodedResult.output, 'yellow');
      }
    } else {
      log(`   ⚠️  Módulo no encontrado: ${modulePath}`, 'yellow');
    }
  } else if (!skipHardcoded) {
    log('\n⏭️  3/4: Detección de strings hardcoded omitida (requiere --module)', 'yellow');
  } else {
    log('\n⏭️  3/4: Detección de strings hardcoded omitida', 'yellow');
  }
  
  // 4. Validación AI-First compliance (NUEVO)
  log('\n📋 4/5: Validando compliance AI-First...', 'cyan');
  const aiFirstScriptPath = path.join(__dirname, 'validate-ai-first-compliance.js');
  if (fs.existsSync(aiFirstScriptPath)) {
    const aiFirstResult = runScript('validate-ai-first-compliance.js', fileArg ? [`--file=${fileArg.split('=')[1]}`] : []);
    results.aiFirst = aiFirstResult;
    
    if (aiFirstResult.success || (aiFirstResult.output && aiFirstResult.output.includes('✅ Todos los módulos cumplen'))) {
      log('   ✅ Compliance AI-First: OK', 'green');
    } else {
      log('   ⚠️  Compliance AI-First: PROBLEMAS ENCONTRADOS', 'yellow');
      warnings.push('Compliance AI-First');
      log(aiFirstResult.output, 'yellow');
    }
  } else {
    log('   ⏭️  Script de validación AI-First no encontrado', 'yellow');
  }
  
  // 5. Validación de i18n completeness (si existe el script)
  log('\n📋 5/5: Validando completitud de i18n...', 'cyan');
  const i18nScriptPath = path.join(__dirname, 'validate-i18n-keys.js');
  if (fs.existsSync(i18nScriptPath)) {
    const i18nResult = runScript('validate-i18n-keys.js', []);
    results.i18n = i18nResult;
    
    if (i18nResult.success) {
      log('   ✅ Completitud de i18n: OK', 'green');
    } else {
      log('   ⚠️  Completitud de i18n: PROBLEMAS ENCONTRADOS', 'yellow');
      warnings.push('Completitud de i18n');
      log(i18nResult.output, 'yellow');
    }
  } else {
    log('   ⏭️  Script de validación de i18n no encontrado', 'yellow');
  }
  
  // Resumen final
  log('\n' + '═'.repeat(70), 'magenta');
  log('📊 RESUMEN FINAL', 'magenta');
  log('═'.repeat(70), 'magenta');
  
  if (errors.length === 0 && warnings.length === 0) {
    log('\n✅ TODAS LAS VALIDACIONES PASARON', 'green');
    log('   El código cumple con las reglas de I18N_TERMINOLOGY_AI_FIRST.md', 'green');
  } else {
    if (errors.length > 0) {
      log(`\n❌ ERRORES ENCONTRADOS: ${errors.length}`, 'red');
      errors.forEach(err => log(`   - ${err}`, 'red'));
    }
    
    if (warnings.length > 0) {
      log(`\n⚠️  ADVERTENCIAS: ${warnings.length}`, 'yellow');
      warnings.forEach(warn => log(`   - ${warn}`, 'yellow'));
    }
    
    log('\n💡 Próximos pasos:', 'cyan');
    log('   1. Revisar docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md', 'blue');
    log('   2. Corregir errores según las reglas documentadas', 'blue');
    log('   3. Ejecutar validaciones individuales para más detalles:', 'blue');
    log('      - node scripts/validate-import-boundaries.js', 'blue');
    log('      - node scripts/validate-terminology-usage.js', 'blue');
    log('      - node scripts/detect-hardcoded-strings-by-component.js --module <module> --namespace <ns>', 'blue');
  }
  
  log('\n' + '═'.repeat(70), 'magenta');
  
  // Exit code basado en errores
  process.exit(errors.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { runScript };

