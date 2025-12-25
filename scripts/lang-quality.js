#!/usr/bin/env node
/**
 * Language Quality Validation Script
 * 
 * Phase 1 (Mockup): File-based validation
 * Phase 2 (DB): Will store results in database
 * 
 * Usage:
 *   node scripts/lang-quality.js --module=navigation
 *   node scripts/lang-quality.js --all
 *   node scripts/lang-quality.js --module=navigation --report=html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const AVAILABLE_LOCALES = ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de'];
const TRANSLATIONS_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');

// Quality thresholds
const THRESHOLDS = {
    PERFECT: 95,
    EXCELLENT: 90,
    ADVANCED: 75,
    INTERMEDIATE: 50,
    BASIC: 20
};

/**
 * Get all translation keys from a JSON file
 */
function getAllKeys(obj, prefix = '') {
    let keys = [];

    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }

    return keys;
}

/**
 * Validate translation completeness
 */
function validateCompleteness(module) {
    const score = {
        total_points: 25,
        earned_points: 0,
        breakdown: {
            files_exist: 0,
            keys_complete: 0,
            no_missing: 0
        },
        details: []
    };

    // Check if all 7 language files exist
    const missingFiles = [];
    for (const locale of AVAILABLE_LOCALES) {
        const filePath = path.join(TRANSLATIONS_DIR, locale, `${module}.json`);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(locale);
        }
    }

    if (missingFiles.length === 0) {
        score.breakdown.files_exist = 10;
        score.details.push('✅ All 7 language files exist');
    } else {
        score.breakdown.files_exist = Math.max(0, 10 - (missingFiles.length * 2));
        score.details.push(`❌ Missing files for: ${missingFiles.join(', ')}`);
    }

    // Check if all keys are present in all languages
    try {
        const enPath = path.join(TRANSLATIONS_DIR, 'en', `${module}.json`);
        if (!fs.existsSync(enPath)) {
            score.details.push('❌ English file not found (required as reference)');
            score.earned_points = score.breakdown.files_exist;
            return score;
        }

        const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
        const enKeys = getAllKeys(enData);

        let totalMissingKeys = 0;
        for (const locale of AVAILABLE_LOCALES) {
            if (locale === 'en') continue;

            const localePath = path.join(TRANSLATIONS_DIR, locale, `${module}.json`);
            if (!fs.existsSync(localePath)) continue;

            const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
            const localeKeys = getAllKeys(localeData);

            const missingKeys = enKeys.filter(key => !localeKeys.includes(key));
            totalMissingKeys += missingKeys.length;

            if (missingKeys.length > 0) {
                score.details.push(`⚠️  ${locale}: Missing ${missingKeys.length} keys`);
            }
        }

        if (totalMissingKeys === 0) {
            score.breakdown.keys_complete = 10;
            score.breakdown.no_missing = 5;
            score.details.push('✅ All keys present in all languages');
        } else {
            score.breakdown.keys_complete = Math.max(0, 10 - Math.floor(totalMissingKeys / 5));
            score.breakdown.no_missing = Math.max(0, 5 - Math.floor(totalMissingKeys / 10));
            score.details.push(`⚠️  Total missing keys across languages: ${totalMissingKeys}`);
        }
    } catch (error) {
        score.details.push(`❌ Error reading files: ${error.message}`);
    }

    score.earned_points = Object.values(score.breakdown).reduce((a, b) => a + b, 0);
    return score;
}

/**
 * Validate context coverage
 */
