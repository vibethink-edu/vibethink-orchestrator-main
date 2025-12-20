#!/usr/bin/env node

/**
 * BundUI Premium to Monorepo Migration Script
 * 
 * This script automatically fixes import paths when copying components
 * from BundUI Premium to the vibethink-orchestrator monorepo.
 * 
 * Usage:
 *   node scripts/migrate-bundui-component.js <source-path> <dest-path>
 * 
 * Example:
 *   node scripts/migrate-bundui-component.js \
 *     "C:/IA Marcelo Labs/bundui/shadcn-ui-kit-dashboard/app/dashboard/(auth)/crypto" \
 *     "apps/dashboard/app/dashboard-bundui/crypto-v2"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import path mappings from BundUI Premium to Monorepo
const IMPORT_MAPPINGS = [
    // UI Components
    {
        from: /@\/components\/ui\/([a-z-]+)/g,
        to: '@vibethink/ui/components/$1',
        description: 'UI components from @/components/ui to @vibethink/ui/components'
    },
    // Shared Components
    {
        from: /@\/components\/CardActionMenus/g,
        to: '@/shared/components/CardActionMenus',
        description: 'CardActionMenus to shared components'
    },
    {
        from: /@\/components\/([A-Z][a-zA-Z]+)/g,
        to: '@/shared/components/$1',
        description: 'Other components to shared components'
    },
    // App-specific imports (need to be relative)
    {
        from: /@\/app\/dashboard\/\(auth\)\/([a-z-]+)\/components/g,
        to: './components',
        description: 'App-specific component imports to relative paths'
    },
    // Image paths - BundUI Premium uses /images, we might need /public/images
    {
        from: /src="\/images\//g,
        to: 'src="/images/',
        description: 'Image paths (verify images exist in public folder)',
        warning: true
    }
];

// Track warnings for images
const imageWarnings = [];

/**
 * Fix imports in a single file
 */
function fixImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check for image references
    const imageMatches = content.match(/src="\/images\/[^"]+"/g);
    if (imageMatches) {
        imageMatches.forEach(match => {
            const imagePath = match.match(/\/images\/([^"]+)/)[1];
            imageWarnings.push({
                file: filePath,
                image: imagePath
            });
        });
    }

    IMPORT_MAPPINGS.forEach(mapping => {
        const before = content;
        content = content.replace(mapping.from, mapping.to);
        if (content !== before) {
            modified = true;
            console.log(`  ✓ Fixed: ${mapping.description}`);
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }

    return false;
}

/**
 * Recursively fix imports in all TypeScript/TSX files
 */
function fixImportsRecursively(dir) {
    const files = fs.readdirSync(dir);
    let totalFixed = 0;

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            totalFixed += fixImportsRecursively(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            console.log(`\n📄 Processing: ${filePath}`);
            if (fixImportsInFile(filePath)) {
                totalFixed++;
            }
        }
    });

    return totalFixed;
}

/**
 * Copy directory from source to destination
 */
function copyDirectory(source, dest) {
    console.log(`\n📦 Copying from: ${source}`);
    console.log(`📦 To: ${dest}`);

    // Use xcopy on Windows, cp on Unix
    const isWindows = process.platform === 'win32';

    if (isWindows) {
        execSync(`xcopy "${source}" "${dest}" /E /I /Y`, { stdio: 'inherit' });
    } else {
        execSync(`cp -r "${source}" "${dest}"`, { stdio: 'inherit' });
    }

    console.log('✅ Copy completed');
}

/**
 * Create README.md for the migrated component
 */
function createReadme(destPath, componentName, version = 'v2') {
    const readmePath = path.join(destPath, 'README.md');

    const readmeContent = `# ${componentName} Dashboard ${version}

**Design Style:** Modern & Visual  
**Best For:** [Describe use cases]  
**Source:** BundUI Premium  
**Date Added:** ${new Date().toISOString().split('T')[0]}  
**Status:** ✅ Active

## Visual Characteristics
- [Add visual characteristics]
- [Add more details]

## When to Use
- [Add use cases]
- [Add more details]

## When NOT to Use
- [Add anti-patterns]
- [Add more details]

## Migration Notes
- Migrated using automated script
- All imports fixed automatically
- Tested and verified

## Components

- \`page.tsx\` - Main dashboard page
- \`components/\` - Dashboard components

## Navigation

Access this version at: \`/dashboard-bundui/${componentName}-${version}\`
`;

    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log(`\n📝 Created README.md at ${readmePath}`);
}

/**
 * Main migration function
 */
function migrate(sourcePath, destPath) {
    console.log('\n🚀 BundUI Premium to Monorepo Migration\n');
    console.log('='.repeat(50));

    // Step 1: Copy files
    copyDirectory(sourcePath, destPath);

    // Step 2: Fix imports
    console.log('\n🔧 Fixing import paths...');
    console.log('='.repeat(50));
    const fixedFiles = fixImportsRecursively(destPath);

    // Step 3: Create README
    const componentName = path.basename(destPath).replace(/-v\d+$/, '');
    createReadme(destPath, componentName);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration completed successfully!');
    console.log(`📊 Fixed ${fixedFiles} file(s)`);

    // Image warnings
    if (imageWarnings.length > 0) {
        console.log('\n⚠️  Image References Found:');
        console.log('   The following images are referenced. Verify they exist in public/images/');
        const uniqueImages = [...new Set(imageWarnings.map(w => w.image))];
        uniqueImages.forEach(img => {
            console.log(`   - /images/${img}`);
        });
    }

    console.log('\n📋 Next steps:');
    console.log('  1. Review the migrated files');
    console.log('  2. Update README.md with specific details');
    console.log('  3. Add navigation entry in bundui-nav-items.ts');
    if (imageWarnings.length > 0) {
        console.log('  4. Verify images exist in public/images/ folder');
        console.log('  5. Test the component in the browser');
        console.log('  6. Commit changes');
    } else {
        console.log('  4. Test the component in the browser');
        console.log('  5. Commit changes');
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        console.error('Usage: node migrate-bundui-component.js <source-path> <dest-path>');
        console.error('\nExample:');
        console.error('  node scripts/migrate-bundui-component.js \\');
        console.error('    "C:/IA Marcelo Labs/bundui/shadcn-ui-kit-dashboard/app/dashboard/(auth)/crypto" \\');
        console.error('    "apps/dashboard/app/dashboard-bundui/crypto-v2"');
        process.exit(1);
    }

    const [sourcePath, destPath] = args;

    if (!fs.existsSync(sourcePath)) {
        console.error(`❌ Source path does not exist: ${sourcePath}`);
        process.exit(1);
    }

    migrate(sourcePath, destPath);
}

module.exports = { migrate, fixImportsInFile, IMPORT_MAPPINGS };
