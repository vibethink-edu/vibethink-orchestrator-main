#!/usr/bin/env node

/**
 * Pre-commit Validation Script
 * Valida automáticamente que las evaluaciones de stack cumplan con los criterios obligatorios
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

class PreCommitValidator {
  constructor() {
    this.evaluationFiles = [
      'docs/ADR-*.md',
      'docs/evaluations/*.json',
      'docs/STACK_EVALUATION_*.md'
    ];
    
    this.requiredCriteria = [
      'exhaustiveSearch',
      'backwardCompatibility', 
      'riskAnalysis',
      'assumptionValidation'
    ];
  }

  /**
   * Ejecuta validación pre-commit
   */
  async run() {
    // TODO: log `${colors.bold}${colors.blue}🔍 Pre-commit Validation: Stack Evaluation Criteria${colors.reset}\n`

    try {
      // 1. Verificar archivos modificados
      const modifiedFiles = this.getModifiedFiles();
      const evaluationFiles = this.findEvaluationFiles(modifiedFiles);
      
      if (evaluationFiles.length === 0) {
        // TODO: log `${colors.green}✅ No se encontraron archivos de evaluación modificados${colors.reset}`
        return true;
      }

      // TODO: log `${colors.cyan}📁 Archivos de evaluación modificados:${colors.reset}`
      evaluationFiles.forEach(file => {
        // TODO: log `  - ${file}`
      });
      // TODO: log ``

      // 2. Validar cada archivo
      let allValid = true;
      
      for (const file of evaluationFiles) {
        const isValid = await this.validateFile(file);
        if (!isValid) {
          allValid = false;
        }
      }

      // 3. Mostrar resumen
      this.showSummary(allValid, evaluationFiles.length);

      return allValid;

    } catch (error) {
      // TODO: log `${colors.red}Error en validación pre-commit: ${error.message}${colors.reset}`
      return false;
    }
  }

  /**
   * Obtiene archivos modificados en el commit
   */
  getModifiedFiles() {
    try {
      const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      const modifiedFiles = execSync('git diff --name-only', { encoding: 'utf8' });
      
      const allFiles = new Set([
        ...stagedFiles.split('\n').filter(Boolean),
        ...modifiedFiles.split('\n').filter(Boolean)
      ]);
      
      return Array.from(allFiles);
    } catch (error) {
      // TODO: log `${colors.yellow}Warning: No se pudo obtener archivos modificados: ${error.message}${colors.reset}`
      return [];
    }
  }

  /**
   * Encuentra archivos de evaluación entre los modificados
   */
  findEvaluationFiles(modifiedFiles) {
    const evaluationFiles = [];
    
    for (const file of modifiedFiles) {
      if (this.isEvaluationFile(file)) {
        evaluationFiles.push(file);
      }
    }
    
    return evaluationFiles;
  }

  /**
   * Verifica si un archivo es de evaluación
   */
  isEvaluationFile(filePath) {
    const evaluationPatterns = [
      /^docs\/ADR-.*\.md$/,
      /^docs\/evaluations\/.*\.json$/,
      /^docs\/STACK_EVALUATION.*\.md$/,
      /^docs\/.*-evaluation\.md$/
    ];
    
    return evaluationPatterns.some(pattern => pattern.test(filePath));
  }

  /**
   * Valida un archivo de evaluación
   */
  async validateFile(filePath) {
    // TODO: log `${colors.cyan}🔍 Validando: ${filePath}${colors.reset}`
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const extension = path.extname(filePath);
      
      let evaluationData;
      
      if (extension === '.json') {
        evaluationData = JSON.parse(content);
      } else if (extension === '.md') {
        evaluationData = this.parseMarkdownEvaluation(content);
      } else {
        // TODO: log `  ${colors.yellow}⚠️  Formato no soportado: ${extension}${colors.reset}`
        return true; // No fallar por formatos no soportados
      }
      
      const isValid = this.validateEvaluationData(evaluationData, filePath);
      
      if (isValid) {
        // TODO: log `  ${colors.green}✅ Validación pasó${colors.reset}`
      } else {
        // TODO: log `  ${colors.red}❌ Validación falló${colors.reset}`
      }
      
      return isValid;
      
    } catch (error) {
      // TODO: log `  ${colors.red}Error validando ${filePath}: ${error.message}${colors.reset}`
      return false;
    }
  }

  /**
   * Parsea evaluación desde markdown
   */
  parseMarkdownEvaluation(content) {
    const evaluationData = {};
    
    // Buscar secciones de criterios
    const sections = {
      exhaustiveSearch: /## Búsqueda Exhaustiva[\s\S]*?(?=##|$)/i,
      backwardCompatibility: /## Compatibilidad Hacia Atrás[\s\S]*?(?=##|$)/i,
      riskAnalysis: /## Análisis de Riesgos[\s\S]*?(?=##|$)/i,
      assumptionValidation: /## Validación de Suposiciones[\s\S]*?(?=##|$)/i
    };
    
    for (const [criterion, pattern] of Object.entries(sections)) {
      const match = content.match(pattern);
      if (match) {
        evaluationData[criterion] = this.extractChecklistItems(match[0]);
      }
    }
    
    return evaluationData;
  }

  /**
   * Extrae items del checklist desde markdown
   */
  extractChecklistItems(section) {
    const items = [];
    const lines = section.split('\n');
    
    for (const line of lines) {
      // Buscar líneas con checkboxes
      const checkboxMatch = line.match(/^\s*[-*]\s*\[([ x])\]\s*(.+)$/);
      if (checkboxMatch) {
        const isChecked = checkboxMatch[1] === 'x';
        const item = checkboxMatch[2].trim();
        
        if (isChecked) {
          items.push(item);
        }
      }
      
      // Buscar líneas con ✅
      const checkMatch = line.match(/^\s*[-*]\s*✅\s*(.+)$/);
      if (checkMatch) {
        items.push(checkMatch[1].trim());
      }
    }
    
    return items;
  }

  /**
   * Valida datos de evaluación
   */
  validateEvaluationData(evaluationData, filePath) {
    let isValid = true;
    const missingCriteria = [];
    
    // Verificar que todos los criterios estén presentes
    for (const criterion of this.requiredCriteria) {
      if (!evaluationData[criterion] || evaluationData[criterion].length === 0) {
        missingCriteria.push(criterion);
        isValid = false;
      }
    }
    
    // Mostrar criterios faltantes
    if (missingCriteria.length > 0) {
      // TODO: log `  ${colors.red}Criterios faltantes:${colors.reset}`
      missingCriteria.forEach(criterion => {
        // TODO: log `    - ${criterion}`
      });
    }
    
    // Verificar que haya suficientes items completados
    for (const [criterion, items] of Object.entries(evaluationData)) {
      if (this.requiredCriteria.includes(criterion)) {
        const minItems = this.getMinimumItemsForCriterion(criterion);
        
        if (items.length < minItems) {
          // TODO: log `  ${colors.red}${criterion}: Insuficientes items (${items.length}/${minItems})${colors.reset}`
          isValid = false;
        } else {
          // TODO: log `  ${colors.green}${criterion}: ${items.length} items completados${colors.reset}`
        }
      }
    }
    
    return isValid;
  }

  /**
   * Obtiene número mínimo de items para cada criterio
   */
  getMinimumItemsForCriterion(criterion) {
    const minimums = {
      exhaustiveSearch: 3,
      backwardCompatibility: 3,
      riskAnalysis: 4,
      assumptionValidation: 3
    };
    
    return minimums[criterion] || 2;
  }

  /**
   * Muestra resumen de validación
   */
  showSummary(allValid, fileCount) {
    // TODO: log `\n${colors.bold}${colors.magenta}📊 RESUMEN DE VALIDACIÓN PRE-COMMIT${colors.reset}\n`
    
    if (allValid) {
      // TODO: log `${colors.green}${colors.bold}🎉 TODAS LAS EVALUACIONES PASARON${colors.reset}`
      // TODO: log `${colors.green}✅ ${fileCount} archivo(s) validado(s) correctamente${colors.reset}`
      // TODO: log `${colors.green}✅ Commit puede proceder${colors.reset}`
    } else {
      // TODO: log `${colors.red}${colors.bold}⚠️  VALIDACIÓN FALLÓ${colors.reset}`
      // TODO: log `${colors.red}❌ Algunas evaluaciones no cumplen con los criterios obligatorios${colors.reset}`
      // TODO: log `${colors.yellow}💡 Corrige las evaluaciones antes de hacer commit${colors.reset}`
      // TODO: log `${colors.yellow}💡 Usa: node scripts/validate-stack-evaluation.js help${colors.reset}`
    }
    
    // TODO: log ``
  }
}

// Función principal
async function main() {
  const validator = new PreCommitValidator();
  const success = await validator.run();
  
  if (!success) {
    // TODO: log `${colors.red}${colors.bold}❌ Pre-commit validation failed${colors.reset}`
    process.exit(1);
  }
  
  // TODO: log `${colors.green}${colors.bold}✅ Pre-commit validation passed${colors.reset}`
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(error => {
    // TODO: log `${colors.red}Error: ${error.message}${colors.reset}`
    process.exit(1);
  });
}

module.exports = PreCommitValidator; 