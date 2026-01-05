const { spawnSync } = require("child_process");

const suites = {
  quick: [
    {
      label: "determinism: trace completeness",
      cmd: "node",
      args: [
        "scripts/determinism/verify-trace-completeness.js",
        "tests/fixtures/determinism/trace-good.json",
      ],
    },
    {
      label: "determinism: replay harness",
      cmd: "node",
      args: [
        "scripts/determinism/replay-harness.js",
        "tests/fixtures/determinism/replay-input.json",
        "tests/fixtures/determinism/replay-output.json",
      ],
    },
    {
      label: "failure injection",
      cmd: "node",
      args: ["--test", "tests/e2e/failure-injection.test.js"],
    },
  ],
  full: [],
};

suites.full = suites.quick.slice();

function runCommand(entry) {
  const result = spawnSync(entry.cmd, entry.args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`Suite failed: ${entry.label}`);
    process.exit(1);
  }
}

function main() {
  const suite = process.argv[2];
  if (!suite || !suites[suite]) {
    console.error("Usage: node scripts/tests/run-suite.js <quick|full>");
    process.exit(2);
  }

  suites[suite].forEach(runCommand);
  console.log(`Suite passed: ${suite}`);
}

main();
