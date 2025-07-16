#!/usr/bin/env node

/**
 * 🔄 Upstream Tracker
 * 
 * Este script monitorea automáticamente las mejoras upstream de componentes
 * portados, identifica nuevas versiones y actualizaciones relevantes, y
 * genera alertas para decisiones de adopción.
 * 
 * Uso: node scripts/upstream-tracker.js [--component=nombre] [--check-all]
 * 
 * VThink 1.0 - Framework de Porte
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class UpstreamTracker {
  constructor() {
    this.inventoryPath = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'component-inventory.yaml');
    this.decisionsPath = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'porte-decisions.json');
    this.timestamp = new Date().toISOString();
    this.notifications = [];
  }

  async trackUpstream(componentName = null) {
    console.log('🔄 Iniciando seguimiento upstream...');
    
    try {
      // 1. Cargar inventario de componentes
      const inventory = await this.loadInventory();
      
      // 2. Filtrar componentes porte
      const porteComponents = this.filterPorteComponents(inventory, componentName);
      
      if (porteComponents.length === 0) {
        console.log('ℹ️  No se encontraron componentes porte para trackear');
        return;
      }
      
      // 3. Verificar cada componente
      for (const component of porteComponents) {
        await this.checkComponentUpdates(component);
      }
      
      // 4. Generar reporte
      await this.generateReport();
      
      // 5. Mostrar notificaciones
      this.showNotifications();
      
    } catch (error) {
      console.error('❌ Error durante el tracking:', error.message);
      process.exit(1);
    }
  }

  async loadInventory() {
    try {
      const inventoryContent = await fs.readFile(this.inventoryPath, 'utf8');
      return this.parseYaml(inventoryContent);
    } catch (error) {
      throw new Error(`Error cargando inventario: ${error.message}`);
    }
  }

  parseYaml(yamlContent) {
    // Simple YAML parser for our specific structure
    const lines = yamlContent.split('\n');
    const result = { components: {} };
    let currentComponent = null;
    let currentSection = null;
    let indentLevel = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const indent = line.length - line.trimStart().length;
      
      if (indent === 0 && trimmed.endsWith(':')) {
        // Top level section
        currentSection = trimmed.slice(0, -1);
        if (currentSection === 'components') {
          result.components = {};
        }
      } else if (indent === 2 && trimmed.endsWith(':') && currentSection === 'components') {
        // Component name
        currentComponent = trimmed.slice(0, -1);
        result.components[currentComponent] = {};
      } else if (indent === 4 && currentComponent && trimmed.includes(':')) {
        // Component property
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        result.components[currentComponent][key.trim()] = value || null;
      }
    }

    return result;
  }

  filterPorteComponents(inventory, componentName) {
    const components = [];
    
    for (const [name, data] of Object.entries(inventory.components)) {
      if (data.integration_type === 'porte') {
        if (!componentName || name === componentName) {
          components.push({
            name,
            ...data
          });
        }
      }
    }
    
    return components;
  }

  async checkComponentUpdates(component) {
    console.log(`🔍 Verificando: ${component.name}`);
    
    try {
      // 1. Obtener información del repositorio original
      const repoInfo = await this.getRepositoryInfo(component.origin_repo);
      
      // 2. Comparar versiones
      const versionComparison = await this.compareVersions(component, repoInfo);
      
      // 3. Analizar cambios
      const changeAnalysis = await this.analyzeChanges(component, repoInfo, versionComparison);
      
      // 4. Generar recomendaciones
      const recommendations = this.generateRecommendations(component, changeAnalysis);
      
      // 5. Crear notificación si hay actualizaciones importantes
      if (recommendations.requiresAttention) {
        this.notifications.push({
          component: component.name,
          type: recommendations.priority,
          message: recommendations.message,
          details: changeAnalysis,
          timestamp: this.timestamp
        });
      }
      
      console.log(`✅ ${component.name}: ${recommendations.status}`);
      
    } catch (error) {
      console.error(`❌ Error verificando ${component.name}:`, error.message);
      this.notifications.push({
        component: component.name,
        type: 'ERROR',
        message: `Error verificando upstream: ${error.message}`,
        timestamp: this.timestamp
      });
    }
  }

  async getRepositoryInfo(repoUrl) {
    try {
      // Extraer owner/repo de la URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('URL de repositorio no válida');
      }
      
      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      
      // Usar curl para obtener información del repositorio
      const repoData = JSON.parse(execSync(`curl -s "${apiUrl}"`, { encoding: 'utf8' }));
      
      if (repoData.message === 'Not Found') {
        throw new Error('Repositorio no encontrado');
      }
      
      // Obtener releases
      const releasesUrl = `${apiUrl}/releases`;
      const releasesData = JSON.parse(execSync(`curl -s "${releasesUrl}"`, { encoding: 'utf8' }));
      
      // Obtener commits recientes
      const commitsUrl = `${apiUrl}/commits?per_page=10`;
      const commitsData = JSON.parse(execSync(`curl -s "${commitsUrl}"`, { encoding: 'utf8' }));
      
      return {
        repository: repoData,
        releases: Array.isArray(releasesData) ? releasesData.slice(0, 5) : [],
        recentCommits: Array.isArray(commitsData) ? commitsData : []
      };
      
    } catch (error) {
      throw new Error(`Error obteniendo información del repositorio: ${error.message}`);
    }
  }

  async compareVersions(component, repoInfo) {
    const frozenVersion = component.freeze_version;
    const latestRelease = repoInfo.releases[0];
    
    if (!latestRelease) {
      return {
        hasNewVersion: false,
        frozenVersion,
        latestVersion: 'No releases found',
        versionsBehind: 0
      };
    }
    
    const latestVersion = latestRelease.tag_name;
    const releasesSinceFreeze = repoInfo.releases.filter(release => {
      const releaseDate = new Date(release.published_at);
      const freezeDate = new Date(component.freeze_date);
      return releaseDate > freezeDate;
    });
    
    return {
      hasNewVersion: releasesSinceFreeze.length > 0,
      frozenVersion,
      latestVersion,
      versionsBehind: releasesSinceFreeze.length,
      newReleases: releasesSinceFreeze.slice(0, 3), // Top 3 most recent
      latestReleaseDate: latestRelease.published_at
    };
  }

  async analyzeChanges(component, repoInfo, versionComparison) {
    const analysis = {
      summary: {
        hasUpdates: versionComparison.hasNewVersion,
        versionsBehind: versionComparison.versionsBehind,
        lastCheck: this.timestamp
      },
      security: {
        hasSecurityFixes: false,
        securityIssues: []
      },
      features: {
        hasNewFeatures: false,
        newFeatures: []
      },
      bugFixes: {
        hasBugFixes: false,
        bugFixes: []
      },
      breaking: {
        hasBreakingChanges: false,
        breakingChanges: []
      }
    };

    if (!versionComparison.hasNewVersion) {
      return analysis;
    }

    // Analizar releases
    for (const release of versionComparison.newReleases) {
      const releaseNotes = release.body || '';
      const releaseTitle = release.name || release.tag_name;
      
      // Detectar security fixes
      if (this.containsSecurityKeywords(releaseNotes + releaseTitle)) {
        analysis.security.hasSecurityFixes = true;
        analysis.security.securityIssues.push({
          version: release.tag_name,
          title: releaseTitle,
          date: release.published_at,
          notes: releaseNotes.substring(0, 200) + '...'
        });
      }
      
      // Detectar breaking changes
      if (this.containsBreakingKeywords(releaseNotes + releaseTitle)) {
        analysis.breaking.hasBreakingChanges = true;
        analysis.breaking.breakingChanges.push({
          version: release.tag_name,
          title: releaseTitle,
          date: release.published_at,
          notes: releaseNotes.substring(0, 200) + '...'
        });
      }
      
      // Detectar nuevas features
      if (this.containsFeatureKeywords(releaseNotes + releaseTitle)) {
        analysis.features.hasNewFeatures = true;
        analysis.features.newFeatures.push({
          version: release.tag_name,
          title: releaseTitle,
          date: release.published_at
        });
      }
      
      // Detectar bug fixes
      if (this.containsBugFixKeywords(releaseNotes + releaseTitle)) {
        analysis.bugFixes.hasBugFixes = true;
        analysis.bugFixes.bugFixes.push({
          version: release.tag_name,
          title: releaseTitle,
          date: release.published_at
        });
      }
    }

    return analysis;
  }

  containsSecurityKeywords(text) {
    const keywords = [
      'security', 'vulnerability', 'CVE-', 'exploit', 'patch',
      'security fix', 'security update', 'vulnerable', 'sanitize',
      'XSS', 'injection', 'authentication', 'authorization'
    ];
    
    return keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  containsBreakingKeywords(text) {
    const keywords = [
      'breaking change', 'breaking:', 'BREAKING:', 'breaking changes',
      'major version', 'major release', 'deprecated', 'removed',
      'no longer supported', 'migration guide', 'upgrade guide'
    ];
    
    return keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  containsFeatureKeywords(text) {
    const keywords = [
      'new feature', 'feature:', 'added', 'enhancement',
      'improvement', 'feat:', 'implement', 'introduce'
    ];
    
    return keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  containsBugFixKeywords(text) {
    const keywords = [
      'bug fix', 'fix:', 'fixed', 'bug:', 'resolve',
      'issue', 'problem', 'error', 'crash', 'correct'
    ];
    
    return keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  generateRecommendations(component, analysis) {
    let priority = 'LOW';
    let requiresAttention = false;
    let message = 'No hay actualizaciones importantes';
    let status = 'Up to date';

    if (!analysis.summary.hasUpdates) {
      return { priority, requiresAttention, message, status };
    }

    status = `${analysis.summary.versionsBehind} versions behind`;

    // Prioridad alta: Security fixes
    if (analysis.security.hasSecurityFixes) {
      priority = 'HIGH';
      requiresAttention = true;
      message = `🔐 Security fixes disponibles (${analysis.security.securityIssues.length} issues)`;
    }
    // Prioridad alta: Breaking changes (requiere evaluación)
    else if (analysis.breaking.hasBreakingChanges) {
      priority = 'HIGH';
      requiresAttention = true;
      message = `⚠️  Breaking changes detectados (${analysis.breaking.breakingChanges.length} changes)`;
    }
    // Prioridad media: Muchas versiones atrás
    else if (analysis.summary.versionsBehind >= 5) {
      priority = 'MEDIUM';
      requiresAttention = true;
      message = `📈 Componente muy desactualizado (${analysis.summary.versionsBehind} versions behind)`;
    }
    // Prioridad media: Nuevas features importantes
    else if (analysis.features.hasNewFeatures && analysis.features.newFeatures.length >= 3) {
      priority = 'MEDIUM';
      requiresAttention = true;
      message = `✨ Múltiples nuevas features disponibles (${analysis.features.newFeatures.length} features)`;
    }
    // Prioridad baja: Bug fixes menores
    else if (analysis.bugFixes.hasBugFixes) {
      priority = 'LOW';
      requiresAttention = true;
      message = `🐛 Bug fixes disponibles (${analysis.bugFixes.bugFixes.length} fixes)`;
    }

    return {
      priority,
      requiresAttention,
      message,
      status,
      recommendations: this.getSpecificRecommendations(analysis)
    };
  }

  getSpecificRecommendations(analysis) {
    const recommendations = [];

    if (analysis.security.hasSecurityFixes) {
      recommendations.push({
        action: 'EVALUATE_IMMEDIATELY',
        reason: 'Security fixes should be evaluated and adopted ASAP',
        priority: 'CRITICAL'
      });
    }

    if (analysis.breaking.hasBreakingChanges) {
      recommendations.push({
        action: 'DETAILED_ANALYSIS',
        reason: 'Breaking changes require careful evaluation of impact',
        priority: 'HIGH'
      });
    }

    if (analysis.summary.versionsBehind >= 10) {
      recommendations.push({
        action: 'MAJOR_UPDATE_EVALUATION',
        reason: 'Component is significantly behind, consider major update',
        priority: 'MEDIUM'
      });
    }

    if (analysis.features.hasNewFeatures) {
      recommendations.push({
        action: 'FEATURE_EVALUATION',
        reason: 'New features might provide business value',
        priority: 'LOW'
      });
    }

    return recommendations;
  }

  async generateReport() {
    const reportData = {
      tracking_run: {
        timestamp: this.timestamp,
        components_checked: this.notifications.length,
        notifications_generated: this.notifications.filter(n => n.type !== 'ERROR').length,
        errors: this.notifications.filter(n => n.type === 'ERROR').length
      },
      notifications: this.notifications,
      summary: {
        high_priority: this.notifications.filter(n => n.type === 'HIGH').length,
        medium_priority: this.notifications.filter(n => n.type === 'MEDIUM').length,
        low_priority: this.notifications.filter(n => n.type === 'LOW').length
      }
    };

    const reportPath = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'upstream-tracking-report.json');
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

    console.log(`📊 Reporte generado: ${reportPath}`);
  }

  showNotifications() {
    if (this.notifications.length === 0) {
      console.log('✅ Todos los componentes están actualizados');
      return;
    }

    console.log('\n🔔 NOTIFICACIONES DE UPSTREAM:');
    console.log('================================');

    const highPriority = this.notifications.filter(n => n.type === 'HIGH');
    const mediumPriority = this.notifications.filter(n => n.type === 'MEDIUM');
    const lowPriority = this.notifications.filter(n => n.type === 'LOW');
    const errors = this.notifications.filter(n => n.type === 'ERROR');

    if (highPriority.length > 0) {
      console.log('\n🔴 ALTA PRIORIDAD:');
      highPriority.forEach(n => {
        console.log(`   • ${n.component}: ${n.message}`);
      });
    }

    if (mediumPriority.length > 0) {
      console.log('\n🟡 MEDIA PRIORIDAD:');
      mediumPriority.forEach(n => {
        console.log(`   • ${n.component}: ${n.message}`);
      });
    }

    if (lowPriority.length > 0) {
      console.log('\n🟢 BAJA PRIORIDAD:');
      lowPriority.forEach(n => {
        console.log(`   • ${n.component}: ${n.message}`);
      });
    }

    if (errors.length > 0) {
      console.log('\n❌ ERRORES:');
      errors.forEach(n => {
        console.log(`   • ${n.component}: ${n.message}`);
      });
    }

    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('   1. Revisar el reporte detallado en docs/PROJECT/08_TOOLCHAIN_AND_SETUP/upstream-tracking-report.json');
    console.log('   2. Para componentes de alta prioridad, usar: node scripts/porte-decisions.js [component]');
    console.log('   3. Programar revisión regular de componentes de media/baja prioridad');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  let componentName = null;
  let checkAll = false;

  // Parsear argumentos
  for (const arg of args) {
    if (arg.startsWith('--component=')) {
      componentName = arg.split('=')[1];
    } else if (arg === '--check-all') {
      checkAll = true;
    }
  }

  const tracker = new UpstreamTracker();
  tracker.trackUpstream(componentName);
}

module.exports = UpstreamTracker;
