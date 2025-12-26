#!/usr/bin/env node

/**
 * Script para extraer strings hardcoded de componentes y agregarlos a archivos de traducción
 * 
 * Este script:
 * 1. Escanea componentes de un módulo
 * 2. Identifica strings hardcoded (texto entre comillas)
 * 3. Genera keys de traducción sugeridas
 * 4. Actualiza archivos de traducción con nuevas keys
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_BUNDUI_PATH = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const I18N_TRANSLATIONS_PATH = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');

/**
 * Extrae strings hardcoded de un archivo
 */
function extractStringsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const strings = [];
  
  // Regex para encontrar strings entre comillas simples o dobles
  // Excluye strings que son keys de objetos (ej: "key": "value")
  const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const matches = content.matchAll(stringRegex);
  
  for (const match of matches) {
    const str = match[0];
    // Filtrar strings que son:
    // - Imports/requires
    // - Keys de objetos JSON
    // - URLs
    // - IDs/classNames
    // - Strings muy cortos (< 2 caracteres)
    // - Strings que son solo números
    if (
      str.length > 2 &&
      !str.match(/^["'](import|require|from|export|use|@|\/|\.|#|className|id|key|href|src|alt|aria-)/) &&
      !str.match(/^["']\d+["']$/) &&
      !str.match(/^["'][a-z]+["']$/) && // Solo minúsculas (probablemente keys)
      !str.includes('${') && // Template literals
      !str.includes('`') // Template literals
    ) {
      // Limpiar comillas
      const cleanStr = str.slice(1, -1);
      // Solo agregar si tiene contenido significativo
      if (cleanStr.trim().length > 1 && /[A-Za-z]/.test(cleanStr)) {
        strings.push(cleanStr);
      }
    }
  }
  
  return [...new Set(strings)]; // Eliminar duplicados
}

/**
 * Genera una key de traducción sugerida a partir de un string
 */
function generateTranslationKey(str) {
  // Limpiar string
  let key = str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
    .replace(/_+/g, '_') // Remover guiones bajos duplicados
    .trim();
  
  // Limitar longitud
  if (key.length > 50) {
    key = key.substring(0, 50);
  }
  
  return key;
}

/**
 * Escanea un módulo y extrae strings
 */
function scanModule(moduleName) {
  const modulePath = path.join(DASHBOARD_BUNDUI_PATH, moduleName);
  
  if (!fs.existsSync(modulePath)) {
    console.log(`⚠️  Módulo ${moduleName} no existe`);
    return [];
  }
  
  const strings = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Ignorar node_modules, .next, etc.
        if (!file.startsWith('.') && file !== 'node_modules') {
          scanDirectory(filePath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        try {
          const extracted = extractStringsFromFile(filePath);
          strings.push(...extracted);
        } catch (error) {
          console.error(`Error procesando ${filePath}:`, error.message);
        }
      }
    }
  }
  
  scanDirectory(modulePath);
  
  return [...new Set(strings)]; // Eliminar duplicados
}

/**
 * Actualiza archivo de traducción con nuevas keys
 */
function updateTranslationFile(moduleName, locale, newStrings) {
  const filePath = path.join(I18N_TRANSLATIONS_PATH, locale, `${moduleName}.json`);
  
  // Leer archivo existente
  let translations = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    translations = JSON.parse(content);
  }
  
  // Agregar nuevas keys
  let added = 0;
  for (const str of newStrings) {
    const key = generateTranslationKey(str);
    
    // Solo agregar si no existe
    if (!translations[key]) {
      translations[key] = locale === 'en' ? str : ''; // En español dejar vacío para traducir después
      added++;
    }
  }
  
  // Escribir archivo
  const content = JSON.stringify(translations, null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
  
  return added;
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const moduleName = args[0];
  
  if (!moduleName) {
    console.log('Uso: node scripts/extract-hardcoded-strings.js <module-name>');
    console.log('Ejemplo: node scripts/extract-hardcoded-strings.js tasks');
    process.exit(1);
  }
  
  console.log(`\n🔍 Escaneando módulo: ${moduleName}\n`);
  
  // Escanear módulo
  const strings = scanModule(moduleName);
  
  console.log(`📝 Strings encontrados: ${strings.length}`);
  console.log(`   Ejemplos: ${strings.slice(0, 5).join(', ')}...\n`);
  
  // Actualizar archivos de traducción
  const addedEn = updateTranslationFile(moduleName, 'en', strings);
  const addedEs = updateTranslationFile(moduleName, 'es', strings);
  
  console.log(`✅ Archivos actualizados:`);
  console.log(`   en.json: ${addedEn} nuevas keys`);
  console.log(`   es.json: ${addedEs} nuevas keys`);
  console.log(`\n💡 Revisa los archivos y completa las traducciones en español\n`);
}

// Ejecutar
main();








