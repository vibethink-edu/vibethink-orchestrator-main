#!/usr/bin/env node

/**
 * Script de Validación de Claves i18n
 * 
 * Valida que todas las claves de traducción usadas en el código existan
 * en los archivos JSON de traducción (EN/ES).
 * 
 * Uso:
 *   node scripts/validate-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/hotel --namespace hotel
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
  console.log('  node scripts/validate-i18n-keys.js --module <ruta-modulo> --namespace <namespace>');
  console.log('\nEjemplo:');
  console.log('  node scripts/validate-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/hotel --namespace hotel');
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
 * Get nested value from object by path
 */
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
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
    // Find all TypeScript/TSX files recursively
    const files = findFiles(modulePath);
    
    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Match t('key'), t("key"), t(`key`), t('key', params), etc.
      // Only match if it's useTranslation context (not formatDate, formatTime, etc.)
      const patterns = [
        /\bt\(['"]([^'"]+)['"]/g,  // t('key') or t("key") - \b ensures word boundary
        /\bt\(`([^`]+)`/g,          // t(`key`)
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1];
          
          // Skip if key is empty or just whitespace
          if (!key || !key.trim()) continue;
          
          // Skip if it's a format function call (formatDate, formatTime, etc.)
          if (key.startsWith('format') || key.includes('Date') || key.includes('Time') || key.includes('Currency') || key.includes('Number')) {
            continue;
          }
          
          // Skip if key contains variable interpolation
          if (key.includes('${')) {
            // Extract base path (before ${})
            const basePath = key.split('${')[0].replace(/\.$/, '').trim();
            if (basePath && basePath.length > 0 && !basePath.includes('format')) {
              keys.add(basePath + '.*'); // Mark as dynamic
            }
            continue;
          }
          
          // Remove any trailing parameters (comma, closing paren, etc.)
          const cleanKey = key.split(',')[0].split(')')[0].trim();
          
          // Skip invalid keys
          if (!cleanKey || cleanKey.length === 0 || cleanKey === '.' || cleanKey.length < 2) {
            continue;
          }
          
          // Skip if it looks like a format string
          if (cleanKey.includes('PPP') || cleanKey.includes('en-US') || cleanKey === 'T') {
            continue;
          }
          
          keys.add(cleanKey);
        }
      }
    }
  } catch (error) {
    console.error(`⚠️  Error al buscar archivos: ${error.message}`);
  }
  
  return Array.from(keys);
}

/**
 * Validate that a key exists in JSON
 */
function validateKey(json, namespace, key) {
  const fullPath = `${namespace}.${key}`;
  const value = getNestedValue(json, fullPath);
  
  return {
    exists: value !== undefined,
    isString: typeof value === 'string',
    value: value
  };
}

// Main execution
console.log('\n🔍 Validando claves i18n...\n');
console.log(`📁 Módulo: ${modulePath}`);
console.log(`📦 Namespace: ${namespace}\n`);

// Extract keys from code
console.log('📋 Extrayendo claves del código...');
const codeKeys = extractTranslationKeys(fullModulePath);

if (codeKeys.length === 0) {
  console.log('⚠️  No se encontraron claves de traducción en el código.');
  process.exit(0);
}

console.log(`   ✅ Encontradas ${codeKeys.length} claves\n`);

// Validate each key
const missingInEn = [];
const missingInEs = [];
const notStringsEn = [];
const notStringsEs = [];
const valid = [];

console.log('✅ Validando existencia en JSON...\n');

for (const key of codeKeys) {
  // Skip dynamic keys (require manual validation)
  if (key.endsWith('.*')) {
    console.log(`   ⚠️  Clave dinámica (validación manual requerida): ${key}`);
    continue;
  }
  
  const enResult = validateKey(enJson, namespace, key);
  const esResult = validateKey(esJson, namespace, key);
  
  if (!enResult.exists) {
    missingInEn.push(key);
  } else if (!enResult.isString) {
    notStringsEn.push(key);
  }
  
  if (!esResult.exists) {
    missingInEs.push(key);
  } else if (!esResult.isString) {
    notStringsEs.push(key);
  }
  
  if (enResult.exists && esResult.exists && enResult.isString && esResult.isString) {
    valid.push(key);
  }
}

// Report results
console.log('📊 Resultados:\n');

if (valid.length > 0) {
  console.log(`   ✅ ${valid.length} claves válidas`);
}

if (missingInEn.length > 0) {
  console.log(`\n   ❌ ${missingInEn.length} claves FALTANTES en EN:`);
  missingInEn.forEach(key => {
    console.log(`      - ${namespace}.${key}`);
  });
}

if (missingInEs.length > 0) {
  console.log(`\n   ❌ ${missingInEs.length} claves FALTANTES en ES:`);
  missingInEs.forEach(key => {
    console.log(`      - ${namespace}.${key}`);
  });
}

if (notStringsEn.length > 0) {
  console.log(`\n   ⚠️  ${notStringsEn.length} claves en EN que NO son strings:`);
  notStringsEn.forEach(key => {
    console.log(`      - ${namespace}.${key}`);
  });
}

if (notStringsEs.length > 0) {
  console.log(`\n   ⚠️  ${notStringsEs.length} claves en ES que NO son strings:`);
  notStringsEs.forEach(key => {
    console.log(`      - ${namespace}.${key}`);
  });
}

// Exit with error if there are missing keys
const hasErrors = missingInEn.length > 0 || missingInEs.length > 0 || notStringsEn.length > 0 || notStringsEs.length > 0;

if (hasErrors) {
  console.log('\n❌ Validación fallida: Hay claves faltantes o inválidas.\n');
  console.log('📝 Acción requerida:');
  console.log('   1. Agregar las claves faltantes a ambos JSON (EN/ES)');
  console.log('   2. Verificar que todas las claves sean strings');
  console.log('   3. Ejecutar este script nuevamente para validar\n');
  process.exit(1);
} else {
  console.log('\n✅ Validación exitosa: Todas las claves existen en ambos idiomas.\n');
  process.exit(0);
}

