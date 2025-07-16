#!/usr/bin/env node

/**
 * 🔄 Porte Version Monitor
 * 
 * Monitors upstream repositories for new releases and triggers evaluation pipeline
 * 
 * Features:
 * - GitHub API integration for release monitoring
 * - Webhook support for real-time notifications
 * - Security advisory monitoring
 * - Automated evaluation triggering
 * - Multi-repository support
 * 
 * Usage:
 *   node scripts/porte-version-monitor.js [--config=path] [--dry-run]
 * 
 * Version: 1.0
 * Author: AI Pair Orchestrator Pro
 * Framework: VTK Methodology 1.0
 */

const fs = require('fs').promises;
const path = require('path');
const { Octokit } = require('@octokit/rest');
const yaml = require('js-yaml');
const semver = require('semver');

// Database and notification services (to be implemented)
const { PorteTracker } = require('./lib/porte-tracker');
const { NotificationService } = require('./lib/notifications');
const { DeltaAnalyzer } = require('./lib/delta-analyzer');
const { RiskEvaluator } = require('./lib/risk-evaluator');
const { AutoDecider } = require('./lib/auto-decider');

class PorteVersionMonitor {
  constructor(configPath = './config/porte-tracking.yaml') {
    this.configPath = configPath;
    this.config = null;
    this.octokit = null;
    this.tracker = null;
    this.notifications = null;
    this.deltaAnalyzer = null;
    this.riskEvaluator = null;
    this.autoDecider = null;
    this.dryRun = process.argv.includes('--dry-run');
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Porte Version Monitor...');
      
      // Load configuration
      await this.loadConfiguration();
      
      // Initialize services
      this.octokit = new Octokit({
        auth: this.config.github.token,
        userAgent: 'VibeThink-Porte-Monitor v1.0'
      });
      
      this.tracker = new PorteTracker(this.config.database);
      this.notifications = new NotificationService(this.config.notifications);
      this.deltaAnalyzer = new DeltaAnalyzer(this.config.analysis);
      this.riskEvaluator = new RiskEvaluator(this.config.risk_evaluation);
      this.autoDecider = new AutoDecider(this.config.auto_decision);
      
      console.log('✅ All services initialized successfully');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      throw error;
    }
  }

  async loadConfiguration() {
    try {
      const configContent = await fs.readFile(this.configPath, 'utf8');
      this.config = yaml.load(configContent);
      
      // Validate required configuration
      this.validateConfiguration();
      
      console.log(`📋 Configuration loaded from ${this.configPath}`);
      console.log(`📦 Monitoring ${Object.keys(this.config.portes).length} porte(s)`);
      
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  validateConfiguration() {
    const required = ['github', 'portes', 'notifications', 'database'];
    
    for (const field of required) {
      if (!this.config[field]) {
        throw new Error(`Missing required configuration field: ${field}`);
      }
    }
    
    // Validate each porte configuration
    for (const [name, porte] of Object.entries(this.config.portes)) {
      if (!porte.upstream_repo || !porte.component_name) {
        throw new Error(`Invalid porte configuration for ${name}`);
      }
    }
  }

  async monitorAllPortes() {
    console.log('🔍 Starting version monitoring for all portes...');
    
    const results = [];
    
    for (const [porteName, porteConfig] of Object.entries(this.config.portes)) {
      try {
        console.log(`\n📦 Checking ${porteName}...`);
        const result = await this.monitorPorte(porteName, porteConfig);
        results.push({ porte: porteName, ...result });
        
      } catch (error) {
        console.error(`❌ Error monitoring ${porteName}:`, error.message);
        results.push({ 
          porte: porteName, 
          status: 'error', 
          error: error.message 
        });
      }
    }
    
    await this.generateMonitoringReport(results);
    return results;
  }

  async monitorPorte(porteName, porteConfig) {
    // Get current porte version
    const currentVersion = await this.tracker.getCurrentVersion(porteConfig.component_name);
    
    // Get latest upstream release
    const latestRelease = await this.getLatestUpstreamRelease(porteConfig.upstream_repo);
    
    // Check if there's a new version
    if (!this.isNewVersion(latestRelease.tag_name, currentVersion)) {
      console.log(`✅ ${porteName} is up to date (${currentVersion})`);
      return { 
        status: 'up_to_date', 
        current_version: currentVersion,
        latest_version: latestRelease.tag_name
      };
    }
    
    console.log(`🆕 New version detected: ${currentVersion} -> ${latestRelease.tag_name}`);
    
    // Process new version
    return await this.processNewVersion(porteName, porteConfig, latestRelease, currentVersion);
  }

  async getLatestUpstreamRelease(repoFullName) {
    const [owner, repo] = repoFullName.split('/');
    
    try {
      const { data: releases } = await this.octokit.rest.repos.listReleases({
        owner,
        repo,
        per_page: 10
      });
      
      // Filter out pre-releases unless specifically configured
      const stableReleases = releases.filter(release => 
        !release.prerelease || this.config.monitoring?.include_prereleases
      );
      
      if (stableReleases.length === 0) {
        throw new Error('No stable releases found');
      }
      
      return stableReleases[0];
      
    } catch (error) {
      throw new Error(`Failed to fetch releases for ${repoFullName}: ${error.message}`);
    }
  }

  isNewVersion(latestVersion, currentVersion) {
    if (!currentVersion) return true;
    
    // Clean version strings (remove 'v' prefix if present)
    const cleanLatest = latestVersion.replace(/^v/, '');
    const cleanCurrent = currentVersion.replace(/^v/, '');
    
    try {
      return semver.gt(cleanLatest, cleanCurrent);
    } catch (error) {
      // Fallback to string comparison if semver fails
      console.warn(`Semver comparison failed, using string comparison: ${error.message}`);
      return cleanLatest !== cleanCurrent;
    }
  }

  async processNewVersion(porteName, porteConfig, release, currentVersion) {
    console.log(`🔬 Processing new version for ${porteName}...`);
    
    // Create evaluation record
    const evaluation = await this.tracker.createEvaluation(
      porteConfig.component_name,
      release.tag_name,
      {
        upstream_repo: porteConfig.upstream_repo,
        current_version: currentVersion,
        release_url: release.html_url,
        release_notes: release.body
      }
    );
    
    try {
      // Analyze changes
      console.log('📊 Analyzing changes...');
      const changeAnalysis = await this.deltaAnalyzer.analyzeChanges(
        porteConfig.upstream_repo,
        currentVersion,
        release.tag_name
      );
      
      // Evaluate risks  
      console.log('⚠️ Evaluating risks...');
      const riskAssessment = await this.riskEvaluator.evaluateRisk(
        changeAnalysis,
        porteConfig,
        release
      );
      
      // Make decision
      console.log('🤖 Making auto-decision...');
      const decision = await this.autoDecider.makeDecision(
        riskAssessment,
        porteConfig.auto_approval_settings,
        changeAnalysis
      );
      
      // Update evaluation with results
      await this.tracker.updateEvaluation(evaluation.id, {
        risk_score: riskAssessment.total_risk,
        decision: decision.recommendation,
        decision_reason: decision.reason,
        change_analysis: changeAnalysis,
        risk_assessment: riskAssessment,
        confidence_score: decision.confidence
      });
      
      // Send notifications
      await this.notifications.sendVersionAlert({
        type: decision.recommendation,
        porte: porteName,
        current_version: currentVersion,
        new_version: release.tag_name,
        risk_score: riskAssessment.total_risk,
        decision_reason: decision.reason,
        evaluation_id: evaluation.id,
        release_url: release.html_url
      });
      
      // Trigger implementation pipeline if auto-approved
      if (decision.recommendation === 'AUTO_APPROVE' && !this.dryRun) {
        console.log('🚀 Triggering auto-implementation...');
        await this.triggerImplementation(evaluation.id);
      }
      
      return {
        status: 'processed',
        current_version: currentVersion,
        new_version: release.tag_name,
        decision: decision.recommendation,
        risk_score: riskAssessment.total_risk,
        evaluation_id: evaluation.id
      };
      
    } catch (error) {
      await this.tracker.updateEvaluation(evaluation.id, {
        status: 'failed',
        error_message: error.message
      });
      
      throw error;
    }
  }

  async triggerImplementation(evaluationId) {
    // This would trigger the implementation pipeline
    // For now, we'll just log and create a task
    
    console.log(`📋 Creating implementation task for evaluation ${evaluationId}`);
    
    // In a real implementation, this would:
    // 1. Queue the implementation job
    // 2. Trigger CI/CD pipeline
    // 3. Create GitHub issue/PR
    // 4. Schedule quality gates
    
    if (!this.dryRun) {
      await this.tracker.createImplementationTask(evaluationId, {
        status: 'queued',
        scheduled_at: new Date(),
        priority: 'normal'
      });
    }
  }

  async generateMonitoringReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      total_portes: results.length,
      summary: {
        up_to_date: results.filter(r => r.status === 'up_to_date').length,
        new_versions: results.filter(r => r.status === 'processed').length,
        errors: results.filter(r => r.status === 'error').length
      },
      results: results
    };
    
    // Save report
    const reportPath = path.join(
      './docs/PROJECT/02_ARCHITECTURE/STACK_MANAGEMENT/VERSION_MONITORING_REPORTS',
      `monitoring-report-${new Date().toISOString().split('T')[0]}.json`
    );
    
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 Monitoring Report Generated:`);
    console.log(`   📁 ${reportPath}`);
    console.log(`   📦 Total Portes: ${report.total_portes}`);
    console.log(`   ✅ Up to Date: ${report.summary.up_to_date}`);
    console.log(`   🆕 New Versions: ${report.summary.new_versions}`);
    console.log(`   ❌ Errors: ${report.summary.errors}`);
    
    return report;
  }

  async checkSecurityAdvisories() {
    console.log('🔒 Checking security advisories...');
    
    // This would integrate with:
    // - GitHub Security Advisories API
    // - CVE databases
    // - Snyk/other security services
    
    // For each porte, check if there are security advisories
    // and trigger immediate evaluation for security patches
    
    // Implementation would go here...
    console.log('⚠️ Security advisory checking not yet implemented');
  }
}

// CLI interface
async function main() {
  const configPath = process.argv.find(arg => arg.startsWith('--config='))?.split('=')[1];
  const monitor = new PorteVersionMonitor(configPath);
  
  try {
    await monitor.initialize();
    
    if (process.argv.includes('--security-check')) {
      await monitor.checkSecurityAdvisories();
    } else {
      await monitor.monitorAllPortes();
    }
    
    console.log('\n✅ Version monitoring completed successfully');
    
  } catch (error) {
    console.error('\n❌ Version monitoring failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = PorteVersionMonitor;

// Run if called directly
if (require.main === module) {
  main();
}
