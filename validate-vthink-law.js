#!/usr/bin/env node

/**
 * 🛡️ VTHINK METHODOLOGY LAW VALIDATOR - INQUEBRANTABLE
 * ⚠️ CRITICAL: This script validates compliance with VThink Law
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ VTHINK METHODOLOGY LAW VALIDATOR - INQUEBRANTABLE');
console.log('='.repeat(60));

// 1. VTHINK LAW VALIDATION
function validateVThinkLaw() {
  console.log('\n🔍 1. VALIDATING VTHINK METHODOLOGY LAW...');
  
  const filesToCheck = [
    'package.json',
    'README.md',
    'AI_STABILITY_RULES.md',
    'apps/dashboard/package.json',
    'apps/dashboard/app/layout.tsx',
    'src/shared/components/bundui-premium/components/layout/sidebar.tsx',
    'src/shared/components/bundui-premium/components/layout/header/index.tsx'
  ];
  
  let violations = 0;
  let corrections = [];
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for VThink used as software (FORBIDDEN)
      const vthinkAsSoftware = content.match(/VThink(?:\s+(?:App|Dashboard|Platform|Software|System|Orchestrator|Project))/gi);
      if (vthinkAsSoftware) {
        console.log(`❌ FORBIDDEN: Found VThink used as software in ${file}`);
        console.log(`   Found: ${vthinkAsSoftware.join(', ')}`);
        console.log(`   Should be: VibeThink`);
        violations++;
        corrections.push({
          file,
          type: 'VThink as software',
          found: vthinkAsSoftware,
          shouldBe: 'VibeThink'
        });
      }
      
      // Check for VibeThink used as methodology (FORBIDDEN)
      const vibethinkAsMethodology = content.match(/VibeThink(?:\s+(?:1\.0|methodology|process|standards|compliance|workflow))/gi);
      if (vibethinkAsMethodology) {
        console.log(`❌ FORBIDDEN: Found VibeThink used as methodology in ${file}`);
        console.log(`   Found: ${vibethinkAsMethodology.join(', ')}`);
        console.log(`   Should be: VThink`);
        violations++;
        corrections.push({
          file,
          type: 'VibeThink as methodology',
          found: vibethinkAsMethodology,
          shouldBe: 'VThink'
        });
      }
      
      // Check for correct usage
      const correctVThink = content.match(/VThink(?:\s+(?:1\.0|methodology|process|standards|compliance|workflow))/gi);
      if (correctVThink) {
        console.log(`✅ CORRECT: Found VThink used as methodology in ${file}`);
      }
      
      const correctVibeThink = content.match(/VibeThink(?:\s+(?:Orchestrator|Dashboard|Platform|Software|System|Project))/gi);
      if (correctVibeThink) {
        console.log(`✅ CORRECT: Found VibeThink used as software in ${file}`);
      }
    }
  });
  
  if (violations === 0) {
    console.log('✅ VTHINK LAW: PASSED (no violations found)');
  } else {
    console.log(`❌ VTHINK LAW: FAILED (${violations} violations found)`);
    console.log('\n🔧 REQUIRED CORRECTIONS:');
    corrections.forEach(correction => {
      console.log(`   File: ${correction.file}`);
      console.log(`   Issue: ${correction.type}`);
      console.log(`   Found: ${correction.found.join(', ')}`);
      console.log(`   Should be: ${correction.shouldBe}`);
      console.log('');
    });
  }
  
  return violations === 0;
}

// 2. BRAND CONSISTENCY VALIDATION
function validateBrandConsistency() {
  console.log('\n🔍 2. VALIDATING BRAND CONSISTENCY...');
  
  const filesToCheck = [
    'package.json',
    'README.md',
    'apps/dashboard/package.json'
  ];
  
  let inconsistencies = 0;
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for consistent project naming
      if (content.includes('"name": "vibethink-orchestrator"') || content.includes('"name": "vibethink-orchestrator-dashboard"')) {
        console.log(`✅ CORRECT: Project name follows VibeThink naming convention in ${file}`);
      } else if (content.includes('"name"')) {
        console.log(`❌ INCONSISTENT: Project name should follow VibeThink naming convention in ${file}`);
        inconsistencies++;
      }
      
      // Check for consistent description
      if (content.includes('VibeThink Orchestrator') || content.includes('VibeThink')) {
        console.log(`✅ CORRECT: Uses VibeThink in description in ${file}`);
      } else if (content.includes('description')) {
        console.log(`❌ INCONSISTENT: Should mention VibeThink in description in ${file}`);
        inconsistencies++;
      }
    }
  });
  
  if (inconsistencies === 0) {
    console.log('✅ BRAND CONSISTENCY: PASSED');
  } else {
    console.log(`❌ BRAND CONSISTENCY: FAILED (${inconsistencies} inconsistencies)`);
  }
  
  return inconsistencies === 0;
}

// 3. DOCUMENTATION VALIDATION
function validateDocumentation() {
  console.log('\n🔍 3. VALIDATING DOCUMENTATION...');
  
  const filesToCheck = [
    'README.md',
    'AI_STABILITY_RULES.md',
    'VTHINK_METHODOLOGY_LAW.md'
  ];
  
  let docIssues = 0;
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check if documentation explains the difference
      if (content.includes('VThink = METHODOLOGY') && content.includes('VibeThink = SOFTWARE')) {
        console.log(`✅ CORRECT: Documentation explains VThink vs VibeThink in ${file}`);
      } else if (content.includes('VThink') || content.includes('VibeThink')) {
        console.log(`❌ INCOMPLETE: Documentation should explain VThink vs VibeThink difference in ${file}`);
        docIssues++;
      }
    }
  });
  
  if (docIssues === 0) {
    console.log('✅ DOCUMENTATION: PASSED');
  } else {
    console.log(`❌ DOCUMENTATION: FAILED (${docIssues} issues)`);
  }
  
  return docIssues === 0;
}

// MAIN VALIDATION FUNCTION
function runVThinkLawValidation() {
  console.log('🚨 STARTING VTHINK METHODOLOGY LAW VALIDATION...\n');
  
  const results = {
    vthinkLaw: validateVThinkLaw(),
    brandConsistency: validateBrandConsistency(),
    documentation: validateDocumentation()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 VTHINK LAW VALIDATION RESULTS:');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${test.toUpperCase()}: ${status}`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  if (passed === total) {
    console.log('🎉 ALL VTHINK LAW VALIDATIONS PASSED');
    console.log('✅ VThink = METHODOLOGY, VibeThink = SOFTWARE');
    console.log('✅ AI CAN PROCEED WITH CHANGES');
    process.exit(0);
  } else {
    console.log(`❌ ${total - passed} VTHINK LAW VALIDATIONS FAILED`);
    console.log('🚨 AI MUST FIX VTHINK LAW VIOLATIONS BEFORE PROCEEDING');
    console.log('\n🔧 REQUIRED ACTIONS:');
    console.log('1. Fix VThink used as software (should be VibeThink)');
    console.log('2. Fix VibeThink used as methodology (should be VThink)');
    console.log('3. Ensure brand consistency');
    console.log('4. Update documentation to explain the difference');
    console.log('5. Verify all references are correct');
    process.exit(1);
  }
}

// RUN VALIDATION
if (require.main === module) {
  runVThinkLawValidation();
}

module.exports = {
  validateVThinkLaw,
  validateBrandConsistency,
  validateDocumentation,
  runVThinkLawValidation
}; 