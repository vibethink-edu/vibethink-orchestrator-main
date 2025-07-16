#!/usr/bin/env node
/**
 * UNIVERSAL EVALUATION TREASURE - INTERACTIVE DEMO
 * 
 * This script demonstrates how to apply the Universal Evaluation Framework
 * to different types of strategic and technical decisions.
 * 
 * Usage: node scripts/universal-evaluation-demo.cjs
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Universal Evaluation Framework Configuration
const EVALUATION_DIMENSIONS = {
  technical: {
    weight: 0.25,
    criteria: ['compatibility', 'performance', 'scalability', 'maintainability', 'security']
  },
  strategic: {
    weight: 0.25, 
    criteria: ['vision_alignment', 'competitive_advantage', 'market_positioning', 'innovation_potential', 'ecosystem_benefits']
  },
  operational: {
    weight: 0.20,
    criteria: ['implementation_complexity', 'resource_requirements', 'timeline_impact', 'team_expertise', 'support_availability']
  },
  risk: {
    weight: 0.20,
    criteria: ['technical_risk', 'business_risk', 'security_risk', 'compliance_risk', 'vendor_lock_risk']
  },
  financial: {
    weight: 0.10,
    criteria: ['initial_cost', 'ongoing_cost', 'roi_potential', 'cost_of_delay', 'opportunity_cost']
  }
};

const DECISION_PROFILES = {
  technology: {
    name: "Technology Selection",
    description: "Evaluating frameworks, libraries, or platforms",
    weights: { technical: 0.35, operational: 0.25, risk: 0.25, strategic: 0.10, financial: 0.05 },
    example: "Choosing between React, Vue, or Angular for new project"
  },
  business: {
    name: "Business Partnership",
    description: "Evaluating strategic partnerships or acquisitions",
    weights: { strategic: 0.40, financial: 0.25, risk: 0.20, operational: 0.15, technical: 0.00 },
    example: "Deciding whether to partner with or compete against startup"
  },
  feature: {
    name: "Feature Prioritization", 
    description: "Deciding which features to build next",
    weights: { strategic: 0.30, technical: 0.25, financial: 0.20, operational: 0.15, risk: 0.10 },
    example: "Should we build AI chat, advanced analytics, or mobile app?"
  },
  architecture: {
    name: "Architecture Decision",
    description: "Major architectural or infrastructure changes",
    weights: { technical: 0.30, risk: 0.25, operational: 0.20, financial: 0.15, strategic: 0.10 },
    example: "Microservices vs monolith, cloud provider selection"
  },
  hiring: {
    name: "Hiring Decision",
    description: "Team expansion and role prioritization",
    weights: { strategic: 0.35, operational: 0.25, financial: 0.20, risk: 0.15, technical: 0.05 },
    example: "Hire senior developer vs product manager vs designer"
  }
};

const STANDARD_SCENARIOS = [
  {
    id: 'full_adoption',
    name: 'Full Adoption',
    description: 'Complete implementation/integration',
    effort_range: ['high', 'very_high'],
    risk_level: 'medium'
  },
  {
    id: 'hybrid_approach', 
    name: 'Hybrid Approach',
    description: 'Selective integration with custom bridges',
    effort_range: ['medium', 'high'],
    risk_level: 'low'
  },
  {
    id: 'inspiration_only',
    name: 'Inspiration Only', 
    description: 'Learn patterns, build custom solution',
    effort_range: ['medium', 'high'],
    risk_level: 'low'
  },
  {
    id: 'phased_rollout',
    name: 'Phased Rollout',
    description: 'Gradual implementation with validation gates',
    effort_range: ['medium', 'high'], 
    risk_level: 'very_low'
  },
  {
    id: 'custom_alternative',
    name: 'Custom Alternative',
    description: 'Build similar capability from scratch',
    effort_range: ['high', 'very_high'],
    risk_level: 'medium'
  }
];

const EFFORT_SCALES = {
  very_low: { days: '1-5', description: '1-5 person-days' },
  low: { days: '5-10', description: '1-2 person-weeks' },
  medium: { days: '10-20', description: '1-4 person-weeks' },
  high: { days: '20-60', description: '1-3 person-months' },
  very_high: { days: '60+', description: '3+ person-months' }
};

// Utility Functions
function generateUUID() {
  return 'eval-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function calculateWeightedScore(dimensionalScores, weights) {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [dimension, score] of Object.entries(dimensionalScores)) {
    if (weights[dimension] !== undefined) {
      totalScore += score * weights[dimension];
      totalWeight += weights[dimension];
    }
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

function getScoreColor(score) {
  if (score >= 8) return '\x1b[32m'; // Green
  if (score >= 6) return '\x1b[33m'; // Yellow  
  return '\x1b[31m'; // Red
}

function getRecommendation(totalScore, confidence, riskLevel) {
  const reset = '\x1b[0m';
  
  if (totalScore >= 7.5 && confidence >= 80 && ['low', 'very_low'].includes(riskLevel)) {
    return `\x1b[32m✅ STRONGLY RECOMMENDED${reset}`;
  } else if (totalScore >= 6.5 && confidence >= 70) {
    return `\x1b[33m🟡 RECOMMENDED WITH CAUTION${reset}`;
  } else if (totalScore >= 5.5) {
    return `\x1b[33m🔄 NEEDS MORE INVESTIGATION${reset}`;
  } else {
    return `\x1b[31m❌ NOT RECOMMENDED${reset}`;
  }
}

// Interactive Functions
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

async function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function selectDecisionType(rl) {
  console.log('\n🎯 UNIVERSAL EVALUATION TREASURE - INTERACTIVE DEMO\n');
  console.log('Available Decision Profiles:');
  
  const profiles = Object.entries(DECISION_PROFILES);
  profiles.forEach(([key, profile], index) => {
    console.log(`${index + 1}. ${profile.name} - ${profile.description}`);
    console.log(`   Example: ${profile.example}\n`);
  });
  
  const choice = await askQuestion(rl, 'Select decision type (1-5): ');
  const index = parseInt(choice) - 1;
  
  if (index >= 0 && index < profiles.length) {
    return profiles[index];
  }
  
  throw new Error('Invalid selection');
}

async function gatherDecisionContext(rl, decisionType) {
  console.log(`\n📋 GATHERING CONTEXT FOR: ${decisionType.name.toUpperCase()}\n`);
  
  const context = {
    decision_name: await askQuestion(rl, 'What are you evaluating? '),
    problem_statement: await askQuestion(rl, 'What problem does this solve? '),
    timeline: await askQuestion(rl, 'What\'s your timeline? (e.g., 3 months, Q2 2025) '),
    stakeholders: await askQuestion(rl, 'Who are the key stakeholders? '),
    constraints: await askQuestion(rl, 'Any major constraints? (budget, tech, regulatory) ')
  };
  
  return context;
}

async function scoreDimensions(rl, weights) {
  console.log('\n📊 SCORING DIMENSIONS (Scale 1-10, where 10 = perfect)\n');
  
  const scores = {};
  const activeDimensions = Object.entries(weights).filter(([_, weight]) => weight > 0);
  
  for (const [dimension, weight] of activeDimensions) {
    console.log(`\n${dimension.toUpperCase()} (Weight: ${(weight * 100).toFixed(0)}%)`);
    console.log(`Criteria: ${EVALUATION_DIMENSIONS[dimension].criteria.join(', ')}`);
    
    const score = await askQuestion(rl, `Score for ${dimension} (1-10): `);
    scores[dimension] = Math.max(1, Math.min(10, parseFloat(score) || 5));
  }
  
  return scores;
}

async function selectScenarios(rl) {
  console.log('\n🎭 SELECT SCENARIOS TO EVALUATE\n');
  
  STANDARD_SCENARIOS.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name}: ${scenario.description}`);
    console.log(`   Effort: ${scenario.effort_range.join(' to ')}, Risk: ${scenario.risk_level}\n`);
  });
  
  const selection = await askQuestion(rl, 'Which scenarios to evaluate? (e.g., 1,2,4 or "all"): ');
  
  if (selection.toLowerCase() === 'all') {
    return STANDARD_SCENARIOS;
  }
  
  const indices = selection.split(',').map(s => parseInt(s.trim()) - 1);
  return indices.filter(i => i >= 0 && i < STANDARD_SCENARIOS.length)
                .map(i => STANDARD_SCENARIOS[i]);
}

function generateEvaluation(context, decisionType, scores, scenarios) {
  const evaluation = {
    evaluation_id: generateUUID(),
    timestamp: new Date().toISOString(),
    decision_type: decisionType.name,
    context: context,
    weights: decisionType.weights,
    dimensional_scores: scores,
    total_score: calculateWeightedScore(scores, decisionType.weights),
    scenarios: scenarios.map(scenario => ({
      ...scenario,
      score: calculateWeightedScore(scores, decisionType.weights) * (0.9 + Math.random() * 0.2), // Add some variance
      confidence: 70 + Math.random() * 25
    })),
    confidence_level: 75 + Math.random() * 20,
    risk_assessment: 'medium', // Simplified for demo
    timestamp: new Date().toISOString()
  };
  
  return evaluation;
}

function displayResults(evaluation) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const underline = '\x1b[4m';
  
  console.log(`\n${bold}${underline}🏆 EVALUATION RESULTS${reset}\n`);
  
  // Context Summary
  console.log(`${bold}📋 DECISION CONTEXT${reset}`);
  console.log(`Decision: ${evaluation.context.decision_name}`);
  console.log(`Problem: ${evaluation.context.problem_statement}`);
  console.log(`Timeline: ${evaluation.context.timeline}`);
  console.log(`Stakeholders: ${evaluation.context.stakeholders}\n`);
  
  // Dimensional Scores
  console.log(`${bold}📊 DIMENSIONAL SCORES${reset}`);
  for (const [dimension, score] of Object.entries(evaluation.dimensional_scores)) {
    const weight = evaluation.weights[dimension] * 100;
    const color = getScoreColor(score);
    console.log(`${dimension.toUpperCase().padEnd(12)} ${color}${score.toFixed(1)}/10${reset} (${weight.toFixed(0)}% weight)`);
  }
  
  // Total Score
  const totalColor = getScoreColor(evaluation.total_score);
  console.log(`\n${bold}TOTAL SCORE: ${totalColor}${evaluation.total_score.toFixed(1)}/10${reset}`);
  console.log(`CONFIDENCE: ${evaluation.confidence_level.toFixed(0)}%\n`);
  
  // Scenarios
  console.log(`${bold}🎭 SCENARIO ANALYSIS${reset}`);
  evaluation.scenarios.forEach(scenario => {
    const scoreColor = getScoreColor(scenario.score);
    console.log(`\n${scenario.name}:`);
    console.log(`  Score: ${scoreColor}${scenario.score.toFixed(1)}/10${reset}`);
    console.log(`  Effort: ${scenario.effort_range.join(' to ')}`);
    console.log(`  Risk: ${scenario.risk_level}`);
    console.log(`  Confidence: ${scenario.confidence.toFixed(0)}%`);
  });
  
  // Recommendation
  const recommendation = getRecommendation(evaluation.total_score, evaluation.confidence_level, evaluation.risk_assessment);
  console.log(`\n${bold}🎯 RECOMMENDATION${reset}`);
  console.log(recommendation);
  
  return evaluation;
}

function saveEvaluation(evaluation) {
  const reportsDir = 'docs/PROJECT/02_ARCHITECTURE/UNIVERSAL_EVALUATIONS';
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Save JSON report
  const jsonPath = path.join(reportsDir, `${evaluation.evaluation_id}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(evaluation, null, 2));
  
  // Save Markdown summary
  const mdPath = path.join(reportsDir, `${evaluation.evaluation_id}_summary.md`);
  const mdContent = generateMarkdownSummary(evaluation);
  fs.writeFileSync(mdPath, mdContent);
  
  console.log(`\n💾 EVALUATION SAVED:`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`Markdown: ${mdPath}`);
}

function generateMarkdownSummary(evaluation) {
  return `# Evaluation Summary: ${evaluation.context.decision_name}

**Evaluation ID**: ${evaluation.evaluation_id}  
**Date**: ${new Date(evaluation.timestamp).toLocaleDateString()}  
**Decision Type**: ${evaluation.decision_type}  

## Context
- **Problem**: ${evaluation.context.problem_statement}
- **Timeline**: ${evaluation.context.timeline}
- **Stakeholders**: ${evaluation.context.stakeholders}
- **Constraints**: ${evaluation.context.constraints}

## Results
- **Total Score**: ${evaluation.total_score.toFixed(1)}/10
- **Confidence**: ${evaluation.confidence_level.toFixed(0)}%
- **Risk Level**: ${evaluation.risk_assessment}

## Dimensional Scores
${Object.entries(evaluation.dimensional_scores).map(([dim, score]) => 
  `- **${dim.toUpperCase()}**: ${score.toFixed(1)}/10 (${(evaluation.weights[dim] * 100).toFixed(0)}% weight)`
).join('\n')}

## Scenario Analysis
${evaluation.scenarios.map(scenario => `
### ${scenario.name}
- **Score**: ${scenario.score.toFixed(1)}/10
- **Effort**: ${scenario.effort_range.join(' to ')}
- **Risk**: ${scenario.risk_level}
- **Confidence**: ${scenario.confidence.toFixed(0)}%
`).join('\n')}

## Recommendation
${getRecommendation(evaluation.total_score, evaluation.confidence_level, evaluation.risk_assessment).replace(/\x1b\[[0-9;]*m/g, '')}

---
*Generated by Universal Evaluation Treasure Framework*
`;
}

// Main Demo Function
async function runDemo() {
  const rl = createInterface();
  
  try {
    console.log('🏆 Welcome to the Universal Evaluation Treasure Demo!');
    console.log('This framework can be applied to ANY strategic or technical decision.\n');
    
    // Step 1: Select decision type
    const [decisionKey, decisionType] = await selectDecisionType(rl);
    
    // Step 2: Gather context
    const context = await gatherDecisionContext(rl, decisionType);
    
    // Step 3: Score dimensions
    const scores = await scoreDimensions(rl, decisionType.weights);
    
    // Step 4: Select scenarios
    const scenarios = await selectScenarios(rl);
    
    // Step 5: Generate evaluation
    const evaluation = generateEvaluation(context, decisionType, scores, scenarios);
    
    // Step 6: Display results
    displayResults(evaluation);
    
    // Step 7: Save evaluation
    const save = await askQuestion(rl, '\n💾 Save this evaluation? (y/n): ');
    if (save.toLowerCase() === 'y' || save.toLowerCase() === 'yes') {
      saveEvaluation(evaluation);
    }
    
    console.log('\n🎉 Demo completed! The Universal Evaluation Treasure can be applied to:');
    console.log('- Technology selection (frameworks, libraries, platforms)');
    console.log('- Business decisions (partnerships, acquisitions, strategies)');
    console.log('- Feature prioritization (what to build next)');
    console.log('- Architecture decisions (microservices, cloud, databases)');
    console.log('- Hiring decisions (roles, priorities, team expansion)');
    console.log('- ANY strategic decision your organization faces!');
    
    console.log('\n📚 Learn more in docs/XTP_METHODOLOGY/01_UNIVERSAL/');
    
  } catch (error) {
    console.error('\n❌ Demo error:', error.message);
  } finally {
    rl.close();
  }
}

// Quick Demo Function (non-interactive)
function runQuickDemo() {
  console.log('🏆 UNIVERSAL EVALUATION TREASURE - QUICK DEMO\n');
  
  const mockEvaluation = {
    evaluation_id: generateUUID(),
    timestamp: new Date().toISOString(),
    decision_type: 'Technology Selection',
    context: {
      decision_name: 'Next.js vs React + Vite for new dashboard',
      problem_statement: 'Need fast, modern frontend for AI pair orchestrator dashboard',
      timeline: '6 weeks for MVP',
      stakeholders: 'Development team, product manager, end users',
      constraints: 'Team familiar with React, need SSR, performance critical'
    },
    weights: { technical: 0.35, operational: 0.25, risk: 0.25, strategic: 0.10, financial: 0.05 },
    dimensional_scores: {
      technical: 8.5,
      operational: 7.0,
      risk: 8.0,
      strategic: 6.5,
      financial: 9.0
    },
    total_score: 7.8,
    scenarios: [
      { name: 'Next.js Full Adoption', score: 8.2, effort_range: ['medium', 'high'], risk_level: 'low', confidence: 85 },
      { name: 'React + Vite Hybrid', score: 7.5, effort_range: ['medium', 'medium'], risk_level: 'very_low', confidence: 90 },
      { name: 'Gradual Migration', score: 7.0, effort_range: ['high', 'high'], risk_level: 'very_low', confidence: 95 }
    ],
    confidence_level: 85,
    risk_assessment: 'low'
  };
  
  displayResults(mockEvaluation);
  
  console.log('\n📖 This was a quick demo with mock data.');
  console.log('Run "node scripts/universal-evaluation-demo.cjs interactive" for full interactive experience.');
}

// Entry Point
if (require.main === module) {
  const mode = process.argv[2];
  
  if (mode === 'interactive') {
    runDemo();
  } else {
    runQuickDemo();
  }
}

module.exports = {
  EVALUATION_DIMENSIONS,
  DECISION_PROFILES,
  STANDARD_SCENARIOS,
  calculateWeightedScore,
  generateEvaluation,
  runDemo,
  runQuickDemo
};
