#!/usr/bin/env node
/**
 * Translate All - Batch Translation with Google Cloud Translation API
 *
 * This script translates all missing keys across all namespaces and locales
 * using Google Cloud Translation API.
 *
 * Usage: node scripts/translate-all-google.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Load environment variables (override any existing)
require('dotenv').config({ override: true });

// Configuration
const NAMESPACES = ['projects', 'default', 'common', 'navigation'];
const LOCALES = ['es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko'];

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

// Check if API key is set
if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
  console.error('');
  console.error(colorize('ERROR: GOOGLE_TRANSLATE_API_KEY environment variable not set', 'red'));
  console.error('');
  console.error(colorize('Add it to your .env file:', 'yellow'));
  console.error(colorize('  GOOGLE_TRANSLATE_API_KEY=your-google-api-key', 'cyan'));
  console.error('');
  process.exit(1);
}

console.log('');
console.log(colorize('='.repeat(79), 'cyan'));
console.log(colorize('  Batch Translation Tool - Google Cloud Translation API', 'bright'));
console.log(colorize('='.repeat(79), 'cyan'));
console.log('');
console.log(`  ${colorize('Namespaces:', 'blue')} ${NAMESPACES.join(', ')}`);
console.log(`  ${colorize('Locales:', 'blue')} ${LOCALES.join(', ')}`);
console.log(`  ${colorize('Total jobs:', 'blue')} ${NAMESPACES.length * LOCALES.length}`);
console.log('');
console.log(colorize('='.repeat(79), 'cyan'));
console.log('');

// Statistics
const totalJobs = NAMESPACES.length * LOCALES.length;
let currentJob = 0;
let successCount = 0;
let failureCount = 0;
const startTime = Date.now();

// Translation function
async function translateOne(namespace, locale) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'translate-namespace-google.js');
    const child = spawn('node', [scriptPath, namespace, locale], {
      stdio: 'inherit',
      env: process.env
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Translation failed with exit code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

// Main translation loop
async function runTranslations() {
  for (const namespace of NAMESPACES) {
    for (const locale of LOCALES) {
      currentJob++;
      const percentComplete = ((currentJob / totalJobs) * 100).toFixed(1);

      console.log(colorize(`[${currentJob}/${totalJobs}]`, 'cyan') + ` Translating ${colorize(namespace, 'yellow')} -> ${colorize(locale, 'green')} (${percentComplete}%)`);

      try {
        await translateOne(namespace, locale);
        console.log(colorize('  [SUCCESS]', 'green'));
        successCount++;
      } catch (error) {
        console.error(colorize(`  [FAILED] ${error.message}`, 'red'));
        failureCount++;
      }

      console.log('');

      // Rate limiting - wait 1 second between jobs
      if (currentJob < totalJobs) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Final summary
  const endTime = Date.now();
  const duration = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  console.log(colorize('='.repeat(79), 'cyan'));
  console.log(colorize('  SUMMARY', 'bright'));
  console.log(colorize('='.repeat(79), 'cyan'));
  console.log('');
  console.log(`  ${colorize('Total jobs:', 'blue')} ${totalJobs}`);
  console.log(`  ${colorize('Successful:', 'blue')} ${colorize(successCount.toString(), 'green')}`);
  console.log(`  ${colorize('Failed:', 'blue')} ${colorize(failureCount.toString(), 'red')}`);
  console.log(`  ${colorize('Duration:', 'blue')} ${minutes}m ${seconds}s`);
  console.log('');

  console.log(colorize('  Next steps:', 'yellow'));
  console.log(colorize('  1. Run audit again: node scripts/audit-missing-translations-projects-v2.js', 'cyan'));
  console.log(colorize('  2. Test the app: npm run dev -- --port 3005', 'cyan'));
  console.log(colorize('  3. Navigate to: http://localhost:3005/dashboard-bundui/projects-v2', 'cyan'));
  console.log(colorize('  4. Test each language using the language selector', 'cyan'));
  console.log('');
  console.log(colorize('='.repeat(79), 'cyan'));
  console.log('');

  // Exit with appropriate code
  process.exit(failureCount > 0 ? 1 : 0);
}

// Run translations
runTranslations().catch((error) => {
  console.error('');
  console.error(colorize('FATAL ERROR:', 'red'));
  console.error(colorize(error.message, 'red'));
  console.error('');
  process.exit(1);
});
