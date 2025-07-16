#!/usr/bin/env node

/**
 * 💰 GitHub Actions Usage Monitor
 * Monitorea el consumo de tokens/minutos de GitHub Actions
 * y genera alertas cuando se aproxima a los límites.
 * 
 * Usage:
 *   node scripts/monitor-github-usage.js
 *   node scripts/monitor-github-usage.js --alert-threshold=80
 *   node scripts/monitor-github-usage.js --detailed
 */

import { Octokit } from '@octokit/rest';
import chalk from 'chalk';
import { format, parseISO } from 'date-fns';

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'your-org';
const REPO_NAME = process.env.GITHUB_REPOSITORY_NAME || 'ai-pair-orchestrator-pro';
const ALERT_THRESHOLD = process.argv.includes('--alert-threshold') 
  ? parseInt(process.argv.find(arg => arg.startsWith('--alert-threshold=')).split('=')[1])
  : 80; // 80% by default

const DETAILED_MODE = process.argv.includes('--detailed');

// GitHub API client
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * Get GitHub Actions billing information
 */
async function getBillingInfo() {
  try {
    const response = await octokit.rest.billing.getGithubActionsBillingOrg({
      org: REPO_OWNER,
    });
    return response.data;
  } catch (error) {
    console.error(chalk.red('❌ Error fetching billing info:'), error.message);
    return null;
  }
}

/**
 * Get workflow runs for the last 30 days
 */
async function getWorkflowRuns() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const response = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 100,
      created: `>=${thirtyDaysAgo.toISOString()}`,
    });
    
    return response.data.workflow_runs;
  } catch (error) {
    console.error(chalk.red('❌ Error fetching workflow runs:'), error.message);
    return [];
  }
}

/**
 * Calculate estimated costs based on workflow runs
 */
function calculateEstimatedCosts(runs) {
  const costPerLinuxMinute = 0.008; // $0.008 per Linux minute
  const workflows = {};
  let totalMinutes = 0;
  
  runs.forEach(run => {
    const workflowName = run.name;
    const duration = run.run_started_at && run.updated_at 
      ? Math.ceil((new Date(run.updated_at) - new Date(run.run_started_at)) / (1000 * 60))
      : 0;
    
    if (!workflows[workflowName]) {
      workflows[workflowName] = {
        runs: 0,
        totalMinutes: 0,
        avgMinutes: 0,
        estimatedCost: 0,
        lastRun: null,
      };
    }
    
    workflows[workflowName].runs++;
    workflows[workflowName].totalMinutes += duration;
    workflows[workflowName].lastRun = run.updated_at;
    totalMinutes += duration;
  });
  
  // Calculate averages and costs
  Object.keys(workflows).forEach(name => {
    const workflow = workflows[name];
    workflow.avgMinutes = Math.round(workflow.totalMinutes / workflow.runs);
    workflow.estimatedCost = workflow.totalMinutes * costPerLinuxMinute;
  });
  
  return {
    workflows,
    totalMinutes,
    totalEstimatedCost: totalMinutes * costPerLinuxMinute,
    totalRuns: runs.length,
  };
}

/**
 * Display billing summary
 */
function displayBillingSummary(billingInfo, estimatedCosts) {
  console.log(chalk.cyan('\n🏦 GitHub Actions Billing Summary'));
  console.log(chalk.cyan('=' .repeat(50)));
  
  if (billingInfo) {
    const includedMinutes = billingInfo.included_minutes || 2000;
    const usedMinutes = billingInfo.total_minutes_used || 0;
    const remainingMinutes = includedMinutes - usedMinutes;
    const usagePercentage = Math.round((usedMinutes / includedMinutes) * 100);
    
    console.log(`📊 Plan Included Minutes: ${chalk.green(includedMinutes.toLocaleString())}`);
    console.log(`⏱️  Used Minutes: ${chalk.yellow(usedMinutes.toLocaleString())}`);
    console.log(`⏳ Remaining Minutes: ${chalk.green(remainingMinutes.toLocaleString())}`);
    console.log(`📈 Usage Percentage: ${usagePercentage >= ALERT_THRESHOLD ? chalk.red(usagePercentage + '%') : chalk.green(usagePercentage + '%')}`);
    
    if (usagePercentage >= ALERT_THRESHOLD) {
      console.log(chalk.red.bold(`\n🚨 ALERT: Usage is at ${usagePercentage}% (threshold: ${ALERT_THRESHOLD}%)`));
    }
    
    // Paid minutes if any
    const paidMinutes = billingInfo.total_paid_minutes_used || 0;
    if (paidMinutes > 0) {
      const paidCost = paidMinutes * 0.008;
      console.log(`💰 Paid Minutes Used: ${chalk.red(paidMinutes.toLocaleString())}`);
      console.log(`💸 Estimated Paid Cost: ${chalk.red('$' + paidCost.toFixed(2))}`);
    }
  }
  
  console.log(chalk.cyan('\n📊 Last 30 Days Analysis (Repository)'));
  console.log(chalk.cyan('=' .repeat(50)));
  console.log(`🔄 Total Workflow Runs: ${chalk.blue(estimatedCosts.totalRuns)}`);
  console.log(`⏱️  Estimated Minutes Used: ${chalk.yellow(estimatedCosts.totalMinutes.toLocaleString())}`);
  console.log(`💰 Estimated Cost: ${chalk.green('$' + estimatedCosts.totalEstimatedCost.toFixed(2))}`);
}

