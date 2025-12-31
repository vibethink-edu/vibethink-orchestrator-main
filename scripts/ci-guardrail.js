const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const MARKERS = ['<<<<<<<', '=======', '>>>>>>>'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'coverage', 'dist', '.next'];
const EXCLUDE_FILES = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];

function getChangedFiles() {
    try {
        // In local/pre-commit: check staged files
        // In CI: check changed files in PR range (needs env vars usually, falling back to staged/HEAD for basics)
        const output = execSync('git diff --name-only --cached').toString();
        return output.split(/\r?\n/).filter(f => f.trim());
    } catch (e) {
        console.warn("⚠️ Cannot detect git changes (not a git repo?). Skipping change detection.");
        return [];
    }
}

function checkFile(filepath) {
    if (!fs.existsSync(filepath)) return { valid: true }; // Deleted file

    // Check exclude patterns
    if (EXCLUDE_FILES.includes(path.basename(filepath))) return { valid: true };
    if (EXCLUDE_DIRS.some(dir => filepath.includes(dir))) return { valid: true };

    const content = fs.readFileSync(filepath, 'utf8');
    const errors = [];

    // 1. Merge Markers
    MARKERS.forEach(marker => {
        if (content.includes(marker)) {
            errors.push(`❌ Merge marker found: ${marker}`);
        }
    });

    // 2. JSON Syntax
    if (path.extname(filepath) === '.json') {
        try {
            JSON.parse(content);
        } catch (e) {
            errors.push(`❌ Invalid JSON: ${e.message}`);
        }
    }

    return { valid: errors.length === 0, errors, filepath };
}

function main() {
    console.log("🛡️ Running CI Hygiene Guardrail...");

    // Scan staged files if in git context, else scan critical paths?
    // For this proof-of-concept, we'll scan staged files. 
    // If no git context, we might want to scan specific known problematic dirs, but let's stick to safe defaults.
    const files = getChangedFiles();

    if (files.length === 0) {
        console.log("✅ No staged files to check. Skipping.");
        return;
    }

    console.log(`Checking ${files.length} staged files...`);
    let failed = false;

    files.forEach(f => {
        const result = checkFile(f);
        if (!result.valid) {
            failed = true;
            console.error(`\n[FAIL] ${result.filepath}`);
            result.errors.forEach(e => console.error(`  ${e}`));
        }
    });

    if (failed) {
        console.error("\n💥 Hygiene Check FAILED. Fix issues before committing.");
        process.exit(1);
    } else {
        console.log("✅ All checks passed.");
    }
}

main();
