import yaml from 'yaml';
import jsYaml from 'js-yaml';
import fs from 'fs';

export class GenerateSchemaCommand {
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
    let modifiedLines = lines.map(line => {
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

    modifiedLines = ["title: config", ...modifiedLines];

    // Parse modified YAML content into an object
    const modifiedYamlContent = modifiedLines.join('\n');

    const parsedYaml = yaml.parse(modifiedYamlContent);

    // Rename keys and add required: false for optional properties
    return this.modifyYamlObject(parsedYaml);
  }

  static modifyYamlObject(obj: any): any {
    const schema: any = {};
    for (const key in obj) {
      if (key === "title") {
        schema[key] = "config";
        continue;
      }
      if (Array.isArray(obj[key])) {
        schema[key] = { type: 'array', items: typeof obj[key][0] };
        return schema;
      }
      if (typeof obj[key] === 'object') {
        schema[key] = this.modifyYamlObject(obj[key]);
      } else {
        // Rename the key to remove 'optional_' prefix
        const newKey = key.startsWith('optional_') ? key.slice(9) : key;
        // Add required: false for optional properties
        if (key.startsWith('optional_')) {
          // Determine the type dynamically based on the value
          const valueType = this.getType(obj[key]);
          schema[newKey] = { type: valueType, required: false };
        } else {
          schema[newKey] = this.getType(obj[key]);
        }
      }
    }
    return schema;
  }

  static getType(value: any): string {
    if (Array.isArray(value)) {
      return 'array';
    } else if (typeof value === 'number' && Number.isInteger(value)) {
      return 'integer';
    } else {
      return typeof value;
    }
  }
}
