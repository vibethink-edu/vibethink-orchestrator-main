#!/usr/bin/env node
/**
 * Translate Missing Keys Only - Smart Recovery Script
 *
 * This script only translates the specific missing keys identified by the audit,
 * making it faster and more resilient to API key expiration.
 *
 * Usage: node scripts/translate-missing-only.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Load environment variables (override any existing)
require('dotenv').config({ override: true });

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
console.log(colorize('  Smart Translation Recovery - Missing Keys Only', 'bright'));
console.log(colorize('='.repeat(79), 'cyan'));
console.log('');
console.log(colorize('  This script will translate only the missing keys:', 'yellow'));
console.log('');
console.log('  ' + colorize('zh:', 'blue') + ' 103 keys (projects, navigation)');
console.log('  ' + colorize('fr:', 'blue') + ' 33 keys (projects, default, common, navigation)');
console.log('  ' + colorize('pt:', 'blue') + ' 21 keys (projects, default, common, navigation)');
console.log('  ' + colorize('de:', 'blue') + ' 44 keys (projects, default, common, navigation)');
console.log('  ' + colorize('it:', 'blue') + ' 72 keys (projects, default, common, navigation)');
console.log('  ' + colorize('es:', 'blue') + ' 13 keys (default, common, navigation)');
console.log('  ' + colorize('ar:', 'blue') + ' 169 keys (default, navigation)');
console.log('  ' + colorize('ko:', 'blue') + ' 84 keys (default, navigation)');
console.log('');
console.log('  ' + colorize('Total:', 'bright') + ' 539 keys across 32 jobs');
console.log('');
console.log(colorize('='.repeat(79), 'cyan'));
console.log('');

// Jobs to run (only incomplete combinations)
const jobs = [
  // zh (103 keys)
  { namespace: 'projects', locale: 'zh', estimated: 96 },
  { namespace: 'navigation', locale: 'zh', estimated: 7 },

  // fr (33 keys)
  { namespace: 'projects', locale: 'fr', estimated: 7 },
  { namespace: 'default', locale: 'fr', estimated: 5 },
  { namespace: 'common', locale: 'fr', estimated: 4 },
  { namespace: 'navigation', locale: 'fr', estimated: 17 },

  // pt (21 keys)
  { namespace: 'projects', locale: 'pt', estimated: 4 },
  { namespace: 'default', locale: 'pt', estimated: 4 },
  { namespace: 'common', locale: 'pt', estimated: 3 },
  { namespace: 'navigation', locale: 'pt', estimated: 10 },

  // de (44 keys)
  { namespace: 'projects', locale: 'de', estimated: 15 },
  { namespace: 'default', locale: 'de', estimated: 8 },
  { namespace: 'common', locale: 'de', estimated: 6 },
  { namespace: 'navigation', locale: 'de', estimated: 15 },

  // it (72 keys)
  { namespace: 'projects', locale: 'it', estimated: 3 },
  { namespace: 'default', locale: 'it', estimated: 3 },
  { namespace: 'common', locale: 'it', estimated: 56 },
  { namespace: 'navigation', locale: 'it', estimated: 10 },

  // es (13 keys)
  { namespace: 'default', locale: 'es', estimated: 2 },
  { namespace: 'common', locale: 'es', estimated: 3 },
  { namespace: 'navigation', locale: 'es', estimated: 8 },

  // ar (169 keys)
  { namespace: 'default', locale: 'ar', estimated: 163 },
  { namespace: 'navigation', locale: 'ar', estimated: 6 },

  // ko (84 keys)
  { namespace: 'default', locale: 'ko', estimated: 1 },
  { namespace: 'navigation', locale: 'ko', estimated: 83 },
];

// Statistics
const totalJobs = jobs.length;
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
  for (const job of jobs) {
    currentJob++;
    const percentComplete = ((currentJob / totalJobs) * 100).toFixed(1);

    console.log(colorize(`[${currentJob}/${totalJobs}]`, 'cyan') + ` ${job.namespace} -> ${job.locale} (${colorize(`~${job.estimated} keys`, 'yellow')}) - ${percentComplete}%`);

    try {
      await translateOne(job.namespace, job.locale);
      console.log(colorize('  [SUCCESS]', 'green'));
      successCount++;
    } catch (error) {
      console.error(colorize(`  [FAILED] ${error.message}`, 'red'));
      failureCount++;

      // If we get an API key expired error, stop immediately
      if (error.message.includes('expired') || error.message.includes('API key')) {
        console.log('');
        console.log(colorize('API key expired. Stopping execution.', 'yellow'));
        console.log(colorize(`Progress: ${successCount}/${totalJobs} jobs completed`, 'cyan'));
        console.log('');
        console.log(colorize('To continue:', 'yellow'));
        console.log(colorize('1. Create a new API key in Google Cloud Console', 'cyan'));
        console.log(colorize('2. Update .env with the new key', 'cyan'));
        console.log(colorize('3. Run this script again', 'cyan'));
        console.log('');
        break;
      }
    }

    console.log('');

    // Rate limiting - wait 1 second between jobs
    if (currentJob < totalJobs) {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
  console.log(`  ${colorize('Remaining:', 'blue')} ${colorize((totalJobs - successCount - failureCount).toString(), 'yellow')}`);
  console.log(`  ${colorize('Duration:', 'blue')} ${minutes}m ${seconds}s`);
  console.log('');

  if (successCount === totalJobs) {
    console.log(colorize('  🎉 ALL TRANSLATIONS COMPLETE!', 'green'));
    console.log('');
    console.log(colorize('  Next steps:', 'yellow'));
    console.log(colorize('  1. Run audit: node scripts/audit-missing-translations-projects-v2.js', 'cyan'));
    console.log(colorize('  2. Test: npm run dev -- --port 3005', 'cyan'));
    console.log(colorize('  3. Navigate to: http://localhost:3005/dashboard-bundui/projects-v2', 'cyan'));
    console.log(colorize('  4. Test all 9 languages', 'cyan'));
    console.log(colorize('  5. Commit changes', 'cyan'));
  } else {
    console.log(colorize('  ⚠️  Some translations failed or were skipped', 'yellow'));
    console.log('');
    console.log(colorize('  To complete:', 'yellow'));
    console.log(colorize('  1. Get a new Google Cloud API key', 'cyan'));
    console.log(colorize('  2. Update .env', 'cyan'));
    console.log(colorize('  3. Run this script again', 'cyan'));
  }
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
