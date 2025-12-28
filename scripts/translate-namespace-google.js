/**
 * Translate Namespace - Google Cloud Translation API
 *
 * This script translates a namespace from English to a target language
 * using Google Cloud Translation API.
 *
 * Usage: node scripts/translate-namespace-google.js <namespace> <targetLocale>
 * Example: node scripts/translate-namespace-google.js projects es
 *
 * Environment variable required:
 * GOOGLE_TRANSLATE_API_KEY - Your Google Cloud Translation API key
 */

const fs = require('fs');
const path = require('path');

// Load environment variables (override any existing)
require('dotenv').config({ override: true });

// Google Cloud Translation
const { Translate } = require('@google-cloud/translate').v2;

// Configuration
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'apps', 'dashboard', 'src', 'lib', 'i18n', 'translations');
const BASELINE_LOCALE = 'en';

// Language mappings (Google Translate language codes)
const LANGUAGE_CODES = {
  es: 'es',
  ar: 'ar',
  zh: 'zh-CN', // Simplified Chinese
  fr: 'fr',
  pt: 'pt',
  de: 'de',
  it: 'it',
  ko: 'ko',
};

const LANGUAGE_NAMES = {
  es: 'Spanish (Spain)',
  ar: 'Arabic',
  zh: 'Chinese (Simplified)',
  fr: 'French',
  pt: 'Portuguese (Brazil)',
  de: 'German',
  it: 'Italian',
  ko: 'Korean',
};

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Validate command line arguments
 */
function validateArgs() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error(colorize('❌ Invalid arguments', 'red'));
    console.error('');
    console.error(colorize('Usage:', 'yellow'));
    console.error('  node scripts/translate-namespace-google.js <namespace> <targetLocale>');
    console.error('');
    console.error(colorize('Examples:', 'yellow'));
    console.error('  node scripts/translate-namespace-google.js projects es');
    console.error('  node scripts/translate-namespace-google.js default ar');
    console.error('');
    console.error(colorize('Available locales:', 'yellow'));
    console.error('  ' + Object.keys(LANGUAGE_NAMES).join(', '));
    process.exit(1);
  }

  const [namespace, targetLocale] = args;

  if (!LANGUAGE_NAMES[targetLocale]) {
    console.error(colorize(`❌ Invalid locale: ${targetLocale}`, 'red'));
    console.error('');
    console.error(colorize('Available locales:', 'yellow'));
    console.error('  ' + Object.keys(LANGUAGE_NAMES).join(', '));
    process.exit(1);
  }

  return { namespace, targetLocale };
}

/**
 * Load existing translation or create empty object
 */
function loadExistingTranslation(locale, namespace) {
  const filePath = path.join(TRANSLATIONS_DIR, locale, `${namespace}.json`);

  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
      console.warn(colorize(`⚠️  Warning: Could not parse existing ${locale}/${namespace}.json`, 'yellow'));
      return {};
    }
  }

  return {};
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Flatten nested JSON object for translation
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], fullKey));
    } else {
      flattened[fullKey] = obj[key];
    }
  }

  return flattened;
}

/**
 * Unflatten object back to nested structure
 */
function unflattenObject(flattened) {
  const result = {};

  for (const key in flattened) {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = flattened[key];
  }

  return result;
}

/**
 * Translate using Google Cloud Translation API
 */
