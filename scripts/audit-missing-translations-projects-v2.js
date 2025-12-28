/**
 * Audit Missing Translations - Projects V2
 *
 * This script audits translation completeness across all languages
 * for the projects-v2 module and related namespaces.
 *
 * Usage: node scripts/audit-missing-translations-projects-v2.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'apps', 'dashboard', 'src', 'lib', 'i18n', 'translations');
const NAMESPACES = ['projects', 'default', 'common', 'navigation'];
const LOCALES = ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko'];
const BASELINE_LOCALE = 'en';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Get all keys from a nested object (flattened)
 */
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

/**
 * Get value from nested object using dot notation
 */
function getValue(obj, key) {
  return key.split('.').reduce((o, k) => (o || {})[k], obj);
}

/**
 * Check if a value is missing or invalid
 */
function isMissingOrInvalid(value, baselineValue, locale) {
  // Value doesn't exist
  if (value === undefined || value === null) return true;

  // Value is empty string
  if (typeof value === 'string' && value.trim() === '') return true;

  // For non-English locales, check if value is same as English (not translated)
  if (locale !== BASELINE_LOCALE && value === baselineValue) return true;

  return false;
}

/**
 * Audit a single namespace across all locales
 */
function auditNamespace(namespace) {
  console.log('\n' + colorize('═'.repeat(80), 'cyan'));
  console.log(colorize(`  Auditing Namespace: ${namespace}`, 'bright'));
  console.log(colorize('═'.repeat(80), 'cyan'));

  const baselinePath = path.join(TRANSLATIONS_DIR, BASELINE_LOCALE, `${namespace}.json`);

  // Check if baseline file exists
  if (!fs.existsSync(baselinePath)) {
    console.log(colorize(`  ❌ Baseline file not found: ${baselinePath}`, 'red'));
    return {
      namespace,
      exists: false,
      total: 0,
      missing: {},
      summary: { total: 0, complete: 0, incomplete: 0, percentComplete: 0 }
    };
  }

  const baselineData = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
  const baselineKeys = getKeys(baselineData);

  console.log(`  ${colorize('Baseline:', 'blue')} ${BASELINE_LOCALE} (${baselineKeys.length} keys)`);
  console.log('');

  const results = {
    namespace,
    exists: true,
    total: baselineKeys.length,
    missing: {},
    summary: { total: 0, complete: 0, incomplete: 0 }
  };

  // Check each locale
  for (const locale of LOCALES) {
    if (locale === BASELINE_LOCALE) continue;

    const localePath = path.join(TRANSLATIONS_DIR, locale, `${namespace}.json`);

    if (!fs.existsSync(localePath)) {
      console.log(colorize(`  ❌ ${locale.toUpperCase()}: FILE MISSING (${baselineKeys.length} keys needed)`, 'red'));
      results.missing[locale] = {
        fileExists: false,
        missingKeys: baselineKeys,
        count: baselineKeys.length
      };
      results.summary.total++;
      results.summary.incomplete++;
      continue;
    }

    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    const missingKeys = [];

    // Check each baseline key
    for (const key of baselineKeys) {
      const baselineValue = getValue(baselineData, key);
      const localeValue = getValue(localeData, key);

      if (isMissingOrInvalid(localeValue, baselineValue, locale)) {
        missingKeys.push({ key, baselineValue, localeValue });
      }
    }

    const percentComplete = ((baselineKeys.length - missingKeys.length) / baselineKeys.length * 100).toFixed(1);
    results.summary.total++;

    if (missingKeys.length === 0) {
      console.log(colorize(`  ✅ ${locale.toUpperCase()}: COMPLETE (${baselineKeys.length}/${baselineKeys.length} keys, 100.0%)`, 'green'));
      results.summary.complete++;
    } else {
      console.log(colorize(`  ⚠️  ${locale.toUpperCase()}: INCOMPLETE (${baselineKeys.length - missingKeys.length}/${baselineKeys.length} keys, ${percentComplete}%)`, 'yellow'));
      console.log(colorize(`      Missing: ${missingKeys.length} keys`, 'yellow'));
      results.missing[locale] = {
        fileExists: true,
        missingKeys: missingKeys.map(m => m.key),
        count: missingKeys.length,
        percentComplete: parseFloat(percentComplete)
      };
      results.summary.incomplete++;
    }
  }

  return results;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log(colorize('\n╔════════════════════════════════════════════════════════════════════════════╗', 'bright'));
  console.log(colorize('║  i18n Translation Audit - Projects V2                                     ║', 'bright'));
  console.log(colorize('╚════════════════════════════════════════════════════════════════════════════╝', 'bright'));
  console.log('');
  console.log(`  ${colorize('Locales:', 'blue')} ${LOCALES.join(', ')}`);
  console.log(`  ${colorize('Namespaces:', 'blue')} ${NAMESPACES.join(', ')}`);
  console.log(`  ${colorize('Baseline:', 'blue')} ${BASELINE_LOCALE}`);

  const allResults = [];
  const summary = {
    totalNamespaces: NAMESPACES.length,
    totalLocales: LOCALES.length - 1, // Exclude baseline
    totalKeys: 0,
    completeLocales: 0,
    incompleteLocales: 0,
    missingFiles: 0,
    totalMissingKeys: 0
  };

  // Audit each namespace
  for (const namespace of NAMESPACES) {
    const result = auditNamespace(namespace);
    allResults.push(result);

    if (result.exists) {
      summary.totalKeys += result.total;
      summary.completeLocales += result.summary.complete;
      summary.incompleteLocales += result.summary.incomplete;

      Object.values(result.missing).forEach(m => {
        if (!m.fileExists) summary.missingFiles++;
        summary.totalMissingKeys += m.count;
      });
    }
  }

  // Print overall summary
  console.log('\n' + colorize('═'.repeat(80), 'cyan'));
  console.log(colorize('  OVERALL SUMMARY', 'bright'));
  console.log(colorize('═'.repeat(80), 'cyan'));
  console.log('');
  console.log(`  ${colorize('Total Namespaces:', 'blue')} ${summary.totalNamespaces}`);
  console.log(`  ${colorize('Total Locales (non-English):', 'blue')} ${summary.totalLocales}`);
  console.log(`  ${colorize('Total Keys (across all namespaces):', 'blue')} ${summary.totalKeys}`);
  console.log('');
  console.log(`  ${colorize('Complete Locales:', 'green')} ${summary.completeLocales}`);
  console.log(`  ${colorize('Incomplete Locales:', 'yellow')} ${summary.incompleteLocales}`);
  console.log(`  ${colorize('Missing Files:', 'red')} ${summary.missingFiles}`);
  console.log(`  ${colorize('Total Missing Keys:', 'red')} ${summary.totalMissingKeys}`);
  console.log('');

  // Recommendations
  console.log(colorize('  RECOMMENDATIONS', 'bright'));
  console.log(colorize('─'.repeat(80), 'cyan'));

  if (summary.totalMissingKeys === 0) {
    console.log(colorize('  🎉 All translations are complete!', 'green'));
  } else {
    console.log(colorize('  Next steps:', 'yellow'));
    console.log(colorize('  1. Run: node scripts/translate-namespace.js <namespace> <locale>', 'yellow'));
    console.log(colorize('  2. Or run: powershell scripts/translate-all.ps1', 'yellow'));
    console.log('');

    // Show which locales need work
    const incompleteByLocale = {};
    allResults.forEach(result => {
      Object.entries(result.missing).forEach(([locale, data]) => {
        if (!incompleteByLocale[locale]) {
          incompleteByLocale[locale] = { namespaces: [], totalMissing: 0 };
        }
        incompleteByLocale[locale].namespaces.push(result.namespace);
        incompleteByLocale[locale].totalMissing += data.count;
      });
    });

    console.log(colorize('  Incomplete locales:', 'yellow'));
    Object.entries(incompleteByLocale).forEach(([locale, data]) => {
      console.log(colorize(`    ${locale}: ${data.totalMissing} missing keys in ${data.namespaces.join(', ')}`, 'yellow'));
    });
  }

  console.log('\n' + colorize('═'.repeat(80), 'cyan'));
  console.log('');

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'docs', 'testing', 'translation-audit-report.json');
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary,
    details: allResults
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(colorize(`  📄 Detailed report saved to: ${reportPath}`, 'blue'));
  console.log('');

  // Return exit code
  return summary.totalMissingKeys > 0 ? 1 : 0;
}

// Run the audit
const exitCode = runAudit();
process.exit(exitCode);