/**
 * Display detailed workflow breakdown
 */
function displayWorkflowBreakdown(workflows) {
  console.log(chalk.cyan('\n🔧 Workflow Breakdown (Last 30 Days)'));
  console.log(chalk.cyan('=' .repeat(70)));
  
  const sortedWorkflows = Object.entries(workflows)
    .sort(([,a], [,b]) => b.totalMinutes - a.totalMinutes);
  
  console.log(chalk.gray('Workflow Name'.padEnd(35) + 'Runs'.padEnd(8) + 'Minutes'.padEnd(10) + 'Avg'.padEnd(8) + 'Cost'));
  console.log(chalk.gray('-'.repeat(70)));
  
  sortedWorkflows.forEach(([name, data]) => {
    const shortName = name.length > 32 ? name.substring(0, 29) + '...' : name;
    const costColor = data.estimatedCost > 5 ? chalk.red : data.estimatedCost > 1 ? chalk.yellow : chalk.green;
    
    console.log(
      chalk.white(shortName.padEnd(35)) +
      chalk.blue(data.runs.toString().padEnd(8)) +
      chalk.yellow(data.totalMinutes.toString().padEnd(10)) +
      chalk.cyan(data.avgMinutes.toString().padEnd(8)) +
      costColor('$' + data.estimatedCost.toFixed(2))
    );
  });
}

/**
 * Generate cost optimization recommendations
 */
function generateRecommendations(workflows, totalMinutes) {
  console.log(chalk.cyan('\n💡 Cost Optimization Recommendations'));
  console.log(chalk.cyan('=' .repeat(50)));
  
  const sortedByTotalCost = Object.entries(workflows)
    .sort(([,a], [,b]) => b.estimatedCost - a.estimatedCost)
    .slice(0, 3);
  
  console.log('🎯 Most Expensive Workflows:');
  sortedByTotalCost.forEach(([name, data], index) => {
    console.log(`   ${index + 1}. ${name}: $${data.estimatedCost.toFixed(2)} (${data.runs} runs)`);
  });
  
  // Generic recommendations
  console.log('\n📋 General Recommendations:');
  
  if (totalMinutes > 3000) {
    console.log('   • Consider upgrading to GitHub Pro/Team for more included minutes');
  }
  
  console.log('   • Use draft PRs for work-in-progress (triggers optimized workflow)');
  console.log('   • Implement aggressive caching for node_modules and dependencies');
  console.log('   • Use conditional jobs (e.g., performance tests only on main branch)');
  console.log('   • Consider parallelizing jobs to reduce total runtime');
  
  const avgMinutesPerRun = Math.round(totalMinutes / Object.values(workflows).reduce((sum, w) => sum + w.runs, 0));
  if (avgMinutesPerRun > 30) {
    console.log('   • Review workflow efficiency - average runtime is high');
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log(chalk.blue.bold('💰 GitHub Actions Usage Monitor'));
  console.log(chalk.gray(`Repository: ${REPO_OWNER}/${REPO_NAME}`));
  console.log(chalk.gray(`Alert Threshold: ${ALERT_THRESHOLD}%`));
  console.log(chalk.gray(`Analysis Period: Last 30 days\n`));
  
  if (!GITHUB_TOKEN) {
    console.error(chalk.red('❌ GITHUB_TOKEN environment variable is required'));
    console.log(chalk.yellow('Please set GITHUB_TOKEN with a personal access token that has repo and billing permissions'));
    process.exit(1);
  }
  
  // Fetch data
  console.log(chalk.gray('🔍 Fetching billing information...'));
  const billingInfo = await getBillingInfo();
  
  console.log(chalk.gray('🔍 Fetching workflow runs...'));
  const workflowRuns = await getWorkflowRuns();
  
  console.log(chalk.gray('📊 Calculating costs...'));
  const estimatedCosts = calculateEstimatedCosts(workflowRuns);
  
  // Display results
  displayBillingSummary(billingInfo, estimatedCosts);
  
  if (DETAILED_MODE || estimatedCosts.totalRuns > 0) {
    displayWorkflowBreakdown(estimatedCosts.workflows);
  }
  
  generateRecommendations(estimatedCosts.workflows, estimatedCosts.totalMinutes);
  
  // Final status
  console.log(chalk.cyan('\n✅ Analysis Complete'));
  console.log(chalk.gray(`Generated at: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`));
  
  // Exit with appropriate code
  if (billingInfo && billingInfo.total_minutes_used) {
    const usagePercentage = Math.round((billingInfo.total_minutes_used / (billingInfo.included_minutes || 2000)) * 100);
    if (usagePercentage >= ALERT_THRESHOLD) {
      console.log(chalk.red.bold('\n🚨 WARNING: High usage detected!'));
      process.exit(1);
    }
  }
}

// Run the monitor
main().catch(error => {
  console.error(chalk.red('❌ Unexpected error:'), error);
  process.exit(1);
});
