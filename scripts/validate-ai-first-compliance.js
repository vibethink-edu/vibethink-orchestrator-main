#!/usr/bin/env node

/**
 * Script de Validación de Compliance AI-First Universal
 * 
 * Valida que TODOS los módulos cumplan con la metodología AI-First:
 * - Context-Aware Terminology
 * - DateTime Safety
 * - External Normalization
 * - Resource Context
 * - AI Integration
 * 
 * @see docs/architecture/AI_FIRST_UNIVERSAL_METHODOLOGY.md
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md
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
 * Módulos conocidos y sus contextos esperados
 */
const KNOWN_MODULES = {
  'hotel': { context: 'hotel', expectedUnit: 'night', expectedType: 'CivilDate' },
  'studio': { context: 'studio', expectedUnit: 'hour', expectedType: 'InstantISO' },
  'crm': { context: 'crm', expectedUnit: null, expectedType: 'both' },
  'tasks': { context: 'tasks', expectedUnit: null, expectedType: 'both' },
  'calendar': { context: 'calendar', expectedUnit: null, expectedType: 'both' },
  'support': { context: 'support', expectedUnit: null, expectedType: 'both' },
};

/**
 * Validar compliance de un módulo
 */
function validateModuleCompliance(moduleName, modulePath) {
  const issues = [];
  const warnings = [];
  
  if (!fs.existsSync(modulePath)) {
    return { issues: [`Module path does not exist: ${modulePath}`], warnings: [] };
  }
  
  // Buscar archivos TypeScript/TSX
  const files = getAllFiles(modulePath, ['.ts', '.tsx']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // 1. Validar fechas hardcoded
    if (content.match(/["'](January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}["']/i)) {
      issues.push(`Hardcoded date string in ${relativePath}`);
    }
    
    // 2. Validar uso de new Date() para display
    if (content.match(/new\s+Date\([^)]*\)\.toLocale(Date|Time)String/)) {
      issues.push(`Direct use of toLocaleDateString/toLocaleTimeString in ${relativePath}. Use formatBookingRange() instead.`);
    }
    
    // 3. Validar que NO se importe terminology JSON en client components
    if (content.includes('"use client"') || content.includes("'use client'")) {
      if (content.match(/import.*from.*['"]\.\.\/.*concept.*\.json['"]/)) {
        issues.push(`Client component imports terminology JSON in ${relativePath}. Use useTerm() hook instead.`);
      }
    }
    
    // 4. Validar que se use formatBookingRange() para fechas
    if (content.includes('checkIn') || content.includes('checkOut') || content.includes('startAt') || content.includes('endAt')) {
      if (!content.includes('formatBookingRange') && !content.includes('NormalizedWindow')) {
        warnings.push(`Potential date formatting issue in ${relativePath}. Consider using formatBookingRange().`);
      }
    }
    
    // 5. Validar que se use term() o useTerm() para terminology
    if (content.match(/["'](room|studio|booking|deal|contact|account)["']/i)) {
      if (!content.includes('term(') && !content.includes('useTerm(') && !content.includes('useTranslations(')) {
        warnings.push(`Potential hardcoded terminology in ${relativePath}. Consider using term() or useTerm().`);
      }
    }
    
    // 6. Validar uso de NormalizedWindow vs BookingWindow legacy
    if (content.includes('BookingWindow') && !content.includes('NormalizedWindow')) {
      warnings.push(`Using legacy BookingWindow in ${relativePath}. Migrate to NormalizedWindow.`);
    }
    
    // 7. Validar presencia de ResourceContext en normalizers
    if (content.match(/normalize.*Booking|normalize.*Event|normalize.*Data/i)) {
      if (!content.includes('ResourceContext') && !content.includes('resourceCtx')) {
        warnings.push(`Normalizer missing ResourceContext in ${relativePath}. Timezone must be explicit.`);
      }
    }
    
    // 8. Validar CivilDate vs InstantISO según contexto del módulo
    if (KNOWN_MODULES[moduleName]) {
      const expected = KNOWN_MODULES[moduleName];
      if (expected.expectedType === 'CivilDate' && content.includes('InstantISO') && !content.includes('CivilDate')) {
        warnings.push(`Module ${moduleName} should use CivilDate, but found InstantISO in ${relativePath}.`);
      }
      if (expected.expectedType === 'InstantISO' && content.includes('CivilDate') && !content.includes('InstantISO')) {
        warnings.push(`Module ${moduleName} should use InstantISO, but found CivilDate in ${relativePath}.`);
      }
    }
  }
  
  return { issues, warnings };
}

/**
 * Obtener todos los archivos recursivamente
 */
function getAllFiles(dir, extensions = []) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and dist
      if (item !== 'node_modules' && item !== 'dist' && item !== '.next') {
        files.push(...getAllFiles(fullPath, extensions));
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (extensions.length === 0 || extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

/**
 * Validar todos los módulos
 */
function validateAllModules() {
  log('\n🔍 Validando Compliance AI-First Universal...\n', 'cyan');
  log('   Basado en: AI_FIRST_UNIVERSAL_METHODOLOGY.md\n', 'blue');
  
  const results = {};
  let totalIssues = 0;
  let totalWarnings = 0;
  
  // Buscar módulos en dashboard-bundui y dashboard-vibethink
  const dashboardBunduiPath = path.join(__dirname, '..', 'apps', 'dashboard', 'app', 'dashboard-bundui');
  const dashboardVibethinkPath = path.join(__dirname, '..', 'apps', 'dashboard', 'app', 'dashboard-vibethink');
  
  // Módulos en dashboard-bundui
  if (fs.existsSync(dashboardBunduiPath)) {
    const modules = fs.readdirSync(dashboardBunduiPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const moduleName of modules) {
      if (KNOWN_MODULES[moduleName] || moduleName.includes('hotel') || moduleName.includes('studio') || moduleName.includes('crm')) {
        const modulePath = path.join(dashboardBunduiPath, moduleName);
        const validation = validateModuleCompliance(moduleName, modulePath);
        results[moduleName] = validation;
        totalIssues += validation.issues.length;
        totalWarnings += validation.warnings.length;
      }
    }
  }
  
  // Módulos en dashboard-vibethink
  if (fs.existsSync(dashboardVibethinkPath)) {
    const modules = fs.readdirSync(dashboardVibethinkPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const moduleName of modules) {
      if (KNOWN_MODULES[moduleName] || moduleName.includes('hotel') || moduleName.includes('studio') || moduleName.includes('crm')) {
        const modulePath = path.join(dashboardVibethinkPath, moduleName);
        const validation = validateModuleCompliance(moduleName, modulePath);
        if (!results[moduleName]) {
          results[moduleName] = validation;
        } else {
          // Merge results
          results[moduleName].issues.push(...validation.issues);
          results[moduleName].warnings.push(...validation.warnings);
        }
        totalIssues += validation.issues.length;
        totalWarnings += validation.warnings.length;
      }
    }
  }
  
  // Reporte
  log('\n══════════════════════════════════════════════════════════════════════\n', 'magenta');
  log('📊 REPORTE DE COMPLIANCE AI-FIRST UNIVERSAL\n', 'magenta');
  log('══════════════════════════════════════════════════════════════════════\n', 'magenta');
  
  if (totalIssues === 0 && totalWarnings === 0) {
    log('✅ Todos los módulos cumplen con la metodología AI-First!\n', 'green');
    process.exit(0);
  }
  
  // Módulos con problemas críticos
  const criticalModules = Object.entries(results)
    .filter(([_, result]) => result.issues.length > 0)
    .sort(([_, a], [__, b]) => b.issues.length - a.issues.length);
  
  if (criticalModules.length > 0) {
    log('🔴 MÓDULOS CON PROBLEMAS CRÍTICOS:\n', 'red');
    for (const [moduleName, result] of criticalModules) {
      log(`   ${moduleName}`, 'red');
      log(`      Issues: ${result.issues.length}`, 'yellow');
      result.issues.slice(0, 5).forEach(issue => {
        log(`      • ${issue}`, 'yellow');
      });
      if (result.issues.length > 5) {
        log(`      ... y ${result.issues.length - 5} más`, 'yellow');
      }
      log('');
    }
  }
  
  // Módulos con advertencias
  const warningModules = Object.entries(results)
    .filter(([_, result]) => result.warnings.length > 0 && result.issues.length === 0)
    .sort(([_, a], [__, b]) => b.warnings.length - a.warnings.length);
  
  if (warningModules.length > 0) {
    log('⚠️  MÓDULOS CON ADVERTENCIAS:\n', 'yellow');
    for (const [moduleName, result] of warningModules) {
      log(`   ${moduleName}`, 'yellow');
      log(`      Advertencias: ${result.warnings.length}`, 'yellow');
      result.warnings.slice(0, 3).forEach(warning => {
        log(`      • ${warning}`, 'yellow');
      });
      if (result.warnings.length > 3) {
        log(`      ... y ${result.warnings.length - 3} más`, 'yellow');
      }
      log('');
    }
  }
  
  // Resumen
  log('══════════════════════════════════════════════════════════════════════\n', 'magenta');
  log(`Total módulos validados: ${Object.keys(results).length}`, 'cyan');
  log(`✅ OK: ${Object.keys(results).filter(m => results[m].issues.length === 0 && results[m].warnings.length === 0).length}`, 'green');
  log(`⚠️  Advertencias: ${Object.keys(results).filter(m => results[m].warnings.length > 0 && results[m].issues.length === 0).length}`, 'yellow');
  log(`🔴 Críticos: ${criticalModules.length}\n`, 'red');
  
  log('🎯 PRIORIDADES:', 'cyan');
  log('   1. Corregir módulos críticos (fechas hardcoded, imports prohibidos)', 'white');
  log('   2. Revisar advertencias (mejoras sugeridas)', 'white');
  log('   3. Aplicar metodología AI-First a nuevos módulos\n', 'white');
  
  process.exit(totalIssues > 0 ? 1 : 0);
}

// Ejecutar validación
validateAllModules();

