/**
 * CLI Command: classify
 * AI-powered term classification with constrained retrieval
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { loadRegistry } from '../utils/registry-loader';
import { loadAllTranslations } from '../utils/translation-loader';
import { classifyTerm, TenantContext } from '../../ai/classifier';
import { appendToReviewQueue } from '../utils/review-queue';

export const classifyCommand = new Command('classify')
  .description('AI-powered term classification with constrained retrieval')
  .argument('<term>', 'The term to classify')
  .option('-l, --locale <locale>', 'Locale for context', 'en')
  .option('-v, --vertical <vertical>', 'Vertical scope (e.g., hospitality)')
  .option('-s, --subvertical <subvertical>', 'Sub-vertical scope (e.g., restaurant)')
  .option('-m, --modules <modules>', 'Comma-separated modules (e.g., pos,booking)')
  .option('--threshold <number>', 'Retrieval threshold (0-1)', '0.4')
  .option('--auto-queue', 'Auto-queue needs_review items without prompting')
  .option('--json', 'Output raw JSON')
  .action(async (term, options) => {
    if (!options.json) {
      console.log(chalk.cyan(`\n🤖 AI Classification for: "${term}"\n`));
    }

    const registry = await loadRegistry();
    const translations = await loadAllTranslations(options.locale);

    const context: TenantContext = {
      locale: options.locale,
      vertical: options.vertical,
      subvertical: options.subvertical,
      modules: options.modules?.split(',').map((m: string) => m.trim()),
    };

    try {
      const result = await classifyTerm({
        term,
        context,
        registryTerms: registry.terms,
        translations,
        threshold: parseFloat(options.threshold),
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      // Pretty output
      printClassificationResult(term, result, context);

      // Handle needs_review
      if (result.action === 'needs_review') {
        if (options.autoQueue) {
          await appendToReviewQueue({
            term,
            context,
            result,
            timestamp: new Date().toISOString(),
          });
          console.log(chalk.yellow('\n📋 Added to review queue automatically.\n'));
        } else {
          console.log(chalk.yellow('\n⚠️  This term needs human review.'));
          console.log(chalk.dim('   Run with --auto-queue to add to review queue.'));
          console.log(chalk.dim('   Or: vito-i18n review --show\n'));
        }
      }

      // Actionable next steps
      if (result.action === 'use_existing') {
        console.log(chalk.green(`\n✅ Recommendation: Use existing key`));
        console.log(chalk.dim(`   Key: ${result.key}`));
        console.log(chalk.dim(`   No action needed - key already exists.\n`));
      }

      if (result.action === 'propose_new' && result.suggestedKeys) {
        console.log(chalk.cyan('\n📝 Next step: Add new key'));
        console.log(chalk.dim(`   Run one of:`));
        for (const key of result.suggestedKeys) {
          console.log(
            chalk.dim(
              `   vito-i18n add "${term}" --key=${key} --namespace=${result.namespace}`
            )
          );
        }
        console.log('');
      }
    } catch (error: any) {
      console.error(chalk.red(`\n❌ Classification failed: ${error.message}\n`));
      process.exit(1);
    }
  });

function printClassificationResult(
  term: string,
  result: any,
  context: TenantContext
) {
  // Header
  const actionColors: Record<string, (s: string) => string> = {
    use_existing: chalk.green,
    propose_new: chalk.cyan,
    needs_review: chalk.yellow,
  };
  const actionColor = actionColors[result.action] || chalk.white;

  console.log(chalk.bold('Classification Result:'));
  console.log(`  Action:     ${actionColor(result.action.toUpperCase())}`);
  console.log(`  Confidence: ${formatConfidence(result.confidence)}`);
  console.log(`  Reason:     ${chalk.dim(result.reason)}`);
  console.log('');

  // Context used
  console.log(chalk.bold('Context:'));
  console.log(`  Locale:      ${context.locale}`);
  if (context.vertical) console.log(`  Vertical:    ${context.vertical}`);
  if (context.subvertical) console.log(`  Subvertical: ${context.subvertical}`);
  if (context.modules?.length)
    console.log(`  Modules:     ${context.modules.join(', ')}`);
  console.log('');

  // Action-specific details
  if (result.action === 'use_existing' && result.key) {
    console.log(chalk.bold('Existing Key:'));
    console.log(`  ${chalk.green(result.key)}`);
    console.log('');
  }

  if (result.action === 'propose_new') {
    console.log(chalk.bold('Proposed Placement:'));
    console.log(`  Layer:     ${result.layer}`);
    console.log(`  Namespace: ${result.namespace}`);
    console.log('');

    if (result.suggestedKeys?.length) {
      console.log(chalk.bold('Suggested Keys:'));
      result.suggestedKeys.forEach((key: string, i: number) => {
        console.log(`  ${i + 1}. ${chalk.cyan(key)}`);
      });
      console.log('');
    }
  }

  // Matched candidates table
  if (result.matchedCandidates?.length) {
    console.log(chalk.bold('Top Candidates from Registry:'));
    const table = new Table({
      columns: [
        { name: 'score', title: 'Score', alignment: 'right' },
        { name: 'key', title: 'Key', alignment: 'left' },
      ],
    });

    for (const c of result.matchedCandidates.slice(0, 5)) {
      table.addRow({
        score: formatConfidence(c.score),
        key: c.key,
      });
    }
    table.printTable();
  }
}

function formatConfidence(confidence: number): string {
  const pct = Math.round(confidence * 100);
  if (pct >= 90) return chalk.green(`${pct}%`);
  if (pct >= 70) return chalk.yellow(`${pct}%`);
  return chalk.red(`${pct}%`);
}
