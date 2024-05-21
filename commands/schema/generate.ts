import yaml from 'yaml';
import jsYaml from 'js-yaml';
import fs from 'fs';

export class GenerateSchemaCommand {
  private static readonly OPTIONAL_PREFIX = 'optional_';

  static execute(inputFilename: string, outputFilename: string) {
    // Parse the input file based on its extension
    if (!(inputFilename.endsWith('.yaml') || inputFilename.endsWith(".YAML") || inputFilename.endsWith(".yml"))) {
      console.log('Invalid input file. Should be yaml.');
      process.exit(1);
    }

    // Call your package function here
    const resultedSchema = this.generateSchema(fs.readFileSync(inputFilename).toString());

    // Write the expanded object to the output file
    fs.writeFileSync(outputFilename, jsYaml.dump(resultedSchema));
  }

  static generateSchema(yamlContent: string): any {
    // Parse YAML line by line to mark commented lines with properties as optional
    const lines = yamlContent.split('\n');
    const modifiedLines = lines.map(line => {
      if (line.trim().startsWith('#') && line.includes(':')) {
        // Commented line with a property, mark it as optional while preserving indentation
        const indentation = line.search(/\S|$/); // Find the index of the first non-whitespace character
        const trimmedLine = line.trim().slice(1); // Remove leading '#'

        // eslint-disable-next-line prefer-const
        let [key, value] = trimmedLine.split(/:(.+)/).map(part => part.trim());
        if (value === undefined) {
          key = key.split(":")[0];
        }
        if (key) {
          const optionalLine = `${line.slice(0, indentation)}optional_${key}: ${value}`;
          return optionalLine;
        }
      }
      return line;
    });


    // Parse modified YAML content into an object
    const modifiedYamlContent = modifiedLines.join('\n');

    const parsedYaml = yaml.parse(modifiedYamlContent);

    // Rename keys and add required: false for optional properties
    const result = this.modifyYamlObject(parsedYaml);
    result.title = "config";

    return result;
  }

  static modifyYamlObject(obj: any): any {
    const schema: any = {};

    for (const key in obj) {
      const type = this.getType(obj[key]);
      schema[key] = { type };

      if (type === 'array') {
        schema[key] = this.handleArray(obj, key);
        continue;
      }

      if (type === 'object') {
        schema[key] = this.modifyYamlObject(obj[key]);
        continue;
      }

      const isOptional = key.startsWith(this.OPTIONAL_PREFIX);
      if (isOptional) {
        const newKey = key.slice(this.OPTIONAL_PREFIX.length);
        const valueType = this.getType(obj[key]);

        schema[newKey] = { type: valueType, required: false };
        delete schema[key];
      } else {
        schema[key] = this.getType(obj[key]);
      }
    }

    return schema;
  }

  private static handleArray(obj: any, key: string): any {
    const itemsType = this.getType(obj[key][0]);
    const result: any = { type: 'array' };
    if (itemsType === 'object') {
      result.items = this.modifyYamlObject(obj[key][0]);
    } else {
      result.items = itemsType;
    }

    return result;
  }

  private static getType(value: any): string {
    if (Array.isArray(value)) {
      return 'array';
    }

    if (typeof value === 'number' && Number.isInteger(value)) {
      return 'integer';
    }

    return typeof value;
  }
}
