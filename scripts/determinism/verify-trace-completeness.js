const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REQUIRED_FIELDS = [
  "signal_id",
  "input_snapshot_hash",
  "policy_context_id",
  "prompt_hash",
  "model_version",
  "versions",
  "tool_call_inputs_outputs",
  "output_hash",
  "determinism_key",
];

const REQUIRED_VERSION_FIELDS = ["model_version", "specialist_version"];

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

function computeDeterminismKey(record) {
  const payload = {
    signal_id: record.signal_id,
    input_snapshot_hash: record.input_snapshot_hash,
    versions: record.versions,
  };
  return crypto.createHash("sha256").update(stableStringify(payload)).digest("hex");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateVersions(record, errors, index) {
  if (!record.versions || typeof record.versions !== "object") {
    errors.push(`Record ${index} invalid versions`);
    return;
  }
  REQUIRED_VERSION_FIELDS.forEach((field) => {
    if (!isNonEmptyString(record.versions[field])) {
      errors.push(`Record ${index} missing or invalid versions.${field}`);
    }
  });
}

function validateToolCalls(record, errors, index) {
  const val = record.tool_call_inputs_outputs;
  if (!Array.isArray(val)) {
    errors.push(`Record ${index} invalid tool_call_inputs_outputs`);
    return;
  }
  val.forEach((entry, entryIndex) => {
    if (!entry || typeof entry !== "object") {
      errors.push(`Record ${index} tool_call_inputs_outputs[${entryIndex}] invalid`);
      return;
    }
    if (!isNonEmptyString(entry.tool_name)) {
      errors.push(`Record ${index} tool_call_inputs_outputs[${entryIndex}] missing tool_name`);
    }
    if (!isNonEmptyString(entry.input_hash)) {
      errors.push(`Record ${index} tool_call_inputs_outputs[${entryIndex}] missing input_hash`);
    }
    if (!isNonEmptyString(entry.output_hash)) {
      errors.push(`Record ${index} tool_call_inputs_outputs[${entryIndex}] missing output_hash`);
    }
  });
}

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.trace_records)) return payload.trace_records;
  if (payload && Array.isArray(payload.traceRecords)) return payload.traceRecords;
  return [];
}

function verifyTraceRecords(records) {
  const errors = [];
  if (!Array.isArray(records) || records.length === 0) {
    errors.push("No trace records found.");
    return errors;
  }

  records.forEach((record, index) => {
    REQUIRED_FIELDS.forEach((field) => {
      if (!(field in record)) {
        errors.push(`Record ${index} missing required field: ${field}`);
      }
    });

    ["signal_id", "input_snapshot_hash", "policy_context_id", "prompt_hash", "model_version", "output_hash", "determinism_key"]
      .forEach((field) => {
        if (field in record && !isNonEmptyString(record[field])) {
          errors.push(`Record ${index} invalid ${field}`);
        }
      });

    if ("versions" in record) {
      validateVersions(record, errors, index);
    }

    if ("tool_call_inputs_outputs" in record) {
      validateToolCalls(record, errors, index);
    }

    if (record.signal_id && record.input_snapshot_hash && record.versions) {
      const expected = computeDeterminismKey(record);
      if (record.determinism_key && record.determinism_key !== expected) {
        errors.push(`Record ${index} determinism_key mismatch`);
      }
    }
  });

  return errors;
}

function verifyPath(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(targetPath)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(targetPath, f));
    let allErrors = [];
    files.forEach((file) => {
      const payload = loadJson(file);
      const records = extractRecords(payload);
      const errors = verifyTraceRecords(records).map((e) => `${path.basename(file)}: ${e}`);
      allErrors = allErrors.concat(errors);
    });
    return allErrors;
  }

  const payload = loadJson(targetPath);
  const records = extractRecords(payload);
  return verifyTraceRecords(records);
}

function main() {
  const targetPath = process.argv[2];
  if (!targetPath) {
    console.error("Usage: node verify-trace-completeness.js <file-or-dir>");
    process.exit(2);
  }

  const errors = verifyPath(targetPath);
  if (errors.length > 0) {
    console.error("Trace completeness check failed:");
    errors.forEach((e) => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log("Trace completeness check passed.");
}

if (require.main === module) {
  main();
}

module.exports = {
  REQUIRED_FIELDS,
  extractRecords,
  verifyTraceRecords,
};
