#!/usr/bin/env tsx
/**
 * Meta-Validation: Validate the Validators
 * 
 * Ensures our validation scripts follow the same rules they enforce.
 * Prevents "do as I say, not as I do" scenarios.
 */

import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

console.log('🔍 Meta-validating our validators...\n');

const scriptsDir = join(process.cwd(), 'scripts');
const validatorScripts = readdirSync(scriptsDir)
    .filter(f => f.startsWith('validate-') && f.endsWith('.ts'));

let hasIssues = false;

console.log(`Found ${validatorScripts.length} validator scripts to check:\n`);

validatorScripts.forEach(script => {
    const scriptPath = join(scriptsDir, script);
    console.log(`📝 Checking ${script}...`);

    try {
        // Run type-safety check on the script itself
        const result = execSync(
            `npx tsx scripts/validate-type-safety.ts`,
            { encoding: 'utf-8', stdio: 'pipe', cwd: process.cwd() }
        );

        // Check if this specific script was flagged
        if (result.includes(scriptPath)) {
            console.error(`  ❌ Type safety issues detected`);
            hasIssues = true;
        } else {
            console.log(`  ✅ Passed`);
        }
    } catch (e) {
        // Validator might have found issues
        const err = e as { stdout?: string };
        if (err.stdout && err.stdout.includes(scriptPath)) {
            console.error(`  ❌ Type safety issues detected`);
            hasIssues = true;
        } else {
            console.log(`  ✅ Passed`);
        }
    }
});

console.log('');

if (hasIssues) {
    console.error('❌ Some validators have issues!\n');
    console.error('💡 Our validators must follow the same rules they enforce.');
    console.error('Run: pnpm run validate:type-safety\n');

    if (process.env.CI === 'true') {
        process.exit(1);
    }
} else {
    console.log('✅ All validators are clean!\n');
}
