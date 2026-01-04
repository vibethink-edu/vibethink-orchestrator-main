#!/usr/bin/env node

/**
 * =============================================================================
 * VIBETHINK ORCHESTRATOR - HARDCODING CHECK SCRIPT
 * =============================================================================
 *
 * This script detects hardcoded strings in the codebase that should be
 * internationalized (i18n). It wraps the existing audit-hardcoded-text.js
 * and provides a CI-friendly interface.
 *
 * Usage:
 *   npm run check-hardcoding
 *   node scripts/check-hardcoding.js [--strict] [--path=apps/dashboard]
 *
 * Options:
 *   --strict   Exit with error code if hardcoded strings found
 *   --path     Specific path to check (default: apps/dashboard)
 *
 * =============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const isStrict = args.includes('--strict');
const pathArg = args.find(a => a.startsWith('--path='));
const targetPath = pathArg ? pathArg.split('=')[1] : 'apps/dashboard';

console.log('🔍 Hardcoding Detection Script');
console.log('================================');
console.log(`Target: ${targetPath}`);
console.log(`Mode: ${isStrict ? 'STRICT (will fail on findings)' : 'WARN (report only)'}`);
console.log('');

// Patterns that indicate hardcoded UI strings
const HARDCODED_PATTERNS = [
  // JSX text content (simple strings in JSX)
  /<[a-zA-Z][^>]*>([A-Z][a-z]+(?:\s+[a-z]+)*)<\/[a-zA-Z]+>/g,
  // Button/label text
  /(?:label|title|placeholder|alt)=["']([A-Z][^"']+)["']/g,
  // Common UI text patterns
  /["'](?:Submit|Cancel|Save|Delete|Edit|Add|Remove|Close|Open|Next|Previous|Back|Continue|Loading|Error|Success|Warning)["']/g,
];

// Files/patterns to ignore
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.d\.ts$/,
  /\.test\./,
  /\.spec\./,
  /\.stories\./,
  /__tests__/,
  /\.json$/,
  /\.md$/,
];

// Allowed patterns (i18n usage)
const ALLOWED_PATTERNS = [
  /t\(['"`]/,           // t('key') - i18n function
  /useTranslation/,     // i18n hook
  /i18n\./,             // i18n namespace
  /\.json$/,            // JSON files (translation files)
];

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function hasI18nUsage(content) {
  return ALLOWED_PATTERNS.some(pattern => pattern.test(content));
}

function findHardcodedStrings(filePath, content) {
  const findings = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Skip lines with i18n usage
    if (hasI18nUsage(line)) return;

    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    // Check for hardcoded patterns
    HARDCODED_PATTERNS.forEach(pattern => {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 2) {
          findings.push({
            file: filePath,
            line: index + 1,
            text: match[1].substring(0, 50) + (match[1].length > 50 ? '...' : ''),
            fullLine: line.trim().substring(0, 100),
          });
        }
      }
    });
  });

  return findings;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.jsx'))) {
      if (!shouldIgnoreFile(filePath)) {
        callback(filePath);
      }
    }
  });
}

// Main execution
const findings = [];
const searchPath = path.join(process.cwd(), targetPath);

console.log(`Scanning: ${searchPath}`);
console.log('');

walkDir(searchPath, (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileFindings = findHardcodedStrings(filePath, content);
    findings.push(...fileFindings);
  } catch (err) {
    console.warn(`⚠️  Could not read: ${filePath}`);
  }
});

// Report findings
if (findings.length === 0) {
  console.log('✅ No hardcoded strings detected!');
  console.log('');
  process.exit(0);
} else {
  console.log(`⚠️  Found ${findings.length} potential hardcoded strings:`);
  console.log('');

  // Group by file
  const byFile = {};
  findings.forEach(f => {
    if (!byFile[f.file]) byFile[f.file] = [];
    byFile[f.file].push(f);
  });

  Object.entries(byFile).forEach(([file, fileFindings]) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`📄 ${relativePath}`);
    fileFindings.forEach(f => {
      console.log(`   Line ${f.line}: "${f.text}"`);
    });
    console.log('');
  });

  console.log('================================');
  console.log(`Total: ${findings.length} findings in ${Object.keys(byFile).length} files`);
  console.log('');
  console.log('💡 To fix: Replace hardcoded strings with t("namespace.key")');
  console.log('   See: docs/architecture/I18N_ANTI_HARDCODE_STRATEGY.md');
  console.log('');

  if (isStrict) {
    console.log('❌ STRICT MODE: Failing due to hardcoded strings');
    process.exit(1);
  } else {
    console.log('⚠️  WARN MODE: Reported for awareness (not blocking)');
    process.exit(0);
  }
}
