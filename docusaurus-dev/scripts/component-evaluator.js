#!/usr/bin/env node

/**
 * Component Evaluator - Evalúa componentes y genera documentación IA-friendly
 * Uso: node scripts/component-evaluator.js <component-path>
 */

const fs = require('fs');
const path = require('path');

// Stack de tecnologías del proyecto
const PROJECT_STACK = {
  frontend: {
    framework: 'React',
    language: 'TypeScript',
    styling: 'Tailwind CSS',
    stateManagement: ['Zustand', 'React Query'],
    testing: ['Vitest', 'React Testing Library', 'Playwright'],
    buildTool: 'Vite',
    packageManager: 'npm'
  },
  backend: {
    database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth',
    api: 'REST + GraphQL',
    realtime: 'Supabase Realtime'
  },
  devops: {
    containerization: 'Docker',
    orchestration: 'Kubernetes',
    ci: 'GitHub Actions',
    monitoring: 'Prometheus + Grafana'
  }
};

// Criterios de evaluación
const EVALUATION_CRITERIA = {
  stackCompatibility: {
    weight: 30,
    checks: [
      'Uses TypeScript',
      'Uses React patterns',
      'Uses Tailwind CSS',
      'Follows project structure',
      'Uses proper imports'
    ]
  },
  codeQuality: {
    weight: 25,
    checks: [
      'Has proper TypeScript types',
      'Uses functional components',
      'Has proper error handling',
      'Follows naming conventions',
      'Has proper comments'
    ]
  },
  testing: {
    weight: 20,
    checks: [
      'Has unit tests',
      'Has integration tests',
      'Has proper test coverage',
      'Uses testing best practices',
      'Has accessibility tests'
    ]
  },
  documentation: {
    weight: 15,
    checks: [
      'Has JSDoc comments',
      'Has usage examples',
      'Has prop documentation',
      'Has storybook stories',
      'Has README'
    ]
  },
  performance: {
    weight: 10,
    checks: [
      'Uses React.memo when needed',
      'Optimizes re-renders',
      'Uses proper hooks',
      'Has proper bundle size',
      'Uses lazy loading'
    ]
  }
};

class ComponentEvaluator {
  constructor(componentPath) {
    this.componentPath = componentPath;
    this.componentName = path.basename(componentPath, path.extname(componentPath));
    this.results = {};
    this.documentation = {};
  }

  async evaluate() {
    console.log(`🔍 Evaluando componente: ${this.componentName}\n`);

    try {
      // Leer archivo del componente
      const componentCode = fs.readFileSync(this.componentPath, 'utf8');
      
      // Evaluar cada criterio
      for (const [criterion, config] of Object.entries(EVALUATION_CRITERIA)) {
        this.results[criterion] = this.evaluateCriterion(criterion, componentCode, config);
      }

      // Generar documentación IA-friendly
      this.generateDocumentation(componentCode);

      // Mostrar resultados
      this.displayResults();

      // Guardar reporte
      this.saveReport();

    } catch (error) {
      console.error(`❌ Error evaluando componente: ${error.message}`);
      process.exit(1);
    }
  }

  evaluateCriterion(criterion, code, config) {
    const checks = config.checks;
    const passedChecks = [];

    for (const check of checks) {
      const passed = this.performCheck(check, code);
      if (passed) {
        passedChecks.push(check);
      }
    }

    const score = (passedChecks.length / checks.length) * 100;
    
    return {
      score: Math.round(score),
      passed: passedChecks,
      failed: checks.filter(check => !passedChecks.includes(check)),
      weight: config.weight
    };
  }

