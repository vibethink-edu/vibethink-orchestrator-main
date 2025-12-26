#!/usr/bin/env node
/**
 * Script para sincronizar estructura de traducciones
 *
 * Problema: Algunos idiomas tienen estructura incompleta vs EN (base)
 * Solución: Copiar estructura de EN a otros idiomas manteniendo traducciones existentes
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');
const BASE_LOCALE = 'en';
const TARGET_LOCALES = ['es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];

// Archivos a sincronizar (solo los que tienen problemas)
const FILES_TO_SYNC = [
  'projects.json',
  // Agregar más archivos si es necesario
];

function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (!result[key]) {
      // Solo copiar si no existe en target
      result[key] = source[key];
    }
  }

  return result;
}

function syncFile(fileName) {
  console.log(`\n📄 Syncing ${fileName}...`);

  const basePath = path.join(TRANSLATIONS_DIR, BASE_LOCALE, fileName);

  if (!fs.existsSync(basePath)) {
    console.log(`  ⚠️  Base file not found: ${basePath}`);
    return;
  }

  const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

  TARGET_LOCALES.forEach(locale => {
    const targetPath = path.join(TRANSLATIONS_DIR, locale, fileName);

    if (!fs.existsSync(targetPath)) {
      console.log(`  ⚠️  ${locale}: File not found, creating from base...`);
      fs.writeFileSync(targetPath, JSON.stringify(baseContent, null, 2), 'utf-8');
      console.log(`  ✅ ${locale}: Created`);
      return;
    }

    const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    const merged = deepMerge(targetContent, baseContent);

    fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`  ✅ ${locale}: Synced`);
  });
}

console.log('🚀 Starting translation structure sync...');
console.log(`📂 Base locale: ${BASE_LOCALE}`);
console.log(`🌍 Target locales: ${TARGET_LOCALES.join(', ')}`);

FILES_TO_SYNC.forEach(syncFile);

console.log('\n✅ Sync complete!');
console.log('\n⚠️  IMPORTANT: Review merged files manually for translation quality.');
