#!/usr/bin/env node

/**
 * 🔍 Dependency Repository Analyzer - AI Pair Orchestrator Pro
 * 
 * Sistema de análisis automático de repositorios GitHub para
 * documentar y registrar todas las librerías y servicios de terceros
 * 
 * @author AI Pair Platform - UI Team
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class RepositoryAnalyzer {
  constructor() {
    this.repositories = [];
    this.dependencies = new Map();
    this.analysis = {
      totalRepos: 0,
      totalDependencies: 0,
      categories: {},
      securityIssues: [],
      recommendations: []
    };
  }

  /**
   * Analizar repositorios desde configuración
   */
  async analyzeRepositoriesFromConfig(configPath = 'dependency-config.json') {
    console.log('🔍 INICIANDO ANÁLISIS DE REPOSITORIOS');
    console.log('='.repeat(60));
    
    try {
      // Cargar configuración
      const config = this.loadConfig(configPath);
      
      // Analizar cada repositorio
      for (const repo of config.repositories) {
        console.log(`\n📦 Analizando: ${repo.name}`);
        console.log(`   URL: ${repo.url}`);
        
        const repoAnalysis = await this.analyzeRepository(repo);
        this.repositories.push(repoAnalysis);
        
        // Consolidar dependencias
        this.consolidateDependencies(repoAnalysis.dependencies);
      }
      
      // Generar análisis completo
      const fullAnalysis = this.generateFullAnalysis();
      
      // Generar reportes
      await this.generateReports(fullAnalysis);
      
      console.log('\n✅ ANÁLISIS COMPLETADO');
      console.log(`   Repositorios analizados: ${this.analysis.totalRepos}`);
      console.log(`   Dependencias encontradas: ${this.analysis.totalDependencies}`);
      
      return fullAnalysis;
      
    } catch (error) {
      console.error('❌ Error en análisis:', error);
      throw error;
    }
  }

  /**
   * Analizar repositorio individual
   */
  async analyzeRepository(repoConfig) {
    const repoPath = await this.cloneOrUpdateRepository(repoConfig);
    
    const analysis = {
      name: repoConfig.name,
      url: repoConfig.url,
      branch: repoConfig.branch || 'main',
      path: repoPath,
      dependencies: {},
      devDependencies: {},
      scripts: {},
      configs: {},
      files: {},
      lastCommit: '',
      lastUpdate: new Date().toISOString()
    };
    
    try {
      // Analizar package.json
      analysis.dependencies = this.analyzePackageJson(repoPath);
      
      // Analizar archivos de configuración
      analysis.configs = this.analyzeConfigFiles(repoPath);
      
      // Analizar scripts
      analysis.scripts = this.analyzeScripts(repoPath);
      
      // Analizar archivos de código
      analysis.files = this.analyzeCodeFiles(repoPath);
      
      // Obtener último commit
      analysis.lastCommit = this.getLastCommit(repoPath);
      
    } catch (error) {
      console.error(`   ❌ Error analizando ${repoConfig.name}:`, error.message);
      analysis.error = error.message;
    }
    
    return analysis;
  }

  /**
   * Clonar o actualizar repositorio
   */
  async cloneOrUpdateRepository(repoConfig) {
    const repoName = repoConfig.name;
    const repoPath = path.join('temp', repoName);
    
    if (fs.existsSync(repoPath)) {
      console.log(`   📂 Actualizando repositorio existente...`);
      try {
        execSync(`cd ${repoPath} && git pull origin ${repoConfig.branch || 'main'}`, { stdio: 'pipe' });
      } catch (error) {
        console.log(`   ⚠️ Error actualizando, usando versión local`);
      }
    } else {
      console.log(`   📥 Clonando repositorio...`);
      try {
        execSync(`git clone -b ${repoConfig.branch || 'main'} ${repoConfig.url} ${repoPath}`, { stdio: 'pipe' });
      } catch (error) {
        throw new Error(`No se pudo clonar ${repoConfig.url}: ${error.message}`);
      }
    }
    
    return repoPath;
  }

  /**
   * Analizar package.json
   */
  analyzePackageJson(repoPath) {
    const packageJsonPath = path.join(repoPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return { error: 'package.json no encontrado' };
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        peerDependencies: packageJson.peerDependencies || {},
        scripts: packageJson.scripts || {},
        engines: packageJson.engines || {},
        license: packageJson.license,
        repository: packageJson.repository,
        keywords: packageJson.keywords || [],
        author: packageJson.author,
        maintainers: packageJson.maintainers || []
      };
    } catch (error) {
      return { error: `Error parsing package.json: ${error.message}` };
    }
  }

  /**
   * Analizar archivos de configuración
   */
  analyzeConfigFiles(repoPath) {
    const configs = {};
    const configFiles = [
      'tsconfig.json',
      'tailwind.config.js',
      'next.config.js',
      'vite.config.js',
      'webpack.config.js',
      '.eslintrc.js',
      '.prettierrc',
      'jest.config.js',
      'cypress.config.js',
      'playwright.config.js'
    ];
    
    configFiles.forEach(configFile => {
      const configPath = path.join(repoPath, configFile);
      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, 'utf8');
          configs[configFile] = {
            exists: true,
            content: content.substring(0, 1000), // Primeros 1000 caracteres
            size: fs.statSync(configPath).size
          };
        } catch (error) {
          configs[configFile] = { exists: true, error: error.message };
        }
      } else {
        configs[configFile] = { exists: false };
      }
    });
    
    return configs;
  }

  /**
   * Analizar scripts
   */
  analyzeScripts(repoPath) {
    const scripts = {};
    const scriptFiles = [
      'scripts',
      'tools',
      'build',
      'deploy'
    ];
    
    scriptFiles.forEach(scriptDir => {
      const scriptPath = path.join(repoPath, scriptDir);
      if (fs.existsSync(scriptPath) && fs.statSync(scriptPath).isDirectory()) {
        const files = fs.readdirSync(scriptPath);
        scripts[scriptDir] = files.filter(file => 
          file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.sh')
        );
      }
    });
    
    return scripts;
  }

  /**
   * Analizar archivos de código
   */
  analyzeCodeFiles(repoPath) {
    const files = {
      components: [],
      hooks: [],
      utils: [],
      pages: [],
      services: [],
      types: []
    };
    
    const analyzeDirectory = (dir, category) => {
      const fullPath = path.join(repoPath, dir);
      if (!fs.existsSync(fullPath)) return;
      
      const items = fs.readdirSync(fullPath);
      items.forEach(item => {
        const itemPath = path.join(fullPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          analyzeDirectory(path.join(dir, item), category);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js')) {
          files[category].push({
            name: item,
            path: path.join(dir, item),
            size: stat.size,
            modified: stat.mtime
          });
        }
      });
    };
    
    // Analizar directorios comunes
    analyzeDirectory('src/components', 'components');
    analyzeDirectory('src/hooks', 'hooks');
    analyzeDirectory('src/utils', 'utils');
    analyzeDirectory('src/pages', 'pages');
    analyzeDirectory('src/services', 'services');
    analyzeDirectory('src/types', 'types');
    
    return files;
  }

  /**
   * Obtener último commit
   */
  getLastCommit(repoPath) {
    try {
      const commit = execSync('git log -1 --format="%H %s %an %ad"', { 
        cwd: repoPath, 
        stdio: 'pipe' 
      }).toString().trim();
      return commit;
    } catch (error) {
      return 'No disponible';
    }
  }

  /**
   * Consolidar dependencias de todos los repositorios
   */
  consolidateDependencies(repoDependencies) {
    if (repoDependencies.error) return;
    
    const allDeps = {
      ...repoDependencies.dependencies,
      ...repoDependencies.devDependencies,
      ...repoDependencies.peerDependencies
    };
    
    Object.entries(allDeps).forEach(([name, version]) => {
      if (!this.dependencies.has(name)) {
        this.dependencies.set(name, {
          name,
          versions: new Set(),
          repositories: [],
          category: this.categorizeDependency(name),
          usage: 0
        });
      }
      
      const dep = this.dependencies.get(name);
      dep.versions.add(version);
      dep.usage++;
    });
  }

  /**
   * Categorizar dependencia
   */
  categorizeDependency(name) {
    const categories = {
      'UI Components': [
        '@radix-ui', 'shadcn', 'lucide-react', 'react-icons', 'framer-motion'
      ],
      'Styling': [
        'tailwindcss', 'class-variance-authority', 'clsx', 'tailwind-merge'
      ],
      'Forms': [
        'react-hook-form', 'zod', '@hookform/resolvers'
      ],
      'State Management': [
        '@tanstack/react-query', 'zustand', 'redux', 'recoil'
      ],
      'Routing': [
        'next', 'react-router', '@tanstack/router'
      ],
      'Testing': [
        'jest', '@testing-library', 'cypress', 'playwright'
      ],
      'Development': [
        'typescript', 'eslint', 'prettier', 'vite', 'webpack'
      ],
      'Security': [
        'supabase', 'next-auth', 'auth0', 'firebase'
      ],
      'Analytics': [
        'google-analytics', 'mixpanel', 'amplitude'
      ],
      'APIs': [
        'openai', 'axios', 'fetch', 'graphql'
      ]
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }
    
    return 'Other';
  }

  /**
   * Generar análisis completo
   */
  generateFullAnalysis() {
    this.analysis.totalRepos = this.repositories.length;
    this.analysis.totalDependencies = this.dependencies.size;
    
    // Categorizar dependencias
    this.dependencies.forEach(dep => {
      if (!this.analysis.categories[dep.category]) {
        this.analysis.categories[dep.category] = [];
      }
      this.analysis.categories[dep.category].push(dep);
    });
    
    // Analizar seguridad
    this.analysis.securityIssues = this.analyzeSecurityIssues();
    
    // Generar recomendaciones
    this.analysis.recommendations = this.generateRecommendations();
    
    return {
      repositories: this.repositories,
      dependencies: Array.from(this.dependencies.values()),
      analysis: this.analysis,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Analizar problemas de seguridad
   */
  analyzeSecurityIssues() {
    const issues = [];
    
    this.dependencies.forEach(dep => {
      // Verificar versiones muy antiguas
      const versions = Array.from(dep.versions);
      const hasOldVersions = versions.some(version => {
        const major = parseInt(version.split('.')[0]);
        return major < 1;
      });
      
      if (hasOldVersions) {
        issues.push({
          type: 'outdated',
          dependency: dep.name,
          message: `Versiones muy antiguas detectadas: ${versions.join(', ')}`,
          severity: 'medium'
        });
      }
      
      // Verificar dependencias con múltiples versiones
      if (dep.versions.size > 1) {
        issues.push({
          type: 'version-conflict',
          dependency: dep.name,
          message: `Múltiples versiones en uso: ${versions.join(', ')}`,
          severity: 'low'
        });
      }
    });
    
    return issues;
  }

  /**
   * Generar recomendaciones
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Recomendaciones por categoría
    Object.entries(this.analysis.categories).forEach(([category, deps]) => {
      if (deps.length > 10) {
        recommendations.push({
          type: 'consolidation',
          category,
          message: `Considerar consolidar ${deps.length} dependencias en ${category}`,
          priority: 'medium'
        });
      }
    });
    
    // Recomendaciones de seguridad
    this.analysis.securityIssues.forEach(issue => {
      recommendations.push({
        type: 'security',
        dependency: issue.dependency,
        message: issue.message,
        priority: issue.severity
      });
    });
    
    return recommendations;
  }

  /**
   * Generar reportes
   */
  async generateReports(analysis) {
    console.log('\n📋 Generando reportes...');
    
    // Crear directorio de reportes
    const reportsDir = 'reports/dependencies';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Reporte JSON completo
    const jsonReport = JSON.stringify(analysis, null, 2);
    fs.writeFileSync(path.join(reportsDir, 'dependency-analysis.json'), jsonReport);
    
    // Reporte Markdown
    const markdownReport = this.generateMarkdownReport(analysis);
    fs.writeFileSync(path.join(reportsDir, 'dependency-analysis.md'), markdownReport);
    
    // Reporte ejecutivo
    const executiveReport = this.generateExecutiveReport(analysis);
    fs.writeFileSync(path.join(reportsDir, 'executive-summary.md'), executiveReport);
    
    console.log('   ✅ Reportes generados en reports/dependencies/');
  }

  /**
   * Generar reporte Markdown
   */
  generateMarkdownReport(analysis) {
    return `# 📦 Análisis de Dependencias - AI Pair Orchestrator Pro

## 📋 Resumen Ejecutivo

**Fecha de análisis:** ${new Date(analysis.timestamp).toLocaleString()}  
**Repositorios analizados:** ${analysis.analysis.totalRepos}  
**Dependencias totales:** ${analysis.analysis.totalDependencies}

## 🏗️ Repositorios Analizados

${analysis.repositories.map(repo => `
### ${repo.name}
- **URL:** ${repo.url}
- **Branch:** ${repo.branch}
- **Último commit:** ${repo.lastCommit}
- **Dependencias:** ${Object.keys(repo.dependencies.dependencies || {}).length}
- **Dev Dependencias:** ${Object.keys(repo.dependencies.devDependencies || {}).length}
`).join('\n')}

## 📊 Dependencias por Categoría

${Object.entries(analysis.analysis.categories).map(([category, deps]) => `
### ${category} (${deps.length})
${deps.map(dep => `- **${dep.name}** - Versiones: ${Array.from(dep.versions).join(', ')} - Uso: ${dep.usage} repos`).join('\n')}
`).join('\n')}

## 🔒 Problemas de Seguridad

${analysis.analysis.securityIssues.length > 0 ? 
  analysis.analysis.securityIssues.map(issue => 
    `- **${issue.severity.toUpperCase()}:** ${issue.dependency} - ${issue.message}`
  ).join('\n') : 
  'No se detectaron problemas de seguridad críticos.'
}

## 💡 Recomendaciones

${analysis.analysis.recommendations.map(rec => 
  `- **${rec.priority.toUpperCase()}:** ${rec.message}`
).join('\n')}

## 📈 Métricas

- **Dependencias más usadas:**
${Array.from(analysis.dependencies)
  .sort((a, b) => b.usage - a.usage)
  .slice(0, 10)
  .map(dep => `  - ${dep.name}: ${dep.usage} repos`)
  .join('\n')}

- **Categorías más populares:**
${Object.entries(analysis.analysis.categories)
  .sort(([,a], [,b]) => b.length - a.length)
  .map(([category, deps]) => `  - ${category}: ${deps.length} dependencias`)
  .join('\n')}

---

*Reporte generado automáticamente por el Sistema de Análisis de Dependencias*
`;
  }

  /**
   * Generar reporte ejecutivo
   */
  generateExecutiveReport(analysis) {
    return `# 📊 Resumen Ejecutivo - Análisis de Dependencias

## 🎯 Hallazgos Principales

### 📦 Inventario de Dependencias
- **Total de repositorios:** ${analysis.analysis.totalRepos}
- **Total de dependencias únicas:** ${analysis.analysis.totalDependencies}
- **Categorías identificadas:** ${Object.keys(analysis.analysis.categories).length}

### 🔍 Dependencias Críticas
${Array.from(analysis.dependencies)
  .filter(dep => dep.usage > 1)
  .sort((a, b) => b.usage - a.usage)
  .slice(0, 5)
  .map(dep => `- **${dep.name}** (${dep.usage} repos)`)
  .join('\n')}

### ⚠️ Problemas Identificados
- **Problemas de seguridad:** ${analysis.analysis.securityIssues.length}
- **Conflictos de versiones:** ${analysis.analysis.securityIssues.filter(i => i.type === 'version-conflict').length}
- **Dependencias obsoletas:** ${analysis.analysis.securityIssues.filter(i => i.type === 'outdated').length}

## 🎯 Recomendaciones Estratégicas

### 🔒 Seguridad
${analysis.analysis.recommendations
  .filter(rec => rec.type === 'security')
  .map(rec => `- ${rec.message}`)
  .join('\n')}

### 🏗️ Arquitectura
${analysis.analysis.recommendations
  .filter(rec => rec.type === 'consolidation')
  .map(rec => `- ${rec.message}`)
  .join('\n')}

## 📈 Próximos Pasos

1. **Auditoría de seguridad** de dependencias críticas
2. **Consolidación** de versiones duplicadas
3. **Actualización** de dependencias obsoletas
4. **Documentación** de decisiones de arquitectura
5. **Monitoreo continuo** de nuevas dependencias

---

**Score de Salud del Sistema:** ${this.calculateHealthScore(analysis)}%
`;
  }

  /**
   * Calcular score de salud
   */
  calculateHealthScore(analysis) {
    let score = 100;
    
    // Penalizar problemas de seguridad
    score -= analysis.analysis.securityIssues.length * 5;
    
    // Penalizar conflictos de versiones
    const versionConflicts = analysis.analysis.securityIssues.filter(i => i.type === 'version-conflict').length;
    score -= versionConflicts * 3;
    
    // Penalizar dependencias obsoletas
    const outdated = analysis.analysis.securityIssues.filter(i => i.type === 'outdated').length;
    score -= outdated * 2;
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Cargar configuración
   */
  loadConfig(configPath) {
    if (!fs.existsSync(configPath)) {
      // Crear configuración de ejemplo
      const exampleConfig = {
        repositories: [
          {
            name: "ai-pair-orchestrator-pro",
            url: "https://github.com/your-username/ai-pair-orchestrator-pro",
            branch: "main"
          }
        ]
      };
      
      fs.writeFileSync(configPath, JSON.stringify(exampleConfig, null, 2));
      console.log(`📝 Configuración de ejemplo creada: ${configPath}`);
      console.log('   Por favor, edita el archivo con tus repositorios reales');
      process.exit(1);
    }
    
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
}

// Ejecutar análisis
const analyzer = new RepositoryAnalyzer();

// Verificar argumentos
const args = process.argv.slice(2);
const configPath = args[0] || 'dependency-config.json';

console.log('🚀 Iniciando análisis de dependencias...');
analyzer.analyzeRepositoriesFromConfig(configPath); 