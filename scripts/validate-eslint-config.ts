#!/usr/bin/env tsx
/**
 * CI Validation: Detect Invalid ESLint Flat Config
 * 
 * Scans for common mistakes in ESLint flat config:
 * - Using 'extends' (eslintrc syntax)
 * - Missing export default
 * - Invalid config structure
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface ConfigIssue {
    file: string;
    line: number;
    issue: string;
}

const issues: ConfigIssue[] = [];

console.log('🔍 Scanning ESLint configs for flat config violations...\n');

// Find all eslint.config.js files
function findEslintConfigs(dir: string, files: string[] = []): string[] {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            findEslintConfigs(fullPath, files);
        } else if (entry.name === 'eslint.config.js' || entry.name === 'eslint.config.mjs') {
            files.push(fullPath);
        }
    }

    return files;
}

const configFiles = findEslintConfigs(process.cwd());

configFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Check for 'extends' usage (eslintrc syntax)
        if (line.trim().startsWith('extends:')) {
            issues.push({
                file,
                line: lineNum,
                issue: "Using 'extends' in flat config (eslintrc syntax). Use array of configs instead."
            });
        }

        // Check for missing export default
        if (index === lines.length - 1 && !content.includes('export default')) {
            issues.push({
                file,
                line: 1,
                issue: "Missing 'export default' in flat config"
            });
        }
    });
});

// Report findings
if (issues.length > 0) {
    console.error('❌ ESLINT CONFIG ISSUES DETECTED:\n');

    issues.forEach(({ file, line, issue }) => {
        console.error(`  ${file}:${line}`);
        console.error(`    Issue: ${issue}\n`);
    });

    console.error(`\n⚠️  Found ${issues.length} ESLint config issue(s).`);
    console.error('Flat config does not support "extends". Use array of config objects.\n');
    console.error('Example:');
    console.error('  export default [');
    console.error('    someConfig,');
    console.error('    anotherConfig,');
    console.error('    { rules: { ... } }');
    console.error('  ];\n');

    if (process.env.CI === 'true') {
        process.exit(1);
    }
} else {
    console.log('✅ No ESLint config issues detected.\n');
}
