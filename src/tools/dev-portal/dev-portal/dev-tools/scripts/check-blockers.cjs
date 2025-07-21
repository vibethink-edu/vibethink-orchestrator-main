#!/usr/bin/env node

/**
 * 🚦 Verificador de Reglas de Bloqueo para Componentes Candidatos
 * 
 * Este script implementa solo las verificaciones críticas de bloqueo
 * definidas en COMPONENT_ACCEPTANCE_RULES.md, permitiendo una
 * evaluación rápida de viabilidad antes del análisis completo.
 * 
 * Uso: node scripts/check-blockers.cjs [repo-url]
 * 
 * VibeThink 1- Acceptance Rules Blocker Check
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// 🔴 REGLAS DE BLOQUEO CRÍTICAS
const BLOCKER_RULES = {
  INCOMPATIBLE_LICENSES: ['GPL-3.0-only', 'GPL-3.0', 'AGPL-3.0', 'UNLICENSED', 'PROPRIETARY'],
  ABANDONMENT_DAYS: 730, // 24 meses
  INCOMPATIBLE_FRAMEWORKS: ['angular', 'vue', 'svelte', 'ember'],
  MIN_NODE_VERSION: 18,
  EXCLUDED_LANGUAGES: ['python', 'ruby', 'php', 'java', 'c#', 'go', 'rust']
};

class BlockerChecker {
  constructor(repoUrl) {
    this.repoUrl = repoUrl;
    this.tempDir = path.join('temp', `blocker-check-${Date.now()}`);
    this.blockers = [];
    this.warnings = [];
    this.passed = [];
  }

  async checkAll() {
    console.log(`🚦 Verificando blockers críticos para: ${this.repoUrl}`);
    
    try {
      // Clonar repositorio
      await this.cloneRepo();
      
      // Ejecutar todas las verificaciones de bloqueo
      await this.checkLicense();
      await this.checkAbandonment();
      await this.checkTechnology();
      await this.checkLanguages();
      
      // Limpiar
      await this.cleanup();
      
      return this.generateReport();
      
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  async cloneRepo() {
    console.log('📥 Clonando repositorio...');
    
    await fs.mkdir(this.tempDir, { recursive: true });
    execSync(`git clone --depth 1 ${this.repoUrl} ${this.tempDir}`, { stdio: 'pipe' });
  }

  async checkLicense() {
    console.log('🔍 Verificando licencia...');
    
    let license = 'UNKNOWN';
    
    try {
      // Intentar package.json primero
      const packagePath = path.join(this.tempDir, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      license = packageJson.license || 'UNKNOWN';
    } catch (e) {
      // Intentar archivo LICENSE
      try {
        const licensePath = path.join(this.tempDir, 'LICENSE');
        const licenseContent = await fs.readFile(licensePath, 'utf8');
        
        // Detectar tipo de licencia por contenido
        if (licenseContent.includes('MIT License')) license = 'MIT';
        else if (licenseContent.includes('Apache License')) license = 'Apache-2.0';
        else if (licenseContent.includes('GNU GENERAL PUBLIC LICENSE')) {
          if (licenseContent.includes('Version 3')) license = 'GPL-3.0';
          else if (licenseContent.includes('Version 2')) license = 'GPL-2.0';
        }
        else if (licenseContent.includes('GNU AFFERO GENERAL PUBLIC LICENSE')) license = 'AGPL-3.0';
      } catch (e2) {
        // No se encontró licencia
      }
    }
    
    const isBlocked = BLOCKER_RULES.INCOMPATIBLE_LICENSES.some(blocked => 
      license.toUpperCase().includes(blocked.toUpperCase())
    );
    
    if (isBlocked) {
      this.blockers.push({
        code: 'B1',
        type: 'LICENCIA_INCOMPATIBLE',
        message: `Licencia incompatible: ${license}`,
        severity: 'CRITICAL',
        found_license: license
      });
    } else if (license === 'UNKNOWN') {
      this.warnings.push({
        code: 'W-LICENSE',
        type: 'LICENCIA_NO_DETECTADA',
        message: 'No se pudo detectar la licencia del proyecto',
        severity: 'WARNING'
      });
    } else {
      this.passed.push(`B1: Licencia compatible (${license})`);
    }
  }

  async checkAbandonment() {
    console.log('🔍 Verificando actividad del proyecto...');
    
    try {
      // Obtener fecha del último commit
      const lastCommitOutput = execSync('git log -1 --format=%ci', { 
        cwd: this.tempDir, 
        encoding: 'utf8' 
      });
      
      const lastCommitDate = new Date(lastCommitOutput.trim());
      const daysSinceLastCommit = Math.floor((new Date() - lastCommitDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastCommit > BLOCKER_RULES.ABANDONMENT_DAYS) {
        this.blockers.push({
          code: 'B2',
          type: 'PROYECTO_ABANDONADO',
          message: `Último commit hace ${daysSinceLastCommit} días (>${BLOCKER_RULES.ABANDONMENT_DAYS} días permitidos)`,
          severity: 'CRITICAL',
          days_since_last_commit: daysSinceLastCommit,
          last_commit_date: lastCommitDate.toISOString()
        });
      } else {
        this.passed.push(`B2: Proyecto activo (último commit hace ${daysSinceLastCommit} días)`);
        
        if (daysSinceLastCommit > 180) {
          this.warnings.push({
            code: 'W-ACTIVITY',
            type: 'BAJA_ACTIVIDAD',
            message: `Actividad moderada: último commit hace ${daysSinceLastCommit} días`,
            severity: 'WARNING'
          });
        }
      }
      
    } catch (error) {
      this.warnings.push({
        code: 'W-GIT',
        type: 'ERROR_GIT_INFO',
        message: 'No se pudo obtener información de commits',
        severity: 'WARNING'
      });
    }
  }

  async checkTechnology() {
    console.log('🔍 Verificando compatibilidad tecnológica...');
    
    try {
      const packagePath = path.join(this.tempDir, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };
      
      // Verificar frameworks incompatibles
      const incompatibleFramework = BLOCKER_RULES.INCOMPATIBLE_FRAMEWORKS.find(fw => 
        allDeps[fw] || 
        allDeps[`@${fw}/core`] || 
        allDeps[`@${fw}/cli`] ||
        Object.keys(allDeps).some(dep => dep.includes(fw))
      );
      
      if (incompatibleFramework) {
        this.blockers.push({
          code: 'B3',
          type: 'FRAMEWORK_INCOMPATIBLE',
          message: `Framework incompatible detectado: ${incompatibleFramework}`,
          severity: 'CRITICAL',
          detected_framework: incompatibleFramework
        });
      } else {
        // Verificar si tiene React (preferido)
        if (allDeps.react) {
          this.passed.push('B3: Framework compatible (React detectado)');
        } else {
          this.warnings.push({
            code: 'W-FRAMEWORK',
            type: 'SIN_FRAMEWORK_DETECTADO',
            message: 'No se detectó React u otro framework compatible',
            severity: 'WARNING'
          });
        }
      }
      
      // Verificar versión de Node.js
      if (packageJson.engines?.node) {
        const nodeVersion = packageJson.engines.node.replace(/[^0-9]/g, '');
        const minNodeVersion = parseInt(nodeVersion);
        
        if (minNodeVersion && minNodeVersion < BLOCKER_RULES.MIN_NODE_VERSION) {
          this.blockers.push({
            code: 'B3',
            type: 'NODE_VERSION_INCOMPATIBLE',
            message: `Node.js version ${nodeVersion} no soportada (mínimo: ${BLOCKER_RULES.MIN_NODE_VERSION})`,
            severity: 'CRITICAL',
            required_node_version: nodeVersion,
            min_supported: BLOCKER_RULES.MIN_NODE_VERSION
          });
        } else {
          this.passed.push(`B3: Node.js version compatible (${packageJson.engines.node})`);
        }
      }
      
    } catch (error) {
      this.warnings.push({
        code: 'W-PACKAGE',
        type: 'ERROR_PACKAGE_ANALYSIS',
        message: 'No se pudo analizar package.json',
        severity: 'WARNING'
      });
    }
  }

  async checkLanguages() {
    console.log('🔍 Verificando lenguajes del proyecto...');
    
    try {
      // Buscar archivos de lenguajes incompatibles
      const incompatibleLanguages = [];
      
      for (const lang of BLOCKER_RULES.EXCLUDED_LANGUAGES) {
        let hasLang = false;
        
        switch (lang) {
          case 'python':
            hasLang = await this.hasFiles('**/*.py');
            break;
          case 'ruby':
            hasLang = await this.hasFiles('**/*.rb') || await this.hasFiles('Gemfile');
            break;
          case 'php':
            hasLang = await this.hasFiles('**/*.php') || await this.hasFiles('composer.json');
            break;
          case 'java':
            hasLang = await this.hasFiles('**/*.java') || await this.hasFiles('pom.xml');
            break;
          case 'c#':
            hasLang = await this.hasFiles('**/*.cs') || await this.hasFiles('*.csproj');
            break;
          case 'go':
            hasLang = await this.hasFiles('**/*.go') || await this.hasFiles('go.mod');
            break;
          case 'rust':
            hasLang = await this.hasFiles('**/*.rs') || await this.hasFiles('Cargo.toml');
            break;
        }
        
        if (hasLang) {
          incompatibleLanguages.push(lang);
        }
      }
      
      if (incompatibleLanguages.length > 0) {
        this.blockers.push({
          code: 'B3',
          type: 'LENGUAJES_INCOMPATIBLES',
          message: `Lenguajes incompatibles detectados: ${incompatibleLanguages.join(', ')}`,
          severity: 'CRITICAL',
          detected_languages: incompatibleLanguages
        });
      } else {
        this.passed.push('B3: Solo lenguajes compatibles detectados');
      }
      
    } catch (error) {
      this.warnings.push({
        code: 'W-LANG',
        type: 'ERROR_LANGUAGE_DETECTION',
        message: 'Error detectando lenguajes del proyecto',
        severity: 'WARNING'
      });
    }
  }

  async hasFiles(pattern) {
    try {
      const command = process.platform === 'win32' 
        ? `dir /s /b ${this.tempDir}\\${pattern.replace('**/', '').replace('*', '*')} 2>nul`
        : `find ${this.tempDir} -name "${pattern.replace('**/', '')}" -type f 2>/dev/null`;
      
      const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
      return result.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  generateReport() {
    const isBlocked = this.blockers.length > 0;
    const decision = isBlocked ? 'RECHAZAR' : 'CONTINUAR_ANÁLISIS';
    
    const report = {
      repository_url: this.repoUrl,
      analysis_date: new Date().toISOString(),
      blocker_check_version: 'VibeThink 1.0',
      
      summary: {
        decision,
        is_blocked: isBlocked,
        blockers_found: this.blockers.length,
        warnings_found: this.warnings.length,
        checks_passed: this.passed.length
      },
      
      blockers: {
        found: this.blockers,
        summary: isBlocked ? 
          `❌ BLOQUEADO: ${this.blockers.length} blocker(s) crítico(s) encontrado(s)` :
          '✅ Sin blockers críticos encontrados'
      },
      
      warnings: {
        found: this.warnings,
        summary: this.warnings.length > 0 ?
          `⚠️ ${this.warnings.length} warning(s) encontrado(s)` :
          '✅ Sin warnings encontrados'
      },
      
      passed_checks: this.passed,
      
      next_steps: isBlocked ? [
        'Componente rechazado por blockers críticos',
        'No continuar con análisis detallado',
        'Buscar alternativas',
        'Documentar razones de rechazo'
      ] : [
        'Proceder con análisis completo',
        'Ejecutar: node scripts/analyze-candidate-stack.cjs',
        'Evaluar warnings encontrados',
        'Continuar con proceso de evaluación'
      ]
    };
    
    // Mostrar resumen en consola
    console.log(`\n🎯 RESULTADO DE VERIFICACIÓN DE BLOCKERS:`);
    console.log(`   Decisión: ${decision}`);
    console.log(`   Blockers: ${this.blockers.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Checks OK: ${this.passed.length}`);
    
    if (isBlocked) {
      console.log(`\n🔴 BLOCKERS ENCONTRADOS:`);
      this.blockers.forEach(blocker => {
        console.log(`   - ${blocker.type}: ${blocker.message}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n🟡 WARNINGS:`);
      this.warnings.forEach(warning => {
        console.log(`   - ${warning.type}: ${warning.message}`);
      });
    }
    
    return report;
  }

  async cleanup() {
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('⚠️ Error limpiando archivos temporales:', error.message);
    }
  }
}

// 🚀 EJECUTAR SI ES LLAMADO DIRECTAMENTE
async function main() {
  const repoUrl = process.argv[2];
  
  if (!repoUrl) {
    console.error('❌ Uso: node scripts/check-blockers.cjs [repo-url]');
    console.error('   Ejemplo: node scripts/check-blockers.cjs https://github.com/usuario/repo');
    process.exit(1);
  }
  
  try {
    const checker = new BlockerChecker(repoUrl);
    const report = await checker.checkAll();
    
    // Guardar reporte
    const reportsDir = path.join('docs', 'PROJECT', '02_ARCHITECTURE', 'STACK_MANAGEMENT', 'BLOCKER_REPORTS');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const reportPath = path.join(reportsDir, `blocker_check_${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 Reporte guardado: ${reportPath}`);
    
    // Exit code basado en resultado
    process.exit(report.summary.is_blocked ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Error durante verificación de blockers:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { BlockerChecker, BLOCKER_RULES };
