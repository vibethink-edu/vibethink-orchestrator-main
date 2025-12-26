#!/usr/bin/env node

/**
 * Script para limpiar keys de traducción inútiles (clases CSS, paths, etc.)
 */

const fs = require('fs');
const path = require('path');

const I18N_TRANSLATIONS_PATH = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');

/**
 * Verifica si una key es inútil (clase CSS, path, etc.)
 */
function isUselessKey(key, value) {
  // Clases CSS (contienen -, [, ], etc.)
  if (key.includes('_') && (key.includes('translate') || key.includes('flex') || key.includes('w-') || key.includes('h-') || key.includes('bg-') || key.includes('text-') || key.includes('border-') || key.includes('rounded'))) {
    return true;
  }
  
  // Paths de archivos
  if (value.includes('/') && (value.includes('.json') || value.includes('.tsx') || value.includes('.ts'))) {
    return true;
  }
  
  // Valores que son solo clases CSS
  if (value.match(/^[a-z-\[\]]+$/i) && value.length > 10) {
    return true;
  }
  
  // Keys que son solo números o muy cortas
  if (key.length < 3 || /^\d+$/.test(key)) {
    return true;
  }
  
  return false;
}

/**
 * Limpia un archivo de traducción
 */
function cleanTranslationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(content);
  
  const cleaned = {};
  let removed = 0;
  
  for (const [key, value] of Object.entries(translations)) {
    if (!isUselessKey(key, value)) {
      cleaned[key] = value;
    } else {
      removed++;
    }
  }
  
  // Escribir archivo limpio
  const cleanedContent = JSON.stringify(cleaned, null, 2);
  fs.writeFileSync(filePath, cleanedContent, 'utf8');
  
  return { kept: Object.keys(cleaned).length, removed };
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const moduleName = args[0];
  
  if (!moduleName) {
    console.log('Uso: node scripts/clean-translation-keys.js <module-name>');
    console.log('Ejemplo: node scripts/clean-translation-keys.js tasks');
    process.exit(1);
  }
  
  console.log(`\n🧹 Limpiando archivos de traducción: ${moduleName}\n`);
  
  const enPath = path.join(I18N_TRANSLATIONS_PATH, 'en', `${moduleName}.json`);
  const esPath = path.join(I18N_TRANSLATIONS_PATH, 'es', `${moduleName}.json`);
  
  if (!fs.existsSync(enPath)) {
    console.error(`❌ Archivo no existe: ${enPath}`);
    process.exit(1);
  }
  
  const enResult = cleanTranslationFile(enPath);
  const esResult = fs.existsSync(esPath) ? cleanTranslationFile(esPath) : { kept: 0, removed: 0 };
  
  console.log(`✅ Archivos limpiados:`);
  console.log(`   en.json: ${enResult.kept} keys mantenidas, ${enResult.removed} eliminadas`);
  console.log(`   es.json: ${esResult.kept} keys mantenidas, ${esResult.removed} eliminadas\n`);
}

main();






