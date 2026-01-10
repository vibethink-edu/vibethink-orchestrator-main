#!/usr/bin/env tsx
/**
 * CI Validation: Multi-Tenancy Safety Checks
 * 
 * Validates that scripts handling tenant data have proper isolation:
 * - company_id validation
 * - Tenant-specific filtering
 * - No cross-tenant queries
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

interface MultiTenancyIssue {
    file: string;
    line: number;
    issue: string;
    severity: 'error' | 'warning';
}

const issues: MultiTenancyIssue[] = [];

console.log('🔍 Scanning for multi-tenancy safety issues...\n');

// Find scripts that query conversations or other tenant-specific tables
const tenantTables = ['conversations', 'users', 'projects', 'documents'];

tenantTables.forEach(table => {
    try {
        const result = execSync(
            `rg "FROM ${table}|UPDATE ${table}|DELETE FROM ${table}" scripts/ --type ts -l`,
            { encoding: 'utf-8', stdio: 'pipe' }
        );

        const files = result.split('\n').filter(Boolean);

        files.forEach(file => {
            const content = readFileSync(file, 'utf-8');
            const lines = content.split('\n');

            // Check for company_id validation
            const hasCompanyIdValidation = content.includes('company_id') &&
                (content.includes('validateCompanyId') ||
                    content.includes('WHERE company_id'));

            // Check for COMPANY_ID env var support
            const hasEnvVarSupport = content.includes('process.env.COMPANY_ID') ||
                content.includes('COMPANY_ID');

            if (!hasCompanyIdValidation) {
                issues.push({
                    file,
                    line: 1,
                    issue: `Script queries ${table} without company_id filtering`,
                    severity: 'error'
                });
            }

            if (!hasEnvVarSupport) {
                issues.push({
                    file,
                    line: 1,
                    issue: `Script doesn't support COMPANY_ID environment variable for single-tenant execution`,
                    severity: 'warning'
                });
            }

            // Check for dangerous queries (no WHERE clause)
            lines.forEach((line, index) => {
                const trimmed = line.trim();

                // Detect UPDATE/DELETE without WHERE
                if ((trimmed.includes(`UPDATE ${table}`) || trimmed.includes(`DELETE FROM ${table}`)) &&
                    !trimmed.includes('WHERE')) {
                    // Check next few lines for WHERE clause
                    const nextLines = lines.slice(index, index + 5).join(' ');
                    if (!nextLines.includes('WHERE')) {
                        issues.push({
                            file,
                            line: index + 1,
                            issue: `Dangerous query without WHERE clause on ${table}`,
                            severity: 'error'
                        });
                    }
                }
            });
        });
    } catch (e) {
        // Table not referenced (good!)
    }
});

// Report findings
if (issues.length > 0) {
    console.error('❌ MULTI-TENANCY SAFETY ISSUES DETECTED:\n');

    // Group by severity
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    if (errors.length > 0) {
        console.error('🔴 ERRORS:');
        errors.forEach(({ file, line, issue }) => {
            console.error(`  ${file}:${line}`);
            console.error(`    ${issue}\n`);
        });
    }

    if (warnings.length > 0) {
        console.error('🟡 WARNINGS:');
        warnings.forEach(({ file, line, issue }) => {
            console.error(`  ${file}:${line}`);
            console.error(`    ${issue}\n`);
        });
    }

    console.error(`\n⚠️  Found ${errors.length} error(s) and ${warnings.length} warning(s).`);
    console.error('\n💡 Multi-tenancy best practices:');
    console.error('  1. Always filter by company_id in queries');
    console.error('  2. Support COMPANY_ID env var for single-tenant execution');
    console.error('  3. Validate company_id exists before processing');
    console.error('  4. Never use UPDATE/DELETE without WHERE clause');
    console.error('  5. Add DRY_RUN mode for safe testing\n');

    if (process.env.CI === 'true' && errors.length > 0) {
        process.exit(1);
    }
} else {
    console.log('✅ No multi-tenancy safety issues detected.\n');
}
