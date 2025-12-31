const fs = require('fs');
const path = require('path');
const glob = require('glob');

const TARGET_PATTERN = 'apps/dashboard/src/lib/i18n/translations/**/*.json';
const MARKER_REGEX = /^<<<<<<<|^=======|^>>>>>>>/m;

const EVIDENCE_DIR = 'docs/ai-coordination';
const TIMESTAMP = '20251231';
const FILE_ALL = path.join(EVIDENCE_DIR, `MERGE_MARKERS_FILES_${TIMESTAMP}.txt`);
const FILE_AUTO = path.join(EVIDENCE_DIR, `MERGE_MARKERS_AUTO_CLEANED_${TIMESTAMP}.txt`);
const FILE_MANUAL = path.join(EVIDENCE_DIR, `MERGE_MARKERS_MANUAL_REQUIRED_${TIMESTAMP}.txt`);

// Utility to write list to file
function writeList(filepath, list) {
    fs.writeFileSync(filepath, list.join('\n'), 'utf8');
    console.log(`Wrote ${list.length} entries to ${filepath}`);
}

function cleanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Strict check: only process if markers exist
    if (!MARKER_REGEX.test(content)) {
        return null; // No markers found
    }

    const lines = content.split(/\r?\n/);
    const cleanLines = lines.filter(line => {
        return !line.startsWith('<<<<<<<') &&
            !line.startsWith('=======') &&
            !line.startsWith('>>>>>>>');
    });

    const cleanContent = cleanLines.join('\n');

    try {
        JSON.parse(cleanContent);
        return { success: true, content: cleanContent };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

function main() {
    console.log(`Scanning for files matching: ${TARGET_PATTERN}`);

    const files = glob.sync(TARGET_PATTERN);
    const filesWithMarkers = [];
    const autoCleaned = [];
    const manualRequired = [];

    console.log(`Found ${files.length} JSON files in target tree.`);

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (MARKER_REGEX.test(content)) {
            filesWithMarkers.push(file);

            const result = cleanFile(file);

            if (result && result.success) {
                // Write back clean content
                fs.writeFileSync(file, result.content, 'utf8');
                autoCleaned.push(file);
                console.log(`[AUTO_CLEANED] ${file}`);
            } else {
                manualRequired.push(file);
                console.error(`[MANUAL_REQUIRED] ${file} (Parse failed after marker removal)`);
            }
        }
    });

    // Generate Evidence
    if (!fs.existsSync(EVIDENCE_DIR)) {
        fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    }

    writeList(FILE_ALL, filesWithMarkers);
    writeList(FILE_AUTO, autoCleaned);
    writeList(FILE_MANUAL, manualRequired);

    console.log('\n--- SUMMARY ---');
    console.log(`Total files with markers: ${filesWithMarkers.length}`);
    console.log(`Auto-cleaned: ${autoCleaned.length}`);
    console.log(`Manual required: ${manualRequired.length}`);
}

main();
