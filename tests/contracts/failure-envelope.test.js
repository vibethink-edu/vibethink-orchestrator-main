const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { validateFailure } = require("../../scripts/contracts/validate-failure");

const schemaPath = path.join(__dirname, "..", "..", "schemas", "runtime", "failure-envelope.schema.json");
const fixturesDir = path.join(__dirname, "..", "fixtures", "contracts");

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

test("failure envelope fixture passes schema validation", () => {
  const schema = loadJson(schemaPath);
  const payload = loadJson(path.join(fixturesDir, "failure-envelope.good.json"));
  const errors = validateFailure(payload, schema);
  assert.strictEqual(errors.length, 0);
});

test("failure envelope fixture fails schema validation", () => {
  const schema = loadJson(schemaPath);
  const payload = loadJson(path.join(fixturesDir, "failure-envelope.bad.json"));
  const errors = validateFailure(payload, schema);
  assert.ok(errors.length > 0);
});