async function translateWithGoogle(enData, targetLocale, namespace) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    console.error(colorize('❌ GOOGLE_TRANSLATE_API_KEY environment variable not set', 'red'));
    console.error('');
    console.error(colorize('Add it to your .env file:', 'yellow'));
    console.error('  GOOGLE_TRANSLATE_API_KEY=your-google-api-key');
    process.exit(1);
  }

  const translate = new Translate({ key: apiKey });
  const targetLangCode = LANGUAGE_CODES[targetLocale];
  const languageName = LANGUAGE_NAMES[targetLocale];

  console.log(colorize(`  🤖 Using Google Cloud Translation API...`, 'cyan'));
  console.log(colorize(`     Target language: ${languageName} (${targetLangCode})`, 'blue'));

  // Flatten the object for batch translation
  const flattened = flattenObject(enData);
  const keys = Object.keys(flattened);
  const values = Object.values(flattened);

  console.log(colorize(`     Total strings to translate: ${values.length}`, 'blue'));

  try {
    // Google Translate API has a limit of ~5000 characters per request
    // We'll batch the translations in chunks
    const BATCH_SIZE = 100; // Translate 100 strings at a time
    const translatedValues = [];

    for (let i = 0; i < values.length; i += BATCH_SIZE) {
      const batch = values.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(values.length / BATCH_SIZE);

      console.log(colorize(`     Translating batch ${batchNum}/${totalBatches}...`, 'blue'));

      const [translations] = await translate.translate(batch, targetLangCode);
      const translationsArray = Array.isArray(translations) ? translations : [translations];
      translatedValues.push(...translationsArray);

      // Rate limiting - wait 500ms between batches
      if (i + BATCH_SIZE < values.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Reconstruct the object
    const translatedFlattened = {};
    keys.forEach((key, index) => {
      translatedFlattened[key] = translatedValues[index];
    });

    const translatedData = unflattenObject(translatedFlattened);

    console.log(colorize(`  ✅ Translation successful`, 'green'));
    console.log(colorize(`     Translated ${translatedValues.length} strings`, 'blue'));

    return translatedData;

  } catch (error) {
    if (error.code === 403) {
      console.error(colorize(`❌ API key invalid or quota exceeded`, 'red'));
    } else if (error.code === 400) {
      console.error(colorize(`❌ Bad request - check API key and configuration`, 'red'));
    } else {
      console.error(colorize(`❌ Translation failed: ${error.message}`, 'red'));
    }
    throw error;
  }
}

/**
 * Main translation function
 */
async function translateNamespace(namespace, targetLocale) {
  console.log(colorize('\n╔════════════════════════════════════════════════════════════════════════════╗', 'bright'));
  console.log(colorize('║  Google Cloud Translation Tool                                             ║', 'bright'));
  console.log(colorize('╚════════════════════════════════════════════════════════════════════════════╝', 'bright'));
  console.log('');
  console.log(`  ${colorize('Namespace:', 'blue')} ${namespace}`);
  console.log(`  ${colorize('Source Language:', 'blue')} English (en)`);
  console.log(`  ${colorize('Target Language:', 'blue')} ${LANGUAGE_NAMES[targetLocale]} (${targetLocale})`);
  console.log('');

  // Load baseline (English) file
  const baselinePath = path.join(TRANSLATIONS_DIR, BASELINE_LOCALE, `${namespace}.json`);

  if (!fs.existsSync(baselinePath)) {
    console.error(colorize(`❌ Baseline file not found: ${baselinePath}`, 'red'));
    process.exit(1);
  }

  console.log(colorize('  📖 Loading English baseline...', 'cyan'));
  const enData = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
  const keyCount = JSON.stringify(enData).split(':').length - 1;
  console.log(colorize(`     ✓ Loaded ${keyCount} keys from ${namespace}.json`, 'green'));

  // Load existing translation (if any)
  console.log(colorize(`  📖 Loading existing ${targetLocale} translation...`, 'cyan'));
  const existingData = loadExistingTranslation(targetLocale, namespace);
  const existingKeyCount = Object.keys(existingData).length;

  if (existingKeyCount > 0) {
    console.log(colorize(`     ✓ Found existing translation with ${existingKeyCount} top-level keys`, 'green'));
    console.log(colorize(`     ℹ  Will merge with new translation`, 'blue'));
  } else {
    console.log(colorize(`     ℹ  No existing translation found - will create new file`, 'blue'));
  }

  console.log('');
  console.log(colorize('  🚀 Starting translation...', 'cyan'));

  // Translate
  const translatedData = await translateWithGoogle(enData, targetLocale, namespace);

  // Merge with existing translation (prefer new translations)
  const finalData = deepMerge(existingData, translatedData);

  // Save the translation
  const targetPath = path.join(TRANSLATIONS_DIR, targetLocale, `${namespace}.json`);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, JSON.stringify(finalData, null, 2) + '\n', 'utf-8');

  console.log('');
  console.log(colorize('  ✅ Translation complete!', 'green'));
  console.log(colorize(`     Saved to: ${targetPath}`, 'blue'));
  console.log('');
  console.log(colorize('─'.repeat(80), 'cyan'));
  console.log('');
}

// Main execution
(async () => {
  try {
    const { namespace, targetLocale } = validateArgs();
    await translateNamespace(namespace, targetLocale);
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error(colorize('❌ Translation failed', 'red'));
    console.error(colorize(`   ${error.message}`, 'red'));
    console.error('');
    process.exit(1);
  }
})();
