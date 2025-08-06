#!/usr/bin/env node

/**
 * 🛡️ AI STABILITY RULES VALIDATOR - VThink 1.0
 * ⚠️ CRITICAL: This script validates compliance with stability rules
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ AI STABILITY RULES VALIDATOR - VThink 1.0');
console.log('='.repeat(60));

// 1. HYDRATION SAFETY VALIDATION
function validateHydrationSafety() {
  console.log('\n🔍 1. VALIDATING HYDRATION SAFETY...');
  
  const files = [
    'src/shared/components/bundui-premium/components/layout/header/index.tsx',
    'src/shared/components/bundui-premium/components/layout/sidebar.tsx',
    'apps/dashboard/app/layout.tsx'
  ];
  
  let hydrationIssues = 0;
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for forbidden patterns
      const forbiddenPatterns = [
        /useTheme\(\)/,
        /useIsMobile\(\)/,
        /useIsTablet\(\)/
      ];
      
      forbiddenPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          console.log(`❌ FORBIDDEN: Found ${pattern.source} in ${file}`);
          hydrationIssues++;
        }
      });
      
      // Check for mounted state pattern
      if (content.includes('useState(false)') && content.includes('setMounted(true)')) {
        console.log(`✅ VALID: Found mounted state pattern in ${file}`);
      }
    }
  });
  
  if (hydrationIssues === 0) {
    console.log('✅ HYDRATION SAFETY: PASSED');
  } else {
    console.log(`❌ HYDRATION SAFETY: FAILED (${hydrationIssues} issues)`);
  }
  
  return hydrationIssues === 0;
}

// 2. DEPENDENCY MANAGEMENT VALIDATION
function validateDependencies() {
  console.log('\n🔍 2. VALIDATING DEPENDENCY MANAGEMENT...');
  
  const packageJsonPath = 'apps/dashboard/package.json';
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    let caretIssues = 0;
    
    Object.entries(dependencies).forEach(([pkg, version]) => {
      if (typeof version === 'string' && version.startsWith('^')) {
        console.log(`❌ FORBIDDEN: Found caret version ${version} for ${pkg}`);
        caretIssues++;
      }
    });
    
    if (caretIssues === 0) {
      console.log('✅ DEPENDENCY MANAGEMENT: PASSED (all versions are exact)');
    } else {
      console.log(`❌ DEPENDENCY MANAGEMENT: FAILED (${caretIssues} caret versions found)`);
    }
    
    return caretIssues === 0;
  }
  
  console.log('❌ DEPENDENCY MANAGEMENT: FAILED (package.json not found)');
  return false;
}

// 3. PROVIDER CONFIGURATION VALIDATION
function validateProviderConfiguration() {
  console.log('\n🔍 3. VALIDATING PROVIDER CONFIGURATION...');
  
  const layoutPath = 'apps/dashboard/app/layout.tsx';
  
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    if (content.includes('VThinkThemeProvider')) {
      console.log('✅ PROVIDER CONFIGURATION: PASSED (VThinkThemeProvider found)');
      return true;
    } else {
      console.log('❌ PROVIDER CONFIGURATION: FAILED (VThinkThemeProvider missing)');
      return false;
    }
  }
  
  console.log('❌ PROVIDER CONFIGURATION: FAILED (layout.tsx not found)');
  return false;
}

// 4. SERVER STABILITY VALIDATION
function validateServerStability() {
  console.log('\n🔍 4. VALIDATING SERVER STABILITY...');
  
  // Check if .next directory exists (indicates successful build)
  if (fs.existsSync('apps/dashboard/.next')) {
    console.log('✅ SERVER STABILITY: PASSED (.next directory exists)');
    return true;
  } else {
    console.log('❌ SERVER STABILITY: FAILED (.next directory missing)');
    return false;
  }
}

// 5. THEME CUSTOMIZER VALIDATION
function validateThemeCustomizer() {
  console.log('\n🔍 5. VALIDATING THEME CUSTOMIZER...');
  
  const themeProviderPath = 'src/shared/components/bundui-premium/components/theme-customizer/ThemeProvider.tsx';
  
  if (fs.existsSync(themeProviderPath)) {
    const content = fs.readFileSync(themeProviderPath, 'utf8');
    
    if (content.includes('VThinkThemeProvider') && content.includes('useThemeConfig')) {
      console.log('✅ THEME CUSTOMIZER: PASSED (ThemeProvider properly configured)');
      return true;
    } else {
      console.log('❌ THEME CUSTOMIZER: FAILED (ThemeProvider incomplete)');
      return false;
    }
  }
  
  console.log('❌ THEME CUSTOMIZER: FAILED (ThemeProvider not found)');
  return false;
}

// MAIN VALIDATION FUNCTION
function runValidation() {
  console.log('🚨 STARTING MANDATORY COMPLIANCE CHECKLIST...\n');
  
  const results = {
    hydration: validateHydrationSafety(),
    dependencies: validateDependencies(),
    providers: validateProviderConfiguration(),
    server: validateServerStability(),
    theme: validateThemeCustomizer()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION RESULTS:');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${test.toUpperCase()}: ${status}`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  if (passed === total) {
    console.log('🎉 ALL VALIDATIONS PASSED - SYSTEM IS STABLE');
    console.log('✅ AI CAN PROCEED WITH CHANGES');
    process.exit(0);
  } else {
    console.log(`❌ ${total - passed} VALIDATIONS FAILED - SYSTEM IS UNSTABLE`);
    console.log('🚨 AI MUST FIX ISSUES BEFORE PROCEEDING');
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('1. Fix hydration issues with mounted state');
    console.log('2. Remove caret versions from package.json');
    console.log('3. Add VThinkThemeProvider to layout');
    console.log('4. Run npm run dev to test server');
    console.log('5. Verify theme customizer functionality');
    process.exit(1);
  }
}

// RUN VALIDATION
if (require.main === module) {
  runValidation();
}

module.exports = {
  validateHydrationSafety,
  validateDependencies,
  validateProviderConfiguration,
  validateServerStability,
  validateThemeCustomizer,
  runValidation
}; 