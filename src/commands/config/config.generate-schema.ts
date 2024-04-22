import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({ name: 'generate-schema', description: 'Generate a schema' })
export class GenerateSchemaCommand extends CommandRunner {
  constructor() {
    super()
  }

  async run(
    passedParam: string[],
  ): Promise<void> {
    console.log(`Generating schema for ${passedParam}`);
  }
}
