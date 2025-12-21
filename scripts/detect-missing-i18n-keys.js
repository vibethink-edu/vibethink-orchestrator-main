#!/usr/bin/env node

/**
 * Script de Detección de Claves i18n Faltantes
 * 
 * Detecta claves que aparecen visibles en la UI (no traducidas)
 * Compara las claves usadas en el código con las que existen en JSON
 * 
 * Uso:
 *   node scripts/detect-missing-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/hotel --namespace hotel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse arguments
const args = process.argv.slice(2);
const moduleIndex = args.indexOf('--module');
const namespaceIndex = args.indexOf('--namespace');

if (moduleIndex === -1 || namespaceIndex === -1) {
  console.error('❌ Error: Se requieren --module y --namespace');
  console.log('\nUso:');
  console.log('  node scripts/detect-missing-i18n-keys.js --module <ruta-modulo> --namespace <namespace>');
  console.log('\nEjemplo:');
  console.log('  node scripts/detect-missing-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/hotel --namespace hotel');
  process.exit(1);
}

const modulePath = args[moduleIndex + 1];
const namespace = args[namespaceIndex + 1];

if (!modulePath || !namespace) {
  console.error('❌ Error: --module y --namespace requieren valores');
  process.exit(1);
}

const fullModulePath = path.resolve(process.cwd(), modulePath);

if (!fs.existsSync(fullModulePath)) {
  console.error(`❌ Error: El módulo no existe: ${fullModulePath}`);
  process.exit(1);
}

const enJsonPath = path.resolve(process.cwd(), `apps/dashboard/src/lib/i18n/translations/en/${namespace}.json`);
const esJsonPath = path.resolve(process.cwd(), `apps/dashboard/src/lib/i18n/translations/es/${namespace}.json`);

if (!fs.existsSync(enJsonPath)) {
  console.error(`❌ Error: No existe el archivo EN: ${enJsonPath}`);
  process.exit(1);
}

if (!fs.existsSync(esJsonPath)) {
  console.error(`❌ Error: No existe el archivo ES: ${esJsonPath}`);
  process.exit(1);
}

// Load JSON files
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const esJson = JSON.parse(fs.readFileSync(esJsonPath, 'utf8'));

/**
 * Get all keys from a nested object
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursive for nested objects
        keys.push(...getAllKeys(obj[key], fullKey));
      } else {
        // Leaf node - this is a translatable key
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

/**
 * Recursively find all TS/TSX files
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Extract all translation keys from code
 */
