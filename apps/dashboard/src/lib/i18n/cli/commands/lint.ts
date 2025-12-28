/**
 * CLI Command: lint
 * Detect duplicates, orphans, and other i18n issues
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { loadAllTranslations } from '../utils/translation-loader';

export const lintCommand = new Command('lint')
  .description('Detect duplicates, orphans, and i18n issues')
  .option('-l, --locale <locale>', 'Locale to lint', 'en')
  .option('--fix', 'Auto-fix issues (not implemented)')
  .action(async (options) => {
    console.log(chalk.cyan(`\n🔍 Linting translations for locale: ${options.locale}\n`));

    const translations = await loadAllTranslations(options.locale);

    const duplicates = findDuplicates(translations);
    const missingKeys = findMissingKeys(translations);

    let hasIssues = false;

    // Report duplicates
    if (duplicates.length > 0) {
      hasIssues = true;
      console.log(chalk.yellow(`⚠️  Found ${duplicates.length} duplicate values:\n`));

      const table = new Table({
        columns: [
          { name: 'value', title: 'Value', alignment: 'left' },
          { name: 'keys', title: 'Keys', alignment: 'left' },
        ],
      });

      for (const dup of duplicates.slice(0, 10)) {
        table.addRow({
          value: chalk.yellow(dup.value),
          keys: dup.keys.join(', '),
        });
      }

      table.printTable();
      console.log('');
    }

    // Report missing keys (empty strings)
    if (missingKeys.length > 0) {
      hasIssues = true;
      console.log(chalk.red(`❌ Found ${missingKeys.length} missing values:\n`));

      for (const key of missingKeys.slice(0, 10)) {
        console.log(chalk.dim(`  - ${key}`));
      }
      console.log('');
    }

    if (!hasIssues) {
      console.log(chalk.green('✅ No issues found!\n'));
    } else {
      console.log(chalk.yellow('💡 Run with --fix to auto-fix issues (not implemented)\n'));
    }
  });

interface Duplicate {
  value: string;
  keys: string[];
}

function findDuplicates(translations: Record<string, any>): Duplicate[] {
  const valueMap = new Map<string, string[]>();

  for (const [namespace, data] of Object.entries(translations)) {
    const flatData = flattenObject(data, namespace);

    for (const [key, value] of Object.entries(flatData)) {
      if (typeof value !== 'string') continue;
      if (value.trim() === '') continue;

      const existing = valueMap.get(value) || [];
      existing.push(key);
      valueMap.set(value, existing);
    }
  }

  const duplicates: Duplicate[] = [];
  for (const [value, keys] of valueMap.entries()) {
    if (keys.length > 1) {
      duplicates.push({ value, keys });
    }
  }

  return duplicates;
}

function findMissingKeys(translations: Record<string, any>): string[] {
  const missingKeys: string[] = [];

  for (const [namespace, data] of Object.entries(translations)) {
    const flatData = flattenObject(data, namespace);

    for (const [key, value] of Object.entries(flatData)) {
      if (typeof value === 'string' && value.trim() === '') {
        missingKeys.push(key);
      }
    }
  }

  return missingKeys;
}

function flattenObject(
  obj: Record<string, any>,
  prefix: string = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === '_metadata') continue;

    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (typeof value === 'string') {
      result[newKey] = value;
    }
  }

  return result;
}
