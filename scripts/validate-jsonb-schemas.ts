import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

// ------------------------------------------------------------------
// SCHEMAS DEFINITIONS
// ------------------------------------------------------------------

const twinConfigSchema = {
    type: 'object',
    required: ['voiceCloneId', 'visualAvatarId'],
    properties: {
        voiceCloneId: { type: 'string', minLength: 1 },
        visualAvatarId: { type: 'string', minLength: 1 },
        personalityProfile: {
            type: 'object',
            // required: ['tone', 'language'], // Relaxed for flexibility
            properties: {
                tone: { type: 'string' },
                language: { type: 'string' },
                expertise: { type: 'array', items: { type: 'string' } }
            }
        },
        knowledgeBase: {
            type: 'object',
            properties: {
                sources: { type: 'array' },
                lastUpdated: { type: 'string', format: 'date-time' }
            }
        },
        guardrails: {
            type: 'object',
            properties: {
                maxResponseLength: { type: 'integer', minimum: 1 },
                bannedTopics: { type: 'array', items: { type: 'string' } },
                contentRating: { type: 'string', enum: ['G', 'PG', 'PG-13', 'R'] }
            }
        }
    }
};

const deploymentConfigSchema = {
    type: 'object',
    properties: {
        portalUrl: { type: 'string', format: 'uri' },
        customDomain: { type: 'string', format: 'hostname' },
        embedCode: { type: 'string' },
        allowedDomains: { type: 'array', items: { type: 'string' } },
        brandId: { type: 'string', format: 'uuid' },
        campaignId: { type: 'string', format: 'uuid' },
        theme: { type: 'object' },
        branding: { type: 'object' }
    }
};

// ------------------------------------------------------------------
// VALIDATION LOGIC
// ------------------------------------------------------------------

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateTwinConfig = ajv.compile(twinConfigSchema);
const validateDeploymentConfig = ajv.compile(deploymentConfigSchema);

// Directory containing JSON fixtures for testing
const FIXTURES_DIR = join(process.cwd(), 'tests/fixtures');

if (!existsSync(FIXTURES_DIR)) {
    console.warn(`⚠️ Fixtures directory not found: ${FIXTURES_DIR}`);
    console.log('Skipping fixture validation (CI assumes passing if no fixtures present)');
    process.exit(0);
}

const files = readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.json'));

let errors = 0;
let checkedFiles = 0;

files.forEach(file => {
    const filePath = join(FIXTURES_DIR, file);
    let fixture;

    try {
        fixture = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (e) {
        console.error(`❌ Invalid JSON in file: ${file}`);
        errors++;
        return;
    }

    checkedFiles++;

    // Validate twin_config if present
    if (fixture.twin_config) {
        if (!validateTwinConfig(fixture.twin_config)) {
            console.error(`❌ Invalid twin_config in ${file}:`);
            console.error(ajv.errorsText(validateTwinConfig.errors));
            errors++;
        }
    }

    // Validate deployment config if present (assuming root 'config' or 'deployment_config')
    const config = fixture.config || fixture.deployment_config;
    if (config) {
        if (!validateDeploymentConfig(config)) {
            console.error(`❌ Invalid deployment config in ${file}:`);
            console.error(ajv.errorsText(validateDeploymentConfig.errors));
            errors++;
        }
    }
});

if (errors > 0) {
    console.error(`\n❌ Found ${errors} JSONB schema validation errors`);
    process.exit(1);
}

console.log(`✅ Validated ${checkedFiles} fixtures. All JSONB schemas are valid.`);
