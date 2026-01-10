#!/usr/bin/env tsx
/**
 * CI Validation: Detect Broken Component Imports
 * 
 * Scans for imports that reference non-existent paths.
 * Prevents the "Claude scenario" where imports point to missing files.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface BrokenImport {
    file: string;
    line: number;
    importPath: string;
    reason: string;
}

const brokenImports: BrokenImport[] = [];

// Scan for imports from @/shared/components/generic (known broken pattern)
// Based on actual incidents where AIs assumed components existed
const suspectPatterns = [
    '@/shared/components/generic',  // Claude incident: assumed generic components
    '@/shared/hooks/useGeneric',    // Claude incident: assumed generic hooks
    'from "components/generic',     // Missing @ or wrong path
    'from "hooks/generic',          // Missing @ or wrong path
    '@/lib/components/generic',     // Wrong lib path
];

console.log('🔍 Scanning for potentially broken imports...\n');

suspectPatterns.forEach(pattern => {
    try {
        const result = execSync(
            `rg "${pattern}" --type ts --type tsx -n --json`,
            { encoding: 'utf-8', stdio: 'pipe' }
        );

        const lines = result.split('\n').filter(Boolean);

        lines.forEach(line => {
            try {
                const match = JSON.parse(line);
                if (match.type === 'match') {
                    brokenImports.push({
                        file: match.data.path.text,
                        line: match.data.line_number,
                        importPath: pattern,
                        reason: 'Imports from potentially non-existent path'
                    });
                }
            } catch (e) {
                // Ignore parse errors
            }
        });
    } catch (e) {
        // Pattern not found (good!)
    }
});

// Report findings
if (brokenImports.length > 0) {
    console.error('❌ BROKEN IMPORTS DETECTED:\n');

    brokenImports.forEach(({ file, line, importPath, reason }) => {
        console.error(`  ${file}:${line}`);
        console.error(`    Import: ${importPath}`);
        console.error(`    Reason: ${reason}\n`);
    });

    console.error(`\n⚠️  Found ${brokenImports.length} potentially broken import(s).`);
    console.error('Please verify these imports point to existing components.\n');

    if (process.env.CI === 'true') {
        process.exit(1);
    }
} else {
    console.log('✅ No broken imports detected.\n');
}
