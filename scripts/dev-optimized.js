#!/usr/bin/env node

/**
 * 🚀 Optimized Development Script
 * VThink 1.0 - Local Development Enhancement
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  port: 8080,
  host: 'localhost',
  watchMode: true,
  autoRestart: true,
  healthCheck: true,
  performanceMonitoring: true,
  memoryLimit: '2GB',
  cpuLimit: '50%'
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

// Health check function
const checkHealth = async () => {
  try {
    const response = await fetch(`http://${config.host}:${config.port}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Performance monitoring
const monitorPerformance = () => {
  const startTime = Date.now();
  const memoryUsage = process.memoryUsage();
  
  return {
    uptime: Date.now() - startTime,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
    }
  };
};

// Main development process
async function startOptimizedDev() {
  log(`🚀 Starting Optimized Development Environment`, colors.bold + colors.green);
  
  try {
    // Step 1: Pre-flight checks
    log(`\n📋 Step 1: Pre-flight checks`, colors.bold);
    
    // Check Node.js version
    const nodeVersion = exec('node --version', { encoding: 'utf8' }).trim();
    log(`✅ Node.js: ${nodeVersion}`, colors.green);
    
    // Check npm version
    const npmVersion = exec('npm --version', { encoding: 'utf8' }).trim();
    log(`✅ npm: ${npmVersion}`, colors.green);
    
    // Check available memory
    const memInfo = require('os').freemem();
    const memGB = Math.round(memInfo / 1024 / 1024 / 1024 * 100) / 100;
    log(`✅ Available memory: ${memGB}GB`, colors.green);
    
    // Step 2: Clean environment
    log(`\n🧹 Step 2: Clean environment`, colors.bold);
    
    // Kill existing processes
    try {
      exec('taskkill /f /im node.exe 2>nul', { stdio: 'ignore' });
      log(`✅ Killed existing Node.js processes`, colors.green);
    } catch (error) {
      log(`ℹ️  No existing processes to kill`, colors.yellow);
    }
    
    // Clear cache
    exec('npm run clean:cache');
    log(`✅ Cleared npm cache`, colors.green);
    
    // Step 3: Install dependencies
    log(`\n📦 Step 3: Install dependencies`, colors.bold);
    
    exec('npm ci');
    log(`✅ Dependencies installed`, colors.green);
    
    // Step 4: Type checking
    log(`\n🔍 Step 4: Type checking`, colors.bold);
    
    exec('npm run type-check');
    log(`✅ TypeScript validation passed`, colors.green);
    
    // Step 5: Linting
    log(`\n🎨 Step 5: Code quality check`, colors.bold);
    
    exec('npm run lint');
    log(`✅ ESLint passed`, colors.green);
    
    // Step 6: Start development server
    log(`\n🚀 Step 6: Starting development server`, colors.bold);
    
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development',
        VITE_DEV_MODE: 'optimized',
        VITE_PERFORMANCE_MONITORING: 'true'
      }
    });
    
    // Step 7: Health monitoring
    log(`\n🏥 Step 7: Health monitoring`, colors.bold);
    
    let healthCheckInterval;
    let performanceInterval;
    
    // Start health monitoring after 10 seconds
    setTimeout(async () => {
      healthCheckInterval = setInterval(async () => {
        const isHealthy = await checkHealth();
        if (isHealthy) {
          log(`✅ Health check passed`, colors.green);
        } else {
          log(`⚠️  Health check failed`, colors.yellow);
        }
      }, 30000); // Every 30 seconds
      
      // Performance monitoring
      performanceInterval = setInterval(() => {
        const perf = monitorPerformance();
        log(`📊 Performance: ${perf.memory.heapUsed} heap, ${perf.memory.rss} total`, colors.cyan);
      }, 60000); // Every minute
    }, 10000);
    
    // Step 8: Auto-restart on file changes
    if (config.autoRestart) {
      log(`\n🔄 Step 8: Auto-restart enabled`, colors.bold);
      
      // Watch for critical file changes
      const criticalFiles = [
        'package.json',
        'vite.config.ts',
        'tailwind.config.ts',
        'tsconfig.json'
      ];
      
      criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.watchFile(file, (curr, prev) => {
            if (curr.mtime > prev.mtime) {
              log(`🔄 Critical file changed: ${file}`, colors.magenta);
              log(`🔄 Restarting development server...`, colors.magenta);
              devProcess.kill('SIGTERM');
            }
          });
        }
      });
    }
    
    // Step 9: Development tips
    log(`\n💡 Development Tips:`, colors.bold);
    log(`   • Press Ctrl+C to stop the server`, colors.cyan);
    log(`   • Use npm run test:watch for continuous testing`, colors.cyan);
    log(`   • Use npm run build:watch for continuous building`, colors.cyan);
    log(`   • Check http://localhost:8080 for the app`, colors.cyan);
    log(`   • Check http://localhost:8080/dev-portal for dev tools`, colors.cyan);
    
    // Handle process termination
    process.on('SIGINT', () => {
      log(`\n🛑 Shutting down development environment...`, colors.yellow);
      
      if (healthCheckInterval) clearInterval(healthCheckInterval);
      if (performanceInterval) clearInterval(performanceInterval);
      
      devProcess.kill('SIGTERM');
      process.exit(0);
    });
    
    // Handle process errors
    devProcess.on('error', (error) => {
      log(`❌ Development server error: ${error.message}`, colors.red);
      process.exit(1);
    });
    
    devProcess.on('exit', (code) => {
      if (code !== 0) {
        log(`❌ Development server exited with code ${code}`, colors.red);
        process.exit(code);
      }
    });
    
  } catch (error) {
    log(`❌ Failed to start optimized development: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run development
if (require.main === module) {
  startOptimizedDev().catch(error => {
    log(`💥 Fatal error: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { startOptimizedDev, config }; 