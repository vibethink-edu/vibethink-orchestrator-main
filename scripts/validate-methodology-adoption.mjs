import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.join(process.cwd(), 'docs/registry/METHODOLOGY_REGISTRY.md');

console.log('🔍 Validating Methodology Adoption Governance...');

if (!fs.existsSync(REGISTRY_PATH)) {
    console.error(`❌ Registry not found at ${REGISTRY_PATH}`);
    process.exit(1);
}

const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');
const lines = registryContent.split('\n');

let hasError = false;

// Basic Markdown Table Parser for the Registry
lines.forEach((line, index) => {
    if (line.includes('|') && (line.includes('ADOPTED') || line.includes('PARTIAL'))) {
        const columns = line.split('|').map(c => c.trim());
        if (columns.length >= 6) {
            const methodology = columns[1].replace(/\*/g, '');
            const status = columns[2];
            const evidence = columns[5];

            console.log(`Checking ${methodology} (${status})...`);

            if (evidence === '-' || evidence === '' || evidence.toLowerCase() === 'pending') {
                console.error(`❌ ERROR [Line ${index + 1}]: Methodology '${methodology}' is marked as '${status}' but lacks evidence/link.`);
                console.error(`   Any methodology adoption MUST include a link to a Canon doc or Evaluation report.`);
                hasError = true;
            }
        }
    }
});

if (hasError) {
    console.error('\n💥 FAILED: Methodology Governance Violation Detected.');
    console.error('To fix: Add a link to the evaluation/canon document in the Evidence column of METHODOLOGY_REGISTRY.md');
    process.exit(1);
} else {
    console.log('✅ Methodology Governance Verified.');
}
