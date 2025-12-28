#!/usr/bin/env node
/**
 * ViTo i18n CLI
 * AI-powered translation management tooling
 */

import { Command } from 'commander';
import { whereCommand } from './commands/where';
import { addCommand } from './commands/add';
import { lintCommand } from './commands/lint';
import { classifyCommand } from './commands/classify';
import { reviewCommand } from './commands/review';

const program = new Command();

program
  .name('vito-i18n')
  .description('ViTo i18n tooling - AI-powered translation management')
  .version('1.0.0');

program.addCommand(whereCommand);
program.addCommand(addCommand);
program.addCommand(lintCommand);
program.addCommand(classifyCommand);
program.addCommand(reviewCommand);

program.parse();
