const fs = require("fs");
const path = require("path");

function findRepoRoot(startDir) {
  let current = startDir;
  while (current && current !== path.dirname(current)) {
    const pkg = path.join(current, "package.json");
    const gitDir = path.join(current, ".git");
    if (fs.existsSync(pkg) || fs.existsSync(gitDir)) {
      return current;
    }
    current = path.dirname(current);
  }
  return startDir;
}

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function validateSchema(schema, data, pathStack, errors) {
  if (schema.type === "object") {
    if (!isObject(data)) {
      errors.push(`${pathStack}: expected object`);
      return;
    }
    if (schema.required) {
      schema.required.forEach((key) => {
        if (!(key in data)) {
          errors.push(`${pathStack}: missing required field ${key}`);
        }
      });
    }
    if (schema.additionalProperties === false && schema.properties) {
      Object.keys(data).forEach((key) => {
        if (!schema.properties[key]) {
          errors.push(`${pathStack}: unexpected field ${key}`);
        }
      });
    }
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, propSchema]) => {
        if (key in data) {
          validateSchema(propSchema, data[key], `${pathStack}.${key}`, errors);
        }
      });
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(data)) {
      errors.push(`${pathStack}: expected array`);
      return;
    }
    if (schema.items) {
      data.forEach((item, index) => {
        validateSchema(schema.items, item, `${pathStack}[${index}]`, errors);
      });
    }
  } else if (schema.type === "string") {
    if (typeof data !== "string") {
      errors.push(`${pathStack}: expected string`);
      return;
    }
    if (schema.minLength && data.length < schema.minLength) {
      errors.push(`${pathStack}: string shorter than minLength`);
    }
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`${pathStack}: value not in enum`);
    }
  } else if (schema.type === "integer") {
    if (!Number.isInteger(data)) {
      errors.push(`${pathStack}: expected integer`);
    }
    if (schema.minimum != null && data < schema.minimum) {
      errors.push(`${pathStack}: integer below minimum`);
    }
  }

  if (schema.oneOf) {
    const oneOfErrors = schema.oneOf.map((option) => {
      const optionErrors = [];
      validateSchema(option, data, pathStack, optionErrors);
      return optionErrors;
    });
    if (!oneOfErrors.some((errs) => errs.length === 0)) {
      errors.push(`${pathStack}: oneOf validation failed`);
    }
  }

  if (schema.anyOf) {
    const anyOfErrors = schema.anyOf.map((option) => {
      const optionErrors = [];
      validateSchema(option, data, pathStack, optionErrors);
      return optionErrors;
    });
    if (!anyOfErrors.some((errs) => errs.length === 0)) {
      errors.push(`${pathStack}: anyOf validation failed`);
    }
  }
}

function validatePayload(payload, schema) {
  const errors = [];
  validateSchema(schema, payload, "approval", errors);
  return errors;
}

function main() {
  const kind = process.argv[2];
  const targetPath = process.argv[3];
  if (!kind || !targetPath || !["request", "response"].includes(kind)) {
    console.error("Usage: node validate-approval.js <request|response> <file.json>");
    process.exit(2);
  }

  const repoRoot = findRepoRoot(__dirname);
  const schemaFile = kind === "request"
    ? path.join(repoRoot, "schemas", "ux", "approval-request.schema.json")
    : path.join(repoRoot, "schemas", "ux", "approval-response.schema.json");

  const schema = loadJson(schemaFile);
  const payload = loadJson(path.resolve(targetPath));

  const errors = validatePayload(payload, schema);
  if (errors.length > 0) {
    console.error("Approval validation failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Approval validation passed.");
}

if (require.main === module) {
  main();
}

module.exports = {
  validatePayload,
};
