#!/usr/bin/env node

/**
 * i18n Validation Script
 *
 * Validates that all modules comply with VibeThink i18n requirements:
 * - All 9 languages present
 * - English and Spanish 100% complete
 * - No empty values in base languages
 * - Valid JSON structure
 *
 * Usage: node scripts/validate-i18n.js [module-path]
 */

const fs = require('fs');
const path = require('path');

// VibeThink Required Languages
const REQUIRED_LANGUAGES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const BASE_LANGUAGES = ['en', 'es'];

class I18nValidator {
  constructor(translationsPath) {
    this.translationsPath = translationsPath;
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalLanguages: 0,
      completeLanguages: 0,
      totalKeys: 0,
      missingKeys: {},
    };
  }

  /**
   * Main validation entry point
   */
  validate() {
    console.log('🌍 VibeThink i18n Validator\n');
    console.log(`📁 Validating: ${this.translationsPath}\n`);

    if (!fs.existsSync(this.translationsPath)) {
      this.errors.push(`Translation path does not exist: ${this.translationsPath}`);
      return this.report();
    }

    // Step 1: Check all required languages exist
    this.validateLanguageDirectories();

    // Step 2: Load and validate each language file
    this.validateLanguageFiles();

    // Step 3: Check for missing keys across languages
    this.validateKeyConsistency();

    // Step 4: Validate RTL support
    this.validateRTLSupport();

    // Generate report
    return this.report();
  }

  /**
   * Check that all 9 required language directories exist
   */
  validateLanguageDirectories() {
    console.log('📂 Checking language directories...\n');

    const existingDirs = fs.readdirSync(this.translationsPath)
      .filter(f => fs.statSync(path.join(this.translationsPath, f)).isDirectory());

    for (const lang of REQUIRED_LANGUAGES) {
      if (!existingDirs.includes(lang)) {
        this.errors.push(`Missing required language directory: ${lang}`);
      } else {
        console.log(`  ✅ ${lang} - Directory found`);
        this.stats.totalLanguages++;
      }
    }

    console.log('');
  }

  /**
   * Validate JSON files in each language directory
   */
  validateLanguageFiles() {
    console.log('📄 Validating translation files...\n');

    for (const lang of REQUIRED_LANGUAGES) {
      const langDir = path.join(this.translationsPath, lang);

      if (!fs.existsSync(langDir)) {
        continue; // Already reported as error
      }

      const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));

      if (files.length === 0) {
        this.errors.push(`No translation files found in ${lang}/`);
        continue;
      }

      for (const file of files) {
        const filePath = path.join(langDir, file);
        this.validateJSONFile(lang, file, filePath);
      }
    }

    console.log('');
  }

  /**
   * Validate a single JSON file
   */
  validateJSONFile(lang, fileName, filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // Count keys
      const keys = this.getAllKeys(data);

      if (lang === 'en') {
        this.stats.totalKeys = keys.length;
      }

      // Check for empty values in base languages
      if (BASE_LANGUAGES.includes(lang)) {
        const emptyKeys = this.findEmptyKeys(data);
        if (emptyKeys.length > 0) {
          this.errors.push(
            `${lang}/${fileName}: ${emptyKeys.length} empty value(s): ${emptyKeys.join(', ')}`
          );
        } else {
          console.log(`  ✅ ${lang}/${fileName} - Complete (${keys.length} keys)`);
          this.stats.completeLanguages++;
        }
      } else {
        const emptyKeys = this.findEmptyKeys(data);
        const coverage = ((keys.length - emptyKeys.length) / keys.length * 100).toFixed(1);

        if (coverage < 90) {
          this.warnings.push(
            `${lang}/${fileName}: Only ${coverage}% coverage (${keys.length - emptyKeys.length}/${keys.length} keys)`
          );
        }

        console.log(`  ${coverage >= 90 ? '✅' : '⚠️'} ${lang}/${fileName} - ${coverage}% coverage`);
      }

      // Store keys for consistency check
      if (!this.stats.missingKeys[lang]) {
        this.stats.missingKeys[lang] = {};
      }
      this.stats.missingKeys[lang][fileName] = keys;

    } catch (error) {
      this.errors.push(`${lang}/${fileName}: Invalid JSON - ${error.message}`);
    }
  }

  /**
   * Get all keys from a nested object
   */
  getAllKeys(obj, prefix = '') {
    let keys = [];

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys = keys.concat(this.getAllKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }

    return keys;
  }

  /**
   * Find keys with empty string values
   */
  findEmptyKeys(obj, prefix = '') {
    let emptyKeys = [];

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        emptyKeys = emptyKeys.concat(this.findEmptyKeys(value, fullKey));
      } else if (value === '') {
        emptyKeys.push(fullKey);
      }
    }

    return emptyKeys;
  }

  /**
   * Check that all languages have the same keys
   */
  validateKeyConsistency() {
    console.log('🔍 Checking key consistency across languages...\n');

    // Get English keys as reference
    const enKeys = this.stats.missingKeys['en'];
    if (!enKeys) {
      this.errors.push('Cannot validate consistency: English translations not found');
      return;
    }

    for (const lang of REQUIRED_LANGUAGES) {
      if (lang === 'en' || !this.stats.missingKeys[lang]) continue;

      const langKeys = this.stats.missingKeys[lang];

      // Check each file
      for (const [fileName, keys] of Object.entries(enKeys)) {
        if (!langKeys[fileName]) {
          this.warnings.push(`${lang}/${fileName}: File missing`);
          continue;
        }

        const missing = keys.filter(k => !langKeys[fileName].includes(k));
        if (missing.length > 0) {
          this.warnings.push(
            `${lang}/${fileName}: Missing ${missing.length} key(s): ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}`
          );
        }
      }
    }

    console.log('');
  }

  /**
   * Validate RTL support for Arabic
   */
  validateRTLSupport() {
    console.log('🔄 Checking RTL support for Arabic...\n');

    const arDir = path.join(this.translationsPath, 'ar');
    if (!fs.existsSync(arDir)) {
      this.errors.push('Arabic (ar) translations required for RTL support');
      return;
    }

    // Check if there are CSS files with RTL support
    const rootDir = path.dirname(path.dirname(this.translationsPath));
    const possibleCssFiles = [
      path.join(rootDir, 'globals.css'),
      path.join(rootDir, 'app/globals.css'),
      path.join(rootDir, 'styles/globals.css'),
    ];

    let hasRTLSupport = false;
    for (const cssFile of possibleCssFiles) {
      if (fs.existsSync(cssFile)) {
        const content = fs.readFileSync(cssFile, 'utf8');
        if (content.includes('dir="rtl"') || content.includes('[dir="rtl"]')) {
          hasRTLSupport = true;
          console.log(`  ✅ RTL support found in ${path.basename(cssFile)}`);
          break;
        }
      }
    }

    if (!hasRTLSupport) {
      this.warnings.push('RTL CSS support not detected. Ensure your styles support dir="rtl"');
    }

    console.log('');
  }

  /**
   * Generate final report
   */
  report() {
    console.log('═'.repeat(60));
    console.log('📊 VALIDATION REPORT');
    console.log('═'.repeat(60));
    console.log('');

    // Statistics
    console.log('📈 Statistics:');
    console.log(`  Languages found: ${this.stats.totalLanguages}/9`);
    console.log(`  Base languages complete: ${this.stats.completeLanguages}/${BASE_LANGUAGES.length}`);
    console.log(`  Total keys (English): ${this.stats.totalKeys}`);
    console.log('');

    // Errors
    if (this.errors.length > 0) {
      console.log('❌ ERRORS:');
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
      console.log('');
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
      console.log('');
    }

    // Final result
    console.log('═'.repeat(60));
    if (this.errors.length === 0) {
      console.log('✅ VALIDATION PASSED');
      console.log('');
      if (this.warnings.length > 0) {
        console.log(`Note: ${this.warnings.length} warning(s) detected. Consider addressing them.`);
      }
      return 0;
    } else {
      console.log('❌ VALIDATION FAILED');
      console.log('');
      console.log(`Found ${this.errors.length} error(s) that must be fixed.`);
      console.log('');
      console.log('Please review the errors above and ensure:');
      console.log('  • All 9 languages are present');
      console.log('  • English and Spanish are 100% complete');
      console.log('  • All JSON files are valid');
      console.log('  • RTL support is implemented');
      return 1;
    }
  }
}

// Main execution
const args = process.argv.slice(2);
const translationsPath = args[0] || path.join(process.cwd(), 'src/lib/i18n/translations');

const validator = new I18nValidator(translationsPath);
const exitCode = validator.validate();

process.exit(exitCode);
