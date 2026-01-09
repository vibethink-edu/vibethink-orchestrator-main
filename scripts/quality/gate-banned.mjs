
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

const BANNED_PATTERNS = [
    { regex: /as\s+any/g, name: 'as any', message: 'Explicit casting to any is forbidden.' },
    { regex: /as\s+unknown\s+as/g, name: 'as unknown as', message: 'Double casting via unknown is forbidden.' },
    { regex: /@ts-ignore/g, name: '@ts-ignore', message: '@ts-ignore is forbidden. Use @ts-expect-error with description.' },
];

const RESTRICTED_PATTERNS = [
    {
        regex: /@ts-expect-error(.*)/g,
        name: '@ts-expect-error without description',
        validator: (match, group1) => {
            if (!group1 || group1.trim().length < 5) {
                return false; // Fail if description is missing or too short
            }
            return true; // Pass
        },
        message: '@ts-expect-error must be followed by a description.'
    }
];

const INCLUDE_DIRS = ['src', 'apps', 'packages', 'tests'];
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.next', 'coverage', '.turbo', '.cache'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

let errorCount = 0;

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        // Check banned patterns
        BANNED_PATTERNS.forEach(pattern => {
            if (pattern.regex.test(line)) {
                console.error(`\x1b[31m[FAIL] ${path.relative(ROOT_DIR, filePath)}:${index + 1}\x1b[0m Found banned pattern: \x1b[33m"${pattern.name}"\x1b[0m`);
                console.error(`       ${pattern.message}`);
                console.error(`       Line: ${line.trim()}`);
                errorCount++;
            }
        });

        // Check restricted patterns
        RESTRICTED_PATTERNS.forEach(pattern => {
            let match;
            // Reset regex state just in case, though usually manual loop is safer for global state regexes
            // Here we just re-create regex to be safe or use matchAll if available, but exec works
            const regex = new RegExp(pattern.regex);
            while ((match = regex.exec(line)) !== null) {
                if (!pattern.validator(match[0], match[1])) {
                    console.error(`\x1b[31m[FAIL] ${path.relative(ROOT_DIR, filePath)}:${index + 1}\x1b[0m Invalid usage of: \x1b[33m"${pattern.name}"\x1b[0m`);
                    console.error(`       ${pattern.message}`);
                    console.error(`       Line: ${line.trim()}`);
                    errorCount++;
                }
            }
        });
    });
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (EXCLUDE_DIRS.includes(file)) return;

        if (stat.isDirectory()) {
            walk(fullPath);
        } else {
            if (EXTENSIONS.includes(path.extname(fullPath))) {
                scanFile(fullPath);
            }
        }
    });
}

console.log('\x1b[36m[Gate:Banned] Scanning for forbidden patterns...\x1b[0m');
console.log(`Scanning directories: ${INCLUDE_DIRS.join(', ')}`);

INCLUDE_DIRS.forEach(dir => {
    walk(path.join(ROOT_DIR, dir));
});

if (errorCount > 0) {
    console.error(`\n\x1b[31m[Gate:Banned] FAILED. Found ${errorCount} violations.\x1b[0m`);
    process.exit(1);
} else {
    console.log('\n\x1b[32m[Gate:Banned] PASSED. No banned patterns found.\x1b[0m');
    process.exit(0);
}
