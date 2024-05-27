import { GenerateSchemaCommand } from "./generate";

describe("Schema Generate Command", () => {
  it("root fields only", async () => {
    // Arrange
    const input = `env: development\ntimeout: 60000\nport: 3000`;

    // Act
    const result = await GenerateSchemaCommand.generateSchema(input);

    // Assert
    const expected = {
      title: "config",
      env: "string",
      timeout: "integer",
      port: "integer",
    };
    expect(result).toEqual(expected);
  });

  it("nested fields", async () => {
    // Arrange
    const input = `
database:
  host: 127.0.0.1
  port: 3313
  database: dbname
  username: root
  password: root
  connectionLimit: 10
  migrations:
    - dist/libs/db/src/migrations/*.js
  entities:
    - dist/libs/db/src/entities/*.js
  replicas:
    -
      host: 127.0.0.1
      port: 3313
      username: root
      password: root
      database: dbname
    `;

    // Act
    const result = await GenerateSchemaCommand.generateSchema(input);

    // Assert
    const expected = {
      title: "config",
      database: {
        host: "string",
        port: "integer",
        database: "string",
        username: "string",
        password: "string",
        connectionLimit: "integer",
        migrations: {
          type: "array",
          items: "string",
        },
        entities: {
          type: "array",
          items: "string",
        },
        replicas: {
          type: "array",
          items: {
            host: "string",
            port: "integer",
            username: "string",
            password: "string",
            database: "string",
          },
        },
      },
    };

    expect(result).toEqual(expected);
  });

  it("empty string", async () => {
    // Arrange
    const input = ``;

    // Act
    const result = await GenerateSchemaCommand.generateSchema(input);

    // Assert
    const expected = {
      title: "config",
    };
    expect(result).toEqual(expected);
  });

  it("optional fields", async () => {
    // Arrange
    const input = `env: development\noptional_timeout: 60000\nport: 3000`;

    // Act
    const result = await GenerateSchemaCommand.generateSchema(input);

    // Assert
    const expected = {
      title: "config",
      env: "string",
      timeout: { type: "integer", required: false },
      port: "integer",
    };
    expect(result).toEqual(expected);
  });

  it("commented line, should mark as optional", async () => {
    // Arrange
    const input = `env: development\n# timeout: 60000\nport: 3000`;

    // Act
    const result = await GenerateSchemaCommand.generateSchema(input);

    // Assert
    const expected = {
      title: "config",
      env: "string",
      timeout: { type: "integer", required: false },
      port: "integer",
    };
    expect(result).toEqual(expected);
  });
});
