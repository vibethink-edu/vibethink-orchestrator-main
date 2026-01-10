#!/usr/bin/env tsx
/**
 * CI Validation: Verify TypeScript Path Mappings
 * 
 * Ensures all @/* imports have corresponding path mappings in tsconfig.json
 * Prevents "Cannot find module" errors from missing path configurations.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

interface PathIssue {
    file: string;
    line: number;
    importPath: string;
    reason: string;
}

const issues: PathIssue[] = [];

console.log('🔍 Validating TypeScript path mappings...\n');

// Read tsconfig.json
const tsconfigPath = join(process.cwd(), 'tsconfig.json');
let pathMappings: Record<string, string[]> = {};

try {
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
    pathMappings = tsconfig.compilerOptions?.paths || {};
} catch (e) {
    console.error('❌ Could not read tsconfig.json');
    process.exit(1);
}

// Extract all @/* import patterns from code
const importPatterns = new Set<string>();

try {
    const result = execSync(
        `rg "from ['\"]@/([^/]+)" --type ts --type tsx -o -r '$1' --no-filename`,
        { encoding: 'utf-8', stdio: 'pipe' }
    );

    result.split('\n').filter(Boolean).forEach(pattern => {
        importPatterns.add(`@/${pattern}/*`);
    });
} catch (e) {
    // No imports found (unlikely but possible)
}

// Check if each pattern has a path mapping
importPatterns.forEach(pattern => {
    if (!pathMappings[pattern]) {
        issues.push({
            file: 'tsconfig.json',
            line: 0,
            importPath: pattern,
            reason: `Missing path mapping for ${pattern}`
        });
    }
});

// Report findings
if (issues.length > 0) {
    console.error('❌ MISSING PATH MAPPINGS DETECTED:\n');

    issues.forEach(({ importPath, reason }) => {
        console.error(`  ${importPath}`);
        console.error(`    Reason: ${reason}\n`);
    });

    console.error(`\n⚠️  Found ${issues.length} missing path mapping(s).`);
    console.error('Add these to tsconfig.json compilerOptions.paths:\n');

    issues.forEach(({ importPath }) => {
        console.error(`  "${importPath}": ["./src/${importPath.replace('@/', '').replace('/*', '')}/*"]`);
    });

    console.error('');

    if (process.env.CI === 'true') {
        process.exit(1);
    }
} else {
    console.log('✅ All path mappings are configured.\n');
}