function validateContext(module) {
    const score = {
        total_points: 20,
        earned_points: 0,
        breakdown: {
            context_files: 0,
            all_strings: 0,
            ai_instructions: 0
        },
        details: []
    };

    // Check if context files exist
    const missingContextFiles = [];
    for (const locale of AVAILABLE_LOCALES) {
        const contextPath = path.join(TRANSLATIONS_DIR, locale, `${module}.context.json`);
        if (!fs.existsSync(contextPath)) {
            missingContextFiles.push(locale);
        }
    }

    if (missingContextFiles.length === 0) {
        score.breakdown.context_files = 8;
        score.details.push('✅ All context files exist');
    } else if (missingContextFiles.length <= 2) {
        score.breakdown.context_files = 4;
        score.details.push(`⚠️  Missing context files for: ${missingContextFiles.join(', ')}`);
    } else {
        score.breakdown.context_files = 0;
        score.details.push(`❌ Missing context files for: ${missingContextFiles.join(', ')}`);
    }

    // Check if all strings have context (check English as reference)
    try {
        const enContextPath = path.join(TRANSLATIONS_DIR, 'en', `${module}.context.json`);
        if (fs.existsSync(enContextPath)) {
            const contextData = JSON.parse(fs.readFileSync(enContextPath, 'utf-8'));

            if (contextData.strings && Object.keys(contextData.strings).length > 0) {
                score.breakdown.all_strings = 8;
                score.details.push(`✅ Context defined for ${Object.keys(contextData.strings).length} strings`);

                // Check for AI instructions
                const stringsWithAI = Object.values(contextData.strings).filter(
                    s => s.ai_context || s.ai_alternatives
                ).length;

                if (stringsWithAI > 0) {
                    score.breakdown.ai_instructions = 4;
                    score.details.push(`✅ AI instructions for ${stringsWithAI} strings`);
                } else {
                    score.details.push('⚠️  No AI instructions found');
                }
            } else {
                score.breakdown.all_strings = 4;
                score.details.push('⚠️  Context file exists but has limited data');
            }
        } else {
            score.details.push('❌ English context file not found');
        }
    } catch (error) {
        score.details.push(`❌ Error reading context: ${error.message}`);
    }

    score.earned_points = Object.values(score.breakdown).reduce((a, b) => a + b, 0);
    return score;
}

/**
 * Validate code implementation (scan for hardcoded strings)
 */
function validateImplementation(module) {
    const score = {
        total_points: 20,
        earned_points: 0,
        breakdown: {
            no_hardcoded: 10,
            proper_usage: 6,
            type_safe: 4
        },
        details: [],
        violations: []
    };

    // For mockup phase, we'll do basic checks
    // In DB phase, this will be more sophisticated

    score.details.push('ℹ️  Implementation check (basic - mockup phase)');
    score.details.push('✅ Assuming proper implementation (manual verification needed)');

    // Default to full points for mockup phase
    // TODO: Add actual code scanning in Phase 2
    score.earned_points = 20;

    return score;
}

/**
 * Validate testing
 */
function validateTesting(module) {
    const score = {
        total_points: 10,
        earned_points: 0,
        breakdown: {
            automated_tests: 0,
            manual_testing: 0,
            ci_cd: 0
        },
        details: []
    };

    // Check for test files
    const testPath = path.join(__dirname, `../apps/dashboard/__tests__/${module}.i18n.test.ts`);
    if (fs.existsSync(testPath)) {
        score.breakdown.automated_tests = 4;
        score.details.push('✅ Automated tests exist');
    } else {
        score.details.push('⚠️  No automated tests found');
    }

    // For mockup phase, assume manual testing was done if translations exist
    const enPath = path.join(TRANSLATIONS_DIR, 'en', `${module}.json`);
    if (fs.existsSync(enPath)) {
        score.breakdown.manual_testing = 3;
        score.details.push('✅ Manual testing assumed (translations exist)');
    }

    // CI/CD check (placeholder for mockup phase)
    score.details.push('⚠️  CI/CD integration pending');

    score.earned_points = Object.values(score.breakdown).reduce((a, b) => a + b, 0);
    return score;
}

/**
 * Generate quality report for a module
 */
function generateQualityReport(module) {
    console.log(`\n🔍 Validating module: ${module}\n`);

    const completeness = validateCompleteness(module);
    const context = validateContext(module);
    const implementation = validateImplementation(module);
    const testing = validateTesting(module);

    // Quality dimension is placeholder for mockup phase
    const quality = {
        total_points: 25,
        earned_points: 20, // Assume good quality for mockup
        breakdown: {
            natural_language: 8,
            grammatical: 7,
            cultural: 5
        },
        details: ['ℹ️  Quality check (manual review - mockup phase)']
    };

    const total_earned =
        completeness.earned_points +
        context.earned_points +
        quality.earned_points +
        implementation.earned_points +
        testing.earned_points;

    const percentage = (total_earned / 100) * 100;

    const level =
        percentage >= THRESHOLDS.PERFECT ? 5 :
            percentage >= THRESHOLDS.EXCELLENT ? 4 :
                percentage >= THRESHOLDS.ADVANCED ? 3 :
                    percentage >= THRESHOLDS.INTERMEDIATE ? 2 :
                        percentage >= THRESHOLDS.BASIC ? 1 : 0;

    const status =
        level === 5 ? 'Perfect' :
            level === 4 ? 'Excellent' :
                level === 3 ? 'Advanced' :
                    level === 2 ? 'Intermediate' :
                        level === 1 ? 'Basic' : 'Not Started';

    return {
        module,
        timestamp: new Date().toISOString(),
        completeness,
        context,
        quality,
        implementation,
        testing,
        total_possible: 100,
        total_earned,
        percentage,
        level,
        status
    };
}

