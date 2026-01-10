import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../../');
const docsSrcDir = path.join(rootDir, 'docs');
const targetBaseDir = path.resolve(__dirname, '../src/content/docs');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyFile(srcAbsolute, destRelative) {
    const dest = path.join(targetBaseDir, destRelative);
    ensureDir(path.dirname(dest));

    if (fs.existsSync(srcAbsolute)) {
        const content = fs.readFileSync(srcAbsolute, 'utf-8');
        // Optional: Add frontmatter if missing, but Starlight handles md well.
        fs.writeFileSync(dest, content);
        console.log(`✅ Copied: ${path.basename(srcAbsolute)} -> ${destRelative}`);
    } else {
        console.warn(`⚠️  Missing: ${srcAbsolute}`);
    }
}

console.log('🔄 Syncing Canonical Docs to Starlight...');

// Define sources
const sources = {
    system: path.join(docsSrcDir, 'DOCS_SYSTEM.md'),
    governance: path.join(docsSrcDir, 'DOCS_GOVERNANCE.md'),
    changelogRoot: path.join(rootDir, 'CHANGELOG.md'),
    apiChangelog: path.join(docsSrcDir, 'api/CHANGELOG.md'),
    apiVersion: path.join(docsSrcDir, 'api/VERSIONING.md'),
    opsReleases: path.join(docsSrcDir, 'operations/RELEASES.md'),
};

// Execute Copies with mapped destinations
copyFile(sources.system, 'system/documentation-system.md');
copyFile(sources.governance, 'system/governance.md');
copyFile(sources.changelogRoot, 'product/changelog.md');
copyFile(sources.apiChangelog, 'api/changelog.md');
copyFile(sources.apiVersion, 'api/versioning.md');
copyFile(sources.opsReleases, 'operations/releases.md');

// Sync specific API Key docs
copyFile(
    path.join(docsSrcDir, 'standards/API_KEY_MANAGEMENT.md'),
    'standards/api-key-management.md'
);
copyFile(
    path.join(docsSrcDir, 'fits/FIT-API-KEY-MGMT-001-Phase-1.md'),
    'fits/fit-api-key-mgmt-001.md'
);

// SYNC API SPECS (For Swagger UI)
// Copy openapi.yaml to public/ so it can be fetched by the UI
const publicApiDir = path.resolve(__dirname, '../public/api');
ensureDir(publicApiDir);

const specSource = path.join(docsSrcDir, 'api/v1/openapi.yaml');
const specDest = path.join(publicApiDir, 'openapi.yaml');

if (fs.existsSync(specSource)) {
    fs.copyFileSync(specSource, specDest);
    console.log(`✅ Copied API Spec: api/v1/openapi.yaml -> public/api/openapi.yaml`);
} else {
    console.warn(`⚠️ Missing API Spec: ${specSource}`);
}

console.log('✨ Sync Complete.');
