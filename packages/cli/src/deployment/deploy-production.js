#!/usr/bin/env node

/**
 * 🚀 Production Deployment Script
 * VThink 1.0 - Blue-Green Deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  environment: 'production',
  dockerRegistry: process.env.DOCKER_REGISTRY || 'registry.vibethink.com',
  imageName: 'vibethink-orchestrator',
  tag: process.env.BUILD_TAG || 'production',
  namespace: 'vibethink-production',
  healthCheckUrl: process.env.PRODUCTION_URL || 'https://app.vibethink.com',
  timeout: 600000, // 10 minutes
  blueDeployment: 'vibethink-orchestrator-blue',
  greenDeployment: 'vibethink-orchestrator-green',
  serviceName: 'vibethink-orchestrator-service',
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Utility functions
const log = (message, color = colors.reset) => {
  // TODO: log `${color}${message}${colors.reset}`
};

const exec = (command, options = {}) => {
  try {
    log(`🔄 Executing: ${command}`, colors.blue);
    return execSync(command, { 
      stdio: 'inherit', 
      timeout: config.timeout,
      ...options 
    });
  } catch (error) {
    log(`❌ Command failed: ${command}`, colors.red);
    throw error;
  }
};

const getCurrentActiveDeployment = () => {
  try {
    const service = exec(`kubectl get service ${config.serviceName} -n ${config.namespace} -o json`, { encoding: 'utf8' });
    const serviceData = JSON.parse(service);
    return serviceData.spec.selector.deployment;
  } catch (error) {
    return config.blueDeployment; // Default to blue
  }
};

const checkHealth = async (url, maxRetries = 15) => {
  log(`🏥 Checking health at: ${url}`, colors.yellow);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url + '/health');
      if (response.ok) {
        log(`✅ Health check passed!`, colors.green);
        return true;
      }
    } catch (error) {
      log(`⏳ Health check attempt ${i + 1}/${maxRetries} failed, retrying...`, colors.yellow);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  throw new Error('Health check failed after maximum retries');
};

// Main deployment process
async function deployProduction() {
  const startTime = Date.now();
  
  try {
    log(`🚀 Starting ${config.environment} deployment...`, colors.bold + colors.blue);
    
    // Step 1: Pre-deployment validation
    log(`\n📋 Step 1: Pre-deployment validation`, colors.bold);
    
    // Check if we're in main branch
    const currentBranch = exec('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (currentBranch !== 'main') {
      throw new Error(`Production deployment only allowed from main branch. Current: ${currentBranch}`);
    }
    
    // Check staging deployment status
    log(`🔍 Checking staging deployment status...`, colors.yellow);
    exec('npm run check:staging-health');
    
    // Step 2: Build and test
    log(`\n🏗️  Step 2: Build and test`, colors.bold);
    
    exec('npm ci');
    exec('npm run lint');
    exec('npm run test:ci');
    exec('npm run test:e2e');
    exec('npm run build');
    
    // Step 3: Docker build
    log(`\n🐳 Step 3: Docker build`, colors.bold);
    
    const imageTag = `${config.dockerRegistry}/${config.imageName}:${config.tag}`;
    exec(`docker build -t ${imageTag} .`);
    
    // Step 4: Push to registry
    log(`\n📤 Step 4: Push to registry`, colors.bold);
    
    exec(`docker push ${imageTag}`);
    
    // Step 5: Blue-Green Deployment
    log(`\n🔄 Step 5: Blue-Green Deployment`, colors.bold);
    
    const currentActive = getCurrentActiveDeployment();
    const targetDeployment = currentActive === config.blueDeployment ? config.greenDeployment : config.blueDeployment;
    
    log(`🎯 Current active: ${currentActive}`, colors.yellow);
    log(`🎯 Target deployment: ${targetDeployment}`, colors.yellow);
    
    // Deploy to inactive deployment
    exec(`kubectl set image deployment/${targetDeployment} app=${imageTag} -n ${config.namespace}`);
    
    // Wait for rollout
    exec(`kubectl rollout status deployment/${targetDeployment} -n ${config.namespace} --timeout=600s`);
    
    // Step 6: Health check on new deployment
    log(`\n🏥 Step 6: Health check on new deployment`, colors.bold);
    
    // Get the service URL for the new deployment
    const newServiceUrl = `${config.healthCheckUrl}/deployment/${targetDeployment}`;
    await checkHealth(newServiceUrl);
    
    // Step 7: Switch traffic
    log(`\n🔄 Step 7: Switch traffic`, colors.bold);
    
    exec(`kubectl patch service ${config.serviceName} -n ${config.namespace} -p '{"spec":{"selector":{"deployment":"${targetDeployment}"}}}'`);
    
    // Step 8: Final health check
    log(`\n🏥 Step 8: Final health check`, colors.bold);
    
    await checkHealth(config.healthCheckUrl);
    
    // Step 9: Production tests
    log(`\n🧪 Step 9: Production tests`, colors.bold);
    
    exec('npm run test:smoke -- --base-url=' + config.healthCheckUrl);
    exec('npm run test:performance -- --url=' + config.healthCheckUrl);
    
    // Step 10: Monitor for 5 minutes
    log(`\n📊 Step 10: Monitoring deployment health`, colors.bold);
    
    for (let i = 0; i < 30; i++) {
      try {
        await checkHealth(config.healthCheckUrl);
        log(`✅ Health check ${i + 1}/30 passed`, colors.green);
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
      } catch (error) {
        log(`❌ Health check failed during monitoring`, colors.red);
        throw error;
      }
    }
    
    // Success
    const duration = Math.round((Date.now() - startTime) / 1000);
    log(`\n🎉 Production deployment completed successfully in ${duration}s!`, colors.bold + colors.green);
    
    // Cleanup old deployment (optional)
    log(`🧹 Cleaning up old deployment...`, colors.blue);
    try {
      exec(`kubectl scale deployment ${currentActive} --replicas=0 -n ${config.namespace}`);
      log(`✅ Old deployment scaled down`, colors.green);
    } catch (error) {
      log(`⚠️  Warning: Could not scale down old deployment`, colors.yellow);
    }
    
    // Send notification
    log(`📧 Sending success notification...`, colors.blue);
    exec('npm run notify:deployment-success');
    
  } catch (error) {
    log(`\n❌ Production deployment failed: ${error.message}`, colors.bold + colors.red);
    
    // Emergency rollback
    log(`🆘 Emergency rollback...`, colors.red);
    try {
      const currentActive = getCurrentActiveDeployment();
      const targetDeployment = currentActive === config.blueDeployment ? config.greenDeployment : config.blueDeployment;
      
      exec(`kubectl patch service ${config.serviceName} -n ${config.namespace} -p '{"spec":{"selector":{"deployment":"${currentActive}"}}}'`);
      exec(`kubectl scale deployment ${targetDeployment} --replicas=0 -n ${config.namespace}`);
      
      log(`✅ Emergency rollback completed`, colors.green);
    } catch (rollbackError) {
      log(`❌ Emergency rollback failed: ${rollbackError.message}`, colors.red);
    }
    
    // Send failure notification
    log(`📧 Sending failure notification...`, colors.blue);
    exec('npm run notify:deployment-failure');
    
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployProduction().catch(error => {
    log(`💥 Fatal error: ${error.message}`, colors.bold + colors.red);
    process.exit(1);
  });
}

module.exports = { deployProduction, config }; 