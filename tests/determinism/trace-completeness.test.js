const test = require("node:test");
const assert = require("node:assert");
const { verifyTraceRecords } = require("../../scripts/determinism/verify-trace-completeness");

function loadFixture(name) {
  return require(`../fixtures/determinism/${name}`);
}

test("trace completeness passes for good fixture", () => {
  const payload = loadFixture("trace-good.json");
  const errors = verifyTraceRecords(payload.trace_records);
  assert.strictEqual(errors.length, 0);
});

test("trace completeness fails for bad fixture", () => {
  const payload = loadFixture("trace-bad.json");
  const errors = verifyTraceRecords(payload.trace_records);
  assert.ok(errors.length > 0);
});
