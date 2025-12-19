/**
 * Fix imports in migrated Bundui apps
 * Updates imports from Bundui original structure to monorepo structure
 */

const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui/apps');

const importReplacements = [
  // Fix app-specific imports (e.g., ai-chat importing from itself)
  {
    pattern: /import\s+(.+?)\s+from\s+["']@\/app\/dashboard\/\(auth\)\/apps\/([^/]+)\/(.+?)["'];?/g,
    replacement: 'import $1 from "./$3";'
  },
  // Fix component imports (UI components from @vibethink/ui)
  {
    pattern: /from\s+["']@\/components\/ui\/(.+?)["'];?/g,
    replacement: 'from "@vibethink/ui";'
  },
  // Fix lib/utils imports
  {
    pattern: /from\s+["']@\/lib\/utils["'];?/g,
    replacement: 'from "@/shared/lib/utils";'
  },
  // Fix hooks imports
  {
    pattern: /from\s+["']@\/hooks\/(.+?)["'];?/g,
    replacement: 'from "@/shared/hooks/$1";'
  }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changes = [];

  for (const { pattern, replacement } of importReplacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (before !== content) {
      modified = true;
      changes.push({ pattern: pattern.toString(), replacement });
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${path.relative(appsDir, filePath)}`);
    changes.forEach(c => {
      console.log(`   → Applied: ${c.pattern.substring(0, 50)}...`);
    });
  }

  return modified;
}

function processDirectory(dir) {
  let totalFixed = 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      totalFixed += processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      if (processFile(fullPath)) {
        totalFixed++;
      }
    }
  }

  return totalFixed;
}

console.log('🔧 Fixing imports in migrated Bundui apps...\n');

const totalFixed = processDirectory(appsDir);

console.log(`\n✅ Fixed ${totalFixed} files`);

