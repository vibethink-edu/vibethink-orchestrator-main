#!/usr/bin/env node

/**
 * Simple Script Organizer
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Script Organizer - VTK v4.2');
console.log('='.repeat(40));

const srcPath = 'src/scripts';
const scripts = fs.readdirSync(srcPath).filter(f => f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.ps1') || f.endsWith('.sql') || f.endsWith('.ts') || f.endsWith('.cjs') || f.endsWith('.mjs'));

console.log(`📂 Encontrados ${scripts.length} scripts`);

// Clasificación simple
const categories = {
  methodology: [],
  project: [],
  build: [],
  testing: []
};

for (const script of scripts) {
  // Methodology (universal)
  if (script.includes('DocumentVTK') || 
      script.includes('VTK') || 
      script.includes('methodology') ||
      script.includes('validate-golden-rules') ||
      script.includes('validate-documentVTK') ||
      script.includes('requirement-processor') ||
      script.includes('knowledge-base-strategy') ||
      script.includes('documentation-automation') ||
      script.includes('auto-version-docs') ||
      script.includes('naming-conventions') ||
      script.includes('signatures') ||
      script.includes('validate-constitutional') ||
      script.includes('validate-etiquette') ||
      script.includes('validate-hybrid-architecture') ||
      script.includes('validate-ai-first-architecture') ||
      script.includes('generate-documentation')) {
    categories.methodology.push(script);
  }
  // Testing
  else if (script.startsWith('test-') || 
           script.startsWith('check-') ||
           script.startsWith('validate-') ||
           script.startsWith('verify-') ||
           script.includes('debug') ||
           script.includes('stress-testing') ||
           script.includes('wcag') ||
           script.includes('real-world-test') ||
           script.includes('hierarchical-test') ||
           script.includes('health-check') ||
           script.includes('scenarios') ||
           script.includes('mock')) {
    categories.testing.push(script);
  }
  // Build
  else if (script.startsWith('build-') ||
           script.includes('css') ||
           script.includes('ui-components') ||
           script.includes('sync-shadcn') ||
           script.includes('generate-types') ||
           script.includes('generate-route') ||
           script.includes('version-automation') ||
           script.includes('version-control') ||
           script.includes('dependency-inventory')) {
    categories.build.push(script);
  }
  // Project (default)
  else {
    categories.project.push(script);
  }
}

console.log('\n📊 CLASIFICACIÓN:');
for (const [cat, files] of Object.entries(categories)) {
  console.log(`\n${cat.toUpperCase()}: ${files.length} scripts`);
  files.forEach(f => console.log(`  - ${f}`));
}

console.log('\n⚠️ Para ejecutar movimiento, usar --execute');
