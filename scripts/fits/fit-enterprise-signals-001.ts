/**
 * FIT-ESI-001: Enterprise Signals Integrity Gate
 * 
 * Target: packages/core/src/signals
 * Type: Static Analysis / Architecture Test
 * 
 * Enforces:
 * 1. NO Vendor Dependencies in Core (googleapis, microsoft-graph, etc.)
 * 2. Provenance Invariants (idempotency_key, adapter_id, source_ref MUST exist)
 * 3. Policy Contracts (PolicyEvaluator MUST exist)
 */

import fs from 'fs';
import path from 'path';

const CORE_SIGNALS_PATH = path.join(process.cwd(), 'packages/core/src/signals');
const FORBIDDEN_IMPORTS = [
    'googleapis',
    'microsoft-graph',
    '@azure',
    'aws-sdk',
    'slack-web-api',
    'packages/adapters/', // Core cannot depend on adapters
];

const REQUIRED_PROVENANCE_FIELDS = [
    'adapter_id',
    'adapter_version',
    'source_ref',
    'received_at',
    'idempotency_key' // Critical Invariant
];

let hasErrors = false;

function error(msg: string) {
    console.error(`❌ ALARM: ${msg}`);
    hasErrors = true;
}

function success(msg: string) {
    console.log(`✅ ${msg}`);
}

// 1. Dependency Isolation Check
function checkDependencies() {
    console.log('🔍 Checking Dependency Isolation in packages/core...');

    if (!fs.existsSync(CORE_SIGNALS_PATH)) {
        error(`Signals path not found: ${CORE_SIGNALS_PATH}`);
        return;
    }

    const files = fs.readdirSync(CORE_SIGNALS_PATH);

    files.forEach(file => {
        if (!file.endsWith('.ts')) return;

        const content = fs.readFileSync(path.join(CORE_SIGNALS_PATH, file), 'utf-8');

        FORBIDDEN_IMPORTS.forEach(forbidden => {
            // Simple regex for import ... from 'forbidden'
            if (content.includes(`from "${forbidden}"`) || content.includes(`from '${forbidden}'`)) {
                error(`File ${file} imports forbidden module '${forbidden}'`);
            }
            // Check for dynamic imports or require? strict TS usually prevents, but good to check
        });
    });

    if (!hasErrors) success('Core is free of vendor pollution.');
}

// 2. Schema Invariant Check (Provenance)
function checkSchemaInvariants() {
    console.log('🔍 Checking Schema Invariants...');

    const provenancePath = path.join(CORE_SIGNALS_PATH, 'provenance.ts');
    if (!fs.existsSync(provenancePath)) {
        error(`provenance.ts missing! Invariants cannot be verified.`);
        return;
    }

    const content = fs.readFileSync(provenancePath, 'utf-8');

    REQUIRED_PROVENANCE_FIELDS.forEach(field => {
        // Basic static check: does the string field name exist in the interface definition?
        // Matches "field:" or "field?:"
        const regex = new RegExp(`\\b${field}\\??\\s*:`, 'g');
        if (!regex.test(content)) {
            error(`Provenance Contract missing required field: '${field}'`);
        } else {
            // success(`Field '${field}' confirmed.`);
        }
    });

    // Check Policy Evaluator
    const policyPath = path.join(CORE_SIGNALS_PATH, 'policy.ts');
    if (fs.existsSync(policyPath)) {
        const policyContent = fs.readFileSync(policyPath, 'utf-8');
        if (!policyContent.includes('evaluate(event: SignalEvent): PolicyDecision')) {
            error(`PolicyEvaluator contract is missing 'evaluate(event)' method.`);
        }
    } else {
        error(`policy.ts missing! Policy-First invariant broken.`);
    }

    if (!hasErrors) success('Schema Invariants verified.');
}

// 3. Package Dependency Check
function checkForbiddenInPackageJSON() {
    console.log('🔍 Checking Dependency Governance in package.json files...');

    const ROOT_PKG = path.join(process.cwd(), 'package.json');
    const CORE_PKG = path.join(process.cwd(), 'packages/core/package.json');

    const checkFile = (filePath: string, label: string) => {
        if (!fs.existsSync(filePath)) return;
        const pkg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        FORBIDDEN_IMPORTS.forEach(forbidden => {
            // Check for EXACT matches or patterns if needed
            // filter out relative paths check for package.json
            if (forbidden === 'packages/adapters/') return;

            if (deps[forbidden]) {
                error(`${label} ('${filePath}') must not contain vendor dependency: '${forbidden}'`);
            }
        });
    };

    checkFile(ROOT_PKG, 'Root');
    checkFile(CORE_PKG, 'Core Package');

    if (!hasErrors) success('Package.json files are compliant.');
}

function run() {
    console.log('🛡️  Starting FIT-ESI-001: Enterprise Signals Integrity Gate 🛡️\n');

    try {
        checkDependencies();
        checkSchemaInvariants();
        checkForbiddenInPackageJSON();
    } catch (e) {
        error(`Script execution failed: ${e}`);
    }

    console.log('\n---------------------------------------------------');
    if (hasErrors) {
        console.error('⛔ GATE FAILED: Architecture Violations Detected.');
        process.exit(1);
    } else {
        console.log('🟢 GATE PASSED: Architecture is Sound.');
        process.exit(0);
    }
}

run();
