#!/usr/bin/env tsx
/**
 * CI Validation: Detect Unused Code
 * 
 * CodeRabbit commonly reports:
 * - "Unused import"
 * - "Unused variable"
 * - "Dead code"
 * 
 * This script uses TypeScript compiler to detect unused code.
 */

import { execSync } from 'child_process';

console.log('🔍 Scanning for unused code...\n');

try {
    // Run TypeScript compiler with noUnusedLocals and noUnusedParameters
    const result = execSync(
        'npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1',
        { encoding: 'utf-8', stdio: 'pipe', cwd: process.cwd() }
    );

    // If we get here, no unused code was found
    console.log('✅ No unused code detected.\n');

} catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string };
    const output = err.stdout || err.stderr || '';

    // Parse TypeScript errors
    const unusedErrors = output
        .split('\n')
        .filter(line =>
            line.includes('is declared but') ||
            line.includes('never used') ||
            line.includes('never read')
        );

    if (unusedErrors.length > 0) {
        console.error('❌ UNUSED CODE DETECTED:\n');

        // Group by type
        const unusedImports = unusedErrors.filter(e => e.includes('import'));
        const unusedVars = unusedErrors.filter(e => !e.includes('import'));

        if (unusedImports.length > 0) {
            console.error('📦 Unused Imports:');
            unusedImports.slice(0, 10).forEach(err => console.error(`  ${err}`));
            if (unusedImports.length > 10) {
                console.error(`  ... and ${unusedImports.length - 10} more\n`);
            }
        }

        if (unusedVars.length > 0) {
            console.error('\n📝 Unused Variables:');
            unusedVars.slice(0, 10).forEach(err => console.error(`  ${err}`));
            if (unusedVars.length > 10) {
                console.error(`  ... and ${unusedVars.length - 10} more\n`);
            }
        }

        console.error(`\n⚠️  Found ${unusedErrors.length} unused code issue(s).`);
        console.error('\n💡 Quick fixes:');
        console.error('  - Remove unused imports');
        console.error('  - Prefix unused params with _ (e.g., _unusedParam)');
        console.error('  - Remove dead code\n');

        if (process.env.CI === 'true') {
            console.error('::warning::Unused code detected.');
        }
    } else {
        console.log('✅ No unused code detected.\n');
    }
}
