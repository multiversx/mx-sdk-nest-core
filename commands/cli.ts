#!/usr/bin/env node

import { program } from 'commander';
import { GenerateSchemaCommand } from './schema/generate';
import { ExpandSchemaCommand } from './schema/expand';
import { TypesSchemaCommand } from './schema/types';

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

program.parse(process.argv);
