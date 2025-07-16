#!/usr/bin/env node

/**
 * VTK 1.0 Simple Validator
 */

import fs from 'fs';

console.log('🚀 VALIDACIÓN VTK 1.0 - AI PAIR ORCHESTRATOR PRO');
console.log('='.repeat(50));

let score = 0;
let total = 0;

function check(description, condition) {
  total++;
  if (condition) {
    console.log(`✅ ${description}`);
    score++;
  } else {
    console.log(`❌ ${description}`);
  }
}

function checkFile(description, path) {
  check(description, fs.existsSync(path));
}

console.log('\n1️⃣ DOCUMENTVTK SEPARATION:');
checkFile('Core Universal', 'docs/VTK_METHODOLOGY/04_TOOLS/DocumentVTK-core.js');
checkFile('VibeThink Config', 'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js');
checkFile('Wrapper Compatibilidad', 'src/scripts/DocumentVTK.js');

console.log('\n2️⃣ SCRIPTS ORGANIZATION:');
checkFile('Methodology Scripts', 'scripts/methodology');
checkFile('Project Scripts', 'scripts/project');
checkFile('Build Scripts', 'scripts/build');
checkFile('Testing Scripts', 'scripts/testing');

console.log('\n3️⃣ VTK STRUCTURE:');
checkFile('VTK Methodology', 'docs/VTK_METHODOLOGY');
checkFile('Project Docs', 'docs/PROJECT');
checkFile('Archives', 'archives');

console.log('\n4️⃣ META-PROMPT BRAIN:');
const brainExists = fs.existsSync('docs/VTK_METHODOLOGY/01_PRINCIPLES/KNOWLEDGE_BASE/VTK_META_PROMPT_BRAIN.md');
check('Meta-Prompt Brain exists', brainExists);

if (brainExists) {
  const content = fs.readFileSync('docs/VTK_METHODOLOGY/01_PRINCIPLES/KNOWLEDGE_BASE/VTK_META_PROMPT_BRAIN.md', 'utf8');
  check('Version 4.6', content.includes('1.0'));
  check('New Rules', content.includes('R4.6.1') || content.includes('R4.5.1'));
  check('Experience Documented', content.includes('AI Pair Orchestrator Pro'));
}

console.log('\n5️⃣ DOCUMENTATION:');
checkFile('Lessons Learned', 'docs/VTK_METHODOLOGY/05_BEST_PRACTICES/REORGANIZATION_LESSONS_LEARNED.md');
checkFile('Final Report', 'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/VTK-REORGANIZATION-FINAL-REPORT.md');

console.log('\n6️⃣ CLEANUP:');
check('src/logs removed', !fs.existsSync('src/logs'));
check('src/memory-bank removed', !fs.existsSync('src/memory-bank'));
check('src/reports removed', !fs.existsSync('src/reports'));

console.log('\n7️⃣ V4.5 REORGANIZATION:');
check('src/examples moved to shared', fs.existsSync('src/shared/examples'));
check('src/trends moved to analytics', fs.existsSync('src/shared/analytics'));
check('src/cms-gov moved to apps', fs.existsSync('src/apps/cms-gov'));
check('src/mockup-ai-studio moved to apps', fs.existsSync('src/apps/ai-studio'));
check('src/mockups consolidated', fs.existsSync('src/shared/mockups'));
check('src/essential moved to docs', fs.existsSync('docs/PROJECT/03_DESIGN/essential-architecture'));
check('src/strapi-plugin moved to integrations', fs.existsSync('src/integrations/strapi/plugin-ap-form-builder'));

console.log('\n8️⃣ 1.0 MONOREPO MANAGEMENT:');
check('Lerna configuration', fs.existsSync('lerna.json'));
check('Git sync script', fs.existsSync('scripts/git-sync.js'));
check('Build info excluded', !fs.existsSync('tsconfig.app.tsbuildinfo'));
check('Config files organized', fs.existsSync('docs/PROJECT/08_TOOLCHAIN_AND_SETUP/company-quality-config.json'));
check('Department config organized', fs.existsSync('docs/PROJECT/08_TOOLCHAIN_AND_SETUP/department-config.json'));

