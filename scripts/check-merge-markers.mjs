import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EXCLUDES = [
    'node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.turbo', 'out', 'vendor', 'tmp'
];

const EXTENSIONS = ['.json', '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '.md', '.yml', '.yaml'];

function shouldScan(filePath) {
    const relativePath = path.relative(rootDir, filePath);
    if (EXCLUDES.some(ex => relativePath.split(path.sep).includes(ex))) {
        return false;
    }
    return EXTENSIONS.includes(path.extname(filePath));
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

console.log('?? Scanning for merge markers (<<<<<<<, =======, >>>>>>>)...');

const files = scanDir(rootDir);
let hasError = false;

const MARKER_REGEXES = [
    /^<<<<<<<.*/,
    /^=======$/,
    /^>>>>>>>.*/
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        let fileHasError = false;

        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (file === __filename) return;
            for (const regex of MARKER_REGEXES) {
                if (regex.test(line)) {
                    console.error(`? Merge marker found in ${path.relative(rootDir, file)}:${index + 1}`);
                    console.error(`   ${line.trim()}`);
                    fileHasError = true;
                    break;
                }
            }
        });

        if (fileHasError) {
            hasError = true;
        }
    } catch (err) {
        console.error(`Error reading file ${file}:`, err);
    }
});

if (hasError) {
    console.error('\n?? FAILED: Merge markers detected. Please resolve conflicts before committing.');
    process.exit(1);
} else {
    console.log('? PASSED: No merge markers found.');
    process.exit(0);
}
