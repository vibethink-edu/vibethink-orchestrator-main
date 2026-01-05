const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { validateActionIntent } = require("../../scripts/contracts/validate-action-intent");

const schemaPath = path.join(__dirname, "..", "..", "schemas", "service-layer", "action-intent.schema.json");
const fixturesDir = path.join(__dirname, "..", "fixtures", "contracts");

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

test("action intent fixture passes schema validation", () => {
  const schema = loadJson(schemaPath);
  const payload = loadJson(path.join(fixturesDir, "action-intent.good.json"));
  const errors = validateActionIntent(payload, schema);
  assert.strictEqual(errors.length, 0);
});

test("action intent fixture fails schema validation", () => {
  const schema = loadJson(schemaPath);
  const payload = loadJson(path.join(fixturesDir, "action-intent.bad.json"));
  const errors = validateActionIntent(payload, schema);
  assert.ok(errors.length > 0);
});
