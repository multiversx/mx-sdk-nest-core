import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({ name: 'expand-schema', description: 'Expand a schema' })
export class ExpandSchemaCommand extends CommandRunner {
  constructor() {
    super()
  }

  async run(
    passedParam: string[],
  ): Promise<void> {
    console.log(`Expanding schema for ${passedParam}`);
  }
}
