const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { validatePayload } = require("../../scripts/contracts/validate-approval");

const schemasDir = path.join(__dirname, "..", "..", "schemas", "ux");
const fixturesDir = path.join(__dirname, "..", "fixtures", "contracts");

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

test("approval request fixture passes schema validation", () => {
  const schema = loadJson(path.join(schemasDir, "approval-request.schema.json"));
  const payload = loadJson(path.join(fixturesDir, "approval-request.good.json"));
  const errors = validatePayload(payload, schema);
  assert.strictEqual(errors.length, 0);
});

test("approval request fixture fails schema validation", () => {
  const schema = loadJson(path.join(schemasDir, "approval-request.schema.json"));
  const payload = loadJson(path.join(fixturesDir, "approval-request.bad.json"));
  const errors = validatePayload(payload, schema);
  assert.ok(errors.length > 0);
});

test("approval response fixture passes schema validation", () => {
  const schema = loadJson(path.join(schemasDir, "approval-response.schema.json"));
  const payload = loadJson(path.join(fixturesDir, "approval-response.good.json"));
  const errors = validatePayload(payload, schema);
  assert.strictEqual(errors.length, 0);
});

test("approval response fixture fails schema validation", () => {
  const schema = loadJson(path.join(schemasDir, "approval-response.schema.json"));
  const payload = loadJson(path.join(fixturesDir, "approval-response.bad.json"));
  const errors = validatePayload(payload, schema);
  assert.ok(errors.length > 0);
});
