#!/usr/bin/env node

/**
 * 🎯 FASE 1: Evaluador Inicial de Candidatos para Porte
 * 
 * Este script realiza la evaluación inicial de un candidato para porte,
 * siguiendo los criterios formalizados y calibrados con la experiencia de Postiz.
 * 
 * Uso: node scripts/fase1-evaluacion-inicial.cjs [nombre] [repo_url]
 * 
 * VThink 1.0 - Framework de Porte - Fase 1
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class EvaluadorInicial {
  constructor(componentName, repoUrl) {
    this.componentName = componentName;
    this.repoUrl = repoUrl;
    this.timestamp = new Date().toISOString();
    this.evaluacion = {
      candidato: componentName,
      repositorio: repoUrl,
      fecha_evaluacion: this.timestamp,
      fase: "EVALUACIÓN_INICIAL",
      criterios: {},
      puntuacion_total: 0,
      recomendacion: null,
      siguiente_fase: null
    };
  }

  async evaluarCandidato() {
    console.log(`🎯 FASE 1: Evaluando candidato para porte: ${this.componentName}`);
    console.log(`📋 Repositorio: ${this.repoUrl}`);
    console.log('');

    try {
      // 1. Verificar accesibilidad del repositorio
      await this.verificarRepositorio();
      
      // 2. Evaluar criterios básicos
      await this.evaluarCriteriosBasicos();
      
      // 3. Análisis rápido de dependencias
      await this.analisisRapidoDependencias();
      
      // 4. Evaluar justificación de negocio
      await this.evaluarJustificacionNegocio();
      
      // 5. Calcular puntuación y recomendación
      this.calcularPuntuacionFinal();
      
      // 6. Generar reporte de Fase 1
      await this.generarReporteFase1();
      
      // 7. Mostrar resultados
      this.mostrarResultados();
      
    } catch (error) {
      console.error('❌ Error durante la evaluación:', error.message);
      process.exit(1);
    }
  }

  async verificarRepositorio() {
    console.log('🔍 1. Verificando accesibilidad del repositorio...');
    
    try {
      // Extraer owner/repo de la URL
      const match = this.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('URL de repositorio GitHub no válida');
      }
      
      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      
      // Verificar acceso al repositorio
      const repoData = JSON.parse(execSync(`curl -s "${apiUrl}"`, { encoding: 'utf8' }));
      
      if (repoData.message === 'Not Found') {
        throw new Error('Repositorio no encontrado o no accesible');
      }

      // Evaluar criterios del repositorio
      this.evaluacion.criterios.repositorio = {
        accesible: true,
        publico: !repoData.private,
        activo: this.evaluarActividad(repoData),
        mantenido: this.evaluarMantenimiento(repoData),
        licencia: this.evaluarLicencia(repoData.license),
        estrellas: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues_abiertas: repoData.open_issues_count,
        ultima_actualizacion: repoData.updated_at
      };

      console.log(`   ✅ Repositorio accesible: ${owner}/${repo}`);
      console.log(`   ⭐ ${repoData.stargazers_count} estrellas, ${repoData.forks_count} forks`);
      console.log(`   📅 Última actualización: ${new Date(repoData.updated_at).toLocaleDateString()}`);
      
    } catch (error) {
      this.evaluacion.criterios.repositorio = {
        accesible: false,
        error: error.message
      };
      throw error;
    }
  }

  evaluarActividad(repoData) {
    const ultimaActualizacion = new Date(repoData.updated_at);
    const ahora = new Date();
    const diasDesdeActualizacion = (ahora - ultimaActualizacion) / (1000 * 60 * 60 * 24);
    
    // Criterio calibrado con Postiz: activo si actualizado en últimos 90 días
    return {
      activo: diasDesdeActualizacion <= 90,
      dias_desde_actualizacion: Math.round(diasDesdeActualizacion),
      nivel: diasDesdeActualizacion <= 30 ? 'ALTO' : 
             diasDesdeActualizacion <= 90 ? 'MEDIO' : 'BAJO'
    };
  }

  evaluarMantenimiento(repoData) {
    // Criterios de mantenimiento basados en experiencia Postiz
    const criterios = {
      tiene_releases: repoData.has_releases || false,
      issues_gestionadas: repoData.open_issues_count < 100, // Postiz tenía ~50 issues
      documentacion: repoData.has_wiki || (repoData.description && repoData.description.length > 20),
      tamaño_apropiado: repoData.size < 500000 // KB - Postiz era ~200MB
    };

    const puntuacion = Object.values(criterios).filter(Boolean).length;
    
    return {
      ...criterios,
      puntuacion_mantenimiento: puntuacion,
      nivel: puntuacion >= 3 ? 'ALTO' : puntuacion >= 2 ? 'MEDIO' : 'BAJO'
    };
  }

  evaluarLicencia(license) {
    if (!license) {
      return {
        compatible: false,
        licencia: 'NO_ESPECIFICADA',
        razon: 'Licencia no especificada'
      };
    }

    const licenciasCompatibles = [
      'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 
      'ISC', 'PostgreSQL', 'Unlicense'
    ];

    const compatible = licenciasCompatibles.includes(license.spdx_id);
    
    return {
      compatible,
      licencia: license.spdx_id || license.name,
      razon: compatible ? 'Licencia compatible' : 'Licencia restrictiva o problemática'
    };
  }

  async analisisRapidoDependencias() {
    console.log('🔍 2. Análisis rápido de dependencias...');
    
    try {
      // Crear directorio temporal
      const tempDir = path.join('temp-analysis', this.componentName);
      await fs.mkdir(tempDir, { recursive: true });
      
      // Clonar solo el package.json
      const cloneCmd = `git clone --depth 1 --filter=blob:none --sparse "${this.repoUrl}" "${tempDir}"`;
      execSync(cloneCmd, { stdio: 'pipe' });
      
      execSync(`cd "${tempDir}" && git sparse-checkout set package.json`, { stdio: 'pipe' });
      
      // Analizar package.json
      const packagePath = path.join(tempDir, 'package.json');
      
      try {
        const packageContent = await fs.readFile(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        this.evaluacion.criterios.dependencias = this.analizarPackageJson(packageJson);
        
        console.log(`   ✅ Dependencias analizadas: ${Object.keys(packageJson.dependencies || {}).length} prod + ${Object.keys(packageJson.devDependencies || {}).length} dev`);
        
      } catch (error) {
        console.log('   ⚠️  No se encontró package.json o no es un proyecto Node.js');
        this.evaluacion.criterios.dependencias = {
          es_nodejs: false,
          razon: 'No es proyecto Node.js o package.json inaccesible'
        };
      }
      
      // Limpiar directorio temporal
      await fs.rm(tempDir, { recursive: true, force: true });
      
    } catch (error) {
      console.log(`   ⚠️  Error en análisis de dependencias: ${error.message}`);
      this.evaluacion.criterios.dependencias = {
        error: error.message
      };
    }
  }

  analizarPackageJson(packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const totalDeps = Object.keys(deps).length;
    
    // Análisis de stack compatibility (calibrado con Postiz)
    const stackAnalysis = {
      react: this.detectarReact(deps),
      typescript: this.detectarTypeScript(deps, packageJson),
      database: this.analizarDatabase(deps),
      ui_framework: this.analizarUIFramework(deps),
      build_tools: this.analizarBuildTools(deps)
    };

    const compatibilityScore = this.calcularCompatibilidadStack(stackAnalysis);
    
    return {
      es_nodejs: true,
      total_dependencias: totalDeps,
      complejidad: totalDeps < 20 ? 'BAJA' : totalDeps < 50 ? 'MEDIA' : 'ALTA',
      stack_analysis: stackAnalysis,
      compatibility_score: compatibilityScore,
      main_framework: this.detectarFrameworkPrincipal(deps),
      tiene_tests: this.detectarFrameworkTesting(deps),
      build_moderno: this.detectarBuildModerno(deps)
    };
  }

  detectarReact(deps) {
    if (deps.react) {
      const version = deps.react.replace(/[\^~]/, '');
      const majorVersion = parseInt(version.split('.')[0]);
      
      return {
        detectado: true,
        version: deps.react,
        compatible: majorVersion >= 16,
        migration_effort: majorVersion >= 18 ? 'BAJO' : majorVersion >= 16 ? 'MEDIO' : 'ALTO'
      };
    }
    
    return { detectado: false, compatible: false, migration_effort: 'ALTO' };
  }

  detectarTypeScript(deps, packageJson) {
    const hasTS = deps.typescript || deps['@types/node'] || packageJson.types;
    
    return {
      detectado: hasTS,
      soporte_nativo: !!packageJson.types,
      migration_effort: hasTS ? 'BAJO' : 'ALTO'
    };
  }

  analizarDatabase(deps) {
    const dbTypes = {
      postgresql: ['pg', 'postgres', 'postgresql', 'supabase'],
      mysql: ['mysql', 'mysql2'],
      mongodb: ['mongoose', 'mongodb'],
      sqlite: ['sqlite', 'sqlite3', 'better-sqlite3'],
      orm: ['prisma', 'typeorm', 'sequelize', 'knex']
    };

    const detected = [];
    for (const [type, patterns] of Object.entries(dbTypes)) {
      for (const pattern of patterns) {
        if (Object.keys(deps).some(dep => dep.includes(pattern))) {
          detected.push(type);
          break;
        }
      }
    }

    return {
      detectadas: detected,
      supabase_compatible: detected.includes('postgresql') || detected.length === 0,
      migration_effort: detected.length === 0 ? 'BAJO' : 
                       detected.includes('postgresql') ? 'BAJO' : 'MEDIO'
    };
  }

  analizarUIFramework(deps) {
    const uiFrameworks = {
      'tailwind': ['tailwindcss', 'tailwind'],
      'material-ui': ['@mui/material', '@material-ui', 'material-ui'],
      'antd': ['antd'],
      'chakra': ['@chakra-ui'],
      'bootstrap': ['bootstrap', 'react-bootstrap'],
      'styled-components': ['styled-components'],
      'none': []
    };

    const detected = [];
    for (const [framework, patterns] of Object.entries(uiFrameworks)) {
      if (framework === 'none') continue;
      
      for (const pattern of patterns) {
        if (Object.keys(deps).some(dep => dep.includes(pattern))) {
          detected.push(framework);
          break;
        }
      }
    }

    return {
      detectados: detected,
      shadcn_migration_effort: detected.length === 0 ? 'BAJO' :
                              detected.includes('tailwind') ? 'BAJO' : 'MEDIO'
    };
  }

  analizarBuildTools(deps) {
    const buildTools = ['vite', 'webpack', 'rollup', 'parcel', 'esbuild'];
    const detected = buildTools.filter(tool => deps[tool]);

    return {
      detectados: detected,
      vite_compatible: detected.includes('vite') || detected.length === 0,
      migration_effort: detected.includes('vite') ? 'BAJO' : 'MEDIO'
    };
  }

  calcularCompatibilidadStack(stackAnalysis) {
    let score = 0;
    let maxScore = 0;

    // React (30%)
    maxScore += 30;
    if (stackAnalysis.react.compatible) score += 30;
    else if (stackAnalysis.react.detectado) score += 15;

    // TypeScript (20%)
    maxScore += 20;
    if (stackAnalysis.typescript.detectado) score += 20;

    // Database (20%)
    maxScore += 20;
    if (stackAnalysis.database.supabase_compatible) score += 20;

    // UI Framework (15%)
    maxScore += 15;
    if (stackAnalysis.ui_framework.shadcn_migration_effort === 'BAJO') score += 15;
    else if (stackAnalysis.ui_framework.shadcn_migration_effort === 'MEDIO') score += 8;

    // Build Tools (15%)
    maxScore += 15;
    if (stackAnalysis.build_tools.vite_compatible) score += 15;

    return Math.round((score / maxScore) * 100);
  }

  detectarFrameworkPrincipal(deps) {
    if (deps.react) return 'React';
    if (deps.vue) return 'Vue';
    if (deps['@angular/core']) return 'Angular';
    if (deps.svelte) return 'Svelte';
    if (deps.express) return 'Express';
    if (deps.fastify) return 'Fastify';
    return 'Unknown';
  }

  detectarFrameworkTesting(deps) {
    const testFrameworks = ['jest', 'vitest', 'mocha', 'jasmine', 'cypress', 'playwright'];
    return testFrameworks.some(framework => deps[framework]);
  }

  detectarBuildModerno(deps) {
    const modernTools = ['vite', 'rollup', 'esbuild', 'swc'];
    return modernTools.some(tool => deps[tool]);
  }

  async evaluarJustificacionNegocio() {
    console.log('🔍 3. Evaluando justificación de negocio...');
    
    // Esta sección requiere input manual, pero podemos hacer evaluación básica
    const repo = this.evaluacion.criterios.repositorio;
    const deps = this.evaluacion.criterios.dependencias;
    
    this.evaluacion.criterios.negocio = {
      popularidad: this.evaluarPopularidad(repo.estrellas, repo.forks),
      complejidad_desarrollo: this.estimarComplejidadDesarrollo(deps),
      time_to_market: this.estimarTimeToMarket(deps),
      maintenance_burden: this.evaluarCargaMantenimiento(repo, deps)
    };

    console.log(`   ✅ Evaluación de negocio completada`);
  }

  evaluarPopularidad(estrellas, forks) {
    // Calibrado con Postiz: 7.1k estrellas, 1.4k forks
    const scoreEstrellas = estrellas >= 5000 ? 'ALTO' : 
                          estrellas >= 1000 ? 'MEDIO' : 'BAJO';
    
    const scoreForks = forks >= 1000 ? 'ALTO' : 
                      forks >= 200 ? 'MEDIO' : 'BAJO';

    return {
      estrellas_nivel: scoreEstrellas,
      forks_nivel: scoreForks,
      popularidad_general: (scoreEstrellas === 'ALTO' || scoreForks === 'ALTO') ? 'ALTO' :
                          (scoreEstrellas === 'MEDIO' || scoreForks === 'MEDIO') ? 'MEDIO' : 'BAJO'
    };
  }

  estimarComplejidadDesarrollo(deps) {
    if (!deps || !deps.es_nodejs) {
      return {
        nivel: 'MUY_ALTO',
        razon: 'No es proyecto Node.js - migración completa requerida'
      };
    }

    const factores = {
      dependencias: deps.total_dependencias > 50 ? 2 : deps.total_dependencias > 20 ? 1 : 0,
      stack_compatibility: deps.compatibility_score >= 80 ? 0 : 
                          deps.compatibility_score >= 60 ? 1 : 2,
      framework_principal: deps.main_framework === 'React' ? 0 : 
                          ['Vue', 'Angular'].includes(deps.main_framework) ? 2 : 1
    };

    const puntuacionTotal = Object.values(factores).reduce((a, b) => a + b, 0);
    
    return {
      nivel: puntuacionTotal <= 1 ? 'BAJO' : 
             puntuacionTotal <= 3 ? 'MEDIO' : 'ALTO',
      factores,
      puntuacion: puntuacionTotal
    };
  }

  estimarTimeToMarket(deps) {
    if (!deps || !deps.es_nodejs) {
      return {
        semanas: '12-16',
        nivel: 'LARGO',
        razon: 'Migración completa de stack'
      };
    }

    const baseWeeks = 4; // Baseline para proyecto React compatible
    let additionalWeeks = 0;

    if (deps.compatibility_score < 60) additionalWeeks += 4;
    else if (deps.compatibility_score < 80) additionalWeeks += 2;

    if (deps.complejidad === 'ALTA') additionalWeeks += 3;
    else if (deps.complejidad === 'MEDIA') additionalWeeks += 1;

    if (deps.main_framework !== 'React') additionalWeeks += 6;

    const totalWeeks = baseWeeks + additionalWeeks;

    return {
      semanas: `${totalWeeks}-${totalWeeks + 2}`,
      nivel: totalWeeks <= 6 ? 'CORTO' : totalWeeks <= 10 ? 'MEDIO' : 'LARGO',
      desglose: { base: baseWeeks, adicional: additionalWeeks }
    };
  }

  evaluarCargaMantenimiento(repo, deps) {
    const factores = {
      upstream_activo: repo.activo.nivel === 'ALTO',
      licencia_compatible: repo.licencia.compatible,
      dependencias_manejables: deps ? deps.total_dependencias < 100 : false,
      comunidad_activa: repo.estrellas > 1000 && repo.issues_abiertas < 200
    };

    const puntuacion = Object.values(factores).filter(Boolean).length;

    return {
      factores,
      nivel: puntuacion >= 3 ? 'BAJO' : puntuacion >= 2 ? 'MEDIO' : 'ALTO',
      puntuacion
    };
  }

  calcularPuntuacionFinal() {
    console.log('🔍 4. Calculando puntuación final...');
    
    let puntuacion = 0;
    let maxPuntuacion = 100;
    const desglose = {};

    // Criterios del repositorio (30%)
    const repoScore = this.calcularPuntuacionRepo();
    puntuacion += repoScore * 0.3;
    desglose.repositorio = { puntuacion: repoScore, peso: 30 };

    // Compatibilidad técnica (40%)
    const techScore = this.evaluacion.criterios.dependencias?.compatibility_score || 0;
    puntuacion += techScore * 0.4;
    desglose.tecnica = { puntuacion: techScore, peso: 40 };

    // Justificación de negocio (30%)
    const businessScore = this.calcularPuntuacionNegocio();
    puntuacion += businessScore * 0.3;
    desglose.negocio = { puntuacion: businessScore, peso: 30 };

    this.evaluacion.puntuacion_total = Math.round(puntuacion);
    this.evaluacion.desglose_puntuacion = desglose;

    // Determinar recomendación
    if (puntuacion >= 80) {
      this.evaluacion.recomendacion = 'PROCEDER';
      this.evaluacion.siguiente_fase = 'ANÁLISIS_TÉCNICO_DETALLADO';
    } else if (puntuacion >= 60) {
      this.evaluacion.recomendacion = 'PROCEDER_CON_CAUTELA';
      this.evaluacion.siguiente_fase = 'ANÁLISIS_TÉCNICO_DETALLADO';
    } else {
      this.evaluacion.recomendacion = 'EVALUAR_ALTERNATIVAS';
      this.evaluacion.siguiente_fase = 'BÚSQUEDA_ALTERNATIVAS';
    }

    console.log(`   ✅ Puntuación calculada: ${this.evaluacion.puntuacion_total}/100`);
  }

  calcularPuntuacionRepo() {
    const repo = this.evaluacion.criterios.repositorio;
    let score = 0;

    if (repo.accesible) score += 20;
    if (repo.licencia.compatible) score += 20;
    if (repo.activo.nivel === 'ALTO') score += 30;
    else if (repo.activo.nivel === 'MEDIO') score += 20;
    if (repo.mantenido.nivel === 'ALTO') score += 30;
    else if (repo.mantenido.nivel === 'MEDIO') score += 20;

    return Math.min(score, 100);
  }

  calcularPuntuacionNegocio() {
    const negocio = this.evaluacion.criterios.negocio;
    let score = 0;

    if (negocio.popularidad.popularidad_general === 'ALTO') score += 25;
    else if (negocio.popularidad.popularidad_general === 'MEDIO') score += 15;

    if (negocio.complejidad_desarrollo.nivel === 'BAJO') score += 25;
    else if (negocio.complejidad_desarrollo.nivel === 'MEDIO') score += 15;

    if (negocio.time_to_market.nivel === 'CORTO') score += 25;
    else if (negocio.time_to_market.nivel === 'MEDIO') score += 15;

    if (negocio.maintenance_burden.nivel === 'BAJO') score += 25;
    else if (negocio.maintenance_burden.nivel === 'MEDIO') score += 15;

    return score;
  }

  async generarReporteFase1() {
    const reportePath = path.join('temp-reports', `${this.componentName}-fase1-evaluacion.json`);
    await fs.mkdir('temp-reports', { recursive: true });
    
    await fs.writeFile(reportePath, JSON.stringify(this.evaluacion, null, 2));
    
    console.log(`📊 Reporte Fase 1 generado: ${reportePath}`);
  }

  mostrarResultados() {
    console.log('\n🎯 RESULTADOS FASE 1 - EVALUACIÓN INICIAL');
    console.log('==========================================');
    
    console.log(`\n📊 PUNTUACIÓN TOTAL: ${this.evaluacion.puntuacion_total}/100`);
    
    const { desglose_puntuacion } = this.evaluacion;
    console.log('\n📋 DESGLOSE:');
    console.log(`   • Repositorio (30%): ${Math.round(desglose_puntuacion.repositorio.puntuacion)}/100`);
    console.log(`   • Técnica (40%): ${Math.round(desglose_puntuacion.tecnica.puntuacion)}/100`);
    console.log(`   • Negocio (30%): ${Math.round(desglose_puntuacion.negocio.puntuacion)}/100`);
    
    console.log(`\n🎯 RECOMENDACIÓN: ${this.evaluacion.recomendacion}`);
    console.log(`🔄 SIGUIENTE FASE: ${this.evaluacion.siguiente_fase}`);
    
    const deps = this.evaluacion.criterios.dependencias;
    if (deps && deps.es_nodejs) {
      console.log(`\n⚡ ESTIMACIÓN RÁPIDA:`);
      console.log(`   • Compatibilidad Stack: ${deps.compatibility_score}%`);
      console.log(`   • Framework Principal: ${deps.main_framework}`);
      console.log(`   • Tiempo Estimado: ${this.evaluacion.criterios.negocio.time_to_market.semanas} semanas`);
      console.log(`   • Complejidad: ${this.evaluacion.criterios.negocio.complejidad_desarrollo.nivel}`);
    }

    console.log('\n💡 PRÓXIMOS PASOS:');
    if (this.evaluacion.recomendacion === 'PROCEDER') {
      console.log('   1. ✅ Candidato aprobado para Fase 2');
      console.log('   2. Ejecutar: node scripts/fase2-analisis-detallado.cjs');
      console.log('   3. Preparar equipo para análisis técnico profundo');
    } else if (this.evaluacion.recomendacion === 'PROCEDER_CON_CAUTELA') {
      console.log('   1. ⚠️  Candidato viable pero requiere atención');
      console.log('   2. Revisar puntos débiles identificados');
      console.log('   3. Considerar si los riesgos son aceptables');
      console.log('   4. Si se aprueba: node scripts/fase2-analisis-detallado.cjs');
    } else {
      console.log('   1. ❌ Candidato no recomendado');
      console.log('   2. Buscar alternativas o considerar desarrollo propio');
      console.log('   3. Documentar razones para referencia futura');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, componentName, repoUrl] = process.argv;

  if (!componentName || !repoUrl) {
    console.error('❌ Uso: node scripts/fase1-evaluacion-inicial.cjs [nombre] [repo_url]');
    console.error('   Ejemplo: node scripts/fase1-evaluacion-inicial.cjs "postiz" "https://github.com/gitroomhq/postiz-app"');
    process.exit(1);
  }

  const evaluador = new EvaluadorInicial(componentName, repoUrl);
  evaluador.evaluarCandidato();
}

module.exports = EvaluadorInicial;
