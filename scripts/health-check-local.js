#!/usr/bin/env node

/**
 * 🏥 Local Health Check Script
 * VThink 1.0 - Development Health Monitoring
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  port: 8080,
  host: 'localhost',
  healthEndpoints: [
    '/health',
    '/api/health',
    '/dev-portal',
    '/'
  ],
  services: [
    { name: 'Vite Dev Server', port: 8080, path: '/' },
    { name: 'Supabase Local', port: 54321, path: '/health' },
    { name: 'Traefik', port: 8080, path: '/api/rawdata' }
  ]
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Check if port is in use
const checkPort = (port) => {
  try {
    execSync(`netstat -an | findstr :${port}`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
};

// Check if service is responding
const checkService = async (service) => {
  try {
    const response = await fetch(`http://${config.host}:${service.port}${service.path}`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Check file system health
const checkFileSystem = () => {
  const criticalFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tailwind.config.ts',
    'src/main.tsx',
    'src/App.tsx'
  ];
  
  const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));
  
  return {
    healthy: missingFiles.length === 0,
    missingFiles
  };
};

// Check dependencies health
const checkDependencies = () => {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const nodeModulesExists = fs.existsSync('node_modules');
    const packageLockExists = fs.existsSync('package-lock.json');
    
    return {
      healthy: nodeModulesExists && packageLockExists,
      nodeModulesExists,
      packageLockExists,
      dependencies: Object.keys(packageJson.dependencies || {}).length,
      devDependencies: Object.keys(packageJson.devDependencies || {}).length
    };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Check build health
const checkBuildHealth = () => {
  try {
    const distExists = fs.existsSync('dist');
    const indexHtmlExists = fs.existsSync('dist/index.html');
    
    return {
      healthy: distExists && indexHtmlExists,
      distExists,
      indexHtmlExists
    };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Main health check function
async function performHealthCheck() {
  log(`🏥 Starting Local Health Check`, colors.bold + colors.blue);
  
  const results = {
    timestamp: new Date().toISOString(),
    overall: true,
    checks: {}
  };
  
  try {
    // Check 1: File System
    log(`\n📁 Checking file system...`, colors.cyan);
    const fsHealth = checkFileSystem();
    results.checks.fileSystem = fsHealth;
    
    if (fsHealth.healthy) {
      log(`✅ File system healthy`, colors.green);
    } else {
      log(`❌ Missing files: ${fsHealth.missingFiles.join(', ')}`, colors.red);
      results.overall = false;
    }
    
    // Check 2: Dependencies
    log(`\n📦 Checking dependencies...`, colors.cyan);
    const depsHealth = checkDependencies();
    results.checks.dependencies = depsHealth;
    
    if (depsHealth.healthy) {
      log(`✅ Dependencies healthy (${depsHealth.dependencies} deps, ${depsHealth.devDependencies} dev deps)`, colors.green);
    } else {
      log(`❌ Dependencies unhealthy: ${depsHealth.error || 'Missing node_modules'}`, colors.red);
      results.overall = false;
    }
    
    // Check 3: Port Availability
    log(`\n🔌 Checking port availability...`, colors.cyan);
    const portHealth = checkPort(config.port);
    results.checks.portAvailability = { healthy: !portHealth, port: config.port };
    
    if (!portHealth) {
      log(`✅ Port ${config.port} available`, colors.green);
    } else {
      log(`⚠️  Port ${config.port} in use`, colors.yellow);
    }
    
    // Check 4: Services (if running)
    log(`\n🌐 Checking services...`, colors.cyan);
    const serviceChecks = [];
    
    for (const service of config.services) {
      const isRunning = checkPort(service.port);
      const isResponding = isRunning ? await checkService(service) : false;
      
      serviceChecks.push({
        name: service.name,
        port: service.port,
        running: isRunning,
        responding: isResponding,
        healthy: isRunning && isResponding
      });
      
      if (isRunning && isResponding) {
        log(`✅ ${service.name} healthy`, colors.green);
      } else if (isRunning) {
        log(`⚠️  ${service.name} running but not responding`, colors.yellow);
      } else {
        log(`ℹ️  ${service.name} not running`, colors.blue);
      }
    }
    
    results.checks.services = serviceChecks;
    
    // Check 5: Build Health
    log(`\n🏗️  Checking build health...`, colors.cyan);
    const buildHealth = checkBuildHealth();
    results.checks.build = buildHealth;
    
    if (buildHealth.healthy) {
      log(`✅ Build healthy`, colors.green);
    } else {
      log(`⚠️  Build not ready`, colors.yellow);
    }
    
    // Overall result
    log(`\n📊 Health Check Summary:`, colors.bold);
    
    if (results.overall) {
      log(`✅ Overall Health: EXCELLENT`, colors.bold + colors.green);
    } else {
      log(`⚠️  Overall Health: NEEDS ATTENTION`, colors.bold + colors.yellow);
    }
    
    // Recommendations
    log(`\n💡 Recommendations:`, colors.bold);
    
    if (!fsHealth.healthy) {
      log(`   • Run: npm run dev:setup`, colors.cyan);
    }
    
    if (!depsHealth.healthy) {
      log(`   • Run: npm install`, colors.cyan);
    }
    
    if (portHealth) {
      log(`   • Kill process on port ${config.port} or use different port`, colors.cyan);
    }
    
    if (!buildHealth.healthy) {
      log(`   • Run: npm run build`, colors.cyan);
    }
    
    // Save health report
    const reportPath = 'health-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`\n📄 Health report saved to: ${reportPath}`, colors.blue);
    
    return results;
    
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, colors.red);
    results.overall = false;
    results.error = error.message;
    return results;
  }
}

// Run health check
if (require.main === module) {
  performHealthCheck().then(results => {
    process.exit(results.overall ? 0 : 1);
  }).catch(error => {
    log(`💥 Fatal error: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { performHealthCheck, config }; 