function extractTranslationKeys(modulePath) {
  const keys = new Set();
  
  try {
    const files = findFiles(modulePath);
    
    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Only process files that use useTranslation
      if (!content.includes('useTranslation')) continue;
      
      const patterns = [
        /\bt\(['"]([^'"]+)['"]/g,
        /\bt\(`([^`]+)`/g,
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1];
          
          if (!key || !key.trim()) continue;
          if (key.startsWith('format') || key.includes('Date') || key.includes('Time') || key.includes('Currency') || key.includes('Number')) continue;
          if (key.includes('${')) {
            const basePath = key.split('${')[0].replace(/\.$/, '').trim();
            if (basePath && basePath.length > 0 && !basePath.includes('format')) {
              keys.add(basePath + '.*');
            }
            continue;
          }
          
          const cleanKey = key.split(',')[0].split(')')[0].trim();
          
          if (!cleanKey || cleanKey.length === 0 || cleanKey === '.' || cleanKey.length < 2) continue;
          if (cleanKey.includes('PPP') || cleanKey.includes('en-US') || cleanKey === 'T') continue;
          
          keys.add(cleanKey);
        }
      }
    }
  } catch (error) {
    console.error(`⚠️  Error al buscar archivos: ${error.message}`);
  }
  
  return Array.from(keys);
}

// Main execution
console.log('\n🔍 Detectando claves i18n faltantes...\n');
console.log(`📁 Módulo: ${modulePath}`);
console.log(`📦 Namespace: ${namespace}\n`);

// Extract keys from code
console.log('📋 Extrayendo claves del código...');
const codeKeys = extractTranslationKeys(fullModulePath);

if (codeKeys.length === 0) {
  console.log('⚠️  No se encontraron claves de traducción en el código.');
  process.exit(0);
}

console.log(`   ✅ Encontradas ${codeKeys.length} claves en código\n`);

// Get all keys from JSON
console.log('📋 Extrayendo claves del JSON...');
const enNamespaceContent = enJson[namespace] || {};
const esNamespaceContent = esJson[namespace] || {};

const enKeys = getAllKeys(enNamespaceContent);
const esKeys = getAllKeys(esNamespaceContent);

console.log(`   ✅ Encontradas ${enKeys.length} claves en EN JSON`);
console.log(`   ✅ Encontradas ${esKeys.length} claves en ES JSON\n`);

// Find missing keys
const missingInEn = [];
const missingInEs = [];
const dynamicKeys = [];

for (const key of codeKeys) {
  if (key.endsWith('.*')) {
    dynamicKeys.push(key);
    continue;
  }
  
  if (!enKeys.includes(key)) {
    missingInEn.push(key);
  }
  
  if (!esKeys.includes(key)) {
    missingInEs.push(key);
  }
}

// Find keys in JSON that are not used in code (potentially unused)
const unusedKeys = [];
for (const jsonKey of enKeys) {
  if (!codeKeys.some(codeKey => {
    if (codeKey.endsWith('.*')) {
      const basePath = codeKey.replace('.*', '');
      return jsonKey.startsWith(basePath);
    }
    return codeKey === jsonKey;
  })) {
    unusedKeys.push(jsonKey);
  }
}

// Report results
console.log('📊 Resultados:\n');

if (codeKeys.length > 0 && missingInEn.length === 0 && missingInEs.length === 0) {
  console.log(`   ✅ Todas las claves del código existen en ambos JSON`);
} else {
  if (missingInEn.length > 0) {
    console.log(`   ❌ ${missingInEn.length} claves FALTANTES en EN:`);
    missingInEn.forEach(key => {
      console.log(`      - ${namespace}.${key}`);
    });
    console.log();
  }
  
  if (missingInEs.length > 0) {
    console.log(`   ❌ ${missingInEs.length} claves FALTANTES en ES:`);
    missingInEs.forEach(key => {
      console.log(`      - ${namespace}.${key}`);
    });
    console.log();
  }
}

if (dynamicKeys.length > 0) {
  console.log(`   ⚠️  ${dynamicKeys.length} claves dinámicas encontradas (requieren validación manual):`);
  dynamicKeys.forEach(key => {
    console.log(`      - ${key}`);
  });
  console.log();
}

if (unusedKeys.length > 0 && unusedKeys.length < 50) {
  console.log(`   ℹ️  ${unusedKeys.length} claves en JSON que NO se usan en código (potencialmente sin usar):`);
  unusedKeys.slice(0, 20).forEach(key => {
    console.log(`      - ${key}`);
  });
  if (unusedKeys.length > 20) {
    console.log(`      ... y ${unusedKeys.length - 20} más`);
  }
  console.log();
}

// Generate report
if (missingInEn.length > 0 || missingInEs.length > 0) {
  console.log('📝 Claves faltantes que DEBEN agregarse al JSON:\n');
  
  if (missingInEn.length > 0) {
    console.log('EN JSON:');
    missingInEn.forEach(key => {
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      const value = missingInEs.includes(key) ? `"${lastPart}"` : `"TODO: Traducir ${lastPart}"`;
      console.log(`  "${key}": ${value},`);
    });
    console.log();
  }
  
  if (missingInEs.length > 0) {
    console.log('ES JSON:');
    missingInEs.forEach(key => {
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      console.log(`  "${key}": "TODO: Traducir ${lastPart}",`);
    });
    console.log();
  }
}

// Exit with error if there are missing keys
const hasErrors = missingInEn.length > 0 || missingInEs.length > 0;

if (hasErrors) {
  console.log('❌ Hay claves faltantes que causan que aparezcan visibles en la UI.\n');
  console.log('📝 Acción requerida:');
  console.log('   1. Agregar las claves faltantes a ambos JSON (EN/ES)');
  console.log('   2. Asegurar que todas las claves sean strings válidos');
  console.log('   3. Ejecutar este script nuevamente para validar\n');
  process.exit(1);
} else {
  console.log('✅ Todas las claves usadas en el código existen en ambos idiomas.\n');
  process.exit(0);
}

