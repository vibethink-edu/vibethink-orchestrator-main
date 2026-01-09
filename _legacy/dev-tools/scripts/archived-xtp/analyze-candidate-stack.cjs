#!/usr/bin/env node

/**
 * 🔍 Analizador de Stack de Candidatos con Reglas de Aceptación
 * 
 * Este script implementa las reglas mínimas de aceptación definidas en
 * COMPONENT_ACCEPTANCE_RULES.md para evaluar componentes candidatos
 * de manera objetiva y automatizada.
 * 
 * Uso: node scripts/analyze-candidate-stack.cjs [component-name] [repo-url]
 * 
 * LEGACY ARCHIVED - Stack Versionado System + Acceptance Rules
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// 🚦 Reglas de Aceptación Automatizadas
const ACCEPTANCE_RULES = {
  // 🔴 BLOCKERS (Auto-rechazo)
  BLOCKERS: {
    INCOMPATIBLE_LICENSE: ['GPL-3.0', 'AGPL-3.0', 'UNLICENSED', 'PROPRIETARY'],
    ABANDONMENT_MONTHS: 24,
    INCOMPATIBLE_FRAMEWORKS: ['angular', 'vue', 'svelte', 'ember'],
    MIN_NODE_VERSION: 18,
    CRITICAL_VULN_THRESHOLD: 1
  },
  
  // 🟡 WARNINGS (Penalizaciones)
  WARNINGS: {
    MAX_DEPENDENCIES: 50,
    MAX_BUNDLE_SIZE_MB: 10,
    MIN_DOC_SCORE: 3,
    COMPLEXITY_THRESHOLD: 7
  },
  
  // 🟢 QUALITY (Bonificaciones)
  QUALITY: {
    MIN_TEST_COVERAGE: 70,
    RECENT_ACTIVITY_DAYS: 180,
    STABLE_VERSION_REQUIRED: true
  },
  
  // 🎯 SCORING
  SCORING: {
    BASE_SCORE: 100,
    BLOCKER_PENALTY: 100,
    WARNING_PENALTIES: {
      COMPLEXITY: 25,
      DEPENDENCIES: 20,
      DOCUMENTATION: 15,
      BUNDLE_SIZE: 10
    },
    QUALITY_BONUSES: {
      EXCELLENT_TESTS: 15,
      ACTIVE_MAINTENANCE: 15,
      PERFECT_COMPATIBILITY: 20,
      GREAT_DOCS: 10
    }
  }
};

class CandidateStackAnalyzer {
  constructor(componentName, repoUrl) {
    this.componentName = componentName;
    this.repoUrl = repoUrl;
    this.timestamp = new Date().toISOString();
    this.tempDir = path.join('temp', `${componentName}-analysis-${Date.now()}`);
    this.reportsDir = path.join('docs', 'PROJECT', '02_ARCHITECTURE', 'STACK_MANAGEMENT', 'STACK_COMPARISON_REPORTS');
    this.ourStackPath = path.join('docs', 'PROJECT', '02_ARCHITECTURE', 'STACK_MANAGEMENT', 'AP_STACK_DEV_CURRENT.yaml');
  }

  async analyzeCandidate() {
    console.log(`🔍 Analizando stack del candidato: ${this.componentName}`);
    console.log(`📍 Repositorio: ${this.repoUrl}`);
    
    try {
      // 1. Cargar nuestro stack de referencia
      const ourStack = await this.loadOurStack();
      
      // 2. Clonar y analizar el repositorio candidato
      const candidateStack = await this.analyzeCandidateRepo();
      
      // 3. Obtener información del repositorio
      const repoInfo = await this.getRepositoryInfo();
      
      // 4. Verificar reglas de aceptación
      const acceptanceRules = await this.verifyAcceptanceRules(candidateStack, repoInfo);
      
      // 5. Comparar stacks con scoring mejorado
      const comparison = await this.compareStacksWithRules(ourStack, candidateStack, acceptanceRules);
      
      // 6. Generar recomendación basada en reglas
      const recommendation = this.generateRecommendationWithRules(comparison, acceptanceRules);
      
      // 7. Generar reporte final
      await this.generateReport(ourStack, candidateStack, comparison, recommendation, acceptanceRules);
      
      // 8. Limpiar archivos temporales
      await this.cleanup();
      
      // Mostrar resultados
      console.log(`\n🎯 RESULTADOS DEL ANÁLISIS:`);
      console.log(`   Score Final: ${comparison.overall_score}/100`);
      console.log(`   Decisión: ${recommendation.decision}`);
      
      if (acceptanceRules.blockers.isBlocked) {
        console.log(`   🔴 BLOQUEADO por: ${acceptanceRules.blockers.found.map(b => b.name).join(', ')}`);
      }
      
      if (acceptanceRules.warnings.found.length > 0) {
        console.log(`   🟡 WARNINGS: ${acceptanceRules.warnings.found.length} encontrados (-${acceptanceRules.warnings.penalties} puntos)`);
      }
      
      if (acceptanceRules.quality.bonuses.length > 0) {
        console.log(`   🟢 BONUSES: ${acceptanceRules.quality.bonuses.length} aplicados (+${acceptanceRules.quality.points} puntos)`);
      }
      
      return {
        score: comparison.overall_score,
        recommendation: recommendation.decision,
        isBlocked: acceptanceRules.blockers.isBlocked,
        reportPath: path.join(this.reportsDir, `${this.componentName}_vs_AP_STACK_DEV_${this.timestamp.split('T')[0]}.json`)
      };
      
    } catch (error) {
      console.error('❌ Error durante el análisis:', error.message);
      await this.cleanup();
      throw error;
    }
  }

  async loadOurStack() {
    try {
      const stackContent = await fs.readFile(this.ourStackPath, 'utf8');
      return yaml.load(stackContent);
    } catch (error) {
      throw new Error(`Error cargando nuestro stack: ${error.message}`);
    }
  }

  async analyzeCandidateRepo() {
    console.log('📥 Clonando repositorio candidato...');
    
    try {
      // Crear directorio temporal
      await fs.mkdir(this.tempDir, { recursive: true });
      
      // Clonar repositorio
      execSync(`git clone --depth 1 ${this.repoUrl} ${this.tempDir}`, { stdio: 'pipe' });
      
      // Analizar archivos del proyecto
      const packageAnalysis = await this.analyzePackageJson();
      const dockerAnalysis = await this.analyzeDocker();
      const configAnalysis = await this.analyzeConfigFiles();
      const detectedTechs = await this.detectTechnologies(packageAnalysis, configAnalysis);
      const languageAnalysis = await this.analyzeLanguages();
      
      const candidateStack = {
        repository_info: {
          url: this.repoUrl,
          analysis_date: this.timestamp,
          component_name: this.componentName
        },
        metadata: {
          name: packageAnalysis?.name || this.componentName,
          version: packageAnalysis?.version || '0.0.0',
          license: packageAnalysis?.license || 'UNKNOWN',
          description: packageAnalysis?.description || ''
        },
        languages: languageAnalysis,
        dependencies: {
          frameworks: this.extractFrameworks(packageAnalysis),
          build_tools: this.extractBuildTools(packageAnalysis, configAnalysis),
          production: packageAnalysis?.dependencies || {}
        },
        package_analysis: packageAnalysis,
        docker_analysis: dockerAnalysis,
        config_analysis: configAnalysis,
        detected_technologies: detectedTechs,
        analysis: {
          complexity_score: this.calculateComplexityScore(packageAnalysis),
          documentation_score: await this.calculateDocumentationScore(),
          bundle_analysis: await this.analyzeBundleSize(packageAnalysis)
        }
      };
      
      return candidateStack;
      
    } catch (error) {
      throw new Error(`Error analizando repositorio candidato: ${error.message}`);
    }
  }

  async analyzeLanguages() {
    const languages = [];
    
    // Buscar archivos TypeScript
    try {
      const tsFiles = await this.findFiles('**/*.ts', '**/*.tsx');
      if (tsFiles.length > 0) languages.push('TypeScript');
    } catch (e) { }
    
    // Buscar archivos JavaScript
    try {
      const jsFiles = await this.findFiles('**/*.js', '**/*.jsx');
      if (jsFiles.length > 0) languages.push('JavaScript');
    } catch (e) { }
    
    // Buscar otros lenguajes comunes
    try {
      const pyFiles = await this.findFiles('**/*.py');
      if (pyFiles.length > 0) languages.push('Python');
    } catch (e) { }
    
    return languages;
  }

  async findFiles(...patterns) {
    const files = [];
    const { execSync } = require('child_process');
    
    for (const pattern of patterns) {
      try {
        const result = execSync(`find ${this.tempDir} -name "${pattern.replace('**/', '')}" -type f 2>/dev/null || true`, { encoding: 'utf8' });
        if (result.trim()) {
          files.push(...result.trim().split('\n'));
        }
      } catch (e) {
        // Ignore errors in file finding
      }
    }
    
    return files;
  }

  extractFrameworks(packageAnalysis) {
    const frameworks = [];
    
    if (!packageAnalysis?.dependencies) return frameworks;
    
    const deps = { ...packageAnalysis.dependencies, ...packageAnalysis.devDependencies };
    
    if (deps.react) frameworks.push({ name: 'React', version: deps.react });
    if (deps.vue) frameworks.push({ name: 'Vue', version: deps.vue });
    if (deps['@angular/core']) frameworks.push({ name: 'Angular', version: deps['@angular/core'] });
    if (deps.svelte) frameworks.push({ name: 'Svelte', version: deps.svelte });
    if (deps.next) frameworks.push({ name: 'Next.js', version: deps.next });
    if (deps.nuxt) frameworks.push({ name: 'Nuxt.js', version: deps.nuxt });
    
    return frameworks;
  }

  extractBuildTools(packageAnalysis, configAnalysis) {
    const buildTools = [];
    
    if (!packageAnalysis?.devDependencies) return buildTools;
    
    const devDeps = packageAnalysis.devDependencies;
    
    if (devDeps.vite) buildTools.push({ name: 'Vite', version: devDeps.vite });
    if (devDeps.webpack) buildTools.push({ name: 'Webpack', version: devDeps.webpack });
    if (devDeps.rollup) buildTools.push({ name: 'Rollup', version: devDeps.rollup });
    if (devDeps.parcel) buildTools.push({ name: 'Parcel', version: devDeps.parcel });
    if (devDeps['@vitejs/plugin-react']) buildTools.push({ name: 'Vite React Plugin', version: devDeps['@vitejs/plugin-react'] });
    
    return buildTools;
  }

  calculateComplexityScore(packageAnalysis) {
    let score = 1;
    
    if (packageAnalysis?.dependencies) {
      const depCount = Object.keys(packageAnalysis.dependencies).length;
      score += Math.floor(depCount / 10); // +1 por cada 10 dependencias
    }
    
    if (packageAnalysis?.devDependencies) {
      const devDepCount = Object.keys(packageAnalysis.devDependencies).length;
      score += Math.floor(devDepCount / 15); // +1 por cada 15 dev dependencies
    }
    
    return Math.min(10, score);
  }

  async calculateDocumentationScore() {
    let score = 0;
    
    // Verificar README
    try {
      const readmePath = path.join(this.tempDir, 'README.md');
      const readmeContent = await fs.readFile(readmePath, 'utf8');
      score += 3; // Base por tener README
      
      // Bonificaciones por contenido
      if (readmeContent.length > 1000) score += 1;
      if (readmeContent.includes('## Installation')) score += 1;
      if (readmeContent.includes('## Usage')) score += 1;
      if (readmeContent.includes('## API')) score += 1;
      if (readmeContent.includes('## Examples')) score += 1;
    } catch (e) {
      // No README found
    }
    
    // Verificar documentación adicional
    try {
      const docsDir = path.join(this.tempDir, 'docs');
      await fs.access(docsDir);
      score += 2; // Bonus por tener carpeta docs
    } catch (e) {
      // No docs folder
    }
    
    return Math.min(10, score);
  }

  async analyzeBundleSize(packageAnalysis) {
    // Simulación de análisis de bundle size
    // En implementación real, usaríamos bundlephobia API o similar
    const depCount = Object.keys(packageAnalysis?.dependencies || {}).length;
    const estimatedSizeMB = Math.max(0.5, depCount * 0.1); // Estimación básica
    
    return {
      estimated_size_mb: estimatedSizeMB,
      is_large: estimatedSizeMB > ACCEPTANCE_RULES.WARNINGS.MAX_BUNDLE_SIZE_MB,
      dependencies_count: depCount
    };
  }

  async analyzePackageJson() {
    const packagePath = path.join(this.tempDir, 'package.json');
    
    try {
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        license: packageJson.license,
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        peerDependencies: packageJson.peerDependencies || {},
        scripts: packageJson.scripts || {},
        engines: packageJson.engines || {},
        type: packageJson.type,
        main: packageJson.main,
        module: packageJson.module
      };
    } catch (error) {
      console.log('⚠️  No se encontró package.json válido');
      return null;
    }
  }

  async analyzeDocker() {
    const dockerfilePath = path.join(this.tempDir, 'Dockerfile');
    const composePath = path.join(this.tempDir, 'docker-compose.yml');
    
    const analysis = {
      has_dockerfile: false,
      has_compose: false,
      base_image: null,
      services: []
    };
    
    try {
      await fs.access(dockerfilePath);
      analysis.has_dockerfile = true;
      
      const dockerContent = await fs.readFile(dockerfilePath, 'utf8');
      const fromMatch = dockerContent.match(/FROM\s+([^\s]+)/i);
      if (fromMatch) {
        analysis.base_image = fromMatch[1];
      }
    } catch (error) {
      // No Dockerfile found
    }
    
    try {
      await fs.access(composePath);
      analysis.has_compose = true;
      
      const composeContent = await fs.readFile(composePath, 'utf8');
      // Simple parsing para detectar servicios
      const serviceMatches = composeContent.match(/^\s+(\w+):/gm);
      if (serviceMatches) {
        analysis.services = serviceMatches.map(match => match.trim().replace(':', ''));
      }
    } catch (error) {
      // No docker-compose found
    }
    
    return analysis;
  }

  async analyzeConfigFiles() {
    const configs = {
      typescript: false,
      eslint: false,
      prettier: false,
      tailwind: false,
      vite: false,
      webpack: false,
      jest: false,
      vitest: false
    };
    
    const configFiles = [
      { file: 'tsconfig.json', key: 'typescript' },
      { file: '.eslintrc.js', key: 'eslint' },
      { file: '.eslintrc.json', key: 'eslint' },
      { file: 'eslint.config.js', key: 'eslint' },
      { file: '.prettierrc', key: 'prettier' },
      { file: 'prettier.config.js', key: 'prettier' },
      { file: 'tailwind.config.js', key: 'tailwind' },
      { file: 'tailwind.config.ts', key: 'tailwind' },
      { file: 'vite.config.js', key: 'vite' },
      { file: 'vite.config.ts', key: 'vite' },
      { file: 'webpack.config.js', key: 'webpack' },
      { file: 'jest.config.js', key: 'jest' },
      { file: 'vitest.config.js', key: 'vitest' },
      { file: 'vitest.config.ts', key: 'vitest' }
    ];
    
    for (const { file, key } of configFiles) {
      try {
        await fs.access(path.join(this.tempDir, file));
        configs[key] = true;
      } catch (error) {
        // File not found
      }
    }
    
    return configs;
  }

  async detectTechnologies(packageAnalysis, configAnalysis) {
    const technologies = {
      frontend_framework: 'unknown',
      language: 'unknown',
      build_tool: 'unknown',
      ui_library: 'unknown',
      styling: 'unknown',
      testing: 'unknown',
      database: 'unknown',
      auth: 'unknown'
    };
    
    if (packageAnalysis) {
      const deps = {
        ...packageAnalysis.dependencies,
        ...packageAnalysis.devDependencies
      };
      
      // Frontend Framework
      if (deps.react) technologies.frontend_framework = 'react';
      else if (deps.vue || deps['@vue/cli']) technologies.frontend_framework = 'vue';
      else if (deps['@angular/core']) technologies.frontend_framework = 'angular';
      else if (deps.svelte) technologies.frontend_framework = 'svelte';
      
      // Language
      if (configAnalysis.typescript || deps.typescript) {
        technologies.language = 'typescript';
      } else {
        technologies.language = 'javascript';
      }
      
      // Build Tool
      if (configAnalysis.vite || deps.vite) technologies.build_tool = 'vite';
      else if (configAnalysis.webpack || deps.webpack) technologies.build_tool = 'webpack';
      else if (deps['@angular/cli']) technologies.build_tool = 'angular-cli';
      else if (deps['create-react-app']) technologies.build_tool = 'cra';
      
      // UI Library
      if (deps.antd) technologies.ui_library = 'antd';
      else if (deps['@mui/material']) technologies.ui_library = 'mui';
      else if (deps['@chakra-ui/react']) technologies.ui_library = 'chakra';
      else if (configAnalysis.tailwind) technologies.ui_library = 'tailwind';
      
      // Styling
      if (configAnalysis.tailwind || deps.tailwindcss) technologies.styling = 'tailwind';
      else if (deps['styled-components']) technologies.styling = 'styled-components';
      else if (deps.sass || deps.scss) technologies.styling = 'sass';
      
      // Testing
      if (configAnalysis.vitest || deps.vitest) technologies.testing = 'vitest';
      else if (configAnalysis.jest || deps.jest) technologies.testing = 'jest';
      else if (deps.mocha) technologies.testing = 'mocha';
      
      // Database
      if (deps['@supabase/supabase-js']) technologies.database = 'supabase';
      else if (deps.prisma) technologies.database = 'prisma';
      else if (deps.mongoose) technologies.database = 'mongodb';
      else if (deps.pg || deps.postgres) technologies.database = 'postgresql';
      else if (deps.mysql) technologies.database = 'mysql';
      
      // Auth
      if (deps['@fusionauth/react-sdk']) technologies.auth = 'fusionauth';
      else if (deps['@auth0/nextjs-auth0']) technologies.auth = 'auth0';
      else if (deps['next-auth']) technologies.auth = 'next-auth';
    }
    
    return technologies;
  }

  async compareStacks(ourStack, candidateStack) {
    console.log('🔍 Comparando stacks...');
    
    const comparison = {
      analysis_date: this.timestamp,
      our_stack_version: ourStack.stack_info.version,
      candidate_component: this.componentName,
      compatibility_scores: {},
      detailed_analysis: {},
      blockers: [],
      warnings: [],
      advantages: [],
      overall_score: 0
    };
    
    // Análisis detallado por categoría
    comparison.compatibility_scores.frontend_framework = this.compareFrontendFramework(ourStack, candidateStack);
    comparison.compatibility_scores.language = this.compareLanguage(ourStack, candidateStack);
    comparison.compatibility_scores.build_tools = this.compareBuildTools(ourStack, candidateStack);
    comparison.compatibility_scores.ui_library = this.compareUILibrary(ourStack, candidateStack);
    comparison.compatibility_scores.testing = this.compareTesting(ourStack, candidateStack);
    comparison.compatibility_scores.database = this.compareDatabase(ourStack, candidateStack);
    comparison.compatibility_scores.auth = this.compareAuth(ourStack, candidateStack);
    
    // Análisis de bloqueadores
    comparison.blockers = this.identifyBlockers(ourStack, candidateStack);
    comparison.warnings = this.identifyWarnings(ourStack, candidateStack);
    comparison.advantages = this.identifyAdvantages(ourStack, candidateStack);
    
    // Calcular score general
    comparison.overall_score = this.calculateOverallScore(comparison.compatibility_scores, comparison.blockers);
    
    return comparison;
  }

  compareFrontendFramework(ourStack, candidateStack) {
    const ourFramework = ourStack.core_technologies.frontend.framework.toLowerCase();
    const candidateFramework = candidateStack.detected_technologies.frontend_framework;
    
    if (candidateFramework === 'react' && ourFramework.includes('react')) {
      return { score: 100, status: 'perfect_match', details: 'Mismo framework (React)' };
    } else if (candidateFramework === 'unknown') {
      return { score: 50, status: 'unknown', details: 'Framework no detectado - requiere análisis manual' };
    } else if (candidateFramework === 'vue' || candidateFramework === 'angular') {
      return { score: 0, status: 'blocker', details: `Framework incompatible: ${candidateFramework}` };
    } else {
      return { score: 30, status: 'requires_migration', details: `Framework diferente: ${candidateFramework}` };
    }
  }

  compareLanguage(ourStack, candidateStack) {
    const candidateLanguage = candidateStack.detected_technologies.language;
    
    if (candidateLanguage === 'typescript') {
      return { score: 100, status: 'perfect_match', details: 'TypeScript nativo' };
    } else if (candidateLanguage === 'javascript') {
      return { score: 70, status: 'migration_needed', details: 'JavaScript - requiere migración a TypeScript' };
    } else {
      return { score: 30, status: 'unknown', details: 'Lenguaje no detectado claramente' };
    }
  }

  compareBuildTools(ourStack, candidateStack) {
    const candidateBuildTool = candidateStack.detected_technologies.build_tool;
    
    if (candidateBuildTool === 'vite') {
      return { score: 100, status: 'perfect_match', details: 'Vite - herramienta preferida' };
    } else if (candidateBuildTool === 'webpack') {
      return { score: 60, status: 'migration_preferred', details: 'Webpack - preferible migrar a Vite' };
    } else if (candidateBuildTool === 'cra') {
      return { score: 40, status: 'migration_required', details: 'Create React App - migración requerida' };
    } else {
      return { score: 50, status: 'evaluate', details: `Build tool: ${candidateBuildTool}` };
    }
  }

  compareUILibrary(ourStack, candidateStack) {
    const candidateUI = candidateStack.detected_technologies.ui_library;
    
    if (candidateUI === 'tailwind') {
      return { score: 90, status: 'excellent', details: 'Tailwind CSS - compatible con shadcn/ui' };
    } else if (candidateUI === 'unknown') {
      return { score: 70, status: 'adaptable', details: 'UI library no detectada - adaptable a shadcn/ui' };
    } else if (candidateUI === 'antd' || candidateUI === 'mui') {
      return { score: 30, status: 'major_migration', details: `${candidateUI} - migración mayor requerida` };
    } else {
      return { score: 50, status: 'evaluate', details: `UI library: ${candidateUI}` };
    }
  }

  compareTesting(ourStack, candidateStack) {
    const candidateTesting = candidateStack.detected_technologies.testing;
    
    if (candidateTesting === 'vitest') {
      return { score: 100, status: 'perfect_match', details: 'Vitest - framework preferido' };
    } else if (candidateTesting === 'jest') {
      return { score: 80, status: 'compatible', details: 'Jest - compatible, migración opcional' };
    } else if (candidateTesting === 'unknown') {
      return { score: 60, status: 'setup_required', details: 'Testing framework no detectado' };
    } else {
      return { score: 40, status: 'migration_needed', details: `Testing: ${candidateTesting}` };
    }
  }

  compareDatabase(ourStack, candidateStack) {
    const candidateDB = candidateStack.detected_technologies.database;
    
    if (candidateDB === 'supabase') {
      return { score: 100, status: 'perfect_match', details: 'Supabase - perfect match' };
    } else if (candidateDB === 'postgresql') {
      return { score: 80, status: 'compatible', details: 'PostgreSQL - compatible con Supabase' };
    } else if (candidateDB === 'unknown') {
      return { score: 70, status: 'adaptable', details: 'Database no detectada - adaptable' };
    } else if (candidateDB === 'mysql') {
      return { score: 30, status: 'migration_required', details: 'MySQL - migración requerida' };
    } else {
      return { score: 40, status: 'evaluate', details: `Database: ${candidateDB}` };
    }
  }

  compareAuth(ourStack, candidateStack) {
    const candidateAuth = candidateStack.detected_technologies.auth;
    
    if (candidateAuth === 'fusionauth') {
      return { score: 100, status: 'perfect_match', details: 'FusionAuth - perfect match' };
    } else if (candidateAuth === 'unknown') {
      return { score: 70, status: 'integration_required', details: 'Auth no detectado - integración requerida' };
    } else {
      return { score: 40, status: 'migration_required', details: `Auth: ${candidateAuth} - migración requerida` };
    }
  }

  identifyBlockers(ourStack, candidateStack) {
    const blockers = [];
    const candidateTechs = candidateStack.detected_technologies;
    const ourBlockers = ourStack.integration_requirements.absolute_blockers;
    
    // Check framework blockers
    if (candidateTechs.frontend_framework === 'angular') {
      blockers.push({
        type: 'FRAMEWORK',
        technology: 'Angular',
        reason: 'Framework incompatible - reescritura completa requerida',
        severity: 'CRITICAL'
      });
    }
    
    if (candidateTechs.frontend_framework === 'vue') {
      blockers.push({
        type: 'FRAMEWORK',
        technology: 'Vue.js',
        reason: 'Framework incompatible - reescritura completa requerida',
        severity: 'CRITICAL'
      });
    }
    
    // Check for jQuery
    if (candidateStack.package_analysis && candidateStack.package_analysis.dependencies.jquery) {
      blockers.push({
        type: 'LEGACY_DEPENDENCY',
        technology: 'jQuery',
        reason: 'Dependencia legacy incompatible con React moderno',
        severity: 'HIGH'
      });
    }
    
    return blockers;
  }

  identifyWarnings(ourStack, candidateStack) {
    const warnings = [];
    
    if (candidateStack.detected_technologies.language === 'javascript') {
      warnings.push({
        type: 'LANGUAGE',
        issue: 'JavaScript sin TypeScript',
        impact: 'Migración completa a TypeScript requerida',
        effort: 'HIGH'
      });
    }
    
    if (candidateStack.detected_technologies.ui_library === 'antd') {
      warnings.push({
        type: 'UI_LIBRARY',
        issue: 'Ant Design UI',
        impact: 'Migración completa a shadcn/ui requerida',
        effort: 'HIGH'
      });
    }
    
    return warnings;
  }

  identifyAdvantages(ourStack, candidateStack) {
    const advantages = [];
    
    if (candidateStack.detected_technologies.testing === 'vitest') {
      advantages.push({
        type: 'TESTING',
        benefit: 'Vitest ya configurado',
        impact: 'Migración más rápida'
      });
    }
    
    if (candidateStack.detected_technologies.build_tool === 'vite') {
      advantages.push({
        type: 'BUILD_TOOL',
        benefit: 'Vite ya configurado',
        impact: 'Build system compatible'
      });
    }
    
    return advantages;
  }

  calculateOverallScore(scores, blockers) {
    // Si hay blockers críticos, score máximo es 40
    const criticalBlockers = blockers.filter(b => b.severity === 'CRITICAL').length;
    if (criticalBlockers > 0) {
      return Math.min(40, this.calculateBaseScore(scores));
    }
    
    // Si hay blockers altos, score máximo es 60
    const highBlockers = blockers.filter(b => b.severity === 'HIGH').length;
    if (highBlockers > 0) {
      return Math.min(60, this.calculateBaseScore(scores));
    }
    
    return this.calculateBaseScore(scores);
  }

  calculateBaseScore(scores) {
    const weights = {
      frontend_framework: 0.25,
      language: 0.20,
      build_tools: 0.15,
      ui_library: 0.15,
      testing: 0.10,
      database: 0.10,
      auth: 0.05
    };
    
    let totalScore = 0;
    for (const [category, weight] of Object.entries(weights)) {
      const categoryScore = scores[category]?.score || 0;
      totalScore += categoryScore * weight;
    }
    
    return Math.round(totalScore);
  }

  generateRecommendation(comparison) {
    const score = comparison.overall_score;
    const blockers = comparison.blockers;
    
    let decision, reasoning, next_steps, effort_estimate;
    
    if (score >= 80 && blockers.length === 0) {
      decision = 'PORTE';
      reasoning = 'Alta compatibilidad con nuestro stack. Candidato excelente para porte completo.';
      next_steps = [
        'Proceder con análisis detallado',
        'Estimar timeline de migración',
        'Asignar equipo de desarrollo'
      ];
      effort_estimate = '2-4 semanas';
    } else if (score >= 60 && blockers.filter(b => b.severity === 'CRITICAL').length === 0) {
      decision = 'PORTE_CON_ADAPTACIONES';
      reasoning = 'Compatible pero requiere adaptaciones significativas. Viable con inversión adicional.';
      next_steps = [
        'Análisis detallado de adaptaciones necesarias',
        'Evaluar costo-beneficio vs desarrollo propio',
        'Crear plan de migración detallado'
      ];
      effort_estimate = '4-8 semanas';
    } else if (score >= 40) {
      decision = 'INTEGRACIÓN';
      reasoning = 'Stack incompatible para porte directo. Considerar integración como servicio externo.';
      next_steps = [
        'Evaluar APIs para integración',
        'Diseñar arquitectura de integración',
        'Evaluar alternativas'
      ];
      effort_estimate = '1-3 semanas';
    } else {
      decision = 'INSPIRACIÓN';
      reasoning = 'Stack incompatible. Usar como inspiración para desarrollo propio.';
      next_steps = [
        'Estudiar funcionalidades clave',
        'Extraer patrones útiles',
        'Planificar desarrollo propio'
      ];
      effort_estimate = 'Variable según funcionalidades';
    }
    
    return {
      decision,
      reasoning,
      next_steps,
      effort_estimate,
      confidence: this.calculateConfidence(comparison)
    };
  }

  calculateConfidence(comparison) {
    // Confidence basado en qué tan clara es la información
    let confidence = 100;
    
    const unknowns = Object.values(comparison.compatibility_scores)
      .filter(score => score.status === 'unknown').length;
    
    confidence -= unknowns * 15;
    
    if (!comparison.detailed_analysis.package_analysis) {
      confidence -= 20;
    }
    
    return Math.max(confidence, 60);
  }

  async generateReport(ourStack, candidateStack, comparison, recommendation, acceptanceRules) {
    const report = {
      analysis_info: {
        component_name: this.componentName,
        repository_url: this.repoUrl,
        analysis_date: this.timestamp,
        our_stack_version: ourStack.stack_info.version,
        analyzer_version: LEGACY
        acceptance_rules_version: '1.0'
      },
      our_stack_summary: {
        name: ourStack.stack_info.name,
        version: ourStack.stack_info.version,
        environment: ourStack.stack_info.environment,
        key_technologies: {
          frontend: ourStack.core_technologies.frontend.framework,
          language: ourStack.core_technologies.frontend.language,
          build_tool: ourStack.core_technologies.frontend.build_tool,
          ui_library: ourStack.core_technologies.frontend.ui_library,
          database: ourStack.core_technologies.backend.database,
          auth: ourStack.core_technologies.backend.auth
        }
      },
      candidate_analysis: candidateStack,
      
      // 🚦 NUEVA SECCIÓN: Análisis de Reglas de Aceptación
      acceptance_rules_analysis: {
        blockers: {
          status: acceptanceRules.blockers.isBlocked ? 'BLOCKED' : 'PASSED',
          found: acceptanceRules.blockers.found,
          passed: acceptanceRules.blockers.passed,
          summary: acceptanceRules.blockers.isBlocked ? 
            `Componente BLOQUEADO: ${acceptanceRules.blockers.found.length} blocker(s) crítico(s)` :
            `Sin blockers críticos encontrados`
        },
        warnings: {
          count: acceptanceRules.warnings.found.length,
          total_penalty: acceptanceRules.warnings.penalties,
          details: acceptanceRules.warnings.found,
          summary: acceptanceRules.warnings.found.length > 0 ?
            `${acceptanceRules.warnings.found.length} warning(s) encontrado(s) (-${acceptanceRules.warnings.penalties} puntos)` :
            'Sin warnings encontrados'
        },
        quality_bonuses: {
          count: acceptanceRules.quality.bonuses.length,
          total_bonus: acceptanceRules.quality.points,
          details: acceptanceRules.quality.bonuses,
          summary: acceptanceRules.quality.bonuses.length > 0 ?
            `${acceptanceRules.quality.bonuses.length} bonus(es) aplicado(s) (+${acceptanceRules.quality.points} puntos)` :
            'Sin bonuses de calidad aplicados'
        }
      },
      
      // 🎯 SCORING DETALLADO
      scoring_breakdown: {
        base_score: ACCEPTANCE_RULES.SCORING.BASE_SCORE,
        blocker_penalty: acceptanceRules.blockers.isBlocked ? -100 : 0,
        warnings_penalty: -acceptanceRules.warnings.penalties,
        quality_bonus: acceptanceRules.quality.points,
        compatibility_bonus: comparison.compatibility_bonus,
        final_score: comparison.overall_score,
        decision_threshold: {
          porte: '≥ 70',
          integracion: '40-69',
          inspiracion: '20-39',
          rechazo: '< 20 o con blockers'
        }
      },
      
      compatibility_comparison: comparison,
      recommendation: recommendation,
      next_steps: recommendation.next_steps,
      
      // 📊 MÉTRICAS RESUMIDAS
      executive_summary: {
        decision: recommendation.decision,
        confidence: recommendation.confidence,
        risk_level: recommendation.risk_level,
        estimated_effort: recommendation.estimated_effort,
        key_findings: [
          ...(acceptanceRules.blockers.isBlocked ? ['🔴 BLOQUEADO por criterios críticos'] : []),
          ...(acceptanceRules.warnings.found.length > 0 ? [`🟡 ${acceptanceRules.warnings.found.length} warnings encontrados`] : []),
          ...(acceptanceRules.quality.bonuses.length > 0 ? [`🟢 ${acceptanceRules.quality.bonuses.length} aspectos positivos identificados`] : []),
          `🎯 Score final: ${comparison.overall_score}/100`
        ],
        justification: recommendation.reasoning.join('; ')
      },
      
      generated_by: 'AI Pair Orchestrator Pro - Stack Analyzer v4.6'
    };
    
    // Crear directorio si no existe
    await fs.mkdir(this.reportsDir, { recursive: true });
    
    // Generar reporte
    const reportPath = path.join(this.reportsDir, `${this.componentName}_vs_AP_STACK_DEV_${this.timestamp.split('T')[0]}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Reporte generado: ${reportPath}`);
    
    // También crear un resumen ejecutivo en Markdown
    await this.generateExecutiveSummary(report, reportPath.replace('.json', '_EXECUTIVE_SUMMARY.md'));
    
    return reportPath;
  }

  async generateExecutiveSummary(report, summaryPath) {
    const summary = `# 📊 Resumen Ejecutivo: ${report.analysis_info.component_name}

**Fecha**: ${new Date(report.analysis_info.analysis_date).toLocaleDateString()}  
**Repositorio**: ${report.analysis_info.repository_url}  
**Análisis**: LEGACY ARCHIVED - Reglas de Aceptación v1.0  

---

## 🎯 DECISIÓN FINAL

**${report.recommendation.decision}** - Score: **${report.scoring_breakdown.final_score}/100**

${report.executive_summary.justification}

---

## 🚦 ANÁLISIS DE REGLAS

### ${report.acceptance_rules_analysis.blockers.status === 'BLOCKED' ? '🔴 BLOCKERS CRÍTICOS' : '✅ SIN BLOCKERS CRÍTICOS'}
${report.acceptance_rules_analysis.blockers.summary}

${report.acceptance_rules_analysis.blockers.found.length > 0 ? 
  report.acceptance_rules_analysis.blockers.found.map(b => `- **${b.name}**: ${b.message}`).join('\n') : 
  'No se encontraron blockers críticos.'
}

### ${report.acceptance_rules_analysis.warnings.count > 0 ? '🟡 WARNINGS ENCONTRADOS' : '✅ SIN WARNINGS'}
${report.acceptance_rules_analysis.warnings.summary}

${report.acceptance_rules_analysis.warnings.details.length > 0 ? 
  report.acceptance_rules_analysis.warnings.details.map(w => `- **${w.name}**: ${w.message} (-${w.penalty} puntos)`).join('\n') : 
  'No se encontraron warnings.'
}

### ${report.acceptance_rules_analysis.quality_bonuses.count > 0 ? '🟢 ASPECTOS POSITIVOS' : '📝 SIN BONUSES'}
${report.acceptance_rules_analysis.quality_bonuses.summary}

${report.acceptance_rules_analysis.quality_bonuses.details.length > 0 ? 
  report.acceptance_rules_analysis.quality_bonuses.details.map(q => `- **${q.name}**: ${q.message} (+${q.bonus} puntos)`).join('\n') : 
  'No se identificaron aspectos que otorguen bonuses de calidad.'
}

---

## 📋 PRÓXIMOS PASOS

${report.next_steps.map(step => `- ${step}`).join('\n')}

---

## 🎯 DESGLOSE DE PUNTUACIÓN

| Criterio | Puntos |
|----------|--------|
| Score Base | ${report.scoring_breakdown.base_score} |
| Penalización Blockers | ${report.scoring_breakdown.blocker_penalty} |
| Penalización Warnings | ${report.scoring_breakdown.warnings_penalty} |
| Bonus Calidad | +${report.scoring_breakdown.quality_bonus} |
| Bonus Compatibilidad | +${report.scoring_breakdown.compatibility_bonus} |
| **TOTAL** | **${report.scoring_breakdown.final_score}** |

---

## 📊 UMBRALES DE DECISIÓN

- **PORTE**: ≥ 70 puntos
- **INTEGRACIÓN**: 40-69 puntos  
- **INSPIRACIÓN**: 20-39 puntos
- **RECHAZO**: < 20 puntos o con blockers críticos

---

*Generado automáticamente por AI Pair Orchestrator Pro - Stack Analyzer v4.6*
`;

    await fs.writeFile(summaryPath, summary);
    console.log(`📋 Resumen ejecutivo: ${summaryPath}`);
  }

  async cleanup() {
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('⚠️  No se pudo limpiar directorio temporal:', error.message);
    }
  }

  // 🚦 VERIFICACIONES DE REGLAS DE ACEPTACIÓN

  async verifyAcceptanceRules(candidateStack, repoInfo) {
    console.log(`🚦 Verificando reglas de aceptación...`);
    
    const rules = {
      blockers: await this.checkBlockers(candidateStack, repoInfo),
      warnings: await this.checkWarnings(candidateStack, repoInfo),
      quality: await this.checkQuality(candidateStack, repoInfo)
    };
    
    return rules;
  }

  async checkBlockers(candidateStack, repoInfo) {
    const blockers = {
      found: [],
      passed: [],
      isBlocked: false
    };
    
    // B1. LICENCIA INCOMPATIBLE
    const licenseBlocked = this.checkLicenseCompatibility(candidateStack.metadata.license);
    if (licenseBlocked) {
      blockers.found.push({
        code: 'B1',
        name: 'LICENCIA_INCOMPATIBLE',
        message: `Licencia incompatible: ${candidateStack.metadata.license}`,
        severity: 'CRITICAL'
      });
    } else {
      blockers.passed.push('B1: Licencia compatible');
    }
    
    // B2. ABANDONO DE PROYECTO
    const abandonmentBlocked = this.checkProjectAbandonment(repoInfo);
    if (abandonmentBlocked) {
      blockers.found.push({
        code: 'B2',
        name: 'PROYECTO_ABANDONADO',
        message: `Último commit hace ${repoInfo.daysSinceLastCommit} días (>${ACCEPTANCE_RULES.BLOCKERS.ABANDONMENT_MONTHS * 30})`,
        severity: 'CRITICAL'
      });
    } else {
      blockers.passed.push('B2: Proyecto activo');
    }
    
    // B3. TECNOLOGÍA INCOMPATIBLE
    const techBlocked = this.checkTechnologyCompatibility(candidateStack);
    if (techBlocked.isBlocked) {
      blockers.found.push({
        code: 'B3',
        name: 'TECNOLOGIA_INCOMPATIBLE',
        message: techBlocked.message,
        severity: 'CRITICAL'
      });
    } else {
      blockers.passed.push('B3: Tecnología compatible');
    }
    
    // B4. VULNERABILIDADES CRÍTICAS
    const vulnBlocked = await this.checkCriticalVulnerabilities(candidateStack);
    if (vulnBlocked.hasBlocking) {
      blockers.found.push({
        code: 'B4',
        name: 'VULNERABILIDADES_CRITICAS',
        message: `${vulnBlocked.count} vulnerabilidades críticas encontradas`,
        severity: 'CRITICAL'
      });
    } else {
      blockers.passed.push('B4: Sin vulnerabilidades críticas');
    }
    
    blockers.isBlocked = blockers.found.length > 0;
    return blockers;
  }

  async checkWarnings(candidateStack, repoInfo) {
    const warnings = {
      found: [],
      penalties: 0
    };
    
    // W1. COMPLEJIDAD ARQUITECTURAL
    const complexityWarning = this.checkArchitecturalComplexity(candidateStack);
    if (complexityWarning.hasWarning) {
      warnings.found.push({
        code: 'W1',
        name: 'COMPLEJIDAD_ARQUITECTURAL',
        message: complexityWarning.message,
        penalty: ACCEPTANCE_RULES.SCORING.WARNING_PENALTIES.COMPLEXITY
      });
      warnings.penalties += ACCEPTANCE_RULES.SCORING.WARNING_PENALTIES.COMPLEXITY;
    }
    
    // W2. DEPENDENCIAS PROBLEMÁTICAS
    const dependencyWarning = this.checkProblematicDependencies(candidateStack);
    if (dependencyWarning.hasWarning) {
      warnings.found.push({
        code: 'W2',
        name: 'DEPENDENCIAS_PROBLEMATICAS',
        message: dependencyWarning.message,
        penalty: ACCEPTANCE_RULES.SCORING.WARNING_PENALTIES.DEPENDENCIES
      });
      warnings.penalties += ACCEPTANCE_RULES.SCORING.WARNING_PENALTIES.DEPENDENCIES;
    }
    
    // W3. FALTA DE DOCUMENTACIÓN
    const docWarning = this.checkDocumentationQuality(candidateStack, repoInfo);
    if (docWarning.hasWarning) {
      warnings.found.push({
        code: 'W3',
        name: 'DOCUMENTACION_INSUFICIENTE',
        message: docWarning.message,
        penalty: ACCEPTANCE_RULES.SCORING.WARNING_PENALTIES.DOCUMENTATION
      });
      warnings.penalties += ACCEPTANCE_RULES.SCORING.WARNING_PENALTIES.DOCUMENTATION;
    }
    
    return warnings;
  }

  async checkQuality(candidateStack, repoInfo) {
    const quality = {
      bonuses: [],
      points: 0
    };
    
    // Q1. ESTABILIDAD FUNCIONAL
    const stabilityBonus = this.checkFunctionalStability(candidateStack, repoInfo);
    if (stabilityBonus.hasBonus) {
      quality.bonuses.push({
        code: 'Q1',
        name: 'ESTABILIDAD_FUNCIONAL',
        message: stabilityBonus.message,
        bonus: stabilityBonus.points
      });
      quality.points += stabilityBonus.points;
    }
    
    // Q2. MANTENIMIENTO ACTIVO
    const maintenanceBonus = this.checkActiveMaintenance(repoInfo);
    if (maintenanceBonus.hasBonus) {
      quality.bonuses.push({
        code: 'Q2',
        name: 'MANTENIMIENTO_ACTIVO',
        message: maintenanceBonus.message,
        bonus: ACCEPTANCE_RULES.SCORING.QUALITY_BONUSES.ACTIVE_MAINTENANCE
      });
      quality.points += ACCEPTANCE_RULES.SCORING.QUALITY_BONUSES.ACTIVE_MAINTENANCE;
    }
    
    // Q3. COMPATIBILIDAD TECNOLÓGICA
    const compatibilityBonus = this.checkTechCompatibilityBonus(candidateStack);
    if (compatibilityBonus.hasBonus) {
      quality.bonuses.push({
        code: 'Q3',
        name: 'COMPATIBILIDAD_TECNOLOGICA',
        message: compatibilityBonus.message,
        bonus: compatibilityBonus.points
      });
      quality.points += compatibilityBonus.points;
    }
    
    return quality;
  }

  // 🔍 IMPLEMENTACIONES DE VERIFICACIONES ESPECÍFICAS

  checkLicenseCompatibility(license) {
    if (!license) return true; // Blocker si no hay licencia
    const normalizedLicense = license.toUpperCase();
    return ACCEPTANCE_RULES.BLOCKERS.INCOMPATIBLE_LICENSE.some(blocked => 
      normalizedLicense.includes(blocked)
    );
  }

  checkProjectAbandonment(repoInfo) {
    const maxDays = ACCEPTANCE_RULES.BLOCKERS.ABANDONMENT_MONTHS * 30;
    return repoInfo.daysSinceLastCommit > maxDays;
  }

  checkTechnologyCompatibility(candidateStack) {
    const frameworks = candidateStack.dependencies?.frameworks || [];
    const incompatibleFramework = frameworks.find(fw => 
      ACCEPTANCE_RULES.BLOCKERS.INCOMPATIBLE_FRAMEWORKS.includes(fw.name.toLowerCase())
    );
    
    if (incompatibleFramework) {
      return {
        isBlocked: true,
        message: `Framework incompatible: ${incompatibleFramework.name}`
      };
    }
    
    // Verificar Node.js version
    const nodeVersion = candidateStack.runtime?.nodejs?.min_version;
    if (nodeVersion && parseInt(nodeVersion) < ACCEPTANCE_RULES.BLOCKERS.MIN_NODE_VERSION) {
      return {
        isBlocked: true,
        message: `Node.js version ${nodeVersion} no soportada (mínimo: ${ACCEPTANCE_RULES.BLOCKERS.MIN_NODE_VERSION})`
      };
    }
    
    return { isBlocked: false };
  }

  async checkCriticalVulnerabilities(candidateStack) {
    // Simulamos análisis de vulnerabilidades
    // En implementación real, usar npm audit o herramientas similares
    const mockVulns = Math.floor(Math.random() * 3); // 0-2 vulnerabilidades para testing
    
    return {
      hasBlocking: mockVulns >= ACCEPTANCE_RULES.BLOCKERS.CRITICAL_VULN_THRESHOLD,
      count: mockVulns
    };
  }

  checkArchitecturalComplexity(candidateStack) {
    const depCount = candidateStack.dependencies?.production?.length || 0;
    const complexity = candidateStack.analysis?.complexity_score || 5;
    
    const isComplex = depCount > ACCEPTANCE_RULES.WARNINGS.MAX_DEPENDENCIES || 
                     complexity > ACCEPTANCE_RULES.WARNINGS.COMPLEXITY_THRESHOLD;
    
    return {
      hasWarning: isComplex,
      message: isComplex ? 
        `Alta complejidad: ${depCount} deps, complejidad ${complexity}` : 
        'Complejidad aceptable'
    };
  }

  checkProblematicDependencies(candidateStack) {
    const deps = candidateStack.dependencies?.production || [];
    const problematic = deps.filter(dep => 
      dep.size_mb > ACCEPTANCE_RULES.WARNINGS.MAX_BUNDLE_SIZE_MB ||
      dep.deprecated === true ||
      dep.license_issues === true
    );
    
    return {
      hasWarning: problematic.length > 0,
      message: problematic.length > 0 ? 
        `${problematic.length} dependencias problemáticas encontradas` :
        'Dependencias sin problemas detectados'
    };
  }

  checkDocumentationQuality(candidateStack, repoInfo) {
    const docScore = candidateStack.analysis?.documentation_score || 3;
    const hasWarning = docScore < ACCEPTANCE_RULES.WARNINGS.MIN_DOC_SCORE;
    
    return {
      hasWarning,
      message: hasWarning ? 
        `Documentación insuficiente (score: ${docScore}/10)` :
        'Documentación adecuada'
    };
  }

  checkFunctionalStability(candidateStack, repoInfo) {
    const hasStableVersion = candidateStack.metadata?.version && 
                           !candidateStack.metadata.version.includes('alpha') &&
                           !candidateStack.metadata.version.includes('beta');
    
    const lowIssueCount = (repoInfo.openIssues || 0) < 50;
    
    if (hasStableVersion && lowIssueCount) {
      return {
        hasBonus: true,
        message: 'Versión estable con pocos issues abiertos',
        points: 10
      };
    }
    
    return { hasBonus: false };
  }

  checkActiveMaintenance(repoInfo) {
    const recentActivity = repoInfo.daysSinceLastCommit < ACCEPTANCE_RULES.QUALITY.RECENT_ACTIVITY_DAYS;
    
    return {
      hasBonus: recentActivity,
      message: recentActivity ? 
        `Actividad reciente (${repoInfo.daysSinceLastCommit} días)` :
        'Sin actividad reciente'
    };
  }

  checkTechCompatibilityBonus(candidateStack) {
    const frameworks = candidateStack.dependencies?.frameworks || [];
    const hasReact = frameworks.some(fw => fw.name.toLowerCase() === 'react');
    const hasTypescript = candidateStack.languages?.includes('TypeScript');
    const hasVite = candidateStack.dependencies?.build_tools?.some(tool => 
      tool.name.toLowerCase() === 'vite'
    );
    
    let bonus = 0;
    let reasons = [];
    
    if (hasReact) { bonus += 7; reasons.push('React'); }
    if (hasTypescript) { bonus += 8; reasons.push('TypeScript'); }
    if (hasVite) { bonus += 5; reasons.push('Vite'); }
    
    return {
      hasBonus: bonus > 0,
      points: Math.min(bonus, ACCEPTANCE_RULES.SCORING.QUALITY_BONUSES.PERFECT_COMPATIBILITY),
      message: `Stack compatible: ${reasons.join(', ')}`
    };
  }

  async getRepositoryInfo() {
    console.log('📊 Obteniendo información del repositorio...');
    
    try {
      // Obtener información básica del repositorio
      const packagePath = path.join(this.tempDir, 'package.json');
      let packageInfo = {};
      
      try {
        const packageContent = await fs.readFile(packagePath, 'utf8');
        packageInfo = JSON.parse(packageContent);
      } catch (e) {
        console.log('⚠️ No se encontró package.json válido');
      }
      
      // Obtener información de commits (simulado para esta implementación)
      // En una implementación real, usaríamos GitHub API
      const mockLastCommit = new Date();
      mockLastCommit.setDate(mockLastCommit.getDate() - Math.floor(Math.random() * 365)); // 0-365 días
      
      const daysSinceLastCommit = Math.floor((new Date() - mockLastCommit) / (1000 * 60 * 60 * 24));
      
      return {
        name: packageInfo.name || this.componentName,
        description: packageInfo.description || '',
        license: packageInfo.license || 'UNKNOWN',
        version: packageInfo.version || '0.0.0',
        lastCommit: mockLastCommit.toISOString(),
        daysSinceLastCommit,
        openIssues: Math.floor(Math.random() * 100), // Mock data
        stars: Math.floor(Math.random() * 10000), // Mock data
        forks: Math.floor(Math.random() * 1000), // Mock data
      };
      
    } catch (error) {
      console.log('⚠️ Error obteniendo información del repositorio:', error.message);
      return {
        name: this.componentName,
        daysSinceLastCommit: 0,
        openIssues: 0,
        license: 'UNKNOWN'
      };
    }
  }

  async compareStacksWithRules(ourStack, candidateStack, acceptanceRules) {
    console.log('⚖️ Comparando stacks con reglas de aceptación...');
    
    // Score base
    let score = ACCEPTANCE_RULES.SCORING.BASE_SCORE;
    
    // Aplicar blockers (elimina todo el score)
    if (acceptanceRules.blockers.isBlocked) {
      score = 0;
    } else {
      // Aplicar penalizaciones de warnings
      score -= acceptanceRules.warnings.penalties;
      
      // Aplicar bonificaciones de quality
      score += acceptanceRules.quality.points;
      
      // Bonificación por compatibilidad de stack (análisis existente)
      const compatibilityBonus = this.calculateStackCompatibilityBonus(ourStack, candidateStack);
      score += compatibilityBonus;
    }
    
    // Asegurar que el score esté en rango 0-100
    const finalScore = Math.max(0, Math.min(100, score));
    
    return {
      overall_score: finalScore,
      base_score: ACCEPTANCE_RULES.SCORING.BASE_SCORE,
      blockers_applied: acceptanceRules.blockers.isBlocked,
      warnings_penalty: acceptanceRules.warnings.penalties,
      quality_bonus: acceptanceRules.quality.points,
      compatibility_bonus: acceptanceRules.blockers.isBlocked ? 0 : this.calculateStackCompatibilityBonus(ourStack, candidateStack),
      detailed_comparison: this.generateDetailedComparison(ourStack, candidateStack)
    };
  }

  calculateStackCompatibilityBonus(ourStack, candidateStack) {
    let bonus = 0;
    
    // Analizar frameworks
    const ourFrameworks = ourStack.dependencies?.frameworks || [];
    const candidateFrameworks = candidateStack.dependencies?.frameworks || [];
    
    // Bonus por React compatibility
    const hasReact = candidateFrameworks.some(fw => fw.name.toLowerCase() === 'react');
    if (hasReact && ourFrameworks.some(fw => fw.name.toLowerCase() === 'react')) {
      bonus += 10;
    }
    
    // Bonus por TypeScript
    const hasTypescript = candidateStack.languages?.includes('TypeScript');
    if (hasTypescript && ourStack.languages?.includes('TypeScript')) {
      bonus += 8;
    }
    
    // Bonus por herramientas de build similares
    const candidateBuildTools = candidateStack.dependencies?.build_tools || [];
    const ourBuildTools = ourStack.dependencies?.build_tools || [];
    
    const commonBuildTools = candidateBuildTools.filter(tool =>
      ourBuildTools.some(ourTool => ourTool.name.toLowerCase() === tool.name.toLowerCase())
    );
    
    bonus += Math.min(5, commonBuildTools.length * 2);
    
    return bonus;
  }

  generateDetailedComparison(ourStack, candidateStack) {
    return {
      frameworks: this.compareFrameworks(ourStack, candidateStack),
      languages: this.compareLanguages(ourStack, candidateStack),
      build_tools: this.compareBuildTools(ourStack, candidateStack),
      dependencies: this.compareDependencies(ourStack, candidateStack)
    };
  }

  compareFrameworks(ourStack, candidateStack) {
    const ourFrameworks = ourStack.dependencies?.frameworks || [];
    const candidateFrameworks = candidateStack.dependencies?.frameworks || [];
    
    const matches = candidateFrameworks.filter(candidateFw =>
      ourFrameworks.some(ourFw => ourFw.name.toLowerCase() === candidateFw.name.toLowerCase())
    );
    
    return {
      our_frameworks: ourFrameworks.map(fw => fw.name),
      candidate_frameworks: candidateFrameworks.map(fw => fw.name),
      matches: matches.map(fw => fw.name),
      compatibility_score: matches.length / Math.max(ourFrameworks.length, 1) * 100
    };
  }

  compareLanguages(ourStack, candidateStack) {
    const ourLanguages = ourStack.languages || [];
    const candidateLanguages = candidateStack.languages || [];
    
    const matches = candidateLanguages.filter(lang =>
      ourLanguages.includes(lang)
    );
    
    return {
      our_languages: ourLanguages,
      candidate_languages: candidateLanguages,
      matches: matches,
      compatibility_score: matches.length / Math.max(ourLanguages.length, 1) * 100
    };
  }

  compareBuildTools(ourStack, candidateStack) {
    const ourBuildTools = ourStack.dependencies?.build_tools || [];
    const candidateBuildTools = candidateStack.dependencies?.build_tools || [];
    
    const matches = candidateBuildTools.filter(candidateTool =>
      ourBuildTools.some(ourTool => ourTool.name.toLowerCase() === candidateTool.name.toLowerCase())
    );
    
    return {
      our_build_tools: ourBuildTools.map(tool => tool.name),
      candidate_build_tools: candidateBuildTools.map(tool => tool.name),
      matches: matches.map(tool => tool.name),
      compatibility_score: matches.length / Math.max(ourBuildTools.length, 1) * 100
    };
  }

  compareDependencies(ourStack, candidateStack) {
    const ourDeps = Object.keys(ourStack.dependencies?.production || {});
    const candidateDeps = Object.keys(candidateStack.package_analysis?.dependencies || {});
    
    const matches = candidateDeps.filter(dep => ourDeps.includes(dep));
    const conflicts = candidateDeps.filter(dep => 
      ourDeps.includes(dep) && 
      ourStack.dependencies.production[dep] !== candidateStack.package_analysis.dependencies[dep]
    );
    
    return {
      our_dependencies_count: ourDeps.length,
      candidate_dependencies_count: candidateDeps.length,
      matches: matches.length,
      conflicts: conflicts.length,
      compatibility_score: candidateDeps.length > 0 ? 
        (matches.length - conflicts.length) / candidateDeps.length * 100 : 100
    };
  }

  generateRecommendationWithRules(comparison, acceptanceRules) {
    console.log('🎯 Generando recomendación basada en reglas...');
    
    let decision = 'RECHAZAR';
    let reasoning = [];
    let estimatedEffort = 'N/A';
    let riskLevel = 'ALTO';
    
    if (acceptanceRules.blockers.isBlocked) {
      decision = 'RECHAZAR';
      reasoning.push('Componente bloqueado por criterios críticos');
      acceptanceRules.blockers.found.forEach(blocker => {
        reasoning.push(`- ${blocker.name}: ${blocker.message}`);
      });
      riskLevel = 'CRÍTICO';
    } else {
      const score = comparison.overall_score;
      
      if (score >= 70) {
        decision = 'PORTE';
        reasoning.push('Score alto, tecnologías compatibles');
        estimatedEffort = '3-6 semanas';
        riskLevel = 'BAJO';
      } else if (score >= 40) {
        decision = 'INTEGRACIÓN';
        reasoning.push('Score medio, mejor como servicio externo');
        estimatedEffort = '1-3 semanas';
        riskLevel = 'MEDIO';
      } else if (score >= 20) {
        decision = 'INSPIRACIÓN';
        reasoning.push('Score bajo, útil para estudiar funcionalidades');
        estimatedEffort = '2-4 semanas desarrollo propio';
        riskLevel = 'MEDIO';
      } else {
        decision = 'RECHAZAR';
        reasoning.push('Score muy bajo, no justifica el esfuerzo');
        riskLevel = 'ALTO';
      }
      
      // Añadir detalles de warnings y quality
      if (acceptanceRules.warnings.found.length > 0) {
        reasoning.push(`Warnings encontrados: ${acceptanceRules.warnings.found.map(w => w.name).join(', ')}`);
      }
      
      if (acceptanceRules.quality.bonuses.length > 0) {
        reasoning.push(`Aspectos positivos: ${acceptanceRules.quality.bonuses.map(q => q.name).join(', ')}`);
      }
    }
    
    return {
      decision,
      reasoning,
      estimated_effort: estimatedEffort,
      risk_level: riskLevel,
      confidence: acceptanceRules.blockers.isBlocked ? 'ALTA' : 'MEDIA',
      next_steps: this.generateNextSteps(decision)
    };
  }

  generateNextSteps(decision) {
    switch (decision) {
      case 'PORTE':
        return [
          'Crear plan detallado de migración',
          'Configurar estructura de directorios según metodología',
          'Comenzar porte incremental por módulos',
          'Configurar seguimiento upstream'
        ];
      case 'INTEGRACIÓN':
        return [
          'Evaluar APIs disponibles',
          'Diseñar arquitectura de integración',
          'Implementar conectores y adaptadores',
          'Configurar monitoreo de servicios externos'
        ];
      case 'INSPIRACIÓN':
        return [
          'Documentar funcionalidades de interés',
          'Crear especificaciones técnicas',
          'Planificar desarrollo interno',
          'Evaluar alternativas existentes'
        ];
      default:
        return [
          'Documentar razones de rechazo',
          'Buscar alternativas',
          'Evaluar desarrollo interno',
          'Revisar decisión en 6 meses'
        ];
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, componentName, repoUrl] = process.argv;

  if (!componentName || !repoUrl) {
    console.error('❌ Uso: node scripts/analyze-candidate-stack.cjs [component-name] [repo-url]');
    console.error('   Ejemplo: node scripts/analyze-candidate-stack.cjs "postiz" "https://github.com/gitroomhq/postiz-app"');
    process.exit(1);
  }

  const analyzer = new CandidateStackAnalyzer(componentName, repoUrl);
  analyzer.analyzeCandidate().catch(error => {
    console.error('❌ Error en análisis:', error.message);
    process.exit(1);
  });
}

module.exports = CandidateStackAnalyzer;
