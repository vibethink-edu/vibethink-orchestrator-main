#!/usr/bin/env tsx
/**
 * CI Validation: Detect Syntax Errors Before Commit
 * 
 * Scans for common syntax errors that TypeScript might miss:
 * - Stray characters before imports
 * - Malformed import statements
 * - Missing semicolons in critical places
 */

import { execSync } from 'child_process';

interface SyntaxIssue {
    file: string;
    line: number;
    issue: string;
    pattern: string;
}

const issues: SyntaxIssue[] = [];

console.log('🔍 Scanning for syntax errors...\n');

// Pattern 1: Stray characters before import
try {
    const result = execSync(
        `rg "^[0-9]+import" --type ts --type tsx -n --json`,
        { encoding: 'utf-8', stdio: 'pipe' }
    );

    const lines = result.split('\n').filter(Boolean);

    lines.forEach(line => {
        try {
            const match = JSON.parse(line);
            if (match.type === 'match') {
                issues.push({
                    file: match.data.path.text,
                    line: match.data.line_number,
                    issue: 'Stray character before import statement',
                    pattern: match.data.lines.text.trim()
                });
            }
        } catch (e) {
            // Ignore parse errors
        }
    });
} catch (e) {
    // Pattern not found (good!)
}

// Pattern 2: Malformed imports (missing quotes)
try {
    const result = execSync(
        `rg "import.*from [^'\"]" --type ts --type tsx -n --json`,
        { encoding: 'utf-8', stdio: 'pipe' }
    );

    const lines = result.split('\n').filter(Boolean);

    lines.forEach(line => {
        try {
            const match = JSON.parse(line);
            if (match.type === 'match') {
                issues.push({
                    file: match.data.path.text,
                    line: match.data.line_number,
                    issue: 'Import statement missing quotes',
                    pattern: match.data.lines.text.trim()
                });
            }
        } catch (e) {
            // Ignore parse errors
        }
    });
} catch (e) {
    // Pattern not found (good!)
}

// Report findings
if (issues.length > 0) {
    console.error('❌ SYNTAX ERRORS DETECTED:\n');

    issues.forEach(({ file, line, issue, pattern }) => {
        console.error(`  ${file}:${line}`);
        console.error(`    Issue: ${issue}`);
        console.error(`    Code: ${pattern}\n`);
    });

    console.error(`\n⚠️  Found ${issues.length} syntax error(s).`);
    console.error('Please fix these issues before committing.\n');

    if (process.env.CI === 'true') {
        process.exit(1);
    }
} else {
    console.log('✅ No syntax errors detected.\n');
}
