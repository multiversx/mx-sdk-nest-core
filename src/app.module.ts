import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigCommandGroup } from "./commands/config/config.base";
import { ExpandSchemaCommand } from "./commands/config/config.expand-schema";
import { GenerateSchemaCommand } from "./commands/config/config.generate-schema";
import { GenerateTypesCommand } from "./commands/config/config.generate-types";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigCommandGroup,
    ExpandSchemaCommand,
    GenerateSchemaCommand,
    GenerateTypesCommand,
  ],
})
export class AppModule {}
