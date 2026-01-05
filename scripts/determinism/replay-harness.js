const fs = require("fs");
const crypto = require("crypto");

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

function hashJson(obj) {
  const json = stableStringify(obj);
  return crypto.createHash("sha256").update(json).digest("hex");
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath || !outputPath) {
    console.error("Usage: node replay-harness.js <input.json> <output.json>");
    process.exit(2);
  }

  const input = loadJson(inputPath);
  const output = loadJson(outputPath);

  if (!input.signal || !input.input_snapshot_hash || !input.versions || !input.expected_output_hash) {
    console.error("Replay input missing required fields: signal, input_snapshot_hash, versions, expected_output_hash");
    process.exit(1);
  }

  if (!output.expected_output_hash) {
    console.error("Replay output missing required field: expected_output_hash");
    process.exit(1);
  }

  const { expected_output_hash: _ignored, ...outputPayload } = output;
  const outputHash = hashJson(outputPayload);
  if (output.expected_output_hash !== outputHash) {
    console.error("Replay output hash mismatch.");
    process.exit(1);
  }

  if (input.expected_output_hash !== output.expected_output_hash) {
    console.error("Replay input/output expected_output_hash mismatch.");
    process.exit(1);
  }

  console.log("Replay harness stub passed.");
}

if (require.main === module) {
  main();
}
