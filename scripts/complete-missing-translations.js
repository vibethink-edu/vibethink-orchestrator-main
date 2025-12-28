/**
 * Complete Missing Translations - Smart Merge Script
 *
 * This script:
 * 1. Reads the audit report to find missing keys
 * 2. Translates ONLY the missing keys using Anthropic Claude API
 * 3. Merges translations with existing files (preserves existing work)
 *
 * Usage: node scripts/complete-missing-translations.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ override: true });

// Anthropic SDK
let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch (error) {
  console.error('❌ @anthropic-ai/sdk not found. Install it with: npm install @anthropic-ai/sdk');
  process.exit(1);
}

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
 * Translate a batch of keys
 */
async function translateKeys(keys, namespace, targetLocale, anthropic) {
  const languageName = LANGUAGE_NAMES[targetLocale];
  const context = LANGUAGE_CONTEXTS[targetLocale];

  // Create a mini JSON with only the keys to translate
  const keysToTranslate = keys.join('\n');

  const prompt = `You are translating UI strings for a project management dashboard from English to ${languageName}.

CONTEXT:
${context}

NAMESPACE: ${namespace}

CRITICAL RULES:
1. Translate ONLY the English text values
2. Keep the output format exactly as: "key.path" = "translated value"
3. DO NOT translate technical terms: Dashboard, API, CRM, ID, URL, etc.
4. Keep placeholders unchanged: {{count}}, {percentage}, etc.
5. Use professional, concise UI language

KEYS TO TRANSLATE (one per line):
${keysToTranslate}

OUTPUT FORMAT (one translation per line):
"key.path" = "translated value"

TRANSLATIONS:`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const response = message.content[0].text;

  // Parse response into key-value pairs
  const translations = {};
  const lines = response.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const match = line.match(/"([^"]+)"\s*=\s*"([^"]+)"/);
    if (match) {
      const [, key, value] = match;
      translations[key] = value;
    }
  }

  return translations;
}

/**
 * Process a single namespace/locale combination
 */
async function processNamespaceLocale(namespace, locale, missingKeys, anthropic) {
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

  // Translate in batch
  const translations = await translateKeys(keysWithValues, namespace, locale, anthropic);

  // Merge translations into locale data
  let updatedCount = 0;
  for (const [key, value] of Object.entries(translations)) {
    setNestedValue(localeData, key, value);
    updatedCount++;
  }

  // Write updated file
  fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n', 'utf8');

  console.log(colorize(`  ✅ Updated ${updatedCount} keys in ${locale}/${namespace}.json`, 'green'));

  // Add small delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log(colorize('  Complete Missing Translations - Smart Merge', 'bright'));
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log('');

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(colorize('❌ ANTHROPIC_API_KEY environment variable not set', 'red'));
    console.error('');
    console.error(colorize('Add it to your .env file:', 'yellow'));
    console.error(colorize('  ANTHROPIC_API_KEY=your-anthropic-api-key', 'cyan'));
    console.error('');
    process.exit(1);
  }

  // Initialize Anthropic
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

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
          localeData.missingKeys,
          anthropic
        );
        totalProcessed += localeData.missingKeys.length;
      }
    }
  }

  console.log('');
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log(colorize(`  ✅ Completed! Translated ${totalProcessed} keys`, 'green'));
  console.log(colorize('═'.repeat(79), 'cyan'));
  console.log('');
  console.log(colorize('Next steps:', 'yellow'));
  console.log('  1. Run audit again: node scripts/audit-missing-translations-projects-v2.js');
  console.log('  2. Verify translations in browser');
  console.log('  3. Commit changes');
  console.log('');
}

main().catch(error => {
  console.error(colorize('❌ Error:', 'red'), error.message);
  console.error(error.stack);
  process.exit(1);
});
