/**
 * CLI Command: review
 * Manage the AI classification review queue
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Table } from 'console-table-printer';
import {
  getReviewQueue,
  getQueueStats,
  resolveReviewItem,
  ReviewQueueItem,
} from '../utils/review-queue';
import { loadRegistry, saveRegistry } from '../utils/registry-loader';
import { addTranslation } from '../utils/translation-loader';
import { generateKeyOptions } from '../utils/key-generator';

export const reviewCommand = new Command('review')
  .description('Manage the AI classification review queue')
  .option('--show', 'Show pending items')
  .option('--stats', 'Show queue statistics')
  .option('--process', 'Interactively process pending items')
  .option('--limit <number>', 'Limit items to show/process', '10')
  .action(async (options) => {
    if (options.stats) {
      await showStats();
      return;
    }

    if (options.show) {
      await showPending(parseInt(options.limit));
      return;
    }

    if (options.process) {
      await processQueue(parseInt(options.limit));
      return;
    }

    // Default: show stats + pending count
    await showStats();
    console.log(chalk.dim('\nRun with --show to see pending items'));
    console.log(chalk.dim('Run with --process to review interactively\n'));
  });

async function showStats() {
  const stats = await getQueueStats();

  console.log(chalk.cyan('\n📊 Review Queue Stats\n'));
  console.log(`  Total:    ${stats.total}`);
  console.log(`  Pending:  ${chalk.yellow(stats.pending.toString())}`);
  console.log(`  Approved: ${chalk.green(stats.approved.toString())}`);
  console.log(`  Rejected: ${chalk.red(stats.rejected.toString())}`);
  console.log(`  Merged:   ${chalk.blue(stats.merged.toString())}`);
  console.log('');
}

async function showPending(limit: number) {
  const items = await getReviewQueue({ status: 'pending', limit });

  if (items.length === 0) {
    console.log(chalk.green('\n✅ No pending items in review queue!\n'));
    return;
  }

  console.log(chalk.cyan(`\n📋 Pending Reviews (${items.length} items)\n`));

  const table = new Table({
    columns: [
      { name: 'id', title: 'ID', alignment: 'left' },
      { name: 'term', title: 'Term', alignment: 'left' },
      { name: 'vertical', title: 'Vertical', alignment: 'left' },
      { name: 'confidence', title: 'Conf.', alignment: 'right' },
      { name: 'timestamp', title: 'Added', alignment: 'left' },
    ],
  });

  for (const item of items) {
    table.addRow({
      id: chalk.dim(item.id.slice(-8)),
      term: chalk.cyan(item.term),
      vertical: item.context.vertical || '-',
      confidence: formatConfidence(item.result.confidence),
      timestamp: new Date(item.timestamp).toLocaleDateString(),
    });
  }

  table.printTable();
  console.log('');
}

async function processQueue(limit: number) {
  const items = await getReviewQueue({ status: 'pending', limit });

  if (items.length === 0) {
    console.log(chalk.green('\n✅ No pending items to process!\n'));
    return;
  }

  console.log(chalk.cyan(`\n🔍 Processing ${items.length} pending items...\n`));

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(
      chalk.bold(`\n[${i + 1}/${items.length}] Term: "${chalk.cyan(item.term)}"`)
    );
    console.log(chalk.dim(`ID: ${item.id}`));
    console.log(chalk.dim(`Context: ${JSON.stringify(item.context)}`));
    console.log(
      chalk.dim(`Confidence: ${Math.round(item.result.confidence * 100)}%`)
    );
    console.log(chalk.dim(`Reason: ${item.result.reason}`));

    if (item.result.matchedCandidates?.length) {
      console.log(chalk.dim('\nTop candidates:'));
      for (const c of item.result.matchedCandidates.slice(0, 3)) {
        console.log(chalk.dim(`  - ${c.key} (${Math.round(c.score * 100)}%)`));
      }
    }

    const resolution = await promptResolution(item);

    if (resolution === null) {
      console.log(chalk.yellow('\n⏭️  Skipping remaining items.\n'));
      break;
    }

    // Apply resolution
    await applyResolution(item, resolution);
  }

  console.log(chalk.green('\n✅ Review session complete!\n'));
}

async function promptResolution(
  item: ReviewQueueItem
): Promise<ReviewQueueItem['resolution'] | null> {
  const choices = [
    { name: '🔄 Use existing key (from candidates)', value: 'use_existing' },
    { name: '➕ Create new key', value: 'create_new' },
    { name: "⏭️  Skip (don't add)", value: 'skip' },
    { name: '🚪 Exit review session', value: 'exit' },
  ];

  // Add candidate keys as quick options
  if (item.result.matchedCandidates?.length) {
    for (const c of item.result.matchedCandidates.slice(0, 3)) {
      if (c.score > 0.5) {
        choices.unshift({
          name: `✅ Use: ${c.key} (${Math.round(c.score * 100)}%)`,
          value: `existing:${c.key}`,
        });
      }
    }
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices,
    },
  ]);

  if (action === 'exit') return null;

  if (action === 'skip') {
    return { action: 'skip', notes: 'Skipped during review' };
  }

  if (action.startsWith('existing:')) {
    const key = action.replace('existing:', '');
    return { action: 'use_existing', key };
  }

  if (action === 'use_existing') {
    const { key } = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Enter the existing key to use:',
        validate: (input) =>
          input.length >= 3 || 'Key must be at least 3 characters',
      },
    ]);
    return { action: 'use_existing', key };
  }

  if (action === 'create_new') {
    const keyOptions = generateKeyOptions(item.term, 'workspace/common');

    const { namespace, selectedKey } = await inquirer.prompt([
      {
        type: 'input',
        name: 'namespace',
        message: 'Namespace (e.g., workspace/pos, concept/domain):',
        default: item.result.namespace || 'transversal/common',
      },
      {
        type: 'list',
        name: 'selectedKey',
        message: 'Select or enter key:',
        choices: [
          ...keyOptions.map((k) => ({ name: k, value: k })),
          ...(item.result.suggestedKeys || []).map((k) => ({
            name: `(AI) ${k}`,
            value: k,
          })),
          { name: 'Enter custom...', value: 'custom' },
        ],
      },
    ]);

    let key = selectedKey;
    if (selectedKey === 'custom') {
      const { customKey } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customKey',
          message: 'Enter custom key:',
        },
      ]);
      key = customKey;
    }

    return { action: 'create_new', key, namespace };
  }

  return null;
}

async function applyResolution(
  item: ReviewQueueItem,
  resolution: NonNullable<ReviewQueueItem['resolution']>
) {
  const reviewer = process.env.USER || 'unknown';

  if (resolution.action === 'skip') {
    await resolveReviewItem(item.id, resolution, reviewer);
    console.log(chalk.yellow('⏭️  Skipped'));
    return;
  }

  if (resolution.action === 'use_existing') {
    await resolveReviewItem(item.id, resolution, reviewer);
    console.log(chalk.green(`✅ Resolved: Use existing key "${resolution.key}"`));
    return;
  }

  if (
    resolution.action === 'create_new' &&
    resolution.key &&
    resolution.namespace
  ) {
    // Add to registry
    const registry = await loadRegistry();

    const layer = resolution.namespace.startsWith('transversal')
      ? 'transversal'
      : resolution.namespace.startsWith('concept')
        ? 'concept'
        : 'workspace';

    registry.terms.push({
      key: resolution.key,
      layer,
      description: `${item.term} (from review queue)`,
      scopes: item.context.vertical ? { vertical: [item.context.vertical] } : undefined,
    } as any);

    await saveRegistry(registry);

    // Add translation
    await addTranslation('en', resolution.namespace, resolution.key, item.term);

    // Mark as resolved
    await resolveReviewItem(item.id, resolution, reviewer);

    console.log(
      chalk.green(`✅ Created: ${resolution.key} in ${resolution.namespace}`)
    );
  }
}

function formatConfidence(confidence: number): string {
  const pct = Math.round(confidence * 100);
  if (pct >= 90) return chalk.green(`${pct}%`);
  if (pct >= 70) return chalk.yellow(`${pct}%`);
  return chalk.red(`${pct}%`);
}
