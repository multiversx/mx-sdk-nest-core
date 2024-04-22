import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({ name: 'generate-types', description: 'Generate types' })
export class GenerateTypesCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParam: string[],
  ): Promise<void> {
    console.log(`Generating types for ${passedParam}`);
  }
}
