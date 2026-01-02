/**
 * GATE STUB — Spec Compliance
 * Purpose: structural validation only (no semantic enforcement)
 * This script WILL be expanded only after FIT maturity.
 */

const fs = require('fs');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("ℹ️  [GATE STUB] No file provided. Skipping validation.");
    console.log("   (In CI, this would read the PR description)");
    process.exit(0);
}

const filePath = args[0];

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const specLinkRegex = /docs\/specs\/SPEC-/i;

    // Check for N/A bypass
    const naRegex = /Spec Reference.*N\/A/is;

    if (specLinkRegex.test(content)) {
        console.log("✅ [GATE STUB] Spec link detected.");
        process.exit(0);
    } else if (naRegex.test(content)) {
        console.log("⚠️ [GATE STUB] Spec Reference marked as N/A.");
        process.exit(0);
    } else {
        console.log("ℹ️  [GATE STUB] No Spec link found, but passing as this is a STUB.");
        // In the future, this would be process.exit(1);
        process.exit(0);
    }

} catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    process.exit(1);
}
