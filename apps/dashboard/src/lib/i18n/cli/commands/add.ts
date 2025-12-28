/**
 * CLI Command: add
 * Add a new translation term
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { generateKeyOptions } from '../utils/key-generator';
import { addTranslation } from '../utils/translation-loader';

export const addCommand = new Command('add')
  .description('Add a new translation term')
  .argument('<term>', 'The term/value to add')
  .requiredOption('--key <key>', 'Translation key')
  .requiredOption('--namespace <namespace>', 'Namespace (e.g., workspace/pos)')
  .option('-l, --locale <locale>', 'Locale', 'en')
  .action(async (term, options) => {
    console.log(chalk.cyan('\n➕ Adding new translation...\n'));

    console.log(chalk.dim(`  Locale:    ${options.locale}`));
    console.log(chalk.dim(`  Namespace: ${options.namespace}`));
    console.log(chalk.dim(`  Key:       ${options.key}`));
    console.log(chalk.dim(`  Value:     ${term}`));
    console.log('');

    try {
      await addTranslation(options.locale, options.namespace, options.key, term);
      console.log(chalk.green('✅ Translation added successfully!\n'));
    } catch (error: any) {
      console.error(chalk.red(`❌ Failed to add translation: ${error.message}\n`));
      process.exit(1);
    }
  });
