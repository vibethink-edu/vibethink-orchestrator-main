#!/usr/bin/env node

/**
 * Script de Validacion de Boundaries de Imports
 * 
 * Valida que se cumplan las reglas de boundaries definidas en:
 * - docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md
 * - Regla 4: Boundaries de imports (ESLint + CI)
 * 
 * PROHIBIDO:
 * - UI no puede importar desde packages/ai-agents
 * - AI Agents no pueden importar desde apps/[cualquier]/lib/i18n
 * - Terminology no puede importar desde apps o ai-agents
 * 
 * Uso:
 *   node scripts/validate-import-boundaries.js
 *   node scripts/validate-import-boundaries.js --fix
 *   node scripts/validate-import-boundaries.js --file apps/dashboard/src/components/MyComponent.tsx
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Boundaries prohibidos según I18N_TERMINOLOGY_AI_FIRST.md
const PROHIBITED_IMPORTS = {
  // UI no puede importar desde ai-agents
  'ui-to-ai-agents': {
    from: /^apps\/dashboard\/src\//,
    to: /^packages\/ai-agents\//,
    message: 'UI components cannot import from packages/ai-agents'
  },
  // AI Agents no pueden importar desde apps/*/lib/i18n
  'ai-agents-to-i18n': {
    from: /^packages\/ai-agents\//,
    to: /^apps\/.*\/lib\/i18n\//,
    message: 'AI Agents cannot import from apps/*/lib/i18n'
  },
  // Terminology no puede importar desde apps/* o ai-agents
  'terminology-to-apps': {
    from: /^packages\/terminology\//,
    to: /^apps\//,
    message: 'Terminology package cannot import from apps/*'
  },
  'terminology-to-ai-agents': {
    from: /^packages\/terminology\//,
    to: /^packages\/ai-agents\//,
    message: 'Terminology package cannot import from packages/ai-agents'
  },
  // Client components no pueden importar concepts JSON
  'client-to-concepts-json': {
    from: /^apps\/dashboard\/src\/.*\.tsx$/,
    to: /@vibethink\/terminology\/concepts\/.*\.json/,
    message: 'Client components cannot import concepts JSON. Use useTerm() or termFromSnapshot() instead.',
    checkContent: true // Necesita verificar 'use client' en el archivo
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
 * Extrae imports de un archivo
 */
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Patrones para detectar imports
    const importPatterns = [
      // import ... from "..."
      /import\s+(?:.*?)\s+from\s+["']([^"']+)["']/g,
      // import "..."
      /import\s+["']([^"']+)["']/g,
      // require("...")
      /require\s*\(\s*["']([^"']+)["']\s*\)/g
    ];
    
    importPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath && !importPath.startsWith('.') && !importPath.startsWith('/')) {
          imports.push({
            path: importPath,
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
    });
    
    return imports;
  } catch (error) {
    return [];
  }
}

/**
 * Normaliza ruta de archivo para comparación
 */
function normalizePath(filePath) {
  // Convertir a ruta relativa desde raíz del monorepo
  const rootPath = path.resolve(__dirname, '..');
  const relativePath = path.relative(rootPath, filePath).replace(/\\/g, '/');
  return relativePath;
}

/**
 * Verifica si un import viola boundaries
 */
function checkBoundaryViolation(filePath, importPath, rule) {
  const normalizedFilePath = normalizePath(filePath);
  
  // Verificar si el archivo coincide con el patrón "from"
  if (!rule.from.test(normalizedFilePath)) {
    return null;
  }
  
  // Verificar si el import coincide con el patrón "to"
  if (!rule.to.test(importPath)) {
    return null;
  }
  
  // Si requiere verificar contenido (client components)
  if (rule.checkContent) {
    if (rule.checkContent === true && !isClientComponent(filePath)) {
      return null;
    }
  }
  
  return {
    file: normalizedFilePath,
    import: importPath,
    message: rule.message,
    rule: Object.keys(PROHIBITED_IMPORTS).find(key => PROHIBITED_IMPORTS[key] === rule)
  };
}

