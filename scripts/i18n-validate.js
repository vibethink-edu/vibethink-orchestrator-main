#!/usr/bin/env node

/**
 * COMPREHENSIVE I18N QA VALIDATION SYSTEM
 * 
 * Purpose: Ensure ALL strings are translated in ALL languages
 * Validates: 100% translation coverage across all 7 languages
 * Reports: Missing translations, incomplete coverage, AI context gaps
 * 
 * Usage:
 *   npm run i18n:validate              # Validate all modules
 *   npm run i18n:validate -- --module=projects  # Validate specific module
 *   npm run i18n:validate -- --strict  # Fail on ANY missing translation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REQUIRED_LANGUAGES = ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de'];
const TRANSLATIONS_DIR = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bold: '\x1b[1m'
};

/**
 * Get all translation keys from a JSON object (nested)
 */
function getAllKeys(obj, prefix = '') {
    const keys = [];

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys.push(...getAllKeys(value, fullKey));
        } else {
            keys.push(fullKey);
        }
    }

    return keys;
}

/**
 * Load translation file
 */
function loadTranslation(lang, module) {
    const filePath = path.join(TRANSLATIONS_DIR, lang, `${module}.json`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`${colors.red}Error loading ${filePath}:${colors.reset}`, error.message);
        return null;
    }
}

/**
 * Load AI context file
 */
