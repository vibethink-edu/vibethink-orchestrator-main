const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "docs");
const CANON_DIR = path.join(DOCS_DIR, "canon");

const REQUIRED_HEADER_LINES = [
  "Status: NON-CANONICAL",
  "Language: ES",
  "Scope: Operational reference only",
  "Canon-Impact: NONE",
];

function listMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function hasSpanishMarkers(content) {
  if (/[áéíóúñ¿¡]/i.test(content)) return true;
  if (/Language:\s*ES/i.test(content)) return true;
  return false;
}

function hasRequiredHeader(content) {
  const head = content.split(/\r?\n/).slice(0, 20).join("\n");
  return REQUIRED_HEADER_LINES.every((line) => head.includes(line));
}

function isCanonFile(filePath) {
  return filePath.startsWith(CANON_DIR + path.sep);
}

function isSpanishSuffix(filePath) {
  return filePath.toLowerCase().endsWith("_es.md");
}

function isGuiaName(filePath) {
  const base = path.basename(filePath).toLowerCase();
  return base.startsWith("guia_");
}

function runChecks() {
  const errors = [];
  const docsFiles = listMarkdownFiles(DOCS_DIR);

  for (const filePath of docsFiles) {
    const relativePath = path.relative(ROOT, filePath);
    const content = readFile(filePath);

    if (isCanonFile(filePath)) {
      if (isSpanishSuffix(filePath)) {
        errors.push(`Canon file uses _es suffix: ${relativePath}`);
      }
      if (hasSpanishMarkers(content)) {
        errors.push(`Canon file contains Spanish markers: ${relativePath}`);
      }
      if (hasRequiredHeader(content)) {
        errors.push(`Canon file contains NON-CANONICAL header: ${relativePath}`);
      }
      continue;
    }

    if (isGuiaName(filePath) && !isSpanishSuffix(filePath)) {
      errors.push(`Spanish guide name missing _es suffix: ${relativePath}`);
    }

    if (isSpanishSuffix(filePath) && !hasRequiredHeader(content)) {
      errors.push(`Spanish doc missing NON-CANONICAL header: ${relativePath}`);
    }

    if (!isSpanishSuffix(filePath) && /Language:\s*ES/i.test(content)) {
      errors.push(`Spanish header used without _es suffix: ${relativePath}`);
    }
  }

  if (errors.length > 0) {
    console.error("Non-canonical language hygiene check failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Non-canonical language hygiene check passed.");
}

runChecks();