console.log('\n9️⃣ 1.0 METHODOLOGY UPDATES:');
check('Conventional commits template', fs.existsSync('docs/VTK_METHODOLOGY/02_TEMPLATES/templates/CONVENTIONAL_COMMITS_TEMPLATE.md'));
check('Monorepo setup template', fs.existsSync('docs/VTK_METHODOLOGY/02_TEMPLATES/templates/MONOREPO_SETUP_TEMPLATE.md'));
check('Monorepo workflow process', fs.existsSync('docs/VTK_METHODOLOGY/03_PROCESSES/MONOREPO_WORKFLOW.md'));
check('Monorepo best practices', fs.existsSync('docs/VTK_METHODOLOGY/05_BEST_PRACTICES/MONOREPO_BEST_PRACTICES.md'));
check('Conventional commits guide', fs.existsSync('docs/VTK_METHODOLOGY/05_BEST_PRACTICES/CONVENTIONAL_COMMITS_GUIDE.md'));

console.log('\n🔟 1.0 TESTING FRAMEWORK:');
check('Testing best practices', fs.existsSync('docs/VTK_METHODOLOGY/05_BEST_PRACTICES/TESTING_BEST_PRACTICES.md'));
check('Monorepo testing template', fs.existsSync('docs/VTK_METHODOLOGY/02_TEMPLATES/templates/MONOREPO_TESTING_TEMPLATE.md'));
check('Testing scripts organized', fs.existsSync('scripts/testing') && fs.readdirSync('scripts/testing').length > 40);
check('Testing strategy documented', fs.existsSync('docs/PROJECT/05_VALIDATION/testing-strategy.md'));
check('Tests structure exists', fs.existsSync('src/tests'));

console.log('\n1️⃣1️⃣ 1.0 VERSION MANAGEMENT:');
check('Version management process', fs.existsSync('docs/VTK_METHODOLOGY/03_PROCESSES/VERSION_MANAGEMENT_PROCESS.md'));
check('Version evaluation template', fs.existsSync('docs/VTK_METHODOLOGY/02_TEMPLATES/VERSION_EVALUATION_TEMPLATE.md'));

if (brainExists) {
  const brainContent = fs.readFileSync('docs/VTK_METHODOLOGY/01_PRINCIPLES/KNOWLEDGE_BASE/VTK_META_PROMPT_BRAIN.md', 'utf8');
  check('Version management rules (R4.6.3)', brainContent.includes('R4.6.3'));
  check('Version management experience', brainContent.includes('Proceso Formal de Gestión de Versiones'));
  check('Version criteria documented', brainContent.includes('Criterios de Evolución de Versión') || brainContent.includes('R4.6.3.1'));
}

console.log('\n1️⃣2️⃣ CMMI EVIDENCE FRAMEWORK:');
check('CMMI Evidence Framework', fs.existsSync('docs/VTK_METHODOLOGY/05_BEST_PRACTICES/CMMI_EVIDENCE_FRAMEWORK.md'));
check('CMMI Evidence Generator', fs.existsSync('scripts/generate-cmmi-evidence.js'));

if (brainExists) {
  const brainContent = fs.readFileSync('docs/VTK_METHODOLOGY/01_PRINCIPLES/KNOWLEDGE_BASE/VTK_META_PROMPT_BRAIN.md', 'utf8');
  check('CMMI compliance documented', brainContent.includes('CMMI') || brainContent.includes('evidence') || brainContent.includes('Evidencia'));
  check('Traceability rules present', brainContent.includes('trazabilidad') || brainContent.includes('Trazabilidad'));
}

const percentage = Math.round((score / total) * 100);

console.log('\n' + '='.repeat(50));
console.log(`📊 SCORE: ${score}/${total} (${percentage}%)`);

if (percentage >= 90) {
  console.log('🎉 REORGANIZACIÓN VTK 1.0 EXITOSA!');
  console.log('✅ Proyecto completamente VTK-compliant');
} else if (percentage >= 80) {
  console.log('⚠️ Reorganización mayormente exitosa');
  console.log('🔧 Revisar elementos faltantes');
} else {
  console.log('❌ Reorganización necesita correcciones');
  console.log('🚨 Revisar errores críticos');
}

console.log('='.repeat(50));
