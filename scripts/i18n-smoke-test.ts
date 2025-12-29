#!/usr/bin/env tsx
/**
 * i18n Smoke Test - Complete validation pipeline (TypeScript)
 *
 * Runs:
 * 1. JSON validation
 * 2. Registry loading test (REAL execution)
 * 3. Translation writer test (REAL execution)
 * 4. Cleanup
 *
 * Usage: npm run i18n:smoke
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadRegistry } from '../apps/dashboard/src/lib/i18n/registry-loader';
import { addTranslation, hasTranslation } from '../apps/dashboard/src/lib/i18n/translation-writer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSLATIONS_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');
const TEST_NAMESPACE = '_smoke_test_temp';
const TEST_LOCALE = 'en';

let hasErrors = false;
let testsRun = 0;
let testsPassed = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  testsRun++;
  console.log(`\n📋 Test ${testsRun}: ${name}`);
  console.log('─'.repeat(60));

  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(() => {
        testsPassed++;
        console.log('✅ PASSED\n');
      }).catch((error) => {
        hasErrors = true;
        console.error(`❌ FAILED: ${error.message}\n`);
      });
    } else {
      testsPassed++;
      console.log('✅ PASSED\n');
    }
  } catch (error) {
    hasErrors = true;
    console.error(`❌ FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
  }
}

function cleanup() {
  const testFile = path.join(TRANSLATIONS_DIR, TEST_LOCALE, `${TEST_NAMESPACE}.json`);
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
    console.log(`🧹 Cleaned up test file: ${testFile}`);
  }
}

async function main() {
  console.log('🚀 i18n Smoke Test Suite (TypeScript)\n');
  console.log('═'.repeat(60));

  // Test 1: JSON Validation
  runTest('JSON Validation (validate-json)', () => {
    console.log('Running: npm run i18n:validate-json');
    execSync('npm run i18n:validate-json', { stdio: 'inherit' });
  });

  // Test 2: Registry Loading (REAL execution)
  runTest('Registry Loading (REAL execution)', () => {
    console.log('Testing loadRegistry() function...');

    // Load default registry
    const terms = loadRegistry();

    if (!Array.isArray(terms)) {
      throw new Error('loadRegistry() did not return an array');
    }

    if (terms.length === 0) {
      throw new Error('loadRegistry() returned empty array');
    }

    console.log(`✓ Loaded ${terms.length} terms from registry`);

    // Verify structure of first term
    const firstTerm = terms[0];
    if (!firstTerm.key || !firstTerm.label) {
      throw new Error('Term missing required fields (key, label)');
    }

    console.log(`✓ First term: ${firstTerm.key} = "${firstTerm.label}"`);

    // Test filtering by category
    const filterTerms = loadRegistry({ filter: 'venue' });
    console.log(`✓ Filtered terms (venue): ${filterTerms.length} results`);
  });

  // Test 3: Translation Writer (REAL execution)
  runTest('Translation Writer (REAL execution)', () => {
    console.log('Testing addTranslation() function...');

    const testKey = 'test.smoke.execution';
    const testValue = 'Smoke test value';

    // Add translation
    const result = addTranslation({
      locale: TEST_LOCALE,
      namespace: TEST_NAMESPACE,
      key: testKey,
      value: testValue,
      overwrite: false
    });

    if (!result.success) {
      throw new Error(`addTranslation() failed: ${result.message}`);
    }

    console.log(`✓ addTranslation() succeeded`);

    // Verify file was created
    const testFile = path.join(TRANSLATIONS_DIR, TEST_LOCALE, `${TEST_NAMESPACE}.json`);
    if (!fs.existsSync(testFile)) {
      throw new Error('Translation file was not created');
    }

    console.log(`✓ File created: ${testFile}`);

    // Verify content
    const content = fs.readFileSync(testFile, 'utf-8');
    const parsed = JSON.parse(content);

    if (parsed.test?.smoke?.execution !== testValue) {
      throw new Error('Translation value mismatch');
    }

    console.log(`✓ Translation correctly written: ${testKey} = "${testValue}"`);

    // Test hasTranslation()
    const exists = hasTranslation(TEST_LOCALE, TEST_NAMESPACE, testKey);
    if (!exists) {
      throw new Error('hasTranslation() returned false for existing key');
    }

    console.log('✓ hasTranslation() correctly detected existing key');

    // Test conflict detection
    const conflictResult = addTranslation({
      locale: TEST_LOCALE,
      namespace: TEST_NAMESPACE,
      key: testKey,
      value: 'Different value',
      overwrite: false
    });

    if (conflictResult.success || !conflictResult.conflict) {
      throw new Error('Conflict detection failed');
    }

    console.log('✓ Conflict detection working correctly');
  });

  // Test 4: File Count Verification
  runTest('Translation Files Count', () => {
    const locales = ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko'];
    const counts: Record<string, number> = {};

    locales.forEach(locale => {
      const localeDir = path.join(TRANSLATIONS_DIR, locale);
      if (fs.existsSync(localeDir)) {
        const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));
        counts[locale] = files.length;
      } else {
        counts[locale] = 0;
      }
    });

    console.log('Translation files per locale:');
    Object.entries(counts).forEach(([locale, count]) => {
      console.log(`  ${locale}: ${count} files`);
    });

    const enCount = counts.en || 0;
    if (enCount === 0) {
      throw new Error('No English translation files found');
    }

    console.log(`✓ Found ${enCount} English translation files`);
  });

  // Cleanup
  console.log('\n🧹 Cleanup');
  console.log('─'.repeat(60));
  cleanup();

  // Summary
  console.log('\n═'.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Total tests: ${testsRun}`);
  console.log(`   Passed: ${testsPassed}`);
  console.log(`   Failed: ${testsRun - testsPassed}`);
  console.log('═'.repeat(60));

  if (hasErrors) {
    console.error('\n❌ Smoke test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ All smoke tests PASSED');
    process.exit(0);
  }
}

main();
