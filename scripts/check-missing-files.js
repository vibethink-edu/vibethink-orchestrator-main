const fs = require('fs');
const path = require('path');

const dir = 'apps/dashboard/src/lib/i18n/translations';
const en = fs.readdirSync(path.join(dir, 'en')).filter(f => f.endsWith('.json'));
const locales = ['es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];

let issues = [];
locales.forEach(loc => {
  const files = fs.readdirSync(path.join(dir, loc)).filter(f => f.endsWith('.json'));
  en.forEach(f => {
    if (!files.includes(f)) issues.push({ locale: loc, file: f });
  });
});

console.log('Missing files:', issues.length);
if (issues.length > 0) console.log(JSON.stringify(issues, null, 2));
