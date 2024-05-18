#!/usr/bin/env node

import { program } from 'commander';
import { GenerateSchemaCommand } from './schema/generate';
import { ExpandSchemaCommand } from './schema/expand';
import { TypesSchemaCommand } from './schema/types';
import { StartAppsCommand } from './start-apps/start';
import { StopAppsCommand } from './stop-apps/stop';

const schema = program.command('schema')
  .description('Configuration schema operations');

schema
  .command('generate <inputFile> <outputFile>')
  .description('Generate the configuration schema')
  .action((inputFile: string, outputFile: string) => {
    GenerateSchemaCommand.execute(inputFile, outputFile);
  });

schema
  .command('expand <inputFile> <outputFile>')
  .description('Expand the configuration schema')
  .action((inputFile: string, outputFile: string) => {
    ExpandSchemaCommand.execute(inputFile, outputFile);
  });

schema
  .command('types <inputFile> <outputFile>')
  .description('Generate TypeScript types from the configuration schema')
  .action(async (inputFile: string, outputFile: string) => {
    await TypesSchemaCommand.execute(inputFile, outputFile);
  });

program
  .command('start <apps...>')
  .description('Start specified NestJS applications in tmux sessions')
  .action(async (apps: string[]) => {
    await StartAppsCommand.execute(apps);
  });

program
  .command('stop')
  .description('Stop the tmux session running NestJS applications')
  .action(async () => {
    await StopAppsCommand.execute();
  });

program.parse(process.argv);
