#!/usr/bin/env node

/**
 * 🔍 Analizador de Stack Tecnológico
 * 
 * Este script analiza automáticamente el stack tecnológico de un repositorio
 * y lo compara contra nuestro stack oficial para generar una evaluación
 * objetiva de compatibilidad.
 * 
 * Uso: node scripts/stack-analyzer.cjs [repo_url] [--output=json|markdown]
 * 
 * VibeThink 1- Framework de Evaluación de Componentes
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class StackAnalyzer {
  constructor(repoUrl, outputFormat = 'markdown') {
    this.repoUrl = repoUrl;
    this.outputFormat = outputFormat;
    this.timestamp = new Date().toISOString();
    this.tempDir = path.join('temp', `analysis-${Date.now()}`);
    
    // Stack oficial de referencia
    this.officialStack = {
      frontend: {
        react: { version: '18.2.0', weight: 25, required: true },
        typescript: { version: '5.2.0', weight: 20, required: true },
        vite: { version: '5.0.8', weight: 10, required: false }
      },
      ui: {
        'tailwind': { patterns: ['tailwindcss', 'tailwind'], weight: 15, required: true },
        'shadcn': { patterns: ['@radix-ui', 'class-variance-authority'], weight: 10, required: false }
      },
      routing: {
        'react-router-dom': { version: '6.8.0', weight: 10, required: true }
      },
      database: {
        'supabase': { patterns: ['@supabase/supabase-js'], weight: 15, required: true },
        'postgresql': { patterns: ['pg', 'postgres'], weight: 10, required: false }
      },
      testing: {
        'vitest': { patterns: ['vitest'], weight: 8, required: false },
        'playwright': { patterns: ['playwright', '@playwright'], weight: 7, required: false }
      }
    };

    // Patrones de bloqueo
    this.blockers = {
      frameworks: ['vue', 'angular', 'svelte', 'jquery'],
      uiFrameworks: ['@mui/material', 'antd', 'bootstrap', 'styled-components'],
      databases: ['mongodb', 'mongoose', 'firebase'],
      buildTools: ['webpack', 'create-react-app', 'gulp', 'grunt']
    };
  }

  async analyzeRepository() {
    console.log(`🔍 Analizando stack tecnológico de: ${this.repoUrl}`);
    
    try {
      // 1. Preparar entorno temporal
      await this.setupTempEnvironment();
      
      // 2. Clonar repositorio
      await this.cloneRepository();
      
      // 3. Analizar package.json
      const packageAnalysis = await this.analyzePackageJson();
      
      // 4. Analizar archivos de configuración
      const configAnalysis = await this.analyzeConfigFiles();
      
      // 5. Analizar estructura del proyecto
      const structureAnalysis = await this.analyzeProjectStructure();
      
      // 6. Calcular compatibilidad
      const compatibilityScore = await this.calculateCompatibilityScore(
        packageAnalysis, configAnalysis, structureAnalysis
      );
      
      // 7. Generar reporte final
      const report = await this.generateReport({
        packageAnalysis,
        configAnalysis,
        structureAnalysis,
        compatibilityScore
      });
      
      // 8. Limpiar archivos temporales
      await this.cleanup();
      
      return report;
      
    } catch (error) {
      console.error('❌ Error durante el análisis:', error.message);
      await this.cleanup();
      throw error;
    }
  }

  async setupTempEnvironment() {
    await fs.mkdir(this.tempDir, { recursive: true });
    console.log(`📁 Directorio temporal creado: ${this.tempDir}`);
  }

  async cloneRepository() {
    const repoDir = path.join(this.tempDir, 'repo');
    
    try {
      console.log('📥 Clonando repositorio...');
      execSync(`git clone --depth 1 "${this.repoUrl}" "${repoDir}"`, { 
        stdio: 'pipe',
        timeout: 30000 // 30 segundos timeout
      });
      
      this.repoDir = repoDir;
      console.log('✅ Repositorio clonado exitosamente');
      
    } catch (error) {
      throw new Error(`Error clonando repositorio: ${error.message}`);
    }
  }

  async analyzePackageJson() {
    console.log('📦 Analizando package.json...');
    
    const packagePath = path.join(this.repoDir, 'package.json');
    
    try {
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const analysis = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        license: packageJson.license,
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        scripts: packageJson.scripts || {},
        engines: packageJson.engines || {},
        // Análisis específico
        stackAnalysis: this.analyzeStackFromDependencies({
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        }),
        blockersFound: this.findBlockers({
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        })
      };
      
      return analysis;
      
    } catch (error) {
      console.log('⚠️  No se pudo analizar package.json:', error.message);
      return {
        error: 'package.json no encontrado o inválido',
        stackAnalysis: {},
        blockersFound: []
      };
    }
  }

  analyzeStackFromDependencies(deps) {
    const foundStack = {
      frontend: {},
      ui: {},
      routing: {},
      database: {},
      testing: {},
      unknown: []
    };

    for (const [depName, version] of Object.entries(deps)) {
      let categorized = false;

      // Analizar frontend
      if (depName === 'react') {
        foundStack.frontend.react = { found: true, version, compatible: this.isVersionCompatible(version, '18.0.0') };
        categorized = true;
      }
      if (depName === 'typescript' || depName.includes('@types/')) {
        foundStack.frontend.typescript = { found: true, version: version, compatible: true };
        categorized = true;
      }
      if (depName === 'vite') {
        foundStack.frontend.vite = { found: true, version, compatible: this.isVersionCompatible(version, '5.0.0') };
        categorized = true;
      }

      // Analizar UI
      if (depName.includes('tailwind') || depName === 'tailwindcss') {
        foundStack.ui.tailwind = { found: true, version, compatible: true };
        categorized = true;
      }
      if (depName.includes('@radix-ui') || depName === 'class-variance-authority') {
        foundStack.ui.shadcn = { found: true, version, compatible: true };
        categorized = true;
      }
      if (depName === '@mui/material' || depName === 'antd' || depName === 'bootstrap') {
        foundStack.ui.conflicting = foundStack.ui.conflicting || [];
        foundStack.ui.conflicting.push({ name: depName, version });
        categorized = true;
      }

      // Analizar routing
      if (depName === 'react-router-dom') {
        foundStack.routing.reactRouter = { found: true, version, compatible: this.isVersionCompatible(version, '6.0.0') };
        categorized = true;
      }

      // Analizar database
      if (depName.includes('supabase')) {
        foundStack.database.supabase = { found: true, version, compatible: true };
        categorized = true;
      }
      if (depName === 'pg' || depName.includes('postgres')) {
        foundStack.database.postgresql = { found: true, version, compatible: true };
        categorized = true;
      }
      if (depName === 'mongodb' || depName === 'mongoose') {
        foundStack.database.incompatible = foundStack.database.incompatible || [];
        foundStack.database.incompatible.push({ name: depName, version });
        categorized = true;
      }

      // Analizar testing
      if (depName === 'vitest') {
        foundStack.testing.vitest = { found: true, version, compatible: true };
        categorized = true;
      }
      if (depName.includes('playwright')) {
        foundStack.testing.playwright = { found: true, version, compatible: true };
        categorized = true;
      }
      if (depName === 'jest') {
        foundStack.testing.jest = { found: true, version, compatible: false, note: 'Preferimos Vitest' };
        categorized = true;
      }

      // Si no fue categorizado, añadir a unknown
      if (!categorized && !depName.startsWith('@types/')) {
        foundStack.unknown.push({ name: depName, version });
      }
    }

    return foundStack;
  }

  findBlockers(deps) {
    const blockers = [];

    for (const [depName, version] of Object.entries(deps)) {
      // Frameworks incompatibles
      if (this.blockers.frameworks.some(blocker => depName.includes(blocker))) {
        blockers.push({
          type: 'FRAMEWORK_INCOMPATIBLE',
          dependency: depName,
          version,
          severity: 'HIGH',
          reason: 'Framework incompatible con React'
        });
      }

      // UI frameworks conflictivos
      if (this.blockers.uiFrameworks.some(blocker => depName.includes(blocker))) {
        blockers.push({
          type: 'UI_FRAMEWORK_CONFLICT',
          dependency: depName,
          version,
          severity: 'MEDIUM',
          reason: 'Conflicto con shadcn/ui + Tailwind'
        });
      }

      // Bases de datos incompatibles
      if (this.blockers.databases.some(blocker => depName.includes(blocker))) {
        blockers.push({
          type: 'DATABASE_INCOMPATIBLE',
          dependency: depName,
          version,
          severity: 'HIGH',
          reason: 'Base de datos incompatible con Supabase PostgreSQL'
        });
      }

      // Build tools problemáticos
      if (this.blockers.buildTools.some(blocker => depName.includes(blocker))) {
        blockers.push({
          type: 'BUILD_TOOL_OUTDATED',
          dependency: depName,
          version,
          severity: 'MEDIUM',
          reason: 'Build tool obsoleto, preferimos Vite'
        });
      }
    }

    return blockers;
  }

  isVersionCompatible(candidateVersion, requiredVersion) {
    // Simplificado: remover caracteres no numéricos y comparar major version
    const cleanCandidate = candidateVersion.replace(/[^\d.]/g, '');
    const cleanRequired = requiredVersion.replace(/[^\d.]/g, '');
    
    const candidateMajor = parseInt(cleanCandidate.split('.')[0] || '0');
    const requiredMajor = parseInt(cleanRequired.split('.')[0] || '0');
    
    return candidateMajor >= requiredMajor;
  }

  async analyzeConfigFiles() {
    console.log('⚙️  Analizando archivos de configuración...');
    
    const configFiles = [
      'tsconfig.json',
      'tailwind.config.js',
      'tailwind.config.ts',
      'vite.config.js',
      'vite.config.ts',
      'next.config.js',
      'webpack.config.js',
      'postcss.config.js'
    ];

    const foundConfigs = {};

    for (const configFile of configFiles) {
      const configPath = path.join(this.repoDir, configFile);
      
      try {
        await fs.access(configPath);
        foundConfigs[configFile] = true;
        
        // Análisis específico para algunos archivos
        if (configFile === 'tsconfig.json') {
          const content = await fs.readFile(configPath, 'utf8');
          try {
            const tsconfig = JSON.parse(content);
            foundConfigs.typescript = {
              strict: tsconfig.compilerOptions?.strict || false,
              jsx: tsconfig.compilerOptions?.jsx || 'none',
              target: tsconfig.compilerOptions?.target || 'es5'
            };
          } catch (e) {
            foundConfigs.typescript = { error: 'Invalid tsconfig.json' };
          }
        }
        
      } catch (error) {
        // Archivo no existe
      }
    }

    return foundConfigs;
  }

  async analyzeProjectStructure() {
    console.log('🏗️  Analizando estructura del proyecto...');
    
    const structure = {
      hasSourceDir: false,
      sourceDir: null,
      hasComponentsDir: false,
      hasTestsDir: false,
      framework: 'unknown',
      estimatedComplexity: 'unknown'
    };

    // Verificar directorios comunes
    const commonDirs = ['src', 'source', 'app', 'lib', 'components', 'tests', '__tests__', 'test', 'pages'];
    
    for (const dir of commonDirs) {
      const dirPath = path.join(this.repoDir, dir);
      
      try {
        const stats = await fs.stat(dirPath);
        if (stats.isDirectory()) {
          switch (dir) {
            case 'src':
            case 'source':
              structure.hasSourceDir = true;
              structure.sourceDir = dir;
              break;
            case 'components':
              structure.hasComponentsDir = true;
              break;
            case 'tests':
            case '__tests__':
            case 'test':
              structure.hasTestsDir = true;
              break;
            case 'pages':
              structure.framework = structure.framework === 'unknown' ? 'next.js' : structure.framework;
              break;
          }
        }
      } catch (error) {
        // Directorio no existe
      }
    }

    // Contar archivos para estimar complejidad
    try {
      const sourceDir = structure.sourceDir ? path.join(this.repoDir, structure.sourceDir) : this.repoDir;
      const fileCount = await this.countFiles(sourceDir, ['.js', '.jsx', '.ts', '.tsx']);
      
      if (fileCount < 20) structure.estimatedComplexity = 'low';
      else if (fileCount < 100) structure.estimatedComplexity = 'medium';
      else structure.estimatedComplexity = 'high';
      
      structure.fileCount = fileCount;
      
    } catch (error) {
      structure.estimatedComplexity = 'unknown';
    }

    return structure;
  }

  async countFiles(dir, extensions) {
    let count = 0;
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          count += await this.countFiles(fullPath, extensions);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            count++;
          }
        }
      }
    } catch (error) {
      // Error leyendo directorio
    }
    
    return count;
  }

  async calculateCompatibilityScore(packageAnalysis, configAnalysis, structureAnalysis) {
    console.log('📊 Calculando puntuación de compatibilidad...');
    
    let score = 0;
    let maxScore = 0;
    const details = [];

    // Evaluar stack frontend (40% del total)
    const frontendWeight = 40;
    let frontendScore = 0;
    let frontendMaxScore = 0;

    // React (25 puntos)
    frontendMaxScore += 25;
    if (packageAnalysis.stackAnalysis?.frontend?.react?.found) {
      if (packageAnalysis.stackAnalysis.frontend.react.compatible) {
        frontendScore += 25;
        details.push({ item: 'React 18+', score: 25, status: 'EXCELLENT' });
      } else {
        frontendScore += 15;
        details.push({ item: 'React <18', score: 15, status: 'NEEDS_UPGRADE' });
      }
    } else {
      details.push({ item: 'React', score: 0, status: 'MISSING' });
    }

    // TypeScript (20 puntos)
    frontendMaxScore += 20;
    if (packageAnalysis.stackAnalysis?.frontend?.typescript?.found) {
      frontendScore += 20;
      details.push({ item: 'TypeScript', score: 20, status: 'EXCELLENT' });
    } else {
      details.push({ item: 'TypeScript', score: 0, status: 'MIGRATION_REQUIRED' });
    }

    // Vite (10 puntos)
    frontendMaxScore += 10;
    if (packageAnalysis.stackAnalysis?.frontend?.vite?.found) {
      frontendScore += 10;
      details.push({ item: 'Vite', score: 10, status: 'EXCELLENT' });
    } else if (configAnalysis['vite.config.js'] || configAnalysis['vite.config.ts']) {
      frontendScore += 10;
      details.push({ item: 'Vite Config', score: 10, status: 'EXCELLENT' });
    } else {
      frontendScore += 0;
      details.push({ item: 'Build Tool', score: 0, status: 'MIGRATION_REQUIRED' });
    }

    // Normalizar puntuación frontend
    const frontendPercentage = frontendMaxScore > 0 ? (frontendScore / frontendMaxScore) * 100 : 0;
    score += (frontendPercentage / 100) * frontendWeight;
    maxScore += frontendWeight;

    // Evaluar UI Framework (25% del total)
    const uiWeight = 25;
    let uiScore = 0;

    if (packageAnalysis.stackAnalysis?.ui?.tailwind?.found) {
      uiScore += 15;
      details.push({ item: 'Tailwind CSS', score: 15, status: 'EXCELLENT' });
    } else {
      details.push({ item: 'Tailwind CSS', score: 0, status: 'MIGRATION_REQUIRED' });
    }

    if (packageAnalysis.stackAnalysis?.ui?.conflicting?.length > 0) {
      uiScore -= 10; // Penalizar UI frameworks conflictivos
      details.push({ 
        item: 'UI Framework Conflicts', 
        score: -10, 
        status: 'BLOCKER',
        conflicts: packageAnalysis.stackAnalysis.ui.conflicting
      });
    }

    score += Math.max(0, (uiScore / 25) * uiWeight);
    maxScore += uiWeight;

    // Evaluar Database (20% del total)
    const dbWeight = 20;
    let dbScore = 0;

    if (packageAnalysis.stackAnalysis?.database?.supabase?.found) {
      dbScore += 20;
      details.push({ item: 'Supabase', score: 20, status: 'EXCELLENT' });
    } else if (packageAnalysis.stackAnalysis?.database?.postgresql?.found) {
      dbScore += 15;
      details.push({ item: 'PostgreSQL', score: 15, status: 'COMPATIBLE' });
    } else if (packageAnalysis.stackAnalysis?.database?.incompatible?.length > 0) {
      dbScore -= 20;
      details.push({ 
        item: 'Database Incompatible', 
        score: -20, 
        status: 'BLOCKER',
        incompatible: packageAnalysis.stackAnalysis.database.incompatible
      });
    } else {
      dbScore += 10; // Sin base de datos específica
      details.push({ item: 'No Database', score: 10, status: 'NEUTRAL' });
    }

    score += Math.max(0, (dbScore / 20) * dbWeight);
    maxScore += dbWeight;

    // Evaluar bloqueadores (-50 puntos cada uno)
    const blockers = packageAnalysis.blockersFound || [];
    for (const blocker of blockers) {
      if (blocker.severity === 'HIGH') {
        score -= 25;
        details.push({ 
          item: `Blocker: ${blocker.dependency}`, 
          score: -25, 
          status: 'CRITICAL_BLOCKER',
          reason: blocker.reason
        });
      } else if (blocker.severity === 'MEDIUM') {
        score -= 10;
        details.push({ 
          item: `Issue: ${blocker.dependency}`, 
          score: -10, 
          status: 'MEDIUM_BLOCKER',
          reason: blocker.reason
        });
      }
    }

    // Evaluar complejidad del proyecto (15% del total)
    const complexityWeight = 15;
    let complexityScore = 0;

    switch (structureAnalysis.estimatedComplexity) {
      case 'low':
        complexityScore = 15;
        details.push({ item: 'Low Complexity', score: 15, status: 'EXCELLENT' });
        break;
      case 'medium':
        complexityScore = 10;
        details.push({ item: 'Medium Complexity', score: 10, status: 'GOOD' });
        break;
      case 'high':
        complexityScore = 5;
        details.push({ item: 'High Complexity', score: 5, status: 'CHALLENGING' });
        break;
      default:
        complexityScore = 0;
        details.push({ item: 'Unknown Complexity', score: 0, status: 'UNKNOWN' });
    }

    score += (complexityScore / 15) * complexityWeight;
    maxScore += complexityWeight;

    // Calcular puntuación final (0-100)
    const finalScore = Math.max(0, Math.min(100, (score / maxScore) * 100));

    return {
      score: Math.round(finalScore),
      maxPossibleScore: 100,
      details,
      recommendation: this.getRecommendation(finalScore),
      breakdown: {
        frontend: Math.round(frontendPercentage),
        ui: Math.round((uiScore / 25) * 100),
        database: Math.round((Math.max(0, dbScore) / 20) * 100),
        complexity: Math.round((complexityScore / 15) * 100),
        blockers: blockers.length
      }
    };
  }

  getRecommendation(score) {
    if (score >= 80) {
      return {
        decision: 'PORTE',
        confidence: 'HIGH',
        message: 'Excelente candidato para porte - alta compatibilidad con nuestro stack',
        nextSteps: ['Proceder con análisis detallado', 'Crear plan de migración', 'Asignar recursos']
      };
    } else if (score >= 60) {
      return {
        decision: 'INTEGRACIÓN',
        confidence: 'MEDIUM',
        message: 'Candidato viable pero requiere adaptaciones significativas',
        nextSteps: ['Evaluar costo-beneficio de adaptaciones', 'Crear plan de refactoring', 'Considerar desarrollo propio']
      };
    } else {
      return {
        decision: 'INSPIRACIÓN',
        confidence: 'HIGH',
        message: 'Baja compatibilidad - mejor usar como inspiración para desarrollo propio',
        nextSteps: ['Extraer ideas y funcionalidades', 'Diseñar solución propia', 'Evaluar alternativas']
      };
    }
  }

  async generateReport(analysis) {
    console.log('📋 Generando reporte final...');
    
    const report = {
      metadata: {
        repository: this.repoUrl,
        analysis_date: this.timestamp,
        analyzer_version: 'VibeThink 1.0',
        component_name: analysis.packageAnalysis.name || 'Unknown'
      },
      stack_comparison: {
        candidate_stack: analysis.packageAnalysis.stackAnalysis,
        official_stack_version: 'VibeThink 1.0',
        compatibility_score: analysis.compatibilityScore
      },
      blockers: analysis.packageAnalysis.blockersFound || [],
      project_analysis: {
        structure: analysis.structureAnalysis,
        configuration: analysis.configAnalysis,
        package_info: {
          name: analysis.packageAnalysis.name,
          version: analysis.packageAnalysis.version,
          license: analysis.packageAnalysis.license,
          dependency_count: Object.keys(analysis.packageAnalysis.dependencies || {}).length
        }
      },
      final_recommendation: analysis.compatibilityScore.recommendation
    };

    // Guardar reporte
    const reportPath = await this.saveReport(report);
    
    // Mostrar resumen en consola
    this.displaySummary(report);
    
    return {
      report,
      reportPath
    };
  }

  async saveReport(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const componentName = report.metadata.component_name.replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `stack-analysis-${componentName}-${timestamp}.json`;
    const reportPath = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'stack-analysis-reports', fileName);
    
    // Crear directorio si no existe
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    
    // Guardar reporte JSON
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Generar versión Markdown si se solicita
    if (this.outputFormat === 'markdown') {
      const markdownPath = reportPath.replace('.json', '.md');
      const markdownContent = this.generateMarkdownReport(report);
      await fs.writeFile(markdownPath, markdownContent);
      console.log(`📄 Reporte Markdown: ${markdownPath}`);
    }
    
    console.log(`💾 Reporte guardado: ${reportPath}`);
    return reportPath;
  }

  generateMarkdownReport(report) {
    const score = report.stack_comparison.compatibility_score.score;
    const recommendation = report.final_recommendation;
    
    return `# 📊 Análisis de Stack Tecnológico

**Componente**: ${report.metadata.component_name}  
**Repositorio**: ${report.metadata.repository}  
**Fecha**: ${report.metadata.analysis_date}  
**Versión Analyzer**: ${report.metadata.analyzer_version}  

---

## 🎯 **RESULTADO FINAL**

### Puntuación de Compatibilidad
- **Score**: ${score}/100
- **Decisión**: **${recommendation.decision}**
- **Confianza**: ${recommendation.confidence}

### Recomendación
${recommendation.message}

### Próximos Pasos
${recommendation.nextSteps.map(step => `- ${step}`).join('\n')}

---

## 📋 **DETALLES DEL ANÁLISIS**

### Stack Encontrado vs Stack Oficial
${this.formatStackComparison(report.stack_comparison.candidate_stack)}

### Bloqueadores Identificados
${report.blockers.length > 0 ? 
  report.blockers.map(b => `- **${b.dependency}**: ${b.reason} (${b.severity})`).join('\n') : 
  'No se encontraron bloqueadores críticos'
}

### Información del Proyecto
- **Licencia**: ${report.project_analysis.package_info.license || 'No especificada'}
- **Dependencias**: ${report.project_analysis.package_info.dependency_count}
- **Complejidad Estimada**: ${report.project_analysis.structure.estimatedComplexity}
- **Archivos de Código**: ${report.project_analysis.structure.fileCount || 'No calculado'}

---

*Generado por Stack Analyzer VibeThink 1.0*
`;
  }

  formatStackComparison(candidateStack) {
    let comparison = '';
    
    for (const [category, items] of Object.entries(candidateStack)) {
      if (category === 'unknown') continue;
      
      comparison += `\n#### ${category.toUpperCase()}\n`;
      
      for (const [tech, info] of Object.entries(items)) {
        if (info.found) {
          const status = info.compatible ? '✅' : '⚠️';
          comparison += `- ${status} **${tech}**: ${info.version}\n`;
        }
      }
    }
    
    return comparison;
  }

  displaySummary(report) {
    const score = report.stack_comparison.compatibility_score.score;
    const recommendation = report.final_recommendation;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DEL ANÁLISIS');
    console.log('='.repeat(60));
    console.log(`🎯 Componente: ${report.metadata.component_name}`);
    console.log(`📊 Puntuación: ${score}/100`);
    console.log(`🔍 Decisión: ${recommendation.decision}`);
    console.log(`💡 ${recommendation.message}`);
    console.log('='.repeat(60));
    
    if (report.blockers.length > 0) {
      console.log('\n⚠️  BLOQUEADORES ENCONTRADOS:');
      report.blockers.forEach(blocker => {
        console.log(`   • ${blocker.dependency}: ${blocker.reason}`);
      });
    }
    
    console.log(`\n📁 Stack oficial de referencia: docs/PROJECT/08_TOOLCHAIN_AND_SETUP/STACK_OFICIAL_REFERENCIA.md`);
  }

  async cleanup() {
    try {
      const { execSync } = require('child_process');
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${this.tempDir}"`, { stdio: 'pipe' });
      } else {
        execSync(`rm -rf "${this.tempDir}"`, { stdio: 'pipe' });
      }
      console.log('🧹 Archivos temporales eliminados');
    } catch (error) {
      console.log('⚠️  No se pudieron eliminar archivos temporales');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, repoUrl, outputFlag] = process.argv;

  if (!repoUrl) {
    console.error('❌ Uso: node scripts/stack-analyzer.cjs [repo_url] [--output=json|markdown]');
    console.error('   Ejemplo: node scripts/stack-analyzer.cjs "https://github.com/gitroomhq/postiz-app"');
    process.exit(1);
  }

  const outputFormat = outputFlag?.includes('markdown') ? 'markdown' : 'json';
  const analyzer = new StackAnalyzer(repoUrl, outputFormat);
  
  analyzer.analyzeRepository()
    .then((result) => {
      console.log('\n✅ Análisis completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error durante el análisis:', error.message);
      process.exit(1);
    });
}

module.exports = StackAnalyzer;
