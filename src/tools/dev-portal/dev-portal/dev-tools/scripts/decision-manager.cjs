#!/usr/bin/env node
/**
 * 📋 DECISION MANAGER
 * 
 * Herramienta para gestionar decisiones de componentes de terceros
 * Permite aceptar, rechazar o diferir actualizaciones
 * 
 * Usage: node scripts/decision-manager.js [command] [options]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DECISIONS_DIR = path.join(__dirname, '../docs/PROJECT/02_ARCHITECTURE/THIRD_PARTY_DECISIONS');
const EVALUATIONS_DIR = path.join(__dirname, '../docs/PROJECT/02_ARCHITECTURE/UNIVERSAL_EVALUATIONS');
const HISTORY_DIR = path.join(__dirname, '../docs/PROJECT/02_ARCHITECTURE/DECISION_HISTORY');

class DecisionManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    const command = process.argv[2];
    
    switch (command) {
      case 'list':
        await this.listPendingDecisions();
        break;
      case 'review':
        await this.reviewDecision(process.argv[3]);
        break;
      case 'accept':
        await this.makeDecision(process.argv[3], 'accept', process.argv[4]);
        break;
      case 'reject':
        await this.makeDecision(process.argv[3], 'reject', process.argv[4]);
        break;
      case 'defer':
        await this.makeDecision(process.argv[3], 'defer', process.argv[4]);
        break;
      case 'overdue':
        await this.listOverdueDecisions();
        break;
      case 'interactive':
        await this.interactiveMode();
        break;
      default:
        this.showHelp();
    }
    
    this.rl.close();
  }

  showHelp() {
    console.log(`
📋 DECISION MANAGER - Third-Party Component Updates

COMMANDS:
  list                    List all pending decisions
  review <decision-id>    Review a specific decision in detail
  accept <decision-id> <reason>   Accept an update
  reject <decision-id> <reason>   Reject an update  
  defer <decision-id> <reason>    Defer an update
  overdue                 List overdue decisions
  interactive             Interactive decision-making mode

EXAMPLES:
  node scripts/decision-manager.js list
  node scripts/decision-manager.js review decision-postiz-2025-01-29
  node scripts/decision-manager.js accept decision-postiz-2025-01-29 "Security update approved"
  node scripts/decision-manager.js interactive
    `);
  }

  async listPendingDecisions() {
    if (!fs.existsSync(DECISIONS_DIR)) {
      console.log('📭 No pending decisions found.');
      return;
    }

    const files = fs.readdirSync(DECISIONS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const filePath = path.join(DECISIONS_DIR, f);
        const decision = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return decision;
      })
      .filter(d => d.status === 'pending_decision')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (files.length === 0) {
      console.log('📭 No pending decisions found.');
      return;
    }

    console.log(`\n📋 PENDING DECISIONS (${files.length})\n`);
    console.log('| Decision ID | Component | Change | Risk | Score | Deadline |');
    console.log('|-------------|-----------|--------|------|-------|----------|');

    files.forEach(decision => {
      const deadline = new Date(decision.decision_deadline);
      const isOverdue = deadline < new Date();
      const deadlineStr = deadline.toLocaleDateString();
      const overdueMarker = isOverdue ? ' ⚠️' : '';
      
      console.log(`| ${decision.id} | ${decision.component} | ${decision.change.from} → ${decision.change.to} | ${decision.evaluation.risk} | ${decision.evaluation.score}/10 | ${deadlineStr}${overdueMarker} |`);
    });

    console.log('\n💡 Use "review <decision-id>" to see details');
  }

  async reviewDecision(decisionId) {
    if (!decisionId) {
      console.log('❌ Please provide a decision ID');
      return;
    }

    const decisionPath = path.join(DECISIONS_DIR, `${decisionId}.json`);
    
    if (!fs.existsSync(decisionPath)) {
      console.log(`❌ Decision not found: ${decisionId}`);
      return;
    }

    const decision = JSON.parse(fs.readFileSync(decisionPath, 'utf8'));
    
    console.log(`\n🔍 DECISION REVIEW: ${decision.id}\n`);
    console.log(`**Component**: ${decision.component} (${decision.repo})`);
    console.log(`**Change**: ${decision.change.from} → ${decision.change.to}`);
    console.log(`**Type**: ${decision.change.type}`);
    console.log(`**Status**: ${decision.status}`);
    console.log(`**Created**: ${new Date(decision.created_at).toLocaleString()}`);
    console.log(`**Deadline**: ${new Date(decision.decision_deadline).toLocaleString()}`);
    
    const isOverdue = new Date(decision.decision_deadline) < new Date();
    if (isOverdue) {
      console.log('⚠️  **This decision is OVERDUE**');
    }

    console.log(`\n📊 **EVALUATION SUMMARY**:`);
    console.log(`- **Overall Score**: ${decision.evaluation.score}/10`);
    console.log(`- **Risk Level**: ${decision.evaluation.risk}`);
    console.log(`- **Recommendation**: ${decision.evaluation.recommendation}`);

    // Try to load full evaluation if available
    const evalPath = path.join(EVALUATIONS_DIR, `${decision.evaluation.id}.md`);
    if (fs.existsSync(evalPath)) {
      console.log(`\n📄 **Full evaluation available**: ${evalPath}`);
    }

    console.log(`\n⚡ **AVAILABLE ACTIONS**:`);
    console.log(`- accept ${decisionId} "reason" - Accept the update`);
    console.log(`- reject ${decisionId} "reason" - Reject the update`);
    console.log(`- defer ${decisionId} "reason" - Defer to later`);
  }

  async makeDecision(decisionId, action, reason) {
    if (!decisionId) {
      console.log('❌ Please provide a decision ID');
      return;
    }

    if (!reason) {
      console.log('❌ Please provide a reason for the decision');
      return;
    }

    const decisionPath = path.join(DECISIONS_DIR, `${decisionId}.json`);
    
    if (!fs.existsSync(decisionPath)) {
      console.log(`❌ Decision not found: ${decisionId}`);
      return;
    }

    const decision = JSON.parse(fs.readFileSync(decisionPath, 'utf8'));
    
    if (decision.status !== 'pending_decision') {
      console.log(`❌ Decision ${decisionId} already resolved: ${decision.status}`);
      return;
    }

    // Update decision record
    decision.status = `decided_${action}`;
    decision.decision_made = new Date().toISOString();
    decision.decision_rationale = reason;
    decision.decided_by = process.env.USER || 'unknown';

    // Save updated decision
    fs.writeFileSync(decisionPath, JSON.stringify(decision, null, 2));

    // Archive to history
    await this.archiveDecision(decision);

    // Execute action
    switch (action) {
      case 'accept':
        await this.executeAcceptance(decision);
        break;
      case 'reject':
        await this.executeRejection(decision);
        break;
      case 'defer':
        await this.executeDefer(decision);
        break;
    }

    console.log(`✅ Decision ${action.toUpperCase()}: ${decisionId}`);
    console.log(`📝 Reason: ${reason}`);
  }

  async archiveDecision(decision) {
    // Ensure history directory exists
    if (!fs.existsSync(HISTORY_DIR)) {
      fs.mkdirSync(HISTORY_DIR, { recursive: true });
    }

    const historyPath = path.join(HISTORY_DIR, `${decision.id}.json`);
    fs.writeFileSync(historyPath, JSON.stringify(decision, null, 2));
    
    console.log(`📁 Decision archived to: ${historyPath}`);
  }

  async executeAcceptance(decision) {
    console.log(`🚀 Executing acceptance for ${decision.component}...`);
    
    // Create implementation checklist
    const checklistPath = path.join(DECISIONS_DIR, `${decision.id}-implementation.md`);
    const checklist = `# 🚀 IMPLEMENTATION CHECKLIST: ${decision.component}

**Decision**: ${decision.id}  
**Component**: ${decision.component}  
**Update**: ${decision.change.from} → ${decision.change.to}  
**Decided**: ${new Date(decision.decision_made).toLocaleString()}  

## 📋 Implementation Steps

- [ ] Create feature branch for update
- [ ] Update dependencies in package.json
- [ ] Run automated test suite
- [ ] Update documentation if needed
- [ ] Deploy to staging environment
- [ ] Conduct smoke testing
- [ ] Deploy to production
- [ ] Monitor for 24-48 hours
- [ ] Close this implementation ticket

## 🔗 Related Documents

- Evaluation Report: docs/PROJECT/02_ARCHITECTURE/UNIVERSAL_EVALUATIONS/${decision.evaluation.id}.md
- Decision Record: docs/PROJECT/02_ARCHITECTURE/DECISION_HISTORY/${decision.id}.json

## 📝 Notes

${decision.decision_rationale}
`;

    fs.writeFileSync(checklistPath, checklist);
    console.log(`📋 Implementation checklist created: ${checklistPath}`);
  }

  async executeRejection(decision) {
    console.log(`❌ Recording rejection for ${decision.component}...`);
    
    // Update monitoring config to mark as ignored for this version
    const configPath = path.join(__dirname, '../config/monitored-components.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const component = config.components.find(c => c.name === decision.component);
      
      if (component) {
        component.ignored_versions = component.ignored_versions || [];
        if (!component.ignored_versions.includes(decision.change.to)) {
          component.ignored_versions.push(decision.change.to);
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          console.log(`🚫 Version ${decision.change.to} marked as ignored for ${decision.component}`);
        }
      }
    }
  }

  async executeDefer(decision) {
    console.log(`⏸️  Deferring decision for ${decision.component}...`);
    
    // Create reminder for future evaluation
    const reminderPath = path.join(DECISIONS_DIR, `${decision.id}-reminder.md`);
    const reminder = `# ⏰ DEFERRED DECISION REMINDER: ${decision.component}

**Original Decision**: ${decision.id}  
**Component**: ${decision.component}  
**Update**: ${decision.change.from} → ${decision.change.to}  
**Deferred**: ${new Date(decision.decision_made).toLocaleString()}  

## 📝 Defer Reason

${decision.decision_rationale}

## 🔄 Next Steps

- [ ] Schedule re-evaluation for next quarter
- [ ] Review if requirements have changed
- [ ] Check for newer versions available
- [ ] Make final decision

## 🔗 Related Documents

- Original Evaluation: docs/PROJECT/02_ARCHITECTURE/UNIVERSAL_EVALUATIONS/${decision.evaluation.id}.md
- Decision History: docs/PROJECT/02_ARCHITECTURE/DECISION_HISTORY/${decision.id}.json
`;

    fs.writeFileSync(reminderPath, reminder);
    console.log(`⏰ Defer reminder created: ${reminderPath}`);
  }

  async listOverdueDecisions() {
    if (!fs.existsSync(DECISIONS_DIR)) {
      console.log('📭 No decisions found.');
      return;
    }

    const files = fs.readdirSync(DECISIONS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const filePath = path.join(DECISIONS_DIR, f);
        const decision = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return decision;
      })
      .filter(d => d.status === 'pending_decision' && new Date(d.decision_deadline) < new Date())
      .sort((a, b) => new Date(a.decision_deadline) - new Date(b.decision_deadline));

    if (files.length === 0) {
      console.log('✅ No overdue decisions found.');
      return;
    }

    console.log(`\n⚠️  OVERDUE DECISIONS (${files.length})\n`);
    files.forEach(decision => {
      const overdueDays = Math.ceil((new Date() - new Date(decision.decision_deadline)) / (1000 * 60 * 60 * 24));
      console.log(`🚨 ${decision.id}`);
      console.log(`   Component: ${decision.component}`);
      console.log(`   Change: ${decision.change.from} → ${decision.change.to}`);
      console.log(`   Overdue by: ${overdueDays} days`);
      console.log(`   Risk: ${decision.evaluation.risk} | Score: ${decision.evaluation.score}/10`);
      console.log('');
    });
  }

  async interactiveMode() {
    console.log('\n🎮 INTERACTIVE DECISION MODE\n');
    
    while (true) {
      await this.listPendingDecisions();
      
      const choice = await this.askQuestion('\n📋 Enter decision ID to review (or "quit" to exit): ');
      
      if (choice.toLowerCase() === 'quit') {
        break;
      }
      
      await this.reviewDecision(choice);
      
      const action = await this.askQuestion('\n⚡ Action (accept/reject/defer/skip): ');
      
      if (action === 'skip') {
        continue;
      }
      
      if (!['accept', 'reject', 'defer'].includes(action)) {
        console.log('❌ Invalid action. Please use accept, reject, or defer.');
        continue;
      }
      
      const reason = await this.askQuestion('📝 Enter reason for decision: ');
      
      if (reason.trim()) {
        await this.makeDecision(choice, action, reason);
      } else {
        console.log('❌ Reason is required.');
      }
    }
  }

  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// CLI Execution
if (require.main === module) {
  const manager = new DecisionManager();
  manager.run().catch(error => {
    console.error('💥 Decision manager failed:', error.message);
    process.exit(1);
  });
}

module.exports = DecisionManager;
