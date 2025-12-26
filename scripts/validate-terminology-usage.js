#!/usr/bin/env node

/**
 * Script de Validación de Uso de Terminology
 * 
 * Valida que se cumplan las reglas de Terminology definidas en:
 * - docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md
 * - Regla 2.2: UI puede usar Terminology SOLO para labels cortos
 * - Regla 2.3: Next.js App Router - RSC async OK, Client snapshot-only
 * 
 * Uso:
 *   node scripts/validate-terminology-usage.js
 *   node scripts/validate-terminology-usage.js --file apps/dashboard/src/components/MyComponent.tsx
 */

const fs = require('fs');
const path = require('path');

// Patrones para detectar uso incorrecto de Terminology
const TERMINOLOGY_PATTERNS = {
  // UI construyendo frases con term() (prohibido)
  'ui-nlg-concatenation': {
    pattern: /(?:const|let|var)\s+\w+\s*=\s*(?:await\s+)?term\([^)]+\)\s*\+\s*['"`]/,
    message: 'UI should not concatenate term() results to build phrases. Use useTranslations() for full phrases.',
    severity: 'error'
  },
  // Client component usando await term() (prohibido)
  'client-async-term': {
    pattern: /await\s+term\(/,
    message: 'Client components cannot use await term(). Use useTerm() or termFromSnapshot() instead.',
    severity: 'error',
    checkContent: true // Solo en client components
  },
  // Import de concepts JSON en client component (prohibido)
  'client-concepts-json-import': {
    pattern: /from\s+["']@vibethink\/terminology\/concepts\/.*\.json["']/,
    message: 'Client components cannot import concepts JSON. Use useTerm() or termFromSnapshot() instead.',
    severity: 'error',
    checkContent: true
  },
  // Concept ID no atómico (usando parámetros de tipo)
  'non-atomic-concept-id': {
    pattern: /term\(['"]concept\.\w+\.\w+['"],\s*\{[^}]*type[^}]*\}/,
    message: 'Concept IDs must be atomic. Use concept.resource.room instead of concept.resource + {type}.',
    severity: 'warning'
  }
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

/**
 * Detecta si un archivo es un Client Component
 */
function isClientComponent(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes("'use client'") || content.includes('"use client"');
  } catch (error) {
    return false;
  }
}

/**
 * Detecta si un archivo es un Server Component (RSC)
 */
function isServerComponent(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Si no tiene 'use client' y es .tsx, probablemente es RSC
    return !content.includes("'use client'") && 
           !content.includes('"use client"') && 
           filePath.endsWith('.tsx');
  } catch (error) {
    return false;
  }
}

/**
 * Valida uso de Terminology en un archivo
 */
function validateTerminologyUsage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    const isClient = isClientComponent(filePath);
    const isServer = isServerComponent(filePath);
    
    lines.forEach((line, index) => {
      Object.entries(TERMINOLOGY_PATTERNS).forEach(([ruleName, rule]) => {
        // Si requiere verificar contenido (client components)
        if (rule.checkContent && !isClient) {
          return; // Skip si no es client component
        }
        
        if (rule.pattern.test(line)) {
          issues.push({
            rule: ruleName,
            line: index + 1,
            content: line.trim(),
            message: rule.message,
            severity: rule.severity,
            file: path.relative(process.cwd(), filePath)
          });
        }
      });
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

/**
 * Encuentra todos los archivos TypeScript/JavaScript
 */
function findSourceFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(entry.name)) {
        findSourceFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        if (!entry.name.endsWith('.d.ts') && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
          fileList.push(fullPath);
        }
      }
    }
  });
  
  return fileList;
}

/**
 * Genera reporte de issues
 */
function generateReport(issues) {
  if (issues.length === 0) {
    log('\n✅ No se encontraron problemas con el uso de Terminology', 'green');
    return;
  }
  
  // Separar por severidad
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  
  if (errors.length > 0) {
    log('\n❌ ERRORES DE USO DE TERMINOLOGY', 'red');
    log('═'.repeat(70), 'red');
    
    // Agrupar por archivo
    const byFile = {};
    errors.forEach(issue => {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    });
    
    Object.entries(byFile).forEach(([file, fileIssues]) => {
      log(`\n📄 ${file}`, 'cyan');
      fileIssues.forEach(issue => {
        log(`   Línea ${issue.line}: ${issue.content.substring(0, 60)}...`, 'yellow');
        log(`   ❌ ${issue.message}`, 'red');
      });
    });
  }
  
  if (warnings.length > 0) {
    log('\n⚠️  ADVERTENCIAS DE USO DE TERMINOLOGY', 'yellow');
    log('═'.repeat(70), 'yellow');
    
    const byFile = {};
    warnings.forEach(issue => {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    });
    
    Object.entries(byFile).forEach(([file, fileIssues]) => {
      log(`\n📄 ${file}`, 'cyan');
      fileIssues.forEach(issue => {
        log(`   Línea ${issue.line}: ${issue.content.substring(0, 60)}...`, 'yellow');
        log(`   ⚠️  ${issue.message}`, 'yellow');
      });
    });
  }
  
  log(`\n${'═'.repeat(70)}`, errors.length > 0 ? 'red' : 'yellow');
  log(`\nTotal de errores: ${errors.length}`, errors.length > 0 ? 'red' : 'green');
  log(`Total de advertencias: ${warnings.length}`, warnings.length > 0 ? 'yellow' : 'green');
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const specificFile = fileArg ? fileArg.split('=')[1] : null;
  
  log('\n🔍 Validando uso de Terminology...', 'cyan');
  log('   Reglas: I18N_TERMINOLOGY_AI_FIRST.md - Secciones 2.2, 2.3', 'blue');
  
  let filesToCheck = [];
  
  if (specificFile) {
    const fullPath = path.resolve(process.cwd(), specificFile);
    if (fs.existsSync(fullPath)) {
      filesToCheck = [fullPath];
    } else {
      log(`❌ Error: Archivo no encontrado: ${specificFile}`, 'red');
      process.exit(1);
    }
  } else {
    const rootPath = path.resolve(__dirname, '..');
    const sourceDirs = [
      path.join(rootPath, 'apps', 'dashboard', 'src'),
      path.join(rootPath, 'packages', 'terminology', 'src'),
      path.join(rootPath, 'packages', 'ai-agents', 'src')
    ];
    
    sourceDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        filesToCheck.push(...findSourceFiles(dir));
      }
    });
  }
  
  log(`\n📁 Archivos a validar: ${filesToCheck.length}`, 'cyan');
  
  const allIssues = [];
  
  filesToCheck.forEach(file => {
    const issues = validateTerminologyUsage(file);
    allIssues.push(...issues);
  });
  
  generateReport(allIssues);
  
  const errors = allIssues.filter(i => i.severity === 'error');
  
  if (errors.length > 0) {
    log('\n💡 Soluciones:', 'cyan');
    log('   1. Para UI: usar useTranslations() para frases completas', 'blue');
    log('   2. Para labels cortos: usar useTerm() en client, await term() en RSC', 'blue');
    log('   3. Client components: usar snapshot/hydration pattern', 'blue');
    log('   4. Concept IDs: usar concept.resource.room (atómico)', 'blue');
    log('   5. Revisar docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md', 'blue');
    
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateTerminologyUsage, TERMINOLOGY_PATTERNS };








