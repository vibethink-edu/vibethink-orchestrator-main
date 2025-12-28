/**
 * CLI Command: where
 * Fuzzy search to find where a term is defined
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { loadAllTranslations } from '../utils/translation-loader';

export const whereCommand = new Command('where')
  .description('Find where a term is defined')
  .argument('<term>', 'The term to search for')
  .option('-l, --locale <locale>', 'Locale to search', 'en')
  .option('--exact', 'Exact match only')
  .action(async (term, options) => {
    console.log(chalk.cyan(`\n🔍 Searching for: "${term}"\n`));

    const translations = await loadAllTranslations(options.locale);
    const results = searchTranslations(translations, term, options.exact);

    if (results.length === 0) {
      console.log(chalk.yellow('❌ No matches found\n'));
      return;
    }

    console.log(chalk.green(`✅ Found ${results.length} matches:\n`));

    const table = new Table({
      columns: [
        { name: 'namespace', title: 'Namespace', alignment: 'left' },
        { name: 'key', title: 'Key', alignment: 'left' },
        { name: 'value', title: 'Value', alignment: 'left' },
      ],
    });

    for (const result of results.slice(0, 20)) {
      table.addRow({
        namespace: chalk.dim(result.namespace),
        key: chalk.cyan(result.key),
        value: result.value,
      });
    }

    table.printTable();

    if (results.length > 20) {
      console.log(chalk.dim(`\n... and ${results.length - 20} more results\n`));
    }
  });

interface SearchResult {
  namespace: string;
  key: string;
  value: string;
}

function searchTranslations(
  translations: Record<string, any>,
  term: string,
  exactMatch: boolean
): SearchResult[] {
  const results: SearchResult[] = [];
  const termLower = term.toLowerCase();

  for (const [namespace, data] of Object.entries(translations)) {
    const flatData = flattenObject(data, namespace);

    for (const [key, value] of Object.entries(flatData)) {
      if (typeof value !== 'string') continue;

      const valueLower = value.toLowerCase();
      const keyLower = key.toLowerCase();

      if (exactMatch) {
        if (valueLower === termLower || keyLower === termLower) {
          results.push({ namespace, key, value });
        }
      } else {
        if (valueLower.includes(termLower) || keyLower.includes(termLower)) {
          results.push({ namespace, key, value });
        }
      }
    }
  }

  return results;
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
