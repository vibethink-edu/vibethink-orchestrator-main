import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EXCLUDES = [
    'node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.turbo', 'out', 'vendor', 'tmp',
    '.cursor', '_legacy', 'packages/cli/src/validation', 'docusaurus-dev'
];

function shouldScan(filePath) {
    const relativePath = path.relative(rootDir, filePath);
    // Normalize to forward slashes for comparison
    const normalizedPath = relativePath.split(path.sep).join('/');

    if (EXCLUDES.some(ex => {
        // Exact match or directory prefix match
        return normalizedPath === ex || normalizedPath.startsWith(ex + '/');
    })) {
        return false;
    }
    return path.extname(filePath) === '.json';
}

function scanDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!EXCLUDES.includes(file)) {
                results = results.concat(scanDir(filePath));
            }
        } else {
            if (shouldScan(filePath)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

// Simple regex to strip comments from JSONC (like tsconfig.json)
function stripJsonComments(json) {
    return json.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
}

// Files known to allow comments (tsconfig, vscode settings, etc)
function isJsonWithComments(filePath) {
    const filename = path.basename(filePath);
    return filename.startsWith('tsconfig') ||
        filename.startsWith('.eslintrc') ||
        filename === 'settings.json' ||
        filename === 'launch.json' ||
        filename === 'turbo.json'; // turbo.json sometimes has comments
}

console.log('🔍 Scanning specific directories for valid JSON...');

const files = scanDir(rootDir);
let hasError = false;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // Attempt cleanup if it's a config file
        if (isJsonWithComments(file)) {
            content = stripJsonComments(content);
        }

        try {
            JSON.parse(content);
        } catch (parseError) {
            console.error(`❌ Invalid JSON in ${path.relative(rootDir, file)}`);
            // Try to give a helpful snippet
            const match = parseError.message.match(/at position (\d+)/);
            if (match) {
                const pos = parseInt(match[1], 10);
                const start = Math.max(0, pos - 20);
                const end = Math.min(content.length, pos + 20);
                console.error(`   Error context: ...${content.substring(start, end).replace(/\n/g, '\\n')}...`);
            }
            console.error(`   Details: ${parseError.message}`);
            hasError = true;
        }
    } catch (err) {
        console.error(`Error reading file ${file}:`, err);
        hasError = true;
    }
});

if (hasError) {
    console.error('\n💥 FAILED: Invalid JSON files detected. This breaks the build.');
    process.exit(1);
} else {
    console.log(`✅ PASSED: ${files.length} JSON files validated successfully.`);
    process.exit(0);
}
