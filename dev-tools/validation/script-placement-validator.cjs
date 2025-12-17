#!/usr/bin/env node

/**
 * Script Placement Validator
 * 
 * Validates that scripts are placed in correct locations according to
 * vibethink-dev-kit standards.
 * 
 * Standard: FILE_PLACEMENT_QUICK_REFERENCE.md
 * 
 * ✅ CORRECT Locations:
 * - scripts/
 * - dev-tools/automation/
 * - dev-tools/validation/
 * - dev-tools/utilities/
 * 
 * ❌ FORBIDDEN Locations:
 * - apps/[app]/ (scripts should NOT be in app directories)
 * - Root directory (except package.json scripts)
 * - src/
 * - docs/
 */

const fs = require('fs');
const path = require('path');

class ScriptPlacementValidator {
    constructor() {
        this.root = process.cwd();
        this.violations = [];
        this.warnings = [];
        this.success = true;
    }

    /**
     * Validate script placement across the monorepo
     */
    validate() {
        console.log('🔍 Validating script placement...\n');

        this.checkAppsDirectory();
        this.checkRootDirectory();
        this.checkSrcDirectory();
        this.checkDocsDirectory();
        this.checkCorrectLocations();

        this.printResults();
    }

    /**
     * Check for scripts in apps/ directories (FORBIDDEN)
     */
    checkAppsDirectory() {
        console.log('📂 Checking apps/ directory...');

        const appsPath = path.join(this.root, 'apps');
        if (!fs.existsSync(appsPath)) {
            console.log('   ℹ️  No apps/ directory found\n');
            return;
        }

        const apps = fs.readdirSync(appsPath);

        for (const app of apps) {
            const appPath = path.join(appsPath, app);
            const stat = fs.statSync(appPath);

            if (!stat.isDirectory()) continue;

            // Check for .ps1, .sh, .js, .cjs, .mjs files (excluding config files)
            const scripts = this.findScripts(appPath);

            if (scripts.length > 0) {
                this.violations.push({
                    type: 'FORBIDDEN_LOCATION',
                    location: `apps/${app}/`,
                    files: scripts,
                    message: `Scripts found in app directory (should be in scripts/ or dev-tools/)`
                });
                this.success = false;
            }
        }

        console.log('   ✅ Apps directory checked\n');
    }

    /**
     * Check for scripts in root directory (WARNING)
     */
    checkRootDirectory() {
        console.log('📂 Checking root directory...');

        const allowedInRoot = [
            'package.json',
            'package-lock.json',
            '.npmrc',
            '.gitignore',
            '.env',
            '.env.local',
            '.env.production'
        ];

        const files = fs.readdirSync(this.root);
        const scripts = files.filter(file => {
            const ext = path.extname(file);
            return ['.ps1', '.sh', '.js', '.cjs', '.mjs'].includes(ext) &&
                !allowedInRoot.includes(file);
        });

        if (scripts.length > 0) {
            this.warnings.push({
                type: 'ROOT_SCRIPTS',
                files: scripts,
                message: 'Scripts in root directory (consider moving to scripts/)'
            });
        }

        console.log('   ✅ Root directory checked\n');
    }

    /**
     * Check for scripts in src/ directory (FORBIDDEN)
     */
    checkSrcDirectory() {
        console.log('📂 Checking src/ directory...');

        const srcPath = path.join(this.root, 'src');
        if (!fs.existsSync(srcPath)) {
            console.log('   ℹ️  No src/ directory found\n');
            return;
        }

        const scripts = this.findScripts(srcPath, ['scripts']);

        if (scripts.length > 0) {
            this.violations.push({
                type: 'FORBIDDEN_LOCATION',
                location: 'src/',
                files: scripts,
                message: 'Scripts found in src/ directory (should be in scripts/ or dev-tools/)'
            });
            this.success = false;
        }

        console.log('   ✅ Src directory checked\n');
    }

