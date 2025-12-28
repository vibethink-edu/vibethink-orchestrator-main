/**
 * Translate Namespace - Automated Translation Script
 *
 * This script translates a namespace from English to a target language
 * using the Anthropic Claude API.
 *
 * Usage: node scripts/translate-namespace.js <namespace> <targetLocale>
 * Example: node scripts/translate-namespace.js projects es
 *
 * Environment variable required:
 * ANTHROPIC_API_KEY - Your Anthropic API key
 */

const fs = require('fs');
const path = require('path');

// Load environment variables (override any existing)
require('dotenv').config({ override: true });

// Anthropic SDK - using require with fallback
let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch (error) {
  console.error('❌ @anthropic-ai/sdk not found. Install it with:');
  console.error('   npm install @anthropic-ai/sdk');
  process.exit(1);
}

// Configuration
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'apps', 'dashboard', 'src', 'lib', 'i18n', 'translations');
const BASELINE_LOCALE = 'en';

// Language mappings
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
  es: 'Use professional, concise Spanish suitable for business software UI. Use "tú" form for user-facing text.',
  ar: 'Use Modern Standard Arabic (MSA). Ensure proper RTL directionality. Use professional business terminology.',
  zh: 'Use Simplified Chinese characters. Use concise, professional terminology suitable for business software.',
  fr: 'Use professional, concise French suitable for business software UI. Use formal "vous" form.',
  pt: 'Use Brazilian Portuguese. Use professional, concise terminology suitable for business software.',
  de: 'Use professional, concise German suitable for business software UI. Use formal "Sie" form.',
  it: 'Use professional, concise Italian suitable for business software UI. Use formal "Lei" form.',
  ko: 'Use professional, concise Korean suitable for business software. Use formal honorific speech (존댓말).',
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
    console.error('  node scripts/translate-namespace.js <namespace> <targetLocale>');
    console.error('');
    console.error(colorize('Examples:', 'yellow'));
    console.error('  node scripts/translate-namespace.js projects es');
    console.error('  node scripts/translate-namespace.js default ar');
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
 * Translate using Anthropic Claude API
 */
async function translateWithClaude(enData, targetLocale, namespace) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error(colorize('❌ ANTHROPIC_API_KEY environment variable not set', 'red'));
    console.error('');
    console.error(colorize('Set it with:', 'yellow'));
    console.error('  Windows (PowerShell): $env:ANTHROPIC_API_KEY = "your-key"');
    console.error('  Windows (CMD): set ANTHROPIC_API_KEY=your-key');
    console.error('  Linux/Mac: export ANTHROPIC_API_KEY=your-key');
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });

  const languageName = LANGUAGE_NAMES[targetLocale];
  const languageContext = LANGUAGE_CONTEXTS[targetLocale];

  const prompt = `You are a professional translator specializing in software UI translations.

TASK: Translate this JSON file from English to ${languageName}.

CRITICAL RULES:
1. ONLY translate the VALUES, NEVER translate the keys
2. Preserve the exact JSON structure (nested objects must remain nested)
3. Preserve all placeholders like {{count}}, {percentage}, etc.
4. ${languageContext}
5. Keep technical terms consistent (e.g., "Dashboard", "CRM", "API")
6. Return ONLY valid JSON, no explanations or markdown code blocks
7. If a value contains HTML tags or special formatting, preserve them exactly
8. Keep acronyms in English (e.g., "CRM", "API", "UI")

NAMESPACE: ${namespace}
This is for a business dashboard application with project management features.

INPUT (English JSON):
${JSON.stringify(enData, null, 2)}

OUTPUT (${languageName} JSON):`;

  console.log(colorize(`  🤖 Calling Claude API...`, 'cyan'));
  console.log(colorize(`     Model: claude-sonnet-4-5-20250929`, 'blue'));
  console.log(colorize(`     Input size: ${JSON.stringify(enData).length} characters`, 'blue'));

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

    // Extract JSON from response (in case Claude wrapped it in markdown)
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*\n/, '').replace(/\n```\s*$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*\n/, '').replace(/\n```\s*$/, '');
    }

    // Parse the translated JSON
    const translatedData = JSON.parse(jsonText);

    console.log(colorize(`  ✅ Translation successful`, 'green'));
    console.log(colorize(`     Output size: ${JSON.stringify(translatedData).length} characters`, 'blue'));
    console.log(colorize(`     Tokens used: input=${message.usage.input_tokens}, output=${message.usage.output_tokens}`, 'blue'));

    return translatedData;

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(colorize(`❌ Failed to parse Claude's response as JSON`, 'red'));
      console.error(colorize(`   Error: ${error.message}`, 'red'));
    } else if (error.status === 401) {
      console.error(colorize(`❌ Authentication failed - Invalid API key`, 'red'));
    } else if (error.status === 429) {
      console.error(colorize(`❌ Rate limit exceeded - Please wait and try again`, 'red'));
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
  console.log(colorize('║  Automated Translation Tool                                               ║', 'bright'));
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
  const translatedData = await translateWithClaude(enData, targetLocale, namespace);

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
