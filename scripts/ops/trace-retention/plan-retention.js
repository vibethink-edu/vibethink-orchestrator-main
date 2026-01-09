const fs = require("fs");
const path = require("path");

const REQUIRED_REPLAY_FIELDS = [
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

function hasReplayFields(record) {
  for (const field of REQUIRED_REPLAY_FIELDS) {
    if (!(field in record)) return false;
  }
  if (!record.versions || typeof record.versions !== "object") return false;
  return REQUIRED_VERSION_FIELDS.every((field) => typeof record.versions[field] === "string");
}

function toDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

function daysBetween(now, createdAt) {
  return Math.floor((now.getTime() - createdAt.getTime()) / 86400000);
}

function getId(record, index) {
  return record.trace_id || record.traceId || record.id || `record-${index}`;
}

function planRetention(records, options) {
  if (!options.now) {
    throw new Error("Missing --now. Deterministic plan requires an explicit timestamp.");
  }
  const now = toDate(options.now);
  const windows = {
    hot_days: options.hot_days ?? 30,
    warm_days: options.warm_days ?? 180,
    cold_days: options.cold_days ?? 365,
    replay_days: options.replay_days ?? 30,
  };
  const legalHoldIds = new Set(options.legal_hold_ids || []);

  const errors = [];
  const items = records.map((record, index) => {
    let createdAt;
    try {
      createdAt = toDate(record.created_at || record.createdAt);
    } catch (error) {
      errors.push(`Record ${index} missing or invalid created_at`);
      return null;
    }

    const id = getId(record, index);
    const ageDays = daysBetween(now, createdAt);
    const legalHold = Boolean(record.legal_hold || legalHoldIds.has(id));
    const replayAvailable = ageDays <= windows.replay_days && hasReplayFields(record);

    let bucket = "hot";
    if (legalHold) {
      bucket = "legal_hold";
    } else if (ageDays <= windows.hot_days) {
      bucket = "hot";
    } else if (ageDays <= windows.warm_days) {
      bucket = "warm";
    } else if (ageDays <= windows.cold_days) {
      bucket = "cold";
    } else {
      bucket = "expired";
    }

    const reasons = [];
    if (legalHold) reasons.push("legal_hold");
    if (!replayAvailable) reasons.push("replay_not_available");

    return {
      id,
      created_at: createdAt.toISOString(),
      age_days: ageDays,
      bucket,
      legal_hold: legalHold,
      replay_available: replayAvailable,
      purge_candidate: bucket === "expired" && !legalHold,
      reasons,
    };
  }).filter(Boolean);

  const sortedItems = items.slice().sort((a, b) => a.id.localeCompare(b.id));

  const totals = {
    total: sortedItems.length,
    hot: sortedItems.filter((item) => item.bucket === "hot").length,
    warm: sortedItems.filter((item) => item.bucket === "warm").length,
    cold: sortedItems.filter((item) => item.bucket === "cold").length,
    expired: sortedItems.filter((item) => item.bucket === "expired").length,
    legal_hold: sortedItems.filter((item) => item.legal_hold).length,
    purge_candidates: sortedItems.filter((item) => item.purge_candidate).length,
    replay_available: sortedItems.filter((item) => item.replay_available).length,
  };

  return {
    generated_at: now.toISOString(),
    now: now.toISOString(),
    windows_days: windows,
    totals,
    items: sortedItems,
    errors,
  };
}

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2).replace(/-/g, "_");
    const value = args[i + 1];
    if (value && !value.startsWith("--")) {
      options[key] = value;
      i += 1;
    } else {
      options[key] = true;
    }
  }

  if (options.legal_hold_ids) {
    options.legal_hold_ids = String(options.legal_hold_ids)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  ["hot_days", "warm_days", "cold_days", "replay_days"].forEach((key) => {
    if (options[key] != null) {
      options[key] = Number(options[key]);
    }
  });

  return options;
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath) {
    console.error("Usage: node plan-retention.js <input.json> [output.json] [--now <iso>] [--hot-days N] [--warm-days N] [--cold-days N] [--replay-days N] [--legal-hold-ids id1,id2]");
    process.exit(2);
  }

  const options = parseArgs(process.argv.slice(4));
  if (!options.now) {
    console.error("Missing --now. Deterministic plan requires an explicit timestamp.");
    process.exit(2);
  }
  const payload = loadJson(path.resolve(inputPath));
  const records = extractRecords(payload);
  let plan;
  try {
    plan = planRetention(records, options);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }

  if (plan.errors.length > 0) {
    console.error("Retention plan failed:");
    plan.errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  const outputJson = JSON.stringify(plan, null, 2);
  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), `${outputJson}\n`, "utf8");
  } else {
    console.log(outputJson);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  planRetention,
  extractRecords,
  stableStringify,
  REQUIRED_REPLAY_FIELDS,
};
