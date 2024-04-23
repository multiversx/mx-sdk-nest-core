import { ConfigurationSchemaExpander } from '../configuration.schema.expander';
import fs from 'fs';
import yaml from 'js-yaml';

describe('json schema expander function', () => {
  it('should correctly expand a schema obtained from a yaml file', () => {
    const testYaml = fs.readFileSync("./test/testdata/test-input.yaml");
    const input = yaml.load(testYaml.toString());
    ConfigurationSchemaExpander.expand(input);

    const expected = JSON.parse(fs.readFileSync('./test/testdata/expected-output.json').toString());
    expect(input).toStrictEqual(expected);
  });
});
