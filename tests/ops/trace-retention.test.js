const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { redactPayload } = require("../../scripts/ops/trace-retention/redact-trace");
const { planRetention, stableStringify } = require("../../scripts/ops/trace-retention/plan-retention");

const fixturesDir = path.join(__dirname, "..", "fixtures", "ops", "trace-retention");

function loadFixture(name) {
  const filePath = path.join(fixturesDir, name);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("redaction is deterministic", () => {
  const input = loadFixture("redact-input.json");
  const expected = loadFixture("redact-expected.json");
  const outputA = redactPayload(input, { salt: "test-salt" });
  const outputB = redactPayload(input, { salt: "test-salt" });

  assert.deepStrictEqual(outputA, expected);
  assert.strictEqual(stableStringify(outputA), stableStringify(outputB));
});

test("retention plan is deterministic", () => {
  const input = loadFixture("retention-input.json");
  const expected = loadFixture("retention-plan-expected.json");

  const plan = planRetention(input.trace_records, {
    now: "2026-01-05T00:00:00Z",
    hot_days: 30,
    warm_days: 180,
    cold_days: 365,
    replay_days: 30,
  });

  assert.deepStrictEqual(plan, expected);
});

test("replay window enforcement", () => {
  const input = loadFixture("retention-input.json");
  const plan = planRetention(input.trace_records, {
    now: "2026-01-05T00:00:00Z",
    replay_days: 30,
  });

  const hot = plan.items.find((item) => item.id === "trace-hot");
  const warm = plan.items.find((item) => item.id === "trace-warm");

  assert.strictEqual(hot.replay_available, true);
  assert.strictEqual(warm.replay_available, false);
});
