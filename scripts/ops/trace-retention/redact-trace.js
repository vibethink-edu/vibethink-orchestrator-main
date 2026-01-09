const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const FULL_REDACT_SUBSTRINGS = [
  "password",
  "secret",
  "token",
  "api_key",
  "apikey",
  "authorization",
  "cookie",
  "set-cookie",
  "access_token",
  "refresh_token",
  "client_secret",
];

const HASH_KEYS = new Set([
  "email",
  "phone",
  "ip",
  "user_id",
  "userid",
  "account_id",
  "org_id",
  "tenant_id",
  "session_id",
  "trace_id",
]);

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function normalizeKey(key) {
  return String(key).toLowerCase();
}

function hashValue(value, salt) {
  const payload = `${salt}:${String(value)}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function shouldFullRedact(key) {
  const normalized = normalizeKey(key);
  return FULL_REDACT_SUBSTRINGS.some((fragment) => normalized.includes(fragment));
}

function shouldHash(key) {
  const normalized = normalizeKey(key);
  return HASH_KEYS.has(normalized);
}

function redactValue(key, value, salt) {
  if (shouldFullRedact(key)) {
    return "[REDACTED]";
  }
  if (shouldHash(key)) {
    return `hash:${hashValue(value, salt)}`;
  }
  return value;
}

function redactPayload(payload, options) {
  const salt = options.salt;
  if (!salt) {
    throw new Error("Missing salt. Provide --salt or TRACE_REDACTION_SALT.");
  }

  function walk(value, key) {
    if (Array.isArray(value)) {
      return value.map((item) => walk(item, key));
    }
    if (value && typeof value === "object") {
      const output = {};
      Object.keys(value).forEach((childKey) => {
        const childValue = value[childKey];
        output[childKey] = walk(childValue, childKey);
      });
      return output;
    }
    if (key) {
      return redactValue(key, value, salt);
    }
    return value;
  }

  return walk(payload, null);
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
  return options;
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath) {
    console.error("Usage: node redact-trace.js <input.json> [output.json] [--salt value]");
    process.exit(2);
  }

  const options = parseArgs(process.argv.slice(4));
  const salt = options.salt;
  if (!salt) {
    console.error("Missing --salt. Deterministic redaction requires an explicit salt.");
    process.exit(2);
  }

  const payload = loadJson(path.resolve(inputPath));
  const redacted = redactPayload(payload, { salt });
  const outputJson = JSON.stringify(redacted, null, 2);

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
  redactPayload,
  hashValue,
};
