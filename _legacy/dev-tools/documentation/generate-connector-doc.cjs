#!/usr/bin/env node

/**
 * Script interactivo para generar la documentación base de un conector
 * usando la plantilla moderna VibeThink/VTK.
 *
 * Uso: node scripts/generate-connector-doc.cjs
 *
 * Requiere: inquirer, fs, path
 *
 * Este script pregunta por todos los campos clave definidos en la plantilla moderna,
 * permitiendo dejar 'Completar' si el usuario no tiene la información en el momento.
 *
 * Si la plantilla evoluciona, actualiza aquí las preguntas y los reemplazos.
 */

const fs = require('fs');
const path = require('path');
let inquirer = require('inquirer');
if (inquirer.default) inquirer = inquirer.default;

// Ruta a la plantilla moderna
const templatePath = path.resolve(__dirname, '../docs/templates/README_CONNECTOR_TEMPLATE.md');

if (!fs.existsSync(templatePath)) {
  console.error('No se encontró la plantilla moderna en:', templatePath);
  process.exit(1);
}

// Preguntas interactivas para los campos clave de la plantilla
const questions = [
  // 1. Datos básicos
  {
    type: 'input',
    name: 'nombre',
    message: 'Nombre del conector:',
    validate: v => v ? true : 'El nombre es obligatorio.'
  },
  {
    type: 'input',
    name: 'proposito',
    message: '¿Qué problema resuelve? ¿Qué sistemas integra? (Propósito):',
    default: 'Completar.'
  },
  {
    type: 'input',
    name: 'alcance',
    message: '¿Qué funcionalidades cubre? ¿Qué no cubre? (Alcance):',
    default: 'Completar.'
  },
  {
    type: 'input',
    name: 'stakeholders',
    message: '¿Quiénes lo usan o dependen de él? (Stakeholders):',
    default: 'Completar.'
  },
  // 2.1 Dependencias técnicas
  {
    type: 'input',
    name: 'dependencias',
    message: 'Dependencias técnicas (librerías, APIs externas, servicios):',
    default: 'Completar.'
  },
  // 2.2 Variables de entorno
  {
    type: 'input',
    name: 'envvars',
    message: 'Variables de entorno requeridas (separadas por coma):',
    default: 'Completar.'
  },
  // 2.3 Endpoints/API expuestos
  {
    type: 'input',
    name: 'endpoints',
    message: 'Endpoints/API expuestos (ej: /api/correo/send):',
    default: 'Completar.'
  },
  // 2.4 Ejemplo de uso mínimo
  {
    type: 'input',
    name: 'ejemploUso',
    message: 'Ejemplo de uso mínimo (puedes dejar "Completar." o pegar un snippet):',
    default: 'Completar.'
  },
  // 3.1 Riesgos y mitigaciones
  {
    type: 'input',
    name: 'riesgos',
    message: 'Riesgos y mitigaciones principales:',
    default: 'Completar.'
  },
  // 4.1 Validación en CI/CD
  {
    type: 'input',
    name: 'cicd',
    message: '¿Cómo se valida el conector en CI/CD? (tests, lint, auditoría, etc.):',
    default: 'Completar.'
  },
  // 6.1 Ejemplo de log estructurado
  {
    type: 'input',
    name: 'logEjemplo',
    message: 'Ejemplo de log estructurado (puedes dejar "Completar." o pegar JSON):',
    default: 'Completar.'
  },
  // 9. Checklist de documentación
  {
    type: 'confirm',
    name: 'checklist',
    message: '¿Marcamos todos los ítems del checklist como completados?',
    default: false
  },
  // 11. Notas de versionado
  {
    type: 'input',
    name: 'versionado',
    message: 'Notas de versionado/documentación evolutiva:',
    default: 'v1.0: Primera versión.'
  },
  // Ruta destino
  {
    type: 'input',
    name: 'destDir',
    message: 'Ruta destino del README.md (ej: src/connectors/correo):',
    validate: v => v ? true : 'La ruta destino es obligatoria.'
  }
];

