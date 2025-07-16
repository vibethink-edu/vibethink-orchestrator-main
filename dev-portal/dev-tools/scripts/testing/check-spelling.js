const fs = require('fs');
const path = require('path');

// Diccionario de palabras correctas en español
const spanishDictionary = [
  'estimado', 'estimada', 'cordialmente', 'saludos', 'atentamente',
  'propuesta', 'comercial', 'reunión', 'seguimiento', 'pendiente',
  'presupuesto', 'ventas', 'ticket', 'crítico', 'deadline', 'patente',
  'concedida', 'felicitaciones', 'cumpleaños', 'bienestar', 'recordatorio',
  'descanso', 'trabajando', 'minutos', 'análisis', 'mensual', 'actividades',
  'publicaciones', 'sitio', 'específico', 'inteligencia', 'artificial',
  'validación', 'sanitización', 'notificación', 'categorización',
  'escalación', 'automatización', 'comunicación', 'personalización'
];

// Diccionario de palabras correctas en inglés
const englishDictionary = [
  'dear', 'regards', 'best', 'proposal', 'commercial', 'meeting',
  'follow', 'pending', 'budget', 'sales', 'critical', 'deadline',
  'patent', 'granted', 'congratulations', 'birthday', 'wellness',
  'reminder', 'break', 'working', 'minutes', 'analysis', 'monthly',
  'activities', 'publications', 'site', 'specific', 'artificial',
  'intelligence', 'validation', 'sanitization', 'notification',
  'categorization', 'escalation', 'automation', 'communication',
  'personalization'
];

function checkSpelling(content, language = 'es') {
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const dictionary = language === 'es' ? spanishDictionary : englishDictionary;
  const errors = [];
  
  words.forEach(word => {
    if (!dictionary.includes(word) && word.length > 3) {
      errors.push(word);
    }
  });
  
  return errors;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, index) => {
    // Solo verificar líneas que contengan mensajes al usuario
    if (line.includes('message:') || line.includes('title:') || line.includes('content:')) {
      const spellingErrors = checkSpelling(line);
      if (spellingErrors.length > 0) {
        issues.push({
          line: index + 1,
          content: line.trim(),
          errors: spellingErrors
        });
      }
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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
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
  console.log('❌ ERROR: Se encontraron errores de ortografía en comunicaciones:');
  issues.forEach(({ file, issues }) => {
    console.log(`\n📁 ${file}:`);
    issues.forEach(({ line, content, errors }) => {
      console.log(`  Línea ${line}: ${content}`);
      console.log(`  Errores: ${errors.join(', ')}`);
    });
  });
  process.exit(1);
} else {
  console.log('✅ No se encontraron errores de ortografía en comunicaciones');
} 