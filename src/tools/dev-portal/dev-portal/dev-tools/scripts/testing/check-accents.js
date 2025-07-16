const fs = require('fs');
const path = require('path');

const accentRegex = /[áéíóúÁÉÍÓÚñÑ]/;
const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, index) => {
    if (accentRegex.test(line)) {
      issues.push({
        line: index + 1,
        content: line.trim(),
        accents: line.match(accentRegex)
      });
    }
  });
  
  return issues;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let allIssues = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      allIssues = allIssues.concat(walkDir(filePath));
    } else if (codeExtensions.includes(path.extname(file))) {
      const issues = checkFile(filePath);
      if (issues.length > 0) {
        allIssues.push({ file: filePath, issues });
      }
    }
  });
  
  return allIssues;
}

// Ejecutar verificación
const issues = walkDir('./src');

if (issues.length > 0) {
  console.log('❌ ERROR: Se encontraron acentos en el código:');
  issues.forEach(({ file, issues }) => {
    console.log(`\n📁 ${file}:`);
    issues.forEach(({ line, content, accents }) => {
      console.log(`  Línea ${line}: ${content}`);
      console.log(`  Acentos: ${accents.join(', ')}`);
    });
  });
  process.exit(1);
} else {
  console.log('✅ No se encontraron acentos en el código');
} 