function loadContext(lang, module) {
    const filePath = path.join(TRANSLATIONS_DIR, lang, `${module}.context.json`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

/**
 * Validate a single module across all languages
 */
function validateModule(moduleName) {
    console.log(`\n${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}📋 Validating Module: ${moduleName}${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    const results = {
        module: moduleName,
        languages: {},
        missing: [],
        incomplete: [],
        noContext: [],
        score: 0,
        maxScore: 0
    };

    // Load English as baseline
    const enTranslations = loadTranslation('en', moduleName);

    if (!enTranslations) {
        console.log(`${colors.red}❌ English translation file not found for module: ${moduleName}${colors.reset}`);
        return results;
    }

    const baselineKeys = getAllKeys(enTranslations);
    console.log(`${colors.blue}📊 Baseline (English): ${baselineKeys.length} translation keys${colors.reset}\n`);

    // Validate each language
    for (const lang of REQUIRED_LANGUAGES) {
        const translations = loadTranslation(lang, moduleName);
        const context = loadContext(lang === 'en' ? 'en' : lang, moduleName);

        if (!translations) {
            console.log(`${colors.red}❌ ${lang.toUpperCase()}: Translation file missing${colors.reset}`);
            results.missing.push(lang);
            results.languages[lang] = { status: 'missing', coverage: 0, keys: 0 };
            continue;
        }

        const langKeys = getAllKeys(translations);
        const coverage = (langKeys.length / baselineKeys.length) * 100;

        // Find missing keys
        const missingKeys = baselineKeys.filter(key => !langKeys.includes(key));

        // Check context
        const hasContext = context !== null;
        const contextCoverage = hasContext && context.strings ?
            Object.keys(context.strings).length / baselineKeys.length * 100 : 0;

        results.languages[lang] = {
            status: coverage === 100 ? 'complete' : 'incomplete',
            coverage: Math.round(coverage * 10) / 10,
            keys: langKeys.length,
            missingKeys,
            hasContext,
            contextCoverage: Math.round(contextCoverage * 10) / 10
        };

        // Report
        const statusIcon = coverage === 100 ? '✅' : coverage >= 90 ? '🟡' : '❌';
        const contextIcon = hasContext ? '📝' : '⚠️';

        console.log(`${statusIcon} ${lang.toUpperCase()}: ${langKeys.length}/${baselineKeys.length} keys (${Math.round(coverage)}% coverage)`);
        console.log(`   ${contextIcon} AI Context: ${hasContext ? `${Math.round(contextCoverage)}% documented` : 'Missing'}`);

        if (missingKeys.length > 0 && missingKeys.length <= 5) {
            console.log(`   ${colors.yellow}Missing: ${missingKeys.join(', ')}${colors.reset}`);
        } else if (missingKeys.length > 5) {
            console.log(`   ${colors.yellow}Missing: ${missingKeys.slice(0, 3).join(', ')} ... (+${missingKeys.length - 3} more)${colors.reset}`);
        }

        if (!hasContext && lang === 'en') {
            results.noContext.push(lang);
        }

        if (coverage < 100) {
            results.incomplete.push(lang);
        }

        console.log('');
    }

    // Calculate overall score
    const totalKeys = baselineKeys.length * REQUIRED_LANGUAGES.length;
    const translatedKeys = Object.values(results.languages)
        .reduce((sum, lang) => sum + (lang.keys || 0), 0);

    results.score = Math.round((translatedKeys / totalKeys) * 100);
    results.maxScore = 100;

    // Summary
    console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bold}📊 SUMMARY${colors.reset}\n`);
    console.log(`Overall Score: ${results.score}% (${translatedKeys}/${totalKeys} keys)`);
    console.log(`Missing Languages: ${results.missing.length > 0 ? results.missing.join(', ') : 'None'}`);
    console.log(`Incomplete Languages: ${results.incomplete.length > 0 ? results.incomplete.join(', ') : 'None'}`);
    console.log(`Missing AI Context: ${results.noContext.length > 0 ? 'Yes (English)' : 'No'}`);

    const status = results.score === 100 && results.noContext.length === 0 ?
        `${colors.green}✅ PRODUCTION READY${colors.reset}` :
        results.score >= 90 ?
            `${colors.yellow}🟡 NEEDS IMPROVEMENT${colors.reset}` :
            `${colors.red}❌ NOT READY${colors.reset}`;

    console.log(`\nStatus: ${status}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    return results;
}

/**
 * Get all modules
 */
function getAllModules() {
    const enDir = path.join(TRANSLATIONS_DIR, 'en');

    if (!fs.existsSync(enDir)) {
        console.error(`${colors.red}Error: Translations directory not found: ${enDir}${colors.reset}`);
        return [];
    }

    const files = fs.readdirSync(enDir);
    return files
        .filter(file => file.endsWith('.json') && !file.endsWith('.context.json'))
        .map(file => file.replace('.json', ''));
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const moduleArg = args.find(arg => arg.startsWith('--module='));
    const strictMode = args.includes('--strict');

    console.log(`${colors.bold}${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bold}${colors.magenta}🌍 COMPREHENSIVE I18N QA VALIDATION${colors.reset}`);
    console.log(`${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}Required Languages: ${REQUIRED_LANGUAGES.join(', ')}${colors.reset}`);
    console.log(`${colors.blue}Strict Mode: ${strictMode ? 'ON' : 'OFF'}${colors.reset}`);

    let modules;

    if (moduleArg) {
        const moduleName = moduleArg.split('=')[1];
        modules = [moduleName];
        console.log(`${colors.blue}Target Module: ${moduleName}${colors.reset}`);
    } else {
        modules = getAllModules();
        console.log(`${colors.blue}Target: All modules (${modules.length})${colors.reset}`);
    }

    const allResults = [];

    for (const module of modules) {
        const result = validateModule(module);
        allResults.push(result);
    }

    // Overall summary
    if (modules.length > 1) {
        console.log(`\n${colors.bold}${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.bold}${colors.magenta}📊 OVERALL SUMMARY (${modules.length} modules)${colors.reset}`);
        console.log(`${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

        const avgScore = Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length);
        const totalMissing = allResults.reduce((sum, r) => sum + r.missing.length, 0);
        const totalIncomplete = allResults.reduce((sum, r) => sum + r.incomplete.length, 0);
        const totalNoContext = allResults.reduce((sum, r) => sum + r.noContext.length, 0);

        console.log(`Average Score: ${avgScore}%`);
        console.log(`Modules with Missing Languages: ${totalMissing}`);
        console.log(`Modules with Incomplete Languages: ${totalIncomplete}`);
        console.log(`Modules without AI Context: ${totalNoContext}`);

        const overallStatus = avgScore === 100 && totalNoContext === 0 ?
            `${colors.green}✅ ALL MODULES PRODUCTION READY${colors.reset}` :
            avgScore >= 90 ?
                `${colors.yellow}🟡 SOME MODULES NEED IMPROVEMENT${colors.reset}` :
                `${colors.red}❌ CRITICAL ISSUES FOUND${colors.reset}`;

        console.log(`\nOverall Status: ${overallStatus}`);
        console.log(`${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    }

    // Exit code
    const hasIssues = allResults.some(r =>
        r.score < 100 || r.missing.length > 0 || r.noContext.length > 0
    );

    if (strictMode && hasIssues) {
        console.log(`${colors.red}${colors.bold}❌ VALIDATION FAILED (Strict Mode)${colors.reset}\n`);
        process.exit(1);
    }

    process.exit(0);
}

main();