/**
 * Valida un archivo
 */
function validateFile(filePath) {
  const violations = [];
  const imports = extractImports(filePath);
  
  imports.forEach(imp => {
    Object.values(PROHIBITED_IMPORTS).forEach(rule => {
      const violation = checkBoundaryViolation(filePath, imp.path, rule);
      if (violation) {
        violations.push({
          ...violation,
          line: imp.line
        });
      }
    });
  });
  
  return violations;
}

/**
 * Encuentra todos los archivos TypeScript/JavaScript
 */
function findSourceFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    // Ignorar directorios
    if (entry.isDirectory()) {
      // Ignorar node_modules, .next, dist, etc.
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(entry.name)) {
        findSourceFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      // Solo archivos TypeScript/JavaScript
      if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
        // Ignorar archivos de definición y tests por ahora
        if (!entry.name.endsWith('.d.ts') && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
          fileList.push(fullPath);
        }
      }
    }
  });
  
  return fileList;
}

/**
 * Genera reporte de violaciones
 */
function generateReport(violations) {
  if (violations.length === 0) {
    log('\n✅ No se encontraron violaciones de boundaries de imports', 'green');
    return;
  }
  
  log('\n❌ VIOLACIONES DE BOUNDARIES DE IMPORTS', 'red');
  log('═'.repeat(70), 'red');
  
  // Agrupar por archivo
  const byFile = {};
  violations.forEach(v => {
    if (!byFile[v.file]) {
      byFile[v.file] = [];
    }
    byFile[v.file].push(v);
  });
  
  Object.entries(byFile).forEach(([file, fileViolations]) => {
    log(`\n📄 ${file}`, 'cyan');
    fileViolations.forEach(v => {
      log(`   Línea ${v.line}: ${v.import}`, 'yellow');
      log(`   ❌ ${v.message}`, 'red');
    });
  });
  
  log(`\n${'═'.repeat(70)}`, 'red');
  log(`\nTotal de violaciones: ${violations.length}`, 'red');
  log(`Archivos afectados: ${Object.keys(byFile).length}`, 'red');
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const fixMode = args.includes('--fix');
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const specificFile = fileArg ? fileArg.split('=')[1] : null;
  
  log('\n🔍 Validando boundaries de imports...', 'cyan');
  log('   Reglas: I18N_TERMINOLOGY_AI_FIRST.md - Sección 4', 'blue');
  
  let filesToCheck = [];
  
  if (specificFile) {
    // Validar archivo específico
    const fullPath = path.resolve(process.cwd(), specificFile);
    if (fs.existsSync(fullPath)) {
      filesToCheck = [fullPath];
    } else {
      log(`❌ Error: Archivo no encontrado: ${specificFile}`, 'red');
      process.exit(1);
    }
  } else {
    // Validar todos los archivos
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
  
  const allViolations = [];
  
  filesToCheck.forEach(file => {
    const violations = validateFile(file);
    allViolations.push(...violations);
  });
  
  generateReport(allViolations);
  
  if (allViolations.length > 0) {
    log('\n💡 Soluciones:', 'cyan');
    log('   1. Revisar docs/architecture/I18N_TERMINOLOGY_AI_FIRST.md - Sección 4', 'blue');
    log('   2. Usar las APIs correctas:', 'blue');
    log('      - UI: useTranslations() + useTerm()', 'blue');
    log('      - AI Agents: term() desde packages/terminology', 'blue');
    log('      - Terminology: solo tipos/interfaces, no implementaciones', 'blue');
    log('   3. Para client components: usar snapshot/hydration pattern', 'blue');
    
    if (fixMode) {
      log('\n⚠️  Modo --fix no implementado aún. Corrige manualmente.', 'yellow');
    }
    
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFile, checkBoundaryViolation, PROHIBITED_IMPORTS };

