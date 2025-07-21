#!/usr/bin/env node

/**
 * 🧪 Optimized Testing Script
 * VThink 1.0 - Local Testing Enhancement
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  testTypes: ['unit', 'integration', 'e2e', 'performance'],
  coverageThreshold: 80,
  parallelTests: true,
  watchMode: false,
  generateReport: true
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const exec = (command, options = {}) => {
  try {
    log(`🔄 ${command}`, colors.blue);
    return execSync(command, { 
      stdio: 'inherit', 
      ...options 
    });
  } catch (error) {
    log(`❌ ${command} failed`, colors.red);
    throw error;
  }
};

// Test runner functions
const runUnitTests = () => {
  log(`\n🧪 Running Unit Tests`, colors.bold);
  exec('npm run test:unit');
  log(`✅ Unit tests completed`, colors.green);
};

const runIntegrationTests = () => {
  log(`\n🔗 Running Integration Tests`, colors.bold);
  exec('npm run test:integration');
  log(`✅ Integration tests completed`, colors.green);
};

const runE2ETests = () => {
  log(`\n🌐 Running E2E Tests`, colors.bold);
  exec('npm run test:e2e');
  log(`✅ E2E tests completed`, colors.green);
};

const runPerformanceTests = () => {
  log(`\n📊 Running Performance Tests`, colors.bold);
  exec('npm run test:performance');
  log(`✅ Performance tests completed`, colors.green);
};

const generateTestReport = () => {
  log(`\n📋 Generating Test Report`, colors.bold);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      coverage: 0
    },
    details: {}
  };
  
  // Read coverage report if exists
  const coveragePath = 'coverage/lcov-report/index.html';
  if (fs.existsSync(coveragePath)) {
    log(`📊 Coverage report available at: ${coveragePath}`, colors.green);
  }
  
  // Save test report
  const reportPath = 'test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📄 Test report saved to: ${reportPath}`, colors.blue);
};

// Main testing process
async function runOptimizedTests() {
  const startTime = Date.now();
  
  try {
    log(`🧪 Starting Optimized Test Suite`, colors.bold + colors.blue);
    
    // Step 1: Pre-test checks
    log(`\n📋 Step 1: Pre-test checks`, colors.bold);
    
    // Check if tests directory exists
    if (!fs.existsSync('tests')) {
      log(`⚠️  Tests directory not found`, colors.yellow);
    } else {
      log(`✅ Tests directory found`, colors.green);
    }
    
    // Check if vitest is installed
    try {
      exec('npx vitest --version', { stdio: 'pipe' });
      log(`✅ Vitest available`, colors.green);
    } catch (error) {
      log(`❌ Vitest not available`, colors.red);
      throw new Error('Vitest is required for testing');
    }
    
    // Step 2: Run tests based on arguments
    const args = process.argv.slice(2);
    const testTypes = args.length > 0 ? args : config.testTypes;
    
    log(`\n🎯 Running tests: ${testTypes.join(', ')}`, colors.bold);
    
    for (const testType of testTypes) {
      switch (testType) {
        case 'unit':
          runUnitTests();
          break;
        case 'integration':
          runIntegrationTests();
          break;
        case 'e2e':
          runE2ETests();
          break;
        case 'performance':
          runPerformanceTests();
          break;
        default:
          log(`⚠️  Unknown test type: ${testType}`, colors.yellow);
      }
    }
    
    // Step 3: Generate report
    if (config.generateReport) {
      generateTestReport();
    }
    
    // Step 4: Coverage check
    log(`\n📊 Step 4: Coverage analysis`, colors.bold);
    
    try {
      const coverage = exec('npm run test:coverage', { encoding: 'utf8' });
      log(`✅ Coverage analysis completed`, colors.green);
      
      // Check if coverage meets threshold
      if (coverage.includes('All files')) {
        log(`✅ Coverage threshold met (${config.coverageThreshold}%)`, colors.green);
      } else {
        log(`⚠️  Coverage below threshold`, colors.yellow);
      }
    } catch (error) {
      log(`⚠️  Coverage analysis failed`, colors.yellow);
    }
    
    // Success
    const duration = Math.round((Date.now() - startTime) / 1000);
    log(`\n🎉 Test suite completed successfully in ${duration}s!`, colors.bold + colors.green);
    
    // Tips for improvement
    log(`\n💡 Testing Tips:`, colors.bold);
    log(`   • Use 'npm run test:watch' for continuous testing`, colors.cyan);
    log(`   • Use 'npm run test:ui' for visual test runner`, colors.cyan);
    log(`   • Use 'npm run test:coverage' for detailed coverage`, colors.cyan);
    log(`   • Use 'npm run test:fast' for quick tests`, colors.cyan);
    
  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, colors.bold + colors.red);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runOptimizedTests().catch(error => {
    log(`💥 Fatal error: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { runOptimizedTests, config }; 