  performCheck(check, code) {
    const checkPatterns = {
      'Uses TypeScript': /\.tsx?$/,
      'Uses React patterns': /import.*React|from.*react/,
      'Uses Tailwind CSS': /className.*[\w-]+/,
      'Follows project structure': /@\/|from.*components/,
      'Uses proper imports': /import.*from/,
      'Has proper TypeScript types': /interface|type.*=/,
      'Uses functional components': /const.*=.*\(.*\)/,
      'Has proper error handling': /try.*catch|error/,
      'Follows naming conventions': /[A-Z][a-zA-Z]*/,
      'Has proper comments': /\/\*|\/\/.*TODO|\/\/.*FIXME/,
      'Has unit tests': /\.test\.|\.spec\./,
      'Has integration tests': /\.integration\./,
      'Has proper test coverage': /coverage/,
      'Uses testing best practices': /describe\(|it\(/,
      'Has accessibility tests': /aria-|role=|data-testid/,
      'Has JSDoc comments': /\/\*\*|\* @/,
      'Has usage examples': /example|usage/,
      'Has prop documentation': /interface.*Props|type.*Props/,
      'Has storybook stories': /\.stories\./,
      'Has README': /README/,
      'Uses React.memo when needed': /React\.memo/,
      'Optimizes re-renders': /useMemo|useCallback/,
      'Uses proper hooks': /use[A-Z]/,
      'Has proper bundle size': /import.*\{.*\}/,
      'Uses lazy loading': /lazy\(|Suspense/
    };

    const pattern = checkPatterns[check];
    return pattern ? pattern.test(code) : false;
  }

  generateDocumentation(code) {
    // Extraer información del componente
    const componentInfo = this.extractComponentInfo(code);
    
    // Generar documentación IA-friendly
    this.documentation = {
      component: {
        name: this.componentName,
        path: this.componentPath,
        type: this.detectComponentType(code),
        description: this.generateDescription(code),
        props: this.extractProps(code),
        examples: this.generateExamples(code),
        stack: this.analyzeStackCompatibility(code)
      },
      evaluation: {
        timestamp: new Date().toISOString(),
        overallScore: this.calculateOverallScore(),
        criteria: this.results,
        recommendations: this.generateRecommendations()
      },
      aiFriendly: {
        summary: this.generateAISummary(),
        tags: this.generateTags(),
        keywords: this.extractKeywords(code),
        relatedComponents: this.suggestRelatedComponents()
      }
    };
  }

  extractComponentInfo(code) {
    // Extraer información básica del componente
    const imports = code.match(/import.*from.*['"]/g) || [];
    const exports = code.match(/export.*/g) || [];
    const props = code.match(/interface.*Props|type.*Props/g) || [];
    
    return {
      imports: imports.length,
      exports: exports.length,
      hasProps: props.length > 0
    };
  }

  detectComponentType(code) {
    if (code.includes('React.memo')) return 'Memoized Component';
    if (code.includes('forwardRef')) return 'Forwarded Ref Component';
    if (code.includes('useState') || code.includes('useEffect')) return 'Stateful Component';
    return 'Functional Component';
  }

  generateDescription(code) {
    // Buscar comentarios JSDoc
    const jsdocMatch = code.match(/\/\*\*([\s\S]*?)\*\//);
    if (jsdocMatch) {
      return jsdocMatch[1].replace(/\*/g, '').trim();
    }
    
    // Generar descripción basada en el nombre
    return `${this.componentName} component for the VibeThink platform`;
  }

  extractProps(code) {
    const propsMatch = code.match(/interface.*Props\s*\{([\s\S]*?)\}/);
    if (propsMatch) {
      return propsMatch[1].split('\n')
        .filter(line => line.includes(':'))
        .map(line => line.trim().replace(/[;,]/, ''))
        .filter(Boolean);
    }
    return [];
  }

  generateExamples(code) {
    return [
      {
        title: 'Basic Usage',
        code: `<${this.componentName} />`
      },
      {
        title: 'With Props',
        code: `<${this.componentName} prop1="value" prop2={true} />`
      }
    ];
  }

  analyzeStackCompatibility(code) {
    const compatibility = {};
    
    // Verificar tecnologías del stack
    compatibility.typescript = code.includes('.tsx') || code.includes('interface');
    compatibility.react = code.includes('import.*React') || code.includes('from.*react');
    compatibility.tailwind = code.includes('className');
    compatibility.testing = fs.existsSync(this.componentPath.replace('.tsx', '.test.tsx'));
    
    return compatibility;
  }

  calculateOverallScore() {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [criterion, result] of Object.entries(this.results)) {
      totalScore += result.score * result.weight;
      totalWeight += result.weight;
    }
    
    return Math.round(totalScore / totalWeight);
  }

  generateRecommendations() {
    const recommendations = [];
    
    for (const [criterion, result] of Object.entries(this.results)) {
      if (result.score < 80) {
        recommendations.push({
          criterion,
          priority: result.score < 50 ? '🔥 CRITICAL' : '⚡ HIGH',
          suggestions: result.failed.map(check => `Add ${check}`)
        });
      }
    }
    
    return recommendations;
  }

  generateAISummary() {
    const score = this.calculateOverallScore();
    const type = this.detectComponentType(this.readComponentCode());
    
    return `${this.componentName} is a ${type} with ${score}% stack compatibility. ` +
           `It ${score >= 80 ? 'follows' : 'needs improvements to follow'} project standards.`;
  }

  generateTags() {
    const tags = [];
    const code = this.readComponentCode();
    
    if (code.includes('useState')) tags.push('stateful');
    if (code.includes('useEffect')) tags.push('side-effects');
    if (code.includes('React.memo')) tags.push('optimized');
    if (code.includes('forwardRef')) tags.push('ref-forwarding');
    if (code.includes('interface')) tags.push('typed');
    
    return tags;
  }

  extractKeywords(code) {
    const keywords = [];
    const patterns = [
      /use[A-Z]\w+/g, // hooks
      /[A-Z][a-z]+/g, // component names
      /className/g, // styling
      /on[A-Z]\w+/g // event handlers
    ];
    
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        keywords.push(...matches);
      }
    });
    
    return [...new Set(keywords)];
  }

  suggestRelatedComponents() {
    // Lógica para sugerir componentes relacionados
    return [
      'Button',
      'Card',
      'Modal',
      'Form'
    ].filter(comp => comp !== this.componentName);
  }

  readComponentCode() {
    return fs.readFileSync(this.componentPath, 'utf8');
  }

  displayResults() {
    console.log('📊 RESULTADOS DE EVALUACIÓN:\n');
    
    for (const [criterion, result] of Object.entries(this.results)) {
      console.log(`🏷️  ${criterion.toUpperCase()}:`);
      console.log(`   Score: ${result.score}% (${result.passed.length}/${result.passed.length + result.failed.length})`);
      
      if (result.failed.length > 0) {
        console.log(`   ❌ Mejoras: ${result.failed.join(', ')}`);
      }
      console.log('');
    }
    
    const overallScore = this.calculateOverallScore();
    console.log(`🎯 SCORE GENERAL: ${overallScore}%`);
    
    if (overallScore >= 90) {
      console.log('✅ EXCELENTE - Componente listo para producción');
    } else if (overallScore >= 70) {
      console.log('⚠️  BUENO - Algunas mejoras recomendadas');
    } else {
      console.log('❌ NECESITA MEJORAS - Revisar criterios fallidos');
    }
  }

  saveReport() {
    const reportPath = path.join(path.dirname(this.componentPath), `${this.componentName}-evaluation.json`);
    const report = {
      component: this.componentName,
      evaluation: this.documentation.evaluation,
      documentation: this.documentation.component,
      aiFriendly: this.documentation.aiFriendly
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  }
}

// Función principal
function main() {
  const componentPath = process.argv[2];
  
  if (!componentPath) {
    console.error('❌ Uso: node component-evaluator.js <component-path>');
    process.exit(1);
  }
  
  if (!fs.existsSync(componentPath)) {
    console.error(`❌ Archivo no encontrado: ${componentPath}`);
    process.exit(1);
  }
  
  const evaluator = new ComponentEvaluator(componentPath);
  evaluator.evaluate();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { ComponentEvaluator }; 