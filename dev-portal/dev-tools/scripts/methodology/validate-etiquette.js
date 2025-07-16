const fs = require('fs');
const path = require('path');

// Reglas de etiqueta obligatorias
const requiredEtiquetteFields = [
  'language',
  'formality',
  'temperature',
  'style',
  'greeting',
  'closing',
  'tone',
  'culturalPreferences',
  'taboos'
];

// Validar estructura de reglas de etiqueta
function validateEtiquetteRules(content) {
  const issues = [];
  
  // Verificar que existan las reglas de etiqueta
  if (!content.includes('etiquetteRules') && !content.includes('EtiquetteRules')) {
    issues.push('No se encontraron reglas de etiqueta definidas');
  }
  
  // Verificar campos obligatorios
  requiredEtiquetteFields.forEach(field => {
    if (!content.includes(field)) {
      issues.push(`Campo obligatorio de etiqueta faltante: ${field}`);
    }
  });
  
  // Verificar integración con CDP
  if (!content.includes('cdpData') && !content.includes('CDPData')) {
    issues.push('No se encontró integración con CDP');
  }
  
  // Verificar middleware universal
  if (!content.includes('UniversalCommunicationMiddleware')) {
    issues.push('No se encontró middleware universal de comunicación');
  }
  
  return issues;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = validateEtiquetteRules(content);
  
  return issues.length > 0 ? { file: filePath, issues } : null;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let allIssues = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      allIssues = allIssues.concat(walkDir(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      const result = checkFile(filePath);
      if (result) {
        allIssues.push(result);
      }
    }
  });
  
  return allIssues;
}

// Ejecutar validación
const issues = walkDir('./src');

if (issues.length > 0) {
  console.log('❌ ERROR: Se encontraron problemas con las reglas de etiqueta:');
  issues.forEach(({ file, issues }) => {
    console.log(`\n📁 ${file}:`);
    issues.forEach(issue => {
      console.log(`  ❌ ${issue}`);
    });
  });
  process.exit(1);
} else {
  console.log('✅ Todas las reglas de etiqueta están correctamente implementadas');
} 