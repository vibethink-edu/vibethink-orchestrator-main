#!/usr/bin/env node
/**
 * Validates all JSON files in i18n directory
 * Finds and reports invalid JSON with exact file location and error
 *
 * Validates:
 * - All JSON files in translations directory (all locales)
 * - Root level registry files in i18n directory (if any)
 *
 * Usage: npm run i18n:validate-json
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n');
const TRANSLATIONS_DIR = path.join(I18N_DIR, 'translations');

let hasErrors = false;
let totalFiles = 0;
let validFiles = 0;

/**
 * Recursively find all JSON files
 */
function findJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Validate a single JSON file
 */
function validateJsonFile(filePath) {
  totalFiles++;
  const relativePath = path.relative(process.cwd(), filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Try to parse JSON
    JSON.parse(content);

    // Check for common issues
    if (content.trim() === '') {
      console.error(`❌ EMPTY FILE: ${relativePath}`);
      hasErrors = true;
      return;
    }

    if (!content.trim().startsWith('{') && !content.trim().startsWith('[')) {
      console.error(`❌ INVALID START: ${relativePath} (must start with { or [)`);
      hasErrors = true;
      return;
    }

    validFiles++;

  } catch (error) {
    console.error(`\n❌ INVALID JSON: ${relativePath}`);
    console.error(`   Error: ${error.message}`);

    // Try to give more context
    if (error.message.includes('position')) {
      const position = error.message.match(/position (\d+)/);
      if (position) {
        const pos = parseInt(position[1]);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.substring(0, pos).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length;

        console.error(`   Location: Line ${line}, Column ${col}`);
        console.error(`   Context: ...${content.substring(Math.max(0, pos - 20), pos + 20)}...`);
      }
    }

    hasErrors = true;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Validating i18n JSON files...\n');
  console.log(`📁 Scanning: ${I18N_DIR}\n`);

  if (!fs.existsSync(I18N_DIR)) {
    console.error(`❌ i18n directory not found: ${I18N_DIR}`);
    process.exit(1);
  }

  // Collect all JSON files from i18n directory
  const allJsonFiles = [];

  // 1. Scan translations directory (all locales)
  if (fs.existsSync(TRANSLATIONS_DIR)) {
    const translationFiles = findJsonFiles(TRANSLATIONS_DIR);
    allJsonFiles.push(...translationFiles);
    console.log(`   📂 translations/: ${translationFiles.length} files`);
  }

  // 2. Scan root i18n directory for any registry files
  const rootFiles = fs.readdirSync(I18N_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(I18N_DIR, file));

  if (rootFiles.length > 0) {
    allJsonFiles.push(...rootFiles);
    console.log(`   📂 root: ${rootFiles.length} files`);
  }

  console.log(`\nFound ${allJsonFiles.length} total JSON files\n`);

  allJsonFiles.forEach(file => {
    validateJsonFile(file);
  });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Valid files: ${validFiles}`);
  console.log(`   Invalid files: ${totalFiles - validFiles}`);
  console.log(`${'='.repeat(60)}\n`);

  if (hasErrors) {
    console.error('❌ Validation FAILED - Fix the errors above');
    process.exit(1);
  } else {
    console.log('✅ All JSON files are valid!');
    process.exit(0);
  }
}

main();
