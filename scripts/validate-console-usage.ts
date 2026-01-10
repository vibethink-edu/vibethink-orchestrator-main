#!/usr/bin/env tsx
/**
 * CI Validation: Detect Console Statements in Production Code
 * 
 * CodeRabbit commonly reports:
 * - "console.log should be removed before production"
 * - "Use proper logging library instead"
 * 
 * This script detects console statements and suggests alternatives.
 */

import { execSync } from 'child_process';

interface ConsoleIssue {
    file: string;
    line: number;
    method: string;
    context: string;
}

const issues: ConsoleIssue[] = [];

console.log('🔍 Scanning for console statements...\n');

// Allowed patterns (don't flag these)
const allowedPatterns = [
    'console.error',  // Error logging is OK
    'console.warn',   // Warnings are OK
    '// console.',    // Commented out
    '* console.',     // JSDoc comments
];

const consolePatterns = ['console.log', 'console.debug', 'console.info', 'console.table'];

consolePatterns.forEach(pattern => {
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
                    const text = match.data.lines.text.trim();

                    // Skip if it's in allowed patterns
                    const isAllowed = allowedPatterns.some(allowed => text.includes(allowed));

                    // Skip if it's in test files
                    const isTest = match.data.path.text.includes('.test.') ||
                        match.data.path.text.includes('.spec.') ||
                        match.data.path.text.includes('__tests__');

                    if (!isAllowed && !isTest) {
                        issues.push({
                            file: match.data.path.text,
                            line: match.data.line_number,
                            method: pattern,
                            context: text
                        });
                    }
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
if (issues.length > 0) {
    console.error('❌ CONSOLE STATEMENTS DETECTED:\n');

    // Group by file
    const byFile = issues.reduce((acc, issue) => {
        if (!acc[issue.file]) acc[issue.file] = [];
        acc[issue.file].push(issue);
        return acc;
    }, {} as Record<string, ConsoleIssue[]>);

    Object.entries(byFile).forEach(([file, items]) => {
        console.error(`\n📁 ${file}:`);
        items.forEach(({ line, method, context }) => {
            console.error(`  Line ${line}: ${method}`);
            console.error(`    ${context}\n`);
        });
    });

    console.error(`\n⚠️  Found ${issues.length} console statement(s) in production code.`);
    console.error('\n💡 Recommended alternatives:');
    console.error('  - For debugging: Remove before commit');
    console.error('  - For errors: Use console.error (allowed)');
    console.error('  - For warnings: Use console.warn (allowed)');
    console.error('  - For production logging: Implement proper logger\n');

    if (process.env.CI === 'true') {
        console.error('::warning::Console statements detected in production code.');
    }
} else {
    console.log('✅ No console statements detected in production code.\n');
}
