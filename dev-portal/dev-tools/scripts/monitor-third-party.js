#!/usr/bin/env node
/**
 * 🔍 THIRD-PARTY MONITORING ENGINE
 * 
 * Sistema automático de monitoreo de componentes de terceros
 * Integrado con el Universal Evaluation Framework
 * 
 * Usage: node scripts/monitor-third-party.js
 * Environment: GITHUB_TOKEN, REPOS_TO_MONITOR, SLACK_WEBHOOK (opcional)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const MONITORED_COMPONENTS_FILE = path.join(__dirname, '../config/monitored-components.json');
const EVALUATION_OUTPUT_DIR = path.join(__dirname, '../docs/PROJECT/02_ARCHITECTURE/UNIVERSAL_EVALUATIONS');
const DECISIONS_DIR = path.join(__dirname, '../docs/PROJECT/02_ARCHITECTURE/THIRD_PARTY_DECISIONS');

class ThirdPartyMonitor {
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
    this.slackWebhook = process.env.SLACK_WEBHOOK;
    this.components = this.loadMonitoredComponents();
    
    if (!this.githubToken) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
  }

  loadMonitoredComponents() {
    try {
      const data = fs.readFileSync(MONITORED_COMPONENTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('📋 No monitored components file found, creating default...');
      const defaultComponents = {
        components: [
          {
            name: "postiz",
            repo: "gitroomhq/postiz-app",
            current_version: "v1.0.0",
            monitoring_level: "releases_and_security",
            evaluation_profile: "technology",
            last_check: null,
            status: "active"
          }
        ],
        config: {
          check_frequency: "daily",
          notification_channels: ["github_issues", "slack"],
          auto_evaluation: true,
          decision_timeout_days: 5
        }
      };
      
      // Ensure config directory exists
      const configDir = path.dirname(MONITORED_COMPONENTS_FILE);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(MONITORED_COMPONENTS_FILE, JSON.stringify(defaultComponents, null, 2));
      return defaultComponents;
    }
  }

  async checkGitHubRelease(repoPath) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}/releases/latest`, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release = await response.json();
      return {
        version: release.tag_name,
        name: release.name,
        published_at: release.published_at,
        body: release.body,
        html_url: release.html_url,
        prerelease: release.prerelease,
        draft: release.draft
      };
    } catch (error) {
      console.error(`❌ Error checking releases for ${repoPath}:`, error.message);
      return null;
    }
  }

  async checkSecurityAdvisories(repoPath) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}/security-advisories`, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        return []; // No security advisories endpoint available
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`⚠️  Could not check security advisories for ${repoPath}:`, error.message);
      return [];
    }
  }

  async generateUniversalEvaluation(component, changeContext) {
    const timestamp = new Date().toISOString().split('T')[0];
    const evaluationId = `eval-${component.name}-update-${timestamp}`;
    
    // Use existing universal evaluation engine
    const UniversalEvaluator = require('./universal-evaluation-engine');
    
    const evaluationContext = {
      decision_type: 'third_party_update',
      component_name: component.name,
      repo: component.repo,
      current_version: component.current_version,
      new_version: changeContext.new_version,
      change_type: changeContext.type, // 'release', 'security', 'major_commit'
      change_details: changeContext.details,
      evaluation_profile: component.evaluation_profile || 'technology',
      metadata: {
        evaluation_id: evaluationId,
        generated_by: 'third-party-monitor',
        generated_at: new Date().toISOString()
      }
    };

    try {
      const evaluation = await UniversalEvaluator.evaluate(evaluationContext);
      
      // Save evaluation report
      const reportPath = path.join(EVALUATION_OUTPUT_DIR, `${evaluationId}.json`);
      const markdownPath = path.join(EVALUATION_OUTPUT_DIR, `${evaluationId}.md`);
      
      // Ensure directory exists
      if (!fs.existsSync(EVALUATION_OUTPUT_DIR)) {
        fs.mkdirSync(EVALUATION_OUTPUT_DIR, { recursive: true });
      }
      
      // Save JSON report
      fs.writeFileSync(reportPath, JSON.stringify(evaluation, null, 2));
      
      // Generate Markdown report
      const markdownReport = this.generateMarkdownReport(evaluation, changeContext);
      fs.writeFileSync(markdownPath, markdownReport);
      
      return {
        evaluation,
        reportPath,
        markdownPath,
        evaluationId
      };
    } catch (error) {
      console.error(`❌ Error generating evaluation for ${component.name}:`, error.message);
      return null;
    }
  }

  generateMarkdownReport(evaluation, changeContext) {
    return `# 🔄 UPDATE EVALUATION: ${changeContext.component_name}

**Generated**: ${new Date().toLocaleString()}  
**Evaluation ID**: ${evaluation.metadata.evaluation_id}  
**Change Type**: ${changeContext.type}  

---

## 📊 **CHANGE SUMMARY**

**Component**: ${changeContext.repo}  
**Version Change**: \`${changeContext.current_version}\` → \`${changeContext.new_version}\`  
**Change Type**: ${changeContext.type}  

### 🔍 **Change Details**
${changeContext.details}

---

## 🏆 **EVALUATION RESULTS**

**Overall Score**: ${evaluation.results.total_score}/10  
**Risk Level**: ${evaluation.results.risk_level}  
**Recommendation**: ${evaluation.results.recommendation}  

### 📈 **Dimension Scores**
${Object.entries(evaluation.results.dimension_scores)
  .map(([dim, score]) => `- **${dim.charAt(0).toUpperCase() + dim.slice(1)}**: ${score}/10`)
  .join('\n')}

---

## 🎯 **RECOMMENDED ACTIONS**

${evaluation.results.scenarios.map(scenario => `
### ${scenario.name}
**Effort**: ${scenario.effort_estimate}  
**Risk**: ${scenario.risk_level}  
**Timeline**: ${scenario.timeline}  

${scenario.description}

**Next Steps**:
${scenario.implementation_steps.map(step => `- ${step}`).join('\n')}
`).join('\n')}

---

## ⚡ **DECISION REQUIRED**

This evaluation requires an explicit decision within **5 business days**:

- [ ] **ACCEPT**: Integrate update (creates implementation PR)
- [ ] **DEFER**: Schedule for future sprint with justification  
- [ ] **REJECT**: Explicit rejection with documented reasoning

**Decision Deadline**: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}

---

*Generated by Third-Party Monitoring System - Universal Evaluation Framework v2.0*
`;
  }

  async createDecisionIssue(component, evaluationResult, changeContext) {
    // This would integrate with GitHub API to create issues
    // For now, we'll create a decision record file
    
    const timestamp = new Date().toISOString().split('T')[0];
    const decisionId = `decision-${component.name}-${timestamp}`;
    
    const decisionRecord = {
      id: decisionId,
      component: component.name,
      repo: component.repo,
      change: {
        from: changeContext.current_version,
        to: changeContext.new_version,
        type: changeContext.type
      },
      evaluation: {
        id: evaluationResult.evaluationId,
        score: evaluationResult.evaluation.results.total_score,
        risk: evaluationResult.evaluation.results.risk_level,
        recommendation: evaluationResult.evaluation.results.recommendation
      },
      status: 'pending_decision',
      created_at: new Date().toISOString(),
      decision_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      decision_made: null,
      decision_rationale: null
    };

    // Ensure decisions directory exists
    if (!fs.existsSync(DECISIONS_DIR)) {
      fs.mkdirSync(DECISIONS_DIR, { recursive: true });
    }

    const decisionPath = path.join(DECISIONS_DIR, `${decisionId}.json`);
    fs.writeFileSync(decisionPath, JSON.stringify(decisionRecord, null, 2));

    console.log(`📋 Decision record created: ${decisionPath}`);
    
    return decisionRecord;
  }

  async notifySlack(message) {
    if (!this.slackWebhook) return;

    try {
      await fetch(this.slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
    } catch (error) {
      console.warn('⚠️  Failed to send Slack notification:', error.message);
    }
  }

  async checkComponent(component) {
    console.log(`🔍 Checking ${component.name} (${component.repo})...`);
    
    let hasChanges = false;
    const changes = [];

    // Check for new releases
    if (component.monitoring_level.includes('releases')) {
      const latestRelease = await this.checkGitHubRelease(component.repo);
      
      if (latestRelease && latestRelease.version !== component.current_version) {
        hasChanges = true;
        changes.push({
          type: 'release',
          current_version: component.current_version,
          new_version: latestRelease.version,
          details: `New release: ${latestRelease.name}\n\n${latestRelease.body}`,
          url: latestRelease.html_url
        });
      }
    }

    // Check for security advisories
    if (component.monitoring_level.includes('security')) {
      const advisories = await this.checkSecurityAdvisories(component.repo);
      
      if (advisories.length > 0) {
        hasChanges = true;
        changes.push({
          type: 'security',
          current_version: component.current_version,
          new_version: component.current_version, // Security might not change version
          details: `Security advisories found:\n${advisories.map(a => `- ${a.summary}`).join('\n')}`,
          advisories: advisories
        });
      }
    }

    return { hasChanges, changes };
  }

  async processChanges(component, changes) {
    for (const change of changes) {
      console.log(`🚨 Change detected in ${component.name}: ${change.type}`);
      
      // Generate universal evaluation
      const evaluationResult = await this.generateUniversalEvaluation(component, {
        component_name: component.name,
        current_version: change.current_version,
        new_version: change.new_version,
        type: change.type,
        details: change.details
      });

      if (evaluationResult) {
        // Create decision record
        const decisionRecord = await this.createDecisionIssue(component, evaluationResult, {
          component_name: component.name,
          current_version: change.current_version,
          new_version: change.new_version,
          type: change.type
        });

        // Send notifications
        const message = `🔄 *${component.name}* update available: ${change.current_version} → ${change.new_version}\n` +
                       `📊 Score: ${evaluationResult.evaluation.results.total_score}/10 | Risk: ${evaluationResult.evaluation.results.risk_level}\n` +
                       `🎯 Recommendation: ${evaluationResult.evaluation.results.recommendation}\n` +
                       `⏰ Decision required by: ${decisionRecord.decision_deadline}`;

        await this.notifySlack(message);
        
        console.log(`✅ Evaluation completed: ${evaluationResult.evaluationId}`);
        console.log(`📋 Decision required: ${decisionRecord.id}`);
      }
    }
  }

  async updateComponentStatus(component, lastCheck) {
    // Update the monitored components file
    const componentIndex = this.components.components.findIndex(c => c.name === component.name);
    if (componentIndex >= 0) {
      this.components.components[componentIndex].last_check = lastCheck;
      fs.writeFileSync(MONITORED_COMPONENTS_FILE, JSON.stringify(this.components, null, 2));
    }
  }

  async run() {
    console.log('🔍 Starting Third-Party Monitoring Check...');
    console.log(`📋 Monitoring ${this.components.components.length} components`);

    for (const component of this.components.components) {
      if (component.status !== 'active') {
        console.log(`⏭️  Skipping ${component.name} (status: ${component.status})`);
        continue;
      }

      try {
        const { hasChanges, changes } = await this.checkComponent(component);
        
        if (hasChanges) {
          await this.processChanges(component, changes);
        } else {
          console.log(`✅ No changes detected for ${component.name}`);
        }

        await this.updateComponentStatus(component, new Date().toISOString());
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${component.name}:`, error.message);
      }
    }

    console.log('🏁 Third-Party Monitoring Check completed');
  }
}

// CLI Execution
if (require.main === module) {
  const monitor = new ThirdPartyMonitor();
  monitor.run().catch(error => {
    console.error('💥 Monitoring failed:', error.message);
    process.exit(1);
  });
}

module.exports = ThirdPartyMonitor;