(async () => {
  const answers = await inquirer.prompt(questions);

  // Leer plantilla
  let template = fs.readFileSync(templatePath, 'utf8');

  // Reemplazos principales
  template = template.replace('[NOMBRE DEL CONECTOR]', answers.nombre);
  template = template.replace(/\*\*Propósito:\*\* [^\n]*/,
    `**Propósito:** ${answers.proposito}`);
  template = template.replace(/\*\*Alcance:\*\* [^\n]*/,
    `**Alcance:** ${answers.alcance}`);
  template = template.replace(/\*\*Stakeholders:\*\* [^\n]*/,
    `**Stakeholders:** ${answers.stakeholders}`);
  // Dependencias técnicas
  template = template.replace(/## 2\.1\. 📦 Dependencias técnicas\n[^\n]*/,
    `## 2.1. 📦 Dependencias técnicas\n- ${answers.dependencias}`);
  // Variables de entorno
  template = template.replace(/## 2\.2\. 🔑 Variables de entorno\n[^\n]*/,
    `## 2.2. 🔑 Variables de entorno\n- ${answers.envvars}`);
  // Endpoints/API
  template = template.replace(/## 2\.3\. 🌐 Endpoints\/API expuestos\n[^\n]*/,
    `## 2.3. 🌐 Endpoints/API expuestos\n- ${answers.endpoints}`);
  // Ejemplo de uso mínimo
  template = template.replace(/## 2\.4\. 🧑‍💻 Ejemplo de uso mínimo\n[\s\S]*?```\n/,
    `## 2.4. 🧑‍💻 Ejemplo de uso mínimo\n
${answers.ejemploUso.startsWith('Completar') ? '```js\n// Completar.\n```' : `

${answers.ejemploUso}
`}`);
  // Riesgos y mitigaciones
  template = template.replace(/## 3\.1\. ⚠️ Riesgos y mitigaciones\n[^\n]*/,
    `## 3.1. ⚠️ Riesgos y mitigaciones\n- ${answers.riesgos}`);
  // Validación en CI/CD
  template = template.replace(/## 4\.1\. 🛡️ Validación en CI\/CD\n[^\n]*/,
    `## 4.1. 🛡️ Validación en CI/CD\n- ${answers.cicd}`);
  // Ejemplo de log estructurado
  template = template.replace(/## 6\.1\. 📝 Ejemplo de log estructurado\n[\s\S]*?```\n/,
    `## 6.1. 📝 Ejemplo de log estructurado\n
${answers.logEjemplo.startsWith('Completar') ? '```json\n// Completar.\n```' : `
${answers.logEjemplo}
`}`);
  // Checklist de documentación
  template = template.replace(/## 9\. ✅ Checklist de documentación[\s\S]*?---/,
    `## 9. ✅ Checklist de documentación
- [${answers.checklist ? 'x' : ' '}] Todos los campos completados
- [${answers.checklist ? 'x' : ' '}] Revisado por otro dev
- [${answers.checklist ? 'x' : ' '}] Validado en CI/CD

---`);
  // Notas de versionado
  template = template.replace(/## 11\. 🗂️ Notas de versionado\/documentación evolutiva[\s\S]*?(---|$)/,
    `## 11. 🗂️ Notas de versionado/documentación evolutiva
- ${answers.versionado}

---`);

  // Crear carpeta si no existe
  if (!fs.existsSync(answers.destDir)) {
    fs.mkdirSync(answers.destDir, { recursive: true });
  }

  // Guardar README generado
  const destPath = path.resolve(answers.destDir, 'README.md');
  fs.writeFileSync(destPath, template);

  console.log(`\n✅ README.md generado para '${answers.nombre}' en ${destPath}`);
  console.log('Revisa el archivo y completa los campos restantes según corresponda.');

  // ADVERTENCIA si la plantilla no tiene los campos esperados
  if (!template.includes('## 2.1. 📦 Dependencias técnicas')) {
    console.warn('\n⚠️ ADVERTENCIA: La plantilla moderna podría estar desactualizada o incompleta. Revisa y ajusta según las mejores prácticas VTK.');
  }
})(); 