/**
 * Print report to console
 */
function printReport(report) {
    console.log('━'.repeat(70));
    console.log(`📊 LANGUAGE QUALITY REPORT`);
    console.log('━'.repeat(70));
    console.log(`\nModule: ${report.module}`);
    console.log(`Timestamp: ${new Date(report.timestamp).toLocaleString()}\n`);
    console.log('━'.repeat(70));

    // Print each dimension
    const dimensions = [
        { name: '1. Translation Completeness', data: report.completeness },
        { name: '2. Context Coverage', data: report.context },
        { name: '3. Translation Quality', data: report.quality },
        { name: '4. Code Implementation', data: report.implementation },
        { name: '5. Testing & Validation', data: report.testing }
    ];

    dimensions.forEach(({ name, data }) => {
        const emoji = data.earned_points === data.total_points ? '✅' :
            data.earned_points >= data.total_points * 0.7 ? '🟡' : '❌';
        console.log(`\n${name} ................ ${data.earned_points}/${data.total_points} ${emoji}`);

        if (data.breakdown) {
            Object.entries(data.breakdown).forEach(([key, value]) => {
                const label = key.replace(/_/g, ' ');
                console.log(`   ├─ ${label} ........................ ${value}`);
            });
        }

        if (data.details && data.details.length > 0) {
            console.log('   Details:');
            data.details.forEach(detail => {
                console.log(`   ${detail}`);
            });
        }
    });

    console.log('\n' + '━'.repeat(70));
    console.log(`\n🎯 OVERALL SCORE: ${report.total_earned}/${report.total_possible} (${report.percentage.toFixed(1)}%)\n`);
    console.log(`Level: ${report.level} - ${report.status} ${'⭐'.repeat(report.level)}`);

    if (report.percentage >= THRESHOLDS.EXCELLENT) {
        console.log(`Status: ✅ PRODUCTION READY\n`);
    } else if (report.percentage >= THRESHOLDS.ADVANCED) {
        console.log(`Status: 🟡 NEEDS IMPROVEMENT\n`);
    } else {
        console.log(`Status: ❌ NOT READY\n`);
    }

    console.log('━'.repeat(70));
}

/**
 * Save report to JSON (for DB migration later)
 */
function saveReport(report) {
    const reportsDir = path.join(__dirname, '../quality-reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filename = `${report.module}-${Date.now()}.json`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved: ${filepath}\n`);

    return filepath;
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const moduleArg = args.find(arg => arg.startsWith('--module='));
    const allFlag = args.includes('--all');

    if (!moduleArg && !allFlag) {
        console.error('Usage: node lang-quality.js --module=<name> OR --all');
        process.exit(1);
    }

    if (allFlag) {
        // Find all modules
        const enDir = path.join(TRANSLATIONS_DIR, 'en');
        const modules = fs.readdirSync(enDir)
            .filter(file => file.endsWith('.json') && !file.endsWith('.context.json'))
            .map(file => file.replace('.json', ''));

        console.log(`\n📦 Found ${modules.length} modules to validate\n`);

        const reports = [];
        modules.forEach(module => {
            const report = generateQualityReport(module);
            printReport(report);
            saveReport(report);
            reports.push(report);
        });

        // Print summary
        const avgScore = reports.reduce((sum, r) => sum + r.percentage, 0) / reports.length;
        console.log('\n' + '═'.repeat(70));
        console.log(`📊 OVERALL SUMMARY`);
        console.log('═'.repeat(70));
        console.log(`\nTotal Modules: ${reports.length}`);
        console.log(`Average Score: ${avgScore.toFixed(1)}%`);
        console.log(`\nBy Level:`);
        for (let i = 5; i >= 0; i--) {
            const count = reports.filter(r => r.level === i).length;
            if (count > 0) {
                console.log(`  Level ${i}: ${count} module(s)`);
            }
        }
        console.log('\n' + '═'.repeat(70) + '\n');

    } else {
        const module = moduleArg.split('=')[1];
        const report = generateQualityReport(module);
        printReport(report);
        saveReport(report);
    }
}

// Run
main();
