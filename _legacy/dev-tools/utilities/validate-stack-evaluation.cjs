#!/usr/bin/env node

/**
 * Script de Validación de Criterios de Evaluación de Stack
 * Asegura que se cumplan los criterios obligatorios antes de cualquier decisión
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class StackEvaluationValidator {
  constructor() {
    this.criteria = {
      exhaustiveSearch: {
        required: true,
        description: 'Búsqueda exhaustiva de alternativas',
        checklist: [
          'Búsqueda semántica amplia completada',
          'Múltiples fuentes evaluadas (GitHub, Stack Overflow, Reddit, blogs)',
          'Métricas comparativas incluidas',
          'Alternativas emergentes consideradas'
        ]
      },
      backwardCompatibility: {
        required: true,
        description: 'Compatibilidad hacia atrás',
        checklist: [
          'Todas las decisiones previas revisadas',
          'Compatibilidad con stack existente validada',
          'Impacto en decisiones anteriores evaluado',
          'Plan de migración si es necesario'
        ]
      },
      riskAnalysis: {
        required: true,
        description: 'Análisis de riesgos completo',
        checklist: [
          'Riesgos técnicos identificados',
          'Riesgos de negocio evaluados',
          'Riesgos operacionales considerados',
          'Estrategias de mitigación desarrolladas',
          'Planes de fallback definidos'
        ]
      },
      assumptionValidation: {
        required: true,
        description: 'Validación de suposiciones',
        checklist: [
          'Todas las suposiciones listadas',
          'Evidencia proporcionada para cada suposición',
          'Nivel de confianza calculado',
          'Suposiciones validadas con datos'
        ]
      }
    };
  }

  /**
   * Valida que se cumplan todos los criterios
   */
  validateEvaluation(componentName, evaluationData) {
    console.log(`${colors.bold}${colors.blue}🔍 Validando Evaluación de Stack: ${componentName}${colors.reset}\n`);

    let allPassed = true;
    const results = {};

    // Validar cada criterio
    for (const [criterion, config] of Object.entries(this.criteria)) {
      console.log(`${colors.cyan}📋 ${config.description}${colors.reset}`);
      
      const result = this.validateCriterion(criterion, config, evaluationData);
      results[criterion] = result;
      
      if (!result.passed) {
        allPassed = false;
      }
      
      console.log('');
    }

    // Mostrar resumen
    this.showSummary(results, allPassed);

    return {
      passed: allPassed,
      results,
      componentName
    };
  }

  /**
   * Valida un criterio específico
   */
  validateCriterion(criterion, config, evaluationData) {
    const checklist = config.checklist;
    const completed = evaluationData[criterion] || [];
    
    let passed = true;
    const missing = [];

    // Verificar cada item del checklist
    for (const item of checklist) {
      const isCompleted = completed.includes(item) || 
                         completed.some(completedItem => 
                           completedItem.toLowerCase().includes(item.toLowerCase().split(' ')[0])
                         );

      if (isCompleted) {
        console.log(`  ${colors.green}✅${colors.reset} ${item}`);
      } else {
        console.log(`  ${colors.red}❌${colors.reset} ${item}`);
        missing.push(item);
        passed = false;
      }
    }

    // Mostrar estado del criterio
    const status = passed ? 
      `${colors.green}${colors.bold}PASÓ${colors.reset}` : 
      `${colors.red}${colors.bold}FALLÓ${colors.reset}`;
    
    console.log(`  ${colors.yellow}Estado: ${status}${colors.reset}`);

    if (!passed) {
      console.log(`  ${colors.red}Items faltantes:${colors.reset}`);
      missing.forEach(item => {
        console.log(`    - ${item}`);
      });
    }

    return {
      passed,
      completed,
      missing,
      total: checklist.length,
      completedCount: completed.length
    };
  }

  /**
   * Muestra resumen de la validación
   */
  showSummary(results, allPassed) {
    console.log(`${colors.bold}${colors.magenta}📊 RESUMEN DE VALIDACIÓN${colors.reset}\n`);

    let totalCriteria = 0;
    let passedCriteria = 0;

    for (const [criterion, result] of Object.entries(results)) {
      totalCriteria++;
      if (result.passed) passedCriteria++;

      const percentage = Math.round((result.completedCount / result.total) * 100);
      const status = result.passed ? 
        `${colors.green}PASÓ${colors.reset}` : 
        `${colors.red}FALLÓ${colors.reset}`;

      console.log(`${criterion}: ${status} (${result.completedCount}/${result.total} - ${percentage}%)`);
    }

    console.log('');
    const overallPercentage = Math.round((passedCriteria / totalCriteria) * 100);
    
    if (allPassed) {
      console.log(`${colors.green}${colors.bold}🎉 TODOS LOS CRITERIOS PASARON (${overallPercentage}%)${colors.reset}`);
      console.log(`${colors.green}✅ La evaluación cumple con todos los estándares obligatorios${colors.reset}`);
    } else {
      console.log(`${colors.red}${colors.bold}⚠️  VALIDACIÓN FALLÓ (${overallPercentage}%)${colors.reset}`);
      console.log(`${colors.red}❌ La evaluación NO cumple con todos los estándares obligatorios${colors.reset}`);
      console.log(`${colors.yellow}💡 Revisa los items faltantes antes de proceder${colors.reset}`);
    }

    console.log('');
  }

  /**
   * Genera template de evaluación
   */
  generateEvaluationTemplate(componentName) {
    const template = {
      componentName,
      timestamp: new Date().toISOString(),
      exhaustiveSearch: [
        // Completar con items del checklist
      ],
      backwardCompatibility: [
        // Completar con items del checklist
      ],
      riskAnalysis: [
        // Completar con items del checklist
      ],
      assumptionValidation: [
        // Completar con items del checklist
      ]
    };

    const templatePath = path.join(__dirname, '..', 'docs', 'evaluations', `${componentName}-evaluation.json`);
    
    // Crear directorio si no existe
    const dir = path.dirname(templatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
    
    console.log(`${colors.green}📝 Template generado: ${templatePath}${colors.reset}`);
    console.log(`${colors.yellow}💡 Completa el template y ejecuta la validación${colors.reset}`);
    
    return templatePath;
  }

  /**
   * Carga evaluación desde archivo
   */
  loadEvaluationFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`${colors.red}Error cargando evaluación: ${error.message}${colors.reset}`);
      return null;
    }
  }

  /**
   * Muestra ayuda
   */
  showHelp() {
    console.log(`${colors.bold}${colors.blue}Stack Evaluation Validator${colors.reset}\n`);
    console.log('Uso:');
    console.log('  node validate-stack-evaluation.js validate <component-name> <evaluation-file>');
    console.log('  node validate-stack-evaluation.js template <component-name>');
    console.log('  node validate-stack-evaluation.js help\n');
    
    console.log('Ejemplos:');
    console.log('  node validate-stack-evaluation.js validate agno docs/evaluations/agno-evaluation.json');
    console.log('  node validate-stack-evaluation.js template new-database\n');
    
    console.log('Criterios obligatorios:');
    for (const [criterion, config] of Object.entries(this.criteria)) {
      console.log(`  - ${criterion}: ${config.description}`);
    }
  }
}

// Función principal
function main() {
  const validator = new StackEvaluationValidator();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    validator.showHelp();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'validate':
      if (args.length < 3) {
        console.error(`${colors.red}Error: Se requieren component-name y evaluation-file${colors.reset}`);
        validator.showHelp();
        return;
      }
      
      const componentName = args[1];
      const evaluationFile = args[2];
      
      const evaluationData = validator.loadEvaluationFromFile(evaluationFile);
      if (!evaluationData) {
        console.error(`${colors.red}Error: No se pudo cargar el archivo de evaluación${colors.reset}`);
        return;
      }
      
      const result = validator.validateEvaluation(componentName, evaluationData);
      
      // Salir con código de error si falló
      if (!result.passed) {
        process.exit(1);
      }
      break;

    case 'template':
      if (args.length < 2) {
        console.error(`${colors.red}Error: Se requiere component-name${colors.reset}`);
        validator.showHelp();
        return;
      }
      
      const templateComponentName = args[1];
      validator.generateEvaluationTemplate(templateComponentName);
      break;

    default:
      console.error(`${colors.red}Comando desconocido: ${command}${colors.reset}`);
      validator.showHelp();
      process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = StackEvaluationValidator; 