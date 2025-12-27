/**
 * Complete Missing Translations - Z.AI Translation System
 *
 * Uses Z.AI's translation agent instead of direct Anthropic API
 * Reference: https://docs.z.ai/guides/agents/translation
 */

const fs = require('fs');
const path = require('path');

// TODO: Import Z.AI translation agent
// const { translateText } = require('@z-ai/translation'); // Or whatever you use

// Paths
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'apps', 'dashboard', 'src', 'lib', 'i18n', 'translations');
const AUDIT_REPORT = path.join(__dirname, '..', 'docs', 'testing', 'translation-audit-report.json');

// Language configs
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

const LANGUAGE_CONTEXTS = {
  es: 'Professional Spanish for business UI. Use "tú" form.',
  ar: 'Modern Standard Arabic (MSA). Consider RTL layout.',
  zh: 'Simplified Chinese. Concise business terminology.',
  fr: 'Professional French for business UI. Use formal "vous".',
  pt: 'Brazilian Portuguese. Professional business terminology.',
  de: 'Professional German for business UI. Use formal "Sie".',
  it: 'Professional Italian for business UI. Use formal "Lei".',
  ko: 'Professional Korean. Use formal honorific speech (존댓말).',
};

// Colors
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
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set nested value in object using dot notation
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Translate a batch of keys using Z.AI Translation
 */
async function translateKeysWithZAI(keys, namespace, targetLocale) {
  const languageName = LANGUAGE_NAMES[targetLocale];
  const context = LANGUAGE_CONTEXTS[targetLocale];

  // Parse keys to extract just the English text values
  const keysData = keys.map(keyValue => {
    const match = keyValue.match(/^(.+) = "(.+)"$/);
    if (match) {
      return {
        key: match[1],
        text: match[2]
      };
    }
    return null;
  }).filter(Boolean);

  console.log(`    Translating ${keysData.length} keys to ${languageName}...`);

  // TODO: Replace this with your actual Z.AI translation call
  // Reference: https://docs.z.ai/guides/agents/translation
  //
  // Example (adapt to your Z.AI SDK):
  /*
  const translatedTexts = await translateText({
    texts: keysData.map(k => k.text),
    targetLanguage: languageName,
    sourceLanguage: 'English',
    context: `${context}\n\nNamespace: ${namespace}\n\nThis is UI text for a project management dashboard.`,
    instructions: [
      'Preserve placeholders exactly as they appear ({{count}}, {percentage}, etc.)',
      'Do not translate technical terms: Dashboard, API, CRM, ID, URL, Email, etc.',
      'Use professional, concise UI language appropriate for business software',
      'Keep translations short and clear, suitable for buttons and labels'
    ]
  });

  // Build result object
  const translations = {};
  keysData.forEach((keyData, index) => {
    translations[keyData.key] = translatedTexts[index];
  });

  return translations;
  */

  // TEMPORARY: Mock implementation until you set up Z.AI
  console.log(colorize(`    ⚠️ Z.AI translation not yet implemented`, 'yellow'));
  console.log(colorize(`    TODO: Implement translateText() call in this function`, 'yellow'));
  console.log(`    Keys to translate: ${keysData.map(k => k.key).join(', ')}`);

  // Return empty object (you need to implement the actual translation)
  return {};
}

/**
 * Process a single namespace/locale combination
 */
async function processNamespaceLocale(namespace, locale, missingKeys) {
  console.log(colorize(`\n  Processing: ${namespace}/${locale} (${missingKeys.length} keys)`, 'cyan'));

  const enPath = path.join(TRANSLATIONS_DIR, 'en', `${namespace}.json`);
  const localePath = path.join(TRANSLATIONS_DIR, locale, `${namespace}.json`);

  // Read English baseline
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  // Read existing locale file (or create empty object)
  let localeData = {};
  if (fs.existsSync(localePath)) {
    localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  }

  // Extract English values for missing keys
  const keysWithValues = missingKeys.map(key => {
    const enValue = getNestedValue(enData, key);
    return `${key} = "${enValue}"`;
  });

  // Translate using Z.AI
  const translations = await translateKeysWithZAI(keysWithValues, namespace, locale);

  // Merge translations into locale data
  let updatedCount = 0;
  for (const [key, value] of Object.entries(translations)) {
    setNestedValue(localeData, key, value);
    updatedCount++;
  }

  // Write updated file (even if empty, to track progress)
  fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n', 'utf8');

  if (updatedCount > 0) {
    console.log(colorize(`  ✅ Updated ${updatedCount} keys in ${locale}/${namespace}.json`, 'green'));
  } else {
    console.log(colorize(`  ⚠️ No keys updated (translation not implemented)`, 'yellow'));
  }

  // Add small delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log(colorize('  Complete Missing Translations - Z.AI System', 'bright'));
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log('');

  // Read audit report
  if (!fs.existsSync(AUDIT_REPORT)) {
    console.error(colorize('❌ Audit report not found. Run audit first:', 'red'));
    console.error(colorize('   node scripts/audit-missing-translations-projects-v2.js', 'yellow'));
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT_REPORT, 'utf8'));

  console.log(colorize(`  Total missing keys: ${audit.summary.totalMissingKeys}`, 'yellow'));
  console.log('');

  let totalProcessed = 0;

  // Process each namespace
  for (const nsData of audit.details) {
    const namespace = nsData.namespace;

    if (!nsData.missing || Object.keys(nsData.missing).length === 0) {
      continue;
    }

    console.log(colorize(`\n📋 Namespace: ${namespace}`, 'bright'));

    for (const [locale, localeData] of Object.entries(nsData.missing)) {
      if (localeData.missingKeys && localeData.missingKeys.length > 0) {
        await processNamespaceLocale(
          namespace,
          locale,
          localeData.missingKeys
        );
        totalProcessed += localeData.missingKeys.length;
      }
    }
  }

  console.log('');
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log(colorize(`  ✅ Completed! Processed ${totalProcessed} keys`, 'green'));
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log('');
  console.log(colorize('Next steps:', 'yellow'));
  console.log('  1. Run audit again: node scripts/audit-missing-translations-projects-v2.js');
  console.log('  2. Verify translations in browser');
  console.log('  3. Commit changes');
  console.log('');
  console.log(colorize('⚠️ REMINDER: You need to implement the translateKeysWithZAI() function', 'yellow'));
  console.log(colorize('   See: https://docs.z.ai/guides/agents/translation', 'cyan'));
  console.log('');
}

main().catch(error => {
  console.error(colorize('❌ Error:', 'red'), error.message);
  console.error(error.stack);
  process.exit(1);
});
