#!/usr/bin/env node

/**
 * 🔍 Evaluador Formal de Componentes Candidatos
 * 
 * Este script realiza una evaluación sistemática y formal de componentes
 * candidatos para determinar si deben ser PORTADOS, INTEGRADOS, o usados
 * como INSPIRACIÓN, comparando su stack con nuestra referencia base.
 * 
 * Uso: node scripts/evaluate-candidate-component.cjs [nombre] [repo_url] [--mode=interactive]
 * 
 * XTP v4.6 - Framework de Evaluación Formal
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class ComponentEvaluator {
  constructor(componentName, repoUrl, mode = 'automatic') {
    this.componentName = componentName;
    this.repoUrl = repoUrl;
    this.mode = mode;
    this.timestamp = new Date().toISOString();
    this.evaluation = {
      candidate_info: {},
      our_stack: {},
      candidate_stack: {},
      compatibility_analysis: {},
      decision: {}
    };
    
    // Cargar nuestro stack de referencia
    this.loadOurStackReference();
  }

  async loadOurStackReference() {
    // Stack de referencia AI Pair Orchestrator Pro
    this.ourStack = {
      frontend: {
        react: { version: "18.2.0", required: true },
        typescript: { version: "5.2.2", strict: true, required: true },
        ui_framework: { primary: "shadcn/ui", base: "Radix UI", required: true },
        styling: { method: "Tailwind CSS 3.3.6", required: true },
        routing: { library: "React Router DOM 6.8.0", required: true },
        state_management: {
          global: "Zustand",
          server: "@tanstack/react-query 5.8.4",
          forms: "React Hook Form 7.48.2"
        }
      },
      backend: {
        database: { primary: "Supabase PostgreSQL", required: true },
        auth: { service: "FusionAuth", multi_tenant: true, required: true },
        api: { pattern: "REST + GraphQL", client: "fetch + React Query" }
      },
      build_dev: {
        build_tool: { primary: "Vite 5.0.8", required: true },
        testing: { 
          unit: "Vitest 1.0.4", 
          e2e: "Playwright", 
          required: true 
        },
        linting: { eslint: "8.55.0", typescript_eslint: "6.14.0" }
      },
      deployment: {
        containerization: { method: "Docker + Docker Compose", required: true },
        ci_cd: { platform: "GitHub Actions", required: true }
      },
      architecture: {
        multi_tenancy: "Row Level Security (RLS)",
        component_architecture: "Modular + shadcn/ui",
        file_structure: "src/apps/[module]/ + src/components/[module]/"
      }
    };
  }

  async evaluateComponent() {
    console.log(`🔍 Iniciando evaluación formal de: ${this.componentName}`);
    console.log(`📂 Repositorio: ${this.repoUrl}`);
    console.log(`⏰ Fecha: ${this.timestamp}`);
    console.log('═'.repeat(80));
    
    try {
      // 1. Recopilar información básica
      await this.gatherBasicInfo();
      
      // 2. Analizar stack del candidato
      await this.analyzeCandidateStack();
      
      // 3. Realizar análisis de compatibilidad
      await this.performCompatibilityAnalysis();
      
      // 4. Generar recomendación
      await this.generateRecommendation();
      
      // 5. Crear reporte formal
      await this.generateFormalReport();
      
      // 6. Mostrar resultados
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Error durante la evaluación:', error.message);
      process.exit(1);
    }
  }

  async gatherBasicInfo() {
    console.log('\n📋 PASO 1: Recopilando información básica...');
    
    try {
      // Información del repositorio
      const repoInfo = await this.getRepositoryInfo();
      
      this.evaluation.candidate_info = {
        name: this.componentName,
        repository: this.repoUrl,
        version_analyzed: repoInfo.latest_version || 'latest',
        license: repoInfo.license || 'Unknown',
        last_update: repoInfo.last_update || 'Unknown',
        community_activity: this.assessCommunityActivity(repoInfo),
        stars: repoInfo.stars || 0,
        forks: repoInfo.forks || 0,
        open_issues: repoInfo.open_issues || 0
      };
      
      console.log(`   ✅ Nombre: ${this.evaluation.candidate_info.name}`);
      console.log(`   ✅ Versión: ${this.evaluation.candidate_info.version_analyzed}`);
      console.log(`   ✅ Licencia: ${this.evaluation.candidate_info.license}`);
      console.log(`   ✅ Actividad: ${this.evaluation.candidate_info.community_activity}`);
      
    } catch (error) {
      console.log(`   ⚠️  Error obteniendo info del repositorio: ${error.message}`);
      // Continuar con información básica
      this.evaluation.candidate_info = {
        name: this.componentName,
        repository: this.repoUrl,
        version_analyzed: 'manual_analysis',
        license: 'To be determined',
        last_update: 'To be determined',
        community_activity: 'To be determined'
      };
    }
  }

  async getRepositoryInfo() {
    try {
      const match = this.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) throw new Error('URL de repositorio no válida');
      
      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      
      const repoData = JSON.parse(execSync(`curl -s "${apiUrl}"`, { encoding: 'utf8' }));
      
      if (repoData.message === 'Not Found') {
        throw new Error('Repositorio no encontrado');
      }
      
      // Obtener releases
      const releasesUrl = `${apiUrl}/releases/latest`;
      let latestVersion = 'No releases';
      try {
        const releaseData = JSON.parse(execSync(`curl -s "${releasesUrl}"`, { encoding: 'utf8' }));
        if (releaseData.tag_name) {
          latestVersion = releaseData.tag_name;
        }
      } catch (error) {
        // No releases available
      }
      
      return {
        latest_version: latestVersion,
        license: repoData.license?.spdx_id || repoData.license?.name || 'Unknown',
        last_update: repoData.updated_at,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        language: repoData.language,
        description: repoData.description
      };
      
    } catch (error) {
      throw new Error(`Error obteniendo información del repositorio: ${error.message}`);
    }
  }

  assessCommunityActivity(repoInfo) {
    const lastUpdate = new Date(repoInfo.last_update);
    const now = new Date();
    const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < 30 && repoInfo.stars > 1000) return 'ACTIVO';
    if (daysSinceUpdate < 90 && repoInfo.stars > 100) return 'MODERADO';
    return 'INACTIVO';
  }

  async analyzeCandidateStack() {
    console.log('\n🔍 PASO 2: Analizando stack del candidato...');
    
    if (this.mode === 'interactive') {
      await this.interactiveStackAnalysis();
    } else {
      // Para casos conocidos como Postiz, usar datos predefinidos
      if (this.componentName.toLowerCase().includes('postiz')) {
        this.evaluation.candidate_stack = this.getPostizStackInfo();
      } else {
        await this.automaticStackAnalysis();
      }
    }
    
    this.displayStackAnalysis();
  }

  getPostizStackInfo() {
    // Stack conocido de Postiz basado en análisis previo
    return {
      frontend: {
        framework: "React 18.2.0",
        typescript: "Si, TypeScript 5.0+",
        ui_library: "Custom UI + Tailwind CSS",
        styling: "Tailwind CSS",
        routing: "React Router",
        state_management: "Custom hooks + Context"
      },
      backend: {
        database: "PostgreSQL compatible",
        auth: "JWT custom (migratable)",
        api_pattern: "REST API",
        real_time: "WebSockets/SSE"
      },
      build_dev: {
        build_tool: "Vite",
        testing: "Jest/Vitest compatible",
        package_manager: "npm/yarn"
      },
      deployment: {
        containerized: "Si, Docker",
        deployment_method: "Docker Compose"
      },
      architecture: {
        pattern: "Modular components",
        multi_tenant: "Adaptable",
        api_structure: "RESTful endpoints"
      }
    };
  }

  async automaticStackAnalysis() {
    // Análisis automático básico - en desarrollo
    this.evaluation.candidate_stack = {
      frontend: {
        framework: "To be analyzed",
        typescript: "To be determined",
        ui_library: "To be analyzed",
        styling: "To be determined"
      },
      backend: {
        database: "To be analyzed",
        auth: "To be determined",
        api_pattern: "To be analyzed"
      },
      build_dev: {
        build_tool: "To be analyzed",
        testing: "To be determined"
      },
      deployment: {
        containerized: "To be determined",
        deployment_method: "To be analyzed"
      }
    };
  }

  async interactiveStackAnalysis() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    console.log('   📝 Análisis interactivo del stack del candidato:');
    
    this.evaluation.candidate_stack = {
      frontend: {
        framework: await question('   Frontend Framework (ej: React 18.2.0): '),
        typescript: await question('   ¿Usa TypeScript? (Si/No): '),
        ui_library: await question('   UI Library (ej: Material-UI, Ant Design): '),
        styling: await question('   Método de estilos (ej: Tailwind CSS, styled-components): ')
      },
      backend: {
        database: await question('   Base de datos (ej: PostgreSQL, MongoDB): '),
        auth: await question('   Sistema de autenticación (ej: JWT, OAuth): '),
        api_pattern: await question('   Patrón de API (ej: REST, GraphQL): ')
      },
      build_dev: {
        build_tool: await question('   Herramienta de build (ej: Vite, Webpack): '),
        testing: await question('   Framework de testing (ej: Jest, Vitest): ')
      },
      deployment: {
        containerized: await question('   ¿Usa Docker? (Si/No): '),
        deployment_method: await question('   Método de deployment (ej: Docker Compose, K8s): ')
      }
    };

    rl.close();
  }

  displayStackAnalysis() {
    console.log('   📊 Stack del candidato identificado:');
    console.log(`   Frontend: ${this.evaluation.candidate_stack.frontend?.framework || 'N/A'}`);
    console.log(`   TypeScript: ${this.evaluation.candidate_stack.frontend?.typescript || 'N/A'}`);
    console.log(`   UI: ${this.evaluation.candidate_stack.frontend?.ui_library || 'N/A'}`);
    console.log(`   Database: ${this.evaluation.candidate_stack.backend?.database || 'N/A'}`);
    console.log(`   Build: ${this.evaluation.candidate_stack.build_dev?.build_tool || 'N/A'}`);
  }

  async performCompatibilityAnalysis() {
    console.log('\n⚖️  PASO 3: Análisis de compatibilidad...');
    
    const scores = {
      frontend: this.calculateFrontendCompatibility(),
      backend: this.calculateBackendCompatibility(),
      build_dev: this.calculateBuildCompatibility(),
      architecture: this.calculateArchitectureCompatibility()
    };
    
    const overallScore = Math.round(
      (scores.frontend * 0.35 + scores.backend * 0.30 + scores.build_dev * 0.20 + scores.architecture * 0.15)
    );
    
    this.evaluation.compatibility_analysis = {
      frontend_score: scores.frontend,
      backend_score: scores.backend,
      build_score: scores.build_dev,
      architecture_score: scores.architecture,
      overall_score: overallScore,
      migration_effort: this.estimateMigrationEffort(overallScore),
      blockers: this.identifyBlockers(scores)
    };
    
    console.log(`   ✅ Frontend: ${scores.frontend}/100`);
    console.log(`   ✅ Backend: ${scores.backend}/100`);
    console.log(`   ✅ Build/Dev: ${scores.build_dev}/100`);
    console.log(`   ✅ Arquitectura: ${scores.architecture}/100`);
    console.log(`   🎯 SCORE GENERAL: ${overallScore}/100`);
  }

  calculateFrontendCompatibility() {
    const candidate = this.evaluation.candidate_stack.frontend || {};
    let score = 0;
    
    // React compatibility (40 puntos)
    if (candidate.framework?.includes('React 18')) score += 40;
    else if (candidate.framework?.includes('React 17')) score += 30;
    else if (candidate.framework?.includes('React 16')) score += 20;
    else if (candidate.framework?.includes('React')) score += 10;
    
    // TypeScript (30 puntos)  
    if (candidate.typescript?.toLowerCase().includes('si')) score += 30;
    else if (candidate.typescript?.toLowerCase().includes('parcial')) score += 15;
    
    // UI Library (20 puntos)
    if (candidate.ui_library?.includes('Tailwind')) score += 20;
    else if (candidate.ui_library?.includes('Material-UI') || candidate.ui_library?.includes('Ant Design')) score += 15;
    else if (candidate.ui_library?.includes('Custom')) score += 10;
    
    // Styling (10 puntos)
    if (candidate.styling?.includes('Tailwind')) score += 10;
    else if (candidate.styling?.includes('CSS-in-JS') || candidate.styling?.includes('styled-components')) score += 7;
    else if (candidate.styling?.includes('CSS')) score += 5;
    
    return Math.min(score, 100);
  }

  calculateBackendCompatibility() {
    const candidate = this.evaluation.candidate_stack.backend || {};
    let score = 0;
    
    // Database (50 puntos)
    if (candidate.database?.includes('PostgreSQL')) score += 50;
    else if (candidate.database?.includes('MySQL') || candidate.database?.includes('SQL')) score += 35;
    else if (candidate.database?.includes('SQLite')) score += 25;
    else if (candidate.database?.includes('MongoDB')) score += 15;
    
    // Auth (30 puntos)
    if (candidate.auth?.includes('JWT')) score += 25;
    else if (candidate.auth?.includes('OAuth')) score += 20;
    else if (candidate.auth?.includes('custom')) score += 15;
    
    // API Pattern (20 puntos)
    if (candidate.api_pattern?.includes('REST')) score += 20;
    else if (candidate.api_pattern?.includes('GraphQL')) score += 18;
    
    return Math.min(score, 100);
  }

  calculateBuildCompatibility() {
    const candidate = this.evaluation.candidate_stack.build_dev || {};
    let score = 0;
    
    // Build tool (60 puntos)
    if (candidate.build_tool?.includes('Vite')) score += 60;
    else if (candidate.build_tool?.includes('Webpack')) score += 40;
    else if (candidate.build_tool?.includes('Rollup')) score += 35;
    else if (candidate.build_tool?.includes('Parcel')) score += 30;
    
    // Testing (40 puntos)
    if (candidate.testing?.includes('Vitest')) score += 40;
    else if (candidate.testing?.includes('Jest')) score += 35;
    else if (candidate.testing?.includes('Mocha') || candidate.testing?.includes('Jasmine')) score += 25;
    
    return Math.min(score, 100);
  }

  calculateArchitectureCompatibility() {
    const candidate = this.evaluation.candidate_stack.architecture || {};
    let score = 0;
    
    // Modular architecture (40 puntos)
    if (candidate.pattern?.includes('Modular')) score += 40;
    else if (candidate.pattern?.includes('Component')) score += 30;
    
    // Multi-tenant readiness (35 puntos)
    if (candidate.multi_tenant?.includes('Si') || candidate.multi_tenant?.includes('Adaptable')) score += 35;
    else if (candidate.multi_tenant?.includes('Parcial')) score += 20;
    
    // API structure (25 puntos)
    if (candidate.api_structure?.includes('RESTful')) score += 25;
    else if (candidate.api_structure?.includes('API')) score += 15;
    
    return Math.min(score, 100);
  }

  estimateMigrationEffort(overallScore) {
    if (overallScore >= 85) {
      return {
        estimated_weeks: "2-3 semanas",
        complexity_level: "BAJA", 
        risk_level: "BAJO"
      };
    } else if (overallScore >= 70) {
      return {
        estimated_weeks: "4-6 semanas",
        complexity_level: "MEDIA",
        risk_level: "MEDIO"
      };
    } else if (overallScore >= 50) {
      return {
        estimated_weeks: "8-12 semanas", 
        complexity_level: "ALTA",
        risk_level: "ALTO"
      };
    } else {
      return {
        estimated_weeks: "16+ semanas",
        complexity_level: "MUY ALTA",
        risk_level: "MUY ALTO"
      };
    }
  }

  identifyBlockers(scores) {
    const blockers = {
      critical: [],
      moderate: [],
      minor: []
    };
    
    if (scores.frontend < 40) {
      blockers.critical.push("Frontend framework incompatible - requiere reescritura completa");
    }
    
    if (scores.backend < 30) {
      blockers.critical.push("Backend/Database incompatible - migración compleja");
    }
    
    if (scores.build_dev < 50) {
      blockers.moderate.push("Build tools diferentes - configuración requerida");
    }
    
    if (scores.architecture < 40) {
      blockers.moderate.push("Arquitectura no modular - refactoring necesario");
    }
    
    return blockers;
  }

  async generateRecommendation() {
    console.log('\n🎯 PASO 4: Generando recomendación...');
    
    const score = this.evaluation.compatibility_analysis.overall_score;
    let decision, rationale, next_steps;
    
    if (score >= 80) {
      decision = "PORTE RECOMENDADO";
      rationale = "Alta compatibilidad con nuestro stack. El esfuerzo de migración está justificado por el valor obtenido.";
      next_steps = [
        "Proceder con análisis detallado",
        "Crear plan de migración específico", 
        "Asignar recursos para el porte",
        "Ejecutar setup: node scripts/setup-porte-app.cjs"
      ];
    } else if (score >= 60) {
      decision = "INTEGRACIÓN RECOMENDADA";
      rationale = "Compatibilidad media. Es más eficiente integrarlo como servicio externo que portarlo completamente.";
      next_steps = [
        "Evaluar APIs de integración disponibles",
        "Diseñar arquitectura de integración",
        "Implementar conectores/adapters",
        "Mantener como servicio independiente"
      ];
    } else {
      decision = "USAR COMO INSPIRACIÓN";
      rationale = "Baja compatibilidad técnica. El esfuerzo de porte es demasiado alto comparado con desarrollo propio.";
      next_steps = [
        "Analizar funcionalidades clave",
        "Extraer patrones de diseño útiles",
        "Documentar ideas para desarrollo propio",
        "Considerar alternativas más compatibles"
      ];
    }
    
    this.evaluation.decision = {
      recommendation: decision,
      rationale,
      next_steps,
      confidence_level: this.calculateConfidenceLevel(score)
    };
    
    console.log(`   📋 DECISIÓN: ${decision}`);
    console.log(`   📝 Razón: ${rationale}`);
    console.log(`   🎯 Confianza: ${this.evaluation.decision.confidence_level}`);
  }

  calculateConfidenceLevel(score) {
    if (score >= 90) return "MUY ALTA";
    if (score >= 75) return "ALTA";
    if (score >= 60) return "MEDIA";
    if (score >= 40) return "BAJA";
    return "MUY BAJA";
  }

  async generateFormalReport() {
    const reportData = {
      metadata: {
        evaluation_date: this.timestamp,
        evaluator_version: "VibeThink 1.0",
        methodology: "Stack Compatibility Analysis"
      },
      ...this.evaluation
    };
    
    const reportPath = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'evaluations', `${this.componentName.toLowerCase()}-evaluation-report.json`);
    
    // Crear directorio si no existe
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`\n📊 Reporte formal generado: ${reportPath}`);
  }

  displayResults() {
    console.log('\n' + '═'.repeat(80));
    console.log('📋 RESUMEN DE EVALUACIÓN');
    console.log('═'.repeat(80));
    
    console.log(`🎯 COMPONENTE: ${this.evaluation.candidate_info.name}`);
    console.log(`📊 SCORE GENERAL: ${this.evaluation.compatibility_analysis.overall_score}/100`);
    console.log(`🎯 DECISIÓN: ${this.evaluation.decision.recommendation}`);
    console.log(`⏱️  ESFUERZO ESTIMADO: ${this.evaluation.compatibility_analysis.migration_effort.estimated_weeks}`);
    console.log(`⚠️  NIVEL DE RIESGO: ${this.evaluation.compatibility_analysis.migration_effort.risk_level}`);
    
    console.log('\n📝 PRÓXIMOS PASOS:');
    this.evaluation.decision.next_steps.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step}`);
    });
    
    if (this.evaluation.compatibility_analysis.blockers.critical.length > 0) {
      console.log('\n🚨 BLOQUEADORES CRÍTICOS:');
      this.evaluation.compatibility_analysis.blockers.critical.forEach(blocker => {
        console.log(`   ❌ ${blocker}`);
      });
    }
    
    console.log('\n✅ Evaluación completada.');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, componentName, repoUrl, modeFlag] = process.argv;

  if (!componentName || !repoUrl) {
    console.error('❌ Uso: node scripts/evaluate-candidate-component.cjs [nombre] [repo_url] [--mode=interactive]');
    console.error('   Ejemplo: node scripts/evaluate-candidate-component.cjs "postiz" "https://github.com/gitroomhq/postiz-app"');
    console.error('   Modo interactivo: node scripts/evaluate-candidate-component.cjs "component" "https://github.com/user/repo" --mode=interactive');
    process.exit(1);
  }

  const mode = modeFlag === '--mode=interactive' ? 'interactive' : 'automatic';
  const evaluator = new ComponentEvaluator(componentName, repoUrl, mode);
  evaluator.evaluateComponent();
}

module.exports = ComponentEvaluator;
