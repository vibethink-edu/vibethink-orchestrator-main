#!/usr/bin/env node

/**
 * 🔍 Generador de Análisis de Porte
 * 
 * Este script automatiza el análisis inicial de un candidato para porte,
 * evaluando aspectos técnicos, dependencias, complejidad y compatibilidad
 * con nuestro stack.
 * 
 * Uso: node scripts/generate-porte-analysis.js [nombre] [repo_url]
 * 
 * VTK 1.0 - Framework de Porte
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class PorteAnalyzer {
  constructor(componentName, repoUrl) {
    this.componentName = componentName;
    this.repoUrl = repoUrl;
    this.analysisDir = path.join('src', 'modules', `${componentName}-analysis`);
    this.reportsDir = path.join(this.analysisDir, '04-analysis-reports');
    this.timestamp = new Date().toISOString();
  }

  async generateAnalysis() {
    console.log(`🔍 Iniciando análisis de porte para: ${this.componentName}`);
    
    try {
      // 1. Crear estructura de directorios
      await this.createDirectoryStructure();
      
      // 2. Clonar y analizar repositorio
      await this.cloneAndAnalyze();
      
      // 3. Generar reportes
      await this.generateReports();
      
      // 4. Crear documentación inicial
      await this.createInitialDocs();
      
      console.log(`✅ Análisis completado. Revisa: ${this.reportsDir}`);
      
    } catch (error) {
      console.error('❌ Error durante el análisis:', error.message);
      process.exit(1);
    }
  }

  async createDirectoryStructure() {
    const dirs = [
      this.analysisDir,
      path.join(this.analysisDir, `01-${this.componentName}-app`),
      path.join(this.analysisDir, `02-${this.componentName}-docs`),
      path.join(this.analysisDir, `03-${this.componentName}-deployment`),
      this.reportsDir
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    console.log('📁 Estructura de directorios creada');
  }

  async cloneAndAnalyze() {
    const appDir = path.join(this.analysisDir, `01-${this.componentName}-app`);
    
    try {
      console.log('📥 Clonando repositorio...');
      execSync(`git clone ${this.repoUrl} ${appDir}`, { stdio: 'inherit' });
      
      // Analizar package.json si existe
      const packagePath = path.join(appDir, 'package.json');
      try {
        const packageData = await fs.readFile(packagePath, 'utf8');
        const packageJson = JSON.parse(packageData);
        
        await this.analyzePackageJson(packageJson);
        console.log('✅ Análisis de package.json completado');
        
      } catch (error) {
        console.log('⚠️  No se encontró package.json o no es válido');
      }
      
    } catch (error) {
      throw new Error(`Error clonando repositorio: ${error.message}`);
    }
  }

  async analyzePackageJson(packageJson) {
    const analysis = {
      component: this.componentName,
      repository: this.repoUrl,
      analysis_date: this.timestamp,
      package_analysis: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        license: packageJson.license,
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        scripts: packageJson.scripts || {},
        engines: packageJson.engines || {}
      },
      compatibility_assessment: await this.assessCompatibility(packageJson),
      complexity_analysis: await this.analyzeComplexity(packageJson),
      recommendations: await this.generateRecommendations(packageJson)
    };

    const reportPath = path.join(this.reportsDir, 'package-analysis.json');
    await fs.writeFile(reportPath, JSON.stringify(analysis, null, 2));
  }

  async assessCompatibility(packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Análisis de compatibilidad con nuestro stack
    const stackCompatibility = {
      react: this.checkReactCompatibility(deps),
      typescript: this.checkTypeScriptSupport(deps),
      database: this.analyzeDatabaseUsage(deps),
      ui_framework: this.analyzeUIFramework(deps),
      build_tools: this.analyzeBuildTools(deps),
      testing: this.analyzeTestingFramework(deps)
    };

    const compatibilityScore = this.calculateCompatibilityScore(stackCompatibility);

    return {
      stack_compatibility: stackCompatibility,
      overall_score: compatibilityScore,
      risk_level: compatibilityScore > 80 ? 'LOW' : compatibilityScore > 60 ? 'MEDIUM' : 'HIGH',
      adaptation_effort: compatibilityScore > 80 ? 'LOW' : compatibilityScore > 60 ? 'MEDIUM' : 'HIGH'
    };
  }

  checkReactCompatibility(deps) {
    if (deps.react) {
      const version = deps.react.replace(/[\^~]/, '');
      const majorVersion = parseInt(version.split('.')[0]);
      
      return {
        compatible: majorVersion >= 16,
        current_version: deps.react,
        target_version: '18.x',
        migration_needed: majorVersion < 18,
        notes: majorVersion >= 18 ? 'Compatible' : 'Requires React upgrade'
      };
    }
    
    return {
      compatible: false,
      current_version: 'N/A',
      target_version: '18.x',
      migration_needed: true,
      notes: 'No React detected - major migration required'
    };
  }

  checkTypeScriptSupport(deps) {
    const hasTypeScript = deps.typescript || deps['@types/node'] || fs.existsSync('tsconfig.json');
    
    return {
      supported: !!hasTypeScript,
      current_setup: hasTypeScript ? 'TypeScript detected' : 'JavaScript only',
      migration_effort: hasTypeScript ? 'LOW' : 'HIGH',
      notes: hasTypeScript ? 'Good TypeScript support' : 'Full TypeScript migration needed'
    };
  }

  analyzeDatabaseUsage(deps) {
    const dbDeps = Object.keys(deps).filter(dep => 
      dep.includes('postgres') || dep.includes('mysql') || dep.includes('mongo') || 
      dep.includes('sqlite') || dep.includes('prisma') || dep.includes('sequelize') ||
      dep.includes('typeorm') || dep.includes('knex')
    );

    return {
      detected_databases: dbDeps,
      supabase_compatible: dbDeps.some(dep => dep.includes('postgres')) || dbDeps.length === 0,
      migration_complexity: dbDeps.length === 0 ? 'LOW' : dbDeps.length === 1 ? 'MEDIUM' : 'HIGH',
      notes: dbDeps.length === 0 ? 'No database dependencies' : `Database migration needed: ${dbDeps.join(', ')}`
    };
  }

  analyzeUIFramework(deps) {
    const uiFrameworks = Object.keys(deps).filter(dep =>
      dep.includes('antd') || dep.includes('material-ui') || dep.includes('@mui') ||
      dep.includes('bootstrap') || dep.includes('semantic-ui') || dep.includes('chakra-ui') ||
      dep.includes('tailwind') || dep.includes('styled-components')
    );

    return {
      current_frameworks: uiFrameworks,
      shadcn_migration_effort: uiFrameworks.length === 0 ? 'LOW' : 
                               uiFrameworks.some(f => f.includes('tailwind')) ? 'MEDIUM' : 'HIGH',
      notes: uiFrameworks.length === 0 ? 'No UI framework detected' : `UI migration needed: ${uiFrameworks.join(', ')}`
    };
  }

  analyzeBuildTools(deps) {
    const buildTools = Object.keys(deps).filter(dep =>
      dep.includes('webpack') || dep.includes('vite') || dep.includes('rollup') ||
      dep.includes('parcel') || dep.includes('esbuild')
    );

    return {
      current_tools: buildTools,
      vite_compatible: buildTools.includes('vite') || buildTools.length === 0,
      migration_effort: buildTools.includes('vite') ? 'LOW' : buildTools.length === 0 ? 'LOW' : 'MEDIUM'
    };
  }

  analyzeTestingFramework(deps) {
    const testingFrameworks = Object.keys(deps).filter(dep =>
      dep.includes('jest') || dep.includes('vitest') || dep.includes('mocha') ||
      dep.includes('jasmine') || dep.includes('cypress') || dep.includes('playwright')
    );

    return {
      current_frameworks: testingFrameworks,
      vitest_compatible: testingFrameworks.includes('vitest') || testingFrameworks.includes('jest'),
      migration_effort: testingFrameworks.includes('vitest') ? 'LOW' : 'MEDIUM'
    };
  }

  calculateCompatibilityScore(stackCompat) {
    let score = 0;
    let maxScore = 0;

    // React compatibility (25%)
    maxScore += 25;
    if (stackCompat.react.compatible) score += 25;
    else if (stackCompat.react.migration_needed) score += 15;

    // TypeScript support (20%)
    maxScore += 20;
    if (stackCompat.typescript.supported) score += 20;

    // Database compatibility (20%)
    maxScore += 20;
    if (stackCompat.database.supabase_compatible) score += 20;
    else if (stackCompat.database.migration_complexity === 'MEDIUM') score += 10;

    // UI Framework (15%)
    maxScore += 15;
    if (stackCompat.ui_framework.shadcn_migration_effort === 'LOW') score += 15;
    else if (stackCompat.ui_framework.shadcn_migration_effort === 'MEDIUM') score += 8;

    // Build tools (10%)
    maxScore += 10;
    if (stackCompat.build_tools.vite_compatible) score += 10;

    // Testing (10%)
    maxScore += 10;
    if (stackCompat.testing.vitest_compatible) score += 10;

    return Math.round((score / maxScore) * 100);
  }

  async analyzeComplexity(packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const depCount = Object.keys(deps).length;
    
    return {
      dependency_count: depCount,
      complexity_level: depCount < 20 ? 'LOW' : depCount < 50 ? 'MEDIUM' : 'HIGH',
      estimated_migration_weeks: this.estimateMigrationTime(depCount),
      critical_dependencies: this.identifyCriticalDependencies(deps),
      potential_blockers: this.identifyPotentialBlockers(deps)
    };
  }

  estimateMigrationTime(depCount) {
    if (depCount < 20) return '2-3 weeks';
    if (depCount < 50) return '3-5 weeks';
    return '5-8 weeks';
  }

  identifyCriticalDependencies(deps) {
    const critical = [];
    const criticalPatterns = [
      'react', 'vue', 'angular', 'next', 'nuxt',
      'express', 'fastify', 'koa',
      'postgres', 'mysql', 'mongodb',
      'redis', 'elasticsearch'
    ];

    for (const [dep, version] of Object.entries(deps)) {
      if (criticalPatterns.some(pattern => dep.toLowerCase().includes(pattern))) {
        critical.push({ name: dep, version });
      }
    }

    return critical;
  }

  identifyPotentialBlockers(deps) {
    const blockers = [];
    const blockerPatterns = [
      { pattern: 'electron', reason: 'Desktop app framework - major architecture change needed' },
      { pattern: 'react-native', reason: 'Mobile framework - different target platform' },
      { pattern: 'angular', reason: 'Different frontend framework - complete rewrite needed' },
      { pattern: 'vue', reason: 'Different frontend framework - complete rewrite needed' }
    ];

    for (const dep of Object.keys(deps)) {
      for (const blocker of blockerPatterns) {
        if (dep.toLowerCase().includes(blocker.pattern)) {
          blockers.push({
            dependency: dep,
            reason: blocker.reason,
            severity: 'HIGH'
          });
        }
      }
    }

    return blockers;
  }

  async generateRecommendations(packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const recommendations = [];

    // Basado en el análisis de compatibilidad
    const compat = await this.assessCompatibility(packageJson);
    
    if (compat.overall_score >= 80) {
      recommendations.push({
        type: 'PROCEED',
        priority: 'HIGH',
        message: 'Excelente candidato para porte - alta compatibilidad con nuestro stack'
      });
    } else if (compat.overall_score >= 60) {
      recommendations.push({
        type: 'PROCEED_WITH_CAUTION',
        priority: 'MEDIUM',
        message: 'Candidato viable pero requiere adaptaciones significativas'
      });
    } else {
      recommendations.push({
        type: 'EVALUATE_ALTERNATIVES',
        priority: 'LOW',
        message: 'Baja compatibilidad - considerar desarrollo propio o alternativas'
      });
    }

    // Recomendaciones específicas
    if (!compat.stack_compatibility.react.compatible) {
      recommendations.push({
        type: 'TECHNICAL',
        priority: 'HIGH',
        message: 'Migración completa a React requerida'
      });
    }

    if (!compat.stack_compatibility.typescript.supported) {
      recommendations.push({
        type: 'TECHNICAL',
        priority: 'HIGH',
        message: 'Migración completa a TypeScript requerida'
      });
    }

    return recommendations;
  }

  async generateReports() {
    // Generar reporte principal
    const mainReport = {
      component_name: this.componentName,
      repository_url: this.repoUrl,
      analysis_date: this.timestamp,
      analysis_version: 'VTK 1.0',
      status: 'INITIAL_ANALYSIS_COMPLETE',
      next_steps: [
        'Review generated reports',
        'Validate compatibility assessment',
        'Create detailed adaptation plan',
        'Estimate resources and timeline',
        'Get stakeholder approval'
      ]
    };

    await fs.writeFile(
      path.join(this.reportsDir, 'analysis-summary.json'),
      JSON.stringify(mainReport, null, 2)
    );

    console.log('📊 Reportes generados');
  }

  async createInitialDocs() {
    const readmeContent = `# ${this.componentName} - Análisis de Porte

**Fecha de Análisis**: ${this.timestamp}  
**Repositorio Original**: ${this.repoUrl}  
**Framework**: VTK 1.0 - Reglas de Porte  

## 📋 Estado del Análisis

- [x] Estructura de directorios creada
- [x] Repositorio clonado y analizado
- [x] Reportes de compatibilidad generados
- [ ] Plan de adaptación creado
- [ ] Timeline y recursos estimados
- [ ] Aprobación de stakeholders

## 📊 Reportes Generados

- \`04-analysis-reports/package-analysis.json\` - Análisis detallado de dependencias
- \`04-analysis-reports/analysis-summary.json\` - Resumen ejecutivo

## 🎯 Próximos Pasos

1. Revisar reportes de compatibilidad
2. Crear plan detallado de adaptación
3. Estimar recursos y timeline
4. Presentar propuesta para aprobación
5. Si aprobado, proceder con setup de porte

## 📖 Documentación

Para más información sobre el proceso de porte, consulta:
- \`docs/VTK_METHODOLOGY/03_PROCESSES/PORTE_FRAMEWORK_RULES.md\`

---

*Generado automáticamente por generate-porte-analysis.js*
`;

    await fs.writeFile(
      path.join(this.analysisDir, 'README.md'),
      readmeContent
    );

    console.log('📝 Documentación inicial creada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, componentName, repoUrl] = process.argv;

  if (!componentName || !repoUrl) {
    console.error('❌ Uso: node scripts/generate-porte-analysis.js [nombre] [repo_url]');
    console.error('   Ejemplo: node scripts/generate-porte-analysis.js "n8n" "https://github.com/n8n-io/n8n"');
    process.exit(1);
  }

  const analyzer = new PorteAnalyzer(componentName, repoUrl);
  analyzer.generateAnalysis();
}

module.exports = PorteAnalyzer;
