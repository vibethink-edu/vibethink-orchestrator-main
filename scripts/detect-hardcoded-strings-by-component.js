#!/usr/bin/env node

/**
 * Script de Detección de Strings Hardcoded por Componente
 * 
 * Detecta strings hardcoded organizados por componente (archivo)
 * Sugiere namespace basado en nombre del archivo
 * Genera estructura JSON sugerida
 * 
 * Uso:
 *   node scripts/detect-hardcoded-strings-by-component.js --module apps/dashboard/app/dashboard-bundui/hotel --namespace hotel --all-components
 *   node scripts/detect-hardcoded-strings-by-component.js --module apps/dashboard/app/dashboard-bundui/hotel --component revenue-stat.tsx --namespace hotel
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const moduleIndex = args.indexOf('--module');
const namespaceIndex = args.indexOf('--namespace');
const componentIndex = args.indexOf('--component');
const allComponents = args.includes('--all-components');

if (moduleIndex === -1 || namespaceIndex === -1) {
  console.error('❌ Error: Se requieren --module y --namespace');
  console.log('\nUso:');
  console.log('  node scripts/detect-hardcoded-strings-by-component.js --module <ruta-modulo> --namespace <namespace> [--component <componente> | --all-components]');
  console.log('\nEjemplos:');
  console.log('  # Un componente específico');
  console.log('  node scripts/detect-hardcoded-strings-by-component.js --module apps/dashboard/app/dashboard-bundui/hotel --component revenue-stat.tsx --namespace hotel');
  console.log('\n  # Todos los componentes');
  console.log('  node scripts/detect-hardcoded-strings-by-component.js --module apps/dashboard/app/dashboard-bundui/hotel --namespace hotel --all-components');
  process.exit(1);
}

const modulePath = args[moduleIndex + 1];
const namespace = args[namespaceIndex + 1];
const componentName = componentIndex !== -1 ? args[componentIndex + 1] : null;

if (!modulePath || !namespace) {
  console.error('❌ Error: --module y --namespace requieren valores');
  process.exit(1);
}

const fullModulePath = path.resolve(process.cwd(), modulePath);

if (!fs.existsSync(fullModulePath)) {
  console.error(`❌ Error: El módulo no existe: ${fullModulePath}`);
  process.exit(1);
}

/**
 * Convert kebab-case to camelCase
 */
function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Get component namespace from file name
 */
function getComponentNamespace(fileName) {
  // Remove extension
  const nameWithoutExt = fileName.replace(/\.tsx?$/, '');
  // Convert kebab-case to camelCase
  return `components.${kebabToCamel(nameWithoutExt)}`;
}

/**
 * Find all TS/TSX files
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      findFiles(filePath, fileList);
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Detect hardcoded strings in a file
 */
function detectHardcodedStrings(filePath, namespace) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const strings = [];
  
  // Patterns to detect hardcoded strings
  const patterns = [
    // JSX text content: >Text<
    />\s*([A-Z][a-zA-Z\s]{2,})\s*</g,
    // String literals in JSX: "Text" or 'Text'
    /(["'])([A-Z][a-zA-Z\s]{2,})\1/g,
    // Template literals: `Text`
    /`([A-Z][a-zA-Z\s]{2,})`/g,
  ];
  
  // Common words to ignore (already translated or common terms)
  const ignoreList = [
    'use client',
    'useState',
    'useEffect',
    'useMemo',
    'useCallback',
    'export function',
    'export default',
    'import',
    'from',
    'return',
    'const',
    'let',
    'var',
    'if',
    'else',
    'for',
    'while',
    'switch',
    'case',
    'break',
    'continue',
    'true',
    'false',
    'null',
    'undefined',
  ];
  
  lines.forEach((line, index) => {
    // Skip if line contains useTranslation (already using i18n)
    if (line.includes('useTranslation') || line.includes('t(') || line.includes('t(')) {
      return;
    }
    
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      return;
    }
    
    // Check each pattern
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const text = match[2] || match[1];
        
        // Filter out ignored words and very short strings
        if (text.length < 3 || ignoreList.some(ignored => text.toLowerCase().includes(ignored.toLowerCase()))) {
          return;
        }
        
        // Filter out code keywords and technical terms
        if (/^(className|id|key|href|src|alt|type|value|name|onClick|onChange|onSubmit)$/i.test(text.trim())) {
          return;
        }
        
        // Filter out URLs and paths
        if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(text)) {
          return;
        }
        
        // Filter out numbers and dates in format
        if (/^\d+$/.test(text.trim()) || /^\d{4}-\d{2}-\d{2}$/.test(text.trim())) {
          return;
        }
        
        strings.push({
          line: index + 1,
          text: text.trim(),
          originalLine: line.trim()
        });
      }
    });
  });
  
  return strings;
}

/**
 * Generate suggested JSON structure
 */
