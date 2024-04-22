import { Command, CommandRunner } from 'nest-commander';
import { ExpandSchemaCommand } from "./config.expand-schema";
import { GenerateSchemaCommand } from "./config.generate-schema";
import { GenerateTypesCommand } from "./config.generate-types";

@Command({
  name: 'config',
  description: 'Common MultiversX Configuration helpers',
  subCommands: [ExpandSchemaCommand, GenerateSchemaCommand, GenerateTypesCommand],
})
export class ConfigCommandGroup extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParam: string[],
  ): Promise<void> {
    console.log("config entrypoint")
  }
}
