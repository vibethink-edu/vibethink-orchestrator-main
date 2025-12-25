
const fs = require('fs');
const path = require('path');

const TARGET_NAMESPACE = 'dashboard-vibethink';
const SOURCE_LANG = 'en';
const DEST_LANGS = ['es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const BASE_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');

const sourcePath = path.join(BASE_DIR, SOURCE_LANG, `${TARGET_NAMESPACE}.json`);

if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    process.exit(1);
}

const sourceContent = fs.readFileSync(sourcePath);

console.log(`Checking and filling missing translations for: ${TARGET_NAMESPACE}`);

DEST_LANGS.forEach(lang => {
    const destDir = path.join(BASE_DIR, lang);
    const destPath = path.join(destDir, `${TARGET_NAMESPACE}.json`);

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`Created directory: ${lang}`);
    }

    if (!fs.existsSync(destPath)) {
        fs.writeFileSync(destPath, sourceContent);
        console.log(`✅ Created: ${lang}/${TARGET_NAMESPACE}.json`);
    } else {
        console.log(`ℹ️  Exists:  ${lang}/${TARGET_NAMESPACE}.json`);
    }
});

console.log('Done.');