function generateSuggestedStructure(componentName, strings) {
  const camelName = kebabToCamel(componentName.replace(/\.tsx?$/, ''));
  const structure = {
    [camelName]: {}
  };
  
  // Group strings by type
  const titles = strings.filter(s => 
    s.text.length > 10 && (s.text.includes('Title') || s.text.includes('Overview') || s.text.includes('Stat'))
  );
  const buttons = strings.filter(s => 
    s.text.length < 20 && (s.text.includes('Add') || s.text.includes('Save') || s.text.includes('Cancel'))
  );
  const labels = strings.filter(s => 
    !titles.includes(s) && !buttons.includes(s)
  );
  
  if (titles.length > 0) {
    structure[camelName].title = titles[0].text;
  }
  
  if (buttons.length > 0) {
    structure[camelName].actions = {};
    buttons.forEach((btn, index) => {
      structure[camelName].actions[`action${index + 1}`] = btn.text;
    });
  }
  
  if (labels.length > 0) {
    structure[camelName].labels = {};
    labels.forEach((label, index) => {
      const key = label.text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      structure[camelName].labels[key] = label.text;
    });
  }
  
  return structure;
}

// Main execution
console.log('\n🔍 Detectando strings hardcoded por componente...\n');

if (allComponents) {
  // Process all components
  const files = findFiles(fullModulePath);
  const components = files.filter(f => f.includes('components') || f.endsWith('page.tsx'));
  
  console.log(`📁 Módulo: ${modulePath}`);
  console.log(`📦 Namespace: ${namespace}`);
  console.log(`📄 Componentes encontrados: ${components.length}\n`);
  
  const report = {};
  
  components.forEach(filePath => {
    const fileName = path.basename(filePath);
    const componentNamespace = getComponentNamespace(fileName);
    const strings = detectHardcodedStrings(filePath, namespace);
    
    if (strings.length > 0) {
      report[fileName] = {
        namespace: componentNamespace,
        filePath,
        strings,
        suggestedStructure: generateSuggestedStructure(fileName, strings)
      };
    }
  });
  
  if (Object.keys(report).length === 0) {
    console.log('✅ No se encontraron strings hardcoded en los componentes.');
  } else {
    console.log(`⚠️  ${Object.keys(report).length} componentes con strings hardcoded:\n`);
    
    Object.entries(report).forEach(([fileName, data]) => {
      console.log(`📄 ${fileName}`);
      console.log(`   Namespace sugerido: ${data.namespace}`);
      console.log(`   Strings encontrados: ${data.strings.length}`);
      console.log(`   Ejemplos:`);
      data.strings.slice(0, 3).forEach(s => {
        console.log(`     - Línea ${s.line}: "${s.text}"`);
      });
      console.log('');
    });
  }
  
} else if (componentName) {
  // Process single component
  const componentPath = path.join(fullModulePath, componentName);
  
  if (!fs.existsSync(componentPath)) {
    // Try in components subdirectory
    const altPath = path.join(fullModulePath, 'components', componentName);
    if (fs.existsSync(altPath)) {
      const componentNamespace = getComponentNamespace(componentName);
      const strings = detectHardcodedStrings(altPath, namespace);
      
      console.log(`📄 Componente: ${componentName}`);
      console.log(`📦 Namespace sugerido: ${componentNamespace}`);
      console.log(`📍 Archivo: ${altPath}\n`);
      
      if (strings.length === 0) {
        console.log('✅ No se encontraron strings hardcoded.');
      } else {
        console.log(`⚠️  ${strings.length} strings hardcoded encontrados:\n`);
        
        strings.forEach(s => {
          console.log(`   Línea ${s.line}: "${s.text}"`);
          console.log(`   ${s.originalLine}\n`);
        });
        
        const suggested = generateSuggestedStructure(componentName, strings);
        console.log('📋 Estructura JSON sugerida:');
        console.log(JSON.stringify({ [namespace]: { components: suggested } }, null, 2));
      }
    } else {
      console.error(`❌ Error: Componente no encontrado: ${componentName}`);
      console.log(`   Buscado en: ${componentPath}`);
      console.log(`   Buscado en: ${altPath}`);
      process.exit(1);
    }
  } else {
    const componentNamespace = getComponentNamespace(componentName);
    const strings = detectHardcodedStrings(componentPath, namespace);
    
    console.log(`📄 Componente: ${componentName}`);
    console.log(`📦 Namespace sugerido: ${componentNamespace}`);
    console.log(`📍 Archivo: ${componentPath}\n`);
    
    if (strings.length === 0) {
      console.log('✅ No se encontraron strings hardcoded.');
    } else {
      console.log(`⚠️  ${strings.length} strings hardcoded encontrados:\n`);
      
      strings.forEach(s => {
        console.log(`   Línea ${s.line}: "${s.text}"`);
        console.log(`   ${s.originalLine}\n`);
      });
      
      const suggested = generateSuggestedStructure(componentName, strings);
      console.log('📋 Estructura JSON sugerida:');
      console.log(JSON.stringify({ [namespace]: { components: suggested } }, null, 2));
    }
  }
} else {
  console.error('❌ Error: Se requiere --component o --all-components');
  process.exit(1);
}

console.log('\n✅ Análisis completado.\n');

