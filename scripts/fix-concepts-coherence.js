#!/usr/bin/env node
/**
 * Script de Arreglo Automático de Coherencia de Conceptos
 *
 * Arregla automáticamente:
 * 1. Sincroniza keys entre idiomas (EN es master)
 * 2. Elimina duplicados entre base y productos
 * 3. Preserva traducciones existentes
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');
const LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const CONCEPT_FILES = ['concept.json', 'concept-hotel.json', 'concept-studio.json', 'concept-cowork.json', 'concept-coliving.json'];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getValueAtPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function setValueAtPath(obj, path, value) {
  const parts = path.split('.');
  const lastPart = parts.pop();
  let current = obj;

  for (const part of parts) {
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }

  current[lastPart] = value;
}

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !('label' in obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function syncKeysAcrossLocales(file) {
  console.log(`\n📄 Sincronizando ${file}...`);

  // Leer EN como master
  const enPath = path.join(TRANSLATIONS_DIR, 'en', file);
  const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const enKeys = getKeys(enContent);

  console.log(`  EN tiene ${enKeys.length} keys`);

  // Sincronizar otros idiomas
  LOCALES.forEach(locale => {
    if (locale === 'en') return;

    const localePath = path.join(TRANSLATIONS_DIR, locale, file);
    if (!fs.existsSync(localePath)) return;

    const localeContent = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    const localeKeys = getKeys(localeContent);

    // Keys que faltan
    const missing = enKeys.filter(key => {
      const value = getValueAtPath(localeContent, key);
      return value === undefined;
    });

    // Keys extra (que no están en EN)
    const extra = localeKeys.filter(key => {
      const value = getValueAtPath(enContent, key);
      return value === undefined;
    });

    // Crear nuevo objeto con estructura de EN
    const newContent = deepClone(enContent);

    // Preservar traducciones existentes
    enKeys.forEach(key => {
      const existingValue = getValueAtPath(localeContent, key);
      if (existingValue !== undefined) {
        setValueAtPath(newContent, key, existingValue);
      }
      // Si no existe, se queda con el valor de EN (temporal)
    });

    // Guardar
    fs.writeFileSync(localePath, JSON.stringify(newContent, null, 2), 'utf-8');

    if (missing.length > 0 || extra.length > 0) {
      console.log(`  ✅ ${locale}: Agregadas ${missing.length} keys, removidas ${extra.length} keys extra`);
    } else {
      console.log(`  ✅ ${locale}: Ya estaba sincronizado`);
    }
  });
}

function removeDuplicatesBetweenBaseAndProducts() {
  console.log(`\n🔄 Eliminando duplicados entre base y productos...`);

  LOCALES.forEach(locale => {
    // Leer base
    const basePath = path.join(TRANSLATIONS_DIR, locale, 'concept.json');
    const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
    const baseKeys = getKeys(baseContent);

    // Procesar cada producto
    const productFiles = CONCEPT_FILES.filter(f => f !== 'concept.json');

    productFiles.forEach(file => {
      const productPath = path.join(TRANSLATIONS_DIR, locale, file);
      const productContent = JSON.parse(fs.readFileSync(productPath, 'utf-8'));
      const productKeys = getKeys(productContent);

      // Encontrar duplicados
      const duplicates = productKeys.filter(key => baseKeys.includes(key));

      if (duplicates.length > 0) {
        // Crear nuevo objeto sin duplicados
        const newContent = deepClone(productContent);

        duplicates.forEach(key => {
          // Eliminar del producto (queda en base)
          const parts = key.split('.');
          const lastPart = parts.pop();
          let current = newContent;

          for (const part of parts) {
            current = current[part];
            if (!current) break;
          }

          if (current && lastPart in current) {
            delete current[lastPart];
          }

          // Limpiar objetos vacíos
          function cleanEmptyObjects(obj) {
            for (const key in obj) {
              if (typeof obj[key] === 'object' && obj[key] !== null && Object.keys(obj[key]).length === 0) {
                delete obj[key];
              } else if (typeof obj[key] === 'object') {
                cleanEmptyObjects(obj[key]);
              }
            }
          }
          cleanEmptyObjects(newContent);
        });

        fs.writeFileSync(productPath, JSON.stringify(newContent, null, 2), 'utf-8');
        console.log(`  ✅ ${file} (${locale}): Removidos ${duplicates.length} duplicados`);
      }
    });
  });
}

console.log('🚀 Iniciando arreglo automático de coherencia...\n');

// Paso 1: Sincronizar keys
CONCEPT_FILES.forEach(syncKeysAcrossLocales);

// Paso 2: Eliminar duplicados
removeDuplicatesBetweenBaseAndProducts();

console.log('\n✅ Arreglo completado!');
console.log('\n⚠️  IMPORTANTE: Revisa los archivos manualmente.');
console.log('   Algunos valores pueden estar en inglés temporalmente.');
console.log('\n🔍 Ejecuta: node scripts/validate-concepts-coherence.js para verificar.');
