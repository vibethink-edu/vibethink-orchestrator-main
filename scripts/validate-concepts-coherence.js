#!/usr/bin/env node
/**
 * Script de Validación de Coherencia de Conceptos
 *
 * Valida que todos los idiomas tengan:
 * 1. Los mismos archivos
 * 2. Las mismas keys en cada archivo
 * 3. No haya duplicados entre base y producto
 * 4. No haya traducciones faltantes
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');
const LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const CONCEPT_FILES = ['concept.json', 'concept-hotel.json', 'concept-studio.json', 'concept-cowork.json', 'concept-coliving.json'];

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateFileExists() {
  log('blue', '\n📁 VALIDACIÓN 1: Archivos existen en todos los idiomas\n');

  let allOk = true;

  CONCEPT_FILES.forEach(file => {
    const missing = [];
    LOCALES.forEach(locale => {
      const filePath = path.join(TRANSLATIONS_DIR, locale, file);
      if (!fs.existsSync(filePath)) {
        missing.push(locale);
        allOk = false;
      }
    });

    if (missing.length > 0) {
      log('red', `❌ ${file} falta en: ${missing.join(', ')}`);
    } else {
      log('green', `✅ ${file} existe en todos los idiomas`);
    }
  });

  return allOk;
}

function validateKeysCoherence() {
  log('blue', '\n🔑 VALIDACIÓN 2: Keys coherentes entre idiomas\n');

  let allOk = true;

  CONCEPT_FILES.forEach(file => {
    const keysPerLocale = {};

    // Obtener keys de cada idioma
    LOCALES.forEach(locale => {
      const filePath = path.join(TRANSLATIONS_DIR, locale, file);
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        keysPerLocale[locale] = getKeys(content).sort();
      }
    });

    // Comparar keys de EN con otros idiomas
    const enKeys = keysPerLocale['en'] || [];

    LOCALES.forEach(locale => {
      if (locale === 'en') return;

      const localeKeys = keysPerLocale[locale] || [];

      // Keys que faltan en este idioma
      const missing = enKeys.filter(key => !localeKeys.includes(key));
      // Keys extra en este idioma
      const extra = localeKeys.filter(key => !enKeys.includes(key));

      if (missing.length > 0) {
        log('red', `❌ ${file} (${locale}): Faltan ${missing.length} keys`);
        if (missing.length <= 5) {
          missing.forEach(key => log('yellow', `   - ${key}`));
        } else {
          log('yellow', `   Primeras 5: ${missing.slice(0, 5).join(', ')}`);
        }
        allOk = false;
      }

      if (extra.length > 0) {
        log('yellow', `⚠️  ${file} (${locale}): ${extra.length} keys extra (no están en EN)`);
        if (extra.length <= 5) {
          extra.forEach(key => log('cyan', `   + ${key}`));
        }
        allOk = false;
      }

      if (missing.length === 0 && extra.length === 0) {
        log('green', `✅ ${file} (${locale}): Keys coherentes con EN`);
      }
    });
  });

  return allOk;
}

function validateNoDuplicates() {
  log('blue', '\n🔄 VALIDACIÓN 3: No hay duplicados entre base y productos\n');

  let allOk = true;

  LOCALES.forEach(locale => {
    // Obtener keys de base
    const basePath = path.join(TRANSLATIONS_DIR, locale, 'concept.json');
    if (!fs.existsSync(basePath)) return;

    const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
    const baseKeys = getKeys(baseContent);

    // Verificar productos
    const productFiles = CONCEPT_FILES.filter(f => f !== 'concept.json');

    productFiles.forEach(file => {
      const productPath = path.join(TRANSLATIONS_DIR, locale, file);
      if (!fs.existsSync(productPath)) return;

      const productContent = JSON.parse(fs.readFileSync(productPath, 'utf-8'));
      const productKeys = getKeys(productContent);

      // Encontrar duplicados
      const duplicates = productKeys.filter(key => baseKeys.includes(key));

      if (duplicates.length > 0) {
        log('red', `❌ ${file} (${locale}): ${duplicates.length} keys duplicadas con base`);
        if (duplicates.length <= 5) {
          duplicates.forEach(key => log('yellow', `   - ${key}`));
        }
        allOk = false;
      }
    });
  });

  if (allOk) {
    log('green', '✅ No hay duplicados entre base y productos');
  }

  return allOk;
}

function validateTranslationsNotEmpty() {
  log('blue', '\n📝 VALIDACIÓN 4: Traducciones no están vacías\n');

  let allOk = true;
  let emptyCount = 0;

  CONCEPT_FILES.forEach(file => {
    LOCALES.forEach(locale => {
      const filePath = path.join(TRANSLATIONS_DIR, locale, file);
      if (!fs.existsSync(filePath)) return;

      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const keys = getKeys(content);

      keys.forEach(key => {
        const parts = key.split('.');
        let value = content;
        parts.forEach(part => {
          value = value?.[part];
        });

        if (typeof value === 'string' && value.trim() === '') {
          log('yellow', `⚠️  ${file} (${locale}): "${key}" está vacío`);
          emptyCount++;
          allOk = false;
        }
      });
    });
  });

  if (allOk) {
    log('green', '✅ Todas las traducciones tienen contenido');
  } else {
    log('yellow', `⚠️  Total de traducciones vacías: ${emptyCount}`);
  }

  return allOk;
}

function generateReport() {
  log('blue', '\n📊 REPORTE FINAL\n');

  const checks = [
    validateFileExists(),
    validateKeysCoherence(),
    validateNoDuplicates(),
    validateTranslationsNotEmpty(),
  ];

  const allPassed = checks.every(check => check);

  if (allPassed) {
    log('green', '\n✅ TODAS LAS VALIDACIONES PASARON\n');
    log('green', '   El sistema de conceptos está coherente y listo para usar.');
  } else {
    log('red', '\n❌ ALGUNAS VALIDACIONES FALLARON\n');
    log('yellow', '   Revisa los errores arriba y corrige antes de continuar.');
  }

  return allPassed ? 0 : 1;
}

// Ejecutar
console.log('🚀 Iniciando validación de coherencia de conceptos...\n');
process.exit(generateReport());
