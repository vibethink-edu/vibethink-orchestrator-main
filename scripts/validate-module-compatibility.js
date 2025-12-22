#!/usr/bin/env node

/**
 * Script de Validación de Compatibilidad de Módulos
 * 
 * Valida que todos los módulos registrados en module-registry.ts
 * sean compatibles con el stack actual del monorepo.
 * 
 * Uso:
 *   node scripts/validate-module-compatibility.js
 *   node scripts/validate-module-compatibility.js --module hotel-dashboard
 *   node scripts/validate-module-compatibility.js --report
 */

const fs = require('fs');
const path = require('path');

// Stack actual del monorepo (debe mantenerse sincronizado con package.json)
const CURRENT_STACK = {
  react: "19.0.0",
  nextjs: "15.3.4",
  typescript: "5.9.2",
  tailwind: "4.1.10"
};

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateStackCompatibility(entry) {
  const issues = [];
  
  // Validar React
  if (entry.stackCompatibility.react !== CURRENT_STACK.react) {
    issues.push({
      type: 'react',
      message: `React version mismatch: module requires ${entry.stackCompatibility.react}, current is ${CURRENT_STACK.react}`,
      severity: 'error'
    });
  }
  
  // Validar Next.js
  if (entry.stackCompatibility.nextjs !== CURRENT_STACK.nextjs) {
    issues.push({
      type: 'nextjs',
      message: `Next.js version mismatch: module requires ${entry.stackCompatibility.nextjs}, current is ${CURRENT_STACK.nextjs}`,
      severity: 'error'
    });
  }
  
  // Validar TypeScript (mayor.minor)
  const moduleTS = entry.stackCompatibility.typescript.split('.').slice(0, 2).join('.');
  const currentTS = CURRENT_STACK.typescript.split('.').slice(0, 2).join('.');
  if (moduleTS !== currentTS) {
    issues.push({
      type: 'typescript',
      message: `TypeScript version mismatch: module requires ${moduleTS}.x, current is ${CURRENT_STACK.typescript}`,
      severity: 'warning'
    });
  }
  
  // Validar Tailwind (mayor.minor)
  const moduleTW = entry.stackCompatibility.tailwind.split('.').slice(0, 2).join('.');
  const currentTW = CURRENT_STACK.tailwind.split('.').slice(0, 2).join('.');
  if (moduleTW !== currentTW) {
    issues.push({
      type: 'tailwind',
      message: `Tailwind version mismatch: module requires ${moduleTW}.x, current is ${CURRENT_STACK.tailwind}`,
      severity: 'warning'
    });
  }
  
  return {
    compatible: issues.length === 0,
    issues
  };
}

function validateModule(entry) {
  const validation = validateStackCompatibility(entry);
  const warnings = [];
  const errors = [];
  
  // Clasificar issues
  validation.issues.forEach(issue => {
    if (issue.severity === 'error') {
      errors.push(issue);
    } else {
      warnings.push(issue);
    }
  });
  
  // Validar dependencias
  if (entry.dependencies && entry.dependencies.length > 0) {
    // TODO: Validar que las dependencias existen en package.json
    // Por ahora solo mostramos un warning
  }
  
  // Validar que el path existe
  const modulePath = path.join(__dirname, '..', 'apps', 'dashboard', 'app', entry.path.replace('/dashboard-bundui', 'dashboard-bundui'));
  if (!fs.existsSync(modulePath)) {
    errors.push({
      type: 'path',
      message: `Module path does not exist: ${modulePath}`,
      severity: 'error'
    });
  }
  
  return {
    entry,
    compatible: errors.length === 0,
    errors,
    warnings
  };
}

