#!/usr/bin/env node
/**
 * Copy missing translation files from EN to other locales
 */

const fs = require('fs');
const path = require('path');

const dir = 'apps/dashboard/src/lib/i18n/translations';
const en = fs.readdirSync(path.join(dir, 'en')).filter(f => f.endsWith('.json'));
const locales = ['es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];

let copied = 0;
let skipped = 0;

locales.forEach(locale => {
  const localeDir = path.join(dir, locale);
  const existingFiles = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));

  en.forEach(file => {
    if (!existingFiles.includes(file)) {
      const source = path.join(dir, 'en', file);
      const target = path.join(localeDir, file);

      fs.copyFileSync(source, target);
      console.log(`✅ Copied ${locale}/${file}`);
      copied++;
    } else {
      skipped++;
    }
  });
});

console.log(`\n📊 Summary:`);
console.log(`  ✅ Copied: ${copied} files`);
console.log(`  ⏭️  Skipped (already exist): ${skipped} files`);
console.log(`\n⚠️  NOTE: Copied files are in ENGLISH. They need manual translation.`);
