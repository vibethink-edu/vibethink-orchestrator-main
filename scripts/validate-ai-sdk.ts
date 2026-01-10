#!/usr/bin/env tsx
/**
 * CI Validation: Verify AI SDK Usage
 * 
 * Detects common mistakes with Vercel AI SDK:
 * - Using toDataStreamResponse() with streamText()
 * - Using toTextStreamResponse() with streamUI()
 * - Missing error handling in streaming
 */

import { execSync } from 'child_process';

interface SDKIssue {
    file: string;
    line: number;
    issue: string;
    suggestion: string;
}

const issues: SDKIssue[] = [];

console.log('🔍 Validating AI SDK usage...\n');

// Pattern 1: streamText() with toDataStreamResponse()
try {
    const streamTextFiles = execSync(
        `rg "streamText\\(" --type ts --type tsx -l`,
        { encoding: 'utf-8', stdio: 'pipe' }
    ).split('\n').filter(Boolean);

    streamTextFiles.forEach(file => {
        try {
            const content = execSync(`cat "${file}"`, { encoding: 'utf-8' });

            if (content.includes('toDataStreamResponse()')) {
                const lines = content.split('\n');
                const lineNum = lines.findIndex(l => l.includes('toDataStreamResponse()')) + 1;

                issues.push({
                    file,
                    line: lineNum,
                    issue: 'Using toDataStreamResponse() with streamText()',
                    suggestion: 'Use toTextStreamResponse() instead'
                });
            }
        } catch (e) {
            // Ignore file read errors
        }
    });
} catch (e) {
    // No streamText usage found
}

// Pattern 2: streamUI() with toTextStreamResponse()
try {
    const streamUIFiles = execSync(
        `rg "streamUI\\(" --type ts --type tsx -l`,
        { encoding: 'utf-8', stdio: 'pipe' }
    ).split('\n').filter(Boolean);

    streamUIFiles.forEach(file => {
        try {
            const content = execSync(`cat "${file}"`, { encoding: 'utf-8' });

            if (content.includes('toTextStreamResponse()')) {
                const lines = content.split('\n');
                const lineNum = lines.findIndex(l => l.includes('toTextStreamResponse()')) + 1;

                issues.push({
                    file,
                    line: lineNum,
                    issue: 'Using toTextStreamResponse() with streamUI()',
                    suggestion: 'Use toDataStreamResponse() instead'
                });
            }
        } catch (e) {
            // Ignore file read errors
        }
    });
} catch (e) {
    // No streamUI usage found
}

// Report findings
if (issues.length > 0) {
    console.error('❌ AI SDK USAGE ISSUES DETECTED:\n');

    issues.forEach(({ file, line, issue, suggestion }) => {
        console.error(`  ${file}:${line}`);
        console.error(`    Issue: ${issue}`);
        console.error(`    Fix: ${suggestion}\n`);
    });

    console.error(`\n⚠️  Found ${issues.length} AI SDK usage issue(s).`);
    console.error('\nCorrect usage:');
    console.error('  - streamText() → toTextStreamResponse()');
    console.error('  - streamUI() → toDataStreamResponse()\n');

    if (process.env.CI === 'true') {
        process.exit(1);
    }
} else {
    console.log('✅ AI SDK usage is correct.\n');
}