function generateReport(results) {
  log('\n📊 REPORTE DE COMPATIBILIDAD DE MÓDULOS', 'cyan');
  log('═'.repeat(60), 'cyan');
  
  const compatible = results.filter(r => r.compatible);
  const incompatible = results.filter(r => !r.compatible);
  
  log(`\n✅ Módulos compatibles: ${compatible.length}`, 'green');
  log(`❌ Módulos incompatibles: ${incompatible.length}`, incompatible.length > 0 ? 'red' : 'green');
  
  if (incompatible.length > 0) {
    log('\n🔴 MÓDULOS INCOMPATIBLES:', 'red');
    incompatible.forEach(result => {
      log(`\n  ${result.entry.name} (${result.entry.id})`, 'red');
      result.errors.forEach(error => {
        log(`    ❌ ${error.message}`, 'red');
      });
      result.warnings.forEach(warning => {
        log(`    ⚠️  ${warning.message}`, 'yellow');
      });
    });
  }
  
  // Resumen por fuente
  const bySource = {};
  results.forEach(result => {
    const source = result.entry.source;
    if (!bySource[source]) {
      bySource[source] = { total: 0, compatible: 0 };
    }
    bySource[source].total++;
    if (result.compatible) {
      bySource[source].compatible++;
    }
  });
  
  log('\n📦 POR FUENTE:', 'cyan');
  Object.entries(bySource).forEach(([source, stats]) => {
    const percentage = ((stats.compatible / stats.total) * 100).toFixed(1);
    log(`  ${source}: ${stats.compatible}/${stats.total} (${percentage}%)`, stats.compatible === stats.total ? 'green' : 'yellow');
  });
  
  // Resumen por estado
  const byStatus = {};
  results.forEach(result => {
    const status = result.entry.status;
    if (!byStatus[status]) {
      byStatus[status] = { total: 0, compatible: 0 };
    }
    byStatus[status].total++;
    if (result.compatible) {
      byStatus[status].compatible++;
    }
  });
  
  log('\n📊 POR ESTADO:', 'cyan');
  Object.entries(byStatus).forEach(([status, stats]) => {
    const percentage = ((stats.compatible / stats.total) * 100).toFixed(1);
    log(`  ${status}: ${stats.compatible}/${stats.total} (${percentage}%)`, stats.compatible === stats.total ? 'green' : 'yellow');
  });
  
  log('\n' + '═'.repeat(60), 'cyan');
}

async function main() {
  const args = process.argv.slice(2);
  const moduleId = args.includes('--module') ? args[args.indexOf('--module') + 1] : null;
  const reportMode = args.includes('--report');
  
  // Importar el registro
  // Nota: Esto requiere que el archivo TypeScript esté compilado o usar ts-node
  // Por ahora, leemos el archivo directamente y parseamos manualmente
  const registryPath = path.join(__dirname, '..', 'apps', 'dashboard', 'src', 'shared', 'data', 'module-registry.ts');
  
  if (!fs.existsSync(registryPath)) {
    log(`❌ Error: No se encontró el archivo de registro en ${registryPath}`, 'red');
    process.exit(1);
  }
  
  log('📋 Validando compatibilidad de módulos...', 'cyan');
  log(`   Stack actual: React ${CURRENT_STACK.react}, Next.js ${CURRENT_STACK.nextjs}, TypeScript ${CURRENT_STACK.typescript}`, 'blue');
  
  // Leer y parsear el archivo (simplificado - en producción usar ts-node o compilar)
  const registryContent = fs.readFileSync(registryPath, 'utf-8');
  
  // Extraer las entradas del array moduleRegistry
  // Nota: Esto es una implementación simplificada. En producción, usar ts-node o compilar primero
  log('\n⚠️  Nota: Este script requiere que module-registry.ts esté compilado o usar ts-node', 'yellow');
  log('   Por ahora, ejecuta la validación manualmente usando las funciones del registro', 'yellow');
  
  // Por ahora, mostramos un ejemplo de cómo se usaría
  log('\n📝 Uso esperado (con ts-node o compilado):', 'cyan');
  log(`
import { moduleRegistry, validateStackCompatibility } from '@/shared/data/module-registry';

const results = moduleRegistry.map(entry => {
  const validation = validateStackCompatibility(entry);
  return { entry, ...validation };
});

// Filtrar módulo específico si se especifica
${moduleId ? `const filtered = results.filter(r => r.entry.id === '${moduleId}');` : 'const filtered = results;'}

${reportMode ? 'generateReport(filtered);' : 'filtered.forEach(result => { console.log(result); });'}
  `, 'blue');
  
  log('\n✅ Script listo - Implementar con ts-node o compilación TypeScript', 'green');
}

if (require.main === module) {
  main().catch(error => {
    log(`❌ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { validateStackCompatibility, validateModule, generateReport };


