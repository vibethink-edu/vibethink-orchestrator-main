#!/usr/bin/env node

/**
 * =============================================================================
 * VIBETHINK ORCHESTRATOR - METHODOLOGY ADOPTION VALIDATOR (Enhanced)
 * =============================================================================
 *
 * This script validates that any methodology marked as ADOPTED or PARTIAL
 * in the METHODOLOGY_REGISTRY.md has proper evidence documentation.
 *
 * Enhanced validation:
 * - Checks evidence field is not empty
 * - Validates that evidence links exist (if local files)
 * - Ensures decision date is valid
 * - Checks for required approver
 *
 * Usage:
 *   npm run validate:methodology-adoption
 *   node scripts/validate-methodology-adoption.mjs
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Governance violation detected
 *
 * =============================================================================
 */

import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.join(process.cwd(), 'docs/registry/METHODOLOGY_REGISTRY.md');

console.log('🔍 Validating Methodology Adoption Governance (Enhanced)...');
console.log('=============================================================');
console.log('');

// Check registry exists
if (!fs.existsSync(REGISTRY_PATH)) {
  console.error(`❌ Registry not found at ${REGISTRY_PATH}`);
  process.exit(1);
}

const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');
const lines = registryContent.split('\n');

const errors = [];
const warnings = [];
const processed = [];

// Parse the markdown table
lines.forEach((line, index) => {
  // Skip non-table lines
  if (!line.includes('|')) return;
  // Skip header separator
  if (line.includes('---')) return;
  // Skip header row
  if (line.toLowerCase().includes('methodology') && line.toLowerCase().includes('status')) return;

  const columns = line.split('|').map(c => c.trim());

  // Need at least 6 columns: | Methodology | Status | Date | Owner | Evidence | Notes |
  if (columns.length < 6) return;

  // columns[0] is empty (before first |)
  const methodology = columns[1].replace(/\*\*/g, '').trim();
  const status = columns[2].trim().toUpperCase();
  const decisionDate = columns[3].trim();
  const decisionOwner = columns[4].trim();
  const evidence = columns[5].trim();

  // Skip empty rows
  if (!methodology || methodology === '') return;

  processed.push({ methodology, status, decisionDate, decisionOwner, evidence, line: index + 1 });

  // Only validate ADOPTED and PARTIAL status
  if (status === 'ADOPTED' || status === 'PARTIAL') {
    console.log(`📋 Checking: ${methodology} (${status})`);

    // 1. Check evidence is not empty or placeholder
    if (!evidence || evidence === '-' || evidence === '' || evidence.toLowerCase() === 'pending') {
      errors.push({
        line: index + 1,
        methodology,
        status,
        issue: 'Missing evidence link',
        fix: 'Add a link to the evaluation/canon document in the Evidence column',
      });
    }

    // 2. Check evidence link exists (if it's a local file path)
    if (evidence && evidence.startsWith('../') || evidence.startsWith('./') || evidence.startsWith('docs/')) {
      const evidencePath = path.join(process.cwd(), evidence.replace(/^\.\.\//g, '').replace(/^\.\//g, ''));
      if (!fs.existsSync(evidencePath)) {
        errors.push({
          line: index + 1,
          methodology,
          status,
          issue: `Evidence file not found: ${evidence}`,
          fix: 'Ensure the evidence document exists at the specified path',
        });
      } else {
        console.log(`   ✅ Evidence file exists: ${evidence}`);
      }
    }

    // 3. Check decision date is valid
    if (!decisionDate || decisionDate === '-') {
      warnings.push({
        line: index + 1,
        methodology,
        issue: 'Missing decision date',
      });
    } else {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(decisionDate)) {
        warnings.push({
          line: index + 1,
          methodology,
          issue: `Invalid date format: ${decisionDate} (expected YYYY-MM-DD)`,
        });
      }
    }

    // 4. Check decision owner
    if (!decisionOwner || decisionOwner === '-') {
      warnings.push({
        line: index + 1,
        methodology,
        issue: 'Missing decision owner',
      });
    }

    console.log('');
  }
});

// Report results
console.log('=============================================================');
console.log('');

if (processed.length === 0) {
  console.log('⚠️  No methodologies found in registry');
  console.log('   This might indicate a parsing issue with the table format.');
  process.exit(0);
}

console.log(`📊 Processed ${processed.length} methodologie(s)`);
console.log('');

// Report warnings (non-blocking)
if (warnings.length > 0) {
  console.log(`⚠️  Warnings (${warnings.length}):`);
  warnings.forEach(w => {
    console.log(`   Line ${w.line}: ${w.methodology} - ${w.issue}`);
  });
  console.log('');
}

// Report errors (blocking)
if (errors.length > 0) {
  console.log(`❌ Errors (${errors.length}):`);
  errors.forEach(e => {
    console.log(`   Line ${e.line}: ${e.methodology} (${e.status})`);
    console.log(`      Issue: ${e.issue}`);
    console.log(`      Fix: ${e.fix}`);
    console.log('');
  });

  console.log('=============================================================');
  console.log('');
  console.log('💥 FAILED: Methodology Governance Violation Detected');
  console.log('');
  console.log('📖 See: docs/canon/METHODOLOGY_EVALUATION_FRAMEWORK.md');
  console.log('📖 Rule: Any ADOPTED/PARTIAL methodology MUST have evidence link');
  console.log('');

  process.exit(1);
} else {
  console.log('=============================================================');
  console.log('✅ Methodology Governance Verified');
  console.log('');
  process.exit(0);
}
