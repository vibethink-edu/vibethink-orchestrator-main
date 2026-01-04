#!/usr/bin/env node

/**
 * =============================================================================
 * VIBETHINK ORCHESTRATOR - FIT CLAIMS VALIDATOR
 * =============================================================================
 *
 * This script validates that no documentation claims features that have
 * failing FIT (Functional Integration Test) gates.
 *
 * It scans README.md, AGENTS.md, and other public-facing docs for claims
 * that are blocked by failing FITs.
 *
 * Usage:
 *   npm run validate:fit-claims
 *   node scripts/validate-fit-claims.mjs
 *
 * Exit codes:
 *   0 - No violations found
 *   1 - FIT claim violations detected
 *
 * =============================================================================
 */

import fs from 'fs';
import path from 'path';

const FIT_INDEX_PATH = path.join(process.cwd(), 'docs/fits/FIT_INDEX.md');
const DOCS_TO_CHECK = [
  'README.md',
  'AGENTS.md',
  'AI_AGENT_ONBOARDING.md',
  'docs/canon/00_CANON_INDEX.md',
];

// Blocked claims mapped to their FIT gates
const BLOCKED_CLAIMS = {
  'FIT-001': {
    status: 'FAIL',
    patterns: [
      /operational\s+brain/gi,
      /business\s+brain/gi,
      /specialists?\s+reason/gi,
      /domain\s+specialists?\s+(?:analyze|process|handle)/gi,
    ],
    allowedPhrases: [
      'architected to become',
      'planned',
      'roadmap',
      'SPEC',
      'future',
      'will support',
    ],
    claim: '"Operational Brain with Specialists"',
  },
  'FIT-002': {
    status: 'FAIL',
    patterns: [
      /entity\s+(?:memory\s+)?graph/gi,
      /entity\s+relationships?/gi,
      /specialists?\s+reason\s+over/gi,
    ],
    allowedPhrases: [
      'planned',
      'SPEC',
      'roadmap',
      'future',
    ],
    claim: '"Entity Memory Graph"',
  },
  'FIT-003': {
    status: 'FAIL',
    patterns: [
      /captures?\s+(?:all\s+)?(?:email|call|chat|communication)/gi,
      /communication\s+events?\s+(?:capture|log|track)/gi,
    ],
    allowedPhrases: [
      'planned',
      'roadmap',
      'future',
    ],
    claim: '"Communication Events Capture"',
  },
  'FIT-004': {
    status: 'FAIL',
    patterns: [
      /specialist\s+decisions?\s+(?:are\s+)?auditable/gi,
      /full\s+trace\s+evidence/gi,
      /decision\s+audit\s+trail/gi,
    ],
    allowedPhrases: [
      'planned',
      'roadmap',
      'future',
    ],
    claim: '"Trace Logging / Auditability"',
  },
};

console.log('🔍 FIT Claims Validator');
console.log('========================');
console.log('');

// Parse FIT_INDEX to get current status (optional enhancement)
let fitIndexContent = '';
try {
  fitIndexContent = fs.readFileSync(FIT_INDEX_PATH, 'utf8');
  console.log('✅ FIT_INDEX.md loaded');
} catch (err) {
  console.warn('⚠️  FIT_INDEX.md not found, using hardcoded FIT status');
}

// Check each document for violations
const violations = [];

DOCS_TO_CHECK.forEach(docPath => {
  const fullPath = path.join(process.cwd(), docPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  Skipping (not found): ${docPath}`);
    return;
  }

  console.log(`📄 Checking: ${docPath}`);

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, lineNum) => {
    // Check each blocked claim
    Object.entries(BLOCKED_CLAIMS).forEach(([fitId, fitConfig]) => {
      if (fitConfig.status !== 'FAIL') return; // Only check failing FITs

      fitConfig.patterns.forEach(pattern => {
        if (pattern.test(line)) {
          // Check if it's in an allowed context
          const hasAllowedPhrase = fitConfig.allowedPhrases.some(phrase =>
            line.toLowerCase().includes(phrase.toLowerCase())
          );

          if (!hasAllowedPhrase) {
            violations.push({
              file: docPath,
              line: lineNum + 1,
              fitId,
              claim: fitConfig.claim,
              text: line.trim().substring(0, 80),
            });
          }
        }
      });
    });
  });
});

console.log('');

// Report results
if (violations.length === 0) {
  console.log('========================');
  console.log('✅ No FIT claim violations detected!');
  console.log('');
  console.log('All documentation respects FIT gate status.');
  process.exit(0);
} else {
  console.log('========================');
  console.log(`❌ Found ${violations.length} FIT claim violation(s):`);
  console.log('');

  violations.forEach(v => {
    console.log(`📍 ${v.file}:${v.line}`);
    console.log(`   FIT: ${v.fitId} - ${v.claim}`);
    console.log(`   Text: "${v.text}..."`);
    console.log('');
  });

  console.log('========================');
  console.log('');
  console.log('💡 To fix:');
  console.log('   1. Use allowed phrasing: "architected to become", "planned", "roadmap"');
  console.log('   2. Or implement the feature and pass the FIT gate');
  console.log('');
  console.log('📖 See: docs/fits/FIT_INDEX.md for current FIT status');
  console.log('📖 See: docs/canon/00_CANON_INDEX.md for claim rules');
  console.log('');

  process.exit(1);
}