    /**
     * Check for scripts in docs/ directory (FORBIDDEN)
     */
    checkDocsDirectory() {
        console.log('📂 Checking docs/ directory...');

        const docsPath = path.join(this.root, 'docs');
        if (!fs.existsSync(docsPath)) {
            console.log('   ℹ️  No docs/ directory found\n');
            return;
        }

        const scripts = this.findScripts(docsPath);

        if (scripts.length > 0) {
            this.violations.push({
                type: 'FORBIDDEN_LOCATION',
                location: 'docs/',
                files: scripts,
                message: 'Scripts found in docs/ directory (should be in scripts/ or dev-tools/)'
            });
            this.success = false;
        }

        console.log('   ✅ Docs directory checked\n');
    }

    /**
     * Check that correct locations exist and are used
     */
    checkCorrectLocations() {
        console.log('📂 Checking correct script locations...');

        const correctLocations = [
            'scripts',
            'dev-tools/automation',
            'dev-tools/validation',
            'dev-tools/utilities'
        ];

        let foundScripts = false;

        for (const location of correctLocations) {
            const locationPath = path.join(this.root, location);
            if (fs.existsSync(locationPath)) {
                const scripts = this.findScripts(locationPath, [], 1);
                if (scripts.length > 0) {
                    console.log(`   ✅ Found ${scripts.length} script(s) in ${location}/`);
                    foundScripts = true;
                }
            }
        }

        if (!foundScripts) {
            this.warnings.push({
                type: 'NO_SCRIPTS',
                message: 'No scripts found in standard locations'
            });
        }

        console.log('');
    }

    /**
     * Find script files in a directory
     */
    findScripts(dir, excludeDirs = [], maxDepth = 2, currentDepth = 0) {
        if (currentDepth >= maxDepth) return [];

        const scripts = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                if (!excludeDirs.includes(item) && !item.startsWith('.') && !item.startsWith('node_modules')) {
                    scripts.push(...this.findScripts(itemPath, excludeDirs, maxDepth, currentDepth + 1));
                }
            } else {
                const ext = path.extname(item);
                const isScript = ['.ps1', '.sh', '.js', '.cjs', '.mjs'].includes(ext);
                const isConfig = item.includes('.config.') ||
                    item.includes('next.config') ||
                    item.includes('tailwind.config') ||
                    item.includes('postcss.config') ||
                    item.includes('eslint.config');

                if (isScript && !isConfig) {
                    scripts.push(path.relative(this.root, itemPath));
                }
            }
        }

        return scripts;
    }

    /**
     * Print validation results
     */
    printResults() {
        console.log('═══════════════════════════════════════════════════════');
        console.log('📊 SCRIPT PLACEMENT VALIDATION RESULTS');
        console.log('═══════════════════════════════════════════════════════\n');

        if (this.violations.length === 0 && this.warnings.length === 0) {
            console.log('✅ All scripts are correctly placed!\n');
            console.log('Standard compliance: 100%');
            return;
        }

        if (this.violations.length > 0) {
            console.log('❌ VIOLATIONS FOUND:\n');
            this.violations.forEach((violation, index) => {
                console.log(`${index + 1}. ${violation.type} in ${violation.location || 'unknown'}`);
                console.log(`   Message: ${violation.message}`);
                if (violation.files && violation.files.length > 0) {
                    console.log(`   Files:`);
                    violation.files.forEach(file => {
                        console.log(`     - ${file}`);
                    });
                }
                console.log('');
            });
        }

        if (this.warnings.length > 0) {
            console.log('⚠️  WARNINGS:\n');
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. ${warning.type}`);
                console.log(`   Message: ${warning.message}`);
                if (warning.files && warning.files.length > 0) {
                    console.log(`   Files:`);
                    warning.files.forEach(file => {
                        console.log(`     - ${file}`);
                    });
                }
                console.log('');
            });
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('📚 STANDARD REFERENCE:');
        console.log('   vibethink-dev-kit/knowledge/guides/FILE_PLACEMENT_QUICK_REFERENCE.md');
        console.log('═══════════════════════════════════════════════════════\n');

        if (!this.success) {
            console.log('❌ Validation FAILED - Please fix violations above\n');
            process.exit(1);
        } else {
            console.log('✅ Validation PASSED with warnings\n');
        }
    }
}

// Run validator
const validator = new ScriptPlacementValidator();
validator.validate();
