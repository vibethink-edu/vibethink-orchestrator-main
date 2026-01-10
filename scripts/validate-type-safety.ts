#!/usr/bin/env tsx
/**
 * CI Validation: Detect Unsafe Type Assertions
 * 
 * CodeRabbit commonly reports:
 * - "Type assertion without runtime validation"
 * - "as any" usage
 * - "as unknown as" double assertions
 * 
 * This script detects these patterns and suggests safer alternatives.
 */

import { execSync } from 'child_process';

interface TypeAssertionIssue {
    file: string;
    line: number;
    pattern: string;
    issue: string;
    suggestion: string;
}

const issues: TypeAssertionIssue[] = [];

console.log('🔍 Scanning for unsafe type assertions...\n');

// Pattern 1: "as any"
try {
    const result = execSync(
        `rg " as any" --type ts --type tsx -n --json`,
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
                    pattern: match.data.lines.text.trim(),
                    issue: 'Using "as any" bypasses type safety',
                    suggestion: 'Use proper typing or "unknown" with type guards'
                });
            }
        } catch (e) {
            // Ignore parse errors
        }
    });
} catch (e) {
    // Pattern not found (good!)
}

// Pattern 2: "as unknown as"
try {
    const result = execSync(
        `rg " as unknown as " --type ts --type tsx -n --json`,
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
                    pattern: match.data.lines.text.trim(),
                    issue: 'Double type assertion without runtime validation',
                    suggestion: 'Add runtime type guard or use proper interface'
                });
            }
        } catch (e) {
            // Ignore parse errors
        }
    });
} catch (e) {
    // Pattern not found (good!)
}

// Pattern 3: Non-null assertion (!)
try {
    const result = execSync(
        `rg "![.;,)]" --type ts --type tsx -n --json`,
        { encoding: 'utf-8', stdio: 'pipe' }
    );

    const lines = result.split('\n').filter(Boolean);

    lines.forEach(line => {
        try {
            const match = JSON.parse(line);
            if (match.type === 'match') {
                const text = match.data.lines.text.trim();
                // Filter out false positives (e.g., !== or !)
                if (!text.includes('!==') && !text.includes('!=')) {
                    issues.push({
                        file: match.data.path.text,
                        line: match.data.line_number,
                        pattern: text,
                        issue: 'Non-null assertion (!) without runtime check',
                        suggestion: 'Use optional chaining (?.) or explicit null check'
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

// Report findings
if (issues.length > 0) {
    console.error('❌ UNSAFE TYPE ASSERTIONS DETECTED:\n');

    // Group by issue type
    const byType = issues.reduce((acc, issue) => {
        if (!acc[issue.issue]) acc[issue.issue] = [];
        acc[issue.issue].push(issue);
        return acc;
    }, {} as Record<string, TypeAssertionIssue[]>);

    Object.entries(byType).forEach(([issueType, items]) => {
        console.error(`\n📌 ${issueType}:`);
        items.slice(0, 5).forEach(({ file, line, pattern }) => {
            console.error(`  ${file}:${line}`);
            console.error(`    ${pattern}\n`);
        });
        if (items.length > 5) {
            console.error(`  ... and ${items.length - 5} more\n`);
        }
    });

    console.error(`\n⚠️  Found ${issues.length} unsafe type assertion(s).`);
    console.error('\n💡 Safer alternatives:');
    console.error('  - Instead of: data as MyType');
    console.error('    Use: function isMyType(data: unknown): data is MyType { ... }');
    console.error('  - Instead of: value!');
    console.error('    Use: value ?? defaultValue or if (value) { ... }');
    console.error('  - Instead of: x as any');
    console.error('    Use: x as unknown, then narrow with type guard\n');

    if (process.env.CI === 'true') {
        // Don't fail CI, just warn
        console.error('::warning::Unsafe type assertions detected. Review recommended.');
    }
} else {
    console.log('✅ No unsafe type assertions detected.\n');
}
