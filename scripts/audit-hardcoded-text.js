#!/usr/bin/env node

/**
 * Script de Auditoría de Textos Hardcoded
 * 
 * Busca strings en inglés dentro de componentes React/Next.js
 * que deberían estar traducidos usando i18n.
 * 
 * Uso: node scripts/audit-hardcoded-text.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DASHBOARD_PATHS = [
  'apps/dashboard/app/dashboard-bundui',
  'apps/dashboard/app/dashboard-vibethink'
];

const COMPONENT_PATHS = [
  'apps/dashboard/src/shared/components',
  'apps/dashboard/src/components'
];

// Patrones para detectar strings hardcoded
const STRING_PATTERNS = [
  /["']([A-Z][^"']{3,})["']/g,  // Strings entre comillas que empiezan con mayúscula
  />{([A-Z][^<]{3,})}</g,       // Texto entre tags JSX
  /title=["']([^"']{3,})["']/gi, // Atributos title
  /placeholder=["']([^"']{3,})["']/gi, // Placeholders
  /aria-label=["']([^"']{3,})["']/gi, // Aria labels
];

// Strings comunes que SÍ deben estar hardcoded (excluir)
const EXCLUDE_PATTERNS = [
  /^(use|import|export|const|let|var|function|return|if|else|for|while|switch|case|default|break|continue|try|catch|finally|throw|new|this|super|extends|class|interface|type|enum|namespace|module|declare|as|is|in|of|typeof|instanceof|void|null|undefined|true|false|NaN|Infinity)$/i,
  /^(className|id|key|ref|href|src|alt|target|rel|type|name|value|onClick|onChange|onSubmit|onFocus|onBlur|disabled|required|readOnly|checked|selected|defaultValue|defaultChecked)$/i,
  /^(div|span|p|h1|h2|h3|h4|h5|h6|a|button|input|select|textarea|form|label|img|svg|path|circle|rect|line|polygon|g|defs|clipPath|mask|pattern|linearGradient|radialGradient|stop|text|tspan|foreignObject)$/i,
  /^[A-Z][a-zA-Z0-9]*$/, // Component names
  /^[a-z][a-zA-Z0-9]*$/, // Variable names
  /^\d+$/, // Numbers
  /^[\s\n\r\t]+$/, // Whitespace only
  /^(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|deg|rad|grad|turn|s|ms)$/i, // CSS units
  /^(rgb|rgba|hsl|hsla|hex|url|calc|var|linear-gradient|radial-gradient)$/i, // CSS functions
  /^(http|https|mailto|tel|ftp|file|data|javascript|about|chrome|edge|opera|safari|firefox)$/i, // URLs
  /^[#@$%&*+\-.,;:!?()[\]{}|\\\/`~^<>="'`]+$/, // Special characters only
];

// Strings que ya están traducidos (excluir)
const I18N_PATTERNS = [
  /t\(['"`]/g, // useTranslation calls
  /useTranslation/g,
  /i18n/g,
];

function isExcluded(str) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(str));
}

function hasI18n(str) {
  return I18N_PATTERNS.some(pattern => pattern.test(str));
}

function findHardcodedStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const results = [];
  
  // Skip if file uses i18n
  if (hasI18n(content)) {
    return results;
  }
  
  STRING_PATTERNS.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const str = match[1] || match[0];
      
      // Clean string
      const cleanStr = str
        .replace(/^["']|["']$/g, '')
        .replace(/^>|<$/g, '')
        .trim();
      
      // Skip if excluded
      if (isExcluded(cleanStr) || cleanStr.length < 3) {
        continue;
      }
      
      // Skip if it's a variable or function call
      if (/^[a-z][a-zA-Z0-9]*$/.test(cleanStr) || cleanStr.includes('${') || cleanStr.includes('{')) {
        continue;
      }
      
      // Get line number
      const lines = content.substring(0, match.index).split('\n');
      const lineNumber = lines.length;
      
      results.push({
        file: filePath,
        line: lineNumber,
        string: cleanStr,
        pattern: index
      });
    }
  });
  
  return results;
}

function scanDirectory(dirPath) {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    return results;
  }
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (file.name.startsWith('.') || file.name === 'node_modules') {
        continue;
      }
      results.push(...scanDirectory(fullPath));
    } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts') || file.name.endsWith('.jsx') || file.name.endsWith('.js'))) {
      const strings = findHardcodedStrings(fullPath);
      results.push(...strings);
    }
  }
  
  return results;
}

function categorizeByModule(filePath) {
  if (filePath.includes('dashboard-bundui')) {
    const match = filePath.match(/dashboard-bundui\/([^\/]+)/);
    return match ? match[1] : 'dashboard-bundui';
  }
  if (filePath.includes('dashboard-vibethink')) {
    const match = filePath.match(/dashboard-vibethink\/([^\/]+)/);
    return match ? match[1] : 'dashboard-vibethink';
  }
  return 'shared';
}

function main() {
  console.log('🔍 Auditing hardcoded strings...\n');
  
  const allResults = [];
  
  // Scan dashboard paths
  DASHBOARD_PATHS.forEach(dashboardPath => {
    const fullPath = path.join(process.cwd(), dashboardPath);
    if (fs.existsSync(fullPath)) {
      console.log(`📁 Scanning ${dashboardPath}...`);
      const results = scanDirectory(fullPath);
      allResults.push(...results);
    }
  });
  
  // Scan component paths
  COMPONENT_PATHS.forEach(componentPath => {
    const fullPath = path.join(process.cwd(), componentPath);
    if (fs.existsSync(fullPath)) {
      console.log(`📁 Scanning ${componentPath}...`);
      const results = scanDirectory(fullPath);
      allResults.push(...results);
    }
  });
  
  // Categorize by module
  const byModule = {};
  allResults.forEach(result => {
    const module = categorizeByModule(result.file);
    if (!byModule[module]) {
      byModule[module] = [];
    }
    byModule[module].push(result);
  });
  
  // Generate report
  console.log('\n📊 Report:\n');
  console.log(`Total hardcoded strings found: ${allResults.length}\n`);
  
  Object.keys(byModule).sort().forEach(module => {
    const count = byModule[module].length;
    console.log(`  ${module}: ${count} strings`);
  });
  
  // Save detailed report
  const reportPath = path.join(process.cwd(), 'docs/sessions/HARDCODED_STRINGS_AUDIT_2025-12-20.md');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  let report = '# Auditoría de Textos Hardcoded - 2025-12-20\n\n';
  report += `**Total encontrados:** ${allResults.length}\n\n`;
  report += '---\n\n';
  
  Object.keys(byModule).sort().forEach(module => {
    const results = byModule[module];
    report += `## ${module} (${results.length} strings)\n\n`;
    
    // Group by file
    const byFile = {};
    results.forEach(result => {
      if (!byFile[result.file]) {
        byFile[result.file] = [];
      }
      byFile[result.file].push(result);
    });
    
    Object.keys(byFile).sort().forEach(file => {
      const fileResults = byFile[file];
      report += `### ${file}\n\n`;
      fileResults.forEach(result => {
        report += `- **Línea ${result.line}:** \`${result.string}\`\n`;
      });
      report += '\n';
    });
    
    report += '\n';
  });
  
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n✅ Report saved to: ${reportPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { findHardcodedStrings, scanDirectory };


